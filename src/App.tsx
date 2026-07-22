/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Scale, Heart, Shield, BookOpen } from 'lucide-react';

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

import Breadcrumbs from './components/Breadcrumbs';
import RelatedContent from './components/RelatedContent';
import { updatePageSeo } from './lib/seo';

// Component imports
import Navigation from './components/Navigation';
import AuthModal from './components/AuthModal';
import HeroSection from './components/HeroSection';
import RightsSection from './components/RightsSection';
import DocumentsSection from './components/DocumentsSection';
import AdviceSection from './components/AdviceSection';
import StoriesSection from './components/StoriesSection';
import ForumSection from './components/ForumSection';
import ContactsSection from './components/ContactsSection';
import NewsSection from './components/NewsSection';
import AdminPanel from './components/AdminPanel';
import AiAssistant from './components/AiAssistant';

// New High-Fidelity Opatrovnický Průvodce Sections
import JudikaturaSection from './components/JudikaturaSection';
import OspodSection from './components/OspodSection';
import SoudniRizeniSection from './components/SoudniRizeniSection';
import VyzivneSection from './components/VyzivneSection';
import PeceODiteSection from './components/PeceODiteSection';
import KeStazeniSection from './components/KeStazeniSection';
import KontaktSection from './components/KontaktSection';
import CrisisSection from './components/CrisisSection';
import SupportSection from './components/SupportSection';
import CoParentHub from './components/CoParentHub';
import GlossaryDrawer from './components/GlossaryDrawer';
import AiGuideSection from './components/AiGuideSection';
import UserPortal from './components/UserPortal';
import UserProfile from './components/UserProfile';
import SitemapTimeline from './components/SitemapTimeline';
import CareSimulator from './components/CareSimulator';

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

