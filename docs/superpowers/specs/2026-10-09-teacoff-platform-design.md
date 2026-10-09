# TeaCoff (teacoff.uz) Platform Design Specification

**Document Version:** 1.0.0  
**Date:** 2026-10-09  
**Status:** Approved for Implementation  
**Project:** Enterprise E-Commerce & Coffee Machine Subscription Platform  
**Target Market:** Tashkent, Uzbekistan  

---

## 1. Executive Summary & Brand Identity

TeaCoff is an enterprise-grade digital storefront and coffee machine subscription service tailored specifically to Tashkent, Uzbekistan. The platform provides:
1. **0 UZS Capsule Machine Rental Subscription** (models like Dolce Gusto Mini Me, Genio S, Piccolo XS, Nespresso Inissia) based on a monthly minimum capsule consumption (4+ boxes/month).
2. **Full E-Commerce Catalog** for coffee machines, whole bean coffee (Lavazza, Carraro), official capsules, and tea infusions.
3. **Automated Order & Lead Processing** with instant manager notification via Telegram Bot (`@TeaCoff_lux`) and PostgreSQL persistence.
4. **Maintenance & Repair Portal** for subscribers and one-off service requests with status tracking.
5. **Admin CMS** for product catalog management, order processing, lead pipeline, and repair ticket tracking.

### Brand Visual Language & Dual-Theme System
- **Dark Mode (Default & Primary Mockup Match):**
  - Background: Deep Charcoal / Luxury Black (`#0B0B0C`, `#121214`, `#1A1A1E`).
  - Hero Accent & Primary Brand Color: **Volt / Neon Lime** (`#D4FF00` / `#C8F902` - exact match to logo and design banner).
  - Luxury Accents: Warm Italian Crema Gold (`#D4A373`, `#E6C280`), subtle amber glows.
  - Card & Glass Containers: Translucent dark glass (`rgba(25, 25, 28, 0.75)`) with 1px border (`rgba(255, 255, 255, 0.08)`).
  - Typography: Editorial high-contrast serif headlines for luxury heritage (`Playfair Display` or `Cinzel` / `Cormorant Garamond` combined with clean geometric sans `Plus Jakarta Sans` / `Inter` for body & telemetry).
  - Badges: Neon lime badge "АРЕНДА 0 СУМ", "ХИТ ПРОДАЖ", dark luxury badge "ИТАЛИЯ 1927".
- **Light Mode (Logo-Derived Aesthetic):**
  - Background: Crisp Warm Alabaster (`#FBFBFB`, `#F4F4F6`).
  - Surfaces & Cards: Clean White (`#FFFFFF`) with refined border (`#E5E7EB`) and subtle deep shadows.
  - Accent & Buttons: Bold Volt / Neon Lime (`#D4FF00` with deep black text `#0A0A0A` for maximum contrast and legibility).
  - Secondary Accents: Rich Espresso Ink (`#111827`, `#1F2937`) and Crema accents (`#C59B27`).

---

## 2. System Architecture & Tech Stack

```
+---------------------------------------------------------------------------------+
|                               TeaCoff Frontend                                 |
| Next.js 15 (App Router) + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion |
+---------------------------------------------------------------------------------+
          |                                       |                          |
          v                                       v                          v
+--------------------+                 +--------------------+      +--------------------+
|   next-intl i18n   |                 |    Zustand Store   |      |  React Hook Form   |
|   (ru, uz, en)     |                 | Cart, Wishlist,    |      |  + Zod Validation  |
| Localized Routing  |                 | Currency (UZS)     |      |  Checkout & Leads  |
+--------------------+                 +--------------------+      +--------------------+
          |                                       |                          |
          +---------------------------------------+--------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------+
|                                Next.js API Routes                               |
|          /api/orders  |  /api/rental-inquiries  |  /api/service-tickets        |
+---------------------------------------------------------------------------------+
                 |                                                |
                 v                                                v
+----------------------------------+            +----------------------------------+
|      Supabase PostgreSQL         |            |      Telegram Bot Dispatch       |
| Categories, Products, Orders,    |            |  Instant notifications to        |
| Inquiries, Service Tickets, RLS  |            |  @TeaCoff_lux / Managers Chat    |
+----------------------------------+            +----------------------------------+
```

