import React, {useState, useEffect} from 'react';
import 'normalize.css';
import './dist.css';
import {iResult} from './types';
import {SelectChangeEvent} from '@mui/material';
import Description from './component/Description';
import Calculator from './component/Calculator';
import Chart from './component/Chart';
import Grid from './component/Grid';
import Input from './component/Input';

const App: React.FC = () => {
  type SetNumberState = (value: number) => void;
  type SetStringState = (value: string) => void;
  const handleInputChange =
    (setStateBase: SetStringState, setState: SetNumberState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = String(e.target.value);
      setStateBase(value);
      const parsedValue = Number(value);
      if (!isNaN(parsedValue)) {
        setState(parsedValue); // 数値の場合のみ更新
      }
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
    const expandedValue = Math.round(value * Math.pow(10, index) * 100) / 100;
    const expandedDisplay = formatNumberWithCommas(expandedValue);
    setExpandedValue(expandedValue);
    setExpandedDisplay(expandedDisplay);
  };
  const [pokemonName, setPokemonName] = useState<string>('');
  const handlePokemonName1 = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPokemonName(event.target.value);
  };
  const handlePokemonName2 = (event: React.SyntheticEvent, value: string) => {
    setPokemonName(value);
  };
  const [fieldName, setFieldName] = useState<string>('ワカクサ本島');
  const handleFieldName = (e: SelectChangeEvent<string>) => {
    setFieldName(String(e.target.value));
  };
  const [energyBase, setEnergyBase] = useState<string>('100');
  const [energy, setEnergy] = useState<number>(100);
  const handleEnergy = handleInputChange(setEnergyBase, setEnergy);
  const [energyIndexBase, setEnergyIndexBase] = useState<string>('4');
  const [energyIndex, setEnergyIndex] = useState<number>(4);
  const handleEnergyIndex = handleInputChange(setEnergyIndexBase, setEnergyIndex);
  const [limitNP, setLimitNP] = useState<number>(0);
  const [limitNPDisplay, setLimitNPDisplay] = useState<string>('');
  const [trialNumberBase, setTrialNumberBase] = useState<string>('10000');
  const [trialNumber, setTrialNumber] = useState<number>(10000);
  const handleTrialNumber = handleInputChange(setTrialNumberBase, setTrialNumber);
  const [startNPBase, setStartNPBase] = useState<string>('0');
  const [startNP, setStartNP] = useState<number>(0);
  const handleStartNP = handleInputChange(setStartNPBase, setStartNP);
  const [startNPIndexBase, setStartNPIndexBase] = useState<string>('1');
  const [startNPIndex, setStartNPIndex] = useState<number>(1);
  const handleStartNPIndex = handleInputChange(setStartNPIndexBase, setStartNPIndex);
  const [intervalNPBase, setIntervalNPBase] = useState<string>('1');
  const [intervalNP, setIntervalNP] = useState<number>(1);
  const handleIntervalNP = handleInputChange(setIntervalNPBase, setIntervalNP);
  const [intervalNPIndexBase, setIntervalNPIndexBase] = useState<string>('6');
  const [intervalNPIndex, setIntervalNPIndex] = useState<number>(6);
  const handleIntervalNPIndex = handleInputChange(setIntervalNPIndexBase, setIntervalNPIndex);

  const [expandedEnergy, setExpandedEnergy] = useState<number>(0);
  const [expandedEnergyDisplay, setExpandedEnergyDisplay] = useState<string>('');
  useEffect(() => {
    updateExpandedValues(energy, energyIndex, setExpandedEnergy, setExpandedEnergyDisplay);
    if (energy && energyIndex) {
      const value1 = energy * Math.pow(10, energyIndex) * 100;
      const value2 = Math.round(value1 * 100) / 100;
      const value3 = formatNumberWithCommas(value2);
      setLimitNP(value2);
      setLimitNPDisplay(value3);
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
  const [isAllInputsAreValid, setIsAllInputsAreValid] = useState<boolean>(true);
  useEffect(() => {
    if (pokemonName !== '' && expandedEnergy !== 0 && limitNP !== 0 && trialNumber >= 2 && expandedIntervalNP !== 0) {
      setIsAllInputsAreValid(true);
    } else {
      setIsAllInputsAreValid(false);
    }
  }, [pokemonName, expandedEnergy, limitNP, trialNumber, expandedIntervalNP]);

  // 全ての入力フォームが空でなく、かつクリックされたときにtrueになる関数
  const handleClick = () => {
    if (isAllInputsAreValid) {
      setCalculatorOrder(true);
    } else {
      setCalculatorOrder(false);
    }
  };
  const calculateConst = 1 / 1000000;
  const [calculateTime, setCalculateTime] = useState<number>(0.5);
  useEffect(() => {
    const time = 0.5 + Math.floor((limitNP - expandedStartNP) / expandedIntervalNP) * trialNumber * calculateConst;
    const roundedTime = Math.round(time * 100) / 100;
    setCalculateTime(roundedTime);
  }, [limitNP, expandedStartNP, expandedIntervalNP, trialNumber]);

  const [result, setResult] = useState<iResult[]>([
    {
      np: 0,
      ev: 0,
      leastOne: 0,
      evUp: 0,
      evLow: 0,
      expCandy: 0,
      researchExp: 0,
      dreamShard: 0,
      evForGrid: '0 ± 0'
    }
  ]);
  const [chartTitle1, setChartTitle1] = useState<string[]>(['出現期待値と1体以上出現確率']);
  const [chartTitle2, setChartTitle2] = useState<string[]>(['出現期待値と1体以上出現確率']);
  const [chartSubTitle, setChartSubTitle] = useState<string>('各NPの試行回数: , NP間隔: , 作成者: 擬き'); // 試行回数,ねむけパワー間隔,作成者
  return (
    <div className="App">
      <header className="flex justify-between items-center bg-[#25d76b] border-b-2 border-[#0d974f] shadow-md m-0 px-3">
        <h1 className="font-bold m-0 text-white">
          寝顔シミュレーター <small>for ポケモンスリープ</small>
        </h1>
        <Description />
      </header>
      <div className="responsive">
        <Input
          pokemonName={pokemonName}
          handlePokemonName1={handlePokemonName1}
          handlePokemonName2={handlePokemonName2}
          fieldName={fieldName}
          handleFieldName={handleFieldName}
          energyBase={energyBase}
          handleEnergy={handleEnergy}
          energyIndexBase={energyIndexBase}
          handleEnergyIndex={handleEnergyIndex}
          expandedEnergyDisplay={expandedEnergyDisplay}
          limitNPDisplay={limitNPDisplay}
          trialNumberBase={trialNumberBase}
          handleTrialNumber={handleTrialNumber}
          startNPBase={startNPBase}
          handleStartNP={handleStartNP}
          startNPIndexBase={startNPIndexBase}
          handleStartNPIndex={handleStartNPIndex}
          expandedStartNPDisplay={expandedStartNPDisplay}
          intervalNPBase={intervalNPBase}
          handleIntervalNP={handleIntervalNP}
          intervalNPIndexBase={intervalNPIndexBase}
          handleIntervalNPIndex={handleIntervalNPIndex}
          expandedIntervalNPDisplay={expandedIntervalNPDisplay}
          isAllInputsAreValid={isAllInputsAreValid}
          calculatorOrder={calculatorOrder}
          handleClick={handleClick}
          calculateTime={calculateTime}
        />
        <div className="mt-3 mb-5 responsiveOutput sectionWidth mx-auto">
          <div className="flex">
            <span className="bg-[#489FFF] w-1.5 mr-1.5"></span>
            <div className="flex justify-between text-white bg-[#489FFF] px-2 w-full clipSlant">
              <h2 className="font-bold">出力欄</h2>
              <sub className="text-xs mx-1  mt-auto mb-1">寝顔データ最終更新日時: 2024/11/12</sub>
            </div>
          </div>
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
              setChartTitle1={setChartTitle1}
              setChartTitle2={setChartTitle2}
              setChartSubTitle={setChartSubTitle}
            />
            <Chart result={result} chartTitle1={chartTitle1} chartTitle2={chartTitle2} chartSubTitle={chartSubTitle} />
            <Grid result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
