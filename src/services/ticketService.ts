/**
 * Service for managing tickets (bug reports, feature requests, support queries, general feedback)
 * LocalStorage persistence with SMTP notifications via WEDOS
 */

import { Ticket, TicketCategory, TicketStatus, TicketPriority, TicketComment } from '../types';
import { sendEmail } from './emailService';

const STORAGE_KEY = 'synthesis_portal_tickets_v1';

// Initial demo tickets for rich out-of-the-box user & admin experience
const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-1001',
    ticketNumber: 'TKT-1001',
    userName: 'Karel Novák',
    userEmail: 'karel.novak@example.cz',
    category: 'bug',
    priority: 'medium',
    status: 'in_progress',
    title: 'Nefunkční tlačítko stáhnutí PDF u generátoru návrhu na střídavku',
    description: 'Při kliknutí na Generovat PDF v sekci Centrum formulářů se občas stránka neobnoví a zůstane načítací kolečko.',
    pageUrl: '/centrum-formularu',
    createdAt: '2026-07-28T14:30:00.000Z',
    updatedAt: '2026-07-29T10:15:00.000Z',
    comments: [
      {
        id: 'tc-1',
        authorName: 'Jiří Šár (Správce)',
        authorEmail: 'sarji@seznam.cz',
        isAdmin: true,
        message: 'Děkuji za nahlášení. Prověřil jsem skript a upravil podporu stahování i pro mobilní prohlížeče Safari. Vydáme v příští aktualizaci.',
        createdAt: '2026-07-29T10:15:00.000Z'
      }
    ],
    adminNote: 'Prověřeno v Tech Labu. Chystá se nasazení patch verze.'
  },
  {
    id: 'tkt-1002',
    ticketNumber: 'TKT-1002',
    userName: 'Martin Dvořák',
    userEmail: 'martin.d@example.cz',
    category: 'feature',
    priority: 'medium',
    status: 'testing',
    title: 'Možnost exportu Kalendáře péče do iCal (.ics)',
    description: 'Bylo by skvělé mít možnost exportovat harmonogram střídavé péče přímo do Google Kalendáře nebo iOS kalendáře skrze iCal file.',
    benefit: 'Usnadní tátům organizaci času a sdílení plánu s dětmi i širší rodinou.',
    createdAt: '2026-07-25T09:12:00.000Z',
    updatedAt: '2026-07-30T08:00:00.000Z',
    comments: [
      {
        id: 'tc-2',
        authorName: 'Jiří Šár (Správce)',
        authorEmail: 'sarji@seznam.cz',
        isAdmin: true,
        message: 'Skvělý nápad! Modul iCal exportu je naprogramován a nyní se testuje na vývojové verzi.',
        createdAt: '2026-07-30T08:00:00.000Z'
      }
    ]
  },
  {
    id: 'tkt-1003',
    ticketNumber: 'TKT-1003',
    userName: 'Petr Svoboda',
    userEmail: 'petr.svoboda@example.cz',
    category: 'support',
    priority: 'critical',
    status: 'resolved',
    title: 'Jak postupovat při zamezení kontaktu matkou před víkendem?',
    description: 'Dobrý den, matka mi odmítá předat syna na víkend podle schváleného rozsudku. Jaký vzor návrhu mám nejrychleji podat na soud?',
    topicCategory: 'střídavá_péče',
    createdAt: '2026-07-20T18:45:00.000Z',
    updatedAt: '2026-07-21T09:30:00.000Z',
    comments: [
      {
        id: 'tc-3',
        authorName: 'Jiří Šár (Správce)',
        authorEmail: 'sarji@seznam.cz',
        isAdmin: true,
        message: 'Dobrý den Petře. Využijte náš vzor "Návrh na výkon rozhodnutí uložením pokuty (§ 501 z.ř.s.)" v sekci Centrum formulářů. Současně doložte SMS komunikaci a záznam o pokusu o předání.',
        createdAt: '2026-07-21T09:30:00.000Z'
      }
    ]
  }
];

export function getStoredTickets(): Ticket[] {
  if (typeof window === 'undefined') return INITIAL_TICKETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TICKETS;
  } catch (e) {
    console.error('Error loading stored tickets:', e);
    return INITIAL_TICKETS;
  }
}

export function saveStoredTickets(tickets: Ticket[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error('Error saving stored tickets:', e);
  }
}

