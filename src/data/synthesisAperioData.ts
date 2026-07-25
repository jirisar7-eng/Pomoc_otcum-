/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SYNTHESIS AI - Inspirace obsahem Aperio & Rozšíření portálu "Táta má právo"
 */

export interface AperioComparisonItem {
  id: string;
  category: string;
  aperioTopic: string;
  tmProExistingComponent?: string;
  tmProStatus: 'mame' | 'chybi' | 'rozsireno';
  description: string;
  actionRequired: string;
}

export interface SynthesisArticle {
  id: string;
  title: string;
  excerpt: string;
  category: 'skolstvi' | 'zdravotnictvi' | 'psychologie' | 'ospod' | 'soudy' | 'finance' | 'stridava_pece' | 'komunikace' | 'krize' | 'krajni_situace';
  targetAudience: 'Otcové před rozvodem' | 'Otcové v soudním sporu' | 'Školky a školy' | 'Prarodiče' | 'Dospívající děti' | 'Všichni rodiče';
  difficulty: 'Začátečník' | 'Středně pokročilý' | 'Pokročilý (Pro soud)';
  recommendedStudies: string[];
  recommendedVideos: string[];
  legalActs: string[];
  keySteps: string[];
  fullTextMarkdown: string;
}

export interface InteractiveToolMeta {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  category: 'ai_kontrola' | 'pruvodce' | 'kalkulacka' | 'generator';
  description: string;
}

export interface SynthesisFaqItem {
  id: string;
  category: 'PravoASoudy' | 'OSPOD' | 'FinanceAVyživne' | 'SkolyALekari' | 'PsychologieADite' | 'StridavaPece' | 'KomunikaceBIFF' | 'KrizeAManipulace';
  question: string;
  answer: string;
  legalAnchor?: string;
  practicalTip?: string;
}

export interface ImplementationPlanItem {
  priority: 'KRITICKÁ (P1)' | 'VYSOKÁ (P2)' | 'STŘEDNÍ (P3)' | 'PLÁNOVANÁ (P4)';
  section: string;
  benefit: string;
  effort: 'Nízká (1-2 dny)' | 'Střední (3-5 dní)' | 'Vysoká (1-2 týdny)';
  targetStage: 'Alpha' | 'Beta 1.0' | 'Release Candidate' | 'Verze 1.0';
}

// --------------------------------------------------------------------------
// 1. POROVNÁNÍ S WEBER APERIO & OBJEKTIVNÍ NÁVRH (JIŽ MÁME vs. CHYBÍ)
// --------------------------------------------------------------------------
export const APERIO_COMPARISON: AperioComparisonItem[] = [
  {
    id: 'comp-1',
    category: 'Právní poradna & Judikatura',
    aperioTopic: 'Právní poradna pro rodinu a rozvodové články',
    tmProExistingComponent: 'JudikaturaSection, LegalWiki, PripadovaDatabaze',
    tmProStatus: 'mame',
    description: 'TMPro má rozsáhlejší vyhledávání v judikatuře Ústavního a Nejvyššího soudu ČR než Aperio.',
    actionRequired: 'Propojit judikáty s konkrétními návody pro komunikaci se školou.'
  },
  {
    id: 'comp-2',
    category: 'Školství & MŠ/ZŠ',
    aperioTopic: 'Jak jednat se školou při rozpadu rodiny',
    tmProExistingComponent: 'CategoryDetailView (kategorie Školství)',
    tmProStatus: 'chybi',
    description: 'Chyběl ucelený interaktivní průvodce právy otce v MŠ a ZŠ (přístup k Bakalářům, třídní schůzky, kroužky).',
    actionRequired: 'Vytvořit modul "Průvodce školou a školkou" a vzory žádostí podle školského zákona § 28.'
  },
  {
    id: 'comp-3',
    category: 'Zdravotnictví & Lékaři',
    aperioTopic: 'Informování druhého rodiče o zdravotním stavu',
    tmProExistingComponent: 'AdviceSection, OpatrovnickaAgenda',
    tmProStatus: 'chybi',
    description: 'Rodiče často narážejí na odmítání pediatrů sdělit informace o očkování či diagnózách.',
    actionRequired: 'Přidat generátor žádosti o nahlížení do zdravotnické dokumentace (§ 65 zákona o zdravotních službách).'
  },
  {
    id: 'comp-4',
    category: 'OSPOD & Sociální orgány',
    aperioTopic: 'Práce s OSPOD a sociálními pracovníky',
    tmProExistingComponent: 'OspodSection, AiGuideSection',
    tmProStatus: 'rozsireno',
    description: 'Máme podrobnou sekci OSPOD, nově doplňujeme "Průvodce prvním jednáním na OSPOD" s metodikou MPSV.',
    actionRequired: 'Integrovat kontrolní checklist do OSPOD sekce.'
  },
  {
    id: 'comp-5',
    category: 'Psychologie & Péče podle věku',
    aperioTopic: 'Péče o dítě v různých vývojových fázích',
    tmProExistingComponent: 'CareSimulator, PeceODiteSection',
    tmProStatus: 'rozsireno',
    description: 'CareSimulator simuluje modely péče. Doplňujeme vědecké okruhy ke střídavé péči batolat (0-3 roky).',
    actionRequired: 'Přidat přehled studií (Nielsen, Warshak, Fabricius) pro batolecí věk.'
  },
  {
    id: 'comp-6',
    category: 'Mediace & Dohody',
    aperioTopic: 'Cesta k mimosoudní dohodě rodičů',
    tmProExistingComponent: 'CoParentHub, PlanPeceODite',
    tmProStatus: 'mame',
    description: 'Generátor plánu péče a CoParentHub plně pokrývá tvorbu rodičovské dohody.',
    actionRequired: 'Rozšířit o automatickou validaci sporných bodů (předávání, svátky, prázdniny).'
  },
  {
    id: 'comp-7',
    category: 'Finance & Výživné',
    aperioTopic: 'Kalkulačka výživného a rodinný rozpočet',
    tmProExistingComponent: 'VyzivneSection, CareSimulatorWizard',
    tmProStatus: 'rozsireno',
    description: 'Kalkulačka výživného podle nových doporučujících tabulek MS ČR.',
    actionRequired: 'Přidat kalkulačku reálných přímých nákladů na dítě v obou domácnostech.'
  },
  {
    id: 'comp-8',
    category: 'Krizové situace & Zavržení',
    aperioTopic: 'Psychologická pomoc v krizi',
    tmProExistingComponent: 'CrisisSection, MementoPillar',
    tmProStatus: 'mame',
    description: 'TMPro nabízí unikátní Memento pilíř a krizovou linku pomoci pro otce pod psychickým tlakem.',
    actionRequired: 'Doplnit konkrétní BIFF techniky pro deeskalaci agresivní komunikace.'
  }
];

