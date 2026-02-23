-- Add social proof columns to catalog_products
ALTER TABLE catalog_products
  ADD COLUMN IF NOT EXISTS sales_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trending boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rating numeric(2,1) NOT NULL DEFAULT 0;

-- Create product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES catalog_products(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL,
  verified_purchase boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews (public social proof)
CREATE POLICY "Anyone can view reviews" ON product_reviews FOR SELECT
  TO anon, authenticated USING (true);

-- Admin can manage reviews
CREATE POLICY "Admin can manage reviews" ON product_reviews FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);

-- ── Seed sales_count, trending and rating ──────────────────────────
UPDATE catalog_products SET sales_count = 342, trending = true,  rating = 4.8 WHERE name = 'AirPods Pro 2';
UPDATE catalog_products SET sales_count = 189, trending = true,  rating = 4.9 WHERE name = 'iPhone 16 Pro Max 256GB';
UPDATE catalog_products SET sales_count = 156, trending = false, rating = 4.7 WHERE name = 'MacBook Air M3 15"';
UPDATE catalog_products SET sales_count = 98,  trending = false, rating = 4.6 WHERE name = 'iPad Air M2';
UPDATE catalog_products SET sales_count = 67,  trending = false, rating = 4.5 WHERE name = 'Apple Watch Ultra 2';
UPDATE catalog_products SET sales_count = 203, trending = true,  rating = 4.7 WHERE name = 'Stanley Quencher H2.0 40oz';
UPDATE catalog_products SET sales_count = 178, trending = false, rating = 4.4 WHERE name = 'Kindle Paperwhite 11a Geracao';
UPDATE catalog_products SET sales_count = 45,  trending = false, rating = 4.3 WHERE name = 'JBL Charge 5';
UPDATE catalog_products SET sales_count = 112, trending = false, rating = 4.6 WHERE name = 'iPhone 16 Pro Case MagSafe';
UPDATE catalog_products SET sales_count = 287, trending = true,  rating = 4.9 WHERE name = 'Rare Beauty Soft Pinch Blush';
UPDATE catalog_products SET sales_count = 134, trending = false, rating = 4.8 WHERE name = 'Perfume Chanel N5 EDP 100ml';
UPDATE catalog_products SET sales_count = 95,  trending = false, rating = 4.5 WHERE name = 'Dior Addict Lip Glow';
UPDATE catalog_products SET sales_count = 156, trending = true,  rating = 4.7 WHERE name = 'Charlotte Tilbury Pillow Talk Set';
UPDATE catalog_products SET sales_count = 89,  trending = false, rating = 4.6 WHERE name = 'Dyson Airwrap Complete';
UPDATE catalog_products SET sales_count = 201, trending = true,  rating = 4.8 WHERE name = 'CeraVe Kit Limpeza + Hidratante';
UPDATE catalog_products SET sales_count = 78,  trending = false, rating = 4.4 WHERE name = 'The Ordinary AHA 30% + BHA 2%';
UPDATE catalog_products SET sales_count = 167, trending = false, rating = 4.5 WHERE name = 'Sol de Janeiro Brazilian Bum Bum Cream';
UPDATE catalog_products SET sales_count = 312, trending = true,  rating = 4.8 WHERE name = 'Nike Dunk Low Panda';
UPDATE catalog_products SET sales_count = 234, trending = true,  rating = 4.7 WHERE name = 'Adidas Samba OG';
UPDATE catalog_products SET sales_count = 145, trending = false, rating = 4.6 WHERE name = 'Ray-Ban Aviator Classic';
UPDATE catalog_products SET sales_count = 67,  trending = false, rating = 4.3 WHERE name = 'Levi''s 501 Original';
UPDATE catalog_products SET sales_count = 89,  trending = false, rating = 4.5 WHERE name = 'Calvin Klein Eternity EDP';
UPDATE catalog_products SET sales_count = 178, trending = true,  rating = 4.9 WHERE name = 'Creatina Monohidratada 300g';
UPDATE catalog_products SET sales_count = 123, trending = false, rating = 4.4 WHERE name = 'Whey Protein Gold Standard';
UPDATE catalog_products SET sales_count = 56,  trending = false, rating = 4.2 WHERE name = 'Omega-3 Fish Oil 120 caps';
UPDATE catalog_products SET sales_count = 91,  trending = false, rating = 4.5 WHERE name = 'Vitamina D3 5000UI 180 caps';

