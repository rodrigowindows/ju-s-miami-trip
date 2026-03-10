-- Populate image_url_2 for all products with local self-hosted images
-- Each product gets a second, related image from the same category/brand

-- ═══════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Body Mists
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-lotion.jpg'
WHERE name ILIKE '%Bombshell Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-tease-edp.jpg'
WHERE name ILIKE '%Tease Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-velvet-petals-mist.jpg'
WHERE name ILIKE '%Velvet Petals%' AND name NOT ILIKE '%Velvet Petals Body Mist%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bare-vanilla-mist.jpg'
WHERE name ILIKE '%Velvet Petals Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-pure-seduction-lotion.jpg'
WHERE name ILIKE '%Pure Seduction Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-love-spell-kit.jpg'
WHERE name ILIKE '%Love Spell Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-coconut-passion-mist.jpg'
WHERE name ILIKE '%Bare Vanilla Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bare-vanilla-mist.jpg'
WHERE name ILIKE '%Coconut Passion Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-mist.jpg'
WHERE name ILIKE '%Amber Romance Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-amber-romance-mist.jpg'
WHERE name ILIKE '%Strawberries%Champagne%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-tease-mist.jpg'
WHERE name ILIKE '%Aqua Kiss Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-shimmer-mist.jpg'
WHERE name ILIKE '%Midnight Bloom Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-mist.jpg'
WHERE name ILIKE '%Bombshell Shimmer Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-pink-warm-cozy-mist.jpg'
WHERE name ILIKE '%PINK Fresh%Clean%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-pink-fresh-clean-mist.jpg'
WHERE name ILIKE '%PINK Warm%Cozy%' AND brand ILIKE '%Victoria%';

-- ═══════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Eau de Parfum
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-mist.jpg'
WHERE name ILIKE '%Bombshell Eau de Parfum%' AND name NOT ILIKE '%Intense%' AND name NOT ILIKE '%Passion%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-tease-mist.jpg'
WHERE name ILIKE '%Tease Eau de Parfum%' AND name NOT ILIKE '%Creme%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-noir-tease-edp.jpg'
WHERE name ILIKE '%Noir Tease%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-very-sexy-edp.jpg'
WHERE name ILIKE '%Very Sexy%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-edp.jpg'
WHERE name ILIKE '%Heavenly Eau de Parfum%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-intense-edp.jpg'
WHERE name ILIKE '%Bombshell Intense%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-edp.jpg'
WHERE name ILIKE '%Bombshell Passion%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-tease-edp.jpg'
WHERE name ILIKE '%Tease Cr_me Cloud%' AND brand ILIKE '%Victoria%';

-- ═══════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Body Care, Kits & Others
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-mist.jpg'
WHERE name ILIKE '%Bombshell Body Lotion%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-pure-seduction-mist.jpg'
WHERE name ILIKE '%Pure Seduction Body Lotion%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-love-spell-mist.jpg'
WHERE name ILIKE '%Love Spell%Body Wash%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-edp.jpg'
WHERE name ILIKE '%Kit Bombshell%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-pure-seduction-mist.jpg'
WHERE name ILIKE '%Kit Pure Seduction%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-love-spell-mist.jpg'
WHERE name ILIKE '%Kit Love Spell%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-mist.jpg'
WHERE name ILIKE '%Mini Mist Gift Set%' AND brand ILIKE '%Victoria%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/vs/vs-bombshell-edp.jpg'
WHERE name ILIKE '%Bombshell Rollerball%' AND brand ILIKE '%Victoria%';

-- ═══════════════════════════════════════════════════════════
-- THE ORDINARY
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/the-ordinary-hyaluronic-acid.jpg'
WHERE name ILIKE '%Ordinary%Niacinamide%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/the-ordinary-niacinamide.jpg'
WHERE name ILIKE '%Ordinary%Hyaluronic%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/the-ordinary-glycolic-acid.jpg'
WHERE name ILIKE '%Ordinary%AHA%BHA%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/the-ordinary-aha-bha-peeling.jpg'
WHERE name ILIKE '%Ordinary%Glycolic%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/the-ordinary-niacinamide.jpg'
WHERE name ILIKE '%Ordinary%Retinol%';

