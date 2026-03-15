-- Create Site Content Table for managing dynamic texts
CREATE TABLE IF NOT EXISTS site_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    section TEXT NOT NULL,
    label TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Policies for Site Content
DROP POLICY IF EXISTS "Site Content is viewable by everyone" ON site_content;
CREATE POLICY "Site Content is viewable by everyone" ON site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site Content is manageable by authenticated users" ON site_content;
CREATE POLICY "Site Content is manageable by authenticated users" ON site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed initial values from current hardcoded strings
INSERT INTO site_content (key, value, section, label)
VALUES 
    -- Studio Hero
    ('studio_hero_badge', 'Studio', 'Studio Hero', 'Badge Text'),
    ('studio_hero_title', 'The Studio is where ideas become digital platforms.', 'Studio Hero', 'Main Title'),
    ('studio_hero_description', 'I design modern websites using platforms like Squarespace and Webflow, creating clean and responsive sites that help brands present their work clearly online.\n\nI also explore AI-assisted workflows to help speed up website creation and improve digital publishing.', 'Studio Hero', 'Description Text'),
    
    -- Featured Projects
    ('featured_projects_badge', 'Featured Case Studies', 'Featured Projects', 'Badge Text'),
    ('featured_projects_title', 'Digital Platforms that Scale.', 'Featured Projects', 'Main Title'),
    ('featured_projects_description', 'High-performance solutions designed for clear brand presentation and sustainable growth.', 'Featured Projects', 'Introduction Text'),
    
    -- Studio Features
    ('studio_features_title', 'Engineered for Excellence', 'Studio Features', 'Main Title')
ON CONFLICT (key) DO NOTHING;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
