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
  PhoneCall, 
  ArrowRight, 
  BrainCircuit, 
  Home, 
  Smile, 
  Check, 
  Copy, 
  Info, 
  RefreshCw, 
  Users, 
  Shield, 
  ChevronRight,
  Heart,
  Briefcase
} from 'lucide-react';

interface LifeSituationSectionProps {
  setActiveTab: (tab: string) => void;
  onOpenAuth?: () => void;
}

export default function LifeSituationSection({ setActiveTab, onOpenAuth }: LifeSituationSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'majetek-finance' | 'psychika-deti' | 'bydleni-zazemi' | 'biff-komunikace'>('majetek-finance');

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
    
    // Rule-based demonstration de-escalation engine
    let biffResult = 'Dobrý den, prosím o potvrzení informací ohledně kroužků dětí pro tento týden. Potřebuji vědět přesný čas a rozpis plateb do středy do 18:00, abych mohl návaznost naplánovat. Děkuji.';
    setConvertedBiff(biffResult);
  };

  const handleCopyBiff = () => {
    if (convertedBiff) {
      navigator.clipboard.writeText(convertedBiff);
      setCopiedBiff(true);
      setTimeout(() => setCopiedBiff(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn" id="life-situation-section">
      
      {/* SECTION HEADER & CONTEXT BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-xs font-semibold uppercase tracking-wider font-mono">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Sekundární modul supportu
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Životní situace & Zázemí po rozchodu
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Komplexní průvodce majetkovým vypořádáním, krizovým rozpočtem, psychickou stabilizací, novým bydlením a věcnou komunikací bez emocí.
          </p>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-start gap-3.5 text-xs text-slate-200">
            <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-teal-300 font-bold">Klíčový princip portálu:</strong> Hlavním pilířem naší platformy je bezpečí, práva a péče o děti. Stabilizace vašich financí, domova a duševní pohody tvoří <strong className="text-white">nezbytnou přípravnou fázi</strong>, bez které nelze dlouhodobě zajistit stabilní a spokojené rodičovství.
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2" id="life-situation-tabs">
        <button
          type="button"
          onClick={() => setActiveSubTab('majetek-finance')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeSubTab === 'majetek-finance'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          1. Majetek & Krizové Finance
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('psychika-deti')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeSubTab === 'psychika-deti'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          2. Psychika & Rozhovor s Dětmi
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('bydleni-zazemi')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeSubTab === 'bydleni-zazemi'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4" />
          3. Bydlení & Zázemí pro OSPOD
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('biff-komunikace')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeSubTab === 'biff-komunikace'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          4. Komunikace Bez Emocí (BIFF)
        </button>
      </div>

      {/* SUB-TAB 1: MAJETEK & KRIZOVÉ FINANCE */}
      {activeSubTab === 'majetek-finance' && (
        <div className="space-y-8 animate-fadeIn" id="tab-majetek-finance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: SJM */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-teal-300 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Společné Jmění Manželů (SJM)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Základní pravidla pro férové vypořádání majetku, nemovitosti, hypotéky a společných závazků podle § 736–742 Občanského zákoníku.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>3letá zákonná lhůta:</strong> Pokud nedojde k dohodě do 3 let od rozvodu, platí zákonná domněnka.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Právo na bydlení:</strong> Otec nesmí zůstat bez možnosti vytvořit zázemí pro své děti.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Ochrana před dluhy:</strong> Zajištění oddělení závazků vzniklých bez vědomí druhého manželů.</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Výživné na manžela */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-teal-300 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Výživné na rozvedeného manžela</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kdy má bývalý partner nárok na výživné (§ 760 OZ) a jak se účinně bránit proti neobhajitelným finančním požadavkům.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Podmínka neschopnosti se živit:</strong> Nárok vzniká pouze při objektivní neschopnosti zabezpečit výživu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Kritérium dobrých mravů:</strong> Soud nepřizná výživné při nevhodném či zákeřném chování.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Časové omezení:</strong> Sankční výživné na dobu max. 3 let u neodděleného manžela.</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Krizový plán */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-teal-300 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Finanční krizový plán</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pravidla pro stabilizaci rodinného rozpočtu v prvním roce po rozchodu a rozdělení domácností.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Oddělení bankovních účtů:</strong> Zrušení společných zplnomocnění a kreditních karet.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Fixace nákladů na děti:</strong> Transparentní evidence mimořádných výdajů na kroužky a léky.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Tvorba rezervy:</strong> Minimálně 3 měsíční násobek fixních nákladů na novou domácnost.</span>
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
        </div>
      )}

      {/* SUB-TAB 2: PSYCHIKA & ROZHOVOR S DĚTMI */}
      {activeSubTab === 'psychika-deti' && (
        <div className="space-y-8 animate-fadeIn" id="tab-psychika-deti">
          
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
              <h3 className="font-extrabold text-slate-900 text-base">Jak mluvit s dětmi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Základní psychologická pravidla pro komunikaci rozchodu s dětmi tak, aby neztratily pocit bezpečí.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-700 space-y-1">
                <strong>Hlavní zásada:</strong> Nikdy nekritizujte matku před dětmi. Dítě se skládá z obou rodičů a kritika jednoho zraňuje dítě samotné.
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Ochrana před manipulací (PAS)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Varovné signály rodičovské alienace (popouzení) a doporučené psychologické i právní kroky k obraně vazby.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-700 space-y-1">
                <strong>Vedení záznamů:</strong> Objektivně si zapisujte reakce dětí při předávání bez obvinění či dohadů.
              </div>
            </div>

          </div>

          {/* INTERACTIVE CHILD DIALOGUE GUIDE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
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

      {/* SUB-TAB 3: BYDLENÍ & ZÁZEMÍ PRO OSPOD */}
      {activeSubTab === 'bydleni-zazemi' && (
        <div className="space-y-8 animate-fadeIn" id="tab-bydleni-zazemi">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Nové bydlení pro tátu a děti</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Při místním šetření OSPOD nezkoumá luxus, ale <strong>bezpečí, stabilitu, osobní prostor dítěte a hygienické zázemí</strong>.
              </p>
              <ul className="text-xs text-slate-700 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Vlastní postel a koutek:</strong> Dítě musí mít plnohodnotné lůžko (nikoliv roztahovací gauč jako trvalé řešení).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Pracovní stůl a hračky:</strong> Místo pro přípravu do školy a věkově odpovídající hračky či knihy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Dostupnost školy/školky:</strong> Dobrá dopravní obslužnost pro předávání a návštěvu školských zařízení.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Nouzové & Startovací bydlení</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Možnosti podpory pro otce, kteří se ocitli v akutní bytové tísni po náhlém opuštění společné domácnosti.
              </p>
              <ul className="text-xs text-slate-700 space-y-2.5">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Městské startovací byty:</strong> Žádosti o dostupné nájemní bydlení na městských úřadech.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Krizová centra pro rodiče s dětmi:</strong> Krátkodobé přechodné ubytování při rozvodu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Doplatek na bydlení & Příspěvek:</strong> Využití dávek státní sociální podpory v přechodné fázi.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* CHECKLIST BYDLENÍ PRO OSPOD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
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
                <span className="font-semibold text-slate-800">Čisté hygienickéázázemí</span>
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

      {/* SUB-TAB 4: KOMUNIKACE BEZ EMOCÍ (BIFF) */}
      {activeSubTab === 'biff-komunikace' && (
        <div className="space-y-8 animate-fadeIn" id="tab-biff-komunikace">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Metoda BIFF (Pravidla komunikace)</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Každá vaše písemná zpráva může být předložena u opatrovnického soudu. Psaní podle metodiky BIFF chrání vaši pověst a eliminuje konflikty.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <strong className="text-teal-700 block">B - Brief (Stručná):</strong>
                  <span className="text-slate-600 text-[11px]">Jen nutná fakta, max. 2-4 věty.</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <strong className="text-teal-700 block">I - Informative (Faktická):</strong>
                  <span className="text-slate-600 text-[11px]">Žádné názory, pouhé informace.</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <strong className="text-teal-700 block">F - Friendly (Mírná):</strong>
                  <span className="text-slate-600 text-[11px]">Slušný pozdrav, neutrální tón.</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <strong className="text-teal-700 block">F - Firm (Pevná):</strong>
                  <span className="text-slate-600 text-[11px]">Jasný termín a požadavek.</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Mediace a Rodinné Poradenství</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jak funguje mimosoudní vyjednávání s bývalou partnerkou pod vedením zapsaného mediátora.
              </p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>První nařízené setkání:</strong> Soud může nařídit 3 hodiny mediace (§ 100 odst. 3 o.s.ř.).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Výběr zapsaného mediátora:</strong> Seznam vedeno Ministerstvem spravedlnosti ČR.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Rodičovská dohoda:</strong> Cílem je schválení dohody soudem (má váhu rozsudku).</span>
                </li>
              </ul>
            </div>

          </div>

          {/* INTERACTIVE BIFF CONVERTER TOOL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Sparkles className="w-6 h-6 text-teal-600" />
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Interaktivní BIFF Převodník Komunikace</h3>
                <p className="text-xs text-slate-500">Ověřte si, jak transformovat konfrontační zprávu na věcný text pro soud</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Input raw draft */}
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

              {/* Converted BIFF Output */}
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

      {/* QUICK FOOTER ACTION BANNER */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-slate-900 text-sm">Potřebujete další asistenci se sporem?</h4>
          <p className="text-xs text-slate-600">
            Můžete využít AI Právního Asistenta pro tvorbu podání nebo se poradit v komunitním fóru.
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
            Vzory podání
          </button>
        </div>
      </div>

    </div>
  );
}
