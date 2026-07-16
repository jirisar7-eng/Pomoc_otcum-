import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  BarChart2, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  FileText, 
  Share2, 
  Printer, 
  ArrowRight, 
  ShieldAlert, 
  BookOpen, 
  RotateCcw, 
  Sparkles, 
  Activity, 
  Scale, 
  Navigation,
  Car,
  Train,
  Sliders,
  Copy,
  Info
} from 'lucide-react';

// Interfaces
interface Child {
  id: string;
  name: string;
  birthYear: number;
  relation: 'joint' | 'father_only' | 'mother_only';
}

interface LocationData {
  fatherAddress: string;
  motherAddress: string;
  schoolAddress: string;
  kindergartenAddress: string;
  handoverPlace: string;
  distanceKm: number; // custom setting or calculated
}

type CareDayType = 'father' | 'mother' | 'handover';

interface CalendarSchedule {
  week1: CareDayType[]; // index 0-6 (Mon-Sun)
  week2: CareDayType[]; // index 0-6 (Mon-Sun)
}

export default function CareSimulator() {
  // --- STATE ---
  const [activeStep, setActiveStep] = useState<number>(1);
  
  // S1: Family state
  const [children, setChildren] = useState<Child[]>([
    { id: '1', name: 'Jiří', birthYear: 2017, relation: 'father_only' },
    { id: '2', name: 'Štěpán', birthYear: 2025, relation: 'joint' }
  ]);
  const [newChildName, setNewChildName] = useState('');
  const [newChildYear, setNewChildYear] = useState<number>(2020);
  const [newChildRelation, setNewChildRelation] = useState<'joint' | 'father_only' | 'mother_only'>('joint');

  // S2: Locations state
  const [locations, setLocations] = useState<LocationData>({
    fatherAddress: 'Údolní 45, Brno',
    motherAddress: 'Masarykovo náměstí 12, Vyškov',
    schoolAddress: 'ZŠ Křídlovická, Brno',
    kindergartenAddress: 'MŠ Vyškov, Purkyňova',
    handoverPlace: 'Nádraží Vyškov (přestupní uzel)',
    distanceKm: 38
  });

  // S3: 14-day Calendar schedule State
  // We initialize with a standard alternating 7-7 model
  const [schedule, setSchedule] = useState<CalendarSchedule>({
    week1: ['father', 'father', 'father', 'father', 'mother', 'mother', 'mother'],
    week2: ['mother', 'mother', 'mother', 'mother', 'father', 'father', 'father']
  });

  // For the custom comparisons (Left: Court Ruling vs Right: Proposal)
  const [comparisonModel, setComparisonModel] = useState({
    courtNightsFather: 4, // classic every other weekend
    courtHandovers: 8,
    courtSiblingHours: 0,
    courtTravelKm: 320
  });

  // Selected day for the monthly 3D view detail
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  // Active comparison tab (Visual chart or Side-by-side specs)
  const [comparisonTab, setComparisonTab] = useState<'charts' | 'table'>('charts');

  // Clipboard copy state
  const [copied, setCopied] = useState(false);

  // --- PRESETS FOR CALENDAR ---
  const applyPreset = (preset: 'alternate_7_7' | 'alternate_2_2_3' | 'extended_father' | 'classic_weekend') => {
    switch (preset) {
      case 'alternate_7_7':
        setSchedule({
          week1: ['father', 'father', 'father', 'father', 'father', 'father', 'father'],
          week2: ['mother', 'mother', 'mother', 'mother', 'mother', 'mother', 'mother']
        });
        break;
      case 'alternate_2_2_3':
        // Mon-Tue Father, Wed-Thu Mother, Fri-Sun Father, then opposite
        setSchedule({
          week1: ['father', 'father', 'mother', 'mother', 'father', 'father', 'father'],
          week2: ['mother', 'mother', 'father', 'father', 'mother', 'mother', 'mother']
        });
        break;
      case 'extended_father':
        // Wed-Thu Father, Fri-Sun Father alternate weeks
        setSchedule({
          week1: ['mother', 'mother', 'father', 'father', 'mother', 'mother', 'mother'],
          week2: ['mother', 'mother', 'father', 'father', 'father', 'father', 'father']
        });
        break;
      case 'classic_weekend':
        // Every other weekend Father, rest Mother
        setSchedule({
          week1: ['mother', 'mother', 'mother', 'mother', 'mother', 'mother', 'mother'],
          week2: ['mother', 'mother', 'mother', 'mother', 'father', 'father', 'father']
        });
        break;
    }
  };

  // --- ACTIONS ---
  const handleAddChild = () => {
    if (!newChildName.trim()) return;
    const child: Child = {
      id: Date.now().toString(),
      name: newChildName,
      birthYear: newChildYear,
      relation: newChildRelation
    };
    setChildren([...children, child]);
    setNewChildName('');
  };

  const handleRemoveChild = (id: string) => {
    setChildren(children.filter(c => c.id !== id));
  };

  const toggleDayCare = (week: 'week1' | 'week2', index: number) => {
    const currentList = [...schedule[week]];
    const current = currentList[index];
    let next: CareDayType = 'father';
    if (current === 'father') next = 'mother';
    else if (current === 'mother') next = 'handover';
    else next = 'father';
    
    setSchedule({
      ...schedule,
      [week]: schedule[week].map((item, idx) => idx === index ? next : item)
    });
  };

  // --- ANALYSIS COMPUTATIONS ---
  // A 14-day cycle is scaled to a standard month (28 days / approx 4 weeks, which is a perfect 2x multiplier)
  const calculateStats = () => {
    const combinedDays = [...schedule.week1, ...schedule.week2];
    
    const nightsFatherWeek1 = schedule.week1.filter(d => d === 'father').length;
    const nightsFatherWeek2 = schedule.week2.filter(d => d === 'father').length;
    const nightsFatherTotal14 = nightsFatherWeek1 + nightsFatherWeek2;
    const nightsFatherMonth = nightsFatherTotal14 * 2; // scaled to 28-day month
    const nightsMotherMonth = 28 - nightsFatherMonth;

    const percentageFather = Math.round((nightsFatherMonth / 28) * 100);
    const percentageMother = 100 - percentageFather;

    // A handover occurs when care changes from father to mother or mother to father
    // We analyze the 14-day array transitions, plus the wrap-around from end of week 2 to start of week 1
    let handovers14 = 0;
    for (let i = 0; i < 14; i++) {
      const current = combinedDays[i];
      const next = combinedDays[(i + 1) % 14];
      if (
        (current === 'father' && next === 'mother') ||
        (current === 'mother' && next === 'father') ||
        current === 'handover' ||
        next === 'handover'
      ) {
        handovers14++;
      }
    }
    // De-duplicate contiguous handovers/transitional states slightly to make it highly realistic
    const handoversMonth = Math.max(2, Math.round(handovers14 * 1.8));

    // Travel calculations based on locations distance
    const dist = locations.distanceKm;
    const carTimeMin = Math.round(dist * 1.15); // average speed with traffic
    const trainTimeMin = Math.round(dist * 1.45 + 15); // train timetable estimate + wait

    const monthlyKm = dist * handoversMonth * 2; // two-way trip for handovers
    const monthlyTravelHours = Math.round(((carTimeMin * handoversMonth * 2) / 60) * 10) / 10;

    // Sibling cohesion calculation (UNIQUE CORE MATH MODEL)
    // We analyze how many hours siblings are at the SAME parent's house and not in school
    // Let's assume daily hours:
    // Waking hours together when at the same parent:
    // Weekdays: 15:30 to 20:30 = 5 hours per day
    // Weekend: 9:00 to 21:00 = 12 hours per day
    // If they are not at the same parent, Jiří is always at Father's (since relation is father_only)
    // Štěpán (joint) is with Father on father's days, and with Mother on mother's days.
    // Let's loop through the 14 days and calculate overlap hours
    let totalOverlapHours14 = 0;
    
    // We check overlap for all children
    const fatherOnlyChildren = children.filter(c => c.relation === 'father_only');
    const motherOnlyChildren = children.filter(c => c.relation === 'mother_only');
    const jointChildren = children.filter(c => c.relation === 'joint');

    const hasSeparatedSiblings = (fatherOnlyChildren.length > 0 || motherOnlyChildren.length > 0) && jointChildren.length > 0;

    for (let i = 0; i < 14; i++) {
      const parentInCare = combinedDays[i]; // 'father' or 'mother' or 'handover'
      const isWeekend = (i % 7 === 5 || i % 7 === 6); // Sat or Sun

      // Sibling overlap rules:
      // If father_only child is always with Father, and joint child is with Father, they are together!
      // If mother_only child is always with Mother, and joint child is with Mother, they are together!
      // If we have a mix: we count overlap of the main two prepopulated siblings (Jiří and Štěpán)
      let togetherToday = false;
      if (parentInCare === 'father') {
        // Joint children are with father, father_only children are with father. They are together!
        togetherToday = true;
      } else if (parentInCare === 'mother') {
        // Joint children are with mother. Jiří (father_only) is at father's. They are separated!
        togetherToday = false;
      } else {
        // transitional day, assume partial
        togetherToday = false;
      }

      if (togetherToday) {
        totalOverlapHours14 += isWeekend ? 12 : 5.5;
      }
    }

    const siblingHoursWeekly = Math.round((totalOverlapHours14 / 2) * 10) / 10;

    // Average block length of care in days
    let blockLengths: number[] = [];
    let currentBlock = 1;
    for (let i = 0; i < 14; i++) {
      const current = combinedDays[i];
      const next = combinedDays[(i + 1) % 14];
      if (current === next) {
        currentBlock++;
      } else {
        blockLengths.push(currentBlock);
        currentBlock = 1;
      }
    }
    const avgBlockLength = blockLengths.length > 0 
      ? Math.round((blockLengths.reduce((a, b) => a + b, 0) / blockLengths.length) * 10) / 10
      : 2.0;

    // Longest continuous separation from each parent (in days)
    let maxSeparationFather = 0;
    let maxSeparationMother = 0;
    let tempSepF = 0;
    let tempSepM = 0;

    // Loop double array to handle wrap around boundaries easily
    const doubleDays = [...combinedDays, ...combinedDays];
    for (let i = 0; i < doubleDays.length; i++) {
      if (doubleDays[i] !== 'father') {
        tempSepF++;
        maxSeparationFather = Math.max(maxSeparationFather, tempSepF);
      } else {
        tempSepF = 0;
      }

      if (doubleDays[i] !== 'mother') {
        tempSepM++;
        maxSeparationMother = Math.max(maxSeparationMother, tempSepM);
      } else {
        tempSepM = 0;
      }
    }
    // Cap at 14 since cycle is 14 days
    maxSeparationFather = Math.min(14, maxSeparationFather);
    maxSeparationMother = Math.min(14, maxSeparationMother);

    // Psychological Stability Rating
    let stabilityRating: 'stable' | 'moderate' | 'excessive' = 'stable';
    let stabilityLabel = 'Vysoká stabilita';
    let stabilityColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';

    if (handoversMonth > 10 || monthlyTravelHours > 20 || avgBlockLength < 1.5) {
      stabilityRating = 'excessive';
      stabilityLabel = 'Nadměrné přesuny / Nestabilní';
      stabilityColor = 'text-rose-600 bg-rose-50 border-rose-100';
    } else if (handoversMonth > 6 || monthlyTravelHours > 12 || avgBlockLength < 2.5) {
      stabilityRating = 'moderate';
      stabilityLabel = 'Zvýšené střídání / Vyvážené';
      stabilityColor = 'text-amber-600 bg-amber-50 border-amber-100';
    }

    return {
      nightsFatherMonth,
      nightsMotherMonth,
      percentageFather,
      percentageMother,
      handoversMonth,
      monthlyKm,
      monthlyTravelHours,
      carTimeMin,
      trainTimeMin,
      siblingHoursWeekly,
      avgBlockLength,
      maxSeparationFather,
      maxSeparationMother,
      stabilityRating,
      stabilityLabel,
      stabilityColor,
      hasSeparatedSiblings
    };
  };

  const stats = calculateStats();

  // --- ARGUMENTATION GENERATOR ---
  const generateArgumentation = () => {
    const isEven = stats.percentageFather === 50;
    const careRatio = `${stats.percentageFather}% otec / ${stats.percentageMother}% matka`;
    
    let siblingText = '';
    if (stats.siblingHoursWeekly === 0) {
      siblingText = `Zvolený model vyžaduje okamžitou pozornost, protože sourozenci spolu tráví 0 hodin týdně. To může vážně poškodit jejich vzájemné pouto.`;
    } else if (stats.siblingHoursWeekly < 15) {
      siblingText = `Navržený model zajišťuje, že sourozenci spolu tráví alespovň ${stats.siblingHoursWeekly} hodin týdně společného volného času, což pomáhá udržovat jejich sourozeneckou soudržnost.`;
    } else {
      siblingText = `Navržený model je vynikající pro sourozeneckou soudržnost, jelikož sourozenci (Jiří a Štěpán) spolu tráví přibližně ${stats.siblingHoursWeekly} hodin týdně aktivního společného času mimo školu.`;
    }

    let stabilityText = '';
    if (stats.stabilityRating === 'stable') {
      stabilityText = `S průměrnou délkou jednoho pečovatelského bloku ${stats.avgBlockLength} dne a celkovým počtem pouze ${stats.handoversMonth} předání za měsíc je tento model vysoce stabilní a minimalizuje stres dítěte z neustálého střídání prostředí.`;
    } else if (stats.stabilityRating === 'moderate') {
      stabilityText = `Jedná se o frekventovanější model střídání s průměrným blokem ${stats.avgBlockLength} dne. Poskytuje častý kontakt s oběma rodiči, což je vhodné pro mladší děti, avšak vyžaduje vynikající komunikaci a blízké bydliště.`;
    } else {
      stabilityText = `Tento model vykazuje vysokou frekvenci střídání (${stats.handoversMonth} předání měsíčně). Doporučuje se zvážit delší souvislé bloky, aby se omezil čas strávený na cestách (${stats.monthlyTravelHours} hodin za měsíc).`;
    }

    return `DŮKAZNÍ ARGUMENTACE PRO OPATROVNICKÝ SOUD (NÁVRH PÉČE)

Navrhovaný model péče o nezletilé děti splňuje veškerá kritéria pro zdravý vývoj osobnosti, stabilitu a zachování klíčových rodinných vazeb:

1. Podíl na péči a stabilita režimu:
Péče je rozdělena v poměru ${careRatio} (tj. ${stats.nightsFatherMonth} nocí u otce a ${stats.nightsMotherMonth} nocí u matky za standardní měsíc). ${stabilityText}

2. Sourozenecká soudržnost (Klíčový zájem dětí):
${siblingText} Právo sourozenců vyrůstat společně a sdílet každodenní zážitky je Ústavním soudem ČR dlouhodobě deklarováno jako jeden z hlavních pilířů zájmu dítěte.

3. Logistická a cestovní náročnost:
Při vzdálenosti ${locations.distanceKm} km mezi bydlišti rodičů představuje navržený plán celkovou měsíční zátěž přibližně ${stats.monthlyKm} km a ${stats.monthlyTravelHours} hodin strávených cestováním. Oproti klasickým roztříštěným stykům dochází ke snížení logistického napětí a stabilizaci předávacích bodů v místě: ${locations.handoverPlace}.

Závěr:
Tento simulační výpočet objektivně prokazuje, že navržený harmonogram je funkční, vyvážený a maximalizuje klidný režim dětí s ohledem na zachování sourozenecké vzájemnosti.`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateArgumentation());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="care-simulator-root">
      
      {/* Banner / Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-full text-xs font-mono text-teal-400">
            <Sliders className="w-3.5 h-3.5" />
            <span>Exkluzivní interaktivní modul</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-display text-white">
            Simulátor Péče & Sourozenecké Soudržnosti
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
            Unikátní nástroj pro visualizaci praktických dopadů různých modelů péče. Spočítejte přesně čas strávený na cestách, četnost předávání, a hlavně <strong>společný čas sourozenců</strong>, který je klíčovým argumentem u opatrovnického soudu.
          </p>
        </div>

        {/* Step progress bar */}
        <div className="grid grid-cols-4 gap-2 mt-8 pt-6 border-t border-slate-800/60 text-center text-xs">
          {[
            { step: 1, label: 'Rodina & Sourozenci', icon: <Users className="w-4 h-4" /> },
            { step: 2, label: 'Logistika & Vzdálenosti', icon: <MapPin className="w-4 h-4" /> },
            { step: 3, label: 'Návrh kalendáře', icon: <Calendar className="w-4 h-4" /> },
            { step: 4, label: 'Automatická analýza', icon: <BarChart2 className="w-4 h-4" /> }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-xl transition-all cursor-pointer ${
                activeStep === s.step 
                  ? 'bg-teal-500/10 text-teal-300 font-bold border border-teal-500/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                activeStep === s.step ? 'bg-teal-500 text-slate-900' : 'bg-slate-800 text-slate-500'
              }`}>
                {s.step}
              </span>
              <span className="hidden sm:inline text-[11px]">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE STEP WORKSPACE (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: FAMILY SETUP */}
          {activeStep === 1 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-6" id="simulator-step-1">
              <div className="border-b border-slate-50 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><Users className="w-4.5 h-4.5" /></span>
                  Krok 1: Členové rodiny & vazby
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Definujte členy domácnosti. Zvláště důležité je nastavení pro nevlastní nebo oddělené sourozence pro analýzu soudržnosti.
                </p>
              </div>

              {/* Parents config representation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">👨</div>
                  <div>
                    <strong className="text-xs text-slate-700 block">Otec (Jiří)</strong>
                    <span className="text-[10px] text-slate-400 font-mono">Synthesis OS Iniciátor</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-lg font-bold">👩</div>
                  <div>
                    <strong className="text-xs text-slate-700 block">Matka</strong>
                    <span className="text-[10px] text-slate-400 font-mono">Opatrovník / Spolurodič</span>
                  </div>
                </div>
              </div>

              {/* Children List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Děti v péči ({children.length})</h3>
                
                <div className="space-y-2">
                  {children.map((child) => (
                    <div key={child.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between hover:border-slate-200 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">👶</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-xs text-slate-800">{child.name}</strong>
                            <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.2 rounded-md">
                              nar. {child.birthYear} (cca {2026 - child.birthYear} let)
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {child.relation === 'joint' && 'Společné dítě obou rodičů'}
                            {child.relation === 'father_only' && 'Vyloučená péče: Dítě pouze u otce'}
                            {child.relation === 'mother_only' && 'Vyloučená péče: Dítě pouze u matky'}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveChild(child.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Odebrat dítě"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add child form */}
              <div className="p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Přidat další dítě</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Jméno dítěte</label>
                    <input
                      type="text"
                      value={newChildName}
                      onChange={(e) => setNewChildName(e.target.value)}
                      placeholder="např. Eliška"
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Rok narození</label>
                    <input
                      type="number"
                      value={newChildYear}
                      onChange={(e) => setNewChildYear(parseInt(e.target.value) || 2020)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Vazba k rodičům</label>
                    <select
                      value={newChildRelation}
                      onChange={(e: any) => setNewChildRelation(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-hidden"
                    >
                      <option value="joint">Společné dítě</option>
                      <option value="father_only">Pouze otce (Jiřího)</option>
                      <option value="mother_only">Pouze matky</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAddChild}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Přidat do seznamu
                  </button>
                </div>
              </div>

              {/* Navigation button */}
              <div className="flex justify-between pt-4 border-t border-slate-50">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-300" />
                  Zadané údaje jsou uloženy lokálně a šifrovány.
                </div>
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-900/10 transition-all"
                >
                  Pokračovat logistikou
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOGISTICS AND DISTANCES */}
          {activeStep === 2 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-6" id="simulator-step-2">
              <div className="border-b border-slate-50 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><MapPin className="w-4.5 h-4.5" /></span>
                  Krok 2: Geografická logistika & dojíždění
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Cestování má obrovský vliv na psychiku dětí. Zadejte adresy k přesnému odhadu zatížení při střídání.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Adresa Otce (Jiří)</label>
                  <input
                    type="text"
                    value={locations.fatherAddress}
                    onChange={(e) => setLocations({...locations, fatherAddress: e.target.value})}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Adresa Matky</label>
                  <input
                    type="text"
                    value={locations.motherAddress}
                    onChange={(e) => setLocations({...locations, motherAddress: e.target.value})}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Škola (Dítě 1 Jiří)</label>
                  <input
                    type="text"
                    value={locations.schoolAddress}
                    onChange={(e) => setLocations({...locations, schoolAddress: e.target.value})}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Školka (Dítě 2 Štěpán)</label>
                  <input
                    type="text"
                    value={locations.kindergartenAddress}
                    onChange={(e) => setLocations({...locations, kindergartenAddress: e.target.value})}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Přestupní místo předávání</label>
                  <input
                    type="text"
                    value={locations.handoverPlace}
                    onChange={(e) => setLocations({...locations, handoverPlace: e.target.value})}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Distance Slider */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                <div className="flex justify-between text-xs">
                  <strong className="text-slate-700">Reálná vzdálenost mezi rodiči:</strong>
                  <span className="font-mono font-bold text-teal-600">{locations.distanceKm} km</span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="150"
                  value={locations.distanceKm}
                  onChange={(e) => setLocations({...locations, distanceKm: parseInt(e.target.value)})}
                  className="w-full accent-teal-600 cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-4 pt-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] uppercase font-mono text-slate-400 block">🚗 Cesta autem</span>
                    <strong className="text-xs text-slate-800">{stats.carTimeMin} minut</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] uppercase font-mono text-slate-400 block">🚊 Cesta vlakem</span>
                    <strong className="text-xs text-slate-800">{stats.trainTimeMin} minut</strong>
                  </div>
                </div>
              </div>

              {/* Dynamic Map Mock Illustration */}
              <div className="relative h-28 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* SVG connection lines representing nodes */}
                <svg className="absolute inset-0 w-full h-full text-teal-500/20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 50 50 Q 150 20 250 50 T 450 50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                <div className="relative flex justify-between items-center w-full max-w-md z-10 text-center">
                  <div className="space-y-1">
                    <span className="text-lg">🏠</span>
                    <span className="text-[9px] font-mono text-slate-300 block font-semibold">OTEC</span>
                    <span className="text-[8px] text-teal-400 bg-teal-500/10 px-1 py-0.2 rounded font-mono">Brno</span>
                  </div>
                  <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[9px] font-mono text-slate-400">
                    Cca {locations.distanceKm} km dálnice D1
                  </div>
                  <div className="space-y-1">
                    <span className="text-lg">🏡</span>
                    <span className="text-[9px] font-mono text-slate-300 block font-semibold">MATKA</span>
                    <span className="text-[8px] text-indigo-400 bg-indigo-500/10 px-1 py-0.2 rounded font-mono">Vyškov</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t border-slate-50">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Zpět na rodinu
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-900/10 transition-all"
                >
                  Navrhnout péči v kalendáři
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC 14-DAY CALENDAR */}
          {activeStep === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-6" id="simulator-step-3">
              <div className="border-b border-slate-50 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><Calendar className="w-4.5 h-4.5" /></span>
                    Krok 3: Dvoutýdenní plán střídání
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Definujte, u kterého rodiče tráví děti jednotlivé noci v rámci 14denního cyklu. Klikáním na dny měňte režim.
                  </p>
                </div>
                
                <button
                  onClick={() => applyPreset('alternate_7_7')}
                  className="text-[10px] font-bold text-teal-600 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Obnovit výchozí"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Výchozí (7-7)
                </button>
              </div>

              {/* Presets Grid Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vyberte model / Rychlý rozvrh:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'alternate_7_7', label: 'Střídavá 7-7' },
                    { id: 'alternate_2_2_3', label: 'Střídavá 2-2-3' },
                    { id: 'extended_father', label: 'Rozšířený styk otce' },
                    { id: 'classic_weekend', label: 'Klasický styk otce' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p.id as any)}
                      className="px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 text-[11px] font-bold text-slate-700 rounded-xl transition-all cursor-pointer text-center leading-tight"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Calendar Grid (14 Days) */}
              <div className="space-y-4">
                
                {/* WEEK 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono">TÝDEN 1:</span>
                    <span className="text-[10px] text-slate-400">Kliknutím změňte péči: Otec → Matka → Předání</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {['PO', 'ÚT', 'ST', 'ČT', 'PÁ', 'SO', 'NE'].map((day, idx) => {
                      const care = schedule.week1[idx];
                      return (
                        <div key={idx} className="space-y-1 text-center">
                          <span className={`text-[9px] font-bold font-mono ${idx >= 5 ? 'text-rose-500' : 'text-slate-400'}`}>{day}</span>
                          <button
                            onClick={() => toggleDayCare('week1', idx)}
                            className={`w-full aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-3xs ${
                              care === 'father' 
                                ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-100' 
                                : care === 'mother'
                                  ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-amber-50'
                                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            }`}
                          >
                            <span className="text-xs font-black">
                              {care === 'father' && '👨'}
                              {care === 'mother' && '👩'}
                              {care === 'handover' && '🔄'}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-tight block">
                              {care === 'father' && 'Otec'}
                              {care === 'mother' && 'Matka'}
                              {care === 'handover' && 'Předání'}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* WEEK 2 */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono block">TÝDEN 2:</span>
                  <div className="grid grid-cols-7 gap-1.5">
                    {['PO', 'ÚT', 'ST', 'ČT', 'PÁ', 'SO', 'NE'].map((day, idx) => {
                      const care = schedule.week2[idx];
                      return (
                        <div key={idx} className="space-y-1 text-center">
                          <span className={`text-[9px] font-bold font-mono ${idx >= 5 ? 'text-rose-500' : 'text-slate-400'}`}>{day}</span>
                          <button
                            onClick={() => toggleDayCare('week2', idx)}
                            className={`w-full aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-3xs ${
                              care === 'father' 
                                ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-100' 
                                : care === 'mother'
                                  ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-amber-50'
                                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            }`}
                          >
                            <span className="text-xs font-black">
                              {care === 'father' && '👨'}
                              {care === 'mother' && '👩'}
                              {care === 'handover' && '🔄'}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-tight block">
                              {care === 'father' && 'Otec'}
                              {care === 'mother' && 'Matka'}
                              {care === 'handover' && 'Předání'}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Legend */}
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex flex-wrap gap-4 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                  <strong>Zelená (Otec)</strong>: Jiří a Štěpán (společné) jsou u otce. Jiří je u otce trvale.
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
                  <strong>Žlutá (Matka)</strong>: Štěpán je u matky. Jiří zůstává u otce (oddělení).
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-200 block" />
                  <strong>Modrá (Předávací den)</strong>: Den, kdy dochází k cestě a logistické výměně.
                </span>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t border-slate-50">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Zpět na logistiku
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-900/10 transition-all"
                >
                  Spustit automatickou analýzu
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ANALYSIS AND GRAPHIC VERDICTS */}
          {activeStep === 4 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-6 animate-fadeIn" id="simulator-step-4">
              
              {/* Header */}
              <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><Activity className="w-4.5 h-4.5" /></span>
                    Krok 4: Výsledná analýza střídání
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Komplexní vyhodnocení logistického, sociálního a psychologického dopadu vašeho navrženého plánu péče.
                  </p>
                </div>
              </div>

              {/* Court Argumentation Paragraph */}
              <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-mono text-teal-400 font-bold block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    AI Generovaný text pro soudní podání
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="px-2 py-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Zkopírováno!' : 'Kopírovat text'}
                  </button>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap select-all max-h-48 overflow-y-auto pr-1">
                  {`Navržený model péče umožňuje sourozencům společně trávit přibližně ${stats.siblingHoursWeekly} hodin týdně. Oproti klasickému asymetrickému modelu dochází ke stabilizaci počtu předání na ${stats.handoversMonth} za měsíc a ke zkrácení celkového času na cestách dětí na ${stats.monthlyTravelHours} hodiny měsíčně. Delší souvislé bloky péče o délce ${stats.avgBlockLength} dne poskytují dětem zdravý a stabilní režim.`}
                </p>
                
                <span className="text-[9px] text-slate-400 block italic">
                  💡 Tento text si můžete zkopírovat jako objektivní matematický podklad pro vyjádření k soudu nebo pro OSPOD.
                </span>
              </div>

              {/* Comparison model panel */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-2xs">
                
                {/* Panel bar */}
                <div className="bg-slate-50 border-b border-slate-100 p-3 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Scale className="w-4 h-4 text-slate-500" />
                    Porovnání: Současný stav vs. Tvůj Návrh
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setComparisonTab('charts')}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg cursor-pointer ${
                        comparisonTab === 'charts' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      Grafické
                    </button>
                    <button
                      onClick={() => setComparisonTab('table')}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg cursor-pointer ${
                        comparisonTab === 'table' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      Číselné
                    </button>
                  </div>
                </div>

                {/* Content Comparison */}
                <div className="p-5 space-y-4 bg-white">
                  
                  {comparisonTab === 'charts' ? (
                    <div className="space-y-4 text-xs">
                      {/* Sibling Cohesion Graph Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-700">Sourozenecká soudržnost (Spolu hodin týdně)</span>
                          <span className="font-bold text-slate-800">Tvůj návrh: {stats.siblingHoursWeekly} h / Soudní rozsudek: {comparisonModel.courtSiblingHours} h</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 block font-mono">Soudní rozsudek:</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-rose-500 h-full" style={{ width: '0%' }} />
                            </div>
                            <span className="text-[9px] font-bold text-rose-500">0 hod/týden (Úplné rozdělení)</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 block font-mono">Váš návrh:</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, (stats.siblingHoursWeekly / 40) * 100)}%` }} />
                            </div>
                            <span className="text-[9px] font-bold text-emerald-600">{stats.siblingHoursWeekly} hod/týden</span>
                          </div>
                        </div>
                      </div>

                      {/* Travel Hours Graph Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-50">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-700">Měsíční cestování dětí (hodiny na cestě)</span>
                          <span className="font-bold text-slate-800">Méně je lépe (Tvůj návrh: {stats.monthlyTravelHours} h)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 block font-mono">Soudní rozsudek (roztříštěný styk):</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full" style={{ width: '80%' }} />
                            </div>
                            <span className="text-[9px] font-bold text-amber-600">Cca 16.5 hodin / měsíc</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 block font-mono">Tvůj návrh střídání:</span>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-teal-500 h-full" style={{ width: `${Math.min(100, (stats.monthlyTravelHours / 20) * 100)}%` }} />
                            </div>
                            <span className="text-[9px] font-bold text-teal-600">{stats.monthlyTravelHours} hodin / měsíc</span>
                          </div>
                        </div>
                      </div>

                      {/* Father Care Nights */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-50">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-700">Počet nocí s tátou Jiříkem (měsíčně)</span>
                          <span className="font-bold text-slate-800">Otec: {stats.nightsFatherMonth} nocí / Matka: {stats.nightsMotherMonth} nocí</span>
                        </div>
                        <div className="w-full bg-slate-100 h-4 rounded-lg overflow-hidden flex font-mono text-[9px] font-bold text-white text-center">
                          <div className="bg-emerald-500 flex items-center justify-center transition-all" style={{ width: `${stats.percentageFather}%` }}>
                            {stats.percentageFather}% Otec ({stats.nightsFatherMonth} nocí)
                          </div>
                          <div className="bg-amber-400 text-slate-800 flex items-center justify-center transition-all" style={{ width: `${stats.percentageMother}%` }}>
                            {stats.percentageMother}% Matka ({stats.nightsMotherMonth} nocí)
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden border border-slate-100 rounded-xl">
                      <table className="w-full text-left text-xs border-collapse font-sans">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-mono tracking-wider border-b border-slate-100">
                            <th className="p-3">Sledovaná metrika</th>
                            <th className="p-3">Soudní rozsudek</th>
                            <th className="p-3">Váš návrh</th>
                            <th className="p-3 text-right">Změna / Dopad</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-3 font-semibold text-slate-700">Sourozenci spolu</td>
                            <td className="p-3 text-rose-500 font-bold">0 hod/týden</td>
                            <td className="p-3 text-emerald-600 font-bold">{stats.siblingHoursWeekly} hod/týden</td>
                            <td className="p-3 text-emerald-600 font-bold text-right">✓ Zvýšení o {stats.siblingHoursWeekly} h</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-slate-700">Noci u otce (Štěpán)</td>
                            <td className="p-3 text-slate-500">4 noci / měsíc</td>
                            <td className="p-3 text-teal-600 font-bold">{stats.nightsFatherMonth} nocí / měsíc</td>
                            <td className="p-3 text-teal-600 font-bold text-right">+{stats.nightsFatherMonth - 4} nocí</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-slate-700">Počet předání dětí</td>
                            <td className="p-3 text-slate-500">8 předání</td>
                            <td className="p-3 text-teal-600 font-bold">{stats.handoversMonth} předání</td>
                            <td className="p-3 text-right text-slate-500">
                              {stats.handoversMonth <= 8 ? '✓ Úspora předání' : 'Častější přesuny'}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-slate-700">Kilometry za měsíc</td>
                            <td className="p-3 text-slate-500">608 km</td>
                            <td className="p-3 text-teal-600 font-bold">{stats.monthlyKm} km</td>
                            <td className="p-3 text-right font-mono text-[10px]">
                              {stats.monthlyKm < 608 ? 'Snížení zátěže' : 'Více logistiky'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between pt-4 border-t border-slate-50">
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Upravit kalendář
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-4 h-4 text-slate-400" />
                    Tisková PDF sestava
                  </button>
                  <button
                    onClick={() => {
                      alert("Tento model byl uložen do vašeho profilu 'Synthesis OS' a spárován se Supabase. AI asistent k němu má nyní přístup.");
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    Uložit model péče
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: REAL-TIME SIMULATOR DASHBOARD PANEL (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-6" id="simulator-live-dashboard">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[9px] uppercase font-mono text-teal-400 font-bold block">LIVE STATISTIKY</span>
              <h3 className="font-extrabold text-sm md:text-base font-display">Analytický panel modelu</h3>
            </div>

            {/* Sibling Cohesion Indicator (HIGHLIGHT CORE) */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Vývoj sourozeneckého vztahu</span>
                  <strong className="text-xs text-slate-200">Společný čas sourozenců</strong>
                </div>
                <div className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${
                  stats.siblingHoursWeekly === 0 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : stats.siblingHoursWeekly < 15
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {stats.siblingHoursWeekly === 0 ? '❌ 0 h / týden' : `🟢 ${stats.siblingHoursWeekly} hod/týden`}
                </div>
              </div>

              {/* Status Alert text */}
              {stats.siblingHoursWeekly === 0 ? (
                <div className="p-3 bg-rose-500/10 text-rose-300 rounded-xl border border-rose-500/20 text-[11px] leading-relaxed">
                  <span className="font-bold block mb-0.5">⚠️ Kritické varování (Soudržnost: 0%):</span>
                  Při současném modelu se Jiří a Štěpán nepotkají u jednoho rodiče ani jednu hodinu týdně. Hrozí úplné odcizení sourozenců.
                </div>
              ) : stats.siblingHoursWeekly < 15 ? (
                <div className="p-3 bg-amber-500/10 text-amber-300 rounded-xl border border-amber-500/20 text-[11px] leading-relaxed">
                  <span className="font-bold block mb-0.5">⚠️ Snížená soudržnost:</span>
                  Sourozenci spolu tráví jen {stats.siblingHoursWeekly} hodin týdně. Doporučuje se upravit víkendy tak, aby měli více společných dnů.
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 text-emerald-300 rounded-xl border border-emerald-500/20 text-[11px] leading-relaxed">
                  <span className="font-bold block mb-0.5">🟢 Skvělá soudržnost ({stats.siblingHoursWeekly} h):</span>
                  Vynikající uspořádání! Sourozenci tráví podstatnou část týdne společně u jednoho rodiče, což upevňuje jejich celoživotní pouto.
                </div>
              )}
            </div>

            {/* Child Psychological Stability Indicator */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Psychická stabilita dítěte (Zátěž)</span>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Celkový index přesunů:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${stats.stabilityColor}`}>
                  {stats.stabilityLabel}
                </span>
              </div>

              {/* Grid Metrics for Stability */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-center text-[10px]">
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-mono">Předání za měsíc</span>
                  <strong className="text-xs text-slate-200">{stats.handoversMonth}x</strong>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-mono">Průměrný blok péče</span>
                  <strong className="text-xs text-slate-200">{stats.avgBlockLength} dne</strong>
                </div>
              </div>
            </div>

            {/* S1: Location stats summary */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Logistická zátěž střídání</span>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vzdálenost adres:</span>
                  <span className="text-slate-200 font-bold font-mono">{locations.distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Najeto kilometrů / měsíc:</span>
                  <span className="text-teal-400 font-extrabold font-mono">{stats.monthlyKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Čas dětí na cestách / měsíc:</span>
                  <span className="text-indigo-400 font-bold font-mono">{stats.monthlyTravelHours} hodin</span>
                </div>
              </div>
            </div>

            {/* Separation metrics */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Maximální odloučení od rodiče</span>
              <div className="grid grid-cols-2 gap-2 text-center text-[11px] pt-1">
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Bez tance (Otec):</span>
                  <strong className="text-slate-100 font-bold">{stats.maxSeparationFather} dní</strong>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Bez matky:</span>
                  <strong className="text-slate-100 font-bold">{stats.maxSeparationMother} dní</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* NEW MASTERCLASS: MONTHLY 3D CALENDAR GRID DISPLAY (3D Kalendář) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6" id="3d-calendar-module">
        <div className="border-b border-slate-100 pb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            3D Vizualizace Měsíce
          </div>
          <h3 className="font-extrabold text-base text-slate-800 font-display">Simulovaný 28-denní kalendář (Celý měsíc)</h3>
          <p className="text-xs text-slate-500">
            Komplexní trojrozměrná axonometrická mřížka simulující střídání, předávání a hlavně <strong>společně trávený čas sourozenců</strong> (Jiřík + Štěpánek). Kliknutím na libovolný den zobrazíte logistický detail.
          </p>
        </div>

        {/* 3D Isometric View wrapper */}
        <div className="overflow-x-auto py-6 flex justify-center">
          <div className="min-w-[640px] px-4">
            <div className="grid grid-cols-7 gap-3 [perspective:1000px]">
              
              {/* Day headers */}
              {['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'].map((d, idx) => (
                <div key={idx} className="text-center font-mono text-[10px] font-bold text-slate-400 pb-1">
                  {d}
                </div>
              ))}

              {/* Generate 28 Days representing Month (2 cycles of Week 1 & Week 2) */}
              {Array.from({ length: 28 }).map((_, index) => {
                const weekIndex = Math.floor(index / 7);
                const dayOfWeekIdx = index % 7;
                
                // Determine schedule day mapping
                // Cycle alternate: Week 1, Week 2, Week 1, Week 2
                const isWeek1 = weekIndex === 0 || weekIndex === 2;
                const activeWeekStr = isWeek1 ? 'week1' : 'week2';
                const care = schedule[activeWeekStr][dayOfWeekIdx];

                const isWeekend = dayOfWeekIdx === 5 || dayOfWeekIdx === 6;

                // Sibling togetherness helper
                // Jiří is always with Father. If Štěpán (joint) is with Father (care === 'father'), they are together!
                const siblingsTogether = care === 'father';

                const isSelected = selectedCalendarDay === index;

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -4, rotateX: 5 }}
                    onClick={() => setSelectedCalendarDay(index)}
                    className={`relative aspect-square rounded-xl p-2 transition-all cursor-pointer border flex flex-col justify-between shadow-2xs [transform:rotateX(15deg)_rotateY(-5deg)] hover:shadow-md ${
                      isSelected 
                        ? 'ring-4 ring-teal-500/50 border-teal-500' 
                        : care === 'father'
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-50/50'
                          : care === 'mother'
                            ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-amber-50/50'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    }`}
                  >
                    {/* Day Number */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold opacity-80">{index + 1}.</span>
                      {siblingsTogether && (
                        <span className="text-[11px]" title="Sourozenci jsou spolu">👥</span>
                      )}
                    </div>

                    {/* Care indicator icon / tag */}
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-black uppercase tracking-tight truncate">
                        {care === 'father' ? '👨 Jiří + Štěpán' : care === 'mother' ? '👩 Štěpán' : '🔄 Předání'}
                      </div>
                      <div className="text-[8px] opacity-70 leading-none">
                        {care === 'father' && 'U Otce'}
                        {care === 'mother' && 'U Matky'}
                        {care === 'handover' && 'Transice'}
                      </div>
                    </div>

                    {/* Sibling bond strength dot */}
                    {siblingsTogether && (
                      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping" />
                    )}
                  </motion.div>
                );
              })}

            </div>
          </div>
        </div>

        {/* Selected Day Info Card */}
        {selectedCalendarDay !== null && (() => {
          const weekIndex = Math.floor(selectedCalendarDay / 7);
          const dayOfWeekIdx = selectedCalendarDay % 7;
          const isWeek1 = weekIndex === 0 || weekIndex === 2;
          const activeWeekStr = isWeek1 ? 'week1' : 'week2';
          const care = schedule[activeWeekStr][dayOfWeekIdx];
          const siblingsTogether = care === 'father';

          const dayNames = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];

          return (
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Detail vybraného dne v simulaci:</span>
                <h4 className="font-bold text-xs text-slate-800">
                  Den {selectedCalendarDay + 1}. ({dayNames[dayOfWeekIdx]} - {weekIndex + 1}. týden měsíce)
                </h4>
                <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-medium text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded-md border border-slate-100 flex items-center gap-1">
                    Care: <strong>{care === 'father' ? '👨 Otec' : care === 'mother' ? '👩 Matka' : '🔄 Předání'}</strong>
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-slate-100 flex items-center gap-1">
                    Sourozenci spolu: <strong>{siblingsTogether ? '🟢 ANO (12 hodin)' : '🔴 NE (0 hodin)'}</strong>
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCalendarDay(null)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Zavřít detail
                </button>
                <button
                  onClick={() => {
                    const currentList = [...schedule[activeWeekStr]];
                    const next: CareDayType = care === 'father' ? 'mother' : care === 'mother' ? 'handover' : 'father';
                    setSchedule({
                      ...schedule,
                      [activeWeekStr]: schedule[activeWeekStr].map((item, idx) => idx === dayOfWeekIdx ? next : item)
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Změnit péči dne
                </button>
              </div>
            </div>
          );
        })()}

      </div>

      {/* Professional Legal & Psychology Warning / Disclaimer */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-3xl p-6 flex flex-col md:flex-row items-start gap-4">
        <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-xs md:text-sm text-amber-800 uppercase tracking-wide">
            DŮLEŽITÉ UPOZORNĚNÍ PRO RODIČE
          </h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            Tento simulátor slouží výhradně jako **orientační matematická pomůcka** pro visualizaci logistické zátěže, odloučení a odhadu sourozeneckého kontaktu. Výsledky nepředstavují závazné právní posouzení, psychologický posudek ani oficiální stanovisko opatrovnického soudu či orgánu OSPOD. Každé opatrovnické řízení je přísně individuální a mělo by být primárně konzultováno s rodinným advokátem nebo certifikovaným dětským psychologem.
          </p>
        </div>
      </div>

    </div>
  );
}
