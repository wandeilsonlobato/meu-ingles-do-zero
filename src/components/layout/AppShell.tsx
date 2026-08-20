import { type ReactNode, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { BookOpen, Home, RotateCcw, Settings, ShoppingBag, Trophy, User as UserIcon } from 'lucide-react'
import clsx from 'clsx'
import { useAppStore } from '../../store/useAppStore'
import { HeartsDisplay, StreakBadge, XpBadge } from '../ui/StatusBadges'
import { isStreakAtRisk } from '../../lib/gamification'
import { todayLocalDate } from '../../lib/auth'
import { useT } from '../../lib/i18n'

const NAV_ITEMS = [
  { to: '/app', key: 'nav.trail', icon: Home, end: true },
  { to: '/app/revisao', key: 'nav.review', icon: RotateCcw },
  { to: '/app/ranking', key: 'nav.league', icon: Trophy },
  { to: '/app/loja', key: 'nav.store', icon: ShoppingBag },
  { to: '/app/perfil', key: 'nav.profile', icon: UserIcon },
  { to: '/app/configuracoes', key: 'nav.settings', icon: Settings },
]

export function AppShell({ children }: { children: ReactNode }) {
  const user = useAppStore((s) => s.currentUser())
  const tickHeartRefill = useAppStore((s) => s.tickHeartRefill)
  const t = useT()

  useEffect(() => {
    tickHeartRefill()
    const interval = setInterval(tickHeartRefill, 60_000)
    return () => clearInterval(interval)
  }, [tickHeartRefill])

  if (!user) return null

  const atRisk = isStreakAtRisk(user.lastStudyDate, todayLocalDate())

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-display font-extrabold text-brand-600">
            <BookOpen size={22} />
            <span className="hidden sm:inline">{t('nav.brand')}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <StreakBadge days={user.streakCurrent} atRisk={atRisk} />
            <XpBadge xp={user.xpTotal} />
            <HeartsDisplay current={user.livesCurrent} max={user.livesMax} size={18} />
            <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-xl" title={user.name}>
              {user.avatarPhotoUrl ? (
                <img src={user.avatarPhotoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                user.avatarEmoji
              )}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:pb-10">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white sm:sticky sm:top-16 sm:mx-auto sm:mt-6 sm:max-w-5xl sm:rounded-2xl sm:border sm:px-2 sm:py-2">
        <div className="mx-auto flex max-w-5xl justify-around px-2 py-2 sm:justify-start sm:gap-2">
          {NAV_ITEMS.map(({ to, key, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-semibold sm:flex-row sm:gap-2 sm:text-sm',
                  isActive ? 'text-brand-600 bg-brand-50' : 'text-slate-500 hover:text-brand-500',
                )
              }
            >
              <Icon size={20} />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
