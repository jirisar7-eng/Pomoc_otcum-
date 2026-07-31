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
// SYNTHESIS AI – NAVIGATION ARCHITECTURE v1.0 (Alpha 0.5.1)
// 6 HLAVNÍCH OBLASTÍ PORTÁLU TÁTA MÁ PRÁVO
// ============================================================================

// 1. HLAVNÍ SLUŽBY
export const HLAVNI_SLUZBY_ITEMS: NavSubItem[] = [
  { id: 'ai-guide', label: 'AI Právní průvodce', desc: 'Krokový AI rádce pro zvolenou strategii sporu' },
  { id: 'ai-case-manager', label: 'Můj případ', desc: 'Sledování spisu, časová osa, kalendář a trezor důkazů' },
  { id: 'ke-stazeni', label: 'Dokumenty a vzory', desc: 'Oficiální vzory podání a formuláře k opatrovnickému soudu' },
  { id: 'judikatura', label: 'Judikatura', desc: 'Přelomové nálezy Ústavního a Nejvyššího soudu ČR' },
  { id: 'videoteka', label: 'Videotéka', desc: 'Instruktážní videa a rozhovory s právníky a psychology' },
  { id: 'crisis', label: 'Krizová pomoc', desc: 'SOS kontakty, krizové linky a urgentní právní pomoc 24/7' }
];

// 2. ODBORNÁ KNIHOVNA (Tematické kategorie)
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

// 3. AI NÁSTROJE
export const AI_NASTROJE_ITEMS: NavSubItem[] = [
  { id: 'ai-assistant', label: 'AI právní asistent', desc: 'Právní konzultace v reálném čase poháněná Gemini AI' },
  { id: 'ai-case-manager', label: 'AI analýza spisu', desc: 'Skenování dokumentů, hledání rozporů a vyhodnocení důkazů' },
  { id: 'ke-stazeni', label: 'AI generátor podání', desc: 'Automatické generování návrhů k soudu na míru' },
  { id: 'knihovna-studii', label: 'AI shrnutí studií', desc: 'Syntetické abstrakty vědeckých výzkumů o střídavé péči' },
  { id: 'ai-guide', label: 'AI doporučení dalšího postupu', desc: 'Krokový návrh dalších procesních úkonů' }
];

// 4. PRAKTICKÉ NÁSTROJE
export const PRAKTICKE_NASTROJE_ITEMS: NavSubItem[] = [
  { id: 'plan-pece', label: 'Simulátor péče', desc: 'Interaktivní modelování střídavé a rovnocenné péče' },
  { id: 'vyzivne', label: 'Kalkulačky', desc: 'Výpočet výživného dle metodiky MSp' },
  { id: 'ai-case-manager', label: 'Evidence důkazů', desc: 'Zabezpečený trezor pro audia, SMS a fotodokumentaci' },
  { id: 'sitemap-timeline', label: 'Časová osa řízení', desc: 'Harmonogram a zákonné lhůty opatrovnického sporu' },
  { id: 'coparent-hub', label: 'Kalendář', desc: 'Sdílený kalendář střídání, prázdnin a kroužků' },
  { id: 'opatrovnicka-agenda', label: 'Checklist řízení', desc: 'Kontrolní seznamy pro soudní jednání a OSPOD' }
];

// 5. KOMUNITA
export const KOMUNITA_ITEMS: NavSubItem[] = [
  { id: 'forum', label: 'Fórum', desc: 'Otevřené diskusní fórum pro sdílení rad a zkušeností' },
  { id: 'stories', label: 'Příběhy rodičů', desc: 'Reálné příběhy otců, matek a jejich dětí' },
  { id: 'videoteka', label: 'Videotéka', desc: 'Videorozhovory a instruktáže odborníků' },
  { id: 'partners', label: 'Partneři', desc: 'Partnerské poradny, advokátní kanceláře a psychologové' },
  { id: 'advice', label: 'Odborníci', desc: 'Poradní panel expertů na opatrovnická práva' }
];

// 6. O PROJEKTU
export const O_PROJEKTU_ITEMS: NavSubItem[] = [
  { id: 'support', label: 'Mise', desc: 'Poslání portálu a prosazování nejlepšího zájmu dítěte' },
  { id: 'cesta-zakladatele', label: 'Zakladatel', desc: 'Příběh Jiřího Šára a osobní motivace ke vzniku' },
  { id: 'contacts', label: 'Kontakt', desc: 'Kontaktní formulář a přímé spojení na redakci' },
  { id: 'support', label: 'Podpora', desc: 'Jak finančně či věcně podpořit provoz portálu' },
  { id: 'partners', label: 'Sponzoři', desc: 'Přehled technologických partnerů a dárců' },
  { id: 'support', label: 'Transparentní rozpočet', desc: 'Otevřené účetnictví a náklady na infrastrukturu' },
  { id: 'rights', label: 'Podmínky', desc: 'Podmínky užívání portálu a právní doložka' },
  { id: 'rights', label: 'Ochrana osobních údajů', desc: 'Zásady zpracování dat a GDPR' },
  { id: 'sitemap', label: 'Mapa webu', desc: 'Kompletní struktura stránek a vývojový log' }
];

