import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getStoredSupabaseConfig() {
  if (typeof window === 'undefined') {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    };
  }

  const storedUrl = localStorage.getItem('supabase_url');
  const storedKey = localStorage.getItem('supabase_anon_key');

  return {
    url: storedUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: storedKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabase_url', url.trim());
    localStorage.setItem('supabase_anon_key', anonKey.trim());
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseInstance;
}

export function resetSupabaseClient() {
  supabaseInstance = null;
}
