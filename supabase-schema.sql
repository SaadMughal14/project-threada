-- ================================================
-- GRAVITY ADMIN PANEL - SUPABASE SQL SCHEMA
-- ================================================
-- Run this script in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/ogztqrexnzmknmosgazb/sql
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- CATEGORIES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  icon_type TEXT DEFAULT 'emoji',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, icon, icon_type, display_order) VALUES
  ('Cookies', '🍪', 'emoji', 1),
  ('Brownies', 'https://i.imgur.com/n39ZKfy.png', 'image', 2),
  ('Cakes', '🍰', 'emoji', 3),
  ('Coffee & Tea', '☕', 'emoji', 4),
  ('Sides', 'https://i.imgur.com/5weD7SB.png', 'image', 5)
ON CONFLICT (name) DO NOTHING;

-- ================================================
-- PRODUCTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  category TEXT NOT NULL,
  color TEXT DEFAULT '#1C1C1C',
  image_url TEXT,
  ingredients TEXT[] DEFAULT '{}',
  size_options JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Public read access for products" ON products 
  FOR SELECT USING (true);

CREATE POLICY "Auth users can insert products" ON products 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update products" ON products 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete products" ON products 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Categories policies
CREATE POLICY "Public read access for categories" ON categories 
  FOR SELECT USING (true);

CREATE POLICY "Auth users can modify categories" ON categories 
  FOR ALL USING (auth.role() = 'authenticated');

-- ================================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- ================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read for product images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Auth upload for product images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth update for product images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete for product images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ================================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DONE! Now create an admin user:
-- ================================================
-- 1. Go to Authentication > Users in your Supabase dashboard
-- 2. Click "Add user" > "Create new user"
-- 3. Enter email and password for your admin
-- 4. Use these credentials to login at /admin-panel0/
-- ================================================

-- ================================================
-- PRODUCT OPTIONS TABLE (for customizations)
-- ================================================
CREATE TABLE IF NOT EXISTS product_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  options JSONB DEFAULT '[]',
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for product_options" ON product_options
  FOR SELECT USING (true);

CREATE POLICY "Auth modify product_options" ON product_options
  FOR ALL USING (auth.role() = 'authenticated');

-- ================================================
-- ORDERS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  delivery_notes TEXT,
  kitchen_instructions TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payment_screenshot TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create orders (customers placing orders)
CREATE POLICY "Public insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Anyone can read their own order (by order_number in URL)
CREATE POLICY "Public read orders" ON orders
  FOR SELECT USING (true);

-- Only authenticated users (staff) can update orders
CREATE POLICY "Auth update orders" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Auto-update timestamp trigger for orders
DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ORDER MESSAGES TABLE (two-way communication)
-- ================================================
CREATE TABLE IF NOT EXISTS order_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE order_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can read messages for an order
CREATE POLICY "Public read order_messages" ON order_messages
  FOR SELECT USING (true);

-- Anyone can insert messages (customer or staff)
CREATE POLICY "Public insert order_messages" ON order_messages
  FOR INSERT WITH CHECK (true);

-- ================================================
-- STORAGE BUCKET FOR PAYMENT SCREENSHOTS
-- ================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read for payment screenshots" ON storage.objects 
  FOR SELECT USING (bucket_id = 'payment-screenshots');

CREATE POLICY "Public upload for payment screenshots" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots');

