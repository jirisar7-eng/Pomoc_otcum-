/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { Globe } from 'lucide-react';
import { Language } from '../data/translations';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const options: { code: Language; label: string; flag: string }[] = [
    { code: 'cs', label: t('lang_cs', 'Čeština'), flag: '🇨🇿' },
    { code: 'sk', label: t('lang_sk', 'Slovenčina'), flag: '🇸🇰' },
    { code: 'en', label: t('lang_en', 'English'), flag: '🇬🇧' }
  ];

  return (
    <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 font-sans" id="synthesis-language-switcher">
      <Globe className="w-4.5 h-4.5 text-teal-400" />
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1 hidden sm:inline-block">
        {t('lang_select_title', 'Jazyk')}:
      </span>
      <div className="flex gap-1">
        {options.map((opt) => {
          const isActive = language === opt.code;
          return (
            <button
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
              title={opt.label}
              id={`lang-btn-${opt.code}`}
            >
              <span>{opt.flag}</span>
              <span>{opt.code.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
