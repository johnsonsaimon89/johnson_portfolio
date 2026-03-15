-- Add sales_count column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sales_count TEXT;
