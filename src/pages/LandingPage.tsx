import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Camera, Star, Send, Loader2, Sparkles, Image, Share2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitFeedback, fetchApprovedFeedback, type DbFeedback } from '@/lib/supabase'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'

/* ─── Template showcase data ─────────────────────────────── */
const showcaseTemplates = [
  { name: 'Polaroid Grid', layout: '2×2', emoji: '📷', style: 'bg-amber-50', badge: 'Popular' },
  { name: 'Film Strip', layout: '2 shots', emoji: '🎞️', style: 'bg-gray-800', badge: 'Trending' },
  { name: 'Blush Edit', layout: '2×2', emoji: '🌸', style: 'bg-rose-100', badge: 'New' },
  { name: 'Photo Strip', layout: '3×2', emoji: '📠', style: 'bg-rose-50', badge: '' },
  { name: 'Minimal', layout: '1 shot', emoji: '✧', style: 'bg-white', badge: '' },
  { name: 'Valentine B&W', layout: '1 shot', emoji: '🤍', style: 'bg-stone-50', badge: 'Popular' },
]

/* ─── Testimonial data ─────────────────────────────────── */
const testimonials = [
  { name: 'Mia C.', text: 'Used this for my birthday party — guests loved it! The polaroid templates are gorgeous.', emoji: '🎂', rating: 5 },
  { name: 'Sarah L.', text: 'Finally a photo booth that works in the browser. No app, no fuss. Just beautiful strips.', emoji: '✨', rating: 5 },
  { name: 'Jade K.', text: 'The film filters are *chef\'s kiss*. Makes every photo look like it\'s from a movie.', emoji: '🎬', rating: 5 },
  { name: 'Rina P.', text: 'Shared the QR code at our wedding and everyone got their strips instantly. So good!', emoji: '💍', rating: 5 },
  { name: 'Alex T.', text: 'The sticker packs are adorable. Coquette theme is everything.', emoji: '🎀', rating: 5 },
  { name: 'Emi W.', text: 'Better than most paid photo booth apps. And it\'s free?!', emoji: '🔥', rating: 5 },
]

/* ─── Feature cards ─────────────────────────────────────── */
const features = [
  { title: 'Live Camera', description: 'HD webcam with countdown, grid overlays and smooth capture.', icon: Camera },
  { title: 'Vintage Filters', description: '13 film filters, adjustments and aesthetic frames per shot.', icon: Sparkles },
  { title: 'Instant Export', description: 'Download as PNG, share via QR, or print-ready PDF in seconds.', icon: Image },
  { title: 'Share Everywhere', description: 'QR codes, public links, native share — your strips, your way.', icon: Share2 },
]

/* ─── Steps ─────────────────────────────────────────────── */
const steps = [
  { num: '01', label: 'Pick your', accent: 'look.', desc: 'Choose a classic layout or designer frame template.' },
  { num: '02', label: 'Strike a', accent: 'pose.', desc: 'Use the countdown timer and snap 1–6 photos.' },
  { num: '03', label: 'Make it', accent: 'yours.', desc: 'Apply filters, stickers and colour adjustments.' },
  { num: '04', label: 'Save &', accent: 'share.', desc: 'Download your strip or share it instantly.' },
]

