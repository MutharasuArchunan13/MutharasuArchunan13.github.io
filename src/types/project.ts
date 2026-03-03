export interface Project {
  id: number
  slug: string
  title: string
  description: string
  totalGoals: number
  completedGoals: number
  openGoals: number
  dueDate: string | null
  createdAt: string
  updatedAt: string
  state: 'open' | 'closed'
  phases: Phase[]
  dailyLogIssueNumber: number | null
}

export interface Phase {
  name: string
  startDay: number
  endDay: number
  description: string
}

export interface ProjectConfig {
  phases: Phase[]
  categories: string[]
  dailyLogIssueNumber: number | null
  startDate: string
  totalDays: number
}

export interface ProjectInput {
  title: string
  description: string
  dueDate?: string
  phases?: Phase[]
  categories?: string[]
  totalDays?: number
}

export type ProjectSortKey = 'title' | 'createdAt' | 'progress'
