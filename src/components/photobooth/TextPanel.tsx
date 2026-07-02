import { useState } from 'react'
import { cn } from '@/utils/cn'
import { TEXT_PRESETS, TEXT_COLORS } from '@/constants/stickers'

interface TextPanelProps {
  onTextAdd?: (text: string, color: string, fontSize: number, font?: string) => void
  placedTexts?: Array<{ id: string; text: string; color: string; fontSize: number; x: number; y: number }>
}

export const TextPanel = ({ onTextAdd, placedTexts = [] }: TextPanelProps) => {
  const [textInput, setTextInput] = useState('')
  const [textColor, setTextColor] = useState(TEXT_COLORS[0])
  const [fontSize, setFontSize] = useState(24)
  const [fontPreset, setFontPreset] = useState(0)

  const handleAddText = () => {
    if (textInput.trim()) {
      onTextAdd?.(textInput, textColor, fontSize, TEXT_PRESETS[fontPreset].font)
      setTextInput('')
    }
  }

  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Add Text
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type something..."
          aria-label="Text input"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-studio/50"
          onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
        />
        
        {/* Typography Section */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Typography
          </div>
          <div className="flex gap-2">
            {TEXT_PRESETS.slice(0, 4).map((preset, i) => (
              <button
                key={i}
                onClick={() => setFontPreset(i)}
                aria-label={`Select font ${preset.name}`}
                className={cn(
                  'flex-1 py-1.5 rounded-lg border text-xs transition-all',
                  fontPreset === i
                    ? 'border-studio text-studio bg-pink-50 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
                style={{ fontFamily: `"${preset.font}", serif` }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Appearance Section */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Appearance
          </div>
          <div className="flex flex-wrap gap-2">
            {TEXT_COLORS.slice(0, 8).map((color, i) => (
              <button
                key={i}
                onClick={() => setTextColor(color)}
                aria-label={`Select color ${color}`}
                className={cn(
                  'w-7 h-7 rounded-full transition-all',
                  textColor === color ? 'ring-2 ring-offset-2 ring-studio scale-110' : '',
                  color === '#FFFFFF' ? 'border-2 border-gray-300' : ''
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        
        {/* Size Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Size
            </div>
            <span className="text-xs font-mono text-gray-400">{fontSize}px</span>
          </div>
          <input
            type="range"
            min={12}
            max={72}
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            aria-label="Font size"
            className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer transition-all
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-studio [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110"
          />
        </div>
        
        <button
          onClick={handleAddText}
          aria-label="Add text to photo"
          className="w-full py-2 rounded-lg bg-studio text-white font-medium text-sm hover:bg-studio/90 transition-all"
        >
          + Add Text
        </button>
      </div>
      
      {placedTexts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Placed ({placedTexts.length})
          </div>
          <div className="space-y-1.5">
            {placedTexts.map((text) => (
              <div 
                key={text.id}
                className="p-2 rounded-lg bg-gray-50 flex items-center justify-between"
              >
                <span className="text-xs truncate" style={{ color: text.color }}>
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
