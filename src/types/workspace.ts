/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Personal Workspace & Case Management Data Models
 */

export interface Case {
  id: string;
  user_id: string;
  child_name?: string;
  children_names?: string[];
  court_name: string; // e.g. "Okresní soud v Olomouci" or "Zatím nevybráno"
  status: string; // e.g. "Příprava sporu", "Podán návrh", "Probíhá dokazování", "Rozsudek"
  case_number?: string; // e.g. "12 P 145/2026"
  judge_name?: string;
  ospod_officer?: string;
  mother_lawyer?: string;
  father_lawyer?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionPack {
  id: string;
  case_id: string;
  user_id: string;
  title: string;
  strategy_summary: string;
  priority_level: 'critical' | 'high' | 'medium' | 'low';
  generated_by: 'gemini' | 'wizard' | 'manual';
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  case_id: string;
  user_id: string;
  action_pack_id?: string;
  title: string;
  description?: string;
  category?: 'housing' | 'evidence' | 'finance' | 'legal' | 'ospod' | 'coparenting';
  is_completed: boolean;
  due_date?: string;
  priority?: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
}

export interface VaultEvidenceItem {
  id: string;
  case_id: string;
  user_id: string;
  title: string;
  category: 'pdf' | 'audio' | 'video' | 'screenshot' | 'email' | 'witness' | 'other';
  file_url?: string;
  file_size?: string;
  sha256_hash?: string;
  notes?: string;
  tags?: string[];
  is_encrypted?: boolean;
  date_recorded: string;
  created_at: string;
}

export interface CaseTimelineEvent {
  id: string;
  case_id: string;
  user_id: string;
  title: string;
  event_type: 'hearing' | 'filing' | 'ospod_visit' | 'incident' | 'milestone' | 'other';
  event_date: string;
  notes?: string;
  is_completed?: boolean;
  evidence_ids?: string[];
  created_at: string;
}
