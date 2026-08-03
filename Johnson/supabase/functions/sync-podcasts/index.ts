import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RSS_URL = "https://feeds.acast.com/public/shows/65b757fac88e880016ff9a1a";

// Initialize Supabase Client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
    try {
        const res = await fetch(RSS_URL);
        if (!res.ok) {
            throw new Error(`Failed to fetch RSS feed: ${res.statusText}`);
        }
        
        const xmlText = await res.text();
        
        // Simple regex parsing for the RSS items
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const items = [];
        let match;
        
        while ((match = itemRegex.exec(xmlText)) !== null) {
            items.push(match[1]);
        }
        
        const episodes = items.map((itemXml) => {
            const getTagValue = (tag) => {
                // handles <tag>value</tag> or <namespace:tag>value</namespace:tag>
                const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
                const m = itemXml.match(regex);
                return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : null;
            };

            const id = getTagValue("guid") || getTagValue("acast:episodeId") || crypto.randomUUID();
            const title = getTagValue("title") || "Untitled Episode";
            const pubDateStr = getTagValue("pubDate");
            const episodeStr = getTagValue("itunes:episode");
            
            return {
                id: id,
                title: title,
                episode_number: episodeStr ? parseInt(episodeStr, 10) : null,
                published_at: pubDateStr ? new Date(pubDateStr).toISOString() : new Date().toISOString()
            };
        });

        // Optional: limit to the most recent 10 if you don't want to sync all history at once
        const recentEpisodes = episodes.slice(0, 10);

        // Upsert into Supabase DB
        for (const ep of recentEpisodes) {
            await supabase.from("podcasts").upsert({
                id: ep.id,
                title: ep.title,
                episode_number: ep.episode_number,
                published_at: ep.published_at
            }, { onConflict: 'id' });
        }

        return new Response(JSON.stringify({ success: true, count: recentEpisodes.length, episodes: recentEpisodes }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
});
