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
  ('AirPods Pro 2', 'Apple', 'Tech', 249.00, 'https://images-na.ssl-images-amazon.com/images/P/B0D1XD1ZV3.01._SCLZZZZZZZ_SX400_.jpg', 'AirPods Pro de segunda geracao com cancelamento ativo de ruido, modo Transparencia adaptativo e audio personalizado espacial. Chip H2 da Apple.'),
  ('iPhone 16 Pro Max 256GB', 'Apple', 'Tech', 1199.00, 'https://images-na.ssl-images-amazon.com/images/P/B0DGHYFL8V.01._SCLZZZZZZZ_SX400_.jpg', 'O iPhone mais avancado com chip A18 Pro, camera de 48MP com zoom optico 5x, tela Super Retina XDR de 6.9" e botao de Acao.'),
  ('MacBook Air M3 15"', 'Apple', 'Tech', 1299.00, 'https://images-na.ssl-images-amazon.com/images/P/B0CX23V2ZK.01._SCLZZZZZZZ_SX400_.jpg', 'MacBook Air com chip M3, tela Liquid Retina de 15.3", 8GB RAM, 256GB SSD. Fino, leve e com bateria de ate 18 horas.'),
  ('iPad Pro 13" M4', 'Apple', 'Tech', 1099.00, 'https://images-na.ssl-images-amazon.com/images/P/B0D3J6L2ZC.01._SCLZZZZZZZ_SX400_.jpg', 'iPad Pro com chip M4, tela Ultra Retina XDR OLED de 13", Apple Pencil Pro compativel. O tablet mais poderoso do mundo.'),
  ('Apple Watch Ultra 2', 'Apple', 'Tech', 799.00, 'https://images-na.ssl-images-amazon.com/images/P/B0CHX4JGWL.01._SCLZZZZZZZ_SX400_.jpg', 'Apple Watch Ultra 2 com caixa de titanio de 49mm, GPS + Cellular, tela mais brilhante ate 3000 nits.'),
  ('PlayStation 5 Slim', 'Sony', 'Tech', 549.99, 'https://images-na.ssl-images-amazon.com/images/P/B0CL61F39H.01._SCLZZZZZZZ_SX400_.jpg', 'PS5 Slim com leitor de disco, 1TB SSD, controle DualSense. 30% menor que o modelo original.'),
  ('Nintendo Switch OLED', 'Nintendo', 'Tech', 349.00, 'https://images-na.ssl-images-amazon.com/images/P/B098RL6SBJ.01._SCLZZZZZZZ_SX400_.jpg', 'Nintendo Switch modelo OLED com tela de 7", stand ajustavel, 64GB armazenamento e audio aprimorado.'),
  ('iPhone 16 Pro Case MagSafe', 'Apple', 'Tech', 49.00, 'https://images-na.ssl-images-amazon.com/images/P/B0DGHQYR6X.01._SCLZZZZZZZ_SX400_.jpg', 'Case de silicone com MagSafe para iPhone 16 Pro. Protecao premium com toque aveludado em varias cores.')
ON CONFLICT DO NOTHING;

