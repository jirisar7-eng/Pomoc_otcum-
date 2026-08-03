/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Legal Compliance Center Container
 */

import React, { useState } from 'react';
import { 
  Scale, 
  FileCheck, 
  ShieldCheck, 
  UserCheck, 
  Settings, 
  Sparkles, 
  FileText,
  AlertCircle
} from 'lucide-react';
import UserLegalDocumentsView from './UserLegalDocumentsView';
import LegalComplianceAdmin from './LegalComplianceAdmin';
import LegalAcceptanceModal from './LegalAcceptanceModal';
import Breadcrumbs from './Breadcrumbs';
import { User } from '../types';

interface LegalComplianceCenterProps {
  currentUser: User | null;
  setActiveTab?: (tab: string) => void;
  defaultSubTab?: 'my-docs' | 'admin';
}

export default function LegalComplianceCenter({
  currentUser,
  setActiveTab,
  defaultSubTab = 'my-docs'
}: LegalComplianceCenterProps) {
  const [subTab, setSubTab] = useState<'my-docs' | 'admin'>(defaultSubTab);
  const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="legal-compliance-center-container">
      
      {/* Breadcrumbs Navigation */}
      {setActiveTab && (
        <Breadcrumbs
          activeTab="legal-center"
          setActiveTab={setActiveTab}
        />
      )}

      {/* Top Header Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('my-docs')}
            className={`px-5 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              subTab === 'my-docs'
                ? 'border-teal-600 text-teal-700 bg-teal-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Moje akceptované dokumenty</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setSubTab('admin')}
              className={`px-5 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                subTab === 'admin'
                  ? 'border-teal-600 text-teal-700 bg-teal-50/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Správa dokumentů & Audit (Admin)</span>
            </button>
          )}
        </div>

        <button
          onClick={() => setIsAcceptanceModalOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Scale className="w-4 h-4" />
          <span>Otevřít Akceptační Průvodce</span>
        </button>
      </div>

      {/* View Content */}
      {subTab === 'my-docs' ? (
        <UserLegalDocumentsView
          currentUser={currentUser}
          onOpenAcceptanceModal={() => setIsAcceptanceModalOpen(true)}
        />
      ) : isAdmin ? (
        <LegalComplianceAdmin currentUser={currentUser} />
      ) : (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-800 space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-bold text-base">Prístup Omezen</h3>
          <p className="text-xs">Tato sekce je přístupná výhradně administrátorům systému Synthesis OS.</p>
        </div>
      )}

      {/* Stepper Acceptance Modal */}
      <LegalAcceptanceModal
        isOpen={isAcceptanceModalOpen}
        onClose={() => setIsAcceptanceModalOpen(false)}
        currentUser={currentUser}
        onAcceptanceComplete={() => {
          setIsAcceptanceModalOpen(false);
        }}
      />

    </div>
  );
}
