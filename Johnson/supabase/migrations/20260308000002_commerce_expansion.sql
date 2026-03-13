-- ============================================================
-- PHASE 3: COMMERCE & STORAGE EXPANSION
-- ============================================================

-- 1. Create the Products Table if it entirely doesn't exist
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price_tzs NUMERIC NOT NULL DEFAULT 0,
    image_url TEXT,
    file_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add columns if the table existed but was missing them
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'is_active') THEN
        ALTER TABLE public.products ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'display_order') THEN
        ALTER TABLE public.products ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Policies: Public can read active products, Admin can do everything
DROP POLICY IF EXISTS "allow_public_select_active_products" ON public.products;
CREATE POLICY "allow_public_select_active_products" 
    ON public.products FOR SELECT 
    USING (is_active = true);

DROP POLICY IF EXISTS "allow_admin_all_products" ON public.products;
CREATE POLICY "allow_admin_all_products" 
    ON public.products FOR ALL 
    TO authenticated 
    USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'johnsonsaimon111@gmail.com'))
    WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'johnsonsaimon111@gmail.com'));


-- ============================================================
-- 2. Storage Setup (Note: Bucket creation requires superuser or Dashboard access)
-- The below commands setup the RLS for the buckets once they are created in the Dashboard
-- ============================================================

-- Portfolio Images Bucket Policies
-- Public can read images
DROP POLICY IF EXISTS "give_public_read_access_portfolio" ON storage.objects;
CREATE POLICY "give_public_read_access_portfolio" ON storage.objects
    FOR SELECT USING (bucket_id = 'portfolio_images');

-- Admin can insert/upload
DROP POLICY IF EXISTS "allow_admin_upload_portfolio" ON storage.objects;
CREATE POLICY "allow_admin_upload_portfolio" ON storage.objects
    FOR INSERT TO authenticated 
    WITH CHECK (
        bucket_id = 'portfolio_images' AND 
        auth.uid() IN (SELECT id FROM auth.users WHERE email = 'johnsonsaimon111@gmail.com')
    );

-- Digital Products Bucket Policies (Private download files)
-- Admin can do everything
DROP POLICY IF EXISTS "allow_admin_all_digital_products" ON storage.objects;
CREATE POLICY "allow_admin_all_digital_products" ON storage.objects
    FOR ALL TO authenticated 
    USING (
        bucket_id = 'digital_products' AND 
        auth.uid() IN (SELECT id FROM auth.users WHERE email = 'johnsonsaimon111@gmail.com')
    );

-- Add updated orders status column to purchase_orders if it exists, tracking pending vs confirmed
-- Using DO block to safely add column if exists without erroring
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'purchase_orders'
    ) THEN
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'purchase_orders' 
            AND column_name = 'status'
        ) THEN
            ALTER TABLE public.purchase_orders ADD COLUMN status TEXT DEFAULT 'pending';
        END IF;
    END IF;
END $$;
