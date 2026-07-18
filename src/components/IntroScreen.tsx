/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2, Flame, Heart, Info, Code } from 'lucide-react';

interface IntroScreenProps {
  onDismiss: () => void;
}

export default function IntroScreen({ onDismiss }: IntroScreenProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleProceed = () => {
    if (dontShowAgain) {
      localStorage.setItem('tata_ma_pravo_hide_intro', 'true');
    }
    onDismiss();
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
              Projekt ve vývoji • Alfa Verze
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-display leading-tight">
              📢 Oznámení k alfa verzi portálu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-rose-500">
                Táta má právo
              </span>
            </h1>
          </div>

          {/* Main Manifesto Body text */}
          <div className="text-slate-650 text-xs sm:text-sm leading-relaxed space-y-5 text-justify">
            <p className="font-semibold text-slate-800 text-sm sm:text-base border-l-4 border-teal-500 pl-4 py-1">
              Rád bych se s vámi podělil o několik informací k aktuálnímu stavu projektu.
            </p>
            
            <p>
              Portál <strong>Táta má právo</strong> je zatím ve velmi rané fázi vývoje a to, co je nyní veřejně dostupné, představuje alfa verzi. Po obsahové stránce je většina hlavních sekcí již připravena, ale řada funkcí zatím není dokončená nebo ještě vůbec není aktivní. Přihlášení, některé interaktivní nástroje a další části portálu se budou postupně zprovozňovat.
            </p>

            <p>
              Rozhodl jsem se web zveřejnit už nyní, protože mi záleží na názorech lidí, kterým je určen. Vaše připomínky, nápady a zpětná vazba jsou pro mě velmi cenné a pomohou určit směr dalšího vývoje.
            </p>

            {/* AI and Vibecoding disclaimer block */}
            <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-2.5">
              <h3 className="font-bold text-slate-850 flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                <Code className="w-4 h-4 text-teal-600" />
                Vibecoding & Google AI Studio
              </h3>
              <p className="text-slate-600 text-xs">
                Zároveň chci otevřeně říct, že je projekt vytvářen také s pomocí <strong>Google AI Studio</strong> a metodou známou jako <strong>vibecoding</strong>. Beru to jako moderní vývojový nástroj – podobně jako někdo využije WordPress nebo jiný redakční systém. AI za mě nerozhoduje, ale pomáhá mi převést moje nápady do funkční podoby rychleji a efektivněji. Celou koncepci, obsah, funkce i směr projektu navrhuji a řídím já.
              </p>
            </div>

            <p>
              Na projektu pracuji každý den. Opravuji chyby, přidávám nové funkce a vylepšuji uživatelské prostředí. A upřímně – nemyslím si, že tento web bude někdy „hotový“. Stejně jako každý kvalitní projekt se bude neustále vyvíjet, rozšiřovat a přizpůsobovat potřebám lidí, kteří ho používají.
            </p>

            <p>
              Děkuji každému, kdo si portál vyzkouší a podělí se o svůj názor. Právě díky vám může vzniknout místo, které bude skutečně pomáhat rodičům orientovat se v opatrovnickém řízení a poskytne jim užitečné informace i praktické nástroje.
            </p>

            <div className="bg-rose-50/40 border border-rose-100/50 p-4.5 rounded-2xl text-rose-950 font-serif italic text-center text-xs sm:text-sm flex items-center justify-center gap-2">
              <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500/20 shrink-0" />
              <span>Děkuji za vaši podporu a trpělivost. Každá připomínka posouvá projekt o krok dál.</span>
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
              onClick={handleProceed}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Pokračovat na hlavní stránku
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
