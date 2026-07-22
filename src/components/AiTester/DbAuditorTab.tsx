/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Users, 
  BookOpen, 
  Video, 
  Share2, 
  FileCode, 
  Scale, 
  Camera, 
  Bell, 
  Activity,
  Layers
} from 'lucide-react';
import { DatabaseCollectionAudit, DbAuditStatus } from '../../types/ai-tester';

interface DbAuditorTabProps {
  collections: DatabaseCollectionAudit[];
  onRunDbCheck: () => void;
  isChecking: boolean;
}

export default function DbAuditorTab({ collections, onRunDbCheck, isChecking }: DbAuditorTabProps) {
  const getCollectionIcon = (name: string) => {
    switch (name) {
      case 'Users': return <Users className="w-4 h-4 text-indigo-600" />;
      case 'Articles': return <FileText className="w-4 h-4 text-teal-600" />;
      case 'Studies': return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'Videos': return <Video className="w-4 h-4 text-purple-600" />;
      case 'Documents': return <FileCode className="w-4 h-4 text-amber-600" />;
      case 'Partners': return <Share2 className="w-4 h-4 text-sky-600" />;
      case 'Forum': return <Layers className="w-4 h-4 text-blue-600" />;
      case 'Stories': return <BookOpen className="w-4 h-4 text-rose-600" />;
      case 'Rulings': return <Scale className="w-4 h-4 text-slate-700" />;
      case 'Evidence': return <Camera className="w-4 h-4 text-teal-600" />;
      case 'Notifications': return <Bell className="w-4 h-4 text-amber-500" />;
      case 'Audit Logs': return <Activity className="w-4 h-4 text-indigo-500" />;
      default: return <Database className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: DbAuditStatus) => {
    switch (status) {
      case 'clean':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            V pořádku
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Varování
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Kritický nález
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60 mb-1">
              <Database className="w-3.5 h-3.5 text-teal-600" />
              Database Integrity & Schema Auditor
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              4. Databázový auditor
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Hloubková kontrola 12 kolekcí databáze Synthesis OS: prázdné položky, duplicity, chybějící videa/obrázky a narušené vztahy.
            </p>
          </div>

          <button
            onClick={onRunDbCheck}
            disabled={isChecking}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold font-display text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {isChecking ? 'Skenuji databázi...' : 'Spustit re-audit kolekcí'}
          </button>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div 
              key={col.collectionName}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-teal-400 transition-all shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    {getCollectionIcon(col.collectionName)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-display">{col.collectionName}</h4>
                    <span className="text-[10px] font-mono text-slate-400 block">Změna: {col.lastChanged}</span>
                  </div>
                </div>

                {getStatusBadge(col.status)}
              </div>

              {/* Counts & Checks Table */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Záznamů:</span>
                  <strong className="text-slate-900">{col.recordCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Prázdné:</span>
                  <strong className={col.emptyFieldsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}>{col.emptyFieldsCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duplicity:</span>
                  <strong className={col.duplicateCount > 0 ? 'text-amber-600' : 'text-emerald-600'}>{col.duplicateCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chyb. obr:</span>
                  <strong className={col.missingImagesCount > 0 ? 'text-amber-600' : 'text-emerald-600'}>{col.missingImagesCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chyb. video:</span>
                  <strong className={col.missingVideosCount > 0 ? 'text-amber-600' : 'text-emerald-600'}>{col.missingVideosCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Neplat. rel:</span>
                  <strong className={col.brokenRelationsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}>{col.brokenRelationsCount}</strong>
                </div>
              </div>

              {col.issues.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-800 uppercase block">Nalezené výhrady:</span>
                  <ul className="text-[11px] text-slate-600 space-y-1 pl-3 list-disc">
                    {col.issues.map((iss, i) => (
                      <li key={i}>{iss}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
