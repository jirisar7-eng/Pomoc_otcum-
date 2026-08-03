import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Wallet, 
  Brain, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Calculator, 
  Copy, 
  Check, 
  FileText, 
  Scale, 
  ArrowRight,
  ArrowLeft,
  BookOpen,
  HeartHandshake,
  MessageSquare,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

export interface LifeSituationSectionProps {
  setActiveTab: (tab: string) => void;
  onOpenAuth?: () => void;
  initialSubTab?: string;
}

export interface SituationCategory {
  id: string;
  slug: string;
  canonicalPath: string;
  title: string;
  subtitle: string;
  badgeText: string;
  icon: React.ComponentType<{ className?: string }>;
  legalBasis: string;
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
  // Normalize initialSubTab to determine if we are on the main overview or a specific standalone subpage
  const getActiveCategorySlug = (subTab?: string): string | null => {
    if (!subTab) return null;
    const clean = subTab.trim().toLowerCase();

    if (clean === 'zivotni-situace' || clean === 'life-situation' || clean === 'zazemi') {
      return null;
    }

    const map: Record<string, string> = {
      'sjm': 'sjm',
      'majetek-sjm': 'sjm',
      'zazemi/sjm': 'sjm',
      'zivotni-situace/sjm': 'sjm',

      'psychika': 'psychicka-podpora',
      'psychicka-podpora': 'psychicka-podpora',
      'zazemi/psychika': 'psychicka-podpora',
      'zivotni-situace/psychicka-podpora': 'psychicka-podpora',
      'zivotni-situace/psychika': 'psychicka-podpora',

      'deti': 'jak-mluvit-s-ditetem',
      'rozhovor-dite': 'jak-mluvit-s-ditetem',
      'jak-mluvit-s-ditetem': 'jak-mluvit-s-ditetem',
      'zazemi/deti': 'jak-mluvit-s-ditetem',
      'zivotni-situace/jak-mluvit-s-ditetem': 'jak-mluvit-s-ditetem',
      'zivotni-situace/deti': 'jak-mluvit-s-ditetem',

      'obrana-pas': 'pas',
      'ochrana-manipulace': 'pas',
      'pas': 'pas',
      'zazemi/obrana-pas': 'pas',
      'zivotni-situace/pas': 'pas',
      'zivotni-situace/obrana-pas': 'pas',

      'bydleni-ospod': 'novy-domov-ospod',
      'bydleni-zazemi': 'novy-domov-ospod',
      'novy-domov-ospod': 'novy-domov-ospod',
      'zazemi/bydleni-ospod': 'novy-domov-ospod',
      'zivotni-situace/novy-domov-ospod': 'novy-domov-ospod',
      'zivotni-situace/bydleni-ospod': 'novy-domov-ospod',

      'mediace': 'mediace',
      'rodinna-mediace': 'mediace',
      'zazemi/mediace': 'mediace',
      'zivotni-situace/mediace': 'mediace',
      'biff-komunikace': 'mediace',
      'biff-communicator': 'mediace'
    };

    return map[clean] || null;
  };

  const activeCategorySlug = getActiveCategorySlug(initialSubTab);

  // Scroll to top when subpage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategorySlug]);

  // Interactive Tool 1: Budget Calculator (SJM)
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

  // Interactive Tool 5: PAS Warning Detector
  const [pasChecks, setPasChecks] = useState<Record<string, boolean>>({
    denial: true,
    insults: true,
    secrecy: false,
    blockingCalls: true,
    falseAccusation: false
  });

