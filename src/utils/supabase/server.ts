import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://brqqinbxpluzrkrvpfqs.supabase.co';

const supabaseKey =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_7cyVhGBBXM0N99dcqjGZxg_O3dq748D';

export interface SimpleCookieStore {
  getAll: () => Array<{ name: string; value: string }>;
  setAll: (cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) => void;
}

export const createClient = (cookieStore?: SimpleCookieStore) => {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll() ?? [];
        },
        setAll(cookiesToSet) {
          if (cookieStore) {
            try {
              cookieStore.setAll(cookiesToSet);
            } catch {
              // Ignore if called in read-only server context
            }
          }
        },
      },
    }
  );
};
