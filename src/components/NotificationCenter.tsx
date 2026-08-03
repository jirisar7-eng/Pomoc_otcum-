"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesis OS - Notification Center Component
 * Connected to Supabase with Realtime Postgres Changes listener.
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
  Shield, 
  Info, 
  Scale, 
  ExternalLink, 
  CheckCheck, 
  X,
  Volume2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export interface NotificationItem {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'ai_analysis' | 'forum_reply' | 'system_update' | 'hearing' | 'legal_doc' | string;
  is_read: boolean;
  link_url?: string;
  link_tab?: string;
  created_at: string;
}

interface NotificationCenterProps {
  onNavigate?: (tabId: string) => void;
  className?: string;
}

const INITIAL_SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'AI Hloubková Analýza Dokončena',
    message: 'AI Právní asistent dokončil zpracování vašeho opatrovnického spisu a vygeneroval návrh podání.',
    type: 'ai_analysis',
    is_read: false,
    link_tab: 'user-portal',
    link_url: '/workspace',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 min ago
  },
  {
    id: 'notif-2',
    title: 'Nová odpověď v Komunitním Fóru',
    message: 'Uživatel Petr N. reagoval na váš dotaz týkající se postupu při jednání s OSPOD.',
    type: 'forum_reply',
    is_read: false,
    link_tab: 'forum',
    link_url: '/forum',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hrs ago
  },
  {
    id: 'notif-3',
    title: 'Systémová Aktualizace e-Justice 2026',
    message: 'Nové tabulky Ministerstva spravedlnosti pro výpočet výživného byly nasazeny do kalkulačky.',
    type: 'system_update',
    is_read: true,
    link_tab: 'e-justice',
    link_url: '/e-justice',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 'notif-4',
    title: 'Připomínka: Soudní jednání se blíží',
    message: 'Nezapomeňte zkontrolovat přípravu na jednání u Okresního soudu v Olomouci.',
    type: 'hearing',
    is_read: true,
    link_tab: 'user-portal',
    link_url: '/workspace',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  }
];

