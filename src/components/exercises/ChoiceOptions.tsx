import { useState } from 'react'
import clsx from 'clsx'
import type { ExerciseOption } from '../../types'
import { Button } from '../ui/Button'

interface ChoiceOptionsProps {
  options: ExerciseOption[]
  correctOptionId: string
  onCheck: (correct: boolean) => void
}

/**
 * Lista de opções de escolha reutilizada por múltipla escolha, escuta,
 * verdadeiro/falso e diálogo. O host (ExerciseRunner) usa `key={exercise.id}-{attempt}`
 * para remontar este componente e resetar a seleção a cada nova tentativa.
 */
export function ChoiceOptions({ options, correctOptionId, onCheck }: ChoiceOptionsProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  function check() {
    if (!selected) return
    setChecked(true)
    onCheck(selected === correctOptionId)
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const isSelected = selected === opt.id
          const isCorrectOpt = opt.id === correctOptionId
          const showState = checked && (isSelected || isCorrectOpt)
          return (
            <button
              key={opt.id}
              type="button"
              disabled={checked}
              onClick={() => setSelected(opt.id)}
              className={clsx(
                'flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-semibold transition-colors',
                !checked && isSelected && 'border-brand-500 bg-brand-50',
                !checked && !isSelected && 'border-slate-200 bg-white hover:border-brand-200',
                showState && isCorrectOpt && 'border-progress-500 bg-progress-50 text-progress-700',
                showState && isSelected && !isCorrectOpt && 'border-heart-500 bg-heart-500/10 text-heart-600',
              )}
            >
              {opt.imageEmoji && <span className="text-2xl">{opt.imageEmoji}</span>}
              {opt.label}
            </button>
          )
        })}
      </div>
      {!checked && (
        <Button className="mt-4" onClick={check} disabled={!selected}>
          Verificar
        </Button>
      )}
    </div>
  )
}
