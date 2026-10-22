import type { CSSProperties } from 'react'

type Props = {
  className?: string
  size?: number
  /** Opt the grid into the “fills in like a rendered image” animation. */
  animated?: boolean
  /** Renders cells in `currentColor`; the shutter-flash pixel stays amber. */
  color?: 'currentColor' | 'ink' | 'lens'
}

/**
 * dom-shot logo — a 3×3 pixel grid that fills in like a rendered image.
 * The amber pixel (top-right) is the shutter flash. Geometry and opacity
 * matrix are taken verbatim from the brand kit.
 */
export function PixelGrid({ className, size = 64, animated = false, color = 'currentColor' }: Props) {
  const tone = color === 'ink' ? 'var(--ds-ink)' : color === 'lens' ? 'var(--ds-lens)' : 'currentColor'
  const flash = 'var(--ds-flash)'

  // (row, column) → opacity, from the brand sheet
  const opacities = [
    [0.2, 0.4, 1],
    [0.4, 0.65, 0.85],
    [0.65, 0.85, 1],
  ]
  const positions = [6, 36, 66]

  let cell = 0
  const rects: React.ReactNode[] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const index = cell++
      const o = opacities[row][col]
      const isFlash = row === 0 && col === 2
      rects.push(
        <rect
          key={index}
          className={animated ? 'pixel-cell' : undefined}
          x={positions[col]}
          y={positions[row]}
          width={24}
          height={24}
          rx={6}
          fill={isFlash ? flash : tone}
          fillOpacity={1}
          style={{ opacity: o, ...(animated ? { '--d': `${(row + col) * 90}ms` } : null) } as CSSProperties}
        />,
      )
    }
  }

  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {rects}
    </svg>
  )
}
