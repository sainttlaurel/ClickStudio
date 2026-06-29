import { useEffect, useRef, useCallback, useState } from 'react'
import { cameraManager } from '@/utils/camera'
import { usePhotoStore } from '@/store/usePhotoStore'
import { cn } from '@/utils/cn'

const COLOR_SWATCHES_ROW1 = [
  { id: 'pink', color: '#EC1A66' },
  { id: 'orange', color: '#F97316' },
  { id: 'blue', color: '#60A5FA' },
  { id: 'gray', color: '#D1D5DB' },
  { id: 'purple', color: '#A78BFA' },
  { id: 'khaki', color: '#D4A574' },
  { id: 'black', color: '#1F2937' },
  { id: 'gold', color: '#F59E0B' },
  { id: 'blush', color: '#FBCFE8' }
]

const COLOR_SWATCHES_ROW2 = [
  { id: 'teal', color: '#14B8A6' },
  { id: 'lavender', color: '#C4B5FD' },
  { id: 'lightGray', color: '#E5E7EB' }
]

interface CaptureScreenProps {
  onCapture: (imageUrl: string) => void
}

export const CaptureScreen = ({ onCapture }: CaptureScreenProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES_ROW1[0].id)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const { cameraSettings } = usePhotoStore()

  useEffect(() => {
    const startCamera = async () => {
      if (!videoRef.current) return
      try {
        await cameraManager.startCamera(cameraSettings, videoRef.current)
        setCameraReady(true)
      } catch (err) {
        setCameraError('Camera access denied or unavailable')
      }
    }
    startCamera()
    return () => { cameraManager.stopCamera() }
  }, [cameraSettings])

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const imageUrl = canvas.toDataURL('image/png')
    onCapture(imageUrl)
  }, [onCapture])

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Camera viewport */}
      <div className="w-[300px] h-[300px] rounded-2xl overflow-hidden bg-[#0F172A] relative mb-8">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!cameraReady && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white/40 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-white/40 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-white/40 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-white/40 rounded-br-sm" />
            <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <span className="text-white/40 text-sm">Camera will appear here</span>
          </div>
        )}
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm p-4 text-center">
            {cameraError}
          </div>
        )}
      </div>
      
      {/* Color swatches - Row 1 */}
      <div className="flex gap-2 mb-2">
        {COLOR_SWATCHES_ROW1.map((swatch) => (
          <button
            key={swatch.id}
            onClick={() => setSelectedColor(swatch.id)}
            className={cn(
              'w-7 h-7 rounded-full transition-all',
              selectedColor === swatch.id 
                ? 'ring-2 ring-offset-2 ring-[#EC1A66] scale-110' 
                : ''
            )}
            style={{ backgroundColor: swatch.color }}
          />
        ))}
      </div>
      
      {/* Color swatches - Row 2 */}
      <div className="flex gap-2 mb-8">
        {COLOR_SWATCHES_ROW2.map((swatch) => (
          <button
            key={swatch.id}
            onClick={() => setSelectedColor(swatch.id)}
            className={cn(
              'w-7 h-7 rounded-full transition-all',
              selectedColor === swatch.id 
                ? 'ring-2 ring-offset-2 ring-[#EC1A66] scale-110' 
                : ''
            )}
            style={{ backgroundColor: swatch.color }}
          />
        ))}
      </div>
      
      {/* Shutter button */}
      <button 
        onClick={handleCapture}
        disabled={!cameraReady}
        className="w-14 h-14 rounded-full bg-[#EC1A66] flex items-center justify-center hover:bg-[#EC1A66]/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        </svg>
      </button>
    </div>
  )
}
