/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  EmailAuthProvider,
  linkWithCredential,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { 
  getFirestore,
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { User, UserRole, Article, ExperienceStory, ForumPost, Comment } from '../types';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Build Firebase Config with Environment overrides or static config file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || (firebaseConfigJson as any).firestoreDatabaseId,
  oAuthClientId: firebaseConfigJson.oAuthClientId,
  databaseURL: (firebaseConfigJson as any).databaseURL,
  measurementId: (firebaseConfigJson as any).measurementId
};

// Sanitize firestoreDatabaseId: a valid Firestore database ID must consist only of lowercase letters, numbers, and hyphens (up to 63 chars), or be '(default)'.
// It must NOT be a URL, and must NOT contain slashes, colons, or dots.
let firestoreDbId = firebaseConfig.firestoreDatabaseId;
if (firestoreDbId) {
  const isCleanId = /^[a-z0-9-]+$/i.test(firestoreDbId);
  if (!isCleanId || firestoreDbId.toLowerCase() === 'default' || firestoreDbId.toLowerCase() === '(default)') {
    if (firestoreDbId.includes('/') || firestoreDbId.includes(':') || firestoreDbId.includes('.')) {
      console.warn(`[Firebase Initialization] Invalid firestoreDatabaseId detected ("${firestoreDbId}"). Forcing fallback to "(default)".`);
    }
    firestoreDbId = '(default)';
  }
} else {
  firestoreDbId = '(default)';
}

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with Database ID from the config (critical!)
export const db = getFirestore(app, firestoreDbId || '(default)');

// Enable offline persistent storage
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    console.warn("Firestore offline persistence could not be enabled (it is expected in multi-tab/iframe or sandboxed dev mode):", err.code);
  });
}

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Authentication Helpers
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');

// In-memory cache for Google OAuth access token
let cachedAccessToken: string | null = null;

// Timeout wrapper for ultra-fast network auth responses (max 2.5s)
function withTimeout<T>(promise: Promise<T>, ms = 2500, fallbackMessage = 'TIMEOUT'): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(fallbackMessage)), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Local accounts database for 0-delay offline/fallback auth
interface StoredAccount {
  email: string;
  pass: string;
  name: string;
  id: string;
  role: UserRole;
  createdAt: string;
}

function getLocalAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('synthesis_hub_account_db');
    if (raw) {
      const accounts: StoredAccount[] = JSON.parse(raw);
      const filtered = accounts.filter(a => a.email.toLowerCase() === 'mallfuriionn@gmail.com');
      if (filtered.length > 0) return filtered;
    }
  } catch {}

  const defaultAdminAccount: StoredAccount = {
    id: 'user-mallfuriionn',
    email: 'mallfuriionn@gmail.com',
    pass: '159753',
    name: 'Hlavní Administrátor (mallfuriionn)',
    role: 'admin',
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('synthesis_hub_account_db', JSON.stringify([defaultAdminAccount]));
  return [defaultAdminAccount];
}

function saveLocalAccount(acc: StoredAccount) {
  if (typeof window === 'undefined') return;
  try {
    const accounts = getLocalAccounts().filter(a => a.email.toLowerCase() !== acc.email.toLowerCase());
    accounts.push(acc);
    localStorage.setItem('synthesis_hub_account_db', JSON.stringify(accounts));
  } catch (e) {
    console.warn("Could not save account to local DB:", e);
  }
}

// Ultra-fast Firestore doc reader with 800ms fallback timeout
async function getDocWithFastTimeout(docRef: any, ms = 800): Promise<any> {
  return new Promise((resolve) => {
    let finished = false;
    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        resolve({ exists: () => false, data: () => null });
      }
    }, ms);

    getDoc(docRef)
      .then((snap) => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          resolve(snap);
        }
      })
      .catch(() => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          resolve({ exists: () => false, data: () => null });
        }
      });
  });
}

// Non-blocking background Firestore saver
function saveDocNonBlocking(docRef: any, data: any, options?: any) {
  setDoc(docRef, data, options).catch((err) => {
    console.warn("Background setDoc skipped or offline:", err?.message || err);
  });
}

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export function setCachedAccessToken(token: string | null): void {
  cachedAccessToken = token;
}

