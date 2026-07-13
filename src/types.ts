/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export type ContentType = 'article' | 'forum' | 'advice';

export interface Comment {
  id: string;
  contentId: string;
  contentType: ContentType;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
  likes: number;
  reported: boolean;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Zákony' | 'Soudy' | 'Psychologie' | 'Aktuality';
  date: string;
  author: string;
  likes: number;
  commentsCount: number;
  readTime: string;
  tags: string[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date';
  placeholder: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Návrhy k soudu' | 'Odvolání' | 'Žádosti' | 'Čestná prohlášení';
  downloadCount: number;
  fileContent: string;
  formFields: FormField[];
}

export interface AdviceItem {
  id: string;
  title: string;
  content: string;
  category: 'OSPOD' | 'Příprava na soud' | 'Důkazy' | 'Časté chyby';
  checklist: string[];
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  postCount: number;
}

export interface ForumPost {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  date: string;
  likes: number;
  commentsCount: number;
  tags: string[];
  reported: boolean;
}

export interface SupportContact {
  id: string;
  name: string;
  type: 'právník' | 'mediátor' | 'psycholog' | 'organizace';
  region: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  rating: number;
}

export interface ExperienceStory {
  id: string;
  title: string;
  content: string;
  authorName: string; // "Anonym" or custom name
  date: string;
  likes: number;
  approved: boolean;
  reported: boolean;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  message?: string;
  date: string;
  isPublic: boolean;
  isVerified: boolean;
}

