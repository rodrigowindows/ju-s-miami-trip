# Recomendações de melhoria (UX, conversão e performance)

Este documento reúne melhorias sugeridas com base nos prints de referência compartilhados (homepages de e-commerce grandes e logs de execução), para aplicar no projeto.

## 1) Acima da dobra (first screen)

- Definir proposta de valor em 1 frase curta e objetiva (o que vende + para quem + benefício principal).
- Incluir CTA primário bem visível (ex.: "Ver catálogo") e CTA secundário (ex.: "Como funciona").
- Exibir sinais de confiança logo no topo: prazo médio, segurança de pagamento, reputação e suporte.

## 2) Navegação e descoberta

- Simplificar header para reduzir fricção: categorias principais + busca + carrinho.
- Melhorar busca com autocomplete e correções de digitação.
- Adicionar filtros progressivos por categoria, faixa de preço, marca e disponibilidade.

## 3) Estrutura de vitrine e conteúdo

- Organizar a home em blocos claros:
  1. Banner principal
  2. Coleções/categorias
  3. Produtos em destaque
  4. Promoções limitadas
  5. Prova social (reviews)
  6. FAQ e suporte
- Evitar excesso de banners longos; priorizar blocos com intenção de compra.

## 4) Conversão (CRO)

- Mostrar benefícios de compra próximos ao preço (frete, prazo, parcelamento, troca).
- Inserir gatilhos de urgência reais e transparentes (estoque baixo, promo até data X).
- Destacar avaliações com nota média e número de reviews em cards e páginas de produto.
- Reforçar recuperação de carrinho (WhatsApp/email) e lista de desejos com lembrete de preço.

## 5) Mobile-first

- Revisar densidade de informação no mobile (menos blocos por dobra, textos mais curtos).
- Tornar CTA de compra "sticky" nas páginas de produto.
- Garantir que busca, filtros e carrinho tenham fluxo de 1 mão (thumb-friendly).

## 6) Performance e qualidade técnica

- Priorizar LCP: banner principal otimizado e com tamanho adequado.
- Ativar lazy loading para imagens abaixo da dobra.
- Reduzir JS inicial em páginas de catálogo com code splitting por rota.
- Monitorar Core Web Vitals (LCP, INP, CLS) com metas objetivas por sprint.

## 7) SEO e aquisição

- Definir titles e descriptions únicos por página (catálogo, categoria, produto).
- Estruturar dados (Schema.org) para produto, preço, disponibilidade e review.
- Melhorar páginas institucionais de confiança: trocas, envios, prazos e contato.

## 8) Métricas e experimentação

- Instrumentar funil completo: home -> categoria -> produto -> carrinho -> checkout.
- Acompanhar eventos de busca, uso de filtros, abandono e cliques em CTA.
- Rodar testes A/B em:
  - Hero principal (headline e criativo)
  - Ordem dos blocos da home
  - Formato de card de produto
  - Mensagens de frete e prazo

## Priorização sugerida (impacto x esforço)

### Curto prazo (1-2 semanas)
- Ajustar hero e CTAs.
- Reorganizar blocos da home por intenção.
- Exibir prova social e benefícios de compra nos cards.

### Médio prazo (2-4 semanas)
- Melhorar busca/autocomplete e filtros.
- Implementar eventos de analytics de funil e dashboards.
- Otimizações de performance em mídia e bundle.

### Longo prazo (4+ semanas)
- Programa contínuo de A/B testing.
- Personalização por comportamento (vistos recentemente, recomendações por perfil).
- Estratégia SEO técnica com conteúdo de categoria/marca.
