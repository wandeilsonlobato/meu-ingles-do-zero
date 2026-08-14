import type { LeagueTier, RankingEntry, User } from '../types'

const BOT_NAMES = [
  'Marina', 'Thiago', 'Camila', 'Bruno', 'Larissa', 'Felipe', 'Juliana', 'Diego',
  'Amanda', 'Rafael', 'Beatriz', 'Gustavo', 'Patrícia', 'Rodrigo', 'Fernanda',
  'Vinícius', 'Aline', 'Leonardo', 'Débora', 'Marcelo',
]
const BOT_EMOJIS = ['🦊', '🐨', '🦉', '🐼', '🐯', '🐸', '🐵', '🦁', '🐺', '🐢']

const LEAGUE_XP_RANGE: Record<LeagueTier, [number, number]> = {
  Bronze: [0, 60],
  Prata: [50, 170],
  Ouro: [140, 320],
  Diamante: [280, 550],
}

function seededRandom(seed: number): () => number {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/** Ranking semanal simulado: 19 competidores + o usuário atual, estável por semana/liga. */
export function buildWeeklyRanking(user: User): RankingEntry[] {
  const seed = hashString(`${user.weekStartDate}-${user.league}`)
  const rand = seededRandom(seed)
  const [min, max] = LEAGUE_XP_RANGE[user.league]

  const bots: RankingEntry[] = BOT_NAMES.map((name, i) => ({
    userId: `bot-${i}`,
    name,
    avatarEmoji: BOT_EMOJIS[i % BOT_EMOJIS.length],
    xpThisWeek: Math.round(min + rand() * (max - min)),
  }))

  const entries: RankingEntry[] = [
    ...bots,
    {
      userId: user.id,
      name: user.name,
      avatarEmoji: user.avatarEmoji,
      xpThisWeek: user.xpThisWeek,
      isCurrentUser: true,
    },
  ]

  return entries.sort((a, b) => b.xpThisWeek - a.xpThisWeek)
}

export const LEAGUE_ORDER: LeagueTier[] = ['Bronze', 'Prata', 'Ouro', 'Diamante']

export function promotionZone(rankIndex: number, totalEntries: number): 'promotion' | 'safe' | 'demotion' {
  if (rankIndex < Math.ceil(totalEntries * 0.25)) return 'promotion'
  if (rankIndex >= totalEntries - Math.ceil(totalEntries * 0.25)) return 'demotion'
  return 'safe'
}
