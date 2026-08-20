import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Gem, PartyPopper, RotateCcw, XCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useT } from '../lib/i18n'
import type { Exercise } from '../types'

interface ResultState {
  correctCount: number
  totalCount: number
  xpEarned: number
  newAchievements: { id: string; name: string; icon: string; description: string }[]
  wrongExercises: Exercise[]
}

export default function LessonResult() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const t = useT()
  const location = useLocation()
  const state = location.state as ResultState | null

  useEffect(() => {
    if (!state) navigate('/app', { replace: true })
  }, [state, navigate])

  if (!state) return null

  const accuracyPct = state.totalCount > 0 ? Math.round((state.correctCount / state.totalCount) * 100) : 0

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mb-3 text-6xl">{accuracyPct === 100 ? '🏆' : accuracyPct >= 60 ? '🎉' : '💪'}</div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-800">
        {accuracyPct === 100 ? t('lessonResult.perfect') : t('lessonResult.complete')}
      </h1>
      <p className="mb-6 text-slate-500">
        {t('lessonResult.scoreLine', { correct: state.correctCount, total: state.totalCount, pct: accuracyPct })}
      </p>

      <Card className="mb-6 flex items-center justify-center gap-3 p-6">
        <Gem className="text-glow-500 fill-glow-400" size={28} />
        <span className="text-2xl font-extrabold text-glow-700">+{state.xpEarned} XP</span>
      </Card>

      {state.newAchievements.length > 0 && (
        <Card className="mb-6 p-6">
          <p className="mb-3 flex items-center justify-center gap-2 font-bold text-slate-700">
            <PartyPopper size={20} className="text-glow-500" />
            {t('lessonResult.newAchievement')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {state.newAchievements.map((a) => (
              <div key={a.id} className="flex flex-col items-center gap-1">
                <span className="text-4xl">{a.icon}</span>
                <span className="text-xs font-semibold text-slate-600">{a.name}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {state.wrongExercises.length > 0 && (
        <Card className="mb-6 p-6 text-left">
          <p className="mb-3 flex items-center gap-2 font-bold text-slate-700">
            <XCircle size={20} className="text-heart-500" />
            {t('lessonResult.reviewMistakesTitle')}
          </p>
          <div className="flex flex-col gap-3">
            {state.wrongExercises.map((ex) => (
              <div key={ex.id} className="rounded-xl bg-heart-500/5 px-4 py-3">
                <p className="text-sm font-semibold text-slate-700">{ex.prompt}</p>
                <p className="text-sm text-slate-500">{ex.explanation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button icon={<RotateCcw size={18} />} variant="secondary" onClick={() => navigate(`/app/licao/${lessonId}`)}>
          {t('lessonResult.practiceAgain')}
        </Button>
        <Button onClick={() => navigate('/app')}>{t('lessonResult.backToTrail')}</Button>
      </div>
    </div>
  )
}
