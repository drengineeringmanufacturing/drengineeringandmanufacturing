import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/products-db';
import { authenticateRequest } from '@/lib/auth-server';
import { getCorsHeaders, handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag') || undefined;
  const search = searchParams.get('search') || undefined;

  try {
    const products = await getAllProducts({ tag, search });
    return NextResponse.json(products, {
      status: 200,
      headers: getCorsHeaders(request),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve products';
    return NextResponse.json({ error: msg }, {
      status: 500,
      headers: getCorsHeaders(request),
    });
  }
}

export async function POST(request: NextRequest) {
  // Check authorization
  const auth = await authenticateRequest(request);
  if (!auth.user) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized. Valid Supabase session required.' },
      { status: 401, headers: getCorsHeaders(request) }
    );
  }

  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Product name is required (minimum 2 characters).' },
        { status: 400, headers: getCorsHeaders(request) }
      );
    }

    if (body.price === undefined || isNaN(Number(body.price)) || Number(body.price) < 0) {
      return NextResponse.json(
        { error: 'Valid non-negative price is required.' },
        { status: 400, headers: getCorsHeaders(request) }
      );
    }

    const created = await createProduct({
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      imageUrls: Array.isArray(body.imageUrls) ? body.imageUrls : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
    });

    return NextResponse.json(created, {
      status: 201,
      headers: getCorsHeaders(request),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create product';
    return NextResponse.json({ error: msg }, {
      status: 500,
      headers: getCorsHeaders(request),
    });
  }
}
