/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AI ADMIN CLIENT (Synthesis OS - Osobní asistent a autonomní správce)
 * This client manages secure, API-first communication with the backend
 * AI Admin endpoint, routing execution to the Gemini 3.5 LLM.
 */

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
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ action, params }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned status ${response.status}`);
      }

      const result = await response.json();
      return result as AIAdminExecutionResponse<T>;
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
   * Directly queries the secure server-side Gemini proxy (convenience helper).
   * @param prompt The prompt to send to Gemini
   * @param systemInstruction Optional system instruction to override the default persona
   */
  static async queryGemini(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, systemInstruction }),
      });

      if (!response.ok) {
        throw new Error(`Služba vrátila chybu: ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error: any) {
      console.error('[AIAdminClient] Gemini Query Error:', error);
      throw error;
    }
  }
}
