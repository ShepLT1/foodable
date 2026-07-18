import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  throw new Error('missing VITE_SUPABASE_URL in your env')
}

if (!supabasePublishableKey) {
  throw new Error('missing VITE_SUPABASE_PUBLISHABLE_KEY in your env')
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
