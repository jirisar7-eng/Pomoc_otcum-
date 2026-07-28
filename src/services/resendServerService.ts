import { resend } from '../lib/resend';

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

export interface SendEmailOptions {
  to: string;
  type: EmailType;
  data: EmailData;
  fromName?: string;
}

export interface SendEmailResponse {
  success: boolean;
  delivered?: boolean;
  data?: any;
  error?: string;
  message?: string;
}

const DEFAULT_ADMIN_RECIPIENT = process.env.ADMIN_EMAIL || 'info@tatovacesta.cz';

/**
 * Standard Resend email sender following official Resend docs
 */
export async function sendPortalEmail({
  to,
  subject,
  html,
  fromName = 'Tátova cesta'
}: {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}) {
  try {
    const fromAddress = 'info@tatovacesta.cz';
    const replyToAddress = 'info@tatovacesta.cz';

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY missing. Simulating email delivery.');
      return { success: true, delivered: false, message: 'Simulované doručení (chybí RESEND_API_KEY).' };
    }

    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: [to],
      replyTo: replyToAddress,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return { success: false, error: typeof error === 'string' ? error : error.message || JSON.stringify(error) };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Internal Email Service Error:', err);
    return { success: false, error: err?.message || JSON.stringify(err) };
  }
}

/**
 * Generates responsive, green-dark themed HTML email templates
 */
