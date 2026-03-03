import { useNavigate } from 'react-router-dom'
import { Target, Calendar, Trash2 } from 'lucide-react'
import { Card, ProgressBar, Badge, Button } from '@/components/ui'
import { projectPath } from '@/config/routes'
import { formatDate } from '@/utils/date'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onDelete?: (id: number) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(projectPath(project.slug))}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-brand-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{project.title}</h3>
        </div>
        <Badge variant={project.state === 'open' ? 'info' : 'success'}>
          {project.state}
        </Badge>
      </div>

      {project.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {project.description}
        </p>
      )}

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {project.completedGoals}/{project.totalGoals} goals
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {project.totalGoals > 0
              ? Math.round((project.completedGoals / project.totalGoals) * 100)
              : 0}%
          </span>
        </div>
        <ProgressBar value={project.completedGoals} max={project.totalGoals} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        {project.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Due {formatDate(project.dueDate)}</span>
          </div>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-gray-400 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(project.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
