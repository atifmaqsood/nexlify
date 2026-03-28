import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use a lazy getter to prevent top-level module evaluation during Vercel build
export const supabaseAdmin = (function() {
  let instance: any = null;
  
  return new Proxy({}, {
    get(target, prop) {
      if (!instance) {
        if (!supabaseUrl || !supabaseServiceKey) {
          if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
            console.warn("SUPABASE_ADMIN_MISSING: Environment variables not found at runtime.");
          }
          return (target as any)[prop]; 
        }
        instance = createClient(supabaseUrl, supabaseServiceKey!, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        });
      }
      return instance[prop];
    }
  }) as unknown as SupabaseClient;
})();
