import type { LeaderboardRow, LeagueTier, RankingEntry, User } from '../types'

export const LEAGUE_ORDER: LeagueTier[] = ['Bronze', 'Prata', 'Ouro', 'Diamante']

/**
 * Ranking semanal real: só alunos de verdade, na mesma liga do usuário atual,
 * ordenados por XP da semana. Garante que o próprio usuário apareça mesmo se
 * a leitura do backend ainda não tiver alcançado o valor mais recente.
 */
export function buildWeeklyRanking(currentUser: User, rows: LeaderboardRow[]): RankingEntry[] {
  const sameLeague = rows.filter((r) => r.league === currentUser.league && r.id !== currentUser.id)

  const entries: RankingEntry[] = [
    ...sameLeague.map((r) => ({
      userId: r.id,
      name: r.name,
      avatarEmoji: r.avatarEmoji,
      xpThisWeek: r.xpThisWeek,
    })),
    {
      userId: currentUser.id,
      name: currentUser.name,
      avatarEmoji: currentUser.avatarEmoji,
      xpThisWeek: currentUser.xpThisWeek,
      isCurrentUser: true,
    },
  ]

  return entries.sort((a, b) => b.xpThisWeek - a.xpThisWeek)
}

export function promotionZone(rankIndex: number, totalEntries: number): 'promotion' | 'safe' | 'demotion' {
  if (totalEntries <= 1) return 'safe'
  if (rankIndex < Math.ceil(totalEntries * 0.25)) return 'promotion'
  if (rankIndex >= totalEntries - Math.ceil(totalEntries * 0.25)) return 'demotion'
  return 'safe'
}
