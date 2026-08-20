import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Monitor, Moon, Smartphone, Sun } from 'lucide-react'
import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useInstallPrompt } from '../lib/useInstallPrompt'
import { useI18n } from '../lib/i18n'
import { type ThemePreference, useTheme } from '../lib/theme'
import type { DailyGoal, InterfaceLocale } from '../types'

const THEME_OPTIONS: { value: ThemePreference; icon: typeof Sun }[] = [
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
  { value: 'system', icon: Monitor },
]
const THEME_KEYS: Record<ThemePreference, string> = {
  light: 'settings.themeLight',
  dark: 'settings.themeDark',
  system: 'settings.themeSystem',
}

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
  const { theme, setTheme } = useTheme()
  const user = useAppStore((s) => s.currentUser())
  const updateDailyGoal = useAppStore((s) => s.updateDailyGoal)
  const logOut = useAppStore((s) => s.logOut)
  const [notifications, setNotifications] = useState(true)
  const { canInstall, installed, isIos, promptInstall } = useInstallPrompt()

  if (!user) return null

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('settings.title')}</h1>

      {!installed && (canInstall || isIos) && (
        <Card className="mb-5 flex items-center gap-4 border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-900/30">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <Smartphone size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-slate-800 dark:text-slate-100">{t('settings.installTitle')}</h2>
            {canInstall ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.installDescAndroid')}</p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.installDescIos')}</p>
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
        <h2 className="mb-3 font-bold text-slate-700 dark:text-slate-200">{t('settings.theme')}</h2>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{t('settings.themeHint')}</p>
        <div className="flex gap-2">
          {THEME_OPTIONS.map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={clsx(
                'flex flex-1 flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-xs font-bold transition-colors',
                theme === value
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                  : 'border-slate-200 text-slate-600 hover:border-brand-200 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-800',
              )}
            >
              <Icon size={18} />
              {t(THEME_KEYS[value])}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700 dark:text-slate-200">{t('settings.dailyGoal')}</h2>
        <div className="flex flex-col gap-2">
          {GOALS.map((g) => (
            <button
              key={g}
              onClick={() => updateDailyGoal(g)}
              className={clsx(
                'rounded-xl border-2 px-4 py-2.5 text-left font-semibold transition-colors',
                user.dailyGoal === g
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/40'
                  : 'border-slate-200 hover:border-brand-200 dark:border-slate-700 dark:hover:border-brand-800',
              )}
            >
              {t(GOAL_KEYS[g])}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700 dark:text-slate-200">{t('settings.notifications')}</h2>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-300">{t('settings.notificationsLabel')}</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="h-5 w-5 accent-brand-500"
          />
        </label>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{t('settings.notificationsHint')}</p>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700 dark:text-slate-200">{t('settings.language')}</h2>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{t('settings.languageHint')}</p>
        <div className="flex gap-2">
          {(['pt', 'en'] as InterfaceLocale[]).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={clsx(
                'rounded-xl border-2 px-4 py-2 text-sm font-bold transition-colors',
                locale === l
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                  : 'border-slate-200 text-slate-600 hover:border-brand-200 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-800',
              )}
            >
              {l === 'pt' ? 'Português' : 'English'}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700 dark:text-slate-200">{t('settings.plan')}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.planHint')}</p>
      </Card>

      <Button variant="danger" fullWidth onClick={() => { logOut(); navigate('/') }}>
        {t('settings.logout')}
      </Button>
    </div>
  )
}
