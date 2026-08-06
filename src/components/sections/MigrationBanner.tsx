import React, { useState, useEffect } from 'react';
import { Server, ExternalLink, X, Rocket, Info, HeartHandshake } from 'lucide-react';

export const MigrationBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Ověření, zda uživatel banner v této relaci/v tomto zařízení již nezavřel
    try {
      const isDismissed = localStorage.getItem('synthesis_migration_banner_dismissed');
      if (isDismissed !== 'true') {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('synthesis_migration_banner_dismissed', 'true');
    } catch (e) {
      console.warn('Nelze uložit stav zavření banneru do localStorage:', e);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      id="migration-banner-container"
      role="region"
      aria-label="Oznámení o migraci infrastruktury"
      className="relative z-50 bg-slate-900 text-slate-100 border-b border-indigo-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 shadow-md transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          
          {/* Levá ikona + obsah */}
          <div className="flex items-start gap-3 sm:gap-3.5 flex-1 min-w-0">
            {/* Ikona s jemným akcentním pozadím */}
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 shrink-0 mt-0.5 shadow-3xs">
              <Server className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>

            <div className="space-y-1.5 flex-1 text-xs sm:text-sm">
              
              {/* Titulek */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="sm:hidden text-indigo-400">
                  <Server className="w-4 h-4 inline-block" />
                </span>
                <h2 
                  id="migration-banner-title" 
                  className="font-display font-bold text-slate-100 text-sm sm:text-base leading-snug tracking-tight flex items-center gap-1.5"
                >
                  Připravujeme přechod na vlastní VPS infrastrukturu 🚀
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  <Rocket className="w-3 h-3 text-indigo-400" />
                  Plánovaná migrace
                </span>
              </div>

              {/* Podrobný text */}
              <p 
                id="migration-banner-description" 
                className="text-slate-300 text-xs sm:text-[13px] leading-relaxed max-w-5xl"
              >
                V následujících dnech může být funkčnost některých nových modulů omezená. Veškerý stávající obsah zůstává plně aktivní, ale vývoj a vylepšování portálu jsou dočasně pozastaveny. Přechod zabere maximálně týden, poté poběžíme plně na vlastní infrastruktuře.
              </p>

              {/* Sponzorský kredit */}
              <div 
                id="migration-banner-sponsor-credit"
                className="pt-1 flex items-center flex-wrap gap-1.5 text-xs text-slate-300"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>
                  Tento server pro náš projekt zajišťuje jako sponzorský dar společnost{' '}
                  <a
                    id="migration-banner-algotech-link"
                    href="https://www.algotech.cz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-teal-300 hover:text-teal-200 underline decoration-teal-400/50 hover:decoration-teal-300 underline-offset-2 inline-flex items-center gap-1 transition-colors group"
                  >
                    Algotech
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                  .
                </span>
              </div>

            </div>
          </div>

          {/* Zavírací tlačítko */}
          <button
            id="migration-banner-dismiss-button"
            onClick={handleDismiss}
            type="button"
            aria-label="Zavřít oznámení"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all shrink-0 cursor-pointer mt-0.5"
            title="Zavřít oznámení"
          >
            <X className="w-5 h-5" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default MigrationBanner;
