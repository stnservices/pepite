import { create } from 'zustand'
import { api } from '@/lib/api'
import type { Lead, Activity, LeadStatus, ActivityType } from '@/types'

interface LeadsState {
  leads: Lead[]
  activities: Activity[]
  _hydrated: boolean
  hydrate: () => Promise<void>
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateLead: (id: string, updates: Partial<Lead>) => void
  deleteLead: (id: string) => void
  changeStatus: (id: string, status: LeadStatus) => void
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void
  getLeadById: (id: string) => Lead | undefined
  getLeadsByStatus: (status: LeadStatus) => Lead[]
  getActivitiesByLead: (leadId: string) => Activity[]
  importLeads: (leads: Lead[]) => void
  exportData: () => { leads: Lead[]; activities: Activity[] }
}

const generateId = () => crypto.randomUUID()

function syncToServer(get: () => LeadsState) {
  const { leads, activities } = get()
  api.put('/leads', { leads, activities }).catch(console.error)
}

export const useLeadsStore = create<LeadsState>()((set, get) => ({
  leads: [],
  activities: [],
  _hydrated: false,

  hydrate: async () => {
    try {
      const data = await api.get<{ leads: Lead[]; activities: Activity[] }>('/leads')
      set({ leads: data.leads || [], activities: data.activities || [], _hydrated: true })
    } catch {
      set({ _hydrated: true })
    }
  },

  addLead: (leadData) => {
    const id = generateId()
    const now = new Date().toISOString()
    const lead: Lead = {
      ...leadData,
      id,
      createdAt: now,
      updatedAt: now,
    }
    set((state) => ({ leads: [...state.leads, lead] }))
    syncToServer(get)
    return id
  },

  updateLead: (id, updates) => {
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id
          ? { ...lead, ...updates, updatedAt: new Date().toISOString() }
          : lead
      ),
    }))
    syncToServer(get)
  },

  deleteLead: (id) => {
    set((state) => ({
      leads: state.leads.filter((lead) => lead.id !== id),
      activities: state.activities.filter((a) => a.leadId !== id),
    }))
    syncToServer(get)
  },

  changeStatus: (id, status) => {
    const lead = get().leads.find((l) => l.id === id)
    if (!lead) return

    const now = new Date().toISOString()
    const updates: Partial<Lead> = { status, updatedAt: now }

    if (status === 'contacted' && !lead.contactedAt) {
      updates.contactedAt = now
    }
    if (status === 'won') {
      updates.wonAt = now
    }
    if (status === 'lost') {
      updates.lostAt = now
    }

    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
      activities: [
        ...state.activities,
        {
          id: generateId(),
          leadId: id,
          type: 'status_change' as ActivityType,
          description: `Status changed from "${lead.status}" to "${status}"`,
          timestamp: now,
        },
      ],
    }))
    syncToServer(get)
  },

  addActivity: (activityData) => {
    const activity: Activity = {
      ...activityData,
      id: generateId(),
      timestamp: new Date().toISOString(),
    }
    set((state) => ({
      activities: [...state.activities, activity],
    }))
    syncToServer(get)
  },

  getLeadById: (id) => {
    return get().leads.find((lead) => lead.id === id)
  },

  getLeadsByStatus: (status) => {
    return get().leads.filter((lead) => lead.status === status)
  },

  getActivitiesByLead: (leadId) => {
    return get().activities
      .filter((a) => a.leadId === leadId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },

  importLeads: (newLeads) => {
    set((state) => ({
      leads: [
        ...state.leads,
        ...newLeads.filter(
          (nl) => !state.leads.some((l) => l.id === nl.id)
        ),
      ],
    }))
    syncToServer(get)
  },

  exportData: () => {
    const { leads, activities } = get()
    return { leads, activities }
  },
}))
