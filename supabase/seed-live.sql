-- ══════════════════════════════════════════════════════════════
-- AjuVaiParaMiami — SEED DATA COMPLETO (para Supabase SQL Editor)
-- Cole este SQL inteiro no Supabase Dashboard > SQL Editor > Run
-- ══════════════════════════════════════════════════════════════

-- ── 1. SETTINGS ─────────────────────────────────────────────
INSERT INTO settings (key, value) VALUES
  ('exchange_rate', '5.80'),
  ('spread_percent', '15'),
  ('exchange_rate_usd_brl', '5.80'),
  ('spread_percentage', '15'),
  ('whatsapp_number', '5561999999999'),
  ('referral_credit', '30')
ON CONFLICT (key) DO NOTHING;

-- ── 2. CATALOG PRODUCTS (limpar antigos com placehold.co) ───
DELETE FROM catalog_products WHERE image_url LIKE '%placehold.co%';

INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
  -- Tech (5)
  ('AirPods Pro 2', 'Apple', 'Tech', 249.00,
   'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
   'AirPods Pro de segunda geracao com cancelamento ativo de ruido, modo Transparencia adaptativo e audio personalizado espacial.', true),

  ('iPhone 15 Pro Max', 'Apple', 'Tech', 1199.00,
   'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
   'iPhone 15 Pro Max 256GB com chip A17 Pro, camera de 48MP e corpo de titanio. O smartphone mais avancado da Apple.', true),

  ('MacBook Air M3 15"', 'Apple', 'Tech', 1299.00,
   'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
   'MacBook Air com chip M3, tela Liquid Retina de 15", 8GB RAM e 256GB SSD. Ultra fino e potente.', true),

  ('iPad Pro 13" M4', 'Apple', 'Tech', 1099.00,
   'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
   'iPad Pro com chip M4, tela Ultra Retina XDR OLED de 13", Apple Pencil Pro compativel.', true),

  ('PS5 Slim Digital', 'Sony', 'Tech', 449.00,
   'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
   'PlayStation 5 Slim edicao digital. SSD de 1TB, DualSense incluso. Os melhores jogos em 4K.', true),

  -- Beauty (4)
  ('Perfume Chanel N5', 'Chanel', 'Beauty', 150.00,
   'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
   'Eau de Parfum 100ml. O perfume mais iconico do mundo, com notas de ylang-ylang, rosa e sandalo.', true),

  ('Rare Beauty Soft Pinch Blush', 'Rare Beauty', 'Beauty', 23.00,
   'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
   'Soft Pinch Liquid Blush da marca da Selena Gomez. Formula leve e ultra-pigmentada que dura o dia todo.', true),

  ('Dyson Airwrap Complete', 'Dyson', 'Beauty', 599.00,
   'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop',
   'Modelador de cabelo com tecnologia Coanda. Seca, modela e alisa sem calor extremo. Inclui 6 acessorios.', true),

  ('Sol de Janeiro Bum Bum Cream', 'Sol de Janeiro', 'Beauty', 48.00,
   'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
   'Creme corporal 240ml com guarana, cupuacu e acai. Fragrancia tropical irresistivel.', true),

  -- Fashion (3)
  ('Nike Dunk Low Panda', 'Nike', 'Fashion', 110.00,
   'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop',
   'O classico Nike Dunk Low na iconica colorway preto e branco "Panda". Couro premium.', true),

  ('Levi''s 501 Original', 'Levi''s', 'Fashion', 69.50,
   'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
   'A calca jeans original desde 1873. Corte reto classico, lavagem media.', true),

  ('Ray-Ban Aviator Classic', 'Ray-Ban', 'Fashion', 163.00,
   'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
   'Oculos de sol aviador com armacao dourada e lentes verdes G-15.', true),

  -- Lifestyle (3)
  ('Stanley Quencher H2.0', 'Stanley', 'Lifestyle', 45.00,
   'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
   'Copo termico Quencher H2.0 de 40oz. Mantem gelado por 11h. Viral no TikTok!', true),

  ('Kindle Paperwhite 11th Gen', 'Amazon', 'Lifestyle', 149.99,
   'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop',
   'E-reader com tela de 6.8", 16GB, a prova d''agua IPX8, luz quente ajustavel.', true),

  ('Vitaminas Kirkland Combo', 'Kirkland', 'Lifestyle', 35.00,
   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
   'Kit Vitamina D3 5000 IU (600 caps) + Omega-3 Fish Oil 1000mg (400 caps).', true)
