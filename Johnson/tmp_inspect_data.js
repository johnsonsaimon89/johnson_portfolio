import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
    envFile.split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=').map(part => part.trim()))
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function inspectData() {
    const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('type', 'web');

    if (error) {
        console.error('Error fetching data:', error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

inspectData();
