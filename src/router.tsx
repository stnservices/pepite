import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function lazyWithRetry(factory: () => Promise<{ default: React.ComponentType }>) {
  return lazy(() =>
    factory().catch(() => {
      return new Promise<{ default: React.ComponentType }>((resolve) => {
        setTimeout(() => window.location.reload(), 1500)
        resolve({ default: () => <div className="flex h-screen items-center justify-center">Updating...</div> })
      })
    })
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <Component />
    </Suspense>
  )
}

const LoginPage = lazyWithRetry(() => import('@/pages/LoginPage'))
const DashboardPage = lazyWithRetry(() => import('@/pages/DashboardPage'))
const DiscoveryPage = lazyWithRetry(() => import('@/pages/DiscoveryPage'))
const LeadsPage = lazyWithRetry(() => import('@/pages/LeadsPage'))
const PipelinePage = lazyWithRetry(() => import('@/pages/PipelinePage'))
const LeadDetailPage = lazyWithRetry(() => import('@/pages/LeadDetailPage'))
const PreviewPage = lazyWithRetry(() => import('@/pages/PreviewPage'))
const ProjectsPage = lazyWithRetry(() => import('@/pages/ProjectsPage'))
const SettingsPage = lazyWithRetry(() => import('@/pages/SettingsPage'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: withSuspense(DashboardPage) },
          { path: 'discover', element: withSuspense(DiscoveryPage) },
          { path: 'leads', element: withSuspense(LeadsPage) },
          { path: 'pipeline', element: withSuspense(PipelinePage) },
          { path: 'leads/:id', element: withSuspense(LeadDetailPage) },
          { path: 'preview', element: withSuspense(PreviewPage) },
          { path: 'projects', element: withSuspense(ProjectsPage) },
          { path: 'settings', element: withSuspense(SettingsPage) },
        ],
      },
    ],
  },
])
