import React, { useMemo } from 'react';
import { Zap, Plus, RotateCcw, Crosshair, X, EyeOff } from './icons';
import type { ImpactFactor, FocusedFactors } from '../types';

interface ImpactFactorsProps {
    factors: ImpactFactor[];
    count: number;
    onCountChange: (count: number) => void;
    focusedFactors: FocusedFactors;
    onFocusedFactorsChange: (name: string, value: number) => void;
    onRemoveFocusedFactor: (name: string) => void;
    hiddenImpactFactors: string[];
    onHiddenImpactFactorsChange: (factors: string[]) => void;
    onOpenAddImpactFactorModal: () => void;
}

const ImpactFactors: React.FC<ImpactFactorsProps> = ({ 
    factors,
    count,
    onCountChange,
    focusedFactors,
    onFocusedFactorsChange,
    onRemoveFocusedFactor,
    hiddenImpactFactors,
    onHiddenImpactFactorsChange,
    onOpenAddImpactFactorModal
}) => {

    const displayedFactors = useMemo(() => {
        const topCalculatedFactors = factors
            .filter(f => !hiddenImpactFactors.includes(f.name) && !focusedFactors[f.name])
            .slice(0, count);

        const focusedFactorData = Object.keys(focusedFactors)
            .map(focusedName => factors.find(f => f.name === focusedName))
            .filter((f): f is ImpactFactor => f !== undefined);

        const combined = [...focusedFactorData, ...topCalculatedFactors];
        
        return combined.filter((factor, index, self) => 
            index === self.findIndex((f) => f.name === factor.name)
        );
    }, [factors, count, focusedFactors, hiddenImpactFactors]);

    if (!factors || factors.length === 0) {
        return null;
    }

    const maxImpact = Math.max(...displayedFactors.map(f => Math.abs(f.impact)), 1);
    
    const handleReset = () => {
        onCountChange(5);
        onHiddenImpactFactorsChange([]);
        // Clear all focused factors one by one
        Object.keys(focusedFactors).forEach(name => onRemoveFocusedFactor(name));
    }
    
    const handleHide = (factorName: string) => {
        onHiddenImpactFactorsChange([...hiddenImpactFactors, factorName]);
    };

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Strategic Focus Workbench
                </h3>
                <div className="flex items-center space-x-2">
                     <button onClick={onOpenAddImpactFactorModal} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Add Factor of Focus">
                        <Plus className="w-4 h-4" />
                    </button>
                    <button onClick={handleReset} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Reset Workbench">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
             <div className="mb-4">
                <div className="flex justify-between items-center mb-1 text-sm">
                  <label className="font-medium text-gray-700 dark:text-gray-300">Display Top Calculated</label>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{count} Factors</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={count}
                  onChange={(e) => onCountChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="space-y-4">
                {displayedFactors.map(({ name, impact }) => {
                    const isPositive = impact >= 0;
                    const width = (Math.abs(impact) / maxImpact) * 100;
                    const barColor = isPositive ? 'bg-green-500' : 'bg-red-500';
                    const isFocused = !!focusedFactors[name];

                    return (
                        <div key={name} className="group">
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300 capitalize flex items-center">
                                    {isFocused ? 
                                        <Crosshair className="w-4 h-4 mr-1.5 text-purple-500" title="Factor of Focus"/> :
                                        <Zap className="w-4 h-4 mr-1.5 text-yellow-500" title="Calculated Impact Factor"/>
                                    }
                                    {name.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </span>
                                <div className="flex items-center space-x-2">
                                    {isFocused ? (
                                        <button onClick={() => onRemoveFocusedFactor(name)} className="p-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100" title="Remove Focus">
                                            <X className="w-3 h-3" />
                                        </button>
                                    ) : (
                                         <button onClick={() => handleHide(name)} className="p-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors opacity-0 group-hover:opacity-100" title="Hide Factor">
                                            <EyeOff className="w-3 h-3" />
                                        </button>
                                    )}
                                    <span className={`font-bold w-12 text-right ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {isPositive ? '+' : ''}{impact.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                    className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
                                    style={{ width: `${width}%` }}
                                ></div>
                            </div>
                            {isFocused && (
                                <div className="mt-2 pl-5">
                                    <div className="flex justify-between items-center mb-1 text-xs">
                                        <label className="font-medium text-gray-600 dark:text-gray-400">Focus Multiplier</label>
                                        <span className="font-bold text-purple-600 dark:text-purple-400">{focusedFactors[name].toFixed(1)}x</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="1.1"
                                      max="1.5"
                                      step="0.1"
                                      value={focusedFactors[name]}
                                      onChange={(e) => onFocusedFactorsChange(name, parseFloat(e.target.value))}
                                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Calculated impact (⚡) and manually added factors of strategic focus (🎯).
            </p>
        </div>
    );
};

export default ImpactFactors;