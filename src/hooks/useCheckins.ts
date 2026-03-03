import { useEffect } from 'react'
import { useCheckInStore } from '@/store/checkin.store'
import { commentService } from '@/services/github'
import { useAuthStore } from '@/store/auth.store'
import { formatError } from '@/utils/error'
import { useUIStore } from '@/store/ui.store'
import type { CheckInInput } from '@/types'

export function useCheckins(dailyLogIssueNumber: number | null) {
  const repo = useAuthStore((s) => s.repo)
  const { checkIns, isLoading, error, setCheckIns, addCheckIn, setLoading, setError } = useCheckInStore()
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    if (!repo || !dailyLogIssueNumber) return
    loadCheckIns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.owner, repo?.name, dailyLogIssueNumber])

  async function loadCheckIns() {
    if (!repo || !dailyLogIssueNumber) return
    setLoading(true)
    try {
      const data = await commentService.listCheckIns(repo.owner, repo.name, dailyLogIssueNumber)
      setCheckIns(data)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  async function createCheckIn(input: CheckInInput, goalTitles: Map<number, string>) {
    if (!repo || !dailyLogIssueNumber) return
    try {
      const checkIn = await commentService.createCheckIn(
        repo.owner, repo.name, dailyLogIssueNumber, input, goalTitles,
      )
      addCheckIn(checkIn)
      addToast('Check-in saved!', 'success')
      return checkIn
    } catch (err) {
      addToast(formatError(err), 'error')
    }
  }

  return { checkIns, isLoading, error, loadCheckIns, createCheckIn }
}
