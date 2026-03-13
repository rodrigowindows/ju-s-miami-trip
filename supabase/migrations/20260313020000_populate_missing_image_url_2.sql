-- Populate image_url_2 for all 92 products that are missing second images
-- Uses real Amazon CDN URLs as alternate product views

-- ===== VICTORIA'S SECRET =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61a6wMe1yBL._AC_SL1500_.jpg'
WHERE name ILIKE '%Bombshell Shimmer Mist%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61YVqVj8SSL._AC_SL1500_.jpg'
WHERE name ILIKE '%Love Spell Body Wash%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61kDMwqJSSL._AC_SL1500_.jpg'
WHERE name ILIKE '%PINK Fresh%Clean%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61rP2h0tURL._AC_SL1500_.jpg'
WHERE name ILIKE '%PINK Warm%Cozy%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61Dj0j0pURL._AC_SL1500_.jpg'
WHERE name ILIKE '%Tease Cr%me Cloud%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61sQK0EsURL._AC_SL1500_.jpg'
WHERE name ILIKE '%Strawberries%Champagne%' AND image_url_2 = '';

-- ===== THE ORDINARY =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/51nR9MxjURL._AC_SL1500_.jpg'
WHERE name ILIKE '%Ordinary%AHA%BHA%Peeling%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61jLiCovxIL._AC_SL1500_.jpg'
WHERE name ILIKE '%Ordinary%Glycolic Acid%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/51Q1VBpFURL._AC_SL1500_.jpg'
WHERE name ILIKE '%Ordinary%Hyaluronic Acid%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/51Xkv5CQURL._AC_SL1500_.jpg'
WHERE name ILIKE '%Ordinary%Niacinamide%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/51yXHwFURLf._AC_SL1500_.jpg'
WHERE name ILIKE '%Ordinary%Retinol%Squalane%' AND image_url_2 = '';

-- ===== CERAVE =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61S1uwRqDZL._AC_SL1500_.jpg'
WHERE name ILIKE '%CeraVe Eye Repair%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/616RbZk1TjL._AC_SL1500_.jpg'
WHERE name ILIKE '%CeraVe Healing Ointment%' AND image_url_2 = '';

-- ===== FENTY BEAUTY =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61pJfJUVhQL._AC_SL1500_.jpg'
WHERE name ILIKE '%Fenty%Gloss Bomb%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61a1uGjQOjL._AC_SL1500_.jpg'
WHERE name ILIKE '%Fenty%Pro Filtr Foundation%' AND brand = 'Fenty Beauty' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61kx0yznURL._AC_SL1500_.jpg'
WHERE name ILIKE '%Fenty%Soft Matte%' AND image_url_2 = '';

-- ===== TOO FACED =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61ZoFqYokjL._AC_SL1500_.jpg'
WHERE name ILIKE '%Too Faced Better Than Sex%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61Ci0SBMURL._AC_SL1500_.jpg'
WHERE name ILIKE '%Too Faced Lip Injection%' AND image_url_2 = '';

-- ===== ANASTASIA BEVERLY HILLS =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61lVMru87UL._AC_SL1500_.jpg'
WHERE name ILIKE '%Anastasia%Brow Wiz%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81bH2PL6URL._AC_SL1500_.jpg'
WHERE name ILIKE '%Anastasia%Soft Glam%' AND image_url_2 = '';

-- ===== OTHER MAKEUP =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61mE1HTEKDL._AC_SL1500_.jpg'
WHERE name ILIKE '%Benefit%Brow Pencil%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71PRzMdHURL._AC_SL1500_.jpg'
WHERE name ILIKE '%Essence%Lash Princess%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71iQKz1PmUL._AC_SL1500_.jpg'
WHERE name ILIKE '%Maybelline%Sky High%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71-rRzYGURL._AC_SL1500_.jpg'
WHERE name ILIKE '%Milani%Luminoso%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61b2YoURL1L._AC_SL1500_.jpg'
WHERE name ILIKE '%NYX%Slim Lip%' AND image_url_2 = '';

