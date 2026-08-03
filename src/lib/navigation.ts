/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Czech-aware slugify helper.
 * Converts Czech text (e.g., "1. Modely uspořádání střídavé péče") into clean anchor slugs ("1-modely-usporadani-stridave-pece").
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Known category slugs on tatamapravo.cz
const KNOWN_CATEGORY_SLUGS = new Set([
  'pravni-rad',
  'judikatura',
  'stridava-pece',
  'jednani-ospod',
  'vyzivne-majetek',
  'falesna-obvineni',
  'krizova-pomoc',
  'rodicovska-alienace',
  'znalecke-posudky',
  'komunikace-rodice',
  'nocni-pece',
  'psychologie-attachment',
  'sirsi-rodina',
  'kritika-studii',
  'mezinarodni-pravo',
  'technologie-ai',
  'statistiky-vyzkumy',
  'vzdelavani-cas',
  'vzory-podani',
  'zdravi-vyvoj',
  'komunita-zkusenosti'
]);

// Map shortcut route names / paths to application tab names
const TAB_ALIASES: Record<string, string> = {
  'home': 'home',
  'domu': 'home',
  'uplatneni-prav': 'rights',
  'rights': 'rights',
  'dokumenty': 'documents',
  'documents': 'documents',
  'judikatura-db': 'judikatura',
  'ke-stazeni': 'ke-stazeni',
  'downloads': 'ke-stazeni',
  'videoteka': 'videoteka',
  'videos': 'videoteka',
  'cesta-zakladatele': 'cesta-zakladatele',
  'knihovna-studii': 'knihovna-studii',
  'vzdelavani': 'vzdelavani',
  'pripadova-databaze': 'pripadova-databaze',
  'centrum-formularu': 'centrum-formularu',
  'ai-guide': 'ai-guide',
  'ai-pruvodce': 'ai-guide',
  'ai-case-manager': 'ai-case-manager',
  'legal-wiki': 'legal-wiki',
  'wiki': 'legal-wiki',
  'ai-admin': 'ai-admin',
  'opatrovnicka-agenda': 'opatrovnicka-agenda',
  'soudni-rizeni': 'opatrovnicka-agenda',
  'plan-pece': 'plan-pece',
  'care-simulator': 'plan-pece',
  'simulator-pece': 'plan-pece',
  'sourozenci': 'plan-pece',
  'sourozenecka-soudrznost': 'plan-pece',
  'pece-o-dite': 'plan-pece',
  'partners': 'partners',
  'partneri': 'partners',
  'advice': 'advice',
  'poradna': 'advice',
  'pribehy': 'stories',
  'stories': 'stories',
  'memento': 'memento',
  'forum': 'forum',
  'diskuse': 'forum',
  'contacts': 'contacts',
  'kontakty': 'contacts',
  'kontakt': 'contacts',
  'crisis': 'crisis',
  'krize': 'crisis',
  'support': 'support',
  'podpora': 'support',
  'news': 'news',
  'novinky': 'news',
  'coparent-hub': 'coparent-hub',
  'user-portal': 'user-portal',
  'portal': 'user-portal',
  'pracovna': 'user-portal',
  'moje-pracovna': 'user-portal',
  'profil': 'profile',
  'profile': 'profile',
  'sitemap': 'sitemap',
  'admin': 'admin',
  'ai-assistant': 'ai-assistant',
  'ai-asistent': 'ai-assistant',
  'ai-context': 'ai-context',
  'llms': 'ai-context',
  'llms-txt': 'ai-context',
  'terms': 'terms',
  'podminky': 'terms',
  'podminky-uzivani': 'terms',
  'privacy': 'privacy',
  'ochrana-udaju': 'privacy',
  'gdpr': 'privacy',
  'legal-center': 'legal-center',
  'legal-compliance': 'legal-center',
  'kodex': 'kodex',
  'dobrovolnicky-kodex': 'kodex',
  'zapoj-se': 'zapoj-se',
  'kariera': 'zapoj-se',
  'hledame-kolegy': 'zapoj-se',
  'join-team': 'zapoj-se',
  'uzivatelsky-manual': 'user-manual',
  'user-manual': 'user-manual',
  'vzory-podani': 'vzory-podani'
};

export interface ParsedLink {
  isExternal: boolean;
  targetTab: string | null;
  anchor: string | null;
  originalHref: string;
}

/**
 * Parses any href URL into a target application tab and internal anchor hash.
 * Handles formats like:
 *  - "/kategorie/stridava-pece#podminky"
 *  - "category-stridava-pece#podminky"
 *  - "/categories/pravni-rad#paragrafy"
 *  - "/soudni-rizeni#krok-1"
 *  - "#podminky"
 *  - "#category-stridava-pece#podminky"
 */
