/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * COOKIE CONSENT BANNER & SETTINGS MODAL
 * "Táta má právo" (Pomoc_otcum)
 * GDPR compliant discrete banner with "Accept All", "Necessary Only", and Custom Modal.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cookie, 
  ShieldCheck, 
  Check, 
  X, 
  Settings, 
  Lock, 
  BarChart2, 
  Sliders, 
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  // Preference switches inside the details modal
  const [allowAnalytics, setAllowAnalytics] = useState<boolean>(true);
  const [allowPreferences, setAllowPreferences] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedConsent = localStorage.getItem('synthesis_cookie_consent_v1');
      if (!storedConsent) {
        // Delay 800ms for smooth initial page load experience
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Listen to custom re-open trigger from Footer or Settings
  useEffect(() => {
    const handleReopen = () => {
      setVisible(true);
      setShowDetailsModal(true);
    };
    window.addEventListener('open_cookie_consent_modal', handleReopen);
    return () => window.removeEventListener('open_cookie_consent_modal', handleReopen);
  }, []);

  const saveConsent = (type: 'all' | 'necessary' | 'custom') => {
    if (typeof window === 'undefined') return;

    const payload = {
      type,
      necessary: true,
      analytics: type === 'all' ? true : type === 'necessary' ? false : allowAnalytics,
      preferences: type === 'all' ? true : type === 'necessary' ? false : allowPreferences,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('synthesis_cookie_consent_v1', JSON.stringify(payload));
    setVisible(false);
    setShowDetailsModal(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* FLOATING BOTTOM BANNER */}
      <AnimatePresence>
        {visible && !showDetailsModal && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 md:p-6 pointer-events-none"
            id="cookie-consent-banner-root"
          >
            <div className="max-w-5xl mx-auto bg-slate-900/95 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 pointer-events-auto relative overflow-hidden">
              
              {/* Subtle accent line at top */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-500" />

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 md:gap-6">
                
                {/* Banner Text & Icon */}
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-amber-400 shrink-0 mt-0.5">
                    <Cookie className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold font-display text-white">
                        Ochrana soukromí a soubory cookies
                      </h3>
                      <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-[10px] font-mono font-bold">
                        GDPR Ready
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      Tento portál využívá nezbytné technické cookies pro zajištění bezpečné relace, zapamatování přihlášení a správnou funkci opatrovnických kalkulaček. S vaším souhlasem využíváme i anonymní analytické cookies k dalšímu zlepšování služeb.
                    </p>
                  </div>
                </div>

                {/* Buttons Action Group */}
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <button
                    id="cookie-accept-all-btn"
                    onClick={() => saveConsent('all')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Přijmout vše</span>
                  </button>

                  <button
                    id="cookie-accept-necessary-btn"
                    onClick={() => saveConsent('necessary')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Pouze nezbytné</span>
                  </button>

                  <button
                    id="cookie-open-details-btn"
                    onClick={() => setShowDetailsModal(true)}
                    className="px-3 py-2.5 text-slate-400 hover:text-teal-300 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer mx-auto sm:mx-0"
                    title="Prilůsobit nastavení cookies"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="underline decoration-slate-600 hover:decoration-teal-400">Podrobnosti</span>
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED COOKIES MODAL */}
      <AnimatePresence>
        {showDetailsModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-auto"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-500/20 border border-teal-500/30 rounded-2xl text-teal-300">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-display text-white">
                      Nastavení preferencí cookies
                    </h3>
                    <p className="text-xs text-slate-400">
                      Podrobné možnosti zpracování dat
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cookie Categories List */}
              <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                
                {/* 1. Necessary */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Technické a nezbytné cookies
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold">
                      Vždy aktivní
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Tato data jsou klíčová pro přihlášení uživatele (zapamatování relace), uchování stavu rozpracovaných právních podání, spuštění kalkulaček a zabezpečení komunikace. Nelze je vypnout.
                  </p>
                </div>

                {/* 2. Analytics */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Anonymní měření a analytika
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowAnalytics}
                        onChange={(e) => setAllowAnalytics(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Umožňuje nám anonymně sledovat navštěvovanost nejčastnějších sekcí a optimalizovat odezvu opatrovnického portálu pro mobilní zařízení.
                  </p>
                </div>

                {/* 3. User Preferences */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Uživatelské předvolby a filtry
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowPreferences}
                        onChange={(e) => setAllowPreferences(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ukládá vaše nastavení vyhledávacích filtrů judikátů, preferovaný režim zobrazení a volbu zobrazení úvodního průvodce.
                  </p>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => saveConsent('necessary')}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Odmítnout nepovinné
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => saveConsent('custom')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Uložit vybrané
                  </button>

                  <button
                    onClick={() => saveConsent('all')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Povolit vše
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Helper utility function to programmatically reopen cookie preferences modal
 */
export function openCookieConsentModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('open_cookie_consent_modal'));
  }
}
