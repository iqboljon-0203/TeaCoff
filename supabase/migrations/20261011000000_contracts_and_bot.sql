-- TeaCoff Contracts and Telegram Bot Lifecycle Migration
-- Date: 2026-10-11

-- 1. Contracts Table for Coffee Machine Rentals
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

-- 2. Extend Orders table with contract and telegram chat links
ALTER TABLE orders ADD COLUMN IF NOT EXISTS contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

-- 3. Extend Service Tickets with contract and telegram chat links
ALTER TABLE service_tickets ADD COLUMN IF NOT EXISTS contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL;
ALTER TABLE service_tickets ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_contracts_phone ON contracts(customer_phone);
CREATE INDEX IF NOT EXISTS idx_contracts_telegram ON contracts(telegram_chat_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_next_purchase ON contracts(next_purchase_date);
CREATE INDEX IF NOT EXISTS idx_contracts_reminder_status ON contracts(reminder_status);
