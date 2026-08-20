import { Award, Check, Lock, Star, Trophy } from 'lucide-react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import type { Lesson, LessonStatus } from '../../types'

const SIDE_OFFSET = ['ml-0', 'ml-7', 'ml-10', 'ml-7'] as const

function nodeIcon(lesson: Lesson, status: LessonStatus) {
  if (status === 'completed') return <Check size={22} />
  if (lesson.type === 'level_test') return <Trophy size={22} />
  if (lesson.type === 'checkpoint') return <Award size={22} />
  return <Star size={20} />
}

export function LessonNode({
  lesson,
  status,
  index,
}: {
  lesson: Lesson
  status: LessonStatus
  index: number
}) {
  const navigate = useNavigate()
  const offset = SIDE_OFFSET[index % SIDE_OFFSET.length]
  const locked = status === 'locked'

  return (
    <div className={clsx('relative z-10 flex flex-col items-center gap-1', offset)}>
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
      <span className="max-w-20 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">{lesson.title}</span>
    </div>
  )
}
