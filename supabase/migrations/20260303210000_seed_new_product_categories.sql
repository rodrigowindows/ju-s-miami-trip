-- ══════════════════════════════════════════════════════════════
-- Novos blocos de produtos: Apple Acessórios, Kids, Baby,
-- Roupas de Marca, Suplementos, Áudio/Eletrônicos, Bath & Body Works
-- ══════════════════════════════════════════════════════════════

-- ─── APPLE ACESSÓRIOS (Tech) ──────────────────────────────────
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
  ('AirTag 4-Pack', 'Apple', 'Tech', 79.00,
   'https://images.unsplash.com/photo-1625480860249-be231806e6ed?w=400&h=400&fit=crop',
   'Pack com 4 AirTags Apple. Rastreie chaves, carteira, mochila e mala com precisao via rede Buscar. Bateria de 1 ano.', true),

  ('Apple Pencil Pro', 'Apple', 'Tech', 129.00,
   'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop',
   'Apple Pencil Pro com sensor de aperto, feedback haptico, busca via Buscar e suporte a pairar. Compativel com iPad Pro M4.', true),

  ('Carregador MagSafe Apple', 'Apple', 'Tech', 39.00,
   'https://images.unsplash.com/photo-1622782914767-404fb9ab3f57?w=400&h=400&fit=crop',
   'Carregador sem fio MagSafe para iPhone 12 ao 16. Alinhamento magnetico perfeito, carregamento rapido de ate 15W.', true),

  ('Apple Watch SE 44mm', 'Apple', 'Tech', 279.00,
   'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
   'Apple Watch SE 2a geracao 44mm GPS. Chip S8, deteccao de colisao, monitoramento de saude. Perfeito para iniciar no Apple Watch.', true),

  ('Magic Keyboard iPad Pro', 'Apple', 'Tech', 299.00,
   'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
   'Magic Keyboard para iPad Pro com trackpad, teclado retroiluminado e porta USB-C. Transforma o iPad em notebook.', true),

  ('AirPods Max USB-C', 'Apple', 'Tech', 549.00,
   'https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=400&h=400&fit=crop',
   'Fone over-ear Apple AirPods Max com cancelamento ativo de ruido, audio espacial e ate 20h de bateria. Agora com USB-C.', true)
ON CONFLICT DO NOTHING;

-- ─── KIDS & BRINQUEDOS ──────────────────────────────────────
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
  ('LEGO Star Wars Millennium Falcon', 'LEGO', 'Kids', 159.99,
   'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop',
   'LEGO Star Wars Millennium Falcon com 1351 pecas. Inclui minifiguras de Han Solo, Chewbacca, Lando e mais. Idade 9+.', true),

  ('LEGO Technic Ferrari Daytona', 'LEGO', 'Kids', 449.99,
   'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=400&h=400&fit=crop',
   'LEGO Technic Ferrari Daytona SP3 com 3778 pecas. Replica detalhada com portas borboleta e motor V12. Idade 18+.', true),

  ('Barbie Dreamhouse 2024', 'Barbie', 'Kids', 99.99,
   'https://images.unsplash.com/photo-1613682988402-9c3e4c2e8d8b?w=400&h=400&fit=crop',
   'Casa dos Sonhos da Barbie com 3 andares, piscina com escorregador, elevador e mais de 75 acessorios. Sucesso absoluto!', true),

  ('Hot Wheels Ultimate Garage', 'Hot Wheels', 'Kids', 89.99,
   'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop',
   'Garagem Ultimate Hot Wheels com vaga para 100+ carrinhos, pista em espiral, elevador e gorila mecanico. Idade 5+.', true),

  ('Squishmallows 16" Cam the Cat', 'Squishmallows', 'Kids', 24.99,
   'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400&h=400&fit=crop',
   'Pelucia Squishmallows de 16 polegadas super macia. Cam the Cat - uma das mais populares. Perfeita para abracar!', true),

  ('Play-Doh Kitchen Creations', 'Play-Doh', 'Kids', 24.99,
   'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop',
   'Kit Play-Doh Kitchen Creations Ultimate Ice Cream Truck com 27 acessorios e 12 potes de massinha. Idade 3+.', true),

  ('Baby Alive Grows Up', 'Hasbro', 'Kids', 34.99,
   'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
   'Baby Alive que cresce de verdade! De bebe para crianca com fases de crescimento, fala e acessorios. Idade 3+.', true),

  ('Nerf Elite 2.0 Eaglepoint', 'Nerf', 'Kids', 39.99,
   'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop',
   'Lançador Nerf Elite 2.0 Eaglepoint com mira destacavel, 8 dardos e alcance de ate 27 metros. Idade 8+.', true)