### Core Libraries:
1. **Next.js 15+ (App Router)**: Server components for SEO, dynamic client components for interactive calculator and checkout.
2. **`next-intl`**: Full locale-prefixed routing (`/[locale]/...`) supporting Russian (`ru`, default), Uzbek (`uz`), and English (`en`).
3. **Zustand**: Client state with `localStorage` persistence:
   - `useCartStore`: Items, quantities, capsule box counters, subtotal, delivery calculations.
   - `useWishlistStore`: Saved products.
   - `useThemeStore`: Dark / Light toggle.
4. **Tailwind CSS & Shadcn UI**: Radix primitives (Dialog, Select, Dropdown, Slider, Accordion, Tooltip, Sheet, Tabs).
5. **Lucide Icons & Framer Motion**: Smooth entrance transitions, micro-animations on counters, cart drawers, and cup slider.
6. **Supabase Client (`@supabase/supabase-js`)**: Typed client with automatic fallback to mock/seed data during offline or pre-configured deployments.
7. **Telegram Bot Dispatcher (`lib/telegram.ts`)**: Formats order receipts, rental inquiries, and repair tickets into clean Markdown messages with action links.

---

## 3. Database Schema (PostgreSQL / Supabase)

### Migration Script: `supabase/migrations/20261009000000_init_teacoff.sql`

