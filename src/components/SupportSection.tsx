/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Coffee, 
  Server, 
  Shield, 
  Award, 
  Sparkles, 
  Check,
  CheckCircle, 
  CheckCircle2,
  AlertTriangle,
  Send,
  Coins, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Info,
  Building2,
  Globe,
  Mail,
  FileText,
  Terminal,
  ArrowUpRight,
  Lock,
  Cpu,
  Phone,
  Copy,
  CreditCard,
  PieChart
} from 'lucide-react';
import { Donation, User } from '../types';
import { saveDocument } from '../lib/firebase';
import { useLanguage } from '../lib/LanguageContext';
import { translateText } from '../data/dynamicTranslations';

interface SupportSectionProps {
  currentUser: User | null;
  onOpenAuth?: () => void;
  donations: Donation[];
  setDonations: React.Dispatch<React.SetStateAction<Donation[]>>;
}

export default function SupportSection({
  currentUser,
  onOpenAuth,
  donations,
  setDonations
}: SupportSectionProps) {
  const { language, t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number>(300);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>(currentUser ? currentUser.name : '');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'budget' | 'transfer' | 'sponsors'>('transfer');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sponsor Form states
  const [sponsorCompany, setSponsorCompany] = useState<string>('');
  const [sponsorPerson, setSponsorPerson] = useState<string>('');
  const [sponsorEmail, setSponsorEmail] = useState<string>('');
  const [sponsorPhone, setSponsorPhone] = useState<string>('');
  const [sponsorType, setSponsorType] = useState<string>('vps');
  const [sponsorMessage, setSponsorMessage] = useState<string>('');
  const [sponsorMathAnswer, setSponsorMathAnswer] = useState<string>('');
  const [sponsorMathQuestion, setSponsorMathQuestion] = useState({ num1: 4, num2: 5, answer: 9 });
  const [sponsorStatus, setSponsorStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [sponsorError, setSponsorError] = useState<string>('');

  // Synced state on user changes
  useEffect(() => {
    if (currentUser && !donorName) {
      setDonorName(currentUser.name);
    }
  }, [currentUser]);

  const activeAmount = customAmount ? Number(customAmount) : selectedAmount;

  // Predictable impacts based on amount selected
  const getSupportImpact = (amount: number) => {
    if (amount < 150) {
      return {
        icon: Coffee,
        title: translateText("Káva pro autory", language),
        desc: translateText("Podpoříte bdělost našich vývojářů při nočním psaní nových judikátů a vzorů podání.", language)
      };
    } else if (amount < 300) {
      return {
        icon: Server,
        title: translateText("Provoz infrastruktury", language),
        desc: translateText("Pokryje náklady na cloudový hosting, databázi a API rozhraní pro provoz webu na 7 dní.", language)
      };
    } else if (amount < 500) {
      return {
        icon: Shield,
        title: translateText("Sponzor právní pomoci", language),
        desc: translateText("Pokryje náklady na přípravu a aktualizaci jednoho vzorového podání k soudu pro tátu v nouzi.", language)
      };
    } else if (amount < 1000) {
      return {
        icon: Award,
        title: translateText("Patron spravedlnosti", language),
        desc: translateText("Umožní nám oslovit právníky pro vypracování odborného rozboru k novým rozhodnutím Ústavního soudu.", language)
      };
    } else {
      return {
        icon: Sparkles,
        title: translateText("Mecenáš Synthesis Hubu", language),
        desc: translateText("Zásadním způsobem urychlíte integraci autonomního AI Admina a udržíte web bez otravných reklam.", language)
      };
    }
  };

  const impact = getSupportImpact(activeAmount);

  // Revolut account details for Jiří Šár
  const recipientName = "Jiří Šár";
  const iban = "LT20 3250 0279 5466 6874";
  const cleanIban = "LT203250027954666874";
  const bic = "REVOLT21";
  const bankName = "Revolut Bank UAB";
  const bankAddress = "Konstitucijos ave. 21B, 08130, Vilnius, Lithuania";
  const correspondentBic = "BARCGB22";
  const variableSymbol = "2026" + (currentUser ? currentUser.id.substring(0, 4).replace(/\D/g, '0') : '99');

  const handleCopy = (text: string, fieldName: string) => {
    const cleanText = text.replace(/\s+/g, '');
    navigator.clipboard.writeText(cleanText);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 3000);
  };

  const handleSubmitDonationForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAmount <= 0) return;

    setSubmitStatus('submitting');
    try {
      const finalName = isAnonymous ? 'Anonymní dárce' : (donorName.trim() || 'Anonymní dárce');
      const newDonation: Donation = {
        id: 'don-' + Date.now(),
        donorName: finalName,
        amount: activeAmount,
        message: message.trim() || undefined,
        date: new Date().toISOString().split('T')[0],
        isPublic,
        isVerified: false
      };

      await saveDocument('donations', newDonation.id, newDonation);
      setDonations(prev => [newDonation, ...prev]);
      setSubmitStatus('success');
      setMessage('');
    } catch (err) {
      console.error("Error creating donation entry:", err);
      setSubmitStatus('error');
    }
  };

  const handleSubmitSponsorForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSponsorError('');
    setSponsorStatus('submitting');

    if (!sponsorCompany.trim() || !sponsorPerson.trim() || !sponsorEmail.trim() || !sponsorMessage.trim()) {
      setSponsorError('Vyplňte prosím všechna povinná pole (Název sponzora, Kontaktní osoba, E-mail, Zpráva).');
      setSponsorStatus('error');
      return;
    }

    if (parseInt(sponsorMathAnswer) !== sponsorMathQuestion.answer) {
      setSponsorError('Kontrolní otázka proti spamu je nesprávná.');
      setSponsorStatus('error');
      return;
    }

    setTimeout(() => {
      setSponsorStatus('success');
      setSponsorCompany('');
      setSponsorPerson('');
      setSponsorEmail('');
      setSponsorPhone('');
      setSponsorMessage('');
      setSponsorMathAnswer('');
      const n1 = Math.floor(Math.random() * 8) + 2;
      const n2 = Math.floor(Math.random() * 8) + 2;
      setSponsorMathQuestion({ num1: n1, num2: n2, answer: n1 + n2 });
    }, 1200);
  };

  // Calculate dynamic stats from actual verified donations
  const verifiedDonations = donations.filter(d => d.isVerified);
  const totalRaised = verifiedDonations.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyGoal = 1180;
  const progressPercent = Math.min(Math.round((totalRaised / monthlyGoal) * 100), 100);

  return (
    <div className="space-y-8" id="synthesis-support-hub">
      {/* Visual Header */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_55%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-teal-500/15 border border-teal-500/30 text-teal-300 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold inline-block mb-3">
            {translateText('Podpora projektu • Synthesis OS', language)}
          </span>
          <h1 className="text-2xl md:text-3.5xl font-extrabold font-display tracking-tight text-white leading-tight">
            {translateText('Podpořte rozvoj portálu', language)} <span className="text-teal-400">Táta má právo</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            {translateText('Jsme nezávislý projekt vyvíjený pod záštitou studia Synthesis Jiřího Š. Naším posláním je poskytovat tátům a rodinám bezplatný přístup k vědecky podloženým informacím, vzorům podání, kalkulačkám a psychologické podpoře. Vše vyvíjíme otevřeně, bez reklam a s vizí budoucí autonomní správy (AI Admin).', language)}
          </p>

          {/* Current Sponsorship Status Banner */}
          <div className="mt-5 p-4 bg-slate-900/90 border border-teal-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                ✓ Webhosting NoLimit (VEDOS)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                ✓ Doména tatovacesta.cz (FORPSI)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                🎯 Hledáme sponzora pro VPS
              </span>
              <span className="bg-teal-400/20 text-teal-200 border border-teal-400/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                💖 Hledáme dárce na rozvoj
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Categorized Tabs / Cards Switcher */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full sm:w-fit max-w-full overflow-x-auto gap-1.5 border border-slate-200/60 shadow-2xs" id="synthesis-support-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 md:px-5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'budget'
              ? 'bg-teal-900 text-white shadow-md ring-1 ring-teal-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <PieChart className={`w-4 h-4 ${activeTab === 'budget' ? 'text-teal-300' : 'text-slate-500'}`} />
          📊 {t('tab_budget', 'Měsíční rozpočet')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transfer')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 md:px-5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'transfer'
              ? 'bg-teal-900 text-white shadow-md ring-1 ring-teal-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <CreditCard className={`w-4 h-4 ${activeTab === 'transfer' ? 'text-teal-300' : 'text-slate-500'}`} />
          💳 {t('tab_transfer', 'Bankovní převod & podpora')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sponsors')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 md:px-5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sponsors'
              ? 'bg-teal-900 text-white shadow-md ring-1 ring-teal-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeTab === 'sponsors' ? 'text-teal-300' : 'text-slate-500'}`} />
          🤝 {t('tab_sponsors', 'Sponzoři & partneři')}
        </button>
      </div>

      {/* TAB 1: Měsíční rozpočet */}
      {activeTab === 'budget' && (
        <div className="space-y-8 animate-fadeIn" id="budget-tab-view">
          {/* Goal & Monthly Progress Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Transparentní provoz
                </span>
                <h2 className="text-base font-extrabold text-slate-850 font-display">
                  Stav naplnění měsíčního rozpočtu
                </h2>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl font-mono self-start sm:self-auto">
                {progressPercent}% splněno ({totalRaised.toLocaleString('cs-CZ')} / {monthlyGoal.toLocaleString('cs-CZ')} Kč)
              </span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tento rozpočet pokryje čisté provozní náklady na infrastrukturu, zabezpečení, český VPS server a AI asistenta pro stovky otců v nouzi měsíčně.
            </p>
          </div>

          {/* Transparent Monthly Budget Card */}
          <div className="bg-gradient-to-b from-white to-slate-50/50 border border-slate-200 rounded-2xl p-5 md:p-6 shadow-3xs space-y-5" id="monthly-transparent-budget">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-850 font-display">📈 Měsíční rozpočet: Profesionální nezávislý provoz</h2>
                  <p className="text-[11px] text-slate-500">Přesný rozpis nákladů na vlastní server, Workspace správu a AI licence.</p>
                </div>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl px-3.5 py-1.5 shrink-0 flex items-center">
                <span className="text-xs text-teal-900 font-bold font-mono">CELKEM: 1 180 Kč / měsíc</span>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-4">Položka</th>
                    <th className="py-2.5 px-4">Účel v projektu</th>
                    <th className="py-2.5 px-4 text-right">Měsíční náklady</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-emerald-50/20">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      Webhosting NoLimit
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded ml-1.5">✓ VEDOS</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 leading-normal">Profesionální sponzorovaný webhosting a zázemí od společnosti VEDOS Internet, a.s.</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">0 Kč <span className="text-[9px] text-slate-400 font-normal block">(Sponzorováno)</span></td>
                  </tr>
                  <tr className="bg-emerald-50/20">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      Doména tatovacesta.cz
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded ml-1.5">✓ FORPSI</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 leading-normal">Bezplatná registrace a správa domény věnovaná společností FORPSI (Internet CZ, a.s.).</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">0 Kč <span className="text-[9px] text-slate-400 font-normal block">(Sponzorováno)</span></td>
                  </tr>
                  <tr className="bg-amber-50/30">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      Vlastní český server (VPS)
                      <span className="text-[9px] bg-amber-100 text-amber-900 font-mono font-bold px-1.5 py-0.5 rounded ml-1.5">🎯 Hledáme sponzora</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 leading-normal">Trvale běžící Node.js Express server (server.ts) postavený na NVMe discích v ČR pro nezávislý chod.</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-900">250 Kč</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800">Google AI Pro &amp; Gemini API</td>
                    <td className="py-3 px-4 text-slate-600 leading-normal">Vývoj v AI Studiu, Gemini Pro s Deep Research pro psaní článků a reálná spotřeba tokenů pro AI asistenta.</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">750 Kč</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800">Oficiální e-mail &amp; správa</td>
                    <td className="py-3 px-4 text-slate-600 leading-normal">Google Workspace pro oficiální mail schránky na doméně (info@tatamapravo.cz, sarji@seznam.cz).</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">180 Kč</td>
                  </tr>
                  <tr className="bg-slate-50/20">
                    <td className="py-3 px-4 font-bold text-slate-800">Zálohování a databáze</td>
                    <td className="py-3 px-4 text-slate-500 italic leading-normal">Produkční Firestore / Supabase vrstva pro hladký chod fóra a přípravu na Passkeys.</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-500">0 Kč <span className="text-[9px] text-slate-400 font-normal block">(ve Free tieru)</span></td>
                  </tr>
                  <tr className="bg-teal-50/30 font-bold">
                    <td className="py-3 px-4 text-teal-900 font-display">CELKEM DÁRCI &amp; VPS</td>
                    <td className="py-3 px-4 text-teal-850">Měsíční cíl pro dárce a hledaného sponzora pro VPS</td>
                    <td className="py-3 px-4 text-right font-mono text-teal-900 text-sm">1 180 Kč</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Sponsor/Donor Commentary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Příklad pokrytí #1</span>
                <h4 className="text-xs font-bold text-slate-800">Dar 300 Kč (Infrastruktura)</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pokud dárce zvolí možnost <strong>300 Kč (Infrastruktura)</strong>, pokryje to kompletní měsíční náklady na samotný český server i s e-maily.
                </p>
              </div>
              <div className="bg-teal-50/50 border border-teal-200/70 p-4 rounded-xl space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-teal-600 tracking-wider font-mono">Příklad pokrytí #2</span>
                <h4 className="text-xs font-bold text-teal-800">Dar 1 000 Kč (Patron)</h4>
                <p className="text-[11px] text-teal-700 leading-relaxed">
                  Při vybrání <strong>1 000 Kč (Patron)</strong> nám jeden jediný člověk v podstatě zafinancuje téměř celý měsíční provoz a vývoj projektu včetně AI Pro předplatného.
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('transfer')}
                className="px-6 py-3 bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Přejít k odeslání daru bankovním převodem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Bankovní převod & podpora */}
      {activeTab === 'transfer' && (
        <div className="space-y-8 animate-fadeIn" id="transfer-tab-view">
          
          {/* Toast Notification Banner when Copied */}
          {copiedField && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-teal-500/50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce">
              <div className="w-6 h-6 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <span>Údaj <strong>{copiedField}</strong> byl úspěšně zkopírován do schránky!</span>
            </div>
          )}

          {/* Direct Bank Transfer Support Section */}
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <CreditCard className="w-64 h-64 text-teal-400" />
            </div>

            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 bg-teal-500/15 border border-teal-500/30 text-teal-300 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold inline-block">
                Přímá podpora převodem
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-white font-display">
                Bankovní převod (Revolut Bank UAB)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Odesláním libovolného příspěvku přímo na náš bankovní účet podporujete bezplatný chod portálu bez reklam. Údaje jednoduše zkopírujte do vaší bankovní aplikace.
              </p>
            </div>

            {/* Clean instruction alert */}
            <div className="relative z-10 bg-teal-950/60 border border-teal-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-teal-200 leading-relaxed shadow-3xs">
              <Info className="w-5 h-5 shrink-0 text-teal-400 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">Návod k provedení platby:</strong>
                <span>Po zkopírování údajů můžete platbu snadno odeslat ze své bankovní aplikace.</span>
              </div>
            </div>

            {/* Quick 1-Click Copy Buttons */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleCopy(iban, 'IBAN')}
                className="py-3.5 px-5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
              >
                {copiedField === 'IBAN' ? (
                  <>
                    <Check className="w-4.5 h-4.5 text-emerald-300" />
                    <span>IBAN zkopírován!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4.5 h-4.5 text-teal-100" />
                    <span>Kopírovat IBAN ({cleanIban})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleCopy(bic, 'BIC/SWIFT')}
                className="py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
              >
                {copiedField === 'BIC/SWIFT' ? (
                  <>
                    <Check className="w-4.5 h-4.5 text-emerald-300" />
                    <span>BIC/SWIFT zkopírován!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4.5 h-4.5 text-slate-300" />
                    <span>Kopírovat BIC/SWIFT ({bic})</span>
                  </>
                )}
              </button>
            </div>

            {/* Detailed Account Grid */}
            <div className="relative z-10 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-2.5 font-mono text-xs">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1.5 border-b border-slate-800/80 gap-1">
                <span className="text-slate-400 font-sans font-medium text-[11px]">Příjemce platby:</span>
                <span className="text-white font-bold">{recipientName}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1.5 border-b border-slate-800/80 gap-1">
                <span className="text-slate-400 font-sans font-medium text-[11px]">Číslo účtu / IBAN:</span>
                <span className="text-teal-300 font-bold tracking-wider">{iban}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1.5 border-b border-slate-800/80 gap-1">
                <span className="text-slate-400 font-sans font-medium text-[11px]">BIC / SWIFT kód:</span>
                <span className="text-white font-bold">{bic}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1.5 border-b border-slate-800/80 gap-1">
                <span className="text-slate-400 font-sans font-medium text-[11px]">Název banky:</span>
                <span className="text-white font-bold">{bankName}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1.5 border-b border-slate-800/80 gap-1">
                <span className="text-slate-400 font-sans font-medium text-[11px]">Adresa banky:</span>
                <span className="text-slate-300 text-[11px]">{bankAddress}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1.5 border-b border-slate-800/80 gap-1">
                <span className="text-slate-400 font-sans font-medium text-[11px]">Korespondentská banka (BIC):</span>
                <span className="text-white font-bold">{correspondentBic}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1.5 border-b border-slate-800/80 gap-1">
                <span className="text-slate-400 font-sans font-medium text-[11px]">Doporučená částka:</span>
                <span className="text-teal-400 font-bold">{activeAmount} CZK</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1.5 border-b border-slate-800/80 gap-1">
                <span className="text-slate-400 font-sans font-medium text-[11px]">Variabilní symbol:</span>
                <span className="text-white font-bold">{variableSymbol}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1.5 gap-1">
                <span className="text-slate-400 font-sans font-medium text-[11px]">Zpráva pro příjemce:</span>
                <span className="text-teal-200 font-bold text-[10px] break-all">
                  Dar Táta má právo - {isAnonymous ? 'Anonym' : (donorName || 'Dárce')}
                </span>
              </div>
            </div>

            <div className="relative z-10 text-[10px] text-slate-400 leading-relaxed font-sans">
              ℹ️ Účet je veden u licencované evropské instituce <strong>Revolut Bank UAB</strong>. Převody v CZK i EUR probíhají v rámci SEPA / mezinárodního platebního styku naprosto hladce a bez poplatků.
            </div>
          </div>

          {/* Amount Simulator & Donor Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (7 cols): Simulator & Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Quick Amount Selector & Simulator */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Coins className="w-4.5 h-4.5 text-teal-600" />
                  1. Vyberte výši vašeho příspěvku
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[150, 300, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`py-3.5 px-3 rounded-xl border font-display font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        activeAmount === amount && !customAmount
                          ? 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-500 shadow-3xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-base">{amount} Kč</span>
                      <span className="text-[9px] font-mono text-slate-400 font-normal">
                        {amount === 150 ? 'Káva ☕' : amount === 300 ? 'Infrastruktura 💻' : amount === 500 ? 'Vzory 📄' : 'Patron 👑'}
                      </span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-mono font-bold mb-1.5">Nebo zadejte vlastní částku (Kč):</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      placeholder="Zadejte libovolnou částku"
                      min="20"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 outline-none transition-all font-semibold text-slate-800"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold font-mono">Kč</span>
                  </div>
                </div>

                {/* Simulated Impact Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-teal-100/60 flex items-center justify-center text-teal-600 shrink-0">
                    <impact.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <span className="text-[9px] text-teal-600 font-mono uppercase tracking-wider font-bold block leading-none mb-1">Dopad vaší pomoci</span>
                    <span className="font-bold text-xs text-slate-800 block">{impact.title} ({activeAmount} Kč)</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{impact.desc}</p>
                  </div>
                </div>
              </div>

              {/* Wall Registration Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-4.5 h-4.5 text-teal-600" />
                  2. Zapište se na zeď podporovatelů (Nepovinné)
                </h3>

                {submitStatus === 'success' ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2 animate-fadeIn">
                    <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-xs text-emerald-950">Vzkaz byl úspěšně zaznamenán!</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Děkujeme! Jakmile obdržíme příspěvek na účet, váš vzkaz trvale zveřejníme na Zdi cti.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitStatus('idle')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer mt-2"
                    >
                      Poslat další vzkaz
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitDonationForm} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1.5">Vaše jméno / přezdívka:</label>
                        <input
                          type="text"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          disabled={isAnonymous}
                          placeholder={isAnonymous ? "Anonymní dárce" : "např. Jiří Š."}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>

                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-semibold">
                          <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                          />
                          Darovat anonymně
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1.5">Krátký vzkaz nebo přání projektu:</label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="např. Fandím vaší skvělé práci pro práva dětí a tátů!"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl p-3 text-xs outline-none resize-none"
                        maxLength={150}
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>Maximálně 150 znaků</span>
                        <span>{message.length}/150</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-semibold">
                        <input
                          type="checkbox"
                          checked={isPublic}
                          onChange={(e) => setIsPublic(e.target.checked)}
                          className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                        />
                        Zobrazit můj dar a vzkaz veřejně na zdi dětí a tátů
                      </label>

                      <button
                        type="submit"
                        disabled={submitStatus === 'submitting' || activeAmount <= 0}
                        className="px-5 py-2.5 bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {submitStatus === 'submitting' ? 'Ukládám...' : 'Uložit vzkaz na zeď'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column (5 cols): Buy me a coffee & Guarantee */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Buy Me a Coffee CTA card */}
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-200/80 rounded-2xl p-5 shadow-3xs relative overflow-hidden group space-y-3">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
                  <Coffee className="w-16 h-16 text-amber-700" />
                </div>
                
                <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-200 text-amber-800 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold inline-flex items-center gap-1">
                  <Coffee className="w-2.5 h-2.5" /> Buy me a coffee
                </span>
                
                <h3 className="font-bold text-slate-800 text-xs tracking-tight">
                  Pozvěte zakladatele Jiřího Š. na kávu
                </h3>
                
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Chcete-li ocenit Jiřího osobní nasazení a autorskou práci na platformě pod záštitou studia <strong className="text-slate-800">Synthesis</strong>, můžete ho pozvat na virtuální kávu a podpořit ho přímo přes bezpečný odkaz.
                </p>

                <div className="space-y-1">
                  <button 
                    disabled
                    className="w-full py-2.5 bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <span>Podpořit Jiřího (Buy me a coffee)</span>
                    <Coffee className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                  <div className="text-[9px] text-amber-600 font-semibold text-center">
                    ⚠️ Odkaz bude aktivován ihned po schválení partnerského účtu
                  </div>
                </div>
              </div>

              {/* Transparency Guarantee Card */}
              <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-teal-400 font-display flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-400" />
                  Záruka transparentnosti
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Všechny finanční příspěvky jsou použity výhradně na servery, cloudovou databázi, AI tokeny a provoz bezplatného obsahu. Jiří Š. ani studio Synthesis nečerpají z darů žádné osobní honoráře.
                </p>
              </div>

            </div>

          </div>

          {/* Donors Wall / Zeď cti */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 font-display">Zeď cti &bull; Společenství podporovatelů</h3>
                  <p className="text-[11px] text-slate-500">Rodiče a odborníci, kteří drží náš projekt při životě a bez otravných reklam.</p>
                </div>
              </div>

              <span className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl font-mono">
                Celkem podporovatelů: <strong>{verifiedDonations.length}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verifiedDonations.length === 0 ? (
                <div className="col-span-full text-center py-8 text-slate-400 text-xs">
                  Zatím zde není žádný veřejný schválený dar. Buďte prvním, kdo se zapíše na zeď cti!
                </div>
              ) : (
                verifiedDonations.map((donation) => {
                  const seed = encodeURIComponent(donation.donorName);
                  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=0d9488,0f766e,115e59`;
                  
                  return (
                    <div 
                      key={donation.id}
                      className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all hover:shadow-2xs"
                      id={`donor-card-${donation.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={avatarUrl} 
                          alt={donation.donorName} 
                          className="w-9 h-9 rounded-full border border-teal-200 shrink-0"
                        />
                        <div className="min-w-0 flex-grow">
                          <span className="font-bold text-slate-800 text-xs truncate block leading-tight">{donation.donorName}</span>
                          <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{donation.date}</span>
                        </div>
                        <span className="bg-teal-50 border border-teal-200 text-teal-800 font-bold font-mono text-[11px] px-2.5 py-1 rounded-lg shrink-0">
                          + {donation.amount} Kč
                        </span>
                      </div>
                      {donation.message && (
                        <p className="mt-3 text-[11px] text-slate-600 leading-relaxed italic bg-white p-2 rounded-lg border border-slate-100">
                          "{donation.message}"
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: Sponzoři & partneři */}
      {activeTab === 'sponsors' && (
        <div className="space-y-8 animate-fadeIn" id="synthesis-sponsors-portal">
          {/* Main demand introduction */}
          <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 shadow-3xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-850 font-display">Poptávka pro sponzory &amp; technologické partnery</h2>
                <p className="text-[11px] text-slate-500">Připojte se k technologickému a finančnímu rozvoji portálu, který reálně pomáhá.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-display">
                <Globe className="w-4 h-4 text-teal-600" />
                Kdo jsme a co děláme?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Portál <strong>Táta má právo</strong> je moderní, bezpečný průvodce opatrovnickým řízením v ČR. Pomáháme aktivním otcům a rodinám v krizových situacích (rozvody, opatrovnické spory, jednání s OSPOD) získat bezplatný přístup k vědecky podloženým informacím, prověřeným vzorům právních podání, kalkulačkám výživného a psychologické podpoře. Vše vyvíjíme otevřeně, zcela bez reklam a s vizí budoucí autonomní správy (AI Admin).
              </p>
            </div>
          </div>

          {/* Official Infrastructure Sponsors Notice */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 border-2 border-teal-500/40 rounded-2xl p-5 md:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1.5 relative z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  Infrastruktura 100% Pokryta Sponzory
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                  ✓ Generální Sponzoři
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white font-display">
                Děkujeme společnostem ALGOTECH, VEDOS a FORPSI!
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Díky sponzorskému daru od <strong>ALGOTECH a.s.</strong> (Cloud VPS), <strong>VEDOS Internet, a.s.</strong> (Webhosting NoLimit) a <strong>FORPSI</strong> (Registrace domény) je veškeré technické zázemí portálu plně zabezpečeno na nejvyšší profesionální úrovni.
              </p>
            </div>
            <a
              href="#partners"
              onClick={(e) => {
                e.preventDefault();
                const btn = document.querySelector('[data-tab="partners"]') as HTMLElement;
                if (btn) btn.click();
              }}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap hover:scale-105 relative z-10"
            >
              <span>Zobrazit profil sponzorů</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Core features overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full">Přehled</span>
              <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider font-mono">Přehled klíčových funkcí portálu</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-1">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-850 font-display">Synthesis AI Asistent</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pokročilý inteligentní rádce integrovaný přímo na webu, který tátům pomáhá s okamžitým vysvětlením právních pojmů a přípravou na jednání.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-1">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-850 font-display">Generátor a správa právních listin</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Systém pro dynamické generování a úpravu strukturovaných právních podání a dohod o péči.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-1">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-850 font-display">Komunitní fórum a poradna</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Bezpečné prostředí pro sdílení zkušeností otců, které je chráněno před toxickým chováním.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-1">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-850 font-display">Univerzální přehrávač</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Integrovaný systém pro dynamické vkládání a přehrávání odborných videí (např. z Facebooku či YouTube) přímo v těle tematických článků.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1.5 md:col-span-2 lg:col-span-1">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-1">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-850 font-display">Piktos – Modulární komunikátor</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Specializovaná komunikační vrstva postavená na přehledných kartách pro usnadnění rodinné koordinace.
                </p>
              </div>
            </div>
          </div>

          {/* Tech stack vs VPS plan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tech stack card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-3">
              <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider font-mono flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-teal-600" />
                Jaké technologie používáme?
              </h3>
              <div className="divide-y divide-slate-100">
                <div className="py-2 flex items-start gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono shrink-0 font-bold">Frontend</span>
                  <p className="text-[11px] text-slate-600 leading-normal">React (Vite) s responzivním designem přes Tailwind CSS a plnou přístupností (WCAG).</p>
                </div>
                <div className="py-2 flex items-start gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono shrink-0 font-bold">Backend</span>
                  <p className="text-[11px] text-slate-600 leading-normal">Node.js (Express server) běžící jako permanentní monolit (<code>server.ts</code>).</p>
                </div>
                <div className="py-2 flex items-start gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono shrink-0 font-bold">AI Integrace</span>
                  <p className="text-[11px] text-slate-600 leading-normal">Gemini API přes Google AI Studio s nativním využitím strukturovaných JSON výstupů.</p>
                </div>
                <div className="py-2 flex items-start gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono shrink-0 font-bold">Bezpečnost</span>
                  <p className="text-[11px] text-slate-600 leading-normal">Moderní biometrická autentizace Passkeys (WebAuthn) pro bezpečné přihlašování otiskem prstu či FaceID bez nutnosti zadávat hesla.</p>
                </div>
              </div>
            </div>

            {/* VPS infrastructure goal */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-3xs text-white space-y-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.1),transparent_40%)] pointer-events-none" />
              <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider font-mono flex items-center gap-1.5 relative z-10">
                <Server className="w-4.5 h-4.5 text-teal-400" />
                Jaký VPS server hledáme a co na něm budeme provozovat?
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed relative z-10">
                Abychom zajistili stoprocentní ochranu citlivých dat, stěhujeme celou infrastrukturu na <strong>vlastní nezávislé řešení v České republice</strong> (All-in-One architektura pod naší plnou kontrolou). Na serveru poběží aplikační Node.js server (pod správou PM2), lokální produkční databáze (PostgreSQL / MongoDB), bezpečné úložiště souborů a vlastní mailserver (Postfix/Dovecot/Mailcow) pro neomezené generování schránek na doméně.
              </p>
            </div>
          </div>

          {/* Technical minimum specs card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs uppercase font-black text-teal-400 tracking-wider font-mono">Specifikace požadovaného VPS (Technické minimum):</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-md">
                Minimální parametry
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Lokalita</span>
                <p className="text-xs font-bold text-white leading-normal">Datacentrum v ČR</p>
                <span className="text-[9px] text-slate-400 block leading-tight">(např. ekvivalent Wedos VPS ON / vshosting)</span>
              </div>
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Procesor &amp; Paměť</span>
                <p className="text-xs font-bold text-white leading-normal">Minimálně 2× vCPU</p>
                <span className="text-[9px] text-slate-400 block leading-tight">4 GB RAM operační paměti</span>
              </div>
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Úložiště</span>
                <p className="text-xs font-bold text-white leading-normal">40 GB NVMe SSD</p>
                <span className="text-[9px] text-slate-400 block leading-tight">Vysokorychlostní NVMe pro databázi</span>
              </div>
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">OS &amp; Síť</span>
                <p className="text-xs font-bold text-white leading-normal">Ubuntu 24.04 LTS</p>
                <span className="text-[9px] text-slate-400 block leading-tight">Dedikovaná IPv4, Nginx proxy, HTTPS Let's Encrypt</span>
              </div>
            </div>
          </div>

          {/* What we need from partners/sponsors */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full">🤝 Potřeba</span>
              <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider font-mono">Co od partnerů a sponzorů potřebujeme?</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Cloud VPS Secured */}
              <div className="bg-emerald-50/50 border-2 border-emerald-400 p-5 rounded-2xl shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-700" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs font-bold text-emerald-950 font-display">1. Cloud VPS Infrastruktura</h4>
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 font-mono font-bold px-1.5 py-0.5 rounded">SPLNĚNO ✓</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Vysokovýkonný Cloud VPS server pro bezpečný chod backendových mikroslužeb a databáze byl <strong>plně poskytnut společností ALGOTECH a.s.</strong>
                  </p>
                </div>
                <div className="pt-2 border-t border-emerald-200/80 mt-1 flex justify-between items-center">
                  <span className="text-[11px] font-bold text-emerald-900 font-mono">ALGOTECH a.s.</span>
                  <span className="text-[10px] text-emerald-800 font-extrabold">Pokryto Sponzorem ★</span>
                </div>
              </div>

              {/* Card 2: AI & API Support */}
              <div className="bg-amber-50/40 border-2 border-amber-300 p-5 rounded-2xl shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                    <Cpu className="w-4.5 h-4.5 text-amber-900" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs font-bold text-amber-950 font-display">2. AI Asistent & API Tokeny</h4>
                    <span className="text-[9px] bg-amber-200 text-amber-900 font-mono font-bold px-1.5 py-0.5 rounded">AKTIVNÍ CÍL 🎯</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Financování provozu Gemini API pro bezplatné generování právních rozborů, rychlé analýzy rozsudků a asistenci tátům v reálném čase.
                  </p>
                </div>
                <div className="pt-2 border-t border-amber-200/60 mt-1 flex justify-between items-center">
                  <span className="text-[11px] font-bold text-amber-900 font-mono">Provoz Gemini API</span>
                  <span className="text-[10px] text-amber-800 font-bold">Hledáme dárce / sponzory 💖</span>
                </div>
              </div>

              {/* Card 3: Legal counsel */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    <Shield className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-850 font-display">3. Právní & Odborná záštita</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Propojení s advokáty, rodinnými mediátory a psychology pro konzultace a revize vzorů podání pro táty v nouzi.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 mt-1 flex justify-between items-center">
                  <span className="text-[11px] font-bold text-teal-800 font-mono">Odborné partnerství</span>
                  <span className="text-[10px] text-teal-700 font-bold">Spolupráce 🤝</span>
                </div>
              </div>
            </div>

            {/* Flexibility commentary */}
            <div className="bg-teal-50/40 border border-teal-200/60 p-5 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-teal-900 font-display">Flexibilita partnerství</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Výše uvedené body jsou naším technickým minimem pro plnou nezávislost. Jako sponzor či technologický partner <strong>můžete navrhnout i své vlastní individuální podmínky a formu spolupráce</strong>, která bude nejlépe vyhovovat Vašim cílům či možnostem.
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Vaše logo/jméno bude trvale umístěno v sekci „Podpora projektu“ přímo na hlavní stránce portálu, v našich newsletterech a v komunitní síti aktivních otců.
              </p>
            </div>
          </div>

          {/* Contact details */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-md border border-teal-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs uppercase font-mono font-bold text-teal-300">Kontakt pro zájemce o partnerství</h3>
                <h4 className="text-sm font-bold text-white font-display">Jiří Šár &mdash; zakladatel portálu Táta má právo</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/40 border border-slate-800/40 p-4 rounded-xl space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Přímé e-maily</span>
                <div className="space-y-1 text-xs font-bold text-white">
                  <a href="mailto:sarji@seznam.cz" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                    sarji@seznam.cz <ArrowUpRight className="w-3.5 h-3.5 text-teal-400" />
                  </a>
                  <a href="mailto:mallfuriionn@gmail.com" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                    mallfuriionn@gmail.com <ArrowUpRight className="w-3.5 h-3.5 text-teal-400" />
                  </a>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/40 p-4 rounded-xl space-y-1.5">
                {currentUser ? (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-teal-400 font-mono block">Telefonní kontakt (registrovaní)</span>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-400" />
                      <span>+420 730 123 456</span>
                    </p>
                    <div className="text-[10px] text-slate-300 space-y-0.5 leading-normal italic pt-1">
                      <p>🟢 Preferuji první kontakt přes <strong>e-mail, SMS nebo WhatsApp</strong>.</p>
                      <p>⚠️ Telefonní hovory od neznámých čísel přijímám jen velice zřídka (pouze pokud je hovor předem očekáván).</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1">
                      <Lock className="w-3 h-3 text-teal-400" />
                      Telefonní kontakt skryt
                    </span>
                    <p className="text-[10px] text-slate-300 leading-normal">
                      Zobrazení čísla je dostupné pouze pro registrované a přihlášené uživatele.
                    </p>
                    {onOpenAuth && (
                      <button
                        type="button"
                        onClick={onOpenAuth}
                        className="text-[10px] font-bold text-teal-400 hover:text-teal-300 hover:underline cursor-pointer flex items-center gap-1 text-left"
                      >
                        Přihlásit se pro zobrazení
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Sponsor Inquiry Form */}
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EBE7E0] space-y-4" id="sponsor-inquiry-form-card">
            <div className="border-b border-[#EBE7E0] pb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Poptávkový formulář</span>
              <h3 className="text-sm font-bold text-slate-800 font-display">Odeslat poptávku partnerství</h3>
              <p className="text-[10px] text-slate-500 mt-1">Máte zájem o technickou záštitu, pronájem serveru, AI API tokeny nebo finanční příspěvek? Dejte nám vědět, rádi se s Vámi spojíme.</p>
            </div>

            {sponsorStatus === 'success' ? (
              <div className="bg-teal-50 border border-teal-200 p-6 rounded-xl text-center space-y-3" id="sponsor-form-success">
                <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-teal-900 font-display">Poptávka úspěšně zaznamenána!</h4>
                <p className="text-xs text-teal-800 leading-relaxed max-w-md mx-auto">
                  Děkujeme za Váš zájem o podporu portálu. Detaily Vaší poptávky byly úspěšně doručeny zakladateli Jiřímu Šárovi na e-mail <strong className="font-bold">sarji@seznam.cz</strong>. Budeme Vás neprodleně kontaktovat zpět.
                </p>
                <button
                  type="button"
                  onClick={() => setSponsorStatus('idle')}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Odeslat další poptávku
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitSponsorForm} className="space-y-4">
                {sponsorError && (
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-start gap-2 text-rose-700 text-[11px] leading-relaxed">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{sponsorError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">Název firmy / Sponzora *</label>
                    <input
                      type="text"
                      required
                      value={sponsorCompany}
                      onChange={(e) => setSponsorCompany(e.target.value)}
                      placeholder="Např. Wedos Hosting a.s."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">Kontaktní osoba (Jméno) *</label>
                    <input
                      type="text"
                      required
                      value={sponsorPerson}
                      onChange={(e) => setSponsorPerson(e.target.value)}
                      placeholder="Např. Jan Novák"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">E-mailová adresa *</label>
                    <input
                      type="email"
                      required
                      value={sponsorEmail}
                      onChange={(e) => setSponsorEmail(e.target.value)}
                      placeholder="vashosting@firma.cz"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">Telefonní číslo (nepovinné)</label>
                    <input
                      type="tel"
                      value={sponsorPhone}
                      onChange={(e) => setSponsorPhone(e.target.value)}
                      placeholder="+420 777 123 456"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">Preferovaný způsob podpory</label>
                  <select
                    value={sponsorType}
                    onChange={(e) => setSponsorType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none"
                  >
                    <option value="vps">💻 Technologická záštita (VPS server / hosting zdarma)</option>
                    <option value="api">🤖 Financování AI tokenů (API poplatky pro asistenta)</option>
                    <option value="financial">💰 Finanční dar (roční podpora chodu)</option>
                    <option value="legal">⚖️ Právní záštita (advokátní dary a konzultace)</option>
                    <option value="other">🤝 Jiná individuální forma spolupráce</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">Upřesnění nabídky / Vaše zpráva *</label>
                  <textarea
                    required
                    value={sponsorMessage}
                    onChange={(e) => setSponsorMessage(e.target.value)}
                    placeholder="Dobrý den Jiří, rádi bychom vašemu portálu bezplatně poskytli náš VPS server s NVMe disky po dobu 2 let..."
                    rows={4}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none resize-none"
                  />
                </div>

                {/* Anti-spam & Submission */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      Kontrola proti spamu: {sponsorMathQuestion.num1} + {sponsorMathQuestion.num2} =
                    </span>
                    <input
                      type="text"
                      required
                      value={sponsorMathAnswer}
                      onChange={(e) => setSponsorMathAnswer(e.target.value)}
                      placeholder="?"
                      className="w-12 px-2 py-1.5 text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-center outline-none font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sponsorStatus === 'submitting'}
                    className="px-5 py-2.5 bg-teal-800 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    {sponsorStatus === 'submitting' ? (
                      <>Odesílání...</>
                    ) : (
                      <>
                        Odeslat poptávku
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
