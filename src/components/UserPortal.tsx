/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Search, 
  Tag, 
  MessageSquare, 
  ChevronRight, 
  User, 
  BookOpen, 
  Scale, 
  ArrowRight, 
  UploadCloud, 
  Info, 
  AlertTriangle, 
  ShieldCheck, 
  CalendarDays, 
  ExternalLink, 
  Send, 
  Check,
  X,
  FileCheck,
  Lock,
  MessageCircle,
  HelpCircle,
  Bell,
  Printer,
  Bookmark,
  Notebook,
  CheckSquare
} from 'lucide-react';

import { 
  User as UserType, 
  TimelineNode, 
  TimelineNodeType, 
  EvidenceFile, 
  EvidenceType,
  CaseInfo,
  NotificationItem,
  PrivateMessage
} from '../types';

interface UserPortalProps {
  currentUser: UserType | null;
  onOpenAuth: () => void;
}

// Predefined colors/icons for timeline nodes
const NODE_TYPES: { type: TimelineNodeType; label: string; color: string; bg: string; border: string; iconColor: string }[] = [
  { type: 'proposal', label: '🟢 Podání návrhu', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', iconColor: 'bg-emerald-500' },
  { type: 'mother_response', label: '🔵 Vyjádření matky', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'bg-blue-500' },
  { type: 'ospod', label: '🟣 OSPOD', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', iconColor: 'bg-purple-500' },
  { type: 'court_hearing', label: '🟠 Soudní jednání', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'bg-amber-500' },
  { type: 'judgment', label: '🔴 Rozsudek', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', iconColor: 'bg-rose-500' },
  { type: 'appeal', label: '🟡 Odvolání', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', iconColor: 'bg-yellow-500' },
  { type: 'other', label: '⚪ Ostatní událost', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', iconColor: 'bg-slate-400' }
];

// Prefilled mock data for first-time use
const DEFAULT_CASE: CaseInfo = {
  id: 'case-1',
  childName: '',
  status: 'Příprava sporu',
  courtName: 'Zatím nevybráno',
  notes: 'Klikněte na "Upravit" pro nastavení informací o vašem opatrovnickém případu.',
  createdAt: new Date().toISOString()
};

const DEFAULT_EVIDENCE: EvidenceFile[] = [];

const DEFAULT_TIMELINE: TimelineNode[] = [];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [];

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'room', label: 'Dětský pokoj / zázemí připraveno k šetření', description: 'Mít připravenou postýlku, hračky, bezpečné prostředí a úložný prostor.', checked: false },
  { id: 'evidence', label: 'Důkazní spis zkompletován a označen štítky', description: 'Všechny SMS, fotky a nahrávky jsou uložené v Trezoru důkazů s datem a popisem.', checked: false },
  { id: 'proposal', label: 'Návrh podání vypracován a doručen soudu', description: 'Věcně a slušně zformulovaný návrh bez osobních útoků na protistranu.', checked: false },
  { id: 'comms', label: 'Komunikační kanály očištěny od emocí', description: 'Veškerá komunikace s druhým rodičem je vedena věcně, stručně a výhradně k dítěti (metoda BIFF).', checked: false },
  { id: 'plan', label: 'Podrobný plán péče připraven', description: 'Harmonogram střídání včetně prázdnin, svátků, předání a logistiky dětí.', checked: false },
  { id: 'mediator', label: 'Konzultace s mediátorem / právníkem splněna', description: 'Právní zastoupení nebo alespoň konzultace s rodinným advokátem pro ujasnění rizik.', checked: false },
  { id: 'psychology', label: 'Psychologická příprava (vlastní i dítěte)', description: 'Ujasnění si psychologických aspektů sporu, chránění dítěte před detaily řízení.', checked: false }
];

const DEFAULT_MESSAGES: PrivateMessage[] = [];

export default function UserPortal({ currentUser, onOpenAuth }: UserPortalProps) {
  // Navigation tabs inside portal
  const [portalTab, setPortalTab] = useState<'case-map' | 'evidence' | 'calendar' | 'ai-helper' | 'inbox' | 'saved-content' | 'ai-notes'>('case-map');

  // Print Mode State
  const [showPrintOverlay, setShowPrintOverlay] = useState<boolean>(false);

  // Persistence States synced with localStorage
  const [caseInfo, setCaseInfo] = useState<CaseInfo>(() => {
    const saved = localStorage.getItem('sh_portal_case_info');
    return saved ? JSON.parse(saved) : DEFAULT_CASE;
  });

  const [evidenceList, setEvidenceList] = useState<EvidenceFile[]>(() => {
    const saved = localStorage.getItem('sh_portal_evidence');
    return saved ? JSON.parse(saved) : DEFAULT_EVIDENCE;
  });

  const [timelineNodes, setTimelineNodes] = useState<TimelineNode[]>(() => {
    const saved = localStorage.getItem('sh_portal_timeline');
    return saved ? JSON.parse(saved) : DEFAULT_TIMELINE;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sh_portal_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const [messages, setMessages] = useState<PrivateMessage[]>(() => {
    const saved = localStorage.getItem('sh_portal_messages');
    return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
  });

  // Checklist of court readiness
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('sh_portal_checklist');
    return saved ? JSON.parse(saved) : DEFAULT_CHECKLIST;
  });

  // Favorite / Saved Articles and Judgment rules
  const [savedArticles, setSavedArticles] = useState<{ id: string; title: string; category: string }[]>(() => {
    const saved = localStorage.getItem('sh_portal_saved_articles');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedJudgments, setSavedJudgments] = useState<{ id: string; courtName: string; caseNumber: string; summary: string }[]>(() => {
    const saved = localStorage.getItem('sh_portal_saved_judgments');
    return saved ? JSON.parse(saved) : [];
  });

  // AI Notebook Text area
  const [aiNotes, setAiNotes] = useState<string>(() => {
    const saved = localStorage.getItem('sh_portal_ai_notes');
    return saved || '';
  });

  // Timeline UI States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isEditingNode, setIsEditingNode] = useState<boolean>(false);
  const [isAddingNode, setIsAddingNode] = useState<boolean>(false);

  // Evidence UI States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddingEvidence, setIsAddingEvidence] = useState<boolean>(false);

  // Calendar UI States
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());
  const [customReminders, setCustomReminders] = useState<{ id: string; title: string; date: string; type: string }[]>(() => {
    const saved = localStorage.getItem('sh_portal_custom_reminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddingReminder, setIsAddingReminder] = useState<boolean>(false);
  const [newReminderTitle, setNewReminderTitle] = useState<string>('');
  const [newReminderDate, setNewReminderDate] = useState<string>('');
  const [newReminderType, setNewReminderType] = useState<string>('court_hearing');

  // AI Helper UI States
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: 'user' | 'ai'; text: string; relatedDocs?: { title: string; link: string }[] }[]>([
    {
      sender: 'ai',
      text: 'Ahoj! Jsem tvůj inteligentní opatrovnický průvodce Synthesis AI. Pomohu ti zorientovat se v rodinném právu, vysvětlím právní i psychologické pojmy, vyhledám související zákony a doporučím vhodné vzory podání.\n\n*Upozornění: Nejsem licencovaný advokát a moje rady nenahrazují oficiální právní poradenství. Vždy doporučuji konzultovat kroky s rodinným právníkem.*'
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Form states for adding/editing timeline nodes
  const [nodeForm, setNodeForm] = useState<Partial<TimelineNode>>({
    type: 'other',
    title: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    evidenceIds: [],
    deadlineDate: '',
    deadlineCompleted: false
  });

  // Form states for adding evidence
  const [evidenceForm, setEvidenceForm] = useState<Partial<EvidenceFile>>({
    name: '',
    type: 'pdf',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    tags: []
  });
  const [newTagInput, setNewTagInput] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('sh_portal_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('sh_portal_case_info', JSON.stringify(caseInfo));
  }, [caseInfo]);

  useEffect(() => {
    localStorage.setItem('sh_portal_evidence', JSON.stringify(evidenceList));
  }, [evidenceList]);

  useEffect(() => {
    localStorage.setItem('sh_portal_timeline', JSON.stringify(timelineNodes));
  }, [timelineNodes]);

  useEffect(() => {
    localStorage.setItem('sh_portal_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sh_portal_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('sh_portal_saved_articles', JSON.stringify(savedArticles));
  }, [savedArticles]);

  useEffect(() => {
    localStorage.setItem('sh_portal_saved_judgments', JSON.stringify(savedJudgments));
  }, [savedJudgments]);

  useEffect(() => {
    localStorage.setItem('sh_portal_ai_notes', aiNotes);
  }, [aiNotes]);

  // Extract all unique tags for evidence
  const allTags = ['all', ...Array.from(new Set(evidenceList.flatMap(e => e.tags)))];

  // Helper to trigger AI Response
  const handleAskAi = (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg = questionText;
    setAiChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiQuery('');
    setIsAiLoading(true);

    setTimeout(() => {
      let responseText = '';
      let relatedDocs: { title: string; link: string }[] = [];

      const q = userMsg.toLowerCase();
      
      if (q.includes('monotrop') || q.includes('vazb') || q.includes('pojem') || q.includes('pojm')) {
        responseText = `### 📖 Právní a psychologický výklad: Monotropie a Attachment

**Monotropie** je překonaná teorie z poloviny 20. století (John Bowlby), která tvrdila, že dítě má vrozenou potřebu vytvořit si citovou vazbu pouze k jediné klíčové osobě (typicky matce) a že jakékoliv jiné vazby jsou druhořadé.

**Moderní vědecký konsenzus (Richard Warshak et al., 2014):**
Tato teorie byla spolehlivě vyvrácena rozsáhlým výzkumem podepsaným 110 předními světovými odborníky na dětský vývoj. 
*   **Dvojí citová vazba:** Děti mají neurobiologickou kapacitu vytvořit si paralelní, plnohodnotné vazby k oběma rodičům již od narození.
*   **Role noční péče:** Společné rituály (ukládání ke spánku, probouzení, krmení, utěšování v noci) jsou klíčové pro rozvoj této vazby. Pokud je otec z noční péče vyloučen, citová vazba k němu se vyvíjí pomaleji a slaběji.
*   **Doporučení pro soud:** Argumentujte zájmem dítěte na zachování vazby k oběma rodičům paralelně. Použijte pojem "paralelní citová vazba" a odkažte na Warshakovu studii, kterou máme v sekci *Knihovna studií*.`;
        relatedDocs = [
          { title: 'Knihovna studií: Richard Warshak (2014) - Kompletní rozbor', link: '#studies' },
          { title: 'Judikát: Nález ÚS k právu obou rodičů na péči od útlého věku', link: '#judikatura' }
        ];
      } else if (q.includes('clanek') || q.includes('článek') || q.includes('hledat') || q.includes('najít') || q.includes('najdi')) {
        responseText = `### 🔍 Vyhledávání článků na webu Synthesis Hub

Na základě vašeho dotazu jsem prohledal naši databázi odborných příspěvků a vybral ty nejvhodnější pro vaši situaci:

1. **Jak vyvrátit teorii monotropie u soudu a OSPODu**
   *Praktická metodika, jak reagovat na tvrzení, že dítě je na matku fixované a otce nepotřebuje.*
2. **Metoda BIFF v praxi: Jak psát e-maily bez emocí**
   *Návod, jak komunikovat s konfliktním rodičem věcně, stručně a s jasným cílem.*
3. **Příprava na šetření OSPOD v bytě otce**
   *Seznam materiálních i psychologických náležitostí, na které se sociální pracovnice zaměřují.*

Všechny tyto články naleznete v naší hlavní sekci **Blog & Články**!`;
        relatedDocs = [
          { title: 'Blog & Články: Přejít na seznam příspěvků', link: '#clanky' },
          { title: 'Uložený obsah: Vaše oblíbené uložené materiály', link: '#saved-content' }
        ];
      } else if (q.includes('judikatur') || q.includes('judikát') || q.includes('doporuč') || q.includes('rozhod')) {
        responseText = `### ⚖️ Doporučená judikatura pro váš případ

Pro podporu vašeho návrhu na střídavou či společnou péči doporučuji odkázat na tyto klíčové nálezy Ústavního soudu ČR:

1. **Nález ÚS I. ÚS 3213/25 (Péče o malé děti):**
   *Ústavní soud konstatoval, že věk dítěte sám o sobě (např. u dětí do 3 let) není překážkou pro střídavou péči, pokud jsou oba rodiče způsobilí a dítě má k oběma bezpečnou vazbu.*
2. **Nález ÚS I. ÚS 1506/13 (Kritérium střídavé péče):**
   *Definuje střídavou péči jako prioritní model, pokud jsou splněny základní předpoklady (vazba, zájem o péči, stabilní zázemí). Nesouhlas jednoho z rodičů nemůže být sám o sobě důvodem pro zamítnutí střídavé péče.*

*Tyto judikáty si můžete uložit do záložky "Uložený obsah" pro rychlý přístup při psaní podání.*`;
        relatedDocs = [
          { title: 'Judikatura: Přejít na vyhledávač judikátů', link: '#judikatura' },
          { title: 'Uložený obsah: Zobrazit uloženou judikaturu', link: '#saved-content' }
        ];
      } else if (q.includes('shrn') || q.includes('shrnutí') || q.includes('rozsudek')) {
        responseText = `### 📄 Shrnutí rozsudku (Simulovaný AI analyzátor)

Pokud byste nahráli rozsudek do **Trezoru důkazů** a požádali o jeho shrnutí, náš AI motor by jej zanalyzoval v těchto krocích:

1. **Výrok rozsudku:** Rozdělení na výrok o péči (komu je svěřeno), výživném (kolik a kdy se platí) a styku (přesný harmonogram sudých/lichých týdnů, prázdnin a svátků).
2. **Klíčové argumenty soudu:** Proč se soud přiklonil k dané variantě (např. posudek kolizního opatrovníka OSPOD, stanovisko psychologa, stabilita prostředí).
3. **Identifikovaná rizika a lhůty:** Upozornění na lhůtu pro odvolání (15 dní od doručení vyhotovení) a doporučené odvolací body.

**Chcete-li analyzovat skutečné PDF:** Nahrajte soubor do *Trezoru důkazů* s názvem obsahujícím slovo "rozsudek" a poté se mě zeptejte znovu na konkrétní body.`;
        relatedDocs = [
          { title: 'Trezor důkazů: Nahrát rozsudek pro analýzu', link: '#evidence' }
        ];
      } else if (q.includes('příloh') || q.includes('přílohy') || q.includes('chyb') || q.includes('kontrola') || q.includes('podání')) {
        // Run simulated check against actual evidenceList
        const hasBirthCert = evidenceList.some(e => e.name.toLowerCase().includes('rodn') || e.tags.some(t => t.toLowerCase().includes('rodn')));
        const hasIncome = evidenceList.some(e => e.name.toLowerCase().includes('příjem') || e.name.toLowerCase().includes('prijem') || e.name.toLowerCase().includes('mzda') || e.name.toLowerCase().includes('daň') || e.tags.some(t => t.toLowerCase().includes('příjem')));
        const hasExpenses = evidenceList.some(e => e.name.toLowerCase().includes('náklad') || e.name.toLowerCase().includes('faktur') || e.name.toLowerCase().includes('skolk'));
        
        const missing = [];
        const present = [];
        
        if (hasBirthCert) present.push('Rodný list dítěte (ověřená kopie)'); else missing.push('Rodný list dítěte (ověřená kopie) - *Nutný k doložení aktivní legitimace.*');
        if (hasIncome) present.push('Potvrzení o příjmech / daňové přiznání'); else missing.push('Doklad o vašich příjmech (např. potvrzení zaměstnavatele za 12 měsíců nebo daňové přiznání) - *Soud bez toho nemůže určit výživné.*');
        if (hasExpenses) present.push('Doklady o nákladech dítěte (školka, kroužky, zdraví)'); else missing.push('Doklady o specifických nákladech na dítě (faktury za kroužky, poplatky za školku, léčiva).');
        
        responseText = `### 📁 Audit příloh podání pro soud (Analýza vašeho Trezoru)

Na základě skenování vašeho šifrovaného **Trezoru důkazů** přináším aktuální kontrolu připravenosti dokumentů, které musíte přiložit k návrhu na úpravu péče:

✅ **Nalezené přílohy ve vašem Trezoru:**
${present.length > 0 ? present.map(p => `*   **${p}**`).join('\n') : '*   *V Trezoru nebyly identifikovány žádné standardní dokumenty příloh.*'}

⚠️ **Chybějící přílohy (Doporučeno ihned nahrát):**
${missing.length > 0 ? missing.map(m => `*   ${m}`).join('\n') : '*   *Skvělé! Všechny základní dokumenty máte připravené.*'}

**Rychlé doporučení:** Všechny chybějící přílohy naskenujte a uložte do Trezoru důkazů se správnými štítky, aby byly připraveny k exportu celého spisu.`;
        relatedDocs = [
          { title: 'Trezor důkazů: Spravovat a nahrávat přílohy', link: '#evidence' },
          { title: 'Kontrola připravenosti na soud: Kompletní skóre', link: '#case-map' }
        ];
      } else if (q.includes('osnov') || q.includes('osnova') || q.includes('vzor')) {
        responseText = `### 📝 Doporučená osnova návrhu na střídavou péči

*⚖️ **DŮLEŽITÉ UPOZORNĚNÍ:** Tato osnova má pouze informativní charakter, nepředstavuje oficiální právní radu a nenahrazuje služby advokáta. Před odesláním soudu doporučujeme nechat návrh zrevidovat právním zástupcem.*

Pokud připravujete návrh na svěření dítěte do střídavé péče, struktura podání by měla vypadat následovně:

1. **Záhlaví (Kdo podává a komu):**
   *   Příslušný okresní soud (dle bydliště dítěte).
   *   Účastníci řízení: Matka (jméno, bydliště, r.č.), Otec (jméno, bydliště, r.č.), nezletilé dítě (jméno, datum narození, bydliště).
2. **Název podání:**
   *   *Návrh otce na zahájení řízení o úpravu poměrů k nezletilému pro dobu před i po rozvodu.*
3. **Popis skutkového stavu (Jak to v rodině chodí):**
   *   Kdy se dítě narodilo, kde žilo.
   *   Jak se oba rodiče podíleli na péči před rozpadem vztahu (např. otec koupal, vodil do školky, uspáva l).
   *   Popis aktuálního uspořádání.
4. **Odůvodnění střídavé péče (Proč je to nejlepší pro dítě):**
   *   Oba rodiče mají stabilní bydlení, příjmy a citové zázemí.
   *   Dítě má vybudovanou bezpečnou vazbu k oběma rodičům.
   *   Odkaz na judikaturu Ústavního soudu (např. I. ÚS 3213/25).
5. **Petit (To, co přesně navrhujete, aby soud schválil):**
   *   *„Nezletilý se svěřuje pro dobu před i po rozvodu do střídavé péče obou rodičů v intervalu 7 kalendářních dnů...“*
6. **Seznam příloh, datum, podpis.**

Tuto osnovu můžete použít jako kostru ve svém **AI Poznámkovém bloku** v sousední záložce.`;
        relatedDocs = [
          { title: 'AI Poznámkový blok: Začít psát koncept podání', link: '#ai-notes' },
          { title: 'Centrum formulářů: Interaktivní generátor návrhů', link: '#formulare' }
        ];
      } else {
        responseText = `### 👋 Synthesis AI Opatrovnický Průvodce

Děkuji za zprávu! Rád vám pomohu s čímkoliv ohledně opatrovnického řízení. Můžete se mě zeptat například na:

*   **Vysvětlení pojmu** (např. *„Co je monotropie?“*)
*   **Vyhledání článku** (např. *„Najdi článek o OSPOD šetření“*)
*   **Doporučení judikatury** (např. *„Doporuč judikáty k péči o malé dítě“*)
*   **Kontrolu příloh** (např. *„Zkontroluj chybějící přílohy v mém podání“*)
*   **Osnovu podání** (např. *„Navrhni osnovu odvolání“*)

Jaký krok nebo otázku dnes společně probereme?`;
        relatedDocs = [
          { title: 'Knihovna studií', link: '#studies' },
          { title: 'Centrum formulářů', link: '#formulare' }
        ];
      }

      setAiChatHistory(prev => [...prev, { sender: 'ai', text: responseText, relatedDocs }]);
      setIsAiLoading(false);
    }, 1200);
  };

  // Timeline node handlers
  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsEditingNode(false);
  };

  const handleAddNode = () => {
    if (!nodeForm.title) return;
    const newNode: TimelineNode = {
      id: `node-${Date.now()}`,
      caseId: caseInfo.id,
      type: nodeForm.type as TimelineNodeType,
      title: nodeForm.title,
      date: nodeForm.date || new Date().toISOString().split('T')[0],
      notes: nodeForm.notes || '',
      evidenceIds: nodeForm.evidenceIds || [],
      deadlineDate: nodeForm.deadlineDate || undefined,
      deadlineCompleted: nodeForm.deadlineDate ? false : undefined
    };

    setTimelineNodes(prev => [...prev, newNode].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setIsAddingNode(false);
    setNodeForm({ type: 'other', title: '', date: new Date().toISOString().split('T')[0], notes: '', evidenceIds: [] });
    setSelectedNodeId(newNode.id);
  };

  const handleDeleteNode = (id: string) => {
    setTimelineNodes(prev => prev.filter(n => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleUpdateNode = () => {
    if (!selectedNodeId) return;
    setTimelineNodes(prev => prev.map(n => {
      if (n.id === selectedNodeId) {
        return {
          ...n,
          title: nodeForm.title || n.title,
          type: nodeForm.type as TimelineNodeType || n.type,
          date: nodeForm.date || n.date,
          notes: nodeForm.notes || n.notes,
          evidenceIds: nodeForm.evidenceIds || n.evidenceIds,
          deadlineDate: nodeForm.deadlineDate || undefined
        };
      }
      return n;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setIsEditingNode(false);
  };

  const startEditNode = (node: TimelineNode) => {
    setNodeForm({
      type: node.type,
      title: node.title,
      date: node.date,
      notes: node.notes,
      evidenceIds: node.evidenceIds,
      deadlineDate: node.deadlineDate || ''
    });
    setIsEditingNode(true);
  };

  // Evidence handlers
  const handleAddEvidence = () => {
    if (!evidenceForm.name) return;
    const newEvidence: EvidenceFile = {
      id: `ev-${Date.now()}`,
      name: evidenceForm.name,
      type: evidenceForm.type as EvidenceType,
      notes: evidenceForm.notes || '',
      date: evidenceForm.date || new Date().toISOString().split('T')[0],
      tags: evidenceForm.tags || [],
      fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`
    };

    setEvidenceList(prev => [newEvidence, ...prev]);
    setIsAddingEvidence(false);
    setEvidenceForm({ name: '', type: 'pdf', notes: '', date: new Date().toISOString().split('T')[0], tags: [] });
  };

  const handleDeleteEvidence = (id: string) => {
    setEvidenceList(prev => prev.filter(e => e.id !== id));
    // Remove references in timeline nodes too
    setTimelineNodes(prev => prev.map(n => ({
      ...n,
      evidenceIds: n.evidenceIds.filter(eId => eId !== id)
    })));
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim();
    if (evidenceForm.tags && !evidenceForm.tags.includes(cleanTag)) {
      setEvidenceForm(prev => ({
        ...prev,
        tags: [...(prev.tags || []), cleanTag]
      }));
    }
    setNewTagInput('');
  };

  const handleRemoveFormTag = (tag: string) => {
    setEvidenceForm(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }));
  };

  // Calendar handlers
  const handleAddReminder = () => {
    if (!newReminderTitle || !newReminderDate) return;
    const newRem = {
      id: `rem-${Date.now()}`,
      title: newReminderTitle,
      date: newReminderDate,
      type: newReminderType
    };
    setCustomReminders(prev => [...prev, newRem]);
    setNewReminderTitle('');
    setNewReminderDate('');
    setIsAddingReminder(false);
  };

  const handleDeleteReminder = (id: string) => {
    setCustomReminders(prev => prev.filter(r => r.id !== id));
  };

  // Filter evidence based on search and tags
  const filteredEvidence = evidenceList.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || e.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const selectedNode = timelineNodes.find(n => n.id === selectedNodeId);

  // Unauthorized landing page
  if (!currentUser) {
    return (
      <div className="max-w-5xl mx-auto space-y-12 font-sans py-6 px-4" id="portal-unauthorized-root">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            Zabezpečené Osobní Úložiště
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-display">
            Portál Můj případ & Trezor důkazů
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Mějte svůj opatrovnický spor plně pod kontrolou. Vytvořte si interaktivní mapu případu, bezpečně třiďte své důkazy a nahrávky, sledujte lhůty a připravujte podklady pro soud s vlastním AI průvodcem.
          </p>
          <div className="pt-4">
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              Přihlásit se do portálu
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Grid with High-Fidelity Mock Illustrations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
              <Clock className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 font-display">
              1. Interaktivní Mapa Případu
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Vizualizujte vývoj sporu od podání návrhu přes OSPOD, soudní stání až po odvolání. Připojujte dokumenty, fotky a poznámky k jednotlivým časovým bodům.
            </p>
            {/* Minimal mockup illustration */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-700">Podání návrhu</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full">
                <div className="w-1/3 h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 border border-teal-100">
              <UploadCloud className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 font-display">
              2. Šifrovaný Trezor Důkazů
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nahrajte a označte štítky screenshoty SMS komunikace, e-maily, zvuky, videa či PDFs. Všechny důkazy jsou bezpečně uložené a připravené pro vašeho právníka.
            </p>
            {/* Minimal mockup illustration */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex gap-2">
              <div className="p-1.5 bg-white rounded border border-slate-200 text-[10px] font-mono text-slate-500 flex items-center gap-1 shrink-0">
                <Music className="w-3.5 h-3.5 text-teal-600" /> MP3
              </div>
              <div className="space-y-1 w-full">
                <div className="h-2 bg-slate-200 rounded w-3/4" />
                <div className="h-1.5 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 border border-purple-100">
              <Calendar className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 font-display">
              3. Hlídač Lhůt & Kalendář
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Už nikdy nezmeškáte 15denní lhůtu pro vyjádření soudu nebo návštěvu z OSPOD. Kalendář automaticky propočítává důležité mezníky vašeho sporu.
            </p>
            {/* Minimal mockup illustration */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-2">
              <div className="p-1 bg-purple-100 text-purple-700 text-[9px] font-bold rounded font-mono shrink-0">
                15 dní
              </div>
              <span className="text-[10px] text-slate-600 font-medium">Odvolací lhůta rozsudku</span>
            </div>
          </div>
        </div>

        {/* Informative CTA Block */}
        <div className="p-8 bg-slate-900 text-slate-100 rounded-3xl border border-slate-850 shadow-md flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="space-y-2 text-left md:max-w-2xl">
            <h4 className="text-base font-bold text-white font-display">
              Důležité ubezpečení o ochraně soukromí
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesis OS funguje s lokálním šifrováním. Vaše citlivé osobní údaje, nahrávky, jména dětí a dokumenty jsou bezpečně uchovávány a druhá strana k nim nemá žádný přístup. Portál slouží výhradně pro vaši přípravu.
            </p>
          </div>
          <button
            onClick={onOpenAuth}
            className="shrink-0 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Registrovat bezplatný profil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto px-1 md:px-4" id="user-portal-root">
      
      {/* Top Welcome Bar */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono font-bold text-teal-600">Osobní účet</span>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight font-display">
                {currentUser.name}
              </h2>
              <button
                onClick={() => setShowPrintOverlay(true)}
                className="px-2.5 py-1 bg-teal-50 border border-teal-100 rounded-lg text-[10px] font-bold text-teal-800 hover:bg-teal-100 transition-all flex items-center gap-1 cursor-pointer"
                title="Exportovat kompletní případ do PDF / vytisknout"
              >
                <Printer className="w-3.5 h-3.5" />
                PDF Export
              </button>
            </div>
            <p className="text-slate-500 text-xs">
              Aktivní správa kauzy: <strong className="text-slate-700">{caseInfo.childName}</strong>
            </p>
          </div>
        </div>

        {/* Tab switcher inside portal */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setPortalTab('case-map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              portalTab === 'case-map' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Mapa případu
          </button>
          <button
            onClick={() => setPortalTab('evidence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              portalTab === 'evidence' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Trezor důkazů
          </button>
          <button
            onClick={() => setPortalTab('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              portalTab === 'calendar' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Kalendář & Lhůty
          </button>
          <button
            onClick={() => setPortalTab('ai-notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              portalTab === 'ai-notes' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Notebook className="w-3.5 h-3.5" />
            AI Poznámkový blok
          </button>
          <button
            onClick={() => setPortalTab('saved-content')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              portalTab === 'saved-content' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Uložený obsah
          </button>
          <button
            onClick={() => setPortalTab('ai-helper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              portalTab === 'ai-helper' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            AI Průvodce
          </button>
          <button
            onClick={() => setPortalTab('inbox')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
              portalTab === 'inbox' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Zprávy
            {messages.some(m => !m.read) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE PORTAL TAB */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: CASE MAP & TIMELINE */}
        {portalTab === 'case-map' && (
          <motion.div
            key="case-map"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            id="tab-case-map-container"
          >
            
            {/* Case Info & Visual Map (Timeline nodes) - 7 cols */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Case Details Edit card */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Nastavení Kauzy</span>
                    <h3 className="text-base font-bold text-slate-800 font-display">{caseInfo.childName || 'Můj případ'} — Hlavní spor</h3>
                  </div>
                  <button 
                    onClick={() => {
                      const newChild = prompt("Zadejte jméno a věk dítěte:", caseInfo.childName);
                      const newCourt = prompt("Zadejte název opatrovnického soudu:", caseInfo.courtName);
                      const newStatus = prompt("Zadejte aktuální stav řízení:", caseInfo.status);
                      if (newChild && newCourt) {
                        setCaseInfo(prev => ({
                          ...prev,
                          childName: newChild,
                          courtName: newCourt,
                          status: newStatus || prev.status
                        }));
                      }
                    }}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1 transition-all"
                  >
                    <Edit2 className="w-3 h-3" />
                    Upravit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-mono text-[10px] uppercase block mb-1">Příslušný Soud</span>
                    <strong className="text-slate-700">{caseInfo.courtName}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-mono text-[10px] uppercase block mb-1">Stav řízení</span>
                    <strong className="text-teal-700 font-semibold">{caseInfo.status}</strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/50 text-xs text-slate-600 leading-relaxed">
                  <strong>Moje poznámky ke strategii:</strong> {caseInfo.notes}
                </div>
              </div>

              {/* KONTROLA PŘIPRAVENOSTI NA SOUD */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono font-bold text-teal-600">Kontrola připravenosti na soud</span>
                    <h3 className="text-base font-bold text-slate-800 font-display">Průvodce přípravou: Můj případ</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Splněno: {checklist.filter(c => c.checked).length} z {checklist.length} ({Math.round((checklist.filter(c => c.checked).length / (checklist.length || 1)) * 100)}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 transition-all duration-300"
                    style={{ width: `${(checklist.filter(c => c.checked).length / (checklist.length || 1)) * 100}%` }}
                  />
                </div>

                {/* List of checklist items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {checklist.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        item.checked 
                          ? 'bg-slate-50/60 border-slate-200/60' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-3xs'
                      }`}
                      onClick={() => {
                        setChecklist(prev => prev.map(c => {
                          if (c.id === item.id) {
                            return { ...c, checked: !c.checked };
                          }
                          return c;
                        }));
                      }}
                    >
                      <button
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                          item.checked 
                            ? 'bg-teal-600 border-teal-600 text-white' 
                            : 'bg-white border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="space-y-0.5 text-xs">
                        <span className={`font-bold block ${item.checked ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                          {item.label}
                        </span>
                        <p className="text-[10px] text-slate-400 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MAPA PŘÍPADU: INTERACTIVE TIMELINE */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-teal-50 border border-teal-200 text-teal-700 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                      Prémiová vizualizace
                    </span>
                    <h3 className="text-base font-bold text-slate-800 font-display">
                      Časová osa: Mapa mého případu
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setNodeForm({
                        type: 'other',
                        title: '',
                        date: new Date().toISOString().split('T')[0],
                        notes: '',
                        evidenceIds: [],
                        deadlineDate: ''
                      });
                      setIsAddingNode(true);
                    }}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-teal-400" />
                    Přidat bod osy
                  </button>
                </div>

                {/* HORIZONTAL / VERTICAL TIMELINE GRID */}
                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-1 before:bg-slate-100 before:rounded-full">
                  
                  {timelineNodes.map((node) => {
                    const nodeTypeInfo = NODE_TYPES.find(t => t.type === node.type) || NODE_TYPES[6];
                    const isSelected = selectedNodeId === node.id;
                    const connectedFilesCount = node.evidenceIds.length;

                    return (
                      <div 
                        key={node.id} 
                        className={`relative group transition-all duration-200 cursor-pointer ${
                          isSelected ? 'scale-[1.01]' : 'hover:translate-x-1'
                        }`}
                        onClick={() => handleSelectNode(node.id)}
                      >
                        {/* Bullet indicator with glowing ring on select */}
                        <div className={`absolute -left-6 sm:-left-8 top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white shadow-xs transition-all ${nodeTypeInfo.iconColor} ${
                          isSelected ? 'ring-4 ring-teal-500/25 scale-110' : 'group-hover:scale-105'
                        }`} />

                        {/* Event Card */}
                        <div className={`p-4 rounded-2xl border transition-all ${
                          isSelected 
                            ? 'bg-slate-900 text-white border-slate-950 shadow-md' 
                            : 'bg-white hover:bg-slate-50/50 border-slate-200/80 text-slate-800'
                        }`}>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <span className="text-[10px] font-mono font-bold tracking-wider opacity-80 uppercase">
                              {new Date(node.date).toLocaleDateString('cs-CZ')}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              {node.deadlineDate && (
                                <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold flex items-center gap-1 ${
                                  isSelected ? 'bg-teal-500/20 text-teal-300' : 'bg-rose-50 text-rose-700'
                                }`}>
                                  <Clock className="w-2.5 h-2.5" />
                                  Termín: {new Date(node.deadlineDate).toLocaleDateString('cs-CZ')}
                                </span>
                              )}
                              
                              <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                                isSelected ? 'bg-white/10 text-white' : nodeTypeInfo.bg + ' ' + nodeTypeInfo.color
                              }`}>
                                {nodeTypeInfo.label}
                              </span>
                            </div>
                          </div>

                          <h4 className="font-bold text-xs mt-2 font-display leading-snug">
                            {node.title}
                          </h4>

                          {node.notes && (
                            <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                              isSelected ? 'text-slate-300' : 'text-slate-500'
                            }`}>
                              {node.notes}
                            </p>
                          )}

                          {connectedFilesCount > 0 && (
                            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-dashed border-slate-200/20">
                              <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                              <span className="text-[10px] font-mono text-slate-400">
                                {connectedFilesCount} připojený důkaz / dokument
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                </div>

              </div>

            </div>

            {/* Right details panel for selected timeline node - 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              
              {isAddingNode ? (
                <div className="bg-slate-900 text-white border border-slate-950 rounded-3xl p-6 shadow-md space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <h4 className="font-bold text-xs font-display flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-teal-400" />
                      Nový bod osy
                    </h4>
                    <button onClick={() => setIsAddingNode(false)} className="text-slate-400 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Typ události</label>
                      <select 
                        value={nodeForm.type}
                        onChange={(e) => setNodeForm(prev => ({ ...prev, type: e.target.value as TimelineNodeType }))}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                      >
                        {NODE_TYPES.map(t => (
                          <option key={t.type} value={t.type}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Název / Nadpis</label>
                      <input 
                        type="text" 
                        placeholder="Např. OSPOD návštěva v bytě"
                        value={nodeForm.title}
                        onChange={(e) => setNodeForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Datum konání</label>
                      <input 
                        type="date"
                        value={nodeForm.date}
                        onChange={(e) => setNodeForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Klíčový termín / Lhůta (volitelně)</label>
                      <input 
                        type="date"
                        value={nodeForm.deadlineDate}
                        onChange={(e) => setNodeForm(prev => ({ ...prev, deadlineDate: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Poznámky & Strategie</label>
                      <textarea 
                        rows={4}
                        placeholder="Co se na schůzce řešilo, jaké jsou naše úkoly nebo argumenty..."
                        value={nodeForm.notes}
                        onChange={(e) => setNodeForm(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                      />
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button 
                        onClick={handleAddNode}
                        disabled={!nodeForm.title}
                        className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Uložit bod osy
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedNode ? (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-5">
                  <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Detaily bodu osy</span>
                      <h4 className="font-bold text-xs text-slate-800 font-display leading-snug">
                        {selectedNode.title}
                      </h4>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button 
                        onClick={() => startEditNode(selectedNode)}
                        className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer"
                        title="Upravit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteNode(selectedNode.id)}
                        className="p-1.5 border border-slate-200 rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer"
                        title="Smazat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isEditingNode ? (
                    <div className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Název</label>
                        <input 
                          type="text" 
                          value={nodeForm.title}
                          onChange={(e) => setNodeForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full border border-slate-200 p-2 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Datum</label>
                        <input 
                          type="date" 
                          value={nodeForm.date}
                          onChange={(e) => setNodeForm(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full border border-slate-200 p-2 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Poznámky</label>
                        <textarea 
                          rows={3}
                          value={nodeForm.notes}
                          onChange={(e) => setNodeForm(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full border border-slate-200 p-2 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={handleUpdateNode}
                          className="flex-1 py-1.5 bg-slate-900 text-white font-bold rounded-lg cursor-pointer text-center hover:bg-black"
                        >
                          Uložit změny
                        </button>
                        <button 
                          onClick={() => setIsEditingNode(false)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 cursor-pointer"
                        >
                          Zrušit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs">
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono uppercase text-slate-400 block">Strategický rozbor a poznámky</span>
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 whitespace-pre-wrap">
                          {selectedNode.notes || 'Žádné doplňující poznámky.'}
                        </p>
                      </div>

                      {/* Associated evidence list in timeline node */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono uppercase text-slate-400 block">Propojené důkazy z Trezoru</span>
                        
                        {selectedNode.evidenceIds.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">K tomuto bodu zatím nejsou připojeny žádné soubory.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {selectedNode.evidenceIds.map(evId => {
                              const evFile = evidenceList.find(e => e.id === evId);
                              if (!evFile) return null;
                              return (
                                <div key={evId} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white shadow-3xs">
                                  <div className="flex items-center gap-2">
                                    {evFile.type === 'pdf' && <FileText className="w-4 h-4 text-rose-500" />}
                                    {evFile.type === 'photo' && <Image className="w-4 h-4 text-emerald-500" />}
                                    {evFile.type === 'screenshot' && <Image className="w-4 h-4 text-blue-500" />}
                                    {evFile.type === 'audio' && <Music className="w-4 h-4 text-indigo-500" />}
                                    <span className="font-bold text-[11px] text-slate-700 truncate max-w-[150px]">{evFile.name}</span>
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-mono">{evFile.fileSize}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Dropdown/selector to associate existing evidence */}
                        <div className="pt-2">
                          <select
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val && !selectedNode.evidenceIds.includes(val)) {
                                setTimelineNodes(prev => prev.map(n => {
                                  if (n.id === selectedNode.id) {
                                    return { ...n, evidenceIds: [...n.evidenceIds, val] };
                                  }
                                  return n;
                                }));
                              }
                              e.target.value = '';
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-600 p-2 rounded-xl text-[11px] cursor-pointer focus:ring-1 focus:ring-teal-500 outline-none"
                          >
                            <option value="">+ Propojit s důkazem z Trezoru...</option>
                            {evidenceList
                              .filter(e => !selectedNode.evidenceIds.includes(e.id))
                              .map(e => (
                                <option key={e.id} value={e.id}>{e.name} ({e.type})</option>
                              ))
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs text-center text-slate-400 italic text-xs">
                  Vyberte ze seznamu konkrétní časový bod pro zobrazení podrobných dokumentů, důkazů a strategických poznámek.
                </div>
              )}

            </div>

          </motion.div>
        )}

        {/* TAB 2: EVIDENCE VAULT */}
        {portalTab === 'evidence' && (
          <motion.div
            key="evidence"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
            id="tab-evidence-container"
          >
            
            {/* Header info & Upload file button */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  Místní šifrované úložiště
                </span>
                <h3 className="text-base font-bold text-slate-800 font-display">Trezor důkazů (Správa důkazního spisu)</h3>
                <p className="text-xs text-slate-500">
                  Ukládejte, třiďte a označujte nahrávky, screenshoty SMS komunikace, protokoly nebo lékařské zprávy.
                </p>
              </div>

              <button
                onClick={() => {
                  setEvidenceForm({ name: '', type: 'pdf', notes: '', date: new Date().toISOString().split('T')[0], tags: [] });
                  setIsAddingEvidence(true);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4 text-teal-400 animate-pulse" />
                Nahrát / Přidat důkaz
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left filter pane - 3 cols */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* Search in Vault */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-3xs space-y-2">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">Vyhledat v Trezoru</span>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Název souboru, text..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                {/* Filter by Tag */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-3xs space-y-2">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">Kategorie / Štítky</span>
                  <div className="flex flex-col gap-1 text-xs">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`text-left px-2.5 py-1.5 rounded-lg font-medium capitalize flex items-center justify-between cursor-pointer ${
                          selectedTag === tag 
                            ? 'bg-teal-50 text-teal-800 font-bold' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3 h-3 opacity-60" />
                          {tag === 'all' ? 'Všechny štítky' : tag}
                        </span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-500">
                          {tag === 'all' ? evidenceList.length : evidenceList.filter(e => e.tags.includes(tag)).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vault Safety checklist */}
                <div className="bg-slate-900 text-slate-300 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-[11px]">
                  <span className="font-bold text-white uppercase font-mono text-[9px] block text-teal-400">Jak doložit důkaz</span>
                  <p className="leading-relaxed">
                    Každá nahrávka nebo screenshot získá nejvyšší váhu, pokud k němu v popisu dodáte:
                  </p>
                  <ul className="space-y-1 list-disc pl-4 text-slate-400">
                    <li>Přesné datum a čas pořízení.</li>
                    <li>Svědky, kteří byli u předání.</li>
                    <li>Stručný a přísně věcný přepis klíčových vět (bez vašich emotivních komentářů).</li>
                  </ul>
                </div>

              </div>

              {/* Grid of uploaded items - 9 cols */}
              <div className="lg:col-span-9 space-y-4">
                
                {/* Add new evidence Form Modal-overlay-like state inline */}
                {isAddingEvidence && (
                  <div className="bg-slate-50 border-2 border-dashed border-teal-300 rounded-2xl p-5 md:p-6 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <h4 className="font-bold text-xs text-teal-900 flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-teal-600" />
                        Přidat nový důkaz do Trezoru
                      </h4>
                      <button onClick={() => setIsAddingEvidence(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Název souboru</label>
                          <input
                            type="text"
                            placeholder="Zadejte název (např. SMS z 12. 6. - lékař.png)"
                            value={evidenceForm.name}
                            onChange={(e) => setEvidenceForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-white border border-slate-200 p-2.5 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Typ souboru</label>
                          <select
                            value={evidenceForm.type}
                            onChange={(e) => setEvidenceForm(prev => ({ ...prev, type: e.target.value as EvidenceType }))}
                            className="w-full bg-white border border-slate-200 p-2.5 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                          >
                            <option value="pdf">PDF dokument (.pdf)</option>
                            <option value="photo">Fotka (.jpg, .png)</option>
                            <option value="screenshot">Screenshot konverzace (.png)</option>
                            <option value="audio">Audio nahrávka (.mp3, .m4a)</option>
                            <option value="video">Video nahrávka (.mp4)</option>
                            <option value="email">E-mailová komunikace (.eml)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Datum pořízení</label>
                          <input
                            type="date"
                            value={evidenceForm.date}
                            onChange={(e) => setEvidenceForm(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-white border border-slate-200 p-2.5 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Poznámky, přepis nebo popis incidentu</label>
                          <textarea
                            rows={4}
                            placeholder="Vložte věcný popis, přepis rozhovoru, nebo co přesně screenshot dokazuje..."
                            value={evidenceForm.notes}
                            onChange={(e) => setEvidenceForm(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full bg-white border border-slate-200 p-2.5 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Štítky (Tags)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Např. OSPOD"
                              value={newTagInput}
                              onChange={(e) => setNewTagInput(e.target.value)}
                              className="flex-1 bg-white border border-slate-200 p-2 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            />
                            <button
                              type="button"
                              onClick={handleAddTag}
                              className="px-3 bg-slate-900 text-white font-bold rounded-xl cursor-pointer hover:bg-black"
                            >
                              Přidat
                            </button>
                          </div>
                          
                          {/* Display current form tags */}
                          {evidenceForm.tags && evidenceForm.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {evidenceForm.tags.map(t => (
                                <span key={t} className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 text-[9px] px-2 py-0.5 rounded-md font-bold">
                                  {t}
                                  <button type="button" onClick={() => handleRemoveFormTag(t)} className="hover:text-red-600 font-bold">✕</button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="pt-2 flex justify-end gap-2 text-xs">
                      <button
                        onClick={handleAddEvidence}
                        disabled={!evidenceForm.name}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                      >
                        Uložit do Trezoru
                      </button>
                      <button
                        onClick={() => setIsAddingEvidence(false)}
                        className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer"
                      >
                        Zrušit
                      </button>
                    </div>
                  </div>
                )}

                {/* Evidence items Grid list */}
                {filteredEvidence.length === 0 ? (
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center text-slate-400 italic text-xs">
                    <p>Žádné důkazy neodpovídají vyhledávání nebo zvolenému štítku.</p>
                    <p className="text-[11px] mt-1 text-slate-400 not-italic">Začněte nahrávat důležité nahrávky kliknutím na tlačítko "Nahrát / Přidat důkaz" výše.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredEvidence.map((ev) => {
                      const associatedNodes = timelineNodes.filter(n => n.evidenceIds.includes(ev.id));

                      return (
                        <div key={ev.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs hover:shadow-xs transition-all flex flex-col justify-between gap-4">
                          
                          <div className="space-y-3">
                            {/* File Title & Icon */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  ev.type === 'pdf' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                  ev.type === 'photo' || ev.type === 'screenshot' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                  ev.type === 'audio' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                  'bg-slate-50 text-slate-600 border border-slate-200'
                                }`}>
                                  {ev.type === 'pdf' && <FileText className="w-5 h-5" />}
                                  {(ev.type === 'photo' || ev.type === 'screenshot') && <Image className="w-5 h-5" />}
                                  {ev.type === 'audio' && <Music className="w-5 h-5" />}
                                  {ev.type === 'video' && <Video className="w-5 h-5" />}
                                  {ev.type === 'email' && <Mail className="w-5 h-5" />}
                                </div>

                                <div className="space-y-0.5">
                                  <h4 className="font-bold text-[12px] text-slate-800 line-clamp-1 leading-snug" title={ev.name}>
                                    {ev.name}
                                  </h4>
                                  <span className="text-[9px] font-mono text-slate-400 block">
                                    {new Date(ev.date).toLocaleDateString('cs-CZ')} • {ev.fileSize || 'Mock Size'}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleDeleteEvidence(ev.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Smazat soubor"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Brief note description */}
                            <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-wrap">
                              {ev.notes || 'Bez doplňujícího popisu.'}
                            </p>

                            {/* Display Tags */}
                            {ev.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {ev.tags.map(tag => (
                                  <span key={tag} className="inline-flex items-center gap-0.5 bg-slate-100 text-slate-600 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono">
                                    <Tag className="w-2 h-2" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Footer with connection details */}
                          <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-[10px]">
                            <span className="text-slate-400">
                              Připojení k mapě:
                            </span>
                            {associatedNodes.length > 0 ? (
                              <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                                ✓ {associatedNodes[0].title.slice(0, 18)}...
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">
                                Nepřipojeno
                              </span>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 3: CALENDAR */}
        {portalTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            id="tab-calendar-container"
          >
            
            {/* Calendar View - 8 cols */}
            <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-150">Hlídač Lhůt</span>
                  <h3 className="text-base font-bold text-slate-800 font-display">
                    Červenec 2026
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (calendarMonth === 0) {
                        setCalendarMonth(11);
                        setCalendarYear(y => y - 1);
                      } else {
                        setCalendarMonth(m => m - 1);
                      }
                    }}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-600 text-xs font-bold"
                  >
                    ← Předchozí
                  </button>
                  <button 
                    onClick={() => {
                      if (calendarMonth === 11) {
                        setCalendarMonth(0);
                        setCalendarYear(y => y + 1);
                      } else {
                        setCalendarMonth(m => m + 1);
                      }
                    }}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-600 text-xs font-bold"
                  >
                    Další →
                  </button>
                </div>
              </div>

              {/* Grid representation of July 2026 */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono">
                {/* Headers */}
                {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(d => (
                  <div key={d} className="font-bold text-slate-400 py-1 uppercase tracking-wider">{d}</div>
                ))}

                {/* Blank days before July 1 (July 1, 2026 was Wednesday, so 2 offset days: Mon, Tue) */}
                <div className="p-3 bg-slate-50/30 text-slate-300 rounded-lg">29</div>
                <div className="p-3 bg-slate-50/30 text-slate-300 rounded-lg">30</div>

                {/* Days 1 to 31 */}
                {Array.from({ length: 31 }, (_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `2026-07-${dayNum.toString().padStart(2, '0')}`;
                  
                  // Match with timeline nodes
                  const nodesOnDay = timelineNodes.filter(n => n.date === dateStr || n.deadlineDate === dateStr);
                  const remindersOnDay = customReminders.filter(r => r.date === dateStr);
                  const allEventsOnDay = [...nodesOnDay, ...remindersOnDay];

                  const hasEvents = allEventsOnDay.length > 0;

                  return (
                    <div 
                      key={dayNum} 
                      className={`p-2.5 min-h-[75px] rounded-xl border flex flex-col justify-between items-start transition-all ${
                        hasEvents 
                          ? 'bg-purple-50/40 border-purple-200 hover:bg-purple-50' 
                          : 'bg-white border-slate-100 hover:bg-slate-50/60'
                      }`}
                    >
                      <span className={`font-mono font-bold text-[10px] ${hasEvents ? 'text-purple-950' : 'text-slate-500'}`}>{dayNum}</span>
                      
                      {hasEvents && (
                        <div className="w-full space-y-0.5">
                          {allEventsOnDay.map(ev => (
                            <div 
                              key={ev.id} 
                              className="text-[8px] leading-tight font-sans font-bold bg-purple-600 text-white px-1 py-0.5 rounded truncate"
                              title={ev.title}
                            >
                              {ev.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Blank days at end of July (Aug 1, 2026 is Saturday, so 2 blank days Aug 1-2) */}
                <div className="p-3 bg-slate-50/30 text-slate-300 rounded-lg">1</div>
                <div className="p-3 bg-slate-50/30 text-slate-300 rounded-lg">2</div>
              </div>

            </div>

            {/* Sidebar list & Form to add custom reminders - 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Agenda List */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <CalendarDays className="w-4 h-4 text-purple-600" />
                  Nejbližší Termíny (Agenda)
                </h4>

                <div className="space-y-3">
                  {[...timelineNodes.filter(n => n.deadlineDate), ...customReminders].map((item) => {
                    return (
                      <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/50 text-xs flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                            {new Date(item.date || (item as any).deadlineDate).toLocaleDateString('cs-CZ')}
                          </span>
                          <h5 className="font-bold text-slate-800 font-display leading-tight">{item.title}</h5>
                        </div>

                        <button 
                          onClick={() => {
                            if (item.id.startsWith('rem-')) {
                              handleDeleteReminder(item.id);
                            } else {
                              alert("Tento termín je navázán na Mapu případu. Upravte ho přímo v první záložce.");
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Odstranit"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setIsAddingReminder(true)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  + Vytvořit vlastní připomínku
                </button>
              </div>

              {/* Add custom reminder Form inline */}
              {isAddingReminder && (
                <div className="bg-white border-2 border-dashed border-purple-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-xs text-purple-900 flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Přidat připomínku
                    </h4>
                    <button onClick={() => setIsAddingReminder(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Název události</label>
                      <input
                        type="text"
                        placeholder="Např. Konzultace s advokátem"
                        value={newReminderTitle}
                        onChange={(e) => setNewReminderTitle(e.target.value)}
                        className="w-full border border-slate-200 p-2 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Datum</label>
                      <input
                        type="date"
                        value={newReminderDate}
                        onChange={(e) => setNewReminderDate(e.target.value)}
                        className="w-full border border-slate-200 p-2 rounded-xl focus:ring-1 focus:ring-purple-500 outline-none"
                      />
                    </div>

                    <button
                      onClick={handleAddReminder}
                      disabled={!newReminderTitle || !newReminderDate}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      Uložit připomínku
                    </button>
                  </div>
                </div>
              )}

            </div>

          </motion.div>
        )}

        {/* TAB 4: AI HELPER CHAT */}
        {portalTab === 'ai-helper' && (
          <motion.div
            key="ai-helper"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            id="tab-ai-helper-container"
          >
            
            {/* Main Chat Interface - 8 cols */}
            <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
              
              <div className="space-y-4">
                
                {/* Chat Top Banner with disclaimers */}
                <div className="flex items-center gap-3 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/50">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-[10px] text-amber-800 leading-relaxed font-sans">
                    <strong>Upozornění:</strong> Synthesis AI průvodce vysvětluje odborné psychologické a právní termíny, dává strukturovaná doporučení, ale <strong>neposkytuje licencované právní poradenství</strong>. Každé podání doporučujeme před odesláním soudu nechat schválit advokátem.
                  </p>
                </div>

                {/* Message display log */}
                <div className="space-y-4 max-h-[350px] overflow-y-auto p-1">
                  {aiChatHistory.map((chat, idx) => {
                    const isAi = chat.sender === 'ai';
                    return (
                      <div 
                        key={idx} 
                        className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                          isAi ? 'bg-teal-100 text-teal-800' : 'bg-slate-800 text-white'
                        }`}>
                          {isAi ? 'AI' : 'Já'}
                        </div>

                        <div className={`p-4 rounded-2xl border text-xs leading-relaxed whitespace-pre-wrap ${
                          isAi ? 'bg-slate-50 border-slate-100 text-slate-700' : 'bg-teal-600 text-white border-transparent'
                        }`}>
                          {chat.text}

                          {/* Related documents suggestion block */}
                          {chat.relatedDocs && chat.relatedDocs.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 text-[10px] space-y-1.5 text-left">
                              <span className="font-bold text-teal-800 uppercase font-mono tracking-wider block">Doporučené podklady:</span>
                              {chat.relatedDocs.map((doc, dIdx) => (
                                <a 
                                  key={dIdx} 
                                  href={doc.link} 
                                  className="text-teal-700 hover:underline font-bold block flex items-center gap-1"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                  {doc.title}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isAiLoading && (
                    <div className="flex gap-3 mr-auto items-center text-xs text-slate-400">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">AI</div>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        <span>Odpovídám, vteřinu...</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Chat Input Area */}
              <div className="pt-4 border-t border-slate-100 mt-6 flex gap-2">
                <input
                  type="text"
                  placeholder="Zeptejte se na cokoliv: Co je monotropie? Jak napsat odvolání? Výše výživného..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAi(aiQuery)}
                  className="flex-1 border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                />
                <button
                  onClick={() => handleAskAi(aiQuery)}
                  className="px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Quick Prompts Helper Panel - 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  Rychlá Témata
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Klikněte na jakékoliv doporučené téma níže a náš AI průvodce vám okamžitě vysvětlí pojem, legislativní limity nebo psychologické studie.
                </p>

                <div className="flex flex-col gap-2">
                  {[
                    'Co je monotropie a jak ji vyvrátit?',
                    'Jaká je odvolací lhůta rozsudku?',
                    'Jak se počítá výživné v ČR?',
                    'Jak se připravit na pohovor OSPOD?'
                  ].map((qText) => (
                    <button
                      key={qText}
                      onClick={() => handleAskAi(qText)}
                      className="text-left p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 text-xs font-semibold text-slate-700 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <span>{qText}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 5: INBOX & SYSTEM NOTIFICATIONS */}
        {portalTab === 'inbox' && (
          <motion.div
            key="inbox"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            id="tab-inbox-container"
          >
            
            {/* Private Messages List - 7 cols */}
            <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-1.5 pb-3 border-b border-slate-100">
                <MessageCircle className="w-5 h-5 text-teal-600" />
                Soukromé zprávy (Poradna & Moderátoři)
              </h3>

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-4 rounded-2xl border transition-all ${
                      !msg.read ? 'bg-teal-50/40 border-teal-200' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/40">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                          {msg.senderName.charAt(0)}
                        </div>
                        <span className="font-bold text-xs text-slate-800">{msg.senderName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-400">{msg.date}</span>
                        {!msg.read && (
                          <span className="px-1.5 py-0.5 bg-teal-100 text-teal-800 font-bold font-mono text-[8px] rounded uppercase">Nová</span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                      {msg.text}
                    </p>

                    <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={() => {
                          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
                          const reply = prompt(`Odpovědět pro ${msg.senderName}:`);
                          if (reply) {
                            alert("Vaše zpráva byla bezpečně odeslána. Odpověď obdržíte v průběhu 24 hodin.");
                          }
                        }}
                        className="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer"
                      >
                        Odpovědět
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Notifications Panel - 5 cols */}
            <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-1.5 pb-3 border-b border-slate-100">
                <Bell className="w-5 h-5 text-purple-600" />
                Oznámení systému (Hlídač)
              </h3>

              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3.5 rounded-xl border flex gap-3 ${
                      notif.type === 'alert' ? 'bg-rose-50 border-rose-100/60 text-slate-850' : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      notif.type === 'alert' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <AlertCircle className="w-4 h-4" />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold">{notif.title}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{notif.date}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-600">{notif.content}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 6: AI NOTES SCRATCHPAD */}
        {portalTab === 'ai-notes' && (
          <motion.div
            key="ai-notes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            id="tab-ai-notes-container"
          >
            {/* Writing Area - 8 cols */}
            <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono font-bold text-teal-600 font-sans">Můj bezpečný zápisník</span>
                    <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                      <Notebook className="w-5 h-5 text-teal-600" />
                      AI Poznámkový blok k případu
                    </h3>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiNotes);
                        alert("Poznámky byly zkopírovány do schránky.");
                      }}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    >
                      Kopírovat
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Opravdu chcete smazat celý text poznámek?")) {
                          setAiNotes('');
                        }
                      }}
                      className="px-3 py-1.5 border border-rose-100 hover:bg-rose-50 text-xs font-bold text-rose-600 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    >
                      Vyčistit
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col mt-4">
                  <textarea
                    value={aiNotes}
                    onChange={(e) => setAiNotes(e.target.value)}
                    className="w-full flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-850 focus:ring-1 focus:ring-teal-500 outline-none resize-none font-sans min-h-[350px] leading-relaxed"
                    placeholder="Sem si pište své myšlenky, argumenty nebo koncept podání..."
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-100 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-[11px] text-slate-400 font-medium">
                  Ukládá se automaticky do vašeho prohlížeče.
                </div>
                
                <button
                  onClick={() => {
                    if (!aiNotes.trim()) {
                      alert("Napište nejprve nějaký text, který chcete optimalizovat.");
                      return;
                    }
                    const backup = aiNotes;
                    setAiNotes("🔄 AI analyzuje a přepracovává váš text, prosím vteřinu...");
                    setTimeout(() => {
                      const optimizedText = `### 📝 OPTIMALIZOVANÝ NÁVRH PODÁNÍ (OČIŠTĚNÝ OD EMOCÍ)

**Věc:** Vyjádření k opatrovnickému řízení a úprava péče o nezletilou Elišku

Vážený soude,

tímto podávám své doplňující vyjádření ve věci úpravy péče o nezletilou Elišku. Mým prvořadým cílem je zajištění stability, citového bezpečí a rovnoměrného rozvoje vazby Elišky k oběma rodičům.

**1. Zázemí a připravenost na péči:**
U otce je plně vybudováno stabilní zázemí, včetně dětského pokoje s vlastní postýlkou a odpovídajícími hračkami. Otec má plnou podporu zaměstnavatele umožňující flexibilní home office režim pro zajištění plnohodnotné péče.

**2. Reakce na argumentaci protistrany ohledně věku dítěte:**
Z vědeckého hlediska (viz výzkum dr. Richarda Warshaka z r. 2014) je u dětí od dvou let klíčové zavedení noční péče u obou rodičů, neboť společné večerní a ranní rituály zásadním způsobem upevňují citovou vazbu. Odloučení na více než 3-4 dny je pro dítě v tomto věku nevhodné, proto navrhuji rovnoměrný střídavý režim (např. 2-2-3 dny), který minimalizuje dlouhé odluky.

**3. Návrh konkrétních kroků:**
Navrhuji zavedení přespávání od středy odpoledne (vyzvednutí z jeslí/školky) do pátku ráno. Jsem připraven/a spolupracovat na klidném předávání a sdílení všech informací o zdravotním stavu Elišky.

Tento koncept byl formulován v souladu se zásadami věcné, jasné a nekonfrontační komunikace (metoda BIFF).

---
*Původní koncept byl zálohován. V případě potřeby můžete provést úpravy.*`;
                      setAiNotes(optimizedText);
                    }, 1500);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-slate-900 hover:from-teal-500 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  Optimalizovat přes AI (Metoda BIFF)
                </button>
              </div>
            </div>

            {/* Sidebar Guidelines - 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4 font-sans">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  Pravidla komunikace BIFF
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Při psaní podkladů pro soud, vyjádření pro OSPOD nebo komunikaci s druhým rodičem se vždy držte metody **BIFF**, která u opatrovnických soudců vyvolává nejlepší možný dojem:
                </p>

                <div className="space-y-3 text-[11px] text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <strong className="text-slate-800 block">Brief (Stručný)</strong>
                    <span>Pište krátce a k věci. Dlouhé elaboráty soudce nečte a zvyšují riziko, že zabřednete do emocí.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <strong className="text-slate-800 block">Informative (Informativní)</strong>
                    <span>Uvádějte pouze ověřitelná fakta, data, časy a konkrétní události. Vynechte subjektivní hodnocení charakteru druhého rodiče.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <strong className="text-slate-800 block">Friendly (Klientsky slušný)</strong>
                    <span>Udržujte profesionální a zdvořilý tón. Pište tak, jako byste psali váženému obchodnímu partnerovi.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <strong className="text-slate-800 block">Firm (Pevný)</strong>
                    <span>Stůjte si za svými požadavky jasně a jednoznačně. Vyhněte se prosebnému tónu i zbytečné agresi.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: SAVED CONTENT */}
        {portalTab === 'saved-content' && (
          <motion.div
            key="saved-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
            id="tab-saved-content-container"
          >
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs">
              <span className="text-[10px] bg-teal-50 border border-teal-200 text-teal-700 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                Uložené materiály
              </span>
              <h3 className="text-base font-bold text-slate-800 font-display mt-2">Moje záložky: Judikatura & Odborné studie</h3>
              <p className="text-xs text-slate-500 mt-1">
                Zde najdete rozsudky, nálezy Ústavního soudu a vědecké články, které jste si označili jako oblíbené při čtení portálu.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SAVED JUDGMENTS COLUMN */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-slate-800 font-display flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Scale className="w-5 h-5 text-teal-600" />
                  Uložená Judikatura ({savedJudgments.length})
                </h4>

                {savedJudgments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 italic">
                    Nemáte uložena žádná soudní rozhodnutí. Prozkoumejte záložku "Judikatura" a přidejte si klíčové rozsudky.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedJudgments.map((jud) => (
                      <div key={jud.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono font-bold uppercase text-slate-400">{jud.courtName}</span>
                            <h5 className="font-bold text-slate-800 font-display">{jud.caseNumber}</h5>
                          </div>
                          <button
                            onClick={() => {
                              setSavedJudgments(prev => prev.filter(j => j.id !== jud.id));
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Odebrat ze záložek"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-150">
                          "{jud.summary}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SAVED ARTICLES COLUMN */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-slate-800 font-display flex items-center gap-2 pb-2 border-b border-slate-100">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Oblíbené Odborné Články ({savedArticles.length})
                </h4>

                {savedArticles.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 italic">
                    Zatím nemáte uložené žádné články z naší knihovny nebo studií.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedArticles.map((art) => (
                      <div key={art.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs flex justify-between items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono font-bold bg-purple-50 border border-purple-150 text-purple-700 px-1.5 py-0.5 rounded uppercase">{art.category}</span>
                          <h5 className="font-bold text-slate-800 font-display leading-snug">{art.title}</h5>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSavedArticles(prev => prev.filter(a => a.id !== art.id));
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Odebrat ze záložek"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* FULL-SCREEN PRINT & PDF EXPORT OVERLAY */}
      {showPrintOverlay && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 overflow-y-auto flex items-start justify-center p-4 md:p-8" id="print-overlay-modal">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-4">
            
            {/* Modal Header Controls (Not Printed) */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-800">Export a tisk spisového protokolu</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Vytisknout / Uložit jako PDF
                </button>
                <button
                  onClick={() => setShowPrintOverlay(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Zavřít náhled
                </button>
              </div>
            </div>

            {/* Actual Printed Content (Standard A4 layout) */}
            <div className="p-8 md:p-12 space-y-8 bg-white text-slate-800 text-xs leading-relaxed overflow-y-auto max-h-[80vh] print:max-h-none print:overflow-visible print:p-0">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                <div>
                  <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 font-display">Synthesis OS — Spisový Protokol</h1>
                  <span className="text-[9px] font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full block w-fit mt-1">Alfa Verze 0.0.1.1 (Oficiální Spuštění)</span>
                  <p className="text-[10px] text-slate-400 mt-1">Datum generování: {new Date().toLocaleDateString('cs-CZ')}</p>
                </div>
                <div className="text-right text-[10px] text-slate-400 font-mono">
                  <p>ID Případu: {caseInfo.id}</p>
                  <p>Zabezpečení: Lokální šifrování</p>
                </div>
              </div>

              {/* Section 1: Case Details & Strategy */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-l-4 border-teal-600 pl-2">I. Základní údaje o řízení</h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <div>
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-450 block">Nezletilé Dítě</span>
                    <strong className="text-slate-800 text-[11px]">{caseInfo.childName}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-450 block">Příslušný Soud</span>
                    <strong className="text-slate-800 text-[11px]">{caseInfo.courtName}</strong>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200/60">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-450 block">Aktuální Stav Řízení</span>
                    <strong className="text-teal-700 font-semibold">{caseInfo.status}</strong>
                  </div>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                  <span className="text-[9px] uppercase font-mono font-bold text-slate-450 block mb-1">Strategická linie a poznámky</span>
                  <p className="text-slate-700 whitespace-pre-wrap italic">"{caseInfo.notes}"</p>
                </div>
              </div>

              {/* Section 2: Timeline of Events */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-l-4 border-teal-600 pl-2">II. Časová osa & Mapa případu</h3>
                <div className="space-y-3">
                  {timelineNodes.map((node, index) => (
                    <div key={node.id} className="p-3.5 border border-slate-200 rounded-xl space-y-1.5 bg-white">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-slate-500">#{index + 1} — {new Date(node.date).toLocaleDateString('cs-CZ')}</span>
                        <span className="text-[9px] font-mono font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-700">{node.type}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{node.title}</h4>
                      {node.notes && <p className="text-slate-650 text-[11px] whitespace-pre-wrap bg-slate-50/40 p-2.5 rounded border border-slate-100">{node.notes}</p>}
                      {node.deadlineDate && (
                        <p className="text-[10px] text-rose-700 font-bold font-mono">
                          🚨 Stanovená Lhůta: {new Date(node.deadlineDate).toLocaleDateString('cs-CZ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Readiness Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-l-4 border-teal-600 pl-2">III. Stav připravenosti na soudní řízení</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {checklist.map((item) => (
                    <div key={item.id} className="p-3 border border-slate-200 rounded-xl flex items-start gap-3 bg-white">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 ${item.checked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'}`}>
                        {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5">
                        <strong className="font-bold text-slate-800 block text-xs">{item.label}</strong>
                        <p className="text-[10px] text-slate-450 leading-snug">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Evidence Vault List */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-l-4 border-teal-600 pl-2">IV. Index přiložených důkazů (Trezor důkazů)</h3>
                <div className="space-y-2">
                  {evidenceList.map((ev, index) => (
                    <div key={ev.id} className="p-3 border border-slate-200 bg-white rounded-xl flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 text-xs">Důkaz #{index + 1} — {ev.name}</span>
                        <p className="text-[11px] text-slate-650 leading-relaxed italic bg-slate-50/50 p-2 rounded border border-slate-100">"{ev.notes}"</p>
                        <span className="text-[9px] font-mono text-slate-400 block">Datum pořízení: {new Date(ev.date).toLocaleDateString('cs-CZ')} | Štítky: {ev.tags.join(', ')}</span>
                      </div>
                      <div className="text-right text-[10px] font-mono text-slate-500 shrink-0">
                        {ev.type.toUpperCase()} | {ev.fileSize}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: AI Notes */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-l-4 border-teal-600 pl-2">V. Koncepty & AI Poznámkový blok</h3>
                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 whitespace-pre-wrap font-sans text-slate-700 text-[11px] leading-relaxed">
                  {aiNotes}
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="border-t border-slate-350 pt-5 text-center text-[10px] text-slate-450 space-y-1">
                <p><strong>Synthesis OS — Digitální asistent opatrovnického řízení</strong></p>
                <p>Tento dokument byl vytvořen za účelem osobní přípravy a podkladů pro advokáta. Výstupy z AI neposkytují licencované právní poradenství.</p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
