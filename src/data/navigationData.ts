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
  Bell, 
  Database, 
  LucideIcon
} from 'lucide-react';

export interface NavSubItem {
  id: string;
  label: string;
  path?: string;
  desc?: string;
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

// 1. HLAVNÍ TOPBAR / VISIBLE MENU (Pro všechny / Public)
export const PUBLIC_TOPBAR_ITEMS: NavItem[] = [
  { id: 'home', label: 'Domů', path: '/', icon: Home, desc: 'Titulní strana portálu' },
  { id: 'news', label: 'Články', path: '/clanky', icon: FileText, desc: 'Odborné články a info báze' },
  { id: 'videoteka', label: 'Videotéka', path: '/videoteka', icon: Tv, desc: 'Instruktážní videa a přednášky' },
  { id: 'moje-dokumenty', label: 'Moje dokumenty', path: '/moje-dokumenty', icon: FolderCheck, desc: 'Anonymizované reálné případy a podání (1 dokument = 1 stránka)' },
  { id: 'judikatura', label: 'Judikatura', path: '/judikatura', icon: Scale, desc: 'Nálezy Ústavního soudu a rozsudky' },
  { id: 'knihovna-studii', label: 'Studie', path: '/studie', icon: BookOpen, desc: 'Vědecké publikace a výzkumy' },
  { id: 'ai-assistant', label: 'AI Nástroje', path: '/ai', icon: Sparkles, desc: 'Generativní AI Právní asistent' },
  { id: 'forum', label: 'Komunita', path: '/komunita', icon: MessageSquare, desc: 'Diskusní fórum a příběhy' },
  { id: 'partners', label: 'Partneři', path: '/partneri', icon: Users, desc: 'Podporující organizace a advokáti' },
  { id: 'support', label: 'Podpora', path: '/podpora', icon: Heart, desc: 'Finanční a morální podpora vývoje' },
  { id: 'contacts', label: 'Kontakt', path: '/kontakt', icon: PhoneCall, desc: 'Kontaktní údaje a SOS linky' }
];

// 2. DYNAMICKÁ SEKCE - AŽ PO PŘIHLÁŠENÍ (if user isLoggedIn)
export const LOGGED_IN_SECTIONS: NavSection[] = [
  {
    id: 'moj-portal-section',
    title: '👤 MŮJ PORTÁL',
    isPrivate: true,
    highlight: true,
    items: [
      {
        id: 'user-portal',
        label: 'Přehled & Můj postup',
        path: '/moj-portal',
        icon: UserCheck,
        desc: 'Osobní dashboard, skóre připravenosti a krokový návod.',
        requiresAuth: true
      },
      {
        id: 'ai-case-manager',
        label: 'Můj případ & Důkazy',
        path: '/moj-portal/pripad',
        icon: Briefcase,
        desc: 'Časová osa sporu, kalendář předávání, trezor důkazů a poznámky.',
        requiresAuth: true
      },
      {
        id: 'coparent-hub',
        label: 'Rodičovský Hub (CoParent)',
        path: '/moj-portal/coparent',
        icon: Sliders,
        desc: 'Sdílený kalendář dětí, výdaje a plánování péče.',
        requiresAuth: true
      },
      {
        id: 'profile',
        label: 'Nastavení účtu & Passkey',
        path: '/moj-portal/nastaveni',
        icon: Settings,
        desc: 'Identitní Hub, Google OAuth, biometrika a přihlášení.',
        requiresAuth: true
      }
    ]
  },
  {
    id: 'komunita-extended',
    title: '💬 KOMUNITA (Rozšířený režim)',
    isPrivate: true,
    items: [
      {
        id: 'forum',
        label: 'Fórum & Diskuze',
        path: '/komunita/diskuze',
        icon: MessageSquare,
        desc: 'Témata k opatrovnictví, OSPODu a střídavé péči.',
        requiresAuth: true
      },
      {
        id: 'stories',
        label: 'Mé příspěvky & Příběhy',
        path: '/komunita/pribehy',
        icon: BookOpen,
        desc: 'Sdílené příběhy otců a autorství.',
        requiresAuth: true
      }
    ]
  },
  {
    id: 'ai-unified-center',
    title: '🤖 AI NÁSTROJE (Sjednocené centrum)',
    isPrivate: true,
    items: [
      {
        id: 'ai-guide',
        label: 'AI Průvodce',
        path: '/ai/pruvodce',
        icon: Sparkles,
        desc: 'Interaktivní průvodce opatrovnickým řízením.',
        requiresAuth: true
      },
      {
        id: 'ai-case-manager',
        label: 'AI Analýza případu',
        path: '/ai/analyza',
        icon: Briefcase,
        desc: 'Hloubková kontrola podkladů a chronologie spisu.',
        requiresAuth: true
      },
      {
        id: 'ke-stazeni',
        label: 'Generátor podání',
        path: '/ai/podani',
        icon: FolderCheck,
        desc: 'Automatizovaný výgener návrhů k soudu a OSPOD.',
        requiresAuth: true
      },
      {
        id: 'knihovna-studii',
        label: 'AI Překlad studií',
        path: '/ai/studie-preklad',
        icon: BookOpen,
        desc: 'Sémantická rešerše zahraničních vědeckých výzkumů.',
        requiresAuth: true
      },
      {
        id: 'judikatura',
        label: 'AI Shrnutí rozsudků',
        path: '/ai/rozsudky',
        icon: Scale,
        desc: 'Analýza judikátů a nálezů Ústavního soudu ČR.',
        requiresAuth: true
      }
    ]
  }
];

// 3. ADMINISTRACE (if user.role === 'admin' || user.role === 'superadmin')
export const ADMIN_SECTION: NavSection = {
  id: 'admin-section',
  title: '👑 ADMINISTRACE',
  isAdmin: true,
  highlight: true,
  items: [
    {
      id: 'admin',
      label: 'Dashboard & Statistiky',
      path: '/admin',
      icon: ShieldAlert,
      desc: 'Souhrnný přehled návštěvnosti, aktivity a stavu systému.',
      requiresAdmin: true
    },
    {
      id: 'admin',
      label: 'Redakční správce',
      path: '/admin/redakce',
      icon: FileText,
      desc: 'Správa článků, videí, judikatury a studií.',
      requiresAdmin: true
    },
    {
      id: 'ai-admin',
      label: 'Systém & AI Doručování',
      path: '/admin/ai-system',
      icon: Database,
      desc: 'Audit logy, AI Asistent, zálohy a nastavení LLM.',
      requiresAdmin: true
    }
  ]
};
