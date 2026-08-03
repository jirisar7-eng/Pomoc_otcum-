/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Legal Compliance Admin Module & Versioning Management
 */

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Plus, 
  History, 
  FileCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  GitCompare, 
  Users, 
  Database, 
  Lock, 
  Trash2, 
  Sparkles, 
  FileText, 
  X, 
  CheckCircle2, 
  RefreshCw,
  Code
} from 'lucide-react';
import { 
  LegalDocument, 
  UserLegalAcceptance, 
  LegalAuditLogEntry, 
  LegalComplianceStats 
} from '../types/legal';
import legalComplianceService from '../services/legalComplianceService';
import { User } from '../types';

interface LegalComplianceAdminProps {
  currentUser: User | null;
}

export default function LegalComplianceAdmin({ currentUser }: LegalComplianceAdminProps) {
  const [activeTab, setActiveTab] = useState<'docs' | 'audit' | 'diff' | 'gdpr'>('docs');
  
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<LegalAuditLogEntry[]>([]);
  const [acceptances, setAcceptances] = useState<UserLegalAcceptance[]>([]);
  const [stats, setStats] = useState<LegalComplianceStats | null>(null);
  const [loading, setLoading] = useState(true);

  // New Version Modal State
  const [selectedDocForVersion, setSelectedDocForVersion] = useState<LegalDocument | null>(null);
  const [newVersionString, setNewVersionString] = useState('');
  const [newContentMarkdown, setNewContentMarkdown] = useState('');
  const [newChangelog, setNewChangelog] = useState('');

  // Diff State
  const [diffDocSlug, setDiffDocSlug] = useState<string>('terms-of-service');
  const [diffVerA, setDiffVerA] = useState<string>('');
  const [diffVerB, setDiffVerB] = useState<string>('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [gdprUserSearch, setGdprUserSearch] = useState('');
  const [gdprSearchResult, setGdprSearchResult] = useState<UserLegalAcceptance[]>([]);

  // Metadata Inspector Modal
  const [inspectedAudit, setInspectedAudit] = useState<LegalAuditLogEntry | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [docs, logs, accs, complianceStats] = await Promise.all([
        legalComplianceService.getLegalDocuments(),
        legalComplianceService.getLegalAuditLogs(),
        legalComplianceService.getAllAcceptances(),
        legalComplianceService.getComplianceStats()
      ]);

      setDocuments(docs);
      setAuditLogs(logs);
      setAcceptances(accs);
      setStats(complianceStats);

      if (docs.length > 0) {
        setDiffDocSlug(docs[0].slug);
      }
    } catch (e) {
      console.error('Failed to load Legal Admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewVersionModal = (doc: LegalDocument) => {
    setSelectedDocForVersion(doc);
    const parts = doc.version.split('.');
    const nextSub = parseInt(parts[1] || '0', 10) + 1;
    setNewVersionString(`${parts[0]}.${nextSub}`);
    setNewContentMarkdown(doc.content);
    setNewChangelog(`Aktualizace dokumentu na verzi ${parts[0]}.${nextSub}`);
  };

  const handlePublishVersion = async () => {
    if (!selectedDocForVersion || !currentUser) return;
    if (!newVersionString.trim() || !newContentMarkdown.trim()) {
      alert('Vyplňte verzi i obsah dokumentu.');
      return;
    }

    try {
      await legalComplianceService.publishNewDocumentVersion(
        {
          slug: selectedDocForVersion.slug,
          title: selectedDocForVersion.title,
          category: selectedDocForVersion.category,
          version: newVersionString,
          content: newContentMarkdown,
          isRequired: selectedDocForVersion.isRequired,
          changelog: newChangelog
        },
        currentUser.id
      );

      setSelectedDocForVersion(null);
      await loadAdminData();
      alert(`Nová verze ${newVersionString} byla úspěšně publikována!`);
    } catch (e) {
      console.error('Publish error:', e);
      alert('Chyba při publikaci nové verze.');
    }
  };

  const handleGdprSearch = () => {
    if (!gdprUserSearch.trim()) return;
    const term = gdprUserSearch.toLowerCase().trim();
    const results = acceptances.filter(
      a => (a.userId && a.userId.toLowerCase().includes(term)) ||
           (a.userEmail && a.userEmail.toLowerCase().includes(term)) ||
           (a.userName && a.userName.toLowerCase().includes(term))
    );
    setGdprSearchResult(results);
  };

  const handleGdprAnonymizeUser = async (userId: string) => {
    const confirm = window.confirm(
      `POZOR: Opravdu si přejete anonymizovat všechny právní záznamy uživatele ${userId}? Tato akce je nevratná podle Nařízení GDPR.`
    );
    if (!confirm) return;

    try {
      await legalComplianceService.anonymizeUserLegalData(userId);
      alert('Právní data uživatele byla anonymizována.');
      await loadAdminData();
      handleGdprSearch();
    } catch (e) {
      console.error('Anonymize error:', e);
      alert('Chyba při anonymizaci.');
    }
  };

  return (
    <div className="space-y-8" id="legal-compliance-admin">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/30 text-teal-300 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Administrátorský Modul • Synthesis OS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            Správa Právních Dokumentů & Audit
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Kompletní řízení životního cyklu právních dokumentů, verzování s SHA-256 hashi, auditování elektronických akceptací a správa GDPR požadavků.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
        >
          <RefreshCw className="w-4 h-4 text-teal-400" />
          <span>Obnovit data</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">Dokumenty v systému</span>
            <div className="text-2xl font-black text-slate-900 font-display">{stats.totalDocuments}</div>
            <p className="text-[11px] text-slate-400">Aktivní verze dokumentů</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-teal-600 uppercase">Celkem e-Akceptací</span>
            <div className="text-2xl font-black text-teal-700 font-display">{stats.totalAcceptances}</div>
            <p className="text-[11px] text-slate-400">Elektronicky potvrzené smlouvy</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Unikátní Uživatelé</span>
            <div className="text-2xl font-black text-emerald-700 font-display">{stats.activeUsersCompliantCount}</div>
            <p className="text-[11px] text-slate-400">S alespoň 1 akceptovanou smlouvou</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">Poslední Akceptace</span>
            <div className="text-sm font-bold text-slate-800 font-mono truncate">
              {stats.lastAcceptanceTimestamp ? new Date(stats.lastAcceptanceTimestamp).toLocaleDateString('cs-CZ') : 'Žádná'}
            </div>
            <p className="text-[11px] text-slate-400">Časové razítko</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'docs'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Dokumenty & Verzování</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log Akceptací ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'diff'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>Diff Viewer Porovnání</span>
        </button>

        <button
          onClick={() => setActiveTab('gdpr')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'gdpr'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>GDPR Správa Uživatelů</span>
        </button>
      </div>

      {/* TAB 1: DOCUMENTS & VERSIONING */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Všechny Právní Dokumenty & Aktivní Verze
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.filter(d => d.isActive).map(doc => (
              <div
                key={doc.id}
                className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 font-mono text-[10px] font-bold rounded-full border border-teal-200 uppercase">
                      {doc.category}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded-full">
                      v{doc.version}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display">{doc.title}</h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {doc.changelog || 'Iniciální verze dokumentu'}
                  </p>

                  <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-1">
                    <div>SHA-256: {doc.sha256Hash.substring(0, 20)}...</div>
                    <div>Účinnost od: {new Date(doc.effectiveFrom).toLocaleDateString('cs-CZ')}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400">Autor: {doc.createdBy}</span>
                  <button
                    onClick={() => handleOpenNewVersionModal(doc)}
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publikovat novou verzi</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Systémový Auditní Záznam (Audit Log)
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Hledat podle e-mailu..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Čas</th>
                  <th className="py-3 px-4">Uživatel</th>
                  <th className="py-3 px-4">Akce</th>
                  <th className="py-3 px-4">Dokument</th>
                  <th className="py-3 px-4">IP Adresa</th>
                  <th className="py-3 px-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs
                  .filter(a => !searchQuery || JSON.stringify(a).toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(log.timestamp).toLocaleString('cs-CZ')}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {log.userName || log.userEmail || log.userId}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          log.action === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          log.action === 'REVOKED' ? 'bg-rose-100 text-rose-800' :
                          'bg-teal-100 text-teal-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {log.documentSlug || log.documentId}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {log.ipAddress}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setInspectedAudit(log)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-mono cursor-pointer"
                        >
                          JSON
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DIFF VIEWER */}
      {activeTab === 'diff' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Porovnání Verzí Dokumentu (Diff Viewer)
            </h2>
            <p className="text-xs text-slate-500">
              Vyberte dokument pro zobrazení historických změn mezi verzemi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={diffDocSlug}
              onChange={e => setDiffDocSlug(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {documents.filter(d => d.isActive).map(d => (
                <option key={d.slug} value={d.slug}>{d.title}</option>
              ))}
            </select>
          </div>

          <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs overflow-x-auto space-y-2">
            <div className="text-teal-400 font-bold border-b border-slate-800 pb-2">
              /// Verze dokumentu: {diffDocSlug} (SHA-256 Verified)
            </div>
            {documents.filter(d => d.slug === diffDocSlug).map(v => (
              <div key={v.id} className="p-3 bg-slate-800/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-emerald-400 font-bold">Verze {v.version}</span>
                  <span className="text-[10px] text-slate-400">{new Date(v.createdAt).toLocaleDateString('cs-CZ')}</span>
                </div>
                <div className="text-[11px] text-slate-300">{v.changelog}</div>
                <div className="text-[10px] text-slate-500 truncate">Hash: {v.sha256Hash}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GDPR USER MANAGEMENT */}
      {activeTab === 'gdpr' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              GDPR Správa Souhlasů a Anonymizace ("Právo být zapomenut")
            </h2>
            <p className="text-xs text-slate-500">
              Vyhledejte uživatele podle e-mailu nebo ID pro zobrazení všech udělených souhlasů nebo provedení anonymizace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Zadejte e-mail nebo uživatelské ID..."
              value={gdprUserSearch}
              onChange={e => setGdprUserSearch(e.target.value)}
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleGdprSearch}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
            >
              Vyhledat
            </button>
          </div>

          {gdprSearchResult.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-slate-800">Nalezené souhlasy pro uživatele:</h3>
              {gdprSearchResult.map(res => (
                <div key={res.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-slate-900">{res.documentTitle} (v{res.acceptedVersion})</strong>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Uživatel: {res.userEmail} | Smlouva: {res.contractNumber} | Stav: {res.status}
                    </div>
                  </div>

                  <button
                    onClick={() => handleGdprAnonymizeUser(res.userId)}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Anonymizovat</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NEW VERSION MODAL */}
      {selectedDocForVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Publikovat novou verzi: {selectedDocForVersion.title}</h3>
              <button onClick={() => setSelectedDocForVersion(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Číslo nové verze:</label>
                <input
                  type="text"
                  value={newVersionString}
                  onChange={e => setNewVersionString(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Popis změn (Changelog):</label>
                <input
                  type="text"
                  value={newChangelog}
                  onChange={e => setNewChangelog(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Obsah dokumentu (Markdown):</label>
                <textarea
                  rows={10}
                  value={newContentMarkdown}
                  onChange={e => setNewContentMarkdown(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs leading-relaxed"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedDocForVersion(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Storno
              </button>
              <button
                onClick={handlePublishVersion}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Publikovat novou verzi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTED AUDIT METADATA MODAL */}
      {inspectedAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-teal-400 font-mono">JSON Audit Record Inspector</h3>
              <button onClick={() => setInspectedAudit(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-2xl text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800 max-h-96">
              {JSON.stringify(inspectedAudit, null, 2)}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectedAudit(null)}
                className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
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
