import { LABEL_PREFIX, STATUS_LABELS, TYPE_LABELS } from '@/config/constants'
import type { GoalStatus, GoalPriority } from '@/types'

export function buildProjectLabel(slug: string): string {
  return `${LABEL_PREFIX.PROJECT}${slug}`
}

export function buildCategoryLabel(category: string): string {
  return `${LABEL_PREFIX.CATEGORY}${category}`
}

export function buildPriorityLabel(priority: GoalPriority): string {
  return `${LABEL_PREFIX.PRIORITY}${priority}`
}

export function buildStatusLabel(status: GoalStatus): string {
  return STATUS_LABELS[status]
}

export function buildDayLabel(day: number): string {
  return `day:${day}`
}

export function parseProjectSlug(label: string): string | null {
  if (label.startsWith(LABEL_PREFIX.PROJECT)) {
    return label.slice(LABEL_PREFIX.PROJECT.length)
  }
  return null
}

export function parseCategory(label: string): string | null {
  if (label.startsWith(LABEL_PREFIX.CATEGORY)) {
    return label.slice(LABEL_PREFIX.CATEGORY.length)
  }
  return null
}

export function parsePriority(label: string): GoalPriority | null {
  if (label.startsWith(LABEL_PREFIX.PRIORITY)) {
    return label.slice(LABEL_PREFIX.PRIORITY.length) as GoalPriority
  }
  return null
}

export function parseStatus(label: string): GoalStatus | null {
  if (label.startsWith(LABEL_PREFIX.STATUS)) {
    return label.slice(LABEL_PREFIX.STATUS.length) as GoalStatus
  }
  return null
}

export function parseDay(label: string): number | null {
  if (label.startsWith('day:')) {
    const num = parseInt(label.slice(4), 10)
    return isNaN(num) ? null : num
  }
  return null
}

export function extractFromLabels(labels: string[]): {
  projectSlug: string | null
  category: string
  priority: GoalPriority
  status: GoalStatus
  day: number | null
} {
  let projectSlug: string | null = null
  let category = 'general'
  let priority: GoalPriority = 'medium'
  let status: GoalStatus = 'todo'
  let day: number | null = null

  for (const label of labels) {
    const slug = parseProjectSlug(label)
    if (slug) { projectSlug = slug; continue }

    const cat = parseCategory(label)
    if (cat) { category = cat; continue }

    const pri = parsePriority(label)
    if (pri) { priority = pri; continue }

    const stat = parseStatus(label)
    if (stat) { status = stat; continue }

    const d = parseDay(label)
    if (d !== null) { day = d; continue }
  }

  return { projectSlug, category, priority, status, day }
}

export function buildGoalLabels(
  projectSlug: string,
  status: GoalStatus,
  category: string,
  priority: GoalPriority,
  day?: number,
): string[] {
  const labels = [
    buildProjectLabel(projectSlug),
    buildStatusLabel(status),
    buildCategoryLabel(category),
    buildPriorityLabel(priority),
    TYPE_LABELS.goal,
  ]
  if (day !== undefined) {
    labels.push(buildDayLabel(day))
  }
  return labels
}
