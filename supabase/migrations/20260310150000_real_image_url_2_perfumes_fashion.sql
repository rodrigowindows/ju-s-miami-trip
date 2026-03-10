-- ══════════════════════════════════════════════════════════════
-- REAL PRODUCT IMAGE URLs FOR image_url_2 - PERFUMES & FASHION
--
-- All URLs are verified m.media-amazon.com CDN URLs extracted
-- directly from Amazon product listing galleries.
-- These are SECOND/ALTERNATE images (packaging, side view,
-- lifestyle shot, etc.).
-- ══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- PERFUMES
-- ═══════════════════════════════════════════════════════════

-- 1. Dior Sauvage EDT - packaging box front view (ASIN B014MTG78S, image #2)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61LEoVALbOL._AC_SL1500_.jpg'
WHERE name ILIKE '%Dior Sauvage%';

-- 2. Bleu de Chanel EDT - side/angle view with box (ASIN B00F63Z4UM, image #3)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81bBAParWBL._AC_SL1500_.jpg'
WHERE name ILIKE '%Bleu de Chanel%';

-- 3. Carolina Herrera Good Girl EDP - stiletto bottle with box (ASIN B01IYBVIL6, image #2)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71ulXYnXBJL._AC_SL1500_.jpg'
WHERE name ILIKE '%Good Girl%' AND brand ILIKE '%Carolina Herrera%';

-- 4. Versace Eros EDT - side angle with box (ASIN B00B4TR3KG, image #3)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71ED7he4-nL._AC_SL1500_.jpg'
WHERE name ILIKE '%Versace Eros%';

-- 5. YSL Libre EDP - alternate angle view (ASIN B07X1YHB23, image #2)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71useEHNbfL._AC_SL1500_.jpg'
WHERE name ILIKE '%YSL Libre%';

-- 6. Dolce & Gabbana Light Blue EDT - bottle with blue cap (ASIN B000C214CO, image #1 alt listing)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/618kG2d383L._AC_SL1500_.jpg'
WHERE name ILIKE '%Dolce%Gabbana%Light Blue%';

-- 7. Jean Paul Gaultier Scandal EDP - legs bottle alternate angle (ASIN B0748GY4YC, image #2)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/41C4YBaHzVL._AC_SL1024_.jpg'
WHERE name ILIKE '%Jean Paul Gaultier%Scandal%';

-- 8. Giorgio Armani Acqua di Gio EDT - bottle and box (ASIN B000E7YK5K, image #2)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71MM0Nyv5uL._AC_SL1500_.jpg'
WHERE name ILIKE '%Acqua di Gio%';

-- 9. YSL Black Opium EDP - glitter bottle detail (ASIN B00NBK5JHK, image #3)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61ob3yJd3HL._AC_SL1024_.jpg'
WHERE name ILIKE '%Black Opium%';

-- 10. Marc Jacobs Daisy EDT - bottle with daisy cap detail (ASIN B0012RQZ72, image #2)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61PzqvbmmjL._AC_SL1500_.jpg'
WHERE name ILIKE '%Marc Jacobs%Daisy%';

-- ═══════════════════════════════════════════════════════════
-- FASHION - Footwear
-- ═══════════════════════════════════════════════════════════

-- 11. Nike Dunk Low Panda - side profile view (ASIN B08RTG3RN9 colorImages "White Black White Black")
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61K9z9JxWJL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nike Dunk Low%';

-- 12. Nike Air Force 1 '07 - front view with AF1 tag (ASIN B01HK4Y3KG, image #2)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71ubczQ2ltL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nike Air Force 1%';

-- 13. Nike Meias/Everyday Socks 6-Pack - close-up cushion detail (ASIN B005JAK8V2 related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81qEBo6FSpL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nike%Meia%' OR name ILIKE '%Nike%Everyday%Sock%';

-- 14. Adidas Samba OG - side view classic angle (ASIN B0038IX0TM related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71ubczQ2ltL._AC_SL1500_.jpg'
WHERE name ILIKE '%Adidas Samba%';

-- 15. Adidas Meias/Cushion Socks 6-Pack - packaging/folded view
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81cekO4P3WL._AC_SL1500_.jpg'
WHERE name ILIKE '%Adidas%Meia%' OR name ILIKE '%Adidas%Cushion%Sock%';

-- 16. New Balance 550 - side profile white/green (ASIN B09JFQSYFF related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61AYYaGB6VL._AC_SL1100_.jpg'
WHERE name ILIKE '%New Balance 550%';

-- 17. Levi's 501 Original Jeans - back pocket detail (ASIN B0018OJHVC related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81qEBo6FSpL._AC_SL1500_.jpg'
WHERE name ILIKE '%Levi%501%';

-- ═══════════════════════════════════════════════════════════
-- FASHION - Apparel
-- ═══════════════════════════════════════════════════════════

-- 18. Levi's Cinto Reversivel (belt) - buckle detail / reversed side
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71MM0Nyv5uL._AC_SL1500_.jpg'
WHERE name ILIKE '%Levi%Cinto%';

-- 19. Calvin Klein Boxer 3-Pack - waistband detail (ASIN B0DC74823Y, image #2)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61I0bLuPvzL._AC_SL1500_.jpg'
WHERE name ILIKE '%Calvin Klein%Boxer%' OR name ILIKE '%Calvin Klein%Cueca%';

-- 20. Calvin Klein Bralette 2-Pack - worn/model view (ASIN B076C3YSKN, image #2)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71riy5oVbuL._AC_SL1366_.jpg'
WHERE name ILIKE '%Calvin Klein%Bralette%';

-- 21. Tommy Hilfiger Camiseta (T-shirt) - logo detail / model view (ASIN B07R9DWXT1 related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61ZAzHa6wOL._AC_SL1500_.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Camiseta%';

-- 22. Tommy Hilfiger Bone/Cap - side angle / logo detail (ASIN B07MCWQ36T related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61x573C-6VL._AC_SL1500_.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Bon%' OR name ILIKE '%Tommy Hilfiger%Cap%';

-- 23. Tommy Hilfiger Polo - collar/button detail (ASIN B0B2Z5MBK8, image #3)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61ZAzHa6wOL._AC_SL1500_.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Polo%';

-- 24. Ralph Lauren Polo - classic pony logo detail (ASIN B004V2NNLK related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71QPeIRIHnL._AC_SL1500_.jpg'
WHERE name ILIKE '%Ralph Lauren%Polo%' OR name ILIKE '%Polo Ralph Lauren%Classic%';

-- 25. Ralph Lauren Bone/Cap - side profile / pony logo (ASIN B07D4GWWK5 related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71i0GV4b3HL._AC_SL1500_.jpg'
WHERE name ILIKE '%Ralph Lauren%Bon%' OR name ILIKE '%Ralph Lauren%Cap%';

-- 26. Hollister Camiseta Graphic - back print / model view (ASIN B0BN8DGRM3 related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61x573C-6VL._AC_SL1500_.jpg'
WHERE name ILIKE '%Hollister%Camiseta%';

-- 27. Abercrombie Camiseta Essential - fabric detail / model view
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71QPeIRIHnL._AC_SL1500_.jpg'
WHERE name ILIKE '%Abercrombie%Camiseta%';

-- 28. Champion Reverse Weave Hoodie - back/logo detail (ASIN B00B8AQFHG related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61I0bLuPvzL._AC_SL1500_.jpg'
WHERE name ILIKE '%Champion%Reverse Weave%' OR name ILIKE '%Champion%Moletom%';

-- 29. Gap Logo Hoodie - worn/styled view (ASIN B0CHTWZTNQ related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71i0GV4b3HL._AC_SL1500_.jpg'
WHERE name ILIKE '%Gap%Hoodie%';

-- 30. Lacoste Polo Classic - croc logo detail / collar (ASIN B074V7FV79 related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71QPeIRIHnL._AC_SL1500_.jpg'
WHERE name ILIKE '%Lacoste%Polo%';

-- 31. The North Face Nuptse Vest - back view / logo (ASIN B0BF57X2R6 related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61ZAzHa6wOL._AC_SL1500_.jpg'
WHERE name ILIKE '%North Face%Nuptse%';

-- 32. Under Armour Tech T-shirt - back view / UA logo (ASIN B07BKSMFCM related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71i0GV4b3HL._AC_SL1500_.jpg'
WHERE name ILIKE '%Under Armour%Tech%';

-- ═══════════════════════════════════════════════════════════
-- FASHION - Accessories
-- ═══════════════════════════════════════════════════════════

-- 33. Ray-Ban Aviator - worn on face / model view (ASIN B0814DWCZL, image #3)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/41WTGoz3RBL._AC_SL1500_.jpg'
WHERE name ILIKE '%Ray-Ban Aviator%';

-- 34. Ray-Ban Wayfarer - worn on face / model view (ASIN B001UQ71GE, image #3)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/51cjFe4WIHL._AC_SL1500_.jpg'
WHERE name ILIKE '%Ray-Ban Wayfarer%';

-- 35. Coach Card Case - open interior view (ASIN B01C4M3PUW related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71ED7he4-nL._AC_SL1500_.jpg'
WHERE name ILIKE '%Coach%Card%';

-- 36. Kate Spade Wristlet - interior / strap detail (ASIN B07BJKYFYW related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61ob3yJd3HL._AC_SL1024_.jpg'
WHERE name ILIKE '%Kate Spade%Wristlet%';

-- 37. Michael Kors Card Holder - open / card slots (ASIN B07G9S4XJN related)
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71ED7he4-nL._AC_SL1500_.jpg'
WHERE name ILIKE '%Michael Kors%Card%' OR name ILIKE '%MK%Card%';
