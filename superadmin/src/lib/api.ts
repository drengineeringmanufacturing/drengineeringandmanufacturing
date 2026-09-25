import { Product, CreateProductInput, UpdateProductInput } from '@/types/product';
import { getSupabase } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Titanium Aero Turbine Rotor Hub',
    description: 'High-precision 5-axis CNC machined grade-5 titanium rotor hub engineered for high thermal tolerance and dynamic balance.',
    price: 8450.00,
    tags: ['Turbines', 'Titanium', 'Aerospace', 'CNC'],
    imageUrls: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Carbon-Composite Winglet Spar',
    description: 'Autoclave-cured high-modulus carbon fiber winglet structure reducing induced drag by up to 4.2% across subsonic flight profiles.',
    price: 12900.00,
    tags: ['Composites', 'Aerodynamics', 'Carbon Fiber'],
    imageUrls: [
      'https://images.unsplash.com/photo-1517976487502-5f7949442f3c?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Cryogenic Hydraulic Actuator Valve',
    description: 'Hermetically sealed dual-redundant solenoid servo valve rated for extreme cryo operations down to -196°C.',
    price: 3720.50,
    tags: ['Hydraulics', 'Cryogenics', 'Actuators', 'Valves'],
    imageUrls: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_PRODUCTS;
  const raw = localStorage.getItem('daniels_admin_products');
  if (!raw) {
    localStorage.setItem('daniels_admin_products', JSON.stringify(INITIAL_DEMO_PRODUCTS));
    return INITIAL_DEMO_PRODUCTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('daniels_admin_products', JSON.stringify(products));
  }
}

async function getAuthHeaders(token?: string | null): Promise<Record<string, string>> {
  const headers: Record<string, string> = { Accept: 'application/json' };
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
      const res = await fetch(`${API_BASE}/api/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      return { online: res.ok, url: API_BASE || 'http://localhost:3001/api' };
    } catch {
      return { online: false, url: API_BASE || 'http://localhost:3001/api' };
    }
  },

  async getAll(params?: { tag?: string; search?: string }): Promise<{ products: Product[]; isLiveApi: boolean }> {
    const query = new URLSearchParams();
    if (params?.tag) query.set('tag', params.tag);
    if (params?.search) query.set('search', params.search);

    const queryString = query.toString();
    const endpoint = `${API_BASE}/api/products${queryString ? `?${queryString}` : ''}`;

    try {
      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4000),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: Product[] = await res.json();
      return { products: data, isLiveApi: true };
    } catch (err) {
      console.warn('Backend API unreachable or errored, using local storage state:', err);
      let local = getLocalProducts();
      if (params?.tag) {
        const t = params.tag.toLowerCase();
        local = local.filter((p) => p.tags.some((tag) => tag.toLowerCase() === t));
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        local = local.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.tags.some((tag) => tag.toLowerCase().includes(s))
        );
      }
      return { products: local, isLiveApi: false };
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return await res.json();
    } catch {
      const local = getLocalProducts();
      return local.find((p) => p.id === id) || null;
    }
  },

  async create(input: CreateProductInput, token?: string | null): Promise<{ product: Product; isLiveApi: boolean }> {
    try {
      const authHeaders = await getAuthHeaders(token);
      const res = await fetch(`${API_BASE}/api/products`, {
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
    } catch (err) {
      console.warn('Backend API unreachable, saving product locally:', err);
      const newProduct: Product = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`,
        name: input.name,
        description: input.description,
        imageUrls: input.imageUrls,
        price: input.price,
        tags: input.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const list = [newProduct, ...getLocalProducts()];
      saveLocalProducts(list);
      return { product: newProduct, isLiveApi: false };
    }
  },

  async update(id: string, input: UpdateProductInput, token?: string | null): Promise<{ product: Product; isLiveApi: boolean }> {
    try {
      const authHeaders = await getAuthHeaders(token);
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
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
    } catch (err) {
      console.warn('Backend API unreachable, updating product locally:', err);
      const list = getLocalProducts().map((p) =>
        p.id === id
          ? {
              ...p,
              name: input.name,
              description: input.description,
              imageUrls: input.imageUrls,
              price: input.price,
              tags: input.tags,
              updatedAt: new Date().toISOString(),
            }
          : p
      );
      saveLocalProducts(list);
      const updated = list.find((p) => p.id === id)!;
      return { product: updated, isLiveApi: false };
    }
  },

  async delete(id: string, token?: string | null): Promise<{ success: boolean; isLiveApi: boolean }> {
    try {
      const authHeaders = await getAuthHeaders(token);
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok && res.status !== 404) {
        throw new Error(`Failed to delete product: ${res.status}`);
      }
      return { success: true, isLiveApi: true };
    } catch (err) {
      console.warn('Backend API unreachable, removing product locally:', err);
      const list = getLocalProducts().filter((p) => p.id !== id);
      saveLocalProducts(list);
      return { success: true, isLiveApi: false };
    }
  },
};
