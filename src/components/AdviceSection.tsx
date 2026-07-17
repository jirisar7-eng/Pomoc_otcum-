/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  CheckSquare, 
  Square, 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  ShieldAlert, 
  AlertTriangle,
  User as UserIcon,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { AdviceItem, Comment, User } from '../types';
import { INITIAL_ADVICE, INITIAL_COMMENTS } from '../initialState';
import { formatRichText } from '../utils';

interface AdviceSectionProps {
  currentUser: User | null;
  searchQuery: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export default function AdviceSection({ 
  currentUser, 
  searchQuery: globalSearchQuery,
  comments,
  setComments
}: AdviceSectionProps) {
  const [activeAdviceId, setActiveAdviceId] = useState<string>(() => INITIAL_ADVICE[0]?.id || '');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [spamAnswer, setSpamAnswer] = useState('');
  const [spamQuestion, setSpamQuestion] = useState({ num1: 4, num2: 3, answer: 7 });
  const [commentError, setCommentError] = useState('');

  const activeAdvice = useMemo(() => {
    return INITIAL_ADVICE.find(item => item.id === activeAdviceId) || INITIAL_ADVICE[0];
  }, [activeAdviceId]);

  const filteredAdviceList = useMemo(() => {
    return INITIAL_ADVICE.filter(item => {
      const q = globalSearchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [globalSearchQuery]);

  const toggleChecklist = (itemId: string, index: number) => {
    const key = `${itemId}-${index}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleRefreshSpamQuestion = () => {
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
      contentId: activeAdviceId,
      contentType: 'advice',
      userId: currentUser?.id || 'usr-guest',
      userName: currentUser?.name || guestName,
      userAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guestName || 'G')}`,
      content: newCommentText,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      reported: false
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
    setGuestName('');
    handleRefreshSpamQuestion();
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
  };

  const handleReportComment = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, reported: true } : c));
    alert('Komentář byl nahlášen moderátorům k prověření.');
  };

  const activeComments = useMemo(() => {
    return comments.filter(c => c.contentId === activeAdviceId && c.contentType === 'advice' && !c.reported);
  }, [comments, activeAdviceId]);

