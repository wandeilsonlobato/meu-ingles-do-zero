import { useMemo, useState } from 'react'
import clsx from 'clsx'
import type { ExerciseComponentProps } from './types'

interface Tile {
  id: string
  text: string
  side: 'left' | 'right'
  pairId: string
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function MatchPairsExercise({ exercise, onAnswer }: ExerciseComponentProps) {
  const pairs = exercise.pairs ?? []
  const leftTiles = useMemo(
    () => shuffle(pairs.map((p): Tile => ({ id: `L-${p.id}`, text: p.left, side: 'left', pairId: p.id }))),
    [pairs],
  )
  const rightTiles = useMemo(
    () => shuffle(pairs.map((p): Tile => ({ id: `R-${p.id}`, text: p.right, side: 'right', pairId: p.id }))),
    [pairs],
  )

  const [selectedLeft, setSelectedLeft] = useState<Tile | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrongFlash, setWrongFlash] = useState<string | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [done, setDone] = useState(false)

  function pickLeft(tile: Tile) {
    if (matched.has(tile.pairId) || done) return
    setSelectedLeft(tile)
  }

  function pickRight(tile: Tile) {
    if (!selectedLeft || matched.has(tile.pairId) || done) return
    if (selectedLeft.pairId === tile.pairId) {
      const newMatched = new Set(matched)
      newMatched.add(tile.pairId)
      setMatched(newMatched)
      setSelectedLeft(null)
      if (newMatched.size === pairs.length) {
        setDone(true)
        onAnswer(mistakes === 0)
      }
    } else {
      setMistakes((m) => m + 1)
      setWrongFlash(tile.id)
      setTimeout(() => setWrongFlash(null), 400)
      setSelectedLeft(null)
    }
  }

  return (
    <div>
      <p className="mb-5 text-xl font-bold text-slate-800">{exercise.prompt}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {leftTiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              disabled={matched.has(tile.pairId)}
              onClick={() => pickLeft(tile)}
              className={clsx(
                'rounded-xl border-2 px-3 py-2 text-left font-semibold transition-colors',
                matched.has(tile.pairId) && 'border-progress-500 bg-progress-50 text-progress-700 opacity-60',
                !matched.has(tile.pairId) && selectedLeft?.id === tile.id && 'border-brand-500 bg-brand-50',
                !matched.has(tile.pairId) && selectedLeft?.id !== tile.id && 'border-slate-200 bg-white hover:border-brand-200',
              )}
            >
              {tile.text}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {rightTiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              disabled={matched.has(tile.pairId)}
              onClick={() => pickRight(tile)}
              className={clsx(
                'rounded-xl border-2 px-3 py-2 text-left font-semibold transition-colors',
                matched.has(tile.pairId) && 'border-progress-500 bg-progress-50 text-progress-700 opacity-60',
                wrongFlash === tile.id && 'animate-shake border-heart-500 bg-heart-500/10',
                matched.has(tile.pairId) === false && wrongFlash !== tile.id && 'border-slate-200 bg-white hover:border-brand-200',
              )}
            >
              {tile.text}
            </button>
          ))}
        </div>
      </div>
      {done && (
        <p className="mt-4 font-semibold text-progress-700">
          Todas as duplas encontradas{mistakes > 0 ? ` (com ${mistakes} tentativa(s) errada(s))` : ''}!
        </p>
      )}
      {!done && <p className="mt-4 text-sm text-slate-400">Combine todas as duplas para continuar.</p>}
    </div>
  )
}
