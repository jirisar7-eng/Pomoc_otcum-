/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HubArticle {
  id: string;
  title: string;
  category: 'pece-o-dite' | 'soudni-rizeni' | 'vyzivne' | 'ospod';
  tags: string[];
  excerpt: string;
  content: string;
  lastUpdated: string;
  relatedJudgments: string[]; // IDs of Judgments
  relatedStudies: string[];   // IDs of Studies
  relatedTemplates: string[]; // IDs of Templates
  viewCount: number;
  wordCount: number;
}

export interface HubJudgment {
  id: string;
  title: string;
  court: string;
  fileNo: string; // spisová značka, e.g. I. ÚS 2482/13
  excerpt: string;
  fullAnalysis: string;
  tags: string[];
}

export interface HubStudy {
  id: string;
  title: string;
  authors: string;
  year: number;
  excerpt: string;
  conclusion: string;
  tags: string[];
}

export interface HubTemplate {
  id: string;
  title: string;
  category: 'petitions' | 'appeals' | 'complaints';
  desc: string;
  defaultText: string;
}

export interface HubTerm {
  id: string;
  term: string;
  definition: string;
  tags: string[];
  relatedArticles: string[]; // IDs of Articles
}

export interface HubFaq {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

// Global Single Source of Truth Database
export const HUB_JUDGMENTS: HubJudgment[] = [
  {
    id: 'jud-1',
    title: 'Priorita střídavé péče při splnění zákonných kritérií',
    court: 'Ústavní soud ČR',
    fileNo: 'I. ÚS 2482/13',
    excerpt: 'Svěření dítěte do střídavé péče musí být prioritním řešením, pokud jsou oba rodiče způsobilí o dítě pečovat a mají o péči zájem.',
    fullAnalysis: 'Tento klíčový nález Ústavního soudu definuje, že střídavá péče je základním východiskem po rozpadu rodiny. Pokud oba rodiče vyjadřují upřímný zájem o péči, mají k ní odpovídající podmínky a jsou výchovně způsobilí, je soud povinen střídavou péči nařídit. Výjimku tvoří pouze závažné důvody ohrožující nejlepší zájem dítěte, které musí být soudem řádně a individuálně prokázány, nikoliv pouze předjímány.',
    tags: ['střídavá péče', 'ústavní právo', 'rovnocenné rodičovství']
  },
  {
    id: 'jud-2',
    title: 'Střídavá péče u dětí útlého věku (kojenec/batole)',
    court: 'Ústavní soud ČR',
    fileNo: 'I. ÚS 1506/21',
    excerpt: 'Nízký věk dítěte (v tomto případě 2 roky) sám o sobě nemůže být překážkou pro nařízení střídavé péče, pokud jsou oba rodiče dostatečně citově navázáni.',
    fullAnalysis: 'Soud vyvrátil dřívější dogma, že malé děti patří výhradně matce. Rozhodující je kvalita citové vazby k oběma rodičům a jejich schopnost citlivě reagovat na potřeby dítěte. Ústavní soud zdůraznil, že budování bezpečné vazby (attachment) k otci v útlém věku je klíčové pro budoucí psychický vývoj dítěte, a proto je střídavá nebo velmi široká péče u batolat žádoucí.',
    tags: ['kojenec', 'batole', 'attachment', 'útlý věk']
  },
  {
    id: 'jud-3',
    title: 'Nesouhlas jednoho z rodičů jako překážka střídavé péče',
    court: 'Ústavní soud ČR',
    fileNo: 'III. ÚS 149/20',
    excerpt: 'Pouhý iracionální nesouhlas matky nebo otce se střídavou péčí nemůže být důvodem pro její vyloučení. Soudy musí zkoumat motivaci tohoto nesouhlasu.',
    fullAnalysis: 'Pokud jeden z rodičů blokuje dohodu a odmítá střídavou péči pouze z důvodu osobní animozity, finančních motivů (snaha udržet si vysoké výživné) nebo snahy o exkluzivitu, nesmí soudy tomuto vetu ustupovat. Naopak, takové chování může svědčit o snížené výchovné způsobilosti dotčeného rodiče respektovat roli druhého rodiče v životě dítěte.',
    tags: ['nesouhlas rodiče', 'vetování', 'konflikt']
  }
];

export const HUB_STUDIES: HubStudy[] = [
  {
    id: 'std-1',
    title: 'Social and Academic Development in Joint Physical Custody vs. Sole Custody',
    authors: 'Dr. Linda Nielsen, Wake Forest University',
    year: 2018,
    excerpt: 'Meta-analýza 60 vědeckých studií prokazuje, že děti ve střídavé péči dosahují lepších výsledků v oblasti psychického zdraví, chování a školních výsledků než děti ve výhradní péči.',
    conclusion: 'Děti žijící v uspořádání střídavé péče (kde s každým rodičem tráví alespoň 35 % času) vykazují méně psychosomatických potíží, nižší míru úzkostí a depresí a zdravější sociální vazby. Výsledky platí i pro rodiny s přetrvávajícím vysokým stupněm rodičovského konfliktu, což vyvrací mýtus, že pro střídavou péči je nutná bezchybná komunikace rodičů.',
    tags: ['psychologie', 'výzkum', 'Linda Nielsen', 'psychické zdraví']
  },
  {
    id: 'std-2',
    title: 'Infants and Toddlers in Joint Physical Custody: Attachment Security and Sleep Quality',
    authors: 'Warshak, R. A.',
    year: 2014,
    excerpt: 'Konsensuální zpráva podpořená 110 předními světovými odborníky na dětský vývoj potvrzuje bezpečnost střídavé péče přes noc u dětí do 4 let.',
    conclusion: 'Studie prokazuje, že přespávání u otce od nejútlejšího věku (včetně kojenců a batolat) nenarušuje vazbu k matce, ale naopak posiluje sekundární bezpečnou vazbu k otci. Děti, které pravidelně trávily noci s oběma rodiči, byly v pozdějším věku sebevědomější, emočně stabilnější a lépe zvládaly zátěžové situace.',
    tags: ['kojenec', 'batole', 'attachment', 'přespávání', 'Warshak']
  }
];

export const HUB_TEMPLATES: HubTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Návrh na svěření nezletilého do střídavé péče rodičů',
    category: 'petitions',
    desc: 'Základní vzor žaloby k opatrovnickému soudu o úpravu poměrů pro střídavou péči. Obsahuje doporučenou právní argumentaci a odkaz na nález Ústavního soudu.',
    defaultText: `Okresnímu soudu v [CITY]\n[COURT_ADDRESS]\n\nŽalobce (Otec): [FATHER_NAME], nar. [FATHER_BIRTH], bytem [FATHER_ADDRESS]\nŽalovaná (Matka): [MOTHER_NAME], nar. [MOTHER_BIRTH], bytem [MOTHER_ADDRESS]\n\nNezletilé děti: [CHILDREN_NAMES]\n\nNÁVRH OTCE NA ÚPRAVU PÉČE A SVĚŘENÍ NEZLETILÝCH DO STŘÍDAVÉ PÉČE RODIČŮ\n\nI.\nRodiče nezletilých dětí uzavřeli manželství, které bylo rozvedeno / žili ve společné domácnosti. Z jejich vztahu se narodily nezletilé děti: [CHILDREN_NAMES]. Rodiče se po rozpadu vztahu nedohodli na dalším uspořádání péče o děti.\n\nII.\nOtec má plné rodičovské kompetence, doložitelnou materiální i psychologickou připravenost a zájem o rovnocenný podíl na výchově. Bytové podmínky otce jsou nadstandardní, děti mají k dispozici vlastní zařízené pokoje. Bydliště obou rodičů se nachází v rozumné vzdálenosti, což umožňuje bezproblémové pokračování školní docházky.\n\nIII.\nV souladu s konstantní judikaturou Ústavního soudu ČR je střídavá péče prioritním modelem uspořádání, pokud jsou oba rodiče způsobilí. Svěření dětí pouze do výhradní péče jednoho z rodičů by znamenalo porušení ústavního práva dětí na péči obou rodičů.\n\nProto navrhuji, aby soud po provedeném dokazování vydal tento\n\nR O Z S U D E K :\n\n1. Nezletilé děti [CHILDREN_NAMES] se svěřují do střídavé péče obou rodičů, a to v pravidelném intervalu střídání po 7 dnech, s předáváním každé pondělí v 8:00 hod v prostorách školy/školky.\n2. Výživné se stanovuje s přihlédnutím k poměrům obou rodičů.\n\nV [CITY] dne [DATE]\n\n........................................\n[FATHER_NAME] (Otec)`
  },
  {
    id: 'tpl-2',
    title: 'Vyjádření otce k návrhu matky na výhradní péči',
    category: 'appeals',
    desc: 'Nesouhlasné stanovisko s výhradní péčí matky. Navrhuje střídavou péči jako jedinou ústavně konformní alternativu chránící zájem dítěte.',
    defaultText: `Okresnímu soudu v [CITY]\nK sp. zn.: [CASE_NUMBER]\n\nŽalobce (Otec): [FATHER_NAME], bytem [FATHER_ADDRESS]\nŽalovaná (Matka): [MOTHER_NAME], bytem [MOTHER_ADDRESS]\n\nVYJÁDŘENÍ OTCE K NÁVRHU MATKY NA SVĚŘENÍ DĚTÍ DO JEJÍ VÝHRADNÍ PÉČE\n\nK výzvě soudu se tímto vyjadřuji k návrhu matky na svěření dětí do její výhradní péče. S návrhem matky zásadně nesouhlasím.\n\nVztah dětí k otci je velmi silný a vřelý. Otec se o děti aktivně staral od jejich narození a neexistuje žádný objektivní důvod, proč by měl být jeho kontakt s dětmi degradován na pouhý víkendový styk. Návrh matky považuji za účelovou snahu o vytěsnění otce ze života dětí.\n\nNavrhuji proto, aby soud návrh matky zamítl a rozhodl o svěření nezletilých dětí [CHILDREN_NAMES] do střídavé péče obou rodičů.\n\nV [CITY] dne [DATE]\n\n........................................\n[FATHER_NAME] (Otec)`
  },
  {
    id: 'tpl-3',
    title: 'Stížnost na neprofesionální postup kolizního opatrovníka (OSPOD)',
    category: 'complaints',
    desc: 'Formální stížnost vedoucímu odboru sociálních věcí na podjatost, ignorování důkazů nebo genderově stereotypní přístup sociální pracovnice.',
    defaultText: `Městskému úřadu v [CITY]\nVedoucímu odboru sociálně-právní ochrany dětí\n\nStěžovatel: [FATHER_NAME], bytem [FATHER_ADDRESS]\nSpisová značka dítka: [CASE_NUMBER]\n\nSTÍŽNOST NA NEPROFESIONÁLNÍ A PODJATÝ POSTUP SOCIÁLNÍ PRACOVNICE [OFFICER_NAME]\n\nTímto podávám formální stížnost na postup jmenované sociální pracovnice, která vykonává funkci kolizního opatrovníka pro mé nezletilé děti: [CHILDREN_NAMES].\n\nDůvody stížnosti:\n1. Pracovnice vykazuje zjevnou podjatost vůči mé osobě, ignoruje předložené důkazy o mých rodičovských kompetencích a bezvýhradně přejímá neověřená tvrzení matky.\n2. Při domácím šetření jednala nátlakově a činila na děti sugestivní dotazy s cílem získat negativní vyjádření o otci.\n3. Odmítá zařadit mé vyjádření do spisové dokumentace.\n\nŽádám o prověření postupu jmenované pracovnice, zjednání nápravy a případné přidělení spisu jinému nezávislému pracovníkovi OSPOD.\n\nV [CITY] dne [DATE]\n\n........................................\n[FATHER_NAME]`
  }
];