export function parseInternalLink(href: string, currentActiveTab: string = 'home'): ParsedLink {
  if (!href) {
    return { isExternal: false, targetTab: currentActiveTab, anchor: null, originalHref: href };
  }

  let cleanHref = href.trim();

  // Strip internal domain prefixes if present
  if (
    cleanHref.startsWith('https://tatamapravo.cz') ||
    cleanHref.startsWith('http://tatamapravo.cz') ||
    cleanHref.startsWith('https://www.tatamapravo.cz') ||
    cleanHref.startsWith('http://www.tatamapravo.cz') ||
    cleanHref.startsWith('https://pomoc-otcum.cz') ||
    cleanHref.startsWith('http://pomoc-otcum.cz')
  ) {
    cleanHref = cleanHref
      .replace(/^https?:\/\/(www\.)?(tatamapravo\.cz|pomoc-otcum\.cz)/i, '');
    if (!cleanHref) cleanHref = '/';
  }

  // External check
  if (
    cleanHref.startsWith('http://') ||
    cleanHref.startsWith('https://') ||
    cleanHref.startsWith('mailto:') ||
    cleanHref.startsWith('tel:') ||
    cleanHref.startsWith('//')
  ) {
    return { isExternal: true, targetTab: null, anchor: null, originalHref: cleanHref };
  }

  let targetTab: string | null = null;
  let anchor: string | null = null;

  // Multi-hash or compound hash e.g. "#category-stridava-pece#podminky"
  if (cleanHref.startsWith('#')) {
    const parts = cleanHref.slice(1).split('#');
    if (parts.length > 1) {
      // First part is tab, second is anchor
      targetTab = resolveTabName(parts[0]);
      anchor = parts[1];
    } else {
      // Single hash: check if hash itself is a tab name or an anchor ID
      const singleHash = parts[0];
      const resolvedTab = resolveTabName(singleHash);
      if (resolvedTab && resolvedTab !== currentActiveTab) {
        targetTab = resolvedTab;
        anchor = null;
      } else {
        targetTab = currentActiveTab;
        anchor = singleHash;
      }
    }
    return { isExternal: false, targetTab, anchor, originalHref: cleanHref };
  }

  // Path-based links e.g. "/kategorie/stridava-pece#podminky" or "category-stridava-pece#podminky"
  const [pathPart, hashPart] = cleanHref.split('#');
  anchor = hashPart || null;

  if (pathPart) {
    targetTab = resolveTabName(pathPart);
  } else {
    targetTab = currentActiveTab;
  }

  return { isExternal: false, targetTab, anchor, originalHref: cleanHref };
}

/**
 * Resolves a path segment, category slug, or tab alias into a canonical app tab string.
 */
export function resolveTabName(pathOrSlug: string): string | null {
  if (!pathOrSlug) return null;

  let clean = pathOrSlug.trim().toLowerCase();
  
  // Strip leading/trailing slashes
  clean = clean.replace(/^\/+|\/+$/g, '');

  // Handle /kategorie/... or /categories/... or category-...
  if (clean.startsWith('kategorie/')) {
    clean = clean.replace('kategorie/', '');
  } else if (clean.startsWith('categories/')) {
    clean = clean.replace('categories/', '');
  } else if (clean.startsWith('category-')) {
    clean = clean.replace('category-', '');
  }

  // If it's a known category slug
  if (KNOWN_CATEGORY_SLUGS.has(clean)) {
    return `category-${clean}`;
  }

  // Check aliases
  if (TAB_ALIASES[clean]) {
    return TAB_ALIASES[clean];
  }

  // Check if it already starts with category-
  if (clean.startsWith('category-')) {
    return clean;
  }

  return null;
}

/**
 * Attempts to smoothly scroll to an anchor element by ID, selector, or slugified heading.
 * Returns true if element was found and scrolled to.
 */
export function scrollToAnchor(anchorId: string, options: { offset?: number } = {}): boolean {
  if (!anchorId || typeof window === 'undefined') return false;

  const headerOffset = options.offset ?? 85; // Default height of fixed top bar
  const cleanId = anchorId.replace(/^#/, '').trim();
  if (!cleanId) return false;

  const slugifiedId = slugify(cleanId);

  // Search strategies for target element
  let targetElement: HTMLElement | null = null;

  // 1. Direct ID match
  targetElement = document.getElementById(cleanId) || document.getElementById(slugifiedId);

  // 2. Query selector matching id attribute
  if (!targetElement) {
    targetElement = document.querySelector(`[id="${cleanId}"]`) || document.querySelector(`[id="${slugifiedId}"]`);
  }

  // 3. Query selector matching data-anchor
  if (!targetElement) {
    targetElement = document.querySelector(`[data-anchor="${cleanId}"]`) || document.querySelector(`[data-anchor="${slugifiedId}"]`);
  }

  // 4. Heading text match (h1, h2, h3, h4)
  if (!targetElement) {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLElement[];
    for (const h of headings) {
      const hSlug = slugify(h.textContent || '');
      if (hSlug === slugifiedId || hSlug.includes(slugifiedId) || (h.id && slugify(h.id) === slugifiedId)) {
        targetElement = h;
        break;
      }
    }
  }

  if (targetElement) {
    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth'
    });

    // Add brief highlight effect to draw attention
    targetElement.classList.add('transition-all', 'duration-500', 'ring-2', 'ring-teal-400/80', 'ring-offset-2', 'rounded-lg');
    setTimeout(() => {
      targetElement?.classList.remove('ring-2', 'ring-teal-400/80', 'ring-offset-2');
    }, 2000);

    return true;
  }

  return false;
}

/**
 * Triggers global navigation event to change tab and smooth scroll to an anchor.
 */
export function navigateToTabAndAnchor(targetTab: string, anchorId?: string | null) {
  if (typeof window === 'undefined') return;

  const eventDetail = { tab: targetTab, anchor: anchorId || null };
  const navEvent = new CustomEvent('app-navigate-tab-anchor', { detail: eventDetail });
  window.dispatchEvent(navEvent);

  // Also sync window.location.hash
  if (anchorId) {
    const newHash = `#${targetTab}#${anchorId.replace(/^#/, '')}`;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }
  } else if (targetTab) {
    const newHash = `#${targetTab}`;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }
  }
}