export default function NotificationCenter({ onNavigate, className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load Initial Notifications & Set Up Supabase Realtime Listener
  useEffect(() => {
    fetchNotifications();

    if (!isSupabaseConfigured()) return;

    const supabase = getSupabase();
    if (!supabase) return;

    // Supabase Realtime Listener setup:
    // channel('custom-all-channel').on('postgres_changes', ...)
    const channel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('[NotificationCenter] Realtime payload received:', payload);
          fetchNotifications();
        }
      )
      .subscribe((status) => {
        console.log('[NotificationCenter] Realtime channel status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch notifications from Supabase (or fallback to LocalStorage/Seed)
  const fetchNotifications = async () => {
    setLoading(true);
    let loadedFromDb = false;

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          
          let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
          if (user?.id) {
            query = query.eq('user_id', user.id);
          }

          const { data, error } = await query;

          if (!error && data && data.length > 0) {
            const items: NotificationItem[] = data.map(row => ({
              id: row.id,
              user_id: row.user_id,
              title: row.title || 'Oznámení',
              message: row.message || row.body || row.content || '',
              type: row.type || 'system_update',
              is_read: Boolean(row.is_read || row.isRead),
              link_url: row.link_url || row.linkUrl,
              link_tab: row.link_tab || row.linkTab,
              created_at: row.created_at || new Date().toISOString()
            }));

            setNotifications(items);
            localStorage.setItem('synthesis_notifications', JSON.stringify(items));
            loadedFromDb = true;
          }
        }
      } catch (e) {
        console.warn('[NotificationCenter] Supabase fetch error:', e);
      }
    }

    if (!loadedFromDb) {
      try {
        const saved = localStorage.getItem('synthesis_notifications');
        if (saved) {
          setNotifications(JSON.parse(saved));
        } else {
          setNotifications(INITIAL_SEED_NOTIFICATIONS);
          localStorage.setItem('synthesis_notifications', JSON.stringify(INITIAL_SEED_NOTIFICATIONS));
        }
      } catch {
        setNotifications(INITIAL_SEED_NOTIFICATIONS);
      }
    }

    setLoading(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Mark all notifications as read in Supabase & LocalState
  const handleMarkAllAsRead = async () => {
    // Local optimistic update
    const updated = notifications.map(n => ({ ...n, is_read: true }));
    setNotifications(updated);
    localStorage.setItem('synthesis_notifications', JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          let query = supabase.from('notifications').update({ is_read: true });
          if (user?.id) {
            query = query.eq('user_id', user.id);
          } else {
            query = query.eq('is_read', false);
          }
          await query;
        }
      } catch (err) {
        console.warn('[NotificationCenter] Mark all read error:', err);
      }
    }
  };

  // Mark single notification as read & navigate
  const handleNotificationClick = async (item: NotificationItem) => {
    const updated = notifications.map(n => n.id === item.id ? { ...n, is_read: true } : n);
    setNotifications(updated);
    localStorage.setItem('synthesis_notifications', JSON.stringify(updated));

    setIsOpen(false);

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from('notifications').update({ is_read: true }).eq('id', item.id);
        }
      } catch (err) {
        console.warn('[NotificationCenter] Mark single read error:', err);
      }
    }

    // Redirect or Navigate
    if (item.link_tab && onNavigate) {
      onNavigate(item.link_tab);
    } else if (item.link_url && item.link_url.startsWith('/')) {
      const tabKey = item.link_url.replace('/', '');
      if (tabKey && onNavigate) {
        onNavigate(tabKey);
      }
    } else if (item.link_url) {
      window.location.href = item.link_url;
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('synthesis_notifications', JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from('notifications').delete().eq('id', id);
        }
      } catch (err) {
        console.warn('[NotificationCenter] Delete notification error:', err);
      }
    }
  };

  // Filtered notifications
  const displayedNotifications = notifications.filter(n => filter === 'all' || !n.is_read);

  // Helper to format Czech relative date safely using date-fns
  const formatTimeAgo = (isoDateString: string) => {
    try {
      const date = new Date(isoDateString);
      if (isNaN(date.getTime())) return 'Nedávno';
      const formatted = formatDistanceToNow(date, { addSuffix: true, locale: cs });
      return formatted;
    } catch {
      return 'Nedávno';
    }
  };

  // Dynamic Icon Assignment according to requirements
  const renderNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ai_analysis':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
        );

      case 'forum_reply':
        return (
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
            <MessageCircle className="w-4 h-4" />
          </div>
        );

      case 'system_update':
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Shield className="w-4 h-4" />
          </div>
        );

      case 'hearing':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Calendar className="w-4 h-4" />
          </div>
        );

      case 'legal_doc':
        return (
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Scale className="w-4 h-4" />
          </div>
        );

      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div ref={panelRef} className={`relative inline-block ${className}`} id="notification-center-trigger">
      
      {/* 2. Bell Trigger Button with Absolute Unread Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200"
        title="Centrum Oznámení"
        aria-label="Centrum Oznámení"
      >
        <Bell className="w-4 h-4" />

        {/* Absolute Red Badge: Only visible when unreadCount > 0 */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-rose-600 rounded-full animate-pulse shadow-md border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* 3. Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100/70 text-emerald-800 rounded-lg">
                <Bell className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 text-sm font-display">Centrum Oznámení</span>
              
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold rounded-full font-mono">
                  {unreadCount} nepřečteno
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-2 py-1 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-transparent hover:border-emerald-200"
                  title="Označit vše jako přečtené"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Přečteno</span>
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                aria-label="Zavřít"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs: "Vše (X)" & "Nepřečtené (Y)" */}
          <div className="flex items-center gap-1 py-2.5 border-b border-slate-100">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Vše ({notifications.length})
            </button>

            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nepřečtené ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto space-y-2 py-2 pr-1">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer relative group border ${
                    !item.is_read
                      ? 'bg-emerald-50/60 border-emerald-200/80 hover:bg-emerald-50 hover:border-emerald-300 text-slate-900 font-medium'
                      : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700 opacity-80'
                  }`}
                >
                  {/* Dynamic Type Icon */}
                  {renderNotificationIcon(item.type)}

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold truncate leading-tight ${!item.is_read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.title}
                      </h4>

                      <span className="text-[10px] font-mono text-slate-400 shrink-0 whitespace-nowrap">
                        {formatTimeAgo(item.created_at)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                  </div>

                  {/* Individual Delete Button */}
                  <button
                    onClick={(e) => handleDeleteNotification(item.id, e)}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                    title="Odstranit oznámení"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
                <p className="text-xs font-bold text-slate-500">Žádná nová oznámení</p>
                <p className="text-[11px] text-slate-400">Všechna oznámení v této záložce byla vyřízena.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
