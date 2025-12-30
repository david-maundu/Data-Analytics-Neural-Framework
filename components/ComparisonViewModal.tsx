

import React, { useMemo, useState, useEffect } from 'react';
import type { Scenario, Results, AppState } from '../types';
import { X, Star, ChevronDown, ArrowUpRight, ArrowDownRight, SlidersHorizontal, Crosshair } from './icons';
import { calculateNeuralNetwork } from '../utils/calculations';

interface ComparisonViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: Scenario[];
}

interface ScenarioAnalysis {
  scenario: Scenario;
  results: Results;
}

type NumericResultKeys = {
  [K in keyof Results]: Results[K] extends number ? K : never;
}[keyof Results];

interface EnrichedAnalysis extends ScenarioAnalysis {
    strengths: { name: string, value: number }[];
    weaknesses: { name: string, value: number }[];
    deltas?: { [key in NumericResultKeys]: number };
    factorChanges: string[];
    calibrationChanges: string[];
    focusChanges: string[];
}

const getAllFactors = (state: AppState): Record<string, number> => ({
    ...state.problemFraming,
    ...state.realityWeights.layer1,
    ...state.realityWeights.layer2,
    ...state.realityWeights.layer3,
});

const ComparisonViewModal: React.FC<ComparisonViewModalProps> = ({ isOpen, onClose, scenarios }) => {
  const [baselineId, setBaselineId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && scenarios.length > 0 && !scenarios.some(s => s.id === baselineId)) {
      setBaselineId(scenarios[0].id);
    }
  }, [isOpen, scenarios, baselineId]);

  const analysisResults = useMemo((): EnrichedAnalysis[] => {
    if (!isOpen || !baselineId) return [];

    const rawAnalyses: ScenarioAnalysis[] = scenarios.map(scenario => {
      const { problemFraming, realityWeights, biasTerms, activationFunction, calibrationWeights, focusedFactors, problemFramingKeys, realityWeightsKeys, biasTermKeys } = scenario.state;
      const results = calculateNeuralNetwork(problemFraming, realityWeights, biasTerms, activationFunction, calibrationWeights, focusedFactors, problemFramingKeys, realityWeightsKeys, biasTermKeys);
      return { scenario, results };
    });

    const baselineAnalysis = rawAnalyses.find(a => a.scenario.id === baselineId);
    if (!baselineAnalysis) return [];
    
    const baselineState = baselineAnalysis.scenario.state;
    const baselineAllFactors = { ...getAllFactors(baselineState), ...baselineState.biasTerms };

    return rawAnalyses.map(currentAnalysis => {
      const currentState = currentAnalysis.scenario.state;
      const allFactors = getAllFactors(currentState);
      const sortedFactors = Object.entries(allFactors).sort(([, a], [, b]) => b - a);
      
      const deltas = currentAnalysis.scenario.id === baselineId ? undefined : {
          finalScore: currentAnalysis.results.finalScore - baselineAnalysis.results.finalScore,
          confidenceScore: currentAnalysis.results.confidenceScore - baselineAnalysis.results.confidenceScore,
          layer1Output: currentAnalysis.results.layer1Output - baselineAnalysis.results.layer1Output,
          layer2Output: currentAnalysis.results.layer2Output - baselineAnalysis.results.layer2Output,
          layer3Output: currentAnalysis.results.layer3Output - baselineAnalysis.results.layer3Output,
      };

      const factorChanges = currentAnalysis.scenario.id === baselineId ? [] : Object.keys({ ...allFactors, ...currentState.biasTerms })
          .map(key => {
            const currentVal = { ...allFactors, ...currentState.biasTerms }[key];
            const baselineVal = baselineAllFactors[key];
            if (currentVal !== baselineVal) {
                const from = baselineVal?.toFixed(2).replace(/\.00$/, '') || 'N/A';
                const to = currentVal.toFixed(2).replace(/\.00$/, '');
                const name = key.replace(/([A-Z])/g, ' $1');
                return `${name.charAt(0).toUpperCase() + name.slice(1)}: ${from} → ${to}`;
            }
            return null;
          }).filter((c): c is string => c !== null);

      const calibrationChanges = currentAnalysis.scenario.id === baselineId ? [] : Object.keys({ ...baselineState.calibrationWeights, ...currentState.calibrationWeights })
          .map(key => {
              const baselineVal = baselineState.calibrationWeights[key] ?? 1;
              const currentVal = currentState.calibrationWeights[key] ?? 1;
              if (baselineVal.toFixed(1) !== currentVal.toFixed(1)) {
                  const name = key.replace(/_/g, ' ');
                  return `${name.charAt(0).toUpperCase() + name.slice(1)}: ${baselineVal.toFixed(1)}x → ${currentVal.toFixed(1)}x`;
              }
              return null;
          }).filter((c): c is string => c !== null);

      const focusChanges = currentAnalysis.scenario.id === baselineId ? [] : Object.keys({ ...baselineState.focusedFactors, ...currentState.focusedFactors })
          .map(key => {
              const baselineVal = baselineState.focusedFactors[key];
              const currentVal = currentState.focusedFactors[key];
              const name = key.replace(/([A-Z])/g, ' $1');
              const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
              if (baselineVal === undefined && currentVal !== undefined) {
                  return `Added '${formattedName}' (${currentVal.toFixed(1)}x)`;
              }
              if (baselineVal !== undefined && currentVal === undefined) {
                  return `Removed '${formattedName}'`;
              }
              if (baselineVal !== undefined && currentVal !== undefined && baselineVal.toFixed(1) !== currentVal.toFixed(1)) {
                  return `'${formattedName}': ${baselineVal.toFixed(1)}x → ${currentVal.toFixed(1)}x`;
              }
              return null;
          }).filter((c): c is string => c !== null);

      return {
        ...currentAnalysis,
        strengths: sortedFactors.slice(0, 3).map(([name, value]) => ({ name, value })),
        weaknesses: sortedFactors.slice(-3).reverse().map(([name, value]) => ({ name, value })),
        deltas,
        factorChanges,
        calibrationChanges,
        focusChanges,
      };
    });
  }, [isOpen, scenarios, baselineId]);
  
  const maxScores = useMemo(() => {
      if (analysisResults.length === 0) return {} as Record<NumericResultKeys, number>;
      const findMax = (key: NumericResultKeys) => Math.max(...analysisResults.map(a => a.results[key]));
      return {
          finalScore: findMax('finalScore'),
          confidenceScore: findMax('confidenceScore'),
          layer1Output: findMax('layer1Output'),
          layer2Output: findMax('layer2Output'),
          layer3Output: findMax('layer3Output'),
      };
  }, [analysisResults]);

  if (!isOpen) return null;

  const MetricItem: React.FC<{title: string, value: number, delta?: number, isBest: boolean, unit?: string}> = 
  ({title, value, delta, isBest, unit = '%'}) => (
    <div className={`p-3 rounded-lg flex justify-between items-center transition-colors ${isBest ? 'bg-indigo-100/60 dark:bg-indigo-900/40' : 'bg-gray-100/60 dark:bg-gray-700/30'}`}>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
        <div className="flex items-center space-x-2">
            {delta !== undefined && (
                <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${delta >= 0 ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'}`}>
                    {delta >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {delta.toFixed(1)}
                </div>
            )}
            <p className="text-base font-bold text-gray-900 dark:text-white">{value.toFixed(0)}{unit}</p>
        </div>
    </div>
  );
  
  const StrategicAdjustmentSection: React.FC<{ analysis: EnrichedAnalysis }> = ({ analysis }) => {
      const { factorChanges, calibrationChanges, focusChanges, scenario } = analysis;
      const totalChanges = factorChanges.length + calibrationChanges.length + focusChanges.length;
      const isBaseline = scenario.id === baselineId;

      if (isBaseline) {
          return (
              <div className="p-3 bg-gray-100/60 dark:bg-gray-700/30 rounded-lg min-h-[40px] flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 italic">This is the baseline.</span>
              </div>
          );
      }

      if (totalChanges === 0) {
           return (
              <div className="p-3 bg-gray-100/60 dark:bg-gray-700/30 rounded-lg min-h-[40px] flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 italic">No changes from baseline.</span>
              </div>
          );
      }

      return (
          <div className="p-3 bg-gray-100/60 dark:bg-gray-700/30 rounded-lg">
               <details className="text-xs">
                  <summary className="cursor-pointer font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center">
                      {totalChanges} Strategic Adjustment(s)
                      <ChevronDown className="w-4 h-4 ml-1" />
                  </summary>
                  <div className="mt-3 space-y-3">
                      {calibrationChanges.length > 0 && (
                          <div>
                              <h6 className="font-semibold text-gray-600 dark:text-gray-300 flex items-center mb-1"><SlidersHorizontal className="w-3 h-3 mr-1.5" /> Calibration</h6>
                              <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300/90 font-mono pl-1">
                                  {calibrationChanges.map(change => <li key={change}>{change}</li>)}
                              </ul>
                          </div>
                      )}
                      {focusChanges.length > 0 && (
                          <div>
                              <h6 className="font-semibold text-gray-600 dark:text-gray-300 flex items-center mb-1"><Crosshair className="w-3 h-3 mr-1.5" /> Focus</h6>
                              <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300/90 font-mono pl-1">
                                  {focusChanges.map(change => <li key={change}>{change}</li>)}
                              </ul>
                          </div>
                      )}
                      {factorChanges.length > 0 && (
                          <div>
                              <h6 className="font-semibold text-gray-600 dark:text-gray-300 flex items-center mb-1">Factor Values</h6>
                              <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300/90 font-mono pl-1">
                                  {factorChanges.map(change => <li key={change}>{change}</li>)}
                              </ul>
                          </div>
                      )}
                  </div>
              </details>
          </div>
      );
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-7xl w-full mx-auto my-8 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scenario Comparison</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close modal">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${Math.min(analysisResults.length, 4)}, 1fr)` }}>
          {analysisResults.map((analysis) => {
            const { scenario, results, deltas, strengths, weaknesses } = analysis;
            const isBaseline = scenario.id === baselineId;

            return (
              <div key={scenario.id} className={`p-4 rounded-lg border-2 transition-all flex flex-col space-y-4 ${isBaseline ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700'}`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{scenario.name}</h3>
                  <button onClick={() => setBaselineId(scenario.id)} className="p-1 rounded-full hover:bg-yellow-200/50" title="Set as Baseline">
                    <Star className={`w-5 h-5 transition-colors ${isBaseline ? 'text-yellow-400 fill-current' : 'text-gray-400 dark:text-gray-500 hover:text-yellow-400'}`} />
                  </button>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-2 text-sm">Core Metrics</h4>
                  <div className="space-y-2">
                      <MetricItem title="Final Score" value={results.finalScore} delta={deltas?.finalScore} isBest={results.finalScore === maxScores.finalScore} />
                      <MetricItem title="Confidence" value={results.confidenceScore} delta={deltas?.confidenceScore} isBest={results.confidenceScore === maxScores.confidenceScore} />
                      <MetricItem title="Initial Viability" value={results.layer1Output} delta={deltas?.layer1Output} isBest={results.layer1Output === maxScores.layer1Output} />
                      <MetricItem title="Tech Feasibility" value={results.layer2Output} delta={deltas?.layer2Output} isBest={results.layer2Output === maxScores.layer2Output} />
                      <MetricItem title="Implementation" value={results.layer3Output} delta={deltas?.layer3Output} isBest={results.layer3Output === maxScores.layer3Output} />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-2 text-sm">Qualitative Analysis</h4>
                   <div className="space-y-2">
                       <div className="p-3 bg-gray-100/60 dark:bg-gray-700/30 rounded-lg">
                           <h5 className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Top 3 Strengths</h5>
                           <ul className="space-y-0.5">
                              {strengths.map(s => <li key={s.name} className="text-xs capitalize flex justify-between text-gray-700 dark:text-gray-300"><span>{s.name.replace(/([A-Z])/g, ' $1')}</span> <span className="font-mono text-blue-600 dark:text-blue-400">{s.value}/10</span></li>)}
                           </ul>
                       </div>
                       <div className="p-3 bg-gray-100/60 dark:bg-gray-700/30 rounded-lg">
                           <h5 className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Top 3 Weaknesses</h5>
                           <ul className="space-y-0.5">
                              {weaknesses.map(w => <li key={w.name} className="text-xs capitalize flex justify-between text-gray-700 dark:text-gray-300"><span>{w.name.replace(/([A-Z])/g, ' $1')}</span> <span className="font-mono text-red-600 dark:text-red-400">{w.value}/10</span></li>)}
                           </ul>
                       </div>
                   </div>
                </div>

                <div>
                   <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-2 text-sm">Strategic Adjustments</h4>
                   <StrategicAdjustmentSection analysis={analysis} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparisonViewModal;
