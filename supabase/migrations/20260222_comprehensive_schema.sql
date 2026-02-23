-- ============================================
-- MalaBridge Comprehensive Schema
-- This migration creates all tables, RLS policies,
-- triggers, and seed data for the full app.
-- ============================================

-- ============================================
-- 1. PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  address text,
  role text NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
  referral_code text UNIQUE,
  wallet_balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add columns if they don't exist (for existing DBs)
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address text;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_balance numeric NOT NULL DEFAULT 0;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
CREATE POLICY "Admin can read all profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
CREATE POLICY "Admin can update all profiles" ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin can insert profiles" ON profiles;
CREATE POLICY "Admin can insert profiles" ON profiles FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Auto-generate referral code trigger
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS trigger AS $$
DECLARE
  name_part text;
  code text;
BEGIN
  IF NEW.role = 'cliente' AND (NEW.referral_code IS NULL OR NEW.referral_code = '') THEN
    name_part := UPPER(SPLIT_PART(COALESCE(NEW.full_name, NEW.email), ' ', 1));
    name_part := LEFT(name_part, 4);
    code := name_part || '-MALA-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
    NEW.referral_code := code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_referral_code ON profiles;
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION generate_referral_code();

-- ============================================
-- 2. SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER TABLE settings ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read settings" ON settings;
CREATE POLICY "Authenticated users can read settings" ON settings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage settings" ON settings;
CREATE POLICY "Admin can manage settings" ON settings FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seed settings
INSERT INTO settings (key, value) VALUES
  ('exchange_rate_usd_brl', '6.05'),
  ('spread_percentage', '8'),
  ('whatsapp_phone', '5561999999999'),
  ('prohibited_items', 'Armas
Drogas
Medicamentos controlados
Alimentos perecíveis
Animais vivos')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 3. CATALOG PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS catalog_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  price_usd numeric NOT NULL,
  image_url text NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view active catalog products" ON catalog_products;
CREATE POLICY "Authenticated users can view active catalog products" ON catalog_products FOR SELECT
  TO authenticated USING (active = true);

DROP POLICY IF EXISTS "Admin can manage catalog products" ON catalog_products;
CREATE POLICY "Admin can manage catalog products" ON catalog_products FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seed catalog products (real Unsplash images)
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('AirPods Pro 2', 'Apple', 'Tech', 249.00, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop', 'AirPods Pro de segunda geração com cancelamento ativo de ruído, modo Transparência adaptativo e áudio personalizado espacial.'),
  ('Nike Dunk Low Panda', 'Nike', 'Fashion', 110.00, 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop', 'O clássico Nike Dunk Low na icônica colorway preto e branco "Panda". Couro premium, sola vulcanizada.'),
  ('Perfume Chanel Nº5', 'Chanel', 'Beauty', 135.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', 'Eau de Parfum 100ml. O perfume mais icônico do mundo, com notas de ylang-ylang, rosa e sândalo.'),
  ('iPhone 15 Pro Max', 'Apple', 'Tech', 1199.00, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', 'iPhone 15 Pro Max 256GB com chip A17 Pro, câmera de 48MP e corpo de titânio.'),
  ('Stanley Quencher H2.0', 'Stanley', 'Lifestyle', 45.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop', 'Copo térmico Quencher H2.0 de 40oz. Mantém bebidas geladas por 11h e quentes por 7h.'),
  ('Rare Beauty Soft Pinch Blush', 'Rare Beauty', 'Beauty', 23.00, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Soft Pinch Liquid Blush da marca da Selena Gomez. Fórmula leve e ultra-pigmentada que dura o dia todo.')
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. TRIPS
-- ============================================
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  traveler_name text NOT NULL,
  flight_number text NOT NULL,
  departure_date date NOT NULL,
  arrival_date date NOT NULL,
  max_weight_kg numeric NOT NULL DEFAULT 23,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage trips" ON trips;
CREATE POLICY "Admin can manage trips" ON trips FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Clients can view trips" ON trips;
CREATE POLICY "Clients can view trips" ON trips FOR SELECT TO authenticated USING (true);

-- Seed trips
INSERT INTO trips (code, traveler_name, flight_number, departure_date, arrival_date, max_weight_kg) VALUES
  ('T-044', 'Juliana Santos', 'AA2198', '2026-03-15', '2026-03-22', 23),
  ('T-045', 'Rodrigo Lima', 'UA1523', '2026-04-01', '2026-04-08', 32),
  ('T-046', 'Carolina Mendes', 'DL482', '2026-04-20', '2026-04-27', 23)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 5. ORDERS
-- ============================================
-- Drop the old orders table if it has the old schema (customer_name column)
-- and recreate with the new schema
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'customer_name'
  ) THEN
    -- Old schema exists, we need to migrate
    -- First check if there are any payments/whatsapp_templates referencing orders
    DROP TABLE IF EXISTS payments CASCADE;
    DROP TABLE IF EXISTS order_items CASCADE;
    DROP TABLE IF EXISTS order_events CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL DEFAULT '',
  client_id uuid NOT NULL REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'novo' CHECK (status IN (
    'novo', 'orcamento', 'aprovado', 'comprando', 'comprado',
    'em_transito', 'chegou_brasil', 'entregue', 'cancelado'
  )),
  items text,
  total_brl numeric,
  total_usd numeric,
  deposit_paid numeric NOT NULL DEFAULT 0,
  trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
  estimated_weight_kg numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add columns if they don't exist
DO $$ BEGIN
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS items text;
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS deposit_paid numeric NOT NULL DEFAULT 0;
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS trip_id uuid REFERENCES trips(id) ON DELETE SET NULL;
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_weight_kg numeric;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own orders" ON orders;
CREATE POLICY "Clients can view own orders" ON orders FOR SELECT USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients can insert own orders" ON orders;
CREATE POLICY "Clients can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admin can manage all orders" ON orders;
CREATE POLICY "Admin can manage all orders" ON orders FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS trigger AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS integer)), 0) + 1
  INTO next_num
  FROM orders
  WHERE order_number LIKE '#MB-%';
  NEW.order_number := '#MB-' || LPAD(next_num::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON orders;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 6. ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  product_url text,
  product_image_url text,
  price_usd numeric,
  price_brl numeric,
  quantity integer NOT NULL DEFAULT 1,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own order items" ON order_items;
CREATE POLICY "Clients can view own order items" ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid()));

DROP POLICY IF EXISTS "Clients can insert own order items" ON order_items;
CREATE POLICY "Clients can insert own order items" ON order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid()));

