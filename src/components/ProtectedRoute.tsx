import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { AppShell } from './layout/AppShell'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAppStore((s) => s.currentUser())

  if (!user) return <Navigate to="/entrar" replace />
  if (!user.onboarded) return <Navigate to="/onboarding" replace />

  return <AppShell>{children}</AppShell>
}
