import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card } from '../../components/ui/Card'
import { COURSE } from '../../data/course'
import { type AdminStudentRow, fetchAdminOverview } from '../../lib/supabaseSync'

export default function AdminOverview() {
  const [students, setStudents] = useState<AdminStudentRow[] | null>(null)
  const totalLessons = COURSE.flatMap((l) => l.units).flatMap((u) => u.lessons).length

  useEffect(() => {
    fetchAdminOverview().then(setStudents)
  }, [])

  const list = students ?? []
  const totalStudents = list.length
  const avgXp = totalStudents ? Math.round(list.reduce((sum, u) => sum + u.xpTotal, 0) / totalStudents) : 0
  const activeStreaks = list.filter((u) => u.streakCurrent > 0).length

  return (
    <AdminLayout>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Alunos cadastrados" value={totalStudents} />
        <Stat label="XP médio" value={avgXp} />
        <Stat label="Sequências ativas" value={activeStreaks} />
        <Stat label="Lições publicadas" value={totalLessons} />
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Aluno</th>
              <th className="px-4 py-3">XP total</th>
              <th className="px-4 py-3">Sequência</th>
              <th className="px-4 py-3">Liga</th>
              <th className="px-4 py-3">Lições concluídas</th>
              <th className="px-4 py-3">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {students === null && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400 dark:text-slate-500">
                  Carregando...
                </td>
              </tr>
            )}
            {students !== null && list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400 dark:text-slate-500">
                  Nenhum aluno cadastrado ainda.
                </td>
              </tr>
            )}
            {list.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                  {u.avatarEmoji} {u.name}
                </td>
                <td className="px-4 py-3">{u.xpTotal}</td>
                <td className="px-4 py-3">{u.streakCurrent} dias</td>
                <td className="px-4 py-3">{u.league}</td>
                <td className="px-4 py-3">
                  {u.completedLessons} / {totalLessons}
                </td>
                <td className="px-4 py-3 text-slate-400 dark:text-slate-500">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminLayout>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4 text-center">
      <p className="text-2xl font-extrabold text-brand-700 dark:text-brand-300">{value}</p>
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{label}</p>
    </Card>
  )
}