  const togglePasCheck = (key: string) => {
    setPasChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const pasCount = Object.values(pasChecks).filter(Boolean).length;

  // 6 DEFINITIVE STANDALONE CATEGORIES
  const categories: SituationCategory[] = [
    {
      id: 'sjm',
      slug: 'sjm',
      canonicalPath: '/zivotni-situace/sjm',
      title: 'SJM & Majetkové vypořádání',
      subtitle: 'Rozpočet nové domácnosti, vypořádání SJM, hypotéky, prevence dluhů a ochrana financí po rozchodu',
      icon: Wallet,
      badgeText: 'Finance & SJM',
      legalBasis: '§ 710 OZ (Závazky v SJM) & § 736 OZ (Vypořádání SJM k datu zániku)',
      subsections: [
        {
          id: 'blokace-uctov',
          title: 'Ochrana před vybráním společných účtů a zneužitím kreditních karet',
          situation: 'Jeden z partnerů po rozchodu převede společné úspory na soukromý účet, vyčerpá kontokorent nebo nakupuje na společnou kreditní kartu bez vědomí druhého.',
          solution: 'Okamžitě odeberte plné moci ke svým osobním účtům, zřiďte si nový samostatný bankovní účet u jiné banky a požádejte o blokaci společných kreditních karet a kontokorentů. Všechny převody ze společných účtů pečlivě zdokumentujte pro vypořádání SJM.',
          legalNote: '§ 710 OZ & § 736 OZ (Vypořádání SJM k datu zániku).',
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
            'Prokazatelně hraděte výživné na děti i před rozhodnutím soudu (trvalým příkazem s poznámkou "Výživné [Jméno dítěte]").'
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
            'Trvejte na písemné dohodě o vypořádání SJM schválené soudem nebo notářským zápisem.',
            'Sledujte insolvenční rejstřík (ISIR), zda druhý rodič nevytváří dluhy v insolvenci.'
          ]
        }
      ]
    },
    {
      id: 'psychicka-podpora',
      slug: 'psychicka-podpora',
      canonicalPath: '/zivotni-situace/psychicka-podpora',
      title: 'Psychická podpora & Prevence',
      subtitle: 'Zvládání rozchodového stresu, psychická stabilizace otce, podpora komunity a krizové kontakty',
      icon: Brain,
      badgeText: 'Psychická stabilizace',
      legalBasis: 'Krizová intervence 24/7 & Psychologická péče pro rodiče v rozvodové krizi',
      subsections: [
        {
          id: 'krizova-intervence',
          title: 'Akutní psychická krize a de-eskalace emocí',
          situation: 'Otec pociťuje paniku, pocit bezmoci, nespavost nebo náhlý úbytek sil v důsledku odloučení od dětí a vyhrocených právních kroků.',
          solution: 'Využijte bezplatnou krizovou linku nebo anonymní chat krizové intervence. Nečte ani nepište emotivní zprávy pozdě v noci. Zavijte pravidlo 24hodinové pauzy před odesláním reakce.',
          legalNote: 'Linka první psychické pomoci: 116 123 (zdarma 24/7).',
          actionablePoints: [
            'Uložte si do telefonu kontakt na Linku první psychické pomoci: 116 123.',
            'Zaveďte si pravidlo "Před odesláním e-mailu počkat 24 hodin" pro vyprchání emocí.',
            'Vyhledejte psychoterapeuta se specializací na rodinné právo a rodičovské krize.'
          ]
        },
        {
          id: 'syndrom-vyhoreni',
          title: 'Prevence syndromu vyhoření rodiče a fyzická regenerace',
          situation: 'Dlouhodobé opatrovnické soudní řízení trvající měsíce až roky vede k vyčerpání organismu, poklesu pracovního výkonu a zdravotním komplikacím.',
          solution: 'Rozdělte své denní síly. Oddělte proces opatrovnického soudu od osobního času stráveného s dětmi. Udržujte pravidelný pohyb, spánkovou hygienu a zapojte blízké přátele či svépomocnou skupinu otců.',
          legalNote: 'Doporučená metodika psychologické péče pro účastníky opatrovnických řízení.',
          actionablePoints: [
            'Vymezte si v týdnu 2 hodiny bez jakéhokoliv řešení právních věcí nebo soudu.',
            'Zapojte se do svépomocné komunity otců pro sdílení zkušeností a vzájemnou oporu.',
            'Vyhledejte odbornou podporu (psycholog, terapeut) dříve, než dojde k kolapsu.'
          ]
        }
      ]
    },
    {
      id: 'jak-mluvit-s-ditetem',
      slug: 'jak-mluvit-s-ditetem',
      canonicalPath: '/zivotni-situace/jak-mluvit-s-ditetem',
      title: 'Jak mluvit s dítětem',
      subtitle: 'Citlivá komunikace s dětmi různých věkových skupin, ochrana před konflikty dospělých a ujištění o lásce obou rodičů',
      icon: MessageSquare,
      badgeText: 'Citlivá komunikace',
      legalBasis: '§ 880 OZ (Právo dítěte na péči obou rodičů a ochranu před rodinným konfliktem)',
      subsections: [
        {
          id: 'vysvetleni-rozchodu',
          title: 'Jak vysvětlit rozchod bez svalování viny na druhého rodiče',
          situation: 'Dítě se ptá, proč teta/máma/táta nežijí spolu, nebo vyjadřuje strach, že ztratí jednoho z rodičů.',
          solution: 'Vysvětlete situaci jazykem přiměřeným věku. Ujistěte dítě, že rozchod je záležitost dospělých, ne jeho vina, a že oba rodiče ho nadále milují a zůstávají jeho mámou a tátou na 100 %.',
          legalNote: '§ 880 OZ (Rodičovská odpovědnost a blaho dítěte).',
          actionablePoints: [
            'Používejte formulace: „Oba té moc milujeme, rozchod je věc dospělých, ne tvoje vina.“',
            'Kritiku druhého rodiče si nechte do terapie – před dítětem mluvte o druhém rodiči s respektem.',
            'Vytvořte dítěti jasný a předvídatelný režim (kalendář), kdy bude u tety/mámy/táty.'
          ]
        },
        {
          id: 'odpoved-na-vsevyzvedne-otazky',
          title: 'Odpovědi na zraňující otázky a manipulativní věty',
          situation: 'Dítě přichází z druhé domácnosti a říká: „Máma říkala, že nás nemáš rád a nechceš nám dát peníze.“',
          solution: 'Nereagujte útokem na matku. Zklidněte situaci věcným ubezpečením: „Rozumím, že tě to trápí. Já tě moc miluji a o penězích na tvé potřeby se s mámou domlouváme jako dospělí.“',
          legalNote: 'Metodika dětské psychologie pro komunikaci v rozvodovém období.',
          actionablePoints: [
            'Nerozporujte tvrzení dítěte agresivně, raději nabídněte pocit bezpečí a jistoty.',
            'Nevyzvídejte na dítěti informace o tom, co se děje v druhé domácnosti.',
            'Při náročných projevech konzultujte situaci s dětským psychologem.'
          ]
        }
      ]
    },
    {
      id: 'pas',
      slug: 'pas',
      canonicalPath: '/zivotni-situace/pas',
      title: 'Ochrana před manipulací (PAS)',
      subtitle: 'Detekce syndromu zavržení rodiče (PAS), právní obrana proti manipulaci dětí a judikatura Ústavního soudu',
      icon: Shield,
      badgeText: 'Ochrana před PAS',
      legalBasis: 'Nález ÚS II. ÚS 2943/14 & Nález ÚS I. ÚS 2441/13 (Povinnost soudu bránit odcizení)',
      subsections: [
        {
          id: 'detekce-pas',
          title: 'Rozpoznání prvních příznaků zavrhování rodiče a manipulace',
          situation: 'Dítě najednou bez objektivního důvodu odmítá kontakt s otcem, opakuje dospělé fráze matky nebo tvrdí, že se otce „bojí“.',
          solution: 'Zdokumentujte všechny projevy odcizení a dodržování/bezdůvodné maření styků. Podejte u soudu návrh na výkon rozhodnutí nebo návrh na odbornou terapii rodičů a dítěte pod dohledem znalce.',
          legalNote: 'Nález ÚS II. ÚS 2943/14 (Pasivita orgánů při manipulaci je porušením práv).',
          actionablePoints: [
            'Vedte si podrobný deník všech předání dětí, bezdůvodných omluv a výroků dítěte.',
            'Okamžitě písemně informujte OSPOD a trvejte na prověření manipulace.',
            'Při bezdůvodném nepřevzetí dítěte podejte k opatrovnickému soudu návrh na výkon rozhodnutí (pokuta/napomenutí).'
          ]
        },
        {
          id: 'pravni-kroky-pas',
          title: 'Rychlé právní nástroje k záchraně vazby s dítětem',
          situation: 'Soudní řízení se vleče a hrozí, že v důsledku dlouhé pauzy dojde k úplné ztrátě vazby mezi otcem a dítětem.',
          solution: 'Podejte návrh na předběžné opatření (§ 452 z.ř.s.) s požadavkem na asistovaný kontakt nebo změnu péče. Poukazujte na ustálenou judikaturu Ústavního soudu o povinnosti státu jednat neprodleně.',
          legalNote: '§ 452 z.ř.s. (Předběžné opatření ve věcech péče o nezletilé) & Nález ÚS III. ÚS 149/20.',
          actionablePoints: [
            'Podejte návrh na předběžné opatření pro okamžité obnovení kontaktu s dítětem.',
            'Navrhněte nařízení rodinné terapie či mediace schválené soudem.',
            'Pokud OSPOD selhává v ochraně vazby, podejte podnět k nadřízenému krajskému úřadu.'
          ]
        }
      ]
    },
    {
      id: 'novy-domov-ospod',
      slug: 'novy-domov-ospod',
      canonicalPath: '/zivotni-situace/novy-domov-ospod',
      title: 'Nové bydlení & OSPOD',
      subtitle: 'Příprava nového domova pro střídavou péči, šetření OSPOD v bytě otce a vytvoření stabilního zázemí',
      icon: Home,
      badgeText: 'Bydlení & OSPOD',
      legalBasis: 'Standardy sociálně-právní ochrany dětí (Šetření poměrů v domácnosti otce)',
      subsections: [
        {
          id: 'priprava-bytu-ospod',
          title: 'Jak připravit byt na šetření OSPOD a dokázat výborné zázemí',
          situation: 'OSPOD plánuje terénní šetření v novém pronajatém bytě otce pro posouzení vhodnosti pro střídavou péči.',
          solution: 'Zajistěte, aby dítě mělo vlastní postel, psací stůl, úložné prostory, věku přiměřené hračky a bezpečné, čisté prostředí. Připravte si doklady o lokalitě (blízkost školy, lékaře, kroužků).',
          legalNote: 'Metodický pokyn MPSV pro provádění šetření poměrů nezletilého dětí.',
          actionablePoints: [
            'Projděte si níže uvedený Checklist Připravenosti Bydlení pro OSPOD.',
            'Mějte v bytě připravené čisté lůžkoviny, základní potraviny a hygienické potřeby pro děti.',
            'Při návštěvě OSPOD vystupujte klidně, vstřícně a zdůrazňujte podporu vztahu dítěte s matkou.'
          ]
        },
        {
          id: 'spolocne-bydleni-zmena',
          title: 'Zajištění nového nájmu a stabilita školní docházky',
          situation: 'Otec hledá nový byt a řeší, jaká vzdálenost od původního domova a školy je akceptovatelná pro opatrovnický soud.',
          solution: 'Vyberte bydlení v rozumné dojezdové vzdálenosti od dosavadní školy/školky dítěte. Zachování stabilního školního a kroužkového kolektivu je pro soud zásadním argumentem pro střídavou péči.',
          legalNote: 'Nález ÚS I. ÚS 1554/14 (Kritérium dojezdové vzdálenosti a zachování prostředí dítěte).',
          actionablePoints: [
            'Při výběru bytu zohledněte dojezdovou vzdálenost do školy do 30–45 minut.',
            'Doložte soudu nájemní smlouvu nebo list vlastnictví k novému bydlení.',
            'Ukažte, že dokážete zajistit ranní odvoz do školy i odpoledne kroužky.'
          ]
        }
      ]
    },
    {
      id: 'mediace',
      slug: 'mediace',
      canonicalPath: '/zivotni-situace/mediace',
      title: 'Rodinná mediace & Dohoda',
      subtitle: 'Konstruktivní dohoda s druhým rodičem, první setkání s zapsaným mediátorem a metoda BIFF komunikace',
      icon: HeartHandshake,
      badgeText: 'Mediace & Dohoda',
      legalBasis: 'Zákon č. 202/2012 Sb. (O mediaci) & § 474 z.ř.s. (Nařízené první setkání s mediátorem)',
      subsections: [
        {
          id: 'prvni-setkani-mediace',
          title: 'Jak probíhá nařízené i dobrovolné setkání s mediátorem',
          situation: 'Soud nařídil prvotní setkání s zapsaným mediátorem v rozsahu 3 hodin, nebo otec navrhuje dobrovolnou mediaci.',
          solution: 'Mediace není soud ani psychoterapie. Cílem je nalézt fungující rodičovskou dohodu o péči a výživném bez zdlouhavých soudních sporů. Připravte si své prioritní body a buďte otevřeni kompromisům.',
          legalNote: '§ 474 z.ř.s. (První setkání s zapsaným mediátorem nařízené soudem).',
          actionablePoints: [
            'Sepište si předem 3 klíčové body, kterých chcete v dohodě dosáhnout (např. režim péče, prázdniny).',
            'Soustřeďte se výhradně na budoucnost dětí, ne na minulá partnerova pochybení.',
            'Výsledkem mediace je Rodičovská dohoda, kterou soud snadno a rychle schválí.'
          ]
        },
        {
          id: 'biff-metodika',
          title: 'Komunikační metoda BIFF pro de-eskalaci sporu',
          situation: 'Písemná komunikace s druhým rodičem je plná osobních útoků, výčitek a zdlouhavých argumentů.',
          solution: 'Aplikujte pravidla BIFF zpráv: Brief (stručná), Informative (informativní), Friendly (přívětivá/neutrální), Firm (pevná). Pište pouze k věci, bez emocí a s jasným termínem pro odpověď.',
          legalNote: 'Celosvětově uznávaný standard komunikace podle High Conflict Institute.',
          actionablePoints: [
            'Použijte níže uvedený Interaktivní BIFF Převodník Zpráv.',
            'Odpovídejte pouze na fakta a dotazy týkající se dětí, ignorujte osobní útoky.',
            'Udržujte e-mailovou komunikaci přehlednou pro případné předložení opatrovnickému soudu.'
          ]
        }
      ]
    }
  ];

