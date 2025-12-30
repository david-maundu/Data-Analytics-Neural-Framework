
import React from 'react';
import type { CustomFactors } from '../types';
import { Plus, Minus, RotateCcw } from './icons';

interface SliderGroupProps {
  title: string;
  values: { [key: string]: number };
  onValueChange: (key: string, value: number) => void;
  color: string;
  category: keyof CustomFactors;
  subcategory: 'layer1' | 'layer2' | 'layer3' | null;
  onAddCustomFactor: () => void;
  onRemoveFactor: (factorName: string) => void;
  onResetGroup: () => void;
}

const SliderGroup: React.FC<SliderGroupProps> = ({
  title,
  values,
  onValueChange,
  color,
  category,
  onAddCustomFactor,
  onRemoveFactor,
  onResetGroup
}) => {
  const isBias = category === 'biasTerms';
  
  // Dynamic color mapping for accessibility and aesthetics
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-50/30',
    indigo: 'text-indigo-600 dark:text-indigo-400 border-indigo-500/20 bg-indigo-50/30',
    green: 'text-green-600 dark:text-green-400 border-green-500/20 bg-green-50/30',
    purple: 'text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-50/30',
    pink: 'text-pink-600 dark:text-pink-400 border-pink-500/20 bg-pink-50/30',
    yellow: 'text-yellow-600 dark:text-yellow-400 border-yellow-500/20 bg-yellow-50/30',
    red: 'text-red-600 dark:text-red-400 border-red-500/20 bg-red-50/30',
  };

  const currentColors = colorMap[color] || colorMap.indigo;

  return (
    <div className={`bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 transition-all hover:border-indigo-500/30 flex flex-col`}>
      <div className="flex justify-between items-center mb-8 pb-4 border-b dark:border-slate-800">
        <h3 className={`text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 ${currentColors.split(' ')[0]}`}>
            <span className={`w-2 h-2 rounded-full bg-current animate-pulse-slow`}></span>
            {title}
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={onAddCustomFactor}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
            title="Inject Contextual Variable"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={onResetGroup}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
            title="Reset Node Group"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-8">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="group/item">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] flex items-center">
                <span className="truncate">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                <button
                  onClick={() => onRemoveFactor(key)}
                  className="ml-2 p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 opacity-30 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all hover:scale-110 active:scale-95 shrink-0"
                  title="Remove Node"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </label>
              <span className={`text-xs font-mono font-black ${currentColors.split(' ')[0]}`}>
                {isBias ? (value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2)) : `${value}/10`}
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                type="range"
                min={isBias ? "-0.3" : "1"}
                max={isBias ? "0.3" : "10"}
                step={isBias ? "0.01" : "1"}
                value={value}
                onChange={(e) => onValueChange(key, isBias ? parseFloat(e.target.value) : parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
              />
            </div>
          </div>
        ))}
        {Object.keys(values).length === 0 && (
            <p className="text-[9px] font-black text-center text-slate-400 uppercase tracking-widest py-4 italic">No active nodes in group</p>
        )}
      </div>
    </div>
  );
};

export default SliderGroup;
