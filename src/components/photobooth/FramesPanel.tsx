import { cn } from '@/utils/cn'
import { FRAMES } from '@/constants/frames'

interface FramesPanelProps {
  value?: string
  onChange?: (frameId: string) => void
}

const getFramePreviewStyle = (frameId: string) => {
  switch (frameId) {
    case 'none':
      return { border: '2px solid #e5e7eb', borderRadius: '8px' }
    case 'film':
      return {
        border: '4px solid #1f2937',
        borderRadius: '4px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }
    case 'blush':
      return { border: '8px solid #fce7f3', borderRadius: '12px' }
    case 'minimal':
      return { border: '1px solid #d1d5db', borderRadius: '2px' }
    case 'polaroid':
      return {
        border: '12px solid #ffffff',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      }
    default:
      return { border: '2px solid #e5e7eb', borderRadius: '8px' }
  }
}

export const FramesPanel = ({ value = 'none', onChange }: FramesPanelProps) => {
  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Frame Style
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FRAMES.map(frame => {
          const [w, h] = frame.aspectRatio.split('/').map(Number)

          return (
            <button
              key={frame.id}
              onClick={() => onChange?.(frame.id)}
              className={cn(
                'relative p-3 rounded-xl border-2 transition-all group',
                value === frame.id
                  ? 'border-studio bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {/* Frame preview */}
              <div
                className="w-full bg-gray-100 flex items-center justify-center"
                style={{
                  aspectRatio: `${w}/${h}`,
                  minHeight: '60px',
                  ...getFramePreviewStyle(frame.id),
                }}
              >
                <span className="text-2xl">{frame.emoji}</span>
              </div>

              {/* Frame name */}
              <span
                className={cn(
                  'block text-xs font-medium mt-2 text-center',
                  value === frame.id ? 'text-studio' : 'text-gray-700'
                )}
              >
                {frame.name}
              </span>

              {/* Selected indicator */}
              {value === frame.id && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-studio rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
