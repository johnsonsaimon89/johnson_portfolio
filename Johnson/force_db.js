import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/['"]/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
async function run() {
    console.log("Upserting settings...");
    const { data, error } = await supabase
        .from('site_settings')
        .upsert({
            id: 1,
            theme_color_primary: '#BDFF00',
            theme_color_secondary: '#030303',
            typography_heading: 'Outfit',
            typography_body: 'Inter'
        }, { onConflict: 'id' });

    console.log("Upsert result:", data, error);

    const { data: checkData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    console.log("DB NOW HAS:", checkData.theme_color_secondary);
}
run();
