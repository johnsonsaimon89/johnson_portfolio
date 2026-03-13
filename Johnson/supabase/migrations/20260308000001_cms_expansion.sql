-- Create Messages table
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread'
);

-- Create Testimonials table
CREATE TABLE testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT,
    company TEXT,
    display_order INTEGER DEFAULT 0
);

-- Create Site Settings table
CREATE TABLE site_settings (
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
CREATE POLICY "Messages are insertable by public."
ON messages FOR INSERT
WITH CHECK (true);

-- Admins can view/update/delete
CREATE POLICY "Messages are viewable by authenticated users only."
ON messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Messages are updatable by authenticated users only."
ON messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Messages are deletable by authenticated users only."
ON messages FOR DELETE TO authenticated USING (true);


-- Policies for Testimonials
CREATE POLICY "Testimonials are viewable by everyone."
ON testimonials FOR SELECT USING (true);
CREATE POLICY "Testimonials are insertable by authenticated users only."
ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Testimonials are updatable by authenticated users only."
ON testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Testimonials are deletable by authenticated users only."
ON testimonials FOR DELETE TO authenticated USING (true);


-- Policies for Site Settings
CREATE POLICY "Site Settings are viewable by everyone."
ON site_settings FOR SELECT USING (true);
CREATE POLICY "Site Settings are insertable by authenticated users only."
ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Site Settings are updatable by authenticated users only."
ON site_settings FOR UPDATE TO authenticated USING (true);

