import { useState } from 'react'
import { cn } from '@/utils/cn'

interface FramesPanelProps {
  value?: string
  onChange?: (frameId: string) => void
}

const FRAME_DISPLAY = [
  { id: 'none', name: 'None' },
  { id: 'classic', name: 'Classic' },
  { id: 'polaroid', name: 'Polaroid' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'neon', name: 'Neon' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'floral', name: 'Floral' },
  { id: 'stars', name: 'Stars' },
]

export const FramesPanel = ({ value = 'none', onChange }: FramesPanelProps) => {
  const [activeFrame, setActiveFrame] = useState(value)

  const handleFrameSelect = (frameId: string) => {
    setActiveFrame(frameId)
    onChange?.(frameId)
  }

  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Frame Style
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {FRAME_DISPLAY.map((frame) => (
          <button
            key={frame.id}
            onClick={() => handleFrameSelect(frame.id)}
            className={cn(
              'px-4 py-2 rounded-full border text-sm font-medium transition-all',
              activeFrame === frame.id 
                ? 'border-[#EC1A66] text-[#EC1A66] bg-pink-50' 
                : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            {frame.name}
          </button>
        ))}
      </div>
    </div>
  )
}
