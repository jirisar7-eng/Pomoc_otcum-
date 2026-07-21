/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from '../types';
import { isBiometricsAvailable } from '../utils/passkey';

/**
 * Checks if Passkeys / WebAuthn biometric authentication is supported by the device/browser.
 */
export async function isPasskeySupported(): Promise<boolean> {
  return await isBiometricsAvailable();
}

export interface PasskeyLoginResult {
  success: boolean;
  user?: User;
  error?: string;
  cancelled?: boolean;
  noKey?: boolean;
}

const PASSKEY_LOCAL_KEY = 'synthesis_hub_passkeys';

interface LocalPasskeyRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: 'admin' | 'user';
  createdAt: string;
}

function getLocalPasskeys(): LocalPasskeyRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PASSKEY_LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalPasskey(record: LocalPasskeyRecord) {
  if (typeof window === 'undefined') return;
  try {
    const list = getLocalPasskeys();
    const updated = list.filter(p => p.id !== record.id);
    updated.push(record);
    localStorage.setItem(PASSKEY_LOCAL_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not save passkey locally:", e);
  }
}

/**
 * Registers a new Passkey for the current user and device using navigator.credentials.create()
 */
export async function registerPasskey(user: User): Promise<{ success: boolean; error?: string; cancelled?: boolean }> {
  try {
    const isSupported = await isPasskeySupported();
    if (!isSupported) {
      return {
        success: false,
        error: 'Biometrické ověření (Passkey) není na tomto zařízení dostupné.'
      };
    }

    const challenge = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(challenge);
    } else {
      for (let i = 0; i < 32; i++) challenge[i] = Math.floor(Math.random() * 256);
    }

    const userIdBytes = new TextEncoder().encode(user.id || user.email || 'user-id');

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'Táta má právo (Synthesis OS)',
        id: typeof window !== 'undefined' && window.location.hostname !== 'localhost'
          ? window.location.hostname
          : undefined
      },
      user: {
        id: userIdBytes,
        name: user.email || 'user@tatovacesta.vercel.app',
        displayName: user.name || 'Aktivní Rodič'
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },  // ES256
        { alg: -257, type: 'public-key' } // RS256
      ],
      authenticatorSelection: {
        userVerification: 'preferred',
        residentKey: 'preferred'
      },
      timeout: 60000,
      attestation: 'none'
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    }) as PublicKeyCredential | null;

    if (!credential) {
      return { success: false, error: 'Nepodařilo se vytvořit biometrický klíč.' };
    }

    // Save Passkey record locally so passkey login works seamlessly even without server API
    const passkeyRecord: LocalPasskeyRecord = {
      id: credential.id,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role || 'user',
      createdAt: new Date().toISOString()
    };
    saveLocalPasskey(passkeyRecord);

    // Optional server sync (non-blocking)
    try {
      const responseData = credential.response as AuthenticatorAttestationResponse;
      const credentialPayload = {
        id: credential.id,
        rawId: credential.rawId ? Array.from(new Uint8Array(credential.rawId)) : [],
        type: credential.type,
        response: {
          clientDataJSON: responseData.clientDataJSON ? Array.from(new Uint8Array(responseData.clientDataJSON)) : [],
          attestationObject: responseData.attestationObject ? Array.from(new Uint8Array(responseData.attestationObject)) : []
        }
      };

      fetch('/api/auth/passkey-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialPayload, user })
      }).catch(() => {});
    } catch {
      // Ignore background server fetch errors
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[PasskeyService] Registration error:', err);
    if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
      return { success: false, error: 'Registrace přístupového klíče byla zrušena.', cancelled: true };
    }
    return { success: false, error: err.message || 'Chyba při registrování přístupového klíče.' };
  }
}

/**
 * Invokes native WebAuthn credential dialog via navigator.credentials.get()
 */
export async function loginWithPasskey(preferredEmail?: string): Promise<PasskeyLoginResult> {
  try {
    const isSupported = await isPasskeySupported();
    if (!isSupported) {
      return {
        success: false,
        error: 'Biometrické přihlášení (Passkey / WebAuthn) není na tomto zařízení dostupné nebo podporované.'
      };
    }

    // Generate random 32-byte challenge
    const challenge = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(challenge);
    } else {
      for (let i = 0; i < 32; i++) {
        challenge[i] = Math.floor(Math.random() * 256);
      }
    }

    // Prepare WebAuthn request options
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: 'preferred',
      rpId: typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? window.location.hostname
        : undefined
    };

    // Trigger browser native Passkey / Biometric prompt
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    }) as PublicKeyCredential | null;

    if (!assertion) {
      return {
        success: false,
        error: 'Snímání biometrie nezískalo žádný přístupový klíč.',
        cancelled: true,
        noKey: true
      };
    }

    // Check local passkey registry first
    const localPasskeys = getLocalPasskeys();
    const matchedRecord = localPasskeys.find(p => p.id === assertion.id);

    if (matchedRecord) {
      const user: User = {
        id: matchedRecord.userId,
        email: matchedRecord.userEmail,
        name: matchedRecord.userName,
        role: matchedRecord.userRole,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(matchedRecord.userEmail)}`,
        createdAt: matchedRecord.createdAt
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('synthesis_hub_local_user', JSON.stringify(user));
      }

      return { success: true, user };
    }

    // Check active local session if available
    if (typeof window !== 'undefined') {
      const localSessionStr = localStorage.getItem('synthesis_hub_local_user');
      if (localSessionStr) {
        try {
          const user = JSON.parse(localSessionStr);
          if (user && user.email) {
            return { success: true, user };
          }
        } catch {}
      }
    }

    // Fallback: If no key was pre-saved locally or active, notify user nicely
    return {
      success: false,
      error: 'V tomto zařízení zatím nemáte vytvořený přístupový klíč pro tuto doménu.',
      cancelled: true,
      noKey: true
    };

  } catch (err: any) {
    console.warn('[PasskeyService] Biometric login error:', err);

    if (
      err.name === 'NotAllowedError' || 
      err.name === 'NotFoundError' ||
      err.name === 'InvalidStateError' ||
      err.name === 'AbortError' || 
      (err.message && err.message.toLowerCase().includes('canceled')) ||
      (err.message && err.message.toLowerCase().includes('cancelled'))
    ) {
      return {
        success: false,
        error: 'V tomto zařízení zatím nemáte vytvořený přístupový klíč (Passkey) pro tuto doménu.',
        cancelled: true,
        noKey: true
      };
    }

    return {
      success: false,
      error: err.message || 'Při snímání biometrického klíče došlo k chybě.'
    };
  }
}
