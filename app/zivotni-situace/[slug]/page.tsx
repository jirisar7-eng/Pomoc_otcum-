import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { 
  Wallet, 
  Brain, 
  Heart, 
  Shield, 
  Home, 
  HeartHandshake, 
  ArrowLeft,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { situaceData } from '@/lib/data/situace';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wallet,
  Brain,
  Heart,
  Shield,
  Home,
  HeartHandshake
};

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ZivotniSituaceDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const rawSlug = resolvedParams?.slug;

  const aliasMap: Record<string, string> = {
    'sjm': 'sjm',
    'majetek-sjm': 'sjm',
    'psychika': 'psychicka-podpora',
    'psychicka-podpora': 'psychicka-podpora',
    'deti': 'jak-mluvit-s-ditetem',
    'jak-mluvit-s-ditetem': 'jak-mluvit-s-ditetem',
    'rozhovor-dite': 'jak-mluvit-s-ditetem',
    'obrana-pas': 'pas',
    'pas': 'pas',
    'ochrana-manipulace': 'pas',
    'bydleni-ospod': 'novy-domov-ospod',
    'novy-domov-ospod': 'novy-domov-ospod',
    'bydleni-zazemi': 'novy-domov-ospod',
    'mediace': 'mediace',
    'rodinna-mediace': 'mediace',
  };

  const targetSlug = aliasMap[rawSlug] || rawSlug;
  const situace = situaceData.find((s) => s.slug === targetSlug || s.slug === rawSlug);

  if (!situace) {
    return notFound();
  }

  const IconComponent = iconMap[situace.icon] || BookOpen;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* BACK BUTTON */}
      <div>
        <Link 
          href="/zivotni-situace" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all shadow-2xs group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700 transition-transform group-hover:-translate-x-1" />
          Zpět na přehled situací
        </Link>
      </div>

      {/* HEADER - DARK BACKGROUND (bg-slate-900) WITH ICON & TITLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-lg">
            <IconComponent className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider rounded-full mb-2">
              Sekce: {situace.slug}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {situace.title}
            </h1>
          </div>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl relative z-10 pt-2 border-t border-slate-800">
          {situace.description}
        </p>
      </div>

      {/* DETAIL CONTENT (CONTENT ARTICLE) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="markdown-body text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
          <ReactMarkdown>{situace.content}</ReactMarkdown>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ověřená právní a praktická metodika portálu Táta má právo</span>
          </div>

          <Link 
            href="/zivotni-situace" 
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold rounded-xl text-xs text-center transition-colors shadow-xs cursor-pointer"
          >
            ← Zpět na přehled situací
          </Link>
        </div>
      </div>

    </div>
  );
}
