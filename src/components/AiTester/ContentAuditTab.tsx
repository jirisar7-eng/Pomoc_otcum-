/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileSearch, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Wrench, 
  MapPin, 
  FileText
} from 'lucide-react';
import { ContentAuditIssue } from '../../types/ai-tester';

interface ContentAuditTabProps {
  issues: ContentAuditIssue[];
  onApplyFix: (issueId: string) => void;
}

export default function ContentAuditTab({ issues, onApplyFix }: ContentAuditTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Gemini Public Content Scanner
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              5. AI Content Audit
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Automatické prohledávání celého veřejného portálu: detekce Lorem Ipsum, duplicit, placeholderů, nefunkčních médií a návrh konkrétních oprav.
            </p>
          </div>

          <div className="text-right text-[11px] font-mono">
            <span className="text-slate-400 block">STAV OBSAHU</span>
            <strong className="text-emerald-600 font-bold">100% Vyčištěno & Bez Lorem Ipsum</strong>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {issues.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-900 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold font-display text-sm">Žádné obsahové nedostatky nebyly nalezeny!</h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Veřejný portál neobsahuje žádný testovací text, Lorem Ipsum ani rozbité obrázky či nefunkční odkazy.
              </p>
            </div>
          ) : (
            issues.map((issue) => (
              <div 
                key={issue.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-teal-400 transition-all shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      {issue.typeLabel}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-display flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      {issue.pageUrl}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    Uložení: {issue.location}
                  </span>
                </div>

                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-800 font-display flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Popis problému:
                  </h5>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100 text-xs text-teal-950 space-y-1 font-sans">
                  <strong className="font-display font-bold block text-teal-900 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-teal-700" />
                    Gemini Navrhovaná oprava:
                  </strong>
                  <p className="font-mono text-[11px] text-teal-800">{issue.suggestedFix}</p>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onApplyFix(issue.id)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold font-display text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Aplikovat navrženou opravu</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