```sql
-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  title JSONB NOT NULL, -- { "ru": "Капсульные кофемашины", "uz": "Kapsulali kofemashinalar", "en": "Capsule Coffee Machines" }
  description JSONB,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  taste_notes JSONB, -- { "ru": "Карамель, молочный шоколад, лесной орех", ... }
  price DECIMAL(12, 2) NOT NULL, -- UZS
  old_price DECIMAL(12, 2), -- UZS (strikethrough)
  weight_volume VARCHAR(50), -- "16 шт", "1000 г", "250 г"
  in_stock BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  is_rental_machine BOOLEAN DEFAULT false,
  min_capsule_boxes INT DEFAULT 4,
  specs JSONB DEFAULT '{}', -- { "pressure": "15 bar", "water_tank": "0.8 L", "system": "Dolce Gusto" }
  badge JSONB, -- { "ru": "АРЕНДА 0 СУМ", "uz": "IJARAGA 0 SO'M", "en": "RENT 0 UZS" }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  district VARCHAR(100) NOT NULL, -- Tashkent District
  delivery_address TEXT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  delivery_fee DECIMAL(12, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'new', -- new, confirmed, delivering, completed, cancelled
  items JSONB NOT NULL, -- Array of { product_id, title, price, quantity, image }
  payment_method VARCHAR(50) DEFAULT 'cash_on_delivery', -- cash_on_delivery, card_on_delivery
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Rental Inquiries
CREATE TABLE rental_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  machine_model VARCHAR(255) NOT NULL,
  selected_capsules JSONB, -- Array of { capsule_name, boxes_count }
  min_boxes_required INT DEFAULT 4,
  cups_per_day INT DEFAULT 4,
  district VARCHAR(100),
  delivery_address TEXT,
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, approved, installed, rejected
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Service Tickets
CREATE TABLE service_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number SERIAL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  machine_model VARCHAR(255) NOT NULL,
  issue_description TEXT NOT NULL,
  attachment_url TEXT,
  status VARCHAR(50) DEFAULT 'new', -- new, in_review, repairing, ready, closed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Promo Codes
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- 'percent' or 'fixed'
  discount_value DECIMAL(12, 2) NOT NULL,
  min_order_amount DECIMAL(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Pre-Populated Seed Data (Mapped to Qahvastore.uz Specification)

1. **Dolce Gusto Mini Me - Krups (Primary Rental Spotlight)**:
   - Price: 0 UZS (Rental) / 1,475,000 UZS retail.
   - Badge: "АРЕНДА 0 СУМ"
   - Specs: 15 bar, 0.8L reservoir, auto stop, min 4 capsule boxes/month.
   - Description: "Компактная капсульная система профессионального давления 15 бар."
2. **Dolce Gusto Genio S**:
   - Price: 0 UZS (Rental) / 2,200,000 UZS retail.
   - Badge: "ХИТ ПРОДАЖ"
   - Specs: Adjustable temperature, XL function, min 5 boxes/month, 15 bar.
3. **Dolce Gusto Piccolo XS**:
   - Price: 0 UZS (Rental) / 1,190,000 UZS retail.
   - Specs: Ultra-compact manual machine, 15 bar, min 4 boxes/month.
4. **Dolce Gusto Genio S Plus**:
   - Price: 0 UZS (Rental) / 2,450,000 UZS retail.
   - Specs: Espresso boost function, temperature selector, min 5 boxes/month.
5. **Dolce Gusto Genio S Touch**:
   - Price: 0 UZS (Rental) / 2,800,000 UZS retail.
   - Specs: Touch screen interface, metal drip tray, min 6 boxes/month.
6. **Nespresso Inissia**:
   - Price: 0 UZS (Rental) / 2,350,000 UZS retail.
   - Specs: 19 bar high-pressure, classic Nespresso capsule system, min 4 boxes/month.
7. **Carraro Crema Dolce Gusto Compatible Capsules (16 pcs)**:
   - Price: 95,000 UZS.
   - Taste Notes: "Бархатистая пенка, ноты карамели и лесного ореха. 100% Итальянская обжарка."
8. **Carraro Puro Arabica Nespresso Compatible (10 pcs)**:
   - Price: 85,000 UZS.
   - Taste Notes: "100% Арабика, цветочные и фруктовые ноты."
9. **Lavazza Super Crema Whole Bean Coffee (1000g)**:
   - Price: 369,000 UZS.
   - Badge: "ТОП 100 1895"
   - Taste Notes: "Сливочный вкус с нотами меда и миндаля."
10. **Carraro Herbal & Fruit Infusion Tea (20 filter bags)**:
    - Price: 65,000 UZS.
    - Taste Notes: "Натуральные альпийские травы, мята, мелисса."

---

## 5. Page Specifications & Feature Breakdown

### Page 1: `/[locale]/` — Homepage
- **Top Bar**: "БЕСПЛАТНАЯ ДОСТАВКА ПО ТАШКЕНТУ | ЗАМЕНА ЗА 24 ЧАСА | ОФИЦИАЛЬНЫЙ СЕРВИС TEACOFF".
- **Navbar**: Brand Logo (`TEA COFF ®`), Links (Каталог, АРЕНДА 0 СУМ [highlight badge], Кофемашины, Условия, О бренде), Language switcher (`RU` / `UZ` / `EN`), Theme toggle (Dark / Light), Search modal trigger, Favorites count, Cart slide-out drawer trigger.
- **Hero Section**:
  - Exact recreation of provided visual mockup.
  - Headline: "КОФЕМАШИНА У ВАС ЗА **0 СУМ**" (neon lime highlight).
  - Subhead & Value statement.
  - Primary CTA: "ВЫБРАТЬ КОФЕМАШИНУ ->" (scrolls to rental showcase / links to rental wizard).
  - Secondary: "БЕЗ СКРЫТЫХ ПЛАТЕЖЕЙ".
  - Hero right backdrop: Luxury espresso portafilter preparation visual + "PREMIUM ESPRESSO EXPERIENCE TASHKENT EST. 2024".
- **4-Point Value Props Bar**:
  - 1. Бесплатная доставка (по Ташкенту от 4 упаковок).
  - 2. 100% Сервис и замена (Бесплатно при любой поломке).
  - 3. Итальянские капсулы (Оригинал Carraro & Dolce Gusto).
  - 4. Без покупки оборудования (Кофемашина во временное пользование).
- **Featured Model Showcase ("ПРЕМИУМ ЛИНЕЙКА / Наши модели и кофе")**:
  - Horizontal/grid cards matching screenshot: De'Longhi Mini Me, Dolce Gusto Genio S, Carraro Crema Capsules, Lavazza Super Crema.
  - Badges: "АРЕНДА 0 СУМ", "ХИТ ПРОДАЖ", "ИТАЛИЯ 1927", "ТОП 100 1895".
  - Direct quick-add to cart or rental booking.
- **Dynamic Interactive Cup Calculator**:
  - Slider: 1 to 12 cups/day.
  - Live computation:
    - Required capsule boxes/month (`Math.ceil((cups * 30) / 16)`).
    - Estimated monthly spend in UZS.
    - Equipment savings: "Вы экономите 1 475 000 сум на покупке кофемашины!".
    - Instant button: "Оформить подписку с этим расчетом".
- **How It Works 4-Step Interactive Timeline**:
  - 1. Выберите кофемашину -> 2. Подберите любимые капсулы (от 4 уп.) -> 3. Бесплатная доставка до двери -> 4. Наслаждайтесь и пейте свежий кофе с сервисом 24/7.
- **Visual Category Grid**:
  - Кофемашины, Капсулы, Зерновой кофе, Чай, Аксессуары.
- **Split Luxury Experience Banner**:
  - Left: "ИСТИННЫЙ ВКУС ИТАЛИИ / Кофе ресторанного уровня у вас дома и в офисе", button "УЗНАТЬ О СОРТАХ".
  - Right: Engraved hardware aesthetic "TEACOFF / ORIGINAL HARDWARE SPEC / СЕРВИС И НАДЕЖНОСТЬ 24/7 / ТАШКЕНТ - УЗБЕКИСТАН".
- **Footer**:
  - Links, Tashkent contacts, copyright, privacy policy, public offer.

### Page 2: `/[locale]/arenda` — Dedicated Rental Information & Model Selector
- Complete breakdown of 0 UZS rental rules:
  - 0 UZS deposit / без залога.
  - Free delivery and setup across all Tashkent districts within 24 hours.
  - Full warranty & free repair/replacement if equipment malfunctions.
- Machine Model Selector Cards:
  - Mini Me, Genio S, Piccolo XS, Genio S Plus, Genio S Touch, Nespresso Inissia.
- Interactive Capsule Picker:
  - Grid of available capsule flavors (Espresso, Crema, Cappuccino, Lungo, Intenso, Decaffeinato).
  - Counter per box (+ / -).
  - Enforced validation: Total count must be `>= min_capsule_boxes` (e.g. >= 4). If `< 4`, button is locked with alert: "Для оформления аренды выберите минимум 4 коробки капсул".
- Instant Form:
  - Customer Name, Phone (+998), District, Delivery Address.
  - Submits to `rental_inquiries` table + sends Telegram alert to `@TeaCoff_lux`.

### Page 3: `/[locale]/catalog` & `/[locale]/catalog/[category]` — E-Commerce Shop
- Multifaceted Sidebar Filters:
  - Category selector (Все, Кофемашины, Зерновой кофе, Капсулы, Чай, Аксессуары).
  - Brand filter (Dolce Gusto, Nespresso, Carraro, Lavazza).
  - Price Range Slider (min-max in UZS).
  - "Только в наличии" (In-stock toggle).
- Sorting dropdown:
  - По популярности, Сначала дешевле, Сначала дороже, Новинки.
- Live debounced search bar.
- Responsive Product Cards:
  - High-res image, category label, title, taste profile pills, weight/quantity badge, current price, old price, Add to Cart button, Wishlist toggle.

### Page 4: `/[locale]/product/[slug]` — Product Detail Page
- Dynamic photo gallery (main image viewer + selectable thumbnails).
- Title, category breadcrumb, stock badge.
- Taste notes & roast intensity rating (e.g., 8/10).
- Technical specs accordion (bar pressure, volume, compatible capsules, origin).
- Delivery terms badge in Tashkent (free from 4 boxes / from 300,000 UZS).
- Quantity counter + "В корзину" + "Купить в 1 клик" (opens modal for quick name + phone entry).

### Page 5: `/[locale]/cart` & `/[locale]/checkout` — Cart & Order Placement
- Cart summary:
  - Item listing with quantity (+ / -), item remove, clear cart.
  - Promo code input with instant validation and discount calculation.
- Checkout Form:
  - Full Name, Phone number formatted with +998 mask.
  - Tashkent District dropdown:
    - Мирзо-Улугбек (Mirzo Ulug'bek)
    - Чиланзар (Chilonzor)
    - Юнусабад (Yunusobod)
    - Яккасарай (Yakkasaroy)
    - Мирабад (Mirobod)
    - Шайхантахур (Shayxontohur)
    - Яшнабад (Yashnobod)
    - Алмазар (Olmazor)
    - Учтепа (Uchtepa)
    - Сергели (Sergeli)
    - Янгихаёт (Yangihayot)
    - Бектемир (Bektemir)
  - Exact street address, apartment/office, delivery notes.
  - Payment method: "Оплата при получении (наличными или картой Uzcard/Humo/Visa)".
  - Order review & total calculation.
  - On submit: Saves order to Supabase `orders` table + triggers Telegram notification to `@TeaCoff_lux` + redirects to success confirmation screen with order number.

### Page 6: `/[locale]/service` — Service & Repair Portal
- Information about official TeaCoff warranty and repair.
- Interactive Repair Ticket Form:
  - Client Full Name.
  - Phone (+998).
  - Machine Model (dropdown or text).
  - Problem Description (text area).
  - Photo attachment (mock or Supabase Storage upload).
- Ticket Lookup Tool:
  - Client enters Ticket Number or Phone -> checks status: "Новая", "Принята", "На диагностике", "В ремонте", "Готово", "Закрыта".

### Page 7: `/[locale]/about` & `/[locale]/contacts`
- Company history, Italian coffee traditions, quality assurance.
- Tashkent office address, working hours (10:00 - 19:00, Daily), direct phone number, Telegram channel link `@TeaCoff_lux`, email.
- Interactive contact form.

### Page 8: `/[locale]/admin` — Protected Admin CMS
- Protected admin layout (Auth state check with mock credentials support for instant preview: `admin@teacoff.uz` / `teacoff2026`).
- Admin Dashboard Tabs:
  1. **Overview**: Total orders, revenue in UZS, active rental leads, open service tickets, low stock alerts.
  2. **Orders**: Filterable orders table, order detail modal, status dropdown (Новый, Подтверждён, Доставляется, Завершён, Отменён).
  3. **Products CRUD**: Table of products, Add New Product modal (title, slug, price, old price, category, taste notes, stock, rental machine flag), Edit and Delete actions.
  4. **Rental Inquiries**: Lead cards with customer details, selected capsules, machine model, status changer.
  5. **Service Tickets**: Queue of maintenance requests with status updater.
  6. **Settings & Promo Codes**: Manage active discount codes and delivery fee thresholds.

---

## 6. Telegram Bot Integration (`lib/telegram.ts`)

Notification formats sent via Telegram Bot API (`https://api.telegram.org/bot<TOKEN>/sendMessage`):

