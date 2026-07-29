import { validateEmailFormat, verifyServerCode } from './_wedosSmtp.js';

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
    const email = bodyData.email || bodyData.recipientEmail || queryData.email || queryData.recipientEmail;
    const code = bodyData.code || bodyData.codeOrToken || queryData.code || queryData.codeOrToken;

    const targetEmail = (email || '').trim();
    const codeToVerify = String(code || '').trim();

    if (!targetEmail || !codeToVerify) {
      if (req.method === 'GET' && !targetEmail) {
        return res.status(200).json({
          success: true,
          status: 'online',
          endpoint: '/api/verify-code',
          message: 'Endpoint /api/verify-code je plně aktivní. Odesílejte požadavky s parametry email a code.'
        });
      }
      return res.status(400).json({ success: false, error: 'Chybí e-mail nebo ověřovací kód.' });
    }

    const validation = validateEmailFormat(targetEmail);
    if (!validation.isValid) {
      console.warn(`[Handler /api/verify-code] Zamítnut neplatný e-mailový vstup: "${targetEmail}". Důvod: ${validation.reason}`);
      return res.status(200).json({
        success: false,
        error: validation.error || 'Zadejte prosím platnou e-mailovou adresu.'
      });
    }

    const verificationResult = await verifyServerCode(targetEmail, codeToVerify);
    if (!verificationResult.success) {
      console.warn(`[Handler /api/verify-code] Neúspěšné ověření pro "${targetEmail}": ${verificationResult.error}`);
      return res.status(200).json({
        success: false,
        error: verificationResult.error
      });
    }

    console.log(`[Handler /api/verify-code] Uživatel "${targetEmail}" úspěšně ověřen šestimístným kódem.`);
    return res.status(200).json({ success: true, verified: true, email: targetEmail });
  } catch (error: any) {
    console.error('Error in /api/verify-code:', error);
    return res.status(200).json({
      success: false,
      error: error?.message || 'Chyba při ověřování kódu na serveru.'
    });
  }
}
