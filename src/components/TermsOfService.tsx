/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  ShieldAlert, 
  UserCheck, 
  Sparkles, 
  MessageSquare, 
  Copyright, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  Scale, 
  Download,
  Info,
  Calendar,
  Lock,
  Gavel,
  ShieldCheck
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

interface TermsOfServiceProps {
  setActiveTab?: (tab: string) => void;
}

export default function TermsOfService({ setActiveTab }: TermsOfServiceProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    if (setActiveTab) {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="terms-of-service-container">
      {/* Breadcrumbs Navigation */}
      {setActiveTab && (
        <Breadcrumbs
          activeTab="terms"
          setActiveTab={setActiveTab}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/30 text-teal-300 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Právní dokumentace • Release Alpha 0.5.1</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight leading-tight">
              Podmínky užívání portálu (Terms of Service)
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Všeobecná pravidla, právní vymezení odpovědnosti a zásady používání edukační platformy <strong>Táta má právo (Synthesis OS)</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                Datum účinnosti: 2. srpna 2026
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verze dokumentu: 0.5.1-ALPHA
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col items-center gap-2 shrink-0 print:hidden">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Vytisknout podmínky užívání nebo uložit do PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Tisk / PDF</span>
            </button>

            {setActiveTab && (
              <button
                onClick={handleGoBack}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zpět na úvod</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-10 text-slate-700 text-sm leading-relaxed">

        {/* Executive Summary Alert Box */}
        <div className="p-5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <strong className="font-extrabold text-amber-950 block uppercase font-mono tracking-wider">
              Klíčové shrnutí vymezení odpovědnosti:
            </strong>
            <p className="text-amber-900 leading-relaxed">
              Portál <strong>Táta má právo (Synthesis OS)</strong> je nezávislá komunitní a vzdělávací platforma. <strong>Není advokátní kanceláří</strong> a neposkytuje komerční právní služby ani zastupování u soudu. Všechny generované vzory, texty i výstupy AI mají edukační charakter a nenahrazují individuální právní poradu licencovaného advokáta.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-4 border-b border-slate-100 pb-8" id="sec-1-intro">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Úvodní ustanovení a povaha projektu
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>
              1.1. Tyto Podmínky užívání (dále jen „<strong>Podmínky</strong>“) upravují práva a povinnosti osob využívajících portál a webovou aplikaci <strong>Táta má právo (Synthesis OS)</strong> přístupnou na internetové adrese <code>https://tatamapravo.cz</code> nebo příslušných vývojových a provozních doménách (dále jen „<strong>Portál</strong>“).
            </p>
            <p>
              1.2. Portál je nezávislým vzdělávacím, komunitním a informačním systémem, jehož cílem je podpora informovanosti rodičů (zejména otců) v otázkách rodinného práva, péče o děti, prevence rodičovských konfliktů a stabilizace životních situací po rozchodu.
            </p>
            <p className="p-4 bg-slate-50 border-l-4 border-teal-600 rounded-r-xl font-medium text-slate-800">
              <strong>1.3. Výslovné prohlášení:</strong> Portál <strong>NENÍ advokátní kanceláří</strong> a neposkytuje komerční právní služby, právní poradenství za úplatu ani právní zastoupení ve smyslu zákona č. 85/1996 Sb., o advokacii, ve znění pozdějších předpisů. Veškeré texty, právní návody, vzory podání, judikátní rozbory a automatizované výstupy umělé inteligence (AI) mají výhradně informativní, orientační a edukační charakter.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4 border-b border-slate-100 pb-8" id="sec-2-accounts">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Uživatelské účty a bezpečnost
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>
              2.1. Přístup k rozšířeným a chráněným modulům Portálu (např. Moje Pracovna, Spolurodičovský Hub CoParent, AI Právní Asistent, ukládání časové osy spisu) vyžaduje bezplatnou registrace uživatelského účtu.
            </p>
            <p>
              2.2. Registrace a autentizace probíhá primárně prostřednictvím standardizovaného protokolu <strong>Google OAuth 2.0</strong> nebo kryptografického biometrického standardu <strong>Passkeys (WebAuthn / FIDO2)</strong> využívajícího otisk prstu či rozpoznání tváře (FaceID / TouchID).
            </p>
            <p>
              2.3. Uživatel je povinen zachovávat mlčenlivost o svých přístupových údajích a zabezpečit svá zařízení. Provozovatel nenese odpovědnost za neoprávněný přístup k účtu způsobený nedbalostí uživatele.
            </p>
            <p>
              2.4. Provozovatel si vyhrazuje právo dočasně blokovat nebo trvale zrušit uživatelský účet, pokud uživatel závažným způsobem porušuje tyto Podmínky, šíří spamy, pokouší se o neoprávněný průnik do systému či napadá ostatní členy komunity.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4 border-b border-slate-100 pb-8" id="sec-3-ai-liability">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Odpovědnost za obsah a AI nástroje
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>
              3.1. Součástí Portálu jsou generativní moduly umělé inteligence (využívající rozhraní Google Gemini API), kalkulátory výživného, simulátory střídavé péče a automatizované generátory návrhů k soudu. Tyto nástroje pracují autonomně na základě uživatelem vložených parametrů.
            </p>
            <p className="p-4 bg-teal-50/60 border border-teal-200/80 rounded-xl text-slate-800">
              <strong>3.2. Vyloučení odpovědnosti za AI a vzory podání:</strong> Výstupy z AI Právního Asistenta a texty generovaných dokumentů představují technologický koncept. Provozovatel neodpovídá za případnou nesprávnost, neúplnost, procesní odmítnutí soudem či za škody vzniklé použitím generovaných vzorů nebo nesprávnou interpretací zákonů.
            </p>
            <p>
              3.3. Provozovatel doporučuje uživatelům, aby v kritických, procesně složitých či sporných opatrovnických řízeních vždy konzultovali generovaná podání a taktické kroky s licencovaným advokátem specializovaným na rodinné právo.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4 border-b border-slate-100 pb-8" id="sec-4-community">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              4
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Pravidla komunity a diskuzního fóra
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>
              4.1. Komunitní fórum a diskuze slouží ke vzájemné podpoře rodičů, sdílení zkušeností a konstruktivní výměně poznatků.
            </p>
            <p>
              4.2. V komunitních sekcích je <strong>přísně zakázáno</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700">
              <li>Šířit nenávistné projev, rasistické, sexistické či vulgární útoky.</li>
              <li>Zveřejňovat osobní údaje třetích osob (např. plná jména a adresy druhého rodiče, nezletilých dětí, pracovníků OSPOD, znalců či soudců v dehonestujícím či vyhrožujícím kontextu).</li>
              <li>Šířit nelegální obsah, výzvy k porušování soudních rozhodnutí či návody na maření úředního výkonu.</li>
              <li>Vkládat komerční reklamu, spamy či neautorizované finanční sbírky.</li>
            </ul>
            <p>
              4.3. Provozovatel si vyhrazuje právo jakýkoliv příspěvek porušující pravidla komunity bez předchozího upozornění a bez náhrady upravit nebo smazat.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4" id="sec-5-copyright">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              5
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Autorská práva a intelektuální vlastnictví
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>
              5.1. Veškeré texty, metodické návody, grafické prvky, databázové struktury a programové kódy Portálu jsou chráněny autorským právem podle zákona č. 121/2000 Sb. (autorský zákon).
            </p>
            <p>
              5.2. Vzory podání, formuláře a edukační průvodce jsou poskytovány bezplatně k osobní nekomerční potřebě pečujících rodičů.
            </p>
            <p className="font-semibold text-slate-800">
              5.3. Je přísně zakázáno obsah Portálu, stažené vzory či metodické materiály komerčně přeprodávat, hromadně šířit v placených kurzech nebo vydávat za vlastní dílo bez předchozího písemného souhlasu provozovatele.
            </p>
          </div>
        </section>

        {/* Contact Footer Banner inside document */}
        <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-white font-bold text-base">Máte dotazy k podmínkám užívání?</h3>
            <p className="text-xs text-slate-400">
              Kontaktujte administraci portálu nebo využijte komunitní podporu.
            </p>
          </div>

          {setActiveTab && (
            <button
              onClick={() => {
                setActiveTab('contacts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer"
            >
              Napsat autorovi portálu
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
