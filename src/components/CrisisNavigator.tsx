/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Crisis Navigator 4.0
 * Inteligentní interaktivní průvodce rodiče v opatrovnické krizové situaci.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Save, 
  Share2, 
  HelpCircle, 
  Scale, 
  BookOpen, 
  Search, 
  Upload, 
  Info, 
  Check, 
  Eye, 
  RotateCcw, 
  Lock, 
  FileCheck, 
  Activity, 
  Zap, 
  ShieldCheck, 
  ListOrdered, 
  MessageSquare, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Paperclip,
  FileCode,
  Award
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { calculateSha256Hash } from '../services/legalPdfService';
import { workspaceService } from '../services/workspaceService';
import { User } from '../types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type CrisisMode = 'emergency' | 'strategic';

export interface TimelineEventItem {
  id: string;
  title: string;
  date: string;
  category: 'breakup' | 'child_birth' | 'contact_restriction' | 'court_petition' | 'hearing' | 'ospod_report' | 'incident' | 'medical_school' | 'other';
  description: string;
  trustTag: 'VERIFIED' | 'USER_PROVIDED' | 'AI_ANALYSIS' | 'UNKNOWN';
  evidenceIds: string[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'pdf' | 'photo' | 'email' | 'sms' | 'whatsapp' | 'voice' | 'video' | 'doc';
  fileName?: string;
  fileSize?: string;
  uploadDate: string;
  notes: string;
  relevanceScore: 'high' | 'medium' | 'low';
  trustTag: 'VERIFIED' | 'USER_PROVIDED' | 'AI_ANALYSIS' | 'UNKNOWN';
}

export interface DiagnosticState {
  // Phase 1
  urgency: 'acute_emergency' | 'strategic_planning';
  
  // Phase 2
  casePhase: 'pre_court' | 'ospod_active' | 'court_pending' | 'adverse_ruling' | 'appeal_change';
  childrenCount: number;
  youngestChildAge: 'infant_under_1' | 'toddler_1_3' | 'preschool_3_6' | 'school_6_12' | 'teen_12_plus';
  careHistory: 'shared_equal' | 'mother_primary' | 'father_primary' | 'grandparents_help';
  communicationLevel: 'constructive_biff' | 'latent_conflict' | 'severe_obstruction' | 'zero_communication';
  livingDistance: 'same_city' | 'under_15km' | '15_50km' | 'over_50km' | 'shared_house_unresolved';
  maritalStatus: 'married_divorcing' | 'unmarried_paternity_set' | 'unmarried_paternity_unset';
  courtStatus: 'no_petition' | 'interim_injunction_requested' | 'expert_opinion_ordered' | 'judgment_first_instance' | 'final_judgment';
  ospodStatus: 'favorable_report' | 'mother_biased_report' | 'neutral_report' | 'contact_obstruction_reported';
  circumstanceChange: 'none' | 'relocation' | 'school_change' | 'health_issue' | 'child_maturation';
}

interface CrisisNavigatorProps {
  currentUser?: User | null;
  setActiveTab?: (tab: string) => void;
  onOpenAuth?: () => void;
}

// ============================================================================
// INITIAL SEED DATA & CONSTANTS
// ============================================================================

const DEFAULT_DIAGNOSTIC_STATE: DiagnosticState = {
  urgency: 'strategic_planning',
  casePhase: 'pre_court',
  childrenCount: 1,
  youngestChildAge: 'toddler_1_3',
  careHistory: 'shared_equal',
  communicationLevel: 'latent_conflict',
  livingDistance: 'same_city',
  maritalStatus: 'unmarried_paternity_set',
  courtStatus: 'no_petition',
  ospodStatus: 'neutral_report',
  circumstanceChange: 'none'
};

const INITIAL_TIMELINE_EVENTS: TimelineEventItem[] = [
  {
    id: 'evt-1',
    title: 'Narození dítěte',
    date: '2023-04-12',
    category: 'child_birth',
    description: 'Narození prvního syna. Otec přítomen u porodu, aktivně zapojen do každodenní péče.',
    trustTag: 'VERIFIED',
    evidenceIds: ['ev-1']
  },
  {
    id: 'evt-2',
    title: 'Oznámení rozchodu rodičů',
    date: '2025-11-01',
    category: 'breakup',
    description: 'Matka oznámila požadavek na ukončení společného bydlení.',
    trustTag: 'USER_PROVIDED',
    evidenceIds: []
  },
  {
    id: 'evt-3',
    title: 'První neoprávněné odepření kontaktních dnů',
    date: '2026-01-10',
    category: 'contact_restriction',
    description: 'Matka odmítla předat dítě na dohodnutý víkend s odkazem na lehkou rýmu dítěte.',
    trustTag: 'USER_PROVIDED',
    evidenceIds: ['ev-2']
  }
];

const INITIAL_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'ev-1',
    title: 'Rodný list dítěte',
    type: 'pdf',
    fileName: 'rodny_list_dite.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-01-15',
    notes: 'Oficiální rodný list s uvedením otcovství.',
    relevanceScore: 'high',
    trustTag: 'VERIFIED'
  },
  {
    id: 'ev-2',
    title: 'SMS komunikace ohledně předávání dítěte',
    type: 'sms',
    fileName: 'sms_export_leden_2026.pdf',
    fileSize: '450 KB',
    uploadDate: '2026-01-20',
    notes: 'Důkaz o bezdůvodném zrušení dohodnutého víkendu ze strany matky.',
    relevanceScore: 'high',
    trustTag: 'VERIFIED'
  }
];

