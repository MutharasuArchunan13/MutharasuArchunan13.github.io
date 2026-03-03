import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/utils/cn'
import type { Goal, GoalStatus } from '@/types'

interface GoalItemProps {
  goal: Goal
  onStatusChange: (number: number, status: GoalStatus) => void
}

const statusIcons: Record<GoalStatus, React.ReactNode> = {
  todo: <Circle className="h-5 w-5 text-gray-400" />,
  inprogress: <Clock className="h-5 w-5 text-blue-500" />,
  done: <CheckCircle2 className="h-5 w-5 text-green-500" />,
}

const priorityVariant: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'default',
  high: 'warning',
  critical: 'danger',
}

export function GoalItem({ goal, onStatusChange }: GoalItemProps) {
  function cycleStatus() {
    const next: Record<GoalStatus, GoalStatus> = {
      todo: 'inprogress',
      inprogress: 'done',
      done: 'todo',
    }
    onStatusChange(goal.number, next[goal.status])
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700',
        goal.status === 'done' && 'opacity-60',
      )}
    >
      <button onClick={cycleStatus} className="shrink-0">
        {statusIcons[goal.status]}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium text-gray-900 dark:text-gray-100',
            goal.status === 'done' && 'line-through',
          )}
        >
          {goal.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="purple">{goal.category}</Badge>
          <Badge variant={priorityVariant[goal.priority]}>{goal.priority}</Badge>
          {goal.day && (
            <span className="text-xs text-gray-400">Day {goal.day}</span>
          )}
        </div>
      </div>

      <span className="text-xs text-gray-400">#{goal.number}</span>
      <ChevronRight className="h-4 w-4 text-gray-300" />
    </div>
  )
}
