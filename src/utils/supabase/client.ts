import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://brqqinbxpluzrkrvpfqs.supabase.co';

const supabaseKey =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_7cyVhGBBXM0N99dcqjGZxg_O3dq748D';

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
