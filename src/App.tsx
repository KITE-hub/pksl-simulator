import React, {useState, useEffect} from 'react';
import './normalize.css';
import './dist.css';
import {iResult} from './types';
import Description from './component/Description';
import Calculator from './component/Calculator';
import Chart from './component/Chart';
import Grid from './component/Grid';

const App: React.FC = () => {
  // 入力フォームの変数の保持
  type SetNumberState = (value: number) => void;
  const handleInputChange = (setState: SetNumberState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setState(value);
  };
  // 画面表示用に4桁区切りにする
  const formatNumberWithCommas = (value: number): string => {
    if (value >= 1e11) {
      return value.toExponential(2); // 小数点以下2桁で表示
    } else {
      return value.toString().replace(/\B(?=(\d{4})+(?!\d))/g, '\u2009');
    }
  };

  const updateExpandedValues = (
    value: number,
    index: number,
    setExpandedValue: (value: number) => void,
    setExpandedDisplay: (display: string) => void
  ) => {
    const expandedValue = value * Math.pow(10, index);
    const expandedDisplay = formatNumberWithCommas(expandedValue);
    setExpandedValue(expandedValue);
    setExpandedDisplay(expandedDisplay);
  };
  //test
  const [pokemonName, setPokemonName] = useState<string>('ピカチュウ');
  const handlePokemonName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPokemonName(String(e.target.value));
  };
  const [fieldName, setFieldName] = useState<string>('ワカクサ本島');
  const handleFieldName = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldName(String(e.target.value));
  };
  const [energy, setEnergy] = useState<number>(1);
  const handleEnergy = handleInputChange(setEnergy);
  const [energyIndex, setEnergyIndex] = useState<number>(6);
  const handleEnergyIndex = handleInputChange(setEnergyIndex);
  const [limitNP, setLimitNP] = useState<number>(0);
  const [limitNPDisplay, setLimitNPDisplay] = useState<string>('');
  const [trialNumber, setTrialNumber] = useState<number>(10000);
  const handleTrialNumber = handleInputChange(setTrialNumber);
  const [startNP, setStartNP] = useState<number>(0);
  const handleStartNP = handleInputChange(setStartNP);
  const [startNPIndex, setStartNPIndex] = useState<number>(1);
  const handleStartNPIndex = handleInputChange(setStartNPIndex);
  const [intervalNP, setIntervalNP] = useState<number>(1);
  const handleIntervalNP = handleInputChange(setIntervalNP);
  const [intervalNPIndex, setIntervalNPIndex] = useState<number>(7);
  const handleIntervalNPIndex = handleInputChange(setIntervalNPIndex);

  const [expandedEnergy, setExpandedEnergy] = useState<number>(0);
  const [expandedEnergyDisplay, setExpandedEnergyDisplay] = useState<string>('');
  useEffect(() => {
    updateExpandedValues(energy, energyIndex, setExpandedEnergy, setExpandedEnergyDisplay);
    if (energy && energyIndex) {
      const value1 = energy * Math.pow(10, energyIndex) * 100;
      const value2 = formatNumberWithCommas(value1);
      setLimitNP(value1);
      setLimitNPDisplay(value2);
    } else {
      setLimitNP(0);
      setLimitNPDisplay('');
    }
  }, [energy, energyIndex]);

  const [expandedStartNP, setExpandedStartNP] = useState<number>(0);
  const [expandedStartNPDisplay, setExpandedStartNPDisplay] = useState<string>('');
  useEffect(() => {
    updateExpandedValues(startNP, startNPIndex, setExpandedStartNP, setExpandedStartNPDisplay);
  }, [startNP, startNPIndex]);

  const [expandedIntervalNP, setExpandedIntervalNP] = useState<number>(0);
  const [expandedIntervalNPDisplay, setExpandedIntervalNPDisplay] = useState<string>('');
  useEffect(() => {
    updateExpandedValues(intervalNP, intervalNPIndex, setExpandedIntervalNP, setExpandedIntervalNPDisplay);
  }, [intervalNP, intervalNPIndex]);

  // db関連
  const [calculatorOrder, setCalculatorOrder] = useState<boolean>(false);

  // 全ての入力フォームが空でないときにtrueを返す(fieldNameは空にならない、startNPは0でも良い)
  const allInputsAreValid = (): boolean => {
    return pokemonName !== '' && expandedEnergy !== 0 && limitNP !== 0 && trialNumber >=2 && expandedIntervalNP !== 0;
  };

  // 全ての入力フォームが空でなく、計算量過多にならなく(未実装)、かつクリックされたときにtrueになる関数
  const handleClick = () => {
    if (allInputsAreValid()) {
      setCalculatorOrder(true);
    } else {
      setCalculatorOrder(false);
    }
  };
  const [result, setResult] = useState<iResult[]>([
    {npXAxis: 0, np: 0, ev: 0, leastOne: 0, evUp: 0, evLow: 0, evForGrid: '0 ± 0', leastOneForGrid: 0}
  ]);
  const [chartTitle, setChartTitle] = useState<string[]>(['出現期待値と1体以上出現確率', '']);
  const [chartSubTitle, setChartSubTitle] = useState<string>('各NPの試行回数: , NP間隔: , 作成者:?'); // 試行回数,ねむけパワー間隔,作成者
  return (
    <div className="App">
      <header className="flex justify-between items-center bg-[#25d76b] border-b-2 border-[#0d974f] shadow-md m-0 px-3">
        <h1 className="font-bold m-0 text-white">
          寝顔シミュレーター <small>for ポケモンスリープ</small>
        </h1>
        <Description/>
      </header>
      <div className="responsive"> {/* 入力欄と出力欄を横並び=flexにするか？ */}
        <section className="mt-3 mb-5 sectionWidth mx-auto">
          <div className="flex mb-3">
            <span className="bg-[#489FFF] w-1.5 mr-1.5"></span>
            <h2 className="font-bold text-white bg-[#489FFF] px-2 w-full clipSlant">入力欄</h2>
          </div>
          <table className="mx-auto">
            <tr className="h-10 my-2">
              <th>
                <div className="bg-[#6aea4b] text-white textShadow rounded-full w-40 h-6 mr-3 flex items-center justify-center">
                  ポケモン名
                </div>
              </th>
              <td>
                <input
                  type="text"
                  value={pokemonName}
                  onChange={(e) => handlePokemonName(e)}
                  className="font-bold px-2 w-40 py-1 box-border rounded-md border border-[#25d76b] buttonShadow"
                ></input>
              </td>
            </tr>
            <tr className="h-10">
              <th>
                <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
                  フィールド名
                </div>
              </th>
              <td>
                <select
                  id="field"
                  value={fieldName}
                  onChange={(e) => handleFieldName(e)}
                  className="font-bold px-1 w-40 py-1 box-border rounded-md border border-[#25d76b] buttonShadow"
                >
                  <option value="ワカクサ本島">ワカクサ本島</option>
                  <option value="シアンの砂浜">シアンの砂浜</option>
                  <option value="トープ洞窟">トープ洞窟</option>
                  <option value="ウノハナ雪原">ウノハナ雪原</option>
                  <option value="ラピスラズリ湖畔">ラピスラズリ湖畔</option>
                  {/* <option value="ゴールド旧発電所">ゴールド旧発電所</option> */}
                </select>
              </td>
            </tr>
            <tr className="h-10">
              <th>
                <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
                  エナジー
                </div>
              </th>
              <td className="flex">
                <input
                  type="figure"
                  value={energy}
                  onChange={(e) => handleEnergy(e)}
                  className="font-bold px-2 w-16 py-1 box-border rounded-md border border-[#25d76b] buttonShadow"
                ></input>
                <p className="flex items-center mx-2">× 10</p>
                <sup>
                  <input
                    type="figure"
                    value={energyIndex}
                    onChange={(e) => handleEnergyIndex(e)}
                    className="font-bold px-1 pb-1 w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow"
                  ></input>
                </sup>
              </td>
              <p className="flex items-center mx-1.5 text-sm">= {expandedEnergyDisplay}</p>
            </tr>
            <tr className="h-8">
              <th>
                <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
                  上限ねむけパワー
                </div>
              </th>
              <td>
                <p className="flex items-center mx-1">{limitNPDisplay}</p>
              </td>
            </tr>
            <tr className="h-10">
              <th>
                <div className="bg-[#6aea4b] text-white text-xs rounded-full w-40 h-6 mr-3 flex items-center justify-center">
                  各ねむけパワーの試行回数
                </div>
              </th>
              <td>
                <input
                  type="figure"
                  value={trialNumber}
                  onChange={(e) => handleTrialNumber(e)}
                  className="font-bold px-2 w-24 py-1 box-border rounded-md border border-[#25d76b] buttonShadow"
                ></input>
              </td>
            </tr>
            <tr className="h-10">
              <th>
                <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
                  開始ねむけパワー
                </div>
              </th>
              <td className="flex">
                <input
                  type="figure"
                  value={startNP}
                  onChange={(e) => handleStartNP(e)}
                  className="font-bold px-2 w-16 py-1 box-border rounded-md border border-[#25d76b] buttonShadow"
                ></input>
                <p className="flex items-center mx-2">× 10</p>
                <sup>
                  <input
                    type="figure"
                    value={startNPIndex}
                    onChange={(e) => handleStartNPIndex(e)}
                    className="font-bold px-1 pb-1 w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow"
                  ></input>
                </sup>
              </td>
              <p className="flex items-center mx-1.5 text-sm">= {expandedStartNPDisplay}</p>
            </tr>
            <tr className="h-10">
              <th>
                <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
                  ねむけパワー間隔
                </div>
              </th>
              <td className="flex">
                <input
                  type="figure"
                  value={intervalNP}
                  onChange={(e) => handleIntervalNP(e)}
                  className="font-bold px-2 w-16 py-1 box-border rounded-md border border-[#25d76b] buttonShadow"
                ></input>
                <p className="flex items-center mx-2">× 10</p>
                <sup>
                  <input
                    type="figure"
                    value={intervalNPIndex}
                    onChange={(e) => handleIntervalNPIndex(e)}
                    className="font-bold px-1 pb-1 w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow"
                  ></input>
                </sup>
              </td>
              <p className="flex items-center mx-1.5 text-sm">= {expandedIntervalNPDisplay}</p>
            </tr>
          </table>
          <div className="flex justify-center my-2">
            {/* <button className="buttonShadow font-bold text-center bg-white rounded-full border border-[#666666] mr-3 py-1.5 w-32">
							キャンセル
						</button> */}
            {calculatorOrder ? (
              // calculatorOrder が true のときに表示する要素
              <button
                className="buttonShadow font-bold text-center text-white bg-gray-400 rounded-full border border-gray-600 py-1.5 w-32"
                disabled
              >
                計算中...
              </button>
            ) : (
              // calculatorOrder が false のときに表示する要素
              <button
                onClick={handleClick}
                className="buttonShadow font-bold text-center text-white bg-[#25d76b] rounded-full border border-[#0d974f] py-1.5 w-32"
              >
                計算する
              </button>
            )}
          </div>
        </section>
        <section className="mt-3 mb-5 responsiveOutput sectionWidth mx-auto">
          <div className="flex mb-3">
            <span className="bg-[#fb6e53] w-1.5 mr-1.5"></span>
            <div className="flex justify-between text-white bg-[#fb6e53] px-2 w-full clipSlant">
              <h2 className="font-bold">出力欄</h2>
              <sub className="text-xs mx-1  mt-auto mb-1">寝顔データ最終更新日時: 2024/09/25</sub>
            </div>
          </div>
          {/* propsで値をcalculator.tsxに渡す */}
          <div className="">
            <Calculator
              calculatorOrder={calculatorOrder}
              setCalculatorOrder={setCalculatorOrder}
              pokemonName={pokemonName}
              fieldName={fieldName}
              energy={expandedEnergy}
              limitNP={limitNP}
              trialNumber={trialNumber}
              startNP={expandedStartNP}
              intervalNP={expandedIntervalNP}
              setResult={setResult}
              setChartTitle={setChartTitle}
              setChartSubTitle={setChartSubTitle}
            />
            <Chart result={result} chartTitle={chartTitle} chartSubTitle={chartSubTitle} />
            <Grid result={result}/>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
