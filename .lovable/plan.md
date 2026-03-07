

## Diagnóstico: Migration NÃO foi aplicada

A migration `20260306130000_fix_verified_product_images.sql` **existe no repo mas NÃO foi executada no banco**. Evidências:

- **AirPods Pro 2**: DB tem `61f1YfTkTDL`, migration define `61SUj2aKoEL`
- **3 produtos VS** compartilham a mesma URL `71nK4v8BQPL` (dados da migration `120000` ainda ativos)
- **150 produtos** com URLs Amazon, muitas provavelmente retornando 404

## Plano de execução

### 1. Aplicar a migration pendente via insert tool
Executar os ~381 linhas de UPDATE statements da migration `20260306130000_fix_verified_product_images.sql` em blocos:
- **Fase 1**: Restaurar 21 URLs verificadas da Amazon (Apple, Gaming, Audio, etc.)
- **Fase 2**: Adicionar URLs oficiais de marcas (VS local, BBW, Nike, etc.)
- **Fase 3**: Blanquear URLs quebradas restantes (Amazon genéricas, Unsplash, fimgs.net) → `image_url = ''`
- Resultado: ~21 produtos com imagem real verificada, restante com `image_url = ''` que ativa o fallback `placehold.co` com nome da marca

### 2. Verificar resultado pós-execução
- Query para confirmar distribuição: quantos com URL real vs. vazio
- Testar no preview que o fallback branded placeholder funciona para produtos sem URL

### Impacto
- Produtos com URLs verificadas: imagem real da Amazon
- Produtos sem URL real: placeholder bonito com nome da marca (já funciona via `ProductImage.tsx`)
- Zero imagens quebradas/404

