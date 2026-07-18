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

export const INITIAL_ARTICLES: Article[] = [];
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

export const INITIAL_FORUM_POSTS: ForumPost[] = [];
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
