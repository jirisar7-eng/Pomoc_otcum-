/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  HelpCircle, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  BookOpen, 
  FileText, 
  Check, 
  ExternalLink, 
  Award, 
  Scale, 
  MessageSquare, 
  Copy, 
  Eye, 
  FileCheck,
  Printer,
  ArrowRightLeft,
  Users,
  RefreshCw,
  Sliders,
  Download,
  AlertCircle,
  Info,
  TrendingUp,
  Plus,
  Trash2,
  Save,
  Cloud,
  Baby,
  GraduationCap,
  Clock,
  MapPin,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { saveDocument } from '../lib/firebase';
import { User } from '../types';
import { TRANSLATED_STUDIES } from '../data/translatedStudies';

interface ScheduleType {
  id: string;
  name: string;
  description: string;
  pattern: ('A' | 'B')[]; // 14 days pattern
  pros: string[];
  cons: string[];
  bestFor: string;
}

const SCHEDULES: ScheduleType[] = [
  {
    id: 'weekly',
    name: 'Týdenní střídání (7 a 7 dnů)',
    description: 'Nejrozšířenější model. Dítě tráví celý týden u jednoho rodiče (např. od pátku do pátku nebo neděle do neděle) a pak se přesune ke druhému.',
    pattern: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
    pros: [
      'Jednoduchá logistika a minimum předávání v týdnu.',
      'Dítě má klid se usadit a prožít celistvý týden (škola, volný čas).',
      'Jasné a přehledné plánování času pro rodiče.'
    ],
    cons: [
      'Celých 7 dnů odloučení od druhého rodiče může být pro menší děti příliš dlouhé.',
      'Rodič, který dítě zrovna nemá, ztrácí kontakt s každodenní realitou školy a kroužků.'
    ],
    bestFor: 'Děti školního věku (cca od 6–7 let) s vyzrálou schopností snášet delší odloučení.'
  },
  {
    id: '2-2-3',
    name: 'Dvou-dvou-třídenní střídání (2-2-3)',
    description: 'Rychlejší střídání. Rodič A má Po-Út, rodič B má St-Čt, rodič A má Pá-Ne. Další týden se role kompletně prohodí.',
    pattern: ['A', 'A', 'B', 'B', 'A', 'A', 'A', 'B', 'B', 'A', 'A', 'B', 'B', 'B'],
    pros: [
      'Dítě není nikdy odloučeno od žádného rodiče déle než 3 dny.',
      'Oba rodiče jsou neustále v kontaktu s týdenním režimem školy/kroužků.',
      'Velmi vřelé zachování vazeb u malých dětí.'
    ],
    cons: [
      'Velmi častá předávání (3x do týdne) vyžadují bezproblémovou komunikaci rodičů a blízké bydlení.',
      'Dítě se neustále balí a přesouvá, což může citlivější děti stresovat.'
    ],
    bestFor: 'Batolata a předškolní děti (cca od 2 do 6 let), které těžko snášejí dlouhé odloučení.'
  },
  {
    id: '4-3-3-4',
    name: 'Čtyř-tří-tří-čtyřdenní střídání (4-3-3-4)',
    description: 'Rodič A má Po-Čt, rodič B má Pá-Ne. Druhý týden má rodič B Po-St a rodič A má Čt-Ne. Režim zajišťuje stálé víkendy a rozumné dny v týdnu.',
    pattern: ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'A', 'A', 'A', 'A'],
    pros: [
      'Dítě má stabilní dny v týdnu (např. začátek týdne je vždy u táty, konec u mámy).',
      'Dobře se plánují pravidelné kroužky a aktivity.',
      'Menší počet přesunů než u 2-2-3 střídání.'
    ],
    cons: [
      'Asymetrie střídání (jeden rodič má každý víkend, druhý má pouze týdenní bloky).'
    ],
    bestFor: 'Děti, které preferují pevný řád a stejné dny u stejného rodiče každý týden.'
  }
];

