import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  History,
  Calendar,
  Camera,
  Download,
  Trash2,
  Eye,
  Search,
  Clock,
  Upload,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { composeStrip, downloadComposite } from '@/utils/compositor'
import { cn } from '@/utils/cn'
import type { PhotoSession } from '@/types'

export default function SessionHistoryPage() {
  const {
    currentSession,
    capturedPhotos,
    savedSessions,
    isSyncing,
    saveSession,
    fetchSessions,
    deleteSession,
  } = usePhotoStore()
  const { success, error } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [selectedSession, setSelectedSession] = useState<PhotoSession | null>(
    null
  )

  // ── Load sessions from Supabase on mount ──
  useEffect(() => {
    fetchSessions()
  }, [])

  // ── Merge current session (if not yet saved) with cloud sessions ──
  const allSessions = (() => {
    const cloudIds = new Set(savedSessions.map(s => s.id))
    const unsaved =
      currentSession && !cloudIds.has(currentSession.id)
        ? [{ ...currentSession, photos: capturedPhotos }]
        : []
    return [...unsaved, ...savedSessions]
  })()

  const filteredSessions = allSessions
    .filter(s => {
      if (!searchTerm) return true
      const q = searchTerm.toLowerCase()
      return (
        s.template.name.toLowerCase().includes(q) ||
        new Date(s.createdAt).toLocaleDateString('en-US').toLowerCase().includes(q)
      )
    })
    .sort((a, b) =>
      sortBy === 'newest'
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt
    )

  const handleSaveToCloud = async () => {
    await saveSession()
    success('Saved to cloud ✦', 'Your session is now stored in ClickStudio.')
  }

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId)
    setSelectedSession(null)
    success('Session deleted', 'Removed from your history.')
  }

  const handleExportSession = async (session: PhotoSession) => {
    if (session.photos.length === 0) {
      error('No photos', 'This session has no photos to export')
      return
    }
    try {
      const url = await composeStrip(session.photos, session.template)
      const slug = session.template.name.toLowerCase().replace(/\s+/g, '-')
      downloadComposite(
        url,
        `clickstudio-${slug}-${session.id.slice(0, 8)}.png`
      )
      success('Exported! 🎉', 'Your photo strip has been downloaded')
    } catch {
      error('Export failed', 'Could not generate the strip. Please try again.')
    }
  }

  const formatDuration = (createdAt: number, updatedAt: number) => {
    const mins = Math.floor((updatedAt - createdAt) / 60000)
    return mins < 1 ? '< 1 min' : `${mins} min`
  }

  const isCurrentUnsaved =
    currentSession && !savedSessions.some(s => s.id === currentSession.id)

  // ── Empty state ──
  if (!isSyncing && allSessions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-24 w-24 rounded-full bg-white border border-border flex items-center justify-center mx-auto">
            <History className="h-12 w-12 text-primary" />
          </div>
          <h2 className="font-display text-2xl text-foreground">No sessions yet ♡</h2>
          <p className="text-muted-foreground font-body">
            Your ClickStudio sessions will appear here once you save them to the
            cloud.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* ── Header ── */}
      <div className="p-6 border-b border-border bg-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl text-foreground">Session History</h1>
            <p className="text-sm text-muted-foreground font-body">
              {filteredSessions.length} of {allSessions.length} sessions
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Save current session to cloud */}
            {isCurrentUnsaved && capturedPhotos.length > 0 && (
              <Button
                size="sm"
                pill
                loading={isSyncing}
                onClick={handleSaveToCloud}
                icon={<Upload className="h-4 w-4" />}
              >
                Save to Cloud
              </Button>
            )}

            {/* Refresh */}
            <Button
              variant="ghost"
              size="sm"
              loading={isSyncing}
              onClick={() => fetchSessions()}
              icon={
                <RefreshCw
                  className={cn('h-4 w-4', isSyncing && 'animate-spin')}
                />
              }
              aria-label="Refresh sessions"
            />
          </div>
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by template or date…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="h-10 rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {isSyncing && allSessions.length === 0 && (
        <div className="flex-1 p-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border h-28 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* ── Sessions list ── */}
      {!isSyncing || allSessions.length > 0 ? (
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {filteredSessions.map((session, index) => {
              const isCurrentSession = session.id === currentSession?.id
              const isUnsaved = isCurrentSession && isCurrentUnsaved

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    'bg-white rounded-2xl p-6 border shadow-card hover:border-primary/30 transition-all',
                    isCurrentSession
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Camera className="h-5 w-5 text-primary" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                            {session.template.name}
                            {isCurrentSession && (
                              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                            {isUnsaved && (
                              <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                                Unsaved
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground font-body">
                            {session.photos.length} photo
                            {session.photos.length !== 1 ? 's' : ''} captured
                          </p>
                        </div>
                      </div>

                      {/* Meta chips */}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-body">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(session.createdAt).toLocaleDateString('en-US')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(session.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>
                          Duration:{' '}
                          {formatDuration(session.createdAt, session.updatedAt)}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full',
                            session.exported
                              ? 'bg-success/15 text-success'
                              : 'bg-warning/15 text-warning'
                          )}
                        >
                          {session.exported ? 'Exported' : 'Not Exported'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSession(session)}
                        icon={<Eye className="h-4 w-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportSession(session)}
                        icon={<Download className="h-4 w-4" />}
                      />
                      {!isCurrentSession && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
                          icon={<Trash2 className="h-4 w-4 text-error" />}
                        />
                      )}
                    </div>
                  </div>

                  {/* Photo thumbnails */}
                  {session.photos.length > 0 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto">
                      {session.photos.slice(0, 6).map((photo, pi) => (
                        <img
                          key={photo.id}
                          src={photo.url}
                          alt={`Photo ${pi + 1}`}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-border"
                        />
                      ))}
                      {session.photos.length > 6 && (
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-xs text-muted-foreground flex-shrink-0 border border-border">
                          +{session.photos.length - 6}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* ── Detail modal ── */}
      <Modal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        title="Session Details"
        size="lg"
      >
        {selectedSession && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground font-body mb-1">Template</p>
                <p className="text-foreground font-medium">
                  {selectedSession.template.name}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground font-body mb-1">Photos</p>
                <p className="text-foreground">
                  {selectedSession.photos.length} captured
                </p>
              </div>
              <div>
                <p className="text-muted-foreground font-body mb-1">Created</p>
                <p className="text-foreground">
                  {new Date(selectedSession.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground font-body mb-1">Last Modified</p>
                <p className="text-foreground">
                  {new Date(selectedSession.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {selectedSession.photos.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground font-body mb-3">Photos</p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedSession.photos.map((photo, i) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={`Photo ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-xl border border-border"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                pill
                onClick={() => handleExportSession(selectedSession)}
                icon={<Download className="h-4 w-4" />}
              >
                Export
              </Button>
              {selectedSession.id !== currentSession?.id && (
                <Button
                  variant="danger"
                  pill
                  loading={isSyncing}
                  onClick={() => handleDeleteSession(selectedSession.id)}
                  icon={<Trash2 className="h-4 w-4" />}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
