import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/utils/cn'
import type { Toast } from '@/types'

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: 'border-success/20 bg-success/10 text-success',
  error: 'border-error/20 bg-error/10 text-error',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  info: 'border-accent/20 bg-accent/10 text-accent',
}

const ToastComponent = ({ toast }: { toast: Toast }) => {
  const removeToast = useUIStore(state => state.removeToast)
  const Icon = toastIcons[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl border glass',
        'shadow-lg max-w-sm w-full pointer-events-auto',
        toastStyles[toast.type]
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      
      <div className="flex-1 space-y-1">
        <h4 className="font-medium text-sm">{toast.title}</h4>
        {toast.description && (
          <p className="text-sm opacity-90">{toast.description}</p>
        )}
      </div>
      
      <button
        onClick={() => removeToast(toast.id)}
        className={cn(
          'flex-shrink-0 rounded-lg p-1 hover:bg-black/10 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current'
        )}
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function Toaster() {
  const toasts = useUIStore(state => state.toasts)

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastComponent key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}