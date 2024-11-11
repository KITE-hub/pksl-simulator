//csvからの生データを格納する型
export interface rawISleepFace {
  'sleepType': string;
  'energy': number;
  'internalID': number;
  'pokemonName': string;
  'rarity': number;
  'np': number;
};

//生データの寝顔データから扱いやすいように改修
export interface procISleepFace {
  NP: number;
  energy: number;
  internalID: number;
  name: string;
  ID: number;
}

export class procCSleepFace implements procISleepFace {
  NP: number;
  energy: number;
  internalID: number;
  name: string;
  ID: number;

  constructor(NP: number, energy: number, internalID: number, name: string, ID: number) {
    this.NP = NP;
    this.energy = energy;
    this.internalID = internalID;
    this.name = name;
    this.ID = ID;
  }

  // ソートのための比較メソッド
  static compare(a: procISleepFace, b: procISleepFace): number {
    if (a.NP !== b.NP) return a.NP - b.NP;
    if (a.energy !== b.energy) return a.energy - b.energy;
    if (a.internalID !== b.internalID) return a.internalID - b.internalID;
    if (a.name !== b.name) return a.name < b.name ? -1 : 1;
    return a.ID - b.ID;
  }
}

export interface iResult{
  npXAxis: number;
  np: number;
  ev: number;
  leastOne: number;
  evUp: number;
  evLow: number;
  evForGrid: string,
  leastOneForGrid: number
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
  setChartTitle: React.Dispatch<React.SetStateAction<string[]>>;
  setChartSubTitle: React.Dispatch<React.SetStateAction<string>>;
}

export interface ChartProps {
  result: iResult[];
  chartTitle: string[];
  chartSubTitle: string;
}

export interface GridProps {
  result: iResult[];
}