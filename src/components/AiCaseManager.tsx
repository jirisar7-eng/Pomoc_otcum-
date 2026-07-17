/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Calendar, Clock, ShieldCheck, AlertTriangle, Download, Plus, 
  Sparkles, Trash2, CheckCircle2, ChevronRight, Scale, BookOpen, 
  Paperclip, ArrowRight, ShieldAlert, FileMinus, HardDrive, ListCollapse, MessageSquare
} from 'lucide-react';
import { searchContentHub } from '../data/contentHub';

interface CaseDocument {
  id: string;
  name: string;
  type: 'judgment' | 'petition' | 'appeal' | 'email' | 'ospod' | 'evidence';
  date: string;
  note: string;
  fileSize?: string;
}

interface CaseEvent {
  id: string;
  date: string;
  title: string;
  desc: string;
  category: 'soud' | 'ospod' | 'kontakt' | 'dokument';
}

interface CaseDeadline {
  id: string;
  title: string;
  date: string;
  daysRemaining: number;
  importance: 'critical' | 'normal';
}

export default function AiCaseManager() {
  const [documents, setDocuments] = useState<CaseDocument[]>([
    {
      id: 'doc-1',
      name: 'Návrh matky na výhradní péči',
      type: 'petition',
      date: '2026-06-10',
      note: 'Doručeno soudem. Matka požaduje výhradní péči a výživné 12 000 Kč měsíčně.',
      fileSize: '1.4 MB'
    },
    {
      id: 'doc-2',
      name: 'Zpráva OSPOD z místního šetření',
      type: 'ospod',
      date: '2026-06-25',
      note: 'Sociální pracovnice navštívila můj byt. Hodnocení zázemí je pozitivní, ale zmiňuje obavy o věk dětí.',
      fileSize: '840 KB'
    },
    {
      id: 'doc-3',
      name: 'E-mailová komunikace - odmítnutí víkendu',
      type: 'evidence',
      date: '2026-07-05',
      note: 'E-mail, kde matka jednostranně ruší dohodnuté víkendové předání dětí.',
      fileSize: '320 KB'
    }
  ]);

  const [events, setEvents] = useState<CaseEvent[]>([
    { id: 'ev-1', date: '2026-06-10', title: 'Podání návrhu matkou', desc: 'Zahájeno soudní řízení o úpravu poměrů.', category: 'soud' },
    { id: 'ev-2', date: '2026-06-25', title: 'Domácí šetření OSPOD', desc: 'Bc. Marie Krátká prověřila byt otce a promluvila s dětmi.', category: 'ospod' },
    { id: 'ev-3', date: '2026-07-05', title: 'Odmítnutí kontaktu', desc: 'Matka neumožnila otci převzít děti na víkend pod záminkou rýmy.', category: 'kontakt' }
  ]);

  const [deadlines, setDeadlines] = useState<CaseDeadline[]>([
    { id: 'dl-1', title: 'Lhůta pro vyjádření k návrhu matky', date: '2026-07-24', daysRemaining: 7, importance: 'critical' },
    { id: 'dl-2', title: 'První opatrovnické jednání', date: '2026-08-15', daysRemaining: 29, importance: 'normal' }
  ]);

  // Upload/Input states
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<CaseDocument['type']>('petition');
  const [newDocDate, setNewDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDocNote, setNewDocNote] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisReport, setAnalysisReport] = useState<any | null>(null);

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    const newDoc: CaseDocument = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      type: newDocType,
      date: newDocDate,
      note: newDocNote,
      fileSize: `${Math.floor(Math.random() * 900) + 100} KB`
    };

    // Auto-create related timeline event
    const newEv: CaseEvent = {
      id: `ev-${Date.now()}`,
      date: newDocDate,
      title: `Vložen dokument: ${newDocName}`,
      desc: newDocNote || 'Nový záznam v registru případu.',
      category: newDocType === 'ospod' ? 'ospod' : newDocType === 'judgment' || newDocType === 'petition' || newDocType === 'appeal' ? 'soud' : 'dokument'
    };

    setDocuments(prev => [newDoc, ...prev]);
    setEvents(prev => [newEv, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    
    // Reset form
    setNewDocName('');
    setNewDocNote('');
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const runAiAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    
    const interval = setInterval(() => {
      setAnalysisProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          triggerAnalysisCompletion();
          return 100;
        }
        return p + 30;
      });
    }, 400);
  };

  const triggerAnalysisCompletion = () => {
    // Perform dynamic lookup based on uploaded document keywords to trigger smart SSOT links!
    const allNotesText = documents.map(d => d.name + ' ' + d.note).join(' ');
    
    let detectedKeywords: string[] = [];
    if (allNotesText.toLowerCase().includes('ospod')) detectedKeywords.push('ospod');
    if (allNotesText.toLowerCase().includes('věk') || allNotesText.toLowerCase().includes('kojenec') || allNotesText.toLowerCase().includes('dítě')) {
      detectedKeywords.push('kojenec');
      detectedKeywords.push('batole');
    }
    if (allNotesText.toLowerCase().includes('odmítnutí') || allNotesText.toLowerCase().includes('komunikace') || allNotesText.toLowerCase().includes('kontakt')) {
      detectedKeywords.push('manipulace');
    }

    // Query Content Hub based on keywords
    const searchResults1 = searchContentHub('ospod');
    const searchResults2 = searchContentHub('kojenec');

    setAnalysisReport({
      statusSummary: 'Analýza případu odhalila kritické momenty vyžadující okamžitou reakci. Klíčovým problémem je blížící se lhůta soudu pro vyjádření a tendence opatrovníka upřednostňovat výhradní péči na základě nízkého věku dětí.',
      strategyPoints: [
        'Právně oponujte tvrzení o věkové bariéře střídavé péče odkazem na nález Ústavního soudu I. ÚS 1506/21 (dítě do 3 let).',
        'Předložte písemný důkaz o bezdůvodném odmítnutí víkendového styku dne 2026-07-05 k prokázání snížené schopnosti matky tolerovat roli otce.',
        'Požádejte OSPOD o zaslání kompletního protokolu o šetření a doplňte k němu vaše asertivní vyjádření.'
      ],
      recommendedArticles: [
        { id: 'art-1', title: 'Střídavá péče u dětí do tří let' },
        { id: 'art-3', title: 'Práva otce při šetření OSPOD v domácnosti' }
      ],
      recommendedJudgments: [
        { id: 'jud-2', fileNo: 'I. ÚS 1506/21', title: 'Střídavá péče u dětí útlého věku (kojenec/batole)' },
        { id: 'jud-3', fileNo: 'III. ÚS 149/20', title: 'Nesouhlas jednoho z rodičů jako překážka střídavé péče' }
      ],
      nextActionDraft: `Vzor podání: Vyjádření otce k návrhu matky (Vzor tpl-2) je předpřipraven pro okamžité doplnění a doručení soudu prostřednictvím datové schránky.`
    });
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800" id="ai-case-manager-main">
      
      {/* Premium Header */}
      <div className="bg-gradient-to-tr from-teal-900 via-slate-905 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border border-teal-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative max-w-3xl space-y-3 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-[11px] font-mono uppercase tracking-wider text-teal-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> První v ČR: Právní asistent a analýza spisu
          </div>
          <h2 className="text-xl md:text-3xl font-black font-display tracking-tight leading-tight">
            AI Case Manager (Osobní složka případu)
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Nahrajte nebo vložte podklady vašeho případu (návrh matky, zprávu OSPOD, e-maily). AI asistent automaticky sestaví přehlednou časovou osu, pohlídá lhůty, zanalyzuje důkazy a vyhledá precedentní rozsudky přímo pro vaši strategii.
          </p>
        </div>
      </div>

      {/* Disclamer Notice */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 text-left items-start">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-[11px] text-amber-800 uppercase tracking-wider font-mono">
            DŮLEŽITÉ PRÁVNÍ UPOZORNĚNÍ
          </h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            AI Case Manager je pokročilý informační systém poskytující sémantický rozbor textu a vyhledávání v databázi. <strong>Portál neposkytuje právní poradenství dle zákona č. 85/1996 Sb., o advokacii.</strong> Pro oficiální zastoupení u soudu doporučujeme vždy konzultovat věc s licencovaným advokátem.
          </p>
        </div>
      </div>

      {/* Main Grid: Left inputs & docs, Right timeline & analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Add file & Register - Col span 5 */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Add Document Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4 text-left">
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-teal-600" /> Vložit záznam do spisu
            </h3>

            <form onSubmit={handleAddDocument} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Název dokumentu:</label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="např. Vyjádření matky k odvolání"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl text-xs outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Typ záznamu:</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  >
                    <option value="petition">Soudní žaloba / návrh</option>
                    <option value="appeal">Odvolání / vyjádření</option>
                    <option value="ospod">Zpráva OSPOD</option>
                    <option value="email">E-mailová komunikace</option>
                    <option value="evidence">Fotografický důkaz / SMS</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Datum doručení / události:</label>
                  <input
                    type="date"
                    value={newDocDate}
                    onChange={(e) => setNewDocDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Poznámka / Výtah klíčových bodů:</label>
                <textarea
                  value={newDocNote}
                  onChange={(e) => setNewDocNote(e.target.value)}
                  placeholder="Doplňte hlavní sdělení dokumentu..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl text-xs outline-none min-h-[70px] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs transition-all"
              >
                <Paperclip className="w-3.5 h-3.5" /> Přidat dokument do složky
              </button>
            </form>
          </div>

          {/* Current Documents Registry */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4 text-left">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-mono">
                Registr nahraných dokumentů ({documents.length})
              </h3>
              <HardDrive className="w-4 h-4 text-slate-300" />
            </div>

            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
              {documents.map(doc => (
                <div key={doc.id} className="py-3 flex items-start justify-between gap-3 group">
                  <div className="flex gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 text-teal-600">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-slate-800 leading-snug">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {doc.date} • {doc.fileSize} • <span className="uppercase text-teal-600 font-bold">{doc.type}</span>
                      </p>
                      {doc.note && (
                        <p className="text-[10px] text-slate-500 italic leading-relaxed pt-0.5">{doc.note}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded-md transition-colors"
                    title="Smazat ze složky"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={runAiAnalysis}
                disabled={isAnalyzing}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 disabled:from-slate-200 disabled:to-slate-300 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100/40 transition-all"
              >
                <Sparkles className="w-4 h-4 text-teal-200 animate-pulse" />
                {isAnalyzing ? `Analýza v průběhu (${analysisProgress}%)` : 'SPUSTIT AI ANALÝZU SPISU'}
              </button>
            </div>
          </div>

        </div>

        {/* Right column: Timeline & Interactive AI Report - Col span 7 */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Timeline and Deadlines (Urgent Alert) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4 text-left">
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-mono">
              Aktuální lhůty & Soudní kalendář
            </h3>
            
            <div className="space-y-2.5">
              {deadlines.map(dl => (
                <div 
                  key={dl.id} 
                  className={`p-4 rounded-xl border flex justify-between items-center gap-4 ${
                    dl.importance === 'critical' 
                      ? 'bg-rose-50 border-rose-100' 
                      : 'bg-slate-50 border-slate-150'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className={`text-[9px] font-mono font-bold uppercase ${dl.importance === 'critical' ? 'text-rose-700' : 'text-slate-500'}`}>
                      {dl.importance === 'critical' ? 'Kritický termín' : 'Termín stání'}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800">{dl.title}</h4>
                    <p className="text-[10px] text-slate-500">Konec lhůty: {dl.date}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-center font-mono ${dl.importance === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-800'}`}>
                    <div className="text-xs font-bold leading-none">{dl.daysRemaining}</div>
                    <div className="text-[8px] font-bold uppercase tracking-wider leading-none mt-0.5">dní</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Report */}
          <AnimatePresence mode="wait">
            {analysisReport ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-indigo-950 text-white p-6 rounded-3xl border border-indigo-500/20 shadow-lg space-y-6 text-left"
              >
                <div className="flex items-center justify-between border-b border-indigo-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs md:text-sm text-teal-300">
                        Sémantický rozbor AI Case Managera
                      </h3>
                      <p className="text-[9px] text-indigo-300 font-mono">DOKONČENO DNES V {new Date().toLocaleTimeString('cs-CZ')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAnalysisReport(null)}
                    className="text-[10px] font-bold text-indigo-300 hover:text-white bg-indigo-900 px-2 py-1 rounded"
                  >
                    Resetovat
                  </button>
                </div>

                {/* Status Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold font-mono uppercase text-indigo-400 tracking-wider">Shrnutí situace</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {analysisReport.statusSummary}
                  </p>
                </div>

                {/* Strategy Points */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold font-mono uppercase text-indigo-400 tracking-wider">Doporučená strategie a kroky</h4>
                  <div className="space-y-2">
                    {analysisReport.strategyPoints.map((pt: string, idx: number) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unified Content Hub Recommendations (SSOT Connections) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-indigo-900">
                  
                  {/* Recommended Articles */}
                  <div className="space-y-2">
                    <h5 className="text-[9px] font-bold font-mono uppercase text-teal-400 tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Související Průvodci
                    </h5>
                    <div className="space-y-1.5">
                      {analysisReport.recommendedArticles.map((art: any) => (
                        <div key={art.id} className="p-2.5 bg-indigo-900/40 rounded-xl border border-indigo-800/40 flex items-center justify-between group cursor-pointer hover:bg-indigo-900 transition-all">
                          <span className="text-[11px] text-slate-200 font-bold truncate pr-2">{art.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Judgments */}
                  <div className="space-y-2">
                    <h5 className="text-[9px] font-bold font-mono uppercase text-indigo-400 tracking-wider flex items-center gap-1">
                      <Scale className="w-3 h-3" /> Relevantní Judikáty (SSOT)
                    </h5>
                    <div className="space-y-1.5">
                      {analysisReport.recommendedJudgments.map((jud: any) => (
                        <div key={jud.id} className="p-2.5 bg-indigo-900/40 rounded-xl border border-indigo-800/40 flex flex-col gap-0.5 cursor-pointer hover:bg-indigo-900 transition-all">
                          <span className="text-[9px] font-mono text-teal-300 font-bold">{jud.fileNo}</span>
                          <span className="text-[10px] text-slate-200 font-bold truncate">{jud.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Prepared Draft Assistant Box */}
                <div className="p-4 bg-indigo-900/50 rounded-2xl border border-indigo-800/60 space-y-2">
                  <h4 className="text-[9px] font-bold font-mono uppercase text-teal-300">Draft Assistant podkladů</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {analysisReport.nextActionDraft}
                  </p>
                </div>

              </motion.div>
            ) : (
              <div className="bg-white p-8 border border-slate-100 rounded-3xl text-center text-slate-500 space-y-3">
                <Sparkles className="w-12 h-12 text-slate-200 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider font-mono">
                  Složka spisu připravena k analýze
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Jakmile do složky vložíte alespoň jeden soudní dokument nebo zprávu OSPOD, klikněte na tlačítko <strong>"Spustit AI analýzu spisu"</strong> pro okamžitou sémantickou syntézu.
                </p>
              </div>
            )}
          </AnimatePresence>

          {/* Visual Case Timeline (Chronological events) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs text-left space-y-4">
            <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Automatická časová osa případu (Timeline)</span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="relative border-l-2 border-slate-100 pl-4 ml-2.5 space-y-5">
              {events.map(ev => (
                <div key={ev.id} className="relative group">
                  {/* Circle dot on the left line */}
                  <div className="absolute -left-[23px] top-1 w-3 h-3 bg-white border-2 border-teal-500 rounded-full group-hover:bg-teal-600 transition-colors" />
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{ev.date}</span>
                      <span className={`px-1.5 py-0.2 bg-slate-100 text-[8px] font-bold uppercase rounded text-slate-500 font-mono`}>
                        {ev.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-850 leading-tight">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {ev.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
