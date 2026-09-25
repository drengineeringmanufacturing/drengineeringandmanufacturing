import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders, handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}

export async function GET(request: NextRequest) {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('[YOUR-PROJECT-REF]')
  );

  return NextResponse.json({
    status: 'online',
    service: 'Daniels Superadmin Full-Stack Backend',
    framework: 'Next.js 16 (Node/TypeScript)',
    database: supabaseConfigured ? 'Supabase PostgreSQL (Connected)' : 'Local Memory Store (Active)',
    timestamp: new Date().toISOString(),
  }, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}
