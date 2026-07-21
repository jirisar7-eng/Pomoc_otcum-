/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Baby, 
  Heart, 
  ShieldCheck, 
  Scale, 
  Calendar, 
  MapPin, 
  Car, 
  Home, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  Download, 
  Printer, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Sliders, 
  Check, 
  RotateCcw, 
  Info, 
  ChevronRight, 
  GraduationCap, 
  Briefcase,
  Plus,
  Trash2,
  Smile,
  Shield,
  Layers,
  Award
} from 'lucide-react';

// Interfaces for Wizard State
export interface ChildProfile {
  id: string;
  name: string;
  birthYear: number;
  gender: 'boy' | 'girl' | 'unspecified';
  developmentStage: 'infant' | 'toddler' | 'preschool' | 'young_pupil' | 'adolescent';
  relation: 'joint' | 'father_only' | 'mother_only';
  schoolOrKindergarten: string;
  specialNeeds: string;
}

export interface SiblingBondData {
  bondStrength: 'inseparable' | 'strong' | 'moderate' | 'independent';
  dailyRoutinesTogether: string[];
  emotionalSupportLevel: 'high' | 'medium' | 'low';
  separationRiskLevel: 'critical' | 'high' | 'moderate' | 'low';
  customBondNotes: string;
}

export interface LogisticsData {
  distanceKm: number;
  travelTimeMinutes: number;
  transportMethod: 'car' | 'public_transit' | 'walking' | 'combined';
  fatherHousing: {
    hasOwnRoomForChildren: boolean;
    bedsCount: number;
    studyDeskAvailable: boolean;
    workFlexibility: 'high' | 'medium' | 'low';
  };
  motherHousing: {
    hasOwnRoomForChildren: boolean;
    bedsCount: number;
    studyDeskAvailable: boolean;
    workFlexibility: 'high' | 'medium' | 'low';
  };
  handoverPreference: 'school_neutral' | 'father_home' | 'mother_home' | 'public_hub';
}

export interface ScheduleSimulatorData {
  selectedModelId: 'alternate_7_7' | 'alternate_2_2_3' | 'stable_2_2_5_5' | 'extended_weekend_plus';
  siblingSynchronization: 'full_together' | 'staggered_partial' | 'separate_trial';
  handoverDay: 'monday_school' | 'friday_afternoon' | 'sunday_evening';
}

export interface CareSimulatorWizardState {
  children: ChildProfile[];
  siblingBond: SiblingBondData;
  logistics: LogisticsData;
  schedule: ScheduleSimulatorData;
  fatherName: string;
  motherName: string;
}

const DEFAULT_INITIAL_STATE: CareSimulatorWizardState = {
  fatherName: 'Otec',
  motherName: 'Matka',
  children: [
    {
      id: 'child_1',
      name: 'Jakub',
      birthYear: 2018,
      gender: 'boy',
      developmentStage: 'young_pupil',
      relation: 'joint',
      schoolOrKindergarten: 'ZŠ T.G. Masaryka',
      specialNeeds: 'Žádné specifické poruchy'
    },
    {
      id: 'child_2',
      name: 'Ema',
      birthYear: 2021,
      gender: 'girl',
      developmentStage: 'preschool',
      relation: 'joint',
      schoolOrKindergarten: 'MŠ Sluníčko',
      specialNeeds: 'Výrazná emoční vazba na bratra'
    }
  ],
  siblingBond: {
    bondStrength: 'inseparable',
    dailyRoutinesTogether: [
      'sleeping_same_room',
      'school_commute',
      'playtime_evening',
      'mutual_emotional_support'
    ],
    emotionalSupportLevel: 'high',
    separationRiskLevel: 'critical',
    customBondNotes: 'Sourozenci jsou na sebe silně fixovaní. Mladší sestra přebírá pocit bezpečí od staršího bratra.'
  },
  logistics: {
    distanceKm: 8,
    travelTimeMinutes: 15,
    transportMethod: 'car',
    fatherHousing: {
      hasOwnRoomForChildren: true,
      bedsCount: 2,
      studyDeskAvailable: true,
      workFlexibility: 'high'
    },
    motherHousing: {
      hasOwnRoomForChildren: true,
      bedsCount: 2,
      studyDeskAvailable: true,
      workFlexibility: 'medium'
    },
    handoverPreference: 'school_neutral'
  },
  schedule: {
    selectedModelId: 'alternate_7_7',
    siblingSynchronization: 'full_together',
    handoverDay: 'monday_school'
  }
};

