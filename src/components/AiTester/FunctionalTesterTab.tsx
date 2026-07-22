/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Filter, 
  Search, 
  Layers, 
  ChevronRight, 
  Sparkles,
  Info
} from 'lucide-react';
import { FunctionalTestItem, FunctionalStatus } from '../../types/ai-tester';

interface FunctionalTesterTabProps {
  tests: FunctionalTestItem[];
  onReRunTest: (testId: string) => void;
}

export default function FunctionalTesterTab({ tests, onReRunTest }: FunctionalTesterTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTestModal, setActiveTestModal] = useState<FunctionalTestItem | null>(null);

  const filteredTests = tests.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.target.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: FunctionalStatus) => {
    switch (status) {
      case 'functional':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            🟢 Funkční
          </span>
        );
      case 'requires_check':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            🟡 Vyžaduje kontrolu
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            🔴 Chyba
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Gemini UI Execution Engine
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              2. Funkční AI tester
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Automatizované testování reakce tlačítek, formulářů, kalkulaček, vyhledávačů, modálních oken a AI modulů.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right text-[11px] font-mono">
              <span className="text-slate-400 block">CELKEM PRVKŮ</span>
              <strong className="text-slate-900 font-bold">{tests.length} otestováno</strong>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Hledat prvek nebo komponentu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Všechny kategorie prvků</option>
              <option value="button">Tlačítka</option>
              <option value="link">Odkazy</option>
              <option value="form">Formuláře</option>
              <option value="modal">Modální okna</option>
              <option value="filter">Filtry</option>
              <option value="search">Vyhledávače</option>
              <option value="calculator">Kalkulačky</option>
              <option value="ai_tool">AI Nástroje</option>
              <option value="admin_func">Administrační funkce</option>
            </select>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Všechny stavy (🟢 🟡 🔴)</option>
              <option value="functional">🟢 Pouze Funkční</option>
              <option value="requires_check">🟡 Vyžaduje kontrolu</option>
              <option value="error">🔴 Pouze Chyby</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test List Table/Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredTests.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Nebyly nalezeny žádné prvky odpovídající zadaným filtrům.
            </div>
          ) : (
            filteredTests.map((test) => (
              <div 
                key={test.id}
                onClick={() => setActiveTestModal(test)}
                className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {test.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Target: {test.target}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                    <span>{test.name}</span>
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 font-sans">
                    {test.details}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-[10px] font-mono text-slate-400">
                    <div>Čas reakce: {test.executionTimeMs} ms</div>
                    <div>Testováno: {test.lastTested}</div>
                  </div>
                  {getStatusBadge(test.status)}
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {activeTestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  {activeTestModal.categoryLabel}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-display mt-1">
                  {activeTestModal.name}
                </h3>
              </div>
              {getStatusBadge(activeTestModal.status)}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs font-mono">
              <div className="text-slate-500">
                <strong>Cíl testování (Target):</strong> {activeTestModal.target}
              </div>
              <div className="text-slate-500">
                <strong>Čas reakce:</strong> {activeTestModal.executionTimeMs} ms
              </div>
              <div className="text-slate-500">
                <strong>Čas testu:</strong> {activeTestModal.lastTested}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 font-display flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                Detailní vyhodnocení od Gemini AI:
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans bg-teal-50/50 p-3 rounded-xl border border-teal-100/60">
                {activeTestModal.details}
              </p>
            </div>

            {activeTestModal.recommendedFix && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1 font-sans">
                <strong className="font-display font-bold block text-amber-950">Doporučená úprava:</strong>
                <p>{activeTestModal.recommendedFix}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onReRunTest(activeTestModal.id);
                  setActiveTestModal(null);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold font-display text-xs rounded-xl transition-colors cursor-pointer"
              >
                Opakovat test
              </button>
              <button
                onClick={() => setActiveTestModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-display text-xs rounded-xl transition-colors cursor-pointer"
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
