/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Key, 
  ShieldAlert,
  Server,
  Terminal
} from 'lucide-react';
import { SecurityAuditItem } from '../../types/ai-tester';

interface SecurityAuditTabProps {
  items: SecurityAuditItem[];
  onReRunSecurity: () => void;
  isAuditing: boolean;
}

export default function SecurityAuditTab({ items, onReRunSecurity, isAuditing }: SecurityAuditTabProps) {
  const getStatusBadge = (status: SecurityAuditItem['status']) => {
    switch (status) {
      case 'passed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Schváleno (Passed)
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Doporučená úprava
          </span>
        );
      case 'vulnerable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Zranitelnost
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
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Automated Cybersecurity & Vulnerability Scanner
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              7. Bezpečnostní audit
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Automatizovaná kontrola RBAC rolí, oprávnění, veřejných endpointů, XSS, CSRF, CORS, Rate Limiting, API klíčů, env proměnných, OAuth a Passkeys.
            </p>
          </div>

          <button
            onClick={onReRunSecurity}
            disabled={isAuditing}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold font-display text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAuditing ? 'Skenuji zranitelnosti...' : 'Spustit bezpečnostní test'}
          </button>
        </div>

        {/* Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((sec) => (
            <div 
              key={sec.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-teal-400 transition-all shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <Lock className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-display">{sec.domain}</h4>
                    <span className="text-[10px] font-mono text-slate-400">Skóre: {sec.score} / 100</span>
                  </div>
                </div>

                {getStatusBadge(sec.status)}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-700 font-sans leading-relaxed">
                  {sec.details}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600 space-y-1">
                <div><strong>Bezpečnostní riziko:</strong> {sec.cveOrRisk}</div>
                <div><strong>Prevence & Náprava:</strong> {sec.remediation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
