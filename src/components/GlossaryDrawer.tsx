/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Scale, 
  Compass, 
  Sparkles, 
  ChevronRight,
  Info,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DICTIONARY_TERMS, DictionaryTerm, DictionaryCategory } from '../data/dictionary';
import { useLanguage } from '../lib/LanguageContext';
import { getTranslatedObject } from '../data/dynamicTranslations';

interface GlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string | null;
}

const CATEGORY_MAP: Record<string, { label: string; color: string; badgeBg: string }> = {
  all: { label: 'Všechny pojmy', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200', badgeBg: 'bg-slate-100 text-slate-800' },
  process: { label: 'Proces & Právo', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100', badgeBg: 'bg-blue-100 text-blue-800' },
  subjects: { label: 'Subjekty & Soud', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100', badgeBg: 'bg-purple-100 text-purple-800' },
  custody: { label: 'Péče & Práva', color: 'bg-teal-50 text-teal-700 hover:bg-teal-100', badgeBg: 'bg-teal-100 text-teal-800' },
  psychology: { label: 'Psychologie & Důkazy', color: 'bg-amber-50 text-amber-800 hover:bg-amber-100', badgeBg: 'bg-amber-100 text-amber-900' },
  finance: { label: 'Finance & Výkon', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', badgeBg: 'bg-emerald-100 text-emerald-800' },
  technical: { label: 'Technické & AI', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100', badgeBg: 'bg-indigo-100 text-indigo-800' },
};

export default function GlossaryDrawer({ isOpen, onClose, initialTermId }: GlossaryDrawerProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);

  // Localized dictionary terms
  const LOCALIZED_DICTIONARY_TERMS = React.useMemo<Record<string, DictionaryTerm>>(() => {
    const res: Record<string, DictionaryTerm> = {};
    for (const [key, val] of Object.entries(DICTIONARY_TERMS)) {
      res[key] = getTranslatedObject(`dict-${key}`, val as DictionaryTerm, language);
    }
    return res;
  }, [language]);

  // Set the selected term when initialTermId changes
  useEffect(() => {
    if (initialTermId && LOCALIZED_DICTIONARY_TERMS[initialTermId.toLowerCase()]) {
      setSelectedTerm(LOCALIZED_DICTIONARY_TERMS[initialTermId.toLowerCase()]);
    } else if (!selectedTerm && Object.keys(LOCALIZED_DICTIONARY_TERMS).length > 0) {
      setSelectedTerm(LOCALIZED_DICTIONARY_TERMS[Object.keys(LOCALIZED_DICTIONARY_TERMS)[0]]);
    }
  }, [initialTermId, LOCALIZED_DICTIONARY_TERMS]);

  // Sync selected term when language changes
  useEffect(() => {
    if (selectedTerm) {
      const updated = LOCALIZED_DICTIONARY_TERMS[selectedTerm.id];
      if (updated) {
        setSelectedTerm(updated);
      }
    }
  }, [language, LOCALIZED_DICTIONARY_TERMS]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const terms: DictionaryTerm[] = Object.values(LOCALIZED_DICTIONARY_TERMS);
  
  const filteredTerms = terms.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.term.toLowerCase().includes(query) ||
      item.czechTranslation.toLowerCase().includes(query) ||
      item.shortDefinition.toLowerCase().includes(query) ||
      item.definition.toLowerCase().includes(query) ||
      item.importanceInCourt.toLowerCase().includes(query) ||
      item.context.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleSelectTerm = (term: DictionaryTerm) => {
    setSelectedTerm(term);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-slate-50 shadow-2xl border-l border-slate-200 flex flex-col h-full overflow-hidden select-text text-left"
            id="glossary-drawer"
          >
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base font-display">Odborný slovník pojmů</h3>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-extrabold px-2 py-0.5 rounded-full font-mono">
                      {terms.length} pojmů v10.0
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-medium">Synthesis OS • Táta má právo</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split layout: Terms List (Left) and Term Details (Right) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Left sidebar - Terms List */}
              <div className="w-full md:w-88 bg-white border-r border-slate-200/60 flex flex-col h-2/5 md:h-full shrink-0">
                {/* Search */}
                <div className="p-3.5 border-b border-slate-100 shrink-0 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Hledat mezi 50+ odbornými pojmy..."
                      className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs outline-none focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px] font-mono">
                    <Filter className="w-3 h-3 text-slate-400 shrink-0 mr-0.5" />
                    {Object.entries(CATEGORY_MAP).map(([catKey, catMeta]) => {
                      const isActive = selectedCategory === catKey;
                      return (
                        <button
                          key={catKey}
                          onClick={() => setSelectedCategory(catKey)}
                          className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-all font-medium cursor-pointer ${
                            isActive
                              ? 'bg-teal-600 text-white font-bold shadow-3xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {catMeta.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Term items scroll list */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
                  {filteredTerms.length > 0 ? (
                    filteredTerms.map((item) => {
                      const isSelected = selectedTerm?.id === item.id;
                      const catBadge = CATEGORY_MAP[item.category || 'custody'] || CATEGORY_MAP.custody;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTerm(item)}
                          className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                            isSelected
                              ? 'bg-teal-50 text-teal-900 border border-teal-100 shadow-3xs'
                              : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent'
                          }`}
                        >
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs font-display block truncate">
                                {item.term}
                              </span>
                            </div>
                            <span className={`text-[10px] block truncate ${isSelected ? 'text-teal-700/90' : 'text-slate-400'}`}>
                              {item.czechTranslation}
                            </span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isSelected ? 'text-teal-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400'
                          }`} />
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-slate-400 text-xs font-mono space-y-1">
                      <p>Nebyly nalezeny žádné pojmy.</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                        className="text-teal-600 hover:underline text-[11px]"
                      >
                        Resetovat filtry
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right main panel - Term details */}
              <div className="flex-1 bg-slate-50 overflow-y-auto p-6 md:p-8 space-y-6">
                {selectedTerm ? (
                  <motion.div
                    key={selectedTerm.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-6"
                  >
                    {/* Header Card */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-3xs space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className={`text-[9px] font-bold uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full inline-block ${
                            (CATEGORY_MAP[selectedTerm.category || 'custody'] || CATEGORY_MAP.custody).badgeBg
                          }`}>
                            {(CATEGORY_MAP[selectedTerm.category || 'custody'] || CATEGORY_MAP.custody).label}
                          </span>
                          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight">
                            {selectedTerm.term}
                          </h2>
                          <p className="text-teal-700 font-bold text-sm">
                            {selectedTerm.czechTranslation}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans pt-2 border-t border-slate-100">
                        {selectedTerm.shortDefinition}
                      </p>
                    </div>

                    {/* Detailed Definition */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-3xs space-y-2">
                      <h4 className="text-xs font-bold font-display text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                        Podrobný význam a právně-psychologický rozbor
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {selectedTerm.definition}
                      </p>
                    </div>

                    {/* Importance in Court / Jak to uplatnit u soudu */}
                    <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-3xs space-y-2 border-l-4 border-l-teal-500">
                      <h4 className="text-xs font-bold font-display text-teal-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                        Praktický dopad a způsob uplatnění u soudu pro otce
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans bg-teal-50/30 p-3.5 rounded-xl border border-teal-100/50">
                        {selectedTerm.importanceInCourt}
                      </p>
                    </div>

                    {/* Context, studies & citation */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-3xs space-y-2.5">
                      <h4 className="text-xs font-bold font-display text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-teal-500" />
                        Právní řád ČR, vědecký kontext a judikatura
                      </h4>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 space-y-2 font-mono text-[11px] text-slate-500">
                        <p className="leading-relaxed">
                          {selectedTerm.context}
                        </p>
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 space-y-3">
                    <Info className="w-8 h-8 text-slate-300" />
                    <p className="text-xs font-mono">Vyberte ze seznamu vlevo pojem pro zobrazení detailu.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Sticky footer for quick help */}
            <div className="bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between text-[10px] text-slate-400 font-mono shrink-0">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                Kompletní lexikon 50+ opatrovnických pojmů v10.0
              </span>
              <span>
                Synthesis Hub v2.5
              </span>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
