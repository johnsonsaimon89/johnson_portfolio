
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qkwjerktszhlccrdjmxg.supabase.co';
const ANON_KEY = 'sb_publishable_D0zjPiQhaOHFU8lRbbdjJw_gFu3DzNQ';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function checkConfig() {
    console.log('--- APP_CONFIG ---');
    const { data: config, error: configError } = await supabase
        .from('app_config')
        .select('*');
    
    if (configError) console.error('Config Error:', configError);
    else console.table(config);

    console.log('\n--- EMAIL_TEMPLATES ---');
    const { data: templates, error: templateError } = await supabase
        .from('email_templates')
        .select('type, subject');
    
    if (templateError) console.error('Template Error:', templateError);
    else console.table(templates);
}

checkConfig();
