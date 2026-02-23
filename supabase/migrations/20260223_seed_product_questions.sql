-- ============================================================
-- MalaBridge - Seed Product Questions (Q&A)
-- Perguntas e respostas estilo Mercado Livre / Amazon
-- Run in Supabase SQL Editor
-- ============================================================

-- Insert questions using product names to find IDs dynamically
-- This avoids hardcoded UUIDs

-- ===== iPhone 16 Pro Max =====
INSERT INTO public.product_questions (product_id, asker_name, asker_email, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'iPhone 16 Pro Max 256GB' LIMIT 1),
  'Mariana Souza', 'mariana@email.com',
  'Vem com nota fiscal americana? Tem garantia no Brasil?',
  'Sim! Enviamos a nota fiscal (receipt) original da Apple Store americana. A garantia Apple e internacional, entao voce pode usar em qualquer Apple Store do Brasil.',
  now() - interval '2 days',
  now() - interval '5 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'iPhone 16 Pro Max 256GB' LIMIT 1),
  'Rafael Lima', null,
  'Qual a diferenca de preco comparado a comprar aqui no Brasil?',
  'O iPhone 16 Pro Max 256GB custa em media R$ 10.499 no Brasil. Com a gente voce economiza de R$ 1.500 a R$ 2.000 dependendo da cotacao do dia!',
  now() - interval '1 day',
  now() - interval '3 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'iPhone 16 Pro Max 256GB' LIMIT 1),
  'Camila Ferreira', 'camilaf@gmail.com',
  'Posso escolher a cor? Quero o Titanium Desert.',
  'Claro! Na hora do pedido voce escolhe a cor. Temos todas as opcoes: Natural, Blue, White e Desert Titanium.',
  now() - interval '12 hours',
  now() - interval '2 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'iPhone 16 Pro Max 256GB' LIMIT 1),
  'Joao Pedro', null,
  'Vem desbloqueado? Funciona com qualquer operadora?',
  null, null,
  now() - interval '6 hours'
);

-- ===== AirPods Pro 2 =====
INSERT INTO public.product_questions (product_id, asker_name, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'AirPods Pro 2' LIMIT 1),
  'Beatriz Santos',
  'Esse e o modelo com USB-C ou Lightning?',
  'E o modelo mais recente com USB-C! Case com MagSafe e alto-falante integrado para Find My.',
  now() - interval '1 day',
  now() - interval '4 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'AirPods Pro 2' LIMIT 1),
  'Lucas Oliveira',
  'Funciona bem para academia? E resistente a suor?',
  'Sim! Os AirPods Pro 2 tem classificacao IPX4, resistente a suor e respingos dagua. Perfeito para treino.',
  now() - interval '3 days',
  now() - interval '6 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'AirPods Pro 2' LIMIT 1),
  'Ana Clara',
  'Tem gravacao gratis na case igual no site da Apple?',
  null, null,
  now() - interval '1 day'
);

-- ===== MacBook Air M3 =====
INSERT INTO public.product_questions (product_id, asker_name, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'MacBook Air M3 15"' LIMIT 1),
  'Pedro Henrique',
  'Vem com teclado em ingles ou portugues?',
  'Vem com teclado americano (ingles). Mas voce pode usar layout portugues via software sem problemas. Muita gente prefere o teclado US!',
  now() - interval '2 days',
  now() - interval '5 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'MacBook Air M3 15"' LIMIT 1),
  'Fernanda Costa',
  'Consigo parcelar o pagamento?',
  'Sim! O sinal e de 50% e o restante voce paga quando o produto chegar no Brasil. Aceitamos PIX e transferencia.',
  now() - interval '1 day',
  now() - interval '3 days'
);

-- ===== Dyson Airwrap =====
INSERT INTO public.product_questions (product_id, asker_name, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'Dyson Airwrap Complete' LIMIT 1),
  'Carolina Mendes',
  'Precisa de transformador? A voltagem e diferente?',
  'O Dyson Airwrap americano e bivolt (110-240V), entao funciona perfeitamente no Brasil sem transformador! Pode usar direto na tomada.',
  now() - interval '1 day',
  now() - interval '4 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'Dyson Airwrap Complete' LIMIT 1),
  'Isabela Rodrigues',
  'Vem com todos os 6 acessorios? E a versao mais nova?',
  'Sim! E o kit Complete com todos os 6 acessorios: 2 barrels (30mm e 40mm), escova suavizante, escova firma, difusor e pente Coanda. Versao 2024.',
  now() - interval '12 hours',
  now() - interval '2 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'Dyson Airwrap Complete' LIMIT 1),
  'Gabriela Lima',
  'No Brasil custa quase R$ 5.000. Qual o preco final com voces?',
  null, null,
  now() - interval '8 hours'
);

-- ===== Nike Dunk Low Panda =====
INSERT INTO public.product_questions (product_id, asker_name, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'Nike Dunk Low Panda' LIMIT 1),
  'Thiago Almeida',
  'Tem numeracao brasileira ou americana?',
  'Compramos na numeracao americana (US). Temos uma tabela de conversao! Ex: BR 40 = US 8, BR 42 = US 10. Me manda seu numero BR que eu converto.',
  now() - interval '2 days',
  now() - interval '5 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'Nike Dunk Low Panda' LIMIT 1),
  'Juliana Martins',
  'E original? Como sei que nao e replica?',
  'Todos os produtos sao 100% originais comprados nas lojas oficiais (Nike Store, Foot Locker, etc). Enviamos foto da nota fiscal e do recibo de compra!',
  now() - interval '1 day',
  now() - interval '3 days'
);

