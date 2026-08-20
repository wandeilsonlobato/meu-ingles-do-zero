import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { ArrowDown, ArrowUp, Minus, Users } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { buildWeeklyRanking, LEAGUE_ORDER, promotionZone } from '../lib/ranking'
import { fetchLeaderboard } from '../lib/supabaseSync'
import { useT } from '../lib/i18n'
import type { LeaderboardRow } from '../types'

const LEAGUE_COLORS: Record<string, string> = {
  Bronze: 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/40',
  Prata: 'text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700',
  Ouro: 'text-glow-700 dark:text-glow-300 bg-glow-100 dark:bg-glow-900/50',
  Diamante: 'text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/50',
}

const MIN_PLAYERS_FOR_PROMOTION = 5

export default function Ranking() {
  const t = useT()
  const user = useAppStore((s) => s.currentUser())
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null)

  useEffect(() => {
    fetchLeaderboard().then(setRows)
  }, [])

  if (!user) return null

  const loading = rows === null
  const ranking = buildWeeklyRanking(user, rows ?? [])
  const leagueIdx = LEAGUE_ORDER.indexOf(user.league)
  const showZones = ranking.length >= MIN_PLAYERS_FOR_PROMOTION

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 text-center">
        <span className={clsx('rounded-full px-4 py-1 text-sm font-bold', LEAGUE_COLORS[user.league])}>
          {t('ranking.league', { league: user.league })}
        </span>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('ranking.weeklyRanking')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {showZones ? t('ranking.zonesHint', { count: Math.ceil(ranking.length * 0.25) }) : t('ranking.realOnlyHint')}
        </p>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {LEAGUE_ORDER.map((tier, i) => (
          <span
            key={tier}
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-bold',
              i === leagueIdx ? LEAGUE_COLORS[tier] : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500',
            )}
          >
            {tier}
          </span>
        ))}
      </div>

      {loading && <Card className="p-8 text-center text-slate-400 dark:text-slate-500">{t('ranking.loading')}</Card>}

      {!loading && (
        <Card className="divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
          {ranking.map((entry, i) => {
            const zone = showZones ? promotionZone(i, ranking.length) : 'safe'
            return (
              <div
                key={entry.userId}
                className={clsx('flex items-center gap-3 px-5 py-3', entry.isCurrentUser && 'bg-brand-50 dark:bg-brand-900/30')}
              >
                <span className="w-6 text-center font-bold text-slate-400 dark:text-slate-500">{i + 1}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-50 dark:bg-brand-900/30 text-2xl">
                  {entry.avatarPhotoUrl ? (
                    <img src={entry.avatarPhotoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    entry.avatarEmoji
                  )}
                </span>
                <span className={clsx('flex-1 font-semibold', entry.isCurrentUser ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-200')}>
                  {entry.name} {entry.isCurrentUser && t('ranking.you')}
                </span>
                <span className="font-bold text-slate-600 dark:text-slate-300">{entry.xpThisWeek} XP</span>
                {showZones && zone === 'promotion' && <ArrowUp size={18} className="text-progress-500" />}
                {showZones && zone === 'demotion' && <ArrowDown size={18} className="text-heart-500" />}
                {showZones && zone === 'safe' && <Minus size={18} className="text-slate-300 dark:text-slate-600" />}
              </div>
            )
          })}
        </Card>
      )}

      {!loading && ranking.length < MIN_PLAYERS_FOR_PROMOTION && (
        <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-400 dark:text-slate-500">
          <Users size={14} />
          {t('ranking.smallLeagueHint', { min: MIN_PLAYERS_FOR_PROMOTION })}
        </div>
      )}
    </div>
  )
}
