import { useEffect, useMemo } from 'react'
import { useGoalStore } from '@/store/goal.store'
import { issueService } from '@/services/github'
import { useAuthStore } from '@/store/auth.store'
import { formatError } from '@/utils/error'
import { useUIStore } from '@/store/ui.store'
import type { GoalInput, GoalUpdate, GoalStatus } from '@/types'
import { useProjectStore } from '@/store/project.store'

export function useGoals(projectSlug: string) {
  const repo = useAuthStore((s) => s.repo)
  const activeProject = useProjectStore((s) => s.activeProject)
  const { goals, filter, isLoading, error, setGoals, addGoal, updateGoal: updateGoalInStore, setLoading, setError, setFilter } = useGoalStore()
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    if (!repo || !projectSlug) return
    loadGoals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.owner, repo?.name, projectSlug])

  async function loadGoals() {
    if (!repo) return
    setLoading(true)
    try {
      const data = await issueService.listGoals(repo.owner, repo.name, projectSlug)
      setGoals(data)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  async function createGoal(input: GoalInput) {
    if (!repo || !activeProject) return
    try {
      const goal = await issueService.createGoal(repo.owner, repo.name, input, activeProject.id)
      addGoal(goal)
      addToast('Goal created', 'success')
      return goal
    } catch (err) {
      addToast(formatError(err), 'error')
    }
  }

  async function changeStatus(goalNumber: number, newStatus: GoalStatus) {
    if (!repo) return
    const goal = goals.find(g => g.number === goalNumber)
    if (!goal) return

    updateGoalInStore(goalNumber, { status: newStatus })

    try {
      await issueService.updateGoalStatus(repo.owner, repo.name, goalNumber, goal.labels, newStatus)
      if (newStatus === 'done') {
        addToast('Goal completed!', 'success')
      }
    } catch (err) {
      updateGoalInStore(goalNumber, { status: goal.status })
      addToast(formatError(err), 'error')
    }
  }

  async function editGoal(goalNumber: number, update: GoalUpdate) {
    if (!repo) return
    const goal = goals.find(g => g.number === goalNumber)
    if (!goal) return

    try {
      await issueService.updateGoal(repo.owner, repo.name, goalNumber, goal.labels, update)
      updateGoalInStore(goalNumber, update)
      addToast('Goal updated', 'success')
    } catch (err) {
      addToast(formatError(err), 'error')
    }
  }

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (filter.status && filter.status !== 'all' && g.status !== filter.status) return false
      if (filter.category && filter.category !== 'all' && g.category !== filter.category) return false
      if (filter.priority && filter.priority !== 'all' && g.priority !== filter.priority) return false
      if (filter.search && !g.title.toLowerCase().includes(filter.search.toLowerCase())) return false
      return true
    })
  }, [goals, filter])

  const categories = useMemo(() => {
    const cats = new Set(goals.map(g => g.category))
    return Array.from(cats).sort()
  }, [goals])

  const stats = useMemo(() => {
    const total = goals.length
    const done = goals.filter(g => g.status === 'done').length
    const inProgress = goals.filter(g => g.status === 'inprogress').length
    const todo = goals.filter(g => g.status === 'todo').length
    return { total, done, inProgress, todo, percentage: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [goals])

  return {
    goals: filteredGoals,
    allGoals: goals,
    categories,
    stats,
    filter,
    isLoading,
    error,
    loadGoals,
    createGoal,
    changeStatus,
    editGoal,
    setFilter,
  }
}
