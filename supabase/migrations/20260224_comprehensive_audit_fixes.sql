-- =============================================================================
-- Comprehensive Audit Fixes Migration
-- Fixes: RLS, Foreign Keys, Duplicate Policies, Trigger
-- =============================================================================

-- ─── 1. Fix product_questions INSERT policy (require authentication) ─────────

DO $$
BEGIN
  -- Drop the permissive policies that allow anonymous inserts
  DROP POLICY IF EXISTS "Anyone can ask a question" ON public.product_questions;
  DROP POLICY IF EXISTS "Anyone can ask questions" ON public.product_questions;

  -- Create a secure policy requiring authentication
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'product_questions' AND policyname = 'Authenticated users can ask questions'
  ) THEN
    CREATE POLICY "Authenticated users can ask questions"
      ON public.product_questions
      FOR INSERT
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- ─── 2. Add missing Foreign Keys ────────────────────────────────────────────

-- orders.client_id -> profiles(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'orders_client_id_profiles_fkey'
      AND table_name = 'orders'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_client_id_profiles_fkey
      FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- order_reviews.client_id -> profiles(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'order_reviews_client_id_profiles_fkey'
      AND table_name = 'order_reviews'
  ) THEN
    ALTER TABLE public.order_reviews
      ADD CONSTRAINT order_reviews_client_id_profiles_fkey
      FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- wallet_transactions.client_id -> profiles(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'wallet_transactions_client_id_profiles_fkey'
      AND table_name = 'wallet_transactions'
  ) THEN
    ALTER TABLE public.wallet_transactions
      ADD CONSTRAINT wallet_transactions_client_id_profiles_fkey
      FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- wishlists.client_id -> profiles(id) (may already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'wishlists_client_id_profiles_fkey'
      AND table_name = 'wishlists'
  ) THEN
    ALTER TABLE public.wishlists
      ADD CONSTRAINT wishlists_client_id_profiles_fkey
      FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- referrals.referrer_id -> profiles(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'referrals_referrer_id_profiles_fkey'
      AND table_name = 'referrals'
  ) THEN
    ALTER TABLE public.referrals
      ADD CONSTRAINT referrals_referrer_id_profiles_fkey
      FOREIGN KEY (referrer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- referrals.referred_id -> profiles(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'referrals_referred_id_profiles_fkey'
      AND table_name = 'referrals'
  ) THEN
    ALTER TABLE public.referrals
      ADD CONSTRAINT referrals_referred_id_profiles_fkey
      FOREIGN KEY (referred_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ─── 3. Ensure trigger on_auth_user_created exists ──────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- ─── 4. Remove duplicate RLS policies ───────────────────────────────────────
-- Keep the cleanest/most modern policy for each table, remove duplicates.

-- profiles: keep profiles_* and "Users can update own profile"
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin sees all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin manages profiles" ON public.profiles;

-- trips
DROP POLICY IF EXISTS "Authenticated can read trips" ON public.trips;
DROP POLICY IF EXISTS "Clients can view trips" ON public.trips;
DROP POLICY IF EXISTS "Admin can manage trips" ON public.trips;

-- Ensure clean trips policies exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Anyone can view trips'
  ) THEN
    CREATE POLICY "Anyone can view trips" ON public.trips FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Admin manages trips'
  ) THEN
    CREATE POLICY "Admin manages trips" ON public.trips FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- orders
DROP POLICY IF EXISTS "Admin can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin full access" ON public.orders;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Admin manages all orders'
  ) THEN
    CREATE POLICY "Admin manages all orders" ON public.orders FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- order_items
DROP POLICY IF EXISTS "Admin can manage all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admin full access on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Clients view own order_items" ON public.order_items;
DROP POLICY IF EXISTS "Clients insert own order_items" ON public.order_items;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Admin manages all order_items'
  ) THEN
    CREATE POLICY "Admin manages all order_items" ON public.order_items FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- order_events
DROP POLICY IF EXISTS "Admin can manage all order events" ON public.order_events;
DROP POLICY IF EXISTS "Admin full access on order_events" ON public.order_events;
DROP POLICY IF EXISTS "Clients view own order_events" ON public.order_events;
DROP POLICY IF EXISTS "Clients insert own order_events" ON public.order_events;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'order_events' AND policyname = 'Admin manages all order_events'
  ) THEN
    CREATE POLICY "Admin manages all order_events" ON public.order_events FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- payments
