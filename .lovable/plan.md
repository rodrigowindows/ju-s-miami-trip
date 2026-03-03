

## Resumo

O código do frontend (tracking de eventos + dashboard analytics) já está implementado. Falta apenas criar a tabela `site_events` no banco de dados via migration.

## Plano

### 1. Criar migration para a tabela `site_events`

Executar a SQL de `src/sql/site_events.sql` como migration no banco:

- Criar tabela `site_events` com colunas: `id`, `event_type`, `visitor_id`, `user_id`, `product_id`, `product_name`, `product_brand`, `product_category`, `product_price_brl`, `page_path`, `referrer`, `user_agent`, `screen_width`, `metadata`, `created_at`
- Criar índices para performance: `event_type`, `created_at DESC`, `visitor_id`, `product_id`, e composto `(event_type, created_at DESC)`
- Habilitar RLS com 2 políticas:
  - **INSERT**: Qualquer visitante pode inserir (anônimo)
  - **SELECT**: Apenas admins podem visualizar (usando `is_admin(auth.uid())` em vez da query direta na tabela profiles, seguindo o padrão existente)

### Ajuste na RLS

A SQL original usa `EXISTS (SELECT 1 FROM profiles WHERE ...)` para o SELECT policy. Vou usar `is_admin(auth.uid())` que já existe no projeto e é mais seguro (SECURITY DEFINER, evita recursão).

### Resultado

Após a migration, os eventos começam a ser gravados automaticamente quando visitantes acessam o catálogo, e o dashboard em `/admin/analytics` passa a mostrar dados reais.

