-- ============================================================
-- AjuVaiParaMiami - Seed Fake Data for All Admin Sections
-- Run in Supabase SQL Editor to populate the admin with demo data
-- ============================================================

-- ============================================================
-- 1. SETTINGS (exchange rate, spread, whatsapp, prohibited items)
-- ============================================================
INSERT INTO public.settings (key, value) VALUES
  ('exchange_rate_usd_brl', '6.05'),
  ('spread_percentage', '8'),
  ('whatsapp_phone', '5511999887766'),
  ('prohibited_items', 'Armas de fogo, Drogas ilicitas, Produtos falsificados, Animais vivos, Medicamentos controlados sem receita, Baterias de litio soltas (>160Wh)')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- ============================================================
-- 2. TRIPS (viagens)
-- ============================================================
INSERT INTO public.trips (id, code, traveler_name, flight_number, departure_date, arrival_date, max_weight_kg) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'T-044', 'Juliana Santos', 'AA2198', '2026-03-10', '2026-03-17', 46),
  ('a0000000-0000-0000-0000-000000000002', 'T-045', 'Marina Oliveira', 'LA8181', '2026-04-05', '2026-04-12', 46),
  ('a0000000-0000-0000-0000-000000000003', 'T-046', 'Ricardo Mendes', 'UA1522', '2026-05-01', '2026-05-08', 23),
  ('a0000000-0000-0000-0000-000000000004', 'T-047', 'Juliana Santos', 'DL445', '2026-06-15', '2026-06-22', 46)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 3. ORDERS (pedidos) - various statuses for Kanban demo
-- ============================================================

-- Order 1: NOVO (just received)
INSERT INTO public.orders (id, order_number, customer_name, customer_phone, items, status, total_amount, total_brl, total_usd, deposit_amount, estimated_weight_kg, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'PED-0001', 'Ana Carolina Silva', '5511988776655', 'iPhone 16 Pro Max 256GB, AirPods Pro 2', 'novo', 9460.52, 9460.52, 1448.00, 4730.26, 0.8, 'Cliente quer na cor Titanium Natural', '2026-02-20 10:30:00+00')
ON CONFLICT (order_number) DO NOTHING;

-- Order 2: ORCAMENTO (budget sent)
INSERT INTO public.orders (id, order_number, customer_name, customer_phone, items, status, total_amount, total_brl, total_usd, deposit_amount, estimated_weight_kg, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'PED-0002', 'Beatriz Fernandes', '5521977665544', 'Dyson Airwrap Complete, Charlotte Tilbury Pillow Talk Set', 'orcamento', 4403.52, 4403.52, 674.00, 2201.76, 1.2, 'Verificar cor do Airwrap - Fuchsia/Nickel', '2026-02-18 14:15:00+00')
ON CONFLICT (order_number) DO NOTHING;

-- Order 3: APROVADO (client approved)
INSERT INTO public.orders (id, order_number, customer_name, customer_phone, items, status, total_amount, total_brl, total_usd, deposit_amount, estimated_weight_kg, trip_id, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'PED-0003', 'Carlos Eduardo Souza', '5531966554433', 'Nike Dunk Low Panda (42), Adidas Samba OG (42), Levis 501 (34x32)', 'aprovado', 1953.27, 1953.27, 299.00, 976.64, 2.1, 'a0000000-0000-0000-0000-000000000001', 'Tamanhos confirmados pelo cliente', '2026-02-15 09:00:00+00')
ON CONFLICT (order_number) DO NOTHING;

