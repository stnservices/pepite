import { create } from 'zustand'
import { api, setTokens, clearTokens, hasTokens } from '@/lib/api'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const data = await api.post<{ accessToken: string; refreshToken: string }>(
      '/auth/login',
      { email, password }
    )
    setTokens(data.accessToken, data.refreshToken)
    set({ isAuthenticated: true })
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('pepite-refresh-token')
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken })
      }
    } catch {
      // Ignore errors on logout
    }
    clearTokens()
    set({ isAuthenticated: false })
  },

  checkAuth: async () => {
    if (!hasTokens()) {
      set({ isAuthenticated: false, isLoading: false })
      return
    }
    try {
      // Try a lightweight request to verify token
      await api.get('/settings')
      set({ isAuthenticated: true, isLoading: false })
    } catch {
      set({ isAuthenticated: false, isLoading: false })
    }
  },
}))
