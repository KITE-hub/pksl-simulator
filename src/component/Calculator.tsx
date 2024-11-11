import React, {useState, useEffect} from 'react';
import {rawISleepFace, procCSleepFace, iResult, CalculatorProps} from '../types';
import Greengrass from '../db/greengrass0925.json';
import Cyan from '../db/cyan0925.json';
import Taupe from '../db/taupe0925.json';
import Snowdrop from '../db/snowdrop0925.json';
import Lapis from '../db/lapis0925.json';
import LotteryConfig from '../db/lotteryConfig.json';
import jStat from 'jstat';

//全寝顔データ
const rawData: rawISleepFace[][] = [Greengrass, Cyan, Taupe, Snowdrop, Lapis];
// 基本データをjsonから参照(アプデ時に適宜修正)
const lastOmit: string[] = LotteryConfig.lastOmit;
const lastOmitRate: number = LotteryConfig.lastOmitRate;
const legend: string[] = LotteryConfig.legend;
const fieldConvert: Record<string, number> = LotteryConfig.fieldConvert;
// const fieldSize: number = LotteryConfig.fieldSize;
const parseDraws = (data: any[][][]): [number, number][][] =>
  data.map((row) => row.map(([num, val]) => [num, val === 'Infinity' ? Infinity : val] as [number, number]));
const draws: [number, number][][] = parseDraws(LotteryConfig.draws);

// 最終枠以外の二分探索する関数(vec[index].NP <= npを満たす最大(=一番右側)のindexを求める)
const specialBinarySearch1 = (vec: procCSleepFace[], np: number): number => {
  let left = 0;
  let right = vec.length - 1;
  let result = 0; // 条件を満たすインデックスが見つからなかった場合
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (vec[mid].NP <= np) {
      result = mid; // 条件を満たすので、結果を更新
      left = mid + 1; // さらに右側を探索
    } else {
      right = mid - 1; // 左側を探索
    }
  }
  return result; // 最終的なインデックスを返す
};

