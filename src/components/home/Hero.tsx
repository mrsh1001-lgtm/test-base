import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from '../Icons'
import { HeroSwatches } from './HeroSwatches'
import { brand, heroCopy } from '../../data/brand'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { AMBIENT_COLORS, FRAME_COUNT, FrameSequence, PAINT_COLOR, POSTER_SRC } from './heroSequence'

/** Copy is gone by this share of the hero scroll and comes back on the way up. */
const COPY_FADE_END = 0.14
/** The card opens into the full stage once the copy is out of the way. */
const EXPAND_START = 0.08
const EXPAND_END = 0.32
/** The final frames are already solid paint; this layer seals the seam. */
const VEIL_START = 0.93
const ASPECT = 16 / 9
const FALLBACK_HEADER = 84

type Size = {
  width: number
  height: number
  dpr: number
  padX: number
  padTop: number
  padBottom: number
}

type Rect = { x: number; y: number; w: number; h: number; radius: number }

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}

const withAlpha = (hex: string, alpha: number) => {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Where the clip is drawn inside the stage: a card beside the copy at the start
 * (product left, Persian copy on the clear right side), then opening to the full
 * stage once the copy has faded. The 16:9 frame is always contained, never
 * cropped, so the product and its motion stay in frame on every screen.
 */
function mediaRect(size: Size, progress: number): Rect {
  const { width, padX, padTop, padBottom } = size
  const availW = Math.max(1, width - padX * 2)
  const availH = Math.max(1, size.height - padTop - padBottom)
  const desktop = width >= 1024
  const gap = 44
  const copyW = desktop ? Math.min(500, availW * 0.4) : 0

  const fit = (boxWidth: number) => {
    const w = Math.max(1, Math.min(boxWidth, availH * ASPECT))
    return { w, h: w / ASPECT }
  }

  const start = fit(availW - copyW - (desktop ? gap : 0))
  const end = fit(availW)
  const t = desktop ? smoothstep(EXPAND_START, EXPAND_END, progress) : 0

  const w = start.w + (end.w - start.w) * t
  const h = start.h + (end.h - start.h) * t
  const x = padX + ((availW - end.w) / 2) * t
  const y = desktop
    ? padTop + (availH - start.h) / 2 + (end.h - start.h) * 0.5 * t
    : padTop + availH * 0.05

  return { x, y, w, h, radius: (desktop ? 24 : 18) * (1 - t) }
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
 * Cinematic hero. The clip advances only with scroll — scroll down runs it
 * forward, scroll up runs it back, stopping holds the frame — the copy fades out
 * over the first stretch, and the final paint frame hands the screen to the next
 * section's colour token.
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
    let lastAmbient = ''
    let copyHidden = false
    let bufferedFrame = -1
    let started = false
    let raf = 0
    let size: Size = { width: 0, height: 0, dpr: 1, padX: 0, padTop: 0, padBottom: 0 }

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

      const ambient = AMBIENT_COLORS[frameIndex] ?? PAINT_COLOR
      if (ambient !== lastAmbient) {
        lastAmbient = ambient
        stage.style.backgroundColor = ambient
      }

      const rect = mediaRect(size, value)
      const image = sequence.get(frameIndex)
      if (image) lastFrame = image

      // Keep the last valid frame on screen while the next one is loading.
      const shown = lastFrame
      if (shown) {
        context.fillStyle = ambient
        context.fillRect(0, 0, width, height)

        context.save()
        const radius = Math.max(0, rect.radius)
        if (radius > 0.5) {
          context.beginPath()
          context.moveTo(rect.x + radius, rect.y)
          context.arcTo(rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h, radius)
          context.arcTo(rect.x + rect.w, rect.y + rect.h, rect.x, rect.y + rect.h, radius)
          context.arcTo(rect.x, rect.y + rect.h, rect.x, rect.y, radius)
          context.arcTo(rect.x, rect.y, rect.x + rect.w, rect.y, radius)
          context.closePath()
          context.clip()
        }
        context.imageSmoothingQuality = 'high'
        context.drawImage(shown, rect.x, rect.y, rect.w, rect.h)

        // Blend the clip's edge into the stage so the frame reads as full-bleed
        // once it has opened up, instead of as a rectangle on a flat colour.
        const feather = smoothstep(EXPAND_START, EXPAND_END, value) * 54 + 6
        if (feather > 6) {
          const fade = (
            gx0: number,
            gy0: number,
            gx1: number,
            gy1: number,
            x: number,
            y: number,
            w: number,
            h: number,
          ) => {
            const gradient = context.createLinearGradient(gx0, gy0, gx1, gy1)
            gradient.addColorStop(0, ambient)
            gradient.addColorStop(1, withAlpha(ambient, 0))
            context.fillStyle = gradient
            context.fillRect(x, y, w, h)
          }
          fade(rect.x, rect.y, rect.x, rect.y + feather, rect.x, rect.y, rect.w, feather)
          fade(
            rect.x,
            rect.y + rect.h,
            rect.x,
            rect.y + rect.h - feather,
            rect.x,
            rect.y + rect.h - feather,
            rect.w,
            feather,
          )
          fade(rect.x, rect.y, rect.x + feather, rect.y, rect.x, rect.y, feather, rect.h)
          fade(
            rect.x + rect.w,
            rect.y,
            rect.x + rect.w - feather,
            rect.y,
            rect.x + rect.w - feather,
            rect.y,
            feather,
            rect.h,
          )
        }
        context.restore()

        if (posterVisible && poster) {
          poster.style.opacity = '0'
          posterVisible = false
        }
      } else if (poster) {
        poster.style.left = `${rect.x}px`
        poster.style.top = `${rect.y}px`
        poster.style.width = `${rect.w}px`
        poster.style.height = `${rect.h}px`
        poster.style.borderRadius = `${rect.radius}px`
      }

      // Copy fades and lifts slightly, then leaves the stage to the product.
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

      veil.style.opacity = smoothstep(VEIL_START, 1, value).toFixed(3)
    }

    const layoutCopy = () => {
      const { width, height, padX, padTop, padBottom } = size
      const desktop = width >= 1024
      if (desktop) {
        const availW = width - padX * 2
        const copyW = Math.min(500, availW * 0.4)
        copy.style.left = 'auto'
        copy.style.right = `${padX}px`
        copy.style.width = `${copyW}px`
        copy.style.top = `${padTop}px`
        copy.style.height = `${Math.max(1, height - padTop - padBottom)}px`
        copy.style.display = 'flex'
        copy.style.alignItems = 'center'
      } else {
        const rect = mediaRect(size, 0)
        copy.style.left = `${padX}px`
        copy.style.right = `${padX}px`
        copy.style.width = 'auto'
        copy.style.top = `${rect.y + rect.h + 22}px`
        copy.style.height = 'auto'
        copy.style.display = 'block'
        copy.style.alignItems = ''
      }
    }

    const measure = () => {
      const rect = stage.getBoundingClientRect()
      const header = document.querySelector('header')
      const headerHeight = header ? Math.round(header.getBoundingClientRect().height) : FALLBACK_HEADER
      const width = rect.width || window.innerWidth
      const height = rect.height || window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      size = {
        width,
        height,
        dpr,
        padX: Math.round(Math.min(64, Math.max(20, width * 0.045))),
        padTop: Math.round(headerHeight + (width >= 1024 ? 18 : 12)),
        padBottom: width >= 1024 ? 26 : 22,
      }

      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      layoutCopy()
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
      <div
        ref={stageRef}
        data-hero-stage
        className="sticky top-0 h-[100dvh] overflow-hidden bg-cream"
      >
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />

        {/* First frame as poster: a valid image is visible before any frame decodes. */}
        <img
          ref={posterRef}
          src={POSTER_SRC}
          alt=""
          aria-hidden="true"
          className="absolute block object-cover transition-opacity duration-300"
        />

        {/* Seals the hand-off between the clip's final frame and the paint curtain. */}
        <div
          ref={veilRef}
          aria-hidden="true"
          data-hero-veil
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ backgroundColor: PAINT_COLOR }}
        />

        <div
          ref={copyRef}
          data-hero-copy
          className="absolute z-10 will-change-[opacity,transform]"
        >
          <div className="w-full">
            <HeroCopy />
          </div>
        </div>
      </div>
    </section>
  )
}
