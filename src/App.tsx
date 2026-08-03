/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Scale, Heart, Shield, BookOpen, ExternalLink, Server, Share2 } from 'lucide-react';

import { User, Article, ExperienceStory, ForumPost, Comment, Donation, Partner } from './types';
import { 
  getStoredState, 
  setStoredState, 
  INITIAL_ARTICLES, 
  INITIAL_STORIES, 
  INITIAL_FORUM_POSTS, 
  INITIAL_COMMENTS,
  INITIAL_DONATIONS,
  INITIAL_PARTNERS
} from './initialState';
import { 
  subscribeToAuth, 
  getCollectionData, 
  saveDocument, 
  deleteDocument,
  logoutUser,
  verifyMagicLink
} from './lib/firebase';
import { SupabaseService, isSupabaseConfigured } from './lib/supabase';
import { dbSyncService } from './services/dbSyncService';

import Breadcrumbs from './components/Breadcrumbs';
import RelatedContent from './components/RelatedContent';
import { updatePageSeo } from './lib/seo';
import { parseInternalLink, scrollToAnchor } from './lib/navigation';

// Component imports
import Navigation from './components/Navigation';
import PageViewTracker from './components/PageViewTracker';
import AuthModal from './components/AuthModal';
import CookieConsentBanner, { openCookieConsentModal } from './components/CookieConsentBanner';
import HeroSection from './components/HeroSection';
import RightsSection from './components/RightsSection';
import DocumentsSection from './components/DocumentsSection';
import Footer from './components/layout/Footer';
import AdviceSection from './components/AdviceSection';
import StoriesSection from './components/StoriesSection';
import ForumSection from './components/ForumSection';
import NewsSection from './components/NewsSection';
import AdminPanel from './components/AdminPanel';
import AiAssistantView from './components/AiAssistantView';

// New High-Fidelity Opatrovnický Průvodce Sections
import JudikaturaSection from './components/JudikaturaSection';
import OspodSection from './components/OspodSection';
import SoudniRizeniSection from './components/SoudniRizeniSection';
import VyzivneSection from './components/VyzivneSection';
import PeceODiteSection from './components/PeceODiteSection';
import KeStazeniSection from './components/KeStazeniSection';
import KontaktSection from './components/KontaktSection';
import CrisisSection from './components/CrisisSection';
import CrisisNavigator from './components/CrisisNavigator';
import SupportSection from './components/SupportSection';
import CoParentHub from './components/CoParentHub';
import GlossaryDrawer from './components/GlossaryDrawer';
import FounderStoryView from './components/FounderStoryView';
import AiGuideSection from './components/AiGuideSection';
import UserPortal from './components/UserPortal';
import PersonalWorkspace from './components/PersonalWorkspace';
import UserProfile from './components/UserProfile';
import SitemapTimeline from './components/SitemapTimeline';
import CareSimulator from './components/CareSimulator';
import TicketSystem from './components/TicketSystem';
import EJusticeSection from './components/EJusticeSection';

// Combined structured sections and partners
import OpatrovnickaAgenda from './components/OpatrovnickaAgenda';
import PlanPeceODite from './components/PlanPeceODite';
import PartnersSection from './components/PartnersSection';
import MementoPillar from './components/MementoPillar';
import IntroScreen from './components/IntroScreen';
import { useLanguage } from './lib/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';

// High-fidelity expert educational and legal tools
import KnihovnaStudies from './components/KnihovnaStudies';
import VideotekaView from './components/VideotekaView';
import VzdelavaniSection from './components/VzdelavaniSection';
import PripadovaDatabaze from './components/PripadovaDatabaze';
import CentrumFormularu from './components/CentrumFormularu';
import AiCaseManager from './components/AiCaseManager';
import LegalWiki from './components/LegalWiki';
import AiAdmin from './components/AiAdmin';
import LifeSituationSection from './components/LifeSituationSection';
import CategoryDetailView from './components/CategoryDetailView';
import { SynthesisAperioHub } from './components/SynthesisAperioHub';
import AiContextView from './components/AiContextView';
import StateLawsSection from './components/StateLawsSection';
import StateStatisticsSection from './components/StateStatisticsSection';
import UserManualView from './components/UserManualView';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import JoinTeamSection from './components/JoinTeamSection';
import LegalComplianceCenter from './components/LegalComplianceCenter';

