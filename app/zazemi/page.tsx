'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  Brain, 
  Heart, 
  Shield, 
  Home, 
  HeartHandshake, 
  ArrowRight, 
  Sparkles,
  BookOpen
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

export default function ZazemiPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* HEADER - DARK BACKGROUND (bg-slate-900) WITH EMERALD QUOTE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold uppercase tracking-wider font-mono">
            <Shield className="w-4 h-4 text-emerald-400" />
            Rozcestník životních situací • Táta má právo
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Životní situace po rozchodu & Stabilizace zázemí
          </h1>

          {/* EMERALD BLOCKQUOTE AS REQUIRED BY DESIGN SPEC */}
          <blockquote className="border-l-4 border-emerald-500 pl-4 py-3 my-4 bg-slate-800/80 rounded-r-2xl text-emerald-400 text-sm sm:text-base font-medium italic leading-relaxed shadow-inner">
            „Hlavní pilíř portálu: Primárním cílem zůstává nejlepší zájem dítěte, jeho právo na péči obou rodičů a stabilní střídavá či společná péče. Stabilizace vašich financí, domova a duševní pohody vytváří nezbytné zázemí pro vaše rodičovské působení.“
          </blockquote>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Vyberte si konkrétní životní situaci a získejte ověřená doporučení, právní informace, krizové rady a praktické návody.
          </p>
        </div>
      </div>

      {/* GRID OF 6 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {situaceData.map((situace) => {
          const IconComponent = iconMap[situace.icon] || BookOpen;

          return (
            <Link
              key={situace.slug}
              href={`/zazemi/${situace.slug}`}
              className="group bg-white border border-slate-200 hover:border-emerald-500/60 rounded-3xl p-6 sm:p-7 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-5 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-700 rounded-full font-bold uppercase tracking-wider transition-colors">
                    {situace.slug}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {situace.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {situace.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Otevřít detail situace</span>
                <div className="p-1.5 rounded-full bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
