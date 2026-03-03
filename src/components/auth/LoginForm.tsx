import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Github, Sparkles } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { useAuthStore } from '@/store/auth.store'
import { labelService } from '@/services/github'
import { RepoSelector } from './RepoSelector'
import type { RepoInfo } from '@/types'

type Step = 'token' | 'repo' | 'gemini'

export function LoginForm() {
  const { login, setGeminiKey, setRepo, isLoading, error, isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>(isAuthenticated ? 'repo' : 'token')
  const [token, setToken] = useState('')
  const [gemini, setGemini] = useState('')

  async function handleTokenSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token.trim()) return
    await login(token.trim())
    // If login succeeds (state updates), move to next step
    if (useAuthStore.getState().isAuthenticated) {
      setStep('repo')
    }
  }

  async function handleRepoSelect(repo: RepoInfo) {
    setRepo(repo)
    // Bootstrap labels
    try {
      await labelService.ensureLabelsExist(repo.owner, repo.name)
    } catch {
      // non-fatal — labels can be created later
    }
    setStep('gemini')
  }

  function handleGeminiSubmit(e: FormEvent) {
    e.preventDefault()
    if (gemini.trim()) {
      setGeminiKey(gemini.trim())
    }
    navigate('/')
  }

  function handleSkipGemini() {
    navigate('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goal Tracker</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track goals, build streaks, ship daily.
          </p>
        </div>

        {step === 'token' && (
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Github className="h-4 w-4" />
              <span>Step 1: GitHub Personal Access Token</span>
            </div>
            <Input
              id="pat"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              label="GitHub PAT (repo scope)"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-gray-400">
              Create a fine-grained PAT with repo access at{' '}
              <a
                href="https://github.com/settings/tokens?type=beta"
                target="_blank"
                rel="noreferrer"
                className="text-brand-500 hover:underline"
              >
                GitHub Settings
              </a>
            </p>
            <Button type="submit" className="w-full" loading={isLoading}>
              <KeyRound className="h-4 w-4" />
              Authenticate
            </Button>
          </form>
        )}

        {step === 'repo' && user && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Github className="h-4 w-4" />
              <span>Step 2: Select Repository</span>
            </div>
            <p className="text-sm text-gray-500">
              Logged in as <strong>{user.login}</strong>. Select or create a repo for tracking.
            </p>
            <RepoSelector onSelect={handleRepoSelect} />
          </div>
        )}

        {step === 'gemini' && (
          <form onSubmit={handleGeminiSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="h-4 w-4" />
              <span>Step 3: AI Features (Optional)</span>
            </div>
            <Input
              id="gemini"
              type="password"
              placeholder="AIzaSy..."
              value={gemini}
              onChange={(e) => setGemini(e.target.value)}
              label="Google Gemini API Key"
            />
            <p className="text-xs text-gray-400">
              Enables AI project generation and daily suggestions. Free tier: 15 req/min.
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={handleSkipGemini}>
                Skip
              </Button>
              <Button type="submit" className="flex-1">
                <Sparkles className="h-4 w-4" />
                Save & Continue
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
