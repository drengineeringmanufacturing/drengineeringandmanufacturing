'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Database,
  ArrowRight,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, isConfigured, signInWithEmail, signUpWithEmail, updateSupabaseConfig } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Supabase Setup modal inside login
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isConfigured) {
      setErrorMessage(
        'Supabase project credentials are not configured yet. Click "Configure Supabase" below to enter your Project URL and Anon Key.'
      );
      setShowConfigModal(true);
      return;
    }

    setAuthLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage('Admin account created! Check your email to confirm or sign in now.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error.message);
        } else {
          router.push('/');
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) return;
    updateSupabaseConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
    setShowConfigModal(false);
    setErrorMessage(null);
    setSuccessMessage('Supabase credentials configured! You can now sign in.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060b14] flex items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-600/15 to-blue-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-xl shadow-sky-500/25 border border-sky-400/30 text-2xl font-black">
            D
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
            DR Engineering &amp; Manufacturing
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Superadmin Management Portal
          </p>
        </div>

        {/* Auth Card */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl backdrop-blur-xl">


          {errorMessage && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <p className="flex-1 leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <p className="flex-1 leading-relaxed">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@daniels-aerospace.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 transition-all disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Admin Account' : 'Sign In to Superadmin'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In & Sign Up */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            {isSignUp ? (
              <p>
                Already have an admin account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMessage(null);
                  }}
                  className="text-sky-400 hover:text-sky-300 font-medium hover:underline ml-1"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Need to register your admin account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMessage(null);
                  }}
                  className="text-sky-400 hover:text-sky-300 font-medium hover:underline ml-1"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-500/80" />
          <span>Encrypted Superadmin Access</span>
        </div>
      </div>

      {/* Supabase Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Connect Supabase Auth</h3>
                <p className="text-xs text-slate-400">Enter your project credentials</p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Anon / Public Key <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400 space-y-1">
                <p>
                  Found in your Supabase Dashboard: <strong>Project Settings → API</strong>.
                </p>
                <p>
                  You can also persist them in <code className="text-sky-300">superadmin/.env.local</code>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400 shadow-lg shadow-sky-500/20"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
