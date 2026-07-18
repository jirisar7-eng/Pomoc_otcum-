import React, { useState } from 'react';
import { ShieldCheck, Gavel, Coins, Landmark } from 'lucide-react';
import OspodSection from './OspodSection';
import SoudniRizeniSection from './SoudniRizeniSection';
import VyzivneSection from './VyzivneSection';

export default function OpatrovnickaAgenda() {
  const [subTab, setSubTab] = useState<'ospod' | 'soud' | 'vyzivne'>('ospod');

  const tabs = [
    { 
      id: 'ospod', 
      label: 'OSPOD', 
      icon: ShieldCheck, 
      desc: 'Role opatrovníka, příprava na šetření, práva rodiče.' 
    },
    { 
      id: 'soud', 
      label: 'Soudní řízení', 
      icon: Gavel, 
      desc: 'Průběh soudu, opatrovnická žaloba, dokazování.' 
    },
    { 
      id: 'vyzivne', 
      label: 'Výživné', 
      icon: Coins, 
      desc: 'Výpočet, tabulky výživného, vymáhání a dlužné alimenty.' 
    }
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="opatrovnicka-agenda-root">
      {/* Upper Jumbotron Title */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500 rounded-full blur-3xl opacity-10 -translate-y-20 translate-x-20"></div>
        <div className="relative max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-teal-400" />
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider font-mono">Právní proces krok za krokem</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight font-display">
            Opatrovnická agenda
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Srozumitelný a přehledný průvodce klíčovými pilíři rodinněprávního procesu. Zde najdete komplexní informace o roli OSPODu, průběhu soudního řízení a pravidlech pro výpočet či úpravu výživného.
          </p>
        </div>
      </div>

      {/* Segmented Sub-navigation Controller */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shadow-3xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-start gap-3 p-3.5 rounded-xl text-left transition-all cursor-pointer border ${
                isActive
                  ? 'bg-white border-teal-200/60 shadow-3xs text-teal-950 scale-[1.01]'
                  : 'bg-transparent border-transparent hover:bg-white/50 text-slate-600'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 transition-all ${
                isActive ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className={`text-xs font-bold block ${isActive ? 'text-teal-950' : 'text-slate-800'}`}>
                  {tab.label}
                </span>
                <span className="text-[10px] text-slate-400 leading-normal block">
                  {tab.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render selected Section with minimal transition wrapper */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-3xs p-1 md:p-3">
        {subTab === 'ospod' && <OspodSection />}
        {subTab === 'soud' && <SoudniRizeniSection />}
        {subTab === 'vyzivne' && <VyzivneSection />}
      </div>
    </div>
  );
}