ON CONFLICT DO NOTHING;

-- ── 3. PROMOTIONS ───────────────────────────────────────────
INSERT INTO promotions (name, coupon_code, discount_type, discount_value, min_order_value, starts_at, expires_at, max_uses, active) VALUES
  ('Primeira Compra', 'WELCOME10', 'percent', 10, 500, now(), now() + interval '90 days', 100, true),
  ('Frete Miami', 'MIAMI15', 'percent', 15, 2000, now(), now() + interval '60 days', 50, true),
  ('Desconto Tech', 'TECH50', 'fixed', 50, 1000, now(), now() + interval '45 days', 30, true),
  ('Indicou Ganhou', 'AMIGO20', 'percent', 20, 800, now(), now() + interval '120 days', 200, true)
ON CONFLICT (coupon_code) DO NOTHING;

-- ── 4. TRIPS ────────────────────────────────────────────────
INSERT INTO trips (code, traveler_name, flight_number, departure_date, arrival_date, max_weight_kg) VALUES
  ('MIAMI-001', 'Juliana Santos', 'AA2198', '2026-03-10', '2026-03-17', 46),
  ('MIAMI-002', 'Juliana Santos', 'LA8181', '2026-04-05', '2026-04-12', 46),
  ('MIAMI-003', 'Marina Oliveira', 'UA1522', '2026-05-01', '2026-05-08', 23)
ON CONFLICT (code) DO NOTHING;

-- ── 5. DEMO USERS + PROFILES ────────────────────────────────
-- Cria usuarios demo (precisa rodar com service_role key)
-- Se der erro de permissao, rode no Supabase Dashboard > SQL Editor

-- Usuario Admin
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'admin@ajuvaiparamiami.com',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin AjuVaiParaMiami"}',
  now(), now(), 'authenticated', 'authenticated', ''
) ON CONFLICT (id) DO NOTHING;