export const HUB_ARTICLES: HubArticle[] = [
  {
    id: 'art-1',
    title: 'Střídavá péče u dětí do tří let',
    category: 'pece-o-dite',
    tags: ['kojenec', 'střídavá péče', 'attachment', 'útlý věk'],
    excerpt: 'Praktický průvodce s vědeckými argumenty a judikaturou vyvracející mýty o nemožnosti střídavé péče u malých dětí (kojenců a batolat).',
    content: `Častým argumentem opatrovnických soudů i pracovníků OSPOD bývá tvrzení, že dítě do tří let věku je biologicky fixováno výhradně na matku a střídavá péče nebo přespávání u otce by mohlo vážně narušit jeho zdravý psychický vývoj. Moderní věda a judikatura Ústavního soudu však hovoří zcela jinak.

Základní psychologický koncept "attachmentu" (citové vazby) definuje, že dítě si vytváří bezpečnou vazbu k osobám, které o něj dlouhodobě pečují a citlivě reagují na jeho potřeby. Otec je schopen vybudovat si stejně kvalitní a bezpečnou vazbu jako matka.

Vědecká konsensuální zpráva Dr. Richarda Warshaka (2014) podpořená 110 mezinárodními experty jasně doporučuje přespávání dětí u otců od útlého věku. Omezení kontaktu s otcem na pár hodin týdně naopak vede k odcizení a zhoršení budoucího vývoje dítěte.

Soudy jsou povinny zkoumat individuální situaci, nikoliv uplatňovat obecné předsudky o věku dítěte.`,
    lastUpdated: '2026-06-15',
    relatedJudgments: ['jud-2'],
    relatedStudies: ['std-2'],
    relatedTemplates: ['tpl-1'],
    viewCount: 1240,
    wordCount: 185
  },
  {
    id: 'art-2',
    title: 'Jak čelit manipulativním technikám u soudu',
    category: 'soudni-rizeni',
    tags: ['soudní taktika', 'manipulace', 'dokazování'],
    excerpt: 'Průvodce pro otce, jak reagovat na falešná obvinění ze syndromu odcizení, násilí nebo zanedbávání péče s chladnou hlavou a věcnými důkazy.',
    content: `Opatrovnické spory jsou bohužel často plné emocí a neférových taktik. Jednou z nejčastějších strategií je snaha vykreslit otce jako tyrana, alkoholika nebo emočně nestabilního člověka.

Jak reagovat?
1. Zachovejte absolutní klid a emočně nereagujte. Jakýkoliv výbuch hněvu u soudu bude použit proti vám jako důkaz vaší "agresivity".
2. Předkládejte věcné důkazy. Komunikujte s matkou výhradně písemně (SMS, e-mail) a veškerou komunikaci si archivujte.
3. Používejte moderní monitorovací nástroje (sdílený Google Kalendář, aplikace pro spolurodičovství) k dokládání vašich snah o dohodu.

Pamatujte, že soudce hodnotí vaši schopnost povznést se nad konflikt a jednat výhradně v zájmu dětí.`,
    lastUpdated: '2026-07-02',
    relatedJudgments: ['jud-3'],
    relatedStudies: ['std-1'],
    relatedTemplates: ['tpl-2'],
    viewCount: 980,
    wordCount: 154
  },
  {
    id: 'art-3',
    title: 'Práva otce při šetření OSPOD v domácnosti',
    category: 'ospod',
    tags: ['ospod', 'domácí šetření', 'práva'],
    excerpt: 'Co může a nemůže sociální pracovnice při kontrole vašeho obydlí, jak se na návštěvu připravit a co zapsat do protokolu.',
    content: `Návštěva kolizního opatrovníka (OSPOD) u vás doma je jedním z nejdůležitějších momentů celého řízení. Pracovnice hodnotí nejen materiální zázemí, ale zejména váš vztah s dětmi a úroveň hygieny.

Důležitá pravidla:
- Na návštěvu se předem domluvte. OSPOD může přijít i neohlášeně, ale jde o výjimečné případy.
- Zajistěte pro dítě vlastní zařízený kout nebo pokoj (postel, hračky, studijní stůl).
- Buďte k pracovnici slušní, ale asertivní. Máte právo na pořízení kopie zápisu z domácího šetření a vyjádření se k němu.
- Pokud máte podezření na podjatost, podejte písemnou stížnost vedoucímu odboru.`,
    lastUpdated: '2026-05-10',
    relatedJudgments: ['jud-3'],
    relatedStudies: [],
    relatedTemplates: ['tpl-3'],
    viewCount: 1450,
    wordCount: 140
  }
];

