import { BaseGitHubService } from './base.service'
import type { ProjectConfig } from '@/types'
import { CONFIG_FILE_PATH } from '@/config/constants'

interface TrackerConfig {
  projects: Record<string, ProjectConfig>
}

class ConfigService extends BaseGitHubService {
  async getConfig(owner: string, repo: string): Promise<TrackerConfig> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path: CONFIG_FILE_PATH,
      })

      if ('content' in data && typeof data.content === 'string') {
        const decoded = atob(data.content.replace(/\n/g, ''))
        return JSON.parse(decoded) as TrackerConfig
      }
    } catch (error: unknown) {
      const err = error as { status?: number }
      if (err.status === 404) {
        return { projects: {} }
      }
      throw error
    }

    return { projects: {} }
  }

  async saveConfig(owner: string, repo: string, config: TrackerConfig): Promise<void> {
    let sha: string | undefined

    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path: CONFIG_FILE_PATH,
      })
      if ('sha' in data) {
        sha = data.sha as string
      }
    } catch {
      // file doesn't exist yet
    }

    await this.octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: CONFIG_FILE_PATH,
      message: 'chore: update tracker config',
      content: btoa(JSON.stringify(config, null, 2)),
      sha,
    })
  }

  async getProjectConfig(owner: string, repo: string, slug: string): Promise<ProjectConfig | null> {
    const config = await this.getConfig(owner, repo)
    return config.projects[slug] ?? null
  }

  async saveProjectConfig(owner: string, repo: string, slug: string, projectConfig: ProjectConfig): Promise<void> {
    const config = await this.getConfig(owner, repo)
    config.projects[slug] = projectConfig
    await this.saveConfig(owner, repo, config)
  }
}

export const configService = new ConfigService()
