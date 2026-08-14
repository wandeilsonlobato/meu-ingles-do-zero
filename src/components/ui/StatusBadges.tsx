import { Flame, Gem, Heart } from 'lucide-react'
import clsx from 'clsx'

export function HeartsDisplay({ current, max, size = 20 }: { current: number; max: number; size?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${current} de ${max} corações`}>
      {Array.from({ length: max }).map((_, i) => (
        <Heart
          key={i}
          size={size}
          className={i < current ? 'fill-heart-500 text-heart-500' : 'fill-slate-200 text-slate-200'}
        />
      ))}
    </div>
  )
}

export function XpBadge({ xp }: { xp: number }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-glow-100 px-3 py-1 text-glow-700 font-bold text-sm">
      <Gem size={16} className="fill-glow-400 text-glow-500" />
      {xp} XP
    </div>
  )
}

export function StreakBadge({ days, atRisk }: { days: number; atRisk?: boolean }) {
  return (
    <div
      className={clsx(
        'flex items-center gap-1 rounded-full px-3 py-1 font-bold text-sm',
        atRisk ? 'bg-heart-500/10 text-heart-600' : 'bg-glow-100 text-glow-700',
      )}
    >
      <Flame size={16} className={atRisk ? 'text-heart-500' : 'fill-glow-400 text-glow-500'} />
      {days}
    </div>
  )
}

export function CoinsBadge({ coins }: { coins: number }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-brand-700 font-bold text-sm">
      🪙 {coins}
    </div>
  )
}
