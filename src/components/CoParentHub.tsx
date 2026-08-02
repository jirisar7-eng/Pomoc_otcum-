/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Share2, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  Trash2, 
  Sparkles, 
  Lock, 
  Send, 
  Clock, 
  Link2, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  User, 
  RefreshCw,
  Bell,
  Heart,
  CalendarDays,
  FileText,
  HeartHandshake,
  Shield,
  Copy,
  RotateCcw,
  Key,
  LogOut,
  Zap
} from 'lucide-react';
import { 
  User as AppUser, 
  CoparentConnection, 
  CoparentCalendarEvent, 
  CoparentDiaryEntry, 
  CoparentChatMessage,
  CalendarEventCategory,
  DiaryEntryType
} from '../types';
import { db, auth, getCachedAccessToken, authorizeGoogleWorkspace } from '../lib/firebase';
import { createGoogleCalendarEvent, sendGmailNotification } from '../lib/googleWorkspace';
import { AIAdminClient } from '../lib/ai-admin/client';
import { formatCzechDate } from '../utils';
import { doc, getDoc } from 'firebase/firestore';
import { CoParentingProvider, useCoParenting } from '../context/CoParentingContext';

interface CoParentHubProps {
  currentUser: AppUser | null;
  onOpenAuth: () => void;
}