-- Beauty
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Perfume Chanel N5 EDP 100ml', 'Chanel', 'Beauty', 135.00, 'https://images-na.ssl-images-amazon.com/images/P/B000BY03SE.01._SCLZZZZZZZ_SX400_.jpg', 'Eau de Parfum 100ml. O perfume mais iconico do mundo, com notas de ylang-ylang, rosa, jasmin e sandalo.'),
  ('Rare Beauty Soft Pinch Blush', 'Rare Beauty', 'Beauty', 23.00, 'https://images-na.ssl-images-amazon.com/images/P/B09X44YCJM.01._SCLZZZZZZZ_SX400_.jpg', 'Soft Pinch Liquid Blush da marca da Selena Gomez. Formula leve e ultra-pigmentada que dura o dia todo. Viral no TikTok.'),
  ('Dyson Airwrap Complete', 'Dyson', 'Beauty', 599.00, 'https://images-na.ssl-images-amazon.com/images/P/B0CFDJQY35.01._SCLZZZZZZZ_SX400_.jpg', 'Modelador Dyson Airwrap com tecnologia Coanda. Seca, modela e alisa sem calor extremo. Kit completo com 6 acessorios.'),
  ('Charlotte Tilbury Pillow Talk Set', 'Charlotte Tilbury', 'Beauty', 75.00, 'https://images-na.ssl-images-amazon.com/images/P/B00K6JUG4K.01._SCLZZZZZZZ_SX400_.jpg', 'Kit iconica Pillow Talk: batom + delineador labial na cor mais vendida do mundo. Tom nude-rosa perfeito.'),
  ('Sol de Janeiro Bum Bum Cream', 'Sol de Janeiro', 'Beauty', 48.00, 'https://images-na.ssl-images-amazon.com/images/P/B00MW55V16.01._SCLZZZZZZZ_SX400_.jpg', 'Brazilian Bum Bum Cream 240ml. Creme corporal com cupuacu, acai e oleo de coco. Fragrancia cheirinho de Brasil.'),
  ('Dior Addict Lip Glow', 'Dior', 'Beauty', 40.00, 'https://images-na.ssl-images-amazon.com/images/P/B00K6JUG4K.01._SCLZZZZZZZ_SX400_.jpg', 'Batom hidratante que realca a cor natural dos labios. 97% ingredientes naturais. Efeito gloss natural.'),
  ('Fenty Beauty Pro Filtr Foundation', 'Fenty Beauty', 'Beauty', 42.00, 'https://images-na.ssl-images-amazon.com/images/P/B0BN1ZLCK8.01._SCLZZZZZZZ_SX400_.jpg', 'Base Pro Filtr Soft Matte da Rihanna. 50 tons disponiveis. Cobertura media a total, longa duracao, acabamento matte.')
ON CONFLICT DO NOTHING;

-- Fashion
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Nike Dunk Low Panda', 'Nike', 'Fashion', 110.00, 'https://images-na.ssl-images-amazon.com/images/P/B002QYW4WO.01._SCLZZZZZZZ_SX400_.jpg', 'O classico Nike Dunk Low na iconica colorway preto e branco "Panda". Couro premium, sola vulcanizada.'),
  ('Nike Air Force 1 07', 'Nike', 'Fashion', 115.00, 'https://images-na.ssl-images-amazon.com/images/P/B07FKR48JQ.01._SCLZZZZZZZ_SX400_.jpg', 'O classico dos classicos. Air Force 1 todo branco em couro premium. Solado Air visivel para conforto o dia todo.'),
  ('New Balance 550', 'New Balance', 'Fashion', 130.00, 'https://images-na.ssl-images-amazon.com/images/P/B09BQHG66W.01._SCLZZZZZZZ_SX400_.jpg', 'New Balance 550 retro basketball. Couro premium, sola ENCAP para amortecimento. O tenis favorito das fashionistas.'),
  ('Adidas Samba OG', 'Adidas', 'Fashion', 120.00, 'https://images-na.ssl-images-amazon.com/images/P/B00F3L8MIA.01._SCLZZZZZZZ_SX400_.jpg', 'Adidas Samba OG classico com upper em couro, sola em borracha gum e as 3 listras iconicas. Tendencia absoluta.'),
  ('Levis 501 Original', 'Levis', 'Fashion', 69.50, 'https://images-na.ssl-images-amazon.com/images/P/B005FUIZMQ.01._SCLZZZZZZZ_SX400_.jpg', 'O jeans original desde 1873. Fit reto classico, 100% algodao, lavagem media. Um icone da moda americana.'),
  ('Ray-Ban Aviator Classic', 'Ray-Ban', 'Fashion', 163.00, 'https://images-na.ssl-images-amazon.com/images/P/B001UQ71GS.01._SCLZZZZZZZ_SX400_.jpg', 'Oculos Ray-Ban Aviator Classic com armacao dourada e lentes verdes G-15. Protecao UV400. O oculos mais iconico.')
