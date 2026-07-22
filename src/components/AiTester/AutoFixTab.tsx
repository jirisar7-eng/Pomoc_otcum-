/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  ArrowRight, 
  ShieldAlert, 
  Play, 
  Check, 
  Sparkles
} from 'lucide-react';
import { AutoFixPatch } from '../../types/ai-tester';

interface AutoFixTabProps {
  patches: AutoFixPatch[];
  onApplyPatch: (patchId: string) => void;
  onRejectPatch: (patchId: string) => void;
}

export default function AutoFixTab({ patches, onApplyPatch, onRejectPatch }: AutoFixTabProps) {
  const [confirmationPatch, setConfirmationPatch] = useState<AutoFixPatch | null>(null);

  const handleConfirmAction = (patch: AutoFixPatch) => {
    if (patch.isLegalContent) {
      // Require explicit admin modal confirmation for legal content
      setConfirmationPatch(patch);
    } else {
      onApplyPatch(patch.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Gemini Automated Patching & Diff Engine
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              9. Automatické opravy (Patch Engine)
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Gemini vygeneruje návrh opravy, připraví diff změny v kódu nebo konfiguraci a po vašem schválení aplikuje opravený patch.
            </p>
          </div>

          <div className="text-right text-[11px] font-mono">
            <span className="text-slate-400 block">BEZPEČNOSTNÍ POŽADAVEK</span>
            <strong className="text-rose-700 font-bold flex items-center gap-1 justify-end">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Právní obsah vyžaduje potvrdit
            </strong>
          </div>
        </div>

        {/* Patches List */}
        <div className="space-y-4">
          {patches.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold font-display text-sm">Všechny opravné patche byly aplikovány!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-sans">
                V systému nejsou žádné nezpracované opravné balíčky.
              </p>
            </div>
          ) : (
            patches.map((patch) => (
              <div 
                key={patch.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 hover:border-teal-400 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {patch.category.toUpperCase()}
                      </span>
                      {patch.isLegalContent && (
                        <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          Právní obsah – Vyžaduje schválení
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 font-display mt-1">
                      {patch.issueTitle}
                    </h4>
                  </div>

                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <FileCode className="w-3.5 h-3.5 text-teal-600" />
                    Cíl: {patch.targetFile}
                  </span>
                </div>

                {/* Diff Viewer */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                    <span>Srovnání kódu (Diff):</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Original */}
                    <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-1">
                      <span className="text-[10px] font-bold text-rose-900 block border-b border-rose-200/80 pb-1">Původní stav:</span>
                      <pre className="text-[11px] text-rose-950 whitespace-pre-wrap font-mono overflow-x-auto">
                        {patch.diff.originalCode}
                      </pre>
                    </div>

                    {/* Proposed */}
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-900 block border-b border-emerald-200/80 pb-1">Gemini Navrhovaný patch:</span>
                      <pre className="text-[11px] text-emerald-950 whitespace-pre-wrap font-mono overflow-x-auto">
                        {patch.diff.proposedCode}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onRejectPatch(patch.id)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-display text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Zamítnout
                  </button>
                  <button
                    onClick={() => handleConfirmAction(patch)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold font-display text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aplikovat patch & znovu spustit test</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal for Legal Content */}
      {confirmationPatch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-rose-600 border-b border-rose-100 pb-3">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">
                  Potvrzení opravy právního obsahu
                </h3>
                <span className="text-[10px] font-mono text-rose-700">Ochranný protokol Synthesis OS</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Tento opravný patch upravuje právní poučení nebo právní text v souboru <strong className="font-mono text-slate-900">{confirmationPatch.targetFile}</strong>.
              Dle bezpečnostních pravidel AI Testeru musí změnu právního obsahu výslovně potvrdit administrátor.
            </p>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 font-mono space-y-1">
              <strong>Změna:</strong> {confirmationPatch.issueTitle}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmationPatch(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-display text-xs rounded-xl transition-colors cursor-pointer"
              >
                Zrušit
              </button>
              <button
                onClick={() => {
                  onApplyPatch(confirmationPatch.id);
                  setConfirmationPatch(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold font-display text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Potvrzuji a aplikuji právní patch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
