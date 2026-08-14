import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAppStore } from '../store/useAppStore'
import { DAILY_GOAL_LABELS } from '../lib/gamification'
import { PLACEMENT_QUESTIONS } from '../data/placementTest'
import { MultipleChoiceExercise } from '../components/exercises/MultipleChoiceExercise'
import type { DailyGoal } from '../types'

const REASONS = [
  { id: 'trabalho', label: '💼 Trabalho / carreira' },
  { id: 'viagem', label: '✈️ Viagens' },
  { id: 'estudo', label: '🎓 Estudar fora' },
  { id: 'filmes', label: '🎬 Filmes, séries e música' },
  { id: 'curiosidade', label: '🧠 Curiosidade / hobby' },
]

const LEVELS = [
  { id: 'zero', label: 'Nunca estudei inglês' },
  { id: 'basico', label: 'Sei algumas palavras soltas' },
  { id: 'ja_estudei', label: 'Já estudei, mas esqueci quase tudo' },
]

const GOALS: DailyGoal[] = ['casual', 'regular', 'serio', 'intenso']

type PlacementStage = 'offer' | 'testing' | 'result'
type PlacementSkip = 'A0' | 'A1' | null

const START_LABELS: Record<'A0' | 'A1' | 'A2', string> = {
  A0: 'Primeiros Passos (Nível 0)',
  A1: 'Iniciante (Nível 1)',
  A2: 'Básico (Nível 2)',
}

function computePlacement(scores: Record<'A0' | 'A1' | 'A2', number>): PlacementSkip {
  const THRESHOLD = 2
  if (scores.A0 < THRESHOLD) return null
  if (scores.A1 < THRESHOLD) return 'A0'
  return 'A1'
}

