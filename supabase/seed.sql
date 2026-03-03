-- ============================================================
-- AjuVaiParaMiami - Seed Data
-- Run AFTER the unified migration
-- ============================================================

-- Settings
INSERT INTO settings (key, value) VALUES
  ('exchange_rate', '5.80'),
  ('spread_percent', '15'),
  ('whatsapp_number', '5561999999999'),
  ('referral_credit', '30')
ON CONFLICT (key) DO NOTHING;

-- WhatsApp Templates
INSERT INTO whatsapp_templates (slug, title, icon, template_text) VALUES
  ('orcamento', 'Orcamento Enviado', '📋', 'Oi, {nome_cliente}! Ja preparei o orcamento do seu pedido #{numero_pedido}. Resumo: {itens}. Total estimado: R$ {valor_total}. Sinal: R$ {valor_sinal}. Se estiver ok, me avisa que te mando as instrucoes!'),
  ('compra', 'Compra Confirmada', '✅', 'Atualizacao do pedido #{numero_pedido}: compra feita ✅ Ja comprei seus itens! Vou te mandando fotos e a nota fiscal por aqui.'),
  ('em_viagem', 'Em Viagem', '✈', 'Boas noticias! ✈ Seu pedido #{numero_pedido} ja esta na viagem {codigo_viagem}. Proxima etapa: saida dos EUA e chegada ao Brasil.'),
  ('chegou', 'Chegou no Brasil', '🇧🇷', 'Chegou no Brasil! 🇧🇷🎉 Pedido #{numero_pedido} ja esta aqui. Agora vamos combinar entrega/retirada. Qual melhor dia e horario pra voce?'),
  ('esgotado', 'Item Esgotado', '😕', 'Oi, {nome_cliente}! O {itens} do pedido #{numero_pedido} esta esgotado na loja. Quer que eu devolva o sinal via PIX ou deixa como credito no app?'),
  ('entregue', 'Entregue', '🎉', 'Entregue! ✅ Pedido #{numero_pedido} finalizado. Obrigada pela confianca, {nome_cliente}! Se quiser, me diz o que quer trazer na proxima.')
ON CONFLICT (slug) DO NOTHING;

