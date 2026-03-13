import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
    envFile.split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=').map(part => part.trim()))
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkSchema() {
    const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching schema:', error);
    } else {
        console.log('Columns in case_studies:', Object.keys(data[0] || {}));
    }
}

checkSchema();