export default function PeceODiteSection({ currentUser, onOpenAuth }: { currentUser?: User | null; onOpenAuth?: () => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'schedules' | 'studies' | 'methodologies'>('schedules');
  const [selectedStudy, setSelectedStudy] = useState<'fabricius' | 'warshak'>('fabricius');
  const [expandedStudyText, setExpandedStudyText] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Advanced Child Care Regime Simulator State
  const [fatherName, setFatherName] = useState<string>(() => localStorage.getItem('synthesis_care_sim_father') || 'Aktivní otec');
  const [motherName, setMotherName] = useState<string>(() => localStorage.getItem('synthesis_care_sim_mother') || 'Matka');

  interface SimulatedChild {
    id: string;
    name: string;
    pattern: ('A' | 'B')[];
    color: string;
    ageGroup: 'infant' | 'toddler' | 'preschool' | 'school' | 'teen';
    schoolType: 'skola' | 'skolka' | 'doma';
    schoolDistanceDad: number;
    schoolDistanceMom: number;
    schoolTimeDad: number;
    schoolTimeMom: number;
    handoverType: 'school' | 'neutral' | 'father_residence' | 'mother_residence';
    handoverTime: string;
    handoverResponsible: 'both' | 'father' | 'mother';
    hobbiesCount: number;
    healthNotes: string;
    summerWeeksDad: number;
    summerWeeksMom: number;
    christmasEveStyle: 'alternating' | 'father' | 'mother' | 'split';
  }

  const ensureDefaultFields = (child: any): SimulatedChild => {
    return {
      id: child.id,
      name: child.name,
      pattern: child.pattern,
      color: child.color || 'bg-teal-600',
      ageGroup: child.ageGroup || 'school',
      schoolType: child.schoolType || 'skola',
      schoolDistanceDad: child.schoolDistanceDad !== undefined ? child.schoolDistanceDad : 5,
      schoolDistanceMom: child.schoolDistanceMom !== undefined ? child.schoolDistanceMom : 5,
      schoolTimeDad: child.schoolTimeDad !== undefined ? child.schoolTimeDad : 10,
      schoolTimeMom: child.schoolTimeMom !== undefined ? child.schoolTimeMom : 10,
      handoverType: child.handoverType || 'school',
      handoverTime: child.handoverTime || 'Neděle 18:00',
      handoverResponsible: child.handoverResponsible || 'both',
      hobbiesCount: child.hobbiesCount !== undefined ? child.hobbiesCount : 1,
      healthNotes: child.healthNotes || 'Standardní',
      summerWeeksDad: child.summerWeeksDad !== undefined ? child.summerWeeksDad : 4,
      summerWeeksMom: child.summerWeeksMom !== undefined ? child.summerWeeksMom : 4,
      christmasEveStyle: child.christmasEveStyle || 'alternating'
    };
  };

  // Starts with two children (Štěpánek & Jiřík) as default to showcase sibling cohesion
  const [simulatedChildren, setSimulatedChildren] = useState<SimulatedChild[]>(() => {
    const local = localStorage.getItem('synthesis_care_sim_children');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(c => ensureDefaultFields(c));
        }
      } catch (e) {
        console.error("Error parsing stored children state:", e);
      }
    }
    return [
      {
        id: 'child-1',
        name: 'Štěpánek (mladší)',
        pattern: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
        color: 'bg-teal-600',
        ageGroup: 'toddler',
        schoolType: 'skolka',
        schoolDistanceDad: 4,
        schoolDistanceMom: 12,
        schoolTimeDad: 10,
        schoolTimeMom: 25,
        handoverType: 'school',
        handoverTime: 'Pondělí 8:00 přímo do školky',
        handoverResponsible: 'both',
        hobbiesCount: 1,
        healthNotes: 'Bez speciálních potřeb',
        summerWeeksDad: 4,
        summerWeeksMom: 4,
        christmasEveStyle: 'alternating'
      },
      {
        id: 'child-2',
        name: 'Jiřík (starší)',
        pattern: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
        color: 'bg-indigo-600',
        ageGroup: 'school',
        schoolType: 'skola',
        schoolDistanceDad: 5,
        schoolDistanceMom: 15,
        schoolTimeDad: 12,
        schoolTimeMom: 30,
        handoverType: 'school',
        handoverTime: 'Pondělí 8:00 přímo do školy',
        handoverResponsible: 'both',
        hobbiesCount: 2,
        healthNotes: 'Lehká pylová alergie',
        summerWeeksDad: 4,
        summerWeeksMom: 4,
        christmasEveStyle: 'alternating'
      }
    ];
  });

  const [activePreset, setActivePreset] = useState<string>('sync');
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  const daysOfWeek = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  const PRESETS = [
    {
      id: 'sync',
      name: 'Náš návrh: Synchronizovaná střídavka',
      desc: 'Oba sourozenci jsou u táty i u mámy ve stejný čas. Tím je zajištěno 100% sourozenecké soužití a optimální stabilita.',
      stepanek: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      jirik: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      togethernessLabel: '100% spolu',
      stabilityLabel: 'Vynikající (Zelená)'
    },
    {
      id: 'split-ruling',
      name: 'Stávající rozsudek: Rozdělení sourozenci',
      desc: 'Mladší syn má styk jen každý lichý víkend, starší syn má střídavou péči. U táty se potkají jen po zlomek času.',
      stepanek: ['B', 'B', 'B', 'B', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'], // Every 2nd weekend (Fri-Sun)
      jirik: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'], // Weekly
      togethernessLabel: 'Pouze 21% u táty',
      stabilityLabel: 'Asymetrické odloučení'
    },
    {
      id: 'ospod-chaos',
      name: 'Návrh OSPODu: Chaotický „kamiónový“ režim',
      desc: 'Rychlé střídání 2-2-3 pro mladšího syna. Starší syn má střídavou péči, která se s tím míjí. Extrémní stěhování bez sourozenců.',
      stepanek: ['A', 'A', 'B', 'B', 'A', 'A', 'A', 'B', 'B', 'A', 'A', 'B', 'B', 'B'], // 2-2-3 for stepanek
      jirik: ['B', 'B', 'B', 'B', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'], // Unsynchronized weekly / weekend styk
      togethernessLabel: 'Pouze 21% spolu u táty',
      stabilityLabel: '⚠️ Červená (6+ přesunů)'
    },
    {
      id: 'clean-blocks',
      name: 'Kompromis: Stabilní bloky s překryvem',
      desc: 'Mladší syn má souvislý blok 4 nocí u táty (Středa až Neděle) překrývající se se střídavou péčí staršího syna. Vysoká stabilita i soudržnost.',
      stepanek: ['B', 'B', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'], // Wed-Sun at Dad's
      jirik: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'], // Weekly
      togethernessLabel: '71% spolu u táty',
      stabilityLabel: 'Vysoká (5 nocí v kuse)'
    }
  ];

  const loadPreset = (presetId: string) => {
    const p = PRESETS.find(pr => pr.id === presetId);
    if (p) {
      setSimulatedChildren(prev => {
        return prev.map((child, idx) => {
          let pat: ('A' | 'B')[] = [...p.stepanek] as ('A' | 'B')[];
          if (idx === 1) {
            pat = [...p.jirik] as ('A' | 'B')[];
          } else if (idx > 1) {
            pat = idx % 2 === 0 ? [...p.stepanek] as ('A' | 'B')[] : [...p.jirik] as ('A' | 'B')[];
          }
          return {
            ...child,
            pattern: pat
          };
        });
      });
      setActivePreset(presetId);
    }
  };

  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('synthesis_care_sim_children', JSON.stringify(simulatedChildren));
  }, [simulatedChildren]);

  useEffect(() => {
    localStorage.setItem('synthesis_care_sim_father', fatherName);
  }, [fatherName]);

  useEffect(() => {
    localStorage.setItem('synthesis_care_sim_mother', motherName);
  }, [motherName]);

  // Load from Cloud if available
  useEffect(() => {
    if (currentUser && (currentUser as any).savedCarePlan) {
      const plan = (currentUser as any).savedCarePlan;
      if (plan.simulatedChildren && Array.isArray(plan.simulatedChildren)) {
        setSimulatedChildren(plan.simulatedChildren.map((c: any) => ensureDefaultFields(c)));
      }
      if (plan.fatherName) setFatherName(plan.fatherName);
      if (plan.motherName) setMotherName(plan.motherName);
    }
  }, [currentUser]);

  const handleSaveToCloud = async () => {
    if (!currentUser) {
      if (onOpenAuth) {
        onOpenAuth();
      }
      return;
    }
    setSaveStatus('saving');
    try {
      await saveDocument('users', currentUser.id, {
        savedCarePlan: {
          simulatedChildren,
          fatherName,
          motherName,
          updatedAt: new Date().toISOString()
        }
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      console.error("Error saving plan to cloud:", e);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updateChildField = (childId: string, field: keyof SimulatedChild, value: any) => {
    setSimulatedChildren(prev => prev.map(child => {
      if (child.id === childId) {
        return {
          ...child,
          [field]: value
        };
      }
      return child;
    }));
    setActivePreset('custom');
  };

  const toggleDay = (childId: string, index: number) => {
    setSimulatedChildren(prev => prev.map(child => {
      if (child.id === childId) {
        const newPattern = [...child.pattern];
        newPattern[index] = newPattern[index] === 'A' ? 'B' : 'A';
        return {
          ...child,
          pattern: newPattern
        };
      }
      return child;
    }));
    setActivePreset('custom');
  };

  const calculateTransitions = (pattern: ('A' | 'B')[]) => {
    let transitions = 0;
    for (let i = 0; i < 14; i++) {
      const current = pattern[i];
      const next = pattern[(i + 1) % 14];
      if (current !== next) {
        transitions++;
      }
    }
    return transitions;
  };

  const getStabilityEval = (transitions: number) => {
    if (transitions <= 2) {
      return {
        label: 'Vynikající',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
        bg: 'bg-emerald-500',
        textColor: 'text-emerald-600',
        desc: 'Ucelené, stabilní bloky v obou domácnostech. Minimální frekvence balení kufru, což dává dítěti klid a pocit domova.'
      };
    } else if (transitions <= 4) {
      return {
        label: 'Dobrá',
        color: 'text-teal-700 bg-teal-50 border-teal-100',
        bg: 'bg-teal-500',
        textColor: 'text-teal-600',
        desc: 'Standardní vyvážené střídání. Přesuny jsou přiměřené, ideální pro děti s dobře zvládnutou adaptací.'
      };
    } else if (transitions <= 6) {
      return {
        label: 'Zvýšená zátěž',
        color: 'text-amber-700 bg-amber-50 border-amber-100',
        bg: 'bg-amber-500',
        textColor: 'text-amber-600',
        desc: 'Časté přesuny každých 2-3 dny. Dítě tráví příliš mnoho času přesuny, což může u citlivějších dětí vyvolat únavu.'
      };
    } else {
      return {
        label: '⚠️ Kritický Kamiónový režim',
        color: 'text-rose-700 bg-rose-50 border-rose-100 font-extrabold animate-pulse',
        bg: 'bg-rose-500',
        textColor: 'text-rose-600',
        desc: 'Extrémní roztříštěnost. Dítě neustále balí tašky a stěhuje se. Tento režim zbytečně vyčerpává a je u soudů snadno napadnutelný.'
      };
    }
  };

  // Sibling togetherness calculations
  const isCohesionApplicable = simulatedChildren.length > 1;
  let togetherAtDads = 0;
  let togetherAtMoms = 0;
  let splitDays = 0;

  if (isCohesionApplicable) {
    for (let i = 0; i < 14; i++) {
      const allAtDads = simulatedChildren.every(c => c.pattern[i] === 'A');
      const allAtMoms = simulatedChildren.every(c => c.pattern[i] === 'B');
      if (allAtDads) {
        togetherAtDads++;
      } else if (allAtMoms) {
        togetherAtMoms++;
      } else {
        splitDays++;
      }
    }
  }

  const togethernessPercentage = isCohesionApplicable
    ? Math.round(((togetherAtDads + togetherAtMoms) / 14) * 100)
    : 0;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDownloadWord = () => {
    let text = `PŘÍLOHA K ODVOLÁNÍ / VYJÁDŘENÍ PRO OPATROVNICKÝ SOUD
KOMPARATIVNÍ ANALÝZA STABILITY A SOUROZENECKÉ SOUDRŽNOSTI REŽIMU PÉČE

Účastníci řízení:
Otec: ${fatherName}
Matka: ${motherName}

Předmět analýzy:
${simulatedChildren.map((child, idx) => `Nezletilý/á ${child.name} (${idx + 1}. dítě)`).join('\n')}

I. Právní a psychologická argumentace (Soudržnost sourozenců)
Ústavní soud ČR opakovaně judikuje, že v nejlepším zájmu nezletilých dětí je nerozdělovat sourozence a umožnit jim společně vyrůstat a prožívat podstatnou část volného i školního času. Sourozenecká vazba je jedním z nejstabilnějších a nejdůležitějších citových pout v lidském životě. Níže doložený rozvrh modeluje reálný dopad navrhovaného režimu na jejich společný čas strávený u obou rodičů.

II. 14denní plánovací kalendář (Simulovaný stav)
${simulatedChildren.map(child => {
  const line = child.pattern.map((p, idx) => `Den ${idx+1}: ${p === 'A' ? 'Táta' : 'Máma'}`).join(', ');
  return `${child.name}: ${line}`;
}).join('\n')}

${isCohesionApplicable ? `Sourozenci spolu:
${Array.from({ length: 14 }).map((_, idx) => {
  const allAtDads = simulatedChildren.every(c => c.pattern[idx] === 'A');
  const allAtMoms = simulatedChildren.every(c => c.pattern[idx] === 'B');
  return `Den ${idx+1}: ${allAtDads ? 'Společně u táty' : allAtMoms ? 'Společně u mámy' : 'Rozděleni (❌)'}`;
}).join('\n')}` : ''}

III. Statistické a logistické vyhodnocení
${isCohesionApplicable ? `Index sourozenecké soudržnosti:
- Celková soudržnost: ${togethernessPercentage}% (${togetherAtDads + togetherAtMoms} dní ze 14)
- Společně u otce: ${togetherAtDads} dní (${Math.round(togetherAtDads/14*100)}%)
- Společně u mámy: ${togetherAtMoms} dní (${Math.round(togetherAtMoms/14*100)}%)
- Počet dní odloučení sourozenců: ${splitDays} dní ze 14` : 'Index soudržnosti není relevantní pro jedno dítě.'}

Fyzická stabilita režimu (Stěhování):
${simulatedChildren.map(child => {
  const transitions = calculateTransitions(child.pattern);
  const stability = getStabilityEval(transitions);
  return `- ${child.name}: ${transitions}x přesunů za 14 dnů (${stability.label})`;
}).join('\n')}

IV. Pokročilé individuální parametry dětí (Soudní logistika)
${simulatedChildren.map(child => `
Dítě: ${child.name}
- Věková kategorie: ${
  child.ageGroup === 'infant' ? 'Kojenec (do 1 roku)' :
  child.ageGroup === 'toddler' ? 'Batole (1–3 roky)' :
  child.ageGroup === 'preschool' ? 'Předškolák (3–6 let)' :
  child.ageGroup === 'school' ? 'Školák (6–12 let)' :
  'Teenager (12+ let)'
}
- Docházka: ${child.schoolType === 'skola' ? 'Základní škola' : child.schoolType === 'skolka' ? 'Mateřská škola / jesle' : 'Zatím nechodí (doma)'}
- Vzdálenost do školy od otce: ${child.schoolDistanceDad} km, od matky: ${child.schoolDistanceMom} km
- Místo předávání: ${
  child.handoverType === 'school' ? 'Předávání přes školu/školku (Doporučený standard ČR)' :
  child.handoverType === 'neutral' ? 'Neutrální veřejné místo' :
  child.handoverType === 'father_residence' ? 'Bydliště otce' :
  'Bydliště matky'
}
- Obvyklý čas předávání: ${child.handoverTime}
- Letní prázdniny u otce: ${child.summerWeeksDad} týdnů, u matky: ${child.summerWeeksMom} týdnů
- Vánoční střídání: ${
  child.christmasEveStyle === 'alternating' ? 'Střídavě po roce (Lichý/Sudý)' :
  child.christmasEveStyle === 'split' ? 'Rozdělený Štědrý den' :
  child.christmasEveStyle === 'father' ? 'Vždy u otce' :
  'Vždy u matky'
}
- Zdravotní potřeby: ${child.healthNotes || 'Standardní'}
- Počet kroužků: ${child.hobbiesCount} týdně
- Logistická zátěž předávání: ${
  child.handoverResponsible === 'both' ? 'Spravedlivě oběma (půl na půl)' :
  child.handoverResponsible === 'father' ? 'Zajišťuje převážně otec' :
  'Zajišťuje převážně matka'
}
`).join('\n')}

Místo a datum odevzdání:
V [Město] dne ${new Date().toLocaleDateString('cs-CZ')}

Podpis otce (navrhovatele): .......................................
`;

    const blob = new Blob(['\ufeff' + text], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analyza_soudrznosti_rodice.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fabriciusCopyText = `Nález Ústavního soudu ČR a moderní vývojová psychologie (reprezentovaná např. studií Fabricius & Suh, 2016 z Arizona State University, publikovanou v prestižním časopise Psychology, Public Policy, and Law) jednoznačně vyvracejí překonané domněnky, že kojenci a batolata (děti pod 3 roky věku) nemohou přespávat u otců. 

Empirická data ze studie Fabricius & Suh (2016) prokazují:
1) Časté a pravidelné přespávání u otce v raném věku (pod 1 rok a ve 2 letech) má silný a dlouhodobě pozitivní vliv na kvalitu vztahu mezi otcem a dítětem v dospělosti (prokázán přímý lineární nárůst kvality vztahu s každou nocí strávenou u otce navíc).
2) Tyto noclehy nijak nepoškozují vztah dítěte s matkou. Naopak byl zjištěn pozitivní vliv na oba rodiče (respite effect - odpočinek pro matku, která díky sdílení péče vykazuje méně vyhoření a větší citlivost vůči dítěti).
3) Tyto pozitivní účinky se projevují bez ohledu na to, zda mezi rodiči panuje vysoký konflikt, a bez ohledu na případný počáteční nesouhlas matky s přespáváním.`;

  const warshakCopyText = `Závěry opatrovnických orgánů a soudů prvního stupně by měly reflektovat mezinárodní vědecký konsenzus, který byl formulován v přelomové konsenzuální zprávě prof. Richarda A. Warshaka (2014) pod názvem "Social Science and Parenting Plans for Young Children: A Consensus Report". Tuto zprávu oficiálně schválilo a podepsalo 110 předních světových odborníků na vývoj dětí, psychologii a rodinné právo.

Tento globální vědecký konsenzus stanovuje:
1) Pro dětství všech věkových kategorií, včetně dětí mladších 4 let, by měla být střídavá péče (zahrnující přespávání v obou domácnostech) výchozí a prioritní normou.
2) Neexistují žádné vědecké důkazy, které by obhajovaly odkládání pravidelného přespávání u otce na pozdější věk (např. až od 3 či 5 let). Postponování noclehů naopak prokazatelně poškozuje a oslabuje rodící se otcovské pouto.
3) Teorie monotropie (jediného primárního pečovatele) byla vědou opuštěna. Děti jsou biologicky plně vybaveny k tomu, aby si vytvářely paralelní, stejně kvalitní a bezpečné citové vazby k oběma rodičům současně.`;

  return (
    <div className="space-y-8" id="pece-o-dite-container">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Heart className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider font-mono">Péče a Logistika</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Péče o dítě, cykly a vědecké důkazy</h2>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Střídavá péče u dětí, zejména těch nejmenších (kojenci a batolata), musí být postavena na zdravém rozumu a nejnovějších empirických vědeckých poznatcích. Naše argumentace se opírá o moderní mezinárodní výzkum, který jednoznačně podporuje rovnocennou roli obou rodičů od narození.
        </p>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex border-b border-slate-100 bg-white p-1 rounded-xl shadow-3xs max-w-xl">
        <button
          onClick={() => setActiveSubTab('schedules')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'schedules'
              ? 'bg-teal-50 text-teal-700 shadow-3xs border border-teal-100/50 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Modely péče & Plánovač
        </button>
        <button
          onClick={() => setActiveSubTab('studies')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'studies'
              ? 'bg-teal-50 text-teal-700 shadow-3xs border border-teal-100/50 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Vědecké studie & Výzkum
          <span className="bg-teal-100 text-teal-800 text-[8px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider font-extrabold scale-90">Věda</span>
        </button>
        <button
          onClick={() => setActiveSubTab('methodologies')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'methodologies'
              ? 'bg-teal-50 text-teal-700 shadow-3xs border border-teal-100/50 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-teal-600" />
          Metodiky & Obrana
          <span className="bg-amber-100 text-amber-800 text-[8px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider font-extrabold scale-90">Obrana</span>
        </button>
      </div>

      {activeSubTab === 'schedules' && (
        <>
          {/* Main Grid: Types of custody info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sole Custody */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#A67C52] bg-[#F5E6D3] px-2.5 py-0.5 rounded-full font-mono uppercase">Tradiční</span>
                  <span className="text-[10px] text-slate-400">§ 906 OZ</span>
                </div>
                <h3 className="font-bold text-slate-800 font-display text-sm">Výlučná péče jednoho rodiče</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Dítě je svěřeno do péče jednoho rodiče (který rozhoduje o běžných věcech). Druhý rodič má právo na styk (návštěvy) a povinnost platit stanovené výživné.
                </p>
              </div>
              <div className="border-t border-slate-50 pt-3 mt-4 text-[10px] text-slate-400">
                Doporučuje se tam, kde jeden z rodičů o péči nemá zájem nebo má vážné zdravotní/sociální překážky.
              </div>
            </div>

            {/* Alternating Custody */}
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#EBE7E0] shadow-3xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7D8F69] bg-[#E6EBDD] px-2.5 py-0.5 rounded-full font-mono uppercase">Preferováno ÚS</span>
                  <span className="text-[10px] text-slate-400">§ 907 OZ</span>
                </div>
                <h3 className="font-bold text-slate-800 font-display text-sm">Střídavá péče</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Dítě tráví srovnatelný čas s oběma rodiči (např. 50/50 nebo 60/40). Oba rodiče zůstávají plnohodnotnými vychovateli se všemi právy a povinnostmi.
                </p>
              </div>
              <div className="border-t border-[#EBE7E0] pt-3 mt-4 text-[10px] text-[#7D8F69] font-semibold">
                Ústavní soud ji označuje za primární volbu zachovávající právo dítěte na oba rodiče.
              </div>
            </div>

            {/* Joint Custody */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full font-mono uppercase">Pro partnery</span>
                  <span className="text-[10px] text-slate-400">§ 907 OZ</span>
                </div>
                <h3 className="font-bold text-slate-800 font-display text-sm">Společná péče rodičů</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Soud neurčuje žádný pevný časový harmonogram předávání. Dítě je svěřeno oběma dohromady. Vyžaduje, aby rodiče i po rozchodu bezproblémově spolužili nebo se pružně domlouvali.
                </p>
              </div>
              <div className="border-t border-slate-50 pt-3 mt-4 text-[10px] text-slate-400">
                Ideální u klidných rozchodů, kde rodiče bydlí blízko sebe a plně se respektují.
              </div>
            </div>
          </div>

          {/* ADVANCED CALENDAR PLANNER & SIBLING SIMULATOR */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-800 font-display">Interaktivní simulátor péče &amp; sourozenecké soudržnosti</h3>
                </div>
                <p className="text-xs text-slate-500">Namodelujte si časový plán střídavé péče s ohledem na počet dětí a obhajte soudržnost sourozenců u soudu.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {currentUser ? (
                  <button
                    onClick={handleSaveToCloud}
                    disabled={saveStatus === 'saving'}
                    className={`px-3.5 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer border ${
                      saveStatus === 'saved'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-extrabold shadow-3xs'
                        : saveStatus === 'error'
                        ? 'bg-rose-50 border-rose-200 text-rose-800 font-extrabold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {saveStatus === 'saving' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                    ) : (
                      <Cloud className={`w-3.5 h-3.5 ${saveStatus === 'saved' ? 'text-emerald-600' : 'text-teal-600'}`} />
                    )}
                    {saveStatus === 'saving' ? 'Ukládám...' : saveStatus === 'saved' ? 'Uloženo v cloudu ✓' : saveStatus === 'error' ? 'Chyba ukládání ❌' : 'Uložit do cloudu'}
                  </button>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                    title="Přihlaste se pro uložení rozvrhu do cloudu"
                  >
                    <Cloud className="w-3.5 h-3.5 text-slate-400" />
                    Uložit do cloudu
                  </button>
                )}
                <button
                  onClick={() => setIsPrintMode(!isPrintMode)}
                  className={`px-4 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    isPrintMode 
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                      : 'bg-teal-600 text-white hover:bg-teal-700 shadow-3xs'
                  }`}
                >
                  {isPrintMode ? 'Zpět do plánovače' : 'Vygenerovat verzi pro soud'}
                </button>
              </div>
            </div>

            {isPrintMode ? (
              /* PRINTABLE PREVIEW MODULE */
              <div className="p-6 md:p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 space-y-6" id="printable-report-wrapper">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-100 shadow-3xs print:hidden">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-slate-700">Tisková verze je připravena k tisku (Ctrl+P) nebo uložení do PDF.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-lg hover:bg-teal-700 shadow-3xs transition-all flex items-center gap-2 cursor-pointer"
                      title="Vytisknout report nebo uložit do PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Tisk / PDF
                    </button>
                    <button
                      onClick={handleDownloadWord}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg shadow-3xs transition-all flex items-center gap-2 cursor-pointer"
                      title="Stáhnout analýzu jako Word .doc soubor"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      Stáhnout Word
                    </button>
                  </div>
                </div>

                {/* Formal Legal Appendix Document */}
                <div className="bg-white p-8 md:p-12 border border-slate-200 shadow-md text-slate-900 font-sans max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
                  
                  {/* Document Header */}
                  <div className="border-b-2 border-slate-900 pb-5 text-center space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">Příloha k odvolání / vyjádření pro opatrovnický soud</span>
                    <h2 className="text-lg md:text-xl font-extrabold uppercase tracking-tight text-slate-950">
                      KOMPARATIVNÍ ANALÝZA STABILITY A SOUROZENEKÉ SOUDRŽNOSTI REŽIMU PÉČE
                    </h2>
                    <p className="text-[11px] text-slate-500 italic">
                      Zpracováno na základě objektivního časového rozvržení a judikatury Ústavního soudu ČR o zachování sourozeneckých vazeb
                    </p>
                  </div>

                  {/* Parties & Subjects */}
                  <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-4">
                    <div>
                      <span className="font-bold text-slate-500 uppercase block text-[9px] font-mono">Účastníci řízení:</span>
                      <p className="font-semibold text-slate-800 mt-0.5">Otec: {fatherName}</p>
                      <p className="font-semibold text-slate-800">Matka: {motherName}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 uppercase block text-[9px] font-mono">Předmět analýzy:</span>
                      {simulatedChildren.map((child, idx) => (
                        <p key={child.id} className="font-semibold text-slate-800 mt-0.5">
                          Nezletilý {child.name} ({idx === 0 ? 'první' : idx === 1 ? 'druhé' : `${idx + 1}.`} dítě)
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Summary of current scenario */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-slate-950 uppercase border-l-4 border-teal-600 pl-2">
                      I. Právní a psychologická argumentace (Soudržnost sourozenců)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-700 text-justify">
                      Ústavní soud ČR opakovaně judikuje, že v nejlepším zájmu nezletilých dětí je <strong>nerozdělovat sourozence</strong> a umožnit jim společně vyrůstat a prožívat podstatnou část volného i školního času. Sourozenecká vazba je jedním z nejstabilnějších a nejdůležitějších citových pout v lidském životě. Níže doložený rozvrh modeluje reálný dopad navrhovaného režimu na jejich společný čas strávený u obou rodičů.
                    </p>
                  </div>

                  {/* Graphical 14-day comparison matrix */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-slate-950 uppercase border-l-4 border-teal-600 pl-2">
                      II. 14denní plánovací kalendář (Simulovaný stav)
                    </h4>
                    
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-[10px] uppercase font-mono font-bold text-slate-600">
                            <th className="p-2.5 border-r border-slate-200">Dítě</th>
                            {daysOfWeek.map((day, idx) => (
                              <th key={idx} className="p-2.5 text-center border-r border-slate-200">W1-{day}</th>
                            ))}
                            {daysOfWeek.map((day, idx) => (
                              <th key={idx} className="p-2.5 text-center border-r border-slate-200">W2-{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {simulatedChildren.map(child => {
                            return (
                              <tr key={child.id} className="border-b border-slate-200">
                                <td className="p-2.5 font-bold bg-slate-50 border-r border-slate-200">{child.name}</td>
                                {child.pattern.map((p, idx) => (
                                  <td key={idx} className={`p-2 border-r border-slate-100 text-center font-bold ${p === 'A' ? 'bg-[#E6EBDD]/40 text-[#7D8F69]' : 'bg-slate-50 text-slate-400'}`}>
                                    {p === 'A' ? 'Táta' : 'Máma'}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                          {isCohesionApplicable && (
                            <tr className="bg-slate-50/50">
                              <td className="p-2.5 font-extrabold border-r border-slate-200">Sourozenci spolu</td>
                              {Array.from({ length: 14 }).map((_, idx) => {
                                const allAtDads = simulatedChildren.every(c => c.pattern[idx] === 'A');
                                const allAtMoms = simulatedChildren.every(c => c.pattern[idx] === 'B');
                                const together = allAtDads || allAtMoms;
                                return (
                                  <td key={idx} className={`p-1 border-r border-slate-100 text-center text-[10px] font-bold ${together ? (allAtDads ? 'bg-emerald-100 text-emerald-800' : 'bg-[#E6EBDD]/20 text-slate-700') : 'bg-rose-50 text-rose-700'}`}>
                                    {together ? (allAtDads ? '✓ Táta' : '✓ Máma') : '❌ SÉP'}
                                  </td>
                                );
                              })}
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {isCohesionApplicable && (
                      <p className="text-[10px] text-slate-500 italic">
                        Vysvětlivky: ✓ Táta = Všichni sourozenci jsou společně u otce • ✓ Máma = Všichni sourozenci jsou společně u matky • ❌ SÉP = Sourozenci jsou uměle rozděleni (někteří u táty, jiní u mámy).
                      </p>
                    )}
                  </div>

                  {/* Metrics & Statistical tables */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-slate-950 uppercase border-l-4 border-teal-600 pl-2">
                      III. Statistické a logistické vyhodnocení
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      
                      {/* Sibling togetherness box */}
                      <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                        <span className="font-bold text-slate-900 text-xs block uppercase border-b pb-1">Index sourozenecké soudržnosti</span>
                        {isCohesionApplicable ? (
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-baseline">
                              <span className="text-slate-600">Celková soudržnost:</span>
                              <span className="font-extrabold text-sm">{togethernessPercentage}% ({togetherAtDads + togetherAtMoms} dní ze 14)</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                              <span className="text-slate-600">Společně u otce:</span>
                              <span className="font-bold text-slate-800">{togetherAtDads} dní ({Math.round(togetherAtDads/14*100)}%)</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                              <span className="text-slate-600">Společně u matky:</span>
                              <span className="font-bold text-slate-800">{togetherAtMoms} dní ({Math.round(togetherAtMoms/14*100)}%)</span>
                            </div>
                            <div className="flex justify-between items-baseline border-t pt-1.5 mt-1.5">
                              <span className="text-rose-600 font-bold">Počet dní odloučení sourozenců:</span>
                              <span className="font-extrabold text-rose-700">{splitDays} dní ze 14</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-500 italic text-[11px] leading-relaxed pt-2">
                            Index soudržnosti není relevantní pro jedno dítě. Přidejte v plánovači další sourozence pro automatické vyhodnocení.
                          </p>
                        )}
                      </div>

                      {/* Suitcase / stability index box */}
                      <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                        <span className="font-bold text-slate-900 text-xs block uppercase border-b pb-1">Fyzická stabilita režimu (Stěhování)</span>
                        
                        <div className="space-y-4">
                          {simulatedChildren.map(child => {
                            const transitions = calculateTransitions(child.pattern);
                            const stability = getStabilityEval(transitions);
                            return (
                              <div key={child.id} className="space-y-1">
                                <div className="flex justify-between text-[11px]">
                                  <span className="font-semibold text-slate-700">{child.name} (přesuny za 14 dnů):</span>
                                  <span className="font-extrabold text-slate-950">{transitions}x ({stability.label})</span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight">{stability.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Legal signature area */}
                  <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs">
                    <div>
                      <p className="text-slate-500">Místo a datum odevzdání:</p>
                      <p className="font-semibold text-slate-800">V [Město] dne {new Date().toLocaleDateString('cs-CZ')}</p>
                    </div>
                    <div className="text-center w-48">
                      <div className="border-b border-slate-400 h-10 w-full" />
                      <p className="text-slate-500 mt-1">Podpis otce (navrhovatele)</p>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* INTERACTIVE APP SIMULATOR */
              <div className="space-y-6">
                
                {/* Visual Cards for Presets */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Rychlé srovnání modelů péče:</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {PRESETS.map(preset => {
                      const isActive = activePreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => loadPreset(preset.id)}
                          className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                            isActive
                              ? 'bg-teal-50/70 border-teal-200 text-teal-900 shadow-3xs ring-1 ring-teal-200'
                              : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200'
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="font-bold text-xs">{preset.name}</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-sans line-clamp-3">
                              {preset.desc}
                            </p>
                          </div>
                          
                          <div className="mt-3 pt-2.5 border-t border-slate-100/70 flex items-center justify-between text-[9px] font-mono w-full">
                            <span className="font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                              {preset.togethernessLabel}
                            </span>
                            <span className="text-slate-400">
                              {preset.stabilityLabel}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Main Interactive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-slate-100">
                  
                  {/* Left Column: Interactive 14 days schedules */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Kliknutím na den přepněte Táta vs Máma:</span>
                      <div className="flex items-center gap-2">
                        {activePreset === 'custom' && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase font-mono">
                            Upraveno
                          </span>
                        )}
                        <button
                          onClick={() => {
                            const newId = `child-${Date.now()}`;
                            const newChildName = `Dítě ${simulatedChildren.length + 1}`;
                            const colors = ['bg-teal-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-blue-600', 'bg-amber-600'];
                            const chosenColor = colors[simulatedChildren.length % colors.length];
                            setSimulatedChildren(prev => [
                              ...prev,
                              {
                                id: newId,
                                name: newChildName,
                                pattern: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
                                color: chosenColor,
                                ageGroup: 'school',
                                schoolType: 'skola',
                                schoolDistanceDad: 5,
                                schoolDistanceMom: 5,
                                schoolTimeDad: 10,
                                schoolTimeMom: 10,
                                handoverType: 'school',
                                handoverTime: 'Neděle 18:00',
                                handoverResponsible: 'both',
                                hobbiesCount: 1,
                                healthNotes: 'Standardní',
                                summerWeeksDad: 4,
                                summerWeeksMom: 4,
                                christmasEveStyle: 'alternating'
                              }
                            ]);
                            setActivePreset('custom');
                          }}
                          className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          + Přidat dítě
                        </button>
                      </div>
                    </div>

                    {/* Children rows rendered dynamically */}
                    {simulatedChildren.map((child) => {
                      const dadDays = child.pattern.filter(p => p === 'A').length;
                      return (
                        <div key={child.id} className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100 animate-fadeIn">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${child.color || 'bg-teal-600'}`} />
                              <input
                                type="text"
                                value={child.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSimulatedChildren(prev => prev.map(c => c.id === child.id ? { ...c, name: val } : c));
                                }}
                                className="font-bold text-xs text-slate-800 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-teal-500 focus:outline-none py-0.5 px-1 max-w-[150px]"
                                placeholder="Jméno dítěte"
                              />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <button
                                onClick={() => setExpandedChildId(expandedChildId === child.id ? null : child.id)}
                                className="text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer mr-2"
                                title="Upravit pokročilé individuální parametry dítěte"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                                {expandedChildId === child.id ? 'Skrýt detaily' : 'Pokročilé detaily'}
                              </button>
                              <span>Poměr: {dadDays} d. u táty ({Math.round(dadDays/14*100)}%)</span>
                              {simulatedChildren.length > 1 && (
                                <button
                                  onClick={() => {
                                    setSimulatedChildren(prev => prev.filter(c => c.id !== child.id));
                                  }}
                                  className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer"
                                  title="Odebrat dítě"
                                >
                                  Odebrat
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-7 lg:grid-cols-14 gap-1.5">
                            {child.pattern.map((p, idx) => {
                              const isA = p === 'A';
                              return (
                                <button
                                  key={idx}
                                  onClick={() => toggleDay(child.id, idx)}
                                  className={`p-1.5 border rounded-lg flex flex-col items-center justify-between h-14 transition-all cursor-pointer ${
                                    isA 
                                      ? 'bg-teal-50 border-teal-200 text-teal-800 shadow-3xs' 
                                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-400'
                                  }`}
                                >
                                  <span className="text-[7px] text-slate-400 font-mono">D{idx+1} {daysOfWeek[idx % 7]}</span>
                                  <span className={`text-[9px] font-bold ${isA ? 'text-teal-700' : 'text-slate-400'}`}>
                                    {isA ? 'Táta' : 'Máma'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Advanced child parameters form when expanded */}
                          {expandedChildId === child.id && (
                            <div className="bg-white border border-slate-200/60 rounded-xl p-4 mt-3 space-y-4 animate-fadeIn text-xs shadow-3xs">
                              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Sliders className="w-4 h-4 text-teal-600 animate-pulse" />
                                <span className="font-bold text-slate-800">Pokročilé parametry péče o: {child.name}</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Column 1: Age & Health */}
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Věková kategorie dětství:</label>
                                    <select 
                                      value={child.ageGroup} 
                                      onChange={(e) => updateChildField(child.id, 'ageGroup', e.target.value as any)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none font-medium text-slate-700"
                                    >
                                      <option value="infant">Kojenec (do 1 roku)</option>
                                      <option value="toddler">Batole (1–3 roky)</option>
                                      <option value="preschool">Předškolák (3–6 let)</option>
                                      <option value="school">Školák (6–12 let)</option>
                                      <option value="teen">Teenager (12+ let)</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Specifický zdravotní stav / potřeby:</label>
                                    <input 
                                      type="text" 
                                      value={child.healthNotes || 'Standardní'}
                                      onChange={(e) => updateChildField(child.id, 'healthNotes', e.target.value)}
                                      placeholder="např. Standardní, ADHD, potravinová alergie"
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                    />
                                  </div>
                                </div>

                                {/* Column 2: School & Distances */}
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Školní docházka dětí:</label>
                                    <select 
                                      value={child.schoolType} 
                                      onChange={(e) => updateChildField(child.id, 'schoolType', e.target.value as any)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none font-medium text-slate-700"
                                    >
                                      <option value="skola">Základní škola</option>
                                      <option value="skolka">Mateřská školka / jesle</option>
                                      <option value="doma">Doma (zatím nechodí)</option>
                                    </select>
                                  </div>

                                  {child.schoolType !== 'doma' && (
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-[9px] text-slate-400 font-bold mb-0.5">Vzdálenost k tátovi (km):</label>
                                        <input 
                                          type="number" 
                                          value={child.schoolDistanceDad}
                                          onChange={(e) => updateChildField(child.id, 'schoolDistanceDad', Number(e.target.value))}
                                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] text-slate-400 font-bold mb-0.5">Vzdálenost k mámě (km):</label>
                                        <input 
                                          type="number" 
                                          value={child.schoolDistanceMom}
                                          onChange={(e) => updateChildField(child.id, 'schoolDistanceMom', Number(e.target.value))}
                                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Column 3: Handovers */}
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Místo předávání (soudní jistota):</label>
                                    <select 
                                      value={child.handoverType} 
                                      onChange={(e) => updateChildField(child.id, 'handoverType', e.target.value as any)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none font-medium text-slate-700"
                                    >
                                      <option value="school">Přes školu/školku (Doporučený standard ČR)</option>
                                      <option value="neutral">Neutrální veřejné místo</option>
                                      <option value="father_residence">Bydliště otce</option>
                                      <option value="mother_residence">Bydliště matky</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Obvyklý den &amp; čas předávání:</label>
                                    <input 
                                      type="text" 
                                      value={child.handoverTime}
                                      onChange={(e) => updateChildField(child.id, 'handoverTime', e.target.value)}
                                      placeholder="např. Pondělí 8:00 (vstup do školy)"
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Prázdniny u táty (týdny):</label>
                                    <input 
                                      type="number" 
                                      value={child.summerWeeksDad}
                                      onChange={(e) => updateChildField(child.id, 'summerWeeksDad', Number(e.target.value))}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-teal-500"
                                      min={0}
                                      max={8}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Vánoční svátky střídání:</label>
                                    <select 
                                      value={child.christmasEveStyle} 
                                      onChange={(e) => updateChildField(child.id, 'christmasEveStyle', e.target.value as any)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-700"
                                    >
                                      <option value="alternating">Střídavě po roce (Lichý/Sudý)</option>
                                      <option value="split">Rozdělený svátek (24. u jednoho, 25. přesun)</option>
                                      <option value="father">Vždy u otce</option>
                                      <option value="mother">Vždy u matky</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Počet kroužků týdně:</label>
                                    <input 
                                      type="number" 
                                      value={child.hobbiesCount}
                                      onChange={(e) => updateChildField(child.id, 'hobbiesCount', Number(e.target.value))}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-teal-500"
                                      min={0}
                                      max={10}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Logistická zátěž předávání:</label>
                                    <select 
                                      value={child.handoverResponsible} 
                                      onChange={(e) => updateChildField(child.id, 'handoverResponsible', e.target.value as any)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-700"
                                    >
                                      <option value="both">Spravedlivě oběma (půl na půl)</option>
                                      <option value="father">Zajišťuje převážně otec</option>
                                      <option value="mother">Zajišťuje převážně matka</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Developmental & Psychological Analysis Banner */}
                              <div className="bg-teal-50/40 border border-teal-100 p-3 rounded-lg text-[11px] text-slate-700 leading-relaxed flex items-start gap-2">
                                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-teal-950 block">Soudní doporučení pro věk: {
                                    child.ageGroup === 'infant' ? 'Kojenec (do 1 roku)' :
                                    child.ageGroup === 'toddler' ? 'Batole (1–3 roky)' :
                                    child.ageGroup === 'preschool' ? 'Předškolák (3–6 let)' :
                                    child.ageGroup === 'school' ? 'Školák (6–12 let)' :
                                    'Teenager (12+ let)'
                                  }</span>
                                  <p className="mt-0.5 text-slate-600">
                                    {child.ageGroup === 'infant' && "U kojenců do 1 roku výzkum a judikatura Ústavního soudu doporučují časté, kratší kontakty s oběma rodiči s postupným zapojováním přespávání. Klíčová je stabilita citových vazeb. Věda prokazuje, že zapojení noční péče otce buduje bezpečnější pouto do budoucna (Fabricius, 2016)."}
                                    {child.ageGroup === 'toddler' && "U batolat (1-3 roky) je střídavá péče skvělá v kratších intervalech (např. režim 2-2-3 nebo 3-4-4-3). Pravidelné noční rituály a péče otce upevňují bezpečné pouto k oběma rodičům bez negativních vlivů na matku."}
                                    {child.ageGroup === 'preschool' && "U předškoláků (3-6 let) je střídavá péče vynikající volbou v symetrických blocích. Děti mají rozvinutou řeč, logistiku přechodů snášejí velmi dobře a kontakt s oběma rodiči podporuje zdravou socializaci a emoční rozvoj."}
                                    {child.ageGroup === 'school' && "U dětí školního věku (6-12 let) je standardní týden-týden střídání (předávání nejlépe v pondělí přímo přes školu/družinu) ideální. Zajišťuje klid na celotýdenní školní cyklus a kroužky. Děti mají vysokou stabilitu."}
                                    {child.ageGroup === 'teen' && "U teenagerů (nad 12 let) má názor dítěte zásadní váhu podle § 867 Občanského zákoníku. Režim by měl být flexibilní a plně respektovat školní, sportovní a sociální život dospívajícího."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Sibling togetherness visual row */}
                    {isCohesionApplicable && (
                      <div className="space-y-2 bg-slate-50/20 p-4 rounded-xl border border-dashed border-slate-200">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-teal-600" />
                            Společně strávený čas sourozenců (Soudržnost):
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                            Společně {togetherAtDads + togetherAtMoms} dní ze 14 ({togethernessPercentage}%)
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-7 lg:grid-cols-14 gap-1.5">
                          {Array.from({ length: 14 }).map((_, idx) => {
                            const allAtDads = simulatedChildren.every(c => c.pattern[idx] === 'A');
                            const allAtMoms = simulatedChildren.every(c => c.pattern[idx] === 'B');
                            const together = allAtDads || allAtMoms;
                            return (
                              <div
                                key={idx}
                                className={`p-1.5 border rounded-lg flex flex-col items-center justify-center h-12 text-center ${
                                  together 
                                    ? (allAtDads ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-[#E6EBDD]/10 border-slate-100 text-slate-600') 
                                    : 'bg-rose-50 border-rose-100 text-rose-700 font-semibold'
                                }`}
                              >
                                <span className="text-[7px] text-slate-400 font-mono block">Den ${idx+1}</span>
                                <span className="text-[8px] block mt-0.5">
                                  {together ? (allAtDads ? '✓ Táta' : '✓ Máma') : '❌ SÉP'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right Column: Live Analysis Widgets */}
                  <div className="lg:col-span-4 space-y-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Okamžitá analýza dopadů:</span>

                    {/* Sibling Solidarity Widget */}
                    {isCohesionApplicable && (
                      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-3xs space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 uppercase font-mono">Sourozenecká soudržnost</span>
                          <Users className="w-4 h-4 text-teal-600" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Soudržnost:</span>
                            <span className="font-bold text-slate-800">{togethernessPercentage}% ({togetherAtDads + togetherAtMoms} dní ze 14)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                              className="bg-teal-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${togethernessPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 text-[11px] border-t border-slate-50 pt-3">
                          <div className="flex justify-between text-slate-600">
                            <span>Společně u táty {fatherName.split(' ')[0]}:</span>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">{togetherAtDads} dní</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Společně u mámy:</span>
                            <span className="font-bold text-slate-700 bg-slate-50 px-1.5 py-0.2 rounded font-mono">{togetherAtMoms} dní</span>
                          </div>
                          <div className="flex justify-between text-rose-600 font-semibold border-t border-dashed border-slate-100 pt-2">
                            <span>Dny umělého odloučení:</span>
                            <span className="bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-mono">{splitDays} dní</span>
                          </div>
                        </div>

                        {splitDays > 4 && (
                          <div className="bg-rose-50 border border-rose-100/50 rounded-lg p-3 text-[10px] text-rose-800 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>Vysoké odloučení sourozenců!</span>
                            </div>
                            <p className="leading-relaxed">
                              Děti jsou odděleny po {splitDays} dní ze 14. Tento režim vážně narušuje jejich vztah. Skvělý argument pro odvolání k soudu.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stability Widgets for Each Child */}
                    {simulatedChildren.map(child => {
                      const transitions = calculateTransitions(child.pattern);
                      const stability = getStabilityEval(transitions);
                      return (
                        <div key={child.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-3xs space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-800 uppercase font-mono">{child.name}: Stabilita</span>
                            <ArrowRightLeft className="w-4 h-4 text-slate-500" />
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Přesuny (kufr):</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${stability.color}`}>
                              {transitions} přesunů (14d)
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className={`text-[11px] font-bold block ${stability.textColor}`}>
                              Hodnocení: {stability.label}
                            </span>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              {stability.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                  </div>

                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2 mt-4 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Úprava jmen rodičů:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Jméno otce:</label>
                      <input
                        type="text"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Jméno matky:</label>
                      <input
                        type="text"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

<div className="bg-teal-50 border border-teal-100 p-4.5 rounded-xl flex gap-3 text-xs text-teal-900 leading-relaxed">
                  <Info className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong>Jak s tímto plánovačem pracovat u soudu:</strong>
                    <p>
                      1. Kliknutím na jednotlivé dny nasimulujte stávající stav nebo návrhy protistrany a OSPODu.
                      2. Sledujte, jak dramaticky klesne procento společného času bratříků a jak stoupne nestabilita ("kamiónový index").
                      3. Klikněte na <strong>"Generovat report pro soud"</strong>, vytiskněte jej a přiložte jako jasný, vizuální důkaz k vašemu vyjádření či odvolání.
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Practical Handover advice */}
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex gap-4">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-900 text-xs font-display">Taktika předávání dětí: Doporučení z praxe</h4>
              <p className="text-amber-800 text-xs leading-relaxed">
                Nejlepší způsob předávání je <strong>přes školská zařízení</strong> (jeden rodič ráno odvede do školky/školy, druhý rodič odpoledne vyzvedne). Tím se zcela eliminuje nutnost přímého kontaktu rodičů v emočně napjatých chvílích a dítě nevidí žádné případné hádky ani napětí. Pokud to není možné, předávejte na neutrálním veřejném místě.
              </p>
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'studies' && (
        /* SCIENTIFIC STUDIES TAB */
        <div className="space-y-8 animate-fadeIn animate-duration-300" id="scientific-studies-subview">
          
          {/* Scientific intro card */}
          <div className="bg-slate-900 text-slate-100 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12 select-none">
              <Award className="w-96 h-96 text-teal-400" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                  Globální vědecký konsenzus
                </span>
                <Award className="w-4 h-4 text-teal-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
                Vědecké studie vyvracejí opatrovnické mýty o nejmenších dětech
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                Opatrovnické soudy a sociální pracovnice OSPOD v České republice často žijí v zajetí dávno vyvrácených mateřských stereotypů ze 20. století (tzv. teorie monotropie - předpoklad, že dítě pod 3 roky potřebuje k zdravému vývoji výhradně matku a s otcem nesmí přespávat). Moderní světová vývojová psychologie a rozsáhlá empirická data však mluví naprosto jednoznačně: <strong>střídavá péče a přespávání u obou rodičů je nejlepším zájmem dítěte již od narození</strong>.
              </p>
            </div>
          </div>

          {/* Interactive Study Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left sidebar with studies options */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Vyberte vědeckou studii:</span>
              
              <button
                onClick={() => { setSelectedStudy('fabricius'); setExpandedStudyText(false); }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  selectedStudy === 'fabricius'
                    ? 'bg-teal-50/70 border-teal-200 text-teal-900 shadow-3xs'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${selectedStudy === 'fabricius' ? 'bg-teal-100 text-teal-700' : 'bg-slate-50 text-slate-400'}`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs">Fabricius & Suh (2016)</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Dlouhodobý vliv noclehů u kojenců a batolat</p>
                  <span className="inline-block text-[8px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono uppercase tracking-wide mt-1">Ústavní argument</span>
                </div>
              </button>

              <button
                onClick={() => { setSelectedStudy('warshak'); setExpandedStudyText(false); }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  selectedStudy === 'warshak'
                    ? 'bg-teal-50/70 border-teal-200 text-teal-900 shadow-3xs'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${selectedStudy === 'warshak' ? 'bg-teal-100 text-teal-700' : 'bg-slate-50 text-slate-400'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs">Konsenzus 110 vědců - Warshak (2014)</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Mezinárodní standard střídavé péče pro děti pod 4 roky</p>
                  <span className="inline-block text-[8px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-mono uppercase tracking-wide mt-1">Globální konsenzus</span>
                </div>
              </button>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4.5 text-[10px] text-slate-500 leading-relaxed font-mono">
                💡 <strong>Rada z praxe:</strong> Odkazy na tyto konkrétní studie představují pro soudce neprůstřelný argument, který nutí OSPOD doložit protidůkazy. Tyto studie tvoří základ argumentace v nálezech Ústavního soudu ČR o střídavé péči u malých dětí.
              </div>
            </div>

            {/* Right side displaying selected study details */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-3xs space-y-6">
              
              {selectedStudy === 'fabricius' ? (
                /* FABRICIUS DETAILS */
                <div className="space-y-6" id="fabricius-details">
                  
                  {/* Title & metadata */}
                  <div className="border-b border-slate-100 pb-4 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-bold font-mono bg-teal-50 text-teal-600 px-2 py-0.5 rounded uppercase">Psychology, Public Policy, and Law</span>
                      <span className="text-[9px] font-bold font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">APA (2016)</span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-slate-800 font-serif leading-snug">
                      Should Infants and Toddlers Have Frequent Overnight Parenting Time With Fathers? The Policy Debate and New Data
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      William V. Fabricius, Go Woon Suh • Arizona State University • Schváleno APA
                    </p>
                  </div>

                  {/* Quick methodology */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Metodika a vzorek</span>
                      <p className="text-slate-700 leading-relaxed font-semibold">
                        N = 116 dospělých studentů, jejichž rodiče se trvale rozešli před jejich 3. rokem života. Hodnocen byl dlouhodobý vliv noclehů u otce v raném dětství na vztahy o 19 let později v mladé dospělosti.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Klíčová zjištěná proměnná</span>
                      <p className="text-slate-700 leading-relaxed font-semibold">
                        Zkoumaly se standardizované vědecké škály otcovské a mateřské vřelosti (Parental Caring, Mattering, Paternal Blame) a celková blízkost a důvěra ve vztahu (PBI).
                      </p>
                    </div>
                  </div>

                  {/* Bullet findings */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Klíčové vědecké nálezy:</span>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Efekt přímé závislosti (Dose-Response)</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Každá noc strávená u otce navíc v raném věku (kojenci do 1 roku i batolata do 2 let) lineárně zvyšuje kvalitu a hloubku vztahu s otcem v dospělosti. Maximální kvality a optimálního bezpečí bylo dosaženo při rovnocenném počtu nocí u obou rodičů (6 až 7 nocí ve 14denním cyklu u otce).
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Nulová újma na vztahu s matkou</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Výzkum prokazatelně vyvrátil obavu, že přespávání u otce poškozuje vztah dětí k matkám. Děti, které trávily noci u obou rodičů, vykazovaly stabilní a bezpečné citové vazby s oběma rodiči současně.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Vliv i přes odpor a konflikt</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Tento blahodárný efekt přespávání u otce v nejranějším věku fungoval zcela bez ohledu na to, zda mezi rodiči panovalo nepřátelství nebo zda matka s noclehy nesouhlasila a byly nařízeny soudem přes její odpor. Rodičovský konflikt nesnižuje dlouhodobý přínos raných noclehů pro dítě.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ready-to-copy block */}
                  <div className="space-y-2 border-t border-slate-100 pt-4" id="copy-block-fabricius">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                        Text pro argumentaci k soudu:
                      </span>
                      <button
                        onClick={() => copyToClipboard(fabriciusCopyText, 'fabricius')}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all flex items-center gap-1 border cursor-pointer ${
                          copiedId === 'fabricius'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {copiedId === 'fabricius' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Zkopírováno!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            Zkopírovat argument
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-[#FAF9F5] border border-[#EBE7E0] p-4 rounded-xl text-[10px] text-slate-600 font-mono leading-relaxed whitespace-pre-wrap select-text">
                      {fabriciusCopyText}
                    </div>
                  </div>

                </div>
              ) : (
                /* WARSHAK DETAILS */
                <div className="space-y-6" id="warshak-details">
                  
                  {/* Title & metadata */}
                  <div className="border-b border-slate-100 pb-4 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-bold font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase">Consensus Report</span>
                      <span className="text-[9px] font-bold font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">110 Signatories (2014)</span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-slate-800 font-serif leading-snug">
                      Social Science and Parenting Plans for Young Children: A Consensus Report
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Richard A. Warshak • University of Texas Southwestern Medical Center (a 110 mezinárodních signatářů)
                    </p>
                  </div>

                  {/* Quick methodology */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Vědecká záštita</span>
                      <p className="text-slate-700 leading-relaxed font-semibold">
                        Zpráva byla podepsána a schválena 110 mezinárodními špičkami v oblasti psychologie dětství, psychiatrie, sociální práce a rodinného práva z celého světa.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Účel dokumentu</span>
                      <p className="text-slate-700 leading-relaxed font-semibold">
                        Poskytnout soudům, mediátorům a opatrovníkům jednotný, empiricky podložený rámec pro rozhodování o péči u dětí do 4 let s cílem zabránit dezinterpretacím vědeckých dat.
                      </p>
                    </div>
                  </div>

                  {/* Bullet findings */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Klíčové vědecké nálezy:</span>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Střídavá péče od narození</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Empirická data plně podporují střídavou péči (podíl času v rozmezí 35% až 50% pro každého rodiče) jako nejlepší možnou normu pro zdravý rozvoj dítěte u dětí všech věkových skupin, včetně dětí mladších 4 let.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Odmítnutí odkládání noclehů</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Neexistují žádné vědecké studie, které by ukazovaly, že je bezpečnější přespávání u otce odložit na pozdější věk (např. po 3. či 5. roce). Naopak odkládání noclehů prokazatelně vede k odcizení a výraznému snížení ochoty otců se na výchově podílet.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Zdravý vývoj paralelních vazeb</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Kojenci a batolata si vytvářejí paralelní citové vazby k matce i k otci současně. Představa, že dítě má pouze jednoho "primárního" rodiče (obvykle matku), byla vědecky překonána. Omezení kontaktu s otcem na pouhé hodiny bez přespávání tuto vazbu nevratně poškozuje.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ready-to-copy block */}
                  <div className="space-y-2 border-t border-slate-100 pt-4" id="copy-block-warshak">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                        Text pro argumentaci k soudu:
                      </span>
                      <button
                        onClick={() => copyToClipboard(warshakCopyText, 'warshak')}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all flex items-center gap-1 border cursor-pointer ${
                          copiedId === 'warshak'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {copiedId === 'warshak' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Zkopírováno!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            Zkopírovat argument
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-[#FAF9F5] border border-[#EBE7E0] p-4 rounded-xl text-[10px] text-slate-600 font-mono leading-relaxed whitespace-pre-wrap select-text">
                      {warshakCopyText}
                    </div>
                  </div>

                </div>
              )}

              {/* Expanded Translation Section */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setExpandedStudyText(!expandedStudyText)}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  {expandedStudyText ? (
                    <>
                      <X className="w-4 h-4 shrink-0" />
                      Skrýt plné znění a překlad studie
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 shrink-0" />
                      Číst plný český překlad studie v češtině (Plné znění)
                    </>
                  )}
                </button>
              </div>

              {expandedStudyText && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 bg-[#FCFCFB] border border-[#F3EFE9] rounded-2xl p-6 md:p-8 space-y-6 text-slate-800 leading-relaxed overflow-hidden shadow-2xs font-serif select-text text-left"
                >
                  {/* Interactive academic paper header */}
                  <div className="border-b border-slate-200 pb-4 space-y-2 font-sans">
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full inline-block">
                      Překlad akademického originálu • Plné znění
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight leading-snug">
                      {TRANSLATED_STUDIES[selectedStudy].title}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 font-mono pt-2">
                      <div><strong>Autoři:</strong> {TRANSLATED_STUDIES[selectedStudy].authors}</div>
                      <div><strong>Časopis:</strong> {TRANSLATED_STUDIES[selectedStudy].journal}</div>
                      <div><strong>Rok:</strong> {TRANSLATED_STUDIES[selectedStudy].year}</div>
                      <div><strong>Citace:</strong> {TRANSLATED_STUDIES[selectedStudy].citation}</div>
                    </div>
                  </div>

                  {/* Abstract Card */}
                  <div className="bg-[#FAF9F5] border-l-4 border-teal-500 p-5 rounded-r-xl space-y-2 font-sans">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">Abstrakt / Souhrn</h4>
                    <p className="text-slate-700 text-xs leading-relaxed italic">
                      {TRANSLATED_STUDIES[selectedStudy].abstract}
                    </p>
                  </div>

                  {/* Introduction */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono font-sans">Úvod a teoretická východiska</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-serif">
                      {TRANSLATED_STUDIES[selectedStudy].introduction}
                    </p>
                  </div>

                  {/* Methodology */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono font-sans">Vědecká metodologie a zkoumaný vzorek</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-serif">
                      {TRANSLATED_STUDIES[selectedStudy].methodology}
                    </p>
                  </div>

                  {/* Detailed Findings List */}
                  <div className="space-y-3 bg-[#FAF9F5]/40 border border-slate-100 rounded-xl p-5 font-sans">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">Hlavní vědecké nálezy a výsledky:</h4>
                    <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                      {TRANSLATED_STUDIES[selectedStudy].keyFindings.map((finding, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-teal-600 font-bold shrink-0">{idx + 1}.</span>
                          <p>{finding}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scientific Discussion */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono font-sans">Odborná vědecká diskuse</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-serif">
                      {TRANSLATED_STUDIES[selectedStudy].scientificDiscussion}
                    </p>
                  </div>

                  {/* Policy & Practice */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono font-sans">Dopady na rodinnou politiku a soudní praxi</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-serif">
                      {TRANSLATED_STUDIES[selectedStudy].policyImplications}
                    </p>
                  </div>

                  {/* Final Conclusion Block */}
                  <div className="bg-[#FAF9F5] border border-[#EBE7E0] p-6 rounded-xl space-y-2 font-sans text-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">Závěr a shrnutí studie</h4>
                    <p className="text-slate-800 text-xs leading-relaxed font-serif italic max-w-2xl mx-auto">
                      {TRANSLATED_STUDIES[selectedStudy].conclusions}
                    </p>
                  </div>

                  {/* Section by Section Full Breakdown */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono font-sans">Detailní struktura a kapitoly studie:</h4>
                    <div className="space-y-4">
                      {TRANSLATED_STUDIES[selectedStudy].sections.map((section, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <h5 className="font-bold text-slate-900 text-xs font-sans">{section.title}</h5>
                          <p className="text-xs text-slate-700 leading-relaxed font-serif">{section.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}

            </div>
          </div>

          {/* Myths vs Science Bento Grid */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Mýty opatrovnických soudů vs. Vědecká fakta</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-3">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Mýtus o nízkém věku</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "Dítě je příliš malé (např. pod 2 roky) nebo je stále kojeno, proto nemůže spát u otce a střídavá péče nepřichází v úvahu."
                </p>
                <div className="border-t border-slate-50 pt-3 text-xs text-teal-700 font-semibold space-y-1">
                  <span className="text-[10px] font-mono text-teal-600 uppercase block font-bold">Vědecký fakt:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Kojení ani batolecí věk nejsou překážkou přespávání. Fabricius (2016) dokázal, že přespávání od narození (pod 1 rok) přináší silné dlouhodobé výhody pro vztahy s oběma rodiči a vztah s matkou nijak netrpí.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-3">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Mýtus o jediné matce</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "Malé dítě je biologicky nastaveno tak, že má mít pouze jednoho primárního pečovatele (matku) a delší separace ho poškozuje."
                </p>
                <div className="border-t border-slate-50 pt-3 text-xs text-teal-700 font-semibold space-y-1">
                  <span className="text-[10px] font-mono text-teal-600 uppercase block font-bold">Vědecký fakt:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Teorie monotropie byla vědecky vyvrácena. Děti si vytvářejí paralelní, stejně hluboké citové vazby k matce i k otci současně. Omezení styku s otcem na pouhé dny bez přespávání rodící se vazbu k otci naopak trvale devastuje (Warshak, 2014).
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-3">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Mýtus o nutné dohodě</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "Střídavá péče vyžaduje naprostý soulad a dohodu rodičů. Pokud se rodiče hádají nebo matka střídavku odmítá, není možná."
                </p>
                <div className="border-t border-slate-50 pt-3 text-xs text-teal-700 font-semibold space-y-1">
                  <span className="text-[10px] font-mono text-teal-600 uppercase block font-bold">Vědecký fakt:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Soudem nařízená střídavá péče má prokazatelné přínosy i tam, kde rodiče zpočátku nesouhlasili nebo panoval vysoký konflikt. Odepření střídavé péče kvůli konfliktu naopak motivuje matky k záměrnému udržování sporu (Warshak, 2014).
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'methodologies' && (
        /* METHODOLOGIES & DEFENSE TAB */
        <div className="space-y-8 animate-fadeIn animate-duration-300">
          
          {/* Section Header Card */}
          <div className="bg-slate-900 text-slate-100 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12 select-none">
              <Scale className="w-96 h-96 text-amber-500" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                  Procesní obrana otce
                </span>
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
                Jak se bránit zastaralým posudkům a předsudkům OSPODu
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                Opatrovnické soudy a OSPOD se v České republice často opírají o zastaralé znalecké posudky nebo metodiky, které neodpovídají moderní vývojové psychologii ani závazné judikatuře Ústavního soudu ČR. Namísto pokusů o paušální "zákazy" institucí je nejúčinnější cestou <strong>aktivní, věcné a procesní napadání nekompetentních tvrzení, dogmat a metodických pochybení</strong> přímo v soudním řízení.
              </p>
            </div>
          </div>

          {/* Interactive Dogma & Blacklist Analyzer */}
          <div className="space-y-4">
            <h3 className="text-md font-bold font-display text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Blacklist opatrovnických dogmat & Vědecká diskreditace
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              Níže uvádíme nejčastější manipulativní argumenty, které sociální pracovnice a zastaralí znalci používají k omezení práv otců a dětí. Klikněte na konkrétní dogma a získáte okamžité vědecké vyvrácení i přesnou právní argumentaci k použití u soudu.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              
              {/* Sibling bond split */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Závažné pochybení</span>
                    <span className="text-[10px] text-slate-400">Judikatura ÚS</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Dogma: Rozdělení sourozenců nebo asymetrická péče</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50/50 p-2 rounded">
                    "Mladší kojenec/batole musí být z důvodu věku převážně u matky, zatímco starší sourozenec má střídavou péči. Rozdílný režim sourozencům nevadí."
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    <strong>Vědecká a právní diskreditace:</strong> Rozdělování sourozenců nebo vytváření asymetrického režimu, kdy se bratři potkávají jen minimálně, hrubě poškozuje jejich základní psychologické potřeby a právo na rodinný život. Ústavní soud ČR (nález sp. zn. II. ÚS 1762/20 a II. ÚS 2146/21) jasně definuje, že sourozenecká vazba je integrální součástí práva na rodinný život a její svévolné narušení ze strany OSPOD či soudů prvního stupně je neústavní.
                  </p>
                </div>
                <div className="bg-teal-50/30 border border-teal-100/50 p-3 rounded-xl mt-3 text-[10.5px] text-teal-900 leading-relaxed">
                  <strong className="text-teal-900 font-mono text-[9px] block uppercase font-bold tracking-wider mb-1">Právní formulace pro podání:</strong>
                  <p className="italic font-serif text-[10.5px]">
                    "Soud prvního stupně zcela pominul existenci staršího sourozence a navrhl rozvrh, který bratry od sebe stoprocentně a permanentně izoluje. Rozhodnutím soudu dochází k umělému a úplnému separování obou bratrů, což je v přímém rozporu s konstantní judikaturou Ústavního soudu ČR (nález sp. zn. II. ÚS 2146/21), která stanovuje, že právo na rozvoj sourozeneckých vazeb je integrální součástí nejlepšího zájmu dětí a práva na rodinný život."
                  </p>
                </div>
              </div>

              {/* Age overnight restriction */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Metodický předsudek</span>
                    <span className="text-[10px] text-slate-400">Warshak & Fabricius</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Dogma: Omezení přespávání (overnights) dětí pod 3 roky</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50/50 p-2 rounded">
                    "Dítě pod 3 roky věku (nebo dokonce pod 1 rok) je příliš malé na to, aby přespávalo u otce. Nocování u otce poškozuje vazbu na matku."
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    <strong>Vědecká a právní diskreditace:</strong> Mezinárodní vědecký konsenzus (reprezentovaný zprávou prof. Warshaka podepsanou 110 světovými experty a 20letou retrospektivní studií prof. Fabriciuse) jednoznačně dokázal, že přespávání u otců od útlého věku (včetně dětí pod 1 rok) je pro rozvoj otcovského pouta klíčové a nijak nepoškozuje vazbu k matce. Odkládání nocování naopak způsobuje v psychice dětí nevratný deficit, který se projevuje oslabením vztahů v dospělosti.
                  </p>
                </div>
                <div className="bg-teal-50/30 border border-teal-100/50 p-3 rounded-xl mt-3 text-[10.5px] text-teal-900 leading-relaxed">
                  <strong className="text-teal-900 font-mono text-[9px] block uppercase font-bold tracking-wider mb-1">Právní formulace pro podání:</strong>
                  <p className="italic font-serif text-[10.5px]">
                    "Odepření přespávání nezletilého u otce s paušálním odkazem na nízký věk dítěte a nutnost neustálé přítomnosti matky je vědecky neudržitelným předsudkem, který odporuje mezinárodnímu vědeckému konsenzu (Warshak, 2014) i empirickým datům (Fabricius, 2016). Tyto studie jednoznačně prokazují, že noční péče otce (večerní a ranní rituály) je pro budování bezpečné citové vazby (attachmentu) klíčová a přináší dítěti dlouhodobé emocionální benefity bez jakéhokoliv ohrožení vztahu s matkou."
                  </p>
                </div>
              </div>

              {/* No overnights in conflict */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Manipulace konfliktem</span>
                    <span className="text-[10px] text-slate-400">Ústavní soud sp. zn. I. ÚS 1554/14</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Dogma: Střídavá péče není možná při konfliktu rodičů</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50/50 p-2 rounded">
                    "Rodiče nejsou schopni se dohodnout, panuje mezi nimi silný konflikt, matka střídavou péči zásadně odmítá, proto střídavka není možná."
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    <strong>Vědecká a právní diskreditace:</strong> Odepření střídavé péče s odkazem na konflikt rodičů motivuje nespolupracujícího rodiče (nejčastěji matku) k záměrnému udržování a eskalaci napětí, protože tím získává "veto" nad střídavou péčí. Ústavní soud ČR v řadě nálezů (např. sp. zn. I. ÚS 1554/14, I. ÚS 2482/18) výslovně zdůrazňuje, že nesouhlas jednoho z rodičů nemůže střídavou péči bez dalšího vyloučit. Pokud rodič střídavou péči odmítá, musí soud zkoumat, zda nejde o svévolné maření ze strany jednoho rodiče.
                  </p>
                </div>
                <div className="bg-teal-50/30 border border-teal-100/50 p-3 rounded-xl mt-3 text-[10.5px] text-teal-900 leading-relaxed">
                  <strong className="text-teal-900 font-mono text-[9px] block uppercase font-bold tracking-wider mb-1">Právní formulace pro podání:</strong>
                  <p className="italic font-serif text-[10.5px]">
                    "Odmítání střídavé péče ze strany matky a poukazování na neexistující dohodu či konflikt rodičů nemůže být důvodem k omezení práv otce a dítěte. Podle konstantní judikatury Ústavního soudu ČR (např. nález sp. zn. I. ÚS 1554/14) nesmí soudy střídavou péči vyloučit pouze na základě nesouhlasu matky, neboť by tím byl vytvořen nepřípustný precedent, kdy jednostranná obstrukce a neochota komunikovat ze strany jednoho rodiče vede k faktickému vyloučení rodiče druhého z výchovy."
                  </p>
                </div>
              </div>

              {/* Manipulation through illness */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Zneužití nemoci</span>
                    <span className="text-[10px] text-slate-400">Ustanovení § 890 OZ</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Dogma: Nemocné dítě musí zůstat výhradně u matky</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50/50 p-2 rounded">
                    "Dítě má rýmu / neštovice / horečku, proto se styk s otcem ruší a dítě se nikam nepřepravuje. Otec nemá právo na péči, dokud se dítě neuzdraví."
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    <strong>Vědecká a právní diskreditace:</strong> Nemoc dítěte nesmí sloužit jako záminka k maření péče a izolaci dítěte od otce. Oba rodiče mají stejné právo i povinnost o nemocné dítě pečovat. Pokud styk vyžaduje transport, který by dítěti škodil, má se aktivovat pravidlo rekonvalescence v místě, kde nemoc propukla, případně má otec vykonat péči přímo u matky (či naopak) tak, aby se zachoval kontakt a minimalizoval se transport. Maření kontaktu z důvodu nemoci bez nabídky náhradního řešení či přístupu otce k dítěti je v přímém rozporu s § 890 občanského zákoníku.
                  </p>
                </div>
                <div className="bg-teal-50/30 border border-teal-100/50 p-3 rounded-xl mt-3 text-[10.5px] text-teal-900 leading-relaxed">
                  <strong className="text-teal-900 font-mono text-[9px] block uppercase font-bold tracking-wider mb-1">Právní formulace pro podání:</strong>
                  <p className="italic font-serif text-[10.5px]">
                    "Matka jednostranným zmařením dohodnuté péče z důvodu nemoci syna a odmítnutím mého vstupu do bydliště k osobní péči o nemocné dítě hrubě porušila ustanovení § 890 občanského zákoníku, které oběma rodičům ukládá vzájemnou informační povinnost a součinnost. Nemoc syna nemůže sloužit jako mocenský nástroj k jeho izolaci od otce, který disponuje plnou výchovnou a ošetřovatelskou způsobilostí a je schopen synovi zajistit adekvátní klidový režim i lékařskou péči."
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Practical steps for judicial disqualification */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold font-display text-slate-800 flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-teal-600" />
              Procesní kroky k diskvalifikaci zastaralých znaleckých posudků
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">KROK 1</span>
                <h4 className="text-xs font-bold text-slate-800">Revizní znalecký posudek</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pokud je posudek místního znalce zjevně jednostranný, plný genderových předsudků či ignoruje sourozenecké vazby, navrhněte vypracování <strong>revizního znaleckého posudku</strong> nezávislým znalcem z jiného kraje (např. znaleckým ústavem či univerzitním pracovištěm).
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">KROK 2</span>
                <h4 className="text-xs font-bold text-slate-800">Námitka podjatosti vůči znalci</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pokud znalec při vyšetření nebo ve svém posudku bagatelizuje roli otce, pronáší diskriminační výroky o "matce jako hlavní biologické osobě" nebo odmítá zkoumat vaše výchovné zázemí, ihned v zákonné lhůtě vzneste <strong>námitku podjatosti znalce</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">KROK 3</span>
                <h4 className="text-xs font-bold text-slate-800">Kritika metodiky a testování</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Zkoumejte, jaké konkrétní testy znalec použil. Zastaralí znalci často používají šablonovité psychologické testy staré 20 a více let, které nereflektují moderní vědu. V písemném vyjádření metodiku metodologicky napadněte s odkazem na nejnovější standardy.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">KROK 4</span>
                <h4 className="text-xs font-bold text-slate-800">Stížnost k Ministerstvu spravedlnosti</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pokud se znalec dopustil závažného pochybení (např. lživá tvrzení, hrubá manipulace s daty či vynechání zásadních informací z dokumentace), podejte podrobný podnět a stížnost přímo k <strong>Ministerstvu spravedlnosti ČR</strong>, které dohlíží na činnost soudních znalců.
                </p>
              </div>
            </div>
          </div>

          {/* Constitutional Court Summary Info */}
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex gap-4">
            <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-900 text-xs font-display">Základní rada pro komunikaci u soudu: Věcnost namísto emocí</h4>
              <p className="text-amber-800 text-xs leading-relaxed">
                Nekritizujte znalce či sociální pracovnice OSPOD na osobní rovině. Vždy poukazujte na <strong>věcná a metodická pochybení</strong> v jejich zprávách. Ukažte rozpor mezi jejich tvrzeními a doloženými vědeckými studiemi (Warshak, Fabricius) či judikáty Ústavního soudu. Soudce musí slyšet právní a věcnou argumentaci, nikoliv emoce naštvaného rodiče. Tímto přístupem se stanete pro opatrovnickou mašinérii procesně mimořádně nebezpečným a respektovaným partnerem.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
