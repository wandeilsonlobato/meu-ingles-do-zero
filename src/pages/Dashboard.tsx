import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Play, RotateCcw } from 'lucide-react'
import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import { COURSE } from '../data/course'
import { flattenLessons, isLevelUnlocked, lessonStatus, levelCompletionPct } from '../lib/progress'
import { getNextLessonForUser } from '../store/useAppStore'
import { LessonTrail } from '../components/dashboard/LessonTrail'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { dueReviewItems } from '../lib/review'
import { todayLocalDate } from '../lib/auth'
import { useT } from '../lib/i18n'

const ZONE_STYLES = [
  'from-brand-50 dark:from-brand-900/20 border-brand-100 dark:border-brand-800',
  'from-progress-50 dark:from-progress-900/20 border-progress-100 dark:border-progress-800',
  'from-glow-50 dark:from-glow-900/20 border-glow-100 dark:border-glow-800',
]

export default function Dashboard() {
  const navigate = useNavigate()
  const t = useT()
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
      <Card elevation="raised" className="mb-6 flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
        <div>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">{t('dashboard.continueFrom')}</p>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{nextLesson ? nextLesson.title : t('dashboard.trailComplete')}</h1>
        </div>
        {nextLesson && (
          <Button
            icon={<Play size={18} />}
            disabled={user.livesCurrent <= 0}
            onClick={() => navigate(`/app/licao/${nextLesson.id}`)}
          >
            {user.livesCurrent <= 0 ? t('dashboard.noHearts') : t('dashboard.continueButton')}
          </Button>
        )}
      </Card>

      {dueCount > 0 && (
        <Card className="mb-6 flex flex-col items-center justify-between gap-4 border-glow-200 dark:border-glow-800 bg-glow-50 dark:bg-glow-900/30 p-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <RotateCcw className="text-glow-600 dark:text-glow-400" size={24} />
            <div>
              <p className="font-extrabold text-slate-800 dark:text-slate-100">
                {dueCount} {dueCount === 1 ? t('dashboard.reviewDueItem') : t('dashboard.reviewDueItems')} {t('dashboard.reviewDueSuffix')}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.reviewDueSubtitle')}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate('/app/revisao')}>
            {t('dashboard.reviewNow')}
          </Button>
        </Card>
      )}

      {COURSE.map((level, levelIndex) => {
        const unlocked = isLevelUnlocked(level, COURSE, user.progress)
        const pct = levelCompletionPct(level, user.progress)
        const hasContent = level.units.length > 0
        const zone = ZONE_STYLES[levelIndex % ZONE_STYLES.length]

        return (
          <section
            key={level.id}
            className={clsx('mb-10 rounded-3xl border-2 bg-gradient-to-b to-white dark:to-slate-900 p-6', zone, !unlocked && 'from-slate-50 dark:from-slate-800/60 border-slate-200 dark:border-slate-700')}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-500">{t('dashboard.level')} {level.code}</p>
                <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{level.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{level.description}</p>
              </div>
              {!unlocked && <Lock className="text-slate-300 dark:text-slate-600" size={24} />}
            </div>

            {unlocked && hasContent && <ProgressBar value={pct} max={100} className="mb-6" />}

            {!unlocked && (
              <Card className="p-6 text-center text-slate-400 dark:text-slate-500">{t('dashboard.lockedMessage')}</Card>
            )}

            {unlocked && !hasContent && (
              <Card className="p-6 text-center text-slate-400 dark:text-slate-500">{t('dashboard.inConstruction')}</Card>
            )}

            {unlocked &&
              hasContent &&
              level.units.map((unit) => {
                const trailItems = unit.lessons.map((lesson) => {
                  const idx = orderedLessons.findIndex((l) => l.id === lesson.id)
                  const status = lessonStatus(lesson, idx, orderedLessons, user.progress)
                  return { lesson, status, isNext: lesson.id === nextLesson?.id }
                })
                return (
                  <div key={unit.id} className="mb-8">
                    <h3 className="mb-4 text-center text-sm font-bold text-slate-500 dark:text-slate-400">{unit.title}</h3>
                    <LessonTrail items={trailItems} />
                  </div>
                )
              })}
          </section>
        )
      })}

      <p className={clsx('text-center text-sm text-slate-400 dark:text-slate-500', COURSE.length === 0 && 'hidden')}>
        {t('dashboard.moreComingSoon')}
      </p>
    </div>
  )
}
