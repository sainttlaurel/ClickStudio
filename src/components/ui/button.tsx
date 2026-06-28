import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  animate?: boolean
  pill?: boolean
}

const buttonVariants = {
  primary:
    'bg-gradient-to-b from-primary to-rose-600 text-white hover:from-rose-500 hover:to-rose-700 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 border border-primary/20',
  secondary:
    'bg-gradient-to-b from-secondary to-rose-400 text-white hover:from-rose-400 hover:to-rose-500 shadow-lg shadow-secondary/25 border border-secondary/20',
  outline:
    'border-2 border-border bg-white/80 hover:bg-rose-50 text-text hover:border-primary/40 hover:shadow-md hover:shadow-primary/5',
  ghost: 'bg-transparent hover:bg-rose-50 text-text hover:text-primary',
  danger: 'bg-gradient-to-b from-error to-red-600 text-white hover:from-red-500 hover:to-red-700 shadow-lg shadow-error/25 border border-error/20',
  dark: 'bg-gradient-to-b from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 shadow-lg shadow-text/20 border border-gray-700/50',
}

const buttonSizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  xl: 'h-14 px-8 text-lg gap-3',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps & MotionProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      icon,
      animate = true,
      pill = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-semibold',
      'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:pointer-events-none disabled:opacity-50',
      'touch-target',
      pill ? 'rounded-full' : 'rounded-xl',
      buttonVariants[variant],
      buttonSizes[size],
      className
    )

    const content = (
      <>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
      </>
    )

    if (animate) {
      return (
        <motion.button
          ref={ref}
          className={baseClasses}
          disabled={disabled || loading}
          whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
          whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          {...props}
        >
          {content}
        </motion.button>
      )
    }

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
