import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Gem } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useLeadsStore } from '@/stores/leads-store'
import { useSettingsStore } from '@/stores/settings-store'
import { useProjectsStore } from '@/stores/projects-store'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      Promise.all([
        useLeadsStore.getState().hydrate(),
        useSettingsStore.getState().hydrate(),
        useProjectsStore.getState().hydrate(),
      ]).then(() => setDataLoaded(true))
    }
  }, [isAuthenticated, dataLoaded])

  if (isLoading || (isAuthenticated && !dataLoaded)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Gem className="h-10 w-10 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
