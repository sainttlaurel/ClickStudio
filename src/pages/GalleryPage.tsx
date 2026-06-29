import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Grid3X3,
  List,
  Search,
  Filter,
  Download,
  Share2,
  Trash2,
  Calendar,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'

export default function GalleryPage() {
  const { capturedPhotos, removePhoto } = usePhotoStore()
  const { success } = useToast()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  const filteredPhotos = capturedPhotos
    .filter(photo => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      const date = new Date(photo.timestamp).toLocaleDateString().toLowerCase()
      return date.includes(searchLower)
    })
    .sort((a, b) => {
      return sortBy === 'newest'
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp
    })

  const selectedPhotoData = capturedPhotos.find(p => p.id === selectedPhoto)

  const handleDelete = (photoId: string) => {
    removePhoto(photoId)
    setSelectedPhoto(null)
    success('Photo deleted', 'Photo has been removed from gallery')
  }

  const handleShare = async (photo: any) => {
    if (navigator.share) {
      try {
        const response = await fetch(photo.url)
        const blob = await response.blob()
        const file = new File([blob], `photo-${photo.id}.png`, {
          type: 'image/png',
        })

        await navigator.share({
          title: 'ClickStudio photo',
          files: [file],
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      // Fallback: download
      const link = document.createElement('a')
      link.href = photo.url
      link.download = `photo-${photo.id}.png`
      link.click()
      success('Photo downloaded', 'Photo saved to your device')
    }
  }

  if (capturedPhotos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-24 w-24 rounded-full bg-white border border-border flex items-center justify-center mx-auto">
            <Grid3X3 className="h-12 w-12 text-primary" />
          </div>
          <h2 className="font-display text-2xl text-text">No photos yet ♡</h2>
          <p className="text-muted-foreground font-body">
            Your captured photos will appear here. Start taking photos to build
            your gallery!
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
            <h1 className="font-display text-3xl text-text">Gallery</h1>
            <p className="text-muted-foreground font-body">
              {filteredPhotos.length} of {capturedPhotos.length} photos
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              icon={<Grid3X3 className="h-4 w-4" />}
            >
              Grid
            </Button>

            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              icon={<List className="h-4 w-4" />}
            >
              List
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by date..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex items-center gap-2">
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

            <Button
              variant="ghost"
              size="sm"
              icon={<Filter className="h-4 w-4" />}
            >
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedPhoto(photo.id)}
              >
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Eye className="h-4 w-4" />}
                      className="text-white hover:bg-white/20"
                    >
                      View
                    </Button>
                  </div>
                </div>

                {/* Date Badge */}
                <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                  {new Date(photo.timestamp).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary transition-colors group"
              >
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-16 h-16 rounded-lg object-cover cursor-pointer"
                  onClick={() => setSelectedPhoto(photo.id)}
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text truncate">
                    Photo {index + 1}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-body">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(photo.timestamp).toLocaleString()}
                    </span>
                    <span>
                      {photo.metadata?.width}×{photo.metadata?.height}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPhoto(photo.id)}
                    icon={<Eye className="h-4 w-4" />}
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(photo)}
                    icon={<Share2 className="h-4 w-4" />}
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(photo.id)}
                    icon={<Trash2 className="h-4 w-4" />}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <Modal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        size="xl"
        title="Photo Details"
      >
        {selectedPhotoData && (
          <div className="space-y-6">
            <div className="text-center">
              <img
                src={selectedPhotoData.url}
                alt="Selected photo"
                className="max-w-full max-h-96 mx-auto rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-muted-foreground font-body mb-1">Captured</label>
                <div className="text-text">
                  {new Date(selectedPhotoData.timestamp).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-body mb-1">Size</label>
                <div className="text-text">
                  {selectedPhotoData.metadata?.width}×
                  {selectedPhotoData.metadata?.height}
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-body mb-1">Format</label>
                <div className="text-text">
                  {selectedPhotoData.metadata?.format?.toUpperCase() || 'PNG'}
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-body mb-1">File Size</label>
                <div className="text-text">
                  {selectedPhotoData.metadata?.size
                    ? Math.round(selectedPhotoData.metadata.size / 1024) + ' KB'
                    : 'Unknown'}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                onClick={() => handleShare(selectedPhotoData)}
                icon={<Share2 className="h-4 w-4" />}
                className="rounded-full"
              >
                Share
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = selectedPhotoData.url
                  link.download = `photo-${selectedPhotoData.id}.png`
                  link.click()
                }}
                icon={<Download className="h-4 w-4" />}
                className="rounded-full"
              >
                Download
              </Button>

              <Button
                variant="danger"
                onClick={() => handleDelete(selectedPhotoData.id)}
                icon={<Trash2 className="h-4 w-4" />}
                className="rounded-full"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
