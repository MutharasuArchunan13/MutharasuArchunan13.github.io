import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { ArrowLeft } from 'lucide-react'
import { Button, FullPageSpinner } from '@/components/ui'
import { useGoals } from '@/hooks/useGoals'
import { useKanban } from '@/hooks/useKanban'
import { useProjectStore } from '@/store/project.store'
import { useAuthStore } from '@/store/auth.store'
import { milestoneService } from '@/services/github'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { projectPath } from '@/config/routes'
import type { Goal, GoalStatus } from '@/types'

export function KanbanPage() {
  const { slug } = useParams<{ slug: string }>()
  const repo = useAuthStore((s) => s.repo)
  const { setActiveProject } = useProjectStore()
  const { allGoals, isLoading, changeStatus } = useGoals(slug ?? '')
  const { columns, moveGoal } = useKanban(allGoals, changeStatus)
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  useEffect(() => {
    if (!repo || !slug) return
    milestoneService.getProjectBySlug(repo.owner, repo.name, slug).then((p) => {
      if (p) setActiveProject(p)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.owner, repo?.name, slug])

  function handleDragStart(event: { active: { data: { current?: { goal?: Goal } } } }) {
    setActiveGoal(event.active.data.current?.goal ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveGoal(null)
    const { active, over } = event
    if (!over) return

    const goalNumber = parseInt(active.id as string)
    const targetColumn = over.id as string

    const validStatuses: GoalStatus[] = ['todo', 'inprogress', 'done']
    if (validStatuses.includes(targetColumn as GoalStatus)) {
      const goal = allGoals.find(g => g.number === goalNumber)
      if (goal && goal.status !== targetColumn) {
        moveGoal(goalNumber, targetColumn as GoalStatus)
      }
    }
  }

  if (loading || isLoading) return <FullPageSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to={projectPath(slug ?? '')}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Kanban Board</h2>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              goals={col.goals}
            />
          ))}
        </div>

        <DragOverlay>
          {activeGoal && <KanbanCard goal={activeGoal} />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
