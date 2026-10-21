import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart } from '../Icons'
import { RoomScene, rooms } from './RoomScene'
import { colorFamilies, colorShades, familyBySlug, productsForShade, shadeBySlug } from '../../data/catalog'
import { useFavorites } from '../../lib/favorites'
import { cn } from '../../lib/utils'

/**
 * Interactive colour studio: pick a family, pick a shade, and see it applied to
 * the wall region of an illustrated room. Wall masks are hand-authored per
 * scene — there is no automatic wall detection, and the copy says so.
 */
export function ColorStudio() {
  const [familySlug, setFamilySlug] = useState(colorFamilies[0].slug)
  const [shadeSlug, setShadeSlug] = useState('aftab-tamam')
  const [room, setRoom] = useState(rooms[0].id)
  const { toggle, has, favorites } = useFavorites()

  const family = familyBySlug(familySlug) ?? colorFamilies[0]
  const shades = useMemo(() => colorShades.filter((c) => c.familySlug === family.slug), [family.slug])
  const active = shadeBySlug(shadeSlug) ?? colorShades[0]
  const compatible = productsForShade(active.slug)
  const saved = has(active.slug)
  const favoriteShades = favorites.map(shadeBySlug).filter(Boolean)

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      {/* Scene */}
      <div className="order-2 lg:order-1">
        <div className="overflow-hidden rounded-panel border border-plum/10 bg-white shadow-soft">
          <RoomScene room={room} color={active.hex} className="block h-auto w-full" />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2" role="group" aria-label="انتخاب فضا">
            {rooms.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoom(r.id)}
                aria-pressed={room === r.id}
                className={cn('chip !min-h-[38px] text-[0.8rem]', room === r.id && 'chip-active')}
              >
                {r.name}
              </button>
            ))}
          </div>
          <p className="text-[0.72rem] text-plum-mute">{rooms.find((r) => r.id === room)?.note}</p>
        </div>

        <p className="mt-4 rounded-2xl bg-plum/5 px-4 py-3 text-[0.78rem] leading-relaxed text-plum-soft">
          رنگ نمایشگر تقریبی است؛ انتخاب نهایی را با نمونه فیزیکی انجام دهید.
        </p>
      </div>

      {/* Controls */}
      <div className="order-1 lg:order-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.75rem] font-medium text-plum-mute">رنگ انتخابی</p>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-[1.35rem] font-bold text-plum">
              {active.name}
              <span
                className="inline-block h-5 w-5 rounded-full ring-1 ring-plum/15"
                style={{ backgroundColor: active.hex }}
                aria-hidden="true"
              />
            </p>
            <p className="mt-1 text-[0.8rem] text-plum-mute">
              <span className="ltr">{active.code}</span>
              <span className="mx-2 text-plum/25">|</span>
              <span className="ltr">{active.hex}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggle(active.slug)}
            aria-pressed={saved}
            className={cn(
              'flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-[0.82rem] font-medium transition',
              saved
                ? 'border-coral bg-coral-soft text-plum'
                : 'border-plum/15 bg-white text-plum-soft hover:border-plum/30',
            )}
          >
            <Heart filled={saved} className={cn('h-4 w-4', saved && 'text-coral-deep')} />
            {saved ? 'ذخیره شد' : 'ذخیره رنگ'}
          </button>
        </div>

        <div className="mt-6 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar" role="tablist" aria-label="خانواده رنگ">
          {colorFamilies.map((f) => (
            <button
              key={f.slug}
              type="button"
              role="tab"
              aria-selected={f.slug === family.slug}
              onClick={() => setFamilySlug(f.slug)}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-2 text-[0.8rem] font-medium transition',
                f.slug === family.slug ? 'bg-plum text-cream' : 'bg-plum/5 text-plum-soft hover:bg-plum/10',
              )}
            >
              {f.name}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[0.8rem] leading-relaxed text-plum-mute">{family.blurb}</p>

        <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
          {shades.map((shade) => {
            const isActive = shade.slug === active.slug
            return (
              <li key={shade.slug}>
                <button
                  type="button"
                  onClick={() => setShadeSlug(shade.slug)}
                  aria-pressed={isActive}
                  className="group flex w-full flex-col items-center gap-1.5 rounded-2xl p-1.5 transition hover:bg-plum/5"
                  title={shade.name}
                >
                  <span
                    className={cn(
                      'block h-11 w-full rounded-xl ring-offset-2 ring-offset-cream transition',
                      isActive ? 'ring-2 ring-plum' : 'ring-1 ring-plum/10 group-hover:ring-plum/25',
                    )}
                    style={{ backgroundColor: shade.hex }}
                    aria-hidden="true"
                  />
                  <span className={cn('text-[0.68rem] leading-tight', isActive ? 'font-bold text-plum' : 'text-plum-mute')}>
                    {shade.name}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {compatible.length > 0 && (
          <div className="mt-6 rounded-2xl border border-plum/10 bg-white p-4">
            <p className="text-[0.8rem] font-semibold text-plum">محصولات سازگار با این رنگ</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {compatible.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/products/${p.slug}`}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-cream px-3 text-[0.78rem] text-plum-soft transition hover:bg-violet-soft hover:text-violet-deep"
                  >
                    {p.name}
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {favoriteShades.length > 0 && (
          <div className="mt-4">
            <p className="text-[0.78rem] font-medium text-plum-mute">رنگ‌های ذخیره‌شده</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {favoriteShades.map((shade) =>
                shade ? (
                  <li key={shade.slug}>
                    <button
                      type="button"
                      onClick={() => setShadeSlug(shade.slug)}
                      className="flex min-h-[38px] items-center gap-2 rounded-full border border-plum/15 bg-white pl-3 pr-1.5 text-[0.76rem] text-plum-soft hover:border-plum/30"
                    >
                      <span className="h-4 w-4 rounded-full ring-1 ring-plum/15" style={{ backgroundColor: shade.hex }} />
                      {shade.name}
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`حذف ${shade.name} از رنگ‌های ذخیره‌شده`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggle(shade.slug)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            e.stopPropagation()
                            toggle(shade.slug)
                          }
                        }}
                        className="ml-1 rounded-full p-1 text-plum/40 hover:text-coral-deep"
                      >
                        ×
                      </span>
                    </button>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
