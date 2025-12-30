import React from 'react';
import { X } from './icons';

interface AddFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
  newFactorName: string;
  setNewFactorName: (name: string) => void;
}

const AddFactorModal: React.FC<AddFactorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  newFactorName,
  setNewFactorName,
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
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Add Custom Factor</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Adding to: <span className="font-semibold capitalize">{categoryName}</span>
        </p>
        <input
          type="text"
          value={newFactorName}
          onChange={(e) => setNewFactorName(e.target.value)}
          placeholder="e.g., Team Morale"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
          onKeyPress={(e) => e.key === 'Enter' && newFactorName.trim() && onConfirm()}
          autoFocus
        />
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            disabled={!newFactorName.trim()}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add Factor
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFactorModal;