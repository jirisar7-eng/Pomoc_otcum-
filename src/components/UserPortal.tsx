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
  Bell
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
  childName: 'Eliška (2 roky)',
  status: 'V řízení (před prvním opatrovnickým soudem)',
  courtName: 'Okresní soud v Olomouci',
  notes: 'Hlavním tématem je zavedení přespávání od středy do pátku. Matka argumentuje věkem 2 roky jako nevhodným pro odloučení.',
  createdAt: '2026-02-10T08:00:00.000Z'
};

const DEFAULT_EVIDENCE: EvidenceFile[] = [
  {
    id: 'ev-1',
    name: 'Vyúčtování plateb a poplatků školka.pdf',
    type: 'pdf',
    notes: 'Doklad o mém polovičním spolufinancování zájmových kroužků a soukromých jeslí Elišky.',
    date: '2026-05-14',
    tags: ['Finance', 'Školka'],
    fileSize: '1.2 MB'
  },
  {
    id: 'ev-2',
    name: 'Screenshot SMS - zrušení styku na poslední chvíli.png',
    type: 'screenshot',
    notes: 'Matka píše v pátek v 15:50 (styk měl začít v 16:00), že malá má rýmu a nikam nejede. SMS s mým návrhem, že přijedu za ní s léky, zůstala bez odpovědi.',
    date: '2026-06-05',
    tags: ['Maření styku', 'SMS'],
    fileSize: '450 KB'
  },
  {
    id: 'ev-3',
    name: 'Nahrávka předání Elišky - klidný průběh.mp3',
    type: 'audio',
    notes: 'Audio nahrávka z předání v parku. Dokazuje, že dcera se ke mně radostně rozběhla, objala mě a nebyl přítomen žádný pláč nebo strach, který matka popisuje ve vyjádření.',
    date: '2026-06-12',
    tags: ['Předání dětí', 'Nahrávka'],
    fileSize: '4.8 MB'
  },
  {
    id: 'ev-4',
    name: 'Fotka - Eliška usíná u mě v posteli.jpg',
    type: 'photo',
    notes: 'Fotografie z odpoledního spánku během víkendové péče. Dokazuje, že u mě bez problémů usíná sama bez přítomnosti matky.',
    date: '2026-06-20',
    tags: ['Péče', 'Spánek'],
    fileSize: '2.1 MB'
  }
];

const DEFAULT_TIMELINE: TimelineNode[] = [
  {
    id: 'node-1',
    caseId: 'case-1',
    type: 'proposal',
    title: 'Podání mého návrhu na střídavou péči',
    date: '2026-02-15',
    notes: 'Podán upravený návrh s důrazem na rovnoměrné rozdělení noční péče. Přiloženo čestné prohlášení zaměstnavatele o home office.',
    evidenceIds: ['ev-1']
  },
  {
    id: 'node-2',
    caseId: 'case-1',
    type: 'mother_response',
    title: 'Vyjádření matky k návrhu',
    date: '2026-03-22',
    notes: 'Matka navrhuje výhradní péči a styk s otcem pouze každou druhou sobotu od 9:00 do 15:00 bez přespávání. Tvrdí, že otec nemá mateřské kompetence.',
    evidenceIds: []
  },
  {
    id: 'node-3',
    caseId: 'case-1',
    type: 'ospod',
    title: 'Návštěva sociální pracovnice u mě doma',
    date: '2026-04-10',
    notes: 'Sociální pracovnice zkontrolovala dětský pokoj. Vše v naprostém pořádku (vlastní postýlka, hračky, bezpečnostní prvky). Protokol vyzněl neutrálně.',
    evidenceIds: ['ev-4']
  },
  {
    id: 'node-4',
    caseId: 'case-1',
    type: 'other',
    title: 'Incident - bezdůvodné zmaření víkendového styku',
    date: '2026-06-05',
    notes: 'Matka neodevzdala dítě s výmluvou na lehké nachlazení. Policie ČR věc odmítla na místě sepsat, proveden pouze zápis do mého deníku.',
    evidenceIds: ['ev-2']
  },
  {
    id: 'node-5',
    caseId: 'case-1',
    type: 'court_hearing',
    title: 'První ústní jednání u Okresního soudu',
    date: '2026-07-28',
    notes: 'Soudce nařídil předběžné opatření a doporučil nám absolvovat 3 sezení u mediátora. Odročeno na konec září.',
    evidenceIds: ['ev-3'],
    deadlineDate: '2026-07-28',
    deadlineCompleted: false
  }
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'Lhůta pro vyjádření', content: 'Zbývají 4 dny na odeslání doplňujícího vyjádření k soudu ohledně zprávy OSPOD.', date: 'před 2 hodinami', read: false, type: 'alert' },
  { id: 'notif-2', title: 'Nové rozhodnutí NS ČR', content: 'Do sekce Judikatura byl přidán nový přelomový nález k věkové hranici střídavé péče.', date: 'včera', read: false, type: 'info' },
  { id: 'notif-3', title: 'Soukromá zpráva', content: 'Administrátor ti poslal zprávu ohledně tvého schváleného příspěvku v diskuzi.', date: 'před 2 dny', read: true, type: 'message' }
];

const DEFAULT_MESSAGES: PrivateMessage[] = [
  { id: 'msg-1', senderName: 'Ondřej (Moderátor)', text: 'Ahoj, schválil jsem tvůj příspěvek o přípravě pokoje pro miminko. Je to skvěle napsané a určitě to pomůže dalším tátům v podobné situaci!', date: '14. 7. 2026', read: true },
  { id: 'msg-2', senderName: 'Právník Jan (Poradna)', text: 'Dobrý den, k tomu vašemu bodu ohledně noční péče u 2letého dítěte – rozhodně u soudu zdůrazněte ranní rituál loučení. Je to silný argument.', date: '15. 7. 2026', read: false }
];