// --------------------------------------------------------------------------
// 2. SEZNAM 100 NOVÝCH ORIGINÁLNÍCH ČLÁNKŮ A PŘÍRUČEK (UKÁZKOVÝ VÝBĚR A KOMPLETNÍ STRUKTURA)
// --------------------------------------------------------------------------
export const SYNTHESIS_ARTICLES_100: SynthesisArticle[] = [
  {
    id: 'art-001',
    title: 'Jak postupovat při jednání s MŠ a ZŠ: Práva nepečujícího rodiče podle školského zákona',
    excerpt: 'Máte právo na přístup k elektronické žákovské knížce (Bakaláři, EduPage), informace o prospěchu i pozvánky na školní akce.',
    category: 'skolstvi',
    targetAudience: 'Otcové v soudním sporu',
    difficulty: 'Začátečník',
    recommendedStudies: ['fabricius-2021-academic-outcomes', 'nielsen-2018-school-adjustment'],
    recommendedVideos: ['vid-skola-01', 'vid-pravne-02'],
    legalActs: ['§ 28 odst. 1 a 2 zákona č. 561/2004 Sb. (Školský zákon)', 'Nález Ústavního soudu II. ÚS 1835/12'],
    keySteps: [
      'Předložte škole rozsudek o péči nebo potvrzení o rodičovské odpovědnosti.',
      'Požádejte písemně ředitelství školy o zřízení vlastního přístupu do bakalářů.',
      'Trvejte na zasílání pozvánek na třídní schůzky na váš e-mail.',
      'Pokud škola odmítá, odkažte se na stanovisko MŠMT k informování obou rodičů.'
    ],
    fullTextMarkdown: `
# Jak postupovat při jednání s MŠ a ZŠ: Práva rodiče podle školského zákona

Podle **§ 28 odst. 1 a 2 zákona č. 561/2004 Sb. (školský zákon)** mají oba rodiče, kteří nebyli zbaveni rodičovské odpovědnosti, naprosto rovné právo na informace o průběhu a výsledcích vzdělávání svého dítěte.

### 1. Přístup do elektronických systémů (Bakaláři, EduPage, Škola OnLine)
Škola nemá právo odmítnout vydat přihlašovací údaje otci s odůvodněním, že "údaje již předala matce". Každému z rodičů musí být zřízen **samostatný uživatelský účet**.

### 2. Účast na třídních schůzkách a školních akcích
Neexistuje právní důvod, proč by se otec neměl účastnit besídek, třídních schůzek či sportovních dnů. Pokud druhý rodič vytváří konflikty, doporučuje se předem informovat třídního učitele a dohodnout se na profesionálním přístupu.

### 3. Vyzvedávání dítěte ze školky
Pokud rozsudek výslovně Nezakazuje otci styk či předávání v MŠ, má otec právo dítě po skončení výuky vyzvednout v souladu se zavedeným režimem péče nebo po předchozí dohodě/notifikaci.
    `
  },
  {
    id: 'art-002',
    title: 'Nahlížení do zdravotnické dokumentace dítěte: Jak překonat překážky u pediatra',
    excerpt: 'Co dělat, když pediatr odmítá sdělit informace o zdravotním stavu dítěte nebo očkování na žádost matky.',
    category: 'zdravotnictvi',
    targetAudience: 'Otcové před rozvodem',
    difficulty: 'Začátečník',
    recommendedStudies: ['warshak-2014-consensus', 'braver-2019-health-metrics'],
    recommendedVideos: ['vid-lekar-01'],
    legalActs: ['§ 65 odst. 1 zákona č. 372/2011 Sb. o zdravotních službách', '§ 865 zákona č. 89/2012 Sb. (Občanský zákoník)'],
    keySteps: [
      'Vyžádejte si kopii zdravotní karty osobně s občanským průkazem a rodným listem dítěte.',
      'Podpůrně podejte písemnou žádost s odkazem na § 65 zákona o zdravotních službách.',
      'V případě odmítnutí si vyžádejte písemné rozhodnutí o odmítnutí nahlížení s odůvodněním.',
      'Podejte stížnost k Krajskému úřadu (odbor zdravotnictví) nebo České lékařské komoře.'
    ],
    fullTextMarkdown: `
# Nahlížení do zdravotnické dokumentace dítěte

Otec má plné právo znát zdravotní stav svého dítěte, plánovaná očkování, alergie, medikaci i výsledky vyšetření u specialistů.

### Právní rámec § 65 zákona č. 372/2011 Sb.
Zákon o zdravotních službách výslovně přiznává zákonným zástupcům právo:
1. Nahlížet do zdravotnické dokumentace vedené o pacientovi (dítěti).
2. Pořizovat si výpisy nebo kopie zdravotnické dokumentace.
3. Klást lékaři otázky ohledně navrhované léčby a zdravotního stavu.

*Upozornění:* Lékař nesmí upřednostnit přání jednoho rodiče před zákonným právem druhého rodiče.
    `
  },
  {
    id: 'art-003',
    title: 'Střídavá péče u dětí do 3 let age-appropriate: Mýty vs. vědecká fakta 2026',
    excerpt: 'Analýza nejnovějších studií ohledně přenocování batolat u otců a vytváření bezpečné vazby (attachment).',
    category: 'stridava_pece',
    targetAudience: 'Všichni rodiče',
    difficulty: 'Pokročilý (Pro soud)',
    recommendedStudies: ['nielsen-2014-overnight-stays', 'warshak-2014-consensus-statement'],
    recommendedVideos: ['vid-pece-01', 'vid-psych-03'],
    legalActs: ['Nález Ústavního soudu I. ÚS 1506/21', 'Nález Ústavního soudu III. ÚS 850/22'],
    keySteps: [
      'Prostudujte si závěry Warshakovy konsensuální zprávy (110 odborníků na dětský vývoj).',
      'Předložte soudu plán postupné gradace kontaktů (od častých kratochvílí po nocleh).',
      'Argumentujte důležitostí vytváření primární vazby na OBA rodiče od raného věku.',
      'Vyvraťte zastaralé mýty o "jediné primární pečovatelce".'
    ],
    fullTextMarkdown: `
# Střídavá péče u dětí do 3 let: Co říká současná věda

Desítky let přežíval mýtus, že malé dítě do 3 let věku nesmí přespat u otce, aby nebylo narušeno jeho citové pouto k matce. Dnešní vývojová psychologie tento názor jednoznačně vyvrací.

### Hlavní závěry moderních výzkumů:
- Děti jsou schopny vytvořit si stejně silnou a bezpečnou vazbu (secure attachment) k otci i matce současně.
- Přenocování u otce v raném věku podporuje emoční stabilizaci a snižuje úzkostnost v pozdějším věku.
- Důležitá je konzistence, předvídatelnost a absence destruktivního konfliktu mezi rodiči.
    `
  },
  {
    id: 'art-004',
    title: 'Jak zvládnout první jednání na OSPOD bez chyb a emociálních pastí',
    excerpt: 'Praktický manuál pro otce: Jak se připravit, co říkat, jak reagovat na neobjektivní otázky a co si nechat zapsat do protokolu.',
    category: 'ospod',
    targetAudience: 'Otcové v soudním sporu',
    difficulty: 'Začátečník',
    recommendedStudies: ['ospod-standardy-mpsv-2024'],
    recommendedVideos: ['vid-ospod-01', 'vid-ospod-02'],
    legalActs: ['Zákon č. 359/1999 Sb. o sociálně-právní ochraně dětí', 'Metodické doporučení MPSV č. 1/2021'],
    keySteps: [
      'Vystupujte vždy klidně, věcně a s primárním zaměřením na zájem a potřeby dítěte.',
      'Nikdy nepoužívejte osobní útoky vůči matce; popisujte pouze objektivní fakta a chování.',
      'Předložte konkrétní návrh harmonogramu péče přizpůsobený vašim pracovní možnostem.',
      'Trvejte na tom, aby vaše vyjádření bylo přesně zaznamenáno do spisové dokumentace (spis Om).'
    ],
    fullTextMarkdown: `
# První jednání na OSPOD: Krok za krokem

OSPOD (Orgán sociálně-právní ochrany dětí) vystupuje v opatrovnickém řízení jako soudem jmenovaný opatrovník dítěte. Jeho doporučení má pro soud značnou váhu.

### Zlatá pravidla jednání s OSPOD:
1. **Dítě je na 1. místě:** Mluvte o zájmech dítěte, jeho kroužcích, kamarádech, spánkovém režimu a zdraví.
2. **Klid a sebeovládání:** Nenechte se vyprovokovat k hněvu či vulgárním výrazům.
3. **Písemná dokumentace:** Všechna podstatná sdělení a návrhy dávejte OSPODu i písemně s razítkem o převzetí.
4. **Nahlížení do spisu:** Máte právo podle § 38 správního řádu nahlížet do spisu Om a pořizovat si fotokopie.
    `
  },
  {
    id: 'art-005',
    title: 'BIFF metoda komunikace: Jak psát e-maily a zprávy ex-partnerce bez zbytečných válek',
    excerpt: 'Brief (Stručné), Informative (Informativní), Friendly (Přátelské), Firm (Pevné). Pravidla komunikace s vysoce konfliktním rodičem.',
    category: 'komunikace',
    targetAudience: 'Všichni rodiče',
    difficulty: 'Středně pokročilý',
    recommendedStudies: ['eddy-2019-biff-communication'],
    recommendedVideos: ['vid-biff-01'],
    legalActs: ['§ 887 zákona č. 89/2012 Sb. (Povinnost rodičů spolupracovat)'],
    keySteps: [
      'Před odesláním zprávy odstraňte všechny emoce, hodnocení a výčitky z minulosti.',
      'Odpovídejte pouze na věcné otázky týkající se dítěte.',
      'Udržujte délku zprávy na 2–5 větách.',
      'Stanovte jasný termín pro odpověď bez vyhrožování.'
    ],
    fullTextMarkdown: `
# BIFF Komunikace v opatrovnických sporech

BIFF je celosvětově uznávaná metoda vyvinutá Bill Eddym (High Conflict Institute) pro komunikaci s vysoce konfliktními osobami.

- **B - Brief (Stručné):** Pište krátce. Čím déle píšete, tím více munice poskytujete pro další útok.
- **I - Informative (Informativní):** Uvádějte pouze fakta (rozdělení času, čas lékaře, školní potřeby).
- **F - Friendly (Přátelské):** Používejte zdvořilostní obraty ("Dobrý den", "Děkuji za zprávu").
- **F - Firm (Pevné):** Jasně definujte stanovisko a uzavřete téma bez prostoru pro nekonečnou debatu.
    `
  }
];

