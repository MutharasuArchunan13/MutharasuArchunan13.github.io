import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/utils/cn'
import type { Goal } from '@/types'

interface KanbanCardProps {
  goal: Goal
}

const priorityVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'default',
  high: 'warning',
  critical: 'danger',
}

export function KanbanCard({ goal }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.number.toString(), data: { goal } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800',
        isDragging && 'opacity-50 shadow-lg',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab text-gray-400 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {goal.title}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge variant="purple">{goal.category}</Badge>
            <Badge variant={priorityVariant[goal.priority]}>{goal.priority}</Badge>
            {goal.day && <Badge>Day {goal.day}</Badge>}
          </div>
          <span className="mt-1 block text-xs text-gray-400">#{goal.number}</span>
        </div>
      </div>
    </div>
  )
}
