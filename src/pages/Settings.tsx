import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Smartphone } from 'lucide-react'
import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useInstallPrompt } from '../lib/useInstallPrompt'
import { useI18n } from '../lib/i18n'
import type { DailyGoal, InterfaceLocale } from '../types'

const GOALS: DailyGoal[] = ['casual', 'regular', 'serio', 'intenso']
const GOAL_KEYS: Record<DailyGoal, string> = {
  casual: 'common.goalCasual',
  regular: 'common.goalRegular',
  serio: 'common.goalSerious',
  intenso: 'common.goalIntense',
}

export default function Settings() {
  const navigate = useNavigate()
  const { t, locale, setLocale } = useI18n()
  const user = useAppStore((s) => s.currentUser())
  const updateDailyGoal = useAppStore((s) => s.updateDailyGoal)
  const logOut = useAppStore((s) => s.logOut)
  const [notifications, setNotifications] = useState(true)
  const { canInstall, installed, isIos, promptInstall } = useInstallPrompt()

  if (!user) return null

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-800">{t('settings.title')}</h1>

      {!installed && (canInstall || isIos) && (
        <Card className="mb-5 flex items-center gap-4 border-brand-200 bg-brand-50 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <Smartphone size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-slate-800">{t('settings.installTitle')}</h2>
            {canInstall ? (
              <p className="text-sm text-slate-500">{t('settings.installDescAndroid')}</p>
            ) : (
              <p className="text-sm text-slate-500">{t('settings.installDescIos')}</p>
            )}
          </div>
          {canInstall && (
            <Button size="sm" icon={<Download size={16} />} onClick={promptInstall}>
              {t('settings.installButton')}
            </Button>
          )}
        </Card>
      )}

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700">{t('settings.dailyGoal')}</h2>
        <div className="flex flex-col gap-2">
          {GOALS.map((g) => (
            <button
              key={g}
              onClick={() => updateDailyGoal(g)}
              className={clsx(
                'rounded-xl border-2 px-4 py-2.5 text-left font-semibold transition-colors',
                user.dailyGoal === g ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200',
              )}
            >
              {t(GOAL_KEYS[g])}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700">{t('settings.notifications')}</h2>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-600">{t('settings.notificationsLabel')}</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="h-5 w-5 accent-brand-500"
          />
        </label>
        <p className="mt-2 text-xs text-slate-400">{t('settings.notificationsHint')}</p>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700">{t('settings.language')}</h2>
        <p className="mb-3 text-sm text-slate-500">{t('settings.languageHint')}</p>
        <div className="flex gap-2">
          {(['pt', 'en'] as InterfaceLocale[]).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={clsx(
                'rounded-xl border-2 px-4 py-2 text-sm font-bold transition-colors',
                locale === l ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-brand-200',
              )}
            >
              {l === 'pt' ? 'Português' : 'English'}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700">{t('settings.plan')}</h2>
        <p className="text-sm text-slate-500">{t('settings.planHint')}</p>
      </Card>

      <Button variant="danger" fullWidth onClick={() => { logOut(); navigate('/') }}>
        {t('settings.logout')}
      </Button>
    </div>
  )
}
