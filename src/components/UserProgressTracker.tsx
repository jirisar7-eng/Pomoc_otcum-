/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Sliders, 
  FileText, 
  Scale, 
  Lock, 
  Briefcase,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface MilestoneStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'Právní' | 'Psychologické' | 'Evidence' | 'Péče';
  targetTab: string;
}

interface UserProgressTrackerProps {
  onNavigate?: (tabId: string) => void;
  className?: string;
}

export default function UserProgressTracker({ onNavigate, className = '' }: UserProgressTrackerProps) {
  const [steps, setSteps] = React.useState<MilestoneStep[]>(() => {
    try {
      const saved = localStorage.getItem('synthesis_parent_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse progress:', e);
    }
    return [
      {
        id: '1',
        title: 'Kompletace Trezoru důkazů',
        description: 'Uložit SMS, e-maily a záznamy předání dětí do osobní složky.',
        completed: true,
        category: 'Evidence',
        targetTab: 'ai-case-manager'
      },
      {
        id: '2',
        title: 'Modelování střídavé péče v Simulátoru',
        description: 'Vypočítat intervaly péče a posoudit sourozeneckou vazbu.',
        completed: true,
        category: 'Péče',
        targetTab: 'plan-pece'
      },
      {
        id: '3',
        title: 'Právní rešerše v Judikatuře ÚS ČR',
        description: 'Seznámit se s klíčovými nálezy k rovnocenné péči.',
        completed: false,
        category: 'Právní',
        targetTab: 'judikatura'
      },
      {
        id: '4',
        title: 'Sestavení Rodičovského plánu péče',
        description: 'Vypracovat dohodu ohledně prázdnin, svátků a zdravotní péče.',
        completed: false,
        category: 'Péče',
        targetTab: 'plan-pece'
      },
      {
        id: '5',
        title: 'AI Audit a kontrola podání pro OSPOD',
        description: 'Provést automatizovanou analýzu právních rizik a argumentů.',
        completed: false,
        category: 'Psychologické',
        targetTab: 'ai-assistant'
      }
    ];
  });

  const toggleStep = (id: string) => {
    setSteps(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s);
      try {
        localStorage.setItem('synthesis_parent_progress', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
      return updated;
    });
  };

  const completedCount = steps.filter(s => s.completed).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className={`bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 ${className}`}>
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Můj postup & Připravenost rodiče</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 font-display">
            Stav přípravy na jednání s OSPOD a soudem
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            Sledujte své splněné kroky, budujte neprůstřelnou argumentaci a připravte se na opatrovnické řízení krok za krokem.
          </p>
        </div>

        {/* Circular Progress Score Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-md">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" className="text-slate-700" fill="transparent" />
              <circle 
                cx="28" 
                cy="28" 
                r="22" 
                stroke="currentColor" 
                strokeWidth="4" 
                className="text-teal-400 transition-all duration-500" 
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * percentage) / 100}
                strokeLinecap="round"
                fill="transparent" 
              />
            </svg>
            <span className="absolute text-xs font-black font-mono text-teal-300">{percentage}%</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold block">Skóre Připravenosti</span>
            <span className="text-sm font-extrabold text-white block">{completedCount} z {steps.length} kroků hotovo</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {percentage >= 80 ? '🟢 Výborně připraven' : percentage >= 40 ? '🟡 Pokročilá příprava' : '🔴 Na začátku cesty'}
            </span>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Klíčové milníky přípravy
        </h4>

        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                step.completed 
                  ? 'bg-teal-50/40 border-teal-200/80 text-slate-800' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => toggleStep(step.id)}
                  className="mt-0.5 text-slate-400 hover:text-teal-600 cursor-pointer transition-colors shrink-0"
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-teal-600 fill-teal-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </button>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-bold ${step.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {step.title}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-md font-bold">
                      {step.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate(step.targetTab)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer self-start sm:self-center"
                >
                  <span>Přejít</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Recommendation Footer */}
      <div className="p-4 bg-gradient-to-r from-teal-50 via-indigo-50/50 to-teal-50 border border-teal-100 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-600 text-white rounded-xl shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Doporučený další krok</span>
            <span className="text-[11px] text-slate-600 block">Vygenerujte podklady pro soud v 5-krokovém Simulátoru péče.</span>
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('plan-pece')}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer shrink-0"
          >
            Spustit Simulátor
          </button>
        )}
      </div>

    </div>
  );
}