-- Catalog Products (28 products with real images)
-- Tech
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('AirPods Pro 2', 'Apple', 'Tech', 249.00, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop', 'AirPods Pro de segunda geracao com cancelamento ativo de ruido, modo Transparencia adaptativo e audio personalizado espacial. Chip H2 da Apple.'),
  ('iPhone 16 Pro Max 256GB', 'Apple', 'Tech', 1199.00, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop', 'O iPhone mais avancado com chip A18 Pro, camera de 48MP com zoom optico 5x, tela Super Retina XDR de 6.9" e botao de Acao.'),
  ('MacBook Air M3 15"', 'Apple', 'Tech', 1299.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', 'MacBook Air com chip M3, tela Liquid Retina de 15.3", 8GB RAM, 256GB SSD. Fino, leve e com bateria de ate 18 horas.'),
  ('iPad Pro 13" M4', 'Apple', 'Tech', 1099.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', 'iPad Pro com chip M4, tela Ultra Retina XDR OLED de 13", Apple Pencil Pro compativel. O tablet mais poderoso do mundo.'),
  ('Apple Watch Ultra 2', 'Apple', 'Tech', 799.00, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop', 'Apple Watch Ultra 2 com caixa de titanio de 49mm, GPS + Cellular, tela mais brilhante ate 3000 nits.'),
  ('PlayStation 5 Slim', 'Sony', 'Tech', 549.99, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', 'PS5 Slim com leitor de disco, 1TB SSD, controle DualSense. 30% menor que o modelo original.'),
  ('Nintendo Switch OLED', 'Nintendo', 'Tech', 349.00, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=600&fit=crop', 'Nintendo Switch modelo OLED com tela de 7", stand ajustavel, 64GB armazenamento e audio aprimorado.'),
  ('iPhone 16 Pro Case MagSafe', 'Apple', 'Tech', 49.00, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop', 'Case de silicone com MagSafe para iPhone 16 Pro. Protecao premium com toque aveludado em varias cores.')
ON CONFLICT DO NOTHING;

-- Beauty
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Perfume Chanel N5 EDP 100ml', 'Chanel', 'Beauty', 135.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop', 'Eau de Parfum 100ml. O perfume mais iconico do mundo, com notas de ylang-ylang, rosa, jasmin e sandalo.'),
  ('Rare Beauty Soft Pinch Blush', 'Rare Beauty', 'Beauty', 23.00, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', 'Soft Pinch Liquid Blush da marca da Selena Gomez. Formula leve e ultra-pigmentada que dura o dia todo. Viral no TikTok.'),
  ('Dyson Airwrap Complete', 'Dyson', 'Beauty', 599.00, 'https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?w=600&h=600&fit=crop', 'Modelador Dyson Airwrap com tecnologia Coanda. Seca, modela e alisa sem calor extremo. Kit completo com 6 acessorios.'),
  ('Charlotte Tilbury Pillow Talk Set', 'Charlotte Tilbury', 'Beauty', 75.00, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 'Kit iconica Pillow Talk: batom + delineador labial na cor mais vendida do mundo. Tom nude-rosa perfeito.'),
  ('Sol de Janeiro Bum Bum Cream', 'Sol de Janeiro', 'Beauty', 48.00, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop', 'Brazilian Bum Bum Cream 240ml. Creme corporal com cupuacu, acai e oleo de coco. Fragrancia cheirinho de Brasil.'),
  ('Dior Addict Lip Glow', 'Dior', 'Beauty', 40.00, 'https://images.unsplash.com/photo-1631214500115-598fc2cb8ada?w=600&h=600&fit=crop', 'Batom hidratante que realca a cor natural dos labios. 97% ingredientes naturais. Efeito gloss natural.'),
  ('Fenty Beauty Pro Filtr Foundation', 'Fenty Beauty', 'Beauty', 42.00, 'https://images.unsplash.com/photo-1557205465-f3762edea6d3?w=600&h=600&fit=crop', 'Base Pro Filtr Soft Matte da Rihanna. 50 tons disponiveis. Cobertura media a total, longa duracao, acabamento matte.')
ON CONFLICT DO NOTHING;

-- Fashion
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Nike Dunk Low Panda', 'Nike', 'Fashion', 110.00, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=600&fit=crop', 'O classico Nike Dunk Low na iconica colorway preto e branco "Panda". Couro premium, sola vulcanizada.'),
  ('Nike Air Force 1 07', 'Nike', 'Fashion', 115.00, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', 'O classico dos classicos. Air Force 1 todo branco em couro premium. Solado Air visivel para conforto o dia todo.'),
  ('New Balance 550', 'New Balance', 'Fashion', 130.00, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop', 'New Balance 550 retro basketball. Couro premium, sola ENCAP para amortecimento. O tenis favorito das fashionistas.'),
  ('Adidas Samba OG', 'Adidas', 'Fashion', 120.00, 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&h=600&fit=crop', 'Adidas Samba OG classico com upper em couro, sola em borracha gum e as 3 listras iconicas. Tendencia absoluta.'),
  ('Levis 501 Original', 'Levis', 'Fashion', 69.50, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop', 'O jeans original desde 1873. Fit reto classico, 100% algodao, lavagem media. Um icone da moda americana.'),
  ('Ray-Ban Aviator Classic', 'Ray-Ban', 'Fashion', 163.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop', 'Oculos Ray-Ban Aviator Classic com armacao dourada e lentes verdes G-15. Protecao UV400. O oculos mais iconico.')
ON CONFLICT DO NOTHING;

-- Lifestyle
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Stanley Quencher H2.0 40oz', 'Stanley', 'Lifestyle', 45.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop', 'Copo termico Quencher H2.0 de 40oz (1.18L). Mantem gelado 11h e quente 7h. Fenomeno viral. Varias cores.'),
  ('Kindle Paperwhite 11a Geracao', 'Amazon', 'Lifestyle', 149.99, 'https://images.unsplash.com/photo-1594377157609-5c996118ac7f?w=600&h=600&fit=crop', 'Kindle Paperwhite com tela de 6.8", luz quente ajustavel, 16GB, a prova dagua IPX8. Bateria de ate 10 semanas.'),
  ('Bath & Body Works Candle 3-Wick', 'Bath & Body Works', 'Lifestyle', 26.00, 'https://images.unsplash.com/photo-1602607616524-9d05c1eeb148?w=600&h=600&fit=crop', 'Vela aromatica de 3 pavios, 411g. Duracao de 25-45h. Fragancias exclusivas que voce nao encontra no Brasil.'),
  ('Vitaminas Kirkland Daily Multi', 'Kirkland', 'Lifestyle', 25.00, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=600&fit=crop', 'Multivitaminico diario com 500 comprimidos. Vitaminas A, C, D, E, complexo B e minerais essenciais.'),
  ('Whey Protein Gold Standard', 'Optimum Nutrition', 'Lifestyle', 35.00, 'https://images.unsplash.com/photo-1593095948071-474c5cc2c989?w=600&h=600&fit=crop', 'Whey Protein Isolate Gold Standard 2lb. 24g proteina por dose. Sabor Double Rich Chocolate.'),
  ('Yeti Rambler 26oz', 'Yeti', 'Lifestyle', 40.00, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=600&fit=crop', 'Garrafa termica Yeti Rambler de 26oz (769ml) em aco inoxidavel. Isolamento a vacuo de parede dupla.'),
  ('Creatina Monohidratada 300g', 'Optimum Nutrition', 'Lifestyle', 30.00, 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&h=600&fit=crop', 'Creatina Monohidratada micronizada 300g (60 doses). Sem sabor, dissolve facil. Suplemento #1 para performance.')
ON CONFLICT DO NOTHING;

-- Promotions
INSERT INTO promotions (name, coupon_code, discount_type, discount_value, min_order_value, starts_at, expires_at, max_uses, active) VALUES
  ('Primeira Compra', 'MIAMI10', 'percent', 10, 50, '2026-01-01', '2026-12-31', 1000, true),
  ('Frete Gratis', 'FRETE0', 'fixed', 50, 200, '2026-01-01', '2026-06-30', 500, true),
  ('VIP 20% OFF', 'VIP20', 'percent', 20, 100, '2026-01-01', '2026-12-31', 200, true),
  ('Super Miami Weekend', 'WEEKEND15', 'percent', 15, 75, '2026-03-01', '2026-03-31', 300, true)
ON CONFLICT (coupon_code) DO NOTHING;

-- Trips
INSERT INTO trips (code, traveler_name, flight_number, departure_date, arrival_date, max_weight_kg) VALUES
  ('T-041', 'Juliana Santos', 'AA2198', '2026-03-10', '2026-03-17', 46),
  ('T-042', 'Juliana Santos', 'LA8181', '2026-04-05', '2026-04-12', 46),
  ('T-043', 'Marina Oliveira', 'UA1522', '2026-05-01', '2026-05-08', 23)
ON CONFLICT (code) DO NOTHING;

-- Orders (demo data - requer que usuarios seed existam em auth.users)
-- Para criar os pedidos de demo, primeiro crie os usuarios seed
-- no Supabase Dashboard (ver secao 14 da comprehensive_schema.sql)
-- e depois rode:
--
-- INSERT INTO orders (order_number, client_id, items, deposit_paid, status, trip_id, estimated_weight_kg, notes) VALUES
--   ('PED-001', '00000000-0000-0000-0000-000000000002', 'iPhone 15 Pro Max 256GB, AirPods Pro 2', 4750, 'aprovado', (SELECT id FROM trips WHERE code = 'T-041'), 0.8, 'Cliente: Carlos Silva - Tel: 5511988887777'),
--   ('PED-002', '00000000-0000-0000-0000-000000000002', 'MacBook Air M3 15"', 6000, 'aprovado', (SELECT id FROM trips WHERE code = 'T-041'), 2.1, 'Cliente: Ana Beatriz Costa - Tel: 5511977776666'),
--   ('PED-003', '00000000-0000-0000-0000-000000000002', 'PS5 Slim, DualSense Controller x2', 2100, 'novo', (SELECT id FROM trips WHERE code = 'T-041'), 4.5, 'Cliente: Roberto Almeida - Tel: 5511966665555'),
--   ('PED-004', '00000000-0000-0000-0000-000000000002', 'iPad Pro 13" M4, Apple Pencil Pro', 5900, 'aprovado', (SELECT id FROM trips WHERE code = 'T-042'), 1.2, 'Cliente: Fernanda Lima - Tel: 5511955554444'),
--   ('PED-005', '00000000-0000-0000-0000-000000000002', 'Nike Air Max 90 x3, Levi''s 501 x2', 1400, 'novo', NULL, 3.0, 'Cliente: Lucas Mendes - Tel: 5511944443333'),
--   ('PED-006', '00000000-0000-0000-0000-000000000002', 'Vitaminas Kirkland x4, Proteina Whey x2', 425, 'aprovado', (SELECT id FROM trips WHERE code = 'T-042'), 5.5, 'Cliente: Patricia Souza - Tel: 5511933332222')
-- ON CONFLICT (order_number) DO NOTHING;

-- Payments
INSERT INTO payments (order_id, type, amount, notes) VALUES
  ((SELECT id FROM orders WHERE order_number = 'PED-001'), 'deposit', 4750, 'Sinal via PIX'),
  ((SELECT id FROM orders WHERE order_number = 'PED-002'), 'deposit', 6000, 'Sinal via PIX'),
  ((SELECT id FROM orders WHERE order_number = 'PED-002'), 'balance', 6000, 'Saldo pago na entrega'),
  ((SELECT id FROM orders WHERE order_number = 'PED-003'), 'deposit', 2100, 'Sinal via PIX'),
  ((SELECT id FROM orders WHERE order_number = 'PED-004'), 'deposit', 5900, 'Sinal via transferencia'),
  ((SELECT id FROM orders WHERE order_number = 'PED-006'), 'deposit', 425, 'Sinal via PIX');
