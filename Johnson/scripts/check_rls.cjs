const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    console.log('--- Table: testimonials ---');
    const { data: cols, error: colErr } = await supabase.rpc('get_table_columns', { table_name: 'testimonials' }); 
    // If RPC doesn't exist, we'll just try a select
    const { data, error } = await supabase.from('testimonials').select('*').limit(1);
    
    if (error) {
        console.error('Error fetching testimonials:', error.message);
    } else {
        console.log('Sample data:', data);
    }

    // Try a test delete (safe if no ID 0 exists, or just check error)
    const { error: delErr } = await supabase.from('testimonials').delete().eq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Delete attempt error (if RLS blocks):', delErr?.message || 'No RLS error (or table not found)');
}

check();
