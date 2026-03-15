-- Add discount and event fields to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_price_tzs INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_label TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_event TEXT;

-- Add discount and event info to purchase_orders to track historical data
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS sale_event TEXT;

-- Update the notification function to include event info in payloads
CREATE OR REPLACE FUNCTION notify_send_email()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  edge_fn_url text;
  service_key text;
  product_record RECORD;
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

  ELSIF TG_TABLE_NAME = 'purchase_orders' THEN
    -- Common fields for all purchase types
    payload := jsonb_build_object(
      'email',          NEW.customer_email,
      'name',           NEW.customer_name,
      'product_title',  NEW.product_title,
      'order_id',       NEW.id,
      'sale_event',     COALESCE(NEW.sale_event, ''),
      'is_on_sale',     COALESCE(NEW.is_on_sale, false)
    );

    IF TG_OP = 'INSERT' THEN
      IF NEW.amount_tzs = 0 OR NEW.status = 'confirmed' THEN
        payload := payload || jsonb_build_object(
          'type',     'free_download',
          'file_url', NEW.file_url
        );
      ELSE
        payload := payload || jsonb_build_object(
          'type',       'purchase_confirmation',
          'amount_tzs', NEW.amount_tzs
        );
      END IF;

    ELSIF TG_OP = 'UPDATE'
          AND NEW.status = 'confirmed'
          AND OLD.status != 'confirmed' THEN
      payload := payload || jsonb_build_object(
        'type',     'file_delivery',
        'file_url', NEW.file_url
      );
    ELSE
      RETURN NEW;
    END IF;

  ELSE
    RETURN NEW;
  END IF;

  -- Fire-and-forget HTTP call to Edge Function
  PERFORM net.http_post(
    url     := edge_fn_url,
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