export default function App() {
  const { t, language, setLanguage } = useLanguage();
  // Global Authentication & Navigation States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    let user: User | null = null;
    if (typeof window !== 'undefined') {
      const rememberFlag = localStorage.getItem('synthesis_remember_me_flag');
      if (rememberFlag === 'false') {
        // Session-only persistence
        try {
          const sessionUserStr = sessionStorage.getItem('synthesis_session_user');
          if (sessionUserStr) {
            user = JSON.parse(sessionUserStr);
          }
        } catch (e) {}
      } else {
        // Persistent login (default)
        user = getStoredState<User | null>('current_user', null);
        if (!user) {
          try {
            const localUserStr = localStorage.getItem('synthesis_hub_local_user');
            if (localUserStr) {
              user = JSON.parse(localUserStr);
            }
          } catch (e) {}
        }
      }
    }
    if (user && user.email) {
      const lowerEmail = user.email.toLowerCase().trim();
      if (lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail.includes('admin')) {
        user.role = 'admin';
      }
    }
    return user;
  });
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem('tata_ma_pravo_hide_intro') === 'true') return false;
    if (sessionStorage.getItem('tata_ma_pravo_session_intro_dismissed') === 'true') return false;
    // Show intro on first visit if not dismissed
    return false; // Default directly to home view so preview opens immediately without blank screen or blocking intro overlay
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const parsed = parseInternalLink(hash || path, 'home');
      if (parsed.targetTab) return parsed.targetTab;
    }
    return getStoredState<string>('active_tab', 'home');
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalInitialMode(mode);
    setAuthModalOpen(true);
  };

  // Glossary / Dictionary States
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>(null);

  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const handleNavigate = (tabId: string, articleId?: string) => {
    setActiveTab(tabId);
    if (articleId) {
      setSelectedArticleId(articleId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lifed States for full Back-Office Synchronizations
  const [articles, setLocalArticles] = useState<Article[]>(() => {
    const loaded = getStoredState<Article[]>('articles', INITIAL_ARTICLES);
    const initialIds = new Set(INITIAL_ARTICLES.map(a => a.id));
    const customUserArticles = loaded.filter(a => !initialIds.has(a.id));
    return [...INITIAL_ARTICLES, ...customUserArticles];
  });
  const [stories, setLocalStories] = useState<ExperienceStory[]>(() => {
    const loaded = getStoredState<ExperienceStory[]>('stories', INITIAL_STORIES);
    const seen = new Set<string>();
    return loaded.filter(item => {
      if (!item || !item.id) return false;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  });
  const [posts, setLocalPosts] = useState<ForumPost[]>(() => 
    getStoredState<ForumPost[]>('posts', INITIAL_FORUM_POSTS)
  );
  const [comments, setLocalComments] = useState<Comment[]>(() => 
    getStoredState<Comment[]>('comments', INITIAL_COMMENTS)
  );
  const [donations, setLocalDonations] = useState<Donation[]>(() => 
    getStoredState<Donation[]>('donations', INITIAL_DONATIONS)
  );
  const [partners, setLocalPartners] = useState<Partner[]>(() => {
    const loaded = getStoredState<Partner[]>('partners', INITIAL_PARTNERS);
    const algotechP = INITIAL_PARTNERS.find(p => p.id === 'p-algotech');
    const forpsiP = INITIAL_PARTNERS.find(p => p.id === 'p-forpsi');
    const vedosP = INITIAL_PARTNERS.find(p => p.id === 'p-vedos');
    const fbGroupP = INITIAL_PARTNERS.find(p => p.id === 'p-fb-group');
    let updated = loaded;
    if (algotechP && !updated.some(p => p.id === 'p-algotech')) {
      updated = [algotechP, ...updated];
    }
    if (forpsiP && !updated.some(p => p.id === 'p-forpsi')) {
      updated = [forpsiP, ...updated];
    }
    if (fbGroupP && !updated.some(p => p.id === 'p-fb-group')) {
      updated = [fbGroupP, ...updated];
    }
    if (vedosP) {
      updated = updated.map(p => p.id === 'p-vedos' ? vedosP : p);
    }
    return updated;
  });

  // Track if Firebase collections have been successfully loaded
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState<boolean>(false);

  // Helper to create synchronized state setters (Dual Write to Supabase + Firebase)
  const createSyncedSetter = <T extends { id: string }>(
    collectionName: string,
    localSetter: React.Dispatch<React.SetStateAction<T[]>>,
    canWriteCheck: () => boolean
  ) => {
    return (valueOrFunc: React.SetStateAction<T[]>) => {
      localSetter((prev) => {
        const next: T[] = typeof valueOrFunc === 'function'
          ? (valueOrFunc as Function)(prev)
          : valueOrFunc;

        if (canWriteCheck()) {
          // 1. Sync additions and updates DUAL-WRITE to BOTH Supabase & Firebase
          next.forEach(item => {
            const prevItem = prev.find(p => p.id === item.id);
            if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(item)) {
              dbSyncService.dualSaveDocument(collectionName, item.id, item).catch(e =>
                console.error(`Error dual-syncing ${collectionName} item ${item.id}:`, e)
              );
            }
          });

          // 2. Sync deletions DUAL-DELETE from BOTH Supabase & Firebase
          prev.forEach(prevItem => {
            if (!next.some(n => n.id === prevItem.id)) {
              dbSyncService.dualDeleteDocument(collectionName, prevItem.id).catch(e =>
                console.error(`Error dual-deleting ${collectionName} item ${prevItem.id}:`, e)
              );
            }
          });
        }

        return next;
      });
    };
  };

  const setArticles = createSyncedSetter<Article>('articles', setLocalArticles, () => currentUser?.role === 'admin');
  const setStories = createSyncedSetter<ExperienceStory>('stories', setLocalStories, () => true);
  const setPosts = createSyncedSetter<ForumPost>('posts', setLocalPosts, () => !!currentUser);
  const setComments = createSyncedSetter<Comment>('comments', setLocalComments, () => !!currentUser);
  const setDonations = createSyncedSetter<Donation>('donations', setLocalDonations, () => true);
  const setPartners = createSyncedSetter<Partner>('partners', setLocalPartners, () => currentUser?.role === 'admin');

  // 1. Subscribe to Firebase Authentication changes in real-time
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
      if (user && user.role === 'admin' && activeTab === 'home') {
        setActiveTab('admin');
      }
    });
    return () => unsubscribe();
  }, []);

  // Magic Link URL token auto-login handler
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const magicToken = params.get('magic_token');
      const magicEmail = params.get('magic_email');
      if (magicToken && magicEmail) {
        verifyMagicLink(magicEmail, magicToken)
          .then((user) => {
            setCurrentUser(user);
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch((err) => {
            console.warn("Magic link auto login error:", err);
          });
      }
    }
  }, []);

  // Auto-redirect legacy tabs to the new unified structure for 100% backwards compatibility
  useEffect(() => {
    if (['ospod', 'soudni-rizeni', 'vyzivne'].includes(activeTab)) {
      setActiveTab('opatrovnicka-agenda');
    } else if (['pece-o-dite', 'care-simulator'].includes(activeTab)) {
      setActiveTab('plan-pece');
    }
  }, [activeTab]);

  // 2. Fetch data from Supabase / Firestore with resilient multi-tier fallback on initial mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        console.log("[dbSyncService] Initializing dual database synchronization layer...");
        
        const dbArticles = await dbSyncService.dualFetchCollection<Article>('articles', INITIAL_ARTICLES);
        setLocalArticles(dbArticles);

        const dbStories = await dbSyncService.dualFetchCollection<ExperienceStory>('stories', INITIAL_STORIES);
        const seenStories = new Set<string>();
        const uniqueStories = dbStories.filter(item => {
          if (!item || !item.id) return false;
          if (seenStories.has(item.id)) return false;
          seenStories.add(item.id);
          return true;
        });
        setLocalStories(uniqueStories);

        const dbPosts = await dbSyncService.dualFetchCollection<ForumPost>('posts', INITIAL_FORUM_POSTS);
        setLocalPosts(dbPosts);

        const dbComments = await dbSyncService.dualFetchCollection<Comment>('comments', INITIAL_COMMENTS);
        setLocalComments(dbComments);

        const dbDonations = await dbSyncService.dualFetchCollection<Donation>('donations', INITIAL_DONATIONS);
        setLocalDonations(dbDonations);

        const dbPartners = await dbSyncService.dualFetchCollection<Partner>('partners', INITIAL_PARTNERS);
        setLocalPartners(dbPartners);

        setIsFirebaseLoaded(true);
        console.log("[dbSyncService] Dual database collections loaded and active!");
      } catch (err) {
        console.error("[dbSyncService] Failed to load initial collections:", err);
        setIsFirebaseLoaded(true);
      }
    }
    loadInitialData();
  }, []);

  // Listen for the custom global 'open-glossary' event to show the dictionary
  useEffect(() => {
    const handleOpenGlossary = (e: Event) => {
      const termId = (e as CustomEvent).detail;
      setSelectedGlossaryTerm(termId || null);
      setGlossaryOpen(true);
    };
    window.addEventListener('open-glossary', handleOpenGlossary);
    return () => window.removeEventListener('open-glossary', handleOpenGlossary);
  }, []);

  // Listen for global navigation events (e.g. SmartLink clicks or internal routing) and hash changes
  useEffect(() => {
    const handleNavigateEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      const { tab, anchor } = detail;
      if (tab) {
        setActiveTab(tab);
      }
      if (anchor) {
        [50, 150, 350, 600, 1000].forEach(delay => {
          setTimeout(() => {
            scrollToAnchor(anchor);
          }, delay);
        });
      }
    };

    const handleHashOrPopstate = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const parsed = parseInternalLink(hash || path, activeTab);
      if (parsed.targetTab && parsed.targetTab !== activeTab) {
        setActiveTab(parsed.targetTab);
      }
      if (parsed.anchor) {
        [50, 150, 350, 600, 1000].forEach(delay => {
          setTimeout(() => {
            scrollToAnchor(parsed.anchor!);
          }, delay);
        });
      }
    };

    window.addEventListener('app-navigate-tab-anchor', handleNavigateEvent);
    window.addEventListener('hashchange', handleHashOrPopstate);
    window.addEventListener('popstate', handleHashOrPopstate);

    // Initial check on mount if hash or path contains an anchor
    handleHashOrPopstate();

    return () => {
      window.removeEventListener('app-navigate-tab-anchor', handleNavigateEvent);
      window.removeEventListener('hashchange', handleHashOrPopstate);
      window.removeEventListener('popstate', handleHashOrPopstate);
    };
  }, []);

  // Synchronize States to LocalStorage
  useEffect(() => {
    setStoredState('current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStoredState('active_tab', activeTab);
    updatePageSeo(activeTab);
    
    // Check if there is an anchor hash to scroll to first
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const parsed = parseInternalLink(hash, activeTab);

    if (parsed.anchor) {
      [50, 150, 350, 600].forEach(delay => {
        setTimeout(() => {
          scrollToAnchor(parsed.anchor!);
        }, delay);
      });
    } else if (activeTab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const contentElement = document.getElementById('synthesis-main-content');
      if (contentElement) {
        setTimeout(() => {
          contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  useEffect(() => {
    setStoredState('articles', articles);
  }, [articles]);

  useEffect(() => {
    setStoredState('stories', stories);
  }, [stories]);

  useEffect(() => {
    setStoredState('posts', posts);
  }, [posts]);

  useEffect(() => {
    setStoredState('comments', comments);
  }, [comments]);

  useEffect(() => {
    setStoredState('partners', partners);
  }, [partners]);

  useEffect(() => {
    setStoredState('donations', donations);
  }, [donations]);

  // Auth Callbacks
  const handleLogin = (user: User, rememberMe: boolean = true) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        localStorage.setItem('synthesis_remember_me_flag', 'true');
        localStorage.setItem('synthesis_hub_local_user', JSON.stringify(user));
        setStoredState('current_user', user);
        sessionStorage.removeItem('synthesis_session_user');
      } else {
        localStorage.setItem('synthesis_remember_me_flag', 'false');
        sessionStorage.setItem('synthesis_session_user', JSON.stringify(user));
        localStorage.removeItem('synthesis_hub_local_user');
        setStoredState('current_user', null);
      }
    }
    // Redirect to personal workspace on login
    setActiveTab('user-portal');
  };

  const handleLogout = () => {
    logoutUser().catch(e => console.error("Error logging out from Firebase:", e));
    if (typeof window !== 'undefined') {
      localStorage.removeItem('synthesis_hub_local_user');
      localStorage.removeItem('synthesis_remember_me_flag');
      sessionStorage.removeItem('synthesis_session_user');
      setStoredState('current_user', null);
    }
    setCurrentUser(null);
    if (activeTab === 'admin' || activeTab === 'user-portal') {
      setActiveTab('home');
    }
  };

  // Callback when a user submits an experience story to the queue
  const handleStorySubmitted = (newStory: ExperienceStory) => {
    setStories(prev => [newStory, ...prev]);
  };

  if (showIntro) {
    return (
      <IntroScreen 
        onDismiss={(targetTab?: string) => {
          setShowIntro(false);
          if (targetTab) {
            setActiveTab(targetTab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-500 selection:text-white" id="synthesis-hub-app-root">
      
      {/* Navigation Header bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Automatic Page Views DB Tracker */}
      <PageViewTracker activeTab={activeTab} />

      {/* Drobečková navigace (Breadcrumbs) */}
      <Breadcrumbs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace viewport */}
      <main id="synthesis-main-content" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {searchQuery && (
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-3xs" id="global-search-query-indicator">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-teal-100/50 flex items-center justify-center text-teal-600 text-xs">🔍</span>
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block font-bold leading-none mb-1">Aktivní filtr obsahu</span>
                <p className="text-xs text-slate-700">
                  Zobrazují se výsledky odpovídající výrazu: <strong className="text-teal-800 font-display font-bold">"{searchQuery}"</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-3xs cursor-pointer transition-colors"
            >
              Zrušit filtr
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="w-full h-full"
            id={`tab-content-container-${activeTab}`}
          >
            {activeTab === 'home' && (
              <HeroSection
                onNavigate={handleNavigate}
                onOpenAuth={() => setAuthModalOpen(true)}
                isLoggedIn={!!currentUser}
                partners={partners}
              />
            )}

            {activeTab === 'synthesis-hub' && (
              <SynthesisAperioHub setActiveTab={setActiveTab} setSearchQuery={setSearchQuery} />
            )}

            {activeTab === 'rights' && (
              <RightsSection />
            )}

            {activeTab === 'documents' && (
              <KeStazeniSection />
            )}

            {activeTab === 'judikatura' && (
              <JudikaturaSection />
            )}

            {activeTab === 'e-justice' && (
              <EJusticeSection 
                onOpenAiAssistant={() => {
                  setActiveTab('ai-assistant');
                }}
                setActiveTab={setActiveTab}
              />
            )}

            {(activeTab === 'state-laws' || activeTab === 'laws') && (
              <StateLawsSection 
                onOpenAiAssistant={() => {
                  setActiveTab('ai-assistant');
                }}
              />
            )}

            {(activeTab === 'state-statistics' || activeTab === 'statistics') && (
              <StateStatisticsSection 
                onOpenAiAssistant={() => {
                  setActiveTab('ai-assistant');
                }}
              />
            )}

            {activeTab === 'ke-stazeni' && (
              <KeStazeniSection />
            )}

            {activeTab === 'videoteka' && (
              <VideotekaView 
                setActiveTab={setActiveTab} 
                currentUserRole={currentUser?.role} 
                partners={partners} 
              />
            )}

            {activeTab === 'cesta-zakladatele' && (
              <FounderStoryView 
                setActiveTab={setActiveTab} 
                setSearchQuery={setSearchQuery} 
              />
            )}

            {activeTab === 'knihovna-studii' && (
              <KnihovnaStudies />
            )}

            {activeTab === 'vzdelavani' && (
              <VzdelavaniSection />
            )}

            {activeTab === 'pripadova-databaze' && (
              <PripadovaDatabaze />
            )}

            {activeTab === 'centrum-formularu' && (
              <CentrumFormularu />
            )}

            {(activeTab === 'ai-assistant' || activeTab === 'ai-asistent') && (
              <AiAssistantView
                setActiveTab={setActiveTab}
                setSearchQuery={setSearchQuery}
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {activeTab === 'ai-guide' && (
              <AiGuideSection />
            )}

            {(activeTab === 'crisis' || activeTab === 'pruvodce-krizi' || activeTab === 'crisis-navigator' || activeTab === 'navigator') && (
              <CrisisNavigator
                currentUser={currentUser}
                setActiveTab={setActiveTab}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {activeTab === 'ai-case-manager' && (
              <AiCaseManager currentUser={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />
            )}

            {activeTab === 'legal-wiki' && (
              <LegalWiki setActiveTab={setActiveTab} />
            )}

            {activeTab.startsWith('category-') && (
              <CategoryDetailView
                categorySlug={activeTab.replace('category-', '')}
                setActiveTab={setActiveTab}
                setSearchQuery={setSearchQuery}
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {activeTab === 'ai-admin' && (
              <AiAdmin currentUser={currentUser} />
            )}

            {activeTab === 'opatrovnicka-agenda' && (
              <OpatrovnickaAgenda />
            )}

            {(activeTab === 'life-situation' || 
              activeTab === 'zivotni-situace' || 
              activeTab.startsWith('zivotni-situace/') ||
              activeTab === 'zazemi-majetek' || 
              activeTab === 'biff-communicator' || 
              activeTab === 'biff-komunikace' || 
              activeTab === 'konstruktivni-komunikator' ||
              activeTab === 'majetek-sjm' ||
              activeTab === 'psychicka-podpora' ||
              activeTab === 'rozhovor-dite' ||
              activeTab === 'ochrana-manipulace' ||
              activeTab === 'rodinna-mediace' ||
              activeTab === 'bydleni-zazemi') && (
              <LifeSituationSection 
                setActiveTab={setActiveTab} 
                onOpenAuth={() => setAuthModalOpen(true)}
                initialSubTab={activeTab}
              />
            )}

            {activeTab === 'plan-pece' && (
              <PlanPeceODite currentUser={currentUser} onOpenAuth={() => setAuthModalOpen(true)} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'partners' && (
              <PartnersSection partners={partners} />
            )}

            {activeTab === 'advice' && (
              <AdviceSection
                currentUser={currentUser}
                searchQuery={searchQuery}
                comments={comments}
                setComments={setComments}
              />
            )}

            {activeTab === 'stories' && (
              <StoriesSection
                currentUser={currentUser}
                onStorySubmitted={handleStorySubmitted}
                externalStories={stories}
              />
            )}

            {activeTab === 'memento' && (
              <MementoPillar 
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {activeTab === 'forum' && (
              <ForumSection
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
                searchQuery={searchQuery}
                posts={posts}
                setPosts={setPosts}
                comments={comments}
                setComments={setComments}
              />
            )}

            {activeTab === 'contacts' && (
              <KontaktSection
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
                setActiveTab={setActiveTab}
              />
            )}

            {(activeTab === 'tickets' || activeTab === 'ticket-system' || activeTab === 'podpora-tickety') && (
              <TicketSystem
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'crisis-sos' && (
              <CrisisSection 
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'support' && (
              <SupportSection
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
                donations={donations}
                setDonations={setDonations}
              />
            )}

            {activeTab === 'news' && (
              <NewsSection
                searchQuery={searchQuery}
                currentUser={currentUser}
                externalArticles={articles}
                selectedArticleId={selectedArticleId}
                setSelectedArticleId={setSelectedArticleId}
              />
            )}

            {activeTab === 'coparent-hub' && (
              <CoParentHub
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {(activeTab === 'user-portal' || activeTab === 'workspace' || activeTab === 'pracovna' || activeTab === 'dashboard' || activeTab === 'osobni-pracovna') && (
              <PersonalWorkspace
                currentUser={currentUser}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {activeTab === 'profile' && (
              <UserProfile
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
                onUpdateCurrentUser={(user) => setCurrentUser(user)}
              />
            )}

            {(activeTab === 'user-manual' || activeTab === 'manual' || activeTab === 'napoveda') && (
              <UserManualView
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAuth={() => setAuthModalOpen(true)}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'sitemap' && (
              <SitemapTimeline
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenGlossary={() => setGlossaryOpen(true)}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'ai-context' && (
              <AiContextView />
            )}

            {activeTab === 'terms' && (
              <TermsOfService setActiveTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
            )}

            {(activeTab === 'privacy' || activeTab === 'gdpr' || activeTab === 'ochrana-udaju') && (
              <PrivacyPolicy setActiveTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
            )}

            {(activeTab === 'legal-center' || activeTab === 'legal' || activeTab === 'compliance' || activeTab === 'moje-smlouvy' || activeTab === 'legal-docs') && (
              <LegalComplianceCenter
                currentUser={currentUser}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {(activeTab === 'zapoj-se' || activeTab === 'kariera' || activeTab === 'hledame-kolegy' || activeTab === 'join-team' || activeTab === 'kodex' || activeTab === 'dobrovolnicky-kodex') && (
              <JoinTeamSection
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                currentUser={currentUser}
                initialDocTab={activeTab === 'kodex' || activeTab === 'dobrovolnicky-kodex' ? 'kodex' : 'smlouva'}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel
                currentUser={currentUser}
                articles={articles}
                stories={stories}
                posts={posts}
                comments={comments}
                donations={donations}
                partners={partners}
                setArticles={setArticles}
                setStories={setStories}
                setPosts={setPosts}
                setComments={setComments}
                setDonations={setDonations}
                setPartners={setPartners}
                onOpenAuth={() => setAuthModalOpen(true)}
                onQuickSuperAdmin={(user) => handleLogin(user, true)}
                onGoHome={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Související doporučený obsah & akční propojení */}
        <RelatedContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={setActiveTab}
        onOpenIntro={() => setShowIntro(true)}
        onOpenCookies={openCookieConsentModal}
        activeLanguage={language}
        onLanguageChange={setLanguage}
      />

      {/* Glossary Drawer overlay */}
      <GlossaryDrawer
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        initialTermId={selectedGlossaryTerm}
      />

      {/* Security Authentication overlay modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        initialMode={authModalInitialMode}
        onOpenTerms={() => {
          setActiveTab('terms');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPrivacy={() => {
          setActiveTab('privacy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Cookie Consent Banner & Settings Modal */}
      <CookieConsentBanner />

    </div>
  );
}
