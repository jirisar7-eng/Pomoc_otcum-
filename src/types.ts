/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'user' | 'admin' | 'superadmin';

export type AuthProviderType = 'google' | 'password' | 'passkey' | 'magic_link' | 'sms';

export interface LinkedIdentity {
  provider: AuthProviderType;
  emailOrDetail: string;
  connectedAt: string;
  isPrimary?: boolean;
}

export interface ActiveDevice {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ipAddress?: string;
  lastActive: string;
  isCurrent?: boolean;
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  method: string;
  deviceInfo: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  // Extra profile fields
  phone?: string;
  city?: string;
  bio?: string;
  // Identity Hub Security Fields
  linkedIdentities?: LinkedIdentity[];
  hasPassword?: boolean;
  hasPasskey?: boolean;
  hasGoogle?: boolean;
  hasMagicLink?: boolean;
  hasTwoFactor?: boolean;
  twoFactorType?: 'app' | 'email' | 'sms';
  lastLogin?: string;
  activeDevices?: ActiveDevice[];
  securityAuditLogs?: SecurityAuditEntry[];
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
  videoUrl?: string;
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
  videoUrl?: string;
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

// Co-parenting Hub interfaces
export interface CoparentConnection {
  id: string;
  inviteCode: string;
  parent1Id: string;
  parent1Name: string;
  parent2Id?: string;
  parent2Name?: string;
  children: string[];
  createdAt: string;
  updatedAt: string;
}

export type CalendarEventCategory = 'handover' | 'school' | 'health' | 'leisure' | 'other';

export interface CoparentCalendarEvent {
  id: string;
  connectionId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: CalendarEventCategory;
  creatorId: string;
  gmailSynced: boolean;
  createdAt: string;
}

export type DiaryEntryType = 'note' | 'reminder' | 'request' | 'health_log' | 'school_log';

export interface CoparentDiaryEntry {
  id: string;
  connectionId: string;
  title: string;
  content: string;
  type: DiaryEntryType;
  date: string;
  creatorId: string;
  creatorName: string;
  isImportant: boolean;
  status?: 'pending' | 'agreed' | 'declined';
  createdAt: string;
}

export interface CoparentChatMessage {
  id: string;
  connectionId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

// User Portal Data Models
export type TimelineNodeType = 'proposal' | 'mother_response' | 'ospod' | 'court_hearing' | 'judgment' | 'appeal' | 'other';

export interface TimelineNode {
  id: string;
  caseId: string;
  type: TimelineNodeType;
  title: string;
  date: string;
  notes: string;
  evidenceIds: string[]; // Associated Evidence IDs
  deadlineDate?: string;
  deadlineCompleted?: boolean;
}

export type EvidenceType = 'pdf' | 'photo' | 'audio' | 'video' | 'screenshot' | 'email';

export interface EvidenceFile {
  id: string;
  name: string;
  type: EvidenceType;
  notes: string;
  date: string;
  tags: string[];
  fileSize?: string;
  url?: string;
}

export interface CaseInfo {
  id: string;
  childName: string;
  status: string;
  courtName: string;
  notes: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
  type: 'info' | 'alert' | 'message';
}

export interface PrivateMessage {
  id: string;
  senderName: string;
  text: string;
  date: string;
  read: boolean;
}

export interface AuditLog {
  id?: string;
  timestamp: string;
  action: string;
  status: 'SUCCESS' | 'ERROR';
  details: string;
  errorMessage?: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  link: string;
  category: 'Poradna' | 'Advokát' | 'Psycholog' | 'Mediátor' | 'Ostatní';
  region: string;
  isRecommended: boolean;
  showOnMainPage: boolean;
  createdAt: string;
}

export type VideoPlatform = 'youtube' | 'facebook' | 'vimeo' | 'tiktok' | 'instagram' | 'x' | 'unknown';
export type VideoStatus = 'Approved' | 'Draft' | 'Archived';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  shareUrl: string;
  platform: VideoPlatform;
  author: string;
  source: string;
  partnerId?: string;
  partnerName?: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: VideoStatus;
  isFeatured: boolean;
  views: number;
  likes: number;
  language: 'CS' | 'SK' | 'EN';
  thumbnailUrl?: string;
  embedUrl?: string;
}

export interface VideoSource {
  id: string;
  url: string;
  title: string;
  author: string;
  platform: VideoPlatform;
  embedUrl: string;
  tags?: string[];
  savedAt?: string;
}