function CoParentHubContent({ currentUser, onOpenAuth }: CoParentHubProps) {
  const {
    connection,
    loadingConnection,
    usingFallback,
    events,
    diaryEntries,
    messages,
    actionLoading,
    connectingError,
    connectingSuccess,
    copiedKey,
    showResetConfirm,
    setConnectingError,
    setConnectingSuccess,
    setShowResetConfirm,
    handleCopyKey,
    handleCreateSpace,
    handleJoinSpace,
    handleDisconnectOrReset,
    handleAddCalendarEvent,
    handleDeleteEvent,
    handleAddDiaryEntry,
    handleUpdateEntryStatus,
    handleDeleteDiaryEntry,
    handleSendMessage,
    retryOnlineSync
  } = useCoParenting();

  // Local Form Inputs
  const [inviteInput, setInviteInput] = useState<string>('');
  const [childrenInput, setChildrenInput] = useState<string>('');

  // Hub Active Tab
  const [hubTab, setHubTab] = useState<'calendar' | 'diary' | 'chat' | 'biff-coach'>('calendar');

  // BIFF Assistant States
  const [biffInput, setBiffInput] = useState<string>('');
  const [biffLoading, setBiffLoading] = useState<boolean>(false);
  const [biffResult, setBiffResult] = useState<{ biffAnalysis: string, biffRewritten: string, courtWarning: string } | null>(null);
  const [biffError, setBiffError] = useState<string>('');

  // Sub-forms for Calendar
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDesc, setEventDesc] = useState<string>('');
  const [eventStart, setEventStart] = useState<string>('');
  const [eventEnd, setEventEnd] = useState<string>('');
  const [eventCategory, setEventCategory] = useState<CalendarEventCategory>('handover');
  const [eventGmailSync, setEventGmailSync] = useState<boolean>(false);

  // Sub-forms for Diary
  const [diaryFormOpen, setDiaryFormOpen] = useState<boolean>(false);
  const [diaryTitle, setDiaryTitle] = useState<string>('');
  const [diaryContent, setDiaryContent] = useState<string>('');
  const [diaryType, setDiaryType] = useState<DiaryEntryType>('note');
  const [diaryDate, setDiaryDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [diaryImportant, setDiaryImportant] = useState<boolean>(false);

  // Chat message input
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [googleToken, setGoogleToken] = useState<string | null>(getCachedAccessToken());

  // Chat scroll container reference
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const tok = getCachedAccessToken();
      setGoogleToken((prev) => (prev !== tok ? tok : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hubTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hubTab]);

  // Handlers
  const handleCreateSpaceSubmit = () => {
    handleCreateSpace();
  };

  const handleJoinSpaceSubmit = () => {
    handleJoinSpace(inviteInput);
  };

  const handleAddCalendarEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !connection) return;
    if (!eventTitle.trim() || !eventStart || !eventEnd) return;

    let isGmailSynced = eventGmailSync;
    let currentToken = getCachedAccessToken();
    if (eventGmailSync && !currentToken) {
      const wantConnect = window.confirm(
        'K synchronizaci s Gmailem a Google Kalendářem je nutné se bezpečně propojit s vaším Google účtem.\n\nChcete se nyní propojit?'
      );
      if (wantConnect) {
        try {
          currentToken = await authorizeGoogleWorkspace();
        } catch (authErr: any) {
          console.error('Google authorization failed:', authErr);
          alert('Propojení s Google účtem bylo zrušeno nebo selhalo. Událost se uloží bez synchronizace.');
          isGmailSynced = false;
        }
      } else {
        isGmailSynced = false;
      }
    }

    if (isGmailSynced && currentToken) {
      try {
        await createGoogleCalendarEvent(currentToken, {
          title: eventTitle.trim(),
          description: `${eventDesc.trim()}\n\n(Synchronizováno ze systému Synthesis OS - Rodičovský Hub pro děti: ${connection.children.join(', ')})`,
          startDate: eventStart,
          endDate: eventEnd,
        });

        const otherParentId = connection.parent1Id === currentUser.id ? connection.parent2Id : connection.parent1Id;
        if (otherParentId) {
          const otherUserRef = doc(db, 'users', otherParentId);
          const otherUserSnap = await getDoc(otherUserRef);
          if (otherUserSnap.exists()) {
            const otherUser = otherUserSnap.data();
            if (otherUser.email) {
              const emailSubject = `Nová rodičovská událost: ${eventTitle.trim()}`;
              const emailBody = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                  <h2 style="color: #0d9488; margin-top: 0;">Rodičovský Hub — Synthesis OS</h2>
                  <p>Ahoj ${otherUser.name || 'rodiči'},</p>
                  <p><strong>${currentUser.name}</strong> přidal novou událost do vašeho společného kalendáře pro děti <strong>${connection.children.join(', ')}</strong>:</p>
                  <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #0d9488; border-radius: 4px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">${eventTitle.trim()}</h3>
                    <p style="margin: 5px 0; font-size: 14px; color: #475569;"><strong>Začátek:</strong> ${new Date(eventStart).toLocaleString('cs-CZ')}</p>
                    <p style="margin: 5px 0; font-size: 14px; color: #475569;"><strong>Konec:</strong> ${new Date(eventEnd).toLocaleString('cs-CZ')}</p>
                  </div>
                </div>
              `;
              await sendGmailNotification(currentToken, otherUser.email, emailSubject, emailBody);
            }
          }
        }
      } catch (googleApiErr: any) {
        console.error('Failed to sync to Google APIs:', googleApiErr);
        alert(`Událost byla uložena, ale nepodařilo se ji synchronizovat s Google API: ${googleApiErr.message || googleApiErr}`);
      }
    }

    const ok = await handleAddCalendarEvent({
      title: eventTitle.trim(),
      description: eventDesc.trim(),
      startDate: eventStart,
      endDate: eventEnd,
      category: eventCategory,
      creatorId: currentUser.id,
      gmailSynced: isGmailSynced
    });

    if (ok) {
      setEventTitle('');
      setEventDesc('');
      setEventStart('');
      setEventEnd('');
      setEventCategory('handover');
      setEventGmailSync(false);
      setEventFormOpen(false);
    }
  };

  const handleAddDiaryEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !connection) return;
    if (!diaryTitle.trim() || !diaryContent.trim()) return;

    const ok = await handleAddDiaryEntry({
      title: diaryTitle.trim(),
      content: diaryContent.trim(),
      type: diaryType,
      date: diaryDate,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      isImportant: diaryImportant,
      status: diaryType === 'request' ? 'pending' : undefined
    });

    if (ok) {
      setDiaryTitle('');
      setDiaryContent('');
      setDiaryType('note');
      setDiaryImportant(false);
      setDiaryFormOpen(false);
    }
  };

  const handleSendMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    const txt = newMessageText;
    setNewMessageText('');
    await handleSendMessage(txt);
  };

  const handleBiffRewrite = async () => {
    if (!biffInput.trim()) return;
    setBiffLoading(true);
    setBiffError('');
    setBiffResult(null);
    try {
      const res = await AIAdminClient.execute('REWRITE_BIFF', { text: biffInput });
      if (res.success && res.data) {
        setBiffResult(res.data);
      } else {
        throw new Error(res.error || 'Chyba při přepisování zprávy.');
      }
    } catch (err: any) {
      console.error('Failed to rewrite message via BIFF:', err);
      setBiffError('Nepodařilo se zanalyzovat zprávu. Zkontrolujte připojení nebo zkuste to znovu.');
    } finally {
      setBiffLoading(false);
    }
  };

  const getCategoryName = (cat: CalendarEventCategory) => {
    switch (cat) {
      case 'handover': return 'Předání dětí';
      case 'school': return 'Škola / Kroužky';
      case 'health': return 'Lékař / Zdraví';
      case 'leisure': return 'Volný čas / Výlety';
      default: return 'Ostatní';
    }
  };

  const getCategoryStyles = (cat: CalendarEventCategory) => {
    switch (cat) {
      case 'handover': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'school': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'health': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'leisure': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getDiaryTypeName = (type: DiaryEntryType) => {
    switch (type) {
      case 'note': return 'Poznámka';
      case 'reminder': return 'Připomínka';
      case 'request': return 'Požadavek (Ke schválení)';
      case 'health_log': return 'Zdravotní záznam';
      case 'school_log': return 'Škola / Vývoj';
    }
  };

  const getDiaryTypeStyles = (type: DiaryEntryType) => {
    switch (type) {
      case 'note': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'reminder': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'request': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'health_log': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'school_log': return 'bg-teal-50 text-teal-700 border-teal-100';
    }
  };

  // Case 1: Unauthenticated
  if (!currentUser) {
    return (
      <div className="w-full bg-slate-50 rounded-3xl border border-slate-200/60 p-8 sm:p-12 text-center" id="coparent-unauth">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mx-auto mb-6 shadow-md shadow-teal-50">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 font-display mb-3">Zabezpečený Rodičovský Hub</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Společný rodičovský prostor pro koordinaci střídavé péče, sdílení dětského deníku, kalendáře a bezpečné komunikace vyžaduje přihlášení. Vaše soukromí a citlivá data dětí jsou pod plnou kontrolou.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-100 transition-all cursor-pointer transform active:scale-95"
            id="coparent-btn-login"
          >
            Přihlásit se / Registrovat
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Loading State (capped strictly to <2s by CoParentingContext)
  if (loadingConnection) {
    return (
      <div className="w-full min-h-[400px] bg-slate-50 rounded-3xl border border-slate-200/60 flex flex-col items-center justify-center gap-4" id="coparent-loading">
        <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
        <span className="text-slate-500 text-xs font-semibold font-mono tracking-wider uppercase">Načítám Rodičovské Spojení...</span>
      </div>
    );
  }

  // Case 3: No Connection setup yet (Onboarding)
  if (!connection) {
    return (
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden" id="coparent-onboarding">
        <div className="bg-slate-900 px-6 py-12 text-center text-white relative">
          <div className="absolute inset-0 bg-radial from-teal-500/20 to-transparent opacity-40"></div>
          <div className="relative max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 rounded-full border border-teal-500/20 text-teal-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Synthesis OS: Autonomní Kooperace</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-display text-white mb-3">
              Vytvořit Společný Rodičovský Prostor
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Zajistěte svým dětem stabilní prostředí a předejděte zbytečným konfliktům. Spojte se s druhým rodičem do šifrovaného, synchronního prostoru pro organizaci péče.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Action A: Create Space */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/50 p-6 flex flex-col justify-between" id="onboard-create-space">
            <div>
              <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 font-display mb-2">Možnost A: Založit nový prostor</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Chcete-li vygenerovat nový unikátní klíč a pozvat druhého rodiče, zadejte jména dětí a vytvořte prostor. Klíč mu následně zašlete.
              </p>

              <div className="space-y-3 mb-6">
                <label className="block text-[11px] font-mono tracking-wider text-slate-400 uppercase">Jména dětí (oddělená čárkou)</label>
                <input
                  type="text"
                  placeholder="např. Tomáš, Eliška"
                  value={childrenInput}
                  onChange={(e) => setChildrenInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  id="children-input"
                />
              </div>
            </div>

            <button
              onClick={handleCreateSpaceSubmit}
              disabled={actionLoading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              id="btn-create-space"
            >
              {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
              <span>Založit a vygenerovat klíč</span>
            </button>
          </div>

          {/* Action B: Join Space */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/50 p-6 flex flex-col justify-between" id="onboard-join-space">
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                <Link2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 font-display mb-2">Možnost B: Připojit se ke klíči</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Pokud již druhý rodič prostor založil a zaslal vám unikátní klíč (např. SYNTH-XXXX-XXXX), vložte jej níže pro okamžité spojení.
              </p>

              <div className="space-y-3 mb-6">
                <label className="block text-[11px] font-mono tracking-wider text-slate-400 uppercase">Klíč k propojení partnera</label>
                <input
                  type="text"
                  placeholder="Vložte vygenerovaný klíč..."
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-wider placeholder:font-sans placeholder:font-normal focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  id="invite-input"
                />
              </div>
            </div>

            <button
              onClick={handleJoinSpaceSubmit}
              disabled={actionLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              id="btn-join-space"
            >
              {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Propojit účty partnerů</span>
            </button>
          </div>

        </div>

        {/* Messaging Feedback bars & Interactive Guidance */}
        <div className="max-w-4xl mx-auto px-6 sm:px-10 pb-10 space-y-4">
          {connectingError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs space-y-3 shadow-xs" id="onboard-error">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-rose-900">Nebylo možné se propojit pomocí zadaného klíče</h4>
                  <p className="text-rose-700 leading-relaxed">{connectingError}</p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xs border border-rose-200/80 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Doporučený postup:</span>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>Ujistěte se, že klíč zkopíroval druhý rodič přesně z tabulky (včetně velikosti písmen a pomlčky, např. <code className="bg-slate-100 text-slate-900 px-1 py-0.5 rounded font-mono font-bold">SYNTH-XXXX-XXXX</code>).</li>
                  <li>Pokud druhý rodič ještě kód nevygeneroval, můžete <strong>vytvořit nový prostor pro vaše děti jedním kliknutím</strong> níže:</li>
                </ul>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCreateSpaceSubmit}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Vygenerovat nový prostor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInviteInput('');
                      setConnectingError('');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Vyčistit a zkusit znovu
                  </button>
                </div>
              </div>
            </div>
          )}

          {connectingSuccess && (
            <div className="bg-teal-50 border border-teal-200 text-teal-800 p-4 rounded-2xl text-xs font-medium space-y-2 shadow-xs" id="onboard-success">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-teal-600" />
                <span className="font-bold text-sm">{connectingSuccess}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Case 4: Space Fully Connected & Active Dashboard!
  const otherParentName = connection.parent1Id === currentUser.id 
    ? (connection.parent2Name || 'Čeká se na připojení partnera') 
    : connection.parent1Name;

  const isFullyPaired = !!connection.parent2Id;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col" id="coparent-dashboard">
      
      {/* Fallback Banner if remote DB is taking long */}
      {usingFallback && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-950 shrink-0" />
            <span>Lokální / Offline Režim — data se načítají z rychlé lokální paměti pro plynulý chod.</span>
          </div>
          <button
            onClick={retryOnlineSync}
            className="px-3 py-1 bg-slate-950 text-white hover:bg-slate-800 rounded-lg text-[11px] transition-colors cursor-pointer shrink-0 font-mono"
          >
            Obnovit spojení
          </button>
        </div>
      )}

      {/* 4.1 Dashboard Header */}
      <div className="bg-slate-900 text-white px-6 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 relative">
        <div className="absolute inset-0 bg-radial from-teal-500/10 to-transparent opacity-30"></div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></div>
            <span className="text-[10px] text-teal-400 font-mono tracking-wider uppercase font-semibold">Synthesis Co-Parenting Space</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight flex items-center gap-2">
            <span>Rodičovský Hub</span>
            <span className="text-slate-500 font-normal">/</span>
            <span className="text-teal-400 text-sm font-semibold truncate max-w-[150px] sm:max-w-none">
              {connection.children.join(', ')}
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-2.5 mt-2">
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold">SDÍLENÝ KÓD:</span>
            <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1 text-xs">
              <span className="text-teal-300 font-mono font-black tracking-widest text-sm select-all">{connection.inviteCode}</span>
              <button
                type="button"
                onClick={() => handleCopyKey(connection.inviteCode)}
                className="p-1 bg-slate-700/60 hover:bg-teal-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                title="Kopírovat klíč do schránky"
                id="btn-copy-key-header"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-teal-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedKey ? 'Zkopírováno' : 'Kopírovat'}</span>
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="text-[11px] text-slate-400 hover:text-rose-300 font-medium underline cursor-pointer transition-colors flex items-center gap-1 ml-1"
              id="btn-reset-key-header"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Zrušit / Nový klíč</span>
            </button>
          </div>
        </div>

        {/* Partner Connection status card */}
        <div className="relative flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl max-w-sm">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <HeartHandshake className="w-5 h-5 text-teal-200" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Partnerské propojení</span>
            <span className="text-xs text-white font-bold block truncate" title={otherParentName}>
              {otherParentName}
            </span>
            {isFullyPaired ? (
              <span className="text-[9px] text-teal-400 font-bold flex items-center gap-1 mt-0.5 font-mono">
                <Check className="w-3 h-3 text-teal-400" /> PROPOJENO AKTIVNĚ
              </span>
            ) : (
              <span className="text-[9px] text-amber-400 font-bold flex items-center gap-1 mt-0.5 animate-pulse font-mono">
                <Clock className="w-3 h-3 text-amber-400" /> ČEKÁ SE NA DRUHÉHO RODIČE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Prominent Pending Pairing Banner */}
      {!isFullyPaired && (
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-indigo-500/30 text-white px-6 py-5 shadow-inner" id="pending-pairing-banner">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span className="text-[11px] font-mono font-extrabold text-amber-300 uppercase tracking-wider">Čeká se na propojení druhého rodiče</span>
              </div>
              <h3 className="text-lg font-bold font-display text-white">
                Zašlete tento unikátní klíč druhému rodiči
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Předáním tohoto kódu se oba vaše účty bezpečně propojí. Druhý rodič kód vloží do pole „Možnost B: Připojit se ke klíči“.
              </p>
            </div>

            {/* Prominent Key Box */}
            <div className="w-full md:w-auto bg-slate-900/90 border-2 border-teal-500/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3.5 shadow-xl">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <Key className="w-6 h-6 text-teal-400 shrink-0 hidden sm:block" />
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">Unikátní klíč pro druhého rodiče</span>
                  <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-teal-300 select-all drop-shadow-md">
                    {connection.inviteCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                <button
                  type="button"
                  onClick={() => handleCopyKey(connection.inviteCode)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer shrink-0 ${
                    copiedKey
                      ? 'bg-emerald-500 text-white scale-105'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                  id="btn-copy-key-banner"
                >
                  {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey ? 'Zkopírováno!' : 'Kopírovat klíč'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="p-2.5 bg-slate-800 hover:bg-rose-950/80 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 border border-slate-700 rounded-xl transition-all cursor-pointer text-xs flex items-center gap-1 shrink-0"
                  title="Zrušit toto propojení a vygenerovat nový klíč"
                  id="btn-reset-key-banner"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="sr-only sm:not-sr-only sm:text-[11px] font-bold">Nový klíč</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.2 Tab Controls (Calendar, Diary, Chat, BIFF) */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 sm:px-6 py-2 flex items-center justify-start overflow-x-auto gap-1">
        <button
          onClick={() => setHubTab('calendar')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            hubTab === 'calendar' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-50' 
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/70'
          }`}
          id="tab-btn-calendar"
        >
          <Calendar className="w-4 h-4" />
          <span>Rodičovský Kalendář</span>
        </button>

        <button
          onClick={() => setHubTab('diary')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            hubTab === 'diary' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-50' 
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/70'
          }`}
          id="tab-btn-diary"
        >
          <BookOpen className="w-4 h-4" />
          <span>Dětský Deník & Požadavky</span>
          {diaryEntries.filter(e => e.type === 'request' && e.status === 'pending' && e.creatorId !== currentUser.id).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white animate-bounce"></span>
          )}
        </button>

        <button
          onClick={() => setHubTab('chat')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
            hubTab === 'chat' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-50' 
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/70'
          }`}
          id="tab-btn-chat"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Zabezpečený Chat</span>
        </button>

        <button
          onClick={() => setHubTab('biff-coach')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
            hubTab === 'biff-coach' 
              ? 'bg-teal-600 text-white shadow-md shadow-teal-50' 
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/70'
          }`}
          id="tab-btn-biff"
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>BIFF Asistent (Sanitizér)</span>
        </button>
      </div>

      {/* 4.3 Tab Content Body */}
      <div className="flex-grow p-4 sm:p-6 bg-slate-50/30">
        
        {/* --- TAB A: CALENDAR --- */}
        {hubTab === 'calendar' && (
          <div className="space-y-6" id="view-calendar">
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-3" id="google-connection-banner">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${googleToken ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Synchronizace Google Workspace</span>
                    {googleToken ? (
                      <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full font-mono font-bold uppercase">AKTIVNÍ</span>
                    ) : (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-mono font-bold uppercase">NEPROPOJENO</span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {googleToken 
                      ? 'Nové události se automaticky zapisují do vašeho Google Kalendáře a odesílají oznámení druhému rodiči na Gmail.'
                      : 'Propojte aplikaci s Google účtem pro automatický zápis předání dětí do Kalendáře a zasílání potvrzení na e-mail.'}
                  </p>
                </div>
              </div>

              {!googleToken && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await authorizeGoogleWorkspace();
                      setGoogleToken(getCachedAccessToken());
                    } catch (e) {
                      console.error('Google workspace auth error:', e);
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
                >
                  Propojit Google Účet
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Společný Kalendář Péče</h3>
                <p className="text-xs text-slate-500">Koordinace termínů předání dětí, lékařských prohlídek a školních kroužků.</p>
              </div>
              
              <button
                onClick={() => setEventFormOpen(!eventFormOpen)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                id="btn-add-event"
              >
                {eventFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{eventFormOpen ? 'Zavřít formulář' : 'Přidat Událost'}</span>
              </button>
            </div>

            {/* Add Event Form Modal/Drawer */}
            <AnimatePresence>
              {eventFormOpen && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddCalendarEventSubmit}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-lg overflow-hidden"
                  id="form-add-event"
                >
                  <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">Nová Událost do Kalendáře</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Název události *</label>
                      <input
                        type="text"
                        required
                        placeholder="např. Předání na víkend, Zubní lékař Tomáš"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kategorie</label>
                      <select
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value as CalendarEventCategory)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all"
                      >
                        <option value="handover">Předání dětí</option>
                        <option value="school">Škola / Kroužky</option>
                        <option value="health">Lékař / Zdraví</option>
                        <option value="leisure">Volný čas / Výlety</option>
                        <option value="other">Ostatní</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Začátek *</label>
                      <input
                        type="datetime-local"
                        required
                        value={eventStart}
                        onChange={(e) => setEventStart(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Konec *</label>
                      <input
                        type="datetime-local"
                        required
                        value={eventEnd}
                        onChange={(e) => setEventEnd(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Poznámka / Detaily</label>
                    <textarea
                      rows={2}
                      placeholder="Doplňující informace pro druhého rodiče..."
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eventGmailSync}
                        onChange={(e) => setEventGmailSync(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Synchronizovat s mé účtem Google a poslat oznámení partnerovi</span>
                    </label>

                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      <span>Uložit událost</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Calendar Events List */}
            {events.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 space-y-3">
                <CalendarDays className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium">Ve společném kalendáři zatím nejsou žádné naplánované události.</p>
                <button
                  type="button"
                  onClick={() => setEventFormOpen(true)}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Naplánovat první událost
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((evt) => (
                  <div key={evt.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-3xs flex flex-col justify-between gap-3 relative hover:border-slate-300 transition-all">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryStyles(evt.category)} font-mono`}>
                          {getCategoryName(evt.category)}
                        </span>
                        {evt.gmailSynced && (
                          <span className="text-[10px] text-teal-600 font-bold flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3 h-3 text-teal-600" /> Gmail
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-800 mb-1">{evt.title}</h4>
                      {evt.description && <p className="text-xs text-slate-500 leading-relaxed mb-2">{evt.description}</p>}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatCzechDate(evt.startDate)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-md cursor-pointer"
                        title="Smazat událost"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB B: DIARY --- */}
        {hubTab === 'diary' && (
          <div className="space-y-6" id="view-diary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Sdílený Dětský Deník & Žádosti</h3>
                <p className="text-xs text-slate-500">Pravidelný přehled o zdraví, škole a formální žádosti o změny v péči.</p>
              </div>

              <button
                onClick={() => setDiaryFormOpen(!diaryFormOpen)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                id="btn-add-diary"
              >
                {diaryFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{diaryFormOpen ? 'Zavřít formulář' : 'Přidat Záznam / Žádost'}</span>
              </button>
            </div>

            {/* Add Diary Form Modal/Drawer */}
            <AnimatePresence>
              {diaryFormOpen && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddDiaryEntrySubmit}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-lg overflow-hidden"
                  id="form-add-diary"
                >
                  <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">Nový Záznam nebo Formální Žádost</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nadpis *</label>
                      <input
                        type="text"
                        required
                        placeholder="např. Zvýšená teplota v noci, Žádost o výměnu víkendu"
                        value={diaryTitle}
                        onChange={(e) => setDiaryTitle(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Typ Záznamu</label>
                      <select
                        value={diaryType}
                        onChange={(e) => setDiaryType(e.target.value as DiaryEntryType)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all"
                      >
                        <option value="note">Běžná poznámka</option>
                        <option value="request">Formální Žádost (Ke schválení)</option>
                        <option value="health_log">Zdravotní Záznam</option>
                        <option value="school_log">Škola & Kroužky</option>
                        <option value="reminder">Připomínka pro druhého rodiče</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Podrobný popis *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Detailní informace o situaci dětí nebo důvod vaší žádosti..."
                      value={diaryContent}
                      onChange={(e) => setDiaryContent(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diaryImportant}
                        onChange={(e) => setDiaryImportant(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-rose-700">Označit jako důležité / urgentní</span>
                    </label>

                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      <span>Uložit do deníku</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Diary Entries Feed */}
            {diaryEntries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 space-y-3">
                <FileText className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium">V dětském deníku zatím nejsou žádné záznamy ani požadavky.</p>
                <button
                  type="button"
                  onClick={() => setDiaryFormOpen(true)}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Vytvořit první záznam
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {diaryEntries.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-3xs space-y-3 relative hover:border-slate-300 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getDiaryTypeStyles(entry.type)}`}>
                          {getDiaryTypeName(entry.type)}
                        </span>

                        {entry.isImportant && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-mono">
                            DŮLEŽITÉ
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                        <span>Přidal(a): <strong className="text-slate-700">{entry.creatorName}</strong></span>
                        <span>•</span>
                        <span>{formatCzechDate(entry.createdAt)}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">{entry.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{entry.content}</p>
                    </div>

                    {/* If type === 'request' -> Interactive approve/decline controls */}
                    {entry.type === 'request' && (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <span>Stav žádosti:</span>
                          {entry.status === 'agreed' && (
                            <span className="text-teal-600 flex items-center gap-1 font-mono">
                              <CheckCircle2 className="w-4 h-4 text-teal-600" /> Schváleno / Souhlas
                            </span>
                          )}
                          {entry.status === 'declined' && (
                            <span className="text-rose-600 flex items-center gap-1 font-mono">
                              <XCircle className="w-4 h-4 text-rose-600" /> Zamítnuto
                            </span>
                          )}
                          {(!entry.status || entry.status === 'pending') && (
                            <span className="text-amber-600 flex items-center gap-1 font-mono">
                              <Clock className="w-4 h-4 text-amber-500 animate-spin" /> Čeká na vyjádření partnera
                            </span>
                          )}
                        </div>

                        {/* If current user is NOT creator and status is pending */}
                        {entry.creatorId !== currentUser.id && entry.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateEntryStatus(entry.id, 'agreed')}
                              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Schválit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleUpdateEntryStatus(entry.id, 'declined')}
                              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Zamítnout</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleDeleteDiaryEntry(entry.id)}
                        className="text-slate-400 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Smazat</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB C: SECURED CHAT --- */}
        {hubTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs flex flex-col h-[520px]" id="view-chat">
            {/* Chat header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Šifrovaná Komunikace pro Rodiče</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Ukládá se pro případnou prezentaci OSPOD / Soudu</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full font-mono font-bold">
                <Lock className="w-3 h-3 text-teal-600" />
                <span>End-to-End Šifrování</span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-slate-50/20">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-medium">Zzatím žádné zprávy. Napište první zprávu pro koordinaci dětí.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-400">
                        <span className="font-bold text-slate-700">{msg.senderName}</span>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-3xs ${
                          isMe
                            ? 'bg-teal-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessageSubmit} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white rounded-b-2xl">
              <input
                type="text"
                placeholder="Napište věcnou zprávu zaměřenou na zájem dětí..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all"
              />

              <button
                type="submit"
                disabled={!newMessageText.trim()}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Odeslat</span>
              </button>
            </form>
          </div>
        )}

        {/* --- TAB D: BIFF ASSISTANT / SANITIZER --- */}
        {hubTab === 'biff-coach' && (
          <div className="space-y-6" id="view-biff-coach">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="max-w-xl space-y-2 relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-full text-[10px] font-bold font-mono">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>BIFF Metoda (Brief, Informative, Friendly, Firm)</span>
                </div>
                <h3 className="text-xl font-bold font-display text-white">AI Sanitizér Komunikace</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Vložte váš rozepsaný e-mail nebo zprávu pro druhého rodiče. Umělá inteligence z ní odstraní veškeré emoce, výčitky a útoky a přetvoří ji na věcný, právně bezpečný text vhodný pro soudní spis.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-3xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Váš původní (neupravený) text zprávy:</label>
                <textarea
                  rows={4}
                  placeholder="Napište cokoliv, co chcete partnerovi sdělit..."
                  value={biffInput}
                  onChange={(e) => setBiffInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleBiffRewrite}
                  disabled={biffLoading || !biffInput.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {biffLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Zanalyzovat & Sanitovat podle BIFF</span>
                </button>
              </div>

              {biffError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
                  {biffError}
                </div>
              )}

              {biffResult && (
                <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-teal-900 font-mono uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        Doporučená BIFF Verze ke spolehlivému odeslání:
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(biffResult.biffRewritten);
                          alert('Upravený text byl zkopírován do schránky!');
                        }}
                        className="px-3 py-1 bg-white hover:bg-teal-100 text-teal-800 border border-teal-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopírovat text</span>
                      </button>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-teal-100 text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line shadow-3xs">
                      {biffResult.biffRewritten}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                      <h5 className="text-xs font-bold text-slate-800 font-mono">Právní & psychologické vyhodnocení:</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{biffResult.biffAnalysis}</p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                      <h5 className="text-xs font-bold text-amber-900 font-mono flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Varování ohledně použitelnosti u soudu:
                      </h5>
                      <p className="text-xs text-amber-800 leading-relaxed">{biffResult.courtWarning}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      
      {/* Reset / Disconnect Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" id="reset-key-modal">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">Zrušit propojení a vygenerovat nový klíč?</h3>
                <p className="text-[10px] text-slate-400 font-mono">Resetování vygenerovaného prostoru</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tato akce zneplatní stávající kód <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">{connection?.inviteCode}</code>. Starý kód již nebude možné použít pro párování.
            </p>

            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-[11px] leading-relaxed">
              <strong>Kdy tuto funkci použít:</strong> Pokud došlo k překlepu, chcete zrušit zadaný kód nebo vytvořit zcela nový prostor pro vaše děti.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Ponechat stávající
              </button>

              <button
                type="button"
                onClick={handleDisconnectOrReset}
                disabled={actionLoading}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                id="btn-confirm-reset-key"
              >
                {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                <span>Ano, zrušit a zneplatnit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer support notice */}
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center gap-3 text-[10px] text-slate-400 font-medium">
        <Heart className="w-3.5 h-3.5 text-teal-500 shrink-0" />
        <span>Táta má právo — Systém pro ochranu psychického zdraví dětí a transparentní dohodu rodičů.</span>
      </div>

    </div>
  );
}

export default function CoParentHub({ currentUser, onOpenAuth }: CoParentHubProps) {
  return (
    <CoParentingProvider currentUser={currentUser}>
      <CoParentHubContent currentUser={currentUser} onOpenAuth={onOpenAuth} />
    </CoParentingProvider>
  );
}
