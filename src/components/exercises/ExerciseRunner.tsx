import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import clsx from 'clsx'
import type { Exercise, Lesson } from '../../types'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { HeartsDisplay } from '../ui/StatusBadges'
import { useAppStore } from '../../store/useAppStore'
import { useT } from '../../lib/i18n'
import { CatMascot } from '../mascot/CatMascot'
import { MultipleChoiceExercise } from './MultipleChoiceExercise'
import { FillBlankExercise } from './FillBlankExercise'
import { SentenceOrderExercise } from './SentenceOrderExercise'
import { MatchPairsExercise } from './MatchPairsExercise'
import { ListeningExercise } from './ListeningExercise'
import { SpeakingExercise } from './SpeakingExercise'
import { TranslationExercise } from './TranslationExercise'
import { TrueFalseExercise } from './TrueFalseExercise'
import { DialogueExercise } from './DialogueExercise'

const EXERCISE_COMPONENTS = {
  multiple_choice: MultipleChoiceExercise,
  fill_blank: FillBlankExercise,
  sentence_order: SentenceOrderExercise,
  match_pairs: MatchPairsExercise,
  listening: ListeningExercise,
  speaking: SpeakingExercise,
  translation: TranslationExercise,
  true_false: TrueFalseExercise,
  dialogue: DialogueExercise,
} as const

interface ExerciseRunnerProps {
  lesson: Lesson
  onComplete: (correctCount: number, totalCount: number, wrongExercises: Exercise[]) => void
  onOutOfHearts: () => void
}

export function ExerciseRunner({ lesson, onComplete, onOutOfHearts }: ExerciseRunnerProps) {
  const t = useT()
  const user = useAppStore((s) => s.currentUser())
  const loseHeartAction = useAppStore((s) => s.loseHeartAction)
  const recordMistake = useAppStore((s) => s.recordMistake)

  const [index, setIndex] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set())

  if (!user) return null

  const exercises = lesson.exercises
  const exercise: Exercise = exercises[index]
  const ExerciseComponent = EXERCISE_COMPONENTS[exercise.type]

  function handleAnswer(correct: boolean) {
    setAnswered(true)
    setLastCorrect(correct)
    if (!correct) {
      setWrongIds((prev) => new Set(prev).add(exercise.id))
      loseHeartAction()
      recordMistake(exercise.id, lesson.id)
    }
  }

  function goNext() {
    const correctCount = exercises.length - wrongIds.size
    if (index + 1 >= exercises.length) {
      const wrongExercises = exercises.filter((e) => wrongIds.has(e.id))
      onComplete(correctCount, exercises.length, wrongExercises)
      return
    }
    setIndex((i) => i + 1)
    setAttempt(0)
    setAnswered(false)
    setLastCorrect(null)
  }

  function retry() {
    setAttempt((a) => a + 1)
    setAnswered(false)
    setLastCorrect(null)
  }

  const heartsNowZero = user.livesCurrent <= 0 && answered && !lastCorrect

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center gap-4">
        <ProgressBar value={index + (answered && lastCorrect ? 1 : 0)} max={exercises.length} className="flex-1" />
        <HeartsDisplay current={user.livesCurrent} max={user.livesMax} />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <ExerciseComponent
          key={`${exercise.id}-${attempt}`}
          exercise={exercise}
          onAnswer={handleAnswer}
          answered={answered}
          wasCorrect={lastCorrect}
        />
      </div>

      {answered && !heartsNowZero && (
        <div
          className={clsx(
            'mt-4 rounded-2xl p-4',
            lastCorrect ? 'bg-progress-50 text-progress-800' : 'bg-heart-500/10 text-heart-700',
          )}
        >
          <div className="mb-1 flex items-center gap-2 font-bold">
            {lastCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {lastCorrect ? t('lesson.correct') : t('lesson.incorrect')}
          </div>
          <p className="text-sm">{exercise.explanation}</p>
          <div className="mt-3 flex gap-2">
            {lastCorrect ? (
              <Button size="sm" onClick={goNext}>
                {t('lesson.continueButton')}
              </Button>
            ) : (
              <Button size="sm" variant="secondary" onClick={retry}>
                {t('lesson.tryAgain')}
              </Button>
            )}
          </div>
        </div>
      )}

      {heartsNowZero && (
        <div className="mt-4 rounded-2xl bg-heart-500/10 p-5 text-center text-heart-700">
          <div className="mb-2 flex justify-center">
            <CatMascot pose="sad" size={90} />
          </div>
          <p className="mb-1 font-extrabold text-lg">{t('lesson.outOfHeartsTitle')}</p>
          <p className="mb-4 text-sm">{t('lesson.outOfHeartsBody')}</p>
          <Button variant="danger" size="sm" onClick={onOutOfHearts}>
            {t('lesson.backToTrail')}
          </Button>
        </div>
      )}
    </div>
  )
}
