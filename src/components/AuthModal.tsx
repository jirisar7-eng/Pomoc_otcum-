/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Shield, Sparkles, LogIn, Copy, Check, ChevronDown, ChevronUp, AlertTriangle, HelpCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { User, UserRole } from '../types';
import { loginWithGoogle, registerWithEmail, loginWithEmail, auth, linkPasswordToGoogleAccount, sendPasswordReset } from '../lib/firebase';

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
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [showGoogleGuide, setShowGoogleGuide] = useState(false);

  // New states for Google Login password linkage & recovery
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [setupPassword, setSetupPassword] = useState('');
  const [showSetupPasswordText, setShowSetupPasswordText] = useState(true);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let length = 12;
    let newPass = '';
    for (let i = 0; i < length; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSetupPassword(newPass);
  };

  const handleCopyDomain = (domain: string) => {
    navigator.clipboard.writeText(domain);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !name)) {
      setError('Prosím vyplňte všechna povinná pole.');
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    if (password.length < 6 && !((lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail === 'sarji@seznam.cz') && password === '1234')) {
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
      
      // Check if user has an email/password credential linked
      const currentUser = auth.currentUser;
      const isLinkedWithPassword = currentUser?.providerData.some(p => p.providerId === 'password');
      
      // Let's also detect if we're in fallback environment
      const isFallbackLocalUser = currentUser && (
        currentUser.email?.toLowerCase().trim() === 'mallfuriionn@gmail.com' ||
        currentUser.email?.toLowerCase().trim() === 'sarji@seznam.cz'
      );

      // Bypass password linking for the admin user, but auto-link their password in the background!
      if (isFallbackLocalUser) {
        if (currentUser && !isLinkedWithPassword) {
          try {
            await linkPasswordToGoogleAccount('1234');
            console.log("[Synthesis OS] Automatically linked password for admin user upon Google Login");
          } catch (linkErr) {
            console.warn("[Synthesis OS] Failed to auto-link password for admin:", linkErr);
          }
        }
        setSuccess(true);
        setTimeout(() => {
          onLogin(loggedInUser);
          setSuccess(false);
          setLoading(false);
          onClose();
        }, 1000);
      } else if (currentUser && !isLinkedWithPassword) {
        setGoogleUser(loggedInUser);
        setShowPasswordSetup(true);
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onLogin(loggedInUser);
          setSuccess(false);
          setLoading(false);
          onClose();
        }, 1000);
      }
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

  const handleSetupPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!setupPassword || setupPassword.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků.');
      return;
    }
    
    setLoading(true);
    try {
      await linkPasswordToGoogleAccount(setupPassword);
      setSuccess(true);
      setTimeout(() => {
        if (googleUser) {
          onLogin(googleUser);
        }
        setSuccess(false);
        setLoading(false);
        setShowPasswordSetup(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      console.error("Linking password failed:", err);
      setError(err.message || 'Nepodařilo se propojit záložní heslo. Můžete pokračovat i bez něj, nebo to zkusit znovu.');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccessMessage('');
    
    if (!resetEmail) {
      setError('Zadejte prosím svou e-mailovou adresu.');
      return;
    }
    
    setLoading(true);
    try {
      await sendPasswordReset(resetEmail);
      setResetSuccessMessage('Odkaz pro obnovení hesla byl úspěšně odeslán na váš e-mail. Zkontrolujte prosím doručenou poštu i složku se spamem.');
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error("Forgot password error:", err);
      if (err.code === 'auth/user-not-found') {
        setError('Uživatel s touto e-mailovou adresou nebyl nalezen.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Neplatný formát e-mailové adresy.');
      } else {
        setError('Odeslání odkazu selhalo. Zkontrolujte prosím zadanou adresu.');
      }
    }
  };

  const setDemoUser = async (type: 'mallfuriionn' | 'sarji') => {
    setError('');
    setLoading(true);
    const targetEmail = type === 'sarji' ? 'sarji@seznam.cz' : 'mallfuriionn@gmail.com';
    const targetName = type === 'sarji' ? 'Administrátor (sarji)' : 'Hlavní Administrátor (mallfuriionn)';
    try {
      const loggedInUser = await loginWithEmail(targetEmail, '1234');
      setSuccess(true);
      setTimeout(() => {
        onLogin(loggedInUser);
        setSuccess(false);
        setLoading(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      console.error("Demo login error:", err);
      // Fallback: just prefill if direct login fails
      setEmail(targetEmail);
      setPassword('1234');
      setName(targetName);
      setRole('admin');
      setIsRegister(false);
    }
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
              {showPasswordSetup 
                ? 'Záložní heslo k účtu' 
                : showForgotPassword 
                  ? 'Obnovení hesla' 
                  : isRegister 
                    ? 'Vytvoření účtu' 
                    : 'Přihlášení do systému'}
            </h3>
            <p className="text-teal-100 text-xs mt-1">
              {showPasswordSetup 
                ? 'Nastavte si záložní přístup pro případ ztráty Google účtu.'
                : showForgotPassword
                  ? 'Zadejte svůj e-mail a obdržíte odkaz k obnovení hesla.'
                  : 'Získejte přístup k diskusnímu fóru a interaktivnímu generátoru dokumentů.'}
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
            ) : showPasswordSetup ? (
              <div className="space-y-4" id="password-setup-state">
                {error && (
                  <div className="bg-rose-50 text-rose-700 p-4 border border-rose-150 rounded-xl text-xs font-bold leading-relaxed">
                    {error}
                  </div>
                )}
                
                <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-xl text-xs text-amber-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Zabezpečení účtu heslem</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Úspěšně jste se přihlásili přes Google! Chceme zajistit, abyste měl(a) k portálu přístup <strong>i v případě ztráty nebo odcizení vašeho Google účtu</strong>.
                  </p>
                  <p className="leading-relaxed text-[11px] text-slate-500">
                    Zvolte si své vlastní heslo nebo klikněte na tlačítko pro rychlé automatické vygenerování bezpečného klíče.
                  </p>
                </div>

                <form onSubmit={handleSetupPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-mailová adresa (z Google)</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        disabled
                        value={googleUser?.email || auth.currentUser?.email || ''}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 text-slate-500 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Záložní heslo</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showSetupPasswordText ? 'text' : 'password'}
                        value={setupPassword}
                        onChange={(e) => setSetupPassword(e.target.value)}
                        placeholder="Zadejte alespoň 6 znaků"
                        className="w-full pl-9 pr-24 py-2 text-sm bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSetupPasswordText(!showSetupPasswordText)}
                        className="absolute right-20 top-2.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded cursor-pointer"
                        title={showSetupPasswordText ? "Skrýt heslo" : "Zobrazit heslo"}
                      >
                        {showSetupPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="absolute right-3 top-1.5 text-slate-500 hover:text-teal-600 font-bold text-[10px] bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 px-1.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1"
                        title="Vygenerovat heslo"
                      >
                        <RefreshCw className="w-3 h-3 shrink-0" />
                        <span>Generovat</span>
                      </button>
                    </div>
                  </div>

                  {setupPassword && setupPassword.length >= 6 && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-[11px] text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-700">Důležité upozornění:</p>
                      <p>Toto heslo si prosím poznačte. Pokud přístup ke Google účtu ztratíte, kliknete na přihlašovací obrazovce na <strong>"Zapomněli jste heslo?"</strong> a získáte okamžitý přístup zpět pomocí svého e-mailu a tohoto hesla.</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (googleUser) {
                          onLogin(googleUser);
                        }
                        setShowPasswordSetup(false);
                        onClose();
                      }}
                      className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                      Přeskočit (Nedoporučeno)
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !setupPassword || setupPassword.length < 6}
                      className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer text-center"
                    >
                      {loading ? 'Propojuji...' : 'Uložit a dokončit'}
                    </button>
                  </div>
                </form>
              </div>
            ) : showForgotPassword ? (
              <div className="space-y-4" id="forgot-password-state">
                {error && (
                  <div className="bg-rose-50 text-rose-700 p-4 border border-rose-150 rounded-xl text-xs font-bold leading-relaxed">
                    {error}
                  </div>
                )}
                {resetSuccessMessage && (
                  <div className="bg-teal-50 text-teal-850 p-4 border border-teal-150 rounded-xl text-xs font-semibold leading-relaxed space-y-1">
                    <p className="font-bold text-teal-900 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-teal-600" />
                      E-mail byl odeslán!
                    </p>
                    <p>{resetSuccessMessage}</p>
                  </div>
                )}

                <p className="text-xs text-slate-500 leading-relaxed">
                  Zadejte e-mailovou adresu spojenou s vaším účtem (ať už Google účet nebo e-mailový účet). Zašleme vám přímý odkaz, pomocí kterého si budete moci nastavit nové bezpečné heslo.
                </p>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-mailová adresa</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="novak@synthesis.cz"
                        className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError('');
                        setResetSuccessMessage('');
                      }}
                      className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                      Zpět k přihlášení
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer text-center"
                    >
                      {loading ? 'Odesílám...' : 'Odeslat odkaz'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="bg-rose-50 text-rose-700 p-4.5 rounded-2xl text-xs border border-rose-150 space-y-2.5" id="auth-error">
                    <p className="font-bold leading-relaxed">{error}</p>
                    {error.includes('unauthorized-domain') && (
                      <div className="bg-white/85 p-3 rounded-xl border border-rose-100 text-slate-700 font-medium space-y-2 text-left">
                        <span className="font-extrabold uppercase text-[9px] text-rose-600 block tracking-wider">💡 JAK TO RYCHLE OPRAVIT:</span>
                        <p className="text-[11px] leading-relaxed">
                          1. Přejděte do své <strong>Firebase Console</strong> &rarr; <strong>Authentication</strong> &rarr; záložka <strong>Settings</strong> &rarr; <strong>Authorized Domains</strong>.
                        </p>
                        <p className="text-[11px] leading-relaxed">
                          2. Klikněte na <strong>Add domain</strong> a přidejte tyto domény:
                          <span className="flex items-center gap-1.5 mt-1">
                            <code className="flex-1 bg-slate-100 p-1.5 rounded font-mono text-[10px] break-all text-slate-800">
                              {window.location.hostname}
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopyDomain(window.location.hostname)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded transition-colors"
                              title="Zkopírovat doménu"
                            >
                              {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </span>
                          <span className="flex items-center gap-1.5 mt-1">
                            <code className="flex-1 bg-slate-100 p-1.5 rounded font-mono text-[10px] break-all text-slate-800">
                              localhost
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopyDomain('localhost')}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded transition-colors"
                              title="Zkopírovat"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        </p>
                        <p className="text-[11px] leading-relaxed pt-1 border-t border-slate-100">
                          Nebo se <strong>přihlaste klasicky e-mailem a heslem níže</strong> (např. kliknutím na černé tlačítko „Hlavní Administrátor“), což funguje okamžitě a bez nutnosti nastavování domén!
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

                {/* Google Verification Notice & Guide */}
                <div id="google-verification-notice" className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowGoogleGuide(!showGoogleGuide)}
                    className="flex items-center justify-between w-full text-slate-700 hover:text-slate-900 font-bold transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>Návod: Jak projít varováním Google?</span>
                    </div>
                    {showGoogleGuide ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>

                  {showGoogleGuide && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2.5 pt-2.5 border-t border-slate-200 text-slate-600 space-y-2.5 text-[11px] leading-relaxed"
                    >
                      <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-100 text-amber-900 p-2 rounded-lg font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <p>
                          <strong>Aplikace je 100% bezpečná.</strong> Autor portálu (mallfuriionn@gmail.com) pouze není veden na Google Play jako placený vývojář a neprošel drahým korporátním ověřením.
                        </p>
                      </div>
                      
                      <p className="font-semibold text-slate-700">Jak se přihlásit (krok za krokem):</p>
                      <ol className="list-decimal pl-4 space-y-1.5 text-slate-650">
                        <li>Po kliknutí na tlačítko výše se otevře přihlašovací okno Google.</li>
                        <li>Na varovné obrazovce <em>„Google tuto aplikaci neověřil“</em> klikněte vlevo dole na nenápadný odkaz <strong>Rozšířené možnosti</strong> (nebo <em>Advanced</em>).</li>
                        <li>Poté klikněte na odkaz dole: <strong>Přejít na web pomocotcum.firebaseapp.com (nebezpečné)</strong> / <em>Go to pomocotcum.firebaseapp.com (unsafe)</em>.</li>
                        <li>Klikněte na <strong>Pokračovat</strong> (Continue) pro bezpečné dokončení registrace do našeho systému.</li>
                      </ol>
                    </motion.div>
                  )}
                </div>

                {/* Admin Quick Access Panel */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2" id="admin-quick-access-panel">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider font-mono">Rychlé přihlášení správce</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDemoUser('mallfuriionn')}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-3xs"
                      title="Přihlásit se jako Jiří Šár (mallfuriionn@gmail.com)"
                    >
                      Jiří Šár
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoUser('sarji')}
                      className="py-1.5 px-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-3xs"
                      title="Přihlásit se jako Sarji (sarji@seznam.cz)"
                    >
                      Sarji
                    </button>
                  </div>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-150"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Nebo e-mailem</span>
                  <div className="flex-grow border-t border-slate-150"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">

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
                  {!isRegister && (
                    <div className="flex justify-end text-[11px] mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setResetEmail(email);
                          setError('');
                        }}
                        className="text-slate-400 hover:text-teal-650 transition-colors font-medium cursor-pointer"
                      >
                        Zapomenuté heslo?
                      </button>
                    </div>
                  )}
                </div>


                <button
                  id="auth-submit-btn"
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-slate-800 text-white font-semibold text-sm rounded-xl hover:from-teal-700 hover:to-slate-900 shadow-md transition-all mt-4 cursor-pointer"
                >
                  {isRegister ? 'Zaregistrovat se' : 'Přihlásit se'}
                </button>

                <div className="text-center mt-4">
                  <button
                    id="auth-toggle-mode"
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-xs text-slate-500 hover:text-teal-600 font-medium transition-colors cursor-pointer"
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
