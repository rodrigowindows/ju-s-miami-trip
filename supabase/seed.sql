-- Seed WhatsApp templates
insert into public.whatsapp_templates (slug, title, icon, template_text) values
  ('orcamento', 'Orcamento Enviado', '📋', 'Oi, {nome_cliente}! Ja preparei o orcamento do seu pedido #{numero_pedido}. Resumo: {itens}. Total estimado: R$ {valor_total}. Sinal: R$ {valor_sinal}. Se estiver ok, me avisa que te mando as instrucoes!'),
  ('compra', 'Compra Confirmada', '✅', 'Atualizacao do pedido #{numero_pedido}: compra feita ✅ Ja comprei seus itens! Vou te mandando fotos e a nota fiscal por aqui.'),
  ('em_viagem', 'Em Viagem', '✈', 'Boas noticias! ✈ Seu pedido #{numero_pedido} ja esta na viagem {codigo_viagem}. Proxima etapa: saida dos EUA e chegada ao Brasil.'),
  ('chegou', 'Chegou no Brasil', '🇧🇷', 'Chegou no Brasil! 🇧🇷🎉 Pedido #{numero_pedido} ja esta aqui. Agora vamos combinar entrega/retirada. Qual melhor dia e horario pra voce?'),
  ('esgotado', 'Item Esgotado', '😕', 'Oi, {nome_cliente}! O {itens} do pedido #{numero_pedido} esta esgotado na loja. Quer que eu devolva o sinal via PIX ou deixa como credito no app?'),
  ('entregue', 'Entregue', '🎉', 'Entregue! ✅ Pedido #{numero_pedido} finalizado. Obrigada pela confianca, {nome_cliente}! Se quiser, me diz o que quer trazer na proxima.')
on conflict (slug) do nothing;

-- Seed trips
insert into public.trips (code, traveler_name, flight_number, departure_date, arrival_date, max_weight_kg) values
  ('T-041', 'Juliana Santos', 'AA2198', '2026-03-10', '2026-03-17', 46),
  ('T-042', 'Juliana Santos', 'LA8181', '2026-04-05', '2026-04-12', 46),
  ('T-043', 'Marina Oliveira', 'UA1522', '2026-05-01', '2026-05-08', 23)
on conflict (code) do nothing;

-- Seed orders
insert into public.orders (order_number, customer_name, customer_phone, items, total_amount, deposit_amount, status, trip_id, estimated_weight_kg) values
  ('PED-001', 'Carlos Silva', '5511988887777', 'iPhone 15 Pro Max 256GB, AirPods Pro 2', 9500, 4750, 'confirmed', (select id from public.trips where code = 'T-041'), 0.8),
  ('PED-002', 'Ana Beatriz Costa', '5511977776666', 'MacBook Air M3 15"', 12000, 6000, 'confirmed', (select id from public.trips where code = 'T-041'), 2.1),
  ('PED-003', 'Roberto Almeida', '5511966665555', 'PS5 Slim, DualSense Controller x2', 4200, 2100, 'pending', (select id from public.trips where code = 'T-041'), 4.5),
  ('PED-004', 'Fernanda Lima', '5511955554444', 'iPad Pro 13" M4, Apple Pencil Pro', 11800, 5900, 'confirmed', (select id from public.trips where code = 'T-042'), 1.2),
  ('PED-005', 'Lucas Mendes', '5511944443333', 'Nike Air Max 90 x3, Levi''s 501 x2', 2800, 1400, 'pending', null, 3.0),
  ('PED-006', 'Patrícia Souza', '5511933332222', 'Vitaminas Kirkland x4, Proteína Whey x2', 850, 425, 'confirmed', (select id from public.trips where code = 'T-042'), 5.5)
on conflict (order_number) do nothing;

-- Seed payments
insert into public.payments (order_id, type, amount, notes) values
  ((select id from public.orders where order_number = 'PED-001'), 'deposit', 4750, 'Sinal via PIX'),
  ((select id from public.orders where order_number = 'PED-002'), 'deposit', 6000, 'Sinal via PIX'),
  ((select id from public.orders where order_number = 'PED-002'), 'balance', 6000, 'Saldo pago na entrega'),
  ((select id from public.orders where order_number = 'PED-003'), 'deposit', 2100, 'Sinal via PIX'),
  ((select id from public.orders where order_number = 'PED-004'), 'deposit', 5900, 'Sinal via transferencia'),
  ((select id from public.orders where order_number = 'PED-006'), 'deposit', 425, 'Sinal via PIX');
