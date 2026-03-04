-- ============================================================
-- Novos produtos: Leves, baratos nos EUA, alta margem, mais vendidos no Brasil
-- Taxa efetiva: R$ 8,41/USD (45% margem)
-- ============================================================

-- ── SKINCARE / THE ORDINARY ──────────────────────────────────

INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
(
  'The Ordinary Niacinamide 10% + Zinc 1% 30ml',
  'The Ordinary',
  'Beauty',
  5.90,
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
  'Serum para reduzir oleosidade e poros. O skincare mais vendido do mundo. 30ml. Produto viral no TikTok.',
  true
),
(
  'The Ordinary Hyaluronic Acid 2% + B5 30ml',
  'The Ordinary',
  'Beauty',
  6.80,
  'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop',
  'Serum de acido hialuronico para hidratacao profunda. Indicado para todos os tipos de pele. 30ml.',
  true
),
(
  'The Ordinary AHA 30% + BHA 2% Peeling Solution 30ml',
  'The Ordinary',
  'Beauty',
  7.90,
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
  'Peeling quimico facial para esfoliacao profunda. Uso semanal. Resultado visivel na primeira aplicacao. 30ml.',
  true
),
(
  'The Ordinary Glycolic Acid 7% Toning Solution 240ml',
  'The Ordinary',
  'Beauty',
  8.90,
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
  'Tonico esfoliante com acido glicolico. Melhora textura e luminosidade da pele. 240ml.',
  true
),
(
  'The Ordinary Retinol 0.5% in Squalane 30ml',
  'The Ordinary',
  'Beauty',
  5.80,
  'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=400&h=400&fit=crop',
  'Retinol anti-idade em base de esqualano. Reduz rugas e linhas finas. Uso noturno. 30ml.',
  true
)
ON CONFLICT (name, brand) DO NOTHING;

-- ── SKINCARE / OLAPLEX & CERAVE ──────────────────────────────

INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
(
  'Olaplex No.3 Hair Perfector 100ml',
  'Olaplex',
  'Beauty',
  30.00,
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
  'Tratamento capilar reparador. Reconstroi ligacoes quebradas do cabelo. O mais vendido da marca. 100ml.',
  true
),
(
  'Olaplex No.4 Bond Maintenance Shampoo 250ml',
  'Olaplex',
  'Beauty',
  28.00,
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop',
  'Shampoo reparador que mantem as ligacoes do cabelo. Para cabelos danificados e com quimica. 250ml.',
  true
),
(
  'Olaplex No.5 Bond Maintenance Conditioner 250ml',
  'Olaplex',
  'Beauty',
  28.00,
  'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=400&h=400&fit=crop',
  'Condicionador reparador da linha Olaplex. Hidrata e fortalece sem pesar. 250ml.',
  true
),
(
  'CeraVe Moisturizing Cream 539g',
  'CeraVe',
  'Beauty',
  17.99,
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
  'Creme hidratante com ceramidas e acido hialuronico. Para pele seca. Recomendado por dermatologistas. 539g.',
  true
),
(
  'CeraVe Foaming Facial Cleanser 473ml',
  'CeraVe',
  'Beauty',
  15.99,
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
  'Gel de limpeza facial para pele oleosa e mista. Com niacinamida e ceramidas. 473ml.',
  true
)
ON CONFLICT (name, brand) DO NOTHING;

-- ── MAQUIAGEM ────────────────────────────────────────────────

INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
(
  'Fenty Beauty Gloss Bomb Universal Lip Luminizer',
  'Fenty Beauty',
  'Beauty',
  21.00,
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
  'Gloss labial universal da Rihanna. Cor Fenty Glow. Serve para todos os tons de pele. Viral no TikTok.',
  true
),
(
  'Fenty Beauty Pro Filtr Soft Matte Foundation',
  'Fenty Beauty',
  'Beauty',
  40.00,
  'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=400&fit=crop',
  'Base matte de longa duracao com 50 tons. Cobertura media a alta. Controle de oleosidade por 12h.',
  true
),
(
  'Too Faced Better Than Sex Mascara',
  'Too Faced',
  'Beauty',
  29.00,
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop',
  'Mascara de cilios mais vendida dos EUA. Volume extremo com formula de colageno. A prova de agua.',
  true
),
(
  'Too Faced Lip Injection Extreme Lip Plumper',
  'Too Faced',
  'Beauty',
  32.00,
  'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop',
  'Gloss volumizador labial instantaneo. Efeito plumping visivel. Cor Original. Viral nas redes sociais.',
  true
),
(
  'MAC Ruby Woo Retro Matte Lipstick',
  'MAC',
  'Beauty',
  23.00,
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
  'Batom matte vermelho icônico. O batom mais vendido do mundo. Tom universal que fica bem em todos os tons de pele.',
  true
),
(
  'Anastasia Beverly Hills Brow Wiz',
  'Anastasia Beverly Hills',
  'Beauty',
  25.00,
  'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=400&h=400&fit=crop',
  'Lapis de sobrancelha ultra-fino. Ponta retrátil com escovinha. O queridinho das sobrancelhas perfeitas.',
  true
),
(
  'Anastasia Beverly Hills Soft Glam Palette',
  'Anastasia Beverly Hills',
  'Beauty',
  45.00,
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop',
  'Paleta de sombras com 14 cores. Mix de mates e brilhantes. Tons neutros e rosados perfeitos para o dia a dia.',
  true
)
ON CONFLICT (name, brand) DO NOTHING;

-- ── SUPLEMENTOS EXTRAS ───────────────────────────────────────

INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
(
  'Melatonina 10mg 300 Caps',
  'Kirkland',
  'Health',
  12.99,
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
  'Melatonina Kirkland 10mg com 300 capsulas. Auxilia no sono. O suplemento mais comprado por brasileiros nos EUA.',
  true
),
(
  'Hair Skin & Nails 250 Softgels',
  'Nature''s Bounty',
  'Health',
  14.99,
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
  'Vitaminas para cabelo, pele e unhas com biotina 5000mcg. 250 capsulas. Super popular entre brasileiras.',
  true
),
(
  'Omega-3 Fish Oil 1200mg 200 Softgels',
  'Nature Made',
  'Health',
  16.99,
  'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop',
  'Omega 3 com EPA e DHA. 200 capsulas. Marca #1 recomendada por farmacêuticos nos EUA.',
  true
),
(
  'Vitamin D3 5000 IU 400 Softgels',
  'Kirkland',
  'Health',
  11.99,
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
  'Vitamina D3 5000 UI Kirkland com 400 capsulas. Essencial para imunidade e saude ossea.',
  true
),
(
  'Creatina Monohidratada 400g',
  'Optimum Nutrition',
  'Health',
  19.99,
  'https://images.unsplash.com/photo-1593095948071-474c5cc2c989?w=400&h=400&fit=crop',
  'Creatina pura micronizada Creapure. 400g (80 doses). O suplemento essencial para treino.',
  true
),
(
  'Whey Protein Gold Standard 2lb',
  'Optimum Nutrition',
  'Health',
  34.99,
  'https://images.unsplash.com/photo-1593095948071-474c5cc2c989?w=400&h=400&fit=crop',
  'Whey Protein isolado e concentrado. 24g de proteina por dose. Sabor Double Rich Chocolate. 900g.',
  true
),
(
  'Magnesium Glycinate 400mg 180 Caps',
  'Doctor''s Best',
  'Health',
  14.99,
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
  'Magnesio glicinato de alta absorcao. 180 capsulas. Para sono, musculos e relaxamento.',
  true
),
(
  'Probiotico 50 Bilhões CFU 30 Caps',
  'Garden of Life',
  'Health',
  29.99,
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
  'Probiotico com 16 cepas e 50 bilhoes de CFU. Para saude digestiva e imunidade. 30 capsulas.',
  true
)
ON CONFLICT (name, brand) DO NOTHING;

