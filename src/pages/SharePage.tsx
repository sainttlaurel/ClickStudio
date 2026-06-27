import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Loader2, Camera, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase, TABLES } from '@/lib/supabase'
import { composeStrip, downloadComposite } from '@/utils/compositor'
import type { Photo, Template } from '@/types'

interface ShareSession {
  id: string
  template: Template
  photo_count: number
  created_at: string
  photos: {
    id: string
    public_url: string
    width: number | null
    height: number | null
  }[]
}

export default function SharePage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [session, setSession] = useState<ShareSession | null>(null)
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isComposing, setIsComposing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch session data
  useEffect(() => {
    if (!sessionId) return

    const fetchSession = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from(TABLES.SESSIONS)
          .select(`
            id,
            template,
            photo_count,
            created_at,
            ${TABLES.PHOTOS} (
              id,
              public_url,
              width,
              height
            )
          `)
          .eq('id', sessionId)
          .single()

        if (fetchError) throw fetchError
        if (!data) throw new Error('Session not found')

        setSession(data as ShareSession)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Session not found')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

  // Generate composite when session is loaded
  useEffect(() => {
    if (!session || session.photos.length === 0) return

    setIsComposing(true)

    const photos: Photo[] = session.photos.map(p => ({
      id: p.id,
      url: p.public_url,
      timestamp: Date.now(),
    }))

    composeStrip(photos, session.template)
      .then(url => setCompositeUrl(url))
      .catch(() => setError('Failed to generate preview'))
      .finally(() => setIsComposing(false))
  }, [session])

  const handleDownload = () => {
    if (!compositeUrl) return
    downloadComposite(compositeUrl, `clickstudio-${session?.template?.compositeStyle ?? 'strip'}-${Date.now()}.png`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <p className="text-muted">Loading your photo strip...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm mx-auto px-4">
          <div className="h-24 w-24 rounded-full bg-white border border-border flex items-center justify-center mx-auto">
            <Camera className="h-12 w-12 text-muted" />
          </div>
          <h1 className="font-display text-3xl text-text">Session not found</h1>
          <p className="text-muted text-sm">
            {error || 'This photo strip may have been removed or the link is incorrect.'}
          </p>
          <a href="/">
            <Button>
              Go to ClickStudio
            </Button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="ClickStudio"
              className="h-8 w-auto object-contain"
            />
            <span className="font-script text-xl text-primary">ClickStudio</span>
          </div>
          <Button
            onClick={handleDownload}
            disabled={!compositeUrl || isComposing}
            icon={
              isComposing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )
            }
          >
            Download Strip
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          {/* Title */}
          <div>
            <h1 className="font-display text-3xl text-text mb-2">
              {session.template.name}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Camera className="h-4 w-4" />
                {session.photo_count} photos
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(session.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Composite image */}
          <div className="relative inline-block">
            {isComposing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-2xl">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
            {compositeUrl ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={compositeUrl}
                alt="Photo strip composite"
                className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl object-contain"
              />
            ) : (
              <div className="w-64 h-64 rounded-2xl bg-white border border-border flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
          </div>

          {/* Download CTA */}
          <div className="pt-4">
            <Button
              size="lg"
              onClick={handleDownload}
              disabled={!compositeUrl || isComposing}
              icon={
                isComposing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )
              }
              className="px-8"
            >
              Download Your Strip
            </Button>
            <p className="text-xs text-muted mt-3">
              Made with <span className="text-primary">♡</span> by ClickStudio
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
