/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Workspace Data & Supabase RLS Service
 */

import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Case, 
  ActionPack, 
  ChecklistItem, 
  VaultEvidenceItem, 
  CaseTimelineEvent 
} from '../types/workspace';

const STORAGE_KEY_CASE = 'synthesis_workspace_case_';
const STORAGE_KEY_CHECKLIST = 'synthesis_workspace_checklist_';
const STORAGE_KEY_ACTION_PACK = 'synthesis_workspace_action_pack_';
const STORAGE_KEY_VAULT = 'synthesis_workspace_vault_';
const STORAGE_KEY_TIMELINE = 'synthesis_workspace_timeline_';

export const DEFAULT_CHECKLIST_SEED = [
  {
    title: 'Zabezpečení samostatného zázemí pro dítě',
    description: 'Dětský pokoj / postel / studijní koutek v místě mého bydliště zkompletován a doložen fotografickou dokumentací.',
    category: 'housing' as const,
    priority: 'high' as const
  },
  {
    title: 'Přehled měsíčních příjmů, výdajů a dokladů o nákladech',
    description: 'Zpracován kompletní finanční přehled (potvrzení o příjmu, výdaje na dítě, kroužky, bydlení).',
    category: 'finance' as const,
    priority: 'high' as const
  },
  {
    title: 'Důkazní spis (SMS, e-maily, audio) zkompletován v Trezoru',
    description: 'Veškerá relevantní komunikace s druhým rodičem chronologicky seřazena a uložena v Trezoru.',
    category: 'evidence' as const,
    priority: 'high' as const
  },
  {
    title: 'Příprava podkladů pro jednání s OSPOD',
    description: 'Sepsán přehled aktivního zapojení do péče o dítě, lékařských prohlídek a školních aktivit pro opatrovnického orgánu.',
    category: 'ospod' as const,
    priority: 'medium' as const
  },
  {
    title: 'Návrh na úpravu poměrů k nezletilému dítěti',
    description: 'Připraven návrh na střídavou/společnou péči se strukturovaným odůvodněním v nejlepším zájmu dítěte.',
    category: 'legal' as const,
    priority: 'high' as const
  },
  {
    title: 'Kalendář péče a harmonogram předávání',
    description: 'Sestaven návrh konkrétních předávacích dnů a prázdninového režimu v Rodičovském Hubu.',
    category: 'coparenting' as const,
    priority: 'medium' as const
  },
  {
    title: 'Dodržování konstruktivního komunikačního protokolu',
    description: 'Písemná komunikace vedena výhradně věcně, bez emocí a dehonestací s akcentem na potřeby dítěte.',
    category: 'coparenting' as const,
    priority: 'medium' as const
  }
];

