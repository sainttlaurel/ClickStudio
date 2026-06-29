import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Grid3X3, Heart, Eye, Sparkles, Check } from 'lucide-react'
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

function MiniWireframe({ layout }: { layout: string }) {
  const cell = 'bg-white border border-rose-200/60 shadow-sm'
  return (
    <div className="relative z-10">
      {layout === 'single' && (
        <div className={cn(cell, 'w-14 h-16 rounded-sm')} />
      )}
      {layout === 'double' && (
        <div className="flex flex-col gap-[3px]">
          <div className={cn(cell, 'w-14 h-8 rounded-sm')} />
          <div className={cn(cell, 'w-14 h-8 rounded-sm')} />
        </div>
      )}
      {layout === 'quad' && (
        <div className="grid grid-cols-2 gap-[3px]">
          <div className={cn(cell, 'w-8 h-10 rounded-sm')} />
          <div className={cn(cell, 'w-8 h-10 rounded-sm')} />
          <div className={cn(cell, 'w-8 h-10 rounded-sm')} />
          <div className={cn(cell, 'w-8 h-10 rounded-sm')} />
        </div>
      )}
      {layout === 'six' && (
        <div className="grid grid-cols-3 gap-[2px]">
          <div className={cn(cell, 'w-6 h-8 rounded-sm')} />
          <div className={cn(cell, 'w-6 h-8 rounded-sm')} />
          <div className={cn(cell, 'w-6 h-8 rounded-sm')} />
          <div className={cn(cell, 'w-6 h-8 rounded-sm')} />
          <div className={cn(cell, 'w-6 h-8 rounded-sm')} />
          <div className={cn(cell, 'w-6 h-8 rounded-sm')} />
        </div>
      )}
    </div>
  )
}

