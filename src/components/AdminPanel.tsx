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
  CheckCircle
} from 'lucide-react';
import { Article, ExperienceStory, ForumPost, Comment, User } from '../types';

interface AdminPanelProps {
  currentUser: User | null;
  articles: Article[];
  stories: ExperienceStory[];
  posts: ForumPost[];
  comments: Comment[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  setStories: React.Dispatch<React.SetStateAction<ExperienceStory[]>>;
  setPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export default function AdminPanel({
  currentUser,
  articles,
  stories,
  posts,
  comments,
  setArticles,
  setStories,
  setPosts,
  setComments
}: AdminPanelProps) {
  // Navigation within Admin Panel
  const [adminTab, setAdminTab] = useState<'articles' | 'moderation' | 'flagged'>('articles');

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
          { id: 'flagged', label: 'Nahlášený obsah', count: flaggedPosts.length + flaggedComments.length }
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

      </div>

    </div>
  );
}
