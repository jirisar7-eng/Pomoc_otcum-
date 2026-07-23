/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Share2, 
  Scale, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  ChevronRight, 
  ShieldAlert,
  Compass,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { CategoryBlueprint } from '../../components/CategoryDetailView';

export interface ExtendedCategoryPageProps {
  title: string;
  categorySlug: string;
  icon: string;
  subtitle: string;
  blueprint: CategoryBlueprint;
  legalSections: { title: string; content: string; icon?: string }[];
  actionSteps: string[];
  recommendedTemplates: { title: string; desc: string; type: string }[];
  setActiveTab?: (tab: string) => void;
  setSearchQuery?: (query: string) => void;
}

export default function CategoryPageLayout({
  title,
  categorySlug,
  icon,
  subtitle,
  blueprint,
  legalSections,
  actionSteps,
  recommendedTemplates,
  setActiveTab,
  setSearchQuery
}: ExtendedCategoryPageProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleRunAi = (prompt: string) => {
    if (setSearchQuery) setSearchQuery(prompt);
    if (setActiveTab) {
      setActiveTab('ai-assistant');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, text: subtitle, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Odkaz na stránku byl zkopírován do schránky.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 animate-in fade-in duration-200">
      {/* Physical Category Header */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden shadow-md">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-5 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition-all cursor-pointer font-bold shadow-3xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Zpět na přehled</span>
            </button>

            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
              <span className="text-teal-400 font-bold">Fyzická Stránka / GitHub Module</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-teal-300 font-bold">{categorySlug}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2.5 bg-slate-800/90 border border-slate-700 rounded-2xl shrink-0">
                  {icon}
                </span>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Kategorie #{categorySlug}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight mt-1">
                    {title}
                  </h1>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {subtitle}
              </p>
            </div>

            <div className="shrink-0 flex flex-wrap md:flex-col gap-2.5 bg-slate-800/70 p-3.5 rounded-2xl border border-slate-700/80">
              <button
                onClick={() => handleRunAi(`Porad mi ohledně tématu ${title}`)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Položit dotaz AI Asistentovi</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-600"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Sdílet stranu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Purpose Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-teal-700">Hlavní cíl a účel okruhu</span>
              <h2 className="text-base font-black text-slate-900">Strategický právní a praktický rámec</h2>
            </div>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {blueprint.purpose}
          </p>
        </div>

        {/* Detailed Legal Sections */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Detailní rozbor a klíčová témata</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legalSections.map((section, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-3xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black font-mono flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-black text-slate-900">{section.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Points & Pillars */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Hlavní pilíře v opatrovnické praxi</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blueprint.keyPoints.map((kp, idx) => (
              <div key={idx} className="bg-emerald-50/40 p-5 rounded-3xl border border-emerald-200/80 shadow-3xs space-y-2">
                <h3 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{kp.title}</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {kp.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Steps for Father */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="p-2 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-teal-400">Doporučený postup</span>
              <h2 className="text-base font-black text-white">Akční kroky pro otce v praxi</h2>
            </div>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            {actionSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                <span className="font-mono text-teal-400 font-bold shrink-0">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Prompt Recommendations */}
        <div className="bg-amber-50/60 p-6 rounded-3xl border border-amber-200/80 shadow-3xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-black text-slate-900">Rychlé AI prompty k vyzkoušení</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {blueprint.aiPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleRunAi(prompt)}
                className="p-3.5 bg-white hover:bg-amber-100/60 border border-amber-200 hover:border-amber-400 rounded-2xl text-left transition-all text-xs font-bold text-slate-900 flex flex-col justify-between gap-2 cursor-pointer shadow-3xs group"
              >
                <span>"{prompt}"</span>
                <span className="text-[10px] font-mono text-amber-800 flex items-center justify-end gap-1 pt-1 border-t border-amber-100">
                  <span>Položit dotaz</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
