import React, {useState, useEffect} from 'react';
import './dist.css';
import {iResult} from './types';
import {useLocalStorageState} from './component/UseLocalStorageState';
import Description from './component/Description';
import Calculator from './component/Calculator';
import lotteryConfig from './db/other/lotteryConfig.json';
import ChartConfig from './component/ChartConfig';
import Chart from './component/Chart';
import Grid from './component/Grid';
import Input from './component/Input';

const App: React.FC = () => {
  const [pokemonName, setPokemonName] = useState<string>('');
  const [fieldName, setFieldName] = useLocalStorageState<string>('fieldName', 'ワカクサ本島');
  const [targetEnergy, setTargetEnergy] = useLocalStorageState<number>('targetEnergy', 1000000);
  const [targetLimitNP, setTargetLimitNP] = useLocalStorageState<number>('targetEnergy', 100000000);
  const [targetTrialNumber, setTargetTrialNumber] = useLocalStorageState<number>('targetTrialNumber', 10000);
  const [targetStartNP, setTargetStartNP] = useLocalStorageState<number>('targetStartNP', 0);
  const [targetIntervalNP, setTargetIntervalNP] = useLocalStorageState<number>('targetIntervalNP', 1000000);

  // 全ての入力フォームが空でないときにtrueを返す(fieldNameは空にならない、startNPは0でも良い)
  const [isAllInputsAreValid, setIsAllInputsAreValid] = useState<boolean>(true);
  useEffect(() => {
    if (
      pokemonName !== '' &&
      targetEnergy !== 0 &&
      targetLimitNP !== 0 &&
      targetTrialNumber >= 2 &&
      targetIntervalNP !== 0
    ) {
      setIsAllInputsAreValid(true);
    } else {
      setIsAllInputsAreValid(false);
    }
  }, [pokemonName, targetEnergy, targetLimitNP, targetTrialNumber, targetIntervalNP]);

  const [calculatorOrder, setCalculatorOrder] = useState<boolean>(false);
  // 全ての入力フォームが空でなく、かつクリックされたときにtrueになる関数
  const handleClick = () => {
    if (isAllInputsAreValid) setCalculatorOrder(true);
    else setCalculatorOrder(false);
  };

  const updateDateBase1 = new Date(lotteryConfig.updateDate);
  const updateDateBase2 = new Date(updateDateBase1.getTime() + 9 * 60 * 60 * 1000); // UTC → JST
  const updateDate = updateDateBase2.toISOString().split('T')[0].replace(/-/g, '/');

  const [result, setResult] = useState<iResult[]>([
    {
      np: 0,
      ev: 1,
      leastOne: 1,
      evUp: 1,
      evLow: 1,
      evMargin: 1,
      expCandy: 1,
      researchExp: 1,
      dreamShard: 1,
      details: [
        {
          sleepFaceName: 'おなかのうえ寝(☆4)',
          ev: 1,
          leastOne: 1
        }
      ]
    }
  ]);

  const [showDashedLine, setShowDashedLine] = useLocalStorageState<boolean>('showDashedLine', false);
  const [chartText, setChartText] = useState<string[]>([
    '',
    'フィールド: , 睡眠タイプ: , EP: ',
    '各NPの試行回数: , NP間隔: , 作成者: 擬き'
  ]);

  return (
    <div className="App">
      <header className="flex justify-between items-center bg-[#25d76b] border-b-2 border-[#0d974f] shadow-md m-0 px-3">
        <h1 className="font-bold m-0 text-white" style={{wordBreak: 'keep-all'}}>
          寝顔シミュレーター <small>for ポケモンスリープ</small>
        </h1>
        <Description />
      </header>
      <div className="responsive">
        <Input
          targetEnergy={targetEnergy}
          setTargetEnergy={setTargetEnergy}
          targetLimitNP={targetLimitNP}
          setTargetLimitNP={setTargetLimitNP}
          targetTrialNumber={targetTrialNumber}
          setTargetTrialNumber={setTargetTrialNumber}
          targetStartNP={targetStartNP}
          setTargetStartNP={setTargetStartNP}
          targetIntervalNP={targetIntervalNP}
          setTargetIntervalNP={setTargetIntervalNP}
          pokemonName={pokemonName}
          setPokemonName={setPokemonName}
          fieldName={fieldName}
          setFieldName={setFieldName}
          isAllInputsAreValid={isAllInputsAreValid}
          calculatorOrder={calculatorOrder}
          handleClick={handleClick}
        />
        <div className="mt-3 mb-4 responsiveOutput sectionWidth mx-auto">
          <div className="flex">
            <span className="bg-[#489FFF] w-1.5 mr-1.5"></span>
            <div className="flex justify-between text-white bg-[#489FFF] px-2 w-full clipSlant">
              <h2 className="font-bold">出力欄</h2>
              <sub className="text-xs mx-1 mt-auto ml-auto mb-1">寝顔データ更新日: {updateDate} (by raenonX)</sub>
              <ChartConfig showDashedLine={showDashedLine} setShowDashedLine={setShowDashedLine} />
            </div>
          </div>
          <div className="">
            <Calculator
              calculatorOrder={calculatorOrder}
              setCalculatorOrder={setCalculatorOrder}
              pokemonName={pokemonName}
              fieldName={fieldName}
              targetEnergy={targetEnergy}
              targetLimitNP={targetLimitNP}
              targetTrialNumber={targetTrialNumber}
              targetStartNP={targetStartNP}
              targetIntervalNP={targetIntervalNP}
              setResult={setResult}
              setChartText={setChartText}
            />
            <Chart result={result} showDashedLine={showDashedLine} pokemonName={pokemonName} chartText={chartText} />
            <Grid result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
