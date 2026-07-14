/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Helper to build and Base64URL-encode an RFC 2822 email message for Gmail API.
 */
function makeRawEmail(to: string, subject: string, bodyHtml: string): string {
  const emailLines = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyHtml
  ];

  const emailContent = emailLines.join('\r\n');
  
  // Safe base64url encoding
  const base64 = btoa(encodeURIComponent(emailContent).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
  
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Creates an event in the user's primary Google Calendar.
 * Returns the created event data.
 */
export async function createGoogleCalendarEvent(
  accessToken: string,
  event: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }
): Promise<any> {
  const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  
  const body = {
    summary: event.title,
    description: event.description,
    start: {
      dateTime: new Date(event.startDate).toISOString(),
      timeZone: 'Europe/Prague'
    },
    end: {
      dateTime: new Date(event.endDate).toISOString(),
      timeZone: 'Europe/Prague'
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Calendar API Error:', errorText);
    throw new Error(`Chyba Google Kalendáře: ${response.statusText} (${response.status})`);
  }

  return response.json();
}

/**
 * Sends an email notification using Gmail API.
 * Returns the API response.
 */
export async function sendGmailNotification(
  accessToken: string,
  toEmail: string,
  subject: string,
  bodyHtml: string
): Promise<any> {
  const url = 'https://www.googleapis.com/gmail/v1/users/me/messages/send';
  
  const rawEmail = makeRawEmail(toEmail, subject, bodyHtml);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: rawEmail })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gmail API Error:', errorText);
    throw new Error(`Chyba Gmail API: ${response.statusText} (${response.status})`);
  }

  return response.json();
}