-- ── ROUPAS / MODA LEVE ───────────────────────────────────────

INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
(
  'Calvin Klein Boxer Brief 3-Pack',
  'Calvin Klein',
  'Fashion',
  34.99,
  'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop',
  'Kit com 3 cuecas boxer Calvin Klein. Algodao stretch. Elastico com logo icônico. Pack classico preto/cinza/branco.',
  true
),
(
  'Calvin Klein Bralette Feminino 2-Pack',
  'Calvin Klein',
  'Fashion',
  29.99,
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop',
  'Kit 2 tops bralette Calvin Klein Modern Cotton. O item de lingerie mais desejado. Elastico icônico.',
  true
),
(
  'Tommy Hilfiger Camiseta Classic Logo',
  'Tommy Hilfiger',
  'Fashion',
  29.99,
  'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop',
  'Camiseta Tommy Hilfiger com logo classico. 100% algodao. Corte regular. Varias cores disponiveis.',
  true
),
(
  'Tommy Hilfiger Bone Classic Cap',
  'Tommy Hilfiger',
  'Fashion',
  24.99,
  'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=400&fit=crop',
  'Bone Tommy Hilfiger com logo bordado frontal. Aba curva. Ajuste traseiro com fivela. Super leve.',
  true
),
(
  'Ralph Lauren Bone Classic Pony Cap',
  'Ralph Lauren',
  'Fashion',
  39.99,
  'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=400&fit=crop',
  'Bone Polo Ralph Lauren com logo Pony bordado. Aba curva. Algodao chino. O bone mais vendido.',
  true
),
(
  'Hollister Camiseta Graphic Logo',
  'Hollister',
  'Fashion',
  19.99,
  'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop',
  'Camiseta Hollister com estampa grafica do logo. Tecido macio. Corte relaxed. Popular entre jovens.',
  true
),
(
  'Abercrombie & Fitch Camiseta Essential',
  'Abercrombie & Fitch',
  'Fashion',
  25.00,
  'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop',
  'Camiseta basica Abercrombie em algodao premium. Corte classico. Logo discreto. Extremamente macia.',
  true
),
(
  'Levi''s Cinto Reversivel Couro',
  'Levi''s',
  'Fashion',
  29.99,
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  'Cinto Levi''s reversivel em couro genuino. Preto de um lado, marrom do outro. Fivela classica. Leve.',
  true
),
(
  'Nike Meia Everyday Cushion 6-Pack',
  'Nike',
  'Fashion',
  19.99,
  'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop',
  'Kit 6 pares de meias Nike Dri-FIT. Acolchoamento no arco. Brancas com Swoosh. Essenciais.',
  true
),
(
  'Adidas Meia Cushioned 6-Pack',
  'Adidas',
  'Fashion',
  17.99,
  'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop',
  'Kit 6 pares de meias Adidas com tecnologia Aeroready. Logo trefoil. Cano medio. Pretas.',
  true
)
ON CONFLICT (name, brand) DO NOTHING;

-- ── PERFUMES IMPORTADOS (LEVES, ALTO VALOR) ─────────────────

INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
(
  'Dior Sauvage EDT 100ml',
  'Dior',
  'Perfumes',
  105.00,
  'https://fimgs.net/mdimg/perfume/375x500.31861.jpg',
  'Perfume masculino mais vendido do mundo. Notas de bergamota e ambroxan. Fixacao de 8h+. 100ml.',
  true
),
(
  'Chanel Bleu de Chanel EDT 100ml',
  'Chanel',
  'Perfumes',
  115.00,
  'https://fimgs.net/mdimg/perfume/375x500.25967.jpg',
  'Eau de Toilette masculina icônica. Notas de menta, cedro e incenso. Elegante e versatil. 100ml.',
  true
),
(
  'Carolina Herrera Good Girl EDP 80ml',
  'Carolina Herrera',
  'Perfumes',
  99.00,
  'https://fimgs.net/mdimg/perfume/375x500.39551.jpg',
  'Perfume feminino no icônico frasco de sapato. Notas de jasmin e cacau. Sensual e sofisticado. 80ml.',
  true
),
(
  'Versace Eros EDT 100ml',
  'Versace',
  'Perfumes',
  79.99,
  'https://fimgs.net/mdimg/perfume/375x500.16657.jpg',
  'Perfume masculino vibrante. Notas de menta, maca verde e baunilha. Projecao forte. 100ml.',
  true
),
(
  'YSL Libre EDP 90ml',
  'Yves Saint Laurent',
  'Perfumes',
  109.00,
  'https://fimgs.net/mdimg/perfume/375x500.57779.jpg',
  'Perfume feminino moderno. Notas de lavanda francesa e flor de laranjeira. Feminino e ousado. 90ml.',
  true
),
(
  'Dolce & Gabbana Light Blue EDT 100ml',
  'Dolce & Gabbana',
  'Perfumes',
  79.99,
  'https://fimgs.net/mdimg/perfume/375x500.485.jpg',
  'Classico perfume feminino fresco. Notas de limao siciliano, maca e cedro. Perfeito para verao. 100ml.',
  true
),
(
  'Jean Paul Gaultier Scandal EDP 80ml',
  'Jean Paul Gaultier',
  'Perfumes',
  89.99,
  'https://fimgs.net/mdimg/perfume/375x500.52891.jpg',
  'Perfume feminino marcante. Notas de mel, gardenia e caramelo. Longa fixacao. 80ml.',
  true
),
(
  'Giorgio Armani Acqua di Gio EDT 100ml',
  'Giorgio Armani',
  'Perfumes',
  89.00,
  'https://fimgs.net/mdimg/perfume/375x500.410.jpg',
  'Classico masculino atemporal. Notas aquaticas e citricas. O perfume masculino mais icônico de todos. 100ml.',
  true
)
ON CONFLICT (name, brand) DO NOTHING;

-- ── ACESSÓRIOS LEVES DE ALTO VALOR ──────────────────────────

INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active)
VALUES
(
  'Ray-Ban Aviator Classic',
  'Ray-Ban',
  'Fashion',
  154.00,
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
  'Oculos de sol Ray-Ban Aviator classico. Lentes G-15. Armacao dourada. O icone dos oculos de sol.',
  true
),
(
  'Ray-Ban Wayfarer Classic',
  'Ray-Ban',
  'Fashion',
  154.00,
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
  'Oculos de sol Ray-Ban Wayfarer. Design atemporal desde 1956. Armacao preta. Lentes classicas.',
  true
),
(
  'Stanley Quencher H2.0 40oz',
  'Stanley',
  'Lifestyle',
  45.00,
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
  'Copo termico Stanley Quencher 40oz (1.18L). Mantem gelado 11h. O copo viral do TikTok. Varias cores.',
  true
),
(
  'Stanley IceFlow Flip Straw 30oz',
  'Stanley',
  'Lifestyle',
  35.00,
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
  'Garrafa termica Stanley IceFlow com canudo. 30oz (887ml). Mantem gelado 12h. Design ergonômico.',
  true
)
ON CONFLICT (name, brand) DO NOTHING;

-- ── ADICIONAR NOVAS BRANDS ──────────────────────────────────

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

