/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  HelpCircle, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  BookOpen, 
  FileText, 
  Check, 
  ExternalLink, 
  Award, 
  Scale, 
  MessageSquare, 
  Copy, 
  Eye, 
  FileCheck,
  Printer,
  ArrowRightLeft,
  Users,
  RefreshCw,
  Sliders,
  Download,
  AlertCircle,
  Info,
  TrendingUp,
  Plus,
  Trash2,
  Save,
  Cloud,
  Baby,
  GraduationCap,
  Clock,
  MapPin,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { saveDocument } from '../lib/firebase';
import { User } from '../types';
import { TRANSLATED_STUDIES } from '../data/translatedStudies';
import GlossaryTerm from './GlossaryTerm';

interface ScheduleType {
  id: string;
  name: string;
  description: string;
  pattern: ('A' | 'B')[]; // 14 days pattern
  pros: string[];
  cons: string[];
  bestFor: string;
}

const SCHEDULES: ScheduleType[] = [
  {
    id: 'weekly',
    name: 'Týdenní střídání (7 a 7 dnů)',
    description: 'Nejrozšířenější model. Dítě tráví celý týden u jednoho rodiče (např. od pátku do pátku nebo neděle do neděle) a pak se přesune ke druhému.',
    pattern: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
    pros: [
      'Jednoduchá logistika a minimum předávání v týdnu.',
      'Dítě má klid se usadit a prožít celistvý týden (škola, volný čas).',
      'Jasné a přehledné plánování času pro rodiče.'
    ],
    cons: [
      'Celých 7 dnů odloučení od druhého rodiče může být pro menší děti příliš dlouhé.',
      'Rodič, který dítě zrovna nemá, ztrácí kontakt s každodenní realitou školy a kroužků.'
    ],
    bestFor: 'Děti školního věku (cca od 6–7 let) s vyzrálou schopností snášet delší odloučení.'
  },
  {
    id: '2-2-3',
    name: 'Dvou-dvou-třídenní střídání (2-2-3)',
    description: 'Rychlejší střídání. Rodič A má Po-Út, rodič B má St-Čt, rodič A má Pá-Ne. Další týden se role kompletně prohodí.',
    pattern: ['A', 'A', 'B', 'B', 'A', 'A', 'A', 'B', 'B', 'A', 'A', 'B', 'B', 'B'],
    pros: [
      'Dítě není nikdy odloučeno od žádného rodiče déle než 3 dny.',
      'Oba rodiče jsou neustále v kontaktu s týdenním režimem školy/kroužků.',
      'Velmi vřelé zachování vazeb u malých dětí.'
    ],
    cons: [
      'Velmi častá předávání (3x do týdne) vyžadují bezproblémovou komunikaci rodičů a blízké bydlení.',
      'Dítě se neustále balí a přesouvá, což může citlivější děti stresovat.'
    ],
    bestFor: 'Batolata a předškolní děti (cca od 2 do 6 let), které těžko snášejí dlouhé odloučení.'
  },
  {
    id: '4-3-3-4',
    name: 'Čtyř-tří-tří-čtyřdenní střídání (4-3-3-4)',
    description: 'Rodič A má Po-Čt, rodič B má Pá-Ne. Druhý týden má rodič B Po-St a rodič A má Čt-Ne. Režim zajišťuje stálé víkendy a rozumné dny v týdnu.',
    pattern: ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'A', 'A', 'A', 'A'],
    pros: [
      'Dítě má stabilní dny v týdnu (např. začátek týdne je vždy u táty, konec u mámy).',
      'Dobře se plánují pravidelné kroužky a aktivity.',
      'Menší počet přesunů než u 2-2-3 střídání.'
    ],
    cons: [
      'Asymetrie střídání (jeden rodič má každý víkend, druhý má pouze týdenní bloky).'
    ],
    bestFor: 'Děti, které preferují pevný řád a stejné dny u stejného rodiče každý týden.'
  }
];