ON CONFLICT DO NOTHING;

-- Lifestyle
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Stanley Quencher H2.0 40oz', 'Stanley', 'Lifestyle', 45.00, 'https://images-na.ssl-images-amazon.com/images/P/B0CX5SMM84.01._SCLZZZZZZZ_SX400_.jpg', 'Copo termico Quencher H2.0 de 40oz (1.18L). Mantem gelado 11h e quente 7h. Fenomeno viral. Varias cores.'),
  ('Kindle Paperwhite 11a Geracao', 'Amazon', 'Lifestyle', 149.99, 'https://images-na.ssl-images-amazon.com/images/P/B09TMN58KL.01._SCLZZZZZZZ_SX400_.jpg', 'Kindle Paperwhite com tela de 6.8", luz quente ajustavel, 16GB, a prova dagua IPX8. Bateria de ate 10 semanas.'),
  ('Bath & Body Works Candle 3-Wick', 'Bath & Body Works', 'Lifestyle', 26.00, 'https://images-na.ssl-images-amazon.com/images/P/B00A8FEXNQ.01._SCLZZZZZZZ_SX400_.jpg', 'Vela aromatica de 3 pavios, 411g. Duracao de 25-45h. Fragancias exclusivas que voce nao encontra no Brasil.'),
  ('Vitaminas Kirkland Daily Multi', 'Kirkland', 'Lifestyle', 25.00, 'https://images-na.ssl-images-amazon.com/images/P/B00MB17GPU.01._SCLZZZZZZZ_SX400_.jpg', 'Multivitaminico diario com 500 comprimidos. Vitaminas A, C, D, E, complexo B e minerais essenciais.'),
  ('Whey Protein Gold Standard', 'Optimum Nutrition', 'Lifestyle', 35.00, 'https://images-na.ssl-images-amazon.com/images/P/B00K6JUG4K.01._SCLZZZZZZZ_SX400_.jpg', 'Whey Protein Isolate Gold Standard 2lb. 24g proteina por dose. Sabor Double Rich Chocolate.'),
  ('Yeti Rambler 26oz', 'Yeti', 'Lifestyle', 40.00, 'https://images-na.ssl-images-amazon.com/images/P/B00K6JUG4K.01._SCLZZZZZZZ_SX400_.jpg', 'Garrafa termica Yeti Rambler de 26oz (769ml) em aco inoxidavel. Isolamento a vacuo de parede dupla.'),
  ('Creatina Monohidratada 300g', 'Optimum Nutrition', 'Lifestyle', 30.00, 'https://images-na.ssl-images-amazon.com/images/P/B00K6JUG4K.01._SCLZZZZZZZ_SX400_.jpg', 'Creatina Monohidratada micronizada 300g (60 doses). Sem sabor, dissolve facil. Suplemento #1 para performance.')
ON CONFLICT DO NOTHING;

-- Apple Acessorios
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('AirTag 4-Pack', 'Apple', 'Tech', 79.00, 'https://images-na.ssl-images-amazon.com/images/P/B0D54JZTHY.01._SCLZZZZZZZ_SX400_.jpg', 'Pack com 4 AirTags Apple. Rastreie chaves, carteira, mochila e mala com precisao via rede Buscar.'),
  ('Apple Pencil Pro', 'Apple', 'Tech', 129.00, 'https://images-na.ssl-images-amazon.com/images/P/B0D3J71RM7.01._SCLZZZZZZZ_SX400_.jpg', 'Apple Pencil Pro com sensor de aperto, feedback haptico e busca via Buscar.'),
  ('Carregador MagSafe Apple', 'Apple', 'Tech', 39.00, 'https://images-na.ssl-images-amazon.com/images/P/B08L5NP6NG.01._SCLZZZZZZZ_SX400_.jpg', 'Carregador sem fio MagSafe para iPhone. Alinhamento magnetico perfeito, carregamento rapido 15W.'),
  ('Apple Watch SE 44mm', 'Apple', 'Tech', 279.00, 'https://images-na.ssl-images-amazon.com/images/P/B0DGJ2NM9S.01._SCLZZZZZZZ_SX400_.jpg', 'Apple Watch SE 2a geracao 44mm GPS. Chip S8, deteccao de colisao, monitoramento de saude.'),
  ('Magic Keyboard iPad Pro', 'Apple', 'Tech', 299.00, 'https://images-na.ssl-images-amazon.com/images/P/B0D3J65R9N.01._SCLZZZZZZZ_SX400_.jpg', 'Magic Keyboard para iPad Pro com trackpad e teclado retroiluminado.'),
  ('AirPods Max USB-C', 'Apple', 'Tech', 549.00, 'https://images-na.ssl-images-amazon.com/images/P/B0DGJC52FP.01._SCLZZZZZZZ_SX400_.jpg', 'Fone over-ear AirPods Max com cancelamento de ruido e audio espacial. Agora com USB-C.')
