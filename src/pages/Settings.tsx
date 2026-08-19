import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Smartphone } from 'lucide-react'
import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { DAILY_GOAL_LABELS } from '../lib/gamification'
import { useInstallPrompt } from '../lib/useInstallPrompt'
import type { DailyGoal } from '../types'

const GOALS: DailyGoal[] = ['casual', 'regular', 'serio', 'intenso']

export default function Settings() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.currentUser())
  const updateDailyGoal = useAppStore((s) => s.updateDailyGoal)
  const logOut = useAppStore((s) => s.logOut)
  const [notifications, setNotifications] = useState(true)
  const { canInstall, installed, isIos, promptInstall } = useInstallPrompt()

  if (!user) return null

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-800">Configurações</h1>

      {!installed && (canInstall || isIos) && (
        <Card className="mb-5 flex items-center gap-4 border-brand-200 bg-brand-50 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <Smartphone size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-slate-800">Instale o app no seu celular</h2>
            {canInstall ? (
              <p className="text-sm text-slate-500">Acesso rápido com ícone na tela inicial, abrindo em tela cheia, sem a barra do navegador.</p>
            ) : (
              <p className="text-sm text-slate-500">
                No Safari, toque em <strong>Compartilhar</strong> e depois em{' '}
                <strong>Adicionar à Tela de Início</strong>.
              </p>
            )}
          </div>
          {canInstall && (
            <Button size="sm" icon={<Download size={16} />} onClick={promptInstall}>
              Instalar
            </Button>
          )}
        </Card>
      )}

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
          O envio de notificações de verdade (push ou e-mail) ainda não está implementado nesta versão.
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
