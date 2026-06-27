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
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cameraManager } from '@/utils/camera'
import { cn } from '@/utils/cn'
import { FILTERS, FRAMES } from '@/constants'
import type { FilterId, FrameId, CameraError } from '@/constants'
import type { Template } from '@/types'

/* ─── Template data ──────────────────────────────────── */
const classicTemplates: Template[] = [
  { id: 'single-square', name: 'Single Photo', preview: '', layout: 'single', aspectRatio: '1:1', compositeStyle: 'clean', description: '1 photo' },
  { id: 'double-vertical', name: 'Double Strip', preview: '', layout: 'double', aspectRatio: '2:3', compositeStyle: 'clean', description: '2 photos · vertical' },
  { id: 'quad-square', name: 'Four Cuts', preview: '', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'clean', description: '4 photos · 2×2 grid' },
  { id: 'six-strip', name: 'Photo Strip', preview: '', layout: 'six', aspectRatio: '4:3', compositeStyle: 'clean', description: '6 photos · 3×2 grid' },
]

const frameTemplates: Template[] = [
  { id: 'frame-polaroid-quad', name: 'Polaroid Memories', preview: '', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'polaroid', description: '4 shots · polaroid borders' },
  { id: 'frame-film-double', name: 'Film Roll', preview: '', layout: 'double', aspectRatio: '2:3', compositeStyle: 'film', description: '2 shots · film strip look' },
  { id: 'frame-blush-quad', name: 'Blush Edit', preview: '', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'blush', description: '4 shots · pink gradient' },
  { id: 'frame-minimal-single', name: 'Minimal Clean', preview: '', layout: 'single', aspectRatio: '1:1', compositeStyle: 'minimal', description: '1 shot · thin pink border' },
]

const photoCounts: Record<string, number> = { single: 1, double: 2, quad: 4, six: 6 }

