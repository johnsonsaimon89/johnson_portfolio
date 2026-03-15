-- =============================================
-- Migration: Email Templates
-- =============================================

CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT UNIQUE NOT NULL, -- 'welcome', 'purchase_confirmation', 'file_delivery', 'free_download'
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Policies for templates
DROP POLICY IF EXISTS "Auth users can view email templates" ON email_templates;
CREATE POLICY "Auth users can view email templates" ON email_templates FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Auth users can manage email templates" ON email_templates;
CREATE POLICY "Auth users can manage email templates" ON email_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed Initial Data
INSERT INTO email_templates (type, subject, content)
VALUES 
(
    'welcome', 
    'Welcome to Johnson''s inner circle 🎉', 
    '<div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: -1px;">JOHNSON<span style="color: rgba(255,255,255,0.6)">.</span></h1>
          <p style="margin: 8px 0 0; opacity: 0.8;">Freelance Digital Creator</p>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #fff; margin: 0 0 16px;">Hey {{name}} 👋</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.7;">
            You''re officially on Johnson''s list — where creatives, entrepreneurs, and brands get the best tips on 
            social media strategy, web design, and digital storytelling.
          </p>
          <div style="text-align: center; margin-top: 32px;">
            <a href="{{site_url}}/resources" style="display: inline-block; background: linear-gradient(135deg, #6c63ff, #ff6584); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 100px; font-weight: 700; letter-spacing: 0.5px;">
              Browse Free Resources
            </a>
          </div>
        </div>
      </div>'
),
(
    'purchase_confirmation',
    'Order received: {{product_title}} ✅',
    '<div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 2rem; font-weight: 800;">JOHNSON<span style="opacity:0.6">.</span></h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #fff; margin: 0 0 8px;">Hi {{name}}, we got your order! 🙌</h2>
          {{#if sale_event}}<div style="color: #ff6584; font-weight: 700; margin-bottom: 15px;">✨ Event: {{sale_event}}</div>{{/if}}
          <p style="color: rgba(255,255,255,0.7); line-height: 1.7;">
            Your purchase of <strong style="color: #fff;">{{product_title}}</strong> has been received.
          </p>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0; font-family: monospace; font-size: 14px; color: #a78bfa;">Reference: {{order_id}}</p>
          </div>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.7;">
            ⏳ We''re verifying your payment. Once confirmed, you''ll receive a second email with your download link.
          </p>
        </div>
      </div>'
),
(
    'file_delivery',
    'Your file is ready: {{product_title}} 🎁',
    '<div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 2rem; font-weight: 800;">JOHNSON<span style="opacity:0.6">.</span></h1>
        </div>
        <div style="padding: 40px; text-align: center;">
          <h2 style="color: #fff; margin: 0 0 16px;">Payment confirmed! Here''s your file.</h2>
          <div style="margin: 32px 0;">
            <a href="{{file_url}}" style="display: inline-block; background: linear-gradient(135deg, #6c63ff, #ff6584); color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 100px; font-weight: 700;">
              ⬇️ Download Your File
            </a>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 12px; text-align: left;">
            🔗 Or copy this link: <a href="{{file_url}}" style="color: #a78bfa; word-break: break-all;">{{file_url}}</a>
          </p>
        </div>
      </div>'
),
(
    'free_download',
    'Your free resource: {{product_title}} 📦',
    '<div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #00f2fe, #4facfe); padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 2rem; font-weight: 800; color: #0a0a0a;">JOHNSON<span style="opacity:0.5">.</span></h1>
        </div>
        <div style="padding: 40px; text-align: center;">
          <h2 style="color: #fff; margin: 0 0 16px;">Your free resource is ready!</h2>
          {{#if sale_event}}<div style="color: #00f2fe; font-weight: 700; margin-bottom: 15px;">✨ {{sale_event}} Special</div>{{/if}}
          <div style="margin: 32px 0;">
            <a href="{{file_url}}" style="display: inline-block; background: linear-gradient(135deg, #00f2fe, #4facfe); color: #0a0a0a; text-decoration: none; padding: 16px 40px; border-radius: 100px; font-weight: 700;">
              ⬇️ Download Now
            </a>
          </div>
        </div>
      </div>'
),
(
    'admin_order_notification',
    'New Paid Order: {{product_title}} from {{name}} 💰',
    '<div style="font-family: sans-serif; padding: 20px;">
        <h2>You have a new paid order!</h2>
        <p><strong>Customer:</strong> {{name}} ({{customer_email}})</p>
        <p><strong>Product:</strong> {{product_title}}</p>
        <p><strong>Amount:</strong> {{amount_tzs}} TZS</p>
        {{#if sale_event}}<p><strong>Sale Event:</strong> {{sale_event}}</p>{{/if}}
        <p><strong>Reference:</strong> {{order_id}}</p>
        <hr />
        <p><a href="{{site_url}}/admin/dashboard">View in Dashboard</a></p>
    </div>'
),
(
    'contact_received',
    'Thanks for reaching out, {{name}}! ✉️',
    '<div style="font-family: sans-serif; padding: 20px;">
        <h2>Hey {{name}},</h2>
        <p>Thanks for getting in touch. I''ve received your message regarding <strong>{{subject}}</strong> and will get back to you as soon as possible.</p>
        <p>In the meantime, feel free to check out my latest resources or portfolio.</p>
        <br />
        <p>Best regards,<br />Johnson Saimon</p>
    </div>'
),
(
    'admin_contact_notification',
    'New Message: {{subject}} from {{name}} 📥',
    '<div style="font-family: sans-serif; padding: 20px;">
        <h2>New Inquiry Received</h2>
        <p><strong>From:</strong> {{name}} ({{customer_email}})</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #000;">
            {{sender_message}}
        </div>
        <hr />
        <p><a href="{{site_url}}/admin/dashboard">Open Inbox</a></p>
    </div>'
)
ON CONFLICT (type) DO UPDATE SET 
    subject = EXCLUDED.subject,
    content = EXCLUDED.content;
