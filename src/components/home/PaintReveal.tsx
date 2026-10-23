import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { revealDistance } from './reveal'

/**
 * Holds the section that is uncovered by the hero's paint.
 *
 * The wrapper is pulled up over the hero's last pinned viewport, so the section
 * is already sitting in the viewport while the clip is still painting the
 * screen. It then pins for exactly one reveal distance: the paint edge travels
 * upward over it, the section stays still underneath, and as soon as the paint
 * has left through the top the pin releases and normal scrolling continues.
 * Nothing here paints the turquoise — that lives in the hero stage so both
 * share one scroll timeline.
 */
export function PaintReveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (reduced) return

    const wrap = wrapRef.current
    const stage = stageRef.current
    if (!wrap || !stage) return

    const measure = () => {
      const heroStage = document.querySelector<HTMLElement>('[data-hero-stage]')
      const heroHeight = heroStage?.offsetHeight || window.innerHeight
      const reveal = Math.round(revealDistance())
      // Sit exactly under the hero's final pinned screen, and add one reveal
      // distance of scroll for the pin.
      wrap.style.marginTop = `-${heroHeight + reveal}px`
      wrap.style.height = `${stage.offsetHeight + reveal}px`
    }

    measure()
    window.addEventListener('resize', measure)
    const observer = new ResizeObserver(measure)
    observer.observe(stage)

    return () => {
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [reduced])

  if (reduced) return <>{children}</>

  return (
    <div ref={wrapRef} data-paint-reveal className="relative">
      <div
        ref={stageRef}
        data-paint-stage
        className="sticky top-0 flex min-h-[100dvh] items-center bg-cream"
      >
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}
