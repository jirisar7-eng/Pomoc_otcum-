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
  Check,
  FolderCheck,
  ExternalLink
} from 'lucide-react';
import { CategoryBlueprint } from '../../components/CategoryDetailView';
import { HUB_JUDGMENTS, HUB_STUDIES, HUB_TEMPLATES, HubTemplate } from '../../data/contentHub';
import { slugify } from '../../lib/navigation';

export interface ExtendedCategoryPageProps {
  title: string;
  categorySlug: string;
  icon: string;
  subtitle: string;
  blueprint: CategoryBlueprint;
  legalSections: { title: string; content: string; icon?: string }[];
  actionSteps: string[];
  recommendedTemplates: { title: string; desc: string; type: string }[];
  aiButtonText?: string;
  customWidget?: React.ReactNode;
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
  aiButtonText,
  customWidget,
  setActiveTab,
  setSearchQuery
}: ExtendedCategoryPageProps) {
  const [copiedTemplateId, setCopiedTemplateId] = React.useState<string | null>(null);

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

  // Strictly filter Judikatura, Studies, and Templates for this exact categorySlug (ZERO CROSS-CONTAMINATION)
  const categoryJudgments = React.useMemo(() => {
    const slug = categorySlug.toLowerCase();
    const slugSpace = slug.replace(/-/g, ' ');
    return HUB_JUDGMENTS.filter(j => 
      j.tags.some(t => {
        const tag = t.toLowerCase();
        return tag === slug || tag === slugSpace || (slug === 'judikatura' && (tag.includes('judikat') || tag.includes('nález') || tag.includes('ústavní')));
      })
    );
  }, [categorySlug]);

  const categoryStudies = React.useMemo(() => {
    const slug = categorySlug.toLowerCase();
    const slugSpace = slug.replace(/-/g, ' ');
    return HUB_STUDIES.filter(s => 
      s.tags.some(t => {
        const tag = t.toLowerCase();
        return tag === slug || tag === slugSpace || (slug === 'kritika-studii' && (tag.includes('studie') || tag.includes('mcintosh') || tag.includes('warshak') || tag.includes('kritika')));
      })
    );
  }, [categorySlug]);

  const categoryTemplates = React.useMemo(() => {
    const slug = categorySlug.toLowerCase();
    const slugSpace = slug.replace(/-/g, ' ');
    return HUB_TEMPLATES.filter(t => 
      t.categorySlug === slug || (t.tags && t.tags.some(tg => tg.toLowerCase() === slug || tg.toLowerCase() === slugSpace))
    );
  }, [categorySlug]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 animate-in fade-in duration-200">
      {/* 1. HLAVIČKA & DEFINICE */}
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
              <span className="text-teal-400 font-bold">Dedikovaná Podstránka v11.0</span>
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
                <span>{aiButtonText || 'Položit dotaz AI Asistentovi'}</span>
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
        
        {/* BLOCK 1: Purpose Card & Legal Definition */}
        <div id="pravni-zaklad" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-teal-700">Hlavní cíl a účel okruhu</span>
              <h2 className="text-base font-black text-slate-900 font-display">Právní základ a vyměření tématu</h2>
            </div>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {blueprint.purpose}
          </p>
        </div>

        {/* CUSTOM WIDGET (e.g. Kalkulačka výživného) */}
        {customWidget && (
          <div id="kalkulacka-widget" className="space-y-4 scroll-mt-24">
            {customWidget}
          </div>
        )}

        {/* BLOCK 2: DETAILNÍ ODBORNÝ ROZBOR */}
        <div id="odborny-rozbor" className="space-y-4 scroll-mt-24">
          <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Detailní odborný rozbor a klíčová témata</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legalSections.map((section, idx) => {
              const secId = slugify(section.title);
              return (
                <div id={secId} key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-3xs space-y-2 scroll-mt-24">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black font-mono flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 font-display">{section.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {section.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Points & Pillars */}
        <div id="pilire" className="space-y-4 scroll-mt-24">
          <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Hlavní pilíře v opatrovnické praxi</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blueprint.keyPoints.map((kp, idx) => {
              const kpId = slugify(kp.title);
              return (
                <div id={kpId} key={idx} className="bg-emerald-50/40 p-5 rounded-3xl border border-emerald-200/80 shadow-3xs space-y-2 scroll-mt-24">
                  <h3 className="text-xs font-black text-emerald-950 flex items-center gap-1.5 font-display">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{kp.title}</span>
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {kp.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BLOCK 3: JUDIKATURA & ZDROJE (STRICTLY FILTERED) */}
        <div id="judikatura-a-studie" className="space-y-4 pt-2 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              <span>Judikatura & Vědecké zdroje pro toto téma</span>
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Přísná izolace témat
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryJudgments.map((jud) => (
              <div key={jud.id} className="bg-white p-5 rounded-3xl border border-purple-100 shadow-3xs space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-900 font-mono font-bold rounded-md">{jud.fileNo}</span>
                  <span className="text-slate-500 font-bold">{jud.court}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 font-display">{jud.title}</h3>
                <p className="text-xs italic text-slate-700 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100/60 leading-relaxed">
                  "{jud.excerpt}"
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => handleRunAi(`Vysvětli mi nález ${jud.fileNo}: ${jud.title} v kontextu ${title}`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rozbor nálezu AI</span>
                  </button>
                </div>
              </div>
            ))}

            {categoryStudies.map((std) => (
              <div key={std.id} className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-3xs space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-900">
                  <span className="truncate max-w-[200px]">{std.authors}</span>
                  <span className="bg-indigo-50 px-2 py-0.5 rounded-md">{std.year}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 font-display">{std.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{std.conclusion}</p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => handleRunAi(`Jaké závěry plynou ze studie ${std.title} pro téma ${title}?`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Citovat studii</span>
                  </button>
                </div>
              </div>
            ))}

            {categoryJudgments.length === 0 && categoryStudies.length === 0 && (
              <div className="col-span-full bg-slate-100/80 p-5 rounded-2xl text-center border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-700">
                  Všechny obecné rozsudky a studie pro toto téma byly tématicky přefiltrovány.
                </p>
                <button
                  onClick={() => handleRunAi(`Vyhledej judikaturu a vědecké studie týkající se ${title}`)}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-3xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Vyhledat judikáty přes AI Asistenta</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BLOCK 4: AKČNÍ KROKY & VZORY */}
        <div id="akcni-kroky" className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="p-2 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-teal-400">Doporučený postup</span>
              <h2 className="text-base font-black text-white font-display">Akční kroky pro otce v praxi</h2>
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

        {/* Dedicated Templates for this Category */}
        <div id="doporucene-vzory" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <FolderCheck className="w-5 h-5 text-blue-600" />
              <span>Doporučené vzory podání pro kategotii: {title}</span>
            </h2>
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('ke-stazeni');
              }}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer flex items-center gap-1"
            >
              <span>Všechny vzory v databázi</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryTemplates.map((tpl) => (
              <div key={tpl.id} className="bg-white p-5 rounded-3xl border border-blue-100 shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase bg-blue-50 text-blue-900 px-2 py-0.5 rounded-md border border-blue-100">
                    Vzor #{tpl.id}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 font-display">{tpl.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{tpl.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyText(tpl.id, tpl.defaultText)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    {copiedTemplateId === tpl.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Zkopírováno</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Kopírovat vzor</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (setActiveTab) setActiveTab('ke-stazeni');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-3xs cursor-pointer"
                  >
                    <span>Otevřít v editoru</span>
                  </button>
                </div>
              </div>
            ))}

            {categoryTemplates.length === 0 && (
              <div className="col-span-full bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-600">
                  Připravte si přesný vzor pro téma <strong>{title}</strong> pomocí našeho AI Generátoru podání.
                </p>
                <button
                  onClick={() => handleRunAi(`Napiš pro mě vzor podání k soudu týkající se ${title}`)}
                  className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-3xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                  <span>Vygenerovat vzor přes AI</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Prompt Recommendations */}
        <div className="bg-amber-50/60 p-6 rounded-3xl border border-amber-200/80 shadow-3xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-black text-slate-900 font-display">Rychlé AI prompty k vyzkoušení</h2>
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

