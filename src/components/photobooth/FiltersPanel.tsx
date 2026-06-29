import { cn } from '@/utils/cn'
import { FILTERS } from '@/constants/filters'

interface FiltersPanelProps {
  value?: string
  onChange?: (filterId: string) => void
}

export const FiltersPanel = ({ value = 'none', onChange }: FiltersPanelProps) => {
  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Filters
      </div>
      
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
            <div className={cn(
              'w-12 h-12 rounded-xl',
              filter.thumbColor,
              value === filter.id && 'ring-2 ring-studio'
            )} />
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
