/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  FileText, 
  Tv, 
  Scale, 
  BookOpen, 
  MessageSquare, 
  ArrowRight,
  Sparkles,
  Sliders,
  Command
} from 'lucide-react';

export type SearchCategory = 'all' | 'articles' | 'videos' | 'judikatura' | 'studies' | 'forum';

interface UniversalSearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigate?: (tabId: string) => void;
  className?: string;
  placeholder?: string;
}

interface SearchSuggestion {
  id: string;
  title: string;
  category: SearchCategory;
  categoryName: string;
  tabId: string;
  icon: React.ElementType;
}

const SAMPLE_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', title: 'Metodika výpočtu výživného 2026', category: 'articles', categoryName: 'Články', tabId: 'news', icon: FileText },
  { id: '2', title: 'Judikát ÚS ČR - Sourozenecká vazba a střídavá péče', category: 'judikatura', categoryName: 'Judikatura', tabId: 'judikatura', icon: Scale },
  { id: '3', title: 'Video: Jak na pohovor s OSPOD bez emocí', category: 'videos', categoryName: 'Videotéka', tabId: 'videoteka', icon: Tv },
  { id: '4', title: 'Studie psychologických dopadů střídavé péče', category: 'studies', categoryName: 'Studie', tabId: 'knihovna-studii', icon: BookOpen },
  { id: '5', title: 'Diskuze: Zkušenosti s předběžným opatřením', category: 'forum', categoryName: 'Fórum', tabId: 'forum', icon: MessageSquare },
  { id: '6', title: 'Simulátor Péče & Sourozenecká Soudržnost', category: 'articles', categoryName: 'Nástroje', tabId: 'plan-pece', icon: Sliders }
];

export default function UniversalSearchInput({
  searchQuery,
  setSearchQuery,
  onNavigate,
  className = '',
  placeholder = 'Vyhledat v článku, judikatuře, videích a fóru...'
}: UniversalSearchInputProps) {
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [isFocused, setIsFocused] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hotkey listener: Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter suggestions based on query and category
  const filteredSuggestions = SAMPLE_SUGGESTIONS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categories: { id: SearchCategory; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'Vše', icon: Sparkles },
    { id: 'articles', label: 'Články', icon: FileText },
    { id: 'videos', label: 'Videotéka', icon: Tv },
    { id: 'judikatura', label: 'Judikatura', icon: Scale },
    { id: 'studies', label: 'Studie', icon: BookOpen },
    { id: 'forum', label: 'Fórum', icon: MessageSquare },
  ];

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.title);
    setIsFocused(false);
    if (onNavigate) {
      onNavigate(suggestion.tabId);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className={`flex items-center gap-1.5 bg-slate-50 border transition-all rounded-2xl px-3 py-1.5 ${
        isFocused ? 'bg-white border-teal-500 ring-2 ring-teal-500/10 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:bg-white'
      }`}>
        <Search className={`w-4 h-4 shrink-0 transition-colors ${isFocused ? 'text-teal-600' : 'text-slate-400'}`} />

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            title="Vymazat Hledání"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Shortcut Badge */}
        {!isFocused && !searchQuery && (
          <div className="hidden xl:flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[9px] font-mono text-slate-400 shrink-0">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        )}

        {/* Category Filter Toggle */}
        <button
          type="button"
          onClick={() => setShowCategoryMenu(!showCategoryMenu)}
          className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
            selectedCategory !== 'all'
              ? 'bg-teal-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title="Filtrovat kategorii"
        >
          <Filter className="w-3 h-3" />
          <span className="hidden sm:inline">
            {categories.find(c => c.id === selectedCategory)?.label}
          </span>
        </button>
      </div>

      {/* Category Selection Dropdown */}
      {showCategoryMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in duration-100">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1 border-b border-slate-100">
            Filtrovat sekci
          </div>
          <div className="space-y-0.5">
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowCategoryMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CatIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{cat.label}</span>
                  </div>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggestions Popover Panel */}
      {isFocused && (searchQuery.trim().length > 0 || selectedCategory !== 'all') && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-slate-100">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Výsledky vyhledávání ({filteredSuggestions.length})
            </span>
            {selectedCategory !== 'all' && (
              <span className="text-[10px] text-teal-600 font-bold">
                Kategorie: {categories.find(c => c.id === selectedCategory)?.label}
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors shrink-0">
                        <ItemIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-800 block truncate group-hover:text-teal-900">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.categoryName}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors shrink-0 ml-2" />
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-slate-500 font-medium">Nebyly nalezeny žádné výsledky</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Zkuste změnit hledaný výraz nebo vybrat jinou kategorii.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
