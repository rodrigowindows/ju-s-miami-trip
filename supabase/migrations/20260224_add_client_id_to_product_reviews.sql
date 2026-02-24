-- Add client_id column to product_reviews so reviews can be linked to authenticated users
ALTER TABLE public.product_reviews
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Allow authenticated users to insert their own reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'product_reviews' AND policyname = 'Users can create own reviews'
  ) THEN
    CREATE POLICY "Users can create own reviews"
      ON public.product_reviews
      FOR INSERT
      WITH CHECK (auth.uid() = client_id);
  END IF;
END $$;
