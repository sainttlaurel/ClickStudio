import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Save,
  Undo,
  RotateCw,
  Crop,
  Palette,
  Sliders,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { usePhotoStore } from '@/store/usePhotoStore'
import { useToast } from '@/store/useUIStore'
import { cn } from '@/utils/cn'
import type { PhotoAdjustments } from '@/types'

const defaultAdjustments: PhotoAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  shadows: 0,
  highlights: 0,
  temperature: 0,
  tint: 0,
}

export default function EditorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { success, error } = useToast()
  const { capturedPhotos, updatePhoto } = usePhotoStore()

  const photoId = location.state?.photoId
  const currentPhoto = capturedPhotos.find(p => p.id === photoId)

  const [adjustments, setAdjustments] = useState<PhotoAdjustments>(
    currentPhoto?.metadata?.adjustments || defaultAdjustments
  )
  const [activeTab, setActiveTab] = useState<'adjust' | 'filters' | 'crop'>(
    'adjust'
  )
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (!currentPhoto) {
      navigate('/preview')
      return
    }

    drawImage()
  }, [currentPhoto, adjustments])

  const drawImage = () => {
    if (!currentPhoto || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // Apply adjustments
      ctx.filter = `
        brightness(${100 + adjustments.brightness}%)
        contrast(${100 + adjustments.contrast}%)
        saturate(${100 + adjustments.saturation}%)
        hue-rotate(${adjustments.temperature}deg)
      `

      ctx.drawImage(img, 0, 0)
    }
    img.src = currentPhoto.url
  }

  const handleAdjustmentChange = (
    key: keyof PhotoAdjustments,
    value: number
  ) => {
    setAdjustments(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!currentPhoto || !canvasRef.current) return

    try {
      const canvas = canvasRef.current
      const editedImageUrl = canvas.toDataURL('image/png', 1.0)

      updatePhoto(currentPhoto.id, {
        url: editedImageUrl,
        metadata: {
          ...currentPhoto.metadata,
          width: currentPhoto.metadata?.width || canvas.width,
          height: currentPhoto.metadata?.height || canvas.height,
          size: currentPhoto.metadata?.size || editedImageUrl.length,
          format: currentPhoto.metadata?.format || 'png',
          adjustments: adjustments,
        },
      })

      setHasChanges(false)
      success('Photo saved', 'Your edits have been applied to the photo')
    } catch (err) {
      error('Save failed', 'Could not save photo edits')
    }
  }

  const handleReset = () => {
    setAdjustments(defaultAdjustments)
    setHasChanges(true)
  }

  if (!currentPhoto) {
    return null
  }

  const adjustmentControls = [
    { key: 'brightness' as const, label: 'Brightness', min: -100, max: 100 },
    { key: 'contrast' as const, label: 'Contrast', min: -100, max: 100 },
    { key: 'saturation' as const, label: 'Saturation', min: -100, max: 100 },
    { key: 'exposure' as const, label: 'Exposure', min: -100, max: 100 },
    { key: 'shadows' as const, label: 'Shadows', min: -100, max: 100 },
    { key: 'highlights' as const, label: 'Highlights', min: -100, max: 100 },
    { key: 'temperature' as const, label: 'Temperature', min: -50, max: 50 },
    { key: 'tint' as const, label: 'Tint', min: -50, max: 50 },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/preview')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Preview
          </Button>
          <h1 className="font-display text-xl text-text">Edit your photo ✶</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            icon={<Undo className="h-4 w-4" />}
          >
            Reset
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges}
            icon={<Save className="h-4 w-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-6 bg-white">
          <div className="relative max-w-4xl w-full">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full rounded-xl shadow-2xl"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '70vh',
              }}
            />
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-80 border-l border-border bg-white">
          {/* Tabs */}
          <div className="flex bg-white border-b border-border">
            {[
              { key: 'adjust' as const, label: 'Adjust', icon: Sliders },
              { key: 'filters' as const, label: 'Filters', icon: Palette },
              { key: 'crop' as const, label: 'Crop', icon: Crop },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium',
                  'border-b-2 transition-colors',
                  activeTab === tab.key
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted hover:text-text'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'adjust' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-text">Adjustments</h3>

                <div className="space-y-4">
                  {adjustmentControls.map(control => (
                    <Slider
                      key={control.key}
                      label={control.label}
                      value={adjustments[control.key]}
                      onChange={value =>
                        handleAdjustmentChange(control.key, value)
                      }
                      min={control.min}
                      max={control.max}
                      step={1}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                  icon={<Undo className="h-4 w-4" />}
                >
                  Reset All
                </Button>
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-text">Filters</h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Original',
                    'B&W',
                    'Vintage',
                    'Vibrant',
                    'Cool',
                    'Warm',
                  ].map(filter => (
                    <motion.button
                      key={filter}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'aspect-square rounded-xl border-2 transition-all',
                        'flex items-center justify-center text-sm font-medium',
                        'border-border hover:border-primary/30 bg-white hover:bg-rose-50'
                      )}
                    >
                      {filter}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'crop' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-text">Crop & Rotate</h3>

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={<RotateCw className="h-4 w-4" />}
                  >
                    Rotate 90°
                  </Button>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Free', '1:1', '4:3', '16:9'].map(ratio => (
                        <Button
                          key={ratio}
                          variant="outline"
                          size="sm"
                          className="justify-center"
                        >
                          {ratio}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted">
            Size: {currentPhoto.metadata?.width}×{currentPhoto.metadata?.height}
          </div>

          {hasChanges && <div className="text-warning">Unsaved changes</div>}
        </div>
      </div>
    </div>
  )
}
