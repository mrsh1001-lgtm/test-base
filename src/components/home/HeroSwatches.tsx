import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from '../Icons'
import { shadeBySlug } from '../../data/catalog'
import type { ColorShade } from '../../data/types'
import { cn } from '../../lib/utils'

/** The six coordinated hero swatches from the reference composition. */
const HERO_SWATCHES = ['khakestari-korol', 'aftab-tamam', 'firooze-darya', 'yasi-roshan', 'abi-kobalt', 'sorati-korol']

interface HeroSwatchesProps {
  label: string
}

export function HeroSwatches({ label }: HeroSwatchesProps) {
  const swatches = HERO_SWATCHES.map(shadeBySlug).filter((s): s is ColorShade => Boolean(s))
  const [selected, setSelected] = useState(swatches[0]?.slug ?? '')
  const active = swatches.find((s) => s.slug === selected) ?? swatches[0]

  // Keep the selection valid if the catalogue changes underneath.
  useEffect(() => {
    if (!swatches.some((s) => s.slug === selected) && swatches[0]) setSelected(swatches[0].slug)
  }, [selected, swatches])

  if (!active) return null

  return (
    <div className="mt-9">
      <p className="text-[0.78rem] font-medium tracking-[0.04em] text-plum-mute">{label}</p>

      <div role="radiogroup" aria-label={label} className="mt-3 flex flex-wrap items-center gap-2.5">
        {swatches.map((shade) => {
          const isActive = shade.slug === active.slug
          return (
            <button
              key={shade.slug}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={`${shade.name} — ${shade.hex}`}
              onClick={() => setSelected(shade.slug)}
              className={cn(
                'group relative flex h-11 w-11 items-center justify-center rounded-full transition duration-300 ease-soft',
                'focus-visible:outline-offset-4',
                isActive ? 'scale-110' : 'hover:scale-105',
              )}
            >
              <span
                className={cn(
                  'absolute inset-0 rounded-full ring-offset-2 ring-offset-cream transition',
                  isActive ? 'ring-2 ring-plum' : 'ring-1 ring-plum/15 group-hover:ring-plum/35',
                )}
                aria-hidden="true"
              />
              <span
                className="h-[30px] w-[30px] rounded-full shadow-[inset_0_-3px_8px_rgba(36,16,56,.18)]"
                style={{ backgroundColor: shade.hex }}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.86rem]">
        <span className="font-semibold text-plum">{active.name}</span>
        <span className="ltr rounded-full bg-plum/5 px-2.5 py-0.5 text-[0.76rem] text-plum-soft">{active.hex}</span>
        <span className="text-[0.76rem] text-plum-mute">
          کد <span className="ltr">{active.code}</span>
        </span>
        <Link to={`/colors/${active.slug}`} className="link-arrow text-[0.82rem]">
          مشاهده رنگ
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
