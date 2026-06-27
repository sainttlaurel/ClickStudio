import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Camera,
  Crown,
  Star,
  Layout as LayoutIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'
import type { Template } from '@/types'

// ── Classic Layouts — plain grid arrangements, no decorative framing ─────────
const classicTemplates: Template[] = [
  {
    id: 'single-square',
    name: 'Single Photo',
    preview: '',
    layout: 'single',
    aspectRatio: '1:1',
    compositeStyle: 'clean',
    description: '1 photo',
  },
  {
    id: 'double-vertical',
    name: 'Double Strip',
    preview: '',
    layout: 'double',
    aspectRatio: '2:3',
    compositeStyle: 'clean',
    description: '2 photos · vertical',
  },
  {
    id: 'quad-square',
    name: 'Four Cuts',
    preview: '',
    layout: 'quad',
    aspectRatio: '1:1',
    compositeStyle: 'clean',
    description: '4 photos · 2×2 grid',
  },
  {
    id: 'six-strip',
    name: 'Photo Strip',
    preview: '',
    layout: 'six',
    aspectRatio: '4:3',
    compositeStyle: 'clean',
    description: '6 photos · 3×2 grid',
  },
]

// ── Frame Templates — layouts with a pre-designed composite style ─────────────
const frameTemplates: Template[] = [
  {
    id: 'frame-polaroid-quad',
    name: 'Polaroid Memories',
    preview: '',
    layout: 'quad',
    aspectRatio: '1:1',
    compositeStyle: 'polaroid',
    description: '4 shots · polaroid borders',
  },
  {
    id: 'frame-film-double',
    name: 'Film Roll',
    preview: '',
    layout: 'double',
    aspectRatio: '2:3',
    compositeStyle: 'film',
    description: '2 shots · film strip look',
  },
  {
    id: 'frame-blush-quad',
    name: 'Blush Edit',
    preview: '',
    layout: 'quad',
    aspectRatio: '1:1',
    compositeStyle: 'blush',
    description: '4 shots · pink gradient',
  },
  {
    id: 'frame-minimal-single',
    name: 'Minimal Clean',
    preview: '',
    layout: 'single',
    aspectRatio: '1:1',
    compositeStyle: 'minimal',
    description: '1 shot · thin pink border',
  },
]

const photoCounts: Record<string, number> = {
  single: 1,
  double: 2,
  quad: 4,
  six: 6,
}

// Colour config per composite style
const styleConfig: Record<
  string,
  { bg: string; accent: string; cardBg: string; label: string; emoji: string }
> = {
  clean: {
    bg: 'bg-rose-50',
    accent: 'bg-white border border-rose-200',
    cardBg: 'bg-white',
    label: 'Clean',
    emoji: '🤍',
  },
  polaroid: {
    bg: 'bg-amber-50',
    accent: 'bg-white shadow-md',
    cardBg: 'bg-amber-50/60',
    label: 'Polaroid',
    emoji: '📷',
  },
  film: {
    bg: 'bg-gray-800',
    accent: 'bg-gray-700',
    cardBg: 'bg-gray-900/10',
    label: 'Film',
    emoji: '🎞️',
  },
  blush: {
    bg: 'bg-rose-100',
    accent: 'bg-rose-50 border border-rose-200',
    cardBg: 'bg-rose-50/60',
    label: 'Blush',
    emoji: '🌸',
  },
  minimal: {
    bg: 'bg-white',
    accent: 'bg-white border-2 border-rose-200',
    cardBg: 'bg-gray-50',
    label: 'Minimal',
    emoji: '◻️',
  },
}

