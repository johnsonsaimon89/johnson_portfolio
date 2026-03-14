-- Migration: Add category to testimonials and migrate hard-coded data
-- Created: 2026-03-13

-- 1. Add category column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='testimonials' AND column_name='category') THEN
        ALTER TABLE testimonials ADD COLUMN category TEXT DEFAULT 'general';
    END IF;
END $$;

-- 2. Migrate hard-coded Social Media testimonials
-- From smData.testimonials:
-- { quote: "I saw my engagement quadruple in 3 months. The strategy was flawless.", author: "CMO, Tech Startup" }
-- { quote: "Finally, someone who understands how to tell a story on TikTok.", author: "Founder, D2C Brand" }

INSERT INTO testimonials (quote, author, category, display_order)
VALUES 
('I saw my engagement quadruple in 3 months. The strategy was flawless.', 'CMO, Tech Startup', 'social_media', 1),
('Finally, someone who understands how to tell a story on TikTok.', 'Founder, D2C Brand', 'social_media', 2)
ON CONFLICT DO NOTHING;

-- 3. Migrate hard-coded Web Studio testimonials
-- From webData.testimonials:
-- { quote: "The mobile-first redesign transformed how our students interact with the platform. Engagement is at an all-time high.", author: "Director, EduLearn", role: "E-Learning Platform" }
-- { quote: "Our new portfolio finally feels as premium as our creative work. The interaction design is exactly what we needed.", author: "Founder, VisualCulture", role: "Creative Studio" }
-- { quote: "Simplifying our complex site allowed us to clearly communicate our mission. We''ve seen a massive jump in donor inquiries.", author: "Lead, GreenFields", role: "Environmental NGO" }

INSERT INTO testimonials (quote, author, role, category, display_order)
VALUES 
('The mobile-first redesign transformed how our students interact with the platform. Engagement is at an all-time high.', 'Director, EduLearn', 'E-Learning Platform', 'web_design', 3),
('Our new portfolio finally feels as premium as our creative work. The interaction design is exactly what we needed.', 'Founder, VisualCulture', 'Creative Studio', 'web_design', 4),
('Simplifying our complex site allowed us to clearly communicate our mission. We''ve seen a massive jump in donor inquiries.', 'Lead, GreenFields', 'Environmental NGO', 'web_design', 5)
ON CONFLICT DO NOTHING;
