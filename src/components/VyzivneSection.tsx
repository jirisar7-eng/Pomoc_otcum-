/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Coins, 
  HelpCircle, 
  AlertCircle, 
  Info, 
  Calculator, 
  Plus, 
  Trash2, 
  User, 
  Briefcase, 
  ShieldAlert, 
  Scale, 
  AlertTriangle, 
  Calendar,
  Layers,
  Sparkles,
  Heart
} from 'lucide-react';

interface AgeBracket {
  label: string;
  minPercent: number;
  maxPercent: number;
}

const AGE_BRACKETS: Record<string, AgeBracket> = {
  '0-5': { label: '0 až 5 let', minPercent: 11, maxPercent: 15 },
  '6-9': { label: '6 až 9 let', minPercent: 13, maxPercent: 17 },
  '10-14': { label: '10 až 14 let', minPercent: 15, maxPercent: 19 },
  '15-17': { label: '15 až 17 let', minPercent: 17, maxPercent: 21 },
  '18+': { label: '18 let a více (studující)', minPercent: 19, maxPercent: 25 },
};

interface Child {
  id: string;
  name: string;
  ageBracket: string; // '0-5' | '6-9' | '10-14' | '15-17' | '18+'
  relationType: 'primary_sole' | 'primary_shared' | 'other_relationship'; // active proceeding or outside
  careRatioA: number; // percentage of physical care by Parent A (only for primary_shared)
}