export default function TemplateLibrary({ isOpen, onClose, onSelect }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'name'>('popular')
  const [selectedId, setSelectedId] = useState<string | null>(null)

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

  const featured = useMemo(() =>
    TEMPLATE_LIBRARY.filter(t => t.badge?.variant === 'popular' || t.badge?.variant === 'trending').slice(0, 4),
    []
  )

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelect = (template: TemplateLibraryItem) => {
    setSelectedId(template.id)
    setTimeout(() => {
      onSelect(template)
      setSelectedId(null)
    }, 300)
  }

  const categoryLabel = activeCategory === 'all'
    ? `Showing all ${filtered.length} templates`
    : `Showing ${filtered.length} ${TEMPLATE_CATEGORIES.find(c => c.id === activeCategory)?.name || ''} templates`

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
            className="relative w-full max-w-4xl mx-auto my-6 md:my-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/30 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-border/30">
              <div>
                <h2 className="font-display text-2xl text-text flex items-center gap-2">
                  Template Library
                  <Sparkles className="h-5 w-5 text-primary/60" />
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)', opacity: 0.8 }}>
                  {TEMPLATE_LIBRARY.length} templates · Updated weekly ✨
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-border/30 flex items-center justify-center hover:bg-rose-50 hover:shadow-md hover:rotate-90 transition-all duration-300"
              >
                <X className="h-4 w-4 text-muted" />
              </button>
            </div>

            {/* ── Search + Sort ── */}
            <div className="flex items-center gap-3 px-8 pt-5 pb-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full h-[50px] pl-11 pr-4 rounded-2xl border border-rose-200 bg-white text-sm text-text placeholder:text-muted/40 focus:outline-none focus:ring-[3px] focus:ring-primary/15 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="h-[50px] px-4 rounded-2xl border border-rose-200 bg-white text-xs text-text font-medium focus:outline-none focus:ring-[3px] focus:ring-primary/15 focus:border-primary transition-all shadow-sm flex-shrink-0 appearance-none cursor-pointer"
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="name">A–Z</option>
              </select>
            </div>

            {/* ── Category chips ── */}
            <div className="px-8 pb-2">
              <div
                className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory py-1 pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
              >
                {TEMPLATE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'snap-start flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap',
                      activeCategory === cat.id
                        ? 'bg-primary text-white border-primary shadow-[0_4px_16px_-2px_rgba(233,30,140,0.35)] scale-[1.03]'
                        : 'bg-white text-muted border-border/50 hover:border-primary/40 hover:text-primary hover:shadow-sm'
                    )}
                  >
                    <span className="mr-1.5">{cat.emoji}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Result count ── */}
            <div className="px-8 pb-4">
              <p className="text-[11px] text-[#8f6878] font-medium">{categoryLabel}</p>
            </div>

            {/* ── Featured Section ── */}
            {activeCategory === 'all' && !searchQuery && featured.length > 0 && (
              <div className="px-8 pb-6">
                <h3 className="font-display text-sm text-text mb-3 flex items-center gap-1.5">
                  <span className="text-primary">🔥</span> Featured This Week
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {featured.map((template, idx) => {
                    const count = photoCounts[template.layout]
                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className="group cursor-pointer"
                        onClick={() => handleSelect(template)}
                      >
                        <div className={cn(
                          'relative rounded-xl border overflow-hidden transition-all duration-300',
                          'border-border/40 hover:border-primary hover:shadow-[0_8px_30px_-8px_rgba(233,30,140,0.2)]',
                          'hover:-translate-y-1'
                        )}>
                          <div className="h-24 flex items-center justify-center bg-rose-50">
                            <MiniWireframe layout={template.layout} />
                          </div>
                          <div className="bg-white p-2.5">
                            <p className="font-display text-[11px] text-text truncate">{template.name}</p>
                            <p className="text-[9px] text-[#8f6878]">{count} shots</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Grid ── */}
            <div className="flex-1 min-h-0 overflow-y-auto px-8 py-4">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3 opacity-40">🔍</div>
                  <p className="text-[#8f6878] text-sm">No templates found for "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs text-primary hover:underline font-medium"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                  {filtered.map((template, idx) => {
                    const count = photoCounts[template.layout]
                    const isFav = favorites.has(template.id)
                    const isSelected = selectedId === template.id

                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02, duration: 0.25 }}
                        className="group w-full"
                      >
                        <div
                          onClick={() => handleSelect(template)}
                          className={cn(
                            'relative bg-white rounded-2xl border overflow-hidden cursor-pointer',
                            'transition-all duration-300',
                            isSelected
                              ? 'border-primary shadow-[0_8px_30px_-8px_rgba(233,30,140,0.25)] scale-[1.02]'
                              : 'border-border/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_-12px_rgba(233,30,140,0.15)] hover:-translate-y-1.5 hover:border-primary/40'
                          )}
                        >
                          {/* Badge */}
                          {template.badge && (
                            <div className={cn(
                              'absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider',
                              badgeStyles[template.badge.variant]
                            )}>
                              {template.badge.label}
                            </div>
                          )}

                          {/* Favorite */}
                          <button
                            onClick={e => { e.stopPropagation(); toggleFavorite(template.id) }}
                            className={cn(
                              'absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all',
                              isFav
                                ? 'bg-primary/15 text-primary'
                                : 'bg-white/70 opacity-0 group-hover:opacity-100 text-[#8f6878] hover:text-primary'
                            )}
                          >
                            <Heart className={cn('h-3.5 w-3.5', isFav && 'fill-current')} />
                          </button>

                          {/* Preview */}
                          <div className="h-32 flex items-center justify-center bg-rose-50 transition-transform duration-300 group-hover:scale-[1.02]">
                            <MiniWireframe layout={template.layout} />
                          </div>

                          {/* Info */}
                          <div className="p-3.5">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0">
                                <h3 className="font-display text-xs text-text truncate">{template.name}</h3>
                                <p className="text-[10px] text-[#8f6878] mt-0.5 line-clamp-1">{template.description}</p>
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-1">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-2.5">
                              <div className="text-[9px] text-[#8f6878] bg-rose-50/50 border border-border/30 rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
                                <Grid3X3 className="h-2.5 w-2.5" />
                                {count}
                              </div>
                              <div className="text-[9px] text-[#8f6878] border border-border/30 rounded-md px-1.5 py-0.5">
                                {template.aspectRatio}
                              </div>
                            </div>
                          </div>

                          {/* Hover Quick Actions */}
                          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30">
                            <div className="bg-gradient-to-t from-white via-white/95 to-transparent pt-10 pb-3 px-3 flex items-center justify-center gap-2">
                              <button
                                onClick={e => { e.stopPropagation(); handleSelect(template) }}
                                className="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
                              >
                                Use Template
                              </button>
                              <button
                                onClick={e => e.stopPropagation()}
                                className="w-7 h-7 rounded-full bg-white border border-border/50 flex items-center justify-center text-[#8f6878] hover:text-primary hover:border-primary/40 transition-all shadow-sm"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
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
