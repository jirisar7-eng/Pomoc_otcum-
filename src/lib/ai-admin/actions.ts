/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIAdminClient, AIAdminExecutionResponse } from './client';
import { Article, Comment } from '../../types';

/**
 * AI ADMIN ACTIONS
 * Declares the core, semantic capabilities of the local AI Admin engine.
 * These methods can be directly bound to UI events.
 */

export interface AnalysisResult {
  legalAnalysis: string;
  recommendedSteps: string[];
  draftProposal: string;
  associatedTags: string[];
}

export interface RulingSummaryResult {
  signum: string;
  court: string;
  topic: string;
  summary: string;
  citationPhrase: string;
}

export interface CommentScanResult {
  isSafe: boolean;
  score: number; // 0 to 100 toxicity/leak score
  classification: 'safe' | 'toxic' | 'private_data_leak' | 'spam';
  diagnosis: string;
  cleanedText?: string;
}

export interface AuditResult {
  status: 'healthy' | 'warning' | 'critical';
  checkedTables: string[];
  issuesFound: number;
  report: string;
  timestamp: string;
}

export interface CrawlResultItem {
  title: string;
  source: string;
  url: string;
  date: string;
  summary: string;
  fullText: string;
  category: 'Aktuality' | 'Zákony' | 'Soudy' | 'Psychologie';
  relevanceScore: number;
}

export interface CrawlInternetResult {
  results: CrawlResultItem[];
}

export const AIAdminActions = {
  /**
   * 1. ANALYZE EVIDENCE AND DRAFT PETITION
   * Analyzes an uploaded evidence file (photo, audio, document) and generates
   * a professional legal strategy and draft petition for the court.
   */
  async analyzeEvidence(
    evidenceName: string,
    notes: string,
    type: string,
    contextRulings?: any[]
  ): Promise<AIAdminExecutionResponse<AnalysisResult>> {
    return AIAdminClient.execute<AnalysisResult>('ANALYZE_EVIDENCE', {
      evidenceName,
      notes,
      type,
      contextRulings,
    });
  },

  /**
   * 2. GENERATE EDUCATIONAL ARTICLE
   * Generates a comprehensive professional article in Czech, complete with
   * summaries, SEO tags, and a legal disclaimer.
   */
  async generateArticle(
    topic: string,
    category: string
  ): Promise<AIAdminExecutionResponse<Article>> {
    return AIAdminClient.execute<Article>('GENERATE_ARTICLE', {
      topic,
      category,
    });
  },

  /**
   * 3. SUMMARIZE SUPREME/CONSTITUTIONAL COURT RULING
   * Parses complex judicial citations (spisové značky) and writes a human-readable
   * summary of the holding and the key child-centric takeaway.
   */
  async summarizeRuling(
    topic: string,
    signum: string
  ): Promise<AIAdminExecutionResponse<RulingSummaryResult>> {
    return AIAdminClient.execute<RulingSummaryResult>('SUMMARIZE_RULING', {
      topic,
      signum,
    });
  },

  /**
   * 4. SCAN COMMENT FOR MODERATION & SAFETY
   * Uses AI to perform a real-time safety scan of a forum post or article comment.
   * Detects toxic behavior or leaks of personal data (e.g. real names of minor children).
   */
  async scanComment(
    commentId: string,
    text: string
  ): Promise<AIAdminExecutionResponse<CommentScanResult>> {
    return AIAdminClient.execute<CommentScanResult>('SCAN_COMMENT', {
      commentId,
      text,
    });
  },

  /**
   * 5. SYSTEM SELF-AUDIT & HEAL
   * Triggers an automated system check, validating Database connectivity, RLS integrity,
   * sitemap health, and logs of the platform.
   */
  async performSelfAudit(cases?: any[]): Promise<AIAdminExecutionResponse<AuditResult>> {
    return AIAdminClient.execute<AuditResult>('SYSTEM_AUDIT', { cases });
  },

  /**
   * 6. AI INTERNET CRAWLER & CONTENT COLLECTOR
   * Searches the internet using Gemini Search Grounding to find, moderate, and
   * prepare relevant child custody and family law resources for the portal.
   */
  async crawlInternet(query: string): Promise<AIAdminExecutionResponse<CrawlInternetResult>> {
    return AIAdminClient.execute<CrawlInternetResult>('CRAWL_INTERNET', { query });
  }
};
