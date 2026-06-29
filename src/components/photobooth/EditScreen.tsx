import { useState } from 'react'
import { Canvas } from './Canvas'
import { RightPanel } from './RightPanel'
import type { EditorTab } from './BottomTabs'
import type { Adjustments } from './AdjustPanel'

interface Sticker {
  id: string
  emoji: string
  x: number
  y: number
}

interface TextLayer {
  id: string
  text: string
  color: string
  fontSize: number
  x: number
  y: number
}

interface EditScreenProps {
  imageUrl?: string | null
}

export const EditScreen = ({ imageUrl }: EditScreenProps) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('adjust')
  const [adjustments, setAdjustments] = useState<Adjustments>({
    brightness: 50,
    contrast: 50,
    saturation: 50,
    sharpness: 50,
    warmth: 50,
    fade: 0
  })
  const [activeFilter, setActiveFilter] = useState('original')
  const [activeFrame, setActiveFrame] = useState('none')
  const [placedStickers, setPlacedStickers] = useState<Sticker[]>([])
  const [placedTexts, setPlacedTexts] = useState<TextLayer[]>([])

  const handleStickerAdd = (emoji: string) => {
    setPlacedStickers(prev => [...prev, {
      id: `sticker-${Date.now()}`,
      emoji,
      x: 50,
      y: 50
    }])
  }

  const handleTextAdd = (text: string, color: string, fontSize: number) => {
    setPlacedTexts(prev => [...prev, {
      id: `text-${Date.now()}`,
      text,
      color,
      fontSize,
      x: 50,
      y: 50
    }])
  }

  return (
    <div className="flex-1 flex">
      {/* Canvas */}
      <Canvas 
        imageUrl={imageUrl} 
        isEditing 
        hasStickers={activeTab === 'stickers' && placedStickers.length > 0}
      />
      
      {/* Right panel */}
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
