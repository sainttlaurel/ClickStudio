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
  frameImage?: string
  placedStickers: StickerData[]
  placedTexts: TextData[]
  onTextsChange: (texts: TextData[]) => void
  selectedStickerEmoji: string | null
  onStickerSelect: (emoji: string | null) => void
  onCanvasClick: (x: number, y: number) => void
}

export const EditScreen = ({ 
  imageUrl,
  adjustments,
  onAdjustmentsChange,
  activeFilter,
  onFilterChange,
  activeFrame,
  onFrameChange,
  frameImage,
  placedStickers,
  placedTexts,
  onTextsChange,
  selectedStickerEmoji,
  onStickerSelect,
  onCanvasClick
}: EditScreenProps) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('adjust')

  const handleTextAdd = (text: string, color: string, fontSize: number, font?: string) => {
    onTextsChange([...placedTexts, {
      id: `text-${Date.now()}`,
      text,
      color,
      fontSize,
      x: 50,
      y: 50,
      font: font || 'sans-serif'
    }])
    onStickerSelect(null)
  }

  const handleStickerSelect = (emoji: string) => {
    onStickerSelect(selectedStickerEmoji === emoji ? null : emoji)
  }

  return (
    <div className="flex-1 flex">
      <Canvas 
        imageUrl={imageUrl} 
        isEditing 
        filterId={activeFilter}
        frameId={activeFrame}
        frameImage={frameImage}
        stickers={placedStickers}
        texts={placedTexts}
        onClick={(x, y) => { if (selectedStickerEmoji) { onCanvasClick(x, y) } }}
        selectedStickerEmoji={selectedStickerEmoji}
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
        onStickerSelect={handleStickerSelect}
        selectedStickerEmoji={selectedStickerEmoji}
        onTextAdd={handleTextAdd}
        placedStickers={placedStickers}
        placedTexts={placedTexts}
      />
    </div>
  )
}
