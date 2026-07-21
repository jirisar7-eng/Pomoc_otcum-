/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  KeyRound, 
  Fingerprint, 
  Mail, 
  Smartphone, 
  Laptop, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Clock, 
  Lock, 
  RefreshCw, 
  ChevronRight,
  ShieldAlert,
  Sliders,
  Sparkles,
  Zap,
  Globe,
  Trash2,
  Check
} from 'lucide-react';
import { User, AuthProviderType, ActiveDevice, LinkedIdentity } from '../types';
import { 
  linkIdentityProvider, 
  unlinkIdentityProvider, 
  revokeDeviceSession, 
  toggleTwoFactor, 
  sendMagicLink 
} from '../services/identityHubService';
import { isBiometricsAvailable } from '../utils/passkey';
import { registerPasskey } from '../services/passkeyService';

interface IdentityHubSettingsProps {
  currentUser: User;
  onUpdateCurrentUser: (user: User) => void;
}

export default function IdentityHubSettings({
  currentUser,
  onUpdateCurrentUser
}: IdentityHubSettingsProps) {
  // Modal / Form States
  const [activeTab, setActiveTab] = useState<'methods' | 'devices' | 'audit'>('methods');
  const [isLinking, setIsLinking] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Passkey Registration state
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 2FA state
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  // Magic Link testing modal
  const [magicSent, setMagicSent] = useState(false);
  const [magicCode, setMagicCode] = useState('');

  const linkedIdentities: LinkedIdentity[] = currentUser.linkedIdentities || [
    {
      provider: 'google',
      emailOrDetail: currentUser.email,
      connectedAt: currentUser.createdAt || new Date().toISOString(),
      isPrimary: true
    }
  ];

  const hasGoogle = linkedIdentities.some(l => l.provider === 'google') || currentUser.hasGoogle;
  const hasPassword = linkedIdentities.some(l => l.provider === 'password') || currentUser.hasPassword;
  const hasPasskey = linkedIdentities.some(l => l.provider === 'passkey') || currentUser.hasPasskey;
  const hasMagicLink = linkedIdentities.some(l => l.provider === 'magic_link') || currentUser.hasMagicLink || true;

  const showMsg = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Add Passkey handler
  const handleAddPasskey = async () => {
    setPasskeyLoading(true);
    try {
      const result = await registerPasskey(currentUser);
      if (result.success) {
        const updated = await linkIdentityProvider(currentUser, 'passkey', 'Biometrický otisk / FaceID');
        onUpdateCurrentUser(updated);
        showMsg('success', 'Nové biometrické Passkey bylo úspěšně vytvořeno a připojeno k vašemu účtu.');
      } else {
        showMsg('error', result.error || 'Nepodařilo se vytvořit Passkey.');
      }
    } catch (e: any) {
      showMsg('error', e.message || 'Biometrické ověření selhalo.');
    } finally {
      setPasskeyLoading(false);
    }
  };

  // Unlink Provider Handler
  const handleUnlink = async (provider: AuthProviderType) => {
    try {
      const updated = await unlinkIdentityProvider(currentUser, provider);
      onUpdateCurrentUser(updated);
      showMsg('info', `Přihlašovací metoda ${provider.toUpperCase()} byla bezpečně odpojena.`);
    } catch (e: any) {
      showMsg('error', e.message || 'Metodu nelze odpojit.');
    }
  };

  // Toggle 2FA Handler
  const handleToggle2FA = async () => {
    setTwoFactorLoading(true);
    try {
      const targetState = !currentUser.hasTwoFactor;
      const updated = await toggleTwoFactor(currentUser, targetState, 'app');
      onUpdateCurrentUser(updated);
      showMsg('success', targetState ? 'Dvoufázové ověření (2FA) bylo zapnuto.' : 'Dvoufázové ověření bylo vypnuto.');
    } catch (e: any) {
      showMsg('error', 'Nepodařilo se změnit nastavení 2FA.');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Revoke device session
  const handleRevokeDevice = async (deviceId: string) => {
    try {
      const updated = await revokeDeviceSession(currentUser, deviceId);
      onUpdateCurrentUser(updated);
      showMsg('info', 'Zařízení bylo úspěšně odhlášeno.');
    } catch (e: any) {
      showMsg('error', 'Nepodařilo se odhlásit zařízení.');
    }
  };

  // Send Magic Link test
  const handleSendMagicTest = () => {
    const res = sendMagicLink(currentUser.email);
    setMagicCode(res.code);
    setMagicSent(true);
    showMsg('success', `Testovací Magic Link s kódem ${res.code} byl vygenerován.`);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6 animate-fadeIn" id="identity-hub-settings">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            <h3 className="text-xl font-bold font-display text-slate-900 tracking-tight">
              Centrum identity & Zabezpečení (Identity Hub)
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            Váš účet má jedno <strong>UID ({currentUser.id.substring(0, 10)}...)</strong> a jeden sjednocený profil. Zde můžete připojovat i odpojovat způsoby přihlášení a spravovat aktivní zařízení.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('methods')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'methods' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-teal-600" />
            <span>Přihlašovací metody</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('devices')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'devices' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-indigo-600" />
            <span>Centrum zařízení</span>
            {currentUser.activeDevices && currentUser.activeDevices.length > 0 && (
              <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {currentUser.activeDevices.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Audit historie</span>
          </button>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-fadeIn ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
          message.type === 'error' ? 'bg-rose-50 text-rose-900 border border-rose-200' :
          'bg-indigo-50 text-indigo-900 border border-indigo-200'
        }`}>
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* TAB 1: PŘIHLAŠOVACÍ METODY */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1: Google OAuth */}
            <div className={`p-5 rounded-2xl border transition-all ${
              hasGoogle ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-2xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Google účet</h4>
                    <p className="text-[11px] text-slate-500 font-mono">{currentUser.email}</p>
                  </div>
                </div>

                {hasGoogle ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold flex items-center gap-1 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Propojeno</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-bold">
                    Neaktivní
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Umožňuje přihlášení na 1 kliknutí přes Google OAuth bez zadávání hesla.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                {hasGoogle ? (
                  <button
                    type="button"
                    onClick={() => handleUnlink('google')}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    Odpojit Google účet
                  </button>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500">
                    Automaticky se propojí při přihlášení přes Google.
                  </span>
                )}
              </div>
            </div>

            {/* Card 2: Passkey / WebAuthn */}
            <div className={`p-5 rounded-2xl border transition-all ${
              hasPasskey ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl flex items-center justify-center shadow-2xs">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Biometrický Passkey</h4>
                    <p className="text-[11px] text-slate-500 font-mono">Otisk prstu / FaceID</p>
                  </div>
                </div>

                {hasPasskey ? (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold flex items-center gap-1 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Aktivní</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold border border-amber-300">
                    Doporučeno
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Nejbezpečnější přihlašování bez hesla uložené přímo v čipu vašeho telefonu nebo počítače.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  type="button"
                  disabled={passkeyLoading}
                  onClick={handleAddPasskey}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {passkeyLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{hasPasskey ? 'Přidat další Passkey' : 'Vytvořit Passkey zdarma'}</span>
                </button>
              </div>
            </div>

            {/* Card 3: E-mail + Heslo */}
            <div className={`p-5 rounded-2xl border transition-all ${
              hasPassword ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl flex items-center justify-center shadow-2xs">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">E-mail + Heslo</h4>
                    <p className="text-[11px] text-slate-500 font-mono">Klasické heslo k účtu</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold flex items-center gap-1 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Nastaveno</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Klasické heslo jako záložní metoda. Funkční i v offline režimu.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">
                  Heslo je zašifrováno
                </span>
              </div>
            </div>

            {/* Card 4: Magic Link (E-mail 1 kliknutí) */}
            <div className="p-5 rounded-2xl border bg-emerald-50/30 border-emerald-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 text-teal-800 border border-teal-200 rounded-xl flex items-center justify-center shadow-2xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Magic Link</h4>
                    <p className="text-[11px] text-slate-500 font-mono">Odkaz / Kód na e-mail</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold flex items-center gap-1 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Aktivní</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Při přihlášení obdržíte na e-mail ověřovací kód pro přihlášení bez zadávání hesla.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSendMagicTest}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vygenerovat testovací Magic Kód</span>
                </button>
              </div>
            </div>

          </div>

          {/* 2FA Section Box */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-bold font-display text-white">
                  Dvoufázové ověření (2FA)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Přidává druhý stupeň ochrany k vašemu účtu. Při každém přihlášení z nového zařízení budete vyzváni k zadání kódu.
              </p>
            </div>

            <button
              type="button"
              disabled={twoFactorLoading}
              onClick={handleToggle2FA}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                currentUser.hasTwoFactor 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black'
              }`}
            >
              {twoFactorLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{currentUser.hasTwoFactor ? 'Vypnout 2FA' : 'Zapnout dvoufázové ověření'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CENTRUM ZAŘÍZENÍ */}
      {activeTab === 'devices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 font-display flex items-center gap-2">
              <Laptop className="w-4.5 h-4.5 text-indigo-600" />
              Aktivní relace a spárovaná zařízení
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              Celkem: {currentUser.activeDevices?.length || 1}
            </span>
          </div>

          <div className="space-y-3">
            {(currentUser.activeDevices || [
              {
                id: 'current_dev',
                deviceName: 'Chrome na Windows (Tento počítač)',
                deviceType: 'desktop' as const,
                browser: 'Google Chrome',
                os: 'Windows 11',
                ipAddress: '185.xxx.xxx.xxx (Ověřeno)',
                lastActive: new Date().toISOString(),
                isCurrent: true
              }
            ]).map((device) => (
              <div 
                key={device.id} 
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                  device.isCurrent ? 'bg-indigo-50/40 border-indigo-200 shadow-3xs' : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    device.deviceType === 'mobile' ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {device.deviceType === 'mobile' ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-slate-900">{device.deviceName}</strong>
                      {device.isCurrent && (
                        <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-md text-[9px] font-mono font-bold uppercase tracking-wider">
                          Aktuální relace
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono mt-0.5">
                      <span>Prohlížeč: {device.browser}</span>
                      <span>•</span>
                      <span>Poslední aktivita: {new Date(device.lastActive).toLocaleString('cs-CZ')}</span>
                    </div>
                  </div>
                </div>

                {!device.isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRevokeDevice(device.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    title="Odhlásit vzdálené zařízení"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Odhlásit</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT HISTORIE */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800 font-display flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-amber-600" />
            Bezpečnostní audit a historie přihlašování
          </h4>

          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
            {(currentUser.securityAuditLogs || [
              {
                id: 'audit_init',
                timestamp: new Date().toISOString(),
                action: 'Přihlášení do Identity Hubu',
                method: 'Google OAuth / Heslo',
                deviceInfo: 'Google Chrome na Windows PC',
                status: 'SUCCESS' as const,
                details: 'Úspěšné ověření jednohodnotového profilu.'
              }
            ]).map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">{log.action}</strong>
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5">{log.details}</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">Metoda: {log.method} &bull; {log.deviceInfo}</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString('cs-CZ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
