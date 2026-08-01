/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Home, 
  FileText, 
  Tv, 
  Scale, 
  BookOpen, 
  Sparkles, 
  MessageSquare, 
  Users, 
  Heart, 
  PhoneCall, 
  UserCheck, 
  Briefcase, 
  Bookmark, 
  Settings, 
  ShieldAlert, 
  Sliders, 
  FolderCheck, 
  Compass,
  Bell, 
  Database, 
  Calculator,
  Activity,
  Layers,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

export interface NavSubItem {
  id: string;
  label: string;
  path?: string;
  desc?: string;
  badge?: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  desc?: string;
  badge?: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  subItems?: NavSubItem[];
}

export interface NavSection {
  id: string;
  title: string;
  isPrivate?: boolean;
  isAdmin?: boolean;
  highlight?: boolean;
  items: NavItem[];
}

// ============================================================================
// SYNTHESIS OS NAVIGATION ARCHITECTURE
// 6 HLAVNÍCH KATEGORIÍ ROZDĚLENÝCH NA VEŘEJNOU ČÁST A ČÁST PRO PŘIHLÁŠENÉ UŽIVATELE
// ============================================================================

// 1. VEŘEJNÁ ČÁST - KATEGORIE 1: 🚨 Krizová pomoc & Komunita
export const KRIZOVA_POMOC_KOMUNITA_ITEMS: NavSubItem[] = [
  { id: 'crisis', label: 'Krizový Akční Plán SOS (První Pomoc)', desc: 'Okamžitý návod krok za krokem při náhlém zadržení dětí či v tísni' },
  { id: 'forum', label: 'Komunitní Diskuzní Fórum', desc: 'Prohlížení a zapojení do moderovaných diskuzí rozdělených podle krajů' },
  { id: 'stories', label: 'Osobní Příběhy Tátů & Memento', desc: 'Reálná svědectví, zkušenosti a poučení z opatrovnických bojů' },
  { id: 'advice', label: 'Právní Poradna & Zodpovězené Dotazy', desc: 'Veřejný archiv již vyřešených dotazů s odpověďmi specialistů' },
  { id: 'support', label: 'Podpora Projektu & Transparentní Dary', desc: 'Informace o financování, QR platby a seznam partnerů/sponzorů' }
];

// 1. VEŘEJNÁ ČÁST - KATEGORIE 2: ⚖️ Opatrovnictví, Právo & Judikatura
export const OPATROVNICTVI_PRAVO_ITEMS: NavSubItem[] = [
  { id: 'opatrovnicka-agenda', label: 'Opatrovnická agenda krok za krokem', desc: 'Kompletní veřejný manuál celým opatrovnickým procesem' },
  { id: 'rights', label: 'Práva Otců & Ústava ČR (LZPS)', desc: 'Přehled ústavních práv a mezinárodních úmluv' },
  { id: 'judikatura', label: 'Precedenty & Judikatura ÚS/NS ČR', desc: 'Veřejný katalog klíčových nálezů soudů pro ochranu práv otců' },
  { id: 'ke-stazeni', label: 'Ke Stažení & Oficiální Dokumenty', desc: 'Stahování ověřených dokumentů přímo z lokální DB (aktualizované denně přes státní API cache)' }
];

// 1. VEŘEJNÁ ČÁST - KATEGORIE 3: 🏛️ Státní Data & Registry
export const STATNI_DATA_REGISTRY_ITEMS: NavSubItem[] = [
  { id: 'e-justice', label: 'e-Sbírka & e-Legislativa REST API Portal', desc: 'Veřejný přehled platných zákonů a sledování chystaných novel' },
  { id: 'knihovna-studii', label: 'ČSÚ & MPSV Demografické & Soudní Statistiky', desc: 'Oficiální statistická data o délkách řízení a střídavé péči' },
  { id: 'judikatura', label: 'Případová Databáze Rozsudků', desc: 'Anonymizovaný přehled reálných rozhodnutí českých soudů' }
];

// 1. VEŘEJNÁ ČÁST - KATEGORIE 4: 🎓 Edukační Akademie
export const EDUKACNI_AKADEMIE_ITEMS: NavSubItem[] = [
  { id: 'knihovna-studii', label: 'Knihovna Vědeckých Studií & Psychologie', desc: 'Odborné texty, výzkumy attachmentu a argumenty pro OSPOD' },
  { id: 'videoteka', label: 'Edukační Videotéka & SmartVideoEmbed', desc: 'Instruktážní videa, rozhovory a záznamy' },
  { id: 'opatrovnicka-agenda', label: 'Akademie Tátů & Interaktivní Kvízy', desc: 'Zátěžové testy a nácvik verbální obhajoby' },
  { id: 'legal-wiki', label: 'Právní Wiki & Slovník Pojmů', desc: 'Srozumitelný výklad právnických a úředních termínů' },
  { id: 'cesta-zakladatele', label: 'Příběh Zakladatele Synthesis OS', desc: 'Osobní memento a filosofie vzniku celého portálu' }
];

