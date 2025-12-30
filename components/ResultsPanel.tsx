
import React from 'react';
import { TrendingUp, CheckCircle, AlertCircle } from './icons.tsx';
import ImpactFactors from './ImpactFactors.tsx';
import ScenarioManager from './ScenarioManager.tsx';
import type { Results, ImpactFactor, Scenario, FocusedFactors, CalibrationWeights } from '../types.ts';

interface ResultsPanelProps {
    results: Results;
    impactFactors: ImpactFactor[];
    impactFactorCount: number;
    onImpactFactorCountChange: (count: number) => void;
    focusedFactors: FocusedFactors;
    onFocusedFactorsChange: (name: string, value: number) => void;
    onRemoveFocusedFactor: (name: string) => void;
    hiddenImpactFactors: string[];
    onHiddenImpactFactorsChange: (factors: string[]) => void;
    onOpenAddImpactFactorModal: () => void;
    allFactors: { [key: string]: number };
    scenarios: Scenario[];
    onSaveScenario: (name: string) => void;
    onLoadScenario: (id: string) => void;
    onDeleteScenario: (id: string) => void;
    onCompareScenarios: (ids: string[]) => void;
    onShare: () => void;
    calibrationWeights: CalibrationWeights;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
    results,
    impactFactors,
    impactFactorCount,
    onImpactFactorCountChange,
    focusedFactors,
    onFocusedFactorsChange,
    onRemoveFocusedFactor,
    hiddenImpactFactors,
    onHiddenImpactFactorsChange,
    onOpenAddImpactFactorModal,
    allFactors,
    scenarios,
    onSaveScenario,
    onLoadScenario,
    onDeleteScenario,
    onCompareScenarios,
    onShare,
    calibrationWeights,
}) => {
    return (
        <div className="lg:sticky lg:top-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                    <TrendingUp className="w-6 h-6 text-indigo-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Neural Network Results</h2>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{results.layer1Output.toFixed(1)}%</div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Initial Viability</div>
                    </div>
                     <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{results.layer2Output.toFixed(1)}%</div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Tech Feasibility</div>
                    </div>
                     <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{results.layer3Output.toFixed(1)}%</div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Implementation</div>
                    </div>
                     <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{results.finalScore.toFixed(0)}%</div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Final Score</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 group relative">
                            <span className="font-semibold">{results.confidenceScore.toFixed(0)}%</span> Confidence
                             <div className="absolute bottom-full mb-2 w-48 bg-black text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1/2 left-1/2">
                                Based on input variance. High variance (e.g., many 1s and 10s) leads to lower confidence.
                                <svg className="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50`}>
                    <div className={`flex items-center justify-center mb-2 ${results.recommendationColor}`}>
                        {results.finalScore >= 60 ? <CheckCircle className="w-6 h-6 mr-2" /> : <AlertCircle className="w-6 h-6 mr-2" />}
                        <div className="text-lg font-bold">{results.recommendation}</div>
                    </div>
                </div>

                <hr className="my-6 border-gray-200 dark:border-gray-700" />

                <ImpactFactors 
                    factors={impactFactors}
                    count={impactFactorCount}
                    onCountChange={onImpactFactorCountChange}
                    focusedFactors={focusedFactors}
                    onFocusedFactorsChange={onFocusedFactorsChange}
                    onRemoveFocusedFactor={onRemoveFocusedFactor}
                    hiddenImpactFactors={hiddenImpactFactors}
                    onHiddenImpactFactorsChange={onHiddenImpactFactorsChange}
                    onOpenAddImpactFactorModal={onOpenAddImpactFactorModal}
                />
                
                <hr className="my-6 border-gray-200 dark:border-gray-700" />
                
                <ScenarioManager
                    scenarios={scenarios}
                    onSave={onSaveScenario}
                    onLoad={onLoadScenario}
                    onDelete={onDeleteScenario}
                    onCompare={onCompareScenarios}
                    onShare={onShare}
                />
            </div>
        </div>
    );
};

export default ResultsPanel;
