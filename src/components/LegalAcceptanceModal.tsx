/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Electronic Legal Acceptance Stepper Modal
 */

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Download, 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle, 
  Sparkles, 
  X, 
  FileCheck,
  UserCheck
} from 'lucide-react';
import { LegalDocument, UserLegalAcceptance } from '../types/legal';
import legalComplianceService from '../services/legalComplianceService';
import { downloadLegalPdf } from '../services/legalPdfService';
import { User } from '../types';

interface LegalAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAcceptanceComplete?: () => void;
  isVolunteerRoleRequested?: boolean;
}

export default function LegalAcceptanceModal({
  isOpen,
  onClose,
  currentUser,
  onAcceptanceComplete,
  isVolunteerRoleRequested = false
}: LegalAcceptanceModalProps) {
  const [documentsToAccept, setDocumentsToAccept] = useState<LegalDocument[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [completedAcceptances, setCompletedAcceptances] = useState<{ acceptance: UserLegalAcceptance; pdfDataUrl: string }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadPendingDocuments();
    }
  }, [isOpen, currentUser, isVolunteerRoleRequested]);

  const loadPendingDocuments = async () => {
    setLoading(true);
    try {
      const allDocs = await legalComplianceService.getLegalDocuments();
      const userId = currentUser?.id || 'guest-user';
      const pending = await legalComplianceService.getPendingAcceptancesForUser(userId);

      // If volunteer role was requested, ensure volunteer contract and codex are included
      if (isVolunteerRoleRequested) {
        const volContract = allDocs.find(d => d.slug === 'volunteer-contract' && d.isActive);
        const volCodex = allDocs.find(d => d.slug === 'volunteer-codex' && d.isActive);
        
        if (volContract && !pending.some(p => p.slug === 'volunteer-contract')) {
          pending.push(volContract);
        }
        if (volCodex && !pending.some(p => p.slug === 'volunteer-codex')) {
          pending.push(volCodex);
        }
      }

      // If no pending, fallback to mandatory docs (Terms & GDPR)
      let docsToDisplay = pending;
      if (docsToDisplay.length === 0) {
        docsToDisplay = allDocs.filter(d => d.isActive && (d.slug === 'terms-of-service' || d.slug === 'privacy-policy'));
      }

      setDocumentsToAccept(docsToDisplay);
      setCurrentStep(0);
      setIsFinished(false);
      setCompletedAcceptances([]);
      
      // Reset checkbox states
      const initialStates: Record<string, boolean> = {};
      docsToDisplay.forEach(d => {
        initialStates[d.id] = false;
      });
      setCheckboxStates(initialStates);
    } catch (e) {
      console.error('Failed to load pending legal documents:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentDoc = documentsToAccept[currentStep];
  const isCurrentChecked = currentDoc ? !!checkboxStates[currentDoc.id] : false;

  const handleCheckboxToggle = (docId: string) => {
    setCheckboxStates(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const handleNextOrAccept = async () => {
    if (!currentDoc || !isCurrentChecked || !currentUser) return;

    setLoading(true);
    try {
      // Execute electronic acceptance
      const result = await legalComplianceService.acceptDocument({
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        documentSlug: currentDoc.slug,
        acceptedVersion: currentDoc.version,
        authProvider: currentUser.hasPasskey ? 'passkey' : currentUser.hasGoogle ? 'google' : 'password'
      });

      setCompletedAcceptances(prev => [...prev, result]);

      if (currentStep < documentsToAccept.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Finished all steps
        setIsFinished(true);
        if (onAcceptanceComplete) {
          onAcceptanceComplete();
        }
      }
    } catch (e) {
      console.error('Acceptance error:', e);
      alert('Chyba při ukládání akceptace. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (acc: UserLegalAcceptance, doc: LegalDocument) => {
    await downloadLegalPdf({
      document: doc,
      acceptance: acc,
      userFullName: currentUser?.name || 'Uživatel Synthesis OS',
      userEmail: currentUser?.email || 'user@tatovacesta.cz',
      userId: currentUser?.id || 'usr-1'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" id="legal-acceptance-modal">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded border border-teal-500/30 font-bold">
                  Compliance Center
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Synthesis OS v1.0
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-display">
                {isFinished ? 'Elektronická akceptace dokončena' : 'Vyžadována akceptace právních dokumentů'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zavřít okno"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {!isFinished && documentsToAccept.length > 1 && (
          <div className="px-6 py-3 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-teal-400 font-bold">Krok {currentStep + 1} z {documentsToAccept.length}:</span>
              <span className="text-slate-200 font-medium truncate max-w-[280px] sm:max-w-md">{currentDoc?.title}</span>
            </div>
            <div className="flex items-center gap-1">
              {documentsToAccept.map((doc, idx) => (
                <div
                  key={doc.id}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentStep
                      ? 'bg-teal-400 ring-2 ring-teal-400/40'
                      : idx < currentStep
                      ? 'bg-emerald-500'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isFinished ? (
            /* FINISHED STATE */
            <div className="text-center space-y-6 py-6 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white font-display">
                  Všechny dokumenty byly úspěšně elektronicky akceptovány!
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                  Vaše akceptace byla ověřena, opatřena časovým razítkem, SHA-256 kryptografickým hashem a zapsána do auditního záznamu Synthesis OS.
                </p>
              </div>

              {/* Completed PDFs Download Cards */}
              <div className="space-y-3 max-w-lg mx-auto pt-2 text-left">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Vygenerované elektronické smlouvy k okamžitému stažení:
                </h4>
                {completedAcceptances.map((item, idx) => {
                  const doc = documentsToAccept.find(d => d.slug === item.acceptance.documentSlug);
                  return (
                    <div
                      key={item.acceptance.id || idx}
                      className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl flex items-center justify-between gap-4 hover:border-teal-500/50 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <strong className="text-xs font-bold text-white">{item.acceptance.documentTitle}</strong>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
                          <span>Smlouva: {item.acceptance.contractNumber}</span>
                          <span>Verze: {item.acceptance.acceptedVersion}</span>
                        </div>
                      </div>

                      {doc && (
                        <button
                          onClick={() => handleDownloadPdf(item.acceptance, doc)}
                          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg cursor-pointer"
                >
                  Pokračovat do aplikace
                </button>
              </div>
            </div>
          ) : currentDoc ? (
            /* ACTIVE DOCUMENT ACCEPTANCE STEP */
            <div className="space-y-6">
              {/* Document Banner */}
              <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-2xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-teal-500/20 text-teal-300 rounded-lg text-xs font-mono font-bold uppercase border border-teal-500/30">
                    {currentDoc.category} • Verze {currentDoc.version}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    SHA-256: {currentDoc.sha256Hash.substring(0, 16)}...
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  {currentDoc.title}
                </h3>
              </div>

              {/* Document Text Paper Container */}
              <div className="bg-white text-slate-900 p-5 sm:p-7 rounded-2xl max-h-[320px] overflow-y-auto text-xs sm:text-sm leading-relaxed space-y-4 border border-slate-300 font-sans shadow-inner">
                {currentDoc.content.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-slate-800">
                    {paragraph.replace(/^#+\s*/, '')}
                  </p>
                ))}
              </div>

              {/* Active Checkbox Acceptance Box */}
              <div className="p-4 bg-teal-950/40 border border-teal-500/40 rounded-2xl space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isCurrentChecked}
                    onChange={() => handleCheckboxToggle(currentDoc.id)}
                    className="mt-1 w-5 h-5 text-teal-500 rounded border-slate-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <strong className="text-xs sm:text-sm font-bold text-white group-hover:text-teal-200 transition-colors block">
                      Potvrzení přečtení a výslovný souhlas (Mandatory E-Signature):
                    </strong>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Prohlašuji, že jsem si text dokumentu <strong>{currentDoc.title} (v{currentDoc.version})</strong> pozorně přečetl(a), všemu obsahu rozumím a bez výhrad jej elektronicky akceptuji v systému Synthesis OS.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        {!isFinished && (
          <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
            <div className="text-xs font-mono text-slate-400 hidden sm:block">
              Uživatel: <span className="text-teal-300 font-bold">{currentUser?.name || currentUser?.email || 'Neznámý'}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Storno
              </button>

              <button
                onClick={handleNextOrAccept}
                disabled={!isCurrentChecked || loading}
                className={`px-6 py-2.5 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                  isCurrentChecked && !loading
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/30'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                {loading ? (
                  <span>Zpracování e-podpisu...</span>
                ) : currentStep < documentsToAccept.length - 1 ? (
                  <>
                    <span>Další dokument</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Potvrdit a akceptovat s e-podpisem</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
