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
}

export default function JoinTeamSection({ setActiveTab, currentUser }: JoinTeamSectionProps) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState('Právní rešerše a judikatura');
  const [motivation, setMotivation] = useState('');
  const [links, setLinks] = useState('');
  const [agreeNoPay, setAgreeNoPay] = useState(false);
  const [agreeGdpr, setAgreeGdpr] = useState(false);
  const [showAgreementPreview, setShowAgreementPreview] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [verificationHash, setVerificationHash] = useState('');
  const [submissionTime, setSubmissionTime] = useState('');

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
            </div>

            {/* Agreement Toggle Info Button */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                Po schválení probíhá elektronické potvrzení e-Smlouvy.
              </span>
              <button
                type="button"
                onClick={() => setShowAgreementPreview(!showAgreementPreview)}
                className="text-teal-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{showAgreementPreview ? 'Skrýt náhled e-Smlouvy' : 'Zobrazit náhled e-Smlouvy'}</span>
              </button>
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

      {/* Section 4: Electronic Agreement Contract Viewer (e-Smlouva) */}
      {(showAgreementPreview || isSubmitted) && (
        <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8 animate-fadeIn" id="e-smlouva-contract-viewer">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-mono font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Elektronická Dohoda (e-Smlouva)</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Dohoda o dobrovolnické spolupráci a ochraně informací
              </h3>
            </div>

            <div className="text-xs font-mono text-slate-400 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
              Hash: <span className="text-teal-300 font-bold">{verificationHash}</span>
            </div>
          </div>

          {/* Contract Content Paper Document */}
          <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-inner font-serif text-xs sm:text-sm leading-relaxed space-y-6 max-h-[600px] overflow-y-auto border border-slate-300">
            
            <div className="text-center space-y-2 border-b border-slate-300 pb-4">
              <h2 className="text-base sm:text-lg font-black uppercase font-sans tracking-tight text-slate-900">
                DOHODA O DOBROVOLNICKÉ SPOLUPRÁCI A OCHRANĚ INFORMACÍ (e-Smlouva)
              </h2>
              <p className="text-xs text-slate-500 font-sans italic">
                Uzavřená elektronicky v rámci systému Synthesis OS – Táta má právo
              </p>
            </div>

            {/* Article I */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm font-sans uppercase text-slate-900 border-b border-slate-200 pb-1">
                I. SMLUVNÍ STRANY
              </h3>
              <div className="space-y-2 pl-2 text-slate-800 font-sans text-xs sm:text-sm">
                <p>
                  1. <strong>Provozovatel:</strong><br />
                  Projekt / Portál <strong>Táta má právo (Synthesis OS)</strong><br />
                  Správce systému a zakladatel projektu<br />
                  (dále jen „Provozovatel“)
                </p>
                <p>a</p>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  2. <strong>Dobrovolník:</strong><br />
                  Jméno a příjmení: <strong className="text-teal-700">{effectiveFullName}</strong><br />
                  E-mail: <strong className="text-teal-700">{effectiveEmail}</strong><br />
                  Identifikátor účtu / ID: <strong className="text-teal-700">{effectiveUserId}</strong><br />
                  (dále jen „Dobrovolník“)
                </p>
              </div>
            </div>

            {/* Article II */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm font-sans uppercase text-slate-900 border-b border-slate-200 pb-1">
                II. FINANČNÍ NEZÁVISLOST A DOBROVOLNÁ POVAHA
              </h3>
              <div className="space-y-2 pl-2 text-slate-800 font-sans text-xs sm:text-sm">
                <p>
                  1. <strong>Bezúplatnost spolupráce:</strong> Smluvní strany výslovně prohlašují a berou na vědomí, že projekt <em>Táta má právo</em> je nezávislý komunitní projekt bez jakýchkoliv komerčních příjmů, sponzorských honorářů či dotací.
                </p>
                <p>
                  2. <strong>Absence finanční odměny:</strong> Veškerá činnost Dobrovolníka v rámci projektu je vykonávána <strong>zcela dobrovolně, bezplatně a bez nároku na jakoukoliv finanční či jinou hmotnou odměnu</strong>, honorář nebo úhradu nákladů.
                </p>
              </div>
            </div>

            {/* Article III */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm font-sans uppercase text-slate-900 border-b border-slate-200 pb-1">
                III. PŘEDMĚT SPOLUPRÁCE
              </h3>
              <div className="space-y-2 pl-2 text-slate-800 font-sans text-xs sm:text-sm">
                <p>
                  1. Předmětem této dohody je vymezení podmínek neplacené dobrovolnické výpomoci Dobrovolníka na rozvoji, tvorbě obsahu, správě komunity nebo technickém vývoji portálu <em>Táta má právo</em>.
                </p>
                <p>
                  2. Dobrovolník se zavazuje vykonávat sjednanou činnost svědomitě a v souladu s hlavní filozofií portálu – ochranou nejlepšího zájmu dítěte a rovnocenné péče otců.
                </p>
              </div>
            </div>

            {/* Article IV */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm font-sans uppercase text-slate-900 border-b border-slate-200 pb-1">
                IV. MLČENLIVOST A OCHRANA DAT (NDA)
              </h3>
              <div className="space-y-2 pl-2 text-slate-800 font-sans text-xs sm:text-sm">
                <p>
                  1. <strong>Důvěrné informace:</strong> Dobrovolník bere na vědomí, že při výkonu činnosti může přijít do styku s citlivými osobními údaji uživatelů (např. příběhy otců, právní spisy, interní konverzace) nebo s interním zdrojovým kódem a architekturou systému.
                </p>
                <p>
                  2. <strong>Závazek mlčenlivosti:</strong> Dobrovolník se zavazuje zachovávat přísnou mlčenlivost o všech důvěrných informacích a osobních údajích, se kterými se seznámí. Tyto informace nesmí bez písemného souhlasu Provozovatele předat třetím osobám ani využít ve svůj prospěch.
                </p>
                <p>
                  3. Závazek mlčenlivosti trvá i po ukončení dobrovolnické spolupráce.
                </p>
              </div>
            </div>

            {/* Article V */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm font-sans uppercase text-slate-900 border-b border-slate-200 pb-1">
                V. AUTORSKÁ PRÁVA A VÝSTUPY
              </h3>
              <div className="space-y-2 pl-2 text-slate-800 font-sans text-xs sm:text-sm">
                <p>
                  1. Všechny materiály, texty, kódy, grafické prvky nebo podklady vytvořené Dobrovolníkem v rámci této spolupráce se stávají součástí obsahu portálu a Provozovatel získává výhradní, neomezené právo k jejich užití a publikaci v rámci projektu.
                </p>
                <p>
                  2. Dobrovolník prohlašuje, že jím dodané podklady neporušují autorská práva třetích osob.
                </p>
              </div>
            </div>

            {/* Article VI */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm font-sans uppercase text-slate-900 border-b border-slate-200 pb-1">
                VI. UKONČENÍ SPOLUPRÁCE
              </h3>
              <div className="space-y-2 pl-2 text-slate-800 font-sans text-xs sm:text-sm">
                <p>
                  1. Tato dohoda nezakládá PRACOVNÍ POMĚR (ani DPP/DPČ) ve smyslu zákoníku práce.
                </p>
                <p>
                  2. Obě smluvní strany mohou dobrovolnickou spolupráci kdykoliv ukončit písemně nebo elektronickým oznámením bez udání důvodu s okamžitou účinností.
                </p>
              </div>
            </div>

            {/* Article VII */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm font-sans uppercase text-slate-900 border-b border-slate-200 pb-1">
                VII. ELEKTRONICKÁ AKCEPTACE
              </h3>
              <div className="space-y-2 pl-2 text-slate-800 font-sans text-xs sm:text-sm">
                <p>
                  1. Tato dohoda je uzavřena elektronicky.
                </p>
                <p>
                  2. Za platný projev vůle se považuje zaškrtnutí souhlasu a odeslání akceptačního formuláře v systému.
                </p>
              </div>
            </div>

            {/* Stamps and Audit Footer */}
            <div className="pt-6 border-t-2 border-slate-900 space-y-2 font-mono text-xs text-slate-700 bg-slate-50 p-4 rounded-xl">
              <div><strong>Datum akceptace:</strong> {displayDate}</div>
              <div><strong>IP Adresa a Hash ověření:</strong> {verificationHash}</div>
              <div><strong>Status akceptace:</strong> {isSubmitted ? 'AKCEPTOVÁNO A ODESLÁNO DO SYSTÉMU' : 'NÁHLED PŘED ODESLÁNÍM'}</div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
