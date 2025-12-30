
import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Sun, Moon, Columns, ChevronDown, RotateCcw, SlidersHorizontal, Sparkles, TrendingUp, Settings2, Zap, Star, Crosshair, BarChart3, ArrowUpRight, CheckCircle, HelpCircle } from './icons.tsx';
import SliderGroup from './SliderGroup.tsx';
import AddFactorModal from './AddFactorModal.tsx';
import CalibrationPanel from './CalibrationPanel.tsx';
import ResultsPanel from './ResultsPanel.tsx';
import ComparisonViewModal from './ComparisonViewModal.tsx';
import AddImpactFactorModal from './AddImpactFactorModal.tsx';
import UserGuideModal from './UserGuideModal.tsx';
import { defaultProblemFraming, defaultRealityWeights, defaultBiasTerms, defaultCalibrationWeights, defaultFocusedFactors } from '../constants.ts';
import { calculateNeuralNetwork, calculateSensitivityAnalysis } from '../utils/calculations.ts';
import { serializeState, deserializeState } from '../utils/stateSerializer.ts';
import { useTheme } from '../contexts/ThemeContext.tsx';
import type { 
  ActivationFunction,
  Results,
  ImpactFactor,
  Scenario,
  AppState,
  ProblemFramingKeys,
  RealityWeightsKeys,
  BiasTermKeys,
  CustomFactors,
  RealityWeights
} from '../types.ts';

const defaultProblemFramingKeys: ProblemFramingKeys = {
  definition: ['problemClarity', 'problemComplexity', 'problemUrgency', 'problemImpact', 'problemMeasurability'],
  stakeholder: ['stakeholderAlignment', 'stakeholderInfluence', 'stakeholderAvailability', 'decisionMakerBuyIn', 'crossFunctionalSupport'],
  business: ['businessValue', 'strategicAlignment', 'competitiveAdvantage', 'regulatoryRequirements', 'marketTiming'],
  readiness: ['dataQualityExpectation', 'analyticsMaturity', 'previousProjectSuccess', 'domainKnowledge', 'hypothesesQuality'],
  success: ['successMetricsClear', 'baselineEstablished', 'benchmarkAvailable', 'outcomeTraceable', 'valueQuantifiable']
};

const defaultRealityWeightsKeys: RealityWeightsKeys = {
  layer1: {
    resource: ['budgetAdequacy', 'timelineRealism', 'teamCapacity', 'skillsAvailability', 'toolsAccess'],
    data: ['dataAvailability', 'dataQuality', 'dataVolume', 'dataVelocity', 'dataPrivacy'],
    org: ['priorityLevel', 'resourceCompetition', 'politicalSupport', 'changeReadiness', 'dataLiteracy'],
    risk: ['riskIdentification', 'riskAssessment', 'riskMitigation', 'riskContingencyPlanning', 'riskTolerance']
  },
  layer2: {
    infra: ['computingResources', 'dataInfrastructure', 'securityCompliance', 'scalabilityNeeds', 'integrationComplexity'],
    dev: ['algorithmComplexity', 'modelValidation', 'testingRequirements', 'performanceStandards', 'maintenanceNeeds'],
    team: ['technicalExpertise', 'domainExpertise', 'collaborationEffectiveness', 'learningAgility', 'qualityStandards']
  },
  layer3: {
    readiness: ['organizationalReadiness', 'changeManagement', 'userAdoption', 'trainingRequirements', 'supportStructures'],
    integration: ['processIntegration', 'systemIntegration', 'workflowAlignment', 'governanceFramework', 'complianceRequirements'],
    value: ['roiPotential', 'valueTimeframe', 'scalabilityPotential', 'sustainabilityFactors', 'competitiveImpact']
  }
};

const defaultBiasTermKeys: BiasTermKeys = {
  org: ['organizationalCulture', 'leadershipStyle', 'riskAversion', 'innovationAppetite', 'pastProjectSuccess', 'teamExperience', 'domainMaturity', 'methodologyFamiliarity'],
  external: ['marketConditions', 'competitivePressure', 'regulatoryEnvironment', 'technologyTrends', 'optimismBias', 'confirmationBias', 'availabilityBias', 'anchoringBias', 'shortTermPressure', 'longTermVision', 'resourceScarcity', 'strategicAlignment']
};

