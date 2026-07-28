import { sendEmail, validateEmailFormat } from '../src/services/resendServerService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Metoda není povolena' });
  }

  try {
    const { to, type, data, recipientEmail, code, magicUrl } = req.body || {};
    const recipient = (to || recipientEmail || '').trim();
    const emailType = (type || 'MAGIC_LINK') as any;
    const emailData = data || { code, magicUrl };

    if (!recipient) {
      return res.status(400).json({ success: false, error: 'Chybí cílový e-mail (to).' });
    }

    const validation = validateEmailFormat(recipient);
    if (!validation.isValid) {
      console.warn(`[Handler /api/send-email] Zamítnut neplatný/podezřelý e-mailový vstup: "${recipient}". Důvod: ${validation.reason}`);
      return res.status(200).json({
        success: false,
        error: validation.error || 'Zadejte prosím platnou e-mailovou adresu ve správném tvaru (např. jmeno@domena.cz).'
      });
    }

    const result = await sendEmail({ to: recipient, type: emailType, data: emailData });
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /api/send-email:', error);
    return res.status(200).json({
      success: false,
      error: error?.message || (typeof error === 'string' ? error : JSON.stringify(error)) || 'Nepodařilo se odeslat e-mail přes WEDOS SMTP.'
    });
  }
}
