import { useMemo } from 'react'
import type { DailyCheckIn } from '@/types'
import { calculateStreak, buildHeatmapData } from '@/utils/streak'
import { getHeatmapDates } from '@/utils/date'

export function useStreak(checkIns: DailyCheckIn[]) {
  const streakData = useMemo(() => calculateStreak(checkIns), [checkIns])

  const heatmapData = useMemo(() => {
    const dates = getHeatmapDates(52)
    return buildHeatmapData(checkIns, dates)
  }, [checkIns])

  return { streakData, heatmapData }
}
