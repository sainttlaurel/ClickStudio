import { AdjustPanel } from './AdjustPanel'
import { FiltersPanel } from './FiltersPanel'
import { StickersPanel } from './StickersPanel'
import { TextPanel } from './TextPanel'
import { FramesPanel } from './FramesPanel'
import { BottomTabs, type EditorTab } from './BottomTabs'
import type { PhotoAdjustments } from '@/types'

interface RightPanelProps {
  activeTab: EditorTab
  onTabChange: (tab: EditorTab) => void
  adjustments: PhotoAdjustments
  onAdjustmentsChange: (val: PhotoAdjustments) => void
  activeFilter: string
  onFilterChange: (id: string) => void
  activeFrame: string
  onFrameChange: (id: string) => void
  selectedStickerEmoji?: string | null
  onStickerSelect: (emoji: string) => void
  onTextAdd: (text: string, color: string, fontSize: number, font?: string) => void
  placedStickers: Array<{ id: string; emoji: string; x: number; y: number }>
  placedTexts: Array<{ id: string; text: string; color: string; fontSize: number; x: number; y: number }>
}

export const RightPanel = ({
  activeTab,
  onTabChange,
  adjustments,
  onAdjustmentsChange,
  activeFilter,
  onFilterChange,
  activeFrame,
  onFrameChange,
  selectedStickerEmoji,
  onStickerSelect,
  onTextAdd,
  placedStickers,
  placedTexts
}: RightPanelProps) => {
  return (
    <div className="w-[240px] bg-white border-l border-gray-200 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'adjust' && (
          <AdjustPanel value={adjustments} onChange={onAdjustmentsChange} />
        )}
        {activeTab === 'filters' && (
          <FiltersPanel value={activeFilter} onChange={onFilterChange} />
        )}
        {activeTab === 'stickers' && (
          <StickersPanel onStickerAdd={onStickerSelect} placedStickers={placedStickers} selectedStickerEmoji={selectedStickerEmoji} />
        )}
        {activeTab === 'text' && (
          <TextPanel onTextAdd={onTextAdd} placedTexts={placedTexts} />
        )}
        {activeTab === 'frames' && (
          <FramesPanel value={activeFrame} onChange={onFrameChange} />
        )}
      </div>
      
      <BottomTabs activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
