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
    'bg-primary text-white hover:bg-rose-600 shadow-md shadow-primary/30 active:scale-95',
  secondary:
    'bg-secondary text-white hover:bg-rose-400 shadow-md shadow-secondary/25',
  outline:
    'border-2 border-border bg-transparent hover:bg-rose-50 text-text hover:border-primary/40',
  ghost: 'bg-transparent hover:bg-rose-50 text-text hover:text-primary',
  danger: 'bg-error text-white hover:bg-red-600 shadow-md shadow-error/25',
  dark: 'bg-text text-white hover:bg-text/90 shadow-md shadow-text/20',
}

const buttonSizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  xl: 'h-14 px-8 text-base gap-2',
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
      'inline-flex items-center justify-center font-medium',
      'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
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
          whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
          whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
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
