import { useState } from 'react'
import clsx from 'clsx'
import type { ExerciseComponentProps } from './types'
import { Button } from '../ui/Button'

interface WordTile {
  key: string
  word: string
}

export function SentenceOrderExercise({ exercise, onAnswer }: ExerciseComponentProps) {
  const initialBank: WordTile[] = (exercise.words ?? []).map((word, i) => ({ key: `${word}-${i}`, word }))
  const [bank, setBank] = useState<WordTile[]>(initialBank)
  const [answer, setAnswer] = useState<WordTile[]>([])
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)

  function moveToAnswer(tile: WordTile) {
    if (checked) return
    setBank((b) => b.filter((t) => t.key !== tile.key))
    setAnswer((a) => [...a, tile])
  }

  function moveToBank(tile: WordTile) {
    if (checked) return
    setAnswer((a) => a.filter((t) => t.key !== tile.key))
    setBank((b) => [...b, tile])
  }

  function check() {
    if (answer.length === 0) return
    const isCorrect = JSON.stringify(answer.map((t) => t.word)) === JSON.stringify(exercise.correctOrder ?? [])
    setChecked(true)
    setCorrect(isCorrect)
    onAnswer(isCorrect)
  }

  return (
    <div>
      <p className="mb-5 text-xl font-bold text-slate-800">{exercise.prompt}</p>

      <div
        className={clsx(
          'mb-4 flex min-h-16 flex-wrap gap-2 rounded-2xl border-2 border-dashed p-3',
          !checked && 'border-slate-300 bg-slate-50',
          checked && correct && 'border-progress-500 bg-progress-50',
          checked && !correct && 'border-heart-500 bg-heart-500/10',
        )}
      >
        {answer.length === 0 && <span className="text-slate-400">Toque nas palavras abaixo para montar a frase</span>}
        {answer.map((tile) => (
          <button
            key={tile.key}
            type="button"
            disabled={checked}
            onClick={() => moveToBank(tile)}
            className="rounded-xl border-2 border-brand-300 bg-white px-3 py-2 font-bold text-brand-700 shadow-sm"
          >
            {tile.word}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {bank.map((tile) => (
          <button
            key={tile.key}
            type="button"
            disabled={checked}
            onClick={() => moveToAnswer(tile)}
            className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 font-bold text-slate-700 shadow-sm hover:border-brand-300"
          >
            {tile.word}
          </button>
        ))}
      </div>

      {!checked && (
        <Button onClick={check} disabled={answer.length === 0}>
          Verificar
        </Button>
      )}
      {checked && !correct && (
        <p className="mt-3 font-semibold text-slate-600">
          Ordem correta: <span className="text-progress-700">{(exercise.correctOrder ?? []).join(' ')}</span>
        </p>
      )}
    </div>
  )
}
