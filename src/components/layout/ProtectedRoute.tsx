import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/config/routes'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const repo = useAuthStore((s) => s.repo)

  if (!isAuthenticated || !repo) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}
