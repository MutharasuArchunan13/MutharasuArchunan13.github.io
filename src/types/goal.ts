export type GoalStatus = 'todo' | 'inprogress' | 'done'
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Goal {
  id: number
  number: number
  title: string
  description: string
  status: GoalStatus
  priority: GoalPriority
  category: string
  projectSlug: string
  day: number | null
  assignedDate: string | null
  createdAt: string
  updatedAt: string
  closedAt: string | null
  labels: string[]
}

export interface GoalInput {
  title: string
  description: string
  status?: GoalStatus
  priority?: GoalPriority
  category: string
  projectSlug: string
  day?: number
}

export interface GoalUpdate {
  title?: string
  description?: string
  status?: GoalStatus
  priority?: GoalPriority
  category?: string
}

export interface GoalFilter {
  status?: GoalStatus | 'all'
  category?: string | 'all'
  priority?: GoalPriority | 'all'
  search?: string
}
