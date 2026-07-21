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
    id: 'p-1',
    name: 'Poradna pro tátu',
    description: 'Konzultační a zpravodajská činnost pro rodiče v náročných životních situacích – rozvod, rozchod, OSPOD, soudy, advokáti i další odborníci.',
    logoUrl: '',
    link: 'https://www.facebook.com/share/1AuWrz6fLY/',
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
