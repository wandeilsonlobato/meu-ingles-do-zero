import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { isSupabaseConfigured, useAppStore } from '../store/useAppStore'
import { useT } from '../lib/i18n'

export default function Login() {
  const navigate = useNavigate()
  const t = useT()
  const logIn = useAppStore((s) => s.logIn)
  const logInWithGoogle = useAppStore((s) => s.logInWithGoogle)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await logIn(email, password)
    setLoading(false)
    if (!result.ok) {
      setError(result.error ?? 'Não foi possível entrar.')
      return
    }
    navigate('/app')
  }

  async function handleGoogle() {
    setError(null)
    setGoogleLoading(true)
    const result = await logInWithGoogle()
    if (!result.ok) {
      setGoogleLoading(false)
      setError(result.error ?? 'Não foi possível entrar com Google.')
    }
    // no sucesso, o navegador é redirecionado para o Google — nada mais a fazer aqui
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <Card className="w-full max-w-md p-8">
        <Link to="/" className="mb-6 flex items-center gap-2 font-extrabold text-brand-700">
          <BookOpen size={22} />
          {t('nav.brand')}
        </Link>
        <h1 className="mb-1 text-2xl font-extrabold text-slate-800">{t('auth.loginTitle')}</h1>
        <p className="mb-6 text-slate-500">{t('auth.loginSubtitle')}</p>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">{t('auth.backendWarningLogin')}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-600">
              {t('auth.emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-slate-600">
              {t('auth.passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 outline-none focus:border-brand-400"
            />
          </div>
          {error && <p className="text-sm font-semibold text-heart-600">{error}</p>}
          <Button type="submit" fullWidth disabled={loading || !isSupabaseConfigured}>
            {loading ? t('auth.loginButtonLoading') : t('auth.loginButton')}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs font-semibold text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          {t('auth.or')}
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <Button variant="secondary" fullWidth onClick={handleGoogle} disabled={googleLoading || !isSupabaseConfigured}>
          {googleLoading ? t('auth.googleRedirecting') : t('auth.googleLogin')}
        </Button>

        <p className="mt-6 text-center text-sm text-slate-500">
          {t('auth.noAccount')}{' '}
          <Link to="/cadastro" className="font-bold text-brand-600 hover:underline">
            {t('auth.signupLink')}
          </Link>
        </p>
      </Card>
    </div>
  )
}
