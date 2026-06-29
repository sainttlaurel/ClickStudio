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
  onStickersChange: (stickers: StickerData[]) => void
  selectedStickerEmoji: string | null
  onStickerSelect: (emoji: string | null) => void
  onCanvasClick: (x: number, y: number) => void
  scale?: number
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
  onStickersChange,
  selectedStickerEmoji,
  onStickerSelect,
  onCanvasClick,
  scale = 1
}: EditScreenProps) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('adjust')
  const [pendingTextConfig, setPendingTextConfig] = useState<{ text: string; color: string; fontSize: number; font: string } | null>(null)

  const handleTextAdd = (text: string, color: string, fontSize: number, font?: string) => {
    setPendingTextConfig({ text, color, fontSize, font: font || 'sans-serif' })
    onStickerSelect(null)
  }

  const handleStickerSelect = (emoji: string) => {
    onStickerSelect(selectedStickerEmoji === emoji ? null : emoji)
    setPendingTextConfig(null)
  }

  const placementActive = !!(selectedStickerEmoji || pendingTextConfig)

  const handleCanvasClickWrapper = (x: number, y: number) => {
    if (pendingTextConfig) {
      onTextsChange([...placedTexts, {
        id: `text-${Date.now()}`,
        text: pendingTextConfig.text,
        color: pendingTextConfig.color,
        fontSize: pendingTextConfig.fontSize,
        font: pendingTextConfig.font,
        x, y
      }])
      setPendingTextConfig(null)
    } else if (selectedStickerEmoji) {
      onCanvasClick(x, y)
    }
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
        onClick={handleCanvasClickWrapper}
        placementActive={placementActive}
        scale={scale}
        onStickersUpdate={onStickersChange}
        onTextsUpdate={onTextsChange}
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
