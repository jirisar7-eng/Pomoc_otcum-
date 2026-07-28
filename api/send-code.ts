import { sendEmail } from '../src/services/resendServerService';

export interface ResendEmailResult {
  success: boolean;
  delivered?: boolean;
  message?: string;
  messageId?: string;
  provider?: string;
  error?: string;
}

export async function sendResendEmail({ recipientEmail, code, magicUrl }: { recipientEmail: string; code: string; magicUrl?: string }): Promise<ResendEmailResult> {
  const result = await sendEmail({
    to: recipientEmail,
    type: 'MAGIC_LINK',
    data: { code, magicUrl }
  });

  return {
    success: result.success,
    delivered: result.delivered ?? true,
    message: result.message || 'Kód byl odeslán přes WEDOS SMTP.',
    provider: 'wedos_smtp',
    error: result.error
  };
}

// Backward compatibility alias
export const sendBrevoEmail = sendResendEmail;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Metoda není povolena' });
  }

  try {
    const { recipientEmail, email, code, magicUrl } = req.body || {};
    const targetEmail = (recipientEmail || email || '').trim();

    if (!targetEmail || !code) {
      return res.status(400).json({ success: false, error: 'Chybí e-mail nebo kód' });
    }

    const result = await sendResendEmail({ recipientEmail: targetEmail, code, magicUrl });
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /api/send-code:', error);
    return res.status(200).json({
      success: false,
      error: error?.message || (typeof error === 'string' ? error : JSON.stringify(error)) || 'Chyba při odesílání e-mailu přes WEDOS SMTP.'
    });
  }
}
