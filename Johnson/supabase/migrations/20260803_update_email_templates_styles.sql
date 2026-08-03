-- =============================================
-- Migration: Re-theme and re-write email templates
-- Date: 2026-08-03
-- =============================================

-- Clean, human copy with a modern, light aesthetic (White/Slate/Terracotta).

UPDATE email_templates SET 
subject = 'Welcome to the Community', 
content = '<div style="font-family: ''Inter'', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0;">
    <div style="background: #F8FAFC; padding: 48px 40px; text-align: center; border-bottom: 1px solid #E2E8F0;">
        <h1 style="margin: 0; font-size: 2rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700; letter-spacing: -1px; color: #0F172A;">JOHNSON<span style="color: #E05A3D;">.</span></h1>
        <p style="margin: 8px 0 0; color: #475569; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Communication Strategist & Digital Designer</p>
    </div>
    <div style="padding: 48px 40px;">
        <h2 style="color: #0F172A; margin: 0 0 24px; font-size: 1.5rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700;">Welcome to the Community</h2>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            Hi <strong>{{name}}</strong>,
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            Thanks for joining. I''m glad you''re here.
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            This is where I''ll share practical insights on communication strategy, web design, digital storytelling, and building digital experiences that connect with people.
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 32px;">
            Whether you''re growing a business, leading an organization, or simply curious about better communication, I hope you''ll find something useful here.
        </p>
        <div style="margin: 32px 0;">
            <a href="{{site_url}}/resources" style="display: inline-block; background: #E05A3D; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Explore the Resources
            </a>
        </div>
    </div>
    <div style="padding: 32px 40px; background: #F8FAFC; text-align: center; border-top: 1px solid #E2E8F0;">
        <div style="margin-bottom: 16px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">Instagram</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">LinkedIn</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">Facebook</a>
        </div>
        <p style="margin: 0; color: #94A3B8; font-size: 11px;">&copy; 2026 Johnson Saimon. All rights reserved.</p>
    </div>
</div>'
WHERE type = 'welcome';

