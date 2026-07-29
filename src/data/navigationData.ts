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

// 1. HLAVNÍ TOPBAR / VISIBLE MENU (Pro všechny / Public - Max 8 hlavních sekcí)
export const PUBLIC_TOPBAR_ITEMS: NavItem[] = [
  { id: 'home', label: 'Domů', path: '/', icon: Home, desc: 'Titulní strana portálu' },
  { id: 'opatrovnicka-agenda', label: 'Průvodce opatrovnictvím', path: '/opatrovnicka-agenda', icon: Compass, desc: 'Krokový průvodce opatrovnickým řízením, OSPOD a soudem' },
  { 
    id: 'judikatura', 
    label: 'Právní knihovna', 
    path: '/judikatura', 
    icon: Scale, 
    desc: 'Judikatura Ústavního soudu, vědecké studie, vzory podání a právní řád',
    subItems: [
      { id: 'judikatura', label: 'Judikatura ÚS ČR', desc: 'Nálezy Ústavního soudu a přelomové judikáty' },
      { id: 'knihovna-studii', label: 'Vědecké studie', desc: 'Výzkumy, attachment a střídavá péče' },
      { id: 'ke-stazeni', label: 'Vzory podání & Dokumenty', desc: 'Připravené formuláře a podání k soudu' },
      { id: 'legal-wiki', label: 'Právní řád & Zákoník', desc: 'Právní wiki a paragrafové znění' },
      { id: 'news', label: 'Odborné články', desc: 'Metodické návody a redakční texty' }
    ]
  },
  { id: 'videoteka', label: 'Videotéka', path: '/videoteka', icon: Tv, desc: 'Instruktážní videa a rozhovory s odborníky' },
  { id: 'ai-assistant', label: 'AI pomocník', path: '/ai', icon: Sparkles, desc: 'Syntetický právní poradce a rozbor spisu' },
  { 
    id: 'forum', 
    label: 'Komunita', 
    path: '/komunita', 
    icon: MessageSquare, 
    desc: 'Diskusní fórum, příběhy otců a rodičovský hub',
    subItems: [
      { id: 'forum', label: 'Diskusní fórum', desc: 'Otevřené diskuse k opatrovnictví a OSPOD' },
      { id: 'stories', label: 'Příběhy otců', desc: 'Sdílená zkušenost rodičů v praxi' },
      { id: 'coparent-hub', label: 'Rodičovský Hub', desc: 'Společný kalendář, výdaje a dohody' }
    ]
  },
  { 
    id: 'support', 
    label: 'Podpora projektu', 
    path: '/podpora', 
    icon: Heart, 
    desc: 'Informace o poslání, transparentní účet a podporující organizace',
    subItems: [
      { id: 'support', label: 'O portálu & Podpora', desc: 'Poslání portálu a transparentní vývoj' },
      { id: 'partners', label: 'Partneři & Advokáti', desc: 'Spolupracující organizace a poradny' },
      { id: 'crisis', label: 'Krizová pomoc 24/7', desc: 'Kontakty na SOS linky a psychologickou pomoc' }
    ]
  },
  { 
    id: 'cesta-zakladatele', 
    label: 'O projektu', 
    path: '/cesta-zakladatele', 
    icon: BookOpen, 
    desc: 'Příběh zakladatele, kontakty a vývojový Tech Lab',
    subItems: [
      { id: 'cesta-zakladatele', label: 'Příběh zakladatele', desc: 'Motivace a otevřený spis boje za syna' },
      { id: 'contacts', label: 'Kontakt na autora', desc: 'Přímé spojení na Jiřího Šára' },
      { id: 'sitemap', label: 'Vývoj projektu (Tech Lab)', desc: 'Roadmapa, architektura Synthesis OS a stav systému' }
    ]
  }
];

// 2. DYNAMICKÁ SEKCE - AŽ PO PŘIHLÁŠENÍ (Můj portál)
export const LOGGED_IN_SECTIONS: NavSection[] = [
  {
    id: 'moj-portal-section',
    title: '👤 MŮJ PORTÁL (Osobní zóna)',
    isPrivate: true,
    highlight: true,
    items: [
      {
        id: 'user-portal',
        label: 'Přehled',
        path: '/moj-portal',
        icon: UserCheck,
        desc: 'Osobní dashboard, skóre připravenosti a krokový návod.',
        requiresAuth: true
      },
      {
        id: 'ai-case-manager',
        label: 'Můj případ',
        path: '/moj-portal/pripad',
        icon: Briefcase,
        desc: 'Časová osa sporu, kalendář předávání, trezor důkazů a poznámky.',
        requiresAuth: true
      },
      {
        id: 'coparent-hub',
        label: 'Kalendář & Rodičovský Hub',
        path: '/moj-portal/kalendar',
        icon: Sliders,
        desc: 'Sdílený kalendář dětí, výdaje a plánování péče.',
        requiresAuth: true
      },
      {
        id: 'ke-stazeni',
        label: 'Dokumenty & Důkazy',
        path: '/moj-portal/dokumenty',
        icon: FolderCheck,
        desc: 'Generátor návrhů k soudu, uložení spisu a podkladů.',
        requiresAuth: true
      },
      {
        id: 'user-portal',
        label: 'Uložené články & Videa',
        path: '/moj-portal/ulozene',
        icon: Bookmark,
        desc: 'Založené studijní materiály, judikáty a rozsudky.',
        requiresAuth: true
      },
      {
        id: 'ai-guide',
        label: 'AI strategie',
        path: '/moj-portal/strategie',
        icon: Sparkles,
        desc: 'Personalizovaný AI rádce pro zvolenou strategii sporu.',
        requiresAuth: true
      },
      {
        id: 'profile',
        label: 'Nastavení & Profil',
        path: '/moj-portal/nastaveni',
        icon: Settings,
        desc: 'Identitní Hub, Google OAuth, biometrika a přihlášení.',
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
      label: 'Dashboard',
      path: '/admin',
      icon: ShieldAlert,
      desc: 'Souhrnný přehled návštěvnosti, aktivity a stavu systému.',
      requiresAdmin: true
    },
    {
      id: 'admin',
      label: 'Obsah (Články, Studie, Judikatura)',
      path: '/admin/redakce',
      icon: FileText,
      desc: 'Správa publikovaných článků, videí, judikátů a studií.',
      requiresAdmin: true
    },
    {
      id: 'admin',
      label: 'Partneři & Fórum',
      path: '/admin/komunita',
      icon: Users,
      desc: 'Moderace příspěvků, schvalování příběhů a správa partnerů.',
      requiresAdmin: true
    },
    {
      id: 'ai-admin',
      label: 'AI Centrum & Doručování',
      path: '/admin/ai-system',
      icon: Database,
      desc: 'Audit logy, AI Asistent, zálohy a nastavení LLM.',
      requiresAdmin: true
    },
    {
      id: 'sitemap',
      label: 'Vývoj projektu (Tech Lab)',
      path: '/admin/tech-lab',
      icon: Compass,
      desc: 'Architektura Synthesis OS, monitoring a stav vývoje.',
      requiresAdmin: true
    }
  ]
};
