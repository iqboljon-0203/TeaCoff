# TeaCoff (teacoff.uz) Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, enterprise-ready E-Commerce & Coffee Machine Subscription platform for "TeaCoff" (teacoff.uz) in Tashkent with a pixel-perfect dark mode matching the provided design, brand-derived light mode, 0 UZS rental calculator, dynamic catalog, Tashkent district checkout, Telegram bot notifications, and full admin CMS.

**Architecture:** Next.js 15 App Router with TypeScript and Server/Client Component balance; `next-intl` for tri-lingual localization (`ru`, `uz`, `en`); Zustand with local storage persistence for cart, wishlist, and theme; Supabase PostgreSQL schema with seamless mock seed fallback for immediate live operation; direct Telegram Bot API integration for instant manager alerts.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Zustand, `next-intl`, `@supabase/supabase-js`, Zod, React Hook Form.

**Spec:** `docs/superpowers/specs/2026-10-09-teacoff-platform-design.md`

## Global Constraints
- Framework: Next.js 15 (App Router with TypeScript).
- Default language: Russian (`ru`), supported locales: `ru`, `uz`, `en`.
- Primary Brand Accent: Volt / Neon Lime (`#D4FF00` / `#C8F902`).
- Dark Theme: Exact match to uploaded screenshot (deep onyx `#0B0B0C`, serif headings, 0 UZS lime highlight, dark glass cards).
- Light Theme: Brand logo palette (crisp alabaster `#FFFFFF`/`#F4F4F6`, volt lime buttons, ink black text).
- Payment: No Click/Payme online payment gateway. Strictly cash or card upon delivery in Tashkent.
- Delivery scope: Tashkent city districts only.
- Telegram Bot target: `@TeaCoff_lux` / manager chat via `lib/telegram.ts`.

## Review Focus
1. **Capsule Rental Validation:** User attempting to submit a rental inquiry with fewer than 4 boxes must be blocked with an informative alert in all 3 languages.
2. **Delivery District Restriction:** Checkout submissions must validate that a valid Tashkent district is selected.
3. **Cart Persistence:** Cart and wishlist items must survive page reloads and locale switching.
4. **Resilient Supabase Client:** App must function smoothly with pre-populated seed data even if remote Supabase environment variables are not yet populated.
5. **Dual-Theme Contrast:** Text on volt lime buttons must remain `#0A0A0A` (deep black) in both dark and light modes for AAA accessibility.

---

### Task 1: Project Initialization, Next.js 15 Setup & Base Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `.env.example`
- Create: `.gitignore`

**Interfaces:**
- Produces: Runnable Next.js 15 development environment with required dependencies.

- [ ] **Step 1: Create `package.json` with all dependencies**
  - Next.js 15, React 19, `next-intl`, `@supabase/supabase-js`, `zustand`, `lucide-react`, `framer-motion`, `zod`, `react-hook-form`, `tailwind-merge`, `clsx`, `canvas-confetti`.
- [ ] **Step 2: Create `tsconfig.json` with path alias `@/*` -> `./src/*`**
- [ ] **Step 3: Create `next.config.mjs` with `next-intl` plugin wrapper and image remote patterns**
- [ ] **Step 4: Create `postcss.config.mjs` and `tailwind.config.ts` configured with custom theme colors**
- [ ] **Step 5: Run `npm install` and verify dependencies install cleanly**

---

### Task 2: Design System, Typography & Dual-Theme Tokens

**Files:**
- Create: `src/app/globals.css`
- Create: `src/lib/utils.ts`
- Create: `src/store/useThemeStore.ts`
- Create: `src/components/common/ThemeToggle.tsx`

**Interfaces:**
- Consumes: Tailwind config.
- Produces: CSS custom properties (`--bg-primary`, `--accent-lime`, `--surface-card`, `--text-primary`), `cn()` helper, and persistent theme switcher.

- [ ] **Step 1: Define CSS variable tokens for Dark Mode (mockup exact match) & Light Mode in `src/app/globals.css`**
  - Dark: bg `#0B0B0C`, surface `#141416`, border `rgba(255,255,255,0.08)`, accent lime `#D4FF00`, gold `#D4A373`.
  - Light: bg `#F8F8FA`, surface `#FFFFFF`, border `#E5E7EB`, accent lime `#D4FF00`, text `#0F0F11`.
- [ ] **Step 2: Implement `src/lib/utils.ts` with `cn()` utility (`clsx` + `tailwind-merge`) and UZS currency formatter**
- [ ] **Step 3: Create `src/store/useThemeStore.ts` with Zustand and `localStorage` sync**
- [ ] **Step 4: Create `src/components/common/ThemeToggle.tsx` component with Sun/Moon animated transition**

