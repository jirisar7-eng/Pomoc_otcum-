import { validateEmailFormat, verifyServerCode } from '../src/services/resendServerService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Metoda není povolena' });
  }

  try {
    const { email, recipientEmail, code, codeOrToken } = req.body || {};
    const targetEmail = (email || recipientEmail || '').trim();
    const codeToVerify = String(code || codeOrToken || '').trim();

    if (!targetEmail || !codeToVerify) {
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

    const verificationResult = verifyServerCode(targetEmail, codeToVerify);
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
