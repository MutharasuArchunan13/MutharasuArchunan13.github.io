import { Target, CheckCircle2, Flame, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui'
import type { StreakData } from '@/types'

interface OverallStatsProps {
  totalProjects: number
  completedGoals: number
  streak: StreakData
}

export function OverallStats({ totalProjects, completedGoals, streak }: OverallStatsProps) {
  const stats = [
    {
      label: 'Projects',
      value: totalProjects,
      icon: Target,
      color: 'text-brand-500',
    },
    {
      label: 'Goals Done',
      value: completedGoals,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      label: 'Current Streak',
      value: `${streak.currentStreak}d`,
      icon: Flame,
      color: 'text-orange-500',
    },
    {
      label: 'Longest Streak',
      value: `${streak.longestStreak}d`,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex items-center gap-3 p-4">
          <stat.icon className={`h-8 w-8 ${stat.color}`} />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
