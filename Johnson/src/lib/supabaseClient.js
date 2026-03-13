import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are real (not the placeholder text)
const hasValidCredentials =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your_supabase');

if (!hasValidCredentials) {
    console.warn(
        '[Supabase] ⚠️  Credentials not yet configured.\n' +
        'Open your .env file and fill in:\n' +
        '  VITE_SUPABASE_URL=https://xxxx.supabase.co\n' +
        '  VITE_SUPABASE_ANON_KEY=your_anon_key\n' +
        'Then restart the dev server (npm run dev).'
    );
}

// Only create the client if credentials look valid; export null otherwise.
// The Contact form checks for null and shows a friendly fallback.
export const supabase = hasValidCredentials
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseReady = hasValidCredentials;
