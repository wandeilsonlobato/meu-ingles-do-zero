import { describe, expect, it } from 'vitest'
import type { LeaderboardRow, User } from '../types'
import { buildWeeklyRanking, promotionZone } from './ranking'

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'me',
    name: 'Aluna Teste',
    email: 'teste@example.com',
    avatarEmoji: '🙂',
    createdAt: new Date().toISOString(),
    isAdmin: false,
    onboarded: true,
    dailyGoal: 'regular',
    interfaceLocale: 'pt',
    xpTotal: 0,
    coins: 0,
    streakCurrent: 0,
    streakRecord: 0,
    streakFreezeCount: 0,
    livesCurrent: 5,
    livesMax: 5,
    league: 'Bronze',
    xpThisWeek: 20,
    weekStartDate: '2026-01-05',
    progress: {},
    achievements: [],
    ownedCosmetics: [],
    ...overrides,
  }
}

function row(overrides: Partial<LeaderboardRow>): LeaderboardRow {
  return {
    id: 'other',
    name: 'Outro Aluno',
    avatarEmoji: '🦊',
    league: 'Bronze',
    xpThisWeek: 10,
    weekStartDate: '2026-01-05',
    ...overrides,
  }
}

describe('buildWeeklyRanking', () => {
  it('includes only players from the same league as the current user', () => {
    const user = makeUser({ league: 'Bronze' })
    const rows = [row({ id: 'a', league: 'Bronze', xpThisWeek: 5 }), row({ id: 'b', league: 'Ouro', xpThisWeek: 999 })]
    const ranking = buildWeeklyRanking(user, rows)
    expect(ranking.map((r) => r.userId)).toEqual(['me', 'a'])
  })

  it('always includes the current user even with zero peers', () => {
    const user = makeUser()
    const ranking = buildWeeklyRanking(user, [])
    expect(ranking).toHaveLength(1)
    expect(ranking[0].isCurrentUser).toBe(true)
  })

  it('sorts by weekly XP descending', () => {
    const user = makeUser({ xpThisWeek: 20 })
    const rows = [row({ id: 'a', xpThisWeek: 50 }), row({ id: 'b', xpThisWeek: 5 })]
    const ranking = buildWeeklyRanking(user, rows)
    expect(ranking.map((r) => r.userId)).toEqual(['a', 'me', 'b'])
  })

  it('does not duplicate the current user if the backend row list already includes them', () => {
    const user = makeUser({ xpThisWeek: 20 })
    const rows = [row({ id: 'me', xpThisWeek: 999 })]
    const ranking = buildWeeklyRanking(user, rows)
    expect(ranking.filter((r) => r.userId === 'me')).toHaveLength(1)
  })
})

describe('promotionZone', () => {
  it('treats a solo player as safe', () => {
    expect(promotionZone(0, 1)).toBe('safe')
  })

  it('flags the top quarter as promotion', () => {
    expect(promotionZone(0, 8)).toBe('promotion')
  })

  it('flags the bottom quarter as demotion', () => {
    expect(promotionZone(7, 8)).toBe('demotion')
  })

  it('flags the middle as safe', () => {
    expect(promotionZone(4, 8)).toBe('safe')
  })
})
