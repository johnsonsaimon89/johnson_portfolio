-- Add payment details to site_settings (Updated with Bank Name)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS payment_bank_name TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS payment_bank_account TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS payment_lipa_number TEXT;

-- Update existing row with user provided details
UPDATE site_settings SET 
    payment_bank_name = 'NBC',
    payment_bank_account = '014204010381',
    payment_lipa_number = 'Your Lipa/Phone Numbers Here'
WHERE id = 1;

-- Helpful for debugging: check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'site_settings';
