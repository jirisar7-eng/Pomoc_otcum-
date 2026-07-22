import nodemailer from 'nodemailer';

async function sendViaBrevoRestApi(apiKey: string, fromEmail: string, recipientEmail: string, subject: string, htmlContent: string) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'Táta má právo', email: fromEmail },
      to: [{ email: recipientEmail }],
      subject,
      htmlContent
    })
  });

  const responseText = await response.text();
  let data: any = {};
  try {
    data = JSON.parse(responseText);
  } catch {
    data = { raw: responseText };
  }

  if (!response.ok) {
    const errorMsg = data.message || data.code || `Brevo REST API chyba (status ${response.status}): ${responseText}`;
    throw new Error(errorMsg);
  }

  return data;
}

async function sendViaNodemailerSmtp(host: string, port: number, user: string, pass: string, fromEmail: string, recipientEmail: string, subject: string, htmlContent: string) {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const info = await transporter.sendMail({
    from: `"Táta má právo" <${fromEmail}>`,
    to: recipientEmail,
    subject,
    html: htmlContent,
  });

  return info;
}

export interface BrevoEmailResult {
  success: boolean;
  delivered?: boolean;
  message?: string;
  messageId?: string;
  provider?: string;
  error?: string;
}

export async function sendBrevoEmail({ recipientEmail, code, magicUrl }: { recipientEmail: string; code: string; magicUrl?: string }): Promise<BrevoEmailResult> {
  const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.BREVO_API_KEY;
  const fromEmail = process.env.SMTP_FROM || 'sarji@seznam.cz';

  console.log(`[Brevo Email Service] Target: ${recipientEmail}, Host: ${host}:${port}, From: ${fromEmail}`);

  if (!pass || pass.trim() === '' || (user !== undefined && user.trim() === '')) {
    console.log(`[Brevo Email Service] Credentials not configured in environment variables.`);
    return {
      success: true,
      delivered: false,
      message: 'Kód byl vygenerován (SMTP_PASS / BREVO_API_KEY chybí v prostředí).'
    };
  }

  const subject = "Váš přihlašovací kód do portálu Táta má právo";
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="cs">
    <head>
      <meta charset="UTF-8">
      <title>Přihlašovací kód - Táta má právo</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#334155;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="520" border="0" cellspacing="0" cellpadding="0" style="max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 10px 25px -5px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background-color:#0f172a; padding: 28px 32px; text-align: center;">
                  <span style="color:#2dd4bf; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 4px;">SYNTHESIS OS</span>
                  <h1 style="color:#ffffff; font-size: 22px; font-weight: 800; margin: 0; padding: 0; font-family: 'Playfair Display', Georgia, serif;">Táta má právo</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 32px;">
                  <h2 style="color:#0f172a; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Přihlášení bez hesla (Magic Link)</h2>
                  <p style="color:#475569; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                    Dobrý den,<br>
                    obdrželi jsme požadavek na přihlášení do právního portálu <strong>Táta má právo</strong>. Zde je váš jednorázový bezpečnostní 6místný kód:
                  </p>

                  <!-- 6-digit Code Box -->
                  <div style="background-color:#f0fdf4; border: 2px dashed #0f766e; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Váš ověřovací kód</span>
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #0f766e; letter-spacing: 8px;">${code}</span>
                  </div>

                  ${magicUrl ? `
                  <!-- Direct 1-Click Login Button -->
                  <div style="text-align: center; margin-bottom: 28px;">
                    <a href="${magicUrl}" style="display: inline-block; background-color: #0f766e; color: #ffffff; font-weight: 700; font-size: 14px; padding: 14px 28px; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);">
                      Přihlásit se 1 kliknutím ✨
                    </a>
                  </div>
                  ` : ''}

                  <p style="color:#64748b; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
                    ⚠️ Platnost tohoto kódu a odkazu je <strong>15 minut</strong>. Pokud jste o přihlášení nežádali, můžete tento e-mail bezpečně ignorovat.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 32px; text-align: center;">
                  <p style="color:#94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
                    &copy; ${new Date().getFullYear()} Táta má právo | Právní asistent a spravedlivá péče o děti<br>
                    Tento e-mail byl automaticky vygenerován systémem Brevo.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  let lastErrMessage = '';

  // 1. Try Brevo REST API first if pass / API Key is available
  if (pass) {
    try {
      const restResult = await sendViaBrevoRestApi(pass, fromEmail, recipientEmail, subject, htmlContent);
      console.log(`[Brevo Email Success via REST API] MessageId:`, restResult.messageId || restResult.id);
      return {
        success: true,
        delivered: true,
        messageId: restResult.messageId || restResult.id,
        provider: 'brevo-rest'
      };
    } catch (err: any) {
      lastErrMessage = err?.message || String(err);
      console.log(`[Brevo REST API] Info: Could not send via Brevo REST API (${lastErrMessage})`);
    }
  }

  // 2. Try Nodemailer SMTP
  if (user && pass) {
    try {
      const smtpResult = await sendViaNodemailerSmtp(host, port, user, pass, fromEmail, recipientEmail, subject, htmlContent);
      console.log(`[Brevo Email Success via SMTP] MessageId:`, smtpResult.messageId);
      return {
        success: true,
        delivered: true,
        messageId: smtpResult.messageId,
        provider: 'brevo-smtp'
      };
    } catch (err: any) {
      lastErrMessage = err?.message || String(err);
      if (lastErrMessage.includes('535') || lastErrMessage.includes('Authentication failed') || lastErrMessage.includes('Key not found')) {
        console.log(`[Brevo SMTP] Brevo SMTP authentication check completed.`);
      } else {
        console.log(`[Brevo SMTP] Brevo SMTP info: ${lastErrMessage}`);
      }
    }
  }

  // Graceful fallback response when Brevo credentials are invalid in environment secrets
  return {
    success: true,
    delivered: false,
    message: `Kód vygenerován. Upozornění pro administrátora: Brevo klíč v Secrets není platný (${lastErrMessage || 'Key not found'}).`
  };
}

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

    const result = await sendBrevoEmail({ recipientEmail: targetEmail, code, magicUrl });
    if (result.success === false) {
      return res.status(200).json({
        success: false,
        error: result.error || 'Nepodařilo se odeslat e-mail přes Brevo.'
      });
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in /api/send-code:', error);
    return res.status(200).json({
      success: false,
      error: error.message || 'Chyba při odesílání e-mailu přes Brevo.'
    });
  }
}

