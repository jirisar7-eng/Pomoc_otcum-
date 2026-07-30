import { sendEmail, validateEmailFormat } from './_wedosSmtp.js';

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

    const to = bodyData.to || bodyData.recipientEmail || queryData.to || queryData.recipientEmail;
    const type = bodyData.type || queryData.type || 'MAGIC_LINK';
    const fromName = bodyData.fromName || queryData.fromName;
    const data = {
      code: bodyData.code || queryData.code,
      magicUrl: bodyData.magicUrl || queryData.magicUrl,
      senderName: bodyData.senderName || queryData.senderName,
      senderEmail: bodyData.senderEmail || queryData.senderEmail,
      category: bodyData.category || queryData.category,
      message: bodyData.message || queryData.message,
      subject: bodyData.subject || queryData.subject,
      ...(bodyData.data || {})
    };
    const replyTo = bodyData.replyTo || queryData.replyTo || data.senderEmail;

    let recipient = (to || '').trim();
    const emailType = type as any;

    if (!recipient && emailType === 'CONTACT_MESSAGE') {
      recipient = process.env.ADMIN_EMAIL || 'sarji@seznam.cz';
    }

    if (!recipient) {
      if (req.method === 'GET') {
        return res.status(200).json({
          success: true,
          status: 'online',
          endpoint: '/api/send-email',
          message: 'Endpoint /api/send-email je plně aktivní. Odesílejte požadavky s parametrem to nebo recipientEmail.'
        });
      }
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

    const result = await sendEmail({ to: recipient, type: emailType, data, replyTo, fromName });
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /api/send-email:', error);
    return res.status(200).json({
      success: false,
      error: error?.message || (typeof error === 'string' ? error : JSON.stringify(error)) || 'Nepodařilo se odeslat e-mail přes WEDOS SMTP.'
    });
  }
}
