import React, {useEffect} from 'react';
import {iPokemonInfo, rawISleepFace, procCSleepFace, iResult, iResultDetail, CalculatorProps} from '../types';
import pokemonInfoBase from '../db/pokemonInfo.json';
import Greengrass from '../db/greengrass.json';
import Cyan from '../db/cyan.json';
import Taupe from '../db/taupe.json';
import Snowdrop from '../db/snowdrop.json';
import Lapis from '../db/lapis.json';
import Gold from '../db/gold.json';
import lotteryConfig from '../db/other/lotteryConfig.json';
import lotteryConfig2 from '../db/other/lotteryConfig2.json';
import jStat from 'jstat';

//全寝顔データ
const rawData: rawISleepFace[][][] = [Greengrass, Cyan, Taupe, Snowdrop, Lapis, Gold];
// 基本データをjsonから参照(アプデ時に適宜修正)
const lastOmitRate: number = lotteryConfig2.lastOmitRate;
const legend = new Set<string>(lotteryConfig.legend);
const fieldConvert: Record<string, number> = lotteryConfig2.fieldConvert;
const sleepTypeConvert: Record<string, number> = lotteryConfig2.sleepTypeConvert;
const pokemonInfo: Record<string, iPokemonInfo> = pokemonInfoBase.reduce(
  (acc, item) => {
    acc[item.pokemonName] = item; // pokemonNameをキーにしてオブジェクト全体を値に
    return acc;
  },
  {} as Record<string, iPokemonInfo>
);
const parseDraws = (data: any[][][]): [number, number][][] =>
  data.map((row) => row.map(([num, val]) => [num, val === 'Infinity' ? Infinity : val] as [number, number]));
const draws: [number, number][][] = parseDraws(lotteryConfig2.draws);

// 2ヶ月以上経っていなかったらtrue
const hasElapsed = (releaseDate: Date): boolean => {
  const now = new Date(); // 現在の日時
  const twoMonthsLater = new Date(releaseDate);
  twoMonthsLater.setMonth(releaseDate.getMonth() + 2); // releaseDateの2か月後を計算
  return twoMonthsLater > now;
};

// 寝顔が最終枠の除外対象かを判定
const judgeLastOmit = (face: procCSleepFace): boolean =>
  face.speciesName === 'ピィ' || legend.has(face.name) || hasElapsed(face.releaseDate);

