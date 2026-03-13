import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

import { portfolioData } from '../src/data/portfolioData.js';
import { webData } from '../src/data/webData.js';
import { smData } from '../src/data/socialMediaData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Very simple .env parser
function loadEnv() {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            if (line && line.includes('=')) {
                const [key, ...values] = line.split('=');
                process.env[key.trim()] = values.join('=').trim().replace(/^['"]|['"]$/g, '');
            }
        });
    }
}

async function seed() {
    loadEnv();

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase credentials in .env");
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Authenticating as Admin...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'johnsonsaimon111@gmail.com',
        password: '@Antipoverty2030'
    });

    if (authError) {
        console.error("Auth Error:", authError.message);
        return;
    }
    console.log("Authenticated successfully!");

    console.log("Clearing old data...");
    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('performances').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log("Seeding Projects...");
    // 1. Portfolio Projects
    const portfolioProjects = portfolioData.projects.map((p, i) => ({
        title: p.title,
        category: p.category,
        image_url: p.image || null,
        size: p.size || 'small',
        link: p.url || null,
        tags: [],
        client_name: p.client || null,
        challenge: p.challenge || null,
        solution: p.solution || null,
        results: p.results || null,
        is_upcoming: p.upcoming || false,
        display_order: i
    }));

    // 2. Web Data Projects
    const webProjects = webData.projects.map((p, i) => ({
        title: p.client,
        category: 'Web Design',
        image_url: null,
        size: 'small',
        link: null,
        tags: p.tools || [],
        client_name: p.client || null,
        challenge: p.challenge || null,
        solution: p.strategy || null,
        results: p.results || null,
        is_upcoming: false,
        display_order: portfolioProjects.length + i
    }));

    const allProjects = [...portfolioProjects, ...webProjects];

    for (const project of allProjects) {
        const { error } = await supabase.from('projects').insert(project);
        if (error) {
            console.error(`Error inserting project ${project.title}:`, error.message);
        } else {
            console.log(`Inserted project: ${project.title}`);
        }
    }

    console.log("Seeding Performances...");

    // 1. Profile Stats
    const profileStats = portfolioData.about.stats.map((s, i) => ({
        metric_name: s.label,
        metric_value: s.value,
        category: 'general',
        trend: '',
        display_order: i
    }));

    // 2. Social Media Stats
    const socialStats = smData.analytics.metrics.map((s, i) => ({
        metric_name: s.label,
        metric_value: s.value + (s.suffix || ''),
        category: 'social',
        trend: '',
        display_order: profileStats.length + i
    }));

    const allStats = [...profileStats, ...socialStats];

    for (const stat of allStats) {
        const { error } = await supabase.from('performances').insert(stat);
        if (error) {
            console.error(`Error inserting stat ${stat.metric_name}:`, error.message);
        } else {
            console.log(`Inserted stat: ${stat.metric_value} ${stat.metric_name}`);
        }
    }

    console.log("Seeding Products...");

    // Dynamically safely import the productsData
    const { productsData } = await import('../src/data/productsData.js');

    // Format Free & Paid Products
    const allProducts = [];
    if (productsData) {
        if (productsData.paid) {
            productsData.paid.forEach((p, i) => {
                allProducts.push({
                    title: p.title,
                    description: p.description,
                    price_tzs: p.priceTZS,
                    type: p.type || 'Digital Download',
                    is_active: true,
                    display_order: i
                });
            });
        }
        if (productsData.free) {
            productsData.free.forEach((p, i) => {
                allProducts.push({
                    title: p.title,
                    description: p.description,
                    price_tzs: p.priceTZS,
                    type: p.type || 'Digital Download',
                    is_active: true,
                    display_order: 10 + i
                });
            });
        }
    }

    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const product of allProducts) {
        const { error } = await supabase.from('products').insert(product);
        if (error) {
            console.error(`Error inserting product ${product.title}:`, error.message);
        } else {
            console.log(`Inserted product: ${product.title}`);
        }
    }

    console.log("Seeding Testimonials...");

    const allTestimonials = [];

    // Add Web Design Testimonials
    if (webData && webData.testimonials) {
        webData.testimonials.forEach((t, i) => {
            allTestimonials.push({
                quote: t.quote,
                author: t.author,
                role: 'Client',
                company: t.company || '',
                category: 'web_design'
            });
        });
    }

    // Add Social Media Testimonials
    if (smData && smData.testimonials) {
        smData.testimonials.forEach((t, i) => {
            allTestimonials.push({
                quote: t.quote,
                author: t.author,
                role: 'Client',
                company: '',
                category: 'social_media'
            });
        });
    }

    await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const testimonial of allTestimonials) {
        const { error } = await supabase.from('testimonials').insert(testimonial);
        if (error) {
            console.error(`Error inserting testimonial ${testimonial.author}:`, error.message);
        } else {
            console.log(`Inserted testimonial from: ${testimonial.author}`);
        }
    }


    console.log("Seeding completed successfully!");
}

seed();
