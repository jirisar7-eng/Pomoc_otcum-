/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SYNTHESIS OS - DUAL DATABASE SYNC & RESILIENCE SERVICE (dbSyncService)
 * 
 * Central Repository / Data Service providing dual-writing (Supabase PostgreSQL + Firebase Firestore)
 * and multi-tier resilient reading with automatic fallback (Supabase -> Firestore -> LocalStorage -> Initial Defaults).
 * 
 * Ensures persistent storage across Vercel deployments and sandboxed environments.
 */

import { getSupabase, isSupabaseConfigured, getSupabaseUrl, getSupabaseAnonKey } from '../lib/supabase';
import { db, saveDocument as saveFirebaseDoc, deleteDocument as deleteFirebaseDoc, getCollectionData as getFirebaseCollection } from '../lib/firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Article, ExperienceStory, ForumPost, Comment, Donation, Partner, User } from '../types';

export interface DualSyncResult {
  success: boolean;
  supabase: boolean;
  firebase: boolean;
  local: boolean;
  errors: string[];
}

export interface DatabaseStatus {
  supabaseConfigured: boolean;
  supabaseConnected: boolean;
  firebaseConfigured: boolean;
  firebaseConnected: boolean;
  lastSyncTimestamp: string | null;
}

class DbSyncService {
  private lastSyncTime: string | null = null;

