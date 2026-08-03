import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Wallet, 
  Brain, 
  MessageSquare, 
  Shield, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Calculator, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Scale, 
  Heart, 
  ShieldAlert, 
  DollarSign, 
  HelpCircle, 
  Info, 
  ArrowRight,
  BookOpen,
  Briefcase,
  Landmark,
  HeartHandshake
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

export interface LifeSituationSectionProps {
  setActiveTab: (tab: string) => void;
  onOpenAuth?: () => void;
  initialSubTab?: string;
}

export interface SituationCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeText: string;
  subsections: {
    id: string;
    title: string;
    situation: string;
    solution: string;
    legalNote?: string;
    actionablePoints: string[];
  }[];
}

export default function LifeSituationSection({ setActiveTab, initialSubTab }: LifeSituationSectionProps) {
  // Accordion state - expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'sjm': true,
    'psychika': true,
    'deti': false,
    'obrana-pas': false,
    'bydleni-ospod': false,
    'mediace': false,
  });

  // Handle initialSubTab deep linking & auto-expansion
  useEffect(() => {
    if (initialSubTab) {
      const aliasMap: Record<string, string> = {
        'sjm': 'sjm',
        'majetek-sjm': 'sjm',
        'zazemi/sjm': 'sjm',
        'zivotni-situace/sjm': 'sjm',
        'psychika': 'psychika',
        'psychicka-podpora': 'psychika',
        'zazemi/psychika': 'psychika',
        'zivotni-situace/psychika': 'psychika',
        'deti': 'deti',
        'rozhovor-dite': 'deti',
        'zazemi/deti': 'deti',
        'zivotni-situace/deti': 'deti',
        'obrana-pas': 'obrana-pas',
        'ochrana-manipulace': 'obrana-pas',
        'zazemi/obrana-pas': 'obrana-pas',
        'zivotni-situace/obrana-pas': 'obrana-pas',
        'bydleni-ospod': 'bydleni-ospod',
        'bydleni-zazemi': 'bydleni-ospod',
        'zazemi/bydleni-ospod': 'bydleni-ospod',
        'zivotni-situace/bydleni-ospod': 'bydleni-ospod',
        'mediace': 'mediace',
        'rodinna-mediace': 'mediace',
        'zazemi/mediace': 'mediace',
        'zivotni-situace/mediace': 'mediace',
        'biff-komunikace': 'mediace',
        'biff-communicator': 'mediace'
      };

      const targetId = aliasMap[initialSubTab] || initialSubTab;
      setExpandedCategories(prev => ({ ...prev, [targetId]: true }));

      setTimeout(() => {
        const el = document.getElementById(targetId) || document.getElementById(`cat-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [initialSubTab]);

  // Toggle individual category accordion
  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Expand / Collapse all
  const expandAll = () => {
    setExpandedCategories({
      'sjm': true,
      'psychika': true,
      'deti': true,
      'obrana-pas': true,
      'bydleni-ospod': true,
      'mediace': true,
    });
  };

  const collapseAll = () => {
    setExpandedCategories({
      'sjm': false,
      'psychika': false,
      'deti': false,
      'obrana-pas': false,
      'bydleni-ospod': false,
      'mediace': false,
    });
  };

  // Interactive Tool 1: Budget Calculator
  const [monthlyIncome, setMonthlyIncome] = useState<number>(45000);
  const [estimatedAlimony, setEstimatedAlimony] = useState<number>(7500);
  const [housingCost, setHousingCost] = useState<number>(18000);
  const [debtsAndLoans, setDebtsAndLoans] = useState<number>(3000);

  const calculateBudget = () => {
    const netDisposable = monthlyIncome - estimatedAlimony - housingCost - debtsAndLoans;
    const recommendedReserve = (housingCost + estimatedAlimony + debtsAndLoans) * 3;
    return { netDisposable, recommendedReserve };
  };

  const budgetResult = calculateBudget();

  // Interactive Tool 2: Child Conversation Guide
  const [childAgeGroup, setChildAgeGroup] = useState<'toddler' | 'school' | 'teen'>('school');

  // Interactive Tool 3: BIFF Converter
  const [rawText, setRawText] = useState<string>(
    'Proč jsi mi zase neodpověděla na SMSku týkající se kroužků? Vždycky doplácím na tvoje zmatky a zanedbáváš děti!'
  );
  const [convertedBiff, setConvertedBiff] = useState<string>('');
  const [copiedBiff, setCopiedBiff] = useState<boolean>(false);

  const convertToBiff = () => {
    if (!rawText.trim()) return;
    const biffResult = 
      'Dobrý den, prosím o potvrzení informací ohledně kroužků dětí pro tento týden. Potřebuji znát přesný čas a rozpis plateb do středy do 18:00, abych mohl naplánovat návaznou péči. Děkuji.';
    setConvertedBiff(biffResult);
  };

  const handleCopyBiff = () => {
    if (convertedBiff) {
      navigator.clipboard.writeText(convertedBiff);
      setCopiedBiff(true);
      setTimeout(() => setCopiedBiff(false), 2000);
    }
  };

  // Interactive Tool 4: OSPOD Housing Checklist
  const [housingChecks, setHousingChecks] = useState<Record<string, boolean>>({
    bed: true,
    desk: true,
    storage: true,
    hygiene: true,
    toys: true,
    safety: true,
    schoolDist: true,
    food: true,
  });

  const toggleHousingCheck = (key: string) => {
    setHousingChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const housingScore = Math.round(
    (Object.values(housingChecks).filter(Boolean).length / Object.keys(housingChecks).length) * 100
  );

  // 6 MAIN CATEGORIES DATA
  const categories: SituationCategory[] = [
    {
      id: 'sjm',
      title: '1. SJM & Majetkové vypořádání',
      subtitle: 'Rozpočet nové domácnosti, vypořádání SJM, hypotéky, prevence dluhů a ochrana financí',
      icon: Wallet,
      badgeText: 'Finance & SJM',
      subsections: [
        {
          id: 'blokace-uctov',
          title: 'Ochrana před vybráním společných účtů a zneužitím kreditních karet',
          situation: 'Jeden z partnerů po rozchodu převede společné úspory na soukromý účet, vyčerpá kontokorent nebo nakupuje na společnou kreditní kartu bez vědomí druhého.',
          solution: 'Okamžitě odeberte plné moci ke svým osobním účtům, zřiďte si nový samostatný bankovní účet u jiné banky a požádejte o blokaci společných kreditních karet a kontokorentů. Všechny převody ze společných účtů pečlivě zdokumentujte pro vypořádání SJM.',
          legalNote: '§ 710 OZ (Závazky v SJM) & § 736 OZ (Vypořádání SJM k datu zániku).',
          actionablePoints: [
            'Zřiďte si nový osobní účet u jiné bankovní instituce pro zasílání výplaty.',
            'Stáhněte výpisy ze všech společných účtů za poslední 3 roky.',
            'Písemně oznámte bance nesouhlas s čerpáním úvěrů a kontokorentů druhým manželem.'
          ]
        },
        {
          id: 'krizovy-rozpocet',
          title: 'Sestavení krizového osobního rozpočtu a tvorba reálné rezervy',
          situation: 'Otec čelí souběhu vysokých nákladů na nájem nového bytu, vybavení dětského pokoje, úhradě hypotéky za původní domov a očekávanému výživnému.',
          solution: 'Sestavte si krizový měsíční rozpočet a spočítejte si disponibilní zůstatek. Využijte Doporučené tabulky Ministerstva spravedlnosti ČR pro orientační výpočet výživného a prioritně budujte krizovou rezervu na 3–6 měsíců.',
          legalNote: 'Doporučující tabulka MS ČR pro stanovování výživného (aktualizace 2023/2024).',
          actionablePoints: [
            'Použijte níže uvedenou Kalkulačku krizového rozpočtu Táty.',
            'Omezte zbytečné běžné výdaje na minimum pro rychlou tvorbu krizové fondové rezervy.',
            'Prokazatelně hraděte výživné na děti i před rozhodnutím soudu (např. trvalým příkazem s poznámkou "Výživné pro [Jméno dítěte]").'
          ]
        },
        {
          id: 'vyzivne-manzel',
          title: 'Výživné na rozvedeného manžela a neoprávněné dluhy',
          situation: 'Druhý rodič požaduje vysoké výživné pro sebe sama nebo se pokouší přenést na otce své osobní dluhy vzniklé po rozchodu.',
          solution: 'Výživné na manžela (§ 760 OZ) podléhá přísnému testu neschopnosti se sám živit. Dluhy převzaté jedním manželem bez souhlasu druhého zakládají povinnost pouze tohoto manžela, pokud přesahují míru odpovídající majetkovým poměrům.',
          legalNote: '§ 760 OZ (Výživné rozvedeného manžela) & § 710 odst. 2 OZ (Závazky převzaté bez souhlasu).',
          actionablePoints: [
            'Prověřte, zda má druhý rodič objektivní pracovní schopnost a možnosti výdělku.',
            'Podávejte námitky proti dluhům vzniklým bez vašeho souhlasu (§ 710 OZ).',
            'Konzultujte majetkovou smlouvu nebo předběžné opatření k SJM s advokátem.'
          ]
        }
      ]
    },
    {
      id: 'psychika',
      title: '2. Psychická podpora & Prevence',
      subtitle: 'Zvládání krizového stresu, seberegulace v konfliktech, pravidlo 24 hodin a psychohygiena',
      icon: Brain,
      badgeText: 'Psychika & Podpora',
      subsections: [
        {
          id: 'seberegulace-stres',
          title: 'Klidná hlava v krizi a zvládání emočních provokací',
          situation: 'Otec zažívá pocity bezmoci, hněv, spánkovou deprivaci nebo úzkost způsobenou křivými obviněními a restrikcemi styku.',
          solution: 'Vaše vyrovnanost a stabilita je klíčovým důkazem u OSPOD i u soudu. Zaveďte pravidlo 24 hodin na odpovědi, oddělte emoční bolest od rodičovské role a v případě akutní nouze využijte krizové linky a terapeuty.',
          legalNote: 'Nález Ústavního soudu II. ÚS 2943/14 (Hodnocení výchovných předpokladů rodičů).',
          actionablePoints: [
            'Aplikujte pravidlo 24 hodin: Neodpovídejte na konfrontační zprávy okamžitě v afektu.',
            'Využijte Anonymní Linku První psychické pomoci (116 123) nebo vyhledejte psychoterapii.',
            'Zaměřte se na fyzický pohyb, kvalitní spánek a podporu blízkých přátel.'
          ]
        }
      ]
    },
    {
      id: 'deti',
      title: '3. Jak mluvit s dítětem',
      subtitle: 'Komunikace s dětmi o rozchodu citlivě, věkově přiměřeně, bez viny a bez traumatu',
      icon: Heart,
      badgeText: 'Děti & Komunikace',
      subsections: [
        {
          id: 'rozhovor-dite',
          title: 'Jak mluvit s dítětem o rozchodu bez viny a manipulace',
          situation: 'Dítě je zmatené, klade otázky, proč táta s mámou nežijí společně, nebo pociťuje sekundární vinu za rozpad rodiny.',
          solution: 'Přizpůsobte vysvětlení věku dítěte. Ujistěte ho, že rozchod je rozhodnutí dospělých, že za něj dítě nemůže a že máma i táta ho nepřestávají milovat na 100 %. Nikdy neusměrňujte hněv na druhého rodiče před dětmi.',
          legalNote: 'Článek 9 Úmluvy o právech dítěte (Právo na péči obou rodičů).',
          actionablePoints: [
            'Použijte věkové formulace uvedené v níže obsaženém Průvodci rozhovorem.',
            'Ujistěte dítě: „Není to tvoje vina a oba pro tebe zůstáváme mámou a tátou.“',
            'Ochránit dítě před spory dospělých – nepředávejte mu soudní dokumenty ani výčitky.'
          ]
        }
      ]
    },
    {
      id: 'obrana-pas',
      title: '4. Ochrana před manipulací (PAS)',
      subtitle: 'Rozpoznání syndromu zavrhovaného rodiče, narativů, bránění ve styku a právní obrana',
      icon: ShieldAlert,
      badgeText: 'Obrana & PAS',
      subsections: [
        {
          id: 'ochrana-pas-sub',
          title: 'Ochrana před syndromem zavrhovaného rodiče (PAS) a popouzením',
          situation: 'Druhý rodič dětem systematicky namlouvá, že je táta opustil, ruší plánovaná předávání, odmítá telefonáty a vyvolává v dítěti silný konflikt loajality.',
          solution: 'Popouzení dětí a bránění ve styku je hrubým porušením rodičovské odpovědnosti. Ústavní soud ČR opakovaně judikoval, že soudy a OSPOD mají povinnost aktivně zakročit proti manipulaci a zajistit obnovení vazeb.',
          legalNote: 'Nálezy Ústavního soudu IV. ÚS 1921/17 & III. ÚS 149/20 (Sankce za bránění ve styku a popouzení).',
          actionablePoints: [
            'Vedete si detailní log docházky a incidentů bezmoci při předávání.',
            'Podejte podnět na OSPOD k zahájení odborné práce s rodinou (terapie, krizová mediace).',
            'Podejte návrh na výkon rozhodnutí uložením pokuty nebo předběžné opatření podle § 452 o.s.ř.'
          ]
        }
      ]
    },
    {
      id: 'bydleni-ospod',
      title: '5. Nové bydlení & OSPOD',
      subtitle: 'Opouštění domácnosti, výměna zámků, standardy bydlení, OSPOD šetření a dávky MPSV',
      icon: Home,
      badgeText: 'Bydlení & OSPOD',
      subsections: [
        {
          id: 'opusteni-domacnosti',
          title: 'Opouštění společné domácnosti bez písemné dohody',
          situation: 'Otec pod psychickým tlakem sbalí tašku a dočasně odejde ze společného bytu či domu. Druhý rodič vzápětí vymění zámky, zamezí kontaktu s dětmi a u OSPOD/soudu tvrdí, že otec o děti nemá zájem, opustil rodinu a děti si zvykly na výhradní péči matky.',
          solution: 'Neopouštějte společnou domácnost bez předchozí písemné dohody o úpravě péče a styku s dětmi! Pokud je situace neúnosná a musíte se z bezpečnostních důvodů vzdálit, uzavřete okamžitě Dozatímní dohodu o péči, informujte OSPOD a trvejte na pravidelném kontaktu s dětmi ode dne 1.',
          legalNote: '§ 743 Občanského zákoníku (OZ) – Právo na bydlení po rozvodu; Nález Ústavního soudu I. ÚS 1506/13 k zachování rodičovského kontaktu.',
          actionablePoints: [
            'Sjednejte písemnou Dozatímní dohodu o péči a styku s dětmi před fyzickým odstěhováním.',
            'Oznámte svou novou doručovací adresu orgánu OSPOD i druhému rodiči prokazatelnou formou (e-mail, datová schránka).',
            'Trvejte na přesných dnech a hodinách předávání dětí ihned od prvního týdne.',
            'Udržujte podrobný deník o všech pokusech o kontakt a předávání dětí.'
          ]
        },
        {
          id: 'ospod-setreni',
          title: 'Příprava domácnosti pro místní šetření OSPOD',
          situation: 'OSPOD plánuje navštívit vaše nové bydlení, aby posoudil, zda prostředí vyhovuje hygienickým, bezpečnostním a prostorovým nárokům pro péči o děti.',
          solution: 'Připravte pro každé dítě stálé lůžko, studijní/připravný stůl, úložný prostor na oblečení a věci, čisté sociální zázemí, hračky a zásobu potravin. OSPOD hodnotí celkovou stabilizaci a bezpečí prostředí.',
          legalNote: '§ 14 Zákona o sociálně-právní ochraně dětí (ZSPOD) – Místní šetření.',
          actionablePoints: [
            'Projděte si níže uvedený Checklist Připravenosti Bydlení pro OSPOD.',
            'Mějte připravené lékařské zprávy, kontakty na školu a rozpis kroužků dětí.',
            'Během návštěvy OSPOD jednoduše ukažte prostory a projevte vstřícnost a klid.'
          ]
        },
        {
          id: 'statni-davky',
          title: 'Státní sociální podpora MPSV (Příspěvek na bydlení, MOP, JENDA)',
          situation: 'Skokové zvýšení životních nákladů spojené se zařizováním nové domácnosti vytváří dočasnou finanční tíseň.',
          solution: 'Zažádejte si o státní sociální podporu přes klientský portál JENDA (MPSV). Můžete dosáhnout na Příspěvek na bydlení, Mimořádnou okamžitou pomoc (MOP) na kauci či vybavení nebo Přídavek na dítě.',
          legalNote: 'Zákon č. 117/1995 Sb., o státní sociální podpoře & Zákon č. 111/2006 Sb., o pomoci v hmotné nouzi.',
          actionablePoints: [
            'Podávejte žádosti elektronicky přes portál JENDA (mpsv.cz) s Identitou občana.',
            'Příspěvek na bydlení lze nárokovat, pokud náklady na bydlení přesahují 30 % rozhodného příjmu.',
            'V případě akutní nouze požádejte Úřad práce o Mimořádnou okamžitou pomoc (MOP).'
          ]
        }
      ]
    },
    {
      id: 'mediace',
      title: '6. Rodinná mediace & Dohoda',
      subtitle: 'Mimosoudní řešení sporů, tvorba stabilní rodičovské dohody a deeskalace konfliktů BIFF metodou',
      icon: HeartHandshake,
      badgeText: 'Mediace & Dohoda',
      subsections: [
        {
          id: 'emocni-prestrelky',
          title: 'Eliminace emočních výčitek a provokací v textové komunikaci (BIFF)',
          situation: 'Druhý rodič zasílá dlouhé, osobní, útočné e-maily a SMS zprávy plné výčitek z minulosti a urážek s cílem vyprovokovat vás k hněvivé reakci.',
          solution: 'Neodpovídejte na osobní útoky ani na lživá obvinění. Reagujte výhradně na věcné informace týkající se zdraví, školy a logistiky dětí s využitím metody BIFF (Brief, Informative, Friendly, Firm).',
          legalNote: 'Metoda BIFF (High Conflict Institute, Bill Eddy) uznávaná rodinnými soudy v ČR.',
          actionablePoints: [
            'B – Brief (Stručná): Maximálně 2–5 věty bez omáčky.',
            'I – Informative (Informativní): Pouze fakta, časy, místa a podstatné informace.',
            'F – Friendly (Zdvořilá): Neutrální nebo zdvořilý tón („Dobrý den“, „Děkuji“).',
            'F – Firm (Pevná): Jasný závěr bez otevírání nekonečné diskuze.'
          ]
        },
        {
          id: 'rodinna-mediace-sub',
          title: 'Rodinná mediace a příprava rodičovského plánu',
          situation: 'Rodiče se nemohou dohodnout na rozložení péče, výživném nebo prázdninách a hrozí táhlý soudní spor.',
          solution: 'Zapsaný rodinný mediátor pomáhá rodičům nalézt oboustranně přijatelnou dohodu v klidném a neutrálním prostředí.',
          legalNote: 'Zákon č. 202/2012 Sb., o mediaci.',
          actionablePoints: [
            'Navrhněte druhému rodiči 3 nezávislé zapsané rodinné mediátory.',
            'Připravte si konkrétní návrh harmonogramu střídavé péče a rozpisu svátků.',
            'Výslednou dohodu nechte schválit opatrovnickým soudem pro získání vykonatelnosti.'
          ]
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn" id="life-situation-module">
      
      {/* BREADCRUMBS */}
      <Breadcrumbs activeTab="zivotni-situace" setActiveTab={setActiveTab} />

      {/* HEADER SECTION - DARK BACKGROUND (bg-slate-900) WITH EMERALD QUOTE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold uppercase tracking-wider font-mono">
            <Shield className="w-4 h-4 text-emerald-400" />
            Sekundární modul supportu • Synthesis OS
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Životní situace po rozchodu & Stabilizace zázemí
          </h1>

          {/* REQUIRED EMERALD BLOCKQUOTE */}
          <blockquote className="border-l-4 border-emerald-500 pl-4 py-3 my-4 bg-slate-800/80 rounded-r-2xl text-emerald-400 text-sm sm:text-base font-medium italic leading-relaxed shadow-inner">
            „Hlavní pilíř portálu: Primárním cílem zůstává nejlepší zájem dítěte, jeho právo na péči obou rodičů a stabilní střídavá či společná péče. Stabilizace vašich financí, domova a duševní pohody vytváří nezbytné zázemí pro vaše rodičovské působení.“
          </blockquote>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Komplexní metodický a praktický průvodce pro otce v krizové fázi rozchodu. Získejte okamžité návody pro řešení bydlení, financí, psychického tlaku, komunikace i podpory OSPOD a státních dávek.
          </p>

          {/* QUICK CONTROLS BAR */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Struktura:</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded-md text-emerald-400 font-mono">6 Hlavních Kategorií</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Rozbalit vše
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Sbalit vše
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CATEGORY SELECTOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isExpanded = expandedCategories[cat.id];
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                toggleCategory(cat.id);
                const el = document.getElementById(cat.id) || document.getElementById(`cat-${cat.id}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isExpanded
                  ? 'bg-emerald-950/80 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30 text-white'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-xl ${isExpanded ? 'bg-emerald-800/60 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  isExpanded ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cat.badgeText}
                </span>
              </div>

              <div>
                <h3 className={`text-xs font-extrabold leading-snug ${isExpanded ? 'text-white' : 'text-slate-900'}`}>
                  {cat.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100/20 font-medium">
                <span className={isExpanded ? 'text-emerald-400' : 'text-emerald-700'}>
                  {isExpanded ? 'Sbalit blok' : 'Otevřít sekci'}
                </span>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* ACCORDION CATEGORIES LIST */}
      <div className="space-y-6">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const isOpen = expandedCategories[category.id];

          return (
            <div
              key={category.id}
              id={category.id}
              className={`bg-white border rounded-3xl transition-all shadow-xs overflow-hidden scroll-mt-20 ${
                isOpen ? 'border-emerald-300/80 ring-2 ring-emerald-500/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Category Accordion Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full p-6 sm:p-8 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider font-mono rounded-md">
                      {category.badgeText}
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {category.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {category.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 shrink-0 transition-colors mt-1">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-700" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Category Body */}
              {isOpen && (
                <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 space-y-8 animate-fadeIn">
                  
                  {/* SUBSECTIONS LIST WITH VISUAL SEPARATION: SITUACE VS ŘEŠENÍ */}
                  <div className="space-y-6 pt-6">
                    {category.subsections.map((sub, idx) => (
                      <div
                        key={sub.id}
                        className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-5 hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                            {sub.title}
                          </h3>
                        </div>

                        {/* VISUAL TWO-COLUMN / TWO-BOX LAYOUT: SITUACE VS ŘEŠENÍ */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          
                          {/* BOX 1: SITUACE (PROBLEM & RISKS) */}
                          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 space-y-3">
                            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase font-mono tracking-wide">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>⚠️ Situace & Rizika:</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                              {sub.situation}
                            </p>
                          </div>

                          {/* BOX 2: ŘEŠENÍ (ACTIONABLE ADVICE) */}
                          <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-5 space-y-3">
                            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm uppercase font-mono tracking-wide">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>💡 Řešení (Actionable Advice):</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                              {sub.solution}
                            </p>

                            {sub.legalNote && (
                              <div className="pt-2 border-t border-emerald-200/80 text-[11px] font-mono text-emerald-900 flex items-center gap-1.5">
                                <Scale className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                <span>{sub.legalNote}</span>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* ACTIONABLE CHECKLIST POINTS */}
                        {sub.actionablePoints && sub.actionablePoints.length > 0 && (
                          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono text-slate-600">
                              Doporučené akční kroky v praxi:
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                              {sub.actionablePoints.map((point, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span className="leading-snug">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                  {/* EMBEDDED INTERACTIVE TOOLS INSIDE CORRESPONDING CATEGORY */}
                  
                  {/* CATEGORY 2 INTERACTIVE TOOL: BUDGET CALCULATOR */}
                  {category.id === 'financni-plan' && (
                    <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg mt-8">
                      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                        <Calculator className="w-6 h-6 text-emerald-400" />
                        <div>
                          <h3 className="font-extrabold text-lg text-white">Kalkulačka Krizového Rozpočtu Táty po Rozchodu</h3>
                          <p className="text-xs text-slate-400">Ověřte si reálné finanční krytí vaší nové domácnosti a dětí</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1.5">Čistý měsíční příjem (Kč)</label>
                          <input
                            type="number"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1.5">Odhadované/platné výživné (Kč)</label>
                          <input
                            type="number"
                            value={estimatedAlimony}
                            onChange={(e) => setEstimatedAlimony(Number(e.target.value) || 0)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1.5">Náklady na nové bydlení (Kč)</label>
                          <input
                            type="number"
                            value={housingCost}
                            onChange={(e) => setHousingCost(Number(e.target.value) || 0)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1.5">Splátky dluhů & hypotéka (Kč)</label>
                          <input
                            type="number"
                            value={debtsAndLoans}
                            onChange={(e) => setDebtsAndLoans(Number(e.target.value) || 0)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                          <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Volný zůstatek na život & děti</div>
                          <div className={`text-2xl font-black font-mono mt-1 ${budgetResult.netDisposable >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {budgetResult.netDisposable.toLocaleString()} Kč / měsíc
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {budgetResult.netDisposable >= 10000 
                              ? 'Dostatečná finanční rezerva pro zabezpečení potřeb dětí a provoz domácnosti.' 
                              : budgetResult.netDisposable >= 0 
                              ? 'Těsný rozpočet. Doporučujeme revizi výdajů nebo konsolidaci půjček.' 
                              : 'Varování: Rozpočet je v záporu! Je nutné upravit výživné nebo řešit náklady na bydlení.'}
                          </p>
                        </div>

                        <div className="border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
                          <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Doporučený krizový fond (3 měsíce)</div>
                          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                            {budgetResult.recommendedReserve.toLocaleString()} Kč
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Rezervní fond pro nepředvídatelné výdaje dětí (lékař, škola v přírodě) a ochranu před exekucí.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CATEGORY 3 INTERACTIVE TOOL: CHILD CONVERSATION GUIDE */}
                  {category.id === 'psychika-dite' && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs mt-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-900">Průvodce citlivým rozhovorem s dítětem</h3>
                          <p className="text-xs text-slate-500">Vyberte věkový stupeň pro doporučené formulace</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setChildAgeGroup('toddler')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              childAgeGroup === 'toddler' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Předškolní (3–6 let)
                          </button>
                          <button
                            type="button"
                            onClick={() => setChildAgeGroup('school')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              childAgeGroup === 'school' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Školní (7–11 let)
                          </button>
                          <button
                            type="button"
                            onClick={() => setChildAgeGroup('teen')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              childAgeGroup === 'teen' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Dospívající (12–16 let)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* DO Formulation */}
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
                          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span>Doporučené formulace (Co říkat):</span>
                          </div>
                          <div className="text-xs text-emerald-950 space-y-2 leading-relaxed">
                            {childAgeGroup === 'toddler' && (
                              <>
                                <p>• „Máma i táta tě pořád moc milují a vždycky budou tvůj táta a máma.“</p>
                                <p>• „Budeš mít dvě postýlky – jednu u táty a jednu u mámy, kde budeš mít své hračky.“</p>
                                <p>• „Není to tvoje vina. Dospělí se někdy rozhodnou bydlet zvlášť.“</p>
                              </>
                            )}
                            {childAgeGroup === 'school' && (
                              <>
                                <p>• „S mámou už nebudeme bydlet v jednom bytě, ale oba zůstáváme tvými rodiči na 100 %.“</p>
                                <p>• „Kdykoliv budeš u mě, budeme dělat úkoly do školy a mít náš čas spolu.“</p>
                                <p>• „O dětských věcech se s mámou domlouváme tak, aby to pro tebe bylo nejlepší.“</p>
                              </>
                            )}
                            {childAgeGroup === 'teen' && (
                              <>
                                <p>• „Respektuji tvůj názor a tvé kamarády. Můj domov je otevřený pro vše, co potřebuješ.“</p>
                                <p>• „Dospělé spory jsou naše věc, tebe z nich vynecháváme.“</p>
                                <p>• „Můžeš se na mě spolehnout ve všem – od školy po sporty.“</p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* DONT Formulation */}
                        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3">
                          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                            <span>Nevhodné formulace (Čemu se vyhnout):</span>
                          </div>
                          <div className="text-xs text-rose-950 space-y-2 leading-relaxed">
                            {childAgeGroup === 'toddler' && (
                              <>
                                <p>• ❌ „Máma nás opustila a nechce s námi být.“</p>
                                <p>• ❌ „Musíš si vybrat, u koho chceš raději spinkat.“</p>
                              </>
                            )}
                            {childAgeGroup === 'school' && (
                              <>
                                <p>• ❌ „Máma mi nechce dát peníze na tvoje kroužky.“</p>
                                <p>• ❌ „Řekni mámě, že u mě ti bylo líp než u ní.“</p>
                              </>
                            )}
                            {childAgeGroup === 'teen' && (
                              <>
                                <p>• ❌ „Podívej se, co všechno máma napsala k soudu.“</p>
                                <p>• ❌ „Jsi dost starý/á na to, abys věděl/a pravdu o matce.“</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CATEGORY 4 INTERACTIVE TOOL: BIFF CONVERTER */}
                  {category.id === 'biff-komunikace' && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs mt-8">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <Sparkles className="w-6 h-6 text-emerald-600" />
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-900">Interaktivní BIFF Převodník Komunikace</h3>
                          <p className="text-xs text-slate-500">Transformujte konfrontační či emotivní text na věcnou zprávu vhodnou pro soud</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        <div className="space-y-2">
                          <label className="block text-slate-700 font-bold">
                            Původní návrh zprávy (s emocemi či výčitkou):
                          </label>
                          <textarea
                            rows={4}
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Vložte text SMS nebo e-mailu..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:border-emerald-500 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={convertToBiff}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            Převést na věcný BIFF tvar
                          </button>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-slate-700 font-bold flex items-center justify-between">
                            <span>Vyčištěná BIFF verze (vhodná pro soud):</span>
                            {convertedBiff && (
                              <button
                                type="button"
                                onClick={handleCopyBiff}
                                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                {copiedBiff ? 'Zkopírováno!' : 'Zkopírovat'}
                              </button>
                            )}
                          </label>

                          <div className="w-full min-h-[108px] bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-slate-800 text-xs leading-relaxed">
                            {convertedBiff ? (
                              convertedBiff
                            ) : (
                              <span className="text-slate-400 italic">Klikněte na tlačítko "Převést" pro vygenerování deeskalované BIFF odpovědi...</span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500">
                            Vygenerovaný text obsahuje pouze nezbytná fakta, jasný termín a neutrální tón.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CATEGORY 5 INTERACTIVE TOOL: OSPOD CHECKLIST */}
                  {category.id === 'ospod-podpora' && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs mt-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-900">Checklist Připravenosti Bydlení pro OSPOD Šetření</h3>
                          <p className="text-xs text-slate-500">Zaškrtněte vybavenost vaší domácnosti pro automatické vyhodnocení</p>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
                          <span className="text-xs text-slate-600 font-medium">Skóre připravenosti:</span>
                          <span className={`text-lg font-black font-mono ${housingScore >= 80 ? 'text-emerald-600' : housingScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {housingScore} %
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                          <input
                            type="checkbox"
                            checked={housingChecks.bed}
                            onChange={() => toggleHousingCheck('bed')}
                            className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="font-semibold text-slate-800">Vlastní postel pro každé dítě</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                          <input
                            type="checkbox"
                            checked={housingChecks.desk}
                            onChange={() => toggleHousingCheck('desk')}
                            className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="font-semibold text-slate-800">Pracovní/psací stůl</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                          <input
                            type="checkbox"
                            checked={housingChecks.storage}
                            onChange={() => toggleHousingCheck('storage')}
                            className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="font-semibold text-slate-800">Úložný prostor na oblečení</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                          <input
                            type="checkbox"
                            checked={housingChecks.hygiene}
                            onChange={() => toggleHousingCheck('hygiene')}
                            className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="font-semibold text-slate-800">Čisté hygienické zázemí</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                          <input
                            type="checkbox"
                            checked={housingChecks.toys}
                            onChange={() => toggleHousingCheck('toys')}
                            className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="font-semibold text-slate-800">Hračky, knihy, pomůcky</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                          <input
                            type="checkbox"
                            checked={housingChecks.safety}
                            onChange={() => toggleHousingCheck('safety')}
                            className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="font-semibold text-slate-800">Bezpečnostní prvky a čistota</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                          <input
                            type="checkbox"
                            checked={housingChecks.schoolDist}
                            onChange={() => toggleHousingCheck('schoolDist')}
                            className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="font-semibold text-slate-800">Dostupnost do školy/školky</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                          <input
                            type="checkbox"
                            checked={housingChecks.food}
                            onChange={() => toggleHousingCheck('food')}
                            className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="font-semibold text-slate-800">Zásoba potravin a vaření</span>
                        </label>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-base sm:text-lg text-white">
            Potřebujete právní podání nebo pomoc s přípravou dohody o péči?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Využijte AI Právního Asistenta pro tvorbu návrhu na střídavou péči, vygenerování vzorů podání nebo pokračujte v Osobní Pracovně.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('ai-assistant')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            AI Asistent
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ke-stazeni')}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-700 flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            Vzory podání (DOCX)
          </button>
        </div>
      </div>

    </div>
  );
}