class WorkspaceService {
  /**
   * Fetch current case for authenticated user from Supabase with RLS filtering by user_id
   */
  async getCaseForUser(userId: string): Promise<Case | null> {
    if (!userId) return null;

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase
            .from('cases')
            .select('*')
            .eq('user_id', userId)
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            // Sync local cache
            localStorage.setItem(`${STORAGE_KEY_CASE}${userId}`, JSON.stringify(data));
            return data as Case;
          }
        }
      } catch (err) {
        console.warn('[WorkspaceService] Supabase getCase error:', err);
      }
    }

    // Fallback to local storage
    const local = localStorage.getItem(`${STORAGE_KEY_CASE}${userId}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  /**
   * Create or update case in Supabase
   */
  async createOrUpdateCase(caseData: Partial<Case> & { user_id: string }): Promise<Case> {
    const caseId = caseData.id || `case-${Date.now()}`;
    const now = new Date().toISOString();

    const fullCase: Case = {
      id: caseId,
      user_id: caseData.user_id,
      child_name: caseData.child_name || '',
      children_names: caseData.children_names || (caseData.child_name ? [caseData.child_name] : []),
      court_name: caseData.court_name || 'Zatím nevybráno',
      status: caseData.status || 'Příprava sporu',
      case_number: caseData.case_number || '',
      judge_name: caseData.judge_name || '',
      ospod_officer: caseData.ospod_officer || '',
      mother_lawyer: caseData.mother_lawyer || '',
      father_lawyer: caseData.father_lawyer || '',
      notes: caseData.notes || '',
      created_at: caseData.created_at || now,
      updated_at: now
    };

    // Always update local cache immediately
    localStorage.setItem(`${STORAGE_KEY_CASE}${caseData.user_id}`, JSON.stringify(fullCase));

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from('cases').upsert(fullCase);
        }
      } catch (err) {
        console.warn('[WorkspaceService] Supabase createOrUpdateCase error:', err);
      }
    }

    return fullCase;
  }

  /**
   * Get checklist items for a case
   */
  async getChecklistItems(caseId: string, userId: string): Promise<ChecklistItem[]> {
    if (!caseId || !userId) return [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase
            .from('checklist_items')
            .select('*')
            .eq('user_id', userId)
            .eq('case_id', caseId)
            .order('created_at', { ascending: true });

          if (!error && data && data.length > 0) {
            localStorage.setItem(`${STORAGE_KEY_CHECKLIST}${caseId}`, JSON.stringify(data));
            return data as ChecklistItem[];
          }
        }
      } catch (err) {
        console.warn('[WorkspaceService] Supabase getChecklistItems error:', err);
      }
    }

    // Local storage fallback
    const local = localStorage.getItem(`${STORAGE_KEY_CHECKLIST}${caseId}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        // empty
      }
    }

    // Seed default items if none exist
    return this.seedDefaultChecklist(caseId, userId);
  }

  /**
   * Seed initial 7 default checklist items if empty
   */
  async seedDefaultChecklist(caseId: string, userId: string): Promise<ChecklistItem[]> {
    const now = new Date().toISOString();
    const seeded: ChecklistItem[] = DEFAULT_CHECKLIST_SEED.map((item, index) => ({
      id: `chk-${caseId}-${index + 1}-${Date.now()}`,
      case_id: caseId,
      user_id: userId,
      title: item.title,
      description: item.description,
      category: item.category,
      is_completed: false,
      priority: item.priority,
      created_at: now,
      updated_at: now
    }));

    localStorage.setItem(`${STORAGE_KEY_CHECKLIST}${caseId}`, JSON.stringify(seeded));

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from('checklist_items').upsert(seeded);
        }
      } catch (e) {
        console.warn('[WorkspaceService] Seed checklist supabase error:', e);
      }
    }

    return seeded;
  }

  /**
   * Asynchronously toggle checklist item completion status in Supabase
   */
  async toggleChecklistItem(itemId: string, isCompleted: boolean, caseId: string, userId: string): Promise<ChecklistItem | null> {
    const items = await this.getChecklistItems(caseId, userId);
    const target = items.find(i => i.id === itemId);
    if (!target) return null;

    const updated: ChecklistItem = {
      ...target,
      is_completed: isCompleted,
      updated_at: new Date().toISOString()
    };

    const newItems = items.map(i => i.id === itemId ? updated : i);
    localStorage.setItem(`${STORAGE_KEY_CHECKLIST}${caseId}`, JSON.stringify(newItems));

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          await supabase
            .from('checklist_items')
            .update({ is_completed: isCompleted, updated_at: updated.updated_at })
            .eq('id', itemId)
            .eq('user_id', userId);
        }
      } catch (err) {
        console.warn('[WorkspaceService] Supabase toggleChecklistItem error:', err);
      }
    }

    return updated;
  }

  /**
   * Add new checklist item
   */
  async addChecklistItem(item: Partial<ChecklistItem> & { case_id: string; user_id: string; title: string }): Promise<ChecklistItem> {
    const now = new Date().toISOString();
    const newItem: ChecklistItem = {
      id: `chk-custom-${Date.now()}`,
      case_id: item.case_id,
      user_id: item.user_id,
      title: item.title,
      description: item.description || '',
      category: item.category || 'legal',
      is_completed: false,
      priority: item.priority || 'medium',
      due_date: item.due_date || '',
      created_at: now,
      updated_at: now
    };

    const existing = await this.getChecklistItems(item.case_id, item.user_id);
    const updated = [...existing, newItem];
    localStorage.setItem(`${STORAGE_KEY_CHECKLIST}${item.case_id}`, JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from('checklist_items').insert(newItem);
        }
      } catch (e) {
        console.warn('[WorkspaceService] Supabase addChecklistItem error:', e);
      }
    }

    return newItem;
  }

  /**
   * Get Action Pack for case
   */
  async getActionPack(caseId: string, userId: string): Promise<ActionPack | null> {
    if (!caseId || !userId) return null;

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase
            .from('action_packs')
            .select('*')
            .eq('user_id', userId)
            .eq('case_id', caseId)
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            localStorage.setItem(`${STORAGE_KEY_ACTION_PACK}${caseId}`, JSON.stringify(data));
            return data as ActionPack;
          }
        }
      } catch (err) {
        console.warn('[WorkspaceService] Supabase getActionPack error:', err);
      }
    }

    const local = localStorage.getItem(`${STORAGE_KEY_ACTION_PACK}${caseId}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return null;
      }
    }

    // Default Action Pack if created from Wizard/Navigator
    const defaultPack: ActionPack = {
      id: `ap-${caseId}`,
      case_id: caseId,
      user_id: userId,
      title: 'Akční plán krizové stabilizace & péče o dítě',
      strategy_summary: 'Strategický plán pro vybudování rovnocenných podmínek, zajištění stabilního zázemí pro dítě a konstruktivní prezentaci před OSPOD a soudem.',
      priority_level: 'critical',
      generated_by: 'wizard',
      created_at: new Date().toISOString()
    };

    localStorage.setItem(`${STORAGE_KEY_ACTION_PACK}${caseId}`, JSON.stringify(defaultPack));
    return defaultPack;
  }

  /**
   * Get Vault Evidence Items
   */
  async getVaultEvidence(caseId: string, userId: string): Promise<VaultEvidenceItem[]> {
    if (!caseId || !userId) return [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase
            .from('vault_evidence')
            .select('*')
            .eq('user_id', userId)
            .eq('case_id', caseId)
            .order('created_at', { ascending: false });

          if (!error && data) {
            localStorage.setItem(`${STORAGE_KEY_VAULT}${caseId}`, JSON.stringify(data));
            return data as VaultEvidenceItem[];
          }
        }
      } catch (err) {
        console.warn('[WorkspaceService] Supabase getVaultEvidence error:', err);
      }
    }

    const local = localStorage.getItem(`${STORAGE_KEY_VAULT}${caseId}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return [];
      }
    }

    return [];
  }

  /**
   * Add Vault Evidence
   */
  async addVaultEvidence(item: Partial<VaultEvidenceItem> & { case_id: string; user_id: string; title: string }): Promise<VaultEvidenceItem> {
    const now = new Date().toISOString();
    const newItem: VaultEvidenceItem = {
      id: `ev-${Date.now()}`,
      case_id: item.case_id,
      user_id: item.user_id,
      title: item.title,
      category: item.category || 'pdf',
      file_url: item.file_url || '',
      file_size: item.file_size || '1.2 MB',
      sha256_hash: item.sha256_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      notes: item.notes || '',
      tags: item.tags || ['Důkaz', 'Soudní spis'],
      is_encrypted: true,
      date_recorded: item.date_recorded || now.substring(0, 10),
      created_at: now
    };

    const existing = await this.getVaultEvidence(item.case_id, item.user_id);
    const updated = [newItem, ...existing];
    localStorage.setItem(`${STORAGE_KEY_VAULT}${item.case_id}`, JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from('vault_evidence').insert(newItem);
        }
      } catch (e) {
        console.warn('[WorkspaceService] Supabase addVaultEvidence error:', e);
      }
    }

    return newItem;
  }

  /**
   * Get Case Timeline Events
   */
  async getCaseTimeline(caseId: string, userId: string): Promise<CaseTimelineEvent[]> {
    if (!caseId || !userId) return [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase
            .from('case_timeline')
            .select('*')
            .eq('user_id', userId)
            .eq('case_id', caseId)
            .order('event_date', { ascending: true });

          if (!error && data) {
            localStorage.setItem(`${STORAGE_KEY_TIMELINE}${caseId}`, JSON.stringify(data));
            return data as CaseTimelineEvent[];
          }
        }
      } catch (err) {
        console.warn('[WorkspaceService] Supabase getCaseTimeline error:', err);
      }
    }

    const local = localStorage.getItem(`${STORAGE_KEY_TIMELINE}${caseId}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return [];
      }
    }

    return [];
  }

  /**
   * Add Case Timeline Event
   */
  async addCaseTimelineEvent(event: Partial<CaseTimelineEvent> & { case_id: string; user_id: string; title: string }): Promise<CaseTimelineEvent> {
    const now = new Date().toISOString();
    const newEvent: CaseTimelineEvent = {
      id: `evt-${Date.now()}`,
      case_id: event.case_id,
      user_id: event.user_id,
      title: event.title,
      event_type: event.event_type || 'milestone',
      event_date: event.event_date || now.substring(0, 10),
      notes: event.notes || '',
      is_completed: event.is_completed || false,
      evidence_ids: event.evidence_ids || [],
      created_at: now
    };

    const existing = await this.getCaseTimeline(event.case_id, event.user_id);
    const updated = [...existing, newEvent].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    localStorage.setItem(`${STORAGE_KEY_TIMELINE}${event.case_id}`, JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from('case_timeline').insert(newEvent);
        }
      } catch (e) {
        console.warn('[WorkspaceService] Supabase addCaseTimelineEvent error:', e);
      }
    }

    return newEvent;
  }
}

export const workspaceService = new WorkspaceService();