export default function VyzivneSection() {
  // Master state for list of children
  const [children, setChildren] = useState<Child[]>([
    { id: '1', name: 'Nezletilý A', ageBracket: '6-9', relationType: 'primary_sole', careRatioA: 50 },
    { id: '2', name: 'Nezletilý B', ageBracket: '0-5', relationType: 'other_relationship', careRatioA: 50 }
  ]);

  // Parent A (Payer) state
  const [incomeA, setIncomeA] = useState<number>(38000);
  const [isUnemployedA, setIsUnemployedA] = useState<boolean>(false);
  const [unemployedReasonA, setUnemployedReasonA] = useState<string>('search'); // 'search' | 'unable' | 'other'
  const [unemployedIncomeA, setUnemployedIncomeA] = useState<number>(11500); // support/benefits
  const [potentialIncomeTypeA, setPotentialIncomeTypeA] = useState<string>('minWage'); // 'minWage' | 'avgWage' | 'custom'
  const [customPotentialIncomeA, setCustomPotentialIncomeA] = useState<number>(25000);

  // Executions (Exekuce) state
  const [hasExecutionA, setHasExecutionA] = useState<boolean>(false);
  const [executionTypeA, setExecutionTypeA] = useState<string>('nonPriority'); // 'nonPriority' | 'priority' | 'insolvency'
  const [executionDeductionA, setExecutionDeductionA] = useState<number>(6000);

  // Parent B (Shared Custody) state
  const [incomeB, setIncomeB] = useState<number>(28000);

  // Add new child helper
  const handleAddChild = () => {
    const nextNum = children.length + 1;
    const newChild: Child = {
      id: Date.now().toString(),
      name: `Dítě ${nextNum}`,
      ageBracket: '6-9',
      relationType: 'primary_sole',
      careRatioA: 50
    };
    setChildren([...children, newChild]);
  };

  // Remove child helper
  const handleRemoveChild = (id: string) => {
    setChildren(children.filter(c => c.id !== id));
  };

  // Update specific child properties
  const handleUpdateChild = (id: string, updates: Partial<Child>) => {
    setChildren(children.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Calculate imputed/effective income for Parent A
  const baseIncomeA = useMemo(() => {
    if (!isUnemployedA) {
      return incomeA;
    }
    if (unemployedReasonA === 'unable') {
      return unemployedIncomeA;
    }
    if (potentialIncomeTypeA === 'minWage') {
      return 20800; // Czech minimum wage 2026
    }
    if (potentialIncomeTypeA === 'avgWage') {
      return 44000; // Czech average wage estimate
    }
    return customPotentialIncomeA;
  }, [isUnemployedA, incomeA, unemployedReasonA, unemployedIncomeA, potentialIncomeTypeA, customPotentialIncomeA]);

  // Czech Ministry of Justice 2022 recommendation guidelines:
  // Standard recommended percentage decreases based on the total number of dependent children (vyživovací povinnosti):
  // 1 child -> standard brackets (0% deduction)
  // 2 children -> -2% off each bracket
  // 3 children -> -4% off each bracket
  // 4 or more children -> -6% off each bracket
  const dependentsReduction = useMemo(() => {
    const count = children.length;
    if (count <= 1) return 0;
    if (count === 2) return 2;
    if (count === 3) return 4;
    return 6;
  }, [children]);

  // Primary active children calculations (exclude 'other_relationship' children from net payments, but they reduce percentages!)
  const childSupportDetails = useMemo(() => {
    const activeChildren = children.filter(c => c.relationType !== 'other_relationship');
    const totalCount = children.length; // all children count for the reduction factor

    return activeChildren.map(child => {
      const bracket = AGE_BRACKETS[child.ageBracket];
      
      // Apply the percentage point reduction
      const minPct = Math.max(bracket.minPercent - dependentsReduction, 5) / 100;
      const maxPct = Math.max(bracket.maxPercent - dependentsReduction, 6) / 100;
      const avgPct = (minPct + maxPct) / 2;

      let calculatedMin = 0;
      let calculatedMax = 0;
      let calculatedAvg = 0;
      let whoPays = '';

      if (child.relationType === 'primary_sole') {
        // Sole custody
        calculatedMin = Math.round(baseIncomeA * minPct);
        calculatedMax = Math.round(baseIncomeA * maxPct);
        calculatedAvg = Math.round(baseIncomeA * avgPct);
        whoPays = 'Rodič A platí rodiči B';
      } else {
        // Shared custody offset calculation
        const dutyA = baseIncomeA * avgPct;
        const dutyB = incomeB * avgPct;

        const careRatioFractionA = child.careRatioA / 100;
        const careRatioFractionB = (100 - child.careRatioA) / 100;

        // Net owed by A = dutyA * (B's care ratio) - dutyB * (A's care ratio)
        const rawOwedByA = (dutyA * careRatioFractionB) - (dutyB * careRatioFractionA);
        
        calculatedAvg = Math.round(Math.abs(rawOwedByA));
        calculatedMin = Math.max(Math.round(calculatedAvg * 0.9), 0);
        calculatedMax = Math.round(calculatedAvg * 1.1);

        if (rawOwedByA > 0) {
          whoPays = 'Rodič A doplácí rodiči B';
        } else if (rawOwedByA < 0) {
          whoPays = 'Rodič B doplácí rodiči A';
        } else {
          whoPays = 'Finančně vyrovnané';
        }
      }

      // Legal minimum support limit
      const absoluteMin = 1000;
      if (calculatedMin < absoluteMin) calculatedMin = absoluteMin;
      if (calculatedMax < absoluteMin) calculatedMax = absoluteMin;
      if (calculatedAvg < absoluteMin) calculatedAvg = absoluteMin;

      return {
        id: child.id,
        name: child.name,
        ageBracket: child.ageBracket,
        relationType: child.relationType,
        minAmount: calculatedMin,
        maxAmount: calculatedMax,
        avgAmount: calculatedAvg,
        minPct: Math.round(minPct * 100),
        maxPct: Math.round(maxPct * 100),
        whoPays,
        careRatioA: child.careRatioA
      };
    });
  }, [children, baseIncomeA, incomeB, dependentsReduction]);

  // Overall sums
  const totalSummary = useMemo(() => {
    let totalMin = 0;
    let totalMax = 0;
    let totalAvg = 0;

    childSupportDetails.forEach(c => {
      if (c.whoPays.includes('Rodič A')) {
        totalMin += c.minAmount;
        totalMax += c.maxAmount;
        totalAvg += c.avgAmount;
      }
    });

    return {
      totalMin,
      totalMax,
      totalAvg
    };
  }, [childSupportDetails]);

  // Execution & Non-garnishable threshold analysis (Exekuční srážky a nezabavitelné minimum)
  const executionAnalysis = useMemo(() => {
    if (!hasExecutionA) return null;

    // Nezabavitelná částka (Czech Law 2026 Estimate)
    // Basic amount for debtor: ~12,700 Kč
    // Dependent offset: ~3,175 Kč per dependent person
    const baseDebtor = 12700;
    const baseDependent = 3175;
    const dependentCount = children.length; // all registered children are dependents
    const nonGarnishableAmount = baseDebtor + (dependentCount * baseDependent);

    // Actual cash income Parent A receives before court/execution deductions
    const actualCashInput = isUnemployedA ? unemployedIncomeA : incomeA;
    
    // Remaining cash after execution
    const remainingCashAfterExecution = Math.max(actualCashInput - executionDeductionA, nonGarnishableAmount);

    // Child support is a PRIORITY claim (Přednostní pohledávka)
    const averageChildSupport = totalSummary.totalAvg;
    
    // Is the average child support affordable?
    const cashAfterAll = remainingCashAfterExecution - averageChildSupport;
    const isBelowSurvival = cashAfterAll < nonGarnishableAmount;

    return {
      nonGarnishableAmount,
      remainingCashAfterExecution,
      cashAfterAll,
      isBelowSurvival,
      averageChildSupport,
      actualCashInput
    };
  }, [hasExecutionA, isUnemployedA, incomeA, unemployedIncomeA, executionDeductionA, children, totalSummary]);

  return (
    <div className="space-y-8 animate-fade-in" id="vyzivne-section-container">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-3xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/40 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider font-mono">Synthesis OS: Opatrovnický Průvodce</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Pokročilá kalkulačka alimentů s více dětmi</h2>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Tento pokročilý modul zohledňuje kompletní doporučení Ministerstva spravedlnosti ČR. Umožňuje definovat{' '}
          <strong>různý věk a typy péče u každého dítěte</strong>, zohlednit{' '}
          <strong>další děti z jiných vztahů</strong> (které legálně snižují sazby u ostatních dětí),{' '}
          analyzovat <strong>potenciální příjmy při nezaměstnanosti</strong> a propočítat vliv{' '}
          <strong>exekucí</strong> na nezabavitelné minimum.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - INPUT PARAMETERS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Children details manager */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-800 text-sm font-display">1. Evidence dětí (věk a typ péče)</h3>
              </div>
              <button
                type="button"
                onClick={handleAddChild}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100/80 text-teal-700 text-xs font-bold rounded-lg border border-teal-100 cursor-pointer transition-colors"
                id="btn-add-child"
              >
                <Plus className="w-3.5 h-3.5" />
                Přidat další dítě
              </button>
            </div>

            {children.length === 0 ? (
              <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400">Nemáte zadané žádné děti. Klikněte na tlačítko výše pro přidání.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {children.map((child, idx) => (
                  <div 
                    key={child.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      child.relationType === 'other_relationship' 
                        ? 'bg-amber-50/30 border-amber-100/60' 
                        : 'bg-white border-slate-200 shadow-3xs'
                    }`}
                  >
                    {/* Header line of child */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-grow">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {idx + 1}
                        </div>
                        <input
                          type="text"
                          value={child.name}
                          onChange={(e) => handleUpdateChild(child.id, { name: e.target.value })}
                          className="px-2 py-1 text-xs font-bold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-teal-500 outline-none bg-transparent"
                          placeholder="Jméno dítěte"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveChild(child.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
                        title="Odebrat dítě"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Age bracket selection */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-500">Věk / Věková kategorie</label>
                        <select
                          value={child.ageBracket}
                          onChange={(e) => handleUpdateChild(child.id, { ageBracket: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-lg outline-none cursor-pointer"
                        >
                          {Object.entries(AGE_BRACKETS).map(([key, item]) => (
                            <option key={key} value={key}>
                              {item.label} (doporučeně {item.minPercent}% - {item.maxPercent}%)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Care relation selection */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-500">Opatrovnické uspořádání</label>
                        <select
                          value={child.relationType}
                          onChange={(e) => handleUpdateChild(child.id, { relationType: e.target.value as any })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-lg outline-none cursor-pointer font-medium"
                        >
                          <option value="primary_sole">Výlučná péče (jeden pečuje, druhý platí)</option>
                          <option value="primary_shared">Střídavá / Společná péče</option>
                          <option value="other_relationship">Z jiného vztahu (pouze snižuje sazbu ostatním)</option>
                        </select>
                      </div>
                    </div>

                    {/* Shared custody physical care ratio slider */}
                    {child.relationType === 'primary_shared' && (
                      <div className="mt-4 pt-3 border-t border-dashed border-slate-100 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Podíl osobní péče Rodiče A u tohoto dítěte:</span>
                          <span className="font-bold text-teal-700">{child.careRatioA} % času</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="80"
                          step="5"
                          value={child.careRatioA}
                          onChange={(e) => handleUpdateChild(child.id, { careRatioA: Number(e.target.value) })}
                          className="w-full accent-teal-600"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                          <span>A: 20% / B: 80%</span>
                          <span>Střídavá rovnoměrná (50/50)</span>
                          <span>A: 80% / B: 20%</span>
                        </div>
                      </div>
                    )}

                    {child.relationType === 'other_relationship' && (
                      <div className="mt-2.5 px-3 py-2 bg-amber-50/50 border border-amber-100 rounded-lg text-[10px] text-amber-800 leading-normal">
                        ℹ️ <strong>Dítě z jiného vztahu</strong> se nepočítá do výsledných alimentů v této kalkulaci, 
                        ale legálně se zohledňuje jako vaše vyživovací povinnost. Díky tomu je doporučená sazba pro ostatní děti v této kalkulaci snížena o <strong>{dependentsReduction}%</strong>.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Parent A Finance & Employment details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <Briefcase className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-800 text-sm font-display">2. Příjmy a zaměstnání Rodiče A</h3>
            </div>

            {/* Employment Status Checkbox */}
            <div className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <input
                id="parent-unemployed-checkbox"
                type="checkbox"
                checked={isUnemployedA}
                onChange={(e) => setIsUnemployedA(e.target.checked)}
                className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer"
              />
              <div className="text-xs">
                <label htmlFor="parent-unemployed-checkbox" className="font-bold text-slate-700 cursor-pointer">
                  Rodič A je momentálně bez stálé práce / nezaměstnaný
                </label>
                <p className="text-slate-400 text-[10px] leading-tight mt-0.5">
                  Zaškrtněte v případě výpadku příjmů, invalidity nebo registrace na Úřadu práce.
                </p>
              </div>
            </div>

            {/* Unemployed Settings */}
            {isUnemployedA ? (
              <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-xl space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">Důvod výpadku práce</label>
                  <select
                    value={unemployedReasonA}
                    onChange={(e) => setUnemployedReasonA(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="search">Aktivně hledá práci (podpora v nezaměstnanosti / ÚP)</option>
                    <option value="unable">Práce neschopen (invalidní důchod, závažný zdravotní stav)</option>
                    <option value="other">Vzdal se práce dobrovolně / Nechce pracovat</option>
                  </select>
                </div>

                {/* Real benefits input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="block text-xs font-semibold text-slate-600">Reálný příjem z dávek / důchodu</label>
                    <span className="text-xs font-bold text-teal-700">{unemployedIncomeA.toLocaleString()} Kč / měsíc</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30000"
                    step="500"
                    value={unemployedIncomeA}
                    onChange={(e) => setUnemployedIncomeA(Number(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0 Kč (Zcela bez příjmu)</span>
                    <span>15 000 Kč</span>
                    <span>30 000 Kč</span>
                  </div>
                </div>

                {/* Imputation disclaimer / Custom potential choice */}
                {unemployedReasonA !== 'unable' && (
                  <div className="space-y-2 border-t border-amber-150 pt-3">
                    <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Soud v ČR vyměří výživné z POTENCIÁLNÍHO příjmu:</span>
                    </div>
                    <select
                      value={potentialIncomeTypeA}
                      onChange={(e) => setPotentialIncomeTypeA(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-lg outline-none cursor-pointer"
                    >
                      <option value="minWage">Minimální mzda 2026 (20 800 Kč čistého)</option>
                      <option value="avgWage">Průměrná mzda v ČR (44 000 Kč čistého)</option>
                      <option value="custom">Vlastní odhadovaný profesní potenciál</option>
                    </select>

                    {potentialIncomeTypeA === 'custom' && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Můj odhad profesního potenciálu:</span>
                          <span className="font-bold text-teal-600">{customPotentialIncomeA.toLocaleString()} Kč</span>
                        </div>
                        <input
                          type="range"
                          min="15000"
                          max="80000"
                          step="1000"
                          value={customPotentialIncomeA}
                          onChange={(e) => setCustomPotentialIncomeA(Number(e.target.value))}
                          className="w-full accent-teal-600"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Regular income input */
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-xs font-semibold text-slate-600">Čistý měsíční příjem Rodiče A</label>
                  <span className="text-xs font-bold text-teal-600">{incomeA.toLocaleString()} Kč / měsíc</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="120000"
                  step="1000"
                  value={incomeA}
                  onChange={(e) => setIncomeA(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>15 000 Kč</span>
                  <span>65 000 Kč</span>
                  <span>120 000 Kč</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Parent B Finance details (for shared custody calculations) */}
          {children.some(c => c.relationType === 'primary_shared') && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <User className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-800 text-sm font-display">3. Čistý příjem druhého rodiče (B)</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-xs font-semibold text-slate-600">Měsíční příjem Rodiče B</label>
                  <span className="text-xs font-bold text-teal-600">{incomeB.toLocaleString()} Kč / měsíc</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="100000"
                  step="1000"
                  value={incomeB}
                  onChange={(e) => setIncomeB(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>15 000 Kč</span>
                  <span>50 000 Kč</span>
                  <span>100 000 Kč</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                U dětí ve střídavé péči porovnává kalkulačka vyživovací povinnosti obou rodičů na základě jejich příjmů a podílu péče. Výsledná částka představuje doporučené vyrovnání, které doplácí lépe vydělávající rodič.
              </p>
            </div>
          )}

          {/* Section 4: Executions and insolvency debts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <ShieldAlert className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-800 text-sm font-display">4. Exekuce, dluhy a insolvence Rodiče A</h3>
            </div>

            {/* Execution Checkbox */}
            <div className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <input
                id="execution-parent-checkbox"
                type="checkbox"
                checked={hasExecutionA}
                onChange={(e) => setHasExecutionA(e.target.checked)}
                className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer"
              />
              <div className="text-xs">
                <label htmlFor="execution-parent-checkbox" className="font-bold text-slate-700 cursor-pointer">
                  Rodič A má nařízené exekuce, srážky ze mzdy nebo insolvenci (oddlužení)
                </label>
                <p className="text-slate-400 text-[10px] leading-tight mt-0.5">
                  Umožní analyzovat kolizní střet mezi přednostním výživným dětí a exekučním zákonem.
                </p>
              </div>
            </div>

            {hasExecutionA && (
              <div className="bg-rose-50/40 border border-rose-100 p-4 rounded-xl space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">Charakter exekučního titulu</label>
                  <select
                    value={executionTypeA}
                    onChange={(e) => setExecutionTypeA(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="nonPriority">Běžné pohledávky (spotřebitelské půjčky, nezaplacené účty)</option>
                    <option value="priority">Přednostní pohledávky (státní daně, sociální, jiné výživné)</option>
                    <option value="insolvency">Insolvenční splátkový kalendář (soudní oddlužení)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="block text-xs font-semibold text-slate-600">Měsíční výše strhávaných srážek</label>
                    <span className="text-xs font-bold text-rose-700">{executionDeductionA.toLocaleString()} Kč / měsíc</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="25000"
                    step="500"
                    value={executionDeductionA}
                    onChange={(e) => setExecutionDeductionA(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1 000 Kč</span>
                    <span>12 500 Kč</span>
                    <span>25 000 Kč</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column - CALCULATED RESULTS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Calculation Summary Card */}
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EBE7E0] space-y-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#7D8F69]" />
            
            <div className="border-b border-[#EBE7E0] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Orientační rozsudek</span>
                <h3 className="text-sm font-bold text-slate-800 font-display">Výsledky kalkulace</h3>
              </div>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>

            {/* List of individual active children outputs */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono block">
                Rozpis podle jednotlivých dětí:
              </span>
              
              {childSupportDetails.length === 0 ? (
                <div className="text-xs text-slate-400 italic bg-white p-4 rounded-xl border border-slate-150 text-center">
                  Zatím jste nezadali žádné děti, pro které se výživné v tomto řízení počítá.
                </div>
              ) : (
                <div className="space-y-3">
                  {childSupportDetails.map((childDetail) => (
                    <div 
                      key={childDetail.id} 
                      className="bg-white p-4 rounded-xl border border-[#EBE7E0]/60 space-y-2.5 shadow-3xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#7D8F69]" />
                          <span className="text-xs font-bold text-slate-800">{childDetail.name}</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-md">
                          Věk {AGE_BRACKETS[childDetail.ageBracket]?.label.split(' ')[0]} {AGE_BRACKETS[childDetail.ageBracket]?.label.split(' ').slice(1).join(' ')}
                        </span>
                      </div>

                      {/* Info lines */}
                      <div className="text-[11px] space-y-1 text-slate-600">
                        <div className="flex justify-between">
                          <span>Typ péče:</span>
                          <span className="font-semibold text-slate-800">
                            {childDetail.relationType === 'primary_sole' ? 'Výlučná' : `Střídavá (${childDetail.careRatioA}% / ${100 - childDetail.careRatioA}%)`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Základní doporučená sazba:</span>
                          <span className="font-semibold text-slate-800">
                            {childDetail.minPct}% až {childDetail.maxPct}% příjmu
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500 text-[10px]">
                          <span>Dopad ostatních dětí:</span>
                          <span className="text-amber-700">-{dependentsReduction}% bodů zohledněno</span>
                        </div>
                      </div>

                      {/* Calc amounts for this child */}
                      <div className="bg-[#FAF9F6] p-2.5 rounded-lg border border-[#EBE7E0]/40 flex justify-between items-center mt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Doporučené výživné:</span>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#7D8F69]">
                            {childDetail.minAmount.toLocaleString()} – {childDetail.maxAmount.toLocaleString()} Kč
                          </span>
                          <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                            {childDetail.whoPays}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Global Sum total */}
            {childSupportDetails.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-[#EBE7E0] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Celkové výživné placené Rodičem A</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 font-medium">Suma alimentů měsíčně:</span>
                  <div className="text-right">
                    <span className="text-lg md:text-xl font-bold text-[#7D8F69] font-display">
                      {totalSummary.totalMin.toLocaleString()} – {totalSummary.totalMax.toLocaleString()} Kč
                    </span>
                    <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                      Průměr: {totalSummary.totalAvg.toLocaleString()} Kč / měsíc
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Execution collision analysis */}
            {hasExecutionA && executionAnalysis && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl space-y-3">
                <div className="flex gap-2 text-rose-950 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>Vliv exekuce jako prioritního dluhu</div>
                </div>
                
                <div className="space-y-2 text-slate-700 text-[11px] leading-relaxed">
                  <p>
                    <strong>Výživné má absolutní přednost!</strong> Podle českého práva je výživné pro nezletilé dítě 
                    <strong> přednostní pohledávkou</strong> a strhává se přednostně i před běžnými exekucemi.
                  </p>
                  
                  <div className="bg-white/90 p-3 rounded-lg border border-rose-100/50 space-y-1.5">
                    <div className="flex justify-between">
                      <span>Reálný vstupní příjem:</span>
                      <span className="font-semibold">{executionAnalysis.actualCashInput.toLocaleString()} Kč</span>
                    </div>
                    <div className="flex justify-between text-rose-800">
                      <span>Měsíční exekuční srážka:</span>
                      <span className="font-semibold">-{executionDeductionA.toLocaleString()} Kč</span>
                    </div>
                    <div className="flex justify-between text-[#7D8F69]">
                      <span>Průměrné spočtené výživné:</span>
                      <span className="font-semibold">-{executionAnalysis.averageChildSupport.toLocaleString()} Kč</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-150 pt-1 font-bold text-slate-800">
                      <span>Teoretický zůstatek:</span>
                      <span className={executionAnalysis.isBelowSurvival ? 'text-rose-600' : 'text-slate-800'}>
                        {executionAnalysis.cashAfterAll.toLocaleString()} Kč
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1">
                    Zákonné nezabavitelné minimum dlužníka (při {children.length} vyživovaných osobách) činí cca{' '}
                    <strong>{executionAnalysis.nonGarnishableAmount.toLocaleString()} Kč</strong>.
                  </div>

                  {executionAnalysis.isBelowSurvival ? (
                    <div className="mt-2.5 p-2.5 bg-rose-100/50 text-rose-900 rounded-lg border border-rose-200 text-[10px] leading-normal font-medium">
                      ⚠️ <strong>Upozornění:</strong> Po úhradě exekuce a doporučeného výživného vám zbude méně než 
                      zákonné nezabavitelné minimum. V praxi soud výživné vyměří, ale exekutor musí snížit srážky pro 
                      jiné běžné dluhy, aby bylo zajištěno přednostní výživné dětí a vaše přežití.
                    </div>
                  ) : (
                    <div className="mt-2.5 p-2.5 bg-teal-50 text-teal-950 rounded-lg border border-teal-200 text-[10px] leading-normal font-medium">
                      ✅ <strong>Finanční shoda:</strong> Váš reálný příjem po odečtení exekučních srážek a výživného zůstává 
                      nad hranicí nezabavitelného minima. Výživné je plně uhraditelné.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Custom note about Unemployment Imputation */}
            {isUnemployedA && unemployedReasonA !== 'unable' && (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl space-y-2">
                <div className="flex gap-2 text-amber-950 font-bold text-xs">
                  <Scale className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>Argumentace pro soud při nezaměstnanosti</div>
                </div>
                <p className="text-[10px] text-slate-700 leading-relaxed">
                  České soudy neuznávají argument „nemám práci, nemůžu platit“, pokud je rodič zdravý a schopen práce. 
                  Soud zkoumá tzv. <strong>potenciální příjem</strong> – kolik byste si mohl vydělat s ohledem na své vzdělání, praxi a 
                  nabídky práce v regionu. Pokud se záměrně vyhýbáte práci, vyměří výživné např. z průměrné mzdy.
                </p>
              </div>
            )}

            {/* Note about extra child costs */}
            <div className="border-t border-[#EBE7E0] pt-4 text-[10px] text-slate-500 space-y-1.5">
              <span className="font-bold text-slate-600 uppercase tracking-wider block font-mono">Mimořádné výdaje:</span>
              <p className="leading-relaxed">
                Standardní alimenty pokrývají běžné potřeby (jídlo, oblečení, škola). Výjimečné výdaje (rovnátka, školní zájezdy, lyžařské kurzy) se podle metodiky dělí nad rámec výživného na polovinu nebo v poměru příjmů rodičů.
              </p>
            </div>
          </div>

          {/* Legal Warning */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 leading-relaxed">
              <strong>Právní upozornění:</strong> Výpočet je orientační. České soudy posuzují individuální možnosti a majetkové poměry obou rodičů, míru osobní péče, specifické zdravotní potřeby dětí i to, zda se některý z rodičů nevzdal bez vážného důvodu výhodnějšího zaměstnání či majetkového prospěchu.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
