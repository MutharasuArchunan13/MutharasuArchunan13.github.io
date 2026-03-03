import { create } from 'zustand'
import type { DailyCheckIn } from '@/types'

interface CheckInStore {
  checkIns: DailyCheckIn[]
  isLoading: boolean
  error: string | null

  setCheckIns: (checkIns: DailyCheckIn[]) => void
  addCheckIn: (checkIn: DailyCheckIn) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCheckInStore = create<CheckInStore>()((set) => ({
  checkIns: [],
  isLoading: false,
  error: null,

  setCheckIns: (checkIns) => set({ checkIns }),

  addCheckIn: (checkIn) =>
    set((state) => ({ checkIns: [...state.checkIns, checkIn] })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
