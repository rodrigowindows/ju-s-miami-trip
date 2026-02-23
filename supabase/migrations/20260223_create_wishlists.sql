-- Create wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(client_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Client can only see their own wishlists
CREATE POLICY "Clients can view own wishlists"
  ON public.wishlists FOR SELECT
  USING (auth.uid() = client_id);

-- Client can insert into their own wishlists
CREATE POLICY "Clients can insert own wishlists"
  ON public.wishlists FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Client can delete their own wishlists
CREATE POLICY "Clients can delete own wishlists"
  ON public.wishlists FOR DELETE
  USING (auth.uid() = client_id);

-- Admin can see all wishlists
CREATE POLICY "Admins can view all wishlists"
  ON public.wishlists FOR SELECT
  USING (public.is_admin(auth.uid()));
