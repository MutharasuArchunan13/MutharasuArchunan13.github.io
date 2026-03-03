export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  PROJECT: '/project/:slug',
  CHECKIN: '/checkin/:slug',
  KANBAN: '/kanban/:slug',
  ANALYTICS: '/analytics/:slug',
} as const

export function projectPath(slug: string): string {
  return `/project/${slug}`
}

export function checkinPath(slug: string): string {
  return `/checkin/${slug}`
}

export function kanbanPath(slug: string): string {
  return `/kanban/${slug}`
}

export function analyticsPath(slug: string): string {
  return `/analytics/${slug}`
}
