/**
 * Synthesis OS - User Manual & Help Section (Nápověda & Uživatelský manuál)
 * Copyright (c) 2026 Táta má právo
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  Lock, 
  Globe, 
  FileText, 
  Scale, 
  Users, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  PhoneCall, 
  FolderLock, 
  RefreshCw, 
  AlertTriangle, 
  BookOpen, 
  ChevronRight, 
  Download, 
  FileCode,
  Network,
  Calculator,
  MessageSquare,
  Shield,
  Gavel,
  Activity,
  Layers,
  Info
} from 'lucide-react';

interface ManualModule {
  id: string;
  name: string;
  category: 'public' | 'private';
  categoryLabel: string;
  icon: React.ReactNode;
  tag: string;
  purpose: string; // K čemu slouží
  instructions: string[]; // Jak pracovat (kroky)
  tips: string; // Tipy pro uživatele
  relatedTab: string;
}

interface UserManualViewProps {
  setActiveTab?: (tab: string) => void;
  onOpenAuth?: () => void;
  currentUser?: any;
}

export default function UserManualView({ setActiveTab, onOpenAuth, currentUser }: UserManualViewProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'public' | 'private'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('sos-plan');

  // List of all modules described in the manual
  const modules: ManualModule[] = [
    // 🌐 VEŘEJNÁ ČÁST
    {
      id: 'sos-plan',
      name: '🚨 Krizový Akční Plán SOS (První Pomoc)',
      category: 'public',
      categoryLabel: '🌐 Veřejná část',
      icon: <PhoneCall className="w-5 h-5 text-rose-600" />,
      tag: 'Krizová pomoc',
      purpose: 'Okamžitý návod krok za krokem při náhlém odebrání dětí, bránění ve styku, bezdůvodném odepření rodičovských práv nebo krizové situaci s OSPOD.',
      instructions: [
        'Zvolte konkrétní krizový scénář (např. Matka nepředala dítě, OSPOD odmítá jednat, Hrozí únos dítěte).',
        'Zobrazte si bezprostřední právní a procesní kroky doporučené advokáty.',
        'Stáhněte si předpřipravený protokol o neodpovídání a vzor okamžitého vyjádření pro soud.',
        'Využijte tísňové kontakty na bezplatnou právní a psychologickou pomoc 24/7.'
      ],
      tips: 'Při bránění ve styku vždy ihned sepište protokol s časovým razítkem a odešlete jej doporučeně nebo datovou schránkou na OSPOD a soud.',
      relatedTab: 'crisis'
    },
    {
      id: 'forum',
      name: '💬 Komunitní Diskuzní Fórum',
      category: 'public',
      categoryLabel: '🌐 Veřejná část',
      icon: <MessageSquare className="w-5 h-5 text-teal-600" />,
      tag: 'Komunita',
      purpose: 'Moderovaný prostor pro otce, kde lze bezpečně sdílet zkušenosti z opatrovnických řízení, radit se ohledně místních pracovišť OSPOD a vyhledávat v archivu řešení.',
      instructions: [
        'Prohlížejte diskuzní vlákna rozdělená podle krajů, okresních soudů a témat.',
        'Zadejte klíčové slovo do vyhledávače fóra pro nalezení obdobných případů.',
        'Pro pokládání nových dotazů a zapojení do diskuzí se přihlaste ke svému účtu.',
        'Sledujte vlákna označená zelenou fajfkou jako "Vyřešený právní dotaz".'
      ],
      tips: 'V příspěvcích nikdy neuvádějte pravá jména dětí a nezveřejňujte citlivé rodinné údaje. Fórum ctí plnou anonymitu.',
      relatedTab: 'forum'
    },
    {
      id: 'ke-stazeni',
      name: '📄 Ke stažení & Oficiální Dokumenty',
      category: 'public',
      categoryLabel: '🌐 Veřejná část',
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      tag: 'Dokumenty & Ke stažení',
      purpose: 'Přístup k ověřeným vzorům právních podání a oficiálním formulářům z lokální databáze, která je denně automaticky synchronizována s e-Sbírkou MV ČR.',
      instructions: [
        'Filtrujte dokumenty podle kategories (Návrhy na střídavou péči, Odvolání, Stížnosti OSPOD, Výživné).',
        'Zkontrolujte zelený odznak státního ověření platnosti legislativy.',
        'Klikněte na tlačítko "Stáhnout formulář" a uložte jej ve formátu DOCX nebo PDF.',
        'Otevřete vzor v libovolném textovém editoru a doplňte své osobní údaje podle vyznačených polí.'
      ],
      tips: 'Díky naší denní cache nemusíte mít strach ze zastaralých formulářů. Systém denně kontroluje novelizace v REST API e-Sbírky.',
      relatedTab: 'ke-stazeni'
    },
    {
      id: 'opatrovnictvi-agenda',
      name: '⚖️ Opatrovnická agenda krok za krokem & Judikatura',
      category: 'public',
      categoryLabel: '🌐 Veřejná část',
      icon: <Scale className="w-5 h-5 text-amber-600" />,
      tag: 'Právo & Precedenty',
      purpose: 'Kompletní veřejná metodika celého opatrovnického procesu od předžalobní fáze až po soudní rozsudek, doplněná o katalog klíčových nálezů Ústavního a Nejvyššího soudu ČR.',
      instructions: [
        'Projděte si chronologické etapy řízení (Příprava podkladů -> OSPOD šetření -> Předběžné opatření -> Soudní jednání).',
        'V katalogu judikatury vyhledejte přelomové nálezy (např. § 907 NOZ, I. ÚS 2482/13 o střídavé péči).',
        'Kopírujte citace judikátů pro vložení do vašich soudních vyjádření.'
      ],
      tips: 'Argumentace nálezy Ústavního soudu má u opatrovnických soudů vysokou váhu – zejména při vyvracení neopodstatněných námitek OSPODu.',
      relatedTab: 'opatrovnicka-agenda'
    },
    {
      id: 'pravni-poradna',
      name: '❓ Právní Poradna & Zodpovězené Dotazy',
      category: 'public',
      categoryLabel: '🌐 Veřejná část',
      icon: <HelpCircle className="w-5 h-5 text-purple-600" />,
      tag: 'Poradna',
      purpose: 'Veřejný archiv vyřešených dotazů s kvalifikovanými odpověďmi advokátů a specialistů na rodinné právo.',
      instructions: [
        'Zadejte do vyhledávače konkrétní problém (např. "výpočet výživného při střídavé péči").',
        'Prostudujte si odborné vyjádření advokáta a doporučené paragrafy.',
        'Využijte přímé odkazy na související vzory podání.'
      ],
      tips: 'Pokud nenaleznete odpověď na váš dotaz, odešlete nový anonymní dotaz přes formulář v poradně.',
      relatedTab: 'advice'
    },
    {
      id: 'statni-data-registry',
      name: '🏛️ e-Sbírka & e-Legislativa REST API Portal & Statistika ČSÚ/MPSV',
      category: 'public',
      categoryLabel: '🌐 Veřejná část',
      icon: <Database className="w-5 h-5 text-teal-600" />,
      tag: 'Státní registry',
      purpose: 'Přehled platných předpisů ČR, sledování chystaných legislativních novel a oficiální statistická data ČSÚ a MPSV o délce řízení a podílech střídavé péče.',
      instructions: [
        'Prohlížejte znění platných zákonů (Občanský zákoník, ZOSŘ).',
        'Zobrazte si grafy průměrné délky opatrovnických soudů dle krajů.',
        'Využijte vývojářskou konzoli REST API pro ověření stavu denní vyrovnávací paměti.'
      ],
      tips: 'Statistická data o průměrné délce řízení slouží jako silný argument při žádostech o vydání předběžného opatření.',
      relatedTab: 'state-laws'
    },

    // 🔒 ČÁST PRO PŘIHLÁŠENÉ UŽIVATELE
    {
      id: 'moje-pracovna',
      name: '📂 Moje Pracovna & Osobní Složka (Private Workspace)',
      category: 'private',
      categoryLabel: '🔒 Část pro přihlášené',
      icon: <FolderLock className="w-5 h-5 text-teal-500" />,
      tag: 'Soukromá zóna',
      purpose: 'Zabezpečené řídicí centrum pro vedení osobního spisu, nahrávání soudních listin, SMS komunikace, audionahrávek a správu časové osy případu.',
      instructions: [
        'Přihlaste se ke svému účtu přes Google OAuth nebo biometrický Passkey.',
        'Otevřete sekci "Moje Pracovna" a vytvořte novou složku pro probíhající spisy.',
        'Nahrávejte dokumenty a nahrávky – všechna data jsou AES-256 šifrována.',
        'Zadávejte důležité termíny jednání do osobního kalendáře spisu.'
      ],
      tips: 'Do Pracovny si ukládejte všechny e-maily od OSPOD a druhé strany. AI asistent z nich dokáže automaticky sestavit časovou osu událostí.',
      relatedTab: 'user-portal'
    },
    {
      id: 'identity-hub',
      name: '👤 Profil Hráče / Uživatele & Identity Hub',
      category: 'private',
      categoryLabel: '🔒 Část pro přihlášené',
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      tag: 'Identita & Bezpečnost',
      purpose: 'Správa osobního profilu, nastavení dvoufázového ověření (2FA), biometrického klíče Passkey a propojení více e-mailových adres.',
      instructions: [
        'V horní liště klikněte na ikonu profilu a zvolte "Nastavení účtu".',
        'Aktivujte přihlašování pomocí otisku prstu či obličeje (Passkey biometrie).',
        'Propojte záložní e-mailové adresy pro případ obnovy přístupu.',
        'Zkontrolujte bezpečnostní protokol aktivních přihlášení.'
      ],
      tips: 'Doporučujeme aktivovat biometrický Passkey. Zabránít tím přístupu cizích osob k vašemu citlivému opatrovnickému spisu.',
      relatedTab: 'profile'
    },
    {
      id: 'simulator-pece',
      name: '📊 Simulátor Péče & Sourozenecké Soudržnosti',
      category: 'private',
      categoryLabel: '🔒 Část pro přihlášené',
      icon: <Calculator className="w-5 h-5 text-amber-500" />,
      tag: 'Interaktivní nástroje',
      purpose: '5-krokový interaktivní simulátor pro výpočet procentuálního podílu péče, generování 28denního grafického harmonogramu střídání a hodnocení emoční vazby sourozenců.',
      instructions: [
        'Zadejte počet a věk dětí a zvolte požadovaný model péče (střídavá 7/7, 14/14, rovnocenný interval).',
        'V 28denní mřížce označte dny předávání a víkendy.',
        'Spusťte výpočet emočního indexu a rovnováhy péče.',
        'Vygenerujte a vytiskněte oficiální grafický výstup pro opatrovnický soud a OSPOD.'
      ],
      tips: 'Tiskový výstup ze simulátoru péče obsahuje přesnou procentuální bilanci a odpovídá metodice Ministerstva spravedlnosti.',
      relatedTab: 'plan-pece'
    },
    {
      id: 'centrum-formularu',
      name: '📝 Centrum Formulářů & Chytrý Editor',
      category: 'private',
      categoryLabel: '🔒 Část pro přihlášené',
      icon: <FileCode className="w-5 h-5 text-purple-500" />,
      tag: 'Formuláře & AI Validace',
      purpose: 'Chytrý editor právních podání s automatickou validací ustanovení přes státní API e-Sbírky a kontroly náležitostí pomocí AI auditora.',
      instructions: [
        'Vyberte požadovaný typ podání (Návrh na změnu péče, Vyjádření k návrhu matky, Odvolání).',
        'Vyplňte strukturovaný formulář v průvodci krok za krokem.',
        'Sledujte živý ukazatel "Validace e-Sbírka" – systém ověřuje správnost paragrafových odkazů.',
        'Klikněte na "Spustit AI Audit" pro kontrolu logiky a úpravu emotivního tónu před stisknutím "Exportovat DOCX".'
      ],
      tips: 'AI Auditor automaticky odstraní agresivní či urážlivé formulace a nahradí je věcným právním jazykem.',
      relatedTab: 'centrum-formularu'
    },
    {
      id: 'ai-asistent-pruvodce',
      name: '🤖 AI Právní Asistent (Gemini 1.5 Flash) & Sémantický Průvodce',
      category: 'private',
      categoryLabel: '🔒 Část pro přihlášené',
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      tag: 'AI Umělá Inteligence',
      purpose: 'Konverzační asistent vyškolený na české rodinné právo a taktický generátor strategie podle konkrétní fáze probíhajícího sporu.',
      instructions: [
        'Zadejte popis vaší aktuální situace do chatu AI asistenta.',
        'AI okamžitě analyzuje náležitosti, odkáže na platné paragrafy a doporučí další procesní postup.',
        'Využijte modul "Sémantický průvodce" pro vygenerování podrobného plánu dokazování a přípravy na výslech.'
      ],
      tips: 'AI asistent běží na bezpečné serverové architektuře Google Cloud Run – vaše data neopouští zabezpečený kontext a nejsou použita k trénování public modelů.',
      relatedTab: 'ai-assistant'
    },
    {
      id: 'coparent-hub',
      name: '🤝 Spolurodičovský Hub (CoParent)',
      category: 'private',
      categoryLabel: '🔒 Část pro přihlášené',
      icon: <Network className="w-5 h-5 text-sky-500" />,
      tag: 'Sdílená správa',
      purpose: 'Sdílený kalendář pro plynulé předávání dětí, evidenci mimorádných výdajů (kroužky, léky, školní potřeby) a komunikaci bez zbytečných emotivních konfliktů.',
      instructions: [
        'Zadejte stálý i prázdninový rozvrh předávání dětí.',
        'Zapisujte mimořádné výdaje a nahrávejte účtenky.',
        'Využijte možnost jednostranného vedení (pokud druhá strana nespolupracuje) pro budování oficiálního protokolu k soudu.',
        'Exportujte přehledný měsíční výpis předávání a financí.'
      ],
      tips: 'Jednostranně vedené záznamy o nepředání dětí v CoParent Hubu mají u soudu vysokou důkazní hodnotu, pokud jsou doloženy GPS lokací či fotografií.',
      relatedTab: 'coparent-hub'
    }
  ];

  // Filter modules based on search and selected tab
  const filteredModules = modules.filter(mod => {
    const matchesCategory = activeCategory === 'all' || mod.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTabClick = (tabKey: string) => {
    if (setActiveTab) {
      setActiveTab(tabKey);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-500/10 to-transparent pointer-events-none hidden md:block" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold tracking-wider uppercase">
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span>Synthesis OS — Uživatelský Manuál v1.8</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
            Nápověda & Kompletní průvodce portálem <span className="text-teal-400">Táta má právo</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
            Vítejte v oficiálním uživatelském manuálu. Naše platforma vám poskytuje maximální právní a procesní podporu při ochraně vašich rodičovských práv. Níže naleznete jasná pravidla bezpečnosti a podrobný návod pro každý modul veřejné i soukromé zóny.
          </p>
        </div>
      </div>

      {/* THREE CORE PRINCIPLES OF SYNTHESIS OS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Architektura bezpečnosti</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 font-display">
              3 Základní Pilíře Práce s Portálem
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Principle 1 */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3 relative hover:border-teal-200 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FolderLock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              1. Maximální bezpečí & Soukromí
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Všechna data v vaší <strong>Osobní Pracovně</strong> (spisy, důkazy, audio, zápisy) podléhají end-to-end šifrování (AES-256). K vaší složce nemá přístup nikdo jiný. Podporujeme přihlašování biometrií <strong>Passkey</strong> bez nutnosti hesel.
            </p>
          </div>

          {/* Principle 2 */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3 relative hover:border-teal-200 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              2. Ověřená státní data e-Sbírky
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Právní vzory a formuláře jsou napojeny na oficiální REST API Ministerstva vnitra ČR (e-Sbírka). Náš backend <strong>jednou denně automaticky synchronizuje</strong> legislativní novely. Dokumenty stahujete okamžitě z naší bezpečné DB vyrovnávací paměti.
            </p>
          </div>

          {/* Principle 3 */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3 relative hover:border-teal-200 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              3. Dvojitá kontrola AI Auditorem
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Před odesláním návrhu na soud či OSPOD využijte <strong>AI Právního Auditora</strong>. Vyhodnotí správnost citovaných paragrafů, zkontroluje formální náležitosti a odstraní útočné či emočně zatížené formulace.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Všechny moduly ({modules.length})
          </button>

          <button
            onClick={() => setActiveCategory('public')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'public'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Veřejná část ({modules.filter(m => m.category === 'public').length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('private')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'private'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Část pro přihlášené ({modules.filter(m => m.category === 'private').length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hledat v manuálu (např. SOS, formuláře)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* MODULE CARDS LIST */}
      <div className="space-y-4">
        {filteredModules.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">Nenalezen žádný modul</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Pro zadaný výraz "{searchQuery}" jsme v uživatelském manuálu nenalezli žádnou odpovídající položku.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              Zobrazit všechny moduly
            </button>
          </div>
        ) : (
          filteredModules.map((mod) => {
            const isExpanded = expandedModuleId === mod.id;
            return (
              <div
                key={mod.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isExpanded 
                    ? 'border-teal-500/50 ring-2 ring-teal-500/10 shadow-md' 
                    : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Header Toggle */}
                <div
                  onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/60 shrink-0">
                      {mod.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          mod.category === 'public'
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : 'bg-slate-900 text-white'
                        }`}>
                          {mod.categoryLabel}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {mod.tag}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base md:text-lg mt-1 font-display">
                        {mod.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTabClick(mod.relatedTab);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs hidden sm:flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Otevřít modul</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-6">
                    
                    {/* Purpose Section */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <Info className="w-4 h-4 text-teal-600" />
                        <span>K čemu slouží</span>
                      </div>
                      <p className="text-slate-800 text-sm leading-relaxed">
                        {mod.purpose}
                      </p>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Jak s ním pracovat (Postup krok za krokem)</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mod.instructions.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 text-xs">
                            <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-slate-700 leading-relaxed font-medium">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practical Tip */}
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-amber-950">Doporučení & Tip: </strong>
                        <span className="leading-relaxed">{mod.tips}</span>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleTabClick(mod.relatedTab)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Přejít přímo do modulu</span>
                        <ArrowRight className="w-4 h-4 text-teal-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white font-display">
            Potřebujete individuální konzultaci s AI Asistentem?
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Náš AI Právní Asistent vyškolený na české rodinné právo je vám k dispozici 24/7 pro personalizované odpovědi.
          </p>
        </div>

        <button
          onClick={() => handleTabClick('ai-assistant')}
          className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-md hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Spustit AI Asistenta</span>
        </button>
      </div>

    </div>
  );
}