-- Order 4: COMPRANDO (purchasing)
INSERT INTO public.orders (id, order_number, customer_name, customer_phone, items, status, total_amount, total_brl, total_usd, deposit_amount, estimated_weight_kg, trip_id, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000004', 'PED-0004', 'Daniela Martins', '5541955443322', 'MacBook Air M3 15", iPad Pro 13" M4', 'comprando', 15668.64, 15668.64, 2398.00, 7834.32, 3.5, 'a0000000-0000-0000-0000-000000000001', 'Compra no Apple Store Orlando', '2026-02-12 16:45:00+00')
ON CONFLICT (order_number) DO NOTHING;

-- Order 5: COMPRADO (purchased, waiting to ship)
INSERT INTO public.orders (id, order_number, customer_name, customer_phone, items, status, total_amount, total_brl, total_usd, deposit_amount, estimated_weight_kg, trip_id, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000005', 'PED-0005', 'Eduardo Lima', '5561944332211', 'PlayStation 5 Slim, Apple Watch Ultra 2', 'comprado', 8151.36, 8151.36, 1248.00, 4075.68, 5.0, 'a0000000-0000-0000-0000-000000000001', 'Comprado na Best Buy - nota fiscal salva', '2026-02-08 11:20:00+00')
ON CONFLICT (order_number) DO NOTHING;

-- Order 6: EM_TRANSITO (in transit)
INSERT INTO public.orders (id, order_number, customer_name, customer_phone, items, status, total_amount, total_brl, total_usd, deposit_amount, estimated_weight_kg, trip_id, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000006', 'PED-0006', 'Fernanda Costa', '5571933221100', 'Rare Beauty Soft Pinch Blush x2, Sol de Janeiro Bum Bum Cream, Fenty Beauty Foundation', 'em_transito', 891.18, 891.18, 136.00, 445.59, 0.9, 'a0000000-0000-0000-0000-000000000002', 'Viajando com Marina na LA8181', '2026-01-28 13:00:00+00')
ON CONFLICT (order_number) DO NOTHING;

-- Order 7: CHEGOU_BRASIL (arrived in Brazil)
INSERT INTO public.orders (id, order_number, customer_name, customer_phone, items, status, total_amount, total_brl, total_usd, deposit_amount, estimated_weight_kg, trip_id, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000007', 'PED-0007', 'Gabriela Almeida', '5581922110099', 'Stanley Quencher H2.0 40oz x3, Kindle Paperwhite, Yeti Rambler 26oz', 'chegou_brasil', 2220.39, 2220.39, 339.00, 1110.20, 2.8, 'a0000000-0000-0000-0000-000000000002', 'Chegou no aeroporto GRU, aguardando retirada', '2026-01-20 08:30:00+00')
ON CONFLICT (order_number) DO NOTHING;

-- Order 8: ENTREGUE (delivered)
INSERT INTO public.orders (id, order_number, customer_name, customer_phone, items, status, total_amount, total_brl, total_usd, deposit_amount, estimated_weight_kg, trip_id, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000008', 'PED-0008', 'Helena Ribeiro', '5511911009988', 'Ray-Ban Aviator Classic, Perfume Chanel N5 EDP 100ml, Dior Addict Lip Glow', 'entregue', 2208.84, 2208.84, 338.00, 1104.42, 0.7, 'a0000000-0000-0000-0000-000000000002', 'Entregue em maos na Av. Paulista', '2026-01-10 10:00:00+00')
ON CONFLICT (order_number) DO NOTHING;

-- Order 9: ENTREGUE (delivered - older)
INSERT INTO public.orders (id, order_number, customer_name, customer_phone, items, status, total_amount, total_brl, total_usd, deposit_amount, estimated_weight_kg, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000009', 'PED-0009', 'Igor Pereira', '5521900998877', 'Whey Protein Gold Standard x2, Creatina 300g x3, Vitaminas Kirkland', 'entregue', 1241.55, 1241.55, 190.00, 620.78, 4.5, 'Entregue via Sedex', '2025-12-15 15:00:00+00')
ON CONFLICT (order_number) DO NOTHING;

-- Order 10: CANCELADO (cancelled)
INSERT INTO public.orders (id, order_number, customer_name, customer_phone, items, status, total_amount, total_brl, total_usd, deposit_amount, estimated_weight_kg, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000010', 'PED-0010', 'Julia Nunes', '5531999887766', 'Nintendo Switch OLED, Jogos diversos', 'cancelado', 3264.12, 3264.12, 499.00, 1632.06, 1.5, 'Cliente cancelou por motivos pessoais. Reembolso processado.', '2026-02-01 12:00:00+00')
ON CONFLICT (order_number) DO NOTHING;

-- ============================================================
-- 4. ORDER ITEMS (itens dos pedidos)
-- ============================================================

-- PED-0001 items
INSERT INTO public.order_items (order_id, product_name, product_url, price_usd, price_brl, quantity) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'iPhone 16 Pro Max 256GB', 'https://apple.com/iphone-16-pro', 1199.00, 7832.67, 1),
  ('b0000000-0000-0000-0000-000000000001', 'AirPods Pro 2', 'https://apple.com/airpods-pro', 249.00, 1627.47, 1);

-- PED-0002 items
INSERT INTO public.order_items (order_id, product_name, product_url, price_usd, price_brl, quantity) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'Dyson Airwrap Complete', 'https://dyson.com/airwrap', 599.00, 3914.67, 1),
  ('b0000000-0000-0000-0000-000000000002', 'Charlotte Tilbury Pillow Talk Set', 'https://charlottetilbury.com', 75.00, 490.05, 1);

-- PED-0003 items
INSERT INTO public.order_items (order_id, product_name, product_url, price_usd, price_brl, quantity) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'Nike Dunk Low Panda', 'https://nike.com/dunk-low', 110.00, 718.74, 1),
  ('b0000000-0000-0000-0000-000000000003', 'Adidas Samba OG', 'https://adidas.com/samba', 120.00, 784.08, 1),
  ('b0000000-0000-0000-0000-000000000003', 'Levis 501 Original', 'https://levi.com/501', 69.00, 450.87, 1);

-- PED-0004 items
INSERT INTO public.order_items (order_id, product_name, product_url, price_usd, price_brl, quantity) VALUES
  ('b0000000-0000-0000-0000-000000000004', 'MacBook Air M3 15"', 'https://apple.com/macbook-air', 1299.00, 8485.47, 1),
  ('b0000000-0000-0000-0000-000000000004', 'iPad Pro 13" M4', 'https://apple.com/ipad-pro', 1099.00, 7181.67, 1);

-- PED-0005 items
INSERT INTO public.order_items (order_id, product_name, product_url, price_usd, price_brl, quantity) VALUES
  ('b0000000-0000-0000-0000-000000000005', 'PlayStation 5 Slim', 'https://playstation.com/ps5', 449.00, 2933.67, 1),
  ('b0000000-0000-0000-0000-000000000005', 'Apple Watch Ultra 2', 'https://apple.com/watch-ultra', 799.00, 5221.47, 1);

-- PED-0006 items
INSERT INTO public.order_items (order_id, product_name, product_url, price_usd, price_brl, quantity) VALUES
  ('b0000000-0000-0000-0000-000000000006', 'Rare Beauty Soft Pinch Blush', 'https://rarebeauty.com', 23.00, 150.28, 2),
  ('b0000000-0000-0000-0000-000000000006', 'Sol de Janeiro Bum Bum Cream', 'https://soldejaneiro.com', 48.00, 313.63, 1),
  ('b0000000-0000-0000-0000-000000000006', 'Fenty Beauty Pro Filtr Foundation', 'https://fentybeauty.com', 42.00, 274.43, 1);

-- PED-0007 items
INSERT INTO public.order_items (order_id, product_name, product_url, price_usd, price_brl, quantity) VALUES
  ('b0000000-0000-0000-0000-000000000007', 'Stanley Quencher H2.0 40oz', 'https://stanley1913.com', 45.00, 294.03, 3),
  ('b0000000-0000-0000-0000-000000000007', 'Kindle Paperwhite 11a Geracao', 'https://amazon.com/kindle', 149.00, 973.77, 1),
  ('b0000000-0000-0000-0000-000000000007', 'Yeti Rambler 26oz', 'https://yeti.com', 40.00, 261.36, 1);

-- PED-0008 items
INSERT INTO public.order_items (order_id, product_name, product_url, price_usd, price_brl, quantity) VALUES
  ('b0000000-0000-0000-0000-000000000008', 'Ray-Ban Aviator Classic', 'https://ray-ban.com', 163.00, 1065.00, 1),
  ('b0000000-0000-0000-0000-000000000008', 'Perfume Chanel N5 EDP 100ml', 'https://chanel.com', 135.00, 882.09, 1),
  ('b0000000-0000-0000-0000-000000000008', 'Dior Addict Lip Glow', 'https://dior.com', 40.00, 261.36, 1);

-- ============================================================
-- 5. ORDER EVENTS (timeline dos pedidos)
-- ============================================================

-- PED-0001 events (novo)
INSERT INTO public.order_events (order_id, status, title, description, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'novo', 'Pedido recebido', 'Pedido criado via WhatsApp. Cliente quer iPhone 16 Pro Max + AirPods Pro.', '2026-02-20 10:30:00+00');

-- PED-0003 events (aprovado - has history)
INSERT INTO public.order_events (order_id, status, title, description, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'novo', 'Pedido recebido', 'Cliente quer tenis e jeans dos EUA.', '2026-02-15 09:00:00+00'),
  ('b0000000-0000-0000-0000-000000000003', 'orcamento', 'Orcamento enviado', 'Enviado orcamento detalhado com precos e prazo. Total: R$ 1.953,27', '2026-02-15 14:00:00+00'),
  ('b0000000-0000-0000-0000-000000000003', 'aprovado', 'Cliente aprovou', 'Cliente confirmou tamanhos e aprovou orcamento. Sinal recebido via PIX.', '2026-02-16 10:00:00+00');

-- PED-0005 events (comprado - full history)
INSERT INTO public.order_events (order_id, status, title, description, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000005', 'novo', 'Pedido recebido', 'Pedido de PS5 e Apple Watch Ultra.', '2026-02-08 11:20:00+00'),
  ('b0000000-0000-0000-0000-000000000005', 'orcamento', 'Orcamento enviado', 'Total: R$ 8.151,36 (US$ 1.248,00)', '2026-02-08 15:00:00+00'),
  ('b0000000-0000-0000-0000-000000000005', 'aprovado', 'Aprovado pelo cliente', 'Sinal de 50% recebido: R$ 4.075,68', '2026-02-09 09:30:00+00'),
  ('b0000000-0000-0000-0000-000000000005', 'comprando', 'Inicio da compra', 'Indo ao Best Buy Miami para comprar os itens.', '2026-02-10 14:00:00+00'),
  ('b0000000-0000-0000-0000-000000000005', 'comprado', 'Itens comprados', 'PS5 e Apple Watch comprados na Best Buy Aventura Mall. Nota fiscal guardada.', '2026-02-10 16:30:00+00');

-- PED-0006 events (em_transito)
INSERT INTO public.order_events (order_id, status, title, description, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000006', 'novo', 'Pedido recebido', 'Pedido de maquiagens e skincare.', '2026-01-28 13:00:00+00'),
  ('b0000000-0000-0000-0000-000000000006', 'aprovado', 'Aprovado', 'Sinal recebido.', '2026-01-29 10:00:00+00'),
  ('b0000000-0000-0000-0000-000000000006', 'comprado', 'Comprado na Sephora', 'Comprado tudo na Sephora Orlando.', '2026-02-01 15:00:00+00'),
  ('b0000000-0000-0000-0000-000000000006', 'em_transito', 'Em voo para o Brasil', 'Marina embarcou no voo LA8181 com a encomenda.', '2026-02-05 22:00:00+00');

-- PED-0008 events (entregue - complete history)
INSERT INTO public.order_events (order_id, status, title, description, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000008', 'novo', 'Pedido recebido', 'Cliente quer oculos, perfume e batom.', '2026-01-10 10:00:00+00'),
  ('b0000000-0000-0000-0000-000000000008', 'orcamento', 'Orcamento enviado', 'Total calculado: R$ 2.208,84', '2026-01-10 12:00:00+00'),
  ('b0000000-0000-0000-0000-000000000008', 'aprovado', 'Aprovado com sinal', 'PIX de R$ 1.104,42 confirmado.', '2026-01-11 09:00:00+00'),
  ('b0000000-0000-0000-0000-000000000008', 'comprado', 'Itens comprados', 'Tudo comprado em Miami.', '2026-01-14 16:00:00+00'),
  ('b0000000-0000-0000-0000-000000000008', 'em_transito', 'Voo saiu de Miami', 'Embarque concluido, voo direto MIA-GRU.', '2026-01-18 20:00:00+00'),
  ('b0000000-0000-0000-0000-000000000008', 'chegou_brasil', 'Chegou no Brasil', 'Desembarcou em Guarulhos. Tudo OK na alfandega.', '2026-01-19 08:00:00+00'),
  ('b0000000-0000-0000-0000-000000000008', 'entregue', 'Entregue ao cliente', 'Entrega feita em maos na Av. Paulista. Cliente satisfeita!', '2026-01-20 14:00:00+00');

-- PED-0010 events (cancelado)
INSERT INTO public.order_events (order_id, status, title, description, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000010', 'novo', 'Pedido recebido', 'Cliente quer Nintendo Switch e jogos.', '2026-02-01 12:00:00+00'),
  ('b0000000-0000-0000-0000-000000000010', 'orcamento', 'Orcamento enviado', 'Total: R$ 3.264,12', '2026-02-01 15:00:00+00'),
  ('b0000000-0000-0000-0000-000000000010', 'cancelado', 'Pedido cancelado', 'Cliente decidiu cancelar por motivos pessoais. Reembolso total processado via PIX.', '2026-02-03 10:00:00+00');

-- ============================================================
-- 6. PAYMENTS (pagamentos)
-- ============================================================

-- PED-0003: sinal pago
INSERT INTO public.payments (order_id, type, amount, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'deposit', 976.64, 'Sinal 50% via PIX', '2026-02-16 10:00:00+00');

-- PED-0004: sinal pago
INSERT INTO public.payments (order_id, type, amount, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000004', 'deposit', 7834.32, 'Sinal 50% via PIX', '2026-02-13 09:00:00+00');

-- PED-0005: sinal + saldo
INSERT INTO public.payments (order_id, type, amount, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000005', 'deposit', 4075.68, 'Sinal 50% via PIX', '2026-02-09 09:30:00+00'),
  ('b0000000-0000-0000-0000-000000000005', 'balance', 4075.68, 'Saldo restante pago via PIX', '2026-02-10 17:00:00+00');

-- PED-0006: sinal pago
INSERT INTO public.payments (order_id, type, amount, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000006', 'deposit', 445.59, 'Sinal via PIX', '2026-01-29 10:30:00+00');

-- PED-0007: sinal + saldo
INSERT INTO public.payments (order_id, type, amount, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000007', 'deposit', 1110.20, 'Sinal 50% via PIX', '2026-01-21 11:00:00+00'),
  ('b0000000-0000-0000-0000-000000000007', 'balance', 1110.19, 'Saldo restante via PIX', '2026-02-10 09:00:00+00');

-- PED-0008: totalmente pago (sinal + saldo)
INSERT INTO public.payments (order_id, type, amount, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000008', 'deposit', 1104.42, 'Sinal 50% via PIX', '2026-01-11 09:00:00+00'),
  ('b0000000-0000-0000-0000-000000000008', 'balance', 1104.42, 'Saldo final via PIX', '2026-01-19 10:00:00+00');

-- PED-0009: totalmente pago
INSERT INTO public.payments (order_id, type, amount, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000009', 'deposit', 620.78, 'Sinal via transferencia', '2025-12-16 10:00:00+00'),
  ('b0000000-0000-0000-0000-000000000009', 'balance', 620.77, 'Saldo pago na entrega via PIX', '2025-12-22 14:00:00+00');

-- PED-0010: reembolso
INSERT INTO public.payments (order_id, type, amount, notes, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000010', 'deposit', 1632.06, 'Sinal 50% via PIX', '2026-02-02 09:00:00+00'),
  ('b0000000-0000-0000-0000-000000000010', 'refund', 1632.06, 'Reembolso total - pedido cancelado pelo cliente', '2026-02-03 11:00:00+00');

-- ============================================================
-- 7. WHATSAPP TEMPLATES (ensure they exist)
-- ============================================================
INSERT INTO public.whatsapp_templates (slug, name, title, icon, template) VALUES
  ('orcamento', 'Orcamento', 'Enviar orcamento', '💰', 'Oi {nome_cliente}! 😊

Seu orcamento do pedido *{numero_pedido}* ficou pronto!

📦 *Itens:* {itens}
💵 *Total USD:* US$ {valor_usd}
💰 *Total BRL:* R$ {valor_total}
🏷️ *Sinal (50%):* R$ {valor_sinal}

A cotacao usada foi R$ {cotacao} + {spread}% de taxa.

Confirma para eu seguir com a compra? 🛍️'),
  ('confirmacao', 'Confirmacao', 'Confirmar pedido', '✅', 'Oi {nome_cliente}! ✅

Seu pedido *{numero_pedido}* foi confirmado!

Assim que eu comprar os itens, te mando foto e nota fiscal. 📸

Obrigada pela confianca! 💜'),
  ('comprado', 'Comprado', 'Produto comprado', '🛍️', 'Oi {nome_cliente}! 🛍️

Seus itens do pedido *{numero_pedido}* foram comprados! 🎉

📦 {itens}

Vou te mandar foto dos produtos. Agora e so aguardar a viagem! ✈️'),
  ('em_transito', 'Em Transito', 'Notificar embarque', '✈️', 'Oi {nome_cliente}! ✈️

Seus produtos do pedido *{numero_pedido}* estao voando para o Brasil!

Previsao de chegada: {data_chegada} 📅

Te aviso assim que chegar! 🇧🇷'),
  ('chegou', 'Chegou no Brasil', 'Notificar chegada', '🇧🇷', 'Oi {nome_cliente}! 🇧🇷

Seus produtos do pedido *{numero_pedido}* chegaram no Brasil! 🎉

Vamos combinar a entrega? Me manda seu endereco e melhor horario. 📍

💰 *Saldo restante:* R$ {valor_saldo}'),
  ('entrega', 'Entrega', 'Agendar entrega', '🚗', 'Oi {nome_cliente}! 🚗

Sua entrega do pedido *{numero_pedido}* esta agendada!

📍 Local: {endereco}
📅 Data: {data_entrega}

Te vejo la! 😊💜')
ON CONFLICT (slug) DO NOTHING;
