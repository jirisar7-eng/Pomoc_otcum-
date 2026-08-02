/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HubCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface HubArticle {
  id: string;
  title: string;
  category: string;
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
  publisher?: string;
  categoryType?: 'international' | 'domestic' | 'criticism';
  keyContribution?: string;
  courtArgumentation?: string;
  opponentsAnalysis?: string;
}

export interface HubTemplate {
  id: string;
  title: string;
  category: 'petitions' | 'appeals' | 'complaints';
  desc: string;
  defaultText: string;
  categorySlug?: string;
  tags?: string[];
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

export const HUB_CATEGORIES: HubCategory[] = [
  {
    id: 'cat-1',
    slug: 'pravni-rad',
    name: 'Právní řád a legislativa',
    icon: '⚖️',
    description: 'Zákony, úmluvy, paragrafy občanského zákoníku a jejich praktický výklad pro rodinné právo.',
    color: 'emerald'
  },
  {
    id: 'cat-2',
    slug: 'judikatura',
    name: 'Judikatura a precedenty',
    icon: '🏛️',
    description: 'Klíčové nálezy a rozsudky Ústavního soudu, Nejvyššího soudu a ESLP zaručující práva otců.',
    color: 'indigo'
  },
  {
    id: 'cat-3',
    slug: 'stridava-pece',
    name: 'Střídavá a společná péče',
    icon: '🤝',
    description: 'Modely, organizace střídání, praxe, vyvracení mýtů a budování stabilního dvojího domova.',
    color: 'teal'
  },
  {
    id: 'cat-4',
    slug: 'nocni-pece',
    name: 'Noční péče a přespávání kojenců',
    icon: '🌙',
    description: 'Odborná vědecká zdůvodnění pro noclehy a noční péči otců u dětí nejranějšího věku.',
    color: 'purple'
  },
  {
    id: 'cat-5',
    slug: 'psychologie-attachment',
    name: 'Psychologie dítěte & Attachment',
    icon: '🧠',
    description: 'Citová vazba, vývoj mozku, emocionální potřeby dětí a význam otce pro zdravý vývoj.',
    color: 'sky'
  },
  {
    id: 'cat-6',
    slug: 'rodicovska-alienace',
    name: 'Rodičovská alienace (PAS)',
    icon: '🧩',
    description: 'Rozpoznání syndromu zavrženého rodiče, prevence manipulace a právní obrana.',
    color: 'rose'
  },
  {
    id: 'cat-7',
    slug: 'jednani-ospod',
    name: 'Jednání s OSPOD a úřady',
    icon: '🏢',
    description: 'Taktika jednání, práva a povinnosti sociálních pracovníků, námitky podjatosti a stížnosti.',
    color: 'amber'
  },
  {
    id: 'cat-8',
    slug: 'vzory-podani',
    name: 'Vzory podání a žalob',
    icon: '📄',
    description: 'Procesně přesné návrhy k soudu, odvolání, vyjádření, předběžná opatření a stížnosti.',
    color: 'blue'
  },
  {
    id: 'cat-9',
    slug: 'vyzivne-majetek',
    name: 'Výživné a majetkové vyrovnání',
    icon: '💶',
    description: 'Kalkulačky výživného, přiměřená alimenty, úhrada mimořádných potřeb a majetkové vyrovnání.',
    color: 'emerald'
  },
  {
    id: 'cat-10',
    slug: 'zdravi-vyvoj',
    name: 'Zdraví, vývoj a péče',
    icon: '🏥',
    description: 'Zdravotní péče o dítě, očkování, výběr lékařů a rovnocenný přístup otce k medicínským informacím.',
    color: 'red'
  },
  {
    id: 'cat-11',
    slug: 'vzdelavani-cas',
    name: 'Vzdělávání a volný čas',
    icon: '🏫',
    description: 'Výběr školky a školy, zájmové kroužky, právo otce na informace z rozvrhu a školních systémů (Bakaláři).',
    color: 'violet'
  },
  {
    id: 'cat-12',
    slug: 'komunikace-rodice',
    name: 'Komunikace s druhým rodičem',
    icon: '🗣️',
    description: 'Asertivní komunikace, písemná komunikace, rodičovské aplikace, dohody a mediace.',
    color: 'orange'
  },
  {
    id: 'cat-13',
    slug: 'krizova-pomoc',
    name: 'Krizová pomoc a SOS',
    icon: '🚨',
    description: 'Okamžitá krizová intervence, řešení akutního bezdůvodného maření styku a linky pomoci.',
    color: 'rose'
  },
  {
    id: 'cat-14',
    slug: 'falesna-obvineni',
    name: 'Falešná obvinění a ochrana práv',
    icon: '🛡️',
    description: 'Právní postupy při neopodstatněném osočení z domácího násilí či týrání na Policii ČR.',
    color: 'slate'
  },
  {
    id: 'cat-15',
    slug: 'mezinarodni-pravo',
    name: 'Mezinárodní právo a stěhování dětí',
    icon: '✈️',
    description: 'Aplikace Haagské úmluvy, přeshraniční únosy dětí a bezprávní přemístění do zahraničí.',
    color: 'cyan'
  },
  {
    id: 'cat-16',
    slug: 'sirsi-rodina',
    name: 'Význam širší rodiny a prarodičů',
    icon: '👥',
    description: 'Právo dítěte na styk s prarodiči, tetičkami, strýci a zachování sourozenecké vazby.',
    color: 'fuchsia'
  },
  {
    id: 'cat-17',
    slug: 'znalecke-posudky',
    name: 'Znalecké posudky a psychologové',
    icon: '📝',
    description: 'Průběh psychologického vyšetření rodiny, znalecké otázky, revizní posudky a námitky.',
    color: 'indigo'
  },
  {
    id: 'cat-18',
    slug: 'kritika-studii',
    name: 'Kritika překonaných studií',
    icon: '🔬',
    description: 'Demontáž zastaralých a metodicky chybných prací (McIntosh 2010) používaných proti otcům.',
    color: 'pink'
  },
  {
    id: 'cat-19',
    slug: 'technologie-ai',
    name: 'Technologie a AI pro táty',
    icon: '💻',
    description: 'Generativní AI asistenti, automatická analýza soudních protokolů a chytrá správa důkazů.',
    color: 'teal'
  },
  {
    id: 'cat-20',
    slug: 'komunita-zkusenosti',
    name: 'Komunita a sdílení zkušeností',
    icon: '🤝',
    description: 'Příběhy z praxe, vzájemná psychická i právní podpora táta tátovi a diskusní sítě.',
    color: 'lime'
  },
  {
    id: 'cat-21',
    slug: 'statistiky-vyzkumy',
    name: 'Statistiky a výzkumy',
    icon: '📊',
    description: 'Data a fakta z ČSÚ, Ministerstva spravedlnosti ČR, APA, Harvardu a mezinárodních institucí.',
    color: 'blue'
  }
];

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
  },
  {
    id: 'jud-4',
    title: 'Povinnost státu aktivně vynucovat styk a bránit maření péče',
    court: 'Ústavní soud ČR',
    fileNo: 'IV. ÚS 1921/17',
    excerpt: 'Soudy a OSPOD mají povinnost přijmout veškerá dostupná opatření k obnovení a vynucení styku dítěte s druhým rodičem, pokud mu v tom druhý rodič bezdůvodně brání.',
    fullAnalysis: 'Ústavní soud zdůraznil, že nečinnost soudů nebo orgánů OSPOD při systematickém maření styku jedním z rodičů zakládá porušení práva na rodinný život podle čl. 8 Úmluvy. Orgány veřejné moci nemohou pasivně přihlížet, jak jeden rodič odcizuje dítě, ale musí využít pokuty, předběžná opatření i uložení odborné terapie.',
    tags: ['maření styku', 'výkon rozhodnutí', 'OSPOD nečinnost', 'článek 8']
  },
  {
    id: 'jud-5',
    title: 'Odpovědnost ČR za nefunkční výkon rozhodnutí v opatrovnických věcech',
    court: 'Evropský soud pro lidská práva (ESLP)',
    fileNo: 'Voleský v. Česká republika (č. 63227/00)',
    excerpt: 'Česká republika porušila Článek 8 Úmluvy o lidských právech tím, že nedokázala zajistit včasný a účinný výkon rozhodnutí o styku otce s dítětem.',
    fullAnalysis: 'Průlomové rozhodnutí ESLP konstatovalo, že český stát nenesl dostatečnou odpovědnost za vymáhání práv otce. Nadměrné průtahy v konání soudů a OSPOD vedly k nenapravitelnému odcizení dítěte. ESLP přiznal otci finanční zadostiučinění a uložil ČR povinnost reformovat opatrovnické soudnictví.',
    tags: ['ESLP', 'lidská práva', 'průtahy', 'odcizení']
  },
  {
    id: 'jud-6',
    title: 'Rovnost rodičovských práv a nepřípustnost věkových stereotypů',
    court: 'Ústavní soud ČR',
    fileNo: 'I. ÚS 2482/22',
    excerpt: 'Apropriace dítěte jedním rodičem na základě věkového stereotypu (např. že batole potřebuje pouze matku) je ústavně nepřípustná. Soudy jsou povinny posuzovat individuální pečovatelské schopnosti otce.',
    fullAnalysis: 'Ústavní soud ČR v tomto nálezu výslovně zdůraznil, že automatické upřednostňování matky u dětí raného věku (např. do 3 let) porušuje ústavní princip rovnosti rodičů dle čl. 32 odst. 4 Listiny základních práv a svobod. Pokud otec vykazuje plnou výchovnou způsobilost, zájem o dítě a citovou vazbu, nemohou obecné soudy a OSPOD odmítat střídavou péči nebo přespávání u otce s pouhým odkazem na nízký věk dítěte.',
    tags: ['věkový stereotyp', 'útlý věk', 'rovnost rodičů', 'I. ÚS 2482/22']
  },
  {
    id: 'jud-7',
    title: 'Požadavky na neutralitu OSPOD a zjišťování názoru dítěte',
    court: 'Veřejný ochránce práv (Ombudsman) & Ústavní soud',
    fileNo: 'VOP 1284/2021/VOP',
    excerpt: 'OSPOD má zákonnou povinnost zachovávat striktní neutralitu vůči oběma rodičům. Zprávy OSPOD nesmí přejímat nekriticky tvrzení matky ani manipulovat výpovědi dítěte.',
    fullAnalysis: 'Veřejný ochránce práv ve svých šetřeních i metodických doporučeních pro orgány sociálně-právní ochrany dětí (OSPOD) opakovaně konstatoval, že pracovníci OSPOD se nesmí stavět do role advokáta matky. Při zjišťování názoru dítěte musí být vyloučen tlak a manipulace. Pokud OSPOD doporučí omezení styku otce bez objektivních důkazů (pouze na základě subjektivních dojmů matky), dochází k porušení právní povinnosti jednání v nejlepším zájmu dítěte.',
    tags: ['OSPOD', 'neutralita', 'ombudsman', 'názor dítěte']
  }
];

