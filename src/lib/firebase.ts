/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
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
  orderBy
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
  oAuthClientId: firebaseConfigJson.oAuthClientId
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with Database ID from the config (critical!)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Initialize Authentication
export const auth = getAuth(app);

// Authentication Helpers
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');

// In-memory cache for Google OAuth access token
let cachedAccessToken: string | null = null;

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export function setCachedAccessToken(token: string | null): void {
  cachedAccessToken = token;
}

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;
  
  // Cache the access token in memory
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (credential?.accessToken) {
    cachedAccessToken = credential.accessToken;
  }
  
  // Check if profile already exists, otherwise create it
  const userRef = doc(db, 'users', fbUser.uid);
  const userSnap = await getDoc(userRef);
  
  let role: UserRole = 'user';
  // If email is administrator, default to admin
  if (fbUser.email && (fbUser.email === 'admin@synthesis.cz' || fbUser.email.includes('admin@'))) {
    role = 'admin';
  }

  const userData: User = {
    id: fbUser.uid,
    email: fbUser.email || '',
    name: fbUser.displayName || 'Uživatel',
    role: userSnap.exists() ? (userSnap.data().role as UserRole) : role,
    avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fbUser.displayName || fbUser.uid)}`,
    createdAt: userSnap.exists() ? userSnap.data().createdAt : new Date().toISOString()
  };

  // Persist / update profile in Firestore
  await setDoc(userRef, userData, { merge: true });
  return userData;
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
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const fbUser = result.user;

  let role: UserRole = 'user';
  if (email === 'admin@synthesis.cz' || email.includes('admin@')) {
    role = 'admin';
  }

  const userData: User = {
    id: fbUser.uid,
    email: email,
    name: name,
    role: role,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'users', fbUser.uid), userData);
  return userData;
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const fbUser = result.user;

  const userRef = doc(db, 'users', fbUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as User;
  } else {
    // Fallback if auth exists but no Firestore profile was created
    let role: UserRole = 'user';
    if (email === 'admin@synthesis.cz' || email.includes('admin@')) {
      role = 'admin';
    }
    const userData: User = {
      id: fbUser.uid,
      email: email,
      name: fbUser.displayName || 'Aktivní Rodič',
      role: role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
      createdAt: new Date().toISOString()
    };
    await setDoc(userRef, userData);
    return userData;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
  cachedAccessToken = null;
}

// Subscribe to Auth changes
export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          callback(userSnap.data() as User);
        } else {
          // If no doc exists, create a default profile
          let role: UserRole = 'user';
          if (fbUser.email === 'admin@synthesis.cz' || (fbUser.email && fbUser.email.includes('admin@'))) {
            role = 'admin';
          }
          const userData: User = {
            id: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || 'Aktivní Rodič',
            role: role,
            avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fbUser.uid)}`,
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, userData);
          callback(userData);
        }
      } catch (err) {
        console.error("Error loading user profile from firestore:", err);
        callback(null);
      }
    } else {
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
  } catch (error) {
    console.error(`Error loading collection ${collectionName}:`, error);
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
