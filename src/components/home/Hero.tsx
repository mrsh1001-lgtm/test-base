import { Link } from 'react-router-dom'
import { ArrowLeft, Play } from '../Icons'
import { HeroArtwork } from './HeroArtwork'
import { HeroSwatches } from './HeroSwatches'
import { brand, heroCopy, heroMedia } from '../../data/brand'

export function Hero() {
  const videoHref = heroCopy.secondaryCta?.to ?? null

  return (
    <section className="relative overflow-hidden pb-14 pt-4 sm:pb-20 lg:pb-24">
      {/* Soft colour fields: atmosphere without competing with the artwork. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-20 top-4 h-64 w-64 rounded-full bg-sunny-soft/70 blur-[80px]" />
        <div className="absolute left-[-6rem] top-1/3 h-72 w-72 rounded-full bg-coral-soft/60 blur-[90px]" />
        <div className="absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-turquoise-soft/50 blur-[80px]" />
      </div>

      <div className="shell grid items-center gap-10 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
        {/* Text column — first in the DOM, right side visually in RTL. */}
        <div className="order-2 max-w-xl lg:order-1">
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
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-plum text-white">
                  <Play className="h-3.5 w-3.5" />
                </span>
                {heroCopy.secondaryCta?.label}
              </a>
            ) : (
              // No playable hero video exists yet, so no video control is shown.
              <Link to="/guides" className="btn-ghost !min-h-[52px]">
                راهنمای اجرا
                <ArrowLeft className="h-[18px] w-[18px] opacity-60" />
              </Link>
            )}
          </div>

          <HeroSwatches label={heroCopy.swatchHeadline} />
        </div>

        <div className="order-1 lg:order-2">
          <HeroArtwork />
          <p className="mt-3 text-center text-[0.72rem] text-plum-mute lg:text-right">
            {heroMedia.mode === 'static' ? 'تصویر ترکیبی از کمپین رنگ؛ بسته‌بندی واقعی محصول حفظ شده است.' : null}
          </p>
        </div>
      </div>
    </section>
  )
}
