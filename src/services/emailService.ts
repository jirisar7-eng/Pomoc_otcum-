export type EmailType = 
  | 'MAGIC_LINK'
  | 'AUTH_CODE'
  | 'WELCOME'
  | 'EVENT_REMINDER'
  | 'FORUM_NOTIFICATION'
  | 'GENERATED_DOCUMENT'
  | 'ADMIN_ALERT'
  | 'CONTACT_MESSAGE';

export interface EmailData {
  code?: string;
  magicUrl?: string;
  userName?: string;
  eventName?: string;
  eventDate?: string;
  eventLocation?: string;
  postTitle?: string;
  threadUrl?: string;
  authorName?: string;
  replyText?: string;
  docTitle?: string;
  docSummary?: string;
  content?: string;
  subject?: string;
  details?: string;
  senderName?: string;
  senderEmail?: string;
  category?: string;
  message?: string;
  [key: string]: any;
}

export interface SendEmailPayload {
  recipientEmail: string;
  code?: string;
  magicUrl?: string;
}

export interface UniversalEmailOptions {
  to: string;
  type: EmailType;
  data: EmailData;
  fromName?: string;
  replyTo?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  delivered?: boolean;
  data?: any;
  error?: string;
}

/**
 * Client-side strict email format validator
 */
export function validateClientEmail(email: string): { isValid: boolean; error?: string; reason?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Zadejte prosím platnou e-mailovou adresu.', reason: 'Prázdný vstup' };
  }
  const raw = email;
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'E-mailová adresa nesmí být prázdná.', reason: 'Prázdný e-mail' };
  }
  if (/\s/.test(raw)) {
    return { isValid: false, error: 'Zadejte prosím platnou e-mailovou adresu bez mezer (např. jmeno@domena.cz).', reason: 'Obsahuje mezery' };
  }
  const atMatches = trimmed.match(/@/g);
  if (!atMatches) {
    return { isValid: false, error: 'Zadejte prosím platnou e-mailovou adresu se zavináčem "@" (např. jmeno@domena.cz).', reason: 'Chybí zavináč @' };
  }
  if (atMatches.length > 1) {
    return { isValid: false, error: 'E-mailová adresa nesmí obsahovat více než jeden zavináč "@".', reason: 'Více zavináčů @' };
  }
  const [localPart, domainPart] = trimmed.split('@');
  if (!localPart) {
    return { isValid: false, error: 'V e-mailové adrese chybí uživatelské jméno před zavináčem "@" (např. jmeno@domena.cz).', reason: 'Chybí jméno před @' };
  }
  if (!domainPart) {
    return { isValid: false, error: 'V e-mailové adrese chybí doména za zavináčem "@" (např. jmeno@domena.cz).', reason: 'Chybí doména za @' };
  }
  if (!domainPart.includes('.')) {
    return { isValid: false, error: 'Doména v e-mailové adrese musí obsahovat tečku a koncovku (např. .cz nebo .com).', reason: 'Doména neobsahuje tečku' };
  }
  const domainParts = domainPart.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) {
    return { isValid: false, error: 'Koncová doména (TLD) musí mít alespoň 2 znaky (např. .cz, .sk, .com).', reason: 'Krátká TLD' };
  }
  const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!STRICT_EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Zadejte prosím platnou e-mailovou adresu ve správném tvaru (např. jmeno@domena.cz).', reason: 'Neodpovídá regex tvaru' };
  }
  return { isValid: true };
}

/**
 * Universal client function for sending emails via WEDOS SMTP backend (/api/send-email)
 */
