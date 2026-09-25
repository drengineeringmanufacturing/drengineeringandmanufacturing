import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/products-db';
import { authenticateRequest } from '@/lib/auth-server';
import { getCorsHeaders, handleCorsPreflight } from '@/lib/cors';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json(
        { error: `Product with ID '${id}' was not found.` },
        { status: 404, headers: getCorsHeaders(request) }
      );
    }

    return NextResponse.json(product, {
      status: 200,
      headers: getCorsHeaders(request),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch product';
    return NextResponse.json({ error: msg }, {
      status: 500,
      headers: getCorsHeaders(request),
    });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

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

    const updated = await updateProduct(id, {
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      imageUrls: Array.isArray(body.imageUrls) ? body.imageUrls : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
    });

    if (!updated) {
      return NextResponse.json(
        { error: `Product with ID '${id}' was not found.` },
        { status: 404, headers: getCorsHeaders(request) }
      );
    }

    return NextResponse.json(updated, {
      status: 200,
      headers: getCorsHeaders(request),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update product';
    return NextResponse.json({ error: msg }, {
      status: 500,
      headers: getCorsHeaders(request),
    });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  // Check authorization
  const auth = await authenticateRequest(request);
  if (!auth.user) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized. Valid Supabase session required.' },
      { status: 401, headers: getCorsHeaders(request) }
    );
  }

  try {
    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json(
        { error: `Product with ID '${id}' was not found.` },
        { status: 404, headers: getCorsHeaders(request) }
      );
    }

    return new NextResponse(null, {
      status: 204,
      headers: getCorsHeaders(request),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete product';
    return NextResponse.json({ error: msg }, {
      status: 500,
      headers: getCorsHeaders(request),
    });
  }
}
