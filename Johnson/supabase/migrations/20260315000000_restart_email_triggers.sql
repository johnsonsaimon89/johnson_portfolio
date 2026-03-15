-- =============================================
-- Migration: Restart and Update Email Triggers
-- =============================================

-- 1. Ensure columns exist for sale tracking
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS sale_event TEXT;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS sale_label TEXT;

-- 2. Update notify_send_email function with new fields and expanded logic
CREATE OR REPLACE FUNCTION notify_send_email()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  edge_fn_url text;
  service_key text;
  admin_notification jsonb;
BEGIN
  -- Fetch config from table
  SELECT value INTO edge_fn_url FROM app_config WHERE key = 'edge_fn_base_url';
  SELECT value INTO service_key FROM app_config WHERE key = 'app_service_role_key';

  IF edge_fn_url IS NULL OR service_key IS NULL THEN
    RAISE WARNING 'Missing app_config: edge_fn_base_url or app_service_role_key. Email not sent.';
    RETURN NEW;
  END IF;

  edge_fn_url := edge_fn_url || '/functions/v1/send-email';

  IF TG_TABLE_NAME = 'newsletter_subscribers' THEN
    payload := jsonb_build_object(
      'type',  'welcome',
      'email', NEW.email,
      'name',  COALESCE(NEW.name, 'Friend')
    );

  ELSIF TG_TABLE_NAME = 'purchase_orders' AND TG_OP = 'INSERT' THEN
    -- Common fields for all order-related emails
    payload := jsonb_build_object(
      'email',         NEW.customer_email,
      'name',          NEW.customer_name,
      'product_title', NEW.product_title,
      'amount_tzs',     NEW.amount_tzs,
      'order_id',       NEW.id,
      'sale_event',     NEW.sale_event,
      'sale_label',     NEW.sale_label
    );

    IF NEW.amount_tzs = 0 OR NEW.status = 'confirmed' THEN
      -- Free download or instant fulfillment
      payload := payload || jsonb_build_object(
        'type',     'free_download',
        'file_url', NEW.file_url
      );
    ELSE
      -- Customer confirmation (Payment Pending)
      payload := payload || jsonb_build_object(
        'type', 'purchase_confirmation'
      );
      
      -- Admin notification
      admin_notification := payload || jsonb_build_object(
        'type',           'admin_order_notification',
        'email',          'admin', -- Special flag for Edge function
        'customer_email', NEW.customer_email
      );
      
      -- Send admin notification too
      PERFORM net.http_post(
        url     := edge_fn_url,
        headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || service_key),
        body := admin_notification
      );
    END IF;

  ELSIF TG_TABLE_NAME = 'purchase_orders'
        AND TG_OP = 'UPDATE'
        AND NEW.status = 'confirmed'
        AND OLD.status != 'confirmed' THEN
    -- File delivery email when admin confirms order
    payload := jsonb_build_object(
      'type',          'file_delivery',
      'email',         NEW.customer_email,
      'name',          NEW.customer_name,
      'product_title', NEW.product_title,
      'file_url',      NEW.file_url,
      'order_id',      NEW.id,
      'sale_event',     NEW.sale_event,
      'sale_label',     NEW.sale_label
    );
    
  ELSIF TG_TABLE_NAME = 'messages' AND TG_OP = 'INSERT' THEN
    -- Thank you to customer
    payload := jsonb_build_object(
      'type',    'contact_received',
      'email',   NEW.email,
      'name',    NEW.name,
      'subject', NEW.subject
    );
    
    -- Admin notification
    admin_notification := jsonb_build_object(
      'type',           'admin_contact_notification',
      'email',          'admin',
      'customer_email', NEW.email,
      'name',           NEW.name,
      'subject',        NEW.subject,
      'sender_message', NEW.message
    );
    
    PERFORM net.http_post(
      url     := edge_fn_url,
      headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || service_key),
      body := admin_notification
    );
    
  ELSE
    RETURN NEW;
  END IF;

  -- Final sanity check: don't send if type is missing (already handled in branches but just in case)
  IF payload->>'type' IS NOT NULL THEN
    PERFORM net.http_post(
      url     := edge_fn_url,
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := payload
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-attach triggers to ensure they are active
DROP TRIGGER IF EXISTS on_order_insert ON purchase_orders;
CREATE TRIGGER on_order_insert
  AFTER INSERT ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_send_email();

DROP TRIGGER IF EXISTS on_order_confirmed ON purchase_orders;
CREATE TRIGGER on_order_confirmed
  AFTER UPDATE ON purchase_orders
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed' AND OLD.status != 'confirmed')
  EXECUTE FUNCTION notify_send_email();

DROP TRIGGER IF EXISTS on_message_insert ON messages;
CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_send_email();
