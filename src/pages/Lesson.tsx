import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { COURSE } from '../data/course'
import type { Exercise } from '../types'
import { ExerciseRunner } from '../components/exercises/ExerciseRunner'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAppStore } from '../store/useAppStore'

export default function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const submitLessonAttempt = useAppStore((s) => s.submitLessonAttempt)
  const [started, setStarted] = useState(false)

  const lesson = COURSE.flatMap((l) => l.units).flatMap((u) => u.lessons).find((l) => l.id === lessonId)

  if (!lesson) {
    return (
      <div className="text-center">
        <p className="mb-4 text-slate-500">Lição não encontrada.</p>
        <Button onClick={() => navigate('/app')}>Voltar à trilha</Button>
      </div>
    )
  }

  function handleComplete(correctCount: number, totalCount: number, wrongExercises: Exercise[]) {
    if (!lesson) return
    const result = submitLessonAttempt(lesson.id, correctCount, totalCount, lesson.xpReward)
    navigate(`/app/licao/${lesson.id}/resultado`, { state: { ...result, wrongExercises }, replace: true })
  }

  if (!started && lesson.theory) {
    return (
      <div className="mx-auto max-w-xl">
        <button
          onClick={() => navigate('/app')}
          className="mb-4 flex items-center gap-1 text-slate-400 hover:text-slate-600"
          aria-label="Sair da lição"
        >
          <X size={20} />
        </button>
        <Card className="p-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-500">Explicação</p>
          <h1 className="mb-4 text-2xl font-extrabold text-slate-800">{lesson.theory.title}</h1>
          <p className="mb-5 leading-relaxed text-slate-600">{lesson.theory.body}</p>
          <div className="mb-6 flex flex-col gap-2">
            {lesson.theory.examples.map((ex) => (
              <div key={ex.en} className="rounded-xl bg-brand-50 px-4 py-3">
                <p className="font-bold text-brand-800">{ex.en}</p>
                <p className="text-sm text-slate-500">{ex.pt}</p>
              </div>
            ))}
          </div>
          <Button fullWidth onClick={() => setStarted(true)}>
            Começar exercícios
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/app')}
        className="mb-4 flex items-center gap-1 text-slate-400 hover:text-slate-600"
        aria-label="Sair da lição"
      >
        <X size={20} />
      </button>
      <ExerciseRunner lesson={lesson} onComplete={handleComplete} onOutOfHearts={() => navigate('/app')} />
    </div>
  )
}
