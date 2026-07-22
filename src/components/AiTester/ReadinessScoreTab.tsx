/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Database, 
  FileText, 
  Sliders
} from 'lucide-react';
import { ReadinessScoreReport } from '../../types/ai-tester';

interface ReadinessScoreTabProps {
  report: ReadinessScoreReport;
  onRecalculate: () => void;
  isCalculating: boolean;
}

export default function ReadinessScoreTab({ report, onRecalculate, isCalculating }: ReadinessScoreTabProps) {
  const categoryLabels: Record<keyof ReadinessScoreReport['categories'], { label: string; icon: any }> = {
    funkcnost: { label: 'Funkčnost UI & Prvků', icon: CheckCircle2 },
    ux: { label: 'UX & Přístupnost WCAG', icon: Sparkles },
    vykon: { label: 'Výkon & Core Web Vitals', icon: Zap },
    bezpecnost: { label: 'Bezpečnost & RBAC', icon: ShieldCheck },
    seo: { label: 'SEO & Meta Tagy', icon: TrendingUp },
    databaze: { label: 'Databáze & Integrita', icon: Database },
    aiModuly: { label: 'AI Moduly (Gemini 3.5)', icon: Sparkles },
    api: { label: 'API & Integrace', icon: Sliders },
    obsah: { label: 'Kvalita Obsahu', icon: FileText },
    administrace: { label: 'Administrace & Audit', icon: Award }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-xs font-mono text-teal-300">
              <Award className="w-3.5 h-3.5 text-teal-400" />
              Aggregate Readiness Index v1.0
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-display text-white">
              10. Celkové Readiness Skóre Portálu
            </h2>
            <p className="text-slate-300 text-xs max-w-xl font-sans">
              Souhrnné hodnocení produkční připravenosti napříč 10 klíčovými dimenzemi.
            </p>
          </div>

          {/* Big Score Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-center min-w-[200px] shrink-0 space-y-1">
            <span className="text-[10px] font-mono text-teal-300 uppercase block tracking-wider">Celkové Skóre</span>
            <div className="text-4xl font-extrabold font-display text-white">
              {report.overallScore} %
            </div>
            <div className="inline-block px-3 py-0.5 bg-teal-400 text-slate-950 font-extrabold text-xs rounded-full font-mono">
              Známka: {report.grade}
            </div>
          </div>
        </div>
      </div>

      {/* 10 Dimensions Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 font-display">
            Rozpad hodnocení podle 10 dimenzí
          </h3>
          <button
            onClick={onRecalculate}
            disabled={isCalculating}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold font-display text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {isCalculating ? 'Přepočítávám...' : 'Přepočítat skóre'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(report.categories) as Array<keyof ReadinessScoreReport['categories']>).map((key) => {
            const score = report.categories[key];
            const info = categoryLabels[key];
            const Icon = info.icon;

            return (
              <div 
                key={key} 
                className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2"
              >
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 font-display">
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-teal-600" />
                    {info.label}
                  </span>
                  <span className="font-mono text-teal-700 text-sm">{score} %</span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-teal-600 h-full transition-all duration-500" 
                    style={{ width: `${score}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Release Summary */}
        <div className="p-4 bg-teal-50 rounded-xl border border-teal-200/80 space-y-1 text-xs text-teal-950 font-sans">
          <strong className="font-display font-bold block text-teal-900">Závěr auditora Gemini:</strong>
          <p className="leading-relaxed">{report.summaryText}</p>
        </div>
      </div>
    </div>
  );
}
