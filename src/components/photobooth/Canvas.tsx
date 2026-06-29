import { useState, useRef, useCallback } from 'react'
import { cn } from '@/utils/cn'
import { FILTERS } from '@/constants/filters'
import { calcFrameHeight } from '@/constants/frames'
import { FrameOverlay } from './FrameOverlay'

interface StickerOverlay {
  id: string
  emoji: string
  x: number
  y: number
  scale?: number
  rotation?: number
}

interface TextOverlay {
  id: string
  text: string
  color: string
  fontSize: number
  x: number
  y: number
  font?: string
}

interface CanvasProps {
  imageUrl?: string | null
  isEditing?: boolean
  filterId?: string
  frameId?: string
  frameImage?: string
  templateAspectRatio?: string
  stickers?: StickerOverlay[]
  texts?: TextOverlay[]
  onClick?: (x: number, y: number) => void
  placementActive?: boolean
  scale?: number
  onStickersUpdate?: (stickers: StickerOverlay[]) => void
  onTextsUpdate?: (texts: TextOverlay[]) => void
}

const selectFilterCss = (filterId: string): string => {
  const found = FILTERS.find(f => f.id === filterId)
  return found?.css || 'none'
}

export const Canvas = ({ 
  imageUrl, 
  isEditing = false, 
  filterId = 'none',
  frameId = 'none',
  frameImage,
  templateAspectRatio,
  stickers = [],
  texts = [],
  onClick,
  placementActive = false,
  scale = 1,
  onStickersUpdate,
  onTextsUpdate
}: CanvasProps) => {
  const filterCss = selectFilterCss(filterId)
  const baseWidth = isEditing ? 208 : 300
  const effectiveRatio = frameImage ? templateAspectRatio : undefined
  const baseHeight = calcFrameHeight(baseWidth, frameId, effectiveRatio)
  const canvasWidth = Math.round(baseWidth * scale)
  const canvasHeight = Math.round(baseHeight * scale)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragType, setDragType] = useState<'sticker' | 'text' | null>(null)

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick || dragId) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    onClick(x, y)
  }

  const handlePointerDown = useCallback((e: React.PointerEvent, type: 'sticker' | 'text', id: string) => {
    if (placementActive) return
    e.stopPropagation()
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    setDragId(id)
    setDragType(type)
  }, [placementActive])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragId || !containerRef.current || !dragType) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))

    if (dragType === 'sticker') {
      const updated = stickers.map(s => s.id === dragId ? { ...s, x: clampedX, y: clampedY } : s)
      onStickersUpdate?.(updated)
    } else {
      const updated = texts.map(t => t.id === dragId ? { ...t, x: clampedX, y: clampedY } : t)
      onTextsUpdate?.(updated)
    }
  }, [dragId, dragType, stickers, texts, onStickersUpdate, onTextsUpdate])

  const handlePointerUp = useCallback(() => {
    setDragId(null)
    setDragType(null)
  }, [])

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center overflow-auto">
      <div 
        ref={containerRef}
        className={cn(
          'relative rounded-2xl overflow-hidden shadow-lg flex-shrink-0',
          isEditing && 'border-2 border-dashed border-gray-300',
          isEditing && placementActive && 'cursor-crosshair'
        )}
        style={{ width: canvasWidth, height: canvasHeight }}
        onClick={handleCanvasClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt="Photo" 
              className="w-full h-full object-cover transition-all duration-300"
              style={{ filter: filterCss }}
            />
            
            {/* Sticker overlays */}
            <div className="absolute inset-0 overlay-layer">
              {stickers.map((sticker) => (
                <div
                  key={sticker.id}
                  className={cn(
                    'absolute select-none',
                    placementActive ? 'pointer-events-none' : 'cursor-grab',
                    dragId === sticker.id && 'cursor-grabbing'
                  )}
                  style={{
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    transform: `translate(-50%, -50%) scale(${sticker.scale || 1}) rotate(${sticker.rotation || 0}deg)`,
                    fontSize: `${sticker.scale ? sticker.scale * 24 : 24}px`
                  }}
                  onPointerDown={(e) => handlePointerDown(e, 'sticker', sticker.id)}
                >
                  {sticker.emoji}
                </div>
              ))}
            </div>
            
            {/* Text overlays */}
            <div className="absolute inset-0 overlay-layer">
              {texts.map((text) => (
                <div
                  key={text.id}
                  className={cn(
                    'absolute select-none',
                    placementActive ? 'pointer-events-none' : 'cursor-grab',
                    dragId === text.id && 'cursor-grabbing'
                  )}
                  style={{
                    left: `${text.x}%`,
                    top: `${text.y}%`,
                    transform: 'translate(-50%, -50%)',
                    color: text.color,
                    fontSize: `${text.fontSize}px`,
                    fontFamily: text.font || 'sans-serif',
                    textShadow: ['#FFFFFF', '#FFD700', '#FF69B4', '#FFB6C1', '#FF4500', '#00FF00', '#4ECDC4'].includes(text.color) ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
                  }}
                  onPointerDown={(e) => handlePointerDown(e, 'text', text.id)}
                >
                  {text.text}
                </div>
              ))}
            </div>

            {/* Frame overlay */}
            <FrameOverlay frameId={frameId || 'none'} frameImage={frameImage} />
          </>
        ) : (
          <div className="w-full h-full bg-[#0F172A] flex flex-col items-center justify-center">
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white/50 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-white/50 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-white/50 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-white/50 rounded-br-sm" />
            
            <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            
            <span className="text-white/50 text-sm">Camera will appear here</span>
          </div>
        )}
      </div>
    </div>
  )
}
