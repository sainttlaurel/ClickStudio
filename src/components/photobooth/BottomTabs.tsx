import { Sliders, Sparkles, Smile, Type, Grid } from 'lucide-react'
import { cn } from '@/utils/cn'

export type EditorTab = 'adjust' | 'filters' | 'stickers' | 'text' | 'frames'

interface BottomTabsProps {
  activeTab: EditorTab
  onTabChange: (tab: EditorTab) => void
}

const TABS: Array<{
  key: EditorTab
  label: string
  icon: React.ReactNode
}> = [
  { key: 'adjust', label: 'Adjust', icon: <Sliders className="w-4 h-4" /> },
  { key: 'filters', label: 'Filters', icon: <Sparkles className="w-4 h-4" /> },
  { key: 'stickers', label: 'Stickers', icon: <Smile className="w-4 h-4" /> },
  { key: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
  { key: 'frames', label: 'Frames', icon: <Grid className="w-4 h-4" /> },
]

export const BottomTabs = ({ activeTab, onTabChange }: BottomTabsProps) => {
  return (
    <div className="h-14 bg-white border-t border-gray-200 flex">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-0.5 transition-all',
            activeTab === tab.key 
              ? 'text-studio border-t-2 border-studio' 
              : 'text-gray-400 hover:text-gray-500'
          )}
        >
          {tab.icon}
          <span className={cn(
            'text-[10px] uppercase tracking-wider',
            activeTab === tab.key ? 'font-medium' : ''
          )}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}
