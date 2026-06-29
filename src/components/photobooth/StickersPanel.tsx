import { useState } from 'react'
import { cn } from '@/utils/cn'

interface StickersPanelProps {
  onStickerAdd?: (emoji: string) => void
  placedStickers?: Array<{ id: string; emoji: string; x: number; y: number }>
}

const SPEC_STICKERS = [
  '🌸', '⭐', '❤️', '✨',
  '🎀', '🌙', '🕶️', '🦋',
  '🌈', '💖', '🌺', '💎',
  '🎉', '🍀', '💥', '💕',
]

export const StickersPanel = ({ onStickerAdd, placedStickers = [] }: StickersPanelProps) => {
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)

  const handleStickerClick = (emoji: string) => {
    setSelectedSticker(emoji)
    onStickerAdd?.(emoji)
  }

  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Stickers
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {SPEC_STICKERS.map((emoji, i) => (
          <button
            key={`${emoji}-${i}`}
            onClick={() => handleStickerClick(emoji)}
            className={cn(
              'w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl transition-all',
              selectedSticker === emoji 
                ? 'border-[#EC1A66] bg-pink-50 scale-110' 
                : 'hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      {placedStickers.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Placed ({placedStickers.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {placedStickers.map((sticker) => (
              <div 
                key={sticker.id}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm"
              >
                {sticker.emoji}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
