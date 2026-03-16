import { create } from 'zustand'
import { api } from '@/lib/api'
import type { AppSettings } from '@/types'

interface SettingsState extends AppSettings {
  _hydrated: boolean
  hydrate: () => Promise<void>
  updateSettings: (updates: Partial<AppSettings>) => void
  toggleSidebar: () => void
}

function syncToServer(get: () => SettingsState) {
  const { _hydrated, hydrate, updateSettings, toggleSidebar, ...settings } = get()
  api.put('/settings', settings).catch(console.error)
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  defaultCurrency: 'EUR',
  defaultSearchRadius: 5000,
  defaultCity: '',
  sidebarCollapsed: false,
  _hydrated: false,

  hydrate: async () => {
    try {
      const data = await api.get<Partial<AppSettings>>('/settings')
      set({ ...data, _hydrated: true })
    } catch {
      set({ _hydrated: true })
    }
  },

  updateSettings: (updates) => {
    set(updates)
    syncToServer(get)
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
    syncToServer(get)
  },
}))
