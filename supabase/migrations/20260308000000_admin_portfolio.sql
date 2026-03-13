-- Create Projects table
CREATE TABLE projects (
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
CREATE TABLE performances (
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
CREATE POLICY "Projects are viewable by everyone."
ON projects FOR SELECT
USING (true);

CREATE POLICY "Projects are insertable by authenticated users only."
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Projects are updatable by authenticated users only."
ON projects FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Projects are deletable by authenticated users only."
ON projects FOR DELETE
TO authenticated
USING (true);

-- Create Policies for Performances
CREATE POLICY "Performances are viewable by everyone."
ON performances FOR SELECT
USING (true);

CREATE POLICY "Performances are insertable by authenticated users only."
ON performances FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Performances are updatable by authenticated users only."
ON performances FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Performances are deletable by authenticated users only."
ON performances FOR DELETE
TO authenticated
USING (true);
