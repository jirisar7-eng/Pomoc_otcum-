/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  UserCheck, 
  KeyRound, 
  Server, 
  FileText, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  HelpCircle,
  ExternalLink,
  Shield,
  Eye,
  Trash2,
  Download,
  AlertCircle
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

interface PrivacyPolicyProps {
  setActiveTab?: (tab: string) => void;
}

export default function PrivacyPolicy({ setActiveTab }: PrivacyPolicyProps) {
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="privacy-policy-container">
      {/* Breadcrumbs Navigation */}
      {setActiveTab && (
        <Breadcrumbs
          activeTab="privacy"
          setActiveTab={setActiveTab}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-teal-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/30 text-teal-300 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>GDPR Compliance • Nařízení EU 2016/679</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight leading-tight">
              Zásady ochrany osobních údajů (Privacy Policy)
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Informace o zpracování, zabezpečení a ochraně osobních údajů v rámci projektu <strong>Táta má právo (Synthesis OS)</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                Datum účinnosti: 2. srpna 2026
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Biometric Passkey Storage
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col items-center gap-2 shrink-0 print:hidden">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Vytisknout zásady ochrany údajů nebo uložit do PDF"
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

        {/* Security Commitment Highlight Box */}
        <div className="p-5 bg-teal-50/80 border border-teal-200/90 rounded-2xl flex items-start gap-4">
          <Shield className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <strong className="font-extrabold text-teal-950 block uppercase font-mono tracking-wider">
              Náš závazek k maximálnímu soukromí:
            </strong>
            <p className="text-teal-900 leading-relaxed">
              Respektujeme extrémní citlivost opatrovnických sporných situací. <strong>Vaše osobní data nikdy neprodáváme třetím stranám</strong>, nevyužíváme pro komerční marketing ani pro trénování veřejných modelů. Biometrické údaje (Passkeys) nikdy neopouštějí vaše osobní zařízení.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-4 border-b border-slate-100 pb-8" id="sec-1-controller">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Správce osobních údajů
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>
              1.1. Správcem osobních údajů podle čl. 4 bod 7 Nařízení Evropského parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů (dále jen „<strong>GDPR</strong>“) je provozovatel projektu <strong>Táta má právo (Synthesis OS)</strong>.
            </p>
            <p>
              1.2. Kontaktní údaje správce pro záležitosti ochrany osobních údajů, uplatnění práv subjektů údajů a komunikaci s poverencem:
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs font-mono text-slate-800">
              <div><strong>Projekt:</strong> Táta má právo (Synthesis OS)</div>
              <div><strong>Kontaktní e-mail:</strong> <a href="mailto:gdpr@tatamapravo.cz" className="text-teal-600 font-bold hover:underline">gdpr@tatamapravo.cz</a></div>
              <div><strong>Webový formulář:</strong> Sekce Kontakt na autora / Podpora</div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4 border-b border-slate-100 pb-8" id="sec-2-data-scope">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Rozsah zpracovávaných osobních údajů
            </h2>
          </div>

          <div className="space-y-4 pl-0 sm:pl-12 text-slate-650">
            <p>Zpracováváme pouze údaje nezbytné pro zajištění provozu, zabezpečení a funkčnosti Portálu:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  <span>Identifikační údaje</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Jméno, příjmení a e-mailová adresa získané autorizovaným přihlášením přes <strong>Google OAuth 2.0</strong> nebo registrační formulář.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <span>Technické &amp; Passkeys</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Veřejné klíče FIDO2 (Passkeys), IP adresa, logy přihlášení a typ prohlížeče. <strong>Biometrie ani soukromé klíče se NIKDY neukládají na serveru.</strong>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>Uživatelský obsah</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Uložené poznámky v "Moje Pracovna", nahrané anonymizované dokumenty, záznamy kalendáře CoParent a příspěvky ve fóru.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4 border-b border-slate-100 pb-8" id="sec-3-purpose">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Účel a právní základ zpracování
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>Osobní údaje zpracováváme výhradně na základě následujících právních titulů podle čl. 6 odst. 1 GDPR:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR):</strong> Zřízení a vedení uživatelského účtu, synchronizace osobní Pracovny a zpřístupnění AI asistenta.
              </li>
              <li>
                <strong>Oprávněný zájem správce (čl. 6 odst. 1 písm. f) GDPR):</strong> Zajištění kybernetické bezpečnosti, ochrana před DDoS útoky, prevence zneužití systémových Edge limitů a vedení auditních logů.
              </li>
              <li>
                <strong>Souhlas subjektu údajů (čl. 6 odst. 1 písm. a) GDPR):</strong> Dobrovolné vložení specifických osobních údajů či příspěvků do veřejného komunitního fóra či AI dotazů. Souhlas lze kdykoliv odvolat.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4 border-b border-slate-100 pb-8" id="sec-4-retention">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              4
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Doba uchovávání údajů
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>
              4.1. Osobní údaje uchováváme po dobu aktivního trvání uživatelského účtu.
            </p>
            <p>
              4.2. V případě, že uživatel požádá o zrušení účtu nebo jej neaktivuje po dobu déle než 24 měsíců, dojde k <strong>trvalému výmazu nebo nenávratné anonymizaci dat</strong> nejpozději do 30 dnů od doručení žádosti.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4 border-b border-slate-100 pb-8" id="sec-5-subprocessors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              5
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Zpracovatelé a třetí strany (Subprocesory)
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>Pro zajištění infrastruktury a bezchybného chodu využíváme prověřené subprocesory splňující evropské standardy ochrany dat:</p>
            
            <div className="space-y-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs">
                <Server className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">Vercel Inc. / Cloud Infrastructure</strong>
                  <span className="text-slate-650">Poskytovatel cloudového hostingu, CDN sítě a Edge výpočetního prostředí.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs">
                <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">Google Ireland Ltd. / Google LLC</strong>
                  <span className="text-slate-650">Poskytovatel autentizace (Google OAuth 2.0) a bezpečného serverového rozhraní Gemini AI API pro anonymizované zpracování AI dotazů.</span>
                </div>
              </div>
            </div>

            <p className="pt-2 font-medium text-slate-800">
              Garantujeme, že vaše osobní údaje nejsou prodávány, pronajímány ani poskytovány žádným třetím stranám pro komerční marketingové účely.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4 border-b border-slate-100 pb-8" id="sec-6-rights">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              6
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Práva uživatelů podle GDPR
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>Jako subjekt údajů máte podle kapitoly III Nařízení GDPR následující garantovaná práva:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-bold">1. Právo na přístup k údajům (čl. 15 GDPR)</strong>
                <span>Právo získat potvrzení, zda a jaké vaše údaje zpracováváme.</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-bold">2. Právo na opravu a výmaz (čl. 16 a 17)</strong>
                <span>Právo na opravení nepřesností a právo na trvalý výmaz ("právo být zapomenut").</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-bold">3. Právo na přenositelnost dat (čl. 20)</strong>
                <span>Právo obdržet své údaje ve strukturovaném běžně používaném formátu.</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block font-bold">4. Právo podat stížnost u dozorového úřadu</strong>
                <span>Právo obrátit se na <strong>Úřad pro ochranu osobních údajů (ÚOOÚ ČR)</strong>, Pplk. Sochora 27, 170 00 Praha 7 (www.uoou.cz).</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-4" id="sec-7-security">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 font-extrabold font-mono text-sm flex items-center justify-center shrink-0">
              7
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Technické a organizační zabezpečení dat
            </h2>
          </div>

          <div className="space-y-3 pl-0 sm:pl-12 text-slate-650">
            <p>
              Aplikujeme moderní bezpečnostní standardy: end-to-end šifrování při přenosu (HTTPS / TLS 1.3), kryptografické šifrování databázových záloh, dvoufázové a biometrické ověřování bez ukládání hesel na serveru a pravidelné audity bezpečnostních politik.
            </p>
          </div>
        </section>

        {/* Contact Footer Banner inside document */}
        <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-white font-bold text-base">Chcete uplatnit svá práva nebo smazat účet?</h3>
            <p className="text-xs text-slate-400">
              Pošlete požadavek na náš GDPR e-mail nebo napište zprávu z administrace.
            </p>
          </div>

          <a
            href="mailto:gdpr@tatamapravo.cz"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Napsat na gdpr@tatamapravo.cz</span>
          </a>
        </div>

      </div>
    </div>
  );
}
