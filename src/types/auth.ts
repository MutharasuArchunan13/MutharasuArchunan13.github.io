export interface UserProfile {
  login: string
  avatarUrl: string
  name: string | null
  htmlUrl: string
}

export interface AuthState {
  token: string | null
  geminiKey: string | null
  user: UserProfile | null
  repo: RepoInfo | null
  isAuthenticated: boolean
}

export interface RepoInfo {
  owner: string
  name: string
  fullName: string
}
