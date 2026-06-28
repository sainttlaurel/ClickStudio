import { useCallback, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  className?: string
  disabled?: boolean
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  className,
  disabled = false,
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const percentage = ((value - min) / (max - min)) * 100

  const updateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return

      const rect = trackRef.current.getBoundingClientRect()
      const newPercentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const newValue = min + (newPercentage / 100) * (max - min)
      const steppedValue = Math.round(newValue / step) * step
      
      onChange(Math.max(min, Math.min(max, steppedValue)))
    },
    [min, max, step, onChange, disabled]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return
      setIsDragging(true)
      updateValue(e.clientX)
    },
    [updateValue, disabled]
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return
      setIsDragging(true)
      updateValue(e.touches[0].clientX)
    },
    [updateValue, disabled]
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updateValue(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) updateValue(e.touches[0].clientX)
    }

    const handleEnd = () => setIsDragging(false)

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchend', handleEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, updateValue])

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-text">{label}</label>
          <span className="text-sm text-muted">{value}</span>
        </div>
      )}
      <div className="relative">
        <div
          ref={trackRef}
          className={cn(
            'relative h-1 w-full rounded-full bg-border/50 cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
        >
          {/* Track fill */}
          <div
            className="absolute top-0 left-0 h-full bg-primary/40 rounded-full transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
          
          {/* Thumb */}
          <motion.div
            className={cn(
              'absolute top-1/2 w-4 h-4 -mt-2 bg-primary rounded-full shadow-md',
              'border-2 border-background cursor-grab active:cursor-grabbing',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              isDragging && 'scale-110 shadow-lg',
              disabled && 'cursor-not-allowed'
            )}
            style={{ left: `calc(${percentage}% - 0.5rem)` }}
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ duration: 0.15 }}
          />
        </div>
      </div>
    </div>
  )
}