ON CONFLICT DO NOTHING;

-- ─── BABY & BEBÊ (Kids category) ─────────────────────────────
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
  ('Carrinho Graco Modes Pramette', 'Graco', 'Kids', 249.99,
   'https://images.unsplash.com/photo-1590693563776-79e6b606a642?w=400&h=400&fit=crop',
   'Carrinho de bebe Graco Modes Pramette 3-em-1. Converte de moises para assento reversivel. Compativel com bebe conforto.', true),

  ('Cadeirinha Graco 4Ever DLX', 'Graco', 'Kids', 299.99,
   'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop',
   'Cadeirinha auto Graco 4Ever DLX 4-em-1. De bebe ate crianca de 10 anos. Instalacao LATCH facil. Nota maxima em seguranca.', true),

  ('Kit Mamadeiras Dr. Browns 9pc', 'Dr. Browns', 'Kids', 39.99,
   'https://images.unsplash.com/photo-1584839404210-0a41e4791460?w=400&h=400&fit=crop',
   'Kit Dr. Browns Options+ com 9 pecas: 4 mamadeiras anti-colica, escovas e bicos extras. Sistema de ventilacao interno.', true),

  ('Roupinhas Carters 5-Pack', 'Carters', 'Kids', 19.99,
   'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=400&fit=crop',
   'Pack com 5 bodies Carters de algodao 100%. Estampas variadas, botoes de pressao, super macias para o bebe.', true),

  ('Kit Alimentacao Munchkin 12pc', 'Munchkin', 'Kids', 24.99,
   'https://images.unsplash.com/photo-1590005354167-6da97870c757?w=400&h=400&fit=crop',
   'Kit Munchkin com 12 pecas: pratos com ventosa, colheres coloridas, copos anti-derrame. Livre de BPA.', true)
ON CONFLICT DO NOTHING;

-- ─── BATH & BODY WORKS (Lifestyle) ───────────────────────────
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
  ('BBW Japanese Cherry Blossom Mist', 'Bath & Body Works', 'Lifestyle', 16.95,
   'https://images.unsplash.com/photo-1594035910387-fea081dc9b3c?w=400&h=400&fit=crop',
   'Fine Fragrance Mist Japanese Cherry Blossom 236ml. A fragrancia #1 mais vendida da Bath & Body Works no mundo.', true),

  ('BBW A Thousand Wishes Cream', 'Bath & Body Works', 'Lifestyle', 16.95,
   'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
   'Body Cream A Thousand Wishes 226g. Creme ultra hidratante com manteiga de karite e vitamina E. Fragrancia festiva.', true),

  ('BBW Eucalyptus Spearmint Candle', 'Bath & Body Works', 'Lifestyle', 26.50,
   'https://images.unsplash.com/photo-1602607616524-9d05c1eeb148?w=400&h=400&fit=crop',
   'Vela 3 pavios Eucalyptus Spearmint 411g. Aromaterapia Stress Relief. Duracao de 25-45 horas. Sucesso absoluto!', true),

  ('BBW Wallflower Refill 2-Pack', 'Bath & Body Works', 'Lifestyle', 12.95,
   'https://images.unsplash.com/photo-1602607616524-9d05c1eeb148?w=400&h=400&fit=crop',
   'Refil Wallflower Fragrance Pack com 2 unidades. Aromatizador de ambiente continuo por ate 60 dias. Varias fragancias.', true),

  ('BBW Gift Set Champagne Toast', 'Bath & Body Works', 'Lifestyle', 39.95,
   'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
   'Kit presente Champagne Toast: body mist + body cream + shower gel. Embalagem de presente inclusa. Perfeito para dar de gift.', true),

  ('BBW Gentle Foaming Hand Soap', 'Bath & Body Works', 'Lifestyle', 8.50,
   'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&h=400&fit=crop',
   'Sabonete espuma para maos Kitchen Lemon 259ml. Formula suave com oleos essenciais. O sabonete mais gostoso que existe!', true)