### 1. New Order Notification
```
🔔 НОВЫЙ ЗАКАЗ #TEA-1042
--------------------------------
👤 Клиент: Азиз Каримов
📞 Телефон: +998 90 123 45 67
📍 Район: Мирзо-Улугбек
🏠 Адрес: ул. Мустакиллик, д. 45, кв. 12
💳 Оплата: Наличными при получении

📦 Товары:
• Dolce Gusto Genio S (1 шт) — 0 сум (Аренда)
• Капсулы Carraro Crema (4 уп) — 380,000 сум
• Lavazza Super Crema 1кг (1 шт) — 369,000 сум

🚚 Доставка: 0 сум (Бесплатно)
💰 ИТОГО: 749,000 сум
📝 Примечание: Позвонить за час до приезда.
```

### 2. New Rental Inquiry Notification
```
☕️ НОВАЯ ЗАЯВКА НА АРЕНДУ КОФЕМАШИНЫ!
--------------------------------
👤 Клиент: Малика Умарова
📞 Телефон: +998 97 765 43 21
📍 Район: Юнусабад
🏠 Адрес: Амир Темур 108

🤖 Модель: Dolce Gusto Mini Me (15 bar)
☕️ Выбранные капсулы (Всего: 4 уп):
• Carraro Crema — 2 уп
• Carraro Puro Arabica — 2 уп
📅 Расчет: 4 чашки в день
```

