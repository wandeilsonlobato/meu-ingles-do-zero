import clsx from 'clsx'

export type CatPose = 'sit' | 'wave' | 'celebrate' | 'sad' | 'peek'

interface CatMascotProps {
  pose?: CatPose
  size?: number
  className?: string
}

const POSE_BADGE: Partial<Record<CatPose, string>> = {
  wave: '👋',
  celebrate: '🎉',
  sad: '💧',
}

const POSE_IMAGE_CLASS: Partial<Record<CatPose, string>> = {
  wave: 'animate-pop',
  celebrate: 'animate-pop',
  sad: 'grayscale-[0.3] opacity-90',
}

/** Mascote: gatinho siamês (arte enviada pelo usuário), com pequenas variações por contexto. */
export function CatMascot({ pose = 'sit', size = 96, className }: CatMascotProps) {
  const badge = POSE_BADGE[pose]

  return (
    <div className={clsx('relative inline-block', className)} style={{ width: size, height: size }}>
      <img
        src="/mascot.jpg"
        alt="Mascote gato siamês"
        width={size}
        height={size}
        className={clsx('h-full w-full rounded-full object-cover', POSE_IMAGE_CLASS[pose])}
      />
      {badge && (
        <span
          className="absolute -right-1 -top-1 select-none"
          style={{ fontSize: Math.max(16, size * 0.28) }}
          aria-hidden
        >
          {badge}
        </span>
      )}
    </div>
  )
}

/** Versão pequena (recorte redondo da mesma arte) para usar como ícone da marca em espaços pequenos. */
export function CatFaceIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/mascot.jpg"
      alt="Meu Inglês do Zero"
      width={size}
      height={size}
      className={clsx('inline-block rounded-full object-cover', className)}
      style={{ width: size, height: size }}
    />
  )
}
