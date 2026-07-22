/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  History, 
  Download, 
  FileText, 
  FileCode, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { AuditHistoryRecord } from '../../types/ai-tester';
import { AiTesterService } from '../../services/aiTesterService';

interface AuditHistoryTabProps {
  records: AuditHistoryRecord[];
  onClearHistory?: () => void;
}

export default function AuditHistoryTab({ records, onClearHistory }: AuditHistoryTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60 mb-1">
              <History className="w-3.5 h-3.5 text-teal-600" />
              Audit Trail & Scheduled Run Logs
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              11. Historie auditů & Exporty
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Archív předchozích spuštění auditního systému, exporty do PDF/JSON/CSV a příprava na automatizované plánované denní/týdenní audity.
            </p>
          </div>

          <div className="text-right text-[11px] font-mono">
            <span className="text-slate-400 block">AUTOMATICKÝ PLÁN</span>
            <strong className="text-emerald-600 font-bold">Aktivní (Denně ve 03:00 UTC)</strong>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Zatím nebyl uložen žádný historický protokol. Po prvním kompletním auditu se zde objeví záznam.
            </div>
          ) : (
            records.map((rec) => (
              <div 
                key={rec.id}
                className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white hover:border-teal-400 transition-all shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                      ID: {rec.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {rec.date}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Verze: {rec.systemVersion}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    Protokol auditorské kontroly – Readiness Skóre {rec.overallScore} %
                  </h4>
                  <p className="text-xs text-slate-500 font-sans">
                    Nalezeno {rec.totalIssuesFound} nálezů, opraveno {rec.fixedIssuesCount} položek. Spustil: {rec.createdBy}
                  </p>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => AiTesterService.exportAudit(rec, 'pdf')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold font-display rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-600" />
                    <span>PDF Protokol</span>
                  </button>

                  <button
                    onClick={() => AiTesterService.exportAudit(rec, 'json')}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold font-display rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                    <span>JSON</span>
                  </button>

                  <button
                    onClick={() => AiTesterService.exportAudit(rec, 'csv')}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold font-display rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600" />
                    <span>CSV</span>
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
