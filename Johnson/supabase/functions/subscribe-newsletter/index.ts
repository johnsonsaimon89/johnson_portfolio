import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getConfig(key: string, defaultValue: string): Promise<string> {
    const envVal = Deno.env.get(key.toUpperCase());
    if (envVal) return envVal;
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

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { email, name, source = 'website' } = await req.json();
        if (!email) {
            throw new Error("Email is required");
        }

        // 1. Save to local Supabase database for backup
        const { error: dbError } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email, name, source }]);
        
        // Ignore unique constraint errors in the DB (they are already subscribed locally)
        if (dbError && dbError.code !== '23505') {
            console.error("Local DB Error:", dbError);
        }

        // 2. Fetch Resend Config
        const resendApiKey = await getConfig("resend_api_key", "");
        const resendAudienceId = await getConfig("resend_audience_id", "");

        if (!resendApiKey || !resendAudienceId) {
            console.warn("Resend configuration missing. Saved locally but skipped Resend sync.");
            return new Response(JSON.stringify({ success: true, message: "Subscribed locally" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200
            });
        }

        // 3. Sync with Resend Audiences
        const resendReq = await fetch(`https://api.resend.com/audiences/${resendAudienceId}/contacts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                first_name: name || undefined,
                unsubscribed: false
            })
        });

        const resendRes = await resendReq.json();
        
        if (!resendReq.ok) {
            console.error("Resend API Error:", resendRes);
            throw new Error(resendRes.message || "Failed to add to Resend");
        }

        return new Response(JSON.stringify({ success: true, id: resendRes.id }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
