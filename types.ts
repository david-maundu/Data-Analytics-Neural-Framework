
export interface ProblemFraming {
  [key: string]: number;
}

export interface RealityLayer {
  [key: string]: number;
}

export interface RealityWeights {
  layer1: RealityLayer;
  layer2: RealityLayer;
  layer3: RealityLayer;
}

export interface BiasTerms {
  [key: string]: number;
}

export interface CustomFactors {
  problemFraming: { [key: string]: boolean };
  layer1Weights: { [key: string]: boolean };
  layer2Weights: { [key:string]: boolean };
  layer3Weights: { [key: string]: boolean };
  biasTerms: { [key: string]: boolean };
}

export interface Results {
  layer1Output: number;
  layer2Output: number;
  layer3Output: number;
  finalScore: number;
  confidenceScore: number;
  recommendation: string;
  recommendationColor: string;
}

export type ActivationFunction = 'sigmoid' | 'leakyRelu' | 'swish';

export interface ImpactFactor {
  name: string;
  impact: number;
}

export type ProblemFramingKeys = {
  [key: string]: string[];
};
export type RealityWeightsKeys = {
  layer1: { [key: string]: string[] };
  layer2: { [key: string]: string[] };
  layer3: { [key: string]: string[] };
};
export type BiasTermKeys = {
  [key: string]: string[];
};

export interface CalibrationWeights {
    [key: string]: number;
}

export type FocusedFactors = { [key: string]: number };

export interface AppState {
  problemFraming: ProblemFraming;
  realityWeights: RealityWeights;
  biasTerms: BiasTerms;
  activationFunction: ActivationFunction;
  calibrationWeights: CalibrationWeights;
  focusedFactors: FocusedFactors;
  customFactors: CustomFactors;
  problemFramingKeys: ProblemFramingKeys;
  realityWeightsKeys: RealityWeightsKeys;
  biasTermKeys: BiasTermKeys;
}

export interface Scenario {
  id: string;
  name: string;
  state: AppState;
  createdAt: string;
}
