import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Photo, PhotoSession, Template, CameraSettings } from '@/types'
import {
  supabase,
  TABLES,
  uploadPhotoToStorage,
  removePhotosFromStorage,
} from '@/lib/supabase'

interface PhotoState {
  // ── Current session ──────────────────────────────────────────
  currentSession: PhotoSession | null
  capturedPhotos: Photo[]

  // ── Cloud sessions (loaded from Supabase) ────────────────────
  savedSessions: PhotoSession[]
  isSyncing: boolean

  // ── Camera settings ──────────────────────────────────────────
  cameraSettings: CameraSettings
  isCountdownActive: boolean
  countdownValue: number

  // ── UI state ─────────────────────────────────────────────────
  isLoading: boolean
  error: string | null

  // ── Local actions ────────────────────────────────────────────
  startNewSession: (template: Template) => void
  addPhoto: (photo: Photo) => void
  removePhoto: (photoId: string) => void
  updatePhoto: (photoId: string, updates: Partial<Photo>) => void
  clearPhotos: () => void
  setCameraSettings: (settings: Partial<CameraSettings>) => void
  setCountdown: (active: boolean, value?: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // ── Supabase actions ─────────────────────────────────────────
  saveSession: () => Promise<void>
  fetchSessions: () => Promise<void>
  deleteSession: (sessionId: string) => Promise<void>
  loadSession: (sessionId: string) => Promise<void>
}

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────
      currentSession: null,
      capturedPhotos: [],
      savedSessions: [],
      isSyncing: false,

      cameraSettings: {
        facingMode: 'user',
        resolution: { width: 1280, height: 720 },
        countdown: 3,
        flash: false,
        grid: true,
      },
      isCountdownActive: false,
      countdownValue: 3,

      isLoading: false,
      error: null,

