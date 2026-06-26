import { create } from 'zustand'
import type { Toast } from '@/types'

interface UIState {
  // Sidebar
  sidebarOpen: boolean
  
  // Modals
  activeModal: string | null
  
  // Toasts
  toasts: Toast[]
  
  // Theme & Preferences
  theme: 'dark' | 'light' | 'system'
  reducedMotion: boolean
  
  // Loading states
  loadingStates: Record<string, boolean>
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  
  openModal: (modalId: string) => void
  closeModal: () => void
  
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  setTheme: (theme: 'dark' | 'light' | 'system') => void
  setReducedMotion: (reduced: boolean) => void
  
  setLoading: (key: string, loading: boolean) => void
  isLoading: (key: string) => boolean
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  sidebarOpen: false,
  activeModal: null,
  toasts: [],
  theme: 'dark',
  reducedMotion: false,
  loadingStates: {},
  
  // Actions
  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open })
  },
  
  toggleSidebar: () => {
    set(state => ({ sidebarOpen: !state.sidebarOpen }))
  },
  
  openModal: (modalId: string) => {
    set({ activeModal: modalId })
  },
  
  closeModal: () => {
    set({ activeModal: null })
  },
  
  addToast: (toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      ...toast,
      id: crypto.randomUUID(),
    }
    
    set(state => ({
      toasts: [...state.toasts, newToast]
    }))
    
    // Auto-remove toast after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(newToast.id)
      }, duration)
    }
  },
  
  removeToast: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }))
  },
  
  clearToasts: () => {
    set({ toasts: [] })
  },
  
  setTheme: (theme: 'dark' | 'light' | 'system') => {
    set({ theme })
  },
  
  setReducedMotion: (reduced: boolean) => {
    set({ reducedMotion: reduced })
  },
  
  setLoading: (key: string, loading: boolean) => {
    set(state => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      }
    }))
  },
  
  isLoading: (key: string) => {
    return get().loadingStates[key] ?? false
  },
}))

// Helper hooks for common toast types
export const useToast = () => {
  const addToast = useUIStore(state => state.addToast)
  
  return {
    toast: addToast,
    success: (title: string, description?: string) => 
      addToast({ title, description, type: 'success' }),
    error: (title: string, description?: string) => 
      addToast({ title, description, type: 'error' }),
    warning: (title: string, description?: string) => 
      addToast({ title, description, type: 'warning' }),
    info: (title: string, description?: string) => 
      addToast({ title, description, type: 'info' }),
  }
}