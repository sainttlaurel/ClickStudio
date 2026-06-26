import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Photo, PhotoSession, Template, CameraSettings } from '@/types'

interface PhotoState {
  // Current session
  currentSession: PhotoSession | null
  capturedPhotos: Photo[]
  
  // Camera settings
  cameraSettings: CameraSettings
  isCountdownActive: boolean
  countdownValue: number
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Actions
  startNewSession: (template: Template) => void
  addPhoto: (photo: Photo) => void
  removePhoto: (photoId: string) => void
  updatePhoto: (photoId: string, updates: Partial<Photo>) => void
  clearPhotos: () => void
  
  setCameraSettings: (settings: Partial<CameraSettings>) => void
  setCountdown: (active: boolean, value?: number) => void
  
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Session management
  saveSession: () => void
  loadSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
}

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      capturedPhotos: [],
      
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
      
      // Actions
      startNewSession: (template: Template) => {
        const session: PhotoSession = {
          id: crypto.randomUUID(),
          photos: [],
          template,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        
        set({
          currentSession: session,
          capturedPhotos: [],
          error: null,
        })
      },
      
      addPhoto: (photo: Photo) => {
        const { currentSession, capturedPhotos } = get()
        const newPhotos = [...capturedPhotos, photo]
        
        set({
          capturedPhotos: newPhotos,
          currentSession: currentSession ? {
            ...currentSession,
            photos: newPhotos,
            updatedAt: Date.now(),
          } : null,
        })
      },
      
      removePhoto: (photoId: string) => {
        const { currentSession, capturedPhotos } = get()
        const newPhotos = capturedPhotos.filter(p => p.id !== photoId)
        
        set({
          capturedPhotos: newPhotos,
          currentSession: currentSession ? {
            ...currentSession,
            photos: newPhotos,
            updatedAt: Date.now(),
          } : null,
        })
      },
      
      updatePhoto: (photoId: string, updates: Partial<Photo>) => {
        const { currentSession, capturedPhotos } = get()
        const newPhotos = capturedPhotos.map(p => 
          p.id === photoId ? { ...p, ...updates } : p
        )
        
        set({
          capturedPhotos: newPhotos,
          currentSession: currentSession ? {
            ...currentSession,
            photos: newPhotos,
            updatedAt: Date.now(),
          } : null,
        })
      },
      
      clearPhotos: () => {
        set({
          capturedPhotos: [],
          currentSession: null,
        })
      },
      
      setCameraSettings: (settings: Partial<CameraSettings>) => {
        const currentSettings = get().cameraSettings
        set({
          cameraSettings: { ...currentSettings, ...settings },
        })
      },
      
      setCountdown: (active: boolean, value = 3) => {
        set({
          isCountdownActive: active,
          countdownValue: value,
        })
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
      
      setError: (error: string | null) => {
        set({ error })
      },
      
      // Session management
      saveSession: () => {
        const { currentSession } = get()
        if (currentSession) {
          // TODO: Save to Supabase
          console.log('Saving session:', currentSession)
        }
      },
      
      loadSession: (sessionId: string) => {
        // TODO: Load from Supabase
        console.log('Loading session:', sessionId)
      },
      
      deleteSession: (sessionId: string) => {
        // TODO: Delete from Supabase
        console.log('Deleting session:', sessionId)
      },
    }),
    {
      name: 'photobooth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cameraSettings: state.cameraSettings,
      }),
    }
  )
)