-- ==========================================================
-- TRENDY PEARLS SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- Supports 3,000+ products with pg_trgm search, RLS policies,
-- and automatic stock status sync ('in_stock', 'sold_out', 'out_of_stock')
-- ==========================================================

-- Enable full-text search extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default boutique categories
INSERT INTO categories (name, slug, description) VALUES
('Kids Toys', 'kids-toys', 'Educational wooden toys, games & activity sets'),
('Kids Dresses', 'kids-dresses', 'Party frocks, cotton dresses & festive wear for girls & boys'),
('Sarees', 'sarees', 'Designer silk sarees, organza, Kanjivaram & party wear'),
('Blouses & Tops', 'blouses', 'Readymade designer padded blouses & crop tops'),
('Earrings', 'earrings', 'Gold plated Kundan jhumkas, studs & chandelier earrings'),
('Rings & Jewelry', 'rings', 'Solitaire zircon rings, bangles & fine jewelry'),
('Handbags & Purses', 'handbags', 'Quilted sling bags, clutches & shoulder purses'),
('Footwear & Heels', 'footwear', 'Stiletto pumps, sandals & party footwear'),
('Gowns & Dresses', 'gowns', 'Satin evening gowns & party dresses')
ON CONFLICT (slug) DO NOTHING;

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    original_price DECIMAL(10, 2),
    stock_quantity INT NOT NULL DEFAULT 0,
    stock_status VARCHAR(20) NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'sold_out', 'out_of_stock')),
    image_url TEXT NOT NULL,
    instagram_post_url TEXT,
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_name);
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON products(stock_status);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin (name gin_trgm_ops);

-- 3. TRIGGER TO AUTO-UPDATE TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. TRIGGER TO SYNC STOCK STATUS AUTOMATICALLY BASED ON QUANTITY
CREATE OR REPLACE FUNCTION sync_product_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity = 0 AND NEW.stock_status = 'in_stock' THEN
        NEW.stock_status = 'out_of_stock';
    ELSIF NEW.stock_quantity > 0 AND NEW.stock_status = 'out_of_stock' THEN
        NEW.stock_status = 'in_stock';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER trigger_sync_stock_status
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION sync_product_stock_status();

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
DROP POLICY IF EXISTS "Allow public full access on products" ON products;
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
DROP POLICY IF EXISTS "Allow public full access on categories" ON categories;

-- Full CRUD Access for Web Storefront & Admin Portal
CREATE POLICY "Allow public full access on products"
ON products FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public full access on categories"
ON categories FOR ALL
USING (true)
WITH CHECK (true);
