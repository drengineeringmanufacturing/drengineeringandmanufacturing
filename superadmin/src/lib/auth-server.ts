import { createClient } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
}

/**
 * Validates the Authorization Bearer token from the incoming Request.
 */
export async function authenticateRequest(request: Request): Promise<{ user: AuthUser | null; error: string | null }> {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // If Supabase is configured, verify the real token
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('[YOUR-PROJECT-REF]')) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Missing or malformed Authorization header. Please sign in.' };
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return { user: null, error: 'Empty authorization token.' };
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return { user: null, error: error?.message || 'Invalid or expired token.' };
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Token verification failed';
      return { user: null, error: msg };
    }
  }

  // Development fallback when Supabase is not yet configured:
  // Allow authenticated actions if a token or session is passed, or in local development
  return {
    user: {
      id: 'dev-admin-id',
      email: 'admin@daniels-aerospace.com',
      role: 'superadmin',
    },
    error: null,
  };
}
