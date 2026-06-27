import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Save,
  Undo,
  RotateCw,
  Crop,
  Palette,
  Sliders,
  ArrowLeft,
  Sticker,
  Type,
  Trash2,
  RotateCcw,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'
import {
  STICKER_PACKS,
  TEXT_PRESETS,
  TEXT_COLORS,
} from '@/constants/stickers'
import type { PhotoAdjustments } from '@/types'

const defaultAdjustments: PhotoAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  shadows: 0,
  highlights: 0,
  temperature: 0,
  tint: 0,
}

interface PlacedSticker {
  id: string
  emoji: string
  x: number
  y: number
  size: number
  rotation: number
}

interface PlacedText {
  id: string
  text: string
  x: number
  y: number
  font: string
  style: string
  color: string
  size: number
}

export default function EditorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { success, error } = useToast()
  const { capturedPhotos, updatePhoto } = usePhotoStore()

  const photoId = location.state?.photoId
  const currentPhoto = capturedPhotos.find(p => p.id === photoId)

  const [adjustments, setAdjustments] = useState<PhotoAdjustments>(
    currentPhoto?.metadata?.adjustments || defaultAdjustments
  )
  const [activeTab, setActiveTab] = useState<
    'adjust' | 'filters' | 'crop' | 'stickers' | 'text'
  >('adjust')
  const [hasChanges, setHasChanges] = useState(false)

  // ── Sticker state ──────────────────────────────────────────────────────
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [selectedStickerPack, setSelectedStickerPack] = useState(0)
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [draggingSticker, setDraggingSticker] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // ── Text state ─────────────────────────────────────────────────────────
  const [placedTexts, setPlacedTexts] = useState<PlacedText[]>([])
  const [textInput, setTextInput] = useState('')
  const [textPreset, setTextPreset] = useState(0)
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [textSize, setTextSize] = useState(32)
  const [draggingText, setDraggingText] = useState<string | null>(null)

  // ── Store latest values in refs for drawImage ──────────────────────────
  const adjustmentsRef = useRef(adjustments)
  const stickersRef = useRef(placedStickers)
  const textsRef = useRef(placedTexts)

  useEffect(() => { adjustmentsRef.current = adjustments }, [adjustments])
  useEffect(() => { stickersRef.current = placedStickers }, [placedStickers])
  useEffect(() => { textsRef.current = placedTexts }, [placedTexts])

  // ── Draw image (reads from refs to avoid re-render loops) ──────────────
  const drawImage = () => {
    if (!currentPhoto || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // Apply adjustments
      const adj = adjustmentsRef.current
      ctx.filter = `
        brightness(${100 + adj.brightness}%)
        contrast(${100 + adj.contrast}%)
        saturate(${100 + adj.saturation}%)
        hue-rotate(${adj.temperature}deg)
      `
      ctx.drawImage(img, 0, 0)
      ctx.filter = 'none'

      // Draw stickers
      for (const sticker of stickersRef.current) {
        ctx.save()
        ctx.translate(sticker.x, sticker.y)
        ctx.rotate((sticker.rotation * Math.PI) / 180)
        ctx.font = `${sticker.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(sticker.emoji, 0, 0)
        ctx.restore()
      }

      // Draw texts
      for (const t of textsRef.current) {
        ctx.save()
        ctx.font = `${t.style} ${t.size}px "${t.font}"`
        ctx.fillStyle = t.color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(0,0,0,0.5)'
        ctx.shadowBlur = 4
        ctx.fillText(t.text, t.x, t.y)
        ctx.restore()
      }
    }
    img.src = currentPhoto.url
  }

  useEffect(() => {
    if (!currentPhoto) {
      navigate('/preview')
      return
    }
    drawImage()
  }, [currentPhoto]) // eslint-disable-line react-hooks/exhaustive-deps

  // Redraw when adjustments, stickers, or texts change
  useEffect(() => {
    drawImage()
  }, [adjustments, placedStickers, placedTexts]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdjustmentChange = (
    key: keyof PhotoAdjustments,
    value: number
  ) => {
    setAdjustments(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!currentPhoto || !canvasRef.current) return

    try {
      const canvas = canvasRef.current
      const editedImageUrl = canvas.toDataURL('image/png', 1.0)

      updatePhoto(currentPhoto.id, {
        url: editedImageUrl,
        metadata: {
          ...currentPhoto.metadata,
          width: currentPhoto.metadata?.width || canvas.width,
          height: currentPhoto.metadata?.height || canvas.height,
          size: editedImageUrl.length,
          format: 'png',
          adjustments,
        },
      })

      setHasChanges(false)
      success('Photo saved', 'Your edits have been applied to the photo')
    } catch {
      error('Save failed', 'Could not save photo edits')
    }
  }

  const handleReset = () => {
    setAdjustments(defaultAdjustments)
    setPlacedStickers([])
    setPlacedTexts([])
    setHasChanges(true)
  }

  // ── Sticker handlers ────────────────────────────────────────────────────
  const handleAddSticker = (emoji: string) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const newSticker: PlacedSticker = {
      id: `sticker-${Date.now()}`,
      emoji,
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: Math.min(canvas.width, canvas.height) * 0.1,
      rotation: 0,
    }
    setPlacedStickers(prev => [...prev, newSticker])
    setHasChanges(true)
    setSelectedSticker(emoji)
  }

  const handleStickerMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.stopPropagation()
    const sticker = placedStickers.find(s => s.id === stickerId)
    if (!sticker || !containerRef.current || !canvasRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const canvas = canvasRef.current
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    setDraggingSticker(stickerId)
    setDragOffset({
      x: (e.clientX - rect.left) * scaleX - sticker.x,
      y: (e.clientY - rect.top) * scaleY - sticker.y,
    })
    setHasChanges(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if ((!draggingSticker && !draggingText) || !containerRef.current || !canvasRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const canvas = canvasRef.current
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const newX = (e.clientX - rect.left) * scaleX - dragOffset.x
    const newY = (e.clientY - rect.top) * scaleY - dragOffset.y

    if (draggingSticker) {
      setPlacedStickers(prev =>
        prev.map(s =>
          s.id === draggingSticker ? { ...s, x: newX, y: newY } : s
        )
      )
    }
    if (draggingText) {
      setPlacedTexts(prev =>
        prev.map(t =>
          t.id === draggingText ? { ...t, x: newX, y: newY } : t
        )
      )
    }
  }

  const handleMouseUp = () => {
    setDraggingSticker(null)
    setDraggingText(null)
  }

  const handleDeleteSticker = (id: string) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== id))
    setHasChanges(true)
  }

  const handleRotateSticker = (id: string) => {
    setPlacedStickers(prev =>
      prev.map(s =>
        s.id === id ? { ...s, rotation: (s.rotation + 45) % 360 } : s
      )
    )
    setHasChanges(true)
  }

  const handleSizeSticker = (id: string, delta: number) => {
    setPlacedStickers(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, size: Math.max(16, Math.min(200, s.size + delta)) }
          : s
      )
    )
    setHasChanges(true)
  }

  // ── Text handlers ───────────────────────────────────────────────────────
  const handleAddText = () => {
    if (!textInput.trim() || !canvasRef.current) return
    const canvas = canvasRef.current
    const newText: PlacedText = {
      id: `text-${Date.now()}`,
      text: textInput.trim(),
      x: canvas.width / 2,
      y: canvas.height / 2,
      font: TEXT_PRESETS[textPreset].font,
      style: TEXT_PRESETS[textPreset].style,
      color: textColor,
      size: textSize,
    }
    setPlacedTexts(prev => [...prev, newText])
    setTextInput('')
    setHasChanges(true)
  }

  const handleTextMouseDown = (e: React.MouseEvent, textId: string) => {
    e.stopPropagation()
    const t = placedTexts.find(txt => txt.id === textId)
    if (!t || !containerRef.current || !canvasRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const canvas = canvasRef.current
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    setDraggingText(textId)
    setDragOffset({
      x: (e.clientX - rect.left) * scaleX - t.x,
      y: (e.clientY - rect.top) * scaleY - t.y,
    })
    setHasChanges(true)
  }

  const handleDeleteText = (id: string) => {
    setPlacedTexts(prev => prev.filter(t => t.id !== id))
    setHasChanges(true)
  }

  if (!currentPhoto) return null

  const adjustmentControls = [
    { key: 'brightness' as const, label: 'Brightness', min: -100, max: 100 },
    { key: 'contrast' as const, label: 'Contrast', min: -100, max: 100 },
    { key: 'saturation' as const, label: 'Saturation', min: -100, max: 100 },
    { key: 'exposure' as const, label: 'Exposure', min: -100, max: 100 },
    { key: 'shadows' as const, label: 'Shadows', min: -100, max: 100 },
    { key: 'highlights' as const, label: 'Highlights', min: -100, max: 100 },
    { key: 'temperature' as const, label: 'Temperature', min: -50, max: 50 },
    { key: 'tint' as const, label: 'Tint', min: -50, max: 50 },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/preview')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Preview
          </Button>
          <h1 className="font-display text-xl text-text">Edit your photo ✶</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            icon={<Undo className="h-4 w-4" />}
          >
            Reset
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges}
            icon={<Save className="h-4 w-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-6 bg-white overflow-auto"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative max-w-4xl w-full">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full rounded-xl shadow-2xl"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '70vh',
              }}
            />

            {/* Draggable sticker overlays */}
            {containerRef.current && canvasRef.current && placedStickers.map(sticker => {
              const rect = containerRef.current?.getBoundingClientRect()
              const canvas = canvasRef.current
              if (!rect || !canvas) return null
              const displayScaleX = rect.width / canvas.width
              const displayScaleY = rect.height / canvas.height
              const displayX = sticker.x * displayScaleX
              const displayY = sticker.y * displayScaleY
              const displaySize = Math.max(20, sticker.size * displayScaleX)

              return (
                <div
                  key={sticker.id}
                  className={cn(
                    'absolute cursor-move select-none group',
                    draggingSticker === sticker.id ? 'z-20' : 'z-10'
                  )}
                  style={{
                    left: displayX - displaySize / 2,
                    top: displayY - displaySize / 2,
                    fontSize: displaySize,
                    transform: `rotate(${sticker.rotation}deg)`,
                  }}
                  onMouseDown={e => handleStickerMouseDown(e, sticker.id)}
                >
                  <span className="pointer-events-none">{sticker.emoji}</span>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-1">
                    <button
                      onClick={e => { e.stopPropagation(); handleSizeSticker(sticker.id, -8) }}
                      className="bg-white/90 hover:bg-white rounded-md p-0.5 shadow-sm text-xs"
                    >
                      −
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleRotateSticker(sticker.id) }}
                      className="bg-white/90 hover:bg-white rounded-md p-0.5 shadow-sm text-xs"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleSizeSticker(sticker.id, 8) }}
                      className="bg-white/90 hover:bg-white rounded-md p-0.5 shadow-sm text-xs"
                    >
                      +
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteSticker(sticker.id) }}
                      className="bg-white/90 hover:bg-white rounded-md p-0.5 shadow-sm text-xs text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Draggable text overlays */}
            {containerRef.current && canvasRef.current && placedTexts.map(t => {
              const rect = containerRef.current?.getBoundingClientRect()
              const canvas = canvasRef.current
              if (!rect || !canvas) return null
              const displayScaleX = rect.width / canvas.width
              const displayScaleY = rect.height / canvas.height
              const displayX = t.x * displayScaleX
              const displayY = t.y * displayScaleY
              const displaySize = Math.max(12, t.size * displayScaleX)

              return (
                <div
                  key={t.id}
                  className={cn(
                    'absolute cursor-move select-none group whitespace-nowrap',
                    draggingText === t.id ? 'z-20' : 'z-10'
                  )}
                  style={{
                    left: displayX,
                    top: displayY,
                    transform: 'translate(-50%, -50%)',
                    fontSize: displaySize,
                    fontFamily: `"${t.font}", serif`,
                    fontStyle: t.style,
                    color: t.color,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  }}
                  onMouseDown={e => handleTextMouseDown(e, t.id)}
                >
                  <span className="pointer-events-none">{t.text}</span>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteText(t.id) }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white/90 hover:bg-white rounded-md p-0.5 shadow-sm text-xs text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-80 border-l border-border bg-white flex flex-col">
          <div className="flex bg-white border-b border-border flex-shrink-0">
            {[
              { key: 'adjust' as const, label: 'Adjust', icon: Sliders },
              { key: 'stickers' as const, label: 'Stickers', icon: Sticker },
              { key: 'text' as const, label: 'Text', icon: Type },
              { key: 'filters' as const, label: 'Filters', icon: Palette },
              { key: 'crop' as const, label: 'Crop', icon: Crop },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 py-3 text-xs font-medium',
                  'border-b-2 transition-colors',
                  activeTab === tab.key
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted hover:text-text'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-5">
            {activeTab === 'adjust' && (
              <div className="space-y-5">
                <h3 className="font-semibold text-text">Adjustments</h3>
                <div className="space-y-4">
                  {adjustmentControls.map(control => (
                    <Slider
                      key={control.key}
                      label={control.label}
                      value={adjustments[control.key]}
                      onChange={value =>
                        handleAdjustmentChange(control.key, value)
                      }
                      min={control.min}
                      max={control.max}
                      step={1}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                  icon={<Undo className="h-4 w-4" />}
                >
                  Reset All
                </Button>
              </div>
            )}

            {activeTab === 'stickers' && (
              <div className="space-y-5">
                <h3 className="font-semibold text-text">Stickers</h3>
                <div className="flex flex-wrap gap-2">
                  {STICKER_PACKS.map((pack, i) => (
                    <button
                      key={pack.name}
                      onClick={() => setSelectedStickerPack(i)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm border transition-all',
                        selectedStickerPack === i
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted hover:border-primary/40'
                      )}
                    >
                      {pack.emoji} {pack.name}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {STICKER_PACKS[selectedStickerPack].stickers.map(
                    (emoji, i) => (
                      <motion.button
                        key={`${emoji}-${i}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddSticker(emoji)}
                        className={cn(
                          'aspect-square rounded-xl border-2 text-2xl flex items-center justify-center transition-all',
                          selectedSticker === emoji
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40 bg-white hover:bg-rose-50'
                        )}
                      >
                        {emoji}
                      </motion.button>
                    )
                  )}
                </div>
                <p className="text-xs text-muted text-center">
                  Tap a sticker to add it. Drag to reposition.
                </p>
                {placedStickers.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-text">
                      Placed ({placedStickers.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {placedStickers.map(s => (
                        <div
                          key={s.id}
                          className="flex items-center gap-1 bg-rose-50 rounded-lg px-2 py-1 text-sm"
                        >
                          <span>{s.emoji}</span>
                          <button
                            onClick={() => handleDeleteSticker(s.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-5">
                <h3 className="font-semibold text-text">Text Overlay</h3>
                <div>
                  <input
                    type="text"
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    placeholder="Type your text..."
                    maxLength={40}
                    className="w-full rounded-xl border border-border bg-rose-50/50 px-4 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddText()
                    }}
                  />
                  <p className="text-xs text-muted text-right mt-1">
                    {textInput.length}/40
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-2">Font</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEXT_PRESETS.map((preset, i) => (
                      <button
                        key={preset.name}
                        onClick={() => setTextPreset(i)}
                        className={cn(
                          'px-3 py-2 rounded-xl border-2 text-sm transition-all',
                          textPreset === i
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-muted hover:border-primary/40'
                        )}
                        style={{
                          fontFamily: `"${preset.font}", serif`,
                          fontStyle: preset.style,
                        }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {TEXT_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 transition-all',
                          textColor === color
                            ? 'border-primary scale-110'
                            : 'border-border hover:border-primary/40'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-2">
                    Size: {textSize}px
                  </label>
                  <input
                    type="range"
                    min={12}
                    max={72}
                    value={textSize}
                    onChange={e => setTextSize(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <Button
                  onClick={handleAddText}
                  disabled={!textInput.trim()}
                  className="w-full"
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add Text
                </Button>
                {placedTexts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-text">
                      Placed ({placedTexts.length})
                    </h4>
                    <div className="space-y-1">
                      {placedTexts.map(t => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between bg-rose-50 rounded-lg px-3 py-2 text-sm"
                        >
                          <span
                            style={{
                              fontFamily: `"${t.font}", serif`,
                              fontStyle: t.style,
                              color: t.color,
                            }}
                          >
                            {t.text}
                          </span>
                          <button
                            onClick={() => handleDeleteText(t.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="space-y-5">
                <h3 className="font-semibold text-text">Filters</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Original', 'B&W', 'Vintage', 'Vibrant', 'Cool', 'Warm'].map(
                    filter => (
                      <motion.button
                        key={filter}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="aspect-square rounded-xl border-2 border-border hover:border-primary/30 bg-white hover:bg-rose-50 flex items-center justify-center text-sm font-medium transition-all"
                      >
                        {filter}
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            )}

            {activeTab === 'crop' && (
              <div className="space-y-5">
                <h3 className="font-semibold text-text">Crop & Rotate</h3>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={<RotateCw className="h-4 w-4" />}
                  >
                    Rotate 90°
                  </Button>
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Free', '1:1', '4:3', '16:9'].map(ratio => (
                        <Button
                          key={ratio}
                          variant="outline"
                          size="sm"
                          className="justify-center"
                        >
                          {ratio}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted">
            Size: {currentPhoto.metadata?.width}×{currentPhoto.metadata?.height}
          </div>
          <div className="flex items-center gap-4">
            {placedStickers.length > 0 && (
              <span className="text-muted">
                {placedStickers.length} sticker{placedStickers.length !== 1 ? 's' : ''}
              </span>
            )}
            {placedTexts.length > 0 && (
              <span className="text-muted">
                {placedTexts.length} text{placedTexts.length !== 1 ? 's' : ''}
              </span>
            )}
            {hasChanges && <div className="text-warning">Unsaved changes</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
