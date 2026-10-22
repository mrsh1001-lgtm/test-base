import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from '../Icons'
import { HeroSwatches } from './HeroSwatches'
import { brand, heroCopy } from '../../data/brand'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { FRAME_COUNT, FrameSequence, PAINT_COLOR, POSTER_SRC } from './heroSequence'

/** Copy is gone by this share of the hero scroll and comes back on the way up. */
const COPY_FADE_END = 0.14
/** The clip ends in solid paint; the veil seals it into the shared paint token. */
const VEIL_START = 0.8
const VEIL_END = 0.94

type Size = { width: number; height: number; dpr: number }

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}

/**
 * Draws a frame as a full-bleed cover image: the frame is scaled to fill the
 * stage and the overflow is cropped evenly. It mirrors
 * `object-cover object-center` exactly, so the poster image and the first canvas
 * frame occupy the same box with no jump when the hand-off happens.
 */
function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const frameWidth = image.naturalWidth || image.width
  const frameHeight = image.naturalHeight || image.height
  if (!frameWidth || !frameHeight) return

  const scale = Math.max(width / frameWidth, height / frameHeight)
  const drawWidth = frameWidth * scale
  const drawHeight = frameHeight * scale
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
}

function HeroCopy() {
  return (
    <>
      <p className="eyebrow">
        <span className="h-[6px] w-[6px] rounded-full bg-turquoise" aria-hidden="true" />
        رنگ برای معماری · {brand.tagline}
      </p>

      <h1 className="mt-4 text-display-xl font-bold text-plum">
        <span className="block">{heroCopy.headlineLine1}</span>
        <span className="relative mt-1 block w-fit">
          {heroCopy.headlineLine2}
          <svg
            viewBox="0 0 240 18"
            className="absolute -bottom-2 right-0 h-3 w-[86%] text-sunny"
            fill="none"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path d="M3 12C58 5 150 3 237 8" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </span>
      </h1>

      <p className="mt-5 max-w-md text-[1.02rem] leading-[1.9] text-plum-soft sm:mt-6 sm:text-[1.05rem]">
        {heroCopy.subtitle}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
        <Link to={heroCopy.primaryCta.to} className="btn-primary !min-h-[52px] !px-7">
          {heroCopy.primaryCta.label}
          <ArrowLeft className="h-[18px] w-[18px]" />
        </Link>

        <Link to="/guides" className="btn-ghost !min-h-[52px]">
          راهنمای اجرا
          <ArrowLeft className="h-[18px] w-[18px] opacity-60" />
        </Link>
      </div>

      <div className="hidden lg:block">
        <HeroSwatches label={heroCopy.swatchHeadline} />
      </div>
    </>
  )
}

/**
 * Text layer over the media. It is a separate HTML overlay with its own inner
 * padding (the site shell) plus soft cream washes on the side the copy sits on,
 * so the type stays readable without adding any box around the background.
 */
function HeroOverlay() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[82%] bg-gradient-to-t from-cream via-cream/85 to-transparent sm:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] bg-gradient-to-l from-cream via-cream/70 to-transparent sm:block"
      />

      <div className="absolute inset-0 flex items-end sm:items-center">
        <div className="shell w-full pb-10 pt-[104px] sm:pb-14">
          <div className="max-w-xl">
            <HeroCopy />
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Cinematic full-bleed hero. The image and the clip share one absolute media
 * layer that covers the whole sticky stage edge to edge; the copy sits above it
 * on its own. The clip advances only with scroll — down runs it forward, up runs
 * it back, stopping holds the frame — and its final paint frame hands the screen
 * to the shared paint token, which the next section drains away.
 */
