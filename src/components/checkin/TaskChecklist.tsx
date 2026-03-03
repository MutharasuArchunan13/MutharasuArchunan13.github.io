import { cn } from '@/utils/cn'
import type { Goal } from '@/types'

interface TaskChecklistProps {
  goals: Goal[]
  checked: Set<number>
  onToggle: (number: number) => void
}

export function TaskChecklist({ goals, checked, onToggle }: TaskChecklistProps) {
  const pending = goals.filter(g => g.status !== 'done')
  const completed = goals.filter(g => g.status === 'done')

  return (
    <div className="space-y-4">
      {pending.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Pending ({pending.length})
          </h4>
          <div className="space-y-1">
            {pending.map((goal) => (
              <label
                key={goal.number}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800',
                  checked.has(goal.number) && 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
                )}
              >
                <input
                  type="checkbox"
                  checked={checked.has(goal.number)}
                  onChange={() => onToggle(goal.number)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className={cn(
                  'text-sm',
                  checked.has(goal.number) && 'line-through text-gray-400',
                )}>
                  {goal.title}
                </span>
                <span className="ml-auto text-xs text-gray-400">#{goal.number}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-500">
            Already completed ({completed.length})
          </h4>
          <div className="space-y-1 opacity-50">
            {completed.map((goal) => (
              <div key={goal.number} className="flex items-center gap-3 rounded-lg p-3 text-sm line-through text-gray-400">
                <input type="checkbox" checked disabled className="h-4 w-4" />
                {goal.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
