import { type ReactNode, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Lesson from './pages/Lesson'
import LessonResult from './pages/LessonResult'
import Profile from './pages/Profile'
import Ranking from './pages/Ranking'
import Review from './pages/Review'
import Store from './pages/Store'
import Settings from './pages/Settings'
import AdminOverview from './pages/admin/AdminOverview'
import AdminContent from './pages/admin/AdminContent'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAppStore } from './store/useAppStore'

function OnboardingRoute() {
  const user = useAppStore((s) => s.currentUser())
  if (!user) return <Navigate to="/entrar" replace />
  if (user.onboarded) return <Navigate to="/app" replace />
  return <Onboarding />
}

function AdminRoute({ children }: { children: ReactNode }) {
  const user = useAppStore((s) => s.currentUser())
  if (!user) return <Navigate to="/entrar" replace />
  if (!user.isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
        <p className="text-4xl">🔒</p>
        <h1 className="text-xl font-extrabold text-slate-800">Acesso restrito</h1>
        <p className="max-w-sm text-sm text-slate-500">
          Sua conta não tem permissão de administrador. Para liberar, marque{' '}
          <code className="rounded bg-slate-200 px-1 py-0.5">is_admin = true</code> no seu perfil pelo painel do
          Supabase.
        </p>
        <Navigate to="/app" replace />
      </div>
    )
  }
  return <>{children}</>
}

function AuthGate({ children }: { children: ReactNode }) {
  const authLoading = useAppStore((s) => s.authLoading)
  const initAuth = useAppStore((s) => s.initAuth)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-brand-50">
        <BookOpen className="animate-pulse text-brand-500" size={40} />
        <p className="font-semibold text-brand-600">Carregando...</p>
      </div>
    )
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/cadastro" element={<Signup />} />
          <Route path="/onboarding" element={<OnboardingRoute />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/licao/:lessonId"
            element={
              <ProtectedRoute>
                <Lesson />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/licao/:lessonId/resultado"
            element={
              <ProtectedRoute>
                <LessonResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/revisao"
            element={
              <ProtectedRoute>
                <Review />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/ranking"
            element={
              <ProtectedRoute>
                <Ranking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/loja"
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/configuracoes"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminOverview />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/conteudo"
            element={
              <AdminRoute>
                <AdminContent />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthGate>
    </BrowserRouter>
  )
}
