import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  Share2,
  Trash2,
  Camera,
  Cloud,
  Edit,
  RotateCcw,
  Loader2,
  ImageIcon,
  QrCode,
  Copy,
  Check,
} from 'lucide-react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'
import { composeStrip, downloadComposite } from '@/utils/compositor'

const LAYOUT_PHOTO_COUNTS: Record<string, number> = {
  single: 1,
  double: 2,
  quad: 4,
  six: 6,
}

export default function PreviewPage() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const {
    capturedPhotos,
    removePhoto,
    currentSession,
    saveSession,
    isSyncing,
  } = usePhotoStore()

  // ── Composite state ───────────────────────────────────────────────────────
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [polaroidCaption, setPolaroidCaption] = useState('')

  // ── QR code state ────────────────────────────────────────────────────────
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [showQrModal, setShowQrModal] = useState(false)
  const [isGeneratingQr, setIsGeneratingQr] = useState(false)
  const [copied, setCopied] = useState(false)

  // ── Individual photo retake panel ─────────────────────────────────────────
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const isPolaroid = currentSession?.template?.compositeStyle === 'polaroid'
  const layout = currentSession?.template?.layout ?? 'quad'
  const photosNeeded = LAYOUT_PHOTO_COUNTS[layout] ?? 4
  const photosHave = capturedPhotos.length
  const allDone = photosHave >= photosNeeded

  // Rebuild composite whenever photos or caption change
  useEffect(() => {
    if (!currentSession || capturedPhotos.length === 0) {
      setCompositeUrl(null)
      return
    }

    setIsComposing(true)
    composeStrip(capturedPhotos, currentSession.template, polaroidCaption)
      .then(url => setCompositeUrl(url))
      .catch(() => error('Render failed', 'Could not generate the composite'))
      .finally(() => setIsComposing(false))
  }, [capturedPhotos, currentSession, polaroidCaption])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleDownload = () => {
    if (!compositeUrl) return
    const style = currentSession?.template?.compositeStyle ?? 'strip'
    downloadComposite(compositeUrl, `clickstudio-${style}-${Date.now()}.png`)
    success('Downloaded! 🎉', 'Your photo strip has been saved to your device')
  }

  const handleShare = async () => {
    if (!compositeUrl) return
    try {
      const blob = await (await fetch(compositeUrl)).blob()
      const file = new File([blob], 'clickstudio-strip.png', {
        type: 'image/png',
      })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'ClickStudio', files: [file] })
      } else {
        handleDownload()
      }
    } catch {
      handleDownload()
    }
  }

  const handleSaveToCloud = async () => {
    try {
      await saveSession()
      success('Saved to cloud ☁️', 'Your session has been synced')
    } catch {
      error('Save failed', 'Could not save to cloud. Please try again.')
    }
  }

  const handleRetakePhoto = (index: number) => {
    const photo = capturedPhotos[index]
    if (!photo) return
    removePhoto(photo.id)
    navigate('/camera')
    success('Retake ready 📸', 'Photo removed — head back to capture a new one')
  }

  const handleDeletePhoto = (index: number) => {
    const photo = capturedPhotos[index]
    if (!photo) return
    removePhoto(photo.id)
    if (selectedPhoto !== null && selectedPhoto >= capturedPhotos.length - 1) {
      setSelectedPhoto(null)
    }
    success('Photo removed', 'Photo deleted from the session')
  }

  // ── QR Code handlers ──────────────────────────────────────────────────────

  const generateQrCode = async () => {
    if (!currentSession?.id) {
      error('No session', 'Save your session to the cloud first to generate a QR code')
      return
    }

    setIsGeneratingQr(true)
    try {
      // Ensure session is saved to cloud
      await saveSession()

      const shareUrl = `${window.location.origin}/share/${currentSession.id}`
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1C0B1A',
          light: '#FFFFFF',
        },
      })
      setQrCodeUrl(qrDataUrl)
      setShowQrModal(true)
    } catch {
      error('QR failed', 'Could not generate QR code')
    } finally {
      setIsGeneratingQr(false)
    }
  }

  const handleCopyLink = async () => {
    if (!currentSession?.id) return
    const shareUrl = `${window.location.origin}/share/${currentSession.id}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      success('Link copied!', 'Share link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      error('Copy failed', 'Could not copy link to clipboard')
    }
  }

  // ── Empty state ───────────────────────────────────────────────────────────

  if (capturedPhotos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm mx-auto px-4">
          <div className="h-24 w-24 rounded-full bg-white border border-border flex items-center justify-center mx-auto">
            <ImageIcon className="h-12 w-12 text-primary" />
          </div>
          <h2 className="font-display text-2xl text-text">No photos yet ♡</h2>
          <p className="text-muted text-sm">
            Head to the camera and capture your shots. Your composite strip will
            appear here.
          </p>
          <Button
            onClick={() => navigate('/camera')}
            icon={<Camera className="h-4 w-4" />}
          >
            Open Camera
          </Button>
        </div>
      </div>
    )
  }

  // ── Main layout ───────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-white flex-shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-text leading-none">
            Your result
          </h1>
          <p className="text-xs text-muted mt-0.5">
            {photosHave} of {photosNeeded} photo{photosNeeded > 1 ? 's' : ''}{' '}
            captured
            {currentSession?.template?.name
              ? ` · ${currentSession.template.name}`
              : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!allDone && (
            <Button
              size="sm"
              variant="outline"
              pill
              onClick={() => navigate('/camera')}
              icon={<Camera className="h-3.5 w-3.5" />}
            >
              Continue shooting
            </Button>
          )}
          <Button
            size="sm"
            pill
            onClick={handleDownload}
            disabled={!compositeUrl || isComposing}
            icon={
              isComposing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )
            }
          >
            Download Strip
          </Button>
        </div>
      </div>

      {/* ── Body: composite + sidebar ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Composite preview (main area) ── */}
        <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-auto bg-[#F9F0F4]/40 gap-4">
          {/* Not-all-done notice */}
          {!allDone && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2 text-sm text-muted shadow-sm"
            >
              <Camera className="h-4 w-4 text-primary flex-shrink-0" />
              <span>
                {photosNeeded - photosHave} more shot
                {photosNeeded - photosHave > 1 ? 's' : ''} needed — the
                composite updates live as you shoot.
              </span>
            </motion.div>
          )}

          {/* Composite image */}
          <div className="relative">
            {isComposing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-2xl">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
            {compositeUrl ? (
              <motion.img
                key={compositeUrl.slice(-16)} // re-animate on update
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={compositeUrl}
                alt="Photo strip composite"
                className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl object-contain"
                style={{ maxWidth: '100%' }}
              />
            ) : (
              <div className="w-64 h-64 rounded-2xl bg-white border border-border flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
          </div>

          {/* Polaroid caption input */}
          {isPolaroid && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm"
            >
              <label className="block text-xs text-muted text-center mb-1.5">
                Polaroid caption — appears in the white strip ✦
              </label>
              <input
                type="text"
                value={polaroidCaption}
                onChange={e => setPolaroidCaption(e.target.value)}
                placeholder="e.g. summer '25, bestie era …"
                maxLength={40}
                className={cn(
                  'w-full text-center rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text',
                  'placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40',
                  'font-[Dancing_Script,cursive] italic'
                )}
              />
            </motion.div>
          )}
        </div>

        {/* ── Sidebar: actions + retake strip ── */}
        <div className="w-72 border-l border-border bg-white flex flex-col overflow-hidden flex-shrink-0">
          {/* Actions */}
          <div className="p-5 border-b border-border space-y-2.5">
            <h3 className="font-display text-base text-text mb-3">Actions</h3>

            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={!compositeUrl || isComposing}
              icon={<Download className="h-4 w-4" />}
              className="w-full justify-start"
            >
              Download Strip
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              disabled={!compositeUrl}
              icon={<Share2 className="h-4 w-4" />}
              className="w-full justify-start"
            >
              Share
            </Button>

            <Button
              variant="outline"
              onClick={generateQrCode}
              disabled={isGeneratingQr || !currentSession?.id}
              icon={
                isGeneratingQr ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4" />
                )
              }
              className="w-full justify-start"
            >
              QR Code
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveToCloud}
              disabled={isSyncing}
              loading={isSyncing}
              icon={<Cloud className="h-4 w-4" />}
              className="w-full justify-start"
            >
              {isSyncing ? 'Saving…' : 'Save to Cloud'}
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate('/camera')}
              icon={<Camera className="h-4 w-4" />}
              className="w-full justify-start text-muted"
            >
              Back to Camera
            </Button>
          </div>

          {/* Individual photo retake strip */}
          <div className="flex-1 overflow-auto p-5">
            <h3 className="font-display text-base text-text mb-3 flex items-center justify-between">
              Photos
              <span className="text-xs text-muted font-normal">
                {photosHave}/{photosNeeded}
              </span>
            </h3>

            <div className="space-y-2">
              {/* Filled slots */}
              {capturedPhotos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    'relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                    selectedPhoto === i
                      ? 'border-primary'
                      : 'border-border hover:border-primary/40'
                  )}
                  onClick={() =>
                    setSelectedPhoto(selectedPhoto === i ? null : i)
                  }
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-20 object-cover"
                  />

                  {/* Photo number */}
                  <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                    {i + 1}
                  </div>

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        navigate('/editor', { state: { photoId: photo.id } })
                      }}
                      className="bg-white/90 hover:bg-white rounded-lg p-1.5 transition-colors"
                      title="Edit this photo"
                    >
                      <Edit className="h-3.5 w-3.5 text-text" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleRetakePhoto(i)
                      }}
                      className="bg-white/90 hover:bg-white rounded-lg p-1.5 transition-colors"
                      title="Retake this shot"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-primary" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleDeletePhoto(i)
                      }}
                      className="bg-white/90 hover:bg-white rounded-lg p-1.5 transition-colors"
                      title="Delete this photo"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Empty slots */}
              {Array.from({
                length: Math.max(0, photosNeeded - photosHave),
              }).map((_, i) => (
                <motion.button
                  key={`empty-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (photosHave + i) * 0.04 }}
                  onClick={() => navigate('/camera')}
                  className={cn(
                    'w-full h-20 rounded-xl border-2 border-dashed border-border',
                    'flex flex-col items-center justify-center gap-1 text-muted',
                    'hover:border-primary/40 hover:text-primary hover:bg-rose-50/50 transition-all'
                  )}
                >
                  <Camera className="h-4 w-4" />
                  <span className="text-[10px]">Shot {photosHave + i + 1}</span>
                </motion.button>
              ))}
            </div>

            {/* Expanded individual photo view */}
            <AnimatePresence>
              {selectedPhoto !== null && capturedPhotos[selectedPhoto] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden"
                >
                  <img
                    src={capturedPhotos[selectedPhoto].url}
                    alt={`Photo ${selectedPhoto + 1} full`}
                    className="w-full rounded-xl shadow-md"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        navigate('/editor', {
                          state: { photoId: capturedPhotos[selectedPhoto!].id },
                        })
                      }
                      icon={<Edit className="h-3 w-3" />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleRetakePhoto(selectedPhoto!)}
                      icon={<RotateCcw className="h-3 w-3" />}
                    >
                      Retake
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Session info footer */}
          {currentSession && (
            <div className="px-5 py-3 border-t border-border text-xs text-muted space-y-0.5">
              <div className="flex justify-between">
                <span>Template</span>
                <span className="text-text">
                  {currentSession.template.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Style</span>
                <span className="text-text capitalize">
                  {currentSession.template.compositeStyle ?? 'Clean'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowQrModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-display text-xl text-text text-center mb-2">
                Scan to view strip
              </h3>
              <p className="text-muted text-sm text-center mb-4">
                Scan this QR code or copy the link to share your photo strip
              </p>

              {qrCodeUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48 rounded-xl border border-border"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="flex-1"
                  icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button
                  onClick={() => setShowQrModal(false)}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