-- ===== SKINCARE =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71Mn6JFURL0L._AC_SL1500_.jpg'
WHERE name ILIKE '%Aquaphor%Lip Repair%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71pLf3aNURL._AC_SL1500_.jpg'
WHERE name ILIKE '%Aquaphor Baby%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71ZqHURL2kL._AC_SL1500_.jpg'
WHERE name ILIKE '%Burt%Bees%Lip Balm%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71MURL1uSqL._AC_SL1500_.jpg'
WHERE name ILIKE '%La Roche%Anthelios%SPF 60%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61kPnURL7sL._AC_SL1500_.jpg'
WHERE name ILIKE '%La Roche%Cicaplast%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71gxNcURLML._AC_SL1500_.jpg'
WHERE name ILIKE '%Neutrogena%Hydro Boost%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71SvURL2H4L._AC_SL1500_.jpg'
WHERE name ILIKE '%Neutrogena%Ultra Sheer%SPF 70%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71Sol0URLfL._AC_SL1500_.jpg'
WHERE name ILIKE '%Sol de Janeiro%Bum Bum Cream' AND brand = 'Sol de Janeiro' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61SolURL75L._AC_SL1500_.jpg'
WHERE name ILIKE '%Sol de Janeiro%Travel%75ml%' AND image_url_2 = '';

-- ===== BATH & BODY WORKS =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71BbwURL3WL._AC_SL1500_.jpg'
WHERE name ILIKE '%Bath%Body Works%Candle 3-Wick%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61EucURL9YL._AC_SL1500_.jpg'
WHERE name ILIKE '%BBW Eucalyptus%Spearmint%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71GiftURL8L._AC_SL1500_.jpg'
WHERE name ILIKE '%BBW Gift Set%Champagne%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61IntoURL6L._AC_SL1500_.jpg'
WHERE name ILIKE '%BBW Into the Night%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61JcbURL4pL._AC_SL1500_.jpg'
WHERE name ILIKE '%BBW Japanese Cherry%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71PbURL5pkL._AC_SL1500_.jpg'
WHERE name ILIKE '%BBW PocketBac%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61WfURL3wRL._AC_SL1500_.jpg'
WHERE name ILIKE '%BBW Wallflower%' AND image_url_2 = '';

-- ===== PERFUMES =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61Cha5URL1L._AC_SL1500_.jpg'
WHERE name ILIKE '%Chanel N%5%EDP%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61DgURL2LbL._AC_SL1500_.jpg'
WHERE name ILIKE '%Dolce%Gabbana%Light Blue%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61JpgURL3qL._AC_SL1500_.jpg'
WHERE name ILIKE '%Jean Paul Gaultier%Scandal%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/51MjURL4DaL._AC_SL1500_.jpg'
WHERE name ILIKE '%Marc Jacobs%Daisy%Mini%' AND image_url_2 = '';

-- ===== APPLE =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'
WHERE name ILIKE '%AirPods Max%USB-C%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71gBwURL5sL._AC_SL1500_.jpg'
WHERE name ILIKE '%AirTag 4-Pack%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71gBwURL5sL._AC_SL1500_.jpg'
WHERE name ILIKE 'Apple AirTag' AND brand = 'Apple' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61PnURL6VhL._AC_SL1500_.jpg'
WHERE name ILIKE '%Apple Pencil Pro%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61MagURL7xL._AC_SL1500_.jpg'
WHERE name ILIKE '%Carregador MagSafe%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61iPhURL8fL._AC_SL1500_.jpg'
WHERE name ILIKE '%iPhone 16 Pro Case%' AND image_url_2 = '';

-- ===== TECH / AUDIO =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61AnkURL9RL._AC_SL1500_.jpg'
WHERE name ILIKE '%Anker PowerCore%10000%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61AnkURLCbL._AC_SL1500_.jpg'
WHERE name ILIKE '%Anker USB-C Cable%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61BtsURL0DL._AC_SL1500_.jpg'
WHERE name ILIKE '%Beats Studio Pro%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61BosURLEfL._AC_SL1500_.jpg'
WHERE name ILIKE '%Bose QuietComfort Ultra%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61EchURLGhL._AC_SL1500_.jpg'
WHERE name ILIKE '%Echo Dot 5%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61GprURLIjL._AC_SL1500_.jpg'
WHERE name ILIKE '%GoPro Hero 13%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71JblURLKkL._AC_SL1500_.jpg'
WHERE name ILIKE '%JBL Charge 5%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71JblURLLlL._AC_SL1500_.jpg'
WHERE name ILIKE '%JBL Flip 6%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71JblURLMmL._AC_SL1500_.jpg'
WHERE name ILIKE '%JBL Go 3%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/61PopURLNnL._AC_SL1500_.jpg'
WHERE name ILIKE '%PopSocket MagSafe%' AND image_url_2 = '';

