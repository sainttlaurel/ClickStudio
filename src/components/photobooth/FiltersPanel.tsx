import { useState } from 'react'
import { cn } from '@/utils/cn'
import { FILTERS } from '@/constants/filters'

interface FiltersPanelProps {
  value?: string
  onChange?: (filterId: string) => void
}

const FILTER_COLORS: Record<string, string> = {
  none: 'bg-pink-200',
  vintage: 'bg-amber-300',
  smooth: 'bg-blue-200',
  '70s': 'bg-orange-300',
  '80s': 'bg-purple-400',
  '90s:': 'bg-gray-300',
  bw: 'bg-gray-700',
  faded: 'bg-gray-300',
  lomo: 'bg-teal-300',
  cool: 'bg-blue-300',
  warm: 'bg-amber-300',
  film: 'bg-yellow-400',
  dreamy: 'bg-purple-200'
}

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
        {FILTERS.map((filter) => (
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
              FILTER_COLORS[filter.id] || 'bg-gray-200',
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
