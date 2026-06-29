import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  SwitchCamera,
  Grid3X3,
  Timer,
  Zap,
  ZapOff,
  Square,
  ChevronLeft,
  RefreshCw,
  FlipHorizontal,
  Repeat2,
  X,
  Upload,
  Plus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cameraManager } from '@/utils/camera'
import { cn } from '@/utils/cn'
import { FILTERS, FRAMES } from '@/constants'
import type { FilterId, FrameId } from '@/constants'
import type { Template, CameraError } from '@/types'
import { playCountdownTick, playCaptureSound } from '@/utils/sounds'

/* ─── Template data ──────────────────────────────────── */
interface TemplateCard extends Template {
  badge?: { label: string; variant: 'new' | 'popular' | 'trending' | 'collab' }
  previewEmoji?: string
}

const classicTemplates: TemplateCard[] = [
  { id: 'single-square', name: 'Single Photo', preview: '', layout: 'single', aspectRatio: '1:1', compositeStyle: 'clean', description: '1 photo', previewEmoji: '📸', badge: { label: 'Popular', variant: 'popular' } },
  { id: 'double-vertical', name: 'Double Strip', preview: '', layout: 'double', aspectRatio: '2:3', compositeStyle: 'clean', description: '2 photos · vertical', previewEmoji: '🎞️' },
  { id: 'quad-square', name: 'Four Cuts', preview: '', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'clean', description: '4 photos · 2×2 grid', previewEmoji: '🖼️', badge: { label: 'New', variant: 'new' } },
  { id: 'six-strip', name: 'Photo Strip', preview: '', layout: 'six', aspectRatio: '4:3', compositeStyle: 'clean', description: '6 photos · 3×2 grid', previewEmoji: '📠' },
]

