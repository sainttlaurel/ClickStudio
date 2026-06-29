import { useState } from 'react'
import { Canvas } from './Canvas'
import { RightPanel } from './RightPanel'
import type { EditorTab } from './BottomTabs'
import type { PhotoAdjustments } from '@/types'

interface StickerData {
  id: string
  emoji: string
  x: number
  y: number
  scale?: number
  rotation?: number
}

interface TextData {
  id: string
  text: string
  color: string
  fontSize: number
  x: number
  y: number
  font?: string
}

interface EditScreenProps {
  imageUrl?: string | null
  adjustments: PhotoAdjustments
  onAdjustmentsChange: (val: PhotoAdjustments) => void
  activeFilter: string
  onFilterChange: (id: string) => void
  activeFrame: string
  onFrameChange: (id: string) => void
  placedStickers: StickerData[]
  onStickersChange: (stickers: StickerData[]) => void
  placedTexts: TextData[]
  onTextsChange: (texts: TextData[]) => void
}

export const EditScreen = ({ 
  imageUrl,
  adjustments,
  onAdjustmentsChange,
  activeFilter,
  onFilterChange,
  activeFrame,
  onFrameChange,
  placedStickers,
  onStickersChange,
  placedTexts,
  onTextsChange
}: EditScreenProps) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('adjust')

  const handleStickerAdd = (emoji: string) => {
    onStickersChange([...placedStickers, {
      id: `sticker-${Date.now()}`,
      emoji,
      x: 50 + Math.random() * 20 - 10,
      y: 50 + Math.random() * 20 - 10,
      scale: 1,
      rotation: 0
    }])
  }

  const handleTextAdd = (text: string, color: string, fontSize: number) => {
    onTextsChange([...placedTexts, {
      id: `text-${Date.now()}`,
      text,
      color,
      fontSize,
      x: 50,
      y: 50,
      font: 'sans-serif'
    }])
  }

  return (
    <div className="flex-1 flex">
      <Canvas 
        imageUrl={imageUrl} 
        isEditing 
        filterId={activeFilter}
        stickers={placedStickers}
        texts={placedTexts}
      />
      
      <RightPanel
        activeTab={activeTab}
        onTabChange={setActiveTab}
        adjustments={adjustments}
        onAdjustmentsChange={onAdjustmentsChange}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        activeFrame={activeFrame}
        onFrameChange={onFrameChange}
        onStickerAdd={handleStickerAdd}
        onTextAdd={handleTextAdd}
        placedStickers={placedStickers}
        placedTexts={placedTexts}
      />
    </div>
  )
}
