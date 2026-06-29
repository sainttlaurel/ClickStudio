import { useState } from 'react'
import { cn } from '@/utils/cn'
import { TEMPLATE_LIBRARY, TEMPLATE_CATEGORIES } from '@/constants/templates'
import type { TemplateLibraryItem } from '@/constants/templates'

interface TemplatePickerProps {
  open: boolean
  onClose: () => void
  onSelect: (template: TemplateLibraryItem) => void
}

const BADGE_VARIANTS: Record<string, string> = {
  new: 'bg-green-100 text-green-700',
  popular: 'bg-blue-100 text-blue-700',
  trending: 'bg-purple-100 text-purple-700',
  collab: 'bg-amber-100 text-amber-700',
}

export const TemplatePicker = ({ open, onClose, onSelect }: TemplatePickerProps) => {
  const [activeCategory, setActiveCategory] = useState('all')

  if (!open) return null

  const filtered = TEMPLATE_LIBRARY.filter(t => activeCategory === 'all' || t.categories.includes(activeCategory))

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Choose Template</h2>
            <p className="text-xs text-gray-400 mt-0.5">{TEMPLATE_LIBRARY.length} templates</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-all">
            <span className="text-lg leading-none">✕</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 px-5 py-3 overflow-x-auto scrollbar-none border-b border-gray-100 flex-shrink-0">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all flex-shrink-0',
                activeCategory === cat.id ? 'bg-studio text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-8">No templates in this category</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(template => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className="text-left p-3 rounded-xl border border-gray-200 hover:border-studio hover:bg-pink-50/30 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">{template.previewEmoji || '📸'}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{template.name}</div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5">{template.description}</div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{template.layout}</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{template.aspectRatio}</span>
                        {template.badge && (
                          <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', BADGE_VARIANTS[template.badge.variant] || 'bg-gray-100 text-gray-600')}>
                            {template.badge.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
