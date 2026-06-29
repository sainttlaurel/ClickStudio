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
}

export const EditScreen = ({ imageUrl }: EditScreenProps) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('adjust')
  const [adjustments, setAdjustments] = useState<PhotoAdjustments>({
    brightness: 0, contrast: 0, saturation: 0,
    exposure: 0, shadows: 0, highlights: 0,
    temperature: 0, tint: 0
  })
  const [activeFilter, setActiveFilter] = useState('none')
  const [activeFrame, setActiveFrame] = useState('none')
  const [placedStickers, setPlacedStickers] = useState<StickerData[]>([])
  const [placedTexts, setPlacedTexts] = useState<TextData[]>([])

  const handleStickerAdd = (emoji: string) => {
    setPlacedStickers(prev => [...prev, {
      id: `sticker-${Date.now()}`,
      emoji,
      x: 50 + Math.random() * 20 - 10,
      y: 50 + Math.random() * 20 - 10,
      scale: 1,
      rotation: 0
    }])
  }

  const handleTextAdd = (text: string, color: string, fontSize: number) => {
    setPlacedTexts(prev => [...prev, {
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
        onAdjustmentsChange={setAdjustments}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeFrame={activeFrame}
        onFrameChange={setActiveFrame}
        onStickerAdd={handleStickerAdd}
        onTextAdd={handleTextAdd}
        placedStickers={placedStickers}
        placedTexts={placedTexts}
      />
    </div>
  )
}
