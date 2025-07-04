import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Application {
  id: string
  created_at: string
  updated_at: string
  agent_name: string
  agent_email: string
  session_id: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  applicant_info: {
    first_name: string
    last_name: string
    email: string
    phone: string
    date_of_birth: string
    ssn: string
    address: {
      street: string
      city: string
      state: string
      zip: string
    }
  }
  product_selection: {
    product_id: string
    product_name: string
    premium_amount: number
    term_length: number
  }
  owner_info: Record<string, any>
  joint_owner_info?: Record<string, any>
  logs: Array<{
    timestamp: string
    action: string
    details: string
  }>
} 