ON CONFLICT DO NOTHING;

-- ─── ROUPAS DE MARCA (Fashion) ───────────────────────────────
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
  ('Polo Ralph Lauren Classic Fit', 'Ralph Lauren', 'Fashion', 98.00,
   'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop',
   'Polo Ralph Lauren Classic Fit em algodao pique. Logo icônico bordado. Disponivel em varias cores. O basico mais desejado.', true),

  ('Tommy Hilfiger Polo Essential', 'Tommy Hilfiger', 'Fashion', 69.50,
   'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
   'Polo Tommy Hilfiger 1985 Essential em algodao organico. Corte regular, bandeirinha icônica bordada. Estilo classico americano.', true),

  ('Calvin Klein Cueca Boxer 3-Pack', 'Calvin Klein', 'Fashion', 34.99,
   'https://images.unsplash.com/photo-1584208124218-80b342a00e29?w=400&h=400&fit=crop',
   'Pack com 3 cuecas boxer Calvin Klein com elastico icônico da marca. Algodao stretch confortavel. Preto, cinza e branco.', true),

  ('Under Armour Tech 2.0 Dry-Fit', 'Under Armour', 'Fashion', 30.00,
   'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop',
   'Camiseta Under Armour Tech 2.0 com tecido UA Tech que seca ultra rapido. Anti-odor, leve e respiravel. Ideal para treino.', true),

  ('Gap Logo Hoodie Fleece', 'Gap', 'Fashion', 44.99,
   'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
   'Moletom Gap com capuz em fleece macio. Logo classico Gap Arch no peito. Bolso canguru. Conforto americano.', true),

  ('Champion Reverse Weave Moletom', 'Champion', 'Fashion', 39.99,
   'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=400&fit=crop',
   'Moletom Champion Reverse Weave classico com logo C bordado. Algodao heavyweight premium que nao encolhe. Icone streetwear.', true),

  ('Lacoste Polo L.12.12 Classic', 'Lacoste', 'Fashion', 89.50,
   'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop',
   'Polo Lacoste L.12.12 original em petit pique. O classico desde 1933. Crocodilo bordado, corte regular.', true),

  ('The North Face Nuptse 700 Vest', 'The North Face', 'Fashion', 179.00,
   'https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400&h=400&fit=crop',
   'Colete puffer The North Face Nuptse com enchimento de pluma 700-fill. Leve, quente e compactavel. Essencial para frio.', true)
ON CONFLICT DO NOTHING;