// ============================================================================
// STRUKTURA HLAVNÍHO ROZCESTNÍKU (PUBLIC TOPBAR)
// ============================================================================
export const PUBLIC_TOPBAR_ITEMS: NavItem[] = [
  { id: 'home', label: 'Domů', path: '/', icon: Home, desc: 'Titulní strana portálu' },
  { 
    id: 'hlavni-sluzby', 
    label: 'Hlavní služby', 
    path: '/sluzby', 
    icon: Compass, 
    desc: 'Klíčové opatrovnické služby, AI průvodce, vzory a judikatura',
    subItems: HLAVNI_SLUZBY_ITEMS
  },
  { 
    id: 'odborna-knihovna', 
    label: 'Odborná knihovna', 
    path: '/knihovna', 
    icon: BookOpen, 
    desc: 'Tematické kategorie: Péče o dítě, právo, psychologie, OSPOD, finance',
    subItems: ODBORNA_KNIHOVNA_CATEGORIES
  },
  { 
    id: 'ai-nastroje', 
    label: 'AI nástroje', 
    path: '/ai', 
    icon: Sparkles, 
    desc: 'Syntetický AI asistent, analýza spisu, generátor podání',
    subItems: AI_NASTROJE_ITEMS
  },
  { 
    id: 'prakticke-nastroje', 
    label: 'Praktické nástroje', 
    path: '/nastroje', 
    icon: Sliders, 
    desc: 'Simulátor péče, kalkulačka výživného, evidence důkazů',
    subItems: PRAKTICKE_NASTROJE_ITEMS
  },
  { 
    id: 'komunita', 
    label: 'Komunita', 
    path: '/komunita', 
    icon: MessageSquare, 
    desc: 'Fórum, příběhy rodičů, videotéka a partneři',
    subItems: KOMUNITA_ITEMS
  },
  { 
    id: 'o-projektu', 
    label: 'O projektu', 
    path: '/o-projektu', 
    icon: Heart, 
    desc: 'Mise, zakladatel, kontakt, podpora a transparentní účet',
    subItems: O_PROJEKTU_ITEMS
  }
];

// ============================================================================
// DYNAMICKÁ SEKCE PO PŘIHLÁŠENÍ (MŮJ PORTÁL - SOUKROMÁ ZÓNA)
// ============================================================================
export const LOGGED_IN_SECTIONS: NavSection[] = [
  {
    id: 'moj-portal-section',
    title: '👤 MŮJ PORTÁL (Soukromá zóna)',
    isPrivate: true,
    highlight: true,
    items: [
      {
        id: 'user-portal',
        label: 'Dashboard',
        path: '/moj-portal',
        icon: UserCheck,
        desc: 'Přehled osobní situace, skóre a krokový návod',
        requiresAuth: true
      },
      {
        id: 'ai-case-manager',
        label: 'Můj případ',
        path: '/moj-portal/pripad',
        icon: Briefcase,
        desc: 'Kompletní přehled vašeho opatrovnického sporu',
        requiresAuth: true
      },
      {
        id: 'ai-case-manager',
        label: 'Důkazy',
        path: '/moj-portal/dukazy',
        icon: FolderCheck,
        desc: 'Zabezpečený trezor fotografií, SMS a audionahrávek',
        requiresAuth: true
      },
      {
        id: 'ke-stazeni',
        label: 'Dokumenty',
        path: '/moj-portal/dokumenty',
        icon: FileText,
        desc: 'Vygenerované návrhy a rozpracované dokumenty',
        requiresAuth: true
      },
      {
        id: 'coparent-hub',
        label: 'Kalendář',
        path: '/moj-portal/kalendar',
        icon: Sliders,
        desc: 'Sdílený plán střídavé péče, prázdnin a kroužků',
        requiresAuth: true
      },
      {
        id: 'user-portal',
        label: 'Uložené články',
        path: '/moj-portal/ulozene-clanky',
        icon: Bookmark,
        desc: 'Založené studijní texty, judikáty a zákony',
        requiresAuth: true
      },
      {
        id: 'user-portal',
        label: 'Uložená videa',
        path: '/moj-portal/ulozene-videa',
        icon: Tv,
        desc: 'Uložené videorozhovory a metodická videa',
        requiresAuth: true
      },
      {
        id: 'user-portal',
        label: 'Oznámení',
        path: '/moj-portal/oznameni',
        icon: Bell,
        desc: 'Upozornění na termíny soudů a odpovědi ve fóru',
        requiresAuth: true
      },
      {
        id: 'profile',
        label: 'Nastavení účtu',
        path: '/moj-portal/nastaveni',
        icon: Settings,
        desc: 'Osobní profil, biometrika a propojení účtů',
        requiresAuth: true
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
    { id: 'ai-admin', label: 'AI', path: '/admin/ai', icon: Sparkles, desc: 'Správa LLM modelů, promptů a AI asistenta', requiresAdmin: true },
    { id: 'admin', label: 'Databáze', path: '/admin/databaze', icon: Database, desc: 'Stav Firebase, Supabase a Drizzle ORM', requiresAdmin: true },
    { id: 'admin', label: 'API', path: '/admin/api', icon: Layers, desc: 'Aktivní REST API endpointy a e-Sbírka sync', requiresAdmin: true },
    { id: 'admin', label: 'Monitoring', path: '/admin/monitoring', icon: Activity, desc: 'Systémový monitoring, logy a zátěž', requiresAdmin: true },
    { id: 'admin', label: 'AI Tester', path: '/admin/ai-tester', icon: HelpCircle, desc: 'Automatizované testování AI odpovědí', requiresAdmin: true },
    { id: 'admin', label: 'Audit', path: '/admin/audit', icon: Compass, desc: 'Bezpečnostní audit a logy aktivních relací', requiresAdmin: true },
    { id: 'admin', label: 'Nastavení', path: '/admin/nastaveni', icon: Settings, desc: 'Konfigurace Synthesis OS a portálu', requiresAdmin: true }
  ]
};

