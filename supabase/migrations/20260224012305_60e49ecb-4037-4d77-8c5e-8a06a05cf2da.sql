
-- Add client_id column to product_reviews
ALTER TABLE public.product_reviews
ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.profiles(id);

-- Allow authenticated clients to insert their own reviews
CREATE POLICY "Clients insert own reviews"
ON public.product_reviews
FOR INSERT
WITH CHECK (auth.uid() = client_id);
