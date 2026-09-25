const { Client } = require('pg');
const crypto = require('crypto');

const connectionString =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  'postgresql://postgres.hkjcfygxmsvzgpnduube:AZXQYIjgXLZRwkj8@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres';

const SEED_PRODUCTS = [
  {
    name: 'Triple Gauge Dash Pod',
    description: 'Custom-fit dashboard pod housing three 52 mm gauges. Reverse engineered from the dash contour so it sits flush with factory panels.',
    price: 45.00,
    tags: ['Automotive', 'Reverse Engineering', '3D CAD', '3D Printing'],
    image_urls: ['/products/gauge-pod.jpg'],
  },
  {
    name: 'Cabinet Lock Drilling Jig',
    description: 'Clamp-on jig that locates the lock barrel and cam holes for fast, repeatable cabinet lock installs — with hardened guide bushings.',
    price: 35.00,
    tags: ['Tooling', 'Jigs & Fixtures', '3D CAD', '3D Printing'],
    image_urls: ['/products/drawer-lock-jig.jpg'],
  },
  {
    name: 'Pivot Mount Bracket (CAD)',
    description: 'Parametric pivot bracket designed in CAD for CNC and additive production, with load simulation and lightweight internal webbing.',
    price: 65.00,
    tags: ['Tooling', '3D CAD', 'Parametric Design', 'Additive'],
    image_urls: ['/products/pivot-bracket-cad.jpg'],
  },
  {
    name: 'Miniature Turbine & Gearbox',
    description: 'High-speed demonstrator with geared planetary drive and turbine impeller — tight-tolerance snap-together assembly.',
    price: 55.00,
    tags: ['Prototypes', '3D CAD', 'Rapid Prototyping', 'Assemblies'],
    image_urls: ['/products/turbine-gearbox.jpg'],
  },
  {
    name: 'Workshop Spill Funnel',
    description: 'Chemical-resistant funnel with air-bleed flutes, threaded filter seat and reinforced rim for high-volume shop use.',
    price: 22.00,
    tags: ['Tooling', 'Workshop Tools', '3D CAD', '3D Printing'],
    image_urls: ['/products/workshop-funnel.jpg'],
  },
  {
    name: 'Modular Desk Organiser',
    description: 'Stackable desktop organisation system with magnetic docking channels, cable routing, and textured finish.',
    price: 28.00,
    tags: ['Home & Office', 'Consumer Goods', 'Design', '3D Printing'],
    image_urls: ['/products/desk-organiser.jpg'],
  },
  {
    name: 'Modern Floating House Number Sign',
    description: 'Clean-edge architectural signage with hidden standoff fasteners, weather-sealed perimeter, and dual-tone infill.',
    price: 38.00,
    tags: ['Custom', 'Signage', 'Architectural', '3D Printing'],
    image_urls: ['/products/house-number-sign.jpg'],
  },
  {
    name: 'SIM Card & Pin Organiser',
    description: 'Pocket-sized case with precision recesses for nano/micro SIMs, adapters, and ejection pins with positive magnetic snap latch.',
    price: 18.00,
    tags: ['Home & Office', 'Electronics Accessories', 'Snap-Fit'],
    image_urls: ['/products/sim-card-organiser.jpg'],
  },
  {
    name: 'Desk Mini Wheelie Bin',
    description: 'Functional desktop desk tidy with working axle, flip lid, and scale ribbed panels — scaled from commercial wheelie bins.',
    price: 20.00,
    tags: ['Home & Office', 'Novelty & Utility', 'Functional Assembly'],
    image_urls: ['/products/mini-wheelie-bin.jpg'],
  },
  {
    name: 'Relief American Flag Plaque',
    description: 'High-detail multi-depth relief flag with precision star field, raised stripes, and seamless multi-filament bonding.',
    price: 42.00,
    tags: ['Custom', 'Relief Plaques', 'Multi-Color Printing'],
    image_urls: ['/products/flag-relief.jpg'],
  },
  {
    name: 'Transformers Autobot Shield',
    description: 'Multi-depth metallic silver and black emblem with crisp edge definition, chamfered facets, and concealed wall mount recesses.',
    price: 35.00,
    tags: ['Custom', 'Emblems & Props', 'Post-Processing'],
    image_urls: ['/products/relief-emblem.jpg'],
  },
  {
    name: 'DR Engineering Workshop Showcase',
    description: 'Physical workshop showcase featuring precision pivot brackets, functional drill jigs, multi-stage gear trains, and custom relief emblems.',
    price: 85.00,
    tags: ['Showcase', 'Assemblies', '3D CAD', '3D Printing'],
    image_urls: ['/products/dr-showcase-hero.jpg'],
  }
];

async function seed() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // 1. Clear old placeholder aerospace dummy items
    await client.query("DELETE FROM products WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');");
    console.log('Cleared initial dummy products if present');

    // 2. Insert or update the real products
    for (const prod of SEED_PRODUCTS) {
      // Check if product already exists by name
      const existing = await client.query('SELECT id FROM products WHERE name = $1 LIMIT 1', [prod.name]);
      if (existing.rows.length === 0) {
        const id = crypto.randomUUID();
        const now = new Date();
        await client.query(
          `INSERT INTO products (id, name, description, price, image_urls, tags, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [id, prod.name, prod.description, prod.price, prod.image_urls, prod.tags, now, now]
        );
        console.log(`Inserted: ${prod.name}`);
      } else {
        await client.query(
          `UPDATE products SET description = $1, price = $2, image_urls = $3, tags = $4, updated_at = NOW() WHERE id = $5`,
          [prod.description, prod.price, prod.image_urls, prod.tags, existing.rows[0].id]
        );
        console.log(`Updated: ${prod.name}`);
      }
    }

    const countRes = await client.query('SELECT count(*) FROM products');
    console.log(`Total products now in database: ${countRes.rows[0].count}`);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
