import { NextResponse } from 'next/server';
import { fetchLiveProducts } from '@/lib/db-products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await fetchLiveProducts();
    return NextResponse.json({ products }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
