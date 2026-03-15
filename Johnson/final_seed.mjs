import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Helper to get env vars
const env = fs.readFileSync('.env', 'utf8');
const config = Object.fromEntries(
  env.split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const [k, ...v] = l.split('=');
      const val = v.join('=').trim().replace(/^["']|["']$/g, '');
      return [k.trim(), val];
    })
);

const supabase = createClient(config.VITE_SUPABASE_URL, config.VITE_SUPABASE_ANON_KEY);

const BRAND_TEMPLATES = [
  {
    type: 'welcome',
    subject: 'Your Connection Confirmed 👋',
    content: `<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #030303; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; text-transform: uppercase;">JOHNSON<span style="color: #BDFF00;">.</span></h1>
          <p style="margin: 12px 0 0; color: #BDFF00; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Digital Strategist & Creator</p>
        </div>
        <div style="padding: 50px 40px;">
          <h2 style="color: #fff; margin: 0 0 20px; font-size: 1.5rem; font-weight: 700;">Welcome to the Inner Circle 🎉</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Hey {{name}}, you're officially in. This is where I share high-impact insights on social media growth, web design, and digital storytelling.
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
      </div>`
  },
  {
    type: 'purchase_confirmation',
    subject: 'Payment Verifying: We got your order! ✅',
    content: `<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <div style="background: #030303; padding: 60px 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; text-transform: uppercase;">JOHNSON<span style="color: #BDFF00;">.</span></h1>
        </div>
        <div style="padding: 50px 40px;">
          <h2 style="color: #fff; margin: 0 0 12px; font-size: 1.5rem; font-weight: 700;">Order Received 🙌</h2>
          {{#if sale_event}}<div style="display: inline-block; background: rgba(189, 255, 0, 0.1); color: #BDFF00; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase;">✨ Event: {{sale_event}}</div>{{/if}}
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 16px;">
            Hi {{name}}, we've successfully received your order for <strong style="color: #BDFF00;">{{product_title}}</strong>. 
          </p>
          <div style="padding: 24px; border-radius: 16px; background: rgba(189, 255, 0, 0.03); border: 1px solid rgba(189, 255, 0, 0.1); margin: 30px 0;">
             <p style="margin: 0; color: #BDFF00; font-size: 14px; line-height: 1.6; font-weight: 500;">
                ⏳ Payment Verifying: Once confirmed, you'll receive your download link in a separate email.
             </p>
          </div>
          
          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-top: 30px;">
             <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 13px; line-height: 1.6;">
                <strong>Action Needed:</strong> Please mark this email as <strong>"Not Spam"</strong> right now. This is critical—it ensures that as soon as your order is verified, you receive the notification and download link directly in your inbox instead of missing it.
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
      </div>`
  },
  {
    type: 'file_delivery',
    subject: 'Download Ready: {{product_title}} 🎁',
    content: `<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
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
        </div>
        <div style="padding: 40px; background: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">INSTAGRAM</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">LINKEDIN</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 11px; font-weight: 600;">FACEBOOK</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 10px; letter-spacing: 1px;">&copy; 2026 JOHNSON SAIMON. ALL RIGHTS RESERVED.</p>
        </div>
      </div>`
  },
  {
    type: 'free_download',
    subject: 'Your Resource: {{product_title}} 📦',
    content: `<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
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
      </div>`
  },
  {
    type: 'contact_received',
    subject: 'Message Received: Thanks for reaching out! ✉️',
    content: `<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #030303; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
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
      </div>`
  }
];

async function run() {
    try {
        console.log("Starting master seed...");
        const { data, error } = await supabase
            .from('email_templates')
            .upsert(BRAND_TEMPLATES, { onConflict: 'type' });
        
        if (error) throw error;
        console.log("Success! Templates populated.");
    } catch (e) {
        console.error("Critical Failure:", e.message);
        process.exit(1);
    }
}

run();
