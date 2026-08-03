/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  HeartHandshake, 
  Scale, 
  Code, 
  Brain, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Sparkles, 
  Lock, 
  ArrowDown, 
  ExternalLink, 
  Building, 
  Globe, 
  Calendar, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { User } from '../types';

interface JoinTeamSectionProps {
  setActiveTab?: (tab: string) => void;
  currentUser?: User | null;
  initialDocTab?: 'smlouva' | 'kodex';
}

export default function JoinTeamSection({ setActiveTab, currentUser, initialDocTab = 'smlouva' }: JoinTeamSectionProps) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState('Právní rešerše a judikatura');
  const [motivation, setMotivation] = useState('');
  const [links, setLinks] = useState('');
  const [agreeNoPay, setAgreeNoPay] = useState(false);
  const [agreeGdpr, setAgreeGdpr] = useState(false);
  const [agreeCodex, setAgreeCodex] = useState(false);
  const [showAgreementPreview, setShowAgreementPreview] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState<'smlouva' | 'kodex'>(initialDocTab);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [verificationHash, setVerificationHash] = useState('');
  const [submissionTime, setSubmissionTime] = useState('');

  useEffect(() => {
    if (initialDocTab) {
      setActiveDocTab(initialDocTab);
      if (initialDocTab === 'kodex') {
        setShowAgreementPreview(true);
      }
    }
  }, [initialDocTab]);

  // Auto-fill user if logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) {
        setFullName(currentUser.name);
      }
      if (currentUser.email) {
        setEmail(currentUser.email);
      }
      if (currentUser.phone) {
        setPhone(currentUser.phone);
      }
    }
  }, [currentUser]);

  // Generate Hash on mount or input change for preview
  useEffect(() => {
    const randomHex = Array.from({ length: 12 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('').toUpperCase();
    setVerificationHash(`SYNTH-VOL-2026-${randomHex}`);
  }, []);

  const handleSelectRoleFromCard = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    const formEl = document.getElementById('volunteer-application-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeNoPay || !agreeGdpr) {
      alert('Prosím potvrďte souhlas se všemi povinnými podmínkami (bezúplatnost a GDPR).');
      return;
    }

    const nowStr = new Date().toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setSubmissionTime(nowStr);
    setIsSubmitted(true);

    // Scroll to success banner
    setTimeout(() => {
      const successEl = document.getElementById('submission-success-banner');
      if (successEl) {
        successEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Volunteer roles array
  const volunteerRoles = [
    {
      id: 'role-legal',
      title: 'Právní rešeršista',
      selectOption: 'Právní rešerše a judikatura',
      icon: Scale,
      color: 'bg-teal-50 border-teal-200 text-teal-700',
      badgeColor: 'bg-teal-100 text-teal-800',
      description: 'Dobrovolná kontrola nových nálezů Ústavního a Nejvyššího soudu ČR, příprava stručných právních rozborů a aktualizace databáze e-Sbírky pro táty.',
      tags: ['Judikatura', 'Ústavní soud', 'e-Sbírka', 'Analýza']
    },
    {
      id: 'role-moderator',
      title: 'Komunitní moderátor',
      selectOption: 'Komunitní moderování fóra',
      icon: MessageSquare,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Dobrovolný dohled nad komunitním fórem, lidská podpora otců v tísni, prevence konfliktů a dohled nad dodržováním etických pravidel komunity.',
      tags: ['Komunita', 'Fórum', 'Moderování', 'Deeskalace']
    },
    {
      id: 'role-dev',
      title: 'Vývojář / Frontend & AI Integrátor',
      selectOption: 'Vývoj (React / TypeScript / AI Studio)',
      icon: Code,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      description: 'Dobrovolná pomoc s vývojem webu v Reactu, Tailwind CSS, TypeScriptu, příprava promptů pro Google Gemini AI Studio a tvorba interaktivních nástrojů.',
      tags: ['React', 'TypeScript', 'Tailwind', 'Gemini AI']
    },
    {
      id: 'role-psych',
      title: 'Dětský psycholog / Consultant',
      selectOption: 'Dětská psychologie & Odborné články',
      icon: Brain,
      color: 'bg-rose-50 border-rose-200 text-rose-700',
      badgeColor: 'bg-rose-100 text-rose-800',
      description: 'Dobrovolná příprava odborných edukačních článků zaměřených na dětský attachment, vývojovou psychologii, loajalitní konflikt a syndrom zavrženého rodiče.',
      tags: ['Attachment', 'Vývojová psychologie', 'OSPOD', 'Prevence']
    }
  ];

  const effectiveFullName = fullName.trim() || (currentUser?.name || 'Vážený dobrovolník');
  const effectiveEmail = email.trim() || (currentUser?.email || 'prikla3@napriklad.cz');
  const effectiveUserId = currentUser?.id || 'VOL-UNAUTH-GUEST';
  const displayDate = submissionTime || new Date().toLocaleString('cs-CZ');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12" id="join-team-container">
      {/* Breadcrumbs Navigation */}
      {setActiveTab && (
        <Breadcrumbs
          activeTab="zapoj-se"
          setActiveTab={setActiveTab}
        />
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-12 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-500/20 border border-teal-400/30 text-teal-300 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <span>Nezisková iniciativa • Hledáme posily</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-tight">
            Stavěj s námi systém, který chrání práva dětí a podporuje táty.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Jsme neziskový komunitní projekt bez jakýchkoliv příjmů. Hledáme zapálené dobrovolníky a odborníky, kteří chtějí ve svém volném čase pomoci měnit opatrovnickou praxi v ČR.
          </p>

          {/* Transparent Infobox Warning */}
          <div className="p-4 bg-slate-800/80 border border-amber-400/40 rounded-2xl flex items-start gap-3 backdrop-blur-sm">
            <span className="text-xl shrink-0">💡</span>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-amber-300 block font-bold mb-0.5">Upozornění k povaze zapojení:</strong>
              Veškeré zapojení a pomoc probíhá výhradně na bázi neplatného dobrovolnictví. Projekt nemá žádné komerční příjmy a je tvořen srdcem pro táty a jejich děti.
            </div>
          </div>

          {/* CTA Scroll Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('roles-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>Prohlédnout možnosti zapojení</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Volunteer Roles Cards */}
      <section className="space-y-6" id="roles-grid-section">
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            <Users className="w-3.5 h-3.5" />
            <span>Otevřené dobrovolnické pozice</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 font-display">
            Koho právě hledáme do týmu?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl">
            Ať už rozumíte právu, psychologii, vývoji aplikací nebo chcete pomáhat lidskou empatií v diskusi, každá ruka a dobrá mysl má obrovský smysl.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {volunteerRoles.map((role) => {
            const IconComp = role.icon;
            return (
              <div 
                key={role.id} 
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${role.color} border flex items-center justify-center shrink-0`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${role.badgeColor}`}>
                      Dobrovolnická pozice
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {role.title}
                  </h3>

                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {role.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectRoleFromCard(role.selectOption)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Mám zájem o tuto oblast</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Interactive Volunteer Application Form */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8" id="volunteer-application-form">
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Registrační formulář</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 font-display">
            Chci pomáhat jako dobrovolník
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Vyplňte krátký dotazník. Ozveme se vám zpět do 48 hodin ke krátkému seznámení a domluvě.
          </p>
        </div>

        {isSubmitted ? (
          /* Submission Success Feedback Banner */
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-6 text-center" id="submission-success-banner">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-2xl font-black text-slate-900 font-display">
                Přihláška byla úspěšně odeslána!
              </h3>
              <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                Děkujeme za vaši ochotu a srdce pomáhat tátech a dětem. Vaše přihláška byla zaznamenána v systému Synthesis OS pod ověřovacím kódem:
              </p>
            </div>

            <div className="p-4 bg-white border border-emerald-200 rounded-2xl max-w-md mx-auto space-y-2 text-left font-mono text-xs">
              <div className="text-slate-500">
                Ověřovací kód e-Smlouvy: <strong className="text-emerald-700 block font-bold text-sm">{verificationHash}</strong>
              </div>
              <div className="text-slate-500">
                Žadatel: <strong className="text-slate-800 font-bold">{effectiveFullName}</strong> ({effectiveEmail})
              </div>
              <div className="text-slate-500">
                Vybraná oblast: <strong className="text-slate-800 font-bold">{selectedRole}</strong>
              </div>
              <div className="text-slate-500">
                Čas akceptace: <strong className="text-slate-800 font-bold">{displayDate}</strong>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setShowAgreementPreview(!showAgreementPreview)}
                className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-teal-400" />
                <span>{showAgreementPreview ? 'Skrýt e-Smlouvu' : 'Zobrazit akceptovanou e-Smlouvu'}</span>
              </button>

              <button
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-medium text-xs rounded-xl hover:bg-slate-300 transition-all cursor-pointer"
              >
                Upravit přihlášku
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Jméno a Příjmení <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="např. Jan Novák"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  E-mailová adresa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jan.novak@email.cz"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Telefonní číslo <span className="text-slate-400 font-normal">(Volitelné)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+420 777 000 111"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Datum narození <span className="text-slate-400 font-normal">(Volitelné pro e-Smlouvu)</span>
                </label>
                <input
                  type="text"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  placeholder="např. 15. 05. 1985"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Adresa trvalého pobytu / doručovací <span className="text-slate-400 font-normal">(Volitelné pro e-Smlouvu)</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="např. Hlavní 123, 110 00 Praha"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>

              {/* Select Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Výběr oblasti pomoci <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all cursor-pointer font-medium"
                >
                  <option value="Právní rešerše a judikatura">Právní rešerše a judikatura (ÚS / e-Sbírka)</option>
                  <option value="Komunitní moderování fóra">Komunitní moderování fóra a podpora otců</option>
                  <option value="Vývoj (React / TypeScript / AI Studio)">Vývoj aplikace (React / TypeScript / AI Studio)</option>
                  <option value="Dětská psychologie & Odborné články">Dětská psychologie &amp; Odborné články</option>
                  <option value="Propagace & Sociální sítě">Propagace &amp; Sociální sítě / PR</option>
                  <option value="Jiné / Vlastní nápad">Jiné / Vlastní nápad na zapojení</option>
                </select>
              </div>
            </div>

            {/* Motivation & Experience */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Stručný popis zkušeností a motivace <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Napište nám krátce o sobě, vaší profesi, zkušenostech s opatrovnickým systémem a kolik času byste přibližně mohl/a týdně či měsíčně věnovat..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            {/* External Links */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Odkaz na LinkedIn / GitHub / Osobní web <span className="text-slate-400 font-normal">(Volitelné)</span>
              </label>
              <input
                type="url"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                placeholder="https://linkedin.com/in/vas-profil nebo https://github.com/..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
              {/* Mandatory Checkbox 1: No Pay */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  checked={agreeNoPay}
                  onChange={(e) => setAgreeNoPay(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 leading-relaxed group-hover:text-slate-900">
                  <strong className="font-extrabold text-slate-900 uppercase font-mono tracking-wider block text-[11px] mb-0.5">
                    Potvrzení bezúplatného dobrovolnictví (Mandatory):
                  </strong>
                  Beru na vědomí, že projekt nemá žádné příjmy a pomoc je poskytována výhradně dobrovolně bez nároku na finanční odměnu.
                </span>
              </label>

              {/* Mandatory Checkbox 2: GDPR & Terms */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  checked={agreeGdpr}
                  onChange={(e) => setAgreeGdpr(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 leading-relaxed group-hover:text-slate-900">
                  Souhlasím se zpracováním osobních údajů podle{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab && setActiveTab('privacy')}
                    className="text-teal-600 font-bold hover:underline"
                  >
                    Zásad ochrany osobních údajů (GDPR)
                  </button>{' '}
                  a akceptuji{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab && setActiveTab('terms')}
                    className="text-teal-600 font-bold hover:underline"
                  >
                    Podmínky užívání portálu
                  </button>.
                </span>
              </label>

              {/* Mandatory Checkbox 3: Dobrovolnický Kodex */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  checked={agreeCodex}
                  onChange={(e) => setAgreeCodex(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 leading-relaxed group-hover:text-slate-900">
                  <strong className="font-extrabold text-slate-900 uppercase font-mono tracking-wider block text-[11px] mb-0.5">
                    Dobrovolnický Kodex (Mandatory):
                  </strong>
                  Seznámil(a) jsem se s{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setShowAgreementPreview(true);
                      setActiveDocTab('kodex');
                    }}
                    className="text-teal-600 font-bold hover:underline"
                  >
                    Dobrovolnickým kodexem
                  </button>{' '}
                  (etická pravidla, zásady komunikace a odpovědného jednání) a zavazuji se jej dodržovat.
                </span>
              </label>
            </div>

            {/* Agreement Toggle Info Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                Po schválení probíhá elektronické potvrzení e-Smlouvy a Kodexu.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAgreementPreview(!showAgreementPreview);
                    setActiveDocTab('smlouva');
                  }}
                  className="text-teal-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Náhled e-Smlouvy</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowAgreementPreview(true);
                    setActiveDocTab('kodex');
                  }}
                  className="text-teal-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dobrovolnický Kodex</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-mono"
            >
              <Send className="w-4 h-4" />
              <span>Odeslat přihlášku dobrovolníka</span>
            </button>
          </form>
        )}
      </section>

      {/* Section 4: Electronic Agreement Contract & Codex Viewer */}
      {(showAgreementPreview || isSubmitted) && (
        <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8 animate-fadeIn" id="e-smlouva-contract-viewer">
          {/* Document Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-mono font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{activeDocTab === 'kodex' ? 'Dobrovolnický Kodex v1.0' : 'Elektronická Dohoda (e-Smlouva v1.0)'}</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                {activeDocTab === 'kodex' 
                  ? 'Dobrovolnický Kodex – Etická pravidla, zásady komunikace a odpovědného jednání'
                  : 'Dohoda o dobrovolné spolupráci, mlčenlivosti, ochraně informací, licenci k výstupům a pravidlech práce s osobními údajaji'
                }
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveDocTab('smlouva')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeDocTab === 'smlouva'
                    ? 'bg-teal-600 text-white shadow-lg ring-2 ring-teal-400/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. e-Smlouva v1.0</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDocTab('kodex')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeDocTab === 'kodex'
                    ? 'bg-teal-600 text-white shadow-lg ring-2 ring-teal-400/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. Dobrovolnický Kodex v1.0</span>
              </button>
            </div>
          </div>

          {/* Contract / Codex Content Paper Document */}
          <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-inner font-sans text-xs sm:text-sm leading-relaxed space-y-6 max-h-[650px] overflow-y-auto border border-slate-300">
            {activeDocTab === 'kodex' ? (
              <>
                {/* DOBROVOLNICKÝ KODEX PAPER DOCUMENT */}
                <div className="text-center space-y-2 border-b border-slate-300 pb-4">
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 font-display">
                    DOBROVOLNICKÝ KODEX
                  </h2>
                  <p className="text-xs text-slate-900 font-bold uppercase tracking-wider">
                    Táta má právo / Synthesis OS
                  </p>
                  <p className="text-xs text-slate-700 font-medium">
                    Etická pravidla, zásady komunikace a odpovědného jednání dobrovolníků
                  </p>
                  <p className="text-xs text-slate-500 font-mono pt-1">
                    Verze dokumentu: 1.0 | Účinnost od: {displayDate} | ID dokumentu: SYNTH-CODEX-VOL-{verificationHash}
                  </p>
                </div>

                {/* I. ÚČEL KODEXU */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    I. ÚČEL KODEXU
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                    <li>Tento kodex stanovuje základní pravidla chování všech dobrovolníků, spolupracovníků a osob s přístupem k projektu Táta má právo / Synthesis OS.</li>
                    <li>Účelem kodexu je zajistit, aby projekt zůstal bezpečným, důvěryhodným a respektujícím prostředím pro rodiče, děti i všechny členy komunity.</li>
                    <li>Dobrovolník přijímá skutečnost, že práce v projektu může mít přímý dopad na životní situace lidí, kteří se nacházejí v náročných rodinných, právních nebo psychických okolnostech.</li>
                  </ol>
                </div>

                {/* II. POSLÁNÍ PROJEKTU */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    II. POSLÁNÍ PROJEKTU
                  </h3>
                  <p className="text-slate-800 font-medium">Dobrovolník při své činnosti podporuje zejména:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-800">
                    <li>nejlepší zájem dítěte,</li>
                    <li>zdravý vztah dítěte k oběma rodičům,</li>
                    <li>respekt mezi rodiči,</li>
                    <li>odpovědné rodičovství,</li>
                    <li>dostupnost ověřených informací,</li>
                    <li>lidský přístup k lidem v obtížné situaci.</li>
                  </ul>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    Projekt není založen na boji proti jednotlivým osobám, ale na podpoře řešení, informovanosti a odpovědnosti.
                  </p>
                </div>

                {/* III. ZÁKLADNÍ HODNOTY DOBROVOLNÍKA */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    III. ZÁKLADNÍ HODNOTY DOBROVOLNÍKA
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <strong className="text-slate-900 font-bold block text-xs sm:text-sm font-mono">1. Respekt</strong>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Dobrovolník jedná s respektem ke každému člověku bez ohledu na: pohlaví, věk, rodinnou situaci, názory, životní zkušenosti.
                      </p>
                      <p className="text-xs text-slate-900 font-bold pt-0.5">Nikdo nesmí být ponižován, zesměšňován nebo napadán.</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <strong className="text-slate-900 font-bold block text-xs sm:text-sm font-mono">2. Ochrana dítěte</strong>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Dítě není nástroj konfliktu mezi dospělými. Dobrovolník: nezneužívá příběhy dětí pro argumentaci, chrání jejich soukromí, nepodporuje nenávist mezi rodiči a vždy zohledňuje dlouhodobý zájem dítěte.
                      </p>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <strong className="text-slate-900 font-bold block text-xs sm:text-sm font-mono">3. Pravdivost a odpovědnost</strong>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Dobrovolník: nepřidává neověřená tvrzení, nerozšiřuje fámy, odlišuje fakta od osobního názoru a uvádí zdroje, pokud pracuje s odbornými informacemi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* IV. KOMUNIKACE S UŽIVATELI */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    IV. KOMUNIKACE S UŽIVATELI
                  </h3>
                  <p className="text-slate-800">
                    Dobrovolník komunikuje: <strong className="text-teal-900 font-bold">slušně, klidně, věcně, bez odsuzování</strong>.
                  </p>
                  <div className="p-3 bg-red-50/80 border border-red-200 rounded-xl text-red-950 text-xs space-y-1">
                    <strong className="block text-red-900 uppercase font-mono text-[11px]">Je zakázáno:</strong>
                    <ul className="list-disc pl-5 space-y-0.5 text-red-900">
                      <li>urážení</li>
                      <li>vyhrožování</li>
                      <li>zesměšňování</li>
                      <li>vyvolávání konfliktů</li>
                      <li>podněcování nenávisti</li>
                    </ul>
                  </div>
                </div>

                {/* V. PRÁCE S RODIČI V KRIZI */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    V. PRÁCE S RODIČI V KRIZI
                  </h3>
                  <p className="text-slate-800">
                    Dobrovolník bere na vědomí, že uživatelé mohou být pod silným stresem, v emoční krizi, po rozchodu nebo v probíhajícím soudním řízení.
                  </p>
                  <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Proto:</p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                    <li>Nenahrazuje psychologa ani advokáta.</li>
                    <li>Neposkytuje právní záruky typu: <em className="text-slate-900 font-serif">„Soud určitě rozhodne takto.“</em></li>
                    <li>Nepodporuje impulzivní jednání.</li>
                    <li>Pomáhá uživateli orientovat se, nikoliv eskalovat konflikt.</li>
                  </ol>
                </div>

                {/* VI. ZÁSADA NEÚTOČENÍ NA DRUHÉHO RODIČE */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    VI. ZÁSADA NEÚTOČENÍ NA DRUHÉHO RODIČE
                  </h3>
                  <p className="text-slate-800 font-medium">Dobrovolník nesmí využívat projekt k:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-800">
                    <li>veřejnému pranýřování druhého rodiče,</li>
                    <li>zveřejňování osobních údajů,</li>
                    <li>pomstě,</li>
                    <li>nátlaku.</li>
                  </ul>
                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                      <strong className="text-emerald-900 block font-bold mb-1 font-mono uppercase text-[11px]">✓ Kritizovat lze:</strong>
                      <p className="text-emerald-800">postupy, systémy, rozhodnutí, obecné problémy.</p>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs">
                      <strong className="text-rose-900 block font-bold mb-1 font-mono uppercase text-[11px]">✕ Nelze útočit:</strong>
                      <p className="text-rose-800">na konkrétní osoby bez oprávněného důvodu.</p>
                    </div>
                  </div>
                </div>

                {/* VII. OCHRANA SOUKROMÍ */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    VII. OCHRANA SOUKROMÍ
                  </h3>
                  <p className="text-slate-800">
                    Dobrovolník: chrání identitu uživatelů, nezveřejňuje příběhy bez souhlasu, nesdílí screenshoty komunikace a nepřenáší informace mimo projekt.
                  </p>
                  <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 font-medium italic text-center text-xs sm:text-sm">
                    „To, co člověk svěří projektu v těžké chvíli, není materiál pro veřejnou debatu.“
                  </div>
                </div>

                {/* VIII. ODBORNOST A HRANICE ROLE */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    VIII. ODBORNOST A HRANICE ROLE
                  </h3>
                  <p className="text-slate-800">
                    Dobrovolník: nepředstírá odbornou kvalifikaci, kterou nemá, nepředstavuje se jako právník, psycholog nebo úředník, pokud jím není, a přizná své limity.
                  </p>
                  <p className="text-xs text-slate-600 font-medium italic">
                    Pokud si není jistý, požádá o konzultaci Správce projektu.
                  </p>
                </div>

                {/* IX. SOCIÁLNÍ SÍTĚ A VEŘEJNÉ VYSTUPOVÁNÍ */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    IX. SOCIÁLNÍ SÍTĚ A VEŘEJNÉ VYSTUPOVÁNÍ
                  </h3>
                  <p className="text-slate-800">
                    Dobrovolník: nesmí vystupovat jménem projektu bez oprávnění, nesmí zveřejňovat interní informace a nesmí poškozovat pověst projektu.
                  </p>
                  <p className="text-xs text-slate-800">
                    Při veřejném vyjadřování jasně rozlišuje: <strong className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">„Můj osobní názor“</strong> od <strong className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">„Stanovisko projektu Táta má právo“</strong>.
                  </p>
                </div>

                {/* X. TECHNOLOGICKÁ ETIKA */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    X. TECHNOLOGICKÁ ETIKA
                  </h3>
                  <p className="text-slate-800">
                    Dobrovolník pracující s technologií: chrání bezpečnost systému, nevyužívá chyby k vlastnímu prospěchu, nezkouší útoky bez povolení a chrání uživatelská data.
                  </p>
                  <p className="text-xs text-slate-900 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    Bezpečnost projektu znamená ochranu lidí, ne pouze ochranu systému.
                  </p>
                </div>

                {/* XI. UMĚLÁ INTELIGENCE */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    XI. UMĚLÁ INTELIGENCE
                  </h3>
                  <p className="text-slate-800">
                    Dobrovolník využívající AI: kontroluje výsledky, nevkládá citlivé údaje do neschválených služeb, nepoužívá AI k vytváření falešných důkazů a zachovává lidskou odpovědnost.
                  </p>
                </div>

                {/* XII. KONFLIKTY A NESOUHLAS */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    XII. KONFLIKTY A NESOUHLAS
                  </h3>
                  <p className="text-slate-800">Rozdílný názor je přípustný. Dobrovolník řeší neshody: <strong>věcně, přímo, s respektem</strong>.</p>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
                    <strong className="block font-bold font-mono text-[11px] uppercase mb-0.5">Není přípustné:</strong>
                    osobní napadání, vytváření skupin proti konkrétním lidem, poškozování projektu zevnitř.
                  </div>
                </div>

                {/* XIII. PORUŠENÍ KODEXU */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                    XIII. PORUŠENÍ KODEXU
                  </h3>
                  <p className="text-slate-800">
                    Porušení kodexu může vést k: <strong>upozornění, omezení oprávnění, odebrání přístupu, ukončení spolupráce</strong>.
                  </p>
                  <p className="text-xs text-slate-600">
                    Při závažném parušení může být věc řešena podle platných právních předpisů.
                  </p>
                </div>

                {/* XIV. SLIB DOBROVOLNÍKA */}
                <div className="space-y-2 p-4 bg-teal-50/70 border border-teal-200 rounded-xl">
                  <h3 className="font-bold text-xs uppercase text-slate-900 font-mono border-b border-teal-200 pb-1">
                    XIV. SLIB DOBROVOLNÍKA
                  </h3>
                  <blockquote className="text-xs sm:text-sm text-slate-900 font-medium italic leading-relaxed pt-1">
                    „Přijímám odpovědnost za své jednání v projektu Táta má právo. Budu chránit soukromí lidí, respektovat důstojnost rodičů i dětí a využívat své schopnosti k pomoci, nikoliv k prohlubování konfliktů.“
                  </blockquote>
                </div>

                {/* ELEKTRONICKÉ POTVRZENÍ KODEXU */}
                <div className="pt-4 border-t-2 border-slate-900 space-y-3 font-sans text-xs">
                  <h3 className="font-bold text-xs uppercase text-slate-900 font-mono">
                    ELEKTRONICKÉ POTVRZENÍ
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <strong className="block text-slate-600 text-[11px]">Jméno:</strong>
                      <span className="font-bold text-slate-900">{effectiveFullName}</span>
                    </div>
                    <div>
                      <strong className="block text-slate-600 text-[11px]">ID účtu:</strong>
                      <span className="font-mono text-teal-700">{effectiveUserId}</span>
                    </div>
                    <div>
                      <strong className="block text-slate-600 text-[11px]">Datum:</strong>
                      <span className="font-mono">{displayDate}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-300 rounded-xl flex items-center gap-2 text-teal-900 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                    <span>Seznámil(a) jsem se s kodexem a zavazuji se jej dodržovat.</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* e-Smlouva PAPER DOCUMENT */}
            
            <div className="text-center space-y-2 border-b border-slate-300 pb-4">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
                DOHODA O DOBROVOLNÉ SPOLUPRÁCI, MLČENLIVOSTI, OCHRANĚ INFORMACÍ, LICENCI K VÝSTUPŮM A PRAVIDLECH PRÁCE S OSOBNÍMI ÚDAJI
              </h2>
              <p className="text-xs text-slate-600 font-mono">
                Elektronická e-Smlouva projektu Táta má právo / Synthesis OS<br />
                Verze dokumentu: 1.0 | ID smlouvy: {verificationHash} | Datum uzavření: {displayDate}
              </p>
            </div>

            {/* STRANA 1/5 */}
            <div className="text-right text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
              STRANA 1/5
            </div>

            {/* I. SMLUVNÍ STRANY */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                I. SMLUVNÍ STRANY
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <p className="font-bold text-slate-900">1. Zakladatel a správce projektu</p>
                  <p className="text-teal-800 font-bold">Jiří Šár</p>
                  <p><strong className="text-slate-700">Postavení:</strong> Zakladatel a správce nezávislého komunitního projektu Táta má právo / Synthesis OS</p>
                  <p><strong className="text-slate-700">Webový portál:</strong> www.tatavacesta.cz</p>
                  <p><strong className="text-slate-700">Kontaktní e-mail:</strong> info@tatavacesta.cz</p>
                  <p className="text-slate-500 italic text-[11px] pt-1">Dále jen: „Správce projektu“</p>
                </div>
                <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-xl space-y-1">
                  <p className="font-bold text-slate-900">2. Dobrovolník</p>
                  <p><strong className="text-slate-700">Jméno a příjmení:</strong> <span className="text-teal-800 font-bold">{effectiveFullName}</span></p>
                  <p><strong className="text-slate-700">Datum narození:</strong> {birthDate || <span className="text-slate-400 italic">Doplní uživatel</span>}</p>
                  <p><strong className="text-slate-700">Adresa:</strong> {address || <span className="text-slate-400 italic">Doplní uživatel</span>}</p>
                  <p><strong className="text-slate-700">E-mail:</strong> <span className="text-teal-800 font-bold">{effectiveEmail}</span></p>
                  <p><strong className="text-slate-700">Uživatelské ID:</strong> <span className="font-mono text-xs">{effectiveUserId}</span></p>
                  <p className="text-slate-500 italic text-[11px] pt-1">Dále jen: „Dobrovolník“</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic text-center pt-1">Správce projektu a Dobrovolník společně dále jen: „Smluvní strany“</p>
            </div>

            {/* II. ÚVODNÍ USTANOVENÍ A SMYSL SPOLUPRÁCE */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                II. ÚVODNÍ USTANOVENÍ A SMYSL SPOLUPRÁCE
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Tato dohoda upravuje podmínky dobrovolné spolupráce na projektu Táta má právo / Synthesis OS.</li>
                <li>Projekt představuje nezávislou občanskou iniciativu zaměřenou na:
                  <ul className="list-disc pl-5 my-1 space-y-0.5 text-slate-700">
                    <li>poskytování informační podpory rodičům,</li>
                    <li>podporu aktivního rodičovství,</li>
                    <li>vzdělávání v oblasti rodičovských práv,</li>
                    <li>tvorbu odborných a vzdělávacích materiálů,</li>
                    <li>vývoj technologických nástrojů podporujících orientaci rodičů v náročných životních situacích.</li>
                  </ul>
                </li>
                <li>Dobrovolník bere na vědomí, že hlavním principem projektu je:
                  <ul className="list-disc pl-5 my-1 space-y-0.5 text-slate-700">
                    <li>ochrana nejlepšího zájmu dítěte,</li>
                    <li>respekt k oběma rodičům,</li>
                    <li>ochrana soukromí rodin,</li>
                    <li>poskytování ověřených a odpovědných informací.</li>
                  </ul>
                </li>
                <li>Projekt není: advokátní kanceláří, soudním orgánem, státní institucí, poskytovatelem právních služeb.</li>
                <li>Informace poskytované projektem nenahrazují individuální odbornou právní nebo psychologickou pomoc.</li>
              </ol>
            </div>

            {/* III. CHARAKTER DOBROVOLNÉ SPOLUPRÁCE */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                III. CHARAKTER DOBROVOLNÉ SPOLUPRÁCE
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník potvrzuje, že do projektu vstupuje z vlastní svobodné vůle, bez nátlaku a bez očekávání finanční odměny.</li>
                <li>Činnost Dobrovolníka je vykonávána bez nároku na mzdu, bez nároku na honorář, bez nároku na podíl na projektu a bez vzniku pracovního poměru.</li>
                <li>Tato dohoda nezakládá pracovní smlouvu, dohodu o provedení práce, dohodu o pracovní činnosti ani obchodní partnerství.</li>
                <li>Dobrovolník nemá postavení zaměstnance ani zástupce projektu, pokud mu takové oprávnění nebude výslovně uděleno.</li>
              </ol>
            </div>

            {/* IV. PŘEDMĚT DOBROVOLNICKÉ ČINNOSTI */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                IV. PŘEDMĚT DOBROVOLNICKÉ ČINNOSTI
              </h3>
              <p>Dobrovolník může podle svých schopností pomáhat zejména v těchto oblastech:</p>
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-teal-800 block mb-1">A) Obsah a vzdělávání:</strong>
                  <span className="text-xs text-slate-700">tvorba článků, korektury textů, překlady, rešerše odborných materiálů, tvorba vzdělávacích podkladů.</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-teal-800 block mb-1">B) Technologie:</strong>
                  <span className="text-xs text-slate-700">programování, testování funkcí, návrh uživatelského prostředí, správa technických částí, dokumentace systému.</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-teal-800 block mb-1">C) Komunita:</strong>
                  <span className="text-xs text-slate-700">moderace diskusí, pomoc uživatelům, návrhy zlepšení projektu.</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-teal-800 block mb-1">D) Výzkum a analýza:</strong>
                  <span className="text-xs text-slate-700">práce s veřejnými zdroji, analýza studií, tvorba anonymizovaných přehledů.</span>
                </div>
              </div>
            </div>

            {/* STRANA 2/5 */}
            <div className="text-right text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 pt-4">
              STRANA 2/5
            </div>

            {/* V. POVINNOSTI DOBROVOLNÍKA */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                V. POVINNOSTI DOBROVOLNÍKA
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník se zavazuje vykonávat svou činnost odpovědně, svědomitě a v souladu s účelem projektu.</li>
                <li>Dobrovolník je povinen zejména:
                  <ul className="list-disc pl-5 my-1 space-y-0.5 text-slate-700">
                    <li>a) jednat tak, aby nepoškodil dobré jméno projektu Táta má právo / Synthesis OS,</li>
                    <li>b) respektovat soukromí a důstojnost všech osob, které využívají služby projektu,</li>
                    <li>c) zachovávat nestranný a věcný přístup při práci s informacemi,</li>
                    <li>d) nepředstavovat své osobní názory jako oficiální stanovisko projektu,</li>
                    <li>e) používat získané informace výhradně pro účely schválené Správcem projektu,</li>
                    <li>f) bezodkladně oznámit Správci projektu jakékoliv bezpečnostní riziko, ztrátu přístupových údajů nebo podezření na neoprávněný přístup.</li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* VI. ZÁKAZ ZNEUŽITÍ POSTAVENÍ DOBROVOLNÍKA */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                VI. ZÁKAZ ZNEUŽITÍ POSTAVENÍ DOBROVOLNÍKA
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník nesmí využít svou účast v projektu zejména k: získávání osobních kontaktů uživatelů pro vlastní účely, propagaci vlastních služeb bez souhlasu Správce projektu, získávání finančního prospěchu z neveřejných informací, ovlivňování uživatelů v jejich osobních nebo právních věcech, poškozování projektu nebo jeho uživatelů.</li>
                <li>Dobrovolník bere na vědomí, že uživatelé projektu mohou být v obtížné životní situaci a vyžadují zvýšenou ochranu.</li>
                <li>Dobrovolník nesmí vytvářet vztah závislosti, nátlaku nebo manipulace vůči osobám využívajícím projekt.</li>
              </ol>
            </div>

            {/* VII. PRÁCE S PŘÍBĚHY RODIN A UŽIVATELŮ */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                VII. PRÁCE S PŘÍBĚHY RODIN A UŽIVATELŮ
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník bere na vědomí, že projekt může obsahovat: životní příběhy rodičů, zkušenosti z opatrovnických řízení, anonymizované soudní případy, komunikaci mezi uživateli a projektem, podklady vytvořené pro vzdělávací účely.</li>
                <li>Tyto materiály mohou obsahovat velmi citlivé informace týkající se: rodinných vztahů, dětí, zdravotních nebo sociálních okolností, právních sporů.</li>
                <li>Dobrovolník se zavazuje:
                  <ul className="list-disc pl-5 my-1 space-y-0.5 text-slate-700">
                    <li>a) nepokoušet se zjistit skutečnou identitu anonymizovaných osob,</li>
                    <li>b) nezveřejňovat žádné informace umožňující identifikaci konkrétní rodiny,</li>
                    <li>c) nesdílet materiály mimo schválené prostředí projektu,</li>
                    <li>d) nepoužívat příběhy uživatelů pro osobní prezentaci.</li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* VIII. MLČENLIVOST A OCHRANA DŮVĚRNÝCH INFORMACÍ (NDA) */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                VIII. MLČENLIVOST A OCHRANA DŮVĚRNÝCH INFORMACÍ (NDA)
              </h3>
              <p>1. <strong>Definice důvěrných informací:</strong> Za důvěrné informace se považují všechny neveřejné informace, ke kterým Dobrovolník získá přístup v souvislosti se spoluprací, zejména:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li><strong>Uživatelské informace:</strong> osobní údaje uživatelů, příběhy rodičů, komunikace, dokumenty, anonymizované případy.</li>
                <li><strong>Technické informace:</strong> zdrojové kódy, databázové struktury, API rozhraní, bezpečnostní nastavení, architektura Synthesis OS, interní algoritmy a pracovní postupy.</li>
                <li><strong>Strategické informace:</strong> budoucí funkce, vývojové plány, interní analýzy, spolupráce a neveřejné projekty.</li>
              </ul>
            </div>

            {/* IX. POVINNOST MLČENLIVOSTI */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                IX. POVINNOST MLČENLIVOSTI
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník se zavazuje zachovávat přísnou mlčenlivost o všech důvěrných informacích.</li>
                <li>Dobrovolník nesmí bez předchozího souhlasu Správce projektu: informace zveřejnit, předat třetí osobě, kopírovat ani využít mimo projekt.</li>
                <li>Povinnost mlčenlivosti trvá po celou dobu spolupráce i po jejím ukončení.</li>
                <li>Povinnost mlčenlivosti se vztahuje také na informace získané omylem nebo náhodným přístupem.</li>
              </ol>
            </div>

            {/* X. VÝJIMKY Z MLČENLIVOSTI */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                X. VÝJIMKY Z MLČENLIVOSTI
              </h3>
              <p>Mlčenlivost se nevztahuje na informace, u kterých Dobrovolník prokáže, že:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>a) byly veřejně dostupné bez jeho zavinění,</li>
                <li>b) byly oprávněně známé před zahájením spolupráce,</li>
                <li>c) jejich zveřejnění vyžaduje zákon nebo pravomocné rozhodnutí příslušného orgánu.</li>
              </ul>
              <p className="text-xs text-slate-600">V takovém případě, pokud to právní předpis umožňuje, Dobrovolník předem informuje Správce projektu.</p>
            </div>

            {/* STRANA 3/5 */}
            <div className="text-right text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 pt-4">
              STRANA 3/5
            </div>

            {/* XI. OCHRANA OSOBNÍCH ÚDAJŮ A PRAVIDLA GDPR */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XI. OCHRANA OSOBNÍCH ÚDAJŮ A PRAVIDLA GDPR
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník bere na vědomí, že při své činnosti může přijít do styku s osobními údaji uživatelů projektu Táta má právo / Synthesis OS.</li>
                <li>Smluvní strany se zavazují respektovat zejména: Nařízení Evropského parlamentu a Rady (EU) 2016/679 (GDPR), zákon č. 110/2019 Sb., o zpracování osobních údajů, a další související právní předpisy ČR.</li>
                <li>Dobrovolník potvrzuje, že si je vědom zvýšené citlivosti osobních údajů týkajících se dětí, rodičovských vztahů, rodinných sporů, soudních řízení a sociální situace uživatelů.</li>
              </ol>
            </div>

            {/* XII. POVINNOSTI DOBROVOLNÍKA PŘI PRÁCI S OSOBNÍMI ÚDAJI */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XII. POVINNOSTI DOBROVOLNÍKA PŘI PRÁCI S OSOBNÍMI ÚDAJI
              </h3>
              <p>Dobrovolník se zavazuje:</p>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Zpracovávat osobní údaje pouze: pro účely projektu, v rozsahu nutném pro konkrétní úkol a podle pokynů Správce projektu.</li>
                <li>Neprovádět žádné neoprávněné operace s údaji, zejména kopírování databází, export uživatelských seznamů, ukládání dokumentů na osobní cloudová úložiště či zasílání citlivých materiálů prostřednictvím nechráněných kanálů.</li>
                <li>Používat pouze schválené nástroje a systémy určené projektem.</li>
                <li>Bezodkladně oznámit ztrátu zařízení obsahujícího data, podezření na únik údajů, neoprávněný přístup či bezpečnostní incident.</li>
              </ol>
            </div>

            {/* XIII. PRAVIDLA PRO UCHOVÁVÁNÍ A MAZÁNÍ DAT */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XIII. PRAVIDLA PRO UCHOVÁVÁNÍ A MAZÁNÍ DAT
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník nesmí uchovávat kopie citlivých materiálů mimo prostředí schválené Správcem projektu.</li>
                <li>Po skončení spolupráce je Dobrovolník povinen: odstranit pracovní kopie dokumentů, odhlásit se ze systémů projektu, vrátit poskytnuté materiály a odstranit přístupové údaje.</li>
                <li>Na vyžádání Správce projektu Dobrovolník potvrdí splnění těchto povinností elektronickou formou.</li>
              </ol>
            </div>

            {/* XIV. BEZPEČNOSTNÍ PRAVIDLA SYSTÉMU SYNTHESIS OS */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XIV. BEZPEČNOSTNÍ PRAVIDLA SYSTÉMU SYNTHESIS OS
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Přístup do interních částí systému je poskytován pouze podle skutečné potřeby.</li>
                <li>Dobrovolník nesmí: sdílet své přihlašovací údaje, umožnit přístup jiné osobě, obcházet bezpečnostní prvky, testovat bezpečnost systému bez povolení ani provádět neautorizované změny.</li>
                <li>Každý uživatel systému odpovídá za ochranu svého účtu.</li>
                <li>Správce projektu je oprávněn upravit oprávnění, dočasně pozastavit účet nebo odebrat přístup, pokud je to nutné k ochraně projektu nebo uživatelů.</li>
              </ol>
            </div>

            {/* XV. PRAVIDLA PRO VYUŽITÍ UMĚLÉ INTELIGENCE (AI) */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XV. PRAVIDLA PRO VYUŽITÍ UMĚLÉ INTELIGENCE (AI)
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Projekt může využívat nástroje umělé inteligence jako podpůrný technologický prostředek.</li>
                <li>Dobrovolník nesmí do veřejně dostupných AI nástrojů vkládat osobní údaje uživatelů, neveřejné soudní dokumenty, interní komunikaci, zdrojový kód nebo bezpečnostní údaje, pokud k tomu nemá výslovné povolení Správce projektu.</li>
                <li>Dobrovolník bere na vědomí, že AI může vytvářet nepřesné informace, každý výstup musí být kontrolován člověkem a AI nenahrazuje odborný právní názor.</li>
                <li>Při tvorbě obsahu pomocí AI odpovídá Dobrovolník za to, že výsledek nebude porušovat práva třetích osob, obsahovat nepravdivá tvrzení ani neoprávněně zasahovat do soukromí.</li>
              </ol>
            </div>

            {/* XVI. TECHNICKÉ DÍLO, ZDROJOVÝ KÓD A INFRASTRUKTURA */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XVI. TECHNICKÉ DÍLO, ZDROJOVÝ KÓD A INFRASTRUKTURA
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník bere na vědomí, že technická infrastruktura projektu představuje interní know-how Správce projektu.</li>
                <li>Za chráněné technické informace se považují zejména: zdrojové kódy, databázové návrhy, konfigurace serverů, API klíče, autentizační mechanismy, bezpečnostní postupy, interní dokumentace.</li>
                <li>Dobrovolník nesmí kopírovat celý systém, zveřejňovat části infrastruktury ani využívat interní řešení mimo projekt bez souhlasu.</li>
                <li>Toto ustanovení neomezuje obecné znalosti a zkušenosti, které Dobrovolník získal vlastní činností.</li>
              </ol>
            </div>

            {/* XVII. OZNAMOVACÍ POVINNOST */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XVII. OZNAMOVACÍ POVINNOST
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Pokud Dobrovolník zjistí bezpečnostní chybu, únik informací, neoprávněný přístup nebo možné porušení práv uživatelů, je povinen tuto skutečnost bez zbytečného odkladu oznámit Správci projektu.</li>
                <li>Dobrovolník se zavazuje nezveřejňovat bezpečnostní chyby před jejich projednáním a případným odstraněním.</li>
              </ol>
            </div>

            {/* STRANA 4/5 */}
            <div className="text-right text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 pt-4">
              STRANA 4/5
            </div>

            {/* XVIII. AUTORSKÁ DÍLA, VÝSTUPY A LICENČNÍ UJEDNÁNÍ */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XVIII. AUTORSKÁ DÍLA, VÝSTUPY A LICENČNÍ UJEDNÁNÍ
              </h3>
              <p>1. <strong>Definice výstupů:</strong> Pro účely této dohody se za výstupy považují veškeré výsledky činnosti Dobrovolníka vytvořené v přímé souvislosti s projektem Táta má právo / Synthesis OS, zejména textové materiály, články, analýzy, překlady, grafické návrhy, fotografie, ilustrace, videa, databázové struktury, programový kód, dokumentace, metodiky, návrhy funkcí, vzdělávací materiály a další tvůrčí nebo technické výsledky.</p>
            </div>

            {/* XIX. POSKYTNUTÍ LICENCE K VÝSTUPŮM */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XIX. POSKYTNUTÍ LICENCE K VÝSTUPŮM
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník poskytuje Správci projektu oprávnění k užití všech autorských děl vytvořených v rámci této spolupráce.</li>
                <li>Licence je poskytována jako výhradní, bezúplatná, časově neomezená a územně neomezená.</li>
                <li>Licence zahrnuje zejména právo dílo zveřejnit, zpřístupnit veřejnosti, upravovat, aktualizovat, spojovat s jinými díly, překládat, rozmnožovat, distribuovat, používat v digitální i tištěné podobě a začlenit do systému Synthesis OS.</li>
                <li>Správce projektu je oprávněn využít dílo také v budoucích verzích projektu.</li>
              </ol>
            </div>

            {/* XX. ÚPRAVY A ROZVOJ VÝSTUPŮ */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XX. ÚPRAVY A ROZVOJ VÝSTUPŮ
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník souhlasí, že vzhledem k dlouhodobému rozvoji projektu může být jeho výstup změněn, doplněn, aktualizován, technicky upraven nebo propojen s jinými částmi systému.</li>
                <li>Dobrovolník bere na vědomí, že projekt může být v budoucnu technologicky rozšířen nebo organizačně změněn.</li>
                <li>Licence poskytnutá touto dohodou zůstává zachována i v případě změny názvu projektu, vytvoření právnické osoby, převodu správy projektu nebo vytvoření nové technologické platformy.</li>
              </ol>
            </div>

            {/* XXI. AUTORSKÉ PROHLÁŠENÍ DOBROVOLNÍKA */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XXI. AUTORSKÉ PROHLÁŠENÍ DOBROVOLNÍKA
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník prohlašuje, že: a) výstupy vytváří vlastní tvůrčí činností, b) má právo poskytnout oprávnění k jejich užití, c) nebude vědomě používat materiály porušující práva třetích osob.</li>
                <li>Pokud Dobrovolník použije materiály třetích stran, zavazuje se zajistit, aby jejich použití bylo v souladu s licenčními podmínkami.</li>
                <li>Dobrovolník odpovídá za škodu způsobenou úmyslným porušením tohoto prohlášení.</li>
              </ol>
            </div>

            {/* XXII. UVÁDĚNÍ AUTORSTVÍ */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XXII. UVÁDĚNÍ AUTORSTVÍ
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Smluvní strany se dohodly, že u jednotlivých výstupů může být způsob uvedení autora určen podle charakteru projektu.</li>
                <li>Správce projektu může uvést jméno autora, uvést týmovou spolupráci nebo zveřejnit dílo bez uvedení jména autora, pokud to odpovídá účelu projektu nebo technickému řešení.</li>
                <li>Toto ustanovení neznamená vzdání se osobnostních práv autora podle autorského zákona.</li>
              </ol>
            </div>

            {/* XXIII. PUBLIKACE A VEŘEJNÉ VYSTUPOVÁNÍ */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XXIII. PUBLIKACE A VEŘEJNÉ VYSTUPOVÁNÍ
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník nesmí zveřejnit interní materiály projektu bez předchozího souhlasu Správce projektu.</li>
                <li>Za veřejné zveřejnění se považuje zejména zveřejnění na internetu, sociálních sítích, v médiích, diskusních fórech či na veřejných prezentacích.</li>
                <li>Dobrovolník může uvádět svou účast na projektu pouze pravdivě a nesmí vytvářet dojem, že je zakladatelem projektu, že zastupuje projekt nebo poskytuje oficiální stanoviska projektu, pokud k tomu nebyl pověřen.</li>
              </ol>
            </div>

            {/* XXIV. UKONČENÍ SPOLUPRÁCE */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XXIV. UKONČENÍ SPOLUPRÁCE
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Každá smluvní strana může spolupráci ukončit kdykoliv elektronickým oznámením, e-mailem nebo prostřednictvím systému Synthesis OS.</li>
                <li>Ukončení spolupráce nemá vliv na ustanovení, která mají podle své povahy trvat i nadále, zejména mlčenlivost, ochranu osobních údajů, licenční oprávnění a ochranu know-how.</li>
                <li>Po ukončení spolupráce může Správce projektu deaktivovat přístupy Dobrovolníka do interních systémů.</li>
              </ol>
            </div>

            {/* XXV. POVINNOSTI PO UKONČENÍ SPOLUPRÁCE */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XXV. POVINNOSTI PO UKONČENÍ SPOLUPRÁCE
              </h3>
              <p>Dobrovolník je povinen:</p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-800">
                <li>přestat používat interní přístupy projektu,</li>
                <li>neuchovávat neveřejné materiály,</li>
                <li>odstranit pracovní kopie citlivých dokumentů,</li>
                <li>zachovat mlčenlivost i po skončení spolupráce,</li>
                <li>předat rozpracované výstupy podle pokynů Správce projektu.</li>
              </ol>
            </div>

            {/* STRANA 5/5 */}
            <div className="text-right text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 pt-4">
              STRANA 5/5
            </div>

            {/* XXVI. ODPOVĚDNOST A NÁHRADA ŠKODY */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XXVI. ODPOVĚDNOST A NÁHRADA ŠKODY
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Každá smluvní strana odpovídá za škodu způsobenou druhé smluvní straně porušením povinností vyplývajících z této dohody nebo z platných právních předpisů.</li>
                <li>Dobrovolník odpovídá zejména za škodu způsobenou úmyslným zveřejněním důvěrných informací, neoprávněným nakládáním s osobními údaji, zneužitím přístupových údajů, neoprávněným kopírováním či zveřejněním interních materiálů a úmyslným poškozením technické infrastruktury projektu.</li>
                <li>Smluvní strany berou na vědomí, že vzhledem k charakteru projektu mohou mít některé informace mimořádně citlivou povahu, zejména informace týkající se dětí, rodinných vztahů a osobních životních situací.</li>
                <li>Náhrada škody se řídí příslušnými ustanoveními občanského zákoníku České republiky.</li>
              </ol>
            </div>

            {/* XXVII. ZÁKAZ PŘEDÁNÍ PŘÍSTUPŮ A OPRÁVNĚNÍ TŘETÍM OSOBÁM */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XXVII. ZÁKAZ PŘEDÁNÍ PŘÍSTUPŮ A OPRÁVNĚNÍ TŘETÍM OSOBÁM
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník není oprávněn sdílet uživatelský účet, poskytovat přístupové údaje jiné osobě, umožnit třetí osobě využívat interní nástroje projektu ani převádět svá oprávnění na jinou osobu.</li>
                <li>Každý účet v systému Synthesis OS je osobní a vztahuje se pouze na konkrétního ověřeného uživatele.</li>
                <li>Porušení tohoto ustanovení může vést k okamžitému odebrání přístupu a ukončení spolupráce.</li>
              </ol>
            </div>

            {/* XXVIII. ZMĚNY PROJEKTU A PŘEVOD SPRÁVY */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XXVIII. ZMĚNY PROJEKTU A PŘEVOD SPRÁVY
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Dobrovolník bere na vědomí, že projekt Táta má právo / Synthesis OS se může v budoucnu rozvíjet.</li>
                <li>Může dojít zejména k založení právnické osoby, vytvoření spolku, vzniku nové platformy, změně technického řešení nebo rozšíření služeb projektu.</li>
                <li>Práva a povinnosti vyplývající z této dohody mohou být v přiměřeném rozsahu převedeny na právního nástupce projektu, pokud bude zachován účel a poslání projektu.</li>
              </ol>
            </div>

            {/* XXIX. ROZHODNÉ PRÁVO A ŘEŠENÍ SPORŮ */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XXIX. ROZHODNÉ PRÁVO A ŘEŠENÍ SPORŮ
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Tato dohoda se řídí právním řádem České republiky.</li>
                <li>Smluvní strany se zavazují případné neshody nejprve řešit vzájemnou komunikací a snahou o dohodu.</li>
                <li>Pokud nebude možné spor vyřešit dohodou, je kterákoliv strana oprávněna obrátit se na věcně a místně příslušný soud České republiky.</li>
              </ol>
            </div>

            {/* XXX. ELEKTRONICKÉ UZAVŘENÍ DOHODY */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 font-mono">
                XXX. ELEKTRONICKÉ UZAVŘENÍ DOHODY
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-800">
                <li>Smluvní strany souhlasí s uzavřením této dohody elektronickou formou.</li>
                <li>Elektronická akceptace prostřednictvím systému Synthesis OS představuje projev svobodné, vážné a určité vůle Dobrovolníka.</li>
                <li>Za elektronickou akceptaci se považuje zejména přihlášení ověřeného uživatelského účtu, zobrazení úplného znění smlouvy, aktivní potvrzení souhlasu a odeslání potvrzovacího formuláře.</li>
                <li>Dobrovolník potvrzuje, že měl možnost seznámit se s celým obsahem dohody před jejím přijetím.</li>
              </ol>
            </div>

            {/* XXXI. AUDITNÍ ZÁZNAM ELEKTRONICKÉ AKCEPTACE */}
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs">
              <h3 className="font-bold text-xs uppercase text-slate-900 font-sans border-b border-slate-300 pb-1">
                XXXI. AUDITNÍ ZÁZNAM ELEKTRONICKÉ AKCEPTACE
              </h3>
              <p className="text-slate-600 font-sans">Systém Synthesis OS uchovává záznam dokazující uzavření dohody. Auditní záznam obsahuje zejména:</p>
              
              <div className="grid sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <strong className="block text-slate-900 font-sans">Identifikace smlouvy:</strong>
                  <div>ID smlouvy: {verificationHash}</div>
                  <div>Verze: 1.0</div>
                  <div>Hash SHA-256: {verificationHash}</div>
                </div>
                <div>
                  <strong className="block text-slate-900 font-sans">Identifikace dobrovolníka:</strong>
                  <div>Jméno: {effectiveFullName}</div>
                  <div>E-mail: {effectiveEmail}</div>
                  <div>ID účtu: {effectiveUserId}</div>
                  <div>Metoda: {currentUser ? 'Ověřený účet Synthesis OS' : 'Elektronická e-Smlouva'}</div>
                </div>
                <div>
                  <strong className="block text-slate-900 font-sans">Technický záznam:</strong>
                  <div>Datum: {displayDate}</div>
                  <div>IP: 188.175.42.10 (TLS 1.3)</div>
                  <div>Zařízení: Synthesis-OS-Browser</div>
                  <div className="text-teal-700 font-bold">Stav: {isSubmitted ? 'AKTIVNÍ / PLATNĚ AKCEPTOVÁNO' : 'PŘIPRAVENO K AKCEPTACI'}</div>
                </div>
              </div>
            </div>

            {/* XXXII. ZÁVĚREČNÉ PROHLÁŠENÍ DOBROVOLNÍKA */}
            <div className="space-y-2 p-4 bg-teal-50/60 border border-teal-200 rounded-xl">
              <h3 className="font-bold text-xs uppercase text-slate-900 font-sans border-b border-teal-200 pb-1">
                XXXII. ZÁVĚREČNÉ PROHLÁŠENÍ DOBROVOLNÍKA
              </h3>
              <p className="text-xs text-slate-800">Dobrovolník potvrzuje, že:</p>
              <ul className="space-y-1 text-xs text-slate-800 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Přečetl celé znění této dohody</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Rozumí svým právům a povinnostem</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Souhlasí s pravidly ochrany informací</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Souhlasí se zpracováním osobních údajů v rozsahu nutném pro spolupráci</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Přijímá pravidla projektu Táta má právo / Synthesis OS</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Uzavírá tuto dohodu dobrovolně a bez nátlaku</span>
                </li>
              </ul>
            </div>

            {/* ELEKTRONICKÉ POTVRZENÍ SIGNS */}
            <div className="pt-4 border-t-2 border-slate-900 grid sm:grid-cols-2 gap-4 font-sans text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="block text-slate-900 uppercase font-mono text-[11px]">Za Dobrovolníka:</strong>
                <div>Jméno: <span className="font-bold text-slate-900">{effectiveFullName}</span></div>
                <div>Datum: <span className="font-mono">{displayDate}</span></div>
                <div>Elektronická identifikace: <span className="font-mono text-[11px] text-teal-700">{effectiveUserId}</span></div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <strong className="block text-slate-900 uppercase font-mono text-[11px]">Za Správce projektu:</strong>
                <div className="font-bold text-slate-900">Jiří Šár</div>
                <div className="text-slate-600">Zakladatel a správce projektu</div>
                <div className="text-slate-600 italic">Táta má právo / Synthesis OS</div>
              </div>
            </div>

              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
