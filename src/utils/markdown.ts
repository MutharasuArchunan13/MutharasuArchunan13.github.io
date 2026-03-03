import type { CheckInInput, CheckInMeta, DailyCheckIn } from '@/types'
import { formatDate } from './date'

const META_REGEX = /<!-- tracker-meta:(\{.*\}) -->/

export function generateCheckInMarkdown(input: CheckInInput, goalTitles: Map<number, string>): string {
  const completedLines = input.completedGoalNumbers
    .map(num => `- [x] ${goalTitles.get(num) ?? `Goal #${num}`} (#${num})`)
    .join('\n')

  const meta: CheckInMeta = {
    day: input.day,
    energy: input.energy,
    completed: input.completedGoalNumbers,
    spokeOutLoud: input.spokeOutLoud,
  }

  return `## Day ${input.day} | ${formatDate(input.date)}

### Completed
${completedLines || '- No tasks completed today'}

### Notes
${input.notes || 'No notes.'}

### Stats
- Energy: ${input.energy}/5 | Spoke out loud: ${input.spokeOutLoud ? 'Yes' : 'No'}

<!-- tracker-meta:${JSON.stringify(meta)} -->`
}

export function parseCheckInComment(commentId: number, body: string, createdAt: string): DailyCheckIn | null {
  const metaMatch = body.match(META_REGEX)
  if (!metaMatch) return null

  try {
    const meta: CheckInMeta = JSON.parse(metaMatch[1])
    const dateMatch = body.match(/## Day \d+ \| (.+)/)
    const notesMatch = body.match(/### Notes\n([\s\S]*?)(?=\n### |<!-- )/)

    return {
      id: commentId,
      day: meta.day,
      date: dateMatch ? dateMatch[1].trim() : createdAt,
      completedGoalNumbers: meta.completed,
      notes: notesMatch ? notesMatch[1].trim() : '',
      energy: meta.energy,
      spokeOutLoud: meta.spokeOutLoud ?? false,
      createdAt,
    }
  } catch {
    return null
  }
}

export function parseAllCheckIns(
  comments: Array<{ id: number; body?: string; created_at: string }>,
): DailyCheckIn[] {
  return comments
    .map(c => parseCheckInComment(c.id, c.body ?? '', c.created_at))
    .filter((c): c is DailyCheckIn => c !== null)
    .sort((a, b) => a.day - b.day)
}
