/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - User Legal Documents View ("Moje Právní Dokumenty")
 */

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  FileCheck, 
  Download, 
  ShieldCheck, 
  Eye, 
  RotateCcw, 
  AlertCircle, 
  Calendar, 
  Hash, 
  Key, 
  FileText, 
  X,
  FileSpreadsheet,
  Trash2,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { UserLegalAcceptance, LegalDocument } from '../types/legal';
import legalComplianceService from '../services/legalComplianceService';
import { downloadLegalPdf } from '../services/legalPdfService';
import { User } from '../types';

interface UserLegalDocumentsViewProps {
  currentUser: User | null;
  onOpenAcceptanceModal?: () => void;
}

export default function UserLegalDocumentsView({
  currentUser,
  onOpenAcceptanceModal
}: UserLegalDocumentsViewProps) {
  const [userAcceptances, setUserAcceptances] = useState<UserLegalAcceptance[]>([]);
  const [allLegalDocs, setAllLegalDocs] = useState<LegalDocument[]>([]);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<{ doc: LegalDocument; acceptance?: UserLegalAcceptance } | null>(null);
  const [loading, setLoading] = useState(true);
  const [revokeSuccess, setRevokeSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      const docs = await legalComplianceService.getLegalDocuments();
      setAllLegalDocs(docs);

      if (currentUser) {
        const acceptances = await legalComplianceService.getUserAcceptances(currentUser.id);
        setUserAcceptances(acceptances);
      }
    } catch (e) {
      console.error('Failed to load user legal documents:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (acceptance: UserLegalAcceptance) => {
    const doc = allLegalDocs.find(d => d.slug === acceptance.documentSlug);
    if (!doc) return;

    await downloadLegalPdf({
      document: doc,
      acceptance,
      userFullName: currentUser?.name || acceptance.userName || 'Uživatel Synthesis OS',
      userEmail: currentUser?.email || acceptance.userEmail || 'user@tatovacesta.cz',
      userId: currentUser?.id || acceptance.userId
    });
  };

  const handleRevokeConsent = async (acceptanceId: string) => {
    if (!currentUser) return;
    const confirm = window.confirm(
      'Opravdu si přejete odvolat souhlas s tímto právním dokumentem? Odvolání může omezit některé funkce aplikace.'
    );
    if (!confirm) return;

    try {
      const ok = await legalComplianceService.revokeAcceptance(
        acceptanceId,
        currentUser.id,
        'Odvoláno uživatelem ze sekce Moje právní dokumenty'
      );
      if (ok) {
        setRevokeSuccess('Souhlas byl úspěšně odvolán.');
        setTimeout(() => setRevokeSuccess(null), 4000);
        await loadData();
      }
    } catch (e) {
      console.error('Revoke error:', e);
      alert('Chyba při odvolání souhlasu.');
    }
  };

  const handleExportGdprBundle = async () => {
    if (!currentUser) return;
    try {
      const data = await legalComplianceService.exportUserLegalData(currentUser.id);
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `GDPR_Legal_Consents_Export_${currentUser.id}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('GDPR Export error:', e);
      alert('Chyba při exportu GDPR dat.');
    }
  };

  return (
    <div className="space-y-8" id="user-legal-documents-view">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/30 text-teal-300 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Klientský Právní Portál • GDPR Compliance</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            Moje Akceptované Právní Dokumenty
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Přehled všech elektronicky akceptovaných smluv, zásad a kodexů v aplikaci Synthesis OS. Zde můžete stahovat oficiální PDF potvrzení, prohlížet auditní záznamy nebo spravovat své udělené souhlasy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full md:w-auto">
          <button
            onClick={handleExportGdprBundle}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            title="Exportovat všechny udělené souhlasy v souboru JSON podle Nařízení GDPR"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-400" />
            <span>GDPR Export Souhlasů</span>
          </button>

          {onOpenAcceptanceModal && (
            <button
              onClick={onOpenAcceptanceModal}
              className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>Provést novou akceptaci</span>
            </button>
          )}
        </div>
      </div>

      {revokeSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{revokeSuccess}</span>
        </div>
      )}

      {/* Main Legal Documents Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Elektronicky podepsané dokumenty ({userAcceptances.length})
            </h2>
          </div>

          <span className="text-xs font-mono text-slate-500">
            Účet: {currentUser?.email || 'Neznámý'}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm font-mono animate-pulse">
            Načítání právních dokumentů a auditních záznamů...
          </div>
        ) : userAcceptances.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-4">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">Zatím nemáte žádné uložené e-akceptace</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Při prvním vstupu nebo přihlášení do chráněných sekcí budete požádáni o schválení Podmínek užívání a GDPR.
              </p>
            </div>
            {onOpenAcceptanceModal && (
              <button
                onClick={onOpenAcceptanceModal}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>Otevřít akceptační průvodce</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {userAcceptances.map(acc => {
              const matchedDoc = allLegalDocs.find(d => d.slug === acc.documentSlug);
              return (
                <div
                  key={acc.id}
                  className="p-5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-2xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>PLATNÁ SMLOUVA</span>
                      </span>

                      <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded-full">
                        Smlouva č. {acc.contractNumber}
                      </span>

                      <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 font-mono text-[10px] font-bold rounded-full">
                        Verze {acc.acceptedVersion}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {acc.documentTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        Akceptováno: {new Date(acc.acceptedAt).toLocaleString('cs-CZ')}
                      </span>

                      <span className="flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-slate-400" />
                        IP: {acc.ipAddress}
                      </span>

                      <span className="flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        SHA-256: {acc.documentHash.substring(0, 12)}...
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                    <button
                      onClick={() => matchedDoc && setSelectedDocForPreview({ doc: matchedDoc, acceptance: acc })}
                      className="px-3 py-2 bg-white hover:bg-slate-200/80 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Zobrazit plný text a detaily e-podpisu"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>

                    <button
                      onClick={() => handleDownloadPdf(acc)}
                      className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={() => handleRevokeConsent(acc.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Odvolat souhlas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail / Full Text Preview Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="font-bold text-base text-white">{selectedDocForPreview.doc.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">Verze {selectedDocForPreview.doc.version} • {selectedDocForPreview.doc.category}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedDocForPreview.acceptance && (
              <div className="p-4 bg-teal-50/80 border-b border-teal-100 px-6 text-xs font-mono text-teal-900 flex flex-wrap items-center justify-between gap-2">
                <span>Smlouva ID: <strong>{selectedDocForPreview.acceptance.contractNumber}</strong></span>
                <span>Akceptoval: <strong>{selectedDocForPreview.acceptance.userName}</strong></span>
                <span>IP: <strong>{selectedDocForPreview.acceptance.ipAddress}</strong></span>
              </div>
            )}

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed font-sans text-slate-700">
              {selectedDocForPreview.doc.content.split('\n\n').map((p, idx) => (
                <p key={idx}>{p.replace(/^#+\s*/, '')}</p>
              ))}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-5 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-700"
              >
                Zavřít
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
