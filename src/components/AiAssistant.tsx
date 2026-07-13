/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  MessageSquare, 
  AlertCircle, 
  Loader2, 
  HelpCircle,
  Clock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Dobrý den! Jsem Synthesis AI, váš průvodce rodinným právem a opatrovnickým řízením. Pomohu vám zorientovat se v soudním procesu, v komunikaci s OSPOD či v základech dohod o střídavé péči. Jaký dotaz vás dnes nejvíce pálí?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const presetQuestions = [
    'Jak se připravit na jednání s OSPOD?',
    'Jaké jsou podmínky pro střídavou péči?',
    'Jak správně sepsat dohodu o výživném?',
    'Jak probíhá soudní řízení o dětech?'
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setErrorText('');

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Nastala chyba při komunikaci se serverem.');
      }

      const aiMsg: ChatMessage = {
        id: 'msg-' + Date.now() + '-ai',
        sender: 'ai',
        text: data.text || 'Omlouvám se, ale nepodařilo se mi zformovat smysluplnou odpověď.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Nepodařilo se připojit k AI asistentovi. Zkontrolujte prosím konfiguraci GEMINI_API_KEY.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="ai-assistant-wrapper">
      
      {/* Collapsed floating action button (FAB) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="ai-assistant-fab"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-12.5 h-12.5 rounded-full bg-slate-850 hover:bg-teal-600 text-white flex items-center justify-center shadow-lg hover:shadow-teal-500/20 cursor-pointer group transition-all"
          >
            <Bot className="w-5.5 h-5.5 group-hover:rotate-12 transition-transform" />
            <span className="absolute right-14 bg-slate-850 text-white font-bold text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider border border-slate-700/50">
              Chytrá Synthesis AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded chat panel drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="w-80 md:w-96 h-[500px] bg-white rounded-2xl border border-slate-100 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-850 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/20 text-teal-400">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs font-display flex items-center gap-1">
                    Synthesis AI Assistant
                    <Sparkles className="w-3 h-3 text-teal-400 fill-teal-400" />
                  </h3>
                  <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest block -mt-0.5">Online rádce</span>
                </div>
              </div>

              <button
                id="close-ai-assistant-btn"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Thread viewport */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 scrollbar-thin" id="ai-messages-container">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6.5 h-6.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-3xs ${
                    msg.sender === 'user'
                      ? 'bg-slate-850 text-white rounded-br-none'
                      : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none whitespace-pre-wrap'
                  }`}>
                    {msg.text}
                    <span className={`block text-[8px] mt-1 font-mono ${msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loader */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-6.5 h-6.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0 animate-pulse">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-3 text-xs text-slate-400 flex items-center gap-2 shadow-3xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                    <span>Synthesis přemýšlí...</span>
                  </div>
                </div>
              )}

              {/* Error block */}
              {errorText && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-xl text-[11px] flex gap-2" id="ai-error-indicator">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Chyba připojení</span>
                    {errorText}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Presets and Chat input controls */}
            <div className="p-3 bg-white border-t border-slate-100 space-y-3">
              
              {/* Presets - only shown if thread is short or empty input */}
              {!isLoading && !inputText && (
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block px-1 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Časté dotazy:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {presetQuestions.map((q, idx) => (
                      <button
                        id={`ai-preset-question-${idx}`}
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-[10px] text-slate-600 hover:text-teal-900 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 px-2.5 py-1 rounded-lg text-left transition-all cursor-pointer truncate max-w-full"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                className="flex gap-2"
                id="ai-input-form"
              >
                <input
                  id="ai-text-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading}
                  placeholder="Zeptejte se na opatrovnické právo..."
                  className="flex-1 px-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl outline-none transition-all disabled:opacity-50"
                />
                <button
                  id="ai-submit-send-btn"
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="p-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl transition-all shadow-xs disabled:shadow-none flex items-center justify-center cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
