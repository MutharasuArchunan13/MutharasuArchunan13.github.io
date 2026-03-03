export interface DailyCheckIn {
  id: number
  day: number
  date: string
  completedGoalNumbers: number[]
  notes: string
  energy: number
  spokeOutLoud: boolean
  createdAt: string
}

export interface CheckInInput {
  day: number
  date: string
  completedGoalNumbers: number[]
  notes: string
  energy: number
  spokeOutLoud: boolean
}

export interface CheckInMeta {
  day: number
  energy: number
  completed: number[]
  spokeOutLoud: boolean
}
