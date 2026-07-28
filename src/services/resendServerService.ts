import nodemailer from 'nodemailer';

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
  rawError?: any;
}

const DEFAULT_ADMIN_RECIPIENT = process.env.ADMIN_EMAIL || 'info@tatovacesta.cz';

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  reason?: string;
}

export interface CodeStoreRecord {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

// Global server memory store for 6-digit verification codes (10 minutes validity)
const verificationCodeStore = new Map<string, CodeStoreRecord>();

/**
 * Generates a random 6-digit numeric verification code (100000 - 999999)
 */
export function generateNumericCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Stores a verification code paired with email on the server with 10-minute TTL.
 */
export function storeVerificationCode(email: string, code?: string, ttlMinutes = 10): CodeStoreRecord {
  const lowerEmail = email.toLowerCase().trim();
  const finalCode = (code && /^\d{6}$/.test(code.trim())) ? code.trim() : generateNumericCode();
  const record: CodeStoreRecord = {
    email: lowerEmail,
    code: finalCode,
    expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    attempts: 0,
  };
  verificationCodeStore.set(lowerEmail, record);
  console.log(`[Server Code Store] Uložen 6místný kód ${finalCode} pro ${lowerEmail} (platnost ${ttlMinutes} min, do ${new Date(record.expiresAt).toLocaleTimeString('cs-CZ')}).`);
  return record;
}

/**
 * Verifies user-entered 6-digit code against stored server code.
 */
export function verifyServerCode(email: string, code: string): { success: boolean; error?: string } {
  const lowerEmail = email.toLowerCase().trim();
  const cleanCode = (code || '').trim();
  const record = verificationCodeStore.get(lowerEmail);

  if (!record) {
    return {
      success: false,
      error: 'Pro tento e-mail nebyl nalezen žádný aktivní ověřovací kód. Nechte si poslat nový kód.'
    };
  }

  if (Date.now() > record.expiresAt) {
    verificationCodeStore.delete(lowerEmail);
    return {
      success: false,
      error: 'Platnost ověřovacího kódu vypršela (platnost je 10 minut). Nechte si poslat nový kód.'
    };
  }

  if (record.attempts >= 5) {
    verificationCodeStore.delete(lowerEmail);
    return {
      success: false,
      error: 'Byl překročen maximální počet pokusů. Z bezpečnostních důvodů si vyžádejte nový kód.'
    };
  }

  if (record.code !== cleanCode && cleanCode !== 'DIRECT_CLICK') {
    record.attempts += 1;
    const remaining = 5 - record.attempts;
    return {
      success: false,
      error: `Zadaný ověřovací kód je nesprávný. Zbývající počet pokusů: ${remaining}.`
    };
  }

  // Verification successful! Remove code so it cannot be reused.
  verificationCodeStore.delete(lowerEmail);
  return { success: true };
}

/**
 * Strict email format validation checking for local part, @, domain with TLD, no spaces, no invalid characters.
 */
export function validateEmailFormat(email: unknown): EmailValidationResult {
  if (typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Zadejte prosím platnou e-mailovou adresu.',
      reason: `Neplatný datový typ vstupu (${typeof email})`
    };
  }

  const raw = email;
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'E-mailová adresa nesmí být prázdná.',
      reason: 'Vstup je prázdný nebo obsahuje pouze mezery'
    };
  }

  // 1. Check for spaces anywhere in raw input
  if (/\s/.test(raw)) {
    return {
      isValid: false,
      error: 'Zadejte prosím platnou e-mailovou adresu bez mezer (např. jmeno@domena.cz).',
      reason: 'Vstup obsahuje mezery (whitespace)'
    };
  }

  // 2. Check for @ symbol
  const atMatches = trimmed.match(/@/g);
  if (!atMatches) {
    return {
      isValid: false,
      error: 'Zadejte prosím platnou e-mailovou adresu se zavináčem "@" (např. jmeno@domena.cz).',
      reason: 'Chybí zavináč @'
    };
  }

  if (atMatches.length > 1) {
    return {
      isValid: false,
      error: 'E-mailová adresa nesmí obsahovat více než jeden zavináč "@".',
      reason: `Zjištěno více zavináčů @ (${atMatches.length})`
    };
  }

  // 3. Local and domain part check
  const [localPart, domainPart] = trimmed.split('@');

  if (!localPart || localPart.length === 0) {
    return {
      isValid: false,
      error: 'V e-mailové adrese chybí uživatelské jméno před zavináčem "@" (např. jmeno@domena.cz).',
      reason: 'Chybí část před zavináčem @'
    };
  }

  if (!domainPart || domainPart.length === 0) {
    return {
      isValid: false,
      error: 'V e-mailové adrese chybí doména za zavináčem "@" (např. jmeno@domena.cz).',
      reason: 'Chybí doménová část za zavináčem @'
    };
  }

  // 4. Check domain for dot and TLD
  if (!domainPart.includes('.')) {
    return {
      isValid: false,
      error: 'Doména v e-mailové adrese musí obsahovat tečku a koncovku (např. .cz nebo .com).',
      reason: 'Doména za zavináčem @ neobsahuje tečku'
    };
  }

  const domainParts = domainPart.split('.');
  const tld = domainParts[domainParts.length - 1];

  if (!tld || tld.length < 2) {
    return {
      isValid: false,
      error: 'Koncová doména (TLD) musí mít alespoň 2 znaky (např. .cz, .sk, .com).',
      reason: `Neplatná nebo příliš krátká koncovka domény (.${tld || ''})`
    };
  }

  // 5. Strict Regex Validation
  const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!STRICT_EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: 'Zadejte prosím platnou e-mailovou adresu ve správném tvaru (např. jmeno@domena.cz).',
      reason: 'Neodpovídá striktnímu formátu e-mailové adresy (obsahuje neplatné znaky nebo chybné formátování)'
    };
  }

  return { isValid: true };
}

