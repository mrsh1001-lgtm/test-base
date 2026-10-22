import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { PAINT_COLOR } from './heroSequence'

/** Scroll the paint needs to drain out of the viewport, as a share of the screen height. */
const DRAIN_DESKTOP = 0.85
const DRAIN_MOBILE = 0.6

const BOUNDARY_XS = [0, 14, 32, 50, 68, 86, 100]

/** Paint streaks that cling above the draining edge. */
const DRIPS = [
  { x: 12, radius: 2.6, length: 5.4 },
  { x: 38, radius: 3.4, length: 8.2 },
  { x: 64, radius: 2.9, length: 6.2 },
  { x: 89, radius: 2.2, length: 4.4 },
]

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}

const ellipsePath = (cx: number, cy: number, rx: number, ry: number) =>
  `M${(cx - rx).toFixed(2)} ${cy.toFixed(2)}a${rx.toFixed(2)} ${ry.toFixed(2)} 0 1 0 ${(
    rx * 2
  ).toFixed(2)} 0a${rx.toFixed(2)} ${ry.toFixed(2)} 0 1 0 ${(-rx * 2).toFixed(2)} 0Z`

/**
 * The paint curtain: the coloured layer whose lower edge is an organic, curved
 * boundary. Progress 0 covers the viewport completely; progress 1 has drained
 * entirely below it. The path lives in a 0–100 box stretched to the viewport, so
 * the curve stays soft at every aspect ratio.
 */
function curtainPath(progress: number) {
  const top = -14 + 128 * progress
  const wave = 4.4 * Math.sin(Math.PI * clamp01(progress * 1.06)) * (1 - smoothstep(0.88, 1, progress))
  const points = BOUNDARY_XS.map((x, index) => ({
    x,
    y: top + Math.sin(index * 1.9 + 0.6) * wave,
  }))

  let region = `M${points[0].x} ${points[0].y.toFixed(2)}`
  for (let index = 1; index < points.length; index += 1) {
    const mid = (points[index - 1].x + points[index].x) / 2
    region += ` C${mid.toFixed(2)} ${points[index - 1].y.toFixed(2)}, ${mid.toFixed(2)} ${points[
      index
    ].y.toFixed(2)}, ${points[index].x} ${points[index].y.toFixed(2)}`
  }
  region += ' L100 118 L0 118 Z'

  // Drips live in their own white shape so they always add paint to the mask
  // instead of punching a hole through it.
  let drips = ''
  const dripScale = Math.min(1, progress * 4) * (1 - smoothstep(0.84, 1, progress))
  for (let index = 0; index < DRIPS.length; index += 1) {
    const drip = DRIPS[index]
    const height = drip.length * dripScale
    if (height < 0.4) continue
    const edge = top + Math.sin(index * 1.7 + 1.2) * wave
    // Overlap the edge slightly so each drip reads as paint clinging to the
    // wall rather than a shape floating above it.
    drips += ellipsePath(drip.x, edge - height * 0.38, drip.radius * dripScale, height * 0.62)
  }

  return { region, drips }
}

/**
 * Hands the hero's final paint colour to the next section, then drains it away.
 *
 * The wrapper overlaps the last viewport-height of the hero, so the paint covers
 * the screen at the exact frame the hero sequence ends. The section underneath
 * is pinned while the boundary travels down, giving a clean scroll-linked,
 * reversible reveal before the page returns to its normal flow.
 */
export function PaintDrain({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const dripRef = useRef<SVGPathElement | null>(null)

  useLayoutEffect(() => {
    if (reduced) return

    const wrap = wrapRef.current
    const stage = stageRef.current
    const content = contentRef.current
    const path = pathRef.current
    const drips = dripRef.current
    if (!wrap || !stage || !content || !path || !drips) return

    let drain = 0
    let raf = 0

    const render = (progress: number) => {
      const shape = curtainPath(progress)
      path.setAttribute('d', shape.region)
      drips.setAttribute('d', shape.drips)
      const enter = smoothstep(0.42, 0.98, progress)
      content.style.opacity = (0.38 + 0.62 * enter).toFixed(3)
      content.style.transform = `translate3d(0, ${((1 - enter) * 22).toFixed(2)}px, 0)`
    }

    const update = () => {
      raf = 0
      const rect = wrap.getBoundingClientRect()
      render(drain > 0 ? clamp01(-rect.top / drain) : 0)
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    const measure = () => {
      const viewport = window.innerHeight || 1
      drain = viewport * (window.innerWidth >= 1024 ? DRAIN_DESKTOP : DRAIN_MOBILE)
      // The wrapper starts exactly where the hero stage releases, so the curtain
      // only reaches the screen once the clip's final paint frame is on it.
      wrap.style.height = `${stage.offsetHeight + drain}px`
      update()
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    const observer = new ResizeObserver(measure)
    observer.observe(stage)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  if (reduced) return <>{children}</>

  return (
    <div ref={wrapRef} data-paint-drain className="relative">
      <div ref={stageRef} className="sticky top-0 flex min-h-[100dvh] items-center">
        <div ref={contentRef} className="w-full will-change-[opacity,transform]">
          {children}
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
        <div data-paint-curtain className="sticky top-0 h-[100dvh] overflow-hidden">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="block h-full w-full">
            <defs>
              <mask id="paint-drain-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                <rect x="0" y="0" width="100" height="100" fill="black" />
                <path ref={pathRef} fill="white" />
                <path ref={dripRef} fill="white" />
              </mask>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill={PAINT_COLOR} mask="url(#paint-drain-mask)" />
          </svg>
        </div>
      </div>
    </div>
  )
}
