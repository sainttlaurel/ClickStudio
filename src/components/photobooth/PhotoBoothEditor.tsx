import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Camera, Image, Edit3, Clock, Settings, HelpCircle, Info } from 'lucide-react'
import { cn } from '@/utils/cn'
import { CaptureScreen } from './CaptureScreen'
import { EditScreen } from './EditScreen'
import { usePhotoStore } from '@/store/usePhotoStore'
import type { PhotoAdjustments } from '@/types'
import { bakePhotoEdits } from '@/utils/bakeEdits'
import { FILTERS } from '@/constants/filters'
import { calcFrameHeight } from '@/constants/frames'
import type { TemplateLibraryItem } from '@/constants/templates'

type Screen = 'capture' | 'edit'

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
  const [templateAspectRatio, setTemplateAspectRatio] = useState<string | undefined>(undefined)
  const [selectedStickerEmoji, setSelectedStickerEmoji] = useState<string | null>(null)
  const [placedStickers, setPlacedStickers] = useState<StickerData[]>([])
  const [placedTexts, setPlacedTexts] = useState<TextData[]>([])
  const [zoom, setZoom] = useState(1)
  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const zoomIndex = zoomLevels.indexOf(zoom)
  const [undoStack, setUndoStack] = useState<Array<{
    adjustments: PhotoAdjustments; activeFilter: string; activeFrame: string
    placedStickers: StickerData[]; placedTexts: TextData[]; selectedStickerEmoji: string | null
  }>>([])
  const [redoStack, setRedoStack] = useState<Array<{
    adjustments: PhotoAdjustments; activeFilter: string; activeFrame: string
    placedStickers: StickerData[]; placedTexts: TextData[]; selectedStickerEmoji: string | null
  }>>([])

  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-49), {
      adjustments, activeFilter, activeFrame, placedStickers, placedTexts, selectedStickerEmoji
    }])
    setRedoStack([])
  }, [adjustments, activeFilter, activeFrame, placedStickers, placedTexts, selectedStickerEmoji])

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))
    setRedoStack(redo => [...redo, {
      adjustments, activeFilter, activeFrame, placedStickers, placedTexts, selectedStickerEmoji
    }])
    setAdjustments(prev.adjustments)
    setActiveFilter(prev.activeFilter)
    setActiveFrame(prev.activeFrame)
    setPlacedStickers(prev.placedStickers)
    setPlacedTexts(prev.placedTexts)
    setSelectedStickerEmoji(prev.selectedStickerEmoji)
  }, [undoStack, adjustments, activeFilter, activeFrame, placedStickers, placedTexts, selectedStickerEmoji])

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setRedoStack(prev => prev.slice(0, -1))
    setUndoStack(undo => [...undo, {
      adjustments, activeFilter, activeFrame, placedStickers, placedTexts, selectedStickerEmoji
    }])
    setAdjustments(next.adjustments)
    setActiveFilter(next.activeFilter)
    setActiveFrame(next.activeFrame)
    setPlacedStickers(next.placedStickers)
    setPlacedTexts(next.placedTexts)
    setSelectedStickerEmoji(next.selectedStickerEmoji)
  }, [redoStack, adjustments, activeFilter, activeFrame, placedStickers, placedTexts, selectedStickerEmoji])

  const handleTemplateSelect = useCallback((template: TemplateLibraryItem | null) => {
    if (!template) {
      setActiveFrameImage(undefined)
      setTemplateAspectRatio(undefined)
      return
    }
    if (template.compositeStyle === 'frame' && template.frameImage) {
      setActiveFrame('none')
      setActiveFrameImage(template.frameImage)
      setTemplateAspectRatio(template.aspectRatio)
    } else {
      setActiveFrame(COMPOSITE_TO_FRAME[template.compositeStyle] || 'none')
      setActiveFrameImage(undefined)
      setTemplateAspectRatio(template.aspectRatio)
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
    if (bakedImage) { setBakedImage(null); return }
    if (currentScreen === 'edit') { setCurrentScreen('capture'); setBakedImage(null) }
  }

  const handleReset = () => {
    setAdjustments({ brightness: 0, contrast: 0, saturation: 0, exposure: 0, shadows: 0, highlights: 0, temperature: 0, tint: 0 })
    setActiveFilter('none'); setActiveFrame('none'); setActiveFrameImage(undefined); setTemplateAspectRatio(undefined); setSelectedStickerEmoji(null); setPlacedStickers([]); setPlacedTexts([])
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
      templateAspectRatio,
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
    setBakedImage(bakedUrl)
  }

  const handleContinueEditing = () => {
    setBakedImage(null) // dismiss overlay, stay on edit
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
    if (currentScreen === 'edit' && bakedImage) return 'Saved!'
    if (currentScreen === 'edit') return 'Edit photo'
    return 'Saved!'
  }

  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null)

  return (
    <div className="h-screen bg-[#F7F7F8] overflow-hidden">
      <div className="h-full flex">
        {/* Left Sidebar */}
        <div className="w-16 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4 relative">
          <div className="w-10 h-10 rounded-full bg-studio text-white font-bold flex items-center justify-center text-sm mb-12">S</div>
          <div className="flex flex-col gap-4 items-center flex-1">
            <button 
              onClick={() => navigate('/')} 
              onMouseEnter={() => setHoveredTooltip('Home')}
              onMouseLeave={() => setHoveredTooltip(null)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 relative"
            >
              <Home className="w-5 h-5" />
              {hoveredTooltip === 'Home' && (
                <div className="absolute left-12 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  Home
                </div>
              )}
            </button>
            <button 
              onClick={() => { setCurrentScreen('capture'); setCaptureCount(0) }} 
              onMouseEnter={() => setHoveredTooltip('Camera')}
              onMouseLeave={() => setHoveredTooltip(null)}
              className={cn('w-10 h-10 rounded-full flex items-center justify-center transition-all relative', currentScreen === 'capture' ? 'bg-studio text-white' : 'text-gray-400 hover:bg-gray-50')}
            >
              <Camera className="w-5 h-5" />
              {hoveredTooltip === 'Camera' && (
                <div className="absolute left-12 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  Camera
                </div>
              )}
            </button>
            <button 
              onClick={() => navigate('/gallery')} 
              onMouseEnter={() => setHoveredTooltip('Gallery')}
              onMouseLeave={() => setHoveredTooltip(null)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 relative"
            >
              <Image className="w-5 h-5" />
              {hoveredTooltip === 'Gallery' && (
                <div className="absolute left-12 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  Gallery
                </div>
              )}
            </button>
            <button 
              onClick={() => setCurrentScreen('edit')} 
              onMouseEnter={() => setHoveredTooltip('Editor')}
              onMouseLeave={() => setHoveredTooltip(null)}
              className={cn('w-10 h-10 rounded-full flex items-center justify-center transition-all relative', currentScreen === 'edit' ? 'bg-studio text-white' : 'text-gray-400 hover:bg-gray-50')}
            >
              <Edit3 className="w-5 h-5" />
              {hoveredTooltip === 'Editor' && (
                <div className="absolute left-12 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  Editor
                </div>
              )}
            </button>
            <button 
              onClick={() => navigate('/history')} 
              onMouseEnter={() => setHoveredTooltip('History')}
              onMouseLeave={() => setHoveredTooltip(null)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 relative"
            >
              <Clock className="w-5 h-5" />
              {hoveredTooltip === 'History' && (
                <div className="absolute left-12 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  History
                </div>
              )}
            </button>
          </div>
          <div className="flex flex-col gap-4 items-center mt-auto">
            <button 
              onClick={() => navigate('/settings')} 
              onMouseEnter={() => setHoveredTooltip('Settings')}
              onMouseLeave={() => setHoveredTooltip(null)}
              className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500 relative"
            >
              <Settings className="w-5 h-5" />
              {hoveredTooltip === 'Settings' && (
                <div className="absolute left-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  Settings
                </div>
              )}
            </button>
            <button 
              onClick={() => navigate('/help')} 
              onMouseEnter={() => setHoveredTooltip('Help')}
              onMouseLeave={() => setHoveredTooltip(null)}
              className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500 relative"
            >
              <HelpCircle className="w-5 h-5" />
              {hoveredTooltip === 'Help' && (
                <div className="absolute left-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  Help
                </div>
              )}
            </button>
            <button 
              onClick={() => navigate('/about')} 
              onMouseEnter={() => setHoveredTooltip('About')}
              onMouseLeave={() => setHoveredTooltip(null)}
              className="w-5 h-5 text-gray-400 opacity-60 hover:text-gray-500 relative"
            >
              <Info className="w-5 h-5" />
              {hoveredTooltip === 'About' && (
                <div className="absolute left-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  About
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <button onClick={currentScreen === 'capture' ? undefined : handleBack} className={`flex items-center gap-1.5 ${currentScreen === 'capture' ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors text-sm`}>
                <span>←</span>
                <span>{bakedImage ? 'Back to Editor' : 'Back'}</span>
              </button>
              <span className="text-gray-400 text-xs">·</span>
              <span className={currentScreen === 'capture' ? 'text-gray-900 font-medium' : 'text-gray-400'}>{breadcrumb()}</span>
            </div>

            {currentScreen === 'edit' && !bakedImage && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 px-1.5 py-1">
                  <button onClick={() => setZoom(z => zoomLevels[Math.max(0, zoomLevels.indexOf(z) - 1)])} disabled={zoomIndex <= 0} className="px-1.5 py-0.5 rounded text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">−</button>
                  <span className="text-xs text-gray-500 w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => zoomLevels[Math.min(zoomLevels.length - 1, zoomLevels.indexOf(z) + 1)])} disabled={zoomIndex >= zoomLevels.length - 1} className="px-1.5 py-0.5 rounded text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">+</button>
                </div>
                <button onClick={() => setZoom(1)} className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-all">Fit</button>
              </div>
            )}

            {currentScreen === 'edit' && !bakedImage && (
              <div className="flex gap-2 items-center">
                <button onClick={handleUndo} disabled={undoStack.length === 0} className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${undoStack.length > 0 ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-gray-100 text-gray-300 cursor-not-allowed'}`} title="Undo (Ctrl+Z)">↶ Undo</button>
                <button onClick={handleRedo} disabled={redoStack.length === 0} className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${redoStack.length > 0 ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-gray-100 text-gray-300 cursor-not-allowed'}`} title="Redo (Ctrl+Y)">↷ Redo</button>
                <button onClick={handleReset} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all">Reset</button>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <button onClick={handleSave} className="px-5 py-1.5 rounded-lg bg-studio text-white font-medium text-sm hover:bg-studio/90 transition-all shadow-sm">Save</button>
              </div>
            )}

            {currentScreen === 'edit' && bakedImage && (
              <div className="flex gap-2">
                <button onClick={handleContinueEditing} className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Edit</button>
                <button onClick={handleDownload} className="px-5 py-1.5 rounded-lg bg-studio text-white font-medium text-sm hover:bg-studio/90 transition-all shadow-sm">Download</button>
                <button onClick={() => navigate('/gallery')} className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">Gallery</button>
              </div>
            )}

            {currentScreen === 'capture' && (
              <div className="text-sm text-gray-400">{captureCount} / 1 captured</div>
            )}
          </div>

          {/* Content */}
          {currentScreen === 'capture' ? (
            <CaptureScreen onCapture={handleCapture} frameId={activeFrame} onFrameChange={(id) => { setActiveFrame(id); setActiveFrameImage(undefined) }} frameImage={activeFrameImage} templateAspectRatio={templateAspectRatio} onTemplateSelect={handleTemplateSelect} />
          ) : (
            <div className="flex-1 flex relative">
              <EditScreen
                imageUrl={capturedImage}
                adjustments={adjustments}
                onAdjustmentsChange={(val) => { pushUndo(); setAdjustments(val) }}
                activeFilter={activeFilter}
                onFilterChange={(id) => { pushUndo(); setActiveFilter(id) }}
                activeFrame={activeFrame}
                onFrameChange={(id) => { pushUndo(); setActiveFrame(id); setActiveFrameImage(undefined) }}
                onFrameHover={() => {}}
                frameImage={activeFrameImage}
                templateAspectRatio={templateAspectRatio}
                placedStickers={placedStickers}
                placedTexts={placedTexts}
                onTextsChange={(t) => { pushUndo(); setPlacedTexts(t) }}
                onStickersChange={(s) => { pushUndo(); setPlacedStickers(s) }}
                selectedStickerEmoji={selectedStickerEmoji}
                onStickerSelect={setSelectedStickerEmoji}
                onCanvasClick={handleCanvasClick}
                scale={zoom}
              />

              {bakedImage && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center w-[340px]">
                    <div className={`w-[180px] rounded-xl overflow-hidden shadow-md mb-5`} style={{ height: calcFrameHeight(180, activeFrameImage ? 'none' : activeFrame, activeFrameImage ? templateAspectRatio : undefined) }}>
                      <img src={bakedImage} alt="Saved" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="font-bold text-gray-900 text-lg mb-1">✨ Saved</h2>
                    <p className="text-sm text-gray-400 mb-5 text-center">Your photo is now in Gallery</p>
                    <div className="flex flex-col gap-2 w-full">
                      <button onClick={handleDownload} className="w-full py-2.5 rounded-xl bg-studio text-white font-medium text-sm hover:bg-studio/90 transition-all shadow-sm">Download</button>
                      <button onClick={handleContinueEditing} className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Continue Editing</button>
                      <button onClick={() => navigate('/gallery')} className="w-full py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">Open Gallery</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
