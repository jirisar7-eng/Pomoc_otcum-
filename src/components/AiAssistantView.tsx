/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageSquare, 
  AlertCircle, 
  Loader2, 
  HelpCircle,
  Clock,
  BookOpen,
  FileText,
  ShieldCheck,
  Scale,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  ChevronRight,
  ArrowRight,
  Zap,
  Info,
  CheckCircle2,
  FileSearch,
  MessageCircle,
  Download
} from 'lucide-react';
import { User } from '../types';

interface AiAssistantViewProps {
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const DEFAULT_AI_GUIDANCE_MARKDOWN = `
# Inteligentní AI Právní Asistent - Metodický Průvodce

Vítejte v oficiálním modulu **Inteligentního AI Asistenta** platformy *Táta má právo*. Tento modul využívá generativní AI model navržený a přizpůsobený pro české opatrovnické právo, judikaturu Ústavního soudu ČR a metodické pokyny MPSV pro orgány OSPOD.

## Hlavní oblasti využití AI Asistenta:

1. **Příprava na jednání s OSPOD:**
   - Jak věcně a klidně argumentovat zájmem dítěte.
   - Jak reagovat na jednostranné nebo neobjektivní zprávy opatrovníka.
   - Jak navrhnout konkrétní harmonogram střídavé či společné péče.

2. **Rozbor judikatury Ústavního soudu ČR:**
   - Citace klíčových nálezů o střídavé péči (např. *II. ÚS 132/24*, *I. ÚS 2482/13*, *IV. ÚS 805/14*).
   - Právo dítěte na péči obou rodičů a zachování sourozeneckých vazeb.

3. **Komunikační metoda BIFF:**
   - Přepis emočně vyostřených zpráv od druhé strany do věcné, stručné a bezpečné podoby (*Brief, Informative, Friendly, Firm*).
   - Ochrana před nařčením z agresivní či nekonstruktivní komunikace u soudu.

4. **Příprava podkladů a návrhů pro opatrovnický soud:**
   - Kontrola struktury návrhů na úpravu poměrů nezletilých.
   - Návrhy předběžných opatření při bezdůvodném bránění ve styku.

---
> ⚠️ **Právní upozornění:** Veškeré výstupy AI Asistenta mají informativní a doporučující charakter. Nenahrazují individuální právní služby advokáta ani oficiální rozhodnutí soudů.
`;

export default function AiAssistantView({
  setActiveTab,
  setSearchQuery,
  currentUser,
  onOpenAuth
}: AiAssistantViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'analysis' | 'docs'>('chat');
  
  // Dynamic Markdown loading & error state
  const [markdownDoc, setMarkdownDoc] = useState<string>('');
  const [isDocLoading, setIsDocLoading] = useState<boolean>(true);
  const [docError, setDocError] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Dobrý den! Jsem Synthesis AI, váš průvodce rodinným právem a opatrovnickým řízením v ČR. Pomohu vám zorientovat se v soudním procesu, v komunikaci s OSPOD či v základech dohod o střídavé péči.\n\nJaký dotaz vás dnes nejvíce pálí?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Analysis Mode State
  const [analysisText, setAnalysisText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    biffAnalysis?: string;
    biffRewritten?: string;
    courtWarning?: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Dynamic Markdown loading with try...catch and robust fallback
  useEffect(() => {
    let isMounted = true;

    async function loadDynamicContent() {
      try {
        setIsDocLoading(true);
        setDocError(null);

        const candidatePaths = [
          '/docs/categories/technologie-ai.md',
          '/docs/ai-assistant.md',
          '/docs/categories/ai-assistant.md'
        ];

        let fetchedText = '';
        for (const path of candidatePaths) {
          try {
            const res = await fetch(path);
            if (res.ok) {
              const text = await res.text();
              // Validate that response is text markdown and not index.html fallback
              if (text && !text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
                fetchedText = text;
                break;
              }
            }
          } catch {
            // ignore candidates that fail
          }
        }

        if (!fetchedText) {
          // If no markdown file was found on server, use our built-in fallback
          fetchedText = DEFAULT_AI_GUIDANCE_MARKDOWN;
        }

        if (isMounted) {
          setMarkdownDoc(fetchedText);
        }
      } catch (err: any) {
        console.warn("Chyba při načítání externího obsahu, aktivován záložní fallback:", err);
        if (isMounted) {
          setDocError("Externí soubor dokumentace se nepodařilo načíst. Zobrazeno výchozí rozhraní.");
          setMarkdownDoc(DEFAULT_AI_GUIDANCE_MARKDOWN);
        }
      } finally {
        if (isMounted) {
          setIsDocLoading(false);
        }
      }
    }

    loadDynamicContent();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeSubTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeSubTab]);

  const presetQuestions = [
    '📋 Jak se připravit na pohovor na OSPOD?',
    '⚖️ Jak napsat návrh na střídavou péči?',
    '💰 Jak se počítá výživné a reakce na nároky?',
    '🛡️ Jak čelit bezdůvodnému bránění ve styku?',
    '🔍 Jak analyzovat znalecký posudek z psychologie?'
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setChatError('');

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, message: textToSend })
      });

      let data: any = null;
      try {
        const rawText = await response.text();
        try {
          data = JSON.parse(rawText);
        } catch {
          data = {
            success: false,
            error: "Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu."
          };
        }
      } catch {
        data = {
          success: false,
          error: "Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu."
        };
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.error || 'Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu.');
      }

      const aiMsg: ChatMessage = {
        id: 'msg-' + Date.now() + '-ai',
        sender: 'ai',
        text: data.text || 'Omlouvám se, ale nepodařilo se mi zformovat smysluplnou odpověď.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || 'Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!analysisText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisError('');
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai-admin/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REWRITE_BIFF',
          params: { text: analysisText }
        })
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = { error: 'Chyba při zpracování analýzy.' };
      }

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Chyba při komunikaci s AI analýzou.');
      }

      setAnalysisResult({
        biffAnalysis: data.biffAnalysis || 'AI zanalyzovala váš text.',
        biffRewritten: data.biffRewritten || analysisText,
        courtWarning: data.courtWarning || 'Ujistěte se, že komunikace zůstává věcná.'
      });
    } catch (err: any) {
      setAnalysisError(err.message || 'Nepodařilo se dokončit AI analýzu.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: 'Konverzace byla vyčištěna. S čím vám mohu dále pomoci?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn" id="ai-assistant-page-container">
      
      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-900/60 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
            <span>Generativní Synthesis AI v7.0 Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white leading-tight">
            Inteligentní AI Asistent pro Opatrovnické Otázky
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Ptejte se umělé inteligence trénované na české legislativě (NOZ, o.s.ř.), judikatuře Ústavního soudu, metodikách OSPOD a pravidlech nekonfliktní komunikace BIFF.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 px-2.5 py-1 rounded-lg font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API Proxy: Připraveno
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Anonymní & Bezpečné dotazy
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <Scale className="w-4 h-4 text-indigo-400" />
              Judikatura ÚS ČR
            </span>
          </div>
        </div>
      </div>

      {/* Mode Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>💬 Právní Chat & Poradna</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analysis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'analysis'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span>📂 Analýza zpráv & BIFF Přepis</span>
        </button>

        <button
          onClick={() => setActiveSubTab('docs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'docs'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📘 Metodika & Dokumentace</span>
        </button>
      </div>

      {/* Display Fallback Notice if dynamic doc load had issue */}
      {docError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{docError}</span>
          </div>
          <button 
            onClick={() => setDocError(null)}
            className="text-amber-700 font-bold hover:underline cursor-pointer"
          >
            Rozumím
          </button>
        </div>
      )}

      {/* TAB 1: INTERACTIVE CHAT INTERFACE */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Chat Header Controls */}
          <div className="bg-slate-850 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base font-display flex items-center gap-1.5 text-white">
                  Synthesis AI Právní Poradce
                  <Sparkles className="w-4 h-4 text-teal-400 fill-teal-400" />
                </h3>
                <span className="text-[11px] text-teal-400 font-mono font-semibold block">
                  On-line | Česká legislativa & OSPOD praxe
                </span>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Vyčistit konverzaci"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vymazat chat</span>
            </button>
          </div>

          {/* Chat Message Thread */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60 max-h-[500px]" id="ai-chat-thread">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                  msg.sender === 'user'
                    ? 'bg-slate-850 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  <div className="mt-2 pt-1 border-t border-slate-100/20 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono">{msg.timestamp}</span>

                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-teal-600 flex items-center gap-1 cursor-pointer font-bold"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Zkopírováno</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Kopírovat</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 text-xs sm:text-sm text-slate-500 flex items-center gap-3 shadow-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                  <span>Synthesis AI prohledává legislativu a judikaturu...</span>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {chatError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Chyba komunikace s AI</span>
                  <p>{chatError}</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Preset Questions & Input Controls */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-4">
            
            {/* Quick Presets */}
            {!isLoading && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> Rychlé opatrovnické dotazy:
                </span>
                <div className="flex flex-wrap gap-2">
                  {presetQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-xs text-slate-700 hover:text-teal-900 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 px-3 py-1.5 rounded-xl text-left transition-all cursor-pointer font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                placeholder="Položte váš opatrovnický dotaz (např. Jak argumentovat pro střídavou péči u dětí školního věku?)..."
                className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-2xl outline-none transition-all disabled:opacity-50 font-sans"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-5 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Odeslat</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-[10px] text-slate-400 leading-tight">
              ⚠️ <strong>Upozornění:</strong> Odpovědi AI slouží výhradně pro orientační účely a nenahrazují kvalifikované právní poradenství advokáta.
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ANALYSIS & BIFF REWRITE */}
      {activeSubTab === 'analysis' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-indigo-600" />
              AI Analýza zpráv & Komunikační přepis (BIFF)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Vložte zprávu od druhé strany nebo váš koncept e-mailu. AI zanalyzuje skrytá právní rizika a navrhne přepis dle metodiky BIFF (<em>Brief, Informative, Friendly, Firm</em>) bezpečného pro předložení u soudu.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Vložte text k analýze:
            </label>
            <textarea
              rows={5}
              value={analysisText}
              onChange={(e) => setAnalysisText(e.target.value)}
              placeholder="Vložte text e-mailu, SMS zprávy nebo konceptu vyjádření..."
              className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-sans"
            />
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !analysisText.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI provádí rozbor a přepis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Spustit BIFF Analýzu a přepis</span>
                </>
              )}
            </button>
          </div>

          {analysisError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-amber-900 block flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Právní rizika pův. zprávy:
                </span>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {analysisResult.courtWarning}
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-indigo-900 block">
                  💡 Rozbor komunikace:
                </span>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  {analysisResult.biffAnalysis}
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Navržený BIFF Přepis:
                  </span>
                  <button
                    onClick={() => handleCopyText('biff-res', analysisResult.biffRewritten || '')}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'biff-res' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Zkopírováno!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopírovat přepis</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {analysisResult.biffRewritten}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DOCUMENTATION & METHODOLOGY (Markdown with try/catch) */}
      {activeSubTab === 'docs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900">
                  Metodická Dokumentace AI Asistenta
                </h2>
                <span className="text-xs text-slate-500">
                  Načtený odborný soubor s doporučenými postupy
                </span>
              </div>
            </div>
          </div>

          {isDocLoading ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="text-xs font-semibold">Načítání metodické dokumentace...</span>
            </div>
          ) : (
            <div className="markdown-body prose max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed">
              <ReactMarkdown>{markdownDoc}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {/* Interconnection with Related Portal Modules */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-600" />
            Související AI nástroje a opatrovnické sekce
          </h3>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Rychlé propojení v rámci portálu
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <button
            onClick={() => setActiveTab('ai-guide')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
              AI Průvodce řízením
            </h4>
            <p className="text-xs text-slate-500 leading-snug">
              Interaktivní analýza vašeho konkrétního soudního kroku a doporučení.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('ai-case-manager')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">
              Osobní složka případu (Spis)
            </h4>
            <p className="text-xs text-slate-500 leading-snug">
              Správa důkazů, zpráv OSPOD a automatický rozbor spisu.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('judikatura')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Scale className="w-4.5 h-4.5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-purple-700 transition-colors">
              Judikatura Ústavního soudu
            </h4>
            <p className="text-xs text-slate-500 leading-snug">
              Prohledávatelná databáze zlomových nálezů o střídavé péči.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('ke-stazeni')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Download className="w-4.5 h-4.5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
              Vzory podání ke stažení
            </h4>
            <p className="text-xs text-slate-500 leading-snug">
              Prověřené vzory návrhů na péči, odvolání a předběžná opatření.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('vyzivne')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Scale className="w-4.5 h-4.5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
              Kalkulačka výživného
            </h4>
            <p className="text-xs text-slate-500 leading-snug">
              Výpočet orientační výše výživného dle doporučujících tabulek MS ČR.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('forum')}
            className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <MessageCircle className="w-4.5 h-4.5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
              Komunitní Fórum
            </h4>
            <p className="text-xs text-slate-500 leading-snug">
              Ptejte se ostřílených otců, sdílejte zkušenosti a osvědčené rady.
            </p>
          </button>

        </div>
      </div>

    </div>
  );
}
