import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAppStore } from '../store/useAppStore'
import { useT } from '../lib/i18n'
import { PLACEMENT_QUESTIONS } from '../data/placementTest'
import { MultipleChoiceExercise } from '../components/exercises/MultipleChoiceExercise'
import type { DailyGoal } from '../types'

const GOALS: DailyGoal[] = ['casual', 'regular', 'serio', 'intenso']
const GOAL_KEYS: Record<DailyGoal, string> = {
  casual: 'common.goalCasual',
  regular: 'common.goalRegular',
  serio: 'common.goalSerious',
  intenso: 'common.goalIntense',
}

type PlacementStage = 'offer' | 'testing' | 'result'
type PlacementSkip = 'A0' | 'A1' | null

function computePlacement(scores: Record<'A0' | 'A1' | 'A2', number>): PlacementSkip {
  const THRESHOLD = 2
  if (scores.A0 < THRESHOLD) return null
  if (scores.A1 < THRESHOLD) return 'A0'
  return 'A1'
}

export default function Onboarding() {
  const navigate = useNavigate()
  const t = useT()
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

  const REASONS = [
    { id: 'trabalho', label: t('onboarding.reasonWork') },
    { id: 'viagem', label: t('onboarding.reasonTravel') },
    { id: 'estudo', label: t('onboarding.reasonStudy') },
    { id: 'filmes', label: t('onboarding.reasonMovies') },
    { id: 'curiosidade', label: t('onboarding.reasonCuriosity') },
  ]

  const LEVELS = [
    { id: 'zero', label: t('onboarding.levelZero') },
    { id: 'basico', label: t('onboarding.levelBasic') },
    { id: 'ja_estudei', label: t('onboarding.levelForgot') },
  ]

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

  const startLabel = t(placementResult ? (placementResult === 'A0' ? 'onboarding.startLevel1' : 'onboarding.startLevel2') : 'onboarding.startLevel0')

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 dark:bg-brand-900/30 px-4 py-10">
      <Card className="w-full max-w-lg p-8">
        <div className="mb-6 flex gap-2">
          {steps.map((s, i) => (
            <div key={s} className={clsx('h-1.5 flex-1 rounded-full', i <= step ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700')} />
          ))}
        </div>

        {step === 0 && (
          <div>
            <h1 className="mb-1 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('onboarding.step1Title')}</h1>
            <p className="mb-6 text-slate-500 dark:text-slate-400">{t('onboarding.step1Subtitle')}</p>
            <div className="flex flex-col gap-2">
              {REASONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReason(r.id)}
                  className={clsx(
                    'rounded-2xl border-2 px-4 py-3 text-left font-semibold transition-colors',
                    reason === r.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-brand-200',
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <Button className="mt-6" fullWidth disabled={!reason} onClick={() => setStep(1)}>
              {t('common.continue')}
            </Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="mb-1 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('onboarding.step2Title')}</h1>
            <p className="mb-6 text-slate-500 dark:text-slate-400">{t('onboarding.step2Subtitle')}</p>
            <div className="flex flex-col gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={clsx(
                    'rounded-2xl border-2 px-4 py-3 text-left font-semibold transition-colors',
                    level === l.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-brand-200',
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              {level === 'zero' ? t('onboarding.step2HintZero') : t('onboarding.step2HintOther')}
            </p>
            <Button className="mt-4" fullWidth disabled={!level} onClick={goToNivelamentoOrSkip}>
              {t('common.continue')}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div>
            {placementStage === 'offer' && (
              <div className="text-center">
                <div className="mb-4 text-5xl">🧭</div>
                <h1 className="mb-2 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('onboarding.placementOfferTitle')}</h1>
                <p className="mb-6 text-slate-500 dark:text-slate-400">
                  {t('onboarding.placementOfferBody', { count: PLACEMENT_QUESTIONS.length })}
                </p>
                <Button fullWidth onClick={() => setPlacementStage('testing')}>
                  {t('onboarding.placementTakeTest')}
                </Button>
                <button
                  className="mt-3 text-sm font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600"
                  onClick={() => setStep(3)}
                >
                  {t('onboarding.placementSkip')}
                </button>
              </div>
            )}

            {placementStage === 'testing' && (
              <div>
                <p className="mb-4 text-sm font-semibold text-slate-400 dark:text-slate-500">
                  {t('onboarding.placementQuestionOf', { current: placementIndex + 1, total: PLACEMENT_QUESTIONS.length })}
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
                    {placementIndex + 1 >= PLACEMENT_QUESTIONS.length ? t('onboarding.placementSeeResult') : t('common.continue')}
                  </Button>
                )}
              </div>
            )}

            {placementStage === 'result' && (
              <div className="text-center">
                <div className="mb-4 text-5xl">🎯</div>
                <h1 className="mb-2 text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                  {t('onboarding.placementResultTitle', { level: startLabel })}
                </h1>
                <p className="mb-6 text-slate-500 dark:text-slate-400">
                  {placementResult ? t('onboarding.placementResultWithSkip') : t('onboarding.placementResultNoSkip')}
                </p>
                <Button fullWidth onClick={() => setStep(3)}>
                  {t('common.continue')}
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="mb-1 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('onboarding.step4Title')}</h1>
            <p className="mb-6 text-slate-500 dark:text-slate-400">{t('onboarding.step4Subtitle')}</p>
            <div className="flex flex-col gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={clsx(
                    'rounded-2xl border-2 px-4 py-3 text-left font-semibold transition-colors',
                    goal === g ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-brand-200',
                  )}
                >
                  {t(GOAL_KEYS[g])}
                </button>
              ))}
            </div>
            <Button className="mt-6" fullWidth disabled={!goal} onClick={() => setStep(4)}>
              {t('common.continue')}
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="mb-4 text-5xl">🎉</div>
            <h1 className="mb-2 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('onboarding.finalTitle')}</h1>
            <p className="mb-8 text-slate-500 dark:text-slate-400">{t('onboarding.finalBody', { level: startLabel })}</p>
            <Button fullWidth onClick={finish}>
              {t('onboarding.finalButton')}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
