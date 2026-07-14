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
  CheckCircle, 
  Coins, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Info,
  ExternalLink
} from 'lucide-react';
import { Donation, User } from '../types';
import { saveDocument } from '../lib/firebase';

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
  const [selectedAmount, setSelectedAmount] = useState<number>(300);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>(currentUser ? currentUser.name : '');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [showQrCode, setShowQrCode] = useState<boolean>(true);
  const [useFallbackQr, setUseFallbackQr] = useState<boolean>(false);

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
        title: "Káva pro autory",
        desc: "Podpoříte bdělost našich vývojářů při nočním psaní nových judikátů a vzorů podání."
      };
    } else if (amount < 300) {
      return {
        icon: Server,
        title: "Provoz infrastruktury",
        desc: "Pokryje náklady na cloudový hosting, databázi a API rozhraní pro provoz webu na 7 dní."
      };
    } else if (amount < 500) {
      return {
        icon: Shield,
        title: "Sponzor právní pomoci",
        desc: "Pokryje náklady na přípravu a aktualizaci jednoho vzorového podání k soudu pro tátu v nouzi."
      };
    } else if (amount < 1000) {
      return {
        icon: Award,
        title: "Patron spravedlnosti",
        desc: "Umožní nám oslovit právníky pro vypracování odborného rozboru k novým rozhodnutím Ústavního soudu."
      };
    } else {
      return {
        icon: Sparkles,
        title: "Mecenáš Synthesis Hubu",
        desc: "Zásadním způsobem urychlíte integraci autonomního AI Admina a udržíte web bez otravných reklam."
      };
    }
  };

  const impact = getSupportImpact(activeAmount);

  // Revolut account details for Jiří Šár
  const recipientName = "Jiří Šár";
  const iban = "LT203250027954666874";
  const formattedIban = "LT20 3250 0279 5466 6874";
  const bic = "REVOLT21";
  const bankName = "Revolut Bank UAB";
  const bankAddress = "Konstitucijos ave. 21B, 08130, Vilnius, Lithuania";
  const correspondentBic = "BARCGB22";
  const variableSymbol = "2026" + (currentUser ? currentUser.id.substring(0, 4).replace(/\D/g, '0') : '99');
  
  // Create QR Code URL using standard SPAYD (Short Payment Descriptor) which is fully supported by Czech banking apps
  const qrMessageStr = `Dar Synthesis Hub - ${isAnonymous ? 'Anonym' : donorName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 16)}`;
  
  const cleanMsgForSpayd = `Dar Synthesis Hub - ${isAnonymous ? 'Anonym' : donorName}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 -]/g, "")
    .substring(0, 50);

  // SPAYD standard fully supports international IBAN (ACC:...) and BIC (BIC:...) for European / Revolut transactions
  const spdString = `SPD*1.0*ACC:${iban}*BIC:${bic}*AM:${activeAmount.toFixed(2)}*CC:CZK*VS:${variableSymbol}*MSG:${cleanMsgForSpayd}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(spdString)}`;

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
        isVerified: false // Needs approval or AI verification
      };

      // Save to cloud using general saveDocument helper
      await saveDocument('donations', newDonation.id, newDonation);
      
      // Also update local list so the user immediately sees feedback
      setDonations(prev => [newDonation, ...prev]);
      
      setSubmitStatus('success');
      // Reset form messages
      setMessage('');
    } catch (err) {
      console.error("Error creating donation entry:", err);
      setSubmitStatus('error');
    }
  };

  // Calculate dynamic stats from actual verified donations
  const verifiedDonations = donations.filter(d => d.isVerified);
  const totalRaised = verifiedDonations.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyGoal = 15000;
  const progressPercent = Math.min(Math.round((totalRaised / monthlyGoal) * 100), 100);

  return (
    <div className="space-y-8" id="synthesis-support-hub">
      {/* Visual Header */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_55%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-teal-500/15 border border-teal-500/30 text-teal-300 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold inline-block mb-3">
            Podpora projektu &bull; Synthesis OS
          </span>
          <h1 className="text-2xl md:text-3.5xl font-extrabold font-display tracking-tight text-white leading-tight">
            Podpořte rozvoj portálu <span className="text-teal-400">Táta má právo</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Jsme nezávislý projekt vyvíjený pod záštitou studia <strong className="text-white">Synthesis Jiřího Š.</strong> 
            Naším posláním je poskytovat tátům a rodinám bezplatný přístup k vědecky podloženým informacím, vzorům podání, kalkulačkám a psychologické podpoře. Vše vyvíjíme otevřeně, bez reklam a s vizí budoucí autonomní správy (AI Admin).
          </p>
        </div>
      </div>

      {/* Grid Layout: Stats & Form | QR Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Interactivity & Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Amount Selector & Simulator */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Coins className="w-4.5 h-4.5 text-teal-600" />
              1. Vyberte výši vašeho příspěvku
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[150, 300, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`py-3.5 px-3 rounded-xl border font-display font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    activeAmount === amount && !customAmount
                      ? 'bg-teal-50/50 border-teal-500 text-teal-800 ring-1 ring-teal-500 shadow-3xs'
                      : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">{amount} Kč</span>
                  <span className="text-[9px] font-mono text-slate-400 font-normal">
                    {amount === 150 ? 'Káva ☕' : amount === 300 ? 'Infrastruktura 💻' : amount === 500 ? 'Vzory 📄' : 'Patron 👑'}
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-4">
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
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 flex items-start gap-3 transition-all">
              <div className="w-10 h-10 rounded-lg bg-teal-100/50 flex items-center justify-center text-teal-600 shrink-0">
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
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
              <MessageSquare className="w-4.5 h-4.5 text-teal-600" />
              2. Zapište se na zeď podporovatelů (Nepovinné)
            </h2>

            {submitStatus === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center space-y-2 animate-fadeIn">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-xs text-emerald-950">Vzkaz byl úspěšně zaznamenán!</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Děkujeme! Jakmile obdržíme příspěvek na transparentní účet, náš autonomní administrátor (AI Admin) platbu spáruje a váš vzkaz natrvalo zveřejní na Zdi cti.
                </p>
                <button
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
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {submitStatus === 'submitting' ? 'Ukládám...' : 'Uložit vzkaz na zeď'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

        {/* Right Column (5 cols): QR Payment & Bank transfer details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Buy Me a Coffee CTA card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-200/60 rounded-2xl p-5 shadow-3xs relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
              <Coffee className="w-16 h-16 text-amber-700" />
            </div>
            
            <div className="relative z-10 space-y-3">
              <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-200 text-amber-800 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold inline-flex items-center gap-1">
                <Coffee className="w-2.5 h-2.5" /> Buy me a coffee
              </span>
              
              <h3 className="font-bold text-slate-800 text-xs tracking-tight">
                Pozvěte zakladatele Jiřího Š. na kávu
              </h3>
              
              <p className="text-[10px] text-slate-500 leading-relaxed">
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
          </div>
          
          {/* Paylibo QR Card */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 bg-teal-500/15 border border-teal-500/30 text-teal-400 rounded-full text-[8px] font-mono uppercase tracking-widest font-bold inline-block mb-3">
                Rychlá platba přes mobilní bankovnictví
              </span>
              <h3 className="font-bold text-xs text-white tracking-tight flex items-center gap-1.5">
                Bezpečný QR kód (SPAYD standard)
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                Naskenujte QR kód ve vaší bankovní aplikaci (George, Smart Banka, KB atd.). Všechny údaje se vyplní automaticky.
              </p>
            </div>

            {/* QR Image Visualizer */}
            <div className="my-5 bg-white p-4 rounded-xl max-w-[200px] mx-auto border border-slate-800 shadow-3xs relative group">
              <img
                src={qrCodeUrl}
                alt="QR platba"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-slate-900/80 text-[8px] px-2 py-1 rounded text-white font-bold font-mono">Částka: {activeAmount} Kč</span>
              </div>
            </div>

            {/* Manual Bank details */}
            <div className="border-t border-slate-800 pt-3 space-y-1.5 text-[10px] font-mono">
              <div className="flex justify-between items-start py-1 border-b border-slate-800/40 gap-4">
                <span className="text-slate-400 shrink-0">Příjemce:</span>
                <span className="text-white font-bold text-right">{recipientName}</span>
              </div>
              <div className="flex justify-between items-start py-1 border-b border-slate-800/40 gap-4">
                <span className="text-slate-400 shrink-0">IBAN:</span>
                <span className="text-white font-bold text-right tracking-tight">{formattedIban}</span>
              </div>
              <div className="flex justify-between items-start py-1 border-b border-slate-800/40 gap-4">
                <span className="text-slate-400 shrink-0">BIC / SWIFT:</span>
                <span className="text-white font-bold text-right">{bic}</span>
              </div>
              <div className="flex justify-between items-start py-1 border-b border-slate-800/40 gap-4">
                <span className="text-slate-400 shrink-0">Banka:</span>
                <span className="text-white font-bold text-right">{bankName}</span>
              </div>
              <div className="flex justify-between items-start py-1 border-b border-slate-800/40 gap-4">
                <span className="text-slate-400 shrink-0">Adresa banky:</span>
                <span className="text-slate-300 text-[9px] text-right leading-tight">{bankAddress}</span>
              </div>
              <div className="flex justify-between items-start py-1 border-b border-slate-800/40 gap-4">
                <span className="text-slate-400 shrink-0">Korespondent BIC:</span>
                <span className="text-white font-bold text-right">{correspondentBic}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/40 gap-4">
                <span className="text-slate-400 shrink-0">Částka k odeslání:</span>
                <span className="text-teal-400 font-bold text-xs">{activeAmount} CZK</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/40 gap-4">
                <span className="text-slate-400 shrink-0">Variabilní symbol:</span>
                <span className="text-white font-bold">{variableSymbol}</span>
              </div>
              <div className="flex justify-between items-start py-1 gap-4">
                <span className="text-slate-400 shrink-0">Zpráva pro příjemce:</span>
                <span className="text-white font-bold text-[9px] text-right truncate max-w-[170px]" title={qrMessageStr}>{qrMessageStr}</span>
              </div>
            </div>

            <div className="mt-3 bg-teal-950/40 border border-teal-800/30 p-2.5 rounded-lg text-[9px] text-teal-300 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-400" />
              <span>
                <strong>Záruka transparentnosti:</strong> Všechny finanční příspěvky jsou použity výhradně na servery a provoz bezplatného obsahu. Jiří Š. ani studio Synthesis nečerpají z darů žádné osobní honoráře.
              </span>
            </div>
          </div>

          {/* Sponzoring Progress bar / Monthly Goal */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Měsíční cíl provozu webu
              </h4>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-mono">
                {progressPercent}% splněno
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
              Cíl pokrývá provoz cloudové databáze, API vyhledávání judikátů a bezplatnou právní krizovou podporu pro otce.
            </p>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 font-medium">
              <span>Vybráno: <strong>{totalRaised.toLocaleString('cs-CZ')} Kč</strong></span>
              <span>Cíl: <strong>{monthlyGoal.toLocaleString('cs-CZ')} Kč</strong></span>
            </div>
          </div>

        </div>

      </div>

      {/* Donors Wall / Zeď cti */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-3xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 font-display">Zeď cti &bull; Společenství podporovatelů</h2>
              <p className="text-[11px] text-slate-500">Rodiče a odborníci, kteří drží náš projekt při životě a bez otravných reklam.</p>
            </div>
          </div>

          <span className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-xl font-mono">
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
                  className="bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-xl p-4 transition-all hover:shadow-2xs"
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
                    <span className="bg-teal-50 border border-teal-100/50 text-teal-800 font-bold font-mono text-[11px] px-2.5 py-1 rounded-lg shrink-0">
                      + {donation.amount} Kč
                    </span>
                  </div>
                  {donation.message && (
                    <p className="mt-3 text-[11px] text-slate-600 leading-relaxed italic bg-white p-2 rounded-lg border border-slate-100/50">
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
  );
}