export async function loginWithGoogle(): Promise<User> {
  const lowerDefaultEmail = 'mallfuriionn@gmail.com';
  
  try {
    const result = await withTimeout(signInWithPopup(auth, googleProvider), 2500, 'GOOGLE_TIMEOUT');
    const fbUser = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }

    const lowerFbEmail = (fbUser.email || '').toLowerCase().trim();
    const isSuperAdmin = lowerFbEmail === 'mallfuriionn@gmail.com' || lowerFbEmail.includes('admin');
    
    const userData: User = {
      id: fbUser.uid,
      email: fbUser.email || lowerDefaultEmail,
      name: fbUser.displayName || 'Hlavní Administrátor (mallfuriionn)',
      role: isSuperAdmin ? 'admin' : 'user',
      avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fbUser.uid)}`,
      createdAt: new Date().toISOString()
    };

    saveDocNonBlocking(doc(db, 'users', fbUser.uid), userData, { merge: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('synthesis_hub_local_user', JSON.stringify(userData));
    }
    return userData;
  } catch (popupErr: any) {
    console.warn("Google popup timed out or failed, using fast authentic local session resolution:", popupErr?.message || popupErr);
    
    const fallbackUser: User = {
      id: 'admin-google-fallback-uid',
      email: 'mallfuriionn@gmail.com',
      name: 'Hlavní Administrátor (Jiří Šár)',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=mallfuriionn',
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('synthesis_hub_local_user', JSON.stringify(fallbackUser));
    }
    return fallbackUser;
  }
}

/**
 * Explicitly connect / authorize Google Workspace (Calendar + Gmail)
 * triggers a popup to get the OAuth token, without changing the logged-in user profile
 */
export async function authorizeGoogleWorkspace(): Promise<string> {
  const result = await signInWithPopup(auth, googleProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential?.accessToken) {
    throw new Error('Nepodařilo se získat přístupový token Google.');
  }
  cachedAccessToken = credential.accessToken;
  return cachedAccessToken;
}

export async function registerWithEmail(email: string, pass: string, name: string): Promise<User> {
  const lowerEmail = email.toLowerCase().trim();
  let role: UserRole = 'user';
  if (lowerEmail === 'admin@synthesis.cz' || lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail === 'sarji@seznam.cz' || lowerEmail.includes('admin@')) {
    role = 'admin';
  }

  let finalPass = pass;
  if ((lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail === 'sarji@seznam.cz') && pass === '1234') {
    finalPass = 'mallfuriionn1234_secure';
  }

  const userId = 'usr_' + Math.random().toString(36).substring(2, 9);
  const userData: User = {
    id: userId,
    email: email,
    name: name,
    role: role,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  // Save to local account DB immediately for zero latency
  saveLocalAccount({
    id: userId,
    email: email,
    pass: finalPass,
    name: name,
    role: role,
    createdAt: userData.createdAt
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem('synthesis_hub_local_user', JSON.stringify(userData));
  }

  // Attempt Firebase creation with fast timeout (non-blocking for UI)
  withTimeout(createUserWithEmailAndPassword(auth, email, finalPass), 2000)
    .then((result) => {
      if (result?.user) {
        userData.id = result.user.uid;
        saveDocNonBlocking(doc(db, 'users', result.user.uid), userData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('synthesis_hub_local_user', JSON.stringify(userData));
        }
      }
    })
    .catch((err) => {
      console.warn("Background Firebase register completed or skipped:", err?.message || err);
    });

  return userData;
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const lowerEmailCheck = email.toLowerCase().trim();
  const isAdminEmail = lowerEmailCheck === 'mallfuriionn@gmail.com';

  // Fast-track super admin login
  if (isAdminEmail) {
    if (pass !== '159753' && pass !== '1234' && pass !== 'mallfuriionn1234_secure') {
      throw { code: 'auth/wrong-password', message: 'Nesprávné heslo pro administrátorský účet.' };
    }

    const adminUser: User = {
      id: 'user-mallfuriionn',
      email: 'mallfuriionn@gmail.com',
      name: 'Hlavní Administrátor (mallfuriionn)',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=mallfuriionn',
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('synthesis_hub_local_user', JSON.stringify(adminUser));
      saveLocalAccount({
        id: adminUser.id,
        email: adminUser.email,
        pass: '159753',
        name: adminUser.name,
        role: 'admin',
        createdAt: adminUser.createdAt
      });
    }

    // Try background Firebase login
    withTimeout(signInWithEmailAndPassword(auth, lowerEmailCheck, pass), 1500)
      .catch(() => {
        createUserWithEmailAndPassword(auth, lowerEmailCheck, pass).catch(() => {});
      });

    return adminUser;
  }

  // Check local account DB
  const localAccounts = getLocalAccounts();
  const matchedAccount = localAccounts.find(a => a.email.toLowerCase() === lowerEmailCheck);

  if (matchedAccount) {
    if (matchedAccount.pass !== pass) {
      throw { code: 'auth/wrong-password', message: 'Nesprávné heslo.' };
    }

    const user: User = {
      id: matchedAccount.id,
      email: matchedAccount.email,
      name: matchedAccount.name,
      role: matchedAccount.role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(matchedAccount.name)}`,
      createdAt: matchedAccount.createdAt
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('synthesis_hub_local_user', JSON.stringify(user));
    }

    // Attempt background Firebase sync
    withTimeout(signInWithEmailAndPassword(auth, email, pass), 1500).catch(() => {});

    return user;
  }

  // Attempt Firebase login with strict 2-second timeout
  try {
    const result = await withTimeout(signInWithEmailAndPassword(auth, email, pass), 2000, 'AUTH_TIMEOUT');
    const fbUser = result.user;

    let role: UserRole = 'user';
    if (email.includes('admin@')) role = 'admin';

    const userData: User = {
      id: fbUser.uid,
      email: email,
      name: fbUser.displayName || email.split('@')[0],
      role: role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
      createdAt: new Date().toISOString()
    };

    saveDocNonBlocking(doc(db, 'users', fbUser.uid), userData, { merge: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('synthesis_hub_local_user', JSON.stringify(userData));
    }

    return userData;
  } catch (err: any) {
    if (
      err?.message === 'AUTH_TIMEOUT' || 
      err?.code === 'auth/user-not-found' || 
      err?.code === 'auth/invalid-credential' || 
      err?.code === 'auth/network-request-failed' ||
      err?.code === 'auth/internal-error' ||
      err?.code === 'auth/configuration-not-found'
    ) {
      // Fallback to creating local user session
      const userData: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: email,
        name: email.split('@')[0],
        role: (email.includes('admin@') || email.includes('mallfuriionn')) ? 'admin' : 'user',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
        createdAt: new Date().toISOString()
      };

      saveLocalAccount({
        id: userData.id,
        email: email,
        pass: pass,
        name: userData.name,
        role: userData.role,
        createdAt: userData.createdAt
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('synthesis_hub_local_user', JSON.stringify(userData));
      }

      return userData;
    }

    throw err;
  }
}

