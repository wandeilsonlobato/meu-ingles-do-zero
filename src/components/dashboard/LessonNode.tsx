import { Award, Check, Lock, Star, Trophy } from 'lucide-react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import type { Lesson, LessonStatus } from '../../types'
import { useT } from '../../lib/i18n'

function nodeIcon(lesson: Lesson, status: LessonStatus) {
  if (status === 'completed') return <Check size={22} />
  if (lesson.type === 'level_test') return <Trophy size={22} />
  if (lesson.type === 'checkpoint') return <Award size={22} />
  return <Star size={20} />
}

export function LessonNode({
  lesson,
  status,
  isNext,
}: {
  lesson: Lesson
  status: LessonStatus
  isNext?: boolean
}) {
  const navigate = useNavigate()
  const t = useT()
  const locked = status === 'locked'

  return (
    <div className="relative h-16 w-16">
      {isNext && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-brand-600 px-3 py-1 text-xs font-extrabold tracking-wide text-white shadow-md animate-bounce">
          {t('dashboard.startBadge')}
          <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-brand-600" />
        </span>
      )}
      <button
        type="button"
        disabled={locked}
        onClick={() => navigate(`/app/licao/${lesson.id}`)}
        className={clsx(
          'flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-lg transition-transform disabled:cursor-not-allowed disabled:opacity-60',
          !locked && 'hover:scale-105 active:scale-95',
          status === 'completed' && 'border-progress-600 bg-gradient-to-b from-progress-400 to-progress-600 text-white',
          status === 'available' && 'border-brand-600 bg-gradient-to-b from-brand-400 to-brand-600 text-white animate-pop',
          status === 'in_progress' && 'border-glow-500 bg-gradient-to-b from-glow-300 to-glow-500 text-white',
          locked && 'border-slate-300 dark:border-slate-600 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-400 dark:text-slate-500',
        )}
        aria-label={lesson.title}
      >
        {locked ? <Lock size={20} /> : nodeIcon(lesson, status)}
      </button>
      <span className="absolute left-1/2 top-full mt-1.5 w-24 -translate-x-1/2 text-center text-xs font-semibold leading-tight text-slate-500 dark:text-slate-400">
        {lesson.title}
      </span>
    </div>
  )
}