-- ═══════════════════════════════════════════════════════════
-- OLAPLEX
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/olaplex-no4.jpg'
WHERE name ILIKE '%Olaplex No.3%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/olaplex-no5.jpg'
WHERE name ILIKE '%Olaplex No.4%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/olaplex-no3.jpg'
WHERE name ILIKE '%Olaplex No.5%';

-- ═══════════════════════════════════════════════════════════
-- CERAVE
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/cerave-foaming-cleanser.jpg'
WHERE name ILIKE '%CeraVe Moisturizing Cream%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/cerave-moisturizing-cream.jpg'
WHERE name ILIKE '%CeraVe Foaming%';

-- ═══════════════════════════════════════════════════════════
-- MAKEUP (Fenty, Too Faced, MAC, ABH)
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/fenty-pro-filtr-foundation.jpg'
WHERE name ILIKE '%Fenty%Gloss Bomb%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/fenty-gloss-bomb.jpg'
WHERE name ILIKE '%Fenty%Pro Filt%Foundation%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/fenty-pro-filtr-soft-matte.jpg'
WHERE name ILIKE '%Fenty%Pro Filt%' AND name NOT ILIKE '%Foundation%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/too-faced-lip-injection.jpg'
WHERE name ILIKE '%Too Faced%Better Than Sex%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/too-faced-better-than-sex.jpg'
WHERE name ILIKE '%Too Faced%Lip Injection%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/charlotte-tilbury-pillow-talk.jpg'
WHERE name ILIKE '%MAC Ruby Woo%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/abh-soft-glam-palette.jpg'
WHERE name ILIKE '%Anastasia%Brow Wiz%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/abh-brow-wiz.jpg'
WHERE name ILIKE '%Anastasia%Soft Glam%';

-- ═══════════════════════════════════════════════════════════
-- OTHER BEAUTY
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/rare-beauty-soft-pinch-blush.jpg'
WHERE name ILIKE '%Rare Beauty%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/charlotte-tilbury-pillow-talk.jpg'
WHERE name ILIKE '%Charlotte Tilbury%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/dior-addict-lip-glow.jpg'
WHERE name ILIKE '%Dior Addict%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/sol-de-janeiro-travel.jpg'
WHERE name ILIKE '%Sol de Janeiro%Bum Bum%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/sol-de-janeiro-bum-bum-cream.jpg'
WHERE name ILIKE '%Sol de Janeiro%' AND name NOT ILIKE '%Bum Bum%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/dyson-airwrap-complete.jpg'
WHERE name ILIKE '%Dyson Airwrap%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/chanel-n5-edp.jpg'
WHERE name ILIKE '%Chanel N%5%' OR name ILIKE '%Chanel No%5%';

-- ═══════════════════════════════════════════════════════════
-- PERFUMES
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/perfumes/dior-sauvage-edt.jpg'
WHERE name ILIKE '%Dior Sauvage%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/perfumes/chanel-bleu-de-chanel.jpg'
WHERE name ILIKE '%Bleu de Chanel%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/perfumes/carolina-herrera-good-girl.jpg'
WHERE name ILIKE '%Carolina Herrera%Good Girl%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/perfumes/versace-eros.jpg'
WHERE name ILIKE '%Versace Eros%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/perfumes/ysl-libre.jpg'
WHERE name ILIKE '%YSL Libre%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/perfumes/dolce-gabbana-light-blue.jpg'
WHERE name ILIKE '%Dolce%Gabbana%Light Blue%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/perfumes/jpg-scandal.jpg'
WHERE name ILIKE '%Jean Paul Gaultier%Scandal%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/perfumes/armani-acqua-di-gio.jpg'
WHERE name ILIKE '%Armani%Acqua di Gio%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/perfumes/ysl-black-opium-mini.jpg'
WHERE name ILIKE '%YSL%Black Opium%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/perfumes/marc-jacobs-daisy-mini.jpg'
WHERE name ILIKE '%Marc Jacobs%Daisy%';

