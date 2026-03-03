import { Card } from '@/components/ui'
import type { DailyCheckIn } from '@/types'
import { formatDate } from '@/utils/date'

interface CheckInHistoryProps {
  checkIns: DailyCheckIn[]
}

export function CheckInHistory({ checkIns }: CheckInHistoryProps) {
  if (checkIns.length === 0) return null

  const sorted = [...checkIns].sort((a, b) => b.day - a.day)

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        History ({checkIns.length} check-ins)
      </h4>
      <div className="space-y-2">
        {sorted.map((ci) => (
          <Card key={ci.id} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Day {ci.day}</span>
              <span className="text-xs text-gray-400">{formatDate(ci.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {ci.completedGoalNumbers.length} tasks completed | Energy: {ci.energy}/5
            </p>
            {ci.notes && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">{ci.notes}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
