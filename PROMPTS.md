# PROMPTS - Aju Vai Para Miami

Coleção de prompts para usar com IA (Claude, Lovable, Cursor, etc.) no desenvolvimento do projeto.

---

## PROMPT 1 - CONTEXTO MASTER DO PROJETO

Use este prompt no início de qualquer sessão para dar contexto completo à IA.

```
Você é um desenvolvedor sênior trabalhando no projeto "Aju Vai Para Miami" — um e-commerce brasileiro de personal shopper que compra produtos nos EUA (Miami) e entrega no Brasil.

## Stack Técnica
- React 18 + TypeScript + Vite 5
- Tailwind CSS 3.4 com tema Miami customizado (--miami-pink, --miami-blue, --miami-orange)
- shadcn/ui (45+ componentes Radix UI)
- Supabase (auth, banco PostgreSQL, edge functions, RLS)
- React Router v6 (rotas públicas, /client/*, /admin/*)
- TanStack React Query v5 (cache + mutations)
- React Hook Form + Zod (validação)
- Recharts (gráficos admin)
- Lucide React (ícones)
- Sonner (toasts)

## Fontes e Design
- Display: Playfair Display (serif, títulos elegantes)
- Body: Outfit (sans-serif, corpo de texto)
- Secundárias: Poppins, Roboto

## Modelo de Negócio
A dona (Ju) viaja para Miami, compra produtos originais (skincare, maquiagem, perfumes, eletrônicos, roupas, bolsas) e entrega no Brasil. O sistema converte preços USD→BRL com taxa de câmbio + spread configurável.

## Fluxo do Cliente
1. Navega catálogo público (sem login)
2. Faz login/registro → área do cliente
3. Adiciona ao carrinho (localStorage)
4. Checkout em 4 etapas: endereço (CEP via ViaCEP) → pagamento (PIX/cartão/wallet) → revisão → confirmação
5. Paga 50% entrada + 50% na entrega
6. Acompanha pedido por 9 status (novo → orçamento → aprovado → comprando → comprado → em_trânsito → chegou_brasil → entregue → cancelado)
7. Recebe atualizações via WhatsApp

## Fluxo Admin
1. Dashboard com KPIs (pedidos, receita, clientes)
2. Kanban board de pedidos por status
3. Gerencia catálogo de produtos (CRUD)
4. Cria e gerencia viagens (trips) com controle de peso (23-46kg)
5. Aloca pedidos em viagens
6. Registra pagamentos (depósito/saldo/reembolso)
7. Gerencia promoções, cupons e ofertas relâmpago
8. Responde perguntas de produtos (Q&A)
9. Modera avaliações
10. Envia mensagens WhatsApp com templates preenchidos
11. Analytics de buscas e performance

## Banco de Dados (Supabase - 23 tabelas)
- profiles (id, email, full_name, phone, address, role, referral_code, wallet_balance)
- orders (id, order_number, client_id, items, status, total_brl, total_usd, deposit_paid, balance_paid, trip_id, exchange_rate, spread_pct)
- order_items (id, order_id, product_name, price_usd, price_brl, quantity)
- order_events (id, order_id, status, title, description, photo_url)
- catalog_products (id, name, brand, category, price_usd, image_url, description, active, rating, review_count, sales_count, trending, availability_type, estimated_days, stock_quantity)
- product_reviews (id, product_id, reviewer_name, rating, comment, verified_purchase)
- product_questions (id, product_id, asker_name, question, answer, answered_at)
- product_deals (id, product_id, discount_percent, deal_type, starts_at, ends_at, max_claims, claimed_count)
- product_alerts (id, product_id, user_email, whatsapp)
- promotions (id, coupon_code, discount_type, discount_value, min_order_value, max_uses, current_uses, active, starts_at, expires_at)
- trips (id, code, traveler_name, flight_number, departure_date, arrival_date, max_weight_kg, status)
- payments (id, order_id, type, amount, receipt_url)
- wallet_transactions (id, client_id, type, amount, description)
- wishlists (id, client_id, product_id)
- notifications (id, client_id, title, message, type, read, order_id)
- referrals (id, referrer_id, referred_id, referral_code, status, credit_amount)
- whatsapp_templates (id, slug, title, icon, template_text)
- settings (id, key, value) — exchange_rate_usd_brl, spread_percentage, whatsapp_phone, referral_credit
- brands (id, slug, name, description, logo_url)

## Estrutura de Pastas
src/
├── pages/ (27 páginas: públicas, client/, admin/)
├── components/ (70+ componentes: ui/, admin/, catalog/, client/, shared/)
├── contexts/ (AuthContext, CartContext)
├── hooks/ (19 hooks: useOrders, useTrips, useCatalog, useWallet, etc.)
├── integrations/supabase/ (client.ts, types.ts)
├── types/ (index.ts, app-types.ts)
├── lib/ (calculations.ts, format.ts, constants.ts, share.ts)
supabase/
├── functions/ (create-order, get-exchange-rate)
├── migrations/ (30+ arquivos SQL)

## Cálculos de Preço
BRL = USD × taxa_cambio × (1 + spread/100)
Depósito = 50% do total BRL
Frete grátis acima de R$500

## Regras Importantes
- Preços sempre em USD no banco, convertidos em tempo real para BRL
- Disponibilidade: pronta_entrega, sob_encomenda (X dias), esgotado
- Auth: email/password via Supabase, roles 'admin' e 'cliente'
- RLS habilitado em todas as tabelas
- Carrinho persiste em localStorage (chave: ajuvaiparamiami_cart)
- Código de referral: {Nome}-MALA-{XXXX}
- Todo código e interface em português brasileiro
```

---

## PROMPT 2 - HOMEPAGE & CATÁLOGO PÚBLICO (Inspirado em Sephora + FragranceNet + Amazon + Drogasil)

