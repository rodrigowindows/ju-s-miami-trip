-- Remove DUPLICATE RLS policies (keep is_admin versions)
DROP POLICY IF EXISTS "Admin manage catalog" ON public.catalog_products;
DROP POLICY IF EXISTS "Anyone can view active catalog products" ON public.catalog_products;
DROP POLICY IF EXISTS "Admin full access on orders" ON public.orders;
DROP POLICY IF EXISTS "Admin full access on order_events" ON public.order_events;
DROP POLICY IF EXISTS "Admin full access on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Admin full access on payments" ON public.payments;
DROP POLICY IF EXISTS "Admin manage settings" ON public.settings;
DROP POLICY IF EXISTS "Admin manage promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admin manage referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admin manage wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Admin full access on trips" ON public.trips;
DROP POLICY IF EXISTS "Admin full access on whatsapp_templates" ON public.whatsapp_templates;

-- Fix product_questions: require authentication for INSERT
DROP POLICY IF EXISTS "Anyone can ask questions" ON public.product_questions;
CREATE POLICY "Authenticated users can ask questions"
  ON public.product_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add missing INSERT policy for wallet_transactions (client checkout)
CREATE POLICY "Clients insert own wallet transactions"
  ON public.wallet_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);