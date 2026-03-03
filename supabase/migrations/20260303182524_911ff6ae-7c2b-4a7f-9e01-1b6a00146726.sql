
-- ============================================================
-- Remove duplicatas (manter a mais antiga por name+brand)
-- ============================================================
DELETE FROM catalog_products
WHERE id NOT IN (
  SELECT DISTINCT ON (name, brand) id
  FROM catalog_products
  ORDER BY name, brand, created_at ASC
);

-- ============================================================
-- UNIQUE constraint em (name, brand)
-- ============================================================
ALTER TABLE catalog_products
  ADD CONSTRAINT catalog_products_name_brand_unique UNIQUE (name, brand);

-- ============================================================
-- Apple Acessórios (6 produtos)
-- ============================================================
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('AirTag 4-Pack', 'Apple', 'Tech', 79.00, 'https://images.unsplash.com/photo-1625480860249-be231806e6ed?w=600&h=600&fit=crop', 'Pack com 4 AirTags Apple. Rastreie chaves, carteira, mochila e mala com precisao via rede Buscar.'),
  ('Apple Pencil Pro', 'Apple', 'Tech', 129.00, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&h=600&fit=crop', 'Apple Pencil Pro com sensor de aperto, feedback haptico e busca via Buscar.'),
  ('Carregador MagSafe Apple', 'Apple', 'Tech', 39.00, 'https://images.unsplash.com/photo-1622782914767-404fb9ab3f57?w=600&h=600&fit=crop', 'Carregador sem fio MagSafe para iPhone. Alinhamento magnetico perfeito, carregamento rapido 15W.'),
  ('Apple Watch SE 44mm', 'Apple', 'Tech', 279.00, 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=600&fit=crop', 'Apple Watch SE 2a geracao 44mm GPS. Chip S8, deteccao de colisao, monitoramento de saude.'),
  ('Magic Keyboard iPad Pro', 'Apple', 'Tech', 299.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop', 'Magic Keyboard para iPad Pro com trackpad e teclado retroiluminado.'),
  ('AirPods Max USB-C', 'Apple', 'Tech', 549.00, 'https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=600&h=600&fit=crop', 'Fone over-ear AirPods Max com cancelamento de ruido e audio espacial. Agora com USB-C.')
ON CONFLICT (name, brand) DO NOTHING;

-- ============================================================
-- Kids & Brinquedos (8 produtos)
-- ============================================================
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('LEGO Star Wars Millennium Falcon', 'LEGO', 'Kids', 159.99, 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&h=600&fit=crop', 'LEGO Star Wars Millennium Falcon 1351 pecas com minifiguras.'),
  ('LEGO Technic Ferrari Daytona', 'LEGO', 'Kids', 449.99, 'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=600&h=600&fit=crop', 'LEGO Technic Ferrari Daytona SP3 3778 pecas.'),
  ('Barbie Dreamhouse 2024', 'Barbie', 'Kids', 99.99, 'https://images.unsplash.com/photo-1613682988402-9c3e4c2e8d8b?w=600&h=600&fit=crop', 'Casa dos Sonhos Barbie 3 andares com piscina e 75+ acessorios.'),
  ('Hot Wheels Ultimate Garage', 'Hot Wheels', 'Kids', 89.99, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop', 'Garagem Ultimate Hot Wheels para 100+ carrinhos.'),
  ('Squishmallows 16" Cam the Cat', 'Squishmallows', 'Kids', 24.99, 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=600&h=600&fit=crop', 'Pelucia Squishmallows 16 polegadas super macia.'),
  ('Play-Doh Kitchen Creations', 'Play-Doh', 'Kids', 19.99, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop', 'Kit Play-Doh Kitchen Creations com moldes de comida e 10 potes.'),
  ('Baby Alive Grows Up', 'Hasbro', 'Kids', 34.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop', 'Baby Alive que cresce de verdade com fases.'),
  ('Nerf Elite 2.0 Commander', 'Nerf', 'Kids', 14.99, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop', 'Lancador Nerf Elite 2.0 Commander com 12 dardos.')
ON CONFLICT (name, brand) DO NOTHING;

-- ============================================================
-- Baby & Bebê (5 produtos)
-- ============================================================
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Carrinho Graco Modes Pramette', 'Graco', 'Kids', 249.99, 'https://images.unsplash.com/photo-1590693563776-79e6b606a642?w=600&h=600&fit=crop', 'Carrinho de bebe 3-em-1. Converte de moises para assento reversivel.'),
  ('Cadeirinha Graco 4Ever DLX', 'Graco', 'Kids', 299.99, 'https://images.unsplash.com/photo-1590693563776-79e6b606a642?w=600&h=600&fit=crop', 'Cadeirinha auto 4-em-1, do recem-nascido ate 54kg.'),
  ('Kit Mamadeiras Dr. Browns 9pc', 'Dr. Browns', 'Kids', 39.99, 'https://images.unsplash.com/photo-1584839404210-0a41e4791460?w=600&h=600&fit=crop', 'Kit anti-colica com 9 pecas e sistema de ventilacao interno.'),
  ('Roupinhas Carters 5-Pack', 'Carters', 'Kids', 19.99, 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop', 'Pack 5 bodies Carters algodao 100%. Estampas variadas.'),
  ('Munchkin Miracle 360 Cup 2-Pack', 'Munchkin', 'Kids', 12.99, 'https://images.unsplash.com/photo-1584839404210-0a41e4791460?w=600&h=600&fit=crop', 'Copo de treinamento 360 graus anti-vazamento. Pack com 2.')
ON CONFLICT (name, brand) DO NOTHING;

-- ============================================================
-- Bath & Body Works extras (6 produtos)
-- ============================================================
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('BBW Japanese Cherry Blossom Mist', 'Bath & Body Works', 'Lifestyle', 16.95, 'https://images.unsplash.com/photo-1594035910387-fea081dc9b3c?w=600&h=600&fit=crop', 'Fine Fragrance Mist 236ml. A fragrancia #1 mais vendida da BBW.'),
  ('BBW A Thousand Wishes Cream', 'Bath & Body Works', 'Lifestyle', 16.95, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop', 'Body Cream 226g ultra hidratante com manteiga de karite.'),
  ('BBW Eucalyptus Spearmint Candle', 'Bath & Body Works', 'Lifestyle', 26.50, 'https://images.unsplash.com/photo-1602607616524-9d05c1eeb148?w=600&h=600&fit=crop', 'Vela 3 pavios Aromaterapia Stress Relief 411g.'),
  ('BBW Wallflower Refill 2-Pack', 'Bath & Body Works', 'Lifestyle', 12.95, 'https://images.unsplash.com/photo-1602607616524-9d05c1eeb148?w=600&h=600&fit=crop', 'Refil aromatizador Wallflower 2 unidades. Ate 60 dias de fragrancia.'),
  ('BBW Gift Set Champagne Toast', 'Bath & Body Works', 'Lifestyle', 39.95, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop', 'Kit presente: body mist + cream + shower gel. Embalagem inclusa.'),
  ('BBW Into the Night Mist', 'Bath & Body Works', 'Lifestyle', 16.95, 'https://images.unsplash.com/photo-1594035910387-fea081dc9b3c?w=600&h=600&fit=crop', 'Fine Fragrance Mist 236ml Into the Night. Sofisticado e sedutor.')
ON CONFLICT (name, brand) DO NOTHING;

-- ============================================================
-- Roupas de Marca (8 produtos)
-- ============================================================
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Polo Ralph Lauren Classic Fit', 'Ralph Lauren', 'Fashion', 98.00, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=600&fit=crop', 'Polo Classic Fit algodao pique com logo iconico bordado.'),
  ('Tommy Hilfiger Polo Essential', 'Tommy Hilfiger', 'Fashion', 69.50, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop', 'Polo 1985 Essential algodao organico com bandeirinha bordada.'),
  ('Calvin Klein Cueca Boxer 3-Pack', 'Calvin Klein', 'Fashion', 34.99, 'https://images.unsplash.com/photo-1584208124218-80b342a00e29?w=600&h=600&fit=crop', '3 cuecas boxer com elastico iconico CK. Algodao stretch.'),
  ('Under Armour Tech 2.0 Dry-Fit', 'Under Armour', 'Fashion', 30.00, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop', 'Camiseta UA Tech 2.0 que seca ultra rapido. Anti-odor.'),
  ('Gap Logo Hoodie Fleece', 'Gap', 'Fashion', 44.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop', 'Moletom Gap fleece com capuz e logo classico.'),
  ('Champion Reverse Weave Moletom', 'Champion', 'Fashion', 39.99, 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=600&fit=crop', 'Moletom Reverse Weave classico heavyweight que nao encolhe.'),
  ('Lacoste Polo Classic L.12.12', 'Lacoste', 'Fashion', 89.50, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=600&fit=crop', 'A polo original Lacoste em petit pique com crocodilo bordado.'),
  ('The North Face Nuptse 700 Vest', 'The North Face', 'Fashion', 179.00, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=600&h=600&fit=crop', 'Colete puffer Nuptse 700-fill. Leve, quente e compactavel.')
ON CONFLICT (name, brand) DO NOTHING;

-- ============================================================
-- Suplementos & Vitaminas (7 produtos)
-- ============================================================
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('Colageno Vital Proteins 284g', 'Vital Proteins', 'Health', 27.00, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop', 'Colageno peptideo sem sabor 284g. 20g por dose.'),
  ('Melatonina 10mg 300 Caps', 'Kirkland', 'Health', 11.99, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop', 'Melatonina 10mg Kirkland 300 capsulas dissolucao rapida.'),
  ('Biotina 10.000mcg 250 Caps', 'Kirkland', 'Health', 9.99, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=600&fit=crop', 'Biotina 10.000mcg para cabelo, pele e unhas.'),
  ('Centrum Mulher 200 Caps', 'Centrum', 'Health', 17.99, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop', 'Multivitaminico Centrum Women 200 gomas.'),
  ('Ashwagandha 600mg 180 Caps', 'Kirkland', 'Health', 11.99, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=600&fit=crop', 'Ashwagandha KSM-66 para estresse e energia.'),
  ('Omega-3 Fish Oil 1000mg 400 Caps', 'Kirkland', 'Health', 14.99, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=600&fit=crop', 'Omega-3 400 softgels EPA/DHA para saude do coracao.'),
  ('Vitamina D3 5000 IU 600 Caps', 'Kirkland', 'Health', 12.49, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop', 'Vitamina D3 5000 IU 600 caps. Suprimento para 1 ano+.')
ON CONFLICT (name, brand) DO NOTHING;

-- ============================================================
-- Áudio & Eletrônicos (6 produtos)
-- ============================================================
INSERT INTO catalog_products (name, brand, category, price_usd, image_url, description) VALUES
  ('JBL Charge 5', 'JBL', 'Tech', 179.95, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 'Caixa de som JBL Charge 5 com 20h bateria e IP67.'),
  ('JBL Flip 6', 'JBL', 'Tech', 129.95, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 'Caixa de som JBL Flip 6 portatil IP67, 12h bateria.'),
  ('Bose QuietComfort Ultra', 'Bose', 'Tech', 429.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 'Fone Bose QC Ultra com cancelamento de ruido imbativel.'),
  ('Beats Studio Pro', 'Beats', 'Tech', 349.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 'Fone Beats Studio Pro com cancelamento ativo e chip Apple.'),
  ('Echo Dot 5a Geracao', 'Amazon', 'Tech', 49.99, 'https://images.unsplash.com/photo-1543512214-318228f8e9c8?w=600&h=600&fit=crop', 'Echo Dot com Alexa, sensor de temperatura e som melhorado.'),
  ('GoPro Hero 13 Black', 'GoPro', 'Tech', 399.99, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop', 'Camera de acao GoPro Hero 13 Black 5.3K60 com HyperSmooth 6.0.')
ON CONFLICT (name, brand) DO NOTHING;
