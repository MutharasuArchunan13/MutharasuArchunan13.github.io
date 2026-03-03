export const LABEL_PREFIX = {
  PROJECT: 'project:',
  STATUS: 'status:',
  CATEGORY: 'category:',
  PRIORITY: 'priority:',
  TYPE: 'type:',
} as const

export const STATUS_LABELS = {
  todo: 'status:todo',
  inprogress: 'status:inprogress',
  done: 'status:done',
} as const

export const TYPE_LABELS = {
  goal: 'type:goal',
  task: 'type:task',
  dailylog: 'type:dailylog',
} as const

export const PRIORITY_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
}

export const STATUS_COLORS: Record<string, string> = {
  todo: '#94a3b8',
  inprogress: '#3b82f6',
  done: '#22c55e',
}

export const HEATMAP_COLORS = [
  '#1e1e2e',  // level 0 - empty
  '#166534',  // level 1
  '#16a34a',  // level 2
  '#4ade80',  // level 3
  '#86efac',  // level 4
] as const

export const CONFIG_FILE_PATH = 'tracker-config.json'

export const DEFAULT_CATEGORIES = [
  'dsa',
  'system-design',
  'behavioral',
  'coding',
  'review',
] as const

export const ENERGY_LEVELS = [1, 2, 3, 4, 5] as const

export const KANBAN_COLUMNS = [
  { id: 'todo', title: 'To Do', color: STATUS_COLORS.todo },
  { id: 'inprogress', title: 'In Progress', color: STATUS_COLORS.inprogress },
  { id: 'done', title: 'Done', color: STATUS_COLORS.done },
] as const