export default function Onboarding() {
  const navigate = useNavigate()
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const applyPlacement = useAppStore((s) => s.applyPlacement)
  const [step, setStep] = useState(0)
  const [reason, setReason] = useState<string | null>(null)
  const [level, setLevel] = useState<string | null>(null)
  const [goal, setGoal] = useState<DailyGoal | null>(null)

  const [placementStage, setPlacementStage] = useState<PlacementStage>('offer')
  const [placementIndex, setPlacementIndex] = useState(0)
  const [placementAnswered, setPlacementAnswered] = useState(false)
  const [placementLastCorrect, setPlacementLastCorrect] = useState<boolean | null>(null)
  const [placementScores, setPlacementScores] = useState<Record<'A0' | 'A1' | 'A2', number>>({ A0: 0, A1: 0, A2: 0 })
  const [placementResult, setPlacementResult] = useState<PlacementSkip>(null)

  const steps = ['motivo', 'nivel', 'nivelamento', 'meta', 'confirmacao']

  function finish() {
    completeOnboarding({ reasonToLearn: reason ?? 'curiosidade', dailyGoal: goal ?? 'regular' })
    navigate('/app')
  }

  function goToNivelamentoOrSkip() {
    if (level === 'zero') {
      setStep(3)
    } else {
      setStep(2)
    }
  }

  function handlePlacementAnswer(correct: boolean) {
    setPlacementAnswered(true)
    setPlacementLastCorrect(correct)
    if (correct) {
      const levelCode = PLACEMENT_QUESTIONS[placementIndex].levelCode
      setPlacementScores((prev) => ({ ...prev, [levelCode]: prev[levelCode] + 1 }))
    }
  }

  function nextPlacementQuestion() {
    if (placementIndex + 1 >= PLACEMENT_QUESTIONS.length) {
      const result = computePlacement(placementScores)
      setPlacementResult(result)
      applyPlacement(result)
      setPlacementStage('result')
      return
    }
    setPlacementIndex((i) => i + 1)
    setPlacementAnswered(false)
    setPlacementLastCorrect(null)
  }

  const startLabel = placementResult ? START_LABELS[placementResult === 'A0' ? 'A1' : 'A2'] : START_LABELS.A0

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4 py-10">
      <Card className="w-full max-w-lg p-8">
        <div className="mb-6 flex gap-2">
          {steps.map((s, i) => (
            <div key={s} className={clsx('h-1.5 flex-1 rounded-full', i <= step ? 'bg-brand-500' : 'bg-slate-200')} />
          ))}
        </div>

        {step === 0 && (
          <div>
            <h1 className="mb-1 text-2xl font-extrabold text-slate-800">Por que você quer aprender inglês?</h1>
            <p className="mb-6 text-slate-500">Isso nos ajuda a te mostrar exemplos mais relevantes.</p>
            <div className="flex flex-col gap-2">
              {REASONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReason(r.id)}
                  className={clsx(
                    'rounded-2xl border-2 px-4 py-3 text-left font-semibold transition-colors',
                    reason === r.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200',
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <Button className="mt-6" fullWidth disabled={!reason} onClick={() => setStep(1)}>
              Continuar
            </Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="mb-1 text-2xl font-extrabold text-slate-800">Qual seu nível hoje?</h1>
            <p className="mb-6 text-slate-500">Sem julgamentos — todo mundo começa de algum lugar.</p>
            <div className="flex flex-col gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={clsx(
                    'rounded-2xl border-2 px-4 py-3 text-left font-semibold transition-colors',
                    level === l.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200',
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              {level === 'zero'
                ? 'Vamos começar pelo Nível 0 para garantir uma base sólida.'
                : 'Se você já sabe algo, na próxima tela dá pra fazer um teste rápido para começar mais adiantado(a).'}
            </p>
            <Button className="mt-4" fullWidth disabled={!level} onClick={goToNivelamentoOrSkip}>
              Continuar
            </Button>
          </div>
        )}

        {step === 2 && (
          <div>
            {placementStage === 'offer' && (
              <div className="text-center">
                <div className="mb-4 text-5xl">🧭</div>
                <h1 className="mb-2 text-2xl font-extrabold text-slate-800">Teste de nivelamento (opcional)</h1>
                <p className="mb-6 text-slate-500">
                  Você disse que já tem alguma base. Quer fazer um teste rápido de {PLACEMENT_QUESTIONS.length}{' '}
                  perguntas (2 minutos) para ver se pode começar mais adiantado(a)?
                </p>
                <Button fullWidth onClick={() => setPlacementStage('testing')}>
                  Fazer teste
                </Button>
                <button
                  className="mt-3 text-sm font-semibold text-slate-400 hover:text-slate-600"
                  onClick={() => setStep(3)}
                >
                  Pular, começar do Nível 0
                </button>
              </div>
            )}

            {placementStage === 'testing' && (
              <div>
                <p className="mb-4 text-sm font-semibold text-slate-400">
                  Pergunta {placementIndex + 1} de {PLACEMENT_QUESTIONS.length}
                </p>
                <MultipleChoiceExercise
                  key={PLACEMENT_QUESTIONS[placementIndex].exercise.id}
                  exercise={PLACEMENT_QUESTIONS[placementIndex].exercise}
                  onAnswer={handlePlacementAnswer}
                  answered={placementAnswered}
                  wasCorrect={placementLastCorrect}
                />
                {placementAnswered && (
                  <Button className="mt-4" fullWidth onClick={nextPlacementQuestion}>
                    {placementIndex + 1 >= PLACEMENT_QUESTIONS.length ? 'Ver resultado' : 'Continuar'}
                  </Button>
                )}
              </div>
            )}

            {placementStage === 'result' && (
              <div className="text-center">
                <div className="mb-4 text-5xl">🎯</div>
                <h1 className="mb-2 text-2xl font-extrabold text-slate-800">Você vai começar em: {startLabel}</h1>
                <p className="mb-6 text-slate-500">
                  {placementResult
                    ? 'Com base nas suas respostas, já marcamos os níveis anteriores como concluídos.'
                    : 'Sem problemas — uma base sólida no início faz toda a diferença.'}
                </p>
                <Button fullWidth onClick={() => setStep(3)}>
                  Continuar
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="mb-1 text-2xl font-extrabold text-slate-800">Quanto tempo por dia você quer estudar?</h1>
            <p className="mb-6 text-slate-500">Você pode mudar isso depois nas configurações.</p>
            <div className="flex flex-col gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={clsx(
                    'rounded-2xl border-2 px-4 py-3 text-left font-semibold transition-colors',
                    goal === g ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200',
                  )}
                >
                  {DAILY_GOAL_LABELS[g]}
                </button>
              ))}
            </div>
            <Button className="mt-6" fullWidth disabled={!goal} onClick={() => setStep(4)}>
              Continuar
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="mb-4 text-5xl">🎉</div>
            <h1 className="mb-2 text-2xl font-extrabold text-slate-800">Tudo pronto!</h1>
            <p className="mb-8 text-slate-500">
              Sua trilha personalizada está pronta. Vamos começar em {startLabel}.
            </p>
            <Button fullWidth onClick={finish}>
              Começar a aprender
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
