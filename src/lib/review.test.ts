import { describe, expect, it } from 'vitest'
import { addDays, dueReviewItems, isDue, scheduleAfterCorrectReview, scheduleAfterMistake } from './review'

describe('addDays', () => {
  it('adds days within the same month', () => {
    expect(addDays('2026-01-01', 3)).toBe('2026-01-04')
  })
  it('rolls over to the next month', () => {
    expect(addDays('2026-01-30', 3)).toBe('2026-02-02')
  })
})

describe('scheduleAfterMistake', () => {
  it('starts at stage 0, due in 1 day', () => {
    const item = scheduleAfterMistake('ex-1', 'lesson-1', '2026-01-01')
    expect(item).toEqual({ exerciseId: 'ex-1', lessonId: 'lesson-1', intervalStage: 0, nextReviewDate: '2026-01-02' })
  })
})

describe('scheduleAfterCorrectReview', () => {
  const base = { exerciseId: 'ex-1', lessonId: 'lesson-1', intervalStage: 0, nextReviewDate: '2026-01-02' }

  it('advances to the next stage and pushes the date further out', () => {
    const result = scheduleAfterCorrectReview(base, '2026-01-02')
    expect(result.mastered).toBe(false)
    expect(result.item.intervalStage).toBe(1)
    expect(result.item.nextReviewDate).toBe('2026-01-05')
  })

  it('marks the item as mastered after the last stage is passed', () => {
    const lastStage = { ...base, intervalStage: 3 }
    const result = scheduleAfterCorrectReview(lastStage, '2026-01-20')
    expect(result.mastered).toBe(true)
  })
})

describe('isDue / dueReviewItems', () => {
  const items = [
    { exerciseId: 'a', lessonId: 'l', intervalStage: 0, nextReviewDate: '2026-01-01' },
    { exerciseId: 'b', lessonId: 'l', intervalStage: 0, nextReviewDate: '2026-01-10' },
  ]

  it('is due when the scheduled date has passed or is today', () => {
    expect(isDue(items[0], '2026-01-05')).toBe(true)
    expect(isDue(items[1], '2026-01-05')).toBe(false)
  })

  it('filters only due items', () => {
    expect(dueReviewItems(items, '2026-01-05').map((i) => i.exerciseId)).toEqual(['a'])
  })
})
