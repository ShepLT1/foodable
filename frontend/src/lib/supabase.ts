import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("missing VITE_SUPABASE_URL in your env");
}

if (!supabaseAnonKey) {
  throw new Error("missing VITE_SUPABASE_ANON_KEY in your env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
