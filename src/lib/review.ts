import type { ReviewItem } from '../types'

/**
 * Repetição espaçada estilo Leitner: cada erro entra na fila e reaparece em
 * intervalos crescentes (1, 3, 7, 16 dias) sempre que o aluno acerta de novo.
 * Errar reseta o item para o início da fila. Acertar no último estágio remove
 * o item da fila (considerado dominado).
 */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 16]

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function scheduleAfterMistake(exerciseId: string, lessonId: string, today: string): ReviewItem {
  return {
    exerciseId,
    lessonId,
    intervalStage: 0,
    nextReviewDate: addDays(today, REVIEW_INTERVALS_DAYS[0]),
  }
}

export interface ReviewAdvanceResult {
  mastered: boolean
  item: ReviewItem
}

export function scheduleAfterCorrectReview(current: ReviewItem, today: string): ReviewAdvanceResult {
  const nextStage = current.intervalStage + 1
  if (nextStage >= REVIEW_INTERVALS_DAYS.length) {
    return { mastered: true, item: { ...current, intervalStage: nextStage, nextReviewDate: today } }
  }
  return {
    mastered: false,
    item: { ...current, intervalStage: nextStage, nextReviewDate: addDays(today, REVIEW_INTERVALS_DAYS[nextStage]) },
  }
}

export function isDue(item: ReviewItem, today: string): boolean {
  return item.nextReviewDate <= today
}

export function dueReviewItems(items: ReviewItem[], today: string): ReviewItem[] {
  return items.filter((item) => isDue(item, today))
}
