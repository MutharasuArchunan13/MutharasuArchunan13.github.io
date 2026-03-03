import type { StreakData, HeatmapEntry, DailyCheckIn } from '@/types'
import { format, parseISO, differenceInCalendarDays, startOfDay } from 'date-fns'

export function calculateStreak(checkIns: DailyCheckIn[]): StreakData {
  if (checkIns.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalCheckIns: 0, lastCheckInDate: null }
  }

  const dates = [...new Set(
    checkIns.map(c => {
      try {
        return format(parseISO(c.createdAt), 'yyyy-MM-dd')
      } catch {
        return c.date
      }
    }),
  )].sort()

  const today = format(startOfDay(new Date()), 'yyyy-MM-dd')
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1

  for (let i = 1; i < dates.length; i++) {
    const diff = differenceInCalendarDays(parseISO(dates[i]), parseISO(dates[i - 1]))
    if (diff === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  // Calculate current streak from today backwards
  const lastDate = dates[dates.length - 1]
  const daysSinceLast = differenceInCalendarDays(parseISO(today), parseISO(lastDate))

  if (daysSinceLast <= 1) {
    currentStreak = 1
    for (let i = dates.length - 2; i >= 0; i--) {
      const diff = differenceInCalendarDays(parseISO(dates[i + 1]), parseISO(dates[i]))
      if (diff === 1) {
        currentStreak++
      } else {
        break
      }
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalCheckIns: checkIns.length,
    lastCheckInDate: lastDate,
  }
}

export function buildHeatmapData(
  checkIns: DailyCheckIn[],
  allDates: string[],
): HeatmapEntry[] {
  const countMap = new Map<string, number>()

  for (const ci of checkIns) {
    try {
      const dateKey = format(parseISO(ci.createdAt), 'yyyy-MM-dd')
      countMap.set(dateKey, (countMap.get(dateKey) ?? 0) + ci.completedGoalNumbers.length)
    } catch {
      // skip invalid dates
    }
  }

  const maxCount = Math.max(...Array.from(countMap.values()), 1)

  return allDates.map(date => {
    const count = countMap.get(date) ?? 0
    let level: 0 | 1 | 2 | 3 | 4 = 0
    if (count > 0) {
      const ratio = count / maxCount
      if (ratio <= 0.25) level = 1
      else if (ratio <= 0.5) level = 2
      else if (ratio <= 0.75) level = 3
      else level = 4
    }
    return { date, count, level }
  })
}
