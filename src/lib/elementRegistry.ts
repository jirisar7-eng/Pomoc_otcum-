/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ELEMENT REGISTRY SYSTEM - "Táta má právo"
 * Centralized registry of unique IDs for all 21 categories, core pages, articles,
 * interactive tools, document templates, and section anchors.
 */

import { HUB_CATEGORIES, HUB_ARTICLES } from '../data/contentHub';
import { SYNTHESIS_ARTICLES_100, SYNTHESIS_TOOLS } from '../data/synthesisAperioData';
import { PUBLIC_TOPBAR_ITEMS } from '../data/navigationData';

export type ElementType = 'page' | 'category' | 'article' | 'tool' | 'template' | 'section' | 'judgement' | 'faq';

export interface RegisteredElement {
  id: string;               // Unique ID (e.g., 'cat-pravni-rad', 'page-plan-pece', 'art-vyvraceni-prahovych-mytu')
  name: string;             // Human readable title / label
  type: ElementType;        // Type of element
  categorySlug?: string;    // Associated category slug if applicable
  routePath: string;        // Route / Tab identifier (e.g. '/kategorie/stridava-pece', 'plan-pece')
  anchorHash?: string;      // Optional section anchor (e.g. 'podminky-stridave-pece')
  fullUrl: string;          // Canonical URL link (e.g. '/kategorie/stridava-pece#podminky-stridave-pece')
  description: string;      // Summary / Purpose of element for admin management
  tags: string[];           // Searching/filtering tags
}

/**
 * Static catalog of key core pages.
 */
const CORE_PAGES_REGISTRY: RegisteredElement[] = [
  {
    id: 'page-home',
    name: 'Hlavní strana (Titulka)',
    type: 'page',
    routePath: 'home',
    fullUrl: '/',
    description: 'Titulní strana portálu "Táta má právo" s rozcestníkem, nejnovějšími články a rychlým SOS tlačítkem.',
    tags: ['domu', 'main', 'landing', 'titulka']
  },
  {
    id: 'page-plan-pece',
    name: 'Simulátor péče & Sourozenecké soudržnosti',
    type: 'page',
    routePath: 'plan-pece',
    fullUrl: '/plan-pece',
    description: 'Interaktivní simulátor modelů péče, kalendář střídání, kalkulačka časové zátěže a ochrana vazeb sourozenců.',
    tags: ['simulator', 'pece', 'sourozenci', 'kalendar', 'kalkulacka']
  },
  {
    id: 'page-synthesis-hub',
    name: 'Synthesis Hub (Aperio Beta 1.0)',
    type: 'page',
    routePath: 'synthesis-hub',
    fullUrl: '/synthesis-hub',
    description: 'Kompletní nová sekce inspirace obsahu Aperio s 100+ články, AI nástroji a 200+ FAQ.',
    tags: ['synthesis', 'aperio', 'hub', 'faq', 'nastroje']
  },
  {
    id: 'page-rights',
    name: 'Uplatnění práv rodiče',
    type: 'page',
    routePath: 'rights',
    fullUrl: '/uplatneni-prav',
    description: 'Přehled ústavních a zákonných práv rodiče, judikátové ukotvení a praktická doporučení.',
    tags: ['prava', 'ustava', 'zakon', 'otcovstvi']
  },
  {
    id: 'page-documents',
    name: 'Vzory podání & Dokumenty',
    type: 'page',
    routePath: 'documents',
    fullUrl: '/dokumenty',
    description: 'Ke stažení: Právně ověřené vzory návrhů na úpravu péče, odvolání, vyjádření a předběžná opatření.',
    tags: ['vzory', 'podani', 'odvolani', 'docx', 'pdf']
  },
  {
    id: 'page-judikatura',
    name: 'Judikatura a precedenty ÚS a NS',
    type: 'page',
    routePath: 'judikatura',
    fullUrl: '/judikatura-db',
    description: 'Vyhledatelná databáze průlomových nálezů Ústavního soudu a rozsudků ESLP chráníci práva dětí a otců.',
    tags: ['judikatura', 'ustavni-soud', 'eslp', 'precedenty']
  },
  {
    id: 'page-videoteka',
    name: 'Videotéka & Přednášky',
    type: 'page',
    routePath: 'videoteka',
    fullUrl: '/videoteka',
    description: 'Videonávody, rozhovory s psychology, advokáty a záznamy webinářů pro otce.',
    tags: ['video', 'prednasky', 'rozhovory', 'mediace']
  },
  {
    id: 'page-cesta-zakladatele',
    name: 'Cesta zakladatele & Anonymizovaný spis',
    type: 'page',
    routePath: 'cesta-zakladatele',
    fullUrl: '/cesta-zakladatele',
    description: 'Osobní příběh zakladatele portálu, motivace a kompletní anonymizovaný právní spis z reálného opatrovnického sporu.',
    tags: ['zakladatel', 'pribeh', 'spis', 'osobni-zkusenost']
  },
  {
    id: 'page-knihovna-studii',
    name: 'Knihovna vědeckých studií',
    type: 'page',
    routePath: 'knihovna-studii',
    fullUrl: '/knihovna-studii',
    description: 'Recenzované české i mezinárodní studie o střídavé péči, attachmentu, noční péči a dopadech na vývoj dětí.',
    tags: ['studie', 'vyzkum', 'veda', 'psychologie', 'attachment']
  },
  {
    id: 'page-centrum-formularu',
    name: 'Centrum formulářů a generátor',
    type: 'page',
    routePath: 'centrum-formularu',
    fullUrl: '/centrum-formularu',
    description: 'Chytrý generátor oficiálních žádostí pro MŠ/ZŠ, lékaře, OSPOD a soudy.',
    tags: ['generator', 'formulare', 'zadosti', 'skola']
  },
  {
    id: 'page-ai-guide',
    name: 'AI Průvodce a Case Manager',
    type: 'page',
    routePath: 'ai-guide',
    fullUrl: '/ai-pruvodce',
    description: 'Umělá inteligence vyškolená na českém opatrovnickém právu pro okamžité konzultace a analýzu spisů.',
    tags: ['ai', 'asistent', 'pruvodce', 'analyza']
  },
  {
    id: 'page-legal-wiki',
    name: 'Právní Wiki & Slovník pojmů',
    type: 'page',
    routePath: 'legal-wiki',
    fullUrl: '/legal-wiki',
    description: 'Slovníček odborných pojmů (OSPOD, kolizní opatrovník, předběžné opatření, parita, atd.).',
    tags: ['wiki', 'slovnik', 'pojmy', 'opatrovnik']
  },
  {
    id: 'page-admin',
    name: 'Administrace portálu (Admin OS)',
    type: 'page',
    routePath: 'admin',
    fullUrl: '/admin',
    description: 'Správa obsahu, uživatelů, auditní logy, kontrola ID prvků a AI nástroje pro redaktory.',
    tags: ['admin', 'sprava', 'audit', 'id-registry']
  }
];

