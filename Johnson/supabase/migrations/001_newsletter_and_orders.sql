-- =============================================
-- Migration: Newsletter Subscribers & Purchase Orders
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================

-- ── 1. Newsletter Subscribers Table ────────────────────

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  name        text,
  source      text DEFAULT 'footer',   -- 'footer' | 'free_download'
  subscribed  boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon) to subscribe via the form
CREATE POLICY "allow_anon_insert_newsletter"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated/service role can read subscribers
CREATE POLICY "allow_service_select_newsletter"
  ON newsletter_subscribers
  FOR SELECT
  USING (auth.role() = 'service_role');


-- ── 2. Purchase Orders Table ────────────────────────────

CREATE TABLE IF NOT EXISTS purchase_orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      text NOT NULL,
  product_title   text,
  product_type    text,
  customer_name   text NOT NULL,
  customer_email  text NOT NULL,
  customer_phone  text,
  transaction_id  text,
  payment_method  text,
  amount_tzs      integer,
  status          text DEFAULT 'pending',   -- 'pending' | 'confirmed'
  file_url        text,                     -- populated when you confirm
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

-- Allow anon to submit orders
CREATE POLICY "allow_anon_insert_orders"
  ON purchase_orders
  FOR INSERT
  WITH CHECK (true);

-- Only service_role can read / update orders (admin)
CREATE POLICY "allow_service_select_orders"
  ON purchase_orders
  FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "allow_service_update_orders"
  ON purchase_orders
  FOR UPDATE
  USING (auth.role() = 'service_role');


-- ── 5. App Configuration Table (Safe alternative to GUC) ──

CREATE TABLE IF NOT EXISTS app_config (
  key   text PRIMARY KEY,
  value text NOT NULL
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Only service role can manage config
CREATE POLICY "service_role_manage_config" ON app_config
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 3. Trigger Function — calls send-email Edge Function ──

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

  IF TG_TABLE_NAME = 'newsletter_subscribers' THEN
    payload := jsonb_build_object(
      'type',  'welcome',
      'email', NEW.email,
      'name',  COALESCE(NEW.name, 'Friend')
    );

  ELSIF TG_TABLE_NAME = 'purchase_orders' AND TG_OP = 'INSERT' THEN
    IF NEW.amount_tzs = 0 OR NEW.status = 'confirmed' THEN
      payload := jsonb_build_object(
        'type',          'free_download',
        'email',         NEW.customer_email,
        'name',          NEW.customer_name,
        'product_title', NEW.product_title,
        'file_url',      NEW.file_url
      );
    ELSE
      payload := jsonb_build_object(
        'type',           'purchase_confirmation',
        'email',          NEW.customer_email,
        'name',           NEW.customer_name,
        'product_title',  NEW.product_title,
        'amount_tzs',     NEW.amount_tzs,
        'order_id',       NEW.id
      );
    END IF;

  ELSIF TG_TABLE_NAME = 'purchase_orders'
        AND TG_OP = 'UPDATE'
        AND NEW.status = 'confirmed'
        AND OLD.status != 'confirmed' THEN
    payload := jsonb_build_object(
      'type',          'file_delivery',
      'email',         NEW.customer_email,
      'name',          NEW.customer_name,
      'product_title', NEW.product_title,
      'file_url',      NEW.file_url,
      'order_id',      NEW.id
    );
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


-- ── 4. Attach Triggers ──────────────────────────────────

-- Trigger 1: welcome email after newsletter signup
DROP TRIGGER IF EXISTS on_newsletter_insert ON newsletter_subscribers;
CREATE TRIGGER on_newsletter_insert
  AFTER INSERT ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION notify_send_email();

-- Trigger 2: order confirmation email after purchase submitted
DROP TRIGGER IF EXISTS on_order_insert ON purchase_orders;
CREATE TRIGGER on_order_insert
  AFTER INSERT ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_send_email();

-- Trigger 3: file delivery email when admin confirms order
DROP TRIGGER IF EXISTS on_order_confirmed ON purchase_orders;
CREATE TRIGGER on_order_confirmed
  AFTER UPDATE ON purchase_orders
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed' AND OLD.status != 'confirmed')
  EXECUTE FUNCTION notify_send_email();


-- ── 6. Populate Config (Run these with your real values) ──

-- INSERT INTO app_config (key, value) VALUES ('edge_fn_base_url', 'https://your-project.supabase.co') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
-- INSERT INTO app_config (key, value) VALUES ('app_service_role_key', 'your-service-role-key') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
