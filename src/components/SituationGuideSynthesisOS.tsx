import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  AlertCircle, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  RefreshCw, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Send,
  Zap,
  Bookmark
} from 'lucide-react';

interface GuideProps {
  categoryTitle: string;
  categorySlug: string;
}

export default function SituationGuideSynthesisOS({ categoryTitle, categorySlug }: GuideProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedAiTool, setSelectedAiTool] = useState<'explain' | 'checklist' | 'questions' | 'docs' | 'simulate'>('checklist');

  // Custom AI simulator state
  const [simScenario, setSimScenario] = useState<string>('denial');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Step definition for Synthesis OS
  const steps = [
    {
      step: 1,
      title: 'Co se děje?',
      subtitle: 'Diagnostika situace',
      desc: 'Pochopení podstaty problému, právního rámce a emoční reakce obou stran.',
      content: {
        sjm: 'Dochází k rozpadu společného hospodaření a zániku SJM. Hrozí riziko jednostranných finančních kroků, zneužití společných úspor nebo nesplácení závazků.',
        'psychicka-podpora': 'Prožíváte obrovský stresový šok z narušení rodinné struktury. Vaše tělo vyžaduje stabilizaci, abyste mohli jednat rozvážně jako spolehlivý rodič.',
        'jak-mluvit-s-ditetem': 'Dítě vnímá napětí mezi rodiči. Hledá pocit bezpečí a ujištění, že nepřichází o lásku ani tátu ani mámy.',
        pas: 'Druhý dospělý nebo okolnosti narušují přirozenou vazbu dítěte k vám. Dítě reaguje obranným chováním a odmítáním.',
        'novy-domov-ospod': 'Připravujete zázemí v novém bydlišti. OSPOD zjišťuje, zda byt vyhovuje potřebám dítěte pro střídavou péči.',
        mediace: 'Zablokovala se běžná komunikace. Hledá se neutrální půda pro dojednání dohody bez nákladných a emotivních soudů.'
      }[categorySlug] || 'Dochází k zásadní životní změně v rodině, která vyžaduje klidný a strukturovaný přístup.'
    },
    {
      step: 2,
      title: 'Co udělat nyní?',
      subtitle: 'Akutních 0–72 hodin',
      desc: 'Okamžitá krizová opatření a prevence nevratných chyb.',
      content: {
        sjm: 'Oddělte osobní financování, zřiďte si vlastní účet, stáhněte výpisy za 3 roky a písemně oznamte bance nesouhlas s novými úvěry manželky/manžela.',
        'psychicka-podpora': 'Zavěste pravidlo 24hodinové pauzy před odesláním odpovědí. Uložte si krizovou linku 116 123 a neřešte spory v noci.',
        'jak-mluvit-s-ditetem': 'Ujistěte dítě: „Oba té moc milujeme, rozchod je věc dospělých, ne tvoje vina.“ Nikdy nekritizujte druhého rodiče před dítětem.',
        pas: 'Zdokumentujte každé stvrzené nepředání dítěte či manipulativní výrok. Podejte na OSPOD a opatrovnický soud informaci o bránění v kontaktu.',
        'novy-domov-ospod': 'Vybavte pro dítě samostatné lůžko, psací stůl, úložný prostor a věku přiměřené hračky. Připravte si smlouvu k bytu.',
        mediace: 'Navrhněte druhému rodiči setkání s neutrálním zapsaným mediátorem. Sepište si 3 vaše nejdůležitější priority pro dohodu.'
      }[categorySlug] || 'Zaměřte se na okamžitou de-eskalaci a zajištění základních životních potřeb dětí.'
    },
    {
      step: 3,
      title: 'Jak chránit dítě?',
      subtitle: 'Bezpečí & Neutralita',
      desc: 'Ochrana dítěte před rodinným konfliktem a zachování vazby k oběma rodičům.',
      content: {
        sjm: 'Nezatahujte otázky majetku a výživného do rozhovorů s dítětem. Hrazení potřeb dítěte musí zůstat prioritou nezatíženou spory dospělých.',
        'psychicka-podpora': 'Pamatuje: „Dítě nepotřebuje dokonalého rodiče. Potřebuje bezpečného a klidného rodiče.“ Pečujte o svou stabilizaci.',
        'jak-mluvit-s-ditetem': 'Odpovídejte na dotazy dětí pravdivě, ale přiměřeně věku. Dítě nepotřebuje znát detaily rozvodu ani právní spory.',
        pas: 'Reagujte na odmítání dítěte láskyplně a trpělivě. Nikdy nepoužívejte protiútoky na druhého rodiče před dětmi.',
        'novy-domov-ospod': 'Udržte dítěti stálost školy, kroužků a kamarádů. Minimalizujte dojezdové vzdálenosti a stres z přejezdů.',
        mediace: 'Využijte mediaci k vytvoření předvídatelného kalendáře péče o prázdninách, svátcích a běžných týdnech.'
      }[categorySlug] || 'Udržujte dítě mimo konflikt dospělých a ujišťujte ho o stálé lásce obou rodičů.'
    },
    {
      step: 4,
      title: 'Jaké mám možnosti?',
      subtitle: 'Strategický výběr',
      desc: 'Porovnání cest: Rodičovská dohoda vs. Právní kroky u opatrovnického soudu.',
      content: {
        sjm: 'Možnost A: Mimosoudní dohoda o vypořádání SJM (rychlá, levná, šetří vztahy). Možnost B: Žaloba o vypořádání SJM u soudu do 3 let od rozvodu.',
        'psychicka-podpora': 'Možnost A: Osobní terapie a svépomocné skupiny otců. Možnost B: Rodinná terapie zaměřená na zklidnění rodinného systému.',
        'jak-mluvit-s-ditetem': 'Možnost A: Společný rozhovor obou rodičů s dítětem podle dohodnutých pravidel. Možnost B: Konzultace s dětským psychologem.',
        pas: 'Možnost A: Terapeutická mediace pod dohledem OSPOD. Možnost B: Předběžné opatření a výkon rozhodnutí u soudu.',
        'novy-domov-ospod': 'Možnost A: Střídavá péče v týdenním/14denním cyklu. Možnost B: Široký neomezený styk s flexibilním přespáváním.',
        mediace: 'Možnost A: Dobrovolná mediace a schválení dohody soudem. Možnost B: Nařízené 1. setkání s mediátorem soudem podľa § 474 z.ř.s.'
      }[categorySlug] || 'Zvažte výhody smírné dohody oproti zdlouhavému opatrovnickému soudnímu sporu.'
    },
    {
      step: 5,
      title: 'Jak se připravit?',
      subtitle: 'Dokumentace & Akce',
      desc: 'Příprava podkladů, důkazů a podrobného plánu pro jednání s úřady a soudem.',
      content: {
        sjm: 'Připravte si inventář majetku, výpisy z bank, úvěrové smlouvy, účtenky a návrh dohody o vypořádání SJM.',
        'psychicka-podpora': 'Sestavte si svůj denní krizový plán, vyhledejte důvěrného přítele a nastavte si zdravý spánkový režim.',
        'jak-mluvit-s-ditetem': 'Projděte si checklist před rozhovorem, zvolte klidné prostředí bez rušení a připravte si odpovědi na zraňující dotazy.',
        pas: 'Vytvořte si přehlednou časovou osu událostí, archiv zpráv (BIFF), výpisy předávání dětí a lékařské/psychologické zprávy.',
        'novy-domov-ospod': 'Připravte podrobný plán péče, potvrzení o bydlení, rozvrh kroužků a nájemní smlouvu k předložení OSPOD.',
        mediace: 'Sepište si tabulku představ o výši výživného, dělení prázdnin a pravidlech telefonování dětí s druhým rodičem.'
      }[categorySlug] || 'Zorganizujte si své dokumenty, časovou osu a návrhy řešení včas a přehledně.'
    }
  ];

  // Handle AI generator simulation
  const handleRunAiTool = (tool: 'explain' | 'checklist' | 'questions' | 'docs' | 'simulate') => {
    setSelectedAiTool(tool);
    setLoadingAi(true);

    setTimeout(() => {
      let output = '';
      if (tool === 'explain') {
        output = `💡 SYNTHESIS OS – ANALÝZA SITUACE DAŇOVÉHO/RODIČOVSKÉHO RÁMCE (${categoryTitle}):\n` +
          `1. Stávající stav: Nacházíte se ve fázi zásadní restrukturalizace rodinného prostředí. Kličové je oddělit osobní animositu vůči druhému dospělému od zájmu dítěte.\n` +
          `2. Právní náhled: Dle Občanského zákoníku (§ 880 a násl. OZ) má dítě právo na péči obou rodičů. Vaše postavení je rovnoprávné.\n` +
          `3. Strategické doporučení: Postupujte věcně, udržujte písemnou komunikaci (BIFF metoda) a předkládejte pouze ověřitelná fakta.`;
      } else if (tool === 'checklist') {
        output = `📋 SYNTHESIS OS – KONTROLNÍ SEZNAM (CHECKLIST OKAMŽITÝCH KROKŮ):\n` +
          `[ ] Kroky 1: Zabezpečení osobních přístupů a financí (nový samostatný účet).\n` +
          `[ ] Kroky 2: Písemné doložení vaší připravenosti hradit výživné a pečovat o dítě.\n` +
          `[ ] Kroky 3: Vytvoření časové osy událostí a archivu veškeré komunikace s druhým rodičem.\n` +
          `[ ] Kroky 4: Příprava prostor nového bydlení (lůžko, učební koutek, osobní věci dítěte).\n` +
          `[ ] Kroky 5: Návrh rodičovské dohody předložený OSPOD / mediátorovi.`;
      } else if (tool === 'questions') {
        output = `❓ SYNTHESIS OS – NÁVRH OTÁZEK PRO JEDNÁNÍ (OSPOD / SOUD / MEDIACE):\n` +
          `1. Pro OSPOD: „Jaké konkrétní podmínky a podklady potřebujete prověřit pro podpoření střídavé péče?“\n` +
          `2. Pro druhého rodiče: „Jaký konkrétní harmonogram předávání dětí o prázdninách a svátcích navrhuješ?“\n` +
          `3. Pro mediátora: „Jak můžeme smluvně ošetřit komunikaci o školních a zdravotních věcech dětí?“\n` +
          `4. Pro advokáta: „Jaká je standardní judikatura Krajského/Ústavního soudu v našem soudním obvodu?“`;
      } else if (tool === 'docs') {
        output = `📁 SYNTHESIS OS – KATALOG POTŘEBNÝCH DOKUMENTŮ A LISTIN:\n` +
          `• Osobní doklady: Rodné listy dětí, oddací list / rozhodnutí o rozvodu.\n` +
          `• Bydlení: Nájemní smlouva / list vlastnictví k novému bytu, fotografie dětského pokoje.\n` +
          `• Příjmy: Potvrzení o příjmu za posledních 12 měsíců, daňové přiznání.\n` +
          `• Děti: Potvrzení o návštěvě školy/školky, potvrzení o kroužcích a zájmových činnostech.\n` +
          `• Důkazy: Písemná komunikace (SMS/e-maily) prokazující vaši snahu o dohodu.`;
      } else if (tool === 'simulate') {
        output = `🎭 SYNTHESIS OS – SIMULACE SCÉNÁŘE ROZHOVORU / REAKCE:\n` +
          `• Scénář: „Druhý rodič odmítá komunikovat a brání předání dětí.“\n` +
          `• Doporučená BIFF reakce: „Dobrý den, přijel jsem pro děti v dohodnutém čase 16:00. Děti mi nebyly předány. Prosím o sdělení náhradního termínu předání do zítřejších 12:00. Děkuji.“\n` +
          `• Další krok: Zapište incident do časové osy a zašlete podnět na OSPOD pro záznam.`;
      }
      setAiOutput(output);
      setLoadingAi(false);
    }, 400);
  };

  const handleCopyOutput = () => {
    if (aiOutput) {
      navigator.clipboard.writeText(aiOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-8 relative overflow-hidden my-12">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Interaktivní krizový modul
              </span>
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-mono text-slate-300">
                Synthesis OS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              🧭 Průvodce situací: {categoryTitle}
            </h2>
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          Strukturovaný 5-krokový navigační proces pro zvládnutí krize. Postupujte krok po kroku a využijte AI modul interakce pro generování checklistů, dokumentů a simulací.
        </p>
      </div>

      {/* 5-STEPPER NAVIGATION TABS */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {steps.map((st) => {
          const isActive = activeStep === st.step;
          return (
            <button
              key={st.step}
              type="button"
              onClick={() => setActiveStep(st.step)}
              className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400/50'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`w-6 h-6 rounded-xl font-mono text-xs font-bold flex items-center justify-center ${
                  isActive ? 'bg-emerald-400 text-slate-900' : 'bg-slate-700 text-slate-300'
                }`}>
                  {st.step}
                </span>
                {isActive && <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
              </div>

              <div>
                <div className={`text-xs font-extrabold ${isActive ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {st.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {st.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE STEP CONTENT DISPLAY */}
      {steps.find(s => s.step === activeStep) && (
        <div className="relative z-10 bg-slate-800/90 border border-slate-700/90 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <span>Krok {activeStep} z 5:</span>
              <span className="text-white font-extrabold">{steps[activeStep - 1].title}</span>
            </div>
            <span className="text-xs text-slate-400">{steps[activeStep - 1].desc}</span>
          </div>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
            {steps[activeStep - 1].content}
          </p>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={activeStep === 1}
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
            >
              ← Předchozí krok
            </button>

            <span className="text-xs font-mono text-slate-400">
              Krok {activeStep} / 5
            </span>

            <button
              type="button"
              disabled={activeStep === 5}
              onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Další krok</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* AI MODULE INTERACTION (SYNTHESIS OS INTERACTIVE ENGINE) */}
      <div className="relative z-10 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              AI Modul Interakce Synthesis OS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Vyberte generátor pro okamžitý výstup
          </span>
        </div>

        {/* AI TOOL SELECTOR BUTTONS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRunAiTool('explain')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              selectedAiTool === 'explain' 
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Vysvětlení situace</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunAiTool('checklist')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              selectedAiTool === 'checklist' 
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Vytvoření checklistu</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunAiTool('questions')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              selectedAiTool === 'questions' 
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Příprava otázek</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunAiTool('docs')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              selectedAiTool === 'docs' 
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Organizace dokumentů</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunAiTool('simulate')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 col-span-2 sm:col-span-1 ${
              selectedAiTool === 'simulate' 
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Simulace scénářů</span>
          </button>
        </div>

        {/* OUTPUT DISPLAY BOARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generovaný výstup Synthesis OS:</span>
            </span>

            {aiOutput && (
              <button
                type="button"
                onClick={handleCopyOutput}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{copied ? 'Zkopírováno!' : 'Kopírovat výstup'}</span>
              </button>
            )}
          </div>

          {loadingAi ? (
            <div className="py-8 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Generuji strukturovaná doporučení Synthesis OS...</p>
            </div>
          ) : aiOutput ? (
            <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              {aiOutput}
            </pre>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500 italic">
              Klikněte na jakékoliv tlačítko výše pro vygenerování výstupu Synthesis OS.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
