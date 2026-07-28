/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  Scale, 
  BookOpen, 
  FileText, 
  HeartHandshake, 
  Search, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  Zap, 
  AlertTriangle, 
  Coins, 
  Server, 
  Globe, 
  Users2, 
  CheckCircle2, 
  ExternalLink, 
  Brain, 
  Award, 
  FileSpreadsheet, 
  Compass, 
  ShieldCheck, 
  Layers, 
  Lock, 
  Activity, 
  PhoneCall,
  Heart,
  HelpCircle,
  Clock,
  Building2,
  FileCode
} from 'lucide-react';
import fatherAndChildHero from '../assets/images/father_and_child_hero_1783886957826.jpg';
import { Partner } from '../types';
import { HUB_CATEGORIES, HUB_JUDGMENTS, HUB_STUDIES } from '../data/contentHub';
import { useLanguage } from '../lib/LanguageContext';
import { translateText, getTranslatedObject } from '../data/dynamicTranslations';

interface HeroSectionProps {
  onNavigate: (tabId: string, articleId?: string) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  partners?: Partner[];
}

export default function HeroSection({ onNavigate, onOpenAuth, isLoggedIn, partners = [] }: HeroSectionProps) {
  const { t, language } = useLanguage();

  // Category search & expansion state
  const [categorySearch, setCategorySearch] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Copy legal sentence feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Featured categories for quick access
  const featuredCategorySlugs = [
    'pravni-rad',
    'stridava-pece',
    'nocni-pece',
    'rodicovska-alienace',
    'jednani-ospod',
    'judikatura'
  ];

  const featuredCategories = HUB_CATEGORIES.filter(c => featuredCategorySlugs.includes(c.slug));

  // Filtered categories based on user search query
  const filteredCategories = HUB_CATEGORIES.filter(cat => {
    const translatedCat = getTranslatedObject(cat.id, cat, language);
    return (
      translatedCat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      translatedCat.description.toLowerCase().includes(categorySearch.toLowerCase()) ||
      cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  });

  // Handle copying judgment quotes
  const handleCopyQuote = (id: string, quote: string) => {
    navigator.clipboard.writeText(quote);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Scroll smoothly to section anchor
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 font-sans" id="homepage-root">
      
      {/* ========================================================================= */}
      {/* 🚀 SEKCE 1: HERO SEKCE (Uvítání a aktuální status)                       */}
      {/* ========================================================================= */}
      <section 
        className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden border border-emerald-800/30 shadow-xl"
        id="home-hero-banner"
      >
        {/* Background visual abstract accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-300 rounded-full text-xs font-semibold backdrop-blur-sm shadow-inner"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-amber-300">Alfa verze 0.0.1.2</span>
              <span className="text-amber-400/60">•</span>
              <span className="text-slate-300">{t('brand_name', 'Portál Táta má právo')}</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display leading-[1.15]" id="hero-title">
              {translateText('Průvodce opatrovnictvím,', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">{translateText('právem a psychologií pro otce', language)}</span>
            </h1>

            {/* Description Subtext */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl" id="hero-description">
              {translateText('Pevná opora pro táty v opatrovnickém sporu. Přinášíme ověřené právní rozbory, judikaturu Ústavního soudu, vědecké metaanalýzy a AI asistenta pro rovnocennou péči o vaše děti.', language)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-cta-ai"
                onClick={() => onNavigate('ai-guide')}
                className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{t('open_ai_assistant', 'Otevřít AI Asistenta')}</span>
              </button>

              <button
                id="hero-cta-sos"
                onClick={() => onNavigate('crisis')}
                className="px-5 py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{t('need_sos_help', 'Potřebuji krizovou pomoc (SOS)')}</span>
              </button>

              <button
                id="hero-cta-categories"
                onClick={() => scrollToSection('section-21-categories')}
                className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>{t('explore_21_categories', 'Prozkoumat 21 kategorií')}</span>
              </button>
            </div>

            {/* Metrics Ticker bar */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left max-w-xl">
              <div>
                <span className="block text-lg font-extrabold text-amber-300 font-display">21</span>
                <span className="text-[11px] text-slate-400 leading-none">{translateText('Odborných okruhů', language)}</span>
              </div>
              <div>
                <span className="block text-lg font-extrabold text-emerald-400 font-display">110+</span>
                <span className="text-[11px] text-slate-400 leading-none">{translateText('Soudních nálezů & studií', language)}</span>
              </div>
              <div>
                <span className="block text-lg font-extrabold text-teal-300 font-display">100%</span>
                <span className="text-[11px] text-slate-400 leading-none">{translateText('Nestrannost & fakta', language)}</span>
              </div>
            </div>

          </div>

          {/* Hero Image / Visual Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl group">
              <img
                src={fatherAndChildHero}
                alt={translateText('Otec se svým dítětem', language)}
                className="w-full h-72 sm:h-80 lg:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold font-display">
                  <span>{translateText('Právo na oba rodiče', language)}</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "{translateText('Dítě potřebuje tátu i mámu. Rovnocenná péče je základem zdravého vývoje.', language)}"
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📰 SEKCE: OFICIÁLNÍ OZNÁMENÍ SPONZORŮ (VEDOS & FORPSI)                   */}
      {/* ========================================================================= */}
      <section className="space-y-4" id="home-featured-announcements">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            <h2 className="text-lg font-black text-slate-900 font-display">
              {translateText('Oficiální oznamy & Milníky partnerství', language)}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            ★ Infrastrukturní sponzoři
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FORPSI Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-3xl p-6 border-2 border-blue-500/40 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <span className="text-[10px] font-mono font-bold text-blue-300 uppercase">
                  28. Července 2026 • Sponzor domény
                </span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                  ★ Doména tatovacesta.cz
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-md border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://forpsi.com/Forpsi/media/Forpsi/General/logo.svg" 
                    alt="FORPSI Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display leading-tight">
                    FORPSI: Sponzor doménové infrastruktury
                  </h3>
                  <span className="text-xs text-blue-300 font-mono">FORPSI (Internet CZ, a.s.)</span>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                S radostí oznamujeme nového sponzora. Společnost FORPSI věnovala a bezplatně zaregistrovala doménu <strong>tatovacesta.cz</strong> pro projekt Táta má právo. Přečtěte si více v samostatném článku.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 relative z-10">
              <button
                onClick={() => onNavigate('news', 'art-forpsi-milestone')}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Přečíst si celý článek</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <a
                href="https://www.forpsi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>FORPSI.com</span>
                <ExternalLink className="w-3 h-3 text-blue-400" />
              </a>
            </div>
          </div>

          {/* VEDOS Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 border-2 border-teal-500/40 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <span className="text-[10px] font-mono font-bold text-teal-300 uppercase">
                  27. Července 2026 • Technologický partner
                </span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                  ★ Webhosting NoLimit
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-md border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://vedos.cz/wp-content/uploads/2025/03/VEDOS-Hosting-logo.svg" 
                    alt="VEDOS Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display leading-tight">
                    VEDOS: Sponzor webhostingu NoLimit
                  </h3>
                  <span className="text-xs text-teal-300 font-mono">VEDOS Internet, a.s.</span>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                Společnost VEDOS poskytla projektu Táta má právo bezplatnou technologickou podporu a profesionální webhosting NoLimit pro stabilní a bleskový chod.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 relative z-10">
              <button
                onClick={() => onNavigate('news', 'art-vedos-milestone')}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Přečíst si celý článek</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <a
                href="https://www.vedos.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>VEDOS.cz</span>
                <ExternalLink className="w-3 h-3 text-teal-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📊 SEKCE 2: INTERAKTIVNÍ ROZCESTNÍK 21 ODBORNÝCH OKRUHŮ                  */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 lg:p-10 shadow-sm space-y-8" id="section-21-categories">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>{translateText('Kompletní znalostní báze', language)}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              {translateText('21 Odborných tématických okruhů', language)}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              {translateText('Systematicky členěná knihovna znalostí, judikatury, metodických pokynů OSPOD a praktických rad.', language)}
            </p>
          </div>

          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <span>{showAllCategories ? t('hide_list', 'Skrýt seznam') : t('show_all_21_categories', 'Zobrazit všech 21 kategorií')}</span>
            {showAllCategories ? <ChevronUp className="w-4 h-4 text-amber-300" /> : <ChevronDown className="w-4 h-4 text-amber-300" />}
          </button>
        </div>

        {/* Quick Access Top 6 Categories */}
        {!showAllCategories && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">{translateText('Nejvyhledávanější tematické okruhy', language)}</span>
              <span className="text-xs text-emerald-700 font-semibold">{translateText('6 klíčových oblastí', language)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCategories.map((cat, idx) => {
                const translatedCat = getTranslatedObject(cat.id, cat, language);
                return (
                  <div 
                    key={cat.id}
                    onClick={() => onNavigate(`category-${cat.slug}`)}
                    className="p-5 bg-slate-50 hover:bg-emerald-50/40 rounded-2xl border border-slate-200/60 hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs border border-slate-100">{cat.icon}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                          {translateText('Okruh', language)} #{idx + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-emerald-800 font-display transition-colors">
                          {translatedCat.name}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed mt-1 line-clamp-2">
                          {translatedCat.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                      <span>{t('open_chapter', 'Otevřít kapitolu')}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Expandable 21 Categories Grid */}
        {showAllCategories && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 pt-2"
          >
            {/* Real-time Category Search Filter */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={translateText("Hledat mezi 21 kategoriemi...", language)}
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((cat, idx) => {
                const translatedCat = getTranslatedObject(cat.id, cat, language);
                return (
                  <div 
                    key={cat.id}
                    onClick={() => onNavigate(`category-${cat.slug}`)}
                    className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {cat.slug}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-emerald-700 font-display transition-colors">
                          {translatedCat.name}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed mt-1">
                          {translatedCat.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                      <span>{t('topic_detail', 'Detail okruhu')}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </section>
      {/* 🔬 SEKCE 3: VĚDECKÝ ZÁKLAD & GALERIE KRITIKY (Důvěryhodnost)             */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-800 shadow-xl space-y-8" id="section-scientific-base">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-300 rounded-full text-xs font-bold mb-2">
              <Brain className="w-3.5 h-3.5 text-teal-400" />
              <span>{translateText('Věda a fakta na 1. místě', language)}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display tracking-tight">
              {translateText('Světový vědecký konsenzus o střídavé péči', language)}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              {translateText('Proti mýtům a předsudkům stavíme exaktní data ze 100+ mezinárodních metaanalýz (Harvard, Karolinska Institutet, Arizona State University).', language)}
            </p>
          </div>

          <button
            onClick={() => onNavigate('knihovna-studii')}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <span>{translateText('Knihovna vědeckých studií', language)}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Key Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HUB_STUDIES.slice(0, 3).map((study) => {
            const translatedStudy = getTranslatedObject(study.id, study, language);
            return (
              <div 
                key={study.id}
                className="bg-slate-850/80 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-teal-400 font-mono font-bold">
                    <span>{study.authors}</span>
                    <span>{study.year}</span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm leading-snug font-display">
                    {translatedStudy.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {translatedStudy.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                  <strong className="text-emerald-400 font-bold block mb-1">{translateText('Závěr studie:', language)}</strong>
                  {translatedStudy.conclusion}
                </div>
              </div>
            );
          })}
        </div>

        {/* Special Banner: Galerie kritiky překonaných studií */}
        <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-800/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>{translateText('Demontáž metodických chyb', language)}</span>
            </div>
            <h3 className="text-xl font-extrabold text-white font-display">
              {translateText('Galerie kritiky překonaných studií (např. McIntosh 2010)', language)}
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              {translateText('Často čelíte argumentům odvolávajícím se na australskou studii Jennifer McIntosh (2010), která varovala před noční péčí u nemluvňat. Tato studie byla světovou vědeckou komunitou (Nielsen, Warshak, Fabricius) plně metodicky vyvrácena pro nereprezentativní, patologický vzorek.', language)}
            </p>
          </div>

          <button
            onClick={() => onNavigate('category-kritika-studii')}
            className="px-5 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <span>{translateText('Otevřít Galerii kritiky', language)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* ⚖️ SEKCE 4: AKTUÁLNÍ JUDIKATURA & PRÁVNÍ PRAXE                            */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 lg:p-10 shadow-sm space-y-8" id="section-judikatura">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold mb-2">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>{translateText('Ústavní soud ČR & ESLP', language)}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              {translateText('Aktuální judikatura & Právní argumenty do vašich podání', language)}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              {translateText('Klíčové nálezy garantující rovnocennou péči. Kliknutím jednoduše zkopírujte právní větu přímo do vašeho podání k soudu.', language)}
            </p>
          </div>

          <button
            onClick={() => onNavigate('judikatura')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <span>{translateText('Kompletní judikatura', language)}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>

        {/* Selected Key Judgments list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HUB_JUDGMENTS.slice(0, 4).map((jud) => {
            const translatedJud = getTranslatedObject(jud.id, jud, language);
            return (
              <div 
                key={jud.id}
                className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-4 hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {jud.fileNo}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {jud.court}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm font-display leading-snug">
                    {translatedJud.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed bg-white p-3 rounded-xl border border-slate-100 italic">
                    "{translatedJud.excerpt}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyQuote(jud.id, `${jud.fileNo}: ${translatedJud.excerpt}`)}
                    className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1.5 border border-amber-300/40 cursor-pointer"
                  >
                    {copiedId === jud.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">{translateText('Zkopírováno!', language)}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-700" />
                        <span>{translateText('Kopírovat právní větu', language)}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onNavigate('judikatura')}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{translateText('Detail nálezu', language)}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 🛡️ SEKCE 5: KRIZOVÁ ZÓNA & SOS ROZCESTNÍK (Okamžitá pomoc)              */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 text-white rounded-3xl p-6 md:p-8 lg:p-10 border border-rose-800/50 shadow-xl space-y-6 relative overflow-hidden" id="section-sos-crisis">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-200 rounded-full text-xs font-extrabold uppercase tracking-wider font-mono">
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>{translateText('SOS Krizová Zóna', language)}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display tracking-tight">
              {translateText('Jste v akutní krizové situaci?', language)}
            </h2>

            <p className="text-rose-100/90 text-xs sm:text-sm leading-relaxed">
              {translateText('Nezákonné odepření styku, policejní zásah v místě bydliště, účelové udání na OSPOD nebo náhlá izolace od dítěte. Jednejte s chladnou hlavou a podle ověřených krokových protokolů.', language)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate('crisis')}
              className="px-6 py-3.5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{translateText('Spustit SOS Průvodce', language)}</span>
            </button>

            <button
              onClick={() => onNavigate('ke-stazeni')}
              className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-rose-100 border border-rose-700/50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-rose-300" />
              <span>{translateText('Předběžné opatření (§ 452)', language)}</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Action Steps in Emergency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-rose-800/40 relative z-10">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-rose-800/30 text-xs space-y-1">
            <strong className="text-rose-300 font-bold block mb-1">1. {translateText('Zachovejte klid & Neagresivitu', language)}</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {translateText('Před domem matky neprovádějte žádné násilné vstupy ani verbální konfrontace. Vše nahrávejte na audio/video.', language)}
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-rose-800/30 text-xs space-y-1">
            <strong className="text-rose-300 font-bold block mb-1">2. {translateText('Písemná výzva & Záznam', language)}</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {translateText('Odešlete matce SMS / e-mail s přesnou výzvou k předání dítěte dle dohody nebo rozhodnutí soudu.', language)}
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-rose-800/30 text-xs space-y-1">
            <strong className="text-rose-300 font-bold block mb-1">3. {translateText('Okamžité oznámení OSPOD & Soudu', language)}</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {translateText('Podávejte bezodkladně podnět OSPODu a návrh na předběžné opatření na okresní soud.', language)}
            </p>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 🤝 SEKCE 6: TRANSPARENTNÍ PODPORA A FINANCOVÁNÍ PROJEKTU                 */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 lg:p-10 shadow-sm space-y-8" id="section-support-transparency">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold mb-2">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>{translateText('Nezávislý komunitní projekt', language)}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              {translateText('Transparentní financování a vývoj portálu', language)}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              {translateText('Vývoj probíhá nezávisle pod záštitou studia Synthesis Jiřího Šár bez státních dotací či zájmových dotací.', language)}
            </p>
          </div>

          <button
            onClick={() => onNavigate('support')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{translateText('Podpořit chod portálu', language)}</span>
          </button>
        </div>

        {/* Development & Hosting Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm font-display">
              Cloud Infrastructure & Server
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              {translateText('Běh AI modelů, Cloud Run kontejnerů, Supabase/Firebase databází a záloh pod dohledem Synthesis OS.', language)}
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm font-display">
              {translateText('Oficiální Doména & Hosting', language)}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              {translateText('Zabezpečení SSL certifikátů, příprava primární domény tatamapravo.cz a CDN distribuce.', language)}
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm font-display">
              {translateText('Komunitní Příspěvky', language)}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              {translateText('Veškeré finanční příspěvky od tátů směřují 100% na pokrytí API poplatků, právních revizí a provozu serverů.', language)}
            </p>
          </div>
        </div>

      </section>

      {/* Partners Recommendation */}
      {partners && partners.filter(p => p.showOnMainPage).length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6" id="partners-recommendation">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">🤝</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">{translateText('Ověřená spolupráce s odborníky', language)}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-display">{translateText('Doporučujeme naše partnery', language)}</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-3xl">
                {translateText('Odborníci, advokáti a psychologové, kteří pomáhají rodičům zvládat náročné životní situace s důrazem na zájem dítěte.', language)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners
              .filter(p => p.showOnMainPage)
              .sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0))
              .map((partner) => (
                <div 
                  key={partner.id} 
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    partner.isRecommended 
                      ? 'bg-gradient-to-br from-emerald-50/20 to-white border-emerald-200 shadow-2xs relative overflow-hidden' 
                      : 'bg-slate-50/40 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {partner.isRecommended && (
                    <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1 font-mono">
                      <span className="text-amber-300">★</span> {translateText('DOPORUČUJEME', language)}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      {partner.logoUrl ? (
                        <img 
                          src={partner.logoUrl} 
                          alt={partner.name} 
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-3xs shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-sm font-display shrink-0">
                          {partner.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-slate-800 text-sm font-display leading-tight">{partner.name}</h4>
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/50">
                            {translateText(partner.category, language)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          📍 {translateText('Působnost:', language)} <strong className="text-slate-600 font-semibold">{translateText(partner.region, language)}</strong>
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">
                      {translateText(partner.description, language)}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <a 
                      href={partner.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer border border-emerald-200/50"
                    >
                      <span>{translateText('Navštívit web / kontakt', language)}</span>
                      <ExternalLink className="w-3 h-3 text-emerald-700" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Právní doložka & Vyloučení odpovědnosti */}
      <section className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 md:p-8 space-y-3" id="legal-disclaimer-home">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-slate-900 font-display">{t('legal_disclaimer_title', 'Právní doložka a podmínky užívání portálu')}</h4>
              <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">{t('legal_disclaimer_warning', 'Upozornění')}</span>
            </div>
            <p>
              {translateText('Tento portál Táta má právo slouží výhradně jako nezávislá informační, vzdělávací a komunitní platforma. Všechny uvedené informace, právní věty, rozbory judikatury, vzory podání a doporučení mají podporný charakter a nenahrazují kvalifikovanou právní pomoc licencovaného advokáta ani oficiální znalecký posudek.', language)}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
