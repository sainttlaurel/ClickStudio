import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
import { FILTERS } from '@/constants/filters'
import { usePhotoStore } from '@/store/usePhotoStore'

interface FiltersPanelProps {
  value?: string
  onChange?: (filterId: string) => void
}

export const FiltersPanel = ({ value = 'none', onChange }: FiltersPanelProps) => {
  const { capturedPhotos } = usePhotoStore()
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate thumbnails when photos change
  useEffect(() => {
    if (capturedPhotos.length === 0 || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const latestPhoto = capturedPhotos[capturedPhotos.length - 1]
    const img = new Image()

    img.onload = () => {
      // Downsample to 64x64
      canvas.width = 64
      canvas.height = 64
      ctx.drawImage(img, 0, 0, 64, 64)

      const newThumbnails: Record<string, string> = {}

      FILTERS.forEach(filter => {
        // Apply filter CSS
        canvas.style.filter = filter.css
        newThumbnails[filter.id] = canvas.toDataURL('image/jpeg', 0.7)
      })

      // Reset filter
      canvas.style.filter = 'none'
      setThumbnails(newThumbnails)
    }

    img.src = latestPhoto.url
  }, [capturedPhotos])

  const hasPhoto = capturedPhotos.length > 0

  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Filters
      </div>

      {/* Hidden canvas for thumbnail generation */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-3 gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onChange?.(filter.id)}
            className={cn(
              'relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border-2',
              value === filter.id
                ? 'border-studio bg-pink-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            {hasPhoto && thumbnails[filter.id] ? (
              <img
                src={thumbnails[filter.id]}
                alt={filter.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className={cn(
                'w-12 h-12 rounded-lg',
                filter.thumbColor
              )} />
            )}
            <span className={cn(
              'text-xs font-medium',
              value === filter.id ? 'text-studio' : 'text-gray-600'
            )}>
              {filter.name}
            </span>

            {/* Selected checkmark */}
            {value === filter.id && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-studio rounded-full flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-white"
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
        ))}
      </div>
    </div>
  )
}
