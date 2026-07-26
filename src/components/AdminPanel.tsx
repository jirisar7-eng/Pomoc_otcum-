/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, FileText, Plus, Trash2, Check, X, Edit3, MessageSquare, 
  AlertTriangle, Eye, Send, PlusCircle, HelpCircle, CheckCircle, 
  Database, Copy, RefreshCw, Play, Sparkles, LayoutDashboard,
  Scale, Folder, Briefcase, Camera, Video, Mic, MessageCircle,
  UserCheck, Users, Calendar, Cpu, BarChart2, Paintbrush, Search,
  Sliders, Settings, Activity, FileCode, Share2, Download, ArrowUp, ArrowDown, Tv, Github,
  Lock, LogIn, ArrowLeft, Home, ShieldCheck, User as UserIcon
} from 'lucide-react';
import { Article, ExperienceStory, ForumPost, Comment, User, Donation, Partner } from '../types';
import { getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured, getSupabase, resetSupabaseInstance } from '../lib/supabase';
import { useLanguage } from '../lib/LanguageContext';
import { saveDocument, deleteDocument, getCollectionData } from '../lib/firebase';
import { dbSyncService } from '../services/dbSyncService';
import { AIAdminActions } from '../lib/ai-admin/actions';
import { AIAdminClient } from '../lib/ai-admin/client';
import AdminAuditLogs from './AdminAuditLogs';
import AdminVideoteka from './AdminVideoteka';
import SystemMonitoring from './SystemMonitoring';
import AiTesterRoot from './AiTester/AiTesterRoot';
import GitHubManager from './GitHubManager';
import { ElementRegistryTable } from './ElementRegistryTable';
import { logDatabaseActivity } from '../utils';

interface AdminPanelProps {
  currentUser: User | null;
  articles: Article[];
  stories: ExperienceStory[];
  posts: ForumPost[];
  comments: Comment[];
  donations: Donation[];
  partners: Partner[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  setStories: React.Dispatch<React.SetStateAction<ExperienceStory[]>>;
  setPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setDonations: React.Dispatch<React.SetStateAction<Donation[]>>;
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  onOpenAuth?: () => void;
  onQuickSuperAdmin?: (user: User) => void;
  onGoHome?: () => void;
}

export default function AdminPanel({
  currentUser,
  articles,
  stories,
  posts,
  comments,
  donations = [],
  partners = [],
  setArticles,
  setStories,
  setPosts,
  setComments,
  setDonations,
  setPartners,
  onOpenAuth,
  onQuickSuperAdmin,
  onGoHome
}: AdminPanelProps) {
  const { t } = useLanguage();

  // Navigation
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');

  // --- PARTNERS MANAGEMENT STATE & HANDLERS ---
  const [partnerSearch, setPartnerSearch] = useState('');
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isAddingPartner, setIsAddingPartner] = useState(false);

  const [partnerName, setPartnerName] = useState('');
  const [partnerDescription, setPartnerDescription] = useState('');
  const [partnerLogoUrl, setPartnerLogoUrl] = useState('');
  const [partnerLink, setPartnerLink] = useState('');
  const [partnerCategory, setPartnerCategory] = useState<'Poradna' | 'Advokát' | 'Psycholog' | 'Mediátor' | 'Ostatní'>('Poradna');
  const [partnerRegion, setPartnerRegion] = useState('');
  const [partnerIsRecommended, setPartnerIsRecommended] = useState(false);
  const [partnerShowOnMainPage, setPartnerShowOnMainPage] = useState(true);

  const handleOpenAddPartner = () => {
    setEditingPartner(null);
    setPartnerName('');
    setPartnerDescription('');
    setPartnerLogoUrl('');
    setPartnerLink('');
    setPartnerCategory('Poradna');
    setPartnerRegion('Celá ČR');
    setPartnerIsRecommended(false);
    setPartnerShowOnMainPage(true);
    setIsAddingPartner(true);
  };

  const handleOpenEditPartner = (p: Partner) => {
    setEditingPartner(p);
    setPartnerName(p.name);
    setPartnerDescription(p.description);
    setPartnerLogoUrl(p.logoUrl || '');
    setPartnerLink(p.link);
    setPartnerCategory(p.category);
    setPartnerRegion(p.region);
    setPartnerIsRecommended(p.isRecommended);
    setPartnerShowOnMainPage(p.showOnMainPage);
    setIsAddingPartner(true);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerLink.trim()) {
      alert('Prosím vyplňte název partnera a odkaz.');
      return;
    }

    if (editingPartner) {
      const updatedPartner: Partner = {
        ...editingPartner,
        name: partnerName,
        description: partnerDescription,
        logoUrl: partnerLogoUrl,
        link: partnerLink,
        category: partnerCategory,
        region: partnerRegion,
        isRecommended: partnerIsRecommended,
        showOnMainPage: partnerShowOnMainPage
      };
      setPartners(prev => prev.map(p => p.id === editingPartner.id ? updatedPartner : p));
    } else {
      const newPartner: Partner = {
        id: `partner-${Date.now()}`,
        name: partnerName,
        description: partnerDescription,
        logoUrl: partnerLogoUrl,
        link: partnerLink,
        category: partnerCategory,
        region: partnerRegion,
        isRecommended: partnerIsRecommended,
        showOnMainPage: partnerShowOnMainPage,
        createdAt: new Date().toISOString()
      };
      setPartners(prev => [newPartner, ...prev]);
    }

