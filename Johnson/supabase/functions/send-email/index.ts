import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Secrets are loaded inside the handler to stay dynamic
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── Fetch Configuration Helpers ───────────────────
async function getConfig(key: string, defaultValue: string): Promise<string> {
  // Check environment first
  const envVal = Deno.env.get(key.toUpperCase());
  if (envVal) return envVal;

  // Fallback to app_config table
  try {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', key.toLowerCase())
      .single();
    return data?.value ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

// ── Placeholder Replacement Helper ────────────────
function replacePlaceholders(template: string, data: Record<string, any>): string {
  let result = template;

  // 1. Handle Handlebars-style #if logic (very basic truthy check)
  // Usage: {{#if key}} content {{/if}}
  result = result.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, key, content) => {
    return data[key] ? content : '';
  });

  // 2. Handle standard placeholders {{key}} or {{ key }} (flexible spaces)
  return result.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    const value = data[key];
    if (value === undefined) return match;
    
    // Auto-encode URLs if they look like links
    const strValue = String(value);
    if (strValue.startsWith('http') && !template.includes(`href="${match}"`)) {
       // If it's used in a context that isn't already an href, we might want to be careful
       // but for simplicity, we provide a clean string.
    }
    return strValue;
  });
}

// ── Plain Text Helper ──────────────────────────
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const EMAIL_LAYOUT = (content: string, title?: string) => `
  <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
    <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 2rem; font-weight: 800; color: #fff; letter-spacing: -1px;">JOHNSON<span style="opacity:0.6">.</span></h1>
      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Freelance Digital Creator</p>
    </div>
    <div style="padding: 40px; line-height: 1.6;">
      ${content}
    </div>
    <div style="padding: 20px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); background-color: rgba(255,255,255,0.02);">
      <p style="font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 20px;">
        Connect with me: 
        <a href="https://www.instagram.com/johnsonsaimon89/" style="color: #fff; text-decoration: underline; margin: 0 10px;">Instagram</a>
        <a href="https://tz.linkedin.com/in/johnsonsaimon89/" style="color: #fff; text-decoration: underline; margin: 0 10px;">LinkedIn</a>
        <a href="https://wa.link/mmk64r" style="color: #fff; text-decoration: underline; margin: 0 10px;">WhatsApp</a>
      </p>
      <div style="font-size: 11px; color: rgba(255,255,255,0.2); line-height: 1.5;">
        <p style="margin: 0 0 10px;">&copy; 2026 JOHNSON SAIMON</p>
        <p style="margin: 0 0 10px;">123 Creative Street, Dar es Salaam, Tanzania</p>
        <p style="margin: 0;">
          You received this because you subscribed to my updates or purchased a product. 
          <br/>
          <a href="{{site_url}}/unsubscribe" style="color: rgba(255,255,255,0.4); text-decoration: underline;">Unsubscribe</a>
        </p>
      </div>
    </div>
  </div>
`;

function welcomeEmail(name: string, siteUrl: string): { subject: string; html: string } {
  return {
    subject: "Welcome to the inner circle! 🚀",
    html: EMAIL_LAYOUT(`
      <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 20px;">Hi ${name} 👋</h2>
      <p style="font-size: 16px; line-height: 1.8; color: rgba(255,255,255,0.7); margin-bottom: 30px;">
        You're officially on the list. I share my best insights on 
        growth strategy and digital design once or twice a month. No fluff, just value.
      </p>
      <div style="text-align: center;">
        <a href="${siteUrl}/resources" style="display: inline-block; background: #22c55e; color: #000; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 700;">Explore Resources</a>
      </div>
    `, "Digital Strategy & Design"),
  };
}

function purchaseConfirmationEmail(name: string, productTitle: string, amountTzs: number, orderId: string, saleEvent?: string): { subject: string; html: string } {
  const saleText = saleEvent ? `<div style="color: #ff6584; font-weight: 700; margin-bottom: 10px;">✨ Special Event: ${saleEvent}</div>` : '';
  return {
    subject: `Order Confirmation: ${productTitle}${saleEvent ? ` (${saleEvent}!)` : ''}`,
    html: EMAIL_LAYOUT(`
      <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 15px;">Order Received 🙌</h2>
      ${saleText}
      <p style="font-size: 16px; color: rgba(255,255,255,0.7);">Hi ${name}, thank you for your purchase of <strong>${productTitle}</strong>.</p>
      <p style="font-size: 14px; color: rgba(255,255,255,0.5);">Payment verification usually takes less than 24 hours. Your download link will be delivered once confirmed.</p>
      <p style="font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 20px;">Order ID: ${orderId}</p>
    `),
  };
}

