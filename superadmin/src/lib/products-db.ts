import { Product, CreateProductInput, UpdateProductInput } from '@/types/product';
import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'dr-p-011',
    name: 'Triple Gauge Dash Pod',
    description: 'Custom-fit dashboard pod housing three 52 mm gauges. Reverse engineered from the dash contour so it sits flush with factory panels.',
    price: 45.00,
    tags: ['Automotive', 'Reverse Engineering', '3D CAD', '3D Printing'],
    imageUrls: ['/products/gauge-pod.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-027',
    name: 'Cabinet Lock Drilling Jig',
    description: 'Clamp-on jig that locates the lock barrel and cam holes for fast, repeatable cabinet lock installs — with hardened guide bushings.',
    price: 35.00,
    tags: ['Tooling', 'Jigs & Fixtures', '3D CAD', '3D Printing'],
    imageUrls: ['/products/drawer-lock-jig.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-042',
    name: 'Pivot Mount Bracket (CAD)',
    description: 'Parametric pivot bracket designed in CAD for CNC and additive production, with load simulation and lightweight internal webbing.',
    price: 65.00,
    tags: ['Tooling', '3D CAD', 'Parametric Design', 'Additive'],
    imageUrls: ['/products/pivot-bracket-cad.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-063',
    name: 'Miniature Turbine & Gearbox',
    description: 'High-speed demonstrator with geared planetary drive and turbine impeller — tight-tolerance snap-together assembly.',
    price: 55.00,
    tags: ['Prototypes', '3D CAD', 'Rapid Prototyping', 'Assemblies'],
    imageUrls: ['/products/turbine-gearbox.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-089',
    name: 'Workshop Spill Funnel',
    description: 'Chemical-resistant funnel with air-bleed flutes, threaded filter seat and reinforced rim for high-volume shop use.',
    price: 22.00,
    tags: ['Tooling', 'Workshop Tools', '3D CAD', '3D Printing'],
    imageUrls: ['/products/workshop-funnel.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-104',
    name: 'Modular Desk Organiser',
    description: 'Stackable desktop organisation system with magnetic docking channels, cable routing, and textured finish.',
    price: 28.00,
    tags: ['Home & Office', 'Consumer Goods', 'Design', '3D Printing'],
    imageUrls: ['/products/desk-organiser.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-118',
    name: 'Modern Floating House Number Sign',
    description: 'Clean-edge architectural signage with hidden standoff fasteners, weather-sealed perimeter, and dual-tone infill.',
    price: 38.00,
    tags: ['Custom', 'Signage', 'Architectural', '3D Printing'],
    imageUrls: ['/products/house-number-sign.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-135',
    name: 'SIM Card & Pin Organiser',
    description: 'Pocket-sized case with precision recesses for nano/micro SIMs, adapters, and ejection pins with positive magnetic snap latch.',
    price: 18.00,
    tags: ['Home & Office', 'Electronics Accessories', 'Snap-Fit'],
    imageUrls: ['/products/sim-card-organiser.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-152',
    name: 'Desk Mini Wheelie Bin',
    description: 'Functional desktop desk tidy with working axle, flip lid, and scale ribbed panels — scaled from commercial wheelie bins.',
    price: 20.00,
    tags: ['Home & Office', 'Novelty & Utility', 'Functional Assembly'],
    imageUrls: ['/products/mini-wheelie-bin.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-171',
    name: 'Relief American Flag Plaque',
    description: 'High-detail multi-depth relief flag with precision star field, raised stripes, and seamless multi-filament bonding.',
    price: 42.00,
    tags: ['Custom', 'Relief Plaques', 'Multi-Color Printing'],
    imageUrls: ['/products/flag-relief.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-189',
    name: 'Transformers Autobot Shield',
    description: 'Multi-depth metallic silver and black emblem with crisp edge definition, chamfered facets, and concealed wall mount recesses.',
    price: 35.00,
    tags: ['Custom', 'Emblems & Props', 'Post-Processing'],
    imageUrls: ['/products/relief-emblem.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dr-p-200',
    name: 'DR Engineering Workshop Showcase',
    description: 'Physical workshop showcase featuring precision pivot brackets, functional drill jigs, multi-stage gear trains, and custom relief emblems.',
    price: 85.00,
    tags: ['Showcase', 'Assemblies', '3D CAD', '3D Printing'],
    imageUrls: ['/products/dr-showcase-hero.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Persistent memory cache across hot-reloads
const globalForProducts = globalThis as unknown as {
  __productsCache?: Product[];
  __pgPool?: Pool;
};

function getMemoryStore(): Product[] {
  if (!globalForProducts.__productsCache) {
    globalForProducts.__productsCache = [...INITIAL_PRODUCTS];
  }
  return globalForProducts.__productsCache;
}

function getPgPool(): Pool | null {
  const conn = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!conn) return null;

  if (!globalForProducts.__pgPool) {
    globalForProducts.__pgPool = new Pool({
      connectionString: conn,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
    });
  }
  return globalForProducts.__pgPool;
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
  const pool = getPgPool();
  if (pool) {
    try {
      let query = 'SELECT * FROM products ORDER BY created_at DESC';
      const values: unknown[] = [];

      if (params?.tag) {
        query = 'SELECT * FROM products WHERE $1 = ANY(tags) ORDER BY created_at DESC';
        values.push(params.tag.trim());
      } else if (params?.search) {
        query = 'SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY created_at DESC';
        values.push(`%${params.search.trim()}%`);
      }

      const res = await pool.query(query, values);
      if (res.rows.length > 0) {
        return res.rows.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description || '',
          price: Number(row.price),
          imageUrls: row.image_urls || [],
          tags: row.tags || [],
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
          updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.warn('Postgres direct query failed, trying Supabase REST:', err);
    }
  }

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
      if (!error && data && data.length > 0) {
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

  // Local fallback
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
        p.tags.some((tag) => tag.toLowerCase() === s)
    );
  }
  return list;
}

export async function getProductById(id: string): Promise<Product | null> {
  const pool = getPgPool();
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [id]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          description: row.description || '',
          price: Number(row.price),
          imageUrls: row.image_urls || [],
          tags: row.tags || [],
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
          updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
        };
      }
    } catch {
      // Fallback
    }
  }

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

  const pool = getPgPool();
  if (pool) {
    try {
      await pool.query(
        `INSERT INTO products (id, name, description, price, image_urls, tags, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          newProduct.id,
          newProduct.name,
          newProduct.description,
          newProduct.price,
          newProduct.imageUrls,
          newProduct.tags,
          new Date(newProduct.createdAt),
          new Date(newProduct.updatedAt),
        ]
      );
      return newProduct;
    } catch (err) {
      console.warn('Postgres insert failed, attempting Supabase fallback:', err);
    }
  }

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

  const pool = getPgPool();
  if (pool) {
    try {
      const res = await pool.query(
        `UPDATE products
         SET name = $1, description = $2, price = $3, image_urls = $4, tags = $5, updated_at = $6
         WHERE id = $7
         RETURNING *`,
        [
          input.name.trim(),
          (input.description || '').trim(),
          Number(input.price),
          (input.imageUrls || []).filter(Boolean),
          (input.tags || []).filter(Boolean),
          new Date(now),
          id,
        ]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          description: row.description,
          price: Number(row.price),
          imageUrls: row.image_urls,
          tags: row.tags,
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : now,
          updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : now,
        };
      }
    } catch (err) {
      console.warn('Postgres update failed, attempting Supabase fallback:', err);
    }
  }

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
  const pool = getPgPool();
  if (pool) {
    try {
      const res = await pool.query('DELETE FROM products WHERE id = $1', [id]);
      if ((res.rowCount ?? 0) > 0) return true;
    } catch (err) {
      console.warn('Postgres delete failed, attempting Supabase fallback:', err);
    }
  }

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
