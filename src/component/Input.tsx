import React, {useEffect} from 'react';
import {SelectChangeEvent} from '@mui/material';
import PokemonNameSelect from './PokemonNameSelect';
import FieldNameSelect from './FieldNameSelect';
import {InputProps} from '../types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DangerousIcon from '@mui/icons-material/Dangerous';
import {useLocalStorageState} from './UseLocalStorageState';

const Input: React.FC<InputProps> = ({
  pokemonName,
  setPokemonName,
  fieldName,
  setFieldName,
  targetEnergy,
  setTargetEnergy,
  targetLimitNP,
  setTargetLimitNP,
  targetTrialNumber,
  setTargetTrialNumber,
  targetStartNP,
  setTargetStartNP,
  targetIntervalNP,
  setTargetIntervalNP,
  isAllInputsAreValid,
  calculatorOrder,
  handleClick
}) => {
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<[number | null, number | null]>>, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
      setter((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated as [number | null, number | null];
      });
    };

  const calculateExpandedValue = (base: number | null, exponent: number | null) => {
    if (base !== null && exponent !== null) {
      return Math.min(Math.pow(10, 12), Math.round(base * Math.pow(10, exponent) * 100) / 100);
    }
    return null;
  };

  const handlePokemonName1 = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPokemonName(event.target.value);
  };
  const handlePokemonName2 = (event: React.SyntheticEvent, value: string) => {
    setPokemonName(value);
  };
  const handleFieldName = (e: SelectChangeEvent<string>) => {
    setFieldName(String(e.target.value));
  };

  const [targetEnergyBase, setTargetEnergyBase] = useLocalStorageState<[number | null, number | null]>(
    'targetEnergyBase',
    [100, 4]
  );
  useEffect(() => {
    const expandedValue = calculateExpandedValue(...targetEnergyBase);
    if (expandedValue !== null) {
      setTargetEnergy(expandedValue);
      setTargetLimitNP(expandedValue * 100);
    }
  }, [targetEnergyBase]);

  const [targetTrialNumberBase, setTargetTrialNumberBase] = useLocalStorageState<[number | null, number | null]>(
    'targetTrialNumberBase',
    [10000, 0]
  );
  useEffect(() => {
    const expandedValue = calculateExpandedValue(...targetTrialNumberBase);
    if (expandedValue !== null) {
      setTargetTrialNumber(expandedValue);
    }
  }, [targetTrialNumberBase]);

  const [targetStartNPBase, setTargetStartNPBase] = useLocalStorageState<[number | null, number | null]>(
    'targetStartNPBase',
    [0, 6]
  );
  useEffect(() => {
    const expandedValue = calculateExpandedValue(...targetStartNPBase);
    if (expandedValue !== null) {
      setTargetStartNP(expandedValue);
    }
  }, [targetStartNPBase]);

  const [targetIntervalNPBase, setTargetIntervalNPBase] = useLocalStorageState<[number | null, number | null]>(
    'targetIntervalNPBase',
    [100, 4]
  );
  useEffect(() => {
    const expandedValue = calculateExpandedValue(...targetIntervalNPBase);
    if (expandedValue !== null) {
      setTargetIntervalNP(expandedValue);
    }
  }, [targetIntervalNPBase]);

  const calculateConst = 1 / 1000000;
  const [calculateTime, setCalculateTime] = useLocalStorageState<number>('calculateTime', 1);
  useEffect(() => {
    const time =
      0.5 + Math.floor((targetLimitNP - targetStartNP) / targetIntervalNP) * targetTrialNumber * calculateConst;
    const roundedTime = Math.round(time * 100) / 100;
    setCalculateTime(roundedTime);
  }, [targetLimitNP, targetStartNP, targetIntervalNP, targetTrialNumber]);

  return (
    <div className="Input mt-3 mb-5 sectionWidth mx-auto">
      <div className="flex mb-3">
        <span className="bg-[#fb6e53] w-1.5 mr-1.5"></span>
        <div className="flex justify-between text-white bg-[#fb6e53] px-2 w-full clipSlant">
          <h2 className="font-bold">入力欄</h2>
          <sub className="text-xs mx-1  mt-auto mb-1">予想計算時間: {calculateTime} s</sub>
        </div>
      </div>
      <table className="mx-auto">
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white textShadow rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              ポケモン名
            </div>
          </th>
          <td className="block my-0.5">
            <PokemonNameSelect
              pokemonName={pokemonName}
              handlePokemonName1={handlePokemonName1}
              handlePokemonName2={handlePokemonName2}
            />
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              フィールド名
            </div>
          </th>
          <td className="block my-0.5">
            <FieldNameSelect fieldName={fieldName} handleFieldName={handleFieldName} />
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              エナジー
            </div>
          </th>
          <td className="block my-0.5">
            <div className="flex">
              <input
                type="number"
                value={targetEnergyBase[0] ?? ''}
                onChange={handleInputChange(setTargetEnergyBase, 0)}
                className="font-bold px-2 focus:px-[7px] w-16 h-8 box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
              <p className="flex items-center mx-2">× 10</p>
              <sup>
                <input
                  type="number"
                  value={targetEnergyBase[1] ?? ''}
                  onChange={handleInputChange(setTargetEnergyBase, 1)}
                  className="font-bold px-1 focus:px-[3px] pb-1 focus:pb-[3px] w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
                />
              </sup>
            </div>
            <p className="mx-1.5 text-sm">= {targetEnergy.toLocaleString()}</p>
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              上限ねむけパワー
            </div>
          </th>
          <td className="block">
            <p className="flex items-center mx-1">{targetLimitNP.toLocaleString()}</p>
            <p className="text-xs mx-1"> (睡眠スコア100固定)</p>
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white text-xs rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              各ねむけパワーの試行回数
            </div>
          </th>
          <td className="block my-0.5">
            <input
              type="number"
              value={targetTrialNumberBase[0] ?? ''}
              onChange={handleInputChange(setTargetTrialNumberBase, 0)}
              className="font-bold px-2 focus:px-[7px] w-20 h-8 box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
            />
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              開始ねむけパワー
            </div>
          </th>
          <td className="block my-0.5">
            <div className="flex">
              <input
                type="number"
                value={targetStartNPBase[0] ?? ''}
                onChange={handleInputChange(setTargetStartNPBase, 0)}
                className="font-bold px-2 focus:px-[7px] w-16 h-8 box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
              <p className="flex items-center mx-2">× 10</p>
              <sup>
                <input
                  type="number"
                  value={targetStartNPBase[1] ?? ''}
                  onChange={handleInputChange(setTargetStartNPBase, 1)}
                  className="font-bold px-1 focus:px-[3px] pb-1 focus:pb-[3px] w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
                />
              </sup>
            </div>
            <p className="mx-1.5 text-sm">= {targetStartNP.toLocaleString()}</p>
          </td>
        </tr>
        <tr>
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              ねむけパワー間隔
            </div>
          </th>
          <td className="block my-0.5">
            <div className="flex">
              <input
                type="number"
                value={targetIntervalNPBase[0] ?? ''}
                onChange={handleInputChange(setTargetIntervalNPBase, 0)}
                className="font-bold px-2 focus:px-[7px] w-16 h-8 box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
              <p className="flex items-center mx-2">× 10</p>
              <sup>
                <input
                  type="number"
                  value={targetIntervalNPBase[1] ?? ''}
                  onChange={handleInputChange(setTargetIntervalNPBase, 1)}
                  className="font-bold px-1 focus:px-[3px] pb-1 focus:pb-[3px] w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
                />
              </sup>
            </div>
            <p className="mx-1.5 text-sm">= {targetIntervalNP.toLocaleString()}</p>
          </td>
        </tr>
      </table>
      <div className="flex justify-center my-1">
        {isAllInputsAreValid ? (
          <div className="flex items-center mr-4">
            <CheckCircleIcon sx={{color: '#21C462'}} />
            <p className="text-xs ml-1 text-[#21C462] w-28">計算実行可能です。</p>
          </div>
        ) : (
          <div className="flex items-center mr-4">
            <DangerousIcon sx={{color: '#FA5838'}} />
            <p className="text-xs ml-1 text-[#FA5838] w-28">
              入力パラメータが
              <br />
              不適切です。
            </p>
          </div>
        )}
        {calculatorOrder ? (
          <button
            className="buttonShadow font-bold text-center text-white bg-gray-400 rounded-full border border-gray-600 py-1.5 w-32"
            disabled
          >
            計算中...
          </button>
        ) : (
          <button
            onClick={handleClick}
            className="buttonShadow font-bold text-center text-white bg-[#25d76b] rounded-full border border-[#0d974f] py-1.5 w-32"
          >
            計算する
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
