/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  BookOpen, 
  Scale, 
  Brain, 
  Search, 
  Calendar, 
  User as UserIcon, 
  Clock, 
  Heart, 
  MessageSquare, 
  ArrowLeft,
  Send,
  RefreshCw,
  Check,
  ThumbsUp
} from 'lucide-react';
import { Article, Comment, User } from '../types';
import { INITIAL_ARTICLES, INITIAL_COMMENTS } from '../initialState';
import { formatRichText } from '../utils';
import { useLanguage } from '../lib/LanguageContext';
import { getTranslatedObject } from '../data/dynamicTranslations';

interface NewsSectionProps {
  searchQuery: string;
  currentUser: User | null;
  externalArticles: Article[];
}

export default function NewsSection({ searchQuery: globalSearchQuery, currentUser, externalArticles }: NewsSectionProps) {
  const { language } = useLanguage();

  const translatedArticles = useMemo(() => {
    return externalArticles.map(art => getTranslatedObject(art.id, art, language));
  }, [externalArticles, language]);

  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [spamAnswer, setSpamAnswer] = useState('');
  const [spamQuestion, setSpamQuestion] = useState({ num1: 4, num2: 4, answer: 8 });
  const [commentError, setCommentError] = useState('');

  const activeArticle = useMemo(() => {
    return translatedArticles.find(art => art.id === selectedArticleId) || null;
  }, [translatedArticles, selectedArticleId]);

  const filteredArticles = useMemo(() => {
    return translatedArticles.filter(art => {
      const q = globalSearchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q)
      );
    });
  }, [translatedArticles, globalSearchQuery]);

  const activeComments = useMemo(() => {
    if (!selectedArticleId) return [];
    return comments.filter(c => c.contentId === selectedArticleId && c.contentType === 'article' && !c.reported);
  }, [comments, selectedArticleId]);

  const handleRefreshSpam = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setSpamQuestion({ num1: n1, num2: n2, answer: n1 + n2 });
    setSpamAnswer('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError('');

    if (!newCommentText.trim()) {
      setCommentError('Napište prosím text komentáře.');
      return;
    }

    if (!currentUser && !guestName.trim()) {
      setCommentError('Vyplňte prosím své jméno nebo se přihlaste.');
      return;
    }

    if (parseInt(spamAnswer) !== spamQuestion.answer) {
      setCommentError('Kontrolní otázka proti spamu je nesprávná.');
      return;
    }

    const newComment: Comment = {
      id: 'comm-' + Math.random().toString(36).substr(2, 9),
      contentId: selectedArticleId || '',
      contentType: 'article',
      userId: currentUser?.id || 'usr-guest',
      userName: currentUser?.name || guestName.trim(),
      userAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guestName || 'G')}`,
      content: newCommentText.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      reported: false
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
    setGuestName('');
    handleRefreshSpam();
  };

  const handleLikeArticle = (articleId: string) => {
    // updates count locally for current session
    alert('Děkujeme za vyjádření podpory tomuto článku!');
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
  };

  const handleReportComment = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, reported: true } : c));
    alert('Komentář byl nahlášen moderátorovi.');
  };

  return (
    <div className="space-y-6" id="news-section-container">
      
      {/* Article Detail View */}
      {selectedArticleId && activeArticle ? (
        <div className="space-y-6" id="news-article-expanded">
          <button
            id="back-to-articles-grid"
            onClick={() => setSelectedArticleId(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            Zpět na přehled aktualit
          </button>

          <article className="bg-white rounded-2xl border border-slate-100 p-6 md:p-10 shadow-2xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-4">
              <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md ${
                activeArticle.category === 'Zákony' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/35' :
                activeArticle.category === 'Soudy' ? 'bg-teal-50 text-teal-700 border border-teal-100/35' :
                activeArticle.category === 'Psychologie' ? 'bg-amber-50 text-amber-700 border border-amber-100/35' :
                'bg-emerald-50 text-emerald-700 border border-emerald-100/35'
              }`}>
                {activeArticle.category}
              </span>

              <div className="flex items-center gap-4 text-slate-400 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeArticle.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeArticle.readTime} čtení</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-display tracking-tight leading-tight">
                {activeArticle.title}
              </h1>
              <p className="text-slate-500 font-medium text-xs leading-relaxed italic border-l-2 border-teal-500 pl-3">
                {activeArticle.summary}
              </p>
              
              {/* Core rich content formatting */}
              <div className="text-slate-600 text-xs leading-relaxed space-y-4 pt-2 whitespace-pre-line" id="article-main-body-text">
                {formatRichText(activeArticle.content)}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700">{activeArticle.author}</span>
              </div>
              
              <button
                id="article-like-button"
                onClick={() => handleLikeArticle(activeArticle.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-100 rounded-xl font-bold transition-all"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Užitečné ({activeArticle.likes})</span>
              </button>
            </div>
          </article>

          {/* Expanded Article Comments Module */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs space-y-6" id="article-comments-block">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <MessageSquare className="w-4.5 h-4.5 text-teal-600" />
              <h3 className="font-bold text-sm text-slate-800 font-display">Komentáře k článku ({activeComments.length})</h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100" id="article-comment-form">
              {commentError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-2 rounded-lg">
                  {commentError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {!currentUser && (
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="art-comment-guest-name"
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Zadejte své jméno"
                      className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                    />
                  </div>
                )}
                
                {/* Math Captcha */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-medium">
                    Ochrana proti spamu: {spamQuestion.num1} + {spamQuestion.num2} =
                  </span>
                  <input
                    id="art-comment-spam-input"
                    type="text"
                    value={spamAnswer}
                    onChange={(e) => setSpamAnswer(e.target.value)}
                    placeholder="?"
                    className="w-12 px-2 py-1 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-center outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleRefreshSpam}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <textarea
                id="art-comment-text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Napište věcný názor nebo doplňující informaci k tématu..."
                rows={3}
                className="w-full px-4 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none resize-none"
              />

              <div className="flex justify-end">
                <button
                  id="art-comment-submit"
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-teal-200" />
                  Přidat názor
                </button>
              </div>
            </form>

            {/* Comments list rendering */}
            <div className="space-y-4" id="article-comments-list">
              {activeComments.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs italic">K tomuto článku zatím nebyl přidán žádný názor. Buďte první!</div>
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
                          id={`art-comment-like-${comment.id}`}
                          onClick={() => handleLikeComment(comment.id)}
                          className="flex items-center gap-1 text-slate-400 hover:text-teal-600 text-[10px] font-semibold transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{comment.likes}</span>
                        </button>
                        <button
                          id={`art-comment-report-${comment.id}`}
                          onClick={() => handleReportComment(comment.id)}
                          className="text-slate-300 hover:text-rose-500 text-[9px] font-medium transition-colors flex items-center gap-1"
                        >
                          Nahlásit
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      ) : (
        /* Grid list of Articles (Bento style) */
        <div className="space-y-8" id="news-grid-view">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Aktuality a články</span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Právní změny a soudní rozhodnutí</h2>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
              Mějte dokonalý přehled o legislativních aktualizacích, významných judikátech Nejvyššího a Ústavního soudu a klíčových psychologických aspektech výchovy a střídavé péče.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="news-articles-bento">
            {filteredArticles.length === 0 ? (
              <div className="col-span-3 bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400 shadow-2xs">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <BookOpen className="w-8 h-8" />
                </div>
                <p className="font-semibold text-slate-600 text-sm">Aktuality a články jsou v přípravě</p>
                <p className="text-xs mt-1 text-slate-400">Doposud nejsou k dispozici žádná data. Statistiky se začnou vytvářet po spuštění alfa verze.</p>
              </div>
            ) : (
              filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer"
                  id={`article-card-${art.id}`}
                >
                  <div className="space-y-3">
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                        art.category === 'Zákony' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/35' :
                        art.category === 'Soudy' ? 'bg-teal-50 text-teal-700 border border-teal-100/35' :
                        art.category === 'Psychologie' ? 'bg-amber-50 text-amber-700 border border-amber-100/35' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-100/35'
                      }`}>
                        {art.category}
                      </span>
                      
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {art.date}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-bold text-slate-800 font-display text-sm leading-snug hover:text-teal-600 transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>
                    </div>

                  </div>

                  <div className="border-t border-slate-50 pt-3.5 mt-4 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-500">{art.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      {art.readTime} čtení
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
