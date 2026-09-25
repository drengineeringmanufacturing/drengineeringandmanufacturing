import { NextResponse } from 'next/server';

/**
 * Parses allowed CORS origins from the comma-separated environment variable CORS_ALLOWED_ORIGINS.
 */
export function getAllowedOrigins(): string[] {
  const envOrigins = process.env.CORS_ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS || '';

  if (envOrigins.trim()) {
    return envOrigins
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  // Fallback defaults for local development
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];
}

export function getCorsHeaders(request?: Request): Record<string, string> {
  const allowedOrigins = getAllowedOrigins();
  const origin = request?.headers.get('origin') || '';

  const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*') || !origin;
  const resolvedOrigin = isAllowed ? (origin || allowedOrigins[0] || '*') : (allowedOrigins[0] || '*');

  return {
    'Access-Control-Allow-Origin': resolvedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function handleCorsPreflight(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}
