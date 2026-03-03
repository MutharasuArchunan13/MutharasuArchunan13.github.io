import { create } from 'zustand'
import type { Goal, GoalFilter } from '@/types'

interface GoalStore {
  goals: Goal[]
  filter: GoalFilter
  isLoading: boolean
  error: string | null

  setGoals: (goals: Goal[]) => void
  addGoal: (goal: Goal) => void
  updateGoal: (number: number, updates: Partial<Goal>) => void
  removeGoal: (number: number) => void
  setFilter: (filter: Partial<GoalFilter>) => void
  resetFilter: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const DEFAULT_FILTER: GoalFilter = {
  status: 'all',
  category: 'all',
  priority: 'all',
  search: '',
}

export const useGoalStore = create<GoalStore>()((set) => ({
  goals: [],
  filter: DEFAULT_FILTER,
  isLoading: false,
  error: null,

  setGoals: (goals) => set({ goals }),

  addGoal: (goal) =>
    set((state) => ({ goals: [...state.goals, goal] })),

  updateGoal: (number, updates) =>
    set((state) => ({
      goals: state.goals.map(g => g.number === number ? { ...g, ...updates } : g),
    })),

  removeGoal: (number) =>
    set((state) => ({
      goals: state.goals.filter(g => g.number !== number),
    })),

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  resetFilter: () => set({ filter: DEFAULT_FILTER }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
