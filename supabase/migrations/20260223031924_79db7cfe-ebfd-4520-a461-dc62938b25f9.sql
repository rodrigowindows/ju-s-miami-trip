
-- Add missing columns to whatsapp_templates
ALTER TABLE public.whatsapp_templates
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS template_text TEXT;

-- Migrate existing data
UPDATE public.whatsapp_templates
SET
  title = name,
  slug = lower(replace(name, ' ', '_')),
  template_text = template
WHERE title IS NULL;
