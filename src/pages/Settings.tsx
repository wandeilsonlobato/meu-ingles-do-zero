import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { DAILY_GOAL_LABELS } from '../lib/gamification'
import type { DailyGoal } from '../types'

const GOALS: DailyGoal[] = ['casual', 'regular', 'serio', 'intenso']

export default function Settings() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.currentUser())
  const updateDailyGoal = useAppStore((s) => s.updateDailyGoal)
  const logOut = useAppStore((s) => s.logOut)
  const [notifications, setNotifications] = useState(true)

  if (!user) return null

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-800">Configurações</h1>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700">Meta diária</h2>
        <div className="flex flex-col gap-2">
          {GOALS.map((g) => (
            <button
              key={g}
              onClick={() => updateDailyGoal(g)}
              className={clsx(
                'rounded-xl border-2 px-4 py-2.5 text-left font-semibold transition-colors',
                user.dailyGoal === g ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200',
              )}
            >
              {DAILY_GOAL_LABELS[g]}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700">Notificações</h2>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Lembrete para manter a sequência</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="h-5 w-5 accent-brand-500"
          />
        </label>
        <p className="mt-2 text-xs text-slate-400">
          Notificações push/e-mail dependem de um backend conectado (ex: Supabase + serviço de push).
        </p>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700">Idioma da interface</h2>
        <p className="text-sm text-slate-500">Português (Brasil) — único idioma disponível no momento.</p>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-3 font-bold text-slate-700">Plano</h2>
        <p className="text-sm text-slate-500">Você está no plano gratuito. Planos com vidas infinitas em breve.</p>
      </Card>

      <Button variant="danger" fullWidth onClick={() => { logOut(); navigate('/') }}>
        Sair da conta
      </Button>
    </div>
  )
}
