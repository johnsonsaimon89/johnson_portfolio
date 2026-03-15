const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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
  const { data, error } = await supabase.from('app_config').select('*').eq('key', 'app_service_role_key').single();
  if (error) {
    console.error("Error fetching config:", error.message);
  } else {
    console.log("Config Found:", data.value);
  }
}

check();
