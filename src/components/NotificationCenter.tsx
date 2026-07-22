/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Calendar, 
  Sparkles, 
  MessageCircle, 
  FileText, 
  ExternalLink, 
  CheckCheck,
  X
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'hearing' | 'ai' | 'forum' | 'document' | 'system';
  isRead: boolean;
  linkTab?: string;
}

interface NotificationCenterProps {
  onNavigate?: (tabId: string) => void;
  className?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Nové vyjádření v AI Analýze',
    message: 'AI Právní asistent dokončil hloubkovou analýzu vašeho opatrovnického spisu.',
    timestamp: 'Před 15 min',
    type: 'ai',
    isRead: false,
    linkTab: 'ai-assistant'
  },
  {
    id: 'n2',
    title: 'Nová odpověď ve Fóru',
    message: 'Uživatel Petr reagoval na vaše vlákno "Příprava na OSPOD v Praze 4".',
    timestamp: 'Před 2 hod',
    type: 'forum',
    isRead: false,
    linkTab: 'forum'
  },
  {
    id: 'n3',
    title: 'Soudní jednání se blíží',
    message: 'Nezapomeňte: Za 5 dní máte naplánované jednání u Okresního soudu.',
    timestamp: 'Včera',
    type: 'hearing',
    isRead: true,
    linkTab: 'user-portal'
  },
  {
    id: 'n4',
    title: 'Aktualizována metodika výživného 2026',
    message: 'Nové tabulky Ministerstva spravedlnosti ČR byly nahrány do kalkulačky.',
    timestamp: 'Před 3 dny',
    type: 'system',
    isRead: true,
    linkTab: 'opatrovnicka-agenda'
  }
];

export default function NotificationCenter({ onNavigate, className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('synthesis_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('synthesis_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications:', e);
    }
  }, [notifications]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
    setIsOpen(false);
    if (item.linkTab && onNavigate) {
      onNavigate(item.linkTab);
    }
  };

  const displayedNotifications = notifications.filter(n => filter === 'all' || !n.isRead);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'hearing': return <Calendar className="w-3.5 h-3.5 text-amber-600" />;
      case 'ai': return <Sparkles className="w-3.5 h-3.5 text-teal-600" />;
      case 'forum': return <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />;
      case 'document': return <FileText className="w-3.5 h-3.5 text-blue-600" />;
      default: return <Bell className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div ref={panelRef} className={`relative inline-block ${className}`}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
        title="Centrum Oznámení"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-extrabold text-white bg-rose-500 rounded-full animate-pulse shadow-2xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Drawer Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in duration-150">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-slate-800 text-xs font-display">Centrum Oznámení</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-bold rounded-full">
                  {unreadCount} nepřečteno
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-teal-50 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Označit vše jako přečtené"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span className="hidden sm:inline">Přečteno</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 py-2 border-b border-slate-50">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Vše ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'unread' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nepřečtené ({unreadCount})
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-72 overflow-y-auto space-y-1 py-1">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer relative group ${
                    item.isRead ? 'bg-white hover:bg-slate-50 opacity-80' : 'bg-teal-50/40 hover:bg-teal-50/80 border border-teal-100/60 font-medium'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    item.isRead ? 'bg-slate-100' : 'bg-white shadow-2xs border border-teal-100'
                  }`}>
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold truncate ${item.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                  </div>

                  <button
                    onClick={(e) => deleteNotification(item.id, e)}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                    title="Smazat oznámení"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400">
                <Bell className="w-6 h-6 mx-auto mb-1 opacity-30 text-slate-400" />
                <p className="text-xs font-medium">Žádná nová oznámení</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
