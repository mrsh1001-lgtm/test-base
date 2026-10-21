import { useRef, useState } from 'react'
import { Pause, Play } from '../Icons'
import { heroMedia } from '../../data/brand'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cn } from '../../lib/utils'

interface HeroArtworkProps {
  className?: string
  /** Hero imagery is the LCP element, so it is never lazy-loaded. */
  priority?: boolean
}

/**
 * Hero media. Renders a real background video only when a playable source
 * exists in `heroMedia.video`; otherwise the still artwork, which is animated
 * with a very slow drift unless the visitor prefers reduced motion.
 * If playback errors out, the still artwork takes over.
 */
export function HeroArtwork({ className, priority = true }: HeroArtworkProps) {
  const reduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const [paused, setPaused] = useState(reduced)

  const video = heroMedia.video
  const showVideo = Boolean(video) && !failed

  const togglePlayback = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      void el.play()
      setPaused(false)
    } else {
      el.pause()
      setPaused(true)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative overflow-hidden rounded-[32px] bg-sand shadow-lift lg:rounded-[40px]">
        <div className="relative aspect-[5/4] w-full sm:aspect-[6/5] lg:aspect-[4/3]">
          {showVideo && video ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              style={{ objectPosition: heroMedia.focal }}
              poster={video.poster}
              muted
              loop
              playsInline
              autoPlay={!reduced}
              preload="metadata"
              onError={() => setFailed(true)}
              aria-label={heroMedia.imageAlt}
            >
              <source src={video.src} />
            </video>
          ) : (
            <picture>
              <source media="(max-width: 640px)" srcSet={heroMedia.mobileImage} />
              <img
                src={heroMedia.desktopImage}
                alt={heroMedia.imageAlt}
                width={860}
                height={516}
                loading={priority ? 'eager' : 'lazy'}
                // @ts-expect-error fetchpriority is valid HTML but not yet in React's types
                fetchpriority="high"
                decoding="async"
                className={cn('h-full w-full object-cover', !reduced && 'motion-safe:animate-drift')}
                style={{ objectPosition: heroMedia.focal }}
              />
            </picture>
          )}

          {/* Configurable edge scrim: keeps the artwork legible against the page. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_100%_0%,rgba(255,252,247,0.9)_0%,rgba(255,252,247,0)_45%)]"
            style={{ opacity: heroMedia.overlayStrength + 0.1 }}
          />
        </div>
      </div>

      {showVideo && (
        <button
          type="button"
          onClick={togglePlayback}
          className="absolute bottom-4 left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-plum shadow-soft backdrop-blur transition hover:bg-white"
          aria-label={paused ? 'پخش ویدیو' : 'توقف ویدیو'}
          aria-pressed={!paused}
        >
          {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
        </button>
      )}

      <span className="pointer-events-none absolute -bottom-5 -left-5 -z-10 hidden h-40 w-40 rounded-full bg-sunny/35 blur-2xl lg:block" aria-hidden="true" />
    </div>
  )
}
