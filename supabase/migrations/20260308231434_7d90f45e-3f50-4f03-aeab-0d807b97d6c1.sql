
-- Fix overly permissive INSERT on site_events: require a visitor_id
DROP POLICY IF EXISTS "Anyone can insert site events" ON public.site_events;
CREATE POLICY "Anyone can insert site events" ON public.site_events
  FOR INSERT WITH CHECK (visitor_id IS NOT NULL AND visitor_id <> '');

-- Fix overly permissive INSERT on product_questions: require auth
DROP POLICY IF EXISTS "Authenticated users can ask questions" ON public.product_questions;
CREATE POLICY "Authenticated users can ask questions" ON public.product_questions
  FOR INSERT TO authenticated WITH CHECK (true);
