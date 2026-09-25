import { Pool } from 'pg';
import { products as fallbackProducts, Product, ProductCategory } from '@/data/products';

let pool: Pool | null = null;

function getPool(): Pool | null {
  const conn = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!conn) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: conn,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

function mapCategory(tags: string[] = []): ProductCategory {
  const lowerTags = tags.map((t) => t.toLowerCase());
  if (lowerTags.includes('automotive')) return 'Automotive';
  if (lowerTags.includes('tooling') || lowerTags.includes('jigs & fixtures') || lowerTags.includes('workshop tools')) return 'Tooling';
  if (lowerTags.includes('prototypes') || lowerTags.includes('rapid prototyping') || lowerTags.includes('assemblies')) return 'Prototypes';
  if (lowerTags.includes('home & office') || lowerTags.includes('consumer goods') || lowerTags.includes('electronics accessories')) return 'Home & Office';
  return 'Custom';
}

export async function fetchLiveProducts(): Promise<Product[]> {
  const p = getPool();
  if (p) {
    try {
      const res = await p.query('SELECT * FROM products ORDER BY created_at DESC');
      if (res.rows && res.rows.length > 0) {
        return res.rows.map((row, index) => {
          const tags = Array.isArray(row.tags) ? row.tags : [];
          const imageUrls = Array.isArray(row.image_urls) ? row.image_urls : [];
          const mainImage = imageUrls[0] || '/products/dr-showcase-hero.jpg';

          return {
            id: String(row.id),
            code: `DR-P-${String(row.id).slice(0, 3).toUpperCase() || (index + 10).toString()}`,
            title: row.name,
            category: mapCategory(tags),
            image: mainImage,
            imageUrls: imageUrls.length > 0 ? imageUrls : [mainImage],
            summary: row.description || '',
            price: Number(row.price) || 0,
            process: tags.length > 0 ? tags : ['3D CAD', '3D Printing'],
            specs: [],
            tags,
          };
        });
      }
    } catch (err) {
      console.warn('Failed to query database for products, falling back to static list:', err);
    }
  }

  return fallbackProducts;
}
