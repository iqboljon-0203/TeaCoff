-- TeaCoff Supabase PostgreSQL Initial Migration
-- Date: 2026-10-09

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  title JSONB NOT NULL,
  description JSONB,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  taste_notes JSONB,
  price DECIMAL(12, 2) NOT NULL,
  old_price DECIMAL(12, 2),
  weight_volume VARCHAR(50),
  in_stock BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  is_rental_machine BOOLEAN DEFAULT false,
  min_capsule_boxes INT DEFAULT 4,
  specs JSONB DEFAULT '{}',
  badge JSONB,
  brand VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  district VARCHAR(100) NOT NULL,
  delivery_address TEXT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  delivery_fee DECIMAL(12, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'confirmed', 'delivering', 'completed', 'cancelled'
  items JSONB NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Rental Inquiries
CREATE TABLE IF NOT EXISTS rental_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  machine_model VARCHAR(255) NOT NULL,
  selected_capsules JSONB,
  min_boxes_required INT DEFAULT 4,
  cups_per_day INT DEFAULT 4,
  district VARCHAR(100),
  delivery_address TEXT,
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'approved', 'installed', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Service Tickets
CREATE TABLE IF NOT EXISTS service_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number SERIAL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  machine_model VARCHAR(255) NOT NULL,
  issue_description TEXT NOT NULL,
  attachment_url TEXT,
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'in_review', 'repairing', 'ready', 'closed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Promo Codes
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- 'percent', 'fixed'
  discount_value DECIMAL(12, 2) NOT NULL,
  min_order_amount DECIMAL(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rentals_created ON rental_inquiries(created_at DESC);