```
Melhore a homepage/catálogo público do projeto "Aju Vai Para Miami" inspirado nas melhores práticas destes e-commerces de referência:

## Referências Visuais Analisadas
- **Sephora**: Hero banners editoriais rotativos, "New Arrivals" com carrossel, "Beauty Offers" com cards visuais, "Value Sets You'll Love", "Chosen For You" (personalizado), "Beauty Insider Rewards", "Need a Little Guidance?" com categorias ilustradas
- **FragranceNet**: Barra de marcas premium no topo, "Best Sellers" com % OFF em badges, "New Arrivals", "Popular Gift Sets", "Purpl Rewards" banner, grid de categorias com fotos (Women's Perfume, Men's Cologne, Haircare, Skincare, Gift Sets, Best Sellers, New Arrivals, Travel Sprays), "Variety Gift Sets" banner, "Secure Checkout" trust area, Beauty Tips + Customer Reviews
- **Amazon**: Hero "Fast shipping", cards de categorias visuais ("Continue shopping deals", "Save on Amazon Devices"), "Best Sellers in..." por departamento, "Picked just for you", "Customers who viewed items also viewed", editorial lifestyle
- **Drogasil**: Barra de categorias com ícones no topo, hero skincare, "Ofertas imperdíveis" com estrelas e % OFF, "Destaques da Semana", "Cuidados que você merece" (cards visuais: rosto/corpo/maquiagem/dermocosméticos/perfumes/proteção), "Mais Vistos", seções temáticas (suplementos, lançamentos), "Tendências de skincare asiático", "Espaço Mais Saúde"
- **Mercado Livre**: Hero com mega promoção, "Frete grátis / Entre na conta / Insira localização / Meios de pagamento / Menos de R$100 / Mais vendidos" como quick-links visuais, "Categorias" grid

## O que implementar (arquivo: src/pages/PublicCatalog.tsx e componentes em src/components/catalog/)

### 1. Barra de Categorias com Ícones (estilo Drogasil)
- Adicionar uma faixa horizontal com ícones + labels para as principais categorias
- Categorias: Mais Vendidos, Ofertas, Skincare, Maquiagem, Perfumes, Eletrônicos, Roupas, Bolsas, Gift Sets
- Scroll horizontal no mobile, centralizado no desktop
- Ícone + label embaixo de cada um

### 2. Hero Banner Melhorado (estilo Sephora)
- Banners mais editoriais com gradientes e tipografia premium
- Adicionar badges como "ONLY AT AJU" / "EXCLUSIVO"
- CTAs mais claros: "SHOP NOW", "VER OFERTAS"

### 3. Quick Links (estilo Mercado Livre)
- Abaixo do hero: "Frete Grátis acima de R$500" / "Pronta Entrega" / "Como Funciona" / "Ofertas do Dia" / "Mais Vendidos"
- Cards visuais com ícone + texto + link

### 4. Seções Temáticas Visuais (estilo Drogasil + Sephora)
- "Cuidados que Você Merece" — cards grandes com imagem de fundo (Skincare, Maquiagem, Perfumes, Corpo)
- "Escolhidos Para Você" — baseado em produtos recentemente vistos ou trending
- "Tendências" — produtos trending com badge
- "Gift Sets & Kits" — seção dedicada

### 5. Seção de Ofertas Melhorada (estilo FragranceNet + Amazon)
- "Ofertas Imperdíveis" com countdown timer
- Mostrar % OFF em badge vermelho no card
- Barra de progresso "X de Y resgatados"
- "Oferta Relâmpago" com ícone de raio

### 6. Seção Best Sellers por Categoria (estilo Amazon)
- "Mais Vendidos em Skincare", "Mais Vendidos em Perfumes", etc.
- Carrossel horizontal com setas
- Badge "Best Seller" laranja

### 7. Trust Section (estilo FragranceNet)
- "Secure Checkout" / "100% Original" / "+X mil pedidos entregues" / "Entrega via Miami"
- Ícones de formas de pagamento (PIX, cartão, boleto)
- Selos de confiança

### 8. Programa de Fidelidade Banner (estilo Sephora Beauty Insider / FragranceNet Purpl Rewards)
- Banner "Aju Rewards" ou "Miami Club"
- "Acumule pontos, ganhe descontos"
- CTA "CADASTRE-SE GRÁTIS"

### 9. Social Proof (estilo FragranceNet)
- Seção "O que nossos clientes dizem"
- Depoimentos com estrelas
- "Beauty Tips" ou dicas da Ju

### 10. Newsletter Melhorado (estilo Drogasil + FragranceNet)
- "Receba ofertas exclusivas e novidades de Miami!"
- Input de email estilizado
- "Ganhe X% OFF no primeiro pedido"

## Regras
- Manter mobile-first (Tailwind responsive)
- Usar componentes shadcn/ui existentes
- Manter integração com Supabase existente
- Lazy loading em todas as imagens
- Cores do tema Miami (--miami-pink, --miami-blue, etc.)
- Texto em português brasileiro
```

---

## PROMPT 3 - MEGA MENU & NAVEGAÇÃO (Inspirado em Sephora + Macy's + Amazon)

