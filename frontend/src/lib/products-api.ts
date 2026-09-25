import { Product, ProductCategory, products as fallbackProducts } from '@/data/products';

const rawUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NEXT_PUBLIC_SUPERADMIN_URL
    ? `${process.env.NEXT_PUBLIC_SUPERADMIN_URL}/api`
    : 'https://drengineeringandmanufacturing-rq2d.vercel.app/api');

const API_BASE = rawUrl.replace(/\/+$/, '');

function mapCategory(tags: string[] = []): ProductCategory {
  const lower = tags.map((t) => t.toLowerCase());
  if (lower.includes('automotive')) return 'Automotive';
  if (lower.includes('tooling') || lower.includes('jigs & fixtures') || lower.includes('workshop tools')) return 'Tooling';
  if (lower.includes('prototypes') || lower.includes('rapid prototyping') || lower.includes('assemblies')) return 'Prototypes';
  if (lower.includes('home & office') || lower.includes('consumer goods') || lower.includes('electronics accessories')) return 'Home & Office';
  return 'Custom';
}

export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const data = await res.json();
      const rawList = data.products || data;

      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map((p: any, idx: number) => {
          const tags = Array.isArray(p.tags) ? p.tags : [];
          const imageUrls = Array.isArray(p.imageUrls) ? p.imageUrls : [];
          const mainImage = imageUrls[0] || '/products/dr-showcase-hero.jpg';

          return {
            id: String(p.id),
            code: `DR-P-${String(p.id).slice(0, 3).toUpperCase() || (idx + 10).toString()}`,
            title: p.name || 'Engineered Component',
            category: mapCategory(tags),
            image: mainImage,
            imageUrls: imageUrls.length > 0 ? imageUrls : [mainImage],
            summary: p.description || '',
            price: Number(p.price) || 0,
            tags,
            process: tags.length > 0 ? tags : ['3D CAD', '3D Printing'],
            specs: [],
          };
        });
      }
    }
  } catch (err) {
    console.warn('Superadmin API fetch failed, falling back to local list:', err);
  }

  return fallbackProducts;
}
