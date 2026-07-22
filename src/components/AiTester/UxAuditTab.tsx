/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Eye, 
  Smartphone, 
  CheckCircle2, 
  MousePointer, 
  Sparkles, 
  Compass, 
  Layout, 
  FileText
} from 'lucide-react';
import { UxAuditPage } from '../../types/ai-tester';

interface UxAuditTabProps {
  pages: UxAuditPage[];
  onReRunUx: () => void;
  isAuditing: boolean;
}

export default function UxAuditTab({ pages, onReRunUx, isAuditing }: UxAuditTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60 mb-1">
              <Eye className="w-3.5 h-3.5 text-teal-600" />
              WCAG & Responsiveness Evaluator
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              6. UX & Accessibility Audit
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Hodnocení přehlednosti, čitelnosti, mobilní responzivity, přístupnosti podle standardu WCAG 2.1 AA a hloubky kliknutí pro každou klíčovou stránku.
            </p>
          </div>

          <button
            onClick={onReRunUx}
            disabled={isAuditing}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold font-display text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAuditing ? 'Přepočítávám UX...' : 'Přepočítat UX Skóre'}
          </button>
        </div>

        {/* Page Evaluation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((page) => (
            <div 
              key={page.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-400 transition-all space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                    <Layout className="w-4 h-4 text-teal-600" />
                    {page.pageName}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">{page.url}</span>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-teal-700 font-display">
                    {page.overallScore} %
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">UX Skóre</span>
                </div>
              </div>

              {/* Subscores Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Přehlednost:</span>
                  <strong className="text-teal-700">{page.scores.clarity} %</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Čitelnost:</span>
                  <strong className="text-teal-700">{page.scores.readability} %</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Responzivita:</span>
                  <strong className="text-teal-700">{page.scores.responsiveness} %</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">WCAG 2.1 AA:</span>
                  <strong className="text-emerald-700">{page.scores.accessibilityWcag} %</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Navigace:</span>
                  <strong className="text-teal-700">{page.scores.navigation} %</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Konzistence:</span>
                  <strong className="text-teal-700">{page.scores.designConsistency} %</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 bg-teal-50/50 p-2 rounded-lg border border-teal-100">
                <span className="flex items-center gap-1">
                  <MousePointer className="w-3.5 h-3.5 text-teal-600" />
                  Průměrný počet kliknutí k cílům: <strong>{page.clickDepth} kliknutí</strong>
                </span>
                <span className="text-emerald-700 font-bold">0 WCAG chyb</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">UX Doporučení & Silné stránky:</span>
                <ul className="text-[11px] text-slate-600 space-y-1 pl-3 list-disc">
                  {page.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