const styleConfig: Record<string, { bg: string; cardBg: string; emoji: string }> = {
  clean: { bg: 'bg-rose-50', cardBg: 'bg-white', emoji: '🤍' },
  polaroid: { bg: 'bg-amber-50', cardBg: 'bg-amber-50/60', emoji: '📷' },
  film: { bg: 'bg-gray-800', cardBg: 'bg-gray-900/10', emoji: '🎞️' },
  blush: { bg: 'bg-rose-100', cardBg: 'bg-rose-50/60', emoji: '🌸' },
  minimal: { bg: 'bg-white', cardBg: 'bg-gray-50', emoji: '◻️' },
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
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group flex-shrink-0"
    >
      <div
        className={cn(
          'h-12 w-12 rounded-full overflow-hidden ring-2 ring-offset-2 transition-all duration-200',
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
          selected ? 'text-primary' : 'text-muted group-hover:text-text'
        )}
      >
        {filter.name}
      </span>
    </button>
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
        <p className="text-muted text-sm leading-relaxed mb-5">
          ClickStudio needs your camera to take photos. Please allow access in
          your browser.
        </p>
        <div className="bg-rose-50 border border-border rounded-xl p-4 text-left text-xs space-y-2 mb-6">
          <p className="font-semibold text-text mb-1">How to allow:</p>
          <p className="text-muted">① Click the 🔒 icon in the address bar</p>
          <p className="text-muted">
            ② Set <strong className="text-text">Camera</strong> → Allow
          </p>
          <p className="text-muted">③ Click Try Again below</p>
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
        <p className="text-muted text-sm leading-relaxed">
          Your browser doesn't support camera access. Try Chrome or Safari.
        </p>
      </div>
    </div>
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
    startCameraStream(cancelled)
    return () => {
      cancelled.value = true
      cameraManager.stopCamera()
      setIsStreaming(false)
    }
  }, [])

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

  /* ── Countdown tick ── */
  useEffect(() => {
    let timer: number
    if (countdown > 0) {
      timer = window.setTimeout(() => setCountdown(c => c - 1), 1000)
    } else if (countdown === 0 && isCapturing) {
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
            <span className="font-script text-xs text-muted/50 select-none">
              ClickStudio
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  if (!hasTemplate) {
    const templates = templateTab === 'classic' ? classicTemplates : frameTemplates

    return (
      <div className="h-full flex flex-col bg-background overflow-auto">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div className="text-center mb-8">
            <p className="font-script text-primary text-base mb-1">Pick your template</p>
            <h1 className="font-display text-3xl md:text-4xl text-text">
              Choose a <em className="font-script not-italic text-primary">look.</em>
            </h1>
            <p className="text-muted mt-2 text-sm">Select a layout, then start capturing.</p>
          </div>

          {/* Tab toggle */}
          <div className="inline-flex items-center bg-white border border-border rounded-full p-1 shadow-soft mb-6">
            <button
              onClick={() => setTemplateTab('classic')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all',
                templateTab === 'classic'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-primary'
              )}
            >
              Classic Layouts
            </button>
            <button
              onClick={() => setTemplateTab('frame')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all',
                templateTab === 'frame'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-primary'
              )}
            >
              Frame Templates ✦
            </button>
          </div>

          {/* Template grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {templates.map((template) => {
              const count = photoCounts[template.layout]
              const cfg = styleConfig[template.compositeStyle ?? 'clean']
              return (
                <motion.button
                  key={template.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    startNewSession(template)
                    success('Template selected ✨', `"${template.name}"`)
                  }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all bg-white shadow-card hover:-translate-y-1 hover:shadow-polaroid',
                    'border-border hover:border-primary/40'
                  )}
                >
                  <div className={cn('w-full h-28 rounded-xl flex items-center justify-center', cfg.bg)}>
                    <div className={cn(
                      'grid gap-1',
                      template.layout === 'single' && 'grid-cols-1 w-12 h-12',
                      template.layout === 'double' && 'grid-cols-1 grid-rows-2 w-10 h-20',
                      template.layout === 'quad' && 'grid-cols-2 grid-rows-2 w-16 h-16',
                      template.layout === 'six' && 'grid-cols-3 grid-rows-2 w-20 h-14'
                    )}>
                      {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="rounded-sm bg-white border border-rose-200 flex items-center justify-center">
                          <Camera className="h-2 w-2 text-rose-400 opacity-60" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="block font-display text-sm text-text">{template.name}</span>
                    <span className="text-xs text-muted">{template.description}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* ── Top controls bar ── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-white/90 backdrop-blur-sm">
        {/* Left */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (capturedPhotos.length > 0) {
                navigate('/preview')
              } else {
                clearPhotos()
              }
            }}
            icon={<ChevronLeft className="h-4 w-4" />}
            className="text-muted"
          >
            {capturedPhotos.length > 0 ? 'Preview' : 'Templates'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={switchCamera}
            disabled={!isStreaming}
            icon={<SwitchCamera className="h-4 w-4 text-muted" />}
            className="text-muted"
          >
            Flip
          </Button>
          {/* C2 — Mirror toggle */}
          <button
            onClick={() => setIsMirrored(m => !m)}
            className={cn(
              'h-9 lg:h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all touch-target',
              isMirrored
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-muted border-border hover:border-primary/40'
            )}
          >
            <FlipHorizontal className="h-3.5 w-3.5" />
            Mirror
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setShowGrid(s => !s)
              setCameraSettings({ grid: !showGrid })
            }}
            className={cn(
              'h-9 lg:h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all touch-target',
              showGrid
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-muted border-border hover:border-primary/40'
            )}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            Grid
          </button>
          <button
            onClick={() => setCameraSettings({ flash: !cameraSettings.flash })}
            className={cn(
              'h-9 lg:h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all touch-target',
              cameraSettings.flash
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-muted border-border hover:border-primary/40'
            )}
          >
            {cameraSettings.flash ? (
              <Zap className="h-3.5 w-3.5" />
            ) : (
              <ZapOff className="h-3.5 w-3.5" />
            )}
            Flash
          </button>
        </div>
      </div>

      {/* ── Camera viewport ── */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        <div className="relative w-full max-w-3xl h-full max-h-[60vh] lg:max-h-[440px]">
          <div className="camera-viewport w-full h-full shadow-card border-2 border-border rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{
                filter:
                  activeFilter.css === 'none' ? undefined : activeFilter.css,
                transform: isMirrored ? 'scaleX(-1)' : undefined,
              }}
              autoPlay
              playsInline
              muted
            />

            <FrameOverlay />

            {showGrid && isStreaming && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/20" />
                  ))}
                </div>
              </div>
            )}

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

            {!isStreaming && cameraError === 'denied' && (
              <CameraDeniedCard onRetry={retryCamera} />
            )}
            {!isStreaming && cameraError === 'unsupported' && (
              <CameraUnsupportedCard />
            )}
            {!isStreaming && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-30">
                <div className="text-center space-y-3">
                  <div className="relative mx-auto w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-border" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                  </div>
                  <p className="text-muted text-sm">Initializing camera…</p>
                </div>
              </div>
            )}

            {selectedFilter !== 'none' && isStreaming && (
              <div className="absolute top-3 right-3 z-20 bg-black/55 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {activeFilter.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom panel ── */}
      <div className="bg-white border-t border-border overflow-y-auto max-h-[35vh] lg:max-h-none">
        {/* Frame selector (now includes Polaroid — P2) */}
        <div className="flex items-center justify-center gap-1.5 px-4 py-1.5 lg:py-2 border-b border-border/60 overflow-x-auto">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted mr-1 flex-shrink-0">
            Frame
          </span>
          {FRAMES.map(frame => (
            <button
              key={frame.id}
              onClick={() => setSelectedFrame(frame.id)}
              className={cn(
                'h-9 lg:h-7 px-3 lg:px-2.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1 flex-shrink-0 touch-target',
                selectedFrame === frame.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-muted border-border hover:border-primary/40 hover:text-primary'
              )}
            >
              <span className="text-sm lg:text-[11px]">{frame.emoji}</span>
              {frame.name}
            </button>
          ))}
        </div>

        {/* C1 + C4 — Timer selector & Burst toggle */}
        <div className="flex items-center justify-between px-4 lg:px-5 py-1.5 lg:py-2 border-b border-border/60">
          {/* C1: Timer options */}
          <div className="flex items-center gap-2">
            <Timer className="h-3.5 w-3.5 text-muted flex-shrink-0" />
            <div className="flex items-center bg-rose-50 border border-border rounded-full p-0.5">
              {[3, 5, 10].map(t => (
                <button
                  key={t}
                  onClick={() => setCameraSettings({ countdown: t })}
                  className={cn(
                    'h-9 lg:h-6 px-3 lg:px-2.5 rounded-full text-xs lg:text-[11px] font-medium transition-all touch-target',
                    cameraSettings.countdown === t
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted hover:text-primary'
                  )}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>

          {/* C4: Burst mode toggle */}
          <button
            onClick={() => {
              setBurstMode(b => !b)
              burstQueueRef.current = { remaining: 0, total: 0 }
              setBurstInfo(null)
            }}
            className={cn(
              'h-9 lg:h-7 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all touch-target',
              burstMode
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-muted border-border hover:border-primary/40 hover:text-primary'
            )}
          >
            <Repeat2 className="h-3.5 w-3.5" />
            Burst {burstMode ? 'On' : 'Off'}
          </button>
        </div>

        {/* Filter label */}
        <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted pt-1.5 pb-1">
          Filter — <span className="text-primary">{activeFilter.name}</span>
        </p>

        {/* Filter thumbnails — centered, wraps on narrow screens */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 lg:gap-y-2 px-4 pb-2 lg:pb-3">
          {FILTERS.map(filter => (
            <FilterThumbnail
              key={filter.id}
              filter={filter}
              selected={selectedFilter === filter.id}
              onClick={() => setSelectedFilter(filter.id)}
            />
          ))}
        </div>

        {/* C3 — Retake thumbnail strip (shows when photos exist) */}
        {capturedPhotos.length > 0 && (
          <div className="flex items-center gap-2.5 px-4 py-1.5 lg:py-2 border-t border-border/60 bg-rose-50/40 overflow-x-auto">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted flex-shrink-0">
              Shots
            </span>
            {capturedPhotos.map((photo, i) => (
              <div key={photo.id} className="relative flex-shrink-0 group">
                <img
                  src={photo.url}
                  alt={`Shot ${i + 1}`}
                  className="w-11 h-11 object-cover rounded-lg border-2 border-white shadow-sm"
                />
                {/* Retake × button */}
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Retake this shot"
                >
                  <X className="h-3 w-3" />
                </button>
                <span className="absolute bottom-0.5 left-0 right-0 text-center text-[9px] text-white/90 font-bold">
                  {i + 1}
                </span>
              </div>
            ))}
            <span className="text-[11px] text-muted flex-shrink-0 ml-1 font-medium">
              {capturedPhotos.length} / {photosNeeded}
            </span>
          </div>
        )}

        {/* Capture controls */}
        <div className="flex items-center justify-center gap-4 lg:gap-6 px-4 lg:px-6 py-2 lg:py-3 border-t border-border/60">
          {/* Left: burst progress or timer display */}
          <div className="w-24 flex justify-center">
            {burstInfo ? (
              <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 text-xs font-semibold text-primary animate-pulse">
                <Repeat2 className="h-3 w-3" />
                {burstInfo.current}/{burstInfo.total}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-muted bg-rose-50 border border-border rounded-full px-3 py-1.5">
                <Timer className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {cameraSettings.countdown}s
              </div>
            )}
          </div>

          {/* Capture button */}
          <motion.button
            onClick={handleCaptureButton}
            disabled={!isStreaming || isCapturing}
            whileHover={{ scale: isStreaming && !isCapturing ? 1.07 : 1 }}
            whileTap={{ scale: isStreaming && !isCapturing ? 0.93 : 1 }}
            className={cn(
              'relative h-14 lg:h-16 w-14 lg:w-16 rounded-full flex items-center justify-center',
              'bg-primary transition-all animate-pulse-pink',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            <div className="absolute inset-0 rounded-full border-4 border-white/40" />
            {isCapturing ? (
              <Square className="h-6 w-6 text-white" />
            ) : (
              <Camera className="h-7 w-7 text-white" />
            )}
          </motion.button>

          {/* Status chip */}
          <div className="w-24 flex justify-center">
            <div className="flex items-center gap-1.5 text-xs text-muted bg-rose-50 border border-border rounded-full px-3 py-1.5">
              <div
                className={cn(
                  'h-2 w-2 rounded-full flex-shrink-0',
                  isStreaming ? 'bg-green-400 animate-pulse' : 'bg-border'
                )}
              />
              {isStreaming ? 'Ready ✦' : cameraError ? 'Denied' : 'Connecting…'}
            </div>
          </div>
        </div>

        {/* ── Upload option ── */}
        <div className="flex justify-center pb-1.5 lg:pb-2">
          <button
            onClick={() => uploadRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors py-1 px-3 rounded-full hover:bg-rose-50"
          >
            <Upload className="h-3.5 w-3.5" />
            or upload a photo
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
    </div>
  )
}