```
Melhore o sistema de navegação e mega menu do projeto "Aju Vai Para Miami":

## Referências
- **Sephora**: Menu horizontal com categorias principais (New, Makeup, Skincare, Fragrance, Hair, Tools & Brushes, Bath & Body, Mini Size, Brands, Gifts & Value Sets, Gift Cards, Sale & Offers). Mega menu dropdown com subcategorias organizadas em colunas + imagens de marcas
- **Macy's**: Menu "Shop by Department" com flyout, categorias principais na barra superior, "Trending" e "New" badges
- **Amazon**: Hamburger menu → categorias em árvore, "Shop by Department" lateral completo
- **Drogasil**: Ícones redondos de categorias na barra superior, "Todas as categorias" dropdown

## Arquivo principal: src/components/catalog/MegaMenu.tsx + CategoryNav.tsx

### Melhorias:

### 1. Header Redesenhado
Desktop:
- Logo | Barra de busca expandida | Ícones (conta, wishlist, carrinho com badge de quantidade)
- Linha abaixo: categorias principais como links horizontais
- Hover em categoria → mega menu dropdown

Mobile:
- Logo | Busca compacta | Menu hamburger | Carrinho
- Menu lateral slide-in com categorias em accordion

### 2. Mega Menu Desktop (estilo Sephora)
Ao passar mouse na categoria, abre dropdown full-width com:
- Coluna 1: Subcategorias (links)
- Coluna 2: Marcas populares naquela categoria
- Coluna 3: Imagem destaque / banner promocional da categoria
- "Ver todos em [Categoria]" link no final

### 3. Barra de Anúncios Rotativa (estilo Amazon + Sephora)
Topo do site com mensagens rotativas:
- "Frete grátis acima de R$500"
- "Próxima viagem: 15/03 - Garanta seu pedido!"
- "Use MIAMI10 e ganhe 10% OFF"
- "Produtos 100% originais dos EUA"

### 4. Busca Inteligente (estilo Amazon)
- Dropdown com resultados em tempo real
- Seção "Sugestões" com termos populares
- Seção "Produtos" com thumb + nome + preço
- Seção "Categorias" com matches
- Seção "Marcas" com matches
- Histórico de buscas recentes

### 5. Breadcrumbs (estilo Macy's)
Home > Categoria > Subcategoria > Produto

### 6. Sticky Header
- Header fixo no scroll com versão compacta
- No mobile: busca some, ícones ficam

## Regras
- Acessibilidade: navegação por teclado, aria-labels
- Animações suaves (Tailwind transition)
- Fechar mega menu com Escape e click-outside
- Manter dados existentes de MEGA_MENU_CATEGORIES em mega-menu-data.ts
```

---

## PROMPT 4 - PÁGINA DE PRODUTO (Inspirado em Amazon + Sephora + Drogasil)

```
Melhore a página de produto individual do projeto "Aju Vai Para Miami":

## Referências
- **Amazon**: Galeria de imagens (thumb lateral + zoom), título, marca (link), estrelas + contagem, preço com "was/now", opções de parcelas, "About this item" bullets, "Frequently bought together", "Customers who viewed also viewed", Q&A, reviews com filtros
- **Sephora**: Imagem grande, "Add to Loves", swatch de cores, tamanhos disponíveis, "Clean at Sephora" badges, "How to Use", ingredientes, reviews com fotos dos clientes
- **Drogasil**: Imagem + galeria, preço com desconto, "Economize R$X", parcelas, "Retirar na loja" / "Receber em casa", descrição detalhada, avaliações com barra de distribuição

## Arquivo: src/pages/PublicProductPage.tsx + Dialog no PublicCatalog.tsx

### Melhorias:

### 1. Galeria de Imagens Premium
- Imagem principal grande com zoom on hover
- Thumbnails laterais (quando houver múltiplas imagens)
- Badge "100% Original" na imagem
- Badge de disponibilidade (Pronta Entrega / Sob Encomenda)

### 2. Informações do Produto Redesenhadas
Layout organizado:
- Breadcrumb: Home > Skincare > [Marca] > [Produto]
- Nome do produto (título H1)
- Marca como link → página da marca
- Estrelas + "(X avaliações)" clicável (scroll até reviews)
- Badges: "Mais Vendido" / "Trending" / "Exclusivo Miami"

### 3. Bloco de Preço (estilo Amazon)
- Preço anterior riscado
- Preço atual grande em destaque
- "Economize R$ X,XX (Y%)"
- Parcelas: "ou 3x de R$ X sem juros"
- "Preço nos EUA: US$ X.XX"
- Badge: "Frete Grátis" se acima de R$500

### 4. Bloco de Compra
- Seletor de quantidade
- Botão "ADICIONAR AO CARRINHO" (grande, amarelo estilo Amazon)
- Botão "COMPRAR AGORA"
- Botão "ADICIONAR À LISTA" (coração)
- Botão "COMPARTILHAR" (WhatsApp)
- Se esgotado: "AVISE-ME QUANDO CHEGAR"

### 5. Informações de Entrega
- "Entrega via viagem Miami"
- "Próxima viagem: [data]" (puxar da tabela trips)
- "Pronta Entrega" → "Envio imediato"
- "Sob Encomenda" → "Será comprado na próxima viagem (X dias)"
- Estimativa de entrega baseada no status das trips

### 6. Seção "Sobre Este Produto"
- Descrição expandível
- Bullets com highlights do produto
- Categoria e tags

### 7. Seção "Comprados Juntos" (estilo Amazon)
- 3 produtos da mesma categoria ou marca
- "Este produto + Produto B + Produto C"
- Preço combinado com desconto
- "Adicionar os 3 ao carrinho"

### 8. Reviews Melhoradas (estilo Amazon + Sephora)
- Rating médio grande com estrelas
- Barra de distribuição (5★: XX%, 4★: XX%, etc.)
- Filtro por estrelas
- "Compra verificada" badge
- Botão "Esta avaliação foi útil?"
- Form para nova review com estrelas clicáveis

### 9. Q&A Melhorado
- "Perguntas e Respostas dos Clientes"
- Buscar nas perguntas existentes
- "Faça uma pergunta" form
- Respostas da loja com badge "Resposta oficial Aju Imports"

### 10. Produtos Relacionados
- "Quem viu este produto também viu"
- Carrossel com ProductCards
- "Mais da marca [Marca]"

## Regras
- Mobile-first responsive
- Lazy load de imagens
- Schema markup para SEO (Product, Review, FAQPage)
- Manter integração existente com Supabase
```

