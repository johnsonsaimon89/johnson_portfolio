CREATE TABLE IF NOT EXISTS public.page_images (
    page_key TEXT PRIMARY KEY,
    label TEXT,
    image_url TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.page_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.page_images FOR SELECT USING (true);
CREATE POLICY "Allow anon updates" ON public.page_images FOR ALL USING (true); -- Adjust as needed for security

CREATE TABLE IF NOT EXISTS public.podcasts (
    id TEXT PRIMARY KEY, -- Spotify Episode ID
    title TEXT NOT NULL,
    episode_number INTEGER,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on podcasts" ON public.podcasts FOR SELECT USING (true);
CREATE POLICY "Allow anon updates on podcasts" ON public.podcasts FOR ALL USING (true);
