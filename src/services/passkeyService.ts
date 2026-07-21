/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from '../types';

/**
 * Checks if Passkeys / WebAuthn biometric authentication is supported by the device/browser.
 */
export async function isPasskeySupported(): Promise<boolean> {
  try {
    if (
      typeof window === 'undefined' ||
      !window.PublicKeyCredential ||
      typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function'
    ) {
      return false;
    }

    const isAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return isAvailable;
  } catch (error) {
    console.warn('[PasskeyService] Failed to check platform authenticator availability:', error);
    return false;
  }
}

export interface PasskeyLoginResult {
  success: boolean;
  user?: User;
  error?: string;
  cancelled?: boolean;
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
        cancelled: true
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

    // User cancelled or closed the prompt
    if (
      err.name === 'NotAllowedError' || 
      err.name === 'AbortError' || 
      (err.message && err.message.toLowerCase().includes('canceled')) ||
      (err.message && err.message.toLowerCase().includes('cancelled'))
    ) {
      return {
        success: false,
        error: 'Biometrické ověření bylo zrušeno uživatelem.',
        cancelled: true
      };
    }

    return {
      success: false,
      error: err.message || 'Při snímání biometrického klíče došlo k chybě.'
    };
  }
}
