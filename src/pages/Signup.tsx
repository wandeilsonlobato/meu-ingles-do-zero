import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, MailCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { isSupabaseConfigured, useAppStore } from '../store/useAppStore'
import { useT } from '../lib/i18n'

export default function Signup() {
  const navigate = useNavigate()
  const t = useT()
  const signUp = useAppStore((s) => s.signUp)
  const logInWithGoogle = useAppStore((s) => s.logInWithGoogle)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [confirmEmailSent, setConfirmEmailSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await signUp(name, email, password)
    setLoading(false)
    if (!result.ok) {
      setError(result.error ?? 'Não foi possível criar sua conta.')
      return
    }
    if (result.needsEmailConfirmation) {
      setConfirmEmailSent(true)
      return
    }
    navigate('/onboarding')
  }

  async function handleGoogle() {
    setError(null)
    setGoogleLoading(true)
    const result = await logInWithGoogle()
    if (!result.ok) {
      setGoogleLoading(false)
      setError(result.error ?? 'Não foi possível continuar com Google.')
    }
  }

  if (confirmEmailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50 dark:bg-brand-900/30 px-4 py-10">
        <Card className="w-full max-w-md p-8 text-center">
          <MailCheck className="mx-auto mb-3 text-brand-500" size={40} />
          <h1 className="mb-2 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('auth.confirmEmailTitle')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('auth.confirmEmailBody', { email })}</p>
          <Link to="/entrar" className="mt-6 inline-block font-bold text-brand-600 dark:text-brand-400 hover:underline">
            {t('auth.confirmEmailLink')}
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 dark:bg-brand-900/30 px-4 py-10">
      <Card className="w-full max-w-md p-8">
        <Link to="/" className="mb-6 flex items-center gap-2 font-extrabold text-brand-700 dark:text-brand-300">
          <BookOpen size={22} />
          {t('nav.brand')}
        </Link>
        <h1 className="mb-1 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('auth.signupTitle')}</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">{t('auth.signupSubtitle')}</p>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">{t('auth.backendWarningSignup')}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-semibold text-slate-600 dark:text-slate-300">
              {t('auth.nameLabel')}
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-600 dark:text-slate-300">
              {t('auth.emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-slate-600 dark:text-slate-300">
              {t('auth.passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 px-4 py-2.5 outline-none focus:border-brand-400"
            />
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{t('auth.passwordHint')}</p>
          </div>
          {error && <p className="text-sm font-semibold text-heart-600 dark:text-heart-400">{error}</p>}
          <Button type="submit" fullWidth disabled={loading || !isSupabaseConfigured}>
            {loading ? t('auth.signupButtonLoading') : t('auth.signupButton')}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          {t('auth.or')}
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <Button variant="secondary" fullWidth onClick={handleGoogle} disabled={googleLoading || !isSupabaseConfigured}>
          {googleLoading ? t('auth.googleRedirecting') : t('auth.googleSignup')}
        </Button>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {t('auth.haveAccount')}{' '}
          <Link to="/entrar" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            {t('auth.loginLink')}
          </Link>
        </p>
      </Card>
    </div>
  )
}