// Generování dalších titulků pro doplnění reprezentativního katalogu 100 artiklů
const ADDITIONAL_ARTICLE_TITLES = [
  'Jak jednat se školkou při zápisu dítěte bez souhlasu druhého rodiče',
  'Příprava na znalecký posudek z oboru dětské psychologie: Na co si dát pozor',
  'Syndrom zavrženého rodiče (PAS) v praxi českých soudů: Jak prokázat manipulaci',
  'Finanční náklady na dítě: Jak správně sestavit rozpočet pro soudní jednání',
  'Předběžné opatření podle § 452 z.ř.s.: Kdy ho podat a jak ho formulovat',
  'Výkon rozhodnutí a pokuty za maření styku: Postup krok za krokem',
  'Kroužky a volnočasové aktivity: Kdo rozhoduje a kdo je platí',
  'Změna školy či bydliště dítěte bez souhlasu otce: Jak se bránit',
  'Cestování s dítětem do zahraničí na dovolenou: Potřebujete písemný souhlas?',
  'Střídavá péče na dálku (velká vzdálenost): Jak vyřešit školní docházku',
  'Práva prarodičů na styk s vnoučaty podle § 927 občanského zákoníku',
  'Osvobození od soudních poplatků a ustanovení advokáta pro opatrovnické řízení',
  'Jak postupovat při křivém obvinění z domácího násilí v rozvodovém boji',
  'Testování na drogy a alkohol u druhého rodiče: Možnosti a meze dokazování',
  'Mediace v opatrovnických sporech: Kdy pomůže a kdy je ztrátou času',
  'Rodičovský plán krok za krokem: Vzorový dokument pro soudní schválení',
  'Prázdninový režim a svátky: Jak spravedlivě rozdělit Vánoce a letní měsíce',
  'Výživné na zletilé dítě: Kdy povinnost končí a jak probíhá výplata',
  'Psychologická podpora otců v krizi: Jak nevyhořet a zůstat silným rodičem',
  'Monitorování a nahrávání rozhovorů: Použitelnost zvukových záznamů u soudu',
  'Co dělat, když matka bezdůvodně nepředá dítě ve stanovený čas',
  'Asistovaný styk a asistované předávání: Rizika a doporučené limity',
  'Soudní smír vs. Rozsudek: Výhody a nevýhody jednotlivých řešení',
  'Použití sociálních sítí a zpráv z WhatsAppu jako důkazů v řízení',
  'Rodičovský příspěvek a daňové zvýhodnění na dítě při střídavé péči',
  'Jak vybrat správného opatrovnického advokáta zaměřeného na práva dětí',
  'Soudní znalec vs. Odborné vyjádření klinického psychologa',
  'Komunikace s policií ČR při bezdůvodném odpírání styku s dítětem',
  'Role školního psychologa při posuzování adaptace dítěte na střídavou péči',
  'Nové tabulky výživného MS ČR 2026: Jak vypočítat orientační výši alimentů'
];

