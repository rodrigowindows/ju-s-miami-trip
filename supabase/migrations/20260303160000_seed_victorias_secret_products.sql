-- ============================================================
-- Seed: Victoria's Secret products
-- ============================================================

INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
(
  'Victoria''s Secret Bombshell Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  25.00,
  '/images/products/vs/vs-bombshell-mist.jpg',
  'Body mist icônico com notas de maracujá roxo, peônia e baunilha. Fragrância mais vendida da Victoria''s Secret.',
  true
),
(
  'Victoria''s Secret Tease Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  25.00,
  '/images/products/vs/vs-tease-mist.jpg',
  'Body mist sedutor com notas de pera branca, gardênia e pralinê. Sofisticado e envolvente.',
  true
),
(
  'Victoria''s Secret Velvet Petals Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-velvet-petals-mist.jpg',
  'Body mist floral com notas de pétalas cremosas e cacau dourado. Delicado e feminino.',
  true
),
(
  'Victoria''s Secret Pure Seduction Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-pure-seduction-mist.jpg',
  'Body mist frutado com notas de ameixa vermelha e frésia. Clássico best-seller VS.',
  true
),
(
  'Victoria''s Secret Love Spell Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-love-spell-mist.jpg',
  'Body mist romântico com notas de cereja e flor de pêssego. Um dos mais populares da marca.',
  true
),
(
  'Victoria''s Secret Bombshell Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.50,
  '/images/products/vs/vs-bombshell-edp.jpg',
  'Eau de Parfum premium com notas de maracujá roxo, peônia de Shangri-La e baunilha de Madagáscar.',
  true
),
(
  'Victoria''s Secret Tease Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.50,
  '/images/products/vs/vs-tease-edp.jpg',
  'Eau de Parfum sofisticado com notas de pera branca, gardênia e pralinê torrado.',
  true
),
(
  'Victoria''s Secret Bombshell Body Lotion 236ml',
  'Victoria''s Secret',
  'Beauty',
  22.00,
  '/images/products/vs/vs-bombshell-lotion.jpg',
  'Loção corporal hidratante com a fragrância Bombshell. Pele macia e perfumada o dia todo.',
  true
),
(
  'Victoria''s Secret Pure Seduction Body Lotion 236ml',
  'Victoria''s Secret',
  'Beauty',
  18.50,
  '/images/products/vs/vs-pure-seduction-lotion.jpg',
  'Loção corporal com fragrância Pure Seduction. Hidratação e perfume em um só produto.',
  true
),
(
  'Victoria''s Secret Bare Vanilla Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-bare-vanilla-mist.jpg',
  'Body mist doce com notas de baunilha e musk. Perfeito para o dia a dia.',
  true
),
(
  'Victoria''s Secret Coconut Passion Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-coconut-passion-mist.jpg',
  'Body mist tropical com notas de coco e lírio branco. Sensação de verão o ano todo.',
  true
),
(
  'Victoria''s Secret Kit Bombshell 3 Peças',
  'Victoria''s Secret',
  'Perfumes',
  45.00,
  '/images/products/vs/vs-bombshell-kit.jpg',
  'Kit com body mist, loção corporal e shower gel na fragrância Bombshell. Presente perfeito.',
  true
),
(
  'Victoria''s Secret Amber Romance Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-amber-romance-mist.jpg',
  'Body mist quente com notas de flor de cerejeira preta e creme chantilly. Sensual e acolhedor.',
  true
),
(
  'Victoria''s Secret Noir Tease Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.50,
  '/images/products/vs/vs-noir-tease-edp.jpg',
  'Eau de Parfum misterioso com notas de pera preta, gardênia e baunilha negra.',
  true
),
(
  'Victoria''s Secret Strawberries & Champagne Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-strawberries-champagne-mist.jpg',
  'Body mist festivo com notas de morango fresco e champagne. Divertido e efervescente.',
  true
),
(
  'Victoria''s Secret Very Sexy Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.50,
  '/images/products/vs/vs-very-sexy-edp.jpg',
  'Eau de Parfum intenso com notas de orquídea negra, cravo da índia e baunilha. Para mulheres ousadas.',
  true
)
ON CONFLICT DO NOTHING;
