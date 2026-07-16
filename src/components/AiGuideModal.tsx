/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  Copy, 
  Check, 
  BookOpen, 
  CheckCircle, 
  Layers, 
  HelpCircle,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GlossaryTerm from './GlossaryTerm';

interface AiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  promptText: string;
}

const SAMPLE_PROMPTS: PromptTemplate[] = [
  {
    id: 'ospod-reaction',
    title: 'Reakce na zprávu OSPOD (Vyvrácení lží a stereotypů)',
    description: 'Použijte tento prompt, pokud OSPOD předložil soudu lživou, neobjektivní zprávu nebo zprávu zatíženou mateřským stereotypem (např. odmítání přespávání u otce kvůli útlému věku).',
    promptText: `Jsi špičkový opatrovnický právník a specialista na vývojovou dětskou psychologii. Pomoz mi sestavit věcné, právně a odborně precizní vyjádření pro soud k poslední zprávě kolizního opatrovníka OSPOD.

Mým cílem je věcně vyvrátit tvrzení OSPOD a poukázat na jejich rozpor s moderním vědeckým poznáním o vývoji dětí a judikaturou Ústavního soudu ČR.

Zde jsou klíčové podklady pro tvou analýzu:
1. Zpráva OSPOD tvrdí: [Zde stručně popište, co lživého nebo zaujatého OSPOD tvrdí - např. "Dítě je příliš malé a fixované na matku, střídavá péče a přespávání u otce by ho traumatizovalo."]
2. Moje reálná dosavadní péče a fakta: [Zde popište pravdu - např. "O dítě běžně pečuji od narození, krmím ho, uspávám, přebaluji, máme skvělý vztah, na noc ho matka odmítá dát jen ze své svévole."]

Při formulaci mého vyjádření pro soud postupuj podle těchto pravidel:
- Zvol tón, který je klidný, věcný, strohý, bez jakýchkoliv emocí, urážek matky nebo OSPOD. Musím působit jako zralý, stabilní a spolupracující rodič.
- Odkázej se na mezinárodní konsenzuální studii prof. Richarda A. Warshaka (2014) o noční péči otců a na studii prof. Williama Fabriciuse (2016) o "Dose-Response" efektu (že kvalita vztahu k otci lineárně roste s počtem nocí strávených u něj v dětství).
- Argumentuj "nejlepším zájmem dítěte" a právem dítěte na péči obou rodičů podle judikatury Ústavního soudu ČR (např. nález sp. zn. I. ÚS 1506/13 nebo I. ÚS 3216/22).
- Strukturuj text přehledně do odstavců s jasnými nadpisy.

Navrhni mi nejprve osnovu a po mém schválení vypracujeme plný text vyjádření.`
  },
  {
    id: 'child-interest-arguments',
    title: 'Argumentace nejlepším zájmem dítěte a vazbou k otci',
    description: 'Použijte tento prompt k vytvoření uceleného argumentačního bloku pro váš návrh na střídavou péči, zaměřeného na důležitost noční péče a citovou vazbu.',
    promptText: `Jsi specialista na rodinné právo a dětskou vývojovou psychologii. Pomoz mi vypracovat argumentační část mého návrhu na střídavou péči (případně vyjádření k soudu), která se zaměřuje na citovou vazbu (attachment) mého dítěte ke mně (otci) a na nezbytnost přespávání.

Vycházej z těchto mých faktů:
- Jméno a věk dítěte: [Doplňte jméno a věk - např. "Tomáš, 18 měsíců"]
- Moje zapojení do péče: [Doplňte vaše rituály - např. "Krmení, koupání, ukládání ke spánku, běžná denní péče od narození."]
- Překážky ze strany matky: [Doplňte, jak matka brání - např. "Matka odmítá přespávání s tím, že Tomášek potřebuje v noci výhradně matku a kojí se (i když již jí normální stravu)."]

Vygeneruj text vyjádření, který:
1. Vyvrací mýtus "monotropie" (že malé dítě potřebuje na noc pouze matku) s odkazem na moderní psychologii (Warshak 2014).
2. Vysvětluje, že večerní a ranní rituály (koupání, uspávání, ranní probuzení) jsou naprosto klíčové pro budování bezpečné citové vazby k otci a nelze je nahradit pouhým odpoledním "stykem na pár hodin".
3. Používá věcnou, kultivovanou právnickou češtinu přizpůsobenou českému opatrovnickému soudnictví.
4. Je naprosto prostý útoků na matku. Zaměřuje se čistě na právo dítěte a jeho vývojové potřeby.

Napiš mi rovnou návrh textu, který budu moci vložit jako samostatný argumentační bod do mého návrhu k soudu.`
  },
  {
    id: 'timeline-generator',
    title: 'Strukturování časové osy incidentů (Maření styku)',
    description: 'Pomůže vám proměnit vaše chaotické e-maily, SMS zprávy a deníkové zápisy do chladné, strukturované a neprůstřelné tabulky incidentů maření styku pro soudce.',
    promptText: `Jsi precizní právní analytik. Mám k dispozici neuspořádané záznamy (SMS zprávy, maily, poznámky z kalendáře) o tom, jak mi matka mařila styk s naším dítětem nebo porušovala naše dohody.

Potřebuji tyto chaotické podklady přetransformovat do vysoce přehledné, chronologické tabulky incidentů, kterou předložím soudu jako důkaz o maření výkonu rozhodnutí (nebo jako důkaz o nedostatku výchovné tolerance matky).

Zde jsou mé surové poznámky:
[SEM VLOŽTE NEBO NAKOPÍRUJTE SVÉ POZNÁMKY, SMS, E-MAILY NEBO DENÍKOVÉ ZÁPISY S DATY]

Převeď tyto poznámky do strukturované podoby podle následujících pravidel:
1. Vytvoř tabulku se sloupci: 
   - "Datum a čas"
   - "Popis incidentu (Co se stalo, jaká byla dohoda/rozhodnutí)"
   - "Reakce matky (Důvod odmítnutí, vyjádření)"
   - "Důkaz (Co k tomu mám - např. SMS, výpis volání, zpráva OSPODu, svědectví)"
2. Tón musí být přísně objektivní, faktický a chladný. Odstraň jakékoliv moje emotivní komentáře a ponech pouze čistá fakta.
3. Pokud matka mařila styk opakovaně, přidej na konec krátké shrnutí (např. "Z celkového počtu 10 plánovaných styků v období X až Y jich matka bezdůvodně zmařila 6, tj. 60 %.").

Vygeneruj tuto tabulku a dbej na maximální přesnost dat a časů.`
  }
];