ON CONFLICT DO NOTHING;

-- Kids & Brinquedos
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('LEGO Star Wars Millennium Falcon', 'LEGO', 'Kids', 159.99, 'https://images-na.ssl-images-amazon.com/images/P/B0CGY3ZB24.01._SCLZZZZZZZ_SX400_.jpg', 'LEGO Star Wars Millennium Falcon 1351 pecas com minifiguras.'),
  ('LEGO Technic Ferrari Daytona', 'LEGO', 'Kids', 449.99, 'https://images-na.ssl-images-amazon.com/images/P/B09XVMSWJC.01._SCLZZZZZZZ_SX400_.jpg', 'LEGO Technic Ferrari Daytona SP3 3778 pecas.'),
  ('Barbie Dreamhouse 2024', 'Barbie', 'Kids', 99.99, 'https://images-na.ssl-images-amazon.com/images/P/B0BLJTJ38M.01._SCLZZZZZZZ_SX400_.jpg', 'Casa dos Sonhos Barbie 3 andares com piscina e 75+ acessorios.'),
  ('Hot Wheels Ultimate Garage', 'Hot Wheels', 'Kids', 89.99, 'https://images-na.ssl-images-amazon.com/images/P/B0BN15NTGG.01._SCLZZZZZZZ_SX400_.jpg', 'Garagem Ultimate Hot Wheels para 100+ carrinhos.'),
  ('Squishmallows 16" Cam the Cat', 'Squishmallows', 'Kids', 24.99, 'https://images-na.ssl-images-amazon.com/images/P/B091Q5P1W5.01._SCLZZZZZZZ_SX400_.jpg', 'Pelucia Squishmallows 16 polegadas super macia.'),
  ('Baby Alive Grows Up', 'Hasbro', 'Kids', 34.99, 'https://images-na.ssl-images-amazon.com/images/P/B08Y4R4KXM.01._SCLZZZZZZZ_SX400_.jpg', 'Baby Alive que cresce de verdade com fases.'),
  ('Carrinho Graco Modes Pramette', 'Graco', 'Kids', 249.99, 'https://images-na.ssl-images-amazon.com/images/P/B07Y5X8G4B.01._SCLZZZZZZZ_SX400_.jpg', 'Carrinho de bebe 3-em-1. Converte de moises para assento reversivel.'),
  ('Kit Mamadeiras Dr. Browns 9pc', 'Dr. Browns', 'Kids', 39.99, 'https://images-na.ssl-images-amazon.com/images/P/B0BJGXGGT2.01._SCLZZZZZZZ_SX400_.jpg', 'Kit anti-colica com 9 pecas e sistema de ventilacao interno.'),
  ('Roupinhas Carters 5-Pack', 'Carters', 'Kids', 19.99, 'https://images-na.ssl-images-amazon.com/images/P/B07KSMFVLP.01._SCLZZZZZZZ_SX400_.jpg', 'Pack 5 bodies Carters algodao 100%. Estampas variadas.')
ON CONFLICT DO NOTHING;