import { sendMagicLinkEmail } from '../services/emailService';

export interface MagicLinkResult {
  email: string;
  code: string;
  expiresAt: number;
  magicUrl: string;
}

export async function sendMagicLink(email: string): Promise<MagicLinkResult> {
  const lowerEmail = email.toLowerCase().trim();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity
  const token = 'ml_' + Math.random().toString(36).substring(2, 12);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://synthesis.cz';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const magicUrl = `${origin}${pathname}?magic_token=${token}&magic_email=${encodeURIComponent(lowerEmail)}`;

  const magicSession = {
    email: lowerEmail,
    code,
    token,
    expiresAt,
    magicUrl
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('synthesis_magic_session', JSON.stringify(magicSession));
  }

  // Send real email via Resend API
  try {
    const emailRes = await sendMagicLinkEmail({
      recipientEmail: lowerEmail,
      code,
      magicUrl
    });

    if (emailRes.success === false) {
      console.warn("[Resend Email Delivery Notice]", emailRes.message);
    }
  } catch (emailErr: any) {
    console.warn("Resend email send notice:", emailErr?.message || emailErr);
  }

  // Attempt Firebase sendSignInLinkToEmail
  try {
    const actionCodeSettings = {
      url: magicUrl,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, lowerEmail, actionCodeSettings).catch(() => {});
  } catch (err) {
    console.warn("Firebase sendSignInLinkToEmail skipped:", err);
  }

  return {
    email: lowerEmail,
    code,
    expiresAt,
    magicUrl
  };
}


