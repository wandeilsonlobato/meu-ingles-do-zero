import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 'flat' (default) para conteúdo secundário; 'raised' para o destaque principal da tela. */
  elevation?: 'flat' | 'raised'
}

const ELEVATION_CLASSES: Record<NonNullable<CardProps['elevation']>, string> = {
  flat: 'shadow-sm dark:shadow-none',
  raised: 'shadow-lg shadow-slate-200/70 dark:shadow-black/30',
}

export function Card({ className, elevation = 'flat', ...rest }: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-3xl border bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700',
        ELEVATION_CLASSES[elevation],
        className,
      )}
      {...rest}
    />
  )
}
