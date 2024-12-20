import {SelectChangeEvent} from '@mui/material';

export interface iPokemonInfo {
  pokemonName: string;
  sleepType: string;
  speciesName: string;
}

//jsonの生データを格納する型
export interface rawISleepFace {
  sleepType: string;
  energy: number;
  ID: number;
  pokemonName: string;
  rarity: number;
  np: number;
  expCandy: number;
  researchExp: number;
  dreamShard: number;
  speciesName: string;
}

//生データの寝顔データから扱いやすいように改修
export interface procISleepFace {
  NP: number;
  energy: number;
  ID: number;
  name: string;
  rarity: number;
  expCandy: number;
  researchExp: number;
  dreamShard: number;
  speciesName: string;
}

export class procCSleepFace implements procISleepFace {
  NP: number;
  energy: number;
  ID: number; //sortは実質ここまで
  name: string;
  rarity: number;
  expCandy: number;
  researchExp: number;
  dreamShard: number;
  speciesName: string;

  constructor(
    NP: number,
    energy: number,
    ID: number,
    name: string,
    rarity: number,
    expCandy: number,
    researchExp: number,
    dreamShard: number,
    speciesName: string
  ) {
    this.NP = NP;
    this.energy = energy;
    this.ID = ID;
    this.name = name;
    this.rarity = rarity;
    this.expCandy = expCandy;
    this.researchExp = researchExp;
    this.dreamShard = dreamShard;
    this.speciesName = speciesName;
  }

  // ソートのための比較メソッド
  static compare(a: procISleepFace, b: procISleepFace): number {
    if (a.NP !== b.NP) return a.NP - b.NP;
    if (a.energy !== b.energy) return a.energy - b.energy;
    if (a.ID !== b.ID) return a.ID - b.ID;
    if (a.name !== b.name) return a.name < b.name ? -1 : 1;
    if (a.rarity !== b.rarity) return a.rarity - b.rarity;
    if (a.expCandy !== b.expCandy) return a.expCandy - b.expCandy;
    if (a.researchExp !== b.researchExp) return a.researchExp - b.researchExp;
    if (a.speciesName !== b.speciesName) return a.speciesName < b.speciesName ? -1 : 1;
    return a.dreamShard - b.dreamShard;
  }
}

export interface iResult {
  np: number;
  ev: number;
  leastOne: number;
  evUp: number;
  evLow: number;
  expCandy: number;
  researchExp: number;
  dreamShard: number;
  evForGrid: string;
}

export interface InputProps {
  pokemonName: string;
  handlePokemonName1: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePokemonName2: (event: React.SyntheticEvent, value: string) => void;
  fieldName: string;
  handleFieldName: (e: SelectChangeEvent<string>) => void;
  energyBase: string;
  handleEnergy: (e: React.ChangeEvent<HTMLInputElement>) => void;
  energyIndexBase: string;
  handleEnergyIndex: (e: React.ChangeEvent<HTMLInputElement>) => void;
  expandedEnergyDisplay: string;
  limitNPDisplay: string;
  trialNumberBase: string;
  handleTrialNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startNPBase: string;
  handleStartNP: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startNPIndexBase: string;
  handleStartNPIndex: (e: React.ChangeEvent<HTMLInputElement>) => void;
  expandedStartNPDisplay: string;
  intervalNPBase: string;
  handleIntervalNP: (e: React.ChangeEvent<HTMLInputElement>) => void;
  intervalNPIndexBase: string;
  handleIntervalNPIndex: (e: React.ChangeEvent<HTMLInputElement>) => void;
  expandedIntervalNPDisplay: string;
  isAllInputsAreValid: boolean;
  calculatorOrder: boolean;
  handleClick: () => void;
  calculateTime: number;
}

export interface PokemonNameSelectProps {
  pokemonName: string;
  handlePokemonName1: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePokemonName2: (event: React.SyntheticEvent, value: string) => void;
}

export interface FieldNameSelectProps {
  fieldName: string;
  handleFieldName: (e: SelectChangeEvent<string>) => void;
}

export interface CalculatorProps {
  pokemonName: string;
  fieldName: string;
  energy: number;
  limitNP: number;
  trialNumber: number;
  startNP: number;
  intervalNP: number;
  calculatorOrder: boolean;
  setCalculatorOrder: (value: boolean) => void;
  setResult: React.Dispatch<React.SetStateAction<iResult[]>>;
  setChartTitle1: React.Dispatch<React.SetStateAction<string[]>>;
  setChartTitle2: React.Dispatch<React.SetStateAction<string[]>>;
  setChartSubTitle: React.Dispatch<React.SetStateAction<string>>;
}

export interface ChartProps {
  result: iResult[];
  chartTitle1: string[];
  chartTitle2: string[];
  chartSubTitle: string;
}

export interface GridProps {
  result: iResult[];
}
