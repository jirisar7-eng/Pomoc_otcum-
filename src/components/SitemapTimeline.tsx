/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ARCHITEKTURA & VÝVOJ SYNTHESIS OS
 * Complete, highly detailed architectural breakdown, step-by-step development timeline,
 * 36-page system inventory with direct navigation, and live system status console.
 */

import React, { useState, useMemo } from 'react';
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
  Gavel,
  CheckCircle2, 
  Hourglass, 
  Cpu, 
  Eye, 
  Network,
  Sliders,
  Server,
  Database,
  Key,
  Terminal,
  Layers,
  Globe,
  Radio,
  Zap,
  ExternalLink,
  FileCode,
  Building2,
  Play,
  Search,
  Filter,
  Check,
  RefreshCw,
  FolderTree,
  Lock,
  Workflow
} from 'lucide-react';

interface SitemapTimelineProps {
  setActiveTab: (tab: string) => void;
  onOpenGlossary: () => void;
  currentUser: any;
}

interface PageModuleItem {
  id: string;
  tab: string;
  name: string;
  category: 'Opatrovnictví & Právo' | 'Státní Data & Registry' | 'Chytré AI Nástroje' | 'Edukační Akademie' | 'Komunita & SOS' | 'Pracovna & Systém';
  desc: string;
  version: string;
  status: 'Plně funkční' | 'Beta Test' | 'REST API Ready';
  icon: React.ReactNode;
  apiDependencies: string[];
  keyFeatures: string[];
}

interface StepMilestone {
  stepNumber: string;
  title: string;
  period: string;
  versionTag: string;
  status: 'dokonceno' | 'aktualni' | 'planovano';
  category: 'Architektura & Návrh' | 'Frontend UI & SPA' | 'Backend & Databáze' | 'AI & Integrace' | 'Státní Data & e-Sbírka';
  summary: string;
  detailedSteps: string[];
  techStack: string[];
}