/**
 * Static catalog of key interactive tools & calculators.
 */
const TOOLS_REGISTRY: RegisteredElement[] = [
  {
    id: 'tool-care-simulator',
    name: 'Simulátor poměru péče a ročního kalendáře',
    type: 'tool',
    routePath: 'plan-pece',
    anchorHash: 'simulator-kalkulacka',
    fullUrl: '/plan-pece#simulator-kalkulacka',
    description: 'Interaktivní kalkulačka procentuálního zastoupení péče obou rodičů v průběhu roku.',
    tags: ['kalkulacka', 'procenta', 'kalendar', 'pece']
  },
  {
    id: 'tool-ai-kontrola-podani',
    name: 'AI Kontrola soudního podání',
    type: 'tool',
    routePath: 'synthesis-hub',
    anchorHash: 'tool-ai-kontrola-podani',
    fullUrl: '/synthesis-hub#tool-ai-kontrola-podani',
    description: 'AI modul pro kontrolu věcných, formálních a judikátových náležitostí návrhů k soudu.',
    tags: ['ai', 'kontrola', 'podani', 'soud']
  },
  {
    id: 'tool-pruvodce-skolou',
    name: 'Generátor žádostí pro MŠ a ZŠ (§ 28 školského zákona)',
    type: 'tool',
    routePath: 'synthesis-hub',
    anchorHash: 'tool-pruvodce-skolou',
    fullUrl: '/synthesis-hub#tool-pruvodce-skolou',
    description: 'Generátor žádosti o zřízení přístupu do elektronické žákovské knížky (Bakaláři/EduPage).',
    tags: ['skola', 'bakalari', 'edupage', 'zadost', 'skolsky-zakon']
  },
  {
    id: 'tool-kalkulacka-nakladu',
    name: 'Kalkulačka reálných přímých nákladů na dítě',
    type: 'tool',
    routePath: 'synthesis-hub',
    anchorHash: 'tool-kalkulacka-nakladu',
    fullUrl: '/synthesis-hub#tool-kalkulacka-nakladu',
    description: 'Strukturovaný rozpočet stravy, bydlení, ošacení a kroužků pro soudní dokazování výživného.',
    tags: ['kalkulacka', 'vyzivne', 'naklady', 'rozpocet']
  },
  {
    id: 'tool-ai-case-manager',
    name: 'AI Case Manager (Analýza spisu)',
    type: 'tool',
    routePath: 'ai-guide',
    anchorHash: 'case-manager-upload',
    fullUrl: '/ai-pruvodce#case-manager-upload',
    description: 'Nástroj pro bezpečné nahrání a AI extrakci klíčových rozporů z protokolů OSPOD a soudních rozhodnutí.',
    tags: ['ai', 'spis', 'protokol', 'rozpory']
  }
];

