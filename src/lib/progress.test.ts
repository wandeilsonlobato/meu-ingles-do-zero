import { describe, expect, it } from 'vitest'
import type { Level, UserProgressEntry } from '../types'
import { flattenLessons, isLevelUnlocked, lessonStatus } from './progress'

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
