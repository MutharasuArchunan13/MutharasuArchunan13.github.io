import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { LoginForm } from '@/components/auth/LoginForm'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { ProjectPage } from '@/components/project/ProjectPage'
import { CheckInPage } from '@/components/checkin/CheckInPage'
import { KanbanPage } from '@/components/kanban/KanbanPage'
import { AnalyticsPage } from '@/components/analytics/AnalyticsPage'
import { useUIStore } from '@/store/ui.store'
import { useEffect } from 'react'

export default function App() {
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROJECT} element={<ProjectPage />} />
          <Route path={ROUTES.CHECKIN} element={<CheckInPage />} />
          <Route path={ROUTES.KANBAN} element={<KanbanPage />} />
          <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </HashRouter>
  )
}
