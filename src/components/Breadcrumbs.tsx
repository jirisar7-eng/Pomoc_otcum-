import React from 'react';
import { Home, ChevronRight, Layers } from 'lucide-react';
import { SEO_CONFIGS } from '../lib/seo';
import { HUB_CATEGORIES } from '../data/contentHub';

interface BreadcrumbsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Breadcrumbs({ activeTab, setActiveTab }: BreadcrumbsProps) {
  if (activeTab === 'home') return null;

  let config = SEO_CONFIGS[activeTab];

  if (activeTab.startsWith('category-')) {
    const slug = activeTab.replace('category-', '');
    const cat = HUB_CATEGORIES.find(c => c.slug === slug || c.id === slug);
    config = {
      title: cat ? `${cat.name} | Táta má právo` : 'Detail kategorie',
      h1: cat ? `${cat.icon} ${cat.name}` : 'Detail kategorie',
      category: 'Odborné okruhy',
      parentLabel: 'Odborná témata & Okruhy',
      description: cat?.description || '',
      keywords: cat?.slug || '',
      canonicalPath: `/kategorie/${slug}`
    };
  } else if (!config) {
    config = {
      title: activeTab,
      h1: activeTab,
      category: 'Sekce',
      parentLabel: 'Informační část',
      description: '',
      keywords: '',
      canonicalPath: `/${activeTab}`
    };
  }

  return (
    <nav 
      aria-label="Drobečková navigace (Breadcrumbs)"
      className="bg-slate-50/80 border-b border-slate-100 py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 font-sans"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-1.5 font-medium">
        {/* Home Link */}
        <button
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center gap-1 hover:text-teal-700 transition-colors cursor-pointer text-slate-600 font-semibold"
          title="Návrat na hlavní stranu"
        >
          <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Domů</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        {/* Parent Category */}
        {config.parentLabel && (
          <>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Layers className="w-3 h-3 text-slate-400" />
              <span>{config.parentLabel}</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          </>
        )}

        {/* Current Active Page */}
        <span 
          className="font-bold text-teal-800 bg-teal-50/80 px-2 py-0.5 rounded-md border border-teal-100/60 truncate max-w-[280px] sm:max-w-none"
          aria-current="page"
        >
          {config.h1}
        </span>
      </div>
    </nav>
  );
}
