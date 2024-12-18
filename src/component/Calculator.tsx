import React, {useState, useEffect} from 'react';
import {iPokemonInfo, rawISleepFace, procCSleepFace, iResult, CalculatorProps} from '../types';
import pokemonInfoBase from '../db/pokemonInfo.json';
import Greengrass from '../db/greengrass1113.json';
import Cyan from '../db/cyan1113.json';
import Taupe from '../db/taupe1113.json';
import Snowdrop from '../db/snowdrop1113.json';
import Lapis from '../db/lapis1113.json';
import Gold from '../db/gold1113.json';
import LotteryConfig from '../db/lotteryConfig.json';
import jStat from 'jstat';

//全寝顔データ
const rawData: rawISleepFace[][] = [Greengrass, Cyan, Taupe, Snowdrop, Lapis, Gold];
// 基本データをjsonから参照(アプデ時に適宜修正)
const lastOmit: string[] = LotteryConfig.lastOmit;
const lastOmitRate: number = LotteryConfig.lastOmitRate;
const legend: string[] = LotteryConfig.legend;
const fieldConvert: Record<string, number> = LotteryConfig.fieldConvert;
// const fieldSize: number = LotteryConfig.fieldSize;
const pokemonInfo: Record<string, iPokemonInfo> = pokemonInfoBase.reduce(
  (acc, item) => {
    acc[item.pokemonName] = item; // pokemonNameをキーにしてオブジェクト全体を値に
    return acc;
  },
  {} as Record<string, iPokemonInfo>
);
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
//string型のものがstring[]型の要素のどれかと一致するかを確認する C++でいうsetでよくね？
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
  setChartTitle1,
  setChartTitle2,
  setChartSubTitle
}) => {
  let nowResult: iResult[] = [];
  let currentIndex = 0;
  const performCalculations = async (): Promise<iResult[]> => {
    setResult([]);
    nowResult = [];
    currentIndex = 0;

    //添え字に使うためフィールド名を数字に変換
    const fieldNumber: number = fieldConvert[fieldName];
    // pokemonNameの睡眠タイプとたねポケモンの名前
    const targetSleepType: string = pokemonInfo[pokemonName].sleepType;
    const targetSpeciesName: string = pokemonInfo[pokemonName].speciesName;

    let lotteryFaces: procCSleepFace[] = [];
    let lotteryFacesWo4: procCSleepFace[] = [];
    let lotteryFacesWoLe: procCSleepFace[] = [];
    let lotteryFacesWoLo: procCSleepFace[] = [];
    let lotteryFacesWo4WoLe: procCSleepFace[] = [];
    let lotteryFacesWo4WoLo: procCSleepFace[] = [];
    let lotteryFacesWoLeWoLo: procCSleepFace[] = [];
    let lotteryFacesWo4WoLeWoLo: procCSleepFace[] = [];

    for (let i = 0; i < rawData[fieldNumber].length; i++) {
      const isLegend: boolean = belongToVec(rawData[fieldNumber][i].speciesName, legend);
      const isLastOmit: boolean = belongToVec(rawData[fieldNumber][i].speciesName, lastOmit);
      if (rawData[fieldNumber][i].sleepType === targetSleepType && rawData[fieldNumber][i].energy < energy) {
        const NP = rawData[fieldNumber][i].np;
        const energy = rawData[fieldNumber][i].energy;
        const ID = rawData[fieldNumber][i].ID;
        const name = rawData[fieldNumber][i].pokemonName; //pokemonName→name
        const rarity = rawData[fieldNumber][i].rarity;
        const expCandy = rawData[fieldNumber][i].expCandy;
        const researchExp = rawData[fieldNumber][i].researchExp;
        const dreamShard = rawData[fieldNumber][i].dreamShard;
        const speciesName = rawData[fieldNumber][i].speciesName; //種ポケモンの名前

        lotteryFaces.push(
          new procCSleepFace(NP, energy, ID, name, rarity, expCandy, researchExp, dreamShard, speciesName)
        );
        if (rawData[fieldNumber][i].rarity != 4)
          lotteryFacesWo4.push(
            new procCSleepFace(NP, energy, ID, name, rarity, expCandy, researchExp, dreamShard, speciesName)
          );
        if (!isLegend)
          lotteryFacesWoLe.push(
            new procCSleepFace(NP, energy, ID, name, rarity, expCandy, researchExp, dreamShard, speciesName)
          );
        if (!isLastOmit)
          lotteryFacesWoLo.push(
            new procCSleepFace(NP, energy, ID, name, rarity, expCandy, researchExp, dreamShard, speciesName)
          );
        if (rawData[fieldNumber][i].rarity != 4 && !isLegend)
          lotteryFacesWo4WoLe.push(
            new procCSleepFace(NP, energy, ID, name, rarity, expCandy, researchExp, dreamShard, speciesName)
          );
        if (rawData[fieldNumber][i].rarity != 4 && !isLastOmit)
          lotteryFacesWo4WoLo.push(
            new procCSleepFace(NP, energy, ID, name, rarity, expCandy, researchExp, dreamShard, speciesName)
          );
        if (!isLegend && !isLastOmit)
          lotteryFacesWoLeWoLo.push(
            new procCSleepFace(NP, energy, ID, name, rarity, expCandy, researchExp, dreamShard, speciesName)
          );
        if (rawData[fieldNumber][i].rarity != 4 && !isLegend && !isLastOmit)
          lotteryFacesWo4WoLeWoLo.push(
            new procCSleepFace(NP, energy, ID, name, rarity, expCandy, researchExp, dreamShard, speciesName)
          );
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
      let ev: number[] = [];
      let leastOne: number = 0;
      let expCandy: number = 0;
      let researchExp: number = 0;
      let dreamShard: number = 0;
      const updateParameter = (vec: procCSleepFace[], index: number) => {
        if (vec[index].speciesName === targetSpeciesName) expCandy += vec[index].expCandy;
        researchExp += vec[index].researchExp;
        dreamShard += vec[index].dreamShard;
      };
      for (let j = 0; j < trialNumber; j++) {
        let encount: number = 0;
        let encount4: boolean = false;
        let encountLegend: boolean = false;
        let remainNP: number = i;
        for (let k = 0; k < numDraws; k++) {
          if (remainNP < lotteryFaces[0].NP) {
            //絶食
            const index = 0;
            if (lotteryFaces[index].name === pokemonName) encount++;
            updateParameter(lotteryFaces, index);
          } else {
            if (k != numDraws - 1) {
              //通常
              if (!encount4 && !encountLegend) {
                //おなかのうえ未出現、伝説未遭遇
                const exindex: number = specialBinarySearch1(lotteryFaces, remainNP);
                const index: number = randomNumber(exindex);
                if (lotteryFaces[index].rarity === 4) encount4 = true;
                encountLegend = belongToVec(lotteryFaces[index].name, legend);
                if (lotteryFaces[index].name === pokemonName) encount++;
                updateParameter(lotteryFaces, index);
                remainNP -= lotteryFaces[index].NP;
              } else if (!encount4 && encountLegend) {
                //おなかのうえ未出現、伝説遭遇
                const exindex: number = specialBinarySearch1(lotteryFacesWoLe, remainNP);
                const index: number = randomNumber(exindex);
                if (lotteryFacesWoLe[index].rarity === 4) encount4 = true;
                if (lotteryFacesWoLe[index].name === pokemonName) encount++;
                updateParameter(lotteryFacesWoLe, index);
                remainNP -= lotteryFacesWoLe[index].NP;
              } else if (encount4 && !encountLegend) {
                //おなかのうえ出現、伝説未遭遇
                const exindex = specialBinarySearch1(lotteryFacesWo4, remainNP);
                const index = randomNumber(exindex);
                encountLegend = belongToVec(lotteryFacesWo4[index].name, legend);
                if (lotteryFacesWo4[index].name === pokemonName) encount++;
                updateParameter(lotteryFacesWo4, index);
                remainNP -= lotteryFacesWo4[index].NP;
              } else if (encount4 && encountLegend) {
                //おなかのうえ出現、伝説遭遇
                const exindex = specialBinarySearch1(lotteryFacesWo4WoLe, remainNP);
                const index = randomNumber(exindex);
                if (lotteryFacesWo4WoLe[index].name === pokemonName) encount++;
                updateParameter(lotteryFacesWo4WoLe, index);
                remainNP -= lotteryFacesWo4WoLe[index].NP;
              }
            } else {
              // 飴夢欠片未実装
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
                  updateParameter(lotteryFacesWoLo, index2);
                } else {
                  if (lotteryFaces[index].name === pokemonName) encount++;
                  updateParameter(lotteryFaces, index);
                }
              } else if (!encount4 && encountLegend) {
                //おなかのうえ未出現、伝説遭遇
                const index: number = specialBinarySearch2(lotteryFacesWoLe, remainNP);
                const encountLastOmit: boolean = belongToVec(lotteryFacesWoLe[index].name, lastOmit);
                if (encountLastOmit && redraw) {
                  //名前が除外枠かつそのうち80%再抽選する
                  const index2: number = specialBinarySearch2(lotteryFacesWoLeWoLo, remainNP);
                  if (lotteryFacesWoLeWoLo[index2].name === pokemonName) encount++;
                  updateParameter(lotteryFacesWoLeWoLo, index2);
                } else {
                  if (lotteryFacesWoLe[index].name === pokemonName) encount++;
                  updateParameter(lotteryFacesWoLe, index);
                }
              } else if (encount4 && !encountLegend) {
                //おなかのうえ出現、伝説未遭遇
                const index: number = specialBinarySearch2(lotteryFacesWo4, remainNP);
                const encountLastOmit: boolean = belongToVec(lotteryFacesWo4[index].name, lastOmit);
                if (encountLastOmit && redraw) {
                  //名前が除外枠かつそのうち80%再抽選する
                  const index2: number = specialBinarySearch2(lotteryFacesWo4WoLo, remainNP);
                  if (lotteryFacesWo4WoLo[index2].name === pokemonName) encount++;
                  updateParameter(lotteryFacesWo4WoLo, index2);
                } else {
                  if (lotteryFacesWo4[index].name === pokemonName) encount++;
                  updateParameter(lotteryFacesWo4, index);
                }
              } else if (encount4 && encountLegend) {
                //おなかのうえ出現、伝説遭遇
                const index: number = specialBinarySearch2(lotteryFacesWo4WoLe, remainNP);
                const encountLastOmit: boolean = belongToVec(lotteryFacesWo4WoLe[index].name, lastOmit);
                if (encountLastOmit && redraw) {
                  //名前が除外枠かつそのうち80%再抽選する
                  const index2: number = specialBinarySearch2(lotteryFacesWo4WoLeWoLo, remainNP);
                  if (lotteryFacesWo4WoLeWoLo[index2].name === pokemonName) encount++;
                  updateParameter(lotteryFacesWo4WoLeWoLo, index2);
                } else {
                  if (lotteryFacesWo4WoLe[index].name === pokemonName) encount++;
                  updateParameter(lotteryFacesWo4WoLe, index);
                }
              }
            }
          }
        }
        if (encount >= 1) leastOne++;
        ev.push(encount);
      }
      leastOne /= trialNumber;
      const {upper: evUp} = confidenceInterval(ev);
      const {lower: evLow} = confidenceInterval(ev);
      expCandy /= trialNumber;
      researchExp /= trialNumber;
      dreamShard /= trialNumber;
      const {evForGrid: evForGrid} = confidenceInterval(ev);
      nowResult.push({
        np: i, // ねむけパワー
        ev: parseFloat(jStat.mean(ev).toFixed(5)), // 期待値
        leastOne: parseFloat(leastOne.toFixed(5)), // 1体以上
        evUp: parseFloat(evUp.toFixed(5)),
        evLow: parseFloat(evLow.toFixed(5)),
        expCandy: parseFloat(expCandy.toFixed(5)),
        researchExp: parseFloat(researchExp.toFixed(2)),
        dreamShard: parseFloat(dreamShard.toFixed(2)),
        evForGrid: evForGrid
      });
      currentIndex++;
    }
    return nowResult;
  };

  useEffect(() => {
    if (!calculatorOrder) return;
    // 非同期処理をトリガー
    const startCalculations = async () => {
      const intervalId = setInterval(() => {
        setResult([...nowResult]); // 中間結果を更新
        currentIndex++;
      }, 1000);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5秒待つ
        nowResult = await performCalculations(); // 計算を実行
      } finally {
        clearInterval(intervalId); // Intervalをクリア
        setChartTitle1([pokemonName + ' (' + fieldName + ', EP=' + energy + ') の', '出現期待値と1体以上出現確率']);
        setChartTitle2([
          pokemonName + ' (' + fieldName + ', EP=' + energy + ') の',
          'アメの個数とリサーチEXPとゆめのかけら獲得量'
        ]);
        setChartSubTitle('各NPの試行回数: ' + trialNumber + ', NP間隔: ' + intervalNP + ', 作成者: 擬き');
        setResult(nowResult); // 最終結果を設定
        setCalculatorOrder(false); // 計算終了を通知
      }
    };

    startCalculations();
  }, [calculatorOrder]);

  return <div className="Calculator"></div>;
};

export default Calculator;