-- Clientes Demo
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
VALUES
  ('00000000-0000-0000-0000-000000000010',
   '00000000-0000-0000-0000-000000000000',
   'carlos.silva@email.com', crypt('Cliente123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Carlos Silva"}',
   now() - interval '30 days', now(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000011',
   '00000000-0000-0000-0000-000000000000',
   'ana.costa@email.com', crypt('Cliente123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Ana Beatriz Costa"}',
   now() - interval '25 days', now(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000012',
   '00000000-0000-0000-0000-000000000000',
   'roberto.almeida@email.com', crypt('Cliente123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Roberto Almeida"}',
   now() - interval '20 days', now(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000013',
   '00000000-0000-0000-0000-000000000000',
   'fernanda.lima@email.com', crypt('Cliente123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Fernanda Lima"}',
   now() - interval '15 days', now(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000014',
   '00000000-0000-0000-0000-000000000000',
   'lucas.mendes@email.com', crypt('Cliente123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Lucas Mendes"}',
   now() - interval '10 days', now(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000015',
   '00000000-0000-0000-0000-000000000000',
   'patricia.souza@email.com', crypt('Cliente123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Patricia Souza"}',
   now() - interval '5 days', now(), 'authenticated', 'authenticated', '')
ON CONFLICT (id) DO NOTHING;

-- Profiles
INSERT INTO profiles (id, email, full_name, phone, address, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@ajuvaiparamiami.com', 'Admin AjuVaiParaMiami', '+5561999999999', null, 'admin'),
  ('00000000-0000-0000-0000-000000000010', 'carlos.silva@email.com', 'Carlos Silva', '+5511988887777', 'Jardins, Sao Paulo-SP', 'cliente'),
  ('00000000-0000-0000-0000-000000000011', 'ana.costa@email.com', 'Ana Beatriz Costa', '+5511977776666', 'Copacabana, Rio de Janeiro-RJ', 'cliente'),
  ('00000000-0000-0000-0000-000000000012', 'roberto.almeida@email.com', 'Roberto Almeida', '+5511966665555', 'Asa Sul, Brasilia-DF', 'cliente'),
  ('00000000-0000-0000-0000-000000000013', 'fernanda.lima@email.com', 'Fernanda Lima', '+5511955554444', 'Savassi, Belo Horizonte-MG', 'cliente'),
  ('00000000-0000-0000-0000-000000000014', 'lucas.mendes@email.com', 'Lucas Mendes', '+5511944443333', 'Moinhos de Vento, Porto Alegre-RS', 'cliente'),
  ('00000000-0000-0000-0000-000000000015', 'patricia.souza@email.com', 'Patricia Souza', '+5511933332222', 'Aldeota, Fortaleza-CE', 'cliente')
ON CONFLICT (id) DO NOTHING;

-- ── 6. ORDERS (8 pedidos em diferentes status) ──────────────
INSERT INTO orders (order_number, client_id, customer_name, customer_phone, items, total_usd, total_brl, total_amount, deposit_amount, status, trip_id, estimated_weight_kg, created_at) VALUES
  -- Carlos: iPhone + AirPods → aprovado, viagem MIAMI-001
  ('#MB-0001', '00000000-0000-0000-0000-000000000010', 'Carlos Silva', '+5511988887777',
   'iPhone 15 Pro Max, AirPods Pro 2', 1448.00, 8503.56, 8503.56, 4251.78, 'aprovado',
   (SELECT id FROM trips WHERE code = 'MIAMI-001'), 0.8,
   now() - interval '28 days'),

  -- Ana: MacBook → comprando, viagem MIAMI-001
  ('#MB-0002', '00000000-0000-0000-0000-000000000011', 'Ana Beatriz Costa', '+5511977776666',
   'MacBook Air M3 15"', 1299.00, 7628.13, 7628.13, 3814.06, 'comprando',
   (SELECT id FROM trips WHERE code = 'MIAMI-001'), 2.1,
   now() - interval '23 days'),

  -- Roberto: PS5 + controles → novo (aguardando orcamento)
  ('#MB-0003', '00000000-0000-0000-0000-000000000012', 'Roberto Almeida', '+5511966665555',
   'PS5 Slim Digital, DualSense Controller x2', 549.00, 3224.37, 3224.37, 1612.18, 'novo',
   NULL, 4.5,
   now() - interval '3 days'),

  -- Fernanda: iPad + Pencil → aprovado, viagem MIAMI-002
  ('#MB-0004', '00000000-0000-0000-0000-000000000013', 'Fernanda Lima', '+5511955554444',
   'iPad Pro 13" M4, Apple Pencil Pro', 1228.00, 7211.34, 7211.34, 3605.67, 'aprovado',
   (SELECT id FROM trips WHERE code = 'MIAMI-002'), 1.2,
   now() - interval '14 days'),

  -- Lucas: Nike + Levi's + Ray-Ban → orcamento
  ('#MB-0005', '00000000-0000-0000-0000-000000000014', 'Lucas Mendes', '+5511944443333',
   'Nike Dunk Low Panda, Levi''s 501 x2, Ray-Ban Aviator', 412.00, 2419.44, 2419.44, 1209.72, 'orcamento',
   NULL, 3.0,
   now() - interval '7 days'),

  -- Patricia: Vitaminas + Stanley → comprado, viagem MIAMI-002
  ('#MB-0006', '00000000-0000-0000-0000-000000000015', 'Patricia Souza', '+5511933332222',
   'Vitaminas Kirkland Combo x4, Stanley Quencher x2', 230.00, 1351.11, 1351.11, 675.55, 'comprado',
   (SELECT id FROM trips WHERE code = 'MIAMI-002'), 5.5,
   now() - interval '12 days'),

  -- Carlos: Dyson + Chanel (presente) → em_transito, viagem MIAMI-001
  ('#MB-0007', '00000000-0000-0000-0000-000000000010', 'Carlos Silva', '+5511988887777',
   'Dyson Airwrap Complete, Perfume Chanel N5', 734.00, 4310.22, 4310.22, 2155.11, 'em_transito',
   (SELECT id FROM trips WHERE code = 'MIAMI-001'), 2.0,
   now() - interval '20 days'),

  -- Ana: Rare Beauty + Sol de Janeiro → entregue (finalizado)
  ('#MB-0008', '00000000-0000-0000-0000-000000000011', 'Ana Beatriz Costa', '+5511977776666',
   'Rare Beauty Blush x3, Sol de Janeiro Bum Bum x2', 165.00, 969.38, 969.38, 484.69, 'entregue',
   (SELECT id FROM trips WHERE code = 'MIAMI-001'), 1.5,
   now() - interval '35 days')
ON CONFLICT (order_number) DO NOTHING;

-- ── 7. ORDER ITEMS ──────────────────────────────────────────
-- PED-001: Carlos - iPhone + AirPods
INSERT INTO order_items (order_id, product_name, product_image_url, price_usd, price_brl, quantity) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0001'), 'iPhone 15 Pro Max',
   'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
   1199.00, 7040.13, 1),
  ((SELECT id FROM orders WHERE order_number = '#MB-0001'), 'AirPods Pro 2',
   'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
   249.00, 1462.62, 1);

-- PED-002: Ana - MacBook
INSERT INTO order_items (order_id, product_name, product_image_url, price_usd, price_brl, quantity) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0002'), 'MacBook Air M3 15"',
   'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
   1299.00, 7628.13, 1);

-- PED-003: Roberto - PS5 + controles
INSERT INTO order_items (order_id, product_name, product_image_url, price_usd, price_brl, quantity) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0003'), 'PS5 Slim Digital',
   'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
   449.00, 2636.73, 1),
  ((SELECT id FROM orders WHERE order_number = '#MB-0003'), 'DualSense Controller',
   NULL, 50.00, 293.85, 2);

-- PED-004: Fernanda - iPad + Pencil
INSERT INTO order_items (order_id, product_name, product_image_url, price_usd, price_brl, quantity) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0004'), 'iPad Pro 13" M4',
   'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
   1099.00, 6453.03, 1),
  ((SELECT id FROM orders WHERE order_number = '#MB-0004'), 'Apple Pencil Pro',
   NULL, 129.00, 757.71, 1);

-- PED-005: Lucas - Nike + Levi's + Ray-Ban
INSERT INTO order_items (order_id, product_name, product_image_url, price_usd, price_brl, quantity) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0005'), 'Nike Dunk Low Panda',
   'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop',
   110.00, 645.81, 1),
  ((SELECT id FROM orders WHERE order_number = '#MB-0005'), 'Levi''s 501 Original',
   'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
   69.50, 408.21, 2),
  ((SELECT id FROM orders WHERE order_number = '#MB-0005'), 'Ray-Ban Aviator Classic',
   'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
   163.00, 957.22, 1);

-- PED-006: Patricia - Vitaminas + Stanley
INSERT INTO order_items (order_id, product_name, product_image_url, price_usd, price_brl, quantity) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0006'), 'Vitaminas Kirkland Combo',
   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
   35.00, 205.59, 4),
  ((SELECT id FROM orders WHERE order_number = '#MB-0006'), 'Stanley Quencher H2.0',
   'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
   45.00, 264.33, 2);

-- PED-007: Carlos - Dyson + Chanel
INSERT INTO order_items (order_id, product_name, product_image_url, price_usd, price_brl, quantity) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0007'), 'Dyson Airwrap Complete',
   'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop',
   599.00, 3517.13, 1),
  ((SELECT id FROM orders WHERE order_number = '#MB-0007'), 'Perfume Chanel N5',
   'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
   135.00, 792.94, 1);

-- PED-008: Ana - Rare Beauty + Sol de Janeiro
INSERT INTO order_items (order_id, product_name, product_image_url, price_usd, price_brl, quantity) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'Rare Beauty Soft Pinch Blush',
   'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
   23.00, 135.11, 3),
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'Sol de Janeiro Bum Bum Cream',
   'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
   48.00, 281.95, 2);

-- ── 8. ORDER EVENTS (timeline) ──────────────────────────────
-- PED-001: Carlos aprovado
INSERT INTO order_events (order_id, status, title, description, created_at) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0001'), 'novo', 'Pedido criado', 'Pedido recebido via app', now() - interval '28 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0001'), 'orcamento', 'Orcamento enviado', 'Total: R$ 8.503,56 | Sinal: R$ 4.251,78', now() - interval '27 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0001'), 'aprovado', 'Pedido aprovado', 'Cliente aprovou e pagou sinal via PIX', now() - interval '26 days');

-- PED-002: Ana comprando
INSERT INTO order_events (order_id, status, title, description, created_at) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0002'), 'novo', 'Pedido criado', NULL, now() - interval '23 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0002'), 'aprovado', 'Pedido aprovado', 'Sinal recebido', now() - interval '22 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0002'), 'comprando', 'Comprando itens', 'Indo ate a Apple Store Aventura Mall', now() - interval '20 days');

-- PED-003: Roberto novo
INSERT INTO order_events (order_id, status, title, description, created_at) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0003'), 'novo', 'Pedido criado', 'Pedido recebido, aguardando orcamento', now() - interval '3 days');

-- PED-004: Fernanda aprovado
INSERT INTO order_events (order_id, status, title, description, created_at) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0004'), 'novo', 'Pedido criado', NULL, now() - interval '14 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0004'), 'orcamento', 'Orcamento enviado', 'Total: R$ 7.211,34', now() - interval '13 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0004'), 'aprovado', 'Pedido aprovado', 'Sinal pago via transferencia', now() - interval '12 days');

-- PED-006: Patricia comprado
INSERT INTO order_events (order_id, status, title, description, created_at) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0006'), 'novo', 'Pedido criado', NULL, now() - interval '12 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0006'), 'aprovado', 'Aprovado', 'Sinal via PIX', now() - interval '11 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0006'), 'comprando', 'Comprando', 'Itens na lista de compras', now() - interval '9 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0006'), 'comprado', 'Comprado', 'Todos os itens comprados no Costco', now() - interval '7 days');

-- PED-007: Carlos em transito
INSERT INTO order_events (order_id, status, title, description, created_at) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0007'), 'novo', 'Pedido criado', NULL, now() - interval '20 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0007'), 'aprovado', 'Aprovado', NULL, now() - interval '19 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0007'), 'comprando', 'Comprando', 'Sephora + Nordstrom', now() - interval '17 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0007'), 'comprado', 'Comprado', 'Itens prontos para embarque', now() - interval '15 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0007'), 'em_transito', 'Em transito', 'Viagem MIAMI-001 embarcou - AA2198', now() - interval '10 days');

-- PED-008: Ana entregue
INSERT INTO order_events (order_id, status, title, description, created_at) VALUES
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'novo', 'Pedido criado', NULL, now() - interval '35 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'aprovado', 'Aprovado', NULL, now() - interval '34 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'comprando', 'Comprando', 'Sephora Aventura', now() - interval '32 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'comprado', 'Comprado', NULL, now() - interval '30 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'em_transito', 'Em transito', NULL, now() - interval '25 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'chegou_brasil', 'Chegou ao Brasil', 'Pacote recebido em SP', now() - interval '18 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'entregue', 'Entregue', 'Entregue em maos no Copacabana', now() - interval '15 days');

-- ── 9. PAYMENTS ─────────────────────────────────────────────
INSERT INTO payments (order_id, type, amount, notes, created_at) VALUES
  -- PED-001: Carlos pagou sinal
  ((SELECT id FROM orders WHERE order_number = '#MB-0001'), 'deposit', 4251.78, 'Sinal via PIX', now() - interval '26 days'),

  -- PED-002: Ana pagou sinal
  ((SELECT id FROM orders WHERE order_number = '#MB-0002'), 'deposit', 3814.06, 'Sinal via PIX', now() - interval '22 days'),

  -- PED-004: Fernanda pagou sinal
  ((SELECT id FROM orders WHERE order_number = '#MB-0004'), 'deposit', 3605.67, 'Sinal via transferencia bancaria', now() - interval '12 days'),

  -- PED-006: Patricia pagou sinal
  ((SELECT id FROM orders WHERE order_number = '#MB-0006'), 'deposit', 675.55, 'Sinal via PIX', now() - interval '11 days'),

  -- PED-007: Carlos pagou sinal
  ((SELECT id FROM orders WHERE order_number = '#MB-0007'), 'deposit', 2155.11, 'Sinal via PIX', now() - interval '19 days'),

  -- PED-008: Ana pagou tudo (sinal + saldo)
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'deposit', 484.69, 'Sinal via PIX', now() - interval '34 days'),
  ((SELECT id FROM orders WHERE order_number = '#MB-0008'), 'balance', 484.69, 'Saldo pago na entrega em dinheiro', now() - interval '15 days');

-- ══════════════════════════════════════════════════════════════
-- PRONTO! Dados inseridos:
-- ✅ 6 settings
-- ✅ 15 produtos no catalogo (com imagens Unsplash reais)
-- ✅ 4 promocoes ativas
-- ✅ 3 viagens
-- ✅ 6 clientes demo + 1 admin
-- ✅ 8 pedidos (novo, orcamento, aprovado, comprando, comprado, em_transito, entregue)
-- ✅ 16 itens de pedido
-- ✅ 27 eventos na timeline
-- ✅ 7 pagamentos
--
-- Logins demo:
-- Admin:   admin@ajuvaiparamiami.com / Admin123!
-- Cliente: carlos.silva@email.com / Cliente123!
-- Cliente: ana.costa@email.com / Cliente123!
-- ══════════════════════════════════════════════════════════════
