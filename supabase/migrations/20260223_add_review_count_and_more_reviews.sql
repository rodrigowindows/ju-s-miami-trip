-- Add review_count column to catalog_products
ALTER TABLE catalog_products
  ADD COLUMN IF NOT EXISTS review_count integer NOT NULL DEFAULT 0;

-- ── Update review_count for products that already have reviews ──
UPDATE catalog_products SET review_count = (
  SELECT COUNT(*) FROM product_reviews WHERE product_reviews.product_id = catalog_products.id
);

-- ── More reviews for existing products ──────────────────────────

-- MacBook Air M3
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'MacBook Air M3 15"'), 'Gustavo R.', 5, 'Maquina absurda! Silencioso, leve e a tela e gigante. Melhor notebook que ja tive.', true),
  ((SELECT id FROM catalog_products WHERE name = 'MacBook Air M3 15"'), 'Daniela F.', 5, 'Uso pra design grafico e roda tudo liso. Bateria dura o dia inteiro mesmo editando.', true),
  ((SELECT id FROM catalog_products WHERE name = 'MacBook Air M3 15"'), 'Bruno S.', 4, 'Excelente! So sinto falta de mais portas USB. Mas o desempenho compensa.', true);

-- iPad Air M2
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'iPad Air M2'), 'Tatiana M.', 5, 'Perfeito pra estudar e anotar. Com o Apple Pencil vira um caderno digital incrivel.', true),
  ((SELECT id FROM catalog_products WHERE name = 'iPad Air M2'), 'Felipe A.', 4, 'Otimo tablet, tela linda. Uso pra assistir series e ler. Super recomendo.', true),
  ((SELECT id FROM catalog_products WHERE name = 'iPad Air M2'), 'Juliana C.', 5, 'Presenteei minha mae e ela ama! Facil de usar e rapido demais.', true);

-- Apple Watch Ultra 2
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Apple Watch Ultra 2'), 'Ricardo N.', 5, 'Uso pra corrida e trilha. GPS preciso, bateria aguenta 2 dias. Relogio dos sonhos.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Apple Watch Ultra 2'), 'Priscila T.', 5, 'Robusto e bonito. A tela brilhante funciona perfeito no sol. Amo!', true),
  ((SELECT id FROM catalog_products WHERE name = 'Apple Watch Ultra 2'), 'Eduardo L.', 4, 'Muito bom mas e grande no pulso. Se voce tem pulso fino, experimente antes.', true);

-- Kindle Paperwhite
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Kindle Paperwhite 11a Geracao'), 'Mariana B.', 5, 'Leio todo dia antes de dormir. A tela nao cansa a vista. Melhor investimento!', true),
  ((SELECT id FROM catalog_products WHERE name = 'Kindle Paperwhite 11a Geracao'), 'Roberto C.', 5, 'Carrego pra todo lugar. Leve, bateria dura semanas. Voltei a ler muito mais.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Kindle Paperwhite 11a Geracao'), 'Claudia V.', 4, 'Adorei! Parece papel de verdade. So queria que tivesse cor, mas pra livros e perfeito.', true);

-- JBL Charge 5
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'JBL Charge 5'), 'Anderson P.', 5, 'Som potente pra uma caixa desse tamanho! Levei pra churras e todo mundo curtiu.', true),
  ((SELECT id FROM catalog_products WHERE name = 'JBL Charge 5'), 'Natalia G.', 4, 'A prova d''agua de verdade! Caiu na piscina e funcionou normal. Grave forte.', true),
  ((SELECT id FROM catalog_products WHERE name = 'JBL Charge 5'), 'Vinicius K.', 5, 'Bateria dura muito. Uso todo fim de semana e so carrego uma vez. Som incrivel.', true);

-- iPhone 16 Pro Case MagSafe
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'iPhone 16 Pro Case MagSafe'), 'Paula D.', 5, 'Encaixe perfeito no MagSafe! Material premium, protege bem sem ficar volumoso.', true),
  ((SELECT id FROM catalog_products WHERE name = 'iPhone 16 Pro Case MagSafe'), 'Leonardo R.', 4, 'Boa case, bonita e funcional. Preco nos EUA e muito mais em conta.', true);

-- Perfume Chanel N5
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Perfume Chanel N5 EDP 100ml'), 'Viviane S.', 5, 'Classico atemporal! Fixacao incrivel, dura o dia todo. Fragrancia sofisticada.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Perfume Chanel N5 EDP 100ml'), 'Cristina A.', 5, 'Meu perfume favorito ha anos. Economizei bastante trazendo dos EUA.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Perfume Chanel N5 EDP 100ml'), 'Alessandra M.', 4, 'Fragrancia divina! Sempre recebo elogios. Embalagem luxuosa.', true);