DROP POLICY IF EXISTS "Admin can manage all order items" ON order_items;
CREATE POLICY "Admin can manage all order items" ON order_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 7. ORDER EVENTS (Timeline)
-- ============================================
CREATE TABLE IF NOT EXISTS order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  title text NOT NULL,
  description text,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add photo_url if it doesn't exist
DO $$ BEGIN
  ALTER TABLE order_events ADD COLUMN IF NOT EXISTS photo_url text;
  -- Rename 'status' to 'event_type' if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_events' AND column_name = 'status'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_events' AND column_name = 'event_type'
  ) THEN
    ALTER TABLE order_events RENAME COLUMN status TO event_type;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own order events" ON order_events;
CREATE POLICY "Clients can view own order events" ON order_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_events.order_id AND orders.client_id = auth.uid()));

DROP POLICY IF EXISTS "Clients can insert own order events" ON order_events;
CREATE POLICY "Clients can insert own order events" ON order_events FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_events.order_id AND orders.client_id = auth.uid()));

DROP POLICY IF EXISTS "Admin can manage all order events" ON order_events;
CREATE POLICY "Admin can manage all order events" ON order_events FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 8. PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'balance', 'refund')),
  amount numeric NOT NULL,
  receipt_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own payments" ON payments;
CREATE POLICY "Clients can view own payments" ON payments FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.client_id = auth.uid()));

DROP POLICY IF EXISTS "Admin can manage all payments" ON payments;
CREATE POLICY "Admin can manage all payments" ON payments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 9. PROMOTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  coupon_code text UNIQUE NOT NULL,
  discount_type text NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
  discount_value numeric NOT NULL,
  min_order_value numeric,
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  max_uses integer,
  current_uses integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view active promotions" ON promotions;
CREATE POLICY "Clients can view active promotions" ON promotions FOR SELECT
  TO authenticated USING (active = true);

DROP POLICY IF EXISTS "Admin can manage promotions" ON promotions;
CREATE POLICY "Admin can manage promotions" ON promotions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 10. REFERRALS
-- ============================================
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id),
  referred_id uuid NOT NULL REFERENCES auth.users(id),
  referral_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  credit_amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own referrals" ON referrals;
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

