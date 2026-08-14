import { supabase } from './supabaseClient'
import type { CustomLessonDraft, DailyGoal, Exercise, LeagueTier, LessonStatus, ReviewItem, User, UserProgressEntry } from '../types'

/**
 * Ponte entre o formato `User` usado pela UI/store (camelCase, já no shape
 * esperado por toda a árvore de componentes) e as tabelas do Postgres
 * (snake_case). Mantém a lógica de gamificação em lib/gamification.ts e
 * lib/progress.ts completamente alheia ao backend.
 */

interface ProfileRow {
  id: string
  name: string
  email: string
  avatar_emoji: string
  is_admin: boolean
  onboarded: boolean
  reason_to_learn: string | null
  daily_goal: DailyGoal
  xp_total: number
  coins: number
  streak_current: number
  streak_record: number
  last_study_date: string | null
  streak_freeze_count: number
  lives_current: number
  lives_max: number
  lives_last_refill_at: string | null
  league: LeagueTier
  xp_this_week: number
  week_start_date: string
  owned_cosmetics: string[]
  created_at: string
}

interface ProgressRow {
  lesson_id: string
  status: LessonStatus
  attempts: number
  correct: number
  best_accuracy: number
  completed_at: string | null
}

interface AchievementRow {
  achievement_id: string
  earned_at: string
}

interface DraftRow {
  id: string
  title: string
  unit_title: string
  exercises: Exercise[]
  created_at: string
}

function assembleUser(profile: ProfileRow, progressRows: ProgressRow[], achievementRows: AchievementRow[]): User {
  const progress: Record<string, UserProgressEntry> = {}
  for (const row of progressRows) {
    progress[row.lesson_id] = {
      lessonId: row.lesson_id,
      status: row.status,
      attempts: row.attempts,
      correct: row.correct,
      bestAccuracy: row.best_accuracy,
      completedAt: row.completed_at ?? undefined,
    }
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatarEmoji: profile.avatar_emoji,
    isAdmin: profile.is_admin,
    createdAt: profile.created_at,
    onboarded: profile.onboarded,
    reasonToLearn: profile.reason_to_learn ?? undefined,
    dailyGoal: profile.daily_goal,
    xpTotal: profile.xp_total,
    coins: profile.coins,
    streakCurrent: profile.streak_current,
    streakRecord: profile.streak_record,
    lastStudyDate: profile.last_study_date ?? undefined,
    streakFreezeCount: profile.streak_freeze_count,
    livesCurrent: profile.lives_current,
    livesMax: profile.lives_max,
    livesLastRefillAt: profile.lives_last_refill_at ?? undefined,
    league: profile.league,
    xpThisWeek: profile.xp_this_week,
    weekStartDate: profile.week_start_date,
    ownedCosmetics: profile.owned_cosmetics,
    progress,
    achievements: achievementRows.map((a) => ({ achievementId: a.achievement_id, earnedAt: a.earned_at })),
  }
}

/** Busca o perfil + progresso + conquistas de um usuário e monta o objeto `User`. */
export async function fetchUser(userId: string): Promise<User | null> {
  if (!supabase) return null

  const [{ data: profile, error: profileError }, { data: progressRows }, { data: achievementRows }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('user_progress').select('*').eq('user_id', userId),
    supabase.from('user_achievements').select('*').eq('user_id', userId),
  ])

  if (profileError || !profile) return null
  return assembleUser(profile as ProfileRow, (progressRows as ProgressRow[]) ?? [], (achievementRows as AchievementRow[]) ?? [])
}

/** Espera a linha em `profiles` existir (o trigger on_auth_user_created a cria de forma assíncrona logo após o signup). */
export async function waitForProfile(userId: string, attempts = 8): Promise<User | null> {
  for (let i = 0; i < attempts; i++) {
    const user = await fetchUser(userId)
    if (user) return user
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  return null
}

const PROFILE_FIELD_MAP: Partial<Record<keyof User, string>> = {
  avatarEmoji: 'avatar_emoji',
  onboarded: 'onboarded',
  reasonToLearn: 'reason_to_learn',
  dailyGoal: 'daily_goal',
  xpTotal: 'xp_total',
  coins: 'coins',
  streakCurrent: 'streak_current',
  streakRecord: 'streak_record',
  lastStudyDate: 'last_study_date',
  streakFreezeCount: 'streak_freeze_count',
  livesCurrent: 'lives_current',
  livesMax: 'lives_max',
  livesLastRefillAt: 'lives_last_refill_at',
  league: 'league',
  xpThisWeek: 'xp_this_week',
  weekStartDate: 'week_start_date',
  ownedCosmetics: 'owned_cosmetics',
}

/** Persiste um subconjunto de campos do usuário em `profiles`. Melhor esforço: falhas só geram log, sem travar a UI. */
export async function persistProfilePatch(userId: string, patch: Partial<User>): Promise<void> {
  if (!supabase) return
  const row: Record<string, unknown> = {}
  for (const key of Object.keys(patch) as (keyof User)[]) {
    const column = PROFILE_FIELD_MAP[key]
    if (column) row[column] = patch[key] ?? null
  }
  if (Object.keys(row).length === 0) return
  const { error } = await supabase.from('profiles').update(row).eq('id', userId)
  if (error) console.error('Falha ao salvar perfil no Supabase:', error.message)
}

export async function persistProgressEntry(userId: string, entry: UserProgressEntry): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('user_progress').upsert({
    user_id: userId,
    lesson_id: entry.lessonId,
    status: entry.status,
    attempts: entry.attempts,
    correct: entry.correct,
    best_accuracy: entry.bestAccuracy,
    completed_at: entry.completedAt ?? null,
  })
  if (error) console.error('Falha ao salvar progresso no Supabase:', error.message)
}

