import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Camera, Star, Send, Loader2, Image, Share2, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitFeedback, fetchApprovedFeedback, type DbFeedback } from '@/lib/supabase'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'

/* ─── Feature cards ─────────────────────────────────────── */
const features = [
  {
    title: 'Live Camera',
    description: 'HD webcam with countdown, grid overlays and smooth capture.',
    visual: (
      <div className="w-full h-24 bg-gray-900 rounded-xl overflow-hidden relative">
        {/* Grid overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-white/10" />
          ))}
        </div>
        {/* Center crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
              <Camera className="h-4 w-4 text-white/60" />
            </div>
          </div>
        </div>
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-5 bg-black/40 flex items-center justify-between px-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          </div>
          <span className="text-[7px] text-white/70 font-mono">HD 1080p</span>
        </div>
        {/* Bottom bar with timer */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-black/40 flex items-center justify-center">
          <span className="text-[8px] text-white/80 font-mono tracking-wider">3... 2... 1...</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Vintage Filters',
    description: '13 film filters, adjustments and aesthetic frames per shot.',
    visual: (
      <div className="w-full h-24 rounded-xl overflow-hidden relative">
        {/* Photo strip with filter effects */}
        <div className="absolute inset-0 flex gap-0.5">
          <div className="flex-1 bg-gradient-to-b from-rose-200 to-rose-300 flex items-center justify-center">
            <div className="w-6 h-8 bg-white/30 rounded-sm" />
          </div>
          <div className="flex-1 bg-gradient-to-b from-amber-100 to-amber-200 flex items-center justify-center">
            <div className="w-6 h-8 bg-amber-300/30 rounded-sm" />
          </div>
          <div className="flex-1 bg-gradient-to-b from-gray-600 to-gray-800 flex items-center justify-center">
            <div className="w-6 h-8 bg-white/20 rounded-sm" />
          </div>
          <div className="flex-1 bg-gradient-to-b from-pink-100 to-rose-200 flex items-center justify-center">
            <div className="w-6 h-8 bg-pink-300/30 rounded-sm" />
          </div>
        </div>
        {/* Filter labels overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 flex justify-around py-1">
          <span className="text-[6px] text-white/90 font-medium">Soft</span>
          <span className="text-[6px] text-white/90 font-medium">Warm</span>
          <span className="text-[6px] text-white/90 font-medium">B&W</span>
          <span className="text-[6px] text-white/90 font-medium">Blush</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Instant Export',
    description: 'Download as PNG, share via QR, or print-ready PDF in seconds.',
    visual: (
      <div className="w-full h-24 bg-white rounded-xl border border-border/50 p-2 flex flex-col gap-1.5">
        {/* Mini photo strip preview */}
        <div className="flex-1 bg-rose-50 rounded-lg flex items-center justify-center gap-1 px-2">
          <div className="w-5 h-7 bg-rose-200 rounded-sm" />
          <div className="w-5 h-7 bg-gray-200 rounded-sm" />
          <div className="w-5 h-7 bg-rose-100 rounded-sm" />
        </div>
        {/* Export buttons */}
        <div className="flex gap-1">
          <div className="flex-1 bg-primary rounded-md py-1 flex items-center justify-center gap-0.5">
            <Image className="h-2.5 w-2.5 text-white" />
            <span className="text-[6px] text-white font-medium">PNG</span>
          </div>
          <div className="flex-1 bg-gray-800 rounded-md py-1 flex items-center justify-center gap-0.5">
            <Printer className="h-2.5 w-2.5 text-white" />
            <span className="text-[6px] text-white font-medium">PDF</span>
          </div>
          <div className="flex-1 bg-primary rounded-md py-1 flex items-center justify-center gap-0.5">
            <Share2 className="h-2.5 w-2.5 text-white" />
            <span className="text-[6px] text-white font-medium">QR</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Share Everywhere',
    description: 'QR codes, public links, native share — your strips, your way.',
    visual: (
      <div className="w-full h-24 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md border border-border/30 px-3 py-2 flex items-center gap-2">
          {/* QR code mockup */}
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
            <svg viewBox="0 0 36 36" className="w-8 h-8">
              {/* Corner squares */}
              <rect x="2" y="2" width="10" height="10" rx="1" fill="#1C0B1A" />
              <rect x="4" y="4" width="6" height="6" rx="0.5" fill="white" />
              <rect x="5.5" y="5.5" width="3" height="3" fill="#1C0B1A" />
              <rect x="24" y="2" width="10" height="10" rx="1" fill="#1C0B1A" />
              <rect x="26" y="4" width="6" height="6" rx="0.5" fill="white" />
              <rect x="27.5" y="5.5" width="3" height="3" fill="#1C0B1A" />
              <rect x="2" y="24" width="10" height="10" rx="1" fill="#1C0B1A" />
              <rect x="4" y="26" width="6" height="6" rx="0.5" fill="white" />
              <rect x="5.5" y="27.5" width="3" height="3" fill="#1C0B1A" />
              {/* Center data pattern */}
              <rect x="14" y="14" width="2" height="2" fill="#1C0B1A" />
              <rect x="18" y="14" width="2" height="2" fill="#1C0B1A" />
              <rect x="20" y="16" width="2" height="2" fill="#1C0B1A" />
              <rect x="14" y="18" width="4" height="4" fill="#E91E8C" rx="0.5" />
              <rect x="22" y="20" width="2" height="2" fill="#1C0B1A" />
              <rect x="14" y="22" width="2" height="2" fill="#1C0B1A" />
              <rect x="18" y="24" width="2" height="2" fill="#1C0B1A" />
              <rect x="22" y="24" width="2" height="2" fill="#1C0B1A" />
              <rect x="26" y="18" width="2" height="2" fill="#1C0B1A" />
              <rect x="28" y="22" width="4" height="4" fill="#1C0B1A" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-[8px] font-semibold text-text">Share your strip</p>
            <p className="text-[7px] text-muted">Scan or tap to view</p>
          </div>
        </div>
      </div>
    ),
  },
]

/* ─── Testimonials ──────────────────────────────────────── */
const testimonials = [
  { name: 'bea', text: 'did my whole bday party on this omg. everyone was fighting over who goes next lol', emoji: '🎂' },
  { name: 'kiana', text: 'the polaroid template literally looks like a real instax. obsessed.', emoji: '📷' },
  { name: 'mitch', text: 'used it for our wedding photobooth. qr code thing is genius, guests loved it', emoji: '💒' },
  { name: 'julia', text: 'no download??? in this economy??? finally something that just works', emoji: '🙌' },
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
                className="bg-white rounded-3xl p-5 border border-border shadow-card hover:shadow-polaroid hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="mb-3 group-hover:scale-[1.02] transition-transform duration-300">
                  {f.visual}
                </div>
                <h3 className="font-semibold text-text mb-1">{f.title}</h3>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-border shadow-card hover:shadow-polaroid transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-text text-sm leading-relaxed mb-3">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-base" aria-hidden="true">{t.emoji}</span>
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

      {/* ── Gallery Preview ── */}
      <Section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="font-script text-primary text-lg mb-2">See the magic</p>
            <h2 className="font-display text-4xl md:text-5xl text-text">
              Real <em className="font-script not-italic text-primary">results.</em>
            </h2>
            <p className="text-muted mt-4 max-w-md mx-auto">Every session produces unique, share-worthy photo strips.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Strip 1 — Classic Film */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="bg-white rounded-2xl p-2 border border-border shadow-card hover:shadow-polaroid hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="p-1 space-y-1">
                  {['bg-rose-200', 'bg-amber-100', 'bg-rose-100', 'bg-gray-200'].map((c, i) => (
                    <div key={i} className={`h-14 ${c} rounded-sm`} />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted text-center mt-1.5 font-medium">Classic Film</p>
            </motion.div>

            {/* Strip 2 — Polaroid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="bg-white rounded-2xl p-2 border border-border shadow-card hover:shadow-polaroid hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <div className="p-1.5 space-y-1">
                  <div className="h-12 bg-pink-100 rounded-sm" />
                  <div className="h-12 bg-sky-100 rounded-sm" />
                </div>
                <div className="h-4 bg-white flex items-center justify-center">
                  <div className="w-10 h-0.5 bg-gray-200 rounded-full" />
                </div>
              </div>
              <p className="text-[10px] text-muted text-center mt-1.5 font-medium">Polaroid</p>
            </motion.div>

            {/* Strip 3 — Valentine */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="bg-white rounded-2xl p-2 border border-border shadow-card hover:shadow-polaroid hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-rose-50 rounded-xl overflow-hidden border border-rose-200">
                <div className="p-1 space-y-1">
                  <div className="h-14 bg-rose-200 rounded-sm flex items-center justify-center">
                    <span className="text-rose-400 text-lg">♡</span>
                  </div>
                  <div className="h-14 bg-rose-300 rounded-sm flex items-center justify-center">
                    <span className="text-white text-lg">♡</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-muted text-center mt-1.5 font-medium">Valentine</p>
            </motion.div>

            {/* Strip 4 — B&W */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="bg-white rounded-2xl p-2 border border-border shadow-card hover:shadow-polaroid hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="p-1 space-y-1">
                  <div className="h-20 bg-gray-700 rounded-sm" />
                  <div className="h-20 bg-gray-600 rounded-sm" />
                </div>
              </div>
              <p className="text-[10px] text-muted text-center mt-1.5 font-medium">Mono</p>
            </motion.div>

            {/* Strip 5 — Film Roll */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="bg-white rounded-2xl p-2 border border-border shadow-card hover:shadow-polaroid hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                {/* Sprocket holes */}
                <div className="flex justify-between px-0.5 py-0.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-gray-600 rounded-sm" />
                  ))}
                </div>
                <div className="px-1.5 pb-1 space-y-0.5">
                  <div className="h-8 bg-amber-100/80 rounded-sm" />
                  <div className="h-8 bg-amber-200/80 rounded-sm" />
                </div>
                <div className="flex justify-between px-0.5 py-0.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-gray-600 rounded-sm" />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted text-center mt-1.5 font-medium">Film Roll</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-8"
          >
            <Button variant="ghost" size="sm" onClick={handleGetStarted} className="text-muted hover:text-primary">
              Try all templates →
            </Button>
          </motion.div>
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
              <button onClick={handleGetStarted} className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded">Open Studio</button>
            </div>
            <p className="text-muted text-sm">© 2026 ClickStudio — Made with <span className="text-primary" aria-hidden="true">♡</span></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