export default function AiGuideModal({ isOpen, onClose }: AiGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'prompts'>('guide');
  const [selectedPromptId, setSelectedPromptId] = useState<string>('ospod-reaction');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const selectedPrompt = SAMPLE_PROMPTS.find(p => p.id === selectedPromptId) || SAMPLE_PROMPTS[0];

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  // Close on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Card Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-left font-sans"
              id="ai-guide-modal-container"
            >
              {/* Header */}
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base font-display">Digitální asistence: Jak využít AI k přípravě na soud</h3>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Synthesis OS • NotebookLM & Gemini Guide</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-navigation tabs */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 flex shrink-0">
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`py-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === 'guide'
                      ? 'border-teal-500 text-teal-800'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  1. Tátovský návod & pravidla
                </button>
                <button
                  onClick={() => setActiveTab('prompts')}
                  className={`py-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'prompts'
                      ? 'border-teal-500 text-teal-800'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  2. Vzorové prompty pro NotebookLM
                  <span className="text-[9px] bg-teal-100 text-teal-800 font-mono px-1.5 py-0.5 rounded-full">Kopírovat</span>
                </button>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                
                {/* TAB 1: GUIDE */}
                {activeTab === 'guide' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                  >
                    {/* Intro Hero banner */}
                    <div className="bg-gradient-to-br from-teal-50 to-emerald-50/30 border border-teal-100/60 rounded-2xl p-6 shadow-3xs">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Většina otců v opatrovnickém sporu selhává kvůli emocím, nepřehlednosti v důkazech nebo procesním chybám. Tento návod ti ukáže, jak používat <strong>NotebookLM</strong> nebo jiné pokročilé jazykové modely (Gemini) jako svůj osobní právní „mozek“, který ti pomůže utřídit myšlenky a připravit argumenty, které mají u soudu skutečnou váhu.
                      </p>
                    </div>

                    {/* Rules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Rule 1 */}
                      <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-3xs space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                            1
                          </div>
                          <h4 className="font-bold text-xs text-slate-800 font-display">
                            Zlaté pravidlo: Ty jsi šéf, AI je praktikant
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                          NotebookLM je neuvěřitelně výkonný nástroj, ale je to <strong>jazykový model, nikoliv právník</strong>. Může se mýlit, může si vyložit text opačně nebo si vytvořit vlastní závěry, které neodpovídají realitě.
                        </p>
                        <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-100/50 text-[10px] text-rose-800 space-y-1">
                          <p className="font-semibold">• Nikdy neodesílej nic, co jsi sám nečetl a neschválil.</p>
                          <p>• <strong>Vše ověřuj:</strong> Pokud ti AI napíše „zákon říká to a to“, vždy si ten zákon vyhledej (např. na zakonyprolidi.cz) a zkontroluj to.</p>
                        </div>
                      </div>

                      {/* Rule 2 */}
                      <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-3xs space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                            2
                          </div>
                          <h4 className="font-bold text-xs text-slate-800 font-display">
                            Jak psát prompty (zadání) pro přesnost
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                          Chyby vznikají, když je zadání vágní. Buď konkrétní. Definuj roli, kontext, podklady i požadovaný styl dokumentu.
                        </p>
                        <div className="space-y-1.5 text-[10px] pt-1">
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/40 text-slate-500">
                            <span className="font-bold text-rose-600">Špatně:</span> „Napiš mi žádost o střídavou péči.“
                          </div>
                          <div className="bg-teal-50/50 p-2 rounded-lg border border-teal-100/50 text-teal-900">
                            <span className="font-bold text-teal-700">Správně:</span> „Jsi zkušený opatrovnický právník. Napiš vyjádření k soudu na základě přiložené zprávy <GlossaryTerm termId="ospod">OSPOD</GlossaryTerm>. Použij mezinárodní konsenzus o střídavé péči. Buď věcný a bez emocí.“
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Step-by-Step Workflow */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-3xs space-y-4">
                      <h4 className="text-xs font-bold font-display text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Layers className="w-4 h-4 text-teal-600" />
                        Workflow pro nulovou chybovost (Tvůj „tátovský postup“)
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                        
                        <div className="space-y-2 relative">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-[10px]">1</span>
                            <h5 className="font-bold text-slate-800">Vložení podkladů</h5>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Nahraj do NotebookLM pouze relevantní a ověřené dokumenty (rozhodnutí soudu, lživou zprávu z <GlossaryTerm termId="ospod">OSPOD</GlossaryTerm>, tvoje strukturované poznámky, vědecké studie z našeho portálu).
                          </p>
                        </div>

                        <div className="space-y-2 relative">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-[10px]">2</span>
                            <h5 className="font-bold text-slate-800">Iterativní tvorba</h5>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Nechtěj dokonalý výsledek na první pokus. Postupuj v krocích. Nejdřív chtěj osnovu, tu zkontroluj a uprav, pak chtěj první draft, ten vybrušuj.
                          </p>
                        </div>

                        <div className="space-y-2 relative">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-[10px]">3</span>
                            <h5 className="font-bold text-slate-800">Pravidlo 3 „NE“</h5>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            <strong>Nekolísá</strong> (neodporuje si dokument se zdroji?), <strong>Neklamá</strong> (nejsou v textu vymyšlené zákony?), <strong>Nechybuje</strong> (není tón agresivní?).
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Warning Box */}
                    <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-5 shadow-3xs flex gap-3.5 items-start">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-amber-900 font-display">Jak poznat, že AI „halucinuje“</h4>
                        <p className="text-[11px] text-amber-800 leading-relaxed font-sans">
                          AI si občas může „domyslet“ fakta, která v podkladech nejsou (např. vymyslet si datum setkání, které neproběhlo, nebo si splést jména dětí). Pokud vidíš v textu něco, co si nepamatuješ, nebo co je v přímém rozporu se skutečností, <strong>ihned to smaž</strong>. 
                        </p>
                        <p className="text-[10px] text-amber-700 font-medium pt-1">
                          💡 <strong>Taktický tip:</strong> NotebookLM má u každého odstavce funkci „citace“ (klikací indexová čísla). Vždy na ně klikni, abys viděl, ze kterého tvého nahraného dokumentu AI informaci čerpala. Pokud citace nesedí nebo chybí, informace je smyšlená.
                        </p>
                      </div>
                    </div>

                    {/* Final CTA */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setActiveTab('prompts')}
                        className="px-4.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer group"
                      >
                        Přejít na vzorové prompty
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </motion.div>
                )}

                {/* TAB 2: PROMPTS */}
                {activeTab === 'prompts' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    
                    {/* Prompt Left Menu */}
                    <div className="lg:col-span-4 space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono block pl-1">Vyberte si šablonu promptu:</span>
                      
                      {SAMPLE_PROMPTS.map((prompt) => {
                        const isSelected = selectedPromptId === prompt.id;
                        return (
                          <button
                            key={prompt.id}
                            onClick={() => setSelectedPromptId(prompt.id)}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                              isSelected
                                ? 'bg-teal-50/50 border-teal-200 text-teal-900 shadow-3xs'
                                : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="font-bold text-xs font-display leading-snug">
                              {prompt.title}
                            </span>
                            <span className={`text-[10px] line-clamp-2 ${isSelected ? 'text-teal-700/85' : 'text-slate-400'}`}>
                              {prompt.description}
                            </span>
                          </button>
                        );
                      })}

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2 mt-4">
                        <h5 className="font-bold text-[10px] text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                          Jak to použít?
                        </h5>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                          Klikněte na libovolnou šablonu promptu, vpravo si ji přizpůsobte (doplňte vaše údaje v hranatých závorkách) a zkopírujte ji přímo do NotebookLM nebo Gemini k vašim nahraným souborům.
                        </p>
                      </div>
                    </div>

                    {/* Prompt Right Editor Preview */}
                    <div className="lg:col-span-8 bg-slate-50 rounded-2xl border border-slate-200/60 p-5 flex flex-col h-full space-y-4">
                      
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-3xs">
                        <div>
                          <span className="text-[8px] bg-teal-100 text-teal-800 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono">
                            Zadání (Prompt) pro AI
                          </span>
                          <h4 className="font-bold text-xs text-slate-800 mt-1">
                            {selectedPrompt.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => handleCopyPrompt(selectedPrompt.id, selectedPrompt.promptText)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            copiedPromptId === selectedPrompt.id
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-slate-900 hover:bg-black text-white border-transparent'
                          }`}
                        >
                          {copiedPromptId === selectedPrompt.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Zkopírováno
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-teal-300" />
                              Zkopírovat prompt
                            </>
                          )}
                        </button>
                      </div>

                      {/* Codeblock Area */}
                      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 overflow-y-auto max-h-[360px] font-mono text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap select-text selection:bg-teal-100 border-t-2 border-t-teal-500">
                        {selectedPrompt.promptText}
                      </div>

                      <div className="text-[10px] text-slate-400 text-center italic">
                        Poznámka: Hodnoty uvedené v hranatých závorkách [ ] nahraďte svými reálnými údaji před odesláním do AI.
                      </div>

                    </div>

                  </motion.div>
                )}

              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between text-[10px] text-slate-400 font-mono shrink-0">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                  Zpracováno na lokálním tátovském OS s vědomím psychologie a práva
                </span>
                <span>
                  Synthesis OS v2.5
                </span>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
