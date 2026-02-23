
-- Create security definer function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- Drop existing profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admin sees all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Recreate profiles policies without recursion
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admin sees all profiles" ON profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Admin manages profiles" ON profiles
  FOR ALL USING (public.is_admin(auth.uid()));

-- Also fix other tables that reference profiles for admin check
-- Drop and recreate policies using the new function

-- catalog_products
DROP POLICY IF EXISTS "Anyone can view active products" ON catalog_products;
DROP POLICY IF EXISTS "Admins manage products" ON catalog_products;
CREATE POLICY "Anyone can view active products" ON catalog_products FOR SELECT USING (active = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage products" ON catalog_products FOR ALL USING (public.is_admin(auth.uid()));

-- orders
DROP POLICY IF EXISTS "Admin manages all orders" ON orders;
CREATE POLICY "Admin manages all orders" ON orders FOR ALL USING (public.is_admin(auth.uid()));

-- order_items
DROP POLICY IF EXISTS "Admin manages all order items" ON order_items;
CREATE POLICY "Admin manages all order items" ON order_items FOR ALL USING (public.is_admin(auth.uid()));

-- order_events
DROP POLICY IF EXISTS "Admin manages all order events" ON order_events;
CREATE POLICY "Admin manages all order events" ON order_events FOR ALL USING (public.is_admin(auth.uid()));

-- payments
DROP POLICY IF EXISTS "Admin manages all payments" ON payments;
CREATE POLICY "Admin manages all payments" ON payments FOR ALL USING (public.is_admin(auth.uid()));

-- trips
DROP POLICY IF EXISTS "Admin manages trips" ON trips;
CREATE POLICY "Admin manages trips" ON trips FOR ALL USING (public.is_admin(auth.uid()));

-- promotions
DROP POLICY IF EXISTS "Admins manage promotions" ON promotions;
CREATE POLICY "Admins manage promotions" ON promotions FOR ALL USING (public.is_admin(auth.uid()));

-- referrals
DROP POLICY IF EXISTS "Admin sees all referrals" ON referrals;
CREATE POLICY "Admin sees all referrals" ON referrals FOR ALL USING (public.is_admin(auth.uid()));

-- wallet_transactions
DROP POLICY IF EXISTS "Admin manages wallet" ON wallet_transactions;
CREATE POLICY "Admin manages wallet" ON wallet_transactions FOR ALL USING (public.is_admin(auth.uid()));

-- settings
DROP POLICY IF EXISTS "Admin manages settings" ON settings;
CREATE POLICY "Admin manages settings" ON settings FOR ALL USING (public.is_admin(auth.uid()));

-- whatsapp_templates
DROP POLICY IF EXISTS "Admin manages templates" ON whatsapp_templates;
CREATE POLICY "Admin manages templates" ON whatsapp_templates FOR ALL USING (public.is_admin(auth.uid()));