-- ═══════════════════════════════════════════════════════════
-- FASHION - Nike, Adidas, New Balance
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/nike-air-force-1-07.jpg'
WHERE name ILIKE '%Nike Dunk Low%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/nike-dunk-low-panda.jpg'
WHERE name ILIKE '%Nike Air Force 1%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/nike-meias-6pack.jpg'
WHERE name ILIKE '%Nike%Meia%' OR name ILIKE '%Nike%Everyday%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/adidas-samba-og.jpg'
WHERE name ILIKE '%Adidas%Meia%' OR name ILIKE '%Adidas%Cushion%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/adidas-meias-6pack.jpg'
WHERE name ILIKE '%Adidas Samba%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/new-balance-550.jpg'
WHERE name ILIKE '%New Balance 550%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/levis-cinto-reversivel.jpg'
WHERE name ILIKE '%Levis 501%' OR name ILIKE '%Levi''s 501%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/levis-501-original.jpg'
WHERE name ILIKE '%Levi%Cinto%';

-- ═══════════════════════════════════════════════════════════
-- FASHION - Calvin Klein, Tommy, Ralph Lauren, etc
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/calvin-klein-bralette-2pack.jpg'
WHERE name ILIKE '%Calvin Klein%Boxer%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/calvin-klein-boxer-3pack.jpg'
WHERE name ILIKE '%Calvin Klein%Bralette%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/tommy-hilfiger-bone-cap.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Camiseta%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/tommy-hilfiger-camiseta.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Bone%' OR name ILIKE '%Tommy Hilfiger%Cap%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/tommy-hilfiger-polo.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Polo%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/polo-ralph-lauren.jpg'
WHERE name ILIKE '%Ralph Lauren%Bone%' OR name ILIKE '%Ralph Lauren%Cap%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/ralph-lauren-bone-cap.jpg'
WHERE name ILIKE '%Ralph Lauren%Polo%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/abercrombie-camiseta-essential.jpg'
WHERE name ILIKE '%Hollister%Camiseta%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/hollister-camiseta-graphic.jpg'
WHERE name ILIKE '%Abercrombie%Camiseta%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/gap-logo-hoodie.jpg'
WHERE name ILIKE '%Champion%Reverse Weave%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/champion-reverse-weave.jpg'
WHERE name ILIKE '%Gap%Hoodie%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/lacoste-polo-classic.jpg'
WHERE name ILIKE '%Lacoste%Polo%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/north-face-nuptse-vest.jpg'
WHERE name ILIKE '%North Face%Nuptse%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/under-armour-tech.jpg'
WHERE name ILIKE '%Under Armour%Tech%';

-- ═══════════════════════════════════════════════════════════
-- FASHION - Accessories (Ray-Ban, Coach, Kate Spade, MK)
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/ray-ban-wayfarer.jpg'
WHERE name ILIKE '%Ray-Ban Aviator%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/ray-ban-aviator.jpg'
WHERE name ILIKE '%Ray-Ban Wayfarer%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/kate-spade-wristlet.jpg'
WHERE name ILIKE '%Coach%Card%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/coach-card-case.jpg'
WHERE name ILIKE '%Kate Spade%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/fashion/coach-card-case.jpg'
WHERE name ILIKE '%MK%Card%' OR name ILIKE '%Michael Kors%Card%';