function generateEmailHtml(type: EmailType, data: EmailData): { subject: string; html: string } {
  const currentYear = new Date().getFullYear();

  // Green-dark theme header & base wrapper
  const headerHtml = `
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="100%" max-width="560" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 10px 25px -5px rgba(0, 0, 0, 0.05);">
            <!-- Header -->
            <tr>
              <td style="background-color:#0f172a; padding: 28px 32px; text-align: center; border-bottom: 3px solid #0f766e;">
                <span style="color:#2dd4bf; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 4px;">SYNTHESIS OS</span>
                <h1 style="color:#ffffff; font-size: 24px; font-weight: 800; margin: 0; padding: 0; font-family: 'Playfair Display', Georgia, serif;">Táta má právo</h1>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 32px; color: #334155; font-size: 14px; line-height: 1.6;">
  `;

  const footerHtml = `
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color:#f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 32px; text-align: center;">
                <p style="color:#94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
                  &copy; ${currentYear} Tátova cesta | Právní asistent a spravedlivá péče o děti<br>
                  Tento e-mail byl odeslán ze služby Resend pro portál Tátova cesta (tatovacesta.cz).
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  switch (type) {
    case 'MAGIC_LINK':
    case 'AUTH_CODE': {
      const subject = "Váš přihlašovací kód – Táta má právo";
      const code = data.code || '------';
      const magicUrl = data.magicUrl;

      const body = `
        <h2 style="color:#0f172a; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Přihlášení do portálu Táta má právo</h2>
        <p style="color:#475569; margin-bottom: 24px;">
          Dobrý den,<br>
          obdrželi jsme požadavek na přihlášení do portálu. Zde je váš jednorázový 6místný ověřovací kód:
        </p>

        <!-- Code Box -->
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
          ⚠️ Platnost tohoto kódu je <strong>15 minut</strong>. Pokud jste o přihlášení nežádali, můžete tento e-mail bezpečně ignorovat.
        </p>
      `;

      return { subject, html: `${headerHtml}${body}${footerHtml}` };
    }

    case 'WELCOME': {
      const subject = "Vítejte v portálu Táta má právo 🚀";
      const userName = data.userName || 'vážený tátó';

      const body = `
        <h2 style="color:#0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Vítáme vás v portálu Táta má právo! 🚀</h2>
        <p style="color:#475569; margin-bottom: 20px;">
          Dobrý den, <strong>${userName}</strong>,<br>
          jsme rádi, že jste se připojil k naší komunitě rodičů a tátů, kteří bojují za rovnoprávnou péči a nejlepší zájem dětí.
        </p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <h3 style="color: #065f46; font-size: 14px; margin: 0 0 8px 0; font-weight: 700;">Co nyní můžete v portálu udělat:</h3>
          <ul style="color: #047857; margin: 0; padding-left: 20px; font-size: 13px;">
            <li style="margin-bottom: 6px;">Doplnit si profil a specifikovat vaši situaci</li>
            <li style="margin-bottom: 6px;">Prostudovat si <strong>Právní minimum tátu</strong> v sekci článků</li>
            <li style="margin-bottom: 6px;">Využít AI Právního asistenta a Simulátor střídavé péče</li>
            <li>Zapojit se do diskusního fóra a poradny</li>
          </ul>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://ai.studio/build" style="display: inline-block; background-color: #0f766e; color: #ffffff; font-weight: 700; font-size: 14px; padding: 14px 28px; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);">
            Otevřít můj profil a Právní minimum ➔
          </a>
        </div>
      `;

      return { subject, html: `${headerHtml}${body}${footerHtml}` };
    }

    case 'EVENT_REMINDER': {
      const eventName = data.eventName || 'Nadcházející událost';
      const subject = `Připomínka termínu: ${eventName}`;
      const eventDate = data.eventDate || 'Nadcházející termín';
      const eventLocation = data.eventLocation || 'Místo neuvedeno';
      const details = data.details || '';

      const body = `
        <h2 style="color:#0f172a; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">📅 Připomínka důležitého termínu</h2>
        <p style="color:#475569; margin-bottom: 20px;">
          Upozorňujeme na nadcházející událost ve vaší opatrovnické agendě a kalendáři:
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #0f766e; font-size: 16px; margin: 0 0 12px 0; font-weight: 700;">${eventName}</h3>
          <p style="margin: 0 0 8px 0; color: #334155;"><strong>Datum a čas:</strong> ${eventDate}</p>
          <p style="margin: 0 0 8px 0; color: #334155;"><strong>Místo / Uzel:</strong> ${eventLocation}</p>
          ${details ? `<p style="margin: 12px 0 0 0; color: #475569; font-size: 13px; border-top: 1px solid #e2e8f0; padding-top: 12px;">${details}</p>` : ''}
        </div>

        <p style="color:#64748b; font-size: 12px;">Doporučujeme mít včas připravené veškeré podklady a důkazy do spisu.</p>
      `;

      return { subject, html: `${headerHtml}${body}${footerHtml}` };
    }

    case 'FORUM_NOTIFICATION': {
      const subject = "Nová odpověď u vašeho příspěvku";
      const postTitle = data.postTitle || 'Váš příspěvek';
      const authorName = data.authorName || 'Člen komunity';
      const threadUrl = data.threadUrl || '#';
      const replyText = data.replyText || '';

      const body = `
        <h2 style="color:#0f172a; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">💬 Nová reakce v diskusním fóru</h2>
        <p style="color:#475569; margin-bottom: 20px;">
          Uživatel <strong>${authorName}</strong> právě odpověděl na váš diskusní příspěvek: <em>"${postTitle}"</em>.
        </p>

        ${replyText ? `
        <div style="background-color: #f1f5f9; border-left: 4px solid #0f766e; padding: 16px; border-radius: 8px; margin-bottom: 24px; color: #334155; font-style: italic;">
          "${replyText}"
        </div>
        ` : ''}

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${threadUrl}" style="display: inline-block; background-color: #0f766e; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 24px; text-decoration: none; border-radius: 12px;">
            Zobrazit celou diskusi ➔
          </a>
        </div>
      `;

      return { subject, html: `${headerHtml}${body}${footerHtml}` };
    }

    case 'GENERATED_DOCUMENT': {
      const docTitle = data.docTitle || 'Vygenerovaný právní podklad';
      const subject = `Váš vygenerovaný podklad: ${docTitle}`;
      const docSummary = data.docSummary || '';
      const content = data.content || '';

      const body = `
        <h2 style="color:#0f172a; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">📄 Vygenerovaný dokument / Výstup ze simulátoru</h2>
        <p style="color:#475569; margin-bottom: 20px;">
          Váš požadovaný dokument <strong>"${docTitle}"</strong> byl úspěšně vygenerován v portálu Táta má právo.
        </p>

        ${docSummary ? `
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 6px 0; color: #166534; font-size: 13px;">Shrnutí / Klíčové parametry:</h4>
          <p style="margin: 0; color: #15803d; font-size: 13px;">${docSummary}</p>
        </div>
        ` : ''}

        ${content ? `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin-bottom: 24px; font-family: monospace; font-size: 12px; white-space: pre-wrap; color: #1e293b;">
${content}
        </div>
        ` : ''}

        <p style="color:#64748b; font-size: 12px;">Dokument naleznete rovněž uložený ve své uživatelské složce spisu.</p>
      `;

      return { subject, html: `${headerHtml}${body}${footerHtml}` };
    }

    case 'ADMIN_ALERT': {
      const alertSubject = data.subject || 'Upozornění systému';
      const subject = `[ADMIN] Nová událost na portálu: ${alertSubject}`;
      const details = data.details || 'Žádné podrobnosti.';

      const body = `
        <h2 style="color:#991b1b; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">🚨 System Admin Alert</h2>
        <p style="color:#475569; margin-bottom: 20px;">
          Na portálu Táta má právo došlo k nové události requiring admin awareness:
        </p>

        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <h3 style="color: #991b1b; font-size: 15px; margin: 0 0 8px 0; font-weight: 700;">${alertSubject}</h3>
          <p style="margin: 0; color: #7f1d1d; font-size: 13px; font-family: monospace; white-space: pre-wrap;">${details}</p>
        </div>
      `;

      return { subject, html: `${headerHtml}${body}${footerHtml}` };
    }

    default: {
      const subject = "Zpráva z portálu Táta má právo";
      const body = `<p style="color:#334155;">Dobrý den,<br>zasíláme vám zprávu z portálu Táta má právo.</p>`;
      return { subject, html: `${headerHtml}${body}${footerHtml}` };
    }
  }
}

/**
 * Universal email sending function powered by Resend SDK
 */
export async function sendEmail({ to, type, data, fromName }: SendEmailOptions): Promise<SendEmailResponse> {
  const recipient = (type === 'ADMIN_ALERT' && (!to || to.trim() === '')) ? DEFAULT_ADMIN_RECIPIENT : to;

  if (!recipient || recipient.trim() === '') {
    console.error('[Resend Email Error]: Missing recipient email address.');
    return { success: false, error: 'Chybí cílová e-mailová adresa.' };
  }

  const { subject, html } = generateEmailHtml(type, data);

  console.log(`[Resend Email Service] Sending email type="${type}" to="${recipient}" subject="${subject}"`);
  
  const result = await sendPortalEmail({
    to: recipient,
    subject,
    html,
    fromName: fromName || 'Tátova cesta'
  });

  if (!result.success) {
    return {
      success: false,
      error: typeof result.error === 'string' ? result.error : JSON.stringify(result.error)
    };
  }

  return {
    success: true,
    delivered: result.delivered ?? true,
    data: result.data,
    message: result.message
  };
}
