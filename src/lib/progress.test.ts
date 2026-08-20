import { describe, expect, it } from 'vitest'
import type { Level, User, UserProgressEntry } from '../types'
import { checkNewAchievements, flattenLessons, isLevelUnlocked, lessonStatus } from './progress'
import { ACHIEVEMENTS } from '../data/achievements'

function makeLesson(id: string, order: number, type: 'lesson' | 'checkpoint' | 'level_test' = 'lesson') {
  return { id, unitId: 'u1', order, title: id, type, exercises: [], xpReward: 10 }
}

const levelWithContent: Level = {
  id: 'lvl0',
  order: 0,
  code: 'A0',
  title: 'Primeiros Passos',
  description: '',
  units: [
    {
      id: 'lvl0-u1',
      levelId: 'lvl0',
      order: 1,
      title: 'Unidade 1',
      objective: '',
      lessons: [makeLesson('l1', 1), makeLesson('l2', 2), makeLesson('l3-test', 3, 'level_test')],
    },
  ],
}

const emptyLevel: Level = {
  id: 'lvl1',
  order: 1,
  code: 'A1',
  title: 'Iniciante',
  description: '',
  units: [],
}

const levelAfterEmpty: Level = {
  id: 'lvl2',
  order: 2,
  code: 'A2',
  title: 'Básico',
  description: '',
  units: [],
}

describe('isLevelUnlocked', () => {
  it('the first level is always unlocked', () => {
    expect(isLevelUnlocked(levelWithContent, [levelWithContent, emptyLevel], {})).toBe(true)
  })

  it('a level stays locked until the previous level test is completed', () => {
    expect(isLevelUnlocked(emptyLevel, [levelWithContent, emptyLevel], {})).toBe(false)
  })

  it('unlocks once the previous level test is completed', () => {
    const progress: Record<string, UserProgressEntry> = {
      'l3-test': { lessonId: 'l3-test', status: 'completed', attempts: 1, correct: 1, bestAccuracy: 100 },
    }
    expect(isLevelUnlocked(emptyLevel, [levelWithContent, emptyLevel], progress)).toBe(true)
  })

  it('does not crash when the previous level has no content yet (stays locked)', () => {
    expect(isLevelUnlocked(levelAfterEmpty, [levelWithContent, emptyLevel, levelAfterEmpty], {})).toBe(false)
  })
})

describe('lessonStatus', () => {
  const lessons = levelWithContent.units[0].lessons
  const ordered = flattenLessons([levelWithContent])

  it('the first lesson is always available', () => {
    expect(lessonStatus(lessons[0], 0, ordered, {})).toBe('available')
  })

  it('later lessons are locked until the previous one is completed', () => {
    expect(lessonStatus(lessons[1], 1, ordered, {})).toBe('locked')
  })

  it('unlocks the next lesson once the previous is completed', () => {
    const progress: Record<string, UserProgressEntry> = {
      l1: { lessonId: 'l1', status: 'completed', attempts: 1, correct: 1, bestAccuracy: 100 },
    }
    expect(lessonStatus(lessons[1], 1, ordered, progress)).toBe('available')
  })
})

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'u1',
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
    xpThisWeek: 0,
    weekStartDate: '2026-01-05',
    progress: {},
    achievements: [],
    ownedCosmetics: [],
    ...overrides,
  }
}

describe('checkNewAchievements', () => {
  it('unlocks first-lesson once a lesson is completed', () => {
    const user = makeUser({
      progress: { l1: { lessonId: 'l1', status: 'completed', attempts: 1, correct: 4, bestAccuracy: 80 } },
    })
    const unlocked = checkNewAchievements(user, ACHIEVEMENTS)
    expect(unlocked.map((a) => a.id)).toContain('first-lesson')
  })

  it('does not re-unlock an achievement the user already has', () => {
    const user = makeUser({
      progress: { l1: { lessonId: 'l1', status: 'completed', attempts: 1, correct: 4, bestAccuracy: 80 } },
      achievements: [{ achievementId: 'first-lesson', earnedAt: '2026-01-01T00:00:00Z' }],
    })
    const unlocked = checkNewAchievements(user, ACHIEVEMENTS)
    expect(unlocked.map((a) => a.id)).not.toContain('first-lesson')
  })

  it('unlocks streak and xp milestones based on current totals', () => {
    const user = makeUser({ streakCurrent: 7, xpTotal: 2000 })
    const ids = checkNewAchievements(user, ACHIEVEMENTS).map((a) => a.id)
    expect(ids).toEqual(expect.arrayContaining(['streak-3', 'streak-7', 'xp-500', 'xp-2000']))
    expect(ids).not.toContain('streak-30')
    expect(ids).not.toContain('xp-5000')
  })

  it('unlocks perfect-lesson when any progress entry has 100% accuracy', () => {
    const user = makeUser({
      progress: { l1: { lessonId: 'l1', status: 'completed', attempts: 1, correct: 4, bestAccuracy: 100 } },
    })
    expect(checkNewAchievements(user, ACHIEVEMENTS).map((a) => a.id)).toContain('perfect-lesson')
  })

  it('unlocks league achievements based on current league tier', () => {
    const gold = makeUser({ league: 'Ouro' })
    const goldIds = checkNewAchievements(gold, ACHIEVEMENTS).map((a) => a.id)
    expect(goldIds).toContain('league-gold')
    expect(goldIds).not.toContain('league-diamond')

    const diamond = makeUser({ league: 'Diamante' })
    const diamondIds = checkNewAchievements(diamond, ACHIEVEMENTS).map((a) => a.id)
    expect(diamondIds).toEqual(expect.arrayContaining(['league-gold', 'league-diamond']))
  })

  it('unlocks shop-collector once 3 avatars are owned', () => {
    const user = makeUser({ ownedCosmetics: ['a', 'b', 'c'] })
    expect(checkNewAchievements(user, ACHIEVEMENTS).map((a) => a.id)).toContain('shop-collector')
  })

  it('unlocks shop-first-purchase only when the purchase context flag is set', () => {
    const user = makeUser()
    expect(checkNewAchievements(user, ACHIEVEMENTS, {}).map((a) => a.id)).not.toContain('shop-first-purchase')
    expect(checkNewAchievements(user, ACHIEVEMENTS, { justPurchasedItem: true }).map((a) => a.id)).toContain(
      'shop-first-purchase',
    )
  })
})
