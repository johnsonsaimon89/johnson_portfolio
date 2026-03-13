
-- Enable RLS on case_studies table
ALTER TABLE IF EXISTS case_studies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Case studies are viewable by everyone." ON case_studies;
DROP POLICY IF EXISTS "Case studies are insertable by authenticated users only." ON case_studies;
DROP POLICY IF EXISTS "Case studies are updatable by authenticated users only." ON case_studies;
DROP POLICY IF EXISTS "Case studies are deletable by authenticated users only." ON case_studies;

-- Create Policies for case_studies
CREATE POLICY "Case studies are viewable by everyone."
ON case_studies FOR SELECT
USING (true);

CREATE POLICY "Case studies are insertable by authenticated users only."
ON case_studies FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Case studies are updatable by authenticated users only."
ON case_studies FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Case studies are deletable by authenticated users only."
ON case_studies FOR DELETE
TO authenticated
USING (true);

-- Also ensure projects table is fully open for SELECT if not already
DROP POLICY IF EXISTS "Projects are viewable by everyone." ON projects;
CREATE POLICY "Projects are viewable by everyone."
ON projects FOR SELECT
USING (true);

-- Fix site_settings permissions
DROP POLICY IF EXISTS "Site Settings are viewable by everyone." ON site_settings;
CREATE POLICY "Site Settings are viewable by everyone."
ON site_settings FOR SELECT
USING (true);

-- Storage Policies for media library
-- Assuming bucket name is 'portfolio_images' or 'media-library'
-- Let's add for both or common names if found
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio_images', 'portfolio_images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Selection" ON storage.objects;
CREATE POLICY "Public Selection" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio_images');

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio_images');

DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio_images');

DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio_images');