---

### Task 3: Tri-Lingual i18n (`ru`, `uz`, `en`) Configuration & Dictionaries

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Create: `messages/ru.json`
- Create: `messages/uz.json`
- Create: `messages/en.json`

**Interfaces:**
- Produces: Locale routing middleware, translation loader, and comprehensive dictionaries for all 8 pages, rental calculator, districts, and notifications.

- [ ] **Step 1: Configure `src/i18n/routing.ts` and `src/i18n/request.ts` with locales `['ru', 'uz', 'en']` and default `ru`**
- [ ] **Step 2: Create `src/middleware.ts` to route localized paths (`/[locale]/...`)**
- [ ] **Step 3: Create complete `messages/ru.json` covering navigation, hero banner, rental conditions, calculator, catalog filters, checkout fields, service portal, and admin**
- [ ] **Step 4: Create `messages/uz.json` and `messages/en.json` with matching key parity**

---

### Task 4: Database Schema, Seed Catalog & Resilient Supabase Client

**Files:**
- Create: `supabase/migrations/20261009000000_init_teacoff.sql`
- Create: `src/types/database.ts`
- Create: `src/lib/seed-data.ts`
- Create: `src/lib/supabase.ts`

**Interfaces:**
- Produces: SQL schema migration file, TypeScript models (`Product`, `Order`, `RentalInquiry`, `ServiceTicket`), full seed dataset mapped to Qahvastore.uz (Mini Me, Genio S, Piccolo XS, Genio S Plus, Genio S Touch, Inissia, Carraro, Lavazza), and client with seamless seed fallback.

- [ ] **Step 1: Write SQL migration in `supabase/migrations/20261009000000_init_teacoff.sql` for categories, products, orders, rental_inquiries, service_tickets, promo_codes**
- [ ] **Step 2: Define strong TypeScript types in `src/types/database.ts`**
- [ ] **Step 3: Populate `src/lib/seed-data.ts` with exact machines, capsules, whole beans, and teas**
- [ ] **Step 4: Build `src/lib/supabase.ts` providing data access functions (`getProducts`, `getProductBySlug`, `createOrder`, `createRentalInquiry`, `createServiceTicket`) with offline mock fallback**

---

### Task 5: State Management (Zustand Stores) & Slide-out Cart Drawer

**Files:**
- Create: `src/store/useCartStore.ts`
- Create: `src/store/useWishlistStore.ts`
- Create: `src/components/layout/CartDrawer.tsx`

**Interfaces:**
- Produces: Persisted cart store (`addItem`, `removeItem`, `updateQuantity`, `clearCart`, `appliedPromo`), wishlist store, and floating/drawer cart panel.

- [ ] **Step 1: Implement `src/store/useCartStore.ts` with quantity bounds, subtotal, and capsule counter helpers**
- [ ] **Step 2: Implement `src/store/useWishlistStore.ts` for product favorites**
- [ ] **Step 3: Build `src/components/layout/CartDrawer.tsx` with item list, quantity buttons, subtotal, delivery indicator, and direct checkout link**

---

### Task 6: Telegram Bot Notification Engine & Webhook API

**Files:**
- Create: `src/lib/telegram.ts`
- Create: `src/app/api/orders/route.ts`
- Create: `src/app/api/rental/route.ts`
- Create: `src/app/api/service/route.ts`

**Interfaces:**
- Produces: Markdown message formatters for orders, rental inquiries, and service tickets; server API endpoints forwarding to Telegram Bot API with resilient logging.

- [ ] **Step 1: Build `src/lib/telegram.ts` with formatted templates for orders, rental leads, and repair tickets**
- [ ] **Step 2: Implement `src/app/api/orders/route.ts` handling order creation, DB insert, and Telegram notification**
- [ ] **Step 3: Implement `src/app/api/rental/route.ts` handling rental inquiry submission and Telegram alert**
- [ ] **Step 4: Implement `src/app/api/service/route.ts` handling ticket generation and Telegram alert**

---

### Task 7: Shared Layout Components (Header, Footer, Modals)

**Files:**
- Create: `src/components/layout/TopAnnouncement.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/common/LanguageSwitcher.tsx`
- Create: `src/components/layout/SearchModal.tsx`
- Create: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Produces: Header matching mockup (announcement bar, logo with registered mark, navigation links, rental badge, RU/UZ/EN switcher, search modal, cart icon with badge), and dark luxury footer.

