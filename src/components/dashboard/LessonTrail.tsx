import { useMemo } from 'react'
import type { Lesson, LessonStatus } from '../../types'
import { LessonNode } from './LessonNode'

const TRAIL_WIDTH = 280
const CENTER_X = TRAIL_WIDTH / 2
const ROW_HEIGHT = 124
const AMPLITUDE = 68
const PERIOD = 6

function xOffset(index: number) {
  return AMPLITUDE * Math.sin((index * 2 * Math.PI) / PERIOD)
}

/** Curva suave passando por todos os pontos (quadratic bezier via midpoints). */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2
    const my = (points[i].y + points[i + 1].y) / 2
    d += ` Q ${points[i].x} ${points[i].y} ${mx} ${my}`
  }
  const last = points[points.length - 1]
  d += ` L ${last.x} ${last.y}`
  return d
}

export interface TrailItem {
  lesson: Lesson
  status: LessonStatus
  isNext: boolean
}

export function LessonTrail({ items }: { items: TrailItem[] }) {
  const points = useMemo(
    () => items.map((_, i) => ({ x: CENTER_X + xOffset(i), y: i * ROW_HEIGHT + ROW_HEIGHT / 2 })),
    [items],
  )
  const height = Math.max(items.length * ROW_HEIGHT, ROW_HEIGHT)

  return (
    <div className="relative mx-auto" style={{ width: TRAIL_WIDTH, height }}>
      <svg
        className="absolute inset-0"
        width={TRAIL_WIDTH}
        height={height}
        viewBox={`0 0 ${TRAIL_WIDTH} ${height}`}
        aria-hidden
      >
        <path
          d={smoothPath(points)}
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-slate-200 dark:stroke-slate-700"
        />
      </svg>
      {items.map((item, i) => (
        <div
          key={item.lesson.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: points[i].x, top: points[i].y }}
        >
          <LessonNode lesson={item.lesson} status={item.status} isNext={item.isNext} />
        </div>
      ))}
    </div>
  )
}
