-- ============================================================
-- MalaBridge - Seed Data
-- Run AFTER the unified migration
-- ============================================================

-- Settings
INSERT INTO settings (key, value) VALUES
  ('exchange_rate', '5.70'),
  ('spread_percent', '3'),
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

-- Catalog Products
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('AirPods Pro 2', 'Apple', 'Tech', 249.00, 'https://placehold.co/400x400/f0f0f0/333?text=AirPods+Pro+2', 'AirPods Pro de segunda geracao com cancelamento ativo de ruido, modo Transparencia adaptativo e audio personalizado espacial.'),
  ('Nike Dunk Low Panda', 'Nike', 'Fashion', 110.00, 'https://placehold.co/400x400/f0f0f0/333?text=Nike+Dunk+Low', 'O classico Nike Dunk Low na iconica colorway preto e branco "Panda". Couro premium, sola vulcanizada.'),
  ('Perfume Chanel N5', 'Chanel', 'Beauty', 135.00, 'https://placehold.co/400x400/f0f0f0/333?text=Chanel+N5', 'Eau de Parfum 100ml. O perfume mais iconico do mundo, com notas de ylang-ylang, rosa e sandalo.'),
  ('iPhone 15 Pro Case', 'Apple', 'Tech', 49.00, 'https://placehold.co/400x400/f0f0f0/333?text=iPhone+Case', 'Case de silicone com MagSafe para iPhone 15 Pro. Protecao premium com toque aveludado.'),
  ('Stanley Cup Tumbler', 'Stanley', 'Fashion', 45.00, 'https://placehold.co/400x400/f0f0f0/333?text=Stanley+Cup', 'Copo termico Quencher H2.0 de 40oz. Mantem bebidas geladas por 11h e quentes por 7h.'),
  ('Rare Beauty Blush', 'Rare Beauty', 'Beauty', 23.00, 'https://placehold.co/400x400/f0f0f0/333?text=Rare+Beauty', 'Soft Pinch Liquid Blush da marca da Selena Gomez. Formula leve e ultra-pigmentada que dura o dia todo.')
ON CONFLICT DO NOTHING;

-- Trips
INSERT INTO trips (code, traveler_name, flight_number, departure_date, arrival_date, max_weight_kg) VALUES
  ('T-041', 'Juliana Santos', 'AA2198', '2026-03-10', '2026-03-17', 46),
  ('T-042', 'Juliana Santos', 'LA8181', '2026-04-05', '2026-04-12', 46),
  ('T-043', 'Marina Oliveira', 'UA1522', '2026-05-01', '2026-05-08', 23)
ON CONFLICT (code) DO NOTHING;

-- Orders (sem client_id para dados de demonstracao)
INSERT INTO orders (order_number, customer_name, customer_phone, items, total_amount, deposit_amount, status, trip_id, estimated_weight_kg) VALUES
  ('PED-001', 'Carlos Silva', '5511988887777', 'iPhone 15 Pro Max 256GB, AirPods Pro 2', 9500, 4750, 'aprovado', (SELECT id FROM trips WHERE code = 'T-041'), 0.8),
  ('PED-002', 'Ana Beatriz Costa', '5511977776666', 'MacBook Air M3 15"', 12000, 6000, 'aprovado', (SELECT id FROM trips WHERE code = 'T-041'), 2.1),
  ('PED-003', 'Roberto Almeida', '5511966665555', 'PS5 Slim, DualSense Controller x2', 4200, 2100, 'novo', (SELECT id FROM trips WHERE code = 'T-041'), 4.5),
  ('PED-004', 'Fernanda Lima', '5511955554444', 'iPad Pro 13" M4, Apple Pencil Pro', 11800, 5900, 'aprovado', (SELECT id FROM trips WHERE code = 'T-042'), 1.2),
  ('PED-005', 'Lucas Mendes', '5511944443333', 'Nike Air Max 90 x3, Levi''s 501 x2', 2800, 1400, 'novo', NULL, 3.0),
  ('PED-006', 'Patricia Souza', '5511933332222', 'Vitaminas Kirkland x4, Proteina Whey x2', 850, 425, 'aprovado', (SELECT id FROM trips WHERE code = 'T-042'), 5.5)
ON CONFLICT (order_number) DO NOTHING;

-- Payments
INSERT INTO payments (order_id, type, amount, notes) VALUES
  ((SELECT id FROM orders WHERE order_number = 'PED-001'), 'deposit', 4750, 'Sinal via PIX'),
  ((SELECT id FROM orders WHERE order_number = 'PED-002'), 'deposit', 6000, 'Sinal via PIX'),
  ((SELECT id FROM orders WHERE order_number = 'PED-002'), 'balance', 6000, 'Saldo pago na entrega'),
  ((SELECT id FROM orders WHERE order_number = 'PED-003'), 'deposit', 2100, 'Sinal via PIX'),
  ((SELECT id FROM orders WHERE order_number = 'PED-004'), 'deposit', 5900, 'Sinal via transferencia'),
  ((SELECT id FROM orders WHERE order_number = 'PED-006'), 'deposit', 425, 'Sinal via PIX');