// 1. VEŘEJNÁ ČÁST - KATEGORIE 5: ⚙️ Systémové stránky
export const SYSTEMOVE_STRANKY_ITEMS: NavSubItem[] = [
  { id: 'user-manual', label: '📖 Nápověda & Uživatelský manuál', desc: 'Detailní průvodce veřejnou i soukromou částí portálu a AI nástroji' },
  { id: 'news', label: 'Novinky & Systémové Aktualizace (Changelog)', desc: 'Veřejný přehled verzí a změn v systému' },
  { id: 'sitemap', label: 'Architektura & Vývoj Synthesis OS (Sitemap)', desc: 'Kompletní vývojový deník, inventář stránek a technický přehled' }
];

// 2. ODBORNÁ KNIHOVNA (21 Tematických Kategorií pro vyhledávání)
export const ODBORNA_KNIHOVNA_CATEGORIES: NavSubItem[] = [
  { id: 'pece-o-dite', label: 'Péče o dítě', desc: 'Střídavá, společná a výhradní péče, plánování' },
  { id: 'legal-wiki', label: 'Právo', desc: 'Právní řád, občanský zákoník a paragrafy' },
  { id: 'knihovna-studii', label: 'Psychologie', desc: 'Attachment, dětská psychologie a dopady rozvodu' },
  { id: 'ospod', label: 'OSPOD a soudy', desc: 'Jednání s orgány sociálně-právní ochrany a soudní řízení' },
  { id: 'vyvoj-ditete', label: 'Vývoj dítěte', desc: 'Potřeby dětí podle věkových období a adaptace' },
  { id: 'vyzivne', label: 'Finance', desc: 'Kalkulačka výživného, mimořádné výdaje a majetek' },
  { id: 'coparent-hub', label: 'Komunikace rodičů', desc: 'Pravidla komunikace, deeskalace konfliktu a dohody' },
  { id: 'mediace', label: 'Mediace', desc: 'Mimosoudní řešení sporů a rodičovský plán' },
  { id: 'vyzkumy-a-studie', label: 'Výzkumy a studie', desc: 'Empirické vědecké studie ČSÚ, VÚPSV a zahraničí' }
];

// ============================================================================
// STRUKTURA HLAVNÍHO VEŘEJNÉHO MENU (PUBLIC TOPBAR)
// ============================================================================
export const PUBLIC_TOPBAR_ITEMS: NavItem[] = [
  { id: 'home', label: 'Domů', path: '/', icon: Home, desc: 'Titulní strana portálu' },
  { 
    id: 'krizova-komunita', 
    label: 'Krizová pomoc & Komunita', 
    path: '/krize-komunita', 
    icon: PhoneCall, 
    desc: 'SOS plán, komunitní fórum, memento tátů, poradna a podpora',
    subItems: KRIZOVA_POMOC_KOMUNITA_ITEMS
  },
  { 
    id: 'opatrovnictvi-pravo', 
    label: 'Opatrovnictví, Právo & Judikatura', 
    path: '/opatrovnictvi-pravo', 
    icon: Scale, 
    desc: 'Agenda krok za krokem, práva otců, judikatura a ke stažení',
    subItems: OPATROVNICTVI_PRAVO_ITEMS
  },
  { 
    id: 'statni-data-registry', 
    label: 'Státní Data & Registry', 
    path: '/statni-data', 
    icon: Database, 
    desc: 'e-Sbírka REST API portal, ČSÚ/MPSV statistiky a případová databáze',
    subItems: STATNI_DATA_REGISTRY_ITEMS
  },
  { 
    id: 'edukacni-akademie', 
    label: 'Edukační Akademie', 
    path: '/akademie', 
    icon: BookOpen, 
    desc: 'Knihovna studií, videotéka, akademia tátů, právní wiki a memento',
    subItems: EDUKACNI_AKADEMIE_ITEMS
  },
  { 
    id: 'systemove-stranky', 
    label: 'Systémové stránky', 
    path: '/system', 
    icon: Settings, 
    desc: 'Novinky, changelog, architektura a mapa webu Synthesis OS',
    subItems: SYSTEMOVE_STRANKY_ITEMS
  }
];

