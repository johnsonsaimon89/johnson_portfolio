import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
    envFile.split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=').map(part => part.trim()))
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function addUrls() {
    const urls = {
        'EduLearn': 'https://www.coursera.org', 
        'VisualCulture': 'https://www.behance.net',
        'GreenFields': 'https://www.nature.org',
        'SwiftPay': 'https://stripe.com'
    };

    const { data: studies } = await supabase.from('case_studies').select('*').eq('type', 'web');

    for (const study of studies) {
        const url = urls[study.organization_name];
        if (url) {
            const updatedContent = { ...study.content, website_url: url };
            await supabase.from('case_studies').update({ content: updatedContent }).eq('id', study.id);
            console.log(`Updated ${study.organization_name} with URL: ${url}`);
        }
    }
}

addUrls();
