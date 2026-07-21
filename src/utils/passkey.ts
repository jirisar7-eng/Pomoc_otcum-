/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Checks if Passkeys / WebAuthn platform authenticator (fingerprint / FaceID)
 * is supported on the current device and browser according to MDN specification.
 */
export const isBiometricsAvailable = async (): Promise<boolean> => {
  try {
    if (
      typeof window !== 'undefined' &&
      'PublicKeyCredential' in window &&
      typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
    ) {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
  } catch (error) {
    console.warn('Chyba při detekci Passkeys/WebAuthn:', error);
  }
  return false;
};