DROP POLICY IF EXISTS "Admin can manage all payments" ON public.payments;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Admin manages all payments'
  ) THEN
    CREATE POLICY "Admin manages all payments" ON public.payments FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- whatsapp_templates
DROP POLICY IF EXISTS "Authenticated can view templates" ON public.whatsapp_templates;
DROP POLICY IF EXISTS "Admin can manage templates" ON public.whatsapp_templates;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_templates' AND policyname = 'Admin manages templates'
  ) THEN
    CREATE POLICY "Admin manages templates" ON public.whatsapp_templates FOR ALL USING (is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_templates' AND policyname = 'Anyone can view templates'
  ) THEN
    CREATE POLICY "Anyone can view templates" ON public.whatsapp_templates FOR SELECT USING (true);
  END IF;
END $$;

-- catalog_products
DROP POLICY IF EXISTS "Authenticated can view active catalog" ON public.catalog_products;
DROP POLICY IF EXISTS "Admin can manage catalog" ON public.catalog_products;
DROP POLICY IF EXISTS "Anyone can view active catalog products" ON public.catalog_products;
DROP POLICY IF EXISTS "Admin manage catalog" ON public.catalog_products;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'catalog_products' AND policyname = 'Anyone can view active products'
  ) THEN
    CREATE POLICY "Anyone can view active products" ON public.catalog_products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'catalog_products' AND policyname = 'Admins manage products'
  ) THEN
    CREATE POLICY "Admins manage products" ON public.catalog_products FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- promotions
DROP POLICY IF EXISTS "Anyone can view active promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admin can manage promotions" ON public.promotions;
DROP POLICY IF EXISTS "Clients can view active promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admin manage promotions" ON public.promotions;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'promotions' AND policyname = 'Admins manage promotions'
  ) THEN
    CREATE POLICY "Admins manage promotions" ON public.promotions FOR ALL USING (is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'promotions' AND policyname = 'Anyone can view promotions'
  ) THEN
    CREATE POLICY "Anyone can view promotions" ON public.promotions FOR SELECT USING (active = true);
  END IF;
END $$;

-- referrals
DROP POLICY IF EXISTS "Admin can manage referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admin sees all referrals" ON public.referrals;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'referrals' AND policyname = 'Admin manages referrals'
  ) THEN
    CREATE POLICY "Admin manages referrals" ON public.referrals FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- wallet_transactions
DROP POLICY IF EXISTS "Admin can manage transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Admin can manage wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Clients can view own wallet transactions" ON public.wallet_transactions;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'wallet_transactions' AND policyname = 'Admin manages wallet'
  ) THEN
    CREATE POLICY "Admin manages wallet" ON public.wallet_transactions FOR ALL USING (is_admin(auth.uid()));
  END IF;
END $$;

-- settings
DROP POLICY IF EXISTS "Admin can manage settings" ON public.settings;
DROP POLICY IF EXISTS "Authenticated users can read settings" ON public.settings;
DROP POLICY IF EXISTS "Anyone can view settings" ON public.settings;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'settings' AND policyname = 'Admin manages settings'
  ) THEN
    CREATE POLICY "Admin manages settings" ON public.settings FOR ALL USING (is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'settings' AND policyname = 'Anyone can read settings'
  ) THEN
    CREATE POLICY "Anyone can read settings" ON public.settings FOR SELECT USING (true);
  END IF;
END $$;

-- product_questions (clean up duplicates)
DROP POLICY IF EXISTS "Anyone can view questions" ON public.product_questions;
DROP POLICY IF EXISTS "Admin manages questions" ON public.product_questions;

-- product_deals
DROP POLICY IF EXISTS "Admin can manage deals" ON public.product_deals;

-- product_reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Admin can manage reviews" ON public.product_reviews;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'product_reviews' AND policyname = 'Anyone can view product reviews'
  ) THEN
    CREATE POLICY "Anyone can view product reviews" ON public.product_reviews FOR SELECT USING (true);
  END IF;
END $$;

-- wishlists
DROP POLICY IF EXISTS "Clients can view own wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Clients can insert own wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Clients can delete own wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Admins can view all wishlists" ON public.wishlists;

-- order_reviews
DROP POLICY IF EXISTS "Clients can view own reviews" ON public.order_reviews;
DROP POLICY IF EXISTS "Clients can create review" ON public.order_reviews;
DROP POLICY IF EXISTS "Admin can view all reviews" ON public.order_reviews;
DROP POLICY IF EXISTS "Admin can delete reviews" ON public.order_reviews;