export default function PeceODiteSection({ 
  currentUser, 
  onOpenAuth, 
  setActiveTab 
}: { 
  currentUser?: User | null; 
  onOpenAuth?: () => void; 
  setActiveTab?: (tab: string) => void;
}) {
  const [activeSubTab, setActiveSubTab] = useState<'schedules' | 'studies' | 'methodologies'>('schedules');
  const [selectedStudy, setSelectedStudy] = useState<'fabricius' | 'warshak'>('fabricius');
  const [expandedStudyText, setExpandedStudyText] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const fabriciusCopyText = `Nález Ústavního soudu ČR a moderní vývojová psychologie (reprezentovaná např. studií Fabricius & Suh, 2016 z Arizona State University, publikovanou v prestižním časopise Psychology, Public Policy, and Law) jednoznačně vyvracejí překonané domněnky, že kojenci a batolata (děti pod 3 roky věku) nemohou přespávat u otců. 

Empirická data ze studie Fabricius & Suh (2016) prokazují:
1) Časté a pravidelné přespávání u otce v raném věku (pod 1 rok a ve 2 letech) má silný a dlouhodobě pozitivní vliv na kvalitu vztahu mezi otcem a dítětem v dospělosti (prokázán přímý lineární nárůst kvality vztahu s každou nocí strávenou u otce navíc).
2) Tyto noclehy nijak nepoškozují vztah dítěte s matkou. Naopak byl zjištěn pozitivní vliv na oba rodiče (respite effect - odpočinek pro matku, která díky sdílení péče vykazuje méně vyhoření a větší citlivost vůči dítěti).
3) Tyto pozitivní účinky se projevují bez ohledu na to, zda mezi rodiči panuje vysoký konflikt, a bez ohledu na případný počáteční nesouhlas matky s přespáváním.`;

  const warshakCopyText = `Závěry opatrovnických orgánů a soudů prvního stupně by měly reflektovat mezinárodní vědecký konsenzus, který byl formulován v přelomové konsenzuální zprávě prof. Richarda A. Warshaka (2014) pod názvem "Social Science and Parenting Plans for Young Children: A Consensus Report". Tuto zprávu oficiálně schválilo a podepsalo 110 předních světových odborníků na vývoj dětí, psychologii a rodinné právo.

Tento globální vědecký konsenzus stanovuje:
1) Pro dětství všech věkových kategorií, včetně dětí mladších 4 let, by měla být střídavá péče (zahrnující přespávání v obou domácnostech) výchozí a prioritní normou.
2) Neexistují žádné vědecké důkazy, které by obhajovaly odkládání pravidelného přespávání u otce na pozdější věk (např. až od 3 či 5 let). Postponování noclehů naopak prokazatelně poškozuje a oslabuje rodící se otcovské pouto.
3) Teorie monotropie (jediného primárního pečovatele) byla vědou opuštěna. Děti jsou biologicky plně vybaveny k tomu, aby si vytvářely paralelní, stejně kvalitní a bezpečné citové vazby k oběma rodičům současně.`;

  return (
    <div className="space-y-8" id="pece-o-dite-container">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Heart className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider font-mono">Péče a Logistika</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display">Péče o dítě, cykly a vědecké důkazy</h2>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-3">
          Střídavá péče u dětí, zejména těch nejmenších (kojenci a batolata), musí být postavena na zdravém rozumu a nejnovějších empirických vědeckých poznatcích. Naše argumentace se opírá o moderní mezinárodní výzkum, který jednoznačně podporuje rovnocennou roli obou rodičů od narození.
        </p>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex border-b border-slate-100 bg-white p-1 rounded-xl shadow-3xs max-w-xl">
        <button
          onClick={() => setActiveSubTab('schedules')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'schedules'
              ? 'bg-teal-50 text-teal-700 shadow-3xs border border-teal-100/50 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Modely péče & Plánovač
        </button>
        <button
          onClick={() => setActiveSubTab('studies')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'studies'
              ? 'bg-teal-50 text-teal-700 shadow-3xs border border-teal-100/50 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Vědecké studie & Výzkum
          <span className="bg-teal-100 text-teal-800 text-[8px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider font-extrabold scale-90">Věda</span>
        </button>
        <button
          onClick={() => setActiveSubTab('methodologies')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'methodologies'
              ? 'bg-teal-50 text-teal-700 shadow-3xs border border-teal-100/50 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-teal-600" />
          Metodiky & Obrana
          <span className="bg-amber-100 text-amber-800 text-[8px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider font-extrabold scale-90">Obrana</span>
        </button>
      </div>

      {activeSubTab === 'schedules' && (
        <>
          {/* Main Grid: Types of custody info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sole Custody */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#A67C52] bg-[#F5E6D3] px-2.5 py-0.5 rounded-full font-mono uppercase">Tradiční</span>
                  <span className="text-[10px] text-slate-400">§ 906 OZ</span>
                </div>
                <h3 className="font-bold text-slate-800 font-display text-sm">Výlučná péče jednoho rodiče</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Dítě je svěřeno do péče jednoho rodiče (který rozhoduje o běžných věcech). Druhý rodič má právo na styk (návštěvy) a povinnost platit stanovené výživné.
                </p>
              </div>
              <div className="border-t border-slate-50 pt-3 mt-4 text-[10px] text-slate-400">
                Doporučuje se tam, kde jeden z rodičů o péči nemá zájem nebo má vážné zdravotní/sociální překážky.
              </div>
            </div>

            {/* Alternating Custody */}
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#EBE7E0] shadow-3xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7D8F69] bg-[#E6EBDD] px-2.5 py-0.5 rounded-full font-mono uppercase">Preferováno ÚS</span>
                  <span className="text-[10px] text-slate-400">§ 907 OZ</span>
                </div>
                <h3 className="font-bold text-slate-800 font-display text-sm">Střídavá péče</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Dítě tráví srovnatelný čas s oběma rodiči (např. 50/50 nebo 60/40). Oba rodiče zůstávají plnohodnotnými vychovateli se všemi právy a povinnostmi.
                </p>
              </div>
              <div className="border-t border-[#EBE7E0] pt-3 mt-4 text-[10px] text-[#7D8F69] font-semibold">
                Ústavní soud ji označuje za primární volbu zachovávající právo dítěte na oba rodiče.
              </div>
            </div>

            {/* Joint Custody */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full font-mono uppercase">Pro partnery</span>
                  <span className="text-[10px] text-slate-400">§ 907 OZ</span>
                </div>
                <h3 className="font-bold text-slate-800 font-display text-sm">Společná péče rodičů</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Soud neurčuje žádný pevný časový harmonogram předávání. Dítě je svěřeno oběma dohromady. Vyžaduje, aby rodiče i po rozchodu bezproblémově spolužili nebo se pružně domlouvali.
                </p>
              </div>
              <div className="border-t border-slate-50 pt-3 mt-4 text-[10px] text-slate-400">
                Ideální u klidných rozchodů, kde rodiče bydlí blízko sebe a plně se respektují.
              </div>
            </div>
          </div>

          {/* LINK TO STANDALONE CARE SIMULATOR */}
          <div className="bg-gradient-to-r from-teal-50/50 to-indigo-50/50 rounded-2xl border border-teal-100/80 p-6 md:p-8 shadow-2xs space-y-5 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping" />
                  <div className="bg-teal-100 text-teal-800 text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full font-mono">
                    Samostatný modul Synthesis OS
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 font-display tracking-tight flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-teal-600" />
                  Interaktivní 28-denní simulátor péče &amp; sourozenecké soudržnosti
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pro komplexní modelování péče, analýzu dopadů stěhování na stabilitu dítěte a sourozeneckou soudržnost jsme připravili plnohodnotný <strong>28-denní 3D Simulátor</strong>. Tento profesionální nástroj vám umožní spravovat neomezený počet dětí, upravovat jména, používat rychlé "malování" kalendáře, a okamžitě stáhnout formální Word/PDF report s vědeckou argumentací pro opatrovnický soud.
                </p>
              </div>
              <div className="shrink-0">
                <button
                  onClick={() => {
                    setActiveTab?.("care-simulator");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer group"
                >
                  Spustit 3D Simulátor péče
                  <span className="group-hover:translate-x-1 transition-transform">➜</span>
                </button>
              </div>
            </div>
          </div>

          {/* Practical Handover advice */}
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex gap-4">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-900 text-xs font-display">Taktika předávání dětí: Doporučení z praxe</h4>
              <p className="text-amber-800 text-xs leading-relaxed">
                Nejlepší způsob předávání je <strong>přes školská zařízení</strong> (jeden rodič ráno odvede do školky/školy, druhý rodič odpoledne vyzvedne). Tím se zcela eliminuje nutnost přímého kontaktu rodičů v emočně napjatých chvílích a dítě nevidí žádné případné hádky ani napětí. Pokud to není možné, předávejte na neutrálním veřejném místě.
              </p>
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'studies' && (
        /* SCIENTIFIC STUDIES TAB */
        <div className="space-y-8 animate-fadeIn animate-duration-300" id="scientific-studies-subview">
          
          {/* Scientific intro card */}
          <div className="bg-slate-900 text-slate-100 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12 select-none">
              <Award className="w-96 h-96 text-teal-400" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                  Globální vědecký konsenzus
                </span>
                <Award className="w-4 h-4 text-teal-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
                Vědecké studie vyvracejí opatrovnické mýty o nejmenších dětech
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                Opatrovnické soudy a sociální pracovnice <GlossaryTerm termId="ospod">OSPOD</GlossaryTerm> v České republice často žijí v zajetí dávno vyvrácených mateřských stereotypů ze 20. století (tzv. <GlossaryTerm termId="monotropy">teorie monotropie</GlossaryTerm> - předpoklad, že dítě pod 3 roky potřebuje k zdravému vývoji výhradně matku a s otcem nesmí přespávat). Moderní světová vývojová psychologie a rozsáhlá empirická data však mluví naprosto jednoznačně: <strong>střídavá péče a přespávání u obou rodičů je nejlepším zájmem dítěte již od narození</strong>.
              </p>
            </div>
          </div>

          {/* Interactive Study Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left sidebar with studies options */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Vyberte vědeckou studii:</span>
              
              <button
                onClick={() => { setSelectedStudy('fabricius'); setExpandedStudyText(false); }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  selectedStudy === 'fabricius'
                    ? 'bg-teal-50/70 border-teal-200 text-teal-900 shadow-3xs'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${selectedStudy === 'fabricius' ? 'bg-teal-100 text-teal-700' : 'bg-slate-50 text-slate-400'}`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs">Fabricius & Suh (2016)</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Dlouhodobý vliv noclehů u kojenců a batolat</p>
                  <span className="inline-block text-[8px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono uppercase tracking-wide mt-1">Ústavní argument</span>
                </div>
              </button>

              <button
                onClick={() => { setSelectedStudy('warshak'); setExpandedStudyText(false); }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  selectedStudy === 'warshak'
                    ? 'bg-teal-50/70 border-teal-200 text-teal-900 shadow-3xs'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${selectedStudy === 'warshak' ? 'bg-teal-100 text-teal-700' : 'bg-slate-50 text-slate-400'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs">Konsenzus 110 vědců - Warshak (2014)</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Mezinárodní standard střídavé péče pro děti pod 4 roky</p>
                  <span className="inline-block text-[8px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-mono uppercase tracking-wide mt-1">Globální konsenzus</span>
                </div>
              </button>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4.5 text-[10px] text-slate-500 leading-relaxed font-mono">
                💡 <strong>Rada z praxe:</strong> Odkazy na tyto konkrétní studie představují pro soudce neprůstřelný argument, který nutí OSPOD doložit protidůkazy. Tyto studie tvoří základ argumentace v nálezech Ústavního soudu ČR o střídavé péči u malých dětí.
              </div>
            </div>

            {/* Right side displaying selected study details */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-3xs space-y-6">
              
              {selectedStudy === 'fabricius' ? (
                /* FABRICIUS DETAILS */
                <div className="space-y-6" id="fabricius-details">
                  
                  {/* Title & metadata */}
                  <div className="border-b border-slate-100 pb-4 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-bold font-mono bg-teal-50 text-teal-600 px-2 py-0.5 rounded uppercase">Psychology, Public Policy, and Law</span>
                      <span className="text-[9px] font-bold font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">APA (2016)</span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-slate-800 font-serif leading-snug">
                      Should Infants and Toddlers Have Frequent Overnight Parenting Time With Fathers? The Policy Debate and New Data
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      William V. Fabricius, Go Woon Suh • Arizona State University • Schváleno APA
                    </p>
                  </div>

                  {/* Quick methodology */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Metodika a vzorek</span>
                      <p className="text-slate-700 leading-relaxed font-semibold">
                        N = 116 dospělých studentů, jejichž rodiče se trvale rozešli před jejich 3. rokem života. Hodnocen byl dlouhodobý vliv noclehů u otce v raném dětství na vztahy o 19 let později v mladé dospělosti.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Klíčová zjištěná proměnná</span>
                      <p className="text-slate-700 leading-relaxed font-semibold">
                        Zkoumaly se standardizované vědecké škály otcovské a mateřské vřelosti (Parental Caring, Mattering, Paternal Blame) a celková blízkost a důvěra ve vztahu (<GlossaryTerm termId="pbi">PBI</GlossaryTerm>).
                      </p>
                    </div>
                  </div>

                  {/* Bullet findings */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Klíčové vědecké nálezy:</span>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Efekt přímé závislosti (<GlossaryTerm termId="dose-response">Dose-Response Effect</GlossaryTerm>)</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Každá noc strávená u otce navíc v raném věku (kojenci do 1 roku i batolata do 2 let) lineárně zvyšuje kvalitu a hloubku vztahu s otcem v dospělosti. Maximální kvality a optimálního bezpečí bylo dosaženo při rovnocenném počtu nocí u obou rodičů (6 až 7 nocí ve 14denním cyklu u otce).
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Nulová újma na vztahu s matkou</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Výzkum prokazatelně vyvrátil obavu, že přespávání u otce poškozuje vztah dětí k matkám. Děti, které trávily noci u obou rodičů, vykazovaly stabilní a bezpečné <GlossaryTerm termId="attachment">citové vazby</GlossaryTerm> s oběma rodiči současně.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Vliv i přes odpor a konflikt</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Tento blahodárný efekt přespávání u otce v nejranějším věku fungoval zcela bez ohledu na to, zda mezi rodiči panovalo nepřátelství nebo zda matka s noclehy nesouhlasila a byly nařízeny soudem přes její odpor. Rodičovský konflikt nesnižuje dlouhodobý přínos raných noclehů pro dítě.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ready-to-copy block */}
                  <div className="space-y-2 border-t border-slate-100 pt-4" id="copy-block-fabricius">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                        Text pro argumentaci k soudu:
                      </span>
                      <button
                        onClick={() => copyToClipboard(fabriciusCopyText, 'fabricius')}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all flex items-center gap-1 border cursor-pointer ${
                          copiedId === 'fabricius'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {copiedId === 'fabricius' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Zkopírováno!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            Zkopírovat argument
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-[#FAF9F5] border border-[#EBE7E0] p-4 rounded-xl text-[10px] text-slate-600 font-mono leading-relaxed whitespace-pre-wrap select-text">
                      {fabriciusCopyText}
                    </div>
                  </div>

                </div>
              ) : (
                /* WARSHAK DETAILS */
                <div className="space-y-6" id="warshak-details">
                  
                  {/* Title & metadata */}
                  <div className="border-b border-slate-100 pb-4 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-bold font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase">Consensus Report</span>
                      <span className="text-[9px] font-bold font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">110 Signatories (2014)</span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-slate-800 font-serif leading-snug">
                      Social Science and Parenting Plans for Young Children: A Consensus Report
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Richard A. Warshak • University of Texas Southwestern Medical Center (a 110 mezinárodních signatářů)
                    </p>
                  </div>

                  {/* Quick methodology */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Vědecká záštita</span>
                      <p className="text-slate-700 leading-relaxed font-semibold">
                        Zpráva byla podepsána a schválena 110 mezinárodními špičkami v oblasti psychologie dětství, psychiatrie, sociální práce a rodinného práva z celého světa.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Účel dokumentu</span>
                      <p className="text-slate-700 leading-relaxed font-semibold">
                        Poskytnout soudům, mediátorům a opatrovníkům jednotný, empiricky podložený rámec pro rozhodování o péči u dětí do 4 let s cílem zabránit dezinterpretacím vědeckých dat.
                      </p>
                    </div>
                  </div>

                  {/* Bullet findings */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Klíčové vědecké nálezy:</span>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Střídavá péče od narození</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Empirická data plně podporují <GlossaryTerm termId="shared-parenting">střídavou péči</GlossaryTerm> (podíl času v rozmezí 35% až 50% pro každého rodiče) jako nejlepší možnou normu pro zdravý rozvoj dítěte u dětí všech věkových skupin, včetně dětí mladších 4 let.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Odmítnutí odkládání noclehů</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Neexistují žádné vědecké studie, které by ukazovaly, že je bezpečnější přespávání u otce odložit na pozdější věk (např. po 3. či 5. roce). Naopak odkládání noclehů prokazatelně vede k odcizení a výraznému snížení ochoty otců se na výchově podílet.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-800 block text-xs">Zdravý vývoj paralelních vazeb</strong>
                          <span className="text-slate-600 leading-relaxed">
                            Kojenci a batolata si vytvářejí paralelní <GlossaryTerm termId="attachment">citové vazby</GlossaryTerm> k matce i k otci současně. Představa, že dítě má pouze jednoho "primárního" rodiče (obvykle matku), byla vědecky překonána. Omezení kontaktu s otcem na pouhé hodiny bez přespávání tuto vazbu nevratně poškozuje.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ready-to-copy block */}
                  <div className="space-y-2 border-t border-slate-100 pt-4" id="copy-block-warshak">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                        Text pro argumentaci k soudu:
                      </span>
                      <button
                        onClick={() => copyToClipboard(warshakCopyText, 'warshak')}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all flex items-center gap-1 border cursor-pointer ${
                          copiedId === 'warshak'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {copiedId === 'warshak' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Zkopírováno!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            Zkopírovat argument
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-[#FAF9F5] border border-[#EBE7E0] p-4 rounded-xl text-[10px] text-slate-600 font-mono leading-relaxed whitespace-pre-wrap select-text">
                      {warshakCopyText}
                    </div>
                  </div>

                </div>
              )}

              {/* Expanded Translation Section */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setExpandedStudyText(!expandedStudyText)}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  {expandedStudyText ? (
                    <>
                      <X className="w-4 h-4 shrink-0" />
                      Skrýt plné znění a překlad studie
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 shrink-0" />
                      Číst plný český překlad studie v češtině (Plné znění)
                    </>
                  )}
                </button>
              </div>

              {expandedStudyText && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 bg-[#FCFCFB] border border-[#F3EFE9] rounded-2xl p-6 md:p-8 space-y-6 text-slate-800 leading-relaxed overflow-hidden shadow-2xs font-serif select-text text-left"
                >
                  {/* Interactive academic paper header */}
                  <div className="border-b border-slate-200 pb-4 space-y-2 font-sans">
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full inline-block">
                      Překlad akademického originálu • Plné znění
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight leading-snug">
                      {TRANSLATED_STUDIES[selectedStudy].title}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 font-mono pt-2">
                      <div><strong>Autoři:</strong> {TRANSLATED_STUDIES[selectedStudy].authors}</div>
                      <div><strong>Časopis:</strong> {TRANSLATED_STUDIES[selectedStudy].journal}</div>
                      <div><strong>Rok:</strong> {TRANSLATED_STUDIES[selectedStudy].year}</div>
                      <div><strong>Citace:</strong> {TRANSLATED_STUDIES[selectedStudy].citation}</div>
                    </div>
                  </div>

                  {/* Abstract Card */}
                  <div className="bg-[#FAF9F5] border-l-4 border-teal-500 p-5 rounded-r-xl space-y-2 font-sans">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">Abstrakt / Souhrn</h4>
                    <p className="text-slate-700 text-xs leading-relaxed italic">
                      {TRANSLATED_STUDIES[selectedStudy].abstract}
                    </p>
                  </div>

                  {/* Introduction */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono font-sans">Úvod a teoretická východiska</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-serif">
                      {TRANSLATED_STUDIES[selectedStudy].introduction}
                    </p>
                  </div>

                  {/* Methodology */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono font-sans">Vědecká metodologie a zkoumaný vzorek</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-serif">
                      {TRANSLATED_STUDIES[selectedStudy].methodology}
                    </p>
                  </div>

                  {/* Detailed Findings List */}
                  <div className="space-y-3 bg-[#FAF9F5]/40 border border-slate-100 rounded-xl p-5 font-sans">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">Hlavní vědecké nálezy a výsledky:</h4>
                    <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                      {TRANSLATED_STUDIES[selectedStudy].keyFindings.map((finding, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-teal-600 font-bold shrink-0">{idx + 1}.</span>
                          <p>{finding}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scientific Discussion */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono font-sans">Odborná vědecká diskuse</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-serif">
                      {TRANSLATED_STUDIES[selectedStudy].scientificDiscussion}
                    </p>
                  </div>

                  {/* Policy & Practice */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono font-sans">Dopady na rodinnou politiku a soudní praxi</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-serif">
                      {TRANSLATED_STUDIES[selectedStudy].policyImplications}
                    </p>
                  </div>

                  {/* Final Conclusion Block */}
                  <div className="bg-[#FAF9F5] border border-[#EBE7E0] p-6 rounded-xl space-y-2 font-sans text-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">Závěr a shrnutí studie</h4>
                    <p className="text-slate-800 text-xs leading-relaxed font-serif italic max-w-2xl mx-auto">
                      {TRANSLATED_STUDIES[selectedStudy].conclusions}
                    </p>
                  </div>

                  {/* Section by Section Full Breakdown */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono font-sans">Detailní struktura a kapitoly studie:</h4>
                    <div className="space-y-4">
                      {TRANSLATED_STUDIES[selectedStudy].sections.map((section, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <h5 className="font-bold text-slate-900 text-xs font-sans">{section.title}</h5>
                          <p className="text-xs text-slate-700 leading-relaxed font-serif">{section.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}

            </div>
          </div>

          {/* Myths vs Science Bento Grid */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Mýty opatrovnických soudů vs. Vědecká fakta</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-3">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Mýtus o nízkém věku</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "Dítě je příliš malé (např. pod 2 roky) nebo je stále kojeno, proto nemůže spát u otce a střídavá péče nepřichází v úvahu."
                </p>
                <div className="border-t border-slate-50 pt-3 text-xs text-teal-700 font-semibold space-y-1">
                  <span className="text-[10px] font-mono text-teal-600 uppercase block font-bold">Vědecký fakt:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Kojení ani batolecí věk nejsou překážkou přespávání. Fabricius (2016) dokázal, že přespávání od narození (pod 1 rok) přináší silné dlouhodobé výhody pro vztahy s oběma rodiči a vztah s matkou nijak netrpí.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-3">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Mýtus o jediné matce</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "Malé dítě je biologicky nastaveno tak, že má mít pouze jednoho primárního pečovatele (matku) a delší separace ho poškozuje."
                </p>
                <div className="border-t border-slate-50 pt-3 text-xs text-teal-700 font-semibold space-y-1">
                  <span className="text-[10px] font-mono text-teal-600 uppercase block font-bold">Vědecký fakt:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Teorie monotropie byla vědecky vyvrácena. Děti si vytvářejí paralelní, stejně hluboké citové vazby k matce i k otci současně. Omezení styku s otcem na pouhé dny bez přespávání rodící se vazbu k otci naopak trvale devastuje (Warshak, 2014).
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-3">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Mýtus o nutné dohodě</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "Střídavá péče vyžaduje naprostý soulad a dohodu rodičů. Pokud se rodiče hádají nebo matka střídavku odmítá, není možná."
                </p>
                <div className="border-t border-slate-50 pt-3 text-xs text-teal-700 font-semibold space-y-1">
                  <span className="text-[10px] font-mono text-teal-600 uppercase block font-bold">Vědecký fakt:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Soudem nařízená střídavá péče má prokazatelné přínosy i tam, kde rodiče zpočátku nesouhlasili nebo panoval vysoký konflikt. Odepření střídavé péče kvůli konfliktu naopak motivuje matky k záměrnému udržování sporu (Warshak, 2014).
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'methodologies' && (
        /* METHODOLOGIES & DEFENSE TAB */
        <div className="space-y-8 animate-fadeIn animate-duration-300">
          
          {/* Section Header Card */}
          <div className="bg-slate-900 text-slate-100 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12 select-none">
              <Scale className="w-96 h-96 text-amber-500" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                  Procesní obrana otce
                </span>
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
                Jak se bránit zastaralým posudkům a předsudkům OSPODu
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                Opatrovnické soudy a OSPOD se v České republice často opírají o zastaralé znalecké posudky nebo metodiky, které neodpovídají moderní vývojové psychologii ani závazné judikatuře Ústavního soudu ČR. Namísto pokusů o paušální "zákazy" institucí je nejúčinnější cestou <strong>aktivní, věcné a procesní napadání nekompetentních tvrzení, dogmat a metodických pochybení</strong> přímo v soudním řízení.
              </p>
            </div>
          </div>

          {/* Interactive Dogma & Blacklist Analyzer */}
          <div className="space-y-4">
            <h3 className="text-md font-bold font-display text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Blacklist opatrovnických dogmat & Vědecká diskreditace
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              Níže uvádíme nejčastější manipulativní argumenty, které sociální pracovnice a zastaralí znalci používají k omezení práv otců a dětí. Klikněte na konkrétní dogma a získáte okamžité vědecké vyvrácení i přesnou právní argumentaci k použití u soudu.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              
              {/* Sibling bond split */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Závažné pochybení</span>
                    <span className="text-[10px] text-slate-400">Judikatura ÚS</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Dogma: Rozdělení sourozenců nebo asymetrická péče</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50/50 p-2 rounded">
                    "Mladší kojenec/batole musí být z důvodu věku převážně u matky, zatímco starší sourozenec má střídavou péči. Rozdílný režim sourozencům nevadí."
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    <strong>Vědecká a právní diskreditace:</strong> Rozdělování sourozenců nebo vytváření asymetrického režimu, kdy se bratři potkávají jen minimálně, hrubě poškozuje jejich základní psychologické potřeby a právo na rodinný život. Ústavní soud ČR (nález sp. zn. II. ÚS 1762/20 a II. ÚS 2146/21) jasně definuje, že sourozenecká vazba je integrální součástí práva na rodinný život a její svévolné narušení ze strany OSPOD či soudů prvního stupně je neústavní.
                  </p>
                </div>
                <div className="bg-teal-50/30 border border-teal-100/50 p-3 rounded-xl mt-3 text-[10.5px] text-teal-900 leading-relaxed">
                  <strong className="text-teal-900 font-mono text-[9px] block uppercase font-bold tracking-wider mb-1">Právní formulace pro podání:</strong>
                  <p className="italic font-serif text-[10.5px]">
                    "Soud prvního stupně zcela pominul existenci staršího sourozence a navrhl rozvrh, který bratry od sebe stoprocentně a permanentně izoluje. Rozhodnutím soudu dochází k umělému a úplnému separování obou bratrů, což je v přímém rozporu s konstantní judikaturou Ústavního soudu ČR (nález sp. zn. II. ÚS 2146/21), která stanovuje, že právo na rozvoj sourozeneckých vazeb je integrální součástí nejlepšího zájmu dětí a práva na rodinný život."
                  </p>
                </div>
              </div>

              {/* Age overnight restriction */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Metodický předsudek</span>
                    <span className="text-[10px] text-slate-400">Warshak & Fabricius</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Dogma: Omezení přespávání (overnights) dětí pod 3 roky</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50/50 p-2 rounded">
                    "Dítě pod 3 roky věku (nebo dokonce pod 1 rok) je příliš malé na to, aby přespávalo u otce. Nocování u otce poškozuje vazbu na matku."
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    <strong>Vědecká a právní diskreditace:</strong> Mezinárodní vědecký konsenzus (reprezentovaný zprávou prof. Warshaka podepsanou 110 světovými experty a 20letou retrospektivní studií prof. Fabriciuse) jednoznačně dokázal, že přespávání u otců od útlého věku (včetně dětí pod 1 rok) je pro rozvoj otcovského pouta klíčové a nijak nepoškozuje vazbu k matce. Odkládání nocování naopak způsobuje v psychice dětí nevratný deficit, který se projevuje oslabením vztahů v dospělosti.
                  </p>
                </div>
                <div className="bg-teal-50/30 border border-teal-100/50 p-3 rounded-xl mt-3 text-[10.5px] text-teal-900 leading-relaxed">
                  <strong className="text-teal-900 font-mono text-[9px] block uppercase font-bold tracking-wider mb-1">Právní formulace pro podání:</strong>
                  <p className="italic font-serif text-[10.5px]">
                    "Odepření přespávání nezletilého u otce s paušálním odkazem na nízký věk dítěte a nutnost neustálé přítomnosti matky je vědecky neudržitelným předsudkem, který odporuje mezinárodnímu vědeckému konsenzu (Warshak, 2014) i empirickým datům (Fabricius, 2016). Tyto studie jednoznačně prokazují, že noční péče otce (večerní a ranní rituály) je pro budování bezpečné citové vazby (attachmentu) klíčová a přináší dítěti dlouhodobé emocionální benefity bez jakéhokoliv ohrožení vztahu s matkou."
                  </p>
                </div>
              </div>

              {/* No overnights in conflict */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Manipulace konfliktem</span>
                    <span className="text-[10px] text-slate-400">Ústavní soud sp. zn. I. ÚS 1554/14</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Dogma: Střídavá péče není možná při konfliktu rodičů</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50/50 p-2 rounded">
                    "Rodiče nejsou schopni se dohodnout, panuje mezi nimi silný konflikt, matka střídavou péči zásadně odmítá, proto střídavka není možná."
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    <strong>Vědecká a právní diskreditace:</strong> Odepření střídavé péče s odkazem na konflikt rodičů motivuje nespolupracujícího rodiče (nejčastěji matku) k záměrnému udržování a eskalaci napětí, protože tím získává "veto" nad střídavou péčí. Ústavní soud ČR v řadě nálezů (např. sp. zn. I. ÚS 1554/14, I. ÚS 2482/18) výslovně zdůrazňuje, že nesouhlas jednoho z rodičů nemůže střídavou péči bez dalšího vyloučit. Pokud rodič střídavou péči odmítá, musí soud zkoumat, zda nejde o svévolné maření ze strany jednoho rodiče.
                  </p>
                </div>
                <div className="bg-teal-50/30 border border-teal-100/50 p-3 rounded-xl mt-3 text-[10.5px] text-teal-900 leading-relaxed">
                  <strong className="text-teal-900 font-mono text-[9px] block uppercase font-bold tracking-wider mb-1">Právní formulace pro podání:</strong>
                  <p className="italic font-serif text-[10.5px]">
                    "Odmítání střídavé péče ze strany matky a poukazování na neexistující dohodu či konflikt rodičů nemůže být důvodem k omezení práv otce a dítěte. Podle konstantní judikatury Ústavního soudu ČR (např. nález sp. zn. I. ÚS 1554/14) nesmí soudy střídavou péči vyloučit pouze na základě nesouhlasu matky, neboť by tím byl vytvořen nepřípustný precedent, kdy jednostranná obstrukce a neochota komunikovat ze strany jednoho rodiče vede k faktickému vyloučení rodiče druhého z výchovy."
                  </p>
                </div>
              </div>

              {/* Manipulation through illness */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Zneužití nemoci</span>
                    <span className="text-[10px] text-slate-400">Ustanovení § 890 OZ</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Dogma: Nemocné dítě musí zůstat výhradně u matky</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50/50 p-2 rounded">
                    "Dítě má rýmu / neštovice / horečku, proto se styk s otcem ruší a dítě se nikam nepřepravuje. Otec nemá právo na péči, dokud se dítě neuzdraví."
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    <strong>Vědecká a právní diskreditace:</strong> Nemoc dítěte nesmí sloužit jako záminka k maření péče a izolaci dítěte od otce. Oba rodiče mají stejné právo i povinnost o nemocné dítě pečovat. Pokud styk vyžaduje transport, který by dítěti škodil, má se aktivovat pravidlo rekonvalescence v místě, kde nemoc propukla, případně má otec vykonat péči přímo u matky (či naopak) tak, aby se zachoval kontakt a minimalizoval se transport. Maření kontaktu z důvodu nemoci bez nabídky náhradního řešení či přístupu otce k dítěti je v přímém rozporu s § 890 občanského zákoníku.
                  </p>
                </div>
                <div className="bg-teal-50/30 border border-teal-100/50 p-3 rounded-xl mt-3 text-[10.5px] text-teal-900 leading-relaxed">
                  <strong className="text-teal-900 font-mono text-[9px] block uppercase font-bold tracking-wider mb-1">Právní formulace pro podání:</strong>
                  <p className="italic font-serif text-[10.5px]">
                    "Matka jednostranným zmařením dohodnuté péče z důvodu nemoci syna a odmítnutím mého vstupu do bydliště k osobní péči o nemocné dítě hrubě porušila ustanovení § 890 občanského zákoníku, které oběma rodičům ukládá vzájemnou informační povinnost a součinnost. Nemoc syna nemůže sloužit jako mocenský nástroj k jeho izolaci od otce, který disponuje plnou výchovnou a ošetřovatelskou způsobilostí a je schopen synovi zajistit adekvátní klidový režim i lékařskou péči."
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Practical steps for judicial disqualification */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold font-display text-slate-800 flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-teal-600" />
              Procesní kroky k diskvalifikaci zastaralých znaleckých posudků
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">KROK 1</span>
                <h4 className="text-xs font-bold text-slate-800">Revizní znalecký posudek</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pokud je posudek místního znalce zjevně jednostranný, plný genderových předsudků či ignoruje sourozenecké vazby, navrhněte vypracování <strong>revizního znaleckého posudku</strong> nezávislým znalcem z jiného kraje (např. znaleckým ústavem či univerzitním pracovištěm).
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">KROK 2</span>
                <h4 className="text-xs font-bold text-slate-800">Námitka podjatosti vůči znalci</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pokud znalec při vyšetření nebo ve svém posudku bagatelizuje roli otce, pronáší diskriminační výroky o "matce jako hlavní biologické osobě" nebo odmítá zkoumat vaše výchovné zázemí, ihned v zákonné lhůtě vzneste <strong>námitku podjatosti znalce</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">KROK 3</span>
                <h4 className="text-xs font-bold text-slate-800">Kritika metodiky a testování</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Zkoumejte, jaké konkrétní testy znalec použil. Zastaralí znalci často používají šablonovité psychologické testy staré 20 a více let, které nereflektují moderní vědu. V písemném vyjádření metodiku metodologicky napadněte s odkazem na nejnovější standardy.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">KROK 4</span>
                <h4 className="text-xs font-bold text-slate-800">Stížnost k Ministerstvu spravedlnosti</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pokud se znalec dopustil závažného pochybení (např. lživá tvrzení, hrubá manipulace s daty či vynechání zásadních informací z dokumentace), podejte podrobný podnět a stížnost přímo k <strong>Ministerstvu spravedlnosti ČR</strong>, které dohlíží na činnost soudních znalců.
                </p>
              </div>
            </div>
          </div>

          {/* Constitutional Court Summary Info */}
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex gap-4">
            <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-900 text-xs font-display">Základní rada pro komunikaci u soudu: Věcnost namísto emocí</h4>
              <p className="text-amber-800 text-xs leading-relaxed">
                Nekritizujte znalce či sociální pracovnice OSPOD na osobní rovině. Vždy poukazujte na <strong>věcná a metodická pochybení</strong> v jejich zprávách. Ukažte rozpor mezi jejich tvrzeními a doloženými vědeckými studiemi (Warshak, Fabricius) či judikáty Ústavního soudu. Soudce musí slyšet právní a věcnou argumentaci, nikoliv emoce naštvaného rodiče. Tímto přístupem se stanete pro opatrovnickou mašinérii procesně mimořádně nebezpečným a respektovaným partnerem.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
