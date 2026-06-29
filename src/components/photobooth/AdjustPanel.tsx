import { useState } from 'react'
import type { PhotoAdjustments } from '@/types'

export interface AdjustPanelProps {
  value?: PhotoAdjustments
  onChange?: (value: PhotoAdjustments) => void
}

const SLIDER_SPEC: Array<{ key: keyof PhotoAdjustments; label: string; min: number; max: number }> = [
  { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
  { key: 'exposure', label: 'Sharpness', min: -100, max: 100 },
  { key: 'highlights', label: 'Warmth', min: -100, max: 100 },
  { key: 'shadows', label: 'Fade', min: 0, max: 100 },
]

const RESET_VALUE: PhotoAdjustments = {
  brightness: 0, contrast: 0, saturation: 0,
  exposure: 0, shadows: 0, highlights: 0,
  temperature: 0, tint: 0
}

export const AdjustPanel = ({ value, onChange }: AdjustPanelProps) => {
  const [adjustments, setAdjustments] = useState<PhotoAdjustments>(value || RESET_VALUE)

  const handleSliderChange = (key: keyof PhotoAdjustments, newValue: number) => {
    const updated = { ...adjustments, [key]: newValue }
    setAdjustments(updated)
    onChange?.(updated)
  }

  const handleReset = () => {
    setAdjustments(RESET_VALUE)
    onChange?.(RESET_VALUE)
  }

  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Adjustments
      </div>
      
      <div className="space-y-4">
        {SLIDER_SPEC.map(({ key, label, min, max }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span className="text-sm text-gray-400">{adjustments[key]}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={adjustments[key]}
              onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:bg-[#EC1A66] [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleReset}
        className="w-full mt-6 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
      >
        Reset All
      </button>
    </div>
  )
}
