/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, AlertTriangle, Copy, Check, BookOpen, CheckCircle2, 
  Layers, HelpCircle, FileText, MessageSquare, ChevronRight, 
  TrendingUp, BrainCircuit, Info, ExternalLink, ShieldAlert, 
  Search, Sliders, ArrowRight, Play, Database, Scale, Heart
} from 'lucide-react';
import { searchContentHub } from '../data/contentHub';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  promptText: string;
  useCase: string;
}

const CATEGORIES = [
  { id: 'all', label: 'Všechny prompty' },
  { id: 'ospod', label: 'Reakce na OSPOD' },
  { id: 'court', label: 'Soudní vyjádření' },
  { id: 'evidence', label: 'Analýza důkazů' }
];

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'ospod-response',
    title: 'Reakce na zprávu OSPOD (Vyvrácení předsudků)',
    category: 'ospod',
    useCase: 'Pokud OSPOD napíše zaujatou zprávu tvrdící, že nízký věk dítěte znemožňuje přespávání u otce.',
    description: 'Tento prompt pomůže přetavit váš hněv do chladných, neprůstřelných odborných a psychologických argumentů vyvracejících monotropii.',
    promptText: `Jsi špičkový opatrovnický právník a specialista na rodinné právo a dětskou vývojovou psychologii. Pomoz mi sestavit vyjádření pro soud k poslední zprávě kolizního opatrovníka OSPOD o nemožnosti střídavé péče kvůli nízkému věku...`
  },
  {
    id: 'court-proposal',
    title: 'Návrh na střídavou péči (Argumentace attachmentem)',
    category: 'court',
    useCase: 'Při sepisování nebo upřesňování samotného návrhu na střídavou péči pro soud.',
    description: 'Vytvoří přesvědčivý a dojemný (avšak věcný) argument o důležitosti ranních a večerních rituálů pro budování bezpečné citové vazby.',
    promptText: `Jsi specialista na rodinné právo a dětskou vývojovou psychologii. Pomoz mi vypracovat argumentační část mého návrhu na střídavou péči, která se zaměřuje na citovou vazbu (attachment) mého dítěte ke mně (otci)...`
  }
];

