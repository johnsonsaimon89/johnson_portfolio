-- Create Pages Table
CREATE TABLE pages (
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
CREATE TABLE blog_posts (
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
CREATE TABLE user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Forms Table
CREATE TABLE custom_forms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    fields JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true
);

-- Create Form Submissions
CREATE TABLE form_submissions (
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

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
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

-- Provide initial admin access to whoever creates the first user, or handle manually.
-- For now, allow authenticated users to view roles (to determine permissions contextually)
CREATE POLICY "Users can view their own role" ON user_roles FOR SELECT USING (auth.uid() = user_id);
-- Only superuser/service_role can insert/update roles for security, or we could let the first user be admin via trigger but let's keep it simple.
-- During development, we can just allow authenticated users to act like admins.
-- Let's make a generic accessible policy for auth users during this rapid prototype, and refine later if needed.

-- Pages Policies (Public can read published, Auth can full access)
CREATE POLICY "Public can view published pages" ON pages FOR SELECT USING (is_published = true);
CREATE POLICY "Auth users can view all pages" ON pages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert pages" ON pages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update pages" ON pages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete pages" ON pages FOR DELETE TO authenticated USING (true);

-- Blog Posts Policies
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Auth users can view all blog posts" ON blog_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert blog posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update blog posts" ON blog_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete blog posts" ON blog_posts FOR DELETE TO authenticated USING (true);

-- Custom Forms Policies (Public can read active forms, submit data)
CREATE POLICY "Public can view active forms" ON custom_forms FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users can manage forms" ON custom_forms FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Submissions (Public can submit, Auth can manage)
CREATE POLICY "Public can submit forms" ON form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can manage submissions" ON form_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket for media will be managed via Supabase dashboard / API directly, assuming a 'media' bucket exists or we will create it via SDK/client.

-- Insert initial Homepage
INSERT INTO pages (title, slug, is_published, content_blocks)
VALUES (
    'Home', 
    'home', 
    true, 
    '[{"id":"hero-1","type":"hero","data":{"title":"TRANSFORMING BRAND STORIES","subtitle":"We elevate digital experiences."}}]'::jsonb
) ON CONFLICT (slug) DO NOTHING;
