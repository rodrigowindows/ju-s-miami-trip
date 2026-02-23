-- Fix whatsapp_templates: the live DB has (name, template) but code expects (slug, title, icon, template_text)
-- Add missing columns and migrate existing data

ALTER TABLE whatsapp_templates ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE whatsapp_templates ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE whatsapp_templates ADD COLUMN IF NOT EXISTS icon TEXT NOT NULL DEFAULT '📝';
ALTER TABLE whatsapp_templates ADD COLUMN IF NOT EXISTS template_text TEXT;

-- Migrate existing data: name → slug + title, template → template_text
UPDATE whatsapp_templates
SET
  slug = COALESCE(slug, LOWER(REPLACE(name, ' ', '_'))),
  title = COALESCE(title, name),
  template_text = COALESCE(template_text, template)
WHERE slug IS NULL OR title IS NULL OR template_text IS NULL;

-- Make columns NOT NULL now that data is migrated
ALTER TABLE whatsapp_templates ALTER COLUMN slug SET NOT NULL;
ALTER TABLE whatsapp_templates ALTER COLUMN title SET NOT NULL;
ALTER TABLE whatsapp_templates ALTER COLUMN template_text SET NOT NULL;

-- Add unique constraint on slug if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'whatsapp_templates_slug_key') THEN
    ALTER TABLE whatsapp_templates ADD CONSTRAINT whatsapp_templates_slug_key UNIQUE (slug);
  END IF;
END $$;

-- Seed default templates if table is empty
INSERT INTO whatsapp_templates (slug, title, icon, template_text) VALUES
  ('orcamento', 'Orçamento Pronto', '💰', E'Olá {nome_cliente}! 😊\n\nSeu orçamento para o pedido {numero_pedido} ficou pronto!\n\n📦 Itens: {itens}\n💵 Valor total: {valor_total}\n💳 Sinal: {valor_sinal}\n\nPosso confirmar o pedido?'),
  ('confirmacao', 'Confirmação de Pedido', '✅', E'Oi {nome_cliente}! ✅\n\nSeu pedido {numero_pedido} foi confirmado!\n\n📦 {itens}\n💵 Total: {valor_total}\n\nAssim que comprarmos, te avisamos! 🛍️'),
  ('comprado', 'Produto Comprado', '🛍️', E'Oi {nome_cliente}! 🎉\n\nSeu pedido {numero_pedido} foi comprado com sucesso!\n\n📦 {itens}\n\nAgora é só aguardar a viagem para o Brasil! ✈️'),
  ('em_transito', 'Em Trânsito', '✈️', E'Oi {nome_cliente}! ✈️\n\nSeu pedido {numero_pedido} está a caminho do Brasil!\n\n🧳 Viagem: {codigo_viagem}\n📦 {itens}\n\nAssim que chegar, te avisamos! 📲'),
  ('chegou', 'Chegou no Brasil', '🇧🇷', E'Oi {nome_cliente}! 🇧🇷\n\nSeu pedido {numero_pedido} chegou no Brasil!\n\n📦 {itens}\n\nVamos combinar a entrega? Me manda seu endereço e melhor horário! 📍'),
  ('entrega', 'Entrega Agendada', '📦', E'Oi {nome_cliente}! 📦\n\nSeu pedido {numero_pedido} está pronto para entrega!\n\n📦 {itens}\n💵 Saldo restante: {valor_total}\n\nConfirma o endereço e horário? 🏠')
ON CONFLICT (slug) DO NOTHING;
