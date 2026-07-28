import { sendEmail, validateEmailFormat, generateNumericCode } from '../src/services/resendServerService';

export interface ResendEmailResult {
  success: boolean;
  delivered?: boolean;
  message?: string;
  messageId?: string;
  provider?: string;
  code?: string;
  error?: string;
}

export async function sendResendEmail({ recipientEmail, code, magicUrl }: { recipientEmail: string; code?: string; magicUrl?: string }): Promise<ResendEmailResult> {
  const codeToUse = (code && /^\d{6}$/.test(String(code).trim()))
    ? String(code).trim()
    : generateNumericCode();

  const result = await sendEmail({
    to: recipientEmail,
    type: 'MAGIC_LINK',
    data: { code: codeToUse, magicUrl }
  });

  return {
    success: result.success,
    delivered: result.delivered ?? true,
    code: codeToUse,
    message: result.message || 'Šestimístný ověřovací kód byl úspěšně vygenerován a odeslán přes WEDOS SMTP.',
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

    if (!targetEmail) {
      return res.status(400).json({ success: false, error: 'Chybí cílový e-mail.' });
    }

    const validation = validateEmailFormat(targetEmail);
    if (!validation.isValid) {
      console.warn(`[Handler /api/send-code] Zamítnut neplatný/podezřelý e-mailový vstup: "${targetEmail}". Důvod: ${validation.reason}`);
      return res.status(200).json({
        success: false,
        error: validation.error || 'Zadejte prosím platnou e-mailovou adresu ve správném tvaru (např. jmeno@domena.cz).'
      });
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