// Mini layout preview grid (shared by both tabs)
function LayoutPreview({
  template,
  selected,
}: {
  template: Template
  selected: boolean
}) {
  const count = photoCounts[template.layout]
  const cfg = styleConfig[template.compositeStyle ?? 'clean']

  const gridClass = cn(
    'grid gap-1',
    template.layout === 'single' && 'grid-cols-1 w-16 h-16',
    template.layout === 'double' && 'grid-cols-1 grid-rows-2 w-12 h-24',
    template.layout === 'quad' && 'grid-cols-2 grid-rows-2 w-20 h-20',
    template.layout === 'six' && 'grid-cols-3 grid-rows-2 w-24 h-16'
  )

  return (
    <div
      className={cn(
        'w-full h-44 rounded-xl flex items-center justify-center mb-4 overflow-hidden transition-colors',
        cfg.bg,
        selected && 'ring-2 ring-primary/30'
      )}
    >
      <div className={gridClass}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-sm flex items-center justify-center transition-colors',
              cfg.accent,
              selected ? 'opacity-100' : 'opacity-70'
            )}
          >
            <Camera className="h-2 w-2 text-rose-400 opacity-60" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Reusable template card
function TemplateCard({
  template,
  isSelected,
  isPopular,
  onSelect,
}: {
  template: Template
  isSelected: boolean
  isPopular?: boolean
  onSelect: (t: Template) => void
}) {
  const count = photoCounts[template.layout]
  const cfg = styleConfig[template.compositeStyle ?? 'clean']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative cursor-pointer rounded-2xl border-2 transition-all duration-300 bg-white shadow-card flex-shrink-0',
        'hover:-translate-y-1 hover:shadow-polaroid',
        isSelected
          ? 'border-primary shadow-glow'
          : 'border-border hover:border-primary/40'
      )}
      style={{ width: 168 }}
      onClick={() => onSelect(template)}
    >
      {isPopular && (
        <div className="absolute -top-3 -right-2 z-10">
          <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Star className="h-2.5 w-2.5" />
            Popular
          </div>
        </div>
      )}

      <div className="p-4">
        <LayoutPreview template={template} selected={isSelected} />

        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-sm text-text">{template.name}</h3>
          <span className="text-base leading-none">{cfg.emoji}</span>
        </div>
        <p className="text-xs text-muted text-center">{template.description}</p>
        <p className="text-xs text-muted text-center">
          {count} photo{count > 1 ? 's' : ''}
        </p>

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-2 w-full bg-primary/10 border border-primary/20 rounded-lg py-1 text-center text-xs text-primary font-medium"
          >
            Selected ✦
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function TemplatesPage() {
  const navigate = useNavigate()
  const { success } = useToast()
  const { startNewSession, currentSession } = usePhotoStore()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    currentSession?.template ?? null
  )
  const [activeTab, setActiveTab] = useState<'frame' | 'classic'>('classic')
  const carouselRef = useRef<HTMLDivElement>(null)

  const templates = activeTab === 'frame' ? frameTemplates : classicTemplates

  const handleSelect = (template: Template) => {
    setSelectedTemplate(template)
    startNewSession(template)
    success(
      'Template selected ✨',
      `"${template.name}" · ${photoCounts[template.layout]} photo${photoCounts[template.layout] > 1 ? 's' : ''}`
    )
  }

  const handleStart = () => {
    if (selectedTemplate) navigate('/camera')
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />

      <div className="relative z-10 flex-1 overflow-auto">
        {/* ── Header ── */}
        <div className="text-center pt-12 pb-6 px-4">
          <p className="font-script text-primary text-base mb-1">Step 01</p>
          <h1 className="font-display text-4xl md:text-5xl text-text">
            Pick your{' '}
            <em className="font-script not-italic text-primary">look.</em>
          </h1>
          <p className="text-muted mt-3 text-sm max-w-xs mx-auto">
            Classic layouts for clean photo strips, or designer frame templates
            with built-in styling.
          </p>

          {/* Tab toggle */}
          <div className="mt-6 inline-flex items-center bg-white border border-border rounded-full p-1 shadow-soft">
            <button
              onClick={() => setActiveTab('classic')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all',
                activeTab === 'classic'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-primary'
              )}
            >
              Classic Layouts
            </button>
            <button
              onClick={() => setActiveTab('frame')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all',
                activeTab === 'frame'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-primary'
              )}
            >
              Frame Templates ✦
            </button>
          </div>
        </div>

        {/* ── Tab description ── */}
        <div className="text-center px-4 mb-2">
          {activeTab === 'classic' ? (
            <p className="text-xs text-muted">
              Simple, clean layouts. You choose the camera frame and filter
              during capture.
            </p>
          ) : (
            <p className="text-xs text-muted">
              Pre-designed styles — the composite output is automatically styled
              with the chosen frame.
            </p>
          )}
        </div>

        {/* ── Template carousel ── */}
        <div className="relative px-4 pb-8">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <button
              onClick={() =>
                carouselRef.current?.scrollBy({
                  left: -200,
                  behavior: 'smooth',
                })
              }
              className="h-10 w-10 rounded-full bg-white border border-border shadow-soft flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-all flex-shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={carouselRef}
              className="flex items-stretch gap-5 overflow-x-auto pb-4 max-w-3xl"
            >
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.07 }}
                >
                  <TemplateCard
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    isPopular={
                      template.layout === 'quad' ||
                      template.id === 'frame-polaroid-quad'
                    }
                    onSelect={handleSelect}
                  />
                </motion.div>
              ))}
            </div>

            <button
              onClick={() =>
                carouselRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
              }
              className="h-10 w-10 rounded-full bg-white border border-border shadow-soft flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-all flex-shrink-0"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelect(t)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  selectedTemplate?.id === t.id
                    ? 'w-5 bg-primary'
                    : 'w-1.5 bg-border hover:bg-secondary'
                )}
              />
            ))}
          </div>
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="flex justify-center gap-2 px-4 pb-8">
          {templates.map(t => {
            const count = photoCounts[t.layout]
            const cfg = styleConfig[t.compositeStyle ?? 'clean']
            return (
              <button
                key={t.id}
                onClick={() => handleSelect(t)}
                className={cn(
                  'w-14 rounded-xl border-2 overflow-hidden transition-all',
                  selectedTemplate?.id === t.id
                    ? 'border-primary shadow-sm'
                    : 'border-border opacity-60 hover:opacity-100'
                )}
              >
                <div
                  className={cn(
                    cfg.bg,
                    'flex items-center justify-center',
                    t.layout === 'double' || t.layout === 'six'
                      ? 'aspect-[1/2]'
                      : 'aspect-square'
                  )}
                >
                  <div
                    className={cn(
                      'w-3/4 h-3/4 grid gap-0.5',
                      t.layout === 'single' && 'grid-cols-1',
                      t.layout === 'double' && 'grid-cols-1 grid-rows-2',
                      t.layout === 'quad' && 'grid-cols-2 grid-rows-2',
                      t.layout === 'six' && 'grid-cols-3 grid-rows-2'
                    )}
                  >
                    {Array.from({ length: count }).map((_, i) => (
                      <div key={i} className="bg-rose-200/60 rounded-sm" />
                    ))}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── CTA ── */}
        <div className="flex justify-center pb-12">
          <Button
            size="lg"
            pill
            onClick={handleStart}
            disabled={!selectedTemplate}
            className="px-10 shadow-glow"
          >
            {selectedTemplate
              ? `Use "${selectedTemplate.name}" ✦`
              : 'Pick a template first'}
          </Button>
        </div>

        {/* ── Coming soon packs ── */}
        <div className="border-t border-border pt-12 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl text-text">
                More{' '}
                <em className="font-script not-italic text-primary">
                  coming soon.
                </em>
              </h2>
              <p className="text-muted mt-2 text-sm">
                Curated frame collections for every vibe
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  name: 'Coquette Collection',
                  count: '12 frames',
                  icon: Crown,
                  emoji: '🎀',
                },
                {
                  name: 'Y2K Party Pack',
                  count: '8 frames',
                  icon: Star,
                  emoji: '⭐',
                },
                {
                  name: 'Vintage Film',
                  count: '6 frames',
                  icon: LayoutIcon,
                  emoji: '📽️',
                },
              ].map((pack, i) => (
                <motion.div
                  key={pack.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-border shadow-card text-center hover:border-primary/30 hover:shadow-polaroid transition-all"
                >
                  <div className="text-3xl mb-3">{pack.emoji}</div>
                  <h3 className="font-semibold text-text mb-1">{pack.name}</h3>
                  <p className="text-xs text-muted mb-4">{pack.count}</p>
                  <Button variant="outline" size="sm" pill className="w-full">
                    Coming soon
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
