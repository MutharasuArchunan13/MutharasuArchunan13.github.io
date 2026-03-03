import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { formatError } from '@/utils/error'

interface UseGitHubQueryResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useGitHubQuery<T>(
  queryFn: (owner: string, repo: string) => Promise<T>,
  deps: unknown[] = [],
): UseGitHubQueryResult<T> {
  const repoInfo = useAuthStore((s) => s.repo)
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!repoInfo) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await queryFn(repoInfo.owner, repoInfo.name)
      setData(result)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoInfo?.owner, repoInfo?.name, ...deps])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, isLoading, error, refetch: fetch }
}
