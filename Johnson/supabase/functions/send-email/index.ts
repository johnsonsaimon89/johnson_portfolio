// ================================================
// Supabase Edge Function: send-email
// ================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Johnson <onboarding@resend.dev>";
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://johnsonsaimon.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── Email Templates ──────────────────────────────

function welcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: "Welcome to Johnson's inner circle 🎉",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: -1px;">JOHNSON<span style="color: rgba(255,255,255,0.6)">.</span></h1>
          <p style="margin: 8px 0 0; opacity: 0.8;">Freelance Digital Creator</p>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #fff; margin: 0 0 16px;">Hey ${name} 👋</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.7;">
            You're officially on Johnson's list — where creatives, entrepreneurs, and brands get the best tips on 
            social media strategy, web design, and digital storytelling.
          </p>
          <div style="text-align: center; margin-top: 32px;">
            <a href="${SITE_URL}/resources" style="display: inline-block; background: linear-gradient(135deg, #6c63ff, #ff6584); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 100px; font-weight: 700; letter-spacing: 0.5px;">
              Browse Free Resources
            </a>
          </div>
        </div>
      </div>
    `,
  };
}

function purchaseConfirmationEmail(name: string, productTitle: string, amountTzs: number, orderId: string): { subject: string; html: string } {
  return {
    subject: `Order received: ${productTitle} ✅`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 2rem; font-weight: 800;">JOHNSON<span style="opacity:0.6">.</span></h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #fff; margin: 0 0 8px;">Hi ${name}, we got your order! 🙌</h2>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.7;">
            Your purchase of <strong style="color: #fff;">${productTitle}</strong> has been received.
          </p>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0; font-family: monospace; font-size: 14px; color: #a78bfa;">Reference: ${orderId}</p>
          </div>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.7;">
            ⏳ We're verifying your payment. Once confirmed, you'll receive a second email with your download link.
          </p>
        </div>
      </div>
    `,
  };
}

function fileDeliveryEmail(name: string, productTitle: string, fileUrl: string, orderId: string): { subject: string; html: string } {
  return {
    subject: `Your file is ready: ${productTitle} 🎁`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 2rem; font-weight: 800;">JOHNSON<span style="opacity:0.6">.</span></h1>
        </div>
        <div style="padding: 40px; text-align: center;">
          <h2 style="color: #fff; margin: 0 0 16px;">Payment confirmed! Here's your file.</h2>
          <div style="margin: 32px 0;">
            <a href="${fileUrl}" style="display: inline-block; background: linear-gradient(135deg, #6c63ff, #ff6584); color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 100px; font-weight: 700;">
              ⬇️ Download Your File
            </a>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 12px; text-align: left;">
            🔗 Or copy this link: <a href="${fileUrl}" style="color: #a78bfa; word-break: break-all;">${fileUrl}</a>
          </p>
        </div>
      </div>
    `,
  };
}

function freeDownloadEmail(name: string, productTitle: string, fileUrl: string): { subject: string; html: string } {
  return {
    subject: `Your free resource: ${productTitle} 📦`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #00f2fe, #4facfe); padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 2rem; font-weight: 800; color: #0a0a0a;">JOHNSON<span style="opacity:0.5">.</span></h1>
        </div>
        <div style="padding: 40px; text-align: center;">
          <h2 style="color: #fff; margin: 0 0 16px;">Your free resource is ready!</h2>
          <div style="margin: 32px 0;">
            <a href="${fileUrl}" style="display: inline-block; background: linear-gradient(135deg, #00f2fe, #4facfe); color: #0a0a0a; text-decoration: none; padding: 16px 40px; border-radius: 100px; font-weight: 700;">
              ⬇️ Download Now
            </a>
          </div>
        </div>
      </div>
    `,
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

    let emailContent: { subject: string; html: string };
    let toAddresses = email;

    switch (type) {
      case "welcome":
        emailContent = welcomeEmail(name ?? "Friend");
        break;
      case "purchase_confirmation":
        emailContent = purchaseConfirmationEmail(name, product_title, amount_tzs, order_id);
        break;
      case "file_delivery":
        emailContent = fileDeliveryEmail(name, product_title, file_url, order_id);
        break;
      case "free_download":
        emailContent = freeDownloadEmail(name ?? "Friend", product_title, file_url);
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

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing from environment.");
    }

    const isBatch = Array.isArray(toAddresses);
    const endpoint = isBatch ? "https://api.resend.com/emails/batch" : "https://api.resend.com/emails";

    let bodyPayload;
    if (isBatch) {
      bodyPayload = (toAddresses as string[]).map((e) => ({
        from: FROM_EMAIL,
        to: e,
        subject: emailContent.subject,
        html: emailContent.html
      }));
    } else {
      bodyPayload = {
        from: FROM_EMAIL,
        to: toAddresses,
        subject: emailContent.subject,
        html: emailContent.html
      };
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
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
