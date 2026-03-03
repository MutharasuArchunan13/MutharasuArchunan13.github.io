import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return <Loader2 className={cn('animate-spin text-brand-500', sizeMap[size], className)} />
}

export function FullPageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
