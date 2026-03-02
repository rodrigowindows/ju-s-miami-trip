-- ═══════════════════════════════════════
-- AjuVaiParaMiami — Complete Database Migration
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
  ('delivered', 'Entregue', 'Gift', E'Olá {nome_cliente}! 🎁 Pedido #{numero_pedido} entregue! Obrigado por usar a AjuVaiParaMiami!')
ON CONFLICT (slug) DO NOTHING;

-- Catalog Products (15 produtos com imagens Unsplash reais)
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  -- Tech
  ('AirPods Pro 2', 'Apple', 'Tech', 249.00, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop', 'AirPods Pro de segunda geracao com cancelamento ativo de ruido e audio espacial.'),
  ('iPhone 15 Pro Max', 'Apple', 'Tech', 1199.00, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', 'iPhone 15 Pro Max 256GB com chip A17 Pro, camera de 48MP e corpo de titanio.'),
  ('MacBook Air M3 15"', 'Apple', 'Tech', 1299.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', 'MacBook Air com chip M3, tela Liquid Retina de 15", 8GB RAM e 256GB SSD.'),
  ('iPad Pro 13" M4', 'Apple', 'Tech', 1099.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', 'iPad Pro com chip M4, tela Ultra Retina XDR OLED de 13". Performance de notebook.'),
  ('PS5 Slim Digital', 'Sony', 'Tech', 449.00, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', 'PlayStation 5 Slim edicao digital. SSD de 1TB, DualSense incluso.'),
  -- Beauty
  ('Perfume Chanel N5', 'Chanel', 'Beauty', 135.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', 'Eau de Parfum 100ml. O perfume mais iconico do mundo.'),
  ('Rare Beauty Soft Pinch Blush', 'Rare Beauty', 'Beauty', 23.00, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Soft Pinch Liquid Blush da Selena Gomez. Ultra-pigmentada.'),
  ('Dyson Airwrap Complete', 'Dyson', 'Beauty', 599.00, 'https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?w=400&h=400&fit=crop', 'Modelador de cabelo Dyson com tecnologia Coanda. 6 acessorios.'),
  ('Sol de Janeiro Bum Bum Cream', 'Sol de Janeiro', 'Beauty', 48.00, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop', 'Creme corporal 240ml com guarana, cupuacu e acai.'),
  -- Fashion
  ('Nike Dunk Low Panda', 'Nike', 'Fashion', 110.00, 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop', 'O classico Nike Dunk Low na colorway preto e branco "Panda".'),
  ('Levi''s 501 Original', 'Levi''s', 'Fashion', 69.50, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 'A calca jeans original desde 1873. Corte reto classico.'),
  ('Ray-Ban Aviator Classic', 'Ray-Ban', 'Fashion', 163.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', 'Oculos de sol aviador classico com armacao dourada e lentes verdes G-15.'),
  -- Lifestyle
  ('Stanley Quencher H2.0', 'Stanley', 'Lifestyle', 45.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop', 'Copo termico 40oz. Gelado por 11h, quente por 7h. Viral no TikTok!'),
  ('Kindle Paperwhite 11th Gen', 'Amazon', 'Lifestyle', 149.99, 'https://images.unsplash.com/photo-1594980596870-8aa52a78571e?w=400&h=400&fit=crop', 'E-reader 6.8", 16GB, a prova d''agua, luz quente ajustavel.'),
  ('Vitaminas Kirkland Combo', 'Kirkland', 'Lifestyle', 35.00, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 'Kit Vitamina D3 5000 IU + Omega-3 Fish Oil 1000mg.'),
  -- Victoria's Secret — Body Mists
  ('Bombshell Body Mist 250ml', 'Victoria''s Secret', 'Beauty', 22.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop', 'Body mist icônico Bombshell 250ml. Fragrância floral frutal com maracujá, peônia e baunilha. O mais vendido da VS!'),
  ('Pure Seduction Body Mist 250ml', 'Victoria''s Secret', 'Beauty', 18.00, 'https://images.unsplash.com/photo-1594035910387-fea081ac23fc?w=400&h=400&fit=crop', 'Body mist Pure Seduction 250ml. Mix irresistível de ameixa vermelha e fresia. Clássico absoluto.'),
  ('Velvet Petals Body Mist 250ml', 'Victoria''s Secret', 'Beauty', 18.00, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop', 'Body mist Velvet Petals 250ml. Lavanda exuberante com praline cremoso. Suave e sofisticado.'),
  ('Love Spell Body Mist 250ml', 'Victoria''s Secret', 'Beauty', 18.00, 'https://images.unsplash.com/photo-1595425964272-fc617fa14e59?w=400&h=400&fit=crop', 'Body mist Love Spell 250ml. Cereja e pêssego com flor de lótus branca. Favorito há décadas.'),
  ('Coconut Passion Body Mist 250ml', 'Victoria''s Secret', 'Beauty', 18.00, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 'Body mist Coconut Passion 250ml. Coco tropical com baunilha quente. Perfeito para o verão.'),
  -- Victoria's Secret — Body Lotions
  ('Bombshell Body Lotion 236ml', 'Victoria''s Secret', 'Beauty', 20.00, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop', 'Hidratante corporal Bombshell 236ml. Fragrância duradoura com peônia e maracujá. Pele macia e perfumada o dia todo.'),
  ('Pure Seduction Body Lotion 236ml', 'Victoria''s Secret', 'Beauty', 18.00, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', 'Hidratante corporal Pure Seduction 236ml. Ameixa vermelha e fresia. Hidratação + perfume que dura.'),
  ('Velvet Petals Body Lotion 236ml', 'Victoria''s Secret', 'Beauty', 18.00, 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop', 'Hidratante corporal Velvet Petals 236ml. Lavanda e praline cremoso. Textura leve e absorção rápida.'),
  -- Victoria's Secret — Perfumes (EDP)
  ('Bombshell Eau de Parfum 100ml', 'Victoria''s Secret', 'Beauty', 75.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', 'Eau de Parfum Bombshell 100ml. O perfume feminino #1 dos EUA. Notas de maracujá roxo, peônia Shangri-la e baunilha.'),
  ('Tease Eau de Parfum 100ml', 'Victoria''s Secret', 'Beauty', 75.00, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop', 'Eau de Parfum Tease 100ml. Gardênia preta, pera e praline torrado. Sensual e sofisticado.'),
  ('Very Sexy Eau de Parfum 100ml', 'Victoria''s Secret', 'Beauty', 75.00, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop', 'Eau de Parfum Very Sexy 100ml. Orquídea, ameixa cravejada e cremoso sândalo. Ousado e marcante.'),
  -- Victoria's Secret — Kits
  ('Kit Bombshell Mist + Lotion', 'Victoria''s Secret', 'Beauty', 35.00, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop', 'Kit presente Bombshell com Body Mist 250ml + Body Lotion 236ml. O combo mais pedido! Fragrância duradoura.'),
  ('Kit Pure Seduction Mist + Lotion', 'Victoria''s Secret', 'Beauty', 30.00, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Kit presente Pure Seduction com Body Mist 250ml + Body Lotion 236ml. Presente perfeito.'),
  -- Victoria's Secret — Lingerie
  ('Kit 5 Calcinhas Sortidas', 'Victoria''s Secret', 'Fashion', 30.00, 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=400&h=400&fit=crop', 'Kit com 5 calcinhas Victoria''s Secret sortidas. Modelos variados (bikini, thong, cheeky). Escolha seu tamanho!'),
  -- Bath & Body Works — Body Mists
  ('A Thousand Wishes Fine Fragrance Mist 236ml', 'Bath & Body Works', 'Beauty', 16.95, 'https://images.unsplash.com/photo-1595425964272-fc617fa14e59?w=400&h=400&fit=crop', 'Fine fragrance mist A Thousand Wishes 236ml. Champagne rosé, framboesa cintilante e pétalas de peônia. O best-seller #1 da BBW!'),
  ('Japanese Cherry Blossom Fine Fragrance Mist 236ml', 'Bath & Body Works', 'Beauty', 16.95, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop', 'Fine fragrance mist Japanese Cherry Blossom 236ml. Flor de cerejeira, pera asiática e sândalo cremoso. Clássico absoluto!'),
  ('Into the Night Fine Fragrance Mist 236ml', 'Bath & Body Works', 'Beauty', 16.95, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop', 'Fine fragrance mist Into the Night 236ml. Framboesa escura, jasmim noturno e âmbar dourado. Elegante e sofisticada.'),
  ('Champagne Toast Fine Fragrance Mist 236ml', 'Bath & Body Works', 'Beauty', 16.95, 'https://images.unsplash.com/photo-1594035910387-fea081ac23fc?w=400&h=400&fit=crop', 'Fine fragrance mist Champagne Toast 236ml. Champagne borbulhante, nectarina e pétalas de rosa. Para celebrar!'),
  ('You''re the One Fine Fragrance Mist 236ml', 'Bath & Body Works', 'Beauty', 16.95, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 'Fine fragrance mist You''re the One 236ml. Íris, bagas de cassis e amêndoas torradas. Sofisticada e moderna.'),
  -- Bath & Body Works — Body Lotions
  ('A Thousand Wishes Body Lotion 236ml', 'Bath & Body Works', 'Beauty', 14.95, 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop', 'Body lotion A Thousand Wishes 236ml. Hidratação rica com manteiga de karité e vitamina E. Fragrância duradoura.'),
  ('Japanese Cherry Blossom Body Lotion 236ml', 'Bath & Body Works', 'Beauty', 14.95, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', 'Body lotion Japanese Cherry Blossom 236ml. Pele macia e perfumada o dia todo.'),
  -- Bath & Body Works — Velas & Casa
  ('Champagne Toast 3-Wick Candle', 'Bath & Body Works', 'Lifestyle', 26.50, 'https://images.unsplash.com/photo-1602607313838-f7c354b17ffa?w=400&h=400&fit=crop', 'Vela 3 pavios Champagne Toast 411g. Champagne borbulhante com tangerina e nectarina. Até 45h de queima.'),
  ('Eucalyptus Spearmint 3-Wick Candle', 'Bath & Body Works', 'Lifestyle', 26.50, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=400&fit=crop', 'Vela 3 pavios Eucalyptus Spearmint (Stress Relief) 411g. Eucalipto e hortelã para relaxar. Aromaterapia BBW.'),
  ('Wallflowers Fragrance Refill 2-Pack', 'Bath & Body Works', 'Lifestyle', 13.50, 'https://images.unsplash.com/photo-1599458252573-56ae36120de1?w=400&h=400&fit=crop', 'Kit 2 refis Wallflowers para aromatizador de tomada. Diversas fragrâncias disponíveis. Dura até 30 dias cada.'),
  -- Nike — Tênis
  ('Nike Air Force 1 ''07', 'Nike', 'Fashion', 115.00, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop', 'O clássico Nike Air Force 1 branco. O tênis mais icônico do streetwear. Couro premium, sola Air.'),
  ('Nike Air Max 90', 'Nike', 'Fashion', 130.00, 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop', 'Nike Air Max 90 com a icônica bolha de ar visível. Design de 1990 que nunca sai de moda.'),
  ('Nike Cortez', 'Nike', 'Fashion', 90.00, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop', 'Nike Cortez clássico. O primeiro tênis de corrida da Nike (1972). Design vintage, conforto moderno.'),
  ('Nike Air Jordan 1 Mid', 'Nike', 'Fashion', 125.00, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop', 'Air Jordan 1 Mid. O tênis que mudou a cultura sneaker. Cano médio, couro premium, estilo lendário.'),
  -- Stanley
  ('Stanley IceFlow Flip Straw 30oz', 'Stanley', 'Lifestyle', 35.00, 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&h=400&fit=crop', 'Copo térmico Stanley IceFlow 30oz (887ml). Canudo flip, gelado por 12h. Design slim que cabe no porta-copos.'),
  ('Stanley Classic Trigger-Action 20oz', 'Stanley', 'Lifestyle', 25.00, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop', 'Caneca térmica Stanley Classic 20oz (591ml). Um botão para abrir e beber. Quente por 7h, gelado por 10h.'),
  -- CeraVe / La Roche-Posay / Skincare
  ('CeraVe Moisturizing Cream 539g', 'CeraVe', 'Beauty', 18.00, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 'Creme hidratante CeraVe 539g (tamanho família!). Com 3 ceramidas essenciais e ácido hialurônico. Indicado por dermatologistas.'),
  ('CeraVe Foaming Facial Cleanser 473ml', 'CeraVe', 'Beauty', 16.00, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', 'Gel de limpeza facial CeraVe 473ml. Para pele normal a oleosa. Com niacinamida e ceramidas. Sem fragrância.'),
  ('CeraVe Hydrating Facial Cleanser 473ml', 'CeraVe', 'Beauty', 16.00, 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop', 'Gel de limpeza hidratante CeraVe 473ml. Para pele normal a seca. Com ácido hialurônico e ceramidas.'),
  ('La Roche-Posay Anthelios Melt-In Milk SPF 60', 'La Roche-Posay', 'Beauty', 36.00, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 'Protetor solar corporal La Roche-Posay SPF 60. Textura leve que derrete na pele. Resistente à água por 80min.'),
  ('La Roche-Posay Effaclar Duo+ SPF 30', 'La Roche-Posay', 'Beauty', 32.00, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop', 'Tratamento anti-acne La Roche-Posay com SPF 30. Niacinamida + ácido salicílico. Controle de oleosidade.'),
  ('The Ordinary Niacinamide 10% + Zinc 1% 30ml', 'The Ordinary', 'Beauty', 6.50, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', 'Sérum The Ordinary com 10% Niacinamida e 1% Zinco. Reduz poros e oleosidade. O skincare mais viral do momento!'),
  ('Neutrogena Hydro Boost Gel-Cream SPF 25', 'Neutrogena', 'Beauty', 22.00, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 'Hidratante facial Neutrogena Hydro Boost com SPF 25. Ácido hialurônico para hidratação intensa. Não oleoso.'),
  -- Tech extras
  ('JBL Flip 6 Bluetooth Speaker', 'JBL', 'Tech', 130.00, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', 'Caixa de som portátil JBL Flip 6. À prova d''água IP67. 12h de bateria. Som potente com PartyBoost.'),
  ('Apple AirTag (4-Pack)', 'Apple', 'Tech', 99.00, 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=400&h=400&fit=crop', 'Kit 4 rastreadores Apple AirTag. Encontre chaves, carteira, mala. Precisão com chip U1 e rede Find My.'),
  ('Apple Watch SE 2nd Gen 44mm', 'Apple', 'Tech', 279.00, 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop', 'Apple Watch SE 44mm com chip S8. Monitoramento cardíaco, GPS, detecção de queda. O melhor custo-benefício.'),
  ('Nintendo Switch OLED', 'Nintendo', 'Tech', 349.00, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop', 'Nintendo Switch OLED com tela de 7" vibrante. Dock com porta Ethernet. 64GB de armazenamento interno.'),
  -- Fashion extras
  ('Tommy Hilfiger Classic Polo', 'Tommy Hilfiger', 'Fashion', 50.00, 'https://images.unsplash.com/photo-1625910513413-5fc42c18b0f3?w=400&h=400&fit=crop', 'Polo clássica Tommy Hilfiger. Algodão premium com logo bordado. O básico americano que nunca sai de moda.'),
  ('Calvin Klein Kit 3 Cuecas Boxer', 'Calvin Klein', 'Fashion', 42.00, 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=400&h=400&fit=crop', 'Kit 3 cuecas boxer Calvin Klein em algodão stretch. Elástico com logo icônico. Conforto premium.'),
  ('Under Armour Tech 2.0 T-Shirt', 'Under Armour', 'Fashion', 25.00, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop', 'Camiseta esportiva Under Armour Tech 2.0. Tecido anti-odor, secagem ultra-rápida. Ideal para treino.'),
  ('Adidas Ultraboost Light', 'Adidas', 'Fashion', 190.00, 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400&h=400&fit=crop', 'Adidas Ultraboost Light. O tênis de corrida mais leve da linha Ultra. Boost renovado + Continental™ outsole.'),
  -- Lifestyle extras
  ('Hydro Flask 32oz Wide Mouth', 'Hydro Flask', 'Lifestyle', 45.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop', 'Garrafa térmica Hydro Flask 32oz (946ml). TempShield™ mantém gelado 24h e quente 12h. Boca larga.'),
  ('Yeti Rambler 26oz Bottle', 'Yeti', 'Lifestyle', 40.00, 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&h=400&fit=crop', 'Garrafa térmica Yeti Rambler 26oz (769ml). Aço inoxidável 18/8. Praticamente indestrutível. Tampa TripleHaul™.')
ON CONFLICT DO NOTHING;

-- Promotions (4 cupons ativos)
INSERT INTO promotions (name, coupon_code, discount_type, discount_value, min_order_value, starts_at, expires_at, max_uses, active) VALUES
  ('Primeira Compra', 'WELCOME10', 'percent', 10, 500, now(), now() + interval '90 days', 100, true),
  ('Frete Miami', 'MIAMI15', 'percent', 15, 2000, now(), now() + interval '60 days', 50, true),
  ('Desconto Tech', 'TECH50', 'fixed', 50, 1000, now(), now() + interval '45 days', 30, true),
  ('Indicou Ganhou', 'AMIGO20', 'percent', 20, 800, now(), now() + interval '120 days', 200, true)
ON CONFLICT (coupon_code) DO NOTHING;