---

## PROMPT 5 - CARRINHO & CHECKOUT (Inspirado em Amazon + Mercado Livre + Sephora)

```
Melhore o fluxo de carrinho e checkout do projeto "Aju Vai Para Miami":

## Referências
- **Amazon**: Mini-cart dropdown, página do carrinho com "Saved for later", subtotal sempre visível, "Frequently bought together", checkout em etapas claras
- **Mercado Livre**: Carrinho lateral, "Compra protegida", "Envio grátis", resumo fixo na lateral, CEP lookup
- **Sephora**: Drawer lateral, "You might also like" no carrinho, rewards points display, amostras grátis na compra

## Arquivos: src/components/catalog/CartDrawer.tsx, src/pages/client/ClientCart.tsx, ClientCheckout.tsx

### Melhorias no CartDrawer:

### 1. Drawer Melhorado
- Header: "Meu Carrinho (X itens)"
- Lista de itens com: imagem, nome, marca, preço unitário, seletor de quantidade, remover
- "Você pode gostar também" — 2-3 sugestões baseadas nos itens do carrinho
- Resumo fixo no bottom:
  - Subtotal (USD e BRL)
  - Frete: "Grátis" se > R$500 ou "A calcular"
  - "Entrada (50%): R$ X"
  - Botão "IR PARA O CARRINHO" (secundário)
  - Botão "FINALIZAR PEDIDO" (primário)

### 2. Página do Carrinho Melhorada
- Layout: itens na esquerda (70%), resumo fixo na direita (30%)
- Cada item: imagem grande, nome, marca, preço, quantidade, total do item, "Salvar para depois"
- "Itens salvos para depois" seção abaixo
- Cupom de desconto input inline
- "Adicione mais R$ X para frete grátis" barra de progresso
- Trust badges: "Produtos 100% Originais" / "Entrega Garantida" / "Pagamento Seguro"

### 3. Checkout Redesenhado
Manter 4 etapas mas com melhorias:

**Etapa 1 - Endereço:**
- Auto-preenchimento por CEP (já existe via ViaCEP)
- Endereços salvos do perfil (selecionar)
- "Entregar para outra pessoa" toggle
- Mapa simplificado ou confirmação visual

**Etapa 2 - Pagamento:**
- Cards visuais para cada método:
  - PIX: ícone PIX + "5% de desconto" badge
  - Cartão: ícone cartão + "até 3x sem juros"
  - Wallet: ícone carteira + "Saldo: R$ X"
- Cupom de desconto (se não aplicado no carrinho)
- Simulação de valor final com desconto

**Etapa 3 - Revisão:**
- Resumo visual dos itens
- Endereço de entrega
- Método de pagamento selecionado
- Total final com breakdown:
  - Produtos: R$ X
  - Desconto: -R$ X
  - Frete: Grátis / R$ X
  - Total: R$ X
  - Entrada (50%): R$ X
  - Saldo na entrega: R$ X
- "Ao confirmar, você concorda com os Termos de Uso"

**Etapa 4 - Confirmação:**
- Checkmark grande animado
- Número do pedido em destaque
- "Próximos passos" timeline visual:
  1. "Enviaremos o orçamento via WhatsApp"
  2. "Confirme e pague a entrada de 50%"
  3. "Compraremos na próxima viagem"
  4. "Acompanhe a entrega em tempo real"
- Botões: "Ver meu pedido" / "Continuar comprando"
- Compartilhar no WhatsApp

## Regras
- Manter persistência em localStorage
- Integrar com CartContext existente
- Manter cálculos de câmbio existentes
- UX fluido sem recarregar página
```

---

## PROMPT 6 - ÁREA DO CLIENTE (Inspirado em Amazon + Mercado Livre + Sephora)

```
Melhore a área do cliente logado do projeto "Aju Vai Para Miami":

## Referências
- **Amazon**: "Your Orders" com filtros, "Your Account" com cards de serviços, tracking detalhado com mapa, "Buy Again", reviews pendentes
- **Mercado Livre**: "Minhas compras" com timeline visual, "Compra protegida", chat com vendedor, devolução fácil, "Favoritos"
- **Sephora**: Dashboard com "Beauty Insider" tier, pontos, rewards, purchase history, "Recomendados para você"

## Arquivos: src/pages/client/*, src/components/client/*

### 1. Dashboard do Cliente Melhorado
Cards de acesso rápido:
- "Meus Pedidos" com badge de pedidos ativos
- "Minha Wishlist" com contagem
- "Minha Carteira" com saldo
- "Promoções" com contagem de cupons ativos
- "Meu Perfil"
- "Notificações" com badge de não lidas

Banner personalizado:
- "Olá, [Nome]! Próxima viagem Miami: [data]"
- Pedidos em andamento resumidos
- "Compre antes de [data] para envio nesta viagem"

Seção "Comprar de Novo":
- Produtos de pedidos anteriores para recompra rápida

### 2. Meus Pedidos Melhorado
- Filtros: Todos / Em andamento / Entregues / Cancelados
- Cards de pedido com:
  - Status badge colorido
  - Barra de progresso visual (estilo Mercado Livre)
  - Thumbs dos produtos
  - Total e data
  - CTAs: "Ver Detalhes" / "Rastrear" / "Avaliar" / "Comprar Novamente" / "Falar no WhatsApp"

### 3. Detalhe do Pedido Melhorado
- Timeline visual com ícones para cada etapa
- Cada etapa com data/hora e descrição
- Foto de comprovação (quando admin adicionar)
- Seção "Meu Pagamento":
  - Entrada paga/pendente com valor e data
  - Saldo pago/pendente com valor
  - Recibo link
- "Falar com a Ju" botão WhatsApp
- Se entregue e sem review: "Avalie seu pedido" CTA destacado
- Se "chegou_brasil": "Agendar entrega" botão

### 4. Catálogo do Cliente Melhorado
- Mesmo catálogo público mas com:
  - Botão "Adicionar ao Carrinho" funcional (não redireciona para login)
  - Wishlist toggle em cada produto
  - "Você já comprou este produto" badge se aplicável
  - Histórico de "Vistos recentemente"

### 5. Wishlist Melhorada
- Grid de produtos salvos
- "Mover para o Carrinho" botão em cada item
- "Compartilhar minha lista" via WhatsApp
- Notificação quando item da wishlist entrar em oferta
- Ordenar por: data adicionado, preço, disponibilidade

### 6. Promoções do Cliente
- "Meus Cupons" com cards visuais (código + desconto + validade)
- "Ofertas Exclusivas para Você" baseado em histórico
- Programa de Referral:
  - Código pessoal em destaque
  - "Compartilhar" via WhatsApp
  - Histórico de indicações com status
  - Créditos ganhos

### 7. Carteira do Cliente
- Saldo em destaque com ícone de carteira
- "Como ganhar créditos" explicação
- Histórico de transações com:
  - Data, tipo (crédito/débito), valor, descrição
  - Filtros por tipo e período

### 8. Perfil do Cliente
- Dados pessoais editáveis
- Endereço de entrega padrão
- Preferências de notificação
- "Excluir minha conta"

## Regras
- Usar hooks existentes (useOrders, useWallet, useWishlist, etc.)
- Manter CartContext existente
- Mobile-first
- Manter ClientLayout com sidebar/bottom nav
```