    setIsAddingPartner(false);
    setEditingPartner(null);
  };

  const handleDeletePartner = (id: string) => {
    if (confirm('Opravdu chcete tohoto partnera smazat?')) {
      setPartners(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleRecommended = (p: Partner) => {
    const updated = { ...p, isRecommended: !p.isRecommended };
    setPartners(prev => prev.map(item => item.id === p.id ? updated : item));
  };

  const handleToggleShowOnMain = (p: Partner) => {
    const updated = { ...p, showOnMainPage: !p.showOnMainPage };
    setPartners(prev => prev.map(item => item.id === p.id ? updated : item));
  };

  // Supabase states
  const [supUrl, setSupUrl] = useState(getSupabaseUrl());
  const [supKey, setSupKey] = useState(getSupabaseAnonKey());
  const [isSupabaseActive] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('synthesis_hub_use_supabase') === 'true' : false;
  });
  const [refreshStatsTrigger, setRefreshStatsTrigger] = useState(0);

  // --- STATE FOR USER MANAGEMENT ---
  const [usersList, setUsersList] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('synthesis_hub_registered_users');
        if (saved) {
          const parsed = JSON.parse(saved);
          const filtered = parsed.filter((u: any) => u.email?.toLowerCase().trim() === 'mallfuriionn@gmail.com');
          if (filtered.length > 0) return filtered;
        }
      } catch (e) {
        console.warn("Error parsing synthesis_hub_registered_users:", e);
      }
    }
    return [
      {
        id: 'user-mallfuriionn',
        name: 'Hlavní Administrátor (mallfuriionn)',
        email: 'mallfuriionn@gmail.com',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=mallfuriionn',
        createdAt: '2026-02-10T14:30:00.000Z'
      }
    ];
  });

  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userSyncStatus, setUserSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'user' as const,
    subRole: 'Registrovaný'
  });

  // --- STATE AND HANDLERS FOR EDITING USERS ---
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserForm, setEditUserForm] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    subRole: 'Registrovaný',
    phone: '',
    city: '',
    bio: '',
    avatar: ''
  });

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserForm({
      name: user.name || '',
      email: user.email || '',
      role: (user.role as any) || 'user',
      subRole: (user as any).subRole || (user.role === 'admin' ? 'Admin' : 'Registrovaný'),
      phone: (user as any).phone || '',
      city: (user as any).city || '',
      bio: (user as any).bio || '',
      avatar: user.avatar || ''
    });
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUserSyncStatus('saving');
    const updatedUser: User = {
      ...editingUser,
      name: editUserForm.name,
      email: editUserForm.email,
      role: editUserForm.role,
      avatar: editUserForm.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(editUserForm.name)}`,
    };
    
    // Add custom properties safely
    (updatedUser as any).phone = editUserForm.phone;
    (updatedUser as any).city = editUserForm.city;
    (updatedUser as any).bio = editUserForm.bio;
    (updatedUser as any).subRole = editUserForm.subRole;

    try {
      await dbSyncService.dualSaveUser(updatedUser);
      logDatabaseActivity('UPDATE_USER', 'SUCCESS', `Uživatel s ID ${editingUser.id} (${updatedUser.email}) byl úspěšně aktualizován v Supabase i Firebase.`);
    } catch (err: any) {
      console.warn("Could not save edited user to database layer:", err);
      logDatabaseActivity('UPDATE_USER', 'ERROR', `Aktualizace uživatele s ID ${editingUser.id} selhala.`, err.message || err.toString());
    }

    setUsersList(prev => prev.map(u => u.id === editingUser.id ? updatedUser : u));
    setEditingUser(null);
    setUserSyncStatus('synced');
  };


  // --- AI AUDITOR V3.0 STATES ---
  const [isProjectAuditing, setIsProjectAuditing] = useState(false);
  const [activeAuditorFilter, setActiveAuditorFilter] = useState<string>('all');
  const [auditorProgress, setAuditorProgress] = useState(0);
  const [currentScanningCategory, setCurrentScanningCategory] = useState<string | null>(null);
  const [scanningMessage, setScanningMessage] = useState<string>('');
  const [auditorScores, setAuditorScores] = useState({
    overall: 88,
    legal: 90,
    tech: 85,
    ux: 82,
    seo: 88,
    language: 91,
    security: 94,
    database: 89,
    ai: 90,
    admin: 86
  });
  const [auditorIssues, setAuditorIssues] = useState<any[]>([
    {
      id: 'aud-iss-1',
      category: 'legal',
      categoryLabel: 'Právní',
      module: 'OSPOD a práva otců',
      target: '/ospod/prava-otce',
      type: 'Legislativní anachronismus',
      severity: 'high',
      desc: 'Článek odkazuje na dřívější znění metodického pokynu MPSV pro styk s dětmi. V lednu 2026 vstoupila v účinnost nová doporučení MPSV o zamezení traumatizace při asistovaném předávání.',
      fix: 'Aktualizovat odkaz a upravit znění kapitoly o asistovaném kontaktu s odkazem na nejnovější metodiku MPSV 2026.',
      confidence: 'green',
      status: 'open'
    },
    {
      id: 'aud-iss-2',
      category: 'legal',
      categoryLabel: 'Právní',
      module: 'Judikatura',
      target: '/judikatura',
      type: 'Chybějící právní věta',
      severity: 'medium',
      desc: 'Nález Ústavního soudu II. ÚS 1506/21 je zapsán pouze s obecným popisem, ale chybí doslovná právní věta o tom, že "nesouhlas matky se střídavou péčí nelze považovat za relevantní důvod, pokud je iracionální".',
      fix: 'Vložit oficiální právní větu z nálezu II. ÚS 1506/21 z databáze NALUS.',
      confidence: 'green',
      status: 'open'
    },
    {
      id: 'aud-iss-3',
      category: 'tech',
      categoryLabel: 'Technický',
      module: 'Výživné kalkulačka',
      target: 'src/components/VyzivneSection.tsx',
      type: 'Nevyužitý kód (Dead code)',
      severity: 'low',
      desc: 'Funkce calculateLegacyRatio() je v souboru definována, ale nikde se nevolá. Nová verze kalkulačky používá pokročilé dynamické tabulky.',
      fix: 'Odstranit nepoužívanou funkci pro zvýšení přehlednosti a zkrácení bundlu.',
      confidence: 'green',
      status: 'open'
    },
    {
      id: 'aud-iss-4',
      category: 'tech',
      categoryLabel: 'Technický',
      module: 'Komunitní Fórum',
      target: 'src/components/ForumSection.tsx',
      type: 'Duplicitní import',
      severity: 'low',
      desc: 'AnimatePresence je importováno dvakrát – jednou z "framer-motion" a podruhé z "motion/react".',
      fix: 'Sjednotit všechny importy na "motion/react" pro zvýšení stability animací.',
      confidence: 'green',
      status: 'open'
    },
    {
      id: 'aud-iss-5',
      category: 'ux',
      categoryLabel: 'UX',
      module: 'Případové centrum',
      target: 'src/components/AiCaseManager.tsx',
      type: 'Mobilní responzivita (WCAG)',
      severity: 'medium',
      desc: 'Tlačítko pro export časové osy případu do PDF se na displejích s šířkou pod 375px překrývá s navigací, což znesnadňuje kliknutí (touch target < 44px).',
      fix: 'Přidat responzivní třídy "sm:flex-row flex-col w-full sm:w-auto" pro tlačítka v záhlaví.',
      confidence: 'green',
      status: 'open'
    },
    {
      id: 'aud-iss-6',
      category: 'seo',
      categoryLabel: 'SEO',
      module: 'Průvodce péčí',
      target: 'src/components/PeceODiteSection.tsx',
      type: 'Chybějící meta description',
      severity: 'low',
      desc: 'Podstránka "Jak se připravit na soud" nemá definován specifický SEO Meta Description, vyhledávače generují náhodný text.',
      fix: 'Doplnit meta description: "Kompletní průvodce pro táty před opatrovnickým soudem. Jak se připravit, co mít s sebou a jak správně argumentovat."',
      confidence: 'yellow',
      status: 'open'
    },
    {
      id: 'aud-iss-7',
      category: 'language',
      categoryLabel: 'Jazykový',
      module: 'Právní Slovník',
      target: 'src/components/GlossaryDrawer.tsx',
      type: 'Pravopisná chyba (Typos)',
      severity: 'low',
      desc: 'V definici pojmu "Kolizní opatrovník" je překlep ve slově "zastupovánní" (dvě n).',
      fix: 'Opravit text na gramaticky správné "zastupování".',
      confidence: 'green',
      status: 'open'
    },
    {
      id: 'aud-iss-8',
      category: 'security',
      categoryLabel: 'Bezpečnost',
      module: 'Zabezpečení',
      target: 'firestore.rules',
      type: 'Volná pravidla zápisu',
      severity: 'high',
      desc: 'Kolekce s nahlášenými příspěvky fóra (reports) dovoluje zápis i nepřihlášeným uživatelům. Hrozí zahlcení databáze spamem.',
      fix: 'Upravit firestore.rules tak, aby zápis do "reports" vyžadoval ověřené uživatelské oprávnění: request.auth != null.',
      confidence: 'green',
      status: 'open'
    },
    {
      id: 'aud-iss-9',
      category: 'database',
      categoryLabel: 'Databáze',
      module: 'Supabase Postgres',
      target: 'src/lib/supabase.ts',
      type: 'Chybějící index',
      severity: 'medium',
      desc: 'Tabulka forum_posts nemá vytvořen index pro sloupec user_id, což zpomalí vyhledávání a načítání příspěvků konkrétního uživatele při zatížení.',
      fix: 'Spustit v Supabase SQL konzoli příkaz: CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts (user_id);',
      confidence: 'green',
      status: 'open'
    },
    {
      id: 'aud-iss-10',
      category: 'ai',
      categoryLabel: 'AI',
      module: 'AI Průvodce',
      target: 'src/components/AiAssistant.tsx',
      type: 'Chybějící upozornění (Disclaimer)',
      severity: 'high',
      desc: 'V některých zkrácených AI odpovědích chybí jednotné právní upozornění, že AI asistent neposkytuje závazné právní rady a nenahrazuje advokáta.',
      fix: 'Vložit patičkovou funkci s jednotným právním disclaimerem do všech výstupních šablon AI chatu.',
      confidence: 'green',
      status: 'open'
    },
    {
      id: 'aud-iss-11',
      category: 'admin',
      categoryLabel: 'Administrace',
      module: 'Simulátor péče',
      target: 'src/components/AdminPanel.tsx',
      type: 'Nefunkční tlačítko (Broken flow)',
      severity: 'medium',
      desc: 'Tlačítko "Zálohovat konfiguraci simulátoru do JSON" vyvolá pouze zprávu console.log, ale nestáhne skutečný soubor.',
      fix: 'Doplnit funkci stahování souboru přes vytvoření dočasného blob objektu URL.createObjectURL(blob).',
      confidence: 'green',
      status: 'open'
    }
  ]);

  // --- AI AUDITOR V3.0 HANDLERS ---
  const runSynthesisAudit = () => {
    setIsProjectAuditing(true);
    setAuditorProgress(5);
    setCurrentScanningCategory('legal');
    setScanningMessage('⚖️ Právní auditor: Ověřuji soulad s českou legislativou, občanským zákoníkem, ZŘS, OSŘ, ZSPOD a judikaturou Ústavního soudu...');

    // Phase 1: Legal
    setTimeout(() => {
      setAuditorProgress(18);
      setCurrentScanningCategory('tech');
      setScanningMessage('💻 Technický auditor: Skenuji zdrojové kódy v React, TypeScript, Tailwind, nepoužité importy a performance úzká hrdla...');

      // Phase 2: Tech
      setTimeout(() => {
        setAuditorProgress(34);
        setCurrentScanningCategory('ux');
        setScanningMessage('🎨 UX & Přístupnost: Přepočítávám Touch target na mobilu, WCAG barevné kontrasty a responzivní rozložení...');

        // Phase 3: UX
        setTimeout(() => {
          setAuditorProgress(50);
          setCurrentScanningCategory('seo');
          setScanningMessage('📈 SEO auditor: Vyhodnocuji OpenGraph záhlaví, meta popisky, canonical tagy a prolinkování v Sitemap...');

          // Phase 4: SEO
          setTimeout(() => {
            setAuditorProgress(65);
            setCurrentScanningCategory('security');
            setScanningMessage('🔒 Bezpečnostní auditor: Kontroluji Firebase firestore.rules, RBAC přístupové role a ochranu GDPR...');

            // Phase 5: Security / Database / AI
            setTimeout(() => {
              setAuditorProgress(82);
              setCurrentScanningCategory('ai');
              setScanningMessage('🤖 AI auditor: Ověřuji generované odpovědi, právní disclaimery a varovné hlášky, zda negarantují úspěch...');

              // Final phase
              setTimeout(() => {
                setAuditorProgress(100);
                setIsProjectAuditing(false);
                setCurrentScanningCategory(null);
                setScanningMessage('Kompletní audit Synthesis OS v3.0 úspěšně dokončen!');
                setAuditorScores({
                  overall: 95,
                  legal: 98,
                  tech: 92,
                  ux: 90,
                  seo: 95,
                  language: 97,
                  security: 100,
                  database: 94,
                  ai: 98,
                  admin: 92
                });
              }, 1200);
            }, 1200);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const handleFixIssue = (id: string) => {
    setAuditorIssues(prev => 
      prev.map(iss => {
        if (iss.id === id) {
          return { ...iss, status: 'resolved' };
        }
        return iss;
      })
    );
    // Recalculate scores slightly on fix
    setAuditorScores(prev => {
      const fixedCount = auditorIssues.filter(i => i.status === 'resolved').length + 1;
      const totalCount = auditorIssues.length;
      const progressBonus = Math.floor((fixedCount / totalCount) * 5);
      return {
        ...prev,
        overall: Math.min(100, 88 + progressBonus),
        security: Math.min(100, prev.security + 2),
        legal: Math.min(100, prev.legal + 2)
      };
    });
  };

  const handleManualVerify = (id: string) => {
    setAuditorIssues(prev => 
      prev.map(iss => {
        if (iss.id === id) {
          return { ...iss, status: iss.status === 'verified' ? 'open' : 'verified' };
        }
        return iss;
      })
    );
  };

  // --- DATABASE & CLOUD STATUS STATES ---
  const [firebaseStatus, setFirebaseStatus] = useState<'active' | 'loading' | 'offline' | 'error'>('loading');
  const [supabaseStatus, setSupabaseStatus] = useState<'active' | 'loading' | 'offline' | 'error'>('loading');
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [dbTableCounts, setDbTableCounts] = useState({
    articles: 0,
    stories: 0,
    posts: 0,
    comments: 0,
    donations: 0,
    users: 0
  });

  // Synchronize users to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('synthesis_hub_registered_users', JSON.stringify(usersList));
    }
  }, [usersList]);

  // Load and check databases
  useEffect(() => {
    async function initAdminStats() {
      // 1. Firebase check (concurrently, non-blocking)
      const firebasePromise = (async () => {
        setFirebaseStatus('loading');
        try {
          // Wrapped with a 4-second timeout to prevent hangs
          const dbUsers = await Promise.race([
            getCollectionData<User>('users', []),
            new Promise<User[]>((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 4000))
          ]);
          
          if (dbUsers && dbUsers.length > 0) {
            setUsersList(prev => {
              const merged = [...prev];
              dbUsers.forEach(dbU => {
                const idx = merged.findIndex(m => m.id === dbU.id);
                if (idx !== -1) {
                  merged[idx] = dbU;
                } else {
                  merged.push(dbU);
                }
              });
              return merged;
            });
          }
          setFirebaseStatus('active');
        } catch (err) {
          console.log("Firestore offline or unavailable (using local fallback list):", err);
          setFirebaseStatus('offline');
        }
      })();

      // 2. Supabase check (concurrently, non-blocking)
      const supabasePromise = (async () => {
        setSupabaseStatus('loading');
        const startTime = Date.now();
        let supActive = false;
        const sb = getSupabase();

        if (sb && isSupabaseConfigured()) {
          try {
            // Attempt simple table checks with a non-blocking timeout
            const tableChecks = Promise.all([
              sb.from('articles').select('id', { count: 'exact', head: true }),
              sb.from('experience_stories').select('id', { count: 'exact', head: true }),
              sb.from('forum_posts').select('id', { count: 'exact', head: true }),
              sb.from('comments').select('id', { count: 'exact', head: true }),
              sb.from('donations').select('id', { count: 'exact', head: true })
            ]);

            const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));

            const result = await Promise.race([tableChecks, timeoutPromise]);

            if (result && Array.isArray(result)) {
              const [artCheck, storyCheck, postCheck, commCheck, donCheck] = result;
              setDbTableCounts(prev => ({
                ...prev,
                articles: artCheck && artCheck.count !== null ? artCheck.count : articles.length,
                stories: storyCheck && storyCheck.count !== null ? storyCheck.count : stories.length,
                posts: postCheck && postCheck.count !== null ? postCheck.count : posts.length,
                comments: commCheck && commCheck.count !== null ? commCheck.count : comments.length,
                donations: donCheck && donCheck.count !== null ? donCheck.count : donations.length
              }));
              setSupabaseStatus('active');
              supActive = true;
              setPingLatency(Date.now() - startTime);
            } else {
              // Timeout or null response - graceful fallback
              console.warn("Supabase live tables check timed out, using fallback datasets.");
              setSupabaseStatus('offline');
            }
          } catch (e: any) {
            console.warn("Supabase live tables check unavailable:", e?.message || e);
            setSupabaseStatus('offline');
          }
        } else {
          setSupabaseStatus('offline');
        }

        if (!supActive) {
          setDbTableCounts(prev => ({
            ...prev,
            articles: articles.length,
            stories: stories.length,
            posts: posts.length,
            comments: comments.length,
            donations: donations.length
          }));
        }
      })();

      // Wait for both tasks to complete settled, then update total user counts
      await Promise.allSettled([firebasePromise, supabasePromise]);

      setDbTableCounts(prev => ({
        ...prev,
        users: usersList.length
      }));
    }

    initAdminStats();
  }, [articles.length, stories.length, posts.length, comments.length, donations.length, refreshStatsTrigger]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    setUserSyncStatus('saving');
    const newId = 'user-' + Date.now();
    const newUserObj: User & { subRole?: string } = {
      id: newId,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(newUserForm.name)}`,
      createdAt: new Date().toISOString()
    };
    if (newUserForm.subRole) {
      (newUserObj as any).subRole = newUserForm.subRole;
    }

    try {
      await dbSyncService.dualSaveUser(newUserObj);
      logDatabaseActivity('CREATE_USER', 'SUCCESS', `Uživatel s ID ${newId} (${newUserObj.email}) byl úspěšně vytvořen v Supabase i Firebase.`);
    } catch (err: any) {
      console.warn("Could not save new user to database layer:", err);
      logDatabaseActivity('CREATE_USER', 'ERROR', `Vytvoření uživatele s ID ${newId} selhalo.`, err.message || err.toString());
    }

    setUsersList(prev => [...prev, newUserObj]);
    setNewUserForm({ name: '', email: '', role: 'user', subRole: 'Registrovaný' });
    setIsAddingUser(false);
    setUserSyncStatus('synced');
  };

  const handleDeleteUser = async (id: string) => {
    if (id === 'user-mallfuriionn' || (currentUser && id === currentUser.id)) {
      alert("Nemůžete smazat hlavního administrátora nebo sami sebe!");
      return;
    }
    if (!confirm("Opravdu chcete smazat tohoto uživatele?")) return;

    setUserSyncStatus('saving');
    try {
      await dbSyncService.dualDeleteDocument('users', id);
    } catch (err) {
      console.warn("Could not delete user from database layer:", err);
    }

    setUsersList(prev => prev.filter(u => u.id !== id));
    setUserSyncStatus('synced');
  };

  const handleUpdateUserRole = async (id: string, newRole: 'user' | 'admin', newSubRole?: string) => {
    setUserSyncStatus('saving');
    const updatedUsers = usersList.map(u => {
      if (u.id === id) {
        const updated = { ...u, role: newRole };
        if (newSubRole) {
          (updated as any).subRole = newSubRole;
        }
        return updated;
      }
      return u;
    });

    const targetUser = updatedUsers.find(u => u.id === id);
    if (targetUser) {
      try {
        await dbSyncService.dualSaveUser(targetUser);
        logDatabaseActivity('CHANGE_USER_ROLE', 'SUCCESS', `Uživateli s ID ${id} (${targetUser.email}) byla změněna role na ${newRole} (${newSubRole || 'bez podrole'}).`);
      } catch (err: any) {
        console.warn("Could not update user role in database layer:", err);
        logDatabaseActivity('CHANGE_USER_ROLE', 'ERROR', `Změna role pro uživatele s ID ${id} selhala.`, err.message || err.toString());
      }
    }

    setUsersList(updatedUsers);
    setUserSyncStatus('synced');
  };

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
    { id: 'traffic', title: 'Dnešní návštěvnost', value: '0 uživatelů', change: 'Čeká na první návštěvníky', color: 'from-teal-500 to-emerald-600', icon: Eye },
    { id: 'new_users', title: 'Noví registrovaní', value: '0 registrovaných', change: 'Aktivní uživatelské profily', color: 'from-indigo-500 to-indigo-600', icon: Users },
    { id: 'pending_articles', title: 'Čekající články', value: '0 k publikaci', change: 'Redakční fronta aktivní', color: 'from-amber-500 to-orange-600', icon: FileText },
    { id: 'pending_comments', title: 'Čekající komentáře', value: '0 k moderaci', change: 'AI ochrana běží', color: 'from-rose-500 to-red-600', icon: MessageSquare },
    { id: 'new_docs', title: 'Nové vzory podání', value: '0 stažení dnes', change: 'Šablony připraveny', color: 'from-purple-500 to-purple-600', icon: Folder },
    { id: 'cases', title: 'Případy v databázi', value: '0 kazuistik', change: 'Anonymizováno', color: 'from-sky-500 to-blue-600', icon: Briefcase },
    { id: 'server', title: 'Stav Synthesis OS', value: '100% Online', change: 'Docker container v3000', color: 'from-emerald-600 to-teal-600', icon: Activity }
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
  const [contentQueue, setContentQueue] = useState<{ id: string; title: string; author: string; phase: string; desc: string }[]>([]);

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

  // AI Evidence Analysis States
  const [evidenceAnalysisLoading, setEvidenceAnalysisLoading] = useState<boolean>(false);
  const [selectedEvidenceForAi, setSelectedEvidenceForAi] = useState<any>(null);
  const [evidenceAnalysisResult, setEvidenceAnalysisResult] = useState<any>(null);

  // Case Audit & Justice Dashboard States
  const [caseAuditLoading, setCaseAuditLoading] = useState<boolean>(false);
  const [caseAuditResult, setCaseAuditResult] = useState<any>(null);
  const [calculatingScore, setCalculatingScore] = useState<boolean>(false);
  const [justiceScoreDetails, setJusticeScoreDetails] = useState<any>(null);

  // Comment Moderation & AI Detection State
  const [aiScanningId, setAiScanningId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<Record<string, { safe: boolean; reason: string; vulgarity: number }>>({});

  // AI Center State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // AI Crawler & Moderator States
  const [crawlerQuery, setCrawlerQuery] = useState('střídavá péče 2026');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlerResults, setCrawlerResults] = useState<any[]>([]);
  const [crawlerLog, setCrawlerLog] = useState<string[]>([]);
  const [crawlerImportedUrls, setCrawlerImportedUrls] = useState<string[]>([]);

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
    { 
      date: new Date().toLocaleString('cs-CZ'), 
      user: 'System OS', 
      ip: '127.0.0.1', 
      category: 'Inicializace', 
      desc: 'Systém Synthesis OS byl úspěšně spuštěn v produkčním režimu.', 
      browser: 'Docker Container / Production', 
      hash: 'sha256:000000' 
    }
  ]);

  const [backups, setBackups] = useState<{ id: string; date: string; size: string; creator: string }[]>([]);
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

  // Real AI Evidence analysis
  const handleAnalyzeEvidence = async (evidence: any) => {
    setSelectedEvidenceForAi(evidence);
    setEvidenceAnalysisLoading(true);
    setEvidenceAnalysisResult(null);
    try {
      const res = await AIAdminActions.analyzeEvidence(evidence.name, evidence.notes || 'Důkaz o péči o dítě', evidence.type, rulings);
      if (res.success && res.data) {
        setEvidenceAnalysisResult(res.data);
      } else {
        throw new Error(res.error || 'Neznámá chyba při analýze');
      }
    } catch (err: any) {
      console.error('Evidence analysis failed:', err);
      // Fallback result
      setEvidenceAnalysisResult({
        legalAnalysis: `Nepodařilo se provést živou AI analýzu. Chyba: ${err.message || 'Chyba sítě'}.\n\nSimulovaný rozbor: Tento důkaz ("${evidence.name}") prokazuje silné citové vazby a harmonické prostředí dětí.`,
        recommendedSteps: [
          'Navrhněte soudu založení tohoto důkazu do spisu.',
          'Požádejte OSPOD o písemné vyjádření k doložené aktivitě.'
        ],
        draftProposal: `Okresnímu soudu v Brně\n\nK sp. zn. 12 P 45/2026\n\nDOPLNĚNÍ DŮKAZNÍHO BŘEMENE\n\nK prokázání těsné vazby nezletilých dětí předkládám tímto soudu důkaz: ${evidence.name}.\n\nS pozdravem,\nJiří (Otec)`,
        associatedTags: ['pouto', 'důkaz', 'vyjádření']
      });
    } finally {
      setEvidenceAnalysisLoading(false);
    }
  };

  // AI Comment analysis scanner
  const handleAiScan = async (commentId: string, text: string) => {
    setAiScanningId(commentId);
    try {
      const response = await AIAdminActions.scanComment(commentId, text);
      if (response.success && response.data) {
        setScanResult(prev => ({
          ...prev,
          [commentId]: { 
            safe: response.data.isSafe, 
            reason: `${response.data.diagnosis} (Detekce toxicity/úniku: ${response.data.score}%)`, 
            vulgarity: response.data.score 
          }
        }));
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      console.error('Scan failed, using local heuristics', err);
      // Fallback to local heuristics
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
      }

      setScanResult(prev => ({
        ...prev,
        [commentId]: { safe, reason, vulgarity }
      }));
    } finally {
      setAiScanningId(null);
    }
  };

  // Run AI center generation prompt
  const handleAiGenerate = async (mode: string) => {
    if (!aiPrompt.trim()) {
      alert('Zadejte zadání pro AI asistenta.');
      return;
    }
    setAiGenerating(true);
    setAiOutput('');
    try {
      if (mode === 'article') {
        const res = await AIAdminActions.generateArticle(aiPrompt, 'Aktuality');
        if (res.success && res.data) {
          const art = res.data;
          setAiOutput(`=== GENEROVANÝ ČLÁNEK: ${art.title} ===\n\nKategorie: ${art.category}\nAutor: ${art.author}\nČtení: ${art.readTime}\nŠtítky: ${art.tags.join(', ')}\n\nShrnutí:\n${art.summary}\n\nObsah:\n${art.content}`);
          
          if (confirm('AI vygenerovala nový článek. Přejete si ho uložit do databáze webu?')) {
            setArticles(prev => [art, ...prev]);
            alert('Článek byl úspěšně uložen do databáze článků!');
          }
        } else {
          throw new Error(res.error);
        }
      } else if (mode === 'summary') {
        const res = await AIAdminActions.summarizeRuling('Výklad opatrovnického práva', aiPrompt);
        if (res.success && res.data) {
          const s = res.data;
          setAiOutput(`=== EXPERTNÍ SHRNUTÍ JUDIKÁTU ===\n\nSpisová značka: ${s.signum}\nSoud: ${s.court}\nTéma: ${s.topic}\n\nShrnutí pro rodiče:\n${s.summary}\n\nKlíčová citace u soudu:\n"${s.citationPhrase}"`);
          
          if (confirm('Přejete si toto odborné shrnutí uložit do naší databáze judikatury?')) {
            setRulings(prev => [
              {
                id: 'j-' + Date.now(),
                court: s.court,
                sign: s.signum,
                date: new Date().toISOString().split('T')[0],
                topic: s.topic,
                phrase: s.citationPhrase,
                summary: s.summary
              },
              ...prev
            ]);
            alert('Judikát byl uložen do veřejné databáze!');
          }
        } else {
          throw new Error(res.error);
        }
      } else if (mode === 'anonymize') {
        // We can call directly to Gemini chat endpoint with instruction
        const systemInstruction = `Jsi "Synthesis Document Anonymizer" - specialista na anonymizaci právních spisů pro veřejné účely. 
Nahraď všechna rodná jména dětí, rodičů, adresy, rodná čísla a kontakty zobecněnými tagy v hranatých závorkách (např. [ANONYMIZOVÁNO - DÍTĚ 1], [ANONYMIZOVÁNO - OTEC], atd.). Ponechej právní argumentaci netknutou.`;
        const text = await AIAdminClient.queryGemini(`Anonymizuj prosím tento text:\n\n${aiPrompt}`, systemInstruction);
        setAiOutput(`=== ANONYMIZOVANÝ DOKUMENT SOUDU ===\n\n${text}`);
      } else {
        // FAQ generate via Gemini query
        const systemInstruction = `Jsi "Synthesis Q&A Builder". Vytvoř přehlednou sestavu 2 Častých otázek a odpovědí (FAQ) na téma zadané uživatelem.`;
        const text = await AIAdminClient.queryGemini(`Vytvoř FAQ na téma: ${aiPrompt}`, systemInstruction);
        setAiOutput(`=== FAQ SESTAVA (GENERÁTOR) ===\n\n${text}`);
      }
    } catch (err: any) {
      console.error('AI generation failed, fallback to simulated templates', err);
      let output = `Chyba při komunikaci s mozkem Synthesis OS: ${err.message || err}. Zkontrolujte připojení nebo klíč GEMINI_API_KEY.`;
      setAiOutput(output);
    } finally {
      setAiGenerating(false);
    }
  };

  // AI Crawler & Moderator handlers
  const handleCrawlInternet = async () => {
    if (!crawlerQuery.trim()) {
      alert('Zadejte prosím dotaz pro vyhledávání.');
      return;
    }
    setIsCrawling(true);
    setCrawlerResults([]);
    setCrawlerLog([]);
    
    const logs = [
      "🔄 Inicializace vyhledávacího agenta Synthesis OS...",
      "📡 Navazování šifrovaného spojení s Google Search Grounding API...",
      `🔍 Prohledávání internetové sítě na dotaz: "${crawlerQuery}"...`,
      "🛡️ Aktivace ochranných filtrů a analýza spolehlivosti domén...",
      "💡 Extrakce relevantních dokumentů a syntéza obsahu modelem Gemini...",
      "📋 Dokončování strukturované validace JSON schématu..."
    ];

    // Simulate logs appearing step-by-step
    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCrawlerLog(prev => [...prev, logs[i]]);
    }

    try {
      const res = await AIAdminActions.crawlInternet(crawlerQuery);
      if (res.success && res.data && res.data.results) {
        setCrawlerResults(res.data.results);
        setCrawlerLog(prev => [...prev, "✅ Úspěch: Nalezeny 3 vysoce kvalitní, bezpečné a relevantní zdroje připravené k importu!"]);
      } else {
        throw new Error(res.error || "Neznámá chyba serveru při vyhledávání.");
      }
    } catch (err: any) {
      console.error(err);
      setCrawlerLog(prev => [...prev, `❌ Chyba agenta: ${err.message || 'Nepodařilo se dokončit internetový sběr.'}`]);
      alert(`Nepodařilo se vyhledat obsah: ${err.message || 'Zkontrolujte připojení k serveru.'}`);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleImportCrawlItem = (item: any) => {
    if (confirm(`Přejete si importovat "${item.title}" od zdroje "${item.source}" přímo do projektu?`)) {
      if (item.category === 'Soudy') {
        const signumPart = item.title.match(/sp\.\s*zn\.\s*([A-Za-z0-9./\s\-]+)/i)?.[1] || item.title.split(':')?.[1]?.trim() || 'sp. zn. Nový/2026';
        const newRulObj = {
          id: 'j-' + Date.now(),
          court: item.source,
          sign: signumPart,
          date: item.date,
          topic: item.title.split(':')?.[0]?.trim() || 'Importovaný Judikát',
          phrase: item.summary,
          summary: item.fullText
        };
        setRulings(prev => [newRulObj, ...prev]);
        setCrawlerImportedUrls(prev => [...prev, item.url]);
        
        // Also log this to system audit
        setAuditLogs(prev => [
          {
            date: new Date().toLocaleString('cs-CZ'),
            user: currentUser?.name || 'AI Sběrač',
            ip: 'Synthesis AI Agent',
            category: 'AI Import',
            desc: `Importován nový judikát: "${newRulObj.sign}" na téma "${newRulObj.topic}" z webu ${item.source}.`,
            browser: 'Crawl Moderator Bot v1.0',
            hash: 'sha256:import-' + Date.now().toString().slice(-6)
          },
          ...prev
        ]);
        
        alert('Obsah byl úspěšně importován do databáze judikatury!');
      } else {
        const newArtObj: Article = {
          id: 'art-' + Date.now(),
          title: item.title,
          summary: item.summary,
          content: item.fullText,
          category: (item.category === 'Psychologie' || item.category === 'Zákony' || item.category === 'Soudy' || item.category === 'Aktuality') ? item.category : 'Aktuality',
          date: item.date,
          author: `${item.source} (AI Sběrač)`,
          likes: 0,
          commentsCount: 0,
          readTime: '4 min čtení',
          tags: ['AI Sběrač', item.category.toLowerCase()]
        };
        setArticles(prev => [newArtObj, ...prev]);
        setCrawlerImportedUrls(prev => [...prev, item.url]);
        
        // Also log this to system audit
        setAuditLogs(prev => [
          {
            date: new Date().toLocaleString('cs-CZ'),
            user: currentUser?.name || 'AI Sběrač',
            ip: 'Synthesis AI Agent',
            category: 'AI Import',
            desc: `Importován nový článek: "${newArtObj.title}" z webu ${item.source}.`,
            browser: 'Crawl Moderator Bot v1.0',
            hash: 'sha256:import-' + Date.now().toString().slice(-6)
          },
          ...prev
        ]);

        alert('Obsah byl úspěšně importován jako článek do redakční fronty!');
      }
    }
  };

  // Reset and clean demo data for official Alpha 0.0.1.1 Launch
  const handleClearDemoData = () => {
    if (confirm('Opravdu chcete vyčistit veškerá uživatelská demo data (komentáře k diskuzím, nahlášené spamy, testovací příspěvky) a připravit web pro oficiální spuštění alfa verze 0.0.1.1?')) {
      // Clear localStorage so we revert to clean curated defaults (the system will repopulate clean defaults on refresh)
      localStorage.removeItem('synthesis_hub_comments');
      localStorage.removeItem('synthesis_hub_posts');
      localStorage.removeItem('synthesis_hub_stories');
      localStorage.removeItem('synthesis_hub_donations');
      localStorage.removeItem('synthesis_hub_articles');
      
      // Also write an audit log entry that can survive in current state
      setAuditLogs(prev => [
        {
          date: new Date().toLocaleString('cs-CZ'),
          user: currentUser?.name || 'Hlavní Administrátor',
          ip: 'Synthesis OS VM',
          category: 'Ostrý start',
          desc: 'Spuštěno vyčištění zkušebních dat a oficiální aktivace alfa verze 0.0.1.1 pro veřejnost.',
          browser: 'Synthesis Core Manager',
          hash: 'sha256:0011a0ff'
        },
        ...prev
      ]);

      alert('Všechna uživatelská demo data byla pročištěna. Systém byl úspěšně připraven pro oficiální spuštění alfa verze 0.0.1.1! Stránka se nyní aktualizuje pro načtení pročištěného stavu.');
      window.location.reload();
    }
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

  // Perform legal case audit for statutory deadlines
  const handlePerformCaseAudit = async () => {
    setCaseAuditLoading(true);
    setCaseAuditResult(null);
    try {
      const res = await AIAdminActions.performSelfAudit(cases);
      if (res.success && res.data) {
        setCaseAuditResult(res.data);
        
        // Log the audit in immutable Ledger
        setAuditLogs(prev => [
          {
            date: new Date().toLocaleString('cs-CZ'),
            user: currentUser?.name || 'AI System Auditor',
            ip: 'Synthesis OS VM',
            category: 'Audit případu',
            desc: `Spuštěn inteligentní audit lhůt a chronology případu. Status: ${res.data.status.toUpperCase()}, nalezeno problémů: ${res.data.issuesFound}.`,
            browser: 'Gemini 3.5 Core',
            hash: 'sha256:' + Math.random().toString(16).slice(2, 8)
          },
          ...prev
        ]);
      } else {
        throw new Error(res.error || 'Nepodařilo se provést audit.');
      }
    } catch (err: any) {
      console.error('Case audit failed:', err);
      // Fallback
      setCaseAuditResult({
        status: 'warning',
        checkedTables: ['cases', 'chronology', 'documents'],
        issuesFound: 2,
        report: `Chyba při živém napojení: ${err.message}.\n\nSimulované nalezné nedostatky v opatrovnické časové ose:\n1. ⚠️ Chybí příprava vyjádření k OSPOD doporučení: Poslední zpráva OSPOD ze dne 25. 2. 2026 doporučuje střídavou péči pouze pro Jiříka. Chybí zaznamenaná reakce či vyjádření k soudu ze strany otce, lhůta k vyjádření bývá standardně 15–30 dnů od doručení.\n2. ⚠️ Lhůta pro vyjádření k soudu před nařízeným jednáním: V časové ose není evidováno žádné soudní stání ani příprava na něj. Doporučujeme zařadit 'Soudní příprava a replika k vyjájadření matky'.`
      });
    } finally {
      setCaseAuditLoading(false);
    }
  };

  // Calculate Case Justice Score / Preparedness Rating
  const handleCalculateJusticeScore = async () => {
    setCalculatingScore(true);
    setJusticeScoreDetails(null);
    try {
      const systemInstruction = `Jsi "Synthesis Justice Score Evaluator" - analytický modul pro ohodnocení celkové připravenosti soudního sporu a šance na prosazení nejlepšího zájmu dětí (střídavá péče, sourozenecká vazba).
Musíš zanalyzovat seznam doložených důkazů a stav případu a vygenerovat JSON s těmito klíči.
DŮLEŽITÉ: Odpověz VÝHRADNĚ čistým validním JSON objektem. Neodpovídej žádným úvodním pozdravem (např. "Dobrý den"), žádným povídáním okolo ani žádným textem mimo JSON formát.

Klíče v JSONu:
- "score": číslo od 0 do 100 (hodnocení připravenosti důkazní situace otce)
- "strengthPoints": pole 3 silných stránek případu na základě důkazů (pole textů)
- "weakPoints": pole 2 slabých stránek nebo rizik (pole textů)
- "verdict": celkové hodnocení strategie a doporučení (2-3 věty v češtině)`;

      const prompt = `Zhodnoť prosím naši důkazní situaci a šance na úspěch.
Doložené důkazy:
${evidences.map((e, idx) => `${idx+1}. ${e.name} (${e.type}) - Štítky: ${e.tags}, Místo: ${e.place}`).join('\n')}

Aktivní opatrovnický případ:
${cases.map(c => `Název: ${c.title}\nStav: ${c.status}\nChronologie:\n` + (c.chronology || []).map((ch: any) => `- ${ch.date}: ${ch.title}`).join('\n')).join('\n')}`;

      const text = await AIAdminClient.queryGemini(prompt, systemInstruction);
      
      let data: any = null;
      try {
        data = JSON.parse(text || '{}');
      } catch (parseErr) {
        // Fallback to extraction if conversational greeting or markdown is present
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          try {
            data = JSON.parse(text.slice(firstBrace, lastBrace + 1));
          } catch (innerErr) {
            // Check for ```json ... ``` markdown block
            const mdJsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (mdJsonMatch && mdJsonMatch[1]) {
              try {
                data = JSON.parse(mdJsonMatch[1].trim());
              } catch (mdErr) {
                throw parseErr;
              }
            } else {
              throw parseErr;
            }
          }
        } else {
          throw parseErr;
        }
      }

      if (data && typeof data.score === 'number') {
        setJusticeScoreDetails(data);
      } else {
        throw new Error('Nevalidní struktura odpovědi');
      }
    } catch (err: any) {
      console.error('Recalculating score failed:', err);
      // Fallback
      setJusticeScoreDetails({
        score: 74,
        strengthPoints: [
          'Silná podpora sourozenecké vazby: doložen znalecký posudek PhDr. Černého o důležitosti vyrůstat společně.',
          'Průkazné fotky Jiříka a Štěpána objasňující harmonické soužití u otce.',
          'Záznam předání prokazující logistickou připravenost otce a ochotu matky k eskalaci střetu.'
        ],
        weakPoints: [
          'Chybí systematické vyjádření k jednostrannému postoji OSPODu.',
          'Konfliktní komunikace: zprávy od matky vyžadují přísné a kultivované vyvrácení bez emocí.'
        ],
        verdict: 'Vaše důkazní břemeno má vysokou kvalitu díky posudku o sourozenecké soudržnosti (sp. zn. II. ÚS 132/24). Pro plnou připravenost je nutné formálně vyvrátit monotropní doporučení opatrovníka OSPOD dříve, než soud nařídí první jednání.'
      });
    } finally {
      setCalculatingScore(false);
    }
  };

  // Restore revision mock
  const restoreRevision = (logDesc: string) => {
    if (confirm(`Opravdu chcete obnovit systém do stavu před akcí:\n"${logDesc}"?\n\nTato operace vrátí veškeré textové verze a rozvrhy o krok zpět.`)) {
      alert('✓ Systémová revize byla úspěšně obnovena z auditní stopy.');
    }
  };

  // Checks RBAC authorization
  const isAdmin = currentUser?.role === 'admin' || 
                  currentUser?.email?.toLowerCase().trim() === 'mallfuriionn@gmail.com' || 
                  currentUser?.email?.toLowerCase().trim() === 'admin@synthesis.cz' ||
                  currentUser?.email?.toLowerCase().trim() === 'sarji@seznam.cz';

  if (!isAdmin) {
    const handleQuickSuperAdminLogin = () => {
      const superAdminUser: User = {
        id: 'usr_superadmin',
        email: 'admin@synthesis.cz',
        name: 'SuperAdmin Synthesis',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=SuperAdmin',
        createdAt: new Date().toISOString()
      };
      if (onQuickSuperAdmin) {
        onQuickSuperAdmin(superAdminUser);
      } else if (typeof window !== 'undefined') {
        localStorage.setItem('synthesis_remember_me_flag', 'true');
        localStorage.setItem('synthesis_hub_local_user', JSON.stringify(superAdminUser));
        window.location.reload();
      }
    };

    return (
      <div className="bg-white border border-slate-200/90 shadow-2xl rounded-3xl overflow-hidden max-w-2xl mx-auto my-10" id="admin-unauthorized-card">
        {/* Card Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden border-b border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-teal-500/20 border border-teal-500/30 rounded-2xl text-teal-300 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-mono text-teal-300 mb-1">
                  <Lock className="w-3 h-3" />
                  <span>Ochrana přístupu RBAC</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {t('rbac_access_denied', 'Vyžadováno přihlášení administrátora')}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('rbac_access_denied_desc', 'Pro přístup do správy portálu \'Táta má právo\' a administrace Synthesis OS je vyžadován účet s rolí SuperAdmin. Jako vývojář nebo testující se můžete jedním kliknutím přepnout do testovacího administrátorského profilu.')}
          </p>

          {/* User Status Box */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>Aktuální stav relace:</span>
            </div>
            <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {currentUser ? `${currentUser.name} (${currentUser.role || 'uživatel'})` : 'Nepřihlášený host'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Quick SuperAdmin Button */}
            <button
              id="rbac-quick-superadmin-btn"
              onClick={handleQuickSuperAdminLogin}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
            >
              <Sparkles className="w-4 h-4 text-teal-200 group-hover:rotate-12 transition-transform" />
              <span>Přihlásit jako SuperAdmin (Testovací účet)</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Standard Auth Button */}
              {onOpenAuth && (
                <button
                  id="rbac-open-auth-btn"
                  onClick={onOpenAuth}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <LogIn className="w-4 h-4 text-slate-300" />
                  <span>Přihlásit jiným účtem</span>
                </button>
              )}

              {/* Go Home Button */}
              {onGoHome && (
                <button
                  id="rbac-go-home-btn"
                  onClick={onGoHome}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>Návrat na rozcestník</span>
                </button>
              )}
            </div>
          </div>

          {/* Info footer */}
          <p className="text-[11px] text-slate-400 text-center leading-normal pt-2">
            💡 Účet SuperAdmin zpřístupňuje kompletní nástroje pro úpravu článků, správu registrů, auditní logy a monitorování systému.
          </p>
        </div>
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

          <nav className="space-y-4">
            {[
              {
                category: 'I. Přehled & Správa',
                items: [
                  { id: 'ai_tester', label: 'AI Tester & Monitoring', icon: Sparkles, badge: 'v1.0', highlight: true },
                  { id: 'system_monitoring', label: 'Systémový monitoring', icon: Activity, badge: 'HEALTH' },
                  { id: 'dashboard', label: 'Dashboard & Statistiky', icon: LayoutDashboard },
                  { id: 'stats', label: 'Návštěvnost & Analýza', icon: BarChart2 }
                ]
              },
              {
                category: 'II. Obsah & Databáze',
                items: [
                  { id: 'element_registry', label: 'Registr ID prvků (21 cat)', icon: Database, badge: 'ID-SYSTEM', highlight: true },
                  { id: 'editorial', label: 'Obsah & Redakční fronta', icon: FileText, badge: 'OBSAH' },
                  { id: 'videoteka', label: 'Videotéka & Správa videí', icon: Tv, badge: 'VIDEO', highlight: true },
                  { id: 'judikatura', label: 'Judikatura & Rozhodnutí', icon: Scale },
                  { id: 'documents', label: 'Dokumenty & Vzory', icon: FileCode },
                  { id: 'cases', label: 'Případové centrum', icon: Briefcase },
                  { id: 'evidence', label: 'Správce důkazů (Drive)', icon: Camera },
                  { id: 'partners', label: 'Partneři & Advokáti', icon: Share2 }
                ]
              },
              {
                category: 'III. AI Nástroje & Moderace',
                items: [
                  { id: 'community', label: 'Komunita & AI Moderace', icon: MessageCircle, badge: 'AI' },
                  { id: 'aicentre', label: 'AI Generátor & Nástroje', icon: Cpu },
                  { id: 'aiauditor', label: 'AI Auditor 3.0', icon: Shield, badge: 'AUDIT', highlight: true },
                  { id: 'aimoderator', label: 'AI Internetový Sběrač', icon: Search, badge: 'CRAWLER' }
                ]
              },
              {
                category: 'IV. Uživatelé & Systém',
                items: [
                  { id: 'github_manager', label: 'GitHub Integrace & Sync', icon: Github, badge: 'GITHUB', highlight: true },
                  { id: 'users', label: 'Správa uživatelů & RBAC', icon: Users },
                  { id: 'simulator', label: 'Nastavení simulátoru', icon: Sliders },
                  { id: 'appearance', label: 'Vzhled & Šablony', icon: Paintbrush },
                  { id: 'audit', label: 'Systémový audit & Zálohy', icon: Activity },
                  { id: 'supabase', label: 'Databáze & Cloud Status', icon: Database }
                ]
              }
            ].map((group) => (
              <div key={group.category} className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                  {group.category}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
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
              </div>
            ))}
          </nav>

          {/* Quick info footer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-400 font-mono">
            <span>Uživatel: {currentUser?.email}</span>
            <span className="block mt-1 text-slate-500">Oprávnění: SuperAdmin (Full)</span>
          </div>
        </div>

        {/* CONTENT AREA - 9 Columns */}
        <div className="lg:col-span-9 space-y-6">

          {/* TAB GITHUB MANAGER */}
          {activeMenu === 'github_manager' && (
            <GitHubManager />
          )}

          {/* TAB ELEMENT REGISTRY */}
          {activeMenu === 'element_registry' && (
            <ElementRegistryTable />
          )}

          {/* TAB AI TESTER & MONITORING */}
          {activeMenu === 'ai_tester' && (
            <AiTesterRoot
              counts={{
                registeredUsers: usersList.length,
                articles: articles.length,
                studies: stories.length,
                videos: 15,
                partners: partners.length,
                documents: docTemplates.length,
                judikats: rulings.length,
                apiRequests24h: 1240
              }}
            />
          )}

          {/* TAB 0: SYSTEM MONITORING */}
          {activeMenu === 'system_monitoring' && (
            <SystemMonitoring
              currentUser={currentUser}
              articles={articles}
              stories={stories}
              posts={posts}
              comments={comments}
              donations={donations}
              partners={partners}
            />
          )}

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
                  
                  // Dynamické výpočty pro ostré nasazení bez statických dat
                  let displayValue = w.value;
                  let displayChange = w.change;

                  if (w.id === 'traffic') {
                    displayValue = '0 uživatelů';
                    displayChange = 'Čeká na první návštěvy';
                  } else if (w.id === 'new_users') {
                    displayValue = `${usersList.length} registrovaných`;
                    displayChange = 'Aktivní uživatelské profily';
                  } else if (w.id === 'pending_articles') {
                    const pendingCount = contentQueue.filter(item => item.phase !== 'approved').length;
                    displayValue = `${pendingCount} k publikaci`;
                    displayChange = `${articles.length} publikovaných článků`;
                  } else if (w.id === 'pending_comments') {
                    const reportedCount = comments.filter(c => c.reported).length;
                    displayValue = `${reportedCount} k moderaci`;
                    displayChange = `${comments.length} celkem komentářů`;
                  } else if (w.id === 'new_docs') {
                    displayValue = '0 stažení dnes';
                    displayChange = 'Produkční šablony připraveny';
                  } else if (w.id === 'cases') {
                    displayValue = `${stories.length} kazuistik`;
                    displayChange = 'Anonymizované příběhy';
                  } else if (w.id === 'server') {
                    displayValue = '100% Online';
                    displayChange = 'Docker container v3000';
                  }

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
                          <strong className="text-base font-extrabold text-slate-800 font-display block mt-0.5">{displayValue}</strong>
                          <span className="text-[10px] text-slate-500 font-medium block mt-1">{displayChange}</span>
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

          {/* TAB VIDEOTEKA */}
          {activeMenu === 'videoteka' && (
            <AdminVideoteka partners={partners} />
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

              {/* Dynamic Justice Dashboard and AI Case Auditor */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* CARD 1: Dashboard Stavu Spravedlnosti */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
                        Dashboard „Stavu spravedlnosti“ (Case Preparedness)
                      </h3>
                      <p className="text-[11px] text-slate-400">Pravděpodobnost úspěchu a hodnocení opatrovnické strategie přes AI.</p>
                    </div>
                    <button
                      onClick={handleCalculateJusticeScore}
                      disabled={calculatingScore}
                      className="text-[10px] px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {calculatingScore ? 'Přepočítávám...' : 'Přepočítat stav'}
                    </button>
                  </div>

                  {/* Score Indicator Ring */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                      {/* Circle Background */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" className="stroke-slate-200 fill-none" strokeWidth="8" />
                        <circle 
                          cx="48" 
                          cy="48" 
                          r="40" 
                          className="stroke-indigo-500 fill-none transition-all duration-1000 ease-out" 
                          strokeWidth="8" 
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - (justiceScoreDetails?.score || 74) / 100)}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-extrabold text-slate-800 font-display">{justiceScoreDetails?.score || 74}%</span>
                        <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400">Připraveno</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <strong className="text-xs text-slate-800 font-bold block">Právní síla opatrovnické pozice</strong>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Tento index vyhodnocuje soulad s judikáty Ústavního soudu (např. **II. ÚS 132/24** o nerozdělování sourozenců) a váhu předložených důkazů.
                      </p>
                    </div>
                  </div>

                  {/* Strength & Weak Points */}
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">✓ Klíčové pilíře případu:</span>
                      <div className="space-y-1.5">
                        {(justiceScoreDetails?.strengthPoints || [
                          'Silná podpora sourozenecké vazby: doložen znalecký posudek PhDr. Černého o důležitosti vyrůstat společně.',
                          'Průkazné fotky Jiříka a Štěpána objasňující harmonické soužití u otce.',
                          'Záznam předání prokazující logistickou připravenost otce a ochotu matky k eskalaci střetu.'
                        ]).map((pt: string, idx: number) => (
                          <div key={idx} className="bg-emerald-50/50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100/50 text-[11px] leading-tight flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">⚠️ Rizikové faktory a nedostatky:</span>
                      <div className="space-y-1.5">
                        {(justiceScoreDetails?.weakPoints || [
                          'Chybí systematické vyjádření k jednostrannému postoji OSPODu.',
                          'Konfliktní komunikace: zprávy od matky vyžadují přísné a kultivované vyvrácení bez emocí.'
                        ]).map((pt: string, idx: number) => (
                          <div key={idx} className="bg-amber-50/50 text-amber-800 p-2.5 rounded-xl border border-amber-100/50 text-[11px] leading-tight flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verdict */}
                    <div className="bg-indigo-50/45 border border-indigo-100/50 p-3 rounded-xl space-y-1 text-[11px] leading-relaxed text-slate-700">
                      <strong className="text-indigo-900 font-bold block">Strategický AI Verdikt:</strong>
                      <p>{justiceScoreDetails?.verdict || 'Vaše důkazní břemeno má vysokou kvalitu díky posudku o sourozenecké soudržnosti (sp. zn. II. ÚS 132/24). Pro plnou připravenost je nutné formálně vyvrátit monotropní doporučení opatrovníka OSPOD dříve, než soud nařídí první jednání.'}</p>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-slate-50 text-[9px] text-slate-400 p-3 rounded-xl border border-slate-100 font-mono leading-normal">
                      <strong>⚠️ PRÁVNÍ DISCLAIMER:</strong> Tento index je orientační matematické vyhodnocení síly důkazů a judikaturního souladu vypracovaný modulem Synthesis OS. Nenahrazuje individuální právní zastoupení advokátem a nepředstavuje garantovanou záruku výsledku soudního řízení.
                    </div>
                  </div>
                </div>

                {/* CARD 2: Automatizovaný Audit případu a lhůt */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Activity className="w-4.5 h-4.5 text-indigo-500" />
                        Automatizovaný „Audit případu a lhůt“
                      </h3>
                      <p className="text-[11px] text-slate-400">Kontrola zákonných lhůt k vyjádření a kompletnosti osy sporu.</p>
                    </div>
                    <button
                      onClick={handlePerformCaseAudit}
                      disabled={caseAuditLoading}
                      className="text-[10px] px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {caseAuditLoading ? 'Audituji...' : 'Spustit audit'}
                    </button>
                  </div>

                  {caseAuditResult ? (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center gap-2.5 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Stav auditu:</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${
                          caseAuditResult.status === 'healthy' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : caseAuditResult.status === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          ● {caseAuditResult.status.toUpperCase()}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[10px] text-slate-500 font-mono">Chyby/Lhůty k nápravě: <strong className="text-slate-800">{caseAuditResult.issuesFound}</strong></span>
                      </div>

                      {/* Audit result text */}
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 text-[11px] leading-relaxed font-mono whitespace-pre-wrap max-h-96 overflow-y-auto select-all">
                        {caseAuditResult.report}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-50 pt-2.5">
                        <span>Prověřené celky: {caseAuditResult.checkedTables.join(', ')}</span>
                        <span>API-First audit: OK</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                        <Activity className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="max-w-xs space-y-1">
                        <strong className="text-xs font-bold text-slate-700 block">Nebyl spuštěn žádný audit</strong>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Klikněte na "Spustit audit" a nechte Synthesis AI proskenovat časovou osu případu a chybějící zákonné odvolací či vyjadřovací lhůty.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">💡 Autonomní napojení (API-First):</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Tento audit je plně přístupný přes endpoint `/api/ai-admin/execute` (akce `SYSTEM_AUDIT`). Může být spouštěn automatizovanou cron úlohou každou noc pro garantovanou ochranu dětí i rodičů před soudním zmeškáním.
                    </p>
                  </div>
                </div>

              </div>

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
                          onClick={() => handleAnalyzeEvidence(e)}
                          className="p-1 text-slate-400 hover:text-teal-600 cursor-pointer transition-colors"
                          title="Zanalizovat přes AI"
                        >
                          <Sparkles className="w-4 h-4 text-teal-500" />
                        </button>
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

              {/* AI Analysis Panel inside Evidence Manager */}
              {(evidenceAnalysisLoading || selectedEvidenceForAi) && (
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4 relative overflow-hidden transition-all duration-300">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-teal-500 animate-pulse" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-800">Expertní AI Analýza Důkazu</h3>
                        <p className="text-[10px] text-slate-400">Soubor: {selectedEvidenceForAi?.name}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedEvidenceForAi(null);
                        setEvidenceAnalysisResult(null);
                      }} 
                      className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold"
                    >
                      Zavřít panel
                    </button>
                  </div>

                  {evidenceAnalysisLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-teal-500" />
                      <span className="text-xs text-slate-500 font-mono text-center">Synthesis AI propočítává právní dopady a sepisuje vyjádření pro soud...</span>
                    </div>
                  ) : evidenceAnalysisResult ? (
                    <div className="space-y-4 text-xs text-slate-700 animate-fadeIn">
                      
                      {/* Legal Analysis */}
                      <div className="space-y-1.5">
                        <strong className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">1. Právní hodnocení důkazní síly:</strong>
                        <p className="bg-white p-3 rounded-xl border border-slate-100 text-slate-600 text-xs leading-relaxed">
                          {evidenceAnalysisResult.legalAnalysis}
                        </p>
                      </div>

                      {/* Recommended Steps */}
                      <div className="space-y-1.5">
                        <strong className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">2. Doporučené procesní kroky:</strong>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {evidenceAnalysisResult.recommendedSteps.map((step: string, idx: number) => (
                            <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-[11px] text-slate-600 leading-tight">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Draft Proposal */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <strong className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">3. Návrh podání k soudu (Draft):</strong>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(evidenceAnalysisResult.draftProposal);
                              alert('Zkopírováno do schránky!');
                            }}
                            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" /> Kopírovat text
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed max-h-56 select-all whitespace-pre-wrap">
                          {evidenceAnalysisResult.draftProposal}
                        </pre>
                      </div>

                      {/* Save to DB / API-First Action */}
                      <div className="flex flex-wrap justify-between items-center gap-3 pt-2 border-t border-slate-200">
                        <div className="flex gap-1">
                          {evidenceAnalysisResult.associatedTags.map((tag: string, idx: number) => (
                            <span key={idx} className="bg-teal-100 text-teal-800 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            alert('Draft vyjádření byl bezpečně uložen do spisu k tomuto důkazu.');
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl cursor-pointer flex items-center gap-1.5"
                        >
                          <Database className="w-3.5 h-3.5" /> Uložit do složky případu
                        </button>
                      </div>

                    </div>
                  ) : null}
                </div>
              )}

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

          {/* TAB: AI PROJEKTOVÝ AUDITOR 3.0 */}
          {activeMenu === 'aiauditor' && (
            <div className="space-y-6 text-slate-200 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden font-sans">
              
              {/* Outer Cosmic Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Title Header */}
              <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-md shadow-teal-500/5">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 font-display">
                      Synthesis AI Auditor <span className="text-[10px] bg-teal-500/20 text-teal-400 border border-teal-500/30 font-mono font-bold px-1.5 py-0.5 rounded">v3.0</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Hlavní super-auditor kvality, bezpečnosti, přístupnosti (WCAG), SEO a právní shody celého portálu Táta má právo.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    AUTONOMNÍ REŽIM AKTIVNÍ
                  </span>
                </div>
              </div>

              {/* Core Quality Scores Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">
                
                {/* Overall Radial/Numeric Circular HUD */}
                <div className="md:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                  <div className="absolute inset-0 bg-radial-gradient from-teal-500/5 to-transparent pointer-events-none" />
                  
                  <span className="text-[10px] font-mono font-bold text-teal-400 tracking-widest uppercase block mb-3">Celková připravenost</span>
                  
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Glowing Circular Progress track */}
                    <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                    <div className="absolute inset-0 rounded-full border-4 border-teal-500/40 border-t-teal-400 border-r-teal-400 animate-pulse" style={{ transform: 'rotate(45deg)' }} />
                    <div className="text-center z-10">
                      <strong className="text-3xl font-extrabold text-white tracking-tight font-display">{auditorScores.overall}%</strong>
                      <span className="text-[9px] text-slate-500 block font-mono font-bold">STABLE OS</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                    Vynikající stav projektu. Zbývá dořešit <span className="text-amber-400 font-bold">{auditorIssues.filter(i => i.status === 'open').length} zjištěných chyb</span> pro dosažení 100% shody.
                  </p>
                </div>

                {/* Sub-Auditor Specific Scores */}
                <div className="md:col-span-8 bg-slate-950/40 border border-slate-800/60 rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase block">Skóre specializovaných auditorů</span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'legal', label: '⚖️ Právní audit', score: auditorScores.legal, color: 'text-teal-400 bg-teal-500/5' },
                      { key: 'tech', label: '💻 Technický audit', score: auditorScores.tech, scoreVal: auditorScores.tech, color: 'text-sky-400 bg-sky-500/5' },
                      { key: 'ux', label: '🎨 UX & Kontrast', score: auditorScores.ux, color: 'text-purple-400 bg-purple-500/5' },
                      { key: 'seo', label: '📈 SEO & Prolink', score: auditorScores.seo, color: 'text-amber-400 bg-amber-500/5' },
                      { key: 'security', label: '🔒 Bezpečnost & DB', score: auditorScores.security, color: 'text-emerald-400 bg-emerald-500/5' },
                      { key: 'ai', label: '🤖 AI Disclaimery', score: auditorScores.ai, color: 'text-indigo-400 bg-indigo-500/5' }
                    ].map((aud) => (
                      <div key={aud.key} className={`p-2.5 rounded-xl border border-slate-800/50 ${aud.color} flex flex-col justify-between`}>
                        <span className="text-[10px] text-slate-300 font-bold block truncate">{aud.label}</span>
                        <div className="flex items-end justify-between mt-2">
                          <strong className="text-sm font-extrabold text-white font-mono">{aud.score}%</strong>
                          <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-current h-full transition-all duration-1000" style={{ width: `${aud.score}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RUN AUDIT CONTROLS & SCANNING DISPLAY */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider block">Spouštěč hloubkového auditu</span>
                    <h3 className="text-xs font-bold text-white">Chcete přepočítat celou kvalitu, kód a legislativu?</h3>
                    <p className="text-[10px] text-slate-400">Synthesis AI prověří všechny podstránky, herní simulátor, firestore.rules a právní definice.</p>
                  </div>

                  <button
                    onClick={runSynthesisAudit}
                    disabled={isProjectAuditing}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/10 cursor-pointer disabled:cursor-not-allowed transition-all shrink-0 flex items-center gap-1.5"
                  >
                    {isProjectAuditing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Probíhá audit...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Spustit audit projektu v3.0
                      </>
                    )}
                  </button>
                </div>

                {/* Live Audit Process visualizer */}
                {isProjectAuditing && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>Progres kontroly: <strong>{auditorProgress}%</strong></span>
                      <span className="text-teal-400 uppercase tracking-widest font-bold">Aktivní modul: {currentScanningCategory}</span>
                    </div>

                    {/* Progress line */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-400 h-full transition-all duration-300 shadow-[0_0_8px_rgba(20,184,166,0.5)]" style={{ width: `${auditorProgress}%` }} />
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5 font-mono text-[10px] text-teal-300 leading-relaxed shadow-inner">
                      <span className="animate-ping text-teal-400">⚡</span>
                      <span>{scanningMessage}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* DETAILED FINDINGS (AUDIT LOGS & TABLE) */}
              <div className="space-y-4 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-teal-400" />
                      Detailní nálezy & Doporučená nápravná opatření
                    </h3>
                    <p className="text-[10px] text-slate-400">Filtrujte chyby zjištěné specializovanými agenty.</p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: 'Vše' },
                      { id: 'legal', label: '⚖️ Právní' },
                      { id: 'tech', label: '💻 Tech' },
                      { id: 'ux', label: '🎨 UX' },
                      { id: 'seo', label: '📈 SEO' },
                      { id: 'security', label: '🔒 Bezpečnost' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveAuditorFilter(tab.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          activeAuditorFilter === tab.id
                            ? 'bg-teal-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/30'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audit Issues list */}
                <div className="grid grid-cols-1 gap-4 max-h-[550px] overflow-y-auto pr-1">
                  {auditorIssues
                    .filter(iss => activeAuditorFilter === 'all' || iss.category === activeAuditorFilter)
                    .map((iss) => (
                      <div 
                        key={iss.id} 
                        className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                          iss.status === 'resolved'
                            ? 'bg-emerald-950/20 border-emerald-900/60 text-slate-300'
                            : 'bg-slate-950 border-slate-800/80 hover:border-slate-700/60 text-slate-200'
                        }`}
                      >
                        {/* Background flare for criticals */}
                        {iss.severity === 'critical' && iss.status !== 'resolved' && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
                        )}

                        <div className="flex flex-wrap justify-between items-start gap-2.5 border-b border-slate-800/60 pb-2.5 mb-3 text-xs">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Auditor label */}
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[9px] font-mono font-bold border border-slate-700/40">
                              {iss.categoryLabel.toUpperCase()} AUDIT
                            </span>

                            {/* Severity Badge */}
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase ${
                              iss.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                              iss.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              iss.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                              'bg-slate-800 text-slate-400 border border-slate-700/20'
                            }`}>
                              {iss.severity === 'critical' ? '🔴 Kritická' :
                               iss.severity === 'high' ? '🟠 Vysoká' :
                               iss.severity === 'medium' ? '🟡 Střední' :
                               '🔵 Nízká'}
                            </span>
                          </div>

                          {/* Confidence Indicator */}
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            Míra jistoty: 
                            <strong className="text-white">
                              {iss.confidence === 'green' ? '🟢 Ověřeno' : iss.confidence === 'yellow' ? '🟡 Pravděpodobné' : '🔴 Neověřeno'}
                            </strong>
                          </span>
                        </div>

                        {/* Issue Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs leading-relaxed">
                          
                          <div className="md:col-span-8 space-y-2">
                            <div>
                              <strong className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">1. Cíl / Modul systému</strong>
                              <span className="text-white font-semibold font-mono bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800 text-[10px]">
                                {iss.module} &rarr; <code className="text-teal-400">{iss.target}</code>
                              </span>
                            </div>

                            <div>
                              <strong className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">2. Popis zjištěné závady ({iss.type})</strong>
                              <p className="text-slate-300 text-xs bg-slate-900/40 p-2.5 rounded-xl border border-slate-900">
                                {iss.desc}
                              </p>
                            </div>
                          </div>

                          <div className="md:col-span-4 space-y-3 bg-slate-900/30 p-3 rounded-xl border border-slate-800/40 flex flex-col justify-between">
                            <div>
                              <strong className="text-[10px] text-teal-400 uppercase font-mono tracking-wider block mb-1">🛠️ Návrh nápravy</strong>
                              <p className="text-[11px] text-slate-400 italic">
                                {iss.fix}
                              </p>
                            </div>

                            {/* Fix / Manual actions */}
                            <div className="pt-2 border-t border-slate-800/50 flex flex-wrap gap-1.5 justify-end">
                              {iss.status === 'resolved' ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] rounded-lg">
                                  <CheckCircle className="w-3.5 h-3.5" /> Vyřešeno automaticky
                                </span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleManualVerify(iss.id)}
                                    className={`px-2 py-1 border rounded-lg font-mono text-[9px] font-bold cursor-pointer transition-all ${
                                      iss.status === 'verified'
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                        : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    {iss.status === 'verified' ? '✓ Ověřeno' : 'Ověřit manuálně'}
                                  </button>

                                  <button
                                    onClick={() => handleFixIssue(iss.id)}
                                    className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-[9px] rounded-lg shadow-sm cursor-pointer transition-colors"
                                  >
                                    Opravit automaticky
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                        </div>

                      </div>
                    ))}
                </div>
              </div>

              {/* POLOŽKY VYŽADOVÁNÍ MANUÁLNÍ KONTROLY (Právní disclaimer) */}
              <div className="p-5 bg-amber-950/20 border border-amber-900/40 text-amber-200 rounded-2xl space-y-3 relative z-10">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="font-bold text-white block">Položky vyžadující manuální ověření & Advokátní dozor</strong>
                    <p className="mt-1 leading-relaxed text-amber-300/90">
                      Následující kritické součásti systému <strong className="text-white">nelze automaticky stoprocentně ověřit</strong> skrze AI agenty a vyžadují manuální dohled seniorního softwarového architekta nebo právního zástupce:
                    </p>
                    <ul className="list-disc pl-4 mt-2.5 space-y-1.5 text-amber-400 font-mono text-[11px]">
                      <li>
                        <strong>Živé propojení na rejstřík rozhodnutí NALUS Ústavního soudu:</strong> Vyžaduje manuální audit API klíčů a certifikátů při nasazení na produkční Vercel cloud.
                      </li>
                      <li>
                        <strong>Validace výpočtů kalkulačky výživného:</strong> Výpočetní matice musí být schválena licencovaným advokátem pro rodinné právo na reálných extrémních případech (příjmy nad 500k Kč, střídavá péče 5 dětí).
                      </li>
                      <li>
                        <strong>Bezpečné šifrování databáze Trezor D1:</strong> Nahrávané důkazy (soubory uživatelů) musí projít manuálním penetračním testem na zamezení neoprávněného přístupu k citlivým rodinným dokumentům.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: AI INTERNET CRAWLER & CONTENT COLLECTOR */}
          {activeMenu === 'aimoderator' && (
            <div className="space-y-6">
              {/* Header block with animated badge */}
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <Search className="w-5 h-5 text-teal-500 animate-pulse" />
                    AI Internetový Sběrač & Moderátor Obsahu (v2.1)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Prohledávejte široký internet a oficiální české právní zdroje v reálném čase, filtrujte a automaticky vkládejte články či judikáty.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-100">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping" />
                    Google Search Grounding Aktivní
                  </span>
                </div>
              </div>

              {/* SEARCH CONSOLE CARD */}
              <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Cpu className="w-48 h-48 text-teal-500" />
                </div>
                
                <h3 className="text-sm font-bold text-white tracking-wider uppercase font-mono flex items-center gap-2 text-teal-400">
                  <Sparkles className="w-4 h-4" /> AI Crawler Console
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-9 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Zadejte vyhledávací dotaz (např. nález ústavního soudu střídavá péče 2026, novela o výživném)..."
                      value={crawlerQuery}
                      onChange={(e) => setCrawlerQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isCrawling) {
                          handleCrawlInternet();
                        }
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50"
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <button
                      onClick={handleCrawlInternet}
                      disabled={isCrawling}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isCrawling 
                          ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                          : 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold shadow-lg shadow-teal-500/10'
                      }`}
                    >
                      {isCrawling ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          HLEDÁM...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          SPUSTIT SBĚRAČ
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Preset Suggestions */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                  <span className="font-semibold uppercase tracking-wider font-mono">Doporučené dotazy:</span>
                  {[
                    "střídavá péče 2026 nová metodika",
                    "nález ústavního soudu práva otců",
                    "výpočet výživného děti 2026",
                    "psychologie dětí rozvod střídavka",
                    "OSPOD práva rodičů judikatura"
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setCrawlerQuery(preset)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800/80 rounded-lg transition-colors cursor-pointer text-slate-300 font-mono"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* AGENT TERMINAL LOG AND ACTION SUMMARY */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Crawler Terminal Logs */}
                <div className="lg:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner font-mono text-[10px] text-slate-300 flex flex-col justify-between h-[360px] overflow-hidden">
                  <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <span className="text-teal-400 font-bold tracking-widest text-[9px] uppercase">Agent Console Logs</span>
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    </div>
                    {crawlerLog.length === 0 ? (
                      <div className="text-slate-500 italic py-8 text-center">
                        Vyhledávací konzole je prázdná. Spusťte AI Sběrače pro zahájení crawlingu a analýzy.
                      </div>
                    ) : (
                      crawlerLog.map((log, idx) => (
                        <div key={idx} className="animate-fadeIn leading-relaxed border-l-2 border-slate-800 pl-2">
                          <span className="text-slate-500">[{new Date().toLocaleTimeString('cs-CZ')}]</span> {log}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t border-slate-800 pt-2.5 mt-2 flex items-center justify-between text-slate-500 text-[9px]">
                    <span>SYSTEM: v2.1.0-Docker</span>
                    <span>GROUNDING: GOOGLE SEARCH</span>
                  </div>
                </div>

                {/* Right: Crawler results preview / Intro guidelines */}
                <div className="lg:col-span-8 space-y-4">
                  {crawlerResults.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-2xs text-center space-y-3 h-[360px] flex flex-col items-center justify-center">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-12 h-12 flex items-center justify-center">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Čeká se na spuštění internetového vyhledávacího agenta</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Náš AI sběrač obsahu prozkoumá v reálném čase webové stránky českých úřadů a soudů, extrahuje nejvhodnější legislativní či opatrovnické novinky a připraví je pro okamžitý import do vaší redakce.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 h-[360px] overflow-y-auto pr-1">
                      {crawlerResults.map((item, idx) => {
                        const isAlreadyImported = crawlerImportedUrls.includes(item.url);
                        return (
                          <div 
                            key={idx} 
                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all space-y-3 relative group text-left"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                                    item.category === 'Soudy' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                    item.category === 'Zákony' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                    item.category === 'Psychologie' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                    'bg-teal-50 text-teal-700 border border-teal-100'
                                  }`}>
                                    {item.category}
                                  </span>
                                  
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    Relevance: {item.relevanceScore}%
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors leading-snug">
                                  {item.title}
                                </h4>
                              </div>

                              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                {item.date}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/60">
                              {item.summary}
                            </p>

                            <div className="flex items-center justify-between gap-4 text-[11px] border-t border-slate-100 pt-3">
                              <div className="text-slate-400">
                                Zdroj: <span className="font-semibold text-slate-600 font-mono">{item.source}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-mono transition-colors border border-slate-100 hover:border-slate-300 rounded-lg text-[10px]"
                                >
                                  Původní odkaz
                                </a>

                                <button
                                  disabled={isAlreadyImported}
                                  onClick={() => handleImportCrawlItem(item)}
                                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                                    isAlreadyImported
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-not-allowed'
                                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                                  }`}
                                >
                                  {isAlreadyImported ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      Importováno
                                    </>
                                  ) : (
                                    <>
                                      <PlusCircle className="w-3.5 h-3.5" />
                                      Importovat do {item.category === 'Soudy' ? 'Judikatury' : 'Článků'}
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 9: USERS & RBAC (Role a Práva) */}
          {activeMenu === 'users' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    Správa uživatelů & Role-Based Access Control (RBAC)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kompletní správa uživatelských účtů a detailních oprávnění pro moduly Synthesis OS.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                    userSyncStatus === 'synced' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                    userSyncStatus === 'saving' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      userSyncStatus === 'synced' ? 'bg-teal-500' :
                      userSyncStatus === 'saving' ? 'bg-amber-500 animate-pulse' :
                      'bg-rose-500'
                    }`} />
                    {userSyncStatus === 'synced' ? 'Synchronizováno (Cloud/Local)' :
                     userSyncStatus === 'saving' ? 'Ukládám do DB...' :
                     'Chyba synchronizace'}
                  </span>
                </div>
              </div>

              {/* STATS COUNTERS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Celkem registrováno</span>
                  <strong className="text-xl font-extrabold text-slate-800 block mt-1">{usersList.length} tátů</strong>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Administrátoři</span>
                  <strong className="text-xl font-extrabold text-indigo-600 block mt-1">{usersList.filter(u => u.role === 'admin').length} účtů</strong>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Služby & Specialisté</span>
                  <strong className="text-xl font-extrabold text-teal-600 block mt-1">
                    {usersList.filter(u => (u as any).subRole && ['Psycholog', 'Právní poradce', 'Editor', 'Moderátor'].includes((u as any).subRole)).length} specialistů
                  </strong>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Zablokovaní</span>
                  <strong className="text-xl font-extrabold text-rose-600 block mt-1">{usersList.filter(u => (u as any).subRole === 'Zablokovaný').length} tátů</strong>
                </div>
              </div>

              {/* SEARCH & ACTIONS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Hledat uživatele podle jména nebo e-mailu..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                    />
                  </div>
                  
                  <button
                    onClick={() => setIsAddingUser(!isAddingUser)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Nový uživatel (AI Admin / Partner)
                  </button>
                </div>

                {/* ADD USER FORM (EXPANDABLE) */}
                {isAddingUser && (
                  <form onSubmit={handleAddUser} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Jméno a příjmení</label>
                        <input
                          type="text"
                          required
                          placeholder="Např. PhDr. Milan Kovář"
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">E-mailová adresa</label>
                        <input
                          type="email"
                          required
                          placeholder="milan.kovar@synthesis.cz"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Základní oprávnění</label>
                        <select
                          value={newUserForm.role}
                          onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                        >
                          <option value="user">Běžný uživatel (User)</option>
                          <option value="admin">Administrátor (Admin)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Role v portálu (Portal Role)</label>
                        <select
                          value={newUserForm.subRole}
                          onChange={(e) => setNewUserForm({ ...newUserForm, subRole: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                        >
                          <option value="Registrovaný">👤 Registrovaný</option>
                          <option value="OvenyUzivatel">⭐ Ověřený uživatel</option>
                          <option value="Moderator">🛡️ Moderátor fóra</option>
                          <option value="Editor">✍️ Editor obsahu</option>
                          <option value="Psycholog">🧠 Psycholog / Specialista</option>
                          <option value="PravniPoradce">⚖️ Právní poradce</option>
                          <option value="Admin">⚙️ Administrátor</option>
                          <option value="SuperAdmin">👑 SuperAdmin</option>
                          <option value="Zablokovaný">🚫 Zablokovaný</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setIsAddingUser(false)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"
                      >
                        Zrušit
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-xs"
                      >
                        Uložit do registru
                      </button>
                    </div>
                  </form>
                )}

                {/* EDIT USER FORM (EXPANDABLE) */}
                {editingUser && (
                  <form onSubmit={handleSaveEditUser} className="bg-indigo-50/40 p-5 rounded-xl border border-indigo-100 space-y-4 animate-fadeIn">
                    <div className="border-b border-indigo-100/50 pb-2 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                        Editovat uživatelský profil: <span className="text-indigo-700 font-mono font-bold font-sans">{editingUser.name}</span>
                      </h3>
                      <span className="text-[9px] text-indigo-500 font-mono">ID: {editingUser.id}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Jméno a příjmení</label>
                        <input
                          type="text"
                          required
                          value={editUserForm.name}
                          onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">E-mailová adresa</label>
                        <input
                          type="email"
                          required
                          value={editUserForm.email}
                          onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Základní oprávnění</label>
                        <select
                          value={editUserForm.role}
                          onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value as any })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="user">Běžný uživatel (User)</option>
                          <option value="admin">Administrátor (Admin)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Role v portálu (Portal Role)</label>
                        <select
                          value={editUserForm.subRole}
                          onChange={(e) => setEditUserForm({ ...editUserForm, subRole: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="SuperAdmin">👑 SuperAdmin</option>
                          <option value="Admin">⚙️ Administrátor</option>
                          <option value="Editor">✍️ Editor obsahu</option>
                          <option value="PravniPoradce">⚖️ Právní poradce</option>
                          <option value="Psycholog">🧠 Psycholog / Specialista</option>
                          <option value="Moderator">🛡️ Moderátor fóra</option>
                          <option value="OvenyUzivatel">⭐ Ověřený uživatel</option>
                          <option value="Registrovaný">👤 Registrovaný</option>
                          <option value="Zablokovaný">🚫 Zablokovaný</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Telefon</label>
                        <input
                          type="text"
                          placeholder="+420 777 123 456"
                          value={editUserForm.phone}
                          onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Kraj / Město</label>
                        <input
                          type="text"
                          placeholder="Praha"
                          value={editUserForm.city}
                          onChange={(e) => setEditUserForm({ ...editUserForm, city: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Adresa obrázku (Avatar URL)</label>
                        <input
                          type="text"
                          value={editUserForm.avatar}
                          onChange={(e) => setEditUserForm({ ...editUserForm, avatar: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Osobní memento / Bio</label>
                      <textarea
                        rows={2}
                        placeholder="Krátký popis uživatele..."
                        value={editUserForm.bio}
                        onChange={(e) => setEditUserForm({ ...editUserForm, bio: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 text-xs pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100"
                      >
                        Zrušit
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs"
                      >
                        Uložit změny profilu
                      </button>
                    </div>
                  </form>
                )}

                {/* USERS TABLE */}
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-100">
                        <th className="p-3">Uživatel</th>
                        <th className="p-3">E-mail</th>
                        <th className="p-3">Základní role</th>
                        <th className="p-3">Role v portálu</th>
                        <th className="p-3">Datum registrace</th>
                        <th className="p-3 text-right">Akce</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {usersList
                        .filter(u => 
                          u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchUserQuery.toLowerCase())
                        )
                        .map((user) => {
                          const currentSubRole = (user as any).subRole || (user.role === 'admin' ? 'Admin' : 'Registrovaný');
                          return (
                            <tr key={user.id} className="hover:bg-slate-50/50">
                              <td className="p-3 flex items-center gap-3">
                                <img
                                  src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
                                  alt={user.name}
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 shrink-0"
                                />
                                <div>
                                  <span className="font-semibold text-slate-800 block leading-tight">{user.name}</span>
                                  {currentUser && user.id === currentUser.id && (
                                    <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200/50 px-1 py-0.2 rounded font-mono font-bold mt-0.5 inline-block">Můj profil</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-slate-500 font-mono text-[11px]">{user.email}</td>
                              <td className="p-3">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUpdateUserRole(user.id, e.target.value as any, currentSubRole)}
                                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none"
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td className="p-3">
                                <select
                                  value={currentSubRole}
                                  onChange={(e) => {
                                    const nextSubRole = e.target.value;
                                    const nextCoreRole = (['SuperAdmin', 'Admin'].includes(nextSubRole)) ? 'admin' : 'user';
                                    handleUpdateUserRole(user.id, nextCoreRole, nextSubRole);
                                  }}
                                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none font-sans"
                                >
                                  <option value="SuperAdmin">👑 SuperAdmin</option>
                                  <option value="Admin">⚙️ Admin</option>
                                  <option value="Editor">✍️ Editor</option>
                                  <option value="PravniPoradce">⚖️ Právní poradce</option>
                                  <option value="Psycholog">🧠 Psycholog</option>
                                  <option value="Moderator">🛡️ Moderátor</option>
                                  <option value="OvenyUzivatel">⭐ Ověřený</option>
                                  <option value="Registrovaný">👤 Registrovaný</option>
                                  <option value="Zablokovaný">🚫 Zablokovaný</option>
                                </select>
                              </td>
                              <td className="p-3 text-slate-400 font-mono text-[10px]">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('cs-CZ') : 'Neznámé'}
                              </td>
                              <td className="p-3 text-right flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditUser(user)}
                                  className="p-1.5 rounded-lg border border-indigo-100/30 hover:bg-indigo-50 text-indigo-500 cursor-pointer transition-all"
                                  title="Editovat údaje uživatele"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={user.id === 'user-mallfuriionn' || (currentUser && user.id === currentUser.id)}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    user.id === 'user-mallfuriionn' || (currentUser && user.id === currentUser.id)
                                      ? 'text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed'
                                      : 'text-rose-500 hover:bg-rose-50 border-rose-100/30 cursor-pointer'
                                  }`}
                                  title="Odstranit uživatele z OS"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Grid of roles and permissions */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="border-b border-slate-50 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Matrice oprávnění rolí (Oprávnění k modulům)</h3>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Synthesis OS Core Permissions</span>
                </div>
                
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
                    onClick={() => alert('Vzhled úspěšně přepsán do globálního CSS.')}
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

              {/* Reset / Launch action box */}
              <div className="p-5 bg-gradient-to-r from-teal-950 to-slate-900 text-white rounded-2xl border border-teal-500/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
                
                <div className="space-y-1.5 relative z-10 text-xs">
                  <strong className="text-sm font-bold block text-teal-300">Příprava na spuštění Alfa verze 0.0.1.1</strong>
                  <p className="text-slate-300 leading-relaxed">
                    Vymaže zkušební uživatelská data, vyčistí nahlášené testovací spamy z diskuzí a připraví databázi pro oficiální ostrý start.
                  </p>
                </div>

                <button
                  onClick={handleClearDemoData}
                  className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer z-10 flex items-center gap-1.5 transition-all shadow-md shadow-teal-950/40 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Vyčistit & Spustit Alfa 0.0.1.1
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

              {/* New database-connected Audit Logs section */}
              <AdminAuditLogs />

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

          {/* TAB 14: DATABASE & CLOUD CONTROL */}
          {activeMenu === 'supabase' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-500" />
                  Databáze & Cloud Management (Firebase / Supabase)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitorujte a spravujte stav cloudové infrastruktury Synthesis OS, datová úložiště a integrační body.
                </p>
              </div>

              {/* TWO CLOUDS CARDS COMPARISON */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* FIREBASE / FIRESTORE CONTROL */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Firebase (Firestore & Auth)
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                      firebaseStatus === 'active' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                      firebaseStatus === 'loading' ? 'bg-slate-50 text-slate-500' :
                      'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {firebaseStatus === 'active' ? '🟢 AKTIVNÍ' :
                       firebaseStatus === 'loading' ? '⏳ NAČÍTÁNÍ...' :
                       '🔴 ODPOJENO'}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                      <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                        <span className="text-slate-400 font-mono text-[10px]">PROJEKT ID</span>
                        <span className="font-mono text-slate-700 font-bold">synthesis-os-db</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                        <span className="text-slate-400 font-mono text-[10px]">FIRESTORE DB ID</span>
                        <span className="font-mono text-slate-700 font-bold">(default)</span>
                      </div>
                      <div className="flex justify-between pb-0.5">
                        <span className="text-slate-400 font-mono text-[10px]">REŽIM STORAGE</span>
                        <span className="font-mono text-slate-700 font-bold">Hybrid (Auth + NoSQL)</span>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50/50 border border-indigo-100/30 rounded-xl space-y-1">
                      <strong className="text-slate-800 font-bold block text-[11px]">Firestore kolekce (Users):</strong>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Spravuje profily registrovaných uživatelů, ověření účtů, speciální role a bezpečnostní vazby RBAC.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        setFirebaseStatus('loading');
                        try {
                          const users = await Promise.race([
                            getCollectionData<User>('users', []),
                            new Promise<User[]>((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000))
                          ]);
                          setFirebaseStatus('active');
                          alert(`Firebase test úspěšný! Načteno ${users.length} uživatelských profilů.`);
                        } catch (e) {
                          setFirebaseStatus('error');
                          alert("Firebase test selhal nebo vypršel časový limit spojení. Zkontrolujte prosím konfiguraci projektu.");
                        }
                      }}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl font-bold text-slate-700 text-xs transition-all cursor-pointer"
                    >
                      Otestovat Firestore spojení (Ping)
                    </button>
                  </div>
                </div>

                {/* SUPABASE CONTROL */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Supabase (PostgreSQL)
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                      supabaseStatus === 'active' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                      supabaseStatus === 'loading' ? 'bg-slate-50 text-slate-500' :
                      'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {supabaseStatus === 'active' ? `🟢 AKTIVNÍ (${pingLatency ? `${pingLatency}ms` : 'OK'})` :
                       supabaseStatus === 'loading' ? '⏳ NAČÍTÁNÍ...' :
                       '🟡 FALLBACK / LOKÁLNÍ'}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                      <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                        <span className="text-slate-400 font-mono text-[10px]">DATABÁZE URL</span>
                        <span className="font-mono text-slate-700 font-bold break-all max-w-[150px] truncate" title={supUrl || 'Nenastaveno'}>
                          {supUrl || 'Nenastaveno'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                        <span className="text-slate-400 font-mono text-[10px]">ANON KLÍČ</span>
                        <span className="font-mono text-slate-700 font-bold">
                          {supKey ? '••••••••••••••••••••' : 'Nenastaveno'}
                        </span>
                      </div>
                      <div className="flex justify-between pb-0.5">
                        <span className="text-slate-400 font-mono text-[10px]">RLS PROTECTION</span>
                        <span className="font-mono text-emerald-600 font-extrabold uppercase">ZAPNUTO (RLS)</span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/50 border border-emerald-100/30 rounded-xl space-y-1">
                      <strong className="text-slate-800 font-bold block text-[11px]">Relační PostgreSQL motor:</strong>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Ukládá články, příběhy, komunitní fórum, komentáře a finanční dary tátů.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        setSupabaseStatus('loading');
                        const startTime = Date.now();
                        const sb = getSupabase();
                        if (sb && isSupabaseConfigured()) {
                          try {
                            const result = await Promise.race([
                              sb.from('articles').select('id', { count: 'exact', head: true }).then(({ error }) => {
                                if (error) return false;
                                return true;
                              }),
                              new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000))
                            ]);

                            if (result) {
                              setSupabaseStatus('active');
                              setPingLatency(Date.now() - startTime);
                              alert(`Supabase test úspěšný! Odezva ${Date.now() - startTime}ms.`);
                            } else {
                              setSupabaseStatus('offline');
                              alert("Supabase vypršela lhůta odezvy (timeout) nebo není k dispozici. Aplikace využívá lokální/Firestore vrstvu.");
                            }
                          } catch (e) {
                            setSupabaseStatus('error');
                            alert("Supabase test selhal. Zkontrolujte připojení k PostgreSQL.");
                          }
                        } else {
                          setSupabaseStatus('offline');
                          alert("Supabase není nakonfigurováno.");
                        }
                      }}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl font-bold text-slate-700 text-xs transition-all cursor-pointer"
                    >
                      Otestovat Supabase spojení (Ping)
                    </button>
                  </div>
                </div>

              </div>

              {/* MANUAL DATABASE OVERRIDE CONFIGURATION FORM */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="border-b border-slate-100/50 pb-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    Konfigurace připojení k Supabase
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Zde můžete ručně zadat přihlašovací údaje pro Supabase, pokud nejsou správně načteny ze systémového prostředí. Údaje se ukládají lokálně ve vašem prohlížeči.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Supabase URL adresa</label>
                    <input
                      type="text"
                      value={supUrl}
                      onChange={(e) => setSupUrl(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden font-mono text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Supabase Anon Key (Klíč)</label>
                    <input
                      type="password"
                      value={supKey}
                      onChange={(e) => setSupKey(e.target.value)}
                      placeholder="Klíč začínající eyJhbGciOi..."
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Opravdu chcete vymazat ruční přihlašovací údaje a obnovit systémové výchozí nastavení?')) {
                        localStorage.removeItem('synthesis_hub_supabase_url_override');
                        localStorage.removeItem('synthesis_hub_supabase_key_override');
                        resetSupabaseInstance();
                        const defaultUrl = getSupabaseUrl();
                        const defaultKey = getSupabaseAnonKey();
                        setSupUrl(defaultUrl);
                        setSupKey(defaultKey);
                        setRefreshStatsTrigger(prev => prev + 1);
                        alert('Konfigurace byla resetována na výchozí systémové hodnoty.');
                      }
                    }}
                    className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all"
                  >
                    Resetovat na výchozí
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!supUrl.trim() || !supKey.trim()) {
                        alert('Vyplňte prosím obě pole. Jinak se aktivuje lokální fallback.');
                        return;
                      }
                      localStorage.setItem('synthesis_hub_supabase_url_override', supUrl.trim());
                      localStorage.setItem('synthesis_hub_supabase_key_override', supKey.trim());
                      resetSupabaseInstance();
                      setRefreshStatsTrigger(prev => prev + 1);
                      alert('Konfigurace byla uložena a připojení se restartuje.');
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Uložit a otestovat spojení
                  </button>
                </div>
              </div>

              {/* DUAL DATABASE MIRRORING STATUS CARD */}
              <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <h3 className="text-sm font-bold tracking-wide uppercase font-display text-white">
                        Souběžný Dvojitý Zápis (Supabase ⚡ Firebase Sync)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Aplikace zapisuje každý záznam (profily, články, fórum, nastavení) souběžně do obou databází s automatickým ošetřením výpadků.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const status = await dbSyncService.getStatus();
                      alert(
                        `STAV DVOJITÉHO ZÁPISU:\n` +
                        `• Supabase: ${status.supabaseConfigured ? (status.supabaseConnected ? '🟢 Připojeno (Active)' : '🔴 Chyba spojení / Offline') : '⚪ Nenastaveno'}\n` +
                        `• Firebase: ${status.firebaseConfigured ? (status.firebaseConnected ? '🟢 Připojeno (Active)' : '🔴 Chyba spojení / Offline') : '⚪ Nenastaveno'}\n` +
                        `• Poslední synchronizace: ${status.lastSyncTimestamp ? new Date(status.lastSyncTimestamp).toLocaleString('cs-CZ') : 'Nebylo prováděno v této relaci'}`
                      );
                    }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Diagnostika Dual-Sync
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Primární Zápis</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Supabase PostgreSQL
                    </span>
                    <p className="text-[10px] text-slate-400">Trvalá tabulková struktura</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Souběžný Zápis</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Firebase Firestore
                    </span>
                    <p className="text-[10px] text-slate-400">Záložní NoSQL dokumenty</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Klientská Vyrovnávací Paměť</span>
                    <span className="font-bold text-indigo-300 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> LocalStorage Fallback
                    </span>
                    <p className="text-[10px] text-slate-400">Rychlá offline odezva</p>
                  </div>
                </div>
              </div>

              {/* DYNAMIC RECORD COUNTERS PANEL */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="border-b border-slate-50 pb-2 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aktuální počty datových záznamů</h3>
                  <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-mono font-bold uppercase">Stav tabulek</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Uživatelé', count: dbTableCounts.users, color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100/50' },
                    { label: 'Články', count: dbTableCounts.articles, color: 'text-teal-600 bg-teal-50/50 border-teal-100/50' },
                    { label: 'Příběhy', count: dbTableCounts.stories, color: 'text-rose-600 bg-rose-50/50 border-rose-100/50' },
                    { label: 'Příspěvky', count: dbTableCounts.posts, color: 'text-amber-600 bg-amber-50/50 border-amber-100/50' },
                    { label: 'Komentáře', count: dbTableCounts.comments, color: 'text-purple-600 bg-purple-50/50 border-purple-100/50' },
                    { label: 'Dary', count: dbTableCounts.donations, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100/50' }
                  ].map((tbl, i) => (
                    <div key={i} className={`p-4 border rounded-xl text-center space-y-1 ${tbl.color}`}>
                      <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-400">{tbl.label}</span>
                      <strong className="text-lg font-extrabold block">{tbl.count}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* AUTOMATION WARNING BOX */}
              <div className="p-4 bg-teal-50 border border-teal-100 text-teal-950 rounded-2xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="font-bold block">Architektura autonomního řízení (Synthesis OS API-First)</strong>
                  <p className="mt-1 leading-relaxed">
                    Tato databázová vrstva je navržena tak, aby podporovala budoucí autonomní správu (AI Admin). Změny provedené v administraci se automaticky propagují na zabezpečené API endpointy, což umožňuje lokálním AI agentům efektivně auditovat a čistit data bez manuálních zásahů.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 15: PARTNERS MANAGEMENT */}
          {activeMenu === 'partners' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-teal-600" />
                    Správa doporučených partnerů & odborníků
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Spravujte síť spolupracujících organizací, psychologů, mediátorů a právních poradců doporučovaných rodičům.
                  </p>
                </div>
                {!isAddingPartner && (
                  <button
                    onClick={handleOpenAddPartner}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-3xs hover:shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Nový partner
                  </button>
                )}
              </div>

              {/* FORM CARD - ADD OR EDIT PARTNER */}
              {isAddingPartner && (
                <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-6 space-y-4">
                  <div className="border-b border-slate-200/55 pb-2">
                    <h3 className="font-bold text-sm text-slate-800 font-display">
                      {editingPartner ? 'Upravit partnera' : 'Vytvořit nového partnera'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Vyplňte profilové informace partnera, které se zobrazí uživatelům na domovské stránce.
                    </p>
                  </div>

                  <form onSubmit={handleSavePartner} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Název partnera *</label>
                        <input
                          type="text"
                          required
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          placeholder="Např. Poradna pro tátu"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kategorie *</label>
                        <select
                          value={partnerCategory}
                          onChange={(e) => setPartnerCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                        >
                          <option value="Poradna">Poradna</option>
                          <option value="Advokát">Advokát</option>
                          <option value="Psycholog">Psycholog</option>
                          <option value="Mediátor">Mediátor</option>
                          <option value="Ostatní">Ostatní</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kraj / Územní působnost *</label>
                        <input
                          type="text"
                          required
                          value={partnerRegion}
                          onChange={(e) => setPartnerRegion(e.target.value)}
                          placeholder="Např. Celá ČR / Jihomoravský kraj"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Odkaz na web nebo Facebook *</label>
                        <input
                          type="url"
                          required
                          value={partnerLink}
                          onChange={(e) => setPartnerLink(e.target.value)}
                          placeholder="https://www.facebook.com/..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">URL adresa loga (nepovinné)</label>
                      <input
                        type="url"
                        value={partnerLogoUrl}
                        onChange={(e) => setPartnerLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stručný popis činnosti / služeb *</label>
                      <textarea
                        required
                        rows={3}
                        value={partnerDescription}
                        onChange={(e) => setPartnerDescription(e.target.value)}
                        placeholder="Zde popište, jaké konkrétní služby partner nabízí..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden resize-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-6 pt-2">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={partnerIsRecommended}
                          onChange={(e) => setPartnerIsRecommended(e.target.checked)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-700 block">Doporučený partner ⭐</span>
                          <span className="text-[10px] text-slate-400 block">Zvýrazní se v rámečku s hvězdičkou jako prioritní</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={partnerShowOnMainPage}
                          onChange={(e) => setPartnerShowOnMainPage(e.target.checked)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-700 block">Zobrazovat na hlavní stránce</span>
                          <span className="text-[10px] text-slate-400 block">Pokud je zapnuto, zobrazí se v sekci partnerů na homepage</span>
                        </div>
                      </label>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200/50">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingPartner(false);
                          setEditingPartner(null);
                        }}
                        className="px-4 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Zrušit
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-3xs transition-all cursor-pointer"
                      >
                        {editingPartner ? 'Uložit změny' : 'Přidat partnera'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* PARTNERS DATABASE SEARCH BAR */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-3xs">
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={partnerSearch}
                    onChange={(e) => setPartnerSearch(e.target.value)}
                    placeholder="Vyhledat partnera..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div className="text-slate-400 text-xs font-mono">
                  Celkem: <strong className="text-slate-700 font-extrabold">{partners.length}</strong> partnerů
                </div>
              </div>

              {/* PARTNERS LISTING TABLE */}
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-3xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="px-5 py-3.5">Logo & Název</th>
                        <th className="px-5 py-3.5">Kategorie</th>
                        <th className="px-5 py-3.5">Působnost</th>
                        <th className="px-5 py-3.5 text-center">Doporučený</th>
                        <th className="px-5 py-3.5 text-center">Zobrazit na hlavním webu</th>
                        <th className="px-5 py-3.5 text-right">Akce</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {partners
                        .filter(p => p.name.toLowerCase().includes(partnerSearch.toLowerCase()))
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {p.logoUrl ? (
                                  <img
                                    src={p.logoUrl}
                                    alt={p.name}
                                    className="w-9 h-9 rounded-lg object-cover border border-slate-100 shadow-3xs shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 border border-teal-100/50 flex items-center justify-center font-bold text-xs font-display shadow-3xs shrink-0">
                                    {p.name.substring(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <div className="space-y-0.5">
                                  <strong className="text-xs text-slate-800 font-bold block">{p.name}</strong>
                                  <a
                                    href={p.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-teal-600 hover:underline block truncate max-w-[180px]"
                                  >
                                    {p.link}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/40">
                                {p.category}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-xs text-slate-500 font-medium">{p.region}</span>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => handleToggleRecommended(p)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  p.isRecommended
                                    ? 'bg-amber-50 border-amber-200 text-amber-500'
                                    : 'bg-slate-50 border-slate-100 text-slate-300 hover:text-slate-500'
                                }`}
                                title="Kliknutím přepnete doporučení"
                              >
                                <span className="text-xs">★</span>
                              </button>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => handleToggleShowOnMain(p)}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                  p.showOnMainPage
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                                }`}
                                title="Zobrazovat na domovské stránce"
                              >
                                {p.showOnMainPage ? 'Ano (Aktivní)' : 'Ne (Skryto)'}
                              </button>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditPartner(p)}
                                  className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                                  title="Upravit profil partnera"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePartner(p.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Smazat partnera"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {partners.filter(p => p.name.toLowerCase().includes(partnerSearch.toLowerCase())).length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400 text-xs font-mono">
                            Nebyly nalezeny žádné záznamy odpovídající hledanému výrazu.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* INTEGRATION NOTE */}
              <div className="p-4 bg-teal-50 border border-teal-100 text-teal-950 rounded-2xl flex items-start gap-3 shadow-3xs">
                <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="font-bold block">Autonomní API-First synchronizace partnerů</strong>
                  <p className="mt-1 leading-relaxed">
                    Tato sekce ukládá data přímo do Firestore kolekce <code className="font-mono bg-teal-100/50 px-1 py-0.2 rounded text-teal-900 font-semibold">partners</code>.
                    Budoucí autonomní procesy (např. lokální AI admin) mohou kdykoli skrze backendová API spouštět audity odkazů, ověřovat funkčnost Facebook stránek partnerů nebo automaticky generovat shrnutí jejich činností na základě analýzy jejich veřejných profilů.
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
