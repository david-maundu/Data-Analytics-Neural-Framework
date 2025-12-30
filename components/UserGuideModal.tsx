
import React from 'react';
import { X, Brain, SlidersHorizontal, Zap, Crosshair, Save, Columns, BarChart3, Settings2 } from './icons';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const Section = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <div className="pl-14 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-bold space-y-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[85vh] rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-10 py-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Operational Protocol</h2>
            <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.4em] mt-1">Version 2.5.1 Deployment Manual</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-10 py-12 custom-scrollbar">
          <Section icon={Brain} title="Neural Core Basics">
            <p>The framework maps qualitative strategic drivers into a quantitative actionability index. It utilizes a three-tier neural architecture:</p>
            <ul className="list-disc space-y-2 pl-4">
              <li><span className="text-indigo-600 dark:text-indigo-400">Potential Vector:</span> The arithmetic mean of framing factors defines your project's theoretical ceiling.</li>
              <li><span className="text-indigo-600 dark:text-indigo-400">Gated Filtering:</span> Constraints are processed via a <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Geometric Mean</span>, meaning a single score of 1 in a critical area (e.g. Budget) will bottleneck the entire ROI potential.</li>
              <li><span className="text-indigo-600 dark:text-indigo-400">Sigmoid Normalization:</span> Scores are activated through a non-linear gate to simulate organizational entropy.</li>
            </ul>
          </Section>

          <Section icon={Settings2} title="Variable Manipulation">
            <p>The engine is modular. You can adapt the workspace to any project context:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="mb-2 uppercase text-[9px] text-indigo-500 font-black">Adding Nodes</p>
                <p>Click the <span className="text-indigo-600 font-black">+</span> icon on any group header to inject a custom variable. This will be automatically factored into that specific layer's score.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="mb-2 uppercase text-[9px] text-indigo-500 font-black">Removing Nodes</p>
                <p>Hover over any variable label to reveal the minus icon. Removing nodes dynamically recalibrates the layer mean without refreshing the state.</p>
              </div>
            </div>
          </Section>

          <Section icon={SlidersHorizontal} title="Advanced Calibration">
            <p>Global weights control the "Significance Sensitivity" of entire categories. Access this via the slider icon in the main header.</p>
            <ul className="list-disc space-y-2 pl-4">
              <li><span className="text-indigo-600 dark:text-indigo-400">Range [0.5x - 2.0x]:</span> A category weighted at 2.0x exerts twice as much influence on its parent layer's output.</li>
              <li><span className="text-indigo-600 dark:text-indigo-400">Cross-Category Tuning:</span> Use this to simulate environments where specific disciplines (e.g. Data Quality) are the absolute primary success driver.</li>
            </ul>
          </Section>

          <Section icon={Crosshair} title="Strategic Focus Workbench">
            <p>Located in the results sidebar, the workbench allows you to "Pin" specific variables for sensitivity testing.</p>
            <p>By applying a <span className="text-purple-500 font-black">Focus Multiplier</span> (1.1x - 1.5x), you simulate a scenario where executive management prioritizes that specific driver. This allows you to see how much improvement in a single variable affects the overall project viability.</p>
          </Section>

          <Section icon={Save} title="Scenario Vault & Intelligence">
            <p>Never lose a configuration. The scenario vault saves the entire state of the engine—custom factors, weights, and focuses—to your local browser storage.</p>
            <p>Use the <span className="text-indigo-600 font-black">Share Link</span> feature to generate a base64-encoded URL hash. Sending this link to a colleague will allow them to boot the framework with your exact configuration.</p>
          </Section>

          <Section icon={Columns} title="A/B Comparative Analysis">
            <p>Check the boxes next to saved scenarios in the sidebar and click <span className="text-blue-600 font-black">Compare</span> to open the comparison engine.</p>
            <p>This provides a side-by-side breakdown of Core Metrics, identifies specific <span className="text-green-600">Strengths</span> and <span className="text-red-600">Weaknesses</span>, and lists every single Strategic Adjustment made between the baseline and the target scenario.</p>
          </Section>
        </div>

        <footer className="px-10 py-8 bg-slate-50/50 dark:bg-slate-950/50 border-t dark:border-slate-800 flex justify-between items-center">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">End of Documentation</p>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20"
          >
            Acknowledge & Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UserGuideModal;
