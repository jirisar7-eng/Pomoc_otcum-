/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, BookOpen } from 'lucide-react';

interface GlossaryTermProps {
  termId: string;
  children: React.ReactNode;
  className?: string;
}

export default function GlossaryTerm({ termId, children, className = "" }: GlossaryTermProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Dispatch a global custom event that App.tsx will listen to
    const event = new CustomEvent('open-glossary', { detail: termId.toLowerCase() });
    window.dispatchEvent(event);
  };

  return (
    <span
      onClick={handleClick}
      className={`inline-flex items-baseline gap-0.5 px-1 py-0.5 rounded bg-teal-50/50 hover:bg-teal-50 text-slate-800 hover:text-teal-900 border-b-2 border-dotted border-teal-500 hover:border-teal-600 transition-all cursor-pointer font-medium select-none group ${className}`}
      title="Kliknutím zobrazíte podrobné vysvětlení ve slovníku pojmů"
    >
      {children}
      <BookOpen className="w-2.5 h-2.5 text-teal-500/70 group-hover:text-teal-600 shrink-0 self-center" />
    </span>
  );
}