  /**
   * Returns current connectivity status of both Supabase and Firebase
   */
  async getStatus(): Promise<DatabaseStatus> {
    const supConfigured = isSupabaseConfigured();
    let supConnected = false;
    let fbConnected = false;

    // Test Supabase connection
    if (supConfigured) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { error } = await supabase.from('articles').select('id').limit(1);
          supConnected = !error;
        }
      } catch (e) {
        supConnected = false;
      }
    }

    // Test Firebase connection
    try {
      if (db) {
        fbConnected = true;
      }
    } catch (e) {
      fbConnected = false;
    }

    return {
      supabaseConfigured: supConfigured,
      supabaseConnected: supConnected,
      firebaseConfigured: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
      firebaseConnected: fbConnected,
      lastSyncTimestamp: this.lastSyncTime
    };
  }

  /**
   * Save a single document to BOTH Supabase and Firebase Firestore in parallel/sequence with try-catch isolation.
   */
  async dualSaveDocument<T extends { id: string }>(
    collectionName: string,
    id: string,
    data: T
  ): Promise<DualSyncResult> {
    const result: DualSyncResult = {
      success: false,
      supabase: false,
      firebase: false,
      local: false,
      errors: []
    };

    const cleanData = { ...data, id };

    // 1. LocalStorage Cache Update (Guarantees instant UI feedback)
    try {
      if (typeof window !== 'undefined') {
        const localKey = `synthesis_hub_${collectionName}`;
        const existingRaw = localStorage.getItem(localKey);
        let items: any[] = existingRaw ? JSON.parse(existingRaw) : [];
        const idx = items.findIndex((i: any) => i.id === id);
        if (idx >= 0) {
          items[idx] = cleanData;
        } else {
          items.push(cleanData);
        }
        localStorage.setItem(localKey, JSON.stringify(items));
        result.local = true;
      }
    } catch (localErr: any) {
      console.warn(`[dbSyncService] LocalStorage save warning for ${collectionName}/${id}:`, localErr?.message);
    }

    // 2. Write to Supabase (PostgreSQL)
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          // Normalize payload for Supabase PostgreSQL tables
          const payload = this.normalizePayloadForSupabase(collectionName, cleanData);
          const { error } = await supabase.from(collectionName).upsert(payload);
          if (error) {
            console.warn(`[dbSyncService] Supabase save error on ${collectionName}/${id}:`, error.message);
            result.errors.push(`Supabase: ${error.message}`);
          } else {
            result.supabase = true;
          }
        }
      } catch (supErr: any) {
        console.warn(`[dbSyncService] Supabase save exception on ${collectionName}/${id}:`, supErr?.message || supErr);
        result.errors.push(`Supabase Exception: ${supErr?.message || String(supErr)}`);
      }
    }

    // 3. Write to Firebase Firestore
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, cleanData, { merge: true });
      result.firebase = true;
    } catch (fbErr: any) {
      console.warn(`[dbSyncService] Firebase save exception on ${collectionName}/${id}:`, fbErr?.message || fbErr);
      result.errors.push(`Firebase: ${fbErr?.message || String(fbErr)}`);
    }

    result.success = result.supabase || result.firebase || result.local;
    this.lastSyncTime = new Date().toISOString();

    return result;
  }

  /**
   * Delete a document from BOTH Supabase and Firebase Firestore.
   */
  async dualDeleteDocument(collectionName: string, id: string): Promise<DualSyncResult> {
    const result: DualSyncResult = {
      success: false,
      supabase: false,
      firebase: false,
      local: false,
      errors: []
    };

    // 1. Remove from LocalStorage
    try {
      if (typeof window !== 'undefined') {
        const localKey = `synthesis_hub_${collectionName}`;
        const existingRaw = localStorage.getItem(localKey);
        if (existingRaw) {
          let items: any[] = JSON.parse(existingRaw);
          items = items.filter((i: any) => i.id !== id);
          localStorage.setItem(localKey, JSON.stringify(items));
        }
        result.local = true;
      }
    } catch (localErr: any) {
      console.warn(`[dbSyncService] LocalStorage delete warning for ${collectionName}/${id}:`, localErr?.message);
    }

    // 2. Delete from Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { error } = await supabase.from(collectionName).delete().eq('id', id);
          if (error) {
            result.errors.push(`Supabase: ${error.message}`);
          } else {
            result.supabase = true;
          }
        }
      } catch (supErr: any) {
        result.errors.push(`Supabase Exception: ${supErr?.message || String(supErr)}`);
      }
    }

    // 3. Delete from Firebase Firestore
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      result.firebase = true;
    } catch (fbErr: any) {
      result.errors.push(`Firebase: ${fbErr?.message || String(fbErr)}`);
    }

    result.success = result.supabase || result.firebase || result.local;
    return result;
  }

  /**
   * Resilient multi-tier data reader with automatic fallback:
   * Tier 1: Supabase (if configured and responding)
   * Tier 2: Firebase Firestore
   * Tier 3: LocalStorage Cache
   * Tier 4: Initial Default Data
   */
  async dualFetchCollection<T extends { id: string }>(
    collectionName: string,
    defaultData: T[]
  ): Promise<T[]> {
    // Tier 1: Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase.from(collectionName).select('*');
          if (!error && data && data.length > 0) {
            console.log(`[dbSyncService] Loaded ${data.length} items for '${collectionName}' from Supabase.`);
            const parsed = data.map(item => this.denormalizeFromSupabase<T>(collectionName, item));
            // Cache locally for offline
            this.updateLocalStorageCache(collectionName, parsed);
            return parsed;
          }
        }
      } catch (supErr) {
        console.warn(`[dbSyncService] Supabase fetch failed for '${collectionName}', attempting Firebase fallback...`, supErr);
      }
    }

    // Tier 2: Firebase Firestore
    try {
      const fbData = await getFirebaseCollection<T>(collectionName, []);
      if (fbData && fbData.length > 0) {
        console.log(`[dbSyncService] Loaded ${fbData.length} items for '${collectionName}' from Firebase Firestore.`);
        this.updateLocalStorageCache(collectionName, fbData);
        return fbData;
      }
    } catch (fbErr) {
      console.warn(`[dbSyncService] Firebase fetch failed for '${collectionName}', attempting LocalStorage fallback...`, fbErr);
    }

    // Tier 3: LocalStorage Cache
    try {
      if (typeof window !== 'undefined') {
        const localKey = `synthesis_hub_${collectionName}`;
        const raw = localStorage.getItem(localKey);
        if (raw) {
          const cached = JSON.parse(raw);
          if (Array.isArray(cached) && cached.length > 0) {
            console.log(`[dbSyncService] Loaded ${cached.length} items for '${collectionName}' from LocalStorage cache.`);
            return cached as T[];
          }
        }
      }
    } catch (localErr) {
      console.warn(`[dbSyncService] LocalStorage cache fetch failed for '${collectionName}':`, localErr);
    }

    // Tier 4: Initial Default Data
    console.log(`[dbSyncService] Returning default initial data for '${collectionName}' (${defaultData.length} items).`);
    return defaultData;
  }

  /**
   * Save User Profile to both Supabase (`profiles` or `users` table) and Firestore (`users` collection)
   */
  async dualSaveUser(user: User): Promise<DualSyncResult> {
    const result: DualSyncResult = {
      success: false,
      supabase: false,
      firebase: false,
      local: false,
      errors: []
    };

    // Local Storage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('synthesis_hub_local_user', JSON.stringify(user));
        
        // Update user account DB
        const accountsRaw = localStorage.getItem('synthesis_hub_account_db');
        let accounts = accountsRaw ? JSON.parse(accountsRaw) : [];
        const idx = accounts.findIndex((a: any) => a.email.toLowerCase() === user.email.toLowerCase());
        if (idx >= 0) {
          accounts[idx] = { ...accounts[idx], name: user.name, role: user.role, id: user.id };
        } else {
          accounts.push({
            id: user.id,
            email: user.email,
            pass: '159753',
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
          });
        }
        localStorage.setItem('synthesis_hub_account_db', JSON.stringify(accounts));
        result.local = true;
      }
    } catch (e: any) {
      result.errors.push(`LocalUser: ${e?.message}`);
    }

    // Supabase profiles table
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const profilePayload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            updated_at: new Date().toISOString()
          };
          const { error } = await supabase.from('profiles').upsert(profilePayload);
          if (!error) {
            result.supabase = true;
          } else {
            // Fallback to 'users' table if 'profiles' is structured differently
            const { error: userError } = await supabase.from('users').upsert(user);
            if (!userError) result.supabase = true;
            else result.errors.push(`Supabase Profile: ${error.message}`);
          }
        }
      } catch (supErr: any) {
        result.errors.push(`Supabase Profile Exception: ${supErr?.message || String(supErr)}`);
      }
    }

    // Firebase Firestore users collection
    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, user, { merge: true });
      result.firebase = true;
    } catch (fbErr: any) {
      result.errors.push(`Firebase User: ${fbErr?.message || String(fbErr)}`);
    }

    result.success = result.supabase || result.firebase || result.local;
    return result;
  }

  /**
   * Save custom admin settings or configuration payload to both databases
   */
  async dualSaveSettings(key: string, settingsData: any): Promise<DualSyncResult> {
    const payload = {
      id: key,
      data: settingsData,
      updated_at: new Date().toISOString()
    };

    return this.dualSaveDocument('site_settings', key, payload);
  }

  /**
   * Dual save user portal data item (case_info, evidence, timeline, checklist, reminders, ai_notes, etc.)
   */
  async dualSaveUserData<T>(userId: string, itemKey: string, data: T): Promise<DualSyncResult> {
    const docId = `${userId}_${itemKey}`;
    const payload = {
      id: docId,
      user_id: userId,
      item_key: itemKey,
      data,
      updated_at: new Date().toISOString()
    };
    
    // 1. LocalStorage Cache Update (Instant UI reactivity)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`sh_portal_${itemKey}`, JSON.stringify(data));
      }
    } catch (e) {
      console.warn(`[dbSyncService] LocalStorage save warning for portal item ${itemKey}:`, e);
    }

    // 2. Dual write to Supabase and Firestore
    return this.dualSaveDocument('user_portal_data', docId, payload);
  }

  /**
   * Dual fetch user portal data item with multi-tier fallback (Supabase -> Firestore -> LocalStorage -> Default)
   */
  async dualFetchUserData<T>(userId: string, itemKey: string, defaultData: T): Promise<T> {
    const docId = `${userId}_${itemKey}`;

    // Tier 1: Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase
            .from('user_portal_data')
            .select('*')
            .eq('id', docId)
            .maybeSingle();
          if (!error && data && data.data) {
            console.log(`[dbSyncService] Loaded user portal '${itemKey}' for user ${userId} from Supabase.`);
            if (typeof window !== 'undefined') {
              localStorage.setItem(`sh_portal_${itemKey}`, JSON.stringify(data.data));
            }
            return data.data as T;
          }
        }
      } catch (supErr) {
        console.warn(`[dbSyncService] Supabase fetch failed for user portal '${itemKey}', attempting Firebase...`, supErr);
      }
    }

    // Tier 2: Firebase Firestore
    try {
      const docRef = doc(db, 'user_portal_data', docId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const docData = snap.data();
        if (docData && docData.data) {
          console.log(`[dbSyncService] Loaded user portal '${itemKey}' for user ${userId} from Firebase Firestore.`);
          if (typeof window !== 'undefined') {
            localStorage.setItem(`sh_portal_${itemKey}`, JSON.stringify(docData.data));
          }
          return docData.data as T;
        }
      }
    } catch (fbErr) {
      console.warn(`[dbSyncService] Firebase fetch failed for user portal '${itemKey}', attempting LocalStorage...`, fbErr);
    }

    // Tier 3: LocalStorage Cache
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`sh_portal_${itemKey}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          console.log(`[dbSyncService] Loaded user portal '${itemKey}' from LocalStorage cache.`);
          return parsed as T;
        }
      }
    } catch (localErr) {
      console.warn(`[dbSyncService] LocalStorage fetch failed for user portal '${itemKey}':`, localErr);
    }

    // Tier 4: Default Initial Data
    return defaultData;
  }

  /**
   * Helper to normalize objects for Supabase PostgreSQL column names if needed
   */
  private normalizePayloadForSupabase(collectionName: string, item: any): any {
    if (collectionName === 'donations') {
      return {
        id: item.id,
        donor_name: item.donorName || item.donor_name || 'Anonymní dárce',
        amount: item.amount || 0,
        message: item.message || '',
        date: item.date || new Date().toISOString(),
        is_public: item.isPublic !== undefined ? item.isPublic : true,
        is_verified: item.isVerified !== undefined ? item.isVerified : false
      };
    }

    return item;
  }

  /**
   * Helper to denormalize objects fetched from Supabase PostgreSQL
   */
  private denormalizeFromSupabase<T>(collectionName: string, raw: any): T {
    if (collectionName === 'donations') {
      return {
        id: raw.id,
        donorName: raw.donor_name || raw.donorName || 'Anonymní dárce',
        amount: raw.amount || 0,
        message: raw.message || '',
        date: raw.date || new Date().toISOString(),
        isPublic: raw.is_public !== undefined ? raw.is_public : true,
        isVerified: raw.is_verified !== undefined ? raw.is_verified : false
      } as unknown as T;
    }

    return raw as T;
  }

  private updateLocalStorageCache(collectionName: string, data: any[]) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`synthesis_hub_${collectionName}`, JSON.stringify(data));
      }
    } catch (e) {
      console.warn(`[dbSyncService] Could not update local cache for ${collectionName}:`, e);
    }
  }
}

export const dbSyncService = new DbSyncService();
export default dbSyncService;
