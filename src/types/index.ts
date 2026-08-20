// Modelo de dados da plataforma. Mesmo rodando hoje sobre localStorage,
// os formatos abaixo espelham as entidades que iriam para o Postgres/Supabase
// (User, Level, Unit, Lesson, Exercise, UserProgress, Achievement, League, Subscription).

export type ExerciseType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'sentence_order'
  | 'match_pairs'
  | 'listening'
  | 'speaking'
  | 'translation'
  | 'true_false'
  | 'dialogue'

export interface ExerciseOption {
  id: string
  label: string
  imageEmoji?: string
}

export interface MatchPair {
  id: string
  left: string
  right: string
}

export interface Exercise {
  id: string
  lessonId: string
  type: ExerciseType
  prompt: string
  explanation: string
  audioText?: string // texto usado para TTS (Web Speech API) em listening/speaking
  imageEmoji?: string
  options?: ExerciseOption[]
  correctOptionId?: string
  correctText?: string
  acceptableAnswers?: string[]
  words?: string[] // banco de palavras para sentence_order
  correctOrder?: string[]
  pairs?: MatchPair[]
  dialogueLine?: string
}

export interface Lesson {
  id: string
  unitId: string
  order: number
  title: string
  type: 'lesson' | 'checkpoint' | 'level_test'
  theory?: { title: string; body: string; examples: { en: string; pt: string }[] }
  exercises: Exercise[]
  xpReward: number
}

export interface Unit {
  id: string
  levelId: string
  order: number
  title: string
  objective: string
  lessons: Lesson[]
  hasLevelTest?: boolean
}

export interface Level {
  id: string
  order: number
  code: 'A0' | 'A1' | 'A2' | 'B1' | 'B2'
  title: string
  description: string
  units: Unit[]
}

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface UserProgressEntry {
  lessonId: string
  status: LessonStatus
  attempts: number
  correct: number
  bestAccuracy: number
  completedAt?: string
}

export type Rank = 'Iniciante' | 'Curioso' | 'Dedicado' | 'Fluente' | 'Mestre'

export type LeagueTier = 'Bronze' | 'Prata' | 'Ouro' | 'Diamante'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  criterion: string
}

export interface UserAchievement {
  achievementId: string
  earnedAt: string
}

export type DailyGoal = 'casual' | 'regular' | 'serio' | 'intenso'

export const DAILY_GOAL_XP: Record<DailyGoal, number> = {
  casual: 10,
  regular: 20,
  serio: 30,
  intenso: 50,
}

export type InterfaceLocale = 'pt' | 'en'

export interface User {
  id: string
  name: string
  email: string
  avatarEmoji: string
  avatarPhotoUrl?: string
  bio?: string
  createdAt: string
  isAdmin: boolean
  onboarded: boolean
  reasonToLearn?: string
  dailyGoal: DailyGoal
  interfaceLocale: InterfaceLocale
  xpTotal: number
  coins: number
  streakCurrent: number
  streakRecord: number
  lastStudyDate?: string
  streakFreezeCount: number
  livesCurrent: number
  livesMax: number
  livesLastRefillAt?: string
  league: LeagueTier
  xpThisWeek: number
  weekStartDate: string
  progress: Record<string, UserProgressEntry>
  achievements: UserAchievement[]
  ownedCosmetics: string[]
}

export interface CustomLessonDraft {
  id: string
  title: string
  unitTitle: string
  createdAt: string
  exercises: Exercise[]
}

/** Item da fila de revisão espaçada: uma questão que o aluno errou e vai revisar de novo depois. */
export interface ReviewItem {
  exerciseId: string
  lessonId: string
  intervalStage: number
  nextReviewDate: string
}

export interface RankingEntry {
  userId: string
  name: string
  avatarEmoji: string
  avatarPhotoUrl?: string
  xpThisWeek: number
  isCurrentUser?: boolean
}

/** Linha crua vinda da view pública `leaderboard` — só dados seguros para expor a outros alunos. */
export interface LeaderboardRow {
  id: string
  name: string
  avatarEmoji: string
  avatarPhotoUrl?: string
  league: LeagueTier
  xpThisWeek: number
  weekStartDate: string
}

/** Perfil público de outro aluno (busca, amigos, visualização) — nunca inclui e-mail. */
export interface PublicProfile {
  id: string
  name: string
  avatarEmoji: string
  avatarPhotoUrl?: string
  bio?: string
  streakCurrent: number
  league: LeagueTier
  achievements: { id: string; name: string; icon: string }[]
}

export type FriendshipStatus = 'pending' | 'accepted'

export interface Friendship {
  id: string
  requesterId: string
  addresseeId: string
  status: FriendshipStatus
  createdAt: string
}
