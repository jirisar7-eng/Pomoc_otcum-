/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Article, 
  DocumentTemplate, 
  AdviceItem, 
  ForumCategory, 
  ForumPost, 
  SupportContact, 
  ExperienceStory,
  Comment,
  Donation,
  Partner
} from './types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-esbirka-api-integration',
    title: 'Síla přímého propojení: Proč platforma Táta má právo integruje státní API e-Sbírky',
    summary: 'V opatrovnických sporech rozhodují detaily. Zjistěte, jak přímá integrace oficiálního REST API e-Sbírky MV ČR a automatická validace formulářů chrání tátu před zastaralými paragrafy a chybným podáním u soudu.',
    content: `V opatrovnických sporech a rodinném právu rozhodují detaily, přesné lhůty a bezchybná citace platných zákonů. Každá procesní chyba nebo zastaralý paragraf v návrzích na soud může otce stát cenný čas a oddálit shledání s dětmi.

Proto projekt Táta má právo (Synthesis OS) přichází s klíčovou technologickou novinkou – přímým napojením na oficiální státní REST API e-Sbírky a e-Legislativy od Ministerstva vnitra ČR.

Co toto propojení znamená, jak funguje pod kapotou a v čem konkrétně pomůže táta v praxi?

1. Co znamená napojení na státní API?
Tradiční webové stránky a právní blogy fungují tak, že autor jednou napíše článek nebo vzor smlouvy, a ten tam visí třeba roky – i když se zákon mezitím dvakrát zmodernizoval nebo zněl jinak.
Napojení na e-Sbírku REST API znamená, že aplikace Táta má právo komunikuje se státem v reálném čase:
• Okamžitá aktualizace: Jakmile úřady vydají novelu zákona nebo změnu v občanském zákoníku, systém ji bezpečně zaregistruje.
• Autentická data: Všechny texty, paragrafy a odkazy pocházejí přímo z primárního zdroje státní správy, nikoliv z druhotných, potenciálně chybových výtahů.
• Bezpečná autorizace: Komunikace probíhá přes šifrovaná rozhraní chráněná specifickým přístupovým klíčem (ESEL_API_ACCESS_KEY), což zaručuje maximální bezpečnost a soulad s technickými standardy státu.

2. Jak to pomůže otcům v praxi?
Hlavním cílem portálu je dát otcům do rukou silné, srozumitelné a hlavně bezchybné nástroje pro obhajobu jejich práv u soudu a OSPODu. Přímá integrace přináší tyto výhody:
• 100% jistota platných paragrafů: Když si otcové v aplikaci prohlížejí judikaturu nebo generují podání, mají jistotu, že odkazují na aktuálně platné znění zákona. Odpadá riziko, že použijí zrušený paragraf.
• Automatická validace formulářů: Každý formulář či návrh podání prochází kontrolou náležitostí přímo proti státnímu registru. Systém včas upozorní na chybějící či nesprávné náležitosti, dřív než dokument odejde k soudu.
• Úspora času a nervů: Místo zdlouhavého ručního proklikávání úředních stránek a hledání v rozsáhlých sbírkách zákonů mají uživatelé vše pohromadě, přehledně seřazené a okamžitě k dispozici.

3. Chytrá technologie pod kapotou: Jak šetříme systém i peníze
Stahovat celou e-Sbírku se všemi historickými novelami najednou by zatěžovalo server i státní infrastrukturu. Proto je systém postaven chytře a efektivně:
• On-demand caching (Načtení na vyžádání): Když uživatel otevře konkrétní paragraf, systém ho jednorázově stáhne z e-Sbírky, uloží do zabezpečené lokální vyrovnávací paměti (cache) a dalším uživatelům ho servíruje okamžitě bez čekání.
• Předpřipravený výběr pro rodinné právo: Klíčové paragrafy týkající se péče o děti, výživného a kontaktů má systém předpřipravené, takže fungují bleskově a bez prodlev.
• Dvojitá kontrola (AI + Státní dáta): Vygenerované dokumenty kromě státních registrů hlídá také sekundární kontrolní AI auditor, který ověřuje logiku textu a chrání uživatele před emocionálními formulacemi, jež by u soudu mohly uškodit.

Závěr
Projekt Táta má právo ukazuje, že moderní technologie a umělá inteligence mohou sloužit dobré věci – pomáhat rodičům orientovat se ve složitém právním prostředí. Dzięki přímému propojení se státními registry se stává spolehlivým digitálním partnerem pro každého tátu, který bojuje za právo být součástí života svého dítěte.`,
    category: 'Aktuality',
    date: '2026-08-01',
    author: 'Redakce & Vývojový tým Táta má právo',
    likes: 142,
    commentsCount: 19,
    readTime: '4 min',
    tags: ['e-Sbírka', 'REST API', 'Digitalizace', 'Technologie', 'Validace', 'MV ČR'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'art-forpsi-milestone',
    title: 'FORPSI se stává sponzorem doménové infrastruktury projektu „Táta má právo“',
    summary: 'S radostí oznamujeme nového oficiálního sponzora infrastruktury. Společnost FORPSI (Internet CZ, a.s.) věnovala a zaregistrovala doménu tatovacesta.cz pro náš projekt.',
    content: `Každý významný projekt potřebuje pevnou základnu na internetu. S radostí oznamujeme, že společnost FORPSI (Internet CZ, a.s.) se stala oficiálním sponzorem doménové infrastruktury projektu Táta má právo a věnovala bezplatnou registrovaci domény tatovacesta.cz.

FORPSI: Stabilní pilíř českého internetu a spolehlivý partner pro vaše projekty
Ať už s budováním webových stránek teprve začínáte, nebo jste zkušený vývojář spravující desítky projektů, jméno FORPSI (Internet CZ, a.s.) pravděpodobně dobře znáte. Patří totiž k nejvýznamnějším a nejstabilnějším poskytovatelům domainhostingových a serverových služeb na českém trhu.

Od registrace domény až po cloudová řešení
Společnost FORPSI se dlouhodobě etabluje jako univerzální partner pro online projekty všeho druhu. Její portfolio pokrývá ty nejdůležitější oblasti:
• Registrace domén: Nabízí správu statisíců domén – od klasických národních přípon jako .cz přes gTLD až po novodobé doménové koncovky.
• Webhosting a serverové služby: Od cenově dostupné hostovací varianty pro menší prezentační weby až po výkonné virtuální servery (VPS) a dedikované stroje pro náročné aplikace.
• Bezpečnost a infrastruktura: Poskytuje spolehlivé SSL certifikáty, vlastní datacentra s vysokým stupněm zabezpečení a nepřetržitou technickou podporu.

Podpora komunity a smysluplných projektů
Kromě komerčních služeb je FORPSI známé také svou podporou zajímavých iniciativ, neziskových projektů a začínajících tvůrců. Formou sponzoringu registrací domén či technologického zázemí pomáhá autorům přivádět k životu projekty s veřejně prospěšným či komunitním přesahem, což usnadňuje start mnoha novým myšlenkám a platformám.

Proč se na FORPSI spolehnout?
Díky dlouholeté tradici, robustní technické infrastruktuře a vstřícnému přístupu zákaznické podpory představuje FORPSI bezpečný přístav pro každého, kdo chce mít jistotu, že jeho doména a digitální zázemí poběží stabilně a bez výpadků.

Děkujeme společnosti FORPSI (Internet CZ, a.s.) za důvěru a podporu projektu!`,
    category: 'Aktuality',
    date: '2026-07-28',
    author: 'Redakce Táta má právo',
    likes: 74,
    commentsCount: 8,
    readTime: '3 min',
    tags: ['FORPSI', 'Sponzor', 'Doména', 'Partnerství', 'Novinky'],
    imageUrl: 'https://forpsi.com/Forpsi/media/Forpsi/General/logo.svg'
  },
  {
    id: 'art-vedos-milestone',
    title: 'Oslava prvního milníku: VEDOS se stává technologickým partnerem projektu „Táta má právo“',
    summary: 'S obrovskou radostí oznamujeme, že projekt Táta má právo získal svého prvního oficiálního sponzora a technologického partnera – společnost VEDOS Internet, a.s., která nám věnovala webhosting NoLimit.',
    content: `Každý velký příběh potřebuje silný začátek a lidi, kteří věří v jeho smysl. S obrovskou radostí a hrdostí dnes můžeme oznámit, že projekt Táta má právo získal svého první oficiálního sponzora a technologického partnera – stala se jím společnost VEDOS Internet, a.s.

Kdo je náš nový partner?
Společnost VEDOS patří mezi největší, nejstabilnější a nejrychleji rostoucí poskytovatele webhostingových služeb a datacentrových řešení v České republice. Jsou známí svou špičkovou technickou infrastrukturou, maximálním důrazem na bezpečnost, bleskovou rychlostí a ekologicky udržitelným provozem svých datových center. Jejich služby využívají desítky tisíc projektů, firem i jednotlivců.

Jak nám pomohli do začátku?
Rozjet moderní portál postavený na pokročilých technologiích, jako je React, vyžaduje spolehlivé, rychlé a bezpečné zázemí. A právě v tomto klíčovém momentu podala společnost VEDOS pomocnou ruku.
V rámci podpory smysluplných projektů nám poskytla oblíbený webhosting NoLimit na celý rok zdarma.

Tato velkorysá technologická pomoc nám dává obrovskou svobodu a klid v zádech. Díky nim se můžeme plně soustředit na to nejdůležitější – vývoj užitečných nástrojů, rozšiřování odborných textů, posilování právní podpory a pomoc všem tatínkům, kteří to v opatrovnických sporech a rodinných situacích nemají jednoduché.

Velké díky!
Vážíme si toho, že VEDOS ukázal sociální cítění a podpořil projekt, jehož cílem je férovost, rovnocenná péče a blaho dětí.

Tento krok je pro nás obrovským impulzem do další práce. Děkujeme společnosti VEDOS za důvěru a těšíme se na skvělou spolupráci!`,
    category: 'Aktuality',
    date: '2026-07-27',
    author: 'Redakce Táta má právo',
    likes: 89,
    commentsCount: 12,
    readTime: '3 min',
    tags: ['VEDOS', 'Sponzor', 'Partnerství', 'Novinky'],
    imageUrl: 'https://vedos.cz/wp-content/uploads/2025/03/VEDOS-Hosting-logo.svg'
  },
  {
    id: 'art-1',
    title: 'Jak zvládnout OSPOD: Praktický video-průvodce pro otce',
    summary: 'Kompletní přehled práv a povinností otce při jednání se sociálními pracovníky, doprovázený podrobným video-výkladem.',
    content: 'Jednání s OSPOD (Orgán sociálně-právní ochrany dětí) bývá jedním z nejnáročnějších momentů opatrovnického řízení. Mnoho otců se dopouští zbytečných chyb kvůli neznalosti svých práv.\n\nV tomto článku naleznete klíčové zásady: jak se připravit na první schůzku, proč si vyžádat zápis z jednání a jak zachovat klid i v napjatých situacích.\n\nPodívejte se na naše video níže, kde sociální psycholog rozebírá konkrétní scénáře a ukazuje správné komunikační reakce.',
    category: 'Psychologie',
    date: '2026-07-15',
    author: 'Jiří Šár',
    likes: 24,
    commentsCount: 3,
    readTime: '6 min',
    tags: ['OSPOD', 'Komunikace', 'Psychologie'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'art-2',
    title: 'Střídavá péče v praxi: Nové judikáty Ústavního soudu',
    summary: 'Rozbor nejnovějších rozhodnutí Ústavního soudu ČR, která posilují roli otců a rozptylují obavy ze střídavého uspořádání péče.',
    content: 'Ústavní soud dlouhodobě potvrzuje, že střídavá péče je prioritním řešením. Přesto se v praxi setkáváme s odporem obecných soudů nebo opatrovníků.\n\nAnalyzujeme nález sp. zn. I. ÚS 1506/21 (střídavá péče u batolat) a nález sp. zn. III. ÚS 149/20 (iracionální nesouhlas jednoho z rodičů).\n\nZhlédněte přiloženou video analýzu od předního českého advokáta, který vysvětluje, jak tyto judikáty správně citovat ve vašem návrhu k soudu.',
    category: 'Soudy',
    date: '2026-07-10',
    author: 'Mgr. Jan Novotný',
    likes: 42,
    commentsCount: 5,
    readTime: '8 min',
    tags: ['Soudy', 'Judikatura', 'Ústavní soud'],
    videoUrl: 'https://vimeo.com/76979871'
  }
];
export const INITIAL_DOCUMENTS: DocumentTemplate[] = [];
export const INITIAL_ADVICE: AdviceItem[] = [];