export function Hero() {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const posterRef = useRef<HTMLImageElement | null>(null)
  const copyRef = useRef<HTMLDivElement | null>(null)
  const veilRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (reduced) return

    const track = trackRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    const copy = copyRef.current
    const poster = posterRef.current
    const veil = veilRef.current
    if (!track || !stage || !canvas || !copy || !veil) return

    const context = canvas.getContext('2d')
    if (!context) return

    const compact = window.matchMedia('(max-width: 767px)').matches
    const sequence = new FrameSequence({ limit: compact ? 120 : FRAME_COUNT, concurrency: compact ? 4 : 6 })

    let progress = 0
    let frameIndex = 0
    let direction: 1 | -1 = 1
    let lastFrame: HTMLImageElement | null = null
    let posterVisible = Boolean(poster)
    let copyHidden = false
    let bufferedFrame = -1
    let started = false
    let raf = 0
    let size: Size = { width: 0, height: 0, dpr: 1 }

    const paint = (value: number) => {
      const { width, height } = size
      if (!width || !height) return

      const next = Math.round(clamp01(value) * (FRAME_COUNT - 1))
      if (next !== frameIndex) {
        direction = next > frameIndex ? 1 : -1
        frameIndex = next
      }
      if (frameIndex !== bufferedFrame) {
        bufferedFrame = frameIndex
        sequence.enqueue(frameIndex, true)
        sequence.prefetch(frameIndex, direction)
        sequence.trim(frameIndex)
      }

      const image = sequence.get(frameIndex)
      if (image) lastFrame = image

      // Keep the last valid frame on screen while the next one is loading.
      if (lastFrame) {
        context.clearRect(0, 0, width, height)
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = 'high'
        drawCover(context, lastFrame, width, height)

        if (posterVisible && poster) {
          poster.style.opacity = '0'
          posterVisible = false
        }
      }

      // Copy fades and lifts slightly, then leaves the stage to the media.
      const fade = 1 - smoothstep(0, COPY_FADE_END, value)
      copy.style.opacity = fade.toFixed(3)
      copy.style.transform = `translate3d(0, ${(-18 * (1 - fade)).toFixed(2)}px, 0)`
      const hidden = fade < 0.02
      if (hidden !== copyHidden) {
        copyHidden = hidden
        copy.inert = hidden
        copy.style.pointerEvents = hidden ? 'none' : ''
        copy.setAttribute('aria-hidden', hidden ? 'true' : 'false')
      }

      veil.style.opacity = smoothstep(VEIL_START, VEIL_END, value).toFixed(3)
    }

    const measure = () => {
      const rect = stage.getBoundingClientRect()
      const width = rect.width || window.innerWidth
      const height = rect.height || window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      size = { width, height, dpr }

      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      paint(progress)
    }

    const tick = () => {
      raf = 0
      const rect = track.getBoundingClientRect()
      const stageHeight = stage.getBoundingClientRect().height
      const range = rect.height - stageHeight
      const target = range > 0 ? clamp01(-rect.top / range) : 0

      if (!started) {
        started = true
        progress = target
      } else {
        // Short, settling ease: it tracks wheel steps closely and stops dead
        // once the scroll stops, without letting the clip drift on its own.
        const diff = target - progress
        progress = Math.abs(diff) < 0.002 ? target : progress + diff * 0.42
      }

      paint(progress)
      if (progress !== target) raf = requestAnimationFrame(tick)
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    sequence.onReady = (index) => {
      if (index === frameIndex || !lastFrame) schedule()
    }

    measure()
    sequence.enqueue(0, true)
    sequence.prefetch(0, 1, 16)
    schedule()
    // The rest of the sequence fills in behind the first frames so a fast or
    // reverse scroll still finds a decoded neighbour.
    const fillTimer = window.setTimeout(() => sequence.fill(), 900)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    const observer = new ResizeObserver(measure)
    observer.observe(stage)

    return () => {
      window.clearTimeout(fillTimer)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
      sequence.dispose()
    }
  }, [reduced])

  if (reduced) {
    return (
      <section className="relative overflow-hidden pb-14 pt-6 sm:pb-20">
        <div className="shell grid items-center gap-10 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
          <div className="order-2 max-w-xl lg:order-1">
            <HeroCopy />
          </div>
          <div className="order-1 lg:order-2">
            <img
              src={POSTER_SRC}
              alt="سطل رنگ رنگ‌آرا در صحنه کمپین"
              width={640}
              height={360}
              className="w-full rounded-panel"
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={trackRef} className="relative h-[300svh] lg:h-[430svh]" data-hero-track>
      {/* Sticky stage: the media layer covers it edge to edge, with no inset,
          padding or radius, so the image and the clip fill the same box. */}
      <div
        ref={stageRef}
        data-hero-stage
        className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-cream"
      >
        <div data-hero-media className="absolute inset-0 overflow-hidden">
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />

          {/* First frame as poster: a valid image is visible before any frame decodes. */}
          <img
            ref={posterRef}
            src={POSTER_SRC}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 block h-full w-full object-cover object-center transition-opacity duration-300"
          />
        </div>

        {/* Seals the hand-off between the clip's final paint frame and the curtain. */}
        <div
          ref={veilRef}
          aria-hidden="true"
          data-hero-veil
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ backgroundColor: PAINT_COLOR }}
        />

        <div ref={copyRef} data-hero-copy className="absolute inset-0 z-10 will-change-[opacity,transform]">
          <HeroOverlay />
        </div>
      </div>
    </section>
  )
}