export async function createTicket(payload: {
  userName: string;
  userEmail: string;
  category: TicketCategory;
  priority?: TicketPriority;
  title: string;
  description: string;
  pageUrl?: string;
  benefit?: string;
  topicCategory?: string;
  userId?: string;
}): Promise<Ticket> {
  const tickets = getStoredTickets();
  const nextNum = 1000 + tickets.length + 1;
  const ticketNumber = `TKT-${nextNum}`;
  const now = new Date().toISOString();

  // Default priority based on category if not explicitly set
  let priority: TicketPriority = payload.priority || 'medium';
  if (!payload.priority) {
    if (payload.category === 'bug') priority = 'medium';
    if (payload.category === 'support') priority = 'critical';
    if (payload.category === 'feature') priority = 'low';
  }

  const newTicket: Ticket = {
    id: `tkt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    ticketNumber,
    userId: payload.userId,
    userName: payload.userName.trim(),
    userEmail: payload.userEmail.trim(),
    category: payload.category,
    priority,
    status: 'open',
    title: payload.title.trim(),
    description: payload.description.trim(),
    pageUrl: payload.pageUrl,
    benefit: payload.benefit,
    topicCategory: payload.topicCategory,
    createdAt: now,
    updatedAt: now,
    comments: []
  };

  const updatedTickets = [newTicket, ...tickets];
  saveStoredTickets(updatedTickets);

  // Send asynchronous notification email to Admin and User via WEDOS SMTP
  try {
    const categoryLabels: Record<TicketCategory, string> = {
      bug: '🐛 Hlášení chyby',
      feature: '💡 Návrh na vylepšení',
      support: '⚖️ Právní / Rodinná poradna',
      general: '❓ Obecný dotaz / Zpětná vazba'
    };

    const messageSummary = `📌 Číslo ticketu: ${newTicket.ticketNumber}\n` +
      `👤 Odesílatel: ${newTicket.userName} (${newTicket.userEmail})\n` +
      `🏷️ Kategorie: ${categoryLabels[newTicket.category]}\n` +
      `🔴 Priorita: ${newTicket.priority.toUpperCase()}\n` +
      `🌐 Stránka: ${newTicket.pageUrl || 'Neuvedeno'}\n\n` +
      `📝 Předmět: ${newTicket.title}\n\n` +
      `💬 Popis:\n${newTicket.description}` +
      (newTicket.benefit ? `\n\n💡 Přínos: ${newTicket.benefit}` : '');

    sendEmail({
      to: process.env.ADMIN_EMAIL || 'sarji@seznam.cz',
      type: 'CONTACT_MESSAGE',
      data: {
        senderName: newTicket.userName,
        senderEmail: newTicket.userEmail,
        category: `TICKET (${newTicket.ticketNumber}) - ${categoryLabels[newTicket.category]}`,
        subject: `[Ticket ${newTicket.ticketNumber}] ${newTicket.title}`,
        message: messageSummary
      },
      replyTo: newTicket.userEmail
    }).catch(err => console.warn('Ticket notification email failed:', err));
  } catch (err) {
    console.warn('Error sending ticket notification:', err);
  }

  return newTicket;
}

export async function updateTicketStatus(
  ticketId: string,
  newStatus: TicketStatus,
  adminComment?: string,
  adminName: string = 'Jiří Šár (Správce)'
): Promise<Ticket | null> {
  const tickets = getStoredTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index === -1) return null;

  const ticket = tickets[index];
  const now = new Date().toISOString();

  ticket.status = newStatus;
  ticket.updatedAt = now;

  if (adminComment && adminComment.trim()) {
    const comment: TicketComment = {
      id: `tc-${Date.now()}`,
      authorName: adminName,
      authorEmail: 'sarji@seznam.cz',
      isAdmin: true,
      message: adminComment.trim(),
      createdAt: now
    };
    ticket.comments.push(comment);
  }

  tickets[index] = ticket;
  saveStoredTickets(tickets);

  // Send update email to user
  try {
    const statusLabels: Record<TicketStatus, string> = {
      open: '📥 Nové (Přijato)',
      in_progress: '🔍 V řešení',
      testing: '🧪 Čeká na nasazení / Testuje se',
      resolved: '✅ Vyřešeno',
      rejected: '❌ Zamítnuto / Odmítnuto'
    };

    const updateMsg = `Dobrý den,\n\nStatus vašeho ticketu ${ticket.ticketNumber} ("${ticket.title}") byl aktualizován na: ${statusLabels[newStatus]}.\n\n` +
      (adminComment ? `💬 Zpráva od správce:\n${adminComment}\n\n` : '') +
      `S pozdravem,\nJiří Šár | Portál Táta má právo`;

    sendEmail({
      to: ticket.userEmail,
      type: 'CONTACT_MESSAGE',
      data: {
        senderName: 'Jiří Šár (Správce portálu)',
        senderEmail: 'sarji@seznam.cz',
        category: `Aktualizace ticketu ${ticket.ticketNumber}`,
        subject: `[Aktualizace ticketu ${ticket.ticketNumber}] ${ticket.title}`,
        message: updateMsg
      },
      fromName: 'Táta má právo – Podpora',
      replyTo: 'sarji@seznam.cz'
    }).catch(err => console.warn('Failed to send ticket status update email:', err));
  } catch (err) {
    console.warn('Error triggering ticket status update email:', err);
  }

  return ticket;
}

export async function addTicketComment(
  ticketId: string,
  authorName: string,
  authorEmail: string,
  message: string,
  isAdmin: boolean = false
): Promise<Ticket | null> {
  const tickets = getStoredTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index === -1) return null;

  const ticket = tickets[index];
  const now = new Date().toISOString();

  const newComment: TicketComment = {
    id: `tc-${Date.now()}`,
    authorName,
    authorEmail,
    isAdmin,
    message: message.trim(),
    createdAt: now
  };

  ticket.comments.push(newComment);
  ticket.updatedAt = now;
  tickets[index] = ticket;
  saveStoredTickets(tickets);

  return ticket;
}