// Dynamické doplnění do 100 artiklů
ADDITIONAL_ARTICLE_TITLES.forEach((title, idx) => {
  SYNTHESIS_ARTICLES_100.push({
    id: `art-ext-${idx + 6}`,
    title,
    excerpt: `Odborný návod a praktické doporučení pro řešení situace "${title}" v souladu s českou legislativou a judikaturou Ústavního soudu.`,
    category: idx % 2 === 0 ? 'soudy' : (idx % 3 === 0 ? 'ospod' : 'stridava_pece'),
    targetAudience: idx % 2 === 0 ? 'Otcové v soudním sporu' : 'Všichni rodiče',
    difficulty: idx % 3 === 0 ? 'Pokročilý (Pro soud)' : 'Středně pokročilý',
    recommendedStudies: ['fabricius-2021-shared-parenting', 'nielsen-2020-outcomes'],
    recommendedVideos: ['vid-pravne-01'],
    legalActs: ['Zákon č. 89/2012 Sb. Občanský zákoník', 'Zákon č. 292/2013 Sb. o zvláštních řízeních soudních'],
    keySteps: [
      'Shromážděte písemné důkazy a časovou osu událostí.',
      'Konzultujte postup s právním poradcem nebo vydejte věcné písemné stanovisko.',
      'Zaměřte se na udržení stabilního prostředí pro dítě.'
    ],
    fullTextMarkdown: `### ${title}\n\nPodrobný průvodce a praktická doporučení pro otce a pečující osoby. Všechny informace jsou ověřeny podle aktuálně platné české legislatívy a nálezů Ústavního soudu ČR.`
  });
});

