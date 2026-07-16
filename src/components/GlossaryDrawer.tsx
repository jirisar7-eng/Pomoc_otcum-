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
  ExternalLink, 
  Sparkles, 
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DICTIONARY_TERMS, DictionaryTerm } from '../data/dictionary';

interface GlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string | null;
}

export default function GlossaryDrawer({ isOpen, onClose, initialTermId }: GlossaryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);

  // Set the selected term when initialTermId changes
  useEffect(() => {
    if (initialTermId && DICTIONARY_TERMS[initialTermId.toLowerCase()]) {
      setSelectedTerm(DICTIONARY_TERMS[initialTermId.toLowerCase()]);
    } else if (!selectedTerm && Object.keys(DICTIONARY_TERMS).length > 0) {
      setSelectedTerm(DICTIONARY_TERMS[Object.keys(DICTIONARY_TERMS)[0]]);
    }
  }, [initialTermId]);

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

  const terms = Object.values(DICTIONARY_TERMS);
  
  const filteredTerms = terms.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.term.toLowerCase().includes(query) ||
      item.czechTranslation.toLowerCase().includes(query) ||
      item.shortDefinition.toLowerCase().includes(query) ||
      item.definition.toLowerCase().includes(query)
    );
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
            <div className="bg-white border-b border-slate-100 px-6 py-4.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-display">Odborný slovník pojmů</h3>
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
              <div className="w-full md:w-80 bg-white border-r border-slate-200/60 flex flex-col h-1/3 md:h-full shrink-0">
                {/* Search */}
                <div className="p-4 border-b border-slate-100 shrink-0">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Hledat v pojmech..."
                      className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs outline-none focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Term items scroll list */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
                  {filteredTerms.length > 0 ? (
                    filteredTerms.map((item) => {
                      const isSelected = selectedTerm?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTerm(item)}
                          className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                            isSelected
                              ? 'bg-teal-50 text-teal-900 border border-teal-100 shadow-3xs'
                              : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs font-display block truncate">
                              {item.term}
                            </span>
                            <span className={`text-[10px] block truncate ${isSelected ? 'text-teal-700/80' : 'text-slate-400'}`}>
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
                    <div className="p-6 text-center text-slate-400 text-xs font-mono">
                      Nebyly nalezeny žádné pojmy.
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
                          <span className="text-[9px] bg-teal-100 text-teal-800 font-bold uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full inline-block">
                            Akademický termín
                          </span>
                          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight">
                            {selectedTerm.term}
                          </h2>
                          <p className="text-teal-700 font-bold text-sm">
                            {selectedTerm.czechTranslation}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans pt-1 border-t border-slate-100">
                        {selectedTerm.shortDefinition}
                      </p>
                    </div>

                    {/* Detailed Definition */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-3xs space-y-2">
                      <h4 className="text-xs font-bold font-display text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                        Podrobný význam a psychologický rozbor
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {selectedTerm.definition}
                      </p>
                    </div>

                    {/* Importance in Court / Jak to uplatnit u soudu */}
                    <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-3xs space-y-2 border-l-4 border-l-teal-500">
                      <h4 className="text-xs font-bold font-display text-teal-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                        Jak tento pojem úspěšně uplatnit u soudu
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans bg-teal-50/30 p-3.5 rounded-xl border border-teal-100/50">
                        {selectedTerm.importanceInCourt}
                      </p>
                    </div>

                    {/* Context, studies & citation */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-3xs space-y-2.5">
                      <h4 className="text-xs font-bold font-display text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-teal-500" />
                        Vědecký kontext, studie a prameny
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
                Vždy aktuální data založená na vědeckém konsenzu
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
