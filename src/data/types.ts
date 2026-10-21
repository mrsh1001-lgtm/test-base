/**
 * Content model for the whole site. Everything the site renders comes from
 * these structures, so real manufacturer data can replace the sample records
 * without touching page components.
 *
 * `sample: true` marks placeholder content that must be replaced with real
 * brand/product data. Optional fields are omitted when no value exists and the
 * UI simply does not render them (no invented specs, no dead download links).
 */

export type Tone = 'coral' | 'turquoise' | 'lavender' | 'sunny' | 'violet' | 'pink' | 'cobalt'

export interface BrandSettings {
  /** Placeholder until the real manufacturers' brand name is supplied. */
  nameIsPlaceholder: boolean
  name: string
  latinName: string
  tagline: string
  /** Short positioning line used in the footer and meta descriptions. */
  intro: string
  phone: string
  email: string
  address: string
  workingHours: string
  socials: { label: string; href: string | null }[]
}

export interface HeroMedia {
  mode: 'static' | 'video'
  desktopImage: string
  mobileImage: string
  /** Focal point for the artwork crop, e.g. '45% 50%'. */
  focal: string
  /** Legibility scrim strength over the artwork (0–1). */
  overlayStrength: number
  imageAlt: string
  /** Only rendered when a genuinely playable source exists. */
  video: { src: string; poster: string } | null
  poster: string | null
}

export interface HeroCopy {
  headlineLine1: string
  headlineLine2: string
  subtitle: string
  primaryCta: { label: string; to: string }
  secondaryCta: { label: string; to: string } | null
  swatchHeadline: string
}

export interface Category {
  slug: string
  title: string
  blurb: string
  image: string
  imageAlt: string
  tone: Tone
  /** Background of the pill button on the category card. */
  pillClass: string
}

export interface ProductPackaging {
  size: string
  unit: string
}

export interface SpecRow {
  label: string
  value: string
  /** Render the value in an isolated LTR run (numbers, codes, units). */
  ltr?: boolean
}

export interface Product {
  slug: string
  code: string
  name: string
  categorySlug: string
  usage: 'interior' | 'exterior' | 'both'
  tagline: string
  description: string[]
  image: string
  imageAlt: string
  gallery: { src: string; alt: string }[]
  surfaces: string[]
  finish: string
  performance: string[]
  packaging: ProductPackaging[]
  colorSlugs: string[]
  specs: SpecRow[]
  preparation?: string[]
  application?: string[]
  storage?: string[]
  safety?: string[]
  /** Manufacturer-supplied coverage per coat, used by the calculator. */
  coverage: { value: number; unit: string } | null
  datasheetUrl?: string | null
  sdsUrl?: string | null
  catalogUrl?: string | null
  videoUrl?: string | null
  relatedSlugs: string[]
  sample: boolean
}

export interface ColorFamily {
  slug: string
  name: string
  tone: Tone
  blurb: string
}

export interface ColorShade {
  slug: string
  name: string
  code: string
  hex: string
  familySlug: string
  lrv: number | null
}

export interface Palette {
  slug: string
  name: string
  note: string
  colorSlugs: string[]
}

export interface Project {
  slug: string
  title: string
  space: string
  style: string
  summary: string
  body: string[]
  image: string
  imageAlt: string
  colorSlugs: string[]
  productSlugs: string[]
  paletteSlug: string | null
  /** True when the image is a colour study rather than a photographed project. */
  colourStudy: boolean
  sample: boolean
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  readMinutes: number
  image: string
  imageAlt: string
  body: { heading?: string; paragraphs: string[]; list?: string[] }[]
  sample: boolean
}

export interface Dealer {
  id: string
  name: string
  province: string
  city: string
  address: string
  phone: string
  kind: 'نمایندگی فروش' | 'مرکز پخش' | 'فروشگاه همکار'
  sample: boolean
}

export interface DownloadItem {
  id: string
  title: string
  description: string
  kind: 'کاتالوگ' | 'برگه فنی' | 'SDS'
  /** A real, existing file. `null` renders a non-interactive "unavailable" item. */
  url: string | null
  sample: boolean
}
