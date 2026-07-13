/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Scale, Heart, Shield } from 'lucide-react';

import { User, Article, ExperienceStory, ForumPost, Comment, Donation } from './types';
import { 
  getStoredState, 
  setStoredState, 
  INITIAL_ARTICLES, 
  INITIAL_STORIES, 
  INITIAL_FORUM_POSTS, 
  INITIAL_COMMENTS,
  INITIAL_DONATIONS
} from './mockData';
import { 
  subscribeToAuth, 
  getCollectionData, 
  saveDocument, 
  deleteDocument,
  logoutUser 
} from './lib/firebase';

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

export default function App() {
  // Global Authentication & Navigation States
  const [currentUser, setCurrentUser] = useState<User | null>(() => 
    getStoredState<User | null>('current_user', null)
  );
  const [activeTab, setActiveTab] = useState<string>(() => 
    getStoredState<string>('active_tab', 'home')
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

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

        if (isFirebaseLoaded && canWriteCheck()) {
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

  // 2. Fetch data from Firestore on initial mount
  useEffect(() => {
    async function loadFirestoreData() {
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

        setIsFirebaseLoaded(true);
        console.log("Firestore database synchronized successfully!");
      } catch (err) {
        console.error("Failed to load initial collections from Firestore:", err);
        // Fallback: mark as loaded anyway so edits can persist
        setIsFirebaseLoaded(true);
      }
    }
    loadFirestoreData();
  }, []);

  // Synchronize States to LocalStorage
  useEffect(() => {
    setStoredState('current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStoredState('active_tab', activeTab);
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
    setStoredState('donations', donations);
  }, [donations]);

  // Auth Callbacks
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // If logged in as admin, redirect to admin panel immediately for preview convenience
    if (user.role === 'admin') {
      setActiveTab('admin');
    }
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

      {/* Main Content Workspace viewport */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
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

            {activeTab === 'ospod' && (
              <OspodSection />
            )}

            {activeTab === 'soudni-rizeni' && (
              <SoudniRizeniSection />
            )}

            {activeTab === 'vyzivne' && (
              <VyzivneSection />
            )}

            {activeTab === 'pece-o-dite' && (
              <PeceODiteSection currentUser={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />
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
              <KontaktSection />
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

            {activeTab === 'admin' && (
              <AdminPanel
                currentUser={currentUser}
                articles={articles}
                stories={stories}
                posts={posts}
                comments={comments}
                donations={donations}
                setArticles={setArticles}
                setStories={setStories}
                setPosts={setPosts}
                setComments={setComments}
                setDonations={setDonations}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Breathtaking and Professional Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800" id="synthesis-hub-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Branding & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span className="font-bold text-base font-display">Táta má právo</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Dítě potřebuje oba rodiče. Tento web vznikl proto, aby pomohl rodičům lépe se orientovat v opatrovnických řízeních, sdílet zkušenosti a najít užitečné informace.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">Užitečné sekce</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <button onClick={() => setActiveTab('soudni-rizeni')} className="text-left hover:text-teal-400 transition-colors cursor-pointer">Soudní řízení</button>
                <button onClick={() => setActiveTab('ke-stazeni')} className="text-left hover:text-teal-400 transition-colors cursor-pointer">Vzory podání</button>
                <button onClick={() => setActiveTab('vyzivne')} className="text-left hover:text-teal-400 transition-colors cursor-pointer">Výpočet výživného</button>
                <button onClick={() => setActiveTab('pece-o-dite')} className="text-left hover:text-teal-400 transition-colors cursor-pointer">Péče o dítě</button>
                <button onClick={() => setActiveTab('support')} className="text-left text-teal-400 hover:text-teal-300 font-bold transition-colors cursor-pointer flex items-center gap-1 col-span-2 mt-1">
                  <Heart className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Podpořit chod webu
                </button>
              </div>
            </div>

            {/* Disclaimer & Conditions of Use */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">Podmínky užívání & AI Prohlášení</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Tento web je budován svépomocí za použití umělé inteligence (AI), odborných zdrojů a mých vlastních zkušeností z opatrovnických sporů. <strong>Autor není právník ani nemá právní či psychologické vzdělání.</strong> Veškeré informace a vzory dokumentů jsou pouze <strong>informačního charakteru</strong>, mohou obsahovat chyby a jejich užitím souhlasíte s tím, že autor <strong>nenese žádnou odpovědnost</strong> za případné chyby, nepřesnosti či následky jejich použití. Vždy si informace ověřte.
              </p>
            </div>

          </div>

          <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
            <div>
              © 2026 Táta má právo. Vyvinuto s nejvyšším ohledem na blaho dětí. Vytvořil Jiří Š. pod záštitou studia Synthesis.
            </div>
            <div className="flex gap-4 mt-2 md:mt-0">
              <span className="flex items-center gap-1 text-slate-400">
                <Shield className="w-3.5 h-3.5" />
                RBAC aktivní
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Scale className="w-3.5 h-3.5" />
                Nestrannost garantována
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Synthesis AI Assistant floating widget */}
      <AiAssistant />

      {/* Security Authentication overlay modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
      />

    </div>
  );
}
