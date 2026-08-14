import type { ExerciseComponentProps } from './types'
import { ChoiceOptions } from './ChoiceOptions'

export function MultipleChoiceExercise({ exercise, onAnswer }: ExerciseComponentProps) {
  return (
    <div>
      <p className="mb-5 text-xl font-bold text-slate-800">{exercise.prompt}</p>
      {exercise.imageEmoji && <div className="mb-4 text-5xl">{exercise.imageEmoji}</div>}
      <ChoiceOptions
        options={exercise.options ?? []}
        correctOptionId={exercise.correctOptionId ?? ''}
        onCheck={onAnswer}
      />
    </div>
  )
}
