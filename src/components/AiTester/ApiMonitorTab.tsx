/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Activity, 
  Server, 
  Key, 
  Database, 
  Lock, 
  Mail, 
  BarChart3, 
  Cloud, 
  Cpu
} from 'lucide-react';
import { ApiMonitorItem } from '../../types/ai-tester';

interface ApiMonitorTabProps {
  apis: ApiMonitorItem[];
  onRefreshAll: () => void;
  isRefreshing: boolean;
}

export default function ApiMonitorTab({ apis, onRefreshAll, isRefreshing }: ApiMonitorTabProps) {
  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Gemini API': return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'Supabase': return <Database className="w-4 h-4 text-emerald-600" />;
      case 'Firebase': return <Cloud className="w-4 h-4 text-amber-600" />;
      case 'Google OAuth': return <Key className="w-4 h-4 text-blue-600" />;
      case 'Passkeys': return <Lock className="w-4 h-4 text-teal-600" />;
      case 'Google Drive API': return <Cloud className="w-4 h-4 text-sky-600" />;
      case 'SMTP': return <Mail className="w-4 h-4 text-rose-600" />;
      case 'Analytics': return <BarChart3 className="w-4 h-4 text-indigo-600" />;
      case 'Storage': return <Server className="w-4 h-4 text-slate-700" />;
      case 'Cloud Functions': return <Zap className="w-4 h-4 text-amber-500" />;
      default: return <Activity className="w-4 h-4 text-teal-600" />;
    }
  };

  const getStatusBadge = (status: ApiMonitorItem['status']) => {
    switch (status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Operational
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Degraded
          </span>
        );
      case 'failing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Failing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60 mb-1">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              API Connectivity & Latency Monitor
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              3. API Monitor
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Průběžné měření latence a stavu 10 klíčových integrací a cloudových mikroslužeb.
            </p>
          </div>

          <button
            onClick={onRefreshAll}
            disabled={isRefreshing}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold font-display text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Přezkoušet všechna API</span>
          </button>
        </div>

        {/* API Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apis.map((api) => (
            <div 
              key={api.id}
              className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 hover:border-teal-400 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
                    {getServiceIcon(api.name)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-display">{api.name}</h4>
                    {api.endpoint && (
                      <span className="text-[10px] font-mono text-slate-400 block">{api.endpoint}</span>
                    )}
                  </div>
                </div>

                {getStatusBadge(api.status)}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                <span>Odezva (Latence): <strong className="text-teal-700">{api.latencyMs} ms</strong></span>
                <span>Kontrola: <strong>{api.lastChecked}</strong></span>
              </div>

              {api.lastError && (
                <div className="text-[11px] font-mono text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  <strong>Poslední chyba:</strong> {api.lastError}
                </div>
              )}

              <div className="text-xs text-slate-600 font-sans leading-relaxed pt-1 border-t border-slate-200/50">
                <strong className="font-display text-slate-800 font-semibold block text-[11px] mb-0.5">Doporučení & Diagnostika:</strong>
                <p className="text-[11px]">{api.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
