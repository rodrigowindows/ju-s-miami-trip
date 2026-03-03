-- ============================================================
-- AjuVaiParaMiami - Fix RLS + Seed Catalog Products + Promotions
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- ============================================================
-- 1. FIX: RLS Infinite Recursion on profiles
-- Create a SECURITY DEFINER function to check admin status
-- without triggering RLS on profiles table
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Drop old recursive policies on profiles
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON public.profiles;

-- Recreate profiles policies using is_admin()
CREATE POLICY "Admin can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_admin());

-- Fix admin policies on other tables that reference profiles
DROP POLICY IF EXISTS "Admin can manage trips" ON public.trips;
CREATE POLICY "Admin can manage trips"
  ON public.trips FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can manage all orders" ON public.orders;
CREATE POLICY "Admin can manage all orders"
  ON public.orders FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Admin can manage all order items" ON public.order_items;
CREATE POLICY "Admin can manage all order items"
  ON public.order_items FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on order_events" ON public.order_events;
DROP POLICY IF EXISTS "Admin can manage all order events" ON public.order_events;
CREATE POLICY "Admin can manage all order events"
  ON public.order_events FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can manage all payments" ON public.payments;
CREATE POLICY "Admin can manage all payments"
  ON public.payments FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can manage templates" ON public.whatsapp_templates;
CREATE POLICY "Admin can manage templates"
  ON public.whatsapp_templates FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage catalog" ON public.catalog_products;
DROP POLICY IF EXISTS "Admin can manage catalog" ON public.catalog_products;
CREATE POLICY "Admin can manage catalog"
  ON public.catalog_products FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can manage settings" ON public.settings;
CREATE POLICY "Admin can manage settings"
  ON public.settings FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can manage promotions" ON public.promotions;
CREATE POLICY "Admin can manage promotions"
  ON public.promotions FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can manage referrals" ON public.referrals;
CREATE POLICY "Admin can manage referrals"
  ON public.referrals FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can manage transactions" ON public.wallet_transactions;
CREATE POLICY "Admin can manage transactions"
  ON public.wallet_transactions FOR ALL
  USING (public.is_admin());

-- ============================================================
-- 2. ENSURE catalog_products SELECT policy allows public read
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view active catalog products" ON public.catalog_products;
DROP POLICY IF EXISTS "Authenticated can view active catalog" ON public.catalog_products;
CREATE POLICY "Anyone can view active catalog products"
  ON public.catalog_products FOR SELECT
  USING (active = true);

-- ============================================================
-- 3. CLEAR existing placeholder products
-- ============================================================
DELETE FROM public.catalog_products WHERE image_url LIKE '%placehold%' OR image_url = '';

-- ============================================================
-- 4. SEED: Catalog Products with real images
-- ============================================================

-- ===== TECH =====
INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
(
  'AirPods Pro 2',
  'Apple',
  'Tech',
  249.00,
  'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop',
  'AirPods Pro de segunda geracao com cancelamento ativo de ruido, modo Transparencia adaptativo e audio personalizado espacial. Chip H2 da Apple.',
  true
),
(
  'iPhone 16 Pro Max 256GB',
  'Apple',
  'Tech',
  1199.00,
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
  'O iPhone mais avancado com chip A18 Pro, camera de 48MP com zoom optico 5x, tela Super Retina XDR de 6.9" e botao de Acao.',
  true
),
(
  'MacBook Air M3 15"',
  'Apple',
  'Tech',
  1299.00,
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
  'MacBook Air com chip M3, tela Liquid Retina de 15.3", 8GB RAM, 256GB SSD. Fino, leve e com bateria de ate 18 horas.',
  true
),
(
  'iPad Pro 13" M4',
  'Apple',
  'Tech',
  1099.00,
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
  'iPad Pro com chip M4, tela Ultra Retina XDR OLED de 13", Apple Pencil Pro compativel. O tablet mais poderoso do mundo.',
  true
),
(
  'Apple Watch Ultra 2',
  'Apple',
  'Tech',
  799.00,
  'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop',
  'Apple Watch Ultra 2 com caixa de titanio de 49mm, GPS + Cellular, tela mais brilhante ate 3000 nits. Para aventureiros.',
  true
),
(
  'PlayStation 5 Slim',
  'Sony',
  'Tech',
  449.00,
  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
  'PS5 Slim com leitor de disco, 1TB SSD, controle DualSense. 30% menor que o modelo original.',
  true
),
(
  'Nintendo Switch OLED',
  'Nintendo',
  'Tech',
  349.00,
  'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=600&fit=crop',
  'Nintendo Switch modelo OLED com tela de 7", stand ajustavel, 64GB armazenamento e audio aprimorado.',
  true
),
(
  'iPhone 16 Pro Case MagSafe',
  'Apple',
  'Tech',
  49.00,
  'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop',
  'Case de silicone com MagSafe para iPhone 16 Pro. Protecao premium com toque aveludado em varias cores.',
  true
),

