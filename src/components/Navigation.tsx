/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  Shield, 
  Sparkles, 
  Home, 
  History, 
  FileSpreadsheet, 
  Scale, 
  ShieldCheck, 
  Gavel, 
  Coins, 
  Heart, 
  Flame,
  MessageCircle, 
  PhoneCall, 
  Bell,
  LifeBuoy,
  HeartHandshake,
  BookOpen,
  LayoutDashboard,
  Sliders,
  Briefcase,
  Database,
  Share2,
  Landmark,
  Tv,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
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
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>('about');
  
  const { t, language } = useLanguage();

  // Restructured Information Architecture v4.0 (Fully Localized!)
  const navigationSections = [
    {
      id: 'legal',
      title: 'I. Právní pomoc',
      items: [
        { id: 'legal-wiki', label: 'Právní minimum', icon: Database, desc: 'Základní právní pojmy, zákony a lhůty.' },
        { id: 'opatrovnicka-agenda', label: 'Opatrovnická agenda', icon: Landmark, desc: 'Průvodce procesem opatrovnického řízení.' },
        { id: 'ke-stazeni', label: 'Vzory podání & formuláře', icon: FileSpreadsheet, desc: 'Editovatelné vzory návrhů k soudu a OSPOD.' },
        { id: 'vyzivne', label: 'Kalkulačky výživného', icon: Coins, desc: 'Výpočet alimentů podle metodiky MS ČR 2026.' },
        { id: 'plan-pece', label: 'Plán péče o dítě', icon: Heart, desc: 'Parenting plan a dohoda o péči.' },
        { id: 'judikatura', label: 'Judikatura Ústavního soudu', icon: Scale, desc: 'Rozsudky a nálezy garantující práva rodičů.' }
      ]
    },
    {
      id: 'cases',
      title: 'II. Případy',
      items: [
        { id: 'pripadova-databaze', label: 'Databáze případů', icon: Database, desc: 'Anonymizované reálné opatrovnické spory.' },
        { id: 'sitemap', label: 'Časová osa & Vývoj', icon: History, desc: 'Interaktivní strom fází řízení a procesních lhůt.' },
        { id: 'ai-case-manager', label: 'Důkazy & Osobní složka', icon: Briefcase, desc: 'Evidence komunikace a příprava podkladů.' },
        { id: 'simulator', label: 'Simulátor péče', icon: Sliders, desc: 'Modelování ročního rozdělení času a nákladů.' }
      ]
    },
    {
      id: 'study',
      title: 'III. Studijní centrum',
      items: [
        { id: 'videoteka', label: 'Videotéka & Rozhovory', icon: Tv, desc: 'Odborná videa, rozbory judikátů a rozhovory.' },
        { id: 'knihovna-studies', label: 'Knihovna studií', icon: BookOpen, desc: 'Vědecké výzkumy o střídavé péči a psychologii.' },
        { id: 'news', label: 'Články & Informační báze', icon: Bell, desc: 'Odborné články, rady a právní rozbory.' },
        { id: 'vzdelavani', label: 'Vzdělávání & Poradna', icon: ShieldCheck, desc: 'Metodiky zvládání rozvodového konfliktu.' }
      ]
    },
    {
      id: 'community',
      title: 'IV. Komunita',
      items: [
        { id: 'forum', label: 'Diskusní Fórum', icon: MessageCircle, desc: 'Sdílení zkušeností a vzájemná podpora.' },
        { id: 'stories', label: 'Příběhy otců', icon: History, desc: 'Skutečné příběhy rodičů z praxe.' },
        { id: 'coparent-hub', label: 'Rodičovský hub', icon: HeartHandshake, desc: 'Asistovaná komunikace a sdílené události.' },
        { id: 'partners', label: 'Partneři & Advokáti', icon: Share2, desc: 'Ověření právníci, mediátoři a psychologové.' }
      ]
    },
    {
      id: 'ai-tools',
      title: 'V. AI nástroje',
      items: [
        { id: 'ai-assistant', label: 'AI Právní Asistent', icon: Sparkles, desc: 'Rychlé odpovídání na opatrovnické dotazy.' },
        { id: 'ai-guide', label: 'AI Průvodce řízením', icon: Sparkles, desc: 'Personalizovaná analýza vašeho procesního kroku.' },
        { id: 'aiauditor', label: 'AI Analýza & Audit', icon: Shield, desc: 'Automatická kontrola správnosti podání.' },
        { id: 'ai-admin', label: 'AI Administrátor', icon: LayoutDashboard, desc: 'Systémový pomocník správy obsahu.' }
      ]
    },
    {
      id: 'support',
      title: 'VI. Podpora',
      items: [
        { id: 'support', label: 'Darovat & Podpořit', icon: Heart, desc: 'Podpořte bezplatný provoz a vývoj portálu.' },
        { id: 'memento', label: 'Transparentní rozpočet', icon: Flame, desc: 'Přehled využití finančních prostředků.' },
        { id: 'crisis', label: 'Krizová pomoc SOS', icon: LifeBuoy, desc: 'Kontakty na linky krizové intervence.' }
      ]
    },
    {
      id: 'about',
      title: 'VII. O projektu',
      items: [
        { id: 'memento', label: 'Mise & Memento', icon: Flame, desc: 'Základní hodnotový pilíř ochrany dětí.' },
        { id: 'kontakt', label: 'Tým & Kontakt', icon: PhoneCall, desc: 'Kontaktní údaje a podněty zakladatelům.' },
        { id: 'rights', label: 'Často kladené dotazy', icon: ShieldCheck, desc: 'Odpovědi na nejčastější právní otázky.' }
      ]
    }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
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
    <>
      {/* Official Launch Top Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-slate-900 text-white text-[11px] font-mono py-2.5 px-4 text-center flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-semibold border-b border-teal-500/10">
        <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse shrink-0" />
        <span>{t('hero_welcome')}</span>
        <span className="hidden md:inline text-teal-200">•</span>
        <span className="hidden md:inline text-[10px] text-teal-100 font-sans">
          {language === 'sk' 
            ? 'Užívateľská navigácia bola kompletne reštrukturalizovaná do intuitívnych sekcií podľa cesty užívateľa.' 
            : language === 'en'
            ? 'User navigation was completely restructured into intuitive sections based on user journey.'
            : 'Uživatelská navigace byla kompletně restrukturalizována do intuitivních sekcí podle cesty uživatele.'}
        </span>
      </div>

      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[72px] py-2">
            
            {/* Logo & Slogan */}
            <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleTabClick('home')}>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-200 shadow-md overflow-hidden flex items-center justify-center shrink-0">
                <img 
                  src="/src/assets/images/tata_ma_pravo_logo_1784660128096.jpg" 
                  alt="Táta má právo Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                {language === 'sk' ? (
                  <span className="font-bold text-slate-800 text-base tracking-tight font-display flex items-center gap-1 leading-none">
                    Otec má <span className="text-teal-600">právo</span>
                  </span>
                ) : language === 'en' ? (
                  <span className="font-bold text-slate-800 text-base tracking-tight font-display flex items-center gap-1 leading-none">
                    Father Has <span className="text-teal-600">Rights</span>
                  </span>
                ) : (
                  <span className="font-bold text-slate-800 text-base tracking-tight font-display flex items-center gap-1 leading-none">
                    Táta má <span className="text-teal-600">právo</span>
                  </span>
                )}
                <span className="text-[9px] text-slate-400 block mt-1 font-mono tracking-wider uppercase font-medium">{t('brand_subtitle')}</span>
              </div>
            </div>

            {/* Desktop Structured Category Dropdowns Menu */}
            <nav className="hidden lg:flex items-center justify-center gap-1.5 max-w-[55%] py-1">
              {/* Home Link */}
              <button
                onClick={() => handleTabClick('home')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'home'
                    ? 'bg-teal-50 border-teal-100 text-teal-800 shadow-3xs'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                {t('nav_home')}
              </button>

              {/* Grouped Categories as Dropdowns */}
              {navigationSections.map((sec) => {
                const isSectionActive = sec.items.some(item => item.id === activeTab);
                const isDropdownOpen = openDropdown === sec.id;
                
                return (
                  <div 
                    key={sec.id} 
                    className="relative"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent closing on self-click
                    }}
                    onMouseEnter={() => setOpenDropdown(sec.id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => setOpenDropdown(isDropdownOpen ? null : sec.id)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                        isSectionActive
                          ? 'bg-teal-50/50 border-teal-100 text-teal-800'
                          : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{sec.title.substring(3)}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-teal-600' : ''}`} />
                    </button>

                    {/* Popover Dropdown Panel */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in duration-100 slide-in-from-top-1">
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mb-1.5 border-b border-slate-50">
                          {sec.title}
                        </div>
                        <div className="space-y-0.5">
                          {sec.items.map((item) => {
                            const ItemIcon = item.icon;
                            const isTabActive = activeTab === item.id;
                            
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                  isTabActive
                                    ? 'bg-teal-50 text-teal-950'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg shrink-0 ${
                                  isTabActive ? 'bg-teal-600 text-white shadow-3xs' : 'bg-slate-50 text-slate-400'
                                }`}>
                                  <ItemIcon className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className={`text-xs font-bold block ${isTabActive ? 'text-teal-950' : 'text-slate-800'}`}>
                                    {item.label}
                                  </span>
                                  <span className="text-[10px] text-slate-400 leading-normal block font-sans">
                                    {item.desc}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Admin Section Buttons */}
              {currentUser?.role === 'admin' && (
                <div className="flex items-center gap-1 border-l border-slate-100 pl-1.5">
                  <button
                    onClick={() => handleTabClick('ai-admin')}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      activeTab === 'ai-admin'
                        ? 'bg-indigo-600 border-indigo-700 text-white shadow-3xs'
                        : 'bg-indigo-50 border-transparent text-indigo-700 hover:bg-indigo-100'
                    }`}
                    title="Vstup do AI Admin doručovacího systému"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
                    AI Admin
                  </button>
                  <button
                    onClick={() => handleTabClick('admin')}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      activeTab === 'admin'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-3xs'
                        : 'bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50/50 hover:text-indigo-700 hover:border-indigo-300'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </button>
                </div>
              )}
            </nav>

            {/* Search bar & Auth */}
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  id="global-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder', 'Vyhledat v obsahu...')}
                  className="w-36 focus:w-44 pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-xs outline-none transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              {/* Slovník pojmů tlačítko */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-glossary', { detail: '' }))}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition-all cursor-pointer shadow-3xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                {t('glossary_btn', 'Slovník')}
              </button>

              {/* Srdíčkové tlačítko Podpořit */}
              <button
                onClick={() => handleTabClick('support')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-teal-50 border-teal-200 text-teal-800'
                    : 'bg-teal-50/40 hover:bg-teal-50 border-teal-100/50 text-teal-700 hover:border-teal-200 shadow-3xs'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 text-teal-600 ${activeTab === 'support' ? '' : 'animate-pulse'}`} />
                {t('btn_support', 'Podpořit web')}
              </button>

              {/* Authentication Buttons */}
              {currentUser ? (
                <div className="flex items-center gap-2 bg-slate-50 pl-2 pr-2.5 py-1 rounded-full border border-slate-100" id="user-profile-badge">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center gap-2 text-left cursor-pointer hover:opacity-85 transition-opacity outline-none"
                    title={t('btn_profile', 'Přejít na můj profil')}
                  >
                    <img 
                      src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                      alt={currentUser.name} 
                      className="w-6.5 h-6.5 rounded-full border border-teal-200"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-semibold text-slate-700 max-w-[70px] truncate leading-tight">{currentUser.name}</span>
                      <span className={`text-[7px] font-bold uppercase tracking-wider ${currentUser.role === 'admin' ? 'text-indigo-600' : 'text-teal-600'} leading-none`}>
                        {currentUser.role === 'admin' ? t('role_admin', 'Správce') : t('role_parent', 'Rodič')}
                      </span>
                    </div>
                  </button>
                  <button 
                    id="logout-btn"
                    onClick={onLogout}
                    className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-full transition-colors ml-1"
                    title={t('btn_logout', 'Odhlásit se')}
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  id="nav-login-btn"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <LogIn className="w-3 h-3 text-teal-300" />
                  {t('btn_login', 'Přihlásit se')}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Accordion Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white shadow-lg py-4 px-4 space-y-4 max-h-[85vh] overflow-y-auto" id="mobile-navigation-drawer">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder', 'Vyhledat v obsahu...')}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
            </div>

            {/* Direct Home Link */}
            <button
              onClick={() => handleTabClick('home')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'home' ? 'bg-teal-50 text-teal-800 border-l-4 border-teal-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 text-slate-400" />
              {t('nav_home')}
            </button>

            {/* Accordion Categories */}
            <div className="space-y-2">
              {navigationSections.map((sec) => {
                const isExpanded = mobileExpandedSection === sec.id;
                const isSectionActive = sec.items.some(item => item.id === activeTab);
                
                return (
                  <div key={sec.id} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
                    <button
                      onClick={() => setMobileExpandedSection(isExpanded ? null : sec.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-black transition-all ${
                        isSectionActive ? 'text-teal-800 bg-teal-50/20' : 'text-slate-700'
                      }`}
                    >
                      <span className="font-display">{sec.title}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-1.5 bg-white space-y-0.5 divide-y divide-slate-50/50">
                        {sec.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleTabClick(item.id)}
                              className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-all ${
                                isActive ? 'bg-teal-50/50 text-teal-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <ItemIcon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                              <div>
                                <span className="text-[11px] font-bold block">{item.label}</span>
                                <span className="text-[9px] text-slate-400 leading-normal block">{item.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Admin Special Buttons on Mobile */}
              {currentUser?.role === 'admin' && (
                <div className="border border-dashed border-indigo-100 rounded-xl p-1.5 bg-indigo-50/10 space-y-1">
                  <div className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider px-2 py-0.5">
                    ⚙️ Správa systému (Admin)
                  </div>
                  <button
                    onClick={() => handleTabClick('ai-admin')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                      activeTab === 'ai-admin' ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Admin Doručování
                  </button>
                  <button
                    onClick={() => handleTabClick('admin')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                      activeTab === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Administrace Hubu
                  </button>
                </div>
              )}
            </div>

            {/* Glossary Button */}
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-glossary', { detail: '' }));
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-teal-50 hover:bg-teal-100/80 border border-teal-100 text-teal-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-teal-600" />
                Odborný slovník pojmů
              </button>
            </div>

            {/* Profile / Logout section */}
            <div className="border-t border-slate-100 pt-3">
              {currentUser ? (
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100" id="mobile-user-profile">
                  <button
                    onClick={() => {
                      handleTabClick('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 text-left cursor-pointer hover:opacity-85 transition-opacity outline-none"
                    title={t('btn_profile', 'Přejít na můj profil')}
                  >
                    <img 
                      src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                      alt={currentUser.name} 
                      className="w-8 h-8 rounded-full border border-teal-200"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-800">{currentUser.name}</span>
                      <span className="text-[9px] text-slate-400">{currentUser.email}</span>
                    </div>
                  </button>
                  <button
                    id="mobile-logout-btn"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Odhlásit
                  </button>
                </div>
              ) : (
                <button
                  id="mobile-login-btn"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  <LogIn className="w-4 h-4 text-teal-300" />
                  Přihlásit se do portálu
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