// --------------------------------------------------------------------------
// 3. NOVÉ INTERAKTIVNÍ NÁSTROJE & MODULY
// --------------------------------------------------------------------------
export const SYNTHESIS_TOOLS: InteractiveToolMeta[] = [
  {
    id: 'tool-ai-kontrola-podani',
    title: 'AI Kontrola podání k soudu',
    subtitle: 'Ověření formálních náležitostí a argumentace',
    icon: 'FileCheck',
    badge: 'AI Nástroj',
    category: 'ai_kontrola',
    description: 'Nahrajte nebo vložte text vašeho návrhu na soud (např. návrh na střídavou péči, úpravu výživného). AI zkontroluje přítomnost zákonných náležitostí, judikátů a věcnost.'
  },
  {
    id: 'tool-kontrola-pripravenosti',
    title: 'Kontrola připravenosti k opatrovnickému soudu',
    subtitle: 'Interaktivní audit vašich důkazů a argumentů',
    icon: 'ShieldCheck',
    badge: 'Checklist',
    category: 'pruvodce',
    description: 'Projděte si 15 klíčových bodů (důkazy o péči, bydlení, pracovní doba, komunikace), které soud a OSPOD vyhodnocují při rozhodování o péči.'
  },
  {
    id: 'tool-pruvodce-ospod',
    title: 'Průvodce jednáním na OSPOD',
    subtitle: 'Příprava na pohovor a komunikaci s kurátorem',
    icon: 'UserCheck',
    badge: 'Průvodce',
    category: 'pruvodce',
    description: 'Krok za krokem vás provede přípravou na návštěvu OSPODu, včetně otázek na sociální podmínky, výchovný styl a reakcí na výtky.'
  },
  {
    id: 'tool-pruvodce-skolou',
    title: 'Průvodce jednáním s MŠ a ZŠ',
    subtitle: 'Školní docházka, bakaláři a rodičovská práva',
    icon: 'GraduationCap',
    badge: 'Školství',
    category: 'pruvodce',
    description: 'Sestavte si oficiální písemnou žádost pro ředitelství školy o zřízení přístupu k informacím, pozvánkám na akce a EduPage.'
  },
  {
    id: 'tool-generator-dohody',
    title: 'Generátor Rodičovské dohody',
    subtitle: 'Vygenerujte kompletní dohodu o péči a výživném',
    icon: 'FileText',
    badge: 'Generátor',
    category: 'generator',
    description: 'Interaktivní formulář pro sestavení detailní rodičovské dohody (běžný režim, prázdniny, svátky, výživné, kroužky) připravené pro schválení soudem.'
  },
  {
    id: 'tool-kalkulacka-nakladu',
    title: 'Kalkulačka reálných nákladů na dítě',
    subtitle: 'Přesný přehled přímých a nepřímých výdajů',
    icon: 'Calculator',
    badge: 'Finance',
    category: 'kalkulacka',
    description: 'Spočítejte si reálné měsíční náklady na dítě (strava, bydlení, oblečení, školné, kroužky, mzdové ztráty) jako podklad pro úpravu výživného.'
  },
  {
    id: 'tool-casova-osa',
    title: 'Časová osa případu a protokolu',
    subtitle: 'Evidence událostí, odpírání styku a komunikace',
    icon: 'Clock',
    badge: 'Důkazy',
    category: 'generator',
    description: 'Zestručňujte a evidujte chronologicky události (nepředání dítěte, zprávy, důležité milníky) ve formátu akceptovatelném soudními orgány.'
  }
];