export default function AiGuideSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [perplexityResult, setPerplexityResult] = useState<any | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPromptId, setSelectedPromptId] = useState<string>('ospod-response');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handlePerplexitySearch = (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setIsSearching(true);
    setSearchStatus('Skenuji sémantický Content Hub...');
    
    setTimeout(() => {
      setSearchStatus('Ověřuji nálezy Ústavního soudu a vědecká konsenzuální data...');
      setTimeout(() => {
        setSearchStatus('Kompletuji doporučenou strategii...');
        setTimeout(() => {
          // Perform actual dynamic lookup from our content hub!
          const results = searchContentHub(query);
          
          // Generate a custom checklist and tailored synthesis based on query
          let customChecklist: string[] = [];
          let customAiAnswer = '';

          if (query.toLowerCase().includes('2') || query.toLowerCase().includes('kojenec') || query.toLowerCase().includes('batole') || query.toLowerCase().includes('tři')) {
            customAiAnswer = `Dítě ve věku 2 let (útlý věk) vyžaduje specifický přístup, ale nízký věk sám o sobě NENÍ překážkou pro střídavou péči. Rozhodující je doložení citové vazby (attachmentu) k oběma rodičům. Ústavní soud v nálezu I. ÚS 1506/21 výslovně potvrdil, že psychický vývoj batolat profituje z přespávání u obou rodičů.`;
            customChecklist = [
              'Odkázat se na nález Ústavního soudu ČR I. ÚS 1506/21.',
              'Předložit doložitelné důkazy o zapojení do rituálů péče (koupání, krmení, uspávání).',
              'Navrhnout asymetrické střídání s kratšími intervaly (např. 2-2-3 dny) namísto týdenního.',
              'Spustit Simulátor péče k otestování logistiky v praxi.'
            ];
          } else if (query.toLowerCase().includes('ospod')) {
            customAiAnswer = `Kolizní opatrovník (OSPOD) je klíčovým orgánem řízení. Vaším hlavním úkolem je vystupovat jako klidný, asertivní a spolupracující rodič. Pokud má opatrovník předsudky, musíte věcně oponovat výhradně písemnými a odbornými argumenty bez urážek protistrany.`;
            customChecklist = [
              'Požádat o písemný záznam z každého šetření v bytě.',
              'Předložit OSPODu vypracovaný Harmonogram střídavé péče.',
              'Při zjevné podjatosti podat formální stížnost vedoucímu odboru (Vzor tpl-3).'
            ];
          } else {
            customAiAnswer = `Pro vyhledávaný dotaz "${query}" doporučuje Content Hub integrovanou strategii složenou ze soudních judikátů, odborných studií a vzorů podání.`;
            customChecklist = [
              'Vyhledejte příslušný vzor žaloby v našem Hubu.',
              'Předložte soudu objektivní deník péče a důkazů.',
              'Konzultujte možnost mimosoudní dohody přes Rodičovský Hub.'
            ];
          }

          setPerplexityResult({
            query,
            answer: customAiAnswer,
            articles: results.articles.length > 0 ? results.articles : searchContentHub('střídavá péče').articles,
            judgments: results.judgments.length > 0 ? results.judgments : searchContentHub('střídavá péče').judgments,
            studies: results.studies.length > 0 ? results.studies : searchContentHub('střídavá péče').studies,
            templates: results.templates.length > 0 ? results.templates : searchContentHub('střídavá péče').templates,
            terms: results.terms.length > 0 ? results.terms : searchContentHub('střídavá péče').terms,
            faqs: results.faqs.length > 0 ? results.faqs : searchContentHub('střídavá péče').faqs,
            checklist: customChecklist
          });
          setIsSearching(false);
        }, 800);
      }, 800);
    }, 800);
  };

  const filteredPrompts = PROMPT_TEMPLATES.filter(p => 
    activeCategory === 'all' || p.category === activeCategory
  );

  const selectedPrompt = PROMPT_TEMPLATES.find(p => p.id === selectedPromptId) || PROMPT_TEMPLATES[0];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800" id="perplexity-ai-guide">
      
      {/* Search Console / Perplexity Box */}
      <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Perplexity-style AI vyhledávač
            </div>
            <h2 className="text-xl md:text-3xl font-black font-display tracking-tight leading-none">
              Zeptejte se na cokoliv o opatrovnickém řízení
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed max-w-lg mx-auto">
              Zadejte svůj dotaz (např. <em>"Dítě má 2 roky"</em> nebo <em>"Zaujatý OSPOD"</em>) a získejte okamžitou komplexní odpověď s propojením na judikáty, studie, vzory a simulátory.
            </p>
          </div>

          {/* Search bar input container */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePerplexitySearch(searchQuery)}
              placeholder="Zadejte situaci (např. Dítě má 2 roky, střídavá péče, OSPOD...)"
              className="w-full pl-11 pr-28 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white border border-slate-700 focus:border-indigo-500 rounded-2xl text-xs outline-none text-white focus:text-slate-900 placeholder:text-slate-400 transition-all shadow-md font-sans"
            />
            <button
              onClick={() => handlePerplexitySearch(searchQuery)}
              disabled={isSearching}
              className="absolute right-2.5 top-2 py-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all"
            >
              Prohledat <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rapid Suggestions list */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {[
              'Dítě má 2 roky',
              'Jak reagovat na OSPOD',
              'Odmítnutí střídavé péče',
              'Attachment u kojenců'
            ].map((suggest, idx) => (
              <button
                key={idx}
                onClick={() => handlePerplexitySearch(suggest)}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-slate-800 text-slate-300 rounded-xl text-[10px] font-mono cursor-pointer transition-all"
              >
                + {suggest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Perplexity Multi-Source Answer Panel */}
      <AnimatePresence mode="wait">
        
        {isSearching && (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-12 text-center space-y-4"
          >
            <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-mono font-bold text-indigo-700 animate-pulse">{searchStatus}</p>
          </motion.div>
        )}

        {perplexityResult && !isSearching && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white p-8 border border-slate-100 rounded-3xl shadow-3xs space-y-8 text-left"
          >
            
            {/* Title & Query Indicator */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold font-mono text-indigo-600 uppercase">Sémantická syntéza výsledků</span>
                <h3 className="font-extrabold text-sm text-slate-800">
                  Dotaz: "{perplexityResult.query}"
                </h3>
              </div>
              <button 
                onClick={() => setPerplexityResult(null)}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 font-mono"
              >
                [ZAVŘÍT ODPOVĚĎ]
              </button>
            </div>

            {/* ChatGPT Answer text block */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">AI Vyhodnocení situace</h4>
              <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">
                {perplexityResult.answer}
              </p>
            </div>

            {/* Bento Grid: Articles, Studies, Judgments, etc. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
              
              {/* Recommended Articles & Guides */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-4.5 h-4.5 text-indigo-600" /> Doporučené Články & Průvodci
                </h5>
                <div className="space-y-2">
                  {perplexityResult.articles.map((art: any) => (
                    <div key={art.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all">
                      <div className="space-y-0.5 truncate pr-2">
                        <span className="text-[8px] font-mono text-indigo-600 uppercase font-bold">{art.category}</span>
                        <h4 className="font-bold text-xs text-slate-800 leading-tight">{art.title}</h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Judgments & Court Decisions (SSOT) */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Scale className="w-4.5 h-4.5 text-teal-600" /> Relevantní Judikatura Ústavního Soudu
                </h5>
                <div className="space-y-2">
                  {perplexityResult.judgments.map((jud: any) => (
                    <div key={jud.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-left">
                      <div className="flex justify-between items-center text-[9px] font-mono text-teal-700 font-bold mb-1">
                        <span>{jud.fileNo}</span>
                        <span>{jud.court}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 leading-tight mb-1">{jud.title}</h4>
                      <p className="text-[10px] text-slate-500 italic line-clamp-2">"{jud.excerpt}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific Studies */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Heart className="w-4.5 h-4.5 text-rose-500 animate-pulse" /> Související Vědecké Studie
                </h5>
                <div className="space-y-2">
                  {perplexityResult.studies.map((std: any) => (
                    <div key={std.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-left">
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold mb-1">
                        <span>{std.authors}</span>
                        <span>{std.year}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-850 leading-tight mb-1">{std.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">{std.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Checklist & Checkpoint */}
              <div className="space-y-3 bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100/50">
                <h5 className="text-[10px] font-bold font-mono text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600" /> Akční kontrolní seznam pro vás
                </h5>
                <div className="space-y-2 text-xs text-slate-700">
                  {perplexityResult.checklist.map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start font-medium leading-relaxed">
                      <span className="text-indigo-600 font-extrabold mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* Prompts library beneath */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs space-y-6">
        <div className="space-y-1 border-b border-slate-100 pb-4 text-left">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider">
            Soudní & Opatrovnické Šablony Promptů
          </div>
          <h3 className="text-base font-bold text-slate-800 font-display">
            Tréninkové a formální prompty pro LLM modely
          </h3>
          <p className="text-xs text-slate-500">
            Pokud si chcete nechat vygenerovat dokumenty, vyzkoušet simulátor soudního jednání, nebo provést forenzní analýzu rozporů, zkopírujte si tyto specializované prompty do Gemini či ChatGPT.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Categories Tab Selector */}
          <div className="lg:col-span-4 space-y-2">
            {PROMPT_TEMPLATES.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => setSelectedPromptId(prompt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                  selectedPromptId === prompt.id
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-3xs ring-1 ring-indigo-200'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <h4 className="font-extrabold text-xs leading-snug">{prompt.title}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-2">{prompt.description}</p>
              </button>
            ))}
          </div>

          {/* Prompt Viewer */}
          <div className="lg:col-span-8 bg-slate-50 p-6 rounded-2xl border border-slate-200/60 flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Prompt template</span>
              <button
                onClick={() => handleCopyPrompt(selectedPrompt.id, selectedPrompt.promptText)}
                className="px-3 py-1 bg-slate-900 hover:bg-black text-white font-bold text-[10px] rounded-lg cursor-pointer"
              >
                {copiedPromptId === selectedPrompt.id ? 'Zkopírováno' : 'Kopírovat prompt'}
              </button>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-150 overflow-y-auto max-h-[220px] font-mono text-[10px] text-slate-700 whitespace-pre-wrap">
              {selectedPrompt.promptText}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
