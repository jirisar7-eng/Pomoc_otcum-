import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ticket as TicketIcon, 
  Bug, 
  Lightbulb, 
  Scale, 
  HelpCircle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Send, 
  Loader2, 
  AlertTriangle, 
  ChevronRight, 
  MessageSquare, 
  Filter, 
  User as UserIcon, 
  ShieldCheck, 
  RefreshCw, 
  ArrowLeft,
  ExternalLink,
  Sparkles,
  CheckCircle,
  XCircle,
  FlaskConical,
  Flame,
  Info
} from 'lucide-react';
import { Ticket, TicketCategory, TicketStatus, TicketPriority, User } from '../types';
import { getStoredTickets, createTicket, updateTicketStatus, addTicketComment } from '../services/ticketService';

interface TicketSystemProps {
  currentUser?: User | null;
  onOpenAuth?: () => void;
  setActiveTab?: (tab: string) => void;
  initialCategory?: TicketCategory;
}

export default function TicketSystem({
  currentUser,
  onOpenAuth,
  setActiveTab,
  initialCategory = 'bug'
}: TicketSystemProps) {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === 'mallfuriionn@gmail.com';

  const [activeView, setActiveView] = useState<'list' | 'create' | 'detail'>('create');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Filters for Ticket List
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [showOnlyMine, setShowOnlyMine] = useState<boolean>(false);

  // Form State
  const [category, setCategory] = useState<TicketCategory>(initialCategory);
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [benefit, setBenefit] = useState('');
  const [topicCategory, setTopicCategory] = useState('střídavá_péče');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Sync user info if logged in
  useEffect(() => {
    if (currentUser) {
      if (!userName) setUserName(currentUser.name || '');
      if (!userEmail) setUserEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Load tickets on mount
  const refreshTickets = () => {
    const list = getStoredTickets();
    setTickets(list);
    if (selectedTicket) {
      const updated = list.find(t => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  };

  useEffect(() => {
    refreshTickets();
  }, []);

  // Category Configuration Data
  const categoriesConfig: Record<TicketCategory, {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
    badgeBg: string;
    description: string;
  }> = {
    bug: {
      title: 'Hlášení chyby',
      subtitle: 'Bug Report',
      icon: Bug,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200 hover:border-rose-400',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Pro nefunkční formuláře, chybné zobrazení, nefunkční odkazy nebo technické závady.'
    },
    feature: {
      title: 'Návrh na vylepšení',
      subtitle: 'Feature Request',
      icon: Lightbulb,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200 hover:border-amber-400',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Nápady na nové funkce, vylepšení stávajících sekcí nebo rozšíření obsahu.'
    },
    support: {
      title: 'Právní / Rodinná poradna',
      subtitle: 'Podpora & Dotaz',
      icon: Scale,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200 hover:border-teal-400',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
      description: 'Dotazy směřující na odbornou pomoc, krizové linky nebo specifické situace.'
    },
    general: {
      title: 'Obecný dotaz',
      subtitle: 'Zpětná vazba',
      icon: HelpCircle,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200 hover:border-sky-400',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
      description: 'Vše ostatní, co nespadá do předchozích kategorií.'
    }
  };

  const statusConfig: Record<TicketStatus, { label: string; icon: any; className: string }> = {
    open: { label: '📥 Nové', icon: Clock, className: 'bg-blue-100 text-blue-800 border-blue-300' },
    in_progress: { label: '🔍 V řešení', icon: RefreshCw, className: 'bg-amber-100 text-amber-800 border-amber-300' },
    testing: { label: '🧪 Čeká na nasazení', icon: FlaskConical, className: 'bg-purple-100 text-purple-800 border-purple-300' },
    resolved: { label: '✅ Vyřešeno', icon: CheckCircle, className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    rejected: { label: '❌ Zamítnuto', icon: XCircle, className: 'bg-slate-100 text-slate-700 border-slate-300' }
  };

  const priorityConfig: Record<TicketPriority, { label: string; icon: any; className: string }> = {
    critical: { label: '🔴 Kritická', icon: Flame, className: 'bg-rose-100 text-rose-800 border-rose-300' },
    medium: { label: '🟡 Střední', icon: AlertTriangle, className: 'bg-amber-100 text-amber-800 border-amber-300' },
    low: { label: '🟢 Nízká', icon: Info, className: 'bg-slate-100 text-slate-700 border-slate-200' }
  };

  // Form Submission
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!userName.trim() || !userEmail.trim()) {
      setErrorMsg('Vyplňte prosím vaše jméno a e-mailovou adresu.');
      return;
    }
    if (!title.trim() || title.trim().length < 5) {
      setErrorMsg('Předmět / Název ticketu musí mít alespoň 5 znaků.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg('Detailní popis zprávy musí mít alespoň 10 znaků.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createTicket({
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        category,
        priority,
        title: title.trim(),
        description: description.trim(),
        pageUrl: pageUrl.trim() || undefined,
        benefit: category === 'feature' ? benefit.trim() : undefined,
        topicCategory: category === 'support' ? topicCategory : undefined,
        userId: currentUser?.id
      });

      refreshTickets();
      setSuccessMsg(`Ticket ${created.ticketNumber} byl úspěšně vytvořen! Odeslali jsme potvrzení a vývojářský tým se jím bude ihned zabývat.`);
      
      // Reset form fields
      setTitle('');
      setDescription('');
      setPageUrl('');
      setBenefit('');
      
      setTimeout(() => {
        setSelectedTicket(created);
        setActiveView('detail');
        setSuccessMsg('');
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Při vytváření ticketu došlo k chybě. Zkuste to prosím znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  // Status update by admin
  const handleUpdateStatus = async (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateTicketStatus(
        selectedTicket.id,
        newStatus,
        newCommentText.trim() || undefined,
        currentUser?.name || 'Jiří Šár (Správce)'
      );
      if (updated) {
        setSelectedTicket({ ...updated });
        setNewCommentText('');
        refreshTickets();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newCommentText.trim()) return;

    setUpdatingStatus(true);
    try {
      const updated = await addTicketComment(
        selectedTicket.id,
        currentUser?.name || userName || 'Uživatel',
        currentUser?.email || userEmail || 'anonym@example.cz',
        newCommentText.trim(),
        isAdmin
      );
      if (updated) {
        setSelectedTicket({ ...updated });
        setNewCommentText('');
        refreshTickets();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filtered Tickets List
  const filteredTickets = tickets.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (showOnlyMine && currentUser) {
      if (t.userEmail.toLowerCase() !== currentUser.email.toLowerCase()) return false;
    }
    if (filterSearch.trim()) {
      const term = filterSearch.toLowerCase().trim();
      const matchTitle = t.title.toLowerCase().includes(term);
      const matchDesc = t.description.toLowerCase().includes(term);
      const matchNum = t.ticketNumber.toLowerCase().includes(term);
      const matchUser = t.userName.toLowerCase().includes(term) || t.userEmail.toLowerCase().includes(term);
      if (!matchTitle && !matchDesc && !matchNum && !matchUser) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8" id="ticket-system-root">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 border border-teal-500/30 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/40 rounded-full text-teal-300 text-xs font-mono font-bold uppercase tracking-wider">
              <TicketIcon className="w-3.5 h-3.5 text-teal-400" />
              <span>Synthesis Ticket System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              Centrum návrhů, hlášení chyb a podpory
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Pomozte nám posouvat portál vymezený pro táty a rodiny dopředu. Můžete nahlásit technickou chybu, navrhnout novou funkci nebo položit dotaz k právní poradně.
            </p>
          </div>

          {/* Quick Action Navigation Switches */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 shrink-0">
            <button
              onClick={() => setActiveView('create')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'create'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Nové hlášení</span>
            </button>

            <button
              onClick={() => setActiveView('list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
                activeView === 'list'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <TicketIcon className="w-4 h-4" />
              <span>Přehled ticketů</span>
              <span className="ml-1 px-1.5 py-0.2 bg-slate-900/60 text-teal-300 rounded-full text-[10px] font-mono">
                {tickets.length}
              </span>
            </button>
          </div>
        </div>

        {/* Real-time Ticket Status Counter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80 relative z-10">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Celkem ticketů</span>
              <span className="text-base font-bold text-white font-mono">{tickets.length}</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs">
              📊
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">V řešení / Testuje se</span>
              <span className="text-base font-bold text-amber-300 font-mono">
                {tickets.filter(t => t.status === 'in_progress' || t.status === 'testing').length}
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs">
              🔍
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Vyřešeno</span>
              <span className="text-base font-bold text-emerald-300 font-mono">
                {tickets.filter(t => t.status === 'resolved').length}
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">
              ✅
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Chyby / Návrhy</span>
              <span className="text-base font-bold text-sky-300 font-mono">
                {tickets.filter(t => t.category === 'bug').length} / {tickets.filter(t => t.category === 'feature').length}
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center text-xs">
              💡
            </div>
          </div>
        </div>
      </div>

      {/* Main View Switcher */}
      <AnimatePresence mode="wait">
        {activeView === 'create' && (
          <motion.div
            key="create-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* 1. Category Selection Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono block">
                1. Vyberte typ požadavku (Kategorii):
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(Object.keys(categoriesConfig) as TicketCategory[]).map((catKey) => {
                  const cfg = categoriesConfig[catKey];
                  const Icon = cfg.icon;
                  const isSelected = category === catKey;

                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setCategory(catKey)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden ${
                        isSelected
                          ? `${cfg.bgColor} ${cfg.borderColor} shadow-md ring-2 ring-teal-500/40`
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-teal-600">
                          <CheckCircle2 className="w-5 h-5 fill-teal-100" />
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white shadow-3xs' : 'bg-slate-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${cfg.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900 font-display">
                            {cfg.title}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {cfg.subtitle}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {cfg.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Ticket Form */}
            <form onSubmit={handleSubmitTicket} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${category === 'bug' ? 'bg-rose-500' : category === 'feature' ? 'bg-amber-500' : category === 'support' ? 'bg-teal-500' : 'bg-sky-500'}`} />
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    Formulář: {categoriesConfig[category].title}
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Přímá vývojářská fronta
                </span>
              </div>

              {/* Success Notification */}
              {successMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium flex items-center gap-3 shadow-3xs">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Error Notification */}
              {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-medium flex items-center gap-3 shadow-3xs">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Vaše Jméno a Příjmení</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Např. Karel Novák"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* User Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>E-mail pro odpověď &amp; sledování stavu</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="napriklad@email.cz"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Specific priority or Topic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Priority Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Priorita vyřízení:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="low">🟢 Nízká - Návrh nebo běžný dotaz</option>
                    <option value="medium">🟡 Střední - Drobné chybové chování nebo standardní požadavek</option>
                    <option value="critical">🔴 Kritická - Nefunkční klíčová funkce (stahování, formuláře)</option>
                  </select>
                </div>

                {/* Conditional Field depending on category */}
                {category === 'bug' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Dotčená stránka / URL (volitelné):
                    </label>
                    <input
                      type="text"
                      value={pageUrl}
                      onChange={(e) => setPageUrl(e.target.value)}
                      placeholder="např. /centrum-formularu nebo /vyzivne"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}

                {category === 'feature' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Přínos pro ostatní táty &amp; uživatele:
                    </label>
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => setBenefit(e.target.value)}
                      placeholder="např. Zrychlí plánování střídavé péče a usnadní tisk"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}

                {category === 'support' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Okruh právního / rodinného dotazu:
                    </label>
                    <select
                      value={topicCategory}
                      onChange={(e) => setTopicCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      <option value="střídavá_péče">Střídavá péče & Rozsudky</option>
                      <option value="vyzivne">Výživné & Kalkulačky</option>
                      <option value="ospod">OSPOD & Soudní opatrovník</option>
                      <option value="předběžné_opatření">Předběžná opatření (§ 452 z.ř.s.)</option>
                      <option value="jiné">Ostatní právní dotazy</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>Stručný předmět / Název ticketu</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    category === 'bug'
                      ? 'např. Chybné tlačítko u generátoru návrhu na střídavku'
                      : category === 'feature'
                      ? 'např. Doplnění iCal exportu do Kalendáře péče'
                      : 'např. Dotaz k výkonu rozhodnutí uložením pokuty'
                  }
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>Detailní popis problému nebo návrhu</span>
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Popište co nejotevřeněji vaši situaci nebo přesné kroky, jak k chybě došlo..."
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed resize-y"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Po odeslání obdržíte e-mail s unikátním kódovým označením ticketu.</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:cursor-not-allowed shrink-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                      <span>Vytvářím ticket &amp; Odesílám e-mail...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-teal-400" />
                      <span>Odeslat ticket do systému</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* LIST VIEW */}
        {activeView === 'list' && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filter Toolbar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search input */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    placeholder="Hledat podle názvu, kódu či zprávy..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Filter Selectors */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  {/* Category Filter */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">Všechny kategorie</option>
                    <option value="bug">🐛 Hlášení chyby</option>
                    <option value="feature">💡 Návrhy vylepšení</option>
                    <option value="support">⚖️ Právní poradna</option>
                    <option value="general">❓ Obecné dotazy</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">Všechny stavy</option>
                    <option value="open">📥 Nové</option>
                    <option value="in_progress">🔍 V řešení</option>
                    <option value="testing">🧪 Čeká na nasazení</option>
                    <option value="resolved">✅ Vyřešeno</option>
                    <option value="rejected">❌ Zamítnuto</option>
                  </select>

                  {/* Toggle "Pouze moje" if logged in */}
                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => setShowOnlyMine(!showOnlyMine)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                        showOnlyMine
                          ? 'bg-teal-50 text-teal-800 border-teal-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <UserIcon className="w-3.5 h-3.5 text-teal-600" />
                      <span>Pouze Moje ({currentUser.email})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket Cards Grid / Table */}
            {filteredTickets.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                  🔍
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-display">Žádné tickety neodpovídají filtru</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Zkuste upravit vyhledávání nebo změnit zvolenou kategorii.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterStatus('all');
                    setFilterSearch('');
                    setShowOnlyMine(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Obnovit filtry</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredTickets.map((t) => {
                  const catCfg = categoriesConfig[t.category] || categoriesConfig['general'];
                  const stCfg = statusConfig[t.status] || statusConfig['open'];
                  const prCfg = priorityConfig[t.priority] || priorityConfig['medium'];
                  const Icon = catCfg.icon;

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTicket(t);
                        setActiveView('detail');
                      }}
                      className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-teal-300 rounded-2xl p-5 transition-all cursor-pointer shadow-3xs hover:shadow-xs group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${catCfg.bgColor}`}>
                          <Icon className={`w-5 h-5 ${catCfg.color}`} />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                              {t.ticketNumber}
                            </span>

                            {/* Status Badge */}
                            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${stCfg.className}`}>
                              {stCfg.label}
                            </span>

                            {/* Priority Badge */}
                            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${prCfg.className}`}>
                              {prCfg.label}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate font-display">
                            {t.title}
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-1">
                            {t.description}
                          </p>

                          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
                            <span>👤 {t.userName}</span>
                            <span>•</span>
                            <span>🕒 {new Date(t.createdAt).toLocaleDateString('cs-CZ')}</span>
                            {t.comments.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-teal-600 font-bold">💬 {t.comments.length} odpovědí</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-bold text-teal-700 group-hover:underline flex items-center gap-1">
                          Detail
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* DETAIL VIEW */}
        {activeView === 'detail' && selectedTicket && (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Back button */}
            <button
              onClick={() => setActiveView('list')}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-3xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zpět na přehled ticketů</span>
            </button>

            {/* Main Ticket Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-900 px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded-full border ${statusConfig[selectedTicket.status].className}`}>
                      {statusConfig[selectedTicket.status].label}
                    </span>
                    <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded-full border ${priorityConfig[selectedTicket.priority].className}`}>
                      {priorityConfig[selectedTicket.priority].label}
                    </span>
                  </div>

                  <h1 className="text-xl font-black font-display text-slate-900 pt-2">
                    {selectedTicket.title}
                  </h1>
                </div>

                <div className="text-right text-xs text-slate-400 font-mono">
                  <span>Vytvořeno: {new Date(selectedTicket.createdAt).toLocaleString('cs-CZ')}</span>
                </div>
              </div>

              {/* Author Info & Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Odesílatel</span>
                  <span className="font-bold text-slate-800">{selectedTicket.userName}</span>
                  <span className="text-[10px] text-slate-500 block">{selectedTicket.userEmail}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Kategorie</span>
                  <span className="font-bold text-slate-800">{categoriesConfig[selectedTicket.category].title}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Poslední aktualizace</span>
                  <span className="font-bold text-slate-800">{new Date(selectedTicket.updatedAt).toLocaleString('cs-CZ')}</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase font-bold text-slate-500">
                  Detailní popis zprávy:
                </h3>
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedTicket.description}
                </div>
              </div>

              {selectedTicket.benefit && (
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                  <span className="font-bold font-mono text-[10px] uppercase text-amber-800 block">💡 Navrhovaný přínos pro komunitu:</span>
                  <p>{selectedTicket.benefit}</p>
                </div>
              )}

              {/* Admin Quick Status Control Section */}
              {isAdmin && (
                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-teal-500/30">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      <h3 className="text-xs font-mono font-bold uppercase text-teal-300">
                        Správcovský panel (Admin) - Změna stavu ticketu
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Pravomoci správce</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(statusConfig) as TicketStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateStatus(st)}
                        disabled={updatingStatus || selectedTicket.status === st}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                          selectedTicket.status === st
                            ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        <span>{statusConfig[st].label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Comments / Discussion */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  <span>Komunikace &amp; Vyřešení ({selectedTicket.comments.length})</span>
                </h3>

                {selectedTicket.comments.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl text-center text-xs text-slate-500">
                    Zatím nebyla přidána žádná odpověď. Po zpracování správcem se odpověď zobrazí přímo zde.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedTicket.comments.map((cm) => (
                      <div
                        key={cm.id}
                        className={`p-4 rounded-2xl border text-xs space-y-2 ${
                          cm.isAdmin
                            ? 'bg-teal-50/80 border-teal-200 text-teal-950'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b pb-2 border-slate-200/60">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{cm.authorName}</span>
                            {cm.isAdmin && (
                              <span className="px-2 py-0.5 bg-teal-600 text-white font-mono text-[9px] font-extrabold uppercase rounded-full">
                                Správce Portálu
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {new Date(cm.createdAt).toLocaleString('cs-CZ')}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{cm.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new reply form */}
                <form onSubmit={handleAddComment} className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Přidat odpověď / doplňující zprávu:
                  </label>
                  <textarea
                    rows={3}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Napište doplňující dotaz nebo odpověď správce..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updatingStatus || !newCommentText.trim()}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {updatingStatus ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5 text-teal-400" />
                      )}
                      <span>Odeslat odpověď</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