const frameTemplates: TemplateCard[] = [
  { id: 'frame-polaroid-quad', name: 'Polaroid', preview: '', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'polaroid', description: '4 shots · polaroid borders', previewEmoji: '📷', badge: { label: 'Trending', variant: 'trending' } },
  { id: 'frame-film-double', name: 'Film Roll', preview: '', layout: 'double', aspectRatio: '2:3', compositeStyle: 'film', description: '2 shots · film strip look', previewEmoji: '🎥' },
  { id: 'frame-blush-quad', name: 'Blush Edit', preview: '', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'blush', description: '4 shots · pink gradient', previewEmoji: '🌸', badge: { label: 'New', variant: 'new' } },
  { id: 'frame-minimal-single', name: 'Minimal', preview: '', layout: 'single', aspectRatio: '1:1', compositeStyle: 'minimal', description: '1 shot · thin border', previewEmoji: '✧' },
  // ── PNG Frame Templates ──
  { id: 'frame-anniversary', name: 'Anniversary', preview: '', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', description: '1 shot · anniversary collage', previewEmoji: '🎉', frameImage: '/frame-templates/Beige Minimalist Happy Anniversary Photo Collage Frame Instagram Story.png', badge: { label: 'New', variant: 'new' } },
  { id: 'frame-strip', name: 'Photo Strip', preview: '', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', description: '1 shot · playful strip', previewEmoji: '🎞️', frameImage: '/frame-templates/Pink and Green Playful Photo Strip Design.png', badge: { label: 'Trending', variant: 'trending' } },
  { id: 'frame-valentine-bw', name: 'Valentine B&W', preview: '', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', description: '1 shot · minimalist valentine', previewEmoji: '🤍', frameImage: "/frame-templates/Black and White Minimalist Valentine's Day Your Story.png", badge: { label: 'Popular', variant: 'popular' } },
  { id: 'frame-family', name: 'Family Collage', preview: '', layout: 'quad', aspectRatio: '3:4', compositeStyle: 'frame', description: '4 shots · family design', previewEmoji: '👨‍👩‍👧‍👦', frameImage: '/frame-templates/Grey and Red Modern Family Photo Collage Instagram Story.png' },
  { id: 'frame-christmas', name: 'Christmas', preview: '', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', description: '1 shot · vintage christmas', previewEmoji: '🎄', frameImage: '/frame-templates/Vintage Aesthetic Christmas Portrait Photo Collage.png', badge: { label: 'New', variant: 'new' } },
]

const photoCounts: Record<string, number> = { single: 1, double: 2, quad: 4, six: 6 }

const styleConfig: Record<string, { bg: string; cardBg: string; emoji: string }> = {
  clean: { bg: 'bg-secondary', cardBg: 'bg-white', emoji: '🤍' },
  polaroid: { bg: 'bg-secondary', cardBg: 'bg-white', emoji: '📷' },
  film: { bg: 'bg-secondary', cardBg: 'bg-white', emoji: '🎞️' },
  blush: { bg: 'bg-secondary', cardBg: 'bg-white', emoji: '🌸' },
  minimal: { bg: 'bg-secondary', cardBg: 'bg-white', emoji: '◻️' },
  frame: { bg: 'bg-secondary', cardBg: 'bg-white', emoji: '🖼️' },
}

const badgeStyles: Record<string, string> = {
  new: 'bg-emerald-500/90 text-white',
  popular: 'bg-primary/90 text-white',
  trending: 'bg-amber-500/90 text-white',
  collab: 'bg-violet-500/90 text-white',
}

/* ─── FilterThumbnail ─────────────────────────────────── */
function FilterThumbnail({
  filter,
  selected,
  onClick,
}: {
  filter: (typeof FILTERS)[number]
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1.5 group flex-shrink-0"
    >
      <div
        className={cn(
          'h-12 w-12 rounded-2xl overflow-hidden ring-2 ring-offset-2 transition-all duration-200 shadow-soft',
          selected
            ? 'ring-primary ring-offset-white scale-110 shadow-md'
            : 'ring-transparent group-hover:ring-rose-200 group-hover:ring-offset-white'
        )}
      >
        <div
          className="w-full h-full"
          style={{
            background:
              'linear-gradient(135deg,#F9C5D5 0%,#F5D78E 35%,#B5E5F5 70%,#F9C5D5 100%)',
            filter: filter.css === 'none' ? undefined : filter.css,
          }}
        />
      </div>
      <span
        className={cn(
          'text-[10px] font-medium leading-none transition-colors',
          selected ? 'text-primary' : 'text-muted-foreground group-hover:text-text'
        )}
      >
        {filter.name}
      </span>
    </motion.button>
  )
}

/* ─── Camera denied card ──────────────────────────────── */
function CameraDeniedCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-30 rounded-2xl">
      <div className="text-center px-8 py-10 max-w-xs">
        <div className="text-5xl mb-4">📷</div>
        <h3 className="font-display text-xl text-text mb-2">
          Camera access needed
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5">
          ClickStudio needs your camera to take photos. Please allow access in
          your browser.
        </p>
        <div className="bg-secondary border border-border rounded-xl p-4 text-left text-xs space-y-2 mb-6">
          <p className="font-semibold text-text mb-1">How to allow:</p>
          <p className="text-muted-foreground">① Click the 🔒 icon in the address bar</p>
          <p className="text-muted-foreground">
            ② Set <strong className="text-text">Camera</strong> → Allow
          </p>
          <p className="text-muted-foreground">③ Click Try Again below</p>
        </div>
        <Button
          pill
          className="w-full"
          onClick={onRetry}
          icon={<RefreshCw className="h-4 w-4" />}
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}

function CameraUnsupportedCard() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-30 rounded-2xl">
      <div className="text-center px-8 py-10 max-w-xs">
        <div className="text-5xl mb-4">🚫</div>
        <h3 className="font-display text-xl text-text mb-2">
          Camera not supported
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your browser doesn't support camera access. Try Chrome or Safari.
        </p>
      </div>
    </div>
  )
}

/* ─── ToolbarButton ──────────────────────────────────── */
function ToolbarButton({
  icon,
  label,
  active,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
        active
          ? 'bg-primary text-white shadow-sm'
          : 'text-muted-foreground hover:bg-secondary hover:text-primary',
        disabled && 'opacity-30 cursor-not-allowed'
      )}
      title={label}
    >
      {icon}
    </motion.button>
  )
}

function MobileToolChip({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-7 px-2 rounded-full text-[10px] font-medium border flex items-center gap-1 transition-all bg-black/40 backdrop-blur-sm',
        active
          ? 'bg-primary text-white border-primary'
          : 'text-white/80 border-white/20 hover:bg-white/20'
      )}
    >
      {icon}
      {label}
    </button>
  )
}

