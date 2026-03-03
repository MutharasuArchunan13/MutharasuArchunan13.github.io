import { useMemo } from 'react'
import type { Goal, DailyCheckIn, CategoryBreakdown, ProgressPoint } from '@/types'
import { format, parseISO } from 'date-fns'

export function useAnalytics(goals: Goal[], checkIns: DailyCheckIn[]) {
  const categoryBreakdown = useMemo((): CategoryBreakdown[] => {
    const map = new Map<string, { total: number; completed: number }>()

    for (const goal of goals) {
      const entry = map.get(goal.category) ?? { total: 0, completed: 0 }
      entry.total++
      if (goal.status === 'done') entry.completed++
      map.set(goal.category, entry)
    }

    return Array.from(map.entries())
      .map(([category, { total, completed }]) => ({
        category,
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)
  }, [goals])

  const progressOverTime = useMemo((): ProgressPoint[] => {
    if (checkIns.length === 0) return []

    const totalGoals = goals.length
    let cumulative = 0
    const points: ProgressPoint[] = []

    const sorted = [...checkIns].sort((a, b) => a.day - b.day)
    for (const ci of sorted) {
      cumulative += ci.completedGoalNumbers.length
      points.push({
        date: ci.date,
        completedCumulative: cumulative,
        totalGoals,
        percentage: totalGoals > 0 ? Math.round((cumulative / totalGoals) * 100) : 0,
      })
    }

    return points
  }, [goals, checkIns])

  const dailyActivity = useMemo(() => {
    const map = new Map<string, number>()

    for (const ci of checkIns) {
      try {
        const dateKey = format(parseISO(ci.createdAt), 'yyyy-MM-dd')
        map.set(dateKey, (map.get(dateKey) ?? 0) + ci.completedGoalNumbers.length)
      } catch {
        // skip
      }
    }

    return Array.from(map.entries())
      .map(([date, completed]) => ({ date, completed, added: 0 }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [checkIns])

  const overallStats = useMemo(() => {
    const total = goals.length
    const done = goals.filter(g => g.status === 'done').length
    const inProgress = goals.filter(g => g.status === 'inprogress').length
    return {
      total,
      done,
      inProgress,
      todo: total - done - inProgress,
      completion: total > 0 ? Math.round((done / total) * 100) : 0,
      totalCheckIns: checkIns.length,
    }
  }, [goals, checkIns])

  return { categoryBreakdown, progressOverTime, dailyActivity, overallStats }
}
