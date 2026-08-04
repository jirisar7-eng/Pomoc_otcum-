/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabase, isSupabaseConfigured } from './supabase';
import { User, UserRole } from '../types';

/**
 * Authenticates user strictly against Supabase Auth (signInWithPassword)
 */
export async function loginWithSupabasePassword(email: string, pass: string): Promise<User> {
  const supabase = getSupabase();
  const lowerEmail = email.toLowerCase().trim();

  if (!supabase || !isSupabaseConfigured()) {
    throw new Error('Supabase klient není nakonfigurován. Nastavte prosím platný VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY.');
  }

  // 1. Real authentication against Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email: lowerEmail,
    password: pass,
  });

  if (error) {
    let message = 'Přihlášení se nezdařilo. Zkontrolujte zadaný e-mail a heslo.';
    if (error.message.includes('Invalid login credentials') || error.status === 400 || error.message.includes('Invalid credentials')) {
      message = 'Nesprávný e-mail nebo heslo. Ověření v databázi selhalo.';
    } else if (error.message.includes('Email not confirmed')) {
      message = 'E-mailová adresa ještě nebyla potvrzena. Zkontrolujte svou e-mailovou schránku.';
    } else if (error.message.includes('Too many requests')) {
      message = 'Příliš mnoho neúspěšných pokusů. Zkuste to za chvíli.';
    }

    const errObj = new Error(message);
    (errObj as any).code = 'auth/invalid-credential';
    (errObj as any).status = error.status;
    (errObj as any).originalError = error;
    throw errObj;
  }

  if (!data?.user) {
    throw new Error('Nepodařilo se získať uživatelská data ze Supabase Auth.');
  }

  const userId = data.user.id;

  // 2. Fetch role and name from 'profiles' table
  let role: UserRole = 'user';
  let name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || lowerEmail.split('@')[0];

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, full_name, display_name, name')
      .eq('id', userId)
      .maybeSingle();

    if (profile) {
      if (profile.role) {
        role = profile.role as UserRole;
      }
      name = profile.display_name || profile.full_name || profile.name || name;
    }
  } catch (err) {
    console.warn("Nedaří se načíst profil z tabulky profiles:", err);
  }

  // Hardened admin check for system superadmins
  if (lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail === 'admin@synthesis.cz' || lowerEmail === 'sarji@seznam.cz') {
    role = 'admin';
  }

  const authenticatedUser: User = {
    id: userId,
    email: data.user.email || lowerEmail,
    name: name,
    role: role,
    avatar: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    createdAt: data.user.created_at || new Date().toISOString()
  };

  // 3. Store active session cookie and localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('synthesis_hub_local_user', JSON.stringify(authenticatedUser));
    document.cookie = `synthesis_user_session=${encodeURIComponent(JSON.stringify(authenticatedUser))}; path=/; max-age=604800; SameSite=Lax`;
  }

  return authenticatedUser;
}

/**
 * Registers new user strictly via Supabase Auth (signUp) and creates a profile row
 */
export async function registerWithSupabasePassword(email: string, pass: string, name: string): Promise<User> {
  const supabase = getSupabase();
  const lowerEmail = email.toLowerCase().trim();

  if (!supabase || !isSupabaseConfigured()) {
    throw new Error('Supabase klient není nakonfigurován.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: lowerEmail,
    password: pass,
    options: {
      data: {
        full_name: name,
        display_name: name,
        name: name
      }
    }
  });

  if (error) {
    let message = error.message;
    if (error.message.includes('User already registered') || error.message.includes('already exists')) {
      message = 'Tento e-mail již používá jiný účet. Přihlaste se prosím heslem.';
    } else if (error.message.includes('Password should be at least')) {
      message = 'Heslo musí mít minimálně 6 znaků.';
    }
    const errObj = new Error(message);
    (errObj as any).code = 'auth/email-already-in-use';
    throw errObj;
  }

  if (!data?.user) {
    throw new Error('Registrace v Supabase Auth selhala.');
  }

  let role: UserRole = 'user';
  if (lowerEmail === 'mallfuriionn@gmail.com' || lowerEmail === 'admin@synthesis.cz' || lowerEmail === 'sarji@seznam.cz' || lowerEmail.includes('admin@')) {
    role = 'admin';
  }

  // Insert profile row into 'profiles' table with strict RLS compatibility
  try {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: lowerEmail,
      full_name: name,
      display_name: name,
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn("Chyba při vytváření záznamu v profiles:", err);
  }

  const createdUser: User = {
    id: data.user.id,
    email: data.user.email || lowerEmail,
    name: name,
    role: role,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    createdAt: data.user.created_at || new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('synthesis_hub_local_user', JSON.stringify(createdUser));
    document.cookie = `synthesis_user_session=${encodeURIComponent(JSON.stringify(createdUser))}; path=/; max-age=604800; SameSite=Lax`;
  }

  return createdUser;
}
