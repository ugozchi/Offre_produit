-- ============================================================
-- Offre Produit — Supabase SQL Schema
-- Copiez-collez ce script dans l'éditeur SQL de votre projet Supabase
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- ============================================================

-- 1. Table des produits
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '📦',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des catégories
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  sort_order INT DEFAULT 0
);

-- 3. Table des blocs de configuration
CREATE TABLE IF NOT EXISTS public.config_blocks (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  dev_time_hours NUMERIC DEFAULT 0,
  sales_time_hours NUMERIC DEFAULT 0,
  design_time_hours NUMERIC DEFAULT 0,
  csm_time_hours NUMERIC DEFAULT 0,
  ba_time_hours NUMERIC DEFAULT 0,
  infra_cost_monthly NUMERIC DEFAULT 0,
  complexity TEXT DEFAULT 'simple',
  dependencies JSONB DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

-- 4. Table des options
CREATE TABLE IF NOT EXISTS public.options (
  id TEXT PRIMARY KEY,
  block_id TEXT NOT NULL REFERENCES public.config_blocks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dev_time_hours NUMERIC DEFAULT 0,
  sales_time_hours NUMERIC DEFAULT 0,
  design_time_hours NUMERIC DEFAULT 0,
  csm_time_hours NUMERIC DEFAULT 0,
  ba_time_hours NUMERIC DEFAULT 0,
  infra_cost_monthly NUMERIC DEFAULT 0,
  production_cost NUMERIC DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- 5. Table des simulations
CREATE TABLE IF NOT EXISTS public.simulations (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  selected_option_ids JSONB DEFAULT '[]'::jsonb,
  total_dev_hours NUMERIC DEFAULT 0,
  total_sales_hours NUMERIC DEFAULT 0,
  total_design_hours NUMERIC DEFAULT 0,
  total_csm_hours NUMERIC DEFAULT 0,
  total_ba_hours NUMERIC DEFAULT 0,
  total_infra_cost NUMERIC DEFAULT 0,
  total_production_cost NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table des taux horaires par rôle
CREATE TABLE IF NOT EXISTS public.role_rates (
  id TEXT PRIMARY KEY DEFAULT 'default',
  dev_hourly_rate NUMERIC DEFAULT 60,
  sales_hourly_rate NUMERIC DEFAULT 45,
  design_hourly_rate NUMERIC DEFAULT 50,
  csm_hourly_rate NUMERIC DEFAULT 40,
  ba_hourly_rate NUMERIC DEFAULT 55
);

-- ============================================================
-- Activation RLS (Row Level Security) et autorisations publiques
-- ============================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_rates ENABLE ROW LEVEL SECURITY;

-- Autoriser la lecture et l'écriture anonymes
DROP POLICY IF EXISTS "Public access products" ON public.products;
CREATE POLICY "Public access products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access categories" ON public.categories;
CREATE POLICY "Public access categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access config_blocks" ON public.config_blocks;
CREATE POLICY "Public access config_blocks" ON public.config_blocks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access options" ON public.options;
CREATE POLICY "Public access options" ON public.options FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access simulations" ON public.simulations;
CREATE POLICY "Public access simulations" ON public.simulations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access role_rates" ON public.role_rates;
CREATE POLICY "Public access role_rates" ON public.role_rates FOR ALL USING (true) WITH CHECK (true);
