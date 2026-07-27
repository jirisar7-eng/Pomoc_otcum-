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
  Scale,
  Compass,
  Heart,
  Quote,
  UserCheck,
  Flag,
  ArrowRight,
  Clock,
  CheckCircle2,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { MY_ANONYMIZED_DOCUMENTS, AnonymizedDocument } from '../data/myAnonymizedDocuments';

interface FounderStoryViewProps {
  setActiveTab?: (tab: string) => void;
  setSearchQuery?: (query: string) => void;
}

export default function FounderStoryView({ setActiveTab, setSearchQuery }: FounderStoryViewProps) {
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
    element.download = `Anonymizovany_Dokument_Strana_${doc.pageNumber}_${doc.id}.txt`;
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
    { id: 'all', label: `Všechny dokumenty (${MY_ANONYMIZED_DOCUMENTS.length})` },
    { id: 'soudni-podani', label: 'Soudní podání otce' },
    { id: 'soudni-usneseni', label: 'Soudní usnesení & rozsudky' },
    { id: 'ospod-meu', label: 'OSPOD & Městský úřad' },
    { id: 'mpsv-ombudsman', label: 'Inspekce MPSV & Ombudsman' },
    { id: 'charita-sluzby', label: 'Charita & sociální služby' },
    { id: 'zpravy-dokazy', label: 'Důkazní konverzace & chaty' }
  ];

  const storyTimeline = [
    {
      phase: '1. Fáze • Leden 2026',
      title: 'Rozpad vztahu a požadavek na výlučnou péči matky u 6měsíčního kojence',
      desc: 'Po rozpadu partnerského vztahu nastala situace, kdy matka požadovala výlučnou péči o 6měsíčního syna a odmítala jakoukoliv noční péči otce s argumentací, že kojenec patří výhradně k matce.',
      icon: Flag,
      status: 'Počáteční spor'
    },
    {
      phase: '2. Fáze • Duben 2026',
      title: 'Informační blokáda a nátlak institucí',
      desc: 'Soutěž s neobjektivním přístupem OSPODu a terénní služby Charity, která otci odmítala zpřístupnit originální spis syna bez souhlasu matky. Otec inicioval podnět k inspekci sociálních služeb u MPSV.',
      icon: ShieldCheck,
      status: 'Právní obrana'
    },
    {
      phase: '3. Fáze • Červen 2026',
      title: 'Rozsudek I. stupně a zákaz noční péče',
      desc: 'Soud I. stupně vydal rozsudek, který deklaroval společnou péči, ale péči otce rozdrobil v lichém týdnu na 3 odpolední úseky bez přespávání s povinností předávat dítě na nádraží. Otec ihned podal odvolání.',
      icon: Scale,
      status: 'Odvolací řízení'
    },
    {
      phase: '4. Fáze • Červen 2026',
      title: 'Kritický incident a odebrání nemocného dítěte',
      desc: 'Matka za asistences Charity svémocně odebrala spící nemocné dítě s horečkou 37,6 °C a neštovicemi ještě před doručením rozsudku. Otec reagoval exekučním návrhem, stížností tajemníkovi MěÚ a Dětskému ombudsmanovi.',
      icon: AlertCircle,
      status: 'Krizový zásah'
    },
    {
      phase: '5. Fáze • Červenec 2026',
      title: 'Vědecká argumentace a vznik portálu Synthesis OS',
      desc: 'Otec doplnil odvolání o konsenzuální studie 110 světových expertů (Dr. Warshak, Prof. Fabricius) a založil tento komunitní portál, aby své zkušenosti a reálný spis zpřístupnil jako oporu všem otcům.',
      icon: Compass,
      status: 'Mise & Pomoc'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10" id="cesta-zakladatele-view">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-semibold">
              <Compass className="w-4 h-4 text-teal-400" />
              <span>CESTA ZAKLADATELE PORTÁLU • SYNTHESIS OS</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Cesta zakladatele – Můj právní příběh
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tento portál nevznikl v kanceláři právní firmy ani jako komerční projekt. Vznikl z mého vlastního, těžce vybojovaného rodičovského zápasu o syna. Jako otec jsem na vlastní kůži zažil systémové překážky, odmítání noční péče u kojence, podjatost sociálních služeb i informační blokádu. Zde sdílím svůj příběh a kompletní reálný spis jako živý návod a oporu pro další táty.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center shrink-0 min-w-[240px] space-y-2">
            <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">Kompletní osobní spis</span>
            <span className="text-4xl font-display font-extrabold text-teal-400">{MY_ANONYMIZED_DOCUMENTS.length} / {MY_ANONYMIZED_DOCUMENTS.length}</span>
            <span className="text-xs text-slate-200 block font-sans">Anonymizovaných stránek spisu</span>
            <div className="text-[10px] text-teal-300 bg-teal-500/20 py-1.5 px-3 rounded-lg font-mono mt-2 font-bold">
              1 DOKUMENT = 1 STRÁNKA
            </div>
          </div>
        </div>

        {/* Anonymization Notice */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-start gap-3 text-xs text-teal-200/90 font-mono">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong>Garantovaný protokol 100% anonymizace:</strong> Pro ochranu soukromí dětí a rodiny byly veškeré osobní údaje, rodná čísla, jména, adresy, spisy a konkrétní obce v celém spisu důsledně anonymizovány a nahrazeny obecnými právními zastupnými vzory ([OTEC], [MATKA], [NEZLETILÝ SYN A], [OSPOD], [OKRESNÍ SOUD], [KRAJSKÝ SOUD], atd.).
          </span>
        </div>
      </div>

      {/* BLOCK: Můj právní příběh */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8" id="muj-pravni-pribeh">
        
        {/* Block Title & Intro Text */}
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold shrink-0 border border-teal-500/20">
              <Quote className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Můj právní příběh
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-sans">
                Autentický příběh mého opatrovnického sporu, motivace k založení portálu a pomoc ostatním otcům
              </p>
            </div>
          </div>

          <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-3 pt-2">
            <p>
              Když můj mladší syn dosáhl věku 6 měsíců, stál jsem před nejtěžší životní zkouškou. Po rozpadu vztahu jsem čelil tvrzení, že takto malé dítě patři výhradně matce a otec nemá mít nárok na noční péči. Soud I. stupně moji péči rozdrobil na 3 odpolední úseky v lichém týdnu a nařídil předávání na železniční stanici. Tím zcela izoloval kojence od jeho 8letého bratra, kterého mám ve své výlučné péči.
            </p>
            <p>
              Odmítl jsem se vzdát. Když matka za doprovodu neziskové organizace odebrala spící nemocné dítě s neštovicemi a horečkou ještě před doručením rozsudku, využil jsem všechny dostupné právní nástroje: podal jsem odvolání k Krajskému soudu opřené o mezinárodní výzkumy Dr. Warshaka, stížnosti dle § 175 správního řádu tajemníkovi MěÚ, podněty na MPSV, exekuční návrh i podání Dětskému ombudsmanovi.
            </p>
          </div>
        </div>

        {/* Timeline of Story */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Časová osa mého příběhu</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            {storyTimeline.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-teal-300 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {item.phase}
                      </span>
                      <IconComp className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Stav:</span>
                    <span className="font-bold text-slate-700">{item.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivation & Why it helps fathers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs font-mono uppercase tracking-wider">
              <Heart className="w-4 h-4" />
              <span>Vysvětlení motivace vzniku portálu</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              Proč vznikl portál Synthesis OS – Táta má právo?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Během mého sporu jsem zjistil, jak hluboce izolovaní a dezinformovaní se táta v opatrovnickém systému ocitají. Mnohdy podléhají alibistickému tlaku OSPODu nebo neznalosti vlastních práv. Vytvořil jsem tento portál, abych veškerou svou energii, zpracovanou judikaturu, vzory podání a systémové analýzy předal zdarma dalším otcům.
            </p>
          </div>

          <div className="bg-teal-50/60 rounded-2xl p-6 border border-teal-200/80 space-y-3">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-xs font-mono uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-teal-700" />
              <span>Proč může pomoci ostatním otcům</span>
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900">
              Jak tento spis a portál pomáhá ostatním
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Tento kompletní anonymizovaný spis slouží jako praktický manuál reálné právní sebeobrany. Zde uvidíte přesnou strukturu odvolání proti nesmyslnému pendlování, jak vyvrátit mýty o "nocování u kojenců" vědeckými studiemi, jak správně formulovat stížnost dle § 175 správního řádu na OSPOD a jak reagovat na porušování dohod ze strany druhého rodiče.
            </p>
          </div>

        </div>

      </div>

      {/* BLOCK: Kompletní anonymizovaný soudní spis */}
      <div className="space-y-6" id="anonymizovany-spis-section">
        
        {/* Section Title & Document Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  Kompletní anonymizovaný soudní spis
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Autentické podklady, rozsudky, protokoly a komunikace (1 dokument = 1 stránka)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                Strana {currentDoc.pageNumber} z {MY_ANONYMIZED_DOCUMENTS.length}
              </span>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Hledat v dokumentech a textu..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Category Select */}
            <div className="relative md:col-span-2 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-3 py-2 rounded-xl border whitespace-nowrap transition-all font-medium ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* Page Index Buttons Matrix (1 to 25) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              <span>Rejstřík stránek spisu ({MY_ANONYMIZED_DOCUMENTS.length})</span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                1 DOKUMENT = 1 STRÁNKA
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 pt-1">
              {MY_ANONYMIZED_DOCUMENTS.map((doc) => {
                const isActive = doc.pageNumber === currentDoc.pageNumber;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setCurrentPage(doc.pageNumber)}
                    title={`${doc.pageNumber}. ${doc.title}`}
                    className={`w-9 h-9 text-xs font-mono font-bold rounded-xl border transition-all flex items-center justify-center ${
                      isActive
                        ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105 ring-2 ring-teal-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {doc.pageNumber}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Active Document Viewer Card */}
        {currentDoc && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden space-y-0">
            
            {/* Viewer Header */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-teal-500/20 text-teal-300 px-3 py-1 rounded-lg border border-teal-500/30">
                    STRANA {currentDoc.pageNumber} z {MY_ANONYMIZED_DOCUMENTS.length}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {currentDoc.categoryLabel}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-300 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                  SP. ZN.: {currentDoc.caseRef}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-snug">
                  {currentDoc.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300 font-mono">
                  <div><strong>Vydavatel / Původ:</strong> {currentDoc.issuingBody}</div>
                  <div><strong>Adresát:</strong> {currentDoc.targetBody}</div>
                  <div><strong>Datum:</strong> {currentDoc.dateStr}</div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                
                {/* Prev / Next Page Pagination */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentDoc.pageNumber === 1}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold font-mono disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Předchozí strana</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(MY_ANONYMIZED_DOCUMENTS.length, prev + 1))}
                    disabled={currentDoc.pageNumber === MY_ANONYMIZED_DOCUMENTS.length}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold font-mono disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
                  >
                    <span>Další strana</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Copy, Download, AI Analyze Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  <button
                    onClick={() => handleCopyText(currentDoc.content)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium border border-slate-700 transition-colors"
                    title="Kopírovat text dokumentu do schránky"
                  >
                    {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                    <span>{copied ? 'Kopírováno!' : 'Kopírovat text'}</span>
                  </button>

                  <button
                    onClick={() => handleDownload(currentDoc)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium border border-slate-700 transition-colors"
                    title="Stáhnout dokument jako textový soubor TXT"
                  >
                    <Download className="w-4 h-4 text-slate-300" />
                    <span>Stáhnout TXT</span>
                  </button>

                  <button
                    onClick={() => handleAiAnalyze(currentDoc)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold hover:from-teal-400 hover:to-emerald-400 text-xs shadow-md transition-all"
                    title="Otevřít AI právní analýzu tohoto dokumentu"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>AI Analýza dokumentu</span>
                  </button>

                </div>

              </div>

            </div>

            {/* Document Content Body */}
            <div className="p-6 sm:p-8 space-y-6 bg-slate-50">
              
              {/* Summary & Legal Takeaway Callout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Stručný obsah dokumentu</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {currentDoc.summary}
                  </p>
                </div>

                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900 uppercase tracking-wider">
                    <Scale className="w-4 h-4 text-amber-700" />
                    <span>Právní doporučení &amp; ponaučení pro otce</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-sans">
                    {currentDoc.legalTakeaway}
                  </p>
                </div>

              </div>

              {/* Verbatim Document Text Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-inner space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-mono text-slate-400">
                  <span className="font-bold uppercase tracking-wider">VZDĚLÁVACÍ PŘÍPADOVÁ STUDIE (PŘEPRACOVANÝ TEXT DOKUMENTU)</span>
                  <span>STRANA {currentDoc.pageNumber} / {MY_ANONYMIZED_DOCUMENTS.length}</span>
                </div>

                <pre className="font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-teal-100 selection:text-teal-900">
                  {currentDoc.content}
                </pre>
              </div>

              {/* Bottom Navigation Toolbar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentDoc.pageNumber === 1}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-800 hover:bg-slate-100 text-xs font-bold border border-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Předchozí stránka</span>
                </button>

                <span className="text-xs font-mono text-slate-500 font-bold">
                  Dokument {currentDoc.pageNumber} z {MY_ANONYMIZED_DOCUMENTS.length}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(MY_ANONYMIZED_DOCUMENTS.length, prev + 1))}
                  disabled={currentDoc.pageNumber === MY_ANONYMIZED_DOCUMENTS.length}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <span>Další stránka</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