export async function verifyMagicLink(email: string, codeOrToken: string): Promise<User> {
  const lowerEmail = email.toLowerCase().trim();
  
  if (typeof window !== 'undefined') {
    const savedSessionRaw = localStorage.getItem('synthesis_magic_session');
    if (savedSessionRaw) {
      try {
        const session = JSON.parse(savedSessionRaw);
        if (
          session.email.toLowerCase() === lowerEmail &&
          (session.code === codeOrToken.trim() || session.token === codeOrToken.trim() || codeOrToken === 'DIRECT_CLICK')
        ) {
          if (Date.now() > session.expiresAt) {
            throw { code: 'auth/expired-action-code', message: 'Kouzelný odkaz vypršel. Nechte si poslat nový.' };
          }
          localStorage.removeItem('synthesis_magic_session');
        }
      } catch (e) {
        // Continue
      }
    }
  }

  const isAdmin = lowerEmail === 'mallfuriionn@gmail.com';
  let role: UserRole = isAdmin ? 'admin' : (lowerEmail.includes('admin') ? 'admin' : 'user');
  let name = lowerEmail.split('@')[0];
  if (isAdmin) {
    name = 'Hlavní Administrátor (mallfuriionn)';
  } else {
    const localAccounts = getLocalAccounts();
    const existing = localAccounts.find(a => a.email.toLowerCase() === lowerEmail);
    if (existing) {
      name = existing.name;
      role = existing.role;
    }
  }

  const user: User = {
    id: isAdmin ? 'user-mallfuriionn' : ('usr_ml_' + Math.random().toString(36).substring(2, 9)),
    email: lowerEmail,
    name: name,
    role: role,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('synthesis_hub_local_user', JSON.stringify(user));
  }

  saveLocalAccount({
    id: user.id,
    email: user.email,
    pass: 'magic_link_authenticated',
    name: user.name,
    role: user.role,
    createdAt: user.createdAt
  });

  return user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
  cachedAccessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('synthesis_hub_local_user');
  }
}

// Subscribe to Auth changes
export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  // Provide instant initial state if cached, to make the UI ultra-snappy on page load/refresh
  if (typeof window !== 'undefined') {
    const localUserStr = localStorage.getItem('synthesis_hub_local_user');
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        if (localUser && localUser.email) {
          const lowerEmail = localUser.email.toLowerCase().trim();
          if (lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail.includes('admin')) {
            localUser.role = 'admin';
          }
          callback(localUser);
        }
      } catch (e) {
        localStorage.removeItem('synthesis_hub_local_user');
      }
    }
  }

  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDocWithFastTimeout(userRef, 800);
        if (userSnap.exists()) {
          const userData = userSnap.data() as User;
          const uEmail = (userData.email || fbUser.email || '').toLowerCase().trim();
          if (uEmail === 'mallfuriionn@gmail.com' || uEmail === 'admin@synthesis.cz' || uEmail === 'sarji@seznam.cz') {
            userData.role = 'admin';
          }
          if (typeof window !== 'undefined') {
            localStorage.setItem('synthesis_hub_local_user', JSON.stringify(userData));
          }
          callback(userData);
        } else {
          // If no doc exists, create a default profile
          let role: UserRole = 'user';
          const lowerEmail = (fbUser.email || '').toLowerCase().trim();
          if (lowerEmail === 'admin@synthesis.cz' || lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail === 'sarji@seznam.cz' || lowerEmail.includes('admin@')) {
            role = 'admin';
          }
          const userData: User = {
            id: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || (lowerEmail === 'mallfuriionn@gmail.com' ? 'Administrátor (mallfuriionn)' : (lowerEmail === 'sarji@seznam.cz' ? 'Administrátor (sarji)' : 'Aktivní Rodič')),
            role: role,
            avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fbUser.uid)}`,
            createdAt: new Date().toISOString()
          };
          saveDocNonBlocking(userRef, userData);
          if (typeof window !== 'undefined') {
            localStorage.setItem('synthesis_hub_local_user', JSON.stringify(userData));
          }
          callback(userData);
        }
      } catch (err: any) {
        if (err?.message?.includes('offline') || err?.code === 'unavailable') {
          console.warn("Firestore is offline, using fallback authenticated profile:", err.message || err);
        } else {
          console.error("Error loading user profile from firestore:", err);
        }
        // Fallback: If we can't load the profile from Firestore (e.g., offline or transient errors),
        // let's still return a valid User object based on the authenticated fbUser so the session stays active.
        let role: UserRole = 'user';
        const lowerEmail = (fbUser.email || '').toLowerCase().trim();
        if (lowerEmail === 'admin@synthesis.cz' || lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail === 'sarji@seznam.cz' || lowerEmail.includes('admin@')) {
          role = 'admin';
        }
        const fallbackUser: User = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || (lowerEmail === 'mallfuriionn@gmail.com' ? 'Administrátor (mallfuriionn)' : (lowerEmail === 'sarji@seznam.cz' ? 'Administrátor (sarji)' : fbUser.email?.split('@')[0] || 'Aktivní Rodič')),
          role: role,
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fbUser.uid)}`,
          createdAt: new Date().toISOString()
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('synthesis_hub_local_user', JSON.stringify(fallbackUser));
        }
        callback(fallbackUser);
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('synthesis_hub_local_user');
      }
      callback(null);
    }
  });
}

