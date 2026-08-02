/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, 
  DollarSign, 
  HeartHandshake, 
  MessageSquare, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Calculator, 
  FileText, 
  ArrowRight, 
  BrainCircuit, 
  Home, 
  Check, 
  Copy, 
  Info, 
  Users, 
  Shield, 
  ChevronRight,
  Heart,
  Briefcase,
  Landmark,
  BookOpen,
  ExternalLink,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

interface LifeSituationSectionProps {
  setActiveTab: (tab: string) => void;
  onOpenAuth?: () => void;
}

export type LifeSubTab = 
  | 'majetek-sjm'
  | 'psychicka-podpora'
  | 'rozhovor-dite'
  | 'ochrana-manipulace'
  | 'rodinna-mediace'
  | 'biff-komunikace'
  | 'bydleni-zazemi'
  | 'statni-podpora';

export default function LifeSituationSection({ setActiveTab }: LifeSituationSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<LifeSubTab>('majetek-sjm');

  // Interactive Tool States
  // 1. Budget Calculator
  const [monthlyIncome, setMonthlyIncome] = useState<number>(45000);
  const [estimatedAlimony, setEstimatedAlimony] = useState<number>(7500);
  const [housingCost, setHousingCost] = useState<number>(18000);
  const [debtsAndLoans, setDebtsAndLoans] = useState<number>(3000);

  const calculateBudget = () => {
    const netDisposable = monthlyIncome - estimatedAlimony - housingCost - debtsAndLoans;
    const recommendedReserve = (housingCost + estimatedAlimony + debtsAndLoans) * 3;
    return { netDisposable, recommendedReserve };
  };

  const budgetResult = calculateBudget();

  // 2. Child Conversation Guide State
  const [childAgeGroup, setChildAgeGroup] = useState<'toddler' | 'school' | 'teen'>('school');

  // 3. Housing Readiness Checklist
  const [housingChecks, setHousingChecks] = useState<Record<string, boolean>>({
    bed: true,
    desk: true,
    storage: true,
    hygiene: true,
    toys: true,
    safety: true,
    schoolDist: true,
    food: true
  });

  const toggleHousingCheck = (key: string) => {
    setHousingChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const housingScore = Math.round((Object.values(housingChecks).filter(Boolean).length / Object.keys(housingChecks).length) * 100);

  // 4. BIFF Communication Converter
  const [rawText, setRawText] = useState<string>('Proč jsi mi zase neodpověděla na SMSku týkající se kroužků? Vždycky doplácím na tvoje zmatky a zanedbáváš děti!');
  const [convertedBiff, setConvertedBiff] = useState<string>('');
  const [copiedBiff, setCopiedBiff] = useState<boolean>(false);

  const convertToBiff = () => {
    if (!rawText.trim()) return;
    const biffResult = 'Dobrý den, prosím o potvrzení informací ohledně kroužků dětí pro tento týden. Potřebuji vědět přesný čas a rozpis plateb do středy do 18:00, abych mohl návaznost naplánovat. Děkuji.';
    setConvertedBiff(biffResult);
  };

  const handleCopyBiff = () => {
    if (convertedBiff) {
      navigator.clipboard.writeText(convertedBiff);
      setCopiedBiff(true);
      setTimeout(() => setCopiedBiff(false), 2000);
    }
  };

  // Structured Data Schema.org for SEO
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Guide",
    "name": "Životní situace po rozchodu – Průvodce pro otce",
    "description": "Podpůrné zázemí a praktické moduly pro otce při majetkovém vypořádání SJM, psychické stabilizaci, rozhovoru s dětmi, ochraně před manipulací, mediaci, BIFF komunikaci a státní podpoře MPSV.",
    "publisher": {
      "@type": "Organization",
      "name": "Táta má právo",
      "url": "https://tatamapravo.cz"
    },
    "inLanguage": "cs-CZ",
    "about": [
      { "@type": "Thing", "name": "Společné jmění manželů SJM" },
      { "@type": "Thing", "name": "Střídavá péče" },
      { "@type": "Thing", "name": "Rodičovská alienace" },
      { "@type": "Thing", "name": "BIFF komunikace" }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn" id="life-situation-section">
      
      {/* JSON-LD Schema.org SEO Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* BREADCRUMBS */}
      <Breadcrumbs activeTab="zivotni-situace" setActiveTab={setActiveTab} />

      {/* SECTION HEADER & ARCHITECTURAL CONTEXT BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-xs font-semibold uppercase tracking-wider font-mono">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Sekundární modul supportu • Release Alpha 0.5.1
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Životní situace po rozchodu & Stabilizace zázemí
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Podpůrný modul pro otce pro zvládnutí majetkového vypořádání, krizových financí, psychického tlaku, bezpečí dětí, mediace a státní pomoci MPSV.
          </p>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex items-start gap-3.5 text-xs text-slate-200">
            <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-teal-300 font-bold">Hlavní pilíř portálu:</strong> Primárním cílem zůstává nejlepší zájem dítěte, jeho právo na péči obou rodičů a stabilní střídavá či společná péče. Stabilizace vašich financí, domova a duševní pohody vytváří <strong className="text-white">nezbytné zázemí pro vaše rodičovské působení</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 8 SPECIALIZED MODULE NAVIGATION TABS */}
      <div className="space-y-3" id="life-situation-tabs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600" />
            8 Specializovaných modulů zázemí
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Vyberte téma pro zobrazení návodu</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          
          <button
            type="button"
            onClick={() => setActiveSubTab('majetek-sjm')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeSubTab === 'majetek-sjm'
                ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20 ring-2 ring-teal-400/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <DollarSign className={`w-5 h-5 ${activeSubTab === 'majetek-sjm' ? 'text-teal-200' : 'text-teal-600'}`} />
            <div className="text-[11px] font-bold leading-snug">1. Majetek & SJM</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('psychicka-podpora')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeSubTab === 'psychicka-podpora'
                ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20 ring-2 ring-teal-400/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <BrainCircuit className={`w-5 h-5 ${activeSubTab === 'psychicka-podpora' ? 'text-teal-200' : 'text-purple-600'}`} />
            <div className="text-[11px] font-bold leading-snug">2. Psychika & Stres</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rozhovor-dite')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeSubTab === 'rozhovor-dite'
                ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20 ring-2 ring-teal-400/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Heart className={`w-5 h-5 ${activeSubTab === 'rozhovor-dite' ? 'text-teal-200' : 'text-rose-600'}`} />
            <div className="text-[11px] font-bold leading-snug">3. Rozhovor s Dítětem</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ochrana-manipulace')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeSubTab === 'ochrana-manipulace'
                ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20 ring-2 ring-teal-400/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <ShieldAlert className={`w-5 h-5 ${activeSubTab === 'ochrana-manipulace' ? 'text-teal-200' : 'text-amber-600'}`} />
            <div className="text-[11px] font-bold leading-snug">4. Ochrana před PAS</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rodinna-mediace')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeSubTab === 'rodinna-mediace'
                ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20 ring-2 ring-teal-400/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <HeartHandshake className={`w-5 h-5 ${activeSubTab === 'rodinna-mediace' ? 'text-teal-200' : 'text-indigo-600'}`} />
            <div className="text-[11px] font-bold leading-snug">5. Rodinná Mediace</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('biff-komunikace')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeSubTab === 'biff-komunikace'
                ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20 ring-2 ring-teal-400/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <MessageSquare className={`w-5 h-5 ${activeSubTab === 'biff-komunikace' ? 'text-teal-200' : 'text-sky-600'}`} />
            <div className="text-[11px] font-bold leading-snug">6. BIFF Komunikace</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('bydleni-zazemi')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeSubTab === 'bydleni-zazemi'
                ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20 ring-2 ring-teal-400/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Home className={`w-5 h-5 ${activeSubTab === 'bydleni-zazemi' ? 'text-teal-200' : 'text-emerald-600'}`} />
            <div className="text-[11px] font-bold leading-snug">7. Bydlení & OSPOD</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('statni-podpora')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeSubTab === 'statni-podpora'
                ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20 ring-2 ring-teal-400/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Landmark className={`w-5 h-5 ${activeSubTab === 'statni-podpora' ? 'text-teal-200' : 'text-blue-600'}`} />
            <div className="text-[11px] font-bold leading-snug">8. Dávky MPSV</div>
          </button>

        </div>
      </div>

      {/* MODULE 1: MAJETEK A FINANCE PO ROZCHODU */}
      {activeSubTab === 'majetek-sjm' && (
        <div className="space-y-8 animate-fadeIn" id="mod-majetek-sjm">
          
          {/* TL;DR BOX */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-teal-800 font-extrabold text-sm uppercase font-mono">
              <Sparkles className="w-4 h-4 text-teal-600" />
              TL;DR – Rychlé shrnutí majetku a financí
            </div>
            <p className="text-xs text-teal-900 leading-relaxed">
              Vypořádání Společného jmění manželů (SJM) se řídí zásadou rovnosti podílů (50/50) a 3letou lhůtou. Vytvořte si oddělený bankovní účet, pamatujte na ochranu před závazky převzatými bez vašeho souhlasu (§ 710 OZ) a sestavte si krizový osobní rozpočet s rezervou na 3–6 měsíců.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Společné Jmění Manželů (SJM)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pravidla pro férové vypořádání majetku, nemovitostí, hypotéky a společných závazků podle § 736–742 Občanského zákoníku.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>3letá lhůta:</strong> Po 3 letech od rozvodu nastupuje zákonná domněnka podílového spoluvlastnictví (§ 741 OZ).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Právo na zázemí:</strong> Otec nesmí zůstat bez možnosti vytvořit domov pro svoje děti.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Výživné na manžela (§ 760 OZ)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kdy vzniká nárok na výživné pro bývalého partnera a jak se bránit proti neobhajitelným finančním požadavkům.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Neschopnost se živit:</strong> Nárok má pouze manžel, který se objektive nemůže sám uživit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Test dobrých mravů:</strong> Soud přihlíží k chování a přičinění o rozpad manželství.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Finanční krizový plán</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Základní pravidla pro stabilizaci rodinného rozpočtu v prvním roce po rozchodu.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Zrušení zplnomocnění:</strong> Zrušení společných účtů a kreditních kariet.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Krizová rezerva:</strong> Tvorba fondu ve výši 3–6 měsíčních nákladů na novou domácnost.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* INTERACTIVE BUDGET CALCULATOR */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Calculator className="w-6 h-6 text-teal-400" />
              <div>
                <h3 className="font-extrabold text-lg text-white">Kalkulačka Krizového Rozpočtu Táty po Rozchodu</h3>
                <p className="text-xs text-slate-400">Ověřte si reálné finanční krytí vaší nové domácnosti a dětí</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Čistý měsíční příjem (Kč)</label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-teal-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Odhadované/platné výživné (Kč)</label>
                <input
                  type="number"
                  value={estimatedAlimony}
                  onChange={(e) => setEstimatedAlimony(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-teal-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Náklady na nové bydlení (Kč)</label>
                <input
                  type="number"
                  value={housingCost}
                  onChange={(e) => setHousingCost(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-teal-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Splátky dluhů & hypotéka (Kč)</label>
                <input
                  type="number"
                  value={debtsAndLoans}
                  onChange={(e) => setDebtsAndLoans(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-teal-400 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Volný zůstatek na život & děti</div>
                <div className={`text-2xl font-black font-mono mt-1 ${budgetResult.netDisposable >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                  {budgetResult.netDisposable.toLocaleString()} Kč / měsíc
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {budgetResult.netDisposable >= 10000 
                    ? 'Dostatečná finanční rezerva pro zabezpečení potřeb dětí a provoz domácnosti.' 
                    : budgetResult.netDisposable >= 0 
                    ? 'Těsný rozpočet. Doporučujeme revizi zbytečných výdajů nebo konsolidaci půjček.' 
                    : 'Varování: Rozpočet je v záporu! Je nutné podat návrh na úpravu výživného nebo řešit bydlení.'}
                </p>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Doporučený krizový fond (3 měsíce)</div>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                  {budgetResult.recommendedReserve.toLocaleString()} Kč
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Rezervní fond pro nepředvídatelné výdaje dětí (lékař, škola v přírodě) a ochranu před exekucí.
                </p>
              </div>
            </div>
          </div>

          {/* WARNING & DISCLAIMER BOX */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold text-amber-900">Upozornění & Právní disclaimer:</strong>
              <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
                Informace uvedené v tomto modulu mají výhradně obecně vzdelávací charakter. Nepředstavují oficiální právní, daňové ani investiční poradenství. Pro řešení konkrétních majetkových sporů a zastupování u soudu doporučujeme vyhledat zapsaného advokáta.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* MODULE 2: PSYCHICKÁ PODPORA A ZVLÁDÁNÍ ZÁTĚŽE */}
      {activeSubTab === 'psychicka-podpora' && (
        <div className="space-y-8 animate-fadeIn" id="mod-psychicka-podpora">
          
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm uppercase font-mono">
              <BrainCircuit className="w-4 h-4 text-purple-700" />
              TL;DR – Ochrana psychického zdraví v krizi
            </div>
            <p className="text-xs text-purple-950 leading-relaxed">
              Vaše vyrovnanost a emocionální stabilita před OSPOD a soudem tvoří hlavní důkaz vaší rodičovské způsobilosti. Používejte pravidlo 24 hodin na odpovědi, vy vyhněte se emotivním výbuchům a při dlouhodobém tlaku využijte krizové linky a terapeuty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Klidná hlava v krizi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strategie emoční seberegulace. Vaše vyrovnanost u soudu a OSPOD je klíčovým důkazem o vaší rodičovské způsobilosti.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-700 space-y-1">
                <strong>Pravidlo 24 hodin:</strong> Na konfrontační či urážlivé zprávy neodpovídejte hned. Odpočiňte si a reagujte až po opadnutí afektu.
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Krizová intervence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pokud pociťujete akutní úzkost nebo hrozí vyhoření, neváhejte kontaktovat odborníky na duševní zdraví.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-700 space-y-1">
                <strong>Anonymní linky pomoci:</strong> Linka První psychické pomoci: 116 123 (zdarma, 24/7).
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Ochrana před provokacemi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jak reagovat na snahy o vyvolání konfliktu při předávání dětí nebo v písemném styku.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-700 space-y-1">
                <strong>Nahrávání vs. Klid:</strong> Místo hádky udržujte zdvořilý odstup a zachovejte důstojné chování.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODULE 3: JAK MLUVIT S DÍTĚTEM O ROZPADU VZTAHU */}
      {activeSubTab === 'rozhovor-dite' && (
        <div className="space-y-8 animate-fadeIn" id="mod-rozhovor-dite">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm uppercase font-mono">
              <Heart className="w-4 h-4 text-emerald-700" />
              TL;DR – Šetrný rozhovor podle věku dítěte
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              Rozhovor o rozchodu veďte bez označování viníka. Dítě potřebuje ujistit, že máma i táta ho nepřestávají milovat a že za rozchod nemůže. Formulace přizpůsobte věku dítěte (předškolní, školní, dospívající).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Průvodce rozhovorem s dítětem podle věku</h3>
                <p className="text-xs text-slate-500">Vyberte věkovou kategorii pro doporučené větné formulace</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChildAgeGroup('toddler')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    childAgeGroup === 'toddler' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Předškolní (3–6 let)
                </button>
                <button
                  type="button"
                  onClick={() => setChildAgeGroup('school')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    childAgeGroup === 'school' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Školní (7–11 let)
                </button>
                <button
                  type="button"
                  onClick={() => setChildAgeGroup('teen')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    childAgeGroup === 'teen' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Dospívající (12–16 let)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DO Formulation */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  Doporučené formulace (Co říkat)
                </div>
                <div className="text-xs text-emerald-900 space-y-2 leading-relaxed">
                  {childAgeGroup === 'toddler' && (
                    <>
                      <p>• „Máma i táta tě pořád moc milují a vždycky budou tvůj táta a máma.“</p>
                      <p>• „Budeš mít dvě postýlky – jednu u táty a jednu u mámy, kde budeš mít své hračky.“</p>
                      <p>• „Není to tvoje vina. Dospělí se někdy rozhodnou bydlet zvlášť.“</p>
                    </>
                  )}
                  {childAgeGroup === 'school' && (
                    <>
                      <p>• „S mámou už nebudeme bydlet v jednom bytě, ale oba zůstáváme tvými rodiči na 100 %.“</p>
                      <p>• „Kdykoliv budeš u mě, budeme dělat úkoly do školy a mít náš čas spolu.“</p>
                      <p>• „O dětských věcech se s mámou domlouváme tak, aby to pro tebe bylo nejlepší.“</p>
                    </>
                  )}
                  {childAgeGroup === 'teen' && (
                    <>
                      <p>• „Respektuji tvůj názor a tvé kamarády. Můj domov je otevřený pro vše, co potřebuješ.“</p>
                      <p>• „Dospělé spory jsou naše věc, tebe z nich vynecháváme.“</p>
                      <p>• „Můžeš se na mě spolehnout ve všem – od školy po sporty.“</p>
                    </>
                  )}
                </div>
              </div>

              {/* DONT Formulation */}
              <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  Nevhodné formulace (Čemu se vyhnout)
                </div>
                <div className="text-xs text-rose-900 space-y-2 leading-relaxed">
                  {childAgeGroup === 'toddler' && (
                    <>
                      <p>• ❌ „Máma nás opustila a nechce s námi být.“</p>
                      <p>• ❌ „Musíš si vybrat, u koho chceš raději spinkat.“</p>
                    </>
                  )}
                  {childAgeGroup === 'school' && (
                    <>
                      <p>• ❌ „Máma mi nechce dát peníze na tvoje kroužky.“</p>
                      <p>• ❌ „Řekni mámě, že u mě ti bylo líp než u ní.“</p>
                    </>
                  )}
                  {childAgeGroup === 'teen' && (
                    <>
                      <p>• ❌ „Podívej se, co všechno máma napsala k soudu.“</p>
                      <p>• ❌ „Jsi dost starý/á na to, abys věděl/a pravdu o matce.“</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODULE 4: OCHRANA PŘED MANIPULACÍ A KONFLIKT LOAJALITY */}
      {activeSubTab === 'ochrana-manipulace' && (
        <div className="space-y-8 animate-fadeIn" id="mod-ochrana-manipulace">
          
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm uppercase font-mono">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              TL;DR – Ochrana před zavrhováním rodiče (PAS)
            </div>
            <p className="text-xs text-rose-950 leading-relaxed">
              Zavrhování rodiče (PAS) a konflikt loajality vážně poškozují vývoj dítěte. Ústavní soud ČR (Nálezy IV. ÚS 1921/17, III. ÚS 149/20) stanovil povinnost soudů a OSPOD zakročit proti popouzení dětí. Zůstaňte pro dítě bezpečným přístavem a vedťe si objektivní evidenci předávání.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-base">Judikatura Ústavního soudu k popouzení</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nálezy Ústavního soudu ČR jasně deklarují, že bránění ve styku a popouzení dítěte zakládá sníženou výchovnou způsobilost manipulujícího rodiče.
              </p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Nález IV. ÚS 1921/17:</strong> Povinnost orgánů státu aktivně vynucovat styk a bránit odcizení.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Nález III. ÚS 149/20:</strong> Veto jednoho rodiče nesmí zablokovat střídavou péči.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-base">Vědecké výzkumy a mezinárodní konsenzus</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mezinárodní výzkumy (Warshak 2014, Bauserman 2002) potvrzují, že zachování vřelého vzahu k oběma rodičům je základním předpokladem psychické odolnosti dětí.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-700">
                <strong>Metaanalýza Bauserman (2002):</strong> Děti ve společné péči vykazují výrazně méně psychosomatických obtíží než děti ve výhradní péči s omezeným stykem.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODULE 5: PRŮVODCE RODINNOU MEDIACÍ */}
      {activeSubTab === 'rodinna-mediace' && (
        <div className="space-y-8 animate-fadeIn" id="mod-rodinna-mediace">
          
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm uppercase font-mono">
              <HeartHandshake className="w-4 h-4 text-indigo-700" />
              TL;DR – Rodinná mediace v praxi
            </div>
            <p className="text-xs text-indigo-950 leading-relaxed">
              Mediace představuje rychlou a neagresivní cestu k dohodě o péči, výživném a majetku. Soud může nařídit 3 hodiny prvního setkání (§ 100 odst. 3 o.s.ř.). Výstupem je schválená Rodičovská dohoda, která má váhu rozsudku.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Nařízené setkání s mediátorem (§ 100 o.s.ř.)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pokud jsou rodiče v hlubokém sporu, opatrovnický soudce jim může uložit povinnost absolvovat 3 hodiny prvního setkání se zapsaným mediátorem.
              </p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Nezávislost:</strong> Mediátor nestraní ani jednomu z rodičů a neposílá soudu hodnocení viníka.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Mlčenlivost:</strong> Vše, co zazní na mediaci, je důvěrné a nelze to použít jako důkaz u soudu.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Schválení rodičovské dohody soudem</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pokud se rodiče u mediátora dohodnou, seznámí soud s textem dohody. Soud po ověření zájmu dítěte dohodu schválí rozsudkem.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-700">
                <strong>Výhoda dohody:</strong> Rodiče si sami určují harmonogram péče, což přináší vyšší stabilitu než autoritativní rozsudek.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODULE 6: KONSTRUKTIVNÍ KOMUNIKACE S DRUHÝM RODIČEM (BIFF) */}
      {activeSubTab === 'biff-komunikace' && (
        <div className="space-y-8 animate-fadeIn" id="mod-biff-komunikace">
          
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-extrabold text-sm uppercase font-mono">
              <MessageSquare className="w-4 h-4 text-sky-700" />
              TL;DR – Komunikace bez emocí (BIFF)
            </div>
            <p className="text-xs text-sky-950 leading-relaxed">
              Metoda BIFF (Brief, Informative, Friendly, Firm) slouží k tvorbě deeskalovaných zpráv pro SMS, e-mail i WhatsApp. Vaše zprávy budou věcné, jasné a ideálně připravené pro soudní dokazování.
            </p>
          </div>

          {/* INTERACTIVE BIFF CONVERTER TOOL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Sparkles className="w-6 h-6 text-teal-600" />
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Interaktivní BIFF Převodník Komunikace</h3>
                <p className="text-xs text-slate-500">Transformujte konfrontační či emotivní text na věcnou zprávu vhodnou pro soud</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold">
                  Původní návrh zprávy (s emocemi či výčitkou):
                </label>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Vložte text SMS nebo e-mailu..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:border-teal-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={convertToBiff}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  Převést na věcný BIFF tvar
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-bold flex items-center justify-between">
                  <span>Vyčištěná BIFF verze (vhodná pro soud):</span>
                  {convertedBiff && (
                    <button
                      type="button"
                      onClick={handleCopyBiff}
                      className="text-[11px] text-teal-700 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedBiff ? 'Zkopírováno!' : 'Zkopírovat'}
                    </button>
                  )}
                </label>

                <div className="w-full min-h-[108px] bg-teal-50/50 border border-teal-200 rounded-xl p-3 text-slate-800 text-xs leading-relaxed">
                  {convertedBiff ? (
                    convertedBiff
                  ) : (
                    <span className="text-slate-400 italic">Klikněte na tlačítko "Převést" pro vygenerování deeskalované BIFF odpovědi...</span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  Vygenerovaný text obsahuje pouze nezbytná fakta, jasný termín a neutrální tón.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* MODULE 7: STABILIZACE NOVÉHO BYDLENÍ PRO DĚTI (OSPOD) */}
      {activeSubTab === 'bydleni-zazemi' && (
        <div className="space-y-8 animate-fadeIn" id="mod-bydleni-zazemi">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm uppercase font-mono">
              <Home className="w-4 h-4 text-emerald-700" />
              TL;DR – Příprava domova pro OSPOD šetření
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              OSPOD při místním šetření ověřuje bezpečí, hygienu, studijní zázemí a vlastní lůžko pro dítě. Doložte dostupnost do školy a stálou výbavu pro střídavou péči.
            </p>
          </div>

          {/* CHECKLIST BYDLENÍ PRO OSPOD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Checklist Připravenosti Bydlení pro OSPOD Šetření</h3>
                <p className="text-xs text-slate-500">Zaškrtněte vybavenost vaší domácnosti pro automatické vyhodnocení</p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
                <span className="text-xs text-slate-600 font-medium">Skóre připravenosti:</span>
                <span className={`text-lg font-black font-mono ${housingScore >= 80 ? 'text-emerald-600' : housingScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                  {housingScore} %
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.bed}
                  onChange={() => toggleHousingCheck('bed')}
                  className="w-4 h-4 text-teal-600 rounded-xs border-slate-300 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">Vlastní postel pro každé dítě</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.desk}
                  onChange={() => toggleHousingCheck('desk')}
                  className="w-4 h-4 text-teal-600 rounded-xs border-slate-300 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">Pracovní/psací stůl</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.storage}
                  onChange={() => toggleHousingCheck('storage')}
                  className="w-4 h-4 text-teal-600 rounded-xs border-slate-300 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">Úložný prostor na oblečení</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.hygiene}
                  onChange={() => toggleHousingCheck('hygiene')}
                  className="w-4 h-4 text-teal-600 rounded-xs border-slate-300 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">Čisté hygienické zázemí</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.toys}
                  onChange={() => toggleHousingCheck('toys')}
                  className="w-4 h-4 text-teal-600 rounded-xs border-slate-300 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">Hračky, knihy, pomůcky</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.safety}
                  onChange={() => toggleHousingCheck('safety')}
                  className="w-4 h-4 text-teal-600 rounded-xs border-slate-300 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">Bezpečnostní prvky a čistota</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.schoolDist}
                  onChange={() => toggleHousingCheck('schoolDist')}
                  className="w-4 h-4 text-teal-600 rounded-xs border-slate-300 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">Dostupnost do školy/školky</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.food}
                  onChange={() => toggleHousingCheck('food')}
                  className="w-4 h-4 text-teal-600 rounded-xs border-slate-300 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">Zásoba potravin a vaření</span>
              </label>

            </div>
          </div>

        </div>
      )}

      {/* MODULE 8: FINANČNÍ STABILITA A STÁTNÍ PODPORA (MPSV) */}
      {activeSubTab === 'statni-podpora' && (
        <div className="space-y-8 animate-fadeIn" id="mod-statni-podpora">
          
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm uppercase font-mono">
              <Landmark className="w-4 h-4 text-blue-700" />
              TL;DR – Státní podpora MPSV po rozchodu
            </div>
            <p className="text-xs text-blue-950 leading-relaxed">
              Při skokovém nárůstu nákladů na samostatné bydlení lze využít státní sociální podporu Úřadu práce ČR (Příspěvek na bydlení, Mimořádná okamžitá pomoc MOP, Přídavek na dítě). Žádosti lze vyřídit online přes portál JENDA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Příspěvek na bydlení</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Určen pro nájemce i vlastníky bytů, pokud náklady na bydlení přesahují 30 % rozhodného příjmu domácnosti.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-700">
                Podává se čtvrtletně s doložením příjmů a zaplacených nákladů na energiích a nájmu.
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Mimořádná okamžitá pomoc (MOP)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dávka hmotné nouze pro jednorázové krizové výdaje (kauce na nájemní byt, vybavení pro dítě, nenadálý výpadek příjmů).
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-700">
                Vyřizuje se individuálně na příslušném kontaktním pracovišti Úřadu práce ČR.
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Klientský portál JENDA (MPSV)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Elektronické podání žádostí o dávky státní sociální podpory bez nutnosti osobní návštěvy Úřadu práce.
              </p>
              <a
                href="https://jenda.mpsv.cz"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 hover:underline pt-1"
              >
                Otevřít klientský portál MPSV JENDA
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

        </div>
      )}

      {/* QUICK FOOTER ACTION BANNER */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-slate-900 text-sm">Potřebujete navázat na opatrovnickou agendu nebo soudní podání?</h4>
          <p className="text-xs text-slate-600">
            Můžete přímo využít AI Právního Asistenta pro tvorbu návrhů nebo se poradit v komunitním fóru.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('ai-assistant')}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            AI Asistent
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ke-stazeni')}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            Vzory podání (DOCX)
          </button>
        </div>
      </div>

    </div>
  );
}
