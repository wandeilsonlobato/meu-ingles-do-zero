import { useState } from 'react'
import clsx from 'clsx'
import type { ExerciseComponentProps } from './types'
import { Button } from '../ui/Button'
import { answerMatches } from '../../lib/text'

export function FillBlankExercise({ exercise, onAnswer }: ExerciseComponentProps) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)

  function check() {
    if (!value.trim()) return
    const isCorrect = answerMatches(value, exercise.acceptableAnswers ?? [exercise.correctText ?? ''])
    setChecked(true)
    setCorrect(isCorrect)
    onAnswer(isCorrect)
  }

  return (
    <div>
      <p className="mb-5 text-xl font-bold text-slate-800 dark:text-slate-100">{exercise.prompt}</p>
      <input
        type="text"
        value={value}
        disabled={checked}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && check()}
        placeholder="Digite sua resposta"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={clsx(
          'w-full rounded-2xl border-2 px-4 py-3 text-lg font-semibold outline-none transition-colors',
          !checked && 'border-slate-200 dark:border-slate-700 focus:border-brand-400',
          checked && correct && 'border-progress-500 bg-progress-50 dark:bg-progress-900/30 text-progress-700 dark:text-progress-300',
          checked && !correct && 'border-heart-500 bg-heart-500/10 dark:bg-heart-500/20 text-heart-600 dark:text-heart-400',
        )}
      />
      {!checked && (
        <Button className="mt-4" onClick={check} disabled={!value.trim()}>
          Verificar
        </Button>
      )}
      {checked && !correct && (
        <p className="mt-3 font-semibold text-slate-600 dark:text-slate-300">
          Resposta correta: <span className="text-progress-700 dark:text-progress-300">{exercise.correctText}</span>
        </p>
      )}
    </div>
  )
}
