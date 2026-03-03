export interface StreakData {
  currentStreak: number
  longestStreak: number
  totalCheckIns: number
  lastCheckInDate: string | null
}

export interface HeatmapEntry {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface CategoryBreakdown {
  category: string
  total: number
  completed: number
  percentage: number
}

export interface DailyActivity {
  date: string
  completed: number
  added: number
}

export interface ProgressPoint {
  date: string
  completedCumulative: number
  totalGoals: number
  percentage: number
}
