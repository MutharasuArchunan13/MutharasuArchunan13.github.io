import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { aiService } from '@/services/ai/ai.service'
import { formatError } from '@/utils/error'
import type { GoalInput, Goal } from '@/types'

interface ProjectPlan {
  title: string
  description: string
  totalDays: number
  phases: Array<{ name: string; startDay: number; endDay: number; description: string }>
  categories: string[]
  goals: GoalInput[]
}

export function useAI() {
  const geminiKey = useAuthStore((s) => s.geminiKey)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasAI = Boolean(geminiKey)

  async function generateProject(description: string): Promise<ProjectPlan | null> {
    if (!geminiKey) {
      setError('Gemini API key not configured')
      return null
    }
    setIsGenerating(true)
    setError(null)
    try {
      return await aiService.generateProject(geminiKey, description)
    } catch (err) {
      setError(formatError(err))
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  async function suggestDaily(
    goals: Goal[],
    completedCount: number,
    currentDay: number,
  ): Promise<string | null> {
    if (!geminiKey) return null
    setIsGenerating(true)
    try {
      return await aiService.suggestDaily(geminiKey, goals, completedCount, currentDay)
    } catch {
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  async function parseContent(text: string, projectSlug: string): Promise<GoalInput[] | null> {
    if (!geminiKey) {
      setError('Gemini API key not configured')
      return null
    }
    setIsGenerating(true)
    setError(null)
    try {
      return await aiService.parseContent(geminiKey, text, projectSlug)
    } catch (err) {
      setError(formatError(err))
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return { hasAI, isGenerating, error, generateProject, suggestDaily, parseContent }
}
