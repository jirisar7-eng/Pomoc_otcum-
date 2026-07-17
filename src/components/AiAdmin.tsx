/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, Eye, RefreshCw, 
  Settings, ArrowRight, Play, Check, Trash2, Link2, FileText, Lock, 
  Briefcase, CheckSquare, Clock, Plus, BarChart3, Database, Calendar, Users
} from 'lucide-react';
import { HUB_ARTICLES, HUB_GLOSSARY, HUB_JUDGMENTS, HUB_STUDIES, HUB_TEMPLATES } from '../data/contentHub';

interface AuditIssue {
  id: string;
  title: string;
  type: 'duplicate' | 'link' | 'outdated' | 'seo' | 'alt' | 'gdpr' | 'legislation';
  severity: 'high' | 'medium' | 'low';
  desc: string;
  targetUrl: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
}

export default function AiAdmin() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState('');
  const [issues, setIssues] = useState<AuditIssue[]>([
    {
      id: 'iss-1',
      title: 'Duplicitní definice střídavé péče u batolat',
      type: 'duplicate',
      severity: 'high',
      desc: 'Obsah článku o věku dětí do 3 let se překrývá s textem v obecném průvodci a FAQ.',
      targetUrl: '/pece-o-dite/batolata',
      status: 'backlog'
    },
    {
      id: 'iss-2',
      title: 'Chybí interní odkaz na termín "Attachment"',
      type: 'link',
      severity: 'medium',
      desc: 'Článek "Střídavá péče u dětí do tří let" zmiňuje attachment pětkrát, ale chybí odkaz do Slovníku.',
      targetUrl: '/slovnik/attachment',
      status: 'in_progress'
    },
    {
      id: 'iss-3',
      title: 'Zastaralá metodika OSPOD v článku z roku 2024',
      type: 'outdated',
      severity: 'high',
      desc: 'Zákonná metodika Ministerstva práce byla v lednu 2026 aktualizována. Článek vykazuje anachronismy.',
      targetUrl: '/ospod/prava-otce',
      status: 'backlog'
    },
    {
      id: 'iss-4',
      title: 'Chybějící obrázkový ALT tag v sekci Soudy',
      type: 'alt',
      severity: 'low',
      desc: 'Ilustrační infografika soudní budovy nemá nastavený textový popis pro nevidomé.',
      targetUrl: '/soudni-rizeni',
      status: 'review'
    },
    {
      id: 'iss-5',
      title: 'GDPR shoda: Možný únik osobních údajů v komentářích',
      type: 'gdpr',
      severity: 'high',
      desc: 'Uživatel "TomasN" v diskuzi sdílel celé rodné číslo kolizní opatrovnice. Nutný okamžitý anonymizační zásah.',
      targetUrl: '/forum/stiznost-ospod',
      status: 'backlog'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'jira' | 'duplicity' | 'links' | 'logs'>('jira');
  const [searchQuery, setSearchQuery] = useState('');
  const [automaticSchedule, setAutomaticSchedule] = useState(true);

  // Run dynamic site-wide audit
  const runFullAudit = () => {
    setIsAuditing(true);
    setAuditMessage('Kontroluji souborový systém a databázi...');
    
    setTimeout(() => {
      setAuditMessage('Detekuji duplicity a sémantický překryv v Content Hubu...');
      setTimeout(() => {
        setAuditMessage('Prověřuji interní odkazy a chybějící meta tagy...');
        setTimeout(() => {
          setAuditMessage('Dokončeno! Nalezeny 2 nové podněty k optimalizaci.');
          
          const newIssues: AuditIssue[] = [
            {
              id: `iss-new-${Date.now()}`,
              title: 'Sémantický překryv: Judikát I. ÚS 1506/21',
              type: 'duplicate',
              severity: 'medium',
              desc: 'Rozsudek je popsán duplicitně v sekci Judikatura i v Knihovně studií. Doporučeno sloučit a volat přes SSOT.',
              targetUrl: '/judikatura',
              status: 'backlog'
            },
            {
              id: `iss-new-2-${Date.now()}`,
              title: 'Legislativní změna: Valorizace výživného',
              type: 'legislation',
              severity: 'high',
              desc: 'Nový návrh MPSV mění tabulky doporučeného výživného pro rok 2026. Je nutné aktualizovat kalkulačku.',
              targetUrl: '/vyzivne',
              status: 'backlog'
            }
          ];

          setIssues(prev => [...newIssues, ...prev]);
          setIsAuditing(false);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const updateIssueStatus = (id: string, newStatus: AuditIssue['status']) => {
    setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, status: newStatus } : issue));
  };

  const removeIssue = (id: string) => {
    setIssues(prev => prev.filter(issue => issue.id !== id));
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'high':
        return <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md uppercase font-mono">CRITICAL</span>;
      case 'medium':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md uppercase font-mono">WARNING</span>;
      default:
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md uppercase font-mono font-sans">INFO</span>;
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'duplicate':
        return <FileText className="w-4 h-4 text-rose-500" />;
      case 'link':
        return <Link2 className="w-4 h-4 text-emerald-500" />;
      case 'gdpr':
        return <Lock className="w-4 h-4 text-red-600 font-bold" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="ai-administrator-workspace">
      
      {/* Title Header with Modern Gradient */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Synthesis OS Core
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight leading-none">
              Autonomní AI Administrátor
            </h2>
            <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
              Samočinná kontrolní stanice a sémantický dohled nad celým portálem. AI každé ráno v <strong>08:00</strong> skenuje duplicity, navrhuje interní odkazy, testuje shodu s GDPR a hlídá legislativní změny.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 font-mono text-[11px] text-slate-300">
            <div className="flex justify-between gap-6">
              <span>Automatický audit 08:00:</span>
              <button 
                onClick={() => setAutomaticSchedule(!automaticSchedule)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${automaticSchedule ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}
              >
                {automaticSchedule ? 'AKTIVNÍ' : 'VYPNUTO'}
              </button>
            </div>
            <div className="flex justify-between gap-6">
              <span>Poslední sweep:</span>
              <span className="text-teal-400 font-bold">Dnes v 08:00:14</span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Prvků v Content Hubu:</span>
              <span className="text-indigo-400 font-bold">
                {HUB_ARTICLES.length + HUB_GLOSSARY.length + HUB_JUDGMENTS.length + HUB_STUDIES.length + HUB_TEMPLATES.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Progress Bar / Action Trigger */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider font-mono">
            Ruční hloubkový audit celého portálu
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Spustí okamžitou sémantickou analýzu všech článků, judikátů, studií a slovníkových termínů z databáze.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isAuditing && (
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 animate-pulse bg-indigo-50 px-3 py-1.5 rounded-xl">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{auditMessage}</span>
            </div>
          )}
          
          <button
            onClick={runFullAudit}
            disabled={isAuditing}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Spustit hluboký sken
          </button>
        </div>
      </div>

      {/* Navigation tabs for Admin Tools */}
      <div className="flex border-b border-slate-100 gap-1.5">
        {[
          { id: 'jira', label: 'Jira Kanban Board', icon: CheckSquare },
          { id: 'duplicity', label: 'Detektor duplicit (SSOT)', icon: Database },
          { id: 'links', label: 'Interní Propojení & SEO', icon: Link2 },
          { id: 'logs', label: 'GDPR & Legislativní Deník', icon: ShieldAlert },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === t.id
                ? 'border-indigo-600 text-indigo-800 bg-indigo-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: KANBAN BOARD */}
        {activeTab === 'jira' && (
          <motion.div 
            key="jira"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {/* Columns: Backlog, In Progress, Review, Done */}
            {([
              { status: 'backlog', label: 'Nové / Backlog', color: 'bg-slate-100 border-slate-200 text-slate-700' },
              { status: 'in_progress', label: 'V řešení (AI Admin)', color: 'bg-blue-50 border-blue-100 text-blue-800' },
              { status: 'review', label: 'Ke schválení', color: 'bg-amber-50 border-amber-100 text-amber-800' },
              { status: 'done', label: 'Vyřešeno', color: 'bg-emerald-50 border-emerald-100 text-emerald-800' }
            ] as const).map(col => {
              const colIssues = issues.filter(i => i.status === col.status);
              return (
                <div key={col.status} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col min-h-[450px]">
                  <div className={`px-3 py-1.5 rounded-xl border ${col.color} text-xs font-bold flex justify-between items-center mb-3`}>
                    <span>{col.label}</span>
                    <span className="font-mono text-[10px] bg-white/65 px-1.5 py-0.5 rounded">{colIssues.length}</span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colIssues.length > 0 ? (
                      colIssues.map(issue => (
                        <div key={issue.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs space-y-3 text-left">
                          <div className="flex justify-between items-start gap-2">
                            {getIssueIcon(issue.type)}
                            {getSeverityBadge(issue.severity)}
                          </div>
                          
                          <h5 className="font-bold text-xs text-slate-800 leading-snug">
                            {issue.title}
                          </h5>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            {issue.desc}
                          </p>
                          <div className="text-[9px] font-mono text-indigo-600 bg-indigo-50/30 p-1 rounded truncate">
                            URL: {issue.targetUrl}
                          </div>

                          {/* Action footer */}
                          <div className="flex justify-between items-center pt-2 border-t border-slate-50 gap-1">
                            <button
                              onClick={() => removeIssue(issue.id)}
                              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Odstranit úkol"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            
                            <div className="flex gap-1">
                              {col.status !== 'done' && (
                                <button
                                  onClick={() => {
                                    const nextStatusMap: Record<string, AuditIssue['status']> = {
                                      'backlog': 'in_progress',
                                      'in_progress': 'review',
                                      'review': 'done'
                                    };
                                    updateIssueStatus(issue.id, nextStatusMap[col.status]);
                                  }}
                                  className="px-2 py-1 bg-indigo-600 text-white font-bold text-[9px] rounded flex items-center gap-1 hover:bg-indigo-700 transition-colors"
                                >
                                  Posunout <ArrowRight className="w-2.5 h-2.5" />
                                </button>
                              )}
                              {col.status === 'done' && (
                                <span className="text-emerald-600 font-bold text-[9px] flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Hotovo
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full border border-dashed border-slate-200 rounded-xl flex items-center justify-center p-4 text-center">
                        <span className="text-[10px] text-slate-400 font-medium">Žádné úkoly v tomto sloupci</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* TAB 2: DETEKTOR DUPLICIT */}
        {activeTab === 'duplicity' && (
          <motion.div 
            key="duplicity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800">
                Sémantický vyhledávač duplicit v datovém modelu SSOT
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tento nástroj porovnává obsah a klíčová slova napříč celým datovým modelem. Pokud zjistí, že se stejná vědecká studie, judikát nebo odstavec vyskytuje na více místech, navrhne okamžité sjednocení pod jeden ID z Content Hubu s odkazem na hlavní zdroj.
              </p>

              <div className="border border-slate-100 rounded-xl overflow-hidden font-mono text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 border-b border-slate-100">
                      <th className="p-3">Porovnávané zdroje</th>
                      <th className="p-3">Duplicitní obsah / Téma</th>
                      <th className="p-3">Míra shody</th>
                      <th className="p-3">Hlavní zdroj (SSOT)</th>
                      <th className="p-3 text-right">Akce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-sans">
                        <div className="font-bold text-slate-800">Článek "Střídavá péče do 3 let"</div>
                        <div className="text-[10px] text-slate-400">vs. Popis studie Warshak (2014)</div>
                      </td>
                      <td className="p-3 font-sans">
                        <div className="text-slate-600">Attachment kojenců k otci, přespávání přes noc</div>
                      </td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 font-bold rounded">94% (Sémantická)</span>
                      </td>
                      <td className="p-3 font-sans text-indigo-600 font-bold">
                        Studie ID: std-2
                      </td>
                      <td className="p-3 text-right">
                        <button className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg cursor-pointer transition-all">
                          Sjednotit přes SSOT
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans">
                        <div className="font-bold text-slate-800">Sekce Judikatura</div>
                        <div className="text-[10px] text-slate-400">vs. Odkaz v Článku "Jak čelit manipulaci"</div>
                      </td>
                      <td className="p-3 font-sans">
                        <div className="text-slate-600">Nález o iracionálním nesouhlasu matky</div>
                      </td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 font-bold rounded">81% (Meta-shoda)</span>
                      </td>
                      <td className="p-3 font-sans text-indigo-600 font-bold">
                        Judikát ID: jud-3
                      </td>
                      <td className="p-3 text-right">
                        <button className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg cursor-pointer transition-all">
                          Sjednotit přes SSOT
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: INTERNAL LINKS */}
        {activeTab === 'links' && (
          <motion.div 
            key="links"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800">
                Návrhy na vnitřní propojení témat (Sémantická síť)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Níže uvedený algoritmus automaticky analyzuje slova v textu a hledá pojmy obsažené ve slovníku nebo rozsudky v judikatuře. Navrhuje vytvořit hypertextový odkaz, který uživateli umožní otevřít detailní vysvětlení (např. přes Slovníkový Drawer) přímo během čtení článku.
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase">Navrhovaný odkaz: Slovník</span>
                    <h4 className="font-bold text-xs text-slate-800">Vytvořit odkaz na "Kolizní opatrovník (OSPOD)" v článku "Práva otce při šetření OSPOD"</h4>
                    <p className="text-[10px] text-slate-500">
                      Slovo "kolizní opatrovník" se v textu objevuje 3x bez propojení do slovníku.
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-3xs transition-all">
                    Schválit & Propojit
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase">Navrhovaný odkaz: Judikatura</span>
                    <h4 className="font-bold text-xs text-slate-800">Vytvořit odkaz na judikát "I. ÚS 1506/21" v článku "Střídavá péče u dětí do tří let"</h4>
                    <p className="text-[10px] text-slate-500">
                      V odstavci o kojencích je zmíněn nález o batolatech, ale chybí prolinkování do Judikatury.
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-3xs transition-all">
                    Schválit & Propojit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: GDPR & LEGISLATION LOGS */}
        {activeTab === 'logs' && (
          <motion.div 
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800">
                Bezpečnostní audit GDPR & Sledování legislativních změn
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                AI strážce skenuje diskuzní fóra na možný výskyt neoprávněného sdílení jmen sociálních pracovnic, rodných čísel, adres nebo osobních údajů třetích osob, které porušují GDPR. Zároveň kontroluje Sbírku zákonů na novely Zákona o rodině.
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold text-rose-700 uppercase">DETEKOVÁN MOŽNÝ ÚNIK OSOBNÍCH ÚDAJŮ (GDPR)</span>
                    <span className="text-[10px] font-mono text-rose-500">Dnes, 08:04</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-850">Komentář s rodným číslem na Diskuzi</h4>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    Uživatel v sekci Stížnost na OSPOD vložil text obsahující řetězec vyhodnocený jako rodné číslo a soukromé jméno úřednice. Příspěvek byl automaticky dočasně skryt do schválení administrátorem.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg cursor-pointer">
                      Anonymizovat a publikovat
                    </button>
                    <button className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] rounded-lg cursor-pointer">
                      Ponechat skryté
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold text-blue-700 uppercase">LEGISLATIVNÍ ZPRÁVA</span>
                    <span className="text-[10px] font-mono text-blue-500">Dnes, 08:00</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-850">Změna v doporučených tabulkách výživného</h4>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    Byl vydán nový metodický pokyn Ministerstva spravedlnosti pro výpočet výživného. Tabulka "Doporučená výše výživného" na stránce Výživné vyžaduje drobnou korekci věkových kategorií a procentuálního podílu z čistého příjmu.
                  </p>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg cursor-pointer">
                    Přejít na kalkulačku výživného
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
