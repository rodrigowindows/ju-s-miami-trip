-- Trips table
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  traveler_name text not null,
  flight_number text not null,
  departure_date date not null,
  arrival_date date not null,
  max_weight_kg numeric not null default 23,
  created_at timestamptz not null default now()
);

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  items text not null,
  total_amount numeric not null default 0,
  deposit_amount numeric not null default 0,
  status text not null default 'pending',
  trip_id uuid references public.trips(id) on delete set null,
  estimated_weight_kg numeric,
  created_at timestamptz not null default now()
);

-- Payments table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  type text not null check (type in ('deposit', 'balance', 'refund')),
  amount numeric not null,
  receipt_url text,
  notes text,
  created_at timestamptz not null default now()
);

-- WhatsApp templates table
create table if not exists public.whatsapp_templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  icon text not null,
  template_text text not null,
  created_at timestamptz not null default now()
);

-- Add estimated_weight_kg to orders if it doesn't exist (for existing DBs)
-- alter table public.orders add column if not exists estimated_weight_kg numeric;

-- Enable RLS
alter table public.trips enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.whatsapp_templates enable row level security;

-- Policies (allow all for authenticated users - admin panel)
create policy "Allow all for authenticated" on public.trips for all using (true);
create policy "Allow all for authenticated" on public.orders for all using (true);
create policy "Allow all for authenticated" on public.payments for all using (true);
create policy "Allow all for authenticated" on public.whatsapp_templates for all using (true);
