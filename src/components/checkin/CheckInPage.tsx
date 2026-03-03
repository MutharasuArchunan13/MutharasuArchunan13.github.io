import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Sparkles } from 'lucide-react'
import { Button, Card, TextArea, FullPageSpinner } from '@/components/ui'
import { useGoals } from '@/hooks/useGoals'
import { useCheckins } from '@/hooks/useCheckins'
import { useProjectStore } from '@/store/project.store'
import { useAuthStore } from '@/store/auth.store'
import { milestoneService, configService } from '@/services/github'
import { TaskChecklist } from './TaskChecklist'
import { CheckInHistory } from './CheckInHistory'
import { projectPath } from '@/config/routes'
import { today, getDayNumber } from '@/utils/date'
import { ENERGY_LEVELS } from '@/config/constants'
import { useAI } from '@/hooks/useAI'
import { cn } from '@/utils/cn'

export function CheckInPage() {
  const { slug } = useParams<{ slug: string }>()
  const repo = useAuthStore((s) => s.repo)
  const { setActiveProject, setActiveConfig, activeConfig } = useProjectStore()
  const { allGoals, isLoading: goalsLoading, changeStatus } = useGoals(slug ?? '')
  const { hasAI, isGenerating, suggestDaily } = useAI()

  const [dailyLogNumber, setDailyLogNumber] = useState<number | null>(null)
  const { checkIns, createCheckIn } = useCheckins(dailyLogNumber)

  const [checked, setChecked] = useState(new Set<number>())
  const [notes, setNotes] = useState('')
  const [energy, setEnergy] = useState(3)
  const [spokeOutLoud, setSpokeOutLoud] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!repo || !slug) return
    loadProject()
    async function loadProject() {
      try {
        const project = await milestoneService.getProjectBySlug(repo!.owner, repo!.name, slug!)
        if (project) {
          setActiveProject(project)
          const config = await configService.getProjectConfig(repo!.owner, repo!.name, slug!)
          setActiveConfig(config)
          if (config?.dailyLogIssueNumber) {
            setDailyLogNumber(config.dailyLogIssueNumber)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.owner, repo?.name, slug])

  const currentDay = activeConfig?.startDate
    ? getDayNumber(activeConfig.startDate)
    : checkIns.length + 1

  const goalTitles = useMemo(() => {
    const map = new Map<number, string>()
    allGoals.forEach(g => map.set(g.number, g.title))
    return map
  }, [allGoals])

  function toggleGoal(number: number) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(number)) next.delete(number)
      else next.add(number)
      return next
    })
  }

  async function handleSubmit() {
    if (checked.size === 0 && !notes.trim()) return
    setSubmitting(true)

    // Mark checked goals as done
    for (const goalNumber of checked) {
      await changeStatus(goalNumber, 'done')
    }

    await createCheckIn(
      {
        day: currentDay,
        date: today(),
        completedGoalNumbers: Array.from(checked),
        notes,
        energy,
        spokeOutLoud,
      },
      goalTitles,
    )

    setChecked(new Set())
    setNotes('')
    setEnergy(3)
    setSpokeOutLoud(false)
    setSubmitting(false)
  }

  async function loadSuggestion() {
    const completedCount = allGoals.filter(g => g.status === 'done').length
    const result = await suggestDaily(allGoals, completedCount, currentDay)
    setSuggestion(result)
  }

  if (loading || goalsLoading) return <FullPageSpinner />

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link to={projectPath(slug ?? '')}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Day {currentDay} Check-in
          </h2>
          <p className="text-sm text-gray-500">{today()}</p>
        </div>
      </div>

      {hasAI && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              AI Suggestion
            </span>
            <Button variant="ghost" size="sm" onClick={loadSuggestion} loading={isGenerating}>
              <Sparkles className="h-4 w-4" />
              {suggestion ? 'Refresh' : 'Get Suggestion'}
            </Button>
          </div>
          {suggestion && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
              {suggestion}
            </p>
          )}
        </Card>
      )}

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          What did you complete today?
        </h3>
        <TaskChecklist goals={allGoals} checked={checked} onToggle={toggleGoal} />
      </Card>

      <Card className="space-y-4 p-4">
        <TextArea
          label="Notes"
          placeholder="What did you learn? What was challenging?"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Energy Level
          </label>
          <div className="flex gap-2">
            {ENERGY_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setEnergy(level)}
                className={cn(
                  'h-10 w-10 rounded-lg border text-sm font-medium transition-colors',
                  energy === level
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={spokeOutLoud}
            onChange={(e) => setSpokeOutLoud(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Practiced explaining out loud
          </span>
        </label>

        <Button onClick={handleSubmit} loading={submitting} className="w-full">
          <Send className="h-4 w-4" />
          Submit Check-in ({checked.size} tasks)
        </Button>
      </Card>

      <CheckInHistory checkIns={checkIns} />
    </div>
  )
}
