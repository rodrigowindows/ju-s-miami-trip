-- Wishlist: permite clientes salvarem produtos para comprar depois
create table if not exists public.wishlists (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.catalog_products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, product_id)
);

-- RLS
alter table public.wishlists enable row level security;

-- Clientes podem ver apenas seus próprios itens
create policy "Clients can view own wishlist"
  on public.wishlists for select
  using (auth.uid() = client_id);

-- Clientes podem adicionar itens à wishlist
create policy "Clients can insert own wishlist"
  on public.wishlists for insert
  with check (auth.uid() = client_id);

-- Clientes podem remover itens da própria wishlist
create policy "Clients can delete own wishlist"
  on public.wishlists for delete
  using (auth.uid() = client_id);

-- Admins podem ver todas as wishlists
create policy "Admins can view all wishlists"
  on public.wishlists for select
  using (public.is_admin(auth.uid()));
