-- ================================================
-- PROJECT THREADA - SUPABASE SQL SCHEMA
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. STORE SETTINGS (Global Config)
-- ================================================
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#ffffff',
  font_family TEXT DEFAULT 'Inter',
  hero_image_url TEXT,
  hero_headline TEXT DEFAULT 'Welcome to Threada',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for store_settings
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read store_settings" ON store_settings
  FOR SELECT USING (true);

CREATE POLICY "Auth update store_settings" ON store_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ================================================
-- 2. PRODUCT VARIANTS (Clothing Support)
-- ================================================
-- Note: Assuming 'products' table exists from previous schema.
-- If not, create it first (id, name, description, etc.)

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,         -- e.g., 'S', 'M', 'L', 'XL'
  color TEXT NOT NULL,        -- e.g., 'Black', 'Red', '#FF0000'
  sku TEXT,                   -- Stock Keeping Unit
  price_adjustment NUMERIC DEFAULT 0, -- Add/subtract from base product price
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for product_variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read product_variants" ON product_variants
  FOR SELECT USING (true);

CREATE POLICY "Auth all product_variants" ON product_variants
  FOR ALL USING (auth.role() = 'authenticated');

-- ================================================
-- 3. UPDATED ORDERS TABLE (Optional / Future Proofing)
-- ================================================
-- Ideally, we should ensure the 'orders' table items JSONB structure
-- supports storing variant_id. For now, we assume standard JSONB structure.
