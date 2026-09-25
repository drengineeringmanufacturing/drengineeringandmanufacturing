-- ==============================================================================
-- Daniels Aerospace & Engineering: Supabase PostgreSQL Schema
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ==============================================================================

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    image_urls TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create search & tag indexes for high performance
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products (name);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow anyone (public/frontend) to read products
CREATE POLICY "Public products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Allow authenticated users (superadmin) to insert products
CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users (superadmin) to update products
CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING (true);

-- Allow authenticated users (superadmin) to delete products
CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated 
USING (true);

-- 5. Seed initial engineering products
INSERT INTO public.products (id, name, description, price, image_urls, tags)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Titanium Aero Turbine Rotor Hub',
        'High-precision 5-axis CNC machined grade-5 titanium rotor hub engineered for high thermal tolerance and dynamic balance.',
        8450.00,
        ARRAY['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'],
        ARRAY['Turbines', 'Titanium', 'Aerospace', 'CNC']
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Carbon-Composite Winglet Spar',
        'Autoclave-cured high-modulus carbon fiber winglet structure reducing induced drag by up to 4.2% across subsonic flight profiles.',
        12900.00,
        ARRAY['https://images.unsplash.com/photo-1517976487502-5f7949442f3c?auto=format&fit=crop&w=800&q=80'],
        ARRAY['Composites', 'Aerodynamics', 'Carbon Fiber']
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Cryogenic Hydraulic Actuator Valve',
        'Hermetically sealed dual-redundant solenoid servo valve rated for extreme cryo operations down to -196°C.',
        3720.50,
        ARRAY['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80'],
        ARRAY['Hydraulics', 'Cryogenics', 'Actuators', 'Valves']
    )
ON CONFLICT (id) DO NOTHING;
