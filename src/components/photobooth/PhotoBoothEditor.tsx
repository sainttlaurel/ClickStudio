import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Camera, Image, Edit3, Clock, Settings, HelpCircle, Info } from 'lucide-react'
import { CaptureScreen } from './CaptureScreen'
import { EditScreen } from './EditScreen'
import { usePhotoStore } from '@/store/usePhotoStore'
import type { PhotoAdjustments } from '@/types'
import { bakePhotoEdits } from '@/utils/bakeEdits'
import { FILTERS } from '@/constants/filters'
import { calcFrameHeight } from '@/constants/frames'
import type { TemplateLibraryItem } from '@/constants/templates'

type Screen = 'capture' | 'edit' | 'preview'

interface StickerData {
  id: string; emoji: string; x: number; y: number; scale?: number; rotation?: number
}
interface TextData {
  id: string; text: string; color: string; fontSize: number; x: number; y: number; font?: string
}

const COMPOSITE_TO_FRAME: Record<string, string> = {
  clean: 'none', polaroid: 'polaroid', film: 'film', blush: 'blush', minimal: 'minimal'
}

export const PhotoBoothEditor = () => {
  const navigate = useNavigate()
  const [currentScreen, setCurrentScreen] = useState<Screen>('capture')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [bakedImage, setBakedImage] = useState<string | null>(null)
  const [captureCount, setCaptureCount] = useState(0)
  const { addPhoto, startNewSession } = usePhotoStore()

  const [adjustments, setAdjustments] = useState<PhotoAdjustments>({
    brightness: 0, contrast: 0, saturation: 0,
    exposure: 0, shadows: 0, highlights: 0,
    temperature: 0, tint: 0
  })
  const [activeFilter, setActiveFilter] = useState('none')
  const [activeFrame, setActiveFrame] = useState('none')
  const [activeFrameImage, setActiveFrameImage] = useState<string | undefined>(undefined)
  const [selectedStickerEmoji, setSelectedStickerEmoji] = useState<string | null>(null)
  const [placedStickers, setPlacedStickers] = useState<StickerData[]>([])
  const [placedTexts, setPlacedTexts] = useState<TextData[]>([])
  const [undoStack, setUndoStack] = useState<Array<{
    adjustments: PhotoAdjustments; activeFilter: string; activeFrame: string
    placedStickers: StickerData[]; placedTexts: TextData[]; selectedStickerEmoji: string | null
  }>>([])

  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-49), {
      adjustments, activeFilter, activeFrame, placedStickers, placedTexts, selectedStickerEmoji
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
    setSelectedStickerEmoji(prev.selectedStickerEmoji)
  }, [undoStack])

  const handleTemplateSelect = useCallback((template: TemplateLibraryItem | null) => {
    if (!template) {
      setActiveFrameImage(undefined)
      return
    }
    if (template.compositeStyle === 'frame' && template.frameImage) {
      setActiveFrame('none')
      setActiveFrameImage(template.frameImage)
    } else {
      setActiveFrame(COMPOSITE_TO_FRAME[template.compositeStyle] || 'none')
      setActiveFrameImage(undefined)
    }
  }, [])

  const handleCapture = (imageUrl: string) => {
    setCapturedImage(imageUrl)
    setCaptureCount(1)
    setCurrentScreen('edit')
    startNewSession({
      id: 'studio-session', name: 'Single Photo', preview: '',
      layout: 'single', aspectRatio: '1:1', compositeStyle: 'clean'
    })
  }

  const handleBack = () => {
    if (currentScreen === 'edit') { setCurrentScreen('capture'); setBakedImage(null) }
    if (currentScreen === 'preview') setCurrentScreen('edit')
  }

  const handleReset = () => {
    setAdjustments({ brightness: 0, contrast: 0, saturation: 0, exposure: 0, shadows: 0, highlights: 0, temperature: 0, tint: 0 })
    setActiveFilter('none'); setActiveFrame('none'); setActiveFrameImage(undefined); setSelectedStickerEmoji(null); setPlacedStickers([]); setPlacedTexts([])
  }

  const handleCanvasClick = (x: number, y: number) => {
    if (!selectedStickerEmoji) return
    setPlacedStickers(prev => [...prev, {
      id: `sticker-${Date.now()}`,
      emoji: selectedStickerEmoji,
      x, y, scale: 1, rotation: 0
    }])
    setSelectedStickerEmoji(null)
  }

  const handleSave = async () => {
    if (!capturedImage) return
    const filterObj = FILTERS.find(f => f.id === activeFilter)
    const bakedUrl = await bakePhotoEdits({
      imageUrl: capturedImage,
      filterCss: filterObj?.css || 'none',
      adjustments,
      stickers: placedStickers,
      texts: placedTexts,
      frameId: activeFrame,
      frameImage: activeFrameImage,
    })
    addPhoto({
      id: `photo-${Date.now()}`,
      url: bakedUrl,
      timestamp: Date.now(),
      metadata: {
        width: 0, height: 0, size: 0, format: 'png',
        filters: [{ id: activeFilter, name: activeFilter, preview: '', intensity: 1 }],
        adjustments
      }
    })
    setCurrentScreen('preview')
    setBakedImage(bakedUrl)
  }

  const handleDownload = () => {
    if (!bakedImage) return
    const link = document.createElement('a')
    link.href = bakedImage
    link.download = `clickstudio-${Date.now()}.png`
    link.click()
  }

  const breadcrumb = () => {
    if (currentScreen === 'capture') return 'Capture'
    if (currentScreen === 'edit') return 'Edit photo'
    return 'Saved!'
  }

  return (
    <div className="h-screen bg-[#F7F7F8] overflow-hidden">
      <div className="h-full flex">
        {/* Left Sidebar */}
        <div className="w-16 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4">
          <div className="w-10 h-10 rounded-full bg-studio text-white font-bold flex items-center justify-center text-sm mb-12">S</div>
          <div className="flex flex-col gap-4 items-center flex-1">
            <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <Home className="w-5 h-5" />
            </button>
            <button onClick={() => { setCurrentScreen('capture'); setCaptureCount(0) }} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentScreen === 'capture' ? 'bg-studio text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
              <Camera className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/gallery')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <Image className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentScreen('edit')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentScreen === 'edit' || currentScreen === 'preview' ? 'bg-studio text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
              <Edit3 className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/history')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <Clock className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col gap-4 items-center mt-auto">
            <button onClick={() => navigate('/settings')} className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/help')} className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/about')} className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <button onClick={currentScreen === 'capture' ? undefined : handleBack} className={`flex items-center gap-1 ${currentScreen === 'capture' ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
                <span>‹</span>
                <span>Back</span>
              </button>
              <span className="text-gray-400 text-xs">·</span>
              <span className={currentScreen === 'capture' ? 'text-gray-900 font-medium' : 'text-gray-400'}>{breadcrumb()}</span>
            </div>

            {currentScreen === 'edit' && (
              <div className="flex gap-2">
                <button onClick={handleReset} className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">Reset</button>
                <button onClick={handleUndo} className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${undoStack.length > 0 ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-gray-100 text-gray-300 cursor-not-allowed'}`}>Undo</button>
                <button onClick={handleSave} className="px-4 py-1.5 rounded-full bg-studio text-white font-medium text-sm hover:bg-studio/90 transition-all">Save</button>
              </div>
            )}

            {currentScreen === 'preview' && (
              <div className="flex gap-2">
                <button onClick={handleBack} className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">Edit Again</button>
                <button onClick={handleDownload} className="px-4 py-1.5 rounded-full bg-studio text-white font-medium text-sm hover:bg-studio/90 transition-all">Download</button>
                <button onClick={() => navigate('/gallery')} className="px-4 py-1.5 rounded-full bg-gray-800 text-white font-medium text-sm hover:bg-gray-700 transition-all">Gallery</button>
              </div>
            )}

            {currentScreen === 'capture' && (
              <div className="text-sm text-gray-400">{captureCount} / 1 captured</div>
            )}
          </div>

          {/* Content */}
          {currentScreen === 'capture' ? (
            <CaptureScreen onCapture={handleCapture} frameId={activeFrame} onFrameChange={(id) => { setActiveFrame(id); setActiveFrameImage(undefined) }} frameImage={activeFrameImage} onTemplateSelect={handleTemplateSelect} />
          ) : currentScreen === 'preview' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="relative w-[300px] rounded-2xl overflow-hidden shadow-lg mb-6" style={{ height: calcFrameHeight(300, activeFrameImage ? 'none' : activeFrame) }}>
                <img src={bakedImage || capturedImage || ''} alt="Result" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <h2 className="font-bold text-gray-900 text-xl mb-1">Saved! ✦</h2>
                <p className="text-sm text-gray-400 mb-6">Your photo has been saved to the gallery</p>
              </div>
            </div>
          ) : (
            <EditScreen
              imageUrl={capturedImage}
              adjustments={adjustments}
              onAdjustmentsChange={(val) => { pushUndo(); setAdjustments(val) }}
              activeFilter={activeFilter}
              onFilterChange={(id) => { pushUndo(); setActiveFilter(id) }}
              activeFrame={activeFrame}
              onFrameChange={(id) => { pushUndo(); setActiveFrame(id); setActiveFrameImage(undefined) }}
              frameImage={activeFrameImage}
              placedStickers={placedStickers}
              placedTexts={placedTexts}
              onTextsChange={(t) => { pushUndo(); setPlacedTexts(t) }}
              selectedStickerEmoji={selectedStickerEmoji}
              onStickerSelect={setSelectedStickerEmoji}
              onCanvasClick={handleCanvasClick}
            />
          )}
        </div>
      </div>
    </div>
  )
}
