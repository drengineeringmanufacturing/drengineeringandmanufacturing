const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { Client } = require('pg');

cloudinary.config({
  cloud_name: 'l7lxoxvl',
  api_key: '592835942887733',
  api_secret: 'YZNFrKqQleERLcMg2TpsZax9Sh0',
  secure: true,
});

const connectionString =
  'postgresql://postgres.hkjcfygxmsvzgpnduube:AZXQYIjgXLZRwkj8@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres';

const imagesDir = path.resolve(__dirname, '../../frontend/public/products');

const productFileMapping = {
  'Triple Gauge Dash Pod': 'gauge-pod.jpg',
  'Cabinet Lock Drilling Jig': 'drawer-lock-jig.jpg',
  'Pivot Mount Bracket (CAD)': 'pivot-bracket-cad.jpg',
  'Miniature Turbine & Gearbox': 'turbine-gearbox.jpg',
  'Workshop Spill Funnel': 'workshop-funnel.jpg',
  'Modular Desk Organiser': 'desk-organiser.jpg',
  'Modern Floating House Number Sign': 'house-number-sign.jpg',
  'SIM Card & Pin Organiser': 'sim-card-organiser.jpg',
  'Desk Mini Wheelie Bin': 'mini-wheelie-bin.jpg',
  'Relief American Flag Plaque': 'flag-relief.jpg',
  'Transformers Autobot Shield': 'relief-emblem.jpg',
  'DR Engineering Workshop Showcase': 'dr-showcase-hero.jpg',
};

async function uploadAll() {
  const files = fs.readdirSync(imagesDir).filter((f) => f.endsWith('.jpg') || f.endsWith('.png'));
  console.log(`Found ${files.length} images to upload to Cloudinary...`);

  const uploadedUrls = {};

  for (const file of files) {
    const fullPath = path.join(imagesDir, file);
    const publicId = path.parse(file).name;

    try {
      console.log(`Uploading ${file}...`);
      const res = await cloudinary.uploader.upload(fullPath, {
        folder: 'daniels-products',
        public_id: publicId,
        overwrite: true,
      });
      console.log(`-> Uploaded ${file} to ${res.secure_url}`);
      uploadedUrls[file] = res.secure_url;
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err.message);
    }
  }

  // Connect to DB and update image_urls for products
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL to update product image URLs...');

    for (const [prodName, fileName] of Object.entries(productFileMapping)) {
      const cdnUrl = uploadedUrls[fileName];
      if (cdnUrl) {
        await client.query(
          'UPDATE products SET image_urls = $1, updated_at = NOW() WHERE name = $2',
          [[cdnUrl], prodName]
        );
        console.log(`Updated DB: ${prodName} -> ${cdnUrl}`);
      }
    }

    console.log('All product image URLs in database updated with Cloudinary URLs successfully!');
  } catch (err) {
    console.error('Database update error:', err);
  } finally {
    await client.end();
  }
}

uploadAll();
