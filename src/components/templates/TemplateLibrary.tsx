import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Camera, Grid3X3, Heart } from 'lucide-react'
import { cn } from '@/utils/cn'
import { TEMPLATE_LIBRARY, TEMPLATE_CATEGORIES, photoCounts } from '@/constants/templates'
import type { TemplateLibraryItem } from '@/constants/templates'

interface TemplateLibraryProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (template: TemplateLibraryItem) => void
}

const badgeStyles: Record<string, string> = {
  new: 'bg-emerald-500/90 text-white',
  popular: 'bg-primary/90 text-white',
  trending: 'bg-amber-500/90 text-white',
  collab: 'bg-violet-500/90 text-white',
}

const styleConfig: Record<string, { bg: string }> = {
  clean: { bg: 'bg-rose-50' },
  polaroid: { bg: 'bg-amber-50' },
  film: { bg: 'bg-gray-800' },
  blush: { bg: 'bg-rose-100' },
  minimal: { bg: 'bg-white' },
}

export default function TemplateLibrary({ isOpen, onClose, onSelect }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'name'>('popular')

  const filtered = useMemo(() => {
    let list = TEMPLATE_LIBRARY

    if (activeCategory !== 'all') {
      list = list.filter(t => t.categories.includes(activeCategory))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case 'popular':
        list = [...list].sort((a, b) => {
          const aScore = (a.badge?.variant === 'popular' || a.badge?.variant === 'trending' ? 2 : a.badge ? 1 : 0)
          const bScore = (b.badge?.variant === 'popular' || b.badge?.variant === 'trending' ? 2 : b.badge ? 1 : 0)
          return bScore - aScore
        })
        break
      case 'newest':
        list = [...list].sort((a, b) => {
          const aScore = a.badge?.variant === 'new' ? 1 : 0
          const bScore = b.badge?.variant === 'new' ? 1 : 0
          return bScore - aScore
        })
        break
      case 'name':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return list
  }, [activeCategory, searchQuery, sortBy])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-4xl mx-auto my-6 md:my-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/30 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/30">
              <div>
                <h2 className="font-display text-xl text-text">Template Library</h2>
                <p className="text-sm text-muted/70 mt-0.5">Browse {TEMPLATE_LIBRARY.length} professionally designed layouts</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-rose-50 border border-border/40 flex items-center justify-center hover:bg-rose-100 transition-colors"
              >
                <X className="h-4 w-4 text-muted" />
              </button>
            </div>

            {/* ── Search + Sort ── */}
            <div className="flex items-center gap-3 px-6 pt-4 pb-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full h-10 pl-10 pr-4 rounded-2xl border border-border/50 bg-rose-50/30 text-sm text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                />
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="h-10 px-3 rounded-2xl border border-border/50 bg-rose-50/30 text-xs text-text font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="name">A–Z</option>
              </select>
            </div>

            {/* ── Category chips ── */}
            <div className="flex gap-2 px-6 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {TEMPLATE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all',
                    activeCategory === cat.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-muted border-border/50 hover:border-primary/40 hover:text-primary'
                  )}
                >
                  <span className="mr-1">{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* ── Grid ── */}
            <div className="flex-1 overflow-y-auto px-6 py-3">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3 opacity-40">🔍</div>
                  <p className="text-muted/70 text-sm">No templates found for "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((template, idx) => {
                    const count = photoCounts[template.layout]
                    const cfg = styleConfig[template.compositeStyle]
                    const isFav = favorites.has(template.id)

                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02, duration: 0.25 }}
                        className="group"
                      >
                        <div
                          onClick={() => onSelect(template)}
                          className={cn(
                            'relative bg-white rounded-2xl border border-border/50 overflow-hidden cursor-pointer',
                            'shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-8px_rgba(233,30,140,0.12)]',
                            'transition-all duration-300 hover:-translate-y-0.5'
                          )}
                        >
                          {/* Badge */}
                          {template.badge && (
                            <div className={cn(
                              'absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider',
                              badgeStyles[template.badge.variant]
                            )}>
                              {template.badge.label}
                            </div>
                          )}

                          {/* Favorite */}
                          <button
                            onClick={e => { e.stopPropagation(); toggleFavorite(template.id) }}
                            className={cn(
                              'absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all',
                              isFav
                                ? 'bg-primary/15 text-primary'
                                : 'bg-white/70 opacity-0 group-hover:opacity-100 text-muted/50 hover:text-primary'
                            )}
                          >
                            <Heart className={cn('h-3.5 w-3.5', isFav && 'fill-current')} />
                          </button>

                          {/* Preview */}
                          <div className={cn('h-28 flex items-center justify-center', cfg?.bg || 'bg-rose-50')}>
                            <div className="relative">
                              <span className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">{template.previewEmoji || '📸'}</span>
                              <div className={cn(
                                'grid gap-1 relative z-10',
                                template.layout === 'single' && 'grid-cols-1 w-12 h-12',
                                template.layout === 'double' && 'grid-cols-1 grid-rows-2 w-10 h-20',
                                template.layout === 'quad' && 'grid-cols-2 grid-rows-2 w-16 h-16',
                                template.layout === 'six' && 'grid-cols-3 grid-rows-2 w-20 h-14'
                              )}>
                                {Array.from({ length: count }).map((_, i) => (
                                  <div key={i} className="rounded-sm bg-white/90 border border-rose-200/50 shadow-sm flex items-center justify-center">
                                    <Camera className="h-2 w-2 text-rose-400/60" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-3">
                            <h3 className="font-display text-xs text-text">{template.name}</h3>
                            <p className="text-[10px] text-muted/60 mt-0.5 line-clamp-1">{template.description}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className="text-[9px] text-muted/40 bg-rose-50/50 border border-border/30 rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
                                <Grid3X3 className="h-2.5 w-2.5" />
                                {count}
                              </div>
                              <div className="text-[9px] text-muted/40 border border-border/30 rounded-md px-1.5 py-0.5">
                                {template.aspectRatio}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
