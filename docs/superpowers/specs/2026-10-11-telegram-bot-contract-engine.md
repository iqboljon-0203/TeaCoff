# TeaCoff Telegram Bot & Contract Lifecycle Engine — Technical Specification

**Date:** 2026-10-11  
**Project:** TeaCoff E-Commerce & Coffee Machine Rental Platform  
**Target Architecture:** Next.js 15 API Webhook + Interactive Bot Engine + Supabase Contracts & Cron Engine + Admin Manager Dashboard  

---

## 1. Executive Summary

This specification outlines the architecture, database models, interactive workflows, and automation algorithms for the **TeaCoff Smart Telegram Bot & Rental Contract Lifecycle Engine**.

The system automates the recurring capsule purchase lifecycle for coffee machine rental clients, eliminates friction with 1-click repeat orders, monitors minimum volume compliance, provides machine diagnostics/service dispatch, sends automated delivery updates, synchronizes live catalog data with the website, and equips managers with a dedicated command dashboard and analytics.

---

## 2. Core Functional Requirements

### 2.1. Contract-Based Automated Reminders & Smart Forecast
- **Planned Cycle:** Each rental contract specifies a start date, purchase interval (default: 30 days), and minimum capsule box volume (e.g., 4 boxes).
- **Primary Reminder:** On the scheduled replenishment date, the bot dispatches an interactive reminder:
  - *RU:* «☕ Пришло время пополнить запас капсул! Хотите повторить прошлый заказ?»
  - *UZ:* «☕ Kapsulalarni to'ldirish vaqti keldi! Oxirgi buyurtmani takrorlaysizmi?»
- **Follow-Up Reminder:** If no order is placed within 3 days, a follow-up reminder is dispatched.
- **Cycle Reset & Smart Forecasting (⭐):**
  - When the client places an order (whether on schedule or ahead of time), the next purchase date is dynamically recalculated based on the *actual order date + cycle days*, preventing premature or redundant reminders.

### 2.2. Automated Reminder Suppression (Churn & Status Protection)
- Reminders are automatically halted if contract status is changed to:
  - `paused` (Клиент временно приостановлен)
  - `terminated` (Договор досрочно расторгнут)
  - `completed` (Договор закончился)
  - `machine_returned` (Кофемашина возвращена)

### 2.3. 1-Click Repeat Order & Edit Order
- **[🔄 Повторить заказ]:** Automatically loads the client's previous order composition, validates min box quota, creates order in `orders` table, marks contract reminder as `ordered`, notifies client with confirmation, and dispatches an order notification to the manager channel.
- **[✏️ Изменить заказ]:** Allows client to modify quantities inline or open the synchronized WebApp catalog with their cart pre-populated.

### 2.4. Manager Inaction Alert
- If a client has received both primary and follow-up reminders and hasn't placed an order after 5 days:
  - Status switches to `needs_manager_attention`.
  - Alert sent to management Telegram chat:
    *«⚠️ Клиент не оформил заказ после напоминания. Клиент: [Имя], Тел: [Телефон], Договор: [№]»* with direct contact link.

### 2.5. Minimum Order Volume Enforcement
- Checks total capsule boxes against contract `min_capsule_boxes` (e.g. 4 boxes for free machine rental).
- If volume is below threshold, blocks checkout and displays polite guidance explaining contract terms.

### 2.6. «Моя кофемашина» (My Coffee Machine Profile)
- Dedicated interactive card showing:
  - Machine model & photo
  - Contract number & start date
  - Contract status (Active / Paused / etc.)
  - Minimum monthly box requirement
  - Next planned purchase date
- Direct action buttons: `[🔄 Заказать капсулы]`, `[🛠 Нужна помощь с кофемашиной]`, `[📞 Менеджер]`.

### 2.7. Service & Diagnostics Dispatch
- Service assistance menu `[🛠 Нужна помощь с кофемашиной]`:
  - `🔴 Не включается`
  - `💧 Не подаёт воду`
  - `☕ Проблема с приготовлением кофе`
  - `🧼 Нужна чистка (декальцинация)`
  - `❓ Другая проблема`
- Selection instantly registers a record in `service_tickets` and alerts the service manager.

### 2.8. Automated Delivery Tracking Updates
- Lifecycle triggers:
  - `new` / `confirmed` → 📦 «Ваш заказ принят и собирается!»
  - `delivering` → 🚚 «Ваш заказ передан курьеру и уже в пути!»
  - `completed` → ✅ «Заказ успешно доставлен! Приятного кофепития!»
- Triggers fire automatically upon status change in CMS, eliminating manual message typing.

### 2.9. Unified Catalog Synchronized With Website
- Bot directly queries `getProducts()` / database.
- Pricing, titles, images, stock availability, and specs are 100% unified with the website.

### 2.10. Manager Dashboard (`/admin` Bot & Contracts Tab)
- Real-time KPIs:
  - Reminders sent today
  - Orders placed
  - Pending orders
  - Clients requiring manager attention
- Contracts management table:
  - Search, filter by status, manual reminder trigger, status update.
- Manual Cron execution button: `[⚡ Запустить проверку напоминаний сейчас]`.

### 2.11. Business Analytics
- Active contracts count
- Repeat order rate (%)
- Average order value (UZS)
- Total monthly capsules volume
- Top selling flavors / capsule SKUs
- Missed cycle count & expiring contracts in the next 30 days.

---

## 3. Database Schema Extensions

### 3.1. `contracts` Table
```sql
CREATE TABLE IF NOT EXISTS contracts (
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
```

### 3.2. `orders` Table Extensions
- Add `contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL`
- Add `telegram_chat_id BIGINT`

---

## 4. Architecture & API Endpoints

1. **Telegram Webhook Endpoint:** `/api/bot/webhook`
   - Handles Telegram updates (messages, callback queries, commands `/start`, `/machine`, `/catalog`, `/help`).
   - Dispatches bilingual responses, interactive menus, inline keyboards.
2. **Cron Scheduler Endpoint:** `/api/bot/cron`
   - Scans active contracts where `next_purchase_date <= TODAY`.
   - Sends primary reminder if `reminder_status == 'idle'`.
   - Sends follow-up reminder if `reminder_status == 'reminded_primary'` and elapsed >= 3 days.
   - Alerts manager if elapsed >= 5 days and transitions to `needs_attention`.
   - Secured with secret bearer token / CRON_SECRET.
3. **Delivery Status Webhook/Trigger:**
   - In `updateOrderStatus(orderId, status)`, if `order.telegram_chat_id` exists, send automated formatted message with cute branding.
4. **Admin UI Extensions:**
   - New tab **«Управление ботом и договорами»** in `src/app/[locale]/admin/page.tsx`.
   - Analytics cards, contract filtering, manual reminder actions, and instant cron trigger.

---

## 5. Security & Internationalization
- Telegram Bot API token configured via `TELEGRAM_BOT_TOKEN`.
- Webhook verification & CRON_SECRET protection for `/api/bot/cron`.
- Complete bilingual support (Russian & Uzbek).