export default function UserPortal({ currentUser, onOpenAuth }: UserPortalProps) {
  // Navigation tabs inside portal
  const [portalTab, setPortalTab] = useState<'case-map' | 'evidence' | 'calendar' | 'ai-helper' | 'inbox'>('case-map');

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

  // Timeline UI States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-5');
  const [isEditingNode, setIsEditingNode] = useState<boolean>(false);
  const [isAddingNode, setIsAddingNode] = useState<boolean>(false);

  // Evidence UI States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddingEvidence, setIsAddingEvidence] = useState<boolean>(false);

  // Calendar UI States
  const [calendarMonth, setCalendarMonth] = useState<number>(6); // July (0-indexed)
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [customReminders, setCustomReminders] = useState<{ id: string; title: string; date: string; type: string }[]>([
    { id: 'rem-1', title: 'OSPOD pohovor Eliška', date: '2026-07-22', type: 'ospod' },
    { id: 'rem-2', title: 'Předání Elišky na víkend', date: '2026-07-17', type: 'other' }
  ]);
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

  // Save state on changes
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
    localStorage.setItem('sh_portal_messages', JSON.stringify(messages));
  }, [messages]);

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
      if (q.includes('monotrop') || q.includes('vazb') || q.includes('matk')) {
        responseText = 'Teorie monotropie (že dítě potřebuje k vývoji pouze jedinou stabilní osobu – matku) byla v moderní psychologii opakovaně vyvrácena. Současný konsenzus vědců v čele s prof. Richardem Warshakem (studie z roku 2014, podepsaná 110 světovými odborníky) jednoznačně potvrzuje, že i děti mladší dvou let mají schopnost vybudovat si bezpečnou citovou vazbu (attachment) k oběma rodičům paralelně. Klíčem je dostatečně častý kontakt včetně noční péče, která obnáší ukládání ke spánku, probouzení a krmení. Právě u těchto intimních rituálů dochází k nejsilnějšímu utužování vztahu.';
        relatedDocs = [
          { title: 'Průvodce: Jak vyvrátit monotropii na OSPODu', link: '#ospod' },
          { title: 'Judikát: Nález ÚS k právu obou rodičů na péči', link: '#judikatura' }
        ];
      } else if (q.includes('odvol') || q.includes('lhůt') || q.includes('rozhod')) {
        responseText = 'Lhůta pro podání odvolání proti rozsudku okresního soudu v opatrovnických věcech je standardně 15 dnů od doručení písemného vyhotovení rozsudku (dle občanského soudního řádu). Odvolání se podává u soudu prvního stupně (tedy u toho soudu, který rozsudek vydal), ale adresuje se soudu krajskému. Podání odvolání odkládá právní moc napadených výroků, pokud nebyla nařízena předběžná vykonatelnost. V odvolání musíte uvést, proti kterému rozhodnutí směřuje, v jakém rozsahu ho napadáte a v čem spatřujete pochybení (nesprávné právní posouzení nebo neúplně zjištěný skutkový stav).';
        relatedDocs = [
          { title: 'Vzor: Odvolání proti rozsudku o výživném a péči', link: '#ke-stazeni' },
          { title: 'Soudní řízení: Kompletní harmonogram fází', link: '#soudni-rizeni' }
        ];
      } else if (q.includes('příjm') || q.includes('výživn') || q.includes('peněz')) {
        responseText = 'Při určování výše výživného soud zkoumá odůvodněné potřeby dítěte a schopnosti, možnosti a majetkové poměry obou rodičů. V České republice existují doporučující tabulky Ministerstva spravedlnosti ČR, které rozdělují výživné na procentuální podíly z čistého příjmu rodiče podle věku dítěte. U dětí do 5 let se doporučené rozmezí pohybuje mezi 11 % až 15 % čistého příjmu rodiče. Soud však přihlíží i k tomu, jak moc se rodič na péči o dítě podílí osobně – u střídavé péče se výživné určuje oběma rodičům navzájem a kompenzuje se pouze rozdíl v jejich příjmech a mírách osobní péče.';
        relatedDocs = [
          { title: 'Sekce: Výživné a kalkulačka procentuálních podílů', link: '#vyzivne' },
          { title: 'Vzory: Smlouva o vypořádání vzájemných závazků', link: '#ke-stazeni' }
        ];
      } else {
        responseText = 'Děkuji za dotaz. Pro efektivní vyřešení tohoto tématu ti doporučuji navštívit naši specializovanou sekci "Judikatura" nebo "Ke stažení", kde najdeš konkrétní paragrafy, nebo využít naši interaktivní knihovnu promptů v záložce "AI Průvodce", která ti pomůže formulovat dopis pro soud či OSPOD přesně na míru tvému případu. Nezapomeň, že klíčem v komunikaci s úřady je ledový klid, faktická přesnost a zaměření výhradně na zájem tvého dítěte.';
        relatedDocs = [
          { title: 'Hlavní stránka Synthesis OS', link: '#home' },
          { title: 'Knihovna vzorových podání', link: '#ke-stazeni' }
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
            <h2 className="text-lg font-bold text-slate-800 tracking-tight font-display">
              {currentUser.name}
            </h2>
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
            Kalendář
          </button>
          <button
            onClick={() => setPortalTab('ai-helper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              portalTab === 'ai-helper' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            AI Pomocník
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
                    <h3 className="text-base font-bold text-slate-800 font-display">Eliška (2 roky) — Hlavní spor</h3>
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

      </AnimatePresence>

    </div>
  );
}
