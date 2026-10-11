# Telegram Bot & Contract Lifecycle Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an intelligent bilingual Telegram bot and automated contract lifecycle engine that manages rental coffee machine reminders, 1-click repeat orders, minimum quantity enforcement, service tickets, automated delivery alerts, synchronized catalog, manager alerts, and an admin analytics dashboard.

**Architecture:** Next.js 15 Webhook API route (`/api/bot/webhook`) + Telegram Bot Engine + Cron Scheduler (`/api/bot/cron`) + Supabase / in-memory Contract store + Next.js Admin CMS tab with live analytics.

**Tech Stack:** Next.js 15 (App Router), TypeScript, TailwindCSS, Supabase / PostgreSQL, Telegram Bot API.

**Spec:** `docs/superpowers/specs/2026-10-11-telegram-bot-contract-engine.md`

## Global Constraints
- Unified live catalog directly linked to `getProducts()` / database.
- Bilingual support: Russian (`ru`) and Uzbek (`uz`).
- Automated reminder suppression for statuses: `paused`, `terminated`, `completed`, `machine_returned`.
- Smart cycle recalculation (⭐): actual purchase date + cycle days.
- Zero mock failures: support both Supabase PostgreSQL and local in-memory runtime cache for seamless operation.

## Review Focus
1. Min box quota enforcement: Attempting to repeat or submit an order with fewer boxes than the contract's `min_capsule_boxes` must be rejected with an informative explanation.
2. Status protection: Paused or terminated contracts must never receive automated reminders.
3. Smart forecasting: When a customer orders 5 days before the planned reminder date, the reminder for the old date must be cleared and the new cycle set to order date + 30 days.
4. Delivery notifications: Updating order status in the CMS (`confirmed`, `delivering`, `completed`) must immediately send a Telegram message to the customer if `telegram_chat_id` exists.
5. Inactive customer escalation: If a customer does not order 5 days after reminder, manager chat must receive an actionable escalation notice.

---

### Task 1: Database Schema & Contract Model Extension
**Files:**
- Create: `supabase/migrations/20261011000000_contracts_and_bot.sql`
- Modify: `src/types/database.ts`
- Modify: `src/lib/supabase.ts`

- [ ] Write SQL migration defining `contracts` table with indexes and `orders` contract links.
- [ ] Add `Contract`, `ContractStatus`, `ContractReminderStatus` interfaces to `src/types/database.ts`.
- [ ] Add contract CRUD helpers and in-memory mock seed contracts in `src/lib/supabase.ts` (`getAllContracts`, `getContractById`, `getContractByPhoneOrChatId`, `createContract`, `updateContractStatus`, `updateContractCycleOnOrder`).

---

### Task 2: Bot Core Engine, Bilingual Messages & Actions
**Files:**
- Create: `src/lib/bot/types.ts`
- Create: `src/lib/bot/messages.ts`
- Create: `src/lib/bot/engine.ts`

- [ ] Define bot types, action payloads, and callback data structures in `src/lib/bot/types.ts`.
- [ ] Implement complete bilingual messages (RU & UZ) for reminders, follow-ups, machine profile, repeat order confirmation, quota error, and service menu in `src/lib/bot/messages.ts`.
- [ ] Implement `src/lib/bot/engine.ts` handling:
  - Command `/start`, `/machine`, `/catalog`, `/help`
  - Inline buttons: `repeat_order`, `edit_order`, `service_menu`, `service_ticket`, `set_lang`
  - 1-Click repeat order creator: checks minimum boxes, generates order, links to contract, notifies client & manager.
  - Service ticket generator: saves to `service_tickets` and alerts manager.

---

### Task 3: Telegram Webhook Route & Automated Delivery Notifications
**Files:**
- Create: `src/app/api/bot/webhook/route.ts`
- Modify: `src/lib/telegram.ts`
- Modify: `src/app/api/orders/route.ts`

- [ ] Create `/api/bot/webhook` Next.js API route that validates Telegram payload and delegates to `processBotUpdate(update)`.
- [ ] Add `sendDeliveryStatusUpdate(order, newStatus)` helper in `src/lib/telegram.ts`.
- [ ] Connect order status changes in `updateOrderStatus` to trigger Telegram delivery messages automatically when `telegram_chat_id` is present.

---

### Task 4: Contract Lifecycle Engine & Cron Scheduler
**Files:**
- Create: `src/lib/bot/contract-scheduler.ts`
- Create: `src/app/api/bot/cron/route.ts`

- [ ] Implement `runContractLifecycleCheck()` in `src/lib/bot/contract-scheduler.ts`:
  - Filter active contracts (`status === 'active'`).
  - For contracts due today or overdue with `idle`: send primary reminder, set `reminded_primary`.
  - For contracts reminded >= 3 days ago without order: send follow-up reminder, set `reminded_followup`.
  - For contracts reminded >= 5 days ago without order: set `needs_attention` and alert manager chat.
- [ ] Implement `/api/bot/cron` route with optional query/secret key, callable by cron jobs and from the Admin panel.

---

### Task 5: Admin Manager Dashboard & Business Analytics
**Files:**
- Modify: `src/app/[locale]/admin/page.tsx`

- [ ] Add **«Бот и договоры»** tab to Admin dashboard.
- [ ] Render 4 KPI counters: Reminders sent today, Orders placed, Pending orders, Clients needing manager attention.
- [ ] Add `[⚡ Запустить проверку напоминаний сейчас]` button with instant execution feedback.
- [ ] Add Interactive Contracts Table:
  - Client name, Phone, Machine model, Contract #, Start date, Next purchase date, Status badge.
  - Filter by status (Все, Активен, Приостановлен, Требует внимания).
  - Quick action to trigger reminder manually or edit status.
- [ ] Add Analytics section: Active contracts, repeat order rate, avg check, monthly capsules sold, top flavors, expiring contracts.

---

### Task 6: End-to-End Verification & Validation
- [ ] Run Next.js lint & build verification (`npm run build`).
- [ ] Test mock contract cycle recalculation (early purchase resets next date).
- [ ] Test minimum box volume validation logic.
- [ ] Verify delivery status notification payload generation.
