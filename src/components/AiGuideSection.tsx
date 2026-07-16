/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Copy, 
  Check, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  FileText,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Info,
  ExternalLink,
  ShieldAlert,
  Headphones,
  Mic,
  Play,
  Users,
  Volume2
} from 'lucide-react';
import GlossaryTerm from './GlossaryTerm';

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
  { id: 'evidence', label: 'Analýza důkazů' },
  { id: 'audio-sim', label: 'Audio & Simulace' }
];

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'ospod-response',
    title: 'Reakce na zprávu OSPOD (Vyvrácení předsudků)',
    category: 'ospod',
    useCase: 'Pokud OSPOD napíše zaujatou zprávu tvrdící, že nízký věk dítěte znemožňuje přespávání u otce.',
    description: 'Tento prompt pomůže přetavit váš hněv do chladných, neprůstřelných odborných a psychologických argumentů vyvracejících monotropii.',
    promptText: `Jsi špičkový opatrovnický právník a specialista na rodinné právo a dětskou vývojovou psychologii. Pomoz mi sestavit věcné, právně a odborně precizní vyjádření pro soud k poslední zprávě kolizního opatrovníka OSPOD.

Mým cílem je věcně vyvrátit tvrzení OSPOD a poukázat na jejich rozpor s moderním vědeckým poznáním o vývoji dětí a judikaturou Ústavního soudu ČR.

Zde jsou klíčové podklady pro tvou analýzu:
1. Zpráva OSPOD tvrdí: [Zde popište lživé nebo zaujaté tvrzení - např. "Dítě je příliš malé, střídavá péče a přespávání u otce by ho traumatizovalo a narušilo vazbu na matku."]
2. Moje reálná dosavadní péče a fakta: [Zde popište pravdu - např. "O dceru běžně pečuji od narození, krmím ji, přebaluji, ukládám ke spánku, máme skvělý a bezpečný vztah."]

Při formulaci mého vyjádření pro soud postupuj podle těchto pravidel:
- Zvol tón, který je klidný, věcný, přísně racionální a bez jakýchkoliv emocí, útoků či urážek matky nebo OSPOD. Musím před soudcem působit jako zralý, stabilní, konstruktivní a spolupracující rodič.
- Odkážeš se na mezinárodní konsenzuální studii prof. Richarda A. Warshaka (2014) o noční péči otců u dětí do 3 let a na studii prof. Williama Fabriciuse (2016) o "Dose-Response" efektu (že kvalita vztahu k otci lineárně roste s počtem nocí strávených u něj v dětství).
- Argumentuj "nejlepším zájmem dítěte" a právem dítěte na péči obou rodičů podle judikatury Ústavního soudu ČR (např. nález sp. zn. I. ÚS 1506/13 nebo I. ÚS 3216/22).
- Strukturuj text přehledně do odstavců s jasnými nadpisy.

Navrhni mi nejprve osnovu vyjádření a po mém schválení vypracujeme plný text.`
  },
  {
    id: 'court-proposal',
    title: 'Návrh na střídavou péči (Argumentace attachmentem)',
    category: 'court',
    useCase: 'Při sepisování nebo upřesňování samotného návrhu na střídavou péči pro soud.',
    description: 'Vytvoří přesvědčivý a dojemný (avšak věcný) argument o důležitosti ranních a večerních rituálů pro budování bezpečné citové vazby.',
    promptText: `Jsi specialista na rodinné právo a dětskou vývojovou psychologii. Pomoz mi vypracovat argumentační část mého návrhu na střídavou péči, která se zaměřuje na citovou vazbu (attachment) mého dítěte ke mně (otci) a na nezbytnost noční péče.

Vycházej z těchto mých faktů:
- Jméno a věk dítěte: [Doplňte jméno a věk - např. "Lukáš, 22 měsíců"]
- Moje zapojení do péče: [Doplňte vaše rituály - např. "Krmení, koupání, ukládání ke spánku, čtení pohádek, běžná denní péče od narození."]
- Překážky ze strany matky: [Doplňte, jak matka brání - např. "Matka odmítá přespávání s tím, že syn potřebuje v noci výhradně matku a s otcem nesmí spát, protože se budí."]

Vygeneruj text vyjádření, který:
1. Vyvrací mýtus "monotropie" (že malé dítě potřebuje na noc pouze matku) s odkazem na moderní psychologii (Warshak 2014).
2. Vysvětluje, že večerní a ranní rituály (koupání, uspávání, ranní probuzení) jsou naprosto klíčové pro budování bezpečné citové vazby k otci a nelze je nahradit pouhým odpoledním "stykem na pár hodin".
3. Používá věcnou, kultivovanou právnickou češtinu přizpůsobenou českému opatrovnickému soudnictví.
4. Je naprosto prostý útoků na matku. Zaměřuje se čistě na právo dítěte a jeho vývojové potřeby.

Napiš mi rovnou návrh textu, který budu moci vložit jako samostatný argumentační bod do mého návrhu k soudu.`
  },
  {
    id: 'timeline-analysis',
    title: 'Transformace deníku maření styku do soudní tabulky',
    category: 'evidence',
    useCase: 'Pokud si vedete poznámky o maření styku a potřebujete je uspořádat jako neprůstřelný důkaz.',
    description: 'Srovná chaotické SMS zprávy, emaily a vaše poznámky do přehledné chronologické tabulky, která soudci okamžitě ukáže rozsah maření.',
    promptText: `Jsi precizní právní analytik a opatrovnický advokát. Mám k dispozici neuspořádané záznamy (SMS zprávy, maily, poznámky z kalendáře) o tom, jak mi matka mařila styk s naším dítětem nebo porušovala naše dohody.

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
  },
  {
    id: 'ospod-meeting-prep',
    title: 'Příprava na pohovor na OSPOD (Simulace otázek)',
    category: 'ospod',
    useCase: 'Před první návštěvou sociální pracovnice nebo před ústním pohovorem.',
    description: 'Vygeneruje seznam nejpravděpodobnějších otázek (včetně záludných a stereotypních) a pomůže vám na ně zformulovat věcné, bezpečné odpovědi.',
    promptText: `Jsi zkušená sociální pracovnice OSPOD, která má za sebou 20 let praxe v ČR. Chci, abys mi pomohla privatizovat a připravit se na můj první osobní pohovor.

Mým cílem je působit jako zralý, spolupracující, klidný a plně kompetentní otec, kterého nevyvede z míry žádná otázka a který se nenechá vyprovokovat k útokům na matku.

Zde je můj stručný kontext:
- Dítě: [např. "Tomáš, 15 měsíců"]
- Hlavní spor: [např. "Chci střídavou péči s přespáváním, matka tvrdí, že otec neumí pečovat a dítě pláče."]

Napiš mi:
1. 5 nejpravděpodobnějších standardních otázek, které mi položíš.
2. 3 záludné nebo předsudečné otázky (např. "Proč tak tlačíte na přespávání u takto malého dítěte?", "Není pro dítě lepší mít jedno stabilní zázemí u matky?").
3. Pro každou otázku navrhni "Vzornou tátovskou odpověď" – jak mám odpovědět věcně, s klidem, s odkazem na potřeby dítěte a bez pomlouvání matky.`
  },
  {
    id: 'court-simulator',
    title: 'Simulátor soudního výslechu (Trénink emocí)',
    category: 'audio-sim',
    useCase: 'Chcete si nanečisto vyzkoušet, jaké to je stát před soudem a odpovídat pod tlakem.',
    description: 'Tento prompt promění Gemini v nepřátelského opatrovnického právníka matky, který se vás snaží nachytat na emocích nebo zpochybnit vaši péči. Trénujte ledový klid.',
    promptText: `Jsi agresivní, velmi zkušený opatrovnický advokát matky mého dítěte. Tvým jediným cílem u soudu je zpochybnit mou otcovskou kompetenci, vykreslit mě jako emočně nestabilního, kariéristu, který na dítě nemá čas, a donutit mě ztratit u soudu nervy.

Budeme hrát interaktivní hru (roleplay) podle těchto pravidel:
1. Ty budeš klást záludné, útočné, pasivně-agresivní otázky jednu po druhé. Vždy počkáš na mou odpověď, než položíš další.
2. Otázky postav na klasických mateřských stereotypech ("Jak chcete pečovat o tak malé dítě v noci, když se ještě budí?", "Proč trváte na střídavé péči, když tím dítě jen traumatizujete neustálým stěhováním?", "Zvládnete vůbec uvařit, vyprat a zajistit lékaře bez pomoci?").
3. Po každé mé odpovědi mi nejprve v hranatých závorkách [HODNOCENÍ] poskytni krátkou, upřímnou zpětnou vazbu z pohledu nezaujatého soudce (např. zda má odpověď zněla klidně a věcně, nebo zda jsem sklouzl k emocím či útokům na matku).
4. Následně pokračuj další nepříjemnou otázkou.

Začni tím, že se představíš, popíšeš atmosféru v soudní síni a položíš mi první záludnou otázku. Čekej na mou odpověď.`
  },
  {
    id: 'audio-prep',
    title: 'Příprava struktury pro Audio přehled / Podcast',
    category: 'audio-sim',
    useCase: 'Chcete si nechat od AI vygenerovat jasný zvukový přehled vašeho případu pro poslech na cestách.',
    description: 'Pomůže vám připravit strukturované podklady pro generátor mluveného slova v NotebookLM, aby výsledný podcast dával dokonalý smysl.',
    promptText: `Jsi špičkový audio producent a právní dramaturg. Chci v NotebookLM vygenerovat 10minutový "Deep Dive" audio přehled (přátelský podcast dvou moderátorů) o mém právním případu.

Potřebuji, abys ze všech mých podkladů vytvořil jeden super-strukturovaný, přehledný textový soubor (tzv. "Studio Brief"), který pak nahraji jako hlavní zdroj do NotebookLM. Tento brief musí moderátory navést tak, aby mluvili o klíčových věcech a neodbíhali k nepodstatným detailům.

Zde jsou surová data mého případu:
- Moje situace a cíle: [např. "Otec usiluje o střídavou péči o 2letou dceru, matka blokuje přespávání, OSPOD je pasivní."]
- Klíčové argumenty a studie: [např. "Argumentuji mezinárodním konsenzem Warshak 2014, zavedenými rituály koupání/uspávání a dostatečnou flexibilitou práce."]
- Hlavní obavy a mýty protistrany: [např. "Matka tvrdí, že otec nemá mateřský instinkt a dítě spí jen s ní."]

Vytvoř mi "Studio Brief" pro NotebookLM, který bude obsahovat:
1. "Show Concept" (O čem ta diskuze musí být - objektivní pohled na důležitost aktivního otcovství od útlého věku).
2. "Host Personas" (Jak se mají moderátoři chovat - jeden je zvídavý skeptik, druhý je empatický odborník na rodinné právo).
3. "Key Talking Points" (3 hlavní témata, která musí bezpodmínečně zaznít, včetně vyvrácení mýtů o monotropii).
4. "Emotional Arc" (Jak má diskuze gradovat – od počáteční skepse k absolutnímu pochopení, že střídavá péče u malých dětí je nejlepším zájmem dítěte).

Napiš mi tento brief v češtině i angličtině (pro maximální kompatibilitu s generátorem zvuku).`
  },
  {
    id: 'contradiction-finder',
    title: 'Hloubkový rozbor rozporů a zkreslení (Bias Finder)',
    category: 'audio-sim',
    useCase: 'Máte v ruce obsáhlé vyjádření matky nebo zprávu OSPOD a potřebujete v ní najít faktické lži a rozpory.',
    description: 'Porovná tvrzení druhé strany s vašimi deníkovými záznamy a doložitelnými důkazy. Výstupem je přehledná analýza rozporů pro vašeho advokáta.',
    promptText: `Jsi forenzní analytik a opatrovnický advokát se zaměřením na detekci lží a argumentačních klamů. Pomoz mi analyzovat vyjádření protistrany a najít v něm logické rozpory, faktické nepravdy a zaujatost (bias).

Zde jsou dva hlavní dokumenty, které porovnáme:
DOKUMENT A (Vyjádření protistrany / OSPOD):
[SEM VLOŽTE TEXT NEBO PASÁŽE Z VYJÁDŘENÍ DRUHÉ STRANY - např. "Otec se o dítě nikdy nezajímal, neví jaké léky bere, nezná jeho lékaře."]

DOKUMENT B (Moje doložitelná fakta a deník péče):
[SEM VLOŽTE VAŠE FAKTA - např. "Otec byl u 8 z posledních 10 lékařských prohlídek (viz přiložené zprávy z pediatrie), léky pravidelně podává sám (viz SMS komunikace ze dne 12.3. a 15.3.)."]

Proveď hloubkový rozbor a vygeneruj pro mě analýzu rozporů obsahující:
1. "Tabulku přímých rozporů" se sloupci: "Tvrzení protistrany", "Reálné doložitelné datum/fakt", "Důkazní materiál (číslo listu/SMS/pediatr)", "Míra závažnosti (Nízká/Střední/Vysoká)".
2. "Analýzu mateřského/systémového stereotypu" – popiš, jaká konkrétní klišé protistrana či OSPOD používá bez opory v reálných datech.
3. "Návrh procesní otázky" – navrhni 3 věcné otázky, které by měl můj advokát položit sociální pracovnici nebo matce u soudu k těmto bodům, aby se jejich nepravda ukázala přímo v soudní síni.

Buď maximálně analytický, chladný a precizní. Vyhni se vlastním emocím.`
  }
];

export default function AiGuideSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPromptId, setSelectedPromptId] = useState<string>('ospod-response');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const filteredPrompts = PROMPT_TEMPLATES.filter(p => 
    activeCategory === 'all' || p.category === activeCategory
  );

  const selectedPrompt = PROMPT_TEMPLATES.find(p => p.id === selectedPromptId) || PROMPT_TEMPLATES[0];

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-8 font-sans" id="ai-guide-section-root">
      
      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/15 border border-teal-500/30 rounded-full text-teal-400 text-[10px] font-bold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Digitální asistence & Synthesis OS
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-display text-white">
            Digitální asistence: Jak využít AI k přípravě na soud
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Většina otců v opatrovnickém sporu selhává kvůli emocím, nepřehlednosti v důkazech nebo procesním chybám. Tento návod ti ukáže, jak používat <strong>NotebookLM</strong> nebo <strong>Gemini</strong> jako svůj osobní právní „mozek“, který ti pomůže utřídit myšlenky a připravit argumenty, které mají u soudu skutečnou váhu.
          </p>
        </div>
      </div>

      {/* Main Grid for Guide content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Rules and Workflow (8 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Zlatá pravidla */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-3xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2 pb-2 border-b border-slate-100">
              <BrainCircuit className="w-4.5 h-4.5 text-teal-600" />
              1. Zlaté pravidlo: Ty jsi šéf, AI je praktikant
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              NotebookLM a Gemini jsou neuvěřitelně výkonné nástroje, ale jsou to <strong>jazykové modely, nikoliv právníci</strong>. Mohou se mýlit, mohou si vyložit text opačně nebo si vytvořit vlastní závěry, které neodpovídají realitě.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100/60 space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-bold text-rose-700">Pravidlo kontroly</span>
                <h4 className="font-bold text-xs text-rose-900">Nikdy neodesílej nečtené</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Nikdy nenechávej dokument odeslat k soudu nebo na OSPOD bez toho, aniž bys každé jedno slovo osobně přečetl a schválil. Ty neseš právní odpovědnost.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100/60 space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-bold text-teal-700">Pravidlo verifikace</span>
                <h4 className="font-bold text-xs text-teal-900">Vše ověřuj v zákonech</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pokud ti AI napíše „zákon říká to a to“, vždy si ten konkrétní paragraf vyhledej (např. na portálu <a href="https://www.zakonyprolidi.cz" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-bold underline inline-flex items-center gap-0.5">zakonyprolidi.cz <ExternalLink className="w-2.5 h-2.5" /></a>) a ověř to.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Prompty Guide */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-3xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2 pb-2 border-b border-slate-100">
              <MessageSquare className="w-4.5 h-4.5 text-teal-600" />
              2. Jak psát prompty (zadání) pro maximální přesnost
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Chyby vznikají, když je zadání vágní a obecné. Pro kvalitní výstup musí být zadání velmi konkrétní a strukturované. Porovnej tyto dva přístupy:
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/50 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-4.5 h-4.5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">✕</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Špatný, obecný prompt</span>
                </div>
                <p className="text-xs text-slate-500 italic">
                  „Napiš mi nějakou žádost o střídavou péči, protože matka mi nechce dávat syna a socialka mi nepomáhá.“
                </p>
                <p className="text-[10px] text-rose-800 bg-rose-50 p-1.5 rounded-md mt-2">
                  <strong>Důsledek:</strong> AI vygeneruje obecný, příliš emotivní dopis, který u soudu nemá žádnou váhu, nebo si vymyslí nesmyslná fakta.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/30 border border-teal-100 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-4.5 h-4.5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                  <span className="text-[10px] uppercase font-bold text-teal-700 font-mono">Správný, strukturovaný prompt</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  „Jsi zkušený opatrovnický právník. Napiš vyjádření pro soud k přiložené zprávě <GlossaryTerm termId="ospod">OSPOD</GlossaryTerm>. Zaměř se na vyvrácení tvrzení o věkové nevhodnosti přespávání. Použij vědecká data z studie Warshak (2014) o střídavé péči od narození a nález Ústavního soudu sp. zn. I. ÚS 1506/13. Buď věcný, strohý a vyhni se emocím...“
                </p>
                <p className="text-[10px] text-teal-800 bg-teal-50/50 p-1.5 rounded-md mt-2">
                  <strong>Důsledek:</strong> AI vypracuje precizní a kultivovaný dokument, který soudce okamžitě pochopí a vezme vážně.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Workflow */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-3xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2 pb-2 border-b border-slate-100">
              <Layers className="w-4.5 h-4.5 text-teal-600" />
              3. Workflow pro nulovou chybovost (Tvůj „tátovský postup“)
            </h3>

            <div className="space-y-4 text-xs">
              
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">Vložení podkladů</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Nahraj do NotebookLM pouze relevantní a ověřené dokumenty. Nepřidávej nepravdy. Vlož rozhodnutí soudu, zprávy z <GlossaryTerm termId="ospod">OSPOD</GlossaryTerm>, tvoje strukturované poznámky, vědecké studie z našeho portálu.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">Iterativní tvorba (Vytvářej po krocích)</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Nechtěj dokonalý výsledek na první pokus. Postupuj v krocích. Nejdřív chtěj osnovu, tu zkontroluj a uprav, pak chtěj první draft, ten vybrušuj a odstraňuj nežádoucí tón.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">Kritické čtení (Pravidlo 3 „NE“)</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Před odesláním vždy zkontroluj tyto tři parametry:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1.5">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/50">
                      <span className="font-bold text-teal-800 block mb-0.5">1. NEKOLÍSÁ</span>
                      Neodporuje si dokument s tím, co jsi do něj vložil jako reálné podklady?
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/50">
                      <span className="font-bold text-teal-800 block mb-0.5">2. NEKLAMÁ</span>
                      Nejsou v textu vymyšlené citace, judikáty nebo neexistující paragrafy?
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/50">
                      <span className="font-bold text-teal-800 block mb-0.5">3. NECHYBUJE</span>
                      Není tón dokumentu příliš agresivní nebo naopak pasivní a zoufalý?
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Hallucination Warnings & NotebookLM Tips (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Halucinace warning card */}
          <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-6 shadow-3xs space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <h4 className="font-bold text-xs uppercase tracking-wider font-mono">
                Varování: Jak poznat, že AI „halucinuje“
              </h4>
            </div>
            
            <p className="text-xs text-amber-900 leading-relaxed">
              AI si občas může „domyslet“ fakta, která v podkladech vůbec nejsou (např. vymyslet si datum setkání, které neproběhlo, nebo si splést jména dětí a úřadů). Pokud vidíš v textu cokoliv, co si nepamatuješ nebo co neodpovídá pravdě, <strong>ihned to smaž</strong>.
            </p>

            <div className="bg-white/80 p-3.5 rounded-xl border border-amber-100 text-[11px] text-slate-700 leading-relaxed space-y-1.5">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="text-amber-500">💡</span> Využij funkci „citace“ v NotebookLM:
              </p>
              <p>
                NotebookLM má skvělou funkci – u každého vygenerovaného odstavce zobrazuje klikací čísla (citace). Vždy na ně klikni, abys viděl přesný úryvek z tvého nahraného souboru, ze kterého AI čerpala. Pokud citace chybí, odkazuje do prázdna, nebo nesedí, <strong>informace je vymyšlená</strong> a musí jít pryč.
              </p>
            </div>
          </div>

          {/* Gemini vs NotebookLM difference */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-3xs space-y-4">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2 pb-2 border-b border-slate-100">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Gemini vs. NotebookLM: Co kdy zvolit?
            </h4>

            <div className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600" />
                  <h5 className="font-bold text-slate-800">NotebookLM (Tvůj uzavřený archiv)</h5>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px] pl-4">
                  Nejlepší na hloubkovou práci s tvými osobními dokumenty. Nahraješ tam celý spis, zprávy z OSPOD, deník maření a ptáš se pouze nad těmito daty. Neriskujesz, že si AI vytáhne informace z internetu, drží se striktně tvých nadefinovaných podkladů.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                  <h5 className="font-bold text-slate-800">Google Gemini (Tvorba a argumentace)</h5>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px] pl-4">
                  Skvělé pro kreativní tvorbu textů, simulaci argumentačních rozhovorů, doplňování zákonů a judikátů. Gemini má široký přehled o světě, legislativě a může ti pomoci vycizelovat styl psaní do dokonalé elegance.
                </p>
              </div>

            </div>
          </div>

          {/* Useful checklist card */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50/20 border border-teal-100/50 rounded-2xl p-6 shadow-3xs space-y-3">
            <h4 className="font-bold text-xs text-teal-900 font-display flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Rychlý kontrolní seznam před odevzdáním
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-600 font-sans">
              <li className="flex items-start gap-1.5">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Zkontroloval jsem správnost všech jmen, dat, časů a rodných čísel.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Odstranil jsem z textu veškerá urážlivá slova na adresu matky či OSPODu.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Všechny citované zákony a judikáty jsem osobně dohledal a zkontroloval.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Tón vyznění dokumentu je klidný, hrdý, spolupracující a zaměřený na zájem dítěte.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Advanced AI Methods Section */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-md space-y-6 relative overflow-hidden" id="advanced-ai-methods">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="space-y-1 relative z-10 border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-1 bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
            Exkluzivní metodika Synthesis OS
          </div>
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-teal-400" />
            Pokročilé metody: Audio, rozbory a simulace na libovolná témata
          </h3>
          <p className="text-xs text-slate-400">
            Jak s pomocí moderních AI modelů vybudovat neprůstřelnou strategii a vytrénovat psychickou odolnost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          
          {/* Card 1: Audio Overviews */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                1. Audio přehledy (Audio Podcast)
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Nástroj <strong>NotebookLM</strong> dokáže jedním kliknutím vygenerovat vysoce autentický rozhovor dvou moderátorů (muže a ženy) nad nahranými spisy a vaším deníkem péče.
              </p>
              <div className="space-y-1 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400">
                <span className="font-bold text-teal-400 block mb-0.5">Jak na to v praxi:</span>
                Nahrajte své podklady a v pravém horním rohu klikněte na <strong>"Generate Audio Overview"</strong>. Pro nejlepší výsledky využijte náš prompt <em>"Příprava struktury pro Audio přehled"</em>, který AI přesně navede na klíčová témata.
              </div>
            </div>
            <div className="pt-2 text-[10px] text-teal-400/80 italic flex items-center gap-1 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Snižuje emoční náboj a úzkost ze sporu
            </div>
          </div>

          {/* Card 2: Contradiction Audits */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                2. Hloubkové rozbory (Logické rozpory)
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Umožňuje odhalit a přehledně sepsat všechny logické chyby, manipulace a faktické nesrovnalosti ve vyjádřeních druhé strany nebo zaujatých sociálních pracovníků.
              </p>
              <div className="space-y-1 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400">
                <span className="font-bold text-emerald-400 block mb-0.5">Jak na to v praxi:</span>
                Nahrajte vyjádření protistrany a svůj reálný deník důkazů do Gemini. Použijte náš prompt <em>"Hloubkový rozbor rozporů"</em>. AI vytvoří tabulku incidentů s přímými důkazy, kterou můžete odevzdat svému právníkovi.
              </div>
            </div>
            <div className="pt-2 text-[10px] text-emerald-400/80 italic flex items-center gap-1 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Vytvoří neprůstřelné podklady pro soudce
            </div>
          </div>

          {/* Card 3: Interactive Simulations */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                3. Simulace jednání (Trénink pod tlakem)
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Nejlepší obrana je příprava. Spuštěním simulátoru opatrovnického soudu se naučíte odpovídat na ty nejzáludnější otázky klidně, hrdě a s věcnou argumentací.
              </p>
              <div className="space-y-1 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400">
                <span className="font-bold text-indigo-400 block mb-0.5">Jak na to v praxi:</span>
                Vložte prompt <em>"Simulátor soudního výslechu"</em> do Gemini. AI se ujme role agresivního advokáta druhé strany a bude vám pokládat útočné otázky. Po každé vaší odpovědi vám poskytne zpětnou vazbu a ohodnotí vaše emoce.
              </div>
            </div>
            <div className="pt-2 text-[10px] text-indigo-400/80 italic flex items-center gap-1 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Buduje naprostý klid v soudní síni
            </div>
          </div>

        </div>

        {/* Dynamic Protip block */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-1.5 relative z-10">
          <p className="font-bold text-slate-200 flex items-center gap-1.5">
            <span className="text-teal-400">💡</span> Profesionální tátovský tip pro poslech:
          </p>
          <p className="text-[11px] text-slate-400">
            Když si necháte vygenerovat audio v NotebookLM, stáhněte si výsledný soubor do telefonu. Poslouchejte ho při chůzi, cestou v autě nebo při sportu. Vaše podvědomí si zvykne na tón řeči, odborné termíny (attachment, monotropie, střídavá péče) a u soudu budete tyto argumenty říkat naprosto přirozeně a bez trémy, jako byste o tom mluvili s kamarády.
          </p>
        </div>
      </div>

      {/* Interactive prompt templates workspace */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xs space-y-6" id="prompt-templates-section">
        <div className="space-y-1 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider">
            Interaktivní knihovna promptů
          </div>
          <h3 className="text-base font-bold text-slate-800 font-display">
            Vzorové prompty pro NotebookLM & Gemini
          </h3>
          <p className="text-xs text-slate-500">
            Vyberte si šablonu promptu níže, doplňte vlastní detaily a zkopírujte ji jako zadání pro vaši AI.
          </p>
        </div>

        {/* Categories Tab selector */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                // Automatically select first prompt of the category
                const firstOfCat = PROMPT_TEMPLATES.find(p => cat.id === 'all' || p.category === cat.id);
                if (firstOfCat) setSelectedPromptId(firstOfCat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-teal-600 text-white border-transparent shadow-3xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Master prompt workspace grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* List of prompts in selected category (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            {filteredPrompts.map((prompt) => {
              const isSelected = selectedPromptId === prompt.id;
              return (
                <button
                  key={prompt.id}
                  onClick={() => setSelectedPromptId(prompt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/50 border-teal-200 text-teal-900 shadow-3xs ring-1 ring-teal-200'
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="font-bold text-xs font-display leading-snug">
                      {prompt.title}
                    </span>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-teal-600 translate-x-0.5' : 'text-slate-300'}`} />
                  </div>
                  <span className={`text-[10px] line-clamp-2 ${isSelected ? 'text-teal-800/80' : 'text-slate-400'}`}>
                    {prompt.description}
                  </span>
                  
                  {/* Small tag */}
                  <span className="text-[8px] uppercase tracking-wider font-mono font-bold mt-1 text-slate-400">
                    Kategorie: {CATEGORIES.find(c => c.id === prompt.category)?.label || prompt.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prompt viewer & copy (8 cols) */}
          <div className="lg:col-span-8 bg-slate-50 rounded-2xl border border-slate-200 p-5 md:p-6 flex flex-col space-y-4">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-3xs">
              <div className="space-y-1">
                <span className="text-[8px] bg-teal-100 text-teal-800 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono">
                  Šablona promptu pro tvou AI
                </span>
                <h4 className="font-bold text-xs text-slate-800">
                  {selectedPrompt.title}
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans italic">
                  <strong>Případ použití:</strong> {selectedPrompt.useCase}
                </p>
              </div>

              <button
                onClick={() => handleCopyPrompt(selectedPrompt.id, selectedPrompt.promptText)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  copiedPromptId === selectedPrompt.id
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-3xs'
                    : 'bg-slate-900 hover:bg-black text-white border-transparent shadow-xs hover:shadow-md'
                }`}
              >
                {copiedPromptId === selectedPrompt.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Zkopírováno do schránky
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-teal-300" />
                    Zkopírovat prompt
                  </>
                )}
              </button>
            </div>

            {/* Code Block Content */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 overflow-y-auto max-h-[380px] font-mono text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap select-text selection:bg-teal-100 border-t-4 border-t-teal-500">
              {selectedPrompt.promptText}
            </div>

            {/* Instruction Footer */}
            <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-200/50 flex gap-2.5 items-start">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 leading-relaxed">
                <strong>Návod k použití:</strong> Po zkopírování vložte prompt do chatovacího okna v NotebookLM nebo Gemini. Nezapomeňte nahradit veškeré údaje v hranatých závorkách (např. <code className="bg-amber-100 px-1 py-0.5 rounded-sm font-bold text-[9px] font-mono">[Zde popište...]</code>) vašimi reálnými, pravdivými údaji!
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