/* ─── Floating decoration ───────────────────────────────── */
function Floatie({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${className ?? ''}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}

function PolaroidFloatie({ color, rotate, className, delay }: { color: string; rotate: number; className?: string; delay?: number }) {
  return (
    <Floatie className={className} delay={delay}>
      <div className="w-14 h-16 bg-white rounded-sm shadow-polaroid flex flex-col items-center justify-end pb-1.5 gap-1" style={{ transform: `rotate(${rotate}deg)` }}>
        <div className={`w-10 h-10 rounded-sm ${color}`} />
        <div className="w-8 h-1 bg-border/60 rounded-full" />
      </div>
    </Floatie>
  )
}

/* ─── Animated section wrapper ──────────────────────────── */
function Section({ children, className, bg = 'bg-background', id }: { children: React.ReactNode; className?: string; bg?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative z-10 ${bg} ${className ?? ''}`}
    >
      {children}
    </motion.section>
  )
}

/* ─── Component ─────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  const { success, error: showError } = useToast()

  const [feedbackName, setFeedbackName] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackEmoji, setFeedbackEmoji] = useState('♡')
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [feedbackList, setFeedbackList] = useState<DbFeedback[]>([])
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true)

  const emojiOptions = ['♡', '📸', '✨', '🎀', '⭐', '🌸', '💕', '🔥']

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const data = await fetchApprovedFeedback()
        setFeedbackList(data)
      } catch { /* non-critical */ } finally {
        setIsLoadingFeedback(false)
      }
    }
    loadFeedback()
  }, [])

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackMessage.trim()) return
    setIsSubmittingFeedback(true)
    try {
      await submitFeedback(feedbackName || null, feedbackMessage, feedbackEmoji)
      success('Thanks for your feedback! ♡', 'Your message has been added to the wall')
      setFeedbackName('')
      setFeedbackMessage('')
      setFeedbackEmoji('♡')
      const data = await fetchApprovedFeedback()
      setFeedbackList(data)
    } catch {
      showError('Oops!', 'Could not submit feedback. Please try again.')
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const handleGetStarted = async () => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      try { await navigator.mediaDevices.getUserMedia({ video: true }) } catch { /* re-requested on camera page */ }
    }
    navigate('/camera')
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ── Dot grid ── */}
      <div className="dot-grid absolute inset-0 opacity-50" />

      {/* ── Floating decorations ── */}
      <PolaroidFloatie color="bg-rose-200" rotate={-14} className="top-20 left-6 opacity-80" delay={0} />
      <PolaroidFloatie color="bg-sky-200" rotate={8} className="top-36 left-10 opacity-60" delay={1.2} />
      <PolaroidFloatie color="bg-rose-100" rotate={12} className="top-16 right-8 opacity-70" delay={0.6} />
      <PolaroidFloatie color="bg-pink-200" rotate={-6} className="top-40 right-16 opacity-60" delay={2} />
      <Floatie className="top-28 left-40 text-2xl opacity-70" delay={1.5}>🎀</Floatie>
      <Floatie className="top-48 right-40 text-xl opacity-60" delay={0.8}>⭐</Floatie>
      <Floatie className="bottom-40 left-12 text-2xl opacity-50" delay={2.2}>💕</Floatie>
      <Floatie className="bottom-56 right-10 text-xl opacity-60" delay={1}>🌸</Floatie>
      <Floatie className="bottom-48 left-32 opacity-75" delay={1.8}>
        <div className="sticker text-primary text-sm" style={{ transform: 'rotate(-8deg)' }}>free to use ♡</div>
      </Floatie>
      <Floatie className="top-32 right-48 opacity-70" delay={0.4}>
        <div className="sticker text-primary text-sm" style={{ transform: 'rotate(5deg)' }}>no app needed ✦</div>
      </Floatie>

      {/* ── Navbar ── */}
      <nav className="relative z-50 flex justify-center pt-6 px-4" role="navigation" aria-label="Main navigation">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-8 bg-white/90 backdrop-blur-md rounded-full px-6 py-2.5 shadow-nav border border-border"
        >
          <span className="font-script text-primary text-xl font-bold tracking-wide">ClickStudio.</span>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted font-medium">
            <a href="#how-it-works" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 rounded-lg px-1">How it works</a>
            <a href="#features" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 rounded-lg px-1">Features</a>
            <a href="#templates" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 rounded-lg px-1">Templates</a>
          </div>
          <button
            onClick={handleGetStarted}
            className="bg-text text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-text/85 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
            aria-label="Open Studio"
          >
            Open Studio <span className="text-primary">✦</span>
          </button>
        </motion.div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-10 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-4xl border border-border shadow-card p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="font-script text-primary text-lg mb-4">No app required</p>
                <h1 className="font-display text-6xl md:text-7xl text-text leading-[1.05]">
                  The<br />
                  <em className="font-script not-italic text-primary text-[5rem] md:text-[6rem] leading-none">aesthetic</em><br />
                  click<br />
                  studio.
                </h1>
                <p className="text-muted mt-6 text-base leading-relaxed max-w-md">
                  Step inside the internet's cutest photo studio. Snap pics with your webcam, apply vintage film filters, and save gorgeous photo strips instantly.
                </p>

                {/* Stats pill */}
                <div className="mt-6 inline-flex items-center gap-2 bg-rose-50 border border-border rounded-full px-4 py-2 text-sm text-text" aria-label="2,847+ strips created today">
                  <span aria-hidden="true">📸</span>
                  <span><strong className="text-primary">2,847+</strong> strips created today</span>
                </div>

                {/* Trust badge */}
                <div className="mt-3 flex items-start gap-3 bg-rose-50 border border-border rounded-xl px-4 py-3 text-sm text-muted max-w-sm">
                  <span className="mt-0.5" aria-hidden="true">⚡</span>
                  <span>Loved by creators worldwide — with new frame templates, film effects, and upgraded filters.</span>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button size="lg" pill onClick={handleGetStarted} icon={<Camera className="h-5 w-5" />} className="px-8 shadow-glow">
                    Start the Studio
                  </Button>
                  <a href="#how-it-works" className="text-sm text-muted underline underline-offset-4 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded">
                    Wait, how does it work?
                  </a>
                </div>
              </div>

              {/* Right column — photo strip preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="w-44 bg-gray-900 rounded-2xl shadow-2xl border-4 border-gray-800 overflow-hidden">
                    <div className="h-8 bg-gray-800 flex items-center justify-between px-3">
                      <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-gray-600" /><div className="w-1.5 h-1.5 rounded-full bg-gray-600" /></div>
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </div>
                    <div className="p-1.5 space-y-1">
                      {['from-rose-100 to-rose-200', 'from-gray-100 to-gray-200', 'from-rose-50 to-pink-100', 'from-gray-50 to-gray-100'].map((grad, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                          className={`h-24 rounded-sm bg-gradient-to-br ${grad} flex items-center justify-center`}
                        >
                          <Camera className="h-6 w-6 text-rose-300/70" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-52"
                  >
                    <div className="bg-white rounded-2xl shadow-card border border-border px-4 py-2.5 text-xs text-center text-muted">
                      <span className="text-base mr-1" aria-hidden="true">📸</span>
                      Tag <span className="text-primary font-medium">@clickstudio</span> — yours could appear here
                    </div>
                  </motion.div>
                  <div className="absolute -top-3 -right-3 text-yellow-400 text-xl" aria-hidden="true">✦</div>
                  <div className="absolute -bottom-2 -left-4 text-pink-400 text-base" aria-hidden="true">✦</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <Section id="how-it-works" className="py-16 px-4 sm:px-6" bg="bg-rose-50/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="font-script text-primary text-lg mb-2">Simple & fun</p>
            <h2 className="font-display text-4xl md:text-5xl text-text">
              How it <em className="font-script not-italic text-primary">works.</em>
            </h2>
            <p className="text-muted mt-4 max-w-md mx-auto">Four easy steps to your perfect photo strip — no downloads, no sign-up needed.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-5 border border-border shadow-card hover:shadow-polaroid hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="font-script text-primary text-sm mb-2">Step {step.num}</div>
                <h3 className="font-display text-xl text-text leading-tight">
                  {step.label} <em className="font-script not-italic text-primary">{step.accent}</em>
                </h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Template Showcase ── */}
      <Section id="templates" className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="font-script text-primary text-lg mb-2">37 templates</p>
            <h2 className="font-display text-4xl md:text-5xl text-text">
              Find your <em className="font-script not-italic text-primary">vibe.</em>
            </h2>
            <p className="text-muted mt-4 max-w-md mx-auto">From classic layouts to designer frames — there's a template for every mood.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {showcaseTemplates.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group cursor-pointer"
                onClick={handleGetStarted}
              >
                <div className={cn(
                  'relative rounded-2xl border border-border/50 overflow-hidden transition-all duration-300',
                  'hover:shadow-[0_12px_30px_-8px_rgba(233,30,140,0.12)] hover:border-primary/40 hover:-translate-y-1'
                )}>
                  {t.badge && (
                    <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-primary/90 text-white">
                      {t.badge}
                    </div>
                  )}
                  <div className={cn('h-24 flex items-center justify-center', t.style)}>
                    <span className="text-2xl opacity-30 group-hover:opacity-50 transition-opacity">{t.emoji}</span>
                  </div>
                  <div className="bg-white p-2.5">
                    <p className="font-display text-[11px] text-text truncate">{t.name}</p>
                    <p className="text-[9px] text-muted/60">{t.layout}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex justify-center mt-8"
          >
            <Button pill onClick={handleGetStarted} className="gap-2">
              Browse all templates <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* ── Features ── */}
      <Section id="features" className="py-16 px-4 sm:px-6" bg="bg-rose-50/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl text-text">
              Everything you <em className="font-script not-italic text-primary">need.</em>
            </h2>
            <p className="text-muted mt-4 max-w-md mx-auto">Professional-grade tools wrapped in the cutest interface.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-5 border border-border shadow-card hover:shadow-polaroid hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-text mb-1.5">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Testimonials ── */}
      <Section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="font-script text-primary text-lg mb-2">Love letters</p>
            <h2 className="font-display text-4xl md:text-5xl text-text">
              What people <em className="font-script not-italic text-primary">say.</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white rounded-2xl p-5 border border-border shadow-card hover:shadow-polaroid transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-text text-sm leading-relaxed mb-3">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">{t.emoji}</span>
                  <span className="text-xs text-muted font-medium">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Feedback Wall ── */}
      <Section className="py-16 px-4 sm:px-6" bg="bg-rose-50/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="font-script text-primary text-lg mb-2">Drop a note</p>
            <h2 className="font-display text-3xl md:text-4xl text-text">
              Leave a <em className="font-script not-italic text-primary">message.</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-border shadow-card max-w-lg mx-auto mb-10"
          >
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label htmlFor="fb-name" className="block text-sm text-text font-medium mb-1.5">Name <span className="text-muted">(optional)</span></label>
                <input id="fb-name" type="text" value={feedbackName} onChange={e => setFeedbackName(e.target.value)} placeholder="Your name" maxLength={30}
                  className="w-full rounded-xl border border-border bg-rose-50/50 px-4 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
              </div>
              <div>
                <label htmlFor="fb-message" className="block text-sm text-text font-medium mb-1.5">Message</label>
                <textarea id="fb-message" value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value.slice(0, 160))} placeholder="Say something nice..." rows={3} maxLength={160}
                  className="w-full rounded-xl border border-border bg-rose-50/50 px-4 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none" />
                <p className="text-xs text-muted text-right mt-1">{feedbackMessage.length}/160</p>
              </div>
              <div>
                <label className="block text-sm text-text font-medium mb-2">Pick an emoji</label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map(emoji => (
                    <button key={emoji} type="button" onClick={() => setFeedbackEmoji(emoji)}
                      className={cn('w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary/40',
                        feedbackEmoji === emoji ? 'bg-primary/10 border-2 border-primary scale-110' : 'bg-rose-50 border border-border hover:border-primary/40'
                      )} aria-label={`Select emoji ${emoji}`}>
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={!feedbackMessage.trim() || isSubmittingFeedback}
                icon={isSubmittingFeedback ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                className="w-full">
                {isSubmittingFeedback ? 'Sending...' : 'Send Feedback'}
              </Button>
            </form>
          </motion.div>

          {isLoadingFeedback ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>
          ) : feedbackList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {feedbackList.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-4 border border-border shadow-card hover:shadow-polaroid transition-all">
                  <div className="flex items-start gap-3">
                    <span className="text-xl" aria-hidden="true">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-text text-sm leading-relaxed">{item.message}</p>
                      <p className="text-muted text-xs mt-1.5">{item.name || 'Anonymous'} · {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted text-sm py-4">No feedback yet — be the first to leave a note!</p>
          )}
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-4xl border border-border shadow-card p-10 md:p-14 text-center relative overflow-hidden"
          >
            <div className="pink-radial absolute inset-0 opacity-60 pointer-events-none" />
            <div className="relative z-10">
              <p className="font-script text-primary text-lg mb-3">Ready to snap?</p>
              <h2 className="font-display text-4xl md:text-5xl text-text mb-4">
                Create your <em className="font-script not-italic text-primary">memories.</em>
              </h2>
              <p className="text-muted mb-8 max-w-md mx-auto">Join thousands of users creating gorgeous photo experiences — 100% free, no sign-up.</p>
              <Button size="xl" pill onClick={handleGetStarted} icon={<Camera className="h-6 w-6" />} className="px-12 shadow-glow">
                Start ClickStudio Session
              </Button>
              <p className="text-xs text-muted mt-4 flex items-center justify-center gap-1">
                <Star className="h-3 w-3 text-primary" aria-hidden="true" />
                Free forever · No account required
                <Star className="h-3 w-3 text-primary" aria-hidden="true" />
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border py-10 px-4" role="contentinfo">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="ClickStudio" className="h-8 w-auto object-contain" />
              <span className="font-script text-xl text-primary">ClickStudio.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted">
              <a href="#how-it-works" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded">How it works</a>
              <a href="#features" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded">Features</a>
              <a href="#templates" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded">Templates</a>
              <button onClick={handleGetStarted} className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded">Open Studio</button>
            </div>
            <p className="text-muted text-sm">© 2026 ClickStudio — Made with <span className="text-primary" aria-hidden="true">♡</span></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