  // Current active standalone category object
  const activeCategory = categories.find(c => c.slug === activeCategorySlug);

  // Function to navigate between standalone subpages
  const handleSelectSubpage = (path: string) => {
    try {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new Event('popstate'));
    } catch {
      window.location.href = path;
    }
    setActiveTab(path.replace('/zivotni-situace/', 'zivotni-situace/'));
  };

  // RENDER STANDALONE CATEGORY SUBPAGE IF SLUG MATCHES ONE OF THE 6 CATEGORIES
  if (activeCategory) {
    const Icon = activeCategory.icon;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        
        {/* BREADCRUMBS */}
        <Breadcrumbs activeTab={initialSubTab || 'zivotni-situace/sjm'} setActiveTab={setActiveTab} />

        {/* TOP SUBPAGE NAVIGATION & SWITCHER BAR */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* BACK TO OVERVIEW HUB BUTTON */}
          <a
            href="/zivotni-situace"
            onClick={(e) => {
              e.preventDefault();
              handleSelectSubpage('/zivotni-situace');
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs rounded-2xl transition-all shadow-2xs group shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700 transition-transform group-hover:-translate-x-1" />
            <span>Zpět na rozcestník situací</span>
          </a>

          {/* HORIZONTAL CATEGORY SWITCHER PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs">
            {categories.map((cat) => {
              const isActive = cat.slug === activeCategory.slug;
              const CatIcon = cat.icon;

              return (
                <a
                  key={cat.id}
                  href={cat.canonicalPath}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectSubpage(cat.canonicalPath);
                  }}
                  className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isActive 
                      ? 'bg-slate-900 text-emerald-400 border-slate-800 shadow-xs' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <CatIcon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{cat.badgeText}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* HERO BANNER FOR ACTIVE CATEGORY */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white shadow-2xl space-y-5">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-lg">
                <Icon className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider rounded-full">
                {activeCategory.badgeText}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {activeCategory.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
              {activeCategory.subtitle}
            </p>

            {/* LEGAL BASIS CITATION BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/90 border border-slate-700 rounded-2xl text-emerald-400 text-xs font-mono font-medium shadow-inner">
              <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Právní opora & standardy: {activeCategory.legalBasis}</span>
            </div>
          </div>
        </div>

        {/* SUBSECTIONS LIST FOR ACTIVE CATEGORY */}
        <div className="space-y-6">
          {activeCategory.subsections.map((sub, idx) => (
            <div
              key={sub.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-2xl bg-slate-900 text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                  {sub.title}
                </h2>
              </div>

              {/* TWO-COLUMN SITUATION VS SOLUTION LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* BOX 1: SITUACE (PROBLEM & RISKS) */}
                <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase font-mono tracking-wider">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                    <span>⚠️ Krizový stav & Rizika:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {sub.situation}
                  </p>
                </div>

                {/* BOX 2: ŘEŠENÍ (ACTIONABLE ADVICE) */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase font-mono tracking-wider">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span>💡 Doporučené odborné řešení:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {sub.solution}
                  </p>

                  {sub.legalNote && (
                    <div className="pt-3 border-t border-emerald-200 text-[11px] font-mono text-emerald-900 flex items-center gap-2">
                      <Scale className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{sub.legalNote}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* ACTIONABLE CHECKLIST POINTS */}
              {sub.actionablePoints && sub.actionablePoints.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono">
                    Doporučené okamžité kroky v praxi:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-800">
                    {sub.actionablePoints.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* EMBEDDED INTERACTIVE TOOL TAILORED FOR ACTIVE CATEGORY */}

        {/* TOOL 1: SJM BUDGET CALCULATOR */}
        {activeCategory.slug === 'sjm' && (
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Calculator className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="font-extrabold text-lg text-white">Kalkulačka Krizového Rozpočtu Táty po Rozchodu</h3>
                <p className="text-xs text-slate-400">Ověřte si reálné finanční krytí vaší nové domácnosti a potřeby dětí</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
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
                  Rezervní fond pro nepředvídatelné výdaje dětí a ochranu před exekucí.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: PSYCHICKÁ PODPORA CRISIS CALLOUT */}
        {activeCategory.slug === 'psychicka-podpora' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <PhoneCall className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Krizové kontakty a první pomoc při přetížení</h3>
                <p className="text-xs text-slate-500">Bezplatné a anonymní linky důvěry dostupné 24 hodin denně</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-2">
                <div className="text-rose-900 font-extrabold text-sm">Linka první psychické pomoci</div>
                <div className="text-2xl font-black font-mono text-rose-700">116 123</div>
                <p className="text-rose-950 text-[11px] leading-relaxed">
                  Anonymní, bezplatná linka pro dospělé v akutní krizové situaci. K dispozici nonstop.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
                <div className="text-emerald-900 font-extrabold text-sm">Linka Bezpečí (pro děti)</div>
                <div className="text-2xl font-black font-mono text-emerald-700">116 111</div>
                <p className="text-emerald-950 text-[11px] leading-relaxed">
                  Pokud je vaše dítě ve stresu z rozchodu rodičů, může zdarma a anonymně zavolat.
                </p>
              </div>

              <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="text-emerald-400 font-extrabold text-sm">Pravidlo 24 hodin v afektu</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Nikdy neodpovídejte na útočné zprávy matky ihned. Napište odpověď do poznámek a pošlete ji až druhý den ráno po vyprchání emocí.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: JAK MLUVIT S DÍTĚTEM AGE GUIDE */}
        {activeCategory.slug === 'jak-mluvit-s-ditetem' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Průvodce citlivým rozhovorem s dítětem</h3>
                <p className="text-xs text-slate-500">Vyberte věkový stupeň pro doporučené formulace</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChildAgeGroup('toddler')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    childAgeGroup === 'toddler' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Předškolní (3–6 let)
                </button>
                <button
                  type="button"
                  onClick={() => setChildAgeGroup('school')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    childAgeGroup === 'school' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Školní (7–11 let)
                </button>
                <button
                  type="button"
                  onClick={() => setChildAgeGroup('teen')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    childAgeGroup === 'teen' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Dospívající (12–16 let)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DO Formulation */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Doporučené formulace (Co říkat):</span>
                </div>
                <div className="text-xs text-emerald-950 space-y-2 leading-relaxed font-medium">
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
              <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Nevhodné formulace (Čemu se vyhnout):</span>
                </div>
                <div className="text-xs text-rose-950 space-y-2 leading-relaxed font-medium">
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

        {/* TOOL 4: PAS DETECTOR */}
        {activeCategory.slug === 'pas' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Detektor varovných signálů PAS (Syndrom zavržení rodiče)</h3>
                <p className="text-xs text-slate-500">Zaškrtněte jevy, se kterými se v chování dětí či matky setkáváte</p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
                <span className="text-xs text-slate-600 font-medium">Detekovaná rizika:</span>
                <span className={`text-lg font-black font-mono ${pasCount >= 3 ? 'text-rose-600' : pasCount >= 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {pasCount} / 5
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={pasChecks.denial}
                  onChange={() => togglePasCheck('denial')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Dítě bez důvodu odmítá kontakt</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={pasChecks.insults}
                  onChange={() => togglePasCheck('insults')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Dítě používá dospělé fráze matky</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={pasChecks.secrecy}
                  onChange={() => togglePasCheck('secrecy')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Tajení informací o škole a zdraví</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={pasChecks.blockingCalls}
                  onChange={() => togglePasCheck('blockingCalls')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Bránění v telefonním kontaktu</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={pasChecks.falseAccusation}
                  onChange={() => togglePasCheck('falseAccusation')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Falešná obvinění ze špatné péče</span>
              </label>
            </div>

            {pasCount >= 2 && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-extrabold text-rose-900">Vysoké riziko rozvoje syndromu zavržení rodiče</div>
                  <p>
                    Doporučujeme okamžitě podat k opatrovnickému soudu návrh na výkon rozhodnutí, vyžádat si zásah OSPOD a poukázat na nález Ústavního soudu II. ÚS 2943/14 o povinnosti státu bránit odcizení rodiče.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TOOL 5: OSPOD HOUSING CHECKLIST */}
        {activeCategory.slug === 'novy-domov-ospod' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
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

        {/* TOOL 6: BIFF CONVERTER FOR MEDIATION */}
        {activeCategory.slug === 'mediace' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Sparkles className="w-6 h-6 text-emerald-600 shrink-0" />
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:border-emerald-500 focus:outline-hidden font-sans"
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

                <div className="w-full min-h-[108px] bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-slate-800 text-xs leading-relaxed font-sans">
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

        {/* BOTTOM CTA & FOOTER */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              Máte dotaz k téma: {activeCategory.title}?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Využijte AI Právního Asistenta k podrobné analýze vaší konkrétní situace nebo přejděte k dalším podstránkám.
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
            <a
              href="/zivotni-situace"
              onClick={(e) => {
                e.preventDefault();
                handleSelectSubpage('/zivotni-situace');
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              Rozcestník situací
            </a>
          </div>
        </div>

      </div>
    );
  }

  // DEFAULT VIEW: ROZCESTNÍK ŽIVOTNÍCH SITUACÍ (OVERVIEW HUB)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* BREADCRUMBS */}
      <Breadcrumbs activeTab="zivotni-situace" setActiveTab={setActiveTab} />

      {/* HEADER - DARK BACKGROUND WITH EMERALD QUOTE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white shadow-2xl space-y-5">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold uppercase tracking-wider font-mono">
            <Shield className="w-4 h-4 text-emerald-400" />
            Rozcestník životních situací • Táta má právo
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Životní situace po rozchodu & Stabilizace zázemí
          </h1>

          <blockquote className="border-l-4 border-emerald-500 pl-4 py-3 my-4 bg-slate-800/80 rounded-r-2xl text-emerald-400 text-sm sm:text-base font-medium italic leading-relaxed shadow-inner">
            „Hlavní pilíř portálu: Primárním cílem zůstává nejlepší zájem dítěte, jeho právo na péči obou rodičů a stabilní střídavá či společná péče. Stabilizace vašich financí, domova a duševní pohody vytváří nezbytné zázemí pro vaše rodičovské působení.“
          </blockquote>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Vyberte si konkrétní samostatnou podstránku a získejte ověřená doporučení, právní informace, krizové rady a interaktivní pomůcky.
          </p>
        </div>
      </div>

      {/* GRID OF 6 STANDALONE CATEGORY CARDS WITH DIRECT HREF LINKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComponent = cat.icon;

          return (
            <a
              key={cat.id}
              href={cat.canonicalPath}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                handleSelectSubpage(cat.canonicalPath);
              }}
              className="group bg-white border border-slate-200 hover:border-emerald-500/60 rounded-3xl p-6 sm:p-7 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-5 relative overflow-hidden cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold uppercase tracking-wider border border-emerald-200">
                    {cat.badgeText}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {cat.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Otevřít samostatnou stránku</span>
                <div className="p-1.5 rounded-full bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-extrabold text-base sm:text-lg text-white">
            Potřebujete právní podání nebo pomoc s přípravou dohody o péči?
          </h3>
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
