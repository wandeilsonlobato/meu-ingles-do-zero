import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { COURSE } from '../../data/course'
import { useAppStore } from '../../store/useAppStore'
import type { Exercise, ExerciseType } from '../../types'

interface DraftExercise {
  type: Extract<ExerciseType, 'multiple_choice' | 'true_false'>
  prompt: string
  explanation: string
  options: string[]
  correctIndex: number
}

function emptyDraftExercise(): DraftExercise {
  return { type: 'multiple_choice', prompt: '', explanation: '', options: ['', ''], correctIndex: 0 }
}

export default function AdminContent() {
  const customLessonDrafts = useAppStore((s) => s.customLessonDrafts)
  const loadCustomLessonDrafts = useAppStore((s) => s.loadCustomLessonDrafts)
  const addCustomLessonDraft = useAppStore((s) => s.addCustomLessonDraft)
  const deleteCustomLessonDraft = useAppStore((s) => s.deleteCustomLessonDraft)

  useEffect(() => {
    loadCustomLessonDrafts()
  }, [loadCustomLessonDrafts])

  const [title, setTitle] = useState('')
  const [unitTitle, setUnitTitle] = useState('')
  const [exercises, setExercises] = useState<DraftExercise[]>([emptyDraftExercise()])

  function updateExercise(i: number, patch: Partial<DraftExercise>) {
    setExercises((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)))
  }

  function updateOption(exIdx: number, optIdx: number, value: string) {
    setExercises((prev) =>
      prev.map((e, idx) =>
        idx === exIdx ? { ...e, options: e.options.map((o, oi) => (oi === optIdx ? value : o)) } : e,
      ),
    )
  }

  function addOption(exIdx: number) {
    setExercises((prev) => prev.map((e, idx) => (idx === exIdx ? { ...e, options: [...e.options, ''] } : e)))
  }

  function addExercise() {
    setExercises((prev) => [...prev, emptyDraftExercise()])
  }

  function removeExercise(i: number) {
    setExercises((prev) => prev.filter((_, idx) => idx !== i))
  }

  function canSave() {
    if (!title.trim() || !unitTitle.trim() || exercises.length === 0) return false
    return exercises.every((e) => e.prompt.trim() && e.options.every((o) => o.trim()))
  }

  async function save() {
    const finalExercises: Exercise[] = exercises.map((e, i) => ({
      id: `custom-${Date.now()}-${i}`,
      lessonId: 'custom',
      type: e.type,
      prompt: e.prompt,
      explanation: e.explanation || 'Sem explicação cadastrada.',
      options: e.options.map((label, oi) => ({ id: String(oi), label })),
      correctOptionId: String(e.correctIndex),
    }))
    await addCustomLessonDraft(title, unitTitle, finalExercises)
    setTitle('')
    setUnitTitle('')
    setExercises([emptyDraftExercise()])
  }

  return (
    <AdminLayout>
      <Card className="mb-6 p-6">
        <h2 className="mb-4 font-bold text-slate-700">Trilha publicada (somente leitura)</h2>
        <div className="flex flex-col gap-4">
          {COURSE.map((level) => (
            <div key={level.id}>
              <p className="font-bold text-brand-700">
                {level.code} — {level.title}
              </p>
              {level.units.length === 0 && <p className="text-sm text-slate-400">Sem unidades ainda.</p>}
              {level.units.map((unit) => (
                <div key={unit.id} className="ml-4 mt-1">
                  <p className="text-sm font-semibold text-slate-600">{unit.title}</p>
                  <ul className="ml-4 list-disc text-sm text-slate-500">
                    {unit.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        {lesson.title} <span className="text-xs text-slate-400">({lesson.exercises.length} exercícios)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <h2 className="mb-4 font-bold text-slate-700">Rascunhos de lição (CRUD local)</h2>
        <p className="mb-4 text-xs text-slate-400">
          Cadastre novas lições com exercícios de múltipla escolha ou verdadeiro/falso. Ficam como rascunho até a
          publicação (que, com um backend real, viraria uma migração de conteúdo no banco).
        </p>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Título da lição"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-2 border-slate-200 px-3 py-2"
            />
            <input
              placeholder="Nome da unidade"
              value={unitTitle}
              onChange={(e) => setUnitTitle(e.target.value)}
              className="rounded-xl border-2 border-slate-200 px-3 py-2"
            />
          </div>

          {exercises.map((ex, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <select
                  value={ex.type}
                  onChange={(e) => updateExercise(i, { type: e.target.value as DraftExercise['type'] })}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                >
                  <option value="multiple_choice">Múltipla escolha</option>
                  <option value="true_false">Verdadeiro ou falso</option>
                </select>
                {exercises.length > 1 && (
                  <button onClick={() => removeExercise(i)} className="text-heart-500" aria-label="Remover exercício">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <input
                placeholder="Enunciado"
                value={ex.prompt}
                onChange={(e) => updateExercise(i, { prompt: e.target.value })}
                className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              />
              <input
                placeholder="Explicação da resposta correta"
                value={ex.explanation}
                onChange={(e) => updateExercise(i, { explanation: e.target.value })}
                className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              />
              <div className="flex flex-col gap-1">
                {ex.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={ex.correctIndex === oi}
                      onChange={() => updateExercise(i, { correctIndex: oi })}
                    />
                    <input
                      placeholder={`Opção ${oi + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(i, oi, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                    />
                  </div>
                ))}
              </div>
              {ex.type === 'multiple_choice' && ex.options.length < 4 && (
                <button onClick={() => addOption(i)} className="mt-2 text-xs font-bold text-brand-600">
                  + adicionar opção
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={addExercise}>
              + Exercício
            </Button>
            <Button size="sm" disabled={!canSave()} onClick={save}>
              Salvar rascunho
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {customLessonDrafts.length === 0 && <p className="text-sm text-slate-400">Nenhum rascunho ainda.</p>}
          {customLessonDrafts.map((draft) => (
            <div key={draft.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-semibold text-slate-700">{draft.title}</p>
                <p className="text-xs text-slate-400">
                  {draft.unitTitle} • {draft.exercises.length} exercício(s)
                </p>
              </div>
              <button onClick={() => deleteCustomLessonDraft(draft.id)} className="text-heart-500" aria-label="Excluir rascunho">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </AdminLayout>
  )
}
