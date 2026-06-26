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
    const frameId = options?.frameId
    if (frameId === 'film') {
      const barH = Math.round(h * 0.065)
      ctx.fillStyle = '#111111'
      ctx.fillRect(0, 0, w, barH)
      ctx.fillRect(0, h - barH, w, barH)
      const holeW = Math.round(w * 0.022)
      const holeH = Math.round(barH * 0.55)
      const gap = Math.round(w * 0.038)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      for (let x = gap; x < w - gap; x += gap * 1.5) {
        const ry = Math.round((barH - holeH) / 2)
        ctx.fillRect(x, ry, holeW, holeH)
        ctx.fillRect(x, h - barH + ry, holeW, holeH)
      }
    } else if (frameId === 'blush') {
      const grad = ctx.createRadialGradient(
        w / 2,
        h / 2,
        h * 0.28,
        w / 2,
        h / 2,
        h * 0.8
      )
      grad.addColorStop(0, 'rgba(233,30,140,0)')
      grad.addColorStop(1, 'rgba(233,30,140,0.28)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    } else if (frameId === 'minimal') {
      const b = Math.round(w * 0.022)
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'
      ctx.lineWidth = b
      ctx.strokeRect(b / 2, b / 2, w - b, h - b)
    } else if (frameId === 'polaroid') {
      const border = Math.round(Math.min(w, h) * 0.04)
      const bottomH = Math.round(h * 0.2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, w, border) // top
      ctx.fillRect(0, 0, border, h) // left
      ctx.fillRect(w - border, 0, border, h) // right
      ctx.fillRect(0, h - bottomH, w, bottomH) // thick bottom
      // Subtle label inside bottom strip
      ctx.fillStyle = 'rgba(155, 107, 123, 0.45)'
      ctx.font = `italic ${Math.round(h * 0.028)}px cursive`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('ClickStudio', w / 2, h - bottomH / 2)
    }

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
