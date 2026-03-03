import { callGemini } from './gemini.client'
import { projectGenerationPrompt, dailySuggestionPrompt, contentParsingPrompt } from './prompts'
import type { GoalInput, Goal } from '@/types'

interface ProjectPlan {
  title: string
  description: string
  totalDays: number
  phases: Array<{ name: string; startDay: number; endDay: number; description: string }>
  categories: string[]
  goals: GoalInput[]
}

function extractJSON(text: string): string {
  // Try to find JSON in the response (handle code fences)
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) return fenceMatch[1].trim()

  // Try raw JSON
  const jsonMatch = text.match(/[\[{][\s\S]*[\]}]/)
  if (jsonMatch) return jsonMatch[0]

  return text
}

class AIService {
  async generateProject(apiKey: string, description: string): Promise<ProjectPlan> {
    const prompt = projectGenerationPrompt(description)
    const response = await callGemini(apiKey, prompt)
    const json = JSON.parse(extractJSON(response))

    return {
      title: json.title,
      description: json.description,
      totalDays: json.totalDays ?? 30,
      phases: json.phases ?? [],
      categories: json.categories ?? [],
      goals: (json.goals ?? []).map((g: Record<string, unknown>) => ({
        title: g.title as string,
        description: (g.description as string) ?? '',
        category: (g.category as string) ?? 'general',
        priority: (g.priority as string) ?? 'medium',
        day: g.day as number | undefined,
        projectSlug: '',
        status: 'todo' as const,
      })),
    }
  }

  async suggestDaily(
    apiKey: string,
    goals: Goal[],
    completedCount: number,
    currentDay: number,
  ): Promise<string> {
    const pendingGoals = goals
      .filter(g => g.status !== 'done')
      .map(g => g.title)

    const prompt = dailySuggestionPrompt(
      pendingGoals,
      completedCount,
      goals.length,
      currentDay,
    )

    return await callGemini(apiKey, prompt)
  }

  async parseContent(apiKey: string, text: string, projectSlug: string): Promise<GoalInput[]> {
    const prompt = contentParsingPrompt(text)
    const response = await callGemini(apiKey, prompt)
    const json = JSON.parse(extractJSON(response))

    const goals: GoalInput[] = (Array.isArray(json) ? json : json.goals ?? []).map(
      (g: Record<string, unknown>) => ({
        title: g.title as string,
        description: (g.description as string) ?? '',
        category: (g.category as string) ?? 'general',
        priority: (g.priority as string) ?? 'medium',
        projectSlug,
        status: 'todo' as const,
      }),
    )

    return goals
  }
}

export const aiService = new AIService()
