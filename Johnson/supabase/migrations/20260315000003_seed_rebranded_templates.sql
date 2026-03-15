-- =============================================
-- Migration: Seed Rebranded Email Templates (Master)
-- =============================================

-- Ensure the table exists
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Master Seed Data (Upsert)
INSERT INTO email_templates (type, subject, content)
VALUES 
(
    'welcome', 
    'Your Connection Confirmed 👋', 
    '<div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #030303; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; text-transform: uppercase;">JOHNSON<span style="color: #BDFF00;">.</span></h1>
          <p style="margin: 12px 0 0; color: #BDFF00; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Digital Strategist & Creator</p>
        </div>
        <div style="padding: 50px 40px;">
          <h2 style="color: #fff; margin: 0 0 20px; font-size: 1.5rem; font-weight: 700;">Welcome to the Inner Circle 🎉</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Hey {{name}}, you''re officially in. This is where I share high-impact insights on social media growth, web design, and digital storytelling.
          </p>
          <div style="text-align: center; margin-top: 40px;">
            <a href="{{site_url}}/resources" style="display: inline-block; background: #BDFF00; color: #030303; text-decoration: none; padding: 18px 40px; border-radius: 100px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
              Explore the Resources
            </a>
          </div>
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 10px; letter-spacing: 1px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>'
),
(
    'purchase_confirmation',
    'Payment Verifying: We got your order! ✅',
    '<div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #030303; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; text-transform: uppercase;">JOHNSON<span style="color: #BDFF00;">.</span></h1>
        </div>
        <div style="padding: 50px 40px;">
          <h2 style="color: #fff; margin: 0 0 12px; font-size: 1.5rem; font-weight: 700;">Order Received 🙌</h2>
          {{#if sale_event}}<div style="display: inline-block; background: rgba(189, 255, 0, 0.1); color: #BDFF00; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase;">✨ Event: {{sale_event}}</div>{{/if}}
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Hi {{name}}, we''ve successfully received your order for <strong style="color: #BDFF00;">{{product_title}}</strong>. 
          </p>
          <div style="padding: 24px; border-radius: 16px; background: rgba(189, 255, 0, 0.03); border: 1px solid rgba(189, 255, 0, 0.1); margin: 30px 0;">
             <p style="margin: 0; color: #BDFF00; font-size: 14px; line-height: 1.6; font-weight: 500;">
                ⏳ Payment Verifying: Once confirmed, you''ll receive your download link in a separate email.
             </p>
          </div>
          
          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-top: 30px;">
             <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 13px; line-height: 1.6;">
                <strong>Important:</strong> Please mark this email as <strong>"Not Spam"</strong> right now. This ensures that as soon as your order is verified, you will receive the notification and download link directly in your inbox.
             </p>
          </div>
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 10px; letter-spacing: 1px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>'
),
(
    'file_delivery',
    'Download Ready: {{product_title}} 🎁',
    '<div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #030303; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; text-transform: uppercase;">JOHNSON<span style="color: #BDFF00;">.</span></h1>
        </div>
        <div style="padding: 50px 40px; text-align: center;">
          <h2 style="color: #fff; margin: 0 0 12px; font-size: 1.5rem; font-weight: 700;">Asset Ready 🎁</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Your professional resource <strong style="color: #BDFF00;">{{product_title}}</strong> is now available for download.
          </p>
          <div style="margin: 40px 0;">
            <a href="{{file_url}}" style="display: inline-block; background: #BDFF00; color: #030303; text-decoration: none; padding: 20px 50px; border-radius: 100px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
              Download Resource
            </a>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 40px; line-height: 1.6;">
            <strong>Note:</strong> If you find this resource valuable, follow my socials for daily digital strategy updates.
          </p>
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 10px; letter-spacing: 1px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>'
),
(
    'free_download',
    'Your Resource: {{product_title}} 📦',
    '<div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #BDFF00; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #030303; text-transform: uppercase;">JOHNSON<span style="color: #fff;">.</span></h1>
        </div>
        <div style="padding: 50px 40px; text-align: center;">
          <h2 style="color: #fff; margin: 0 0 12px; font-size: 1.5rem; font-weight: 700;">Resource Ready 📦</h2>
          {{#if sale_event}}<div style="display: inline-block; background: rgba(189, 255, 0, 0.1); color: #BDFF00; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase;">✨ Special: {{sale_event}}</div>{{/if}}
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Here is your download link for <strong style="color: #BDFF00;">{{product_title}}</strong>.
          </p>
          <div style="margin: 40px 0;">
            <a href="{{file_url}}" style="display: inline-block; background: #BDFF00; color: #030303; text-decoration: none; padding: 20px 50px; border-radius: 100px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
              Get My Resource
            </a>
          </div>
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 10px; letter-spacing: 1px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>'
),
(
    'contact_received',
    'Message Received: Thanks for reaching out! ✉️',
    '<div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #030303; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; text-transform: uppercase;">JOHNSON<span style="color: #BDFF00;">.</span></h1>
        </div>
        <div style="padding: 50px 40px;">
          <h2 style="color: #fff; margin: 0 0 20px; font-size: 1.5rem; font-weight: 700;">Inquiry Logged 📥</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Hi {{name}}, thanks for getting in touch regarding <strong style="color: #BDFF00;">{{subject}}</strong>. 
          </p>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px; margin-top: 10px;">
            We have received your message and will get back to you within 24-48 business hours. 
          </p>
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 10px; letter-spacing: 1px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>'
),
(
    'admin_order_notification',
    'Action Required: New Paid Order 💰',
    '<div style="font-family: sans-serif; padding: 20px;">
        <h2>New Order for Verification</h2>
        <p><strong>Customer:</strong> {{name}} ({{customer_email}})</p>
        <p><strong>Product:</strong> {{product_title}}</p>
        <p><strong>Amount:</strong> {{amount_tzs}} TZS</p>
        <p><strong>Reference:</strong> {{order_id}}</p>
        <hr />
        <p><a href="{{site_url}}/admin/dashboard">Go to Dashboard to Verify</a></p>
    </div>'
),
(
    'admin_contact_notification',
    'New Message from Website 📥',
    '<div style="font-family: sans-serif; padding: 20px;">
        <h2>New Inquiry Received</h2>
        <p><strong>From:</strong> {{name}} ({{customer_email}})</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #BDFF00;">
            {{sender_message}}
        </div>
        <hr />
        <p><a href="{{site_url}}/admin/dashboard">Open Inbox</a></p>
    </div>'
)
ON CONFLICT (type) DO UPDATE SET 
    subject = EXCLUDED.subject,
    content = EXCLUDED.content,
    updated_at = NOW();