export const HUB_GLOSSARY: HubTerm[] = [
  {
    id: 'term-1',
    term: 'Attachment (Citová vazba)',
    definition: 'Hluboké emociální pouto, které se vytváří mezi dítětem a jeho primárními pečujícími osobami během prvního roku života. Tradičně se věřilo, že se tvoří pouze k matce, moderní věda však jednoznačně dokazuje schopnost dětí vytvořit si bezpečný attachment k oběma rodičům paralelně.',
    tags: ['attachment', 'psychologie', 'vývoj'],
    relatedArticles: ['art-1']
  },
  {
    id: 'term-2',
    term: 'Kolizní opatrovník (OSPOD)',
    definition: 'Orgán sociálně-právní ochrany dětí jmenovaný soudem, aby zastupoval zájmy nezletilého dítěte v soudním řízení, jelikož zájmy rodičů mohou být v kolizi. OSPOD provádí šetření v rodině, dává soudu doporučení a vyjadřuje se k návrhům rodičů.',
    tags: ['ospod', 'soud', 'zástupce'],
    relatedArticles: ['art-3']
  },
  {
    id: 'term-3',
    term: 'Syndrom odcizení rodiče (PAS)',
    definition: 'Psychologický stav, kdy dítě systematickým působením jednoho rodiče (programováním) začne bezdůvodně odmítat a nenávidět druhého rodiče, ke kterému mělo dříve vřelý vztah. Jde o závažnou formu psychického týrání dítěte.',
    tags: ['syndrom odcizení', 'psychologie', 'manipulace'],
    relatedArticles: ['art-2']
  }
];