const initialAppState: AppState = {
    problemFraming: defaultProblemFraming,
    realityWeights: defaultRealityWeights,
    biasTerms: defaultBiasTerms,
    activationFunction: 'sigmoid',
    calibrationWeights: defaultCalibrationWeights,
    focusedFactors: defaultFocusedFactors,
    customFactors: { problemFraming: {}, layer1Weights: {}, layer2Weights: {}, layer3Weights: {}, biasTerms: {} },
    problemFramingKeys: defaultProblemFramingKeys,
    realityWeightsKeys: defaultRealityWeightsKeys,
    biasTermKeys: defaultBiasTermKeys,
};

const activationFunctionOptions: { key: ActivationFunction, name: string }[] = [
    { key: 'sigmoid', name: 'Sigmoid' },
    { key: 'leakyRelu', name: 'Leaky ReLU' },
    { key: 'swish', name: 'Swish' }
];

const AnalyticsNeuralFramework: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [results, setResults] = useState<Results>({
    layer1Output: 0, layer2Output: 0, layer3Output: 0, finalScore: 0, confidenceScore: 0, recommendation: '', recommendationColor: ''
  });
  const [impactFactors, setImpactFactors] = useState<ImpactFactor[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({ protocol: false });
  const [impactFactorCount, setImpactFactorCount] = useState(5);
  const [hiddenImpactFactors, setHiddenImpactFactors] = useState<string[]>([]);
  const [isAddImpactFactorModalOpen, setIsAddImpactFactorModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalibrationPanelOpen, setIsCalibrationPanelOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [newFactorName, setNewFactorName] = useState('');
  const [modalConfig, setModalConfig] = useState<{
    category: keyof CustomFactors;
    group: string;
    subcategory: keyof RealityWeights | null;
  } | null>(null);

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [scenariosToCompare, setScenariosToCompare] = useState<Scenario[]>([]);
  
  useEffect(() => {
    try {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const decodedState = deserializeState(hash);
        if (decodedState) {
          setAppState(decodedState);
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to restore state from URL hash.");
    }

    try {
        const savedScenarios = localStorage.getItem('analyticsScenarios');
        if (savedScenarios) {
            setScenarios(JSON.parse(savedScenarios));
        }
    } catch (e) {
        console.error("Failed to load scenarios from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('analyticsScenarios', JSON.stringify(scenarios));
    } catch (e) {
        console.error("Failed to save scenarios to localStorage", e);
    }
  }, [scenarios]);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleOpenModal = useCallback((category: keyof CustomFactors, group: string, subcategory: keyof RealityWeights | null = null) => {
      setModalConfig({ category, group, subcategory });
      setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
      setIsModalOpen(false);
      setNewFactorName('');
      setModalConfig(null);
  }, []);

  const handleConfirmAddFactor = useCallback(() => {
    if (!newFactorName.trim() || !modalConfig) return;
    
    const sanitizedName = newFactorName.trim().replace(/[<>/]/g, '');
    if (!sanitizedName) return;

    const { category, group, subcategory } = modalConfig;
    const camelCaseFactorName = sanitizedName.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '');
    const defaultValue = category === 'biasTerms' ? 0 : 5;
    
    setAppState(prev => {
        const newState = JSON.parse(JSON.stringify(prev));
        if (subcategory) {
            newState.realityWeights[subcategory][camelCaseFactorName] = defaultValue;
            newState.realityWeightsKeys[subcategory][group].push(camelCaseFactorName);
            newState.customFactors[category][camelCaseFactorName] = true;
        } else if (category === 'problemFraming') {
            newState.problemFraming[camelCaseFactorName] = defaultValue;
            newState.problemFramingKeys[group].push(camelCaseFactorName);
            newState.customFactors.problemFraming[camelCaseFactorName] = true;
        } else if (category === 'biasTerms') {
            newState.biasTerms[camelCaseFactorName] = defaultValue;
            newState.biasTermKeys[group].push(camelCaseFactorName);
            newState.customFactors.biasTerms[camelCaseFactorName] = true;
        }
        return newState;
    });
    handleCloseModal();
  }, [newFactorName, modalConfig, handleCloseModal]);
  
  const removeFactor = useCallback((category: keyof CustomFactors, factorName: string, group: string, subcategory: keyof RealityWeights | null = null) => {
     setAppState(prev => {
        const newState = JSON.parse(JSON.stringify(prev));
        const removeKey = (obj: {[key: string]: any}, keyToRemove: string) => 
            Object.keys(obj)
                .filter(key => key !== keyToRemove)
                .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});

        if (subcategory) {
            newState.realityWeights[subcategory] = removeKey(newState.realityWeights[subcategory], factorName);
            newState.realityWeightsKeys[subcategory][group] = newState.realityWeightsKeys[subcategory][group].filter((k:string) => k !== factorName);
        } else if (category === 'problemFraming') {
            newState.problemFraming = removeKey(newState.problemFraming, factorName);
            newState.problemFramingKeys[group] = newState.problemFramingKeys[group].filter((k:string) => k !== factorName);
        } else if (category === 'biasTerms') {
            newState.biasTerms = removeKey(newState.biasTerms, factorName);
            newState.biasTermKeys[group] = newState.biasTermKeys[group].filter((k:string) => k !== factorName);
        }
        newState.customFactors[category] = removeKey(newState.customFactors[category], factorName);
        if (newState.focusedFactors[factorName]) {
            delete newState.focusedFactors[factorName];
        }
        return newState;
    });
  }, []);
  
  const resetToDefaults = useCallback(() => {
    setAppState(initialAppState);
    setHiddenImpactFactors([]);
  }, []);

  const handleResetGroup = useCallback((category: keyof CustomFactors, group: string, subcategory: keyof RealityWeights | null = null) => {
    setAppState(prev => {
        const newState = JSON.parse(JSON.stringify(prev));
        if (subcategory) {
            const defaultKeys = defaultRealityWeightsKeys[subcategory][group];
            const currentKeys = newState.realityWeightsKeys[subcategory][group];
            const customKeys = currentKeys.filter((k:string) => !defaultKeys.includes(k));
            customKeys.forEach((k:string) => {
                delete newState.realityWeights[subcategory][k];
                delete newState.customFactors[category][k];
                delete newState.focusedFactors[k];
            });
            defaultKeys.forEach((k:string) => {
                newState.realityWeights[subcategory][k] = defaultRealityWeights[subcategory][k];
            });
            newState.realityWeightsKeys[subcategory][group] = [...defaultKeys];
        } else if (category === 'problemFraming') {
            const defaultKeys = defaultProblemFramingKeys[group];
            const currentKeys = newState.problemFramingKeys[group];
            const customKeys = currentKeys.filter((k:string) => !defaultKeys.includes(k));
            customKeys.forEach((k:string) => {
                delete newState.problemFraming[k];
                delete newState.customFactors.problemFraming[k];
                delete newState.focusedFactors[k];
            });
            defaultKeys.forEach((k:string) => {
                newState.problemFraming[k] = defaultProblemFraming[k];
            });
            newState.problemFramingKeys[group] = [...defaultKeys];
        } else if (category === 'biasTerms') {
            const defaultKeys = defaultBiasTermKeys[group];
            const currentKeys = newState.biasTermKeys[group];
            const customKeys = currentKeys.filter((k:string) => !defaultKeys.includes(k));
            customKeys.forEach((k:string) => {
                delete newState.biasTerms[k];
                delete newState.customFactors.biasTerms[k];
            });
            defaultKeys.forEach((k:string) => {
                newState.biasTerms[k] = defaultBiasTerms[k];
            });
            newState.biasTermKeys[group] = [...defaultKeys];
        }
        return newState;
    });
  }, []);
  
  const handleSaveScenario = (name: string) => {
    const newScenario: Scenario = { id: `scn_${Date.now()}`, name, state: appState, createdAt: new Date().toISOString() };
    setScenarios(prev => [...prev, newScenario]);
  };

  const handleLoadScenario = (id: string) => {
    const scenario = scenarios.find(s => s.id === id);
    if (scenario) {
      setAppState(scenario.state);
    }
  };
  
  const handleDeleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };
  
  const handleCompareScenarios = (ids: string[]) => {
    const selected = scenarios.filter(s => ids.includes(s.id));
    if (selected.length > 1) {
      setScenariosToCompare(selected);
      setIsComparisonModalOpen(true);
    }
  };

  const handleShare = () => {
    const encodedState = serializeState(appState);
    const url = new URL(window.location.href);
    url.hash = encodedState;
    navigator.clipboard.writeText(url.href).catch(err => console.error('Failed to copy URL', err));
  };

  useEffect(() => {
    const { problemFraming, realityWeights, biasTerms, activationFunction, calibrationWeights, focusedFactors, problemFramingKeys, realityWeightsKeys, biasTermKeys } = appState;
    const newResults = calculateNeuralNetwork(problemFraming, realityWeights, biasTerms, activationFunction, calibrationWeights, focusedFactors, problemFramingKeys, realityWeightsKeys, biasTermKeys);
    setResults(newResults);
    const newImpactFactors = calculateSensitivityAnalysis(problemFraming, realityWeights, biasTerms, activationFunction, newResults.finalScore, calibrationWeights, focusedFactors, problemFramingKeys, realityWeightsKeys, biasTermKeys);
    setImpactFactors(newImpactFactors);
  }, [appState]);

  const getValuesForGroup = useCallback((keys: string[], source: { [key: string]: number }) => {
    return Object.fromEntries(keys.map(key => [key, source[key]]).filter(([, value]) => value !== undefined));
  }, []);
  
  const allFactorNames = [
    ...Object.keys(appState.problemFraming),
    ...Object.keys(appState.realityWeights.layer1),
    ...Object.keys(appState.realityWeights.layer2),
    ...Object.keys(appState.realityWeights.layer3),
  ];

  const SectionHeader = ({ id, title, badgeText, badgeColor }: { id: string, title: string, badgeText?: string, badgeColor?: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full text-left no-print border-b dark:border-slate-800 pb-5 mb-10 group">
      <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 flex items-center tracking-tighter uppercase transition-colors group-hover:text-indigo-500">
        {badgeText && <span className={`bg-${badgeColor}-100 dark:bg-${badgeColor}-900/40 text-${badgeColor}-800 dark:text-${badgeColor}-300 px-4 py-1.5 rounded-full text-[10px] mr-5 tracking-[0.3em] font-black`}>{badgeText}</span>}
        {title}
        <ChevronDown className={`w-8 h-8 ml-auto text-gray-400 dark:text-gray-500 transform transition-transform duration-500 ${collapsedSections[id] ? '-rotate-90' : ''}`} />
      </h2>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 p-8 sm:p-12 font-sans transition-colors duration-500 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-[1800px] mx-auto">
        <header className="mb-20">
            <div className="flex flex-col xl:flex-row items-center justify-between mb-16 gap-10">
                <div className="flex items-center">
                    <div className="p-5 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-500/40 mr-8 ring-4 ring-white dark:ring-slate-900">
                        <Brain className="w-14 h-14 text-white" />
                    </div>
                    <div>
                      <h1 className="text-5xl xl:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.85]">Data Analytics<br/>Neural <span className="text-indigo-600">Framework</span></h1>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.6em] mt-4 ml-1">Enterprise Strategic Intelligence Engine</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-3 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-slate-800">
                     <div className="flex items-center gap-3 px-6">
                        <ControlBtn icon={<HelpCircle />} onClick={() => setIsUserGuideOpen(true)} title="Protocol Deployment Manual" />
                        <ControlBtn icon={<SlidersHorizontal />} onClick={() => setIsCalibrationPanelOpen(true)} title="Logic Calibration" />
                        <ControlBtn icon={<RotateCcw />} onClick={resetToDefaults} title="Hard State Reset" />
                        <ControlBtn icon={theme === 'light' ? <Moon /> : <Sun />} onClick={toggleTheme} title="Surface Modulation" />
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureMetric icon={<Columns />} label="Parallel Processing" sub="A/B Node Scenario Testing." />
                <FeatureMetric icon={<Sparkles />} label="Strategic Pivot" sub="Operational Logic Engine." />
                <FeatureMetric icon={<Settings2 />} label="Dynamic Weights" sub="Contextual Field Injection." />
                <FeatureMetric icon={<TrendingUp />} label="Impact Synthesis" sub="Sensitivity Layer Analysis." />
            </div>
        </header>

        <main className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
          <div className="xl:col-span-7 space-y-20">
              <section className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.05)] overflow-hidden">
                <button onClick={() => toggleSection('protocol')} className="w-full flex items-center justify-between p-12 text-left group">
                  <div className="flex items-center gap-10">
                    <div className="p-6 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-500/50 group-hover:scale-105 transition-transform duration-700">
                      <Star className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Strategic Manual</h3>
                      <p className="text-xs text-indigo-500 font-black uppercase tracking-[0.4em] mt-2 opacity-80">Advanced Operational Protocol v2.5.1</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-10 h-10 text-indigo-500 transition-transform duration-500 ${collapsedSections['protocol'] ? '-rotate-90' : ''}`} />
                </button>
                
                {!collapsedSections['protocol'] && (
                  <div className="px-12 pb-14 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <StepCard step="01" title="Quantum Framing" desc="Assign scores [1-10] to Problem Definition and Business Context to establish the base potential." insight="Establishes the Actionability numerator." icon={<Brain />} />
                      <StepCard step="02" title="Reality Gating" desc="Calibrate feasibility layers. Low scores act as 'Strategic Gates' using Geometric Mean bottlenecking." insight="Filters signal through three layers." icon={<SlidersHorizontal />} />
                      <StepCard step="03" title="Bias Modulation" desc="Inject Bias Terms to account for organizational culture, friction, or competitive catalysts." insight="Pre-activation scalar adjustment." icon={<Zap />} />
                      <StepCard step="04" title="Focus Simulation" desc="Apply multipliers [1.1x - 1.5x] to pin specific drivers for management priority testing." insight="Dynamic sensitivity modulation." icon={<Crosshair />} />
                    </div>

                    <div className="mt-12 p-10 bg-slate-50 dark:bg-slate-800/40 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-500/10 flex flex-col md:flex-row gap-10 items-center">
                       <div className="flex-1 space-y-5">
                          <h4 className="flex items-center gap-4 text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                            <BarChart3 className="w-6 h-6" />
                            Engine Theory: Asymptotic Actionability
                          </h4>
                          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                            Optimization is non-linear. The framework utilizes a <strong>Sigmoid Activation Gate</strong> where the jump from 90% to 95% feasibility is mathematically 4x harder than 0% to 50%. This simulates real-world entropy.
                          </p>
                       </div>
                       <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-inner">
                          <code className="text-xs font-mono font-black text-indigo-500 tracking-tighter">
                            f(x) = 1 / (1 + e⁻ˣ)
                          </code>
                       </div>
                    </div>
                  </div>
                )}
              </section>

              <div className="space-y-24">
                  <section>
                    <SectionHeader id="problemFraming" title="Initial Potential: Problem Framing" badgeText="Potential Vector" badgeColor="indigo" />
                    {!collapsedSections['problemFraming'] && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                        <SliderGroup title="🎯 Definition" values={getValuesForGroup(appState.problemFramingKeys.definition, appState.problemFraming)} onValueChange={(key, value) => setAppState(p => ({...p, problemFraming: {...p.problemFraming, [key]: value}}))} color="blue" category="problemFraming" subcategory={null} onAddCustomFactor={() => handleOpenModal('problemFraming', 'definition', null)} onRemoveFactor={(name) => removeFactor('problemFraming', name, 'definition')} onResetGroup={() => handleResetGroup('problemFraming', 'definition')} />
                        <SliderGroup title="👥 Stakeholders" values={getValuesForGroup(appState.problemFramingKeys.stakeholder, appState.problemFraming)} onValueChange={(key, value) => setAppState(p => ({...p, problemFraming: {...p.problemFraming, [key]: value}}))} color="indigo" category="problemFraming" subcategory={null} onAddCustomFactor={() => handleOpenModal('problemFraming', 'stakeholder', null)} onRemoveFactor={(name) => removeFactor('problemFraming', name, 'stakeholder')} onResetGroup={() => handleResetGroup('problemFraming', 'stakeholder')} />
                        <SliderGroup title="💼 Business" values={getValuesForGroup(appState.problemFramingKeys.business, appState.problemFraming)} onValueChange={(key, value) => setAppState(p => ({...p, problemFraming: {...p.problemFraming, [key]: value}}))} color="green" category="problemFraming" subcategory={null} onAddCustomFactor={() => handleOpenModal('problemFraming', 'business', null)} onRemoveFactor={(name) => removeFactor('problemFraming', name, 'business')} onResetGroup={() => handleResetGroup('problemFraming', 'business')} />
                        
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
                          <div>
                            <h3 className="text-xs font-black mb-8 text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                               <Zap className="w-5 h-5 text-indigo-500" />
                               Activation Modulation
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                              {activationFunctionOptions.map(({key, name}) => (
                                <button key={key} onClick={() => setAppState(p => ({...p, activationFunction: key}))} className={`p-5 rounded-2xl border-2 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 text-center ${appState.activationFunction === key ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)]' : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-500/40'}`}>
                                  {name}
                                </button>
                              ))}
                            </div>
                          </div>
                          <p className="mt-8 text-[9px] font-mono text-slate-400 uppercase leading-relaxed italic">Select non-linear mapping logic for neural gate output processing.</p>
                        </div>
                      </div>
                    )}
                  </section>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <section className="space-y-12">
                        <SectionHeader id="layer1" title="Phase I: Initial" badgeText="Layer 1" badgeColor="green" />
                        {!collapsedSections['layer1'] && (
                          <div className="space-y-10">
                            <SliderGroup title="💰 Resources" values={getValuesForGroup(appState.realityWeightsKeys.layer1.resource, appState.realityWeights.layer1)} onValueChange={(key, value) => setAppState(p => ({...p, realityWeights: {...p.realityWeights, layer1: {...p.realityWeights.layer1, [key]: value}}}))} color="green" category="layer1Weights" subcategory="layer1" onAddCustomFactor={() => handleOpenModal('layer1Weights', 'resource', 'layer1')} onRemoveFactor={(name) => removeFactor('layer1Weights', name, 'resource', 'layer1')} onResetGroup={() => handleResetGroup('layer1Weights', 'resource', 'layer1')} />
                            <SliderGroup title="📈 Data Depth" values={getValuesForGroup(appState.realityWeightsKeys.layer1.data, appState.realityWeights.layer1)} onValueChange={(key, value) => setAppState(p => ({...p, realityWeights: {...p.realityWeights, layer1: {...p.realityWeights.layer1, [key]: value}}}))} color="green" category="layer1Weights" subcategory="layer1" onAddCustomFactor={() => handleOpenModal('layer1Weights', 'data', 'layer1')} onRemoveFactor={(name) => removeFactor('layer1Weights', name, 'data', 'layer1')} onResetGroup={() => handleResetGroup('layer1Weights', 'data', 'layer1')} />
                          </div>
                        )}
                      </section>
                      <section className="space-y-12">
                        <SectionHeader id="layer2" title="Phase II: Technical" badgeText="Layer 2" badgeColor="yellow" />
                        {!collapsedSections['layer2'] && (
                          <div className="space-y-10">
                              <SliderGroup title="🖥️ Platform" values={getValuesForGroup(appState.realityWeightsKeys.layer2.infra, appState.realityWeights.layer2)} onValueChange={(key, value) => setAppState(p => ({...p, realityWeights: {...p.realityWeights, layer2: {...p.realityWeights.layer2, [key]: value}}}))} color="yellow" category="layer2Weights" subcategory="layer2" onAddCustomFactor={() => handleOpenModal('layer2Weights', 'infra', 'layer2')} onRemoveFactor={(name) => removeFactor('layer2Weights', name, 'infra', 'layer2')} onResetGroup={() => handleResetGroup('layer2Weights', 'infra', 'layer2')} />
                              <SliderGroup title="👨‍💻 Expertise" values={getValuesForGroup(appState.realityWeightsKeys.layer2.team, appState.realityWeights.layer2)} onValueChange={(key, value) => setAppState(p => ({...p, realityWeights: {...p.realityWeights, layer2: {...p.realityWeights.layer2, [key]: value}}}))} color="yellow" category="layer2Weights" subcategory="layer2" onAddCustomFactor={() => handleOpenModal('layer2Weights', 'team', 'layer2')} onRemoveFactor={(name) => removeFactor('layer2Weights', name, 'team', 'layer2')} onResetGroup={() => handleResetGroup('layer2Weights', 'team', 'layer2')} />
                          </div>
                        )}
                      </section>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <section className="space-y-12">
                        <SectionHeader id="layer3" title="Phase III: Operational" badgeText="Layer 3" badgeColor="red" />
                        {!collapsedSections['layer3'] && (
                          <div className="space-y-10">
                              <SliderGroup title="🚀 Adoption" values={getValuesForGroup(appState.realityWeightsKeys.layer3.readiness, appState.realityWeights.layer3)} onValueChange={(key, value) => setAppState(p => ({...p, realityWeights: {...p.realityWeights, layer3: {...p.realityWeights.layer3, [key]: value}}}))} color="red" category="layer3Weights" subcategory="layer3" onAddCustomFactor={() => handleOpenModal('layer3Weights', 'readiness', 'layer3')} onRemoveFactor={(name) => removeFactor('layer3Weights', name, 'readiness', 'layer3')} onResetGroup={() => handleResetGroup('layer3Weights', 'readiness', 'layer3')} />
                              <SliderGroup title="💎 Impact" values={getValuesForGroup(appState.realityWeightsKeys.layer3.value, appState.realityWeights.layer3)} onValueChange={(key, value) => setAppState(p => ({...p, realityWeights: {...p.realityWeights, layer3: {...p.realityWeights.layer3, [key]: value}}}))} color="red" category="layer3Weights" subcategory="layer3" onAddCustomFactor={() => handleOpenModal('layer3Weights', 'value', 'layer3')} onRemoveFactor={(name) => removeFactor('layer3Weights', name, 'value', 'layer3')} onResetGroup={() => handleResetGroup('layer3Weights', 'value', 'layer3')} />
                          </div>
                        )}
                      </section>
                      <section className="space-y-12">
                        <SectionHeader id="bias" title="Contextual Bias" badgeText="Bias Layer" badgeColor="purple" />
                        {!collapsedSections['bias'] && (
                          <div className="space-y-10">
                            <SliderGroup title="🏛️ Internal" values={getValuesForGroup(appState.biasTermKeys.org, appState.biasTerms)} onValueChange={(key, value) => setAppState(p => ({...p, biasTerms: {...p.biasTerms, [key]: value}}))} color="purple" category="biasTerms" subcategory={null} onAddCustomFactor={() => handleOpenModal('biasTerms', 'org', null)} onRemoveFactor={(name) => removeFactor('biasTerms', name, 'org')} onResetGroup={() => handleResetGroup('biasTerms', 'org')} />
                            <SliderGroup title="🌍 Strategic" values={getValuesForGroup(appState.biasTermKeys.external, appState.biasTerms)} onValueChange={(key, value) => setAppState(p => ({...p, biasTerms: {...p.biasTerms, [key]: value}}))} color="purple" category="biasTerms" subcategory={null} onAddCustomFactor={() => handleOpenModal('biasTerms', 'external', null)} onRemoveFactor={(name) => removeFactor('biasTerms', name, 'external')} onResetGroup={() => handleResetGroup('biasTerms', 'external')} />
                          </div>
                        )}
                      </section>
                  </div>
              </div>
              <div className="h-32"></div>
          </div>
          
          <div className="xl:col-span-5">
             <div className="xl:sticky xl:top-12">
                <ResultsPanel 
                    results={results} 
                    impactFactors={impactFactors}
                    impactFactorCount={impactFactorCount}
                    onImpactFactorCountChange={setImpactFactorCount}
                    focusedFactors={appState.focusedFactors}
                    onFocusedFactorsChange={(key, value) => setAppState(p => ({...p, focusedFactors: {...p.focusedFactors, [key]: value}}))}
                    onRemoveFocusedFactor={(key) => setAppState(p => {
                        const newFactors = {...p.focusedFactors};
                        delete newFactors[key];
                        return {...p, focusedFactors: newFactors};
                    })}
                    hiddenImpactFactors={hiddenImpactFactors}
                    onHiddenImpactFactorsChange={setHiddenImpactFactors}
                    onOpenAddImpactFactorModal={() => setIsAddImpactFactorModalOpen(true)}
                    allFactors={{
                        ...appState.problemFraming,
                        ...appState.realityWeights.layer1,
                        ...appState.realityWeights.layer2,
                        ...appState.realityWeights.layer3,
                        ...appState.biasTerms,
                    }}
                    scenarios={scenarios}
                    onSaveScenario={handleSaveScenario}
                    onLoadScenario={handleLoadScenario}
                    onDeleteScenario={handleDeleteScenario}
                    onCompareScenarios={handleCompareScenarios}
                    onShare={handleShare}
                    calibrationWeights={appState.calibrationWeights}
                />
             </div>
          </div>
        </main>
        
        <footer className="mt-40 bg-white dark:bg-slate-900 p-16 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-[0_40px_80px_rgba(0,0,0,0.1)] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-20 opacity-[0.02] select-none pointer-events-none">
              <BarChart3 className="w-[30rem] h-[30rem] text-indigo-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-[0.5em] mb-16 border-b dark:border-slate-800 pb-10 flex items-center gap-8">
              <BarChart3 className="w-10 h-10 text-indigo-500" />
              Computational Methodology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-16 text-base leading-relaxed">
              <FooterSection title="I. Theoretical Potential" desc="Initial Strategic Vector derived from weighted arithmetic aggregation of problem-space variables." />
              <FooterSection title="II. Geometric Filtering" desc="Constraints apply a Geometric Mean logic G = ⁿ√(∏xᵢ) ensuring a single critical failure bottlenecks ROI." />
              <FooterSection title="III. Neural Stage-Gating" desc="Signals pass through discrete Sequential High-Pass Gates (Initial, Platform, Adoption)." />
              <FooterSection title="IV. Normalization Logic" desc="Actionability index mapped via Hyperbolic Tanh normalization to account for entropy in complex organizations." />
            </div>
            <div className="mt-20 pt-12 border-t dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
               <div className="flex gap-12">
                 <p className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.4em]">Core Revision: v2.5.1-STRAT-A1</p>
                 <p className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.4em]">Node Cluster: Sigmoid/Geometric Hybrid</p>
               </div>
               <p className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.4em] font-black italic">Neural Strategy Command © Global Strategic Services</p>
            </div>
        </footer>

        {isModalOpen && modalConfig && (
            <AddFactorModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAddFactor}
                categoryName={modalConfig.group}
                newFactorName={newFactorName}
                setNewFactorName={setNewFactorName}
            />
        )}
        {isComparisonModalOpen && (
            <ComparisonViewModal
                isOpen={isComparisonModalOpen}
                onClose={() => setIsComparisonModalOpen(false)}
                scenarios={scenariosToCompare}
            />
        )}
        <CalibrationPanel 
            isOpen={isCalibrationPanelOpen}
            onClose={() => setIsCalibrationPanelOpen(false)}
            weights={appState.calibrationWeights}
            onWeightChange={(key, value) => setAppState(p => ({...p, calibrationWeights: {...p.calibrationWeights, [key]: value}}))}
            onReset={() => setAppState(p => ({...p, calibrationWeights: defaultCalibrationWeights}))}
        />
        <AddImpactFactorModal
            isOpen={isAddImpactFactorModalOpen}
            onClose={() => setIsAddImpactFactorModalOpen(false)}
            onAddFactor={(name) => setAppState(p => ({...p, focusedFactors: {...p.focusedFactors, [name]: 1.1 }}))}
            allFactorNames={allFactorNames}
            existingFactorNames={[
              ...impactFactors.filter(f => !hiddenImpactFactors.includes(f.name)).slice(0, impactFactorCount).map(f => f.name), 
              ...Object.keys(appState.focusedFactors)
            ]}
        />
        <UserGuideModal 
            isOpen={isUserGuideOpen} 
            onClose={() => setIsUserGuideOpen(false)} 
        />
      </div>
    </div>
  );
};

const ControlBtn: React.FC<{ icon: React.ReactNode, onClick: () => void, title: string }> = ({ icon, onClick, title }) => (
    <button onClick={onClick} className="p-3.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all duration-300 active:scale-90" title={title}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
    </button>
);

const FeatureMetric: React.FC<{ icon: React.ReactNode, label: string, sub: string }> = ({ icon, label, sub }) => (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center space-x-6 group hover:border-indigo-500/40 transition-all duration-500 hover:-translate-y-1">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-7 h-7' })}
        </div>
        <div>
            <h3 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight">{label}</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-2">{sub}</p>
        </div>
    </div>
);

const FooterSection: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
    <div className="space-y-5">
        <p className="font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] text-xs">{title}</p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-bold opacity-80">{desc}</p>
    </div>
);

interface StepCardProps {
  step: string;
  title: string;
  desc: string;
  insight: string;
  icon: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ step, title, desc, insight, icon }) => (
  <div className="p-10 bg-slate-50 dark:bg-slate-950/40 rounded-[3rem] border border-slate-200/50 dark:border-slate-800 hover:border-indigo-500/40 transition-all group relative overflow-hidden flex flex-col justify-between">
    <div>
        <div className="flex items-center justify-between mb-8">
          <span className="text-[12px] font-black font-mono text-white bg-indigo-600 px-5 py-2 rounded-full shadow-xl shadow-indigo-500/40">{step}</span>
          <div className="text-indigo-500 group-hover:scale-125 transition-transform duration-700 opacity-20 group-hover:opacity-100">
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-8 h-8' })}
          </div>
        </div>
        <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.3em] mb-5">{title}</h4>
        <p className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-400 font-bold mb-8">
          {desc}
        </p>
    </div>
    <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
       <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 leading-normal font-black uppercase tracking-tight">
         <span className="opacity-40 mr-3">LOGIC_GATE:</span> {insight}
       </p>
    </div>
  </div>
);

export default AnalyticsNeuralFramework;
