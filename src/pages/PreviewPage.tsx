import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Edit,
  Download,
  Share2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Grid3X3,
  Maximize2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'

export default function PreviewPage() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const { capturedPhotos, removePhoto, currentSession } = usePhotoStore()
  const [selectedPhoto, setSelectedPhoto] = useState(0)
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single')

  if (capturedPhotos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-white border border-border flex items-center justify-center mx-auto">
            <Grid3X3 className="h-12 w-12 text-primary" />
          </div>
          <h2 className="font-display text-2xl text-text">No photos yet ♡</h2>
          <p className="text-muted max-w-sm">
            Your beautiful photos will appear here. Head to the camera and start
            capturing memories!
          </p>
          <Button onClick={() => navigate('/camera')}>Go to Camera</Button>
        </div>
      </div>
    )
  }

  const currentPhoto = capturedPhotos[selectedPhoto]

  const handleDelete = (photoId: string) => {
    removePhoto(photoId)
    if (selectedPhoto >= capturedPhotos.length - 1) {
      setSelectedPhoto(Math.max(0, capturedPhotos.length - 2))
    }
    success('Photo deleted', 'Photo has been removed from the session')
  }

  const handleEdit = () => {
    navigate('/editor', { state: { photoId: currentPhoto.id } })
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    success('Export started', 'Your photos are being prepared for download')
  }

  const handleShare = async () => {
    if (navigator.share && currentPhoto) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(currentPhoto.url)
        const blob = await response.blob()
        const file = new File([blob], `photo-${currentPhoto.id}.png`, {
          type: 'image/png',
        })

        await navigator.share({
          title: 'ClickStudio photo',
          text: 'Check out this photo from ClickStudio!',
          files: [file],
        })
      } catch (err) {
        error('Share failed', 'Could not share photo')
      }
    } else {
      // Fallback: copy to clipboard or download
      const link = document.createElement('a')
      link.href = currentPhoto.url
      link.download = `photo-${currentPhoto.id}.png`
      link.click()
      success('Photo downloaded', 'Photo has been saved to your device')
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-text">Preview</h1>
          {currentSession && (
            <span className="text-sm text-muted">
              {capturedPhotos.length} photos in session
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'single' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('single')}
            icon={<Maximize2 className="h-4 w-4" />}
            className="rounded-full"
          >
            Single
          </Button>

          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            icon={<Grid3X3 className="h-4 w-4" />}
            className="rounded-full"
          >
            Grid
          </Button>
        </div>
      </div>

      {viewMode === 'single' ? (
        <div className="flex-1 flex">
          {/* Main Photo */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative max-w-4xl w-full">
              <motion.img
                key={currentPhoto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={currentPhoto.url}
                alt={`Photo ${selectedPhoto + 1}`}
                className="w-full h-auto rounded-xl shadow-2xl"
              />

              {/* Navigation Arrows */}
              {capturedPhotos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border border-border shadow-sm"
                    onClick={() =>
                      setSelectedPhoto(
                        (selectedPhoto - 1 + capturedPhotos.length) %
                          capturedPhotos.length
                      )
                    }
                    icon={<ArrowLeft className="h-6 w-6" />}
                    disabled={selectedPhoto === 0}
                  />

                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-border shadow-sm"
                    onClick={() =>
                      setSelectedPhoto(
                        (selectedPhoto + 1) % capturedPhotos.length
                      )
                    }
                    icon={<ArrowRight className="h-6 w-6" />}
                    disabled={selectedPhoto === capturedPhotos.length - 1}
                  />
                </>
              )}
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="w-80 border-l border-border bg-white p-6 space-y-6">
            <div>
              <h3 className="font-display text-lg text-text mb-4">
                Photo Actions
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={handleEdit}
                  icon={<Edit className="h-4 w-4" />}
                  className="w-full justify-start"
                >
                  Edit Photo
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  icon={<Share2 className="h-4 w-4" />}
                  className="w-full justify-start"
                >
                  Share
                </Button>

                <Button
                  variant="outline"
                  onClick={handleExport}
                  icon={<Download className="h-4 w-4" />}
                  className="w-full justify-start"
                >
                  Export
                </Button>

                <Button
                  variant="danger"
                  onClick={() => handleDelete(currentPhoto.id)}
                  icon={<Trash2 className="h-4 w-4" />}
                  className="w-full justify-start"
                >
                  Delete Photo
                </Button>
              </div>
            </div>

            {/* Photo Info */}
            <div>
              <h3 className="font-semibold text-text mb-4">Photo Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Size:</span>
                  <span className="text-text">
                    {currentPhoto.metadata?.width}×
                    {currentPhoto.metadata?.height}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Format:</span>
                  <span className="text-text">
                    {currentPhoto.metadata?.format?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Captured:</span>
                  <span className="text-text">
                    {new Date(currentPhoto.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="flex-1 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {capturedPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  'relative group cursor-pointer rounded-lg overflow-hidden',
                  'ring-2 transition-all duration-200',
                  selectedPhoto === index
                    ? 'ring-primary'
                    : 'ring-transparent hover:ring-border'
                )}
                onClick={() => {
                  setSelectedPhoto(index)
                  setViewMode('single')
                }}
              >
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation()
                        handleDelete(photo.id)
                      }}
                      icon={<Trash2 className="h-3 w-3" />}
                      aria-label="Delete photo"
                    />
                  </div>
                </div>

                {/* Photo Number */}
                <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Filmstrip (Single view only) */}
      {viewMode === 'single' && capturedPhotos.length > 1 && (
        <div className="border-t border-border p-4">
          <div className="flex gap-2 overflow-x-auto">
            {capturedPhotos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(index)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                  selectedPhoto === index
                    ? 'border-primary'
                    : 'border-transparent hover:border-border'
                )}
              >
                <img
                  src={photo.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
