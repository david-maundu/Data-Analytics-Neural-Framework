import React from 'react';
import { X, RotateCcw } from './icons';
import type { CalibrationWeights } from '../types';

interface CalibrationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  weights: CalibrationWeights;
  onWeightChange: (key: string, value: number) => void;
  onReset: () => void;
}

const categoryLabels: { [key: string]: string } = {
    problem_definition: "🎯 Problem Definition",
    problem_stakeholder: "👥 Stakeholder Dynamics",
    problem_business: "💼 Business Context",
    problem_readiness: "📊 Data & Analytics Readiness",
    problem_success: "🎖️ Success Criteria",
    l1_resource: "💰 L1: Resource Constraints",
    l1_data: "📈 L1: Data Reality",
    l1_org: "🏢 L1: Organizational Context",
    l1_risk: "⚠️ L1: Risk Management",
    l2_infra: "🖥️ L2: Technical Infrastructure",
    l2_dev: "⚙️ L2: Solution Development",
    l2_team: "👨‍💻 L2: Team Capabilities",
    l3_readiness: "🚀 L3: Implementation Readiness",
    l3_integration: "🔗 L3: Business Integration",
    l3_value: "💎 L3: Value Realization",
    bias_org: "🏛️ Bias: Organizational",
    bias_external: "🌍 Bias: External",
};


const CalibrationPanel: React.FC<CalibrationPanelProps> = ({
  isOpen,
  onClose,
  weights,
  onWeightChange,
  onReset
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-4 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Advanced Calibration</h3>
          <div className="flex items-center space-x-2">
            <button onClick={onReset} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Reset weights">
                <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close modal">
                <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Adjust the relative importance of each category in the calculation. A weight of 1x is the default. Setting "Data Reality" to 1.5x makes it 50% more influential than other categories in its layer.
        </p>

        <div className="overflow-y-auto pr-4 -mr-4 flex-grow">
          <div className="space-y-4">
            {Object.entries(weights).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {categoryLabels[key] || key}
                  </label>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 w-16 text-center">
                    {value.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={value}
                  onChange={(e) => onWeightChange(key, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t dark:border-gray-700">
            <button
                onClick={onClose}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationPanel;
