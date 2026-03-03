export const GITHUB_API_BASE = 'https://api.github.com'

export const REQUIRED_LABELS = [
  { name: 'status:todo', color: '94a3b8', description: 'Task is in todo' },
  { name: 'status:inprogress', color: '3b82f6', description: 'Task is in progress' },
  { name: 'status:done', color: '22c55e', description: 'Task is done' },
  { name: 'type:goal', color: 'a855f7', description: 'A goal/task item' },
  { name: 'type:dailylog', color: 'f59e0b', description: 'Daily log issue' },
  { name: 'priority:low', color: '22c55e', description: 'Low priority' },
  { name: 'priority:medium', color: 'eab308', description: 'Medium priority' },
  { name: 'priority:high', color: 'f97316', description: 'High priority' },
  { name: 'priority:critical', color: 'ef4444', description: 'Critical priority' },
]
