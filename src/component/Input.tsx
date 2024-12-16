import React from 'react';
import PokemonNameSelect from './PokemonNameSelect';
import FieldNameSelect from './FieldNameSelect';
import {InputProps} from '../types';

const Input: React.FC<InputProps> = ({
  pokemonName,
  handlePokemonName1,
  handlePokemonName2,
  fieldName,
  handleFieldName,
  energyBase,
  handleEnergy,
  energyIndexBase,
  handleEnergyIndex,
  expandedEnergyDisplay,
  limitNPDisplay,
  trialNumberBase,
  handleTrialNumber,
  startNPBase,
  handleStartNP,
  startNPIndexBase,
  handleStartNPIndex,
  expandedStartNPDisplay,
  intervalNPBase,
  handleIntervalNP,
  intervalNPIndexBase,
  handleIntervalNPIndex,
  expandedIntervalNPDisplay,
  calculatorOrder,
  handleClick,
  calculateTime
}) => {
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
        <tr className="h-10 my-2">
          <th>
            <div className="bg-[#6aea4b] text-white textShadow rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              ポケモン名
            </div>
          </th>
          <td>
            <PokemonNameSelect
              pokemonName={pokemonName}
              handlePokemonName1={handlePokemonName1}
              handlePokemonName2={handlePokemonName2}
            />
          </td>
        </tr>
        <tr className="h-10">
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              フィールド名
            </div>
          </th>
          <td>
            <FieldNameSelect fieldName={fieldName} handleFieldName={handleFieldName} />
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
              value={energyBase}
              onChange={handleEnergy}
              className="font-bold px-2 focus:px-[7px] w-16 py-1 focus:py-[3px] box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
            />
            <p className="flex items-center mx-2">× 10</p>
            <sup>
              <input
                type="figure"
                value={energyIndexBase}
                onChange={handleEnergyIndex}
                className="font-bold px-1 focus:px-[3px] pb-1 focus:pb-[3px] w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
            </sup>
          </td>
          <p className="flex items-center mx-1.5 text-sm">= {expandedEnergyDisplay}</p>
        </tr>
        <tr className="h-16">
          <th>
            <div className="bg-[#6aea4b] text-white rounded-full w-40 h-6 mr-3 flex items-center justify-center">
              上限ねむけパワー
            </div>
          </th>
          <td>
            <p className="flex items-center mx-1">{limitNPDisplay}</p>
            <span className="text-xs mx-1"> (睡眠スコア100固定)</span>
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
              value={trialNumberBase}
              onChange={handleTrialNumber}
              className="font-bold px-2 focus:px-[7px] w-24 py-1 focus:py-[3px] box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
            />
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
              value={startNPBase}
              onChange={handleStartNP}
              className="font-bold px-2 focus:px-[7px] w-16 py-1 focus:py-[3px] box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
            />
            <p className="flex items-center mx-2">× 10</p>
            <sup>
              <input
                type="figure"
                value={startNPIndexBase}
                onChange={handleStartNPIndex}
                className="font-bold px-1 focus:px-[3px] pb-1 focus:pb-[3px] w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
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
              value={intervalNPBase}
              onChange={handleIntervalNP}
              className="font-bold px-2 focus:px-[7px] w-16 py-1 focus:py-[3px] box-border rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
            />
            <p className="flex items-center mx-2">× 10</p>
            <sup>
              <input
                type="figure"
                value={intervalNPIndexBase}
                onChange={handleIntervalNPIndex}
                className="font-bold px-1 focus:px-[3px] pb-1 focus:pb-[3px] w-8 box-border relative top-1.5 rounded-md border border-[#25d76b] buttonShadow focus:outline-none focus:border-2 focus:border-[#25d76b]"
              />
            </sup>
          </td>
          <p className="flex items-center mx-1.5 text-sm">= {expandedIntervalNPDisplay}</p>
        </tr>
      </table>
      <div className="flex justify-center my-2">
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
