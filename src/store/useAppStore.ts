import { create } from 'zustand'
import type { CustomLessonDraft, DailyGoal, Exercise, ReviewItem, User, UserProgressEntry } from '../types'
import { COURSE } from '../data/course'
import { ACHIEVEMENTS } from '../data/achievements'
import { SHOP_ITEMS } from '../data/shop'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import {
  deleteCustomLessonDraftRow,
  deleteReviewItem,
  fetchCustomLessonDrafts,
  fetchReviewQueue,
  insertCustomLessonDraft,
  persistNewAchievements,
  persistProfilePatch,
  persistProgressEntry,
  upsertReviewItem,
  waitForProfile,
} from '../lib/supabaseSync'
import {
  addWeeklyXp,
  leagueForXp,
  loseHeart as loseHeartXp,
  rankForXp,
  refillHearts,
  registerStudyDay,
  xpForLessonCompletion,
} from '../lib/gamification'
import { checkNewAchievements, findNextLesson, lessonStatus as computeLessonStatus, flattenLessons } from '../lib/progress'
import { todayLocalDate } from '../lib/auth'
import { scheduleAfterCorrectReview, scheduleAfterMistake } from '../lib/review'

const LEVEL_ORDER = ['A0', 'A1', 'A2', 'B1', 'B2'] as const
const REVIEW_XP_PER_ITEM = 2

interface AuthResult {
  ok: boolean
  error?: string
  needsEmailConfirmation?: boolean
}

interface LessonAttemptResult {
  correctCount: number
  totalCount: number
  xpEarned: number
  newAchievements: { id: string; name: string; icon: string; description: string }[]
  leveledUp: boolean
}

interface AppState {
  users: Record<string, User>
  currentUserId: string | null
  authLoading: boolean
  customLessonDrafts: CustomLessonDraft[]
  reviewQueue: ReviewItem[]

  initAuth: () => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>
  logIn: (email: string, password: string) => Promise<AuthResult>
  logInWithGoogle: () => Promise<AuthResult>
  logOut: () => Promise<void>

  completeOnboarding: (data: { reasonToLearn: string; dailyGoal: DailyGoal }) => void

  tickHeartRefill: () => void
  loseHeartAction: () => void
  submitLessonAttempt: (lessonId: string, correctCount: number, totalCount: number, xpReward: number) => LessonAttemptResult
  useStreakFreezeItem: () => void
  purchaseItem: (itemId: string) => { ok: boolean; error?: string }
  updateDailyGoal: (goal: DailyGoal) => void
  updateAvatar: (emoji: string) => void

  loadCustomLessonDrafts: () => Promise<void>
  addCustomLessonDraft: (title: string, unitTitle: string, exercises: Exercise[]) => Promise<void>
  deleteCustomLessonDraft: (id: string) => Promise<void>

  loadReviewQueue: () => Promise<void>
  recordMistake: (exerciseId: string, lessonId: string) => void
  resolveReviewCorrect: (exerciseId: string) => void
  resolveReviewWrong: (exerciseId: string) => void

  applyPlacement: (throughLevelCode: 'A0' | 'A1' | 'A2' | null) => void

  currentUser: () => User | null
}

// Evita chamar getSession()/onAuthStateChange mais de uma vez: o StrictMode do React
// invoca efeitos duas vezes em desenvolvimento, e chamadas concorrentes ao GoTrueClient
// do supabase-js podem travar (deadlock conhecido do lock interno da lib). Também
// protege com um timeout para o app nunca ficar preso na tela de carregamento.
let authInitPromise: Promise<void> | null = null

async function getSessionWithTimeout(timeoutMs = 6000) {
  if (!supabase) return null
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs))
  const sessionLookup = supabase.auth.getSession().then((r) => r.data.session)
  return Promise.race([sessionLookup, timeout])
}