// 最終枠以外の二分探索する関数(vec[index].NP <= npを満たす最大(=一番右側)のindexを求める)
const specialBinarySearch1 = (vec: procCSleepFace[], np: number): number => {
  let left: number = 0;
  let right: number = vec.length - 1;
  let result: number = 0; // 条件を満たすインデックスが見つからなかった場合
  while (left <= right) {
    const mid: number = Math.floor((left + right) / 2);
    if (vec[mid].NP <= np) {
      result = mid; // 条件を満たすので、結果を更新
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result; // 最終的なインデックスを返す
};

// 最終枠の二分探索する関数(np以下での最大のnp(=npmax)を求め、npmax以上(vec[index].NP>=npmax)を満たす最小のindexを求める)
const specialBinarySearch2 = (vec: procCSleepFace[], np: number): number => {
  // np 以下の最大の vec[index].NP を求める
  const index = specialBinarySearch1(vec, np);
  const npmax = vec[index].NP;
  // npmax 以上の最小の index を見つける
  let left = 0;
  let right = index;
  let resultIndex = 0;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (vec[mid].NP >= npmax) {
      resultIndex = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return resultIndex;
};

// lastOmitRateの確率でtrueを返す乱数
const mayBeTrue = (): boolean => Math.random() < lastOmitRate;

// 乱数生成
const randomNumber = (max: number): number => Math.floor(Math.random() * (max + 1));

const confidenceInterval = (tStudy: number[]): {lower: number; upper: number; evMargin: number} => {
  const mean = jStat.mean(tStudy);
  const stdDev = jStat.stdev(tStudy, true); // 標本標準偏差
  const n = tStudy.length;
  const standardError = stdDev / Math.sqrt(n);
  const alpha = 0.05; // 95%信頼区間のためのt値を計算
  const tValue = jStat.studentt.inv(1 - alpha / 2, n - 1); // 自由度 n-1 でのt値
  const marginOfError = tValue * standardError; // 信頼区間の範囲を求める
  return {
    lower: mean - marginOfError,
    upper: mean + marginOfError,
    evMargin: marginOfError
  };
};

//計算
const Calculator: React.FC<CalculatorProps> = ({
  pokemonName,
  fieldName,
  targetEnergy,
  targetLimitNP,
  targetTrialNumber,
  targetStartNP,
  targetIntervalNP,
  calculatorOrder,
  setCalculatorOrder,
  setResult,
  setChartText
}) => {
  let nowResult: iResult[] = [];

  const performCalculations = async (): Promise<iResult[]> => {
    setResult([]);
    nowResult = [];

    // pokemonNameの睡眠タイプとたねポケモンの名前
    const targetSleepType: string = pokemonInfo[pokemonName].sleepType;
    const targetSpeciesName: string = pokemonInfo[pokemonName].speciesName;
    //添え字に使うためフィールド名と睡眠タイプを数字に変換
    const fieldNumber: number = fieldConvert[fieldName];
    const targetSleepTypeNumber: number = sleepTypeConvert[targetSleepType];
    //Le:伝説, Lo:最終枠除外(last omit), St:おなかのうえ寝 (stomach)
    let lotteryFaces: procCSleepFace[] = [];
    let lotteryFacesWoSt: procCSleepFace[] = [];
    let lotteryFacesWoLe: procCSleepFace[] = [];
    let lotteryFacesWoLo: procCSleepFace[] = [];
    let lotteryFacesWoStWoLe: procCSleepFace[] = [];
    let lotteryFacesWoStWoLo: procCSleepFace[] = [];
    let lotteryFacesWoLeWoLo: procCSleepFace[] = [];
    let lotteryFacesWoStWoLeWoLo: procCSleepFace[] = [];

    for (let i = 0; i < rawData[fieldNumber][targetSleepTypeNumber].length; i++) {
      if (rawData[fieldNumber][targetSleepTypeNumber][i].energy < targetEnergy) {
        const NP = rawData[fieldNumber][targetSleepTypeNumber][i].np;
        const energy = rawData[fieldNumber][targetSleepTypeNumber][i].energy;
        const ID = rawData[fieldNumber][targetSleepTypeNumber][i].ID;
        const name = rawData[fieldNumber][targetSleepTypeNumber][i].pokemonName; //pokemonName→name
        const rarity = rawData[fieldNumber][targetSleepTypeNumber][i].rarity;
        const sleepFaceName = rawData[fieldNumber][targetSleepTypeNumber][i].sleepFaceName;
        const expCandy = rawData[fieldNumber][targetSleepTypeNumber][i].expCandy;
        const researchExp = rawData[fieldNumber][targetSleepTypeNumber][i].researchExp;
        const dreamShard = rawData[fieldNumber][targetSleepTypeNumber][i].dreamShard;
        const speciesName = pokemonInfo[name].speciesName; //種ポケモンの名前
        const releaseDateBase = rawData[fieldNumber][targetSleepTypeNumber][i].releaseDate;
        const releaseDate = new Date(releaseDateBase);
        const newFace = new procCSleepFace(
          NP,
          energy,
          ID,
          name,
          rarity,
          sleepFaceName,
          expCandy,
          researchExp,
          dreamShard,
          speciesName,
          releaseDate
        );

        const isOnStom: boolean = sleepFaceName === 'おなかのうえ寝';
        const isLegend: boolean = legend.has(name);
        const isLastOmit: boolean = judgeLastOmit(newFace);

        lotteryFaces.push(newFace);
        if (!isOnStom) lotteryFacesWoSt.push(newFace);
        if (!isLegend) lotteryFacesWoLe.push(newFace);
        if (!isLastOmit) lotteryFacesWoLo.push(newFace);
        if (!isOnStom && !isLegend) lotteryFacesWoStWoLe.push(newFace);
        if (!isOnStom && !isLastOmit) lotteryFacesWoStWoLo.push(newFace);
        if (!isLegend && !isLastOmit) lotteryFacesWoLeWoLo.push(newFace);
        if (!isOnStom && !isLegend && !isLastOmit) lotteryFacesWoStWoLeWoLo.push(newFace);
      }
    }

    let draftNumDraws: number = 0;
    //寝顔抽選
    for (let i = targetStartNP; i <= targetLimitNP; i += targetIntervalNP) {
      while (i >= draws[fieldNumber][draftNumDraws + 1][1]) {
        draftNumDraws++; //尺取り法でNPに対する出現数決定
      }
      const numDraws: number = draws[fieldNumber][draftNumDraws][0];
      let ev: number[] = [];
      let leastOne: number, expCandy: number, researchExp: number, dreamShard: number;
      leastOne = expCandy = researchExp = dreamShard = 0;
      let details = new Map<string, [number, number, number]>();
      const incrementDetails = (vec: procCSleepFace[], index: number) => {
        // 遭遇した寝顔名をdetailsに追加
        if (vec[index].name === pokemonName) {
          const key = `${vec[index].sleepFaceName}(☆${vec[index].rarity})`;
          const currentValue = details.get(key) ?? [0, 0]; // 未登録なら [0, 0] を取得
          details.set(key, [currentValue[0] + 1, currentValue[1], vec[index].NP]); // インクリメントして登録
        }
      };
      const updateParameter = (vec: procCSleepFace[], index: number) => {
        if (vec[index].speciesName === targetSpeciesName) expCandy += vec[index].expCandy;
        researchExp += vec[index].researchExp;
        dreamShard += vec[index].dreamShard;
      };
      for (let j = 0; j < targetTrialNumber; j++) {
        let encount: number = 0;
        let encountStom: boolean = false;
        let encountLegend: boolean = false;
        let encountFaceList = new Set<string>(); //detailsのleastOneに使う
        let remainNP: number = i;
        for (let k = 0; k < numDraws; k++) {
          if (remainNP < lotteryFaces[0].NP) {
            //絶食
            const index = 0;
            if (lotteryFaces[index].name === pokemonName) {
              encount++;
              encountFaceList.add(`${lotteryFaces[index].sleepFaceName}(☆${lotteryFaces[index].rarity})`);
            }
            incrementDetails(lotteryFaces, index);
            updateParameter(lotteryFaces, index);
          } else {
            if (k != numDraws - 1) {
              //通常
              if (!encountStom && !encountLegend) {
                //おなかのうえ未出現、伝説未遭遇
                const exindex: number = specialBinarySearch1(lotteryFaces, remainNP);
                const index: number = randomNumber(exindex);
                if (lotteryFaces[index].sleepFaceName === 'おなかのうえ寝') encountStom = true;
                encountLegend = legend.has(lotteryFaces[index].name);
                if (lotteryFaces[index].name === pokemonName) {
                  encount++;
                  encountFaceList.add(`${lotteryFaces[index].sleepFaceName}(☆${lotteryFaces[index].rarity})`);
                }
                incrementDetails(lotteryFaces, index);
                updateParameter(lotteryFaces, index);
                remainNP -= lotteryFaces[index].NP;
              } else if (!encountStom && encountLegend) {
                //おなかのうえ未出現、伝説遭遇
                const exindex: number = specialBinarySearch1(lotteryFacesWoLe, remainNP);
                const index: number = randomNumber(exindex);
                if (lotteryFacesWoLe[index].sleepFaceName === 'おなかのうえ寝') encountStom = true;
                if (lotteryFacesWoLe[index].name === pokemonName) {
                  encount++;
                  encountFaceList.add(`${lotteryFacesWoLe[index].sleepFaceName}(☆${lotteryFacesWoLe[index].rarity})`);
                }
                incrementDetails(lotteryFacesWoLe, index);
                updateParameter(lotteryFacesWoLe, index);
                remainNP -= lotteryFacesWoLe[index].NP;
              } else if (encountStom && !encountLegend) {
                //おなかのうえ出現、伝説未遭遇
                const exindex = specialBinarySearch1(lotteryFacesWoSt, remainNP);
                const index = randomNumber(exindex);
                encountLegend = legend.has(lotteryFacesWoSt[index].name);
                if (lotteryFacesWoSt[index].name === pokemonName) {
                  encount++;
                  encountFaceList.add(`${lotteryFacesWoSt[index].sleepFaceName}(☆${lotteryFacesWoSt[index].rarity})`);
                }
                incrementDetails(lotteryFacesWoSt, index);
                updateParameter(lotteryFacesWoSt, index);
                remainNP -= lotteryFacesWoSt[index].NP;
              } else if (encountStom && encountLegend) {
                //おなかのうえ出現、伝説遭遇
                const exindex = specialBinarySearch1(lotteryFacesWoStWoLe, remainNP);
                const index = randomNumber(exindex);
                if (lotteryFacesWoStWoLe[index].name === pokemonName) {
                  encount++;
                  encountFaceList.add(
                    `${lotteryFacesWoStWoLe[index].sleepFaceName}(☆${lotteryFacesWoStWoLe[index].rarity})`
                  );
                }
                incrementDetails(lotteryFacesWoStWoLe, index);
                updateParameter(lotteryFacesWoStWoLe, index);
                remainNP -= lotteryFacesWoStWoLe[index].NP;
              }
            } else {
              // 飴夢欠片未実装
              //最終枠
              const redraw: boolean = mayBeTrue();
              if (!encountStom && !encountLegend) {
                //おなかのうえ未出現、伝説未遭遇
                const index: number = specialBinarySearch2(lotteryFaces, remainNP);
                const encountLastOmit: boolean = judgeLastOmit(lotteryFaces[index]);
                if (encountLastOmit && redraw) {
                  //名前が除外枠かつそのうち80%再抽選する
                  const index2: number = specialBinarySearch2(lotteryFacesWoLo, remainNP);
                  if (lotteryFacesWoLo[index2].name === pokemonName) {
                    encount++;
                    encountFaceList.add(
                      `${lotteryFacesWoLo[index2].sleepFaceName}(☆${lotteryFacesWoLo[index2].rarity})`
                    );
                  }
                  incrementDetails(lotteryFacesWoLo, index2);
                  updateParameter(lotteryFacesWoLo, index2);
                } else {
                  if (lotteryFaces[index].name === pokemonName) {
                    encount++;
                    encountFaceList.add(`${lotteryFaces[index].sleepFaceName}(☆${lotteryFaces[index].rarity})`);
                  }
                  incrementDetails(lotteryFaces, index);
                  updateParameter(lotteryFaces, index);
                }
              } else if (!encountStom && encountLegend) {
                //おなかのうえ未出現、伝説遭遇
                const index: number = specialBinarySearch2(lotteryFacesWoLe, remainNP);
                const encountLastOmit: boolean = judgeLastOmit(lotteryFacesWoLe[index]);
                if (encountLastOmit && redraw) {
                  //名前が除外枠かつそのうち80%再抽選する
                  const index2: number = specialBinarySearch2(lotteryFacesWoLeWoLo, remainNP);
                  if (lotteryFacesWoLeWoLo[index2].name === pokemonName) {
                    encount++;
                    encountFaceList.add(
                      `${lotteryFacesWoLeWoLo[index2].sleepFaceName}(☆${lotteryFacesWoLeWoLo[index2].rarity})`
                    );
                  }
                  incrementDetails(lotteryFacesWoLeWoLo, index2);
                  updateParameter(lotteryFacesWoLeWoLo, index2);
                } else {
                  if (lotteryFacesWoLe[index].name === pokemonName) {
                    encount++;
                    encountFaceList.add(`${lotteryFacesWoLe[index].sleepFaceName}(☆${lotteryFacesWoLe[index].rarity})`);
                  }
                  incrementDetails(lotteryFacesWoLe, index);
                  updateParameter(lotteryFacesWoLe, index);
                }
              } else if (encountStom && !encountLegend) {
                //おなかのうえ出現、伝説未遭遇
                const index: number = specialBinarySearch2(lotteryFacesWoSt, remainNP);
                const encountLastOmit: boolean = judgeLastOmit(lotteryFacesWoSt[index]);
                if (encountLastOmit && redraw) {
                  //名前が除外枠かつそのうち80%再抽選する
                  const index2: number = specialBinarySearch2(lotteryFacesWoStWoLo, remainNP);
                  if (lotteryFacesWoStWoLo[index2].name === pokemonName) {
                    encount++;
                    encountFaceList.add(
                      `${lotteryFacesWoStWoLo[index2].sleepFaceName}(☆${lotteryFacesWoStWoLo[index2].rarity})`
                    );
                  }
                  incrementDetails(lotteryFacesWoStWoLo, index2);
                  updateParameter(lotteryFacesWoStWoLo, index2);
                } else {
                  if (lotteryFacesWoSt[index].name === pokemonName) {
                    encount++;
                    encountFaceList.add(`${lotteryFacesWoSt[index].sleepFaceName}(☆${lotteryFacesWoSt[index].rarity})`);
                  }
                  incrementDetails(lotteryFacesWoSt, index);
                  updateParameter(lotteryFacesWoSt, index);
                }
              } else if (encountStom && encountLegend) {
                //おなかのうえ出現、伝説遭遇
                const index: number = specialBinarySearch2(lotteryFacesWoStWoLe, remainNP);
                const encountLastOmit: boolean = judgeLastOmit(lotteryFacesWoStWoLe[index]);
                if (encountLastOmit && redraw) {
                  //名前が除外枠かつそのうち80%再抽選する
                  const index2: number = specialBinarySearch2(lotteryFacesWoStWoLeWoLo, remainNP);
                  if (lotteryFacesWoStWoLeWoLo[index2].name === pokemonName) {
                    encount++;
                    encountFaceList.add(
                      `${lotteryFacesWoStWoLeWoLo[index2].sleepFaceName}(☆${lotteryFacesWoStWoLeWoLo[index2].rarity})`
                    );
                  }
                  incrementDetails(lotteryFacesWoStWoLeWoLo, index2);
                  updateParameter(lotteryFacesWoStWoLeWoLo, index2);
                } else {
                  if (lotteryFacesWoStWoLe[index].name === pokemonName) {
                    encount++;
                    encountFaceList.add(
                      `${lotteryFacesWoStWoLe[index].sleepFaceName}(☆${lotteryFacesWoStWoLe[index].rarity})`
                    );
                  }
                  incrementDetails(lotteryFacesWoStWoLe, index);
                  updateParameter(lotteryFacesWoStWoLe, index);
                }
              }
            }
          }
        }
        if (encount >= 1) leastOne++;
        for (const key of encountFaceList) {
          let value = details.get(key) || [0, 0, 0];
          value[1]++;
          details.set(key, value);
        }
        ev.push(encount);
      }
      leastOne /= targetTrialNumber;
      expCandy /= targetTrialNumber;
      researchExp /= targetTrialNumber;
      dreamShard /= targetTrialNumber;
      details.forEach((value, key) => {
        details.set(key, [value[0] / targetTrialNumber, value[1] / targetTrialNumber, value[2]]);
      });
      const detailsArray: iResultDetail[] = Array.from(details, ([key, value]) => ({
        sleepFaceName: key,
        ev: parseFloat(value[0].toFixed(5)),
        leastOne: parseFloat(value[1].toFixed(5))
      })).sort((a, b) => details.get(a.sleepFaceName)![2] - details.get(b.sleepFaceName)![2]);
      const {upper: evUp, lower: evLow, evMargin} = confidenceInterval(ev);
      nowResult.push({
        np: i, // ねむけパワー
        ev: parseFloat(jStat.mean(ev).toFixed(5)), // 期待値
        leastOne: parseFloat(leastOne.toFixed(5)), // 1体以上
        evUp: parseFloat(evUp.toFixed(5)),
        evLow: parseFloat(evLow.toFixed(5)),
        evMargin: parseFloat(evMargin.toFixed(5)),
        expCandy: parseFloat(expCandy.toFixed(5)),
        researchExp: parseFloat(researchExp.toFixed(2)),
        dreamShard: parseFloat(dreamShard.toFixed(2)),
        details: detailsArray
      });
    }
    return nowResult;
  };

  useEffect(() => {
    if (!calculatorOrder) return;
    const startCalculations = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300)); // 0.3秒待つ
        const nowResult = await performCalculations(); // 計算実行
        setChartText([
          pokemonName + 'の',
          'フィールド: ' +
            fieldName +
            ', 睡眠タイプ: ' +
            pokemonInfo[pokemonName].sleepType +
            ', EP: ' +
            targetEnergy.toLocaleString(),
          '各NPの試行回数: ' + targetTrialNumber + ', NP間隔: ' + targetIntervalNP.toLocaleString() + ', 作成者: 擬き'
        ]);
        setResult(nowResult); // 最終結果
      } finally {
        setCalculatorOrder(false); // 計算終了
      }
    };
    startCalculations();
  }, [calculatorOrder]);

  return <div className="Calculator"></div>;
};

export default Calculator;
