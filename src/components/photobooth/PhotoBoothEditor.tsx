import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptureScreen } from './CaptureScreen'
import { EditScreen } from './EditScreen'
import { usePhotoStore } from '@/store/usePhotoStore'
import type { PhotoAdjustments } from '@/types'

export const PhotoBoothEditor = () => {
  const navigate = useNavigate()
  const [currentScreen, setCurrentScreen] = useState<'capture' | 'edit'>('capture')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const { capturedPhotos, addPhoto, startNewSession } = usePhotoStore()

  const [adjustments, setAdjustments] = useState<PhotoAdjustments>({
    brightness: 0, contrast: 0, saturation: 0,
    exposure: 0, shadows: 0, highlights: 0,
    temperature: 0, tint: 0
  })
  const [activeFilter, setActiveFilter] = useState('none')
  const [activeFrame, setActiveFrame] = useState('none')
  const [placedStickers, setPlacedStickers] = useState<Array<{ id: string; emoji: string; x: number; y: number; scale?: number; rotation?: number }>>([])
  const [placedTexts, setPlacedTexts] = useState<Array<{ id: string; text: string; color: string; fontSize: number; x: number; y: number; font?: string }>>([])
  const [undoStack, setUndoStack] = useState<Array<{
    adjustments: PhotoAdjustments
    activeFilter: string
    activeFrame: string
    placedStickers: typeof placedStickers
    placedTexts: typeof placedTexts
  }>>([])

  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-49), {
      adjustments,
      activeFilter,
      activeFrame,
      placedStickers,
      placedTexts
    }])
  }, [adjustments, activeFilter, activeFrame, placedStickers, placedTexts])

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))
    setAdjustments(prev.adjustments)
    setActiveFilter(prev.activeFilter)
    setActiveFrame(prev.activeFrame)
    setPlacedStickers(prev.placedStickers)
    setPlacedTexts(prev.placedTexts)
  }, [undoStack])

  const handleCapture = (imageUrl: string) => {
    setCapturedImage(imageUrl)
    setCurrentScreen('edit')
    startNewSession({
      id: 'studio-session',
      name: 'Single Photo',
      preview: '',
      layout: 'single',
      aspectRatio: '1:1',
      compositeStyle: 'clean'
    })
  }

  const handleBack = () => {
    if (currentScreen === 'edit') {
      setCurrentScreen('capture')
    }
  }

  const handleReset = () => {
    setAdjustments({ brightness: 0, contrast: 0, saturation: 0, exposure: 0, shadows: 0, highlights: 0, temperature: 0, tint: 0 })
    setActiveFilter('none')
    setActiveFrame('none')
    setPlacedStickers([])
    setPlacedTexts([])
  }

  const handleSave = () => {
    if (!capturedImage) return
    addPhoto({
      id: `photo-${Date.now()}`,
      url: capturedImage,
      timestamp: Date.now(),
      metadata: {
        width: 0,
        height: 0,
        size: 0,
        format: 'png',
        filters: [{ id: activeFilter, name: activeFilter, preview: '', intensity: 1 }],
        adjustments
      }
    })
    navigate('/preview')
  }

  return (
    <div className="h-screen bg-[#F7F7F8] overflow-hidden">
      <div className="h-full flex">
        {/* Left Sidebar */}
        <div className="w-16 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4">
          <div className="w-10 h-10 rounded-full bg-[#EC1A66] text-white font-bold flex items-center justify-center text-sm mb-12">
            S
          </div>
          
          <div className="flex flex-col gap-4 items-center flex-1">
            <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full flex items-center justify-center transition-all text-gray-400 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M9 21h6" />
              </svg>
            </button>
            
            <button 
              onClick={() => setCurrentScreen('capture')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentScreen === 'capture' 
                  ? 'bg-[#EC1A66] text-white' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </button>
            
            <button onClick={() => navigate('/gallery')} className="w-10 h-10 rounded-full flex items-center justify-center transition-all text-gray-400 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            <button 
              onClick={() => setCurrentScreen('edit')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentScreen === 'edit' 
                  ? 'bg-[#EC1A66] text-white' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button onClick={() => navigate('/history')} className="w-10 h-10 rounded-full flex items-center justify-center transition-all text-gray-400 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col gap-4 items-center mt-auto">
            <button onClick={() => navigate('/settings')} className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37.96 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 002.573-1.065z" />
              </svg>
            </button>
            <button onClick={() => navigate('/help')} className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.372 2.033-2.349 3.772-2.349 2.294 0 4.282 1.938 4.936 4.443m.59 3.249L14.79 17.553M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button onClick={() => navigate('/about')} className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm">
              {currentScreen === 'capture' ? (
                <>
                  <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <span>‹</span>
                    <span>Back</span>
                  </button>
                  <span className="text-gray-900 font-medium">Single Photo</span>
                  <span className="text-gray-400 text-xs">·</span>
                  <span className="text-gray-400">1 pose</span>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span>‹</span>
                    <span>Back</span>
                  </button>
                  <span className="text-gray-400">Preview</span>
                  <span className="text-gray-400 text-xs">›</span>
                  <span className="text-gray-900 font-medium">Edit photo</span>
                </>
              )}
            </div>
            
            {currentScreen === 'edit' && (
              <div className="flex gap-2">
                <button 
                  onClick={handleReset}
                  className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
                <button 
                  onClick={handleUndo}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                    undoStack.length > 0
                      ? 'border-gray-200 text-gray-700 hover:bg-gray-50' 
                      : 'border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Undo
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-full bg-[#EC1A66] text-white font-medium text-sm hover:bg-[#EC1A66]/90 transition-all"
                >
                  Save
                </button>
              </div>
            )}

            {currentScreen === 'capture' && (
              <div className="text-sm text-gray-400">
                {capturedPhotos.length} / 1 captured
              </div>
            )}
          </div>

          {/* Content */}
          {currentScreen === 'capture' ? (
            <CaptureScreen onCapture={handleCapture} />
          ) : (
            <EditScreen 
              imageUrl={capturedImage}
              adjustments={adjustments}
              onAdjustmentsChange={(val) => { pushUndo(); setAdjustments(val) }}
              activeFilter={activeFilter}
              onFilterChange={(id) => { pushUndo(); setActiveFilter(id) }}
              activeFrame={activeFrame}
              onFrameChange={(id) => { pushUndo(); setActiveFrame(id) }}
              placedStickers={placedStickers}
              onStickersChange={(s) => { pushUndo(); setPlacedStickers(s) }}
              placedTexts={placedTexts}
              onTextsChange={(t) => { pushUndo(); setPlacedTexts(t) }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
