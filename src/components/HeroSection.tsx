/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  Scale, 
  BookOpen, 
  FileText, 
  Users, 
  Download,
  ExternalLink, 
  Heart,
  Compass,
  CheckCircle2,
  Home
} from 'lucide-react';
import { HUB_JUDGMENTS } from '../data/contentHub';
import { useLanguage } from '../lib/LanguageContext';
import { translateText } from '../data/dynamicTranslations';

interface HeroSectionProps {
  onNavigate: (tabId: string, articleId?: string) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  partners?: any[];
}

export default function HeroSection({ onNavigate, onOpenAuth, isLoggedIn }: HeroSectionProps) {
  const { t, language } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Feature Cards for "Co zde najdete" (8 cards for 4-column responsive grid on desktop)
  const featureCards = [
    {
      id: 'opatrovnicka-agenda',
      title: translateText('Právní informace', language),
      desc: translateText('Pevná opora a krok za krokem opatrovnickým řízením i jednáním s OSPOD.', language),
      icon: Compass,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400',
      badge: translateText('PRŮVODCE', language)
    },
    {
      id: 'judikatura',
      title: translateText('Judikatura', language),
      desc: translateText('Klíčové nálezy Ústavního soudu a přelomové rozsudky pro střídavou péči.', language),
      icon: Scale,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400',
      badge: translateText('PRECEDENTY', language)
    },
    {
      id: 'knihovna-studii',
      title: translateText('Vědecké studie', language),
      desc: translateText('Recenzované výzkumy a odborné studie vlivu rodičovské péče a attachmentu.', language),
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400',
      badge: translateText('VÝZKUM', language)
    },
    {
      id: 'ai-assistant',
      title: translateText('AI průvodce', language),
      desc: translateText('Syntetický AI poradce pro rozbor spisu, podkladů a právních strategií.', language),
      icon: Sparkles,
      color: 'bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-400',
      badge: translateText('AI ENGINE', language)
    },
    {
      id: 'ke-stazeni',
      title: translateText('Vzory podání', language),
      desc: translateText('Připravené formuláře, návrhy k soudu a podání zdarma ke stažení.', language),
      icon: Download,
      color: 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-400',
      badge: translateText('FORMULÁŘE', language)
    },
    {
      id: 'life-situation',
      title: translateText('Životní situace', language),
      desc: translateText('Bydlení, finance, majetek a praktické zázemí po rozchodu či rozvodu.', language),
      icon: Home,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400',
      badge: translateText('ZÁZEMÍ', language)
    },
    {
      id: 'e-justice',
      title: translateText('e-Justice REST', language),
      desc: translateText('Státní REST API napojení na e-Sbírku a aktuální platnou legislativu.', language),
      icon: ExternalLink,
      color: 'bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400',
      badge: translateText('STÁTNÍ API', language)
    },
    {
      id: 'forum',
      title: translateText('Komunita', language),
      desc: translateText('Diskusní fórum, reálné příběhy otců a rodičovský hub pro sdílenou péči.', language),
      icon: Users,
      color: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400',
      badge: translateText('KOMUNITA', language)
    }
  ];

  // Latest news items
  const latestArticles = [
    {
      id: 'art-release-alpha-051',
      title: '🚀 Alpha 0.5.1: Rozšiřujeme portál o komplexní oporu při rozchodu',
      date: '2. 8. 2026',
      pills: 'VERZE ALPHA 0.5.1',
      excerpt: 'Vydáváme aktualizaci Alpha 0.5.1 s 8 novými specializovanými moduly pro řešení životních situací po rozchodu a stabilizaci zázemí pro děti.'
    },
    {
      id: 'art-forpsi-milestone',
      title: 'FORPSI: Sponzor doménové infrastruktury tatovacesta.cz',
      date: '28. 7. 2026',
      pills: 'DOMÉNA & SPONZOR',
      excerpt: 'Společnost FORPSI (Internet CZ, a.s.) bezplatně zaregistrovala doménu tatovacesta.cz pro podporu opatrovnické osvěty.'
    },
    {
      id: 'art-vedos-milestone',
      title: 'VEDOS: Sponzor webhostingu NoLimit pro Táta má právo',
      date: '27. 7. 2026',
      pills: 'TECHNOLOGICKÝ PARTNER',
      excerpt: 'Poskytnutí bezplatného webhostingu NoLimit společností VEDOS Internet, a.s. pro bleskový a stabilní chod portálu.'
    }
  ];

  // Latest judgments (top 3)
  const latestJudgments = HUB_JUDGMENTS.slice(0, 3);

  return (
    <div className="w-full space-y-10 sm:space-y-12 font-sans max-w-7xl mx-auto" id="homepage-root">
      
      {/* ========================================================================= */}
      {/* 1. HERO SEKCE                                                             */}
      {/* ========================================================================= */}
      <section 
        className="relative w-full bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden border border-teal-800/30 shadow-xl"
        id="home-hero-banner"
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 rounded-full text-xs font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-wider">Alpha 0.5.1</span>
              <span className="text-amber-400/50">•</span>
              <span className="text-slate-200">Táta má právo</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display leading-[1.15]" id="hero-title">
              Táta má právo – <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-200 to-amber-200">
                Nezávislý portál a právní opora pro otce.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl" id="hero-description">
              Pevná opora pro táty v opatrovnických řízeních, při rozchodu i boji o rovnocennou péči. Ověřené právní rozbory, judikatura Ústavního soudu, vzory podání a AI průvodce přímo pro otce.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-cta-start"
                onClick={() => onNavigate(isLoggedIn ? 'user-portal' : 'opatrovnicka-agenda')}
                className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{isLoggedIn ? 'Můj portál' : 'Začít'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                id="hero-cta-explore"
                onClick={() => scrollToSection('co-zde-najdete')}
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Prozkoumat portál</span>
                <Compass className="w-4 h-4 text-teal-400" />
              </button>
            </div>
          </div>

          {/* Desktop & Wide screen highlights card filling full banner width */}
          <div className="lg:col-span-5 xl:col-span-4 hidden lg:flex flex-col gap-3.5 bg-slate-900/60 border border-teal-500/20 rounded-2xl p-5 backdrop-blur-xs shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                Klíčové metriky portálu
              </span>
              <span className="text-[10px] font-mono text-slate-400">2026</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-800/70 border border-slate-700/50 rounded-xl">
                <span className="block text-xl font-extrabold text-teal-300 font-display">350+</span>
                <span className="text-[11px] text-slate-300 leading-tight block mt-0.5">Ověřených judikátů</span>
              </div>
              <div className="p-3 bg-slate-800/70 border border-slate-700/50 rounded-xl">
                <span className="block text-xl font-extrabold text-amber-300 font-display">24/7</span>
                <span className="text-[11px] text-slate-300 leading-tight block mt-0.5">AI Právní asistent</span>
              </div>
              <div className="p-3 bg-slate-800/70 border border-slate-700/50 rounded-xl">
                <span className="block text-xl font-extrabold text-emerald-300 font-display">100%</span>
                <span className="text-[11px] text-slate-300 leading-tight block mt-0.5">Zdarma ke stažení</span>
              </div>
              <div className="p-3 bg-slate-800/70 border border-slate-700/50 rounded-xl">
                <span className="block text-xl font-extrabold text-indigo-300 font-display">e-Sbírka</span>
                <span className="text-[11px] text-slate-300 leading-tight block mt-0.5">REST API napojení</span>
              </div>
            </div>

            <div className="p-3 bg-teal-950/40 border border-teal-800/40 rounded-xl text-xs text-teal-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Garantovaná nezávislá právní opora pro otce a jejich děti.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CO ZDE NAJDETE (Rozcestník nástrojů - 4 sloupce na desktopu)          */}
      {/* ========================================================================= */}
      <section className="space-y-6 scroll-mt-6 w-full" id="co-zde-najdete">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-teal-700 uppercase tracking-wider block mb-1">ROZCESTNÍK NÁSTROJŮ</span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              Co zde najdete
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Přehledný přístup k ověřeným modulům bez nepřehledného hledání.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {featureCards.map((card) => {
            const CardIcon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between shadow-2xs hover:shadow-md ${card.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-white rounded-xl shadow-2xs border border-slate-100">
                      <CardIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                      {card.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-display group-hover:text-teal-900 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mt-1">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-teal-900">
                  <span>Otevřít sekci</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. NEJNOVĚJŠÍ ČLÁNKY (3 ks)                                               */}
      {/* ========================================================================= */}
      <section className="space-y-6" id="nejnovejsi-clanky">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-teal-700 uppercase tracking-wider block mb-1">REDAKCE & NEWS</span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              Nejnovější články
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Zobrazit všechny</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigate('news', art.id)}
              className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{art.date}</span>
                  <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">{art.pills}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-800">
                <span>Číst článek</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. NEJNOVĚJŠÍ JUDIKATURA (3 ks)                                           */}
      {/* ========================================================================= */}
      <section className="space-y-6" id="nejnovejsi-judikatura">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-indigo-700 uppercase tracking-wider block mb-1">ROZHODNUTÍ SOUDŮ</span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              Nejnovější judikatura
            </h2>
          </div>
          <button
            onClick={() => onNavigate('judikatura')}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Celá databáze</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-700" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestJudgments.map((jud) => (
            <div
              key={jud.id}
              onClick={() => onNavigate('judikatura')}
              className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl border border-indigo-800/40 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-900/60 border border-indigo-700/50 px-2 py-0.5 rounded-md">
                    {jud.fileNo}
                  </span>
                  <span className="text-[10px] text-slate-400">{jud.court}</span>
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-indigo-200 transition-colors line-clamp-2">
                  {jud.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 italic">
                  "{jud.excerpt}"
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-indigo-200">
                <span>Detail judikátu</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PODPORA PROJEKTU                                                       */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-lg space-y-6" id="podpora-projektu">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">TRANSPARENTNÍ MISI</span>
            <h2 className="text-2xl font-extrabold text-white font-display">
              Podpora projektu Táta má právo
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Proč projekt existuje:</strong> Nezávislá osvěta a právní opora pro otce v opatrovnických řízeních pro zachování plnohodnotné péče obou rodičů o dítě.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Transparentní provoz:</strong> Fungujeme bez placených bran s podporou sponzorů doménové a webhostingové infrastruktury FORPSI a VEDOS.</span>
              </p>
            </div>
          </div>

          <div className="shrink-0 space-y-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('support')}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Podpořit projekt</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Transparentní dárcovské účty & Partnerství
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
