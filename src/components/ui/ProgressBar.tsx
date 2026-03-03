import { cn } from '@/utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function ProgressBar({ value, max = 100, className, size = 'md', showLabel = false }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const colorClass =
    percentage >= 80
      ? 'bg-green-500'
      : percentage >= 50
        ? 'bg-brand-500'
        : percentage >= 25
          ? 'bg-yellow-500'
          : 'bg-gray-400'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700', sizeStyles[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {percentage}%
        </span>
      )}
    </div>
  )
}