function fileDeliveryEmail(name: string, productTitle: string, fileUrl: string, orderId: string): { subject: string; html: string } {
  return {
    subject: `Download Ready: ${productTitle}`,
    html: EMAIL_LAYOUT(`
      <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 15px;">Payment Confirmed</h2>
      <p style="font-size: 16px; color: rgba(255,255,255,0.7);">Your files for <strong>${productTitle}</strong> are now available.</p>
      <div style="margin: 35px 0; text-align: center;">
        <a href="${fileUrl}" style="display: inline-block; background: #3b82f6; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700;">Download Now</a>
      </div>
      <p style="font-size: 12px; color: rgba(255,255,255,0.3);">Order ID: ${orderId}</p>
    `),
  };
}

function freeDownloadEmail(name: string, productTitle: string, fileUrl: string, saleEvent?: string): { subject: string; html: string } {
  const saleText = saleEvent ? `<div style="color: #00f2fe; font-weight: 700; margin-bottom: 10px;">✨ ${saleEvent} Special</div>` : '';
  return {
    subject: `Your free resource: ${productTitle}`,
    html: EMAIL_LAYOUT(`
      <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 15px;">Download Ready!</h2>
      ${saleText}
      <p style="font-size: 16px; color: rgba(255,255,255,0.7);">Your free copy of <strong>${productTitle}</strong> is ready for download.</p>
      <div style="margin: 35px 0; text-align: center;">
        <a href="${fileUrl}" style="display: inline-block; background: #3b82f6; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700;">Download Now</a>
      </div>
    `),
  };
}

