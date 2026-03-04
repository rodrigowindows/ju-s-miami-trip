
-- SKINCARE / THE ORDINARY
INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
('The Ordinary Niacinamide 10% + Zinc 1% 30ml', 'The Ordinary', 'Beauty', 5.90, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', 'Serum para reduzir oleosidade e poros. O skincare mais vendido do mundo. 30ml. Produto viral no TikTok.', true),
('The Ordinary Hyaluronic Acid 2% + B5 30ml', 'The Ordinary', 'Beauty', 6.80, 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop', 'Serum de acido hialuronico para hidratacao profunda. Indicado para todos os tipos de pele. 30ml.', true),
('The Ordinary AHA 30% + BHA 2% Peeling Solution 30ml', 'The Ordinary', 'Beauty', 7.90, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop', 'Peeling quimico facial para esfoliacao profunda. Uso semanal. Resultado visivel na primeira aplicacao. 30ml.', true),
('The Ordinary Glycolic Acid 7% Toning Solution 240ml', 'The Ordinary', 'Beauty', 8.90, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', 'Tonico esfoliante com acido glicolico. Melhora textura e luminosidade da pele. 240ml.', true),
('The Ordinary Retinol 0.5% in Squalane 30ml', 'The Ordinary', 'Beauty', 5.80, 'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=400&h=400&fit=crop', 'Retinol anti-idade em base de esqualano. Reduz rugas e linhas finas. Uso noturno. 30ml.', true)
ON CONFLICT (name, brand) DO NOTHING;

-- SKINCARE / OLAPLEX & CERAVE
INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
('Olaplex No.3 Hair Perfector 100ml', 'Olaplex', 'Beauty', 30.00, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop', 'Tratamento capilar reparador. Reconstroi ligacoes quebradas do cabelo. O mais vendido da marca. 100ml.', true),
('Olaplex No.4 Bond Maintenance Shampoo 250ml', 'Olaplex', 'Beauty', 28.00, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop', 'Shampoo reparador que mantem as ligacoes do cabelo. Para cabelos danificados e com quimica. 250ml.', true),
('Olaplex No.5 Bond Maintenance Conditioner 250ml', 'Olaplex', 'Beauty', 28.00, 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=400&h=400&fit=crop', 'Condicionador reparador da linha Olaplex. Hidrata e fortalece sem pesar. 250ml.', true),
('CeraVe Moisturizing Cream 539g', 'CeraVe', 'Beauty', 17.99, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', 'Creme hidratante com ceramidas e acido hialuronico. Para pele seca. Recomendado por dermatologistas. 539g.', true),
('CeraVe Foaming Facial Cleanser 473ml', 'CeraVe', 'Beauty', 15.99, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', 'Gel de limpeza facial para pele oleosa e mista. Com niacinamida e ceramidas. 473ml.', true)
ON CONFLICT (name, brand) DO NOTHING;

-- MAQUIAGEM
INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
('Fenty Beauty Gloss Bomb Universal Lip Luminizer', 'Fenty Beauty', 'Beauty', 21.00, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop', 'Gloss labial universal da Rihanna. Cor Fenty Glow. Serve para todos os tons de pele. Viral no TikTok.', true),
('Fenty Beauty Pro Filtr Soft Matte Foundation', 'Fenty Beauty', 'Beauty', 40.00, 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=400&fit=crop', 'Base matte de longa duracao com 50 tons. Cobertura media a alta. Controle de oleosidade por 12h.', true),
('Too Faced Better Than Sex Mascara', 'Too Faced', 'Beauty', 29.00, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop', 'Mascara de cilios mais vendida dos EUA. Volume extremo com formula de colageno. A prova de agua.', true),
('Too Faced Lip Injection Extreme Lip Plumper', 'Too Faced', 'Beauty', 32.00, 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop', 'Gloss volumizador labial instantaneo. Efeito plumping visivel. Cor Original. Viral nas redes sociais.', true),
('MAC Ruby Woo Retro Matte Lipstick', 'MAC', 'Beauty', 23.00, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop', 'Batom matte vermelho iconico. O batom mais vendido do mundo. Tom universal.', true),
('Anastasia Beverly Hills Brow Wiz', 'Anastasia Beverly Hills', 'Beauty', 25.00, 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=400&h=400&fit=crop', 'Lapis de sobrancelha ultra-fino. Ponta retratil com escovinha.', true),
('Anastasia Beverly Hills Soft Glam Palette', 'Anastasia Beverly Hills', 'Beauty', 45.00, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop', 'Paleta de sombras com 14 cores. Mix de mates e brilhantes. Tons neutros e rosados.', true)
ON CONFLICT (name, brand) DO NOTHING;

-- SUPLEMENTOS
INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
('Melatonina 10mg 300 Caps', 'Kirkland', 'Health', 12.99, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop', 'Melatonina Kirkland 10mg com 300 capsulas. Auxilia no sono.', true),
('Hair Skin & Nails 250 Softgels', 'Nature''s Bounty', 'Health', 14.99, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop', 'Vitaminas para cabelo, pele e unhas com biotina 5000mcg. 250 capsulas.', true),
('Omega-3 Fish Oil 1200mg 200 Softgels', 'Nature Made', 'Health', 16.99, 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop', 'Omega 3 com EPA e DHA. 200 capsulas.', true),
('Vitamin D3 5000 IU 400 Softgels', 'Kirkland', 'Health', 11.99, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop', 'Vitamina D3 5000 UI Kirkland com 400 capsulas.', true),
('Creatina Monohidratada 400g', 'Optimum Nutrition', 'Health', 19.99, 'https://images.unsplash.com/photo-1593095948071-474c5cc2c989?w=400&h=400&fit=crop', 'Creatina pura micronizada Creapure. 400g (80 doses).', true),
('Whey Protein Gold Standard 2lb', 'Optimum Nutrition', 'Health', 34.99, 'https://images.unsplash.com/photo-1593095948071-474c5cc2c989?w=400&h=400&fit=crop', 'Whey Protein isolado e concentrado. 24g de proteina por dose. 900g.', true),
('Magnesium Glycinate 400mg 180 Caps', 'Doctor''s Best', 'Health', 14.99, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop', 'Magnesio glicinato de alta absorcao. 180 capsulas.', true),
('Probiotico 50 Bilhoes CFU 30 Caps', 'Garden of Life', 'Health', 29.99, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop', 'Probiotico com 16 cepas e 50 bilhoes de CFU. 30 capsulas.', true)
ON CONFLICT (name, brand) DO NOTHING;

-- ROUPAS / MODA LEVE
INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
('Calvin Klein Boxer Brief 3-Pack', 'Calvin Klein', 'Fashion', 34.99, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop', 'Kit com 3 cuecas boxer Calvin Klein. Algodao stretch. Elastico com logo iconico.', true),
('Calvin Klein Bralette Feminino 2-Pack', 'Calvin Klein', 'Fashion', 29.99, 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop', 'Kit 2 tops bralette Calvin Klein Modern Cotton.', true),
('Tommy Hilfiger Camiseta Classic Logo', 'Tommy Hilfiger', 'Fashion', 29.99, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop', 'Camiseta Tommy Hilfiger com logo classico. 100% algodao.', true),
('Tommy Hilfiger Bone Classic Cap', 'Tommy Hilfiger', 'Fashion', 24.99, 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=400&fit=crop', 'Bone Tommy Hilfiger com logo bordado frontal.', true),
('Ralph Lauren Bone Classic Pony Cap', 'Ralph Lauren', 'Fashion', 39.99, 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=400&fit=crop', 'Bone Polo Ralph Lauren com logo Pony bordado.', true),
('Hollister Camiseta Graphic Logo', 'Hollister', 'Fashion', 19.99, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop', 'Camiseta Hollister com estampa grafica do logo.', true),
('Abercrombie & Fitch Camiseta Essential', 'Abercrombie & Fitch', 'Fashion', 25.00, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop', 'Camiseta basica Abercrombie em algodao premium.', true),
('Levi''s Cinto Reversivel Couro', 'Levi''s', 'Fashion', 29.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', 'Cinto Levi''s reversivel em couro genuino.', true),
('Nike Meia Everyday Cushion 6-Pack', 'Nike', 'Fashion', 19.99, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop', 'Kit 6 pares de meias Nike Dri-FIT.', true),
('Adidas Meia Cushioned 6-Pack', 'Adidas', 'Fashion', 17.99, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop', 'Kit 6 pares de meias Adidas com tecnologia Aeroready.', true)
ON CONFLICT (name, brand) DO NOTHING;

-- PERFUMES
INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
('Dior Sauvage EDT 100ml', 'Dior', 'Perfumes', 105.00, 'https://fimgs.net/mdimg/perfume/375x500.31861.jpg', 'Perfume masculino mais vendido do mundo. Notas de bergamota e ambroxan. 100ml.', true),
('Chanel Bleu de Chanel EDT 100ml', 'Chanel', 'Perfumes', 115.00, 'https://fimgs.net/mdimg/perfume/375x500.25967.jpg', 'Eau de Toilette masculina iconica. Notas de menta, cedro e incenso. 100ml.', true),
('Carolina Herrera Good Girl EDP 80ml', 'Carolina Herrera', 'Perfumes', 99.00, 'https://fimgs.net/mdimg/perfume/375x500.39551.jpg', 'Perfume feminino no iconico frasco de sapato. 80ml.', true),
('Versace Eros EDT 100ml', 'Versace', 'Perfumes', 79.99, 'https://fimgs.net/mdimg/perfume/375x500.16657.jpg', 'Perfume masculino vibrante. Notas de menta, maca verde e baunilha. 100ml.', true),
('YSL Libre EDP 90ml', 'Yves Saint Laurent', 'Perfumes', 109.00, 'https://fimgs.net/mdimg/perfume/375x500.57779.jpg', 'Perfume feminino moderno. Notas de lavanda francesa e flor de laranjeira. 90ml.', true),
('Dolce & Gabbana Light Blue EDT 100ml', 'Dolce & Gabbana', 'Perfumes', 79.99, 'https://fimgs.net/mdimg/perfume/375x500.485.jpg', 'Classico perfume feminino fresco. 100ml.', true),
('Jean Paul Gaultier Scandal EDP 80ml', 'Jean Paul Gaultier', 'Perfumes', 89.99, 'https://fimgs.net/mdimg/perfume/375x500.52891.jpg', 'Perfume feminino marcante. Notas de mel, gardenia e caramelo. 80ml.', true),
('Giorgio Armani Acqua di Gio EDT 100ml', 'Giorgio Armani', 'Perfumes', 89.00, 'https://fimgs.net/mdimg/perfume/375x500.410.jpg', 'Classico masculino atemporal. Notas aquaticas e citricas. 100ml.', true)
ON CONFLICT (name, brand) DO NOTHING;

-- ACESSORIOS
INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
('Ray-Ban Aviator Classic', 'Ray-Ban', 'Fashion', 154.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', 'Oculos de sol Ray-Ban Aviator classico. Lentes G-15.', true),
('Ray-Ban Wayfarer Classic', 'Ray-Ban', 'Fashion', 154.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', 'Oculos de sol Ray-Ban Wayfarer. Design atemporal desde 1956.', true),
('Stanley Quencher H2.0 40oz', 'Stanley', 'Lifestyle', 45.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop', 'Copo termico Stanley Quencher 40oz (1.18L). Mantem gelado 11h.', true),
('Stanley IceFlow Flip Straw 30oz', 'Stanley', 'Lifestyle', 35.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop', 'Garrafa termica Stanley IceFlow com canudo. 30oz (887ml).', true)
ON CONFLICT (name, brand) DO NOTHING;

-- BRANDS
INSERT INTO public.brands (slug, name) VALUES
  ('the-ordinary', 'The Ordinary'),
  ('olaplex', 'Olaplex'),
  ('cerave', 'CeraVe'),
  ('fenty-beauty', 'Fenty Beauty'),
  ('too-faced', 'Too Faced'),
  ('mac', 'MAC'),
  ('anastasia-beverly-hills', 'Anastasia Beverly Hills'),
  ('natures-bounty', 'Nature''s Bounty'),
  ('nature-made', 'Nature Made'),
  ('optimum-nutrition', 'Optimum Nutrition'),
  ('doctors-best', 'Doctor''s Best'),
  ('garden-of-life', 'Garden of Life'),
  ('hollister', 'Hollister'),
  ('abercrombie-fitch', 'Abercrombie & Fitch'),
  ('levis', 'Levi''s'),
  ('adidas', 'Adidas'),
  ('dior', 'Dior'),
  ('chanel', 'Chanel'),
  ('carolina-herrera', 'Carolina Herrera'),
  ('versace', 'Versace'),
  ('yves-saint-laurent', 'Yves Saint Laurent'),
  ('dolce-gabbana', 'Dolce & Gabbana'),
  ('jean-paul-gaultier', 'Jean Paul Gaultier'),
  ('giorgio-armani', 'Giorgio Armani'),
  ('ray-ban', 'Ray-Ban')
ON CONFLICT (name) DO NOTHING;
