-- Add category column to short_form_content table
ALTER TABLE public.short_form_content 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing records to have a default value if desired
UPDATE public.short_form_content 
SET category = 'Technique' 
WHERE category IS NULL;
