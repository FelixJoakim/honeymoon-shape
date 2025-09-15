import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    // Use environment variables if available, otherwise use local Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || publicAnonKey
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Export for backward compatibility
export const supabase = getSupabaseClient()