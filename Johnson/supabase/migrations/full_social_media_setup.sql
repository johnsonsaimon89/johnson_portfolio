-- 1. Create community_content Table
CREATE TABLE IF NOT EXISTS public.community_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    type TEXT NOT NULL DEFAULT 'image',
    title TEXT NOT NULL,
    description TEXT,
    hook TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    media_items JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0
);

-- 2. Create short_form_content Table
CREATE TABLE IF NOT EXISTS public.short_form_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    views TEXT DEFAULT '0',
    era TEXT DEFAULT 'The Era of Short-Form',
    video_url TEXT,
    media_items JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0
);

-- 3. Enable RLS
ALTER TABLE public.community_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.short_form_content ENABLE ROW LEVEL SECURITY;

-- 4. Policies for community_content
DROP POLICY IF EXISTS "Public can view community content" ON public.community_content;
CREATE POLICY "Public can view community content" ON public.community_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users can manage community content" ON public.community_content;
CREATE POLICY "Auth users can manage community content" ON public.community_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Policies for short_form_content
DROP POLICY IF EXISTS "Public can view short form content" ON public.short_form_content;
CREATE POLICY "Public can view short form content" ON public.short_form_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users can manage short form content" ON public.short_form_content;
CREATE POLICY "Auth users can manage short form content" ON public.short_form_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
