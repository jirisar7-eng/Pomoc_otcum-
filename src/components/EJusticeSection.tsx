/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * E-JUSTICE & DIGITAL SOUTNICTVI PRO OTCE
 * Complete guide, interactive InfoSoud search builder, Datová schránka workflows,
 * e-Podání rules, and legal e-Justice tools of the Czech Republic.
 */

import React, { useState } from 'react';
import EsbirkaFormValidator from './EsbirkaFormValidator';
import { 
  Globe, 
  Search, 
  Mail, 
  FileText, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Info, 
  Scale, 
  Clock, 
  Lock, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronRight, 
  HelpCircle, 
  BookOpen, 
  Send, 
  Layers, 
  FileCode, 
  Database, 
  FileCheck,
  Building2,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface EJusticeSectionProps {
  onOpenAiAssistant?: (promptText?: string) => void;
  setActiveTab?: (tab: string) => void;
}

export default function EJusticeSection({ onOpenAiAssistant, setActiveTab }: EJusticeSectionProps) {
  // InfoSoud Quick Search State
  const [caseNumber, setCaseNumber] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('OS Praha 4');
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Guide Tab
  const [activeGuideStep, setActiveGuideStep] = useState<'datovka' | 'infosoud' | 'epodani' | 'esbirka' | 'infodeska'>('datovka');

  // Interactive FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Copy helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Sample courts list
  const COURTS_LIST = [
    'OS Praha 1', 'OS Praha 2', 'OS Praha 4', 'OS Praha 5', 'OS Praha 8', 'OS Praha 10',
    'OS Brno-město', 'OS Ostrava', 'OS Plzeň-město', 'OS Olomouc', 'OS Liberec',
    'OS České Budějovice', 'OS Hradec Králové', 'OS Pardubice', 'OS Zlín', 'OS Kladno',
    'KS v Praze', 'KS v Brně', 'KS v Ostravě', 'KS v Plzni'
  ];

  const EJUSTICE_PILLARS = [
    {
      id: 'infosoud',
      title: 'InfoSoud.cz',
      subtitle: 'Sledování staveb a termínů řízení',
      url: 'https://infosoud.justice.cz',
      badge: 'Živý přehled 24/7',
      icon: Search,
      color: 'from-blue-600 to-cyan-700',
      description: 'Oficiální vyhledávač stavu soudních spisů české justice. Umožňuje zkontrolovat nařízená ústní jednání, doručení podání a vydání usnesení.',
      fatherBenefit: 'Otec ihned vidí, zda soud přijal jeho návrh, kdy je nařízeno soudní stání a zda druhá strana doručila vyjádření, ještě než dorazí poštovní obsílka.'
    },
    {
      id: 'datovka',
      title: 'Datové schránky (DS)',
      subtitle: 'Oficiální e-komunikace zdarma (Zákon 300/2008)',
      url: 'https://mojedatovka.cz',
      badge: '0 Kč za podání',
      icon: Mail,
      color: 'from-teal-600 to-emerald-700',
      description: 'Zákonný elektronický kanál pro okamžité odesílání návrhů, odvolání a vyjádření soudu a OSPOD s časovým razítkem.',
      fatherBenefit: 'Nezpochybnitelný důkaz o doručení včas (časové razítko). Šetří poštovné a brání výmluvám protistrany nebo OSPODu na "ztracené dopisy".'
    },
    {
      id: 'epodani',
      title: 'Portal.justice.cz / e-Podání',
      subtitle: 'Elektronická podatelna MSp ČR',
      url: 'https://portal.justice.cz',
      badge: 'Podatelna MSp',
      icon: Send,
      color: 'from-indigo-600 to-purple-700',
      description: 'Oficiální webová podatelna Ministerstva spravedlnosti s ověřováním uznávaných elektronických podpisů a příloh.',
      fatherBenefit: 'Umožňuje bezpečně odesílat i rozsáhlé důkazní spisy (audio nahrávky předávání dětí, videozáznamy, foto-logy maření styku).'
    },
    {
      id: 'infodeska',
      title: 'InfoDeska.cz',
      subtitle: 'Elektronické úřední desky soudů',
      url: 'https://infodeska.justice.cz',
      badge: 'Veřejné vyhlášky',
      icon: Globe,
      color: 'from-amber-600 to-orange-700',
      description: 'Centralizovaný systém elektronických úředních desek všech okresních, krajských i vrchních soudů v ČR.',
      fatherBenefit: 'Hlídá usnesení doručovaná vyhláškou, veřejná oznámení a ustanovení znalců či opatrovníků bez prodlevy.'
    },
    {
      id: 'esbirka',
      title: 'e-Sbírka & e-Legislativa',
      subtitle: 'Oficiální REST API zákonů MV ČR',
      url: 'https://www.e-sbirka.cz',
      badge: 'Oficiální zákony ČR',
      icon: Database,
      color: 'from-slate-700 to-slate-900',
      description: 'Státní databáze zakotvená v zákoně č. 222/2016 Sb. s garantovaným a okamžitě platným zněním českých zákonů.',
      fatherBenefit: 'Garantované citace paragrafů Občanského zákoníku (§ 887, § 907, § 888 OZ) bez rizika zastaralých neoficiálních textů.'
    },
    {
      id: 'isir',
      title: 'Insolvenční rejstřík (ISIR)',
      subtitle: 'Prověřování bonity a dluhů',
      url: 'https://isir.justice.cz',
      badge: 'Prověrka majetku',
      icon: Lock,
      color: 'from-red-600 to-rose-700',
      description: 'Veřejný rejstřík dlužníků a insolvenčních řízení vedený Ministerstvem spravedlnosti ČR.',
      fatherBenefit: 'Umožňuje ověřit majetkové poměry a insolvenční stav v soudním řízení o výživném a zabránit zkreslování příjmů.'
    }
  ];

  const FAQS = [
    {
      q: 'Je podání návrhu přes Datovou schránku rovnocenné papírovému podání na podatelně soudu?',
      a: 'Ano, absolutně! Podle § 18 zákona č. 300/2008 Sb. má úkon učiněný prostřednictvím datové schránky vůči orgánu veřejné moci stejné právní účinky jako úkon učiněný písemně a podepsaný vlastnoručním podpisem. Navíc máte okamžitě k dispozici oficiální doručenku s časovým razítkem.'
    },
    {
      q: 'Kolik stojí odeslání datové zprávy soudu nebo OSPODu?',
      a: 'Pro fyzické osoby je komunikace se všemi orgány veřejné moci (soudy, OSPOD, Policie ČR, finanční úřady) zcela ZDARMA. Neplatíte žádné poštovné ani poplatky za doručenku.'
    },
    {
      q: 'Jak zjistím spisovou značku své kauzy pro vyhledávání na InfoSoud?',
      a: 'Spisová značka opatrovnického řízení u okresního soudu má typicky tvar např. 12 Nc 150/2026 nebo 15 P 45/2025. Naleznete ji v pravém horním rohu každého oficiálního přípisu od soudu nebo OSPODu. Pokud ji neznáte, zavolejte na telefonní infocentrum příslušného okresního soudu a uveďte své jméno a jméno dítěte.'
    },
    {
      q: 'Co mám dělat, když velikost důkazních příloh (např. videa z předávání dítěte) přesahuje limit Datové schránky?',
      a: 'Limit datové schránky pro státní orgány je aktuálně až 100 MB. Pokud máte větší soubory (např. dlouhé videozáznamy), můžete je odeslat přes webový portál e-Podání MSp (portal.justice.cz), doručit na USB flash disku fyzicky do podatelny soudu se zavedením do spisu, nebo soubory nahrát do zabezpečeného datového úložiště a odkázat na ně v podání.'
    },
    {
      q: 'Platí u datové schránky pravidlo, že doručením v pátek večer začíná běžet lhůta až v pondělí?',
      a: 'U soudu platí, že zpráva je soudu doručena okamžikem dodání do datové schránky soudu. Pro počítání procesních lhůt (např. 15 dnů na odvolání) se den doručení nepočítá a lhůta začíná běžet následující den. Připadne-li konec lhůty na sobotu, neděli nebo svátek, je posledním dnem lhůty nejbližší následující pracovní den.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-12">
      {/* 1. HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-teal-800/40">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
            <span>Oficiální portál e-Justice ČR</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            e-Justice & Digitalizace pro otce v opatrovnickém řízení
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Využijte oficiální elektronické nástroje české justice (<strong className="text-teal-200">InfoSoud, Datové schránky, e-Podání, e-Sbírka, InfoDeska</strong>) pro bleskovou komunikaci se soudem, neprůstřelnou evidenci doručení a okamžitý přehled o stavu řízení bez poplatků.
          </p>

          {/* Quick Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center shrink-0 text-teal-300">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Poštovné soudu</div>
                <div className="text-sm font-bold text-white">0 Kč / ZDARMA</div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-300">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Sledování spisu</div>
                <div className="text-sm font-bold text-white">24/7 na InfoSoud</div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Právní jistota</div>
                <div className="text-sm font-bold text-white">Časové razítko</div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-300">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Zákony ČR</div>
                <div className="text-sm font-bold text-white">Oficiální e-Sbírka</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK INTERACTIVE INFOSOUD SEARCH BUILDER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900">Rychlý generátor sledování spisu na InfoSoud.cz</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Zadejte spisovou značku svého opatrovnického řízení a získejte okamžitý návod k vyhledání stavu spisu.
            </p>
          </div>
          <a
            href="https://infosoud.justice.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs border border-teal-200 transition-colors self-start sm:self-auto"
          >
            <span>Otevřít InfoSoud.cz</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Vyberte okresní / krajský soud</label>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {COURTS_LIST.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Spisová značka (např. 12 Nc 150/2026)</label>
            <input
              type="text"
              placeholder="např. 12 Nc 150/2026 nebo 15 P 45/2025"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleCopyText(`https://infosoud.justice.cz`)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Odkaz zkopírován!' : 'Přejít na InfoSoud'}</span>
            </button>
          </div>
        </div>

        {caseNumber && (
          <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3 text-xs text-teal-900 flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Postup vyhledání pro sp. zn. <span className="underline">{caseNumber}</span> u <span className="underline">{selectedCourt}</span>:</p>
              <ol className="list-decimal list-inside space-y-1 mt-1 text-slate-700">
                <li>Otevřete <a href="https://infosoud.justice.cz" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline font-semibold">infosoud.justice.cz</a>.</li>
                <li>V poli "Soud" zvolte <strong>{selectedCourt}</strong>.</li>
                <li>Do pole "Spisová značka" vyplňte <strong>{caseNumber}</strong>.</li>
                <li>Klikněte na Vyhledat. Zobrazí se kompletní chronologický výpis podání, termínů jednání a doručení.</li>
              </ol>
            </div>
          </div>
        )}

        {/* e-Sbírka Legislative Validation Check for InfoSoud / e-Podání Submission */}
        <div className="pt-2">
          <EsbirkaFormValidator
            formId="infosoud-epodani"
            formTitle="E-Podání podání k opatrovnickému soudu"
            formData={{
              courtAddress: selectedCourt,
              caseNumber: caseNumber,
              fullText: `Podání určené pro ${selectedCourt}, spisová značka: ${caseNumber}`
            }}
          />
        </div>
      </div>

      {/* 3. CORE E-JUSTICE PILLARS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Přehled e-Justice nástrojů a jak pomáhají otcům</h2>
            <p className="text-xs text-slate-500">6 pilířů digitálního soudnictví Ministerstva spravedlnosti a MV ČR</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EJUSTICE_PILLARS.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillar.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wide border border-slate-200">
                      {pillar.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700">{pillar.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-teal-800">
                      <Zap className="w-3.5 h-3.5 text-teal-600" />
                      <span>Jak konkrétně pomůže otci:</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-normal">
                      {pillar.fatherBenefit}
                    </p>
                  </div>
                </div>

                <a
                  href={pillar.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <span>Navštívit službu</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PRACTICAL WORKFLOW STEP-BY-STEP GUIDES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Praktické postupy pro komunikaci se soudem a OSPOD</h2>
          <p className="text-xs text-slate-500">Průvodce kroky k efektivnímu využívání elektronické justice bez chyby</p>
        </div>

        {/* Step Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveGuideStep('datovka')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeGuideStep === 'datovka'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>1. Zřízení Datové schránky zdarma</span>
          </button>

          <button
            onClick={() => setActiveGuideStep('epodani')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeGuideStep === 'epodani'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>2. Jak podat návrh / odvolání</span>
          </button>

          <button
            onClick={() => setActiveGuideStep('infosoud')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeGuideStep === 'infosoud'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>3. Sledování spisu a jednání</span>
          </button>

          <button
            onClick={() => setActiveGuideStep('esbirka')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeGuideStep === 'esbirka'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>4. Citování e-Sbírky MV ČR</span>
          </button>
        </div>

        {/* Step Content */}
        {activeGuideStep === 'datovka' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-base">
              <Mail className="w-5 h-5 text-teal-600" />
              <h3>Zřízení Datové schránky fyzické osoby (FO) během 5 minut zdarma</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Datovou schránku si může každý občan ČR zřídit zcela zdarma bez nutnosti návštěvy pošty (Czech POINT). Postačí vám Identita občana (BankID, MojeID, eObčanka).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">1</div>
                <h4 className="font-bold text-slate-900 text-xs">Přejděte na mojedatovka.cz</h4>
                <p className="text-[11px] text-slate-600">Klikněte na "Zřídit datovou schránku online".</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">2</div>
                <h4 className="font-bold text-slate-900 text-xs">Přihlášení přes BankID</h4>
                <p className="text-[11px] text-slate-600">Přihlaste se svou bankovní identitou (Česká spořitelna, ČSOB, KB, Air Bank atd.).</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">3</div>
                <h4 className="font-bold text-slate-900 text-xs">Potvrzení údajů</h4>
                <p className="text-[11px] text-slate-600">Zkontrolujte své jméno, trvalé bydliště a zadat kontaktní e-mail a telefon.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">4</div>
                <h4 className="font-bold text-slate-900 text-xs">Okamžitá aktivace</h4>
                <p className="text-[11px] text-slate-600">Datová schránka je aktivní ihned a získáte svůj unikátní 7místný ID kód (např. ab1cd2e).</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Důležité pravidlo doručování (Fikce doručení):</strong>
                <p className="mt-0.5 text-slate-700">
                  Pokud vám soud nebo OSPOD pošle písemnost do datové schránky, zpráva je považována za doručenou okamžikem, kdy se do schránky přihlásíte. Pokud se nepřihlásíte v průběhu 10 dnů, zpráva se považuje za doručenou 10. dnem (tzv. fikce doručení). Zapněte si proto zdarma e-mailové notifikace na každou příchozí zprávu!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeGuideStep === 'epodani' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-base">
              <Send className="w-5 h-5 text-teal-600" />
              <h3>Pravidla pro podání návrhu, odvolání či důkazů elektronickou cestou</h3>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold">Formát PDF/A pro textové dokumenty:</strong>
                  <p className="text-slate-600">Návrhy k soudu (např. návrh na střídavou péči nebo úpravu výživného) převádějte z Wordu do PDF/A. Neposílejte nekonvertované soubory .docx nebo pouhé snímky obrazovky.</p>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold">Ukládání Doručenek (.zfo / PDF doručenka):</strong>
                  <p className="text-slate-600">Po odeslání datové zprávy si z webového rozhraní stáhněte soubor doručenky. Obsahuje časové razítko a kryptografické potvrzení Ministerstva vnitra ČR, které prokazuje včasné odeslání.</p>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold">Označení ID datové schránky soudu a OSPOD:</strong>
                  <p className="text-slate-600">Každý okresní soud i OSPOD má svůj vlastní kód datové schránky (např. Okresní soud Praha 4 má ID datové schránky: <code>257ab2c</code>). Naše podání přímo uvádí kódy schránek v sekci dokumentů ke stažení.</p>
                </div>
              </li>
            </ul>
          </div>
        )}

        {activeGuideStep === 'infosoud' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-base">
              <Search className="w-5 h-5 text-teal-600" />
              <h3>Sledování průběhu spisu a soudních jednání na InfoSoud.cz</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              InfoSoud.cz je bezplatná služba Ministerstva spravedlnosti. Po zadání spisové značky (např. 12 Nc 150/2026) uvidíte kompletní stavovou historii:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border border-slate-200 rounded-xl p-3 bg-blue-50/50">
                <div className="text-xs font-bold text-blue-900">1. Nájezd a zaevidování podání</div>
                <p className="text-[11px] text-slate-600 mt-1">Potvrzuje, že soud fyzicky i elektronicky převzal váš návrh.</p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-amber-50/50">
                <div className="text-xs font-bold text-amber-900">2. Nařízení ústního jednání</div>
                <p className="text-[11px] text-slate-600 mt-1">Uvidíte přesné datum, čas a číslo jednací síně dříve, než dorazí předvolání.</p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-emerald-50/50">
                <div className="text-xs font-bold text-emerald-900">3. Vydání rozsudku / usnesení</div>
                <p className="text-[11px] text-slate-600 mt-1">Informace o tom, že soudce již vypracoval písemný rozsudek a expeduje jej.</p>
              </div>
            </div>
          </div>
        )}

        {activeGuideStep === 'esbirka' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-base">
              <Database className="w-5 h-5 text-teal-600" />
              <h3>Oficiální REST API e-Sbírka Ministerstva vnitra v našem portálu</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Váš portál <strong>Táta má právo</strong> komunikuje přímo s oficiálním REST API e-Sbírky (<code>https://api.e-sbirka.gov.cz</code>) s využitím bezpečné serverové vyrovnávací paměti (cache). Citované paragrafy (§ 855-927 OZ) jsou okamžitě ověřovány a předpřipraveny pro vaše podání.
            </p>

            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-[11px] space-y-1">
              <div className="text-teal-400">// Příklad oficiálního dotazu na REST API e-Sbírky přes backend cache:</div>
              <div>GET /api/esbirka/paragraph/89-2012/907</div>
              <div className="text-slate-400">Response: &#123; "paragraphNumber": "§ 907", "lawTitle": "Občanský zákoník", "title": "Formy péče o dítě" &#125;</div>
            </div>
          </div>
        )}
      </div>

      {/* 5. FAQS & MYTH BASHING ACCORDION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900">Mýty a fakta o e-Justice v opatrovnickém práva</h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/80 font-bold text-xs text-slate-900 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronRight className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${expandedFaq === index ? 'rotate-90 text-teal-700' : ''}`} />
              </button>

              {expandedFaq === index && (
                <div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-700 leading-relaxed animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6. AI ASSISTANT & ACTION INTEGRATION BANNER */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-5 h-5 text-teal-300" />
            <h3 className="text-lg font-bold">Potřebujete zkontrolovat podání pro e-Justice nebo zřídit Datovou schránku?</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Náš AI právní asistent vám pomůže s přípravou PDF/A podání k opatrovnickému soudu, správnou formulací spisové značky i kontrolou lhůt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onOpenAiAssistant && (
            <button
              onClick={() => onOpenAiAssistant('Jak správně odeslat podání přes Datovou schránku k opatrovnickému soudu a jaké přílohy přiložit?')}
              className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Konzultovat s AI zdarma</span>
            </button>
          )}

          {setActiveTab && (
            <button
              onClick={() => setActiveTab('ke-stazeni')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-teal-300" />
              <span>Vzory podání ke stažení</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
