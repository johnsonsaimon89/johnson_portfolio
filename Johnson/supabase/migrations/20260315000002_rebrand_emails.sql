-- =============================================
-- Migration: Rebrand Email Templates
-- =============================================

-- We use DO block to ensure we can update templates safely
DO $$
BEGIN

-- 1. Welcome Email Refresh
UPDATE email_templates 
SET content = '<div style="font-family: ''Inter'', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #030303; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; text-transform: uppercase;">JOHNSON<span style="color: #BDFF00;">.</span></h1>
          <p style="margin: 12px 0 0; color: #BDFF00; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Digital Strategist & Creator</p>
        </div>
        <div style="padding: 50px 40px;">
          <h2 style="color: #fff; margin: 0 0 20px; font-size: 1.5rem; font-weight: 700;">Connection Confirmed 👋</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Hey {{name}}, you''ve just joined my inner circle. This is where I share the exact strategies I use to build thriving digital ecosystems for brands and creators.
          </p>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px; margin-top: 10px;">
            Get ready for insights on social media growth, high-impact web design, and the future of digital storytelling.
          </p>
          <div style="text-align: center; margin-top: 40px;">
            <a href="{{site_url}}/resources" style="display: inline-block; background: #BDFF00; color: #030303; text-decoration: none; padding: 18px 40px; border-radius: 100px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
              Explore the Resources
            </a>
          </div>
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 11px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>'
WHERE type = 'welcome';

-- 2. Purchase Confirmation Refresh
UPDATE email_templates 
SET content = '<div style="font-family: ''Inter'', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #030303; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; text-transform: uppercase;">JOHNSON<span style="color: #BDFF00;">.</span></h1>
        </div>
        <div style="padding: 50px 40px;">
          <h2 style="color: #fff; margin: 0 0 12px; font-size: 1.5rem; font-weight: 700;">Order Received ✅</h2>
          {{#if sale_event}}<div style="display: inline-block; background: rgba(189, 255, 0, 0.1); color: #BDFF00; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase;">✨ Event: {{sale_event}}</div>{{/if}}
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Hi {{name}}, we''ve successfully logged your order for <strong style="color: #BDFF00;">{{product_title}}</strong>.
          </p>
          <div style="padding: 24px; border-radius: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">
             <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6;">
                Currently verifying your payment. You''ll receive your download link in a separate email as soon as the verification is complete.
             </p>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 30px; line-height: 1.6;">
            <strong>Pro Tip:</strong> Ensure our emails don''t end up in your spam folder by marking us as a safe sender.
          </p>
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 11px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>'
WHERE type = 'purchase_confirmation';

-- 3. File Delivery Refresh
UPDATE email_templates 
SET content = '<div style="font-family: ''Inter'', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #030303; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; text-transform: uppercase;">JOHNSON<span style="color: #BDFF00;">.</span></h1>
        </div>
        <div style="padding: 50px 40px; text-align: center;">
          <h2 style="color: #fff; margin: 0 0 12px; font-size: 1.5rem; font-weight: 700;">Asset Ready 🎁</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Payment confirmed. You can now access your professional resource: <strong style="color: #BDFF00;">{{product_title}}</strong>.
          </p>
          <div style="margin: 40px 0;">
            <a href="{{file_url}}" style="display: inline-block; background: #BDFF00; color: #030303; text-decoration: none; padding: 20px 50px; border-radius: 100px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
              Download Resource
            </a>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 40px; line-height: 1.6;">
            Having trouble? If the button doesn''t work in your email client, try checking your internet connection or mark this email as "Not Spam" to enable all features.
          </p>
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 11px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>'
WHERE type = 'file_delivery';

-- 4. Free Download Refresh
UPDATE email_templates 
SET content = '<div style="font-family: ''Inter'', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #BDFF00; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #030303; text-transform: uppercase;">JOHNSON<span style="color: #fff;">.</span></h1>
        </div>
        <div style="padding: 50px 40px; text-align: center;">
          <h2 style="color: #fff; margin: 0 0 12px; font-size: 1.5rem; font-weight: 700;">Your Free Resource 📦</h2>
          {{#if sale_event}}<div style="display: inline-block; background: rgba(189, 255, 0, 0.1); color: #BDFF00; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase;">✨ Special: {{sale_event}}</div>{{/if}}
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Success! Here is your download link for <strong style="color: #BDFF00;">{{product_title}}</strong>.
          </p>
          <div style="margin: 40px 0;">
            <a href="{{file_url}}" style="display: inline-block; background: #BDFF00; color: #030303; text-decoration: none; padding: 20px 50px; border-radius: 100px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
              Get My Resource
            </a>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 40px; line-height: 1.6;">
            <strong>Pro Tip:</strong> If this helped you, imagine what my private strategies could do. Follow me on socials for more.
          </p>
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 11px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>'
WHERE type = 'free_download';

-- 5. Contact Auto-Reply Refresh
UPDATE email_templates 
SET content = '<div style="font-family: ''Inter'', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #030303; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; text-transform: uppercase;">JOHNSON<span style="color: #BDFF00;">.</span></h1>
        </div>
        <div style="padding: 50px 40px;">
          <h2 style="color: #fff; margin: 0 0 20px; font-size: 1.5rem; font-weight: 700;">Message Received 📥</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Hi {{name}}, thanks for reaching out. I''ve received your message regarding <strong style="color: #BDFF00;">{{subject}}</strong>.
          </p>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px; margin-top: 10px;">
            My team and I are reviewing your inquiry. You can expect a response within 24-48 business hours.
          </p>
          <div style="margin-top: 40px; padding: 20px; border-radius: 12px; background: rgba(189, 255, 0, 0.05); border-left: 4px solid #BDFF00;">
            <p style="margin: 0; color: #BDFF00; font-style: italic; font-size: 14px;">"Strategy is about making choices, trade-offs; it''s about deliberately choosing to be different."</p>
          </div>
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 11px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>'
WHERE type = 'contact_received';

END $$;
