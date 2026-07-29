/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  Bot, 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  ChevronDown, 
  ShieldCheck, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { 
  AIClientConfig, 
  AIProvider, 
  SUPPORTED_PROVIDERS, 
  getAIClientConfig, 
  saveAIClientConfig, 
  getDefaultModelForProvider 
} from '../lib/aiConfig';

interface AiProviderSelectorProps {
  onConfigChange?: (config: AIClientConfig) => void;
  compact?: boolean;
}

export default function AiProviderSelector({ onConfigChange, compact = false }: AiProviderSelectorProps) {
  const [config, setConfig] = useState<AIClientConfig>(getAIClientConfig());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showSecretKeyText, setShowSecretKeyText] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    const current = getAIClientConfig();
    setConfig(current);
  }, []);

  const handleProviderSelect = (providerId: AIProvider) => {
    const defaultModel = getDefaultModelForProvider(providerId);
    const updated: AIClientConfig = {
      ...config,
      provider: providerId,
      model: defaultModel,
    };
    setConfig(updated);
    saveAIClientConfig(updated);
    if (onConfigChange) onConfigChange(updated);
    triggerSavedEffect();
  };

  const handleModelSelect = (modelId: string) => {
    const updated: AIClientConfig = {
      ...config,
      model: modelId,
    };
    setConfig(updated);
    saveAIClientConfig(updated);
    if (onConfigChange) onConfigChange(updated);
    triggerSavedEffect();
  };

  const handleApiKeyChange = (keyVal: string) => {
    const updated: AIClientConfig = {
      ...config,
      customApiKey: keyVal,
    };
    setConfig(updated);
    saveAIClientConfig(updated);
    if (onConfigChange) onConfigChange(updated);
    triggerSavedEffect();
  };

  const triggerSavedEffect = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 1800);
  };

  const activeProviderObj = SUPPORTED_PROVIDERS.find((p) => p.id === config.provider) || SUPPORTED_PROVIDERS[0];

  const renderIcon = (id: AIProvider, className = "w-4 h-4") => {
    switch (id) {
      case 'gemini':
        return <Sparkles className={`${className} text-teal-500 fill-teal-500/20`} />;
      case 'openai':
        return <Zap className={`${className} text-emerald-500 fill-emerald-500/20`} />;
      case 'anthropic':
        return <Bot className={`${className} text-amber-500`} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  if (compact) {
    return (
      <div className="bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-2xl p-3 text-xs space-y-2.5 shadow-md" id="ai-provider-selector-compact">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Poskytovatel & Model</span>
          </div>

          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
              config.customApiKey
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
            }`}
            title="Nastavit vlastní API klíč"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>{config.customApiKey ? 'Vlastní klíč ✔' : '+ Klíč'}</span>
          </button>
        </div>

        {/* Provider Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {SUPPORTED_PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleProviderSelect(p.id)}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer truncate ${
                config.provider === p.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {renderIcon(p.id, "w-3 h-3")}
              <span className="truncate">{p.name.split(' ')[1] || p.name}</span>
            </button>
          ))}
        </div>

        {/* Model Select dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-slate-400 uppercase font-mono shrink-0">Model:</label>
          <div className="relative flex-1">
            <select
              value={config.model}
              onChange={(e) => handleModelSelect(e.target.value)}
              className="w-full bg-slate-950 text-white text-[11px] font-mono py-1 pl-2.5 pr-7 rounded-lg border border-slate-800 focus:border-teal-500 outline-none appearance-none cursor-pointer"
            >
              {activeProviderObj.models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Custom API Key Input drawer */}
        {showKeyInput && (
          <div className="bg-slate-950 border border-amber-500/30 p-2.5 rounded-xl space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Key className="w-3 h-3" /> Vlastní {activeProviderObj.name} API klíč:
              </span>
              <button
                type="button"
                onClick={() => setShowSecretKeyText(!showSecretKeyText)}
                className="text-slate-400 hover:text-white"
              >
                {showSecretKeyText ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>

            <input
              type={showSecretKeyText ? 'text' : 'password'}
              value={config.customApiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder={`Vložte váš ${activeProviderObj.name} API klíč...`}
              className="w-full bg-slate-900 border border-slate-700 text-white text-[11px] font-mono px-2.5 py-1.5 rounded-lg outline-none focus:border-amber-400 placeholder:text-slate-600"
            />
            <p className="text-[9px] text-slate-400 leading-snug">
              Ponechejte prázdné pro automatické použití systémového klíče ze serveru. Klíč zůstává uložen pouze ve vašem prohlížeči.
            </p>
          </div>
        )}

        {isSavedNotice && (
          <div className="text-[9px] text-teal-400 font-bold flex items-center gap-1 justify-end animate-fadeIn">
            <Check className="w-3 h-3" /> Uloženo
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-md space-y-5" id="ai-provider-selector-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 font-display flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            <span>Volba AI Poskytovatele a Modulu</span>
            {isSavedNotice && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-sans font-semibold flex items-center gap-1 animate-fadeIn">
                <Check className="w-3 h-3" /> Uloženo
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Vyberte preferovaný AI model (Google Gemini, OpenAI GPT nebo Anthropic Claude) a případně vložte váš vlastní klíč.
          </p>
        </div>

        {/* Current Active Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-mono shrink-0 border border-slate-800 shadow-2xs">
          {renderIcon(config.provider, "w-4 h-4")}
          <span>{activeProviderObj.name} ({config.model})</span>
        </div>
      </div>

      {/* Provider Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SUPPORTED_PROVIDERS.map((provider) => {
          const isSelected = config.provider === provider.id;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => handleProviderSelect(provider.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {renderIcon(provider.id, "w-5 h-5")}
                  <span>{provider.name}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-slate-200 text-slate-600'
                }`}>
                  {provider.badge}
                </span>
              </div>

              <p className={`text-xs leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                {provider.description}
              </p>

              <div className="pt-2 border-t border-slate-200/20 flex items-center justify-between text-[11px] font-mono">
                <span className={isSelected ? 'text-teal-400 font-bold' : 'text-slate-500'}>
                  {isSelected ? 'Aktivní poskytovatel' : 'Aktivovat'}
                </span>
                {isSelected && <Check className="w-4 h-4 text-teal-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Model select & Custom API Key row */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Model Dropdown */}
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>Vybraný model pro {activeProviderObj.name}:</span>
            </label>
            <div className="relative">
              <select
                value={config.model}
                onChange={(e) => handleModelSelect(e.target.value)}
                className="w-full bg-white text-slate-800 font-mono text-xs py-2 pl-3 pr-8 rounded-xl border border-slate-300 focus:border-indigo-600 outline-none appearance-none cursor-pointer shadow-2xs font-semibold"
              >
                {activeProviderObj.models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Toggle Custom Key Input */}
          <div className="sm:self-end">
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                config.customApiKey
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Key className="w-4 h-4 text-amber-600" />
              <span>{config.customApiKey ? 'Vlastní API klíč aktivní ✔' : '+ Vložit vlastní API klíč'}</span>
            </button>
          </div>

        </div>

        {/* Custom API Key Form Drawer */}
        {showKeyInput && (
          <div className="bg-white border border-amber-300 rounded-2xl p-4 space-y-3 animate-fadeIn shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Vlastní API klíč pro {activeProviderObj.name}</span>
              </label>

              <button
                type="button"
                onClick={() => setShowSecretKeyText(!showSecretKeyText)}
                className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-semibold"
              >
                {showSecretKeyText ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Skrýt
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Zobrazit
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type={showSecretKeyText ? 'text' : 'password'}
                value={config.customApiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder={`Vložte váš API klíč (např. sk-... / AIzaSy...)`}
                className="flex-1 bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white text-slate-900 font-mono text-xs px-3 py-2 rounded-xl outline-none"
              />
              {config.customApiKey && (
                <button
                  type="button"
                  onClick={() => handleApiKeyChange('')}
                  className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                >
                  Smazat
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-start gap-1.5 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Pokud pole ponecháte prázdné, systém automaticky použije výchozí bezpečný klíč ze serverového prostředí. Váš zadaný klíč se ukládá výhradně v paměti vašeho prohlížeče (localStorage).
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
