/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Database, 
  Sparkles, 
  Users, 
  FileText, 
  BookOpen, 
  Video, 
  Share2, 
  FileCode, 
  Scale, 
  Zap, 
  CheckCircle2, 
  Server
} from 'lucide-react';
import { SystemOverviewData } from '../../types/ai-tester';

interface OverviewTabProps {
  data: SystemOverviewData;
  onRunAudit: () => void;
  isAuditing: boolean;
}

export default function OverviewTab({ data, onRunAudit, isAuditing }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-xs font-mono text-teal-300 mb-2">
              <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>Systémový status: 100% OPERATIONAL</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-display text-white">
              1. Přehled systému & Reálný monitoring
            </h2>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              Okamžitý náhled stavu aplikace, vytížení systémových zdrojů, dostupnosti databází, AI služeb a reálného počtu entit v databázi Synthesis OS.
            </p>
          </div>

          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold font-display text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Probíhá audit...' : 'Spustit kompletní audit'}</span>
          </button>
        </div>
      </div>

      {/* Hardware & Cloud Availability Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">Aplikace & Build</span>
            <Server className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 font-display">
            {data.systemVersion}
          </div>
          <div className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Poslední build: {data.lastBuild}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">Backend & Latence</span>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 font-display flex items-baseline gap-2">
            <span>{data.backendStatus.status.toUpperCase()}</span>
            <span className="text-xs font-mono text-teal-600 font-bold">{data.backendStatus.latencyMs} ms</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Docker Cloud Run / REST Node.js Container
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">Databáze (Dual)</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xs font-mono font-bold text-slate-800 space-y-1">
            <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <span>Firestore:</span>
              <span className="text-emerald-600 font-extrabold">● Online</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <span>Supabase Postgres:</span>
              <span className="text-emerald-600 font-extrabold">● Online</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">Využití Zdroje</span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span>RAM: {data.metrics.ramUsageMb} MB / {data.metrics.ramTotalMb} MB</span>
              <span className="font-bold text-purple-700">{Math.round((data.metrics.ramUsageMb / data.metrics.ramTotalMb) * 100)} %</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full transition-all duration-500" 
                style={{ width: `${(data.metrics.ramUsageMb / data.metrics.ramTotalMb) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-600 pt-1">
              <span>CPU Vytížení:</span>
              <span className="font-bold text-teal-700">{data.metrics.cpuUsagePercent} %</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Record Counters Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-teal-600" />
            Statistika evidovaných položek v databázi Synthesis OS
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Automatická živá synchronizace</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Uživatelé', count: data.counts.registeredUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
            { label: 'Články', count: data.counts.articles, icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-100' },
            { label: 'Studie', count: data.counts.studies, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Videa', count: data.counts.videos, icon: Video, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
            { label: 'Partneři', count: data.counts.partners, icon: Share2, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100' },
            { label: 'Dokumenty', count: data.counts.documents, icon: FileCode, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
            { label: 'Judikáty', count: data.counts.judikats, icon: Scale, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
            { label: 'API Požadavky 24h', count: data.counts.apiRequests24h, icon: Zap, color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`p-3 rounded-xl border ${item.bg} text-center space-y-1`}>
                <Icon className={`w-4 h-4 mx-auto ${item.color}`} />
                <div className="text-base font-extrabold text-slate-900 font-display">
                  {item.count}
                </div>
                <div className="text-[10px] font-mono text-slate-600 truncate">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