export const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'p-justice',
    name: 'Justice.cz',
    description: 'Hlavní portál české justice. Obsahuje adresář všech okresních a krajských soudů, formuláře ke stažení a přístup do e-Spisu.',
    logoUrl: '',
    link: 'https://www.justice.cz',
    category: 'Ostatní',
    region: 'Celá ČR / Státní správa',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-pms',
    name: 'Probační a mediační služba ČR',
    description: 'Státní instituce poskytující bezplatné zprostředkování mediace a urovnání konfliktů v rodinných vztazích.',
    logoUrl: '',
    link: 'https://www.pms.justice.cz',
    category: 'Mediátor',
    region: 'Celá ČR / Pobočky v ORP',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-gov',
    name: 'Portál veřejné správy (Gov.cz)',
    description: 'Oficiální návody pro životní situace (úprava poměrů k dítěti, rozvod, rodičovská odpovědnost).',
    logoUrl: '',
    link: 'https://gov.cz',
    category: 'Ostatní',
    region: 'Celá ČR / Online',
    isRecommended: false,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-jenda',
    name: 'Portál JENDA / MPSV',
    description: 'Správa daňových zvýhodnění, rodičovského příspěvku, přídavků na děti a náhradního výživného.',
    logoUrl: '',
    link: 'https://jenda.mpsv.cz',
    category: 'Ostatní',
    region: 'Celá ČR / Online',
    isRecommended: false,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-algotech',
    name: 'ALGOTECH a.s.',
    description: 'Generální sponzor Cloud VPS infrastruktury. Společnost ALGOTECH poskytuje projektu „Táta má právo“ bezplatný vysokovýkonný Cloud VPS server pro bezproblémový provoz backendových mikroslužeb, databází a AI asistentů.',
    logoUrl: 'https://www.algotech.cz/files/logo.svg',
    link: 'https://www.algotech.cz/',
    category: 'Ostatní',
    region: 'Česká republika / Praha',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-vedos',
    name: 'VEDOS Internet, a.s.',
    description: 'Oficiální technologický partner a sponzor webhostingu. Společnost VEDOS poskytuje projektu „Táta má právo“ bezplatnou technologickou podporu a sponzorovaný webhosting NoLimit pro stabilní a rychlý chod.',
    logoUrl: 'https://vedos.cz/wp-content/uploads/2025/03/VEDOS-Hosting-logo.svg',
    link: 'https://www.vedos.cz',
    category: 'Ostatní',
    region: 'Česká republika / Hluboká nad Vltavou',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-forpsi',
    name: 'FORPSI (Internet CZ, a.s.)',
    description: 'Oficiální sponzor doménové infrastruktury. Společnost FORPSI věnovala a bezplatně zaregistrovala doménu tatovacesta.cz pro projekt „Táta má právo“.',
    logoUrl: 'https://forpsi.com/Forpsi/media/Forpsi/General/logo.svg',
    link: 'https://www.forpsi.com',
    category: 'Ostatní',
    region: 'Česká republika / Ktiš',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-ospod',
    name: 'OSPOD (Orgán sociálně-právní ochrany dětí)',
    description: 'Působí na odboru sociálních věcí každého Městského nebo Obecního úřadu obce s rozšířenou působností (ORP) podle místa trvalého bydliště dítěte. Působí jako soudem jmenovaný kolizní opatrovník.',
    logoUrl: '',
    link: 'https://www.mpsv.cz/vyhledavani-ospod',
    category: 'Poradna',
    region: 'Celá ČR / Místní ORP',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-cak',
    name: 'Česká advokátní komora (ČAK)',
    description: 'Vyhledávač licencovaných advokátů se specializací na rodinné právo a formulář pro žádost o určení advokáta zdarma (při splnění majetkových podmínek).',
    logoUrl: '',
    link: 'https://www.cak.cz',
    category: 'Advokát',
    region: 'Celá ČR',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-amcr',
    name: 'Asociace mediátorů ČR (AMČR)',
    description: 'Registr zapsaných rodinných mediátorů pro mimosoudní řešení dohod o péči a výživném.',
    logoUrl: '',
    link: 'https://www.amcr.cz',
    category: 'Mediátor',
    region: 'Celá ČR',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-poradny-fakult',
    name: 'Studentské právní poradny',
    description: 'Bezplatné právní poradny při právnických fakultách (UK v Praze, MU v Brně, UPOL v Olomouci, ZČU v Plzni).',
    logoUrl: '',
    link: 'https://www.prf.cuni.cz/studenti/studenti-magisterskeho-studia/studentska-pravni-poradna',
    category: 'Advokát',
    region: 'Praha, Brno, Olomouc, Plzeň',
    isRecommended: true,
    showOnMainPage: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-aperio',
    name: 'Aperio – Společnost pro zdravé rodičovství',
    description: 'Bezplatná právní a psychologická poradna pro rodiče procházející rozchodem nebo rozvodem.',
    logoUrl: '',
    link: 'https://aperio.cz',
    category: 'Poradna',
    region: 'Celá ČR / Online',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-w4w',
    name: 'Women for Women / VašeVýživné',
    description: 'Pomoc s vymáháním výživného, rodinnou mediací a kaučními granty.',
    logoUrl: '',
    link: 'https://www.women-for-women.cz',
    category: 'Poradna',
    region: 'Celá ČR',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-stridavka',
    name: 'Střídavka / Aktivní rodičovství',
    description: 'Nezávislý portál a poradna zaměřená na střídavou péči, práva obou rodičů a judikaturu Ústavního soudu.',
    logoUrl: '',
    link: 'https://www.stridavka.cz',
    category: 'Poradna',
    region: 'Celá ČR / Online',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-unie-otcu',
    name: 'Unie otců',
    description: 'Spolek zaměřený na ochranu práv otců a rovnoměrné zastoupení obou rodičů při výchově.',
    logoUrl: '',
    link: 'https://www.unieotcu.cz',
    category: 'Poradna',
    region: 'Celá ČR',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-fod',
    name: 'Fond ohrožených dětí (FOD)',
    description: 'Právní a sociální poradenství v krizových rodinných situacích.',
    logoUrl: '',
    link: 'https://www.fod.cz',
    category: 'Poradna',
    region: 'Celá ČR',
    isRecommended: false,
    showOnMainPage: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-amrp',
    name: 'Asociace manželských a rodinných poradců',
    description: 'Síť odborných psychologických a rodinných poraden po celé ČR.',
    logoUrl: '',
    link: 'https://amrp.cz',
    category: 'Psycholog',
    region: 'Celá ČR',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-fb-group',
    name: 'Oficiální Facebook skupina • Táta má právo',
    description: 'Oficiální skupina náležící nášemu portálu jako rozšíření obsahu na sociální sítě. Konzultační a komunitní prostor pro rodiče v náročných životních situacích – rozvod, OSPOD, péče o děti a vzájemná podpora.',
    logoUrl: '',
    link: 'https://www.facebook.com/share/g/19HoPx33mn/',
    category: 'Poradna',
    region: 'Celá ČR / Facebook',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-1',
    name: 'Poradna pro tátu (Facebook Stránka)',
    description: 'Konzultační a zpravodajská činnost pro rodiče v náročných životních situacích – rozvod, rozchod, OSPOD, soudy, advokáti i další odborníci.',
    logoUrl: '',
    link: 'https://www.facebook.com/share/g/19HoPx33mn/',
    category: 'Poradna',
    region: 'Celá ČR / Online',
    isRecommended: true,
    showOnMainPage: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_FORUM_CATEGORIES: ForumCategory[] = [
  { id: 'cat-1', name: 'Střídavá péče', description: 'Praktické zkušenosti, harmonogramy střídání, logistika a psychologie dětí.', iconName: 'Scale', postCount: 0 },
  { id: 'cat-2', name: 'Soudní řízení', description: 'Jak probíhá soud, délka řízení, znalecké posudky a odvolání.', iconName: 'FileText', postCount: 0 },
  { id: 'cat-3', name: 'Komunikace a OSPOD', description: 'Jak mluvit se sociálními pracovníky, jak komunikovat s expartnerem bez konfliktů.', iconName: 'MessageSquare', postCount: 0 },
  { id: 'cat-4', name: 'Výživné (Alimony)', description: 'Výpočet výživného, tabulky ministerstva spravedlnosti, vymáhání dlužného výživného.', iconName: 'Coins', postCount: 0 }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    categoryId: 'cat-1',
    title: 'Jak zvládnout předávání dětí bez konfliktů (Praktické rady)',
    content: 'Ahoj tátové, řeším neustálé konflikty při předávání dětí u dveří matky. Bývalá žena na mě křičí před dětmi a obviňuje mě ze lží. Našel jsem skvělé video od rodinného terapeuta o asertivní komunikaci a technikách zklidnění situace. Hodně mi to pomohlo a chci se o to podělit. Jaké jsou vaše osvědčené triky? Předáváte na neutrálním místě?',
    userId: 'usr-sar',
    userName: 'Jiří Šár',
    userAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Jiri',
    date: '2026-07-20',
    likes: 12,
    commentsCount: 2,
    tags: ['předávání', 'konflikty', 'komunikace'],
    reported: false,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'post-2',
    categoryId: 'cat-2',
    title: 'Nález Ústavního soudu o asymetrii střídavé péče',
    content: 'Ahoj, chci se zeptat, zda máte někdo zkušenost s argumentací postupného rozšiřování střídavé péče. Soud mi navrhl asymetrický model (4 dny otec, 10 dní matka) s tím, že se to časem srovná. Je to bezpečné schválit, nebo trvat na rovnocenném podílu hned od začátku?',
    userId: 'usr-tomas',
    userName: 'Tomáš Novák',
    userAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Tomas',
    date: '2026-07-19',
    likes: 8,
    commentsCount: 1,
    tags: ['asymetrie', 'střídavá péče', 'soud'],
    reported: false
  }
];
export const INITIAL_STORIES: ExperienceStory[] = [];
export const INITIAL_CONTACTS: SupportContact[] = [];
export const INITIAL_COMMENTS: Comment[] = [];
export const INITIAL_DONATIONS: Donation[] = [];

// Helper to initialize and manage localStorage state safely
export function getStoredState<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`synthesis_hub_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStoredState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`synthesis_hub_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
}
