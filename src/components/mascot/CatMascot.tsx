const CREAM = '#f4e8d8'
const CREAM_SHADE = '#e8d5b8'
const POINT = '#4a3428'
const POINT_LIGHT = '#5f4436'
const EYE = '#5ec9f0'
const NOSE = '#e39a9a'
const INNER_EAR = '#e8b9c4'

export type CatPose = 'sit' | 'wave' | 'celebrate' | 'sad' | 'peek'

interface CatMascotProps {
  pose?: CatPose
  size?: number
  className?: string
}

/**
 * Mascote: gatinho siamês em SVG (sem dependências externas). Poses simples
 * reaproveitando o mesmo corpo-base, variando braços/orelhas/expressão.
 */
export function CatMascot({ pose = 'sit', size = 96, className }: CatMascotProps) {
  const blink = pose === 'sad'
  const raisedTail = pose === 'celebrate' || pose === 'wave'

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="Mascote gato siamês">
      {/* cauda */}
      <path
        d={raisedTail ? 'M148 150 C 178 140, 182 90, 158 68' : 'M148 152 C 172 158, 178 178, 160 186'}
        stroke={POINT}
        strokeWidth={14}
        strokeLinecap="round"
        fill="none"
      />

      {/* corpo */}
      <ellipse cx="100" cy="146" rx="52" ry="42" fill={CREAM} />
      <ellipse cx="100" cy="160" rx="40" ry="18" fill={CREAM_SHADE} opacity="0.6" />

      {/* patas traseiras */}
      <ellipse cx="70" cy="182" rx="14" ry="10" fill={POINT} />
      <ellipse cx="130" cy="182" rx="14" ry="10" fill={POINT} />

      {/* braços */}
      {pose === 'wave' ? (
        <>
          <ellipse cx="58" cy="140" rx="10" ry="22" fill={POINT} transform="rotate(-35 58 140)" />
          <ellipse cx="140" cy="122" rx="10" ry="26" fill={POINT} transform="rotate(50 140 122)" />
        </>
      ) : pose === 'celebrate' ? (
        <>
          <ellipse cx="55" cy="118" rx="10" ry="26" fill={POINT} transform="rotate(-55 55 118)" />
          <ellipse cx="145" cy="118" rx="10" ry="26" fill={POINT} transform="rotate(55 145 118)" />
        </>
      ) : (
        <>
          <ellipse cx="62" cy="150" rx="10" ry="20" fill={POINT} transform="rotate(-15 62 150)" />
          <ellipse cx="138" cy="150" rx="10" ry="20" fill={POINT} transform="rotate(15 138 150)" />
        </>
      )}

      {/* cabeça */}
      <circle cx="100" cy="92" r="46" fill={CREAM} />

      {/* orelhas */}
      <path d="M62 66 L50 24 L86 54 Z" fill={POINT} />
      <path d="M138 66 L150 24 L114 54 Z" fill={POINT} />
      <path d="M66 58 L59 36 L82 54 Z" fill={INNER_EAR} />
      <path d="M134 58 L141 36 L118 54 Z" fill={INNER_EAR} />

      {/* máscara facial (pontos siameses) */}
      <ellipse cx="100" cy="104" rx="30" ry="20" fill={POINT_LIGHT} opacity="0.9" />
      <circle cx="100" cy="92" r="46" fill="none" />

      {/* olhos */}
      {blink ? (
        <>
          <path d="M78 96 q10 8 20 0" stroke="#2b1c14" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M102 96 q10 8 20 0" stroke="#2b1c14" strokeWidth={4} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="86" cy="96" rx="9" ry="11" fill="#fff" />
          <ellipse cx="114" cy="96" rx="9" ry="11" fill="#fff" />
          <ellipse cx="87" cy="98" rx="5.5" ry="7" fill={EYE} />
          <ellipse cx="115" cy="98" rx="5.5" ry="7" fill={EYE} />
          <circle cx="88.5" cy="95.5" r="1.6" fill="#fff" />
          <circle cx="116.5" cy="95.5" r="1.6" fill="#fff" />
        </>
      )}

      {/* nariz e boca */}
      <path d="M96 110 L104 110 L100 116 Z" fill={NOSE} />
      {pose === 'sad' ? (
        <path d="M92 124 q8 -8 16 0" stroke="#2b1c14" strokeWidth={3} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M92 118 q8 8 16 0" stroke="#2b1c14" strokeWidth={3} fill="none" strokeLinecap="round" />
      )}

      {/* bigodes */}
      <g stroke="#c9b7a0" strokeWidth={2} strokeLinecap="round">
        <path d="M70 108 H40" />
        <path d="M70 114 H38" />
        <path d="M130 108 H160" />
        <path d="M130 114 H162" />
      </g>
    </svg>
  )
}

/** Versão simplificada (só a cabeça) para usar como ícone da marca em espaços pequenos. */
export function CatFaceIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label="Meu Inglês do Zero">
      <path d="M28 30 L20 6 L46 24 Z" fill={POINT} />
      <path d="M72 30 L80 6 L54 24 Z" fill={POINT} />
      <circle cx="50" cy="52" r="34" fill={CREAM} />
      <ellipse cx="50" cy="60" rx="20" ry="13" fill={POINT_LIGHT} opacity="0.9" />
      <ellipse cx="40" cy="52" rx="6" ry="7.5" fill="#fff" />
      <ellipse cx="60" cy="52" rx="6" ry="7.5" fill="#fff" />
      <ellipse cx="41" cy="53.5" rx="3.6" ry="4.6" fill={EYE} />
      <ellipse cx="61" cy="53.5" rx="3.6" ry="4.6" fill={EYE} />
      <path d="M46 68 L54 68 L50 73 Z" fill={NOSE} />
    </svg>
  )
}
