/**
 * Testovací API endpoint v Next.js App Router pro ověření připojení k Firebase Firestore
 * @file app/api/test-connection/route.ts
 */

import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  limit, 
  query, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

// Načtení konfigurace Firebase z lokálního JSON nebo z proměnných prostředí
import firebaseConfigJson from '../../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfigJson.appId,
};

// Inicializace Firebase aplikace a Firestore databáze
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export async function GET() {
  const startTime = Date.now();

  try {
    // 1. ZKUŠEBNÍ ZÁPIS do databáze (kolekce 'test_connections')
    const testPayload = {
      status: 'active',
      testedAt: new Date().toISOString(),
      source: 'test-connection-endpoint',
      message: 'Testovací zápis do Firebase Firestore z aplikace Táta má právo'
    };

    const testDocRef = await addDoc(collection(db, 'test_connections'), testPayload);

    // 2. ZKUŠEBNÍ ČTENÍ z databáze
    const q = query(collection(db, 'test_connections'), limit(5));
    const querySnapshot = await getDocs(q);

    const readRecords: Array<{ id: string; [key: string]: any }> = [];
    querySnapshot.forEach((docSnap) => {
      readRecords.push({ id: docSnap.id, ...docSnap.data() });
    });

    // 3. ÚKLID TESTOVACÍHO ZÁZNAMU (smazání po vytvoření)
    if (testDocRef?.id) {
      await deleteDoc(doc(db, 'test_connections', testDocRef.id));
    }

    const latencyMs = Date.now() - startTime;

    // 4. NÁVRATOVÁ JSON ODPOVĚĎ S ÚSPĚCHEM
    return NextResponse.json(
      {
        success: true,
        message: 'Připojení k Firebase proběhlo úspěšně',
        details: {
          database: 'Firebase Firestore',
          projectId: firebaseConfig.projectId,
          operation: 'Zápis (WRITE), Čtení (READ) a Úklid (DELETE)',
          writtenDocId: testDocRef.id,
          readRecordsCount: readRecords.length,
          latencyMs,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;

    // 5. OŠETŘENÍ CHYBOVÉHO STAVU
    return NextResponse.json(
      {
        success: false,
        message: 'Chyba připojení k Firebase databázi',
        error: error?.message || String(error),
        details: {
          code: error?.code || 'UNKNOWN_FIREBASE_ERROR',
          latencyMs,
          projectId: firebaseConfig.projectId
        }
      },
      { status: 500 }
    );
  }
}
