import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env
const env = fs.readFileSync('.env', 'utf8');
const config = Object.fromEntries(
  env.split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const [k, ...v] = l.split('=');
      return [k.trim(), v.join('=').trim().replace(/^["']|["']$/g, '')];
    })
);

const supabase = createClient(config.VITE_SUPABASE_URL, config.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('email_templates').select('type, subject');
  if (error) {
    console.error("Error fetching templates:", error);
  } else {
    console.log("Found templates:", JSON.stringify(data, null, 2));
  }
}

check();
