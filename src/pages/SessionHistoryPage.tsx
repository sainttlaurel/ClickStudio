import { useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'
import type { PhotoSession } from '@/types'

// Mock data for demonstration
const mockSessions: PhotoSession[] = [
  {
    id: 'session-1',
    photos: [],
    template: {
      id: 'quad-square',
      name: 'Four Photos',
      preview: '',
      layout: 'quad',
      aspectRatio: '1:1',
    },
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now() - 86400000,
    exported: true,
  },
  {
    id: 'session-2',
    photos: [],
    template: {
      id: 'double-vertical',
      name: 'Double Strip',
      preview: '',
      layout: 'double',
      aspectRatio: '2:3',
    },
    createdAt: Date.now() - 172800000, // 2 days ago
    updatedAt: Date.now() - 172800000,
    exported: false,
  },
]

export default function SessionHistoryPage() {
  const { currentSession } = usePhotoStore()
  const { success } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSession, setSelectedSession] = useState<PhotoSession | null>(
    null
  )
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  // Combine current session with mock history
  const allSessions = currentSession
    ? [currentSession, ...mockSessions]
    : mockSessions

  const filteredSessions = allSessions
    .filter(session => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        session.template.name.toLowerCase().includes(searchLower) ||
        new Date(session.createdAt)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower)
      )
    })
    .sort((a, b) => {
      return sortBy === 'newest'
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt
    })

  const handleDeleteSession = (_sessionId: string) => {
    // TODO: Implement session deletion
    success('Session deleted', 'Session has been removed from history')
  }

  const handleExportSession = (_session: PhotoSession) => {
    // TODO: Implement session export
    success('Export started', 'Session is being prepared for download')
  }

  const formatDuration = (createdAt: number, updatedAt: number) => {
    const duration = updatedAt - createdAt
    const minutes = Math.floor(duration / 60000)
    return minutes < 1 ? '< 1 minute' : `${minutes} minutes`
  }

  if (allSessions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-24 w-24 rounded-full bg-white border border-border flex items-center justify-center mx-auto">
            <History className="h-12 w-12 text-primary" />
          </div>
          <h2 className="font-display text-2xl text-text">No sessions yet ♡</h2>
          <p className="text-muted">
            Your ClickStudio sessions will appear here. Start your first session
            to see it in history!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-text">Session History</h1>
            <p className="text-muted">
              {filteredSessions.length} of {allSessions.length} sessions
            </p>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'newest' | 'oldest')}
            className={cn(
              'h-10 rounded-xl border border-border bg-white px-3 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary'
            )}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                'bg-white rounded-2xl p-6 border border-border shadow-card hover:border-primary/30 transition-all',
                session.id === currentSession?.id &&
                  'border-primary/50 bg-primary/5'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Camera className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-text flex items-center gap-2">
                        {session.template.name}
                        {session.id === currentSession?.id && (
                          <span className="px-2 py-1 text-xs bg-primary text-background rounded-full">
                            Current
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted">
                        {session.photos.length} photos captured
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted" />
                      <span className="text-text">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted" />
                      <span className="text-text">
                        {new Date(session.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-muted">Duration:</span>
                      <span className="text-text">
                        {formatDuration(session.createdAt, session.updatedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-muted">Status:</span>
                      <span
                        className={cn(
                          'px-2 py-1 text-xs rounded-full',
                          session.exported
                            ? 'bg-success/20 text-success'
                            : 'bg-warning/20 text-warning'
                        )}
                      >
                        {session.exported ? 'Exported' : 'Not Exported'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
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

                  {session.id !== currentSession?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSession(session.id)}
                      icon={<Trash2 className="h-4 w-4" />}
                    />
                  )}
                </div>
              </div>

              {/* Photo Thumbnails */}
              {session.photos.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto">
                  {session.photos.slice(0, 6).map((photo, photoIndex) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={`Photo ${photoIndex + 1}`}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  ))}
                  {session.photos.length > 6 && (
                    <div className="w-12 h-12 bg-rose-50 rounded flex items-center justify-center text-xs text-muted flex-shrink-0">
                      +{session.photos.length - 6}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Session Details Modal */}
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
                <label className="block text-muted mb-1">Template</label>
                <div className="text-text font-medium">
                  {selectedSession.template.name}
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1">Photos</label>
                <div className="text-text">
                  {selectedSession.photos.length} captured
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1">Created</label>
                <div className="text-text">
                  {new Date(selectedSession.createdAt).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1">Last Modified</label>
                <div className="text-text">
                  {new Date(selectedSession.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>

            {selectedSession.photos.length > 0 && (
              <div>
                <label className="block text-muted mb-3">Photos</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedSession.photos.map((photo, index) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => handleExportSession(selectedSession)}
                icon={<Download className="h-4 w-4" />}
              >
                Export Session
              </Button>

              {selectedSession.id !== currentSession?.id && (
                <Button
                  variant="danger"
                  onClick={() => {
                    handleDeleteSession(selectedSession.id)
                    setSelectedSession(null)
                  }}
                  icon={<Trash2 className="h-4 w-4" />}
                >
                  Delete Session
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