DROP POLICY IF EXISTS "Admin can manage referrals" ON referrals;
CREATE POLICY "Admin can manage referrals" ON referrals FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 11. WALLET TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id),
  type text NOT NULL CHECK (type IN ('credit', 'debit', 'referral_bonus')),
  amount numeric NOT NULL,
  description text,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own wallet transactions" ON wallet_transactions;
CREATE POLICY "Clients can view own wallet transactions" ON wallet_transactions FOR SELECT
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admin can manage wallet transactions" ON wallet_transactions;
CREATE POLICY "Admin can manage wallet transactions" ON wallet_transactions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 12. WHATSAPP TEMPLATES
-- ============================================
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  icon text NOT NULL,
  template_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can view templates" ON whatsapp_templates;
CREATE POLICY "Authenticated can view templates" ON whatsapp_templates FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage templates" ON whatsapp_templates;
CREATE POLICY "Admin can manage templates" ON whatsapp_templates FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seed 6 WhatsApp templates
INSERT INTO whatsapp_templates (slug, title, icon, template_text) VALUES
  ('orcamento', 'Orçamento', '💰', 'Olá {nome_cliente}! 🎉

Aqui está o orçamento do seu pedido {numero_pedido}:

📦 Itens: {itens}
💵 Valor total: R$ {valor_total}
💳 Sinal (50%): R$ {valor_sinal}

Para confirmar, basta realizar o PIX do sinal e enviar o comprovante aqui!'),
  ('confirmacao', 'Confirmação de Compra', '✅', 'Oi {nome_cliente}! ✅

Seu pedido {numero_pedido} foi confirmado! Já vamos iniciar a compra dos itens:

📦 {itens}

Previsão de chegada ao Brasil: 10-15 dias úteis.
Fique tranquilo(a), vou te manter atualizado(a)! 🛒'),
  ('comprado', 'Produto Comprado', '🛍️', 'Oi {nome_cliente}! 🛍️

Ótima notícia! Já comprei seus itens do pedido {numero_pedido}:

📦 {itens}

Agora é só aguardar o embarque na viagem {codigo_viagem}! ✈️'),
  ('em_transito', 'Em Trânsito', '✈️', 'Oi {nome_cliente}! ✈️

Seu pedido {numero_pedido} está a caminho do Brasil!

🧳 Viagem: {codigo_viagem}
📦 Itens: {itens}

Te aviso assim que chegar! 🇧🇷'),
  ('chegou', 'Chegou ao Brasil', '🇧🇷', 'Oi {nome_cliente}! 🇧🇷🎉

Seu pedido {numero_pedido} CHEGOU ao Brasil!

📦 {itens}
💰 Saldo restante: R$ {valor_total}

Vamos agendar a entrega? Me diz o melhor dia e horário pra você! 🚗'),
  ('entrega', 'Entrega Agendada', '🚗', 'Oi {nome_cliente}! 🚗

Entrega do pedido {numero_pedido} confirmada!

📦 Itens: {itens}

Nos vemos em breve! Qualquer dúvida é só chamar. 😊')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 13. STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-attachments', 'order-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Clients can upload own attachments" ON storage.objects;
  CREATE POLICY "Clients can upload own attachments" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'order-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Clients can view own attachments" ON storage.objects;
  CREATE POLICY "Clients can view own attachments" ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'order-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admin can view all attachments" ON storage.objects;
  CREATE POLICY "Admin can view all attachments" ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'order-attachments' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================
-- 14. SEED: Create auth users and profiles
-- (Run this manually in Supabase Dashboard SQL Editor
--  since auth.users INSERT requires service_role key)
-- ============================================
-- To create seed users, run in Supabase Dashboard:
--
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
-- VALUES
--   ('00000000-0000-0000-0000-000000000001', 'admin@malabridge.com',
--    crypt('admin123', gen_salt('bf')), now(), '{"full_name":"Admin MalaBridge"}'),
--   ('00000000-0000-0000-0000-000000000002', 'cliente@malabridge.com',
--    crypt('cliente123', gen_salt('bf')), now(), '{"full_name":"Ana Carolina Silva"}');
--
-- INSERT INTO profiles (id, email, full_name, phone, address, role) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'admin@malabridge.com', 'Admin MalaBridge', '+5561999999999', null, 'admin'),
--   ('00000000-0000-0000-0000-000000000002', 'cliente@malabridge.com', 'Ana Carolina Silva', '+5561999887766', 'Asa Sul, Brasília-DF', 'cliente');
