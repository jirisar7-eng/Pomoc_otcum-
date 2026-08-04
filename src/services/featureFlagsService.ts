// src/services/featureFlagsService.ts
// Service for managing feature flags (site_settings / feature_flags) with Supabase + LocalStorage sync

export type FeatureCategory = 'ai_tools' | 'workspace' | 'public_tools' | 'integrations';

export interface FeatureFlag {
  id: string;
  feature_key: string;
  display_name: string;
  description: string;
  category: FeatureCategory;
  is_enabled: boolean;
  updated_at: string;
  updated_by?: string;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'ff-biff',
    feature_key: 'biff_communicator',
    display_name: 'Konstruktivní Komunikátor (BIFF)',
    description: 'Generátor věcných zpráv bez emocí podle BIFF metody pro komunikaci s druhým rodičem.',
    category: 'ai_tools',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-ai-assistant',
    feature_key: 'ai_legal_assistant',
    display_name: 'AI Právní Asistent (Gemini AI)',
    description: 'Interaktivní konverzační právní poradce s citacemi judikatury a analýzou právního postavení.',
    category: 'ai_tools',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-care-sim',
    feature_key: 'care_simulator',
    display_name: 'Simulátor Péče (28denní mřížka)',
    description: 'Matematická 28denní mřížka péče, kalkulace procentuálního podílu a export pro OSPOD/soud.',
    category: 'ai_tools',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-ai-guide',
    feature_key: 'ai_guide',
    display_name: 'AI Průvodce Řízením',
    description: 'Generování taktického plánu krok za krokem podle aktuální fáze opatrovnického sporu.',
    category: 'ai_tools',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-case-mgr',
    feature_key: 'ai_case_manager',
    display_name: 'AI Analýza Spisu & Důkazů',
    description: 'Automatické skenování listin, sémantické výtahy, analýza rizik a časová osa důkazů.',
    category: 'ai_tools',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-smart-editor',
    feature_key: 'ke_stazeni',
    display_name: 'Chytrý Editor Podání',
    description: 'Dynamický generátor právních podání s validací paragrafů přes e-Sbírku.',
    category: 'ai_tools',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-user-portal',
    feature_key: 'user_portal',
    display_name: 'Moje Pracovna (Workspace)',
    description: 'Soukromá řídicí jednotka rodiče pro správy spisů, kalendář termínů a důkazní trezor.',
    category: 'workspace',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-coparent-hub',
    feature_key: 'coparent_hub',
    display_name: 'Spolurodičovský Hub (CoParent)',
    description: 'Sdílený kalendář předávání dětí, evidencia společných výdajů a předávací deník.',
    category: 'workspace',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-calc-vyzivne',
    feature_key: 'calculator_vyzivne',
    display_name: 'Kalkulačka Výživného',
    description: 'Interaktivní výpočet doporučené výše výživného podle metodiky Ministerstva spravedlnosti ČR.',
    category: 'public_tools',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-judikatura',
    feature_key: 'judikatura_search',
    display_name: 'Vyhledávač Judikatury',
    description: 'Sémantická databáze judikátů Ústavního a Nejvyššího soudu ČR pro opatrovnické věci.',
    category: 'public_tools',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-esbirka-api',
    feature_key: 'state_laws_esbirka',
    display_name: 'e-Sbírka & e-Legislativa REST API',
    description: 'Živé napojení na státní databázi právních předpisů ČR pro automatické citace paragrafů.',
    category: 'integrations',
    is_enabled: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'ff-videoteka',
    feature_key: 'videoteka',
    display_name: 'Odborná Videotéka',
    description: 'Video rozhovory s advokáty, psychology a simulace výslechů na OSPOD a u soudu.',
    category: 'public_tools',
    is_enabled: true,
    updated_at: new Date().toISOString()
  }
];

const LOCAL_STORAGE_KEY = 'synthesis_feature_flags_v2';
export const FEATURE_FLAGS_EVENT = 'synthesis_feature_flags_updated';

// Helper to get stored feature flags
export function getStoredFeatureFlags(): FeatureFlag[] {
  if (typeof window === 'undefined') return DEFAULT_FEATURE_FLAGS;

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_FEATURE_FLAGS));
      return DEFAULT_FEATURE_FLAGS;
    }
    const parsed: FeatureFlag[] = JSON.parse(raw);
    
    // Merge with defaults to ensure any new keys exist
    const merged = DEFAULT_FEATURE_FLAGS.map((def) => {
      const existing = parsed.find((p) => p.feature_key === def.feature_key);
      return existing ? { ...def, ...existing } : def;
    });

    return merged;
  } catch (err) {
    console.warn('Failed to parse stored feature flags:', err);
    return DEFAULT_FEATURE_FLAGS;
  }
}

// Helper to save feature flags
export function saveFeatureFlags(flags: FeatureFlag[], updatedBy: string = 'Administrator'): void {
  const updatedFlags = flags.map((f) => ({
    ...f,
    updated_at: new Date().toISOString(),
    updated_by: updatedBy
  }));

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedFlags));
      // Dispatch custom event for real-time reactivity
      window.dispatchEvent(new CustomEvent(FEATURE_FLAGS_EVENT, { detail: updatedFlags }));
    } catch (err) {
      console.error('Failed to save feature flags to localStorage:', err);
    }
  }
}

// Check single feature status
export function isFeatureActive(featureKey: string): boolean {
  const flags = getStoredFeatureFlags();
  const match = flags.find((f) => f.feature_key === featureKey);
  return match ? match.is_enabled : true; // Default to true if not found
}

// Toggle a single feature
export function toggleFeatureFlag(featureKey: string, enabled?: boolean, updatedBy: string = 'Administrator'): FeatureFlag[] {
  const current = getStoredFeatureFlags();
  const updated = current.map((f) => {
    if (f.feature_key === featureKey) {
      return {
        ...f,
        is_enabled: enabled !== undefined ? enabled : !f.is_enabled,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy
      };
    }
    return f;
  });

  saveFeatureFlags(updated, updatedBy);
  return updated;
}

// Bulk toggle AI modules
export function setBulkFeaturesState(categoryOrAll: 'all' | 'ai_tools' | FeatureCategory, enabled: boolean, updatedBy: string = 'Administrator'): FeatureFlag[] {
  const current = getStoredFeatureFlags();
  const updated = current.map((f) => {
    if (categoryOrAll === 'all' || f.category === categoryOrAll) {
      return {
        ...f,
        is_enabled: enabled,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy
      };
    }
    return f;
  });

  saveFeatureFlags(updated, updatedBy);
  return updated;
}

// Reset flags to defaults
export function resetFeatureFlagsToDefaults(updatedBy: string = 'Administrator'): FeatureFlag[] {
  saveFeatureFlags(DEFAULT_FEATURE_FLAGS, updatedBy);
  return DEFAULT_FEATURE_FLAGS;
}
