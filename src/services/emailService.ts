export type EmailType = 
  | 'MAGIC_LINK'
  | 'AUTH_CODE'
  | 'WELCOME'
  | 'EVENT_REMINDER'
  | 'FORUM_NOTIFICATION'
  | 'GENERATED_DOCUMENT'
  | 'ADMIN_ALERT';

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
  [key: string]: any;
}

export interface SendEmailPayload {
  recipientEmail: string;
  code: string;
  magicUrl?: string;
}

export interface UniversalEmailOptions {
  to: string;
  type: EmailType;
  data: EmailData;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  delivered?: boolean;
  data?: any;
  error?: string;
}

/**
 * Universal client function for sending emails via Resend backend (/api/send-email)
 */
export async function sendEmail(options: UniversalEmailOptions): Promise<SendEmailResponse> {
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
 * Legacy & helper wrapper for sending magic links via Resend
 */
export async function sendMagicLinkEmail(payload: SendEmailPayload): Promise<SendEmailResponse> {
  return sendEmail({
    to: payload.recipientEmail,
    type: 'MAGIC_LINK',
    data: {
      code: payload.code,
      magicUrl: payload.magicUrl
    }
  });
}
