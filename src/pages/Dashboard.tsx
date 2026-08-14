import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Play, RotateCcw } from 'lucide-react'
import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import { COURSE } from '../data/course'
import { flattenLessons, isLevelUnlocked, lessonStatus, levelCompletionPct } from '../lib/progress'
import { getNextLessonForUser } from '../store/useAppStore'
import { LessonNode } from '../components/dashboard/LessonNode'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { dueReviewItems } from '../lib/review'
import { todayLocalDate } from '../lib/auth'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.currentUser())
  const reviewQueue = useAppStore((s) => s.reviewQueue)
  const loadReviewQueue = useAppStore((s) => s.loadReviewQueue)

  useEffect(() => {
    loadReviewQueue()
  }, [loadReviewQueue])

  if (!user) return null

  const orderedLessons = flattenLessons(COURSE)
  const nextLesson = getNextLessonForUser(user)
  const dueCount = dueReviewItems(reviewQueue, todayLocalDate()).length

  return (
    <div>
      <Card className="mb-6 flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
        <div>
          <p className="text-sm font-semibold text-slate-400">Continue de onde parou</p>
          <h1 className="text-xl font-extrabold text-slate-800">{nextLesson ? nextLesson.title : 'Trilha concluída!'}</h1>
        </div>
        {nextLesson && (
          <Button
            icon={<Play size={18} />}
            disabled={user.livesCurrent <= 0}
            onClick={() => navigate(`/app/licao/${nextLesson.id}`)}
          >
            {user.livesCurrent <= 0 ? 'Sem corações' : 'Continuar'}
          </Button>
        )}
      </Card>

      {dueCount > 0 && (
        <Card className="mb-6 flex flex-col items-center justify-between gap-4 border-glow-200 bg-glow-50 p-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <RotateCcw className="text-glow-600" size={24} />
            <div>
              <p className="font-extrabold text-slate-800">
                {dueCount} {dueCount === 1 ? 'item' : 'itens'} para revisar hoje
              </p>
              <p className="text-sm text-slate-500">Reforce o que você errou antes — não gasta corações.</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate('/app/revisao')}>
            Revisar agora
          </Button>
        </Card>
      )}

      {COURSE.map((level) => {
        const unlocked = isLevelUnlocked(level, COURSE, user.progress)
        const pct = levelCompletionPct(level, user.progress)
        const hasContent = level.units.length > 0

        return (
          <section key={level.id} className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-500">Nível {level.code}</p>
                <h2 className="text-lg font-extrabold text-slate-800">{level.title}</h2>
                <p className="text-sm text-slate-500">{level.description}</p>
              </div>
              {!unlocked && <Lock className="text-slate-300" size={24} />}
            </div>

            {unlocked && hasContent && <ProgressBar value={pct} max={100} className="mb-6" />}

            {!unlocked && (
              <Card className="p-6 text-center text-slate-400">
                Conclua a prova do nível anterior para desbloquear.
              </Card>
            )}

            {unlocked && !hasContent && (
              <Card className="p-6 text-center text-slate-400">Conteúdo deste nível em construção. Volte em breve!</Card>
            )}

            {unlocked &&
              hasContent &&
              level.units.map((unit) => (
                <div key={unit.id} className="mb-8">
                  <h3 className="mb-4 text-center text-sm font-bold text-slate-500">{unit.title}</h3>
                  <div className="flex flex-col items-center gap-6">
                    {unit.lessons.map((lesson) => {
                      const idx = orderedLessons.findIndex((l) => l.id === lesson.id)
                      const status = lessonStatus(lesson, idx, orderedLessons, user.progress)
                      return <LessonNode key={lesson.id} lesson={lesson} status={status} index={lesson.order} />
                    })}
                  </div>
                </div>
              ))}
          </section>
        )
      })}

      <p className={clsx('text-center text-sm text-slate-400', COURSE.length === 0 && 'hidden')}>
        Mais níveis e unidades chegando em breve. 🚀
      </p>
    </div>
  )
}
