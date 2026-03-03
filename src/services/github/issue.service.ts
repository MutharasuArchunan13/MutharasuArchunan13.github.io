import { BaseGitHubService } from './base.service'
import type { Goal, GoalInput, GoalUpdate, GoalStatus } from '@/types'
import { extractFromLabels, buildGoalLabels, buildStatusLabel } from '@/utils/label'
import { LABEL_PREFIX, STATUS_LABELS, TYPE_LABELS } from '@/config/constants'
import { labelService } from './label.service'

class IssueService extends BaseGitHubService {
  async listGoals(owner: string, repo: string, projectSlug: string): Promise<Goal[]> {
    const issues = await this.paginate(
      (params) => this.octokit.rest.issues.listForRepo(params as Parameters<typeof this.octokit.rest.issues.listForRepo>[0]),
      {
        owner,
        repo,
        labels: `project:${projectSlug},${TYPE_LABELS.goal}`,
        state: 'all',
        sort: 'created',
        direction: 'asc',
      },
    )

    return issues
      .filter(i => !i.pull_request)
      .map(i => this.mapIssueToGoal(i))
  }

  async getGoal(owner: string, repo: string, issueNumber: number): Promise<Goal> {
    const { data } = await this.octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    })
    return this.mapIssueToGoal(data)
  }

  async createGoal(owner: string, repo: string, input: GoalInput, milestoneNumber: number): Promise<Goal> {
    const status = input.status ?? 'todo'
    const priority = input.priority ?? 'medium'

    await labelService.ensureCategoryLabel(owner, repo, input.category)

    const labels = buildGoalLabels(
      input.projectSlug,
      status,
      input.category,
      priority,
      input.day,
    )

    const { data } = await this.octokit.rest.issues.create({
      owner,
      repo,
      title: input.title,
      body: input.description,
      labels,
      milestone: milestoneNumber,
    })

    return this.mapIssueToGoal(data)
  }

  async bulkCreateGoals(
    owner: string,
    repo: string,
    inputs: GoalInput[],
    milestoneNumber: number,
  ): Promise<Goal[]> {
    const goals: Goal[] = []
    for (const input of inputs) {
      const goal = await this.createGoal(owner, repo, input, milestoneNumber)
      goals.push(goal)
    }
    return goals
  }

  async updateGoalStatus(
    owner: string,
    repo: string,
    issueNumber: number,
    currentLabels: string[],
    newStatus: GoalStatus,
  ): Promise<void> {
    // Remove old status label, add new one
    const oldStatusLabels = currentLabels.filter(l => l.startsWith(LABEL_PREFIX.STATUS))
    for (const label of oldStatusLabels) {
      try {
        await this.octokit.rest.issues.removeLabel({
          owner,
          repo,
          issue_number: issueNumber,
          name: label,
        })
      } catch {
        // label might not exist
      }
    }

    await this.octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels: [buildStatusLabel(newStatus)],
    })

    // Close/reopen based on status
    const state = newStatus === 'done' ? 'closed' : 'open'
    await this.octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state,
    })
  }

  async updateGoal(
    owner: string,
    repo: string,
    issueNumber: number,
    currentLabels: string[],
    update: GoalUpdate,
  ): Promise<void> {
    const updatePayload: Record<string, unknown> = {}

    if (update.title) updatePayload.title = update.title
    if (update.description !== undefined) updatePayload.body = update.description

    if (Object.keys(updatePayload).length > 0) {
      await this.octokit.rest.issues.update({
        owner,
        repo,
        issue_number: issueNumber,
        ...updatePayload,
      })
    }

    if (update.status) {
      await this.updateGoalStatus(owner, repo, issueNumber, currentLabels, update.status)
    }
  }

  async deleteGoal(owner: string, repo: string, issueNumber: number): Promise<void> {
    await this.octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
      labels: [STATUS_LABELS.done],
    })
  }

  async ensureDailyLogIssue(
    owner: string,
    repo: string,
    projectSlug: string,
    milestoneNumber: number,
  ): Promise<number> {
    // Check if daily log issue already exists
    const issues = await this.paginate(
      (params) => this.octokit.rest.issues.listForRepo(params as Parameters<typeof this.octokit.rest.issues.listForRepo>[0]),
      {
        owner,
        repo,
        labels: `project:${projectSlug},${TYPE_LABELS.dailylog}`,
        state: 'open',
      },
    )

    if (issues.length > 0) {
      return (issues[0] as { number: number }).number
    }

    const { data } = await this.octokit.rest.issues.create({
      owner,
      repo,
      title: `📋 Daily Log — ${projectSlug}`,
      body: 'This issue tracks daily check-ins for the project. Each comment represents a day.',
      labels: [`project:${projectSlug}`, TYPE_LABELS.dailylog],
      milestone: milestoneNumber,
    })

    return data.number
  }

  private mapIssueToGoal(issue: Record<string, unknown>): Goal {
    const i = issue as {
      id: number
      number: number
      title: string
      body: string | null
      labels: Array<{ name?: string } | string>
      created_at: string
      updated_at: string
      closed_at: string | null
    }

    const labelNames = i.labels.map(l =>
      typeof l === 'string' ? l : l.name ?? '',
    )
    const { projectSlug, category, priority, status, day } = extractFromLabels(labelNames)

    return {
      id: i.id,
      number: i.number,
      title: i.title,
      description: i.body ?? '',
      status,
      priority,
      category,
      projectSlug: projectSlug ?? '',
      day,
      assignedDate: null,
      createdAt: i.created_at,
      updatedAt: i.updated_at,
      closedAt: i.closed_at,
      labels: labelNames,
    }
  }
}

export const issueService = new IssueService()
