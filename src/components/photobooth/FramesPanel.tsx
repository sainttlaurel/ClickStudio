import { cn } from '@/utils/cn'
import { FRAMES } from '@/constants/frames'

interface FramesPanelProps {
  value?: string
  onChange?: (frameId: string) => void
}

export const FramesPanel = ({ value = 'none', onChange }: FramesPanelProps) => {
  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Frame Style
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {FRAMES.map((frame) => (
          <button
            key={frame.id}
            onClick={() => onChange?.(frame.id)}
            className={cn(
              'px-4 py-2 rounded-full border text-sm font-medium transition-all',
              value === frame.id 
                ? 'border-studio text-studio bg-pink-50' 
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
