/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
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
  FolderCheck
} from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../lib/LanguageContext';
import UniversalSearchInput from './UniversalSearchInput';
import NotificationCenter from './NotificationCenter';
import { 
  PUBLIC_TOPBAR_ITEMS, 
  LOGGED_IN_SECTIONS, 
  ADMIN_SECTION,
  NavItem,
  NavSection
} from '../data/navigationData';

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
  // Default all accordions in mobile menu to CLOSED
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

  const { t, language } = useLanguage();

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

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
      {/* Official Top Announcement Bar */}
      <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-slate-900 text-white text-[11px] font-mono py-2 px-4 text-center flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-semibold border-b border-teal-500/10">
        <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse shrink-0" />
        <span>{t('hero_welcome', 'Syntetický právní a poradenský hub pro rovnocenné rodičovství')}</span>
        <span className="hidden md:inline text-teal-200">•</span>
        <span className="hidden lg:inline text-[10px] text-teal-100 font-sans">
          {isLoggedIn 
            ? `Přihlášen jako ${currentUser.name} (${currentUser.role === 'admin' ? 'Administrátor' : 'Rodič'})`
            : 'Sjednocená platforma: Judikatura • AI Analýza • Simulátor péče'}
        </span>
      </div>

      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[72px] py-2 gap-2">
            
            {/* Logo & Branding */}
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
                <span className="text-[9px] text-slate-400 block mt-1 font-mono tracking-wider uppercase font-medium">
                  Synthesis OS
                </span>
              </div>
            </div>

            {/* Desktop Navigation Topbar */}
            <nav className="hidden xl:flex items-center justify-center gap-1 max-w-[50%] py-1">
              {PUBLIC_TOPBAR_ITEMS.slice(0, 6).map((item) => {
                const ItemIcon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-teal-50 border-teal-200 text-teal-800 shadow-3xs'
                        : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    title={item.desc}
                  >
                    <ItemIcon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

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
            <div className="hidden md:flex items-center gap-2 shrink-0">
              
              {/* Universal Search Bar Component */}
              <UniversalSearchInput 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onNavigate={handleTabClick}
                className="w-48 xl:w-64"
              />

              {/* Notification Center */}
              <NotificationCenter onNavigate={handleTabClick} />

              {/* Glossary Button */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-glossary', { detail: '' }))}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition-all cursor-pointer shadow-3xs"
                title="Slovník odborných pojmů"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>Slovník</span>
              </button>

              {/* Support Button */}
              <button
                onClick={() => handleTabClick('support')}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-bold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-teal-50 border-teal-200 text-teal-800'
                    : 'bg-teal-50/40 hover:bg-teal-50 border-teal-100/50 text-teal-700 hover:border-teal-200 shadow-3xs'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 text-teal-600 ${activeTab === 'support' ? '' : 'animate-pulse'}`} />
                <span>Podpořit</span>
              </button>

              {/* User Authentication Profile Badge */}
              {currentUser ? (
                <div className="flex items-center gap-2 bg-slate-50 pl-2 pr-2 py-1 rounded-full border border-slate-200">
                  <button
                    onClick={() => handleTabClick('profile')}
                    className="flex items-center gap-2 text-left cursor-pointer hover:opacity-85 transition-opacity outline-none"
                    title="Přejít na Můj Profil"
                  >
                    <img 
                      src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                      alt={currentUser.name} 
                      className="w-6.5 h-6.5 rounded-full border border-teal-300"
                    />
                    <div className="flex flex-col">
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
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0"
                >
                  <LogIn className="w-3 h-3 text-teal-300" />
                  <span>Přihlásit se</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex xl:hidden items-center gap-2">
              <NotificationCenter onNavigate={handleTabClick} />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Menu Navigace"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Accordion Drawer (All accordions default CLOSED) */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-100 bg-white shadow-2xl py-4 px-4 space-y-4 max-h-[85vh] overflow-y-auto">
            
            {/* Universal Search in Mobile */}
            <UniversalSearchInput 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onNavigate={handleTabClick}
            />

            {/* Home Direct Button */}
            <button
              onClick={() => handleTabClick('home')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'home' ? 'bg-teal-50 text-teal-900 border-l-4 border-teal-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>Domů</span>
            </button>

            {/* 1. Public Topbar Items */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Veřejný Portál
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {PUBLIC_TOPBAR_ITEMS.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                        isActive ? 'bg-teal-50 text-teal-900 border border-teal-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Logged In Private Sections (Accordions closed by default) */}
            {isLoggedIn && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-wider px-2">
                  🔒 Soukromá Zóna
                </div>

                {LOGGED_IN_SECTIONS.map((sec) => {
                  const isExpanded = mobileExpandedSection === sec.id;
                  return (
                    <div key={sec.id} className="border border-teal-100 rounded-2xl overflow-hidden bg-teal-50/20">
                      <button
                        onClick={() => setMobileExpandedSection(isExpanded ? null : sec.id)}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-extrabold text-teal-950 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
                          <span>{sec.title}</span>
                        </div>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-teal-600" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      </button>

                      {isExpanded && (
                        <div className="p-2 bg-white space-y-1 divide-y divide-slate-50 border-t border-teal-100">
                          {sec.items.map((item) => {
                            const ItemIcon = item.icon;
                            const isSubActive = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                                  isSubActive ? 'bg-teal-50 text-teal-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <ItemIcon className={`w-4 h-4 shrink-0 mt-0.5 ${isSubActive ? 'text-teal-600' : 'text-slate-400'}`} />
                                <div>
                                  <span className="text-xs font-bold block">{item.label}</span>
                                  <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. Admin Section on Mobile */}
            {isAdmin && (
              <div className="border border-indigo-200 rounded-2xl p-2.5 bg-indigo-50/40 space-y-1">
                <div className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-wider px-1">
                  👑 Administrace
                </div>
                <button
                  onClick={() => handleTabClick('admin')}
                  className="w-full flex items-center gap-2 p-2 bg-white text-indigo-900 border border-indigo-200 text-xs font-bold rounded-xl"
                >
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Admin Panel</span>
                </button>
              </div>
            )}

            {/* Glossary Button */}
            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-glossary', { detail: '' }));
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Odborný slovník pojmů</span>
              </button>
            </div>

            {/* Footer Auth Control */}
            <div className="border-t border-slate-100 pt-3">
              {currentUser ? (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                        alt={currentUser.name} 
                        className="w-8 h-8 rounded-full border border-teal-300"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 block truncate">{currentUser.name}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{currentUser.email}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors border border-rose-200 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Odhlásit se</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-teal-300" />
                  <span>Přihlásit se do portálu</span>
                </button>
              )}
            </div>

          </div>
        )}
      </header>
    </>
  );
}
