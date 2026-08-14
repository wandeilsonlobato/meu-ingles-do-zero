import type { DailyGoal, LeagueTier, Rank } from '../types'

/** Regras de negócio de gamificação: XP, rank, corações e sequência (streak). */

export const HEART_REFILL_MINUTES = 4 * 60
export const MAX_HEARTS_DEFAULT = 5
export const MAX_STREAK_FREEZES = 2
export const XP_PER_CORRECT_ANSWER = 10

const RANK_THRESHOLDS: { rank: Rank; minXp: number }[] = [
  { rank: 'Mestre', minXp: 5000 },
  { rank: 'Fluente', minXp: 2000 },
  { rank: 'Dedicado', minXp: 800 },
  { rank: 'Curioso', minXp: 200 },
  { rank: 'Iniciante', minXp: 0 },
]

export function rankForXp(xpTotal: number): Rank {
  const found = RANK_THRESHOLDS.find((t) => xpTotal >= t.minXp)
  return found ? found.rank : 'Iniciante'
}

export function nextRankInfo(xpTotal: number): { rank: Rank; xpNeeded: number } | null {
  const sorted = [...RANK_THRESHOLDS].sort((a, b) => a.minXp - b.minXp)
  const next = sorted.find((t) => t.minXp > xpTotal)
  if (!next) return null
  return { rank: next.rank, xpNeeded: next.minXp - xpTotal }
}

export function leagueForXp(weeklyXp: number): LeagueTier {
  if (weeklyXp >= 300) return 'Diamante'
  if (weeklyXp >= 150) return 'Ouro'
  if (weeklyXp >= 50) return 'Prata'
  return 'Bronze'
}

/** XP de uma lição: recompensa base + bônus de 20% (arredondado) se 100% de acerto. */
export function xpForLessonCompletion(xpReward: number, accuracyPct: number): number {
  const bonus = accuracyPct >= 100 ? Math.round(xpReward * 0.2) : 0
  return xpReward + bonus
}

export function loseHeart(livesCurrent: number): number {
  return Math.max(0, livesCurrent - 1)
}

export interface HeartRefillState {
  livesCurrent: number
  livesLastRefillAt?: string
}

/** Corações regeneram 1 a cada HEART_REFILL_MINUTES, até o máximo. Nunca regenera se já no máximo. */
export function refillHearts(
  state: HeartRefillState,
  livesMax: number,
  now: Date = new Date(),
): HeartRefillState {
  if (state.livesCurrent >= livesMax) {
    return { livesCurrent: livesMax, livesLastRefillAt: undefined }
  }
  if (!state.livesLastRefillAt) {
    return state
  }
  const elapsedMs = now.getTime() - new Date(state.livesLastRefillAt).getTime()
  const elapsedMinutes = Math.floor(elapsedMs / 60000)
  const gained = Math.floor(elapsedMinutes / HEART_REFILL_MINUTES)
  if (gained <= 0) return state
  const newLives = Math.min(livesMax, state.livesCurrent + gained)
  const remainderMinutes = elapsedMinutes % HEART_REFILL_MINUTES
  const newLastRefillAt =
    newLives >= livesMax
      ? undefined
      : new Date(now.getTime() - remainderMinutes * 60000).toISOString()
  return { livesCurrent: newLives, livesLastRefillAt: newLastRefillAt }
}

export function toDateOnly(iso: string): string {
  return iso.slice(0, 10)
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / msPerDay)
}

export interface StreakState {
  streakCurrent: number
  streakRecord: number
  lastStudyDate?: string
  streakFreezeCount: number
}

/**
 * Atualiza a sequência ao registrar estudo em `todayDate` (YYYY-MM-DD).
 * - Mesmo dia: nada muda.
 * - Dia seguinte: sequência +1.
 * - Um dia perdido com congelador disponível: consome o congelador e mantém a sequência.
 * - Caso contrário: sequência reinicia em 1.
 */
export function registerStudyDay(state: StreakState, todayDate: string): StreakState {
  if (state.lastStudyDate === todayDate) return state

  let streakCurrent: number
  let streakFreezeCount = state.streakFreezeCount

  if (!state.lastStudyDate) {
    streakCurrent = 1
  } else {
    const gap = daysBetween(state.lastStudyDate, todayDate)
    if (gap === 1) {
      streakCurrent = state.streakCurrent + 1
    } else if (gap === 2 && state.streakFreezeCount > 0) {
      streakCurrent = state.streakCurrent + 1
      streakFreezeCount -= 1
    } else {
      streakCurrent = 1
    }
  }

  return {
    streakCurrent,
    streakRecord: Math.max(state.streakRecord, streakCurrent),
    lastStudyDate: todayDate,
    streakFreezeCount,
  }
}

export function isStreakAtRisk(lastStudyDate: string | undefined, todayDate: string): boolean {
  if (!lastStudyDate) return false
  return daysBetween(lastStudyDate, todayDate) >= 1
}

/** Retorna a data (YYYY-MM-DD) da segunda-feira da semana ISO de `date`. */
export function isoWeekStart(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay() // 0 = domingo
  const diffToMonday = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diffToMonday)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export interface WeeklyXpState {
  xpThisWeek: number
  weekStartDate: string
}

/** Soma XP à semana atual; zera o contador se uma nova semana ISO começou. */
export function addWeeklyXp(state: WeeklyXpState, xpEarned: number, now: Date = new Date()): WeeklyXpState {
  const currentWeekStart = isoWeekStart(now)
  if (state.weekStartDate !== currentWeekStart) {
    return { xpThisWeek: xpEarned, weekStartDate: currentWeekStart }
  }
  return { xpThisWeek: state.xpThisWeek + xpEarned, weekStartDate: currentWeekStart }
}

export const DAILY_GOAL_LABELS: Record<DailyGoal, string> = {
  casual: 'Casual (10 XP/dia)',
  regular: 'Regular (20 XP/dia)',
  serio: 'Sério (30 XP/dia)',
  intenso: 'Intenso (50 XP/dia)',
}
