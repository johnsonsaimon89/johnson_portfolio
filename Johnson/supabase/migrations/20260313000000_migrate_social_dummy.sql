-- Migration: Migrate Social Media Dummy Data to Dashboard (Including Campaigns)
-- Created: 2026-03-13

-- 1. Insert into community_content
-- (Ensuring we keep your original descriptions and add a punchy hook for the new design)
INSERT INTO public.community_content (type, title, description, hook, metrics, image_url, display_order)
VALUES 
('image', 'Smart Visuals', 'I use macro photography to highlight features that stop the scroll.', 'Stopping the scroll with macro precision.', '{"likes": "4.2k", "comments": "128"}'::jsonb, '/dummy/social/smart-visuals.png', 1),
('carousel', 'Educational Value', 'I break down complex industry myths into simple, actionable steps.', 'Strategy made simple.', '{"likes": "8.9k", "comments": "456", "saves": "2.1k"}'::jsonb, '/dummy/social/educational-value.png', 2),
('quote', 'Personal Story', 'I help brands connect with their audience through authentic storytelling.', 'Connecting through authenticity.', '{"likes": "12k", "comments": "890"}'::jsonb, '/dummy/social/personal-story.png', 3),
('reel', 'Viral Hooks', 'I edit fast-paced videos designed to capture attention in the first 3 seconds.', 'The first 3 seconds are everything.', '{"views": "1.5M", "likes": "150k"}'::jsonb, '/dummy/social/viral-hooks.png', 4),
('image', 'Social Proof', 'I highlight customer wins to build trust and community loyalty.', 'Wins that build trust.', '{"likes": "3.1k", "comments": "50"}'::jsonb, '/dummy/social/social-proof.png', 5),
('carousel', 'Transparency', 'I share data-driven reports to show exactly how we drive growth.', 'Data-driven growth reports.', '{"likes": "2.5k", "comments": "30"}'::jsonb, '/dummy/social/transparency.png', 6);

-- 2. Insert into short_form_content
INSERT INTO public.short_form_content (title, views, era, video_url, display_order)
VALUES 
('Viral Hook Strategy', '2.1M', 'The Era of Short-Form', '/dummy/social/viral-hooks.png', 1),
('My Content Workflow', '850K', 'The Era of Short-Form', '/dummy/social/smart-visuals.png', 2),
('Growth Trends 2024', '1.2M', 'The Era of Short-Form', '/dummy/social/transparency.png', 3);

-- 3. Insert into case_studies (Social Campaigns)
-- We use the full Goal to ensure no text is removed.
INSERT INTO public.case_studies (type, organization_name, organization_type, content, is_active, display_order)
VALUES 
('social', 'NatureVoice: Re-engaging a Global Audience', 'Conservation', '{
    "paragraphs": [
        "Many brands in the conservation space struggle to maintain consistency and voice across platforms, often losing their audience to noise.",
        "I stepped in to build a sustainable content workflow, focusing on high-retention storytelling that turned passive followers into active advocates."
    ],
    "challenges": ["Establishing a regular posting rhythm", "Finding a clear, authentic voice", "Building deeper audience relationships"],
    "tool_stack": "Meta Business Suite, Canva, CapCut, Metricool",
    "before_after": {
        "after": {"engagement": "5.8%", "reach": "1.3M", "growth": "+12K/mo"},
        "before": {"engagement": "1.2%", "reach": "15K", "growth": "0/mo"}
    }
}'::jsonb, true, 1),
('social', 'UrbanEdu: Simplifying Complex Finance', 'Ed-Tech', '{
    "paragraphs": [
        "Financial literacy is often seen as dry or intimidating, making it difficult for Ed-Tech brands to capture and hold student attention.",
        "I reimagined their content pillars, using fast-paced vertical video to break down complex topics into 60-second \"edu-tainment\" snacks."
    ],
    "challenges": ["Breaking down dry financial jargon", "Competing with lifestyle content", "Converting views into course signups"],
    "tool_stack": "CapCut, Adobe Premiere, Notion, TikTok Analytics",
    "before_after": {
        "after": {"views": "2.4M", "saves": "45K", "ROI": "3.2x"},
        "before": {"views": "120K", "saves": "1.2K", "ROI": "0.8x"}
    }
}'::jsonb, true, 2);
