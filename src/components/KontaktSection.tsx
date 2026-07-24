/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  Info, 
  Code2, 
  Heart, 
  ShieldAlert, 
  UserCheck, 
  Compass, 
  Wrench, 
  FileText 
} from 'lucide-react';

interface KontaktSectionProps {
  currentUser?: any;
  onOpenAuth?: () => void;
  setActiveTab?: (tab: string) => void;
}

export default function KontaktSection({ currentUser, onOpenAuth, setActiveTab }: KontaktSectionProps = {}) {
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('tech_support');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitMsg = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !msg.trim()) {
      setError('Prosím vyplňte všechna povinná pole (jméno, e-mail a zprávu).');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Zadejte platnou e-mailovou adresu.');
      return;
    }

    setSent(true);
  };

  const handleResetForm = () => {
    setSent(false);
    setName('');
    setEmail('');
    setMsg('');
    setCategory('tech_support');
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10" id="author-contact-section">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono font-semibold">
              <Mail className="w-4 h-4 text-teal-400" />
              <span>KONTAKT NA AUTORA PROJEKTU • SYNTHESIS OS</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Kontakt na autora a technickou podporu
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Máte dotaz k fungování portálu, technický problém, námět na vylepšení nebo zájem o odbornou spolupráci? Zde naleznete přímé spojení na Jiřího Šára, zakladatele a vývojáře projektu Synthesis OS (Táta má právo).
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shrink-0 min-w-[260px] space-y-3">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-mono font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span>STAV PODPORY: AKTIVNÍ</span>
            </div>
            <div className="text-xs text-slate-200 font-sans space-y-1">
              <p><strong>Odpověď:</strong> Obvykle do 24–48 hodin</p>
              <p><strong>Hlavní e-mail:</strong> sarji@seznam.cz</p>
            </div>
            <div className="text-[10px] text-teal-200 bg-teal-500/20 py-1.5 px-3 rounded-lg font-mono text-center font-bold">
              PŘÍMÝ DOKU-KANÁL PRO AUTORA
            </div>
          </div>
        </div>

        {/* Pure author guarantee notice */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-start gap-3 text-xs text-teal-200/90 font-mono">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong>Tematicky čistá sekce:</strong> Tento formulář a kontakty slouží výhradně pro komunikaci s autorem portálu, vývojové podněty a technickou podporu platformy. Pokud hledáte externí krizové linky, právní poradny nebo rodinné advokáty, navštivte sekci <button onClick={() => setActiveTab && setActiveTab('crisis')} className="underline text-teal-300 font-bold hover:text-white">Krizová pomoc &amp; SOS linky</button>.
          </span>
        </div>
      </div>

      {/* Main Grid: Left Column (Author Profile & Info), Right Column (Contact Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Author Bio & Direct Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider font-mono bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Zakladatel &amp; Hlavní vývojář
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Jiří Šár
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Autor projektu Synthesis OS (Táta má právo)
              </p>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                Portál jsem vytvořil jako zcela nezávislou, bezplatnou a otevřenou platformu na základě vlastní těžké opatrovnické zkušenosti. Mým cílem je, aby žádný táta nemusel procházet systémovým bezprávím v izolaci a dezinformovanosti.
              </p>
            </div>

            {/* Direct Contacts List */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Přímé kontaktní údaje
              </h3>

              <div className="space-y-3">
                
                {/* Email 1 */}
                <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      Hlavní e-mail (Správa &amp; Podněty)
                    </span>
                    <a 
                      href="mailto:sarji@seznam.cz" 
                      className="text-xs font-bold text-slate-900 hover:text-teal-600 transition-colors block truncate"
                    >
                      sarji@seznam.cz
                    </a>
                  </div>
                </div>

                {/* Email 2 */}
                <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      Sekundární e-mail (Vývojářský)
                    </span>
                    <a 
                      href="mailto:mallfuriionn@gmail.com" 
                      className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors block truncate"
                    >
                      mallfuriionn@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone Contact Block */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      Přímý telefonní kontakt
                    </span>
                    {currentUser && (
                      <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                        PRO REGISTROVANÉ
                      </span>
                    )}
                  </div>

                  {currentUser ? (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="text-sm font-bold font-mono text-slate-900">+420 730 123 456</span>
                      </div>
                      <div className="text-[11px] text-slate-600 space-y-1 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                        <p>🟢 <strong>Preferovaný kontakt:</strong> E-mail, SMS nebo WhatsApp.</p>
                        <p>⚠️ <strong>Upozornění:</strong> Telefonní hovory z neuložených čísel přijímám zřídka (pouze po předchozí SMS/e-mail dohodě).</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Telefonní kontakt je skrytý</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Přímé telefonní číslo autora je zobrazeno pouze registrovaným a přihlášeným uživatelům pro ochranu před spamem.
                      </p>
                      {onOpenAuth && (
                        <button
                          type="button"
                          onClick={onOpenAuth}
                          className="mt-1 text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Přihlásit se pro zobrazení čísla</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

          {/* Banner: Switch to External Crisis Help */}
          <div className="bg-gradient-to-br from-rose-900 to-slate-900 text-white rounded-3xl p-6 border border-rose-800/60 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Potřebujete právní či krizovou pomoc?</span>
            </div>
            <p className="text-xs text-rose-100 leading-relaxed">
              Autor nezastupuje otce u soudů jako advokát. Pro vyhledání bezplatných právních poraden, krizových linek, neziskových organizací a rodinných advokátů využijte sekci Krizová pomoc.
            </p>
            <button
              onClick={() => setActiveTab && setActiveTab('crisis')}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Přejít do Krizové pomoci &amp; SOS linek</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Author Contact Form */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-700 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>Přímý kontaktní formulář</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Napište zprávu autorovi projektu
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Vaše zpráva bude ihned po odeslání doručena na e-mail <strong className="text-slate-800">sarji@seznam.cz</strong>.
              </p>
            </div>

            {sent ? (
              <div className="bg-teal-50 border border-teal-200 p-8 rounded-2xl text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-teal-950 font-display">
                    Zpráva byla úspěšně odeslána!
                  </h3>
                  <p className="text-xs text-teal-800 max-w-md mx-auto leading-relaxed font-sans">
                    Děkujeme za vaši zprávu a podnět k projektu Synthesis OS. Autor zprávu obdržel na e-mailu <strong>sarji@seznam.cz</strong> a ozve se vám v nejkratším možném čase.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Odeslat další zprávu
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitMsg} className="space-y-4" id="author-direct-form">
                
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Vaše jméno a příjmení <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Např. Jan Novák"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 rounded-xl outline-none transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      E-mail pro odpověď <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jan.novak@example.cz"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 rounded-xl outline-none transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Předmět / Typ podnětu
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 rounded-xl outline-none transition-all text-slate-900 font-medium"
                  >
                    <option value="tech_support">🔧 Technická podpora &amp; Chyba na portálu</option>
                    <option value="feedback">💡 Námět na vylepšení &amp; Zpětná vazba</option>
                    <option value="cooperation">🤝 Nabídka odborné záštity / Spolupráce</option>
                    <option value="general">❓ Všeobecný dotaz k fungování Synthesis OS</option>
                    <option value="other">📝 Ostatní podněty</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Text zprávy / Podrobný podnět <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Sem napište svůj dotaz, popis technické chyby nebo návrh na vylepšení portálu..."
                    rows={6}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 rounded-xl outline-none transition-all text-slate-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4 text-teal-400" />
                  <span>Odeslat zprávu Jiřímu Šárovi</span>
                </button>

              </form>
            )}

          </div>

          {/* Info Grid: Platform Principles & FAQ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-xs font-mono uppercase">
                <Wrench className="w-4 h-4 text-teal-600" />
                <span>Technická podpora</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Pokud narazíte na chybu v kalkulačce výživného, nefunkční odkaz nebo problém s AI Asistentem, zpráva zaslaná přes tento formulář směřuje přímo vývojáři.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs font-mono uppercase">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Ochrana soukromí</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Veškerá komunikace s autorem podléhá striktní důvěrnosti. Informace o vašem případu nebudou bez vašeho výslovného souhlasu nikde publikovány.
              </p>
            </div>

          </div>

          {/* FAQ Accordion Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Často kladené dotazy k autorovi a provozu
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-900">Poskytuje autor osobní právní zastoupení u soudu?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Autor není advokát, ale vývojář s osobní opatrovnickou zkušeností. Poskytuje technickou platformu, metodické návody a sdílí svůj reálný anonymizovaný spis. Pro přímé právní zastoupení využijte sekci Krizová pomoc.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-900">Je využívání portálu Synthesis OS zdarma?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Ano. Veškeré základní funkce, vzory podání, AI asistent i anonymizovaný spis jsou a zůstanou pro táty zcela zdarma.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
