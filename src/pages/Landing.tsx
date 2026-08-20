import { Link } from 'react-router-dom'
import { BookOpen, Flame, Mic, Trophy } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useI18n } from '../lib/i18n'

export default function Landing() {
  const { t, locale, setLocale } = useI18n()

  const FEATURES = [
    { icon: BookOpen, title: t('landing.feature1Title'), description: t('landing.feature1Desc') },
    { icon: Mic, title: t('landing.feature2Title'), description: t('landing.feature2Desc') },
    { icon: Flame, title: t('landing.feature3Title'), description: t('landing.feature3Desc') },
    { icon: Trophy, title: t('landing.feature4Title'), description: t('landing.feature4Desc') },
  ]

  const TESTIMONIALS = [
    { name: t('landing.testimonial1Name'), text: t('landing.testimonial1Text') },
    { name: t('landing.testimonial2Name'), text: t('landing.testimonial2Text') },
    { name: t('landing.testimonial3Name'), text: t('landing.testimonial3Text') },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-glow-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-10 -z-10 h-80 w-80 rounded-full bg-progress-200/40 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-64 -z-10 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />

        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2 font-display font-extrabold text-brand-700 dark:text-brand-300 text-lg">
            <BookOpen size={24} />
            {t('nav.brand')}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex overflow-hidden rounded-full border border-brand-200 dark:border-brand-800 text-xs font-bold">
              <button
                onClick={() => setLocale('pt')}
                className={clsx('px-2 py-1', locale === 'pt' ? 'bg-brand-500 text-white' : 'text-brand-600 dark:text-brand-400')}
              >
                PT
              </button>
              <button
                onClick={() => setLocale('en')}
                className={clsx('px-2 py-1', locale === 'en' ? 'bg-brand-500 text-white' : 'text-brand-600 dark:text-brand-400')}
              >
                EN
              </button>
            </div>
            <Link to="/entrar" className="font-semibold text-brand-700 dark:text-brand-300 hover:underline">
              {t('landing.login')}
            </Link>
            <Link to="/cadastro">
              <Button size="sm">{t('landing.signupShort')}</Button>
            </Link>
          </div>
        </header>

        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-16 text-center lg:py-24">
          <span className="mb-4 rounded-full bg-brand-100 dark:bg-brand-900/50 px-4 py-1 text-sm font-bold text-brand-700 dark:text-brand-300">
            {t('landing.tag')}
          </span>
          <h1 className="mb-5 max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            {t('landing.heroTitlePart1')} <span className="text-brand-600 dark:text-brand-400">{t('landing.heroTitleHighlight')}</span>
            {t('landing.heroTitlePart2')}
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{t('landing.heroSubtitle')}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/cadastro">
              <Button size="lg">{t('landing.ctaSignup')}</Button>
            </Link>
            <Link to="/entrar">
              <Button size="lg" variant="secondary">
                {t('landing.ctaLogin')}
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                <Icon size={22} />
              </div>
              <h3 className="mb-1 font-bold text-slate-800 dark:text-slate-100">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('landing.testimonialsTitle')}</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <Card key={item.name} className="p-6">
              <p className="mb-4 text-slate-600 dark:text-slate-300 italic">{item.text}</p>
              <p className="font-bold text-brand-700 dark:text-brand-300">{item.name}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <Card className="bg-brand-600 p-10 text-white border-none">
          <h2 className="mb-3 text-2xl font-extrabold">{t('landing.finalCtaTitle')}</h2>
          <p className="mb-6 text-brand-50">{t('landing.finalCtaSubtitle')}</p>
          <Link to="/cadastro">
            <Button size="lg" variant="success">
              {t('landing.finalCtaButton')}
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  )
}
