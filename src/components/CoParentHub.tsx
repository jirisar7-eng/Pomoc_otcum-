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
  Shield
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
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs
} from 'firebase/firestore';

// --- Error Handling Specification conformance ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      isAnonymous: auth.currentUser?.isAnonymous
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface CoParentHubProps {
  currentUser: AppUser | null;
  onOpenAuth: () => void;
}

export default function CoParentHub({ currentUser, onOpenAuth }: CoParentHubProps) {
  // Connection State
  const [connection, setConnection] = useState<CoparentConnection | null>(null);
  const [loadingConnection, setLoadingConnection] = useState<boolean>(true);
  
  // Inputs for connection creation/joining
  const [inviteInput, setInviteInput] = useState<string>('');
  const [childrenInput, setChildrenInput] = useState<string>('');
  const [connectingError, setConnectingError] = useState<string>('');
  const [connectingSuccess, setConnectingSuccess] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Hub Active Tab
  const [hubTab, setHubTab] = useState<'calendar' | 'diary' | 'chat' | 'biff-coach'>('calendar');

  // BIFF Assistant States
  const [biffInput, setBiffInput] = useState<string>('');
  const [biffLoading, setBiffLoading] = useState<boolean>(false);
  const [biffResult, setBiffResult] = useState<{ biffAnalysis: string, biffRewritten: string, courtWarning: string } | null>(null);
  const [biffError, setBiffError] = useState<string>('');

  // Core Data Lists
  const [events, setEvents] = useState<CoparentCalendarEvent[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<CoparentDiaryEntry[]>([]);
  const [messages, setMessages] = useState<CoparentChatMessage[]>([]);

  // Sub-forms and states
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDesc, setEventDesc] = useState<string>('');
  const [eventStart, setEventStart] = useState<string>('');
  const [eventEnd, setEventEnd] = useState<string>('');
  const [eventCategory, setEventCategory] = useState<CalendarEventCategory>('handover');
  const [eventGmailSync, setEventGmailSync] = useState<boolean>(false);

  const [diaryFormOpen, setDiaryFormOpen] = useState<boolean>(false);
  const [diaryTitle, setDiaryTitle] = useState<string>('');
  const [diaryContent, setDiaryContent] = useState<string>('');
  const [diaryType, setDiaryType] = useState<DiaryEntryType>('note');
  const [diaryDate, setDiaryDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [diaryImportant, setDiaryImportant] = useState<boolean>(false);

  const [newMessageText, setNewMessageText] = useState<string>('');
  const [googleToken, setGoogleToken] = useState<string | null>(getCachedAccessToken());

  useEffect(() => {
    // Keep the local component state in sync with the global cached Google token
    const interval = setInterval(() => {
      const tok = getCachedAccessToken();
      if (tok !== googleToken) {
        setGoogleToken(tok);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [googleToken]);
  
  // Chat scroll container reference
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Subscribe to User's Connection State
  useEffect(() => {
    if (!currentUser) {
      setConnection(null);
      setLoadingConnection(false);
      return;
    }

    setLoadingConnection(true);
    const connCollection = collection(db, 'coparent_connections');
    
    // Check if the current user is either parent1 or parent2
    const q1 = query(connCollection, where('parent1Id', '==', currentUser.id));
    const q2 = query(connCollection, where('parent2Id', '==', currentUser.id));

    let unsubscribe2: (() => void) | null = null;

    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data() as CoparentConnection;
        setConnection(docData);
        setLoadingConnection(false);
      } else {
        // If not found in parent1, listen to parent2 queries
        unsubscribe2 = onSnapshot(q2, (snapshot2) => {
          if (!snapshot2.empty) {
            const docData = snapshot2.docs[0].data() as CoparentConnection;
            setConnection(docData);
          } else {
            setConnection(null);
          }
          setLoadingConnection(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'coparent_connections');
          setLoadingConnection(false);
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'coparent_connections');
      setLoadingConnection(false);
    });

    return () => {
      unsubscribe1();
      if (unsubscribe2) unsubscribe2();
    };
  }, [currentUser]);

  // 2. Fetch Shared Sub-resources once Connection is active
  useEffect(() => {
    if (!connection) {
      setEvents([]);
      setDiaryEntries([]);
      setMessages([]);
      return;
    }

    const connectionId = connection.id;

    // A. Shared Calendar real-time listener
    const calendarRef = collection(db, 'coparent_calendar');
    const qCalendar = query(
      calendarRef, 
      where('connectionId', '==', connectionId),
      orderBy('startDate', 'asc')
    );
    const unsubCalendar = onSnapshot(qCalendar, (snap) => {
      const list: CoparentCalendarEvent[] = [];
      snap.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as CoparentCalendarEvent);
      });
      setEvents(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'coparent_calendar');
    });

    // B. Shared Child Diary real-time listener
    const diaryRef = collection(db, 'coparent_diary');
    const qDiary = query(
      diaryRef,
      where('connectionId', '==', connectionId),
      orderBy('createdAt', 'desc')
    );
    const unsubDiary = onSnapshot(qDiary, (snap) => {
      const list: CoparentDiaryEntry[] = [];
      snap.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as CoparentDiaryEntry);
      });
      setDiaryEntries(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'coparent_diary');
    });

    // C. Secured Chat Messages real-time listener
    const chatRef = collection(db, 'coparent_chat');
    const qChat = query(
      chatRef,
      where('connectionId', '==', connectionId),
      orderBy('createdAt', 'asc')
    );
    const unsubChat = onSnapshot(qChat, (snap) => {
      const list: CoparentChatMessage[] = [];
      snap.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as CoparentChatMessage);
      });
      setMessages(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'coparent_chat');
    });

    return () => {
      unsubCalendar();
      unsubDiary();
      unsubChat();
    };
  }, [connection]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (hubTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hubTab]);

  // Generate a random key for pairing
  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SYNTH-';
    for (let i = 0; i < 8; i++) {
      if (i === 4) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Onboarding action: Create a new Connection Space
  const handleCreateSpace = async () => {
    if (!currentUser) return;
    setActionLoading(true);
    setConnectingError('');
    setConnectingSuccess('');

    const inviteCode = generateRandomKey();
    const childrenList = childrenInput
      ? childrenInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : ['Děti'];

    const newConnectionId = `conn_${Date.now()}`;
    const newConnection: CoparentConnection = {
      id: newConnectionId,
      inviteCode,
      parent1Id: currentUser.id,
      parent1Name: currentUser.name,
      children: childrenList,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'coparent_connections', newConnectionId), newConnection);
      setConnectingSuccess(`Prostor úspěšně vytvořen! Váš klíč k propojení je: ${inviteCode}`);
      setActionLoading(false);
    } catch (err) {
      setActionLoading(false);
      setConnectingError('Nepodařilo se vytvořit prostor. Zkuste to prosím znovu.');
      handleFirestoreError(err, OperationType.WRITE, `coparent_connections/${newConnectionId}`);
    }
  };

  // Onboarding action: Join an existing Space using Invite Key
  const handleJoinSpace = async () => {
    if (!currentUser) return;
    if (!inviteInput.trim()) {
      setConnectingError('Zadejte prosím platný klíč k propojení.');
      return;
    }

    setActionLoading(true);
    setConnectingError('');
    setConnectingSuccess('');

    try {
      const connCollection = collection(db, 'coparent_connections');
      const q = query(connCollection, where('inviteCode', '==', inviteInput.trim().toUpperCase()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setConnectingError('Chybný klíč! Žádný odpovídající prostor nebyl nalezen.');
        setActionLoading(false);
        return;
      }

      const connectionDoc = snap.docs[0];
      const connectionData = connectionDoc.data() as CoparentConnection;

      if (connectionData.parent1Id === currentUser.id) {
        setConnectingError('Nemůžete se propojit se svým vlastním vygenerovaným klíčem.');
        setActionLoading(false);
        return;
      }

      if (connectionData.parent2Id) {
        setConnectingError('Tento prostor k propojení je již plně obsazen.');
        setActionLoading(false);
        return;
      }

      // Propojit partnera
      await updateDoc(doc(db, 'coparent_connections', connectionData.id), {
        parent2Id: currentUser.id,
        parent2Name: currentUser.name,
        updatedAt: new Date().toISOString()
      });

      setConnectingSuccess('Propojení proběhlo úspěšně! Společný prostor se nyní načítá...');
      setActionLoading(false);
    } catch (err) {
      setActionLoading(false);
      setConnectingError('Nebylo možné se připojit. Zkontrolujte připojení.');
      handleFirestoreError(err, OperationType.UPDATE, 'coparent_connections');
    }
  };

  // Calendar: Create Shared Calendar Event
  const handleAddCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !connection) return;
    if (!eventTitle.trim() || !eventStart || !eventEnd) return;

    setActionLoading(true);
    const newEventId = `evt_${Date.now()}`;
    let isGmailSynced = eventGmailSync;

    // Check if Google Authentication / Access Token is available if user wants to sync
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

    const newEvent: CoparentCalendarEvent = {
      id: newEventId,
      connectionId: connection.id,
      title: eventTitle.trim(),
      description: eventDesc.trim(),
      startDate: eventStart,
      endDate: eventEnd,
      category: eventCategory,
      creatorId: currentUser.id,
      gmailSynced: isGmailSynced,
      createdAt: new Date().toISOString()
    };

    // Google Workspace Integration Call
    if (isGmailSynced && currentToken) {
      try {
        // 1. Create event in primary Google Calendar
        await createGoogleCalendarEvent(currentToken, {
          title: newEvent.title,
          description: `${newEvent.description || ''}\n\n(Synchronizováno ze systému Synthesis OS - Rodičovský Hub pro děti: ${connection.children.join(', ')})`,
          startDate: newEvent.startDate,
          endDate: newEvent.endDate,
        });

        // 2. Look up co-parent's email and notify them via Gmail
        const otherParentId = connection.parent1Id === currentUser.id ? connection.parent2Id : connection.parent1Id;
        if (otherParentId) {
          const otherUserRef = doc(db, 'users', otherParentId);
          const otherUserSnap = await getDoc(otherUserRef);
          if (otherUserSnap.exists()) {
            const otherUser = otherUserSnap.data();
            if (otherUser.email) {
              const emailSubject = `Nová rodičovská událost: ${newEvent.title}`;
              const emailBody = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                  <h2 style="color: #0d9488; margin-top: 0; font-family: sans-serif;">Rodičovský Hub — Synthesis OS</h2>
                  <p>Ahoj ${otherUser.name || 'rodiči'},</p>
                  <p><strong>${currentUser.name}</strong> přidal novou událost do vašeho společného kalendáře pro děti <strong>${connection.children.join(', ')}</strong>:</p>
                  
                  <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #0d9488; border-radius: 4px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">${newEvent.title}</h3>
                    <p style="margin: 5px 0; font-size: 14px; color: #475569;"><strong>Kategorie:</strong> ${
                      newEvent.category === 'handover' ? 'Předání dětí' :
                      newEvent.category === 'school' ? 'Škola / Kroužky' :
                      newEvent.category === 'health' ? 'Lékař / Zdraví' :
                      newEvent.category === 'leisure' ? 'Volný čas / Výlety' : 'Ostatní'
                    }</p>
                    <p style="margin: 5px 0; font-size: 14px; color: #475569;"><strong>Začátek:</strong> ${new Date(newEvent.startDate).toLocaleString('cs-CZ')}</p>
                    <p style="margin: 5px 0; font-size: 14px; color: #475569;"><strong>Konec:</strong> ${new Date(newEvent.endDate).toLocaleString('cs-CZ')}</p>
                    ${newEvent.description ? `<p style="margin: 10px 0 0 0; font-size: 14px; color: #334155;"><strong>Poznámka:</strong> <br/>${newEvent.description.replace(/\n/g, '<br/>')}</p>` : ''}
                  </div>
                  
                  <p style="font-size: 12px; color: #64748b; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                    Tento e-mail byl bezpečně odeslán prostřednictvím portálu Synthesis Hub na základě vašeho nastavení synchronizace s Google API.
                  </p>
                </div>
              `;
              
              await sendGmailNotification(currentToken, otherUser.email, emailSubject, emailBody);
              console.log('Gmail notification sent successfully to co-parent:', otherUser.email);
            }
          }
        }
      } catch (googleApiErr: any) {
        console.error('Failed to sync to Google APIs:', googleApiErr);
        alert(`Událost byla uložena v systému, ale nepodařilo se ji synchronizovat s Google API: ${googleApiErr.message || googleApiErr}`);
      }
    }

    try {
      await setDoc(doc(db, 'coparent_calendar', newEventId), newEvent);
      // Reset form
      setEventTitle('');
      setEventDesc('');
      setEventStart('');
      setEventEnd('');
      setEventCategory('handover');
      setEventGmailSync(false);
      setEventFormOpen(false);
      setActionLoading(false);
    } catch (err) {
      setActionLoading(false);
      handleFirestoreError(err, OperationType.WRITE, `coparent_calendar/${newEventId}`);
    }
  };

  // Calendar: Delete Event
  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Opravdu chcete tuto událost smazat?')) return;
    try {
      await deleteDoc(doc(db, 'coparent_calendar', eventId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `coparent_calendar/${eventId}`);
    }
  };

  // Diary: Add Note/Log
  const handleAddDiaryEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !connection) return;
    if (!diaryTitle.trim() || !diaryContent.trim()) return;

    setActionLoading(true);
    const newEntryId = `diary_${Date.now()}`;
    const newEntry: CoparentDiaryEntry = {
      id: newEntryId,
      connectionId: connection.id,
      title: diaryTitle.trim(),
      content: diaryContent.trim(),
      type: diaryType,
      date: diaryDate,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      isImportant: diaryImportant,
      status: diaryType === 'request' ? 'pending' : undefined,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'coparent_diary', newEntryId), newEntry);
      // Reset form
      setDiaryTitle('');
      setDiaryContent('');
      setDiaryType('note');
      setDiaryImportant(false);
      setDiaryFormOpen(false);
      setActionLoading(false);
    } catch (err) {
      setActionLoading(false);
      handleFirestoreError(err, OperationType.WRITE, `coparent_diary/${newEntryId}`);
    }
  };

  // Diary: Update Request Status (Approve/Decline)
  const handleUpdateEntryStatus = async (entryId: string, newStatus: 'agreed' | 'declined') => {
    try {
      await updateDoc(doc(db, 'coparent_diary', entryId), {
        status: newStatus
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `coparent_diary/${entryId}`);
    }
  };

  // Diary: Delete entry
  const handleDeleteDiaryEntry = async (entryId: string) => {
    if (!window.confirm('Opravdu chcete tento záznam smazat?')) return;
    try {
      await deleteDoc(doc(db, 'coparent_diary', entryId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `coparent_diary/${entryId}`);
    }
  };

  // BIFF Coach: Rewrite message
  const handleBiffRewrite = async () => {
    if (!biffInput.trim()) return;
    setBiffLoading(true);
    setBiffError('');
    setBiffResult(null);
    try {
      const response = await fetch('/api/ai-admin/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'REWRITE_BIFF',
          params: {
            text: biffInput
          }
        })
      });
      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setBiffResult(resJson.data);
      } else {
        throw new Error(resJson.error || 'Chyba při přepisování zprávy.');
      }
    } catch (err: any) {
      console.error('Failed to rewrite message via BIFF:', err);
      setBiffError('Nepodařilo se zanalyzovat zprávu. Zkontrolujte připojení nebo zkuste to znovu.');
    } finally {
      setBiffLoading(false);
    }
  };

  // Chat: Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !connection || !newMessageText.trim()) return;

    const textToSend = newMessageText.trim();
    setNewMessageText(''); // Clear input instantly for UI responsiveness

    const messageId = `msg_${Date.now()}`;
    const newMessage: CoparentChatMessage = {
      id: messageId,
      connectionId: connection.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: textToSend,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'coparent_chat', messageId), newMessage);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `coparent_chat/${messageId}`);
    }
  };

  // Translate Category for display
  const getCategoryName = (cat: CalendarEventCategory) => {
    switch (cat) {
      case 'handover': return 'Předání dětí';
      case 'school': return 'Škola / Kroužky';
      case 'health': return 'Lékař / Zdraví';
      case 'leisure': return 'Volný čas / Výlety';
      default: return 'Ostatní';
    }
  };

  // Translate Category Badge style
  const getCategoryStyles = (cat: CalendarEventCategory) => {
    switch (cat) {
      case 'handover': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'school': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'health': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'leisure': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Translate Diary Entry Type for Czech
  const getDiaryTypeName = (type: DiaryEntryType) => {
    switch (type) {
      case 'note': return 'Poznámka';
      case 'reminder': return 'Připomínka';
      case 'request': return 'Požadavek (Ke schválení)';
      case 'health_log': return 'Zdravotní záznam';
      case 'school_log': return 'Škola / Vývoj';
    }
  };

  // Translate Diary Entry Type Styles
  const getDiaryTypeStyles = (type: DiaryEntryType) => {
    switch (type) {
      case 'note': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'reminder': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'request': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'health_log': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'school_log': return 'bg-teal-50 text-teal-700 border-teal-100';
    }
  };

  // ---------------- RENDERING ----------------

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

  // Case 2: Loading State
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
              onClick={handleCreateSpace}
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
              onClick={handleJoinSpace}
              disabled={actionLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              id="btn-join-space"
            >
              {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Propojit účty partnerů</span>
            </button>
          </div>

        </div>

        {/* Messaging Feedback bars */}
        <div className="max-w-4xl mx-auto px-6 sm:px-10 pb-10">
          {connectingError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2.5 animate-pulse" id="onboard-error">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{connectingError}</span>
            </div>
          )}
          {connectingSuccess && (
            <div className="bg-teal-50 border border-teal-100 text-teal-800 px-4 py-3 rounded-xl text-xs font-medium flex flex-col gap-2 shadow-xs" id="onboard-success">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
                <span className="font-bold">{connectingSuccess}</span>
              </div>
              <p className="text-[10px] text-teal-600 leading-normal pl-6">
                Předejte tento kód druhému rodiči. Jakmile jej vloží ve svém prohlížeči, váš panel se automaticky v reálném čase aktualizuje a otevře se váš společný prostor.
              </p>
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
          <p className="text-slate-400 text-[11px] mt-1 flex items-center gap-1.5 font-mono">
            <span>SDÍLENÝ KÓD:</span>
            <strong className="text-white bg-slate-800 px-2 py-0.5 rounded text-[10px] select-all border border-slate-700 font-bold tracking-widest">{connection.inviteCode}</strong>
          </p>
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

      {/* 4.2 Tab Controls (Calendar, Diary, Chat) */}
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
            {/* Google Workspace Connection Status Banner */}
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
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {googleToken 
                      ? 'Propojení aktivní. Nové události se automaticky synchronizují do Google Kalendáře a druhému rodiči bude odeslána Gmail notifikace.' 
                      : 'Připojte svůj Google účet k automatické synchronizaci společných událostí do Kalendáře a zasílání přímých notifikací partnerovi přes Gmail.'}
                  </p>
                </div>
              </div>
              
              {!googleToken ? (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const t = await authorizeGoogleWorkspace();
                      setGoogleToken(t);
                    } catch (err: any) {
                      alert('Propojení selhalo: ' + err.message);
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-sm"
                  id="btn-google-connect-banner"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                  Propojit Google
                </button>
              ) : (
                <span className="text-[10px] font-mono font-bold text-teal-600 bg-teal-50/50 border border-teal-200/40 px-3 py-1.5 rounded-xl whitespace-nowrap self-start sm:self-auto" id="google-connected-badge">
                  ● PROPOJENO S GOOGLE
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-teal-600" />
                  <span>Plán střídání a péče o děti</span>
                </h2>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                  Zaznamenávejte termíny předání dětí, školní události, lékařské prohlídky a prázdniny.
                </p>
              </div>

              <button
                onClick={() => setEventFormOpen(!eventFormOpen)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                id="btn-add-event-toggle"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nová událost</span>
              </button>
            </div>

            {/* Event Adding Form */}
            <AnimatePresence>
              {eventFormOpen && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleAddCalendarEvent}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 overflow-hidden"
                  id="form-add-event"
                >
                  <h3 className="text-sm font-bold text-slate-800 font-display border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-teal-600" /> Přidat plánovanou událost
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Název události *</label>
                      <input
                        type="text"
                        required
                        placeholder="např. Předání dětí u matky, Zubní prohlídka"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-teal-500"
                        id="event-title-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Kategorie *</label>
                        <select
                          value={eventCategory}
                          onChange={(e) => setEventCategory(e.target.value as CalendarEventCategory)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden text-slate-700"
                          id="event-category-select"
                        >
                          <option value="handover">Předání dětí</option>
                          <option value="school">Škola / Kroužky</option>
                          <option value="health">Lékař / Zdraví</option>
                          <option value="leisure">Volný čas / Výlety</option>
                          <option value="other">Ostatní</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Propojit s Gmailem</label>
                        <div className="flex items-center h-full pb-1">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={eventGmailSync} 
                              onChange={(e) => setEventGmailSync(e.target.checked)} 
                              className="sr-only peer" 
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                            <span className="ml-2 text-[10px] font-bold text-slate-500 font-mono">Gmail Sync</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Začátek události *</label>
                      <input
                        type="datetime-local"
                        required
                        value={eventStart}
                        onChange={(e) => setEventStart(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden text-slate-700"
                        id="event-start-input"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Konec události *</label>
                      <input
                        type="datetime-local"
                        required
                        value={eventEnd}
                        onChange={(e) => setEventEnd(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden text-slate-700"
                        id="event-end-input"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Popis / Poznámka</label>
                      <textarea
                        rows={2}
                        placeholder="Podrobnosti, co s sebou sbalit, kdo vyzvedává ze školy..."
                        value={eventDesc}
                        onChange={(e) => setEventDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-teal-500"
                        id="event-desc-textarea"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setEventFormOpen(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      Zrušit
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center gap-1"
                    >
                      {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      Uložit událost
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* List of Scheduled Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="calendar-events-grid">
              {events.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                  Prozatím zde nejsou naplánované žádné události. Klikněte na tlačítko "Nová událost" pro naplánování prvního termínu.
                </div>
              ) : (
                events.map((evt) => {
                  const formatCzechDate = (isoStr: string) => {
                    const date = new Date(isoStr);
                    return date.toLocaleDateString('cs-CZ', { 
                      day: 'numeric', 
                      month: 'long', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                  };

                  return (
                    <div 
                      key={evt.id} 
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm hover:border-slate-200 transition-all"
                      id={`calendar-event-card-${evt.id}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3.5 gap-2">
                          <span className={`px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider font-mono ${getCategoryStyles(evt.category)}`}>
                            {getCategoryName(evt.category)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {evt.gmailSynced && (
                              <div className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full text-[8px] font-extrabold font-mono" title="Tato událost je plně synchronizována do rodinného Gmail kalendáře">
                                <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
                                GMAIL SYNCED
                              </div>
                            )}
                            {(evt.creatorId === currentUser.id || currentUser.role === 'admin') && (
                              <button
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                title="Smazat událost"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <h4 className="font-bold text-slate-800 text-sm font-display mb-1.5 leading-tight">{evt.title}</h4>
                        {evt.description && (
                          <p className="text-slate-500 text-[11px] leading-relaxed mb-4 whitespace-pre-wrap">{evt.description}</p>
                        )}
                      </div>

                      <div className="border-t border-slate-50 pt-3 text-[10px] text-slate-400 font-mono space-y-1">
                        <div className="flex justify-between">
                          <span>OD:</span>
                          <strong className="text-slate-700">{formatCzechDate(evt.startDate)}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>DO:</span>
                          <strong className="text-slate-700">{formatCzechDate(evt.endDate)}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- TAB B: CHILDREN DIARY --- */}
        {hubTab === 'diary' && (
          <div className="space-y-6" id="view-diary">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <span>Dětský deník & Dohody</span>
                </h2>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                  Sdílejte důležité poznámky k chování dětí, zdravotnímu stavu, požadavky na změny plánu, které může druhý rodič schválit.
                </p>
              </div>

              <button
                onClick={() => setDiaryFormOpen(!diaryFormOpen)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                id="btn-add-diary-toggle"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nový záznam / Požadavek</span>
              </button>
            </div>

            {/* Diary Entry Adding Form */}
            <AnimatePresence>
              {diaryFormOpen && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleAddDiaryEntry}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 overflow-hidden"
                  id="form-add-diary"
                >
                  <h3 className="text-sm font-bold text-slate-800 font-display border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-teal-600" /> Vytvořit nový záznam v deníku
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-1">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Předmět / Titulek *</label>
                      <input
                        type="text"
                        required
                        placeholder="např. Výrobky do školky, Teplota Elišky, Žádost o výměnu víkendu"
                        value={diaryTitle}
                        onChange={(e) => setDiaryTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-teal-500"
                        id="diary-title-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Typ záznamu *</label>
                        <select
                          value={diaryType}
                          onChange={(e) => setDiaryType(e.target.value as DiaryEntryType)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden text-slate-700"
                          id="diary-type-select"
                        >
                          <option value="note">Poznámka</option>
                          <option value="reminder">Připomínka</option>
                          <option value="request">Požadavek (Ke schválení partnerem)</option>
                          <option value="health_log">Zdravotní záznam</option>
                          <option value="school_log">Škola / Vývoj</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Důležité? / Upozornit</label>
                        <div className="flex items-center h-full pb-1">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={diaryImportant} 
                              onChange={(e) => setDiaryImportant(e.target.checked)} 
                              className="sr-only peer" 
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                            <span className="ml-2 text-[10px] font-bold text-amber-600 font-mono">DŮLEŽITÉ</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Datum platnosti / události</label>
                      <input
                        type="date"
                        required
                        value={diaryDate}
                        onChange={(e) => setDiaryDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden text-slate-700"
                        id="diary-date-input"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400">Obsah zprávy / Podrobnosti *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Napište podrobnou zprávu, požadavek na změnu termínu střídání dětí, zdravotní stav nebo pokyny..."
                        value={diaryContent}
                        onChange={(e) => setDiaryContent(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-teal-500"
                        id="diary-content-textarea"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setDiaryFormOpen(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      Zrušit
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center gap-1"
                    >
                      {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      Uložit do deníku
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Diary entries Feed */}
            <div className="space-y-4" id="diary-entries-feed">
              {diaryEntries.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                  Deník dětí je prozatím prázdný. Přidejte první informaci nebo požadavek ke schválení.
                </div>
              ) : (
                diaryEntries.map((entry) => {
                  const isCreatedBySelf = entry.creatorId === currentUser.id;

                  return (
                    <div 
                      key={entry.id} 
                      className={`bg-white border rounded-2xl p-5 shadow-3xs hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden ${
                        entry.isImportant ? 'border-amber-300 ring-1 ring-amber-50/50' : 'border-slate-100'
                      }`}
                      id={`diary-entry-card-${entry.id}`}
                    >
                      {/* Highlight label for important items */}
                      {entry.isImportant && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-[8px] font-extrabold text-white px-2 py-0.5 rounded-bl tracking-wider uppercase font-mono">
                          Důležité
                        </div>
                      )}

                      <div>
                        {/* Meta header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md border text-[8px] font-extrabold uppercase tracking-wide font-mono ${getDiaryTypeStyles(entry.type)}`}>
                              {getDiaryTypeName(entry.type)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Zapsal: <strong className="text-slate-600">{entry.creatorName}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">
                              Datum: {new Date(entry.date).toLocaleDateString('cs-CZ')}
                            </span>
                            {(entry.creatorId === currentUser.id || currentUser.role === 'admin') && (
                              <button
                                onClick={() => handleDeleteDiaryEntry(entry.id)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                title="Odstranit záznam"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Title and Content */}
                        <h4 className="font-bold text-slate-800 text-sm font-display mb-2">{entry.title}</h4>
                        <p className="text-slate-600 text-xs leading-relaxed mb-4 whitespace-pre-wrap">{entry.content}</p>
                      </div>

                      {/* Interactive co-parenting requests agreement action block */}
                      {entry.type === 'request' && entry.status && (
                        <div className="border-t border-slate-100 pt-4 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 -mx-5 -mb-5 p-5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Stav požadavku:</span>
                            {entry.status === 'pending' && (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-extrabold font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3" /> ČEKÁ NA ROZHODNUTÍ
                              </span>
                            )}
                            {entry.status === 'agreed' && (
                              <span className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded text-[9px] font-extrabold font-mono flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> SCHVÁLENO OBĚMA RODIČI
                              </span>
                            )}
                            {entry.status === 'declined' && (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[9px] font-extrabold font-mono flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> ZAMÍTNUTO
                              </span>
                            )}
                          </div>

                          {entry.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              {isCreatedBySelf ? (
                                <span className="text-[10px] text-slate-400 font-bold italic leading-none">Čekáte na vyjádření partnera</span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleUpdateEntryStatus(entry.id, 'declined')}
                                    className="px-3 py-1 bg-white border border-rose-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600 font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <X className="w-3 h-3" /> Odmítnout
                                  </button>
                                  <button
                                    onClick={() => handleUpdateEntryStatus(entry.id, 'agreed')}
                                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" /> Schválit změnu
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- TAB C: SECURED CHAT --- */}
        {hubTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[520px] shadow-sm overflow-hidden" id="view-chat">
            
            {/* Chat header info */}
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-700 font-display">Bezpečný, šifrovaný kanál pro domluvu</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase font-bold">Synchronní komunikace</span>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/20" id="chat-messages-container">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 p-6 text-center">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                  <p>Žádné zprávy. Napište první zprávu pro rychlou domluvu s partnerem o dětech bez zbytečných průtahů.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSenderSelf = msg.senderId === currentUser.id;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isSenderSelf ? 'justify-end' : 'justify-start'}`}
                      id={`chat-message-${msg.id}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-3 shadow-3xs ${
                        isSenderSelf 
                          ? 'bg-teal-600 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-200/70 text-slate-800 rounded-tl-none'
                      }`}>
                        {/* Sender Name */}
                        {!isSenderSelf && (
                          <span className="block text-[8px] font-black uppercase tracking-wider text-teal-600 mb-1 font-mono">
                            {msg.senderName}
                          </span>
                        )}
                        <p className="text-xs leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                        <span className={`block text-[8px] text-right mt-1.5 font-mono ${
                          isSenderSelf ? 'text-teal-200' : 'text-slate-400'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Form Input message */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2 bg-white">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Napište bezpečnou zprávu rodiči..."
                className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-teal-500 transition-colors"
                id="chat-message-input"
              />
              <button
                type="submit"
                disabled={!newMessageText.trim()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center shrink-0"
                id="chat-send-btn"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        )}

        {/* --- TAB D: BIFF COACH --- */}
        {hubTab === 'biff-coach' && (
          <div className="space-y-6" id="view-biff-coach">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 font-display">BIFF Komunikační Asistent</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Napište zprávu, kterou plánujete poslat partnerovi (nebo kterou jste obdrželi). AI ji zanalyzuje a okamžitě přepíše podle uznávané metodiky <strong>BIFF</strong> (<em>Brief, Informative, Friendly, Firm</em> – Stručná, Informativní, Přátelská a Jasná). Zamezíte tak emocím a ochráníte svůj opatrovnický spor před soudem.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5 font-mono">
                    Původní / Chystaná zpráva:
                  </label>
                  <textarea
                    rows={4}
                    value={biffInput}
                    onChange={(e) => setBiffInput(e.target.value)}
                    placeholder="Např.: Už mě nebaví, jak pořád chodíš pozdě! Jestli v pátek zase nepřijdeš včas, tak ti děti příště vůbec nedám a nahlásím tě na OSPOD, ty nezodpovědný sobče!"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-teal-500 transition-colors placeholder:text-slate-400"
                    id="biff-textarea-input"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Zpráva bude zpracována serverem Synthesis AI.</span>
                  </div>
                  <button
                    onClick={handleBiffRewrite}
                    disabled={biffLoading || !biffInput.trim()}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 text-xs"
                    id="biff-submit-btn"
                  >
                    {biffLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzuji a přepisuji...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sanitovat zprávu (BIFF)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {biffError && (
              <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl flex items-center gap-3 text-xs text-red-700 font-semibold">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{biffError}</span>
              </div>
            )}

            {/* Skeleton Loading state */}
            {biffLoading && (
              <div className="space-y-4 animate-pulse">
                <div className="h-28 bg-slate-100 rounded-2xl"></div>
                <div className="h-20 bg-slate-100 rounded-2xl"></div>
              </div>
            )}

            {/* Results Block */}
            {biffResult && !biffLoading && (
              <div className="space-y-6" id="biff-results-container">
                {/* 1. Rewritten Message Card */}
                <div className="bg-teal-50/40 border border-teal-100 rounded-2xl p-6 shadow-2xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100/30 rounded-full blur-2xl -mr-6 -mt-6"></div>
                  
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-teal-900 font-display">Bezpečná verze připravená k odeslání</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(biffResult.biffRewritten);
                        alert('Zpráva byla zkopírována do schránky.');
                      }}
                      className="text-[10px] font-bold text-teal-700 hover:text-teal-800 bg-white border border-teal-200 rounded-lg px-2.5 py-1.5 cursor-pointer shadow-3xs flex items-center gap-1 hover:shadow-2xs transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Kopírovat text
                    </button>
                  </div>

                  <div className="bg-white/80 border border-teal-100/50 rounded-xl p-4 text-xs font-semibold text-slate-700 leading-relaxed relative z-10 select-all">
                    {biffResult.biffRewritten}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 2. Analysis Card */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-3xs">
                    <h4 className="text-xs font-bold text-slate-800 font-display flex items-center gap-1.5 mb-2">
                      <Clock className="w-4 h-4 text-teal-600" />
                      Analýza konfliktu
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans font-medium">
                      {biffResult.biffAnalysis}
                    </p>
                  </div>

                  {/* 3. Court Risk warning */}
                  <div className="bg-amber-50/30 border border-amber-200/40 rounded-2xl p-5 shadow-3xs">
                    <h4 className="text-xs font-bold text-amber-800 font-display flex items-center gap-1.5 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Právní riziko původního textu
                    </h4>
                    <p className="text-[11px] text-amber-900/80 leading-relaxed font-sans font-medium">
                      {biffResult.courtWarning}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
      
      {/* Footer support notice */}
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center gap-3 text-[10px] text-slate-400 font-medium">
        <Heart className="w-3.5 h-3.5 text-teal-500 shrink-0" />
        <span>Tato sekce splňuje nejvyšší standardy zabezpečení. Děti mají právo na harmonický vývoj a informované, spolupracující rodiče. Společně pro blaho rodiny.</span>
      </div>

    </div>
  );
}