export const HUB_FAQS: HubFaq[] = [
  {
    id: 'faq-1',
    question: 'Může být střídavá péče schválena i bez souhlasu matky?',
    answer: 'Ano, konstantní judikatura Ústavního soudu potvrzuje, že nesouhlas jednoho z rodičů nemůže střídavou péči automaticky zablokovat. Pokud soud zjistí, že nesouhlas je účelový a nepramení z objektivního zájmu dítěte, střídavou péči nařídí.',
    tags: ['střídavá péče', 'soud', 'souhlas']
  },
  {
    id: 'faq-2',
    question: 'Jaké jsou optimální střídavé intervaly pro dvouleté dítě?',
    answer: 'U batolat se doporučují kratší asymetrické nebo symetrické intervaly (např. 2-2-3 dny), aby dítě nebylo bez kontaktu s žádným z rodičů příliš dlouho. Klasický týdenní cyklus (7 a 7 dní) je vhodný až od cca 4-5 let věku.',
    tags: ['batole', 'střídání', 'věk dětí']
  }
];

// Helper search function that acts as our "Content Hub API" for the Perplexity model!
export function searchContentHub(query: string) {
  const lowercaseQuery = query.toLowerCase();

  const articles = HUB_ARTICLES.filter(
    a => a.title.toLowerCase().includes(lowercaseQuery) || 
         a.content.toLowerCase().includes(lowercaseQuery) || 
         a.tags.some(t => t.includes(lowercaseQuery))
  );

  const judgments = HUB_JUDGMENTS.filter(
    j => j.title.toLowerCase().includes(lowercaseQuery) || 
         j.excerpt.toLowerCase().includes(lowercaseQuery) || 
         j.fullAnalysis.toLowerCase().includes(lowercaseQuery) || 
         j.fileNo.toLowerCase().includes(lowercaseQuery) ||
         j.tags.some(t => t.includes(lowercaseQuery))
  );

  const studies = HUB_STUDIES.filter(
    s => s.title.toLowerCase().includes(lowercaseQuery) || 
         s.excerpt.toLowerCase().includes(lowercaseQuery) || 
         s.conclusion.toLowerCase().includes(lowercaseQuery) || 
         s.authors.toLowerCase().includes(lowercaseQuery) ||
         s.tags.some(t => t.includes(lowercaseQuery))
  );

  const templates = HUB_TEMPLATES.filter(
    t => t.title.toLowerCase().includes(lowercaseQuery) || 
         t.desc.toLowerCase().includes(lowercaseQuery)
  );

  const terms = HUB_GLOSSARY.filter(
    g => g.term.toLowerCase().includes(lowercaseQuery) || 
         g.definition.toLowerCase().includes(lowercaseQuery) ||
         g.tags.some(t => t.includes(lowercaseQuery))
  );

  const faqs = HUB_FAQS.filter(
    f => f.question.toLowerCase().includes(lowercaseQuery) || 
         f.answer.toLowerCase().includes(lowercaseQuery)
  );

  return {
    articles,
    judgments,
    studies,
    templates,
    terms,
    faqs
  };
}