- [ ] **Step 1: Implement `TopAnnouncement.tsx` with rotating delivery and warranty notices**
- [ ] **Step 2: Implement `Header.tsx` with responsive desktop/mobile menus, theme toggle, language switcher, search trigger, and cart trigger**
- [ ] **Step 3: Implement `SearchModal.tsx` with live search debounced filtering**
- [ ] **Step 4: Implement `Footer.tsx` with Tashkent office information, working hours, and legal links**
- [ ] **Step 5: Assemble root `src/app/[locale]/layout.tsx` with NextIntlClientProvider and ThemeProvider**

---

### Task 8: Homepage (`/[locale]/page.tsx`) Matching Visual Mockup

**Files:**
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/ValueProps.tsx`
- Create: `src/components/home/FeaturedProducts.tsx`
- Create: `src/components/home/CupCalculator.tsx`
- Create: `src/components/home/HowItWorks.tsx`
- Create: `src/components/home/CategoryGrid.tsx`
- Create: `src/components/home/ExperienceBanner.tsx`
- Create: `src/app/[locale]/page.tsx`

**Interfaces:**
- Produces: Pixel-perfect homepage matching the provided image: Hero with 0 UZS lime highlight, 4 value prop cards, featured models (Mini Me, Genio S, Carraro Crema, Lavazza), interactive cup calculator (1-12 cups slider), 4-step timeline, categories, and split Italian coffee banner.

- [ ] **Step 1: Build `HeroSection.tsx` with exact typography, lime badge, CTA button, and coffee equipment background visuals**
- [ ] **Step 2: Build `ValueProps.tsx` with 4 luxury glass cards (Free delivery, 100% service, Italian capsules, No equipment purchase)**
- [ ] **Step 3: Build `FeaturedProducts.tsx` displaying Mini Me (0 UZS), Genio S (0 UZS), Carraro Crema, and Lavazza with add-to-cart buttons**
- [ ] **Step 4: Build `CupCalculator.tsx` with dynamic slider (1-12 cups/day), required box calculation, monthly spend, and saved equipment cost**
- [ ] **Step 5: Build `HowItWorks.tsx` interactive 4-step subscription flow**
- [ ] **Step 6: Build `CategoryGrid.tsx` and `ExperienceBanner.tsx`**
- [ ] **Step 7: Assemble `src/app/[locale]/page.tsx`**

---

### Task 9: Dedicated Rental Page (`/[locale]/arenda/page.tsx`) & Capsule Picker

**Files:**
- Create: `src/components/rental/MachineSelector.tsx`
- Create: `src/components/rental/CapsulePicker.tsx`
- Create: `src/components/rental/RentalBookingForm.tsx`
- Create: `src/app/[locale]/arenda/page.tsx`

**Interfaces:**
- Produces: Dedicated rental hub with 0 UZS rules, machine model cards (Mini Me, Genio S, Piccolo XS, Genio S Plus, Genio S Touch, Nespresso Inissia), interactive capsule flavor picker with `>= 4 boxes` validation lock, and direct submission to Telegram `@TeaCoff_lux`.

- [ ] **Step 1: Build `MachineSelector.tsx` with model cards and specification badges**
- [ ] **Step 2: Build `CapsulePicker.tsx` with flavor counters and minimum box validation rule**
- [ ] **Step 3: Build `RentalBookingForm.tsx` with phone input, district selection, and instant submission**
- [ ] **Step 4: Assemble `src/app/[locale]/arenda/page.tsx`**

---

### Task 10: E-Commerce Catalog & Filtering (`/[locale]/catalog`)

**Files:**
- Create: `src/components/catalog/ProductCard.tsx`
- Create: `src/components/catalog/FilterSidebar.tsx`
- Create: `src/components/catalog/SortDropdown.tsx`
- Create: `src/app/[locale]/catalog/page.tsx`
- Create: `src/app/[locale]/catalog/[category]/page.tsx`

**Interfaces:**
- Produces: Full catalog view with category tabs, brand filters, price range slider, in-stock toggle, sorting (popularity, price asc/desc, newest), and responsive product card grid.

- [ ] **Step 1: Build `ProductCard.tsx` with taste note tags, badges, image hover effect, and cart/wishlist actions**
- [ ] **Step 2: Build `FilterSidebar.tsx` and `SortDropdown.tsx`**
- [ ] **Step 3: Build `src/app/[locale]/catalog/page.tsx` with live client filtering and URL query sync**
- [ ] **Step 4: Build `src/app/[locale]/catalog/[category]/page.tsx` for direct category deep linking**

---

### Task 11: Product Detail Page (`/[locale]/product/[slug]`)

**Files:**
- Create: `src/components/product/ProductGallery.tsx`
- Create: `src/components/product/OneClickOrderModal.tsx`
- Create: `src/app/[locale]/product/[slug]/page.tsx`

**Interfaces:**
- Produces: Product page with interactive gallery, taste notes, technical specs table, warranty badges, quantity selector, add to cart, and "Купить в 1 клик" modal.

- [ ] **Step 1: Build `ProductGallery.tsx` with main view and selectable thumbnails**
- [ ] **Step 2: Build `OneClickOrderModal.tsx` allowing fast ordering with just name and phone number**
- [ ] **Step 3: Assemble `src/app/[locale]/product/[slug]/page.tsx`**

---

### Task 12: Cart & Tashkent Checkout Flow (`/[locale]/cart` & `/[locale]/checkout`)

**Files:**
- Create: `src/app/[locale]/cart/page.tsx`
- Create: `src/app/[locale]/checkout/page.tsx`

**Interfaces:**
- Produces: Full cart page with item counters and promo code validator; Checkout page with Tashkent district dropdown, address fields, cash/card on delivery option, and Telegram order dispatch.

- [ ] **Step 1: Build `src/app/[locale]/cart/page.tsx` with item management and order summary**
- [ ] **Step 2: Build `src/app/[locale]/checkout/page.tsx` with Tashkent district selection, Zod validation, order submission, and success modal**

---

### Task 13: Service & Repair Portal (`/[locale]/service`)

**Files:**
- Create: `src/components/service/RepairTicketForm.tsx`
- Create: `src/components/service/TicketStatusTracker.tsx`
- Create: `src/app/[locale]/service/page.tsx`

**Interfaces:**
- Produces: Equipment service portal with official maintenance rules, repair ticket submission form with image upload support, and real-time status tracker by ticket ID.

- [ ] **Step 1: Build `RepairTicketForm.tsx` with client name, phone, model, problem description, and photo upload**
- [ ] **Step 2: Build `TicketStatusTracker.tsx` with lookup by ticket number or phone**
- [ ] **Step 3: Assemble `src/app/[locale]/service/page.tsx`**

---

### Task 14: About Brand & Contacts Pages (`/[locale]/about` & `/[locale]/contacts`)

**Files:**
- Create: `src/app/[locale]/about/page.tsx`
- Create: `src/app/[locale]/contacts/page.tsx`

**Interfaces:**
- Produces: Story of Italian coffee traditions, standards, office address in Tashkent, working hours (10:00 - 19:00), interactive contact inquiry form, and Telegram bot link.

- [ ] **Step 1: Build `src/app/[locale]/about/page.tsx`**
- [ ] **Step 2: Build `src/app/[locale]/contacts/page.tsx`**

---

### Task 15: Admin CMS Dashboard (`/[locale]/admin`)

**Files:**
- Create: `src/components/admin/AdminOverview.tsx`
- Create: `src/components/admin/OrdersManager.tsx`
- Create: `src/components/admin/ProductsManager.tsx`
- Create: `src/components/admin/RentalInquiriesManager.tsx`
- Create: `src/components/admin/ServiceTicketsManager.tsx`
- Create: `src/app/[locale]/admin/page.tsx`

**Interfaces:**
- Produces: Admin panel with metrics overview, order status updater (Новый, Подтверждён, Доставляется, Завершён), Product CRUD modal, Rental leads review, and Service ticket tracker.

- [ ] **Step 1: Build `AdminOverview.tsx` with key performance metrics and low stock alerts**
- [ ] **Step 2: Build `OrdersManager.tsx` with status updater and order items inspector**
- [ ] **Step 3: Build `ProductsManager.tsx` with Add/Edit/Delete product modal**
- [ ] **Step 4: Build `RentalInquiriesManager.tsx` and `ServiceTicketsManager.tsx`**
- [ ] **Step 5: Assemble `src/app/[locale]/admin/page.tsx` with admin authentication guard**

---

### Task 16: Verification, Visual Review & Production Build

**Files:**
- Test all pages: Home, Arenda, Catalog, Product, Cart, Checkout, Service, About, Contacts, Admin.
- Verify: Russian, Uzbek, English translations.
- Verify: Dark Mode (mockup exact match) & Light Mode (TeaCoff logo neon lime).
- Run: `npm run build` to ensure TypeScript and linting compile with zero errors.

- [ ] **Step 1: Verify all 8 routes and language switches (`/ru`, `/uz`, `/en`)**
- [ ] **Step 2: Test rental 0 UZS capsule validation (< 4 boxes blocked, >= 4 allowed)**
- [ ] **Step 3: Test checkout flow with Tashkent district selection and Telegram payload preview**
- [ ] **Step 4: Execute `npm run build` and resolve any compilation issues**
