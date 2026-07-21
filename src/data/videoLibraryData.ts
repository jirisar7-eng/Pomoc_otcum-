import { VideoItem, VideoPlatform } from '../types';
import { parseVideoUrl } from '../lib/videoEmbed';

export const DEFAULT_VIDEO_CATEGORIES = [
  'Střídavá péče',
  'Soudní řízení',
  'OSPOD',
  'Psychologie dítěte',
  'Manipulace dítěte',
  'Rodičovská komunikace',
  'Alimenty',
  'Práva otců',
  'Judikatura',
  'Rozhovory',
  'Podcasty',
  'Dokumenty',
  'Inspirativní příběhy'
];

export const DEFAULT_VIDEO_TAGS = [
  'OSPOD',
  'Soud',
  'Ústavní soud',
  'Psycholog',
  'Mediace',
  'Rozvod',
  'Střídavá péče',
  'Manipulace',
  'PAS',
  'Výživné',
  'Předběžné opatření',
  'Dohoda',
  'Rodičovský plán',
  'Advokát',
  'Péče obou rodičů'
];

export const DEFAULT_VIDEO_SOURCES = [
  'YouTube kanál',
  'Advokátní kancelář',
  'Ministerstvo spravedlnosti',
  'Veřejnoprávní televize',
  'Facebook stránka',
  'Podcast Táta má právo',
  'Unie otců',
  'Poradna pro rodinu',
  'Česká televize'
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-promo',
    title: 'Oficiální propagační spot: Táta má právo – Právní vzory a AI asistence',
    description: 'Bojujete o své dítě? Oficiální videoprezentace portálu Táta má právo. Získejte kompletní právní vzory, náhledy AI asistentů pro střídavou péči a navštivte tatavacesta.vercel.app.',
    shareUrl: 'https://tatavacesta.vercel.app',
    platform: 'unknown',
    author: 'Jiří Šár (Táta má právo)',
    source: 'Oficiální propagační spot',
    tags: ['Táta má právo', 'Právní vzory', 'AI asistent', 'Střídavá péče'],
    category: 'Práva otců',
    createdAt: '2026-07-21T12:00:00Z',
    updatedAt: '2026-07-21T12:00:00Z',
    createdBy: 'Admin',
    status: 'Approved',
    isFeatured: true,
    views: 2450,
    likes: 312,
    language: 'CS',
    embedUrl: ''
  },
  {
    id: 'vid-001',
    title: 'Střídavá péče v praxi: Nálezy Ústavního soudu a jak obhájit rovnocennou péči',
    description: 'Detailní právní rozbor klíčových nálezů Ústavního soudu garantujících právo obou rodičů na výchovu dětí. Jak správně formulovat návrh k soudu a jak reagovat na námitky OSPOD.',
    shareUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube',
    author: 'JUDr. Martin Dvořák',
    source: 'Advokátní kancelář Dvořák & Partneři',
    partnerId: 'p1',
    partnerName: 'Advokátní poradna Rodina & Právo',
    tags: ['Ústavní soud', 'Střídavá péče', 'Soud', 'OSPOD'],
    category: 'Střídavá péče',
    createdAt: '2026-06-15T10:00:00Z',
    updatedAt: '2026-06-15T10:00:00Z',
    createdBy: 'Admin',
    status: 'Approved',
    isFeatured: true,
    views: 1420,
    likes: 189,
    language: 'CS',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'vid-002',
    title: 'Jak zvládnout jednání s OSPOD bez chyb a zbytečných emocí',
    description: 'Praktický videoprůvodce pro rodiče. Co očekávat při prvním šetření sociální pracovnice v domácnosti, jaká máte práva a z čeho vyhotovit písemný záznam.',
    shareUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    platform: 'youtube',
    author: 'PhDr. Alena Kopecká',
    source: 'Poradna pro rodinu',
    partnerId: 'p2',
    partnerName: 'Centrum rodinné mediace',
    tags: ['OSPOD', 'Mediace', 'Rodičovská komunikace'],
    category: 'OSPOD',
    createdAt: '2026-06-20T14:30:00Z',
    updatedAt: '2026-06-20T14:30:00Z',
    createdBy: 'Admin',
    status: 'Approved',
    isFeatured: true,
    views: 980,
    likes: 134,
    language: 'CS',
    embedUrl: 'https://www.youtube.com/embed/L_LUpnjgPso'
  },
  {
    id: 'vid-003',
    title: 'Syndrom zavržení rodiče (PAS) a manipulace s dítětem',
    description: 'Přednáška dětského psychologa zaměřená na varovné signály manipulace dítěte druhým rodičem, psychologické dopady a doporučené způsoby důkazního zajištění pro soud.',
    shareUrl: 'https://vimeo.com/76979871',
    platform: 'vimeo',
    author: 'Mgr. Tomáš Novotný',
    source: 'Dětská psychologie & Výzkum',
    tags: ['PAS', 'Psycholog', 'Manipulace', 'Důkazy'],
    category: 'Manipulace dítěte',
    createdAt: '2026-05-11T09:15:00Z',
    updatedAt: '2026-05-11T09:15:00Z',
    createdBy: 'Admin',
    status: 'Approved',
    isFeatured: false,
    views: 740,
    likes: 92,
    language: 'CS',
    embedUrl: 'https://player.vimeo.com/video/76979871'
  },
  {
    id: 'vid-004',
    title: 'Výpočet výživného podle metodiky MS ČR 2026',
    description: 'Vysvětlení doporučujících tabulek Ministerstva spravedlnosti pro stanovení alimentů podle věku dítěte, čistého příjmu a poměru péče.',
    shareUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    platform: 'youtube',
    author: 'Ing. Petr Svoboda',
    source: 'Ministerstvo spravedlnosti',
    tags: ['Výživné', 'Alimenty', 'Soud'],
    category: 'Alimenty',
    createdAt: '2026-07-01T11:00:00Z',
    updatedAt: '2026-07-01T11:00:00Z',
    createdBy: 'Admin',
    status: 'Approved',
    isFeatured: true,
    views: 1850,
    likes: 245,
    language: 'CS',
    embedUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ'
  },
  {
    id: 'vid-005',
    title: 'Podcast: Příběh táty, který vybojoval střídavou péči po 3 letech soudů',
    description: 'Otevřený rozhovor s otcem dvou dětí o vytrvalosti, finanční i psychické náročnosti opatrovnického sporu a vítězství spravedlnosti u Krajského soudu.',
    shareUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    platform: 'youtube',
    author: 'Jiří Král & Tým Táta má právo',
    source: 'Podcast Táta má právo',
    tags: ['Příběh', 'Střídavá péče', 'Rozvod', 'Péče obou rodičů'],
    category: 'Inspirativní příběhy',
    createdAt: '2026-07-10T16:20:00Z',
    updatedAt: '2026-07-10T16:20:00Z',
    createdBy: 'Admin',
    status: 'Approved',
    isFeatured: false,
    views: 1210,
    likes: 178,
    language: 'CS',
    embedUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ'
  },
  {
    id: 'vid-006',
    title: 'Jak vytvořit funkční Rodičovský plán (Parenting Plan) do dohody',
    description: 'Návod krok za krokem, jak ošetřit prázdniny, svátky, kroužky, komunikaci a předávání dětí tak, aby vznikla vykonatelná rodičovská dohoda.',
    shareUrl: 'https://www.facebook.com/watch/?v=10153231379946729',
    platform: 'facebook',
    author: 'Mgr. Eva Černá',
    source: 'Facebook stránka Rodinná Mediace',
    partnerId: 'p2',
    partnerName: 'Centrum rodinné mediace',
    tags: ['Rodičovský plán', 'Dohoda', 'Mediace', 'Rodičovská komunikace'],
    category: 'Rodičovská komunikace',
    createdAt: '2026-07-05T08:00:00Z',
    updatedAt: '2026-07-05T08:00:00Z',
    createdBy: 'Admin',
    status: 'Approved',
    isFeatured: false,
    views: 630,
    likes: 81,
    language: 'CS',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D10153231379946729&show_text=0&autoplay=0'
  }
];

const STORAGE_KEY = 'synthesis_videoteka_v1';
const CATEGORIES_KEY = 'synthesis_videoteka_categories_v1';

export function getStoredVideos(): VideoItem[] {
  if (typeof window === 'undefined') return INITIAL_VIDEOS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VIDEOS));
      return INITIAL_VIDEOS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load videos from storage', err);
    return INITIAL_VIDEOS;
  }
}

export function saveStoredVideos(videos: VideoItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    window.dispatchEvent(new Event('videoteka_updated'));
  } catch (err) {
    console.error('Failed to save videos to storage', err);
  }
}

export function getStoredVideoCategories(): string[] {
  if (typeof window === 'undefined') return DEFAULT_VIDEO_CATEGORIES;
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_VIDEO_CATEGORIES));
      return DEFAULT_VIDEO_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load categories', err);
    return DEFAULT_VIDEO_CATEGORIES;
  }
}

export function saveStoredVideoCategories(categories: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event('videoteka_categories_updated'));
  } catch (err) {
    console.error('Failed to save categories', err);
  }
}
