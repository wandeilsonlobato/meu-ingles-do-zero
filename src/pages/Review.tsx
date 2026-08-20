import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { ReviewRunner } from '../components/exercises/ReviewRunner'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { COURSE } from '../data/course'
import { dueReviewItems } from '../lib/review'
import { findExerciseById } from '../lib/progress'
import { todayLocalDate } from '../lib/auth'
import { useT } from '../lib/i18n'
import { CatMascot } from '../components/mascot/CatMascot'
import type { Exercise } from '../types'

export default function Review() {
  const navigate = useNavigate()
  const t = useT()
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
        <div className="mb-3 flex justify-center">
          <CatMascot pose="celebrate" size={120} />
        </div>
        <h1 className="mb-1 text-2xl font-extrabold text-slate-800">{t('review.completeTitle')}</h1>
        <p className="mb-6 text-slate-500">{t('review.completeBody', { count: dueExercises.length })}</p>
        <Button onClick={() => navigate('/app')}>{t('review.backToTrail')}</Button>
      </div>
    )
  }

  if (dueExercises.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <Card className="p-8">
          <div className="mb-3 flex justify-center">
            <CatMascot pose="sit" size={100} />
          </div>
          <h1 className="mb-1 text-xl font-extrabold text-slate-800">{t('review.nothingTitle')}</h1>
          <p className="mb-6 text-slate-500">
            {reviewQueue.length > 0 ? t('review.nothingDue') : t('review.nothingEver')}
          </p>
          <Button variant="secondary" onClick={() => navigate('/app')}>
            {t('review.backToTrail')}
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
          aria-label={t('lesson.exitLesson')}
        >
          <X size={20} />
        </button>
        <span className="flex items-center gap-1 text-sm font-semibold text-slate-500">
          <RotateCcw size={16} />
          {t('review.title')}
        </span>
      </div>
      <ReviewRunner exercises={dueExercises} onDone={() => setDone(true)} />
    </div>
  )
}