// ── Main Handler ─────────────────────────────────

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, email, name, product_title, amount_tzs, file_url, order_id, subject, htmlContent } = body;

    // 1. Load Secrets securely on the server
    const resendKey = await getConfig('resend_api_key', Deno.env.get("RESEND_API_KEY") ?? "");
    let fromEmail = await getConfig('from_email', Deno.env.get("FROM_EMAIL") ?? "youreached@johnsonsaimon.com");
    
    // Add display name if not present, to match successful history
    if (!fromEmail.includes("<")) {
      fromEmail = `Johnson <${fromEmail}>`;
    }
    const adminEmail = await getConfig('admin_email', Deno.env.get("ADMIN_EMAIL") ?? "johnsonsaimon111@gmail.com");
    const siteUrl = await getConfig('site_url', Deno.env.get("SITE_URL") ?? "https://johnsonsaimon.com");

    console.info(`Email Request: type=${type}, to=${email || body.customer_email}, from=${fromEmail}`);

    if (!resendKey) {
      throw new Error("RESEND_API_KEY is missing (checked env and app_config).");
    }

    let emailContent: { subject: string; html: string };
    let toAddresses = email;

    // 2. Fetch from Database Template first
    const { data: templateData } = await supabase
      .from('email_templates')
      .select('subject, content')
      .eq('type', type)
      .single();

    if (templateData) {
      // 2.5 Sanitize and Harden Links
      let sanitizedFileUrl = file_url ?? "";
      if (sanitizedFileUrl && typeof sanitizedFileUrl === 'string') {
        // Ensure no spaces (common in filenames) break the URL
        sanitizedFileUrl = sanitizedFileUrl.trim().replace(/\s/g, '%20');
      }

      const placeholderData = {
        name: name ?? "Friend",
        product_title: product_title ?? "Digital Product",
        amount_tzs: amount_tzs ?? "0",
        order_id: order_id ?? "",
        file_url: sanitizedFileUrl,
        site_url: siteUrl,
        customer_email: body.customer_email ?? email ?? "",
        sender_message: body.sender_message ?? "",
        subject: subject ?? "",
        sale_event: body.sale_event ?? "",
        sale_label: body.sale_label ?? ""
      };

      emailContent = {
        subject: replacePlaceholders(templateData.subject, placeholderData),
        html: replacePlaceholders(templateData.content, placeholderData)
      };
    } else {
      // Fallback to hardcoded templates
      switch (type) {
        case "welcome":
          emailContent = welcomeEmail(name ?? "Friend", siteUrl);
          break;
        case "purchase_confirmation":
          emailContent = purchaseConfirmationEmail(name, product_title, amount_tzs, order_id, body.sale_event);
          break;
        case "file_delivery":
          emailContent = fileDeliveryEmail(name, product_title, file_url, order_id);
          break;
        case "free_download":
          emailContent = freeDownloadEmail(name ?? "Friend", product_title, file_url, body.sale_event);
          break;
        case "admin_order_notification":
          emailContent = {
            subject: `New Paid Order: ${product_title} from ${name}`,
            html: EMAIL_LAYOUT(`
              <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 15px;">New Order Received!</h2>
              <p style="font-size: 16px; color: rgba(255,255,255,0.7);">You have a new paid order for <strong>${product_title}</strong>.</p>
              <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); margin: 25px 0;">
                <p style="margin: 0 0 10px; font-size: 14px;"><strong>Customer:</strong> ${name}</p>
                <p style="margin: 0 0 10px; font-size: 14px;"><strong>Email:</strong> ${body.customer_email ?? email}</p>
                <p style="margin: 0; font-size: 14px;"><strong>Amount:</strong> ${amount_tzs} TZS</p>
              </div>
              <p style="font-size: 14px; color: rgba(255,255,255,0.4);">Order ID: ${order_id}</p>
            `, "Admin Notification")
          };
          break;
        case "contact_received":
          emailContent = {
            subject: `Thanks for reaching out, ${name}`,
            html: `<p>Hey ${name}, thanks for getting in touch regarding <b>${subject}</b>. I'll get back to you soon.</p>`
          };
          break;
        case "admin_contact_notification":
          emailContent = {
            subject: `New Message: ${subject} from ${name}`,
            html: EMAIL_LAYOUT(`
              <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 15px;">New Contact Message</h2>
              <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); margin: 25px 0;">
                <p style="margin: 0 0 10px; font-size: 14px;"><strong>From:</strong> ${name} (${body.customer_email ?? email})</p>
                <p style="margin: 0 0 10px; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 0; font-size: 14px;"><strong>Message:</strong></p>
                <p style="margin: 10px 0 0; font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.6; white-space: pre-wrap;">${body.sender_message || body.message}</p>
              </div>
            `, "Inquiry Received")
          };
          break;
        case "newsletter_broadcast":
          if (!subject || !htmlContent || !email) {
            return new Response(JSON.stringify({ error: "Missing payload" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
          emailContent = { subject, html: htmlContent };
          break;
        default:
          return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // 3. Auto-route admin notifications to the admin email
    const targetEmail = (type && type.startsWith("admin_")) ? adminEmail : toAddresses;

    const isBatch = Array.isArray(targetEmail);
    const endpoint = "https://api.resend.com/emails" + (isBatch ? "/batch" : "");

    let bodyPayload;
    // Improve text fallback: if it's a file delivery/download, ensure the link is prominent in text
    let textContent = stripHtml(emailContent.html);
    if (body.file_url) {
      textContent += `\n\nYour Download Link:\n${body.file_url}\n\n(Copy and paste this into your browser if the button doesn't work)`;
    }

    if (isBatch) {
      bodyPayload = (targetEmail as string[]).map((e) => ({
        from: fromEmail,
        to: e,
        reply_to: fromEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: textContent
      }));
    } else {
      bodyPayload = {
        from: fromEmail,
        to: targetEmail,
        reply_to: fromEmail, // Help users reply directly
        subject: emailContent.subject,
        html: emailContent.html,
        text: textContent
      };
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (!res.ok) {
      console.error("[send-email] Resend error:", data);
      return new Response(JSON.stringify({ success: false, error: data, note: "If Resend error is 403, verify your custom domain in Resend!" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("[send-email] Unexpected error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
