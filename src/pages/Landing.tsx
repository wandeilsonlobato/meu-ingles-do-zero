import { Link } from 'react-router-dom'
import { BookOpen, Flame, Mic, Trophy } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Explicações em português',
    description: 'Entenda a lógica da gramática antes de praticar, com explicações claras — nada de "decoreba".',
  },
  {
    icon: Mic,
    title: 'Pronúncia e conversação real',
    description: 'Fale no microfone e receba feedback de pronúncia na hora, com foco em situações reais.',
  },
  {
    icon: Flame,
    title: 'Hábito diário',
    description: 'Sequências, corações e metas diárias para você estudar todo dia, mesmo com pouco tempo.',
  },
  {
    icon: Trophy,
    title: 'Ligas e conquistas',
    description: 'Suba de rank, ganhe medalhas e dispute o ranking semanal com outros alunos.',
  },
]

const TESTIMONIALS = [
  { name: 'Rosana, 47 anos', text: '"Sempre tive vergonha de errar. Aqui eu erro, entendo o porquê em português, e sigo em frente."' },
  { name: 'Diego, 29 anos', text: '"Uso 10 minutos no ônibus todo dia. Em 2 meses já converso frases simples sem travar."' },
  { name: 'Iracema, 61 anos', text: '"Achei que não tinha mais jeito para aprender idioma. Hoje pratico até a pronúncia com o celular."' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 font-extrabold text-brand-700 text-lg">
          <BookOpen size={24} />
          Meu Inglês do Zero
        </div>
        <div className="flex items-center gap-3">
          <Link to="/entrar" className="font-semibold text-brand-700 hover:underline">
            Entrar
          </Link>
          <Link to="/cadastro">
            <Button size="sm">Começar grátis</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center">
        <span className="mb-4 rounded-full bg-brand-100 px-4 py-1 text-sm font-bold text-brand-700">
          Para quem nunca estudou inglês (ou acha que "não tem jeito")
        </span>
        <h1 className="mb-5 max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
          Aprenda inglês do absoluto zero, <span className="text-brand-600">em português</span>, no seu ritmo.
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-slate-600">
          Trilha estruturada por níveis, explicações claras de gramática, prática de pronúncia com reconhecimento
          de voz e gamificação para você manter o hábito todos os dias.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/cadastro">
            <Button size="lg">Criar minha conta grátis</Button>
          </Link>
          <Link to="/entrar">
            <Button size="lg" variant="secondary">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                <Icon size={22} />
              </div>
              <h3 className="mb-1 font-bold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800">Quem estuda, recomenda</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="p-6">
              <p className="mb-4 text-slate-600 italic">{t.text}</p>
              <p className="font-bold text-brand-700">{t.name}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <Card className="bg-brand-600 p-10 text-white border-none">
          <h2 className="mb-3 text-2xl font-extrabold">Pronto para começar do zero, sem medo?</h2>
          <p className="mb-6 text-brand-50">Leva menos de 1 minuto para criar sua conta e começar sua primeira lição.</p>
          <Link to="/cadastro">
            <Button size="lg" variant="success">
              Começar agora, é grátis
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  )
}
