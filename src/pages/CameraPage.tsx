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
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cameraManager } from '@/utils/camera'
import { cn } from '@/utils/cn'

/* ─── Filter presets ────────────────────────────────────── */
export const FILTERS = [
  { id: 'none', name: 'Original', css: 'none' },
  {
    id: 'vintage',
    name: 'Vintage',
    css: 'sepia(45%) contrast(1.1) brightness(1.05) saturate(0.85)',
  },
  {
    id: 'smooth',
    name: 'Smooth',
    css: 'brightness(1.1) contrast(0.88) saturate(0.85)',
  },
  {
    id: '70s',
    name: '70s',
    css: 'sepia(55%) saturate(1.6) contrast(1.08) brightness(1.1) hue-rotate(8deg)',
  },
  {
    id: '80s',
    name: '80s',
    css: 'contrast(1.35) saturate(1.7) brightness(1.1) hue-rotate(-25deg)',
  },
  {
    id: '90s',
    name: '90s',
    css: 'sepia(18%) saturate(1.3) contrast(1.06) brightness(1.03)',
  },
  { id: 'bw', name: 'B & W', css: 'grayscale(100%) contrast(1.2)' },
  {
    id: 'faded',
    name: 'Faded',
    css: 'brightness(1.15) contrast(0.8) saturate(0.6)',
  },
  {
    id: 'lomo',
    name: 'Lomo',
    css: 'contrast(1.5) saturate(1.45) brightness(0.85)',
  },
  {
    id: 'cool',
    name: 'Cool',
    css: 'hue-rotate(20deg) saturate(1.25) contrast(1.08) brightness(1.02)',
  },
  {
    id: 'warm',
    name: 'Warm',
    css: 'sepia(35%) saturate(1.5) brightness(1.08)',
  },
  {
    id: 'film',
    name: 'Film',
    css: 'sepia(25%) contrast(1.18) saturate(0.85) brightness(0.98)',
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    css: 'brightness(1.12) contrast(0.85) saturate(1.3)',
  },
] as const

type FilterId = (typeof FILTERS)[number]['id']

/* ─── Frame overlays ───────────────────────────────────── */
const FRAMES = [
  { id: 'none', name: 'Clean', emoji: '✦' },
  { id: 'film', name: 'Film', emoji: '🎞️' },
  { id: 'blush', name: 'Blush', emoji: '🌸' },
  { id: 'minimal', name: 'Minimal', emoji: '⬜' },
] as const

type FrameId = (typeof FRAMES)[number]['id']
type CameraError = null | 'denied' | 'unsupported' | 'error'

/* ─── FilterThumbnail ──────────────────────────────────── */
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

/* ─── Camera denied card ───────────────────────────────── */
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
          <p className="text-muted">③ Refresh the page</p>
        </div>

        <Button
          pill
          className="w-full"
          onClick={onRetry}
          icon={<RefreshCw className="h-4 w-4" />}
        >
          Refresh & Try Again
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
          Your browser doesn't support camera access. Try opening ClickStudio in
          Chrome or Safari.
        </p>
      </div>
    </div>
  )
}

