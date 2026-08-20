import type { ExerciseComponentProps } from './types'
import { ChoiceOptions } from './ChoiceOptions'

export function TrueFalseExercise({ exercise, onAnswer }: ExerciseComponentProps) {
  return (
    <div>
      <p className="mb-5 text-xl font-bold text-slate-800 dark:text-slate-100">{exercise.prompt}</p>
      <ChoiceOptions
        options={exercise.options ?? []}
        correctOptionId={exercise.correctOptionId ?? ''}
        onCheck={onAnswer}
      />
    </div>
  )
}
