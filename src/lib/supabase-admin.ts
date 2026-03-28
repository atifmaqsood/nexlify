import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Lazy initialization to prevent Vercel build-time crashes
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : (null as any);

// Add a helper for server-side checks if needed
if (!supabaseAdmin && process.env.NODE_ENV === 'production') {
  console.warn("SUPABASE_ADMIN_CLIENT: Missing required environment variables during build.");
}
