/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AI ADMIN CLIENT (Synthesis OS - Osobní asistent a autonomní správce)
 * This client manages secure, API-first communication with the backend
 * AI Admin endpoint, routing execution to the Gemini 3.5 LLM.
 */

import { getAIClientConfig } from '../aiConfig';

function getLocalUserId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem('synthesis_hub_local_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u && u.id) return u.id;
    }
  } catch {
    // ignore
  }
  return undefined;
}

export interface AIAdminExecutionResponse<T = any> {
  success: boolean;
  action: string;
  data?: T;
  text?: string;
  error?: string;
  timestamp: string;
}

export interface AIAdminPayload {
  action: string;
  params: Record<string, any>;
}

export class AIAdminClient {
  private static endpoint = '/api/ai-admin/execute';

  /**
   * Helper to execute a structured action on the backend AI Admin engine.
   * @param action Name of the action (e.g. 'ANALYZE_EVIDENCE', 'GENERATE_ARTICLE')
   * @param params Key-value arguments required by the action
   */
  static async execute<T = any>(
    action: string,
    params: Record<string, any> = {}
  ): Promise<AIAdminExecutionResponse<T>> {
    try {
      const aiConfig = getAIClientConfig();
      const userId = params.userId || getLocalUserId();

      const payloadParams = {
        ...params,
        userId,
        clientProvider: params.clientProvider || aiConfig.provider,
        clientModel: params.clientModel || aiConfig.model,
        clientApiKey: params.clientApiKey || aiConfig.customApiKey || undefined,
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, params: payloadParams }),
      });

      let errData: any = {};
      try {
        const rawText = await response.text();
        try {
          errData = JSON.parse(rawText);
        } catch {
          errData = { error: 'Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu.' };
        }
      } catch {
        errData = { error: 'Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu.' };
      }

      if (!response.ok || errData.success === false) {
        throw new Error(errData.error || `Server returned status ${response.status}`);
      }

      return errData as AIAdminExecutionResponse<T>;
    } catch (error: any) {
      console.error(`[AIAdminClient] Execution of "${action}" failed:`, error);
      return {
        success: false,
        action,
        error: error.message || 'Nepodařilo se navázat spojení se serverem.',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Directly queries the secure server-side AI proxy.
   * @param prompt The prompt to send to the AI
   * @param systemInstruction Optional system instruction to override the default persona
   * @param overrides Optional custom provider/model/key/userId overrides
   */
  static async queryGemini(
    prompt: string, 
    systemInstruction?: string,
    overrides?: {
      provider?: string;
      model?: string;
      apiKey?: string;
      userId?: string;
    }
  ): Promise<string> {
    try {
      const aiConfig = getAIClientConfig();
      const userId = overrides?.userId || getLocalUserId();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt,
          systemInstruction,
          userId,
          provider: overrides?.provider || aiConfig.provider,
          model: overrides?.model || aiConfig.model,
          apiKey: overrides?.apiKey || aiConfig.customApiKey || undefined,
        }),
      });

      let data: any = {};
      try {
        const rawText = await response.text();
        try {
          data = JSON.parse(rawText);
        } catch {
          data = { success: false, error: 'Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu.' };
        }
      } catch {
        data = { success: false, error: 'Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu.' };
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.error || `Služba vrátila chybu: ${response.status}`);
      }

      return data.text || '';
    } catch (error: any) {
      console.error('[AIAdminClient] Gemini Query Error:', error);
      throw error;
    }
  }
}