export async function sendEmail(options: UniversalEmailOptions): Promise<SendEmailResponse> {
  const emailValidation = validateClientEmail(options.to);
  if (!emailValidation.isValid) {
    console.warn('[Client Email Validation Warning] Stornováno odeslání pro neplatný e-mail:', emailValidation.reason);
    return {
      success: false,
      message: emailValidation.error || 'Zadejte prosím platnou e-mailovou adresu ve správném tvaru (např. jmeno@domena.cz).',
      error: emailValidation.error || 'Zadejte prosím platnou e-mailovou adresu ve správném tvaru (např. jmeno@domena.cz).'
    };
  }

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });

    let resultData: any = {};
    try {
      const text = await response.text();
      resultData = JSON.parse(text);
    } catch {
      resultData = { success: false, message: 'Neplatná odpověď ze serveru.' };
    }

    if (!response.ok || resultData.success === false) {
      return {
        success: false,
        message: resultData.message || resultData.error || 'Nepodařilo se odeslat e-mail.',
        error: resultData.error || resultData.message
      };
    }

    return {
      success: true,
      delivered: resultData.delivered ?? true,
      message: 'E-mail byl úspěšně odeslán!',
      data: resultData.data
    };
  } catch (err: any) {
    console.error('sendEmail client error:', err);
    return {
      success: false,
      message: err.message || 'Chyba připojení k e-mailovému serveru.',
      error: err.message
    };
  }
}

/**
 * Verifies 6-digit login code with server (/api/verify-code)
 */
export async function verifyCodeViaServer(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  const emailValidation = validateClientEmail(email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      error: emailValidation.error || 'Zadejte prosím platnou e-mailovou adresu.'
    };
  }

  try {
    const response = await fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });

    let resultData: any = {};
    try {
      const text = await response.text();
      resultData = JSON.parse(text);
    } catch {
      resultData = { success: false, error: 'Neplatná odpověď ze serveru.' };
    }

    if (!response.ok || resultData.success === false) {
      return {
        success: false,
        error: resultData.error || resultData.message || 'Zadaný ověřovací kód je neplatný nebo vypršel.'
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('verifyCodeViaServer error:', err);
    return {
      success: false,
      error: 'Nepodařilo se spojit se serverem pro ověření kódu.'
    };
  }
}

/**
 * Legacy & helper wrapper for sending magic links and 6-digit verification codes
 */
export async function sendMagicLinkEmail(payload: SendEmailPayload): Promise<SendEmailResponse & { code?: string }> {
  const emailValidation = validateClientEmail(payload.recipientEmail);
  if (!emailValidation.isValid) {
    return {
      success: false,
      message: emailValidation.error || 'Zadejte prosím platnou e-mailovou adresu.',
      error: emailValidation.error
    };
  }

  try {
    const response = await fetch('/api/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientEmail: payload.recipientEmail,
        code: payload.code,
        magicUrl: payload.magicUrl
      })
    });

    let resultData: any = {};
    try {
      const text = await response.text();
      resultData = JSON.parse(text);
    } catch {
      resultData = { success: false, message: 'Neplatná odpověď ze serveru.' };
    }

    if (!response.ok || resultData.success === false) {
      return {
        success: false,
        message: resultData.message || resultData.error || 'Nepodařilo se odeslat ověřovací kód.',
        error: resultData.error || resultData.message
      };
    }

    return {
      success: true,
      delivered: resultData.delivered ?? true,
      message: resultData.message || 'Ověřovací kód byl úspěšně odeslán!',
      data: resultData
    };
  } catch (err: any) {
    console.error('sendMagicLinkEmail error:', err);
    return {
      success: false,
      message: err.message || 'Chyba při komunikaci se serverem pro odeslání kódu.',
      error: err.message
    };
  }
}

/**
 * Helper function specifically for sending messages from the contact form
 */
export async function sendContactFormEmail({
  name,
  email,
  category,
  message,
  recipient = 'sarji@seznam.cz'
}: {
  name: string;
  email: string;
  category: string;
  message: string;
  recipient?: string;
}): Promise<SendEmailResponse> {
  const emailValidation = validateClientEmail(email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      message: emailValidation.error || 'Zadejte prosím platnou e-mailovou adresu ve správném tvaru.',
      error: emailValidation.error
    };
  }

  return sendEmail({
    to: recipient,
    type: 'CONTACT_MESSAGE',
    data: {
      senderName: name,
      senderEmail: email,
      category,
      message
    }
  });
}
