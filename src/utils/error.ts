export function formatError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}

export class AppError extends Error {
  readonly code: string
  readonly statusCode: number | undefined

  constructor(message: string, code: string = 'UNKNOWN', statusCode?: number) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
  }
}

export class GitHubApiError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, 'GITHUB_API_ERROR', statusCode)
    this.name = 'GitHubApiError'
  }

  static fromResponse(status: number, body: string): GitHubApiError {
    const messages: Record<number, string> = {
      401: 'Invalid GitHub token. Please check your Personal Access Token.',
      403: 'Access forbidden. Your token may lack required permissions.',
      404: 'Resource not found. Check repository name and permissions.',
      422: 'Invalid request. The data provided is not valid.',
    }
    return new GitHubApiError(messages[status] ?? body, status)
  }
}
