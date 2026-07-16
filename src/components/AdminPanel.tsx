/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, FileText, Plus, Trash2, Check, X, Edit3, MessageSquare, 
  AlertTriangle, Eye, Send, PlusCircle, HelpCircle, CheckCircle, 
  Database, Copy, RefreshCw, Play, Sparkles, LayoutDashboard,
  Scale, Folder, Briefcase, Camera, Video, Mic, MessageCircle,
  UserCheck, Users, Calendar, Cpu, BarChart2, Paintbrush, Search,
  Sliders, Settings, Activity, FileCode, Share2, Download, ArrowUp, ArrowDown
} from 'lucide-react';
import { Article, ExperienceStory, ForumPost, Comment, User, Donation } from '../types';
import { getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured } from '../lib/supabase';

interface AdminPanelProps {
  currentUser: User | null;
  articles: Article[];
  stories: ExperienceStory[];
  posts: ForumPost[];
  comments: Comment[];
  donations: Donation[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  setStories: React.Dispatch<React.SetStateAction<ExperienceStory[]>>;
  setPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setDonations: React.Dispatch<React.SetStateAction<Donation[]>>;
}

export default function AdminPanel({
  currentUser,
  articles,
  stories,
  posts,
  comments,
  donations = [],
  setArticles,
  setStories,
  setPosts,
  setComments,
  setDonations
}: AdminPanelProps) {
  // Navigation
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');

  // Supabase states
  const [supUrl] = useState(getSupabaseUrl());
  const [supKey] = useState(getSupabaseAnonKey());
  const [isSupabaseActive] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('synthesis_hub_use_supabase') === 'true' : false;
  });

  // RBAC Permission Grid State
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    SuperAdmin: ['obsah', 'judikatura', 'dokumenty', 'pripady', 'dukazy', 'forum', 'komentare', 'ai', 'role', 'vzhled', 'simulace', 'audit'],
    Admin: ['obsah', 'judikatura', 'dokumenty', 'pripady', 'dukazy', 'forum', 'komentare', 'ai', 'vzhled', 'simulace', 'audit'],
    Editor: ['obsah', 'dokumenty', 'ai'],
    PravniPoradce: ['judikatura', 'dokumenty', 'pripady'],
    Psycholog: ['dokumenty', 'forum'],
    Moderator: ['forum', 'komentare'],
    OvenyUzivatel: ['forum'],
    Registrovaný: [],
    Zablokovaný: []
  });

  // Dashboard Movable Widgets State
  const [dashboardWidgets, setDashboardWidgets] = useState([
    { id: 'traffic', title: 'Dnešní návštěvnost', value: '1 248 uživatelů', change: '+14% oproti včerejšku', color: 'from-teal-500 to-emerald-600', icon: Eye },
    { id: 'new_users', title: 'Noví registrovaní', value: '24 otců dnes', change: '+8% tento týden', color: 'from-indigo-500 to-indigo-600', icon: Users },
    { id: 'pending_articles', title: 'Čekající články', value: '3 k právní kontrole', change: 'Redakční fronta aktivní', color: 'from-amber-500 to-orange-600', icon: FileText },
    { id: 'pending_comments', title: 'Čekající komentáře', value: '4 k moderaci', change: 'AI ochrana běží', color: 'from-rose-500 to-red-600', icon: MessageSquare },
    { id: 'new_docs', title: 'Nové vzory podání', value: '12 stažení dnes', change: 'Celkem 180 vzorů', color: 'from-purple-500 to-purple-600', icon: Folder },
    { id: 'cases', title: 'Případy v databázi', value: '8 podrobných studií', change: 'Anonymizováno', color: 'from-sky-500 to-blue-600', icon: Briefcase },
    { id: 'server', title: 'Stav Synthesis OS', value: '99.98% Online', change: 'Docker container v3000', color: 'from-emerald-600 to-teal-600', icon: Activity }
  ]);

  // Content block presets for the article editor
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>(['infobox', 'legal_warning']);
  const [articleEditorState, setArticleEditorState] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Aktuality' as any,
    author: 'Jiří (Synthesis OS)',
    editor: 'Ondřej (Právní kontrola)',
    scheduledDate: '',
    tags: 'střídavá péče, soud',
    seoTitle: '',
    seoDesc: '',
    relatedVerdict: 'II. ÚS 132/24',
    relatedDoc: 'Návrh na předběžné opatření'
  });

  // Kanban Board columns for Editorial Queue
  const [contentQueue, setContentQueue] = useState([
    { id: 'c1', title: 'Zákon o rodině: Revize 2026', author: 'Ondřej', phase: 'legal', desc: 'Čeká na posouzení právního poradce.' },
    { id: 'c2', title: 'Jak vyvrátit monotropii u soudu', author: 'Jiří', phase: 'proof', desc: 'Jazyková korektura hotova, doplňují se citace.' },
    { id: 'c3', title: 'Příručka pro jednání s OSPOD', author: 'Marie', phase: 'draft', desc: 'První hrubý koncept osy rozhovoru.' },
    { id: 'c4', title: 'Vzor odvolání proti výživnému', author: 'Ondřej', phase: 'approved', desc: 'Schváleno supervizorem, naplánováno publikování.' }
  ]);

  // Judikatura rulings state
  const [rulings, setRulings] = useState([
    { id: 'j1', court: 'Ústavní soud', sign: 'II. ÚS 132/24', date: '2024-03-12', topic: 'Sourozenecká vazba', phrase: 'Právo sourozenců vyrůstat společně a sdílet život je jedním z klíčových kritérií zájmu dítěte.', summary: 'Zrušení rozhodnutí, kterým došlo k nepřiměřenému rozdělení sourozenců do různých modelů péče bez vážných důvodů.' },
    { id: 'j2', court: 'Nejvyšší soud', sign: '21 Cdo 480/2025', date: '2025-01-18', topic: 'Stanovení střídavé péče', phrase: 'Svěření do střídavé péče nemůže být vyloučeno pouze na základě nesouhlasu jednoho z rodičů.', summary: 'Pokud jsou oba rodiče způsobilí, je nesouhlas matky bez objektivních překážek irelevantní.' }
  ]);
  const [newRuling, setNewRuling] = useState({ court: 'Ústavní soud', sign: '', date: '', topic: '', phrase: '', summary: '' });

  // Document database templates state
  const [docTemplates, setDocTemplates] = useState([
    { id: 'd1', title: 'Návrh na střídavou péči a sourozeneckou soudržnost', type: 'Návrh k soudu', court: 'Okresní soud', date: '2026-02-15', version: 'v2.1', size: '240 KB' },
    { id: 'd2', title: 'Odvolání proti určení výživného (Asymetrický model)', type: 'Odvolání', court: 'Krajský soud', date: '2026-05-10', version: 'v1.4', size: '185 KB' },
    { id: 'd3', title: 'Návrh na předběžné opatření (Omezení kontaktu)', type: 'Předběžné opatření', court: 'Okresní soud', date: '2026-06-01', version: 'v3.0', size: '310 KB' }
  ]);
  const [newDoc, setNewDoc] = useState({ title: '', type: 'Návrh k soudu', court: 'Okresní soud', date: '', version: 'v1.0' });

  // Case Center State
  const [cases, setCases] = useState([
    {
      id: 'case-104',
      title: 'Případ #104: Boj o zachování vazby (Jiříka a Štěpána)',
      status: 'Probíhající řízení',
      result: 'V jednání',
      chronology: [
        { date: '10. 1. 2026', title: 'Podání návrhu k soudu v Brně', desc: 'Zahájení opatrovnického řízení o svěření Jiříka a Štěpána do péče.' },
        { date: '25. 2. 2026', title: 'Zpráva opatrovníka OSPOD', desc: 'Doporučení střídavé péče pouze pro staršího Jiříka, nesouhlas s mladším.' },
        { date: '15. 4. 2026', title: 'Doplnění důkazního břemene', desc: 'Předložení matematické analýzy sourozeneckého kontaktu.' }
      ],
      evidenceCount: 5,
      anonymizedPublished: false
    }
  ]);
  const [activeCaseId, setActiveCaseId] = useState<string>('case-104');
  const [newChronologyTitle, setNewChronologyTitle] = useState('');
  const [newChronologyDesc, setNewChronologyDesc] = useState('');

  // Evidence Manager State (Google Drive lookalike)
  const [evidenceFolder, setEvidenceFolder] = useState<string>('all');
  const [evidences, setEvidences] = useState([
    { id: 'ev-1', name: 'Jiřík_Štěpán_objímání.jpg', type: 'fotografie', date: '2026-05-14', author: 'Otec', place: 'Dětský pokoj Brno', tags: 'sourozenci, pouto', size: '2.4 MB' },
    { id: 'ev-2', name: 'Záznam_předání_nádraží.mp3', type: 'audio', date: '2026-06-01', author: 'Otec', place: 'Přestupní uzel Vyškov', tags: 'předání, emoce', size: '8.1 MB' },
    { id: 'ev-3', name: 'Vyhrožování_SMS_matka.png', type: 'screenshoty', date: '2026-06-12', author: 'Matka', place: 'Mobilní chat', tags: 'komunikace, konflikt', size: '850 KB' },
    { id: 'ev-4', name: 'Posudek_psycholog_sourozenci.pdf', type: 'PDF', date: '2026-04-20', author: 'PhDr. Černý', place: 'Ordinace Brno', tags: 'posudek, soudržnost', size: '1.2 MB' }
  ]);
  const [newEvidenceName, setNewEvidenceName] = useState('');
  const [newEvidenceType, setNewEvidenceType] = useState('fotografie');

  // Comment Moderation & AI Detection State
  const [aiScanningId, setAiScanningId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<Record<string, { safe: boolean; reason: string; vulgarity: number }>>({});

  // AI Center State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Care Simulator Settings
  const [simConfig, setSimConfig] = useState({
    siblingWeight: 85,
    maxTravelHours: 15,
    colorFather: '#10b981',
    colorMother: '#f59e0b',
    activeAlg: 'cohesion-v2'
  });

  // Appearance Options
  const [appearance, setAppearance] = useState({
    logoText: 'Synthesis Hub',
    themeColor: '#4f46e5',
    font: 'sans',
    headerStyle: 'standard',
    darkModeDefault: false
  });

  // System Audits Logs State
  const [auditLogs, setAuditLogs] = useState([
    { date: '16. 7. 2026, 06:12', user: 'admin@synthesis.cz', ip: '192.168.1.104', category: 'Zveřejnění článku', desc: 'Publikován nový článek "Jak správně vyvrátit monotropii" s přiložením studií.', browser: 'Chrome / Linux', hash: 'sha256:d8b2e1' },
    { date: '15. 7. 2026, 18:30', user: 'Ondřej (Právní poradce)', ip: '192.168.1.112', category: 'Schválení vzoru', desc: 'Upraven a schválen vzor podání pro střídavou péči s důrazem na soudržnost.', browser: 'Safari / macOS', hash: 'sha256:0a39fb' },
    { date: '15. 7. 2026, 11:22', user: 'AI Admin System', ip: 'localhost', category: 'Automatický audit', desc: 'Záloha lokálního úložiště šifrovaného obsahu a kontrola odkazů.', browser: 'Node / Docker', hash: 'sha256:9f4001' }
  ]);

  const [backups, setBackups] = useState([
    { id: 'b-1', date: '16. 7. 2026, 04:00', size: '14.2 MB', creator: 'Automatický Cron' },
    { id: 'b-2', date: '15. 7. 2026, 04:00', size: '14.1 MB', creator: 'Automatický Cron' }
  ]);
  const [backupRunning, setBackupRunning] = useState(false);

  // --- ACTIONS ---

  // Move widgets on Dashboard
  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const updated = [...dashboardWidgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < updated.length) {
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      setDashboardWidgets(updated);
    }
  };

  // Content queue drag simulation
  const advanceQueue = (id: string, nextPhase: string) => {
    setContentQueue(prev => prev.map(item => item.id === id ? { ...item, phase: nextPhase } : item));
  };

  // Article Actions
  const handleSaveArticleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleEditorState.title.trim() || !articleEditorState.content.trim()) {
      alert('Vyplňte prosím název a obsah článku.');
      return;
    }
    const newArt: Article = {
      id: 'art-' + Math.random().toString(36).substr(2, 5),
      title: articleEditorState.title,
      summary: articleEditorState.summary,
      content: articleEditorState.content,
      category: articleEditorState.category,
      date: new Date().toISOString().split('T')[0],
      author: articleEditorState.author,
      likes: 0,
      commentsCount: 0,
      readTime: '5 min',
      tags: articleEditorState.tags.split(',').map(t => t.trim())
    };
    setArticles(prev => [newArt, ...prev]);
    // Log audit
    setAuditLogs(prev => [
      {
        date: new Date().toLocaleString('cs-CZ'),
        user: currentUser?.email || 'admin@synthesis.cz',
        ip: '192.168.1.104',
        category: 'Nový článek',
        desc: `Vytvořen článek: "${newArt.title}" v kategorii ${newArt.category}.`,
        browser: 'Edge / Windows',
        hash: 'sha256:' + Math.random().toString(36).substr(2, 6)
      },
      ...prev
    ]);
    alert('Článek byl úspěšně zařazen do systému a publikován!');
    setArticleEditorState({
      title: '', summary: '', content: '', category: 'Aktuality', author: 'Jiří (Synthesis OS)',
      editor: 'Ondřej', scheduledDate: '', tags: 'střídavá péče', seoTitle: '', seoDesc: '',
      relatedVerdict: 'II. ÚS 132/24', relatedDoc: 'Návrh'
    });
  };

  // Add Judikatura ruling
  const handleAddRuling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuling.sign || !newRuling.topic || !newRuling.phrase) {
      alert('Doplňte povinné údaje rozsudku.');
      return;
    }
    setRulings(prev => [
      {
        id: 'j-' + Date.now(),
        court: newRuling.court,
        sign: newRuling.sign,
        date: newRuling.date || new Date().toISOString().split('T')[0],
        topic: newRuling.topic,
        phrase: newRuling.phrase,
        summary: newRuling.summary || 'Stručný komentář editora k právní větě.'
      },
      ...prev
    ]);
    setNewRuling({ court: 'Ústavní soud', sign: '', date: '', topic: '', phrase: '', summary: '' });
    alert('Judikát byl zaevidován a automaticky propojen se souvisejícími články.');
  };

  // Add Document template
  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;
    setDocTemplates(prev => [
      {
        id: 'd-' + Date.now(),
        title: newDoc.title,
        type: newDoc.type,
        court: newDoc.court,
        date: newDoc.date || new Date().toISOString().split('T')[0],
        version: newDoc.version,
        size: '150 KB'
      },
      ...prev
    ]);
    setNewDoc({ title: '', type: 'Návrh k soudu', court: 'Okresní soud', date: '', version: 'v1.0' });
    alert('Nový vzor podání byl vložen do databáze šablon.');
  };

  // Add Chronology step to Case
  const handleAddChronology = () => {
    if (!newChronologyTitle.trim()) return;
    setCases(prev => prev.map(c => {
      if (c.id === activeCaseId) {
        return {
          ...c,
          chronology: [
            ...c.chronology,
            { date: new Date().toLocaleDateString('cs-CZ'), title: newChronologyTitle, desc: newChronologyDesc }
          ]
        };
      }
      return c;
    }));
    setNewChronologyTitle('');
    setNewChronologyDesc('');
  };

  // Publish Case Study Anonymized
  const toggleAnonymizedPublish = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, anonymizedPublished: !c.anonymizedPublished } : c));
    alert('Změna stavu publikování: Případová studie byla exportována jako anonymizovaný studijní materiál.');
  };

  // Add Evidence
  const handleAddEvidence = () => {
    if (!newEvidenceName.trim()) return;
    setEvidences(prev => [
      {
        id: 'ev-' + Date.now(),
        name: newEvidenceName + (newEvidenceType === 'fotografie' ? '.jpg' : newEvidenceType === 'audio' ? '.mp3' : newEvidenceType === 'PDF' ? '.pdf' : '.png'),
        type: newEvidenceType,
        date: new Date().toISOString().split('T')[0],
        author: 'Jiří (Otec)',
        place: 'Osobní archiv',
        tags: 'import, důkaz',
        size: '1.5 MB'
      },
      ...prev
    ]);
    setNewEvidenceName('');
    alert('Důkazní soubor byl nahrazen v šifrovaném trezoru Synthesis OS.');
  };

  // AI Comment analysis scanner
  const handleAiScan = (commentId: string, text: string) => {
    setAiScanningId(commentId);
    setTimeout(() => {
      const lower = text.toLowerCase();
      let vulgarity = 0;
      let reason = 'Komentář vyhovuje etickým pravidlům komunity (Bezpečná komunikace).';
      let safe = true;

      if (lower.includes('píča') || lower.includes('debil') || lower.includes('kokot') || lower.includes('svině')) {
        vulgarity = 95;
        reason = 'Detekovány hrubé vulgarismy a slovní útoky na rodinu.';
        safe = false;
      } else if (lower.includes('kurva') || lower.includes('zmrd')) {
        vulgarity = 88;
        reason = 'Silné urážky a napadení spolurodiče.';
        safe = false;
      } else if (lower.includes('http') || lower.includes('.cz') || lower.includes('casino') || lower.includes('koupit')) {
        vulgarity = 15;
        reason = 'Komerční spam / nepovolená inzerce.';
        safe = false;
      } else if (lower.includes('rodné číslo') || lower.includes('bydlí na ulici') || lower.includes('telefon:')) {
        vulgarity = 5;
        reason = 'Zveřejnění citlivých osobních údajů dětí nebo matky!';
        safe = false;
      }

      setScanResult(prev => ({
        ...prev,
        [commentId]: { safe, reason, vulgarity }
      }));
      setAiScanningId(null);
    }, 900);
  };

  // Run AI center generation prompt
  const handleAiGenerate = (mode: string) => {
    if (!aiPrompt.trim()) {
      alert('Zadejte zadání pro AI asistenta.');
      return;
    }
    setAiGenerating(true);
    setTimeout(() => {
      let output = '';
      if (mode === 'article') {
        output = `=== GENEROVANÝ ČLÁNEK: ${aiPrompt} ===\n\nKategorie: Psychologie & Právo\nDatum: ${new Date().toLocaleDateString('cs-CZ')}\n\nÚvod:\nStřídavá péče po rozvodu rodičů je v českém opatrovnickém právu standardem. Judikatura Ústavního soudu ČR opakovaně potvrzuje, že pokud jsou oba rodiče výchovně způsobilí, je střídavá péče optimálním uspořádáním.\n\nKlíčové argumenty:\n1. Zachování přirozených rodinných vazeb s oběma rodiči.\n2. Sourozenecká soudržnost: Právo bratrů a sester vyrůstat společně.\n3. Minimalizace loajalitního konfliktu.\n\nZávěr:\nTento návrh plně reflektuje zájem dětí na harmonickém rozvoji.`;
      } else if (mode === 'summary') {
        output = `=== EXPERTNÍ SHRNUTÍ ROZSUDKU ===\n\nSpisová značka: ${aiPrompt}\n\nRozhodnutí se zabývá právem nezletilých dětí na střídavou péči s důrazem na to, že konflikt mezi rodiči nemůže být automatickou překážkou střídavého modelu. Soud zdůraznil, že opatrovník (OSPOD) musí posuzovat individuální citové vazby sourozenců a nesmí je uměle rozdělovat bez závažného odůvodnění.`;
      } else if (mode === 'anonymize') {
        // Simple regex anonymization
        let temp = aiPrompt;
        temp = temp.replace(/Jiří Novák/g, '[ANONYMIZOVÁNO - OTEC]');
        temp = temp.replace(/Kateřina Nováková/g, '[ANONYMIZOVÁNO - MATKA]');
        temp = temp.replace(/Jiřík/g, '[ANONYMIZOVÁNO - DÍTĚ 1]');
        temp = temp.replace(/Štěpán/g, '[ANONYMIZOVÁNO - DÍTĚ 2]');
        output = `=== ANONYMIZOVANÝ DOKUMENT ===\n\n${temp}`;
      } else {
        output = `=== FAQ SESTAVA ===\n\nOtázka: Jaké jsou podmínky pro střídavou péči?\nOdpověď: Hlavními předpoklady jsou pedagogická způsobilost obou rodičů, zájem o péči a možnost logistické realizace.\n\nOtázka: Lze střídat i velmi malé děti?\nOdpověď: Ano, s využitím kratších pečovatelských cyklů (např. 2-2-3 dny), což doporučuje dětská psychologie.`;
      }
      setAiOutput(output);
      setAiGenerating(false);
    }, 1500);
  };

  // Run mock system backup
  const runBackup = () => {
    setBackupRunning(true);
    setTimeout(() => {
      setBackups(prev => [
        {
          id: 'b-' + Date.now(),
          date: new Date().toLocaleString('cs-CZ'),
          size: '14.5 MB',
          creator: 'Ruční záloha (Admin)'
        },
        ...prev
      ]);
      setBackupRunning(false);
      alert('Kompletní záloha Synthesis OS (databáze + šablony + konfigurace) proběhla úspěšně.');
    }, 1200);
  };

  // Restore revision mock
  const restoreRevision = (logDesc: string) => {
    if (confirm(`Opravdu chcete obnovit systém do stavu před akcí:\n"${logDesc}"?\n\nTato operace vrátí veškeré textové verze a rozvrhy o krok zpět.`)) {
      alert('✓ Systémová revize byla úspěšně obnovena z auditní stopy.');
    }
  };

  // Checks RBAC authorization
  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl text-center max-w-xl mx-auto space-y-4 my-8" id="admin-unauthorized-card">
        <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto animate-bounce" />
        <h3 className="text-lg font-bold text-slate-800 font-display">Přístup odepřen (RBAC Ochrana)</h3>
        <p className="text-rose-700 text-xs leading-relaxed">
          Nemáte dostatečná oprávnění ke správě jádra **Synthesis OS**. Tato vysoce zabezpečená administrace je chráněna rolí **SuperAdmin**. Pro testování se prosím přihlaste přes přihlašovací menu a vyberte předpřipravený administrátorský profil.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" id="synthesis-os-admin-root">
      
      {/* Top Brand Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-mono text-teal-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Synthesis OS Core v1.4.2</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display text-white">
              Administrace Synthesis Hub
            </h1>
            <p className="text-slate-400 text-xs max-w-2xl">
              Autonomní a redakční řídicí centrum portálu. Spravujte kompletní životní cyklus článků, judikatury, důkazů a případových studií pod jedním rozhraním chráněným šifrováním.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-mono">STAV SERVERU</span>
              <strong className="text-xs text-white block">API-First Aktivní</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Frame - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR NAVIGATION - 3 Columns */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-4 shadow-3xs space-y-4">
          <div className="px-3 py-2 border-b border-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sekce administrační konzole</span>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'editorial', label: 'Obsah & Redakční fronta', icon: FileText, badge: 'FRONT' },
              { id: 'judikatura', label: 'Judikatura & Rozhodnutí', icon: Scale },
              { id: 'documents', label: 'Dokumenty & Vzory', icon: FileCode },
              { id: 'cases', label: 'Případové centrum', icon: Briefcase, highlight: true },
              { id: 'evidence', label: 'Správce důkazů (Drive)', icon: Camera },
              { id: 'community', label: 'Komunita & AI Moderace', icon: MessageCircle, badge: 'AI' },
              { id: 'aicentre', label: 'AI Generátor & Nástroje', icon: Cpu },
              { id: 'users', label: 'Správa uživatelů & RBAC', icon: Users },
              { id: 'simulator', label: 'Nastavení simulátoru', icon: Sliders },
              { id: 'appearance', label: 'Vzhled & Šablony', icon: Paintbrush },
              { id: 'stats', label: 'Návštěvnost & Statistiky', icon: BarChart2 },
              { id: 'audit', label: 'Systémový audit & Zálohy', icon: Activity }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeMenu === item.id 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${activeMenu === item.id ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded-md font-extrabold ${activeMenu === item.id ? 'bg-teal-500 text-slate-950' : 'bg-slate-100 text-slate-500'}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick info footer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-400 font-mono">
            <span>Uživatel: {currentUser?.email}</span>
            <span className="block mt-1 text-slate-500">Oprávnění: SuperAdmin (Full)</span>
          </div>
        </div>

        {/* CONTENT AREA - 9 Columns */}
        <div className="lg:col-span-9 space-y-6">

          {/* TAB 1: DASHBOARD */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                  Hlavní přehled (Dashboard)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uspořádejte si widgety přetažením nahoru/dolů podle priorit. Změny se ukládají do Synthesis OS.
                </p>
              </div>

              {/* Movable Widgets List */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {dashboardWidgets.map((w, idx) => {
                  const Icon = w.icon;
                  return (
                    <div 
                      key={w.id} 
                      className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-5 relative overflow-hidden group hover:border-slate-200 transition-all"
                    >
                      {/* Drag Simulator Buttons */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => moveWidget(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-sm cursor-pointer disabled:opacity-20"
                          title="Posunout nahoru"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => moveWidget(idx, 'down')}
                          disabled={idx === dashboardWidgets.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-sm cursor-pointer disabled:opacity-20"
                          title="Posunout dolů"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100`}>
                          <Icon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">{w.title}</span>
                          <strong className="text-base font-extrabold text-slate-800 font-display block mt-0.5">{w.value}</strong>
                          <span className="text-[10px] text-slate-500 font-medium block mt-1">{w.change}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Latest events / Changes */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Poslední provedené změny v systému
                </h3>
                <div className="divide-y divide-slate-100">
                  {auditLogs.slice(0, 3).map((log, i) => (
                    <div key={i} className="py-3 flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <strong className="text-slate-800 font-semibold block">{log.desc}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">Původce: {log.user} | IP: {log.ip}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDITORIAL & CONTENT QUEUE */}
          {activeMenu === 'editorial' && (
            <div className="space-y-6">
              
              {/* Redakční fronta Kanban */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Životní cyklus obsahu: Redakční fronta
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Sledujte cestu článků a příruček od hrubého konceptu až po schválení právníkem a publikování.
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 font-mono px-2 py-0.5 rounded-md">
                    Kanban Model
                  </span>
                </div>

                {/* Kanban columns representation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  {[
                    { id: 'draft', label: '📝 Návrh / Koncept', color: 'border-slate-800 bg-slate-950/40 text-slate-300' },
                    { id: 'legal', label: '🔍 Právní kontrola', color: 'border-indigo-900 bg-indigo-950/20 text-indigo-200' },
                    { id: 'proof', label: '✏️ Jazyková korektura', color: 'border-amber-900 bg-amber-950/10 text-amber-200' },
                    { id: 'approved', label: '👤 Schváleno / Plánováno', color: 'border-emerald-900 bg-emerald-950/20 text-emerald-200' }
                  ].map((col) => (
                    <div key={col.id} className={`p-3 rounded-xl border ${col.color} space-y-2 min-h-24`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider block">{col.label}</span>
                      
                      <div className="space-y-2">
                        {contentQueue.filter(item => item.phase === col.id).map(item => (
                          <div key={item.id} className="p-2.5 bg-slate-800 rounded-lg border border-slate-700/50 space-y-1.5">
                            <strong className="text-[11px] font-bold block text-white">{item.title}</strong>
                            <p className="text-[9px] text-slate-300 leading-tight">{item.desc}</p>
                            
                            <div className="flex justify-between items-center pt-1 border-t border-slate-700/40">
                              <span className="text-[8px] font-mono text-slate-400">Autor: {item.author}</span>
                              
                              {col.id !== 'approved' && (
                                <button
                                  onClick={() => {
                                    const nextMap: Record<string, string> = { draft: 'legal', legal: 'proof', proof: 'approved' };
                                    advanceQueue(item.id, nextMap[col.id]);
                                  }}
                                  className="text-[9px] font-bold text-teal-400 hover:underline cursor-pointer flex items-center gap-0.5"
                                >
                                  Posunout →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Block Editor and list */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-6">
                <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-slate-500" />
                    Nový odborný článek s bohatými bloky
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">WordPress-like Comfort</span>
                </div>

                <form onSubmit={handleSaveArticleForm} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600">Název článku *</label>
                      <input
                        type="text"
                        value={articleEditorState.title}
                        onChange={(e) => setArticleEditorState({ ...articleEditorState, title: e.target.value })}
                        placeholder="např. Jak vyvrátit psychologický posudek"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600">Rubrika (Kategorie)</label>
                      <select
                        value={articleEditorState.category}
                        onChange={(e) => setArticleEditorState({ ...articleEditorState, category: e.target.value as any })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                      >
                        <option value="Zákony">Zákony & Legislativa</option>
                        <option value="Soudy">Soudní praxe</option>
                        <option value="Psychologie">Dětská psychologie</option>
                        <option value="Aktuality">Aktuality & Příběhy</option>
                      </select>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">Stručný perex (představení)</label>
                    <textarea
                      value={articleEditorState.summary}
                      onChange={(e) => setArticleEditorState({ ...articleEditorState, summary: e.target.value })}
                      placeholder="Krátké shrnutí článku viditelné v kartách..."
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl h-14"
                    />
                  </div>

                  {/* WYSIWYG Content Editor Blocks Simulator */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-semibold text-slate-700">Obsah článku (s textovým editorem) *</label>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { id: 'gallery', label: '📷 Galerie' },
                          { id: 'pdf', label: '📄 PDF příloha' },
                          { id: 'quote', label: '💬 Citace' },
                          { id: 'infobox', label: 'ℹ️ Infobox' },
                          { id: 'faq', label: '❓ FAQ' },
                          { id: 'timeline', label: '📅 Osa' },
                          { id: 'legal_warning', label: '⚠️ Právní varování' }
                        ].map(b => (
                          <button
                            type="button"
                            key={b.id}
                            onClick={() => {
                              setSelectedBlocks(prev => 
                                prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id]
                              );
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-lg border cursor-pointer transition-all ${
                              selectedBlocks.includes(b.id) 
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold' 
                                : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={articleEditorState.content}
                      onChange={(e) => setArticleEditorState({ ...articleEditorState, content: e.target.value })}
                      placeholder="Zde napište hlavní textový obsah..."
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl h-44 focus:bg-white focus:border-indigo-500 focus:outline-hidden font-mono"
                    />

                    {/* Render Selected Blocks Visual Previews */}
                    {selectedBlocks.length > 0 && (
                      <div className="p-4 border border-dashed border-indigo-100 bg-indigo-50/10 rounded-2xl space-y-3">
                        <span className="text-[10px] font-mono text-indigo-600 block uppercase font-bold">Aktivní šablony bloků v článku:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {selectedBlocks.includes('gallery') && (
                            <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center gap-2">
                              <span className="text-lg">🖼️</span>
                              <div>
                                <strong className="font-semibold text-slate-800 block">Fotogalerie kazuistik</strong>
                                <span className="text-[9px] text-slate-400">Připojeno 4 fotografií spokojených dětí.</span>
                              </div>
                            </div>
                          )}
                          {selectedBlocks.includes('pdf') && (
                            <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center gap-2">
                              <span className="text-lg">📎</span>
                              <div>
                                <strong className="font-semibold text-slate-800 block">PDF soubor ke stažení</strong>
                                <span className="text-[9px] text-slate-400">Pravní_studie_monotropie.pdf</span>
                              </div>
                            </div>
                          )}
                          {selectedBlocks.includes('legal_warning') && (
                            <div className="p-3 bg-amber-50 border border-amber-100 text-amber-900 rounded-xl flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                              <div>
                                <strong className="font-semibold block text-[11px]">Právní disclaimer</strong>
                                <span className="text-[9px] text-amber-700 leading-tight block">Tento text nenahrazuje profesionální právní zastoupení advokátem.</span>
                              </div>
                            </div>
                          )}
                          {selectedBlocks.includes('infobox') && (
                            <div className="p-3 bg-teal-50 border border-teal-100 text-teal-900 rounded-xl flex items-start gap-2">
                              <HelpCircle className="w-4 h-4 text-teal-600 mt-0.5" />
                              <div>
                                <strong className="font-semibold block text-[11px]">Důležité upozornění</strong>
                                <span className="text-[9px] text-teal-700 leading-tight block">Soudy v 80% případů zohledňují posudky OSPOD, dbejte na komunikaci s nimi!</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metadata Mapping (Jurisprudence and Documents integration) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Propojená judikatura</label>
                      <input
                        type="text"
                        value={articleEditorState.relatedVerdict}
                        onChange={(e) => setArticleEditorState({ ...articleEditorState, relatedVerdict: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Propojený vzor podání</label>
                      <input
                        type="text"
                        value={articleEditorState.relatedDoc}
                        onChange={(e) => setArticleEditorState({ ...articleEditorState, relatedDoc: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Plánované publikování</label>
                      <input
                        type="date"
                        value={articleEditorState.scheduledDate}
                        onChange={(e) => setArticleEditorState({ ...articleEditorState, scheduledDate: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-slate-950/20"
                    >
                      <Plus className="w-4 h-4 text-teal-400" />
                      Schválit a publikovat článek
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: JUDIKATURA */}
          {activeMenu === 'judikatura' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-500" />
                  Rozhodnutí opatrovnických soudů (Judikatura)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evidujte a analyzujte přelomové rozsudky Ústavního, Nejvyššího a dalších soudů pro účely odvolání.
                </p>
              </div>

              {/* Rulings database list */}
              <div className="space-y-4">
                {rulings.map((r) => (
                  <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 relative hover:border-slate-200 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded">
                            {r.court}
                          </span>
                          <span className="text-xs font-mono font-extrabold text-slate-800">
                            spis. zn. {r.sign}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 font-display pt-1">{r.topic}</h3>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Rozsudek: {r.date}</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 border-l-2 border-indigo-500 text-xs text-slate-700 font-medium italic leading-relaxed">
                      💬 "{r.phrase}"
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      <strong className="text-slate-700 block mb-0.5 font-semibold">Shrnutí editora:</strong>
                      {r.summary}
                    </p>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-50 text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                        Propojeno s článkem: <strong>Jak vyhrát opatrovnický soud</strong>
                      </span>
                      
                      <button
                        onClick={() => setRulings(prev => prev.filter(x => x.id !== r.id))}
                        className="text-rose-600 hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        Odebrat judikát
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form to insert new ruling */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Zaevidovat nové soudní rozhodnutí</h3>
                
                <form onSubmit={handleAddRuling} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Soud</label>
                      <select
                        value={newRuling.court}
                        onChange={(e) => setNewRuling({ ...newRuling, court: e.target.value })}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl mt-1"
                      >
                        <option value="Ústavní soud">Ústavní soud ČR</option>
                        <option value="Nejvyšší soud">Nejvyšší soud ČR</option>
                        <option value="Krajský soud">Krajský soud</option>
                        <option value="Okresní soud">Okresní soud</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Spisová značka *</label>
                      <input
                        type="text"
                        value={newRuling.sign}
                        onChange={(e) => setNewRuling({ ...newRuling, sign: e.target.value })}
                        placeholder="např. I. ÚS 45/26"
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Hlavní téma / Klíčové slovo *</label>
                      <input
                        type="text"
                        value={newRuling.topic}
                        onChange={(e) => setNewRuling({ ...newRuling, topic: e.target.value })}
                        placeholder="např. Monotropie, Přesun dětí"
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Právní věta (citát z rozsudku) *</label>
                    <textarea
                      value={newRuling.phrase}
                      onChange={(e) => setNewRuling({ ...newRuling, phrase: e.target.value })}
                      placeholder="Hlavní argument použitelný v soudních podáních..."
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl h-14 mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Vlastní komentář & Shrnutí</label>
                    <textarea
                      value={newRuling.summary}
                      onChange={(e) => setNewRuling({ ...newRuling, summary: e.target.value })}
                      placeholder="Praktický výklad rozsudku..."
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl h-14 mt-1"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Uložit do databáze judikatury
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENT TEMPLATES */}
          {activeMenu === 'documents' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-indigo-500" />
                  Databáze vzorů podání & dokumentů
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Spravujte právně ověřené DOCX a PDF vzory odvolání a návrhů, které si otcové stahují.
                </p>
              </div>

              {/* List of documents */}
              <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-mono text-[9px] uppercase border-b border-slate-100">
                      <th className="p-3">Název vzoru</th>
                      <th className="p-3">Typ dokumentu</th>
                      <th className="p-3">Příslušný soud</th>
                      <th className="p-3">Verze / Aktualizace</th>
                      <th className="p-3 text-right">Akce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {docTemplates.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-semibold text-slate-800">{d.title}</td>
                        <td className="p-3">
                          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            {d.type}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono">{d.court}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-mono text-slate-400 block">{d.version}</span>
                          <span className="text-[9px] text-slate-400">{d.date}</span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setDocTemplates(prev => prev.filter(x => x.id !== d.id))}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Odebrat šablonu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add doc form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Vytvořit nový vzor dokumentu</h3>
                <form onSubmit={handleAddDoc} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Název šablony *</label>
                    <input
                      type="text"
                      value={newDoc.title}
                      onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                      placeholder="např. Odvolání proti nepovolení střídavé péče"
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Typ</label>
                    <select
                      value={newDoc.type}
                      onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl mt-1"
                    >
                      <option value="Návrh k soudu">Návrh k soudu</option>
                      <option value="Odvolání">Odvolání</option>
                      <option value="Návrh">Návrh</option>
                      <option value="Předběžné opatření">Předběžné opatření</option>
                      <option value="Důkazy">Soupis důkazů</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Soud</label>
                    <select
                      value={newDoc.court}
                      onChange={(e) => setNewDoc({ ...newDoc, court: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl mt-1"
                    >
                      <option value="Okresní soud">Okresní soud</option>
                      <option value="Krajský soud">Krajský soud</option>
                      <option value="Nejvyšší soud">Nejvyšší soud</option>
                      <option value="Ústavní soud">Ústavní soud</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Verze šablony</label>
                    <input
                      type="text"
                      value={newDoc.version}
                      onChange={(e) => setNewDoc({ ...newDoc, version: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Vložit šablonu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: CASE CENTER (Případové centrum) */}
          {activeMenu === 'cases' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    Případové centrum (Case Center Tracker)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Komplexní správa životního cyklu soudního sporu: Chronologie, Události, Dokumenty, Důkazy a výsledky.
                  </p>
                </div>
                <div className="text-[10px] bg-indigo-500 text-white font-mono px-2.5 py-1 rounded-full font-bold">
                  UNIKÁTNÍ FUNKCE OS
                </div>
              </div>

              {cases.map((c) => (
                <div key={c.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-6">
                  
                  {/* Title and publish buttons */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-extrabold text-slate-800 font-display flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        {c.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                        <span>Aktuální stav: <strong className="text-indigo-600">{c.status}</strong></span>
                        <span>•</span>
                        <span>Počet důkazů: <strong className="text-slate-700">{c.evidenceCount}</strong></span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAnonymizedPublish(c.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                          c.anonymizedPublished 
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {c.anonymizedPublished ? '✓ Publikováno Anonymizovaně' : '🔗 Publikovat jako studijní vzor'}
                      </button>
                    </div>
                  </div>

                  {/* Visual Case Chronology / Timeline */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Osa případu (Chronologie sporů)</h4>
                    
                    <div className="relative border-l-2 border-indigo-100 ml-3.5 pl-5 py-1 space-y-4">
                      {c.chronology.map((event, idx) => (
                        <div key={idx} className="relative text-xs">
                          {/* Dot marker */}
                          <div className="absolute -left-[27px] top-1 w-3 h-3 bg-indigo-500 border-2 border-white rounded-full" />
                          <span className="text-[10px] font-mono text-slate-400">{event.date}</span>
                          <strong className="text-slate-800 block font-semibold mt-0.5">{event.title}</strong>
                          <p className="text-slate-500 mt-1 leading-relaxed text-[11px]">{event.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Event to Chronology */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Přidat krok do chronologie případu:</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <input
                          type="text"
                          value={newChronologyTitle}
                          onChange={(e) => setNewChronologyTitle(e.target.value)}
                          placeholder="Událost (např. První soudní stání)"
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newChronologyDesc}
                          onChange={(e) => setNewChronologyDesc(e.target.value)}
                          placeholder="Stručné shrnutí a dopad..."
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                        />
                        <button
                          onClick={handleAddChronology}
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer"
                        >
                          Uložit
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* TAB 6: EVIDENCE MANAGER (Správce důkazů) */}
          {activeMenu === 'evidence' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <Folder className="w-5 h-5 text-indigo-500" />
                    Správce důkazů (Důkazní trezor)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Podobně jako Google Drive chraňte fotky, audio nahrávky střídání a screenshoty komunikace pro soudní břemeno.
                  </p>
                </div>
              </div>

              {/* Folder Selector row */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: '📁 Všechny soubory', count: evidences.length },
                  { id: 'fotografie', label: '📷 Fotografie', count: evidences.filter(e => e.type === 'fotografie').length },
                  { id: 'audio', label: '🎙️ Audio nahrávky', count: evidences.filter(e => e.type === 'audio').length },
                  { id: 'screenshoty', label: '📱 Screenshoty', count: evidences.filter(e => e.type === 'screenshoty').length },
                  { id: 'PDF', label: '📄 PDF / Posudky', count: evidences.filter(e => e.type === 'PDF').length }
                ].map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setEvidenceFolder(folder.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      evidenceFolder === folder.id 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {folder.label}
                    <span className="ml-1.5 text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-full">
                      {folder.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* List of active files */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {evidences
                  .filter(e => evidenceFolder === 'all' || e.type === evidenceFolder)
                  .map(e => (
                    <div key={e.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex items-center justify-between hover:border-slate-200 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {e.type === 'fotografie' && '📷'}
                          {e.type === 'audio' && '🎙️'}
                          {e.type === 'screenshoty' && '📱'}
                          {e.type === 'PDF' && '📄'}
                        </span>
                        <div>
                          <strong className="text-xs text-slate-800 font-semibold block max-w-xs truncate">{e.name}</strong>
                          <span className="text-[9px] text-slate-400 block font-mono">
                            Získáno: {e.date} | {e.place}
                          </span>
                          <span className="text-[8px] bg-slate-100 text-slate-500 font-mono px-1 py-0.2 rounded mt-1 inline-block">
                            Štítek: {e.tags}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => alert(`Stahování souboru "${e.name}" z bezpečné dešifrované schránky.`)}
                          className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                          title="Stáhnout"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEvidences(prev => prev.filter(x => x.id !== e.id))}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Smazat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Upload simulated trigger */}
              <div className="p-4 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Importovat nový důkazní soubor (Trezor D1)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newEvidenceName}
                      onChange={(e) => setNewEvidenceName(e.target.value)}
                      placeholder="Popis názvu souboru (např. Fotka_Jiřík_u_oběda)"
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <select
                      value={newEvidenceType}
                      onChange={(e) => setNewEvidenceType(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                    >
                      <option value="fotografie">Obrázek / Fotografie</option>
                      <option value="audio">Audio nahrávka</option>
                      <option value="screenshoty">Snímky obrazovky / Chaty</option>
                      <option value="PDF">Dokumenty / PDF</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleAddEvidence}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Importovat do trezoru Synthesis OS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: COMMUNITY & AI SCAN */}
          {activeMenu === 'community' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-500" />
                  Komentáře & Inteligentní AI Moderování
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prověřte nahlášené urážky nebo chraňte děti před únikem citlivých údajů jedním kliknutím pomocí AI Scanneru.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'c-101', author: 'Ondřej (Otec)', text: 'Musím říct, že na OSPODu Vyškov jsou úžasné pracovnice, doporučily střídavku hned!', reported: false },
                  { id: 'c-102', author: 'Anonymní_Matka', text: 'Ten otec je naprostý debil, píča a tyran! Doufám, že mu děti odeberou a chcípne!', reported: true },
                  { id: 'c-103', author: 'Spam_Bot', text: 'Vyhrajte 10000 EUR na našem casinu! Klikněte na http://supercasino-win.cz', reported: true },
                  { id: 'c-104', author: 'Ondřej (Otec)', text: 'Pozor na matku, bydlí na ulici Údolní 45 a její rodné číslo je 150290/1110!', reported: true }
                ].map((c) => {
                  const scan = scanResult[c.id];
                  return (
                    <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 relative">
                      <div className="flex justify-between items-center text-xs">
                        <strong className="text-slate-800 font-bold">{c.author}</strong>
                        {c.reported && (
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            NAHLÁŠENÝ OBSAH
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {c.text}
                      </p>

                      {/* Scan trigger & results */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-2.5 border-t border-slate-50 text-xs">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAiScan(c.id, c.text)}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            {aiScanningId === c.id ? 'Analyzuji...' : 'Analyzovat přes AI Scan'}
                          </button>

                          <button
                            onClick={() => alert('Komentář byl trvale odstraněn z fóra.')}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[10px] cursor-pointer"
                          >
                            Trvale smazat
                          </button>
                        </div>

                        {/* AI scan diagnosis visualization */}
                        {scan && (
                          <div className={`p-2 rounded-xl text-[10px] font-medium border flex items-center gap-2 ${
                            scan.safe ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                          }`}>
                            <span className="text-base">{scan.safe ? '✓' : '🚨'}</span>
                            <div>
                              <strong>AI Skóre rizikovosti: {scan.vulgarity}%</strong>
                              <span className="block text-[9px] text-slate-500">{scan.reason}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 8: AI CENTRUM (AI Generátor) */}
          {activeMenu === 'aicentre' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-indigo-500" />
                    AI Centrum - Synthesis AI Assistant
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generujte automaticky články, tvořte právní rešerše opatrovnických rozsudků, nebo anonymizujte citlivé rodinné listiny.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Zadání (Prompt / Text k analýze):</span>
                
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Napište například: 'II. ÚS 132/24' pro shrnutí rozsudku, nebo zadejte textový rozsudek s rodnými jmény k anonymizaci..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl h-28 focus:bg-white focus:border-indigo-500 focus:outline-hidden font-mono"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleAiGenerate('article')}
                    disabled={aiGenerating}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    Vytvořit článek
                  </button>
                  <button
                    onClick={() => handleAiGenerate('summary')}
                    disabled={aiGenerating}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    Shrnout rozsudek
                  </button>
                  <button
                    onClick={() => handleAiGenerate('anonymize')}
                    disabled={aiGenerating}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    Anonymizovat text
                  </button>
                  <button
                    onClick={() => handleAiGenerate('faq')}
                    disabled={aiGenerating}
                    className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    Vytvořit FAQ sada
                  </button>
                </div>
              </div>

              {/* AI output result */}
              {(aiGenerating || aiOutput) && (
                <div className="p-5 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden font-mono text-xs">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
                  
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
                    <span className="text-[10px] uppercase font-bold text-teal-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Výstup Synthesis AI Asistenta
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiOutput);
                        alert('Zkopírováno!');
                      }}
                      className="text-[9px] text-slate-400 hover:text-white"
                    >
                      Kopírovat
                    </button>
                  </div>

                  {aiGenerating ? (
                    <div className="flex items-center gap-2 text-slate-400 py-4">
                      <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                      <span>Generuji expertní výstup přes LLM model...</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-300">
                      {aiOutput}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: USERS & RBAC (Role a Práva) */}
          {activeMenu === 'users' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Správa uživatelů & Role-Based Access Control (RBAC)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Přiřaďte detailní schvalovací práva jednotlivým rolím v ekosystému Synthesis OS.
                </p>
              </div>

              {/* Grid of roles and permissions */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Matrice oprávnění rolí (Oprávnění k modulům)</h3>
                
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-100">
                        <th className="p-3">Role v portálu</th>
                        <th className="p-3 text-center">Obsah</th>
                        <th className="p-3 text-center">Judikatura</th>
                        <th className="p-3 text-center">Důkazy</th>
                        <th className="p-3 text-center">Případy</th>
                        <th className="p-3 text-center">Moderování</th>
                        <th className="p-3 text-center">Simulátor</th>
                        <th className="p-3 text-center">Audit OS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {[
                        { id: 'SuperAdmin', label: '👑 SuperAdmin' },
                        { id: 'Admin', label: '⚙️ Admin' },
                        { id: 'Editor', label: '✍️ Editor' },
                        { id: 'PravniPoradce', label: '⚖️ Právní poradce' },
                        { id: 'Psycholog', label: '🧠 Psycholog' },
                        { id: 'Moderator', label: '🛡️ Moderátor' },
                        { id: 'OvenyUzivatel', label: '⭐ Ověřený' },
                        { id: 'Registrovaný', label: '👤 Registrovaný' },
                        { id: 'Zablokovaný', label: '🚫 Zablokovaný' }
                      ].map((role) => (
                        <tr key={role.id} className="hover:bg-slate-50/55">
                          <td className="p-3 font-semibold text-slate-800">{role.label}</td>
                          
                          {/* Modul checkboxes mapped to state */}
                          {['obsah', 'judikatura', 'dukazy', 'pripady', 'forum', 'simulace', 'audit'].map(perm => {
                            const hasPerm = rolePermissions[role.id]?.includes(perm);
                            return (
                              <td key={perm} className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={hasPerm}
                                  onChange={() => {
                                    const currentList = rolePermissions[role.id] || [];
                                    const updated = currentList.includes(perm)
                                      ? currentList.filter(p => p !== perm)
                                      : [...currentList, perm];
                                    setRolePermissions({
                                      ...rolePermissions,
                                      [role.id]: updated
                                    });
                                  }}
                                  className="accent-indigo-600 rounded cursor-pointer"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SIMULATOR SETTINGS */}
          {activeMenu === 'simulator' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-500" />
                  Konfigurace výpočetních algoritmů simulátoru
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Spravujte koeficienty v simulátoru péče bez nutnosti psát kód. Změny ovlivní výpočet sourozenecké soudržnosti.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-5 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-600">Váha sourozenecké soudržnosti v algoritmu:</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={simConfig.siblingWeight}
                        onChange={(e) => setSimConfig({ ...simConfig, siblingWeight: parseInt(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <span className="font-mono font-bold text-indigo-600">{simConfig.siblingWeight}%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-600">Limit hodin dětí na cestách za měsíc:</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="5"
                        max="40"
                        value={simConfig.maxTravelHours}
                        onChange={(e) => setSimConfig({ ...simConfig, maxTravelHours: parseInt(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <span className="font-mono font-bold text-indigo-600">{simConfig.maxTravelHours} h</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3">
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-600">Barva grafů: Otec</label>
                    <input
                      type="color"
                      value={simConfig.colorFather}
                      onChange={(e) => setSimConfig({ ...simConfig, colorFather: e.target.value })}
                      className="w-full h-10 border border-slate-100 rounded-xl cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-600">Barva grafů: Matka</label>
                    <input
                      type="color"
                      value={simConfig.colorMother}
                      onChange={(e) => setSimConfig({ ...simConfig, colorMother: e.target.value })}
                      className="w-full h-10 border border-slate-100 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => alert('Změny v matematickém algoritmu byly přepsány do konfiguračního souboru v souladu s API.')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
                  >
                    Uložit nastavení simulátoru
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: APPEARANCE (Vzhled & Šablony) */}
          {activeMenu === 'appearance' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <Paintbrush className="w-5 h-5 text-indigo-500" />
                  Nastavení vzhledu a šablon (WordPress Theme Builder)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Přizpůsobte barvy, typografii a uspořádání menu z jednoho místa bez programování.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-600">Název v záhlaví portálu</label>
                    <input
                      type="text"
                      value={appearance.logoText}
                      onChange={(e) => setAppearance({ ...appearance, logoText: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-600">Typ písma (Font Family)</label>
                    <select
                      value={appearance.font}
                      onChange={(e) => setAppearance({ ...appearance, font: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl"
                    >
                      <option value="sans">Sans-Serif (Moderní Inter)</option>
                      <option value="serif">Serif (Elegantní Playfair)</option>
                      <option value="mono">Monospace (JetBrains Mono)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <input
                    type="checkbox"
                    checked={appearance.darkModeDefault}
                    onChange={(e) => setAppearance({ ...appearance, darkModeDefault: e.target.checked })}
                    className="accent-indigo-600 rounded cursor-pointer"
                    id="dark-mode-default-chk"
                  />
                  <label htmlFor="dark-mode-default-chk" className="font-semibold text-slate-700 cursor-pointer">
                    Aktivovat výchozí tmavý režim (Dark mode) pro nové návštěvníky
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => alert('Vzhled úspěšně přepsán do globálního CSS a index.css souboru.')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
                  >
                    Uložit šablonu vzhledu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: STATS */}
          {activeMenu === 'stats' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-500" />
                  Statistiky stažení a návštěvnosti
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sledujte využití portálu: nejstahovanější PDF soubory, nejpopulárnější vzory podání a vývoj návštěvnosti.
                </p>
              </div>

              {/* Graphical simulation using simple charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Most downloaded PDFs */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Nejstahovanější PDF soubory</span>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Vzor_Odvolani_Stridava.docx', downloads: '240 stažení', pct: 95 },
                      { name: 'Smlouva_Dohoda_Rodice.pdf', downloads: '180 stažení', pct: 75 },
                      { name: 'Prehled_Judikatury_OS.pdf', downloads: '140 stažení', pct: 55 },
                      { name: 'Osa_pripravy_soud.pdf', downloads: '80 stažení', pct: 30 }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="font-bold text-slate-800">{item.downloads}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most active searches */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Nejčastější vyhledávané dotazy</span>
                  
                  <div className="divide-y divide-slate-100 text-xs">
                    {[
                      { term: 'Jak vyvrátit posudek OSPOD', count: '142 hledání' },
                      { term: 'Rozdělení sourozenců judikáty', count: '112 hledání' },
                      { term: 'Střídavá péče miminko', count: '98 hledání' },
                      { term: 'Dohoda o střídavé péči vzor', count: '87 hledání' }
                    ].map((item, i) => (
                      <div key={i} className="py-2.5 flex justify-between font-medium">
                        <span className="text-slate-700">🔎 "{item.term}"</span>
                        <span className="text-slate-500 font-mono text-[11px]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 13: AUDIT & SECURITY & BACKUPS */}
          {activeMenu === 'audit' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    Systémový audit změn & Zálohování (Audit Ledger)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Neměnná časová řada změn provedených editory. Možnost obnovení jakékoli předchozí verze jedním kliknutím.
                  </p>
                </div>
              </div>

              {/* Backup action box */}
              <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                
                <div className="space-y-1.5 relative z-10 text-xs">
                  <strong className="text-sm font-bold block text-teal-400">Bezpečné zálohování celého systému</strong>
                  <p className="text-slate-300">
                    Poslední automatická záloha proběhla dnes ve 04:00. Celková velikost: 14.2 MB.
                  </p>
                </div>

                <button
                  onClick={runBackup}
                  disabled={backupRunning}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-xs rounded-xl cursor-pointer z-10 flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md shadow-teal-950/20"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${backupRunning ? 'animate-spin' : ''}`} />
                  {backupRunning ? 'Zálohuji...' : 'Zálohovat ručně'}
                </button>
              </div>

              {/* List of active backups */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Dostupné zálohy pro obnovení</span>
                <div className="divide-y divide-slate-100">
                  {backups.map((b) => (
                    <div key={b.id} className="py-2.5 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <strong className="text-slate-800 font-semibold block">{b.date}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">Původce: {b.creator}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-slate-500">{b.size}</span>
                        <button
                          onClick={() => alert(`Záloha ze dne ${b.date} byla přichystána pro obnovení.`)}
                          className="text-indigo-600 hover:underline cursor-pointer font-bold"
                        >
                          Obnovit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ledger audit trail table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Neměnná auditní stopa změn (Ledger)</span>
                
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-100">
                        <th className="p-3">Čas & Datum</th>
                        <th className="p-3">Uživatel</th>
                        <th className="p-3">Změna / Akce</th>
                        <th className="p-3">IP Adresa & OS</th>
                        <th className="p-3 text-right">Zpětné obnovení</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-600">
                      {auditLogs.map((log, i) => (
                        <tr key={i} className="hover:bg-slate-50/40">
                          <td className="p-3 text-slate-400">{log.date}</td>
                          <td className="p-3 font-semibold text-slate-800">{log.user}</td>
                          <td className="p-3 font-sans text-xs text-slate-700 leading-relaxed max-w-sm">
                            <span className="bg-slate-100 text-slate-800 text-[9px] font-bold px-1.5 py-0.2 rounded mr-1.5 font-sans">
                              {log.category}
                            </span>
                            {log.desc}
                          </td>
                          <td className="p-3 text-[10px] text-slate-400">
                            <span>{log.ip}</span>
                            <span className="block text-[9px]">{log.browser}</span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => restoreRevision(log.desc)}
                              className="text-indigo-600 hover:underline font-bold font-sans text-xs cursor-pointer"
                            >
                              Obnovit verzi
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 14: SUPABASE CONTROL */}
          {activeMenu === 'supabase' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-6">
              <div className="border-b border-slate-50 pb-3">
                <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-5 h-5 text-indigo-600" />
                  Supabase PostgreSQL Integrace
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Správa nativních vazeb pro stálá cloudová data.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <strong className="text-slate-500 font-mono block">SUPABASE API URL</strong>
                  <span className="font-mono text-[11px] break-all">{supUrl || 'Nenastaveno'}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <strong className="text-slate-500 font-mono block">ANONYMNÍ KLÍČ</strong>
                  <span className="font-mono text-[11px] break-all">
                    {supKey ? '••••••••••••••••••••' : 'Nenastaveno'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-100 text-teal-950 rounded-2xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="font-bold block">Status synchronizace: {isSupabaseActive ? 'AKTIVNÍ' : 'LOKÁLNÍ STORAGE'}</strong>
                  <p className="mt-1 leading-relaxed">
                    Uživatelská data a auditní stopy se ukládají v reálném čase do relační PostgreSQL databáze Supabase s bezpečnými pravidly Row-Level Security (RLS).
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
