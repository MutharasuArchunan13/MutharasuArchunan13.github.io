import { create } from 'zustand'
import type { Project, ProjectConfig } from '@/types'

interface ProjectStore {
  projects: Project[]
  activeProject: Project | null
  activeConfig: ProjectConfig | null
  isLoading: boolean
  error: string | null

  setProjects: (projects: Project[]) => void
  setActiveProject: (project: Project | null) => void
  setActiveConfig: (config: ProjectConfig | null) => void
  updateProject: (id: number, updates: Partial<Project>) => void
  addProject: (project: Project) => void
  removeProject: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useProjectStore = create<ProjectStore>()((set) => ({
  projects: [],
  activeProject: null,
  activeConfig: null,
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),

  setActiveProject: (project) => set({ activeProject: project }),

  setActiveConfig: (config) => set({ activeConfig: config }),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
      activeProject: state.activeProject?.id === id
        ? { ...state.activeProject, ...updates }
        : state.activeProject,
    })),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter(p => p.id !== id),
      activeProject: state.activeProject?.id === id ? null : state.activeProject,
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
