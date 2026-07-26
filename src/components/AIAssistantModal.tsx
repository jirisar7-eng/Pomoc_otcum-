import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  HelpCircle 
} from 'lucide-react';
import { AIAdminClient } from '../lib/ai-admin/client';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export default function AIAssistantModal({ isOpen, onClose, initialPrompt }: AIAssistantModalProps) {
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

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

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
      const replyText = await AIAdminClient.queryGemini(textToSend);
      const aiMsg: ChatMessage = {
        id: 'msg-' + Date.now() + '-ai',
        sender: 'ai',
        text: replyText || 'Omlouvám se, ale nepodařilo se mi zformovat smysluplnou odpověď.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AIAssistantModal fetch error:', err);
      setErrorText(err.message || 'Dočasná chyba při spojení s AI. Zkontrolujte API klíč nebo to zkusíte za chvíli znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            id="ai-assistant-modal-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg h-[600px] bg-white rounded-2xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden"
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
                id="close-ai-modal-btn"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Thread viewport */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 scrollbar-thin">
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
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-xl text-[11px] flex gap-2" id="ai-modal-error-indicator">
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
              {!isLoading && !inputText && (
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block px-1 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Časté dotazy:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {presetQuestions.map((q, idx) => (
                      <button
                        id={`ai-modal-preset-${idx}`}
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
              >
                <input
                  id="ai-modal-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading}
                  placeholder="Zeptejte se na opatrovnické právo..."
                  className="flex-1 px-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl outline-none transition-all disabled:opacity-50"
                />
                <button
                  id="ai-modal-send-btn"
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="p-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl transition-all shadow-xs disabled:shadow-none flex items-center justify-center cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-1.5 text-center text-[9px] text-slate-400 leading-snug border-t border-slate-100 pt-1.5">
                ⚠️ <strong>Tento obsah slouží pouze k obecným informačním účelům a nenahrazuje právní poradenství.</strong>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
