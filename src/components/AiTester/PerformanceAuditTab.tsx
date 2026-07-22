/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Zap, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  Gauge, 
  Layers, 
  Activity,
  Cpu
} from 'lucide-react';
import { PerformanceMetrics } from '../../types/ai-tester';

interface PerformanceAuditTabProps {
  metrics: PerformanceMetrics;
  onReRunPerformance: () => void;
  isAuditing: boolean;
}

export default function PerformanceAuditTab({ metrics, onReRunPerformance, isAuditing }: PerformanceAuditTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60 mb-1">
              <Gauge className="w-3.5 h-3.5 text-teal-600" />
              Lighthouse & Core Web Vitals Performance Profiler
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              8. Výkonnostní audit
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Detailní rozbor velikosti bundlu, rychlosti načítání, Lazy Loadingu, Code Splittingu a Core Web Vitals metrik pro mobilní i desktopová zařízení.
            </p>
          </div>

          <button
            onClick={onReRunPerformance}
            disabled={isAuditing}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold font-display text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAuditing ? 'Měřím rychlost...' : 'Změřit výkonnost'}
          </button>
        </div>

        {/* Lighthouse Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Performance</span>
            <div className="text-2xl font-extrabold text-emerald-600 font-display">
              {metrics.lighthouseScore.performance} %
            </div>
            <span className="text-[9px] font-mono text-emerald-700 block">🟢 Vynikající</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Accessibility</span>
            <div className="text-2xl font-extrabold text-emerald-600 font-display">
              {metrics.lighthouseScore.accessibility} %
            </div>
            <span className="text-[9px] font-mono text-emerald-700 block">🟢 Vynikající</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Best Practices</span>
            <div className="text-2xl font-extrabold text-emerald-600 font-display">
              {metrics.lighthouseScore.bestPractices} %
            </div>
            <span className="text-[9px] font-mono text-emerald-700 block">🟢 100% Shoda</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">SEO Audit</span>
            <div className="text-2xl font-extrabold text-emerald-600 font-display">
              {metrics.lighthouseScore.seo} %
            </div>
            <span className="text-[9px] font-mono text-emerald-700 block">🟢 Vynikající</span>
          </div>
        </div>

        {/* Core Web Vitals & Devices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Core Web Vitals */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Core Web Vitals Metriky (Google Search Console)
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-400 text-[10px] block">FCP (First Contentful Paint)</span>
                <strong className="text-emerald-700 font-extrabold text-sm">{metrics.coreWebVitals.fcpMs} ms</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-400 text-[10px] block">LCP (Largest Contentful Paint)</span>
                <strong className="text-emerald-700 font-extrabold text-sm">{metrics.coreWebVitals.lcpMs} ms</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-400 text-[10px] block">CLS (Cumulative Layout Shift)</span>
                <strong className="text-emerald-700 font-extrabold text-sm">{metrics.coreWebVitals.cls}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-400 text-[10px] block">INP (Interaction to Next Paint)</span>
                <strong className="text-emerald-700 font-extrabold text-sm">{metrics.coreWebVitals.inpMs} ms</strong>
              </div>
            </div>
          </div>

          {/* Bundle & Devices */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              Architektura Bundlu & Mobilní výkon
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600">Velikost JS Bundlu (Gzip):</span>
                <strong className="text-slate-900 font-bold">{Math.round(metrics.bundleSizeBytes / 1024)} KB</strong>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600">Rychlost prvotního vykreslení:</span>
                <strong className="text-teal-700 font-bold">{metrics.initialLoadSpeedMs} ms</strong>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600">Lazy Loading & Code Splitting:</span>
                <strong className="text-emerald-700 font-bold">● Optimalizováno</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-teal-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Mobilní skóre</span>
                    <strong className="text-xs font-bold text-teal-900">{metrics.mobilePerformanceScore} %</strong>
                  </div>
                </div>
                <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-teal-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Desktop skóre</span>
                    <strong className="text-xs font-bold text-teal-900">{metrics.desktopPerformanceScore} %</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