// 最終枠の二分探索する関数(np以下での最大のnp(=npmax)を求め、npmax以上(vec[index].NP>=npmax)を満たす最小のindexを求める)
const specialBinarySearch2 = (vec: procCSleepFace[], np: number) => {
  // Step 1: 二分探索を用いて np 以下の最大の vec[index].NP を求める
  const index = specialBinarySearch1(vec, np);
  const npmax = vec[index].NP;
  // Step 2: npmax 以上の最小の index を見つける
  let left = 0;
  let right = vec.length - 1;
  let resultIndex = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (vec[mid].NP >= npmax) {
      resultIndex = mid; // ポテンシャルな解を記録
      right = mid - 1; // 範囲を左側に絞る
    } else {
      left = mid + 1; // 範囲を右側に絞る
    }
  }
  return resultIndex;
};
//string型のものがstring[]型の要素のどれかと一致するかを確認する
const belongToVec = (name: string, vec: string[]): boolean => {
  let judge: boolean = false;
  for (let i = 0; i < vec.length; i++) {
    if (vec[i] === name) {
      judge = true;
      break;
    }
  }
  return judge;
};
// lastOmitRateの確率でtrueを返す乱数
const mayBeTrue = (): boolean => Math.random() < lastOmitRate;
// 乱数生成
const randomNumber = (max: number): number => Math.floor(Math.random() * (max + 1));
const confidenceInterval = (tStudy: number[]): {lower: number; upper: number; evForGrid: string} => {
  const mean = jStat.mean(tStudy);
  const stdDev = jStat.stdev(tStudy, true); // 標本標準偏差
  const n = tStudy.length;
  const standardError = stdDev / Math.sqrt(n);

  // 95%信頼区間のためのt値を計算
  const alpha = 0.05;
  const tValue = jStat.studentt.inv(1 - alpha / 2, n - 1); // 自由度 n-1 でのt値

  // 信頼区間の範囲を求める
  const marginOfError = tValue * standardError;

  return {
    lower: mean - marginOfError,
    upper: mean + marginOfError,
    evForGrid: parseFloat(mean.toFixed(5)) + ' ± ' + parseFloat(marginOfError.toFixed(5))
  };
};
//計算
const Calculator: React.FC<CalculatorProps> = ({
  pokemonName,
  fieldName,
  energy,
  limitNP,
  trialNumber,
  startNP,
  intervalNP,
  calculatorOrder,
  setCalculatorOrder,
  setResult,
  setChartTitle,
  setChartSubTitle
}) => {
  // 出力欄のグラフの横軸用用にnpを規格化(?)する
  const [normalizeValue, setNormalizeValue] = useState<number>(1);
  const [normalizeChar, setNormalizeChar] = useState<string>('');

  useEffect(() => {
    if (!calculatorOrder) return;
    let nowResult: iResult[] = [];
    let currentIndex = 0; // 現在のインデックスをトラッキング

    // chartの横軸表示
    if (limitNP < 10000) {
      setNormalizeValue(1);
      setNormalizeChar('');
    } else if (limitNP < 1e8) {
      setNormalizeValue(10000);
      setNormalizeChar('万');
    } else {
      setNormalizeValue(100000000);
      setNormalizeChar('億');
    }

    // 期待値の最大値関係、evup,evlowはあと回し
    const performCalculations = async () => {
      setResult([]);
      nowResult = [];

      //添え字に使うためフィールド名を数字に変換
      const fieldNumber: number = fieldConvert[fieldName];
      // 睡眠タイプ特定 ポケモン名がフィールドにいないときの処理を考える うまくいかん
      let targetSleepType: string = '';
      for (let i = 0; i < rawData[fieldNumber].length; i++) {
        if (rawData[fieldNumber][i].pokemonName === pokemonName) {
          targetSleepType = rawData[fieldNumber][i].sleepType;
          break;
        }
      }
      if (targetSleepType === '') targetSleepType = 'うとうと'; //フィールド内にポケモンがいないときに結果を0にする

      let lotteryFaces: procCSleepFace[] = [];
      let lotteryFacesWo4: procCSleepFace[] = [];
      let lotteryFacesWoLe: procCSleepFace[] = [];
      let lotteryFacesWoLo: procCSleepFace[] = [];
      let lotteryFacesWo4WoLe: procCSleepFace[] = [];
      let lotteryFacesWo4WoLo: procCSleepFace[] = [];
      let lotteryFacesWoLeWoLo: procCSleepFace[] = [];
      let lotteryFacesWo4WoLeWoLo: procCSleepFace[] = [];

      for (let i = 0; i < rawData[fieldNumber].length; i++) {
        const isLegend: boolean = belongToVec(rawData[fieldNumber][i].pokemonName, legend);
        const isLastOmit: boolean = belongToVec(rawData[fieldNumber][i].pokemonName, lastOmit);
        if (rawData[fieldNumber][i].sleepType === targetSleepType && rawData[fieldNumber][i].energy < energy) {
          const NP = rawData[fieldNumber][i].np; //後で修正
          const energy = rawData[fieldNumber][i].energy;
          const internalID = rawData[fieldNumber][i].internalID;
          const name = rawData[fieldNumber][i].pokemonName;
          const ID = rawData[fieldNumber][i].rarity;

          lotteryFaces.push(new procCSleepFace(NP, energy, internalID, name, ID));
          if (rawData[fieldNumber][i].rarity != 4)
            lotteryFacesWo4.push(new procCSleepFace(NP, energy, internalID, name, ID));
          if (!isLegend) lotteryFacesWoLe.push(new procCSleepFace(NP, energy, internalID, name, ID));
          if (!isLastOmit) lotteryFacesWoLo.push(new procCSleepFace(NP, energy, internalID, name, ID));
          if (rawData[fieldNumber][i].rarity != 4 && !isLegend)
            lotteryFacesWo4WoLe.push(new procCSleepFace(NP, energy, internalID, name, ID));
          if (rawData[fieldNumber][i].rarity != 4 && !isLastOmit)
            lotteryFacesWo4WoLo.push(new procCSleepFace(NP, energy, internalID, name, ID));
          if (!isLegend && !isLastOmit) lotteryFacesWoLeWoLo.push(new procCSleepFace(NP, energy, internalID, name, ID));
          if (rawData[fieldNumber][i].rarity != 4 && !isLegend && !isLastOmit)
            lotteryFacesWo4WoLeWoLo.push(new procCSleepFace(NP, energy, internalID, name, ID));
        }
      }
      lotteryFaces.sort(procCSleepFace.compare);
      lotteryFacesWo4.sort(procCSleepFace.compare);
      lotteryFacesWoLe.sort(procCSleepFace.compare);
      lotteryFacesWoLo.sort(procCSleepFace.compare);
      lotteryFacesWo4WoLe.sort(procCSleepFace.compare);
      lotteryFacesWo4WoLo.sort(procCSleepFace.compare);
      lotteryFacesWoLeWoLo.sort(procCSleepFace.compare);
      lotteryFacesWo4WoLeWoLo.sort(procCSleepFace.compare);

      let draftNumDraws: number = 0;
      //寝顔抽選
      for (let i = startNP; i <= limitNP; i += intervalNP) {
        while (i >= draws[fieldNumber][draftNumDraws + 1][1]) {
          draftNumDraws++; //尺取り法でNPに対する出現数決定
        }
        const numDraws: number = draws[fieldNumber][draftNumDraws][0];
        let leastOne: number = 0;
        let ev: number[] = [];
        for (let j = 0; j < trialNumber; j++) {
          let encount: number = 0;
          let encount4: boolean = false;
          let encountLegend: boolean = false;
          let remainNP: number = i;
          for (let k = 0; k < numDraws; k++) {
            if (remainNP < lotteryFaces[0].NP) {
              //絶食
              if (lotteryFaces[0].name === pokemonName) encount++;
            } else {
              if (k != numDraws - 1) {
                //通常
                if (!encount4 && !encountLegend) {
                  //おなかのうえ未出現、伝説未遭遇
                  const exindex: number = specialBinarySearch1(lotteryFaces, remainNP);
                  const index: number = randomNumber(exindex);
                  if (lotteryFaces[index].ID === 4) encount4 = true;
                  encountLegend = belongToVec(lotteryFaces[index].name, legend);
                  if (lotteryFaces[index].name === pokemonName) encount++;
                  remainNP -= lotteryFaces[index].NP;
                } else if (!encount4 && encountLegend) {
                  //おなかのうえ未出現、伝説遭遇
                  const exindex: number = specialBinarySearch1(lotteryFacesWoLe, remainNP);
                  const index: number = randomNumber(exindex);
                  if (lotteryFacesWoLe[index].ID === 4) encount4 = true;
                  if (lotteryFacesWoLe[index].name === pokemonName) encount++;
                  remainNP -= lotteryFacesWoLe[index].NP;
                } else if (encount4 && !encountLegend) {
                  //おなかのうえ出現、伝説未遭遇
                  const exindex = specialBinarySearch1(lotteryFacesWo4, remainNP);
                  const index = randomNumber(exindex);
                  encountLegend = belongToVec(lotteryFacesWo4[index].name, legend);
                  if (lotteryFacesWo4[index].name === pokemonName) encount++;
                  remainNP -= lotteryFacesWo4[index].NP;
                } else if (encount4 && encountLegend) {
                  //おなかのうえ出現、伝説遭遇
                  const exindex = specialBinarySearch1(lotteryFacesWo4WoLe, remainNP);
                  const index = randomNumber(exindex);
                  if (lotteryFacesWo4WoLe[index].name === pokemonName) encount++;
                  remainNP -= lotteryFacesWo4WoLe[index].NP;
                }
              } else {
                //最終枠
                const redraw: boolean = mayBeTrue();
                if (!encount4 && !encountLegend) {
                  //おなかのうえ未出現、伝説未遭遇
                  const index: number = specialBinarySearch2(lotteryFaces, remainNP);
                  const encountLastOmit: boolean = belongToVec(lotteryFaces[index].name, lastOmit);
                  if (encountLastOmit && redraw) {
                    //名前が除外枠かつそのうち80%再抽選する
                    const index2: number = specialBinarySearch2(lotteryFacesWoLo, remainNP);
                    if (lotteryFacesWoLo[index2].name === pokemonName) encount++;
                  } else {
                    if (lotteryFaces[index].name === pokemonName) encount++;
                  }
                } else if (!encount4 && encountLegend) {
                  //おなかのうえ未出現、伝説遭遇
                  const index: number = specialBinarySearch2(lotteryFacesWoLe, remainNP);
                  const encountLastOmit: boolean = belongToVec(lotteryFacesWoLe[index].name, lastOmit);
                  if (encountLastOmit && redraw) {
                    //名前が除外枠かつそのうち80%再抽選する
                    const index2: number = specialBinarySearch2(lotteryFacesWoLeWoLo, remainNP);
                    if (lotteryFacesWoLeWoLo[index2].name === pokemonName) encount++;
                  } else {
                    if (lotteryFacesWoLe[index].name === pokemonName) encount++;
                  }
                } else if (encount4 && !encountLegend) {
                  //おなかのうえ出現、伝説未遭遇
                  const index: number = specialBinarySearch2(lotteryFacesWo4, remainNP);
                  const encountLastOmit: boolean = belongToVec(lotteryFacesWo4[index].name, lastOmit);
                  if (encountLastOmit && redraw) {
                    //名前が除外枠かつそのうち80%再抽選する
                    const index2: number = specialBinarySearch2(lotteryFacesWo4WoLo, remainNP);
                    if (lotteryFacesWo4WoLo[index2].name === pokemonName) encount++;
                  } else {
                    if (lotteryFacesWo4[index].name === pokemonName) encount++;
                  }
                } else if (encount4 && encountLegend) {
                  //おなかのうえ出現、伝説遭遇
                  const index: number = specialBinarySearch2(lotteryFacesWo4WoLe, remainNP);
                  const encountLastOmit: boolean = belongToVec(lotteryFacesWo4WoLe[index].name, lastOmit);
                  if (encountLastOmit && redraw) {
                    //名前が除外枠かつそのうち80%再抽選する
                    const index2: number = specialBinarySearch2(lotteryFacesWo4WoLeWoLo, remainNP);
                    if (lotteryFacesWo4WoLeWoLo[index2].name === pokemonName) encount++;
                  } else {
                    if (lotteryFacesWo4WoLe[index].name === pokemonName) encount++;
                  }
                }
              }
            }
          }
          if (encount >= 1) leastOne++;
          ev.push(encount);
        }
        const npXAxis: number = i / normalizeValue;
        leastOne /= trialNumber;
        const {upper: evUp} = confidenceInterval(ev);
        const {lower: evLow} = confidenceInterval(ev);
        const {evForGrid: evForGrid} = confidenceInterval(ev);
        nowResult.push({
          npXAxis: npXAxis,
          np: i, // ねむけパワー
          ev: jStat.mean(ev), // 期待値
          leastOne: leastOne, // 1体以上
          evUp: evUp,
          evLow: evLow,
          evForGrid: evForGrid,
          leastOneForGrid: parseFloat(leastOne.toFixed(5))
        });
        currentIndex++;
      }
    };
    // 計算を開始
    performCalculations();

    const intervalId = setInterval(() => {
      setResult([...nowResult]); // 現在の結果を更新

      if (currentIndex >= Math.ceil((limitNP - startNP) / intervalNP)) {
        clearInterval(intervalId); // 計算が完了したらタイマーをクリア
        setCalculatorOrder(false); // 計算が完了したことをマーク
      }
    }, 500);

    // クリーンアップ関数：コンポーネントがアンマウントされたときにIntervalをクリア
    return () => {
      clearInterval(intervalId);
      setCalculatorOrder(false);
      setChartTitle([pokemonName + ' (' + fieldName + ', EP=' + energy + ') の', '出現期待値と1体以上出現確率']);
      setChartSubTitle('各NPの試行回数: ' + trialNumber + ', NP間隔: ' + intervalNP + ', 作成者:?');
    };
  }, [calculatorOrder]); // 依存配列は空にして、初回マウント時のみ実行

  return <div className="Calculator"></div>;
};

export default Calculator;