  return (
    <div className="space-y-8" id="advice-section-container">
      
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Metodické návody</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Rady, návody a praktická doporučení</h2>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Opatrovnický spor se nerozhoduje jen v soudní síni, ale během celého procesu. Prozkoumejte naše praktické příručky o komunikaci se sociálními pracovníky (OSPOD), o bezpečné komunikaci s expartnerem, správném shromažďování důkazů a o nejčastějších chybách, kterým je nutné se vyhnout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT BAR: Guides selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-3 pl-1">Témata a návody:</span>
            <div className="space-y-1.5" id="advice-nav-list">
              {filteredAdviceList.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">Žádné články neodpovídají vyhledávání.</div>
              ) : (
                filteredAdviceList.map((item) => (
                  <button
                    id={`advice-tab-select-${item.id}`}
                    key={item.id}
                    onClick={() => setActiveAdviceId(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      activeAdviceId === item.id
                        ? 'bg-teal-50/50 border-teal-300 text-teal-900 shadow-2xs'
                        : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    <span>{item.title}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Practical warning block */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100/50 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs text-slate-800">Nejčastější chyba: Emoční eskalace</h4>
              <p className="text-slate-500 text-[10px] leading-relaxed mt-1">
                Soudy a OSPOD velmi citlivě reagují na vulgární, agresivní či příliš nátlakovou komunikaci. Všechny sms, emaily i nahrávky mohou být použity jako důkaz. Pište vždy věcně, bez emocí a s ohledem na zájem dítěte.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Guide Details, Checklist & Comments (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeAdvice ? (
            <div className="space-y-6">
              
              {/* Guide Content Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs" id="advice-content-detail">
                <span className="text-[9px] uppercase font-bold tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md">
                  Kategorie: {activeAdvice.category}
                </span>
                <h3 className="text-xl font-bold text-slate-800 font-display mt-2 mb-4">{activeAdvice.title}</h3>
                
                {/* Render Markdown-like content nicely */}
                <div className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap space-y-4">
                  {formatRichText(activeAdvice.content)}
                </div>

                {/* INTERACTIVE CHECKLIST */}
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-teal-600" />
                    Praktický kontrolní seznam pro rodiče:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="advice-checklist-grid">
                    {activeAdvice.checklist.map((task, idx) => {
                      const isDone = completedItems[`${activeAdvice.id}-${idx}`];
                      return (
                        <button
                          id={`checklist-item-${activeAdvice.id}-${idx}`}
                          key={idx}
                          onClick={() => toggleChecklist(activeAdvice.id, idx)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isDone 
                              ? 'bg-teal-50/20 border-teal-200/50 text-slate-500' 
                              : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'
                          }`}
                        >
                          {isDone ? (
                            <CheckSquare className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4.5 h-4.5 text-slate-300 shrink-0 mt-0.5" />
                          )}
                          <span className={`text-[11px] leading-snug ${isDone ? 'line-through decoration-slate-300' : ''}`}>
                            {task}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* COMMENTS MODULE */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs space-y-6" id="advice-comments-module">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                  <MessageSquare className="w-4.5 h-4.5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-800 font-display">Komentáře a dotazy ({activeComments.length})</h3>
                </div>

                {/* Comment Input form with spam protection */}
                <form onSubmit={handlePostComment} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100" id="comment-post-form">
                  {commentError && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-2 rounded-lg" id="comment-error">
                      {commentError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {!currentUser && (
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          id="comment-guest-name"
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Zadejte své jméno"
                          className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                        />
                      </div>
                    )}
                    
                    {/* Captcha - Spam check */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                        Ochrana proti spamu: {spamQuestion.num1} + {spamQuestion.num2} =
                      </span>
                      <input
                        id="comment-spam-input"
                        type="text"
                        value={spamAnswer}
                        onChange={(e) => setSpamAnswer(e.target.value)}
                        placeholder="?"
                        className="w-12 px-2 py-1 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-center outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleRefreshSpamQuestion}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Vygenerovat novou otázku"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      id="comment-text-area"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder={currentUser ? "Napište konstruktivní komentář nebo dotaz..." : "Přihlaste se nebo napište komentář jako host..."}
                      rows={3}
                      className="w-full px-4 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none resize-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[9px] text-slate-400 italic">Formulujte prosím příspěvky uctivě.</span>
                    <button
                      id="comment-submit-btn"
                      type="submit"
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg shadow-2xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3 h-3 text-teal-200" />
                      Odeslat komentář
                    </button>
                  </div>
                </form>

                {/* Comment Feed */}
                <div className="space-y-4" id="comment-feed-list">
                  {activeComments.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs italic">Zatím zde nejsou žádné komentáře. Buďte první!</div>
                  ) : (
                    activeComments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 shadow-2xs flex gap-3 transition-colors">
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
                              id={`comment-like-${comment.id}`}
                              onClick={() => handleLikeComment(comment.id)}
                              className="flex items-center gap-1 text-slate-400 hover:text-teal-600 text-[10px] font-semibold transition-colors"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{comment.likes}</span>
                            </button>
                            <button
                              id={`comment-report-${comment.id}`}
                              onClick={() => handleReportComment(comment.id)}
                              className="text-slate-300 hover:text-rose-500 text-[9px] font-medium transition-colors flex items-center gap-1"
                              title="Nahlásit jako nevhodné"
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

            </div>
          ) : (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center text-slate-400">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Compass className="w-8 h-8" />
              </div>
              <p className="font-semibold text-slate-600 text-sm">Metodické návody a rady jsou v přípravě</p>
              <p className="text-xs mt-1 text-slate-400">Doposud nejsou k dispozici žádná data. Statistiky se začnou vytvářet po spuštění alfa verze.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
