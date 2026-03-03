import { useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { Button, FullPageSpinner } from '@/components/ui'
import { useProjects } from '@/hooks/useProjects'
import { useStreak } from '@/hooks/useStreak'
import { useCheckInStore } from '@/store/checkin.store'
import { ProjectCard } from './ProjectCard'
import { OverallStats } from './OverallStats'
import { StreakHeatmap } from './StreakHeatmap'
import { CreateProjectModal } from './CreateProjectModal'
import { AIProjectGenerator } from '@/components/ai/AIProjectGenerator'
import { useAuthStore } from '@/store/auth.store'

export function DashboardPage() {
  const { projects, isLoading, createProject, deleteProject } = useProjects()
  const checkIns = useCheckInStore((s) => s.checkIns)
  const { streakData, heatmapData } = useStreak(checkIns)
  const geminiKey = useAuthStore((s) => s.geminiKey)

  const [showCreate, setShowCreate] = useState(false)
  const [showAI, setShowAI] = useState(false)

  const completedGoals = projects.reduce((sum, p) => sum + p.completedGoals, 0)

  if (isLoading && projects.length === 0) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <div className="flex gap-2">
          {geminiKey && (
            <Button variant="secondary" onClick={() => setShowAI(true)}>
              <Sparkles className="h-4 w-4" />
              AI Generate
            </Button>
          )}
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <OverallStats
        totalProjects={projects.length}

        completedGoals={completedGoals}
        streak={streakData}
      />

      <StreakHeatmap data={heatmapData} />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">No projects yet</p>
          <p className="mt-1 text-sm text-gray-400">Create your first project to start tracking goals.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onDelete={deleteProject} />
          ))}
        </div>
      )}

      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createProject}
      />

      {showAI && (
        <AIProjectGenerator
          open={showAI}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  )
}
