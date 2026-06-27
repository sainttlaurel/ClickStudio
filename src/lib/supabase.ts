import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  )
}

// ─── Database row types ────────────────────────────────────────
export interface DbSession {
  id: string
  template_id: string
  template: unknown // jsonb — cast to Template on read
  photo_count: number
  exported: boolean
  created_at: string
  updated_at: string
  photos?: DbPhoto[] // populated by select with join
}

export interface DbPhoto {
  id: string
  session_id: string
  storage_path: string
  public_url: string
  width: number | null
  height: number | null
  file_size: number | null
  format: string
  created_at: string
}

export interface DbFeedback {
  id: string
  name: string | null
  message: string
  emoji: string
  session_id: string | null
  approved: boolean
  created_at: string
}

// ─── Supabase client ───────────────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// ─── Constants ────────────────────────────────────────────────
export const STORAGE_BUCKETS = {
  PHOTOS: 'photos',
} as const

export const TABLES = {
  SESSIONS: 'sessions',
  PHOTOS: 'photos',
  FEEDBACK: 'feedback',
} as const

// ─── Upload a base64 data-URL photo to Supabase Storage ───────
export async function uploadPhotoToStorage(
  dataUrl: string,
  sessionId: string,
  photoId: string
): Promise<{ storagePath: string; publicUrl: string }> {
  // Convert base64 data URL → Blob
  const res = await fetch(dataUrl)
  const blob = await res.blob()

  const storagePath = `${sessionId}/${photoId}.png`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.PHOTOS)
    .upload(storagePath, blob, { contentType: 'image/png', upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from(STORAGE_BUCKETS.PHOTOS)
    .getPublicUrl(storagePath)

  return { storagePath, publicUrl: data.publicUrl }
}

// ─── Remove photos from storage ───────────────────────────────
export async function removePhotosFromStorage(paths: string[]): Promise<void> {
  if (!paths.length) return
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.PHOTOS)
    .remove(paths)
  if (error) console.error('Storage remove error:', error)
}

// ─── Feedback helpers ─────────────────────────────────────────

export async function submitFeedback(
  name: string | null,
  message: string,
  emoji: string = '♡',
  sessionId?: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLES.FEEDBACK)
    .insert({
      name: name?.trim() || null,
      message: message.trim().slice(0, 160),
      emoji,
      session_id: sessionId || null,
      approved: true,
    })
  if (error) throw error
}

export async function fetchApprovedFeedback(): Promise<DbFeedback[]> {
  const { data, error } = await supabase
    .from(TABLES.FEEDBACK)
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data || []
}
