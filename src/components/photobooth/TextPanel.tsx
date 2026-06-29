import { useState } from 'react'
import { cn } from '@/utils/cn'

interface TextPanelProps {
  onTextAdd?: (text: string, color: string, fontSize: number) => void
  placedTexts?: Array<{ id: string; text: string; color: string; fontSize: number; x: number; y: number }>
}

const COLORS = [
  { id: 'pink', value: '#EC1A66' },
  { id: 'black', value: '#000000' },
  { id: 'white', value: '#FFFFFF', border: true },
  { id: 'lightPink', value: '#FBCFE8' },
  { id: 'blue', value: '#3B82F6' },
  { id: 'green', value: '#10B981' },
  { id: 'yellow', value: '#F59E0B' },
  { id: 'orange', value: '#F97316' }
]

export const TextPanel = ({ onTextAdd, placedTexts = [] }: TextPanelProps) => {
  const [textInput, setTextInput] = useState('')
  const [textColor, setTextColor] = useState(COLORS[0].value)
  const [fontSize, setFontSize] = useState(24)

  const handleAddText = () => {
    if (textInput.trim()) {
      onTextAdd?.(textInput, textColor, fontSize)
      setTextInput('')
    }
  }

  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Add Text
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type something..."
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EC1A66]/50"
          onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
        />
        
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Color</div>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => setTextColor(color.value)}
                className={cn(
                  'w-8 h-8 rounded-full transition-all',
                  textColor === color.value ? 'ring-2 ring-offset-2 ring-[#EC1A66]' : '',
                  color.border ? 'border-2 border-gray-300' : ''
                )}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Font size</div>
          <input
            type="range"
            min={12}
            max={72}
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-[#EC1A66] [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
        
        <button
          onClick={handleAddText}
          className="w-full py-2.5 rounded-full bg-[#EC1A66] text-white font-medium text-sm hover:bg-[#EC1A66]/90 transition-all"
        >
          Add to Photo
        </button>
      </div>
      
      {placedTexts.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Placed ({placedTexts.length})
          </div>
          <div className="space-y-2">
            {placedTexts.map((text) => (
              <div 
                key={text.id}
                className="p-2 rounded-lg bg-gray-50 flex items-center justify-between"
              >
                <span className="text-sm truncate" style={{ color: text.color }}>
                  {text.text}
                </span>
                <span className="text-xs text-gray-400">{text.fontSize}px</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
