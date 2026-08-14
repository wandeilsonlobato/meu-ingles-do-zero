import { describe, expect, it } from 'vitest'
import { COURSE } from './course'

describe('COURSE data integrity', () => {
  it('has unique unit ids', () => {
    const ids = COURSE.flatMap((l) => l.units).map((u) => u.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique lesson ids', () => {
    const ids = COURSE.flatMap((l) => l.units).flatMap((u) => u.lessons).map((les) => les.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique exercise ids', () => {
    const ids = COURSE.flatMap((l) => l.units)
      .flatMap((u) => u.lessons)
      .flatMap((les) => les.exercises)
      .map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every lesson has at least one exercise', () => {
    const lessons = COURSE.flatMap((l) => l.units).flatMap((u) => u.lessons)
    const empty = lessons.filter((les) => les.exercises.length === 0)
    expect(empty.map((l) => l.id)).toEqual([])
  })

  it('every level has exactly one level_test as the last lesson of its last unit, except empty levels', () => {
    for (const level of COURSE) {
      if (level.units.length === 0) continue
      const lastUnit = level.units[level.units.length - 1]
      const lastLesson = lastUnit.lessons[lastUnit.lessons.length - 1]
      expect(lastLesson.type, `level ${level.id} last lesson should be level_test`).toBe('level_test')
    }
  })

  it('every multiple_choice/listening/true_false/dialogue exercise has options including the correct one', () => {
    const exercises = COURSE.flatMap((l) => l.units)
      .flatMap((u) => u.lessons)
      .flatMap((les) => les.exercises)
      .filter((e) => ['multiple_choice', 'listening', 'true_false', 'dialogue'].includes(e.type))
    for (const e of exercises) {
      expect(e.options && e.options.length > 0, `${e.id} should have options`).toBe(true)
      expect(
        e.options?.some((o) => o.id === e.correctOptionId),
        `${e.id} correctOptionId should match one of its options`,
      ).toBe(true)
    }
  })

  it('every sentence_order exercise correctOrder is a permutation of its words', () => {
    const exercises = COURSE.flatMap((l) => l.units)
      .flatMap((u) => u.lessons)
      .flatMap((les) => les.exercises)
      .filter((e) => e.type === 'sentence_order')
    for (const e of exercises) {
      const words = [...(e.words ?? [])].sort()
      const order = [...(e.correctOrder ?? [])].sort()
      expect(order, `${e.id} correctOrder should use exactly the given words`).toEqual(words)
    }
  })

  it('every match_pairs exercise has at least 2 pairs with non-empty left/right', () => {
    const exercises = COURSE.flatMap((l) => l.units)
      .flatMap((u) => u.lessons)
      .flatMap((les) => les.exercises)
      .filter((e) => e.type === 'match_pairs')
    for (const e of exercises) {
      expect((e.pairs?.length ?? 0) >= 2, `${e.id} should have at least 2 pairs`).toBe(true)
      for (const p of e.pairs ?? []) {
        expect(p.left.trim().length > 0 && p.right.trim().length > 0, `${e.id} pair ${p.id} should not be empty`).toBe(true)
      }
    }
  })
})
