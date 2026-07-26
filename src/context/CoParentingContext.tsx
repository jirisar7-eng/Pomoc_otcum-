import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CoparentConnection, 
  CoparentCalendarEvent, 
  CoparentDiaryEntry, 
  CoparentChatMessage, 
  User as AppUser 
} from '../types';
import { db } from '../lib/firebase';
import { SupabaseService } from '../lib/supabase';
import { dbSyncService } from '../services/dbSyncService';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

const LOCAL_STORE_KEY = 'tata_coparent_connections_v2';
const LOCAL_EVENTS_KEY = 'tata_coparent_events_v2';
const LOCAL_DIARY_KEY = 'tata_coparent_diary_v2';
const LOCAL_MESSAGES_KEY = 'tata_coparent_messages_v2';

export function generateRandomKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) {
    p1 += chars.charAt(Math.floor(Math.random() * chars.length));
    p2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SYNTH-${p1}-${p2}`;
}

export function normalizeCode(code: string): string {
  return (code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Local storage helper functions
function getLocalConnections(): CoparentConnection[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalConnection(conn: CoparentConnection) {
  try {
    const list = getLocalConnections();
    const idx = list.findIndex(c => c.id === conn.id);
    if (idx >= 0) {
      list[idx] = conn;
    } else {
      list.push(conn);
    }
    localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(list));
    notifyTabBroadcast('CONNECTION_SAVED');
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

const BROADCAST_CHANNEL_NAME = 'tata_ma_pravo_tab_sync';

function notifyTabBroadcast(actionType: string) {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: actionType, timestamp: Date.now() });
      bc.close();
    } catch (e) {
      console.warn('Broadcast notify failed:', e);
    }
  }
}

function getLocalEvents(connectionId: string): CoparentCalendarEvent[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_EVENTS_KEY}_${connectionId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalEvents(connectionId: string, events: CoparentCalendarEvent[]) {
  try {
    localStorage.setItem(`${LOCAL_EVENTS_KEY}_${connectionId}`, JSON.stringify(events));
    notifyTabBroadcast('EVENTS_SAVED');
  } catch (e) {
    console.warn('LocalStorage events save failed', e);
  }
}

function getLocalDiary(connectionId: string): CoparentDiaryEntry[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_DIARY_KEY}_${connectionId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalDiary(connectionId: string, entries: CoparentDiaryEntry[]) {
  try {
    localStorage.setItem(`${LOCAL_DIARY_KEY}_${connectionId}`, JSON.stringify(entries));
    notifyTabBroadcast('DIARY_SAVED');
  } catch (e) {
    console.warn('LocalStorage diary save failed', e);
  }
}

function getLocalMessages(connectionId: string): CoparentChatMessage[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_MESSAGES_KEY}_${connectionId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessages(connectionId: string, msgs: CoparentChatMessage[]) {
  try {
    localStorage.setItem(`${LOCAL_MESSAGES_KEY}_${connectionId}`, JSON.stringify(msgs));
    notifyTabBroadcast('MESSAGES_SAVED');
  } catch (e) {
    console.warn('LocalStorage messages save failed', e);
  }
}

export interface CoParentingContextType {
  currentUser: AppUser | null;
  connection: CoparentConnection | null;
  spaceId: string | null;
  loadingConnection: boolean;
  usingFallback: boolean;
  events: CoparentCalendarEvent[];
  diaryEntries: CoparentDiaryEntry[];
  messages: CoparentChatMessage[];
  
  actionLoading: boolean;
  connectingError: string;
  connectingSuccess: string;
  copiedKey: boolean;
  showResetConfirm: boolean;
  
  setConnectingError: (err: string) => void;
  setConnectingSuccess: (msg: string) => void;
  setShowResetConfirm: (show: boolean) => void;
  
  handleCopyKey: (codeToCopy?: string) => void;
  handleCreateSpace: () => Promise<void>;
  handleJoinSpace: (inviteInput: string) => Promise<void>;
  handleDisconnectOrReset: () => Promise<void>;
  
  handleAddCalendarEvent: (eventData: Omit<CoparentCalendarEvent, 'id' | 'connectionId' | 'createdAt'>) => Promise<boolean>;
  handleDeleteEvent: (eventId: string) => Promise<void>;
  handleAddDiaryEntry: (entryData: Omit<CoparentDiaryEntry, 'id' | 'connectionId' | 'createdAt'>) => Promise<boolean>;
  handleUpdateEntryStatus: (entryId: string, newStatus: 'agreed' | 'declined') => Promise<void>;
  handleDeleteDiaryEntry: (entryId: string) => Promise<void>;
  handleSendMessage: (text: string) => Promise<void>;
  
  retryOnlineSync: () => void;
}

const CoParentingContext = createContext<CoParentingContextType | undefined>(undefined);

interface CoParentingProviderProps {
  children: ReactNode;
  currentUser: AppUser | null;
}

export function CoParentingProvider({ children, currentUser }: CoParentingProviderProps) {
  const [connection, setConnection] = useState<CoparentConnection | null>(null);
  const [loadingConnection, setLoadingConnection] = useState<boolean>(true);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);

  const [events, setEvents] = useState<CoparentCalendarEvent[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<CoparentDiaryEntry[]>([]);
  const [messages, setMessages] = useState<CoparentChatMessage[]>([]);

  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [connectingError, setConnectingError] = useState<string>('');
  const [connectingSuccess, setConnectingSuccess] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const saveConnectionToAllStores = async (conn: CoparentConnection) => {
    saveLocalConnection(conn);

    try {
      await SupabaseService.saveCoparentConnection(conn);
    } catch (e) {
      console.warn('Supabase saveCoparentConnection error:', e);
    }

    try {
      await setDoc(doc(db, 'coparent_connections', conn.id), conn);
    } catch (e) {
      console.warn('Firestore setDoc connection error:', e);
    }
  };

  const findConnectionByCode = async (inviteInput: string): Promise<CoparentConnection | null> => {
    const normInput = normalizeCode(inviteInput);
    if (!normInput) return null;

    try {
      const supConn = await SupabaseService.findCoparentConnectionByCode(inviteInput);
      if (supConn) return supConn;
    } catch (e) {
      console.warn('Supabase find connection error:', e);
    }

    try {
      const connCollection = collection(db, 'coparent_connections');
      const snap = await getDocs(connCollection);
      for (const docSnap of snap.docs) {
        const data = docSnap.data() as CoparentConnection;
        if (normalizeCode(data.inviteCode) === normInput) {
          return { ...data, id: docSnap.id };
        }
      }
    } catch (e) {
      console.warn('Firestore find connection error:', e);
    }

    const localList = getLocalConnections();
    const localFound = localList.find(c => normalizeCode(c.inviteCode) === normInput);
    if (localFound) return localFound;

    return null;
  };

  // 1. Subscribe to Connection with 2.0-second fallback safety
  useEffect(() => {
    if (!currentUser) {
      setConnection(null);
      setLoadingConnection(false);
      setUsingFallback(false);
      return;
    }

    setLoadingConnection(true);
    setUsingFallback(false);

    let isMounted = true;

    // A. Check LocalStorage cache immediately
    const localList = getLocalConnections();
    const userLocal = localList.find(c => c.parent1Id === currentUser.id || c.parent2Id === currentUser.id);
    if (userLocal) {
      setConnection(userLocal);
    }

    // B. Safety timer (2.0s timeout max spinner)
    const timeoutTimer = setTimeout(() => {
      if (isMounted) {
        setLoadingConnection((prev) => {
          if (prev) {
            console.info('CoParentingContext: 2-second timeout reached. Enabling fallback local mode.');
            setUsingFallback(true);
          }
          return false;
        });
      }
    }, 2000);

    // C. Supabase fetch
    SupabaseService.fetchCoparentConnection(currentUser.id)
      .then(supConn => {
        if (isMounted && supConn) {
          setConnection(supConn);
          saveLocalConnection(supConn);
          setLoadingConnection(false);
          clearTimeout(timeoutTimer);
        }
      })
      .catch(e => console.warn('Supabase fetch connection failed:', e));

    // D. Firestore listener
    const connCollection = collection(db, 'coparent_connections');
    const q1 = query(connCollection, where('parent1Id', '==', currentUser.id));
    const q2 = query(connCollection, where('parent2Id', '==', currentUser.id));

    let unsubscribe2: (() => void) | null = null;

    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      if (!isMounted) return;
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data() as CoparentConnection;
        setConnection(docData);
        saveLocalConnection(docData);
        setLoadingConnection(false);
        clearTimeout(timeoutTimer);
      } else {
        unsubscribe2 = onSnapshot(q2, (snapshot2) => {
          if (!isMounted) return;
          if (!snapshot2.empty) {
            const docData = snapshot2.docs[0].data() as CoparentConnection;
            setConnection(docData);
            saveLocalConnection(docData);
          }
          setLoadingConnection(false);
          clearTimeout(timeoutTimer);
        }, (error) => {
          console.warn('Firestore listener 2 error:', error);
          if (isMounted) setLoadingConnection(false);
        });
      }
    }, (error) => {
      console.warn('Firestore listener 1 error:', error);
      if (isMounted) setLoadingConnection(false);
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutTimer);
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

    // Load from local storage cache immediately
    setEvents(getLocalEvents(connectionId));
    setDiaryEntries(getLocalDiary(connectionId));
    setMessages(getLocalMessages(connectionId));

    // A. Shared Calendar listener
    const calendarRef = collection(db, 'coparent_calendar');
    const qCalendar = query(
      calendarRef, 
      where('connectionId', '==', connectionId),
      orderBy('startDate', 'asc')
    );
    const unsubCalendar = onSnapshot(qCalendar, (snap) => {
      const list: CoparentCalendarEvent[] = [];
      snap.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as CoparentCalendarEvent);
      });
      setEvents(list);
      saveLocalEvents(connectionId, list);
    }, (error) => {
      console.warn('Firestore calendar query error:', error);
    });

    // B. Shared Child Diary listener
    const diaryRef = collection(db, 'coparent_diary');
    const qDiary = query(
      diaryRef,
      where('connectionId', '==', connectionId),
      orderBy('createdAt', 'desc')
    );
    const unsubDiary = onSnapshot(qDiary, (snap) => {
      const list: CoparentDiaryEntry[] = [];
      snap.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as CoparentDiaryEntry);
      });
      setDiaryEntries(list);
      saveLocalDiary(connectionId, list);
    }, (error) => {
      console.warn('Firestore diary query error:', error);
    });

    // C. Secured Chat Messages listener
    const chatRef = collection(db, 'coparent_chat');
    const qChat = query(
      chatRef,
      where('connectionId', '==', connectionId),
      orderBy('createdAt', 'asc')
    );
    const unsubChat = onSnapshot(qChat, (snap) => {
      const list: CoparentChatMessage[] = [];
      snap.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as CoparentChatMessage);
      });
      setMessages(list);
      saveLocalMessages(connectionId, list);
    }, (error) => {
      console.warn('Firestore chat query error:', error);
    });

    return () => {
      unsubCalendar();
      unsubDiary();
      unsubChat();
    };
  }, [connection]);

  // 3. Multi-Tab Realtime Local Synchronization (BroadcastChannel & Storage Event listener)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reloadLocalData = () => {
      const localList = getLocalConnections();
      if (currentUser) {
        const userLocal = localList.find(c => c.parent1Id === currentUser.id || c.parent2Id === currentUser.id);
        if (userLocal) {
          setConnection(userLocal);
          setEvents(getLocalEvents(userLocal.id));
          setDiaryEntries(getLocalDiary(userLocal.id));
          setMessages(getLocalMessages(userLocal.id));
        }
      } else if (connection) {
        setEvents(getLocalEvents(connection.id));
        setDiaryEntries(getLocalDiary(connection.id));
        setMessages(getLocalMessages(connection.id));
      }
    };

    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data && event.data.type) {
            reloadLocalData();
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel listener setup skipped:', e);
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.includes('tata_coparent_')) {
        reloadLocalData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser, connection?.id]);

  // Actions
  const handleCopyKey = (codeToCopy?: string) => {
    const code = codeToCopy || connection?.inviteCode || '';
    if (!code) return;
    try {
      navigator.clipboard.writeText(code);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  const handleCreateSpace = async () => {
    if (!currentUser) return;
    setActionLoading(true);
    setConnectingError('');
    setConnectingSuccess('');

    const inviteCode = generateRandomKey();
    const childrenList = ['Děti'];
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
      await saveConnectionToAllStores(newConnection);
      setConnection(newConnection);
      setConnectingSuccess(`Prostor úspěšně vytvořen a uložen! Váš klíč k propojení je: ${inviteCode}`);
      setActionLoading(false);
    } catch (err) {
      setActionLoading(false);
      setConnectingError('Nepodařilo se vytvořit prostor. Zkuste to prosím znovu.');
    }
  };

  const handleJoinSpace = async (inviteInput: string) => {
    if (!currentUser) return;
    const rawInput = inviteInput.trim();
    if (!rawInput) {
      setConnectingError('Zadejte prosím platný klíč k propojení (např. SYNTH-XXXX-XXXX).');
      return;
    }

    setActionLoading(true);
    setConnectingError('');
    setConnectingSuccess('');

    try {
      const existingConn = await findConnectionByCode(rawInput);

      if (!existingConn) {
        setConnectingError(`Klíč "${rawInput}" nebyl v databázi nalezen. Zkontrolujte prosím překlepy nebo vygenerujte nový prostor.`);
        setActionLoading(false);
        return;
      }

      if (existingConn.parent1Id === currentUser.id) {
        setConnectingError('Nemůžete se propojit se svým vlastním vygenerovaným klíčem.');
        setActionLoading(false);
        return;
      }

      if (existingConn.parent2Id && existingConn.parent2Id !== currentUser.id) {
        setConnectingError('Tento prostor k propojení je již plně obsazen druhým rodičem.');
        setActionLoading(false);
        return;
      }

      const updatedConn: CoparentConnection = {
        ...existingConn,
        parent2Id: currentUser.id,
        parent2Name: currentUser.name,
        updatedAt: new Date().toISOString()
      };

      await saveConnectionToAllStores(updatedConn);
      setConnection(updatedConn);
      setConnectingSuccess('Propojení účtů proběhlo úspěšně! Váš společný prostor se načítá...');
      setActionLoading(false);
    } catch (err) {
      setActionLoading(false);
      setConnectingError('Nebylo možné se připojit. Zkontrolujte připojení k internetu.');
    }
  };

  const handleDisconnectOrReset = async () => {
    if (!currentUser || !connection) return;
    setActionLoading(true);
    setConnectingError('');
    setConnectingSuccess('');

    try {
      const connId = connection.id;

      try {
        const localList = getLocalConnections().filter(c => c.id !== connId);
        localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(localList));
      } catch (e) {
        console.warn('LocalStorage remove error:', e);
      }

      try {
        const supabase = (SupabaseService as any).getSupabase ? (SupabaseService as any).getSupabase() : null;
        if (supabase) {
          await supabase.from('coparent_connections').delete().eq('id', connId);
        }
      } catch (e) {
        console.warn('Supabase delete connection error:', e);
      }

      try {
        await deleteDoc(doc(db, 'coparent_connections', connId));
      } catch (e) {
        console.warn('Firestore delete connection error:', e);
      }

      const newInviteCode = generateRandomKey();
      const childrenList = connection.children && connection.children.length > 0 ? connection.children : ['Děti'];
      const newConnectionId = `conn_${Date.now()}`;
      const newConnection: CoparentConnection = {
        id: newConnectionId,
        inviteCode: newInviteCode,
        parent1Id: currentUser.id,
        parent1Name: currentUser.name,
        children: childrenList,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveConnectionToAllStores(newConnection);
      setConnection(newConnection);
      setShowResetConfirm(false);

      const msg = `Starý klíč byl zneplatněn. Nový klíč k propojení byl vytvořen: ${newInviteCode}`;
      setConnectingSuccess(msg);
      alert(`Nový klíč k propojení byl úspěšně vytvořen!\n\nVáš nový kód: ${newInviteCode}`);
    } catch (err) {
      console.error('Error resetting connection:', err);
      setConnectingError('Chyba při rušení spojení a generování nového klíče. Zkontrolujte síťové připojení.');
    } finally {
      setActionLoading(false);
    }
  };

  // Calendar Event Handler
  const handleAddCalendarEvent = async (eventData: Omit<CoparentCalendarEvent, 'id' | 'connectionId' | 'createdAt'>): Promise<boolean> => {
    if (!currentUser || !connection) return false;
    setActionLoading(true);

    const newEventId = `evt_${Date.now()}`;
    const newEvent: CoparentCalendarEvent = {
      ...eventData,
      id: newEventId,
      connectionId: connection.id,
      createdAt: new Date().toISOString()
    };

    // Instant local UI update
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveLocalEvents(connection.id, updatedEvents);

    try {
      await dbSyncService.dualSaveDocument('coparent_calendar', newEventId, newEvent);
      setActionLoading(false);
      return true;
    } catch (err) {
      console.warn('Dual write event error:', err);
      setActionLoading(false);
      return true; // saved locally
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!connection) return;
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    saveLocalEvents(connection.id, updatedEvents);

    try {
      await dbSyncService.dualDeleteDocument('coparent_calendar', eventId);
    } catch (err) {
      console.warn('Dual delete event error:', err);
    }
  };

  // Diary Entry Handler
  const handleAddDiaryEntry = async (entryData: Omit<CoparentDiaryEntry, 'id' | 'connectionId' | 'createdAt'>): Promise<boolean> => {
    if (!currentUser || !connection) return false;
    setActionLoading(true);

    const newEntryId = `diary_${Date.now()}`;
    const newEntry: CoparentDiaryEntry = {
      ...entryData,
      id: newEntryId,
      connectionId: connection.id,
      createdAt: new Date().toISOString()
    };

    const updatedEntries = [newEntry, ...diaryEntries];
    setDiaryEntries(updatedEntries);
    saveLocalDiary(connection.id, updatedEntries);

    try {
      await dbSyncService.dualSaveDocument('coparent_diary', newEntryId, newEntry);
      setActionLoading(false);
      return true;
    } catch (err) {
      console.warn('Dual write diary error:', err);
      setActionLoading(false);
      return true; // saved locally
    }
  };

  const handleUpdateEntryStatus = async (entryId: string, newStatus: 'agreed' | 'declined') => {
    if (!connection) return;
    const updated = diaryEntries.map(e => e.id === entryId ? { ...e, status: newStatus } : e);
    setDiaryEntries(updated);
    saveLocalDiary(connection.id, updated);

    const found = updated.find(e => e.id === entryId);
    if (found) {
      try {
        await dbSyncService.dualSaveDocument('coparent_diary', entryId, found);
      } catch (err) {
        console.warn('Dual update diary status error:', err);
      }
    }
  };

  const handleDeleteDiaryEntry = async (entryId: string) => {
    if (!connection) return;
    const updated = diaryEntries.filter(e => e.id !== entryId);
    setDiaryEntries(updated);
    saveLocalDiary(connection.id, updated);

    try {
      await dbSyncService.dualDeleteDocument('coparent_diary', entryId);
    } catch (err) {
      console.warn('Dual delete diary error:', err);
    }
  };

  // Chat Handler
  const handleSendMessage = async (text: string) => {
    if (!currentUser || !connection || !text.trim()) return;

    const messageId = `msg_${Date.now()}`;
    const newMessage: CoparentChatMessage = {
      id: messageId,
      connectionId: connection.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedMsgs = [...messages, newMessage];
    setMessages(updatedMsgs);
    saveLocalMessages(connection.id, updatedMsgs);

    try {
      await dbSyncService.dualSaveDocument('coparent_chat', messageId, newMessage);
    } catch (err) {
      console.warn('Dual write message error:', err);
    }
  };

  const retryOnlineSync = () => {
    setLoadingConnection(true);
    setUsingFallback(false);
    if (currentUser) {
      SupabaseService.fetchCoparentConnection(currentUser.id)
        .then(supConn => {
          if (supConn) setConnection(supConn);
          setLoadingConnection(false);
        })
        .catch(() => setLoadingConnection(false));
    }
  };

  const value: CoParentingContextType = {
    currentUser,
    connection,
    spaceId: connection?.id || null,
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
  };

  return (
    <CoParentingContext.Provider value={value}>
      {children}
    </CoParentingContext.Provider>
  );
}

export function useCoParenting() {
  const context = useContext(CoParentingContext);
  if (!context) {
    throw new Error('useCoParenting must be used within a CoParentingProvider');
  }
  return context;
}