export const HUB_STUDIES: HubStudy[] = [
  {
    id: 'std-fabricius-2017',
    title: 'Should infants and toddlers have frequent overnight parenting time with fathers?',
    authors: 'Fabricius, W. V., & Suh, G. W. (Arizona State University)',
    year: 2017,
    publisher: 'Psychology, Public Policy, and Law (American Psychological Association)',
    categoryType: 'international',
    excerpt: 'Longitudinální studie prokazující dlouhodobé výhody přespávání dětí do 2-3 let u otců pro jejich budoucí dospělé vztahy s oběma rodiči.',
    keyContribution: 'Dlouhodobé výhody přespávání dětí do 2 let u otců pro jejich budoucí dospělé vztahy s oběma rodiči.',
    conclusion: 'Přespávání dětí u otce od raného věku vytváří pevné pečovatelské návyky a pocit bezpečí. Počet nocí strávených u otce do 3 let věku přímou úměrou předpovídá kvalitu a hloubku vztahu s otcem v dospělosti, aniž by jakkoliv poškodil vztah k matce.',
    courtArgumentation: 'Ze studie Fabricius & Suh (2017) vyplývá, že přespávání dítěte u otce v raném věku je nezbytnou podmínkou pro vytvoření celoživotního kvalitního vztahu s otcem, bez jakýchkoliv negativních dopadů na vztah k matce.',
    tags: ['batole', 'přespávání', 'Fabricius', 'noční péče', 'vazba', 'dlouhodobý vývoj']
  },
  {
    id: 'std-warshak-2014',
    title: 'Social science and parenting plans for young children: A consensus report (APA)',
    authors: 'Warshak, R. A. & 110 mezinárodních vědeckých expertů',
    year: 2014,
    publisher: 'Psychology, Public Policy, and Law (American Psychological Association)',
    categoryType: 'international',
    excerpt: 'Konsenzuální zpráva 110 předních světových odborníků odmítající paušální zákazy nocování u otců u malých dětí.',
    keyContribution: 'Konsenzuální zpráva 110 odborníků odmítající paušální zákazy nocování u otců u malých dětí.',
    conclusion: 'Studie prokazuje, že přespávání u otce od nejútlejšího věku (včetně kojenců a batolat) nenarušuje vazbu k matce, ale naopak posiluje sekundární bezpečnou vazbu k otci. Nulové přespávání v batolecím věku vede k trvalému oslabení otcovského vztahu.',
    courtArgumentation: 'Podle mezinárodního konsenzu 110 expertů publikovaného APA (Warshak 2014) nemá paušální odkládání nocování u otce žádnou vědeckou oporu a vážně ohrožuje přirozený vývoj nezletilého.',
    tags: ['Warshak', 'APA', 'konsenzus', 'kojenec', 'noční péče', 'attachment']
  },
  {
    id: 'std-bauserman-2002',
    title: 'Child adjustment in joint-custody versus sole-custody arrangements: A meta-analytic review',
    authors: 'Bauserman, R. (Maryland Dept of Health / APA)',
    year: 2002,
    publisher: 'Journal of Family Psychology (American Psychological Association)',
    categoryType: 'international',
    excerpt: 'Metaanalýza 33 studií srovnávající přes 4 400 dětí. Děti v uspořádání se sdíleným ubytováním vykazují lepší psychické přizpůsobení.',
    keyContribution: 'Děti v uspořádání se sdíleným ubytováním vykazují lepší psychické přizpůsobení než děti ve výhradní péči.',
    conclusion: 'Děti ve společné a střídavé péči vykazují vyšší psychickou pohodu, lepší školní výsledky a méně poruch chování než děti ve výhradní péči jednoho rodiče, a to i když byla střídavá péče soudně nařízena.',
    courtArgumentation: 'Metaanalýza Dr. Roberta Bausermana (2002) publikovaná v Journal of Family Psychology (APA) na vzorku přes 4 400 dětí dokazuje, že děti ve společné a střídavé péči vykazují lepší psychické přizpůsobení než ve výhradní péči.',
    tags: ['Bauserman', 'metaanalýza', 'střídavá péče', 'psychické zdraví', 'APA']
  },
  {
    id: 'std-fucik-2018',
    title: 'Střídavá péče v České republice (Sociologický výzkum od r. 2018)',
    authors: 'Doc. PhDr. Přemysl Fučík, Ph.D. (FSS Masarykova univerzita)',
    year: 2018,
    publisher: 'Fakulta sociálních studií Masarykovy univerzity v Brně',
    categoryType: 'domestic',
    excerpt: 'Rozsáhlý tuzemský sociologický výzkum střídavé péče v podmínkách českého soudnictví a rodinného života.',
    keyContribution: 'Tuzemská data ukazují, že sdílená péče dětem strukturálně neškodí při minimalizaci konfliktu.',
    conclusion: 'Výzkum potvrzuje, že české děti ve střídavé péči prospívají srovnatelně nebo lépe než ve výhradní péči matky. Klíčem je podpora fungujících rodičovských rituálů a stabilního prostředí.',
    courtArgumentation: 'Tuzemský empirický výzkum doc. Přemysla Fučíka (FSS MU) dokazuje, že střídavá péče v českém prostředí dětem neškodí a přináší jim dlouhodobé socio-emocionální výhody.',
    tags: ['Fučík', 'FSS MU', 'Česká republika', 'sociologický výzkum', 'střídavá péče']
  },
  {
    id: 'std-lom-vupsv',
    title: 'Trendy v otcovství v ČR – Zapojení českých mužů do péče',
    authors: 'Liga otevřených mužů (LOM) & VÚPSV (Výzkumný ústav práce a sociálních věcí)',
    year: 2022,
    publisher: 'VÚPSV / Liga otevřených mužů',
    categoryType: 'domestic',
    excerpt: 'Reprezentativní sociologický výzkum zapojení českých otců do každodenní i noční péče o děti.',
    keyContribution: 'Reprezentativní data o zapojení českých mužů do noční péče a rituálů s dětmi.',
    conclusion: 'Moderní čestí otcové aktivně přebírají pečovatelské kompetence a podílejí se na noční péči, krmení i ukládání. Tvrzení o tradiční neschopnosti otců pečovat o malé děti neodpovídá realitě českých rodin.',
    courtArgumentation: 'Data z reprezentativního výzkumu LOM a VÚPSV ukazují, že česká společnost a otcové jsou plně kompetentní a aktivně zapojeni do noční i denní péče o děti od nejranějšího věku.',
    tags: ['LOM', 'VÚPSV', 'otcovství', 'trendy', 'ČR', 'noční péče']
  },
  {
    id: 'std-mcintosh-2010',
    title: 'Post-separation parenting arrangements and developmental outcomes (Australian Government)',
    authors: 'McIntosh, J. E., Smyth, B., Kelaher, M., Yule, N., & Long, E.',
    year: 2010,
    publisher: 'Australian Government Department of Families, Housing, Community Services',
    categoryType: 'criticism',
    excerpt: 'Australská studie z roku 2010 varující před nocováním dětí u otců, jejíž metodologie na vysoce rizikovém vzorku byla celosvětově vyvrácena.',
    keyContribution: 'Původní studie varující před nocováním, jejíž metodologie na vysoce rizikovém vzorku byla vyvrácena (Warshak 2014, Fabricius & Suh 2017).',
    conclusion: 'Metodicky vadná studie zkoumající nereprezentativní vzorek 14-30 dětí z prostředí domácího násilí a závislostí. Byla celosvětovou vědeckou komunitou (APA Consensus Report) podrobena drtivé kritice a vyvrácena.',
    courtArgumentation: 'Pokud OSPOD nebo matka argumentuje studií McIntosh et al. (2010), upozorňuji soud, že tato studie byla celosvětovou vědeckou komunitou (APA, Warshak 2014) vyvrácena pro hrubé metodické chyby a selection bias.',
    opponentsAnalysis: 'Výběrové zkreslení (selection bias) na patologických rodinách se závislostmi a nevalidované dotazníky bez kontroly sociodemografických proměnných.',
    tags: ['McIntosh', 'kritika studií', 'metodická chyba', 'demontáž', 'nocování']
  },
  {
    id: 'std-nielsen-2018',
    title: 'Social and Academic Development in Joint Physical Custody vs. Sole Custody',
    authors: 'Dr. Linda Nielsen, Wake Forest University',
    year: 2018,
    publisher: 'American Psychological Association (APA)',
    categoryType: 'international',
    excerpt: 'Meta-analýza 60 vědeckých studií prokazuje, že děti ve střídavé péči dosahují lepších výsledků v oblasti psychického zdraví, chování a školních výsledků než děti ve výhradní péči.',
    keyContribution: 'Metaanalýza 60 studií prokazující vyšší úroveň psychické pohody dětí ve střídavé péči.',
    conclusion: 'Děti žijící v uspořádání střídavé péče vykazují méně psychosomatických potíží a zdravější sociální vazby, i při přetrvávajícím rodičovském konfliktu.',
    courtArgumentation: 'Z doložené meta-analýzy Dr. Lindy Nielsen (2018) vyplývá, že střídavá péče je pro vývoj dítěte nejvhodnějším uspořádáním.',
    tags: ['psychologie', 'výzkum', 'Linda Nielsen', 'psychické zdraví']
  }
];

