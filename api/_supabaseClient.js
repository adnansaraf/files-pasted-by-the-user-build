import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.warn(
    'Warning: SUPABASE_URL or SUPABASE_SECRET_KEY is missing from the environment. Supabase calls will fail unless configured.'
  );
}

// Server-side Supabase client using the service role key
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseSecretKey || 'placeholder-secret-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);
