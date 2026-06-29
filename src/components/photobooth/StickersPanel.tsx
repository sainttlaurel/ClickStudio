import { useState } from 'react'
import { cn } from '@/utils/cn'
import { STICKER_PACKS, type StickerPack } from '@/constants/stickers'

interface StickersPanelProps {
  onStickerAdd?: (emoji: string) => void
  placedStickers?: Array<{ id: string; emoji: string; x: number; y: number }>
  selectedStickerEmoji?: string | null
}

export const StickersPanel = ({ onStickerAdd, placedStickers = [], selectedStickerEmoji = null }: StickersPanelProps) => {
  const [activePack, setActivePack] = useState<StickerPack>(STICKER_PACKS[0])

  const handleStickerClick = (emoji: string) => {
    onStickerAdd?.(emoji)
  }

  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Stickers
      </div>

      {/* Pack tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {STICKER_PACKS.map((pack) => (
          <button
            key={pack.name}
            onClick={() => setActivePack(pack)}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all flex-shrink-0',
              activePack.name === pack.name
                ? 'bg-studio text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            )}
          >
            <span>{pack.emoji}</span>
            <span>{pack.name}</span>
          </button>
        ))}
      </div>
      
      {/* Sticker grid for active pack */}
      <div className="grid grid-cols-4 gap-3">
        {activePack.stickers.map((emoji, i) => (
          <button
            key={`${emoji}-${i}`}
            onClick={() => handleStickerClick(emoji)}
            className={cn(
              'w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl transition-all',
              selectedStickerEmoji === emoji 
                ? 'border-studio bg-pink-50 scale-110' 
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
