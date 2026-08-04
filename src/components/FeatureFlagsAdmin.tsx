// src/components/FeatureFlagsAdmin.tsx
// Administration Control Panel for managing Feature Flags in Synthesis OS

import React, { useState } from 'react';
import {
  Sliders,
  Power,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bot,
  Briefcase,
  Layers,
  RotateCcw,
  ShieldCheck,
  Zap,
  Info,
  Search,
  Check,
  AlertTriangle,
  Globe,
  Radio
} from 'lucide-react';
import { useFeatures } from '../hooks/useFeatures';
import { FeatureCategory } from '../services/featureFlagsService';
import { User } from '../types';

interface FeatureFlagsAdminProps {
  currentUser?: User | null;
}

export const FeatureFlagsAdmin: React.FC<FeatureFlagsAdminProps> = ({ currentUser }) => {
  const {
    flags,
    toggleFeature,
    setBulkState,
    resetDefaults,
    activeCount,
    totalCount,
    aiActiveCount,
    aiTotalCount
  } = useFeatures();

  const [selectedCategory, setSelectedCategory] = useState<'all' | FeatureCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const userName = currentUser?.name || 'Administrator';

  const filteredFlags = flags.filter((f) => {
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      f.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.feature_key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categoryLabels: Record<FeatureCategory, { label: string; icon: React.ReactNode; color: string }> = {
    ai_tools: {
      label: 'AI & Chytré nástroje',
      icon: <Sparkles className="w-3.5 h-3.5 text-teal-400" />,
      color: 'bg-teal-500/10 text-teal-700 border-teal-200'
    },
    workspace: {
      label: 'Pracovna & Hub',
      icon: <Briefcase className="w-3.5 h-3.5 text-indigo-400" />,
      color: 'bg-indigo-500/10 text-indigo-700 border-indigo-200'
    },
    public_tools: {
      label: 'Veřejné nástroje',
      icon: <Globe className="w-3.5 h-3.5 text-sky-400" />,
      color: 'bg-sky-500/10 text-sky-700 border-sky-200'
    },
    integrations: {
      label: 'Státní API & Integrace',
      icon: <Radio className="w-3.5 h-3.5 text-amber-400" />,
      color: 'bg-amber-500/10 text-amber-700 border-amber-200'
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="feature-flags-admin-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/30 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/40 rounded-full text-teal-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-teal-400" />
              <span>Feature Flags Engine • Switchboard v2.4</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Správa funkcí webu &amp; AI modulů
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Centrální řídicí panel pro okamžité zapínání a vypínání AI generátorů, osobních pracoven a veřejných kalkulaček v reálném čase. Všechny změny se okamžitě projeví napříč portálem.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Celkem</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">{totalCount}</div>
              <div className="text-[9px] text-slate-400 mt-0.5">modulů</div>
            </div>

            <div className="bg-teal-950/50 border border-teal-800/50 p-3.5 rounded-2xl text-center">
              <div className="text-[10px] font-mono text-teal-400 uppercase tracking-wider font-bold">Aktivních</div>
              <div className="text-xl sm:text-2xl font-black text-teal-300 mt-1">
                {activeCount} <span className="text-xs font-normal text-teal-400/70">/ {totalCount}</span>
              </div>
              <div className="text-[9px] text-teal-400/80 mt-0.5">spuštěno</div>
            </div>

            <div className="bg-indigo-950/50 border border-indigo-800/50 p-3.5 rounded-2xl text-center">
              <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">AI Moduly</div>
              <div className="text-xl sm:text-2xl font-black text-indigo-300 mt-1">
                {aiActiveCount} <span className="text-xs font-normal text-indigo-400/70">/ {aiTotalCount}</span>
              </div>
              <div className="text-[9px] text-indigo-400/80 mt-0.5">aktivních</div>
            </div>
          </div>
        </div>
      </div>

      {/* Master Action Controls Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              Globální povely (Master Controls)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Master Off AI */}
            <button
              onClick={() => {
                setBulkState('ai_tools', false, userName);
                showToast('Všechny AI moduly byly hromadně VYPNUTY.');
              }}
              className="flex-1 sm:flex-none py-2 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              title="Vypne pouze generativní AI moduly a poradce"
            >
              <Power className="w-3.5 h-3.5 text-rose-600" />
              <span>Vypnout všechny AI moduly</span>
            </button>

            {/* Master On All */}
            <button
              onClick={() => {
                setBulkState('all', true, userName);
                showToast('Všechny funkce webu byly hromadně ZAPNUTY.');
              }}
              className="flex-1 sm:flex-none py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              title="Zapne veškeré dostupné moduly"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-200" />
              <span>Zapnout vše</span>
            </button>

            {/* Reset to Defaults */}
            <button
              onClick={() => {
                resetDefaults(userName);
                showToast('Obnoveno výchozí tovární nastavení modulů.');
              }}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="Obnovit výchozí konfiguraci"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Výchozí</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Vše ({flags.length})
            </button>

            {(['ai_tools', 'workspace', 'public_tools', 'integrations'] as FeatureCategory[]).map((cat) => {
              const meta = categoryLabels[cat];
              const count = flags.filter((f) => f.category === cat).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {meta.icon}
                  <span>{meta.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-slate-800 text-teal-300' : 'bg-slate-200 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hledat podle klíče nebo názvu..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature Flags Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="feature-flags-cards-grid">
        {filteredFlags.map((flag) => {
          const categoryMeta = categoryLabels[flag.category];

          return (
            <div
              key={flag.feature_key}
              className={`bg-white border rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                flag.is_enabled
                  ? 'border-slate-200/90 shadow-xs hover:border-teal-300/80 hover:shadow-md'
                  : 'border-slate-200 bg-slate-50/50 opacity-90'
              }`}
            >
              {/* Top Row: Category + Status Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 ${categoryMeta.color}`}>
                    {categoryMeta.icon}
                    <span>{categoryMeta.label}</span>
                  </span>

                  <span
                    className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 tracking-wider ${
                      flag.is_enabled
                        ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-300/50'
                        : 'bg-rose-500/15 text-rose-800 border border-rose-300/50'
                    }`}
                  >
                    {flag.is_enabled ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Aktivní</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Vypnuto</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Feature Title & Key */}
                <h4 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                  {flag.display_name}
                </h4>
                <div className="text-[10px] font-mono text-slate-400 font-bold mt-0.5">
                  key: <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded border border-slate-200">{flag.feature_key}</code>
                </div>

                <p className="text-slate-600 text-xs mt-2.5 leading-relaxed">
                  {flag.description}
                </p>
              </div>

              {/* Bottom Row: Toggle Switch Button & Metadata */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-[9px] font-mono text-slate-400 space-y-0.5">
                  <div>Změna: {new Date(flag.updated_at).toLocaleDateString('cs-CZ')}</div>
                  <div>Změnil: {flag.updated_by || 'Admin'}</div>
                </div>

                {/* Interactive Toggle Switch */}
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !flag.is_enabled;
                    toggleFeature(flag.feature_key, nextState, userName);
                    showToast(`Modul "${flag.display_name}" byl ${nextState ? 'ZAPNUT' : 'VYPNUT'}.`);
                  }}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                    flag.is_enabled ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={flag.is_enabled}
                  title={`Kliknutím ${flag.is_enabled ? 'vypnete' : 'zapnete'} tento modul`}
                >
                  <span className="sr-only">Přepnout {flag.display_name}</span>
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                      flag.is_enabled ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  >
                    {flag.is_enabled ? (
                      <Check className="w-3.5 h-3.5 text-teal-600 font-black" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFlags.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <Info className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-extrabold text-slate-800 text-base">Žádné moduly neodpovídají filtru</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Zkuste upravit vyhledávací dotaz nebo přepnout na záložku "Vše".
          </p>
        </div>
      )}

      {/* Info Warning Footer Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 leading-relaxed">
          <span className="font-bold text-amber-900 block">
            Bezpečnostní poznámka k Feature Flags Engine:
          </span>
          <p className="text-amber-800">
            Při vypnutí funkce se příslušné tlačítko a modul okamžitě skryjí z hlavní navigace a uživatelského menu. Pokud uživatel zkusí otevřít dočasně deaktivovaný modul přes přímou URL, bude přesměrován na přívětivou hlášku o plánované údržbě. Nastavení se ukládá do lokálního i cloudového úložiště.
          </p>
        </div>
      </div>
    </div>
  );
};
