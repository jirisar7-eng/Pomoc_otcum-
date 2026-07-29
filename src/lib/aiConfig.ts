/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AIProvider = 'gemini' | 'openai' | 'anthropic';

export interface AIClientConfig {
  provider: AIProvider;
  model: string;
  customApiKey: string;
}

export interface AIProviderOption {
  id: AIProvider;
  name: string;
  iconName: string;
  description: string;
  badge: string;
  models: { id: string; name: string; isDefault?: boolean }[];
}

export const SUPPORTED_PROVIDERS: AIProviderOption[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    iconName: 'Sparkles',
    description: 'Bleskový a přesný model od Google se zaměřením na logiku a český jazyk.',
    badge: 'Doporučeno',
    models: [
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Nejnovější)', isDefault: true },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Stabilní)' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Hluboká analýza)' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI GPT',
    iconName: 'Zap',
    description: 'Globálně populární GPT modely od OpenAI se skvělou stylistickou úpravou.',
    badge: 'Popular',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Rychlý & Úsporný)', isDefault: true },
      { id: 'gpt-4o', name: 'GPT-4o (Plný výkon)' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    iconName: 'Bot',
    description: 'Model Claude pro vysoce přirozené, empatické a strukturované právní odpovědi.',
    badge: 'Pro',
    models: [
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (Bleskový)', isDefault: true },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Špičkový)' },
    ],
  },
];

const LOCAL_STORAGE_KEY = 'synthesis_ai_client_config_v1';

export function getDefaultModelForProvider(provider: AIProvider): string {
  const found = SUPPORTED_PROVIDERS.find((p) => p.id === provider);
  if (!found) return 'gemini-2.5-flash';
  const defaultModel = found.models.find((m) => m.isDefault);
  return defaultModel ? defaultModel.id : found.models[0].id;
}

export function getAIClientConfig(): AIClientConfig {
  if (typeof window === 'undefined') {
    return { provider: 'gemini', model: 'gemini-2.5-flash', customApiKey: '' };
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.provider) {
        return {
          provider: parsed.provider || 'gemini',
          model: parsed.model || getDefaultModelForProvider(parsed.provider || 'gemini'),
          customApiKey: parsed.customApiKey || '',
        };
      }
    }
  } catch (err) {
    console.warn('Failed to read AI client config from localStorage:', err);
  }

  return {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    customApiKey: '',
  };
}

export function saveAIClientConfig(config: AIClientConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Failed to save AI client config to localStorage:', err);
  }
}
