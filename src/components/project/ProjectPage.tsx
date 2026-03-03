import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Columns3, CalendarCheck, BarChart3, Clipboard } from 'lucide-react'
import { Button, FullPageSpinner, ProgressBar, Input } from '@/components/ui'
import { useGoals } from '@/hooks/useGoals'
import { useProjectStore } from '@/store/project.store'
import { useAuthStore } from '@/store/auth.store'
import { milestoneService, configService } from '@/services/github'
import { GoalItem } from './GoalItem'
import { GoalForm } from './GoalForm'
import { CategoryFilter } from './CategoryFilter'
import { PhaseTimeline } from './PhaseTimeline'
import { kanbanPath, checkinPath, analyticsPath } from '@/config/routes'
import { getDayNumber } from '@/utils/date'
import { AIContentParser } from '@/components/ai/AIContentParser'
import { useAuthStore as useAuth } from '@/store/auth.store'

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const repo = useAuthStore((s) => s.repo)
  const { activeProject, activeConfig, setActiveProject, setActiveConfig } = useProjectStore()
  const geminiKey = useAuth((s) => s.geminiKey)

  const {
    goals,
    categories,
    stats,
    filter,
    isLoading,
    createGoal,
    changeStatus,
    setFilter,
    loadGoals,
  } = useGoals(slug ?? '')

  const [showGoalForm, setShowGoalForm] = useState(false)
  const [showContentParser, setShowContentParser] = useState(false)
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
        }
      } finally {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.owner, repo?.name, slug])

  if (loading || isLoading) return <FullPageSpinner />
  if (!activeProject || !slug) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    )
  }

  const currentDay = activeConfig?.startDate
    ? getDayNumber(activeConfig.startDate)
    : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeProject.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {activeProject.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={checkinPath(slug)}>
            <Button variant="secondary" size="sm">
              <CalendarCheck className="h-4 w-4" /> Check-in
            </Button>
          </Link>
          <Link to={kanbanPath(slug)}>
            <Button variant="secondary" size="sm">
              <Columns3 className="h-4 w-4" /> Kanban
            </Button>
          </Link>
          <Link to={analyticsPath(slug)}>
            <Button variant="secondary" size="sm">
              <BarChart3 className="h-4 w-4" /> Analytics
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <ProgressBar value={stats.done} max={stats.total} size="md" showLabel />
        </div>
        <span className="text-sm text-gray-500">
          {stats.done}/{stats.total} done | {stats.inProgress} in progress | {stats.todo} todo
        </span>
      </div>

      {activeConfig && activeConfig.phases.length > 0 && (
        <PhaseTimeline phases={activeConfig.phases} currentDay={currentDay} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <CategoryFilter
          categories={categories}
          active={filter.category ?? 'all'}
          onChange={(c) => setFilter({ category: c })}
        />
        <div className="flex gap-2">
          <Input
            placeholder="Search goals..."
            value={filter.search ?? ''}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-48"
          />
          {geminiKey && (
            <Button variant="secondary" size="sm" onClick={() => setShowContentParser(true)}>
              <Clipboard className="h-4 w-4" /> Import
            </Button>
          )}
          <Button size="sm" onClick={() => setShowGoalForm(true)}>
            <Plus className="h-4 w-4" /> Add Goal
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {goals.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No goals yet. Add your first one!</p>
          </div>
        ) : (
          goals.map((goal) => (
            <GoalItem
              key={goal.number}
              goal={goal}
              onStatusChange={changeStatus}
            />
          ))
        )}
      </div>

      <GoalForm
        open={showGoalForm}
        onClose={() => setShowGoalForm(false)}
        onCreate={createGoal}
        projectSlug={slug}
        categories={categories}
      />

      {showContentParser && (
        <AIContentParser
          open={showContentParser}
          onClose={() => setShowContentParser(false)}
          projectSlug={slug}
          onImport={async (goals) => {
            for (const g of goals) {
              await createGoal(g)
            }
            loadGoals()
          }}
        />
      )}
    </div>
  )
}
