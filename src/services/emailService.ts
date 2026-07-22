export interface SendEmailPayload {
  recipientEmail: string;
  code: string;
  magicUrl?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  delivered?: boolean;
}

export async function sendMagicLinkEmail(payload: SendEmailPayload): Promise<SendEmailResponse> {
  try {
    const response = await fetch('/api/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data: any = {};
    try {
      const text = await response.text();
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: 'Neplatná odpověď ze serveru.' };
    }

    if (!response.ok || data.success === false) {
      return {
        success: false,
        message: data.message || data.error || 'Nepodařilo se odeslat e-mail s kódem.'
      };
    }

    return {
      success: true,
      delivered: data.delivered ?? true,
      message: 'Kód byl úspěšně odeslán do vaší e-mailové schránky!'
    };
  } catch (err: any) {
    console.error('sendMagicLinkEmail client error:', err);
    return {
      success: false,
      message: err.message || 'Chyba připojení k e-mailovému serveru.'
    };
  }
}
