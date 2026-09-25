import { Product, CreateProductInput, UpdateProductInput } from '@/types/product';
import { createClient } from '@supabase/supabase-js';

const INITIAL_PRODUCTS: Product[] = [
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

// Persistent memory cache across hot-reloads in Node runtime
const globalForProducts = globalThis as unknown as {
  __productsCache?: Product[];
};

function getMemoryStore(): Product[] {
  if (!globalForProducts.__productsCache) {
    globalForProducts.__productsCache = [...INITIAL_PRODUCTS];
  }
  return globalForProducts.__productsCache;
}

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.endsWith('...'))
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.endsWith('...'))
      ? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key && !url.includes('[YOUR-PROJECT-REF]') && !key.endsWith('...')) {
    return createClient(url, key, { auth: { persistSession: false } });
  }
  return null;
}


export async function getAllProducts(params?: { tag?: string; search?: string }): Promise<Product[]> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });

      if (params?.tag) {
        query = query.contains('tags', [params.tag.trim()]);
      }
      if (params?.search) {
        const s = params.search.trim();
        query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: Number(item.price),
          imageUrls: item.image_urls || item.imageUrls || [],
          tags: item.tags || [],
          createdAt: item.created_at || item.createdAt,
          updatedAt: item.updated_at || item.updatedAt,
        }));
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local store:', err);
    }
  }

  // Local memory store
  let list = getMemoryStore();

  if (params?.tag) {
    const t = params.tag.toLowerCase().trim();
    list = list.filter((p) => p.tags.some((tag) => tag.toLowerCase() === t));
  }

  if (params?.search) {
    const s = params.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.tags.some((tag) => tag.toLowerCase().includes(s))
    );
  }

  return list;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          description: data.description || '',
          price: Number(data.price),
          imageUrls: data.image_urls || data.imageUrls || [],
          tags: data.tags || [],
          createdAt: data.created_at || data.createdAt,
          updatedAt: data.updated_at || data.updatedAt,
        };
      }
    } catch {
      // Fallback
    }
  }

  const list = getMemoryStore();
  return list.find((p) => p.id === id) || null;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const now = new Date().toISOString();
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`;

  const newProduct: Product = {
    id,
    name: input.name.trim(),
    description: (input.description || '').trim(),
    price: Number(input.price),
    imageUrls: (input.imageUrls || []).filter(Boolean),
    tags: (input.tags || []).filter(Boolean),
    createdAt: now,
    updatedAt: now,
  };

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          id: newProduct.id,
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          image_urls: newProduct.imageUrls,
          tags: newProduct.tags,
          created_at: newProduct.createdAt,
          updated_at: newProduct.updatedAt,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          imageUrls: data.image_urls,
          tags: data.tags,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (err) {
      console.warn('Supabase insert failed, storing in memory:', err);
    }
  }

  const store = getMemoryStore();
  store.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product | null> {
  const now = new Date().toISOString();

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: input.name.trim(),
          description: (input.description || '').trim(),
          price: Number(input.price),
          image_urls: (input.imageUrls || []).filter(Boolean),
          tags: (input.tags || []).filter(Boolean),
          updated_at: now,
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          imageUrls: data.image_urls,
          tags: data.tags,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (err) {
      console.warn('Supabase update failed, updating in memory:', err);
    }
  }

  const store = getMemoryStore();
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = store[index];
  const updated: Product = {
    ...existing,
    name: input.name.trim(),
    description: (input.description || '').trim(),
    price: Number(input.price),
    imageUrls: (input.imageUrls || []).filter(Boolean),
    tags: (input.tags || []).filter(Boolean),
    updatedAt: now,
  };

  store[index] = updated;
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return false;

  store.splice(index, 1);
  return true;
}
