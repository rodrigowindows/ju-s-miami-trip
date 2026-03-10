-- Add second image URL column to catalog_products
ALTER TABLE public.catalog_products
  ADD COLUMN IF NOT EXISTS image_url_2 text NOT NULL DEFAULT '';
