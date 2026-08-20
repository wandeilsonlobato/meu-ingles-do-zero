import { Volume2 } from 'lucide-react'
import { useEffect } from 'react'
import type { ExerciseComponentProps } from './types'
import { ChoiceOptions } from './ChoiceOptions'
import { speak } from '../../lib/speech'

export function ListeningExercise({ exercise, onAnswer }: ExerciseComponentProps) {
  useEffect(() => {
    if (exercise.audioText) speak(exercise.audioText)
  }, [exercise.audioText])

  return (
    <div>
      <p className="mb-5 text-xl font-bold text-slate-800 dark:text-slate-100">{exercise.prompt}</p>
      <button
        type="button"
        onClick={() => exercise.audioText && speak(exercise.audioText)}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        aria-label="Ouvir novamente"
      >
        <Volume2 size={32} />
      </button>
      <ChoiceOptions
        options={exercise.options ?? []}
        correctOptionId={exercise.correctOptionId ?? ''}
        onCheck={onAnswer}
      />
    </div>
  )
}
