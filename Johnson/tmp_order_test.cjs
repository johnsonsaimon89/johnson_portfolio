const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
function loadEnv() {
    const envPath = path.resolve('.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            if (line && line.includes('=')) {
                const [key, ...values] = line.split('=');
                process.env[key.trim()] = values.join('=').trim().replace(/^['\"]|['\"]$/g, '');
            }
        });
    }
}
loadEnv();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
    console.log('Inserting test order as ANON user...');
    const insertRes = await supabase.from('purchase_orders').insert([{
        product_id: '00000000-0000-0000-0000-000000000000',
        product_title: 'Test Course',
        product_type: 'digital',
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        amount_tzs: 10000,
        status: 'pending'
    }]).select();

    console.log('Insert Error:', insertRes.error);
    console.log('Insert Data:', insertRes.data);
    process.exit(0);
})();
