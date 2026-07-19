import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { translateText } from '../data/dynamicTranslations';
import { 
  Map, 
  Clock, 
  Milestone, 
  Calendar, 
  Code, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Shield, 
  ArrowRight, 
  Compass, 
  HelpCircle, 
  Activity, 
  FileText, 
  MessageSquare, 
  Users, 
  Scale, 
  CheckCircle2, 
  Hourglass, 
  Cpu, 
  Eye, 
  Network,
  Sliders
} from 'lucide-react';

interface SitemapTimelineProps {
  setActiveTab: (tab: string) => void;
  onOpenGlossary: () => void;
  currentUser: any;
}

interface TimelineEvent {
  date: string;
  title: string;
  category: 'Právní/Obsah' | 'Vlastní vývoj' | 'AI & Integrace' | 'Komunita';
  status: 'completed' | 'current' | 'future';
  description: string;
  details: string[];
  techStack?: string[];
}

export default function SitemapTimeline({ setActiveTab, onOpenGlossary, currentUser }: SitemapTimelineProps) {
  const { language } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  // Timeline events representing history from koncept in early 2025/2026 to current July 2026 and future 2026+
  const timelineEventsRaw: TimelineEvent[] = [
    {
      date: 'Leden 2026',
      title: 'Zrození myšlenky & Návrh Synthesis OS',
      category: 'Právní/Obsah',
      status: 'completed',
      description: 'Zahájení výzkumu v oblasti opatrovnického práva na základě vlastních negativních zkušeností se soudním aparátem a OSPOD.',
      details: [
        'Zformulování Manifestu tátů a blaha dětí jako základní listiny projektu.',
        'Analýza nejčastějších pochybení úřadů a chybějící podpory pro osamělé otce.',
        'První specifikace architektury autonomního systému Synthesis OS.'
      ],
      techStack: ['Brainstorming', 'Figma', 'Právní rešerše']
    },
    {
      date: 'Březen 2026',
      title: 'Spuštění verze Alpha & Vzory podání',
      category: 'Vlastní vývoj',
      status: 'completed',
      description: 'První veřejný prototyp webu nabízející základní bezplatné vzory žalob, vyjádření k soudu a návrhů na střídavou péči.',
      details: [
        'Nasazení responsivního rozhraní s čistým designem bez rušivých prvků.',
        'Zavedení sekce "Ke stažení" se 12 klíčovými právními vzory (návrh na úpravu poměrů, stížnosti na OSPOD).',
        'Zabezpečení přenosu a lokální persistence pro bezpečné úpravy dokumentů přímo v prohlížeči.'
      ],
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite']
    },
    {
      date: 'Květen 2026',
      title: 'Komunitní fórum, Příběhy tátů a Firebase synchronizace',
      category: 'Komunita',
      status: 'completed',
      description: 'Vytvoření bezpečného prostoru pro sdílení zkušeností. Otcové mohou anonymně psát své příběhy z opatrovnických bojů.',
      details: [
        'Implementace diskuzního fóra se strukturou kategorií a možností označovat komentáře k vyřešení.',
        'Sekce "Příběhy tátů" s možností sdílet nezkreslenou realitu soudních procesů pod pseudonymem.',
        'Propojení na Firebase pro bezpečné, bleskové ukládání příspěvků a uživatelskou autentizaci.'
      ],
      techStack: ['Firebase Firestore', 'Firebase Auth', 'Local Storage Encryption']
    },
    {
      date: 'Červen 2026',
      title: 'Interaktivní Kalkulačka Výživného & Judikatura',
      category: 'Vlastní vývoj',
      status: 'completed',
      description: 'Vývoj pokročilých nástrojů pro simulaci finančních nákladů a právní argumentaci u soudu.',
      details: [
        'Vydání kalkulačky výživného zohledňující nejnovější tabulky a doporučení Ministerstva spravedlnosti pro rok 2026.',
        'Spuštění integrovaného průvodce judikaturou Ústavního a Nejvyššího soudu s klíčovými precedenty pro střídavou péči.',
        'Zprovoznění interaktivního krizového plánu pro akutní situace (např. jednostranné odepření styku s dítětem).'
      ],
      techStack: ['Tailwind UI', 'MathJS Formula Parsing', 'Precedent Analyzer Engine']
    },
    {
      date: 'Červenec 2026 (Aktuální fáze)',
      title: 'Integrace Supabase & Příprava na Autonomní AI Správu',
      category: 'AI & Integrace',
      status: 'current',
      description: 'Zavedení nového hybridního databázového propojení (Supabase) a plná integrace s AI asistentem.',
      details: [
        'Zprovoznění pokročilého modulu Supabase s plnou synchronizací lokálních tabulek pro odolnost vůči výpadkům sítě.',
        'Implementace sémantického AI Průvodce a chatovacího Synthesis asistenta využívajícího LLM pro analýzu podání.',
        'Nasazení auditního protokolu (Audit Ledger) s neměnným hashováním, připraveného pro autonomní AI moderaci.',
        'Vytvoření Spolurodičovského centra (CoParent Hub) pro sdílenou správu kalendáře dětí, výdajů a školních aktivit.'
      ],
      techStack: ['Supabase Auth & PostgreSQL', 'Gemini AI API SDK', 'CryptoJS SHA-256 Ledger']
    },
    {
      date: 'Podzim 2026 (Plánováno)',
      title: 'Autonomní AI Admin (Synthesis OS Agent)',
      category: 'AI & Integrace',
      status: 'future',
      description: 'Nasazení plně autonomní AI instance pro správu, čištění a moderaci obsahu na základě sémantické analýzy.',
      details: [
        'AI agent bude automaticky vyhodnocovat tón diskuzí, odstraňovat toxický nebo protiprávní obsah a kategorizovat dotazy.',
        'Automatická detekce manipulace a nepravdivých tvrzení na základě právních databází.',
        'Zpřístupnění plnohodnotného API-first rozhraní, které umožní lokálním AI agentům plně spravovat příspěvky.'
      ],
      techStack: ['Autonomous Agents API', 'Vector Databases', 'Semantic Search & Guardrails']
    },
    {
      date: 'Rok 2027 a dále',
      title: 'Celorepubliková platforma & Právní zastoupení',
      category: 'Právní/Obsah',
      status: 'future',
      description: 'Expanze projektu do podoby plně integrovaného právně-sociálního portálu s celorepublikovým dopadem.',
      details: [
        'Zprovoznění sítě spolupracujících advokátů specializovaných na práva otců a rovné rodičovství.',
        'Spuštění automatických žalobních generátorů napojených přímo na datové schránky uživatelů.',
        'Spolupráce se zákonodárci na úpravě opatrovnické legislativy směrem k automatické střídavé péči jako výchozímu stavu.'
      ],
      techStack: ['Datové schránky API', 'Digital Legal Assistant', 'Synthesis OS Core Hub']
    }
  ];

  // Dynamic localized timeline events
  const timelineEvents = React.useMemo(() => {
    return timelineEventsRaw.map(event => ({
      ...event,
      date: translateText(event.date, language),
      title: translateText(event.title, language),
      description: translateText(event.description, language),
      details: event.details.map(d => translateText(d, language)),
      techStack: event.techStack?.map(t => translateText(t, language))
    }));
  }, [timelineEventsRaw, language]);

  const categories = [
    { id: 'all', label: translateText('Všechny události', language) },
    { id: 'Právní/Obsah', label: translateText('Právní & Obsah', language) },
    { id: 'Vlastní vývoj', label: translateText('Technický Vývoj', language) },
    { id: 'AI & Integrace', label: translateText('AI & Integrace', language) },
    { id: 'Komunita', label: translateText('Komunita & Lidé', language) }
  ];

  const filteredEvents = filterCategory === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(e => e.category === filterCategory);

  // Categories for sitemap representation with precise development statuses and phase details
  const sitemapSectionsRaw = [
    {
      title: 'Opatrovnický Průvodce',
      description: 'Odborné a praktické sekce s návody a postupy',
      icon: <Scale className="w-5 h-5 text-indigo-500" />,
      color: 'border-indigo-100 bg-indigo-50/20 text-indigo-900',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      items: [
        { 
          name: 'Soudní řízení krok za krokem', 
          tab: 'opatrovnicka-agenda', 
          desc: 'Kompletní přehled fází řízení, příprava na soud a psychologická strategie.', 
          icon: <Scale className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.1'
        },
        { 
          name: 'OSPOD & Sociální služby', 
          tab: 'opatrovnicka-agenda', 
          desc: 'Jak bezpečně jednat s kolizním opatrovníkem a vaše ústavní práva při šetření.', 
          icon: <Shield className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.1'
        },
        { 
          name: 'Péče o dítě & Střídavka', 
          tab: 'plan-pece', 
          desc: 'Argumentace pro střídavou péči, psychologie vývoje dětí a vzorové scénáře.', 
          icon: <Users className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.2'
        },
        { 
          name: 'Výpočet výživného (Alimenty)', 
          tab: 'opatrovnicka-agenda', 
          desc: 'Zabudovaný simulátor nákladů podle nejnovějších schválených tabulek MSp ČR.', 
          icon: <Activity className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.2'
        },
        { 
          name: 'Vzory dokumentů ke stažení', 
          tab: 'ke-stazeni', 
          desc: 'Profesionálně připravené žaloby, odvolání a vyjádření ke stažení v DOCX.', 
          icon: <FileText className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.0'
        },
        { 
          name: 'Precedenty & Judikatura', 
          tab: 'judikatura', 
          desc: 'Klíčové nálezy Ústavního a Nejvyššího soudu ČR na ochranu tátů.', 
          icon: <BookOpen className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.1'
        }
      ]
    },
    {
      title: 'Komunita & Podpora',
      description: 'Zázemí a interakce pro osamělé rodiče',
      icon: <Users className="w-5 h-5 text-teal-500" />,
      color: 'border-teal-100 bg-teal-50/20 text-teal-900',
      badgeColor: 'bg-teal-100 text-teal-800',
      items: [
        { 
          name: 'Komunitní diskuzní fórum', 
          tab: 'forum', 
          desc: 'Bezpečné a moderované fórum s dělením témat a řešením dotazů.', 
          icon: <MessageSquare className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.5'
        },
        { 
          name: 'Osobní příběhy tátů', 
          tab: 'stories', 
          desc: 'Nefiltrovaná mementa a reálné zkušenosti otců z opatrovnických řízení.', 
          icon: <BookOpen className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.0'
        },
        { 
          name: 'Rychlá právní poradna (Dotazy)', 
          tab: 'advice', 
          desc: 'Seznam zodpovězených klíčových dotazů s vyhledáváním a sémantickou vazbou.', 
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.2'
        },
        { 
          name: 'Krizový akční plán (SOS)', 
          tab: 'crisis', 
          desc: 'Okamžitá krizová pomoc při odepření styku s dětmi nebo psychickém kolapsu.', 
          icon: <Activity className="w-3.5 h-3.5 text-rose-500" />, 
          highlight: true,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.1'
        }
      ]
    },
    {
      title: 'Chytré Nástroje & Portál',
      description: 'Pokročilé integrace pod záštitou Synthesis OS',
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      color: 'border-purple-100 bg-purple-50/20 text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-800',
      items: [
        { 
          name: 'Simulátor péče & sourozenců', 
          tab: 'plan-pece', 
          desc: 'Interaktivní simulátor střídání péče, výpočtu intervalů a správy sourozenců.', 
          icon: <Sliders className="w-3.5 h-3.5 text-teal-600" />, 
          highlight: true,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.5'
        },
        { 
          name: 'Spolurodičovský Hub (CoParent)', 
          tab: 'coparent-hub', 
          desc: 'Sdílený kalendář pro plynulé předávání dětí, přehled plateb a úkolů.', 
          icon: <Network className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.3'
        },
        { 
          name: 'Sémantický AI Průvodce řízením', 
          tab: 'ai-guide', 
          desc: 'AI generátor opatrovnické strategie na základě specifického zadání případu.', 
          icon: <Cpu className="w-3.5 h-3.5 text-purple-600" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.2'
        },
        { 
          name: 'Moje Pracovna (Uživ. Portál)', 
          tab: 'user-portal', 
          desc: 'Správa osobních úkolů, uložených dokumentů, poznámek a přípravy na soud.', 
          icon: <Compass className="w-3.5 h-3.5" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.1'
        },
        { 
          name: 'Osobní složka případu & AI Strategický asistent', 
          tab: 'user-portal', 
          desc: 'Plně funkční modul s integrací Gemini 3.5/2.5 Flash pro sémantický popis doložených dokumentů, automatický výtah a typování poznámek.', 
          icon: <Cpu className="w-3.5 h-3.5 text-indigo-500" />,
          highlight: true,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.5'
        },
        { 
          name: 'Podpořit projekt (Dary)', 
          tab: 'support', 
          desc: 'Integrovaný transparentní panel se seznamem sponzorů a možností podpory.', 
          icon: <Heart className="w-3.5 h-3.5 text-rose-500" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.0'
        }
      ]
    },
    {
      title: 'Odborná Akademie & Databáze',
      description: 'Pokročilé právní nástroje a edukační podpora',
      icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
      color: 'border-emerald-100 bg-emerald-50/20 text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      items: [
        { 
          name: 'Interaktivní Formuláře (Chytrý editor)', 
          tab: 'centrum-formularu', 
          desc: 'Průvodce sestavením bezchybného podání nebo odvolání s kontrolou náležitostí.', 
          icon: <FileText className="w-3.5 h-3.5 text-indigo-600" />, 
          highlight: true,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.2'
        },
        { 
          name: 'Případová Databáze rozsudků', 
          tab: 'pripadova-databaze', 
          desc: 'Katalog precedenčních rozsudků seřazených podle taktiky a věku dětí.', 
          icon: <Scale className="w-3.5 h-3.5 text-teal-600" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.1'
        },
        { 
          name: 'Knihovna vědeckých studií', 
          tab: 'knihovna-studii', 
          desc: 'Kompletní argumentační zdroje z oborů psychologie, lékařství a sociologie.', 
          icon: <BookOpen className="w-3.5 h-3.5 text-indigo-600" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.1'
        },
        { 
          name: 'Akademie tátů (Právní kvízy)', 
          tab: 'vzdelavani', 
          desc: 'Edukační kvízy a zátěžové scénáře pro nácvik verbální obhajoby u soudu.', 
          icon: <Sliders className="w-3.5 h-3.5 text-emerald-600" />,
          status: 'stable',
          statusLabel: 'Plně funkční',
          version: 'V1.2'
        }
      ]
    }
  ];

  // Dynamic localized sitemap sections
  const sitemapSections = React.useMemo(() => {
    return sitemapSectionsRaw.map(section => ({
      ...section,
      title: translateText(section.title, language),
      description: translateText(section.description, language),
      items: section.items.map(item => ({
        ...item,
        name: translateText(item.name, language),
        desc: translateText(item.desc, language),
        statusLabel: translateText(item.statusLabel, language)
      }))
    }));
  }, [sitemapSectionsRaw, language]);

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'stable':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
      case 'beta':
        return 'bg-amber-50 text-amber-700 border-amber-200/50';
      case 'integration':
        return 'bg-sky-50 text-sky-700 border-sky-200/50';
      case 'planned':
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200/50';
    }
  };

  return (
    <div className="space-y-12 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="sitemap-timeline-view">
      
      {/* Visual Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-full text-xs font-mono text-teal-400">
            <Map className="w-3.5 h-3.5" />
            <span>{translateText('Mapa Portálu & Časová Osa', language)}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-display text-white">
            {translateText('Architektura & Vývoj Synthesis OS', language)}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            {translateText('Vítejte v technologickém zázemí portálu Táta má právo. Tato speciální skrytá sekce (přístupná pouze z paty webu) slouží jako transparentní sitemap rozcestník a časový deník (Roadmap) celého projektu od počátečních vizí po nasazení autonomních AI systémů.', language)}
          </p>
          
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('sitemap-section-block');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-900/20 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              {translateText('Sitemap Portálu', language)}
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('timeline-section-block');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-slate-400" />
              {translateText('Časová osa vývoje', language)}
            </button>
          </div>
        </div>
      </div>

      {/* Synthesis OS Core System Status Summary Dashboard */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6" id="synthesis-architecture-status-dashboard">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider font-mono">
              {translateText('Systémový audit', language)}
            </span>
            <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600 animate-pulse" />
              {translateText('Aktuální stav & Architektura Synthesis OS Core', language)}
            </h3>
          </div>
          <div className="text-left md:text-right">
            <span className="text-xs text-slate-500 block">{translateText('Celkový stav platformy:', language)}</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              92% {translateText('Funkčnost (V1.2 Stable Prod)', language)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 space-y-2 shadow-3xs hover:border-indigo-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase">{translateText('Produkční Moduly', language)}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-extrabold text-slate-800 font-display">14 / 18</p>
              <p className="text-[10px] text-slate-400">{translateText('Plně funkčních, otestovaných a nasazených modulů v produkci.', language)}</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 space-y-2 shadow-3xs hover:border-indigo-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-teal-500 uppercase">{translateText('Databáze & Ledger', language)}</span>
              <Network className="w-4 h-4 text-teal-500 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-extrabold text-slate-800 font-display">{translateText('Aktivní', language)}</p>
              <p className="text-[10px] text-slate-400">{translateText('Duální vrstva Firestore & Supabase PostgreSQL s auditním ledgerem.', language)}</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 space-y-2 shadow-3xs hover:border-indigo-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">{translateText('Vývoj & Beta', language)}</span>
              <Hourglass className="w-4 h-4 text-amber-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-extrabold text-slate-800 font-display">4 {translateText('Moduly', language)}</p>
              <p className="text-[10px] text-slate-400">{translateText('V beta testování a průběžném vylepšování pro plnou automatizaci.', language)}</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 space-y-2 shadow-3xs hover:border-indigo-100 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-purple-500 uppercase">{translateText('AI Orchestrátor', language)}</span>
              <Sparkles className="w-4 h-4 text-purple-500 animate-bounce" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-extrabold text-slate-800 font-display">{translateText('Připraven', language)}</p>
              <p className="text-[10px] text-slate-400">{translateText('Gemini 1.5 Flash SDK plně integrované pro sémantickou analýzu.', language)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* SECTION 1: MAPA STRÁNKY (SITEMAP) */}
      <div id="sitemap-section-block" className="space-y-6 scroll-mt-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg"><Map className="w-5 h-5" /></span>
            {translateText('Strukturální Mapa Portálu (Sitemap)', language)}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {translateText('Kliknutím na jakoukoliv sekci níže budete okamžitě přesměrováni do daného funkčního modulu. Všechny komponenty jsou dynamicky provázané.', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sitemapSections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${section.color.split(' ')[1]} ${section.color.split(' ')[2]}`}>
                    {section.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-slate-800">{section.title}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{section.description}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {section.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx}
                      onClick={() => setActiveTab(item.tab)}
                      className={`group p-2.5 rounded-xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-all flex items-start gap-2.5 ${item.highlight ? 'bg-rose-50/30 border-rose-100/50 hover:bg-rose-50/60' : ''}`}
                    >
                      <div className={`mt-0.5 p-1 rounded-md ${item.highlight ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600'} transition-colors`}>
                        {item.icon}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-bold text-slate-700 group-hover:text-teal-700 transition-colors ${item.highlight ? 'text-rose-800' : ''}`}>
                            {item.name}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        
                        {/* Development Phase / Status Indicator */}
                        <div className="flex flex-wrap items-center gap-1">
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-md border ${getStatusBadgeClass(item.status)} uppercase tracking-wider`}>
                            {item.statusLabel}
                          </span>
                          {item.version && (
                            <span className="text-[8px] font-mono font-medium text-slate-400 bg-slate-50 border border-slate-100 px-1 py-0.2 rounded">
                              {item.version}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 leading-normal pt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick info block inside card */}
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{translateText('Modulární architektura', language)}</span>
                <span className={`px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider text-[8px] ${section.badgeColor}`}>
                  {translateText('Aktivní API', language)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Global Floating Elements inside Sitemap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={onOpenGlossary}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-slate-100/70 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-600 text-white rounded-xl">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-left space-y-0.5">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">{translateText('Odborný slovník pojmů', language)}</h4>
                <p className="text-[11px] text-slate-500">
                  {translateText('Definice pojmů jako syndrom zavrženého rodiče, střídavá péče, kolizní opatrovník OSPOD apod.', language)}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <div 
            onClick={() => setActiveTab('admin')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-slate-100/70 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-950 text-white rounded-xl">
                <Shield className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-left space-y-0.5">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  {translateText('Administrační rozhraní', language)}
                  {currentUser?.role === 'admin' && (
                    <span className="bg-emerald-500 text-white text-[8px] px-1.5 py-0.2 rounded font-sans uppercase">{translateText('Aktivní', language)}</span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {translateText('Přihlášení administrátora, schvalování nahlášeného obsahu a auditní záznamy pro AI Admina.', language)}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* SECTION 2: ČASOVÁ OSA VÝVOJE (PROJECT TIMELINE) */}
      <div id="timeline-section-block" className="space-y-6 scroll-mt-6 pt-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg"><Clock className="w-5 h-5" /></span>
              {translateText('Časová Osa Vývoje & Roadmapa', language)}
            </h2>
            <p className="text-xs text-slate-500">
              {translateText('Historie verzí, milníky, současný stav a budoucí autonomní plány pro rozvoj ekosystému Synthesis OS.', language)}
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
                  filterCategory === cat.id 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Timeline Tree */}
        <div className="relative border-l-2 border-slate-100 ml-4 md:ml-32 space-y-8 py-4">
          {filteredEvents.map((event, index) => {
            const isCompleted = event.status === 'completed';
            const isCurrent = event.status === 'current';
            const isFuture = event.status === 'future';
            const isExpanded = expandedEvent === index;

            return (
              <div key={index} className="relative group pl-6 md:pl-10">
                
                {/* Year/Month Badge on Left for Desktop */}
                <div className="hidden md:block absolute right-full mr-10 top-1 text-right w-24">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                    isCurrent ? 'text-teal-600 font-extrabold' : 'text-slate-400'
                  }`}>
                    {event.date}
                  </span>
                  <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block">
                    {event.category}
                  </span>
                </div>

                {/* Timeline Pin/Dot */}
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 ring-4 ring-emerald-50' 
                    : isCurrent
                      ? 'bg-white border-teal-500 ring-4 ring-teal-100 animate-pulse'
                      : 'bg-white border-slate-300 ring-4 ring-slate-50'
                }`}>
                  {isCompleted && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                  {isCurrent && <Hourglass className="w-2.5 h-2.5 text-teal-600 animate-spin" />}
                  {isFuture && <div className="w-1 h-1 bg-slate-400 rounded-full" />}
                </div>

                {/* Event Card Content */}
                <div className={`bg-white rounded-2xl border transition-all p-5 md:p-6 space-y-3 ${
                  isCurrent 
                    ? 'border-teal-500/80 shadow-md shadow-teal-500/5' 
                    : 'border-slate-100 shadow-3xs hover:border-slate-200'
                }`}>
                  {/* Category & Date badge on mobile */}
                  <div className="flex md:hidden items-center justify-between text-[10px] font-bold text-slate-400 pb-2 border-b border-slate-50">
                    <span className="font-mono">{event.date}</span>
                    <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`font-bold text-sm md:text-base ${
                          isCurrent ? 'text-teal-900' : 'text-slate-800'
                        }`}>
                          {event.title}
                        </h3>
                        {isCurrent && (
                          <span className="bg-teal-100 text-teal-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                            Aktuální milník
                          </span>
                        )}
                        {isFuture && (
                          <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Připravuje se
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <button
                      onClick={() => setExpandedEvent(isExpanded ? null : index)}
                      className="text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {isExpanded ? 'Skrýt detail' : 'Zobrazit detaily'}
                    </button>
                  </div>

                  {/* Expanded Detailed Content */}
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-slate-100 pt-3 mt-3 space-y-3 text-xs text-slate-600"
                    >
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-400">Specifické cíle & úspěchy:</h4>
                      <ul className="space-y-2">
                        {event.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                            <span className="leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {event.techStack && (
                        <div className="pt-2">
                          <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">Technologické zázemí:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {event.techStack.map((tech, tIdx) => (
                              <span key={tIdx} className="bg-slate-100 text-slate-600 font-mono text-[10px] px-2 py-0.5 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Synthesis OS Autonomous System Note */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base font-display">Architektonický rámec Synthesis OS</h3>
            <p className="text-[10px] text-teal-400 font-mono uppercase tracking-wider">AI-First autonomní správa obsahu</p>
          </div>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed">
          Tento portál byl od prvního dne navržen pro plynulou automatizaci. Každý formulář, diskuzní vlákno i stahování vzorů komunikuje přes vyhrazené sémantické vrstvy, které umožňují autonomním AI agentům provádět rutinní kontroly, auditovat změny právních předpisů a aktualizovat vzory podání v reálném čase. Tím garantujeme, že rodinní příslušníci mají vždy k dispozici nejrelevantnější data nezávisle na manuální práci programátorů.
        </p>
      </div>

    </div>
  );
}
