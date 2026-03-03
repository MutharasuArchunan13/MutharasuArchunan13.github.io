import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './KanbanCard'
import { cn } from '@/utils/cn'
import type { Goal } from '@/types'

interface KanbanColumnProps {
  id: string
  title: string
  color: string
  goals: Goal[]
}

export function KanbanColumn({ id, title, color, goals }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-[200px] flex-1 flex-col rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50',
        isOver && 'border-brand-400 bg-brand-50/50 dark:bg-brand-900/10',
      )}
    >
      <div className="flex items-center gap-2 border-b border-gray-200 p-3 dark:border-gray-800">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium dark:bg-gray-700">
          {goals.length}
        </span>
      </div>

      <SortableContext
        items={goals.map(g => g.number.toString())}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-2 p-2">
          {goals.map((goal) => (
            <KanbanCard key={goal.number} goal={goal} />
          ))}
          {goals.length === 0 && (
            <p className="py-8 text-center text-xs text-gray-400">Drop here</p>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