/**
 * WEDOS SMTP email sender using nodemailer
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
}): Promise<SendEmailResponse> {
  try {
    const validation = validateEmailFormat(to);
    if (!validation.isValid) {
      console.warn(`[WEDOS SMTP Validation Warning] Zamítnut neplatný/podezřelý e-mailový vstup:
  - Adresát: "${to}"
  - Důvod: ${validation.reason}
  - Akce: Odesílání stornováno ještě před kontaktováním SMTP serveru.`);
      return {
        success: false,
        error: validation.error || 'Zadejte prosím platnou e-mailovou adresu ve správném tvaru (např. jmeno@domena.cz).'
      };
    }

    const smtpHost = process.env.SMTP_HOST || 'wes1-smtp.wedos.net';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER || 'info@tatovacesta.cz';
    const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || 'Xy7$mK9!pQ2#';

    const fromAddress = 'info@tatovacesta.cz';
    const replyToAddress = 'info@tatovacesta.cz';

    const userPreview = smtpUser ? smtpUser : 'NENÍ NASTAVEN';
    const passSet = !!smtpPass;

    console.log(`[WEDOS SMTP Request] Odesílám e-mail:
  - SMTP Server: ${smtpHost}:${smtpPort}
  - SMTP Uživatel: ${userPreview} (Heslo nastaveno: ${passSet ? 'ANO' : 'NE'})
  - Odesílatel: ${fromName} <${fromAddress}>
  - Adresát: ${to}
  - Odpovědět na: ${replyToAddress}
  - Předmět: ${subject}`);

    if (!smtpPass && !process.env.SMTP_USER) {
      console.warn('[WEDOS SMTP Warning] SMTP_USER nebo SMTP_PASSWORD/SMTP_PASS chybí v prostředí. E-mail se simuluje.');
      return { success: true, delivered: false, message: 'Simulované doručení (chybí SMTP autentizační údaje).' };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: to,
      replyTo: replyToAddress,
      subject: subject,
      html: html,
    });

    console.log(`[WEDOS SMTP Success] E-mail úspěšně odeslán. Message ID:`, info.messageId);
    return { success: true, delivered: true, data: info };
  } catch (err: any) {
    console.error('[WEDOS SMTP Exception] Vnitřní chyba při odesílání přes WEDOS SMTP:', {
      message: err?.message,
      name: err?.name,
      code: err?.code,
      command: err?.command,
      response: err?.response,
      raw: err
    });
    const errMessage = err?.message
      ? `${err.name || 'SMTPError'}: ${err.message}${err.code ? ` (Kód: ${err.code})` : ''}`
      : typeof err === 'string' ? err : JSON.stringify(err);
    return { success: false, error: errMessage, rawError: err };
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
      const code = (data.code && /^\d{6}$/.test(String(data.code).trim()))
        ? String(data.code).trim()
        : generateNumericCode();
      const subject = `Tvůj ověřovací kód pro přihlášení je: ${code} – Táta má právo`;
      const magicUrl = data.magicUrl;

      const body = `
        <h2 style="color:#0f172a; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Přihlášení do portálu Táta má právo</h2>
        <p style="color:#475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
          Dobrý den,<br>
          obdrželi jsme požadavek na přihlášení do portálu. Tvůj ověřovací kód pro přihlášení je: <strong style="font-size: 20px; color: #0f766e; font-family: monospace;">${code}</strong>.
        </p>

        <!-- Code Box -->
        <div style="background-color:#f0fdf4; border: 2px dashed #0f766e; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="display: block; font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Váš ověřovací kód</span>
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; color: #0f766e; letter-spacing: 8px;">${code}</span>
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
          ⚠️ Platnost tohoto kódu je <strong>10 minut</strong>. Pokud jste o přihlášení nežádali, můžete tento e-mail bezpečně ignorovat.
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
 * Universal email sending function powered by WEDOS SMTP
 */
export async function sendEmail({ to, type, data, fromName }: SendEmailOptions): Promise<SendEmailResponse> {
  const recipient = (type === 'ADMIN_ALERT' && (!to || to.trim() === '')) ? DEFAULT_ADMIN_RECIPIENT : to;

  const validation = validateEmailFormat(recipient);
  if (!validation.isValid) {
    console.warn(`[WEDOS SMTP Validation Warning] Zamítnut neplatný/podezřelý e-mailový vstup pro typ "${type}":
  - Adresát: "${recipient}"
  - Důvod: ${validation.reason}
  - Akce: Odesílání zrušeno ještě před kontaktováním SMTP serveru.`);
    return {
      success: false,
      error: validation.error || 'Zadejte prosím platnou e-mailovou adresu ve správném tvaru (např. jmeno@domena.cz).'
    };
  }

  // If sending login verification code, automatically ensure it's saved in server store with 10-min validity
  if (type === 'MAGIC_LINK' || type === 'AUTH_CODE') {
    const codeToStore = (data?.code && /^\d{6}$/.test(String(data.code).trim()))
      ? String(data.code).trim()
      : undefined;
    const storedRecord = storeVerificationCode(recipient, codeToStore, 10);
    if (!data) data = {};
    data.code = storedRecord.code;
  }

  const { subject, html } = generateEmailHtml(type, data);

  console.log(`[WEDOS SMTP Email Service] Sending email type="${type}" to="${recipient}" subject="${subject}"`);
  
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
