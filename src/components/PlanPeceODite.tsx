import React, { useState } from 'react';
import { Heart, Sliders, CalendarRange } from 'lucide-react';
import PeceODiteSection from './PeceODiteSection';
import CareSimulator from './CareSimulator';
import { User } from '../types';

interface PlanPeceODiteProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  setActiveTab: (tab: string) => void;
}

export default function PlanPeceODite({ currentUser, onOpenAuth, setActiveTab }: PlanPeceODiteProps) {
  const [subTab, setSubTab] = useState<'principles' | 'simulator'>('principles');

  const tabs = [
    {
      id: 'principles',
      label: 'Principy & Zásady péče',
      icon: Heart,
      desc: 'Formy péče, psychologické dopady, Dr. Warshak, dětští psychologové.'
    },
    {
      id: 'simulator',
      label: 'Simulátor střídání (Kalendář)',
      icon: Sliders,
      desc: 'Interaktivní plánovač, výpočet dnů a procentuálního podílu péče.'
    }
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="plan-pece-root">
      {/* Jumbotron Title */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500 rounded-full blur-3xl opacity-10 -translate-y-20 translate-x-20"></div>
        <div className="relative max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-teal-400" />
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider font-mono">Organizace a stabilita pro dítě</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight font-display">
            Plán péče o dítě
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Nástroje a odborné materiály zaměřené na praktickou realizaci konsenzuální péče. Zde se seznámíte s klíčovými principy blaha dětí při rozvodu a můžete si interaktivně namodelovat ideální harmonogram střídání.
          </p>
        </div>
      </div>

      {/* Controller Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shadow-3xs">
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

      {/* Tab Render Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-3xs p-1 md:p-3">
        {subTab === 'principles' ? (
          <PeceODiteSection 
            currentUser={currentUser} 
            onOpenAuth={onOpenAuth} 
            setActiveTab={setActiveTab} 
          />
        ) : (
          <CareSimulator />
        )}
      </div>
    </div>
  );
}