UPDATE email_templates SET 
subject = 'Order Received', 
content = '<div style="font-family: ''Inter'', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0;">
    <div style="background: #F8FAFC; padding: 48px 40px; text-align: center; border-bottom: 1px solid #E2E8F0;">
        <h1 style="margin: 0; font-size: 2rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700; letter-spacing: -1px; color: #0F172A;">JOHNSON<span style="color: #E05A3D;">.</span></h1>
    </div>
    <div style="padding: 48px 40px;">
        <h2 style="color: #0F172A; margin: 0 0 16px; font-size: 1.5rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700;">Order Received</h2>
        
        {{#if sale_event}}
        <div style="display: inline-block; background: rgba(224, 90, 61, 0.1); color: #E05A3D; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; margin-bottom: 24px;">
            Limited Launch Offer
        </div>
        {{/if}}

        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            Hi <strong>{{name}}</strong>,
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            Thank you for your purchase of <strong>{{product_title}}</strong>.
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 24px;">
            Your payment is currently being verified. As soon as it''s confirmed, I''ll send another email with your download link.
        </p>
        
        <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 32px 0;">
            <p style="margin: 0; color: #0F172A; font-size: 15px; line-height: 1.6;">
                <strong>One quick favor:</strong><br>
                Please mark this email as <strong>"Not Spam"</strong> or move it to your Primary inbox. That way, your download link won''t get lost.
            </p>
        </div>

        <p style="color: #475569; line-height: 1.6; font-size: 16px;">
            Thank you for your support.
        </p>
    </div>
    <div style="padding: 32px 40px; background: #F8FAFC; text-align: center; border-top: 1px solid #E2E8F0;">
        <div style="margin-bottom: 16px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">Instagram</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">LinkedIn</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">Facebook</a>
        </div>
        <p style="margin: 0; color: #94A3B8; font-size: 11px;">&copy; 2026 Johnson Saimon. All rights reserved.</p>
    </div>
</div>'
WHERE type = 'purchase_confirmation';

UPDATE email_templates SET 
subject = 'Your Resource Is Ready', 
content = '<div style="font-family: ''Inter'', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0;">
    <div style="background: #F8FAFC; padding: 48px 40px; text-align: center; border-bottom: 1px solid #E2E8F0;">
        <h1 style="margin: 0; font-size: 2rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700; letter-spacing: -1px; color: #0F172A;">JOHNSON<span style="color: #E05A3D;">.</span></h1>
    </div>
    <div style="padding: 48px 40px;">
        <h2 style="color: #0F172A; margin: 0 0 24px; font-size: 1.5rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700;">Your Resource Is Ready</h2>
        
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            Hi <strong>{{name}}</strong>,
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            Great news! Your resource is ready.
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 24px;">
            Click the button below to download <strong>{{product_title}}</strong>.
        </p>
        
        <div style="margin: 32px 0;">
            <a href="{{file_url}}" style="display: inline-block; background: #E05A3D; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Download Resource
            </a>
        </div>

        <p style="color: #475569; line-height: 1.6; font-size: 16px;">
            I hope it helps you build, create, and communicate with more confidence.
        </p>
    </div>
    <div style="padding: 32px 40px; background: #F8FAFC; text-align: center; border-top: 1px solid #E2E8F0;">
        <div style="margin-bottom: 16px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">Instagram</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">LinkedIn</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">Facebook</a>
        </div>
        <p style="margin: 0; color: #94A3B8; font-size: 11px;">&copy; 2026 Johnson Saimon. All rights reserved.</p>
    </div>
</div>'
WHERE type = 'file_delivery';

UPDATE email_templates SET 
subject = 'Your Download Is Ready', 
content = '<div style="font-family: ''Inter'', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0;">
    <div style="background: #F8FAFC; padding: 48px 40px; text-align: center; border-bottom: 1px solid #E2E8F0;">
        <h1 style="margin: 0; font-size: 2rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700; letter-spacing: -1px; color: #0F172A;">JOHNSON<span style="color: #E05A3D;">.</span></h1>
    </div>
    <div style="padding: 48px 40px;">
        <h2 style="color: #0F172A; margin: 0 0 16px; font-size: 1.5rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700;">Your Download Is Ready</h2>
        
        {{#if sale_event}}
        <div style="display: inline-block; background: rgba(224, 90, 61, 0.1); color: #E05A3D; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; margin-bottom: 24px;">
            Thanks for joining the Limited Launch Offer.
        </div>
        {{/if}}

        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            Hi <strong>{{name}}</strong>,
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            Your copy of <strong>{{product_title}}</strong> is ready.
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 24px;">
            Click below whenever you''re ready to get started.
        </p>
        
        <div style="margin: 32px 0;">
            <a href="{{file_url}}" style="display: inline-block; background: #E05A3D; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Download Resource
            </a>
        </div>

        <p style="color: #475569; line-height: 1.6; font-size: 16px;">
            Enjoy, and thank you for supporting my work.
        </p>
    </div>
    <div style="padding: 32px 40px; background: #F8FAFC; text-align: center; border-top: 1px solid #E2E8F0;">
        <div style="margin-bottom: 16px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">Instagram</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">LinkedIn</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">Facebook</a>
        </div>
        <p style="margin: 0; color: #94A3B8; font-size: 11px;">&copy; 2026 Johnson Saimon. All rights reserved.</p>
    </div>
</div>'
WHERE type = 'free_download';


UPDATE email_templates SET 
subject = 'New Order Received', 
content = '<div style="font-family: ''Inter'', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0;">
    <div style="background: #F8FAFC; padding: 48px 40px; text-align: center; border-bottom: 1px solid #E2E8F0;">
        <h1 style="margin: 0; font-size: 2rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700; letter-spacing: -1px; color: #0F172A;">JOHNSON<span style="color: #E05A3D;">.</span></h1>
    </div>
    <div style="padding: 48px 40px;">
        <h2 style="color: #0F172A; margin: 0 0 16px; font-size: 1.5rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700;">New Order Received</h2>
        
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 32px;">
            A new order has been placed.
        </p>
        
        <h3 style="color: #0F172A; font-size: 1.1rem; font-weight: 600; margin-bottom: 16px;">Order Details</h3>
        
        <div style="background: #F8FAFC; padding: 24px; border-radius: 8px; border: 1px solid #E2E8F0; margin-bottom: 32px;">
            <p style="margin: 0 0 12px; color: #0F172A; font-size: 15px;">
                <strong>Product</strong><br>
                <span style="color: #475569;">{{product_title}}</span>
            </p>
            <p style="margin: 0 0 12px; color: #0F172A; font-size: 15px;">
                <strong>Amount</strong><br>
                <span style="color: #475569;">{{amount_tzs}}</span>
            </p>
            <p style="margin: 0 0 12px; color: #0F172A; font-size: 15px;">
                <strong>Customer</strong><br>
                <span style="color: #475569;">{{name}} ({{customer_email}})</span>
            </p>
            <p style="margin: 0; color: #0F172A; font-size: 15px;">
                <strong>Order ID</strong><br>
                <span style="color: #475569;">{{order_id}}</span>
            </p>
        </div>

        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 24px;">
            Review and verify the payment to complete the order.
        </p>

        <div style="margin: 32px 0;">
            <a href="{{site_url}}/admin" style="display: inline-block; background: #E05A3D; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Manage Orders
            </a>
        </div>
    </div>
    <div style="padding: 32px 40px; background: #F8FAFC; text-align: center; border-top: 1px solid #E2E8F0;">
        <p style="margin: 0; color: #94A3B8; font-size: 11px;">&copy; 2026 Johnson. All rights reserved.</p>
    </div>
</div>'
WHERE type = 'admin_order_notification';


UPDATE email_templates SET 
subject = 'Message Received', 
content = '<div style="font-family: ''Inter'', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0;">
    <div style="background: #F8FAFC; padding: 48px 40px; text-align: center; border-bottom: 1px solid #E2E8F0;">
        <h1 style="margin: 0; font-size: 2rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700; letter-spacing: -1px; color: #0F172A;">JOHNSON<span style="color: #E05A3D;">.</span></h1>
    </div>
    <div style="padding: 48px 40px;">
        <h2 style="color: #0F172A; margin: 0 0 24px; font-size: 1.5rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700;">Message Received</h2>
        
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            Hi <strong>{{name}}</strong>,
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            Thanks for reaching out.
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            I''ve received your message about <strong>"{{subject}}"</strong> and will review it as soon as possible.
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 32px;">
            I''ll get back to you shortly.
        </p>
        
        <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0; margin-bottom: 32px;">
            <p style="margin: 0; color: #0F172A; font-size: 15px; line-height: 1.6;">
                In the meantime, please mark this email as <strong>"Not Spam"</strong> or move it to your Primary inbox so you don''t miss my reply.
            </p>
        </div>

        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 24px;">
            Thanks again, and I look forward to speaking with you.
        </p>
        
        <div style="margin: 32px 0;">
            <a href="{{site_url}}" style="display: inline-block; background: #E05A3D; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Return to Website
            </a>
        </div>
    </div>
    <div style="padding: 32px 40px; background: #F8FAFC; text-align: center; border-top: 1px solid #E2E8F0;">
        <div style="margin-bottom: 16px;">
            <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">Instagram</a>
            <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">LinkedIn</a>
            <a href="https://www.facebook.com/johnson.saimon.75/" style="color: #475569; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: 500;">Facebook</a>
        </div>
        <p style="margin: 0; color: #94A3B8; font-size: 11px;">&copy; 2026 Johnson. All rights reserved.</p>
    </div>
</div>'
WHERE type = 'contact_received';


UPDATE email_templates SET 
subject = 'New Contact Inquiry', 
content = '<div style="font-family: ''Inter'', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0;">
    <div style="background: #F8FAFC; padding: 48px 40px; text-align: center; border-bottom: 1px solid #E2E8F0;">
        <h1 style="margin: 0; font-size: 2rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700; letter-spacing: -1px; color: #0F172A;">JOHNSON<span style="color: #E05A3D;">.</span></h1>
    </div>
    <div style="padding: 48px 40px;">
        <h2 style="color: #0F172A; margin: 0 0 32px; font-size: 1.5rem; font-family: ''Space Grotesk'', sans-serif; font-weight: 700;">New Contact Inquiry</h2>
        
        <h3 style="color: #0F172A; font-size: 1.1rem; font-weight: 600; margin-bottom: 16px;">Contact Details</h3>
        
        <div style="background: #F8FAFC; padding: 24px; border-radius: 8px; border: 1px solid #E2E8F0; margin-bottom: 32px;">
            <p style="margin: 0 0 12px; color: #0F172A; font-size: 15px;">
                <strong>Name</strong><br>
                <span style="color: #475569;">{{name}}</span>
            </p>
            <p style="margin: 0 0 12px; color: #0F172A; font-size: 15px;">
                <strong>Email</strong><br>
                <span style="color: #475569;">{{customer_email}}</span>
            </p>
            <p style="margin: 0 0 12px; color: #0F172A; font-size: 15px;">
                <strong>Subject</strong><br>
                <span style="color: #475569;">{{subject}}</span>
            </p>
            <p style="margin: 0; color: #0F172A; font-size: 15px;">
                <strong>Message</strong><br>
                <span style="color: #475569; white-space: pre-wrap;">{{sender_message}}</span>
            </p>
        </div>

        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;">
            A new inquiry has been submitted through your website.
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 24px;">
            Respond when you''re ready.
        </p>

        <div style="margin: 32px 0;">
            <a href="{{site_url}}/admin" style="display: inline-block; background: #E05A3D; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                View Inquiry
            </a>
        </div>
    </div>
    <div style="padding: 32px 40px; background: #F8FAFC; text-align: center; border-top: 1px solid #E2E8F0;">
        <p style="margin: 0; color: #94A3B8; font-size: 11px;">&copy; 2026 Johnson. All rights reserved.</p>
    </div>
</div>'
WHERE type = 'admin_contact_notification';
