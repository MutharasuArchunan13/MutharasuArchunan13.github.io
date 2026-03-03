import { getOctokit } from './client'
import type { Octokit } from '@octokit/rest'

export abstract class BaseGitHubService {
  protected get octokit(): Octokit {
    return getOctokit()
  }

  protected async paginate<T>(
    method: (params: Record<string, unknown>) => Promise<{ data: T[] }>,
    params: Record<string, unknown>,
  ): Promise<T[]> {
    const allItems: T[] = []
    let page = 1
    const perPage = 100

    while (true) {
      const { data } = await method({ ...params, per_page: perPage, page })
      allItems.push(...data)
      if (data.length < perPage) break
      page++
    }

    return allItems
  }
}