-- ===== BEAUTY =====
(
  'Perfume Chanel N5 EDP 100ml',
  'Chanel',
  'Beauty',
  135.00,
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop',
  'Eau de Parfum 100ml. O perfume mais iconico do mundo, com notas de ylang-ylang, rosa, jasmin e sandalo.',
  true
),
(
  'Rare Beauty Soft Pinch Blush',
  'Rare Beauty',
  'Beauty',
  23.00,
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
  'Soft Pinch Liquid Blush da marca da Selena Gomez. Formula leve e ultra-pigmentada que dura o dia todo. Viral no TikTok.',
  true
),
(
  'Dyson Airwrap Complete',
  'Dyson',
  'Beauty',
  599.00,
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&h=600&fit=crop',
  'Modelador Dyson Airwrap com tecnologia Coanda. Seca, modela e alisa sem calor extremo. Kit completo com 6 acessorios.',
  true
),
(
  'Charlotte Tilbury Pillow Talk Set',
  'Charlotte Tilbury',
  'Beauty',
  75.00,
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
  'Kit iconica Pillow Talk: batom + delineador labial na cor mais vendida do mundo. Tom nude-rosa perfeito.',
  true
),
(
  'Sol de Janeiro Bum Bum Cream',
  'Sol de Janeiro',
  'Beauty',
  48.00,
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop',
  'Brazilian Bum Bum Cream 240ml. Creme corporal com cupuacu, acai e oleo de coco. Fragrancia cheirinho de Brasil.',
  true
),
(
  'Dior Addict Lip Glow',
  'Dior',
  'Beauty',
  40.00,
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
  'Batom hidratante que realca a cor natural dos labios. 97% ingredientes naturais. Efeito gloss natural.',
  true
),
(
  'Fenty Beauty Pro Filtr Foundation',
  'Fenty Beauty',
  'Beauty',
  42.00,
  'https://images.unsplash.com/photo-1557205465-f3762edea6d3?w=600&h=600&fit=crop',
  'Base Pro Filtr Soft Matte da Rihanna. 50 tons disponiveis. Cobertura media a total, longa duracao, acabamento matte.',
  true
),

-- ===== FASHION =====
(
  'Nike Dunk Low Panda',
  'Nike',
  'Fashion',
  110.00,
  'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=600&fit=crop',
  'O classico Nike Dunk Low na iconica colorway preto e branco "Panda". Couro premium, sola vulcanizada. O tenis mais desejado.',
  true
),
(
  'Nike Air Force 1 07',
  'Nike',
  'Fashion',
  115.00,
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop',
  'O classico dos classicos. Air Force 1 todo branco em couro premium. Solado Air visivel para conforto o dia todo.',
  true
),
(
  'New Balance 550',
  'New Balance',
  'Fashion',
  130.00,
  'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop',
  'New Balance 550 retro basketball. Couro premium, sola ENCAP para amortecimento. O tenis favorito das fashionistas.',
  true
),
(
  'Adidas Samba OG',
  'Adidas',
  'Fashion',
  120.00,
  'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&h=600&fit=crop',
  'Adidas Samba OG classico com upper em couro, sola em borracha gum e as 3 listras iconicas. Tendencia absoluta.',
  true
),
(
  'Levis 501 Original',
  'Levis',
  'Fashion',
  69.00,
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
  'O jeans original desde 1873. Fit reto classico, 100% algodao, lavagem media. Um icone da moda americana.',
  true
),
(
  'Ray-Ban Aviator Classic',
  'Ray-Ban',
  'Fashion',
  163.00,
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
  'Oculos Ray-Ban Aviator Classic com armacao dourada e lentes verdes G-15. Protecao UV400. O oculos mais iconico.',
  true
),