// ============================================================================
// DYNAMICKÁ SEKCE PRO PŘIHLÁŠENÉ UŽIVATELE (🔒 ČÁST PRO PŘIHLÁŠENÉ UŽIVATELE)
// ============================================================================
export const LOGGED_IN_SECTIONS: NavSection[] = [
  {
    id: 'osobni-pracovna-section',
    title: '📂 Osobní Pracovna & Správa Případu',
    isPrivate: true,
    highlight: true,
    items: [
      {
        id: 'user-portal',
        label: 'Moje Pracovna & Osobní Složka',
        path: '/moj-portal',
        icon: UserCheck,
        desc: 'Soukromé řídicí centrum pro správu vlastních podání a termínů',
        requiresAuth: true
      },
      {
        id: 'profile',
        label: 'Profil Hráče / Uživatele & Identity Hub',
        path: '/moj-portal/profil',
        icon: Settings,
        desc: 'Správa přihlášení (Google OAuth, Passkey) a bezpečnostní audit',
        requiresAuth: true
      },
      {
        id: 'coparent-hub',
        label: 'Spolurodičovský Hub (CoParent)',
        path: '/moj-portal/coparent',
        icon: Sliders,
        desc: 'Sdílený kalendář předávání dětí, výdajů a správu mezi rodiči',
        requiresAuth: true
      }
    ]
  },
  {
    id: 'chytre-ai-nastroje-section',
    title: '🤖 Chytré AI Nástroje & Validace',
    isPrivate: true,
    highlight: true,
    items: [
      {
        id: 'ai-assistant',
        label: 'AI Právní Asistent (Gemini 1.5 Flash)',
        path: '/moj-portal/ai-asistent',
        icon: Sparkles,
        desc: 'Interaktivní konverzační asistent pro personalizované dotazy',
        requiresAuth: true
      },
      {
        id: 'ai-guide',
        label: 'Sémantický AI Průvodce Řízením',
        path: '/moj-portal/ai-pruvodce',
        icon: Compass,
        desc: 'Generování taktického plánu na míru podle fáze sporu',
        requiresAuth: true
      },
      {
        id: 'ai-case-manager',
        label: 'Osobní Složka Případu & AI Strategický Asistent',
        path: '/moj-portal/ai-case-manager',
        icon: Briefcase,
        desc: 'Skenování, sémantický výtah z listin a časová osa důkazů',
        requiresAuth: true
      },
      {
        id: 'plan-pece',
        label: 'Simulátor Péče & Sourozenecké Soudržnosti',
        path: '/moj-portal/simulator-pece',
        icon: Calculator,
        desc: 'Tvorba 28denní mřížky péče a tisk výstupu pro opatrovnický soud',
        requiresAuth: true
      },
      {
        id: 'ke-stazeni',
        label: 'Centrum Formulářů & Chytrý Editor',
        path: '/moj-portal/form-editor',
        icon: FileText,
        desc: 'Dynamický editor podání s automatickou kontrolou přes e-Sbírku',
        requiresAuth: true
      }
    ]
  },
  {
    id: 'administrace-system-section',
    title: '🛠️ Administrace & Systém',
    isPrivate: true,
    highlight: true,
    items: [
      {
        id: 'user-portal',
        label: 'Synthesis OS Rozcestník & Central Hub',
        path: '/moj-portal/hub',
        icon: Layers,
        desc: 'Rychlý rozcestník a přehled stavu systému pro přihlášeného uživatele',
        requiresAuth: true
      },
      {
        id: 'ai-admin',
        label: 'Autonomní AI Admin & Moderátor',
        path: '/admin/ai-admin',
        icon: Sparkles,
        desc: 'Systémový nástroj pro správu obsahu, audit a rešerše na pozadí',
        requiresAdmin: true
      },
      {
        id: 'admin',
        label: 'Administrace & Systémový Monitoring',
        path: '/admin',
        icon: ShieldAlert,
        desc: 'Panel pro správu uživatelů, schvalování obsahu a sledování serveru',
        requiresAdmin: true
      },
      {
        id: 'ai-context',
        label: 'AI Context & Strojový Index',
        path: '/ai-context',
        icon: FolderCheck,
        desc: 'Strojově čitelná data a metadata pro LLM crawlery a integrace'
      }
    ]
  }
];

// ============================================================================
// ADMINISTRACE (PRO ROLE ADMIN / SUPERADMIN)
// ============================================================================
export const ADMIN_SECTION: NavSection = {
  id: 'admin-section',
  title: '👑 ADMINISTRACE',
  isAdmin: true,
  highlight: true,
  items: [
    { id: 'admin', label: 'Dashboard', path: '/admin', icon: ShieldAlert, desc: 'Celkový stav systému a metrik', requiresAdmin: true },
    { id: 'admin', label: 'Obsah (Články, Judikatura, Studie, Videotéka, Dokumenty)', path: '/admin/obsah', icon: FileText, desc: 'Správa publikací, videí a podání', requiresAdmin: true },
    { id: 'admin', label: 'Uživatelé', path: '/admin/uzivatele', icon: Users, desc: 'Správa uživatelských účtů a rolí', requiresAdmin: true },
    { id: 'ai-admin', label: 'AI Admin', path: '/admin/ai', icon: Sparkles, desc: 'Správa LLM modelů, promptů a AI asistenta', requiresAdmin: true },
    { id: 'admin', label: 'Databáze & e-Sbírka Cache', path: '/admin/databaze', icon: Database, desc: 'Stav Firebase, Supabase a e-Sbírka cache', requiresAdmin: true },
    { id: 'admin', label: 'API & Monitoring', path: '/admin/monitoring', icon: Activity, desc: 'Systémový monitoring, logy a zátěž', requiresAdmin: true }
  ]
};