-- Roupas de Marca
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Polo Ralph Lauren Classic Fit', 'Ralph Lauren', 'Fashion', 98.00, 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg', 'Polo Classic Fit algodao pique com logo icônico bordado.'),
  ('Tommy Hilfiger Polo Essential', 'Tommy Hilfiger', 'Fashion', 69.50, 'https://images-na.ssl-images-amazon.com/images/P/B07BHJM8P2.01._SCLZZZZZZZ_SX400_.jpg', 'Polo 1985 Essential algodao organico com bandeirinha bordada.'),
  ('Calvin Klein Cueca Boxer 3-Pack', 'Calvin Klein', 'Fashion', 34.99, 'https://images-na.ssl-images-amazon.com/images/P/B003XGVUDI.01._SCLZZZZZZZ_SX400_.jpg', '3 cuecas boxer com elastico icônico CK. Algodao stretch.'),
  ('Under Armour Tech 2.0 Dry-Fit', 'Under Armour', 'Fashion', 30.00, 'https://images-na.ssl-images-amazon.com/images/P/B07BKSMFCM.01._SCLZZZZZZZ_SX400_.jpg', 'Camiseta UA Tech 2.0 que seca ultra rapido. Anti-odor.'),
  ('Gap Logo Hoodie Fleece', 'Gap', 'Fashion', 44.99, 'https://images-na.ssl-images-amazon.com/images/P/B0CHTWZTNQ.01._SCLZZZZZZZ_SX400_.jpg', 'Moletom Gap fleece com capuz e logo classico.'),
  ('Champion Reverse Weave Moletom', 'Champion', 'Fashion', 39.99, 'https://images-na.ssl-images-amazon.com/images/P/B00B8AQFHG.01._SCLZZZZZZZ_SX400_.jpg', 'Moletom Reverse Weave classico heavyweight que nao encolhe.'),
  ('The North Face Nuptse 700 Vest', 'The North Face', 'Fashion', 179.00, 'https://images-na.ssl-images-amazon.com/images/P/B0BF57X2R6.01._SCLZZZZZZZ_SX400_.jpg', 'Colete puffer Nuptse 700-fill. Leve, quente e compactavel.')
ON CONFLICT DO NOTHING;

-- Suplementos & Vitaminas
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Colágeno Vital Proteins 284g', 'Vital Proteins', 'Health', 27.00, 'https://images-na.ssl-images-amazon.com/images/P/B08PVL78G8.01._SCLZZZZZZZ_SX400_.jpg', 'Colageno peptideo sem sabor 284g. 20g por dose.'),
  ('Melatonina 10mg 300 Caps', 'Kirkland', 'Health', 11.99, 'https://images-na.ssl-images-amazon.com/images/P/B00MB17GPU.01._SCLZZZZZZZ_SX400_.jpg', 'Melatonina 10mg Kirkland 300 capsulas dissolucao rapida.'),
  ('Biotina 10.000mcg 250 Caps', 'Kirkland', 'Health', 9.99, 'https://images-na.ssl-images-amazon.com/images/P/B07BLP94ZL.01._SCLZZZZZZZ_SX400_.jpg', 'Biotina 10.000mcg para cabelo, pele e unhas.'),
  ('Centrum Mulher 200 Caps', 'Centrum', 'Health', 17.99, 'https://images-na.ssl-images-amazon.com/images/P/B00MB17GPU.01._SCLZZZZZZZ_SX400_.jpg', 'Multivitaminico Centrum Women 200 gomas.'),
  ('Ashwagandha 600mg 180 Caps', 'Kirkland', 'Health', 11.99, 'https://images-na.ssl-images-amazon.com/images/P/B078K3JYY3.01._SCLZZZZZZZ_SX400_.jpg', 'Ashwagandha KSM-66 para estresse e energia.'),
  ('Omega-3 Fish Oil 1000mg 400 Caps', 'Kirkland', 'Health', 14.99, 'https://images-na.ssl-images-amazon.com/images/P/B004O2I9JO.01._SCLZZZZZZZ_SX400_.jpg', 'Omega-3 400 softgels EPA/DHA para saude do coracao.'),
  ('Vitamina D3 5000 IU 600 Caps', 'Kirkland', 'Health', 12.49, 'https://images-na.ssl-images-amazon.com/images/P/B00MB17GPU.01._SCLZZZZZZZ_SX400_.jpg', 'Vitamina D3 5000 IU 600 caps. Suprimento para 1 ano+.')
