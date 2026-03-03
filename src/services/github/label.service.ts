import { BaseGitHubService } from './base.service'
import { REQUIRED_LABELS } from '@/config/github'

interface LabelInfo {
  name: string
  color: string
  description: string
}

class LabelService extends BaseGitHubService {
  async ensureLabelsExist(owner: string, repo: string, extraLabels: LabelInfo[] = []): Promise<void> {
    const existing = await this.listLabels(owner, repo)
    const existingNames = new Set(existing.map(l => l.name))

    const allLabels = [...REQUIRED_LABELS, ...extraLabels]

    for (const label of allLabels) {
      if (!existingNames.has(label.name)) {
        await this.createLabel(owner, repo, label)
      }
    }
  }

  async listLabels(owner: string, repo: string): Promise<Array<{ name: string; color: string }>> {
    const data = await this.paginate(
      (params) => this.octokit.rest.issues.listLabelsForRepo(params as Parameters<typeof this.octokit.rest.issues.listLabelsForRepo>[0]),
      { owner, repo },
    )
    return data.map(l => ({ name: l.name, color: l.color }))
  }

  async createLabel(owner: string, repo: string, label: LabelInfo): Promise<void> {
    try {
      await this.octokit.rest.issues.createLabel({
        owner,
        repo,
        name: label.name,
        color: label.color.replace('#', ''),
        description: label.description,
      })
    } catch (error: unknown) {
      const err = error as { status?: number }
      if (err.status === 422) return // already exists
      throw error
    }
  }

  async ensureProjectLabel(owner: string, repo: string, slug: string): Promise<void> {
    await this.createLabel(owner, repo, {
      name: `project:${slug}`,
      color: '6366f1',
      description: `Project: ${slug}`,
    })
  }

  async ensureCategoryLabel(owner: string, repo: string, category: string): Promise<void> {
    await this.createLabel(owner, repo, {
      name: `category:${category}`,
      color: '8b5cf6',
      description: `Category: ${category}`,
    })
  }
}

export const labelService = new LabelService()
