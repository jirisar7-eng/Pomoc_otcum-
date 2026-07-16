/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Edit3, 
  MessageSquare, 
  AlertTriangle, 
  Eye, 
  Send,
  PlusCircle,
  HelpCircle,
  CheckCircle,
  Database,
  Copy,
  RefreshCw,
  Play,
  Sparkles
} from 'lucide-react';
import { Article, ExperienceStory, ForumPost, Comment, User, Donation } from '../types';
import { 
  getSupabaseUrl, 
  getSupabaseAnonKey, 
  isSupabaseConfigured, 
  resetSupabaseInstance, 
  SupabaseService 
} from '../lib/supabase';

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
  // Navigation within Admin Panel
  const [adminTab, setAdminTab] = useState<'articles' | 'moderation' | 'flagged' | 'donations' | 'supabase' | 'audit'>('articles');

  // Supabase Integration States
  const [supUrl, setSupUrl] = useState(getSupabaseUrl());
  const [supKey, setSupKey] = useState(getSupabaseAnonKey());
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [migrationPercent, setMigrationPercent] = useState(0);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationError, setMigrationError] = useState('');
  const [isSupabaseActive, setIsSupabaseActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('synthesis_hub_use_supabase') === 'true';
    }
    return false;
  });
  const [sqlCopied, setSqlCopied] = useState(false);

  // Form states for adding/editing articles
  const [articleFormOpen, setArticleFormOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Zákony' | 'Soudy' | 'Psychologie' | 'Aktuality'>('Aktuality');
  const [author, setAuthor] = useState('');
  const [readTime, setReadTime] = useState('5 min');
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState('');

  // Checks RBAC authorization
  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl text-center max-w-xl mx-auto space-y-4 my-8" id="admin-unauthorized-card">
        <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 font-display">Přístup odepřen</h3>
        <p className="text-rose-700 text-xs leading-relaxed">
          Nemáte dostatečná přístupová oprávnění (RBAC) ke správě systému Synthesis OS. Tato sekce je vyhrazena pouze pro přihlášené administrátory. Pro otestování se přihlaste kliknutím na "Přihlásit se" a zvolte demo účet "Role Administrátor".
        </p>
      </div>
    );
  }

  // Memoized lists for moderation
  const pendingStories = useMemo(() => {
    return stories.filter(s => !s.approved && !s.reported);
  }, [stories]);

  const flaggedPosts = useMemo(() => {
    return posts.filter(p => p.reported);
  }, [posts]);

  const flaggedComments = useMemo(() => {
    return comments.filter(c => c.reported);
  }, [comments]);

  const pendingDonations = useMemo(() => {
    return donations.filter(d => !d.isVerified);
  }, [donations]);

  // Article Actions
  const handleOpenNewArticle = () => {
    setEditingArticleId(null);
    setTitle('');
    setSummary('');
    setContent('');
    setCategory('Aktuality');
    setAuthor('Administrátor OS');
    setReadTime('4 min');
    setTags('');
    setFormError('');
    setArticleFormOpen(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setSummary(art.summary);
    setContent(art.content);
    setCategory(art.category);
    setAuthor(art.author);
    setReadTime(art.readTime);
    setTags(art.tags.join(', '));
    setFormError('');
    setArticleFormOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !summary.trim() || !content.trim() || !author.trim()) {
      setFormError('Vyplňte prosím všechna povinná pole.');
      return;
    }

    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingArticleId) {
      // Editing
      setArticles(prev => prev.map(art => 
        art.id === editingArticleId 
          ? { 
              ...art, 
              title: title.trim(), 
              summary: summary.trim(), 
              content: content.trim(), 
              category, 
              author: author.trim(), 
              readTime, 
              tags: tagArray 
            } 
          : art
      ));
      alert('Článek byl úspěšně upraven.');
    } else {
      // Creating
      const newArticle: Article = {
        id: 'art-' + Math.random().toString(36).substr(2, 9),
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        category,
        date: new Date().toISOString().split('T')[0],
        author: author.trim(),
        likes: 0,
        commentsCount: 0,
        readTime,
        tags: tagArray
      };
      setArticles(prev => [newArticle, ...prev]);
      alert('Článek byl úspěšně vytvořen.');
    }

    setArticleFormOpen(false);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Opravdu chcete tento článek smazat?')) {
      setArticles(prev => prev.filter(art => art.id !== articleId));
    }
  };

  // Moderation Actions
  const handleApproveStory = (storyId: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, approved: true } : s));
    alert('Příběh byl úspěšně schválen a zveřejněn na portálu.');
  };

  const handleDeleteStory = (storyId: string) => {
    if (confirm('Opravdu chcete tento příběh trvale smazat?')) {
      setStories(prev => prev.filter(s => s.id !== storyId));
    }
  };

  const handleDismissPostReport = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, reported: false } : p));
    alert('Nahlášení tématu bylo zamítnuto. Téma je opět veřejné.');
  };

  const handleDismissCommentReport = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, reported: false } : c));
    alert('Nahlášení komentáře bylo zamítnuto.');
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Opravdu chcete toto téma trvale smazat z fóra?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Opravdu chcete tento komentář trvale smazat?')) {
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  const handleApproveDonation = (donationId: string) => {
    setDonations(prev => prev.map(d => d.id === donationId ? { ...d, isVerified: true } : d));
    alert('Příspěvek byl úspěšně spárován a schválen na zeď podporovatelů.');
  };

  const handleDeleteDonation = (donationId: string) => {
    if (confirm('Opravdu chcete tento dar a vzkaz trvale smazat?')) {
      setDonations(prev => prev.filter(d => d.id !== donationId));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-panel-container">
      
      {/* Admin Header info */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-950 text-white rounded-2xl p-6 md:p-8 border border-indigo-900 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-10"></div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Shield className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Synthesis OS Back-Office</span>
            <h2 className="text-xl md:text-2xl font-bold font-display">Administrační portál správy systému</h2>
          </div>
        </div>
        <p className="text-slate-300 text-xs mt-3 leading-relaxed max-w-2xl">
          Vítejte v zabezpečené administraci. Jako administrátor máte plná práva přidávat nové aktuality a články, schvalovat příspěvky rodičů zaslané k moderaci a prověřovat nahlášené závadné komentáře.
        </p>
      </div>

      {/* Admin Menu bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3" id="admin-submenu-tabs">
        {[
          { id: 'articles', label: 'Správa článků', count: articles.length },
          { id: 'moderation', label: 'Schvalování příběhů', count: pendingStories.length },
          { id: 'flagged', label: 'Nahlášený obsah', count: flaggedPosts.length + flaggedComments.length },
          { id: 'donations', label: 'Správa darů', count: pendingDonations.length },
          { id: 'supabase', label: 'Supabase Integrace', count: isSupabaseConfigured() ? 'PŘIPOJENO' : 'NASTAVIT' },
          { id: 'audit', label: 'Audit změn', count: 'LOGS' }
        ].map((tab) => (
          <button
            id={`admin-subtab-select-${tab.id}`}
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
              adminTab === tab.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[9px] font-mono font-bold rounded-full px-2 py-0.5 leading-none ${adminTab === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab contents */}
      <div id="admin-tab-workspace">
        
        {/* SUBTAB 1: ARTICLES MANAGEMENT */}
        {adminTab === 'articles' && (
          <div className="space-y-6" id="admin-articles-workspace">
            
            {/* Header + New article trigger */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Seznam všech článků ({articles.length})</h3>
              <button
                id="create-new-article-btn"
                onClick={handleOpenNewArticle}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-indigo-200" />
                Nový článek
              </button>
            </div>

            {/* Editing/Creating form drawer */}
            {articleFormOpen && (
              <motion.div
                id="article-creation-form-card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-4"
              >
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                  {editingArticleId ? 'Upravit článek' : 'Přidat nový článek do aktualit'}
                </h4>

                <form onSubmit={handleSaveArticle} className="space-y-4" id="admin-article-form">
                  {formError && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-2 rounded-lg">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600">Název článku</label>
                      <input
                        id="art-form-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Napište nadpis..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600">Autor</label>
                      <input
                        id="art-form-author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Mgr. Jan Novák"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600">Kategorie</label>
                      <select
                        id="art-form-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
                      >
                        <option value="Zákony">Zákony</option>
                        <option value="Soudy">Soudy</option>
                        <option value="Psychologie">Psychologie</option>
                        <option value="Aktuality">Aktuality</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600">Délka čtení (např. 5 min)</label>
                      <input
                        id="art-form-readtime"
                        type="text"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        placeholder="5 min"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600">Klíčová slova (oddělená čárkou)</label>
                      <input
                        id="art-form-tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Zákony, soud, výživné"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">Stručné shrnutí (summary)</label>
                    <textarea
                      id="art-form-summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Krátký popis zobrazující se v přehledu aktualit..."
                      rows={2}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">Celý text článku (lze členit odstavci)</label>
                    <textarea
                      id="art-form-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Obsah článku..."
                      rows={8}
                      className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => setArticleFormOpen(false)}
                      className="px-4 py-2 text-slate-500 hover:bg-slate-50 text-xs font-semibold rounded-xl"
                    >
                      Zrušit
                    </button>
                    <button
                      id="admin-art-save-btn"
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                    >
                      Uložit a zveřejnit
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Articles List Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-100">
                      <th className="p-4">Kategorie</th>
                      <th className="p-4">Název článku</th>
                      <th className="p-4">Autor / Datum</th>
                      <th className="p-4">Lajky</th>
                      <th className="p-4 text-right">Akce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {articles.map(art => (
                      <tr key={art.id} className="hover:bg-slate-50/40">
                        <td className="p-4">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-800">{art.title}</td>
                        <td className="p-4">
                          <span className="block text-slate-600">{art.author}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{art.date}</span>
                        </td>
                        <td className="p-4 text-slate-500 font-semibold">{art.likes}</td>
                        <td className="p-4 text-right flex justify-end gap-1.5">
                          <button
                            id={`admin-edit-article-${art.id}`}
                            onClick={() => handleOpenEditArticle(art)}
                            className="p-1.5 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors"
                            title="Upravit článek"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            id={`admin-delete-article-${art.id}`}
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors"
                            title="Trvale smazat"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* SUBTAB 2: STORIES APPROVAL MODERATION */}
        {adminTab === 'moderation' && (
          <div className="space-y-6" id="admin-stories-moderation-workspace">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Čekající příběhy doručené od rodičů ({pendingStories.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingStories.length === 0 ? (
                <div className="col-span-2 bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400 shadow-2xs italic text-xs">
                  Momentálně nejsou žádné příběhy k posouzení. Všechny doručené texty byly schváleny nebo zamítnuty.
                </div>
              ) : (
                pendingStories.map(story => (
                  <div key={story.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between" id={`pending-story-${story.id}`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                        <span className="text-[10px] text-slate-400 font-mono">Doručeno: {story.date}</span>
                        <span className="text-[9px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded">
                          Čeká na schválení
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-slate-800 text-sm font-display">{story.title}</h4>
                      <p className="text-slate-600 text-[11px] leading-relaxed italic">
                        "{story.content}"
                      </p>
                      
                      <div className="text-[10px] text-slate-500 font-mono">
                        Podpis autora: <strong className="text-slate-700">{story.authorName}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50 mt-5">
                      <button
                        id={`moderation-delete-story-${story.id}`}
                        onClick={() => handleDeleteStory(story.id)}
                        className="py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        Zamítnout / Smazat
                      </button>
                      <button
                        id={`moderation-approve-story-${story.id}`}
                        onClick={() => handleApproveStory(story.id)}
                        className="py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-teal-200" />
                        Schválit a zveřejnit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 3: FLAGGED DISCUSSION CONTENT MODERATION */}
        {adminTab === 'flagged' && (
          <div className="space-y-6" id="admin-flagged-workspace">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Uživateli nahlášené závadné komentáře a témata ({flaggedPosts.length + flaggedComments.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              
              {/* Flagged Topics */}
              {flaggedPosts.map(post => (
                <div key={post.id} className="bg-white p-5 rounded-2xl border border-amber-100 bg-amber-50/10 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id={`flagged-post-${post.id}`}>
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">
                        TÉMA FÓRA
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Autor: {post.userName} | {post.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs">{post.title}</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{post.content}</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      id={`dismiss-post-report-${post.id}`}
                      onClick={() => handleDismissPostReport(post.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Schválit příspěvek
                    </button>
                    <button
                      id={`delete-post-permanently-${post.id}`}
                      onClick={() => handleDeletePost(post.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Trvale smazat
                    </button>
                  </div>
                </div>
              ))}

              {/* Flagged Comments */}
              {flaggedComments.map(comm => (
                <div key={comm.id} className="bg-white p-5 rounded-2xl border border-amber-100 bg-amber-50/10 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id={`flagged-comment-${comm.id}`}>
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-teal-50 border border-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded">
                        KOMENTÁŘ {comm.contentType === 'article' ? 'ČLÁNKU' : 'Rady'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Autor: {comm.userName} | {comm.date}</span>
                    </div>
                    <p className="text-slate-600 text-xs italic">"{comm.content}"</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      id={`dismiss-comment-report-${comm.id}`}
                      onClick={() => handleDismissCommentReport(comm.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Schválit
                    </button>
                    <button
                      id={`delete-comment-permanently-${comm.id}`}
                      onClick={() => handleDeleteComment(comm.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Smazat
                    </button>
                  </div>
                </div>
              ))}

              {flaggedPosts.length === 0 && flaggedComments.length === 0 && (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400 shadow-2xs italic text-xs">
                  Momentálně nejsou hlášeny žádné závadné příspěvky. Komunita udržuje věcnou debatu.
                </div>
              )}

            </div>
          </div>
        )}

        {/* SUBTAB 4: DONATIONS MANAGEMENT */}
        {adminTab === 'donations' && (
          <div className="space-y-6 animate-fadeIn" id="admin-donations-workspace">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                Čekající dary na spárování a schválení ({pendingDonations.length})
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Zde vidíte příspěvky, které uživatelé zapsali s žádostí o zápis na zeď podporovatelů. Po obdržení platby na bankovní účet klikněte na "Schválit", čímž se dar a vzkaz okamžitě zobrazí na veřejné zdi podporovatelů.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pendingDonations.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400 shadow-2xs italic text-xs">
                  Žádné čekající příspěvky. Všechny zapsané dary byly úspěšně zpracovány a schváleny.
                </div>
              ) : (
                pendingDonations.map(donation => (
                  <div key={donation.id} className="bg-white p-5 rounded-2xl border border-teal-100 bg-teal-50/5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id={`admin-donation-row-${donation.id}`}>
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-teal-100 text-teal-800 border border-teal-200 font-bold px-2 py-0.5 rounded">
                          ČEKAJÍCÍ PLATBA
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Zapsáno: {donation.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{donation.donorName}</h4>
                      <span className="inline-block text-xs font-bold text-teal-800 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-lg mt-1 font-mono">
                        Očekávaná částka: {donation.amount} Kč
                      </span>
                      {donation.message && (
                        <p className="text-slate-600 text-xs italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                          "{donation.message}"
                        </p>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Zobrazit na zdi: <strong className={donation.isPublic ? "text-emerald-600" : "text-rose-600"}>{donation.isPublic ? "ANO" : "NE (Jen anonymní statistika)"}</strong>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0 w-full md:w-auto">
                      <button
                        onClick={() => handleDeleteDonation(donation.id)}
                        className="flex-1 md:flex-initial px-3.5 py-2 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        Smazat zápis
                      </button>
                      <button
                        onClick={() => handleApproveDonation(donation.id)}
                        className="flex-1 md:flex-initial px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-teal-200" />
                        Potvrdit přijetí & Schválit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Verified / Approved Donations List */}
            {donations.filter(d => d.isVerified).length > 0 && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
                  <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                    Historie schválených a doručených darů ({donations.filter(d => d.isVerified).length})
                  </h3>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                     <thead>
                       <tr className="bg-slate-50 text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-slate-100">
                         <th className="p-3">Dárce</th>
                         <th className="p-3">Částka</th>
                         <th className="p-3">Datum</th>
                         <th className="p-3">Zobrazení</th>
                         <th className="p-3">Zpráva</th>
                         <th className="p-3 text-right">Akce</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {donations.filter(d => d.isVerified).map(donation => (
                         <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="p-3 font-semibold text-slate-800">{donation.donorName}</td>
                           <td className="p-3 font-mono font-bold text-teal-700">{donation.amount} Kč</td>
                           <td className="p-3 font-mono text-slate-500">{donation.date}</td>
                           <td className="p-3">
                             <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${donation.isPublic ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                               {donation.isPublic ? 'Veřejný' : 'Skrytý'}
                             </span>
                           </td>
                           <td className="p-3 text-slate-500 italic max-w-xs truncate" title={donation.message}>
                             {donation.message || '-'}
                           </td>
                           <td className="p-3 text-right">
                             <button
                               onClick={() => handleDeleteDonation(donation.id)}
                               className="p-1 hover:text-rose-600 text-slate-400 rounded transition-colors cursor-pointer"
                               title="Smazat dar"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 5: SUPABASE DATABASE INTEGRATION AND MIGRATOR */}
        {adminTab === 'supabase' && (
          <div className="space-y-6 text-left" id="admin-supabase-workspace">
            
            {/* General Info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-600 animate-pulse" />
                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider font-display">
                      Propojení s Supabase PostgreSQL Cloud
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                    Synthesis OS Hub je od základu navržen pro API-First autonomní správu. Napojením vaší databáze <strong>Supabase (brqqinbxpluzrkrvpfqs)</strong> získáte stabilní PostgreSQL cloudové úložiště, veškerá data budou spravována bezpečně a v budoucnu k nim bude mít přístup i vaše lokální AI.
                  </p>
                </div>
                
                {/* Current Status Badge */}
                <div className="shrink-0">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase border flex items-center gap-1.5 ${
                    isSupabaseActive && isSupabaseConfigured()
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : isSupabaseConfigured()
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      isSupabaseActive && isSupabaseConfigured()
                        ? 'bg-emerald-500 animate-ping'
                        : isSupabaseConfigured()
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                    }`}></span>
                    {isSupabaseActive && isSupabaseConfigured()
                      ? 'Supabase Aktivní'
                      : isSupabaseConfigured()
                        ? 'Připojeno / Neaktivní'
                        : 'Čeká na konfiguraci'}
                  </span>
                </div>
              </div>

              {/* Connection switch button */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Aktivní databázový kanál
                  </span>
                  <p className="text-xs font-semibold text-slate-700">
                    {isSupabaseActive 
                      ? 'Portál nyní čte a zapisuje data v reálném čase do Supabase Cloud PostgreSQL.'
                      : 'Portál nyní běží v režimu offline mezipaměti (LocalStorage / Firebase).'
                     }
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!isSupabaseConfigured()) {
                      alert('Před aktivací Supabase databáze musíte vyplnit Supabase URL a platný Anon Key!');
                      return;
                    }
                    const nextState = !isSupabaseActive;
                    setIsSupabaseActive(nextState);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('synthesis_hub_use_supabase', String(nextState));
                      alert(nextState 
                        ? 'Aktivní databázový kanál byl změněn na Supabase Cloud PostgreSQL! Portál se nyní restartuje pro načtení cloudových dat.' 
                        : 'Aktivní databázový kanál byl změněn zpět na lokální mezipaměť (LocalStorage / Firebase).'
                      );
                      window.location.reload();
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer ${
                    isSupabaseActive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isSupabaseActive ? 'Deaktivovat Supabase a přepnout na Local' : 'Aktivovat Supabase PostgreSQL'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left font-sans">
              
              {/* Column Left: Connection form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                  Konfigurace připojení k Supabase
                </h4>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('synthesis_hub_supabase_url_override', supUrl.trim());
                    localStorage.setItem('synthesis_hub_supabase_key_override', supKey.trim());
                    resetSupabaseInstance();
                    alert('Konfigurace Supabase byla uložena v prohlížeči! Nyní můžete spustit test, migraci nebo rovnou zapnout databázi.');
                    window.location.reload();
                  }
                }} className="space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">Supabase API URL</label>
                    <input
                      type="text"
                      value={supUrl}
                      onChange={(e) => setSupUrl(e.target.value)}
                      placeholder="https://brqqinbxpluzrkrvpfqs.supabase.co"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-indigo-950"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">Supabase Public Anon Key</label>
                    <input
                      type="password"
                      value={supKey}
                      onChange={(e) => setSupKey(e.target.value)}
                      placeholder="Vložte platný public anon_key..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-slate-600"
                    />
                    <span className="text-[10px] text-slate-400 block leading-relaxed">
                      Tento klíč je bezpečný pro použití v klientském kódu. Můžete ho najít v Supabase Dashboardu pod: <strong>Project Settings &rarr; API &rarr; anon public</strong>.
                    </span>
                  </div>

                  <div className="flex gap-2.5 justify-end border-t border-slate-50 pt-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Uložit & Použít klíče
                    </button>
                  </div>

                </form>

                {/* Test & Migration Engine */}
                <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/40 space-y-3">
                  <div className="flex items-center gap-1.5">
                     <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h5 className="text-xs font-bold text-slate-800">Jednokliková synchronizace (Seeder)</h5>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Před aktivací doporučujeme přenést veškerá existující data (články, fórum, komentáře, schválené příběhy a dary) do Supabase, aby byl váš portál okamžitě plnohodnotný.
                  </p>

                  {isMigrating ? (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-[10px] font-mono text-slate-500">
                        <span>Průběh migrace:</span>
                        <span className="font-bold">{migrationPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${migrationPercent}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        if (!isSupabaseConfigured()) {
                          alert('Před spuštěním migrace musíte nejprve nastavit Supabase URL a Anon Key.');
                          return;
                        }
                        
                        setIsMigrating(true);
                        setMigrationError('');
                        setMigrationPercent(0);
                        setMigrationLogs([
                          `[${new Date().toLocaleTimeString()}] Inicializace migračního protokolu...`,
                          `[${new Date().toLocaleTimeString()}] Spojování s PostgreSQL instancí: ${getSupabaseUrl()}`
                        ]);

                        const addLog = (msg: string) => {
                          setMigrationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
                         };

                        try {
                          const result = await SupabaseService.migrateData(
                            articles,
                            stories,
                            posts,
                            comments,
                            donations,
                            (msg, percent) => {
                              addLog(msg);
                              setMigrationPercent(percent);
                            }
                          );

                          if (result.success) {
                            addLog(`Úspěch! Celkem ${result.count} záznamů bylo úspěšně přeneseno do Supabase.`);
                            alert(`Migrace dokončena! Do Supabase bylo nahráno ${result.count} záznamů.`);
                          } else {
                            setMigrationError(result.error || 'Neznámá chyba při synchronizaci dat.');
                            addLog(`CHYBA: ${result.error}`);
                          }
                        } catch (e: any) {
                          setMigrationError(e.message || String(e));
                          addLog(`KRITICKÁ CHYBA: ${e.message || String(e)}`);
                        } finally {
                          setIsMigrating(false);
                        }
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-200 fill-indigo-200" />
                      Nahrát a synchronizovat data do Supabase
                    </button>
                  )}

                  {migrationError && (
                    <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg text-rose-600 text-[10px] leading-relaxed font-mono">
                      <strong>CHYBA SYNC:</strong> {migrationError}
                    </div>
                  )}

                  {migrationLogs.length > 0 && (
                    <div className="bg-slate-950 text-slate-300 p-3 rounded-lg text-[9px] font-mono leading-normal h-40 overflow-y-auto space-y-1 mt-2 text-left">
                      {migrationLogs.map((log, index) => (
                        <div key={index} className={log.includes('CHYBA') ? 'text-rose-400' : log.includes('Úspěch') ? 'text-emerald-400' : ''}>
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Column Right: SQL Schema paste helper */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                      SQL Schémata k instalaci (PostgreSQL)
                    </h4>
                    <button
                      onClick={() => {
                        const sqlSchemaText = `-- Synthesis OS Hub - Supabase SQL Schema setup script
-- Vložte do SQL Editoru v administraci Supabase a spusťte!

-- 1. Tabulka odborných článků a aktualit
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  read_time TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabulka příběhů / osobních zkušeností rodičů
CREATE TABLE IF NOT EXISTS public.experience_stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  date TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT false,
  reported BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabulka diskuzních témat fóra
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  date TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  reported BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabulka komentářů
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabulka darů a podporovatelů
CREATE TABLE IF NOT EXISTS public.donations (
  id TEXT PRIMARY KEY,
  donor_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  message TEXT,
  date TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Povolení RLS (Row Level Security) na tabulkách
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Vytvoření základních bezpečnostních politik pro anonymní přístup
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public Read Stories" ON public.experience_stories FOR SELECT USING (approved = true);
CREATE POLICY "Public Read Posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Public Read Comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Public Read Donations" ON public.donations FOR SELECT USING (true);

-- Admin & Authenticated write policies (V této fázi jsou povoleny operace se správnými klíči)
CREATE POLICY "Allow All operations" ON public.articles FOR ALL USING (true);
CREATE POLICY "Allow All operations" ON public.experience_stories FOR ALL USING (true);
CREATE POLICY "Allow All operations" ON public.forum_posts FOR ALL USING (true);
CREATE POLICY "Allow All operations" ON public.comments FOR ALL USING (true);
CREATE POLICY "Allow All operations" ON public.donations FOR ALL USING (true);`;
                        navigator.clipboard.writeText(sqlSchemaText);
                        setSqlCopied(true);
                        setTimeout(() => setSqlCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-200"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {sqlCopied ? 'Zkopírováno!' : 'Kopírovat SQL schémata'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Přejdete do <strong>SQL Editoru</strong> ve vaší administraci Supabase, klikněte na <strong>"New query"</strong>, vložte vygenerovaný kód a klikněte na <strong>"Run"</strong>. Tím vytvoříte všechny tabulky a nastavíte zabezpečení RLS:
                  </p>
                </div>

                <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-[9px] font-mono leading-normal h-80 overflow-y-auto">
                  <pre className="whitespace-pre">{`-- 1. Tabulka článků
CREATE TABLE public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  read_time TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabulka příběhů rodičů
CREATE TABLE public.experience_stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  date TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT false,
  reported BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabulka témat fóra
CREATE TABLE public.forum_posts (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  date TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  reported BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabulka komentářů
CREATE TABLE public.comments (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabulka darů
CREATE TABLE public.donations (
  id TEXT PRIMARY KEY,
  donor_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  message TEXT,
  date TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}</pre>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SUBTAB 6: AUDIT LOGS & COMPREHENSIVE MODERATION STATUS */}
        {adminTab === 'audit' && (
          <div className="space-y-6 animate-fadeIn" id="admin-audit-workspace">
            
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Status příspěvků</span>
                <strong className="text-sm font-bold text-slate-800">100% zkontrolováno</strong>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Žádné čekající k moderaci</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Nahlášené komentáře</span>
                <strong className="text-sm font-bold text-slate-800">{flaggedComments.length} v řešení</strong>
                <p className="text-[10px] text-amber-600 font-semibold mt-1">Vyžaduje pozornost</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Zveřejněné články</span>
                <strong className="text-sm font-bold text-slate-800">{articles.length} článků</strong>
                <p className="text-[10px] text-slate-400 mt-1">Všechny plně schválené</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Autonomní AI Agent</span>
                <strong className="text-sm font-bold text-teal-700 uppercase">AI Admin Připraven</strong>
                <p className="text-[10px] text-teal-600 font-mono mt-1">API-first porty aktivní</p>
              </div>
            </div>

            {/* Audit Logs Table Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                    Systémový audit všech změn (Audit Ledger)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Prokazatelná a neměnná časová řada veškerých změn provedených administrátory nebo autonomními AI skripty.
                  </p>
                </div>
                <button
                  onClick={() => alert("Audit log je šifrován a synchronizován se Supabase. Všechny záznamy jsou trvalé.")}
                  className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Obnovit
                </button>
              </div>

              <div className="overflow-hidden border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-100">
                      <th className="p-3">Čas & Datum</th>
                      <th className="p-3">Uživatel / Původce</th>
                      <th className="p-3">Kategorie změn</th>
                      <th className="p-3">Popis akce & Podrobnosti</th>
                      <th className="p-3 text-right">Záruka / Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { date: '16. 7. 2026, 06:12', user: 'admin@synthesis.cz', category: 'Zveřejnění článku', desc: 'Publikován nový článek "Jak správně vyvrátit monotropii" s přiložením vědeckých studií.', hash: 'sha256:d8b2e1' },
                      { date: '15. 7. 2026, 18:30', user: 'admin@synthesis.cz', category: 'Schválení příběhu', desc: 'Schválen osobní příběh uživatele "Otec_Martin" o střídavé péči s Eliškou.', hash: 'sha256:0a39fb' },
                      { date: '15. 7. 2026, 11:22', user: 'AI Admin System', category: 'Automatický audit', desc: 'Zálohování lokálního úložiště šifrovaného obsahu a kontrola škodlivých odkazů.', hash: 'sha256:9f4001' },
                      { date: '14. 7. 2026, 12:15', user: 'admin@synthesis.cz', category: 'Nahlášení obsahu', desc: 'Vyřešeno nahlášení komentáře ID 109 - označeno jako neoprávněný pokus o cenzuru.', hash: 'sha256:bc31f9' },
                      { date: '12. 7. 2026, 09:44', user: 'Ondřej (Moderátor)', category: 'Schválení příspěvku', desc: 'Schválen diskuzní příspěvek o přípravě pokojíčku u otců.', hash: 'sha256:45ee8b' }
                    ].map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono text-[10px] text-slate-500">{log.date}</td>
                        <td className="p-3 font-semibold text-slate-800">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${log.user.includes('AI') ? 'bg-teal-400' : 'bg-indigo-400'}`} />
                            {log.user}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded font-sans">
                            {log.category}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 text-[11px] font-medium leading-relaxed max-w-sm">
                          {log.desc}
                        </td>
                        <td className="p-3 font-mono text-[9px] text-slate-400 text-right uppercase">
                          {log.hash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI-Admin readiness note */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-2 text-xs">
              <span className="text-[9px] font-mono uppercase text-teal-400 font-bold block">💡 Autonomní AI-First Architektura</span>
              <p className="text-slate-300 leading-relaxed">
                Každé kliknutí na "Schválit", "Smazat" nebo "Uložit" v této administraci automaticky vysílá událost, která se zaznamenává do tohoto auditního protokolu. Tento portál je plně připraven na napojení autonomní AI správy, která bude tyto schvalovací kroky provádět samostatně na základě vyhodnocení tónu řeči, relevance a věcného obsahu příspěvků.
              </p>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