-- Dior Addict Lip Glow
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Dior Addict Lip Glow'), 'Bianca L.', 5, 'Melhor lip balm que ja usei! Hidrata e da uma cor natural linda.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Dior Addict Lip Glow'), 'Gabriela T.', 5, 'Textura cremosa, cor perfeita. Uso todo dia. Vale muito a pena!', true),
  ((SELECT id FROM catalog_products WHERE name = 'Dior Addict Lip Glow'), 'Helena F.', 4, 'Lindo e cheiroso! A cor rose e a mais bonita. Durabilidade boa.', true);

-- The Ordinary AHA 30%
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'The Ordinary AHA 30% + BHA 2%'), 'Lorena P.', 5, 'Esfoliante quimico incrivel! Minha pele ficou muito mais lisa e uniforme.', true),
  ((SELECT id FROM catalog_products WHERE name = 'The Ordinary AHA 30% + BHA 2%'), 'Sabrina N.', 4, 'Funciona demais mas use com cuidado! Comece 1x por semana. Resultado visivel.', true),
  ((SELECT id FROM catalog_products WHERE name = 'The Ordinary AHA 30% + BHA 2%'), 'Flavia R.', 5, 'Melhor peeling caseiro. Preco muito justo pelo resultado que entrega.', true);

-- Sol de Janeiro
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Sol de Janeiro Brazilian Bum Bum Cream'), 'Aline C.', 5, 'Cheiro MARAVILHOSO! Hidrata demais e a pele fica brilhante. Todo mundo pergunta o que estou usando.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Sol de Janeiro Brazilian Bum Bum Cream'), 'Raquel B.', 5, 'Viciante! O cheiro dura o dia todo. Pele super macia. Ja pedi a segunda.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Sol de Janeiro Brazilian Bum Bum Cream'), 'Monica G.', 4, 'Otimo creme! O pote e grande e rende bastante. Fragrancia tropical deliciosa.', true);

-- Ray-Ban Aviator
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Ray-Ban Aviator Classic'), 'Thiago M.', 5, 'Classico que nunca sai de moda! Qualidade das lentes e impecavel.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Ray-Ban Aviator Classic'), 'Carla F.', 5, 'Fica lindo em qualquer rosto. Comprei nos EUA e paguei metade do preco BR.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Ray-Ban Aviator Classic'), 'Renato J.', 4, 'Oculos icoÌ‚nico, qualidade excelente. Protecao UV perfeita.', true);

-- Levi's 501
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Levi''s 501 Original'), 'Debora S.', 5, 'Jeans classico que veste perfeito! Tecido grosso e resistente. Amo!', true),
  ((SELECT id FROM catalog_products WHERE name = 'Levi''s 501 Original'), 'Mateus R.', 5, 'Melhor calca jeans que tenho. Caimento reto e atemporal. Comprem!', true),
  ((SELECT id FROM catalog_products WHERE name = 'Levi''s 501 Original'), 'Simone L.', 4, 'Otima qualidade! Nos EUA o preco e muito mais acessivel.', true);

-- Calvin Klein Eternity
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Calvin Klein Eternity EDP'), 'Fabiana A.', 5, 'Fragrancia elegante e marcante! Fixacao otima, dura ate 8 horas.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Calvin Klein Eternity EDP'), 'Luciana P.', 4, 'Perfume classico, sempre atual. Otimo para o dia a dia.', true);

-- Whey Protein
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Whey Protein Gold Standard'), 'Fernando T.', 5, 'Melhor whey que ja tomei! Sabor Double Rich Chocolate e incrivel.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Whey Protein Gold Standard'), 'Rogerio B.', 5, 'Dissolve facil, gosto bom, resultado visivel. ON nao tem erro.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Whey Protein Gold Standard'), 'Adriana M.', 4, 'Otimo produto! Preco dos EUA e imbativel. Ja encomendei 2 potes.', true);

-- Omega-3
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Omega-3 Fish Oil 120 caps'), 'Sandra K.', 4, 'Capsulas sem gosto de peixe! Otima concentracao de EPA e DHA.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Omega-3 Fish Oil 120 caps'), 'Carlos E.', 5, 'Excelente omega-3. Meu colesterol melhorou bastante. Recomendo.', true);

-- Vitamina D3
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, verified_purchase) VALUES
  ((SELECT id FROM catalog_products WHERE name = 'Vitamina D3 5000UI 180 caps'), 'Angela R.', 5, 'Melhor custo-beneficio! 180 capsulas por esse preco e surreal.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Vitamina D3 5000UI 180 caps'), 'Marcelo S.', 5, 'Medico recomendou e comprei dos EUA. Qualidade superior e preco justo.', true),
  ((SELECT id FROM catalog_products WHERE name = 'Vitamina D3 5000UI 180 caps'), 'Elaine C.', 4, 'Capsulas pequenas, faceis de engolir. Otima marca.', true);

-- ── Recalculate review_count after all inserts ──
UPDATE catalog_products SET review_count = (
  SELECT COUNT(*) FROM product_reviews WHERE product_reviews.product_id = catalog_products.id
);