---

## PROMPT 7 - PAINEL ADMIN (Inspirado em Shopify + Mercado Livre Seller)

```
Melhore o painel administrativo do projeto "Aju Vai Para Miami":

## Arquivos: src/pages/admin/*, src/components/admin/*

### 1. Dashboard Admin Melhorado
KPIs em cards:
- Receita Total (BRL) com gráfico sparkline
- Pedidos Ativos (badge: novos hoje)
- Clientes Cadastrados (badge: novos esta semana)
- Peso Alocado / Capacidade Total (próxima viagem)
- Ticket Médio
- Taxa de Conversão

Gráficos:
- Receita por Mês (bar chart)
- Pedidos por Status (donut chart)
- Top 10 Produtos Vendidos (horizontal bar)
- Pedidos por Semana (area chart)

Ações Rápidas:
- "Novo Produto" botão
- "Nova Viagem" botão
- "Ver Pedidos Pendentes" (X pendentes)
- "Perguntas sem Resposta" (X pendentes)

Feed de Atividade Recente:
- "João fez pedido #PED-0042" (2min atrás)
- "Pagamento de R$350 confirmado - #PED-0038" (15min atrás)
- "Nova pergunta sobre CeraVe Hydrating" (30min atrás)

### 2. Gerenciamento de Pedidos Melhorado
- Kanban board com drag & drop
- Cada card: número, cliente, itens resumo, valor, tempo no status atual
- Sidebar de detalhes rápidos ao clicar
- Bulk actions: selecionar múltiplos → mudar status
- Filtros: data, cliente, valor, viagem
- Busca por número do pedido ou nome do cliente

### 3. Gerenciamento de Catálogo Melhorado
- Tabela com: foto, nome, marca, categoria, preço, estoque, status, ações
- Filtros: categoria, marca, disponibilidade, preço
- Import/export CSV
- Edição inline de preço e estoque
- Duplicar produto
- Bulk ativar/desativar

### 4. Gerenciamento de Viagens Melhorado
- Timeline visual das viagens (passadas, atual, futuras)
- Card de viagem:
  - Código, viajante, voo, datas
  - Barra de peso (verde/amarelo/vermelho)
  - "X pedidos alocados" / "X pendentes"
  - Valor total dos pedidos
- Detalhe: lista de pedidos com checkbox para alocar
- Print packing list

### 5. Analytics Melhorado
- Dashboard de métricas:
  - Receita vs período anterior
  - Produtos mais buscados vs mais vendidos (gap analysis)
  - Termos sem resultado (oportunidades)
  - Funil: visitas → carrinho → checkout → pedido
  - Mapa de calor de horários de compra
  - Top clientes por receita

### 6. Comunicação Melhorada (WhatsApp)
- Templates organizados por categoria (boas-vindas, status, pagamento, entrega)
- Preview do WhatsApp message antes de enviar
- Histórico de mensagens enviadas
- Envio em lote para clientes filtrados
- Variáveis auto-preenchidas com dados do pedido

## Regras
- Usar hooks existentes
- AdminLayout com sidebar existente
- Recharts para gráficos
- shadcn/ui Table, Card, Dialog
```

---

## PROMPT 8 - FEATURES NOVAS INSPIRADAS NAS REFERÊNCIAS

