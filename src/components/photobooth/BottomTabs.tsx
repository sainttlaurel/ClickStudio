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
  { key: 'adjust', label: 'Adjust', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg> },
  { key: 'filters', label: 'Filters', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
  { key: 'stickers', label: 'Stickers', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { key: 'text', label: 'Text', icon: <span className="text-xs font-bold">T</span> },
  { key: 'frames', label: 'Frames', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> }
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
              ? 'text-[#EC1A66] border-t-2 border-[#EC1A66]' 
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
