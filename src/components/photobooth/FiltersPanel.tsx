import { useState } from 'react'
import { cn } from '@/utils/cn'

interface FiltersPanelProps {
  value?: string
  onChange?: (filterId: string) => void
}

const FILTER_DISPLAY = [
  { id: 'none', name: 'Original', color: 'bg-pink-200' },
  { id: 'vintage', name: 'Warm', color: 'bg-orange-300' },
  { id: 'cool', name: 'Cool', color: 'bg-blue-200' },
  { id: 'faded', name: 'Fade', color: 'bg-gray-300' },
  { id: 'lomo', name: 'Vivid', color: 'bg-purple-400' },
  { id: '80s', name: 'Matte', color: 'bg-amber-200' },
  { id: 'bw', name: 'Noir', color: 'bg-gray-800' },
  { id: 'film', name: 'Film', color: 'bg-yellow-400' },
  { id: 'smooth', name: 'Blush', color: 'bg-pink-100' },
  { id: 'dreamy', name: 'Mint', color: 'bg-teal-200' },
  { id: '70s', name: 'Dreamy', color: 'bg-purple-200' },
  { id: 'warm', name: 'Chrome', color: 'bg-gray-300' },
] as const

export const FiltersPanel = ({ value = 'none', onChange }: FiltersPanelProps) => {
  const [activeFilter, setActiveFilter] = useState(value)

  const handleFilterSelect = (filterId: string) => {
    setActiveFilter(filterId)
    onChange?.(filterId)
  }

  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Filters
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {FILTER_DISPLAY.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterSelect(filter.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-2 rounded-xl transition-all',
              activeFilter === filter.id 
                ? 'ring-2 ring-[#EC1A66] ring-offset-2' 
                : 'hover:bg-gray-50'
            )}
          >
            <div className={cn(
              'w-12 h-12 rounded-xl',
              filter.color,
              activeFilter === filter.id && 'ring-2 ring-[#EC1A66]'
            )} />
            <span className={cn(
              'text-xs',
              activeFilter === filter.id ? 'text-[#EC1A66] font-medium' : 'text-gray-500'
            )}>
              {filter.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