/* ─── CameraPage ──────────────────────────────────────── */
export default function CameraPage() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)

  // ── Camera state ──
  const [isStreaming, setIsStreaming] = useState(false)
  const [cameraError, setCameraError] = useState<CameraError>(null)
  const [countdown, setCountdown] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)

  // ── Visual options ──
  const [showGrid, setShowGrid] = useState(true)
  const [isMirrored, setIsMirrored] = useState(false) // C2
  const [selectedFilter, setSelectedFilter] = useState<FilterId>('none')
  const [selectedFrame, setSelectedFrame] = useState<FrameId>('none')

  // ── Burst mode (C4) ──
  const [burstMode, setBurstMode] = useState(false)
  const [burstInfo, setBurstInfo] = useState<{
    current: number
    total: number
  } | null>(null)
  const burstQueueRef = useRef({ remaining: 0, total: 0 })
  const countdownValRef = useRef(3) // kept in sync with cameraSettings.countdown

  // ── Store ──
  const {
    cameraSettings,
    setCameraSettings,
    addPhoto,
    removePhoto,
    capturedPhotos,
    currentSession,
    startNewSession,
    clearPhotos,
    setCountdown: setCountdownState,
  } = usePhotoStore()
  const { success, error } = useToast()

  // ── Template picker state ──
  const [templateTab, setTemplateTab] = useState<'classic' | 'frame'>('classic')
  const hasTemplate = currentSession?.template != null

  // ── Tooltip walkthrough (first-visit onboarding) ──
  const [showTour, setShowTour] = useState(() => {
    if (typeof window === 'undefined') return false
    return !localStorage.getItem('clickstudio_camera_tour_done')
  })
  const [tourStep, setTourStep] = useState(0)

  const tourSteps = [
    { title: 'Pick a template', desc: 'Choose a layout or frame style to get started.', target: 'tour-template' },
    { title: 'Apply filters', desc: 'Swipe through 13 vintage film presets.', target: 'tour-filters' },
    { title: 'Set your timer', desc: 'Pick 3s, 5s or 10s countdown.', target: 'tour-timer' },
    { title: 'Snap!', desc: 'Tap the shutter when ready.', target: 'tour-capture' },
  ]

  const finishTour = () => {
    localStorage.setItem('clickstudio_camera_tour_done', '1')
    setShowTour(false)
  }

  const showSuccess = useCallback(
    (t: string, d: string) => success(t, d),
    [success]
  )
  const showError = useCallback((t: string, d: string) => error(t, d), [error])

  // ── Image upload (U1 / U2) ──────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      error('File too large', 'Please upload an image under 10 MB')
      e.target.value = ''
      return
    }

    try {
      // Read file as data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Load into an Image element so we can draw it on a canvas
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image()
        el.onload = () => resolve(el)
        el.onerror = reject
        el.src = dataUrl
      })

      // Run through the same filter + frame pipeline as a camera capture
      const processedUrl = cameraManager.processUploadedImage(img, {
        filterCss: activeFilter.css,
        frameId: selectedFrame,
      })

      addPhoto({
        id: crypto.randomUUID(),
        url: processedUrl,
        timestamp: Date.now(),
        metadata: {
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
          format: 'png',
        },
      })

      const frameName = FRAMES.find(f => f.id === selectedFrame)?.name ?? 'None'
      success(
        'Photo uploaded! 📸',
        `${activeFilter.name} filter · ${frameName} frame applied`
      )
    } catch {
      error('Upload failed', 'Could not process the image. Please try again.')
    } finally {
      e.target.value = ''
    }
  }

  const activeFilter = FILTERS.find(f => f.id === selectedFilter) ?? FILTERS[0]

  // How many photos the current template needs (C4)
  const photosNeeded = (() => {
    const layout = currentSession?.template?.layout
    if (layout === 'single') return 1
    if (layout === 'double') return 2
    if (layout === 'six') return 6
    return 4
  })()

  // Keep countdown ref in sync so burst timeouts always see the latest value
  useEffect(() => {
    countdownValRef.current = cameraSettings.countdown
  }, [cameraSettings.countdown])

  // ── Error name lists ──
  const DENIED_NAMES = [
    'NotAllowedError',
    'PermissionDeniedError',
    'SecurityError',
  ]
  const NO_DEVICE = [
    'NotFoundError',
    'DevicesNotFoundError',
    'NotReadableError',
  ]

  /* ── Start camera stream ── */
  const startCameraStream = useCallback(
    async (cancelled?: { value: boolean }) => {
      if (!videoRef.current) return
      try {
        await cameraManager.startCamera(cameraSettings, videoRef.current)
        if (cancelled?.value) return
        setIsStreaming(true)
        setCameraError(null)
        showSuccess('Camera ready ✦', 'Strike your best pose!')
      } catch (err: any) {
        if (cancelled?.value) return
        if (DENIED_NAMES.includes(err?.name)) setCameraError('denied')
        else if (NO_DEVICE.includes(err?.name)) setCameraError('unsupported')
        else {
          setCameraError('error')
          showError('Camera error', 'Failed to start camera.')
        }
      }
    },
    [cameraSettings, showSuccess, showError]
  )

  /* ── Retry ── */
  const retryCamera = useCallback(async () => {
    setCameraError(null)
    setIsStreaming(false)
    await cameraManager.stopCamera()
    await startCameraStream()
  }, [startCameraStream])

  /* ── Mount ── */
  useEffect(() => {
    const cancelled = { value: false }
    if (!cameraManager.isSupported()) {
      setCameraError('unsupported')
      return
    }
    if (hasTemplate) {
      startCameraStream(cancelled)
    }
    return () => {
      cancelled.value = true
      cameraManager.stopCamera()
      setIsStreaming(false)
    }
  }, [])

  /* ── Start camera when template is selected (after initial mount) ── */
  useEffect(() => {
    if (!hasTemplate || isStreaming || cameraError) return
    const cancelled = { value: false }
    if (!cameraManager.isSupported()) {
      setCameraError('unsupported')
      return
    }
    // Small delay so the video element is in the DOM
    const t = setTimeout(() => {
      if (!cancelled.value) startCameraStream(cancelled)
    }, 100)
    return () => {
      cancelled.value = true
      clearTimeout(t)
    }
  }, [hasTemplate])

  /* ── Auto-redirect to Preview when all shots captured ── */
  useEffect(() => {
    if (capturedPhotos.length >= photosNeeded && !isCapturing && !burstInfo) {
      success('All shots captured! 🎉', 'Taking you to the preview…')
      const timeout = setTimeout(() => {
        navigate('/preview')
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [capturedPhotos.length, photosNeeded, isCapturing, burstInfo, navigate, success, capturedPhotos])

  /* ── Countdown tick with sound ── */
  useEffect(() => {
    let timer: number
    if (countdown > 0) {
      playCountdownTick(countdown)
      timer = window.setTimeout(() => setCountdown(c => c - 1), 1000)
    } else if (countdown === 0 && isCapturing) {
      playCaptureSound()
      capturePhoto()
    }
    return () => clearTimeout(timer)
  }, [countdown, isCapturing])

  /* ── Stable fire-capture (safe to call from setTimeout) ── */
  const fireCapture = useCallback(() => {
    setIsCapturing(true)
    setCountdown(countdownValRef.current)
    setCountdownState(true, countdownValRef.current)
  }, [setCountdownState])

  /* ── Capture button handler ── */
  const handleCaptureButton = () => {
    if (!isStreaming || isCapturing) return
    if (burstMode) {
      const shotsLeft = Math.max(1, photosNeeded - capturedPhotos.length)
      burstQueueRef.current = { remaining: shotsLeft - 1, total: shotsLeft }
      setBurstInfo({ current: 1, total: shotsLeft })
    }
    fireCapture()
  }

  /* ── Capture photo ── */
  const capturePhoto = async () => {
    if (!videoRef.current || !isStreaming) return
    try {
      const photoDataUrl = cameraManager.capturePhoto(videoRef.current, {
        filterCss: activeFilter.css,
        frameId: selectedFrame,
        mirror: isMirrored,
      })

      addPhoto({
        id: crypto.randomUUID(),
        url: photoDataUrl,
        timestamp: Date.now(),
        metadata: {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
          size: photoDataUrl.length,
          format: 'png',
        },
      })

      success(
        'Photo captured! 📸',
        `${activeFilter.name} · ${FRAMES.find(f => f.id === selectedFrame)?.name}`
      )

      if (cameraSettings.flash) {
        const flash = document.createElement('div')
        flash.className = 'fixed inset-0 bg-white z-50 pointer-events-none'
        flash.style.animation = 'flash 0.35s ease-out forwards'
        document.body.appendChild(flash)
        setTimeout(() => document.body.removeChild(flash), 380)
      }

      // ── Burst continuation ──
      const { remaining, total } = burstQueueRef.current
      if (total > 0 && remaining > 0) {
        burstQueueRef.current = { remaining: remaining - 1, total }
        setBurstInfo({ current: total - remaining + 1, total })
        setTimeout(fireCapture, 950)
      } else {
        burstQueueRef.current = { remaining: 0, total: 0 }
        setBurstInfo(null)
      }
    } catch (err) {
      console.error(err)
      error('Capture failed', 'Please try again.')
      burstQueueRef.current = { remaining: 0, total: 0 }
      setBurstInfo(null)
    } finally {
      setIsCapturing(false)
      setCountdown(0)
      setCountdownState(false)
    }
  }

  const switchCamera = async () => {
    try {
      await cameraManager.switchCamera(cameraSettings)
      success('Camera switched', 'Ready from the other side!')
    } catch {
      error('Switch failed', 'Could not switch camera.')
    }
  }

  /* ── Frame overlay (CSS preview — also baked into capture) ── */
  function FrameOverlay() {
    if (selectedFrame === 'film') {
      return (
        <>
          {[0, 1].map(pos => (
            <div
              key={pos}
              className={cn(
                'absolute inset-x-0 h-9 bg-black/88 flex items-center gap-1.5 px-2 z-10 overflow-hidden',
                pos === 0 ? 'top-0' : 'bottom-0'
              )}
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-3 h-5 bg-white/15 rounded-sm"
                />
              ))}
            </div>
          ))}
        </>
      )
    }
    if (selectedFrame === 'blush') {
      return (
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
          style={{
            background:
              'radial-gradient(ellipse at center,rgba(233,30,140,0) 36%,rgba(233,30,140,0.26) 100%)',
          }}
        />
      )
    }
    if (selectedFrame === 'minimal') {
      return (
        <div className="absolute inset-2 border-2 border-white/80 rounded-xl pointer-events-none z-10" />
      )
    }
    if (selectedFrame === 'polaroid') {
      return (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-x-0 top-0 h-3 bg-white" />
          <div className="absolute inset-y-0 left-0 w-3 bg-white" />
          <div className="absolute inset-y-0 right-0 w-3 bg-white" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-white flex items-end justify-center pb-2">
            <span className="font-script text-xs text-muted-foreground/50 select-none">
              ClickStudio
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  // ── Template preview modal state ──
  const [previewTemplate, setPreviewTemplate] = useState<TemplateCard | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [bottomTab, setBottomTab] = useState<'filters' | 'frames'>('filters')

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = carouselRef.current.clientWidth * 0.6
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (!hasTemplate) {
    const templates = templateTab === 'classic' ? classicTemplates : frameTemplates

    return (
      <>
        <div className="h-full flex flex-col bg-[#faf8f6] overflow-auto">
          {/* ── Header ── */}
          <div className="flex-shrink-0 text-center pt-10 pb-4 px-6">
            <p className="font-script text-primary text-lg mb-1">Pick your template</p>
            <h1 className="font-display text-3xl md:text-4xl text-text leading-tight">
              Choose a <em className="font-script not-italic text-primary">look.</em>
            </h1>
            <p className="text-muted-foreground/70 mt-2.5 text-sm">Select a layout, then start capturing.</p>
          </div>

          {/* ── Category tabs ── */}
          <div className="flex-shrink-0 flex items-center justify-center gap-2 px-6 pb-4">
            <button
              onClick={() => setTemplateTab('classic')}
              className={cn(
                'px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border',
                templateTab === 'classic'
                  ? 'bg-primary text-white border-primary shadow-[0_4px_16px_-2px_rgba(233,30,140,0.35)] scale-[1.03]'
                  : 'bg-white/80 text-muted-foreground border-border/60 hover:border-primary/40 hover:text-primary hover:shadow-sm backdrop-blur-sm'
              )}
            >
              Classic
            </button>
            <button
              onClick={() => setTemplateTab('frame')}
              className={cn(
                'px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border',
                templateTab === 'frame'
                  ? 'bg-primary text-white border-primary shadow-[0_4px_16px_-2px_rgba(233,30,140,0.35)] scale-[1.03]'
                  : 'bg-white/80 text-muted-foreground border-border/60 hover:border-primary/40 hover:text-primary hover:shadow-sm backdrop-blur-sm'
              )}
            >
              Frame Styles
            </button>
          </div>

          {/* ── Carousel ── */}
          <div className="relative flex-1 flex items-center px-4 md:px-14 min-h-0 overflow-hidden">
            {/* Left arrow */}
            <button
              onClick={() => scrollCarousel('left')}
              className="flex absolute left-1 md:left-2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-md border border-border/40 shadow-lg items-center justify-center hover:bg-white hover:shadow-xl transition-all"
            >
              <ChevronLeft className="h-5 w-5 text-text" />
            </button>

            {/* Carousel track */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 px-12 w-full items-stretch justify-center"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {templates.map((template, idx) => {
                const count = photoCounts[template.layout]
                const cfg = styleConfig[template.compositeStyle ?? 'clean']
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="snap-start flex-shrink-0 w-[220px] md:w-[240px]"
                  >
                    <div
                      onClick={() => setPreviewTemplate(template)}
                      className={cn(
                        'group relative bg-white rounded-2xl border border-border/50 overflow-hidden h-full flex flex-col',
                        'shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]',
                        'hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:border-primary/40',
                        'transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1'
                      )}
                    >
                      {/* Badge */}
                      {template.badge && (
                        <div className={cn(
                          'absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                          badgeStyles[template.badge.variant]
                        )}>
                          {template.badge.label}
                        </div>
                      )}

                      {/* Favorite button */}
                      <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <button className="text-muted-foreground hover:text-primary transition-colors">♡</button>
                      </div>

                      {/* Preview area */}
                      <div className={cn('h-36 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]', cfg.bg)}>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl opacity-30">{template.previewEmoji || '📸'}</span>
                          </div>
                          <div className={cn(
                            'grid gap-1.5 relative z-10',
                            template.layout === 'single' && 'grid-cols-1 w-14 h-14',
                            template.layout === 'double' && 'grid-cols-1 grid-rows-2 w-12 h-24',
                            template.layout === 'quad' && 'grid-cols-2 grid-rows-2 w-20 h-20',
                            template.layout === 'six' && 'grid-cols-3 grid-rows-2 w-24 h-16'
                          )}>
                            {Array.from({ length: count }).map((_, i) => (
                              <div key={i} className="rounded-md bg-white/90 border border-rose-200/50 shadow-sm flex items-center justify-center">
                                <Camera className="h-2.5 w-2.5 text-rose-400/60" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-display text-sm text-text">{template.name}</h3>
                            <p className="text-[11px] text-muted-foreground/70 mt-0.5">{template.description}</p>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50 flex-shrink-0 ml-2">
                            <span className="font-mono">{count} poses</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-3">
                          <div className="text-[10px] text-muted-foreground/50 border border-border/40 rounded-md px-2 py-0.5">
                            {template.aspectRatio}
                          </div>
                          <div className="text-[10px] text-muted-foreground/50 border border-border/40 rounded-md px-2 py-0.5">
                            {template.compositeStyle === 'clean' ? 'Clean' :
                             template.compositeStyle === 'polaroid' ? 'Polaroid' :
                             template.compositeStyle === 'film' ? 'Film' :
                             template.compositeStyle === 'blush' ? 'Blush' :
                             template.compositeStyle === 'frame' ? 'Frame' : 'Minimal'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* Create your own card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: templates.length * 0.08, duration: 0.4 }}
                className="snap-start flex-shrink-0 w-[220px] md:w-[240px]"
              >
                <div className="relative h-full bg-white/50 border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center gap-3 p-6 text-center hover:border-primary/40 hover:bg-secondary/30 transition-all cursor-pointer">
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted/60 text-white">
                    Coming Soon
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm text-text mb-1">Custom Layout</h3>
                    <p className="text-xs text-muted-foreground/60">Create your own template</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scrollCarousel('right')}
              className="flex absolute right-1 md:right-2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-md border border-border/40 shadow-lg items-center justify-center hover:bg-white hover:shadow-xl transition-all"
            >
              <ChevronLeft className="h-5 w-5 text-text rotate-180" />
            </button>
          </div>


        </div>

        {/* ── Template Preview Modal ── */}
        {previewTemplate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-border/30"
            >
              {/* Preview image */}
              <div className={cn(
                'h-48 flex items-center justify-center',
                styleConfig[previewTemplate.compositeStyle ?? 'clean'].bg
              )}>
                <div className="text-6xl opacity-40">{previewTemplate.previewEmoji || '📸'}</div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-display text-xl text-text">{previewTemplate.name}</h2>
                    <p className="text-sm text-muted-foreground/70 mt-1">{previewTemplate.description}</p>
                  </div>
                  {previewTemplate.badge && (
                    <span className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0',
                      badgeStyles[previewTemplate.badge.variant]
                    )}>
                      {previewTemplate.badge.label}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <div className="text-xs bg-secondary border border-border/40 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                    <Camera className="h-3 w-3 text-primary" />
                    {photoCounts[previewTemplate.layout]} poses
                  </div>
                  <div className="text-xs bg-secondary border border-border/40 rounded-lg px-3 py-1.5">
                    {previewTemplate.aspectRatio}
                  </div>
                  <div className="text-xs bg-secondary border border-border/40 rounded-lg px-3 py-1.5">
                    {previewTemplate.compositeStyle === 'clean' ? 'Clean finish' :
                     previewTemplate.compositeStyle === 'polaroid' ? 'Polaroid borders' :
                     previewTemplate.compositeStyle === 'film' ? 'Film strip' :
                     previewTemplate.compositeStyle === 'blush' ? 'Blush tone' :
                     previewTemplate.compositeStyle === 'frame' ? 'Frame design' : 'Minimal frame'}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    startNewSession(previewTemplate)
                    setPreviewTemplate(null)
                    success('Template selected ✨', `"${previewTemplate.name}"`)
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-rose-400 text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Use This Layout
                </button>

                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="w-full mt-2 py-2 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  Browse other templates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#faf8f6]">
      {/* ── Tooltip Tour Overlay ── */}
      <AnimatePresence>
        {showTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-2xl border border-border p-6 max-w-sm w-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{tourStep + 1}</span>
                </div>
                <p className="text-xs text-muted-foreground">Step {tourStep + 1} of {tourSteps.length}</p>
              </div>
              <h3 className="font-display text-xl text-text mb-1">{tourSteps[tourStep].title}</h3>
              <p className="text-sm text-muted-foreground mb-5">{tourSteps[tourStep].desc}</p>
              <div className="flex gap-2">
                <button onClick={finishTour} className="flex-1 h-10 rounded-2xl text-sm font-medium text-muted-foreground border border-border hover:bg-secondary transition-all">
                  Skip tour
                </button>
                <button
                  onClick={() => {
                    if (tourStep < tourSteps.length - 1) setTourStep(s => s + 1)
                    else finishTour()
                  }}
                  className="flex-1 h-10 rounded-2xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all shadow-sm"
                >
                  {tourStep < tourSteps.length - 1 ? 'Next' : 'Got it'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-white/80 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (capturedPhotos.length > 0) navigate('/preview')
              else clearPhotos()
            }}
            className="h-8 px-3 rounded-full text-xs font-medium border border-border/50 bg-white text-muted-foreground hover:text-primary hover:border-primary/30 transition-all flex items-center gap-1.5"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            {capturedPhotos.length > 0 ? 'Preview' : 'Back'}
          </button>
        </div>

        {/* Upload */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => uploadRef.current?.click()}
            className="h-8 px-3 rounded-full text-xs font-medium border border-border/50 bg-white text-muted-foreground hover:text-primary hover:border-primary/30 transition-all flex items-center gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
          <input
            ref={uploadRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* ── Main content: toolbar + camera ── */}
      <div className="flex-1 flex min-h-0">
        {/* Floating toolbar (desktop) */}
        <div className="hidden lg:flex flex-col items-center gap-2 py-4 px-2 flex-shrink-0">
          <div className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur-md rounded-2xl border border-border/40 shadow-soft p-2">
            <ToolbarButton icon={<Grid3X3 className="h-4 w-4" />} label="Grid" active={showGrid} onClick={() => { setShowGrid(s => !s); setCameraSettings({ grid: !showGrid }) }} />
            <ToolbarButton icon={<FlipHorizontal className="h-4 w-4" />} label="Mirror" active={isMirrored} onClick={() => setIsMirrored(m => !m)} />
            <ToolbarButton icon={<SwitchCamera className="h-4 w-4" />} label="Flip" onClick={switchCamera} disabled={!isStreaming} />
            <ToolbarButton icon={cameraSettings.flash ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />} label="Flash" active={cameraSettings.flash} onClick={() => setCameraSettings({ flash: !cameraSettings.flash })} />
            <div className="w-8 border-t border-border/40 my-1" />
            <ToolbarButton icon={<Timer className="h-4 w-4" />} label="Timer" />
          </div>
          {/* Timer sub-options */}
          <div className="flex flex-col gap-1 bg-white/80 backdrop-blur-md rounded-2xl border border-border/40 shadow-soft p-1.5">
            {[3, 5, 10].map(t => (
              <button
                key={t}
                onClick={() => setCameraSettings({ countdown: t })}
                className={cn(
                  'w-8 h-8 rounded-xl text-[10px] font-bold transition-all',
                  cameraSettings.countdown === t
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                )}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>

        {/* Camera viewport */}
        <div className="flex-1 flex items-center justify-center p-3 md:p-4 min-h-0">
          <div className="relative w-full max-w-3xl max-h-[55vh] lg:max-h-[480px] aspect-[4/3]">
            <div className="camera-viewport w-full h-full shadow-xl border border-border/40 rounded-2xl overflow-hidden bg-gray-900">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{
                  filter: activeFilter.css === 'none' ? undefined : activeFilter.css,
                  transform: isMirrored ? 'scaleX(-1)' : undefined,
                }}
                autoPlay playsInline muted
              />

              <FrameOverlay />

              {showGrid && isStreaming && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/15" />
                    ))}
                  </div>
                </div>
              )}

              {/* Filter name badge */}
              {selectedFilter !== 'none' && isStreaming && (
                <div className="absolute top-3 left-3 z-20 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
                  {activeFilter.name}
                </div>
              )}

              {/* Mobile toolbar row (above countdown) */}
              <div className="lg:hidden absolute top-3 right-3 z-20 flex gap-1.5">
                <MobileToolChip icon={<Grid3X3 className="h-3 w-3" />} label="Grid" active={showGrid} onClick={() => { setShowGrid(s => !s); setCameraSettings({ grid: !showGrid }) }} />
                <MobileToolChip icon={<FlipHorizontal className="h-3 w-3" />} label="Mirr" active={isMirrored} onClick={() => setIsMirrored(m => !m)} />
                <MobileToolChip icon={<SwitchCamera className="h-3 w-3" />} label="Flip" onClick={switchCamera} />
              </div>

              {/* Countdown */}
              <AnimatePresence>
                {countdown > 0 && (
                  <motion.div
                    key={countdown}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-30 gap-3"
                  >
                    <span className="font-display text-[8rem] text-white drop-shadow-2xl leading-none">
                      {countdown}
                    </span>
                    {burstInfo && (
                      <span className="bg-primary/80 text-white text-sm font-semibold px-4 py-1 rounded-full">
                        Shot {burstInfo.current} of {burstInfo.total}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error states */}
              {!isStreaming && cameraError === 'denied' && <CameraDeniedCard onRetry={retryCamera} />}
              {!isStreaming && cameraError === 'unsupported' && <CameraUnsupportedCard />}
              {!isStreaming && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-30">
                  <div className="text-center space-y-3">
                    <div className="relative mx-auto w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-4 border-white/20" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                    </div>
                    <p className="text-white/60 text-sm">Initializing camera…</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom panel ── */}
      <div className="bg-white/90 backdrop-blur-md border-t border-border/40 flex-shrink-0">
        {/* Tab row: Filters | Frames */}
        <div className="flex px-4 pt-2 gap-2">
          <button
            onClick={() => setBottomTab('filters')}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
              bottomTab === 'filters'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-primary bg-secondary/50'
            )}
          >
            Filters
          </button>
          <button
            onClick={() => setBottomTab('frames')}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
              bottomTab === 'frames'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-primary bg-secondary/50'
            )}
          >
            Frames
          </button>
        </div>

        {/* Content */}
        <div className="overflow-x-auto px-4 py-2 flex justify-center">
          {bottomTab === 'filters' && (
            <div className="flex gap-3">
              {FILTERS.map(filter => (
                <FilterThumbnail
                  key={filter.id}
                  filter={filter}
                  selected={selectedFilter === filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                />
              ))}
            </div>
          )}
          {bottomTab === 'frames' && (
            <div className="flex gap-2">
              {FRAMES.map(frame => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={cn(
                    'flex-shrink-0 h-10 px-3.5 rounded-2xl text-xs font-medium border transition-all flex items-center gap-1.5',
                    selectedFrame === frame.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-muted-foreground border-border/60 hover:border-primary/40 hover:text-primary'
                  )}
                >
                  <span className="text-base">{frame.emoji}</span>
                  {frame.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Timer + Burst controls ── */}
        <div className="flex items-center justify-center gap-3 px-4 py-1.5 border-t border-border/30">
          {/* Timer */}
          <div className="flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="flex items-center bg-secondary border border-border/50 rounded-full p-0.5">
              {[3, 5, 10].map(t => (
                <button
                  key={t}
                  onClick={() => setCameraSettings({ countdown: t })}
                  className={cn(
                    'h-7 px-2.5 rounded-full text-[10px] font-medium transition-all',
                    cameraSettings.countdown === t
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>

          {/* Burst toggle (mobile: in condensed row) */}
          <button
            onClick={() => {
              setBurstMode(b => !b)
              burstQueueRef.current = { remaining: 0, total: 0 }
              setBurstInfo(null)
            }}
            className={cn(
              'h-7 px-3 rounded-full text-[10px] font-medium border flex items-center gap-1.5 transition-all',
              burstMode
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-muted-foreground border-border/60 hover:text-primary'
            )}
          >
            <Repeat2 className="h-3 w-3" />
            Burst
          </button>
        </div>

        {/* ── Capture row ── */}
        <div className="flex items-center justify-center gap-6 px-4 py-3 border-t border-border/30">
          {/* Shot count */}
          <div className="flex items-center gap-2">
            {capturedPhotos.length > 0 ? (
              <div className="flex items-center gap-1">
                {capturedPhotos.slice(-5).map((photo, i) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={`Shot ${capturedPhotos.length - capturedPhotos.slice(-5).length + i + 1}`}
                      className="w-8 h-8 object-cover rounded-lg border-2 border-white shadow-sm"
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
                <span className="text-[10px] text-muted-foreground font-medium ml-0.5">{capturedPhotos.length}/{photosNeeded}</span>
              </div>
            ) : (
              <div className="text-[10px] text-muted-foreground/40">No shots yet</div>
            )}
          </div>

          {/* Capture button */}
          <motion.button
            onClick={handleCaptureButton}
            disabled={!isStreaming || isCapturing}
            whileHover={{ scale: isStreaming && !isCapturing ? 1.08 : 1 }}
            whileTap={{ scale: isStreaming && !isCapturing ? 0.92 : 1 }}
            className={cn(
              'relative h-16 w-16 rounded-full flex items-center justify-center',
              'bg-gradient-to-br from-primary to-rose-400 shadow-lg shadow-primary/30',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              isCapturing && 'animate-pulse'
            )}
          >
            <div className="absolute inset-1 rounded-full border-[3px] border-white/40" />
            <div className="absolute inset-2 rounded-full bg-white/10" />
            {isCapturing ? (
              <Square className="h-6 w-6 text-white relative z-10" />
            ) : (
              <Camera className="h-7 w-7 text-white relative z-10" />
            )}
          </motion.button>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <div className={cn(
              'h-2 w-2 rounded-full',
              isStreaming ? 'bg-green-400' : 'bg-border'
            )} />
            <span className="text-[10px] text-muted-foreground">
              {isStreaming ? 'Ready' : cameraError ? 'Offline' : '...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
