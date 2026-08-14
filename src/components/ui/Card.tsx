import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge('rounded-3xl bg-white border border-slate-200 shadow-sm', className)}
      {...rest}
    />
  )
}
