import { bakeFrameOverlay } from './frameOverlay'
import type { CameraSettings, VideoResolution } from '@/types'

export class CameraManager {
  private stream: MediaStream | null = null
  private videoElement: HTMLVideoElement | null = null

  async requestPermissions(): Promise<boolean> {
    // navigator.permissions.query for 'camera' is not universally supported
    // (throws in Firefox, Safari partial). We directly probe getUserMedia instead.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(t => t.stop())
      return true
    } catch (err: any) {
      const denied = [
        'NotAllowedError',
        'PermissionDeniedError',
        'SecurityError',
      ]
      if (!denied.includes(err?.name)) {
        console.error('Camera permission error:', err)
      }
      return false
    }
  }

  async getAvailableDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices.filter(device => device.kind === 'videoinput')
    } catch (error) {
      console.error('Error getting camera devices:', error)
      return []
    }
  }

  async startCamera(
    settings: CameraSettings,
    videoElement: HTMLVideoElement
  ): Promise<void> {
    try {
      await this.stopCamera()

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: settings.deviceId
            ? { exact: settings.deviceId }
            : undefined,
          facingMode: settings.facingMode ?? 'user',
          width: { ideal: settings.resolution.width },
          height: { ideal: settings.resolution.height },
          // aspectRatio omitted — causes OverconstrainedError on some devices
        },
        audio: false,
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.videoElement = videoElement
      videoElement.srcObject = this.stream

      await new Promise<void>((resolve, reject) => {
        const handleCanPlay = () => {
          videoElement.removeEventListener('canplay', handleCanPlay)
          videoElement.removeEventListener('error', handleError)
          resolve()
        }
        const handleError = () => {
          videoElement.removeEventListener('canplay', handleCanPlay)
          videoElement.removeEventListener('error', handleError)
          reject(new Error('Video failed to load'))
        }
        if (videoElement.readyState >= 3) {
          resolve()
        } else {
          videoElement.addEventListener('canplay', handleCanPlay)
          videoElement.addEventListener('error', handleError)
        }
        videoElement.play().catch(reject)
      })

      navigator.mediaDevices.addEventListener(
        'devicechange',
        this.handleDeviceChange.bind(this)
      )
    } catch (error) {
      console.error('Error starting camera:', error)
      throw error // re-throw original so callers can inspect error.name
    }
  }

  async stopCamera(): Promise<void> {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null
      this.videoElement = null
    }
    navigator.mediaDevices.removeEventListener(
      'devicechange',
      this.handleDeviceChange.bind(this)
    )
  }

  /**
   * Bake a frame overlay onto an existing canvas context.
   * Shared by capturePhoto and processUploadedImage.
   */
  private bakeFrameOverlay(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    frameId?: string
  ): void {
    bakeFrameOverlay(ctx, w, h, frameId)
  }

  /**
   * Capture a frame from the video element.
   * Bakes in the CSS filter and a frame overlay if provided.
   */
  capturePhoto(
    videoElement: HTMLVideoElement,
    options?: { filterCss?: string; frameId?: string; mirror?: boolean }
  ): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')

    const w = videoElement.videoWidth
    const h = videoElement.videoHeight
    canvas.width = w
    canvas.height = h

    // ── Apply filter ──
    const filterCss = options?.filterCss
    if (filterCss && filterCss !== 'none') ctx.filter = filterCss

    // ── Apply mirror transform then draw ──
    if (options?.mirror) ctx.setTransform(-1, 0, 0, 1, w, 0)
    ctx.drawImage(videoElement, 0, 0)

    // ── Reset filter + transform before frame overlay ──
    ctx.filter = 'none'
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // ── Bake frame overlay ──
    this.bakeFrameOverlay(ctx, w, h, options?.frameId)

    return canvas.toDataURL('image/png', 1.0)
  }

  /**
   * Process an uploaded image through the same filter + frame pipeline
   * as a camera capture. Returns a PNG data URL.
   */
  processUploadedImage(
    imgElement: HTMLImageElement,
    options?: { filterCss?: string; frameId?: string }
  ): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')

    const w = imgElement.naturalWidth
    const h = imgElement.naturalHeight
    canvas.width = w
    canvas.height = h

    // ── Apply filter ──
    const filterCss = options?.filterCss
    if (filterCss && filterCss !== 'none') ctx.filter = filterCss
    ctx.drawImage(imgElement, 0, 0)

    // ── Reset filter before frame overlay ──
    ctx.filter = 'none'
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // ── Bake frame overlay ──
    this.bakeFrameOverlay(ctx, w, h, options?.frameId)

    return canvas.toDataURL('image/png', 1.0)
  }

  async switchCamera(settings: CameraSettings): Promise<void> {
    if (!this.videoElement) throw new Error('No active video element')

    const devices = await this.getAvailableDevices()
    const currentIndex = devices.findIndex(
      d => d.deviceId === settings.deviceId
    )
    const nextIndex = (currentIndex + 1) % devices.length
    const nextDevice = devices[nextIndex]

    if (nextDevice) {
      await this.startCamera(
        { ...settings, deviceId: nextDevice.deviceId },
        this.videoElement
      )
    }
  }

  private handleDeviceChange(): void {
    console.log('Camera devices changed')
  }

  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }
}

export const cameraManager = new CameraManager()

export const DEFAULT_RESOLUTIONS: VideoResolution[] = [
  { width: 1920, height: 1080 },
  { width: 1280, height: 720 },
  { width: 640, height: 480 },
]

export function getOptimalResolution(constraints?: {
  maxWidth?: number
  maxHeight?: number
}): VideoResolution {
  if (!constraints) return DEFAULT_RESOLUTIONS[0]
  const { maxWidth = Infinity, maxHeight = Infinity } = constraints
  return (
    DEFAULT_RESOLUTIONS.find(
      r => r.width <= maxWidth && r.height <= maxHeight
    ) || DEFAULT_RESOLUTIONS[DEFAULT_RESOLUTIONS.length - 1]
  )
}