      // ── Local actions ──────────────────────────────────────
      startNewSession: template => {
        const session: PhotoSession = {
          id: crypto.randomUUID(),
          photos: [],
          template,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set({ currentSession: session, capturedPhotos: [], error: null })
      },

      addPhoto: photo => {
        const { currentSession, capturedPhotos } = get()
        const newPhotos = [...capturedPhotos, photo]
        set({
          capturedPhotos: newPhotos,
          currentSession: currentSession
            ? { ...currentSession, photos: newPhotos, updatedAt: Date.now() }
            : null,
        })
      },

      removePhoto: photoId => {
        const { currentSession, capturedPhotos } = get()
        const newPhotos = capturedPhotos.filter(p => p.id !== photoId)
        set({
          capturedPhotos: newPhotos,
          currentSession: currentSession
            ? { ...currentSession, photos: newPhotos, updatedAt: Date.now() }
            : null,
        })
      },

      updatePhoto: (photoId, updates) => {
        const { currentSession, capturedPhotos } = get()
        const newPhotos = capturedPhotos.map(p =>
          p.id === photoId ? { ...p, ...updates } : p
        )
        set({
          capturedPhotos: newPhotos,
          currentSession: currentSession
            ? { ...currentSession, photos: newPhotos, updatedAt: Date.now() }
            : null,
        })
      },

      clearPhotos: () => set({ capturedPhotos: [], currentSession: null }),

      setCameraSettings: settings => {
        set({ cameraSettings: { ...get().cameraSettings, ...settings } })
      },

      setCountdown: (active, value = 3) => {
        set({ isCountdownActive: active, countdownValue: value })
      },

      setLoading: loading => set({ isLoading: loading }),
      setError: error => set({ error }),

      // ── Supabase: Save current session + photos to cloud ──
      saveSession: async () => {
        const { currentSession, capturedPhotos } = get()
        if (!currentSession) return

        set({ isSyncing: true, error: null })
        try {
          // 1. Upsert session row
          const { error: sessionErr } = await supabase
            .from(TABLES.SESSIONS)
            .upsert({
              id: currentSession.id,
              template_id: currentSession.template.id,
              template: currentSession.template,
              photo_count: capturedPhotos.length,
              exported: currentSession.exported ?? false,
              updated_at: new Date().toISOString(),
            })
          if (sessionErr) throw sessionErr

          // 2. Upload each photo to storage and upsert photo rows
          for (const photo of capturedPhotos) {
            const { storagePath, publicUrl } = await uploadPhotoToStorage(
              photo.url,
              currentSession.id,
              photo.id
            )

            const { error: photoErr } = await supabase
              .from(TABLES.PHOTOS)
              .upsert({
                id: photo.id,
                session_id: currentSession.id,
                storage_path: storagePath,
                public_url: publicUrl,
                width: photo.metadata?.width ?? null,
                height: photo.metadata?.height ?? null,
                file_size: photo.metadata?.size ?? null,
                format: photo.metadata?.format ?? 'png',
              })
            if (photoErr) throw photoErr
          }

          // 3. Refresh the saved sessions list
          await get().fetchSessions()
        } catch (err) {
          console.error('saveSession error:', err)
          set({ error: 'Failed to save session to cloud. Please try again.' })
        } finally {
          set({ isSyncing: false })
        }
      },

      // ── Supabase: Load all sessions from DB ───────────────
      fetchSessions: async () => {
        set({ isSyncing: true })
        try {
          const { data, error } = await supabase
            .from(TABLES.SESSIONS)
            .select(`*, photos (*)`)
            .order('created_at', { ascending: false })

          if (error) throw error

          const sessions: PhotoSession[] = (data ?? []).map(s => ({
            id: s.id,
            template: s.template as Template,
            photos: (s.photos ?? []).map((p: any) => ({
              id: p.id,
              url: p.public_url,
              timestamp: new Date(p.created_at).getTime(),
              metadata: {
                width: p.width ?? 0,
                height: p.height ?? 0,
                size: p.file_size ?? 0,
                format: p.format ?? 'png',
              },
            })),
            createdAt: new Date(s.created_at).getTime(),
            updatedAt: new Date(s.updated_at).getTime(),
            exported: s.exported,
          }))

          set({ savedSessions: sessions })
        } catch (err) {
          console.error('fetchSessions error:', err)
        } finally {
          set({ isSyncing: false })
        }
      },

      // ── Supabase: Delete session + storage photos ─────────
      deleteSession: async sessionId => {
        set({ isSyncing: true })
        try {
          // Get storage paths so we can clean up files
          const { data: photos } = await supabase
            .from(TABLES.PHOTOS)
            .select('storage_path')
            .eq('session_id', sessionId)

          if (photos?.length) {
            await removePhotosFromStorage(photos.map(p => p.storage_path))
          }

          // Delete session row (photos cascade-delete via FK)
          const { error } = await supabase
            .from(TABLES.SESSIONS)
            .delete()
            .eq('id', sessionId)

          if (error) throw error

          set(state => ({
            savedSessions: state.savedSessions.filter(s => s.id !== sessionId),
          }))
        } catch (err) {
          console.error('deleteSession error:', err)
          set({ error: 'Failed to delete session.' })
        } finally {
          set({ isSyncing: false })
        }
      },

      // ── Supabase: Load one session into current state ─────
      loadSession: async sessionId => {
        set({ isLoading: true })
        try {
          const { data, error } = await supabase
            .from(TABLES.SESSIONS)
            .select(`*, photos (*)`)
            .eq('id', sessionId)
            .single()

          if (error) throw error

          const session: PhotoSession = {
            id: data.id,
            template: data.template as Template,
            photos: (data.photos ?? []).map((p: any) => ({
              id: p.id,
              url: p.public_url,
              timestamp: new Date(p.created_at).getTime(),
              metadata: {
                width: p.width ?? 0,
                height: p.height ?? 0,
                size: p.file_size ?? 0,
                format: p.format ?? 'png',
              },
            })),
            createdAt: new Date(data.created_at).getTime(),
            updatedAt: new Date(data.updated_at).getTime(),
            exported: data.exported,
          }

          set({
            currentSession: session,
            capturedPhotos: session.photos,
          })
        } catch (err) {
          console.error('loadSession error:', err)
          set({ error: 'Failed to load session.' })
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'clickstudio-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist camera settings — photos stay in memory during a session
      partialize: state => ({
        cameraSettings: state.cameraSettings,
      }),
    }
  )
)