### 3. Service Ticket Notification
```
🛠 НОВАЯ ЗАЯВКА В СЕРВИСНЫЙ ЦЕНТР #SRV-89
--------------------------------
👤 Клиент: Жасур Рахимов
📞 Телефон: +998 93 555 12 34
🤖 Модель: Dolce Gusto Piccolo XS
⚠️ Проблема: Не подает воду, мигает желтый индикатор
```

---

## 7. Internationalization (i18n) Strategy

- Structure:
  - `messages/ru.json` (Russian, default)
  - `messages/uz.json` (Uzbek)
  - `messages/en.json` (English)
- Middleware: Next.js middleware detecting locale cookie or routing from `/[locale]/...`.
- All static strings, button labels, category names, badges, form placeholders, error messages, and currency strings localized.

---

## 8. Directory & File Structure

```
TeaCoff/
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── messages/
│   ├── ru.json
│   ├── uz.json
│   └── en.json
├── supabase/
│   ├── migrations/
│   │   └── 20261009000000_init_teacoff.sql
│   └── seed.sql
├── src/
│   ├── i18n/
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── middleware.ts
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                  # Homepage
│   │   │   ├── arenda/
│   │   │   │   └── page.tsx              # Rental Page
│   │   │   ├── catalog/
│   │   │   │   ├── page.tsx              # Catalog
│   │   │   │   └── [category]/
│   │   │   │       └── page.tsx
│   │   │   ├── product/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx          # Product Detail
│   │   │   ├── cart/
│   │   │   │   └── page.tsx              # Cart
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx              # Checkout
│   │   │   ├── service/
│   │   │   │   └── page.tsx              # Service & Repair
│   │   │   ├── about/
│   │   │   │   └── page.tsx              # About
│   │   │   ├── contacts/
│   │   │   │   └── page.tsx              # Contacts
│   │   │   └── admin/
│   │   │       └── page.tsx              # Admin CMS
│   │   └── api/
│   │       ├── orders/route.ts
│   │       ├── rental/route.ts
│   │       ├── service/route.ts
│   │       └── telegram/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── TopAnnouncement.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── SearchModal.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ValueProps.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── CupCalculator.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   └── ExperienceBanner.tsx
│   │   ├── rental/
│   │   │   ├── MachineSelector.tsx
│   │   │   ├── CapsulePicker.tsx
│   │   │   └── RentalBookingForm.tsx
│   │   ├── catalog/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   └── SortDropdown.tsx
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── select.tsx
│   │   │   └── tabs.tsx
│   │   └── common/
│   │       ├── ThemeToggle.tsx
│   │       ├── LanguageSwitcher.tsx
│   │       └── Toast.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── telegram.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── store/
│   │   ├── useCartStore.ts
│   │   ├── useWishlistStore.ts
│   │   └── useThemeStore.ts
│   └── types/
│       ├── product.ts
│       ├── order.ts
│       └── rental.ts
└── public/
    ├── images/
    │   ├── logo.svg
    │   ├── hero-bg.jpg
    │   ├── machines/
    │   └── capsules/
    └── favicon.ico
```