```
Adicione novas features ao projeto "Aju Vai Para Miami" inspiradas nos melhores e-commerces:

## Feature 1: Programa de Fidelidade "Miami Club" (Inspirado em Sephora Beauty Insider + FragranceNet Purpl Rewards)

Tiers:
- **Bronze** (0-999 pts): Benefícios básicos
- **Prata** (1000-4999 pts): Frete grátis, acesso antecipado a ofertas
- **Ouro** (5000+ pts): Descontos exclusivos, prioridade nas viagens, brindes

Como ganhar pontos:
- 1 ponto por cada R$1 gasto
- 50 pontos por indicação completada
- 20 pontos por review de produto
- 10 pontos por compartilhar produto no WhatsApp

Como usar:
- Trocar por descontos no checkout
- Trocar por frete grátis
- Trocar por produtos exclusivos

Tabelas novas: loyalty_tiers, loyalty_points, loyalty_rewards

## Feature 2: "Comprados Juntos" / Bundles (Inspirado em Amazon)

- Admin cria bundles: Produto A + B + C com desconto
- Na página do produto: "Frequentemente comprados juntos" sugestão automática (baseado em pedidos anteriores com mesmos itens)
- "Kit Skincare" / "Kit Perfume" como produtos bundle no catálogo
- Desconto automático ao adicionar bundle inteiro

Tabelas novas: product_bundles, bundle_items

## Feature 3: Countdown de Viagem (Inspirado em TiendaMia)

- Banner global: "Próxima viagem em X dias! Peça até [data]"
- Countdown timer na homepage e catálogo
- "Previsão de entrega: [data]" baseado na próxima trip
- Urgência: "Faltam X vagas nesta viagem" (baseado em peso restante)
- Timeline visual: "Compra → Viagem → Entrega"

## Feature 4: Avaliações com Fotos (Inspirado em Amazon + Sephora)

- Clientes podem fazer upload de fotos nas reviews
- Galeria de fotos de clientes no produto
- Review com "Compra Verificada" badge
- "X de Y acharam útil" sistema de votos
- Filtrar reviews por estrelas e com fotos

Alterar tabela: product_reviews (adicionar photo_urls jsonb[])

## Feature 5: "Wish Price" / Alerta de Preço (Inspirado em TiendaMia)

- Cliente define preço desejado para um produto
- Sistema notifica quando o câmbio ou desconto atingir aquele preço
- "Avise-me quando chegar a R$ X"

Tabelas novas: price_alerts (product_id, client_id, target_price_brl)

## Feature 6: Stories / Feed da Ju (Inspirado em Mercado Livre + Instagram)

- Seção "Direto de Miami" com fotos/vídeos da viagem
- Stories mostrando compras sendo feitas
- "Bastidores" da viagem
- Engajamento e confiança

Tabelas novas: stories (id, media_url, caption, created_at, active)

## Feature 7: Comparador de Preços (Inspirado em TiendaMia)

- "Compare: preço EUA vs preço Brasil"
- Mostrar economia: "Economize X% comprando com a Aju"
- Tabela comparativa no produto

## Feature 8: Gift Cards / Vale Presente

- Comprar vale presente (valor livre ou pré-definido)
- Enviar por email ou WhatsApp
- Usar no checkout como forma de pagamento

Tabelas novas: gift_cards (id, code, value, balance, sender_id, recipient_email)

## Feature 9: Notificações Push / Email

- Pedido atualizado → push + email
- Produto da wishlist em oferta → push
- Viagem saindo → push para quem tem pedido
- Cupom expirando → push
- Abandonou carrinho → email

## Feature 10: Rastreamento Melhorado (Inspirado em Mercado Livre)

- Mapa visual simplificado: Miami → Aeroporto → Voo → Brasil → Sua casa
- Fotos em cada etapa (admin faz upload)
- ETA (Estimated Time of Arrival) dinâmico
- Notificações automáticas a cada mudança de status

## Regras para todas as features
- Criar migrations Supabase para novas tabelas
- Habilitar RLS
- Criar hooks React Query
- Mobile-first
- Português brasileiro
```

---

## PROMPT 9 - MOBILE EXPERIENCE (Inspirado em apps nativos)

```
Otimize a experiência mobile do projeto "Aju Vai Para Miami" para se parecer com um app nativo:

## Referências
- App Sephora: Bottom nav, card-based UI, swipe gestures
- App Amazon: Sticky buy bar, image carousel com swipe, reviews inline
- App Mercado Livre: Status updates como cards, chat integrado

### 1. Bottom Navigation Bar (Mobile)
5 ícones fixos no bottom:
- Home (catálogo)
- Categorias
- Carrinho (com badge)
- Wishlist (com badge)
- Perfil

### 2. Pull to Refresh
- Puxar para baixo → recarregar catálogo/pedidos

### 3. Sticky Buy Bar
Na página de produto, ao scrollar:
- Barra fixa no bottom com: preço + "Adicionar ao Carrinho"

### 4. Swipe Navigation
- Swipe left/right em imagens de produto
- Swipe para deletar item do carrinho
- Swipe entre abas (pedidos em andamento / entregues)

### 5. Skeleton Loading
- Skeleton screens em vez de spinners
- Placeholder shimmer durante carregamento

### 6. Haptic Feedback Visual
- Botão pulsa ao adicionar ao carrinho
- Coração anima ao favoritar
- Confetti na confirmação do pedido

### 7. Bottom Sheet Modals
- Filtros como bottom sheet (não dialog central)
- Quick view de produto como bottom sheet
- Opções de compartilhamento como bottom sheet

### 8. PWA (Progressive Web App)
- manifest.json com ícone e tema
- Service worker para cache básico
- "Adicionar à tela inicial" prompt
- Splash screen customizada

## Regras
- Tailwind responsive (sm:, md:, lg:)
- Touch-friendly: mínimo 44px touch targets
- Eliminar hover-only interactions no mobile
- Testar em viewport 375px (iPhone SE) até 428px (iPhone Pro Max)
```

---

## PROMPT 10 - SEO, PERFORMANCE & ACESSIBILIDADE

