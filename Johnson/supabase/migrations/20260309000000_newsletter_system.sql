-- =============================================
-- Migration: Newsletter System Expansion
-- =============================================

-- Add tags to existing subscribers (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='newsletter_subscribers' AND column_name='tags'
    ) THEN
        ALTER TABLE newsletter_subscribers ADD COLUMN tags text[] DEFAULT '{}';
    END IF;
END $$;

-- Drop trigger first to avoid conflicts if recreating
DROP TRIGGER IF EXISTS on_campaign_insert ON newsletter_campaigns;

-- Create campaigns table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject         text NOT NULL,
  preview_text    text,
  content_html    text,           -- HTML string to be sent via email
  content_json    jsonb,          -- Editor state from react-email-editor
  status          text DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent'
  send_date       timestamptz,    -- When it was sent or scheduled to be sent
  segment_tags    text[],         -- Subscribers with ANY of these tags receive it. If empty/null, sends to all active.
  sent_count      integer DEFAULT 0,
  open_count      integer DEFAULT 0,
  click_count     integer DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_service_all_campaigns"
  ON newsletter_campaigns
  FOR ALL
  USING (auth.role() = 'service_role');
