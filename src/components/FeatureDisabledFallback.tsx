// src/components/FeatureDisabledFallback.tsx
// Component rendered when a user navigates to a feature that is currently disabled via Feature Flags

import React from 'react';
import { Sliders, ArrowLeft, Home, ShieldAlert, Wrench } from 'lucide-react';

interface FeatureDisabledFallbackProps {
  featureName: string;
  onGoHome?: () => void;
}

export const FeatureDisabledFallback: React.FC<FeatureDisabledFallbackProps> = ({
  featureName,
  onGoHome
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
      <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center justify-center mx-auto text-amber-600 shadow-sm">
        <Wrench className="w-10 h-10 animate-bounce" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Modul dočasně pozastaven</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {featureName}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Tento modul byl administrátorem portálu dočasně pozastaven z důvodu údržby, aktualizace AI modelů nebo plánovaného vylepšení. Prosíme o strpení, brzy jej opět zpřístupníme.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Home className="w-4 h-4 text-teal-400" />
            <span>Návrat na hlavní přehled</span>
          </button>
        )}
      </div>
    </div>
  );
};