-- ─── SUPLEMENTOS & VITAMINAS (Health) ────────────────────────
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
  ('Colágeno Vital Proteins 284g', 'Vital Proteins', 'Health', 27.00,
   'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
   'Colageno peptideo Vital Proteins Original sem sabor 284g. 20g de colageno por dose. Aprovado por Jennifer Aniston.', true),

  ('Melatonina 10mg 300 Caps', 'Kirkland', 'Health', 11.99,
   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
   'Melatonina Kirkland 10mg com 300 capsulas. Dissolucao rapida para melhor absorcao. Auxilia no sono.', true),

  ('Biotina 10.000mcg 250 Caps', 'Kirkland', 'Health', 9.99,
   'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop',
   'Biotina Kirkland 10.000mcg com 250 capsulas. Vitamina para cabelo, pele e unhas. Suplemento mais vendido nos EUA.', true),

  ('Centrum Mulher 200 Caps', 'Centrum', 'Health', 17.99,
   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
   'Multivitaminico Centrum Multigummies Women com 200 gomas. Vitaminas A, C, D, E, zinco e biotina. Facil de tomar.', true),

  ('Ashwagandha 600mg 180 Caps', 'Kirkland', 'Health', 11.99,
   'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop',
   'Ashwagandha Kirkland 600mg com 180 capsulas. Adaptogeno para estresse, energia e foco. Raiz KSM-66 patenteada.', true),

  ('Glucosamina 1500mg 220 Tabs', 'Kirkland', 'Health', 19.99,
   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
   'Glucosamina + Condroitina Kirkland 220 comprimidos. Saude articular completa. Mais vendido do Costco.', true),

  ('Omega-3 Fish Oil 1000mg 400 Caps', 'Kirkland', 'Health', 14.99,
   'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop',
   'Omega-3 Kirkland Fish Oil 1000mg com 400 softgels. EPA/DHA para saude do coracao e cerebro. Valor imbativel.', true),

  ('Vitamina D3 5000 IU 600 Caps', 'Kirkland', 'Health', 12.49,
   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
   'Vitamina D3 Kirkland 5000 IU com 600 capsulas. Essencial para imunidade, ossos e humor. Suprimento para 1 ano+.', true)
ON CONFLICT DO NOTHING;

-- ─── ÁUDIO & ELETRÔNICOS (Tech) ──────────────────────────────
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
  ('JBL Charge 5', 'JBL', 'Tech', 179.95,
   'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
   'Caixa de som portatil JBL Charge 5 com 20h de bateria, IP67 a prova dagua, powerbank integrado. Som JBL Original Bass.', true),

  ('JBL Flip 6', 'JBL', 'Tech', 129.95,
   'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
   'Caixa de som JBL Flip 6 portatil com IP67, 12h bateria e radiador de graves. Compacta e potente. Bluetooth 5.1.', true),

  ('Bose QuietComfort Ultra', 'Bose', 'Tech', 429.00,
   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
   'Fone Bose QuietComfort Ultra Headphones com cancelamento de ruido imbativel, audio espacial imersivo e ate 24h de bateria.', true),

  ('Beats Studio Pro', 'Beats', 'Tech', 349.99,
   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
   'Fone Beats Studio Pro com cancelamento ativo, audio espacial, chip Apple e ate 40h de bateria. USB-C e compativel Android/iOS.', true),

  ('Echo Dot 5a Geracao', 'Amazon', 'Tech', 49.99,
   'https://images.unsplash.com/photo-1543512214-318228f8e9c8?w=400&h=400&fit=crop',
   'Echo Dot 5a geracao com Alexa. Alto-falante inteligente com som melhorado, sensor de temperatura e design compacto.', true),

  ('GoPro Hero 13 Black', 'GoPro', 'Tech', 399.99,
   'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
   'Camera de acao GoPro Hero 13 Black com video 5.3K60, HyperSmooth 6.0, GPS integrado e bateria Enduro de longa duracao.', true)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- RESUMO: +47 novos produtos adicionados
-- ✅ 6 Apple Acessórios (Tech)
-- ✅ 8 Kids & Brinquedos (Kids)
-- ✅ 5 Baby & Bebê (Kids)
-- ✅ 6 Bath & Body Works (Lifestyle)
-- ✅ 8 Roupas de Marca (Fashion)
-- ✅ 8 Suplementos & Vitaminas (Health)
-- ✅ 6 Áudio & Eletrônicos (Tech)
-- ══════════════════════════════════════════════════════════════
