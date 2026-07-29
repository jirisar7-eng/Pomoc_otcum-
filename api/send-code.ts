import { sendEmail, validateEmailFormat, generateNumericCode } from './_wedosSmtp.js';

export interface WedosEmailResult {
  success: boolean;
  delivered?: boolean;
  message?: string;
  messageId?: string;
  provider?: string;
  code?: string;
  error?: string;
}

export type ResendEmailResult = WedosEmailResult;

export async function sendWedosEmail({ recipientEmail, code, magicUrl }: { recipientEmail: string; code?: string; magicUrl?: string }): Promise<WedosEmailResult> {
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

// Backward compatibility aliases
export const sendResendEmail = sendWedosEmail;
export const sendBrevoEmail = sendWedosEmail;

export default async function handler(req: any, res: any) {
  // CORS Headers for Vercel Serverless Functions
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const bodyData = req.body || {};
    const queryData = req.query || {};
    const recipientEmail = bodyData.recipientEmail || bodyData.email || queryData.recipientEmail || queryData.email;
    const code = bodyData.code || queryData.code;
    const magicUrl = bodyData.magicUrl || queryData.magicUrl;

    const targetEmail = (recipientEmail || '').trim();

    if (!targetEmail) {
      if (req.method === 'GET') {
        return res.status(200).json({
          success: true,
          status: 'online',
          endpoint: '/api/send-code',
          message: 'Endpoint /api/send-code je plně aktivní. Odesílejte požadavky pomocí POST nebo GET s parametrem email.'
        });
      }
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

    const result = await sendWedosEmail({ recipientEmail: targetEmail, code, magicUrl });
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /api/send-code:', error);
    return res.status(200).json({
      success: false,
      error: error?.message || (typeof error === 'string' ? error : JSON.stringify(error)) || 'Chyba při odesílání e-mailu přes WEDOS SMTP.'
    });
  }
}
