/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Legal Compliance Center Type Definitions
 */

import { AuthProviderType } from '../types';

export type LegalDocumentCategory = 
  | 'terms'
  | 'privacy'
  | 'cookies'
  | 'ai-disclaimer'
  | 'volunteer-contract'
  | 'volunteer-codex'
  | 'community-rules'
  | 'internal';

export type AcceptanceStatus = 'Accepted' | 'Revoked' | 'Archived';

export interface LegalDocument {
  id: string;
  slug: string;
  title: string;
  category: LegalDocumentCategory;
  version: string; // e.g. "1.0", "1.1"
  language: 'cs' | 'sk' | 'en';
  content: string; // Markdown text
  htmlContent?: string;
  effectiveFrom: string; // ISO date string
  createdAt: string;
  createdBy: string;
  sha256Hash: string;
  isActive: boolean;
  isRequired: boolean;
  previousVersionId?: string;
  changelog?: string;
}

export interface UserLegalAcceptance {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  legalDocumentId: string;
  documentSlug: string;
  documentTitle: string;
  acceptedVersion: string;
  acceptedAt: string;
  ipAddress: string;
  userAgent: string;
  authProvider: AuthProviderType;
  oauthSubject?: string;
  passkeyId?: string;
  deviceName?: string;
  country?: string;
  documentHash: string;
  pdfPath?: string;
  pdfDataUrl?: string;
  status: AcceptanceStatus;
  contractNumber: string; // e.g. SYNTH-LEGAL-2026-X8F3A
  revokedAt?: string;
  revokeReason?: string;
}

export interface LegalAuditLogEntry {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  action: 
    | 'ACCEPTED' 
    | 'REVOKED' 
    | 'VERSION_PUBLISHED' 
    | 'PDF_GENERATED' 
    | 'DOCUMENT_CREATED' 
    | 'DOCUMENT_ARCHIVED' 
    | 'ANONYMIZED';
  documentId: string;
  documentSlug?: string;
  timestamp: string;
  ipAddress: string;
  userAgent?: string;
  sha256Hash: string;
  metadataJson: Record<string, any>;
}

export interface LegalComplianceStats {
  totalDocuments: number;
  totalAcceptances: number;
  activeUsersCompliantCount: number;
  pendingAcceptancesCount: number;
  lastAcceptanceTimestamp?: string;
}