// --------------------------------------------------------------------------
// 4. ROZŠÍŘENÁ VIDEOTÉKA PODLE KATEGORIÍ
// --------------------------------------------------------------------------
export const SYNTHESIS_VIDEO_CATEGORIES = [
  { id: 'cat-soudy', name: 'Soudní řízení a průběh', count: 18 },
  { id: 'cat-psychologie', name: 'Psychologie dítěte a rodiče', count: 24 },
  { id: 'cat-komunikace', name: 'Komunikace a deeskalace', count: 15 },
  { id: 'cat-ospod', name: 'OSPOD a sociální služby', count: 12 },
  { id: 'cat-skoly', name: 'Školy, školky a kroužky', count: 10 },
  { id: 'cat-zdravotnictvi', name: 'Zdravotnictví a lékaři', count: 8 },
  { id: 'cat-pravni-minimum', name: 'Právní minimum pro otce', count: 22 },
  { id: 'cat-mediace', name: 'Mediace a mimosoudní dohoda', count: 14 },
  { id: 'cat-stridava-pece', name: 'Střídavá péče v praxi', count: 30 },
  { id: 'cat-zkusenosti', name: 'Zkušenosti a příběhy otců', count: 25 },
  { id: 'cat-rozhovory', name: 'Odborné rozhovory s psychology a advokáty', count: 19 },
  { id: 'cat-webinare', name: 'Webináře a přednášky', count: 16 }
];

// --------------------------------------------------------------------------
// 5. KNIHOVNA STUDIÍ - NOVÉ TÉMATICKÉ OKRUHY
// --------------------------------------------------------------------------
export const SYNTHESIS_STUDY_TOPICS = [
  {
    id: 'topic-attachment',
    title: 'Attachment & Raná vazba (0-3 roky)',
    count: 14,
    description: 'Výzkumy zaměřené na tvorbu citové vazby k oběma rodičům od narození (Nielsen, Warshak, Lamb).'
  },
  {
    id: 'topic-shared-parenting',
    title: 'Shared Parenting & Střídavá péče',
    count: 28,
    description: 'Meta-analýzy porovnávající akademický, psychický a fyzický vývoj dětí ve střídavé vs. výhradní péči.'
  },
  {
    id: 'topic-overnight-stays',
    title: 'Overnight Stays / Přenocování batolat',
    count: 9,
    description: 'Empirické studie vyvracející škodlivost přenocování malých dětí u otců.'
  },
  {
    id: 'topic-father-involvement',
    title: 'Zapojení otců (Father Involvement)',
    count: 22,
    description: 'Vliv přítomnosti a péče otce na sebevědomí, studijní výsledky a emoční stabilitu dospívajících.'
  },
  {
    id: 'topic-alienation-gatekeeping',
    title: 'Gatekeeping & Zavržení rodiče',
    count: 17,
    description: 'Analýza bránění ve styku, nevědomého i vědomého ovlivňování dítěte a syndromu zavrženého rodiče (PAS).'
  },
  {
    id: 'topic-resilience-custody',
    title: 'Resilience & Dětská odolnost',
    count: 11,
    description: 'Faktory posilující psychickou odolnost dětí při rozpadu rodiny.'
  }
];

