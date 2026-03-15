-- =============================================
-- Migration: Fix Storage Policies for Digital Products
-- =============================================

-- 1. Ensure the 'digital_products' bucket exists and is public
-- Note: 'public' in storage.buckets means children don't inherit private status by default, 
-- but we still need RLS policies to allow SELECT.
UPDATE storage.buckets 
SET public = true 
WHERE id = 'digital_products';

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Select on Digital Products" ON storage.objects;

-- 3. Create a clean policy for the digital_products bucket
-- This allows anyone with the direct link to download the file.
CREATE POLICY "Allow Public Select on Digital Products" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'digital_products');

-- Optional: Ensure 'portfolio_images' also has public read access if it doesn't already
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'portfolio_images') THEN
        CREATE POLICY "Allow Public Select on Portfolio Images" ON storage.objects
          FOR SELECT
          USING (bucket_id = 'portfolio_images');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;
