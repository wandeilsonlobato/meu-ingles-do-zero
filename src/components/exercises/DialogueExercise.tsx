import type { ExerciseComponentProps } from './types'
import { ChoiceOptions } from './ChoiceOptions'

export function DialogueExercise({ exercise, onAnswer }: ExerciseComponentProps) {
  return (
    <div>
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">{exercise.prompt}</p>
      <div className="mb-6 flex items-start gap-3">
        <span className="text-3xl">🧑</span>
        <div className="rounded-2xl rounded-tl-none bg-slate-100 px-4 py-3 text-lg font-semibold text-slate-800">
          {exercise.dialogueLine}
        </div>
      </div>
      <ChoiceOptions
        options={exercise.options ?? []}
        correctOptionId={exercise.correctOptionId ?? ''}
        onCheck={onAnswer}
      />
    </div>
  )
}