-- ============================================================
-- RESUMO DOS NOVOS PRODUTOS (45% margem = R$8,41/USD)
-- ============================================================
--
-- SKINCARE (ultraleve, margem 70-150%):
--   The Ordinary Niacinamide: $5.90 → R$50 (BR: R$80-150)
--   The Ordinary Hyaluronic: $6.80 → R$57 (BR: R$90-130)
--   The Ordinary AHA/BHA Peeling: $7.90 → R$66 (BR: R$100-160)
--   The Ordinary Glycolic Toner: $8.90 → R$75 (BR: R$120-180)
--   The Ordinary Retinol: $5.80 → R$49 (BR: R$80-140)
--   Olaplex No.3: $30 → R$252 (BR: R$350-500)
--   Olaplex No.4 Shampoo: $28 → R$235 (BR: R$300-450)
--   Olaplex No.5 Conditioner: $28 → R$235 (BR: R$300-450)
--   CeraVe Cream 539g: $17.99 → R$151 (BR: R$200-350)
--   CeraVe Cleanser: $15.99 → R$134 (BR: R$180-280)
--
-- MAQUIAGEM (leve, margem 70-100%):
--   Fenty Gloss Bomb: $21 → R$177 (BR: R$250-350)
--   Fenty Foundation: $40 → R$336 (BR: R$400-550)
--   Too Faced Mascara: $29 → R$244 (BR: R$350-500)
--   Too Faced Lip Injection: $32 → R$269 (BR: R$350-450)
--   MAC Ruby Woo: $23 → R$193 (BR: R$250-350)
--   ABH Brow Wiz: $25 → R$210 (BR: R$280-400)
--   ABH Soft Glam Palette: $45 → R$378 (BR: R$500-700)
--
-- SUPLEMENTOS (ultraleve, margem 70-150%):
--   Melatonina 300 caps: $12.99 → R$109 (BR: R$150-250)
--   Hair Skin Nails: $14.99 → R$126 (BR: R$180-300)
--   Omega-3: $16.99 → R$143 (BR: R$200-350)
--   Vitamina D3 400 caps: $11.99 → R$101 (BR: R$150-250)
--   Creatina ON: $19.99 → R$168 (BR: R$250-400)
--   Whey Protein ON: $34.99 → R$294 (BR: R$400-600)
--   Magnesio Glicinato: $14.99 → R$126 (BR: R$180-300)
--   Probiotico: $29.99 → R$252 (BR: R$350-500)
--
-- ROUPAS LEVES (margem 50-100%):
--   CK Boxer 3-Pack: $34.99 → R$294 (BR: R$350-500)
--   CK Bralette 2-Pack: $29.99 → R$252 (BR: R$300-450)
--   Tommy Camiseta: $29.99 → R$252 (BR: R$300-400)
--   Tommy Bone: $24.99 → R$210 (BR: R$250-350)
--   RL Bone: $39.99 → R$336 (BR: R$400-550)
--   Hollister Camiseta: $19.99 → R$168 (BR: R$200-300)
--   A&F Camiseta: $25 → R$210 (BR: R$280-400)
--   Levis Cinto: $29.99 → R$252 (BR: R$300-450)
--   Nike Meias 6pk: $19.99 → R$168 (BR: R$200-350)
--   Adidas Meias 6pk: $17.99 → R$151 (BR: R$180-300)
--
-- PERFUMES (leve, alto valor, margem 45-80%):
--   Dior Sauvage: $105 → R$883 (BR: R$500-800 ML)
--   Bleu de Chanel: $115 → R$967 (BR: R$600-900 ML)
--   Good Girl: $99 → R$833 (BR: R$500-800 ML)
--   Versace Eros: $79.99 → R$673 (BR: R$400-700 ML)
--   YSL Libre: $109 → R$917 (BR: R$600-900 ML)
--   D&G Light Blue: $79.99 → R$673 (BR: R$400-650 ML)
--   JPG Scandal: $89.99 → R$757 (BR: R$500-750 ML)
--   Acqua di Gio: $89 → R$749 (BR: R$450-700 ML)
--
-- ACESSORIOS (leve, margem 50-80%):
--   Ray-Ban Aviator: $154 → R$1295 (BR: R$800-1200 ML)
--   Ray-Ban Wayfarer: $154 → R$1295 (BR: R$800-1200 ML)
--   Stanley Quencher 40oz: $45 → R$378 (BR: R$500-800)
--   Stanley IceFlow 30oz: $35 → R$294 (BR: R$400-600)
--
-- TOTAL: 41 novos produtos adicionados
-- ============================================================
