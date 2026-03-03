import {
  format,
  parseISO,
  differenceInDays,
  startOfDay,
  subDays,
  addDays,
  isToday,
  isBefore,
  isAfter,
  startOfWeek,
  eachDayOfInterval,
} from 'date-fns'

export function formatDate(date: string | Date, fmt: string = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export function formatShortDate(date: string | Date): string {
  return formatDate(date, 'MMM d')
}

export function daysBetween(start: string | Date, end: string | Date): number {
  const s = typeof start === 'string' ? parseISO(start) : start
  const e = typeof end === 'string' ? parseISO(end) : end
  return differenceInDays(e, s)
}

export function getDayNumber(startDate: string, currentDate: string | Date = new Date()): number {
  return daysBetween(startDate, currentDate) + 1
}

export function today(): string {
  return format(startOfDay(new Date()), 'yyyy-MM-dd')
}

export function daysAgo(n: number): Date {
  return subDays(startOfDay(new Date()), n)
}

export function daysFromNow(n: number): Date {
  return addDays(startOfDay(new Date()), n)
}

export function isDateToday(date: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isToday(d)
}

export function isDateBefore(a: string | Date, b: string | Date): boolean {
  const da = typeof a === 'string' ? parseISO(a) : a
  const db = typeof b === 'string' ? parseISO(b) : b
  return isBefore(da, db)
}

export function isDateAfter(a: string | Date, b: string | Date): boolean {
  const da = typeof a === 'string' ? parseISO(a) : a
  const db = typeof b === 'string' ? parseISO(b) : b
  return isAfter(da, db)
}

export function getHeatmapDates(weeks: number = 52): string[] {
  const end = startOfDay(new Date())
  const start = startOfWeek(subDays(end, weeks * 7 - 1), { weekStartsOn: 0 })
  return eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'))
}

export { parseISO, format, startOfDay }
