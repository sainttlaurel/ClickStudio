import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Camera, Star, Send, Loader2, ArrowRight, Download, Share2, Filter, Heart } from 'lucide-react'
import { submitFeedback, fetchApprovedFeedback, type DbFeedback } from '@/lib/supabase'
import { useToast } from '@/store/useUIStore'

// ─── Reveal on scroll ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Floating decoration ──────────────────────────────────────────────────────
function Float({ children, duration = 4, delay = 0, range = 12, className = '' }: { children: React.ReactNode; duration?: number; delay?: number; range?: number; className?: string }) {
  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      animate={{ y: [0, -range, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

// ─── Film grain overlay ───────────────────────────────────────────────────────
function FilmGrain() {
  return <div className="film-grain" />
}

// ─── Data ────────────────────────────────────────────────────────────────────
const REVIEWS = [
  { text: '"did my whole bday party on this omg. everyone was fighting over who goes next lol"', author: 'bea', emoji: '🎂', rotate: '-1.5deg', bg: '#fff' },
  { text: '"the polaroid template literally looks like a real instax. obsessed."', author: 'kiana', emoji: '📷', rotate: '1.5deg', bg: '#fef0f3' },
  { text: '"used it for our wedding photobooth. qr code thing is genius, guests loved it"', author: 'mitch', emoji: '💒', rotate: '-1deg', bg: '#fff' },
  { text: '"no download??? in this economy??? finally something that just works"', author: 'julia', emoji: '✨', rotate: '2deg', bg: '#fef0f3' },
  { text: '"the vintage filter makes every pic look like a magazine cover. obsessed."', author: 'claire', emoji: '🎀', rotate: '-2deg', bg: '#fff' },
]

const STEPS = [
  { num: '01', title: 'Pick your', accent: 'look.', desc: 'Choose a classic layout or designer frame template.', icon: '🖼️' },
  { num: '02', title: 'Strike a', accent: 'pose.', desc: 'Use the countdown timer and snap 1\u20136 photos.', icon: '📸' },
  { num: '03', title: 'Make it', accent: 'yours.', desc: 'Apply filters, stickers and colour adjustments.', icon: '✨' },
  { num: '04', title: 'Save &', accent: 'share.', desc: 'Download your strip or share it instantly.', icon: '💌' },
]

const FEATURES = [
  { icon: Camera, title: 'Live Camera', desc: 'HD webcam with countdown, grid overlays and smooth capture.', previewBg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', tag: 'HD 1080p', detail: '3\u2026 2\u2026 1\u2026' },
  { icon: Filter, title: 'Vintage Filters', desc: '13 film filters, adjustments and aesthetic frames per shot.', previewBg: 'linear-gradient(90deg, #ffb3d0 0%, #ffe680 40%, #b0c4de 70%, #1a1a2e 100%)', tag: '13 filters', detail: 'Soft \u00b7 Warm \u00b7 B&W \u00b7 Blush' },
  { icon: Download, title: 'Instant Export', desc: 'Download as PNG, share via QR, or print-ready PDF in seconds.', previewBg: 'linear-gradient(135deg, #fde8f0 0%, #ffd6e7 100%)', tag: 'PNG \u00b7 QR \u00b7 PDF', detail: '\ud83d\udce5 PNG  \ud83d\udcf1 QR  \ud83d\udda8\ufe0f PDF' },
  { icon: Share2, title: 'Share Everywhere', desc: 'QR codes, public links, native share \u2014 your strips, your way.', previewBg: 'linear-gradient(135deg, #f8f8ff 0%, #f0f0fa 100%)', tag: 'Any platform', detail: 'Scan or tap to view \u2192' },
]

const TEMPLATES = [
  { name: 'Classic Film', frames: ['#ffd6e7', '#ffe4b3', '#e8d5e8'], bg: '#fffaf0' },
  { name: 'Polaroid', frames: ['#e8f4ff', '#ddeeff', '#eef0ff'], bg: '#f5faff' },
  { name: 'Valentine', frames: ['#ffb3c8', '#e8127a', '#ffafd6'], bg: '#fff5f8' },
  { name: 'Mono', frames: ['#333', '#444', '#222'], bg: '#f0f0f0' },
  { name: 'Film Roll', frames: ['#c8a84b', '#d4b566', '#b89640'], bg: '#fffbf0' },
]

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ onOpenStudio }: { onOpenStudio: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}
      style={{ borderBottom: scrolled ? '1px solid rgba(232,18,122,0.1)' : 'none' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-script text-primary text-[28px] font-bold leading-none">ClickStudio.</span>
        <div className="hidden md:flex items-center gap-8">
          {['How it works', 'Features', 'Templates'].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-foreground/55 hover:text-foreground transition-opacity font-body">
              {l}
            </a>
          ))}
        </div>
        <button
          onClick={onOpenStudio}
          className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full bg-primary shadow-[0_4px_20px_rgba(232,18,122,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 font-body"
        >
          <Camera className="w-4 h-4" />
          Open Studio ↗
        </button>
      </div>
    </nav>
  )
}

// ─── Hero Photo Strip Visual ──────────────────────────────────────────────────
function HeroStrip() {
  const frames = [
    { from: '#ffd6e7', to: '#ffafd6' },
    { from: '#ddf0ff', to: '#bce0ff' },
    { from: '#fff2cc', to: '#ffe599' },
  ]
  return (
    <motion.div
      animate={{ y: [0, -14, 0], rotate: [5, 6.5, 5] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
      style={{ transformOrigin: 'center' }}
    >
      {/* Perforations left */}
      <div className="absolute -left-5 top-6 bottom-6 flex flex-col justify-around w-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-4 h-3.5 rounded-sm bg-primary/30" />
        ))}
      </div>
      {/* Strip body */}
      <div className="rounded-2xl overflow-hidden bg-primary p-[10px] w-[190px] shadow-[0_40px_80px_rgba(232,18,122,0.35),0_10px_30px_rgba(232,18,122,0.2)]">
        {frames.map((f, i) => (
          <div
            key={i}
            className="rounded-xl flex items-center justify-center mb-2.5 last:mb-0"
            style={{ background: `linear-gradient(135deg, ${f.from}, ${f.to})`, height: '130px' }}
          >
            <Camera className="w-8 h-8 text-white/45" />
          </div>
        ))}
      </div>
      {/* Perforations right */}
      <div className="absolute -right-5 top-6 bottom-6 flex flex-col justify-around w-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-4 h-3.5 rounded-sm bg-primary/30" />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onOpenStudio }: { onOpenStudio: () => void }) {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(232,18,122,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 70%, rgba(255,105,180,0.07) 0%, transparent 60%), #fef8fa',
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-24 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #ff69b4 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #e8127a 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Floating decorative elements */}
      <Float duration={3.5} range={10} className="absolute top-32 left-14">
        <Star className="w-7 h-7 fill-current text-accent/70" />
      </Float>
      <Float duration={5} delay={1} range={15} className="absolute top-52 right-28">
        <Heart className="w-8 h-8 fill-current text-primary/40" />
      </Float>
      <Float duration={4} delay={2} range={12} className="absolute bottom-44 left-24">
        <span className="text-3xl text-accent/50">✦</span>
      </Float>
      <Float duration={6} delay={0.5} range={8} className="absolute top-40 left-1/2 ml-60">
        <span className="text-2xl text-primary/30">♡</span>
      </Float>
      <Float duration={4.5} delay={1.5} range={10} className="absolute bottom-32 right-40">
        <Star className="w-5 h-5 fill-current text-yellow-400/60" />
      </Float>

      {/* Floating sticker badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -14 }}
        animate={{ opacity: 1, scale: 1, rotate: -14 }}
        transition={{ delay: 0.9, duration: 0.5, ease: 'backOut' }}
        className="absolute top-28 right-[46%] hidden lg:flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-md border border-border"
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-semibold text-foreground font-body">2,847+ strips today</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: 10 }}
        animate={{ opacity: 1, scale: 1, rotate: 10 }}
        transition={{ delay: 1.1, duration: 0.5, ease: 'backOut' }}
        className="absolute bottom-40 right-14 hidden lg:block bg-white rounded-2xl px-4 py-3 shadow-lg border border-border max-w-[160px]"
      >
        <div className="flex items-center gap-1.5 mb-0.5">
          <Camera className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground font-body">Tag @clickstudio</span>
        </div>
        <span className="text-[11px] text-muted-foreground font-body">yours could appear here</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: -5 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute top-24 left-1/4 hidden lg:block bg-amber-50 rounded-full px-3 py-1 text-xs font-medium border border-amber-200/50 text-amber-700 font-body"
      >
        ✦ No app required
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left: headline */}
        <div>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-xs font-semibold mb-5 tracking-[0.2em] uppercase text-primary font-body">
            Internet&apos;s cutest photo studio
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="font-display font-bold text-foreground leading-[1.04] mb-6" style={{ fontSize: 'clamp(52px, 7vw, 76px)' }}>
            The <em className="font-script not-italic text-primary font-bold">aesthetic</em><br />click<br />studio.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg leading-relaxed mb-10 max-w-md text-foreground/58 font-body">
            Snap pics with your webcam, apply vintage film filters, and save gorgeous photo strips instantly.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="flex items-center gap-4 flex-wrap">
            <button onClick={onOpenStudio} className="flex items-center gap-2.5 font-semibold text-white px-8 py-4 rounded-full bg-primary shadow-[0_6px_32px_rgba(232,18,122,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 font-body text-[16px]">
              <Camera className="w-5 h-5" />
              Start the Studio
            </button>
            <a href="#how-it-works" className="text-sm font-medium text-foreground/50 hover:text-foreground transition-opacity font-body underline underline-offset-4">
              Wait, how does it work?
            </a>
          </motion.div>

          {/* Stars */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center gap-2 mt-8">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-foreground/45 font-body">Loved by creators worldwide</span>
          </motion.div>
        </div>

        {/* Right: photo strip */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="hidden lg:flex justify-center items-center">
          <HeroStrip />
        </motion.div>
      </div>
    </section>
  )
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
function Ticker() {
  const words = ['SNAP', 'POSE', 'FILTER', 'SHARE', 'PRINT', 'VINTAGE', 'FILM', 'AESTHETIC', 'CLICK', 'MOMENT']
  const repeated = [...words, ...words, ...words]
  return (
    <div className="overflow-hidden py-3.5 bg-primary">
      <motion.div
        animate={{ x: [0, `-${100 / 3}%`] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="flex gap-0 whitespace-nowrap"
        style={{ width: 'max-content' }}
      >
        {repeated.map((w, i) => (
          <span key={i} className="text-xs font-bold tracking-[0.22em] text-white inline-flex items-center font-body">
            &nbsp;&nbsp;{w}&nbsp;&nbsp;
            <span className="text-white/35">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <p className="font-script text-primary text-[22px] mb-2">Simple & fun</p>
          <h2 className="font-display font-bold text-foreground leading-tight" style={{ fontSize: 'clamp(40px, 5vw, 58px)' }}>
            How it <em className="font-script not-italic text-primary">works.</em>
          </h2>
          <p className="text-base mt-4 max-w-lg mx-auto text-foreground/50 font-body">
            Four easy steps to your perfect photo strip — no downloads, no sign-up needed.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div
                className="group relative rounded-3xl p-8 h-full flex flex-col transition-all duration-300 hover:-translate-y-2 cursor-default"
                style={{
                  backgroundColor: i % 2 === 0 ? '#fff' : '#fef0f3',
                  border: '1px solid rgba(232,18,122,0.1)',
                  boxShadow: '0 2px 24px rgba(232,18,122,0.05)',
                }}
              >
                <div className="text-3xl mb-5">{step.icon}</div>
                <div className="text-[10px] font-bold tracking-[0.2em] mb-3 text-primary font-body">STEP {step.num}</div>
                <h3 className="text-[22px] font-display font-bold mb-3 leading-tight text-foreground">
                  {step.title} <em className="font-script not-italic text-primary">{step.accent}</em>
                </h3>
                <p className="text-sm leading-relaxed flex-1 text-foreground/55 font-body">{step.desc}</p>
                <div className="mt-6 w-7 h-7 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="py-28 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="font-display font-bold text-foreground leading-tight" style={{ fontSize: 'clamp(40px, 5vw, 58px)' }}>
            Everything you <em className="font-script not-italic text-primary">need.</em>
          </h2>
          <p className="text-base mt-4 max-w-lg mx-auto text-foreground/50 font-body">
            Professional-grade tools wrapped in the cutest interface.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-border" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                {/* Preview area */}
                <div className="h-40 flex flex-col items-center justify-center gap-2 relative overflow-hidden" style={{ background: f.previewBg }}>
                  <f.icon className="w-9 h-9 text-white/55" />
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/10 text-white/70 backdrop-blur-sm font-body">{f.detail}</span>
                </div>
                {/* Text */}
                <div className="p-5 bg-white">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-[15px] leading-snug text-foreground">{f.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 bg-secondary text-primary font-body">{f.tag}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-foreground/52 font-body">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Templates ────────────────────────────────────────────────────────────────
function Templates() {
  const [active, setActive] = useState(0)
  return (
    <section id="templates" className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <p className="font-script text-primary text-[22px] mb-2">See the magic</p>
          <h2 className="font-display font-bold text-foreground leading-tight" style={{ fontSize: 'clamp(40px, 5vw, 58px)' }}>
            Real <em className="font-script not-italic text-primary">results.</em>
          </h2>
          <p className="text-base mt-4 text-foreground/50 font-body">Every session produces unique, share-worthy photo strips.</p>
        </Reveal>

        <div className="flex gap-4 justify-center flex-wrap mb-10">
          {TEMPLATES.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div
                onClick={() => setActive(i)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="cursor-pointer rounded-2xl overflow-hidden transition-shadow duration-300"
                style={{
                  border: active === i ? '2px solid #e8127a' : '2px solid rgba(232,18,122,0.12)',
                  boxShadow: active === i ? '0 8px 32px rgba(232,18,122,0.25)' : '0 2px 12px rgba(0,0,0,0.04)',
                  width: '140px',
                }}
              >
                <div className="p-3" style={{ backgroundColor: t.bg }}>
                  <div className="flex flex-col gap-1.5 mb-3">
                    {t.frames.map((c, j) => (
                      <div key={j} className="rounded-md" style={{ backgroundColor: c, height: '36px' }} />
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold text-center font-body" style={{ color: active === i ? '#e8127a' : '#1a0812', opacity: active === i ? 1 : 0.55 }}>
                    {t.name}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center">
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-studio'))} className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline text-primary font-body">
            Try all templates <ArrowRight className="w-4 h-4" />
          </button>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="py-28 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <p className="font-script text-primary text-[22px] mb-2">Love letters</p>
          <h2 className="font-display font-bold text-foreground leading-tight" style={{ fontSize: 'clamp(40px, 5vw, 58px)' }}>
            What people <em className="font-script not-italic text-primary">say.</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div
                className="rounded-3xl p-7 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  backgroundColor: r.bg,
                  border: '1px solid rgba(232,18,122,0.1)',
                  transform: `rotate(${r.rotate})`,
                  boxShadow: '0 4px 20px rgba(232,18,122,0.04)',
                }}
              >
                <div>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-current text-primary" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/75 font-body">{r.text}</p>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <span className="text-xl">{r.emoji}</span>
                  <span className="text-sm font-semibold text-foreground font-body">{r.author}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact / Drop a note ────────────────────────────────────────────────────
function Contact() {
  const { success, error: showError } = useToast()
  const [feedbackName, setFeedbackName] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [feedbackList, setFeedbackList] = useState<DbFeedback[]>([])
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true)
  const [sent, setSent] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackMessage.trim()) return
    setIsSubmittingFeedback(true)
    try {
      await submitFeedback(feedbackName || null, feedbackMessage)
      setSent(true)
      setTimeout(() => setSent(false), 3000)
      success('Thanks for your feedback! ♡', 'Your message has been added to the wall')
      setFeedbackName('')
      setFeedbackMessage('')
      const data = await fetchApprovedFeedback()
      setFeedbackList(data)
    } catch {
      showError('Oops!', 'Could not submit feedback. Please try again.')
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="font-script text-primary text-[22px] mb-2">Drop a note</p>
          <h2 className="font-display font-bold text-foreground leading-tight" style={{ fontSize: 'clamp(36px, 4.5vw, 52px)' }}>
            Leave a <em className="font-script not-italic text-primary">message.</em>
          </h2>
        </Reveal>

        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl p-8 md:p-10 bg-background border border-border"
            style={{ boxShadow: '0 8px 40px rgba(232,18,122,0.07)' }}
          >
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2 text-foreground font-body">
                Name <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-border text-foreground font-body shadow-[inset_0_2px_4px_rgba(232,18,122,0.03)] focus:border-primary/45"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-foreground font-body">Message</label>
              <textarea
                placeholder="Say something nice..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value.slice(0, 160))}
                maxLength={160}
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none bg-white border border-border text-foreground font-body focus:border-primary/45"
              />
              <div className="text-right text-xs mt-1 text-muted-foreground font-body">{feedbackMessage.length}/160</div>
            </div>
            <button
              type="submit"
              disabled={!feedbackMessage.trim() || isSubmittingFeedback}
              className="w-full py-3.5 rounded-full font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-body text-[15px]"
              style={{
                backgroundColor: sent ? '#22c55e' : '#e8127a',
                boxShadow: '0 4px 20px rgba(232,18,122,0.35)',
              }}
            >
              {isSubmittingFeedback ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? '✓ Sent!' : <Send className="h-4 w-4" />}
              {isSubmittingFeedback ? 'Sending...' : sent ? 'Sent!' : '✦ Send Feedback'}
            </button>
          </form>
        </Reveal>

        {/* Feedback Wall */}
        {isLoadingFeedback ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>
        ) : feedbackList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            {feedbackList.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.05}>
                <div
                  className="rounded-3xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{
                    backgroundColor: i % 2 === 0 ? '#fff' : '#fef0f3',
                    border: '1px solid rgba(232,18,122,0.1)',
                    boxShadow: '0 4px 20px rgba(232,18,122,0.04)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed text-foreground/75 font-body">{item.message}</p>
                      <p className="text-xs text-muted-foreground mt-1.5 font-body">{item.name || 'Anonymous'} · {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm py-4 font-body">No feedback yet — be the first to leave a note!</p>
        )}
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA({ onOpenStudio }: { onOpenStudio: () => void }) {
  return (
    <section className="py-28 px-6 bg-background">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <div className="rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden bg-white border border-border" style={{ boxShadow: '0 24px 80px rgba(232,18,122,0.09)' }}>
            {/* Decorative corner elements */}
            <div className="absolute top-6 left-6 w-16 h-16 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #ff69b4, transparent)', filter: 'blur(12px)' }} />
            <div className="absolute bottom-6 right-6 w-20 h-20 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #e8127a, transparent)', filter: 'blur(16px)' }} />

            <Float duration={4} range={6} className="absolute top-4 right-12">
              <span className="text-primary opacity-40 text-[20px]">✦</span>
            </Float>
            <Float duration={5} delay={1} range={8} className="absolute bottom-6 left-12">
              <Heart className="w-5 h-5 fill-current text-accent/40" />
            </Float>

            <p className="font-script text-primary text-[22px] mb-2 relative z-10">Ready to snap?</p>
            <h2 className="font-display font-bold text-foreground leading-tight mb-4 relative z-10" style={{ fontSize: 'clamp(34px, 4.5vw, 50px)' }}>
              Create your <em className="font-script not-italic text-primary">memories.</em>
            </h2>
            <p className="text-base mb-8 max-w-sm mx-auto relative z-10 text-foreground/50 font-body">
              Join thousands of users creating gorgeous photo experiences — 100% free, no sign-up.
            </p>
            <button
              onClick={onOpenStudio}
              className="inline-flex items-center gap-3 font-semibold text-white px-8 py-4 rounded-full bg-primary shadow-[0_6px_32px_rgba(232,18,122,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 relative z-10 font-body text-[16px]"
            >
              <Camera className="w-5 h-5" />
              Start ClickStudio Session
            </button>
            <p className="mt-4 text-xs relative z-10 text-foreground/30 font-body">☆ Free forever · No account required ☆</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onOpenStudio }: { onOpenStudio: () => void }) {
  return (
    <footer className="py-8 px-6 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-script text-primary text-[26px] font-bold">ClickStudio.</span>
        <div className="flex items-center gap-6 flex-wrap justify-center">
          {['How it works', 'Features', 'Templates'].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-foreground/45 hover:text-foreground transition-opacity font-body">
              {l}
            </a>
          ))}
          <button onClick={onOpenStudio} className="text-sm font-medium text-primary hover:opacity-80 transition-opacity font-body">
            Open Studio ↗
          </button>
        </div>
        <p className="text-xs text-foreground/28 font-body">© 2026 ClickStudio — Made with ♡</p>
      </div>
    </footer>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  const handleGetStarted = async () => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      try { await navigator.mediaDevices.getUserMedia({ video: true }) } catch { /* re-requested on camera page */ }
    }
    navigate('/camera')
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FilmGrain />
      <Nav onOpenStudio={handleGetStarted} />
      <Hero onOpenStudio={handleGetStarted} />
      <Ticker />
      <HowItWorks />
      <Features />
      <Templates />
      <Testimonials />
      <Contact />
      <CTA onOpenStudio={handleGetStarted} />
      <Footer onOpenStudio={handleGetStarted} />
    </div>
  )
}
