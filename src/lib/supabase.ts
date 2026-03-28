import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (function() {
  let instance: any = null;
  return new Proxy({}, {
    get(target, prop) {
      if (!instance) {
        if (!supabaseUrl || !supabaseAnonKey) return (target as any)[prop];
        instance = createClient(supabaseUrl, supabaseAnonKey);
      }
      return instance[prop];
    }
  }) as unknown as SupabaseClient;
})();
