import type { BrandSettings, HeroCopy, HeroMedia } from './types'

/**
 * Brand settings — single source of truth for identity and contact details.
 * The brand name in the reference mockup is a placeholder; replace `name`
 * (and set `nameIsPlaceholder` to false) once the real brand is supplied.
 * Contact details below are sample values and are flagged as such in the UI.
 */
export const brand: BrandSettings = {
  nameIsPlaceholder: true,
  name: 'رنگ‌آرا',
  latinName: 'RANGARA',
  tagline: 'رنگ، جان تازه‌ای هر فضا',
  intro:
    'رنگ‌آرا تولیدکننده رنگ‌های معماری و پوشش‌های دکوراتیو برای فضای داخلی، نما و سطوح ویژه است.',
  phone: '۰۲۱-۰۰۰۰۰۰۰۰',
  email: 'info@example.com',
  address: 'تهران، نمونه‌نشانی — نشانی کارخانه و دفتر مرکزی باید تکمیل شود',
  workingHours: 'شنبه تا چهارشنبه، ۹ تا ۱۷',
  socials: [
    { label: 'اینستاگرام', href: null },
    { label: 'پینترست', href: null },
    { label: 'لینکدین', href: null },
  ],
}

/**
 * Hero media configuration.
 *
 * `mode: 'video'` and the `video` block stay empty until a real, playable
 * video file exists. With `video: null` the hero renders the still artwork and
 * the video secondary action is not shown (a video control is never faked).
 */
export const heroMedia: HeroMedia = {
  mode: 'static',
  desktopImage: '/img/hero-scene.jpg',
  mobileImage: '/img/hero-scene.jpg',
  focal: '62% 50%',
  overlayStrength: 0.06,
  imageAlt:
    'فضای داخلی آفتابی با دیوار زرد، قوس معماری و سطل رنگ رنگ‌آرا روی پایه سنگی با روبان‌های رنگ',
  video: null,
  poster: null,
}

export const heroCopy: HeroCopy = {
  headlineLine1: 'به زندگی',
  headlineLine2: 'رنگ تازه بده',
  subtitle: 'رنگی برای هر فضا، حسی برای هر روز',
  primaryCta: { label: 'رنگ خودت را پیدا کن', to: '/colors' },
  // Populated only when a playable hero video exists.
  secondaryCta: heroMedia.video ? { label: 'تماشای ویدیو', to: '#hero-video' } : null,
  swatchHeadline: 'پالت پیشنهادی این فصل',
}
