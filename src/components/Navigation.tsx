/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  Compass
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
  'komunita-zkusenosti': { tab: 'forum', search: 'Diskuze' },
  'statistiky-vyzkumy': { tab: 'knihovna-studii', search: 'Statistiky' }
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
  const [topicsAccordionOpen, setTopicsAccordionOpen] = useState(true);

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
          {t('hero_welcome', 'Oficiální spuštění alfa verze 0.0.1.2 portálu Táta má právo! 🚀')}
        </span>
        <span className="hidden sm:inline text-amber-200/80">•</span>
        <span className="hidden md:inline text-[10px] text-teal-100 font-sans">
          {isLoggedIn 
            ? `Přihlášen jako ${currentUser.name} (${currentUser.role === 'admin' ? 'Administrátor' : 'Rodič'})`
            : 'Sjednocená platforma: Judikatura • AI Analýza • Simulátor péče'}
        </span>
      </div>

      {/* Main Header Bar (Logo, XL Navigation, Search & User Profile) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 border-b border-slate-100/80">
        <div className="flex items-center justify-between min-h-[56px] md:min-h-[64px] py-2 gap-2 sm:gap-3">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => handleTabClick('home')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
              <img 
                src="/src/assets/images/tata_ma_pravo_logo_1784660128096.jpg" 
                alt="Táta má právo Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
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
            {PUBLIC_TOPBAR_ITEMS.slice(0, 7).map((item) => {
              const ItemIcon = item.icon;
              const isActive = activeTab === item.id;
              const isSimulator = item.id === 'plan-pece';
              const isHub = item.id === 'coparent-hub';
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer whitespace-nowrap ${
                    isActive
                      ? isSimulator || isHub
                        ? 'bg-teal-600 border-teal-700 text-white shadow-3xs'
                        : 'bg-teal-50 border-teal-200 text-teal-800 shadow-3xs'
                      : isSimulator
                        ? 'bg-gradient-to-r from-teal-50/90 to-emerald-50/90 border-teal-300 text-teal-900 hover:bg-teal-100 hover:border-teal-400 shadow-3xs font-extrabold'
                        : isHub
                          ? 'bg-indigo-50/60 border-indigo-200/80 text-indigo-900 hover:bg-indigo-100/80 shadow-3xs font-extrabold'
                          : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={item.desc}
                >
                  <ItemIcon className={`w-3.5 h-3.5 ${isActive ? (isSimulator || isHub ? 'text-white' : 'text-teal-600') : (isSimulator ? 'text-teal-700' : isHub ? 'text-indigo-600' : 'text-slate-400')}`} />
                  <span>{item.label}</span>
                  {isSimulator && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full uppercase tracking-tighter ml-0.5 font-black ${
                      isActive ? 'bg-teal-700 text-teal-100' : 'bg-teal-200/90 text-teal-950'
                    }`}>
                      PÉČE
                    </span>
                  )}
                  {isHub && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full uppercase tracking-tighter ml-0.5 font-black ${
                      isActive ? 'bg-teal-700 text-teal-100' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      HUB
                    </span>
                  )}
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

            {/* Private Zone Dropdown (for Logged In users) */}
            {isLoggedIn && (
              <div 
                className="relative"
                onMouseEnter={() => setOpenDropdown('private-zone')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'private-zone' ? null : 'private-zone')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-teal-500/10 border border-teal-200/80 rounded-xl text-xs font-extrabold text-teal-900 transition-all cursor-pointer shadow-3xs hover:border-teal-300"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                  <span>MŮJ PORTÁL</span>
                  <ChevronDown className="w-3 h-3 text-teal-600" />
                </button>

                {openDropdown === 'private-zone' && (
                  <div className="absolute right-0 mt-1 w-80 bg-white border border-teal-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in duration-100">
                    {LOGGED_IN_SECTIONS.map((sec) => (
                      <div key={sec.id} className="mb-3 last:mb-0">
                        <div className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>{sec.title}</span>
                        </div>
                        <div className="space-y-0.5">
                          {sec.items.map((item) => {
                            const ItemIcon = item.icon;
                            const isSubActive = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                                  isSubActive ? 'bg-teal-50 text-teal-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <ItemIcon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSubActive ? 'text-teal-600' : 'text-slate-400'}`} />
                                <div className="min-w-0">
                                  <span className="text-xs font-bold block truncate">{item.label}</span>
                                  <span className="text-[10px] text-slate-400 block leading-tight">{item.desc}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Admin Dropdown */}
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

          {/* Right Tools: Universal Search, Notification Center, Glossary & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Universal Search Bar Component */}
            <UniversalSearchInput 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onNavigate={handleTabClick}
              className="hidden sm:block w-36 md:w-48 lg:w-56"
            />

            {/* Notification Center */}
            <NotificationCenter onNavigate={handleTabClick} />

            {/* Glossary Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-glossary', { detail: '' }))}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition-all cursor-pointer shadow-3xs"
              title="Slovník odborných pojmů"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Slovník</span>
            </button>

            {/* Support Button */}
            <button
              onClick={() => handleTabClick('support')}
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-bold text-[11px] transition-all cursor-pointer ${
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
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 pl-1.5 sm:pl-2 pr-1.5 sm:pr-2 py-1 rounded-full border border-slate-200">
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
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-[11px] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0 border border-teal-400/30"
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

      {/* Desktop Quick Access Bar (Pevná lišta rychlých odkazů - skryto na mobilu a tabletech md/lg) */}
      <div className="hidden xl:block bg-slate-50/95 border-t border-slate-100 py-1.5 px-3 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="whitespace-nowrap">Rychlé odkazní centrum:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full no-scrollbar">
            <button
              onClick={() => handleTabClick('crisis')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all border cursor-pointer shrink-0 ${
                activeTab === 'crisis'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-3xs'
                  : 'bg-rose-50/80 hover:bg-rose-100 text-rose-900 border-rose-200/80'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span className="whitespace-nowrap">Krizová pomoc 24/7</span>
            </button>

            <button
              onClick={() => handleTabClick('coparent-hub')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all border cursor-pointer shrink-0 ${
                activeTab === 'coparent-hub'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-3xs'
                  : 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border-indigo-200/80'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span className="whitespace-nowrap">Rodičovský Hub</span>
            </button>

            <button
              onClick={() => handleTabClick('ai-guide')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all border cursor-pointer shrink-0 ${
                activeTab === 'ai-guide' || activeTab === 'ai-assistant'
                  ? 'bg-teal-600 text-white border-teal-700 shadow-3xs'
                  : 'bg-teal-50/80 hover:bg-teal-100 text-teal-900 border-teal-200/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span className="whitespace-nowrap">AI Průvodce &amp; Asistent</span>
            </button>

            <button
              onClick={() => handleTabClick('plan-pece')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all border cursor-pointer shrink-0 ${
                activeTab === 'plan-pece'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-3xs'
                  : 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border-emerald-200/80'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span className="whitespace-nowrap">Simulátor Péče</span>
            </button>

            <button
              onClick={() => handleTabClick('judikatura')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all border cursor-pointer shrink-0 ${
                activeTab === 'judikatura'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-3xs'
                  : 'bg-amber-50/80 hover:bg-amber-100 text-amber-900 border-amber-200/80'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span className="whitespace-nowrap">Judikatura ÚS</span>
            </button>

            <button
              onClick={() => handleTabClick('ke-stazeni')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all border cursor-pointer shrink-0 ${
                activeTab === 'ke-stazeni'
                  ? 'bg-slate-800 text-white border-slate-900 shadow-3xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span className="whitespace-nowrap">Vzory podání</span>
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

              {/* SCROLLABLE DRAWER BODY (4 DISTINCT PILLARS) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* 1. SECTOR: 🚀 RYCHLÝ ROZCESTNÍK (Core Navigation) */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 px-1 text-xs font-black text-slate-900 font-display uppercase tracking-wider">
                    <span className="text-base">🚀</span>
                    <span>Rychlý Rozcestník</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTabClick('plan-pece')}
                      className={`col-span-2 flex items-center justify-between p-3 rounded-2xl text-xs font-black transition-all border cursor-pointer ${
                        activeTab === 'plan-pece'
                          ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                          : 'bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-950 border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Sliders className={`w-4.5 h-4.5 shrink-0 ${activeTab === 'plan-pece' ? 'text-white' : 'text-teal-600'}`} />
                        <span className="truncate">Simulátor Péče & Sourozenecká Soudržnost</span>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-black shrink-0 ${
                        activeTab === 'plan-pece' ? 'bg-teal-700 text-teal-100' : 'bg-teal-200 text-teal-950'
                      }`}>
                        INTERAKTIVNÍ
                      </span>
                    </button>

                    <button
                      onClick={() => handleTabClick('coparent-hub')}
                      className={`col-span-2 flex items-center justify-between p-3 rounded-2xl text-xs font-black transition-all border cursor-pointer ${
                        activeTab === 'coparent-hub'
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Users className={`w-4.5 h-4.5 shrink-0 ${activeTab === 'coparent-hub' ? 'text-white' : 'text-indigo-600'}`} />
                        <span className="truncate">Rodičovský Hub (CoParenting)</span>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-black shrink-0 ${
                        activeTab === 'coparent-hub' ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-200 text-indigo-950'
                      }`}>
                        PÁROVÁNÍ KLÍČŮ
                      </span>
                    </button>

                    <button
                      onClick={() => handleTabClick('home')}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'home'
                          ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200/80'
                      }`}
                    >
                      <Home className={`w-4 h-4 shrink-0 ${activeTab === 'home' ? 'text-teal-600' : 'text-slate-500'}`} />
                      <span className="truncate">Domů</span>
                    </button>

                    <button
                      onClick={() => handleTabClick('news')}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'news'
                          ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200/80'
                      }`}
                    >
                      <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'news' ? 'text-teal-600' : 'text-slate-500'}`} />
                      <span className="truncate">Články & Redakce</span>
                    </button>

                    <button
                      onClick={() => handleTabClick('knihovna-studii')}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'knihovna-studii'
                          ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200/80'
                      }`}
                    >
                      <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === 'knihovna-studii' ? 'text-teal-600' : 'text-slate-500'}`} />
                      <span className="truncate">Knihovna studií</span>
                    </button>

                    <button
                      onClick={() => handleTabClick('videoteka')}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'videoteka'
                          ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200/80'
                      }`}
                    >
                      <Tv className={`w-4 h-4 shrink-0 ${activeTab === 'videoteka' ? 'text-teal-600' : 'text-slate-500'}`} />
                      <span className="truncate">Videotéka</span>
                    </button>

                    <button
                      onClick={() => handleTabClick('judikatura')}
                      className={`col-span-2 flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                        activeTab === 'judikatura'
                          ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Scale className={`w-4 h-4 shrink-0 ${activeTab === 'judikatura' ? 'text-teal-600' : 'text-slate-500'}`} />
                        <span className="truncate">Judikatura Ústavního soudu</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  </div>
                </div>

                {/* 2. SECTOR: 🔒 SOUKROMÁ ZÓNA & NÁSTROJE (User Space & AI) */}
                <div className="space-y-2.5 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-xs font-black text-teal-900 font-display uppercase tracking-wider">
                      <span className="text-base">🔒</span>
                      <span>Soukromá Zóna & AI Nástroje</span>
                    </div>
                    {isLoggedIn && (
                      <span className="text-[9px] font-mono bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full font-bold">
                        Aktivní účet
                      </span>
                    )}
                  </div>

                  {!isLoggedIn && (
                    <div className="bg-gradient-to-br from-teal-50 via-slate-50 to-indigo-50/60 p-3 rounded-2xl border border-teal-200/80 space-y-2 shadow-3xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 font-display">Přihlášení &amp; Registrace</span>
                        <span className="text-[9px] font-mono bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full font-bold">Zdarma</span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-tight">
                        Přihlaste se nebo si vytvořte bezplatný účet pro ukládání kalendáře péče, spisu a přístup k AI asistentovi.
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => {
                            onOpenAuth('login');
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                        >
                          <LogIn className="w-3.5 h-3.5 text-teal-300" />
                          <span>Přihlásit se</span>
                        </button>
                        <button
                          onClick={() => {
                            onOpenAuth('register');
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-xs border border-teal-500"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-teal-100" />
                          <span>Registrovat</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => handleTabClick('user-portal')}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'user-portal'
                          ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs'
                          : 'bg-gradient-to-r from-teal-50/50 to-emerald-50/50 hover:from-teal-100/60 hover:to-emerald-100/60 text-slate-800 border-teal-200/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-3xs">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold text-slate-900 block truncate">Můj portál</span>
                          <span className="text-[10px] text-teal-700 block truncate">Osobní kalendář, spis a data</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-teal-500 shrink-0" />
                    </button>

                    <button
                      onClick={() => handleTabClick('ai-assistant')}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'ai-assistant'
                          ? 'bg-indigo-50 text-indigo-950 border-indigo-300 shadow-xs'
                          : 'bg-gradient-to-r from-indigo-50/50 to-purple-50/50 hover:from-indigo-100/60 hover:to-purple-100/60 text-slate-800 border-indigo-200/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-3xs">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold text-indigo-950 block truncate">AI Právní Asistent</span>
                          <span className="text-[10px] text-indigo-700 block truncate">Sjednocené centrum generativního AI</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleTabClick('forum')}
                        className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                          activeTab === 'forum'
                            ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="truncate">Komunita & Fórum</span>
                      </button>

                      <button
                        onClick={() => handleTabClick('ke-stazeni')}
                        className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                          activeTab === 'ke-stazeni'
                            ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                        }`}
                      >
                        <FolderCheck className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="truncate">Vzory podání & žalob</span>
                      </button>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => handleTabClick('admin')}
                        className="w-full flex items-center justify-between p-2.5 bg-indigo-600 text-white font-bold text-xs rounded-2xl shadow-sm cursor-pointer mt-1"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-indigo-200" />
                          <span>Administrace portálu</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-indigo-200" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. SECTOR: 🗂️ ODBORNÉ TÉMATA & OKRUHY (21 Kategorizovaných oblastí) */}
                <div className="space-y-2.5 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => setTopicsAccordionOpen(!topicsAccordionOpen)}
                    className="w-full flex items-center justify-between p-3 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 rounded-2xl text-left transition-all cursor-pointer shadow-3xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">🗂️</span>
                      <span className="text-xs font-black text-indigo-950 font-display uppercase tracking-wider truncate">
                        Odborné Témata & Okruhy
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-200 text-indigo-900 text-[10px] font-mono font-black rounded-full shrink-0">
                        21
                      </span>
                    </div>
                    {topicsAccordionOpen ? <ChevronDown className="w-4 h-4 text-indigo-600 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {topicsAccordionOpen && (
                    <div className="space-y-2.5 animate-in fade-in duration-150 pt-1">
                      {/* Instant Category Filter */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text"
                          placeholder="Filtrovat např. výživné, střídavá péče..."
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-9 pr-8 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
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

                      {/* 2-Column Grid of Compact Tiles */}
                      <div className="grid grid-cols-2 gap-2">
                        {filteredCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              handleCategoryClick(cat.slug, cat.name);
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-start gap-2 p-2.5 bg-white hover:bg-indigo-50/80 active:bg-indigo-100 border border-slate-200/80 hover:border-indigo-300 rounded-2xl text-left transition-all shadow-3xs cursor-pointer group"
                          >
                            <span className="text-lg shrink-0 group-hover:scale-110 transition-transform leading-none mt-0.5">{cat.icon}</span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-950 block leading-tight line-clamp-2">
                                {cat.name}
                              </span>
                            </div>
                          </button>
                        ))}
                        {filteredCategories.length === 0 && (
                          <div className="col-span-2 text-center py-6 text-xs text-slate-400 font-mono bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            Žádná kategorie neodpovídá "{categoryFilter}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. SECTOR: ℹ️ O PROJEKTU & ZÁZEMÍ (Footer Menu) */}
                <div className="space-y-2.5 border-t border-slate-100 pt-4 pb-2">
                  <div className="flex items-center gap-2 px-1 text-xs font-black text-slate-900 font-display uppercase tracking-wider">
                    <span className="text-base">ℹ️</span>
                    <span>O projektu &amp; Zázemí</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* 1. 📖 Cesta zakladatele (Můj příběh & Spis) */}
                    <button
                      onClick={() => handleTabClick('cesta-zakladatele')}
                      className={`col-span-2 flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'cesta-zakladatele'
                          ? 'bg-amber-50 text-amber-950 border-amber-300 shadow-xs font-extrabold'
                          : 'bg-amber-50/40 hover:bg-amber-100/50 text-amber-900 border-amber-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-xs font-extrabold text-amber-950">📖 Cesta zakladatele (Můj příběh &amp; Spis)</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />
                    </button>

                    {/* 2. 📚 Odborný slovník pojmů */}
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-glossary', { detail: '' }));
                        setMobileMenuOpen(false);
                      }}
                      className="col-span-2 flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900">📚 Odborný slovník pojmů</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>

                    {/* 3. 🤝 Partneři projektu */}
                    <button
                      onClick={() => handleTabClick('partners')}
                      className={`flex items-center gap-2 p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'partners'
                          ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                      }`}
                    >
                      <Users className="w-4 h-4 text-slate-600 shrink-0" />
                      <span className="truncate">🤝 Partneři projektu</span>
                    </button>

                    {/* 4. 💡 Podpora provozu a financování */}
                    <button
                      onClick={() => handleTabClick('support')}
                      className={`flex items-center gap-2 p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'support'
                          ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs'
                          : 'bg-teal-50/50 hover:bg-teal-100/50 text-teal-900 border-teal-200/80'
                      }`}
                    >
                      <Heart className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="truncate">💡 Podpora provozu</span>
                    </button>

                    {/* 5. 🚨 Krizová pomoc & SOS linky */}
                    <button
                      onClick={() => handleTabClick('crisis')}
                      className={`col-span-2 flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'crisis'
                          ? 'bg-rose-50 text-rose-950 border-rose-300 shadow-xs font-extrabold'
                          : 'bg-rose-50/40 hover:bg-rose-100/50 text-rose-900 border-rose-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="text-xs font-extrabold text-rose-950">🚨 Krizová pomoc &amp; SOS linky</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-400 shrink-0" />
                    </button>

                    {/* 6. ✉️ Kontakt na autora projektu */}
                    <button
                      onClick={() => handleTabClick('contacts')}
                      className={`col-span-2 flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        activeTab === 'contacts'
                          ? 'bg-teal-50 text-teal-950 border-teal-300 shadow-xs font-extrabold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900">✉️ Kontakt na autora projektu</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
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
