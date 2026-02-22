-- ═══════════════════════════════════════
-- MalaBridge — Complete Database Migration
-- ═══════════════════════════════════════

-- 1. PROFILES (extends Supabase auth.users)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text NOT NULL DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_balance numeric NOT NULL DEFAULT 0;

-- 2. CATALOG PRODUCTS
CREATE TABLE IF NOT EXISTS catalog_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Outros',
  price_usd numeric NOT NULL,
  image_url text NOT NULL DEFAULT '',
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. TRIPS
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  traveler_name text NOT NULL,
  flight_number text NOT NULL DEFAULT '',
  departure_date date NOT NULL,
  arrival_date date NOT NULL,
  max_weight_kg numeric NOT NULL DEFAULT 23,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  client_id uuid REFERENCES profiles(id) NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  customer_phone text,
  status text NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','orcamento','aprovado','comprando','comprado','em_transito','chegou_brasil','entregue','cancelado')),
  items text NOT NULL DEFAULT '',
  total_usd numeric NOT NULL DEFAULT 0,
  total_brl numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  deposit_amount numeric NOT NULL DEFAULT 0,
  deposit_paid boolean NOT NULL DEFAULT false,
  trip_id uuid REFERENCES trips(id),
  estimated_weight_kg numeric NOT NULL DEFAULT 0.5,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_name text NOT NULL,
  store text,
  product_url text,
  product_image_url text,
  price_usd numeric NOT NULL DEFAULT 0,
  price_brl numeric NOT NULL DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. ORDER EVENTS (timeline)
CREATE TABLE IF NOT EXISTS order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL DEFAULT 'status_change',
  status text,
  title text NOT NULL,
  description text,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('deposit', 'balance', 'refund')),
  amount numeric NOT NULL,
  receipt_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. PROMOTIONS
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  coupon_code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value numeric NOT NULL,
  min_order_value numeric,
  starts_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  max_uses int,
  current_uses int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. REFERRALS
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) NOT NULL,
  referred_id uuid REFERENCES profiles(id) NOT NULL,
  referral_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  credit_amount numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 10. WALLET TRANSACTIONS
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('referral_credit', 'order_debit', 'admin_adjust', 'refund')),
  amount numeric NOT NULL,
  description text NOT NULL,
  order_id uuid REFERENCES orders(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 11. SETTINGS (key-value)
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 12. WHATSAPP TEMPLATES
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  icon text NOT NULL DEFAULT 'MessageSquare',
  template_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════

ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- catalog_products
CREATE POLICY "Anyone can view active products" ON catalog_products FOR SELECT USING (active = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage products" ON catalog_products FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- orders
CREATE POLICY "Client sees own orders" ON orders FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Client creates own orders" ON orders FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Admin manages all orders" ON orders FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- order_items
CREATE POLICY "Client sees own order items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid()));
CREATE POLICY "Client creates own order items" ON order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid()));
CREATE POLICY "Admin manages all order items" ON order_items FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- order_events
CREATE POLICY "Client sees own order events" ON order_events FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_events.order_id AND orders.client_id = auth.uid()));
CREATE POLICY "Admin manages all order events" ON order_events FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- payments
CREATE POLICY "Client sees own payments" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.client_id = auth.uid()));
CREATE POLICY "Admin manages all payments" ON payments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- trips
CREATE POLICY "Admin manages trips" ON trips FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Authenticated users view trips" ON trips FOR SELECT USING (auth.uid() IS NOT NULL);

-- promotions
CREATE POLICY "Anyone can view active promotions" ON promotions FOR SELECT USING (true);
CREATE POLICY "Admins manage promotions" ON promotions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- referrals
CREATE POLICY "Users see own referrals" ON referrals FOR SELECT USING (referrer_id = auth.uid() OR referred_id = auth.uid());
CREATE POLICY "Admin sees all referrals" ON referrals FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- wallet_transactions
CREATE POLICY "Client sees own wallet" ON wallet_transactions FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admin manages wallet" ON wallet_transactions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- settings
CREATE POLICY "Anyone can view settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin manages settings" ON settings FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- whatsapp_templates
CREATE POLICY "Anyone can view templates" ON whatsapp_templates FOR SELECT USING (true);
CREATE POLICY "Admin manages templates" ON whatsapp_templates FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ═══════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════

-- Settings
INSERT INTO settings (key, value) VALUES
  ('exchange_rate', '5.70'),
  ('spread_percent', '3'),
  ('whatsapp_number', '5561999999999'),
  ('referral_credit', '30')
ON CONFLICT (key) DO NOTHING;

-- WhatsApp Templates
INSERT INTO whatsapp_templates (slug, title, icon, template_text) VALUES
  ('welcome', 'Boas-vindas', 'HandHeart', E'Olá {nome_cliente}! 🎉 Seu pedido #{numero_pedido} foi recebido. Em breve enviaremos o orçamento!'),
  ('budget', 'Orçamento', 'Receipt', E'Olá {nome_cliente}! 📋 Orçamento do pedido #{numero_pedido}:\n\nItens: {itens}\nTotal: R$ {valor_total}\nSinal (50%%): R$ {valor_sinal}\n\nDeseja aprovar?'),
  ('approved', 'Pedido Aprovado', 'CheckCircle', E'Olá {nome_cliente}! ✅ Pedido #{numero_pedido} aprovado! Vamos comprar: {itens}'),
  ('bought', 'Itens Comprados', 'ShoppingBag', E'Olá {nome_cliente}! 🛍️ Itens do pedido #{numero_pedido} comprados! Viagem: {codigo_viagem}'),
  ('arrived', 'Chegou no Brasil', 'Plane', E'Olá {nome_cliente}! ✈️ Pedido #{numero_pedido} chegou ao Brasil! Vamos agendar a entrega.'),
  ('delivered', 'Entregue', 'Gift', E'Olá {nome_cliente}! 🎁 Pedido #{numero_pedido} entregue! Obrigado por usar a MalaBridge!')
ON CONFLICT (slug) DO NOTHING;

-- Catalog Products
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('AirPods Pro 2', 'Apple', 'Tech', 249.00, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400', 'Cancelamento de ruído ativo'),
  ('iPhone 15 Pro Max 256GB', 'Apple', 'Tech', 1199.00, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 'Chip A17 Pro, câmera 48MP'),
  ('Stanley Quencher 40oz', 'Stanley', 'Lifestyle', 45.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 'Copo térmico 40oz'),
  ('Perfume Good Girl', 'Carolina Herrera', 'Beauty', 95.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 'EDP 80ml'),
  ('Nike Air Max 90', 'Nike', 'Fashion', 130.00, 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400', 'Tênis icônico'),
  ('MacBook Air M3', 'Apple', 'Tech', 1099.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'Chip M3, 8GB RAM')
ON CONFLICT DO NOTHING;
