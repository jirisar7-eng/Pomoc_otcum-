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

    const res = await fetch('/api/auth/passkey-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: credentialPayload, user })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || 'Server neuložil biometrický klíč.' };
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
 * and sends the signed challenge response to /api/auth/passkey-verify.
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

    // Format assertion response for server verification
    const responseData = assertion.response as AuthenticatorAssertionResponse;
    const credentialPayload = {
      id: assertion.id,
      rawId: assertion.rawId ? Array.from(new Uint8Array(assertion.rawId)) : [],
      type: assertion.type,
      response: {
        authenticatorData: responseData.authenticatorData ? Array.from(new Uint8Array(responseData.authenticatorData)) : [],
        clientDataJSON: responseData.clientDataJSON ? Array.from(new Uint8Array(responseData.clientDataJSON)) : [],
        signature: responseData.signature ? Array.from(new Uint8Array(responseData.signature)) : []
      }
    };

    // Send to backend endpoint /api/auth/passkey-verify
    const res = await fetch('/api/auth/passkey-verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        credential: credentialPayload,
        email: preferredEmail || undefined
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errJson.error || `Chyba při ověřování Passkey na serveru (HTTP ${res.status}).`
      };
    }

    const data = await res.json();
    if (!data.success || !data.user) {
      return {
        success: false,
        error: data.error || 'Server nepotvrdil biometrické ověření.'
      };
    }

    return {
      success: true,
      user: data.user
    };

  } catch (err: any) {
    console.warn('[PasskeyService] Biometric login error:', err);

    // User cancelled, closed prompt, or no key saved on device for domain
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
