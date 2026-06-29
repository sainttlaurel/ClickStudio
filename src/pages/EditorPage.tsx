import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Save,
  Undo,
  Redo,
  Palette,
  Sliders,
  ArrowLeft,
  Sticker,
  Type,
  Trash2,
  RotateCcw,
  Plus,
  Layout,
  ZoomIn,
  ZoomOut,
  Maximize,
  Home,
  Image as ImageIcon,
  Pen,
  Settings,
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
import { FILTERS } from '@/constants/filters'
import { FRAMES } from '@/constants/frames'
import { bakeFrameOverlay } from '@/utils/frameOverlay'
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
  const canvasWrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { success, error } = useToast()
  const { capturedPhotos, updatePhoto } = usePhotoStore()

  const photoId = location.state?.photoId
  const currentPhoto = capturedPhotos.find(p => p.id === photoId)

  const [adjustments, setAdjustments] = useState<PhotoAdjustments>(
    currentPhoto?.metadata?.adjustments || defaultAdjustments
  )
  const [activeTab, setActiveTab] = useState<
    'adjust' | 'filters' | 'stickers' | 'text' | 'frame'
  >('adjust')

  const [hasChanges, setHasChanges] = useState(false)
  const [activeFilter, setActiveFilter] = useState('none')
  const [activeFrame, setActiveFrame] = useState('none')

  // â”€â”€ Sticker state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [selectedStickerPack, setSelectedStickerPack] = useState(0)
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [draggingSticker, setDraggingSticker] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // â”€â”€ Text state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [placedTexts, setPlacedTexts] = useState<PlacedText[]>([])
  const [textInput, setTextInput] = useState('')
  const [textPreset, setTextPreset] = useState(0)
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [textSize, setTextSize] = useState(32)
  const [draggingText, setDraggingText] = useState<string | null>(null)

  // â”€â”€ Polaroid caption state â”€â”€
  const [polaroidCaption, setPolaroidCaption] = useState('')
  const [polaroidCaptionFont, setPolaroidCaptionFont] = useState('Dancing Script')

  // â”€â”€ Undo / Redo history â”€â”€
  const [history, setHistory] = useState<Array<{
    adjustments: PhotoAdjustments
    stickers: PlacedSticker[]
    texts: PlacedText[]
    filter: string
    frame: string
  }>>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isUndoRedoRef = useRef(false)

  // Push to history when state changes (not during undo/redo)
  useEffect(() => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false
      return
    }
    if (!currentPhoto) return
    
    const state = {
      adjustments: { ...adjustments },
      stickers: placedStickers.map(s => ({ ...s })),
      texts: placedTexts.map(t => ({ ...t })),
      filter: activeFilter,
      frame: activeFrame,
    }
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(state)
      return newHistory.slice(-50) // Keep last 50 states
    })
    setHistoryIndex(prev => Math.min(prev + 1, 49))
  }, [adjustments, placedStickers, placedTexts, activeFilter, activeFrame])

  const undo = useCallback(() => {
    if (historyIndex <= 0) return
    const prevState = history[historyIndex - 1]
    isUndoRedoRef.current = true
    setAdjustments(prevState.adjustments)
    setPlacedStickers(prevState.stickers)
    setPlacedTexts(prevState.texts)
    setActiveFilter(prevState.filter)
    setActiveFrame(prevState.frame)
    setHistoryIndex(prev => prev - 1)
    setHasChanges(true)
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return
    const nextState = history[historyIndex + 1]
    isUndoRedoRef.current = true
    setAdjustments(nextState.adjustments)
    setPlacedStickers(nextState.stickers)
    setPlacedTexts(nextState.texts)
    setActiveFilter(nextState.filter)
    setActiveFrame(nextState.frame)
    setHistoryIndex(prev => prev + 1)
    setHasChanges(true)
  }, [history, historyIndex])

  // â”€â”€ Zoom state â”€â”€
  const [zoom, setZoom] = useState(100)


  // â”€â”€ Store latest values in refs for drawImage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const adjustmentsRef = useRef(adjustments)
  const stickersRef = useRef(placedStickers)
  const textsRef = useRef(placedTexts)
  const filterRef = useRef(activeFilter)
  const frameRef = useRef(activeFrame)
  const polaroidCaptionRef = useRef(polaroidCaption)
  const polaroidCaptionFontRef = useRef(polaroidCaptionFont)

  useEffect(() => { adjustmentsRef.current = adjustments }, [adjustments])
  useEffect(() => { stickersRef.current = placedStickers }, [placedStickers])
  useEffect(() => { textsRef.current = placedTexts }, [placedTexts])
  useEffect(() => { filterRef.current = activeFilter }, [activeFilter])
  useEffect(() => { frameRef.current = activeFrame }, [activeFrame])
  useEffect(() => { polaroidCaptionRef.current = polaroidCaption }, [polaroidCaption])
  useEffect(() => { polaroidCaptionFontRef.current = polaroidCaptionFont }, [polaroidCaptionFont])

  // â”€â”€ Draw image (reads from refs to avoid re-render loops) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const drawImage = useCallback(() => {
    if (!currentPhoto || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // Build filter string: active filter + adjustments
      const filterDef = FILTERS.find(f => f.id === filterRef.current)
      const filterCss = filterDef && filterDef.id !== 'none' ? filterDef.css : 'none'

      const adj = adjustmentsRef.current
      const adjustmentFilter = `
        brightness(${100 + adj.brightness}%)
        contrast(${100 + adj.contrast}%)
        saturate(${100 + adj.saturation}%)
        hue-rotate(${adj.temperature}deg)
      `.trim()

      // Combine filter + adjustments
      const combinedFilter =
        filterCss === 'none'
          ? adjustmentFilter
          : `${filterCss} ${adjustmentFilter}`

      ctx.filter = combinedFilter || 'none'
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

      // Draw frame overlay
      bakeFrameOverlay(ctx, img.width, img.height, frameRef.current, polaroidCaptionRef.current)
    }
    img.src = currentPhoto.url
  }, [currentPhoto])

  useEffect(() => {
    if (!currentPhoto) {
      navigate('/preview')
      return
    }
    drawImage()
  }, [currentPhoto, drawImage])

  // Redraw when adjustments, stickers, texts, filter, frame, or caption change
  useEffect(() => {
    drawImage()
  }, [adjustments, placedStickers, placedTexts, activeFilter, activeFrame, polaroidCaption, polaroidCaptionFont, drawImage])

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
      success('Photo saved', 'Taking you back to previewâ€¦')
      setTimeout(() => navigate('/preview'), 800)
    } catch {
      error('Save failed', 'Could not save photo edits')
    }
  }

  const handleReset = () => {
    setAdjustments(defaultAdjustments)
    setActiveFilter('none')
    setActiveFrame('none')
    setPlacedStickers([])
    setPlacedTexts([])
    setHasChanges(true)
  }

  // â”€â”€ Sticker handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSelectSticker = (emoji: string) => {
    // Toggle: if same sticker clicked, deselect; otherwise select for placement
    setSelectedSticker(prev => prev === emoji ? null : emoji)
  }

  const handleStickerMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.stopPropagation()
    const sticker = placedStickers.find(s => s.id === stickerId)
    if (!sticker || !canvasWrapperRef.current || !canvasRef.current) return

    const rect = canvasWrapperRef.current.getBoundingClientRect()
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
    if ((!draggingSticker && !draggingText) || !canvasWrapperRef.current || !canvasRef.current) return
    const rect = canvasWrapperRef.current.getBoundingClientRect()
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

  // â”€â”€ Touch handlers for mobile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const getTouchPos = (e: React.TouchEvent) => {
    if (!canvasWrapperRef.current || !canvasRef.current) return null
    const touch = e.touches[0] || e.changedTouches[0]
    if (!touch) return null
    const rect = canvasWrapperRef.current.getBoundingClientRect()
    const canvas = canvasRef.current
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
      scaleX,
      scaleY,
      rect,
    }
  }

  const handleTouchStart = (e: React.TouchEvent, stickerId: string) => {
    e.stopPropagation()
    const sticker = placedStickers.find(s => s.id === stickerId)
    const pos = getTouchPos(e)
    if (!sticker || !pos) return

    setDraggingSticker(stickerId)
    setDragOffset({
      x: pos.x - sticker.x,
      y: pos.y - sticker.y,
    })
    setHasChanges(true)
  }

  const handleTextTouchStart = (e: React.TouchEvent, textId: string) => {
    e.stopPropagation()
    const t = placedTexts.find(txt => txt.id === textId)
    const pos = getTouchPos(e)
    if (!t || !pos) return

    setDraggingText(textId)
    setDragOffset({
      x: pos.x - t.x,
      y: pos.y - t.y,
    })
    setHasChanges(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if ((!draggingSticker && !draggingText)) return
    const pos = getTouchPos(e)
    if (!pos) return

    const newX = pos.x - dragOffset.x
    const newY = pos.y - dragOffset.y

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

  const handleTouchEnd = () => {
    setDraggingSticker(null)
    setDraggingText(null)
  }

  // â”€â”€ Canvas click to place sticker at position â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!selectedSticker || !canvasWrapperRef.current || !canvasRef.current) return
    // Don't place if clicking on an overlay element
    if ((e.target as HTMLElement).closest('[data-sticker-overlay]')) return

    const rect = canvasWrapperRef.current.getBoundingClientRect()
    const canvas = canvasRef.current
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    const newSticker: PlacedSticker = {
      id: `sticker-${Date.now()}`,
      emoji: selectedSticker,
      x,
      y,
      size: Math.min(canvas.width, canvas.height) * 0.1,
      rotation: 0,
    }
    setPlacedStickers(prev => [...prev, newSticker])
    setHasChanges(true)
    // Keep selected so user can place multiple of the same sticker
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

  // â”€â”€ Text handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    if (!t || !canvasWrapperRef.current || !canvasRef.current) return

    const rect = canvasWrapperRef.current.getBoundingClientRect()
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

  const adjustmentGroups = [
    {
      label: 'Light',
      controls: [
        { key: 'brightness' as const, label: 'Brightness', min: -100, max: 100, icon: 'â˜€ï¸' },
        { key: 'exposure' as const, label: 'Exposure', min: -100, max: 100, icon: 'ðŸ“·' },
        { key: 'contrast' as const, label: 'Contrast', min: -100, max: 100, icon: 'â—' },
        { key: 'shadows' as const, label: 'Shadows', min: -100, max: 100, icon: 'ðŸŒ‘' },
        { key: 'highlights' as const, label: 'Highlights', min: -100, max: 100, icon: 'ðŸŒ•' },
      ],
    },
    {
      label: 'Color',
      controls: [
        { key: 'saturation' as const, label: 'Saturation', min: -100, max: 100, icon: 'ðŸŽ¨' },
        { key: 'temperature' as const, label: 'Temperature', min: -50, max: 50, icon: 'ðŸŒ¡ï¸' },
        { key: 'tint' as const, label: 'Tint', min: -50, max: 50, icon: 'ðŸ’œ' },
      ],
    },
  ]

  const editorTabs = [
    { key: 'adjust' as const, label: 'Adjust', icon: Sliders },
    { key: 'filters' as const, label: 'Filters', icon: Palette },
    { key: 'stickers' as const, label: 'Stickers', icon: Sticker },
    { key: 'text' as const, label: 'Text', icon: Type },
    { key: 'frame' as const, label: 'Frame', icon: Layout },
  ]

  return (
    <div className="h-full flex bg-[#faf8f6]">
      {/* ── Far-left icon sidebar ── */}
      <div className="hidden lg:flex flex-col items-center gap-3 py-4 px-1.5 w-12 bg-white border-r border-border flex-shrink-0">
        {[
          { icon: Home, label: 'Home', onClick: () => navigate('/') },
          { icon: ImageIcon, label: 'Photos', onClick: () => navigate('/preview') },
          { icon: Pen, label: 'Edit', onClick: () => {} },
          { icon: Settings, label: 'Settings', onClick: () => {} },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
              item.label === 'Edit'
                ? 'bg-primary/10 text-primary'
                : 'text-muted hover:text-primary hover:bg-rose-50'
            )}
            title={item.label}
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* ── Left panel: Photo + controls ── */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border">
        {/* Photo header */}
        {/* Photo header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-white/80 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/preview')} icon={<ArrowLeft className="h-3.5 w-3.5" />}>Preview</Button>
            <h1 className="font-display text-sm text-text">Edit photo âœ¶</h1>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted bg-rose-50 px-2 py-0.5 rounded-full">1 photo</span>
          </div>
        </div>

        {/* Canvas area */}
        <div ref={containerRef} className="flex-1 flex items-center justify-center p-3 bg-white overflow-auto min-h-0 relative" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          {/* Zoom controls */}
          <div className="absolute top-2 right-2 z-20 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-lg border border-border shadow-sm px-1.5 py-0.5">
            <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-0.5 rounded text-muted hover:text-primary hover:bg-rose-50 transition-colors" title="Zoom out"><ZoomOut className="h-3 w-3" /></button>
            <span className="text-[9px] font-medium text-text w-7 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(150, z + 25))} className="p-0.5 rounded text-muted hover:text-primary hover:bg-rose-50 transition-colors" title="Zoom in"><ZoomIn className="h-3 w-3" /></button>
            <div className="w-px h-3 bg-border mx-0.5" />
            <button onClick={() => setZoom(100)} className="p-0.5 rounded text-muted hover:text-primary hover:bg-rose-50 transition-colors" title="Fit"><Maximize className="h-3 w-3" /></button>
          </div>

          <div ref={canvasWrapperRef} className="relative max-w-3xl w-full" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}>
            <canvas ref={canvasRef} className={cn('max-w-full rounded-xl shadow-2xl block max-h-[55vh] lg:max-h-[60vh] transition-all duration-300', hasChanges && 'ring-2 ring-primary/30')} style={{ width: 'auto', height: 'auto', maxWidth: '100%', cursor: selectedSticker ? 'crosshair' : 'default' }} onClick={handleCanvasClick} />

            {placedStickers.map(sticker => {
              const wrapper = canvasWrapperRef.current
              const canvas = canvasRef.current
              if (!wrapper || !canvas) return null
              const rect = wrapper.getBoundingClientRect()
              const dsx = rect.width / canvas.width
              const dsy = rect.height / canvas.height
              const dx = sticker.x * dsx
              const dy = sticker.y * dsy
              const ds = Math.max(20, sticker.size * dsx)
              return (
                <div key={sticker.id} data-sticker-overlay className={cn('absolute cursor-move select-none group', draggingSticker === sticker.id ? 'z-20' : 'z-10')} style={{ left: dx - ds / 2, top: dy - ds / 2, fontSize: ds, transform: `rotate(${sticker.rotation}deg)` }} onMouseDown={e => handleStickerMouseDown(e, sticker.id)} onTouchStart={e => handleTouchStart(e, sticker.id)}>
                  <span className="pointer-events-none">{sticker.emoji}</span>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-1">
                    <button onClick={e => { e.stopPropagation(); handleSizeSticker(sticker.id, -8) }} className="bg-white/90 hover:bg-white rounded-md p-0.5 shadow-sm text-xs">âˆ’</button>
                    <button onClick={e => { e.stopPropagation(); handleRotateSticker(sticker.id) }} className="bg-white/90 hover:bg-white rounded-md p-0.5 shadow-sm text-xs"><RotateCcw className="h-3 w-3" /></button>
                    <button onClick={e => { e.stopPropagation(); handleSizeSticker(sticker.id, 8) }} className="bg-white/90 hover:bg-white rounded-md p-0.5 shadow-sm text-xs">+</button>
                    <button onClick={e => { e.stopPropagation(); handleDeleteSticker(sticker.id) }} className="bg-white/90 hover:bg-white rounded-md p-0.5 shadow-sm text-xs text-red-500"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              )
            })}

            {placedTexts.map(t => {
              const wrapper = canvasWrapperRef.current
              const canvas = canvasRef.current
              if (!wrapper || !canvas) return null
              const rect = wrapper.getBoundingClientRect()
              const dsx = rect.width / canvas.width
              const dsy = rect.height / canvas.height
              const dx = t.x * dsx
              const dy = t.y * dsy
              const ds = Math.max(12, t.size * dsx)
              return (
                <div key={t.id} data-sticker-overlay className={cn('absolute cursor-move select-none group whitespace-nowrap', draggingText === t.id ? 'z-20' : 'z-10')} style={{ left: dx, top: dy, transform: 'translate(-50%, -50%)', fontSize: ds, fontFamily: `"${t.font}", serif`, fontStyle: t.style, color: t.color, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }} onMouseDown={e => handleTextMouseDown(e, t.id)} onTouchStart={e => handleTextTouchStart(e, t.id)}>
                  <span className="pointer-events-none">{t.text}</span>
                  <button onClick={e => { e.stopPropagation(); handleDeleteText(t.id) }} className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white/90 hover:bg-white rounded-md p-0.5 shadow-sm text-xs text-red-500"><Trash2 className="h-3 w-3" /></button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Left panel tab bar */}
        <div className="flex border-t border-border bg-white flex-shrink-0">
          {editorTabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn('flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-all border-b-2', activeTab === tab.key ? 'text-primary border-primary bg-primary/5' : 'text-muted border-transparent hover:text-text hover:bg-rose-50')}>
              <tab.icon className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel: Editor content */}
      <div className="hidden lg:flex flex-col w-[420px] bg-white flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border flex-shrink-0">
          <div>{hasChanges && <span className="text-[10px] text-warning font-medium">Unsaved</span>}</div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0} icon={<Undo className="h-3.5 w-3.5" />} className="!px-2" />
            <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} icon={<Redo className="h-3.5 w-3.5" />} className="!px-2" />
            <Button variant="outline" size="sm" onClick={handleReset} icon={<RotateCcw className="h-3.5 w-3.5" />} className="!px-2.5">Reset</Button>
            <Button variant={hasChanges ? 'primary' : 'outline'} size="sm" onClick={handleSave} disabled={!hasChanges} icon={<Save className="h-3.5 w-3.5" />} className={hasChanges ? 'shadow-glow' : ''}>Save</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center">
          {activeTab === 'adjust' && (
            <div className="space-y-3">
              {adjustmentGroups.map(group => (
                <div key={group.label} className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">{group.label}</h4>
                  <div className="space-y-1.5">
                    {group.controls.map(control => (
                      <div key={control.key} className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-muted flex items-center gap-1.5"><span>{control.icon}</span>{control.label}</label>
                          <span className="text-xs text-text font-mono w-10 text-right">{adjustments[control.key] > 0 ? '+' : ''}{adjustments[control.key]}</span>
                        </div>
                        <Slider value={adjustments[control.key]} onChange={value => handleAdjustmentChange(control.key, value)} min={control.min} max={control.max} step={1} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={handleReset} className="w-full" icon={<RotateCcw className="h-4 w-4" />}>Reset All</Button>
            </div>
          )}

          {activeTab === 'filters' && (
            <div className="space-y-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {FILTERS.map(filter => (
                  <motion.button key={filter.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setActiveFilter(filter.id); setHasChanges(true) }} className={cn('flex-shrink-0 w-14 rounded-lg border-2 p-1 flex flex-col items-center gap-0.5 transition-all', activeFilter === filter.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/40 bg-white hover:bg-rose-50')}>
                    <div className="w-full aspect-square rounded overflow-hidden bg-gray-100" style={{ filter: filter.id === 'none' ? 'none' : filter.css }}>
                      <img src={currentPhoto.url} alt={filter.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={cn('text-[8px] font-medium leading-tight', activeFilter === filter.id ? 'text-primary' : 'text-muted')}>{filter.name}</span>
                  </motion.button>
                ))}
              </div>
              {activeFilter !== 'none' && <Button variant="outline" size="sm" onClick={() => { setActiveFilter('none'); setHasChanges(true) }} className="w-full" icon={<Undo className="h-3 w-3" />}>Remove Filter</Button>}
            </div>
          )}

          {activeTab === 'stickers' && (
            <div className="space-y-2">
              <h3 className="font-semibold text-text text-sm">Stickers</h3>
              <div className="flex flex-wrap gap-1.5">
                {STICKER_PACKS.map((pack, i) => (
                  <button key={pack.name} onClick={() => setSelectedStickerPack(i)} className={cn('px-2.5 py-1 rounded-full text-xs border transition-all', selectedStickerPack === i ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:border-primary/40')}>
                    {pack.emoji} {pack.name}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-10 gap-0.5">
                {STICKER_PACKS[selectedStickerPack].stickers.map((emoji, i) => (
                  <motion.button key={`${emoji}-${i}`} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => handleSelectSticker(emoji)} className={cn('aspect-square rounded-lg border-2 text-lg flex items-center justify-center transition-all', selectedSticker === emoji ? 'border-primary bg-primary/10 ring-2 ring-primary/30 scale-110' : 'border-border hover:border-primary/40 bg-white hover:bg-rose-50')}>
                    {emoji}
                  </motion.button>
                ))}
              </div>
              <p className="text-[10px] text-muted text-center">{selectedSticker ? 'Tap sticker selected â€” click on the photo to place' : 'Tap a sticker, then click on the photo to place'}</p>
              {placedStickers.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-[10px] font-medium text-muted">Placed ({placedStickers.length})</h4>
                  <div className="flex flex-wrap gap-1">
                    {placedStickers.map(s => (
                      <div key={s.id} className="flex items-center gap-1 bg-rose-50 rounded-lg px-1.5 py-0.5 text-xs">
                        <span>{s.emoji}</span>
                        <button onClick={() => handleDeleteSticker(s.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-2.5 w-2.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Type your text..." maxLength={40} className="flex-1 rounded-xl border border-border bg-rose-50/50 px-3 py-2 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40" onKeyDown={e => { if (e.key === 'Enter') handleAddText() }} />
                <Button onClick={handleAddText} disabled={!textInput.trim()} size="sm" className="!px-4" icon={<Plus className="h-4 w-4" />}>Add</Button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] text-muted mb-1">Font</label>
                  <div className="flex gap-1">
                    {TEXT_PRESETS.map((preset, i) => (
                      <button key={preset.name} onClick={() => setTextPreset(i)} className={cn('flex-1 py-1 rounded-lg border text-[10px] transition-all', textPreset === i ? 'border-primary bg-primary/10 text-primary font-semibold' : 'border-border text-muted hover:border-primary/40')} style={{ fontFamily: `"${preset.font}", serif`, fontStyle: preset.style }}>
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-muted mb-1">Size</label>
                  <input type="range" min={12} max={72} value={textSize} onChange={e => setTextSize(Number(e.target.value))} className="w-16 accent-primary" />
                  <span className="text-[10px] text-muted text-center block">{textSize}px</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-muted mb-1">Color</label>
                <div className="flex flex-wrap gap-1">
                  {TEXT_COLORS.map(color => (
                    <button key={color} onClick={() => setTextColor(color)} className={cn('w-6 h-6 rounded-full border-2 transition-all', textColor === color ? 'border-primary scale-110 ring-1 ring-primary/30' : 'border-border hover:border-primary/40')} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              {placedTexts.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-[10px] font-medium text-muted">Placed ({placedTexts.length})</h4>
                  <div className="space-y-1">
                    {placedTexts.map(t => (
                      <div key={t.id} className="flex items-center justify-between bg-rose-50 rounded-lg px-2 py-1.5 text-xs">
                        <span style={{ fontFamily: `"${t.font}", serif`, fontStyle: t.style, color: t.color }}>{t.text}</span>
                        <button onClick={() => handleDeleteText(t.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'frame' && (
            <div className="space-y-2">
              <h3 className="font-semibold text-text text-sm">Frame Overlay</h3>
              <div className="grid grid-cols-3 gap-2">
                {FRAMES.map(frame => (
                  <button key={frame.id} onClick={() => { setActiveFrame(frame.id); setHasChanges(true) }} onMouseEnter={() => { if (frame.id !== 'none') setActiveFrame(frame.id) }} onMouseLeave={() => { if (frame.id !== 'none') setActiveFrame('none') }} className={cn('flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all', activeFrame === frame.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/40 bg-white hover:bg-rose-50')}>
                    <span className="text-xl">{frame.emoji}</span>
                    <span className={cn('text-[11px] font-medium', activeFrame === frame.id ? 'text-primary' : 'text-muted')}>{frame.name}</span>
                  </button>
                ))}
              </div>
              {activeFrame !== 'none' && <Button variant="outline" onClick={() => { setActiveFrame('none'); setHasChanges(true) }} className="w-full" icon={<Undo className="h-4 w-4" />}>Remove Frame</Button>}
              {(activeFrame === 'polaroid' || activeFrame === 'blush') && (
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="text-xs text-muted font-medium">Polaroid Caption</label>
                  <input type="text" value={polaroidCaption} onChange={e => { setPolaroidCaption(e.target.value); setHasChanges(true) }} placeholder="Add a caption..." maxLength={30} className="w-full rounded-xl border border-border bg-rose-50/50 px-3 py-2 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  <div className="flex gap-1">
                    {['Dancing Script', 'Inter', 'DM Serif Display'].map(font => (
                      <button key={font} onClick={() => { setPolaroidCaptionFont(font); setHasChanges(true) }} className={cn('flex-1 py-1 rounded-lg border text-[10px] transition-all', polaroidCaptionFont === font ? 'border-primary bg-primary/10 text-primary font-semibold' : 'border-border text-muted hover:border-primary/40')} style={{ fontFamily: `"${font}", serif` }}>
                        {font.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: full-width bottom panel */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-30">
        <div className="flex border-b border-border">
          {editorTabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn('flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-all border-b-2', activeTab === tab.key ? 'text-primary border-primary bg-primary/5' : 'text-muted border-transparent hover:text-text')}>
              <tab.icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="max-h-[40vh] overflow-y-auto p-3">
          {activeTab === 'adjust' && adjustmentGroups.map(group => (
            <div key={group.label} className="space-y-2 mb-3">
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">{group.label}</h4>
              {group.controls.map(control => (
                <div key={control.key} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted flex items-center gap-1.5"><span>{control.icon}</span>{control.label}</label>
                    <span className="text-xs text-text font-mono w-10 text-right">{adjustments[control.key] > 0 ? '+' : ''}{adjustments[control.key]}</span>
                  </div>
                  <Slider value={adjustments[control.key]} onChange={value => handleAdjustmentChange(control.key, value)} min={control.min} max={control.max} step={1} />
                </div>
              ))}
            </div>
          ))}
          {activeTab === 'filters' && <div className="flex gap-1.5 overflow-x-auto pb-1">{FILTERS.map(filter => (<motion.button key={filter.id} whileTap={{ scale: 0.95 }} onClick={() => { setActiveFilter(filter.id); setHasChanges(true) }} className={cn('flex-shrink-0 w-14 rounded-lg border-2 p-1 flex flex-col items-center gap-0.5', activeFilter === filter.id ? 'border-primary bg-primary/5' : 'border-border bg-white')}><div className="w-full aspect-square rounded overflow-hidden bg-gray-100" style={{ filter: filter.id === 'none' ? 'none' : filter.css }}><img src={currentPhoto.url} alt={filter.name} className="w-full h-full object-cover" /></div><span className="text-[8px] font-medium">{filter.name}</span></motion.button>))}</div>}
          {activeTab === 'stickers' && <div className="grid grid-cols-10 gap-0.5">{STICKER_PACKS[selectedStickerPack].stickers.map((emoji, i) => (<motion.button key={`${emoji}-${i}`} whileTap={{ scale: 0.9 }} onClick={() => handleSelectSticker(emoji)} className="aspect-square rounded-lg border-2 text-lg flex items-center justify-center border-border bg-white">{emoji}</motion.button>))}</div>}
          {activeTab === 'text' && <div className="flex gap-2"><input type="text" value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Type text..." className="flex-1 rounded-xl border border-border px-3 py-2 text-sm" onKeyDown={e => { if (e.key === 'Enter') handleAddText() }} /><Button onClick={handleAddText} disabled={!textInput.trim()} size="sm" icon={<Plus className="h-4 w-4" />}>Add</Button></div>}
          {activeTab === 'frame' && <div className="grid grid-cols-3 gap-2">{FRAMES.map(frame => (<button key={frame.id} onClick={() => { setActiveFrame(frame.id); setHasChanges(true) }} className={cn('flex flex-col items-center gap-1 p-2 rounded-xl border-2', activeFrame === frame.id ? 'border-primary bg-primary/5' : 'border-border bg-white')}><span className="text-xl">{frame.emoji}</span><span className="text-[11px] font-medium">{frame.name}</span></button>))}</div>}
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-border">
          <Button variant="ghost" size="sm" onClick={() => navigate('/preview')} icon={<ArrowLeft className="h-3.5 w-3.5" />}>Back</Button>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0} icon={<Undo className="h-3.5 w-3.5" />} className="!px-2" />
            <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} icon={<Redo className="h-3.5 w-3.5" />} className="!px-2" />
            <Button variant={hasChanges ? 'primary' : 'outline'} size="sm" onClick={handleSave} disabled={!hasChanges} icon={<Save className="h-3.5 w-3.5" />}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