/**
 * Generates the master element registry dynamically combining categories, core pages, articles, tools, and anchor sections.
 */
export function buildMasterElementRegistry(): RegisteredElement[] {
  const list: RegisteredElement[] = [];

  // 1. Core Pages
  list.push(...CORE_PAGES_REGISTRY);

  // 2. Interactive Tools
  list.push(...TOOLS_REGISTRY);

  // 3. All 21 Categories & Key Section Anchors
  HUB_CATEGORIES.forEach((cat) => {
    const catSlug = cat.slug;
    const catRoute = `/kategorie/${catSlug}`;

    // Category Page
    list.push({
      id: `cat-${catSlug}`,
      name: `Kategorie: ${cat.name}`,
      type: 'category',
      categorySlug: catSlug,
      routePath: catRoute,
      fullUrl: catRoute,
      description: cat.description,
      tags: ['kategorie', catSlug, cat.name.toLowerCase()]
    });

    // Sub-anchors inside every category
    list.push({
      id: `sec-${catSlug}-uvod`,
      name: `${cat.name} – Úvod & Právní rámec`,
      type: 'section',
      categorySlug: catSlug,
      routePath: catRoute,
      anchorHash: 'zakladni-pravni-ramec',
      fullUrl: `${catRoute}#zakladni-pravni-ramec`,
      description: `Sekce základního právního rámce a východisek pro kategorii ${cat.name}.`,
      tags: ['sekce', 'kotva', 'pravni-ramec', catSlug]
    });

    list.push({
      id: `sec-${catSlug}-doporuceni`,
      name: `${cat.name} – Doporučené postupy a taktika`,
      type: 'section',
      categorySlug: catSlug,
      routePath: catRoute,
      anchorHash: 'doporucene-postupy',
      fullUrl: `${catRoute}#doporucene-postupy`,
      description: `Kroková metodika a praktické rady pro kategorii ${cat.name}.`,
      tags: ['sekce', 'kotva', 'postupy', 'taktika', catSlug]
    });

    list.push({
      id: `sec-${catSlug}-judikatura`,
      name: `${cat.name} – Související judikatura & Paragrafy`,
      type: 'section',
      categorySlug: catSlug,
      routePath: catRoute,
      anchorHash: 'souvisejici-judikatura',
      fullUrl: `${catRoute}#souvisejici-judikatura`,
      description: `Precedenty a ústavní rozsudky vztahující se ke kategorii ${cat.name}.`,
      tags: ['sekce', 'kotva', 'judikatory', catSlug]
    });
  });

  // 4. Articles from HUB_ARTICLES
  HUB_ARTICLES.forEach((art) => {
    const route = art.category ? `/kategorie/${art.category}` : '/clanky';
    list.push({
      id: `art-${art.id}`,
      name: `Článek: ${art.title}`,
      type: 'article',
      categorySlug: art.category,
      routePath: route,
      anchorHash: `art-${art.id}`,
      fullUrl: `${route}#art-${art.id}`,
      description: art.excerpt || `Odborný článek s názvem ${art.title}.`,
      tags: ['clanek', art.category, ...(art.tags || [])]
    });
  });

  // 5. Synthesis 100 Articles
  SYNTHESIS_ARTICLES_100.forEach((art) => {
    list.push({
      id: `syn-art-${art.id}`,
      name: `Příručka Synthesis: ${art.title}`,
      type: 'article',
      categorySlug: art.category,
      routePath: 'synthesis-hub',
      anchorHash: `synthesis-article-${art.id}`,
      fullUrl: `/synthesis-hub#synthesis-article-${art.id}`,
      description: art.excerpt,
      tags: ['synthesis', 'prirucka', art.category]
    });
  });

  return list;
}

/**
 * Global singleton of all registered elements.
 */
export const ALL_REGISTERED_ELEMENTS = buildMasterElementRegistry();

/**
 * Filter elements by search query and type.
 */
export function filterRegisteredElements(
  elements: RegisteredElement[],
  searchQuery: string = '',
  selectedType: string = 'all',
  selectedCategory: string = 'all'
): RegisteredElement[] {
  const query = searchQuery.toLowerCase().trim();

  return elements.filter((item) => {
    // Type match
    const matchType = selectedType === 'all' || item.type === selectedType;

    // Category match
    const matchCat = selectedCategory === 'all' || item.categorySlug === selectedCategory;

    // Query match
    const matchQuery =
      !query ||
      item.id.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.fullUrl.toLowerCase().includes(query) ||
      item.tags.some((t) => t.toLowerCase().includes(query));

    return matchType && matchCat && matchQuery;
  });
}

/**
 * Helper to copy an element's ID or link to clipboard with fallback.
 */
export async function copyToClipboardHelper(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
}
