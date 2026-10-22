import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { PAINT_COLOR } from './heroSequence'

/** Scroll the paint needs to drain out of the viewport, as a share of the screen height. */
const DRAIN_DESKTOP = 0.9
const DRAIN_MOBILE = 0.72

/** Drips clinging above the receding edge: x as a share of the width, r of the height. */
const DRIPS = [
  { x: 0.13, r: 0.022 },
  { x: 0.31, r: 0.034 },
  { x: 0.51, r: 0.018 },
  { x: 0.71, r: 0.028 },
  { x: 0.9, r: 0.016 },
]

/** Samples along the width for the liquid edge. */
const SAMPLES = 40

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

const circle = (cx: number, cy: number, rx: number, ry: number) =>
  `M${(cx - rx).toFixed(1)} ${cy.toFixed(1)}a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(
    rx * 2
  ).toFixed(1)} 0a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(-rx * 2).toFixed(1)} 0Z`

/** Height of the liquid edge (the top of the remaining paint) at a share `t` of the width. */
const edgeAt = (t: number, base: number, amplitude: number) =>
  base +
  amplitude *
    (Math.sin(t * 8.6 + 0.7) * 0.55 + Math.sin(t * 15.1 + 2.4) * 0.3 + Math.sin(t * 4.3 + 4.1) * 0.15)

/**
 * The paint mass. Its top edge is the organic boundary that travels downward —
 * progress 0 puts it above the viewport (paint everywhere), progress 1 below it
 * (paint gone) — and it stays filled to well past the bottom of the stage, so
 * the clearing always starts at the top and moves down.
 */
function paintShape(width: number, height: number, progress: number) {
  const pad = Math.max(140, height * 0.26)
  const base = -pad + (height + pad * 2) * progress
  const amplitude = Math.min(26, height * 0.04) * Math.sin(Math.PI * clamp01(progress))

  let mass = `M0 ${edgeAt(0, base, amplitude).toFixed(1)}`
  for (let index = 1; index <= SAMPLES; index += 1) {
    const t0 = (index - 1) / SAMPLES
    const t1 = index / SAMPLES
    const mid = ((t0 + t1) / 2) * width
    mass += ` C${mid.toFixed(1)} ${edgeAt(t0, base, amplitude).toFixed(1)}, ${mid.toFixed(
      1,
    )} ${edgeAt(t1, base, amplitude).toFixed(1)}, ${(t1 * width).toFixed(1)} ${edgeAt(
      t1,
      base,
      amplitude,
    ).toFixed(1)}`
  }
  mass += ` L${width} ${height + 200} L0 ${height + 200} Z`

  // Rounded drips: a bulb that overlaps the edge plus a neck that melts into
  // the mass, so each one reads as paint clinging to the wall as it runs down.
  let drips = ''
  for (const drip of DRIPS) {
    const radius = Math.max(9, height * drip.r)
    const cx = drip.x * width
    const cy = edgeAt(drip.x, base, amplitude) - radius * 0.35
    drips += circle(cx, cy, radius, radius * 1.12)
    drips += circle(cx, cy + radius * 0.95, radius * 0.42, radius * 0.85)
  }

  return { mass, drips }
}

/**
 * Hands the hero's final paint colour to the next section, then drains it.
 *
 * The wrapper starts exactly where the hero stage releases and adds one drain of
 * scroll, so the turquoise covers the screen at the moment the clip's paint frame
 * leaves it. The next section is pinned underneath, on the site's own
 * warm-white, while the paint's top edge runs downward: the top of the section
 * is uncovered first and the bottom last. Past the viewport the curtain is
 * removed and normal scrolling resumes; scrolling back up reverses all of it.
 */
export function PaintDrain({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const curtainRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const massRef = useRef<SVGPathElement | null>(null)
  const dripRef = useRef<SVGPathElement | null>(null)

  useLayoutEffect(() => {
    if (reduced) return

    const wrap = wrapRef.current
    const stage = stageRef.current
    const curtain = curtainRef.current
    const svg = svgRef.current
    const mass = massRef.current
    const drips = dripRef.current
    if (!wrap || !stage || !curtain || !svg || !mass || !drips) return

    let drain = 0
    let width = 0
    let height = 0
    let raf = 0

    const render = (progress: number) => {
      const shape = paintShape(width, height, progress)
      mass.setAttribute('d', shape.mass)
      drips.setAttribute('d', shape.drips)
      // Below the viewport the paint is gone: stop compositing it at all.
      curtain.style.visibility = progress > 0.995 ? 'hidden' : 'visible'
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
      drain = Math.round(viewport * (window.innerWidth >= 1024 ? DRAIN_DESKTOP : DRAIN_MOBILE))
      // The wrapper holds the pinned section plus exactly one drain of scroll.
      wrap.style.height = `${stage.offsetHeight + drain}px`
      width = curtain.offsetWidth || window.innerWidth
      height = curtain.offsetHeight || viewport
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
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
      {/* The real section, pinned underneath the paint on the site background. */}
      <div
        ref={stageRef}
        data-paint-stage
        className="sticky top-0 flex min-h-[100dvh] items-center bg-cream"
      >
        <div className="w-full">{children}</div>
      </div>

      {/* Paint curtain: a sticky viewport-height layer above the section. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
        <div ref={curtainRef} data-paint-curtain className="sticky top-0 h-[100dvh] overflow-hidden">
          <svg ref={svgRef} className="block h-full w-full">
            <path ref={massRef} fill={PAINT_COLOR} />
            <path ref={dripRef} fill={PAINT_COLOR} />
          </svg>
        </div>
      </div>
    </div>
  )
}
