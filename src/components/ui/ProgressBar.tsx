import clsx from 'clsx'

interface ProgressBarProps {
  value: number
  max: number
  colorClassName?: string
  trackClassName?: string
  label?: string
  className?: string
}

export function ProgressBar({
  value,
  max,
  colorClassName = 'bg-progress-500',
  trackClassName = 'bg-slate-200',
  label,
  className,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div className={className}>
      <div
        className={clsx('h-3 w-full overflow-hidden rounded-full', trackClassName)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={clsx('h-full rounded-full transition-all duration-500', colorClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