-- ===== Rare Beauty Blush =====
INSERT INTO public.product_questions (product_id, asker_name, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'Rare Beauty Soft Pinch Blush' LIMIT 1),
  'Amanda Silva',
  'Quais cores disponiveis? Quero o Joy e o Happy.',
  'Temos todas as cores! Joy (rosa medio), Happy (coral quente), Bliss (rosa claro), Love (rosa escuro) e mais. Pode pedir quantas quiser!',
  now() - interval '3 days',
  now() - interval '7 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'Rare Beauty Soft Pinch Blush' LIMIT 1),
  'Larissa Pereira',
  'E o liquido ou o em po?',
  'Esse e o Liquid Blush (liquido), que e o viral do TikTok! Tambem temos o em po se preferir.',
  now() - interval '1 day',
  now() - interval '4 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'Rare Beauty Soft Pinch Blush' LIMIT 1),
  'Patricia Nunes',
  'Quanto tempo demora pra chegar?',
  null, null,
  now() - interval '5 hours'
);

-- ===== Stanley Quencher =====
INSERT INTO public.product_questions (product_id, asker_name, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'Stanley Quencher H2.0 40oz' LIMIT 1),
  'Renata Alves',
  'Tem as cores novas? Quero a cor Citron ou a Orchid.',
  'Sim! Buscamos direto na Stanley Store e no Target. Sempre temos as cores da temporada. Citron, Orchid, Rose Quartz, todas!',
  now() - interval '2 days',
  now() - interval '5 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'Stanley Quencher H2.0 40oz' LIMIT 1),
  'Diego Santos',
  'Cabe no porta-copos do carro?',
  'O Quencher 40oz e um pouco grande para alguns porta-copos. Se quiser um que cabe certeza, temos o 30oz tambem! Me avisa qual prefere.',
  now() - interval '1 day',
  now() - interval '3 days'
);

-- ===== PlayStation 5 =====
INSERT INTO public.product_questions (product_id, asker_name, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'PlayStation 5 Slim' LIMIT 1),
  'Marcos Vieira',
  'Roda jogos brasileiros? A PSN funciona normal?',
  'Sim! O PS5 americano e desbloqueado por regiao. Voce pode usar sua conta PSN brasileira normalmente e comprar jogos na PS Store Brasil.',
  now() - interval '2 days',
  now() - interval '6 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'PlayStation 5 Slim' LIMIT 1),
  'Felipe Rodrigues',
  'Vem com algum jogo incluso?',
  'O modelo padrao nao vem com jogo. Mas se quiser, posso comprar jogos junto! God of War, Spider-Man 2, etc. E bem mais barato la.',
  now() - interval '1 day',
  now() - interval '4 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'PlayStation 5 Slim' LIMIT 1),
  'Bruno Costa',
  'Qual a voltagem? Precisa de transformador?',
  null, null,
  now() - interval '10 hours'
);

-- ===== Perfume Chanel N5 =====
INSERT INTO public.product_questions (product_id, asker_name, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'Perfume Chanel N5 EDP 100ml' LIMIT 1),
  'Cristina Oliveira',
  'E original da Chanel? Compra onde?',
  'Compramos direto na Chanel Store ou na Sephora americana. Produto 100% original com selo e batch code verificavel.',
  now() - interval '3 days',
  now() - interval '7 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'Perfume Chanel N5 EDP 100ml' LIMIT 1),
  'Sandra Lima',
  'Tem outros perfumes da Chanel? Quero o Coco Mademoiselle tambem.',
  'Temos! Coco Mademoiselle, Chance, Bleu de Chanel, Allure... Todos os perfumes Chanel sao bem mais baratos nos EUA. Me manda a lista do que quer!',
  now() - interval '1 day',
  now() - interval '3 days'
);

-- ===== Kindle Paperwhite =====
INSERT INTO public.product_questions (product_id, asker_name, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'Kindle Paperwhite 11a Geracao' LIMIT 1),
  'Roberto Mendes',
  'Funciona com livros em portugues normalmente?',
  'Funciona perfeitamente! O Kindle aceita livros em qualquer idioma. Voce usa sua conta Amazon Brasil normal. Toda sua biblioteca funciona.',
  now() - interval '2 days',
  now() - interval '5 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'Kindle Paperwhite 11a Geracao' LIMIT 1),
  'Daniela Ferreira',
  'Qual a diferenca pro Kindle normal?',
  null, null,
  now() - interval '1 day'
);

-- ===== Ray-Ban Aviator =====
INSERT INTO public.product_questions (product_id, asker_name, question, answer, answered_at, created_at) VALUES
(
  (SELECT id FROM catalog_products WHERE name = 'Ray-Ban Aviator Classic' LIMIT 1),
  'Vinicius Almeida',
  'Vem com estojo e certificado de autenticidade?',
  'Sim! Vem na caixinha original Ray-Ban com estojo, paninho de limpeza e certificado. Tudo original, como se voce comprasse na loja.',
  now() - interval '1 day',
  now() - interval '4 days'
),
(
  (SELECT id FROM catalog_products WHERE name = 'Ray-Ban Aviator Classic' LIMIT 1),
  'Tatiana Costa',
  'Tem outros modelos alem do Aviator? Quero o Wayfarer.',
  null, null,
  now() - interval '12 hours'
);
