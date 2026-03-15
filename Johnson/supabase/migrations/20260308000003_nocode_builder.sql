-- Create Pages Table
CREATE TABLE IF NOT EXISTS pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content_blocks JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT false,
    seo_title TEXT,
    seo_description TEXT
);

-- Create Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content_blocks JSONB DEFAULT '[]'::jsonb,
    feature_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Forms Table
CREATE TABLE IF NOT EXISTS custom_forms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    fields JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true
);

-- Create Form Submissions
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    form_id UUID REFERENCES custom_forms(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    is_read BOOLEAN DEFAULT false
);

-- Add theme columns to site_settings (Assuming row id=1 exists from previous migration)
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS theme_color_primary TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS theme_color_secondary TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS typography_heading TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS typography_body TEXT DEFAULT 'Inter';

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for Pages
DROP POLICY IF EXISTS "Public can view published pages" ON pages;
CREATE POLICY "Public can view published pages" ON pages FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Auth users can view all pages" ON pages;
CREATE POLICY "Auth users can view all pages" ON pages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Auth users can insert pages" ON pages;
CREATE POLICY "Auth users can insert pages" ON pages FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Auth users can update pages" ON pages;
CREATE POLICY "Auth users can update pages" ON pages FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Auth users can delete pages" ON pages;
CREATE POLICY "Auth users can delete pages" ON pages FOR DELETE TO authenticated USING (true);

-- Blog Posts Policies
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Auth users can view all blog posts" ON blog_posts;
CREATE POLICY "Auth users can view all blog posts" ON blog_posts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Auth users can insert blog posts" ON blog_posts;
CREATE POLICY "Auth users can insert blog posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Auth users can update blog posts" ON blog_posts;
CREATE POLICY "Auth users can update blog posts" ON blog_posts FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Auth users can delete blog posts" ON blog_posts;
CREATE POLICY "Auth users can delete blog posts" ON blog_posts FOR DELETE TO authenticated USING (true);

-- Custom Forms Policies
DROP POLICY IF EXISTS "Public can view active forms" ON custom_forms;
CREATE POLICY "Public can view active forms" ON custom_forms FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Auth users can manage forms" ON custom_forms;
CREATE POLICY "Auth users can manage forms" ON custom_forms FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Submissions
DROP POLICY IF EXISTS "Public can submit forms" ON form_submissions;
CREATE POLICY "Public can submit forms" ON form_submissions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Auth users can manage submissions" ON form_submissions;
CREATE POLICY "Auth users can manage submissions" ON form_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert initial Homepage
INSERT INTO pages (title, slug, is_published, content_blocks)
VALUES (
    'Home', 
    'home', 
    true, 
    '[{"id":"hero-1","type":"hero","data":{"title":"TRANSFORMING BRAND STORIES","subtitle":"We elevate digital experiences."}}]'::jsonb
) ON CONFLICT (slug) DO NOTHING;
