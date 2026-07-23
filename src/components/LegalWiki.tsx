/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Search, Scale, FileText, Newspaper, MessageSquare, 
  Video, HelpCircle, ChevronRight, CornerDownRight, Landmark, Info, ExternalLink
} from 'lucide-react';
import { 
  HUB_GLOSSARY as HUB_GLOSSARY_RAW, HUB_ARTICLES as HUB_ARTICLES_RAW, HUB_JUDGMENTS as HUB_JUDGMENTS_RAW, HUB_STUDIES as HUB_STUDIES_RAW, HUB_TEMPLATES as HUB_TEMPLATES_RAW, HUB_FAQS as HUB_FAQS_RAW, HUB_CATEGORIES, HubTerm 
} from '../data/contentHub';
import { useLanguage } from '../lib/LanguageContext';
import { getTranslatedObject } from '../data/dynamicTranslations';

interface LegalWikiProps {
  setActiveTab?: (tab: string) => void;
}

export default function LegalWiki({ setActiveTab }: LegalWikiProps) {
  const { language } = useLanguage();

  const HUB_GLOSSARY = React.useMemo(() => 
    HUB_GLOSSARY_RAW.map(item => getTranslatedObject(item.id, item, language)),
    [language]
  );
  const HUB_ARTICLES = React.useMemo(() => 
    HUB_ARTICLES_RAW.map(item => getTranslatedObject(item.id, item, language)),
    [language]
  );
  const HUB_JUDGMENTS = React.useMemo(() => 
    HUB_JUDGMENTS_RAW.map(item => getTranslatedObject(item.id, item, language)),
    [language]
  );
  const HUB_STUDIES = React.useMemo(() => 
    HUB_STUDIES_RAW.map(item => getTranslatedObject(item.id, item, language)),
    [language]
  );
  const HUB_TEMPLATES = React.useMemo(() => 
    HUB_TEMPLATES_RAW.map(item => getTranslatedObject(item.id, item, language)),
    [language]
  );
  const HUB_FAQS = React.useMemo(() => 
    HUB_FAQS_RAW.map(item => getTranslatedObject(item.id, item, language)),
    [language]
  );

  const [selectedTermId, setSelectedTermId] = useState<string>('term-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('definice');

  const selectedTerm = HUB_GLOSSARY.find(g => g.id === selectedTermId) || HUB_GLOSSARY[0];

  // Dynamically find related content based on the selected term's tags and relationship arrays
  const relatedArticles = HUB_ARTICLES.filter(
    a => selectedTerm.relatedArticles.includes(a.id) || 
         a.tags.some(t => selectedTerm.tags.includes(t))
  );

  const relatedJudgments = HUB_JUDGMENTS.filter(
    j => j.tags.some(t => selectedTerm.tags.includes(t))
  );

  const relatedStudies = HUB_STUDIES.filter(
    s => s.tags.some(t => selectedTerm.tags.includes(t))
  );

  const relatedTemplates = HUB_TEMPLATES.filter(
    t => selectedTerm.tags.some(tag => t.title.toLowerCase().includes(tag) || t.desc.toLowerCase().includes(tag))
  );

  const relatedFaqs = HUB_FAQS.filter(
    f => f.tags.some(t => selectedTerm.tags.includes(t))
  );

  // Filter dictionary terms based on search query
  const filteredTerms = HUB_GLOSSARY.filter(
    g => g.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
         g.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Wikipedia Sidebar Table of Contents
  const tableOfContents = [
    { id: 'definice', label: '1. Definice a výklad', count: null },
    { id: 'judikatura', label: '2. Judikatura Ústavního soudu', count: relatedJudgments.length },
    { id: 'studie', label: '3. Vědecké a psychologické studie', count: relatedStudies.length },
    { id: 'clanky', label: '4. Praktické návody a články', count: relatedArticles.length },
    { id: 'vzory', label: '5. Vzory podání a dokumentů', count: relatedTemplates.length },
    { id: 'faq', label: '6. Časté dotazy (FAQ)', count: relatedFaqs.length },
    { id: 'video', label: '7. Video a doporučený výklad', count: 1 },
    { id: 'diskuze', label: '8. Komunitní diskuze rodičů', count: 4 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800" id="legal-wiki-encyclopedia">
      
      {/* Header */}
      <div className="bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-3xl space-y-3 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Právní Wikipedie Opatrovnictví
          </div>
          <h2 className="text-xl md:text-3xl font-black font-display tracking-tight leading-tight">
            Interaktivní Encyklopedie Synthesis Hub
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Nahlížejte na právní pojmy komplexně na jedné stránce. Vyberte si termín a ihned získejte jeho přesnou akademickou definici, související rozsudky, klinické výzkumy, vzory žalob i diskuzní příspěvky ostatních otců.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Search and Term Navigator - Col span 3 */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs space-y-3">
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-mono">
              Hledat v encyklopedii
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hledat pojem..."
                className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Quick List of Terms */}
          <div className="space-y-1">
            {filteredTerms.map(term => (
              <button
                key={term.id}
                onClick={() => {
                  setSelectedTermId(term.id);
                  setActiveSection('definice');
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedTermId === term.id
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-xs'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="space-y-0.5 truncate pr-2">
                  <h4 className="font-extrabold text-xs leading-none">{term.term}</h4>
                  <span className={`text-[9px] font-mono ${selectedTermId === term.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                    Tags: {term.tags.slice(0, 2).join(', ')}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${selectedTermId === term.id ? 'text-white' : 'text-slate-400'}`} />
              </button>
            ))}
          </div>

          {/* Wikipedia style Page Contents navigation table */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3 sticky top-24">
            <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider font-mono">
              Obsah stránky (Wikipedia)
            </h3>
            
            <div className="flex flex-col gap-1 text-xs">
              {tableOfContents.map(toc => (
                <button
                  key={toc.id}
                  onClick={() => {
                    setActiveSection(toc.id);
                    const element = document.getElementById(`wiki-sec-${toc.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all font-medium flex justify-between items-center cursor-pointer ${
                    activeSection === toc.id
                      ? 'bg-white text-indigo-700 shadow-3xs font-bold border-l-2 border-indigo-600'
                      : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                  }`}
                >
                  <span>{toc.label}</span>
                  {toc.count !== null && (
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-md">
                      {toc.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Wikipedia-Style Structured Article - Col span 9 */}
        <div className="lg:col-span-9 bg-white p-8 border border-slate-100 rounded-3xl shadow-3xs space-y-8 select-text">
          
          {/* Main Title of selected Term */}
          <div className="border-b border-slate-100 pb-5 space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight">
              {selectedTerm.term}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold font-mono text-indigo-700 uppercase">
                Encyklopedický záznam
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Sémanticky propojená databáze v reálném čase
              </span>
            </div>
          </div>

          {/* SECTION 1: DEFINICE (Definition) */}
          <div id="wiki-sec-definice" className="space-y-3 scroll-mt-6">
            <h2 className="text-sm font-extrabold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Info className="w-4 h-4 text-indigo-600" /> 1. Definice a odborný výklad
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">
              {selectedTerm.definition}
            </p>
          </div>

          {/* SECTION 2: JUDIKATURA (Judgments) */}
          <div id="wiki-sec-judikatura" className="space-y-4 scroll-mt-6">
            <h2 className="text-sm font-extrabold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Scale className="w-4 h-4 text-teal-600" /> 2. Judikatura Ústavního soudu
            </h2>
            
            {relatedJudgments.length > 0 ? (
              <div className="space-y-3">
                {relatedJudgments.map(jud => (
                  <div key={jud.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-mono font-bold text-[10px] rounded-md">
                        {jud.fileNo}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{jud.court}</span>
                    </div>
                    <h3 className="font-extrabold text-xs text-slate-800">{jud.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{jud.excerpt}"
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-200/50">
                      {jud.fullAnalysis}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Pro tento pojem nebyly v našem Content Hubu uloženy žádné přímé rozsudky.</p>
            )}
          </div>

          {/* SECTION 3: STUDIE (Studies) */}
          <div id="wiki-sec-studie" className="space-y-4 scroll-mt-6">
            <h2 className="text-sm font-extrabold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" /> 3. Vědecké a psychologické studie
            </h2>
            
            {relatedStudies.length > 0 ? (
              <div className="space-y-3">
                {relatedStudies.map(std => (
                  <div key={std.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-600 font-mono">{std.authors} ({std.year})</span>
                      <span className="text-[10px] font-mono text-indigo-500 font-bold uppercase">Akademický výzkum</span>
                    </div>
                    <h3 className="font-extrabold text-xs text-slate-850">{std.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Výtah:</strong> {std.excerpt}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 mt-1">
                      <strong>Závěry výzkumu:</strong> {std.conclusion}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Pro tento pojem nebyly v našem Content Hubu uloženy žádné vědecké studie.</p>
            )}
          </div>

          {/* SECTION 4: CLANKY (Articles) */}
          <div id="wiki-sec-clanky" className="space-y-4 scroll-mt-6">
            <h2 className="text-sm font-extrabold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Newspaper className="w-4 h-4 text-emerald-600" /> 4. Praktické návody a články
            </h2>
            
            {relatedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.map(art => (
                  <div key={art.id} className="p-4 bg-white border border-slate-150 rounded-2xl flex flex-col justify-between hover:border-indigo-500 hover:shadow-xs transition-all text-left">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">{art.category}</span>
                      <h3 className="font-extrabold text-xs text-slate-800 leading-snug">{art.title}</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{art.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold mt-3">
                      Číst celý průvodce <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Pro tento pojem nebyly v našem Content Hubu uloženy žádné doplňující články.</p>
            )}
          </div>

          {/* SECTION 5: VZORY (Templates) */}
          <div id="wiki-sec-vzory" className="space-y-4 scroll-mt-6">
            <h2 className="text-sm font-extrabold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <FileText className="w-4 h-4 text-amber-600" /> 5. Vzory podání a dokumentů
            </h2>
            
            {relatedTemplates.length > 0 ? (
              <div className="space-y-2">
                {relatedTemplates.map(tpl => (
                  <div key={tpl.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-slate-800">{tpl.title}</h4>
                      <p className="text-[10px] text-slate-500">{tpl.desc}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1 shrink-0 cursor-pointer">
                      Sestavit dokument
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left text-xs text-slate-500 flex gap-2">
                <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>Pro tento pojem není potřeba samostatné podání. Doporučujeme využít obecný <strong>"Návrh na svěření do střídavé péče"</strong> v sekci Vzory podání.</span>
              </div>
            )}
          </div>

          {/* SECTION 6: FAQ */}
          <div id="wiki-sec-faq" className="space-y-4 scroll-mt-6">
            <h2 className="text-sm font-extrabold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <HelpCircle className="w-4 h-4 text-rose-500" /> 6. Časté dotazy (FAQ)
            </h2>
            
            {relatedFaqs.length > 0 ? (
              <div className="space-y-3">
                {relatedFaqs.map(faq => (
                  <div key={faq.id} className="space-y-1 bg-rose-50/20 p-4 rounded-2xl border border-rose-100/50">
                    <h4 className="font-extrabold text-xs text-rose-950 font-sans flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-rose-500" /> {faq.question}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium pl-5">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">V databázi FAQ zatím nejsou dotazy specifické k tomuto tématu.</p>
            )}
          </div>

          {/* SECTION 7: VIDEO */}
          <div id="wiki-sec-video" className="space-y-4 scroll-mt-6">
            <h2 className="text-sm font-extrabold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Video className="w-4 h-4 text-indigo-600" /> 7. Video a doporučený výklad
            </h2>
            
            <div className="bg-slate-900 aspect-video rounded-2xl flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600')` }} />
              <div className="relative text-center space-y-3 max-w-sm">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg cursor-pointer hover:bg-indigo-700 transition-all">
                  <Video className="w-5 h-5 ml-0.5 fill-current" />
                </div>
                <h4 className="font-extrabold text-xs md:text-sm">Video-výklad: Právní argumenty pro soud</h4>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Český expert na opatrovnické právo vysvětluje, jak u soudu prezentovat nejlepší zájem dítěte. (Délka: 12 minut)
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 8: FORUM / COMMENTS */}
          <div id="wiki-sec-diskuze" className="space-y-4 scroll-mt-6">
            <h2 className="text-sm font-extrabold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> 8. Komunitní diskuze rodičů
            </h2>

            <div className="space-y-3">
              {[
                { author: 'RomanS', role: 'Otec 2 dětí', text: 'Střídavou péči u dvouletého syna se nám podařilo vysoudit po 6 měsících. Klíčový byl odkaz na studii Nielsen, soudce to vzal v potaz.', date: 'Před 2 dny' },
                { author: 'Michal_K', role: 'Otec v batolecím střídání', text: 'Zpočátku OSPOD tvrdil, že přespávání u mě škodí, ale s právníkem jsme se opřeli o Warshaka a nakonec doporučili 3 dny v týdnu.', date: 'Před 5 dny' }
              ].map((comment, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-bold">
                    <span>{comment.author} ({comment.role})</span>
                    <span>{comment.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SECTION: 21 TAXONOMY CATEGORIES OVERVIEW */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[10px] uppercase rounded-md">
              Master Taxonomie (21 Odborných Okruhů)
            </span>
            <h3 className="text-lg md:text-xl font-black font-display mt-1">
              Kompletní mapa znalostního systému Táta má právo
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Přehled všech 21 tematických kategorií pokrývajících právní, psychologickou, procesní a společenskou agendu opatrovnictví.
            </p>
          </div>
          <span className="px-3 py-1.5 bg-indigo-600 text-white font-mono font-extrabold text-xs rounded-xl shrink-0">
            21 Aktivních okruhů
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HUB_CATEGORIES.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => {
                if (setActiveTab) {
                  setActiveTab(`category-${cat.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/80 rounded-2xl space-y-2 transition-all cursor-pointer group shadow-3xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h4 className="font-extrabold text-xs text-white group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                {cat.description}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-indigo-400 font-bold">
                <span>Slug: #{cat.slug}</span>
                <span className="text-indigo-300 hover:underline">Otevřít okruh →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