ON CONFLICT DO NOTHING;

-- Audio & Eletronicos
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('JBL Charge 5', 'JBL', 'Tech', 179.95, 'https://images-na.ssl-images-amazon.com/images/P/B09CYL3HRF.01._SCLZZZZZZZ_SX400_.jpg', 'Caixa de som JBL Charge 5 com 20h bateria e IP67.'),
  ('JBL Flip 6', 'JBL', 'Tech', 129.95, 'https://images-na.ssl-images-amazon.com/images/P/B09CYL3HRF.01._SCLZZZZZZZ_SX400_.jpg', 'Caixa de som JBL Flip 6 portatil IP67, 12h bateria.'),
  ('Bose QuietComfort Ultra', 'Bose', 'Tech', 429.00, 'https://images-na.ssl-images-amazon.com/images/P/B0CCZ1L489.01._SCLZZZZZZZ_SX400_.jpg', 'Fone Bose QC Ultra com cancelamento de ruido imbativel.'),
  ('Beats Studio Pro', 'Beats', 'Tech', 349.99, 'https://images-na.ssl-images-amazon.com/images/P/B0CCZ1L489.01._SCLZZZZZZZ_SX400_.jpg', 'Fone Beats Studio Pro com cancelamento ativo e chip Apple.'),
  ('Echo Dot 5a Geracao', 'Amazon', 'Tech', 49.99, 'https://images-na.ssl-images-amazon.com/images/P/B09B8V1LZ3.01._SCLZZZZZZZ_SX400_.jpg', 'Echo Dot com Alexa, sensor de temperatura e som melhorado.'),
  ('GoPro Hero 13 Black', 'GoPro', 'Tech', 399.99, 'https://images-na.ssl-images-amazon.com/images/P/B0DBMV1JYH.01._SCLZZZZZZZ_SX400_.jpg', 'Camera de acao GoPro Hero 13 Black 5.3K60 com HyperSmooth 6.0.')
ON CONFLICT DO NOTHING;

-- Bath & Body Works extras
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('BBW Japanese Cherry Blossom Mist', 'Bath & Body Works', 'Lifestyle', 16.95, 'https://images-na.ssl-images-amazon.com/images/P/B00B5HWXGO.01._SCLZZZZZZZ_SX400_.jpg', 'Fine Fragrance Mist 236ml. A fragrancia #1 mais vendida da BBW.'),
  ('BBW A Thousand Wishes Cream', 'Bath & Body Works', 'Lifestyle', 16.95, 'https://images-na.ssl-images-amazon.com/images/P/B00MW55V16.01._SCLZZZZZZZ_SX400_.jpg', 'Body Cream 226g ultra hidratante com manteiga de karite.'),
  ('BBW Eucalyptus Spearmint Candle', 'Bath & Body Works', 'Lifestyle', 26.50, 'https://images-na.ssl-images-amazon.com/images/P/B00A8FEXNQ.01._SCLZZZZZZZ_SX400_.jpg', 'Vela 3 pavios Aromaterapia Stress Relief 411g.'),
  ('BBW Wallflower Refill 2-Pack', 'Bath & Body Works', 'Lifestyle', 12.95, 'https://images-na.ssl-images-amazon.com/images/P/B078NBN5S7.01._SCLZZZZZZZ_SX400_.jpg', 'Refil aromatizador Wallflower 2 unidades. Ate 60 dias de fragrancia.'),
  ('BBW Gift Set Champagne Toast', 'Bath & Body Works', 'Lifestyle', 39.95, 'https://images-na.ssl-images-amazon.com/images/P/B08PVL78G8.01._SCLZZZZZZZ_SX400_.jpg', 'Kit presente: body mist + cream + shower gel. Embalagem inclusa.')
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
