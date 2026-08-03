/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Osobní pracovna / Dashboard Component
 * Tabular layout with Case Map (Mapa případu), My Progress (Můj postup), and Vault (Trezor).
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Compass, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  Scale, 
  ShieldCheck, 
  FolderLock, 
  FileText, 
  Calendar, 
  MapPin, 
  User as UserIcon, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  Clock, 
  Tag, 
  Trash2, 
  Lock, 
  FileCheck, 
  Eye, 
  CheckSquare, 
  BarChart3, 
  Building2, 
  X,
  Filter,
  Download,
  Share2
} from 'lucide-react';
import { User } from '../types';
import { 
  Case, 
  ActionPack, 
  ChecklistItem, 
  VaultEvidenceItem, 
  CaseTimelineEvent 
} from '../types/workspace';
import { workspaceService } from '../services/workspaceService';

interface PersonalWorkspaceProps {
  currentUser: User | null;
  setActiveTab: (tab: string) => void;
  onOpenAuth?: () => void;
}

export default function PersonalWorkspace({
  currentUser,
  setActiveTab,
  onOpenAuth
}: PersonalWorkspaceProps) {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'progress' | 'map' | 'vault'>('progress');
  
  // Data state
  const [loading, setLoading] = useState<boolean>(true);
  const [userCase, setUserCase] = useState<Case | null>(null);
  const [actionPack, setActionPack] = useState<ActionPack | null>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [vaultItems, setVaultItems] = useState<VaultEvidenceItem[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<CaseTimelineEvent[]>([]);

  // Modals state
  const [isEditCaseModalOpen, setIsEditCaseModalOpen] = useState<boolean>(false);
  const [isAddChecklistModalOpen, setIsAddChecklistModalOpen] = useState<boolean>(false);
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState<boolean>(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);

  // Edit Case Form state
  const [editChildName, setEditChildName] = useState<string>('');
  const [editCourtName, setEditCourtName] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');
  const [editCaseNumber, setEditCaseNumber] = useState<string>('');
  const [editJudgeName, setEditJudgeName] = useState<string>('');
  const [editOspodOfficer, setEditOspodOfficer] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Add Checklist Form state
  const [newChecklistTitle, setNewChecklistTitle] = useState<string>('');
  const [newChecklistDesc, setNewChecklistDesc] = useState<string>('');
  const [newChecklistCategory, setNewChecklistCategory] = useState<'housing' | 'evidence' | 'finance' | 'legal' | 'ospod' | 'coparenting'>('legal');
  const [newChecklistPriority, setNewChecklistPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Add Evidence Form state
  const [newEvidenceTitle, setNewEvidenceTitle] = useState<string>('');
  const [newEvidenceCategory, setNewEvidenceCategory] = useState<'pdf' | 'audio' | 'video' | 'screenshot' | 'email' | 'witness' | 'other'>('pdf');
  const [newEvidenceNotes, setNewEvidenceNotes] = useState<string>('');
  const [newEvidenceTags, setNewEvidenceTags] = useState<string>('Důkaz, Soudní spis');

  // Add Event Form state
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [newEventDate, setNewEventDate] = useState<string>('');
  const [newEventType, setNewEventType] = useState<'hearing' | 'filing' | 'ospod_visit' | 'incident' | 'milestone' | 'other'>('hearing');
  const [newEventNotes, setNewEventNotes] = useState<string>('');

  // Initial Load
  useEffect(() => {
    loadWorkspaceData();
  }, [currentUser]);

  const loadWorkspaceData = async () => {
    setLoading(true);
    try {
      const userId = currentUser?.id || 'demo-user-123';
      const fetchedCase = await workspaceService.getCaseForUser(userId);
      setUserCase(fetchedCase);

      if (fetchedCase) {
        // Populate edit modal defaults
        setEditChildName(fetchedCase.child_name || '');
        setEditCourtName(fetchedCase.court_name || 'Zatím nevybráno');
        setEditStatus(fetchedCase.status || 'Příprava sporu');
        setEditCaseNumber(fetchedCase.case_number || '');
        setEditJudgeName(fetchedCase.judge_name || '');
        setEditOspodOfficer(fetchedCase.ospod_officer || '');
        setEditNotes(fetchedCase.notes || '');

        // Fetch sub-collections
        const [items, pack, vault, timeline] = await Promise.all([
          workspaceService.getChecklistItems(fetchedCase.id, userId),
          workspaceService.getActionPack(fetchedCase.id, userId),
          workspaceService.getVaultEvidence(fetchedCase.id, userId),
          workspaceService.getCaseTimeline(fetchedCase.id, userId)
        ]);

        setChecklistItems(items);
        setActionPack(pack);
        setVaultItems(vault);
        setTimelineEvents(timeline);
      }
    } catch (err) {
      console.error('[PersonalWorkspace] Failed to load workspace data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Checklist Checkbox
  const handleToggleChecklist = async (itemId: string, currentStatus: boolean) => {
    if (!userCase || !currentUser) return;
    const userId = currentUser.id || 'demo-user-123';

    // Optimistic UI update
    setChecklistItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, is_completed: !currentStatus } : item)
    );

    await workspaceService.toggleChecklistItem(itemId, !currentStatus, userCase.id, userId);
  };

  // Save Case Settings
  const handleSaveCaseSettings = async () => {
    const userId = currentUser?.id || 'demo-user-123';
    try {
      const updated = await workspaceService.createOrUpdateCase({
        id: userCase?.id,
        user_id: userId,
        child_name: editChildName,
        court_name: editCourtName || 'Zatím nevybráno',
        status: editStatus || 'Příprava sporu',
        case_number: editCaseNumber,
        judge_name: editJudgeName,
        ospod_officer: editOspodOfficer,
        notes: editNotes
      });

      setUserCase(updated);
      setIsEditCaseModalOpen(false);

      // Reload checklist in case it was a new case creation
      const items = await workspaceService.getChecklistItems(updated.id, userId);
      setChecklistItems(items);
    } catch (e) {
      console.error('Error saving case settings:', e);
      alert('Chyba při ukládání nastavení případu.');
    }
  };

  // Handle Create Case From Empty State
  const handleCreateNewManualCase = async () => {
    const userId = currentUser?.id || 'demo-user-123';
    const newCase = await workspaceService.createOrUpdateCase({
      user_id: userId,
      child_name: 'Dítě A.',
      court_name: 'Zatím nevybráno',
      status: 'Příprava sporu',
      notes: 'Nově vytvořený případ v Osobní pracovně Synthesis OS.'
    });

    setUserCase(newCase);
    await loadWorkspaceData();
  };

  // Add Checklist Item
  const handleAddChecklistItem = async () => {
    if (!userCase || !newChecklistTitle.trim()) return;
    const userId = currentUser?.id || 'demo-user-123';

    const newItem = await workspaceService.addChecklistItem({
      case_id: userCase.id,
      user_id: userId,
      title: newChecklistTitle.trim(),
      description: newChecklistDesc.trim(),
      category: newChecklistCategory,
      priority: newChecklistPriority
    });

    setChecklistItems(prev => [...prev, newItem]);
    setNewChecklistTitle('');
    setNewChecklistDesc('');
    setIsAddChecklistModalOpen(false);
  };

  // Add Evidence Item
  const handleAddEvidenceItem = async () => {
    if (!userCase || !newEvidenceTitle.trim()) return;
    const userId = currentUser?.id || 'demo-user-123';

    const tagsArr = newEvidenceTags.split(',').map(t => t.trim()).filter(Boolean);

    const newItem = await workspaceService.addVaultEvidence({
      case_id: userCase.id,
      user_id: userId,
      title: newEvidenceTitle.trim(),
      category: newEvidenceCategory,
      notes: newEvidenceNotes.trim(),
      tags: tagsArr.length > 0 ? tagsArr : ['Důkaz', 'Dokument']
    });

    setVaultItems(prev => [newItem, ...prev]);
    setNewEvidenceTitle('');
    setNewEvidenceNotes('');
    setIsAddEvidenceModalOpen(false);
  };

  // Add Timeline Event
  const handleAddTimelineEvent = async () => {
    if (!userCase || !newEventTitle.trim() || !newEventDate) return;
    const userId = currentUser?.id || 'demo-user-123';

    const newEvt = await workspaceService.addCaseTimelineEvent({
      case_id: userCase.id,
      user_id: userId,
      title: newEventTitle.trim(),
      event_date: newEventDate,
      event_type: newEventType,
      notes: newEventNotes.trim()
    });

    setTimelineEvents(prev => [...prev, newEvt].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()));
    setNewEventTitle('');
    setNewEventNotes('');
    setNewEventDate('');
    setIsAddEventModalOpen(false);
  };

  // Checklist statistics
  const totalItemsCount = checklistItems.length;
  const completedItemsCount = checklistItems.filter(i => i.is_completed).length;
  const progressPercentage = totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-600">Načítám Osobní pracovnu Synthesis OS...</p>
      </div>
    );
  }

  // 1. ZERO STATE (When user has no case created yet)
  if (!userCase) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8" id="workspace-zero-state">
        <div className="bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50/60 border border-amber-200/80 rounded-3xl p-8 sm:p-12 shadow-lg text-center space-y-6 relative overflow-hidden">
          <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl mx-auto flex items-center justify-center shadow-md">
            <Compass className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-mono text-xs font-bold uppercase tracking-wider">
              Vítejte v Osobní Pracovně
            </span>

            <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
              Aktivujte Váš Osobní Plán Přípravy na Soud
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Zatím nemáte založený aktivní případ. Spusťte **Průvodce krizovou situací**, který na základě vašich odpovědí automaticky sestaví **Strategický Akční Plán**, vytvoří **Interaktivní Checklist** a zpřístupní **Trezor na Důkazy**.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('navigator')}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer group hover:scale-[1.02]"
            >
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              <span>Spustit Průvodce krizovou situací</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleCreateNewManualCase}
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-slate-600" />
              <span>Založit případ manuálně</span>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Kontrola připravenosti</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Strukturovaný 7-krokový checklist pro bezchybnou přípravu zázemí, podkladů a finančních přehledů.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Mapa Případu & Časová osa</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Přehledná chronologická mapa soudních jednání, návštěv OSPOD a lhůt pro podání vyjádření.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center font-bold">
              <FolderLock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Trezor na Důkazy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bezpečné kryptografické úložiště pro SMS, e-maily a nahrávky opatřené časovým razítkem a SHA-256 hashem.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. POPULATED STATE (Case exists)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="personal-workspace-container">
      
      {/* Top Banner: Nastavení kauzy - Můj případ */}
      <div className="bg-gradient-to-r from-stone-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Osobní Pracovna • Můj Případ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white flex items-center gap-3">
              <span>Kauza: {userCase.child_name ? `Péče o dítě ${userCase.child_name}` : 'Můj opatrovnický případ'}</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Aktivní řízení sporu, kontrola procesní připravenosti a chráněný trezor na důkazní materiál.
            </p>
          </div>

          <button
            onClick={() => setIsEditCaseModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer border border-emerald-400/30"
          >
            <Edit3 className="w-4 h-4" />
            <span>Upravit nastavení kauzy</span>
          </button>
        </div>

        {/* Case Info Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-800/80">
          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-400" />
              Příslušný soud
            </span>
            <div className="text-sm font-bold text-white font-display truncate">
              {userCase.court_name || 'Zatím nevybráno'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Scale className="w-3 h-3 text-amber-400" />
              Stav řízení
            </span>
            <div className="text-sm font-bold text-emerald-300 font-display truncate">
              {userCase.status || 'Příprava sporu'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3 h-3 text-teal-400" />
              Spisová značka
            </span>
            <div className="text-sm font-bold text-slate-200 font-mono truncate">
              {userCase.case_number || 'Zatím nepřiděleno'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <UserIcon className="w-3 h-3 text-sky-400" />
              OSPOD Opatrovník
            </span>
            <div className="text-sm font-bold text-slate-200 font-display truncate">
              {userCase.ospod_officer || 'Zatím neuvedeno'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Sub-Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveWorkspaceTab('progress')}
          className={`px-6 py-3.5 font-bold text-xs sm:text-sm rounded-t-2xl transition-all border-b-2 cursor-pointer flex items-center gap-2.5 ${
            activeWorkspaceTab === 'progress'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/70 shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-emerald-600" />
          <span>Můj postup ({completedItemsCount}/{totalItemsCount})</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('map')}
          className={`px-6 py-3.5 font-bold text-xs sm:text-sm rounded-t-2xl transition-all border-b-2 cursor-pointer flex items-center gap-2.5 ${
            activeWorkspaceTab === 'map'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/70 shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Mapa případu ({timelineEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('vault')}
          className={`px-6 py-3.5 font-bold text-xs sm:text-sm rounded-t-2xl transition-all border-b-2 cursor-pointer flex items-center gap-2.5 ${
            activeWorkspaceTab === 'vault'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/70 shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderLock className="w-4 h-4 text-emerald-600" />
          <span>Trezor ({vaultItems.length})</span>
        </button>
      </div>

      {/* TAB 1: MŮJ POSTUP (MY PROGRESS & INTERACTIVE CHECKLIST) */}
      {activeWorkspaceTab === 'progress' && (
        <div className="space-y-8">
          
          {/* Action Pack Strategy Summary Header */}
          {actionPack && (
            <div className="p-6 bg-gradient-to-br from-stone-50 to-amber-50/60 border border-amber-200/80 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm font-display">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Strategický Akční Plán • Gemini Synthesis AI</span>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-mono text-[10px] font-bold rounded-full border border-amber-200 uppercase">
                  Priorita: {actionPack.priority_level}
                </span>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {actionPack.strategy_summary}
              </p>
            </div>
          )}

          {/* Progress Bar Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Průvodce přípravou: Můj případ
                </h2>
                <p className="text-xs text-slate-500">
                  Splněno: <strong className="text-emerald-700">{completedItemsCount} z {totalItemsCount}</strong> kroků ({progressPercentage}%)
                </p>
              </div>

              <button
                onClick={() => setIsAddChecklistModalOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Přidat vlastní úkol</span>
              </button>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/60 p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Start přípravy</span>
                <span>100% Připravenost na jednání</span>
              </div>
            </div>
          </div>

          {/* Interactive Checklist List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display border-b border-slate-100 pb-3">
              Kontrolní seznam kroků (Checklist)
            </h3>

            <div className="space-y-3">
              {checklistItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id, item.is_completed)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    item.is_completed
                      ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-600'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs text-slate-900'
                  }`}
                >
                  <button
                    className={`mt-0.5 shrink-0 transition-colors ${
                      item.is_completed ? 'text-emerald-600' : 'text-slate-300 hover:text-emerald-500'
                    }`}
                  >
                    {item.is_completed ? (
                      <CheckCircle2 className="w-6 h-6 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-bold text-sm ${item.is_completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {idx + 1}. {item.title}
                      </span>

                      {item.priority === 'high' && (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-mono text-[10px] font-bold rounded">
                          Vysoká priorita
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className={`text-xs leading-relaxed ${item.is_completed ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MAPA PŘÍPADU (CASE MAP TIMELINE) */}
      {activeWorkspaceTab === 'map' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Mapa případu & Časová osa událostí
              </h2>
              <p className="text-xs text-slate-500">
                Chronologický přehled podání, jednání na OSPOD a soudních stání.
              </p>
            </div>

            <button
              onClick={() => setIsAddEventModalOpen(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Přidat událost do mapy</span>
            </button>
          </div>

          {timelineEvents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Zatím nebyly přidány žádné události.</p>
              <p className="text-xs text-slate-500">Klikněte na "Přidat událost do mapy" pro zaznamenání důležitých dat sporu.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-emerald-200 ml-4 pl-6 space-y-6">
              {timelineEvents.map((evt) => (
                <div key={evt.id} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded">
                        {evt.event_type.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(evt.event_date).toLocaleDateString('cs-CZ')}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">{evt.title}</h3>
                    {evt.notes && <p className="text-xs text-slate-600">{evt.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TREZOR (VAULT EVIDENCE STORAGE) */}
      {activeWorkspaceTab === 'vault' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                <span>Trezor na Důkazy & Podklady</span>
              </h2>
              <p className="text-xs text-slate-500">
                Šifrované úložiště podkladů opatřených SHA-256 kryptografickým otiskem.
              </p>
            </div>

            <button
              onClick={() => setIsAddEvidenceModalOpen(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Uložit nový důkaz do Trezoru</span>
            </button>
          </div>

          {vaultItems.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2">
              <FolderLock className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Trezor je aktuálně prázdný.</p>
              <p className="text-xs text-slate-500">Uložte e-maily, rozsudky nebo nahrávky pro jejich ochranu před soudním jednáním.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vaultItems.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-emerald-300 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-mono text-[10px] font-bold rounded uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.file_size || '1.2 MB'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                  {item.notes && <p className="text-xs text-slate-600">{item.notes}</p>}

                  <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-200 space-y-0.5">
                    <div className="truncate">SHA-256: {item.sha256_hash}</div>
                    <div>Datum záznamu: {item.date_recorded}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: EDIT CASE SETTINGS */}
      {isEditCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-base text-slate-900 font-display">
                Upravit nastavení kauzy
              </h3>
              <button onClick={() => setIsEditCaseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Jméno dítěte / dětí:</label>
                <input
                  type="text"
                  value={editChildName}
                  onChange={e => setEditChildName(e.target.value)}
                  placeholder="např. Maloletý Jan A."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Příslušný okresní soud:</label>
                <input
                  type="text"
                  value={editCourtName}
                  onChange={e => setEditCourtName(e.target.value)}
                  placeholder="např. Okresní soud v Olomouci"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Stav řízení:</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Příprava sporu">Příprava sporu</option>
                  <option value="Podán návrh k soudu">Podán návrh k soudu</option>
                  <option value="Vyjádření OSPOD">Vyjádření OSPOD</option>
                  <option value="Probíhá dokazování">Probíhá dokazování</option>
                  <option value="Soudní jednání nařízeno">Soudní jednání nařízeno</option>
                  <option value="Rozsudek vydán">Rozsudek vydán</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Spisová značka (číslo jednací):</label>
                <input
                  type="text"
                  value={editCaseNumber}
                  onChange={e => setEditCaseNumber(e.target.value)}
                  placeholder="např. 12 P 145/2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Jméno OSPOD opatrovníka:</label>
                <input
                  type="text"
                  value={editOspodOfficer}
                  onChange={e => setEditOspodOfficer(e.target.value)}
                  placeholder="např. Mgr. Eva Nováková (OSPOD Olomouc)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEditCaseModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Storno
              </button>
              <button
                onClick={handleSaveCaseSettings}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Uložit změny
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CHECKLIST ITEM */}
      {isAddChecklistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 font-display">Přidat nový úkol přípravy</h3>
              <button onClick={() => setIsAddChecklistModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Název úkolu:</label>
                <input
                  type="text"
                  value={newChecklistTitle}
                  onChange={e => setNewChecklistTitle(e.target.value)}
                  placeholder="např. Sepsat přehled příjmů"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailní popis / checklist:</label>
                <textarea
                  rows={3}
                  value={newChecklistDesc}
                  onChange={e => setNewChecklistDesc(e.target.value)}
                  placeholder="Bližší informace k provedení..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAddChecklistModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Storno
              </button>
              <button
                onClick={handleAddChecklistItem}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Přidat úkol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD VAULT EVIDENCE */}
      {isAddEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 font-display">Uložit nový důkaz do Trezoru</h3>
              <button onClick={() => setIsAddEvidenceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Název podkladu / důkazu:</label>
                <input
                  type="text"
                  value={newEvidenceTitle}
                  onChange={e => setNewEvidenceTitle(e.target.value)}
                  placeholder="např. Výpis e-mailové komunikace za Červenec"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Poznámka a kontext:</label>
                <textarea
                  rows={2}
                  value={newEvidenceNotes}
                  onChange={e => setNewEvidenceNotes(e.target.value)}
                  placeholder="Proč je tento důkaz důležitý..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAddEvidenceModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Storno
              </button>
              <button
                onClick={handleAddEvidenceItem}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Uložit důkaz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD TIMELINE EVENT */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 font-display">Přidat událost do Mapy případu</h3>
              <button onClick={() => setIsAddEventModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Název události:</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  placeholder="např. První jednání u OSPOD"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Datum události:</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={e => setNewEventDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Poznámka:</label>
                <textarea
                  rows={2}
                  value={newEventNotes}
                  onChange={e => setNewEventNotes(e.target.value)}
                  placeholder="Bližší informace k jednání..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAddEventModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Storno
              </button>
              <button
                onClick={handleAddTimelineEvent}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Přidat do mapy
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