-- ═══════════════════════════════════════════════════════════
-- HEALTH / SUPPLEMENTS
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/health/kirkland-vitamin-d3.jpg'
WHERE name ILIKE '%Melatonina%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/natures-bounty-biotin.jpg'
WHERE name ILIKE '%Hair Skin%Nails%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/kirkland-fish-oil.jpg'
WHERE name ILIKE '%Omega-3%' OR name ILIKE '%Fish Oil%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/melatonina-10mg-300.jpg'
WHERE name ILIKE '%Vitamin D3%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/creatina-on-300g.jpg'
WHERE name ILIKE '%Creatina%400g%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/whey-protein-gold-standard.jpg'
WHERE name ILIKE '%Creatina%300g%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/creatina-on-300g.jpg'
WHERE name ILIKE '%Whey Protein%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/kirkland-fish-oil.jpg'
WHERE name ILIKE '%Magnesium%Glycinate%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/kirkland-vitamin-d3.jpg'
WHERE name ILIKE '%Probiotico%' OR name ILIKE '%Probiótico%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/biotina-10000mcg-250.jpg'
WHERE name ILIKE '%Biotina%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/nature-made-vitc.jpg'
WHERE name ILIKE '%Ashwagandha%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/ashwagandha-600mg-180.jpg'
WHERE name ILIKE '%Centrum%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/vital-proteins-colageno.jpg'
WHERE name ILIKE '%SugarBear%Hair%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/sugarbear-hair.jpg'
WHERE name ILIKE '%Vital Proteins%' OR name ILIKE '%Colágeno%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/centrum-women-200.jpg'
WHERE name ILIKE '%Kirkland%Daily%Multi%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/health/nature-made-vitc.jpg'
WHERE name ILIKE '%Nature Made%Vit%C%';

-- ═══════════════════════════════════════════════════════════
-- LIFESTYLE (Stanley, Yeti, Kindle, BBW)
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/stanley-iceflow-30oz.jpg'
WHERE name ILIKE '%Stanley Quencher%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/stanley-quencher-40oz.jpg'
WHERE name ILIKE '%Stanley IceFlow%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/stanley-quencher.jpg'
WHERE name ILIKE '%Yeti Rambler%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/kindle-paperwhite.jpg'
WHERE name ILIKE '%Kindle%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/bbw-thousand-wishes-cream.jpg'
WHERE name ILIKE '%Bath%Body%Candle%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/bbw-candle-3wick.jpg'
WHERE name ILIKE '%Bath%Body%Japanese%Cherry%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/bbw-japanese-cherry-blossom.jpg'
WHERE name ILIKE '%Thousand Wishes%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/bbw-gift-set-champagne-toast.jpg'
WHERE name ILIKE '%Bath%Body%Wallflower%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/bbw-wallflower-refill.jpg'
WHERE name ILIKE '%Bath%Body%Gift Set%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/lifestyle/bbw-pocketbac-5pack.jpg'
WHERE name ILIKE '%Bath%Body%Hand Soap%' OR name ILIKE '%Bath%Body%Sabonete%';

-- ═══════════════════════════════════════════════════════════
-- KIDS / TOYS / BABY
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/lego-technic-ferrari.jpg'
WHERE name ILIKE '%LEGO%Millennium%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/lego-millennium-falcon.jpg'
WHERE name ILIKE '%LEGO%Ferrari%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/hot-wheels-ultimate-garage.jpg'
WHERE name ILIKE '%Barbie%Dreamhouse%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/barbie-dreamhouse.jpg'
WHERE name ILIKE '%Hot Wheels%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/play-doh-kitchen.jpg'
WHERE name ILIKE '%Squishmallow%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/squishmallows-cat.jpg'
WHERE name ILIKE '%Play-Doh%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/nerf-elite-commander.jpg'
WHERE name ILIKE '%Baby Alive%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/baby-alive-grows-up.jpg'
WHERE name ILIKE '%Nerf%Elite%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/graco-4ever-carseat.jpg'
WHERE name ILIKE '%Graco%Modes%Pramette%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/graco-modes-pramette.jpg'
WHERE name ILIKE '%Graco%4Ever%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/dr-browns-pacifier.jpg'
WHERE name ILIKE '%Dr%Brown%' AND (name ILIKE '%Mamadeira%' OR name ILIKE '%Bottle%');

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/dr-browns-kit-mamadeiras.jpg'
WHERE name ILIKE '%Dr%Brown%' AND (name ILIKE '%Pacifier%' OR name ILIKE '%Chupeta%');

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/mustela-baby-lotion.jpg'
WHERE name ILIKE '%Carter%' AND (name ILIKE '%Roupinha%' OR name ILIKE '%Onesie%');

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/carters-roupinhas-5pack.jpg'
WHERE name ILIKE '%Munchkin%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/kids/aquaphor-baby.jpg'
WHERE name ILIKE '%Mustela%';

