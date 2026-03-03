import { BaseGitHubService } from './base.service'
import type { DailyCheckIn, CheckInInput } from '@/types'
import { generateCheckInMarkdown, parseAllCheckIns } from '@/utils/markdown'

class CommentService extends BaseGitHubService {
  async listCheckIns(
    owner: string,
    repo: string,
    issueNumber: number,
  ): Promise<DailyCheckIn[]> {
    const comments = await this.paginate(
      (params) => this.octokit.rest.issues.listComments(params as Parameters<typeof this.octokit.rest.issues.listComments>[0]),
      { owner, repo, issue_number: issueNumber },
    )

    return parseAllCheckIns(comments)
  }

  async createCheckIn(
    owner: string,
    repo: string,
    issueNumber: number,
    input: CheckInInput,
    goalTitles: Map<number, string>,
  ): Promise<DailyCheckIn> {
    const body = generateCheckInMarkdown(input, goalTitles)

    const { data } = await this.octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body,
    })

    const parsed = parseAllCheckIns([data])
    if (parsed.length === 0) {
      throw new Error('Failed to parse created check-in')
    }
    return parsed[0]
  }

  async updateCheckIn(
    owner: string,
    repo: string,
    commentId: number,
    input: CheckInInput,
    goalTitles: Map<number, string>,
  ): Promise<void> {
    const body = generateCheckInMarkdown(input, goalTitles)
    await this.octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body,
    })
  }

  async deleteCheckIn(owner: string, repo: string, commentId: number): Promise<void> {
    await this.octokit.rest.issues.deleteComment({
      owner,
      repo,
      comment_id: commentId,
    })
  }
}

export const commentService = new CommentService()
