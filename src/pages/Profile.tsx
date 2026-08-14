import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { ACHIEVEMENTS } from '../data/achievements'
import { nextRankInfo, rankForXp } from '../lib/gamification'
import { SHOP_ITEMS } from '../data/shop'

export default function Profile() {
  const user = useAppStore((s) => s.currentUser())
  const updateAvatar = useAppStore((s) => s.updateAvatar)
  if (!user) return null

  const rank = rankForXp(user.xpTotal)
  const next = nextRankInfo(user.xpTotal)
  const completedLessons = Object.values(user.progress).filter((p) => p.status === 'completed').length
  const estimatedMinutes = completedLessons * 4
  const ownedAvatars = SHOP_ITEMS.filter((i) => i.kind === 'avatar' && user.ownedCosmetics.includes(i.id))
  const earnedIds = new Set(user.achievements.map((a) => a.achievementId))

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="mb-6 flex flex-col items-center gap-3 p-8 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-5xl">
          {user.avatarEmoji}
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800">{user.name}</h1>
        <p className="text-sm text-slate-400">{user.email}</p>
        <span className="rounded-full bg-glow-100 px-4 py-1 text-sm font-bold text-glow-700">Rank: {rank}</span>
        {next && (
          <p className="text-xs text-slate-400">Faltam {next.xpNeeded} XP para virar {next.rank}</p>
        )}

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => updateAvatar('🙂')}
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full border-2 text-xl',
              user.avatarEmoji === '🙂' ? 'border-brand-500' : 'border-transparent',
            )}
          >
            🙂
          </button>
          {ownedAvatars.map((a) => (
            <button
              key={a.id}
              onClick={() => updateAvatar(a.emoji)}
              className={clsx(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 text-xl',
                user.avatarEmoji === a.emoji ? 'border-brand-500' : 'border-transparent',
              )}
              title={a.name}
            >
              {a.emoji}
            </button>
          ))}
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="XP total" value={user.xpTotal} />
        <StatCard label="Sequência atual" value={`${user.streakCurrent} dias`} />
        <StatCard label="Recorde de sequência" value={`${user.streakRecord} dias`} />
        <StatCard label="Tempo estimado" value={`${estimatedMinutes} min`} />
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-bold text-slate-700">Conquistas</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const earned = earnedIds.has(a.id)
            return (
              <div
                key={a.id}
                className={clsx(
                  'flex flex-col items-center gap-1 rounded-2xl border-2 p-4 text-center',
                  earned ? 'border-glow-300 bg-glow-50' : 'border-slate-100 bg-slate-50 opacity-50',
                )}
              >
                <span className="text-3xl">{a.icon}</span>
                <span className="text-xs font-bold text-slate-700">{a.name}</span>
                <span className="text-[11px] text-slate-400">{a.description}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-4 text-center">
      <p className="text-2xl font-extrabold text-brand-700">{value}</p>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
    </Card>
  )
}
