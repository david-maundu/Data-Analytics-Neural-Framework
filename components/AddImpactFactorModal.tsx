import React, { useState, useMemo } from 'react';
import { X } from './icons';

interface AddImpactFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFactor: (factorName: string) => void;
  allFactorNames: string[];
  existingFactorNames: string[];
}

const AddImpactFactorModal: React.FC<AddImpactFactorModalProps> = ({
  isOpen,
  onClose,
  onAddFactor,
  allFactorNames,
  existingFactorNames,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const availableFactors = useMemo(() => {
    return allFactorNames
      .filter(name => !existingFactorNames.includes(name))
      .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort();
  }, [allFactorNames, existingFactorNames, searchTerm]);

  if (!isOpen) return null;

  const handleAdd = (factorName: string) => {
    onAddFactor(factorName);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Add Factor of Focus</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a factor..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
          autoFocus
        />
        <div className="overflow-y-auto flex-grow pr-2 -mr-2">
            {availableFactors.length > 0 ? (
                <ul className="space-y-1">
                    {availableFactors.map(factorName => (
                        <li key={factorName}>
                            <button 
                                onClick={() => handleAdd(factorName)}
                                className="w-full text-left p-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 capitalize"
                            >
                                {factorName.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">No available factors match your search.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddImpactFactorModal;