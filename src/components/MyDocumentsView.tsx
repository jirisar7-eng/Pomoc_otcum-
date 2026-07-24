/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Search, 
  Filter, 
  BookOpen, 
  Building2, 
  AlertCircle, 
  FileSpreadsheet,
  Layers,
  Scale
} from 'lucide-react';
import { MY_ANONYMIZED_DOCUMENTS, AnonymizedDocument } from '../data/myAnonymizedDocuments';

interface MyDocumentsViewProps {
  setActiveTab?: (tab: string) => void;
  setSearchQuery?: (query: string) => void;
}

export default function MyDocumentsView({ setActiveTab, setSearchQuery }: MyDocumentsViewProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter logic
  const filteredDocs = useMemo(() => {
    return MY_ANONYMIZED_DOCUMENTS.filter(doc => {
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        doc.title.toLowerCase().includes(q) || 
        doc.content.toLowerCase().includes(q) || 
        doc.summary.toLowerCase().includes(q) ||
        doc.legalTakeaway.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  // Current active document
  const currentDoc = useMemo(() => {
    const doc = filteredDocs.find(d => d.pageNumber === currentPage);
    return doc || filteredDocs[0] || MY_ANONYMIZED_DOCUMENTS[0];
  }, [filteredDocs, currentPage]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (doc: AnonymizedDocument) => {
    const element = document.createElement('a');
    const file = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Anonymizovany_Dokument_${doc.pageNumber}_${doc.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAiAnalyze = (doc: AnonymizedDocument) => {
    if (setSearchQuery) {
      setSearchQuery(`Rozbor dokumentu: ${doc.title}`);
    }
    if (setActiveTab) {
      setActiveTab('ai-case-manager');
    }
  };

  const categories = [
    { id: 'all', label: 'Všechny dokumenty (20)' },
    { id: 'soudni-podani', label: 'Soudní podání otce' },
    { id: 'soudni-usneseni', label: 'Soudní usnesení & rozsudky' },
    { id: 'ospod-meu', label: 'OSPOD & Městský úřad' },
    { id: 'mpsv-ombudsman', label: 'Inspekce MPSV & Ombudsman' },
    { id: 'charita-sluzby', label: 'Charita & sociální služby' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="my-documents-portal-view">
      
      {/* Header & Anonymization Guarantee */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>100% ANONYMIZOVANÝ SPIS Z PRAXE • JEDEN DOKUMENT = JEDNA STRÁNKA</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Moje dokumenty – Informační spis portálu
            </h1>
            
            <p className="text-slate-300 text-sm leading-relaxed">
              Autentická reálná právní podání, odvolání, usnesení soudu, stížnosti na OSPOD, podněty k MPSV, Ombudsmanovi a vyjádření sociálních služeb. Veškeré osobní údaje (jména, rodná čísla, přesné adresy, spisy a obce) byly přísně anonymizovány a nahrazeny obecnými právními zastupnými vzory.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center shrink-0 min-w-[200px]">
            <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">Celkem v databázi</span>
            <span className="text-3xl font-display font-extrabold text-teal-400">20 / 20</span>
            <span className="text-xs text-slate-300 block mt-1 font-sans">Anonymizovaných stránek</span>
          </div>
        </div>

        {/* Anonymization Notice */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3 text-xs text-teal-200/90 font-mono">
          <AlertCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong>Bezpečnostní protokol anonymizace:</strong> Žádné osobní údaje se na tomto portálu neobjevují. Identifikátory jsou nahrazeny značkami [OTEC], [MATKA], [NEZLETILÝ SYN A], [OKRESNÍ SOUD], [KRAJSKÝ SOUD], [OBEC A], [DATUM] a [SPIS. ZN.].
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Hledat v anonymizovaných dokumentech (např. neštovice, § 465d, OSPOD, krajský úřad...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          {/* Direct Document Jump Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 whitespace-nowrap">Přejít na stranu:</span>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="text-xs font-mono bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 font-bold cursor-pointer hover:border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
            >
              {MY_ANONYMIZED_DOCUMENTS.map((doc) => (
                <option key={doc.id} value={doc.pageNumber}>
                  Strana {doc.pageNumber}: {doc.title.substring(0, 45)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Kategorie:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const firstMatch = MY_ANONYMIZED_DOCUMENTS.find(d => cat.id === 'all' || d.category === cat.id);
                if (firstMatch) setCurrentPage(firstMatch.pageNumber);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* "Jeden dokument jedna stránka" Pagination Control Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 font-mono font-bold text-sm flex items-center justify-center border border-teal-500/30">
            {currentDoc.pageNumber}
          </span>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Format: Jeden dokument / Jedna stránka</span>
            <p className="text-xs font-semibold text-slate-200">
              Zobrazen dokument <strong className="text-teal-300">{currentDoc.pageNumber} z {MY_ANONYMIZED_DOCUMENTS.length}</strong> • {currentDoc.categoryLabel}
            </p>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium cursor-pointer transition-colors border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Předchozí str.</span>
          </button>

          {/* Direct 1-20 Page Numbers Selector */}
          <div className="hidden lg:flex items-center gap-1">
            {MY_ANONYMIZED_DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setCurrentPage(doc.pageNumber)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  currentPage === doc.pageNumber
                    ? 'bg-teal-500 text-slate-950 shadow-xs scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Strana ${doc.pageNumber}: ${doc.title}`}
              >
                {doc.pageNumber}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(MY_ANONYMIZED_DOCUMENTS.length, prev + 1))}
            disabled={currentPage === MY_ANONYMIZED_DOCUMENTS.length}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium cursor-pointer transition-colors border border-slate-700"
          >
            <span className="hidden sm:inline">Následující str.</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Single Document Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Official Paper Document Rendering */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-stone-50 border border-stone-300 rounded-2xl p-6 sm:p-10 shadow-lg relative min-h-[650px] font-serif text-slate-900 leading-relaxed">
            
            {/* Paper Header / Watermark Stamp */}
            <div className="border-b border-stone-300 pb-4 mb-6 flex flex-wrap items-center justify-between gap-2 font-sans">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>SPIS OCHRANY PRÁV • SP. ZN.: {currentDoc.caseRef}</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2.5 py-1 rounded border border-amber-200 font-bold">
                STRANA {currentDoc.pageNumber} z 20 (ANONYMIZOVÁNO)
              </span>
            </div>

            {/* Document Title Header */}
            <div className="mb-6 font-sans">
              <h2 className="text-xl font-bold text-slate-900 font-display leading-snug">
                {currentDoc.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 font-mono mt-2 pt-2 border-t border-stone-200">
                <span>Orgán/Subjekt: <strong>{currentDoc.issuingBody}</strong></span>
                <span>•</span>
                <span>Adresát: <strong>{currentDoc.targetBody}</strong></span>
              </div>
            </div>

            {/* Document Text Body */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-inner font-mono text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap overflow-x-auto select-text">
              {currentDoc.content}
            </div>

            {/* Document Footer */}
            <div className="mt-8 pt-4 border-t border-stone-300 flex flex-wrap items-center justify-between gap-4 font-sans text-xs text-stone-500">
              <div>
                <span>Datum vkladu: {currentDoc.dateStr}</span>
              </div>
              <div className="flex items-center gap-1 text-teal-700 font-mono text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ověřeno pro vzdělávací účely portálu Táta má právo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Legal Takeaways & Action Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Action Buttons */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Akce s tímto dokumentem
            </h3>

            <button
              onClick={() => handleCopyText(currentDoc.content)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Kopírováno do schránky!' : 'Kopírovat anonymizovaný text'}</span>
            </button>

            <button
              onClick={() => handleDownload(currentDoc)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-200"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Stáhnout jako textový soubor (.txt)</span>
            </button>

            <button
              onClick={() => handleAiAnalyze(currentDoc)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-200 animate-pulse" />
              <span>Analýza v AI Asistentovi</span>
            </button>
          </div>

          {/* Practical Summary */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-teal-900 text-xs font-bold font-display">
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span>Stručný souhrn případu</span>
            </div>
            <p className="text-xs text-teal-900/90 leading-relaxed font-sans">
              {currentDoc.summary}
            </p>
          </div>

          {/* Key Legal Takeaway & Strategy */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-950 text-xs font-bold font-display">
              <Scale className="w-4 h-4 text-indigo-700" />
              <span>Právní poučení & Taktický přínos</span>
            </div>
            <p className="text-xs text-indigo-900/90 leading-relaxed font-sans">
              {currentDoc.legalTakeaway}
            </p>
          </div>

          {/* List of all 20 Pages Quick Sidebar Navigation */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Rejstřík stránek (20)
              </span>
              <span className="text-[10px] font-mono text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                1 spisy / 1 str.
              </span>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {MY_ANONYMIZED_DOCUMENTS.map((doc) => {
                const isActive = doc.pageNumber === currentPage;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setCurrentPage(doc.pageNumber)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer border ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-3xs font-semibold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isActive ? 'bg-teal-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {doc.pageNumber}
                    </span>
                    <div className="line-clamp-2 leading-tight">
                      <span className="block font-medium">{doc.title}</span>
                      <span className={`text-[10px] block font-mono mt-0.5 ${isActive ? 'text-teal-300' : 'text-slate-400'}`}>
                        {doc.categoryLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
