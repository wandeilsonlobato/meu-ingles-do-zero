import type { Achievement, Exercise, Level, Lesson, LessonStatus, User, UserProgressEntry } from '../types'

/** Retorna todas as lições de todos os níveis, na ordem de estudo. */
export function flattenLessons(levels: Level[]): Lesson[] {
  return levels
    .slice()
    .sort((a, b) => a.order - b.order)
    .flatMap((level) =>
      level.units
        .slice()
        .sort((a, b) => a.order - b.order)
        .flatMap((unit) => unit.lessons.slice().sort((a, b) => a.order - b.order)),
    )
}

/** Status de uma lição: a primeira é sempre liberada; as demais liberam ao concluir a anterior. */
export function lessonStatus(
  lesson: Lesson,
  index: number,
  orderedLessons: Lesson[],
  progress: Record<string, UserProgressEntry>,
): LessonStatus {
  const entry = progress[lesson.id]
  if (entry?.status === 'completed') return 'completed'
  if (index === 0) return entry?.status === 'in_progress' ? 'in_progress' : 'available'
  const previous = orderedLessons[index - 1]
  const previousDone = progress[previous.id]?.status === 'completed'
  if (!previousDone) return 'locked'
  return entry?.status === 'in_progress' ? 'in_progress' : 'available'
}

export function isLevelUnlocked(
  level: Level,
  levels: Level[],
  progress: Record<string, UserProgressEntry>,
): boolean {
  const sorted = levels.slice().sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex((l) => l.id === level.id)
  if (idx <= 0) return true
  const previousLevel = sorted[idx - 1]
  const previousLessons = previousLevel.units.flatMap((u) => u.lessons)
  if (previousLessons.length === 0) return false
  const levelTest = previousLessons.find((l) => l.type === 'level_test')
  const target = levelTest ?? previousLessons[previousLessons.length - 1]
  return progress[target.id]?.status === 'completed'
}

export function levelCompletionPct(level: Level, progress: Record<string, UserProgressEntry>): number {
  const lessons = level.units.flatMap((u) => u.lessons)
  if (lessons.length === 0) return 0
  const done = lessons.filter((l) => progress[l.id]?.status === 'completed').length
  return Math.round((done / lessons.length) * 100)
}

export function findNextLesson(levels: Level[], progress: Record<string, UserProgressEntry>): Lesson | null {
  const ordered = flattenLessons(levels)
  for (let i = 0; i < ordered.length; i++) {
    const status = lessonStatus(ordered[i], i, ordered, progress)
    if (status !== 'completed') return ordered[i]
  }
  return ordered.length ? ordered[ordered.length - 1] : null
}

/** Encontra um exercício e a lição a que ele pertence pelo id do exercício. */
export function findExerciseById(levels: Level[], exerciseId: string): { exercise: Exercise; lesson: Lesson } | null {
  for (const lesson of flattenLessons(levels)) {
    const exercise = lesson.exercises.find((e) => e.id === exerciseId)
    if (exercise) return { exercise, lesson }
  }
  return null
}

export function checkNewAchievements(
  user: User,
  achievements: Achievement[],
  context: { wordsLearned: number; perfectSpeakingExercise: boolean; levelJustCompletedCode?: string },
): Achievement[] {
  const already = new Set(user.achievements.map((a) => a.achievementId))
  const unlocked: Achievement[] = []

  const maybeUnlock = (id: string, condition: boolean) => {
    if (condition && !already.has(id)) {
      const achievement = achievements.find((a) => a.id === id)
      if (achievement) unlocked.push(achievement)
    }
  }

  maybeUnlock('streak-7', user.streakCurrent >= 7)
  maybeUnlock('streak-30', user.streakCurrent >= 30)
  maybeUnlock('words-100', context.wordsLearned >= 100)
  maybeUnlock('perfect-pronunciation', context.perfectSpeakingExercise)
  maybeUnlock('level-a1-complete', context.levelJustCompletedCode === 'A1')
  maybeUnlock('first-lesson', Object.values(user.progress).some((p) => p.status === 'completed'))

  return unlocked
}