-- ===== LIFESTYLE =====
(
  'Stanley Quencher H2.0 40oz',
  'Stanley',
  'Lifestyle',
  45.00,
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
  'Copo termico Quencher H2.0 de 40oz (1.18L). Mantem gelado 11h e quente 7h. Fenomeno viral. Varias cores.',
  true
),
(
  'Kindle Paperwhite 11a Geracao',
  'Amazon',
  'Lifestyle',
  149.00,
  'https://images.unsplash.com/photo-1594377157609-5c996118ac7f?w=600&h=600&fit=crop',
  'Kindle Paperwhite com tela de 6.8", luz quente ajustavel, 16GB, a prova dagua IPX8. Bateria de ate 10 semanas.',
  true
),
(
  'Bath & Body Works Candle 3-Wick',
  'Bath & Body Works',
  'Lifestyle',
  26.00,
  'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=600&h=600&fit=crop',
  'Vela aromatica de 3 pavios, 411g. Duracao de 25-45h. Fragancias exclusivas que voce nao encontra no Brasil.',
  true
),
(
  'Vitaminas Kirkland Daily Multi',
  'Kirkland',
  'Lifestyle',
  25.00,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop',
  'Multivitaminico diario com 500 comprimidos. Vitaminas A, C, D, E, complexo B e minerais essenciais. Custo-beneficio imbativel.',
  true
),
(
  'Whey Protein Gold Standard',
  'Optimum Nutrition',
  'Lifestyle',
  35.00,
  'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=600&h=600&fit=crop',
  'Whey Protein Isolate Gold Standard 2lb. 24g proteina por dose. Sabor Double Rich Chocolate. O whey mais vendido do mundo.',
  true
),
(
  'Yeti Rambler 26oz',
  'Yeti',
  'Lifestyle',
  40.00,
  'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=600&fit=crop',
  'Garrafa termica Yeti Rambler de 26oz (769ml) em aco inoxidavel. Isolamento a vacuo de parede dupla. Indestrutivel.',
  true
),
(
  'Creatina Monohidratada 300g',
  'Optimum Nutrition',
  'Lifestyle',
  30.00,
  'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&h=600&fit=crop',
  'Creatina Monohidratada micronizada 300g (60 doses). Sem sabor, dissolve facil. Suplemento #1 para performance.',
  true
);

-- ============================================================
-- 5. SEED: Promotions
-- ============================================================
INSERT INTO public.promotions (name, coupon_code, discount_type, discount_value, min_order_value, starts_at, expires_at, max_uses, active) VALUES
(
  'Primeira Compra',
  'MIAMI10',
  'percent',
  10,
  50,
  '2026-01-01 00:00:00+00',
  '2026-12-31 23:59:59+00',
  1000,
  true
),
(
  'Frete Gratis',
  'FRETE0',
  'fixed',
  50,
  200,
  '2026-01-01 00:00:00+00',
  '2026-06-30 23:59:59+00',
  500,
  true
),
(
  'VIP 20% OFF',
  'VIP20',
  'percent',
  20,
  100,
  '2026-01-01 00:00:00+00',
  '2026-12-31 23:59:59+00',
  200,
  true
),
(
  'Super Miami Weekend',
  'WEEKEND15',
  'percent',
  15,
  75,
  '2026-03-01 00:00:00+00',
  '2026-03-31 23:59:59+00',
  300,
  true
)
ON CONFLICT (coupon_code) DO NOTHING;

-- ============================================================
-- 6. Confirm admin email (fix login issue)
-- ============================================================
UPDATE auth.users SET email_confirmed_at = now()
WHERE email = 'admin@ajuvaiparamiami.com' AND email_confirmed_at IS NULL;

UPDATE auth.users SET email_confirmed_at = now()
WHERE email = 'seedadmin@ajuvaiparamiami.com' AND email_confirmed_at IS NULL;
