/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  Award, 
  Activity, 
  Clock, 
  Shield, 
  Camera, 
  RefreshCw,
  Sliders,
  Database,
  Lock,
  Heart
} from 'lucide-react';
import { User as UserType } from '../types';
import { saveDocument } from '../lib/firebase';
import { useLanguage } from '../lib/LanguageContext';
import IdentityHubSettings from './IdentityHubSettings';

interface UserProfileProps {
  currentUser: UserType | null;
  onOpenAuth: () => void;
  onUpdateCurrentUser: (user: UserType) => void;
}

export default function UserProfile({
  currentUser,
  onOpenAuth,
  onUpdateCurrentUser
}: UserProfileProps) {
  const { t, language } = useLanguage();

  // Profile Edit fields state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [customAvatarSeed, setCustomAvatarSeed] = useState('');

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Statistics State derived from localStorage keys used in UserPortal
  const [stats, setStats] = useState({
    evidenceCount: 0,
    timelineCount: 0,
    savedArticlesCount: 0,
    savedJudgmentsCount: 0,
    checklistProgress: { completed: 0, total: 7 },
    remindersCount: 0,
    messagesCount: 0,
    hasActiveCase: false
  });

  // Load current user values & local stats on mount/user change
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone((currentUser as any).phone || '');
      setCity((currentUser as any).city || '');
      setBio((currentUser as any).bio || '');
      setAvatar(currentUser.avatar || '');
      
      // Try to extract seed from dicebear URL if applicable
      if (currentUser.avatar && currentUser.avatar.includes('seed=')) {
        const seedParam = currentUser.avatar.split('seed=')[1];
        if (seedParam) {
          setCustomAvatarSeed(decodeURIComponent(seedParam.split('&')[0]));
        }
      }

      // Load Statistics from LocalStorage
      try {
        const localEvidence = localStorage.getItem('sh_portal_evidence');
        const localTimeline = localStorage.getItem('sh_portal_timeline');
        const localArticles = localStorage.getItem('sh_portal_saved_articles');
        const localJudgments = localStorage.getItem('sh_portal_saved_judgments');
        const localChecklist = localStorage.getItem('sh_portal_checklist');
        const localReminders = localStorage.getItem('sh_portal_custom_reminders');
        const localMessages = localStorage.getItem('sh_portal_messages');
        const localCaseInfo = localStorage.getItem('sh_portal_case_info');

        const evidence = localEvidence ? JSON.parse(localEvidence) : [];
        const timeline = localTimeline ? JSON.parse(localTimeline) : [];
        const articles = localArticles ? JSON.parse(localArticles) : [];
        const judgments = localJudgments ? JSON.parse(localJudgments) : [];
        const checklist = localChecklist ? JSON.parse(localChecklist) : [];
        const reminders = localReminders ? JSON.parse(localReminders) : [];
        const messages = localMessages ? JSON.parse(localMessages) : [];
        const caseInfo = localCaseInfo ? JSON.parse(localCaseInfo) : null;

        const completedChecklist = checklist.filter((item: any) => item.checked).length;

        setStats({
          evidenceCount: Array.isArray(evidence) ? evidence.length : 0,
          timelineCount: Array.isArray(timeline) ? timeline.length : 0,
          savedArticlesCount: Array.isArray(articles) ? articles.length : 0,
          savedJudgmentsCount: Array.isArray(judgments) ? judgments.length : 0,
          checklistProgress: {
            completed: checklist.length > 0 ? completedChecklist : 0,
            total: checklist.length > 0 ? checklist.length : 7
          },
          remindersCount: Array.isArray(reminders) ? reminders.length : 0,
          messagesCount: Array.isArray(messages) ? messages.length : 0,
          hasActiveCase: caseInfo && caseInfo.childName ? true : false
        });
      } catch (err) {
        console.warn("Failed to load user statistics from localStorage:", err);
      }
    }
  }, [currentUser]);

  // Handle randomized avatar seed update
  const generateNewAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 9);
    setCustomAvatarSeed(randomSeed);
    setAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(randomSeed)}`);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!name.trim()) {
      setSaveError('Název nebo jméno je povinné pole.');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    const updatedUser: UserType = {
      ...currentUser,
      name: name.trim(),
      avatar: avatar || currentUser.avatar,
      // Custom/extra properties
      phone: phone.trim(),
      city: city.trim(),
      bio: bio.trim(),
    } as any;

    try {
      // Save to Firebase Firestore users collection
      await saveDocument('users', currentUser.id, updatedUser);
      
      // Update local storage so navigation & views refresh immediately
      if (typeof window !== 'undefined') {
        localStorage.setItem('synthesis_hub_local_user', JSON.stringify(updatedUser));
      }

      // Bubble up to trigger App state update
      onUpdateCurrentUser(updatedUser);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving user profile to Firestore:", err);
      setSaveError('Nepodařilo se uložit profil na server. Zkontrolujte prosím připojení.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/60 p-8 text-center max-w-xl mx-auto my-12 shadow-sm animate-fadeIn" id="profile-unauth-view">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-6">
          <UserIcon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 font-display">Můj profil & Statistiky</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-md mx-auto">
          Zde uvidíte detailní statistiky o svém případu, uložené dokumenty, aktivitu a budete moci editovat své kontaktní údaje. Pro přístup k profilu se nejprve přihlaste.
        </p>
        <button
          onClick={onOpenAuth}
          className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-950 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Lock className="w-3.5 h-3.5 text-teal-400" />
          Přihlásit se do účtu
        </button>
      </div>
    );
  }

  // Calculate completeness percentage
  const checklistPercent = Math.round((stats.checklistProgress.completed / stats.checklistProgress.total) * 100);

  return (
    <div className="space-y-8 animate-fadeIn" id="user-profile-view-root">
      
      {/* 1. TOP HERO CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-sm border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Area with Hover Change Option */}
          <div className="relative group shrink-0">
            <img 
              src={avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`} 
              alt={name} 
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-xs border-2 border-teal-500/40 shadow-md object-cover transition-transform group-hover:scale-[1.02]"
              id="profile-avatar-img"
            />
            <button
              type="button"
              onClick={generateNewAvatar}
              className="absolute -bottom-2 -right-2 bg-slate-800 hover:bg-teal-600 text-white p-1.5 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-colors cursor-pointer"
              title="Vygenerovat náhodný avatar"
              id="profile-avatar-randomizer"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center md:text-left flex-grow">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white">{name || 'Bez jména'}</h2>
              <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono font-extrabold uppercase tracking-wider ${
                currentUser.role === 'admin' 
                  ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30' 
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              }`}>
                {currentUser.role === 'admin' ? 'Administrátor OS' : 'Rodič / Opatrovník'}
              </span>
            </div>
            
            <p className="text-xs text-slate-300 font-medium mt-1 font-mono flex items-center justify-center md:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.email}</span>
            </p>

            {bio && (
              <p className="text-xs text-slate-400 font-sans italic mt-3 max-w-xl leading-relaxed">
                "{bio}"
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mt-4 text-[10px] text-slate-400 font-semibold border-t border-slate-800/80 pt-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-500" />
                Registrován: {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('cs-CZ') : 'Neznámé'}
              </span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                Status ID: <strong className="text-slate-300 font-mono">{currentUser.id.substring(0, 8)}...</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW SECTION */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600" />
          Statistiky a aktivita na mém účtu
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card: Trezor důkazů */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-3xs hover:shadow-2xs transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Trezor důkazů</span>
              <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <strong className="text-2xl font-black text-slate-800 tracking-tight block">
              {stats.evidenceCount} <span className="text-xs font-semibold text-slate-400">souborů</span>
            </strong>
            <span className="text-[9px] text-slate-400 font-medium block mt-1">Zabezpečené důkazy k opatrovnictví</span>
          </div>

          {/* Card: Milníky případu */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-3xs hover:shadow-2xs transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Časová osa sporu</span>
              <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <strong className="text-2xl font-black text-slate-800 tracking-tight block">
              {stats.timelineCount} <span className="text-xs font-semibold text-slate-400">milníků</span>
            </strong>
            <span className="text-[9px] text-slate-400 font-medium block mt-1">Soudy, jednání, návštěvy OSPOD</span>
          </div>

          {/* Card: Uložené zdroje */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-3xs hover:shadow-2xs transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Uložené materiály</span>
              <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <strong className="text-2xl font-black text-slate-800 tracking-tight block">
              {stats.savedArticlesCount + stats.savedJudgmentsCount} <span className="text-xs font-semibold text-slate-400">článků</span>
            </strong>
            <span className="text-[9px] text-slate-400 font-medium block mt-1">Rychlé odkazy v mojí pracovně</span>
          </div>

          {/* Card: Připravenost sporu */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-3xs hover:shadow-2xs transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Připravenost sporu</span>
              <div className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <strong className="text-2xl font-black text-slate-800 tracking-tight block">
              {checklistPercent}% <span className="text-xs font-semibold text-slate-400">hotovo</span>
            </strong>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${checklistPercent}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-400 font-medium block mt-1.5">{stats.checklistProgress.completed} ze {stats.checklistProgress.total} strategických kroků</span>
          </div>

        </div>
      </div>

      {/* 3. IDENTITY HUB SECURITY & LOGIN METHODS */}
      <IdentityHubSettings 
        currentUser={currentUser} 
        onUpdateCurrentUser={onUpdateCurrentUser} 
      />

      {/* 4. PROFILE DETAILS & EDIT FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-3xs">
          <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-2 mb-6">
            <Sliders className="w-4.5 h-4.5 text-teal-600" />
            Editace osobních a kontaktních údajů
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-5" id="profile-edit-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                  Celé jméno / Přezdívka:
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Např. Ondřej Novák"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                    id="profile-name-input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                  Telefonní číslo (Nepovinné):
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+420 777 123 456"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium font-mono"
                    id="profile-phone-input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                  E-mail (Pouze pro čtení):
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-300 absolute left-3 top-3" />
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-100/75 border border-slate-200 rounded-xl text-xs text-slate-400 font-mono font-medium cursor-not-allowed"
                    id="profile-email-readonly"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                  Kraj / Město (Nepovinné):
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Např. Praha / Středočeský kraj"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                    id="profile-city-input"
                  />
                </div>
              </div>

            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                Osobní memento / Krátké bio (Zobrazuje se v záhlaví):
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Např. Bojuji o své děti slušně a strategicky. Chci pro ně to nejlepší zázemí."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium leading-relaxed"
                id="profile-bio-textarea"
              />
            </div>

            <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-4">
              <div className="flex-1">
                {saveSuccess && (
                  <p className="text-xs text-teal-600 font-bold flex items-center gap-1.5 animate-fadeIn" id="profile-save-success-msg">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Údaje byly úspěšně uloženy do databáze!
                  </p>
                )}
                {saveError && (
                  <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5 animate-fadeIn" id="profile-save-error-msg">
                    <span>⚠️ {saveError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-colors cursor-pointer flex items-center gap-2 shrink-0"
                id="profile-save-btn"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Ukládám údaje...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Uložit profil
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security, Integrations, Advice */}
        <div className="space-y-6">
          
          {/* Badge: Ochrana soukromí */}
          <div className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-6 shadow-3xs space-y-4">
            <h4 className="text-xs font-bold text-indigo-900 font-display flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-indigo-600" />
              Zabezpečení a šifrování
            </h4>
            <p className="text-[11px] text-indigo-800/80 leading-relaxed font-sans font-medium">
              Všechny vaše nahrané soubory v <strong>Trezoru důkazů</strong> a záznamy z časové osy jsou bezpečně uloženy pod vaší unikátní identitou a šifrovány. K vašemu obsahu nemá přístup nikdo jiný kromě vás a případných přizvaných osob z vašeho <strong>Rodičovského hubu</strong>.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-indigo-600 font-mono font-bold pt-1.5 border-t border-indigo-100/50">
              <Lock className="w-3.5 h-3.5" />
              <span>Synthesis Secure Encrypted Vault</span>
            </div>
          </div>

          {/* Mini Widget: Tip dne pro opatrovnictví */}
          <div className="bg-amber-50/40 border border-amber-200/50 rounded-3xl p-6 shadow-3xs space-y-3">
            <h4 className="text-xs font-bold text-amber-800 font-display flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Strategické doporučení pro tátu
            </h4>
            <p className="text-[11px] text-amber-900/80 leading-relaxed font-sans font-medium">
              Kompletní příprava před soudem snižuje stres o 80 %. Průběžně doplňujte data do svého trezoru důkazů, nechte si zanalyzovat zprávy pomocí <strong>BIFF Asistenta</strong> a mějte podepsanou veškerou písemnou komunikaci s protistranou.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