```
Otimize SEO, performance e acessibilidade do projeto "Aju Vai Para Miami":

### SEO
- Meta tags dinâmicas por página (react-helmet-async)
- Open Graph tags para compartilhamento (WhatsApp, Instagram)
- Schema.org JSON-LD: Product, Review, FAQPage, Organization, BreadcrumbList
- Sitemap.xml dinâmico
- URLs amigáveis (já tem slugify)
- Canonical URLs
- Alt text em todas as imagens

### Performance
- Lazy loading de imagens (já tem loading="lazy")
- Code splitting por rota (React.lazy + Suspense)
- Preload de fontes críticas
- Otimizar bundle: verificar dependências não usadas
- Cache de imagens com service worker
- Comprimir imagens (WebP quando possível)
- Virtualização para listas longas (react-window)
- Debounce na busca (já tem, verificar timing)

### Acessibilidade (WCAG 2.1 AA)
- Contraste mínimo 4.5:1 em textos
- Focus visible em todos os elementos interativos
- aria-labels em botões de ícone
- Navegação por teclado completa
- Skip to main content link
- Roles e landmarks (main, nav, aside, footer)
- Anúncios de carregamento para screen readers
- Texto alternativo em todas as imagens decorativas e informativas
- Formulários com labels associados
```

---

## PROMPT 11 - DESIGN SYSTEM & ESTILO VISUAL (Inspirado em Sephora + Macy's)

```
Refine o design system do projeto "Aju Vai Para Miami" para um look mais premium:

## Paleta de Cores Atual
- --miami-pink: 340 82% 52% (rosa vibrante)
- --miami-blue: 195 85% 50% (azul Miami)
- --miami-orange: 25 95% 58% (laranja tropical)
- --miami-yellow: 45 100% 60% (amarelo sol)
- --miami-sand: 30 40% 95% (areia clara)

## Evolução da Paleta (inspiração Sephora + premium beauty)

### Opção A: Clean & Luxe (estilo Sephora)
- Primário: Preto (#000) + Branco (#FFF) base
- Accent: Rosa Sephora (#CC0C39) para CTAs e destaques
- Secundário: Dourado suave (#C9A96E) para badges premium
- Neutros: Cinzas sofisticados (#F7F7F7, #E0E0E0, #666)
- Success: Verde profundo (#007600)
- Alerta: Vermelho (#CC0C39) para ofertas

### Opção B: Miami Tropical Refinado
- Primário: Rosa coral (#F43F5E) para CTAs
- Secundário: Azul oceano (#0EA5E9) para links e info
- Accent: Dourado (#D4A843) para badges premium
- Base: Branco + areia (#FFFBF5)
- Texto: Quase preto (#1A1A2E)
- Success: Verde tropical (#10B981)

## Tipografia Premium
- Títulos H1: Playfair Display Bold, 28-36px
- Títulos H2: Playfair Display SemiBold, 22-28px
- Subtítulos: Outfit SemiBold, 16-20px
- Body: Outfit Regular, 14-16px
- Labels/Badges: Outfit Medium, 10-12px, UPPERCASE, tracking-wide
- Preços: Outfit Bold, 20-32px

## Cards de Produto Refinados
- Fundo branco com borda sutil (#F0F0F0)
- Hover: sombra suave + scale 1.02
- Badge de marca discreta no topo
- Imagem com aspect-ratio 1:1
- Nome: 2 linhas max, clamp
- Rating: estrelas douradas pequenas
- Preço: negrito grande
- CTA: botão outline rosa → hover fill

## Botões
- Primário: Rosa/coral fill, branco texto, rounded-full
- Secundário: Outline cinza/rosa, rounded-full
- Ghost: Texto + underline on hover
- CTA Especial: Gradiente rosa→laranja, ícone + texto

## Trust Indicators
- "100% Original" badge com ícone de escudo
- "Entrega Garantida" com ícone de avião
- "Pagamento Seguro" com ícone de cadeado
- Selos em cinza/dourado discreto

## Regras
- Manter consistência em todas as páginas
- Tailwind CSS, sem CSS custom quando possível
- Animações sutis (transitions 200-300ms)
- Espaçamento consistente (8px grid)
```

---

## PROMPT 12 - CORREÇÃO DE BUGS E REFATORAÇÃO

```
Analise e corrija problemas no projeto "Aju Vai Para Miami":

## Problemas Conhecidos para Verificar

### Consistência de Dados
1. Exchange rate hardcoded em múltiplos lugares (6.05 no edge function, 5.70 em hooks) — unificar para usar settings table
2. fakeRating() e fakePreviousPrice() geram dados falsos — migrar para dados reais do banco
3. Cart persiste para usuários não logados mas checkout requer login — decidir: guest checkout ou redirecionar mais cedo

### Performance
4. Notifications polling a cada 30s — considerar Supabase Realtime subscriptions
5. Sem paginação em listas de produtos/pedidos — adicionar para escala
6. Todas as imagens do Unsplash CDN sem fallback — adicionar placeholder
7. ProfileMap com cache manual — migrar para React Query

### UX
8. Mega menu pode não fechar corretamente em edge cases
9. SearchAutocomplete não debounce adequado
10. Mobile: header pode ficar muito alto com AnnouncementBar + CategoryNav + search
11. Dialog de produto no catálogo público é muito longo — melhorar scroll/tabs

### Código
12. PublicCatalog.tsx tem 445 linhas — extrair hooks e componentes
13. Muitos hooks inline em páginas — mover para /hooks
14. Tipagem: muitos `as Type` casts — melhorar tipagem nativa
15. Imports não organizados — padronizar ordem

### Segurança
16. Verificar todas as RLS policies estão corretas
17. Verificar que admin role não pode ser auto-atribuído
18. Sanitizar inputs de Q&A contra XSS
19. Rate limiting nas edge functions

## Regras
- Uma correção por commit
- Não alterar lógica de negócio
- Manter backward compatibility
- Testar cada correção
```

---

## PROMPT 13 - INTEGRAÇÃO TIENDAMIA (Cross-Border Shopping Reference)

