import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Layout,
  Camera,
  Crown,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'
import type { Template } from '@/types'

const templates: Template[] = [
  {
    id: 'single-square',
    name: 'Single Photo',
    preview: '/templates/single.svg',
    layout: 'single',
    aspectRatio: '1:1',
  },
  {
    id: 'double-vertical',
    name: 'Double Strip',
    preview: '/templates/double.svg',
    layout: 'double',
    aspectRatio: '2:3',
  },
  {
    id: 'quad-square',
    name: 'Four Cuts',
    preview: '/templates/quad.svg',
    layout: 'quad',
    aspectRatio: '1:1',
  },
  {
    id: 'six-strip',
    name: 'Photo Strip',
    preview: '/templates/six.svg',
    layout: 'six',
    aspectRatio: '4:3',
  },
]

const photoCounts = { single: 1, double: 2, quad: 4, six: 6 } as const

export default function TemplatesPage() {
  const navigate = useNavigate()
  const { success } = useToast()
  const { startNewSession, currentSession } = usePhotoStore()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    currentSession?.template || null
  )
  const [activeTab, setActiveTab] = useState<'frame' | 'classic'>('frame')

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    startNewSession(template)
    success(
      'Template selected ✨',
      `Starting new session with "${template.name}"`
    )
  }

  const handleStartSession = () => {
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
            Choose a classic layout or a designer frame template.
          </p>

          {/* Tab toggle */}
          <div className="mt-6 inline-flex items-center bg-white border border-border rounded-full p-1 shadow-soft">
            <button
              onClick={() => setActiveTab('frame')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all',
                activeTab === 'frame'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-primary'
              )}
            >
              Frame Templates
            </button>
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
          </div>
        </div>

        {/* ── Template carousel ── */}
        <div className="relative px-4 pb-8">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            {/* Left arrow */}
            <button className="h-10 w-10 rounded-full bg-white border border-border shadow-soft flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-all flex-shrink-0">
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Cards — uniform width + fixed-height preview so all cards align */}
            <div className="flex items-stretch gap-5 overflow-x-auto pb-4 max-w-3xl">
              {templates.map((template, index) => {
                const isSelected = selectedTemplate?.id === template.id
                const isPopular =
                  template.layout === 'quad' || template.layout === 'double'
                const photoCount = photoCounts[template.layout]

                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className={cn(
                      'relative cursor-pointer rounded-2xl border-2 transition-all duration-300 bg-white shadow-card flex-shrink-0',
                      'hover:-translate-y-1 hover:shadow-polaroid',
                      isSelected
                        ? 'border-primary shadow-glow'
                        : 'border-border hover:border-primary/40'
                    )}
                    style={{ width: 160 }}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {/* Popular badge */}
                    {isPopular && (
                      <div className="absolute -top-3 -right-2 z-10">
                        <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Star className="h-2.5 w-2.5" />
                          Popular
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      {/* Fixed-height preview — same for every template */}
                      <div className="w-full h-44 bg-rose-50 rounded-xl border border-border flex items-center justify-center mb-4 overflow-hidden">
                        <div
                          className={cn(
                            'grid gap-1',
                            template.layout === 'single' &&
                              'w-20 h-20 grid-cols-1',
                            template.layout === 'double' &&
                              'w-14 h-36 grid-cols-1 grid-rows-2',
                            template.layout === 'quad' &&
                              'w-24 h-24 grid-cols-2 grid-rows-2',
                            template.layout === 'six' &&
                              'w-28 h-16 grid-cols-3 grid-rows-2'
                          )}
                        >
                          {Array.from({ length: photoCount }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                'rounded-sm border border-rose-200 flex items-center justify-center',
                                isSelected ? 'bg-primary/10' : 'bg-white'
                              )}
                            >
                              <Camera className="h-2.5 w-2.5 text-rose-300" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Name & count */}
                      <h3 className="font-display text-sm text-text text-center">
                        {template.name}
                      </h3>
                      <p className="text-xs text-muted text-center mt-0.5">
                        {photoCount} photo{photoCount > 1 ? 's' : ''}
                      </p>

                      {/* Selected indicator */}
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
              })}
            </div>

            {/* Right arrow */}
            <button className="h-10 w-10 rounded-full bg-white border border-border shadow-soft flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-all flex-shrink-0">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {templates.map((t, i) => (
              <button
                key={t.id}
                onClick={() => handleTemplateSelect(templates[i])}
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
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => handleTemplateSelect(t)}
              className={cn(
                'w-14 rounded-xl border-2 overflow-hidden transition-all',
                selectedTemplate?.id === t.id
                  ? 'border-primary shadow-sm'
                  : 'border-border opacity-60 hover:opacity-100'
              )}
            >
              <div
                className={cn(
                  'bg-rose-50 flex items-center justify-center',
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
                  {Array.from({ length: photoCounts[t.layout] }).map((_, i) => (
                    <div key={i} className="bg-rose-200/60 rounded-sm" />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="flex justify-center pb-12">
          <Button
            size="lg"
            pill
            onClick={handleStartSession}
            disabled={!selectedTemplate}
            className="px-10 shadow-glow"
          >
            Use this frame ✦
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
                  icon: Layout,
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
