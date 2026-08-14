import { describe, expect, it } from 'vitest'
import {
  leagueForXp,
  loseHeart,
  rankForXp,
  refillHearts,
  registerStudyDay,
  xpForLessonCompletion,
} from './gamification'

describe('rankForXp', () => {
  it('starts as Iniciante', () => {
    expect(rankForXp(0)).toBe('Iniciante')
  })
  it('promotes at each threshold', () => {
    expect(rankForXp(200)).toBe('Curioso')
    expect(rankForXp(800)).toBe('Dedicado')
    expect(rankForXp(2000)).toBe('Fluente')
    expect(rankForXp(5000)).toBe('Mestre')
  })
  it('stays just below a threshold', () => {
    expect(rankForXp(799)).toBe('Curioso')
  })
})

describe('leagueForXp', () => {
  it('maps weekly xp to tiers', () => {
    expect(leagueForXp(0)).toBe('Bronze')
    expect(leagueForXp(50)).toBe('Prata')
    expect(leagueForXp(150)).toBe('Ouro')
    expect(leagueForXp(300)).toBe('Diamante')
  })
})

describe('xpForLessonCompletion', () => {
  it('gives base xp without bonus for imperfect accuracy', () => {
    expect(xpForLessonCompletion(20, 80)).toBe(20)
  })
  it('gives 20% bonus for perfect accuracy', () => {
    expect(xpForLessonCompletion(20, 100)).toBe(24)
  })
})

describe('loseHeart', () => {
  it('decrements but never below zero', () => {
    expect(loseHeart(1)).toBe(0)
    expect(loseHeart(0)).toBe(0)
    expect(loseHeart(5)).toBe(4)
  })
})

describe('refillHearts', () => {
  it('does not refill below the interval', () => {
    const now = new Date('2026-01-01T04:00:00Z')
    const lastRefillAt = new Date('2026-01-01T02:00:00Z').toISOString()
    const result = refillHearts({ livesCurrent: 2, livesLastRefillAt: lastRefillAt }, 5, now)
    expect(result.livesCurrent).toBe(2)
  })
  it('refills one heart after the interval elapses', () => {
    const now = new Date('2026-01-01T06:01:00Z')
    const lastRefillAt = new Date('2026-01-01T02:00:00Z').toISOString()
    const result = refillHearts({ livesCurrent: 2, livesLastRefillAt: lastRefillAt }, 5, now)
    expect(result.livesCurrent).toBe(3)
  })
  it('caps at max hearts and clears the refill timer', () => {
    const now = new Date('2026-01-02T00:00:00Z')
    const lastRefillAt = new Date('2026-01-01T02:00:00Z').toISOString()
    const result = refillHearts({ livesCurrent: 2, livesLastRefillAt: lastRefillAt }, 5, now)
    expect(result.livesCurrent).toBe(5)
    expect(result.livesLastRefillAt).toBeUndefined()
  })
  it('is a no-op already at max', () => {
    const result = refillHearts({ livesCurrent: 5 }, 5)
    expect(result.livesCurrent).toBe(5)
  })
})

describe('registerStudyDay', () => {
  const base = { streakCurrent: 3, streakRecord: 5, lastStudyDate: '2026-01-05', streakFreezeCount: 1 }

  it('is a no-op for the same day', () => {
    const result = registerStudyDay(base, '2026-01-05')
    expect(result).toEqual(base)
  })

  it('increments streak on the next consecutive day', () => {
    const result = registerStudyDay(base, '2026-01-06')
    expect(result.streakCurrent).toBe(4)
    expect(result.streakRecord).toBe(5)
  })

  it('updates the record when a new high is reached', () => {
    const result = registerStudyDay({ ...base, streakCurrent: 5 }, '2026-01-06')
    expect(result.streakCurrent).toBe(6)
    expect(result.streakRecord).toBe(6)
  })

  it('uses a streak freeze to bridge exactly one missed day', () => {
    const result = registerStudyDay(base, '2026-01-07')
    expect(result.streakCurrent).toBe(4)
    expect(result.streakFreezeCount).toBe(0)
  })

  it('resets the streak when the gap is too large even with freezes', () => {
    const result = registerStudyDay(base, '2026-01-10')
    expect(result.streakCurrent).toBe(1)
    expect(result.streakFreezeCount).toBe(1)
  })

  it('resets the streak when there is a gap and no freeze available', () => {
    const result = registerStudyDay({ ...base, streakFreezeCount: 0 }, '2026-01-07')
    expect(result.streakCurrent).toBe(1)
  })

  it('starts a fresh streak for a brand-new user', () => {
    const result = registerStudyDay(
      { streakCurrent: 0, streakRecord: 0, lastStudyDate: undefined, streakFreezeCount: 0 },
      '2026-01-05',
    )
    expect(result.streakCurrent).toBe(1)
    expect(result.streakRecord).toBe(1)
  })
})