export async function persistNewAchievements(userId: string, achievementIds: string[]): Promise<void> {
  if (!supabase || achievementIds.length === 0) return
  const { error } = await supabase
    .from('user_achievements')
    .insert(achievementIds.map((id) => ({ user_id: userId, achievement_id: id })))
  if (error) console.error('Falha ao salvar conquistas no Supabase:', error.message)
}

export async function fetchCustomLessonDrafts(): Promise<CustomLessonDraft[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('custom_lesson_drafts').select('*').order('created_at', { ascending: false })
  if (error || !data) return []
  return (data as DraftRow[]).map((d) => ({
    id: d.id,
    title: d.title,
    unitTitle: d.unit_title,
    createdAt: d.created_at,
    exercises: d.exercises,
  }))
}

export async function insertCustomLessonDraft(
  authorId: string,
  title: string,
  unitTitle: string,
  exercises: Exercise[],
): Promise<CustomLessonDraft | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('custom_lesson_drafts')
    .insert({ author_id: authorId, title, unit_title: unitTitle, exercises })
    .select()
    .single()
  if (error || !data) {
    console.error('Falha ao criar rascunho no Supabase:', error?.message)
    return null
  }
  const d = data as DraftRow
  return { id: d.id, title: d.title, unitTitle: d.unit_title, createdAt: d.created_at, exercises: d.exercises }
}

interface ReviewItemRow {
  exercise_id: string
  lesson_id: string
  interval_stage: number
  next_review_date: string
}

export async function fetchReviewQueue(userId: string): Promise<ReviewItem[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('user_review_items').select('*').eq('user_id', userId)
  if (error || !data) return []
  return (data as ReviewItemRow[]).map((r) => ({
    exerciseId: r.exercise_id,
    lessonId: r.lesson_id,
    intervalStage: r.interval_stage,
    nextReviewDate: r.next_review_date,
  }))
}

export async function upsertReviewItem(userId: string, item: ReviewItem): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('user_review_items').upsert({
    user_id: userId,
    exercise_id: item.exerciseId,
    lesson_id: item.lessonId,
    interval_stage: item.intervalStage,
    next_review_date: item.nextReviewDate,
    updated_at: new Date().toISOString(),
  })
  if (error) console.error('Falha ao salvar item de revisão no Supabase:', error.message)
}

export async function deleteReviewItem(userId: string, exerciseId: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('user_review_items').delete().eq('user_id', userId).eq('exercise_id', exerciseId)
  if (error) console.error('Falha ao remover item de revisão no Supabase:', error.message)
}

export interface AdminStudentRow {
  id: string
  name: string
  avatarEmoji: string
  xpTotal: number
  streakCurrent: number
  league: LeagueTier
  createdAt: string
  completedLessons: number
}

/** Visão agregada para o painel admin. Só retorna dados de fato se o usuário logado for admin (RLS aplica isso no servidor). */
export async function fetchAdminOverview(): Promise<AdminStudentRow[]> {
  if (!supabase) return []
  const [{ data: profiles }, { data: progressRows }] = await Promise.all([
    supabase.from('profiles').select('*'),
    supabase.from('user_progress').select('user_id, status').eq('status', 'completed'),
  ])
  if (!profiles) return []

  const completedByUser = new Map<string, number>()
  for (const row of (progressRows as { user_id: string }[]) ?? []) {
    completedByUser.set(row.user_id, (completedByUser.get(row.user_id) ?? 0) + 1)
  }

  return (profiles as ProfileRow[]).map((p) => ({
    id: p.id,
    name: p.name,
    avatarEmoji: p.avatar_emoji,
    xpTotal: p.xp_total,
    streakCurrent: p.streak_current,
    league: p.league,
    createdAt: p.created_at,
    completedLessons: completedByUser.get(p.id) ?? 0,
  }))
}

export async function deleteCustomLessonDraftRow(id: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('custom_lesson_drafts').delete().eq('id', id)
  if (error) console.error('Falha ao excluir rascunho no Supabase:', error.message)
}
