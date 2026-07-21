/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Shield, 
  Sparkles, 
  LogIn, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  KeyRound,
  UserCheck,
  Fingerprint
} from 'lucide-react';
import { User, UserRole } from '../types';
import { 
  loginWithGoogle, 
  registerWithEmail, 
  loginWithEmail, 
  auth, 
  linkPasswordToGoogleAccount, 
  sendPasswordReset 
} from '../lib/firebase';
import { isPasskeySupported, loginWithPasskey, registerPasskey } from '../services/passkeyService';
import { isBiometricsAvailable } from '../utils/passkey';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot_password' | 'password_setup' | 'welcome';

interface StatusState {
  type: 'idle' | 'loading' | 'success' | 'warning' | 'error';
  title?: string;
  text: string;
  details?: string;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  // Navigation & Mode
  const [mode, setMode] = useState<AuthMode>('login');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [showPassword, setShowPassword] = useState(false);

  // Touch tracking for real-time validation
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean; name?: boolean }>({});

  // Password setup (for Google OAuth linkage)
  const [setupPassword, setSetupPassword] = useState('');
  const [showSetupPasswordText, setShowSetupPasswordText] = useState(true);
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  // Password Reset field
  const [resetEmail, setResetEmail] = useState('');

  // Status & Feedback System
  const [status, setStatus] = useState<StatusState>({ type: 'idle', text: '' });
  const [loading, setLoading] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [showGoogleGuide, setShowGoogleGuide] = useState(false);

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState<'online' | 'offline'>('online');

  // Passkey / WebAuthn Biometric Support State
  const [passkeyAvailable, setPasskeyAvailable] = useState<boolean>(false);

  // Check passkey / biometrics support on modal open via WebAuthn API
  useEffect(() => {
    if (isOpen) {
      isBiometricsAvailable()
        .then((supported) => setPasskeyAvailable(supported))
        .catch((err) => {
          console.warn('Chyba při detekci Passkeys/WebAuthn:', err);
          setPasskeyAvailable(false);
        });
    }
  }, [isOpen]);

  // Welcome state data
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [welcomeCountdown, setWelcomeCountdown] = useState(3);

  // Focus trap ref
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // 1. Database Connection Status Monitoring
  useEffect(() => {
    const handleOnline = () => setDbStatus('online');
    const handleOffline = () => setDbStatus('offline');

    if (typeof window !== 'undefined') {
      setDbStatus(navigator.onLine ? 'online' : 'offline');
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  // 2. Keyboard & Accessibility Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !loading && mode !== 'welcome') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, mode, onClose]);

  // Focus input when modal opens or mode changes
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 150);
    }
  }, [isOpen, mode]);

  // Reset states when modal re-opens
  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setCurrentStep(1);
      setStatus({ type: 'idle', text: '' });
      setLoading(false);
      setAuthenticatedUser(null);
      setTouched({});
      setErrorNotice('');
    }
  }, [isOpen]);

  // Welcome screen auto-login countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'welcome' && authenticatedUser) {
      setWelcomeCountdown(3);
      timer = setInterval(() => {
        setWelcomeCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            completeAuthentication(authenticatedUser);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, authenticatedUser]);

  if (!isOpen) return null;

  // Real-time Field Validation Helpers
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isValidPassword = (val: string) => val.length >= 6;
  const isValidName = (val: string) => val.trim().length >= 2;

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pass)) score += 25;

    if (score <= 25) return { score, label: 'Slabé (min. 6 znaků)', color: 'bg-rose-500' };
    if (score <= 50) return { score, label: 'Střední', color: 'bg-amber-500' };
    if (score <= 75) return { score, label: 'Dobré', color: 'bg-teal-500' };
    return { score, label: 'Velmi silné', color: 'bg-emerald-500' };
  };

  const isFormValid = () => {
    if (mode === 'login') {
      return isValidEmail(email) && isValidPassword(password);
    }
    if (mode === 'register') {
      return isValidName(name) && isValidEmail(email) && isValidPassword(password);
    }
    if (mode === 'forgot_password') {
      return isValidEmail(resetEmail);
    }
    if (mode === 'password_setup') {
      return isValidPassword(setupPassword);
    }
    return true;
  };

  const handleCopyDomain = (domain: string) => {
    navigator.clipboard.writeText(domain);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  const setErrorNotice = (text: string, details?: string) => {
    setStatus({
      type: 'error',
      title: 'Chyba při ověřování',
      text,
      details
    });
  };

  const completeAuthentication = (user: User) => {
    onLogin(user);
    onClose();
  };

  const handleFinishWelcome = () => {
    if (authenticatedUser) {
      completeAuthentication(authenticatedUser);
    }
  };

  // 3. Action Handlers with Real-Time Feedback

  // A. Email Login / Register Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || loading) return;

    setLoading(true);
    setCurrentStep(2);
    
    const isReg = mode === 'register';
    setStatus({
      type: 'loading',
      title: isReg ? 'Vytvářím účet...' : 'Ověřuji přihlašovací údaje...',
      text: isReg 
        ? 'Komunikuji s databází Firebase a registruji váš profil...' 
        : 'Kontroluji heslo a stahuji vaše oprávnění z databáze...'
    });

    try {
      let loggedInUser: User;
      if (isReg) {
        loggedInUser = await registerWithEmail(email, password, name);
      } else {
        loggedInUser = await loginWithEmail(email, password);
      }

      setCurrentStep(3);
      setStatus({
        type: 'success',
        title: isReg ? 'Účet úspěšně vytvořen!' : 'Přihlášení úspěšné!',
        text: `Vítáme vás zpět, ${loggedInUser.name}. Načítám váš profil...`
      });

      setTimeout(() => {
        setAuthenticatedUser(loggedInUser);
        setMode('welcome');
        setLoading(false);
      }, 800);

    } catch (err: any) {
      setLoading(false);
      setCurrentStep(1);
      console.error("Auth error:", err);

      if (err.code === 'auth/email-already-in-use') {
        setErrorNotice(
          'Tento e-mail již používá jiný účet.',
          'Přepněte se prosím na "Přihlášení" a zadejte své heslo k tomuto účtu.'
        );
      } else if (err.code === 'auth/invalid-email') {
        setErrorNotice('Neplatný formát e-mailové adresy.', 'Zkontrolujte překlepy v adrese.');
      } else if (err.code === 'auth/weak-password') {
        setErrorNotice('Heslo je příliš slabé.', 'Zvolte silnější heslo s minimálně 6 znaky.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorNotice(
          'Tato doména není autorizována ve vaší Firebase konzoli.',
          `Přidejte doménu "${window.location.hostname}" v nastavení Firebase (Authentication -> Settings -> Authorized Domains).`
        );
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorNotice('Nesprávný e-mail nebo heslo.', 'Zkontrolujte prosím zadané údaje a zkuste to znovu.');
      } else {
        setErrorNotice(err.message || 'Při ověřování došlo k chybě. Zkuste to prosím znovu.');
      }
    }
  };

  // B. Google Login Handler
  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);
    setCurrentStep(2);
    setStatus({
      type: 'loading',
      title: 'Přihlašování přes Google...',
      text: 'Komunikuji s Google OAuth2 službou a ověřuji certifikát...'
    });

    try {
      const loggedInUser = await loginWithGoogle();
      const currentUser = auth.currentUser;
      const isLinkedWithPassword = currentUser?.providerData.some(p => p.providerId === 'password');

      const lowerEmail = (loggedInUser.email || '').toLowerCase().trim();
      const isFallbackLocalUser = lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail === 'sarji@seznam.cz';

      if (isFallbackLocalUser && currentUser && !isLinkedWithPassword) {
        try {
          await linkPasswordToGoogleAccount('1234');
        } catch (linkErr) {
          console.warn("Failed to auto-link password for admin:", linkErr);
        }
      }

      if (currentUser && !isLinkedWithPassword && !isFallbackLocalUser) {
        setGoogleUser(loggedInUser);
        setMode('password_setup');
        setLoading(false);
        setCurrentStep(2);
        setStatus({
          type: 'warning',
          title: 'Doporučení pro zabezpečení účtu',
          text: 'Nastavte si záložní heslo k vašemu Google účtu pro případ výpadku služeb.'
        });
      } else {
        setCurrentStep(3);
        setStatus({
          type: 'success',
          title: 'Google přihlášení úspěšné!',
          text: `Vítáme vás, ${loggedInUser.name}. Načítám vaše uživatelské rozhraní...`
        });

        setTimeout(() => {
          setAuthenticatedUser(loggedInUser);
          setMode('welcome');
          setLoading(false);
        }, 800);
      }
    } catch (err: any) {
      setLoading(false);
      setCurrentStep(1);
      console.error("Google Auth error:", err);

      if (err.code === 'auth/unauthorized-domain') {
        setErrorNotice(
          'Doména není autorizována pro Google přihlášení.',
          `Povolte doménu "${window.location.hostname}" ve Firebase Console (Authentication -> Settings -> Authorized Domains).`
        );
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorNotice(
          'Tento Google e-mail je již registrován přes běžné heslo.',
          'Přihlaste se prosím pomocí e-mailu a hesla níže.'
        );
      } else if (err.code !== 'auth/popup-blocked-by-user') {
        setErrorNotice('Přihlášení přes Google se nezdařilo.', 'Zkuste to prosím znovu nebo použijte e-mail a heslo.');
      } else {
        setStatus({ type: 'idle', text: '' });
      }
    }
  };

  // C. Backup Password Linking Submit
  const handleSetupPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPassword(setupPassword) || loading) return;

    setLoading(true);
    setStatus({
      type: 'loading',
      title: 'Propojuji záložní heslo...',
      text: 'Zabezpečuji váš Google účet pomocí doplňkového hesla...'
    });

    try {
      await linkPasswordToGoogleAccount(setupPassword);
      setCurrentStep(3);
      setStatus({
        type: 'success',
        title: 'Záložní heslo bylo nastaveno!',
        text: 'Nyní se můžete přihlásit jak přes Google, tak přes e-mail a heslo.'
      });

      setTimeout(() => {
        if (googleUser) {
          setAuthenticatedUser(googleUser);
          setMode('welcome');
        } else {
          onClose();
        }
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      console.error("Linking password failed:", err);
      setErrorNotice(
        'Nepodařilo se propojit heslo.',
        err.message || 'Můžete pokračovat i bez záložního hesla.'
      );
    }
  };

  // D. Forgot Password Submit
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(resetEmail) || loading) return;

    setLoading(true);
    setStatus({
      type: 'loading',
      title: 'Odesílám žákost o obnovení...',
      text: `Odesílám e-mail s instrukcemi na adresu ${resetEmail}...`
    });

    try {
      await sendPasswordReset(resetEmail);
      setLoading(false);
      setStatus({
        type: 'success',
        title: 'E-mail pro obnovu hesla odeslán!',
        text: `Zkontrolujte doručenou poštu i složku spam na adrese ${resetEmail}.`
      });
    } catch (err: any) {
      setLoading(false);
      console.error("Forgot password error:", err);
      if (err.code === 'auth/user-not-found') {
        setErrorNotice('Uživatel nenalezen.', 'Účet s touto e-mailovou adresou v databázi neexistuje.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorNotice('Neplatný e-mail.', 'Zadejte platný formát e-mailové adresy.');
      } else {
        setErrorNotice('Odeslání selhalo.', 'Zkontrolujte připojení k síti a zkuste to znovu.');
      }
    }
  };

  // E. Passkey / WebAuthn Biometric Login
  const handlePasskeyLogin = async () => {
    if (loading) return;

    setLoading(true);
    setCurrentStep(2);
    setStatus({
      type: 'loading',
      title: 'Probíhá ověřování biometrie...',
      text: 'Přiložte prst k snímači otisků nebo použijte FaceID na vašem zařízení...'
    });

    try {
      const result = await loginWithPasskey(email || undefined);

      if (result.success && result.user) {
        setCurrentStep(3);
        setStatus({
          type: 'success',
          title: 'Biometrické přihlášení úspěšné!',
          text: `Vítáme vás zpět, ${result.user.name}. Načítám váš uživatelský profil...`
        });

        setTimeout(() => {
          setAuthenticatedUser(result.user!);
          setMode('welcome');
          setLoading(false);
        }, 800);
      } else if (result.noKey || result.cancelled) {
        setLoading(false);
        setCurrentStep(1);
        setStatus({
          type: 'warning',
          title: 'V tomto zařízení zatím nemáte vytvořený Passkey',
          text: 'Na tomto telefonu/počítači ještě nemáte uložený přístupový klíč pro doménu. Přihlaste se nejdříve e-mailem nebo přes Google. Po přihlášení si můžete jedním kliknutím uložit Passkey pro příští rychlé přihlášení.'
        });
      } else {
        setLoading(false);
        setCurrentStep(1);
        setErrorNotice('Biometrické ověření selhalo.', result.error || 'Nepodařilo se ověřit Passkey klíč.');
      }
    } catch (err: any) {
      setLoading(false);
      setCurrentStep(1);
      setErrorNotice('Chyba biometrického přihlášení.', err.message || 'Při snímání biometrie došlo k neočekávané chybě.');
    }
  };

  // E2. Register Passkey on Current Device
  const handleCreatePasskey = async () => {
    if (!authenticatedUser || loading) return;

    setLoading(true);
    setStatus({
      type: 'loading',
      title: 'Registruji nový přístupový klíč (Passkey)...',
      text: 'Potvrďte vytvoření otiskem prstu nebo FaceID v dialogu vašeho zařízení...'
    });

    try {
      const regRes = await registerPasskey(authenticatedUser);
      setLoading(false);

      if (regRes.success) {
        setStatus({
          type: 'success',
          title: 'Přístupový klíč byl úspěšně vytvořen!',
          text: 'Při příští návštěvě se budete moci přihlásit okamžitě pomocí otisku prstu / FaceID!'
        });
      } else {
        setStatus({
          type: 'warning',
          title: 'Vytvoření klíče bylo zrušeno',
          text: regRes.error || 'Přístupový klíč nebyl uložen.'
        });
      }
    } catch (err: any) {
      setLoading(false);
      setStatus({
        type: 'error',
        title: 'Chyba při registraci Passkey',
        text: err.message || 'Nepodařilo se uložit přístupový klíč.'
      });
    }
  };

  // E. Quick Demo Admin Login
  const setDemoUser = async (type: 'mallfuriionn' | 'sarji') => {
    if (loading) return;

    const targetEmail = type === 'sarji' ? 'sarji@seznam.cz' : 'mallfuriionn@gmail.com';
    const targetName = type === 'sarji' ? 'Administrátor (sarji)' : 'Hlavní Administrátor (Jiří Šár)';

    setLoading(true);
    setCurrentStep(2);
    setStatus({
      type: 'loading',
      title: `Přihlašuji správce (${type})...`,
      text: 'Ověřuji administrátorská práva a načítám systémovou konzoli...'
    });

    try {
      const loggedInUser = await loginWithEmail(targetEmail, '1234');
      setCurrentStep(3);
      setStatus({
        type: 'success',
        title: 'Správcovský přístup schválen!',
        text: `Vítáme vás, ${targetName}. Načítám administrátorské rozhraní...`
      });

      setTimeout(() => {
        setAuthenticatedUser(loggedInUser);
        setMode('welcome');
        setLoading(false);
      }, 800);
    } catch (err: any) {
      setLoading(false);
      setCurrentStep(1);
      console.error("Demo login error:", err);
      setEmail(targetEmail);
      setPassword('1234');
      setName(targetName);
      setRole('admin');
      setMode('login');
      setErrorNotice('Nepodařilo se automaticky přihlásit.', 'Formulář byl předvyplněn, klikněte níže na "Přihlásit se".');
    }
  };

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let newPass = '';
    for (let i = 0; i < 12; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSetupPassword(newPass);
  };

  const strengthInfo = getPasswordStrength(password);

  return (
    <AnimatePresence>
      <div 
        id="auth-modal-overlay" 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-subtitle"
      >
        <motion.div
          ref={modalRef}
          id="auth-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden relative my-auto"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-700 via-slate-800 to-slate-900 px-6 py-5 text-white relative">
            {!loading && mode !== 'welcome' && (
              <button 
                id="auth-modal-close"
                type="button"
                onClick={onClose} 
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-xl cursor-pointer"
                title="Zavřít dialog"
                aria-label="Zavřít dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center justify-between gap-2 mb-2 pr-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-300 shrink-0" />
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-teal-200">
                  Táta má právo &bull; Bezpečný portál
                </span>
              </div>

              {/* Database Live Status Badge */}
              <div 
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                  dbStatus === 'online' 
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' 
                    : 'bg-rose-500/20 border-rose-400/40 text-rose-300'
                }`}
                title={dbStatus === 'online' ? "Firebase databáze je online" : "Offline režim s lokální zálohou"}
              >
                {dbStatus === 'online' ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-400" />
                    <span>DB Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-rose-400" />
                    <span>Offline</span>
                  </>
                )}
              </div>
            </div>

            <h3 id="auth-modal-title" className="text-xl sm:text-2xl font-bold font-display text-white">
              {mode === 'welcome' && 'Přístup schválen!'}
              {mode === 'password_setup' && 'Záložní heslo k účtu'}
              {mode === 'forgot_password' && 'Obnovení hesla'}
              {mode === 'register' && 'Vytvoření nového účtu'}
              {mode === 'login' && 'Přihlášení do systému'}
            </h3>

            <p id="auth-modal-subtitle" className="text-teal-100 text-xs mt-1 leading-relaxed">
              {mode === 'welcome' && 'Váš profil byl ověřen v databázi. Přesměrovávám na portál...'}
              {mode === 'password_setup' && 'Nastavte si záložní přístup pro případ ztráty Google účtu.'}
              {mode === 'forgot_password' && 'Zadejte svůj e-mail a zašleme vám odkaz pro obnovení.'}
              {mode === 'register' && 'Registrujte se zdarma pro přístup k právním vzorům a poradně.'}
              {mode === 'login' && 'Získejte přístup k právnímu generátoru, poradně a opatrovnické agendě.'}
            </p>

            {/* Login Steps Progress Indicator */}
            {mode !== 'welcome' && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-[10px] font-mono">
                <div className={`flex items-center gap-1.5 font-bold ${currentStep >= 1 ? 'text-teal-300' : 'text-slate-400'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${currentStep >= 1 ? 'bg-teal-400 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                    1
                  </span>
                  <span>1. Údaje</span>
                </div>

                <div className={`h-0.5 flex-1 ${currentStep >= 2 ? 'bg-teal-400' : 'bg-slate-700'}`} />

                <div className={`flex items-center gap-1.5 font-bold ${currentStep >= 2 ? 'text-teal-300' : 'text-slate-400'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${currentStep >= 2 ? 'bg-teal-400 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                    2
                  </span>
                  <span>2. Ověření</span>
                </div>

                <div className={`h-0.5 flex-1 ${currentStep >= 3 ? 'bg-teal-400' : 'bg-slate-700'}`} />

                <div className={`flex items-center gap-1.5 font-bold ${currentStep >= 3 ? 'text-teal-300' : 'text-slate-400'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${currentStep >= 3 ? 'bg-teal-400 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                    3
                  </span>
                  <span>3. Přístup</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6 space-y-4">

            {/* Feedback Banner System (Loading, Success, Warning, Error) */}
            <AnimatePresence mode="wait">
              {status.type !== 'idle' && (
                <motion.div
                  key={status.type + status.text}
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  aria-live="polite"
                  className={`p-4 rounded-xl border text-xs leading-relaxed transition-all shadow-xs ${
                    status.type === 'loading'
                      ? 'bg-slate-900 text-teal-300 border-slate-700 font-medium'
                      : status.type === 'success'
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                      : status.type === 'warning'
                      ? 'bg-amber-50 text-amber-950 border-amber-200'
                      : 'bg-rose-50 text-rose-950 border-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {status.type === 'loading' && (
                      <Loader2 className="w-5 h-5 text-teal-400 animate-spin shrink-0 mt-0.5" />
                    )}
                    {status.type === 'success' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {status.type === 'warning' && (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    {status.type === 'error' && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-1 flex-1">
                      {status.title && (
                        <p className="font-bold text-sm tracking-tight">{status.title}</p>
                      )}
                      <p className="font-medium">{status.text}</p>
                      {status.details && (
                        <p className="text-[11px] opacity-85 pt-1 border-t border-current/10">
                          {status.details}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MODE 1: WELCOME SCREEN CARD UPON SUCCESSFUL AUTH */}
            {mode === 'welcome' && authenticatedUser && (
              <motion.div 
                id="auth-welcome-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 space-y-5 text-center"
              >
                <div className="relative inline-block mx-auto">
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl border-2 border-teal-500 overflow-hidden shadow-lg mx-auto flex items-center justify-center">
                    <img 
                      src={authenticatedUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(authenticatedUser.name)}`} 
                      alt={authenticatedUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                    <BadgeCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-slate-900 font-display">
                    {authenticatedUser.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">{authenticatedUser.email}</p>
                  
                  <div className="pt-2 flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      authenticatedUser.role === 'admin' 
                        ? 'bg-slate-900 text-teal-300 border border-slate-700' 
                        : 'bg-teal-50 text-teal-800 border border-teal-200'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                      {authenticatedUser.role === 'admin' ? 'Hlavní Administrátor portálu' : 'Ověřený člen komunita'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs text-slate-700 space-y-2">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    Odemčené funkce vašeho účtu:
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-slate-650 pl-1">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Generátor právních podání a opatrovnických návrhů</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Diskusní fórum, poradna a komunitní podpora</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>AI Asistent opatrovnického práva Táta má právo</span>
                    </li>
                    {authenticatedUser.role === 'admin' && (
                      <li className="flex items-center gap-2 font-bold text-slate-900">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>Kompletní Administrátorské centrum a správa článků</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-2 space-y-2">
                  {passkeyAvailable && (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleCreatePasskey}
                      className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      <Fingerprint className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Uložit Passkey pro toto zařízení (Otisk / FaceID)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleFinishWelcome}
                    className="w-full py-3 bg-gradient-to-r from-teal-600 to-slate-800 hover:from-teal-700 hover:to-slate-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Vstoupit na portál ({welcomeCountdown}s)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* MODE 2: BACKUP PASSWORD SETUP */}
            {mode === 'password_setup' && (
              <form onSubmit={handleSetupPasswordSubmit} className="space-y-4" id="password-setup-state">
                <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Zabezpečení účtu heslem</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Přihlásil(a) jste se přes Google! Chceme zajistit, abyste měl(a) přístup <strong>i při výpadku služby Google</strong>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Google E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      disabled
                      value={googleUser?.email || auth.currentUser?.email || ''}
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-100 text-slate-500 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Záložní heslo</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showSetupPasswordText ? 'text' : 'password'}
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      placeholder="Minimálně 6 znaků"
                      className="w-full pl-9 pr-24 py-2.5 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSetupPasswordText(!showSetupPasswordText)}
                      className="absolute right-20 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                    >
                      {showSetupPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="absolute right-2 top-2 text-slate-600 hover:text-teal-700 font-bold text-[10px] bg-slate-100 hover:bg-teal-50 border border-slate-200 px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3 shrink-0" />
                      <span>Generovat</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (googleUser) {
                        setAuthenticatedUser(googleUser);
                        setMode('welcome');
                      } else {
                        onClose();
                      }
                    }}
                    className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
                  >
                    Přeskočit
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isValidPassword(setupPassword)}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer text-center"
                  >
                    {loading ? 'Ukládám...' : 'Uložit a dokončit'}
                  </button>
                </div>
              </form>
            )}

            {/* MODE 3: FORGOT PASSWORD */}
            {mode === 'forgot_password' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4" id="forgot-password-state">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zadejte svou e-mailovou adresu spojenou s účtem. Zašleme vám bezpečnostní odkaz pro nastavení nového hesla.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">E-mailová adresa</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      ref={firstInputRef}
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="novak@synthesis.cz"
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setStatus({ type: 'idle', text: '' });
                    }}
                    className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
                  >
                    Zpět k přihlášení
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isValidEmail(resetEmail)}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{loading ? 'Odesílám...' : 'Odeslat odkaz'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* MODE 4 & 5: LOGIN & REGISTER FORMS */}
            {(mode === 'login' || mode === 'register') && (
              <div className="space-y-4">
                {/* Passkey / Biometric Login Button (Primary if supported) */}
                {passkeyAvailable && (
                  <button
                    id="passkey-login-btn"
                    type="button"
                    disabled={loading}
                    onClick={handlePasskeyLogin}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400/30 group"
                  >
                    <Fingerprint className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform shrink-0" />
                    <span>Přihlásit se pomocí Passkey (Otisk prstu / FaceID)</span>
                  </button>
                )}

                {/* Google OAuth Button */}
                <button
                  id="google-login-btn"
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-3xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Bezpečné přihlášení přes Google</span>
                </button>

                {/* Google Verification Guide Collapsible */}
                <div id="google-verification-notice" className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
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
                      className="mt-2.5 pt-2.5 border-t border-slate-200 text-slate-600 space-y-2 text-[11px] leading-relaxed"
                    >
                      <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-lg font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <p>Aplikace je 100% bezpečná. Autor pouze neprošel placeným firemním ověřením Google.</p>
                      </div>

                      <p className="font-semibold text-slate-700">Postup přihlášení:</p>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                        <li>Klikněte na tlačítko Google výše.</li>
                        <li>Na obrazovce varování zvolte vlevo dole <strong>Rozšířené možnosti</strong> (Advanced).</li>
                        <li>Klikněte na <strong>Přejít na web pomocotcum.firebaseapp.com</strong>.</li>
                      </ol>
                    </motion.div>
                  )}
                </div>

                {/* Quick Admin Access Bar - ONLY shown on local development (hidden on Vercel / production) */}
                {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2" id="admin-quick-access-panel">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider font-mono">
                        Rychlé přihlášení vývojáře (Pouze Localhost)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => setDemoUser('mallfuriionn')}
                        className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Přihlásit se jako Jiří Šár (mallfuriionn@gmail.com)"
                      >
                        Jiří Šár
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => setDemoUser('sarji')}
                        className="py-1.5 px-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Přihlásit se jako Sarji (sarji@seznam.cz)"
                      >
                        Sarji
                      </button>
                    </div>
                  </div>
                )}

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Nebo e-mailem
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Form with Real-time Validation */}
                <form onSubmit={handleSubmit} className="space-y-3.5" id="auth-form">
                  {mode === 'register' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-700">Vaše celé jméno</label>
                        {touched.name && (
                          <span className="text-[10px] font-semibold">
                            {isValidName(name) ? (
                              <span className="text-emerald-600 flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Platné
                              </span>
                            ) : (
                              <span className="text-rose-500">Zadejte alespoň 2 znaky</span>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          ref={firstInputRef}
                          id="auth-name-input"
                          type="text"
                          disabled={loading}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setTouched(prev => ({ ...prev, name: true }));
                          }}
                          onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                          placeholder="Např. Ing. Petr Novák"
                          className={`w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border rounded-xl outline-none transition-all ${
                            touched.name
                              ? isValidName(name) 
                                ? 'border-emerald-500 focus:border-emerald-600' 
                                : 'border-rose-400 focus:border-rose-500'
                              : 'border-slate-200 focus:border-teal-500'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">E-mailová adresa</label>
                      {touched.email && email && (
                        <span className="text-[10px] font-semibold">
                          {isValidEmail(email) ? (
                            <span className="text-emerald-600 flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Správný formát
                            </span>
                          ) : (
                            <span className="text-rose-500">Neplatný e-mail</span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        ref={mode === 'login' ? firstInputRef : undefined}
                        id="auth-email-input"
                        type="email"
                        disabled={loading}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setTouched(prev => ({ ...prev, email: true }));
                        }}
                        onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                        placeholder="novak@synthesis.cz"
                        className={`w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border rounded-xl outline-none transition-all ${
                          touched.email && email
                            ? isValidEmail(email) 
                              ? 'border-emerald-500 focus:border-emerald-600' 
                              : 'border-rose-400 focus:border-rose-500'
                            : 'border-slate-200 focus:border-teal-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">Heslo</label>
                      {mode === 'register' && password && (
                        <span className={`text-[10px] font-bold ${
                          strengthInfo.score <= 25 ? 'text-rose-500' :
                          strengthInfo.score <= 50 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          Sila: {strengthInfo.label}
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="auth-password-input"
                        type={showPassword ? 'text' : 'password'}
                        disabled={loading}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setTouched(prev => ({ ...prev, password: true }));
                        }}
                        onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                        placeholder="••••••••"
                        className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border rounded-xl outline-none transition-all ${
                          touched.password && password
                            ? isValidPassword(password)
                              ? 'border-emerald-500 focus:border-emerald-600'
                              : 'border-rose-400 focus:border-rose-500'
                            : 'border-slate-200 focus:border-teal-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                        title={showPassword ? "Skrýt heslo" : "Zobrazit heslo"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator Bar */}
                    {mode === 'register' && password && (
                      <div className="mt-1.5 space-y-1">
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${strengthInfo.color}`} 
                            style={{ width: `${strengthInfo.score}%` }} 
                          />
                        </div>
                      </div>
                    )}

                    {mode === 'login' && (
                      <div className="flex justify-end text-[11px] mt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot_password');
                            setResetEmail(email);
                            setStatus({ type: 'idle', text: '' });
                          }}
                          className="text-slate-500 hover:text-teal-600 transition-colors font-medium cursor-pointer"
                        >
                          Zapomenuté heslo?
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    id="auth-submit-btn"
                    type="submit"
                    disabled={loading || !isFormValid()}
                    className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-slate-800 text-white font-bold text-xs rounded-xl hover:from-teal-700 hover:to-slate-900 shadow-md transition-all mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{mode === 'register' ? 'Vytvořit nový účet' : 'Přihlásit se do systému'}</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      id="auth-toggle-mode"
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setMode(mode === 'register' ? 'login' : 'register');
                        setStatus({ type: 'idle', text: '' });
                      }}
                      className="text-xs text-slate-600 hover:text-teal-600 font-medium transition-colors cursor-pointer"
                    >
                      {mode === 'register' 
                        ? 'Máte již účet? Přihlaste se' 
                        : 'Nemáte účet? Zaregistrujte se zdarma'}
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
