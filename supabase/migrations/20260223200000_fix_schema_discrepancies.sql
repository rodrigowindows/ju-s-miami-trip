-- ============================================================
-- Fix schema discrepancies between migrations and types.ts
-- This migration reconciles columns dropped/missing after
-- the comprehensive schema migration ran.
-- ============================================================

-- ============================================================
-- 1. ORDERS TABLE - Add missing columns
-- ============================================================

-- customer_name and customer_phone (dropped by comprehensive migration)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text NOT NULL DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone text;

-- total_amount (dropped by comprehensive migration)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount numeric NOT NULL DEFAULT 0;

-- deposit_amount (ensure it exists)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS deposit_amount numeric NOT NULL DEFAULT 0;

-- Fix deposit_paid: comprehensive created it as numeric, types.ts expects boolean.
-- If deposit_paid is numeric, migrate its value to deposit_amount and change type to boolean.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders'
      AND column_name = 'deposit_paid' AND data_type = 'numeric'
  ) THEN
    -- Move numeric value to deposit_amount if deposit_amount is still 0
    UPDATE public.orders
      SET deposit_amount = deposit_paid
      WHERE deposit_amount = 0 AND deposit_paid > 0;
    -- Drop numeric column and recreate as boolean
    ALTER TABLE public.orders DROP COLUMN deposit_paid;
    ALTER TABLE public.orders ADD COLUMN deposit_paid boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Ensure deposit_paid exists as boolean (covers case where column didn't exist at all)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS deposit_paid boolean NOT NULL DEFAULT false;

-- balance_paid (never created)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS balance_paid boolean NOT NULL DEFAULT false;

-- exchange_rate, spread_pct (never created)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS exchange_rate numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS spread_pct numeric;

-- price_brl, price_usd (never created on orders table)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS price_brl numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS price_usd numeric;

-- product_image_url, product_url (never created on orders table)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product_image_url text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product_url text;

-- ============================================================
-- 2. TRIPS TABLE - Add missing columns
-- ============================================================

ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'planejada';

-- Allow NULL for flight_number (types.ts expects string | null)
ALTER TABLE public.trips ALTER COLUMN flight_number DROP NOT NULL;

-- ============================================================
-- 3. ORDER_EVENTS TABLE - Fix column name mismatch
-- Comprehensive migration renamed status -> event_type,
-- but types.ts and seed data expect "status"
-- ============================================================

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'order_events'
      AND column_name = 'event_type'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'order_events'
      AND column_name = 'status'
  ) THEN
    ALTER TABLE public.order_events RENAME COLUMN event_type TO status;
  END IF;
END $$;
