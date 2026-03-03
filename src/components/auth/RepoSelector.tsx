import { useState, useEffect } from 'react'
import { getOctokit } from '@/services/github/client'
import { Button, Spinner } from '@/components/ui'
import type { RepoInfo } from '@/types'

interface RepoSelectorProps {
  onSelect: (repo: RepoInfo) => void
}

interface RepoData {
  full_name: string
  name: string
  owner: { login: string }
}

export function RepoSelector({ onSelect }: RepoSelectorProps) {
  const [repos, setRepos] = useState<RepoData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadRepos()
  }, [])

  async function loadRepos() {
    try {
      const octokit = getOctokit()
      const { data } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100,
        type: 'owner',
      })
      setRepos(data.map(r => ({
        full_name: r.full_name,
        name: r.name,
        owner: { login: r.owner.login },
      })))
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  const filtered = repos.filter(r =>
    r.full_name.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search repos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      />

      <div className="max-h-48 space-y-1 overflow-y-auto scrollbar-thin">
        {filtered.map((repo) => (
          <Button
            key={repo.full_name}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-left"
            onClick={() =>
              onSelect({
                owner: repo.owner.login,
                name: repo.name,
                fullName: repo.full_name,
              })
            }
          >
            {repo.full_name}
          </Button>
        ))}

        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">
            No repos found. Create one on GitHub first.
          </p>
        )}
      </div>
    </div>
  )
}
