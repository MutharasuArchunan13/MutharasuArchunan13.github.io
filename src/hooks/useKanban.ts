import { useMemo, useCallback } from 'react'
import type { Goal, GoalStatus } from '@/types'
import { KANBAN_COLUMNS } from '@/config/constants'

export function useKanban(goals: Goal[], changeStatus: (number: number, status: GoalStatus) => Promise<void>) {
  const columns = useMemo(() => {
    return KANBAN_COLUMNS.map(col => ({
      ...col,
      goals: goals.filter(g => g.status === col.id),
    }))
  }, [goals])

  const moveGoal = useCallback(
    async (goalNumber: number, newStatus: GoalStatus) => {
      await changeStatus(goalNumber, newStatus)
    },
    [changeStatus],
  )

  return { columns, moveGoal }
}
