/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Legal Compliance & Versioning Service
 */

import { dbSyncService } from './dbSyncService';
import { INITIAL_LEGAL_DOCUMENTS } from '../data/initialLegalDocuments';
import { 
  LegalDocument, 
  UserLegalAcceptance, 
  LegalAuditLogEntry, 
  LegalComplianceStats 
} from '../types/legal';
import { 
  calculateSha256Hash, 
  generateContractNumber, 
  generateLegalAcceptancePdf 
} from './legalPdfService';
import { AuthProviderType } from '../types';

class LegalComplianceService {
  private documentsKey = 'legal_documents';
  private acceptancesKey = 'user_legal_acceptance';
  private auditKey = 'legal_audit_log';

  /**
   * Retrieves all active legal documents with initial seed fallback
   */
  async getLegalDocuments(): Promise<LegalDocument[]> {
    try {
      const docs = await dbSyncService.dualFetchCollection<LegalDocument>(
        this.documentsKey,
        INITIAL_LEGAL_DOCUMENTS
      );
      return docs && docs.length > 0 ? docs : INITIAL_LEGAL_DOCUMENTS;
    } catch (e) {
      console.warn('[LegalComplianceService] Error fetching legal documents, using seed defaults:', e);
      return INITIAL_LEGAL_DOCUMENTS;
    }
  }

  /**
   * Get single active document by slug
   */
  async getLegalDocumentBySlug(slug: string): Promise<LegalDocument | null> {
    const docs = await this.getLegalDocuments();
    return docs.find(d => d.slug === slug && d.isActive) || docs.find(d => d.slug === slug) || null;
  }

