import type {
  ProblemFraming,
  RealityWeights,
  BiasTerms,
  ActivationFunction,
  Results,
  ImpactFactor,
  CalibrationWeights,
  FocusedFactors,
} from '../types';

// Activation Functions
const activationFunctions = {
  sigmoid: (x: number): number => 1 / (1 + Math.exp(-x)),
  leakyRelu: (x: number): number => (x > 0 ? x : 0.01 * x),
  swish: (x: number): number => x / (1 + Math.exp(-x)), // x * sigmoid(x)
};

// Mean Calculation Helpers
const arithmeticMean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
};

const geometricMean = (values: number[]): number => {
  if (values.length === 0) return 0;
  // Use a small floor value to prevent multiplication by zero from nullifying the entire score,
  // while still heavily penalizing very low values.
  const product = values.reduce((prod, v) => prod * (v > 0 ? v : 0.01), 1);
  return Math.pow(product, 1 / values.length);
};

// Helper to get a subset of values from an object
const getValues = (obj: { [key: string]: number }, keys: string[]): number[] => {
    return keys.map(key => obj[key]).filter(v => v !== undefined);
};

const calculateConfidenceScore = (
    problemFraming: ProblemFraming,
    realityWeights: RealityWeights
): number => {
    const allValues = [
        ...Object.values(problemFraming),
        ...Object.values(realityWeights.layer1),
        ...Object.values(realityWeights.layer2),
        ...Object.values(realityWeights.layer3),
    ];

    if (allValues.length < 2) return 100;

    // Normalize all values to a 0-1 range for consistent standard deviation calculation
    const normalizedValues = allValues.map(v => v / 10);
    const mean = arithmeticMean(normalizedValues);
    const stdDev = Math.sqrt(arithmeticMean(normalizedValues.map(v => Math.pow(v - mean, 2))));
    
    // The maximum possible standard deviation for a 0-1 range is 0.5 (when half are 0, half are 1)
    // We map this standard deviation to a confidence score: 0 std dev -> 100% confidence. 0.5 std dev -> 0% confidence.
    const confidence = Math.max(0, (1 - stdDev / 0.5)) * 100;

    return confidence;
};

const applyFocusMultipliers = (
    problemFraming: ProblemFraming,
    realityWeights: RealityWeights,
    focusedFactors: FocusedFactors
): { focusedProblemFraming: ProblemFraming, focusedRealityWeights: RealityWeights } => {
    const focusedProblemFraming = { ...problemFraming };
    const focusedRealityWeights = JSON.parse(JSON.stringify(realityWeights));

    for (const [factor, multiplier] of Object.entries(focusedFactors)) {
        if (factor in focusedProblemFraming) {
            focusedProblemFraming[factor] = Math.min(10, focusedProblemFraming[factor] * multiplier);
        } else if (factor in focusedRealityWeights.layer1) {
            focusedRealityWeights.layer1[factor] = Math.min(10, focusedRealityWeights.layer1[factor] * multiplier);
        } else if (factor in focusedRealityWeights.layer2) {
            focusedRealityWeights.layer2[factor] = Math.min(10, focusedRealityWeights.layer2[factor] * multiplier);
        } else if (factor in focusedRealityWeights.layer3) {
            focusedRealityWeights.layer3[factor] = Math.min(10, focusedRealityWeights.layer3[factor] * multiplier);
        }
    }

    return { focusedProblemFraming, focusedRealityWeights };
}


