/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FunctionalStatus = 'functional' | 'requires_check' | 'error';
export type ApiStatus = 'operational' | 'degraded' | 'failing' | 'unknown';
export type DbAuditStatus = 'clean' | 'warning' | 'critical';
export type IssueSeverity = 'low' | 'medium' | 'high';
export type FixStatus = 'proposed' | 'approved' | 'applied' | 'rejected';

export interface SystemOverviewData {
  appStatus: 'operational' | 'degraded' | 'critical';
  lastBuild: string;
  systemVersion: string;
  backendStatus: { status: 'online' | 'degraded' | 'offline'; latencyMs: number };
  dbStatus: { firestore: 'online' | 'offline'; supabase: 'online' | 'offline' };
  aiServicesStatus: { gemini: 'online' | 'offline'; latencyMs: number };
  metrics: { ramUsageMb: number; ramTotalMb: number; cpuUsagePercent: number };
  counts: {
    registeredUsers: number;
    articles: number;
    studies: number;
    videos: number;
    partners: number;
    documents: number;
    judikats: number;
    apiRequests24h: number;
  };
}

export interface FunctionalTestItem {
  id: string;
  category: 'button' | 'link' | 'form' | 'modal' | 'filter' | 'search' | 'calculator' | 'ai_tool' | 'admin_func';
  categoryLabel: string;
  name: string;
  target: string;
  status: FunctionalStatus;
  lastTested: string;
  executionTimeMs: number;
  details: string;
  recommendedFix?: string;
}

export interface ApiMonitorItem {
  id: string;
  name: 'Gemini API' | 'Supabase' | 'Firebase' | 'Google OAuth' | 'Passkeys' | 'Google Drive API' | 'SMTP' | 'Analytics' | 'Storage' | 'Cloud Functions';
  status: ApiStatus;
  latencyMs: number;
  lastChecked: string;
  lastError?: string;
  recommendation: string;
  endpoint?: string;
}

export interface DatabaseCollectionAudit {
  collectionName: 'Users' | 'Articles' | 'Studies' | 'Videos' | 'Documents' | 'Partners' | 'Forum' | 'Stories' | 'Rulings' | 'Evidence' | 'Notifications' | 'Audit Logs';
  recordCount: number;
  emptyFieldsCount: number;
  duplicateCount: number;
  missingImagesCount: number;
  missingVideosCount: number;
  brokenLinksCount: number;
  brokenRelationsCount: number;
  lastChanged: string;
  status: DbAuditStatus;
  issues: string[];
}

export interface ContentAuditIssue {
  id: string;
  pageUrl: string;
  type: 'duplicate_text' | 'lorem_ipsum' | 'test_data' | 'placeholder' | 'broken_link' | 'broken_video' | 'missing_image' | 'empty_article' | 'short_text' | 'seo_duplicate';
  typeLabel: string;
  severity: IssueSeverity;
  description: string;
  location: string;
  suggestedFix: string;
  status: 'open' | 'pending_confirmation' | 'fixed';
}

export interface UxAuditPage {
  id: string;
  pageName: string;
  url: string;
  scores: {
    clarity: number;
    readability: number;
    responsiveness: number;
    accessibilityWcag: number;
    navigation: number;
    clickDepthScore: number;
    designConsistency: number;
  };
  overallScore: number;
  clickDepth: number;
  wcagViolations: number;
  recommendations: string[];
}

export interface SecurityAuditItem {
  id: string;
  domain: 'RBAC' | 'Roles & Permissions' | 'Public Endpoints' | 'XSS' | 'CSRF' | 'CORS' | 'Rate Limiting' | 'API Keys' | 'Environment Variables' | 'OAuth' | 'Passkeys';
  status: 'passed' | 'warning' | 'vulnerable';
  score: number;
  details: string;
  cveOrRisk: string;
  remediation: string;
}

export interface PerformanceMetrics {
  bundleSizeBytes: number;
  initialLoadSpeedMs: number;
  lazyLoadingActive: boolean;
  codeSplittingStatus: 'optimal' | 'suboptimal' | 'missing';
  lighthouseScore: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: {
    fcpMs: number;
    lcpMs: number;
    cls: number;
    inpMs: number;
  };
  mobilePerformanceScore: number;
  desktopPerformanceScore: number;
  bottlenecks: string[];
}

export interface AutoFixPatch {
  id: string;
  issueTitle: string;
  targetFile: string;
  category: 'code' | 'content' | 'config' | 'security';
  requiresAdminConfirmation: boolean;
  isLegalContent: boolean;
  diff: {
    originalCode: string;
    proposedCode: string;
  };
  status: FixStatus;
  appliedAt?: string;
}

export interface ReadinessCategoryScores {
  funkcnost: number;
  ux: number;
  vykon: number;
  bezpecnost: number;
  seo: number;
  databaze: number;
  aiModuly: number;
  api: number;
  obsah: number;
  administrace: number;
}

export interface ReadinessScoreReport {
  timestamp: string;
  overallScore: number;
  categories: ReadinessCategoryScores;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  summaryText: string;
  releaseReady: boolean;
}

export interface AuditHistoryRecord {
  id: string;
  date: string;
  systemVersion: string;
  overallScore: number;
  totalIssuesFound: number;
  fixedIssuesCount: number;
  reportJson: string;
  createdBy: string;
}
