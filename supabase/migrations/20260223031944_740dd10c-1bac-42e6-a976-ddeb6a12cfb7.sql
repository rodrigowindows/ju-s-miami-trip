
-- Create product_questions table for Q&A feature
CREATE TABLE IF NOT EXISTS public.product_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  asker_name TEXT NOT NULL DEFAULT 'Visitante',
  asker_email TEXT,
  question TEXT NOT NULL,
  answer TEXT,
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_questions ENABLE ROW LEVEL SECURITY;

-- Anyone can read questions
CREATE POLICY "Anyone can view questions"
  ON public.product_questions FOR SELECT
  USING (true);

-- Anyone can ask questions (public catalog)
CREATE POLICY "Anyone can ask questions"
  ON public.product_questions FOR INSERT
  WITH CHECK (true);

-- Admin manages all questions
CREATE POLICY "Admin manages questions"
  ON public.product_questions FOR ALL
  USING (is_admin(auth.uid()));
