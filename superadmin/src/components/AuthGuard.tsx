'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isConfigured || !user) {
        router.push('/login');
      }
    }
  }, [user, loading, isConfigured, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060b14] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        <p className="text-xs font-mono tracking-wider uppercase text-slate-500">
          Verifying Superadmin Session...
        </p>
      </div>
    );
  }

  if (!isConfigured || !user) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
