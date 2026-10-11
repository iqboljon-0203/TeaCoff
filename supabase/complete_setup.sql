-- =============================================================================
-- TeaCoff Platform: Master Database Setup & Seed Migration
-- Project: wcjtdlldtydtnsjqexqw
-- Instructions: Copy and paste this entire script into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wcjtdlldtydtnsjqexqw/sql/new
-- Then click RUN (or press Ctrl+Enter).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  title JSONB NOT NULL,
  description JSONB,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_slug VARCHAR(100),
  brand VARCHAR(100) NOT NULL,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Contracts for Machine Rentals & Bot Automation
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  telegram_chat_id BIGINT,
  language VARCHAR(10) DEFAULT 'ru',
  machine_model VARCHAR(255) NOT NULL,
  machine_serial VARCHAR(100),
  contract_start_date DATE NOT NULL,
  contract_end_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'terminated', 'completed', 'machine_returned'
  min_capsule_boxes INT DEFAULT 4,
  cycle_days INT DEFAULT 30,
  last_purchase_date DATE,
  next_purchase_date DATE NOT NULL,
  reminder_status VARCHAR(50) DEFAULT 'idle', -- 'idle', 'reminded_primary', 'reminded_followup', 'needs_attention', 'ordered'
  last_reminder_sent_at TIMESTAMPTZ,
  last_order_items JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS public.orders (
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
  payment_status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  telegram_chat_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Rental Inquiries
CREATE TABLE IF NOT EXISTS public.rental_inquiries (
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

-- 6. Service Tickets
CREATE TABLE IF NOT EXISTS public.service_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number SERIAL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  machine_model VARCHAR(255) NOT NULL,
  issue_description TEXT NOT NULL,
  attachment_url TEXT,
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'in_review', 'repairing', 'ready', 'closed'
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  telegram_chat_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Promo Codes
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- 'percent', 'fixed'
  discount_value DECIMAL(12, 2) NOT NULL,
  min_order_amount DECIMAL(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contracts_telegram ON public.contracts(telegram_chat_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_next_purchase ON public.contracts(next_purchase_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Allow Public/Anon read on catalog
DROP POLICY IF EXISTS "Public categories read" ON public.categories;
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public products read" ON public.products;
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public promo read" ON public.promo_codes;
CREATE POLICY "Public promo read" ON public.promo_codes FOR SELECT USING (true);

-- Allow Public insert for orders and inquiries
DROP POLICY IF EXISTS "Public order insert" ON public.orders;
CREATE POLICY "Public order insert" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public order select" ON public.orders;
CREATE POLICY "Public order select" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public order update" ON public.orders;
CREATE POLICY "Public order update" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public rental insert" ON public.rental_inquiries;
CREATE POLICY "Public rental insert" ON public.rental_inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public rental select" ON public.rental_inquiries;
CREATE POLICY "Public rental select" ON public.rental_inquiries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public rental update" ON public.rental_inquiries;
CREATE POLICY "Public rental update" ON public.rental_inquiries FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public service insert" ON public.service_tickets;
CREATE POLICY "Public service insert" ON public.service_tickets FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public service select" ON public.service_tickets;
CREATE POLICY "Public service select" ON public.service_tickets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public service update" ON public.service_tickets;
CREATE POLICY "Public service update" ON public.service_tickets FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public contracts read" ON public.contracts;
CREATE POLICY "Public contracts read" ON public.contracts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public contracts update" ON public.contracts;
CREATE POLICY "Public contracts update" ON public.contracts FOR ALL USING (true);

-- =============================================================================
-- SEED DATA (Categories & Initial Products)
-- =============================================================================

INSERT INTO public.categories (slug, title, description, image_url, sort_order)
VALUES
  ('kofemashiny', '{"ru": "Кофемашины", "uz": "Kofemashinalar", "en": "Coffee Machines"}', '{"ru": "Капсульные и автоматические кофемашины", "uz": "Kapsulali va avtomat kofemashinalar", "en": "Capsule and automatic machines"}', 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?q=80&w=900', 1),
  ('kapsuly', '{"ru": "Капсулы", "uz": "Kapsulalar", "en": "Capsules"}', '{"ru": "Капсулы для систем Dolce Gusto и Nespresso", "uz": "Dolce Gusto va Nespresso uchun kapsulalar", "en": "Capsules for Dolce Gusto & Nespresso"}', 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=900', 2),
  ('kofe-v-zernax', '{"ru": "Кофе в зернах", "uz": "Donador qahva", "en": "Coffee Beans"}', '{"ru": "Свежеобжаренный зерновой кофе", "uz": "Yangi qovurilgan donador qahva", "en": "Freshly roasted coffee beans"}', 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=900', 3),
  ('chay', '{"ru": "Чай", "uz": "Choy", "en": "Tea"}', '{"ru": "Элитные сорта чая", "uz": "Elita choy navlari", "en": "Premium tea selections"}', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=900', 4),
  ('aksessuary', '{"ru": "Аксессуары", "uz": "Aksessuarlar", "en": "Accessories"}', '{"ru": "Посуда, держатели капсул, сиропы", "uz": "Idishlar, kapsula ushlagichlar", "en": "Accessories & syrup"}', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900', 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Products
INSERT INTO public.products (
  slug, category_slug, brand, title, description, taste_notes, price, old_price, weight_volume, in_stock, images, is_rental_machine, min_capsule_boxes, specs, badge
) VALUES
(
  'dolce-gusto-genio-s',
  'kofemashiny',
  'Dolce Gusto',
  '{"ru": "Dolce Gusto Genio S", "uz": "Dolce Gusto Genio S", "en": "Dolce Gusto Genio S"}',
  '{"ru": "Компактная автоматическая капсульная кофемашина премиум-класса с сенсорным управлением и регулировкой температуры.", "uz": "Sensorli boshqaruvga ega ixcham, zamonaviy premium kapsulali kofemashina.", "en": "Compact automatic capsule coffee machine with touch control."}',
  '{"ru": "Идеально для эспрессо, латте, капучино", "uz": "Espresso, latte va kapuchino uchun ideal", "en": "Perfect for espresso, latte, cappuccino"}',
  0,
  1490000,
  '1 шт',
  true,
  ARRAY['https://images.unsplash.com/photo-1520970014086-2208d157c9e2?q=80&w=900&auto=format&fit=crop'],
  true,
  4,
  '{"system": "Dolce Gusto", "pressure": "15 бар", "water_tank": "0.8 л", "power": "1500 Вт", "origin": "Германия/Швейцария"}',
  '{"ru": "Аренда 0 сум", "uz": "Ijara 0 so''m", "en": "Rental 0 UZS"}'
),
(
  'dolce-gusto-mini-me',
  'kofemashiny',
  'Dolce Gusto',
  '{"ru": "Nescafé Dolce Gusto Mini Me", "uz": "Nescafé Dolce Gusto Mini Me", "en": "Dolce Gusto Mini Me"}',
  '{"ru": "Популярная кофемашина для дома и офиса. Быстрый термоблок и давление 15 бар.", "uz": "Uy va ofis uchun qulay va ommabop kofemashina. 15 bar bosim.", "en": "Popular home and office capsule machine."}',
  '{"ru": "Богатая пенка crema, густой аромат", "uz": "Qalin crema ko''pigi, boy xushbo''ylik", "en": "Rich crema, intense aroma"}',
  0,
  1290000,
  '1 шт',
  true,
  ARRAY['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=900&auto=format&fit=crop'],
  true,
  4,
  '{"system": "Dolce Gusto", "pressure": "15 бар", "water_tank": "0.8 л", "power": "1500 Вт"}',
  '{"ru": "Хит аренды", "uz": "Ommabop ijara", "en": "Top Rental"}'
),
(
  'capsules-carraro-crema',
  'kapsuly',
  'Caffè Carraro',
  '{"ru": "Капсулы Carraro Crema (16 шт)", "uz": "Carraro Crema kapsulalari (16 dona)", "en": "Carraro Crema Capsules (16 pcs)"}',
  '{"ru": "Итальянский бленд со сбалансированным вкусом, плотным телом и кремовой пенкой.", "uz": "Muvozanatli, quyuq ta''mli va nozik qaymoqli kremaga ega haqiqiy italyan qahvasi.", "en": "Italian blend with balanced taste, velvety crema and rich body."}',
  '{"ru": "Темный шоколад, лесной орех", "uz": "Qora shokolad, o''rmon yong''og''i", "en": "Dark chocolate, roasted hazelnut"}',
  95000,
  110000,
  '16 шт',
  true,
  ARRAY['https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=900&auto=format&fit=crop'],
  false,
  1,
  '{"system": "Dolce Gusto", "intensity": "8/10", "roast": "Medium-Dark", "origin": "Италия"}',
  '{"ru": "ХИТ ПРОДАЖ", "uz": "ENG XARIDORGIR", "en": "BESTSELLER"}'
),
(
  'capsules-carraro-puro-arabica',
  'kapsuly',
  'Caffè Carraro',
  '{"ru": "Капсулы Carraro Puro Arabica (16 шт)", "uz": "Carraro Puro Arabica kapsulalari (16 dona)", "en": "Carraro Puro Arabica (16 pcs)"}',
  '{"ru": "100% отборная высокогорная арабика с мягким цветочным ароматом и благородной кислинкой.", "uz": "100% saralangan arabika, nozik gulli xushbo''ylik va yoqimli nordonlik.", "en": "100% selected Arabica with floral notes."}',
  '{"ru": "Жасмин, карамель, цитрусовые ноты", "uz": "Jasmin, karamel, sitrus notalari", "en": "Jasmine, caramel, citrus notes"}',
  99000,
  115000,
  '16 шт',
  true,
  ARRAY['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop'],
  false,
  1,
  '{"system": "Dolce Gusto", "intensity": "6/10", "roast": "Medium", "origin": "Италия"}',
  NULL
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Contracts for Bot Lifecycle Testing
INSERT INTO public.contracts (
  contract_number, customer_name, customer_phone, telegram_chat_id, language, machine_model,
  contract_start_date, next_purchase_date, status, min_capsule_boxes, last_purchase_date,
  last_order_items
) VALUES
(
  '1258',
  'Тимур Алиев',
  '+998 90 987 65 43',
  NULL,
  'ru',
  'Nescafé Dolce Gusto Mini Me',
  '2026-09-10',
  '2026-10-10',
  'active',
  4,
  '2026-09-10',
  '[{"product_id": "prod-carraro-crema", "slug": "capsules-carraro-crema", "title": "Капсулы Carraro Crema (16 шт)", "price": 95000, "quantity": 4, "image": ""}]'
),
(
  '1259',
  'Азиз Каримов',
  '+998 90 123 45 67',
  NULL,
  'ru',
  'Dolce Gusto Genio S',
  '2026-08-15',
  '2026-10-15',
  'active',
  4,
  '2026-09-15',
  '[{"product_id": "prod-carraro-crema", "slug": "capsules-carraro-crema", "title": "Капсулы Carraro Crema (16 шт)", "price": 95000, "quantity": 2, "image": ""}, {"product_id": "prod-carraro-puro-arabica", "slug": "capsules-carraro-puro-arabica", "title": "Капсулы Carraro Puro Arabica (16 шт)", "price": 99000, "quantity": 2, "image": ""}]'
)
ON CONFLICT (contract_number) DO NOTHING;
