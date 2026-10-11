import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-kolongan-satu.supabase.co';
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isValidServiceRoleKey = Boolean(
  rawServiceKey &&
    !rawServiceKey.includes('your-actual') &&
    !rawServiceKey.includes('dummy') &&
    rawServiceKey.length > 20
);

const supabaseKey =
  (isValidServiceRoleKey ? rawServiceKey : null) ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'dummy-key';

export const isServerSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (isValidServiceRoleKey ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
);

export function createServerClient() {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}
