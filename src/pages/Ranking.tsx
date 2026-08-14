import clsx from 'clsx'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { buildWeeklyRanking, LEAGUE_ORDER, promotionZone } from '../lib/ranking'

const LEAGUE_COLORS: Record<string, string> = {
  Bronze: 'text-orange-700 bg-orange-100',
  Prata: 'text-slate-600 bg-slate-200',
  Ouro: 'text-glow-700 bg-glow-100',
  Diamante: 'text-brand-700 bg-brand-100',
}

export default function Ranking() {
  const user = useAppStore((s) => s.currentUser())
  if (!user) return null

  const ranking = buildWeeklyRanking(user)
  const leagueIdx = LEAGUE_ORDER.indexOf(user.league)

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 text-center">
        <span className={clsx('rounded-full px-4 py-1 text-sm font-bold', LEAGUE_COLORS[user.league])}>
          Liga {user.league}
        </span>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-800">Ranking semanal</h1>
        <p className="text-sm text-slate-500">
          Os {Math.ceil(ranking.length * 0.25)} primeiros sobem de liga, os {Math.ceil(ranking.length * 0.25)} últimos descem.
        </p>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {LEAGUE_ORDER.map((tier, i) => (
          <span
            key={tier}
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-bold',
              i === leagueIdx ? LEAGUE_COLORS[tier] : 'bg-slate-100 text-slate-400',
            )}
          >
            {tier}
          </span>
        ))}
      </div>

      <Card className="divide-y divide-slate-100 overflow-hidden">
        {ranking.map((entry, i) => {
          const zone = promotionZone(i, ranking.length)
          return (
            <div
              key={entry.userId}
              className={clsx(
                'flex items-center gap-3 px-5 py-3',
                entry.isCurrentUser && 'bg-brand-50',
              )}
            >
              <span className="w-6 text-center font-bold text-slate-400">{i + 1}</span>
              <span className="text-2xl">{entry.avatarEmoji}</span>
              <span className={clsx('flex-1 font-semibold', entry.isCurrentUser ? 'text-brand-700' : 'text-slate-700')}>
                {entry.name} {entry.isCurrentUser && '(você)'}
              </span>
              <span className="font-bold text-slate-600">{entry.xpThisWeek} XP</span>
              {zone === 'promotion' && <ArrowUp size={18} className="text-progress-500" />}
              {zone === 'demotion' && <ArrowDown size={18} className="text-heart-500" />}
              {zone === 'safe' && <Minus size={18} className="text-slate-300" />}
            </div>
          )
        })}
      </Card>
    </div>
  )
}