  /**
   * Get version history for a given document slug
   */
  async getDocumentVersions(slug: string): Promise<LegalDocument[]> {
    const allDocs = await this.getLegalDocuments();
    return allDocs
      .filter(d => d.slug === slug)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Creates a new document version (Auto-versioning)
   */
  async publishNewDocumentVersion(
    docData: {
      slug: string;
      title: string;
      category: any;
      version: string;
      content: string;
      isRequired: boolean;
      changelog: string;
    },
    createdBy: string
  ): Promise<LegalDocument> {
    const allDocs = await this.getLegalDocuments();
    const existingVersions = allDocs.filter(d => d.slug === docData.slug);
    const prevActive = existingVersions.find(d => d.isActive);

    // Compute SHA-256 hash for new content
    const sha256Hash = await calculateSha256Hash(docData.content);

    // Archive old active version if exists
    if (prevActive) {
      prevActive.isActive = false;
      await dbSyncService.dualSaveDocument(this.documentsKey, prevActive.id, prevActive);
    }

    const newDocId = `doc-${docData.slug}-v${docData.version.replace(/\./g, '_')}-${Date.now().toString(36)}`;
    const newDoc: LegalDocument = {
      id: newDocId,
      slug: docData.slug,
      title: docData.title,
      category: docData.category,
      version: docData.version,
      language: 'cs',
      content: docData.content,
      effectiveFrom: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      createdBy,
      sha256Hash,
      isActive: true,
      isRequired: docData.isRequired,
      previousVersionId: prevActive?.id,
      changelog: docData.changelog
    };

    // Save new document version
    await dbSyncService.dualSaveDocument(this.documentsKey, newDoc.id, newDoc);

    // Write Audit Log
    await this.recordAuditLog({
      userId: createdBy || 'admin',
      action: 'VERSION_PUBLISHED',
      documentId: newDoc.id,
      documentSlug: newDoc.slug,
      ipAddress: '127.0.0.1 (Admin UI)',
      sha256Hash,
      metadataJson: {
        newVersion: newDoc.version,
        previousVersion: prevActive?.version || 'none',
        changelog: newDoc.changelog
      }
    });

    return newDoc;
  }

  /**
   * User Electronic Acceptance of a legal document
   */
  async acceptDocument(params: {
    userId: string;
    userEmail: string;
    userName: string;
    documentSlug: string;
    acceptedVersion?: string;
    ipAddress?: string;
    userAgent?: string;
    authProvider?: AuthProviderType;
    passkeyId?: string;
  }): Promise<{ acceptance: UserLegalAcceptance; pdfDataUrl: string }> {
    const doc = await this.getLegalDocumentBySlug(params.documentSlug);
    if (!doc) {
      throw new Error(`Legal document with slug '${params.documentSlug}' was not found.`);
    }

    const versionToAccept = params.acceptedVersion || doc.version;
    const contractNumber = generateContractNumber();
    const docHash = doc.sha256Hash || await calculateSha256Hash(doc.content);

    const ipAddress = params.ipAddress || '127.0.0.1';
    const userAgent = params.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Synthesis OS Client');
    const authProvider = params.authProvider || 'google';

    const acceptanceId = `acc-${params.userId}-${doc.slug}-${versionToAccept.replace(/\./g, '_')}-${Date.now().toString(36)}`;

    // Generate PDF & DataUrl
    const pdfResult = await generateLegalAcceptancePdf({
      document: doc,
      acceptance: { contractNumber, acceptedAt: new Date().toISOString(), ipAddress, userAgent, authProvider },
      userFullName: params.userName || 'Uživatel Synthesis OS',
      userEmail: params.userEmail || 'user@tatovacesta.cz',
      userId: params.userId
    });

    const acceptanceRecord: UserLegalAcceptance = {
      id: acceptanceId,
      userId: params.userId,
      userEmail: params.userEmail,
      userName: params.userName,
      legalDocumentId: doc.id,
      documentSlug: doc.slug,
      documentTitle: doc.title,
      acceptedVersion: versionToAccept,
      acceptedAt: new Date().toISOString(),
      ipAddress,
      userAgent,
      authProvider,
      passkeyId: params.passkeyId,
      documentHash: docHash,
      pdfPath: `/storage/legal-pdfs/${acceptanceId}.pdf`,
      pdfDataUrl: pdfResult.dataUrl,
      status: 'Accepted',
      contractNumber
    };

    // Save acceptance to dual DB
    await dbSyncService.dualSaveDocument(this.acceptancesKey, acceptanceRecord.id, acceptanceRecord);

    // Save PDF in local cache / portal data for quick user retrieval
    try {
      if (typeof window !== 'undefined') {
        const userPdfKey = `synthesis_legal_pdf_${acceptanceRecord.id}`;
        localStorage.setItem(userPdfKey, pdfResult.dataUrl);
      }
    } catch (e) {
      console.warn('LocalStorage PDF cache warning:', e);
    }

    // Record Audit Log
    await this.recordAuditLog({
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: 'ACCEPTED',
      documentId: doc.id,
      documentSlug: doc.slug,
      ipAddress,
      userAgent,
      sha256Hash: docHash,
      metadataJson: {
        acceptedVersion: versionToAccept,
        contractNumber,
        authProvider
      }
    });

    return {
      acceptance: acceptanceRecord,
      pdfDataUrl: pdfResult.dataUrl
    };
  }

  /**
   * Get all acceptances for a specific user
   */
  async getUserAcceptances(userId: string): Promise<UserLegalAcceptance[]> {
    const all = await dbSyncService.dualFetchCollection<UserLegalAcceptance>(this.acceptancesKey, []);
    return all.filter(a => a.userId === userId && a.status === 'Accepted');
  }

  /**
   * Get all user acceptances across the system (For Admin)
   */
  async getAllAcceptances(): Promise<UserLegalAcceptance[]> {
    return dbSyncService.dualFetchCollection<UserLegalAcceptance>(this.acceptancesKey, []);
  }

  /**
   * Check if user has pending required document acceptances
   */
  async getPendingAcceptancesForUser(userId: string): Promise<LegalDocument[]> {
    const allDocs = await this.getLegalDocuments();
    const requiredDocs = allDocs.filter(d => d.isActive && d.isRequired);
    const userAcceptances = await this.getUserAcceptances(userId);

    const pendingDocs: LegalDocument[] = [];
    for (const reqDoc of requiredDocs) {
      const hasAccepted = userAcceptances.some(
        a => a.documentSlug === reqDoc.slug && a.acceptedVersion === reqDoc.version && a.status === 'Accepted'
      );
      if (!hasAccepted) {
        pendingDocs.push(reqDoc);
      }
    }

    return pendingDocs;
  }

  /**
   * Revokes a user consent/acceptance
   */
  async revokeAcceptance(acceptanceId: string, userId: string, reason?: string): Promise<boolean> {
    const allAcceptances = await this.getAllAcceptances();
    const acc = allAcceptances.find(a => a.id === acceptanceId && a.userId === userId);
    if (!acc) return false;

    acc.status = 'Revoked';
    acc.revokedAt = new Date().toISOString();
    acc.revokeReason = reason || 'Odvolání souhlasu uživatelem';

    await dbSyncService.dualSaveDocument(this.acceptancesKey, acc.id, acc);

    // Record Audit
    await this.recordAuditLog({
      userId,
      userName: acc.userName,
      userEmail: acc.userEmail,
      action: 'REVOKED',
      documentId: acc.legalDocumentId,
      documentSlug: acc.documentSlug,
      ipAddress: '127.0.0.1',
      sha256Hash: acc.documentHash,
      metadataJson: {
        revokedAcceptanceId: acceptanceId,
        reason: acc.revokeReason
      }
    });

    return true;
  }

  /**
   * Record entry into legal_audit_log
   */
  async recordAuditLog(entry: {
    userId: string;
    userName?: string;
    userEmail?: string;
    action: LegalAuditLogEntry['action'];
    documentId: string;
    documentSlug?: string;
    ipAddress: string;
    userAgent?: string;
    sha256Hash: string;
    metadataJson: Record<string, any>;
  }): Promise<LegalAuditLogEntry> {
    const logId = `legal-audit-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    const fullEntry: LegalAuditLogEntry = {
      id: logId,
      userId: entry.userId,
      userName: entry.userName,
      userEmail: entry.userEmail,
      action: entry.action,
      documentId: entry.documentId,
      documentSlug: entry.documentSlug,
      timestamp: new Date().toISOString(),
      ipAddress: entry.ipAddress || '127.0.0.1',
      userAgent: entry.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Synthesis OS'),
      sha256Hash: entry.sha256Hash,
      metadataJson: entry.metadataJson || {}
    };

    await dbSyncService.dualSaveDocument(this.auditKey, fullEntry.id, fullEntry);
    return fullEntry;
  }

  /**
   * Get all legal audit logs
   */
  async getLegalAuditLogs(): Promise<LegalAuditLogEntry[]> {
    const logs = await dbSyncService.dualFetchCollection<LegalAuditLogEntry>(this.auditKey, []);
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get system compliance stats
   */
  async getComplianceStats(): Promise<LegalComplianceStats> {
    const docs = await this.getLegalDocuments();
    const acceptances = await this.getAllAcceptances();
    const activeAcceptances = acceptances.filter(a => a.status === 'Accepted');

    return {
      totalDocuments: docs.filter(d => d.isActive).length,
      totalAcceptances: activeAcceptances.length,
      activeUsersCompliantCount: new Set(activeAcceptances.map(a => a.userId)).size,
      pendingAcceptancesCount: acceptances.filter(a => a.status === 'Revoked').length,
      lastAcceptanceTimestamp: activeAcceptances[0]?.acceptedAt
    };
  }

  /**
   * GDPR Data Export for a specific user
   */
  async exportUserLegalData(userId: string): Promise<{ acceptances: UserLegalAcceptance[]; auditLogs: LegalAuditLogEntry[] }> {
    const acceptances = await this.getUserAcceptances(userId);
    const allAudit = await this.getLegalAuditLogs();
    const userAudit = allAudit.filter(a => a.userId === userId);

    return {
      acceptances,
      auditLogs: userAudit
    };
  }

  /**
   * GDPR Anonymization / Deletion ("Právo na výmaz")
   */
  async anonymizeUserLegalData(userId: string): Promise<boolean> {
    const acceptances = await this.getUserAcceptances(userId);
    for (const acc of acceptances) {
      acc.status = 'Archived';
      acc.userEmail = 'anonymized@deleted.gdpr';
      acc.userName = 'Anonymizovaný Uživatel';
      await dbSyncService.dualSaveDocument(this.acceptancesKey, acc.id, acc);
    }

    await this.recordAuditLog({
      userId,
      action: 'ANONYMIZED',
      documentId: 'ALL_USER_DOCS',
      ipAddress: '127.0.0.1',
      sha256Hash: 'anonymized-gdpr-erasure-hash',
      metadataJson: {
        reason: 'GDPR Right to Erasure executed',
        anonymizedRecordsCount: acceptances.length
      }
    });

    return true;
  }
}

export const legalComplianceService = new LegalComplianceService();
export default legalComplianceService;