export const calculateNeuralNetwork = (
  problemFraming: ProblemFraming,
  realityWeights: RealityWeights,
  biasTerms: BiasTerms,
  activationFunction: ActivationFunction,
  calibrationWeights: CalibrationWeights,
  focusedFactors: FocusedFactors,
  problemFramingKeys: any, // Using 'any' for simplicity, should match RealityWeightsKeys structure
  realityWeightsKeys: any,
  biasTermKeys: any
): Results => {
  const activation = activationFunctions[activationFunction];

  const { focusedProblemFraming, focusedRealityWeights } = applyFocusMultipliers(problemFraming, realityWeights, focusedFactors);

  // Calculate Potentials and Constraints with Calibration Weights
  const pf_definition = arithmeticMean(getValues(focusedProblemFraming, problemFramingKeys.definition));
  const pf_stakeholder = arithmeticMean(getValues(focusedProblemFraming, problemFramingKeys.stakeholder));
  const pf_business = arithmeticMean(getValues(focusedProblemFraming, problemFramingKeys.business));
  const pf_readiness = arithmeticMean(getValues(focusedProblemFraming, problemFramingKeys.readiness));
  const pf_success = arithmeticMean(getValues(focusedProblemFraming, problemFramingKeys.success));
  
  const weightedPfScores = [
      pf_definition * calibrationWeights.problem_definition,
      pf_stakeholder * calibrationWeights.problem_stakeholder,
      pf_business * calibrationWeights.problem_business,
      pf_readiness * calibrationWeights.problem_readiness,
      pf_success * calibrationWeights.problem_success,
  ];
  const problemFramingPotential = arithmeticMean(weightedPfScores) / 10;
  
  const bias_org = arithmeticMean(getValues(biasTerms, biasTermKeys.org));
  const bias_external = arithmeticMean(getValues(biasTerms, biasTermKeys.external));
  const biasSum = (bias_org * calibrationWeights.bias_org) + (bias_external * calibrationWeights.bias_external);

  const adjustedPotential = problemFramingPotential + biasSum;
  
  // Layer 1
  const l1_resource = geometricMean(getValues(focusedRealityWeights.layer1, realityWeightsKeys.layer1.resource));
  const l1_data = geometricMean(getValues(focusedRealityWeights.layer1, realityWeightsKeys.layer1.data));
  const l1_org = geometricMean(getValues(focusedRealityWeights.layer1, realityWeightsKeys.layer1.org));
  const l1_risk = geometricMean(getValues(focusedRealityWeights.layer1, realityWeightsKeys.layer1.risk));
  const layer1Constraint = geometricMean([
      l1_resource * calibrationWeights.l1_resource,
      l1_data * calibrationWeights.l1_data,
      l1_org * calibrationWeights.l1_org,
      l1_risk * calibrationWeights.l1_risk,
  ]) / 10;

  // Layer 2
  const l2_infra = geometricMean(getValues(focusedRealityWeights.layer2, realityWeightsKeys.layer2.infra));
  const l2_dev = geometricMean(getValues(focusedRealityWeights.layer2, realityWeightsKeys.layer2.dev));
  const l2_team = geometricMean(getValues(focusedRealityWeights.layer2, realityWeightsKeys.layer2.team));
  const layer2Constraint = geometricMean([
      l2_infra * calibrationWeights.l2_infra,
      l2_dev * calibrationWeights.l2_dev,
      l2_team * calibrationWeights.l2_team,
  ]) / 10;

  // Layer 3
  const l3_readiness = geometricMean(getValues(focusedRealityWeights.layer3, realityWeightsKeys.layer3.readiness));
  const l3_integration = geometricMean(getValues(focusedRealityWeights.layer3, realityWeightsKeys.layer3.integration));
  const l3_value = geometricMean(getValues(focusedRealityWeights.layer3, realityWeightsKeys.layer3.value));
  const layer3Constraint = geometricMean([
      l3_readiness * calibrationWeights.l3_readiness,
      l3_integration * calibrationWeights.l3_integration,
      l3_value * calibrationWeights.l3_value,
  ]) / 10;

  const layer1Input = adjustedPotential * layer1Constraint;
  const layer1OutputRaw = activation(layer1Input);
  
  const layer2Input = layer1OutputRaw * layer2Constraint;
  const layer2OutputRaw = activation(layer2Input);

  const layer3Input = layer2OutputRaw * layer3Constraint;
  const layer3OutputRaw = activation(layer3Input);
  
  const normalize = (val: number) => (Math.tanh(val / 2) + 1) / 2 * 100;

  const layer1Output = normalize(layer1OutputRaw);
  const layer2Output = normalize(layer2OutputRaw);
  const layer3Output = normalize(layer3OutputRaw);
  const finalScore = normalize(layer3OutputRaw);
  const confidenceScore = calculateConfidenceScore(focusedProblemFraming, focusedRealityWeights);

  let recommendation = '';
  let recommendationColor = '';
    
  if (finalScore >= 80) {
    recommendation = 'Excellent - Proceed with high confidence';
    recommendationColor = 'text-green-600 dark:text-green-400';
  } else if (finalScore >= 60) {
    recommendation = 'Good - Proceed with minor adjustments';
    recommendationColor = 'text-blue-600 dark:text-blue-400';
  } else if (finalScore >= 40) {
    recommendation = 'Moderate - Requires significant improvements';
    recommendationColor = 'text-yellow-600 dark:text-yellow-400';
  } else {
    recommendation = 'Poor - Major rework needed';
    recommendationColor = 'text-red-600 dark:text-red-400';
  }
  
  return {
    layer1Output,
    layer2Output,
    layer3Output,
    finalScore,
    confidenceScore,
    recommendation,
    recommendationColor,
  };
};

export const calculateSensitivityAnalysis = (
  problemFraming: ProblemFraming,
  realityWeights: RealityWeights,
  biasTerms: BiasTerms,
  activationFunction: ActivationFunction,
  baseScore: number,
  calibrationWeights: CalibrationWeights,
  focusedFactors: FocusedFactors,
  problemFramingKeys: any,
  realityWeightsKeys: any,
  biasTermKeys: any
): ImpactFactor[] => {
    const factors: ImpactFactor[] = [];
    const delta = 0.1;

    // Test Problem Framing and Reality Weights (scale 1-10)
    for (const category of ['problemFraming', 'layer1', 'layer2', 'layer3'] as const) {
        const source = category === 'problemFraming' ? problemFraming : realityWeights[category];
        for (const key in source) {
            const tempProblemFraming = { ...problemFraming };
            const tempRealityWeights = JSON.parse(JSON.stringify(realityWeights));

            if (category === 'problemFraming') {
                tempProblemFraming[key] += delta;
            } else {
                tempRealityWeights[category][key] += delta;
            }

            const newScore = calculateNeuralNetwork(tempProblemFraming, tempRealityWeights, biasTerms, activationFunction, calibrationWeights, focusedFactors, problemFramingKeys, realityWeightsKeys, biasTermKeys).finalScore;
            factors.push({ name: key, impact: newScore - baseScore });
        }
    }

    // Test Bias Terms (scale -0.3 to 0.3)
    for (const key in biasTerms) {
        const tempBiasTerms = { ...biasTerms };
        tempBiasTerms[key] += delta / 10; // Smaller delta for bias terms

        const newScore = calculateNeuralNetwork(problemFraming, realityWeights, tempBiasTerms, activationFunction, calibrationWeights, focusedFactors, problemFramingKeys, realityWeightsKeys, biasTermKeys).finalScore;
        factors.push({ name: key, impact: newScore - baseScore });
    }

    return factors
        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
};