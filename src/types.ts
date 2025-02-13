import {SelectChangeEvent} from '@mui/material';

export interface iPokemonInfo {
  id: number;
  pokemonName: string;
  sleepType: string;
  speciesName: string;
}

//jsonの生データを格納する型
export interface rawISleepFace {
  pokemonName: string;
  releaseDate: string;
  rarity: number;
  sleepFaceName: string;
  energy: number;
  ID: number;
  np: number;
  expCandy: number;
  researchExp: number;
  dreamShard: number;
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
  releaseDate: Date;
}

export class procCSleepFace {
  NP: number;
  energy: number;
  ID: number;
  name: string;
  rarity: number;
  expCandy: number;
  researchExp: number;
  dreamShard: number;
  speciesName: string;
  releaseDate: Date;

  constructor(
    NP: number,
    energy: number,
    ID: number,
    name: string,
    rarity: number,
    expCandy: number,
    researchExp: number,
    dreamShard: number,
    speciesName: string,
    releaseDate: Date
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
    this.releaseDate = releaseDate;
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
  evMargin: number;
}

export interface iNotDecided {
  pokemonName: string;
  rarity: number;
  sleepFaceName: string;
  np: number;
}

export interface InputProps {
  targetEnergy: number;
  setTargetEnergy: (targetEnergy: number) => void;
  targetLimitNP: number;
  setTargetLimitNP: (targetLimitNP: number) => void;
  targetTrialNumber: number;
  setTargetTrialNumber: (targetTrialNumber: number) => void;
  targetStartNP: number;
  setTargetStartNP: (targetStartNP: number) => void;
  targetIntervalNP: number;
  setTargetIntervalNP: (targetIntervalNP: number) => void;
  pokemonName: string;
  setPokemonName: (pokemonName: string) => void;
  fieldName: string;
  setFieldName: (fieldName: string) => void;
  isAllInputsAreValid: boolean;
  calculatorOrder: boolean;
  handleClick: () => void;
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
  targetEnergy: number;
  targetLimitNP: number;
  targetTrialNumber: number;
  targetStartNP: number;
  targetIntervalNP: number;
  calculatorOrder: boolean;
  setCalculatorOrder: (value: boolean) => void;
  setResult: React.Dispatch<React.SetStateAction<iResult[]>>;
  setChartTitle1: React.Dispatch<React.SetStateAction<string[]>>;
  setChartTitle2: React.Dispatch<React.SetStateAction<string[]>>;
  setChartSubTitle: React.Dispatch<React.SetStateAction<string>>;
}

export interface ChartConfigProps {
  isDisplayed95: boolean;
  setIsDisplayed95: (isDisplayed95: boolean) => void;
}

export interface ChartNarrowProps {
  result: iResult[];
  isDisplayed95: boolean;
  chartTitle1: string[];
  chartTitle2: string[];
  chartSubTitle: string;
}

export interface ChartWideProps {
  result: iResult[];
  isDisplayed95: boolean;
  chartTitle1: string[];
  chartTitle2: string[];
  chartSubTitle: string;
}

export interface GridProps {
  result: iResult[];
}