export default function CareSimulatorWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [state, setState] = useState<CareSimulatorWizardState>(DEFAULT_INITIAL_STATE);
  const [copySuccess, setCopySuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Helper to update state parts
  const updateChildren = (children: ChildProfile[]) => {
    setState(prev => ({ ...prev, children }));
    setValidationError(null);
  };

  const updateSiblingBond = (bond: Partial<SiblingBondData>) => {
    setState(prev => ({ ...prev, siblingBond: { ...prev.siblingBond, ...bond } }));
    setValidationError(null);
  };

  const updateLogistics = (logistics: Partial<LogisticsData>) => {
    setState(prev => ({ ...prev, logistics: { ...prev.logistics, ...logistics } }));
    setValidationError(null);
  };

  const updateSchedule = (schedule: Partial<ScheduleSimulatorData>) => {
    setState(prev => ({ ...prev, schedule: { ...prev.schedule, ...schedule } }));
    setValidationError(null);
  };

  // Step Validation guards
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!state.children || state.children.length === 0) {
        setValidationError('Zadejte prosím alespoň jedno dítě.');
        return false;
      }
      for (const c of state.children) {
        if (!c.name.trim()) {
          setValidationError('Každé dítě musí mít vyplněné jméno.');
          return false;
        }
      }
    } else if (step === 2) {
      if (!state.siblingBond.bondStrength) {
        setValidationError('Vyberte prosím intenzitu sourozenecké vazby.');
        return false;
      }
    } else if (step === 3) {
      if (state.logistics.distanceKm < 0) {
        setValidationError('Vzdálenost nemůže být záporná.');
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper calculation for developmental stage based on birth year
  const getStageFromYear = (year: number): ChildProfile['developmentStage'] => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    if (age <= 3) return 'toddler';
    if (age <= 6) return 'preschool';
    if (age <= 12) return 'young_pupil';
    return 'adolescent';
  };

  const getStageLabel = (stage: ChildProfile['developmentStage']): string => {
    switch (stage) {
      case 'infant': return 'Kojenec (0–1 rok)';
      case 'toddler': return 'Batole (1–3 roky)';
      case 'preschool': return 'Předškolák (3–6 let)';
      case 'young_pupil': return 'Mladší školák (6–12 let)';
      case 'adolescent': return 'Dospívající (12–18 let)';
      default: return 'Školní věk';
    }
  };

  // Step Titles Definition
  const stepsList = [
    { num: 1, title: 'Profily dětí', icon: Baby, desc: 'Jména, věk a potřeby' },
    { num: 2, title: 'Sourozenecká vazba', icon: Heart, desc: 'Emoční spjatost & rituály' },
    { num: 3, title: 'Logistika & Kapacita', icon: MapPin, desc: 'Bydlení, doprava, zázemí' },
    { num: 4, title: 'Simulace péče', icon: Calendar, desc: 'Harmonogram střídání' },
    { num: 5, title: 'Právní argumentace', icon: Scale, desc: 'Výstup pro Soud / OSPOD' }
  ];

  // Text Generator for Final Court/OSPOD Submission
  const generateRequirementText = (): string => {
    const currentYear = new Date().getFullYear();
    const childrenStr = state.children.map(c => `${c.name} (nar. ${c.birthYear}, ${currentYear - c.birthYear} let)`).join(', ');
    
    const modelLabels: Record<string, string> = {
      alternate_7_7: 'Střídavá péče v cyklu 7 dnů / 7 dnů (Týden/Týden)',
      alternate_2_2_3: 'Střídavá péče v kratším cyklu 2-2-3 (vhodné pro mladší děti)',
      stable_2_2_5_5: 'Střídavá péče v cyklu 2-2-5-5 se stabilními všedními dny',
      extended_weekend_plus: 'Rozšířená péče s prodlouženým víkendem a všedními dny'
    };

    const bondLabels: Record<string, string> = {
      inseparable: 'mimořádně intenzivní a nerozlučná',
      strong: 'velmi silná s vysokou mírou vzájemné opory',
      moderate: 'stabilní se standardní sourozeneckou dynamikou',
      independent: 'specifická s ohledem na odlišné věkové potřeby'
    };

    return `NÁVRH / ARGUMENTAČNÍ PODKLAD PRO OSPOD A SOUD
Materiál vytvořený nástrojem Simulátor Péče & Sourozenecké Soudržnosti

I. ÚČASTNÍCI A DOTČENÉ NEZLETILÉ DĚTI
Dotčené nezletilé děti: ${childrenStr}
Matka: ${state.motherName}
Otec: ${state.fatherName}

II. POSOUZENÍ SOUROZENECKÉ VAZBY A NEJLEPŠÍHO ZÁJMU DÍTĚTE
1. Sourozenecká vazba mezi nezletilými dětmi byla vyhodnocena jako ${bondLabels[state.siblingBond.bondStrength] || 'silná'}.
2. Děti sdílejí klíčové denní rituály a vzájemně si poskytují pocit emoční jistoty a bezpečí.
3. Poznámka k psychologickým potřebám: ${state.siblingBond.customBondNotes || 'Není udána.'}

Právní rámec a judikatura Ústavního soudu ČR:
- Články 8 a 9 Úmluvy o právech dítěte stanovují povinnost státu chránit rodinné vazby dětí.
- Dle ustálené judikatury Ústavního soudu ČR (např. nález sp. zn. I. ÚS 2482/13 ze dne 26. 5. 2014 nebo sp. zn. III. ÚS 1206/09) je oddělení sourozenců přípustné pouze zcela výjimečně, existují-li pro to mimořádně závažné důvody.
- Zachování sourozenecké soudržnosti bez rozdělování dětí mezi rodiče je primárním zájmem nezletilých dětí.

III. LOGISTICKÉ POSOUZENÍ A KAPACITA DOMÁCNOSTÍ
1. Vzdálenost mezi bydlišti rodičů činí přibližně ${state.logistics.distanceKm} km (odhadovaná doba dojezdu ${state.logistics.travelTimeMinutes} minut).
2. Způsob dopravy: ${state.logistics.transportMethod === 'car' ? 'Osobní automobil' : state.logistics.transportMethod === 'public_transit' ? 'Městská/příměstská doprava' : 'Pěší / Vzdálenost v místě'}.
3. Podmínky v domácnosti Otce: ${state.logistics.fatherHousing.hasOwnRoomForChildren ? 'Samostatný dětský pokoj k dispozici' : 'Sdílený prostor'}, počet lůžek: ${state.logistics.fatherHousing.bedsCount}, studijní místo: ${state.logistics.fatherHousing.studyDeskAvailable ? 'Ano' : 'Ne'}.
4. Podmínky v domácnosti Matky: ${state.logistics.motherHousing.hasOwnRoomForChildren ? 'Samostatný dětský pokoj k dispozici' : 'Sdílený prostor'}, počet lůžek: ${state.logistics.motherHousing.bedsCount}, studijní místo: ${state.logistics.motherHousing.studyDeskAvailable ? 'Ano' : 'Ne'}.
5. Místo předávání dětí: ${state.logistics.handoverPreference === 'school_neutral' ? 'Školní zařízení / MŠ v pondělí ráno (minimální stres pro děti)' : 'Bydliště rodičů / Neutrální místo'}.

IV. NAVRHOVANÝ HARMONOGRAM PÉČE
Navrhovaný model: ${modelLabels[state.schedule.selectedModelId] || 'Střídavá péče'}
Zachování sourozenecké synchronizace: ${state.schedule.siblingSynchronization === 'full_together' ? '100% Společný pobyt dětí u obou rodičů bez rozdělování' : 'Částečně upravený harmonogram'}.

V. ZÁVĚREČNÝ NÁVRH (PETIT)
S ohledem na výše uvedené skutečnosti se doporučuje OSPODu a navrhuje Příslušnému soudu:
Svěřit nezletilé děti ${childrenStr} do střídavé péče obou rodičů podle navrhovaného harmonogramu tak, aby byla plně zachována jejich sourozenecká spjatost a přirozený vývoj.

Datum vyhotovení: ${new Date().toLocaleDateString('cs-CZ')}
Vygenerováno v aplikaci Táta má právo – Centrum péče & judikatury`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateRequirementText());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadFile = () => {
    const text = generateRequirementText();
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Podklad_Soud_OSPOD_Sourozenci_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-8 animate-fadeIn" id="care-simulator-wizard-root">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden border border-slate-800 shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-10 -translate-y-10 translate-x-10 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" /> Interaktivní Průvodce (5 kroků)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white">
              Simulátor Péče & Sourozenecké Soudržnosti
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Odborný poradce pro posouzení sourozenecké vazby, logistiky a harmonogramu péče dle judikatury Ústavního soudu ČR.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Chcete restartovat simulátor a začít znovu?')) {
                setState(DEFAULT_INITIAL_STATE);
                setCurrentStep(1);
              }
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetovat simulaci</span>
          </button>
        </div>
      </div>

      {/* STEPPER NAVIGATION INDICATOR */}
      <div className="space-y-2" id="care-wizard-stepper">
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {stepsList.map((step) => {
            const Icon = step.icon;
            const isDone = currentStep > step.num;
            const isActive = currentStep === step.num;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => {
                  if (step.num < currentStep) {
                    setCurrentStep(step.num);
                  } else if (step.num > currentStep) {
                    if (validateStep(currentStep)) {
                      setCurrentStep(step.num);
                    }
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-full relative overflow-hidden ${
                  isActive
                    ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                    : isDone
                    ? 'bg-slate-50 border-emerald-300 text-emerald-900 hover:bg-emerald-50/40'
                    : 'bg-slate-50/60 border-slate-200/80 text-slate-400 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isActive ? 'bg-teal-600 text-white' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isDone ? <Check className="w-4 h-4 font-black" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>

                  <span className={`text-[10px] font-mono font-bold ${
                    isActive ? 'text-teal-700' : isDone ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    Krok {step.num}/5
                  </span>
                </div>

                <div>
                  <h4 className={`text-xs font-bold leading-snug line-clamp-1 ${
                    isActive ? 'text-slate-900 font-display' : isDone ? 'text-slate-800' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 hidden md:block mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-teal-600 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* VALIDATION ERROR BANNER */}
      {validationError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs font-bold flex items-center gap-3 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP CONTENT CONTAINER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >

          {/* ================= STEP 1: PROFILY DĚTÍ A VĚK ================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                  <Baby className="w-5 h-5 text-teal-600" />
                  Krok 1: Profily dětí, věk a vývojové fáze
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Přidejte všechny děti v rodině. Na základě roku narození systém automaticky vyhodnotí vývojovou fázi a potřeby dítěte.
                </p>
              </div>

              {/* Children List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.children.map((child, idx) => {
                  const stage = getStageFromYear(child.birthYear);
                  return (
                    <div key={child.id} className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-4 hover:border-teal-300 transition-all shadow-3xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                            #{idx + 1}
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Profil dítěte</span>
                            <strong className="text-sm font-bold text-slate-900">{child.name || 'Nepojmenované dítě'}</strong>
                          </div>
                        </div>

                        {state.children.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = state.children.filter(c => c.id !== child.id);
                              updateChildren(updated);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Odebrat dítě"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Jméno dítěte</label>
                          <input
                            type="text"
                            value={child.name}
                            onChange={(e) => {
                              const updated = state.children.map(c => c.id === child.id ? { ...c, name: e.target.value } : c);
                              updateChildren(updated);
                            }}
                            placeholder="Např. Jakub"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Rok narození</label>
                          <input
                            type="number"
                            min={2008}
                            max={new Date().getFullYear()}
                            value={child.birthYear}
                            onChange={(e) => {
                              const year = parseInt(e.target.value) || new Date().getFullYear();
                              const updated = state.children.map(c => c.id === child.id ? { 
                                ...c, 
                                birthYear: year,
                                developmentStage: getStageFromYear(year)
                              } : c);
                              updateChildren(updated);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-teal-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* Stage Badge & Relation */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/60">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 text-[11px] font-medium">Vývojová fáze:</span>
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-[10px] font-bold">
                            {getStageLabel(child.developmentStage)}
                          </span>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Právní vztah k rodičům</label>
                          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = state.children.map(c => c.id === child.id ? { ...c, relation: 'joint' as const } : c);
                                updateChildren(updated);
                              }}
                              className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                                child.relation === 'joint' ? 'bg-teal-600 text-white border-teal-600 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              Společné
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = state.children.map(c => c.id === child.id ? { ...c, relation: 'father_only' as const } : c);
                                updateChildren(updated);
                              }}
                              className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                                child.relation === 'father_only' ? 'bg-teal-600 text-white border-teal-600 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              Jen Otce
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = state.children.map(c => c.id === child.id ? { ...c, relation: 'mother_only' as const } : c);
                                updateChildren(updated);
                              }}
                              className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                                child.relation === 'mother_only' ? 'bg-teal-600 text-white border-teal-600 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              Jen Matky
                            </button>
                          </div>
                        </div>

                        {/* School / Kindergarten Input */}
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Škola / MŠ / Kroužky</label>
                          <input
                            type="text"
                            value={child.schoolOrKindergarten}
                            onChange={(e) => {
                              const updated = state.children.map(c => c.id === child.id ? { ...c, schoolOrKindergarten: e.target.value } : c);
                              updateChildren(updated);
                            }}
                            placeholder="Např. ZŠ Křídlovická, MŠ Sluníčko"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Child Button */}
              <button
                type="button"
                onClick={() => {
                  const newChild: ChildProfile = {
                    id: `child_${Date.now()}`,
                    name: `Dítě ${state.children.length + 1}`,
                    birthYear: 2020,
                    gender: 'unspecified',
                    developmentStage: 'preschool',
                    relation: 'joint',
                    schoolOrKindergarten: '',
                    specialNeeds: ''
                  };
                  updateChildren([...state.children, newChild]);
                }}
                className="w-full py-3.5 border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50 text-teal-800 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-teal-600" />
                <span>Přidat další dítě do simulátoru</span>
              </button>
            </div>
          )}

          {/* ================= STEP 2: POSOUZENÍ SOUROZENECKÉ VAZBY ================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  Krok 2: Posouzení sourozenecké vazby a emoční spjatosti
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ústavní soud ČR (např. sp. zn. I. ÚS 2482/13) zdůrazňuje, že sourozenci nemají být rozdělováni bez mimořádně závažných důvodů.
                </p>
              </div>

              {/* Bond Strength Selector Cards */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 block">Intenzita sourozenecké vazby</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'inseparable',
                      title: 'Nerozlučná vazba (Doporučeno nerozdělovat)',
                      desc: 'Děti tráví veškerý čas spolu, usínají v jednom pokoji, navzájem se psychicky podporují.',
                      badge: 'Kritická souhra'
                    },
                    {
                      id: 'strong',
                      title: 'Silná vazba',
                      desc: 'Společné zájmy a hračky, vzájemná opora při změnách prostředí a stresových situacích.',
                      badge: 'Vysoká opora'
                    },
                    {
                      id: 'moderate',
                      title: 'Střední vazba',
                      desc: 'Běžný sourozenecký vztah se střídáním hry a drobných konfliktů, vyžaduje přirozený kontakt.',
                      badge: 'Standardní'
                    },
                    {
                      id: 'independent',
                      title: 'Specifická / Nezávislá',
                      desc: 'Výrazný věkový odstup (10+ let) nebo odlišné potřeby vyžadující částečně individuální režim.',
                      badge: 'Individuální'
                    }
                  ].map((item) => {
                    const isSelected = state.siblingBond.bondStrength === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => updateSiblingBond({ bondStrength: item.id as any })}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-400/20 shadow-xs' : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <strong className="text-xs font-bold text-slate-900">{item.title}</strong>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shared Daily Routines Toggle Buttons */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block">
                  Sdílené denní rituály & Společné aktivity (vyberte všechny platné)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[
                    { id: 'sleeping_same_room', label: 'Sdílení jednoho dětského pokoje / večerní usínání spolu' },
                    { id: 'school_commute', label: 'Společná cesta do školy / školky / kroužků' },
                    { id: 'playtime_evening', label: 'Společné hry a večeře v podvečerních hodinách' },
                    { id: 'mutual_emotional_support', label: 'Starší sourozenci pomáhá mladšímu s přípravou či uklidněním' },
                    { id: 'weekend_activities', label: 'Společné víkendové výlety a sportovní zájmy' }
                  ].map((routine) => {
                    const isChecked = state.siblingBond.dailyRoutinesTogether.includes(routine.id);
                    return (
                      <button
                        key={routine.id}
                        type="button"
                        onClick={() => {
                          const current = state.siblingBond.dailyRoutinesTogether;
                          const next = isChecked ? current.filter(r => r !== routine.id) : [...current, routine.id];
                          updateSiblingBond({ dailyRoutinesTogether: next });
                        }}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isChecked ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-3xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{routine.label}</span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 font-bold" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Bond Notes */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block">
                  Slovní popis sourozenecké vazby pro OSPOD / Soud
                </label>
                <textarea
                  rows={3}
                  value={state.siblingBond.customBondNotes}
                  onChange={(e) => updateSiblingBond({ customBondNotes: e.target.value })}
                  placeholder="Uveďte konkrétní příklady vzájemné vazby dětí..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs leading-relaxed focus:outline-hidden focus:border-teal-500"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 3: LOGISTIKA A KAPACITA DOMÁCNOSTI ================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Krok 3: Logistika, vzdálenost a kapacita domácností
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Posouzení vzdálenosti mezi rodiči, dopravní dostupnosti a materiálního zázemí pro všechny děti.
                </p>
              </div>

              {/* Distance and Travel Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Vzdálenost mezi bydlišti rodičů (km)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      max={300}
                      value={state.logistics.distanceKm}
                      onChange={(e) => updateLogistics({ distanceKm: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-hidden focus:border-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-600">km</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Odhadovaná doba dojezdu (minuty)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      max={240}
                      value={state.logistics.travelTimeMinutes}
                      onChange={(e) => updateLogistics({ travelTimeMinutes: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-hidden focus:border-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-600">minut</span>
                  </div>
                </div>
              </div>

              {/* Transport Method */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 block">Způsob přepravy dětí</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {[
                    { id: 'car', label: 'Osobní auto', icon: Car },
                    { id: 'public_transit', label: 'MHD / Vlak', icon: MapPin },
                    { id: 'walking', label: 'Pěšky v místě', icon: Home },
                    { id: 'combined', label: 'Kombinovaný', icon: Sliders }
                  ].map((t) => {
                    const isSelected = state.logistics.transportMethod === t.id;
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateLogistics({ transportMethod: t.id as any })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Housing Capacities (Father vs Mother) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Father Housing Card */}
                <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                  <strong className="text-xs font-bold text-slate-900 block font-display">
                    🏠 Kapacita v bydlišti Otce
                  </strong>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.logistics.fatherHousing.hasOwnRoomForChildren}
                      onChange={(e) => updateLogistics({
                        fatherHousing: { ...state.logistics.fatherHousing, hasOwnRoomForChildren: e.target.checked }
                      })}
                      className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>Samostatný dětský pokoj pro děti</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.logistics.fatherHousing.studyDeskAvailable}
                      onChange={(e) => updateLogistics({
                        fatherHousing: { ...state.logistics.fatherHousing, studyDeskAvailable: e.target.checked }
                      })}
                      className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>Samostatný studijní stůl pro školáka</span>
                  </label>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Počet lůžek pro děti</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={state.logistics.fatherHousing.bedsCount}
                      onChange={(e) => updateLogistics({
                        fatherHousing: { ...state.logistics.fatherHousing, bedsCount: parseInt(e.target.value) || 1 }
                      })}
                      className="w-20 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono"
                    />
                  </div>
                </div>

                {/* Mother Housing Card */}
                <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                  <strong className="text-xs font-bold text-slate-900 block font-display">
                    🏠 Kapacita v bydlišti Matky
                  </strong>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.logistics.motherHousing.hasOwnRoomForChildren}
                      onChange={(e) => updateLogistics({
                        motherHousing: { ...state.logistics.motherHousing, hasOwnRoomForChildren: e.target.checked }
                      })}
                      className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>Samostatný dětský pokoj pro děti</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.logistics.motherHousing.studyDeskAvailable}
                      onChange={(e) => updateLogistics({
                        motherHousing: { ...state.logistics.motherHousing, studyDeskAvailable: e.target.checked }
                      })}
                      className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>Samostatný studijní stůl pro školáka</span>
                  </label>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Počet lůžek pro děti</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={state.logistics.motherHousing.bedsCount}
                      onChange={(e) => updateLogistics({
                        motherHousing: { ...state.logistics.motherHousing, bedsCount: parseInt(e.target.value) || 1 }
                      })}
                      className="w-20 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono"
                    />
                  </div>
                </div>

              </div>

              {/* Handover Preference */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block">
                  Doporučené místo předávání dětí
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'school_neutral',
                      title: 'Škola / MŠ v pondělí ráno (Doporučeno OSPOD)',
                      desc: 'Otec předá děti do školy v Po ráno, Matka je po škole vyzvedne. Žádný přímý konflikt před dětmi.'
                    },
                    {
                      id: 'father_home',
                      title: 'Bydliště Otce',
                      desc: 'Matka vyzvedává nebo Otec přiváží děti přímo do bydliště otce.'
                    },
                    {
                      id: 'mother_home',
                      title: 'Bydliště Matky',
                      desc: 'Otec vyzvedává nebo Matka přiváží děti přímo do bydliště matky.'
                    },
                    {
                      id: 'public_hub',
                      title: 'Neutrální místo / Zájmový kroužek',
                      desc: 'Předání probíhá na veřejném místě bezprostředně po ukončení odpoledních kroužků.'
                    }
                  ].map((item) => {
                    const isSelected = state.logistics.handoverPreference === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => updateLogistics({ handoverPreference: item.id as any })}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs' : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                        }`}
                      >
                        <strong className="text-xs font-bold text-slate-900 block mb-1">{item.title}</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: SIMULACE HARMONOGRAMU PÉČE ================= */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  Krok 4: Simulace harmonogramu a sourozenecké synchronizace
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Vyberte model střídavé péče a ověřte, zda jsou děti u rodičů vždy společně.
                </p>
              </div>

              {/* Model Choice Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    id: 'alternate_7_7',
                    title: 'Model 7 dnů / 7 dnů (Týden / Týden)',
                    desc: 'Standardní rovnocenná střídavá péče. Nízký počet předávání (2x za měsíc). Vhodné pro školáky.',
                    ratio: '50% / 50%'
                  },
                  {
                    id: 'alternate_2_2_3',
                    title: 'Model 2-2-3 (Častější střídání)',
                    desc: '2 dny Otec, 2 dny Matka, 3 dny víkend. Vhodné pro předškolní děti vyžadující kratší pauzy.',
                    ratio: '50% / 50%'
                  },
                  {
                    id: 'stable_2_2_5_5',
                    title: 'Model 2-2-5-5 (Stabilní všední dny)',
                    desc: 'Po-Út u jednoho rodiče, St-Čt u druhého, víkendy se střídají. Děti mají pevné dny na kroužky.',
                    ratio: '50% / 50%'
                  },
                  {
                    id: 'extended_weekend_plus',
                    title: 'Rozšířený víkend + Čtvrtek',
                    desc: 'Rozšířený režim s vysokou mírou zapojení obou rodičů v týdnu.',
                    ratio: '60% / 40%'
                  }
                ].map((model) => {
                  const isSelected = state.schedule.selectedModelId === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => updateSchedule({ selectedModelId: model.id as any })}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs' : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-xs font-bold text-slate-900">{model.title}</strong>
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-mono font-bold rounded-md">
                          {model.ratio}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{model.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Sibling Synchronization */}
              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <strong className="text-sm font-bold font-display text-white">
                      Sourozenecká synchronizace stay-together
                    </strong>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold">
                    100% Souhra
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Podle doporučení Ústavního soudu ČR má být harmonogram nastaven tak, aby všechny děti ({state.children.map(c => c.name).join(', ')}) přecházely mezi rodiči <strong>vždy současně</strong>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => updateSchedule({ siblingSynchronization: 'full_together' })}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      state.schedule.siblingSynchronization === 'full_together'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    ✓ 100% Plně synchronizovaný režim (Společně)
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSchedule({ siblingSynchronization: 'staggered_partial' })}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      state.schedule.siblingSynchronization === 'staggered_partial'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    ⚠ Částečně odstupňovaný režim
                  </button>
                </div>
              </div>

              {/* Visual 14-Day Calendar Preview */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Názorná simulace 14-denního cyklu
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Děti: {state.children.map(c => c.name).join(', ')}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[11px]">
                  {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(d => (
                    <div key={d} className="font-bold text-slate-500 py-1">{d}</div>
                  ))}

                  {/* 14 Days representation for 7-7 model */}
                  {Array.from({ length: 14 }).map((_, i) => {
                    const isFatherDay = state.schedule.selectedModelId === 'alternate_7_7' 
                      ? i < 7 
                      : (i % 4 < 2);
                    return (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border text-[10px] font-bold transition-all flex flex-col items-center gap-1 ${
                          isFatherDay 
                            ? 'bg-teal-100 text-teal-900 border-teal-300' 
                            : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                        }`}
                      >
                        <span>Den {i + 1}</span>
                        <span className="font-extrabold">{isFatherDay ? 'Otec' : 'Matka'}</span>
                        <span className="text-[8px] opacity-75">Společně</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: FINÁLNÍ VÝSTUP A GENERÁTOR ARGUMENTU ================= */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-teal-600" />
                  Krok 5: Finální výstup a návrh podkladu pro Soud / OSPOD
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kompletní argumentační zpráva vygenerovaná na základě zadaných údajů a judikatury Ústavního soudu ČR.
                </p>
              </div>

              {/* Summary Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-teal-700 block">Sourozenecká soudržnost</span>
                  <strong className="text-lg font-black text-teal-900 font-display">100 %</strong>
                  <span className="text-[10px] text-teal-600 block">Bez rozdělování</span>
                </div>

                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 block">Péče obou rodičů</span>
                  <strong className="text-lg font-black text-indigo-900 font-display">50 / 50 %</strong>
                  <span className="text-[10px] text-indigo-600 block">Rovnocenný podíl</span>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 block">Logistické dojíždění</span>
                  <strong className="text-lg font-black text-emerald-900 font-display">{state.logistics.distanceKm} km</strong>
                  <span className="text-[10px] text-emerald-600 block">~{state.logistics.travelTimeMinutes} min dojezd</span>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-700 block">Právní opora</span>
                  <strong className="text-lg font-black text-amber-900 font-display">I. ÚS 2482/13</strong>
                  <span className="text-[10px] text-amber-700 block">Nález ÚS ČR</span>
                </div>
              </div>

              {/* Generated Document Text Box */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase font-mono flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Vygenerovaný návrh pro jednání OSPOD a Soudu
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                        copySuccess 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copySuccess ? 'Text zkopírován!' : 'Kopírovat text'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadFile}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Stáhnout podklad (.txt)</span>
                    </button>
                  </div>
                </div>

                {/* Previews Formatted Document */}
                <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap select-all shadow-inner">
                  {generateRequirementText()}
                </div>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* FOOTER BUTTONS CONTROLLER (BACK / NEXT) */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={handleBack}
          className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-3xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zpět</span>
        </button>

        <div className="flex items-center gap-2">
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Pokračovat na Krok {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCopyText}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>Zkopírovat finální text</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
