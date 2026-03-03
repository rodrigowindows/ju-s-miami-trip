-- ============================================================
-- Seed: Victoria's Secret products
-- ============================================================

INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
(
  'Victoria''s Secret Bombshell Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  25.00,
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop',
  'Body mist icônico com notas de maracujá roxo, peônia e baunilha. Fragrância mais vendida da Victoria''s Secret.',
  true
),
(
  'Victoria''s Secret Tease Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  25.00,
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
  'Body mist sedutor com notas de pera branca, gardênia e pralinê. Sofisticado e envolvente.',
  true
),
(
  'Victoria''s Secret Velvet Petals Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop',
  'Body mist floral com notas de pétalas cremosas e cacau dourado. Delicado e feminino.',
  true
),
(
  'Victoria''s Secret Pure Seduction Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://images.unsplash.com/photo-1590156546946-ce55a12a09e0?w=400&h=400&fit=crop',
  'Body mist frutado com notas de ameixa vermelha e frésia. Clássico best-seller VS.',
  true
),
(
  'Victoria''s Secret Love Spell Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://images.unsplash.com/photo-1595535352626-4ea5e6c0ad24?w=400&h=400&fit=crop',
  'Body mist romântico com notas de cereja e flor de pêssego. Um dos mais populares da marca.',
  true
),
(
  'Victoria''s Secret Bombshell Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.50,
  'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop',
  'Eau de Parfum premium com notas de maracujá roxo, peônia de Shangri-La e baunilha de Madagáscar.',
  true
),
(
  'Victoria''s Secret Tease Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.50,
  'https://images.unsplash.com/photo-1594035910387-fea081e38543?w=400&h=400&fit=crop',
  'Eau de Parfum sofisticado com notas de pera branca, gardênia e pralinê torrado.',
  true
),
(
  'Victoria''s Secret Bombshell Body Lotion 236ml',
  'Victoria''s Secret',
  'Beauty',
  22.00,
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
  'Loção corporal hidratante com a fragrância Bombshell. Pele macia e perfumada o dia todo.',
  true
),
(
  'Victoria''s Secret Pure Seduction Body Lotion 236ml',
  'Victoria''s Secret',
  'Beauty',
  18.50,
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
  'Loção corporal com fragrância Pure Seduction. Hidratação e perfume em um só produto.',
  true
),
(
  'Victoria''s Secret Bare Vanilla Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
  'Body mist doce com notas de baunilha e musk. Perfeito para o dia a dia.',
  true
),
(
  'Victoria''s Secret Coconut Passion Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
  'Body mist tropical com notas de coco e lírio branco. Sensação de verão o ano todo.',
  true
),
(
  'Victoria''s Secret Kit Bombshell 3 Peças',
  'Victoria''s Secret',
  'Perfumes',
  45.00,
  'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop',
  'Kit com body mist, loção corporal e shower gel na fragrância Bombshell. Presente perfeito.',
  true
),
(
  'Victoria''s Secret Amber Romance Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400&h=400&fit=crop',
  'Body mist quente com notas de flor de cerejeira preta e creme chantilly. Sensual e acolhedor.',
  true
),
(
  'Victoria''s Secret Noir Tease Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.50,
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop',
  'Eau de Parfum misterioso com notas de pera preta, gardênia e baunilha negra.',
  true
),
(
  'Victoria''s Secret Strawberries & Champagne Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop',
  'Body mist festivo com notas de morango fresco e champagne. Divertido e efervescente.',
  true
),
(
  'Victoria''s Secret Very Sexy Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.50,
  'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop',
  'Eau de Parfum intenso com notas de orquídea negra, cravo da índia e baunilha. Para mulheres ousadas.',
  true
)
ON CONFLICT DO NOTHING;
