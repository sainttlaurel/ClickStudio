import { useState } from 'react'

export interface Adjustments {
  brightness: number
  contrast: number
  saturation: number
  sharpness: number
  warmth: number
  fade: number
}

interface AdjustPanelProps {
  value?: Adjustments
  onChange?: (value: Adjustments) => void
}

export const AdjustPanel = ({ value, onChange }: AdjustPanelProps) => {
  const [adjustments, setAdjustments] = useState<Adjustments>(value || {
    brightness: 50,
    contrast: 50,
    saturation: 50,
    sharpness: 50,
    warmth: 50,
    fade: 0
  })

  const sliders = [
    { key: 'brightness', label: 'Brightness', min: 0, max: 100 },
    { key: 'contrast', label: 'Contrast', min: 0, max: 100 },
    { key: 'saturation', label: 'Saturation', min: 0, max: 100 },
    { key: 'sharpness', label: 'Sharpness', min: 0, max: 100 },
    { key: 'warmth', label: 'Warmth', min: 0, max: 100 },
    { key: 'fade', label: 'Fade', min: 0, max: 100 }
  ]

  const handleReset = () => {
    setAdjustments({
      brightness: 50,
      contrast: 50,
      saturation: 50,
      sharpness: 50,
      warmth: 50,
      fade: 0
    })
    onChange?.({
      brightness: 50,
      contrast: 50,
      saturation: 50,
      sharpness: 50,
      warmth: 50,
      fade: 0
    })
  }

  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Adjustments
      </div>
      
      <div className="space-y-4">
        {sliders.map(({ key, label, min, max }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span className="text-sm text-gray-400">{adjustments[key as keyof Adjustments]}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={adjustments[key as keyof Adjustments]}
              onChange={(e) => {
                const newValue = parseInt(e.target.value)
                setAdjustments(prev => ({ ...prev, [key]: newValue }))
                onChange?.({ ...adjustments, [key]: newValue })
              }}
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
