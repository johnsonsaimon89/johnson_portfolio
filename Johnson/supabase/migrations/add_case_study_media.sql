-- Add media_items column to case_studies table
ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS media_items JSONB DEFAULT '[]'::jsonb;
