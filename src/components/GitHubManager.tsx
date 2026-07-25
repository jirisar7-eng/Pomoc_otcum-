/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GITHUB MANAGER - "Táta má právo" / Pomoc_otcum
 * Admin component to test, read, edit, and commit files directly to GitHub repo.
 */

import React, { useState, useEffect } from 'react';
import { 
  Github, GitBranch, FileText, CheckCircle, AlertTriangle, 
  RefreshCw, Save, FolderGit2, Sparkles, ExternalLink, Code
} from 'lucide-react';
import { fetchGitHubStatus, readGitHubFileClient, saveGitHubFileClient, GitHubStatus } from '../services/githubClientService';

export default function GitHubManager() {
  const [status, setStatus] = useState<GitHubStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  // File Reader / Writer State
  const [filePath, setFilePath] = useState<string>('README.md');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileSha, setFileSha] = useState<string | undefined>(undefined);
  const [commitMessage, setCommitMessage] = useState<string>('Aktualizace souboru přes vývojářský portál Táta má právo');
  
  const [isReading, setIsReading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const presets = [
    { label: 'README.md', path: 'README.md' },
    { label: 'metadata.json', path: 'metadata.json' },
    { label: 'package.json', path: 'package.json' },
    { label: 'Navigační data', path: 'src/data/navigationData.ts' },
    { label: 'Opatrovnické dokumenty (docs)', path: 'docs/categories/opatrovnictvi.md' }
  ];

  const refreshStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetchGitHubStatus();
      setStatus(res);
    } catch (err: any) {
      setStatus({ configured: false, repo: 'Pomoc-otcum/Pomoc_otcum', error: err.message });
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const handleReadFile = async (pathToRead?: string) => {
    const targetPath = pathToRead || filePath;
    if (!targetPath) return;

    setIsReading(true);
    setAlert(null);
    try {
      const res = await readGitHubFileClient(targetPath);
      if (res.success && res.content !== undefined) {
        setFileContent(res.content);
        setFileSha(res.sha);
        setAlert({ type: 'success', text: `Soubor "${targetPath}" byl úspěšně načten z GitHubu (SHA: ${res.sha?.slice(0, 7) || 'N/A'}).` });
      } else {
        setAlert({ type: 'error', text: `Chyba při načítání "${targetPath}": ${res.error || 'Neznámá chyba'}` });
      }
    } catch (err: any) {
      setAlert({ type: 'error', text: `Chyba při čtení souboru: ${err.message}` });
    } finally {
      setIsReading(false);
    }
  };

  const handleSaveFile = async () => {
    if (!filePath || fileContent === undefined) return;

    setIsSaving(true);
    setAlert(null);
    try {
      const res = await saveGitHubFileClient(
        filePath,
        fileContent,
        commitMessage || `Update ${filePath} from portal`,
        fileSha
      );

      if (res.success) {
        setAlert({ type: 'success', text: `Soubor "${filePath}" byl úspěšně uložen do repozitáře! Commit SHA: ${res.commitSha || 'N/A'}` });
        // Re-read file to update SHA
        handleReadFile(filePath);
      } else {
        setAlert({ type: 'error', text: `Chyba při ukládání: ${res.error || 'Neznámá chyba'}` });
      }
    } catch (err: any) {
      setAlert({ type: 'error', text: `Chyba při ukládání souboru: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Github className="w-48 h-48 text-teal-400" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-500/20 border border-teal-500/30 rounded-2xl text-teal-300">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display flex items-center gap-2">
                  GitHub Integrace & Sync
                  <span className="text-xs font-mono bg-teal-900/60 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-bold">
                    v1.0 REST API
                  </span>
                </h2>
                <p className="text-xs text-slate-300">
                  Přímé čtení a ukládání dokumentace, kategorií a zdrojového kódu do repozitáře <code className="text-teal-300 font-mono">Pomoc_otcum</code>.
                </p>
              </div>
            </div>

            <button
              onClick={refreshStatus}
              disabled={loadingStatus}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
              <span>Obnovit stav</span>
            </button>
          </div>

          {/* Connection Status Box */}
          <div className="pt-2">
            {loadingStatus ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
                <span>Ověřuji spojení s GitHub REST API...</span>
              </div>
            ) : status?.configured ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Připojeno k repozitáři:</strong> <code className="font-mono text-white">{status.repo}</code>
                    {status.user && <span> (Uživatel: <strong className="text-white">{status.user}</strong>)</span>}
                  </span>
                </div>
                <a 
                  href={`https://github.com/${status.repo}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-teal-300 hover:text-white flex items-center gap-1 font-mono font-bold text-[11px]"
                >
                  <span>Otevřít na GitHubu</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-2xl space-y-1 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>GITHUB_TOKEN není nastaven v Secrets!</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Pro čtení a zapisování dat do GitHub repozitáře nastavte klíč <code className="text-amber-200 font-mono">GITHUB_TOKEN</code> v nabídce <strong>Settings &gt; Secrets</strong> v AI Studiu.
                  Repozitář: <code className="font-mono text-white">{status?.repo || 'Pomoc-otcum/Pomoc_otcum'}</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Reader / Editor Workspace */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800 font-display">
              Práce se soubory v repozitáři
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Zadejte cestu k souboru v repozitáři a spusťte čtení nebo zápis
          </span>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-600">Rychlý výběr souboru:</span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setFilePath(p.path);
                  handleReadFile(p.path);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filePath === p.path 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Code className="w-3 h-3" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Alert message banner */}
        {alert && (
          <div className={`p-3.5 rounded-2xl border text-xs font-medium flex items-start gap-2.5 ${
            alert.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : alert.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            {alert.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
            <span className="leading-relaxed">{alert.text}</span>
          </div>
        )}

        {/* Path and Action controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Cesta k souboru (relative repository path):</label>
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="např. docs/categories/opatrovnictvi.md nebo package.json"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => handleReadFile()}
              disabled={isReading || !filePath}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReading ? 'animate-spin' : ''}`} />
              <span>{isReading ? 'Načítám...' : 'Načíst z GitHubu'}</span>
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              Obsah souboru:
            </label>
            {fileSha && (
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                SHA: {fileSha}
              </span>
            )}
          </div>

          <textarea
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            rows={12}
            placeholder="Zde se zobrazí načtený obsah z GitHubu, který můžete upravovat..."
            className="w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/50 leading-relaxed"
          />
        </div>

        {/* Commit message & Save button */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Zpráva k uložení (Commit message):</label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Popište provedenou změnu..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSaveFile}
              disabled={isSaving || !filePath || !fileContent}
              className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Ukládám do GitHubu...' : 'Uložit & Commitnout do GitHubu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
