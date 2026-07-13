/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { User, UserRole } from '../types';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !name)) {
      setError('Prosím vyplňte všechna povinná pole.');
      return;
    }

    if (password.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků.');
      return;
    }

    // Simulated login/register process
    setSuccess(true);
    setTimeout(() => {
      const mockUser: User = {
        id: isRegister ? 'usr-' + Math.random().toString(36).substr(2, 9) : (email.includes('admin') ? 'usr-admin' : 'usr-custom'),
        email: email,
        name: isRegister ? name : (email.includes('admin') ? 'Administrátor OS' : name || 'Aktivní Rodič'),
        role: email.includes('admin') ? 'admin' : role,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name || email)}`,
        createdAt: new Date().toISOString()
      };
      
      onLogin(mockUser);
      setSuccess(false);
      onClose();
    }, 1200);
  };

  const setDemoUser = (type: 'user' | 'admin') => {
    if (type === 'admin') {
      setEmail('admin@synthesis.cz');
      setPassword('admin123');
      setName('Administrátor OS');
      setRole('admin');
    } else {
      setEmail('petr.novak@email.cz');
      setPassword('rodic123');
      setName('Petr Novák');
      setRole('user');
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
                <p className="text-slate-500 text-sm mt-1">Vítejte zpět v ekosystému Synthesis Hub.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
                {error && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs border border-rose-100" id="auth-error">
                    {error}
                  </div>
                )}

                {/* Quick Demo Accout buttons */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-2 text-center">
                    Rychlé demo účty pro testování RBAC:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="demo-user-btn"
                      type="button"
                      onClick={() => setDemoUser('user')}
                      className="py-1.5 px-3 text-xs bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-teal-600" />
                      Role Rodič
                    </button>
                    <button
                      id="demo-admin-btn"
                      type="button"
                      onClick={() => setDemoUser('admin')}
                      className="py-1.5 px-3 text-xs bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      Role Administrátor
                    </button>
                  </div>
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
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