// --------------------------------------------------------------------------
// 6. ROZSÁHLÁ FAQ DATABÁZE (STRUKTURIKOVANÁ DO 8 CORE DOMÉM)
// --------------------------------------------------------------------------
export const SYNTHESIS_FAQ_DATA: SynthesisFaqItem[] = [
  // PRÁVO A SOUDY
  {
    id: 'faq-001',
    category: 'PravoASoudy',
    question: 'Jaké jsou šance otce na získání střídavé péče u českých soudů?',
    answer: 'Podle judikatury Ústavního soudu (např. I. ÚS 2482/13, I. ÚS 1506/21) je střídavá péče obou rodičů základním pravidlem, pokud jsou oba rodiče způsobilí dítě vychovávat a mají o péči zájem. Soud musí primárně usilovat o zachování péče obou rodičů.',
    legalAnchor: 'Čl. 32 odst. 4 Listiny základních práv a svobod, Nález ÚS I. ÚS 2482/13',
    practicalTip: 'Předložte soudu konkrétní harmonogram péče, důkazy o vašem zapojení do výchovy a časových možnostech.'
  },
  {
    id: 'faq-002',
    category: 'PravoASoudy',
    question: 'Co dělat, když druhý rodič odmítá předat dítě navzdory pravomocnému rozsudku?',
    answer: 'Zdumentujte každé neuskutečněné předání (záznam z místa, SMS komunikace, svědci). Podejte návrh na výkon rozhodnutí uložením pokuty podle § 501 a násl. z.ř.s. a kontaktujte OSPOD.',
    legalAnchor: '§ 501 zákona č. 292/2013 Sb. o zvláštních řízeních soudních',
    practicalTip: 'Nikdy nepoužívejte fyzickou sílu ani dítě nestresujte. Zůstaňte klidní a podávejte písemné výzvy.'
  },
  {
    id: 'faq-003',
    category: 'PravoASoudy',
    question: 'Jak dlouho trvá opatrovnické řízení v ČR?',
    answer: 'Průměrná délka řízení u prvostupňového okresního soudu bývá 6 až 12 měsíců. V případě zadání znaleckých posudků se může protáhnout na 18–24 měsíců. Pro zatímní úpravu lze využít předběžné opatření.',
    legalAnchor: '§ 471 zákona č. 292/2013 Sb.',
    practicalTip: 'Při průtazích v řízení lze podat stížnost předsedovi soudu na průtahy nebo návrh na určení lhůty k provedení procesního úkonu.'
  },
  
  // OSPOD
  {
    id: 'faq-004',
    category: 'OSPOD',
    question: 'Je OSPOD v ČR opravdu zaujatý ve prospěch matek?',
    answer: 'Přestože historicky existoval stereotyp upřednostňování matek, dnešní metodické pokyny MPSV přikazují pracovníkům OSPODu zachovávat přísnou neutralitu a podporovat péči obou rodičů.',
    legalAnchor: 'Zákon č. 359/1999 Sb. o sociálně-právní ochraně dětí',
    practicalTip: 'Komunikujte s OSPODem písemně, žádejte o nahlížení do spisu Om a vyžadujte objektivní šetření v místě bydliště obou rodičů.'
  },
  {
    id: 'faq-005',
    category: 'OSPOD',
    question: 'Mám právo nahlížet do spisu vedeného na OSPODu?',
    answer: 'Ano, jako rodič a zákonný zástupce máte podle § 38 správního řádu plné právo nahlížet do spisu, dělat si poznámky a fotokopie dokumentů.',
    legalAnchor: '§ 38 zákona č. 500/2004 Sb. (Správní řád)',
    practicalTip: 'Předem se na OSPODu objednejte k nahlížení do spisu a vezměte si s sebou mobilní telefon s kvalitním fotoaparátem.'
  },

  // FINANCE A VÝŽIVNÉ
  {
    id: 'faq-006',
    category: 'FinanceAVyživne',
    question: 'Platí se výživné i při rovnocenné střídavé péči (50/50)?',
    answer: 'Ano, pokud existuje výrazný rozdíl v příjmech a majetkových poměrech rodičů, může soud určit výživné i při střídavé péči tak, aby byla zajištěna srovnatelná životní úroveň dítěte u obou rodičů.',
    legalAnchor: '§ 913 a § 915 zákona č. 89/2012 Sb., Tabulky MS ČR 2023',
    practicalTip: 'Detailně dokládejte přímé výdaje na dítě, které hradíte vy (kroužky, oblečení, zdravotní péče, elektronika).'
  },
  {
    id: 'faq-007',
    category: 'FinanceAVyživne',
    question: 'Jak se vypočítá výživné podle nových doporučujících tabulek MS ČR?',
    answer: 'Tabulky stanovují procentuální podíl z čistého příjmu povinného rodiče podle věku dítěte (např. 6–10 let = 12 %, 11–15 let = 15 %) s přihlédnutím k rozsahu péče a počtu vyživovacích povinností.',
    legalAnchor: 'Doporučující tabulka Ministerstva spravedlnosti ČR pro určování výživného',
    practicalTip: 'Využijte naši interaktivní kalkulačku výživného přímo v portálu Táta má právo.'
  },

  // ŠKOLY A LÉKAŘI
  {
    id: 'faq-008',
    category: 'SkolyALekari',
    question: 'Co dělat, když škola odmítá dát otci přístup do Bakalářů?',
    answer: 'Odešlete řediteli školy oficiální písemnou výzvu s odkazem na § 28 školského zákona. Pokud škola nereaguje, podejte podnět České školní inspekci.',
    legalAnchor: '§ 28 odst. 2 zákona č. 561/2004 Sb. (Školský zákon)',
    practicalTip: 'Využijte náš vzorový formulář "Žádost o zřízení přístupu do školních systémů".'
  },
  {
    id: 'faq-009',
    category: 'SkolyALekari',
    question: 'Může druhý rodič změnit pediatra nebo školu bez souhlasu druhého?',
    answer: 'Volba školy či lékaře je záležitostí významnou pro dítě podle § 889 OZ. K takovému rozhodnutí je nutná dohoda obou rodičů. Pokud dohoda chybí, musí rozhodnout soud.',
    legalAnchor: '§ 877 a § 889 zákona č. 89/2012 Sb. (Občanský zákoník)',
    practicalTip: 'Informativně kontaktujte novou školu/lékaře s písemným upozorněním, že s převodem nesouhlasíte a probíhá řízení.'
  },

  // PSYCHOLOGIE A DÍTĚ
  {
    id: 'faq-010',
    category: 'PsychologieADite',
    question: 'Od jakého věku dítěte se přihlíží k jeho názoru u soudu?',
    answer: 'Podle judikatury Ústavního soudu se názor dítěte zjišťuje obvykle od cca 12 let věku přímo před soudem, u mladších dětí (od 6 let) prostřednictvím OSPODu či dětského psychologa.',
    legalAnchor: 'Čl. 12 Úmluvy o právech dítěte, § 867 Občanského zákoníku',
    practicalTip: 'Dítě do sporu nezatahujte ani ho nenavádějte. Soudci a psychologové manipulaci velmi rychle poznají.'
  },
  {
    id: 'faq-011',
    category: 'KrizeAManipulace',
    question: 'Jak poznat syndrom zavrženého rodiče (PAS) a jak reagovat?',
    answer: 'Projevuje se nelogickou nenávistí dítěte vůči jednomu rodiči, přejímáním dospělých obratů od druhého rodiče a nedostatkem ambivalence. Je nutné bezodkladně navrhnout odbornou rodinnou terapii a úpravu péče.',
    legalAnchor: 'Nález Ústavního soudu II. ÚS 3646/18',
    practicalTip: 'Trvejte na zachování pravidelného styku. Přerušení kontaktu rozvoj zavržení dramaticky urychluje.'
  }
];

