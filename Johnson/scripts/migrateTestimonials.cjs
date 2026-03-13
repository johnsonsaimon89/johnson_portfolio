const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const socialTestimonials = [
    { quote: "I saw my engagement quadruple in 3 months. The strategy was flawless.", author: "CMO, Tech Startup", category: "social_media", display_order: 1 },
    { quote: "Finally, someone who understands how to tell a story on TikTok.", author: "Founder, D2C Brand", category: "social_media", display_order: 2 }
];

const webTestimonials = [
    {
        quote: "The mobile-first redesign transformed how our students interact with the platform. Engagement is at an all-time high.",
        author: "Director, EduLearn",
        company: "EduLearn",
        role: "Director",
        category: "web_design",
        display_order: 3
    },
    {
        quote: "Our new portfolio finally feels as premium as our creative work. The interaction design is exactly what we needed.",
        author: "Founder, VisualCulture",
        company: "VisualCulture",
        role: "Founder",
        category: "web_design",
        display_order: 4
    },
    {
        quote: "Simplifying our complex site allowed us to clearly communicate our mission. We've seen a massive jump in donor inquiries.",
        author: "Lead, GreenFields",
        company: "GreenFields",
        role: "Lead",
        category: "web_design",
        display_order: 5
    }
];

const allTestimonials = [...socialTestimonials, ...webTestimonials];

async function seed() {
    console.log('Starting testimonial migration...');

    for (const t of allTestimonials) {
        const { data, error } = await supabase
            .from('testimonials')
            .upsert([t], { onConflict: 'quote' }) 
            .select();

        if (error) {
            console.error(`Error inserting testimonial from ${t.author}:`, error.message);
        } else {
            console.log(`Successfully migrated testimonial from ${t.author}`);
        }
    }

    console.log('Migration complete!');
}

seed();
