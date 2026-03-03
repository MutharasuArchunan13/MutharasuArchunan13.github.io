import { BaseGitHubService } from './base.service'
import type { Project, ProjectInput } from '@/types'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

class MilestoneService extends BaseGitHubService {
  async listProjects(owner: string, repo: string): Promise<Project[]> {
    const milestones = await this.paginate(
      (params) => this.octokit.rest.issues.listMilestones(params as Parameters<typeof this.octokit.rest.issues.listMilestones>[0]),
      { owner, repo, state: 'all', sort: 'created', direction: 'desc' },
    )

    return milestones.map(m => this.mapMilestone(m))
  }

  async getProject(owner: string, repo: string, milestoneNumber: number): Promise<Project> {
    const { data } = await this.octokit.rest.issues.getMilestone({
      owner,
      repo,
      milestone_number: milestoneNumber,
    })
    return this.mapMilestone(data)
  }

  async getProjectBySlug(owner: string, repo: string, slug: string): Promise<Project | null> {
    const projects = await this.listProjects(owner, repo)
    return projects.find(p => p.slug === slug) ?? null
  }

  async createProject(owner: string, repo: string, input: ProjectInput): Promise<Project> {
    const { data } = await this.octokit.rest.issues.createMilestone({
      owner,
      repo,
      title: input.title,
      description: input.description,
      due_on: input.dueDate ? new Date(input.dueDate).toISOString() : undefined,
    })
    return this.mapMilestone(data)
  }

  async updateProject(
    owner: string,
    repo: string,
    milestoneNumber: number,
    updates: Partial<ProjectInput>,
  ): Promise<Project> {
    const { data } = await this.octokit.rest.issues.updateMilestone({
      owner,
      repo,
      milestone_number: milestoneNumber,
      title: updates.title,
      description: updates.description,
      due_on: updates.dueDate ? new Date(updates.dueDate).toISOString() : undefined,
    })
    return this.mapMilestone(data)
  }

  async deleteProject(owner: string, repo: string, milestoneNumber: number): Promise<void> {
    await this.octokit.rest.issues.deleteMilestone({
      owner,
      repo,
      milestone_number: milestoneNumber,
    })
  }

  private mapMilestone(m: Record<string, unknown>): Project {
    const milestone = m as {
      number: number
      title: string
      description: string | null
      open_issues: number
      closed_issues: number
      due_on: string | null
      created_at: string
      updated_at: string
      state: string
    }
    return {
      id: milestone.number,
      slug: slugify(milestone.title),
      title: milestone.title,
      description: milestone.description ?? '',
      totalGoals: milestone.open_issues + milestone.closed_issues,
      completedGoals: milestone.closed_issues,
      openGoals: milestone.open_issues,
      dueDate: milestone.due_on,
      createdAt: milestone.created_at,
      updatedAt: milestone.updated_at,
      state: milestone.state as 'open' | 'closed',
      phases: [],
      dailyLogIssueNumber: null,
    }
  }
}

export const milestoneService = new MilestoneService()
