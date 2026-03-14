-- Add media_items JSONB column to community_content
ALTER TABLE community_content ADD COLUMN IF NOT EXISTS media_items JSONB DEFAULT '[]'::jsonb;

-- Add media_items JSONB column to short_form_content
ALTER TABLE short_form_content ADD COLUMN IF NOT EXISTS media_items JSONB DEFAULT '[]'::jsonb;

-- Update RLS policies to ensure these columns are accessible
-- (Existing policies usually cover all columns, but good to be explicit if needed)
-- Public can view
-- Authenticated can all
