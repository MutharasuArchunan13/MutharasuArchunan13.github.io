import { cn } from '@/utils/cn'
import type { Phase } from '@/types'

interface PhaseTimelineProps {
  phases: Phase[]
  currentDay: number
}

export function PhaseTimeline({ phases, currentDay }: PhaseTimelineProps) {
  if (phases.length === 0) return null

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phases</h4>
      <div className="space-y-2">
        {phases.map((phase, i) => {
          const isActive = currentDay >= phase.startDay && currentDay <= phase.endDay
          const isComplete = currentDay > phase.endDay
          const totalDays = phase.endDay - phase.startDay + 1
          const daysIn = isActive ? currentDay - phase.startDay + 1 : isComplete ? totalDays : 0
          const progress = Math.round((daysIn / totalDays) * 100)

          return (
            <div
              key={i}
              className={cn(
                'rounded-lg border p-3 text-sm',
                isActive
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10'
                  : isComplete
                    ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/10'
                    : 'border-gray-200 dark:border-gray-800',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{phase.name}</span>
                <span className="text-xs text-gray-400">
                  Day {phase.startDay}-{phase.endDay}
                </span>
              </div>
              {phase.description && (
                <p className="mt-1 text-xs text-gray-500">{phase.description}</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    isComplete ? 'bg-green-500' : 'bg-brand-500',
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
