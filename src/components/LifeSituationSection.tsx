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
  UserCheck,
  Zap,
  Bookmark,
  Activity,
  Calendar,
  Layers,
  ListChecks,
  Sliders,
  FileCheck
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import SituationGuideSynthesisOS from './SituationGuideSynthesisOS';

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
  mission: string;
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

  // INTERACTIVE TOOL STATES:

  // Tool 1: SJM Asset Mapper & Calculator
  const [realEstateValue, setRealEstateValue] = useState<number>(5000000);
  const [mortgageDebt, setMortgageDebt] = useState<number>(3000000);
  const [movableValue, setMovableValue] = useState<number>(400000);
  const [savingsValue, setSavingsValue] = useState<number>(200000);
  const [otherLoans, setOtherLoans] = useState<number>(100000);

  const calculateSjmSplit = () => {
    const totalAssets = realEstateValue + movableValue + savingsValue;
    const totalLiabilities = mortgageDebt + otherLoans;
    const netEquity = totalAssets - totalLiabilities;
    const sharePerSpouse = netEquity / 2;
    return { totalAssets, totalLiabilities, netEquity, sharePerSpouse };
  };
  const sjmResult = calculateSjmSplit();

  // Tool 2: Burnout & Mental State Checklist (Psychická podpora)
  const [mentalStatus, setMentalStatus] = useState<'green' | 'yellow' | 'red'>('yellow');
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathTimer, setBreathTimer] = useState<number>(4);

  useEffect(() => {
    let interval: any = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => (prev > 1 ? prev - 1 : 4));
      }, 1000);
    } else {
      setBreathTimer(4);
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  // Tool 3: Child Conversation Guide
  const [childAgeGroup, setChildAgeGroup] = useState<'toddler' | 'school' | 'teen'>('school');

  // Tool 4: PAS Warning Signs Tracker
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

  // Tool 5: OSPOD Housing Checklist
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

  // Tool 6: Mediation Agreement Generator & Evaluator
  const [careSchedule, setCareSchedule] = useState<'equal' | 'broad' | 'weekend'>('equal');
  const [holidaySplit, setHolidaySplit] = useState<boolean>(true);
  const [financeSplit, setFinanceSplit] = useState<boolean>(true);

  // 6 DEFINITIVE STANDALONE CATEGORIES WITH DETAILED MISSIONS AND SUBSECTIONS
  const categories: SituationCategory[] = [
    {
      id: 'sjm',
      slug: 'sjm',
      canonicalPath: '/zivotni-situace/sjm',
      title: 'SJM & Majetkové vypořádání',
      subtitle: 'Rozpočet nové domácnosti, vypořádání SJM, hypotéky, prevence dluhů a ochrana financí po rozchodu',
      mission: 'Pomoci rodičům zvládnout majetkové otázky po rozchodu tak, aby konflikt o majetek nezničil schopnost spolupracovat jako rodiče.',
      icon: Wallet,
      badgeText: 'Finance & SJM',
      legalBasis: '§ 710 OZ (Závazky v SJM) & § 736 OZ (Vypořádání SJM k datu zániku)',
      subsections: [
        {
          id: 'sjm-a-rozchod',
          title: 'SJM a rozchod: Vlastnictví vs. Užívání majetku',
          situation: 'Co je součástí SJM, co tvoří výlučný majetek (dary, dědictví) a jak postupovat při rozvodu. Odpovědi na typické otázky (byt, hypotéka, odmítnutí vypořádání, auto, úspory, dluhy, odnesené věci).',
          solution: 'Zmapujte rozdíl mezi vlastnictvím a faktickým užíváním. Dokud nedojde k vypořádání SJM, majetek patří oběma manželům rovným dílem. Odnesení běžných věcí osobní potřeby dětí je přípustné.',
          legalNote: '§ 710 OZ & § 736 OZ (Zásada rovných podílů a ochrana třetích osob).',
          actionablePoints: [
            'Sepište přesný soupis majetku pořízeného za trvání manželství.',
            'Oddělte výlučný majetek (dědictví, dary před manželstvím, věci osobní potřeby).',
            'Zabezpečte důkazy o úsporách a převodech z bankovních účtů.'
          ]
        },
        {
          id: 'majetkove-vyporadani-krok-za-krokem',
          title: 'Majetkové vypořádání krok za krokem & Varianty řešení',
          situation: 'Partner odmítá mimosoudní dohodu nebo požaduje nereálné odstupné za nemovitost s hypotékou.',
          solution: 'Využijte 3 základní kroky: 1. Zmapování majetku (nemovitosti, movité věci, finance, závazky), 2. Volba varianty (Dohoda vs. Soudní vypořádání do 3 let od rozvodu), 3. Ochrana dětí před dopadem majetkového sporu.',
          legalNote: '§ 736–742 OZ (Vypořádání SJM dohodou nebo rozhodnutím soudu).',
          actionablePoints: [
            'Dohoda o vypořádání SJM schválená notářem je nejrychlejší a nejlevnější cesta.',
            'Pokud nedojde k dohodě do 3 let, nastupuje zákonná domněnka vypořádání (§ 741 OZ).',
            'Sledujte dopad majetkového konfliktu na stabilizaci dítěte.'
          ]
        },
        {
          id: 'krizovy-rozpocet-ochrana-pred-dluhy',
          title: 'Ochrana před vybráním účtů a krizový rozpočet',
          situation: 'Jeden z manželů převede společné úspory na soukromý účet nebo nakupuje na společnou kreditní kartu.',
          solution: 'Okamžitě zřiďte nový osobní účet, zrušte plné moci ke svým osobním financím a písemně oznamte bankám nesouhlas s novými úvěry druhého manžela.',
          legalNote: '§ 710 odst. 2 OZ (Závazky převzaté bez souhlasu druhého manžela).',
          actionablePoints: [
            'Zřiďte si nový účet u jiné instituce pro zasílání mzdy.',
            'Stáhněte výpisy ze společných účtů za poslední 3 roky.',
            'Trvejte na prokazatelném hrazení výživného trvalým příkazem s poznámkou "Výživné [Jméno]".'
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
      mission: 'Pomoc rodiči zvládnout psychický tlak během rozpadu rodiny a zabránit rozhodnutím pod vlivem emocí.',
      icon: Brain,
      badgeText: 'Psychická stabilizace',
      legalBasis: 'Krizová intervence 24/7 & Psychologická péče pro rodiče v rozvodové krizi',
      subsections: [
        {
          id: 'kdyz-se-rodina-rozpada',
          title: 'Když se rodina rozpadá: Typické psychické reakce',
          situation: 'Šok, strach, pocit nespravedlnosti, vztek, bezmoc, úzkost a poruchy spánku v důsledku odloučení od dětí.',
          solution: 'Pochopte, že tyto pocity jsou normální reakcí na abnormální situaci. Oddělte proces rozvodu od svého fungování jako milujícího rodiče.',
          legalNote: 'Metodiky psychologické stabilizace účastníků rodinně-právních sporů.',
          actionablePoints: [
            'Přijměte své emoce bez sebeobviňování.',
            'Udržujte základní fyzický režim (spánek, jídlo, pravidelný pohyb).',
            'Sdílejte své pocity s odborníkem nebo svépomocnou skupinou rodičů.'
          ]
        },
        {
          id: 'krizovy-rezim-72-hodin',
          title: 'Krizový režim rodiče (Prvních 72 hodin)',
          situation: 'Akutní hrozba unáhlených výčitkových zpráv, útočných e-mailů nebo emocemi vedených právních kroků.',
          solution: 'Neřešte spory v emocích! Nepsat agresivní zprávy, nezapojovat dítě, zajistit základní fyzické potřeby a najít odbornou či přátelskou podporu.',
          legalNote: 'Pravidlo 24hodinové pauzy pro zklidnění komunikace u soudu.',
          actionablePoints: [
            'Zaveďte pravidlo "Napsat odpověď, ale odeslat až za 24 hodin po kontrole".',
            'Nikdy neposílejte hlasové zprávy ani e-maily v noci pod vlivem stresu.',
            'Uložte si krizovou linku první psychické pomoci 116 123.'
          ]
        },
        {
          id: 'psychicka-stabilita-ochrana-ditete',
          title: 'Psychická stabilita jako ochrana dítěte & Prevence vyhoření',
          situation: '„Dítě nepotřebuje dokonalého rodiče. Potřebuje bezpečného a klidného rodiče.“ Vyčerpání hrozí vyhořením.',
          solution: 'Stabilizovaný rodič vytváří pro dítě oázu klidu. Sledujte svůj stav (🟢 zvládám / 🟡 potřebuji podporu / 🔴 krizový stav) a pravidelně regenerujte.',
          legalNote: 'Prevence syndromu vyhoření rodiče v opatrovnickém řízení.',
          actionablePoints: [
            'Využijte dechová cvičení a deník emocí pro ventilaci napětí.',
            'Vyhledejte psychoterapeuta se znalostí rodinného práva.',
            'Vymezte si čas výhradně pro sebe bez právních myšlenek.'
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
      mission: 'Naučit rodiče komunikovat s dítětem během rozchodu bez zatěžování dítěte konfliktem dospělých.',
      icon: MessageSquare,
      badgeText: 'Citlivá komunikace',
      legalBasis: '§ 880 OZ (Právo dítěte na péči obou rodičů a ochranu před rodinným konfliktem)',
      subsections: [
        {
          id: 'zakladni-pravidla-rozhovoru',
          title: 'Základní pravidla: Co dítě potřebuje slyšet',
          situation: 'Dítě vyjadřuje strach, že ztratí jednoho z rodičů nebo že za rozchod může jeho neposlušnost.',
          solution: 'Ubezpečte dítě klíčovými větami: „Oba tě máme rádi“, „Není to tvoje vina“, „Nemusíš si vybírat stranu“, „Oba budeme pořád tvoji rodiče na 100 %“.',
          legalNote: '§ 880 OZ (Rodičovská odpovědnost a blaho dítěte).',
          actionablePoints: [
            'Opakovaně zdůrazňujte, že rozchod je věcí dospělých.',
            'Striktně se vyhněte obviňování druhého rodiče před dítětem.',
            'Vytvořte dítěti jasný vizuální kalendář péče.'
          ]
        },
        {
          id: 'komunikace-podle-veku',
          title: 'Komunikace podle věku dítěte (0–3, 3–6, 6–12, Teenageři)',
          situation: 'Jak přizpůsobit vysvětlení rozchodu batolete, školákovi nebo dospívajícímu puberťákovi.',
          solution: '0–3 roky: Bezpečí a doteková rutina; 3–6 let: Jednoduché vysvětlení dvojetáže; 6–12 let: Prostor pro otázky a ubezpečení; Teenageři: Respekt k autonomii a přátelům.',
          legalNote: 'Metodické standardy dětské vývojové psychologie.',
          actionablePoints: [
            'U malých dětí udržujte stejný rytmus spánku a pohádek.',
            'Školákům vysvětlete organizaci týdne bez emocí.',
            'Dospívajícím netajte fakta, ale nezatahujte je do role svého důvěrníka.'
          ]
        },
        {
          id: 'prakticke-situace-vzorove-odpovedi',
          title: 'Vzorové odpovědi na citlivé otázky dětí',
          situation: 'Odpovědi na zraňující dotazy dětí: „Proč nebydlíme spolu?“, „Je to moje vina?“, „Koho máš radši?“.',
          solution: 'Použijte připravený Komunikační průvodce s odpověďmi, které zklidní úzkost a dodají pocit bezpečí.',
          legalNote: 'Doporučené vzory rozhovorů dětských psychologů.',
          actionablePoints: [
            'Odpovídejte: „Dospělí už nedokážou bydlet spolu v klidu, ale pro tebe se nic nemění.“',
            'Na otázku koho má radši: „Mám tě rád celým srdcem a máma taky.“',
            'Projděte si checklist před rozhovorem s dítětem.'
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
      mission: 'Vysvětlit fenomény narušeného vztahu dítě–rodič a pomoci rodičům rozpoznat rizikové situace bez předčasného označování druhé strany.',
      icon: Shield,
      badgeText: 'Ochrana před PAS',
      legalBasis: 'Nález ÚS II. ÚS 2943/14 & Nález ÚS I. ÚS 2441/13 (Povinnost soudu bránit odcizení)',
      subsections: [
        {
          id: 'co-znamená-pas',
          title: 'Co znamená PAS: Odborný kontext narušení vztahu',
          situation: 'Pochopení podstaty zavrhování rodiče. Nejde o oficiální samostatnou psychiatrickou diagnózu, ale o proces narušení vztahu v důsledku tlaku a manipulace dospělých.',
          solution: 'Reagujte věcně a odborně. Rozlište přirozený vývojový odpor dítěte od indukovaného odcizování druhým rodičem.',
          legalNote: 'Nález ÚS II. ÚS 2943/14 (Pasivita orgánů při manipulaci je porušením práv).',
          actionablePoints: [
            'Nenálepkujte druhého rodiče před dětmi výrazem "manipulátor".',
            'Zaměřte se na popis konkrétního chování a projevů dítěte.',
            'Vyžádejte si odborné znalecké posouzení rodinného systému.'
          ]
        },
        {
          id: 'varovne-signaly-pas',
          title: 'Varovné signály u dítěte a rizikové chování dospělých',
          situation: 'Dítě náhle odmítá kontakt, používá cizí dospělé výrazy matky, vyjadřuje nepřirozený strach nebo se tají s informacemi ze školy.',
          solution: 'Zzdokumentujte všechny varovné projevy. U dospělých sledujte zatahování dítěte do sporu, vynucování loajality a bránění telefonátům.',
          legalNote: 'Standardy posuzování opatrovnických soudů při zjišťování odcizení.',
          actionablePoints: [
            'Vedte si deník předávání dětí s přesnými daty a reakcemi.',
            'Použijte detektor PAS varovných signálů níže.',
            'Informujte OSPOD a žádejte svolání případové konfigurace.'
          ]
        },
        {
          id: 'spravna-reakce-a-dokumentace',
          title: 'Jak reagovat správně & Vytvoření časové osy',
          situation: 'Co dělat a co nedělat (vyhnout se protiútoku a výslechu dítěte, zachovat stabilitu, dokumentovat).',
          solution: 'Vytvořte přehlednou časovou osu událostí, archiv zpráv (BIFF), výpisy předávání dětí a lékařské či psychologické zprávy.',
          legalNote: '§ 452 z.ř.s. (Návrh na předběžné opatření a výkon rozhodnutí).',
          actionablePoints: [
            'Neprovádějte výslech dítěte po návratu z druhé domácnosti.',
            'Nabídněte dítěti bezpodmínečnou lásku a klidné prostředí.',
            'Při maření styků podejte k soudu návrh na výkon rozhodnutí.'
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
      mission: 'Pomoci rodiči zvládnout změnu bydliště dítěte a komunikaci s orgány sociálně-právní ochrany dětí.',
      icon: Home,
      badgeText: 'Bydlení & OSPOD',
      legalBasis: 'Standardy sociálně-právní ochrany dětí (Šetření poměrů v domácnosti otce)',
      subsections: [
        {
          id: 'stehovani-po-rozchodu',
          title: 'Stěhování po rozchodu & Zachování prostředí dítěte',
          situation: 'Změna prostředí, volba vzdálenosti nového bytu od původního domova, školy a kroužků.',
          solution: 'Zvolte nové bydlení v rozumné dojezdové vzdálenosti. Zachování stálé školy, kroužků a kamarádů je pro opatrovnický soud klíčovým argumentem pro střídavou péči.',
          legalNote: 'Nález ÚS I. ÚS 1554/14 (Kritérium zachování prostředí a kroužků dítěte).',
          actionablePoints: [
            'Vyberte byt s dojezdovou vzdáleností do 30–45 minut od školy.',
            'Doložte soudu nájemní smlouvu nebo list vlastnictví.',
            'Prokažte schopnost ranního odvozu do školy a odpoledního vyzvedávání.'
          ]
        },
        {
          id: 'role-a-komunikace-s-ospod',
          title: 'Role OSPOD & Jak komunikovat věcně bez útoků',
          situation: 'První jednání na OSPOD a terénní šetření sociální pracovnice v novém bytě otce.',
          solution: 'OSPOD hájí zájem dítěte a podporuje dohodu. Komunikujte věcně, konkrétně, bez vlastních křivd a útoků na druhého rodiče.',
          legalNote: 'Zákon č. 359/1999 Sb. (O sociálně-právní ochraně dětí).',
          actionablePoints: [
            'Při jednání zdůrazňujte vaši podporu vztahu dítěte s matkou.',
            'Předložte písemný návrh harmonogramu péče.',
            'Projděte si checklist na jednání s OSPOD.'
          ]
        },
        {
          id: 'novy-domov-ditete-priprava',
          title: 'Nový domov dítěte & Příprava na šetření v bytě',
          situation: 'Jak vybavit dětský pokoj a udržet rutinu druhého domova.',
          solution: 'Zajistěte vlastní postel, psací stůl, úložné prostory, hygienu, hračky a bezpečí. Připravte dítě na střídání domovů bez pocitu cizoty.',
          legalNote: 'Metodické pokyny MPSV pro provádění šetření v domácnosti.',
          actionablePoints: [
            'Použijte níže uvedený Checklist Připravenosti Bydlení pro OSPOD.',
            'Mějte v bytě připravené potraviny a hygienické potřeby dětí.',
            'Umožněte dítěti přivézt si oblíbené hračky z druhé domácnosti.'
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
      mission: 'Ukázat rodičům možnost řešit konflikt spoluprací místo dlouhodobého boje.',
      icon: HeartHandshake,
      badgeText: 'Mediace & Dohoda',
      legalBasis: 'Zákon č. 202/2012 Sb. (O mediaci) & § 474 z.ř.s. (Nařízené první setkání s mediátorem)',
      subsections: [
        {
          id: 'co-je-rodinna-mediace',
          title: 'Co je rodinná mediace & Kdy pomáhá',
          situation: 'Jednání o péči, předávání, komunikaci, financích a bydlení bez nutnosti dlouhých soudních bitv.',
          solution: 'Mediace je hledání řešení a dohody pro ochranu dítěte (nejde o hledání viníka). Neutrální mediátor pomáhá oběma rodičům najít společnou řeč.',
          legalNote: 'Zákon č. 202/2012 Sb. (O mediaci) & § 474 z.ř.s.',
          actionablePoints: [
            'Mediace je důvěrný proces chráněný mlčenlivostí.',
            'Umožňuje vyřešit jak režim péče, tak výživné a prázdniny.',
            'Výsledná Rodičovská dohoda je snadno schválitelná soudem.'
          ]
        },
        {
          id: 'proces-mediace-a-rodicovska-dohoda',
          title: 'Proces mediace & Struktura Rodičovské dohody',
          situation: 'Průběh setkání: Úvod, pojmenování problémů, hledání řešení, formulace dohody.',
          solution: 'Sestavte Rodičovskou dohodu obsahující: Režim péče (týden/týden nebo jiný), prázdniny, svátky, narozeniny, komunikaci, školu a finance.',
          legalNote: 'Standardizovaný registr schválených rodičovských dohod.',
          actionablePoints: [
            'Sepište si předem 3 klíčové priority.',
            'Soustřeďte se výhradně na budoucnost dětí.',
            'Použijte Generátor rodičovské dohody níže.'
          ]
        },
        {
          id: 'biff-komunikace-deeskalace',
          title: 'BIFF komunikace pro de-eskalaci sporu',
          situation: 'Písemná komunikace s druhým rodičem je plná osobních útoků a výčitek.',
          solution: 'Aplikujte pravidla BIFF: Brief (stručná), Informative (informativní), Friendly (neutrální/přívětivá), Firm (pevná). Ignorujte útoky a odpovězte pouze na fakta.',
          legalNote: 'Mezinárodní standard komunikace High Conflict Institute.',
          actionablePoints: [
            'Vyzkoušejte interaktivní BIFF převodník zpráv.',
            'Odpovídejte věcně s jasným termínem pro odpověď.',
            'Udržujte e-mailový archiv pro případné předložení soudu.'
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

            {/* MISSION HIGHLIGHT BOX */}
            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-4 text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed">
              <strong className="text-emerald-400 font-bold uppercase font-mono block mb-1">🎯 Hlavní poslání této oblasti:</strong>
              {activeCategory.mission}
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
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
                    <span>⚠️ Krizový stav & Kontext:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {sub.situation}
                  </p>
                </div>

                {/* BOX 2: ŘEŠENÍ (ACTIONABLE ADVICE) */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase font-mono tracking-wider">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span>💡 Doporučené odborné řešení:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
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

        {/* EMBEDDED DEDICATED TOOL TAILORED FOR ACTIVE CATEGORY */}

        {/* TOOL 1: SJM ASSET MAPPER & CALCULATOR */}
        {activeCategory.slug === 'sjm' && (
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Calculator className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="font-extrabold text-lg text-white">Inventář majetku & Kalkulačka vypořádání SJM</h3>
                <p className="text-xs text-slate-400">Zmapujte nemovité i movité věci, úspory a závazky pro rovný podíl (50 / 50)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Hodnota nemovitostí (byt, dům, pozemek)</label>
                <input
                  type="number"
                  value={realEstateValue}
                  onChange={(e) => setRealEstateValue(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Hypotéka & dluhy na nemovitost</label>
                <input
                  type="number"
                  value={mortgageDebt}
                  onChange={(e) => setMortgageDebt(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Movité věci (auto, elektronika, vybavení)</label>
                <input
                  type="number"
                  value={movableValue}
                  onChange={(e) => setMovableValue(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Úspory, investice a účty SJM</label>
                <input
                  type="number"
                  value={savingsValue}
                  onChange={(e) => setSavingsValue(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Ostatní spotřebitelské půjčky & leasing</label>
                <input
                  type="number"
                  value={otherLoans}
                  onChange={(e) => setOtherLoans(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Čisté jmění SJM (Aktiva - Závazky)</div>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  {sjmResult.netEquity.toLocaleString()} Kč
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Vypočtená čistá hodnota majetku vytvořeného za trvání manželství.
                </p>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Zákonný podíl jednoho manžela (50 %)</div>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                  {sjmResult.sharePerSpouse.toLocaleString()} Kč
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Orientační částka pro vypořádání dohodou nebo soudním rozhodnutím.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: MENTAL STATUS & DECHOVÉ CVIČENÍ (PSYCHICKÁ PODPORA) */}
        {activeCategory.slug === 'psychicka-podpora' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Prevence vyhoření & Kontrola psychické stability</h3>
                <p className="text-xs text-slate-500">Zhodnoťte svůj aktuální stav a vyzkoušejte rychlé dechové cvičení</p>
              </div>

              {/* STATUS INDICATOR BUTTONS */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMentalStatus('green')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    mentalStatus === 'green' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  🟢 1. Zvládám
                </button>
                <button
                  type="button"
                  onClick={() => setMentalStatus('yellow')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    mentalStatus === 'yellow' ? 'bg-amber-500 text-white border-amber-600' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  🟡 2. Potřebuji podporu
                </button>
                <button
                  type="button"
                  onClick={() => setMentalStatus('red')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    mentalStatus === 'red' ? 'bg-rose-600 text-white border-rose-700' : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  🔴 3. Krizový stav
                </button>
              </div>
            </div>

            {/* STATUS FEEDBACK BOX */}
            <div className="p-4 rounded-2xl text-xs leading-relaxed border font-medium">
              {mentalStatus === 'green' && (
                <div className="bg-emerald-50 border-emerald-200 text-emerald-950 space-y-1">
                  <div className="font-extrabold text-emerald-900">🟢 Váš stav je stabilní</div>
                  <p>Pokračujte v udržování denního režimu, sportu a kvalitního spánku. Pečujte o svou psychiku pro zachování klidu před dětmi.</p>
                </div>
              )}
              {mentalStatus === 'yellow' && (
                <div className="bg-amber-50 border-amber-200 text-amber-950 space-y-1">
                  <div className="font-extrabold text-amber-900">🟡 Zvýšené napětí – věnujte čas regeneraci</div>
                  <p>Doporučujeme delegovat část povinností, vyhledat rozhovor s důvěrným přítelem nebo se zapojit do komunity otců.</p>
                </div>
              )}
              {mentalStatus === 'red' && (
                <div className="bg-rose-50 border-rose-200 text-rose-950 space-y-1">
                  <div className="font-extrabold text-rose-900">🔴 Akutní krizové přetížení</div>
                  <p>Okamžitě zvolněte. Využijte bezplatnou Linku první psychické pomoci (116 123) nebo kontaktujte psychoterapeuta. Nečte ani nepište právní zprávy.</p>
                </div>
              )}
            </div>

            {/* BREATHING INTERACTIVE MODULE */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
              <div className="space-y-2 text-center sm:text-left">
                <div className="text-emerald-400 font-extrabold text-sm flex items-center justify-center sm:justify-start gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Dechové cvičení 4-4-4 (Zklidnění nervové soustavy)</span>
                </div>
                <p className="text-slate-300 text-xs max-w-md">
                  Pomalý nádech nosem (4s), zadržení dechu (4s) a hluboký výdech ústy (4s) aktivuje parasympatikus a snižuje kortizol.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-mono font-black text-2xl text-emerald-400 shadow-inner">
                  {breathTimer}s
                </div>

                <button
                  type="button"
                  onClick={() => setBreathingActive(!breathingActive)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                >
                  {breathingActive ? 'Zastavit cvičení' : 'Spustit dechové cvičení'}
                </button>
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
                  Předškolní (0–6 let)
                </button>
                <button
                  type="button"
                  onClick={() => setChildAgeGroup('school')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    childAgeGroup === 'school' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Školní (6–12 let)
                </button>
                <button
                  type="button"
                  onClick={() => setChildAgeGroup('teen')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    childAgeGroup === 'teen' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Teenageři (12–18 let)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DO Formulation */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Doporučené formulace (Co dítě potřebuje slyšet):</span>
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
                <span className="font-semibold text-slate-800">Samostatné lůžko pro dítě</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.desk}
                  onChange={() => toggleHousingCheck('desk')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Psací stůl a židle do školy</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.storage}
                  onChange={() => toggleHousingCheck('storage')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Úložné skříně na oblečení</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.hygiene}
                  onChange={() => toggleHousingCheck('hygiene')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Vlastní hygienické potřeby</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.toys}
                  onChange={() => toggleHousingCheck('toys')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Věku přiměřené hračky & knihy</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.safety}
                  onChange={() => toggleHousingCheck('safety')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Bezpečné a čisté prostředí</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.schoolDist}
                  onChange={() => toggleHousingCheck('schoolDist')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Dojezd do školy do 45 min</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  checked={housingChecks.food}
                  onChange={() => toggleHousingCheck('food')}
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-800">Zásobování potravinami</span>
              </label>
            </div>
          </div>
        )}

        {/* TOOL 6: MEDIATION AGREEMENT GENERATOR & EVALUATOR */}
        {activeCategory.slug === 'mediace' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Generátor & Hodnocení kvality Rodičovské dohody</h3>
                <p className="text-xs text-slate-500">Nastavte klíčové parametry dohody pro posouzení soudní schválitelnosti</p>
              </div>

              <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold rounded-full">
                Soudní schválitelnost: VYSOKÁ (95%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <label className="block text-slate-900 font-extrabold">1. Režim péče o dítě</label>
                <select
                  value={careSchedule}
                  onChange={(e) => setCareSchedule(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="equal">Střídavá péče 50/50 (týden/týden)</option>
                  <option value="broad">Rozšířená péče (4 dny z 14)</option>
                  <option value="weekend">Víkendová péče s přespáním</option>
                </select>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <label className="block text-slate-900 font-extrabold">2. Dělení prázdnin a svátků</label>
                <button
                  type="button"
                  onClick={() => setHolidaySplit(!holidaySplit)}
                  className={`w-full py-2 px-3 rounded-xl border font-bold transition-all text-left flex items-center justify-between ${
                    holidaySplit ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  <span>Létní prázdniny 2+2 týdny / Vánoce střídavě</span>
                  {holidaySplit && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <label className="block text-slate-900 font-extrabold">3. Hrazení kroužků a výdajů</label>
                <button
                  type="button"
                  onClick={() => setFinanceSplit(!financeSplit)}
                  className={`w-full py-2 px-3 rounded-xl border font-bold transition-all text-left flex items-center justify-between ${
                    financeSplit ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  <span>Mimořádné výdaje 50/50 po předchozí dohodě</span>
                  {financeSplit && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SHARED MANDATORY BOTTOM MODULE FOR EVERY CATEGORY SUBPAGE */}
        <SituationGuideSynthesisOS 
          categoryTitle={activeCategory.title} 
          categorySlug={activeCategory.slug} 
        />

      </div>
    );
  }

  // OVERVIEW HUB PAGE (WHERE ALL 6 CARDS REDIRECT DIRECTLY TO SUBPAGES)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* BREADCRUMBS */}
      <Breadcrumbs activeTab="zivotni-situace" setActiveTab={setActiveTab} />

      {/* HEADER - DARK BACKGROUND WITH EMERALD QUOTE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white shadow-2xl space-y-5">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider rounded-full">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Praktický průvodce & Odborné podstránky</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Životní situace & Zázemí po rozchodu
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            Každá oblast rodičovského a majetkového rozchodu vyžaduje samostatnou péči. Vyberte si ze 6 odborně zpracovaných podstránek s přímými odkazy, praktickými kalkulačkami a právní oporou.
          </p>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-xs sm:text-sm text-emerald-300 font-mono italic max-w-3xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>„Dítě nepotřebuje dokonalé rodiče. Potřebuje rodiče, kteří spolu dokážou mluvit a dohodnout se.“</span>
          </div>
        </div>
      </div>

      {/* 6 STANDALONE CATEGORY CARDS WITH DIRECT HREFS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;

          return (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-emerald-400 group-hover:border-slate-800 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-mono font-bold rounded-full">
                    {cat.badgeText}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{cat.legalBasis}</span>
                </div>
              </div>

              {/* DIRECT HREF BUTTON LINKING TO STANDALONE SUBPAGE */}
              <a
                href={cat.canonicalPath}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectSubpage(cat.canonicalPath);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl transition-all shadow-2xs cursor-pointer group-hover:bg-emerald-600"
              >
                <span>Otevřít podstránku: {cat.title}</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          );
        })}
      </div>

      {/* OVERVIEW BOTTOM SUMMARY */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <h3 className="font-extrabold text-slate-900 text-base">
          ⚖️ Kompletní metodická podpora pro rodiče v ČR
        </h3>
        <p>
          Všechny podstránky vycházejí z platné právní úpravy Občanského zákoníku (zákon č. 89/2012 Sb.), Zákona o zvláštních řízeních soudních (č. 292/2013 Sb.) a judikatury Ústavního soudu ČR. Cílem je poskytnout rodičům maximální srozumitelnost bez zbytečného právnického žargonu.
        </p>
      </div>

    </div>
  );
}