/* ─── CameraPage ───────────────────────────────────────── */
export default function CameraPage() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [cameraError, setCameraError] = useState<CameraError>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterId>('none')
  const [selectedFrame, setSelectedFrame] = useState<FrameId>('none')

  const {
    cameraSettings,
    setCameraSettings,
    addPhoto,
    setCountdown: setCountdownState,
  } = usePhotoStore()
  const { success, error } = useToast()

  const showSuccess = useCallback(
    (t: string, d: string) => success(t, d),
    [success]
  )
  const showError = useCallback((t: string, d: string) => error(t, d), [error])

  const activeFilter = FILTERS.find(f => f.id === selectedFilter) ?? FILTERS[0]

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

  /* ── Shared camera start logic ── */
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
        if (DENIED_NAMES.includes(err?.name)) {
          setCameraError('denied')
        } else if (NO_DEVICE.includes(err?.name)) {
          setCameraError('unsupported')
        } else {
          setCameraError('error')
          showError('Camera error', 'Failed to start camera. Please try again.')
        }
      }
    },
    [cameraSettings, showSuccess, showError]
  )

  /* ── Retry without page reload ── */
  const retryCamera = useCallback(async () => {
    setCameraError(null)
    setIsStreaming(false)
    await cameraManager.stopCamera()
    await startCameraStream()
  }, [startCameraStream])

  /* ── Init camera on mount ── */
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

  const startCountdown = () => {
    if (!isStreaming || isCapturing) return
    setIsCapturing(true)
    setCountdown(cameraSettings.countdown)
    setCountdownState(true, cameraSettings.countdown)
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !isStreaming) return
    try {
      const photoDataUrl = cameraManager.capturePhoto(videoRef.current, {
        filterCss: activeFilter.css,
        frameId: selectedFrame,
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
        `${activeFilter.name} filter · ${FRAMES.find(f => f.id === selectedFrame)?.name} frame`
      )

      if (cameraSettings.flash) {
        const flash = document.createElement('div')
        flash.className = 'fixed inset-0 bg-white z-50 pointer-events-none'
        flash.style.animation = 'flash 0.35s ease-out forwards'
        document.body.appendChild(flash)
        setTimeout(() => document.body.removeChild(flash), 380)
      }
    } catch (err) {
      console.error(err)
      error('Capture failed', 'Please try again.')
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

  /* ── Frame overlay (CSS only, also baked into capture) ── */
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
    return null
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* ── Top controls bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-white/90 backdrop-blur-sm">
        {/* Left */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/templates')}
            icon={<ChevronLeft className="h-4 w-4" />}
            className="text-muted"
          >
            Frames
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
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setShowGrid(s => !s)
              setCameraSettings({ grid: !showGrid })
            }}
            className={cn(
              'h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all',
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
              'h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all',
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
        <div className="relative w-full max-w-3xl h-full max-h-[480px]">
          <div className="camera-viewport w-full h-full shadow-card border-2 border-border rounded-2xl overflow-hidden">
            {/* Live video */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{
                filter:
                  activeFilter.css === 'none' ? undefined : activeFilter.css,
              }}
              autoPlay
              playsInline
              muted
            />

            {/* Frame overlay */}
            <FrameOverlay />

            {/* Grid overlay */}
            {showGrid && isStreaming && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/20" />
                  ))}
                </div>
              </div>
            )}

            {/* Countdown overlay */}
            <AnimatePresence>
              {countdown > 0 && (
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30"
                >
                  <span className="font-display text-[8rem] text-white drop-shadow-2xl leading-none">
                    {countdown}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error states */}
            {!isStreaming && cameraError === 'denied' && (
              <CameraDeniedCard onRetry={retryCamera} />
            )}
            {!isStreaming && cameraError === 'unsupported' && (
              <CameraUnsupportedCard />
            )}

            {/* Generic loading spinner (only when no error) */}
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

            {/* Active filter badge */}
            {selectedFilter !== 'none' && isStreaming && (
              <div className="absolute top-3 right-3 z-20 bg-black/55 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {activeFilter.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom panel ── */}
      <div className="bg-white border-t border-border">
        {/* Frame selector */}
        <div className="flex items-center justify-center gap-2 px-4 py-2 border-b border-border/60">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted mr-1">
            Frame
          </span>
          {FRAMES.map(frame => (
            <button
              key={frame.id}
              onClick={() => setSelectedFrame(frame.id)}
              className={cn(
                'h-7 px-3 rounded-full text-xs font-medium border transition-all flex items-center gap-1',
                selectedFrame === frame.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-muted border-border hover:border-primary/40 hover:text-primary'
              )}
            >
              <span className="text-[11px]">{frame.emoji}</span>
              {frame.name}
            </button>
          ))}
        </div>

        {/* Filter label */}
        <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted pt-2.5 pb-1.5">
          Filter — <span className="text-primary">{activeFilter.name}</span>
        </p>

        {/* Filter grid — centered, wraps on narrow screens */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 px-4 pb-3">
          {FILTERS.map(filter => (
            <FilterThumbnail
              key={filter.id}
              filter={filter}
              selected={selectedFilter === filter.id}
              onClick={() => setSelectedFilter(filter.id)}
            />
          ))}
        </div>

        {/* Capture controls */}
        <div className="flex items-center justify-center gap-8 px-6 py-3 border-t border-border/60">
          {/* Timer chip */}
          <div className="flex items-center gap-1.5 text-xs text-muted bg-rose-50 border border-border rounded-full px-3 py-1.5 w-24 justify-center">
            <Timer className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            {cameraSettings.countdown}s timer
          </div>

          {/* Capture button */}
          <motion.button
            onClick={startCountdown}
            disabled={!isStreaming || isCapturing}
            whileHover={{ scale: isStreaming && !isCapturing ? 1.07 : 1 }}
            whileTap={{ scale: isStreaming && !isCapturing ? 0.93 : 1 }}
            className={cn(
              'relative h-16 w-16 rounded-full flex items-center justify-center',
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
          <div className="flex items-center gap-1.5 text-xs text-muted bg-rose-50 border border-border rounded-full px-3 py-1.5 w-24 justify-center">
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
    </div>
  )
}
