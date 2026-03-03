import { Octokit } from '@octokit/rest'

let octokitInstance: Octokit | null = null

export function getOctokit(): Octokit {
  if (!octokitInstance) {
    throw new Error('GitHub client not initialized. Call initOctokit first.')
  }
  return octokitInstance
}

export function initOctokit(token: string): Octokit {
  octokitInstance = new Octokit({ auth: token })
  return octokitInstance
}

export function resetOctokit(): void {
  octokitInstance = null
}
