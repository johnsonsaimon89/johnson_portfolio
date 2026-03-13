import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_REAL_URL';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_REAL_KEY';

// In case dotenv is not installed or available, we'll try to use the ones from vite if we use a different approach.
// But better yet, let's just use the direct URL from the client if we know it (or fetch it from `.env` using Node's fs).
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            process.env[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
        }
    });
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log("Updating settings...");
    const { data, error } = await supabase
        .from('site_settings')
        .update({
            theme_color_primary: '#BDFF00',
            theme_color_secondary: '#030303'
        })
        .eq('id', 1);

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Success! Colors reverted.");
    }
}
run();
