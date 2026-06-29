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
  stickers?: StickerOverlay[]
  texts?: TextOverlay[]
  onClick?: (x: number, y: number) => void
  selectedStickerEmoji?: string | null
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
  stickers = [],
  texts = [],
  onClick,
  selectedStickerEmoji
}: CanvasProps) => {
  const filterCss = selectFilterCss(filterId)
  const canvasWidth = isEditing ? 208 : 300
  const canvasHeight = calcFrameHeight(canvasWidth, frameId)

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    onClick(x, y)
  }

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center">
      <div 
        className={cn(
          'relative rounded-2xl overflow-hidden shadow-lg',
          isEditing && 'border-2 border-dashed border-gray-300',
          isEditing && selectedStickerEmoji && 'cursor-crosshair'
        )}
        style={{ width: canvasWidth, height: canvasHeight }}
        onClick={handleCanvasClick}
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
            {stickers.map((sticker) => (
              <div
                key={sticker.id}
                className="absolute pointer-events-none select-none"
                style={{
                  left: `${sticker.x}%`,
                  top: `${sticker.y}%`,
                  transform: `translate(-50%, -50%) scale(${sticker.scale || 1}) rotate(${sticker.rotation || 0}deg)`,
                  fontSize: `${sticker.scale ? sticker.scale * 24 : 24}px`
                }}
              >
                {sticker.emoji}
              </div>
            ))}
            
            {/* Text overlays */}
            {texts.map((text) => (
              <div
                key={text.id}
                className="absolute pointer-events-none select-none"
                style={{
                  left: `${text.x}%`,
                  top: `${text.y}%`,
                  transform: 'translate(-50%, -50%)',
                  color: text.color,
                  fontSize: `${text.fontSize}px`,
                  fontFamily: text.font || 'sans-serif',
                  textShadow: ['#FFFFFF', '#FFD700', '#FF69B4', '#FFB6C1', '#FF4500', '#00FF00', '#4ECDC4'].includes(text.color) ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                {text.text}
              </div>
            ))}

            {/* Frame overlay */}
            <FrameOverlay frameId={frameId || 'none'} />
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
