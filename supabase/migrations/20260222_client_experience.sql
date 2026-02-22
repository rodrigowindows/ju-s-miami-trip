-- ============================================
-- Profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Settings table
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage settings"
  ON settings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Seed settings: exchange rate and spread
INSERT INTO settings (key, value) VALUES
  ('exchange_rate_usd_brl', '6.05'),
  ('spread_percentage', '8')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- Catalog products table
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

CREATE POLICY "Authenticated users can view active catalog products"
  ON catalog_products FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admin can manage catalog products"
  ON catalog_products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Seed catalog products
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  (
    'AirPods Pro 2',
    'Apple',
    'Tech',
    249.00,
    'https://placehold.co/400x400/f0f0f0/333?text=AirPods+Pro+2',
    'AirPods Pro de segunda geração com cancelamento ativo de ruído, modo Transparência adaptativo e áudio personalizado espacial.'
  ),
  (
    'Nike Dunk Low Panda',
    'Nike',
    'Fashion',
    110.00,
    'https://placehold.co/400x400/f0f0f0/333?text=Nike+Dunk+Low',
    'O clássico Nike Dunk Low na icônica colorway preto e branco "Panda". Couro premium, sola vulcanizada.'
  ),
  (
    'Perfume Chanel Nº5',
    'Chanel',
    'Beauty',
    135.00,
    'https://placehold.co/400x400/f0f0f0/333?text=Chanel+N5',
    'Eau de Parfum 100ml. O perfume mais icônico do mundo, com notas de ylang-ylang, rosa e sândalo.'
  ),
  (
    'iPhone 15 Pro Case',
    'Apple',
    'Tech',
    49.00,
    'https://placehold.co/400x400/f0f0f0/333?text=iPhone+Case',
    'Case de silicone com MagSafe para iPhone 15 Pro. Proteção premium com toque aveludado.'
  ),
  (
    'Stanley Cup Tumbler',
    'Stanley',
    'Fashion',
    45.00,
    'https://placehold.co/400x400/f0f0f0/333?text=Stanley+Cup',
    'Copo térmico Quencher H2.0 de 40oz. Mantém bebidas geladas por 11h e quentes por 7h.'
  ),
  (
    'Rare Beauty Blush',
    'Rare Beauty',
    'Beauty',
    23.00,
    'https://placehold.co/400x400/f0f0f0/333?text=Rare+Beauty',
    'Soft Pinch Liquid Blush da marca da Selena Gomez. Fórmula leve e ultra-pigmentada que dura o dia todo.'
  );

-- ============================================
-- Orders table
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  client_id uuid NOT NULL REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'novo' CHECK (status IN (
    'novo', 'orcamento', 'aprovado', 'comprando', 'comprado',
    'em_transito', 'chegou_brasil', 'entregue', 'cancelado'
  )),
  total_brl numeric,
  total_usd numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Clients can only see their own orders
CREATE POLICY "Clients can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admin can manage all orders"
  ON orders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS trigger AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS integer)), 0) + 1
  INTO next_num
  FROM orders;
  NEW.order_number := '#MB-' || LPAD(next_num::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Order items table
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

CREATE POLICY "Clients can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid())
  );

CREATE POLICY "Clients can insert own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid())
  );

CREATE POLICY "Admin can manage all order items"
  ON order_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Order events table (timeline)
-- ============================================
CREATE TABLE IF NOT EXISTS order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own order events"
  ON order_events FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_events.order_id AND orders.client_id = auth.uid())
  );

CREATE POLICY "Admin can manage all order events"
  ON order_events FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Storage bucket for order screenshots
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-attachments', 'order-attachments', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Clients can upload own attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'order-attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Clients can view own attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'order-attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admin can view all attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'order-attachments' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