-- ═══════════════════════════════════════════════════════════
-- TECH
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/anker-usbc-cable.jpg'
WHERE name ILIKE '%Anker%PowerBank%' OR name ILIKE '%Anker%Power Bank%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/anker-powerbank.jpg'
WHERE name ILIKE '%Anker%USB%Cable%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/popsocket-magsafe.jpg'
WHERE name ILIKE '%Apple%AirTag%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/apple-airtag.jpg'
WHERE name ILIKE '%PopSocket%MagSafe%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/anker-powerbank.jpg'
WHERE name ILIKE '%JBL%Go%';

-- ═══════════════════════════════════════════════════════════
-- APPLE PRODUCTS
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/apple-airtag.jpg'
WHERE name ILIKE '%AirPods Pro%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/popsocket-magsafe.jpg'
WHERE name ILIKE '%iPhone 16 Pro%' AND name NOT ILIKE '%Case%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/apple-airtag.jpg'
WHERE name ILIKE '%iPhone 16%Case%MagSafe%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/jbl-go3.jpg'
WHERE name ILIKE '%MacBook Air%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/apple-airtag.jpg'
WHERE name ILIKE '%iPad Pro%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/popsocket-magsafe.jpg'
WHERE name ILIKE '%Apple Watch%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/jbl-go3.jpg'
WHERE name ILIKE '%PlayStation%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/tech/apple-airtag.jpg'
WHERE name ILIKE '%Nintendo Switch%';

-- ═══════════════════════════════════════════════════════════
-- MORE BEAUTY PRODUCTS (misc)
-- ═══════════════════════════════════════════════════════════
UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/neutrogena-spf70.jpg'
WHERE name ILIKE '%Neutrogena%Hydro Boost%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/neutrogena-hydro-boost.jpg'
WHERE name ILIKE '%Neutrogena%SPF%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/laroche-cicaplast.jpg'
WHERE name ILIKE '%La Roche%Anthelios%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/laroche-anthelios-spf60.jpg'
WHERE name ILIKE '%La Roche%Cicaplast%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/laneige-lip-mask.jpg'
WHERE name ILIKE '%Laneige%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/glow-recipe-dew-drops.jpg'
WHERE name ILIKE '%Glow Recipe%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/supergoop-unseen.jpg'
WHERE name ILIKE '%Supergoop%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/drunk-elephant-protini.jpg'
WHERE name ILIKE '%Drunk Elephant%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/elf-halo-glow.jpg'
WHERE name ILIKE '%e.l.f.%' OR name ILIKE '%elf %Halo%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/essence-lash-princess.jpg'
WHERE name ILIKE '%Essence%Lash%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/maybelline-sky-high.jpg'
WHERE name ILIKE '%Maybelline%Sky High%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/milani-blush-luminoso.jpg'
WHERE name ILIKE '%Milani%Blush%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/nyx-lip-liner.jpg'
WHERE name ILIKE '%NYX%Lip%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/essie-nail-polish.jpg'
WHERE name ILIKE '%Essie%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/opi-nail-lacquer.jpg'
WHERE name ILIKE '%OPI%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/sally-hansen-miracle-gel.jpg'
WHERE name ILIKE '%Sally Hansen%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/tower28-lip-jelly.jpg'
WHERE name ILIKE '%Tower 28%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/burts-bees-lip-balm.jpg'
WHERE name ILIKE '%Burt%Bees%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/aquaphor-lip-repair.jpg'
WHERE name ILIKE '%Aquaphor%Lip%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/bioderma-sensibio-100ml.jpg'
WHERE name ILIKE '%Bioderma%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/benefit-brow-pencil.jpg'
WHERE name ILIKE '%Benefit%Brow%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/cerave-eye-repair.jpg'
WHERE name ILIKE '%CeraVe%Eye%';

UPDATE public.catalog_products SET image_url_2 = '/images/products/beauty/cerave-healing-ointment.jpg'
WHERE name ILIKE '%CeraVe%Healing%';
