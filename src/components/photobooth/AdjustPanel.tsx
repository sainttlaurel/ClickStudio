import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { PhotoAdjustments } from '@/types'

export interface AdjustPanelProps {
  value?: PhotoAdjustments
  onChange?: (value: PhotoAdjustments) => void
}

const LIGHT_SLIDERS: Array<{ key: keyof PhotoAdjustments; label: string; min: number; max: number }> = [
  { key: 'exposure', label: 'Exposure', min: -100, max: 100 },
  { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
  { key: 'highlights', label: 'Highlights', min: -100, max: 100 },
  { key: 'shadows', label: 'Shadows', min: 0, max: 100 },
]

const COLOR_SLIDERS: Array<{ key: keyof PhotoAdjustments; label: string; min: number; max: number }> = [
  { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
  { key: 'temperature', label: 'Temperature', min: -100, max: 100 },
  { key: 'tint', label: 'Tint', min: -100, max: 100 },
]

const RESET_VALUE: PhotoAdjustments = {
  brightness: 0, contrast: 0, saturation: 0,
  exposure: 0, shadows: 0, highlights: 0,
  temperature: 0, tint: 0
}

function Section({
  label, open, onToggle, children
}: {
  label: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <button onClick={onToggle} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 hover:text-gray-600 transition-colors w-full text-left">
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open ? 'rotate-0' : '-rotate-90')} />
        {label}
      </button>
      {open && <div className="space-y-3">{children}</div>}
    </div>
  )
}

export const AdjustPanel = ({ value, onChange }: AdjustPanelProps) => {
  const adjustments = value || RESET_VALUE
  const [lightOpen, setLightOpen] = useState(true)
  const [colorOpen, setColorOpen] = useState(true)

  const handleSliderChange = (key: keyof PhotoAdjustments, newValue: number) => {
    onChange?.({ ...adjustments, [key]: newValue })
  }

  const handleReset = () => {
    onChange?.(RESET_VALUE)
  }

  const renderSliders = (sliders: typeof LIGHT_SLIDERS) => sliders.map(({ key, label, min, max }) => (
    <div key={key}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-mono text-gray-500">{adjustments[key] > 0 ? `+${adjustments[key]}` : adjustments[key]}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={adjustments[key]}
        onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
        aria-label={`${label} adjustment`}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:bg-studio [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  ))

  return (
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Adjustments
      </div>

      <Section label="Light" open={lightOpen} onToggle={() => setLightOpen(!lightOpen)}>
        {renderSliders(LIGHT_SLIDERS)}
      </Section>

      <Section label="Color" open={colorOpen} onToggle={() => setColorOpen(!colorOpen)}>
        {renderSliders(COLOR_SLIDERS)}
      </Section>

      <button 
        onClick={handleReset}
        className="w-full mt-4 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all"
      >
        Reset All
      </button>
    </div>
  )
}
