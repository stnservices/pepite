import { create } from 'zustand'
import { api } from '@/lib/api'
import type { ClientProject } from '@/types'

interface ProjectsState {
  projects: ClientProject[]
  _hydrated: boolean
  hydrate: () => Promise<void>
  addProject: (project: Omit<ClientProject, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateProject: (id: string, updates: Partial<ClientProject>) => void
  deleteProject: (id: string) => void
  getProjectByLead: (leadId: string) => ClientProject | undefined
}

function syncToServer(get: () => ProjectsState) {
  const { projects } = get()
  api.put('/projects', { projects }).catch(console.error)
}

export const useProjectsStore = create<ProjectsState>()((set, get) => ({
  projects: [],
  _hydrated: false,

  hydrate: async () => {
    try {
      const data = await api.get<{ projects: ClientProject[] }>('/projects')
      set({ projects: data.projects || [], _hydrated: true })
    } catch {
      set({ _hydrated: true })
    }
  },

  addProject: (data) => {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const project: ClientProject = { ...data, id, createdAt: now, updatedAt: now }
    set((state) => ({ projects: [...state.projects, project] }))
    syncToServer(get)
    return id
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }))
    syncToServer(get)
  },

  deleteProject: (id) => {
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }))
    syncToServer(get)
  },

  getProjectByLead: (leadId) => {
    return get().projects.find((p) => p.leadId === leadId)
  },
}))
