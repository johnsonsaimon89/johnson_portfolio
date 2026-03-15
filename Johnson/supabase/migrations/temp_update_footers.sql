UPDATE email_templates 
SET content = content || '<footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); font-size: 11px;"><strong>Note:</strong> Not seeing our emails? Check your Spam folder and mark us as Not Spam.</footer>' 
WHERE type IN ('welcome', 'purchase_confirmation', 'file_delivery', 'free_download');

UPDATE email_templates 
SET content = content || '<footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 11px;"><strong>Note:</strong> If this email is in spam, please mark as Not Spam so you don''t miss your resources.</footer>' 
WHERE type = 'contact_received';
