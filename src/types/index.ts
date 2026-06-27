export interface Photo {
  id: string
  url: string
  thumbnail?: string
  timestamp: number
  metadata?: PhotoMetadata
}

export interface PhotoMetadata {
  width: number
  height: number
  size: number
  format: string
  filters?: Filter[]
  adjustments?: PhotoAdjustments
}

export interface PhotoAdjustments {
  brightness: number
  contrast: number
  saturation: number
  exposure: number
  shadows: number
  highlights: number
  temperature: number
  tint: number
}

export interface Filter {
  id: string
  name: string
  preview: string
  intensity: number
}

export interface PhotoSession {
  id: string
  photos: Photo[]
  template: Template
  createdAt: number
  updatedAt: number
  exported?: boolean
}

export interface Template {
  id: string
  name: string
  preview: string
  layout: LayoutType
  aspectRatio: AspectRatio
  frameStyle?: FrameStyle
  compositeStyle?: CompositeStyle
  description?: string
}

export type LayoutType = 'single' | 'double' | 'quad' | 'six'
export type AspectRatio = '1:1' | '3:4' | '4:3' | '16:9' | '2:3'
export type CompositeStyle = 'clean' | 'polaroid' | 'film' | 'blush' | 'minimal'

export interface FrameStyle {
  id: string
  name: string
  url: string
  thickness: number
  color: string
}

export interface CameraSettings {
  deviceId?: string
  facingMode: 'user' | 'environment'
  resolution: VideoResolution
  countdown: number
  flash: boolean
  grid: boolean
}

export interface VideoResolution {
  width: number
  height: number
}

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'webp' | 'pdf'
  quality: number
  dpi: number
  printSize?: PrintSize
}

export interface PrintSize {
  width: number
  height: number
  unit: 'mm' | 'in' | 'cm'
}

export interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system'
  language: string
  autoSave: boolean
  highQuality: boolean
  reducedMotion: boolean
}

export interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export interface QRCodeData {
  sessionId: string
  photos: string[]
  expiresAt: number
}
