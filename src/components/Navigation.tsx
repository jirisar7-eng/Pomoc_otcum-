/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import portalLogo from '../assets/images/portal_logo.png';
import { 
  Search, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  UserPlus,
  Shield, 
  Sparkles, 
  Home, 
  BookOpen, 
  Heart, 
  ChevronDown, 
  ChevronRight,
  UserCheck,
  Bell,
  Scale,
  FileText,
  Tv,
  Users,
  Bug,
  PhoneCall,
  MessageSquare,
  Briefcase,
  Sliders,
  Settings,
  ShieldAlert,
  Database,
  FolderCheck,
  Layers,
  Mail,
  Compass,
  Star,
  Clock,
  Command,
  HelpCircle,
  HeartHandshake,
  Building,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../lib/LanguageContext';
import UniversalSearchInput from './UniversalSearchInput';
import NotificationCenter from './NotificationCenter';
import { HUB_CATEGORIES } from '../data/contentHub';
import { 
  PUBLIC_TOPBAR_ITEMS, 
  LOGGED_IN_SECTIONS, 
  ADMIN_SECTION,
  NavItem,
  NavSection
} from '../data/navigationData';

const CATEGORY_TAB_MAP: Record<string, { tab: string; search: string }> = {
  'pravni-rad': { tab: 'legal-wiki', search: 'Právní řád' },
  'judikatura': { tab: 'judikatura', search: 'Judikatura' },
  'stridava-pece': { tab: 'pece-o-dite', search: 'Střídavá péče' },
  'nocni-pece': { tab: 'knihovna-studii', search: 'Noční péče' },
  'psychologie-attachment': { tab: 'knihovna-studii', search: 'Attachment' },
  'rodicovska-alienace': { tab: 'news', search: 'Rodičovská alienace' },
  'jednani-ospod': { tab: 'ospod', search: 'OSPOD' },
  'vzory-podani': { tab: 'ke-stazeni', search: 'Vzory' },
  'vyzivne-majetek': { tab: 'vyzivne', search: 'Výživné' },
  'zdravi-vyvoj': { tab: 'pece-o-dite', search: 'Zdraví' },
  'vzdelavani-cas': { tab: 'news', search: 'Vzdělávání' },
  'komunikace-rodice': { tab: 'coparent-hub', search: 'Komunikace' },
  'krizova-pomoc': { tab: 'crisis', search: 'Krizová pomoc' },
  'falesna-obvineni': { tab: 'news', search: 'Falešná obvinění' },
  'mezinarodni-pravo': { tab: 'soudni-rizeni', search: 'Mezinárodní' },
  'sirsi-rodina': { tab: 'news', search: 'Prarodiče' },
  'znalecke-posudky': { tab: 'soudni-rizeni', search: 'Znalecké posudky' },
  'kritika-studii': { tab: 'knihovna-studii', search: 'Kritika' },
  'technologie-ai': { tab: 'ai-assistant', search: 'AI' },
  'e-justice': { tab: 'e-justice', search: 'e-Justice' },
  'komunita-zkusenosti': { tab: 'forum', search: 'Diskuze' },
  'statistiky-vyzkumy': { tab: 'knihovna-studii', search: 'Statistiky' }
};

const PAGE_LABELS: Record<string, string> = {
  'home': 'Domů',
  'ai-guide': 'AI Právní průvodce',
  'ai-case-manager': 'Můj případ & Důkazy',
  'e-justice': 'e-Justice & Digitalizace',
  'ke-stazeni': 'Dokumenty a vzory',
  'judikatura': 'Judikatura',
  'videoteka': 'Videotéka',
  'crisis': 'Krizová pomoc 24/7',
  'ai-assistant': 'AI Asistent',
  'knihovna-studii': 'Vědecké studie',
  'legal-wiki': 'PrávníWiki',
  'plan-pece': 'Simulátor péče',
  'coparent-hub': 'Rodičovský Hub',
  'opatrovnicka-agenda': 'Průvodce opatrovnictvím',
  'life-situation': 'Životní situace & Zázemí po rozchodu',
  'forum': 'Fórum',
  'stories': 'Příběhy rodičů',
  'partners': 'Partneři',
  'advice': 'Odborníci',
  'support': 'Podpora & Mise',
  'cesta-zakladatele': 'Příběh zakladatele',
  'contacts': 'Kontakt',
  'rights': 'Podmínky & GDPR',
  'sitemap': 'Mapa webu',
  'user-portal': 'Můj portál - Dashboard',
  'profile': 'Nastavení profilu',
  'admin': 'Administrace'
};

interface ModuleCapsuleCardProps {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
  accent?: 'red' | 'green' | 'teal' | 'indigo' | 'amber' | 'rose' | 'sky' | 'purple' | 'default';
  requiresAuth?: boolean;
  isLoggedIn?: boolean;
  isActive: boolean;
  onClick: () => void;
}

const ModuleCapsuleCard: React.FC<ModuleCapsuleCardProps> = ({ 
  label, 
  desc, 
  icon, 
  badge, 
  accent = 'default', 
  requiresAuth, 
  isLoggedIn, 
  isActive, 
  onClick 
}) => {
  let containerStyles = "bg-white border-slate-200/90 hover:border-teal-400/80 hover:bg-slate-50/90 text-slate-800 shadow-2xs";
  let iconStyles = "bg-slate-100 border-slate-200 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-700 group-hover:border-teal-200";
  let badgeStyles = "bg-slate-100 text-slate-700 border-slate-200 font-bold";

  if (accent === 'red') {
    containerStyles = isActive 
      ? "bg-rose-600 border-rose-700 text-white shadow-md ring-2 ring-rose-300" 
      : "bg-rose-50/90 hover:bg-rose-100/90 border-rose-200/90 hover:border-rose-300 text-rose-950 shadow-2xs";
    iconStyles = isActive ? "bg-rose-700 text-white border-rose-600" : "bg-rose-600 text-white border-rose-500 shadow-3xs";
    badgeStyles = "bg-rose-600 text-white font-black animate-pulse";
  } else if (accent === 'rose') {
    containerStyles = isActive 
      ? "bg-rose-600 border-rose-700 text-white shadow-md ring-2 ring-rose-300" 
      : "bg-rose-50/90 hover:bg-rose-100/90 border-rose-200/90 hover:border-rose-300 text-rose-950 shadow-2xs";
    iconStyles = isActive ? "bg-rose-700 text-white border-rose-600" : "bg-rose-600 text-white border-rose-500 shadow-3xs";
    badgeStyles = "bg-rose-600 text-white font-extrabold";
  } else if (accent === 'green') {
    containerStyles = isActive 
      ? "bg-emerald-600 border-emerald-700 text-white shadow-md ring-2 ring-emerald-300" 
      : "bg-emerald-50/90 hover:bg-emerald-100/90 border-emerald-200/90 hover:border-emerald-300 text-emerald-950 shadow-2xs";
    iconStyles = isActive ? "bg-emerald-700 text-white border-emerald-600" : "bg-emerald-600 text-white border-emerald-500 shadow-3xs";
    badgeStyles = "bg-emerald-700 text-white font-extrabold";
  } else if (accent === 'teal') {
    containerStyles = isActive 
      ? "bg-teal-600 border-teal-700 text-white shadow-md ring-2 ring-teal-300" 
      : "bg-teal-50/90 hover:bg-teal-100/90 border-teal-200/90 hover:border-teal-300 text-teal-950 shadow-2xs";
    iconStyles = isActive ? "bg-teal-700 text-white border-teal-600" : "bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-teal-400 shadow-3xs";
    badgeStyles = "bg-teal-600 text-white font-extrabold";
  } else if (accent === 'indigo') {
    containerStyles = isActive 
      ? "bg-indigo-600 border-indigo-700 text-white shadow-md ring-2 ring-indigo-300" 
      : "bg-indigo-50/90 hover:bg-indigo-100/90 border-indigo-200/90 hover:border-indigo-300 text-indigo-950 shadow-2xs";
    iconStyles = isActive ? "bg-indigo-700 text-white border-indigo-600" : "bg-indigo-600 text-white border-indigo-500 shadow-3xs";
    badgeStyles = "bg-indigo-600 text-white font-extrabold";
  } else if (accent === 'amber') {
    containerStyles = isActive 
      ? "bg-amber-600 border-amber-700 text-white shadow-md ring-2 ring-amber-300" 
      : "bg-amber-50/90 hover:bg-amber-100/90 border-amber-200/90 hover:border-amber-300 text-amber-950 shadow-2xs";
    iconStyles = isActive ? "bg-amber-700 text-white border-amber-600" : "bg-amber-600 text-white border-amber-500 shadow-3xs";
    badgeStyles = "bg-amber-600 text-white font-extrabold";
  } else if (accent === 'sky') {
    containerStyles = isActive 
      ? "bg-sky-600 border-sky-700 text-white shadow-md ring-2 ring-sky-300" 
      : "bg-sky-50/90 hover:bg-sky-100/90 border-sky-200/90 hover:border-sky-300 text-sky-950 shadow-2xs";
    iconStyles = isActive ? "bg-sky-700 text-white border-sky-600" : "bg-sky-600 text-white border-sky-500 shadow-3xs";
    badgeStyles = "bg-sky-600 text-white font-extrabold";
  } else if (accent === 'purple') {
    containerStyles = isActive 
      ? "bg-purple-600 border-purple-700 text-white shadow-md ring-2 ring-purple-300" 
      : "bg-purple-50/90 hover:bg-purple-100/90 border-purple-200/90 hover:border-purple-300 text-purple-950 shadow-2xs";
    iconStyles = isActive ? "bg-purple-700 text-white border-purple-600" : "bg-purple-600 text-white border-purple-500 shadow-3xs";
    badgeStyles = "bg-purple-600 text-white font-extrabold";
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3 group relative ${containerStyles}`}
    >
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 ${iconStyles}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5">
          <span className={`font-bold text-xs sm:text-sm block truncate leading-tight ${isActive ? 'text-white' : ''}`}>
            {label}
          </span>
          {badge && (
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md uppercase tracking-wider shrink-0 ${badgeStyles}`}>
              {badge}
            </span>
          )}
          {requiresAuth && !isLoggedIn && (
            <span className="text-[9px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md font-bold shrink-0 flex items-center gap-0.5" title="Vyžaduje přihlášení">
              🔒 VIP
            </span>
          )}
        </div>
        <p className={`text-[11px] leading-snug line-clamp-2 mt-0.5 ${
          isActive ? 'text-white/90 font-medium' : accent !== 'default' ? 'text-slate-600' : 'text-slate-500'
        }`}>
          {desc}
        </p>
      </div>

      <ChevronRight className={`w-4 h-4 shrink-0 self-center transition-transform duration-200 group-hover:translate-x-0.5 ${
        isActive ? 'text-white/80' : 'text-slate-300 group-hover:text-teal-600'
      }`} />
    </button>
  );
};

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  searchQuery,
  setSearchQuery
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [navTab, setNavTab] = useState<'public' | 'private'>('public');
  const [topicsAccordionOpen, setTopicsAccordionOpen] = useState(false);
  const [quickNavAccordionOpen, setQuickNavAccordionOpen] = useState(false);
  const [aboutAccordionOpen, setAboutAccordionOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Smart Navigation Features State (LocalStorage persistence)
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('synthesis_favorite_pages');
        return saved ? JSON.parse(saved) : ['ai-guide', 'judikatura', 'ke-stazeni'];
      } catch (e) {
        return ['ai-guide', 'judikatura', 'ke-stazeni'];
      }
    }
    return ['ai-guide', 'judikatura', 'ke-stazeni'];
  });

  const [recentPages, setRecentPages] = useState<{ id: string; label: string; time: string }[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('synthesis_recent_pages');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Track recent pages when activeTab changes
  useEffect(() => {
    if (!activeTab) return;
    const label = PAGE_LABELS[activeTab] || activeTab;
    const time = new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });

    setRecentPages(prev => {
      const filtered = prev.filter(p => p.id !== activeTab);
      const updated = [{ id: activeTab, label, time }, ...filtered].slice(0, 5);
      if (typeof window !== 'undefined') {
        localStorage.setItem('synthesis_recent_pages', JSON.stringify(updated));
      }
      return updated;
    });
  }, [activeTab]);

  // Toggle favorite page
  const toggleFavorite = (tabId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(tabId) ? prev.filter(id => id !== tabId) : [...prev, tabId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('synthesis_favorite_pages', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Keyboard shortcut listener (Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCategories = useMemo(() => {
    if (!categoryFilter.trim()) return HUB_CATEGORIES;
    const q = categoryFilter.toLowerCase();
    return HUB_CATEGORIES.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) || 
      c.slug.toLowerCase().includes(q)
    );
  }, [categoryFilter]);

  const { t, language } = useLanguage();

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (categorySlug: string, categoryName: string) => {
    setActiveTab(`category-${categorySlug}`);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs relative">
      {/* Official Top Announcement Bar (Pevně nahoře jako první prvek - viditelné pouze na velkém desktopu xl: výše) */}
      <div className="hidden xl:flex bg-gradient-to-r from-amber-500 via-teal-600 to-indigo-700 text-white text-[11px] font-mono py-1.5 px-3 sm:px-4 text-center items-center justify-center gap-x-2 gap-y-1 font-semibold border-b border-amber-400/20 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse shrink-0" />
        <span className="truncate max-w-[95vw] md:max-w-none">
          {t('hero_welcome', 'Oficiální spuštění verze Beta 0.0.1 portálu Táta má právo! 🚀')}
        </span>
        <span className="hidden sm:inline text-amber-200/80">•</span>
        <span className="hidden md:inline text-[10px] text-teal-100 font-sans">
          {isLoggedIn 
            ? `Přihlášen jako ${currentUser.name} (${currentUser.role === 'admin' ? 'Administrátor' : 'Rodič'})`
            : 'Sjednocená platforma: Judikatura • AI Analýza • Simulátor péče'}
        </span>
      </div>

      {/* Main Header Bar (Logo, XL Navigation, Search & User Profile) */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 border-b border-slate-100/80">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto min-h-[56px] md:min-h-[64px] py-2 gap-2 sm:gap-3">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => handleTabClick('home')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-slate-700/50 shadow-sm overflow-hidden flex items-center justify-center shrink-0 p-0.5">
              {logoError ? (
                <Shield className="w-5 h-5 text-teal-400" />
              ) : (
                <img 
                  src="/portal_logo.png" 
                  alt="Táta má právo Logo" 
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    setLogoError(true);
                  }}
                />
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-bold text-slate-800 text-sm sm:text-base tracking-tight font-display flex items-center gap-1 leading-none whitespace-nowrap">
                {language === 'sk' ? (
                  <>Otec má <span className="text-teal-600">právo</span></>
                ) : language === 'en' ? (
                  <>Father Has <span className="text-teal-600">Rights</span></>
                ) : (
                  <>Táta má <span className="text-teal-600">právo</span></>
                )}
              </span>
              <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase font-medium mt-0.5">
                Synthesis OS
              </span>
            </div>
          </div>

          {/* Responsive Desktop Navigation Topbar (XL screens 1280px+ only to prevent tablet overlaps) */}
          <nav className="hidden xl:flex items-center justify-center gap-1.5 py-1">
            {/* 1. MAIN MEGA MENU BUTTON (2-Tab Module Directory) */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('main-mega-menu')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'main-mega-menu' ? null : 'main-mega-menu')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer whitespace-nowrap shadow-3xs ${
                  openDropdown === 'main-mega-menu'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-800'
                }`}
                title="Kompletní rozcestník veřejné a chráněné části"
              >
                <Compass className="w-4 h-4 text-teal-400" />
                <span>Rozcestník modulů</span>
                <span className="px-1.5 py-0.2 bg-teal-500/20 text-teal-300 text-[10px] font-mono font-extrabold rounded-md">
                  2 ZÁLOŽKY
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'main-mega-menu' ? 'rotate-180 text-teal-400' : 'text-slate-400'}`} />
              </button>

              {/* REDESIGNED 2-TAB MEGA DROPDOWN MENU */}
              {openDropdown === 'main-mega-menu' && (
                <div className="absolute left-0 mt-1 w-[92vw] max-w-[900px] bg-white border border-slate-200/90 rounded-3xl shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in duration-150">
                  {/* Header & Main 2-Tabs Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display leading-tight">
                          Rozcestník modulů a služeb
                        </h3>
                        <p className="text-[11px] text-slate-400">Synthesis OS • Přehled všech veřejných a neveřejných nástrojů</p>
                      </div>
                    </div>

                    {/* THE TWO MAIN TABS (Veřejná část vs Část pro přihlášené uživatele) */}
                    <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNavTab('public');
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          navTab === 'public'
                            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-extrabold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>🌐</span>
                        <span>Veřejná část</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNavTab('private');
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          navTab === 'private'
                            ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-xs font-extrabold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>🔒</span>
                        <span>Část pro přihlášené</span>
                        {isLoggedIn ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
                        ) : (
                          <span className="text-[9px] font-mono bg-amber-100 text-amber-800 px-1 rounded font-bold">VIP</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* TAB CONTENT: 🌐 VEŘEJNÁ ČÁST */}
                  {navTab === 'public' && (
                    <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                      
                      {/* Category 1: Opatrovnictví & Práva Otce */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                          <Scale className="w-3 h-3 text-amber-500" />
                          <span>Opatrovnictví &amp; Práva Otce</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          <ModuleCapsuleCard
                            id="opatrovnicka-agenda"
                            label="Opatrovnický Průvodce"
                            desc="Kompletní procesní manuál krok za krokem od návrhu po rozsudek"
                            icon={<Compass className="w-5 h-5 text-teal-600" />}
                            badge="NÁVOD"
                            accent="teal"
                            isActive={activeTab === 'opatrovnicka-agenda'}
                            onClick={() => handleTabClick('opatrovnicka-agenda')}
                          />

                          <ModuleCapsuleCard
                            id="plan-pece"
                            label="Střídavá Péče & Simulátor"
                            desc="Matematická 28denní mřížka péče a harmonogram úpravy styků"
                            icon={<Sliders className="w-5 h-5 text-amber-600" />}
                            badge="PÉČE"
                            accent="amber"
                            isActive={activeTab === 'plan-pece'}
                            onClick={() => handleTabClick('plan-pece')}
                          />

                          <ModuleCapsuleCard
                            id="judikatura"
                            label="Judikatura ÚS & Precedenty"
                            desc="Precedentní nálezy a judikátní argumentace pro ochranu práv otce"
                            icon={<Scale className="w-5 h-5 text-amber-600" />}
                            badge="ÚS ČR"
                            accent="amber"
                            isActive={activeTab === 'judikatura'}
                            onClick={() => handleTabClick('judikatura')}
                          />

                          <ModuleCapsuleCard
                            id="ke-stazeni"
                            label="Vzory Podání & Dokumenty"
                            desc="Ověřené právní šablony, žaloby a úřední dokumenty ke stažení"
                            icon={<FolderCheck className="w-5 h-5 text-emerald-600" />}
                            badge="DOCX/PDF"
                            accent="green"
                            isActive={activeTab === 'ke-stazeni'}
                            onClick={() => handleTabClick('ke-stazeni')}
                          />

                          <ModuleCapsuleCard
                            id="rights"
                            label="Práva Otců & Ústava ČR"
                            desc="Garantovaná ústavní práva na rodičovskou péči podle Listiny"
                            icon={<Shield className="w-5 h-5 text-sky-600" />}
                            accent="sky"
                            isActive={activeTab === 'rights'}
                            onClick={() => handleTabClick('rights')}
                          />
                        </div>
                      </div>

                      {/* Category 2: Životní situace & Zázemí po rozchodu (NEW SUPPORT SECTION) */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-teal-600 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1 border-t border-slate-100 pt-3">
                          <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                          <span>Životní situace &amp; Zázemí po rozchodu</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          <ModuleCapsuleCard
                            id="majetek-sjm"
                            label="SJM & Majetkové vypořádání"
                            desc="Vypořádání majetku, hypotéky, dluhů a krizový rozpočet po rozchodu"
                            icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
                            badge="SJM"
                            accent="indigo"
                            isActive={activeTab === 'life-situation' || activeTab === 'majetek-sjm'}
                            onClick={() => handleTabClick('majetek-sjm')}
                          />

                          <ModuleCapsuleCard
                            id="psychicka-podpora"
                            label="Psychická podpora & Prevence"
                            desc="Psychologická první pomoc, zvládání syndromu vyhoření a tlaku"
                            icon={<Heart className="w-5 h-5 text-rose-600" />}
                            badge="PODPORA"
                            accent="rose"
                            isActive={activeTab === 'psychicka-podpora'}
                            onClick={() => handleTabClick('psychicka-podpora')}
                          />

                          <ModuleCapsuleCard
                            id="rozhovor-dite"
                            label="Jak mluvit s dítětem"
                            desc="Komunikace s dětmi o rozchodu citlivě, věkově přiměřeně a bez traumatu"
                            icon={<Users className="w-5 h-5 text-teal-600" />}
                            badge="DĚTI"
                            accent="teal"
                            isActive={activeTab === 'rozhovor-dite'}
                            onClick={() => handleTabClick('rozhovor-dite')}
                          />

                          <ModuleCapsuleCard
                            id="ochrana-manipulace"
                            label="Ochrana před manipulací (PAS)"
                            desc="Rozpoznání syndromu zavržení rodiče, narativů a psychického tlaku"
                            icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
                            badge="OBRANA"
                            accent="amber"
                            isActive={activeTab === 'ochrana-manipulace'}
                            onClick={() => handleTabClick('ochrana-manipulace')}
                          />

                          <ModuleCapsuleCard
                            id="bydleni-zazemi"
                            label="Nové bydlení & OSPOD"
                            desc="Stabilizace nového domova pro děti, inspekce a součinnost s OSPOD"
                            icon={<Home className="w-5 h-5 text-emerald-600" />}
                            badge="DOMOV"
                            accent="green"
                            isActive={activeTab === 'bydleni-zazemi'}
                            onClick={() => handleTabClick('bydleni-zazemi')}
                          />

                          <ModuleCapsuleCard
                            id="rodinna-mediace"
                            label="Rodinná mediace & Dohoda"
                            desc="Mimosoudní dohoda rodičů, mezinárodní mediace a rodičovský plán"
                            icon={<Scale className="w-5 h-5 text-indigo-600" />}
                            badge="MEDIACE"
                            accent="indigo"
                            isActive={activeTab === 'rodinna-mediace'}
                            onClick={() => handleTabClick('rodinna-mediace')}
                          />
                        </div>
                      </div>

                      {/* Category 3: Krizová pomoc & Komunita */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1 border-t border-slate-100 pt-3">
                          <PhoneCall className="w-3 h-3 text-rose-500" />
                          <span>Krizová pomoc &amp; Komunita</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2.5">
                          <ModuleCapsuleCard
                            id="crisis"
                            label="Krizový Akční Plán SOS"
                            desc="Okamžitý návod krok za krokem při náhlém odebrání dětí či v tísni"
                            icon={<ShieldAlert className="w-5 h-5 text-white" />}
                            badge="SOS 24/7"
                            accent="red"
                            isActive={activeTab === 'crisis'}
                            onClick={() => handleTabClick('crisis')}
                          />

                          <ModuleCapsuleCard
                            id="forum"
                            label="Komunitní Fórum"
                            desc="Zapojení do krajských diskuzí a vzájemná komunitní pomoc tátů"
                            icon={<MessageSquare className="w-5 h-5 text-indigo-600" />}
                            isActive={activeTab === 'forum'}
                            onClick={() => handleTabClick('forum')}
                          />

                          <ModuleCapsuleCard
                            id="stories"
                            label="Příběhy Tátů & Memento"
                            desc="Reálná svědectví, osudy a poučení z opatrovnických bojů"
                            icon={<Heart className="w-5 h-5 text-rose-500" />}
                            isActive={activeTab === 'stories'}
                            onClick={() => handleTabClick('stories')}
                          />

                          <ModuleCapsuleCard
                            id="advice"
                            label="Právní Poradna & Dotazy"
                            desc="Archiv již vyřešených dotazů s doporučením advokátů"
                            icon={<PhoneCall className="w-5 h-5 text-teal-600" />}
                            isActive={activeTab === 'advice'}
                            onClick={() => handleTabClick('advice')}
                          />
                        </div>
                      </div>

                      {/* Category 4: Státní Data, Edukace & Nápověda */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1 border-t border-slate-100 pt-3">
                          <BookOpen className="w-3 h-3 text-indigo-500" />
                          <span>Státní Data, Edukace &amp; Nápověda</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          <ModuleCapsuleCard
                            id="e-justice"
                            label="e-Sbírka REST Portal"
                            desc="Platné zákony a sledování novely legislativy e-Justice"
                            icon={<Database className="w-5 h-5 text-indigo-600" />}
                            isActive={activeTab === 'e-justice'}
                            onClick={() => handleTabClick('e-justice')}
                          />

                          <ModuleCapsuleCard
                            id="knihovna-studii"
                            label="Vědecké Studie & VÚPSV"
                            desc="Odborné výzkumy attachmentu, střídavé péče a ČSÚ data"
                            icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
                            isActive={activeTab === 'knihovna-studii'}
                            onClick={() => handleTabClick('knihovna-studii')}
                          />

                          <ModuleCapsuleCard
                            id="videoteka"
                            label="Edukační Videotéka"
                            desc="Instruktážní videa, rozhovory a podcasty s advokáty"
                            icon={<Tv className="w-5 h-5 text-purple-600" />}
                            isActive={activeTab === 'videoteka'}
                            onClick={() => handleTabClick('videoteka')}
                          />

                          <ModuleCapsuleCard
                            id="legal-wiki"
                            label="Právní Wiki & Slovník"
                            desc="Srozumitelný výklad právnických a úředních termínů"
                            icon={<Layers className="w-5 h-5 text-teal-600" />}
                            isActive={activeTab === 'legal-wiki'}
                            onClick={() => handleTabClick('legal-wiki')}
                          />

                          <ModuleCapsuleCard
                            id="user-manual"
                            label="Nápověda & Manuál"
                            desc="Detailní průvodce veřejnou i soukromou částí a AI"
                            icon={<HelpCircle className="w-5 h-5 text-teal-600" />}
                            badge="NÁVOD"
                            isActive={activeTab === 'user-manual'}
                            onClick={() => handleTabClick('user-manual')}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: 🔒 ČÁST PRO PŘIHLÁŠENÉ UŽIVATELE */}
                  {navTab === 'private' && (
                    <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                      {!isLoggedIn && (
                        <div className="p-3 bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-purple-500/10 border border-teal-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 animate-pulse" />
                            <span className="text-slate-700 font-medium">
                              Tyto chráněné moduly a AI nástroje slouží pro registrované rodiče.
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setOpenDropdown(null);
                              onOpenAuth('login');
                            }}
                            className="px-3 py-1 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 shrink-0 cursor-pointer"
                          >
                            Přihlásit se
                          </button>
                        </div>
                      )}

                      {/* Category 1: Chytré AI Nástroje & Generátory */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-teal-600 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                          <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
                          <span>Chytré AI Nástroje &amp; Generátory</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {/* NEW TOOL: Konstruktivní Komunikátor (BIFF) */}
                          <ModuleCapsuleCard
                            id="biff-communicator"
                            label="Konstruktivní Komunikátor"
                            desc="Generátor věcných zpráv bez emocí (BIFF metoda) pro komunikaci s druhým rodičem"
                            icon={<MessageSquare className="w-5 h-5 text-white" />}
                            badge="BIFF / AI"
                            accent="teal"
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'biff-communicator' || activeTab === 'biff-komunikace' || activeTab === 'konstruktivni-komunikator'}
                            onClick={() => handleTabClick('biff-communicator')}
                          />

                          {/* AI Assistant (HIGHLIGHTED: Teal accent) */}
                          <ModuleCapsuleCard
                            id="ai-assistant"
                            label="AI Právní Asistent"
                            desc="Interaktivní konverzační asistent s právním rozborem (Gemini AI)"
                            icon={<Sparkles className="w-5 h-5 text-white" />}
                            badge="AI GEMINI"
                            accent="teal"
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'ai-assistant'}
                            onClick={() => handleTabClick('ai-assistant')}
                          />

                          {/* Simulátor péče (HIGHLIGHTED: Amber accent) */}
                          <ModuleCapsuleCard
                            id="plan-pece"
                            label="Simulátor Péče"
                            desc="Matematická 28denní mřížka péče a generování tiskového výstupu"
                            icon={<Sliders className="w-5 h-5 text-white" />}
                            badge="SIMULÁTOR"
                            accent="amber"
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'plan-pece'}
                            onClick={() => handleTabClick('plan-pece')}
                          />

                          <ModuleCapsuleCard
                            id="ai-guide"
                            label="AI Průvodce Řízením"
                            desc="Generování taktického plánu na míru podle fáze sporu"
                            icon={<Compass className="w-5 h-5 text-teal-600" />}
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'ai-guide'}
                            onClick={() => handleTabClick('ai-guide')}
                          />

                          <ModuleCapsuleCard
                            id="ai-case-manager"
                            label="AI Analýza Spisu & Důkazů"
                            desc="Skenování, sémantický výtah z listin a časová osa důkazů"
                            icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'ai-case-manager'}
                            onClick={() => handleTabClick('ai-case-manager')}
                          />

                          <ModuleCapsuleCard
                            id="ke-stazeni"
                            label="Chytrý Editor Podání"
                            desc="Dynamický editor s automatickou kontrolou přes e-Sbírku"
                            icon={<FileText className="w-5 h-5 text-emerald-600" />}
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'ke-stazeni'}
                            onClick={() => handleTabClick('ke-stazeni')}
                          />
                        </div>
                      </div>

                      {/* Category 2: Osobní Pracovna & Správa Případu */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1 border-t border-slate-100 pt-3">
                          <UserCheck className="w-3 h-3 text-emerald-500" />
                          <span>Osobní Pracovna &amp; Správa Případu</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {/* Moje Pracovna (HIGHLIGHTED: Green/Emerald accent) */}
                          <ModuleCapsuleCard
                            id="user-portal"
                            label="Moje Pracovna (Workspace)"
                            desc="Soukromé řídicí centrum pro správu vlastních podání a termínů"
                            icon={<UserCheck className="w-5 h-5 text-white" />}
                            badge="PRACOVNA"
                            accent="green"
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'user-portal'}
                            onClick={() => handleTabClick('user-portal')}
                          />

                          {/* Rodičovský Hub (HIGHLIGHTED: Indigo accent) */}
                          <ModuleCapsuleCard
                            id="coparent-hub"
                            label="Spolurodičovský Hub (CoParent)"
                            desc="Sdílený kalendář předávání dětí, výdajů a správa mezi rodiči"
                            icon={<Users className="w-5 h-5 text-white" />}
                            badge="HUB"
                            accent="indigo"
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'coparent-hub'}
                            onClick={() => handleTabClick('coparent-hub')}
                          />

                          <ModuleCapsuleCard
                            id="profile"
                            label="Profil & Bezpečnost"
                            desc="Správa přihlášení (Google OAuth), Passkey a bezpečnostní audit"
                            icon={<Settings className="w-5 h-5 text-slate-700" />}
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'profile'}
                            onClick={() => handleTabClick('profile')}
                          />
                        </div>
                      </div>

                      {/* Category 3: Administrace & Systém */}
                      {isAdmin && (
                        <div>
                          <div className="text-[10px] font-mono font-extrabold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1 border-t border-slate-100 pt-3">
                            <ShieldAlert className="w-3 h-3 text-indigo-600" />
                            <span>Administrace &amp; Moderace</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <ModuleCapsuleCard
                              id="admin"
                              label="Administrace Systému"
                              desc="Panel pro správu uživatelů, schvalování obsahu a sledování serveru"
                              icon={<ShieldAlert className="w-5 h-5 text-indigo-600" />}
                              badge="ADMIN"
                              isActive={activeTab === 'admin'}
                              onClick={() => handleTabClick('admin')}
                            />

                            <ModuleCapsuleCard
                              id="ai-admin"
                              label="Autonomní AI Admin"
                              desc="Systémový nástroj pro správu obsahu, audit a rešerše na pozadí"
                              icon={<Sparkles className="w-5 h-5 text-indigo-600" />}
                              badge="AI ADMIN"
                              isActive={activeTab === 'ai-admin'}
                              onClick={() => handleTabClick('ai-admin')}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Public Topbar Direct Buttons */}
            {PUBLIC_TOPBAR_ITEMS.slice(0, 3).map((item) => {
              const ItemIcon = item.icon;
              const isItemActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer whitespace-nowrap ${
                    isItemActive
                      ? 'bg-teal-50 border-teal-200 text-teal-800 shadow-3xs'
                      : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={item.desc}
                >
                  <ItemIcon className={`w-3.5 h-3.5 ${isItemActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* 21 Categories Mega-Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('categories')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'categories' ? null : 'categories')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer whitespace-nowrap ${
                  openDropdown === 'categories'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-3xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title="21 Odborných témat a kategorií"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Kategorie</span>
                <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 text-[10px] font-mono font-extrabold rounded-full">
                  21
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {openDropdown === 'categories' && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[90vw] max-w-[780px] bg-white border border-indigo-200 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3 gap-3">
                    <div className="flex items-center gap-2 shrink-0">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-extrabold text-slate-900 font-display uppercase tracking-wider">
                        21 Odborných Kategorií
                      </span>
                    </div>
                    <div className="relative flex-1 max-w-xs">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Hledat v kategoriích..."
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-6 py-1 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                      {categoryFilter && (
                        <button 
                          onClick={() => setCategoryFilter('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg shrink-0">
                      {filteredCategories.length} témata
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 max-h-[380px] overflow-y-auto pr-1">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.slug, cat.name)}
                        className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-indigo-50/80 border border-transparent hover:border-indigo-100 transition-all cursor-pointer group"
                      >
                        <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">{cat.icon}</span>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 block truncate leading-tight">
                            {cat.name}
                          </span>
                        </div>
                      </button>
                    ))}
                    {filteredCategories.length === 0 && (
                      <div className="col-span-3 text-center py-6 text-xs text-slate-400 font-mono">
                        Žádná kategorie neodpovídá výrazu "{categoryFilter}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Private Zone Direct Access Button */}
            <button
              onClick={() => handleTabClick('user-portal')}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-teal-500/10 border border-teal-200/80 rounded-xl text-xs font-extrabold text-teal-900 transition-all cursor-pointer shadow-3xs hover:border-teal-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span>MŮJ PORTÁL</span>
            </button>

            {/* Admin Direct Button */}
            {isAdmin && (
              <button
                onClick={() => handleTabClick('admin')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  activeTab === 'admin' || activeTab === 'ai-admin'
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-3xs'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                }`}
                title="Administrace systému"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Right Tools: Universal Search, Notification Center, Highlighted Portal, Profile & Mobile/Tablet Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Universal Search Bar Component */}
            <UniversalSearchInput 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onNavigate={handleTabClick}
              className="hidden sm:block w-28 sm:w-36 md:w-44 lg:w-48 xl:w-56 shrink-0"
            />

            {/* Notification Center */}
            <NotificationCenter onNavigate={handleTabClick} />

            {/* Highlighted "Můj portál" Button on Tablet & Desktop Header */}
            <button
              onClick={() => handleTabClick('user-portal')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-3xs ${
                activeTab === 'user-portal'
                  ? 'bg-teal-700 text-white border border-teal-800 shadow-md ring-2 ring-teal-300/40'
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white border border-teal-500/30'
              }`}
              title="Přejít do mého osobního portálu"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-100 shrink-0" />
              <span className="hidden md:inline font-extrabold">Můj portál</span>
            </button>

            {/* Glossary Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-glossary', { detail: '' }))}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition-all cursor-pointer shadow-3xs shrink-0"
              title="Slovník odborných pojmů"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Slovník</span>
            </button>

            {/* Support Button */}
            <button
              onClick={() => handleTabClick('support')}
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-bold text-[11px] transition-all cursor-pointer shrink-0 ${
                activeTab === 'support'
                  ? 'bg-teal-50 border-teal-200 text-teal-800'
                  : 'bg-teal-50/40 hover:bg-teal-50 border-teal-100/50 text-teal-700 hover:border-teal-200 shadow-3xs'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 text-teal-600 ${activeTab === 'support' ? '' : 'animate-pulse'}`} />
              <span>O portálu</span>
            </button>

            {/* User Authentication Profile Badge */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 pl-1.5 sm:pl-2 pr-1.5 sm:pr-2 py-1 rounded-full border border-slate-200 shrink-0">
                <button
                  onClick={() => handleTabClick('profile')}
                  className="flex items-center gap-1.5 sm:gap-2 text-left cursor-pointer hover:opacity-85 transition-opacity outline-none"
                  title="Přejít na Můj Profil"
                >
                  <img 
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                    alt={currentUser.name} 
                    className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full border border-teal-300"
                  />
                  <div className="hidden sm:flex flex-col">
                    <span className="text-[10px] font-bold text-slate-800 max-w-[80px] truncate leading-tight">{currentUser.name}</span>
                    <span className={`text-[7px] font-mono font-extrabold uppercase ${isAdmin ? 'text-indigo-600' : 'text-teal-600'} leading-none`}>
                      {isAdmin ? 'Admin' : 'Přihlášen'}
                    </span>
                  </div>
                </button>
                <button 
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-full transition-colors ml-0.5 cursor-pointer"
                  title="Odhlásit se"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0"
                  title="Přihlášení uživatele"
                >
                  <LogIn className="w-3.5 h-3.5 text-teal-300" />
                  <span>Přihlásit se</span>
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-[11px] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0 border border-teal-400/30"
                  title="Vytvořit nový účet zdarma"
                >
                  <UserPlus className="w-3.5 h-3.5 text-teal-100" />
                  <span>Registrace</span>
                </button>
              </div>
            )}

            {/* Tablet & Small Screen Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all cursor-pointer border border-slate-200/80 flex items-center gap-1.5 font-bold text-xs shrink-0"
              aria-label="Otevřít Menu"
              title="Otevřít hlavní rozcestník a kategorie"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5 text-teal-700" />}
              <span className="hidden sm:inline text-xs font-bold text-slate-800">Menu</span>
            </button>
          </div>

        </div>
      </div>

      {/* Ultimate 4-Pillar Mobile & Tablet Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 h-[calc(100vh-100%)] z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-start">
            <div className="bg-white w-full h-full flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200 overflow-hidden">
              
              {/* FIXED TOP HEADER: Instant Global Search + Close Button */}
              <div className="p-3 bg-slate-50/90 border-b border-slate-200/80 shrink-0 flex items-center justify-between gap-2.5">
                <UniversalSearchInput 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onNavigate={handleTabClick}
                  className="flex-1"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl shrink-0 cursor-pointer shadow-3xs transition-all active:scale-95"
                  aria-label="Zavřít menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SCROLLABLE DRAWER BODY (RADICALLY ENHANCED WITH 2 TABS & CAPSULE CARDS) */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
                
                {/* 1. SECTOR: 2 MAIN TABS SWITCHER (Veřejná vs Přihlášená část) */}
                <div className="space-y-3">
                  <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => setNavTab('public')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        navTab === 'public'
                          ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🌐</span>
                      <span>Veřejná část</span>
                    </button>

                    <button
                      onClick={() => setNavTab('private')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        navTab === 'private'
                          ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🔒</span>
                      <span>Pro přihlášené</span>
                      {isLoggedIn && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
                      )}
                    </button>
                  </div>

                  {/* TAB 1: 🌐 VEŘEJNÁ ČÁST CARDS */}
                  {navTab === 'public' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      
                      {/* Category 1: Opatrovnictví & Práva Otce */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                          <Scale className="w-3 h-3 text-amber-500" />
                          <span>Opatrovnictví &amp; Práva Otce</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <ModuleCapsuleCard
                            id="opatrovnicka-agenda"
                            label="Opatrovnický Průvodce"
                            desc="Kompletní procesní manuál krok za krokem od návrhu po rozsudek"
                            icon={<Compass className="w-5 h-5 text-teal-600" />}
                            badge="NÁVOD"
                            accent="teal"
                            isActive={activeTab === 'opatrovnicka-agenda'}
                            onClick={() => {
                              handleTabClick('opatrovnicka-agenda');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="plan-pece"
                            label="Střídavá Péče & Simulátor"
                            desc="Matematická 28denní mřížka péče a harmonogram úpravy styků"
                            icon={<Sliders className="w-5 h-5 text-amber-600" />}
                            badge="PÉČE"
                            accent="amber"
                            isActive={activeTab === 'plan-pece'}
                            onClick={() => {
                              handleTabClick('plan-pece');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="judikatura"
                            label="Judikatura ÚS & Precedenty"
                            desc="Precedentní nálezy a judikátní argumentace pro ochranu práv otce"
                            icon={<Scale className="w-5 h-5 text-amber-600" />}
                            badge="ÚS ČR"
                            accent="amber"
                            isActive={activeTab === 'judikatura'}
                            onClick={() => {
                              handleTabClick('judikatura');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="ke-stazeni"
                            label="Vzory Podání & Dokumenty"
                            desc="Ověřené právní šablony, žaloby a úřední dokumenty ke stažení"
                            icon={<FolderCheck className="w-5 h-5 text-emerald-600" />}
                            badge="DOCX/PDF"
                            accent="green"
                            isActive={activeTab === 'ke-stazeni'}
                            onClick={() => {
                              handleTabClick('ke-stazeni');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="rights"
                            label="Práva Otců & Ústava ČR"
                            desc="Garantovaná ústavní práva na rodičovskou péči podle Listiny"
                            icon={<Shield className="w-5 h-5 text-sky-600" />}
                            accent="sky"
                            isActive={activeTab === 'rights'}
                            onClick={() => {
                              handleTabClick('rights');
                              setMobileMenuOpen(false);
                            }}
                          />
                        </div>
                      </div>

                      {/* Category 2: Životní situace & Zázemí po rozchodu (NEW SUPPORT SECTION) */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-teal-600 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1 border-t border-slate-100 pt-3">
                          <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                          <span>Životní situace &amp; Zázemí po rozchodu</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <ModuleCapsuleCard
                            id="majetek-sjm"
                            label="SJM & Majetkové vypořádání"
                            desc="Vypořádání majetku, hypotéky, dluhů a krizový rozpočet po rozchodu"
                            icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
                            badge="SJM"
                            accent="indigo"
                            isActive={activeTab === 'life-situation' || activeTab === 'majetek-sjm'}
                            onClick={() => {
                              handleTabClick('majetek-sjm');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="psychicka-podpora"
                            label="Psychická podpora & Prevence"
                            desc="Psychologická první pomoc, zvládání syndromu vyhoření a tlaku"
                            icon={<Heart className="w-5 h-5 text-rose-600" />}
                            badge="PODPORA"
                            accent="rose"
                            isActive={activeTab === 'psychicka-podpora'}
                            onClick={() => {
                              handleTabClick('psychicka-podpora');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="rozhovor-dite"
                            label="Jak mluvit s dítětem"
                            desc="Komunikace s dětmi o rozchodu citlivě, věkově přiměřeně a bez traumatu"
                            icon={<Users className="w-5 h-5 text-teal-600" />}
                            badge="DĚTI"
                            accent="teal"
                            isActive={activeTab === 'rozhovor-dite'}
                            onClick={() => {
                              handleTabClick('rozhovor-dite');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="ochrana-manipulace"
                            label="Ochrana před manipulací (PAS)"
                            desc="Rozpoznání syndromu zavržení rodiče, narativů a psychického tlaku"
                            icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
                            badge="OBRANA"
                            accent="amber"
                            isActive={activeTab === 'ochrana-manipulace'}
                            onClick={() => {
                              handleTabClick('ochrana-manipulace');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="bydleni-zazemi"
                            label="Nové bydlení & OSPOD"
                            desc="Stabilizace nového domova pro děti, inspekce a součinnost s OSPOD"
                            icon={<Home className="w-5 h-5 text-emerald-600" />}
                            badge="DOMOV"
                            accent="green"
                            isActive={activeTab === 'bydleni-zazemi'}
                            onClick={() => {
                              handleTabClick('bydleni-zazemi');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="rodinna-mediace"
                            label="Rodinná mediace & Dohoda"
                            desc="Mimosoudní dohoda rodičů, mezinárodní mediace a rodičovský plán"
                            icon={<Scale className="w-5 h-5 text-indigo-600" />}
                            badge="MEDIACE"
                            accent="indigo"
                            isActive={activeTab === 'rodinna-mediace'}
                            onClick={() => {
                              handleTabClick('rodinna-mediace');
                              setMobileMenuOpen(false);
                            }}
                          />
                        </div>
                      </div>

                      {/* Category 3: Krizová pomoc & Komunita */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1 border-t border-slate-100 pt-3">
                          <PhoneCall className="w-3 h-3 text-rose-500" />
                          <span>Krizová pomoc &amp; Komunita</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <ModuleCapsuleCard
                            id="crisis"
                            label="Krizový Akční Plán SOS"
                            desc="Okamžitý návod krok za krokem při náhlém odebrání dětí či v tísni"
                            icon={<ShieldAlert className="w-5 h-5 text-white" />}
                            badge="SOS 24/7"
                            accent="red"
                            isActive={activeTab === 'crisis'}
                            onClick={() => {
                              handleTabClick('crisis');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="forum"
                            label="Komunitní Fórum"
                            desc="Zapojení do krajských diskuzí a vzájemná komunitní pomoc tátů"
                            icon={<MessageSquare className="w-5 h-5 text-indigo-600" />}
                            isActive={activeTab === 'forum'}
                            onClick={() => {
                              handleTabClick('forum');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="stories"
                            label="Příběhy Tátů & Memento"
                            desc="Reálná svědectví, osudy a poučení z opatrovnických bojů"
                            icon={<Heart className="w-5 h-5 text-rose-500" />}
                            isActive={activeTab === 'stories'}
                            onClick={() => {
                              handleTabClick('stories');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="advice"
                            label="Právní Poradna & Q&A"
                            desc="Archiv zodpovězených dotazů s doporučením advokátů"
                            icon={<PhoneCall className="w-5 h-5 text-teal-600" />}
                            isActive={activeTab === 'advice'}
                            onClick={() => {
                              handleTabClick('advice');
                              setMobileMenuOpen(false);
                            }}
                          />
                        </div>
                      </div>

                      {/* Category 4: Státní Data, Edukace & Nápověda */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1 border-t border-slate-100 pt-3">
                          <BookOpen className="w-3 h-3 text-indigo-500" />
                          <span>Státní Data &amp; Edukace</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <ModuleCapsuleCard
                            id="e-justice"
                            label="e-Sbírka REST Portal"
                            desc="Platné zákony a sledování novely legislativy e-Justice"
                            icon={<Database className="w-5 h-5 text-indigo-600" />}
                            isActive={activeTab === 'e-justice'}
                            onClick={() => {
                              handleTabClick('e-justice');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="knihovna-studii"
                            label="Vědecké Studie & VÚPSV"
                            desc="Odborné výzkumy attachmentu, střídavé péče a ČSÚ data"
                            icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
                            isActive={activeTab === 'knihovna-studii'}
                            onClick={() => {
                              handleTabClick('knihovna-studii');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="videoteka"
                            label="Edukační Videotéka"
                            desc="Instruktážní videa, rozhovory a podcasty s advokáty"
                            icon={<Tv className="w-5 h-5 text-purple-600" />}
                            isActive={activeTab === 'videoteka'}
                            onClick={() => {
                              handleTabClick('videoteka');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="user-manual"
                            label="Nápověda & Manuál"
                            desc="Detailní průvodce veřejnou i soukromou částí a AI"
                            icon={<HelpCircle className="w-5 h-5 text-teal-600" />}
                            badge="NÁVOD"
                            isActive={activeTab === 'user-manual'}
                            onClick={() => {
                              handleTabClick('user-manual');
                              setMobileMenuOpen(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: 🔒 ČÁST PRO PŘIHLÁŠENÉ CARDS */}
                  {navTab === 'private' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider px-1">
                        Chráněná Pracovna &amp; AI Nástroje
                      </div>

                      {!isLoggedIn && (
                        <div className="p-3 bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-purple-500/10 border border-teal-200 rounded-2xl flex flex-col gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                            <span className="text-slate-700 font-medium">
                              Tyto moduly a AI generátory slouží pro registrované rodiče. Přihlaste se pro přístup.
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              onOpenAuth('login');
                            }}
                            className="w-full py-2 bg-slate-900 text-white font-extrabold rounded-xl text-xs hover:bg-slate-800 cursor-pointer text-center"
                          >
                            Přihlásit se do účtu
                          </button>
                        </div>
                      )}

                      {/* Category 1: Chytré AI Nástroje & Generátory */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-teal-600 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                          <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
                          <span>Chytré AI Nástroje &amp; Generátory</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* NEW TOOL: Konstruktivní Komunikátor (BIFF) */}
                          <ModuleCapsuleCard
                            id="biff-communicator"
                            label="Konstruktivní Komunikátor"
                            desc="Generátor věcných zpráv bez emocí (BIFF metoda) pro komunikaci s druhým rodičem"
                            icon={<MessageSquare className="w-5 h-5 text-white" />}
                            badge="BIFF / AI"
                            accent="teal"
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'biff-communicator' || activeTab === 'biff-komunikace' || activeTab === 'konstruktivni-komunikator'}
                            onClick={() => {
                              handleTabClick('biff-communicator');
                              setMobileMenuOpen(false);
                            }}
                          />

                          {/* AI Assistant (HIGHLIGHTED: Teal accent) */}
                          <ModuleCapsuleCard
                            id="ai-assistant"
                            label="AI Právní Asistent"
                            desc="Interaktivní konverzační asistent s právním rozborem (Gemini AI)"
                            icon={<Sparkles className="w-5 h-5 text-white" />}
                            badge="AI GEMINI"
                            accent="teal"
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'ai-assistant'}
                            onClick={() => {
                              handleTabClick('ai-assistant');
                              setMobileMenuOpen(false);
                            }}
                          />

                          {/* Simulátor péče (HIGHLIGHTED: Amber accent) */}
                          <ModuleCapsuleCard
                            id="plan-pece"
                            label="Simulátor Péče"
                            desc="Matematická 28denní mřížka péče a tiskový výstup"
                            icon={<Sliders className="w-5 h-5 text-white" />}
                            badge="SIMULÁTOR"
                            accent="amber"
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'plan-pece'}
                            onClick={() => {
                              handleTabClick('plan-pece');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="ai-guide"
                            label="AI Průvodce Řízením"
                            desc="Generování taktického plánu podle fáze sporu"
                            icon={<Compass className="w-5 h-5 text-teal-600" />}
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'ai-guide'}
                            onClick={() => {
                              handleTabClick('ai-guide');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="ai-case-manager"
                            label="AI Analýza Spisu & Důkazů"
                            desc="Skenování listin, sémantika a časová osa spisu"
                            icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'ai-case-manager'}
                            onClick={() => {
                              handleTabClick('ai-case-manager');
                              setMobileMenuOpen(false);
                            }}
                          />
                        </div>
                      </div>

                      {/* Category 2: Osobní Pracovna & Správa Případu */}
                      <div>
                        <div className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1 border-t border-slate-100 pt-3">
                          <UserCheck className="w-3 h-3 text-emerald-500" />
                          <span>Osobní Pracovna &amp; Správa Případu</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* Moje Pracovna (HIGHLIGHTED: Green accent) */}
                          <ModuleCapsuleCard
                            id="user-portal"
                            label="Moje Pracovna (Workspace)"
                            desc="Soukromé řídicí centrum pro správu vlastních podání a termínů"
                            icon={<UserCheck className="w-5 h-5 text-white" />}
                            badge="PRACOVNA"
                            accent="green"
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'user-portal'}
                            onClick={() => {
                              handleTabClick('user-portal');
                              setMobileMenuOpen(false);
                            }}
                          />

                          {/* Rodičovský Hub (HIGHLIGHTED: Indigo accent) */}
                          <ModuleCapsuleCard
                            id="coparent-hub"
                            label="Spolurodičovský Hub (CoParent)"
                            desc="Sdílený kalendář předávání dětí, výdajů a komunikace"
                            icon={<Users className="w-5 h-5 text-white" />}
                            badge="HUB"
                            accent="indigo"
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'coparent-hub'}
                            onClick={() => {
                              handleTabClick('coparent-hub');
                              setMobileMenuOpen(false);
                            }}
                          />

                          <ModuleCapsuleCard
                            id="profile"
                            label="Profil & Bezpečnost"
                            desc="Správa přihlášení (Google OAuth) a bezpečnostní audit"
                            icon={<Settings className="w-5 h-5 text-slate-700" />}
                            requiresAuth
                            isLoggedIn={isLoggedIn}
                            isActive={activeTab === 'profile'}
                            onClick={() => {
                              handleTabClick('profile');
                              setMobileMenuOpen(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. SECTOR: SBALITELNÉ KATEGORIE & SEKCE (Accordions - Closed by default) */}
                <div className="space-y-2 border-t border-slate-200/80 pt-3">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
                    Rozšiřující sekce &amp; Archiv
                  </div>

                  {/* ACCORDION 1: 🗂️ Odborná témata (21 Kategorií) */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-3xs">
                    <button
                      onClick={() => setTopicsAccordionOpen(!topicsAccordionOpen)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 text-left transition-all cursor-pointer font-bold text-xs text-slate-800"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">🗂️</span>
                        <span className="font-extrabold text-slate-900 truncate">Odborná témata &amp; Okruhy</span>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 text-[10px] font-mono font-black rounded-full shrink-0">
                          21
                        </span>
                      </div>
                      {topicsAccordionOpen ? (
                        <ChevronDown className="w-4 h-4 text-indigo-600 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {topicsAccordionOpen && (
                      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2.5 animate-in fade-in duration-150">
                        {/* Category Filter */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text"
                            placeholder="Filtrovat témata..."
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                          {categoryFilter && (
                            <button
                              onClick={() => setCategoryFilter('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                          {filteredCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                handleCategoryClick(cat.slug, cat.name);
                                setMobileMenuOpen(false);
                              }}
                              className="flex items-start gap-2 p-2 bg-white hover:bg-indigo-50/80 active:bg-indigo-100 border border-slate-200/80 hover:border-indigo-300 rounded-xl text-left transition-all cursor-pointer group"
                            >
                              <span className="text-base shrink-0 group-hover:scale-110 transition-transform leading-none mt-0.5">{cat.icon}</span>
                              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 block leading-tight line-clamp-2 min-w-0">
                                {cat.name}
                              </span>
                            </button>
                          ))}
                          {filteredCategories.length === 0 && (
                            <div className="col-span-2 text-center py-4 text-xs text-slate-400 font-mono bg-white rounded-xl border border-dashed border-slate-200">
                              Žádná kategorie neodpovídá "{categoryFilter}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACCORDION 2: 🚀 Rychlý rozcestník */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-3xs">
                    <button
                      onClick={() => setQuickNavAccordionOpen(!quickNavAccordionOpen)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 text-left transition-all cursor-pointer font-bold text-xs text-slate-800"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">🚀</span>
                        <span className="font-extrabold text-slate-900 truncate">Rychlý rozcestník &amp; Nástroje</span>
                      </div>
                      {quickNavAccordionOpen ? (
                        <ChevronDown className="w-4 h-4 text-teal-600 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {quickNavAccordionOpen && (
                      <div className="p-3 border-t border-slate-100 bg-slate-50/50 grid grid-cols-2 gap-2 animate-in fade-in duration-150">
                        <button
                          onClick={() => handleTabClick('plan-pece')}
                          className="col-span-2 flex items-center justify-between p-2.5 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-950 border border-teal-300 rounded-xl text-xs font-extrabold cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Sliders className="w-4 h-4 text-teal-600 shrink-0" />
                            <span className="truncate">Simulátor Péče</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-teal-200 text-teal-950 rounded-md uppercase font-black shrink-0">PÉČE</span>
                        </button>

                        <button
                          onClick={() => handleTabClick('home')}
                          className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          <Home className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="truncate">Domů</span>
                        </button>

                        <button
                          onClick={() => handleTabClick('news')}
                          className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="truncate">Články &amp; Redakce</span>
                        </button>

                        <button
                          onClick={() => handleTabClick('knihovna-studii')}
                          className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="truncate">Knihovna studií</span>
                        </button>

                        <button
                          onClick={() => handleTabClick('videoteka')}
                          className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          <Tv className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="truncate">Videotéka</span>
                        </button>

                        <button
                          onClick={() => handleTabClick('judikatura')}
                          className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          <Scale className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="truncate">Judikatura ÚS</span>
                        </button>

                        <button
                          onClick={() => handleTabClick('forum')}
                          className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="truncate">Komunita &amp; Fórum</span>
                        </button>

                        <button
                          onClick={() => handleTabClick('ke-stazeni')}
                          className="col-span-2 flex items-center justify-between p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FolderCheck className="w-4 h-4 text-teal-600 shrink-0" />
                            <span className="truncate">Vzory podání &amp; žalob</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => handleTabClick('admin')}
                            className="col-span-2 flex items-center justify-between p-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-indigo-200" />
                              <span>Administrace portálu</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-indigo-200" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ACCORDION 3: ℹ️ O projektu & Zázemí */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-3xs">
                    <button
                      onClick={() => setAboutAccordionOpen(!aboutAccordionOpen)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 text-left transition-all cursor-pointer font-bold text-xs text-slate-800"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">ℹ️</span>
                        <span className="font-extrabold text-slate-900 truncate">O projektu &amp; Zázemí</span>
                      </div>
                      {aboutAccordionOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-600 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {aboutAccordionOpen && (
                      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2 animate-in fade-in duration-150">
                        <button
                          onClick={() => handleTabClick('cesta-zakladatele')}
                          className="w-full flex items-center justify-between p-2 bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/80 rounded-xl text-left transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Compass className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="text-xs font-bold text-amber-950 truncate">📖 Cesta zakladatele (Můj příběh)</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />
                        </button>

                        <button
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('open-glossary', { detail: '' }));
                            setMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
                            <span className="text-xs font-bold text-slate-900 truncate">📚 Odborný slovník pojmů</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleTabClick('partners')}
                            className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                          >
                            <Users className="w-4 h-4 text-slate-600 shrink-0" />
                            <span className="truncate">🤝 Sponzoři & Partneři</span>
                          </button>

                          <button
                            onClick={() => handleTabClick('support')}
                            className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                          >
                            <Heart className="w-4 h-4 text-teal-600 shrink-0" />
                            <span className="truncate">💡 Podpora</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleTabClick('rights')}
                            className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                          >
                            <Scale className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="truncate">⚖️ Podmínky užívání</span>
                          </button>

                          <button
                            onClick={() => handleTabClick('sitemap')}
                            className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                          >
                            <Compass className="w-4 h-4 text-sky-600 shrink-0" />
                            <span className="truncate">🗺️ Mapa stránek</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleTabClick('contacts')}
                            className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                          >
                            <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                            <span className="truncate">✉️ Kontakt</span>
                          </button>

                          <button
                            onClick={() => handleTabClick('tickets')}
                            className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                          >
                            <Bug className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="truncate">🎫 Ticket systém</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* STICKY FOOTER: USER PROFILE & AUTH CONTROLS */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0">
                {currentUser ? (
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200 shadow-3xs">
                    <button
                      onClick={() => handleTabClick('profile')}
                      className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
                    >
                      <img 
                        src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                        alt={currentUser.name} 
                        className="w-9 h-9 rounded-full border border-teal-300 shrink-0 object-cover"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-extrabold text-slate-900 block truncate">{currentUser.name}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{currentUser.email}</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors border border-rose-200 shrink-0 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Odhlásit</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <button
                      onClick={() => {
                        onOpenAuth('login');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-1.5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
                    >
                      <LogIn className="w-4 h-4 text-teal-300" />
                      <span>Přihlásit se</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuth('register');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer border border-teal-400/30"
                    >
                      <UserPlus className="w-4 h-4 text-teal-100" />
                      <span>Registrovat zdarma</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
    </header>
  );
}
