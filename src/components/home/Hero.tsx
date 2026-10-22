import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from '../Icons'
import { HeroSwatches } from './HeroSwatches'
import { brand, heroCopy } from '../../data/brand'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { AMBIENT_COLORS, FRAME_COUNT, FrameStore, PAINT_COLOR, POSTER_SRC } from './heroSequence'

const COPY_FADE_END = 0.16
const EXPAND_START = 0.12
const EXPAND_END = 0.34
/** The clip is fully played at 90% of the pinned scroll; the rest holds paint. */
const TIMELINE_END = 0.9

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

function smoothstep(from: number, to: number, value: number) {
  const t = clamp01((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}

/**
 * Where the 16:9 clip is drawn inside the stage: a card beside the copy at the
 * start, opening to full width once the copy has faded. The clip is always
 * contained, never cropped, so the product stays in frame on every screen.
 */
function fitMedia(width: number, height: number, progress: number) {
  const desktop = width >= 1024
  const expand = desktop ? smoothstep(EXPAND_START, EXPAND_END, progress) : 1
  const boxWidth = desktop ? width * (0.64 + 0.36 * expand) : width
  const scale = Math.min(boxWidth / 640, height / 360)
  const videoWidth = 640 * scale
  const videoHeight = 360 * scale

  return {
    x: Math.max(0, (boxWidth - videoWidth) / 2),
    y: Math.max(0, (height - videoHeight) * (desktop ? 0.5 : 0.36)),
    width: videoWidth,
    height: videoHeight,
    radius: desktop ? 30 * (1 - expand) : 0,
  }
}

function HeroCopy() {
  const videoHref = heroCopy.secondaryCta?.to ?? null

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

      <p className="mt-6 max-w-md text-[1.05rem] leading-[1.9] text-plum-soft">{heroCopy.subtitle}</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link to={heroCopy.primaryCta.to} className="btn-primary !min-h-[52px] !px-7">
          {heroCopy.primaryCta.label}
          <ArrowLeft className="h-[18px] w-[18px]" />
        </Link>

        {videoHref ? (
          <a href={videoHref} className="btn-ghost !min-h-[52px] gap-2.5">
            {heroCopy.secondaryCta?.label}
          </a>
        ) : (
          <Link to="/guides" className="btn-ghost !min-h-[52px]">
            راهنمای اجرا
            <ArrowLeft className="h-[18px] w-[18px] opacity-60" />
          </Link>
        )}
      </div>

      <div className="hidden lg:block">
        <HeroSwatches label={heroCopy.swatchHeadline} />
      </div>
    </>
  )
}

/**
 * Cinematic hero: the campaign animation advances only with scroll, the copy
 * fades out over the first stretch, and the final paint frame hands over to the
 * next section's colour token.
 */
export function Hero() {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const posterRef = useRef<HTMLImageElement | null>(null)
  const copyRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (reduced) return

    const track = trackRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    const copy = copyRef.current
    const poster = posterRef.current
    if (!track || !stage || !canvas || !copy) return

    const context = canvas.getContext('2d')
    if (!context) return

    const store = new FrameStore()
    let frameIndex = 0
    let direction: 1 | -1 = 1
    let progress = 0
    let started = false
    let copyHidden = false
    let lastFrame: HTMLImageElement | null = null
    let lastAmbient = ''
    let raf = 0
    let size = { width: 0, height: 0, dpr: 1 }

    const apply = (value: number) => {
      const { width, height, dpr } = size
      if (!width || !height) return

      const timeline = Math.min(value / TIMELINE_END, 1)
      const nextFrame = Math.round(timeline * (FRAME_COUNT - 1))
      if (nextFrame !== frameIndex) {
        direction = nextFrame > frameIndex ? 1 : -1
        frameIndex = nextFrame
      }

      store.request(frameIndex)
      store.prefetch(frameIndex, direction)
      store.trim(frameIndex)

      const media = fitMedia(width, height, value)
      const ambient = value >= TIMELINE_END ? PAINT_COLOR : AMBIENT_COLORS[frameIndex]
      if (ambient !== lastAmbient) {
        lastAmbient = ambient
        stage.style.backgroundColor = ambient
      }

      if (poster && !lastFrame) {
        poster.style.left = `${media.x}px`
        poster.style.top = `${media.y}px`
        poster.style.width = `${media.width}px`
        poster.style.height = `${media.height}px`
        poster.style.borderRadius = `${media.radius}px`
      }

      const image = store.get(frameIndex)
      if (image) lastFrame = image

      // The last decoded frame stays on screen while the next one loads.
      if (lastFrame) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.save()
        if (media.radius > 0.5) {
          const x = media.x * dpr
          const y = media.y * dpr
          const w = media.width * dpr
          const h = media.height * dpr
          const r = media.radius * dpr
          context.beginPath()
          context.moveTo(x + r, y)
          context.arcTo(x + w, y, x + w, y + h, r)
          context.arcTo(x + w, y + h, x, y + h, r)
          context.arcTo(x, y + h, x, y, r)
          context.arcTo(x, y, x + w, y, r)
          context.closePath()
          context.clip()
        }
        context.drawImage(lastFrame, media.x * dpr, media.y * dpr, media.width * dpr, media.height * dpr)
        context.restore()
        if (poster && poster.style.opacity !== '0') poster.style.opacity = '0'
      }

      const fade = 1 - smoothstep(0, COPY_FADE_END, value)
      copy.style.opacity = String(fade)
      copy.style.transform = `translate3d(0, ${-26 * (1 - fade)}px, 0)`

      const hidden = fade < 0.02
      if (hidden !== copyHidden) {
        copyHidden = hidden
        copy.inert = hidden
        copy.setAttribute('aria-hidden', hidden ? 'true' : 'false')
      }
    }

    const measure = () => {
      const rect = stage.getBoundingClientRect()
      size = { width: rect.width, height: rect.height, dpr: Math.min(window.devicePixelRatio || 1, 2) }
      canvas.width = Math.max(1, Math.round(size.width * size.dpr))
      canvas.height = Math.max(1, Math.round(size.height * size.dpr))
      apply(progress)
    }

    const loop = () => {
      raf = 0
      const rect = track.getBoundingClientRect()
      const range = rect.height - size.height
      const target = range > 0 ? clamp01(-rect.top / range) : 0

      if (!started) {
        started = true
        progress = target
      } else {
        // Brief smoothing for wheel steps; it settles as soon as scrolling stops.
        const diff = target - progress
        progress = Math.abs(diff) < 0.0012 ? target : progress + diff * 0.34
      }

      apply(progress)
      if (progress !== target) raf = requestAnimationFrame(loop)
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }

    store.onFrameReady = (index) => {
      if (index === frameIndex) schedule()
    }

    measure()
    store.warmKeyframes()
    schedule()

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    const observer = new ResizeObserver(measure)
    observer.observe(stage)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
      store.dispose()
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
    <section ref={trackRef} className="relative" data-hero-track>
      <div ref={stageRef} data-hero-stage className="sticky top-0 h-[100dvh] overflow-hidden bg-cream">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />

        {/* First frame as poster: something valid is visible before the sequence decodes. */}
        <img
          ref={posterRef}
          src={POSTER_SRC}
          alt=""
          aria-hidden="true"
          className="absolute block object-contain transition-opacity duration-300"
        />

        <div
          ref={copyRef}
          data-hero-copy
          className="absolute inset-x-4 bottom-[7%] z-10 will-change-[opacity,transform] sm:inset-x-8 lg:inset-x-auto lg:bottom-0 lg:right-[max(2rem,5vw)] lg:top-0 lg:flex lg:w-[36%] lg:max-w-[520px] lg:items-center"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 hidden lg:block"
            style={{
              background:
                'radial-gradient(130% 125% at 68% 50%, rgba(255,252,247,0.9) 0%, rgba(255,252,247,0.6) 46%, rgba(255,252,247,0) 76%)',
            }}
          />
          <div className="w-full">
            <HeroCopy />
          </div>
        </div>
      </div>
    </section>
  )
}