export default function App() {
  const { t } = useLanguage();
  // Global Authentication & Navigation States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    let user = getStoredState<User | null>('current_user', null);
    if (!user && typeof window !== 'undefined') {
      try {
        const localUserStr = localStorage.getItem('synthesis_hub_local_user');
        if (localUserStr) {
          user = JSON.parse(localUserStr);
        }
      } catch (e) {}
    }
    if (user && user.email) {
      const lowerEmail = user.email.toLowerCase().trim();
      if (lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail.includes('admin')) {
        user.role = 'admin';
      }
    }
    return user;
  });
  const [showIntro, setShowIntro] = useState<boolean>(() => localStorage.getItem('tata_ma_pravo_hide_intro') !== 'true');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Glossary / Dictionary States
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>(null);

  // Lifed States for full Back-Office Synchronizations
  const [articles, setLocalArticles] = useState<Article[]>(() => 
    getStoredState<Article[]>('articles', INITIAL_ARTICLES)
  );
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
  const [partners, setLocalPartners] = useState<Partner[]>(() => 
    getStoredState<Partner[]>('partners', INITIAL_PARTNERS)
  );

  // Track if Firebase collections have been successfully loaded
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState<boolean>(false);

  // Helper to create synchronized state setters
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

        const useSupabase = localStorage.getItem('synthesis_hub_use_supabase') === 'true' && isSupabaseConfigured();

        if (useSupabase) {
          // 1. Sync additions and updates to Supabase
          next.forEach(item => {
            const prevItem = prev.find(p => p.id === item.id);
            if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(item)) {
              if (collectionName === 'articles') {
                SupabaseService.saveArticle(item as any);
              } else if (collectionName === 'stories') {
                SupabaseService.saveStory(item as any);
              } else if (collectionName === 'posts') {
                SupabaseService.saveForumPost(item as any);
              } else if (collectionName === 'comments') {
                SupabaseService.saveComment(item as any);
              } else if (collectionName === 'donations') {
                SupabaseService.saveDonation(item as any);
              }
            }
          });

          // 2. Sync deletions to Supabase
          prev.forEach(prevItem => {
            if (!next.some(n => n.id === prevItem.id)) {
              if (collectionName === 'articles') {
                SupabaseService.deleteArticle(prevItem.id);
              } else if (collectionName === 'stories') {
                SupabaseService.deleteStory(prevItem.id);
              } else if (collectionName === 'posts') {
                SupabaseService.deleteForumPost(prevItem.id);
              } else if (collectionName === 'comments') {
                SupabaseService.deleteComment(prevItem.id);
              } else if (collectionName === 'donations') {
                SupabaseService.deleteDonation(prevItem.id);
              }
            }
          });
        } else if (isFirebaseLoaded && canWriteCheck()) {
          // 1. Sync additions and updates
          next.forEach(item => {
            const prevItem = prev.find(p => p.id === item.id);
            if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(item)) {
              saveDocument(collectionName, item.id, item).catch(e =>
                console.error(`Error syncing ${collectionName} item ${item.id}:`, e)
              );
            }
          });

          // 2. Sync deletions
          prev.forEach(prevItem => {
            if (!next.some(n => n.id === prevItem.id)) {
              deleteDocument(collectionName, prevItem.id).catch(e =>
                console.error(`Error deleting ${collectionName} item ${prevItem.id}:`, e)
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

  // 2. Fetch data from Firestore / Supabase on initial mount
  useEffect(() => {
    async function loadInitialData() {
      const useSupabase = localStorage.getItem('synthesis_hub_use_supabase') === 'true' && isSupabaseConfigured();
      if (useSupabase) {
        try {
          console.log("Loading initial database collections from Supabase PostgreSQL...");
          
          const dbArticles = await SupabaseService.fetchArticles();
          if (dbArticles && dbArticles.length > 0) setLocalArticles(dbArticles);

          const dbStories = await SupabaseService.fetchStories();
          if (dbStories && dbStories.length > 0) {
            const seenStories = new Set<string>();
            const uniqueStories = dbStories.filter(item => {
              if (!item || !item.id) return false;
              if (seenStories.has(item.id)) return false;
              seenStories.add(item.id);
              return true;
            });
            setLocalStories(uniqueStories);
          }

          const dbPosts = await SupabaseService.fetchForumPosts();
          if (dbPosts && dbPosts.length > 0) setLocalPosts(dbPosts);

          const dbComments = await SupabaseService.fetchComments();
          if (dbComments && dbComments.length > 0) setLocalComments(dbComments);

          const dbDonations = await SupabaseService.fetchDonations();
          if (dbDonations && dbDonations.length > 0) setLocalDonations(dbDonations);

          setIsFirebaseLoaded(true);
          console.log("Supabase database loaded and active!");
          return;
        } catch (err) {
          console.error("Failed to load initial collections from Supabase:", err);
          // Fall back to Firestore if Supabase fails
        }
      }

      try {
        console.log("Loading initial database collections from Firestore...");
        
        const dbArticles = await getCollectionData<Article>('articles', INITIAL_ARTICLES);
        setLocalArticles(dbArticles);

        const dbStories = await getCollectionData<ExperienceStory>('stories', INITIAL_STORIES);
        const seenStories = new Set<string>();
        const uniqueStories = dbStories.filter(item => {
          if (!item || !item.id) return false;
          if (seenStories.has(item.id)) return false;
          seenStories.add(item.id);
          return true;
        });
        setLocalStories(uniqueStories);

        const dbPosts = await getCollectionData<ForumPost>('posts', INITIAL_FORUM_POSTS);
        setLocalPosts(dbPosts);

        const dbComments = await getCollectionData<Comment>('comments', INITIAL_COMMENTS);
        setLocalComments(dbComments);

        const dbDonations = await getCollectionData<Donation>('donations', INITIAL_DONATIONS);
        setLocalDonations(dbDonations);

        const dbPartners = await getCollectionData<Partner>('partners', INITIAL_PARTNERS);
        setLocalPartners(dbPartners);

        setIsFirebaseLoaded(true);
        console.log("Firestore database synchronized successfully!");
      } catch (err) {
        console.error("Failed to load initial collections from Firestore:", err);
        // Fallback: mark as loaded anyway so edits can persist
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

  // Synchronize States to LocalStorage
  useEffect(() => {
    setStoredState('current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStoredState('active_tab', activeTab);
    updatePageSeo(activeTab);
    
    // Smooth scroll to the content area or page top on tab selection
    if (activeTab === 'home') {
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
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Redirect to personal workspace on login
    setActiveTab('user-portal');
  };

  const handleLogout = () => {
    logoutUser().catch(e => console.error("Error logging out from Firebase:", e));
    setCurrentUser(null);
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // Callback when a user submits an experience story to the queue
  const handleStorySubmitted = (newStory: ExperienceStory) => {
    setStories(prev => [newStory, ...prev]);
  };

  if (showIntro) {
    return <IntroScreen onDismiss={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-500 selection:text-white" id="synthesis-hub-app-root">
      
      {/* Navigation Header bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

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
                onNavigate={setActiveTab}
                onOpenAuth={() => setAuthModalOpen(true)}
                isLoggedIn={!!currentUser}
                partners={partners}
              />
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

            {activeTab === 'ai-guide' && (
              <AiGuideSection />
            )}

            {activeTab === 'ai-case-manager' && (
              <AiCaseManager currentUser={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />
            )}

            {activeTab === 'legal-wiki' && (
              <LegalWiki />
            )}

            {activeTab === 'ai-admin' && (
              <AiAdmin />
            )}

            {activeTab === 'opatrovnicka-agenda' && (
              <OpatrovnickaAgenda />
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
              />
            )}

            {activeTab === 'crisis' && (
              <CrisisSection />
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
              />
            )}

            {activeTab === 'coparent-hub' && (
              <CoParentHub
                currentUser={currentUser}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {activeTab === 'user-portal' && (
              <UserPortal
                currentUser={currentUser}
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
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Související doporučený obsah & akční propojení */}
        {activeTab !== 'home' && (
          <RelatedContent activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Breathtaking and Professional Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800" id="synthesis-hub-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Branding & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span className="font-bold text-base font-display">{t('brand_name', 'Táta má právo')}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                {t('brand_mission')}
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">{t('footer_useful_sections', 'Užitečné sekce')}</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <button onClick={() => setActiveTab('opatrovnicka-agenda')} className="text-left hover:text-teal-400 transition-colors cursor-pointer">{t('nav_opatrovnicka_agenda', 'Opatrovnická agenda')}</button>
                <button onClick={() => setActiveTab('ke-stazeni')} className="text-left hover:text-teal-400 transition-colors cursor-pointer">{t('nav_ke_stazeni', 'Vzory podání')}</button>
                <button onClick={() => setActiveTab('plan-pece')} className="text-left hover:text-teal-400 transition-colors cursor-pointer">{t('nav_plan_pece', 'Plán péče')}</button>
                <button onClick={() => setActiveTab('user-portal')} className="text-left hover:text-teal-400 transition-colors cursor-pointer">{t('nav_user_portal', 'Moje Pracovna')}</button>
                <button onClick={() => { setActiveTab('sitemap'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-left hover:text-teal-400 font-bold text-teal-400 transition-colors cursor-pointer flex items-center gap-1 mt-1">
                  📂 {t('btn_sitemap', 'Mapa stránek & Vývoj')}
                </button>
                <button onClick={() => setActiveTab('support')} className="text-left text-teal-400 hover:text-teal-300 font-bold transition-colors cursor-pointer flex items-center gap-1 mt-1">
                  <Heart className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> {t('btn_support', 'Podpořit chod webu')}
                </button>
              </div>
            </div>

            {/* Disclaimer & Conditions of Use */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">{t('footer_disclaimer_title', 'Podmínky užívání & AI Prohlášení')}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {t('footer_disclaimer_text')}
              </p>
            </div>

          </div>

          <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
            <div>
              {t('footer_copyright')}
            </div>
            <div className="flex flex-wrap gap-4 mt-2 md:mt-0 items-center">
              <LanguageSwitcher />
              <button
                onClick={() => { setActiveTab('sitemap'); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                className="text-teal-400 hover:text-teal-300 font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1 mr-2"
              >
                📂 {t('btn_sitemap', 'Mapa stránek & Vývoj projektu')}
              </button>
              <span className="flex items-center gap-1 text-slate-400">
                <Shield className="w-3.5 h-3.5" />
                {t('footer_rbac', 'RBAC aktivní')}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Scale className="w-3.5 h-3.5" />
                {t('footer_neutrality', 'Nestrannost garantována')}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Synthesis AI Assistant floating widget */}
      <AiAssistant />

      {/* Floating Glossary Widget on the bottom left */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start font-sans" id="glossary-floating-widget">
        <button
          onClick={() => setGlossaryOpen(true)}
          className="w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-lg hover:shadow-teal-600/20 cursor-pointer group transition-all"
          title="Otevřít odborný slovník pojmů"
        >
          <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute left-14 bg-slate-850 text-white font-bold text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider border border-slate-700/50">
            Slovník pojmů
          </span>
        </button>
      </div>

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
      />

    </div>
  );
}
