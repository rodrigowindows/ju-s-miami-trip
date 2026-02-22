-- ============================================================
-- MalaBridge Database Schema
-- Run this migration in your Supabase SQL Editor
-- ============================================================

-- 1. Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'cliente');

CREATE TYPE order_status AS ENUM (
  'novo',
  'orcamento',
  'aprovado',
  'comprando',
  'em_viagem',
  'entregar',
  'entregue'
);

CREATE TYPE trip_status AS ENUM (
  'planejada',
  'em_andamento',
  'concluida'
);

-- 2. Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'cliente',
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Admins can see all profiles; clients see only their own
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- 3. Trips table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_name TEXT NOT NULL,
  departure_date DATE NOT NULL,
  arrival_date DATE NOT NULL,
  status trip_status NOT NULL DEFAULT 'planejada',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage trips"
  ON trips FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- 4. Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'novo',
  product_name TEXT NOT NULL,
  product_url TEXT,
  product_image_url TEXT,
  price_usd NUMERIC(10,2),
  price_brl NUMERIC(10,2),
  exchange_rate NUMERIC(10,4),
  spread_pct NUMERIC(5,2),
  deposit_paid BOOLEAN NOT NULL DEFAULT false,
  balance_paid BOOLEAN NOT NULL DEFAULT false,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Admins can do everything with orders
CREATE POLICY "Admins can manage orders"
  ON orders FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Clients can view their own orders
CREATE POLICY "Clients can view own orders"
  ON orders FOR SELECT
  USING (client_id = auth.uid());

-- 5. Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, name)
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'cliente'
    ),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 6. Auto-update updated_at on orders
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
