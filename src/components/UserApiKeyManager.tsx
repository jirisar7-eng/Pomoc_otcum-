/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Bot, 
  Eye, 
  EyeOff, 
  Save, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Lock,
  Cpu,
  Check,
  Info
} from 'lucide-react';
import { User as UserType } from '../types';
import { SUPPORTED_PROVIDERS, AIProvider } from '../lib/aiConfig';

interface UserApiKeyManagerProps {
  currentUser: UserType | null;
  onKeysUpdated?: () => void;
}

export default function UserApiKeyManager({ currentUser, onKeysUpdated }: UserApiKeyManagerProps) {
  // Input fields state (can be empty string or new key string or masked)
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [preferredProvider, setPreferredProvider] = useState<AIProvider>('gemini');
  const [preferredModel, setPreferredModel] = useState('gemini-2.5-flash');

  // Status flags from backend
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [hasOpenaiKey, setHasOpenaiKey] = useState(false);
  const [hasAnthropicKey, setHasAnthropicKey] = useState(false);

  // Masked representations
  const [maskedGemini, setMaskedGemini] = useState('');
  const [maskedOpenai, setMaskedOpenai] = useState('');
  const [maskedAnthropic, setMaskedAnthropic] = useState('');

  // UI state
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load user API keys from server DB
  const loadUserKeys = async () => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/user/keys?userId=${encodeURIComponent(currentUser.id)}`);
      if (!res.ok) throw new Error('Chyba při načítání klíčů ze serveru.');
      const data = await res.json();

      if (data.success && data.keys) {
        setHasGeminiKey(data.keys.hasGeminiKey);
        setHasOpenaiKey(data.keys.hasOpenaiKey);
        setHasAnthropicKey(data.keys.hasAnthropicKey);

        setMaskedGemini(data.keys.geminiApiKey || '');
        setMaskedOpenai(data.keys.openaiApiKey || '');
        setMaskedAnthropic(data.keys.anthropicApiKey || '');

        setGeminiKey(data.keys.geminiApiKey || '');
        setOpenaiKey(data.keys.openaiApiKey || '');
        setAnthropicKey(data.keys.anthropicApiKey || '');

        if (data.keys.preferredProvider) {
          setPreferredProvider(data.keys.preferredProvider as AIProvider);
        }
        if (data.keys.preferredModel) {
          setPreferredModel(data.keys.preferredModel);
        }
      }
    } catch (err: any) {
      console.warn('Load user keys error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserKeys();
  }, [currentUser?.id]);

  // Handle Save to backend DB
  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    setIsSaving(true);
    setSaveSuccess('');
    setErrorMessage('');
    setTestResult(null);

    try {
      const payload = {
        userId: currentUser.id,
        geminiApiKey: geminiKey,
        openaiApiKey: openaiKey,
        anthropicApiKey: anthropicKey,
        preferredProvider,
        preferredModel,
      };

      const res = await fetch('/api/user/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Uložení klíčů selhalo.');
      }

      setHasGeminiKey(data.keys.hasGeminiKey);
      setHasOpenaiKey(data.keys.hasOpenaiKey);
      setHasAnthropicKey(data.keys.hasAnthropicKey);

      setMaskedGemini(data.keys.geminiApiKey || '');
      setMaskedOpenai(data.keys.openaiApiKey || '');
      setMaskedAnthropic(data.keys.anthropicApiKey || '');

      setSaveSuccess('Osobní API klíče byly úspěšně uloženy v databázi vaším účtem.');
      if (onKeysUpdated) onKeysUpdated();

      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Nepodařilo se uložit API klíče.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete key for specific provider or all
  const handleDeleteKey = async (provider?: string) => {
    if (!currentUser?.id) return;
    if (!confirm(provider ? `Opravdu chcete smazat uložený API klíč pro ${provider}?` : 'Opravdu chcete smazat všechny uložené API klíče?')) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/user/keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, provider }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Odstranění selhalo.');
      }

      if (provider === 'gemini') {
        setGeminiKey('');
        setMaskedGemini('');
        setHasGeminiKey(false);
      } else if (provider === 'openai') {
        setOpenaiKey('');
        setMaskedOpenai('');
        setHasOpenaiKey(false);
      } else if (provider === 'anthropic') {
        setAnthropicKey('');
        setMaskedAnthropic('');
        setHasAnthropicKey(false);
      } else {
        setGeminiKey('');
        setOpenaiKey('');
        setAnthropicKey('');
        setMaskedGemini('');
        setMaskedOpenai('');
        setMaskedAnthropic('');
        setHasGeminiKey(false);
        setHasOpenaiKey(false);
        setHasAnthropicKey(false);
      }

      setSaveSuccess(data.message || 'Klíč byl smazán.');
      if (onKeysUpdated) onKeysUpdated();
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Smazání selhalo.');
    } finally {
      setIsSaving(false);
    }
  };

  // Test current provider connection
  const handleTestConnection = async () => {
    if (!currentUser?.id) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({
          userId: currentUser.id,
          prompt: 'Odpověz jedním slovem: "OK".',
          provider: preferredProvider,
          model: preferredModel,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Testování AI modelu selhalo.');
      }

      const isUserKeyUsed = data.usedUserKey || data.keySource === 'user_database' || data.keySource === 'user_custom';
      setTestResult({
        success: true,
        message: `Spojení s ${data.provider.toUpperCase()} (${data.model}) bylo úspěšně ověřeno! ${
          isUserKeyUsed ? '🔑 Použit váš osobně uložený API klíč v databázi.' : '🌐 Použit systémový záložní klíč.'
        }`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Test spojení selhal. Zkontrolujte správnost vloženého klíče.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!currentUser) return null;

  const currentProviderOption = SUPPORTED_PROVIDERS.find((p) => p.id === preferredProvider) || SUPPORTED_PROVIDERS[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6" id="user-api-keys-manager-root">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Osobní AI API Klíče (Gemini, OpenAI, Anthropic)
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                🔒 Bezpečné uložiště
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Uložte si vlastní API klíče přiřazené k vašemu uživatelskému účtu. Server je automaticky použije při dotazech na AI asistenta.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
            Načítám klíče...
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSaveKeys} className="space-y-6">
        
        {/* 1. GOOGLE GEMINI KEY */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <label className="text-xs font-bold text-slate-800 font-display">
                Google Gemini API Klíč:
              </label>
              {hasGeminiKey ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Uloženo v databázi
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                  🌐 Použije se systémový klíč
                </span>
              )}
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-teal-600 hover:text-teal-800 font-medium inline-flex items-center gap-1 hover:underline"
            >
              Získat zdarma od Google <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showGemini ? 'text' : 'password'}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder={hasGeminiKey ? maskedGemini || 'AIzaSy...' : 'Vložte váš Google Gemini API klíč (AIzaSy...)'}
              className="w-full pl-3 pr-24 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowGemini(!showGemini)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                title={showGemini ? 'Skrýt klíč' : 'Zobrazit klíč'}
              >
                {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {hasGeminiKey && (
                <button
                  type="button"
                  onClick={() => handleDeleteKey('gemini')}
                  className="p-1 text-rose-400 hover:text-rose-600 transition-colors"
                  title="Smazat klíč pro Gemini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. OPENAI GPT KEY */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-800 font-display">
                OpenAI GPT API Klíč:
              </label>
              {hasOpenaiKey ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Uloženo v databázi
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                  🌐 Použije se systémový klíč
                </span>
              )}
            </div>

            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center gap-1 hover:underline"
            >
              Klíče v OpenAI Platform <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showOpenai ? 'text' : 'password'}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder={hasOpenaiKey ? maskedOpenai || 'sk-proj...' : 'Vložte váš OpenAI API klíč (sk-proj...)'}
              className="w-full pl-3 pr-24 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowOpenai(!showOpenai)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                title={showOpenai ? 'Skrýt klíč' : 'Zobrazit klíč'}
              >
                {showOpenai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {hasOpenaiKey && (
                <button
                  type="button"
                  onClick={() => handleDeleteKey('openai')}
                  className="p-1 text-rose-400 hover:text-rose-600 transition-colors"
                  title="Smazat klíč pro OpenAI"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. ANTHROPIC CLAUDE KEY */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-600" />
              <label className="text-xs font-bold text-slate-800 font-display">
                Anthropic Claude API Klíč:
              </label>
              {hasAnthropicKey ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Uloženo v databázi
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                  🌐 Použije se systémový klíč
                </span>
              )}
            </div>

            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1 hover:underline"
            >
              Klíče v Anthropic Console <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showAnthropic ? 'text' : 'password'}
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder={hasAnthropicKey ? maskedAnthropic || 'sk-ant...' : 'Vložte váš Anthropic Claude API klíč (sk-ant...)'}
              className="w-full pl-3 pr-24 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowAnthropic(!showAnthropic)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                title={showAnthropic ? 'Skrýt klíč' : 'Zobrazit klíč'}
              >
                {showAnthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {hasAnthropicKey && (
                <button
                  type="button"
                  onClick={() => handleDeleteKey('anthropic')}
                  className="p-1 text-rose-400 hover:text-rose-600 transition-colors"
                  title="Smazat klíč pro Anthropic"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. PREFERRED DEFAULT PROVIDER & MODEL */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-indigo-900 font-display">
              Preferovaný výchozí AI Poskytovatel & Model pro váš účet
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase font-mono text-indigo-700">
                Výchozí poskytovatel:
              </label>
              <select
                value={preferredProvider}
                onChange={(e) => {
                  const newProvider = e.target.value as AIProvider;
                  setPreferredProvider(newProvider);
                  const opt = SUPPORTED_PROVIDERS.find((p) => p.id === newProvider);
                  if (opt) {
                    const def = opt.models.find((m) => m.isDefault) || opt.models[0];
                    setPreferredModel(def.id);
                  }
                }}
                className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
              >
                {SUPPORTED_PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase font-mono text-indigo-700">
                Výchozí model:
              </label>
              <select
                value={preferredModel}
                onChange={(e) => setPreferredModel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
              >
                {currentProviderOption.models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* FEEDBACK MESSAGES */}
        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {testResult && (
          <div
            className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 animate-fadeIn ${
              testResult.success
                ? 'bg-teal-50 border-teal-200 text-teal-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{testResult.message}</p>
          </div>
        )}

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || isSaving}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Testuji spojení...
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Otestovat vybraný model
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {(hasGeminiKey || hasOpenaiKey || hasAnthropicKey) && (
              <button
                type="button"
                onClick={() => handleDeleteKey()}
                disabled={isSaving}
                className="px-3 py-2.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Smazat vše
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Ukládám klíče...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Uložit API klíče do účtu
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* Info Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
          <strong>Bezpečnost dat:</strong> Vaše osobní API klíče jsou bezpečně uloženy v databázi přiřazené k vaší uživatelské identitě (<code>{currentUser.id.substring(0, 8)}...</code>). Při odesílání dotazu v AI chatu server ověří přítomnost klíče v databázi a automaticky jej použije.
        </p>
      </div>

    </div>
  );
}
