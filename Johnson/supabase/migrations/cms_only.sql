-- Create Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    size TEXT DEFAULT 'small',
    link TEXT,
    tags TEXT[],
    is_upcoming BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0
);

-- Create Performances table
CREATE TABLE IF NOT EXISTS performances (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value TEXT NOT NULL,
    category TEXT NOT NULL,
    trend TEXT,
    display_order INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE performances ENABLE ROW LEVEL SECURITY;

-- Create Policies for Projects
DROP POLICY IF EXISTS "Projects are viewable by everyone." ON projects;
CREATE POLICY "Projects are viewable by everyone."
ON projects FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Projects are insertable by authenticated users only." ON projects;
CREATE POLICY "Projects are insertable by authenticated users only."
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Projects are updatable by authenticated users only." ON projects;
CREATE POLICY "Projects are updatable by authenticated users only."
ON projects FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Projects are deletable by authenticated users only." ON projects;
CREATE POLICY "Projects are deletable by authenticated users only."
ON projects FOR DELETE
TO authenticated
USING (true);

-- Create Policies for Performances
DROP POLICY IF EXISTS "Performances are viewable by everyone." ON performances;
CREATE POLICY "Performances are viewable by everyone."
ON performances FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Performances are insertable by authenticated users only." ON performances;
CREATE POLICY "Performances are insertable by authenticated users only."
ON performances FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Performances are updatable by authenticated users only." ON performances;
CREATE POLICY "Performances are updatable by authenticated users only."
ON performances FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Performances are deletable by authenticated users only." ON performances;
CREATE POLICY "Performances are deletable by authenticated users only."
ON performances FOR DELETE
TO authenticated
USING (true);
-- Create Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread'
);

-- Create Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT,
    company TEXT,
    display_order INTEGER DEFAULT 0
);

-- Create Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hero_title TEXT,
    hero_subtitle TEXT,
    about_bio_array TEXT[],
    contact_email TEXT,
    contact_phone TEXT
);

-- Ensure only one row in site_settings
ALTER TABLE site_settings ADD CONSTRAINT config_single_row CHECK (id = 1);

-- Default Settings Insert
INSERT INTO site_settings (id, hero_title, hero_subtitle, about_bio_array, contact_email, contact_phone)
VALUES (
    1,
    'TRANSFORMING BRAND STORIES',
    'We elevate digital experiences through strategic design and immersive storytelling. Shaping the future of online presence.',
    ARRAY['Passionate about creating digital experiences that leave a lasting impact.', 'Bridging the gap between aesthetics and functionality.', 'Dedicated to continuous learning and pushing creative boundaries.'],
    'johnsonsaimon111@gmail.com',
    '+255768662378'
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies for Messages
-- Public can only insert
DROP POLICY IF EXISTS "Messages are insertable by public." ON messages;
CREATE POLICY "Messages are insertable by public."
ON messages FOR INSERT
WITH CHECK (true);

-- Admins can view/update/delete
DROP POLICY IF EXISTS "Messages are viewable by authenticated users only." ON messages;
CREATE POLICY "Messages are viewable by authenticated users only."
ON messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Messages are updatable by authenticated users only." ON messages;
CREATE POLICY "Messages are updatable by authenticated users only."
ON messages FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Messages are deletable by authenticated users only." ON messages;
CREATE POLICY "Messages are deletable by authenticated users only."
ON messages FOR DELETE TO authenticated USING (true);


-- Policies for Testimonials
DROP POLICY IF EXISTS "Testimonials are viewable by everyone." ON testimonials;
CREATE POLICY "Testimonials are viewable by everyone."
ON testimonials FOR SELECT USING (true);
DROP POLICY IF EXISTS "Testimonials are insertable by authenticated users only." ON testimonials;
CREATE POLICY "Testimonials are insertable by authenticated users only."
ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Testimonials are updatable by authenticated users only." ON testimonials;
CREATE POLICY "Testimonials are updatable by authenticated users only."
ON testimonials FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Testimonials are deletable by authenticated users only." ON testimonials;
CREATE POLICY "Testimonials are deletable by authenticated users only."
ON testimonials FOR DELETE TO authenticated USING (true);


-- Policies for Site Settings
DROP POLICY IF EXISTS "Site Settings are viewable by everyone." ON site_settings;
CREATE POLICY "Site Settings are viewable by everyone."
ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Site Settings are insertable by authenticated users only." ON site_settings;
CREATE POLICY "Site Settings are insertable by authenticated users only."
ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Site Settings are updatable by authenticated users only." ON site_settings;
CREATE POLICY "Site Settings are updatable by authenticated users only."
ON site_settings FOR UPDATE TO authenticated USING (true);

