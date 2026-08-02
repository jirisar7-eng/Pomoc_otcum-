/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Code, 
  ExternalLink, 
  Award, 
  Share2, 
  Compass, 
  Scale, 
  FileText, 
  X, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';

interface IntroScreenProps {
  onDismiss: (targetTab?: string) => void;
}

export default function IntroScreen({ onDismiss }: IntroScreenProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleProceed = (targetTab?: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tata_ma_pravo_session_intro_dismissed', 'true');
      if (dontShowAgain) {
        localStorage.setItem('tata_ma_pravo_hide_intro', 'true');
      }
    }
    onDismiss(targetTab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] via-slate-50 to-[#F0EDEB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-30 -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-20 translate-y-20 -translate-x-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl w-full bg-white rounded-3xl border border-slate-150/75 shadow-xl relative overflow-hidden"
      >
        {/* Colorful header accent line */}
        <div className="h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-rose-400"></div>

        <div className="p-6 md:p-10 space-y-8">
          
          {/* Main Title Header */}
          <div className="space-y-3 text-center sm:text-left border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full text-rose-700 font-mono text-[10px] uppercase font-bold tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              PROJEKT VE VÝVOJI • VERZE ALPHA 0.5.1
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-display leading-tight">
              📢 Oznámení k verzi 0.5.1 portálu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-rose-500">
                Táta má právo
              </span>
            </h1>
          </div>

          {/* Main Manifesto Body text */}
          <div className="text-slate-650 text-xs sm:text-sm leading-relaxed space-y-5 text-justify">
            <p className="font-semibold text-slate-800 text-sm sm:text-base border-l-4 border-teal-500 pl-4 py-1">
              Rád bych se s vámi podělil o několik informací k aktuálnímu stavu a rozvoji celého projektu.
            </p>
            
            <p>
              Portál <strong>Táta má právo</strong> se posunul do fáze <strong>Alpha 0.5.1</strong>. Systém přihlašování je již plně funkční a 100% bezpečný – využíváme moderní biometrické ověření <strong>Passkeys (otisk prstu / FaceID)</strong> a přihlášení přes Google. Vaše účty i citlivá data jsou v maximálním bezpečí bez nutnosti ukládat klasická hesla. Po obsahové i funkční stránce postupně rozšiřujeme další interaktivní nástroje a moduly.
            </p>

            <p>
              Hlavním posláním portálu zůstává nekompromisně <strong>dítě, jeho nejlepší zájem a právo na péči obou rodičů</strong>. Abychom vám ale pomohli zvládnout celou tuto náročnou etapu, rozšířili jsme obsah o praktickou podpůrnou sekci <strong>„Životní situace po rozchodu“</strong>. Najdete v ní návody pro řešení majetku (SJM), finanční stabilizaci, psychickou pohodu i přípravu nového zázemí pro děti.
            </p>

            <p>
              Rozhodl jsem se web zveřejňovat postupně už během vývoje, protože mi záleží na názorech lidí, kterým je určen – tedy samotných tátech. Vaše připomínky, nápady a zpětná vazba jsou pro mě velmi cenné a pomohou určovat směr dalšího vývoje.
            </p>

            {/* AI and Vibecoding disclaimer block */}
            <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-2.5">
              <h3 className="font-bold text-slate-850 flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                <Code className="w-4 h-4 text-teal-600" />
                &lt;/&gt; VIBECODING &amp; GOOGLE AI STUDIO
              </h3>
              <p className="text-slate-600 text-xs">
                Zároveň chci otevřeně říct, že je projekt vytvářen také s pomocí <strong>Google AI Studio</strong> a metodou známou jako <strong>vibecoding</strong>. Beru to jako moderní vývojový nástroj – podobně jako někdo využije WordPress nebo jiný redakční systém. AI za mě nerozhoduje, ale pomáhá mi převést moje nápady a reálné potřeby otců do funkční podoby rychleji a efektivněji. Celou koncepci, obsah, funkce a právní směr projektu navrhuji a řídím já.
              </p>
            </div>

            <p>
              Na projektu pracuji každý den. Opravuji chyby, rozšiřuji databázi e-Sbírky, judikatury i návodů a přidávám další funkce. Pokud narazíte na cokoliv, co nefunguje, nebo máte nápad na zlepšení, neváhejte mi napsat přes formulář nebo v komunitní sekci.
            </p>

            <div className="bg-rose-50/40 border border-rose-100/50 p-4.5 rounded-2xl text-rose-950 font-serif italic text-center text-xs sm:text-sm flex items-center justify-center gap-2">
              <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500/20 shrink-0" />
              <span>Děkuji za vaši podporu a trpělivost. Každá připomínka posouvá projekt o krok dál.</span>
            </div>

            {/* Clean small quick-link buttons at the bottom */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 font-medium mr-1">Rychlé odkazy:</span>
              <button
                type="button"
                onClick={() => handleProceed('partners')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-teal-600" />
                <span>Sekce Sponzoři</span>
              </button>

              <button
                type="button"
                onClick={() => handleProceed('sitemap')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 hover:border-sky-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                <span>Mapa stránek</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span>Podmínky užívání</span>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* "Don't show again" option */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-teal-600 border-slate-300 focus:ring-teal-500 cursor-pointer"
              />
              <span className="text-xs text-slate-500 group-hover:text-slate-700 select-none font-semibold transition-colors">
                Toto oznámení příště přeskočit a jít rovnou na portál
              </span>
            </label>

            {/* CTA Button */}
            <button
              onClick={() => handleProceed()}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Pokračovat na hlavní stránku
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </motion.div>

      {/* Terms of Use Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 font-display">
                      Podmínky užívání & AI Prohlášení
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Právní doložka a odpovědnost autora
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-slate-650 text-xs sm:text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Důležité upozornění
                  </div>
                  <p className="text-xs">
                    Tento web je budován svépomocí za použití umělé inteligence (AI), odborných zdrojů a mých vlastních zkušeností z opatrovnických sporů.
                  </p>
                </div>

                <p>
                  <strong>Autor není právník</strong> ani nemá právní či psychologické vzdělání. Veškeré informace, generované výstupy AI asistentů a vzory dokumentů na tomto portálu mají <strong>pouze informační a edukativní charakter</strong>.
                </p>

                <p>
                  Obsah a vzory mohou obsahovat chyby nebo nepřesnosti. Užíváním tohoto portálu výslovně souhlasíte s tím, že <strong>autor nenese žádnou právní ani materiální odpovědnost</strong> za případné chyby, opomenutí či jakékoliv následky jejich použití v reálných soudních či opatrovnických řízeních.
                </p>

                <p>
                  Všechny právní kroky, podání k soudu nebo komunikaci s OSPOD a advokáty doporučujeme vždy konzultovat s kvalifikovaným advokátem nebo odbornou právní poradnou.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowTermsModal(false);
                    handleProceed('rights');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Sekce Právní doložka</span>
                </button>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Rozumím a souhlasím
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