```
Implemente funcionalidades inspiradas na TiendaMia.com no projeto "Aju Vai Para Miami":

## O que a TiendaMia faz que é relevante:
TiendaMia é um e-commerce cross-border que compra nos EUA e entrega na América Latina.
Referência direta para o modelo de negócio da Aju.

### 1. Calculadora de Preço Transparente
Na página do produto, mostrar breakdown:
- Preço do produto (USD): US$ X
- Taxa de câmbio: R$ X por USD
- Spread/taxa de serviço: X%
- **Preço final: R$ X**
- Comparação: "No Brasil este produto custa ~R$ Y. Economize Z%"

### 2. Estimativa de Entrega Visual
Timeline visual no produto:
- "Pedido confirmado" → "Compra nos EUA (1-3 dias)" → "Viagem Miami-Brasil (data)" → "Entrega na sua casa (X-Y dias)"
- Datas estimadas baseadas na próxima trip

### 3. Rastreamento Cross-Border
- Status visual: EUA → Aeroporto → Voo → Alfândega → Brasil → Entrega
- Mapa simplificado Miami ↔ Brasil com pin se movendo
- Notificações em cada etapa

### 4. Multi-Loja Origem
- Mostrar de qual loja o produto vem (Target, Sephora, Amazon, etc.)
- Badge "Comprado na [Loja]" no pedido

### 5. Cupons de Primeira Compra
- "Primeira compra? Use PRIMEIRA10 para 10% OFF"
- Banner para usuários novos

### 6. "Peça o que quiser" (Custom Order)
- Formulário: "Não encontrou? Peça para a Ju comprar!"
- Cliente envia link/foto/descrição do produto desejado
- Admin recebe e cria orçamento personalizado

Tabelas novas: custom_requests (id, client_id, product_url, product_description, image_url, status, admin_notes, estimated_price_usd)
```

---

## PROMPT 14 - FOOTER & PÁGINAS INSTITUCIONAIS (Inspirado em todos os sites)

```
Melhore o footer e crie páginas institucionais para o projeto "Aju Vai Para Miami":

## Footer Redesenhado (Inspirado em FragranceNet + Drogasil + Amazon)

### Estrutura:
**Bloco 1 - Newsletter**
- "Receba ofertas exclusivas de Miami!"
- Email input + botão "INSCREVER"
- "Ganhe 5% OFF no primeiro pedido"

**Bloco 2 - Colunas de Links**
- Comprar: Catálogo, Ofertas, Mais Vendidos, Novidades, Marcas, Gift Cards
- Institucional: Sobre a Aju, Como Funciona, Perguntas Frequentes, Blog
- Ajuda: Fale Conosco, Política de Devolução, Termos de Uso, Privacidade
- Minha Conta: Login, Meus Pedidos, Rastrear Pedido, Wishlist

**Bloco 3 - Trust & Pagamento**
- Formas de pagamento: PIX, Visa, Master, Elo, Boleto
- "100% Produtos Originais"
- "Entrega Garantida"
- CNPJ / Razão Social

**Bloco 4 - Social**
- Instagram, WhatsApp, TikTok
- "Siga @ajuvaiparamiami"

### Páginas Institucionais:
1. **/sobre** - Quem é a Ju, história, missão, fotos
2. **/como-funciona** - Passo a passo ilustrado (já existe componente HowItWorks, expandir)
3. **/faq** - Perguntas frequentes em accordion
4. **/politica-devolucao** - Política de troca e devolução
5. **/termos** - Termos de uso
6. **/privacidade** - Política de privacidade (LGPD)
7. **/contato** - Formulário + WhatsApp + Instagram

## Regras
- Páginas estáticas (sem banco)
- SEO friendly com meta tags
- Mobile responsive
- Manter design system existente
```

---

## PROMPT 15 - TESTES E QUALIDADE

```
Adicione testes ao projeto "Aju Vai Para Miami":

## Stack de Testes (já configurado)
- Vitest 3.2
- @testing-library/react 16
- @testing-library/jest-dom 6
- jsdom 20

## Testes Prioritários:

### 1. Testes Unitários (src/lib/)
- calculations.ts: conversão USD→BRL, cálculo de depósito, status de peso
- format.ts: formatação de datas, moedas, telefones
- catalog-utils.ts: fakeRating, isBestSeller, fakePreviousPrice

### 2. Testes de Hooks
- useOrders: criar pedido, atualizar status
- useWallet: saldo, transações
- useWishlist: adicionar/remover
- useCatalog: filtros, busca
- usePromotions: validar cupom

### 3. Testes de Componentes
- ProductCard: renderizar com props diferentes (pronta entrega, sob encomenda, esgotado)
- CartDrawer: adicionar/remover itens
- StarRating: renderizar estrelas corretas
- CategoryNav: click em categorias
- SearchAutocomplete: busca e seleção

### 4. Testes de Integração
- Fluxo de checkout completo (mock Supabase)
- Login → redirect baseado em role
- Adicionar ao carrinho → checkout → confirmação

## Regras
- Arquivos em src/test/ ou co-located *.test.tsx
- Mock do Supabase client
- Mock do React Router
- Assertions com @testing-library/jest-dom
- Cobertura mínima: 60% nos arquivos de lib/
```

---

## COMO USAR ESTES PROMPTS

1. **Sempre comece com o PROMPT 1** (Contexto Master) em uma nova sessão de IA
2. Depois cole o prompt específico da feature que quer implementar
3. Adapte conforme necessário — estes são templates, personalize!
4. Para sessões de código, adicione: *"Implemente as mudanças nos arquivos existentes. Use shadcn/ui, Tailwind CSS, TypeScript. Mantenha integração com Supabase. Código em português brasileiro."*
5. Para sessões de design, adicione: *"Não altere código. Me dê o HTML/JSX com Tailwind classes. Mobile-first."*
