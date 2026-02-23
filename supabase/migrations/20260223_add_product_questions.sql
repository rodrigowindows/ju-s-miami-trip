-- Product Q&A table (public questions like Mercado Livre)
CREATE TABLE IF NOT EXISTS product_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES catalog_products(id) ON DELETE CASCADE,
  asker_name TEXT NOT NULL DEFAULT 'Visitante',
  asker_email TEXT, -- optional, for email notification when answered
  question TEXT NOT NULL,
  answer TEXT, -- null until admin answers
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast product lookups
CREATE INDEX IF NOT EXISTS idx_product_questions_product_id ON product_questions(product_id);

-- RLS policies
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;

-- Anyone can read questions (public)
CREATE POLICY "Anyone can read product questions"
  ON product_questions FOR SELECT
  USING (true);

-- Anyone can insert a question (public form)
CREATE POLICY "Anyone can ask a question"
  ON product_questions FOR INSERT
  WITH CHECK (true);

-- Only admins can update (to answer)
CREATE POLICY "Admins can update questions"
  ON product_questions FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can delete
CREATE POLICY "Admins can delete questions"
  ON product_questions FOR DELETE
  USING (public.is_admin(auth.uid()));
