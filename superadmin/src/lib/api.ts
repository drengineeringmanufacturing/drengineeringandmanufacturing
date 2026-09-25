import { Product, CreateProductInput, UpdateProductInput } from '@/types/product';
import { getSupabase } from './supabase';

function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    return cleanPath;
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const cleanBase = envUrl.replace(/\/api\/?$/, '');
  return `${cleanBase}${cleanPath}`;
}

if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('daniels_admin_products');
  } catch {}
}

async function getAuthHeaders(token?: string | null): Promise<HeadersInit> {
  const headers: Record<string, string> = {};
  let authToken = token;

  if (!authToken && typeof window !== 'undefined') {
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        authToken = data.session?.access_token || null;
      }
    } catch {
      // ignore
    }
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
}

export const productsApi = {
  async getStatus(): Promise<{ online: boolean; url: string }> {
    try {
      const res = await fetch(getApiUrl('/api/health'), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      return { online: res.ok, url: getApiUrl('/api') };
    } catch {
      return { online: false, url: getApiUrl('/api') };
    }
  },

  async getAll(params?: { tag?: string; search?: string }): Promise<{ products: Product[]; isLiveApi: boolean }> {
    const query = new URLSearchParams();
    if (params?.tag) query.set('tag', params.tag);
    if (params?.search) query.set('search', params.search);

    const queryString = query.toString();
    const endpoint = `${getApiUrl('/api/products')}${queryString ? `?${queryString}` : ''}`;

    try {
      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.products || [];
      return { products: list, isLiveApi: true };
    } catch (err) {
      console.error('Failed to fetch products from API endpoint:', endpoint, err);
      return { products: [], isLiveApi: false };
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(getApiUrl(`/api/products/${id}`), {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to get product by id:', err);
      return null;
    }
  },

  async create(input: CreateProductInput, token?: string | null): Promise<{ product: Product; isLiveApi: boolean }> {
    const authHeaders = await getAuthHeaders(token);
    const res = await fetch(getApiUrl('/api/products'), {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || `Failed to create product: ${res.status}`);
    }

    const created: Product = await res.json();
    return { product: created, isLiveApi: true };
  },

  async update(id: string, input: UpdateProductInput, token?: string | null): Promise<{ product: Product; isLiveApi: boolean }> {
    const authHeaders = await getAuthHeaders(token);
    const res = await fetch(getApiUrl(`/api/products/${id}`), {
      method: 'PUT',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || `Failed to update product: ${res.status}`);
    }

    const updated: Product = await res.json();
    return { product: updated, isLiveApi: true };
  },

  async delete(id: string, token?: string | null): Promise<{ success: boolean; isLiveApi: boolean }> {
    const authHeaders = await getAuthHeaders(token);
    const res = await fetch(getApiUrl(`/api/products/${id}`), {
      method: 'DELETE',
      headers: authHeaders,
    });

    if (!res.ok && res.status !== 404) {
      throw new Error(`Failed to delete product: ${res.status}`);
    }

    return { success: true, isLiveApi: true };
  },
};
