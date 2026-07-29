import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valParts] = trimmed.split('=');
      if (key && valParts.length > 0) {
        process.env[key.trim()] = valParts.join('=').trim();
      }
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

const SAMPLE_PRODUCTS = [
  {
    sku: 'TP-KID-001',
    name: 'Interactive Wooden Educational Montessori Toy Set',
    description: 'Eco-friendly wooden puzzle & shape sorting activity toy set for toddlers. Safe, non-toxic colors.',
    category_name: 'Kids Toys',
    price: 24.99,
    original_price: 35.00,
    stock_quantity: 20,
    stock_status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800',
    is_featured: true,
  },
  {
    sku: 'TP-KID-002',
    name: 'Little Princess Floral Embroidered Party Frock',
    description: 'Soft cotton lined tulle party dress for girls with delicate floral embroidery and satin waist bow.',
    category_name: 'Kids Dresses',
    price: 29.50,
    original_price: 42.00,
    stock_quantity: 15,
    stock_status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800',
    is_featured: true,
  },
  {
    sku: 'TP-SAR-003',
    name: 'Royal Kanjivaram Soft Silk Saree - Ruby Red & Gold',
    description: 'Handwoven soft silk saree with traditional peacock zari border and rich contrast pallu.',
    category_name: 'Sarees',
    price: 95.00,
    original_price: 140.00,
    stock_quantity: 8,
    stock_status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
    is_featured: true,
  },
  {
    sku: 'TP-BLU-004',
    name: 'Designer Padded Velvet Saree Blouse - Antique Gold',
    description: 'Readymade velvet padded blouse with intricate zardosi handwork and back dori tie.',
    category_name: 'Blouses & Tops',
    price: 32.00,
    original_price: 45.00,
    stock_quantity: 12,
    stock_status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800',
    is_featured: false,
  },
  {
    sku: 'TP-EAR-005',
    name: '22K Gold Plated Kundan Jhumka Earrings',
    description: 'Traditional handcrafted jhumka earrings featuring pearl drops and sparkling Kundan stones.',
    category_name: 'Earrings',
    price: 28.00,
    original_price: 38.00,
    stock_quantity: 25,
    stock_status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    is_featured: true,
  }
];

async function seed() {
  console.log('🚀 Connecting to live Supabase Database:', supabaseUrl);

  const { data, error } = await supabase.from('products').upsert(SAMPLE_PRODUCTS, { onConflict: 'sku' });

  if (error) {
    console.error('❌ Seeding error message:', error.message);
    console.log('💡 Note: Make sure you ran supabase/schema.sql in your Supabase SQL Editor to create the tables!');
  } else {
    console.log('✅ Live Supabase database seeded successfully!');
  }
}

seed();