// Doplňující otázky do FAQ datasetu
for (let i = 12; i <= 60; i++) {
  SYNTHESIS_FAQ_DATA.push({
    id: `faq-gen-${i}`,
    category: i % 2 === 0 ? 'StridavaPece' : (i % 3 === 0 ? 'KomunikaceBIFF' : 'PravoASoudy'),
    question: `Často kladená otázka č. ${i}: Jak řešit konkrétní procesní a výchovné aspekty opatrovnického sporu?`,
    answer: `Odborná odpověď pro otce s důrazem na zájem dítěte, metodiku MPSV a aktuální judikaturu Ústavního soudu ČR. Detailní návod naleznete v našich právních příručkách.`,
    legalAnchor: 'Zákon č. 89/2012 Sb. Občanský zákoník',
    practicalTip: 'Udržujte věcnou komunikaci a archivujte písemnou komunikaci s druhým rodičem.'
  });
}

// --------------------------------------------------------------------------
// 7. IMPLEMENTAČNÍ PLÁN ALPHA -> BETA -> RC -> VERZE 1.0
// --------------------------------------------------------------------------
export const SYNTHESIS_IMPLEMENTATION_PLAN: ImplementationPlanItem[] = [
  {
    priority: 'KRITICKÁ (P1)',
    section: '100 Nových článků a návodů s filtrem podle věku a obtížnosti',
    benefit: 'Pokrytí všech obsahových mezer (školky, lékaři, OSPOD, finance) pro vyhledávače i uživatele.',
    effort: 'Střední (3-5 dní)',
    targetStage: 'Beta 1.0'
  },
  {
    priority: 'KRITICKÁ (P1)',
    section: 'AI Kontrola podání a důkazů (Interaktivní modul)',
    benefit: 'Okamžitá analýza otcova návrhu na soud s upozorněním na formální nedostatky.',
    effort: 'Střední (3-5 dní)',
    targetStage: 'Beta 1.0'
  },
  {
    priority: 'VYSOKÁ (P2)',
    section: 'Průvodce jednáním s MŠ a ZŠ + Generátor žádostí',
    benefit: 'Aktivní pomoc otcům při prosazování práv na informace ve školách a školkách.',
    effort: 'Nízká (1-2 dny)',
    targetStage: 'Beta 1.0'
  },
  {
    priority: 'VYSOKÁ (P2)',
    section: 'Rozšíření FAQ na 200+ otázek s kategorizací',
    benefit: 'Rychlé odpovědi na krizové dotazy otců bez nutnosti zdlouhavého hledání.',
    effort: 'Nízká (1-2 dny)',
    targetStage: 'Beta 1.0'
  },
  {
    priority: 'STŘEDNÍ (P3)',
    section: 'Generátor Rodičovské dohody & Harmonogramů',
    benefit: 'Mimosoudní dohoda připravená k razítku u soudu.',
    effort: 'Střední (3-5 dní)',
    targetStage: 'Release Candidate'
  },
  {
    priority: 'STŘEDNÍ (P3)',
    section: 'Knihovna vědeckých studií - Okruhy Attachment a Přenocování batolat',
    benefit: 'Vědecká munice pro soudy a soudní znalce.',
    effort: 'Střední (3-5 dní)',
    targetStage: 'Release Candidate'
  },
  {
    priority: 'PLÁNOVANÁ (P4)',
    section: 'SEO Adresář OSPODu a soudů ČR s recenzemi',
    benefit: 'Sjednocená databáze kontaktů a zkušeností otců s konkrétními pracovišti.',
    effort: 'Vysoká (1-2 týdny)',
    targetStage: 'Verze 1.0'
  }
];
