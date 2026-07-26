/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AIAdminClient } from '../lib/ai-admin/client';
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
  Download,
  BookMarked,
  ExternalLink,
  UploadCloud,
  Terminal,
  Layers,
  FileCode,
  FolderPlus,
  Compass
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
# Jak pracovat s Gemini a Gemini Notebookem (NotebookLM)

Tento metodický návod poskytuje otcům a rodičům v opatrovnických sporech praktický postup krok za krokem, jak efektivně využívat rozhraní **Google Gemini** a **NotebookLM (Gemini Notebook)** pro zpracování soudních spisů, protokolu PČR, zpráv OSPOD a přípravu neprůstřelných právních podkladů.

---

## 1. Nahraní dokumentů a opatrovnického spisu do AI

### Postup pro Google Gemini / Gemini Advanced:
1. **Příprava dokumentů:** Převeďte skeny, protokoly, zprávy OSPOD nebo e-maily do formátu PDF nebo TXT/DOCX.
2. **Přiložení k dotazu:** V rozhraní Gemini klikněte na tlačítko **+ (Přidat soubor)** nebo přetáhněte soubor přímo do okna chatu.
3. **Anonymizace dat:** Před nahraním doporučujeme nahradit celá jména dětí a rodná čísla iniciálami (např. *nezletilý A.B.*).

### Postup pro NotebookLM (Gemini Notebook):
1. Navštivte [NotebookLM (notebooklm.google.com)](https://notebooklm.google.com/) a vytvořte nový zápisník s názvem vašemu spisu (např. *Opatrovnický spis - Péče o děti*).
2. **Nahrání zdrojů:** Do levého panelu nahrajte všechny dostupné dokumenty:
   - Zprávy OSPOD a protokoly z jednání.
   - Posudky znalců a lékařské zprávy.
   - Časové osy e-mailové a SMS komunikace.
3. **Automatická syntéza:** NotebookLM automaticky prostuduje všechny nahrané zdroje a vytvoří přehledný průvodce s citacemi přímo ze spisu.

---

## 2. Správná formulace promptů (dotazů)

Při formulaci dotazů se držte struktury **Role - Kontext - Úkol - Formát**:

* **Příklad pro střídavou péči:**
  > *"Jsi expertní právní poradce pro rodinné právo v ČR. Na základě nahraných dokumentů vytvoř přehlednou tabulku argumentů, které prokazují mou stabilní rodičovskou způsobilost pro střídavou péči podle nálezů Ústavního soudu ČR."*

* **Příklad pro vyvrácení neobjektivní zprávy OSPOD:**
  > *"Prostuduj nahranou zprávu OSPOD ze dne XX.YY.202X. Najdi v ní všechna tvrzení, která nejsou podložena konkrétními důkazy ve spise, a navrhni věcnou reakci v duchu metodiky MPSV."*

* **Příklad pro úpravu výživného:**
  > *"Porovnej mé reálné příjmy a rozsah péče s doporučujícími tabulkami Ministerstva spravedlnosti ČR a navrhni férovou výši výživného při rovnocenné střídavé péči."*

---

## 3. Ověřování výstupů a práca s citacemi

1. **Vždy požadujte citace zdrojů:** V NotebookLM má každé tvrzení AI přímé číslo citace, na které můžete kliknout a ověřit si přesný odstavec ve vašem spise.
2. **Křížová kontrola paragrafů a judikátů:** Ověřte, že citované nálezy Ústavního soudu (např. *II. ÚS 132/24*, *I. ÚS 2482/13*) odpovídají vašemu případu.
3. **Kombinace s metodou BIFF:** Při e-mailové komunikaci vyžadujte, aby AI přepsala vaši odpověď podle pravidel *Brief, Informative, Friendly, Firm* pro zamezení emočním střetům.

---

## 4. Rychlé kopírovatelné prompty

Níže v tomto rozhraní naleznete sekci **"Praktické šablony promptů"**. Kliknutím na tlačítko **Kopírovat prompt** můžete zkopírovat okamžitě připravené instrukce pro váš model Gemini.
`;

interface PromptTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  promptText: string;
  badge: string;
}

const GEMINI_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'p-1',
    category: 'spis',
    title: '1. Vytvoření chronologické časové osy spisu',
    badge: 'Chronologie & Spis',
    description: 'Vyhledá v nahraných dokumentech všechny události bránění ve styku, vyjádření OSPOD a soudní rozhodnutí.',
    promptText: `Jsi zkušený právní analytik rodinného práva v ČR. Na základě všech nahraných dokumentů ze spisu vytvoř přehlednou chronologickou tabulku událostí. U každého záznamu uveď:
1) Přesné datum
2) Popis incidentu / události (např. předání dítěte, zpráva OSPOD, podání návrhu)
3) Číslo listu / Název dokumentu a stranu
4) Zda byl o události informován OSPOD nebo PČR
5) Krátké právní zhodnocení (např. porušení předběžného opatření / bránění ve styku)`
  },
  {
    id: 'p-2',
    category: 'ospod',
    title: '2. Analýza zpráv OSPOD a vyhledání rozporů',
    badge: 'OSPOD Audit',
    description: 'Porovná zprávy OSPOD v čase a odhalí nepodložená tvrzení, chybná doporučení nebo opomenutí faktů.',
    promptText: `Prostuduj nahrané zprávy OSPOD z mého opatrovnického spisu a proveď jejich odborný rozbor:
1) Vyhledej vnitřní rozpory mezi jednotlivými zprávami OSPOD v průběhu času.
2) Identifikuj tvrzení OSPOD, která nejsou podložena žádným konkrétním důkazem ve spise.
3) Zjisti, zda OSPOD zohlednil mé návrhy na rozšíření péče a zda dodržel metodické pokyny MPSV pro rovnoprávný přístup k oběma rodičům.
4) Připrav věcné body pro mé písemné vyjádření soudu.`
  },
  {
    id: 'p-3',
    category: 'jednani',
    title: '3. Příprava na opatrovnické jednání a výslek',
    badge: 'Soudní Jednání',
    description: 'Simuluje otázky soudce nebo OSPOD u jednání a navrhuje argumentačně neprůstřelné odpovědi.',
    promptText: `Připrav se se mnou na opatrovnické jednání o úpravě péče k nezletilému dítěti. Na základě nahraných dokumentů:
1) Sestav 10 nejčastějších nebo nejzákeřnějších otázek, které mi může položit soudce nebo opatrovník.
2) Ke každé otázce navrhni klidnou, věcnou a argumentačně přesvědčivou odpověď zdůrazňující nejlepší zájem dítěte.
3) Přidej odkaz na relevantní nálezy Ústavního soudu ČR (např. II. ÚS 132/24, I. ÚS 2482/13).
4) Doporuč, jak reagovat, pokud druhá strana vznese nepravdivá obvinění.`
  },
  {
    id: 'p-4',
    category: 'biff',
    title: '4. BIFF Přepis vyostřené SMS / e-mailu',
    badge: 'BIFF Komunikace',
    description: 'Přetvoří emočně nabitou či útočnou komunikaci na věcnou, stručnou a u soudu neprůstřelnou.',
    promptText: `Převeď následující text do metodiky BIFF (Brief, Informative, Friendly, Firm):
- Odstraň veškeré osobní útoky, ironii, emoce a retrospektivní výčitky.
- Ponech pouze věcná fakta týkající se předání dítěte, zdravotního stavu nebo školních povinností.
- Zachovej zdvořilý, ale pevný tón (Firm), který jasně vymezuje hranice.

Text k přepisu:
[VLOŽTE ZPRÁVU OD DRUHÉ STRANY NEBO VÁŠ KONCEPT]`
  },
  {
    id: 'p-5',
    category: 'posudek',
    title: '5. Rozbor znaleckého posudku z psychologie',
    badge: 'Znalecký Posudek',
    description: 'Prověří použité psychodiagnostické testy, rovnoprávnost posouzení rodičů a logickou provázanost závěrů.',
    promptText: `Proveď kritický rozbor nahraného znaleckého posudku z oboru dětské psychologie / psychiatrie:
1) Zkontroluj, zda znalec použil standardizované psychodiagnostické metody a zda posuzoval oba rodiče ve stejném rozsahu.
2) Identifikuj případné logické skoky mezi zjištěnými poznatky a konečným doporučením znalce.
3) Prověř, zda závěry znalce neodporují judikatuře Ústavního soudu o presumpci střídavé péče.
4) Připrav konkrétní otázky pro výslech znalce u opatrovnického soudu.`
  },
  {
    id: 'p-6',
    category: 'vyzivne',
    title: '6. Výpočet a argumentace k výživnému',
    badge: 'Výživné & Náklady',
    description: 'Porovná příjmové možnosti, odůvodněné potřeby dítěte a doporučující tabulky Ministerstva spravedlnosti ČR.',
    promptText: `Na základě nahraných podkladů o příjmech a nákladech obou rodičů:
1) Spočítej orientační výši výživného podle doporučujících tabulek Ministerstva spravedlnosti ČR.
2) Zohledni rozsah osobní péče každého z rodičů (počet dnů/nocí v měsíci) a přímé úhrady kroužků či potřeb.
3) Navrhni argumentaci pro soud, proč je navržená výše výživného spravedlivá a odpovídající životní úrovni obou rodičů.`
  }
];

export default function AiAssistantView({
  setActiveTab,
  setSearchQuery,
  currentUser,
  onOpenAuth
}: AiAssistantViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'notebook' | 'analysis' | 'docs'>('chat');
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('all');
  const [promptFilterText, setPromptFilterText] = useState<string>('');
  
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
          '/docs/categories/19-technologie-ai.md',
          '/docs/categories/technologie-ai.md',
          '/docs/categories/README.md',
          '/docs/ai-assistant.md',
          '/docs/categories/ai-assistant.md'
        ];

        let fetchedText = '';
        for (const path of candidatePaths) {
          try {
            const res = await fetch(path);
            const contentType = res.headers.get('content-type') || '';
            if (res.ok && !contentType.toLowerCase().includes('text/html')) {
              const text = await res.text();
              const trimmed = text.trim();
              const isHtml = /^<!doctype/i.test(trimmed) || 
                             /^<html/i.test(trimmed) || 
                             /^<head/i.test(trimmed) ||
                             trimmed.includes('<script') ||
                             trimmed.includes('id="root"');
              if (trimmed && !isHtml) {
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
      const replyText = await AIAdminClient.queryGemini(textToSend);
      const aiMsg: ChatMessage = {
        id: 'msg-' + Date.now() + '-ai',
        sender: 'ai',
        text: replyText || 'Omlouvám se, ale nepodařilo se mi zformovat smysluplnou odpověď.',
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
      const res = await AIAdminClient.execute('REWRITE_BIFF', { text: analysisText });
      if (!res.success) {
        throw new Error(res.error || 'Chyba při komunikaci s AI analýzou.');
      }

      const data = res.data || {};
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
          onClick={() => setActiveSubTab('notebook')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'notebook'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookMarked className="w-4 h-4 text-amber-400" />
          <span>📚 Návod pro Gemini & NotebookLM</span>
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

      {/* TAB 2: GEMINI & NOTEBOOKLM GUIDE & PROMPT LIBRARY */}
      {activeSubTab === 'notebook' && (
        <div className="space-y-8 animate-fadeIn" id="gemini-notebook-guide">
          
          {/* Hero Banner for NotebookLM */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-indigo-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 bg-indigo-900/80 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <BookMarked className="w-4 h-4 text-amber-400" />
                  <span>Google Gemini & NotebookLM Metodika</span>
                </div>

                <a
                  href="https://notebooklm.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Otevřít Google NotebookLM</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-white leading-tight">
                Jak analyzovat opatrovnický spis pomocí Gemini a NotebookLM
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl font-sans">
                <strong>NotebookLM (Google Gemini Notebook)</strong> je specializovaný nástroj umělé inteligence od Google, který dokáže pracovat s vašimi vlastními dokumenty (až 50 rozsáhlých PDF spisu, zpráv OSPOD, protokoly z jednání, e-maily). Na rozdíl od běžných chatů čerpá výhradně z vašich nahraných podkladů a nabízí přesné citace přímo ze stránek spisu.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Nulové halucinace (uzavřený zdroj)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Přímé citace listů spisu</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Kapacita až 50 dokumentů v projektu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Practical Guide Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              Návod krok za krokem: Od spisu k neprůstřelné argumentaci
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold font-mono text-base">
                  01
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-indigo-600" />
                  Nahrání dokumentů
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Exportujte vaše opatrovnické dokumenty do čitelných souborů PDF nebo DOCX. Načtěte je do vytvořeného projektu v <a href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline">NotebookLM</a>.
                </p>
                <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Soudní spisy, usnesení a protokoly</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Zprávy OSPOD a psychologické posudky</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Exportovaná e-mailová komunikace</span>
                  </li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center font-bold font-mono text-base">
                  02
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-teal-600" />
                  Formulace promptů
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zadejte strukturovaný dotaz s jasným vymezením role AI a požadovaného formátu výstupu. Využijte naši připravenou šablonovací knihovnu níže.
                </p>
                <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Role: "Jsi opatrovnický advokát ČR"</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Požadujte chronologii v tabulce</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Vyžádejte si seznam rozporů a opomenutí</span>
                  </li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold font-mono text-base">
                  03
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Ověření citací a paragrafů
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kliknutím na odkazovací číslo v odpovědi NotebookLM ověřte konkrétní stranu a odstavec nahraného PDF spisu.
                </p>
                <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Ověřte číselný údaj či citát v PDF</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dopňte odkaz na judikaturu ÚS ČR</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Předložte výstup svému advokátovi</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Interactive Prompt Templates Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-teal-600" />
                  Knihovna ověřených promptů pro otce
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kopírujte šablony dotazů jedním kliknutím a vkládejte je přímo do Gemini, NotebookLM nebo vyzkoušejte v našem Chatu.
                </p>
              </div>

              {/* Text filter for prompts */}
              <div className="w-full md:w-72">
                <input
                  type="text"
                  value={promptFilterText}
                  onChange={(e) => setPromptFilterText(e.target.value)}
                  placeholder="Hledat v šablonách (např. OSPOD, výživné)..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl outline-none font-sans"
                />
              </div>
            </div>

            {/* Prompt Category Filter Badges */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPromptCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPromptCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Všechny šablony ({GEMINI_PROMPT_TEMPLATES.length})
              </button>
              <button
                onClick={() => setSelectedPromptCategory('spis')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPromptCategory === 'spis'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Chronologie & Spis
              </button>
              <button
                onClick={() => setSelectedPromptCategory('ospod')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPromptCategory === 'ospod'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                OSPOD Audit
              </button>
              <button
                onClick={() => setSelectedPromptCategory('jednani')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPromptCategory === 'jednani'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Soudní Jednání
              </button>
              <button
                onClick={() => setSelectedPromptCategory('biff')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPromptCategory === 'biff'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                BIFF Přepis
              </button>
              <button
                onClick={() => setSelectedPromptCategory('posudek')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPromptCategory === 'posudek'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Znalecký Posudek
              </button>
              <button
                onClick={() => setSelectedPromptCategory('vyzivne')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPromptCategory === 'vyzivne'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Výživné & Náklady
              </button>
            </div>

            {/* Prompt Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {GEMINI_PROMPT_TEMPLATES
                .filter(p => selectedPromptCategory === 'all' || p.category === selectedPromptCategory)
                .filter(p => 
                  !promptFilterText.trim() || 
                  p.title.toLowerCase().includes(promptFilterText.toLowerCase()) ||
                  p.description.toLowerCase().includes(promptFilterText.toLowerCase()) ||
                  p.promptText.toLowerCase().includes(promptFilterText.toLowerCase())
                )
                .map((template) => (
                  <div
                    key={template.id}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:border-teal-300 hover:bg-white transition-all space-y-4 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                          {template.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {template.id}</span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 font-display">
                        {template.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {template.description}
                      </p>

                      {/* Code syntax box */}
                      <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono leading-relaxed whitespace-pre-wrap border border-slate-800 max-h-52 overflow-y-auto font-normal">
                        {template.promptText}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => handleCopyText(template.id, template.promptText)}
                        className="flex-1 min-w-[140px] px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                      >
                        {copiedId === template.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-600">Zkopírováno!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-600" />
                            <span>Kopírovat prompt</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setInputText(template.promptText);
                          setActiveSubTab('chat');
                        }}
                        className="flex-1 min-w-[140px] px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                        title="Vložit prompt do live AI chatu"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Vyzkoušet v AI Chatu</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

          </div>

          {/* Guidelines & Safety Box */}
          <div className="bg-amber-50/80 border border-amber-200 p-6 rounded-3xl space-y-3">
            <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2 font-display">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              Zásady bezpečné práce a anonymizace podkladů v AI
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-900/90 leading-relaxed">
              <div className="space-y-1">
                <strong className="block text-amber-950">🔒 Anonymizace osobních dat:</strong>
                Před nahráváním souborů do jakéhokoliv cloudového nástroje doporučujeme nahradit rodná čísla, přesné adresy a celá jména zobecňujícími pojmy (např. <em>Otec, Matka, Nezletilý syn A.</em>).
              </div>
              <div className="space-y-1">
                <strong className="block text-amber-950">⚖️ Kontrola paragrafů a výstupů:</strong>
                AI slouží jako rychlá analytická pomůcka a rešeršní asistent. Konečné znění návrhu na opatrovnický soud nebo odvolání vždy konzultujte s advokátem.
              </div>
            </div>
          </div>

        </div>
      )}
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
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-3xs">
              <MarkdownRenderer content={markdownDoc} activeTab="ai-assistant" />
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
