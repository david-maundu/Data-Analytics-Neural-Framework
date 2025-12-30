
import React, { useState } from 'react';
import type { Scenario } from '../types';
import { Save, Trash2, Columns, Share2 } from './icons';

interface ScenarioManagerProps {
    scenarios: Scenario[];
    onSave: (name: string) => void;
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
    onCompare: (ids: string[]) => void;
    onShare: () => void;
}

const ScenarioManager: React.FC<ScenarioManagerProps> = ({
    scenarios,
    onSave,
    onLoad,
    onDelete,
    onCompare,
    onShare,
}) => {
    const [scenarioName, setScenarioName] = useState('');
    const [selectedToCompare, setSelectedToCompare] = useState<string[]>([]);
    const [notification, setNotification] = useState('');

    const handleSave = () => {
        if (scenarioName.trim()) {
            onSave(scenarioName.trim());
            setScenarioName('');
        }
    };

    const handleCompareToggle = (id: string) => {
        setSelectedToCompare(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleShareClick = () => {
        onShare();
        setNotification('Link copied to clipboard!');
        setTimeout(() => setNotification(''), 3000);
    };

    return (
        <div className="mt-6 relative">
            <div>
                <h3 className="text-xs font-black text-gray-800 dark:text-gray-200 mb-4 uppercase tracking-[0.2em]">
                    Scenario Management & Reporting
                </h3>
                
                <div className="flex items-center space-x-2 mb-4">
                    <input
                        type="text"
                        value={scenarioName}
                        onChange={e => setScenarioName(e.target.value)}
                        placeholder="Commit Scenario Label..."
                        className="flex-grow px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-xs font-bold uppercase tracking-tight placeholder:text-gray-400"
                        onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                    />
                    <button
                        onClick={handleSave}
                        disabled={!scenarioName.trim()}
                        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 transition-all shadow-md active:scale-95"
                        title="Commit to Vault"
                    >
                        <Save className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {scenarios.map(scenario => (
                        <div key={scenario.id} className="group flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-transparent hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center truncate">
                                <input
                                    type="checkbox"
                                    id={`compare-${scenario.id}`}
                                    checked={selectedToCompare.includes(scenario.id)}
                                    onChange={() => handleCompareToggle(scenario.id)}
                                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor={`compare-${scenario.id}`} className="ml-3 text-[10px] font-black uppercase text-gray-800 dark:text-gray-200 cursor-pointer truncate" onClick={() => onLoad(scenario.id)}>
                                    {scenario.name}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onLoad(scenario.id)} className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest px-2">
                                    Load
                                </button>
                                <button onClick={() => onDelete(scenario.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {scenarios.length === 0 && <p className="text-[9px] font-black text-center text-gray-500 uppercase tracking-widest py-8 opacity-40">Repository Empty</p>}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6">
                    <button
                        onClick={() => onCompare(selectedToCompare)}
                        disabled={selectedToCompare.length < 2}
                        className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-all text-[10px] font-black uppercase tracking-widest shadow-md"
                    >
                        <Columns className="w-4 h-4 mr-2" />
                        Compare ({selectedToCompare.length})
                    </button>
                    <button
                        onClick={handleShareClick}
                        className="flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-[10px] font-black uppercase tracking-widest shadow-md"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Link
                    </button>
                </div>
                {notification && <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 text-center mt-3 uppercase tracking-widest">{notification}</p>}
            </div>
        </div>
    );
};

export default ScenarioManager;
