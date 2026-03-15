-- =============================================
-- Migration: Fix Triggers & Schema for Emails and Orders
-- =============================================

-- 0. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 1. Ensure columns exist on purchase_orders
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS sale_event TEXT;

-- 2. Update notify_send_email function
CREATE OR REPLACE FUNCTION notify_send_email()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  edge_fn_url text;
  service_key text;
BEGIN
  -- Fetch config from table
  SELECT value INTO edge_fn_url FROM app_config WHERE key = 'edge_fn_base_url';
  SELECT value INTO service_key FROM app_config WHERE key = 'app_service_role_key';

  IF edge_fn_url IS NULL OR service_key IS NULL THEN
    RAISE WARNING 'Missing app_config: edge_fn_base_url or app_service_role_key. Email not sent.';
    RETURN NEW;
  END IF;

  edge_fn_url := edge_fn_url || '/functions/v1/send-email';

  -- Case A: NEWSLETTER SUBSCRIBERS
  IF TG_TABLE_NAME = 'newsletter_subscribers' THEN
    payload := jsonb_build_object(
      'type',  'welcome',
      'email', NEW.email,
      'name',  COALESCE(NEW.name, 'Friend')
    );

  -- Case B: PURCHASE ORDERS
  ELSIF TG_TABLE_NAME = 'purchase_orders' THEN
    
    -- Case B1: NEW ORDER (paid or free)
    IF TG_OP = 'INSERT' THEN
      -- Customer: Free Download vs Paid Confirmation
      IF NEW.amount_tzs = 0 OR NEW.status = 'confirmed' THEN
        payload := jsonb_build_object(
          'type',          'free_download',
          'email',         NEW.customer_email,
          'name',          NEW.customer_name,
          'product_title', NEW.product_title,
          'file_url',      NEW.file_url,
          'sale_event',    COALESCE(NEW.sale_event, ''),
          'is_on_sale',    COALESCE(NEW.is_on_sale, false)
        );
      ELSE
        payload := jsonb_build_object(
          'type',           'purchase_confirmation',
          'email',          NEW.customer_email,
          'name',           NEW.customer_name,
          'product_title',  NEW.product_title,
          'amount_tzs',     NEW.amount_tzs,
          'order_id',       NEW.id,
          'sale_event',     COALESCE(NEW.sale_event, ''),
          'is_on_sale',     COALESCE(NEW.is_on_sale, false)
        );
        
        -- Special: Notify Admin for paid orders
        PERFORM net.http_post(
          edge_fn_url,
          jsonb_build_object(
            'type',           'admin_order_notification',
            'email',          'admin',
            'customer_email', NEW.customer_email,
            'name',           NEW.customer_name,
            'product_title',  NEW.product_title,
            'amount_tzs',     NEW.amount_tzs,
            'order_id',       NEW.id,
            'sale_event',     COALESCE(NEW.sale_event, '')
          ),
          '{}'::jsonb,
          jsonb_build_object(
            'Content-Type',  'application/json',
            'Authorization', 'Bearer ' || service_key
          ),
          5000
        );
      END IF;

    -- Case B2: ORDER UPDATED TO CONFIRMED
    ELSIF TG_OP = 'UPDATE'
          AND NEW.status = 'confirmed'
          AND OLD.status != 'confirmed' THEN
      payload := jsonb_build_object(
        'type',          'file_delivery',
        'email',         NEW.customer_email,
        'name',          NEW.customer_name,
        'product_title', NEW.product_title,
        'file_url',      NEW.file_url,
        'order_id',      NEW.id,
        'sale_event',    COALESCE(NEW.sale_event, ''),
        'is_on_sale',    COALESCE(NEW.is_on_sale, false)
      );
    ELSE
      RETURN NEW;
    END IF;

  -- Case C: NEW MESSAGES (Contact Form)
  ELSIF TG_TABLE_NAME = 'messages' AND TG_OP = 'INSERT' THEN
    -- 1. Notify Customer (Auto-reply)
    payload := jsonb_build_object(
      'type',    'contact_received',
      'email',   NEW.email,
      'name',    NEW.name,
      'subject', NEW.subject
    );
    
    -- 2. Notify Admin
    PERFORM net.http_post(
      edge_fn_url,
      jsonb_build_object(
        'type',           'admin_contact_notification',
        'email',          'admin',
        'customer_email', NEW.email,
        'name',           NEW.name,
        'subject',        NEW.subject,
        'sender_message', NEW.message
      ),
      '{}'::jsonb,
      jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      5000
    );

  ELSE
    RETURN NEW;
  END IF;

  -- Fire-and-forget HTTP call to Edge Function (Primary)
  PERFORM net.http_post(
    edge_fn_url,
    payload,
    '{}'::jsonb,
    jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    5000
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach Trigger to messages table
DROP TRIGGER IF EXISTS on_message_insert ON public.messages;
CREATE TRIGGER on_message_insert
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_send_email();

-- 4. Helper: Set Configuration (Run these with your real values if needed)
-- NOTE: 'edge_fn_base_url' should be your project URL
-- INSERT INTO public.app_config (key, value) 
-- VALUES ('edge_fn_base_url', 'https://qkwjerktszhlccrdjmxg.supabase.co') 
-- ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- NOTE: 'app_service_role_key' is found in Project Settings -> API
-- INSERT INTO public.app_config (key, value) 
-- VALUES ('app_service_role_key', 'YOUR_SERVICE_ROLE_KEY') 
-- ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
