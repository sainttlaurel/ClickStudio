import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Storage bucket names
export const STORAGE_BUCKETS = {
  PHOTOS: 'photos',
  THUMBNAILS: 'thumbnails',
  TEMPLATES: 'templates',
  EXPORTS: 'exports',
} as const

// Database table names
export const TABLES = {
  SESSIONS: 'sessions',
  PHOTOS: 'photos',
  TEMPLATES: 'templates',
  USER_PREFERENCES: 'user_preferences',
} as const