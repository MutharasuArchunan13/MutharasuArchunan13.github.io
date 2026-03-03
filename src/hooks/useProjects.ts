import { useEffect } from 'react'
import { useProjectStore } from '@/store/project.store'
import { milestoneService, configService, labelService, issueService } from '@/services/github'
import { useAuthStore } from '@/store/auth.store'
import { formatError } from '@/utils/error'
import { useUIStore } from '@/store/ui.store'
import type { ProjectInput } from '@/types'

export function useProjects() {
  const repo = useAuthStore((s) => s.repo)
  const { projects, isLoading, error, setProjects, setLoading, setError, addProject, removeProject } = useProjectStore()
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    if (!repo) return
    loadProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.owner, repo?.name])

  async function loadProjects() {
    if (!repo) return
    setLoading(true)
    try {
      const data = await milestoneService.listProjects(repo.owner, repo.name)
      setProjects(data)
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  async function createProject(input: ProjectInput) {
    if (!repo) return
    setLoading(true)
    try {
      const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      await labelService.ensureProjectLabel(repo.owner, repo.name, slug)

      if (input.categories) {
        for (const cat of input.categories) {
          await labelService.ensureCategoryLabel(repo.owner, repo.name, cat)
        }
      }

      const project = await milestoneService.createProject(repo.owner, repo.name, input)

      // Create daily log issue
      const dailyLogNumber = await issueService.ensureDailyLogIssue(
        repo.owner, repo.name, slug, project.id,
      )

      // Save config
      await configService.saveProjectConfig(repo.owner, repo.name, slug, {
        phases: input.phases ?? [],
        categories: input.categories ?? [],
        dailyLogIssueNumber: dailyLogNumber,
        startDate: new Date().toISOString().split('T')[0],
        totalDays: input.totalDays ?? 90,
      })

      addProject({ ...project, dailyLogIssueNumber: dailyLogNumber })
      addToast('Project created successfully', 'success')
      return project
    } catch (err) {
      setError(formatError(err))
      addToast(formatError(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  async function deleteProject(milestoneNumber: number) {
    if (!repo) return
    try {
      await milestoneService.deleteProject(repo.owner, repo.name, milestoneNumber)
      removeProject(milestoneNumber)
      addToast('Project deleted', 'success')
    } catch (err) {
      addToast(formatError(err), 'error')
    }
  }

  return { projects, isLoading, error, loadProjects, createProject, deleteProject }
}
