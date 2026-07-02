import { cn } from '@/utils/cn'

export interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export const Switch = ({ checked = false, onCheckedChange, disabled = false, className }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-studio focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        checked ? 'bg-studio' : 'bg-gray-300',
        className
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  )
}
