/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../data/translations';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synthesis_hub_language') as Language;
      if (saved === 'cs' || saved === 'sk' || saved === 'en') {
        return saved;
      }
      
      // Auto-detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'sk') return 'sk';
      if (browserLang === 'en') return 'en';
    }
    return 'cs'; // default to Czech
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('synthesis_hub_language', lang);
    }
  };

  // Translation helper function
  const t = (key: string, fallback?: string): string => {
    const item = TRANSLATIONS[key];
    if (item) {
      return item[language] || item['cs'] || fallback || key;
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
