import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: ReactNode
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand-500 text-white border-b-4 border-brand-700 hover:bg-brand-400 active:border-b-0 active:translate-y-1',
  secondary:
    'bg-white text-brand-600 border-2 border-brand-200 hover:bg-brand-50',
  success:
    'bg-progress-500 text-white border-b-4 border-progress-700 hover:bg-progress-400 active:border-b-0 active:translate-y-1',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  danger:
    'bg-heart-500 text-white border-b-4 border-heart-600 hover:opacity-90 active:border-b-0 active:translate-y-1',
}

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm px-3 py-1.5 rounded-xl',
  md: 'text-base px-5 py-2.5 rounded-2xl',
  lg: 'text-lg px-7 py-3.5 rounded-2xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  icon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        'font-display font-bold tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0 select-none inline-flex items-center justify-center gap-2',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