function mapAuthError(message: string): string {
  if (message.includes('User already registered')) return 'Já existe uma conta com esse e-mail.'
  if (message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (message.includes('Password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.'
  if (message.includes('Unable to validate email address')) return 'E-mail inválido.'
  return message
}

export const useAppStore = create<AppState>()((set, get) => ({
  users: {},
  currentUserId: null,
  authLoading: true,
  customLessonDrafts: [],
  reviewQueue: [],

  currentUser: () => {
    const state = get()
    return state.currentUserId ? state.users[state.currentUserId] ?? null : null
  },

  initAuth: () => {
    if (authInitPromise) return authInitPromise

    authInitPromise = (async () => {
      if (!supabase) {
        set({ authLoading: false })
        return
      }

      const session = await getSessionWithTimeout()

      if (session) {
        const user = await waitForProfile(session.user.id)
        if (user) set((state) => ({ users: { ...state.users, [user.id]: user }, currentUserId: user.id }))
      }
      set({ authLoading: false })

      supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (event === 'SIGNED_OUT') {
          set({ currentUserId: null })
          return
        }
        if (newSession && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
          const existing = get().users[newSession.user.id]
          if (existing && event === 'TOKEN_REFRESHED') return
          const user = await waitForProfile(newSession.user.id)
          if (user) set((state) => ({ users: { ...state.users, [user.id]: user }, currentUserId: user.id }))
        }
      })
    })()

    return authInitPromise
  },

  signUp: async (name, email, password) => {
    if (!supabase) return { ok: false, error: 'Backend não configurado. Veja as instruções de configuração do Supabase.' }
    const normalizedEmail = email.trim().toLowerCase()
    if (!name.trim()) return { ok: false, error: 'Informe seu nome.' }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { data: { name: name.trim() } },
    })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    if (!data.user) return { ok: false, error: 'Não foi possível criar sua conta. Tente novamente.' }

    if (!data.session) {
      return { ok: true, needsEmailConfirmation: true }
    }

    const user = await waitForProfile(data.user.id)
    if (!user) return { ok: false, error: 'Conta criada, mas não foi possível carregar seu perfil. Tente entrar novamente.' }
    set((state) => ({ users: { ...state.users, [user.id]: user }, currentUserId: user.id }))
    return { ok: true }
  },

  logIn: async (email, password) => {
    if (!supabase) return { ok: false, error: 'Backend não configurado. Veja as instruções de configuração do Supabase.' }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    const user = await waitForProfile(data.user.id)
    if (!user) return { ok: false, error: 'Não foi possível carregar seu perfil.' }
    set((state) => ({ users: { ...state.users, [user.id]: user }, currentUserId: user.id }))
    return { ok: true }
  },

  logInWithGoogle: async () => {
    if (!supabase) return { ok: false, error: 'Backend não configurado. Veja as instruções de configuração do Supabase.' }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  },

  logOut: async () => {
    if (supabase) await supabase.auth.signOut()
    set({ currentUserId: null })
  },

  completeOnboarding: ({ reasonToLearn, dailyGoal }) => {
    const state = get()
    const user = state.currentUser()
    if (!user) return
    const updated = { ...user, onboarded: true, reasonToLearn, dailyGoal }
    set({ users: { ...state.users, [user.id]: updated } })
    void persistProfilePatch(user.id, { onboarded: true, reasonToLearn, dailyGoal })
  },

  tickHeartRefill: () => {
    const state = get()
    const user = state.currentUser()
    if (!user) return
    const refilled = refillHearts(
      { livesCurrent: user.livesCurrent, livesLastRefillAt: user.livesLastRefillAt },
      user.livesMax,
    )
    if (refilled.livesCurrent === user.livesCurrent && refilled.livesLastRefillAt === user.livesLastRefillAt) return
    const updated = { ...user, livesCurrent: refilled.livesCurrent, livesLastRefillAt: refilled.livesLastRefillAt }
    set({ users: { ...state.users, [user.id]: updated } })
    void persistProfilePatch(user.id, { livesCurrent: refilled.livesCurrent, livesLastRefillAt: refilled.livesLastRefillAt })
  },

  loseHeartAction: () => {
    const state = get()
    const user = state.currentUser()
    if (!user || user.livesCurrent <= 0) return
    const newLives = loseHeartXp(user.livesCurrent)
    const livesLastRefillAt = user.livesLastRefillAt ?? new Date().toISOString()
    const updated = { ...user, livesCurrent: newLives, livesLastRefillAt }
    set({ users: { ...state.users, [user.id]: updated } })
    void persistProfilePatch(user.id, { livesCurrent: newLives, livesLastRefillAt })
  },

  submitLessonAttempt: (lessonId, correctCount, totalCount, xpReward) => {
    const state = get()
    const user = state.currentUser()
    if (!user) {
      return { correctCount, totalCount, xpEarned: 0, newAchievements: [], leveledUp: false }
    }
    const accuracyPct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
    const xpEarned = xpForLessonCompletion(xpReward, accuracyPct)

    const prevEntry = user.progress[lessonId]
    const entry: UserProgressEntry = {
      lessonId,
      status: 'completed',
      attempts: (prevEntry?.attempts ?? 0) + 1,
      correct: (prevEntry?.correct ?? 0) + correctCount,
      bestAccuracy: Math.max(prevEntry?.bestAccuracy ?? 0, accuracyPct),
      completedAt: new Date().toISOString(),
    }

    const today = todayLocalDate()
    const streakState = registerStudyDay(
      {
        streakCurrent: user.streakCurrent,
        streakRecord: user.streakRecord,
        lastStudyDate: user.lastStudyDate,
        streakFreezeCount: user.streakFreezeCount,
      },
      today,
    )

    const newXpTotal = user.xpTotal + xpEarned
    const previousRank = rankForXp(user.xpTotal)
    const newRank = rankForXp(newXpTotal)
    const weekly = addWeeklyXp({ xpThisWeek: user.xpThisWeek, weekStartDate: user.weekStartDate }, xpEarned)

    const newProgress = { ...user.progress, [lessonId]: entry }

    const containingUnit = COURSE.flatMap((l) => l.units).find((u) => u.lessons.some((les) => les.id === lessonId))
    const level = containingUnit ? COURSE.find((l) => l.id === containingUnit.levelId) : undefined
    const justCompletedLevel = level && level.units.every((u) => u.lessons.every((les) => newProgress[les.id]?.status === 'completed'))

    const wordsLearned = Object.values(newProgress).filter((p) => p.status === 'completed').length * 4
    const unlocked = checkNewAchievements(
      { ...user, progress: newProgress, streakCurrent: streakState.streakCurrent },
      ACHIEVEMENTS,
      {
        wordsLearned,
        perfectSpeakingExercise: accuracyPct >= 100,
        levelJustCompletedCode: justCompletedLevel ? level?.code : undefined,
      },
    )

    const newCoins = user.coins + Math.round(xpEarned / 2)
    const newLeague = leagueForXp(weekly.xpThisWeek)

    const updatedUser: User = {
      ...user,
      xpTotal: newXpTotal,
      coins: newCoins,
      progress: newProgress,
      streakCurrent: streakState.streakCurrent,
      streakRecord: streakState.streakRecord,
      lastStudyDate: streakState.lastStudyDate,
      streakFreezeCount: streakState.streakFreezeCount,
      xpThisWeek: weekly.xpThisWeek,
      weekStartDate: weekly.weekStartDate,
      league: newLeague,
      achievements: [
        ...user.achievements,
        ...unlocked.map((a) => ({ achievementId: a.id, earnedAt: new Date().toISOString() })),
      ],
    }

    set({ users: { ...state.users, [user.id]: updatedUser } })

    void persistProgressEntry(user.id, entry)
    void persistProfilePatch(user.id, {
      xpTotal: newXpTotal,
      coins: newCoins,
      streakCurrent: streakState.streakCurrent,
      streakRecord: streakState.streakRecord,
      lastStudyDate: streakState.lastStudyDate,
      streakFreezeCount: streakState.streakFreezeCount,
      xpThisWeek: weekly.xpThisWeek,
      weekStartDate: weekly.weekStartDate,
      league: newLeague,
    })
    if (unlocked.length > 0) void persistNewAchievements(user.id, unlocked.map((a) => a.id))

    return {
      correctCount,
      totalCount,
      xpEarned,
      newAchievements: unlocked,
      leveledUp: previousRank !== newRank,
    }
  },

  useStreakFreezeItem: () => {
    const state = get()
    const user = state.currentUser()
    if (!user) return
    const streakFreezeCount = user.streakFreezeCount + 1
    set({ users: { ...state.users, [user.id]: { ...user, streakFreezeCount } } })
    void persistProfilePatch(user.id, { streakFreezeCount })
  },

  purchaseItem: (itemId) => {
    const state = get()
    const user = state.currentUser()
    if (!user) return { ok: false, error: 'Sem usuário logado.' }
    const item = SHOP_ITEMS.find((i) => i.id === itemId)
    if (!item) return { ok: false, error: 'Item não encontrado.' }
    if (user.coins < item.cost) return { ok: false, error: 'Moedas insuficientes.' }
    if (item.kind === 'avatar' && user.ownedCosmetics.includes(itemId)) {
      return { ok: false, error: 'Você já tem este item.' }
    }

    let updated: User = { ...user, coins: user.coins - item.cost }
    if (item.kind === 'streak_freeze') {
      updated = { ...updated, streakFreezeCount: updated.streakFreezeCount + 1 }
    } else if (item.kind === 'heart_refill') {
      updated = { ...updated, livesCurrent: updated.livesMax, livesLastRefillAt: undefined }
    } else if (item.kind === 'avatar') {
      updated = { ...updated, ownedCosmetics: [...updated.ownedCosmetics, itemId] }
    }

    set({ users: { ...state.users, [user.id]: updated } })
    void persistProfilePatch(user.id, {
      coins: updated.coins,
      streakFreezeCount: updated.streakFreezeCount,
      livesCurrent: updated.livesCurrent,
      livesLastRefillAt: updated.livesLastRefillAt,
      ownedCosmetics: updated.ownedCosmetics,
    })
    return { ok: true }
  },

  updateDailyGoal: (goal) => {
    const state = get()
    const user = state.currentUser()
    if (!user) return
    set({ users: { ...state.users, [user.id]: { ...user, dailyGoal: goal } } })
    void persistProfilePatch(user.id, { dailyGoal: goal })
  },

  updateAvatar: (emoji) => {
    const state = get()
    const user = state.currentUser()
    if (!user) return
    set({ users: { ...state.users, [user.id]: { ...user, avatarEmoji: emoji } } })
    void persistProfilePatch(user.id, { avatarEmoji: emoji })
  },

  loadCustomLessonDrafts: async () => {
    const drafts = await fetchCustomLessonDrafts()
    set({ customLessonDrafts: drafts })
  },

  addCustomLessonDraft: async (title, unitTitle, exercises) => {
    const user = get().currentUser()
    if (!user) return
    const draft = await insertCustomLessonDraft(user.id, title, unitTitle, exercises)
    if (draft) set((state) => ({ customLessonDrafts: [draft, ...state.customLessonDrafts] }))
  },

  deleteCustomLessonDraft: async (id) => {
    await deleteCustomLessonDraftRow(id)
    set((state) => ({ customLessonDrafts: state.customLessonDrafts.filter((d) => d.id !== id) }))
  },

  loadReviewQueue: async () => {
    const user = get().currentUser()
    if (!user) return
    const items = await fetchReviewQueue(user.id)
    set({ reviewQueue: items })
  },

  recordMistake: (exerciseId, lessonId) => {
    const user = get().currentUser()
    if (!user) return
    const today = todayLocalDate()
    const item = scheduleAfterMistake(exerciseId, lessonId, today)
    set((state) => ({
      reviewQueue: [...state.reviewQueue.filter((i) => i.exerciseId !== exerciseId), item],
    }))
    void upsertReviewItem(user.id, item)
  },

  resolveReviewCorrect: (exerciseId) => {
    const state = get()
    const user = state.currentUser()
    if (!user) return
    const current = state.reviewQueue.find((i) => i.exerciseId === exerciseId)
    if (!current) return
    const today = todayLocalDate()
    const { mastered, item } = scheduleAfterCorrectReview(current, today)

    if (mastered) {
      set((s) => ({ reviewQueue: s.reviewQueue.filter((i) => i.exerciseId !== exerciseId) }))
      void deleteReviewItem(user.id, exerciseId)
    } else {
      set((s) => ({ reviewQueue: s.reviewQueue.map((i) => (i.exerciseId === exerciseId ? item : i)) }))
      void upsertReviewItem(user.id, item)
    }

    const newXpTotal = user.xpTotal + REVIEW_XP_PER_ITEM
    const newCoins = user.coins + 1
    set((s) => ({ users: { ...s.users, [user.id]: { ...user, xpTotal: newXpTotal, coins: newCoins } } }))
    void persistProfilePatch(user.id, { xpTotal: newXpTotal, coins: newCoins })
  },

  resolveReviewWrong: (exerciseId) => {
    const state = get()
    const user = state.currentUser()
    if (!user) return
    const current = state.reviewQueue.find((i) => i.exerciseId === exerciseId)
    if (!current) return
    const today = todayLocalDate()
    const item = scheduleAfterMistake(exerciseId, current.lessonId, today)
    set((s) => ({ reviewQueue: s.reviewQueue.map((i) => (i.exerciseId === exerciseId ? item : i)) }))
    void upsertReviewItem(user.id, item)
  },

  applyPlacement: (throughLevelCode) => {
    const state = get()
    const user = state.currentUser()
    if (!user || !throughLevelCode) return
    const cutoffIndex = LEVEL_ORDER.indexOf(throughLevelCode)
    const levelsToSkip = COURSE.filter((l) => LEVEL_ORDER.indexOf(l.code) <= cutoffIndex)
    const lessonsToComplete = levelsToSkip.flatMap((l) => l.units).flatMap((u) => u.lessons)
    const now = new Date().toISOString()
    const newProgress = { ...user.progress }
    for (const lesson of lessonsToComplete) {
      const entry: UserProgressEntry = {
        lessonId: lesson.id,
        status: 'completed',
        attempts: 0,
        correct: 0,
        bestAccuracy: 100,
        completedAt: now,
      }
      newProgress[lesson.id] = entry
      void persistProgressEntry(user.id, entry)
    }
    const updated = { ...user, progress: newProgress }
    set({ users: { ...state.users, [user.id]: updated } })
  },
}))

export { isSupabaseConfigured }

export function getNextLessonForUser(user: User) {
  return findNextLesson(COURSE, user.progress)
}

export function getLessonStatusInCourse(lessonId: string, user: User) {
  const ordered = flattenLessons(COURSE)
  const idx = ordered.findIndex((l) => l.id === lessonId)
  if (idx === -1) return 'locked' as const
  return computeLessonStatus(ordered[idx], idx, ordered, user.progress)
}
