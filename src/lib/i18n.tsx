import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { TRANSLATIONS } from '../data/translations'
import { useAppStore } from '../store/useAppStore'
import type { InterfaceLocale } from '../types'

const LOCALE_STORAGE_KEY = 'meu-ingles-do-zero-locale'

type Vars = Record<string, string | number>

function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), obj)
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) => (vars[key] !== undefined ? String(vars[key]) : `{${key}}`))
}

interface I18nContextValue {
  locale: InterfaceLocale
  setLocale: (locale: InterfaceLocale) => void
  t: (key: string, vars?: Vars) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const user = useAppStore((s) => s.currentUser())
  const updateInterfaceLocale = useAppStore((s) => s.updateInterfaceLocale)

  const [guestLocale, setGuestLocale] = useState<InterfaceLocale>(() => {
    if (typeof window === 'undefined') return 'pt'
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    return stored === 'en' ? 'en' : 'pt'
  })

  const locale = user?.interfaceLocale ?? guestLocale

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'pt-BR'
  }, [locale])

  function setLocale(next: InterfaceLocale) {
    if (user) {
      updateInterfaceLocale(next)
    } else {
      setGuestLocale(next)
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    }
  }

  const t = useMemo(() => {
    const dict = TRANSLATIONS[locale]
    const fallback = TRANSLATIONS.pt
    return (key: string, vars?: Vars) => {
      const value = getByPath(dict, key) ?? getByPath(fallback, key)
      if (typeof value !== 'string') return key
      return interpolate(value, vars)
    }
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider')
  return ctx
}

export function useT() {
  return useI18n().t
}
