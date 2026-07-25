/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ELEMENT REGISTRY TABLE - Admin view for managing and identifying unique IDs,
 * pages, 21 categories, articles, tools, and anchor links across "Táta má právo".
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Filter, 
  Database, 
  FileCode, 
  Layers, 
  Download, 
  Sparkles,
  Bookmark,
  CheckCircle2,
  Folder,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { 
  ALL_REGISTERED_ELEMENTS, 
  filterRegisteredElements, 
  RegisteredElement, 
  ElementType,
  copyToClipboardHelper
} from '../lib/elementRegistry';
import { HUB_CATEGORIES } from '../data/contentHub';
import { navigateToTabAndAnchor } from '../lib/navigation';

interface ElementRegistryTableProps {
  onNavigateToElement?: (tab: string, anchor?: string | null) => void;
}

export const ElementRegistryTable: React.FC<ElementRegistryTableProps> = ({ onNavigateToElement }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);

  // Filtered elements list
  const filteredElements = useMemo(() => {
    return filterRegisteredElements(ALL_REGISTERED_ELEMENTS, searchQuery, selectedType, selectedCategory);
  }, [searchQuery, selectedType, selectedCategory]);

  // Statistics
  const stats = useMemo(() => {
    const total = ALL_REGISTERED_ELEMENTS.length;
    const pages = ALL_REGISTERED_ELEMENTS.filter(e => e.type === 'page').length;
    const categories = ALL_REGISTERED_ELEMENTS.filter(e => e.type === 'category').length;
    const articles = ALL_REGISTERED_ELEMENTS.filter(e => e.type === 'article').length;
    const tools = ALL_REGISTERED_ELEMENTS.filter(e => e.type === 'tool').length;
    const sections = ALL_REGISTERED_ELEMENTS.filter(e => e.type === 'section').length;
    return { total, pages, categories, articles, tools, sections };
  }, []);

  const handleCopy = async (text: string, id: string, label: string) => {
    const ok = await copyToClipboardHelper(text);
    if (ok) {
      setCopiedId(id);
      setCopiedMessage(`${label} zkopírován!`);
      setTimeout(() => {
        setCopiedId(null);
        setCopiedMessage(null);
      }, 2000);
    }
  };

  const handleNavigate = (elem: RegisteredElement) => {
    if (onNavigateToElement) {
      onNavigateToElement(elem.routePath, elem.anchorHash);
    } else {
      navigateToTabAndAnchor(elem.routePath, elem.anchorHash);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ALL_REGISTERED_ELEMENTS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tata-ma-pravo-id-registry-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getTypeBadge = (type: ElementType) => {
    switch (type) {
      case 'page':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Stránka</span>;
      case 'category':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Kategorie (21)</span>;
      case 'article':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Článek</span>;
      case 'tool':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Interaktivní Nástroj</span>;
      case 'section':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">Kotva / Sekce</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Prvek</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & SUMMARY BAR */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-3xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600" />
              Administrační Registr Unikátních ID & Odkazů
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Jednoznačná identifikace pro 21 kategorií, články, interaktivní kalkulačky, šablony a kotvy pro administraci a prolinkování.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Exportovat ID Registr (JSON)
            </button>
          </div>
        </div>

        {/* QUICK STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-xs text-slate-500 font-medium block">Celkem prvků</span>
            <span className="text-lg font-bold font-display text-slate-900">{stats.total}</span>
          </div>
          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl text-center">
            <span className="text-xs text-blue-700 font-medium block">Stránek</span>
            <span className="text-lg font-bold font-display text-blue-900">{stats.pages}</span>
          </div>
          <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-center">
            <span className="text-xs text-emerald-700 font-medium block">Kategorií</span>
            <span className="text-lg font-bold font-display text-emerald-900">{stats.categories}</span>
          </div>
          <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl text-center">
            <span className="text-xs text-purple-700 font-medium block">Článků</span>
            <span className="text-lg font-bold font-display text-purple-900">{stats.articles}</span>
          </div>
          <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-center">
            <span className="text-xs text-amber-700 font-medium block">Nástrojů</span>
            <span className="text-lg font-bold font-display text-amber-900">{stats.tools}</span>
          </div>
          <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-xl text-center">
            <span className="text-xs text-teal-700 font-medium block">Sekcí / Kotev</span>
            <span className="text-lg font-bold font-display text-teal-900">{stats.sections}</span>
          </div>
        </div>

        {/* FILTERS AND SEARCH */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Vyhledat ID, název, tag nebo adresu URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Všechny typy prvků</option>
              <option value="page">Stránky</option>
              <option value="category">Kategorie (21)</option>
              <option value="article">Články</option>
              <option value="tool">Interaktivní nástroje</option>
              <option value="section">Sekce / Kotvy</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 max-w-[200px]"
            >
              <option value="all">Všechny kategorie</option>
              {HUB_CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* FEEDBACK TOAST */}
        {copiedMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {copiedMessage}
          </div>
        )}
      </div>

      {/* TABLE DATA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Unikátní ID Prvku</th>
                <th className="py-3 px-4">Typ</th>
                <th className="py-3 px-4">Název / Popis Prvku</th>
                <th className="py-3 px-4">Cílová cesta / URL Hash</th>
                <th className="py-3 px-4 text-right">Rychlé akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredElements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    Žádný prvek neodpovídá zadanému vyhledávání.
                  </td>
                </tr>
              ) : (
                filteredElements.map((elem) => (
                  <tr key={elem.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 rounded-md px-2 py-1 w-max">
                        <span>{elem.id}</span>
                        <button
                          onClick={() => handleCopy(elem.id, elem.id, 'ID prvku')}
                          className="text-slate-400 hover:text-teal-700 cursor-pointer p-0.5 rounded"
                          title="Kopírovat ID"
                        >
                          {copiedId === elem.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="py-3 px-4">
                      {getTypeBadge(elem.type)}
                    </td>

                    {/* NAME & DESC */}
                    <td className="py-3 px-4 max-w-sm">
                      <strong className="font-bold text-slate-900 block text-xs">{elem.name}</strong>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{elem.description}</span>
                    </td>

                    {/* PATH & URL */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-800">
                          {elem.fullUrl}
                        </span>
                        <button
                          onClick={() => handleCopy(elem.fullUrl, `${elem.id}-url`, 'Odkaz URL')}
                          className="text-slate-400 hover:text-teal-700 cursor-pointer"
                          title="Kopírovat plnou URL adresu"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleNavigate(elem)}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Otevřít v aplikaci
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ElementRegistryTable;
