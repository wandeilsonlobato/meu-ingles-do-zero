import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PartyPopper, RotateCcw, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { ReviewRunner } from '../components/exercises/ReviewRunner'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { COURSE } from '../data/course'
import { dueReviewItems } from '../lib/review'
import { findExerciseById } from '../lib/progress'
import { todayLocalDate } from '../lib/auth'
import type { Exercise } from '../types'

export default function Review() {
  const navigate = useNavigate()
  const reviewQueue = useAppStore((s) => s.reviewQueue)
  const loadReviewQueue = useAppStore((s) => s.loadReviewQueue)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    loadReviewQueue().finally(() => setLoading(false))
  }, [loadReviewQueue])

  const dueExercises = useMemo<Exercise[]>(() => {
    const due = dueReviewItems(reviewQueue, todayLocalDate())
    return due
      .map((item) => findExerciseById(COURSE, item.exerciseId)?.exercise)
      .filter((e): e is Exercise => Boolean(e))
  }, [reviewQueue])

  if (loading) return null

  if (done) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="mb-3 text-6xl">🎉</div>
        <h1 className="mb-1 text-2xl font-extrabold text-slate-800">Revisão concluída!</h1>
        <p className="mb-6 text-slate-500">Você reforçou {dueExercises.length} ponto(s) que tinha errado antes.</p>
        <Button onClick={() => navigate('/app')}>Voltar à trilha</Button>
      </div>
    )
  }

  if (dueExercises.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <Card className="p-8">
          <PartyPopper className="mx-auto mb-3 text-glow-500" size={40} />
          <h1 className="mb-1 text-xl font-extrabold text-slate-800">Nada para revisar hoje!</h1>
          <p className="mb-6 text-slate-500">
            {reviewQueue.length > 0
              ? 'Seus próximos itens de revisão ainda não venceram. Volte outro dia.'
              : 'Assim que você errar um exercício, ele entra aqui para você reforçar depois — com intervalos crescentes, como um sistema de repetição espaçada.'}
          </p>
          <Button variant="secondary" onClick={() => navigate('/app')}>
            Voltar à trilha
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600"
          aria-label="Sair da revisão"
        >
          <X size={20} />
        </button>
        <span className="flex items-center gap-1 text-sm font-semibold text-slate-500">
          <RotateCcw size={16} />
          Revisão de erros
        </span>
      </div>
      <ReviewRunner exercises={dueExercises} onDone={() => setDone(true)} />
    </div>
  )
}
