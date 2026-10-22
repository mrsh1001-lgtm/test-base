import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { PAINT_COLOR } from './heroSequence'

/** Scroll distance (in viewport heights) the paint takes to drain away. */
const DRAIN_DISTANCE = 70

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

function smoothstep(from: number, to: number, value: number) {
  const t = clamp01((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}

/**
 * The paint curtain: solid paint colour whose lower edge is an organic, curved
 * boundary with a few rounded drips. Progress 0 covers the viewport completely,
 * progress 1 has drained entirely below it.
 */
function PaintCurtain({ progress }: { progress: number }) {
  const boundary = -6 + 112 * progress
  const amplitude = Math.min(4.5, progress * 22) * (1 - smoothstep(0.94, 1, progress))

  const xs = [0, 18, 36, 54, 72, 90, 100]
  const wave = xs.map((_, i) => boundary + Math.sin(i * 1.9 + 0.7) * amplitude)

  let path = `M0 ${wave[0].toFixed(2)}`
  for (let i = 1; i < xs.length; i += 1) {
    const midX = (xs[i - 1] + xs[i]) / 2
    path += ` C${midX.toFixed(2)} ${wave[i - 1].toFixed(2)}, ${midX.toFixed(2)} ${wave[i].toFixed(2)}, ${xs[i].toFixed(2)} ${wave[i].toFixed(2)}`
  }
  path += ' L100 104 L0 104 Z'

  const dripScale = Math.min(1, progress * 3.2) * (1 - smoothstep(0.86, 0.98, progress))
  const drips = [
    { x: 15, radius: 3.2 },
    { x: 43, radius: 4.6 },
    { x: 72, radius: 3.6 },
    { x: 91, radius: 2.4 },
  ].map((drip) => ({
    x: drip.x,
    y: boundary + amplitude * 0.4,
    radius: drip.radius * dripScale,
  }))

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="block h-full w-full" aria-hidden="true">
      <defs>
        <mask id="paint-drain-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect x="0" y="0" width="100" height="100" fill="black" />
          <path d={path} fill="white" />
          {drips.map((drip, i) =>
            drip.radius > 0.05 ? (
              <ellipse key={i} cx={drip.x} cy={drip.y} rx={drip.radius} ry={drip.radius} fill="white" />
            ) : null,
          )}
        </mask>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill={PAINT_COLOR} mask="url(#paint-drain-mask)" />
    </svg>
  )
}

/**
 * Pins the following section under a full-viewport paint layer, then drains the
 * paint downward — scroll-linked and reversible — so the section's own content
 * appears beneath it.
 */
export function PaintDrain({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (reduced) return
    const element = wrapRef.current
    if (!element) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = element.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      const next = distance > 0 ? clamp01(-rect.top / distance) : 0
      setProgress((previous) => (Math.abs(previous - next) > 0.002 ? next : previous))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  if (reduced) return <>{children}</>

  return (
    <div ref={wrapRef} data-paint-drain className="relative" style={{ height: `calc(100dvh + ${DRAIN_DISTANCE}svh)` }}>
      <div className="sticky top-0 flex h-[100dvh] items-center">
        <div
          className="w-full will-change-[opacity,transform]"
          style={{
            opacity: 0.45 + 0.55 * progress,
            transform: `translate3d(0, ${(1 - progress) * 22}px, 0)`,
          }}
        >
          {children}
        </div>
      </div>

      <div aria-hidden="true" data-paint-curtain className="pointer-events-none sticky top-0 z-20 -mt-[100dvh] h-[100dvh]">
        <PaintCurtain progress={progress} />
      </div>
    </div>
  )
}
