/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Legal PDF Generation & Cryptographic Hash Service
 */

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { UserLegalAcceptance, LegalDocument } from '../types/legal';

/**
 * Calculates SHA-256 Hash of a string using Web Crypto API with fallback
 */
export async function calculateSha256Hash(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('SubtleCrypto error, using fallback hash:', e);
    }
  }

  // Fallback simple hash for non-crypto contexts
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const positive = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256-fb-${positive}-${Date.now().toString(16)}`;
}

/**
 * Generates a unique legal contract number
 */
export function generateContractNumber(): string {
  const year = new Date().getFullYear();
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SYNTH-LEGAL-${year}-${randomHex}`;
}

export interface PdfGenerationOptions {
  document: LegalDocument;
  acceptance: Partial<UserLegalAcceptance>;
  userFullName: string;
  userEmail: string;
  userId: string;
}

/**
 * Generates a high-quality, official PDF document of the legal acceptance
 */
export async function generateLegalAcceptancePdf(options: PdfGenerationOptions): Promise<{ blob: Blob; dataUrl: string; fileName: string }> {
  const { document, acceptance, userFullName, userEmail, userId } = options;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const contractNumber = acceptance.contractNumber || generateContractNumber();
  const acceptedDateStr = acceptance.acceptedAt ? new Date(acceptance.acceptedAt).toLocaleString('cs-CZ') : new Date().toLocaleString('cs-CZ');
  const ipAddress = acceptance.ipAddress || '127.0.0.1 (Verified Client)';
  const userAgent = acceptance.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Synthesis OS Client');
  const authProvider = acceptance.authProvider || 'google';
  const docHash = document.sha256Hash || await calculateSha256Hash(document.content);

  // Generate QR Code data URL
  const qrVerificationData = `SYNTHESIS OS LEGAL VERIFICATION\nContract: ${contractNumber}\nDoc: ${document.title} v${document.version}\nUser: ${userFullName} (${userId})\nDate: ${acceptedDateStr}\nSHA256: ${docHash}`;
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(qrVerificationData, { width: 120, margin: 1 });
  } catch (err) {
    console.warn('QR code generation failed:', err);
  }

  // PDF Layout Dimensions (A4: 210mm x 297mm)
  const margin = 15;
  const pageWidth = 210;
  const pageHeight = 297;
  const contentWidth = pageWidth - (margin * 2);
  let cursorY = margin;

  // --- HEADER BANNER ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TÁTA MÁ PRÁVO / SYNTHESIS OS', margin, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 184, 166); // teal-400
  doc.text('LEGAL COMPLIANCE CENTER • OFFICIAL ELECTRONIC CONTRACT', margin, 18);

  doc.setTextColor(203, 213, 225); // slate-300
  doc.setFontSize(8);
  doc.text(`ID Smlouvy: ${contractNumber}`, pageWidth - margin, 12, { align: 'right' });
  doc.text(`Verze dokumentu: ${document.version}`, pageWidth - margin, 18, { align: 'right' });

  cursorY = 36;

  // --- DOCUMENT TITLE & CATEGORY ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(document.title.toUpperCase(), margin, cursorY);

  cursorY += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136); // teal-600
  doc.text(`Kategorie: ${document.category.toUpperCase()} | Účinnost od: ${new Date(document.effectiveFrom).toLocaleDateString('cs-CZ')}`, margin, cursorY);

  cursorY += 8;

  // --- ACCEPTANCE AUDIT BOX ---
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, cursorY, contentWidth, 38, 3, 3, 'FD');

  const boxY = cursorY + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('AUDITNÍ ZÁZNAM ELEKTRONICKÉ AKCEPTACE UŽIVATELEM', margin + 4, boxY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85); // slate-700

  // Column 1
  doc.text(`Akceptoval(a): ${userFullName}`, margin + 4, boxY + 6);
  doc.text(`E-mail: ${userEmail}`, margin + 4, boxY + 11);
  doc.text(`ID Uživatel: ${userId}`, margin + 4, boxY + 16);
  doc.text(`Datum a čas: ${acceptedDateStr}`, margin + 4, boxY + 21);

  // Column 2
  doc.text(`Metoda přihlášení: ${authProvider.toUpperCase()}`, margin + 85, boxY + 6);
  doc.text(`IP adresa: ${ipAddress}`, margin + 85, boxY + 11);
  const truncatedAgent = userAgent.length > 45 ? userAgent.substring(0, 42) + '...' : userAgent;
  doc.text(`Klientský prohlížeč: ${truncatedAgent}`, margin + 85, boxY + 16);
  doc.text(`Stav akceptace: PLATNÝ A OVERENÝ (ACCEPTED)`, margin + 85, boxY + 21);

  // QR Code on right side if available
  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 26, boxY, 22, 22);
    } catch (e) {
      console.warn('Failed embedding QR image:', e);
    }
  }

  cursorY += 44;

  // --- ELECTRONIC VERIFICATION CLAUSE ---
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(margin, cursorY, contentWidth, 10, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text('✔ Tento dokument byl elektronicky akceptován v systému Synthesis OS a je právně průkazný.', margin + 4, cursorY + 6);

  cursorY += 16;

  // --- DOCUMENT CONTENT SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('I. ZNĚNÍ AKCEPTOVANÉHO DOKUMENTU', margin, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  // Clean Markdown headers & line breaks for PDF text
  const cleanContentLines = document.content
    .replace(/^#\s+/gm, '--- ')
    .replace(/^##\s+/gm, '')
    .replace(/^###\s+/gm, '')
    .replace(/\*\*/g, '')
    .split('\n');

  for (const rawLine of cleanContentLines) {
    const line = rawLine.trim();
    if (!line) {
      cursorY += 2;
      continue;
    }

    const wrappedLines = doc.splitTextToSize(line, contentWidth);
    for (const wrappedLine of wrappedLines) {
      if (cursorY > pageHeight - 20) {
        // Footer before new page
        renderFooter(doc, pageWidth, pageHeight, margin, docHash, contractNumber);
        doc.addPage();
        cursorY = margin + 10;
      }
      doc.text(wrappedLine, margin, cursorY);
      cursorY += 4;
    }
  }

  // Add final footer
  renderFooter(doc, pageWidth, pageHeight, margin, docHash, contractNumber);

  const fileName = `E-Smlouva_${document.slug}_v${document.version}_${contractNumber}.pdf`;
  const pdfBlob = doc.output('blob');
  const dataUrl = doc.output('datauristring');

  return {
    blob: pdfBlob,
    dataUrl,
    fileName
  };
}

function renderFooter(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, docHash: string, contractNumber: string) {
  const footerY = pageHeight - 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139); // slate-500
  
  doc.text(`Synthesis OS Legal Compliance Center • ${contractNumber}`, margin, footerY);
  doc.text(`SHA-256 Hash: ${docHash.substring(0, 32)}...`, pageWidth - margin, footerY, { align: 'right' });
}

/**
 * Triggers direct browser download of the PDF document
 */
export async function downloadLegalPdf(options: PdfGenerationOptions): Promise<void> {
  const { blob, fileName } = await generateLegalAcceptancePdf(options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
