import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import clsx from 'clsx'
import type { Exercise } from '../../types'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { useAppStore } from '../../store/useAppStore'
import { useT } from '../../lib/i18n'
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

interface ReviewRunnerProps {
  exercises: Exercise[]
  onDone: () => void
}

/**
 * Sessão de revisão: mesmos componentes de exercício da lição normal, mas sem
 * gastar corações (é prática extra) e com XP reduzido por item.
 */
export function ReviewRunner({ exercises, onDone }: ReviewRunnerProps) {
  const t = useT()
  const resolveReviewCorrect = useAppStore((s) => s.resolveReviewCorrect)
  const resolveReviewWrong = useAppStore((s) => s.resolveReviewWrong)

  const [index, setIndex] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)

  const exercise = exercises[index]
  const ExerciseComponent = EXERCISE_COMPONENTS[exercise.type]

  function handleAnswer(correct: boolean) {
    setAnswered(true)
    setLastCorrect(correct)
    if (correct) resolveReviewCorrect(exercise.id)
    else resolveReviewWrong(exercise.id)
  }

  function goNext() {
    if (index + 1 >= exercises.length) {
      onDone()
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

  return (
    <div className="mx-auto max-w-xl">
      <ProgressBar value={index + (answered && lastCorrect ? 1 : 0)} max={exercises.length} className="mb-6" />

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <ExerciseComponent
          key={`${exercise.id}-${attempt}`}
          exercise={exercise}
          onAnswer={handleAnswer}
          answered={answered}
          wasCorrect={lastCorrect}
        />
      </div>

      {answered && (
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
    </div>
  )
}
