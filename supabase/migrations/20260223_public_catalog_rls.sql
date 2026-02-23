-- Allow anonymous users to view active catalog products (for public catalog page)
DROP POLICY IF EXISTS "Anyone can view active catalog products" ON catalog_products;
CREATE POLICY "Anyone can view active catalog products" ON catalog_products
  FOR SELECT USING (active = true);

-- Allow anonymous users to invoke get-exchange-rate (settings read for anon)
-- Note: The Edge Function uses service_role so this is not strictly needed,
-- but keeping the existing authenticated policy intact.
