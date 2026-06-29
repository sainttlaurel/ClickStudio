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
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Filters
      </div>

      {/* Hidden canvas for thumbnail generation */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-4 gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onChange?.(filter.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-2 rounded-xl transition-all',
              value === filter.id
                ? 'ring-2 ring-studio ring-offset-2'
                : 'hover:bg-gray-50'
            )}
          >
            {hasPhoto && thumbnails[filter.id] ? (
              <img
                src={thumbnails[filter.id]}
                alt={filter.name}
                className={cn(
                  'w-12 h-12 rounded-xl object-cover',
                  value === filter.id && 'ring-2 ring-studio'
                )}
              />
            ) : (
              <div className={cn(
                'w-12 h-12 rounded-xl',
                filter.thumbColor,
                value === filter.id && 'ring-2 ring-studio'
              )} />
            )}
            <span className={cn(
              'text-xs',
              value === filter.id ? 'text-studio font-medium' : 'text-gray-500'
            )}>
              {filter.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
