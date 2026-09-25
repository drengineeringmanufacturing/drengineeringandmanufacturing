'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase, getStoredSupabaseConfig, resetSupabaseClient, saveStoredSupabaseConfig } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  token: string | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateSupabaseConfig: (url: string, anonKey: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  token: null,
  loading: true,
  isConfigured: false,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  updateSupabaseConfig: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const config = getStoredSupabaseConfig();
    const hasConfig = Boolean(config.url && config.anonKey);
    setIsConfigured(hasConfig);

    if (!hasConfig) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error('Supabase is not configured. Please provide your Supabase URL and Anon Key.') };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error('Supabase is not configured. Please provide your Supabase URL and Anon Key.') };
    }
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setToken(null);
  };

  const updateSupabaseConfig = (url: string, anonKey: string) => {
    saveStoredSupabaseConfig(url, anonKey);
    resetSupabaseClient();
    const hasConfig = Boolean(url && anonKey);
    setIsConfigured(hasConfig);

    if (hasConfig) {
      const supabase = getSupabase();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
          setToken(session?.access_token ?? null);
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        token,
        loading,
        isConfigured,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateSupabaseConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