export const HUB_TEMPLATES: HubTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Návrh na svěření nezletilého do střídavé péče rodičů',
    category: 'petitions',
    categorySlug: 'stridava-pece',
    tags: ['stridava-pece', 'pece-o-dite', 'vzory-podani', 'soudni-rizeni'],
    desc: 'Základní vzor žaloby k opatrovnickému soudu o úpravu poměrů pro střídavou péči. Obsahuje doporučenou právní argumentaci a odkaz na nález Ústavního soudu.',
    defaultText: `Okresnímu soudu v [CITY]\n[COURT_ADDRESS]\n\nŽalobce (Otec): [FATHER_NAME], nar. [FATHER_BIRTH], bytem [FATHER_ADDRESS]\nŽalovaná (Matka): [MOTHER_NAME], nar. [MOTHER_BIRTH], bytem [MOTHER_ADDRESS]\n\nNezletilé děti: [CHILDREN_NAMES]\n\nNÁVRH OTCE NA ÚPRAVU PÉČE A SVĚŘENÍ NEZLETILÝCH DO STŘÍDAVÉ PÉČE RODIČŮ\n\nI.\nRodiče nezletilých dětí uzavřeli manželství, které bylo rozvedeno / žili ve společné domácnosti. Z jejich vztahu se narodily nezletilé děti: [CHILDREN_NAMES]. Rodiče se po rozpadu vztahu nedohodli na dalším uspořádání péče o děti.\n\nII.\nOtec má plné rodičovské kompetence, doložitelnou materiální i psychologickou připravenost a zájem o rovnocenný podíl na výchově. Bytové podmínky otce jsou nadstandardní, děti mají k dispozici vlastní zařízené pokoje. Bydliště obou rodičů se nachází v rozumné vzdálenosti, což umožňuje bezproblémové pokračování školní docházky.\n\nIII.\nV souladu s konstantní judikaturou Ústavního soudu ČR je střídavá péče prioritním modelem uspořádání, pokud jsou oba rodiče způsobilí. Svěření dětí pouze do výhradní péče jednoho z rodičů by znamenalo porušení ústavního práva dětí na péči obou rodičů.\n\nProto navrhuji, aby soud po provedeném dokazování vydal tento\n\nR O Z S U D E K :\n\n1. Nezletilé děti [CHILDREN_NAMES] se svěřují do střídavé péče obou rodičů, a to v pravidelném intervalu střídání po 7 dnech, s předáváním každé pondělí v 8:00 hod v prostorách školy/školky.\n2. Výživné se stanovuje s přihlédnutím k poměrům obou rodičů.\n\nV [CITY] dne [DATE]\n\n........................................\n[FATHER_NAME] (Otec)`
  },
  {
    id: 'tpl-2',
    title: 'Vyjádření otce k návrhu matky na výhradní péči',
    category: 'appeals',
    categorySlug: 'soudni-rizeni',
    tags: ['soudni-rizeni', 'falesna-obvineni', 'vzory-podani', 'pravni-rad'],
    desc: 'Nesouhlasné stanovisko s výhradní péčí matky. Navrhuje střídavou péči jako jedinou ústavně konformní alternativu chránící zájem dítěte.',
    defaultText: `Okresnímu soudu v [CITY]\nK sp. zn.: [CASE_NUMBER]\n\nŽalobce (Otec): [FATHER_NAME], bytem [FATHER_ADDRESS]\nŽalovaná (Matka): [MOTHER_NAME], bytem [MOTHER_ADDRESS]\n\nVYJÁDŘENÍ OTCE K NÁVRHU MATKY NA SVĚŘENÍ DĚTÍ DO JEJÍ VÝHRADNÍ PÉČE\n\nK výzvě soudu se tímto vyjadřuji k návrhu matky na svěření dětí do její výhradní péče. S návrhem matky zásadně nesouhlasím.\n\nVztah dětí k otci je velmi silný a vřelý. Otec se o děti aktivně staral od jejich narození a neexistuje žádný objektivní důvod, proč by měl být jeho kontakt s dětmi degradován na pouhý víkendový styk. Návrh matky považuji za účelovou snahu o vytěsnění otce ze života dětí.\n\nNavrhuji proto, aby soud návrh matky zamítl a rozhodl o svěření nezletilých dětí [CHILDREN_NAMES] do střídavé péče obou rodičů.\n\nV [CITY] dne [DATE]\n\n........................................\n[FATHER_NAME] (Otec)`
  },
  {
    id: 'tpl-3',
    title: 'Stížnost na neprofesionální postup kolizního opatrovníka (OSPOD)',
    category: 'complaints',
    categorySlug: 'jednani-ospod',
    tags: ['jednani-ospod', 'ospod', 'vzory-podani'],
    desc: 'Formální stížnost vedoucímu odboru sociálních věcí na podjatost, ignorování důkazů nebo genderově stereotypní přístup sociální pracovnice.',
    defaultText: `Městskému úřadu v [CITY]\nVedoucímu odboru sociálně-právní ochrany dětí\n\nStěžovatel: [FATHER_NAME], bytem [FATHER_ADDRESS]\nSpisová značka dítka: [CASE_NUMBER]\n\nSTÍŽNOST NA NEPROFESIONÁLNÍ A PODJATÝ POSTUP SOCIÁLNÍ PRACOVNICE [OFFICER_NAME]\n\nTímto podávám formální stížnost na postup jmenované sociální pracovnice, která vykonává funkci kolizního opatrovníka pro mé nezletilé děti: [CHILDREN_NAMES].\n\nDůvody stížnosti:\n1. Pracovnice vykazuje zjevnou podjatost vůči mé osobě, ignoruje předložené důkazy o mých rodičovských kompetencích a bezvýhradně přejímá neověřená tvrzení matky.\n2. Při domácím šetření jednala nátlakově a činila na děti sugestivní dotazy s cílem získat negativní vyjádření o otci.\n3. Odmítá zařadit mé vyjádření do spisové dokumentace.\n\nŽádám o prověření postupu jmenované pracovnice, zjednání nápravy a případné přidělení spisu jinému nezávislému pracovníkovi OSPOD.\n\nV [CITY] dne [DATE]\n\n........................................\n[FATHER_NAME]`
  },
  {
    id: 'tpl-4',
    title: 'Návrh na předběžné opatření při svévolném odnětí dítěte ze péče otce',
    category: 'petitions',
    categorySlug: 'krizova-pomoc',
    tags: ['krizova-pomoc', 'nocni-pece', 'falesna-obvineni', 'vzory-podani'],
    desc: 'Rychlý návrh podle § 452 z.ř.s. určený pro krizové situace, kdy druhý rodič bez souhlasu odveze dítě nebo odepře jakýkoliv kontakt.',
    defaultText: `Okresnímu soudu v [CITY]\n\nNavrhovatel (Otec): [FATHER_NAME], nar. [FATHER_BIRTH], bytem [FATHER_ADDRESS]\nApt. Matka: [MOTHER_NAME], nar. [MOTHER_BIRTH], bytem [MOTHER_ADDRESS]\n\nNezletilé dítě: [CHILD_NAME]\n\nNÁVRH NA VYDÁNÍ PŘEDBĚŽNÉHO OPATŘENÍ PODLE § 452 ZÁKONA O ZVLÁŠTNÍCH SOUDNÍCH ŘÍZENÍCH\n\nI.\nDne [DATE] došlo ke svévolnému odvedení nezletilého [CHILD_NAME] matkou ze společného bydliště. Matka od té doby odmítá sdělit místo pobytu dítěte a zcela zamezuje jakémukoliv osobnímu i telefonickému kontaktu s otcem.\n\nII.\nTímto protiprávním jednáním je vážně ohrožen psychický vývoj dítěte a dochází k násilnému přerušení rodičovské vazby k otci.\n\nProto navrhuji, aby soud bezodkladně vydal toto\n\nPŘEDBĚŽNÉ OPATŘENÍ:\n\nMatce se ukládá povinnost předávat nezletilého [CHILD_NAME] otci ke styku každou středu od 14:00 do 18:00 hod a každý sudý víkend od pátku 16:00 hod do neděle 18:00 hod.\n\nV [CITY] dne [DATE]\n\n........................................\n[FATHER_NAME]`
  },
  {
    id: 'tpl-5',
    title: 'Podnět Veřejnému ochránci práv (Ombudsmanovi) na postup OSPOD',
    category: 'complaints',
    categorySlug: 'jednani-ospod',
    tags: ['jednani-ospod', 'ospod', 'vzory-podani'],
    desc: 'Oficiální podnět Kanceláři Veřejného ochránce práv k prověření systémových pochybení a diskriminace otce ze strany Orgánu sociálně-právní ochrany dětí.',
    defaultText: `Kancelář Veřejného ochránce práv\nÚdolní 39, 602 00 Brno\n\nPodatel (Otec): [FATHER_NAME], bytem [FATHER_ADDRESS]\nDotčený OSPOD: [OSPOD_NAME], Městský úřad [CITY]\nSpisová značka OSPOD: [CASE_NUMBER]\n\nPODNĚT K PROVĚŘENÍ NEZÁKONNÉHO A NEPROFESIONÁLNÍHO POSTUPU OSPOD\n\nVážený pane / vážená paní ombudsmanko,\n\nobracím se na Vás s podnětem k prověření postupu OSPOD [CITY] v opatrovnické věci mého nezletilého syna/dcery [CHILD_NAME].\n\nOSPOD dlouhodobě ignoruje mé stížnosti na maření styku ze strany matky, nepředkládá soudu objektivní zprávy a uplatňuje vůči mé osobě rodové stereotypy. Ačkoliv plním veškeré povinnosti, OSPOD navrhuje omezení mých rodičovských práv bez jakéhokoliv odborného podkladu.\n\nŽádám o nezávislé šetření postupu orgánu sociálně-právní ochrany dětí.\n\nV [CITY] dne [DATE]\n\n........................................\n[FATHER_NAME]`
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
    relatedStudies: ['std-2', 'std-3'],
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
    relatedJudgments: ['jud-3', 'jud-4'],
    relatedStudies: [],
    relatedTemplates: ['tpl-3'],
    viewCount: 1450,
    wordCount: 140
  },
  {
    id: 'art-4',
    title: 'Stanovení výživného při střídavé péči podle tabulek MSp',
    category: 'vyzivne',
    tags: ['výživné', 'střídavá péče', 'kalkulačka', 'Ministerstvo spravedlnosti'],
    excerpt: 'Kompletní přehled pravidel pro výpočet výživného při střídavé péči podle doporučujících tabulek Ministerstva spravedlnosti ČR.',
    content: `Při střídavé péči 50/50 neplatí mýtus, že se výživné automaticky nestanovuje. Soud zkoumá příjmy obou rodičů. Pokud má jeden z rodičů výrazně vyšší příjmy, soud může stanovit výživné tak, aby byla zajištěna srovnatelná životní úroveň dítěte v obou domácnostech.

Doporučující tabulky Ministerstva spravedlnosti stanovují procentuální rozmezí z čistého příjmu podle věku dítěte (od 14 % u předškoláků do 20 % u dospívajících) a zohledňují míru péče vyjádřenou počtem dní v měsíci.

Při podávání návrhu doložte své reálné náklady na bydlení, kroužky, ošacení a volnočasové aktivity dítěte.`,
    lastUpdated: '2026-07-10',
    relatedJudgments: ['jud-1'],
    relatedStudies: ['std-1', 'std-4'],
    relatedTemplates: ['tpl-1'],
    viewCount: 1820,
    wordCount: 165
  },
  {
    id: 'art-5',
    title: 'Výkon rozhodnutí a pokuty při maření styku',
    category: 'soudni-rizeni',
    tags: ['maření styku', 'exekuce péče', 'pokuta', 'předběžné opatření'],
    excerpt: 'Jak postupovat, pokud druhý rodič odmítá předávat dítě podle rozsudku nebo schválené dohody. Přehled právních kroků.',
    content: `Maření styku s dítětem je hrubým porušením rozsudku soudu a práv nezletilého. Pokud matka či otec opakovaně nekomunikuje a nepředává dítě:

1. Vyžadujte písemné potvrzení nebo záznam o neuskutečněném předání (SMS, e-mail, svědectví OSPOD).
2. Podejte u opatrovnického soudu návrh na výkon rozhodnutí uložením pokuty až do výše 50 000 Kč (opakovaně).
3. Požadujte nařízení náhradního styku za zmařené termíny.
4. V případě dlouhodobého maření navrhněte změnu výchovného prostředí (předání dítěte do vaší péče).`,
    lastUpdated: '2026-07-15',
    relatedJudgments: ['jud-4', 'jud-5'],
    relatedStudies: ['std-1'],
    relatedTemplates: ['tpl-4'],
    viewCount: 2100,
    wordCount: 170
  },
  {
    id: 'art-majetek-sjm',
    title: 'Společné jmění manželů, vyrovnání majetku a osobná rozpočet po rozchodu',
    category: 'vyzivne-majetek',
    tags: ['SJM', 'majetek', 'vypořádání', 'dluhy', 'výživné na manžela', 'krizový rozpočet', 'občanský zákoník'],
    excerpt: 'Detailní rozbor vypořádání SJM (§ 736–742 OZ), pravidel pro hypotéky, společné závazky, výživné na rozvedeného manžela (§ 760 OZ) a sestavení udržitelného krizového rozpočtu.',
    content: `Právní úprava Společného jmění manželů (SJM) a jeho vypořádání představuje klíčový krok při rozvodu. Neujasněné majetkové poměry často zpětně komplikují dohody o dětech a vytvářejí sekundární napětí.

### 1. Základní principy vypořádání SJM (§ 736–742 OZ)
Podle občanského zákoníku se při vypořádání SJM vychází z principu rovnosti podílů obou manželů (50/50), pokud smlouvou o zúžení nebo předmanželskou smlouvou nebylo stanoveno jinak.
- **Tříletá prekluzivní lhůta:** Pokud nedojde ke sjednání dohody o vypořádání nebo k podání žaloby k soudu do 3 let od právní moci rozsudku o rozvodu, nastupuje zákonná domněnka (§ 741 OZ):
  - Hmotné movité věci užívané výhradně jedním z manželů připadají tomuto manželovi.
  - Ostatní movité i nemovité věci a závazky přecházejí do podílového spoluvlastnictví obou manželů s rovnými podíly.

### 2. Hypotéky, závazky a ochrana před dluhy
- **Společné dluhy:** Dluhy vzniklé za trvání manželství zavazují oba manžele společně a nerozdílně. Převzetí hypotéky jedním z manželů vyžaduje výslovný souhlas financující banky (vyvázání druhého manžela).
- **Závazky vzniklé bez souhlasu:** Pokud druhý manžel převzal dluh bez vědomí a souhlasu prvního a tento dluh přesahuje běžné potřeby rodiny, lze uplatnit námitku vůči věřiteli dle § 710 OZ.

### 3. Výživné na rozvedeného manžela (§ 760 OZ)
- Rozvedený manžel, který není schopen se sám živit a tato neschopnost má původ v manželství, může požadovat přiměřené výživné od druhého manžela.
- **Test dobrých mravů:** Soud nepřizná výživné rozvedenému manželovi, pokud by to bylo v rozporu s dobrými mravy (např. při psychickém či fyzickém týrání nebo bezdůvodném odmítání pracovat).
- **Sankční výživné (§ 762 OZ):** Může být přiznáno až na 3 roky manželovi, který rozvod nezpůsobil a byla mu způsobena závažná újma.

### 4. Sestavení osobního krizového rozpočtu
Při zařizování druhé domácnosti doporučujeme:
1. Oddělit bankovní účty a zrušit dispoziční práva.
2. Započítat fixní náklady na nájem, energie, výživné na děti a splátky půjček.
3. Vytvořit krizovou finanční rezervu odpovídající 3–6 měsíčním fixním výdajům.

*Upozornění: Tento text má výhradně informativní charakter a nepředstavuje oficiální právní ani finanční poradenství. Pro konkrétní případ doporučujeme konzultaci s advokátem.*`,
    lastUpdated: '2026-08-01',
    relatedJudgments: ['jud-1', 'jud-3'],
    relatedStudies: ['std-lom-vupsv'],
    relatedTemplates: ['tpl-1'],
    viewCount: 1950,
    wordCount: 420
  },
  {
    id: 'art-psychologie-stres',
    title: 'Zvládání psychického stresu a emočně věcné jednání v prvních týdnech rozchodu',
    category: 'psychologie-attachment',
    tags: ['stres', 'duševní zdraví', 'seberegulace', 'pravidlo 24 hodin', 'soudní řízení', 'psychologie'],
    excerpt: 'Praktické strategie pro ochranu duševního zdraví otce, zvládnutí akutního šoku z rozpadu rodiny a zachování klidného, věcného vystupování před OSPOD a soudem.',
    content: `Rozpad rodiny a hrozba ztráty každodenního kontaktu s dětmi patří k nejzávažnějším životním stresorům. Schopnost otce zachovat si chladnou hlavu a stabilní emoce je však klíčová nejen pro jeho vlastní zdraví, ale přímo podmiňuje jeho úspěch v opatrovnickém řízení.

### 1. Akutní fáze rozchodu a zpracování emociálního šoku
- **Fyziologické reakce:** Úzkost, nespavost, hněv a pocit bezmoci jsou přirozenou reakcí. Pamatujte, že emoce jsou špatný rádce při tvorbě právních dokumentů.
- **Prevence impulzivního jednání:** Využívejte "Pravidlo 24 hodin". Na konfrontační SMS, e-maily či slovní provokace neodpovídejte v afektu. Dopřejte si čas na zklidnění.

### 2. Vystupování před OSPOD a opatrovnickým soudem
- **Dojem stabilního rodiče:** Soudci a pracovníci OSPOD posuzují, zda je otec emočně zralý a schopen poskytnout dítěti klidné prostředí. Jakékoliv výbuchy hněvu či vulgární výpady (i na sociálních sítích) budou použity jako důkaz emocionální nestability.
- **Fokus na potřeby dítěte:** Při jednání nehovořte o svých pocitech vůči bývalé partnerce, ale výhradně o potřebách, zájmech a denním režimu vašich dětí.

### 3. Vyhledání odborné psychologické podpory
- Návštěva psychologa, terapeuta či krizového centra pro otce není projev slabosti, ale naopak důkaz zodpovědného přístupu ke zdraví.
- Vyžádejte si zprávu z terapie – doložení aktivní péče o své duševní zdraví působí u soudu velmi pozitivně.`,
    lastUpdated: '2026-08-01',
    relatedJudgments: ['jud-2', 'jud-3'],
    relatedStudies: ['std-fucik-2018', 'std-lom-vupsv'],
    relatedTemplates: ['tpl-3'],
    viewCount: 1620,
    wordCount: 330
  },
  {
    id: 'art-rozhovor-dite',
    title: 'Jak šetrně komunikovat rozchod s dítětem podle jeho věku',
    category: 'psychologie-attachment',
    tags: ['komunikace s dítětem', 'attachment', 'předškolní', 'školní', 'dospívající', 'vývojová psychologie'],
    excerpt: 'Odborná doporučení podložená výzkumy citové vazby (attachmentu). Přesné formulace a zásady pro šetrné oznámení rozchodu dospělých bez poškození psychiky dítěte.',
    content: `Způsob, jakým rodiče oznámí dětem svůj rozchod, zásadním způsobem ovlivňuje jejich pocit bezpečí a budoucí psychický vývoj. Vědecké výzkumy (Warshak 2014, Fabricius & Suh 2017) prokazují, že děti nepotřebují znát detaily partnerských sporů, ale potřebují absolutní jistotu, že neztrácejí ani jednoho z rodičů.

### 1. Základní univerzální pravidla rozhovoru
- **Oznámení bez obviňování:** Nikdy neoznačujte druhého rodiče za viníka rozchodu. Dítě vnímá sebe jako součást obou rodičů; kritika jednoho rodiče zraňuje identitu dítěte.
- **Ujištění o bezpodmínečné lásce:** Opakovaně zdůrazňujte: *"Dospělí se někdy přestanou mít rádi jako partneři, ale rodiči zůstávají navždy. Ty za nic nemůžeš."*
- **Aktivní naslouchání:** Dejte dítěti prostor vyjádřit smutek, vztek i obavy bez toho, abyste jeho pocity zlehčovali.

### 2. Specifika komunikace podle věkových skupin

#### Předškolní věk (3–6 let)
- Děti v tomto věku mají sklon ke kognitivnímu egocentrismu a mohou si myslet, že rozchod zavinily neposlušností.
- **Vhodné věty:** *"Budeš mít dva domovy a v obou svou postýlku a hračky. Máma i táta tě moc milují a budou tu pro tebe každý den."*
- **Čemu se vyhnout:** Abstraktním pojmům o rozvodu a dohadování o rozvrhu dětí před dítětem.

#### Školní věk (7–11 let)
- Děti již rozumí konceptu rozchodu, ale často pociťují strach ze ztráty zázemí a změny školy.
- **Vhodné věty:** *"O věcech ohledně školy a kroužků se s mámou domlouváme tak, aby to pro tebe bylo nejlepší. Ty se soustřeď na své kamarády a školu."*
- **Čemu se vyhnout:** Používání dítěte jako "posla zpráv" mezi rodiči nebo řešení výživného v jeho přítomnosti.

#### Dospívající (12–16 let)
- Dospívající mohou reagovat cynismem, stažením se do sebe nebo snahou manipulovat s rodiči.
- **Vhodné věty:** *"Respektujeme tvůj věk i tvé zájmy. Můj domov je ti plně otevřený a vždy v něm najdeš bezpečné zázemí."*
- **Čemu se vyhnout:** Tlaku na to, aby si adolescent "vybral" jednoho z rodičů.`,
    lastUpdated: '2026-08-01',
    relatedJudgments: ['jud-2', 'jud-6'],
    relatedStudies: ['std-fabricius-2017', 'std-warshak-2014', 'std-bauserman-2002'],
    relatedTemplates: ['tpl-1'],
    viewCount: 2210,
    wordCount: 450
  },
  {
    id: 'art-ochrana-manipulace',
    title: 'Ochrana dítěte před rodičovskou manipulací a konfliktem loajality',
    category: 'rodicovska-alienace',
    tags: ['PAS', 'rodičovská alienace', 'konflikt loajality', 'manipulace', 'judikatura ÚS', 'výzkum'],
    excerpt: 'Jak rozpoznat symptomy rodinné alienace (popouzení), jak bránit dítě před loajalitním konfliktem a jaké právní i psychologické kroky podniknout na základě judikatury ÚS a NS ČR.',
    content: `Rodičovská alienace (zavrhování rodiče / PAS) představuje patologický proces, při kterém jeden z rodičů vědomě či podvědomě manipuluje dítě proti druhému rodiči. Dítě je vystaveno takzvanému konfliktu loajality – pocitu, že láska k otci znamená zradu matky.

### 1. Varovné signály rodičovské manipulace
- Dítě používá nepřirozený, "dospělý" jazyk plný frází, které neodpovídají jeho věku (např. *"Otec neplatí a zničil nám život"*).
- Dítě zničehonic odmítá kontakt s otcem bez jakéhokoliv objektivního negativního zážitku.
- Manipulující rodič vytváří překážky při předávání, zkracuje styk nebo dítě v průběhu pobytu u otce neustále telefonicky kontorluje.

### 2. Právní obrana na základě judikatury Ústavního soudu
- **Povinnost státu zasáhnout (Nález IV. ÚS 1921/17):** Ústavní soud výslovně potvrdil, že soudy a OSPOD mají povinnost aktivně bránit maření péče a odcizování dítěte.
- **Hodnocení výchovné způsobilosti (Nález III. ÚS 149/20):** Rodič, který brání dítěti ve vztahu k druhému rodiči a popouzí jej, vykazuje sníženou výchovnou způsobilost.

### 3. Správná reakce otce v praxi
1. **Zůstaňte klidní a milující:** Nikdy nevracejte útoky a nekritizujte matku. Buďte pro dítě ostrůvkem jistoty.
2. **Vedťe si objektivní deník:** Zapisujte si přesná data předání, reakce dítěte a případná maření bez emotivních komentářů.
3. **Navrhněte odbornou terapii:** Požádejte soud o uložení povinnosti odborné rodinné terapie nebo krizové intervence pro dítě a rodiče.`,
    lastUpdated: '2026-08-01',
    relatedJudgments: ['jud-3', 'jud-4', 'jud-5'],
    relatedStudies: ['std-warshak-2014', 'std-bauserman-2002', 'std-nielsen-2018'],
    relatedTemplates: ['tpl-2', 'tpl-4'],
    viewCount: 2840,
    wordCount: 410
  },
  {
    id: 'art-pruvodce-mediaci',
    title: 'Průvodce rodinnou mediací: Jak funguje mimosoudní dohoda o dětech a majetku',
    category: 'komunikace-rodice',
    tags: ['mediace', 'zapsaný mediátor', 'rodičovská dohoda', '§ 100 o.s.ř.', 'mimosoudní řešení'],
    excerpt: 'Průvodce procesem rodinné mediace podle zákona o mediaci. Jak probíhá první soudem nařízené setkání (§ 100 odst. 3 o.s.ř.), kdy má mediace smysl a jak dosáhnout vykonatelné dohody.',
    content: `Rodinná mediace je neformální, dobrovolný proces, ve kterém nezávislý a nestranný odborník (zapsaný mediátor) pomáhá rodičům nalézt oboustranně přijatelné řešení opatrovnických a majetkových otázek.

### 1. Soudem nařízené první setkání s mediátorem (§ 100 odst. 3 o.s.ř.)
Opatrovnický soud může rodičům nařídit první setkání se zapsaným mediátorem v rozsahu 3 hodin. 
- Účelem tohoto setkání není vynutit dohodu, ale seznámit rodiče s možnostmi mimosoudního vyjednávání a snížit hladinu konfliktu.
- Po absolvování setkání vydá mediátor potvrzení pro soud.

### 2. Kdy má mediace smysl a kdy je nevhodná
- **Vhodné případy:** Obvyklé komunikační bloky po rozchodu, nejasnosti v organizaci střídání, nastavení výživného nebo pravidla pro kroužky.
- **Nevhodné případy:** Přítomnost domácího násilí, závislost jednoho z partnerů, závažná psychická porucha nebo aktivní maření styku spojené se skrýváním dítěte.

### 3. Výstup z mediace – Schválená rodičovská dohoda
Výsledkem úspěšné mediace je písemná Rodičovská dohoda. Aby získala právní váhu rozsudku (vykonatelnost), předkládá se opatrovnickému soudu ke schválení. Soud dohodu schválí, pokud je v souladu s nejlepším zájmem nezletilého dítěte.`,
    lastUpdated: '2026-08-01',
    relatedJudgments: ['jud-1', 'jud-3'],
    relatedStudies: ['std-fucik-2018'],
    relatedTemplates: ['tpl-1'],
    viewCount: 1420,
    wordCount: 320
  },
  {
    id: 'art-biff-komunikace',
    title: 'Konstruktivní komunikace s druhým rodičem: Pravidla BIFF v praxi',
    category: 'komunikace-rodice',
    tags: ['BIFF', 'deeskalace', 'SMS', 'WhatsApp', 'e-mail', 'soudní důkazy', 'srovnání'],
    excerpt: 'Praktické vedení písemné komunikace podle celosvětově uznávané metodiky BIFF (Brief, Informative, Friendly, Firm). Ukázky správných a špatných zpráv pro soudní dokazování.',
    content: `Každá SMS zpráva, e-mail nebo komunikace přes WhatsApp, kterou odešlete druhému rodiči, se v opatrovnickém řízení může stát soudním důkazem. Použití metodiky BIFF (Bill Eddy, High Conflict Institute) zaručuje, že vaše zprávy budou věcné, deeskalující a u soudu neprůstřelné.

### 1. Čtyři pilíře metody BIFF
1. **B – Brief (Stručná):** Pište krátce. Max. 2 až 4 věty. Čím delší text, tím více prostoru pro konflikt.
2. **I – Informative (Faktická):** Uvádějte pouze fakta (časy, místa, platby). Žádné hodnocení, výčitky ani osobní názory.
3. **F – Friendly (Mírná):** Zachovejte slušný pozdrav a neutrální, zdvořilý tón (*"Dobrý den"*, *"Děkuji"*).
4. **F – Firm (Pevná):** Jasně formulujte požadavek a stanovte rozumný termín pro odpověď.

### 2. Názorné porovnání komunikačních ukázek

#### Přiklad 1: Organizace kroužku pro syna
- ✖ **Špatná komunikace (emoční, útočná):**
  *"Proč jsi mi zase neodpověděla na zprávu ohledně fotbalu? Vždycky všechno komplikuješ a doplácím na tvůj chaotický přístup! Pokud mi do večera nenapíšeš, nahlásím te na OSPOD!"*
- ✔ **Správná BIFF komunikace:**
  *"Dobrý den, prosím o potvrzení, zda syn bude navštěvovat fotbalový kroužek i v tomto pololetí. Potřebuji informaci do středy 18:00 pro úhradu příspěvku. Děkuji, [Jméno]."*

#### Přiklad 2: Změna termínu předání
- ✖ **Špatná komunikace (defenzivní, hádavá):**
  *"Uvědomuješ si vůbec, že mi ničíš plány? Nemůžu za to, že je zácpa na dálnici! Ty taky věčně chodíš pozdě a já ti nic nevyčítám!"*
- ✔ **Správná BIFF komunikace:**
  *"Dobrý den, z důvodu kolony na dálnici se předání dětí posune o 20 minut. Přijedu v 17:20 hod. Děkuji za pochopení, [Jméno]."*`,
    lastUpdated: '2026-08-01',
    relatedJudgments: ['jud-3', 'jud-7'],
    relatedStudies: ['std-fucik-2018'],
    relatedTemplates: ['tpl-2'],
    viewCount: 3100,
    wordCount: 380
  },
  {
    id: 'art-bydleni-ospod',
    title: 'Stabilizace nového bydlení pro děti a příprava na šetření OSPOD',
    category: 'jednani-ospod',
    tags: ['bydlení', 'dětský pokoj', 'OSPOD', 'místní šetření', 'střídavá péče', 'zázemí'],
    excerpt: 'Co přesně zjišťuje sociální pracovnice OSPOD při místním šetření v bytě otce. Podrobný checklist vybavení a přípravy domova pro potřeby střídavé péče.',
    content: `Při posuzování návrhu na střídavou nebo společnou péči provádí OSPOD místní šetření v bydlišti obou rodičů. Cílem OSPOD není hodnocení materiálního luxusu, ale ověření, zda je prostředí pro dítě **bezpečné, hygienické, stabilní a poskytuje mu vlastní osobní prostor**.

### 1. Klíčové požadavky na zázemí dítěte
- **Lůžko a spánek:** Dítě musí mít vlastní kvalitní postel s čistým povlečením. Rozkládací pohovka v obývacím pokoji je akceptovatelná pouze jako dočasné řešení.
- **Studijní a hrací kout:** Stůl s osvětlením pro přípravu do školy a věkově odpovídající hračky, knížky a školní potřeby.
- **Úložné prostory:** Skříň či poličky vyhrazené výhradně pro oblečení a osobní věci dítěte.
- **Hygiena a bezpečnost:** Čisté sociální zařízení, zabezpečené elektrické zásuvky a absence nebezpečných předmětů v dosahu malých dětí.

### 2. Průběh návštěvy OSPOD a protokol
- Pracovnice si prohlédne byt, vyfotografuje dětský pokoj a provede krátký pohovor s otcem.
- Z návštěvy se vyhotovuje Zpráva z místního šetření. Otec má právo do ní nahlédnout a požadovat doplnění svých připomínek.`,
    lastUpdated: '2026-08-01',
    relatedJudgments: ['jud-1', 'jud-7'],
    relatedStudies: ['std-lom-vupsv', 'std-fucik-2018'],
    relatedTemplates: ['tpl-3'],
    viewCount: 1890,
    wordCount: 310
  },
  {
    id: 'art-statni-podpora',
    title: 'Finanční stabilita po rozchodu: Dávky, příspěvek na bydlení a pomoc MPSV',
    category: 'vyzivne-majetek',
    tags: ['MPSV', 'dávky', 'příspěvek na bydlení', 'MOP', 'státní podpora', 'krizová pomoc'],
    excerpt: 'Přehled státní sociální pomoci od Ministerstva práce a sociálních věcí (MPSV) pro rodiče v přechodné finanční tísni po rozchodu či rozvodu.',
    content: `Rozdělení jedné domácnosti na dvě samostatná obydlí přináší skokový nárůst životních nákladů. Ministerstvo práce a sociálních věcí (MPSV) poskytuje systém dávek státní sociální podpory a hmotné nouze, které pomáhají překlenout nejkritičtější období.

### 1. Příspěvek na bydlení (Státní sociální podpora)
- **Podmínky nároku:** Nárok vzniká, pokud 30 % (v Praze 30 %) rozhodného příjmu rodiny/domácnosti nestačí k pokrytí normativních nákladů na bydlení.
- O příspěvek může požádat nájemce i vlastník bytu na základě doložených nákladů za předchozí kalendářní čtvrtletí.

### 2. Mimořádná okamžitá pomoc (MOP)
- Dávka hmotné nouze určená pro akutní krizové situace (např. náhlá ztráta bydlení, úhrada kauce na nájemní byt, výdaje spojené se začátkem školního roku dětí).

### 3. Přídavek na dítě
- Testovaná dávka pro rodiny s příjmem do 3,4násobku životního minima. Vyplácí se měsíčně podle věku nezaopatřeného dítěte.

*Proces vyřízení: Žádosti se podávají online přes klientský portál MPSV (JENDA) nebo osobně na kontaktních pracovištích Úřadu práce ČR.*`,
    lastUpdated: '2026-08-01',
    relatedJudgments: ['jud-1'],
    relatedStudies: ['std-lom-vupsv'],
    relatedTemplates: ['tpl-1'],
    viewCount: 1560,
    wordCount: 290
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
  },
  {
    id: 'term-4',
    term: 'Paralelní rodičovství (Parallel Parenting)',
    definition: 'Model péče určený pro rodiče v trvalém vysokém konfliktu. Oba rodiče se nezávisle starají o dítě v době svého intervalu bez nutnosti přímého osobního kontaktu či přátelské dohody, čímž je dítě chráněno před sporem.',
    tags: ['paralelní rodičovství', 'konflikt', 'co-parenting'],
    relatedArticles: ['art-2']
  },
  {
    id: 'term-5',
    term: 'Výkon rozhodnutí (§ 501 z.ř.s.)',
    definition: 'Právní proces vymáhání splnění povinností stanovených v rozsudku (např. předání dítěte ke styku nebo střídavé péči), a to prostřednictvím výzev, uložených pokut nebo v krajním případě odnětím dítěte.',
    tags: ['výkon rozhodnutí', 'exekuce', 'pokuta'],
    relatedArticles: ['art-5']
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
  },
  {
    id: 'faq-3',
    question: 'Co dělat, když matka opakovaně bez omluvy nepředá dítě ke styku?',
    answer: 'Každé zmařené předání si okamžitě zdokumentujte (SMS zprávy, výpis hovorů, případně vyjádření svědka/OSPOD). Podejte soudu návrh na výkon rozhodnutí s uložením pokuty a požádejte o určení náhradního termínu styku.',
    tags: ['maření styku', 'pokuta', 'náhradní styk']
  },
  {
    id: 'faq-4',
    question: 'Jak postupovat, pokud je sociální pracovnice OSPOD podjatá?',
    answer: 'Podejte písemnou námitku podjatosti a stížnost vedoucímu odboru sociálních věcí příslušného městského úřadu. Všech jednání se zúčastňujte s jasnou přípravou a požadujte zapsání svých stanovisek do spisu.',
    tags: ['OSPOD', 'podjatost', 'stížnost']
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

  const categories = HUB_CATEGORIES.filter(
    c => c.name.toLowerCase().includes(lowercaseQuery) ||
         c.description.toLowerCase().includes(lowercaseQuery) ||
         c.slug.toLowerCase().includes(lowercaseQuery)
  );

  return {
    articles,
    judgments,
    studies,
    templates,
    terms,
    faqs,
    categories
  };
}
