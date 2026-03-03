import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useUIStore, type Toast as ToastType } from '@/store/ui.store'

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  error: 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  info: 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
}

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useUIStore((s) => s.removeToast)
  const Icon = icons[toast.type]

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg animate-slide-up',
        styles[toast.type],
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
