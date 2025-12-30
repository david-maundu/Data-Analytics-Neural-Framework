import React from 'react';
import type { Results, ProblemFraming, RealityWeights, BiasTerms, ImpactFactor } from '../types';
import { TrendingUp, CheckCircle, AlertCircle, Zap, Sparkles } from './icons';

interface PrintSummaryProps {
  id: string;
  results: Results;
  problemFraming: ProblemFraming;
  realityWeights: RealityWeights;
  biasTerms: BiasTerms;
  aiAnalysisText: string;
  impactFactors: ImpactFactor[];
}

const FactorTable: React.FC<{ title: string; factors: { [key: string]: number }, isBias?: boolean }> = ({ title, factors, isBias }) => (
  <div className="mb-6" style={{ breakInside: 'avoid' }}>
    <h4 className="font-bold text-lg mb-2 text-gray-800">{title}</h4>
    <table className="w-full border-collapse text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 font-semibold text-left border border-gray-300">Factor</th>
          <th className="p-2 font-semibold text-right border border-gray-300">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(factors).map(([key, value]) => (
          <tr key={key} className="even:bg-gray-50">
            <td className="p-2 border border-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</td>
            <td className="p-2 border border-gray-300 text-right font-mono">{isBias ? value.toFixed(2) : value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PrintImpactFactors: React.FC<{ factors: ImpactFactor[] }> = ({ factors }) => {
    if (!factors || factors.length === 0) return null;
    const maxImpact = Math.max(...factors.map(f => Math.abs(f.impact)), 1);

    return (
        <section className="p-6 rounded-lg border bg-white mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center"><Zap className="w-5 h-5 mr-2 text-yellow-500" /> Key Impact Factors</h3>
            <div className="space-y-3">
                {factors.map(({ name, impact }) => {
                    const isPositive = impact >= 0;
                    const width = (Math.abs(impact) / maxImpact) * 100;
                    return (
                        <div key={name}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-medium capitalize">{name.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                                <span className={`font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>{isPositive ? '+' : ''}{impact.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2"><div className={`${isPositive ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} style={{ width: `${width}%` }}></div></div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};


const PrintSummary: React.FC<PrintSummaryProps> = ({
  id,
  results,
  problemFraming,
  realityWeights,
  biasTerms,
  aiAnalysisText,
  impactFactors,
}) => {
  return (
    <div id={id} className="p-8 font-sans text-gray-900 bg-white" style={{ width: '210mm' }}>
      <header className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Data Analytics Neural Framework Report</h1>
        <p className="text-gray-600 mt-2">Generated on: {new Date().toLocaleString()}</p>
      </header>

      <main>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 border-b border-indigo-200 pb-2">Executive Summary</h2>
        
        <section className="mb-8 p-6 rounded-lg border-2 border-gray-200 bg-white shadow-md">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-bold">Overall Project Score</h3>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center"><div className="text-2xl font-bold text-blue-600">{results.layer1Output.toFixed(1)}%</div><div className="text-xs font-medium text-gray-600">Initial Viability</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-green-600">{results.layer2Output.toFixed(1)}%</div><div className="text-xs font-medium text-gray-600">Tech Feasibility</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-purple-600">{results.layer3Output.toFixed(1)}%</div><div className="text-xs font-medium text-gray-600">Implementation</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-indigo-600">{results.finalScore.toFixed(0)}%</div><div className="text-xs font-medium text-gray-600">Final Score</div></div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-100">
            <div className={`flex items-center justify-center text-xl font-bold ${results.recommendationColor.replace('dark:', '')}`}>
              {results.finalScore >= 60 ? <CheckCircle className="w-6 h-6 mr-2" /> : <AlertCircle className="w-6 h-6 mr-2" />}
              <span>{results.recommendation}</span>
            </div>
          </div>
        </section>

        <PrintImpactFactors factors={impactFactors} />

        {aiAnalysisText && (
          <section className="mb-8 p-6 rounded-lg border bg-white">
             <h3 className="text-xl font-bold mb-4 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-indigo-500" /> AI-Powered Analysis</h3>
             <div className="prose prose-sm max-w-none text-gray-800">
                <pre className="whitespace-pre-wrap font-sans bg-blue-50 p-4 rounded-lg border border-blue-200">{aiAnalysisText}</pre>
             </div>
          </section>
        )}

        <div style={{ pageBreakBefore: 'always' }}></div>

        <h2 className="text-2xl font-bold mb-4 text-indigo-700 border-b border-indigo-200 pb-2">Full Input Factor Summary</h2>
        <section>
          <FactorTable title="Problem Framing" factors={problemFraming} />
          <FactorTable title="Reality Weights: Layer 1 (Initial Feasibility)" factors={realityWeights.layer1} />
          <FactorTable title="Reality Weights: Layer 2 (Technical Feasibility)" factors={realityWeights.layer2} />
          <FactorTable title="Reality Weights: Layer 3 (Implementation Feasibility)" factors={realityWeights.layer3} />
          <FactorTable title="Contextual Bias Terms" factors={biasTerms} isBias />
        </section>
      </main>
    </div>
  );
};

export default PrintSummary;