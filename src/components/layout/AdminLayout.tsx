import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { ShieldAlert } from 'lucide-react'

const TABS = [
  { to: '/admin', label: 'Visão geral', end: true },
  { to: '/admin/conteudo', label: 'Conteúdo' },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-amber-50 dark:bg-amber-900/30 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          <ShieldAlert size={18} />
          Protótipo: esta área ainda não tem controle de acesso por papel (admin/aluno). Isso deve ser adicionado
          junto com o backend real, via Row Level Security no Supabase.
        </div>
        <h1 className="mb-6 text-2xl font-extrabold text-slate-800 dark:text-slate-100">Painel administrativo</h1>
        <div className="mb-6 flex gap-2">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                clsx(
                  'rounded-xl px-4 py-2 text-sm font-bold',
                  isActive ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
        {children}
      </div>
    </div>
  )
}
