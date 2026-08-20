import { supabase } from './supabaseClient'
import type {
  CustomLessonDraft,
  DailyGoal,
  Exercise,
  Friendship,
  FriendshipStatus,
  InterfaceLocale,
  LeaderboardRow,
  LeagueTier,
  LessonStatus,
  PublicProfile,
  ReviewItem,
  User,
  UserProgressEntry,
} from '../types'

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
  avatar_photo_url: string | null
  bio: string | null
  is_admin: boolean
  onboarded: boolean
  reason_to_learn: string | null
  daily_goal: DailyGoal
  interface_locale: InterfaceLocale
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
    avatarPhotoUrl: profile.avatar_photo_url ?? undefined,
    bio: profile.bio ?? undefined,
    isAdmin: profile.is_admin,
    createdAt: profile.created_at,
    onboarded: profile.onboarded,
    reasonToLearn: profile.reason_to_learn ?? undefined,
    dailyGoal: profile.daily_goal,
    interfaceLocale: profile.interface_locale,
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
  name: 'name',
  avatarEmoji: 'avatar_emoji',
  avatarPhotoUrl: 'avatar_photo_url',
  bio: 'bio',
  onboarded: 'onboarded',
  reasonToLearn: 'reason_to_learn',
  dailyGoal: 'daily_goal',
  interfaceLocale: 'interface_locale',
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

interface LeaderboardViewRow {
  id: string
  name: string
  avatar_emoji: string
  league: LeagueTier
  xp_this_week: number
  week_start_date: string
}

/**
 * Ranking real: lê a view pública `leaderboard` (só name/avatar/liga/XP da
 * semana — nunca e-mail). Requer a migration 0003_leaderboard.sql aplicada;
 * sem ela, retorna vazio e a tela mostra só o usuário atual.
 */
export async function fetchLeaderboard(): Promise<LeaderboardRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('leaderboard').select('*')
  if (error || !data) return []
  return (data as LeaderboardViewRow[]).map((r) => ({
    id: r.id,
    name: r.name,
    avatarEmoji: r.avatar_emoji,
    league: r.league,
    xpThisWeek: r.xp_this_week,
    weekStartDate: r.week_start_date,
  }))
}

export async function deleteCustomLessonDraftRow(id: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('custom_lesson_drafts').delete().eq('id', id)
  if (error) console.error('Falha ao excluir rascunho no Supabase:', error.message)
}

/** Faz upload de uma foto de perfil para o bucket público `avatars/{userId}/...` e retorna a URL pública. */
export async function uploadAvatarPhoto(userId: string, file: File): Promise<{ url: string | null; error?: string }> {
  if (!supabase) return { url: null, error: 'Backend não configurado.' }
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/photo-${Date.now()}.${ext}`
  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (uploadError) return { url: null, error: uploadError.message }
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return { url: data.publicUrl }
}

interface PublicProfileRow {
  id: string
  name: string
  avatar_emoji: string
  avatar_photo_url: string | null
  bio: string | null
  streak_current: number
  league: LeagueTier
}

function mapPublicProfileRow(row: PublicProfileRow, achievements: { id: string; name: string; icon: string }[]): PublicProfile {
  return {
    id: row.id,
    name: row.name,
    avatarEmoji: row.avatar_emoji,
    avatarPhotoUrl: row.avatar_photo_url ?? undefined,
    bio: row.bio ?? undefined,
    streakCurrent: row.streak_current,
    league: row.league,
    achievements,
  }
}

/** Busca alunos pelo nome (case-insensitive, parcial). Não inclui o próprio usuário. */
export async function searchProfiles(query: string, excludeUserId: string): Promise<PublicProfile[]> {
  if (!supabase || !query.trim()) return []
  const { data, error } = await supabase
    .from('public_profiles')
    .select('id, name, avatar_emoji, avatar_photo_url, bio, streak_current, league')
    .ilike('name', `%${query.trim()}%`)
    .neq('id', excludeUserId)
    .limit(20)
  if (error || !data) return []
  return (data as PublicProfileRow[]).map((r) => mapPublicProfileRow(r, []))
}

/** Busca vários perfis públicos de uma vez pelos ids (sem conquistas — usado só para listas de amigos/pedidos). */
export async function fetchPublicProfilesByIds(ids: string[]): Promise<PublicProfile[]> {
  if (!supabase || ids.length === 0) return []
  const { data, error } = await supabase
    .from('public_profiles')
    .select('id, name, avatar_emoji, avatar_photo_url, bio, streak_current, league')
    .in('id', ids)
  if (error || !data) return []
  return (data as PublicProfileRow[]).map((r) => mapPublicProfileRow(r, []))
}

/** Perfil público completo de um aluno, incluindo algumas conquistas (para a tela de perfil de amigo/busca). */
export async function fetchPublicProfile(userId: string, achievementCatalog: { id: string; name: string; icon: string }[]): Promise<PublicProfile | null> {
  if (!supabase) return null
  const [{ data: profile }, { data: achievementRows }] = await Promise.all([
    supabase.from('public_profiles').select('id, name, avatar_emoji, avatar_photo_url, bio, streak_current, league').eq('id', userId).single(),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', userId),
  ])
  if (!profile) return null
  const earnedIds = new Set(((achievementRows as { achievement_id: string }[]) ?? []).map((a) => a.achievement_id))
  const achievements = achievementCatalog.filter((a) => earnedIds.has(a.id))
  return mapPublicProfileRow(profile as PublicProfileRow, achievements)
}

interface FriendshipRow {
  id: string
  requester_id: string
  addressee_id: string
  status: FriendshipStatus
  created_at: string
}

function mapFriendshipRow(row: FriendshipRow): Friendship {
  return { id: row.id, requesterId: row.requester_id, addresseeId: row.addressee_id, status: row.status, createdAt: row.created_at }
}

/** Todas as amizades (pendentes e aceitas) em que o usuário está envolvido, dos dois lados. */
export async function fetchFriendships(userId: string): Promise<Friendship[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('friendships')
    .select('*')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
  if (error || !data) return []
  return (data as FriendshipRow[]).map(mapFriendshipRow)
}

export async function sendFriendRequest(requesterId: string, addresseeId: string): Promise<{ ok: boolean; error?: string; friendship?: Friendship }> {
  if (!supabase) return { ok: false, error: 'Backend não configurado.' }
  const { data, error } = await supabase
    .from('friendships')
    .insert({ requester_id: requesterId, addressee_id: addresseeId })
    .select()
    .single()
  if (error) return { ok: false, error: error.message.includes('duplicate') ? 'Já existe um pedido entre vocês.' : error.message }
  return { ok: true, friendship: mapFriendshipRow(data as FriendshipRow) }
}

export async function respondToFriendRequest(id: string, accept: boolean): Promise<void> {
  if (!supabase) return
  if (accept) {
    const { error } = await supabase.from('friendships').update({ status: 'accepted', responded_at: new Date().toISOString() }).eq('id', id)
    if (error) console.error('Falha ao aceitar pedido de amizade:', error.message)
  } else {
    const { error } = await supabase.from('friendships').delete().eq('id', id)
    if (error) console.error('Falha ao recusar pedido de amizade:', error.message)
  }
}

export async function removeFriendship(id: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('friendships').delete().eq('id', id)
  if (error) console.error('Falha ao remover amizade:', error.message)
}