const LEGAL_CITATIONS = [
  {
    code: 'Zákon č. 89/2012 Sb. (Občanský zákoník)',
    sections: '§ 887, § 888, § 906, § 907',
    summary: 'Rodičovská odpovědnost náleží oběma rodičům rovnoměrně. Dítě má právo na péči obou rodičů a rodič, který má dítě v péči, je povinen připravit dítě na kontakt s druhým rodičem.',
    link: '/e-justice'
  },
  {
    code: 'Ústavní soud ČR (Nález I. ÚS 1506/21)',
    sections: 'Střídavá péče u dětí útlého věku (2-3 roky)',
    summary: 'Ústavní soud výslovně potvrdil, že nízký věk dítěte sám o sobě NENÍ překážkou pro střídavou péči a přespávání u otce, je-li vybudována citová vazba.',
    link: '/judikatura'
  },
  {
    code: 'Ústavní soud ČR (Nález I. ÚS 2482/13)',
    sections: 'Kritéria pro svěření dítěte do střídavé péče',
    summary: 'Svěření do střídavé péče má být pravidlem, pokud jsou oba rodiče způsobilí o dítě pečovat a mají o péči projevovaný zájem.',
    link: '/judikatura'
  },
  {
    code: 'Zákon č. 292/2013 Sb. (o zvláštních řízeních soudních)',
    sections: '§ 452, § 466 (Předběžná opatření v rodinných věcech)',
    summary: 'Soud může nařídit předběžné opatření k úpravě poměrů, je-li zatížen základní kontakt s dítětem nebo hrozí-li újma na vývoji dítěte.',
    link: '/e-justice'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CrisisNavigator({ currentUser, setActiveTab, onOpenAuth }: CrisisNavigatorProps) {
  // --- States ---
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mode, setMode] = useState<CrisisMode>('strategic');
  const [diagnostic, setDiagnostic] = useState<DiagnosticState>(DEFAULT_DIAGNOSTIC_STATE);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEventItem[]>(INITIAL_TIMELINE_EVENTS);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_ITEMS);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [auditHash, setAuditHash] = useState<string>('');
  
  // New event modal / inline inputs
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<TimelineEventItem['category']>('incident');

  // AI Assistant overlay / modal state for Phase 9
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalTopic, setAiModalTopic] = useState<{ title: string; content: string } | null>(null);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('synthesis_crisis_navigator_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.diagnostic) setDiagnostic(parsed.diagnostic);
        if (parsed.timelineEvents) setTimelineEvents(parsed.timelineEvents);
        if (parsed.evidenceItems) setEvidenceItems(parsed.evidenceItems);
        if (parsed.mode) setMode(parsed.mode);
      }
    } catch (e) {
      console.warn('Failed to load Crisis Navigator state:', e);
    }

    // Generate audit hash on initial load
    calculateSha256Hash(`CRISIS-NAV-4.0-${Date.now()}-${Math.random()}`).then(hash => {
      setAuditHash(hash.substring(0, 24).toUpperCase());
    });
  }, []);

  // Save state on change
  const handleAutoSave = (updatedDiag = diagnostic, updatedTime = timelineEvents, updatedEv = evidenceItems, updatedMode = mode) => {
    try {
      const payload = {
        diagnostic: updatedDiag,
        timelineEvents: updatedTime,
        evidenceItems: updatedEv,
        mode: updatedMode,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('synthesis_crisis_navigator_v4', JSON.stringify(payload));
      setSaveStatus('Uloženo do paměti browseru');
      setTimeout(() => setSaveStatus(''), 2500);
    } catch (e) {
      console.warn('Auto-save error:', e);
    }
  };

  // Sync to Workspace Service
  const handleSyncToWorkspace = async () => {
    setSaveStatus('Synchronizuji s Pracovnou...');
    try {
      const caseId = currentUser?.id ? `CASE-${currentUser.id.substring(0, 8)}` : 'CASE-GUEST-CRISIS';
      
      // Save timeline events to workspace
      for (const evt of timelineEvents) {
        await workspaceService.addCaseTimelineEvent({
          case_id: caseId,
          user_id: currentUser?.id || 'guest',
          title: evt.title,
          event_date: evt.date,
          notes: evt.description
        });
      }

      setSaveStatus('✅ Úspěšně uloženo do Osobní Pracovny!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Workspace sync error:', err);
      setSaveStatus('⚠️ Chyba při ukládání do Pracovny');
    }
  };

  // Court Readiness Index Calculation (Phase 8)
  const calculateReadinessScore = (): {
    totalScore: number;
    docScore: number;
    careScore: number;
    envScore: number;
    commScore: number;
    evidScore: number;
    timeScore: number;
    strongPoints: string[];
    riskPoints: string[];
  } => {
    let docScore = 70;
    let careScore = 80;
    let envScore = 85;
    let commScore = 50;
    let evidScore = Math.min(100, evidenceItems.length * 35);
    let timeScore = Math.min(100, timelineEvents.length * 30);

    const strongPoints: string[] = [];
    const riskPoints: string[] = [];

    // Evaluate diagnostic answers
    if (diagnostic.careHistory === 'shared_equal') {
      careScore = 95;
      strongPoints.push('Doložitelná rovnocenná historie péče před rozchodem.');
    } else if (diagnostic.careHistory === 'mother_primary') {
      careScore = 60;
      riskPoints.push('Péče doposud spočívala převážně na matce – je nutné prokázat vaše aktivní zapojení.');
    }

    if (diagnostic.youngestChildAge === 'toddler_1_3' || diagnostic.youngestChildAge === 'infant_under_1') {
      strongPoints.push('Možnost argumentace nálezem ÚS I. ÚS 1506/21 k střídavé péči v útlém věku.');
    }

    if (diagnostic.communicationLevel === 'constructive_biff') {
      commScore = 90;
      strongPoints.push('Schopnost zachovávat věcnou BIFF komunikaci i v krizových chvílích.');
    } else {
      commScore = 40;
      riskPoints.push('Vysoká míra konfliktu s druhým rodičem – doporučujeme striktně přejít na písemnou BIFF komunikaci.');
    }

    if (evidenceItems.filter(e => e.trustTag === 'VERIFIED').length >= 2) {
      strongPoints.push('Máte k dispozici ověřené oficiální podklady v Trezoru.');
    } else {
      riskPoints.push('Nízký počet ověřených oficiálních listinných důkazů.');
    }

    if (diagnostic.livingDistance === 'same_city' || diagnostic.livingDistance === 'under_15km') {
      envScore = 95;
      strongPoints.push('Nízká geografická vzdálenost rodinných domovů usnadňuje logistiku střídavé péče.');
    } else {
      envScore = 60;
      riskPoints.push('Větší vzdálenost mezi rodiči vyžaduje asymetrický nebo flexibilní harmonogram.');
    }

    const totalScore = Math.round(
      docScore * 0.2 +
      careScore * 0.2 +
      envScore * 0.15 +
      commScore * 0.15 +
      evidScore * 0.15 +
      timeScore * 0.15
    );

    return {
      totalScore: Math.min(100, Math.max(10, totalScore)),
      docScore,
      careScore,
      envScore,
      commScore,
      evidScore,
      timeScore,
      strongPoints,
      riskPoints
    };
  };

  const readiness = calculateReadinessScore();

  // Phase 10: PDF Export
  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const createdDate = new Date().toLocaleDateString('cs-CZ');

      // Title & Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 32, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('TÁTA MÁ PRÁVO | SYNTHESIS OS', 15, 14);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('CRISIS NAVIGATOR 4.0 - OSOBNÍ AKČNÍ BALÍČEK (ACTION PACK)', 15, 22);

      let y = 42;

      // Case Metadata Box
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, 22, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, y, 180, 22, 'S');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`ID Případu: CASE-CRISIS-${auditHash.substring(0, 8)}`, 20, y + 7);
      doc.text(`Datum vygenerování: ${createdDate}`, 20, y + 14);
      doc.text(`Kryptografický Audit Hash: ${auditHash}`, 110, y + 7);
      doc.text(`Skóre Připravenosti: ${readiness.totalScore} %`, 110, y + 14);

      y += 30;

      // Section 1: Prvních 48 hodin
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(13, 148, 136); // teal-600
      doc.text('1. KRITICKÝ PROTOKOL PRVNÍCH 48 HODIN', 15, y);
      y += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);

      const steps48 = [
        '1. Zachovat absolutní klid a vyvarovat se hlasitým afektovaným konfrontacím.',
        '2. Odeslat matce věcnou BIFF zprávu s nabídkou konkrétního termínu předání dítěte.',
        '3. Všechny incidenty a odepření kontaktu ihned zaznamenat do Časové osy s časem a místem.',
        '4. Získat a zálohovat výpisy SMS, WhatsApp chatu a e-mailů do Trezoru důkazů.',
        '5. Kontaktovat OSPOD písemným oznámením o situaci s návrhem smírného řešení.'
      ];

      steps48.forEach(step => {
        doc.text(step, 20, y);
        y += 6;
      });

      y += 6;

      // Section 2: Diagnostický Souhrn
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(13, 148, 136);
      doc.text('2. DIAGNOSTICKÝ PROFILE PŘÍPADU', 15, y);
      y += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`- Věk nejmladšího dítěte: ${diagnostic.youngestChildAge}`, 20, y); y += 5;
      doc.text(`- Dosavadní historie péče: ${diagnostic.careHistory}`, 20, y); y += 5;
      doc.text(`- Míra komunikace rodičů: ${diagnostic.communicationLevel}`, 20, y); y += 5;
      doc.text(`- Bydlení a vzdálenost: ${diagnostic.livingDistance}`, 20, y); y += 8;

      // Section 3: Silné stránky a rizika
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(13, 148, 136);
      doc.text('3. VYHODNOCENÍ PŘIPRAVENOSTI (COURT READINESS ENGINE)', 15, y);
      y += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Silné stránky:', 20, y); y += 5;
      doc.setFont('helvetica', 'normal');
      readiness.strongPoints.forEach(sp => {
        doc.text(`• ${sp}`, 25, y); y += 5;
      });

      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.text('Oblasti k doplnění / Rizika:', 20, y); y += 5;
      doc.setFont('helvetica', 'normal');
      readiness.riskPoints.forEach(rp => {
        doc.text(`• ${rp}`, 25, y); y += 5;
      });

      y += 10;

      // Disclaimer Footer
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('PRÁVNÍ UPOZORNĚNÍ: Tento dokument má edukativní a organizační charakter. Nenahrazuje individuální právní zastoupení advokátem a nepředjímá výsledek soudního řízení.', 15, 285);

      doc.save(`Crisis_Action_Pack_${auditHash.substring(0, 8)}.pdf`);
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Došlo k chybě při generování PDF. Zkuste to znovu.');
    } finally {
      setIsExporting(false);
    }
  };

  // Add new event to timeline
  const handleAddTimelineEvent = () => {
    if (!newEventTitle.trim()) return;
    const newEvt: TimelineEventItem = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      date: newEventDate || new Date().toISOString().split('T')[0],
      category: newEventCategory,
      description: newEventDesc || 'Zadáno uživatelem v Krizovém navigátoru.',
      trustTag: 'USER_PROVIDED',
      evidenceIds: []
    };

    const updated = [newEvt, ...timelineEvents];
    setTimelineEvents(updated);
    handleAutoSave(diagnostic, updated, evidenceItems, mode);

    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventDate('');
  };

  // Quick helper to render trust badge
  const renderTrustBadge = (tag: 'VERIFIED' | 'USER_PROVIDED' | 'AI_ANALYSIS' | 'UNKNOWN') => {
    switch (tag) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED (Ověřeno)
          </span>
        );
      case 'AI_ANALYSIS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Sparkles className="w-3 h-3 text-purple-600" /> AI ANALYSIS
          </span>
        );
      case 'USER_PROVIDED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <FileText className="w-3 h-3 text-blue-600" /> USER PROVIDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <HelpCircle className="w-3 h-3 text-slate-500" /> UNKNOWN
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800 pb-12" id="crisis-navigator-4-root">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-teal-500/20">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Synthesis OS 4.0 Core Module
              </span>
              
              {saveStatus && (
                <span className="text-[10px] text-emerald-400 font-mono animate-fadeIn">
                  {saveStatus}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white flex items-center gap-3">
              Crisis Navigator 4.0
              <span className="text-xs px-2.5 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-lg font-mono">
                Interactive Guide
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Inteligentní strukturovaný průvodce opatrovnickou krizi. Zmapuje váš případ, sestaví časovou osu, prověří důkazy, spočítá skóre soudní připravenosti a vytvoří osobní Akční balíček.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                setMode('strategic');
                handleAutoSave(diagnostic, timelineEvents, evidenceItems, 'strategic');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'strategic' 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Strategický Režim</span>
            </button>

            <button
              onClick={() => {
                setMode('emergency');
                handleAutoSave(diagnostic, timelineEvents, evidenceItems, 'emergency');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'emergency' 
                  ? 'bg-rose-600 text-white shadow-md animate-pulse' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Akutní SOS Režim</span>
            </button>
          </div>
        </div>

        {/* Audit Metadata Line */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-4">
            <span>AUDIT HASH: <strong className="text-teal-400">{auditHash}</strong></span>
            <span>VERZE: <strong>v4.0.2 PROD</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSyncToWorkspace}
              className="text-teal-300 hover:text-teal-100 flex items-center gap-1 underline cursor-pointer"
            >
              <Save className="w-3 h-3" /> Uložit do Pracovny
            </button>
          </div>
        </div>
      </div>

      {/* PHASE 1: EMERGENCY SOS WARNING BANNER (Visible in Emergency Mode) */}
      {mode === 'emergency' && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 space-y-4 shadow-lg animate-fadeIn" id="emergency-sos-mode-banner">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-2xl shrink-0 shadow-md">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-rose-700 block">
                AKUTNÍ KRIZOVÝ PROTOKOL PRO PRVNÍCH 48 HODIN
              </span>
              <h3 className="text-lg font-black text-rose-950 font-display">
                Náhlé zadržení dítěte nebo vyhrocená situace
              </h3>
              <p className="text-xs text-rose-800 leading-relaxed mt-1">
                Pokud vám matka nebo jiná osoba odmítá předat dítě v rozporu s dohodou či rozhodnutím, zachovejte chladnou hlavu a postupujte podle tohoto okamžitého protokolu.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 font-mono">1. KROK</span>
                <Clock className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-xs text-slate-800 font-bold">Písemná výzva matce (BIFF)</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pošlete bezkonfliktní SMS/e-mail s návrhem konkrétního náhradního termínu. Žádné vyhrožování ani emoce.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 font-mono">2. KROK</span>
                <ShieldCheck className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-xs text-slate-800 font-bold">Záznam na OSPOD & Policii</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Při bezdůvodném odepření oznamte událost OSPODu. Policii volejte pouze v případě přímého ohrožení zdraví dítěte.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 font-mono">3. KROK</span>
                <FileText className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-xs text-slate-800 font-bold">Předběžné Opatření (§ 452 ZŘS)</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Při dlouhodobém odříznutí kontaktu podat okamžitý návrh na předběžné opatření k opatrovnickému soudu.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP PROGRESS WIZARD BAR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1 scrollbar-none">
          {[
            { num: 1, label: 'Diagnostický Strom', desc: 'Mapování případu' },
            { num: 2, label: 'Časová Osa', desc: 'Timeline událostí' },
            { num: 3, label: 'Trezor Důkazů', desc: 'Evidence Manager' },
            { num: 4, label: 'Court Readiness Engine', desc: 'Skóre připravenosti' },
            { num: 5, label: 'Personal Action Pack', desc: 'Export & Akční plán' }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all shrink-0 cursor-pointer text-left ${
                currentStep === s.num
                  ? 'bg-slate-900 text-white shadow-md'
                  : currentStep > s.num
                  ? 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs font-mono ${
                currentStep === s.num ? 'bg-teal-500 text-white' : currentStep > s.num ? 'bg-teal-200 text-teal-900' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <div>
                <p className="text-xs font-bold leading-none">{s.label}</p>
                <p className="text-[10px] opacity-75 mt-0.5 leading-none">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP CONTENT SWITCHER */}
      <div className="space-y-6">

        {/* STEP 1: DIAGNOSTICKÝ STROM (Phase 2 & 5 & 6) */}
        {currentStep === 1 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-extrabold uppercase tracking-wider block">
                  FÁZE 2: DIAGNOSTICKÝ STROM KRIZE
                </span>
                <h2 className="text-xl font-extrabold font-display text-slate-900">
                  Otázky pro přesnou adaptivní diagnostiku případu
                </h2>
              </div>
              <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-full font-mono">
                Případ ID: #{auditHash.substring(0, 6)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Fáze Případu */}
              <div className="space-y-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-600" /> Aktuální fáze opatrovnického řízení
                </label>
                <select
                  value={diagnostic.casePhase}
                  onChange={(e) => {
                    const updated = { ...diagnostic, casePhase: e.target.value as any };
                    setDiagnostic(updated);
                    handleAutoSave(updated);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="pre_court">Před zahájením (Rozchod / Dohoda bez soudu)</option>
                  <option value="ospod_active">Probíhající šetření na OSPOD</option>
                  <option value="court_pending">Podán návrh k soudu (Čekání na jednání)</option>
                  <option value="adverse_ruling">Vydán nepříznivý rozsudek 1. stupně</option>
                  <option value="appeal_change">Odvolací řízení / Změna poměrů po letech</option>
                </select>
              </div>

              {/* 2. Věk nejmladšího dítěte */}
              <div className="space-y-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" /> Věk nejmladšího dítěte
                </label>
                <select
                  value={diagnostic.youngestChildAge}
                  onChange={(e) => {
                    const updated = { ...diagnostic, youngestChildAge: e.target.value as any };
                    setDiagnostic(updated);
                    handleAutoSave(updated);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="infant_under_1">Kojenec (do 1 roku)</option>
                  <option value="toddler_1_3">Batole (1 až 3 roky)</option>
                  <option value="preschool_3_6">Předškolák (3 až 6 let)</option>
                  <option value="school_6_12">Školák (6 až 12 let)</option>
                  <option value="teen_12_plus">Dospívající (nad 12 let)</option>
                </select>
              </div>

              {/* 3. Historie Péče */}
              <div className="space-y-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" /> Dosavadní reálná historie péče
                </label>
                <select
                  value={diagnostic.careHistory}
                  onChange={(e) => {
                    const updated = { ...diagnostic, careHistory: e.target.value as any };
                    setDiagnostic(updated);
                    handleAutoSave(updated);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="shared_equal">Rovnocenná péče obou rodičů před rozchodem</option>
                  <option value="mother_primary">Převážná péče matky (otec pracoval / vázán složkou)</option>
                  <option value="father_primary">Převážná péče otce</option>
                  <option value="grandparents_help">Péče s výraznou pomocí prarodičů</option>
                </select>
              </div>

              {/* 4. Míra Komunikace */}
              <div className="space-y-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-600" /> Míra a kvalita komunikace rodičů
                </label>
                <select
                  value={diagnostic.communicationLevel}
                  onChange={(e) => {
                    const updated = { ...diagnostic, communicationLevel: e.target.value as any };
                    setDiagnostic(updated);
                    handleAutoSave(updated);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="constructive_biff">Věcná a konstruktivní (BIFF)</option>
                  <option value="latent_conflict">Latentní konflikt / emociální výčitky</option>
                  <option value="severe_obstruction">Otevřený boj & opakované bránění ve styku</option>
                  <option value="zero_communication">Nulová komunikace / blokace telefonního čísla</option>
                </select>
              </div>

              {/* 5. Vzdálenost Bydlení */}
              <div className="space-y-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-600" /> Bydlení a vzdálenost domovů
                </label>
                <select
                  value={diagnostic.livingDistance}
                  onChange={(e) => {
                    const updated = { ...diagnostic, livingDistance: e.target.value as any };
                    setDiagnostic(updated);
                    handleAutoSave(updated);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="same_city">Stejná obec / město (do 5 km)</option>
                  <option value="under_15km">Do 15 km (snadný dojezd do školy)</option>
                  <option value="15_50km">15 až 50 km (vyžaduje přesný dopravní kmit)</option>
                  <option value="over_50km">Nad 50 km (velká vzdálenost / stěhování)</option>
                  <option value="shared_house_unresolved">Stále ve společné domácnosti</option>
                </select>
              </div>

              {/* 6. Zpráva OSPOD */}
              <div className="space-y-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> Postoj kolizního opatrovníka (OSPOD)
                </label>
                <select
                  value={diagnostic.ospodStatus}
                  onChange={(e) => {
                    const updated = { ...diagnostic, ospodStatus: e.target.value as any };
                    setDiagnostic(updated);
                    handleAutoSave(updated);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="neutral_report">Vyvážený / Neutrální postoj OSPOD</option>
                  <option value="mother_biased_report">Zaujatá zpráva ve prospěch matky</option>
                  <option value="favorable_report">Podpora střídavé péče ze strany OSPOD</option>
                  <option value="contact_obstruction_reported">OSPOD eviduje bránění ve styku</option>
                </select>
              </div>

            </div>

            {/* Legal Knowledge Insights Panel (Phase 6 Integration) */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-teal-400" />
                  <h3 className="text-sm font-bold font-display text-white">
                    Relevantní právní a judikátní opora (Legal Knowledge Engine)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Zdroj: e-Sbírka & Ústavní soud ČR</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LEGAL_CITATIONS.slice(0, 2).map((cit, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                    <p className="text-xs font-bold text-teal-300 font-mono">{cit.code}</p>
                    <p className="text-[11px] font-bold text-slate-200">{cit.sections}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{cit.summary}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-400 italic font-mono pt-1">
                * Upozornění: Právní informace mají informativní charakter v rámci systému Synthesis OS a nenahrazují přímé právní zastoupení advokátem podle zákona o advokacii.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <span>Pokračovat na Časovou Osu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TIMELINE BUILDER (Phase 3 & Trust Tags) */}
        {currentStep === 2 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-extrabold uppercase tracking-wider block">
                  FÁZE 3: TIMELINE BUILDER
                </span>
                <h2 className="text-xl font-extrabold font-display text-slate-900">
                  Interaktivní časová osa klíčových událostí spisu
                </h2>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full font-mono">
                Počet událostí: {timelineEvents.length}
              </span>
            </div>

            {/* Form for adding new event */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Plus className="w-4 h-4 text-teal-600" /> Přidat novou událost do časové osy
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Název události</label>
                  <input
                    type="text"
                    placeholder="např. Podání vyjádření na OSPOD"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Datum události</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Kategorie</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="incident">Incident / Bezdůvodné odepření</option>
                    <option value="ospod_report">Jednání OSPOD</option>
                    <option value="court_petition">Podání návrhu k soudu</option>
                    <option value="hearing">Soudní jednání</option>
                    <option value="breakup">Rozchod rodičů</option>
                    <option value="medical_school">Škola / Lékař dítěte</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Podrobný popis & dopad</label>
                <textarea
                  placeholder="Popište co přesně se stalo, jaká byla reakce a zda existují svědci..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAddTimelineEvent}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Uložit událost
                </button>
              </div>
            </div>

            {/* Visual Timeline list */}
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
              {timelineEvents.map((item, idx) => (
                <div key={item.id} className="relative group">
                  {/* Timeline node icon */}
                  <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold font-mono shadow-xs">
                    {idx + 1}
                  </div>

                  <div className="bg-slate-50/90 hover:bg-white p-4 rounded-2xl border border-slate-200 transition-all space-y-2 shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-700 px-2 py-0.5 bg-teal-50 border border-teal-200 rounded-lg">
                          {item.date}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {renderTrustBadge(item.trustTag)}
                        <button
                          onClick={() => {
                            const updated = timelineEvents.filter(e => e.id !== item.id);
                            setTimelineEvents(updated);
                            handleAutoSave(diagnostic, updated, evidenceItems, mode);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Smazat událost"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Zpět
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <span>Pokračovat na Trezor Důkazů</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EVIDENCE MANAGER (Phase 4 & 5) */}
        {currentStep === 3 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-extrabold uppercase tracking-wider block">
                  FÁZE 4: EVIDENCE MANAGER (TREZOR DŮKAZŮ)
                </span>
                <h2 className="text-xl font-extrabold font-display text-slate-900">
                  Správa a ověřování důkazního materiálu
                </h2>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full font-mono">
                Aktivní důkazy: {evidenceItems.length}
              </span>
            </div>

            {/* Drag and Drop Zone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-3xl p-8 text-center bg-slate-50/50 hover:bg-teal-50/30 transition-all space-y-3 cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Přetáhněte sem soubor nebo klikněte pro nahrání</p>
                <p className="text-xs text-slate-500">Podporuje PDF, DOCX, fotky, audio nahrávky, snímky obrazovky SMS & WhatsApp</p>
              </div>
            </div>

            {/* Evidence Cards list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidenceItems.map((ev) => (
                <div key={ev.id} className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200 space-y-3 relative group hover:border-slate-300 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-teal-100/80 text-teal-800 rounded-xl">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                        <p className="text-[10px] font-mono text-slate-400">{ev.fileName} • {ev.fileSize}</p>
                      </div>
                    </div>

                    {renderTrustBadge(ev.trustTag)}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                    {ev.notes}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-200/60">
                    <span>Nahráno: {ev.uploadDate}</span>
                    <button
                      onClick={() => {
                        const updated = evidenceItems.filter(e => e.id !== ev.id);
                        setEvidenceItems(updated);
                        handleAutoSave(diagnostic, timelineEvents, updated, mode);
                      }}
                      className="text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                    >
                      Odstranit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Zpět
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <span>Pokračovat na Court Readiness Score</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: COURT READINESS ENGINE (Phase 8 & 9) */}
        {currentStep === 4 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-extrabold uppercase tracking-wider block">
                  FÁZE 8: COURT READINESS ENGINE
                </span>
                <h2 className="text-xl font-extrabold font-display text-slate-900">
                  Vyhodnocení skóre připravenosti spisu
                </h2>
              </div>
              <span className="px-3 py-1 bg-teal-100 text-teal-900 text-xs font-bold rounded-full font-mono">
                Index: {readiness.totalScore} %
              </span>
            </div>

            {/* Score Display Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider block">
                  CELKOVÉ SKÓRE PŘIPRAVENOSTI
                </span>
                <h3 className="text-3xl sm:text-4xl font-black font-display text-white">
                  {readiness.totalScore} %
                </h3>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  Vyhodnocení na základě úplnosti dokumentů, kontinuity péče, BIFF komunikace a časové osy.
                </p>
              </div>

              {/* Progress Circle Visual */}
              <div className="w-28 h-28 rounded-full border-8 border-teal-500/20 border-t-teal-400 flex items-center justify-center font-black font-mono text-2xl text-teal-300 shrink-0 bg-slate-800 shadow-inner">
                {readiness.totalScore}%
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Dokumentace & Podklady', score: readiness.docScore },
                { label: 'Historie Kontinuity Péče', score: readiness.careScore },
                { label: 'Stabilita Bydlení', score: readiness.envScore },
                { label: 'Kvalita Komunikace (BIFF)', score: readiness.commScore },
                { label: 'Důkazní Spis v Trezoru', score: readiness.evidScore },
                { label: 'Jasnost Časové Osy', score: readiness.timeScore }
              ].map((m, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{m.label}</span>
                    <span className="font-mono text-teal-700">{m.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-600 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, m.score)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Verbal Strong & Weak Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-extrabold font-mono text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Silné stránky případu
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {readiness.strongPoints.map((sp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{sp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-extrabold font-mono text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Oblasti k doplnění & Rizika
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {readiness.riskPoints.map((rp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{rp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Zpět
              </button>

              <button
                onClick={() => setCurrentStep(5)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <span>Generovat Personal Action Pack</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PERSONAL ACTION PACK & EXPORTS (Phase 7 & 10) */}
        {currentStep === 5 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-extrabold uppercase tracking-wider block">
                  FÁZE 7 & 10: PERSONAL ACTION PACK & DOCUMENT GENERATOR
                </span>
                <h2 className="text-xl font-extrabold font-display text-slate-900">
                  Váš Osobní Akční Balíček a exportní výstupy
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Generuji PDF...' : 'Stáhnout PDF Action Pack'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                  title="Tisk"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Structured Action Pack Preview */}
            <div className="space-y-6">
              
              {/* Section 1: Prvních 48 hodin */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" /> Prvních 48 hodin (Okamžitá doporučení)
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Odeslat matce klidnou a zřetelnou BIFF zprávu ohledně předání dítěte.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Uložit veškeré příchozí SMS a e-maily do Trezoru s časovým razítkem.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Připravit fotodokumentaci dětského pokoje a studijního zázemí pro OSPOD.</span>
                  </li>
                </ul>
              </div>

              {/* Section 2: Čemu se vyhnout */}
              <div className="p-5 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
                <h3 className="text-sm font-bold text-rose-950 font-display flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Čemu se kategoricky vyhnout
                </h3>
                <ul className="space-y-2 text-xs text-rose-900">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>Žádné hlasité potyčky nebo natáčení druhého rodiče na telefon z bezprostřední blízkosti před dítětem.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>Nepodepisovat unáhlené "dohody" pod nátlakem bez předchozí konzultace.</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Zpět
              </button>

              <button
                onClick={handleSyncToWorkspace}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Uložit kompletní případ do Pracovny</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
