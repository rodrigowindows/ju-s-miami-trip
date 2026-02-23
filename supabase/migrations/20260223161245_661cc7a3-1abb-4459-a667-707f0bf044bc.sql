
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  product_id uuid NOT NULL REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(client_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own wishlists" ON public.wishlists FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients insert own wishlists" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients delete own wishlists" ON public.wishlists FOR DELETE USING (auth.uid() = client_id);
CREATE POLICY "Admin manages wishlists" ON public.wishlists FOR ALL USING (is_admin(auth.uid()));
