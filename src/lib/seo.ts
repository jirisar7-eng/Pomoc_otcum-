/**
 * SEO & Meta Tags Manager for Synthesis OS / Táta má právo
 * Manages unique titles, descriptions, canonical URLs, and OpenGraph tags per route.
 */

export interface PageSeoConfig {
  title: string;
  h1: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  category: string;
  parentLabel?: string;
}

export const SEO_CONFIGS: Record<string, PageSeoConfig> = {
  home: {
    title: 'Táta má právo | Komplexní portál pro rodiče v opatrovnických řízeních',
    h1: 'Rovnocenná péče o dítě a odborná právní podpora',
    description: 'Nezávislý informační portál, AI právní asistent, judikatura Ústavního soudu, vzory podání a databáze opatrovnických případů pro tátové a mámy.',
    keywords: 'střídavá péče, opatrovnické řízení, výživné, Ústavní soud, OSPOD, rodinné právo, táta má právo',
    canonicalPath: '/',
    category: 'Hlavní stránka'
  },
  'legal-wiki': {
    title: 'Právní minimum | Táta má právo',
    h1: 'Právní minimum a základy rodinného práva',
    description: 'Přehledný právní průvodce klíčovými pojmy, zákonnými lhůtami, právy rodičů a povinnostmi orgánů OSPOD a soudů v Česku a na Slovensku.',
    keywords: 'právní minimum, rodinný zákoník, občanský zákoník, rodinné právo, OSPOD práva',
    canonicalPath: '/pravni-minimum',
    category: 'Právní pomoc',
    parentLabel: 'Právní pomoc'
  },
  'opatrovnicka-agenda': {
    title: 'Opatrovnická agenda krok za krokem | Táta má právo',
    h1: 'Opatrovnická agenda a postup v řízení',
    description: 'Kompletní přehled fází opatrovnického procesu od podání návrhu přes jednání s OSPOD až po soudní rozsudek a úpravu péče.',
    keywords: 'opatrovnická agenda, předběžné opatření, úprava poměrů, opatrovnický soud',
    canonicalPath: '/opatrovnicka-agenda',
    category: 'Právní pomoc',
    parentLabel: 'Právní pomoc'
  },
  'ke-stazeni': {
    title: 'Vzory podání a formuláře ke stažení | Táta má právo',
    h1: 'Odborné vzory právních podání a návrhů k soudu',
    description: 'Stáhněte si editovatelné vzory návrhů na střídavou péči, úpravu výživného, odvolání a vyjádření k OSPOD s návodem na vyplnění.',
    keywords: 'vzory podání ke stažení, návrh na střídavou péči, vzor odvolání, vzor návrhu na výživné',
    canonicalPath: '/vzory-podani',
    category: 'Právní pomoc',
    parentLabel: 'Právní pomoc'
  },
  'vyzivne': {
    title: 'Kalkulačka výživného 2026 | Táta má právo',
    h1: 'Interaktivní kalkulačka výživného podle doporučujících tabulek MS ČR',
    description: 'Spočítejte si orientační výši alimentů podle věku dítěte, čistého příjmu a rozsahu péče podle nejnovější metodiky Ministerstva spravedlnosti.',
    keywords: 'kalkulačka výživného, tabulky alimentů, výpočet výživného 2026, spravedlivé výživné',
    canonicalPath: '/kalkulacka-vyzivneho',
    category: 'Právní pomoc',
    parentLabel: 'Právní pomoc'
  },
  'plan-pece': {
    title: 'Plán péče o dítě (Parenting Plan) | Táta má právo',
    h1: 'Interaktivní plán rodičovské péče a výchovy',
    description: 'Sestavte si dohodu o péči o dítě, prázdninovém režimu, školních povinnostech a zdravotní péči pro soud nebo OSPOD.',
    keywords: 'plán péče o dítě, parenting plan, rodičovská dohoda, prázdninový režim',
    canonicalPath: '/plan-pece',
    category: 'Právní pomoc',
    parentLabel: 'Právní pomoc'
  },
  'judikatura': {
    title: 'Databáze judikatury Ústavního a Nejvyššího soudu | Táta má právo',
    h1: 'Klíčové rozsudky a nálezy v opatrovnických věcech',
    description: 'Prohledávejte přehledné citace a právní věty z judikátů garantujících právo obou rodičů na výchovu a rovnocennou péči.',
    keywords: 'judikatura střídavá péče, nálezy Ústavního soudu, judikáty OSPOD, rovnocenný styk',
    canonicalPath: '/judikatura',
    category: 'Právní pomoc',
    parentLabel: 'Právní pomoc'
  },
  'pripadova-databaze': {
    title: 'Databáze případů a judikátní praxe | Táta má právo',
    h1: 'Případová databáze a reálná opatrovnická praxe',
    description: 'Anonymizované reálné případy z českých soudů. Porovnejte svůj případ s předchozími rozsudky a získejte strategickou výhodu.',
    keywords: 'databáze případů, judikátní praxe, opatrovnické spory, reálná rozhodnutí soudů',
    canonicalPath: '/databaze-pripadu',
    category: 'Případy',
    parentLabel: 'Případy'
  },
  'sitemap': {
    title: 'Časová osa a vývojový strom řízení | Táta má právo',
    h1: 'Interaktivní mapa stránek a časový strom opatrovnictví',
    description: 'Vizuální mapa všech fází opatrovnického procesu s vyznačením procesních lhůt a odkazů na příslušné návody.',
    keywords: 'časová osa řízení, průběh soudního procesu, opatrovnický vývojový strom',
    canonicalPath: '/casova-osa',
    category: 'Případy',
    parentLabel: 'Případy'
  },
  'ai-case-manager': {
    title: 'Osobní složka případu a Důkazy | Táta má právo',
    h1: 'Správa důkazů a chronologie sporu',
    description: 'Nástroj pro evidenci komunikace, zmeškaných předání, incidentů a důkazního materiálu pro advokáta či soud.',
    keywords: 'důkazy k soudu, chronologie případu, deník předávání, evidence komunikace',
    canonicalPath: '/osobni-slozka',
    category: 'Případy',
    parentLabel: 'Případy'
  },
  simulator: {
    title: 'Simulátor péče a nákladů | Táta má právo',
    h1: 'Interaktivní simulátor rozdělení časové péče a výdajů',
    description: 'Namodelujte si přesný poměr střídání péče v kalendářním roce včetně nákladové bilance pro obhajobu návrhu.',
    keywords: 'simulátor péče, model střídavé péče, rozdělení času, výpočet dní',
    canonicalPath: '/simulator-pece',
    category: 'Případy',
    parentLabel: 'Případy'
  },
  'knihovna-studies': {
    title: 'Knihovna psychologických a odborných studií | Táta má právo',
    h1: 'Odborné vědecké studie o dětské psychologii a střídavé péči',
    description: 'Sborník přeložených mezinárodních a českých výzkumů o vlivu střídavé péče, syndromu odcizení a konfliktu rodičů na vývoj dítěte.',
    keywords: 'studie střídavá péče, psychologie dítěte při rozvodu, PAS syndrom, výzkum péče',
    canonicalPath: '/knihovna-studii',
    category: 'Studijní centrum',
    parentLabel: 'Studijní centrum'
  },
  videoteka: {
    title: 'Videotéka rodinného práva a rozhovory | Táta má právo',
    h1: 'Odborná videa, rozbory judikátů a rozhovory s experty',
    description: 'Univerzální vzdělávací videotéka. Přednášky psychologů, návody k OSPOD, soudní rozbory a příběhy otců z YouTube, Vimeo, Facebooku a dalších platforem.',
    keywords: 'videotéka, videa střídavá péče, rozhovory opatrovnictví, OSPOD návody video, judikáty video',
    canonicalPath: '/videoteka',
    category: 'Studijní centrum',
    parentLabel: 'Studijní centrum'
  },
  news: {
    title: 'Informační báze a odborné články | Táta má právo',
    h1: 'Aktuality, odborné analýzy a průvodce',
    description: 'Pravidelně aktualizované články, rozhovory s odborníky, doporučení psychologů a novinky v rodinném právu.',
    keywords: 'články rodinné právo, novinky OSPOD, opatrovnické rady, rodinné poradenství',
    canonicalPath: '/aktuality',
    category: 'Studijní centrum',
    parentLabel: 'Studijní centrum'
  },
  vzdelavani: {
    title: 'Vzdělávací centrum a odborná poradna | Táta má právo',
    h1: 'Vzdělávací moduly a rady pro rodiče',
    description: 'Metodiky zvládání rozchodového konfliktu, komunikace s dětským psychologem a příprava na soudní výslech.',
    keywords: 'vzdělávání rodičů, kurzy rodičovství, komunikace po rozchodu',
    canonicalPath: '/vzdelavani',
    category: 'Studijní centrum',
    parentLabel: 'Studijní centrum'
  },
  forum: {
    title: 'Komunitní fórum a poradna rodičů | Táta má právo',
    h1: 'Diskusní fórum a sdílení zkušeností',
    description: 'Bezpečný prostor pro dotazy, diskuse s ostatními rodiči a vzájemnou právní i lidskou podporu.',
    keywords: 'fórum otci, diskuze střídavá péče, zkušenosti s OSPOD, komunitní podpora',
    canonicalPath: '/forum',
    category: 'Komunita',
    parentLabel: 'Komunita'
  },
  stories: {
    title: 'Příběhy otců a rodičovská praxe | Táta má právo',
    h1: 'Skutečné příběhy otců z opatrovnických řízení',
    description: 'Inspirativní i poučné příběhy rodičů, kteří úspěšně vybojovali rovnocennou péči o svá děcka.',
    keywords: 'příběhy otců, zkušenosti se soudem, vybojovaná péče, rodinné zkušenosti',
    canonicalPath: '/pribehy',
    category: 'Komunita',
    parentLabel: 'Komunita'
  },
  'coparent-hub': {
    title: 'Rodičovský hub pro komunikaci | Táta má právo',
    h1: 'Nástroje pro kultivovanou rodičovskou komunikaci',
    description: 'Asistovaný deník komunikace, sdílené události a doporučení pro efektivní co-parenting bez konfliktů.',
    keywords: 'coparenting hub, komunikace rodičů, sdílený kalendář, asistovaná komunikace',
    canonicalPath: '/rodicovsky-hub',
    category: 'Komunita',
    parentLabel: 'Komunita'
  },
  partners: {
    title: 'Partnerské organizace a odborníci | Táta má právo',
    h1: 'Doporučení advokáti, mediátoři a psychologové',
    description: 'Seznam ověřených odborníků na rodinné právo, krizovou intervenci a mediaci podporujících zájem dítěte.',
    keywords: 'advokáti střídavá péče, mediátoři rodina, dětský psycholog, pomoc rodičům',
    canonicalPath: '/partneri',
    category: 'Komunita',
    parentLabel: 'Komunita'
  },
  'ai-assistant': {
    title: 'AI Právní Asistent & NotebookLM Návod | Táta má právo',
    h1: 'Inteligentní AI Asistent pro opatrovnické otázky a analýzu spisu',
    description: 'Generativní AI asistent trénovaný na české legislativě, judikatuře a metodikách OSPOD. Obsahuje návod pro Google Gemini a NotebookLM s knihovnou promptů.',
    keywords: 'AI právní asistent, NotebookLM opatrovnický spis, Google Gemini rodinné právo, dotazy na OSPOD, šablony promptů',
    canonicalPath: '/ai-asistent',
    category: 'AI Nástroje',
    parentLabel: 'AI Nástroje'
  },
  'ai-guide': {
    title: 'AI Průvodce řízením | Táta má právo',
    h1: 'Interaktivní AI průvodce opatrovnickým procesem',
    description: 'Získejte personalizovanou analýzu vašeho aktuálního procesního kroku a doporučené další jednání.',
    keywords: 'AI průvodce, postup u soudu AI, krizový procesní průvodce',
    canonicalPath: '/ai-pruvodce',
    category: 'AI Nástroje',
    parentLabel: 'AI Nástroje'
  },
  support: {
    title: 'Podpořte projekt Táta má právo | Pomoc rodičům',
    h1: 'Podpora provozu a rozvoje nezávislého portálu',
    description: 'Vaše dary umožňují bezplatný provoz AI asistentů, tvorbu vzorů podání a rozvoj osvěty o právech dětí.',
    keywords: 'podpora projektu, darovat táta má právo, podpora rovnocenné péče',
    canonicalPath: '/podpora',
    category: 'Podpora',
    parentLabel: 'Podpora'
  },
  memento: {
    title: 'Základní pilíř & Memento | Táta má právo',
    h1: 'Základní hodnotový pilíř projektu a transparentnost',
    description: 'Závazek k ochraně nejlepšího zájmu dítěte, transparentní financování a etické zásady portálu.',
    keywords: 'základní pilíř, memento, zájem dítěte, hodnoty portálu',
    canonicalPath: '/memento',
    category: 'O projektu',
    parentLabel: 'O projektu'
  },
  kontakt: {
    title: 'Kontakt a Tým | Táta má právo',
    h1: 'Kontaktní informace a zakladatelé projektu',
    description: 'Napište nám své podněty, zpětnou vazbu nebo dotazy k fungování portálu Táta má právo.',
    keywords: 'kontakt táta má právo, e-mail podporu, tým zakladatelů',
    canonicalPath: '/kontakt',
    category: 'O projektu',
    parentLabel: 'O projektu'
  },
  crisis: {
    title: 'Krizová pomoc a SOS linky | Táta má právo',
    h1: 'Okamžitá krizová intervence a SOS kontakty',
    description: 'Kontakty na krizové linky, psychologickou pomoc a Linku bezpečí při akutním rozpadu rodiny.',
    keywords: 'krizová pomoc, SOS linka, krizové centrum, psychologická pomoc rozvod',
    canonicalPath: '/krizova-pomoc',
    category: 'Podpora',
    parentLabel: 'Podpora'
  },
  'user-portal': {
    title: 'Moje Pracovna | Táta má právo',
    h1: 'Uživatelský portál a osobní pracovna',
    description: 'Správa uložených dokumentů, historie AI dotazů, připravených plánů péče a osobního nastavení.',
    keywords: 'moje pracovna, uživatelský profil, uložené dokumenty',
    canonicalPath: '/pracovna',
    category: 'Moje Pracovna'
  },
  admin: {
    title: 'Administrace portálu | Synthesis OS',
    h1: 'Administrační rozhraní a správa obsahu',
    description: 'Správa uživatelů, článků, auditních logů, databázových záznamů a AI konfigurace.',
    keywords: 'admin panel, správa obsahu',
    canonicalPath: '/admin',
    category: 'Administrace'
  }
};

export function updatePageSeo(tabId: string) {
  if (typeof window === 'undefined') return;
  
  const config = SEO_CONFIGS[tabId] || SEO_CONFIGS.home;
  
  // 1. Update Document Title
  document.title = config.title;

  // 2. Helper to set/update meta tag
  const setMeta = (selector: string, attr: string, value: string, createAttr: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(createAttr, selector.replace(/meta\[.*=["']?([^"']*)["']?\]/, '$1'));
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  // Meta Description & Keywords
  setMeta('meta[name="description"]', 'content', config.description, 'name');
  setMeta('meta[name="keywords"]', 'content', config.keywords, 'name');

  // Open Graph Tags
  setMeta('meta[property="og:title"]', 'content', config.title, 'property');
  setMeta('meta[property="og:description"]', 'content', config.description, 'property');
  setMeta('meta[property="og:type"]', 'content', 'website', 'property');

  // Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  const baseUrl = window.location.origin;
  canonicalEl.setAttribute('href', `${baseUrl}${config.canonicalPath}`);
}