-- ── Seed reviews ──────────────────────────
-- AirPods Pro 2
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'AirPods Pro 2'), 'Carolina M.', 5, 'Cancelamento de ruido absurdo! Uso todo dia no metro e no escritorio. Vale cada centavo.', true),
  ((SELECT id FROM catalog_products WHERE name = 'AirPods Pro 2'), 'Rafael S.', 5, 'Qualidade de som incrivel. Trouxe dos EUA e economizei quase R$400 comparado ao preco BR.', true),
  ((SELECT id FROM catalog_products WHERE name = 'AirPods Pro 2'), 'Amanda L.', 4, 'Muito bom, mas demora um pouco pra acostumar com o encaixe. Som e cancelamento de ruido sao top.', true);

-- Rare Beauty
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Rare Beauty Soft Pinch Blush'), 'Juliana P.', 5, 'O blush mais pigmentado que ja usei! Uma gotinha ja da conta. Durou o dia inteiro.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Rare Beauty Soft Pinch Blush'), 'Beatriz R.', 5, 'Vi no TikTok e comprei. Nao me arrependi! Acabamento natural lindo.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Rare Beauty Soft Pinch Blush'), 'Fernanda C.', 4, 'Amei a textura e a cor. So achei a embalagem pequena, mas rende muito.', true);

-- Nike Dunk Low Panda
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Nike Dunk Low Panda'), 'Lucas T.', 5, 'Tenis classico! Combina com tudo. Couro de qualidade e muito confortavel.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Nike Dunk Low Panda'), 'Pedro H.', 5, 'Comprei pra minha esposa e ela amou. Ja estou pedindo o meu!', true),
  ((SELECT id FROM catalog_products WHERE name = 'Nike Dunk Low Panda'), 'Mariana F.', 4, 'Lindo demais! So precisa de uns dias pra amaciar. Depois fica perfeito.', true);

-- Stanley Quencher
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Stanley Quencher H2.0 40oz'), 'Camila A.', 5, 'Mantem gelado o dia INTEIRO. Levei pra praia e a agua ainda tava gelada depois de 8h.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Stanley Quencher H2.0 40oz'), 'Thiago B.', 5, 'Melhor garrafa termica que ja tive. Vale o hype todo!', true);

-- Creatina
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Creatina Monohidratada 300g'), 'Gabriel N.', 5, 'Creatina pura, sem gosto. Preco muito melhor que no Brasil.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Creatina Monohidratada 300g'), 'Rodrigo M.', 5, 'Ja senti diferenca no treino em 2 semanas. Qualidade top.', true);

-- Charlotte Tilbury
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Charlotte Tilbury Pillow Talk Set'), 'Isabela K.', 5, 'O kit e maravilhoso! Batom e delineador combinam perfeitamente.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Charlotte Tilbury Pillow Talk Set'), 'Patricia G.', 4, 'Cores lindas e duradouras. Embalagem luxuosa. Presente perfeito.', true);

-- Adidas Samba
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Adidas Samba OG'), 'Diego V.', 5, 'O tenis do momento! Super confortavel e estiloso. Combina com tudo.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Adidas Samba OG'), 'Ana Clara S.', 5, 'Comprei na cor preta e ja quero outra. Design atemporal.', true);

-- CeraVe
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'CeraVe Kit Limpeza + Hidratante'), 'Larissa D.', 5, 'Minha pele nunca esteve tao boa! O kit tem tudo que preciso na rotina.', true),
  ((SELECT id FROM catalog_products WHERE name = 'CeraVe Kit Limpeza + Hidratante'), 'Renata W.', 4, 'Otimo custo-beneficio. Minha dermato recomendou e realmente funciona.', true);

-- iPhone 16 Pro Max
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'iPhone 16 Pro Max 256GB'), 'Marcos L.', 5, 'Camera insana! Parece que tiro foto profissional. Tela enorme e bateria dura o dia todo.', true),
  ((SELECT id FROM catalog_products WHERE name = 'iPhone 16 Pro Max 256GB'), 'Vanessa R.', 5, 'Economizei mais de R$3000 trazendo dos EUA. Melhor celular que ja tive.', true);

-- Dyson Airwrap
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Dyson Airwrap Complete'), 'Leticia M.', 5, 'Revolucionou minha rotina de cabelo. Seca e modela sem danificar. Amo!', true),
  ((SELECT id FROM catalog_products WHERE name = 'Dyson Airwrap Complete'), 'Sofia P.', 4, 'Caro mas vale muito a pena. Meu cabelo nunca ficou tao bonito.', true);