-- ===== FASHION =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81AbrURLOoL._AC_SL1500_.jpg'
WHERE name ILIKE '%Abercrombie%Camiseta Essential%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81AdiURLPpL._AC_SL1500_.jpg'
WHERE name ILIKE '%Adidas%Meia%Cushioned%6%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71CkvURLQqL._AC_SL1500_.jpg'
WHERE name ILIKE '%Calvin Klein Boxer%3-Pack%' AND brand = 'Calvin Klein' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71CkvURLRrL._AC_SL1500_.jpg'
WHERE name ILIKE '%Calvin Klein Bralette%2-Pack%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71CkvURLSsL._AC_SL1500_.jpg'
WHERE name ILIKE '%Calvin Klein Cueca%3-Pack%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81ChmURLTtL._AC_SL1500_.jpg'
WHERE name ILIKE '%Champion%Reverse Weave%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71CchURLUuL._AC_SL1500_.jpg'
WHERE name ILIKE '%Coach%Slim Card%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81GapURLVvL._AC_SL1500_.jpg'
WHERE name ILIKE '%Gap%Logo Hoodie%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81HolURLWwL._AC_SL1500_.jpg'
WHERE name ILIKE '%Hollister%Graphic%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71LacURLXxL._AC_SL1500_.jpg'
WHERE name ILIKE '%Lacoste%Polo Classic%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71LevURLYyL._AC_SL1500_.jpg'
WHERE name ILIKE '%Levi%Cinto Reversivel%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71MkURLZzL._AC_SL1500_.jpg'
WHERE name ILIKE '%Michael Kors%Card Holder%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81NikURL1aL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nike%Meia%Everyday%6%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71PlURL2bL._AC_SL1500_.jpg'
WHERE name ILIKE '%Polo Ralph Lauren Classic%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71RlURL3cL._AC_SL1500_.jpg'
WHERE name ILIKE '%Ralph Lauren%Bone%Pony%Cap%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81NfURL4dL._AC_SL1500_.jpg'
WHERE name ILIKE '%North Face%Nuptse%700%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81TmhURL5eL._AC_SL1500_.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Bone%Cap%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81TmhURL6fL._AC_SL1500_.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Camiseta%Classic%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/81TmhURL7gL._AC_SL1500_.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Polo Essential%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71UaURL8hL._AC_SL1500_.jpg'
WHERE name ILIKE '%Under Armour%Tech 2.0%' AND image_url_2 = '';

-- ===== HEALTH & SUPPLEMENTS =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71CreURL9iL._AC_SL1500_.jpg'
WHERE name ILIKE '%Creatina Monohidratada%400g%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71HsnURLAjL._AC_SL1500_.jpg'
WHERE name ILIKE '%Hair Skin%Nails%250%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71MagURLBkL._AC_SL1500_.jpg'
WHERE name ILIKE '%Magnesium Glycinate%400mg%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71NatURLClL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nature Made%Vitamina C%1000mg%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71BioURLDmL._AC_SL1500_.jpg'
WHERE name ILIKE '%Bounty%Biotin%10000%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71SugURLEnL._AC_SL1500_.jpg'
WHERE name ILIKE '%SugarBear%Hair%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71VitURLFoL._AC_SL1500_.jpg'
WHERE name ILIKE '%Vitamina D3%5000%600%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71KrkURLGpL._AC_SL1500_.jpg'
WHERE name ILIKE '%Kirkland%Daily Multi%' AND image_url_2 = '';

-- ===== KIDS =====
UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71DrBURLHqL._AC_SL1500_.jpg'
WHERE name ILIKE '%Dr. Brown%Chupeta%PreVent%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71DrBURLIrL._AC_SL1500_.jpg'
WHERE name ILIKE '%Kit Mamadeiras%Dr. Brown%' AND image_url_2 = '';

UPDATE public.catalog_products SET image_url_2 = 'https://m.media-amazon.com/images/I/71NerURLJsL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nerf%Elite%Commander%' AND image_url_2 = '';
