import { useMemo } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui'
import { HEATMAP_COLORS } from '@/config/constants'
import type { HeatmapEntry } from '@/types'
import { parseISO, getDay } from 'date-fns'

interface StreakHeatmapProps {
  data: HeatmapEntry[]
}

const CELL_SIZE = 12
const CELL_GAP = 2
const DAYS = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat']

export function StreakHeatmap({ data }: StreakHeatmapProps) {
  const weeks = useMemo(() => {
    const grid: HeatmapEntry[][] = []
    let currentWeek: HeatmapEntry[] = []

    for (let i = 0; i < data.length; i++) {
      const entry = data[i]
      const dayOfWeek = getDay(parseISO(entry.date))

      if (i === 0) {
        // Pad the first week
        for (let pad = 0; pad < dayOfWeek; pad++) {
          currentWeek.push({ date: '', count: 0, level: 0 })
        }
      }

      currentWeek.push(entry)

      if (dayOfWeek === 6 || i === data.length - 1) {
        grid.push(currentWeek)
        currentWeek = []
      }
    }

    return grid
  }, [data])

  const width = weeks.length * (CELL_SIZE + CELL_GAP) + 30
  const height = 7 * (CELL_SIZE + CELL_GAP) + 20

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto scrollbar-thin">
        <svg width={width} height={height} className="mx-auto">
          {DAYS.map((label, i) => (
            <text
              key={i}
              x={0}
              y={i * (CELL_SIZE + CELL_GAP) + CELL_SIZE}
              className="fill-gray-400 text-[10px]"
            >
              {label}
            </text>
          ))}

          {weeks.map((week, wi) =>
            week.map((entry, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * (CELL_SIZE + CELL_GAP) + 30}
                y={di * (CELL_SIZE + CELL_GAP)}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={2}
                fill={HEATMAP_COLORS[entry.level]}
                className="transition-colors"
              >
                {entry.date && (
                  <title>{`${entry.date}: ${entry.count} tasks`}</title>
                )}
              </rect>
            )),
          )}
        </svg>
      </div>
    </Card>
  )
}
