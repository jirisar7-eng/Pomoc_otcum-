/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Shield, Sparkles, LogIn } from 'lucide-react';
import { User, UserRole } from '../types';
import { loginWithGoogle, registerWithEmail, loginWithEmail } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !name)) {
      setError('Prosím vyplňte všechna povinná pole.');
      return;
    }

    if (password.length < 6 && !(email === 'mallfuriionn@gmail.com' && password === '1234')) {
      setError('Heslo musí mít alespoň 6 znaků.');
      return;
    }

    setLoading(true);
    try {
      let loggedInUser: User;
      if (isRegister) {
        loggedInUser = await registerWithEmail(email, password, name);
      } else {
        loggedInUser = await loginWithEmail(email, password);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onLogin(loggedInUser);
        setSuccess(false);
        setLoading(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setSuccess(false);
      setLoading(false);
      console.error("Auth error:", err);
      // Translate common Firebase Auth errors to human-friendly Czech
      if (err.code === 'auth/email-already-in-use') {
        setError('Tento e-mail již používá jiný účet. Přepněte se prosím níže na "Přihlášení" a zadejte heslo k tomuto účtu pro pokračování.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Neplatný formát e-mailové adresy.');
      } else if (err.code === 'auth/weak-password') {
        setError('Heslo je příliš slabé. Použijte silnější heslo (minimálně 6 znaků).');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Tato doména (náhledová adresa) není autorizována ve vaší Firebase konzoli. Povolte prosím aktuální doménu v nastavení Firebase Console (Authentication -> Settings -> Authorized Domains) nebo použijte k přihlášení běžný e-mail a heslo níže.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Nesprávný e-mail nebo heslo.');
      } else {
        setError(err.message || 'Při ověřování došlo k chybě. Zkuste to prosím znovu.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await loginWithGoogle();
      setSuccess(true);
      setTimeout(() => {
        onLogin(loggedInUser);
        setSuccess(false);
        setLoading(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setSuccess(false);
      setLoading(false);
      console.error("Google Auth error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Tato doména (náhledová adresa) není autorizována pro Google přihlášení ve vaší Firebase konzoli. Povolte prosím aktuální doménu v nastavení Firebase Console (Authentication -> Settings -> Authorized Domains) nebo použijte k přihlášení běžný e-mail a heslo níže.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Tento Google účet je již registrován pod jiným typem přihlášení. Použijte prosím přihlášení e-mailem a heslem.');
      } else if (err.code !== 'auth/popup-blocked-by-user') {
        setError('Přihlášení přes Google se nezdařilo. Zkuste to znovu nebo použijte e-mail a heslo níže.');
      }
    }
  };

  const setDemoUser = (type: 'mallfuriionn') => {
    if (type === 'mallfuriionn') {
      setEmail('mallfuriionn@gmail.com');
      setPassword('1234');
      setName('Hlavní Administrátor');
      setRole('admin');
    }
    setIsRegister(false);
  };

  return (
    <AnimatePresence>
      <div id="auth-modal-overlay" className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <motion.div
          id="auth-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-600 to-slate-800 px-6 py-5 text-white relative">
            <button 
              id="auth-modal-close"
              onClick={onClose} 
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-teal-300" />
              <span className="text-xs font-semibold tracking-wider uppercase text-teal-200">Synthesis Hub Security</span>
            </div>
            <h3 className="text-xl font-bold font-display">
              {isRegister ? 'Vytvoření účtu' : 'Přihlášení do systému'}
            </h3>
            <p className="text-teal-100 text-xs mt-1">
              Získejte přístup k diskusnímu fóru a interaktivnímu generátoru dokumentů.
            </p>
          </div>

          <div className="p-6">
            {success ? (
              <div className="py-8 text-center" id="auth-success-state">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-100">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <Shield className="w-8 h-8 text-teal-600" />
                  </motion.div>
                </div>
                <h4 className="text-lg font-bold text-slate-800 font-display">Ověřování proběhlo úspěšně</h4>
                <p className="text-slate-500 text-sm mt-1">Vítejte v ekosystému Synthesis Hub.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="bg-rose-50 text-rose-700 p-4.5 rounded-2xl text-xs border border-rose-150 space-y-2.5" id="auth-error">
                    <p className="font-bold leading-relaxed">{error}</p>
                    {error.includes('unauthorized-domain') && (
                      <div className="bg-white/80 p-3 rounded-xl border border-rose-100 text-slate-700 font-medium space-y-1">
                        <span className="font-extrabold uppercase text-[9px] text-rose-600 block tracking-wider">💡 DOPORUČENÉ ŘEŠENÍ:</span>
                        <p className="text-[11px] leading-relaxed">
                          Chcete-li pokračovat ihned bez nastavování Firebase, <strong>vložte e-mail a heslo do formuláře níže</strong> a klikněte na tlačítko <strong>„Vytvořit účet“</strong> nebo klikněte na černé tlačítko <strong>„Hlavní Administrátor“</strong> níže. Přihlášení e-mailem a heslem funguje bez jakéhokoliv omezování domén!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Google Secure Login Button */}
                <button
                  id="google-login-btn"
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-3xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Bezpečné přihlášení přes Google
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-150"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Nebo e-mailem</span>
                  <div className="flex-grow border-t border-slate-150"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
                  {/* Quick Demo Account buttons */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-2 text-center">
                      Rychlé přihlášení (SuperAdmin):
                    </span>
                    <button
                      id="demo-admin-mallfuriionn-btn"
                      type="button"
                      onClick={() => setDemoUser('mallfuriionn')}
                      className="w-full py-1.5 px-3 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-900 text-teal-300 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                      Hlavní Administrátor (mallfuriionn)
                    </button>
                  </div>

                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Vaše celé jméno</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="auth-name-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Např. Ing. Petr Novák"
                        className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-mailová adresa</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="auth-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="novak@synthesis.cz"
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Heslo</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="auth-password-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>

                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Typ testovacího účtu</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${role === 'user' ? 'border-teal-500 bg-teal-50/40 text-teal-900' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'}`}>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">Běžný uživatel</span>
                          <span className="text-[10px] text-slate-500">Komentáře, fórum, dotazy</span>
                        </div>
                        <input
                          type="radio"
                          name="role-select"
                          checked={role === 'user'}
                          onChange={() => setRole('user')}
                          className="w-4 h-4 text-teal-600 accent-teal-600"
                        />
                      </label>
                      <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${role === 'admin' ? 'border-indigo-500 bg-indigo-50/40 text-indigo-900' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'}`}>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">Administrátor</span>
                          <span className="text-[10px] text-slate-500">Moderování, články, správa</span>
                        </div>
                        <input
                          type="radio"
                          name="role-select"
                          checked={role === 'admin'}
                          onChange={() => setRole('admin')}
                          className="w-4 h-4 text-indigo-600 accent-indigo-600"
                        />
                      </label>
                    </div>
                  </div>
                )}

                <button
                  id="auth-submit-btn"
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-slate-800 text-white font-semibold text-sm rounded-xl hover:from-teal-700 hover:to-slate-900 shadow-md transition-all mt-4"
                >
                  {isRegister ? 'Zaregistrovat se' : 'Přihlásit se'}
                </button>

                <div className="text-center mt-4">
                  <button
                    id="auth-toggle-mode"
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-xs text-slate-500 hover:text-teal-600 font-medium transition-colors"
                  >
                    {isRegister ? 'Máte již účet? Přihlaste se' : 'Nemáte účet? Zaregistrujte se zdarma'}
                  </button>
                </div>
              </form>
            </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
