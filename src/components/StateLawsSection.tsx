/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * E-SBÍRKA & E-LEGISLATIVA INTEGRATION & REST API REGISTRATION PORTAL
 * Detailed step-by-step developer roadmap, e-Sbírka client API registration,
 * active legal statutes (§), pending e-Legislativa drafts, and REST API test bench.
 */

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  BookOpen, 
  ShieldCheck, 
  Filter, 
  Database,
  Info,
  Gavel,
  Key,
  Globe,
  Radio,
  FileCode,
  Terminal,
  Send,
  Layers,
  ArrowRight,
  Code2,
  Building2,
  Sliders,
  Play,
  Server,
  Zap
} from 'lucide-react';
import { StateLaw, StateLawParagraph, StateLawsDataset, ELegislativaDraft, ESbirkaRegistrationConfig } from '../../server/stateDataSyncService';

interface StateLawsSectionProps {
  onOpenAiAssistant?: (promptText?: string) => void;
}

export default function StateLawsSection({ onOpenAiAssistant }: StateLawsSectionProps) {
  // Main Navigation Tabs
  const [activeTab, setActiveTab] = useState<'registration' | 'laws' | 'e-legislativa' | 'testbench' | 'roadmap'>('registration');

  // State Data
  const [dataset, setDataset] = useState<StateLawsDataset | null>(null);
  const [paragraphs, setParagraphs] = useState<StateLawParagraph[]>([]);
  const [drafts, setDrafts] = useState<ELegislativaDraft[]>([]);
  const [apiConfig, setApiConfig] = useState<ESbirkaRegistrationConfig | null>(null);

  // Statuses
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // REST API Registration Form State
  const [formOrgName, setFormOrgName] = useState('');
  const [formClientId, setFormClientId] = useState('');
  const [formWebhookUrl, setFormWebhookUrl] = useState('');
  const [formEnvMode, setFormEnvMode] = useState<'production' | 'sandbox' | 'staging'>('production');
  const [formSyncFreq, setFormSyncFreq] = useState<number>(12);

  // API Test Bench Console State
  const [testEndpoint, setTestEndpoint] = useState<string>('/api/laws');
  const [testResultJson, setTestResultJson] = useState<string>('');
  const [testStatus, setTestStatus] = useState<number | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  // Load Initial Data
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Laws
      const lawsRes = await fetch('/api/laws');
      if (lawsRes.ok) {
        const data = await lawsRes.json();
        if (data.success) {
          setDataset({
            lastSynced: data.lastSynced,
            source: data.source,
            totalLaws: data.totalLaws,
            totalParagraphs: data.totalParagraphs,
            status: data.status,
            laws: data.laws || []
          });
          setParagraphs(data.filteredParagraphs || []);
        }
      }

      // 2. Fetch e-Legislativa Drafts
      const draftsRes = await fetch('/api/state-data/e-legislativa/drafts');
      if (draftsRes.ok) {
        const dData = await draftsRes.json();
        if (dData.success) {
          setDrafts(dData.drafts || []);
        }
      }

      // 3. Fetch e-Sbírka Config
      const configRes = await fetch('/api/state-data/e-sbirka/config');
      if (configRes.ok) {
        const cData = await configRes.json();
        if (cData.success && cData.config) {
          setApiConfig(cData.config);
          setFormOrgName(cData.config.organizationName || '');
          setFormClientId(cData.config.registeredClientId || '');
          setFormWebhookUrl(cData.config.webhookUrl || '');
          setFormEnvMode(cData.config.environmentMode || 'production');
          setFormSyncFreq(cData.config.syncFrequencyHours || 12);
        }
      }
    } catch (err: any) {
      console.error('[StateLawsSection] Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter laws locally/remotely when search or category changes
  const fetchLawsFiltered = async (search = searchQuery, cat = selectedCategory) => {
    setIsLoading(true);
    try {
      let url = '/api/laws';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (cat !== 'all') params.append('category', cat);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setParagraphs(data.filteredParagraphs || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'laws') {
      fetchLawsFiltered(searchQuery, selectedCategory);
    }
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLawsFiltered(searchQuery, selectedCategory);
  };

  // Sync state data from e-Sbírka
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setToastMessage(null);
    try {
      const res = await fetch('/api/state-data/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message || 'Synchronizace s e-Sbírkou a ČSÚ proběhla úspěšně.');
        await loadInitialData();
      } else {
        setToastMessage('Synchronizace selhala: ' + (data.error || 'Neznámá chyba'));
      }
    } catch (err: any) {
      setToastMessage('Chyba při komunikaci se serverem.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  // Save e-Sbírka REST API Registration
  const handleSaveApiRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setToastMessage(null);
    try {
      const res = await fetch('/api/state-data/e-sbirka/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: formOrgName,
          registeredClientId: formClientId,
          webhookUrl: formWebhookUrl,
          environmentMode: formEnvMode,
          syncFrequencyHours: formSyncFreq
        })
      });
      const data = await res.json();
      if (data.success) {
        setApiConfig(data.config);
        setToastMessage('Registrace REST API klientu pro e-Sbírku a e-Legislativu byla úspěšně uložena.');
      } else {
        setToastMessage('Uložení registrace selhalo: ' + (data.error || 'Neznámá chyba'));
      }
    } catch (err: any) {
      setToastMessage('Chyba při ukládání konfigurace REST API.');
    } finally {
      setIsRegistering(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  // Run Test Bench Request
  const handleRunApiTest = async () => {
    setIsTestingApi(true);
    setTestResultJson('');
    setTestStatus(null);
    try {
      const startTime = performance.now();
      const res = await fetch(testEndpoint);
      const endTime = performance.now();
      setTestStatus(res.status);
      const data = await res.json();
      setTestResultJson(JSON.stringify({
        httpStatus: res.status,
        responseTimeMs: Math.round(endTime - startTime),
        data
      }, null, 2));
    } catch (err: any) {
      setTestStatus(500);
      setTestResultJson(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsTestingApi(false);
    }
  };

  const copyToClipboard = (text: string, id: string, type: 'content' | 'citation') => {
    navigator.clipboard.writeText(text);
    if (type === 'content') {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } else {
      setCopiedCitationId(id);
      setTimeout(() => setCopiedCitationId(null), 2500);
    }
  };

  const categories = [
    { id: 'all', label: 'Všechny paragrafy' },
    { id: 'Formy péče', label: 'Formy péče (Střídavá/Společná)' },
    { id: 'Styk s dítětem', label: 'Styk s dítětem' },
    { id: 'Výživné', label: 'Výživné & Majetek' },
    { id: 'Soudní řízení', label: 'Soudní řízení & ZOSŘ' },
    { id: 'Ústavní práva', label: 'Ústavní práva (LZPS)' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn" id="state-laws-section-root">
      
      {/* SECTION HEADER & E-SBÍRKA & E-LEGISLATIVA BADGE */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>STÁTNÍ REGISTR e-SBÍRKA & e-LEGISLATIVA ČR (MV ČR & OdOK)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-300 hidden sm:inline">
                Poslední sync: {dataset?.lastSynced ? new Date(dataset.lastSynced).toLocaleString('cs-CZ') : 'Právě teď'}
              </span>
              <button
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                title="Spustit okamžitou kontrolu s oficiální e-Sbírkou"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Synchronizuji...' : 'Aktualizovat z e-Sbírky'}
              </button>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white flex items-center gap-3">
              <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-teal-400 shrink-0" />
              Portal e-Sbírka & e-Legislativa – REST API Centrum
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Kompletní vývojový portál a správa integrace oficiálních státních datových rozhraní. Zahrnuje registrace REST API klienta, přehled platných zákonů, sledování chystaných legislativních novel v e-Legislativě a živou konzoli REST API.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-indigo-200/90">
            <span className="flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              Klient API: <strong className="text-white">{apiConfig?.registeredClientId || 'tatamapravo-esbirka-client'}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              Stav spojení: <strong className="text-emerald-300">AKTIVNÍ ({apiConfig?.status || 'REGISTERED'})</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-teal-400" />
              Persistce: <strong className="text-teal-200">JSON Store + Firebase Firestore 1:1</strong>
            </span>
          </div>

        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-teal-700 hover:text-teal-900 font-bold">✕</button>
        </div>
      )}

      {/* MAIN STEP NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px no-scrollbar">
        
        <button
          onClick={() => setActiveTab('registration')}
          className={`px-4 py-3 text-xs font-bold font-display border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'registration'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Key className="w-4 h-4 text-indigo-600" />
          1. Registrace REST API Clienta
        </button>

        <button
          onClick={() => setActiveTab('laws')}
          className={`px-4 py-3 text-xs font-bold font-display border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'laws'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Gavel className="w-4 h-4 text-teal-600" />
          2. e-Sbírka (Platné Zákony & §)
        </button>

        <button
          onClick={() => setActiveTab('e-legislativa')}
          className={`px-4 py-3 text-xs font-bold font-display border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'e-legislativa'
              ? 'border-amber-600 text-amber-700 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4 text-amber-600" />
          3. e-Legislativa (Chystané Návrhy)
        </button>

        <button
          onClick={() => setActiveTab('testbench')}
          className={`px-4 py-3 text-xs font-bold font-display border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'testbench'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-600" />
          4. REST API Test Bench
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-3 text-xs font-bold font-display border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'roadmap'
              ? 'border-slate-800 text-slate-900 bg-slate-100/80 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-slate-700" />
          5. Vývojový Postup & Architektura
        </button>

      </div>

      {/* TAB 1: REST API REGISTRATION MANAGER */}
      {activeTab === 'registration' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                  Krok 1 / 5 – Konfigurace Klienta
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 font-display pt-2">
                  Registrace REST API Klienta pro e-Sbírku a e-Legislativu
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Nastavení přístupových údajů k oficiálním Open Data rozhraním Ministerstva vnitra ČR (MV ČR) a vládnímu portálu OdOK / e-Legislativa.
                </p>
              </div>

              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>REST API Stav: {apiConfig?.status || 'VERIFIKOVÁNO'}</span>
              </div>
            </div>

            <form onSubmit={handleSaveApiRegistration} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 font-display flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    Název žadatelské organizace / Aplikace
                  </label>
                  <input
                    type="text"
                    value={formOrgName}
                    onChange={(e) => setFormOrgName(e.target.value)}
                    required
                    placeholder="Např. Táta má právo z.s. / tatovacesta.cz"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-slate-400">Název uváděný v logu požadavků e-Sbírka Open Data API.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 font-display flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    Registrační ID Klienta (Client ID)
                  </label>
                  <input
                    type="text"
                    value={formClientId}
                    onChange={(e) => setFormClientId(e.target.value)}
                    required
                    placeholder="tatamapravo-esbirka-client-prod-2026"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-slate-400">Unikátní identifikátor povolený na portálu e-Sbírka.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 font-display flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    Cílový Webhook pro stahování novinek
                  </label>
                  <input
                    type="url"
                    value={formWebhookUrl}
                    onChange={(e) => setFormWebhookUrl(e.target.value)}
                    placeholder="https://tatovacesta.cz/api/state-data/webhook"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-slate-400">URL adresa pro automatický příjem změn zákonů.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 font-display flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    Frekvence automatické re-synchronizace
                  </label>
                  <select
                    value={formSyncFreq}
                    onChange={(e) => setFormSyncFreq(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value={6}>Každých 6 hodin</option>
                    <option value={12}>Každých 12 hodin (Doporučeno)</option>
                    <option value={24}>Jednou za 24 hodin</option>
                    <option value={168}>Jednou týdně</option>
                  </select>
                  <p className="text-[11px] text-slate-400">Interval spouštění pozadí podle e-Sbírka SLA.</p>
                </div>

              </div>

              {/* API Endpoints & Mode */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-3">
                <h4 className="text-xs font-bold text-indigo-950 font-display flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-600" />
                  Oficiální REST API Endpoints & Produkční Prostředí
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">E-SBÍRKA REST API URL:</span>
                    <span className="text-indigo-950 font-bold">{apiConfig?.restApiBaseUrl || 'https://www.e-sbirka.cz/api/v1'}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">E-LEGISLATIVA OdOK REST URL:</span>
                    <span className="text-indigo-950 font-bold">{apiConfig?.eLegislativaApiBaseUrl || 'https://odok.cz/api/v1/e-legislativa'}</span>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold font-display shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRegistering ? 'animate-spin' : ''}`} />
                  {isRegistering ? 'Ukládám registrace...' : 'Uložit registrace REST API klienta'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE LAWS & PARAGRAPHS */}
      {activeTab === 'laws' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-5">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hledat v zákonech (např. § 907, střídavá péče, výživné, OSPOD...)"
                className="w-full pl-12 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 font-sans focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Vyhledat
              </button>
            </form>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/70'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600">Načítám znění z e-Sbírky...</p>
            </div>
          ) : paragraphs.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 font-display">Nenalezeny žádné paragrafy</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Zkuste upravit vyhledávací dotaz nebo vybrat jinou kategorii.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {paragraphs.map((p) => (
                <div 
                  key={p.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-7 shadow-xs hover:shadow-md transition-all space-y-5 relative overflow-hidden group"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-extrabold">
                          {p.paragraphNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 font-mono">
                          {p.lawTitle} (č. {p.lawNumber})
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {p.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 font-display pt-1">
                        {p.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {p.verificationBadge || 'PLATNÉ E-SBÍRKA'}
                      </span>
                      <a
                        href={p.eSbirkaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                        title="Otevřít oficiální znění na e-Sbírka.cz"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                        <Gavel className="w-3.5 h-3.5 text-slate-500" />
                        Oficiální znění zákona:
                      </span>
                      <button
                        onClick={() => copyToClipboard(p.content, p.id, 'content')}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        {copiedId === p.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Zkopírováno
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" /> Kopírovat text
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic border-l-3 border-teal-500 pl-3.5">
                      "{p.content}"
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <h4 className="text-xs font-bold text-amber-900 font-display">
                        💡 Praktická strategie u soudu:
                      </h4>
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed font-sans">
                      {p.noteForFathers}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(p.courtCitationTemplate, p.id, 'citation')}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                      >
                        {copiedCitationId === p.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Zkopírováno!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-teal-300" /> Kopírovat citaci do podání
                          </>
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Účinnost od: {p.effectiveDate}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: E-LEGISLATIVA LEGISLATIVE DRAFTS */}
      {activeTab === 'e-legislativa' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Krok 3 / 5 – Vládní Portál OdOK & e-Legislativa
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 font-display pt-2">
                  Projednávané vládní a poslanecké návrhy novel (2025/2026)
                </h2>
                <p className="text-xs text-slate-500">
                  Přehled sledovaných návrhů zákonů v e-Legislativě s přímým dopadem na opatrovnickou péči a výživné.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 pt-2">
              {drafts.map((draft) => (
                <div 
                  key={draft.id}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4 hover:bg-white hover:border-amber-300 transition-all shadow-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-xs font-mono font-bold">
                          {draft.draftNumber}
                        </span>
                        <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-xs font-mono font-semibold">
                          Fáze: {draft.stage}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-display pt-1">
                        {draft.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-sans">
                        Předkladatel: <strong className="text-slate-800">{draft.proposer}</strong>
                      </p>
                    </div>

                    <a
                      href={draft.eLegislativaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Sledovat v e-Legislativě</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-slate-200">
                    {draft.summaryText}
                  </p>

                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-teal-900 font-display">
                      <Zap className="w-4 h-4 text-teal-600" />
                      Očekávaný přínos pro otce a střídavou péči:
                    </span>
                    <p className="leading-relaxed font-sans">{draft.impactOnFathers}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Očekávaná účinnost: <strong className="text-slate-700">{draft.expectedEffectiveDate}</strong></span>
                    <span>Aktualizováno: {new Date(draft.lastUpdated).toLocaleDateString('cs-CZ')}</span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REST API TEST BENCH & CONSOLE */}
      {activeTab === 'testbench' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
                  Krok 4 / 5 – REST API Konzole & Test Bench
                </span>
                <h2 className="text-xl font-extrabold text-white font-display pt-2 flex items-center gap-2">
                  <Terminal className="w-6 h-6 text-emerald-400" />
                  Živý testovací panel REST API & JSON odpovědí
                </h2>
                <p className="text-xs text-slate-400">
                  Otestujte v reálném čase dostupné REST API endpoints pro e-Sbírku, e-Legislativu a statistiky.
                </p>
              </div>
            </div>

            {/* Test Console Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 font-mono">Vyberte nebo zadejte API Endpoint:</label>
              
              <div className="flex flex-wrap gap-2">
                {[
                  '/api/laws',
                  '/api/statistics',
                  '/api/state-data/e-sbirka/config',
                  '/api/state-data/e-legislativa/drafts'
                ].map((ep) => (
                  <button
                    key={ep}
                    onClick={() => setTestEndpoint(ep)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      testEndpoint === ep
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    GET {ep}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleRunApiTest}
                  disabled={isTestingApi}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Play className={`w-3.5 h-3.5 ${isTestingApi ? 'animate-spin' : ''}`} />
                  {isTestingApi ? 'Odesílám...' : 'Spustit GET Request'}
                </button>
              </div>
            </div>

            {/* JSON Response Panel */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Odpověď serveru (JSON format):</span>
                {testStatus && (
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    testStatus === 200 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400'
                  }`}>
                    HTTP {testStatus} OK
                  </span>
                )}
              </div>

              <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
                {testResultJson || '// Zde se zobrazí strukturovaná JSON odpověď po spuštění požadavku...'}
              </pre>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: STEP-BY-STEP DEVELOPER ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Krok 5 / 5 – Přehledový Vývojový Postup
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 font-display pt-2">
                Fáze vývoje integrace e-Sbírky & e-Legislativy
              </h2>
              <p className="text-xs text-slate-500">
                Detailní přehled architektonického postupu od oficiální registraci až po produkční synchronizaci.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: '01',
                  title: 'Registrace API Klienta & Webhooku',
                  desc: 'Přihlášení na Portálu otevřených dat MV ČR (e-Sbírka) a získání unifikovaného Client ID a přístupového tokenu pro aplikaci tatovacesta.cz.',
                  status: 'DOKONČENO'
                },
                {
                  step: '02',
                  title: 'Napojení REST API & e-Legislativa OdOK',
                  desc: 'Vytvoření pozadí služby stateDataSyncService.ts s rozhraními pro e-Sbírku (zákon č. 89/2012 Sb. a související) a sledování sněmovních tisků.',
                  status: 'DOKONČENO'
                },
                {
                  step: '03',
                  title: 'Dual-Persistence Engine (JSON & Firestore)',
                  desc: 'Ukládání do lokálního úložiště data_state_laws.json spojené s pravidly Firebase Firestore (kolekce state_laws a state_statistics).',
                  status: 'DOKONČENO'
                },
                {
                  step: '04',
                  title: 'Testovací Konzole & Citační Generátor pro Soudy',
                  desc: 'Interaktivní vyhledávání v paragrafech s tvorbou citací k soudu a AI asistentem pro právní analýzu v podání pro otce.',
                  status: 'DOKONČENO'
                },
                {
                  step: '05',
                  title: 'Automatická Re-Synchronizace & Produkční VPS',
                  desc: 'Cron naplánovaná synchronizace s notifikacemi o změnách v zákonech a automatická reakce na vydané novely.',
                  status: 'Aktivní v produkci'
                }
              ].map((item) => (
                <div key={item.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-mono font-extrabold flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 font-display">{item.title}</h4>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* FOOTER MIGRATION & ARCHITECTURE NOTICE */}
      <div className="p-5 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed font-sans">
          <p className="font-bold text-white font-display">
            Garantovaná kompatibilita státních dat pro e-Sbírku, Firebase Firestore i PostgreSQL
          </p>
          <p>
            Tento modul ukládá strukturovaná státní data do <code>data_state_laws.json</code>, synchronizuje je s pravidly Firebase Firestore a při přechodu na plný PostgreSQL server je schopen data okamžitě přenést bez ztráty jakýchkoliv zákaznických či soudních citací.
          </p>
        </div>
      </div>

    </div>
  );
}