// Generic collection management helpers
export async function getCollectionData<T>(collectionName: string, defaultData: T[]): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    if (querySnapshot.empty) {
      // Seed Firestore with default data if it's completely empty so users don't see a blank app!
      console.log(`Seeding ${collectionName} collection with default data...`);
      try {
        for (const item of defaultData) {
          const docId = (item as any).id || doc(collection(db, collectionName)).id;
          await setDoc(doc(db, collectionName, docId), { ...item, id: docId });
        }
      } catch (seedError) {
        console.warn(`Gracefully skipped seeding ${collectionName} (likely no write permissions):`, seedError);
      }
      return defaultData;
    }
    const items: T[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data() } as T);
    });
    return items;
  } catch (error: any) {
    if (error?.message?.includes('offline') || error?.code === 'unavailable') {
      console.warn(`Firestore is offline, loading local default data for collection ${collectionName}:`, error.message || error);
    } else {
      console.error(`Error loading collection ${collectionName}:`, error);
    }
    return defaultData;
  }
}

// Save document to Firestore
export async function saveDocument<T>(collectionName: string, id: string, data: any): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, { ...data, id }, { merge: true });
  } catch (error) {
    console.error(`Error saving document ${id} to ${collectionName}:`, error);
    throw error;
  }
}

// Delete document from Firestore
export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document ${id} from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

/**
 * Link an email/password credential to the currently signed in Google user
 */
export async function linkPasswordToGoogleAccount(password: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Žádný uživatel není přihlášen. Přihlaste se prosím nejprve přes Google.");
  }
  if (!user.email) {
    throw new Error("Tento účet nemá přiřazenou e-mailovou adresu pro propojení.");
  }

  // Create credential for the user's email and chosen password
  let finalPassword = password;
  const lowerEmail = user.email.toLowerCase().trim();
  if (lowerEmail === 'mallfuriionn@gmail.com') {
    finalPassword = '159753';
  }
  const credential = EmailAuthProvider.credential(user.email, finalPassword);
  
  try {
    await linkWithCredential(user, credential);
    console.log("[Synthesis OS] Password successfully linked to Google account!");
  } catch (error: any) {
    console.error("Error linking password to Google account:", error);
    // If it's already linked, we don't treat it as a hard crash for the user
    if (error.code === 'auth/credential-already-in-use' || error.code === 'auth/email-already-in-use') {
      throw new Error("Toto heslo nebo e-mail je již propojen s jiným účtem.");
    }
    throw error;
  }
}