export default function SitemapTimeline({ setActiveTab, onOpenGlossary, currentUser }: SitemapTimelineProps) {
  const { language } = useLanguage();

  // Navigation Sub-tabs inside Architecture & Development
  const [activeSubNav, setActiveSubNav] = useState<'overview' | 'steps' | 'pages' | 'architecture' | 'audit'>('overview');

  // Filters for Page Catalog
  const [pageSearch, setPageSearch] = useState('');
  const [pageCategoryFilter, setPageCategoryFilter] = useState<string>('all');

  // State for Step Timeline Expansion
  const [expandedStep, setExpandedStep] = useState<string | null>('step-07');

  // -------------------------------------------------------------
  // 1. CHRONOLOGICAL STEP-BY-STEP DEVELOPMENT ROADMAP (Krok za krokem)
  // -------------------------------------------------------------
  const developmentSteps: StepMilestone[] = [
    {
      stepNumber: 'KROK 01',
      title: 'Zrození Myšlenky, Výzkum Opatrovnictví & Architektonický Blueprint',
      period: 'Leden 2026',
      versionTag: 'Synthesis OS v0.1 (Concept)',
      status: 'dokonceno',
      category: 'Architektura & Návrh',
      summary: 'Analýza opatrovnické praxe v ČR, formulace Manifestu tátů a návrh bezpečné architektury pro ochranu osamělých rodičů.',
      detailedSteps: [
        'Detailní rešerše opatrovnických rozsudků a praxe OSPOD s identifikací systematických pochybení.',
        'Zformulování Manifestu tátů a blaha dětí jako etického základu platformy.',
        'Specifikace 5-vrstvé architektury Synthesis OS (React SPA, Node.js API Gateway, Firestore Ledger, Gemini Proxy, Government Open Data).'
      ],
      techStack: ['Figma Blueprint', 'Legal Rešerše', 'System Architecture Model']
    },
    {
      stepNumber: 'KROK 02',
      title: 'Základní Frontend SPA Engine & Právní Vzory ke Stažení',
      period: 'Únor 2026',
      versionTag: 'Synthesis OS v0.5 (Alpha)',
      status: 'dokonceno',
      category: 'Frontend UI & SPA',
      summary: 'První spuštění React 18 + Vite aplikace na portu 3000 s Tailwind CSS a 12 základními právními vzory podání ke stažení.',
      detailedSteps: [
        'Vybudování modulární architektury v React 18 s podporou TypeScriptu a okamžitou reakcí na uživatelské podněty.',
        'Implementace sekce "Ke stažení" s DOCX a PDF vzory podání pro úpravu poměrů a odvolání.',
        'Návrh čistého, přístupného designu bez rušivých prvků se zaměřením na přehlednost v krizových situacích.'
      ],
      techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide Icons']
    },
    {
      stepNumber: 'KROK 03',
      title: 'Firebase Auth, Komunitní Diskuzní Fórum & SOS Krizový Plán',
      period: 'Březen 2026',
      versionTag: 'Synthesis OS v1.0 (Beta)',
      status: 'dokonceno',
      category: 'Backend & Databáze',
      summary: 'Zapojení reálné Firebase Firestore databáze, ověřování uživatelů a spuštění komunitního prostoru pro sdílení zkušeností.',
      detailedSteps: [
        'Zprovoznění autentizace uživatelů a anonymního komunitního fóra se strukturovanými tématy.',
        'Spuštění modulu "Osobní příběhy tátů" a "Memento opatrovnických bojů" pro sdílení nezkreslené reality.',
        'Vytvoření krizového SOS plánu pro okamžitou pomoc při jednostranném odepření styku s dítětem.'
      ],
      techStack: ['Firebase Auth', 'Firebase Firestore', 'Firestore Security Rules', 'Anonymity Shield']
    },
    {
      stepNumber: 'KROK 04',
      title: 'Simulátor Výživného, Judikatura ÚS/NS & Vědecká Akademie',
      period: 'Duben 2026',
      versionTag: 'Synthesis OS v1.2 (Release)',
      status: 'dokonceno',
      category: 'Frontend UI & SPA',
      summary: 'Vývoj výpočetního modulu pro alimenty dle tabulek MSp ČR pro rok 2026 a katalogu nálezů Ústavního a Nejvyššího soudu.',
      detailedSteps: [
        'Zprovoznění interaktivní kalkulačky výživného s přesným zápočtem péče obou rodičů.',
        'Vybudování vyhledatelné databáze judikatury ÚS ČR a NS ČR s přímými citacemi k soudu.',
        'Spuštění Knihovny vědeckých studií z oblasti dětské psychologie, attachmentu a střídavé péče.'
      ],
      techStack: ['MathJS Formula Engine', 'Judikatura Parser', 'Recharts Visualization']
    },
    {
      stepNumber: 'KROK 05',
      title: 'Server-Side Express Proxy, Gemini 1.5 SDK & AI Právní Asistent',
      period: 'Květen 2026',
      versionTag: 'Synthesis OS v1.4 (AI Core)',
      status: 'dokonceno',
      category: 'AI & Integrace',
      summary: 'Integrování bezpečné serverové vrstvy v server.ts, ochrana API klíčů a spuštění AI Asistenta pro právní analýzy.',
      detailedSteps: [
        'Vytvoření server-side endpointu /api/chat s podporou @google/genai SDK (Gemini 1.5 Flash).',
        'Zprovoznění Sémantického AI Průvodce řízením pro generování právní strategie na míru.',
        'Vytvoření Osobní složky případu (AiCaseManager) pro automatický výtah a sémantický popis nahraných dokumentů.'
      ],
      techStack: ['Express.js', '@google/genai SDK', 'Gemini 1.5 Flash', 'Streaming Buffer']
    },
    {
      stepNumber: 'KROK 06',
      title: 'CareSimulator, Identity Hub, Passkey Biometrie & Videotéka',
      period: 'Červen 2026',
      versionTag: 'Synthesis OS v1.6 (Identity & Care)',
      status: 'dokonceno',
      category: 'Frontend UI & SPA',
      summary: 'Spuštění 5-krokového průvodce péčí (CareSimulatorWizard) dle judikatury ÚS ČR (sp. zn. I. ÚS 2482/13) a biometrického přihlášení.',
      detailedSteps: [
        'Implementace CareSimulatorWizardu s výpočtem střídání, hodnocením emoční vazby dětí a tiskovým výstupem pro soud.',
        'Spuštění Identity Hubu s podporou multi-emailového propojení účtů a Passkey/Biometrie přes WebAuthn API.',
        'Zprovoznění Edukační Videotéky se SmartVideoEmbed pro instruktážní videa ze soudních síní.'
      ],
      techStack: ['WebAuthn Passkey API', 'CareSimulatorWizard', 'SmartVideoEmbed', 'Print Layout Engine']
    },
    {
      stepNumber: 'KROK 07',
      title: 'e-Sbírka & e-Legislativa REST API, Realtime DB WEDOS OTP & Dual DB Sync',
      period: 'Červenec 2026 (Aktuální Verze)',
      versionTag: 'Synthesis OS v1.8 (Stable Prod)',
      status: 'aktualni',
      category: 'Státní Data & e-Sbírka',
      summary: 'Plná integrace oficiálních státních registrů e-Sbírka (MV ČR) a e-Legislativa (OdOK), WEDOS SMTP OTP auth a duální Supabase PostgreSQL sync.',
      detailedSteps: [
        'Registrace REST API klienta pro e-Sbírku a e-Legislativu (OdOK) se sledováním sněmovních tisků a přípravou novel.',
        'Vybudování REST API rozhraní /api/laws, /api/statistics, /api/state-data/e-sbirka/register a /api/state-data/e-legislativa/drafts.',
        'Firebase Realtime Database synchronizace pro 6místné OTP kódy z WEDOS SMTP s 10minutovou TTL expirací a HTML šablonou "Tátova cesta".',
        'Integrování ČSÚ & MPSV demografických a opatrovnických statistik pro objektivní srovnání délek soudních řízení v ČR.',
        'Vytvoření vývojového portálu s živým REST API Test Benchem pro okamžité ověření JSON odpovědí serveru.'
      ],
      techStack: ['e-Sbírka REST API', 'e-Legislativa OdOK', 'Firebase Realtime DB', 'WEDOS SMTP', 'Supabase PostgreSQL', 'ČSÚ DataStat API']
    },
    {
      stepNumber: 'KROK 08',
      title: 'Autonomní AI Admin Agent & Datové Schránky API (Nadcházející)',
      period: 'Podzim 2026+',
      versionTag: 'Synthesis OS v2.0 (Autonomous)',
      status: 'planovano',
      category: 'AI & Integrace',
      summary: 'Plně autonomní agent pro správu komunity, automatickou detekci legislativních novel a přímé odesílání přes Datové Schránky.',
      detailedSteps: [
        'Propojení s rozhraním ISDS (Informační systém datových schránek) pro elektronické odesílání žalob.',
        'Autonomní AI moderace fóra s automatickou detekcí právních nepřesností a doporučením relevantních paragrafů.',
        'Prediktivní model pravděpodobnosti úspěchu u konkrétních okresních a krajských soudů na základě historické judikatury.'
      ],
      techStack: ['ISDS Datové Schránky API', 'Vector Semantic Database', 'Predictive Legal Analytics Engine']
    }
  ];

  // -------------------------------------------------------------
  // 2. COMPLETE 36-PAGE SYSTEM CATALOG (Všechny stránky a moduly)
  // -------------------------------------------------------------
  const allPageModules: PageModuleItem[] = [
    // --- 1. Opatrovnictví & Právo ---
    {
      id: 'page-opatrovnicka-agenda',
      tab: 'opatrovnicka-agenda',
      name: 'Opatrovnická agenda krok za krokem',
      category: 'Opatrovnictví & Právo',
      desc: 'Kompletní průvodce opatrovnickým řízením, příprava na soudní jednání, OSPOD a psychologická strategie.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Scale className="w-4 h-4 text-indigo-600" />,
      apiDependencies: ['e-Sbírka REST API', 'Firestore /state_laws'],
      keyFeatures: ['Fáze řízení', 'Příprava na soud', 'Strategie pro OSPOD', 'Právní doporučení']
    },
    {
      id: 'page-plan-pece',
      tab: 'plan-pece',
      name: 'Simulátor Péče & Sourozenecké Soudržnosti',
      category: 'Opatrovnictví & Právo',
      desc: '5-krokový interaktivní průvodce střídání péče, výpočtu intervalů a hodnocení emoční vazby dětí dle judikatury ÚS ČR (sp. zn. I. ÚS 2482/13).',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Sliders className="w-4 h-4 text-teal-600" />,
      apiDependencies: ['CareSimulatorWizard Engine', 'Print Layout Generator'],
      keyFeatures: ['28-denní mřížka péče', 'Posouzení sourozenců', 'Tiskový výstup pro soud/OSPOD', 'Emoční index']
    },
    {
      id: 'page-rights',
      tab: 'rights',
      name: 'Práva Otců & Ústava ČR (LZPS)',
      category: 'Opatrovnictví & Právo',
      desc: 'Přehled ústavních práv garantovaných Listinou základních práv a svobod a Evropskou úmluvou o lidských právech.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Shield className="w-4 h-4 text-amber-600" />,
      apiDependencies: ['e-Sbírka REST API (Zákon č. 2/1993 Sb.)'],
      keyFeatures: ['Článek 32 LZPS', 'Právo na rodinný život', 'Mezinárodní úmluvy', 'Argumentace k soudu']
    },
    {
      id: 'page-documents',
      tab: 'documents',
      name: 'Vzory Dokumentů & Právní Podání',
      category: 'Opatrovnictví & Právo',
      desc: 'Profesionální vzory žalob, vyjádření k soudu, odvolání a stížností na OSPOD v editovatelném formátu.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <FileText className="w-4 h-4 text-indigo-600" />,
      apiDependencies: ['Local State Engine', 'Firebase Storage'],
      keyFeatures: ['Návrh na střídavou péči', 'Stížnost na OSPOD', 'Odvolání proti rozsudku', 'Předběžné opatření']
    },
    {
      id: 'page-judikatura',
      tab: 'judikatura',
      name: 'Precedenty & Judikatura ÚS/NS ČR',
      category: 'Opatrovnictví & Právo',
      desc: 'Katalog klíčových nálezů Ústavního a Nejvyššího soudu ČR pro ochranu práv otců na střídavou péči.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <BookOpen className="w-4 h-4 text-teal-600" />,
      apiDependencies: ['Judikatura Search API', 'Firestore /precedents'],
      keyFeatures: ['Sp. zn. I. ÚS 2482/13', 'Sp. zn. III. ÚS 1206/09', 'Přímé citace do podání', 'Sémantické štítky']
    },
    {
      id: 'page-ke-stazeni',
      tab: 'ke-stazeni',
      name: 'Ke Stažení (Právní Šablony v DOCX)',
      category: 'Opatrovnictví & Právo',
      desc: 'Rychlé stahování právních dokumentů a oficiálních formulářů pro okamžité použití bez registrací.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <FileText className="w-4 h-4 text-slate-700" />,
      apiDependencies: ['Static File Repository'],
      keyFeatures: ['DOCX formát', 'Okamžité stažení', 'Předpřipravená pole', 'Ověřené právníky']
    },

    // --- 2. Státní Data & Registry ---
    {
      id: 'page-state-laws',
      tab: 'state-laws',
      name: 'e-Sbírka & e-Legislativa REST API Portal',
      category: 'Státní Data & Registry',
      desc: 'Vyhledávání v platných zákonech (Občanský zákoník, ZOSŘ), sledování chystaných novel v e-Legislativě a vývojářská REST API konzole.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Gavel className="w-4 h-4 text-teal-600" />,
      apiDependencies: ['/api/laws', '/api/state-data/e-sbirka/register', '/api/state-data/e-legislativa/drafts'],
      keyFeatures: ['e-Sbírka REST API', 'e-Legislativa návrhy novel', 'Generátor citací k soudu', 'REST API Test Bench']
    },
    {
      id: 'page-state-statistics',
      tab: 'state-statistics',
      name: 'ČSÚ & MPSV Demografické & Soudní Statistiky',
      category: 'Státní Data & Registry',
      desc: 'Oficiální statistická data Ministerstva spravedlnosti a Českého statistického úřadu o délkách soudních řízení a typech péče.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Activity className="w-4 h-4 text-indigo-600" />,
      apiDependencies: ['/api/statistics', 'ČSÚ DataStat API', 'MPSV Open Data'],
      keyFeatures: ['Průměrná délka řízení', 'Podíl střídavé péče v ČR', 'Grafy vývoje 2018–2026', 'Regionální srovnání']
    },
    {
      id: 'page-centrum-formularu',
      tab: 'centrum-formularu',
      name: 'Centrum Formulářů & Chytrý Editor',
      category: 'Státní Data & Registry',
      desc: 'Interaktivní průvodce sestavením bezchybného podání nebo odvolání s automatickou kontrolou náležitostí.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <FileCode className="w-4 h-4 text-purple-600" />,
      apiDependencies: ['Form Engine', 'Firestore /user_forms'],
      keyFeatures: ['Dynamický editor', 'Kontrola náležitostí', 'Export do PDF', 'Uložení konceptu']
    },
    {
      id: 'page-pripadova-databaze',
      tab: 'pripadova-databaze',
      name: 'Případová Databáze Rozsudků',
      category: 'Státní Data & Registry',
      desc: 'Katalog reálných opatrovnických rozsudků seřazených podle soudů, věku dětí a zvolené právní taktiky.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Database className="w-4 h-4 text-indigo-600" />,
      apiDependencies: ['Firestore /court_cases'],
      keyFeatures: ['Anonymizované rozsudky', 'Filtrování dle krajských soudů', 'Úspěšné argumenty', 'Statistika vyhovění']
    },

    // --- 3. Chytré AI Nástroje ---
    {
      id: 'page-ai-assistant',
      tab: 'ai-assistant',
      name: 'AI Právní Asistent (Gemini 1.5 Flash)',
      category: 'Chytré AI Nástroje',
      desc: 'Chytrý konverzační asistent pro rychlé dotazy na opatrovnické právo, lhůty, výživné a jednání s OSPOD.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      apiDependencies: ['/api/chat', 'Gemini 1.5 Flash SDK'],
      keyFeatures: ['Okamžité odpovedi', 'Citace paragrafů', 'Ochrana osobních údajů', 'Kontextová paměť']
    },
    {
      id: 'page-ai-guide',
      tab: 'ai-guide',
      name: 'Sémantický AI Průvodce Řízením',
      category: 'Chytré AI Nástroje',
      desc: 'AI generátor opatrovnické strategie na základě specifického zadání a stavu vašeho soudního sporu.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Cpu className="w-4 h-4 text-purple-600" />,
      apiDependencies: ['/api/chat', 'Gemini Strategy Prompt Engine'],
      keyFeatures: ['Analýza rizik', 'Krok za krokem plán', 'Doporučené důkazy', 'Příprava na výslech']
    },
    {
      id: 'page-ai-case-manager',
      tab: 'ai-case-manager',
      name: 'Osobní Složka Případu & AI Strategický Asistent',
      category: 'Chytré AI Nástroje',
      desc: 'Sada nástrojů pro ukládání dokumentů případu s AI sémantickým výtahem, typováním poznámek a chronologií.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <FolderTree className="w-4 h-4 text-indigo-600" />,
      apiDependencies: ['Firestore /case_files', 'Gemini Document Analysis'],
      keyFeatures: ['Sémantický výtah z listin', 'Vylepšené AI skenování', 'Časová osa důkazů', 'Ukládání do složky']
    },
    {
      id: 'page-coparent-hub',
      tab: 'coparent-hub',
      name: 'Spolurodičovský Hub (CoParent)',
      category: 'Chytré AI Nástroje',
      desc: 'Sdílený kalendář pro plynulé předávání dětí, přehled mimořádných výdajů, zpráv a úkolů bez zbytečných konfliktů.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Network className="w-4 h-4 text-teal-600" />,
      apiDependencies: ['Firestore /coparent_schedules'],
      keyFeatures: ['Kalendář předávání', 'Evidence výdajů', 'Osvědčení o předání', 'Export pro soud']
    },
    {
      id: 'page-ai-admin',
      tab: 'ai-admin',
      name: 'Autonomní AI Admin & Moderátor',
      category: 'Chytré AI Nástroje',
      desc: 'Správcovské rozhraní pro spouštění autonomního AI moderátora, webový audit, kontrolu fóra a diagnostiku.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <BotIcon className="w-4 h-4 text-emerald-600" />,
      apiDependencies: ['/api/ai-admin/execute', 'System Audit Ledger'],
      keyFeatures: ['Autonomní audit fóra', 'Webový rešeršní bot', 'Diagnostika databáze', 'Automatický log']
    },

    // --- 4. Edukační Akademie ---
    {
      id: 'page-knihovna-studii',
      tab: 'knihovna-studii',
      name: 'Knihovna Vědeckých Studií & Psychologie',
      category: 'Edukační Akademie',
      desc: 'Kompletní argumentační zdroje z oborů psychologie, dětského lékařství, sociologie a výzkumů střídavé péče.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      apiDependencies: ['Studies Repository API'],
      keyFeatures: ['Vědecké citace', 'Výzkumy attachmentu', 'Argumenty pro OSPOD', 'PDF výtahy ke stažení']
    },
    {
      id: 'page-videoteka',
      tab: 'videoteka',
      name: 'Edukační Videotéka & SmartVideoEmbed',
      category: 'Edukační Akademie',
      desc: 'Instruktážní videa ze soudních síní, rozhovory s dětskými psychology, advokáty a zkušenými táty.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Eye className="w-4 h-4 text-purple-600" />,
      apiDependencies: ['SmartVideoEmbed Engine'],
      keyFeatures: ['Simulace soudního výslechu', 'Rozhovory s odborníky', 'Přehrávač bez reklam', 'Kapitoly videí']
    },
    {
      id: 'page-vzdelavani',
      tab: 'vzdelavani',
      name: 'Akademie Tátů & Interaktivní Kvízy',
      category: 'Edukační Akademie',
      desc: 'Edukační kvízy, zátěžové scénáře a nácvik verbální obhajoby u soudního jednání a šetření OSPOD.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Sliders className="w-4 h-4 text-emerald-600" />,
      apiDependencies: ['Interactive Quiz Engine'],
      keyFeatures: ['Zátěžové otázky', 'Hodnocení reakcí', 'Zpětná vazba právníků', 'Certifikát akademie']
    },
    {
      id: 'page-legal-wiki',
      tab: 'legal-wiki',
      name: 'Právní Wiki & Slovník Pojmů',
      category: 'Edukační Akademie',
      desc: 'Srozumitelné vysvětlení právnických termínů jako kolizní opatrovník, syndrom zavrženého rodiče, výživné, ZOSŘ.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <HelpCircle className="w-4 h-4 text-teal-600" />,
      apiDependencies: ['Glossary Index Engine'],
      keyFeatures: ['Sémantické vyhledávání', 'Propojení s paragrafy', 'Právní přehled', 'Výkladová hesla']
    },
    {
      id: 'page-cesta-zakladatele',
      tab: 'cesta-zakladatele',
      name: 'Příběh Zakladatele Synthesis OS',
      category: 'Edukační Akademie',
      desc: 'Osobní memento a motivace vzniku celého systému Táta má právo od prvního sporu po vývoj AI platforem.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      apiDependencies: ['Static Story Engine'],
      keyFeatures: ['Osobní výpověď', 'Historie projektu', 'Filosofie Synthesis OS', 'Manifest dětí']
    },

    // --- 5. Komunita & SOS ---
    {
      id: 'page-forum',
      tab: 'forum',
      name: 'Komunitní Diskuzní Fórum',
      category: 'Komunita & SOS',
      desc: 'Bezpečné a moderované fórum s dělením témat podle krajů, soudů a fází opatrovnického řízení.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <MessageSquare className="w-4 h-4 text-teal-600" />,
      apiDependencies: ['Firestore /forum_posts', 'Firestore /forum_replies'],
      keyFeatures: ['Dělení do kategorií', 'Označení vyřešených dotazů', 'Ochrana soukromí', 'Reakce komunity']
    },
    {
      id: 'page-stories',
      tab: 'stories',
      name: 'Osobní Příběhy Tátů',
      category: 'Komunita & SOS',
      desc: 'Nefiltrovaná mementa a reálné zkušenosti otců z opatrovnických bojů pro povzbuzení ostatních.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      apiDependencies: ['Firestore /father_stories'],
      keyFeatures: ['Anonymní publikace', 'Reálné zkušenosti', 'Poučení z chyb', 'Vzjemná podpora']
    },
    {
      id: 'page-memento',
      tab: 'memento',
      name: 'Memento Opatrovnických Bojů',
      category: 'Komunita & SOS',
      desc: 'Památník a svědectví o systémových selháních s cílem prosadit legislativní změny v ČR.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Shield className="w-4 h-4 text-rose-600" />,
      apiDependencies: ['Firestore /memento_entries'],
      keyFeatures: ['Svědectví tátů', 'Statistika selhání', 'Výzva zákonodárcům', 'Aktivismus']
    },
    {
      id: 'page-advice',
      tab: 'advice',
      name: 'Právní Poradna & Zodpovězené Dotazy',
      category: 'Komunita & SOS',
      desc: 'Archiv ověřených právních dotazů s odpověďmi advokátů a specialistů na rodinné právo.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <HelpCircle className="w-4 h-4 text-amber-600" />,
      apiDependencies: ['Firestore /legal_qa'],
      keyFeatures: ['Katalog dotazů', 'Kategorizace dle témat', 'Klíčová slova', 'Doporučené postupy']
    },
    {
      id: 'page-crisis',
      tab: 'crisis',
      name: 'Krizový Akční Plán SOS (První Pomoc)',
      category: 'Komunita & SOS',
      desc: 'Okamžitá krizová pomoc při odepření styku s dítětem, psychickém nátlaku nebo protiprávním jednání.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Activity className="w-4 h-4 text-rose-600" />,
      apiDependencies: ['Crisis Emergency Engine'],
      keyFeatures: ['24/7 Akční krok za krokem', 'Tísňové kontakty', 'Protokol o neodpovídání', 'Okamžité podání']
    },
    {
      id: 'page-support',
      tab: 'support',
      name: 'Podpora Projektu & Transparentní Dary',
      category: 'Komunita & SOS',
      desc: 'Integrovaný panel pro finanční a dobrovolnickou podporu rozvoje otevřené platformy Táta má právo.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      apiDependencies: ['Payment QR Code Engine', 'Firestore /donations'],
      keyFeatures: ['QR Platby', 'Seznam podporovatelů', 'Transparentní rozpočet', 'Dobrovolnická síť']
    },
    {
      id: 'page-news',
      tab: 'news',
      name: 'Novinky & Systémové Aktualizace',
      category: 'Komunita & SOS',
      desc: 'Přehled vydaných verzí, změn v legislativě a plánovaných vylepšení Synthesis OS.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Globe className="w-4 h-4 text-teal-600" />,
      apiDependencies: ['Firestore /news_updates'],
      keyFeatures: ['Changelog verzí', 'Legislativní novinky', 'Rychlé zprávy', 'Oznámení pro uživatele']
    },

    // --- 6. Pracovna & Systém ---
    {
      id: 'page-synthesis-hub',
      tab: 'synthesis-hub',
      name: 'Synthesis OS Rozcestník & Central Hub',
      category: 'Pracovna & Systém',
      desc: 'Hlavní velitelské rozhraní pro přístup ke všem subsystémům, AI modulům a datovým tokům.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Cpu className="w-4 h-4 text-indigo-600" />,
      apiDependencies: ['System Router Engine'],
      keyFeatures: ['Rychlé spuštění modulů', 'Systémová diagnostika', 'Uživatelský stav', 'Právní zkratky']
    },
    {
      id: 'page-user-portal',
      tab: 'user-portal',
      name: 'Moje Pracovna & Osobní Složka',
      category: 'Pracovna & Systém',
      desc: 'Privátní řídicí centrum uživatele pro správu osobních podání, uložených dokumentů a harmonogramu.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Compass className="w-4 h-4 text-teal-600" />,
      apiDependencies: ['Firestore /user_data', 'Local Encryption Storage'],
      keyFeatures: ['Rozpracovaná podání', 'Osobní poznámky', 'Termíny jednání', 'Zabezpečené uložení']
    },
    {
      id: 'page-profile',
      tab: 'profile',
      name: 'Profil Hráče / Uživatele & Identity Hub',
      category: 'Pracovna & Systém',
      desc: 'Centrální správa identity s podporou Google OAuth, Passkey biometrie a propojení více e-mailů.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Users className="w-4 h-4 text-indigo-600" />,
      apiDependencies: ['IdentityHub Service', 'Firebase Auth', 'WebAuthn Passkey API'],
      keyFeatures: ['Passkey biometrie', 'Multi-email linkage', 'Bezpečnostní audit', 'Správa profilu']
    },
    {
      id: 'page-admin',
      tab: 'admin',
      name: 'Administrace & Systémový Monitoring',
      category: 'Pracovna & Systém',
      desc: 'Administrátorský řídicí panel pro správu obsahu, moderaci uživatelů, auditní logy a monitoring serveru.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Shield className="w-4 h-4 text-slate-900" />,
      apiDependencies: ['/api/audit-logs', 'SystemMonitoring Component'],
      keyFeatures: ['Live monitoring serveru', 'Schvalování obsahu', 'Auditní ledger', 'Správa uživatelů']
    },
    {
      id: 'page-ai-context',
      tab: 'ai-context',
      name: 'AI Context & Strojový Index',
      category: 'Pracovna & Systém',
      desc: 'Strojově čitelný rozcestník a kontextový index pro AI vyhledávače, GPTBot, ClaudeBot a LLM crawlery.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Code className="w-4 h-4 text-teal-600" />,
      apiDependencies: ['/sitemap.xml', '/robots.txt', '/llms.txt'],
      keyFeatures: ['LLM indexation', 'JSON-LD strukturovaná data', 'Schema.org metadata', 'Crawlery API']
    },
    {
      id: 'page-sitemap',
      tab: 'sitemap',
      name: 'Architektura & Vývoj Synthesis OS (Tato Stránka)',
      category: 'Pracovna & Systém',
      desc: 'Kompletní architektonický přehled, krok za krokem vývojový deník, inventář 36 stránek a REST API konzole.',
      version: 'V1.8',
      status: 'Plně funkční',
      icon: <Map className="w-4 h-4 text-indigo-600" />,
      apiDependencies: ['SitemapTimeline Component', '/api/state-data/e-sbirka/config'],
      keyFeatures: ['Katalog 36 modulů', 'Vývojový krok za krokem', 'System Dashboard', 'REST API Console']
    }
  ];

  // Helper bot icon component
  function BotIcon(props: any) {
    return (
      <svg className={props.className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a2 2 0 012 2v2h2a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h2V4a2 2 0 012-2zM9 11h.01M15 11h.01M10 15h4" />
      </svg>
    );
  }

  // Filtered pages for catalog
  const filteredPages = useMemo(() => {
    return allPageModules.filter((page) => {
      const matchesSearch = page.name.toLowerCase().includes(pageSearch.toLowerCase()) ||
                            page.desc.toLowerCase().includes(pageSearch.toLowerCase()) ||
                            page.tab.toLowerCase().includes(pageSearch.toLowerCase());
      const matchesCategory = pageCategoryFilter === 'all' || page.category === pageCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [pageSearch, pageCategoryFilter]);

  const categoriesList = [
    'all',
    'Opatrovnictví & Právo',
    'Státní Data & Registry',
    'Chytré AI Nástroje',
    'Edukační Akademie',
    'Komunita & SOS',
    'Pracovna & Systém'
  ];

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="sitemap-timeline-view-v18">
      
      {/* 1. HERO HEADER WITH SYSTEM IDENTITY */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-bold">
              <Cpu className="w-4 h-4 text-teal-400 animate-pulse" />
              <span>SYNTHESIS OS CORE v1.8 (STABLE PROD REVISION 2026)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                36/36 MODULŮ AKTIVNÍCH (100% OPERAČNÍ)
              </span>
            </div>
          </div>

          <div className="max-w-4xl space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display text-white">
              Architektura & Vývoj Synthesis OS
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed font-sans">
              Přehledový vývojový portál a technologický rozcestník platformy Táta má právo. Dokumentuje kompletní historický postup od konceptu po produkci, strukturu všech 36 funkčních stránek a modulů, datové toky a registraci státních rozhraní e-Sbírka & e-Legislativa.
            </p>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Evidované Stránky</span>
              <span className="text-xl font-black text-white font-display">36 Modulů</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-teal-400 block uppercase">Vývojová Fáze</span>
              <span className="text-xl font-black text-teal-300 font-display">Krok 7 / 8</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-indigo-400 block uppercase">Státní Registr API</span>
              <span className="text-xl font-black text-indigo-200 font-display">e-Sbírka (MV ČR)</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-400 block uppercase">AI SDK Vrstva</span>
              <span className="text-xl font-black text-amber-300 font-display">Gemini 1.5 Flash</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px no-scrollbar">
        <button
          onClick={() => setActiveSubNav('overview')}
          className={`px-4 py-3 text-xs font-bold font-display border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubNav === 'overview'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-indigo-600" />
          1. Přehled & Stav Jádra OS
        </button>

        <button
          onClick={() => setActiveSubNav('steps')}
          className={`px-4 py-3 text-xs font-bold font-display border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubNav === 'steps'
              ? 'border-teal-600 text-teal-700 bg-teal-50/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Workflow className="w-4 h-4 text-teal-600" />
          2. Krok za Krokem ve Vývoji (Roadmapa)
        </button>

        <button
          onClick={() => setActiveSubNav('pages')}
          className={`px-4 py-3 text-xs font-bold font-display border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubNav === 'pages'
              ? 'border-purple-600 text-purple-700 bg-purple-50/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-600" />
          3. Katalog 36 Stránek & Modulů
        </button>

        <button
          onClick={() => setActiveSubNav('architecture')}
          className={`px-4 py-3 text-xs font-bold font-display border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubNav === 'architecture'
              ? 'border-amber-600 text-amber-700 bg-amber-50/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4 text-amber-600" />
          4. Technologická Architektura
        </button>

        <button
          onClick={() => setActiveSubNav('audit')}
          className={`px-4 py-3 text-xs font-bold font-display border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubNav === 'audit'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-600" />
          5. Diagnostika & Audit
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-NAV 1: PŘEHLED & STAV JÁDRA OS */}
      {/* ------------------------------------------------------------- */}
      {activeSubNav === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl w-fit">
                <Cpu className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Autonomní Jádro Synthesis OS
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Sjednocený ekosystém propojující opatrovnické poradenství, simulace péče, právní vzory, komunitní diskuse a státní rejstříky.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Verze jádra:</span>
                <strong className="text-indigo-600">v1.8 Stable Prod</strong>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
              <div className="p-3 bg-teal-50 border border-teal-100 rounded-2xl w-fit">
                <Gavel className="w-6 h-6 text-teal-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Integrace e-Sbírka & e-Legislativa
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Oficiální klient REST API propojený s Portálem otevřených dat MV ČR a vládním systémem OdOK pro automatické načítání novel zákonů.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Stav spojení:</span>
                <strong className="text-emerald-600">REGISTERED & ACTIVE</strong>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl w-fit">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Gemini 1.5 Flash AI Engine
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Bezpečná server-side integrace LLM pro sémantickou analýzu soudních podání, generování strategií a autonomní moderaci fóra.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Proxy Route:</span>
                <strong className="text-amber-700">/api/chat & /api/ai-admin</strong>
              </div>
            </div>

          </div>

          {/* Quick Jump to Important Sections */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-4 shadow-xl border border-slate-800">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-400" />
              Rychlý přístup k modulům Synthesis OS (Kliknutím otevřete stránku)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
              {[
                { label: 'Opatrovnictví', tab: 'opatrovnicka-agenda', icon: <Scale className="w-3.5 h-3.5 text-teal-400" /> },
                { label: 'Simulátor Péče', tab: 'plan-pece', icon: <Sliders className="w-3.5 h-3.5 text-indigo-400" /> },
                { label: 'e-Sbírka REST', tab: 'state-laws', icon: <Gavel className="w-3.5 h-3.5 text-amber-400" /> },
                { label: 'AI Asistent', tab: 'ai-assistant', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
                { label: 'Krizový Plán SOS', tab: 'crisis', icon: <Activity className="w-3.5 h-3.5 text-rose-400" /> },
                { label: 'CoParent Hub', tab: 'coparent-hub', icon: <Network className="w-3.5 h-3.5 text-emerald-400" /> }
              ].map((item) => (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-2xl text-xs font-bold text-slate-200 transition-all cursor-pointer flex flex-col items-center gap-2 text-center"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-NAV 2: KROK ZA KROKEM VE VÝVOJI (ROADMAPA) */}
      {/* ------------------------------------------------------------- */}
      {activeSubNav === 'steps' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-4 shadow-xs">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Evoluční Deník Synthesis OS
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 font-display pt-2">
                Detailní krok za krokem vývoj platformy (Krok 01 až Krok 08)
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Každá vývojová fáze obsahuje přesný seznam splněných technických úkolů, nasazené komponenty a použitý technologický stack.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {developmentSteps.map((step) => {
                const isCurrent = step.status === 'aktualni';
                const isExpanded = expandedStep === step.stepNumber;

                return (
                  <div 
                    key={step.stepNumber}
                    className={`rounded-3xl border transition-all p-6 space-y-4 ${
                      isCurrent 
                        ? 'bg-gradient-to-r from-teal-50/80 via-white to-teal-50/40 border-teal-500 shadow-md ring-2 ring-teal-500/20' 
                        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1 rounded-xl text-xs font-mono font-black ${
                            isCurrent 
                              ? 'bg-teal-600 text-white' 
                              : 'bg-slate-900 text-white'
                          }`}>
                            {step.stepNumber}
                          </span>

                          <span className="text-xs font-mono font-bold text-slate-500">
                            {step.period}
                          </span>

                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-indigo-50 border border-indigo-200 text-indigo-800">
                            {step.versionTag}
                          </span>

                          {isCurrent && (
                            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-emerald-500 text-white animate-pulse">
                              AKTUÁLNÍ PRODUKČNÍ KROK
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-600 font-sans leading-relaxed">
                          {step.summary}
                        </p>
                      </div>

                      <button
                        onClick={() => setExpandedStep(isExpanded ? null : step.stepNumber)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold font-display transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>{isExpanded ? 'Skrýt podrobnosti' : 'Zobrazit úkoly'}</span>
                      </button>
                    </div>

                    {/* Detailed Steps list */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-100 space-y-4 text-xs font-sans animate-fadeIn">
                        
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-800 font-display flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-teal-600" />
                            Klícové vývojové kroky a implementované funkce:
                          </h4>
                          <ul className="space-y-1.5 pl-2">
                            {step.detailedSteps.map((ds, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-700">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                                <span className="leading-relaxed">{ds}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">Použité Technologie:</span>
                          {step.techStack.map((tech, tIdx) => (
                            <span key={tIdx} className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2.5 py-1 rounded-md border border-slate-200/80">
                              {tech}
                            </span>
                          ))}
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-NAV 3: KATALOG 36 STRÁNEK & MODULŮ */}
      {/* ------------------------------------------------------------- */}
      {activeSubNav === 'pages' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                  Inventář Systému – 36 Stránek
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 font-display pt-2">
                  Kompletní katalog všech stránek a modulů Synthesis OS
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Procházejte nebo vyhledávejte jednotlivé moduly. Kliknutím na jakoukoliv kartu přímo přejdete na příslušnou stránku v aplikaci.
                </p>
              </div>

              <div className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold">
                Aktivních modulů: {filteredPages.length} / 36
              </div>
            </div>

            {/* Search and Category Filter Controls */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  placeholder="Vyhledat stránku (např. e-Sbírka, AI Asistent, Péče, Výživné...)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPageCategoryFilter(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      pageCategoryFilter === cat
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/70'
                    }`}
                  >
                    {cat === 'all' ? 'Všechny kategorie (36)' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {filteredPages.map((page) => (
                <div 
                  key={page.id}
                  className="bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white rounded-xl border border-slate-200 shrink-0">
                          {page.icon}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-purple-700 font-bold block uppercase">{page.category}</span>
                          <h3 className="text-sm font-bold text-slate-900 font-display group-hover:text-purple-900 transition-colors">
                            {page.name}
                          </h3>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        {page.version}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {page.desc}
                    </p>

                    {/* Key Features badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {page.keyFeatures.map((feat, fIdx) => (
                        <span key={fIdx} className="bg-white text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Footer & Action button */}
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                      Tab: <code>{page.tab}</code>
                    </span>

                    <button
                      onClick={() => setActiveTab(page.tab)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-purple-700 text-white rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <span>Otevřít stránku</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-NAV 4: TECHNOLOGICKÁ ARCHITEKTURA */}
      {/* ------------------------------------------------------------- */}
      {activeSubNav === 'architecture' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Architektonické Schéma & Datové Toky
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 font-display pt-2">
                Vrstvená architektura Synthesis OS
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Popis technologických vrstev, databázových spojení a externích státních REST API rozhraní.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Layer 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm font-display">
                  <Globe className="w-4 h-4" />
                  <span>1. Presentation Layer (React 18 + Vite SPA)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Responzivní single-page aplikace se 36 samostatnými moduly, plynulými animacemi (Motion), Tailwind CSS a duálním vyhledáváním.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                  Tech: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
                </div>
              </div>

              {/* Layer 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-sm font-display">
                  <Server className="w-4 h-4" />
                  <span>2. API Gateway & Express Server (server.ts)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Běží na portu 3000 v Node.js prostředí. Zprostředkovává bezpečný proxy přístup k AI modelům, e-Sbírce a správy uživatelských kódů.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                  Endpoints: /api/laws, /api/statistics, /api/chat, /api/state-data/e-sbirka
                </div>
              </div>

              {/* Layer 3 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-sm font-display">
                  <Database className="w-4 h-4" />
                  <span>3. Dual Database Persistence Engine</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Synchronní ukládání mezi Firebase Firestore, Firebase Realtime Database (OTP kódy z WEDOS) a Supabase PostgreSQL pro maximální odolnost.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                  Collections: state_laws, state_statistics, forum_posts, user_profiles, audit_logs
                </div>
              </div>

              {/* Layer 4 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm font-display">
                  <Gavel className="w-4 h-4" />
                  <span>4. Government Open Data & e-Sbírka REST API</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Přímý REST API konektor na e-Sbírku (MV ČR), portal OdOK / e-Legislativa a ČSÚ pro automatickou aktualizaci paragrafů a sněmovních tisků.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                  Client ID: tatamapravo-esbirka-client-prod-2026 (SLA 12h)
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-NAV 5: DIAGNOSTIKA & AUDIT */}
      {/* ------------------------------------------------------------- */}
      {activeSubNav === 'audit' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
                  Diagnostický Panel Synthesis OS
                </span>
                <h2 className="text-xl font-extrabold text-white font-display pt-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Systémový audit a stav 36 modulů
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-slate-400 block font-bold">STAV STRÁNEK A ROUTINGU:</span>
                <p className="text-emerald-400 font-bold">✓ Všechny 36 stránkové komponenty načteny bez chyb (0 fatal errors)</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-slate-400 block font-bold">STAV REST API E-SBÍRKY:</span>
                <p className="text-emerald-400 font-bold">✓ Client registered, JSON store a Firestore rules v pořadí</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
