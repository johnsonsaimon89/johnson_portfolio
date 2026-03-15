import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const config = Object.fromEntries(
  env.split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const [k, ...v] = l.split('=');
      const val = v.join('=').trim().replace(/^["']|["']$/g, '');
      return [k.trim(), val];
    })
);

const supabase = createClient(config.VITE_SUPABASE_URL, config.VITE_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('app_config').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Config keys:", data.map(d => d.key));
        const serviceKey = data.find(d => d.key === 'app_service_role_key');
        if (serviceKey) {
            console.log("SERVICE_ROLE_KEY_FOUND:", serviceKey.value);
        } else {
            console.log("Service key not found in app_config");
        }
    }
}
check();
