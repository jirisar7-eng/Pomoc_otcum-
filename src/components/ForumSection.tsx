/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Scale, 
  FileText, 
  MessageSquare, 
  Coins, 
  MessageCircle, 
  Plus, 
  ArrowLeft, 
  Send, 
  ThumbsUp, 
  Hash, 
  User as UserIcon, 
  ShieldAlert, 
  Search,
  RefreshCw
} from 'lucide-react';
import { ForumCategory, ForumPost, Comment, User } from '../types';
import { INITIAL_FORUM_CATEGORIES, INITIAL_FORUM_POSTS, INITIAL_COMMENTS } from '../initialState';
import SmartVideoEmbed from './SmartVideoEmbed';

interface ForumSectionProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  searchQuery: string;
  posts: ForumPost[];
  setPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

// Map icon string names to actual Lucide components safely
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Scale: Scale,
  FileText: FileText,
  MessageSquare: MessageSquare,
  Coins: Coins
};

export default function ForumSection({ 
  currentUser, 
  onOpenAuth, 
  searchQuery: globalSearchQuery,
  posts,
  setPosts,
  comments,
  setComments
}: ForumSectionProps) {
  // Local state for the interactive forum
  const [categories, setCategories] = useState<ForumCategory[]>(INITIAL_FORUM_CATEGORIES);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // New Post Form states
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostVideoUrl, setNewPostVideoUrl] = useState('');
  const [guestPostName, setGuestPostName] = useState('');
  const [postSpamAnswer, setPostSpamAnswer] = useState('');
  const [postSpamQuestion, setPostSpamQuestion] = useState({ num1: 3, num2: 6, answer: 9 });
  const [postError, setPostError] = useState('');

  // New Reply Form states
  const [newReplyText, setNewReplyText] = useState('');
  const [guestReplyName, setGuestReplyName] = useState('');
  const [replySpamAnswer, setReplySpamAnswer] = useState('');
  const [replySpamQuestion, setReplySpamQuestion] = useState({ num1: 2, num2: 5, answer: 7 });
  const [replyError, setReplyError] = useState('');

  const handleRefreshPostSpam = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setPostSpamQuestion({ num1: n1, num2: n2, answer: n1 + n2 });
    setPostSpamAnswer('');
  };

  const handleRefreshReplySpam = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setReplySpamQuestion({ num1: n1, num2: n2, answer: n1 + n2 });
    setReplySpamAnswer('');
  };

  // Memoized calculations
  const selectedCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  const selectedPost = useMemo(() => {
    return posts.find(p => p.id === selectedPostId) || null;
  }, [posts, selectedPostId]);

  // Filters posts by category and search queries
  const filteredPosts = useMemo(() => {
    let result = posts.filter(p => !p.reported);
    if (selectedCategoryId) {
      result = result.filter(p => p.categoryId === selectedCategoryId);
    }
    const q = globalSearchQuery.toLowerCase();
    if (q) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, selectedCategoryId, globalSearchQuery]);

  const activeComments = useMemo(() => {
    if (!selectedPostId) return [];
    return comments.filter(c => c.contentId === selectedPostId && c.contentType === 'forum' && !c.reported);
  }, [comments, selectedPostId]);

  // Actions
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setPostError('Vyplňte prosím název i obsah tématu.');
      return;
    }

    if (!currentUser && !guestPostName.trim()) {
      setPostError('Vyplňte prosím své jméno nebo se přihlaste.');
      return;
    }

    if (parseInt(postSpamAnswer) !== postSpamQuestion.answer) {
      setPostError('Kontrolní otázka proti spamu je nesprávná.');
      return;
    }

    const tagsArray = newPostTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const newPost: ForumPost = {
      id: 'post-' + Math.random().toString(36).substr(2, 9),
      categoryId: selectedCategoryId || 'cat-1',
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      userId: currentUser?.id || 'usr-guest',
      userName: currentUser?.name || guestPostName.trim(),
      userAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guestPostName || 'G')}`,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      commentsCount: 0,
      tags: tagsArray,
      reported: false,
      videoUrl: newPostVideoUrl.trim() || undefined
    };

    setPosts(prev => [newPost, ...prev]);
    
    // Update category post count
    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategoryId ? { ...cat, postCount: cat.postCount + 1 } : cat
    ));

    // Reset Form
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags('');
    setNewPostVideoUrl('');
    setGuestPostName('');
    setNewPostOpen(false);
    handleRefreshPostSpam();
  };

  const handleCreateReply = (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError('');

    if (!selectedPostId) return;

    if (!newReplyText.trim()) {
      setReplyError('Vyplňte prosím obsah odpovědi.');
      return;
    }

    if (!currentUser && !guestReplyName.trim()) {
      setReplyError('Vyplňte prosím své jméno nebo se přihlaste.');
      return;
    }

    if (parseInt(replySpamAnswer) !== replySpamQuestion.answer) {
      setReplyError('Kontrolní otázka proti spamu je nesprávná.');
      return;
    }

    const newReply: Comment = {
      id: 'comm-' + Math.random().toString(36).substr(2, 9),
      contentId: selectedPostId,
      contentType: 'forum',
      userId: currentUser?.id || 'usr-guest',
      userName: currentUser?.name || guestReplyName.trim(),
      userAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guestReplyName || 'R')}`,
      content: newReplyText.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      reported: false
    };

    setComments(prev => [...prev, newReply]);

    // Update post reply count
    setPosts(prev => prev.map(p => 
      p.id === selectedPostId ? { ...p, commentsCount: p.commentsCount + 1 } : p
    ));

    // Reset Form
    setNewReplyText('');
    setGuestReplyName('');
    handleRefreshReplySpam();
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleLikeReply = (replyId: string) => {
    setComments(prev => prev.map(c => c.id === replyId ? { ...c, likes: c.likes + 1 } : c));
  };

  const handleReportPost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, reported: true } : p));
    alert('Téma bylo nahlášeno moderátorovi k posouzení a dočasně skryto.');
    setSelectedPostId(null);
  };

  const handleReportReply = (replyId: string) => {
    setComments(prev => prev.map(c => c.id === replyId ? { ...c, reported: true } : c));
    alert('Odpověď byla nahlášena moderátorovi k posouzení.');
  };

  return (
    <div className="space-y-6" id="forum-section-container">
      
      {/* 1. VIEW MODE: SHOW CATEGORIES LIST */}
      {!selectedCategoryId && !selectedPostId && (
        <div className="space-y-8" id="forum-categories-view">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Komunitní zóna</span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Diskusní fórum podle témat</h2>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
              Fórum slouží k výměně zkušeností a vzájemné podpoře rodičů. Zvolte si kategorii podle vašeho tématu, projděte si dotazy ostatních nebo založte nové diskusní téma. Všechny příspěvky jsou moderovány proti urážkám a spamu.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="forum-categories-grid">
            {categories.map((cat) => {
              const IconComp = ICON_MAP[cat.iconName] || MessageSquare;
              return (
                <button
                  id={`forum-category-select-${cat.id}`}
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-sm text-left transition-all cursor-pointer flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 text-sm font-display">{cat.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded-md">
                        {cat.postCount} témat
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{cat.description}</p>
                    <span className="text-[10px] font-semibold text-teal-600 flex items-center gap-1 mt-1">
                      Otevřít diskuse &rarr;
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VIEW MODE: SHOW TOPICS/POSTS LIST INSIDE CATEGORY */}
      {selectedCategoryId && !selectedPostId && (
        <div className="space-y-6" id="forum-topics-view">
          
          {/* Breadcrumb / Nav */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
            <button
              id="forum-back-to-categories"
              onClick={() => setSelectedCategoryId(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              Zpět na kategorie fóra
            </button>

            <button
              id="open-new-post-btn"
              onClick={() => setNewPostOpen(!newPostOpen)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-teal-200" />
              Založit nové téma
            </button>
          </div>

          {/* New Post Form Drawer */}
          {newPostOpen && (
            <motion.div
              id="new-topic-form-card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm space-y-4"
            >
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2 flex items-center gap-1">
                <Plus className="w-4 h-4 text-teal-600" />
                Nové téma v kategorii: <span className="text-teal-600">{selectedCategory?.name}</span>
              </h3>

              <form onSubmit={handleCreatePost} className="space-y-3" id="create-topic-form">
                {postError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-2 rounded-lg" id="post-error">
                    {postError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">Název tématu</label>
                    <input
                      id="post-input-title"
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="Stručný a výstižný název dotazu"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">Vaše jméno</label>
                    <input
                      id="post-input-author"
                      type="text"
                      disabled={!!currentUser}
                      value={currentUser ? currentUser.name : guestPostName}
                      onChange={(e) => setGuestPostName(e.target.value)}
                      placeholder={currentUser ? currentUser.name : "Např. David, táta z Plzně"}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none disabled:opacity-70"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">Obsah příspěvku (popište vaši situaci a dotaz)</label>
                  <textarea
                    id="post-input-content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Pište věcně, srozumitelně. Popište svůj dotaz do podrobna, aby vám ostatní mohli co nejlépe poradit..."
                    rows={4}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">Odkaz na video (nepovinné — YouTube, Facebook, Vimeo, TikTok, Instagram)</label>
                  <input
                    id="post-input-video-url"
                    type="text"
                    value={newPostVideoUrl}
                    onChange={(e) => setNewPostVideoUrl(e.target.value)}
                    placeholder="Vložte odkaz na video (např. https://www.youtube.com/watch?v=...)"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">Klíčová slova (oddělená čárkou)</label>
                    <input
                      id="post-input-tags"
                      type="text"
                      value={newPostTags}
                      onChange={(e) => setNewPostTags(e.target.value)}
                      placeholder="např. výživné, soud, tabulky"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                    />
                  </div>
                  
                  {/* Spam Protection */}
                  <div className="flex items-center gap-2 pt-5">
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      Spam ochrana: {postSpamQuestion.num1} + {postSpamQuestion.num2} =
                    </span>
                    <input
                      id="post-spam-input"
                      type="text"
                      value={postSpamAnswer}
                      onChange={(e) => setPostSpamAnswer(e.target.value)}
                      placeholder="?"
                      className="w-12 px-2 py-1 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-center outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleRefreshPostSpam}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    id="cancel-new-post-btn"
                    type="button"
                    onClick={() => setNewPostOpen(false)}
                    className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 text-xs font-semibold rounded-xl"
                  >
                    Zrušit
                  </button>
                  <button
                    id="submit-new-post-btn"
                    type="submit"
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Zveřejnit téma
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Topics Feed */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs space-y-4" id="category-posts-feed">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Kategorie fóra</span>
              <h3 className="text-lg font-bold text-slate-800 font-display">{selectedCategory?.name}</h3>
              <p className="text-slate-500 text-xs mt-0.5">{selectedCategory?.description}</p>
            </div>

            <div className="divide-y divide-slate-100 pt-2" id="topic-list-container">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs italic">V této kategorii zatím nejsou žádná aktivní témata. Buďte první!</div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="py-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors flex items-start justify-between gap-4">
                    <button
                      id={`open-post-thread-${post.id}`}
                      onClick={() => setSelectedPostId(post.id)}
                      className="text-left flex-1 space-y-1.5 cursor-pointer block"
                    >
                      <h4 className="font-bold text-slate-800 text-sm hover:text-teal-600 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-slate-500 text-xs line-clamp-2 max-w-2xl">{post.content}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          {post.userName}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400">{post.date}</span>
                        
                        {post.tags.map(tag => (
                          <span key={tag} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Hash className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>

                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div className="space-y-0.5">
                        <span className="block font-bold text-slate-700 text-xs">{post.commentsCount}</span>
                        <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Odpovědí</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. VIEW MODE: SHOW CORE THREAD & DISCUSS ANSWERS */}
      {selectedPostId && selectedPost && (
        <div className="space-y-6" id="forum-thread-view">
          
          {/* Nav header */}
          <button
            id="back-to-topics-list"
            onClick={() => {
              setSelectedPostId(null);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            Zpět na přehled témat
          </button>

          {/* Core Post Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs space-y-4" id="thread-origin-post">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedPost.userAvatar} 
                  alt={selectedPost.userName} 
                  className="w-10 h-10 rounded-full border border-teal-100"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-700">{selectedPost.userName}</span>
                  <span className="block text-[10px] text-slate-400">{selectedPost.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id={`thread-like-btn-${selectedPost.id}`}
                  onClick={() => handleLikePost(selectedPost.id)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 hover:text-teal-600 border border-slate-100 hover:border-teal-200 rounded-xl text-xs font-bold transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{selectedPost.likes}</span>
                </button>
                <button
                  id={`thread-report-btn-${selectedPost.id}`}
                  onClick={() => handleReportPost(selectedPost.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Nahlásit příspěvek"
                >
                  <ShieldAlert className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base md:text-lg text-slate-800 font-display">{selectedPost.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
              
              {selectedPost.videoUrl && (
                <div className="pt-3 max-w-2xl">
                  <SmartVideoEmbed
                    url={selectedPost.videoUrl}
                    title={selectedPost.title}
                    author={selectedPost.userName}
                    tags={selectedPost.tags}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50">
              {selectedPost.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-slate-50 border border-slate-100 text-slate-500 px-2.5 py-0.5 rounded-lg flex items-center gap-0.5">
                  <Hash className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-4" id="thread-replies-feed">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block pl-1">Odpovědi ({activeComments.length}):</span>
            
            <div className="space-y-4" id="thread-replies-list">
              {activeComments.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-2xl border border-slate-100 text-slate-400 text-xs italic">Zatím žádné odpovědi na toto téma. Pomozte radou!</div>
              ) : (
                activeComments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-2xs flex gap-3 hover:border-slate-200 transition-colors">
                    <img 
                      src={comment.userAvatar} 
                      alt={comment.userName} 
                      className="w-8 h-8 rounded-full border border-teal-100 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-700">{comment.userName}</span>
                        <span className="text-[10px] text-slate-400">{comment.date}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{comment.content}</p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <button
                          id={`reply-like-${comment.id}`}
                          onClick={() => handleLikeReply(comment.id)}
                          className="flex items-center gap-1 text-slate-400 hover:text-teal-600 text-[10px] font-semibold transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{comment.likes}</span>
                        </button>
                        <button
                          id={`reply-report-${comment.id}`}
                          onClick={() => handleReportReply(comment.id)}
                          className="text-slate-300 hover:text-rose-500 text-[9px] font-medium transition-colors flex items-center gap-1"
                          title="Nahlásit odpověď"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Nahlásit
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleCreateReply} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3" id="thread-reply-form">
            <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block">Odpovědět na téma:</span>
            
            {replyError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-2 rounded-lg" id="reply-error">
                {replyError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {!currentUser && (
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="reply-guest-name"
                    type="text"
                    value={guestReplyName}
                    onChange={(e) => setGuestReplyName(e.target.value)}
                    placeholder="Zadejte své jméno"
                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                  />
                </div>
              )}
              
              {/* Spam Protection for Reply */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-medium">
                  Spam kontrola: {replySpamQuestion.num1} + {replySpamQuestion.num2} =
                </span>
                <input
                  id="reply-spam-input"
                  type="text"
                  value={replySpamAnswer}
                  onChange={(e) => setReplySpamAnswer(e.target.value)}
                  placeholder="?"
                  className="w-12 px-2 py-1 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-center outline-none"
                />
                <button
                  type="button"
                  onClick={handleRefreshReplySpam}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            <textarea
              id="reply-text-area"
              value={newReplyText}
              onChange={(e) => setNewReplyText(e.target.value)}
              placeholder="Napište konstruktivní, věcnou a uctivou odpověď..."
              rows={3}
              className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none resize-none"
            />

            <div className="flex justify-end pt-1">
              <button
                id="reply-submit-btn"
                type="submit"
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-teal-300" />
                Odeslat odpověď
              </button>
            </div>
          </form>

        </div>
      )}

    </div>
  );
}
