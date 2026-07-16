/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  MessageCircle, 
  PhoneCall, 
  Bell,
  LifeBuoy,
  HeartHandshake,
  BookOpen
} from 'lucide-react';
import { User } from '../types';

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

  const menuItems = [
    { id: 'home', label: 'Domů', icon: Home },
    { id: 'stories', label: 'Můj příběh', icon: History },
    { id: 'news', label: 'Články', icon: Bell },
    { id: 'judikatura', label: 'Judikatura', icon: Scale },
    { id: 'ke-stazeni', label: 'Vzory podání', icon: FileSpreadsheet },
    { id: 'ospod', label: 'OSPOD', icon: ShieldCheck },
    { id: 'soudni-rizeni', label: 'Soudní řízení', icon: Gavel },
    { id: 'vyzivne', label: 'Výživné', icon: Coins },
    { id: 'pece-o-dite', label: 'Péče o dítě', icon: Heart },
    { id: 'coparent-hub', label: 'Rodičovský Hub', icon: HeartHandshake },
    { id: 'crisis', label: 'Krizová pomoc', icon: LifeBuoy },
    { id: 'forum', label: 'Diskuze', icon: MessageCircle },
    { id: 'contacts', label: 'Kontakt', icon: PhoneCall },
    { id: 'support', label: 'Podpořit web', icon: Heart },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[72px] py-2">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => handleTabClick('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-slate-800 flex items-center justify-center text-white shadow-md shadow-teal-100">
              <Sparkles className="w-5.5 h-5.5 text-teal-300" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-base tracking-tight font-display flex items-center gap-1 leading-none">
                Táta má <span className="text-teal-600">právo</span>
              </span>
              <span className="text-[9px] text-slate-400 block mt-1 font-mono tracking-wider uppercase font-medium">Průvodce Opatrovnictvím</span>
            </div>
          </div>

          {/* Desktop Navigation Link */}
          <nav className="hidden xl:flex flex-wrap justify-center gap-1 max-w-[65%] py-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`nav-tab-${item.id}`}
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 shadow-3xs border border-teal-100/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
            
            {currentUser?.role === 'admin' && (
              <button
                id="nav-tab-admin"
                onClick={() => handleTabClick('admin')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  activeTab === 'admin'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50/50 hover:text-indigo-700 hover:border-indigo-300'
                } animate-pulse`}
              >
                <Shield className="w-3.5 h-3.5" />
                Administrace
              </button>
            )}
          </nav>

          {/* Search bar & Auth */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hledat..."
                className="w-40 focus:w-48 pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-xs outline-none transition-all placeholder:text-slate-400"
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
              Slovník pojmů
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
              Podpořit web
            </button>

            {/* Authentication Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-50 pl-2 pr-2.5 py-1 rounded-full border border-slate-100" id="user-profile-badge">
                <img 
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                  alt={currentUser.name} 
                  className="w-6.5 h-6.5 rounded-full border border-teal-200"
                />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-semibold text-slate-700 max-w-[80px] truncate leading-tight">{currentUser.name}</span>
                  <span className={`text-[8px] font-bold uppercase tracking-wider ${currentUser.role === 'admin' ? 'text-indigo-600' : 'text-teal-600'} leading-none`}>
                    {currentUser.role === 'admin' ? 'Správce' : 'Rodič'}
                  </span>
                </div>
                <button 
                  id="logout-btn"
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-full transition-colors ml-1"
                  title="Odhlásit se"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <LogIn className="w-3 h-3 text-teal-300" />
                Přihlásit se
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white shadow-lg py-3 px-4 space-y-3 max-h-[85vh] overflow-y-auto" id="mobile-navigation-drawer">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Vyhledat..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`mobile-nav-tab-${item.id}`}
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {item.label}
                </button>
              );
            })}

            {currentUser?.role === 'admin' && (
              <button
                id="mobile-nav-tab-admin"
                onClick={() => handleTabClick('admin')}
                className={`col-span-2 flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold border border-dashed transition-all ${
                  activeTab === 'admin'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'border-indigo-200 text-indigo-600 bg-indigo-50/20'
                }`}
              >
                <Shield className="w-4 h-4 text-indigo-500" />
                Administrace systému
              </button>
            )}
          </div>

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

          <div className="border-t border-slate-100 pt-3">
            {currentUser ? (
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100" id="mobile-user-profile">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-full border border-teal-200"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800">{currentUser.name}</span>
                    <span className="text-[9px] text-slate-400">{currentUser.email}</span>
                  </div>
                </div>
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
  );
}
