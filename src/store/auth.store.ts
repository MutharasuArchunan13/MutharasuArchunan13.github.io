import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, RepoInfo } from '@/types'
import { initOctokit, resetOctokit } from '@/services/github'

interface AuthStore {
  token: string | null
  geminiKey: string | null
  user: UserProfile | null
  repo: RepoInfo | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (token: string) => Promise<void>
  setGeminiKey: (key: string) => void
  setRepo: (repo: RepoInfo) => void
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      geminiKey: null,
      user: null,
      repo: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (token: string) => {
        set({ isLoading: true, error: null })
        try {
          const octokit = initOctokit(token)
          const { data } = await octokit.rest.users.getAuthenticated()

          set({
            token,
            user: {
              login: data.login,
              avatarUrl: data.avatar_url,
              name: data.name ?? data.login,
              htmlUrl: data.html_url,
            },
            isAuthenticated: true,
            isLoading: false,
          })
        } catch {
          resetOctokit()
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Invalid GitHub token. Please check your PAT.',
          })
        }
      },

      setGeminiKey: (key: string) => {
        set({ geminiKey: key })
      },

      setRepo: (repo: RepoInfo) => {
        set({ repo })
      },

      logout: () => {
        resetOctokit()
        set({
          token: null,
          geminiKey: null,
          user: null,
          repo: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'goal-tracker-auth',
      partialize: (state) => ({
        token: state.token,
        geminiKey: state.geminiKey,
        user: state.user,
        repo: state.repo,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// Reinitialize octokit from persisted state on load
const persisted = useAuthStore.getState()
if (persisted.token) {
  initOctokit(persisted.token)
}
